/* F4 原型 · 共享 JS：设备切换、暗色切换、Modal/Drawer 控制、Toast 通知。仅原型用，无业务逻辑。 */
(function(){
  'use strict';

  // ====== 设备切换 ======
  function setDevice(mode){
    var f = document.getElementById('protoFrame'); if(!f) return;
    f.classList.remove('desktop','mobile'); f.classList.add(mode);
    document.querySelectorAll('.dev-toggle button').forEach(function(b){
      b.classList.toggle('active', b.dataset.device === mode);
    });
    try { localStorage.setItem('zy.proto.device', mode); } catch(e){}
  }
  // ====== 主题切换 ======
  function setTheme(t){
    document.documentElement.setAttribute('data-theme', t);
    var btn = document.getElementById('themeBtn');
    if(btn) btn.textContent = (t === 'dark' ? '☀ 浅色' : '🌙 暗色');
    try { localStorage.setItem('zy.proto.theme', t); } catch(e){}
  }

  window.zyDevice = setDevice;
  window.zyTheme  = setTheme;

  function isAdminZhOnly(){
    try {
      var path = decodeURIComponent(window.location.pathname || '');
      if(/\/P-A-\d+-/.test(path) || /^P-A-\d+/.test(document.title || '')) return true;
      var brand = document.querySelector('.zy-topnav-brand');
      return !!(brand && brand.textContent.indexOf('管理后台') !== -1);
    } catch(e){ return false; }
  }
  window.zyIsAdminZhOnly = isAdminZhOnly;

  function currentUiLang(){
    if(isAdminZhOnly()) return 'zh';
    try { if(window.zyI18n && window.zyI18n.current) return window.zyI18n.current(); } catch(e){}
    try { return localStorage.getItem('zy.uiLang') || document.documentElement.getAttribute('data-ui-lang') || 'zh'; } catch(e){ return 'zh'; }
  }

  var TOAST_COPY = {
    'C9 overwrite=true：上一题答案可改写': ['C9 overwrite=true: previous answer can be edited', 'C9 overwrite=true: có thể sửa đáp án trước', 'C9 overwrite=true: แก้คำตอบข้อก่อนหน้าได้', 'C9 overwrite=true: jawaban sebelumnya bisa diubah'],
    'POST /lessons/:id/kp/:id/done → 进入第 9 个 KP': ['POST /lessons/:id/kp/:id/done -> go to KP 9', 'POST /lessons/:id/kp/:id/done -> sang KP 9', 'POST /lessons/:id/kp/:id/done -> ไป KP 9', 'POST /lessons/:id/kp/:id/done -> ke KP 9'],
    'POST /srs/answer → 第 6/32 题': ['POST /srs/answer -> question 6/32', 'POST /srs/answer -> câu 6/32', 'POST /srs/answer -> ข้อ 6/32', 'POST /srs/answer -> soal 6/32'],
    '← 上一个 KP': ['← Previous KP', '← KP trước', '← KP ก่อนหน้า', '← KP sebelumnya'],
    '← 上一题（已自动保存）': ['← Previous question (autosaved)', '← Câu trước (đã tự lưu)', '← ข้อก่อนหน้า (บันทึกอัตโนมัติแล้ว)', '← Soal sebelumnya (tersimpan otomatis)'],
    '举报已提交，将由内容运营审核': ['Report submitted. Content operations will review it.', 'Đã gửi báo cáo. Nhóm nội dung sẽ kiểm tra.', 'ส่งรายงานแล้ว ทีมเนื้อหาจะตรวจสอบ', 'Laporan dikirim. Tim konten akan meninjau.'],
    '切换主题：DL': ['Theme switched: DL', 'Đã đổi chủ đề: DL', 'สลับธีม: DL', 'Tema diganti: DL'],
    '切换主题：EC': ['Theme switched: EC', 'Đã đổi chủ đề: EC', 'สลับธีม: EC', 'Tema diganti: EC'],
    '切换主题：EC（写回 course_user_settings.current_track）': ['Theme switched: EC (saved to course_user_settings.current_track)', 'Đã đổi chủ đề: EC (lưu vào course_user_settings.current_track)', 'สลับธีม: EC (บันทึกใน course_user_settings.current_track)', 'Tema diganti: EC (disimpan ke course_user_settings.current_track)'],
    '切换主题：FC': ['Theme switched: FC', 'Đã đổi chủ đề: FC', 'สลับธีม: FC', 'Tema diganti: FC'],
    '切换主题：HSK': ['Theme switched: HSK', 'Đã đổi chủ đề: HSK', 'สลับธีม: HSK', 'Tema diganti: HSK'],
    '切换主题：share（基础公共）': ['Theme switched: share (shared basics)', 'Đã đổi chủ đề: share (cơ bản chung)', 'สลับธีม: share (พื้นฐานร่วม)', 'Tema diganti: share (dasar bersama)'],
    '切换主题：share（基础公共内容）': ['Theme switched: share (shared basics)', 'Đã đổi chủ đề: share (cơ bản chung)', 'สลับธีม: share (พื้นฐานร่วม)', 'Tema diganti: share (dasar bersama)'],
    '加载下一页（page 2，限制 20/页）': ['Load next page (page 2, 20 per page)', 'Tải trang tiếp theo (trang 2, 20 mỗi trang)', 'โหลดหน้าถัดไป (หน้า 2, 20 รายการต่อหน้า)', 'Muat halaman berikutnya (halaman 2, 20 per halaman)'],
    '已从错题本移除': ['Removed from mistake book', 'Đã xóa khỏi sổ lỗi', 'ลบออกจากสมุดข้อผิดแล้ว', 'Dihapus dari buku salah'],
    '已切换主题': ['Theme switched', 'Đã đổi chủ đề', 'สลับธีมแล้ว', 'Tema diganti'],
    '已切换语言（PATCH /me/settings）': ['Language saved (PATCH /me/settings)', 'Đã lưu ngôn ngữ (PATCH /me/settings)', 'บันทึกภาษาแล้ว (PATCH /me/settings)', 'Bahasa disimpan (PATCH /me/settings)'],
    '⭐ 已加入收藏（POST /me/favorites）': ['⭐ Added to favorites (POST /me/favorites)', '⭐ Đã thêm vào yêu thích (POST /me/favorites)', '⭐ เพิ่มในรายการโปรดแล้ว (POST /me/favorites)', '⭐ Ditambahkan ke favorit (POST /me/favorites)'],
    '🚩 已标记，可在题号面板筛选': ['🚩 Marked. Filter it in the question panel.', '🚩 Đã đánh dấu. Có thể lọc trong bảng câu hỏi.', '🚩 ทำเครื่องหมายแล้ว กรองได้ในแผงข้อสอบ', '🚩 Ditandai. Bisa difilter di panel soal.'],
    '已退出登录': ['Logged out', 'Đã đăng xuất', 'ออกจากระบบแล้ว', 'Sudah keluar'],
    '开始集中练习': ['Focused practice started', 'Bắt đầu luyện tập tập trung', 'เริ่มฝึกแบบรวมแล้ว', 'Latihan fokus dimulai'],
    '提交答题事件 → 进入下一题（4/6）': ['Answer submitted -> next question (4/6)', 'Đã gửi đáp án -> câu tiếp theo (4/6)', 'ส่งคำตอบแล้ว -> ข้อถัดไป (4/6)', 'Jawaban dikirim -> soal berikutnya (4/6)'],
    '播放 TTS（cdn://media/zaoshang.mp3）': ['Play TTS (cdn://media/zaoshang.mp3)', 'Phát TTS (cdn://media/zaoshang.mp3)', 'เล่น TTS (cdn://media/zaoshang.mp3)', 'Putar TTS (cdn://media/zaoshang.mp3)'],
    '播放例句 1': ['Play example 1', 'Phát ví dụ 1', 'เล่นตัวอย่าง 1', 'Putar contoh 1'],
    '播放例句 2': ['Play example 2', 'Phát ví dụ 2', 'เล่นตัวอย่าง 2', 'Putar contoh 2'],
    '🔊 播放音频': ['🔊 Play audio', '🔊 Phát âm thanh', '🔊 เล่นเสียง', '🔊 Putar audio'],
    '🔊 播放音频（剩余 2 次）': ['🔊 Play audio (2 left)', '🔊 Phát âm thanh (còn 2)', '🔊 เล่นเสียง (เหลือ 2)', '🔊 Putar audio (sisa 2)'],
    '本题已自动保存': ['This question was autosaved', 'Câu này đã tự lưu', 'ข้อนี้บันทึกอัตโนมัติแล้ว', 'Soal ini tersimpan otomatis'],
    '查看详情解析': ['View detailed analysis', 'Xem phân tích chi tiết', 'ดูคำอธิบายละเอียด', 'Lihat analisis detail'],
    '第 8 / 30 题': ['Question 8 / 30', 'Câu 8 / 30', 'ข้อ 8 / 30', 'Soal 8 / 30'],
    '筛选已应用': ['Filter applied', 'Đã áp dụng bộ lọc', 'ใช้ตัวกรองแล้ว', 'Filter diterapkan'],
    '设置已保存': ['Settings saved', 'Đã lưu cài đặt', 'บันทึกการตั้งค่าแล้ว', 'Pengaturan disimpan'],
    '详细解析（含每题答案）': ['Detailed analysis (with every answer)', 'Phân tích chi tiết (kèm đáp án từng câu)', 'คำอธิบายละเอียด (รวมคำตอบทุกข้อ)', 'Analisis detail (termasuk jawaban tiap soal)'],
    '跳过：本题不计入升降盒，重新入队': ['Skipped: this question does not affect the SRS box and is queued again', 'Bỏ qua: câu này không ảnh hưởng hộp SRS và được đưa lại vào hàng đợi', 'ข้ามแล้ว: ข้อนี้ไม่กระทบกล่อง SRS และจะเข้าคิวใหม่', 'Dilewati: soal ini tidak memengaruhi kotak SRS dan masuk antrean lagi'],
    '🔁 重新作答': ['🔁 Retry', '🔁 Làm lại', '🔁 ทำอีกครั้ง', '🔁 Kerjakan ulang']
  };

  function localizeToastMessage(msg){
    var lang = currentUiLang();
    var row = TOAST_COPY[msg];
    if(row){ return ({ zh: msg, en: row[0], vi: row[1], th: row[2], id: row[3] })[lang] || msg; }
    var jump = String(msg || '').match(/^跳转到第\s*(\d+)\s*题$/);
    if(jump){
      return ({ zh: '跳转到第 ' + jump[1] + ' 题', en: 'Jump to question ' + jump[1], vi: 'Chuyển đến câu ' + jump[1], th: 'ไปที่ข้อ ' + jump[1], id: 'Lompat ke soal ' + jump[1] })[lang] || msg;
    }
    var nav = String(msg || '').match(/^原型链接：(.+)$/);
    if(nav){
      return ({ zh: '原型链接：' + nav[1], en: 'Prototype link: ' + nav[1], vi: 'Liên kết prototype: ' + nav[1], th: 'ลิงก์ต้นแบบ: ' + nav[1], id: 'Tautan prototipe: ' + nav[1] })[lang] || msg;
    }
    return msg;
  }

  document.addEventListener('DOMContentLoaded', function(){
    // 初始化设备 / 主题
    var d = 'desktop'; var t = 'light';
    try { d = localStorage.getItem('zy.proto.device') || 'desktop'; t = localStorage.getItem('zy.proto.theme') || 'light'; } catch(e){}
    setDevice(d); setTheme(t);

    // 设备按钮
    document.querySelectorAll('.dev-toggle button').forEach(function(b){
      b.addEventListener('click', function(){ setDevice(b.dataset.device); });
    });
    // 主题按钮
    var tb = document.getElementById('themeBtn');
    if(tb) tb.addEventListener('click', function(){
      var cur = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(cur === 'dark' ? 'light' : 'dark');
    });

    // 全局：data-modal="modalId" 触发显示
    document.addEventListener('click', function(e){
      var m = e.target.closest('[data-open-modal]');
      if(m){ e.preventDefault(); zyModal.open(m.getAttribute('data-open-modal')); return; }
      var c = e.target.closest('[data-close-modal], .zy-modal-mask, .zy-drawer-mask');
      if(c){
        if(c.classList.contains('zy-modal-mask') && e.target !== c) return; // 点击内容不关
        if(c.classList.contains('zy-drawer-mask') && e.target !== c) return;
        e.preventDefault();
        var host = c.closest('.zy-modal-mask, .zy-drawer-mask');
        if(host) host.classList.remove('open');
      }
      var d = e.target.closest('[data-open-drawer]');
      if(d){ e.preventDefault(); zyModal.openDrawer(d.getAttribute('data-open-drawer')); return; }
      var nav = e.target.closest('[data-nav]');
      if(nav){ e.preventDefault(); zyToast('原型链接：'+nav.getAttribute('data-nav'),'info'); return; }
      var toast = e.target.closest('[data-toast]');
      if(toast){ e.preventDefault(); zyToast(toast.getAttribute('data-toast'), toast.getAttribute('data-toast-type')||'info'); return; }
    });

    // ESC 关闭
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape'){
        document.querySelectorAll('.zy-modal-mask.open, .zy-drawer-mask.open').forEach(function(el){
          el.classList.remove('open');
        });
      }
    });
  });

  // ====== Modal API ======
  window.zyModal = {
    open: function(id){ var el = document.getElementById(id); if(el) el.classList.add('open'); },
    close: function(id){ var el = document.getElementById(id); if(el) el.classList.remove('open'); },
    openDrawer: function(id){ var el = document.getElementById(id); if(el) el.classList.add('open'); },
    closeAll: function(){ document.querySelectorAll('.zy-modal-mask.open,.zy-drawer-mask.open').forEach(function(el){ el.classList.remove('open'); }); }
  };

  // ====== Toast ======
  window.zyToast = function(msg, type){
    type = type || 'info';
    var stack = document.getElementById('zyToastStack');
    if(!stack){ stack = document.createElement('div'); stack.id='zyToastStack'; stack.className='zy-toast-stack'; document.body.appendChild(stack); }
    var t = document.createElement('div'); t.className='zy-toast '+type; t.textContent = localizeToastMessage(msg);
    stack.appendChild(t);
    setTimeout(function(){ t.style.opacity='0'; t.style.transform='translateX(20px)'; t.style.transition='.25s'; }, 2500);
    setTimeout(function(){ t.remove(); }, 2900);
  };

  // ====== 简单 Tab 切换（class="zy-pills" 容器内） ======
  document.addEventListener('click', function(e){
    var p = e.target.closest('.zy-pills .zy-pill');
    if(p && p.parentElement.classList.contains('zy-pills')){
      p.parentElement.querySelectorAll('.zy-pill').forEach(function(x){ x.classList.remove('active'); });
      p.classList.add('active');
      // 如果有 data-tab-target，切换显示
      var tgt = p.getAttribute('data-tab');
      if(tgt){
        var group = p.getAttribute('data-tab-group') || 'tab';
        document.querySelectorAll('[data-tab-pane]').forEach(function(pane){
          if(pane.getAttribute('data-tab-group')===group) pane.style.display = (pane.getAttribute('data-tab-pane')===tgt) ? '' : 'none';
        });
      }
    }
  });

  // ====== Collapse ======
  document.addEventListener('click', function(e){
    var h = e.target.closest('[data-collapse]');
    if(h){ var id = h.getAttribute('data-collapse'); var b = document.getElementById(id);
      if(b){ var hide = b.style.display !== 'none'; b.style.display = hide ? 'none' : ''; var ic = h.querySelector('.caret'); if(ic) ic.textContent = hide ? '▶' : '▼'; } }
  });

})();

