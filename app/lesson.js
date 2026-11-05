/* 레슨 화면: 목표 · 일정표 항목 · 용어 · 본문 · 핵심 정리 · 셀프체크 · 퀴즈 · 실습 체크리스트 · 완료/복습.
   레슨 데이터 형식은 content/lessons/*.js 참고. quiz의 o[0]이 정답(화면에서는 섞어서 보여줌). */

function pagerHTML(id) {
  const idx = ALL.findIndex(m => m.id === id), b = BLOCK[META[id].block];
  const prev = ALL[idx - 1], next = ALL[idx + 1];
  const isLast = b.lessons[b.lessons.length - 1].id === id;
  return '<div class="pager">' +
    (prev ? '<a class="btn" href="#' + prev.id + '">← ' + esc((LMAP[prev.id] || prev).title) + '</a>' : '<a class="btn" href="#guide">← 공부법</a>') +
    (isLast ? '<a class="btn" href="#' + b.exam.id + '">' + esc(b.exam.title) + ' →</a>' : next ? '<a class="btn" href="#' + next.id + '">' + esc((LMAP[next.id] || next).title) + ' →</a>' : '') + '</div>';
}

/* 아직 파일이 없는 레슨 */
function vSoon(id) {
  const m = META[id];
  let h = '<div class="eyebrow">' + esc(m.tag) + ' · 준비 중</div><h1>' + esc(m.title) + '</h1>';
  h += '<div class="box" style="margin-top:16px"><b class="small">교육일정표' + (m.day ? ' 일차 ' + m.day : '') + '</b><ul style="margin-bottom:0">' +
    (m.items ? '<li><b>주요 학습 항목:</b> ' + esc(m.items) + '</li>' : '') + (m.act ? '<li><b>학습 확인 / 활동:</b> ' + esc(m.act) + '</li>' : '') + '</ul></div>';
  h += '<p class="muted">이 레슨은 아직 작성 중입니다. 파일이 <code>content/lessons/' + esc(id) + '.js</code> 에 추가되면 자동으로 나타납니다.</p>';
  h += pagerHTML(id);
  $('#view').innerHTML = h;
}

