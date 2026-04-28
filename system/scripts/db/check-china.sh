#!/usr/bin/env bash
# 发现中国（Discover China）数据层自检
# 使用主机 supabase-db 容器内置 psql；不依赖宿主机安装 postgresql-client。
#
# 自检维度：
#   1) 三张表存在 + 字段 + 约束
#   2) RLS 启用 + 策略名命中
#   3) 12 个类目种子已到位
#   4) RPC 函数存在 + fn_gen_article_code 输出符合正则
#   5) 端到端：插文章 → 插 3 句 → 发布 → 软删 → 校验状态
#
# 出现任何错误立即 exit 1。
set -euo pipefail

CONTAINER="${SUPABASE_DB_CONTAINER:-supabase-db}"
DB_USER="${POSTGRES_USER:-supabase_admin}"
DB_NAME="${POSTGRES_DB:-postgres}"

psql_exec() {
  docker exec -i "$CONTAINER" psql -X -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 "$@"
}

scalar() {
  # $1 = SQL；输出去掉首尾空格
  psql_exec -At -c "$1"
}

ok()   { printf "  \033[32m✔\033[0m %s\n" "$*"; }
fail() { printf "  \033[31m✘\033[0m %s\n" "$*"; exit 1; }

echo "==== [1/6] 检查表 / 列 / 约束 ===="
for t in china_categories china_articles china_sentences; do
  exists=$(scalar "select to_regclass('zhiyu.$t') is not null")
  [[ "$exists" == "t" ]] || fail "表 zhiyu.$t 不存在"
  ok "表 zhiyu.$t 存在"
done

# 关键约束抽查
declare -a EXPECTED_CONSTRAINTS=(
  "china_categories|uq_china_categories_code"
  "china_categories|ck_china_categories_code_format"
  "china_categories|ck_china_categories_name_i18n_keys"
  "china_articles|fk_china_articles_category_id"
  "china_articles|ck_china_articles_status"
  "china_articles|ck_china_articles_published_at_consistency"
  "china_sentences|fk_china_sentences_article_id"
  "china_sentences|ck_china_sentences_audio_status"
  "china_sentences|ck_china_sentences_audio_url_when_ready"
)
for kv in "${EXPECTED_CONSTRAINTS[@]}"; do
  IFS='|' read -r tbl con <<<"$kv"
  found=$(scalar "select count(*) from pg_constraint where conname='$con' and conrelid='zhiyu.$tbl'::regclass")
  [[ "$found" == "1" ]] || fail "约束 $con 缺失（$tbl）"
done
ok "9 项关键 CHECK / FK / UNIQUE 约束齐备"

# 关键索引
for idx in uq_china_articles_code uq_china_sentences_article_seq idx_china_articles_published_at idx_china_sentences_audio_status; do
  found=$(scalar "select count(*) from pg_indexes where schemaname='zhiyu' and indexname='$idx'")
  [[ "$found" == "1" ]] || fail "索引 $idx 缺失"
done
ok "4 个关键索引存在"

echo
echo "==== [2/6] 检查 RLS + 策略 ===="
for t in china_categories china_articles china_sentences; do
  rls=$(scalar "select relrowsecurity from pg_class where oid='zhiyu.$t'::regclass")
  [[ "$rls" == "t" ]] || fail "$t 未启用 RLS"
done
ok "三张表 RLS 已启用"
for p in china_categories_select_public china_articles_select_published china_sentences_select_published; do
  found=$(scalar "select count(*) from pg_policies where schemaname='zhiyu' and policyname='$p'")
  [[ "$found" == "1" ]] || fail "策略 $p 缺失"
done
ok "3 条 select 策略命中"

echo
echo "==== [3/6] 检查类目种子（12 条固定） ===="
cnt=$(scalar "select count(*) from zhiyu.china_categories")
[[ "$cnt" == "12" ]] || fail "类目数应为 12，实际 $cnt"
ok "类目数 = 12"
sorted_codes=$(scalar "select string_agg(code, ',' order by sort_order) from zhiyu.china_categories")
[[ "$sorted_codes" == "01,02,03,04,05,06,07,08,09,10,11,12" ]] || fail "类目 code 顺序错误：$sorted_codes"
ok "类目按 sort_order 升序：$sorted_codes"
missing=$(scalar "select count(*) from zhiyu.china_categories where not (name_i18n ?& array['zh','en','vi','th','id'])")
[[ "$missing" == "0" ]] || fail "$missing 行 name_i18n 缺少语言键"
ok "全部 12 行 5 语言键完整"

echo
echo "==== [4/6] 检查 RPC 函数 ===="
for fn in set_updated_at fn_gen_article_code fn_next_sentence_seq fn_resequence_sentences fn_publish_article fn_unpublish_article fn_delete_article fn_clear_progress_by_article; do
  found=$(scalar "select count(*) from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='zhiyu' and p.proname='$fn'")
  [[ "$found" -ge "1" ]] || fail "函数 zhiyu.$fn 缺失"
done
ok "8 个 RPC / 辅助函数齐备"
gen=$(scalar "select zhiyu.fn_gen_article_code()")
[[ "$gen" =~ ^[A-Z0-9]{12}$ ]] || fail "fn_gen_article_code 输出不合法：$gen"
# 字符集校验：剔除 I O 0 1
[[ "$gen" =~ [IO01] ]] && fail "fn_gen_article_code 含禁用字符：$gen"
ok "fn_gen_article_code 输出合法：$gen"

