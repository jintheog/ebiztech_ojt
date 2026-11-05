/* 홈(진도·지금 할 일·오늘 복습·일정표 대응표·계획표·백업)과 공부법 화면. */

const examChip = eid => S.exams[eid] ? '<span class="chip ' + (S.exams[eid].best >= 80 ? 'good' : 'warn') + '">최고 ' + S.exams[eid].best + '점</span>' : '<span class="chip">미응시</span>';

function coverTable() {
  let h = '<h2>교육일정표 대응표</h2><p class="small muted">교육일정표의 항목이 어느 레슨의 어느 절에 있는지 보여 줍니다. 항목을 누르면 그 절로 바로 갑니다.</p>';
  CURRICULUM.forEach(b => {
    h += '<h3>' + esc(b.title) + '</h3><div class="tbl-wrap"><table><thead><tr><th>일정표</th><th>주제 → 레슨</th><th>주요 학습 항목</th><th>학습 확인 / 활동</th></tr></thead><tbody>';
    b.lessons.forEach(m => {
      const l = LMAP[m.id];
      const when = m.day ? '일차 ' + m.day : esc(m.tag);
      if (!l) {
        h += '<tr class="soon-row"><td style="white-space:nowrap">' + when + ' <span class="chip">준비 중</span></td><td><a href="#' + m.id + '">' + esc(m.title) + '</a></td><td class="small">' + esc(m.items || '') + '</td><td class="small">' + esc(m.act || '') + '</td></tr>';
        return;
      }
      const st = lstat(l.id);
      h += '<tr><td style="white-space:nowrap">' + when + (st.done ? ' <span class="chip good">완료</span>' : '') + '</td><td><a href="#' + l.id + '">' + esc(l.title) + '</a></td><td>' +
        (l.cover || []).map(c => '<a class="small" href="#' + l.id + '" data-sec="' + c[1] + '">' + esc(c[0]) + '</a>').join(' · ') + '</td><td class="small">' + esc(l.act || '') +
        (MISSION_OF[l.id] ? ' · <a href="#term">미션 ' + MISSION_OF[l.id].toUpperCase() + '</a>' : '') + '</td></tr>';
    });
    h += '</tbody></table></div>';
  });
  return h;
}

