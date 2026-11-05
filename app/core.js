/* 앱 핵심: 공통 함수 · 상태(localStorage) · 레슨 등록/로더 · 목차 · 라우터.
   모든 파일은 일반 <script>(모듈 아님)로 읽습니다. file:// 에서 ES 모듈은 막히기 때문입니다. */

/* ---------- helpers ---------- */
const $ = (s, el) => (el || document).querySelector(s);
const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const pad = n => String(n).padStart(2, '0');
const fmtD = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const today = () => fmtD(new Date());
const addDays = (ds, n) => { const [y, m, d] = ds.split('-').map(Number); return fmtD(new Date(y, m - 1, d + n)); };
const niceD = ds => { const [y, m, d] = ds.split('-').map(Number); return m + '월 ' + d + '일'; };
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const INTERVALS = [1, 3, 7, 14];
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2200); }

/* ---------- curriculum index ---------- */
// ALL: 커리큘럼의 모든 레슨 항목(파일 유무와 무관), 순서대로. LESSONS: 파일이 로드된 레슨만.
const ALL = CURRICULUM.flatMap(b => b.lessons.map(m => Object.assign({ block: b.id }, m)));
const META = Object.fromEntries(ALL.map(m => [m.id, m]));
const BLOCK = Object.fromEntries(CURRICULUM.map(b => [b.id, b]));
const EXAMS = Object.fromEntries(CURRICULUM.map(b => [b.exam.id, Object.assign({ block: b.id }, b.exam)]));
const LMAP = {};
let LESSONS = [];
let ALLTERMS = [];
let PENDING = null;

/* 레슨 파일이 호출하는 등록 함수 */
const OJT = {
  lesson(l) {
    const m = META[l.id];
    if (!m) { console.warn('curriculum.js 에 없는 레슨 id:', l.id); return; }
    LMAP[l.id] = Object.assign({}, m, l, { block: m.block });
  }
};

function loadLessons(done) {
  let left = ALL.length;
  const fin = () => { if (--left === 0) done(); };
  ALL.forEach(m => {
    const s = document.createElement('script');
    s.src = 'content/lessons/' + m.id + '.js';
    s.async = false;
    s.onload = fin;
    s.onerror = () => { s.remove(); fin(); }; // 아직 작성되지 않은 레슨 → 준비 중
    document.head.appendChild(s);
  });
}
function indexLessons() {
  LESSONS = ALL.filter(m => LMAP[m.id]).map(m => LMAP[m.id]);
  LESSONS.forEach(l => { l.essay = l.essay || []; l.quiz = l.quiz || []; l.terms = l.terms || []; l.summary = l.summary || []; l.goal = l.goal || []; });
  ALLTERMS = LESSONS.flatMap(l => l.terms.map((t, i) => ({ id: l.id + '-' + i, lid: l.id, term: t[0], en: t[1], def: t[2] })));
}
const lessonNo = id => ALL.findIndex(m => m.id === id) + 1;

/* ---------- state ---------- */
const KEY = 'zadara-ojt-7w-v1';
const defaults = () => ({ v: 1, guide: false, L: {}, cards: {}, exams: {}, term: { a: 0, b: 0, c: 0, d: 0 }, qn: [], ts: 0 });
let S = defaults();
function loadState(raw) {
  const o = Object.assign(defaults(), JSON.parse(raw));
  o.term = Object.assign({ a: 0, b: 0, c: 0, d: 0 }, o.term);
  return o;
}
try { const raw = localStorage.getItem(KEY); if (raw) S = loadState(raw); } catch (e) {}
function LP(id) {
  if (!S.L[id]) S.L[id] = { quiz: null, qlast: null, es: {}, et: {}, note: false, done: null, rv: null, tk: {} };
  if (!S.L[id].tk) S.L[id].tk = {};
  return S.L[id];
}
function setSync(t) { const el = $('#sync'); if (el) el.textContent = t; }
function save(quiet) {
  S.ts = Date.now();
  try { localStorage.setItem(KEY, JSON.stringify(S)); setSync('이 브라우저에 저장됨'); }
  catch (e) { setSync('저장 실패: 브라우저 저장소를 쓸 수 없음'); }
  if (!quiet) updateChrome();
}
function exportState() {
  const blob = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'zadara-ojt-진도-' + today() + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  toast('백업 파일을 내려받았습니다');
}
function importState(file) {
  const r = new FileReader();
  r.onload = () => {
    try {
      const o = loadState(r.result);
      if (!o.L || typeof o.L !== 'object') throw new Error('형식 오류');
      S = o; save(); route(); toast('백업에서 진도를 불러왔습니다');
    } catch (e) { toast('불러오기 실패: 이 앱의 백업 파일이 아닙니다'); }
  };
  r.readAsText(file);
}

