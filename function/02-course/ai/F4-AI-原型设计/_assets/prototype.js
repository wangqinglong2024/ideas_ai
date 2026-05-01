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
    var t = document.createElement('div'); t.className='zy-toast '+type; t.textContent = msg;
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
 * 5 语言：zh / en / vi / th / id。
 * 用法：在文本节点上加 data-i18n="某 key"，并把翻译映射写在 window.zyI18nDict[lang][key]。
 * 兜底：未提供翻译时 fallback 到 zh。
 * UI 语言挂在 <html data-ui-lang="xx">，CSS 用此选择隐藏 .zy-trans-only。
 * 当 UI = zh，所有学习内容的翻译（.zy-trans-only）都隐藏；其他语言则显示。
 */
window.zyI18nDict = window.zyI18nDict || {
  zh: {
    'brand.learn': '学中文',
    'nav.learn': '学习', 'nav.me': '我的', 'nav.exams': '考试中心',
    'nav.srs': 'SRS 复习', 'nav.wrong': '错题本', 'nav.lang': '中文',
    'btn.save': '保存', 'btn.cancel': '取消', 'btn.confirm': '确认', 'btn.start': '开始',
    'btn.next': '下一题', 'btn.prev': '上一题', 'btn.submit': '提交', 'btn.close': '关闭',
    'btn.listen': '听音', 'btn.fav': '⭐ 收藏', 'btn.report': '举报', 'btn.retry': '重新作答',
    'btn.continue': '继续', 'btn.exit': '退出',
    'common.examples': '例句', 'common.progress': '进度', 'common.lock': '🔒 待解锁',
    'common.passed': '✓ 已通过', 'common.in_progress': '学习中', 'common.score': '得分',
    'common.passLine': '通过线', 'common.duration': '用时', 'common.result': '结果',
    'theme.share': '🌱 基础', 'theme.ec': '🛒 电商', 'theme.fc': '🏭 工厂',
    'theme.hsk': '📘 HSK', 'theme.dl': '☕ 日常',
    'page.learnMap': '学习地图', 'page.lesson': '节学习', 'page.quiz': '节末小测',
    'page.srs': 'SRS 复习', 'page.wrong': '错题本', 'page.exams': '考试中心',
    'page.exam': '考试进行', 'page.me': '我的学习'
  },
  en: {
    'brand.learn': 'Learn Chinese',
    'nav.learn': 'Learn', 'nav.me': 'Me', 'nav.exams': 'Exam Center',
    'nav.srs': 'SRS', 'nav.wrong': 'Mistakes', 'nav.lang': 'English',
    'btn.save': 'Save', 'btn.cancel': 'Cancel', 'btn.confirm': 'Confirm', 'btn.start': 'Start',
    'btn.next': 'Next', 'btn.prev': 'Previous', 'btn.submit': 'Submit', 'btn.close': 'Close',
    'btn.listen': 'Listen', 'btn.fav': '⭐ Favorite', 'btn.report': 'Report', 'btn.retry': 'Retry',
    'btn.continue': 'Continue', 'btn.exit': 'Exit',
    'common.examples': 'Examples', 'common.progress': 'Progress', 'common.lock': '🔒 Locked',
    'common.passed': '✓ Passed', 'common.in_progress': 'Learning', 'common.score': 'Score',
    'common.passLine': 'Pass', 'common.duration': 'Time', 'common.result': 'Result',
    'theme.share': '🌱 Basics', 'theme.ec': '🛒 E-commerce', 'theme.fc': '🏭 Factory',
    'theme.hsk': '📘 HSK', 'theme.dl': '☕ Daily',
    'page.learnMap': 'Learning Map', 'page.lesson': 'Lesson', 'page.quiz': 'Lesson Quiz',
    'page.srs': 'SRS Review', 'page.wrong': 'Mistake Book', 'page.exams': 'Exam Center',
    'page.exam': 'Exam', 'page.me': 'My Learning'
  },
  vi: {
    'brand.learn': 'Học tiếng Trung',
    'nav.learn': 'Học', 'nav.me': 'Tôi', 'nav.exams': 'Trung tâm thi',
    'nav.srs': 'Ôn SRS', 'nav.wrong': 'Sổ lỗi', 'nav.lang': 'Tiếng Việt',
    'btn.save': 'Lưu', 'btn.cancel': 'Huỷ', 'btn.confirm': 'Xác nhận', 'btn.start': 'Bắt đầu',
    'btn.next': 'Tiếp', 'btn.prev': 'Trước', 'btn.submit': 'Nộp', 'btn.close': 'Đóng',
    'btn.listen': 'Nghe', 'btn.fav': '⭐ Yêu thích', 'btn.report': 'Báo cáo', 'btn.retry': 'Làm lại',
    'btn.continue': 'Tiếp tục', 'btn.exit': 'Thoát',
    'common.examples': 'Ví dụ', 'common.progress': 'Tiến độ', 'common.lock': '🔒 Khoá',
    'common.passed': '✓ Đã qua', 'common.in_progress': 'Đang học', 'common.score': 'Điểm',
    'common.passLine': 'Đạt', 'common.duration': 'Thời gian', 'common.result': 'Kết quả',
    'theme.share': '🌱 Cơ bản', 'theme.ec': '🛒 TMĐT', 'theme.fc': '🏭 Nhà máy',
    'theme.hsk': '📘 HSK', 'theme.dl': '☕ Hằng ngày',
    'page.learnMap': 'Lộ trình', 'page.lesson': 'Bài học', 'page.quiz': 'Kiểm tra bài',
    'page.srs': 'Ôn SRS', 'page.wrong': 'Sổ lỗi', 'page.exams': 'Trung tâm thi',
    'page.exam': 'Đang thi', 'page.me': 'Học tập của tôi'
  },
  th: {
    'brand.learn': 'เรียนภาษาจีน',
    'nav.learn': 'เรียน', 'nav.me': 'ของฉัน', 'nav.exams': 'ศูนย์สอบ',
    'nav.srs': 'ทบทวน SRS', 'nav.wrong': 'สมุดผิด', 'nav.lang': 'ภาษาไทย',
    'btn.save': 'บันทึก', 'btn.cancel': 'ยกเลิก', 'btn.confirm': 'ยืนยัน', 'btn.start': 'เริ่ม',
    'btn.next': 'ถัดไป', 'btn.prev': 'ก่อนหน้า', 'btn.submit': 'ส่ง', 'btn.close': 'ปิด',
    'btn.listen': 'ฟัง', 'btn.fav': '⭐ ชอบ', 'btn.report': 'รายงาน', 'btn.retry': 'ลองใหม่',
    'btn.continue': 'ทำต่อ', 'btn.exit': 'ออก',
    'common.examples': 'ตัวอย่าง', 'common.progress': 'ความคืบหน้า', 'common.lock': '🔒 ล็อค',
    'common.passed': '✓ ผ่านแล้ว', 'common.in_progress': 'กำลังเรียน', 'common.score': 'คะแนน',
    'common.passLine': 'ผ่าน', 'common.duration': 'เวลา', 'common.result': 'ผล',
    'theme.share': '🌱 พื้นฐาน', 'theme.ec': '🛒 อีคอม', 'theme.fc': '🏭 โรงงาน',
    'theme.hsk': '📘 HSK', 'theme.dl': '☕ ชีวิตประจำวัน',
    'page.learnMap': 'แผนการเรียน', 'page.lesson': 'บทเรียน', 'page.quiz': 'แบบทดสอบบท',
    'page.srs': 'ทบทวน SRS', 'page.wrong': 'สมุดผิด', 'page.exams': 'ศูนย์สอบ',
    'page.exam': 'กำลังสอบ', 'page.me': 'การเรียนของฉัน'
  },
  id: {
    'brand.learn': 'Belajar Mandarin',
    'nav.learn': 'Belajar', 'nav.me': 'Saya', 'nav.exams': 'Pusat Ujian',
    'nav.srs': 'Tinjau SRS', 'nav.wrong': 'Buku Salah', 'nav.lang': 'Bahasa Indonesia',
    'btn.save': 'Simpan', 'btn.cancel': 'Batal', 'btn.confirm': 'Konfirmasi', 'btn.start': 'Mulai',
    'btn.next': 'Berikutnya', 'btn.prev': 'Sebelumnya', 'btn.submit': 'Kirim', 'btn.close': 'Tutup',
    'btn.listen': 'Dengar', 'btn.fav': '⭐ Favorit', 'btn.report': 'Laporkan', 'btn.retry': 'Ulangi',
    'btn.continue': 'Lanjut', 'btn.exit': 'Keluar',
    'common.examples': 'Contoh', 'common.progress': 'Kemajuan', 'common.lock': '🔒 Terkunci',
    'common.passed': '✓ Lulus', 'common.in_progress': 'Sedang belajar', 'common.score': 'Skor',
    'common.passLine': 'Lulus', 'common.duration': 'Durasi', 'common.result': 'Hasil',
    'theme.share': '🌱 Dasar', 'theme.ec': '🛒 E-commerce', 'theme.fc': '🏭 Pabrik',
    'theme.hsk': '📘 HSK', 'theme.dl': '☕ Harian',
    'page.learnMap': 'Peta Belajar', 'page.lesson': 'Pelajaran', 'page.quiz': 'Kuis Pelajaran',
    'page.srs': 'Tinjau SRS', 'page.wrong': 'Buku Salah', 'page.exams': 'Pusat Ujian',
    'page.exam': 'Sedang Ujian', 'page.me': 'Belajar Saya'
  }
};