function vLesson(id) {
  const l = LMAP[id], st = lstat(id), p = st.p;
  let h = '<div class="eyebrow">' + esc(l.tag) + (l.mins ? ' · ' + esc(l.mins) : '') + '</div><h1>' + esc(l.title) + '</h1>';
  h += '<div class="box" style="margin-top:16px"><b class="small">오늘이 끝나면 할 수 있어야 하는 것</b><ul style="margin-bottom:0">' + l.goal.map(g => '<li>' + esc(g) + '</li>').join('') + '</ul></div>';
  if (st.due) h += '<div class="box warn"><span class="lbl">오늘은 이 레슨의 복습일입니다 (' + (p.rv.stage + 1) + '번째 복습)</span><ol><li>빈 종이에 이 레슨에서 기억나는 것을 3분 동안 적기</li><li>아래 "핵심 정리"를 펼쳐 비교하고, 빠진 것만 본문에서 다시 읽기</li><li>퀴즈 다시 풀기 (80점 이상)</li></ol><div class="btn-row"><button class="btn pri" id="rvDone">복습 완료</button></div></div>';
  if (l.cover) h += '<div class="box"><b class="small">교육일정표' + (l.day ? ' 일차 ' + l.day : '') + '에서 이 레슨이 다루는 항목</b> <span class="small muted">(누르면 해당 절로 이동)</span><div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">' +
    l.cover.map(c => '<a class="chip acc" style="text-decoration:none" href="#' + id + '" data-jump="' + c[1] + '">' + esc(c[0]) + '</a>').join('') + '</div>' +
    (l.act ? '<p class="small" style="margin:10px 0 0"><b>학습 확인 / 활동:</b> ' + esc(l.act) + ' → 아래 <a href="#' + id + '" data-jump="essay">셀프체크</a>' + (l.tasks ? ' · <a href="#' + id + '" data-jump="tasks">실습 체크리스트</a>' : '') + (MISSION_OF[id] ? ' · 연습 터미널 <a href="#term">미션 ' + MISSION_OF[id].toUpperCase() + '</a>' : '') + '</p>' : '') + '</div>';
  const steps = [['terms', '용어 미리보기'], ['s1', '본문 읽기'], ['sum', '핵심 정리'], ['essay', '셀프체크'], ['quiz', '퀴즈']].concat(l.tasks ? [['tasks', '실습']] : [], [['finish', '완료']]);
  h += '<ol class="steps">' + steps.map(s => '<li><a href="#' + id + '" data-jump="' + s[0] + '">' + s[1] + '</a></li>').join('') + '</ol>';
  h += '<h2 id="terms">오늘 나오는 용어</h2><p class="small muted">본문을 읽기 전에 한 번 훑으세요. 지금 다 외울 필요는 없습니다. 본문에서 이 말들이 다시 설명됩니다.</p><dl class="terms">' +
    l.terms.map(t => '<div class="term"><dt>' + esc(t[0]) + '<small>' + esc(t[1]) + '</small></dt><dd>' + esc(t[2]) + '</dd></div>').join('') + '</dl>';
  h += l.body || '';
  h += '<h2 id="sum">핵심 정리: 손노트에 옮겨 쓰기</h2><p>펼치기 <b>전에</b> 이 레슨의 핵심을 손노트에 먼저 떠올려 쓰세요. 그다음 펼쳐서 비교하고, 빠진 것을 파란 펜으로 보충합니다.</p>' +
    '<div class="sum" id="sumBox"><span class="pen">손노트에 옮겨 쓸 것</span><div id="sumBody" hidden><ol>' + l.summary.map(s => '<li>' + esc(s) + '</li>').join('') + '</ol></div><div class="btn-row" id="sumBtnRow"><button class="btn" id="sumBtn">떠올려 썼어요, 펼치기</button></div></div>';
  h += '<h2 id="essay">셀프체크: 말로 설명하기</h2><p>질문마다 <b>먼저 소리 내서 설명</b>해 보고, 짧게 적은 뒤, 모범 답안과 비교해 스스로 채점하세요. 단어가 조금 달라도 핵심이 같으면 ○입니다.</p><div id="essays"></div>';
  h += '<h2 id="quiz">퀴즈</h2><p class="small muted">문제와 보기 순서는 매번 섞입니다. 80점 이상이면 통과.</p><div id="quizBox"></div>';
  if (l.tasks) h += '<h2 id="tasks">실습 체크리스트</h2><p class="small muted">실습 환경에서 직접 한 단계만 체크하세요. 결과 화면·명령어 출력은 작업 로그에 남겨 산출물의 재료로 씁니다.</p><div id="taskBox"></div>';
  h += '<h2 id="finish">레슨 완료</h2><div id="finBox"></div>';
  h += pagerHTML(id);
  const v = $('#view'); v.innerHTML = h;

  $$('[data-jump]', v).forEach(a => a.addEventListener('click', e => { e.preventDefault(); const t = document.getElementById(a.dataset.jump); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }));
  $('#sumBtn').onclick = () => { $('#sumBody').hidden = false; $('#sumBtnRow').hidden = true; };
  if ($('#rvDone')) $('#rvDone').onclick = () => {
    p.rv.stage++; p.rv.next = p.rv.stage < INTERVALS.length ? addDays(today(), INTERVALS[p.rv.stage]) : null;
    save(); toast(p.rv.next ? '복습 완료. 다음 복습: ' + niceD(p.rv.next) : '이 레슨의 복습 일정을 모두 마쳤습니다'); route(true);
  };
  mountWidgets(v);
  renderEssays(l, p);
  renderLessonQuiz(l, p);
  if (l.tasks) renderTasks(l, p);
  renderFinish(l);
}

