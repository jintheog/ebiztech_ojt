/* 공통 그림 부품(아이콘 세트). 페이지를 열 때 SVG <symbol> 묶음을 body 맨 앞에 한 번 넣습니다.
   레슨 본문에서는 <svg class="fig" viewBox="…" role="img" aria-label="…"> 안에서 <use href="#i-이름" x y width height/>로 씁니다.
   같은 문서 안의 참조라서 file://에서도 동작합니다. 사용법은 CLAUDE.md "그림 그리는 법" 참고.

   부품: i-cloud(인터넷) i-server(서버) i-lb(로드밸런서) i-db(DB 원통) i-storage(스토리지·백업)
         i-rack(랙, 세로로 긴 비율) i-ups(UPS 배터리) i-gen(발전기) i-cool(냉각) i-lock(출입 통제) i-x(장애 ✕)
   화살표 머리: marker-end="url(#ar)" / url(#ar-acc)
   모든 부품은 선 색이 currentColor라서 <use class="acc"> / class="bad" / class="mut" 로 색을 바꿉니다. */
const ICON_SPRITE = `<svg xmlns="http://www.w3.org/2000/svg" class="fig-sprite" aria-hidden="true" focusable="false">
<defs>
<marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="mk"/></marker>
<marker id="ar-acc" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" class="mk-acc"/></marker>
</defs>
<symbol id="i-cloud" viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M17 35 H48 A9 9 0 0 0 49.5 17.2 A13 13 0 0 0 24.5 12.5 A10 10 0 0 0 17 35 Z"/></symbol>
<symbol id="i-server" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="6" y="7" width="36" height="34" rx="3"/><line x1="6" y1="18.3" x2="42" y2="18.3"/><line x1="6" y1="29.6" x2="42" y2="29.6"/><circle cx="12" cy="12.7" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="24" r="1.4" fill="currentColor" stroke="none"/><circle cx="12" cy="35.3" r="1.4" fill="currentColor" stroke="none"/><line x1="27" y1="12.7" x2="36" y2="12.7"/><line x1="27" y1="24" x2="36" y2="24"/><line x1="27" y1="35.3" x2="36" y2="35.3"/></symbol>
<symbol id="i-lb" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="7" width="36" height="34" rx="3"/><polyline points="12,24 20,24"/><polyline points="20,24 33,14"/><polyline points="20,24 33,24"/><polyline points="20,24 33,34"/><polyline points="29,12 33,14 31,18"/><polyline points="30,21 33,24 30,27"/><polyline points="31,30 33,34 29,36"/></symbol>
<symbol id="i-db" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="24" cy="11" rx="15" ry="5"/><path d="M9 11 V37 A15 5 0 0 0 39 37 V11"/><path d="M9 24 A15 5 0 0 0 39 24"/></symbol>
<symbol id="i-storage" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="24" cy="9" rx="15" ry="4.5"/><path d="M9 9 V16 A15 4.5 0 0 0 39 16 V9"/><path d="M9 20 A15 4.5 0 0 0 39 20"/><path d="M9 20 V27 A15 4.5 0 0 0 39 27 V20"/><path d="M9 31 A15 4.5 0 0 0 39 31"/><path d="M9 31 V38 A15 4.5 0 0 0 39 38 V31"/></symbol>
<symbol id="i-rack" viewBox="0 0 40 96" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="36" height="92" rx="2"/><g stroke-width="1.6"><rect x="7" y="8" width="26" height="8" rx="1"/><rect x="7" y="19" width="26" height="8" rx="1"/><rect x="7" y="30" width="26" height="8" rx="1"/><rect x="7" y="41" width="26" height="8" rx="1"/><rect x="7" y="52" width="26" height="8" rx="1"/><rect x="7" y="63" width="26" height="8" rx="1"/><rect x="7" y="74" width="26" height="8" rx="1"/></g><g fill="currentColor" stroke="none"><circle cx="11" cy="12" r="1.2"/><circle cx="11" cy="23" r="1.2"/><circle cx="11" cy="34" r="1.2"/><circle cx="11" cy="45" r="1.2"/><circle cx="11" cy="56" r="1.2"/><circle cx="11" cy="67" r="1.2"/><circle cx="11" cy="78" r="1.2"/></g></symbol>
<symbol id="i-ups" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="6" y="14" width="32" height="22" rx="3"/><rect x="38" y="21" width="4" height="8" rx="1"/><path d="M24 17 L17 26 H23 L20 33 L29 23 H23 Z" fill="currentColor" stroke="none"/></symbol>
<symbol id="i-gen" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="14" width="38" height="22" rx="3"/><circle cx="16" cy="25" r="6"/><line x1="16" y1="19" x2="16" y2="31"/><line x1="10" y1="25" x2="22" y2="25"/><path d="M33 17 L28 25 H33 L30 33" /><line x1="10" y1="36" x2="10" y2="41"/><line x1="38" y1="36" x2="38" y2="41"/><line x1="36" y1="14" x2="36" y2="9"/></symbol>
<symbol id="i-cool" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="24" y1="6" x2="24" y2="42"/><line x1="8.4" y1="15" x2="39.6" y2="33"/><line x1="8.4" y1="33" x2="39.6" y2="15"/><polyline points="19,9 24,13 29,9"/><polyline points="19,39 24,35 29,39"/><polyline points="9,21 14,20 12.5,15"/><polyline points="39,27 34,28 35.5,33"/><polyline points="9,27 14,28 12.5,33"/><polyline points="39,21 34,20 35.5,15"/></symbol>
<symbol id="i-lock" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2"><rect x="11" y="21" width="26" height="20" rx="3"/><path d="M16 21 V15 A8 8 0 0 1 32 15 V21"/><circle cx="24" cy="30" r="2.2" fill="currentColor" stroke="none"/><line x1="24" y1="31" x2="24" y2="36"/></symbol>
<symbol id="i-x" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></symbol>
</svg>`;
(function () {
  const put = () => { if (!document.querySelector('.fig-sprite')) document.body.insertAdjacentHTML('afterbegin', ICON_SPRITE); };
  if (document.body) put(); else document.addEventListener('DOMContentLoaded', put);
})();