echo
echo "==== [5/6] 端到端冒烟（事务回滚，不污染数据） ===="
psql_exec <<'SQL'
\set ON_ERROR_STOP on
begin;

  -- 取一个类目
  with cat as (select id from zhiyu.china_categories where code = '01')
  insert into zhiyu.china_articles (code, category_id, title_pinyin, title_i18n, status)
  select zhiyu.fn_gen_article_code(), cat.id,
         'zì jiǎn cè zhāng',
         '{"zh":"自检文章","en":"Self-Check","vi":"Tự kiểm","th":"ตรวจสอบ","id":"Pemeriksaan"}'::jsonb,
         'draft'
  from cat;

  -- 试图直接发布草稿（应失败：无句子）
  do $$
  declare v_id uuid; v_msg text;
  begin
    select id into v_id from zhiyu.china_articles
      where title_i18n->>'zh'='自检文章' order by created_at desc limit 1;
    begin
      perform zhiyu.fn_publish_article(v_id);
      raise exception 'EXPECTED_FAILURE_NOT_RAISED';
    exception when others then
      get stacked diagnostics v_msg = message_text;
      if v_msg <> 'CHINA_ARTICLE_PUBLISH_NO_SENTENCES' then
        raise exception 'unexpected error: %', v_msg;
      end if;
      raise notice '[smoke] 拒绝空文章发布: %', v_msg;
    end;
  end $$;

  -- 插 3 条句子
  do $$
  declare v_id uuid; v_seq int; i int;
  begin
    select id into v_id from zhiyu.china_articles
      where title_i18n->>'zh'='自检文章' order by created_at desc limit 1;
    for i in 1..3 loop
      v_seq := zhiyu.fn_next_sentence_seq(v_id);
      insert into zhiyu.china_sentences
        (article_id, seq_no, pinyin, content_zh, content_en, content_vi, content_th, content_id)
      values
        (v_id, v_seq,
         'cè shì jù zi ' || i,
         '测试句子 ' || i,
         'Test sentence ' || i,
         'Câu thử ' || i,
         'ประโยคทดสอบ ' || i,
         'Kalimat uji ' || i);
    end loop;
    raise notice '[smoke] 插入 3 条句子';
  end $$;

  -- 发布（这次应成功）
  do $$
  declare v_id uuid; v_status text;
  begin
    select id into v_id from zhiyu.china_articles
      where title_i18n->>'zh'='自检文章' order by created_at desc limit 1;
    perform zhiyu.fn_publish_article(v_id);
    select status into v_status from zhiyu.china_articles where id = v_id;
    if v_status <> 'published' then
      raise exception 'publish 后状态应为 published, 实际=%', v_status;
    end if;
    raise notice '[smoke] 发布成功';
  end $$;

  -- 重排：删一句中间，再 resequence
  do $$
  declare v_id uuid; v_max int; v_cnt int;
  begin
    select id into v_id from zhiyu.china_articles
      where title_i18n->>'zh'='自检文章' order by created_at desc limit 1;
    update zhiyu.china_sentences set deleted_at = now()
      where article_id = v_id and seq_no = 2;
    perform zhiyu.fn_resequence_sentences(v_id);
    select max(seq_no), count(*) into v_max, v_cnt
      from zhiyu.china_sentences where article_id = v_id and deleted_at is null;
    if v_max <> 2 or v_cnt <> 2 then
      raise exception 'resequence 失败 max=%, cnt=%', v_max, v_cnt;
    end if;
    raise notice '[smoke] 重排后剩 % 条，max seq=%', v_cnt, v_max;
  end $$;

  -- 下架 + 软删
  do $$
  declare v_id uuid; v_status text; v_deleted timestamptz;
  begin
    select id into v_id from zhiyu.china_articles
      where title_i18n->>'zh'='自检文章' order by created_at desc limit 1;
    perform zhiyu.fn_unpublish_article(v_id);
    perform zhiyu.fn_delete_article(v_id);
    select status, deleted_at into v_status, v_deleted
      from zhiyu.china_articles where id = v_id;
    if v_status <> 'draft' or v_deleted is null then
      raise exception 'delete 后 status=% deleted_at=%', v_status, v_deleted;
    end if;
    raise notice '[smoke] 下架 + 软删 OK';
  end $$;

rollback;
SQL
ok "端到端冒烟通过（已 rollback，无残留数据）"

echo
echo "==== [6/6] anon 角色 RLS 验证 ===="
# anon 不能看到 draft；只能看到 published
psql_exec <<'SQL' >/dev/null
\set ON_ERROR_STOP on
begin;
  with cat as (select id from zhiyu.china_categories where code = '02')
  insert into zhiyu.china_articles (code, category_id, title_pinyin, title_i18n, status)
  select zhiyu.fn_gen_article_code(), cat.id, 'cǎo gǎo',
         '{"zh":"草稿RLS","en":"DraftRLS","vi":"NhápRLS","th":"แบบร่างRLS","id":"DrafRLS"}'::jsonb,
         'draft' from cat;
  set local role anon;
  do $$
  declare v_visible int;
  begin
    select count(*) into v_visible from zhiyu.china_articles
      where title_i18n->>'zh' = '草稿RLS';
    if v_visible <> 0 then
      raise exception 'anon 不应看到 draft 文章, 实际可见=%', v_visible;
    end if;
  end $$;
rollback;
SQL
ok "anon 角色对 draft 文章不可见（RLS 生效）"

echo
echo "🎉 发现中国数据层自检全部通过。"