window.zyI18n = {
  langLabels: { zh: '中文', en: 'English', vi: 'Tiếng Việt', th: 'ภาษาไทย', id: 'Bahasa Indonesia' },
  current: function(){
    try { return localStorage.getItem('zy.uiLang') || 'zh'; } catch(e){ return 'zh'; }
  },
  set: function(lang){
    try { localStorage.setItem('zy.uiLang', lang); } catch(e){}
    document.documentElement.setAttribute('data-ui-lang', lang);
    this.apply(lang);
    // 更新顶栏语言徽章
    document.querySelectorAll('[data-lang-label]').forEach(function(el){
      el.textContent = window.zyI18n.langLabels[lang] || lang;
    });
  },
  apply: function(lang){
    var dict = (window.zyI18nDict && window.zyI18nDict[lang]) || {};
    var fallback = window.zyI18nDict && window.zyI18nDict.zh || {};
    document.querySelectorAll('[data-i18n]').forEach(function(el){
      var key = el.getAttribute('data-i18n');
      var v = dict[key] != null ? dict[key] : fallback[key];
      if(v != null) el.textContent = v;
    });
    // 内容翻译：data-trans-en="..." data-trans-vi="..." data-trans-th="..." data-trans-id="..."
    // 配合 data-zh="..."（中文原文）。当 UI 语言 ≠ zh 时显示对应 data-trans-xx；UI=zh 时显示 data-zh 原文（且 .zy-trans-only 隐藏）。
    document.querySelectorAll('[data-trans-en]').forEach(function(el){
      if(lang === 'zh'){
        if(el.dataset.zh) el.textContent = el.dataset.zh;
      } else {
        var v = el.getAttribute('data-trans-' + lang);
        if(v) el.textContent = v;
      }
    });
  },
  initSwitcher: function(){
    var self = this;
    document.addEventListener('click', function(e){
      var b = e.target.closest('[data-set-lang]');
      if(b){ e.preventDefault(); self.set(b.getAttribute('data-set-lang')); zyToast('已切换语言：' + (self.langLabels[b.getAttribute('data-set-lang')] || b.getAttribute('data-set-lang')), 'success');
        // 关闭可能的语言模态
        var m = b.closest('.zy-modal-mask, .zy-drawer-mask'); if(m) m.classList.remove('open');
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', function(){
  var lang = window.zyI18n.current();
  document.documentElement.setAttribute('data-ui-lang', lang);
  window.zyI18n.apply(lang);
  document.querySelectorAll('[data-lang-label]').forEach(function(el){
    el.textContent = window.zyI18n.langLabels[lang] || lang;
  });
  window.zyI18n.initSwitcher();
});
