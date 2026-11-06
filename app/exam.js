/* 블록별 종합시험. 시험 정의(id, title, n)는 content/curriculum.js 의 각 블록 exam.
   출제 규칙은 app/core.js 의 examBuild: exam:false 레슨과 x:1 슬롯 제외, 슬롯 중복 없음,
   레슨마다 최소 EXAM_MIN문제 + 슬롯 수에 비례 배분. 화면을 열 때 미리 뽑아 두므로 안내 문구의 숫자가 실제 출제 수와 같습니다.
   EQ = 지금 화면의 시험 {eid, qs, included, excluded}. "새 문제로 다시 보기"를 누르면 다시 뽑습니다. */
let EQ = null;
function vExam(eid) {
  const ex = EXAMS[eid], b = BLOCK[ex.block];
  const ls = LESSONS.filter(l => l.block === b.id);
  const prev = S.exams[eid];
  EQ = Object.assign({ eid }, examBuild(ls, ex.n));
  let h = '<div class="eyebrow">종합시험 · ' + esc(b.short) + '</div><h1>' + esc(ex.title) + '</h1>';
  if (!EQ.qs.length) {
    $('#view').innerHTML = h + '<p class="lede">이 블록의 레슨이 아직 준비 중이라 시험 문제가 없습니다.</p>';
    return;
  }
  const missing = b.lessons.length - ls.length;
  h += '<p class="lede" id="exLede">' + esc(b.short) + ' 레슨 ' + EQ.included.length + '개에서 ' + EQ.qs.length + '문제를 레슨별로 고르게(레슨마다 최소 ' + EXAM_MIN + '문제) 무작위로 뽑습니다. 제한 시간은 없지만, 노트를 보지 말고 푸세요.</p>';
  h += '<div class="box"><ul style="margin:0"><li>80점 이상이면 통과입니다.</li><li>제출하면 레슨별 점수가 나옵니다. <b>점수가 낮은 레슨만</b> 다시 보세요.</li><li>틀린 문제는 해설을 손노트에 한 줄씩 적으세요.</li>' +
    (EQ.excluded.length ? '<li class="muted">' + EQ.excluded.map(l => esc(l.title)).join(', ') + ' 레슨은 시험 범위에서 제외됩니다.</li>' : '') +
    (missing ? '<li class="muted">준비 중인 레슨 ' + missing + '개는 아직 포함되지 않습니다.</li>' : '') + '</ul>' +
    (prev ? '<p class="small" style="margin-bottom:0">지난 기록: 최고 <b>' + prev.best + '점</b> · 최근 ' + prev.last + '점 (' + niceD(prev.date) + ')</p>' : '') + '</div>';
  h += '<div class="btn-row"><button class="btn pri" id="exStart">시험 시작</button></div><div id="exBox"></div>';
  $('#view').innerHTML = h;
  $('#exStart').onclick = () => startExam(eid, EQ.qs);
}
function startExam(eid, qs) {
  $('#exStart').parentElement.hidden = true;
  const box = $('#exBox');
  box.innerHTML = qs.map((q, n) => '<div class="q exam-q" data-n="' + n + '"><div class="q-h"><span class="qn">' + (n + 1) + '.</span><span>' + refHTML(q.q) + '</span></div><div class="opts">' +
    q.opts.map((o, k) => '<button class="opt" data-k="' + k + '">' + esc(o.t) + '</button>').join('') + '</div><div class="expl" hidden></div></div>').join('') +
    '<div class="btn-row"><button class="btn pri" id="exSubmit">제출하고 채점</button><span class="small muted" id="exLeft" style="align-self:center"></span></div><div id="exRes"></div>';
  const sel = new Array(qs.length).fill(null);
  const left = () => { const n = sel.filter(x => x == null).length; $('#exLeft').textContent = n ? '안 푼 문제 ' + n + '개' : '모두 풀었습니다'; };
  left();
  $$('.exam-q', box).forEach(el => {
    const n = +el.dataset.n;
    $$('.opt', el).forEach(b => b.onclick = () => { if (sel[n] === 'locked') return; sel[n] = +b.dataset.k; $$('.opt', el).forEach(x => x.classList.toggle('sel', x === b)); left(); });
  });
  $('#exSubmit').onclick = () => {
    if (sel.some(x => x == null) && !$('#exSubmit').dataset.warned) { $('#exSubmit').dataset.warned = '1'; $('#exSubmit').textContent = '안 푼 문제가 있어요. 그래도 제출'; return; }
    let correct = 0; const per = {};
    qs.forEach((q, n) => {
      const el = $('.exam-q[data-n="' + n + '"]', box), pick = sel[n], ok = pick != null && q.opts[pick].ok;
      per[q.lid] = per[q.lid] || [0, 0]; per[q.lid][1]++; if (ok) { per[q.lid][0]++; correct++; }
      $$('.opt', el).forEach((x, j) => { x.disabled = true; x.classList.remove('sel'); if (q.opts[j].ok) x.classList.add('ok'); else if (j === pick) x.classList.add('no'); });
      const ex = $('.expl', el); ex.hidden = false; ex.innerHTML = (ok ? '<b class="ok">정답</b> ' : '<b class="no">오답</b> ') + refHTML(q.e) + ' <a class="small" href="#' + q.lid + '">레슨 보기</a>';
    });
    const sc = Math.round(correct / qs.length * 100);
    const pr = S.exams[eid] || { best: 0 };
    S.exams[eid] = { best: Math.max(pr.best || 0, sc), last: sc, date: today() }; save();
    $('#exSubmit').parentElement.hidden = true;
    // 레슨 순서대로 표시
    const rows = ALL.map(m => m.id).filter(id => per[id]).map(id => [id, per[id]]);
    const weak = rows.filter(([id, [a, b]]) => a / b < 0.8).map(([id]) => id);
    $('#exRes').innerHTML = '';
    const res = '<div class="box" style="border-color:' + (sc >= 80 ? 'var(--good)' : 'var(--bad)') + '"><div class="score"><span class="big">' + sc + '</span><div><b>' + correct + ' / ' + qs.length + ' 정답</b><br><span class="small">' + (sc >= 80 ? '통과입니다.' : '80점 미만입니다. 아래에서 점수가 낮은 레슨을 다시 보고 재도전하세요.') + '</span></div></div>' +
      '<div style="margin-top:12px" id="exPer">' + rows.map(([id, [a, b]]) => '<div class="res-l" data-lid="' + id + '"><a href="#' + id + '">' + esc(LMAP[id].title) + '</a><span class="mono small">' + a + '/' + b + '</span><div class="mini-bar"><i style="width:' + (a / b * 100) + '%;background:' + (a / b >= 0.8 ? 'var(--good)' : 'var(--bad)') + '"></i></div></div>').join('') + '</div>' +
      (weak.length ? '<p class="small">다시 볼 레슨: ' + weak.map(id => '<a href="#' + id + '">' + esc(LMAP[id].title) + '</a>').join(', ') + '</p>' : '') +
      '<div class="btn-row"><button class="btn" id="exAgain">새 문제로 다시 보기</button></div></div>';
    box.insertAdjacentHTML('afterbegin', '<div id="exTop">' + res + '</div>');
    $('#exAgain').onclick = () => route();
    $('#exTop').scrollIntoView({ behavior: 'smooth' });
  };
}