/* ---------- lesson status ---------- */
function lstat(id) {
  const l = LMAP[id], p = LP(id);
  const quizOk = p.quiz != null && p.quiz >= 80;
  const graded = l.essay.filter((_, i) => p.es[i] != null).length;
  const essOk = graded === l.essay.length;
  const due = !!(p.rv && p.rv.next && p.rv.next <= today());
  return { quizOk, essOk, graded, note: !!p.note, done: !!p.done, due, p };
}
const doneCount = () => LESSONS.filter(l => LP(l.id).done).length;
function updateChrome() {
  const n = doneCount();
  $('#pbar').style.width = (n / ALL.length * 100) + '%';
  $('#pnum').textContent = n + ' / ' + ALL.length + ' 레슨';
  renderNav();
}

/* ---------- nav ---------- */
function renderNav() {
  const cur = (location.hash.slice(1) || 'home');
  const a = (id, dot, label, cls) => '<a class="nav-a' + (cur === id ? ' on' : '') + (cls ? ' ' + cls : '') + '" href="#' + id + '">' + dot + '<span>' + esc(label) + '</span></a>';
  const plain = '<span class="dot">·</span>', check = '<span class="dot done">✓</span>';
  let h = '<div class="nav-g"><h4>시작</h4>' + a('home', plain, '홈 · 진도') + a('guide', S.guide ? check : plain, '공부법 (먼저 읽기)') + '</div>';
  CURRICULUM.forEach(b => {
    h += '<div class="nav-g"><h4>' + esc(b.title) + '</h4>';
    b.lessons.forEach(m => {
      const l = LMAP[m.id];
      if (!l) { h += a(m.id, '<span class="dot">' + lessonNo(m.id) + '</span>', m.title, 'soon'); return; }
      const st = lstat(m.id);
      const dot = st.done ? (st.due ? '<span class="dot due" title="오늘 복습">!</span>' : check) : '<span class="dot">' + lessonNo(m.id) + '</span>';
      h += a(m.id, dot, l.title);
    });
    const ex = S.exams[b.exam.id];
    h += a(b.exam.id, ex && ex.best >= 80 ? check : '<span class="dot">✎</span>', b.exam.title, 'exam');
    h += '</div>';
  });
  const termDone = MSETS.every(m => (S.term[m] || 0) >= MISSIONS[m].items.length);
  const open = S.qn.filter(q => !q.done).length;
  h += '<div class="nav-g"><h4>셀프 테스트</h4>' + a('cards', plain, '용어 카드') + a('term', termDone ? check : plain, '연습 터미널') + '</div>';
  h += '<div class="nav-g"><h4>메모</h4>' + a('qnote', open ? '<span class="dot due">' + open + '</span>' : plain, '질문 노트') + '</div>';
  $('#nav').innerHTML = h;
}

/* ---------- router ---------- */
document.addEventListener('click', e => {
  const a = e.target.closest && e.target.closest('a[data-sec]'); if (!a) return;
  const target = a.getAttribute('href');
  if (location.hash === target) { e.preventDefault(); const el = document.getElementById(a.dataset.sec); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  else PENDING = a.dataset.sec;
});
// 화면 함수는 다른 파일에 있으므로 호출 시점에 찾습니다.
const VIEWS = () => ({ home: vHome, guide: vGuide, cards: vCards, term: vTerm, qnote: vQnote });
const VTITLE = { home: '홈', guide: '공부법', cards: '용어 카드', term: '연습 터미널', qnote: '질문 노트' };
function route(keepScroll) {
  let id = location.hash.slice(1) || 'home';
  let title;
  if (LMAP[id]) { vLesson(id); title = LMAP[id].title; }
  else if (META[id]) { vSoon(id); title = META[id].title + ' (준비 중)'; }
  else if (EXAMS[id]) { vExam(id); title = EXAMS[id].title; }
  else if (VIEWS()[id]) { VIEWS()[id](); title = VTITLE[id]; }
  else { id = 'home'; vHome(); title = VTITLE.home; }
  updateChrome();
  $('#nav').classList.remove('open'); $('#menuBtn').setAttribute('aria-expanded', 'false');
  if (!keepScroll) window.scrollTo(0, 0);
  if (PENDING) { const el = document.getElementById(PENDING); PENDING = null; if (el) setTimeout(() => el.scrollIntoView({ block: 'start' }), 30); }
  document.title = title + ' · Zadara OJT 학습장';
}

/* ---------- boot ---------- */
window.addEventListener('DOMContentLoaded', () => {
  $('#menuBtn').addEventListener('click', () => { const n = $('#nav'); const o = n.classList.toggle('open'); $('#menuBtn').setAttribute('aria-expanded', o); });
  loadLessons(() => {
    indexLessons();
    window.addEventListener('hashchange', () => route());
    route(true);
  });
});
