/* 용어 카드 + 전체 용어 목록. 범위는 전체 / 블록 / 레슨. */
const inDeck = t => FC.deck === 'all' ? true : BLOCK[FC.deck] ? LMAP[t.lid].block === FC.deck : t.lid === FC.deck;
const FC = { deck: 'all', mode: 'all', dir: 'term', order: [], i: 0, flipped: false };
function buildDeck() {
  let list = ALLTERMS.filter(t => inDeck(t));
  if (FC.mode === 'weak') list = list.filter(t => S.cards[t.id] === 0 || S.cards[t.id] === 1);
  if (FC.mode === 'new') list = list.filter(t => S.cards[t.id] == null);
  FC.order = shuffle(list.map(t => t.id)); FC.i = 0; FC.flipped = false;
}
function vCards() {
  buildDeck();
  let h = '<div class="eyebrow">셀프 테스트</div><h1>용어 카드</h1><p class="lede">카드를 보고 <b>소리 내서</b> 답을 말한 뒤 뒤집으세요. 그리고 솔직하게 평가하세요.</p>';
  h += '<div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:16px"><label class="small muted" for="fcDeck">범위</label><select id="fcDeck"><option value="all">전체</option>' + CURRICULUM.filter(b => b.lessons.some(m => LMAP[m.id])).map(b => '<option value="' + b.id + '">' + esc(b.short) + ' 전체</option>').join('') + LESSONS.map(l => '<option value="' + l.id + '">' + lessonNo(l.id) + '. ' + esc(l.title) + '</option>').join('') + '</select>' +
    '<div class="seg" id="fcMode"><button data-v="all">모든 카드</button><button data-v="weak">몰라요·헷갈려요만</button><button data-v="new">처음 보는 것만</button></div>' +
    '<div class="seg" id="fcDir"><button data-v="term">용어 → 뜻</button><button data-v="def">뜻 → 용어</button></div></div>';
  h += '<div id="fcStats" class="small muted" style="margin:12px 0"></div><div id="fcArea"></div>';
  h += '<h2>전체 용어 목록</h2><p class="small muted">IT 용어 정리 과제에 쓰세요. 복사하면 "용어 / 영문 / 정의 / 내 비유(빈칸)" 표 형식으로 붙여 넣을 수 있습니다.</p>' +
    '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px"><input type="search" id="glQ" placeholder="용어 검색 (예: SSH, 가상화)" aria-label="용어 검색" style="flex:1;min-width:180px"><button class="btn sm" id="glCopy">전체 용어 복사</button></div><div class="gl-list" id="glList"></div><textarea id="glFallback" hidden style="width:100%;height:120px;margin-top:8px" aria-label="복사용 텍스트"></textarea>';
  $('#view').innerHTML = h;
  $('#fcDeck').value = FC.deck;
  const segSync = () => { $$('#fcMode button').forEach(b => b.classList.toggle('on', b.dataset.v === FC.mode)); $$('#fcDir button').forEach(b => b.classList.toggle('on', b.dataset.v === FC.dir)); };
  segSync();
  $('#fcDeck').onchange = e => { FC.deck = e.target.value; buildDeck(); drawCard(); };
  $$('#fcMode button').forEach(b => b.onclick = () => { FC.mode = b.dataset.v; segSync(); buildDeck(); drawCard(); });
  $$('#fcDir button').forEach(b => b.onclick = () => { FC.dir = b.dataset.v; segSync(); FC.flipped = false; drawCard(); });
  drawCard(); drawGloss('');
  $('#glQ').oninput = e => drawGloss(e.target.value);
  $('#glCopy').onclick = () => {
    const txt = '용어\t영문\t한 줄 정의\t내 비유\n' + ALLTERMS.map(t => t.term + '\t' + t.en + '\t' + t.def + '\t').join('\n');
    const fb = () => { const ta = $('#glFallback'); ta.hidden = false; ta.value = txt; ta.focus(); ta.select(); toast('자동 복사가 안 되어 아래에 펼쳤습니다. Ctrl+C로 복사하세요'); };
    try { navigator.clipboard.writeText(txt).then(() => toast(ALLTERMS.length + '개 용어를 복사했습니다'), fb); } catch (e) { fb(); }
  };
}
function cardStats() {
  const ids = ALLTERMS.filter(t => inDeck(t)).map(t => t.id);
  const c = [0, 0, 0, 0]; ids.forEach(id => { const v = S.cards[id]; c[v == null ? 3 : v]++; });
  $('#fcStats').innerHTML = '이 범위 ' + ids.length + '장 · <span style="color:var(--good)">알아요 ' + c[2] + '</span> · <span style="color:var(--warn)">헷갈려요 ' + c[1] + '</span> · <span style="color:var(--bad)">몰라요 ' + c[0] + '</span> · 안 봄 ' + c[3];
}
function drawCard() {
  cardStats();
  const area = $('#fcArea');
  if (!FC.order.length) { area.innerHTML = '<div class="card"><b>이 조건에 맞는 카드가 없습니다.</b><p class="small muted" style="margin-bottom:0">' + (FC.mode === 'weak' ? '몰라요·헷갈려요 카드가 하나도 없네요. 잘하고 있습니다.' : '범위나 조건을 바꿔 보세요.') + '</p></div>'; return; }
  if (FC.i >= FC.order.length) {
    const weak = FC.order.filter(id => S.cards[id] !== 2).length;
    area.innerHTML = '<div class="card"><b>한 바퀴 끝!</b><p>이번 바퀴에서 아직 "알아요"가 아닌 카드: <b>' + weak + '장</b></p><div class="btn-row">' + (weak ? '<button class="btn pri" id="fcWeak">몰라요·헷갈려요만 다시</button>' : '') + '<button class="btn" id="fcRe">처음부터 다시 (섞기)</button></div></div>';
    if ($('#fcWeak')) $('#fcWeak').onclick = () => { FC.mode = 'weak'; vCards(); };
    $('#fcRe').onclick = () => { buildDeck(); drawCard(); };
    return;
  }
  const t = ALLTERMS.find(x => x.id === FC.order[FC.i]);
  const front = FC.dir === 'term' ? '<div class="front">' + esc(t.term) + '</div><div class="small muted">' + esc(t.en) + '</div>' : '<div class="back">' + esc(t.def) + '</div>';
  const back = FC.dir === 'term' ? '<div class="back">' + esc(t.def) + '</div>' : '<div class="front">' + esc(t.term) + '</div><div class="small muted">' + esc(t.en) + '</div>';
  const cur = S.cards[t.id];
  const curTxt = cur == null ? '' : ['<span class="chip bad">지난번: 몰라요</span>', '<span class="chip warn">지난번: 헷갈려요</span>', '<span class="chip good">지난번: 알아요</span>'][cur];
  area.innerHTML = '<div class="fc' + (FC.flipped ? ' flipped' : '') + '" id="fcCard" tabindex="0" role="button" aria-label="카드 뒤집기"><span class="side">' + (FC.i + 1) + ' / ' + FC.order.length + ' · ' + (FC.flipped ? '뒷면' : '앞면') + '</span><span class="from">' + curTxt + '</span>' +
    (FC.flipped ? back : front + '<div class="small muted" style="margin-top:14px">소리 내서 답한 뒤 눌러서 뒤집기 (Space)</div>') + '</div>' +
    (FC.flipped ? '<div class="fc-actions"><button class="k0" data-k="0">몰라요 (1)</button><button class="k1" data-k="1">헷갈려요 (2)</button><button class="k2" data-k="2">알아요 (3)</button></div>' : '<div class="fc-actions"><button style="grid-column:1/-1" id="fcFlip">뒤집기</button></div>') +
    '<p class="small muted" style="margin-top:8px">출처: <a href="#' + t.lid + '">' + esc(LMAP[t.lid].title) + '</a></p>';
  const flip = () => { FC.flipped = !FC.flipped; drawCard(); };
  $('#fcCard').onclick = flip;
  if ($('#fcFlip')) $('#fcFlip').onclick = flip;
  $$('[data-k]', area).forEach(b => b.onclick = () => rate(+b.dataset.k));
}
function rate(k) { const id = FC.order[FC.i]; S.cards[id] = k; save(true); FC.i++; FC.flipped = false; drawCard(); }
document.addEventListener('keydown', e => {
  if ((location.hash.slice(1)) !== 'cards' || !$('#fcCard')) return;
  if (e.target.matches('input,textarea,select')) return;
  if (e.code === 'Space') { e.preventDefault(); FC.flipped = !FC.flipped; drawCard(); }
  else if (FC.flipped && ['1', '2', '3'].includes(e.key)) rate(+e.key - 1);
});
function drawGloss(q) {
  q = q.trim().toLowerCase();
  const list = ALLTERMS.filter(t => !q || (t.term + ' ' + t.en + ' ' + t.def).toLowerCase().includes(q));
  $('#glList').innerHTML = list.length ? list.map(t => '<div class="gl-item"><div><b>' + esc(t.term) + '</b><div class="small muted">' + esc(t.en) + '</div></div><div>' + esc(t.def) + '</div><a class="small" href="#' + t.lid + '">레슨 ' + lessonNo(t.lid) + '</a></div>').join('') : '<div class="gl-item"><span class="muted">검색 결과가 없습니다.</span></div>';
}
