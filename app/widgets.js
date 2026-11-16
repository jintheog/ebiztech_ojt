/* 레슨 본문 안의 위젯. 본문에 <div data-widget="이름"></div> 를 넣으면 자동으로 붙습니다. */
const WIDGETS = { permcalc: el => mountPermCalc(el), subnetcalc: el => mountSubnetCalc(el) };
function mountWidgets(root) { $$('[data-widget]', root).forEach(el => { const f = WIDGETS[el.dataset.widget]; if (f) f(el); }); }

/* ---------- 권한 계산기 (일차 04) ---------- */
function mountPermCalc(el) {
  const rows = [['소유자', 'u'], ['그룹', 'g'], ['기타', 'o']], bits = [['r', 4], ['w', 2], ['x', 1]];
  let st = [6, 4, 4], target = null;
  el.className = 'pc';
  const draw = () => {
    let h = '<b class="small">권한 계산기</b> <span class="small muted">칸을 눌러 켜고 끄세요</span><div class="pc-grid" style="margin-top:10px"><span></span>' + bits.map(b => '<span class="h">' + b[0] + ' (' + b[1] + ')</span>').join('') + '<span class="h">합</span>';
    rows.forEach((r, ri) => {
      h += '<span class="small">' + r[0] + ' <span class="muted mono">' + r[1] + '</span></span>';
      bits.forEach(b => { const on = (st[ri] & b[1]) !== 0; h += '<label class="' + (on ? 'on' : '') + '"><input type="checkbox" data-r="' + ri + '" data-b="' + b[1] + '" ' + (on ? 'checked' : '') + '>' + (on ? b[0] : '-') + '</label>'; });
      h += '<span class="num">' + st[ri] + '</span>';
    });
    const sym = st.map(d => (d & 4 ? 'r' : '-') + (d & 2 ? 'w' : '-') + (d & 1 ? 'x' : '-')).join('');
    const num = st.join('');
    h += '</div><div class="pc-out"><span>' + num + '</span><span>' + sym + '</span><small>chmod ' + num + ' 파일명</small></div>';
    h += '<div class="btn-row"><button class="btn sm" data-q>문제 내 주세요</button>' + (target ? '<span class="small" style="align-self:center">목표: <b class="mono">' + target + '</b> 을(를) 만들어 보세요 ' + (num === target ? '<span class="chip good">정답!</span>' : '') + '</span>' : '') + '</div>';
    el.innerHTML = h;
    $$('input', el).forEach(i => i.onchange = () => { const r = +i.dataset.r, b = +i.dataset.b; st[r] = i.checked ? st[r] | b : st[r] & ~b; draw(); });
    $('[data-q]', el).onclick = () => { const pool = ['755', '644', '600', '700', '750', '640', '775', '664', '444', '711'].filter(x => x !== target); target = pool[Math.floor(Math.random() * pool.length)]; st = [0, 0, 0]; draw(); };
  };
  draw();
}

/* ---------- 서브넷 계산기 (레슨 d07) ---------- */
/* IP 주소와 프리픽스 길이(/숫자)로 서브넷 정보를 계산한다. 화면(mountSubnetCalc)과 테스트(tests/apptest.html)가 함께 쓴다.
   /31과 /32는 "주소 개수 − 2" 규칙의 예외라서 network·broadcast가 null이다. */