/* ====== SVG 图标助手（参考 system/web-app china 板块的简洁播放/暂停图标） ====== */
window.zyIcon = {
  play: '<svg class="zy-svg-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M4.5 2.5v11l9-5.5z"/></svg>',
  pause: '<svg class="zy-svg-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M4 2h3v12H4zM9 2h3v12H9z"/></svg>',
  speaker: '<svg class="zy-svg-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M3 6v4h2.5L9 13V3L5.5 6H3zm9.3 2c0-1.4-.8-2.6-2-3.2v6.4c1.2-.6 2-1.8 2-3.2z"/></svg>',
  flag: '<svg class="zy-svg-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M3 1h1.5v14H3zm2 1.5h7l-1.5 2L12 6.5H5z"/></svg>',
  globe: '<svg class="zy-svg-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12"/></svg>'
};

/* 自动渲染 [data-icon="play"] 等占位 */
document.addEventListener('DOMContentLoaded', function(){
  document.querySelectorAll('[data-icon]').forEach(function(el){
    var name = el.getAttribute('data-icon');
    if(window.zyIcon[name]) el.insertAdjacentHTML('afterbegin', window.zyIcon[name]);
  });
});

/* ============== 全局 i18n（应用端）==============
 * 5 语言：zh / en / vi / th / id（key 见 grules/F3-AI-页面交互规范/14-i18n规范.md）。
 * 用法：
 *   - 文本：<span data-i18n="btn.adopt">采纳</span>
 *   - 属性：<input data-i18n-attr="placeholder:search.placeholder" />
 *   - 学习内容翻译：data-zh="…" data-trans-en="…" data-trans-vi="…" data-trans-th="…" data-trans-id="…"
 *   - 切换控件：<input type="radio" data-set-lang="en">
 * 行为：
 *   - 切换后 localStorage 持久；apply 时同步勾选对应 radio 状态。
 *   - 未提供翻译 → fallback 到 zh。
 *   - UI=zh 时 .zy-trans-only 隐藏（CSS 控制）。
 */
