OJT.lesson({
id:'d11', week:4, day:'11', tag:'일차 11', mins:'약 3시간',
title:'Storage 기초 Ⅰ: Block Storage, RAID, SAN·iSCSI, Volume과 LUN',
cover:[['Block Storage','s1'],['SAN','s4'],['RAID','s3'],['iSCSI','s5'],['Volume','s2'],['LUN','s2'],['Block Volume 사용 과정','s6']],
act:'서버의 Block Volume 사용 과정 설명',
goal:['Block Storage가 무엇이고 서버에 어떻게 보이는지 설명할 수 있다','Volume, LUN, 스토리지 풀의 관계를 설명할 수 있다','RAID 0·1·5·6·10을 용량, 성능, 견딜 수 있는 디스크 고장 수로 비교하고, 사용 가능한 용량을 계산할 수 있다','DAS와 SAN의 차이, iSCSI의 Initiator와 Target을 설명할 수 있다','스토리지에서 Volume을 만들어 서버가 쓰기까지의 과정을 순서대로 설명할 수 있다'],
terms:[
['Block Storage','Block Storage','저장 공간을 같은 크기의 블록으로 나눠, 서버에 디스크 한 개처럼 내주는 저장 방식. 파일시스템은 서버가 만든다.'],
['블록','Block','저장 공간을 나눈 같은 크기의 조각. 번호로 구분해서 읽고 쓴다.'],
['스토리지 풀','Storage Pool','물리 디스크 여러 개를 묶어 만든 큰 저장 공간. 여기서 Volume을 잘라 낸다.'],
['Volume','Volume','스토리지 풀에서 필요한 크기만큼 잘라 서버에 주는 논리 디스크.'],
['LUN','Logical Unit Number','스토리지가 서버에 내보이는 논리 디스크에 붙이는 번호. 그 논리 디스크 자체도 LUN이라고 부른다.'],
['RAID','Redundant Array of Independent Disks','디스크 여러 개를 묶어 하나처럼 쓰는 기술. 디스크 고장에 대비하거나 성능을 높인다.'],
['스트라이핑','Striping','데이터를 여러 디스크에 나눠서 기록하는 것. 빨라지지만 그것만으로는 고장에 대비하지 못한다.'],
['미러링','Mirroring','같은 데이터를 두 디스크에 똑같이 기록하는 것.'],
['패리티','Parity','디스크 하나가 고장 났을 때 사라진 데이터를 다시 계산해 내려고 함께 저장하는 값.'],
['RAID 0 / RAID 1','RAID 0 / RAID 1','스트라이핑만 하는 구성(고장 대비 없음) / 미러링하는 구성(1개 고장을 견딤).'],
['RAID 5 / RAID 6','RAID 5 / RAID 6','스트라이핑에 패리티를 더한 구성. RAID 5는 디스크 1개, RAID 6은 2개 고장을 견딘다.'],
['RAID 10','RAID 1+0','미러링한 쌍을 여러 개 만들고 그 쌍들에 스트라이핑하는 구성.'],
['재구성 / 핫 스페어','Rebuild / Hot Spare','고장 난 디스크를 바꾼 뒤 데이터를 다시 채우는 작업 / 고장에 대비해 미리 꽂아 둔 예비 디스크.'],
['DAS','Direct Attached Storage','서버에 직접 연결한 저장 장치. 그 서버만 쓴다.'],
['SAN','Storage Area Network','스토리지와 서버를 잇는 전용 네트워크. 서버는 블록 단위로 스토리지의 Volume을 쓴다.'],
['Fibre Channel','Fibre Channel (FC)','SAN을 만드는 전용 연결 기술. 전용 장비와 케이블을 쓴다.'],
['iSCSI','Internet Small Computer Systems Interface','디스크를 읽고 쓰는 명령(SCSI)을 IP 네트워크로 실어 나르는 프로토콜. 기본 포트는 TCP 3260.'],
['Initiator / Target','iSCSI Initiator / Target','iSCSI에서 접속을 시작하는 서버 쪽 / Volume을 내주는 스토리지 쪽.'],
['IQN','iSCSI Qualified Name','iSCSI에서 Initiator와 Target을 구분하는 이름. 예: iqn.2026-11.com.example:server01'],
['멀티패스','Multipath','서버와 스토리지 사이의 경로를 둘 이상 두어, 하나가 끊겨도 디스크를 계속 쓰게 하는 구성.']
],
body:`
<h2 id="s1">Block Storage: 서버에 디스크 한 개처럼 보이는 저장소</h2>
<p>서버가 스토리지의 저장 공간을 받아서 쓰기까지는 아래 순서를 거칩니다. 이 레슨은 이 순서를 따라갑니다.</p>
<ol><li>스토리지는 물리 디스크 여러 개를 <b>RAID</b>로 묶어서 큰 저장 공간을 만듭니다.</li><li>그 공간에서 필요한 크기만큼 잘라 <b>Volume(LUN)</b>을 만듭니다.</li><li>Volume을 서버에 연결합니다. 전용 네트워크(<b>SAN</b>)에서 <b>iSCSI</b> 같은 프로토콜로 연결하거나, 클라우드에서는 화면에서 연결합니다.</li><li>서버에는 <b>새 디스크</b> 하나가 생긴 것으로 보입니다.</li><li>서버에서 파일시스템을 만들고 마운트해서 씁니다(<a data-lesson="d06"></a>).</li></ol>
<p>스토리지는 데이터를 오래 보관하는 곳입니다(<a data-lesson="d01"></a>). 서버에 저장 공간을 주는 방식은 크게 세 가지입니다.</p>
<div class="tbl-wrap"><table><thead><tr><th>방식</th><th>서버에 보이는 모습</th><th>어디서 배우나</th></tr></thead><tbody>
<tr><td class="nw"><b>Block</b></td><td>아무것도 없는 디스크 한 개</td><td>이 레슨</td></tr>
<tr><td class="nw"><b>File</b></td><td>여러 서버가 함께 쓰는 공유 폴더</td><td><a data-lesson="d12"></a></td></tr>
<tr><td class="nw"><b>Object</b></td><td>주소로 파일을 올리고 내려받는 저장소</td><td><a data-lesson="d12"></a></td></tr>
</tbody></table></div>
<p><b>Block Storage</b>는 저장 공간을 같은 크기의 조각(<b>블록</b>)으로 나누고 번호를 붙여서, "몇 번 블록을 읽어라, 몇 번 블록에 써라"로 다루는 방식입니다.</p>
<ul><li>서버에는 <b>자기 디스크처럼</b> 보입니다. <code>lsblk</code>에 새 디스크 한 줄로 나타납니다.</li><li>스토리지는 블록 안에 무엇이 들었는지 모릅니다. 어느 블록이 어느 파일인지 정리하는 일은 <b>서버의 파일시스템</b>이 합니다(<a data-lesson="d06"></a>).</li><li>읽고 쓰는 단위가 작고 중간 단계가 적어서 빠릅니다. 운영체제 디스크, DB<span class="small muted">(Database)</span>, VM<span class="small muted">(Virtual Machine)</span>의 디스크에 씁니다. 속도를 재는 IOPS, 처리량, 지연시간은 <a data-lesson="d02"></a>에서 배웠습니다.</li><li>Volume 하나는 <b>한 번에 서버 한 대</b>가 쓰는 것이 기본입니다.</li></ul>
<div class="box analogy"><span class="lbl">비유로 보면</span>Block Storage는 칸마다 번호만 붙어 있는 빈 창고를 통째로 빌리는 것과 비슷합니다. 어느 칸에 무엇을 넣었는지 적는 장부(파일시스템)는 빌린 쪽이 만들어 관리합니다.</div>

<h2 id="s2">Volume과 LUN: 큰 공간에서 잘라 낸 논리 디스크</h2>
<p>스토리지는 물리 디스크를 서버에 통째로 주지 않습니다. 디스크 여러 개를 묶어 큰 저장 공간을 만들고, 거기서 필요한 크기만큼 잘라서 줍니다.</p>
<div class="tbl-wrap"><table><thead><tr><th>이름</th><th>뜻</th></tr></thead><tbody>
<tr><td class="nw"><b>스토리지 풀</b></td><td>물리 디스크 여러 개를 묶어 만든 큰 저장 공간</td></tr>
<tr><td class="nw"><b>Volume</b></td><td>풀에서 필요한 크기만큼 잘라 서버에 주는 <b>논리 디스크</b></td></tr>
<tr><td class="nw"><b>LUN</b></td><td>스토리지가 서버에 내보이는 논리 디스크에 붙이는 번호. 그 디스크 자체도 LUN이라고 부름</td></tr>
</tbody></table></div>
<p class="small muted">LUN: Logical Unit Number</p>
<p><b>논리 디스크</b>는 실제 디스크 한 개가 아니라, 스토리지가 만들어서 보여 주는 디스크입니다. 서버는 그것이 실제 디스크 한 개인지, 디스크 열 개에 걸쳐 있는 공간인지 구분하지 못하고 그냥 디스크로 씁니다.</p>
<p><mark>Volume과 LUN은 같은 것을 다른 자리에서 부르는 말인 경우가 많습니다.</mark> 스토리지를 관리하는 화면이나 클라우드에서는 Volume이라고 하고, SAN으로 서버에 연결하는 자리에서는 LUN이라고 합니다. 제품마다 쓰는 말이 조금씩 다릅니다.</p>
<p>논리 디스크로 주면 좋은 점은 이렇습니다.</p>
<ul><li>디스크의 크기에 묶이지 않고 원하는 크기로 만들 수 있습니다.</li><li>나중에 크기를 늘릴 수 있습니다.</li><li>서버가 고장 나면 같은 Volume을 다른 서버에 연결할 수 있습니다. 데이터가 서버가 아니라 스토리지에 있기 때문입니다.</li><li>스냅샷이나 복제 같은 보호 기능을 스토리지가 맡을 수 있습니다(<a data-lesson="d13"></a>).</li></ul>
<p class="small muted">Linux의 LVM(<a data-lesson="d06"></a>)도 "논리 볼륨"이라는 말을 쓰지만, 그것은 서버 안에서 디스크를 묶고 나누는 기능입니다. 이 레슨의 Volume은 스토리지가 만들어서 서버에 주는 것입니다. Zadara zStorage에서의 풀과 Volume은 <a data-lesson="zs1"></a>에서 배웁니다.</p>

<h2 id="s3">RAID: 디스크 여러 개를 묶기</h2>
<p>디스크는 언젠가 고장 납니다. 디스크가 한 개뿐이면 고장 나는 순간 데이터가 사라집니다. <b>RAID</b><span class="small muted">(Redundant Array of Independent Disks)</span>는 디스크 여러 개를 묶어 하나처럼 쓰면서, 디스크 고장에 대비하거나 성능을 높이는 기술입니다(<a data-lesson="d02"></a>에서 이름만 봤습니다). 스토리지 풀도 RAID로 묶은 디스크 위에 만듭니다.</p>
<p>RAID는 세 가지 방법을 조합해서 만듭니다.</p>
<ul><li><b>스트라이핑</b>: 데이터를 여러 디스크에 <b>나눠서</b> 기록합니다. 여러 디스크가 동시에 일하므로 빠릅니다.</li><li><b>미러링</b>: 같은 데이터를 두 디스크에 <b>똑같이</b> 기록합니다. 하나가 고장 나도 다른 하나에 그대로 있습니다.</li><li><b>패리티</b>: 데이터와 함께 <b>복구용 계산 값</b>을 저장합니다. 디스크 하나가 고장 나면 남은 데이터와 패리티로 사라진 내용을 다시 계산해 냅니다.</li></ul>
<div class="tier-cmp">
<figure>
<svg class="fig" viewBox="0 0 220 200" role="img" aria-label="RAID 0: 디스크 2개에 데이터를 번갈아 나눠 기록한다. 디스크 1에 A1, A3, A5가, 디스크 2에 A2, A4, A6이 있다.">
<text x="110" y="22" class="c b">RAID 0</text>
<rect x="22" y="34" width="80" height="134" rx="8" class="wall"/><rect x="118" y="34" width="80" height="134" rx="8" class="wall"/>
<rect x="35" y="46" width="54" height="30" class="bx-a"/><text x="62" y="68" class="c">A1</text><rect x="131" y="46" width="54" height="30" class="bx-a"/><text x="158" y="68" class="c">A2</text>
<rect x="35" y="86" width="54" height="30" class="bx-a"/><text x="62" y="108" class="c">A3</text><rect x="131" y="86" width="54" height="30" class="bx-a"/><text x="158" y="108" class="c">A4</text>
<rect x="35" y="126" width="54" height="30" class="bx-a"/><text x="62" y="148" class="c">A5</text><rect x="131" y="126" width="54" height="30" class="bx-a"/><text x="158" y="148" class="c">A6</text>
<text x="62" y="190" class="c t-s">디스크 1</text><text x="158" y="190" class="c t-s">디스크 2</text>
</svg>
<figcaption>나눠서 기록 (스트라이핑)</figcaption>
</figure>
<figure>
<svg class="fig" viewBox="0 0 220 200" role="img" aria-label="RAID 1: 디스크 2개에 같은 데이터를 똑같이 기록한다. 두 디스크 모두 A1, A2, A3이 있다.">
<text x="110" y="22" class="c b">RAID 1</text>
<rect x="22" y="34" width="80" height="134" rx="8" class="wall"/><rect x="118" y="34" width="80" height="134" rx="8" class="wall"/>
<rect x="35" y="46" width="54" height="30" class="bx-a"/><text x="62" y="68" class="c">A1</text><rect x="131" y="46" width="54" height="30" class="bx-a"/><text x="158" y="68" class="c">A1</text>
<rect x="35" y="86" width="54" height="30" class="bx-a"/><text x="62" y="108" class="c">A2</text><rect x="131" y="86" width="54" height="30" class="bx-a"/><text x="158" y="108" class="c">A2</text>
<rect x="35" y="126" width="54" height="30" class="bx-a"/><text x="62" y="148" class="c">A3</text><rect x="131" y="126" width="54" height="30" class="bx-a"/><text x="158" y="148" class="c">A3</text>
<text x="62" y="190" class="c t-s">디스크 1</text><text x="158" y="190" class="c t-s">디스크 2</text>
</svg>
<figcaption>똑같이 두 벌 (미러링)</figcaption>
</figure>
<figure>
<svg class="fig" viewBox="0 0 220 200" role="img" aria-label="RAID 5: 디스크 3개에 데이터를 나눠 기록하고, 줄마다 패리티 P를 서로 다른 디스크에 둔다. 첫 줄은 A1, A2, P, 둘째 줄은 B1, P, B2, 셋째 줄은 P, C1, C2다.">
<text x="110" y="22" class="c b">RAID 5</text>
<rect x="8" y="34" width="60" height="134" rx="8" class="wall"/><rect x="80" y="34" width="60" height="134" rx="8" class="wall"/><rect x="152" y="34" width="60" height="134" rx="8" class="wall"/>
<rect x="16" y="46" width="44" height="30" class="bx-a"/><text x="38" y="68" class="c">A1</text><rect x="88" y="46" width="44" height="30" class="bx-a"/><text x="110" y="68" class="c">A2</text><rect x="160" y="46" width="44" height="30" class="bx-g"/><text x="182" y="68" class="c">P</text>
<rect x="16" y="86" width="44" height="30" class="bx-a"/><text x="38" y="108" class="c">B1</text><rect x="88" y="86" width="44" height="30" class="bx-g"/><text x="110" y="108" class="c">P</text><rect x="160" y="86" width="44" height="30" class="bx-a"/><text x="182" y="108" class="c">B2</text>
<rect x="16" y="126" width="44" height="30" class="bx-g"/><text x="38" y="148" class="c">P</text><rect x="88" y="126" width="44" height="30" class="bx-a"/><text x="110" y="148" class="c">C1</text><rect x="160" y="126" width="44" height="30" class="bx-a"/><text x="182" y="148" class="c">C2</text>
<text x="38" y="190" class="c t-s">디스크 1</text><text x="110" y="190" class="c t-s">디스크 2</text><text x="182" y="190" class="c t-s">디스크 3</text>
</svg>
<figcaption>나눠 쓰고 패리티(P)를 분산</figcaption>
</figure>
</div>
<h3>RAID 레벨 비교</h3>
<p>디스크 한 개의 크기를 S, 디스크 개수를 n이라고 할 때의 비교입니다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>레벨</th><th>방식</th><th>최소 디스크</th><th>사용 가능한 용량</th><th>성능</th><th>견디는 디스크 고장</th></tr></thead><tbody>
<tr><td class="nw"><b>RAID 0</b></td><td>스트라이핑</td><td>2개</td><td class="nw">n × S</td><td>읽기·쓰기 모두 빠름</td><td><b>0개</b>. 하나만 고장 나도 전부 잃음</td></tr>
<tr><td class="nw"><b>RAID 1</b></td><td>미러링</td><td>2개</td><td class="nw">S <span class="small muted">(2개일 때)</span></td><td>읽기 빠름, 쓰기는 디스크 한 개 수준</td><td><b>1개</b></td></tr>
<tr><td class="nw"><b>RAID 5</b></td><td>스트라이핑 + 패리티 1개분</td><td>3개</td><td class="nw">(n − 1) × S</td><td>읽기 빠름, 쓰기는 패리티 계산 때문에 느려짐</td><td><b>1개</b></td></tr>
<tr><td class="nw"><b>RAID 6</b></td><td>스트라이핑 + 패리티 2개분</td><td>4개</td><td class="nw">(n − 2) × S</td><td>읽기 빠름, 쓰기는 RAID 5보다 더 느림</td><td><b>2개</b></td></tr>
<tr><td class="nw"><b>RAID 10</b></td><td>미러링한 쌍들에 스트라이핑</td><td>4개</td><td class="nw">(n ÷ 2) × S</td><td>읽기·쓰기 모두 빠름</td><td><b>1개</b>는 확실. 서로 다른 쌍이면 더 견딤</td></tr>
</tbody></table></div>
<ul><li><b>예</b>: 4TB 디스크 6개라면 RAID 0은 24TB, RAID 5는 20TB, RAID 6은 16TB, RAID 10은 12TB입니다.</li><li>안전하게 할수록 쓸 수 있는 용량이 줄어듭니다. 용량, 성능, 안전 가운데 무엇이 중요한지에 따라 고릅니다.</li><li>RAID 0은 고장에 대비하지 못하므로 잃어도 되는 데이터에만 씁니다.</li><li>디스크가 크고 많을수록, 고장 난 디스크를 복구하는 동안 하나가 더 고장 날 위험이 커집니다. 그래서 큰 구성에는 RAID 5보다 RAID 6이나 RAID 10을 많이 씁니다.</li></ul>
<p class="small muted">위 용량은 계산상의 값입니다. 실제 장비는 내부 용도로 쓰는 공간과 예비 디스크 때문에 이보다 조금 적게 나옵니다. 성능은 디스크의 종류, 개수, 장비에 따라 달라집니다.</p>
<h3>디스크가 고장 났을 때</h3>
<ul><li>RAID 1·5·6·10은 디스크 하나가 고장 나도 서비스가 계속됩니다. 다만 그동안은 여유가 줄어든 상태입니다.</li><li>고장 난 디스크를 새것으로 바꾸면, 남은 데이터와 패리티(또는 미러)로 새 디스크를 다시 채웁니다. 이 작업을 <b>재구성</b><span class="small muted">(Rebuild)</span>이라고 합니다. 재구성하는 동안은 성능이 떨어집니다.</li><li><b>핫 스페어</b><span class="small muted">(Hot Spare)</span>는 미리 꽂아 둔 예비 디스크입니다. 고장이 나면 사람이 오기 전에 자동으로 재구성을 시작합니다.</li></ul>
<div class="box warn"><span class="lbl">RAID는 백업이 아닙니다</span><p>RAID가 막아 주는 것은 <b>디스크 고장</b> 하나뿐입니다. 아래 경우에는 RAID가 있어도 데이터를 잃습니다.</p><ul><li>파일을 실수로 지우거나 덮어썼을 때. RAID는 그 삭제까지 모든 디스크에 똑같이 반영합니다.</li><li>랜섬웨어나 프로그램 오류로 데이터가 망가졌을 때</li><li>견딜 수 있는 개수보다 많은 디스크가 고장 났을 때</li><li>장비 전체나 건물에 문제가 생겼을 때(화재, 침수, 정전)</li></ul><p style="margin-bottom:0">그래서 RAID와 별도로 <b>백업</b>이 필요합니다. 백업, 스냅샷, 복제는 <a data-lesson="d13"></a>에서 배웁니다.</p></div>

<h2 id="s4">DAS와 SAN: 스토리지를 서버에 연결하는 방식</h2>
<p><a data-lesson="d01"></a>에서 스토리지를 연결하는 방식으로 DAS, NAS, SAN을 한 줄씩 봤습니다. Block Storage와 관련된 것은 DAS와 SAN입니다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>DAS</th><th>SAN</th></tr></thead><tbody>
<tr><td class="nw"><b>연결</b></td><td>서버에 직접 꽂거나 케이블로 바로 연결</td><td>스토리지와 서버들을 전용 네트워크로 연결</td></tr>
<tr><td class="nw"><b>누가 쓰나</b></td><td>그 서버 한 대</td><td>여러 서버가 스토리지 한 대에서 각자 Volume을 받아 씀</td></tr>
<tr><td class="nw"><b>좋은 점</b></td><td>단순하고 빠름</td><td>용량을 한곳에 모아 나눠 쓰고, Volume을 다른 서버로 옮겨 연결할 수 있음</td></tr>
<tr><td class="nw"><b>아쉬운 점</b></td><td>서버가 고장 나면 그 디스크도 함께 쓸 수 없음. 남는 용량을 다른 서버와 나눌 수 없음</td><td>네트워크와 스토리지 장비가 필요하고, 네트워크의 품질이 디스크의 성능이 됨</td></tr>
</tbody></table></div>
<p class="small muted">DAS: Direct Attached Storage · SAN: Storage Area Network. NAS(Network Attached Storage)는 파일 단위로 공유하는 방식이고 <a data-lesson="d12"></a>에서 배웁니다.</p>
<svg class="fig" viewBox="0 0 560 232" role="img" aria-label="SAN 그림. 스토리지 한 대에 Volume 세 개가 있고, SAN이라는 전용 네트워크를 거쳐 서버 A, B, C에 각각 Volume 1, 2, 3이 연결된다.">
<use href="#i-storage" x="30" y="88" width="56" height="56" class="acc"/><text x="58" y="166" class="c">스토리지</text><text x="58" y="188" class="c t-s">Volume 3개</text>
<line x1="88" y1="116" x2="252" y2="116" class="ln"/>
<use href="#i-switch" x="252" y="88" width="56" height="56"/><text x="280" y="166" class="c">SAN</text><text x="280" y="188" class="c t-s">전용 네트워크</text>
<line x1="306" y1="110" x2="412" y2="44" class="ln"/><line x1="306" y1="116" x2="412" y2="116" class="ln"/><line x1="306" y1="122" x2="412" y2="188" class="ln"/>
<use href="#i-server" x="412" y="20" width="48" height="48"/><text x="468" y="40">서버 A</text><text x="468" y="62" class="t-s">Volume 1</text>
<use href="#i-server" x="412" y="92" width="48" height="48"/><text x="468" y="112">서버 B</text><text x="468" y="134" class="t-s">Volume 2</text>
<use href="#i-server" x="412" y="164" width="48" height="48"/><text x="468" y="184">서버 C</text><text x="468" y="206" class="t-s">Volume 3</text>
</svg>
<p class="fig-cap">서버마다 자기 Volume만 보입니다. 서버에는 그 Volume이 자기 디스크처럼 나타납니다.</p>
<h3>SAN을 만드는 두 가지 기술</h3>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>Fibre Channel <span class="small muted">FC</span></th><th>iSCSI</th></tr></thead><tbody>
<tr><td class="nw"><b>네트워크</b></td><td>스토리지 전용 장비와 케이블을 따로 구성</td><td>일반 네트워크(이더넷, IP) 위에서 동작</td></tr>
<tr><td class="nw"><b>서버에 필요한 것</b></td><td>전용 카드(HBA)</td><td>일반 NIC와 소프트웨어</td></tr>
<tr><td class="nw"><b>특징</b></td><td>성능이 안정적. 비용이 높음</td><td>구성하기 쉽고 비용이 낮음. 네트워크 설계에 따라 성능이 달라짐</td></tr>
</tbody></table></div>
<p class="small muted">HBA: Host Bus Adapter · NIC: Network Interface Card(<a data-lesson="d02"></a>). Zadara zStorage는 Block 방식으로 Fibre Channel, iSCSI, iSER를 제공합니다. iSER(iSCSI Extensions for RDMA)는 iSCSI를 더 빠른 전송 기술 위에서 쓰는 방식입니다.</p>

<h2 id="s5">iSCSI: IP 네트워크로 디스크를 연결하기</h2>
<p>서버가 디스크를 읽고 쓸 때 쓰는 명령 체계를 SCSI<span class="small muted">(Small Computer System Interface)</span>라고 합니다. <b>iSCSI</b><span class="small muted">(Internet SCSI)</span>는 이 명령을 IP<span class="small muted">(Internet Protocol)</span> 네트워크로 실어 나르는 프로토콜입니다. 서버 안의 케이블로 오가던 명령이 네트워크를 건너 스토리지까지 가는 것입니다. TCP<span class="small muted">(Transmission Control Protocol)</span> 위에서 동작하고 기본 포트는 <b>3260</b>입니다(<a data-lesson="d09"></a>).</p>
<div class="tbl-wrap"><table><thead><tr><th>이름</th><th>누구</th><th>하는 일</th></tr></thead><tbody>
<tr><td class="nw"><b>Initiator</b></td><td>서버 쪽</td><td>접속을 시작하고, 읽기·쓰기 명령을 보냄</td></tr>
<tr><td class="nw"><b>Target</b></td><td>스토리지 쪽</td><td>접속을 받아 Volume(LUN)을 내줌</td></tr>
<tr><td class="nw"><b>IQN</b></td><td>양쪽</td><td>Initiator와 Target을 구분하는 이름. 예: <code>iqn.2026-11.com.example:server01</code></td></tr>
</tbody></table></div>
<p class="small muted">IQN: iSCSI Qualified Name. 위 이름은 예시입니다.</p>
<p>연결은 세 단계로 이루어집니다.</p>
<ol><li><b>허용</b>: 스토리지에서 "이 Volume은 이 Initiator(서버)가 써도 된다"고 정해 둡니다. 허용하지 않은 서버에는 Volume이 보이지 않습니다.</li><li><b>찾기</b>: 서버가 스토리지에 "어떤 Target이 있나" 하고 묻습니다(Discovery).</li><li><b>접속</b>: 서버가 Target에 접속합니다(Login). 접속되면 서버에 새 디스크가 나타납니다.</li></ol>
<p>Linux 서버에서는 <code>iscsiadm</code> 명령을 씁니다. 아래는 학습용 예시이고, 주소는 지어낸 값입니다.</p>
<pre class="code">sudo iscsiadm -m discovery -t sendtargets -p 10.0.5.10   <span class="c"># 찾기: 이 스토리지가 내주는 Target을 물어봄</span>
sudo iscsiadm -m node --login                            <span class="c"># 접속: 찾은 Target에 로그인</span>
sudo iscsiadm -m session                                 <span class="c"># 확인: 지금 접속해 있는 세션</span>
lsblk                                                    <span class="c"># 새 디스크가 생겼는지 확인 (예: sdb)</span></pre>
<p class="small muted">Initiator를 스토리지에 등록하는 방법과 인증 설정은 스토리지 제품마다 다릅니다. Zadara zStorage에서 iSCSI로 Volume을 연결하는 실습은 <a data-lesson="zs2"></a>에서 합니다.</p>
<p>iSCSI에서는 <b>네트워크가 곧 디스크 케이블</b>입니다. 그래서 다음을 챙깁니다.</p>
<ul><li>스토리지용 통신은 일반 서비스 통신과 네트워크를 나눕니다(전용 Subnet이나 VLAN, <a data-lesson="d08"></a>).</li><li>서버와 스토리지 사이에서 3260번 포트가 허용되어야 합니다(<a data-lesson="d10"></a>).</li><li>네트워크가 느리거나 끊기면 디스크가 느려지거나 사라집니다. 경로를 둘 이상 두는 <b>멀티패스</b>로 대비합니다.</li></ul>

<h2 id="s6">종합: 서버가 Block Volume을 쓰기까지</h2>
<p>지금까지 배운 것을 한 장으로 잇습니다. 왼쪽은 스토리지에서 하는 일이고, 오른쪽은 서버에서 하는 일입니다.</p>
<svg class="fig" viewBox="0 0 560 430" role="img" aria-label="Block Volume 사용 과정. 스토리지에서: 1번, 물리 디스크 여러 개를 RAID로 묶어 풀을 만든다. 2번, 풀에서 필요한 크기만큼 Volume(LUN)을 잘라 낸다. 3번, iSCSI(TCP 3260)나 클라우드의 연결 기능으로 Volume을 서버에 연결한다. 서버에서: 4번, 새 디스크(/dev/sdb)로 보인다. 5번, 파일시스템을 만든다. 6번, /data에 마운트해서 쓴다.">
<text x="115" y="20" class="c b">스토리지</text><rect x="8" y="28" width="214" height="264" rx="10" class="zone"/>
<use href="#i-db" x="24" y="42" width="40" height="40"/><use href="#i-db" x="74" y="42" width="40" height="40"/><use href="#i-db" x="124" y="42" width="40" height="40"/><use href="#i-db" x="174" y="42" width="40" height="40"/>
<text x="120" y="102" class="c t-s">물리 디스크 여러 개</text>
<line x1="120" y1="108" x2="120" y2="132" class="ln" marker-end="url(#ar)"/>
<rect x="24" y="136" width="192" height="44" rx="4" class="bx-n"/><text x="120" y="164" class="c">RAID로 묶은 풀</text>
<line x1="120" y1="184" x2="120" y2="208" class="ln" marker-end="url(#ar)"/>
<rect x="44" y="212" width="152" height="44" rx="4" class="bx-a"/><text x="120" y="240" class="c b">Volume (LUN)</text>
<text x="120" y="278" class="c t-s">필요한 크기만큼 잘라 냄</text>
<line x1="198" y1="234" x2="344" y2="234" class="ln acc" marker-end="url(#ar-acc)"/>
<text x="275" y="222" class="c t-m">iSCSI · 3260</text><text x="275" y="258" class="c t-s">클라우드: 연결</text>
<text x="440" y="172" class="c b">서버</text><rect x="328" y="180" width="224" height="240" rx="10" class="zone"/>
<rect x="348" y="212" width="184" height="44" rx="4" class="bx-a"/><text x="440" y="240" class="c b">새 디스크 /dev/sdb</text>
<line x1="440" y1="260" x2="440" y2="286" class="ln" marker-end="url(#ar)"/>
<rect x="348" y="290" width="184" height="44" rx="4" class="bx-n"/><text x="440" y="318" class="c">파일시스템 만들기</text>
<line x1="440" y1="338" x2="440" y2="360" class="ln" marker-end="url(#ar)"/>
<rect x="348" y="364" width="184" height="44" rx="4" class="bx-g"/><text x="440" y="392" class="c">/data 에 마운트</text>
<g class="badge"><circle cx="146" cy="120" r="11"/><text x="146" y="125.5">1</text></g>
<g class="badge"><circle cx="146" cy="196" r="11"/><text x="146" y="201.5">2</text></g>
<g class="badge"><circle cx="270" cy="186" r="11"/><text x="270" y="191.5">3</text></g>
<g class="badge"><circle cx="348" cy="212" r="11"/><text x="348" y="217.5">4</text></g>
<g class="badge"><circle cx="466" cy="273" r="11"/><text x="466" y="278.5">5</text></g>
<g class="badge"><circle cx="466" cy="349" r="11"/><text x="466" y="354.5">6</text></g>
</svg>
<p class="fig-cap">번호는 아래 순서와 같습니다. 스토리지가 준 Volume은 서버에서 그냥 디스크로 보입니다.</p>
<ol><li><b>RAID로 묶기</b> (스토리지): 물리 디스크 여러 개를 RAID로 묶어 스토리지 풀을 만듭니다. 디스크 하나가 고장 나도 데이터를 지킵니다.</li><li><b>Volume 만들기</b> (스토리지): 풀에서 필요한 크기(예: 100GB)만큼 Volume을 만듭니다.</li><li><b>서버에 연결하기</b>: 스토리지에서 이 서버가 Volume을 쓰도록 허용하고, 서버가 iSCSI로 접속합니다. 클라우드에서는 화면에서 VM에 Volume을 연결합니다.</li><li><b>새 디스크로 보임</b> (서버): <code>lsblk</code>에 새 디스크가 나타납니다. 아직 파일시스템이 없는 빈 디스크입니다.</li><li><b>파일시스템 만들기</b> (서버): <code>mkfs</code>로 파일시스템을 만듭니다.</li><li><b>마운트해서 쓰기</b> (서버): 디렉터리에 마운트하고, 재부팅해도 연결되도록 <code>/etc/fstab</code>에 등록합니다.</li></ol>
<p>4번부터는 <a data-lesson="d06"></a>의 "새 디스크 연결 전체 절차"와 같습니다. 디스크가 서버 안에 꽂힌 것이든 스토리지에서 온 Volume이든, 서버에서 하는 일은 같습니다.</p>
<pre class="code">lsblk                          <span class="c"># 새 디스크 확인. 크기로 맞는 디스크인지 본다</span>
sudo mkfs.xfs /dev/sdb         <span class="c"># 파일시스템 만들기 (장치 이름을 두 번 확인)</span>
sudo mkdir /data
sudo mount /dev/sdb /data      <span class="c"># 마운트</span>
df -h                          <span class="c"># /data 가 보이는지 확인</span>
sudo blkid /dev/sdb            <span class="c"># UUID를 확인해서 /etc/fstab에 등록</span></pre>
<p class="small muted">UUID: Universally Unique Identifier. 새 디스크의 이름(<code>sdb</code>, <code>vdb</code>, <code>nvme1n1</code> 등)은 연결 방식과 환경에 따라 다릅니다. 이름을 짐작하지 말고 <code>lsblk</code>에서 크기를 보고 확인합니다.</p>
<h3>서버에 새 디스크가 보이지 않을 때</h3>
<div class="tbl-wrap"><table class="wide"><thead><tr><th style="width:46%">원인이 될 수 있는 것</th><th style="width:54%">확인</th></tr></thead><tbody>
<tr><td>스토리지에서 이 서버에 Volume을 연결(허용)하지 않음</td><td>스토리지나 클라우드의 화면에서 Volume의 연결 상태</td></tr>
<tr><td>서버가 스토리지에 닿지 못함(경로가 없거나 3260번 포트가 막힘)</td><td><code>nc -zv 스토리지주소 3260</code>(<a data-lesson="d09"></a>), 방화벽 규칙(<a data-lesson="d10"></a>)</td></tr>
<tr><td>서버가 Target에 접속하지 않았거나 접속에 실패함</td><td><code>sudo iscsiadm -m session</code></td></tr>
<tr><td>Volume이 다른 서버에 연결되어 있음</td><td>Volume의 연결 대상</td></tr>
<tr><td>디스크는 생겼는데 이름이 예상과 다름</td><td><code>lsblk</code>에서 크기로 찾기</td></tr>
</tbody></table></div>
<p class="small muted">증상은 "디스크가 안 보인다" 하나지만 원인은 여러 가지입니다. 스토리지 쪽, 네트워크, 서버 쪽 순서로 하나씩 확인합니다.</p>

<h2 id="s7">클라우드의 Block Volume</h2>
<p>클라우드에서는 RAID, 풀, SAN을 사용자가 직접 다루지 않습니다. 그 일은 클라우드가 맡고, 사용자는 <b>Volume을 만들고 VM에 연결</b>하는 것만 합니다. 그 뒤에 VM 안에서 하는 일은 위와 같습니다.</p>
<div class="flow"><div class="n"><b>Volume 만들기</b><small>크기와 종류를 고름</small></div><span class="ar">→</span><div class="n k"><b>VM에 연결</b><small>화면이나 API에서</small></div><span class="ar">→</span><div class="n"><b>VM 안에서 확인</b><small>lsblk에 새 디스크</small></div><span class="ar">→</span><div class="n"><b>파일시스템, 마운트</b><small>mkfs, mount, fstab</small></div></div>
<ul><li>Volume은 VM과 <b>따로 존재</b>합니다. VM에서 떼어 다른 VM에 붙일 수 있습니다.</li><li>VM을 만들 때 함께 생기는 운영체제용 Volume과, 나중에 추가하는 데이터용 Volume을 구분해서 관리합니다.</li><li>이미 데이터가 들어 있는 Volume을 다른 VM에 연결했을 때는 <b>mkfs를 하지 않고</b> 마운트만 합니다.</li></ul>
<p class="small muted">Volume이 VM과 함께 지워지는지, 한 VM에만 연결되는지 같은 세부 동작은 클라우드와 설정에 따라 다릅니다. AWS(Amazon Web Services)에서는 이 서비스를 EBS(Elastic Block Store)라고 부릅니다.</p>
<div class="box"><b class="small">Zadara에서는</b><ul style="margin-bottom:0"><li>저장 서비스인 zStorage는 VPSA<span class="small muted">(Virtual Private Storage Array)</span>라는 단위로 제공됩니다. Block, File, Object를 모두 제공하고, Block은 Fibre Channel, iSCSI, iSER로 연결합니다. VPSA, 풀, Volume의 관계는 <a data-lesson="zs1"></a>에서 배웁니다.</li><li>디스크는 HDD, SSD, NVMe와 이를 섞은 구성을 쓸 수 있습니다(<a data-lesson="d02"></a>).</li><li>zCompute의 VM에 Volume을 연결하는 방법은 <a data-lesson="zc5"></a>에서, zStorage의 Volume을 iSCSI로 연결하는 방법은 <a data-lesson="zs2"></a>에서 실습합니다. 화면과 절차는 사내 실습 환경에서 확인합니다.</li></ul></div>

<h2 id="s8">Block Volume을 쓸 때 주의할 점</h2>
<ul><li><b>Volume 하나는 서버 한 대가 씁니다.</b> 일반 파일시스템(xfs, ext4)으로 만든 Volume을 서버 두 대가 동시에 마운트하면 서로 모르고 덮어써서 데이터가 깨집니다. 여러 서버가 함께 써야 하면 File Storage를 씁니다(<a data-lesson="d12"></a>).</li><li><b>mkfs는 데이터를 지웁니다.</b> 장치 이름을 <code>lsblk</code>로 다시 확인하고 실행합니다. 데이터가 든 Volume에는 mkfs를 하지 않습니다(<a data-lesson="d06"></a>).</li><li><b>fstab에는 UUID로 등록합니다.</b> 네트워크로 연결한 Volume은 네트워크가 준비된 뒤에 마운트하도록 <code>_netdev</code> 옵션을 넣고, 없어도 부팅이 되도록 <code>nofail</code>을 함께 넣는 것을 검토합니다(<a data-lesson="d06"></a>).</li><li><b>네트워크가 끊기면 디스크가 끊깁니다.</b> 쓰는 중에 경로가 끊기면 읽기·쓰기 오류가 나고 파일시스템이 읽기 전용으로 바뀔 수 있습니다. 경로를 이중으로 두는 멀티패스로 대비합니다.</li><li><b>RAID가 있어도 백업을 합니다.</b> RAID는 디스크 고장만 막습니다(<a data-lesson="d13"></a>).</li></ul>

<h2 id="s9">직접 해 보기</h2>
<p>손노트에 풀어 보세요. 먼저 풀고 나서, 문제 아래의 「답 보기」를 눌러 확인합니다.</p>
<h3>1. RAID 용량 계산하기</h3>
<p>아래 구성의 사용 가능한 용량과, 견딜 수 있는 디스크 고장 수를 적어 보세요.</p>
<ol><li>2TB 디스크 4개, RAID 5</li><li>8TB 디스크 6개, RAID 6</li><li>4TB 디스크 8개, RAID 10</li><li>1TB 디스크 2개, RAID 0</li></ol>
<details class="fold"><summary>답 보기</summary><p class="small muted">① (4 − 1) × 2 = 6TB, 1개. ② (6 − 2) × 8 = 32TB, 2개. ③ (8 ÷ 2) × 4 = 16TB, 1개는 확실하고 서로 다른 쌍이면 더 견딥니다. ④ 2 × 1 = 2TB, 0개. 하나만 고장 나도 전부 잃습니다.</p></details>
<h3>2. 사용 과정 순서 맞추기</h3>
<p>아래 일을 순서대로 놓고, 스토리지에서 하는 일과 서버에서 하는 일로 나눠 보세요.</p>
<p>마운트 · Volume 만들기 · lsblk로 새 디스크 확인 · RAID로 풀 만들기 · fstab 등록 · 서버에 Volume 연결 · 파일시스템 만들기</p>
<details class="fold"><summary>답 보기</summary><p class="small muted">스토리지: RAID로 풀 만들기 → Volume 만들기 → 서버에 Volume 연결. 서버: lsblk로 새 디스크 확인 → 파일시스템 만들기 → 마운트 → fstab 등록.</p></details>
<h3>3. 말 구분하기</h3>
<p>스토리지 풀, Volume, LUN이 각각 무엇이고 서로 어떤 관계인지 한두 문장씩 적어 보세요.</p>
<details class="fold"><summary>답 보기</summary><p class="small muted">스토리지 풀은 물리 디스크 여러 개를 묶어 만든 큰 저장 공간입니다. Volume은 그 풀에서 필요한 크기만큼 잘라 서버에 주는 논리 디스크입니다. LUN은 스토리지가 서버에 내보이는 논리 디스크에 붙이는 번호이고, 그 디스크 자체도 LUN이라고 부릅니다. Volume과 LUN은 같은 것을 다른 자리에서 부르는 말인 경우가 많습니다.</p></details>
<h3>4. 상황 판단하기</h3>
<ol><li>RAID 5로 구성한 스토리지에서 디스크 한 개가 고장 났습니다. 지금 서비스는 어떻게 되고, 무엇을 해야 하나요?</li><li>iSCSI로 Volume을 연결했는데 서버의 <code>lsblk</code>에 새 디스크가 없습니다. 무엇을 확인하나요?</li><li>동료가 "RAID 6이니까 백업은 안 해도 된다"고 합니다. 맞는 말인가요?</li></ol>
<details class="fold"><summary>답 보기</summary><p class="small muted">① 서비스는 계속됩니다. 다만 하나가 더 고장 나면 데이터를 잃는 상태입니다. 고장 난 디스크를 바꿔서 재구성을 끝내야 하고, 핫 스페어가 있으면 자동으로 재구성이 시작됩니다. ② 원인이 여러 가지일 수 있으니 차례로 봅니다. 스토리지에서 이 서버에 Volume을 허용했는지, 서버에서 스토리지의 3260번 포트에 닿는지, iSCSI 접속이 되어 있는지(<code>iscsiadm -m session</code>), Volume이 다른 서버에 연결되어 있지 않은지를 확인합니다. ③ 틀린 말입니다. RAID는 디스크 고장만 막습니다. 실수로 지운 파일, 랜섬웨어, 장비나 건물의 사고에는 백업이 있어야 복구할 수 있습니다.</p></details>
`,
summary:['Block Storage는 저장 공간을 블록 단위로 내주는 방식이다. 서버에는 디스크 한 개처럼 보이고, 파일시스템은 서버가 만든다. File·Object는 [[d12]].','스토리지는 물리 디스크를 묶어 풀을 만들고, 거기서 Volume을 잘라 서버에 준다. LUN은 서버에 내보이는 논리 디스크(와 그 번호)이고, Volume과 같은 것을 가리키는 경우가 많다.','RAID는 스트라이핑(나눠 쓰기), 미러링(두 벌), 패리티(복구용 값)의 조합이다. 용량: RAID 0 = n×S, RAID 1 = S, RAID 5 = (n−1)×S, RAID 6 = (n−2)×S, RAID 10 = (n÷2)×S.','견디는 디스크 고장: RAID 0은 0개, RAID 1·5는 1개, RAID 6은 2개, RAID 10은 1개(다른 쌍이면 더). 고장 난 디스크를 바꾸면 재구성한다. RAID는 백업이 아니다([[d13]]).','DAS는 서버에 직접 연결한 디스크, SAN은 스토리지와 서버를 잇는 전용 네트워크다. SAN은 Fibre Channel이나 iSCSI로 만든다.','iSCSI는 디스크 명령을 IP 네트워크로 나른다(TCP 3260). 서버가 Initiator, 스토리지가 Target이고 IQN으로 구분한다. 허용 → 찾기 → 접속 순서로 연결한다.','사용 과정: RAID로 풀 → Volume 만들기 → 서버에 연결 → 새 디스크로 보임(lsblk) → mkfs → mount → fstab. Volume 하나는 서버 한 대가 쓰고, mkfs는 데이터를 지우니 장치 이름을 확인한다.'],
essay:[
{q:'Block Storage가 무엇인지 설명하고, 서버에는 어떻게 보이며 파일시스템은 누가 만드는지 말해 보세요.',a:'Block Storage는 저장 공간을 같은 크기의 블록으로 나눠 번호를 붙이고, 블록 단위로 읽고 쓰게 내주는 저장 방식이다. 서버에는 자기 디스크 한 개처럼 보이고 lsblk에 새 디스크로 나타난다. 스토리지는 블록 안에 무엇이 들었는지 모르므로, 어느 블록이 어느 파일인지 정리하는 파일시스템은 서버가 직접 만든다. 빠르고 지연이 짧아서 운영체제 디스크, DB, VM의 디스크에 쓰고, Volume 하나는 한 번에 서버 한 대가 쓰는 것이 기본이다.'},
{q:'스토리지 풀, Volume, LUN의 관계를 설명해 보세요.',a:'스토리지는 물리 디스크 여러 개를 RAID로 묶어 큰 저장 공간인 스토리지 풀을 만든다. Volume은 그 풀에서 필요한 크기만큼 잘라 서버에 주는 논리 디스크다. 실제 디스크 한 개가 아니라 스토리지가 만들어 보여 주는 디스크이고, 서버는 그냥 디스크로 쓴다. LUN은 스토리지가 서버에 내보이는 논리 디스크에 붙이는 번호이고 그 디스크 자체도 LUN이라고 부른다. Volume과 LUN은 같은 것을 다른 자리에서 부르는 말인 경우가 많다. 논리 디스크라서 크기를 자유롭게 정하고, 나중에 늘리거나 다른 서버로 옮겨 연결할 수 있다.'},
{q:'RAID 0, 1, 5, 6, 10을 사용 가능한 용량, 성능, 견딜 수 있는 디스크 고장 수로 비교해 보세요.',a:'디스크 크기를 S, 개수를 n이라고 하면, RAID 0은 스트라이핑만 해서 용량이 n×S이고 읽기와 쓰기가 빠르지만 디스크 하나만 고장 나도 전부 잃는다. RAID 1은 미러링으로 용량이 S(2개일 때)이고 1개 고장을 견딘다. RAID 5는 스트라이핑에 패리티 1개분을 더해 용량이 (n−1)×S이고 1개 고장을 견디며, 쓰기는 패리티 계산 때문에 느려진다. RAID 6은 패리티 2개분으로 용량이 (n−2)×S이고 2개 고장을 견디며, 쓰기는 더 느리다. RAID 10은 미러링한 쌍들에 스트라이핑해서 용량이 (n÷2)×S이고 읽기와 쓰기가 빠르며, 1개 고장은 확실히 견디고 서로 다른 쌍이면 더 견딘다. 안전하게 할수록 쓸 수 있는 용량이 줄어든다.'},
{q:'"RAID는 백업이 아니다"가 무슨 뜻인지 설명해 보세요.',a:'RAID가 막아 주는 것은 디스크 고장뿐이다. 파일을 실수로 지우거나 덮어쓰면 RAID는 그 변경을 모든 디스크에 똑같이 반영하므로 되돌릴 수 없다. 랜섬웨어나 프로그램 오류로 데이터가 망가진 경우, 견딜 수 있는 개수보다 많은 디스크가 고장 난 경우, 장비 전체나 건물에 사고가 난 경우에도 RAID로는 복구할 수 없다. 그래서 RAID와 별도로 다른 곳에 데이터의 사본을 두는 백업이 필요하다([[d13]]).'},
{q:'DAS와 SAN의 차이를 설명하고, iSCSI에서 Initiator와 Target이 무엇인지 말해 보세요.',a:'DAS는 서버에 직접 연결한 디스크로 그 서버 한 대만 쓴다. 단순하고 빠르지만 서버가 고장 나면 그 디스크도 함께 쓸 수 없고 남는 용량을 나눌 수 없다. SAN은 스토리지와 서버들을 잇는 전용 네트워크로, 여러 서버가 스토리지 한 대에서 각자 Volume을 받아 블록 단위로 쓴다. 용량을 한곳에 모아 나눠 쓰고 Volume을 다른 서버로 옮겨 연결할 수 있다. SAN은 Fibre Channel이나 iSCSI로 만든다. iSCSI는 디스크를 읽고 쓰는 명령을 IP 네트워크로 나르는 프로토콜이고 기본 포트는 TCP 3260이다. 접속을 시작하는 서버 쪽이 Initiator, Volume을 내주는 스토리지 쪽이 Target이며, 서로를 IQN이라는 이름으로 구분한다.'},
{q:'스토리지에서 Volume을 만들어 서버가 파일을 저장하기까지의 과정을, 스토리지에서 하는 일과 서버에서 하는 일로 나눠 순서대로 설명해 보세요.',a:'스토리지에서는 먼저 물리 디스크 여러 개를 RAID로 묶어 스토리지 풀을 만들고, 풀에서 필요한 크기만큼 Volume(LUN)을 만든다. 그다음 이 Volume을 어느 서버가 쓸지 허용하고 서버에 연결한다. SAN에서는 서버가 iSCSI로 스토리지의 Target을 찾아 접속하고, 클라우드에서는 화면에서 VM에 Volume을 연결한다. 서버에서는 lsblk로 새 디스크가 생겼는지 크기로 확인하고, mkfs로 파일시스템을 만든 뒤, 디렉터리에 mount한다. 재부팅해도 연결되도록 UUID로 /etc/fstab에 등록한다. 서버 쪽 절차는 [[d06]]에서 배운 새 디스크 연결 절차와 같다. Volume 하나는 서버 한 대가 쓰고, mkfs는 데이터를 지우므로 장치 이름을 확인한 뒤에 실행한다.'}
],
quiz:[
{v:[
 {q:'Block Storage에 대한 설명으로 맞는 것은?',o:['저장 공간을 블록 단위로 내주며, 서버에는 디스크 한 개처럼 보인다','여러 서버가 함께 쓰는 공유 폴더로 보인다','주소로 파일을 올리고 내려받는 저장소다','서버의 메모리를 늘려 주는 장치다'],e:'Block Storage는 서버에 빈 디스크 한 개처럼 보입니다. 공유 폴더로 보이는 것은 File Storage, 주소로 올리고 내려받는 것은 Object Storage입니다([[d12]]).'},
 {q:'Block Storage를 주로 쓰는 곳은?',o:['운영체제 디스크, DB, VM의 디스크처럼 빠르게 읽고 써야 하는 곳','여러 서버가 같은 파일을 함께 열어야 하는 공유 폴더','웹에서 주소로 내려받는 사진과 동영상 보관','오래된 자료를 보관만 해 두는 곳'],e:'Block Storage는 읽고 쓰는 단위가 작고 지연이 짧아서 운영체제 디스크와 DB에 씁니다. Volume 하나는 서버 한 대가 쓰는 것이 기본입니다.'}
]},
{v:[
 {q:'Block Storage로 받은 Volume에서 파일과 디렉터리를 관리하는 파일시스템은 누가 만드나?',o:['Volume을 받은 서버','스토리지 장비','네트워크 스위치','아무도 만들지 않아도 바로 쓸 수 있다'],e:'스토리지는 블록만 내주고, 블록 안에 무엇이 들었는지 모릅니다. 서버가 mkfs로 파일시스템을 만들어야 파일을 저장할 수 있습니다([[d06]]).'},
 {q:'스토리지에서 받은 Block Volume은 서버에서 어떻게 보이나?',o:['lsblk에 새 디스크 한 개로 나타난다','/etc/hosts에 새 줄로 나타난다','ip addr에 새 인터페이스로 나타난다','바로 /data 디렉터리로 나타난다'],e:'서버에는 자기 디스크처럼 보입니다. lsblk에 새 디스크로 나타나고, 파일시스템을 만들고 마운트한 뒤에 디렉터리로 쓸 수 있습니다.'}
]},
{v:[
 {q:'Volume이란?',o:['스토리지 풀에서 필요한 크기만큼 잘라 서버에 주는 논리 디스크','스토리지에 꽂힌 물리 디스크 한 개','디스크 고장에 대비한 예비 디스크','스토리지와 서버를 잇는 네트워크'],e:'스토리지는 물리 디스크를 통째로 주지 않고, 디스크를 묶은 풀에서 필요한 크기만큼 잘라 Volume으로 줍니다.'},
 {q:'스토리지가 물리 디스크를 통째로 주지 않고 Volume으로 잘라 주면 좋은 점은?',o:['디스크 크기에 묶이지 않고 원하는 크기로 만들고, 나중에 늘리거나 다른 서버로 옮겨 연결할 수 있다','디스크가 절대 고장 나지 않는다','파일시스템을 만들지 않아도 된다','네트워크가 필요 없어진다'],e:'Volume은 스토리지가 만들어 보여 주는 논리 디스크입니다. 크기를 자유롭게 정할 수 있고, 데이터가 스토리지에 있으므로 다른 서버에 연결할 수도 있습니다.'}
]},
{v:[
 {q:'LUN이란?',o:['스토리지가 서버에 내보이는 논리 디스크에 붙이는 번호. 그 디스크 자체도 이렇게 부른다','디스크 하나의 회전 속도','RAID에서 복구용으로 저장하는 값','iSCSI의 기본 포트 번호'],e:'LUN(Logical Unit Number)은 서버에 내보이는 논리 디스크를 구분하는 번호이고, 그 디스크 자체를 LUN이라고도 부릅니다.'},
 {q:'Volume과 LUN의 관계로 맞는 것은?',o:['같은 논리 디스크를 다른 자리에서 부르는 말인 경우가 많다','Volume은 물리 디스크이고 LUN은 네트워크 케이블이다','LUN은 여러 Volume을 묶은 풀이다','둘은 아무 관계가 없다'],e:'스토리지를 관리하는 화면이나 클라우드에서는 Volume, SAN으로 서버에 연결하는 자리에서는 LUN이라고 부르는 경우가 많습니다. 제품마다 쓰는 말이 조금씩 다릅니다.'}
]},
{v:[
 {q:'RAID를 쓰는 주된 목적은?',o:['디스크 여러 개를 묶어 디스크 고장에 대비하거나 성능을 높인다','실수로 지운 파일을 되살린다','네트워크 속도를 높인다','서버의 메모리를 늘린다'],e:'RAID는 디스크 고장에 대비하고 성능을 높이는 기술입니다. 지운 파일을 되살리는 것은 백업의 일입니다([[d13]]).'},
 {q:'스토리지 풀을 RAID로 묶은 디스크 위에 만드는 이유는?',o:['디스크 하나가 고장 나도 풀과 그 위의 Volume이 계속 동작하게 하려고','Volume의 이름을 짧게 만들려고','네트워크 포트를 줄이려고','파일시스템을 만들지 않으려고'],e:'디스크는 언젠가 고장 납니다. RAID로 묶어 두면 디스크 하나가 고장 나도 데이터를 지키고 서비스를 계속할 수 있습니다.'}
]},
{v:[
 {q:'같은 데이터를 두 디스크에 똑같이 기록하는 방법은?',o:['미러링','스트라이핑','패리티','멀티패스'],e:'미러링은 똑같이 두 벌을 기록합니다. 스트라이핑은 나눠서 기록하고, 패리티는 복구용 계산 값을 함께 저장합니다.'},
 {q:'데이터를 여러 디스크에 나눠서 기록해 속도를 높이는 방법은?',o:['스트라이핑','미러링','패리티','재구성'],e:'스트라이핑은 여러 디스크가 동시에 일하게 해서 빠릅니다. 다만 스트라이핑만으로는 디스크 고장에 대비하지 못합니다.'},
 {q:'RAID에서 패리티의 역할은?',o:['디스크 하나가 고장 났을 때 사라진 데이터를 다시 계산해 내기 위한 값','데이터를 암호화하는 열쇠','디스크의 온도를 재는 값','Volume의 이름'],e:'패리티는 복구용 계산 값입니다. 남은 데이터와 패리티로 고장 난 디스크의 내용을 다시 계산해 냅니다.'}
]},
{v:[
 {q:'RAID 0에서 디스크 한 개가 고장 나면?',o:['전체 데이터를 잃는다','나머지 디스크로 계속 쓸 수 있다','패리티로 복구된다','미러에서 복구된다'],e:'RAID 0은 스트라이핑만 합니다. 데이터가 여러 디스크에 나뉘어 있어서 하나만 고장 나도 전부 잃습니다.'},
 {q:'RAID 0의 특징으로 맞는 것은?',o:['용량을 모두 쓰고 빠르지만, 디스크 고장에 대비하지 못한다','용량이 절반이 되고 1개 고장을 견딘다','패리티로 2개 고장을 견딘다','디스크 한 개로 구성한다'],e:'RAID 0은 n개의 용량을 모두 쓰고 읽기와 쓰기가 빠릅니다. 대신 디스크 고장에 대비하지 못하므로 잃어도 되는 데이터에만 씁니다.'}
]},
{v:[
 {q:'RAID 5가 견딜 수 있는 디스크 고장은 몇 개인가?',o:['1개','0개','2개','디스크 수의 절반'],e:'RAID 5는 패리티 1개분을 두어 디스크 1개 고장을 견딥니다. 2개가 동시에 고장 나면 데이터를 잃습니다.'},
 {q:'RAID 1과 RAID 5의 차이로 맞는 것은?',o:['RAID 1은 똑같이 두 벌을 기록하고, RAID 5는 나눠 쓰면서 패리티를 함께 저장한다','RAID 1은 패리티를 쓰고, RAID 5는 미러링한다','RAID 1은 고장에 대비하지 못하고, RAID 5만 대비한다','둘 다 디스크 2개로만 구성한다'],e:'RAID 1은 미러링, RAID 5는 스트라이핑과 패리티입니다. 둘 다 디스크 1개 고장을 견디지만, RAID 5가 쓸 수 있는 용량의 비율이 더 높습니다.'}
]},
{v:[
 {q:'디스크 2개가 동시에 고장 나도 데이터를 지키는 RAID 레벨은?',o:['RAID 6','RAID 0','RAID 5','디스크 2개로 만든 RAID 1'],e:'RAID 6은 패리티 2개분을 두어 디스크 2개 고장을 견딥니다. RAID 5와 2개짜리 RAID 1은 1개까지만 견딥니다.'},
 {q:'RAID 10의 구성은?',o:['미러링한 쌍을 여러 개 만들고, 그 쌍들에 스트라이핑한다','스트라이핑만 한다','패리티 2개분을 둔다','디스크 한 개에 두 번 기록한다'],e:'RAID 10은 RAID 1(미러링)과 RAID 0(스트라이핑)을 합친 것입니다. 용량은 절반이지만 읽기와 쓰기가 모두 빠릅니다.'},
 {q:'RAID 5보다 RAID 6을 쓰는 이유는?',o:['디스크 1개가 고장 난 뒤 복구하는 동안 하나가 더 고장 나도 데이터를 지키려고','쓸 수 있는 용량이 더 많아서','쓰기 속도가 더 빨라서','디스크가 더 적게 필요해서'],e:'RAID 6은 용량과 쓰기 속도를 조금 더 내주고 2개 고장을 견딥니다. 디스크가 크고 많을수록 재구성 중에 하나가 더 고장 날 위험이 커집니다.'}
]},
{gen(){
  const R=n=>Math.floor(Math.random()*n), S=[1,2,4,8][R(4)];
  const L=[['RAID 0',[2,3,4,6],n=>n,'n × S'],['RAID 1',[2],n=>1,'S(디스크 한 개 분량)'],['RAID 5',[3,4,5,6],n=>n-1,'(n − 1) × S'],['RAID 6',[4,5,6,8],n=>n-2,'(n − 2) × S'],['RAID 10',[4,6,8],n=>n/2,'(n ÷ 2) × S']][R(5)];
  const n=L[1][R(L[1].length)], ans=L[2](n)*S;
  const w=[...new Set([n*S,(n-1)*S,(n-2)*S,n/2*S,S])].filter(x=>x>0&&x!==ans).slice(0,3);   // 오답: 다른 레벨의 공식으로 계산한 값
  for(const x of [n*S*2,(n+1)*S,S*3,S*5]) if(w.length<3&&x!==ans&&!w.includes(x)) w.push(x);
  return {q:S+'TB 디스크 '+n+'개를 '+L[0]+'(으)로 묶으면 사용 가능한 용량은? (디스크 크기는 모두 같고, 장비가 내부 용도로 쓰는 공간과 예비 디스크는 계산하지 않음)',
    o:[ans].concat(w).map(x=>x+'TB'),
    e:L[0]+'의 사용 가능한 용량은 '+L[3]+'입니다. 디스크 한 개가 '+S+'TB이고 '+n+'개이므로 '+ans+'TB입니다.'};
}},
{v:[
 {q:'RAID 5로 구성한 디스크 가운데 2개가 동시에 고장 나면?',o:['데이터를 잃는다. RAID 5는 1개 고장까지만 견딘다','패리티로 모두 복구된다','성능만 느려지고 데이터는 안전하다','자동으로 RAID 6으로 바뀐다'],e:'RAID 5의 패리티는 1개분입니다. 2개가 동시에 고장 나면 남은 정보로 계산해 낼 수 없습니다.'},
 {q:'견딜 수 있는 디스크 고장 수가 가장 많은 것은? (디스크 6개 기준, 반드시 견디는 개수)',o:['RAID 6','RAID 5','RAID 0','RAID 10'],e:'RAID 6은 어느 2개가 고장 나도 견딥니다. RAID 5는 1개, RAID 0은 0개입니다. RAID 10은 서로 다른 쌍이면 더 견디지만, 같은 쌍의 2개가 고장 나면 잃으므로 반드시 견디는 것은 1개입니다.'}
]},
{v:[
 {q:'"RAID는 백업이 아니다"라는 말의 뜻은?',o:['RAID는 디스크 고장만 막고, 실수로 지운 파일이나 랜섬웨어 같은 피해는 막지 못한다','RAID는 백업보다 느리다','RAID를 쓰면 백업 용량이 줄어든다','RAID는 디스크가 2개 이상 필요하다'],e:'RAID는 삭제나 덮어쓰기까지 모든 디스크에 똑같이 반영합니다. 그런 피해에서 복구하려면 따로 보관한 사본, 곧 백업이 필요합니다([[d13]]).'},
 {q:'RAID 1로 미러링한 서버에서 파일을 실수로 지웠다. 어떻게 되나?',o:['두 디스크에서 모두 지워져서 RAID로는 되살릴 수 없다','다른 디스크에 남아 있어서 바로 되살릴 수 있다','패리티로 다시 계산해 낼 수 있다','핫 스페어에서 가져올 수 있다'],e:'미러링은 변경을 두 디스크에 똑같이 반영합니다. 삭제도 마찬가지입니다. 지운 파일은 백업이나 스냅샷이 있어야 되살릴 수 있습니다.'},
 {q:'RAID 6으로 구성했는데도 백업이 필요한 이유로 맞지 않는 것은?',o:['디스크 한 개가 고장 나면 RAID 6은 데이터를 지키지 못해서','실수로 지우거나 덮어쓴 데이터는 RAID로 되돌릴 수 없어서','랜섬웨어가 데이터를 망가뜨리면 모든 디스크에 반영되어서','장비 전체나 건물에 사고가 나면 디스크가 모두 영향을 받아서'],e:'RAID 6은 디스크 2개 고장까지 견디므로 첫 번째 보기는 틀린 설명입니다. 나머지는 모두 RAID가 막지 못하는 경우라서 백업이 필요한 이유입니다.'}
]},
{v:[
 {q:'RAID에서 고장 난 디스크를 새것으로 바꾼 뒤, 남은 데이터와 패리티로 새 디스크를 다시 채우는 작업은?',o:['재구성(Rebuild)','스트라이핑','마운트','Discovery'],e:'재구성하는 동안은 성능이 떨어지고, 그동안 견딜 수 있는 고장 수가 줄어든 상태입니다.'},
 {q:'핫 스페어(Hot Spare)의 역할은?',o:['디스크가 고장 나면 자동으로 대신 들어가 재구성을 시작하는 예비 디스크','자주 읽는 데이터를 빠르게 돌려주는 캐시','다른 건물에 두는 백업 장치','Volume의 크기를 늘려 주는 기능'],e:'핫 스페어는 미리 꽂아 둔 예비 디스크입니다. 사람이 디스크를 바꾸러 오기 전에 재구성을 시작할 수 있습니다.'}
]},
{v:[
 {q:'DAS와 SAN의 차이로 맞는 것은?',o:['DAS는 서버에 직접 연결한 디스크이고, SAN은 스토리지와 서버들을 전용 네트워크로 연결한다','DAS는 파일 단위, SAN은 주소 단위로 저장한다','DAS는 여러 서버가 함께 쓰고, SAN은 서버 한 대만 쓴다','둘은 같은 것의 다른 이름이다'],e:'DAS는 그 서버만 쓰는 직접 연결 방식입니다. SAN에서는 여러 서버가 스토리지 한 대에서 각자 Volume을 받아 씁니다.'},
 {q:'SAN의 좋은 점은?',o:['용량을 한곳에 모아 여러 서버에 나눠 주고, Volume을 다른 서버로 옮겨 연결할 수 있다','네트워크가 필요 없다','디스크가 고장 나지 않는다','파일을 여러 서버가 동시에 열 수 있는 공유 폴더가 된다'],e:'SAN은 저장 공간을 스토리지에 모아 관리합니다. 서버가 고장 나도 데이터는 스토리지에 있어서 다른 서버에 연결할 수 있습니다. 공유 폴더는 File Storage입니다.'}
]},
{v:[
 {q:'SAN을 만드는 Fibre Channel과 iSCSI의 차이는?',o:['Fibre Channel은 전용 장비와 케이블을 쓰고, iSCSI는 일반 IP 네트워크 위에서 동작한다','Fibre Channel은 파일 단위, iSCSI는 블록 단위다','Fibre Channel은 무선, iSCSI는 유선이다','iSCSI는 전용 카드(HBA)가 반드시 필요하다'],e:'둘 다 블록 단위로 연결합니다. Fibre Channel은 전용 장비로 구성하고, iSCSI는 일반 NIC와 이더넷으로 구성할 수 있어 비용이 낮습니다.'},
 {q:'iSCSI로 SAN을 구성할 때 네트워크의 품질이 중요한 이유는?',o:['디스크를 읽고 쓰는 명령이 네트워크로 오가므로, 네트워크가 느리거나 끊기면 디스크가 느려지거나 끊긴다','iSCSI가 암호화를 하지 않아서','네트워크가 빠르면 RAID가 필요 없어져서','IP 주소가 부족해져서'],e:'iSCSI에서는 네트워크가 곧 디스크 케이블입니다. 그래서 스토리지용 네트워크를 따로 두고, 경로를 이중으로 두는 멀티패스로 대비합니다.'}
]},
{v:[
 {q:'iSCSI란?',o:['디스크를 읽고 쓰는 명령(SCSI)을 IP 네트워크로 실어 나르는 프로토콜','이름을 IP 주소로 바꿔 주는 프로토콜','웹 요청을 암호화하는 프로토콜','파일을 여러 서버가 공유하는 프로토콜'],e:'iSCSI는 SCSI 명령을 TCP/IP 위로 나릅니다. 기본 포트는 TCP 3260입니다.'},
 {q:'iSCSI가 쓰는 기본 포트와, 서버와 스토리지 사이에서 그 포트가 막혀 있을 때의 결과는?',o:['TCP 3260. 서버가 스토리지에 접속하지 못해 새 디스크가 나타나지 않는다','TCP 22. 서버에 SSH 접속이 안 된다','TCP 443. 인증서 경고가 뜬다','UDP 53. 이름을 찾지 못한다'],e:'iSCSI는 TCP 3260번 포트로 접속합니다. 방화벽이나 Security Group이 이 포트를 허용해야 합니다([[d10]]).'}
]},
{v:[
 {q:'iSCSI에서 Initiator와 Target은 각각 누구인가?',o:['Initiator는 접속을 시작하는 서버 쪽, Target은 Volume을 내주는 스토리지 쪽','Initiator는 스토리지 쪽, Target은 서버 쪽','둘 다 스토리지 안의 디스크','둘 다 네트워크 스위치'],e:'서버(Initiator)가 스토리지(Target)에 접속해서 Volume을 받습니다. 서로를 IQN이라는 이름으로 구분합니다.'},
 {q:'iSCSI로 Volume을 연결하는 순서는?',o:['스토리지에서 서버를 허용 → 서버가 Target을 찾기 → 서버가 Target에 접속','서버가 접속 → 스토리지에서 허용 → 서버가 찾기','서버가 파일시스템 만들기 → 접속 → 허용','스토리지가 서버에 접속 → 서버가 허용'],e:'허용하지 않은 서버에는 Volume이 보이지 않습니다. 허용한 뒤 서버가 Target을 찾고(Discovery) 접속하면(Login) 새 디스크가 나타납니다.'}
]},
{v:[
 {q:'서버가 스토리지의 Block Volume을 쓰기까지의 순서로 맞는 것은?',o:['RAID로 풀 만들기 → Volume 만들기 → 서버에 연결 → 파일시스템 만들기 → 마운트','마운트 → Volume 만들기 → 파일시스템 만들기 → 서버에 연결','파일시스템 만들기 → RAID로 풀 만들기 → 마운트 → Volume 만들기','서버에 연결 → 마운트 → Volume 만들기 → 파일시스템 만들기'],e:'스토리지에서 풀과 Volume을 만들어 서버에 연결하면 서버에 새 디스크로 보입니다. 서버는 파일시스템을 만들고 마운트해서 씁니다.'},
 {q:'새 Volume이 서버에 연결된 뒤, 서버에서 하는 일의 순서는?',o:['lsblk로 확인 → mkfs → mount → fstab 등록','mount → mkfs → lsblk → fstab 등록','fstab 등록 → mount → mkfs → lsblk','mkfs → fstab 등록 → lsblk → mount'],e:'먼저 새 디스크를 확인하고, 파일시스템을 만들고, 마운트한 뒤, 재부팅해도 연결되도록 fstab에 등록합니다([[d06]]).'}
]},
{v:[
 {q:'일반 파일시스템(xfs, ext4)으로 만든 Volume 하나를 서버 두 대가 동시에 마운트하면?',o:['서로 모르고 덮어써서 데이터가 깨질 수 있다','두 서버가 안전하게 파일을 공유한다','속도가 두 배가 된다','자동으로 RAID 1이 된다'],e:'Block Volume 하나는 서버 한 대가 쓰는 것이 기본입니다. 여러 서버가 함께 써야 하면 File Storage를 씁니다([[d12]]).'},
 {q:'이미 데이터가 들어 있는 Volume을 다른 서버에 연결했다. 서버에서 해야 할 일은?',o:['mkfs를 하지 않고 마운트만 한다','mkfs로 파일시스템을 새로 만든 뒤 마운트한다','RAID를 다시 구성한다','Volume을 지우고 새로 만든다'],e:'mkfs는 데이터를 지웁니다. 데이터가 든 Volume은 파일시스템이 이미 있으므로 마운트만 합니다.'},
 {q:'네트워크로 연결한 Volume을 /etc/fstab에 등록할 때 _netdev 옵션을 넣는 이유는?',o:['네트워크가 준비된 뒤에 마운트하게 하려고','마운트 속도를 높이려고','Volume을 읽기 전용으로 만들려고','UUID를 쓰지 않으려고'],e:'네트워크가 올라오기 전에 마운트하려고 하면 실패합니다. _netdev는 네트워크 장치라는 것을 알려서 순서를 맞춥니다([[d06]]).'}
]},
{v:[
 {q:'iSCSI로 Volume을 연결했는데 서버의 lsblk에 새 디스크가 없다. 확인할 것으로 알맞지 않은 것은?',o:['서버의 /etc/hosts에 도메인 이름을 적었는지','스토리지에서 이 서버에 Volume을 허용했는지','서버에서 스토리지의 3260번 포트에 닿는지','서버가 Target에 접속해 있는지'],e:'디스크가 안 보이는 원인은 허용 설정, 네트워크와 포트, iSCSI 접속 가운데 하나일 수 있어서 차례로 확인합니다. /etc/hosts는 이름을 IP 주소로 바꾸는 파일이라 직접 관계가 없습니다.'},
 {q:'클라우드에서 VM에 새 Volume을 연결했다. VM 안에서 이어서 해야 하는 일은?',o:['lsblk로 새 디스크를 확인하고, 파일시스템을 만들고, 마운트한다','아무것도 하지 않아도 /data로 바로 쓸 수 있다','RAID를 직접 구성한다','iSCSI Target을 만든다'],e:'클라우드가 연결까지 해 주면 VM에는 새 디스크로 보입니다. 파일시스템을 만들고 마운트하는 일은 VM 안에서 직접 합니다.'}
]}
]
});
