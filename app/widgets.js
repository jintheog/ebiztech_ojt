/* 레슨 본문 안의 위젯. 본문에 <div data-widget="이름"></div> 를 넣으면 자동으로 붙습니다. */
const WIDGETS = { permcalc: el => mountPermCalc(el) };
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