function vHome() {
  const n = doneCount();
  const scores = LESSONS.map(l => LP(l.id).quiz).filter(x => x != null);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
  const known = ALLTERMS.filter(t => S.cards[t.id] === 2).length;
  const mis = MSETS.reduce((a, m) => a + Math.min(S.term[m] || 0, MISSIONS[m].items.length), 0);
  const misTot = MSETS.reduce((a, m) => a + MISSIONS[m].items.length, 0);
  const next = LESSONS.find(l => !LP(l.id).done);
  const due = LESSONS.filter(l => lstat(l.id).due);

  let h = '<div class="hero-h"><div><div class="eyebrow">' + niceD(today()) + '</div><h1>7주 OJT 학습장</h1><p class="lede">회사 이해 → IT 인프라 기초(일차 01~14) → Zadara zCompute → zStorage까지. 매일 이 화면에서 시작하세요.</p></div></div>';
  if (!S.guide) h += '<div class="box analogy" style="margin-top:18px"><span class="lbl">처음이라면</span><p><b>공부법부터 읽으세요.</b> 노트를 어떻게 쓰고, 몇 번 읽고, 언제 복습할지 정해 두었습니다. 15분이면 됩니다.</p><div class="btn-row"><a class="btn pri" href="#guide">공부법 읽기</a></div></div>';
  h += '<div class="stat-row" style="margin-top:20px">' +
    '<div class="stat"><b>' + n + '<span class="muted" style="font-size:.9rem"> / ' + ALL.length + '</span></b><span>완료한 레슨</span></div>' +
    '<div class="stat"><b>' + (avg == null ? '–' : avg) + '</b><span>퀴즈 평균 점수</span></div>' +
    '<div class="stat"><b>' + known + '<span class="muted" style="font-size:.9rem"> / ' + ALLTERMS.length + '</span></b><span>"알아요" 용어</span></div>' +
    '<div class="stat"><b>' + mis + '<span class="muted" style="font-size:.9rem"> / ' + misTot + '</span></b><span>터미널 미션</span></div></div>';

  h += '<h2>지금 할 일</h2><div class="grid2">';
  if (next) h += '<div class="card"><div class="small muted">' + esc(next.tag) + '</div><div style="font-weight:700;font-size:1.05rem;margin:2px 0 8px">' + esc(next.title) + '</div><p class="small muted" style="margin:0">' + esc(next.mins || '') + '</p><div class="btn-row"><a class="btn pri" href="#' + next.id + '">이어서 공부하기</a></div></div>';
  else h += '<div class="card"><div style="font-weight:700">준비된 ' + LESSONS.length + '개 레슨을 모두 끝냈습니다</div><p class="small">블록별 종합시험으로 마무리하고, 복습 일정을 지키세요.' + (LESSONS.length < ALL.length ? ' 나머지 레슨은 준비 중입니다.' : '') + '</p></div>';
  h += '<div class="card"><div style="font-weight:700;margin-bottom:6px">오늘 복습할 것</div>';
  if (due.length) {
    h += '<div class="stack-v" style="gap:8px">' + due.map(l => '<div style="display:flex;justify-content:space-between;gap:8px;align-items:center"><span class="small">' + esc(l.title) + '</span><a class="btn sm" href="#' + l.id + '">복습</a></div>').join('') + '</div>';
  } else {
    const upcoming = LESSONS.map(l => LP(l.id).rv).filter(r => r && r.next).map(r => r.next).sort()[0];
    h += '<p class="small muted" style="margin:0">오늘은 복습할 레슨이 없습니다.' + (upcoming ? ' 다음 복습: ' + niceD(upcoming) : ' 레슨을 완료하면 복습 날짜가 자동으로 잡힙니다.') + '</p>';
  }
  h += '<p class="small muted" style="margin:10px 0 0">매일 아침: 어제 레슨 백지 테스트 5분 → <a href="#cards">용어 카드</a> "몰라요"만</p></div></div>';

  h += '<h2>레슨 진도</h2>';
  CURRICULUM.forEach(b => {
    h += '<h3>' + esc(b.title) + '</h3><div class="lesson-list">' + b.lessons.map(m => {
      const l = LMAP[m.id];
      if (!l) return '<a class="lrow soon" href="#' + m.id + '"><span class="wk">' + esc(m.tag) + '</span><span class="tt">' + esc(m.title) + '</span><span class="meta"><span class="chip">준비 중</span></span></a>';
      const st = lstat(l.id); let chips = '';
      if (st.done) chips += '<span class="chip good">완료 ' + niceD(st.p.done) + '</span>';
      if (st.due) chips += '<span class="chip warn">오늘 복습</span>';
      else if (st.done && st.p.rv && st.p.rv.next) chips += '<span class="chip">복습 ' + niceD(st.p.rv.next) + '</span>';
      if (st.p.quiz != null) chips += '<span class="chip ' + (st.p.quiz >= 80 ? 'acc' : 'bad') + '">퀴즈 ' + st.p.quiz + '</span>';
      if (!st.done && st.p.quiz == null) chips += '<span class="chip">시작 전</span>';
      return '<a class="lrow" href="#' + l.id + '"><span class="wk">' + esc(l.tag) + '</span><span class="tt">' + esc(l.title) + '</span><span class="meta">' + chips + '</span></a>';
    }).join('') + '<a class="lrow" href="#' + b.exam.id + '"><span class="wk">종합시험</span><span class="tt">' + esc(b.exam.title) + '</span><span class="meta">' + examChip(b.exam.id) + '</span></a></div>';
  });

  h += coverTable();

  h += '<h2>7주 계획표</h2><p class="small muted">회사 일정에 맞춰 날짜는 조정해도 됩니다. 순서는 바꾸지 마세요.</p><div class="tbl-wrap"><table><thead><tr><th>날짜</th><th>공부할 것</th><th>함께 할 것</th></tr></thead><tbody>' +
    PLAN.map(r => '<tr><td style="white-space:nowrap">' + r[0] + '</td><td><a href="#' + r[2] + '">' + esc(r[1]) + '</a></td><td class="small">' + esc(r[3]) + '</td></tr>').join('') + '</tbody></table></div>';

  h += '<h2>백업</h2><p class="small muted">진도·점수·답안·질문 노트는 <b>이 PC의 이 브라우저</b>에만 저장됩니다. 브라우저 데이터를 지우거나 다른 PC로 옮기면 사라지니, 주 1회 백업 파일로 내보내 두세요.</p>' +
    '<div class="btn-row"><button class="btn" id="bkExport">백업 파일 내보내기</button><button class="btn" id="bkImport">백업 파일 불러오기</button><input type="file" id="bkFile" accept=".json,application/json" hidden></div>' +
    (S.ts ? '<p class="small muted">마지막 저장: ' + new Date(S.ts).toLocaleString('ko-KR') + '</p>' : '');
  $('#view').innerHTML = h;
  $('#bkExport').onclick = exportState;
  $('#bkImport').onclick = () => {
    if (S.ts && !confirm('지금 브라우저의 진도를 백업 파일 내용으로 바꿉니다. 계속할까요?')) return;
    $('#bkFile').click();
  };
  $('#bkFile').onchange = e => { const f = e.target.files[0]; if (f) importState(f); e.target.value = ''; };
}

function vGuide() {
  $('#view').innerHTML = GUIDE + '<div class="done-box" style="margin-top:28px"><p style="margin-top:0"><b>다 읽었나요?</b> 준비물을 챙기고, 온라인 노트에 페이지 3개를 만든 뒤 첫 레슨을 시작하세요.</p><div class="btn-row"><button class="btn pri" id="gDone">' + (S.guide ? '읽음 표시됨 ✓ 첫 레슨으로' : '읽었어요, 첫 레슨 시작') + '</button></div></div>';
  $('#gDone').onclick = () => { S.guide = true; save(); location.hash = ALL[0].id; };
}