function renderEssays(l, p) {
  const box = $('#essays');
  box.innerHTML = l.essay.map((e, i) => {
    const g = p.es[i];
    return '<div class="q es" data-i="' + i + '"><div class="q-h"><span class="qn">Q' + (i + 1) + '</span><span>' + esc(e.q) + '</span></div>' +
      '<label class="small muted" for="et-' + l.id + '-' + i + '" style="display:block;margin-top:8px">내 답 (짧게, 내 말로)</label>' +
      '<textarea id="et-' + l.id + '-' + i + '" placeholder="소리 내서 설명해 본 뒤 적어 보세요">' + esc(p.et[i] || '') + '</textarea>' +
      '<div class="btn-row"><button class="btn sm" data-act="show">' + (g != null ? '모범 답안 다시 보기' : '모범 답안 보기') + '</button></div>' +
      '<div class="model" hidden>' + esc(e.a) + '</div>' +
      '<div class="grade" ' + (g == null ? 'hidden' : '') + '><span class="small muted">스스로 채점:</span>' +
      [[2, '○ 설명할 수 있다'], [1, '△ 일부만'], [0, '× 못 했다']].map(([k, t]) => '<button class="g' + k + (g === k ? ' on' : '') + '" data-g="' + k + '">' + t + '</button>').join('') + '</div></div>';
  }).join('');
  $$('.es', box).forEach(el => {
    const i = +el.dataset.i, ta = $('textarea', el);
    let t; ta.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { p.et[i] = ta.value; save(true); }, 600); });
    $('[data-act="show"]', el).onclick = () => { $('.model', el).hidden = !$('.model', el).hidden; $('.grade', el).hidden = false; };
    $$('[data-g]', el).forEach(b => b.onclick = () => {
      p.es[i] = +b.dataset.g; $$('[data-g]', el).forEach(x => x.classList.toggle('on', x === b)); save(); renderFinish(l);
      if (+b.dataset.g < 2) toast('막힌 부분은 본문을 다시 읽고, 질문 노트에도 적어 두세요');
    });
  });
}

/* 레슨 퀴즈: 즉시 피드백 */
function renderLessonQuiz(l, p) {
  const box = $('#quizBox');
  const qs = shuffle(l.quiz.map((q, i) => ({ ...q, i })));
  let answered = 0, correct = 0;
  box.innerHTML = qs.map((q, n) => {
    const opts = shuffle(q.o.map((t, k) => ({ t, ok: k === 0 })));
    q._opts = opts;
    return '<div class="q" data-n="' + n + '"><div class="q-h"><span class="qn">' + (n + 1) + '.</span><span>' + esc(q.q) + '</span></div><div class="opts">' +
      opts.map((o, k) => '<button class="opt" data-k="' + k + '">' + esc(o.t) + '</button>').join('') + '</div><div class="expl" hidden></div></div>';
  }).join('') + '<div id="qScore"></div>';
  $$('.q', box).forEach(el => {
    const q = qs[+el.dataset.n];
    $$('.opt', el).forEach(b => b.onclick = () => {
      const k = +b.dataset.k, ok = q._opts[k].ok;
      $$('.opt', el).forEach((x, j) => { x.disabled = true; if (q._opts[j].ok) x.classList.add('ok'); });
      if (!ok) b.classList.add('no');
      const ex = $('.expl', el); ex.hidden = false;
      ex.innerHTML = (ok ? '<b class="ok">정답입니다.</b> ' : '<b class="no">아쉬워요.</b> ') + esc(q.e);
      answered++; if (ok) correct++;
      if (answered === qs.length) {
        const sc = Math.round(correct / qs.length * 100);
        p.qlast = sc; p.quiz = Math.max(p.quiz || 0, sc); save(); renderFinish(l);
        const pass = sc >= 80;
        $('#qScore').innerHTML = '<div class="box" style="border-color:' + (pass ? 'var(--good)' : 'var(--bad)') + '"><div class="score"><span class="big">' + sc + '</span><div><b>' + correct + ' / ' + qs.length + ' 정답</b><br><span class="small">' + (pass ? '통과입니다. 틀린 문제의 해설은 손노트에 한 줄씩 적어 두세요.' : '80점 미만입니다. 틀린 문제와 관련된 본문을 다시 읽고 재도전하세요.') + '</span></div></div><div class="btn-row"><button class="btn sm" id="qAgain">다시 풀기 (순서 섞기)</button></div></div>';
        $('#qAgain').onclick = () => { renderLessonQuiz(l, p); $('#quiz').scrollIntoView({ behavior: 'smooth' }); };
      }
    });
  });
}

