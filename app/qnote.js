/* 질문 노트. */
function vQnote() {
  let h = '<div class="eyebrow">메모</div><h1>질문 노트</h1><p class="lede">모르는 것이 생기면 바로 여기에 적고 공부를 이어가세요. 하루 한 번 모아서 사수에게 묻고, 받은 답을 적어 둡니다.</p>';
  h += '<div class="box"><label for="qnNew" class="small"><b>새 질문</b> <span class="muted">(하려던 것 · 해 본 것 · 결과 · 내 추측 · 질문)</span></label><textarea id="qnNew" style="width:100%;min-height:80px;margin-top:8px;border:1px solid var(--line);border-radius:8px;padding:9px 12px;font:inherit;background:var(--paper);color:var(--ink)" placeholder="예) 1Gbps가 125MB/s인 건 이해했는데, 실무에서는 1,000과 1,024 중 무엇을 기준으로 계산하나요?"></textarea><div class="btn-row"><button class="btn pri" id="qnAdd">질문 추가</button></div></div>';
  h += '<div class="seg" id="qnFilter" style="margin:8px 0 12px"><button data-v="open" class="on">답 기다리는 중</button><button data-v="done">해결됨</button><button data-v="all">전체</button></div><div class="stack-v" id="qnList"></div>';
  $('#view').innerHTML = h;
  let filter = 'open';
  const draw = () => {
    const list = S.qn.map((q, i) => ({ ...q, i })).filter(q => filter === 'all' ? true : filter === 'done' ? q.done : !q.done).reverse();
    $('#qnList').innerHTML = list.length ? list.map(q => '<div class="qn-item' + (q.done ? ' done' : '') + '" data-i="' + q.i + '"><div class="small muted">' + niceD(q.d) + '</div><div style="white-space:pre-wrap">' + esc(q.q) + '</div><label class="small muted" for="qa-' + q.i + '">받은 답</label><textarea id="qa-' + q.i + '" placeholder="누구에게 어떤 답을 받았는지">' + esc(q.a || '') + '</textarea><div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap"><label class="small"><input type="checkbox" data-done ' + (q.done ? 'checked' : '') + '> 해결됨</label><button class="btn sm" data-del>삭제</button></div></div>').join('') : '<div class="card small muted">' + (filter === 'open' ? '답을 기다리는 질문이 없습니다.' : '아직 없습니다.') + '</div>';
    $$('.qn-item').forEach(el => {
      const i = +el.dataset.i, ta = $('textarea', el);
      let t; ta.oninput = () => { clearTimeout(t); t = setTimeout(() => { S.qn[i].a = ta.value; save(true); }, 600); };
      $('[data-done]', el).onchange = e => { S.qn[i].done = e.target.checked; save(); draw(); };
      const del = $('[data-del]', el);
      del.onclick = () => { if (del.dataset.c) { S.qn.splice(i, 1); save(); draw(); } else { del.dataset.c = '1'; del.textContent = '정말 삭제'; } };
    });
  };
  $$('#qnFilter button').forEach(b => b.onclick = () => { filter = b.dataset.v; $$('#qnFilter button').forEach(x => x.classList.toggle('on', x === b)); draw(); });
  $('#qnAdd').onclick = () => { const v = $('#qnNew').value.trim(); if (!v) return; S.qn.push({ q: v, a: '', done: false, d: today() }); $('#qnNew').value = ''; save(); draw(); toast('질문을 적어 두었습니다'); };
  draw();
}