/* 占位用 */
/* ============== 全局 i18n 字典 ============== */
(function(){
  function isAdminZhOnly(){
    try {
      if(window.zyIsAdminZhOnly) return window.zyIsAdminZhOnly();
      var path = decodeURIComponent(window.location.pathname || '');
      return /\/P-A-\d+-/.test(path) || /^P-A-\d+/.test(document.title || '');
    } catch(e){ return false; }
  }
  var Z = {
    zh: '中文', en: 'English', vi: 'Tiếng Việt', th: 'ภาษาไทย', id: 'Bahasa Indonesia'
  };
  var DICT = {
    zh: {
      'brand.learn':'学中文',
      'nav.learn':'学习','nav.me':'我的','nav.exams':'考试中心','nav.srs':'SRS 复习','nav.wrong':'错题本',
      'btn.save':'保存','btn.cancel':'取消','btn.confirm':'确认','btn.start':'开始',
      'btn.next':'下一题','btn.prev':'上一题','btn.submit':'提交','btn.close':'关闭',
      'btn.listen':'听音','btn.fav':'⭐ 收藏','btn.report':'举报','btn.retry':'重新作答',
      'btn.continue':'继续','btn.exit':'退出',
      'btn.adopt':'采纳','btn.dismiss':'驳回','btn.detail':'详情','btn.edit':'编辑',
      'btn.delete':'删除','btn.add':'新建','btn.import':'导入','btn.export':'导出',
      'btn.search':'搜索','btn.filter':'筛选','btn.reset':'重置','btn.more':'更多',
      'btn.viewAll':'全部 →','btn.startExam':'开始考试','btn.replay':'重考',
      'btn.history':'历史','btn.preview':'预览','btn.config':'配置','btn.viewKp':'查看 KP',
      'btn.remove':'移除','btn.mark':'🚩 标记','btn.pause':'⏸ 暂停','btn.submitAll':'提交全部',
      'btn.viewAnalysis':'查看解析','btn.backLearn':'返回学习','btn.viewWrong':'查看错题本',
      'btn.saveExit':'保存并退出','btn.continueExam':'继续答题','btn.confirmSubmit':'确认提交',
      'common.examples':'例句','common.progress':'进度','common.lock':'🔒 待解锁',
      'common.passed':'✓ 已通过','common.notPassed':'未通过','common.in_progress':'学习中',
      'common.score':'得分','common.passLine':'通过线','common.duration':'用时','common.result':'结果',
      'common.type':'类型','common.name':'名称','common.action':'操作','common.status':'状态',
      'common.diff':'难度','common.theme':'主题','common.stage':'阶段','common.chapter':'章','common.lesson':'节',
      'common.kp':'知识点','common.question':'题目','common.qty':'题量','common.minutes':'分钟',
      'common.answered':'已答','common.unanswered':'未答','common.times':'次',
      'common.daysAgo':'天前','common.recent':'最近','common.total':'共','common.all':'全部',
      'qt.listen_pick':'听音选词','qt.tone_pick':'选声调','qt.cloze':'完形填空',
      'qt.match':'配对','qt.order':'排序','qt.trans_zh_en':'中译外',
      'qt.read_choice':'阅读选择','qt.speak_repeat':'跟读','qt.write_dict':'听写',
      'page.learnMap':'学习地图','page.lesson':'节学习','page.quiz':'节末小测',
      'page.srs':'SRS 复习','page.wrong':'错题本','page.exams':'考试中心',
      'page.exam':'考试进行','page.me':'我的学习',
      'exam.chapter':'章测','exam.stage':'阶段考','exam.hsk':'HSK 模考','exam.lesson':'节末小测','exam.questionNav':'题号',
      'exam.startTip1':'本次考试 10 题 / 15 分钟，倒计时一旦开始不可暂停。',
      'exam.startTip2':'每题作答后可改答；提交后无法修改。',
      'exam.startTip3':'断网会自动保存草稿，恢复后可继续。',
      'modal.langTitle':'界面语言','modal.startExam':'开始考试',
      'settings.title':'个人设置','settings.dailySrsCap':'每日 SRS 上限',
      'settings.theme':'主题','settings.themeAuto':'跟随系统','settings.themeLight':'浅色','settings.themeDark':'暗色',
      'settings.logout':'↪ 退出登录',
      'theme.share':'🌱 基础','theme.ec':'🛒 电商','theme.fc':'🏭 工厂','theme.hsk':'📘 HSK','theme.dl':'☕ 日常',
      'srs.title':'SRS · 今日复习','wrong.title':'错题本',
      'wrong.sub':'最近 90 天答错的题目','wrong.dynTip':'筛选项为动态生成：当某主题 / 题型下存在错题才会出现。','wrong.searchPh':'🔍 搜索题面 / KP',
      'me.title':'📊 我的学习','me.kpMastered':'已掌握 KP','me.lessonsDone':'完成节',
      'me.streak':'连续打卡','me.srsDue':'SRS 待复习','me.recentExam':'📝 最近考试',
      'me.heat7':'📈 近 7 天活跃','me.heat30':'🗓 近 30 天打卡','me.studyDays':'已学习',
      'me.currentTheme':'当前主题','me.openSrs':'立即复习'
    },
    en: {
      'brand.learn':'Learn Chinese',
      'nav.learn':'Learn','nav.me':'Me','nav.exams':'Exams','nav.srs':'SRS','nav.wrong':'Mistakes',
      'btn.save':'Save','btn.cancel':'Cancel','btn.confirm':'Confirm','btn.start':'Start',
      'btn.next':'Next','btn.prev':'Previous','btn.submit':'Submit','btn.close':'Close',
      'btn.listen':'Listen','btn.fav':'⭐ Favorite','btn.report':'Report','btn.retry':'Retry',
      'btn.continue':'Continue','btn.exit':'Exit',
      'btn.adopt':'Accept','btn.dismiss':'Dismiss','btn.detail':'Details','btn.edit':'Edit',
      'btn.delete':'Delete','btn.add':'New','btn.import':'Import','btn.export':'Export',
      'btn.search':'Search','btn.filter':'Filter','btn.reset':'Reset','btn.more':'More',
      'btn.viewAll':'View all →','btn.startExam':'Start exam','btn.replay':'Retake',
      'btn.history':'History','btn.preview':'Preview','btn.config':'Configure','btn.viewKp':'View KP',
      'btn.remove':'Remove','btn.mark':'🚩 Mark','btn.pause':'⏸ Pause','btn.submitAll':'Submit all',
      'btn.viewAnalysis':'View analysis','btn.backLearn':'Back to learn','btn.viewWrong':'View mistakes',
      'btn.saveExit':'Save & exit','btn.continueExam':'Continue','btn.confirmSubmit':'Confirm submit',
      'common.examples':'Examples','common.progress':'Progress','common.lock':'🔒 Locked',
      'common.passed':'✓ Passed','common.notPassed':'Failed','common.in_progress':'Learning',
      'common.score':'Score','common.passLine':'Pass line','common.duration':'Time','common.result':'Result',
      'common.type':'Type','common.name':'Name','common.action':'Action','common.status':'Status',
      'common.diff':'Difficulty','common.theme':'Theme','common.stage':'Stage','common.chapter':'Chapter','common.lesson':'Lesson',
      'common.kp':'KP','common.question':'Question','common.qty':'Count','common.minutes':'min',
      'common.answered':'Done','common.unanswered':'Pending','common.times':'×',
      'common.daysAgo':'days ago','common.recent':'Recent','common.total':'total','common.all':'All',
      'qt.listen_pick':'Listen & pick','qt.tone_pick':'Pick tone','qt.cloze':'Cloze',
      'qt.match':'Match','qt.order':'Order','qt.trans_zh_en':'Translate',
      'qt.read_choice':'Reading','qt.speak_repeat':'Speak','qt.write_dict':'Dictation',
      'page.learnMap':'Learning Map','page.lesson':'Lesson','page.quiz':'Lesson Quiz',
      'page.srs':'SRS Review','page.wrong':'Mistake Book','page.exams':'Exam Center',
      'page.exam':'Exam','page.me':'My Learning',
      'exam.chapter':'Chapter test','exam.stage':'Stage exam','exam.hsk':'HSK mock','exam.lesson':'Lesson quiz','exam.questionNav':'Question numbers',
      'exam.startTip1':'10 questions / 15 minutes. Timer cannot be paused once started.',
      'exam.startTip2':'You can change answers before submitting; locked after submit.',
      'exam.startTip3':'Offline drafts auto-save and resume on reconnect.',
      'modal.langTitle':'Interface language','modal.startExam':'Start exam',
      'settings.title':'Settings','settings.dailySrsCap':'Daily SRS cap',
      'settings.theme':'Theme','settings.themeAuto':'System','settings.themeLight':'Light','settings.themeDark':'Dark',
      'settings.logout':'↪ Log out',
      'theme.share':'🌱 Basics','theme.ec':'🛒 E-commerce','theme.fc':'🏭 Factory','theme.hsk':'📘 HSK','theme.dl':'☕ Daily',
      'srs.title':'SRS · Today','wrong.title':'Mistake Book',
      'wrong.sub':'Wrong answers from last 90 days','wrong.dynTip':'Filters appear only when mistakes exist for that theme / type.','wrong.searchPh':'🔍 Search stem / KP',
      'me.title':'📊 My Learning','me.kpMastered':'KP mastered','me.lessonsDone':'Lessons done',
      'me.streak':'Streak','me.srsDue':'SRS due','me.recentExam':'📝 Recent exams',
      'me.heat7':'📈 Last 7 days','me.heat30':'🗓 Last 30 days','me.studyDays':'studied',
      'me.currentTheme':'Current theme','me.openSrs':'Review now'
    },
    vi: {
      'brand.learn':'Học tiếng Trung',
      'nav.learn':'Học','nav.me':'Tôi','nav.exams':'Kỳ thi','nav.srs':'Ôn SRS','nav.wrong':'Sổ lỗi',
      'btn.save':'Lưu','btn.cancel':'Huỷ','btn.confirm':'Xác nhận','btn.start':'Bắt đầu',
      'btn.next':'Tiếp','btn.prev':'Trước','btn.submit':'Nộp','btn.close':'Đóng',
      'btn.listen':'Nghe','btn.fav':'⭐ Yêu thích','btn.report':'Báo cáo','btn.retry':'Làm lại',
      'btn.continue':'Tiếp tục','btn.exit':'Thoát',
      'btn.adopt':'Chấp nhận','btn.dismiss':'Bỏ qua','btn.detail':'Chi tiết','btn.edit':'Sửa',
      'btn.delete':'Xoá','btn.add':'Thêm','btn.import':'Nhập','btn.export':'Xuất',
      'btn.search':'Tìm','btn.filter':'Lọc','btn.reset':'Đặt lại','btn.more':'Thêm',
      'btn.viewAll':'Xem hết →','btn.startExam':'Bắt đầu thi','btn.replay':'Thi lại',
      'btn.history':'Lịch sử','btn.preview':'Xem trước','btn.config':'Cấu hình','btn.viewKp':'Xem KP',
      'btn.remove':'Xoá','btn.mark':'🚩 Đánh dấu','btn.pause':'⏸ Tạm dừng','btn.submitAll':'Nộp hết',
      'btn.viewAnalysis':'Xem giải','btn.backLearn':'Về học','btn.viewWrong':'Xem sổ lỗi',
      'btn.saveExit':'Lưu & thoát','btn.continueExam':'Tiếp tục','btn.confirmSubmit':'Xác nhận nộp',
      'common.examples':'Ví dụ','common.progress':'Tiến độ','common.lock':'🔒 Khoá',
      'common.passed':'✓ Đã qua','common.notPassed':'Chưa qua','common.in_progress':'Đang học',
      'common.score':'Điểm','common.passLine':'Đạt','common.duration':'Thời gian','common.result':'Kết quả',
      'common.type':'Loại','common.name':'Tên','common.action':'Thao tác','common.status':'Trạng thái',
      'common.diff':'Độ khó','common.theme':'Chủ đề','common.stage':'Giai đoạn','common.chapter':'Chương','common.lesson':'Bài',
      'common.kp':'KP','common.question':'Câu hỏi','common.qty':'Số câu','common.minutes':'phút',
      'common.answered':'Đã trả lời','common.unanswered':'Chưa','common.times':'lần',
      'common.daysAgo':'ngày trước','common.recent':'Gần đây','common.total':'tổng','common.all':'Tất cả',
      'qt.listen_pick':'Nghe & chọn','qt.tone_pick':'Chọn thanh điệu','qt.cloze':'Điền chỗ trống',
      'qt.match':'Ghép','qt.order':'Sắp xếp','qt.trans_zh_en':'Dịch',
      'qt.read_choice':'Đọc hiểu','qt.speak_repeat':'Nói theo','qt.write_dict':'Chính tả',
      'page.learnMap':'Lộ trình','page.lesson':'Bài học','page.quiz':'Kiểm tra bài',
      'page.srs':'Ôn SRS','page.wrong':'Sổ lỗi','page.exams':'Trung tâm thi',
      'page.exam':'Đang thi','page.me':'Học tập của tôi',
      'exam.chapter':'KT chương','exam.stage':'Thi giai đoạn','exam.hsk':'HSK thử','exam.lesson':'KT bài','exam.questionNav':'Số câu hỏi',
      'exam.startTip1':'10 câu / 15 phút. Đồng hồ chạy thì không thể tạm dừng.',
      'exam.startTip2':'Có thể đổi đáp án trước khi nộp; sau khi nộp không sửa được.',
      'exam.startTip3':'Khi mất mạng tự lưu nháp, có thể tiếp tục.',
      'modal.langTitle':'Ngôn ngữ giao diện','modal.startExam':'Bắt đầu thi',
      'settings.title':'Cài đặt','settings.dailySrsCap':'Giới hạn SRS/ngày',
      'settings.theme':'Giao diện','settings.themeAuto':'Theo hệ thống','settings.themeLight':'Sáng','settings.themeDark':'Tối',
      'settings.logout':'↪ Đăng xuất',
      'theme.share':'🌱 Cơ bản','theme.ec':'🛒 TMĐT','theme.fc':'🏭 Nhà máy','theme.hsk':'📘 HSK','theme.dl':'☕ Hằng ngày',
      'srs.title':'SRS · Hôm nay','wrong.title':'Sổ lỗi',
      'wrong.sub':'Câu sai trong 90 ngày qua','wrong.dynTip':'Bộ lọc chỉ hiện khi có lỗi cho chủ đề / loại đó.','wrong.searchPh':'🔍 Tìm câu hỏi / KP',
      'me.title':'📊 Học tập','me.kpMastered':'KP đã thuộc','me.lessonsDone':'Bài đã học',
      'me.streak':'Chuỗi','me.srsDue':'SRS chờ ôn','me.recentExam':'📝 Thi gần đây',
      'me.heat7':'📈 7 ngày qua','me.heat30':'🗓 30 ngày qua','me.studyDays':'đã học',
      'me.currentTheme':'Chủ đề hiện tại','me.openSrs':'Ôn ngay'
    },
    th: {
      'brand.learn':'เรียนภาษาจีน',
      'nav.learn':'เรียน','nav.me':'ฉัน','nav.exams':'สอบ','nav.srs':'ทบทวน','nav.wrong':'สมุดผิด',
      'btn.save':'บันทึก','btn.cancel':'ยกเลิก','btn.confirm':'ยืนยัน','btn.start':'เริ่ม',
      'btn.next':'ถัดไป','btn.prev':'ก่อนหน้า','btn.submit':'ส่ง','btn.close':'ปิด',
      'btn.listen':'ฟัง','btn.fav':'⭐ ชอบ','btn.report':'รายงาน','btn.retry':'ลองใหม่',
      'btn.continue':'ทำต่อ','btn.exit':'ออก',
      'btn.adopt':'ยอมรับ','btn.dismiss':'ปฏิเสธ','btn.detail':'รายละเอียด','btn.edit':'แก้ไข',
      'btn.delete':'ลบ','btn.add':'เพิ่ม','btn.import':'นำเข้า','btn.export':'ส่งออก',
      'btn.search':'ค้นหา','btn.filter':'กรอง','btn.reset':'รีเซ็ต','btn.more':'เพิ่มเติม',
      'btn.viewAll':'ทั้งหมด →','btn.startExam':'เริ่มสอบ','btn.replay':'สอบใหม่',
      'btn.history':'ประวัติ','btn.preview':'ดูตัวอย่าง','btn.config':'ตั้งค่า','btn.viewKp':'ดู KP',
      'btn.remove':'ลบออก','btn.mark':'🚩 ทำเครื่องหมาย','btn.pause':'⏸ หยุด','btn.submitAll':'ส่งทั้งหมด',
      'btn.viewAnalysis':'ดูเฉลย','btn.backLearn':'กลับไปเรียน','btn.viewWrong':'ดูสมุดผิด',
      'btn.saveExit':'บันทึก & ออก','btn.continueExam':'ทำต่อ','btn.confirmSubmit':'ยืนยันส่ง',
      'common.examples':'ตัวอย่าง','common.progress':'ความคืบหน้า','common.lock':'🔒 ล็อค',
      'common.passed':'✓ ผ่าน','common.notPassed':'ไม่ผ่าน','common.in_progress':'กำลังเรียน',
      'common.score':'คะแนน','common.passLine':'ผ่าน','common.duration':'เวลา','common.result':'ผล',
      'common.type':'ประเภท','common.name':'ชื่อ','common.action':'จัดการ','common.status':'สถานะ',
      'common.diff':'ความยาก','common.theme':'ธีม','common.stage':'ขั้น','common.chapter':'บท','common.lesson':'บทเรียน',
      'common.kp':'KP','common.question':'คำถาม','common.qty':'จำนวน','common.minutes':'นาที',
      'common.answered':'ตอบแล้ว','common.unanswered':'ยัง','common.times':'ครั้ง',
      'common.daysAgo':'วันก่อน','common.recent':'ล่าสุด','common.total':'รวม','common.all':'ทั้งหมด',
      'qt.listen_pick':'ฟังเลือก','qt.tone_pick':'เลือกวรรณยุกต์','qt.cloze':'เติมคำ',
      'qt.match':'จับคู่','qt.order':'เรียง','qt.trans_zh_en':'แปล',
      'qt.read_choice':'อ่านเลือก','qt.speak_repeat':'พูดตาม','qt.write_dict':'ฝึกเขียน',
      'page.learnMap':'แผนการเรียน','page.lesson':'บทเรียน','page.quiz':'ทดสอบบท',
      'page.srs':'ทบทวน','page.wrong':'สมุดผิด','page.exams':'ศูนย์สอบ',
      'page.exam':'กำลังสอบ','page.me':'การเรียนของฉัน',
      'exam.chapter':'สอบบท','exam.stage':'สอบขั้น','exam.hsk':'HSK ทดลอง','exam.lesson':'สอบย่อย','exam.questionNav':'เลขข้อ',
      'exam.startTip1':'10 ข้อ / 15 นาที เริ่มแล้วหยุดไม่ได้',
      'exam.startTip2':'แก้คำตอบได้ก่อนส่ง; ส่งแล้วแก้ไม่ได้',
      'exam.startTip3':'ออฟไลน์บันทึกอัตโนมัติ ต่อได้เมื่อกลับมา',
      'modal.langTitle':'ภาษาอินเทอร์เฟซ','modal.startExam':'เริ่มสอบ',
      'settings.title':'ตั้งค่า','settings.dailySrsCap':'SRS ต่อวันสูงสุด',
      'settings.theme':'ธีม','settings.themeAuto':'ตามระบบ','settings.themeLight':'สว่าง','settings.themeDark':'มืด',
      'settings.logout':'↪ ออกจากระบบ',
      'theme.share':'🌱 พื้นฐาน','theme.ec':'🛒 อีคอม','theme.fc':'🏭 โรงงาน','theme.hsk':'📘 HSK','theme.dl':'☕ ชีวิตประจำวัน',
      'srs.title':'SRS · วันนี้','wrong.title':'สมุดผิด',
      'wrong.sub':'ข้อผิด 90 วันล่าสุด','wrong.dynTip':'ตัวกรองจะแสดงเฉพาะธีม/ประเภทที่มีข้อผิด','wrong.searchPh':'🔍 ค้นหาโจทย์ / KP',
      'me.title':'📊 การเรียนของฉัน','me.kpMastered':'KP เชี่ยวชาญ','me.lessonsDone':'บทที่ทำ',
      'me.streak':'ติดต่อกัน','me.srsDue':'SRS รอทบทวน','me.recentExam':'📝 สอบล่าสุด',
      'me.heat7':'📈 7 วันล่าสุด','me.heat30':'🗓 30 วันล่าสุด','me.studyDays':'เรียนแล้ว',
      'me.currentTheme':'ธีมปัจจุบัน','me.openSrs':'ทบทวนทันที'
    },
    id: {
      'brand.learn':'Belajar Mandarin',
      'nav.learn':'Belajar','nav.me':'Saya','nav.exams':'Ujian','nav.srs':'SRS','nav.wrong':'Buku Salah',
      'btn.save':'Simpan','btn.cancel':'Batal','btn.confirm':'Konfirmasi','btn.start':'Mulai',
      'btn.next':'Lanjut','btn.prev':'Kembali','btn.submit':'Kirim','btn.close':'Tutup',
      'btn.listen':'Dengar','btn.fav':'⭐ Favorit','btn.report':'Laporkan','btn.retry':'Ulangi',
      'btn.continue':'Lanjut','btn.exit':'Keluar',
      'btn.adopt':'Terima','btn.dismiss':'Tolak','btn.detail':'Detail','btn.edit':'Ubah',
      'btn.delete':'Hapus','btn.add':'Baru','btn.import':'Impor','btn.export':'Ekspor',
      'btn.search':'Cari','btn.filter':'Saring','btn.reset':'Reset','btn.more':'Lainnya',
      'btn.viewAll':'Semua →','btn.startExam':'Mulai ujian','btn.replay':'Ulang ujian',
      'btn.history':'Riwayat','btn.preview':'Pratinjau','btn.config':'Konfigurasi','btn.viewKp':'Lihat KP',
      'btn.remove':'Hapus','btn.mark':'🚩 Tandai','btn.pause':'⏸ Jeda','btn.submitAll':'Kirim semua',
      'btn.viewAnalysis':'Lihat analisis','btn.backLearn':'Kembali','btn.viewWrong':'Lihat buku salah',
      'btn.saveExit':'Simpan & keluar','btn.continueExam':'Lanjut','btn.confirmSubmit':'Konfirmasi kirim',
      'common.examples':'Contoh','common.progress':'Kemajuan','common.lock':'🔒 Terkunci',
      'common.passed':'✓ Lulus','common.notPassed':'Gagal','common.in_progress':'Belajar',
      'common.score':'Skor','common.passLine':'Lulus','common.duration':'Durasi','common.result':'Hasil',
      'common.type':'Tipe','common.name':'Nama','common.action':'Aksi','common.status':'Status',
      'common.diff':'Kesulitan','common.theme':'Tema','common.stage':'Tahap','common.chapter':'Bab','common.lesson':'Pelajaran',
      'common.kp':'KP','common.question':'Soal','common.qty':'Jumlah','common.minutes':'menit',
      'common.answered':'Selesai','common.unanswered':'Belum','common.times':'×',
      'common.daysAgo':'hari lalu','common.recent':'Terbaru','common.total':'total','common.all':'Semua',
      'qt.listen_pick':'Dengar & pilih','qt.tone_pick':'Pilih nada','qt.cloze':'Isi rumpang',
      'qt.match':'Cocokkan','qt.order':'Urutkan','qt.trans_zh_en':'Terjemah',
      'qt.read_choice':'Bacaan','qt.speak_repeat':'Tirukan','qt.write_dict':'Dikte',
      'page.learnMap':'Peta Belajar','page.lesson':'Pelajaran','page.quiz':'Kuis Pelajaran',
      'page.srs':'SRS','page.wrong':'Buku Salah','page.exams':'Pusat Ujian',
      'page.exam':'Sedang Ujian','page.me':'Belajar Saya',
      'exam.chapter':'Tes Bab','exam.stage':'Ujian Tahap','exam.hsk':'HSK Latihan','exam.lesson':'Kuis','exam.questionNav':'Nomor soal',
      'exam.startTip1':'10 soal / 15 menit. Timer mulai tidak bisa dijeda.',
      'exam.startTip2':'Jawaban dapat diubah sebelum dikirim; setelah dikirim terkunci.',
      'exam.startTip3':'Saat offline draft tersimpan otomatis, lanjut saat tersambung.',
      'modal.langTitle':'Bahasa antarmuka','modal.startExam':'Mulai ujian',
      'settings.title':'Pengaturan','settings.dailySrsCap':'Batas SRS harian',
      'settings.theme':'Tema','settings.themeAuto':'Sistem','settings.themeLight':'Terang','settings.themeDark':'Gelap',
      'settings.logout':'↪ Keluar',
      'theme.share':'🌱 Dasar','theme.ec':'🛒 E-commerce','theme.fc':'🏭 Pabrik','theme.hsk':'📘 HSK','theme.dl':'☕ Harian',
      'srs.title':'SRS · Hari ini','wrong.title':'Buku Salah',
      'wrong.sub':'Salah 90 hari terakhir','wrong.dynTip':'Filter muncul hanya saat ada kesalahan untuk tema / tipe.','wrong.searchPh':'🔍 Cari soal / KP',
      'me.title':'📊 Belajar Saya','me.kpMastered':'KP dikuasai','me.lessonsDone':'Pelajaran selesai',
      'me.streak':'Streak','me.srsDue':'SRS menunggu','me.recentExam':'📝 Ujian terbaru',
      'me.heat7':'📈 7 hari','me.heat30':'🗓 30 hari','me.studyDays':'belajar',
      'me.currentTheme':'Tema saat ini','me.openSrs':'Tinjau sekarang'
    }
  };
  window.zyI18nDict = DICT;

  function getLang(){
    if(isAdminZhOnly()) return 'zh';
    try { return localStorage.getItem('zy.uiLang') || 'zh'; } catch(e){ return 'zh'; }
  }

  function applyAttrs(el, lang, dict, fb){
    var a = el.getAttribute('data-i18n-attr'); if(!a) return;
    a.split(';').forEach(function(pair){
      var p = pair.split(':'); if(p.length !== 2) return;
      var attr = p[0].trim(), key = p[1].trim();
      var v = dict[key] != null ? dict[key] : fb[key];
      if(v != null) el.setAttribute(attr, v);
    });
  }

  window.zyI18n = {
    langLabels: Z,
    current: getLang,
    set: function(lang){
      if(isAdminZhOnly()) lang = 'zh';
      try { if(!isAdminZhOnly()) localStorage.setItem('zy.uiLang', lang); } catch(e){}
      document.documentElement.setAttribute('data-ui-lang', lang);
      this.apply(lang);
      // 同步所有 [data-set-lang] radio 的勾选状态（任意页面、任意位置）
      document.querySelectorAll('input[type="radio"][data-set-lang]').forEach(function(r){
        r.checked = (r.getAttribute('data-set-lang') === lang);
      });
      // 更新顶栏语言徽章
      document.querySelectorAll('[data-lang-label]').forEach(function(el){
        el.textContent = Z[lang] || lang;
      });
    },
    apply: function(lang){
      var dict = DICT[lang] || {};
      var fb = DICT.zh || {};
      document.querySelectorAll('[data-i18n]').forEach(function(el){
        var key = el.getAttribute('data-i18n');
        var v = dict[key] != null ? dict[key] : fb[key];
        if(v != null) el.textContent = v;
      });
      document.querySelectorAll('[data-i18n-attr]').forEach(function(el){
        applyAttrs(el, lang, dict, fb);
      });
      document.querySelectorAll('[data-trans-en]').forEach(function(el){
        if(lang === 'zh'){
          if(el.dataset.zh) el.textContent = el.dataset.zh;
        } else {
          var v = el.getAttribute('data-trans-' + lang);
          if(v) el.textContent = v;
          else if(el.dataset.zh) el.textContent = el.dataset.zh;
        }
      });
    },
    initSwitcher: function(){
      var self = this;
      document.addEventListener('click', function(e){
        var b = e.target.closest('[data-set-lang]');
        if(b){
          // 不阻止 radio 默认勾选
          var lang = b.getAttribute('data-set-lang');
          self.set(lang);
          if(window.zyToast) zyToast('✓ ' + (Z[lang] || lang), 'success');
          var m = b.closest('.zy-modal-mask, .zy-drawer-mask'); if(m) m.classList.remove('open');
        }
      });
    }
  };

  document.addEventListener('DOMContentLoaded', function(){
    var lang = getLang();
    document.documentElement.setAttribute('data-ui-lang', lang);
    window.zyI18n.set(lang); // 这一步会同步 radio + label + 应用文案
    window.zyI18n.initSwitcher();
  });
})();