/* 실습 체크리스트: tasks:[{title, items:[...]}] , 체크 상태는 S.L[id].tk['그룹-항목'] */
function renderTasks(l, p) {
  const box = $('#taskBox');
  box.innerHTML = l.tasks.map((g, gi) => {
    const doneN = g.items.filter((_, ii) => p.tk[gi + '-' + ii]).length;
    return '<div class="done-box" style="margin-bottom:14px"><p style="margin-top:0"><b>' + esc(g.title) + '</b> <span class="small muted">' + doneN + ' / ' + g.items.length + '</span></p>' +
      g.items.map((t, ii) => { const k = gi + '-' + ii, on = !!p.tk[k]; return '<div class="cond' + (on ? ' ok' : '') + '"><span class="ck">' + (on ? '✓' : ii + 1) + '</span><div><label><input type="checkbox" data-tk="' + k + '" ' + (on ? 'checked' : '') + '> ' + esc(t) + '</label></div></div>'; }).join('') +
      (g.note ? '<p class="small muted" style="margin-bottom:0">' + esc(g.note) + '</p>' : '') + '</div>';
  }).join('');
  $$('[data-tk]', box).forEach(c => c.onchange = () => { if (c.checked) p.tk[c.dataset.tk] = true; else delete p.tk[c.dataset.tk]; save(true); renderTasks(l, p); });
}

function renderFinish(l) {
  const box = $('#finBox'); if (!box) return;
  const st = lstat(l.id), p = st.p, b = BLOCK[l.block];
  const cond = (ok, html) => '<div class="cond' + (ok ? ' ok' : '') + '"><span class="ck">' + (ok ? '✓' : '') + '</span><div>' + html + '</div></div>';
  let h = '<div class="done-box">';
  h += cond(st.quizOk, '퀴즈 80점 이상 <span class="muted small">(현재 최고 ' + (p.quiz == null ? '–' : p.quiz) + '점)</span>');
  h += cond(st.essOk, '셀프체크 ' + l.essay.length + '문항 모두 채점 <span class="muted small">(' + st.graded + ' / ' + l.essay.length + ')</span>');
  h += '<div class="cond' + (st.note ? ' ok' : '') + '"><span class="ck">' + (st.note ? '✓' : '') + '</span><div><label><input type="checkbox" id="noteCk" ' + (st.note ? 'checked' : '') + '> 핵심 정리를 손노트에 옮겨 적고, 용어를 온라인 노트에 정리했다</label></div></div>';
  if (st.done) {
    h += '<p style="margin-bottom:0"><span class="chip good">완료 ' + niceD(p.done) + '</span> ' + (p.rv && p.rv.next ? '다음 복습: <b>' + niceD(p.rv.next) + '</b>' : '복습 일정을 모두 마쳤습니다') + '</p>';
  } else {
    const ready = st.quizOk && st.essOk && st.note;
    h += '<div class="btn-row"><button class="btn pri" id="finBtn" ' + (ready ? '' : 'disabled') + '>레슨 완료</button>' + (ready ? '' : '<span class="small muted" style="align-self:center">위 세 가지를 모두 채우면 눌립니다</span>') + '</div>';
  }
  if (b.lessons[b.lessons.length - 1].id === l.id) h += '<p class="small" style="margin-bottom:0">' + esc(b.short) + ' 레슨이 끝났다면 <a href="#' + b.exam.id + '">' + esc(b.exam.title) + '</a>으로 마무리하세요.</p>';
  h += '</div>';
  box.innerHTML = h;
  $('#noteCk').onchange = e => { p.note = e.target.checked; save(); renderFinish(l); };
  if ($('#finBtn')) $('#finBtn').onclick = () => {
    p.done = today(); p.rv = { stage: 0, next: addDays(today(), INTERVALS[0]) }; save(); renderFinish(l);
    toast('레슨 완료! 내일(' + niceD(p.rv.next) + ') 첫 복습이 잡혔습니다');
  };
}