function subnetCalc(ipStr, prefix) {
  const m = /^\s*(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\s*$/.exec(String(ipStr));
  if (!m || m.slice(1).some(x => +x > 255)) return { ok: false, err: 'IP 주소는 0~255 사이의 숫자 네 개를 점으로 이어 씁니다. 예: 10.0.1.130' };
  if (!/^\s*\d{1,2}\s*$/.test(String(prefix)) || +prefix > 32) return { ok: false, err: '/ 뒤의 숫자는 0~32 사이의 정수입니다.' };
  const p = +prefix, ip = m.slice(1).reduce((a, x) => a * 256 + +x, 0);
  const mask = p === 0 ? 0 : (0xFFFFFFFF << (32 - p)) >>> 0;   // JS의 비트 연산은 32비트 부호 있는 정수라서 >>> 0 으로 되돌린다
  const net = (ip & mask) >>> 0, total = Math.pow(2, 32 - p), end = net + total - 1;
  const dot = n => [n >>> 24, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
  const r = { ok: true, prefix: p, mask: dot(mask), total, bits: ip.toString(2).padStart(32, '0'), note: '' };
  if (p === 32) return Object.assign(r, { network: null, broadcast: null, first: dot(net), last: dot(net), usable: 1, note: '/32는 주소 한 개(장비 한 대)를 가리키는 표기입니다.' });
  if (p === 31) return Object.assign(r, { network: null, broadcast: null, first: dot(net), last: dot(end), usable: 2, note: '/31은 장비 두 대를 1:1로 잇는 구간에서 쓰는 특수한 경우입니다. 네트워크 주소와 브로드캐스트 주소를 따로 두지 않습니다.' });
  return Object.assign(r, { network: dot(net), broadcast: dot(end), first: dot(net + 1), last: dot(end - 1), usable: total - 2 });
}
function mountSubnetCalc(el) {
  const EX = ['10.0.1.10/24', '10.0.1.130/26', '172.16.5.9/16'];
  el.className = 'pc sc';
  el.innerHTML = '<b class="small">서브넷 계산기</b> <span class="small muted">IP 주소와 / 뒤의 숫자를 넣으세요</span>' +
    '<div class="sc-in"><input type="text" class="ip" value="10.0.1.130" aria-label="IP 주소" spellcheck="false" autocomplete="off"><span class="mono">/</span>' +
    '<input type="text" class="pf" value="26" inputmode="numeric" maxlength="2" aria-label="/ 뒤의 숫자 (0~32)" autocomplete="off">' +
    '<span class="small muted ex">예시</span>' + EX.map(e => '<button class="btn sm mono" data-ex="' + e + '">' + e + '</button>').join('') + '</div><div class="sc-res" aria-live="polite"></div>';
  const ip = $('.ip', el), pf = $('.pf', el), res = $('.sc-res', el), num = x => x.toLocaleString('ko-KR');
  const none = '<span class="muted">따로 없음</span>';
  const draw = () => {
    const sl = ip.value.indexOf('/');   // "10.0.1.130/26"처럼 한 칸에 적거나 붙여 넣은 경우: /숫자 칸으로 옮긴다
    if (sl >= 0) { const rest = ip.value.slice(sl + 1).trim(); ip.value = ip.value.slice(0, sl).trim(); if (rest) pf.value = rest; pf.focus(); pf.select(); }
    const r = subnetCalc(ip.value, pf.value);
    if (!r.ok) { res.innerHTML = '<p class="sc-err">' + esc(r.err) + '</p>'; return; }
    // 2진수 한 줄: 네트워크 부분과 호스트 부분을 색으로 구분 (8비트마다 점)
    const d = r.bits.replace(/(.{8})(?=.)/g, '$1.'), k = r.prefix ? r.prefix + Math.floor((r.prefix - 1) / 8) : 0;
    let rest = d.slice(k), sep = '';
    if (rest[0] === '.') { sep = '.'; rest = rest.slice(1); }
    const bin = (k ? '<span class="sc-n">' + d.slice(0, k) + '</span>' : '') + sep + (rest ? '<span class="sc-h">' + rest + '</span>' : '');
    const rows = [
      ['서브넷 마스크', r.mask],
      ['네트워크 주소', r.network || none],
      ['브로드캐스트 주소', r.broadcast || none],
      ['사용 가능한 범위', r.first === r.last ? r.first : r.first + ' ~ ' + r.last],
      ['사용 가능한 개수', num(r.usable) + '개' + (r.prefix <= 30 ? '<small>주소 ' + num(r.total) + '개 − 2</small>' : '')],
      ['IP 주소의 2진수', bin + '<span class="sc-leg"><span class="sc-n">네트워크 부분 ' + r.prefix + '비트</span> <span class="sc-h">호스트 부분 ' + (32 - r.prefix) + '비트</span></span>']
    ];
    res.innerHTML = '<div class="sc-out">' + rows.map(x => '<span class="k">' + x[0] + '</span><span class="v">' + x[1] + '</span>').join('') + '</div>' +
      (r.note ? '<p class="small muted" style="margin:10px 0 0">' + r.note + '</p>' : '');
  };
  ip.oninput = pf.oninput = draw;
  $$('[data-ex]', el).forEach(b => b.onclick = () => { const x = b.dataset.ex.split('/'); ip.value = x[0]; pf.value = x[1]; draw(); });
  draw();
}
