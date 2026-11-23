OJT.lesson({
id:'zc2', week:5, tag:'zCompute 2', mins:'약 4시간',
title:'네트워크 설계: VPC, Subnet, Route Table, Security Group',
cover:[['VPC','s2'],['Subnet','s3'],['Route Table','s4'],['Security Group','s7'],['실습용 VPC 설계','s10']],
act:'VPC·Subnet·Route Table·Security Group 설계',
goal:['Guest Networking과 Host Networking을 구분하고 VPC가 어디에 속하는지 설명할 수 있다','VPC CIDR을 Subnet으로 나누고, Subnet에서 VM에 줄 수 있는 주소를 계산할 수 있다','Route Table을 읽고 Public Subnet과 Private Subnet을 구분할 수 있다','Internet GW, NAT GW, Elastic IP가 각각 어느 방향의 통신을 맡는지 설명할 수 있다','Security Group을 계층별로 설계하고, 회사 참조 아키텍처를 VPC 설계로 옮길 수 있다'],
terms:[
['Guest Networking','Guest Networking','VM과 테넌트가 쓰는 가상 네트워크. VPC, Subnet, Security Group 등이 여기에 속한다.'],
['Host Networking','Host Networking','노드와 스위치를 잇는 물리 네트워크와 관리·스토리지 통신. 플랫폼 운영 쪽 영역이다.'],
['VPC','Virtual Private Cloud','다른 VPC와 논리적으로 분리된 가상 네트워크. 중심에 논리 라우터가 있다.'],
['기본 VPC','Default VPC','VPC 유형의 Project에 자동으로 만들어지는 VPC.'],
['Subnet','Subnet','VPC의 CIDR을 나눈 IP 대역. 하나의 VPC에 속한다.'],
['Public Subnet','Public Subnet','Route Table에 Internet GW로 가는 기본 경로가 있는 Subnet.'],
['Private Subnet','Private Subnet','Internet GW로 가는 경로가 없는 Subnet. 밖으로 나갈 때는 보통 NAT GW를 거친다.'],
['Route Table','Route Table','Subnet의 트래픽을 어디로 보낼지 적은 표. 경로는 목적지 CIDR과 대상으로 이루어진다.'],
['local 경로','Local Route','VPC 안의 통신을 위한 경로. 모든 Route Table에 있고 바꾸거나 지울 수 없다.'],
['Internet GW','Internet Gateway (IGW)','VPC의 라우터를 외부 네트워크에 연결하는 논리 장치.'],
['Edge Network','Edge Network','VPC를 인터넷이나 데이터센터 네트워크에 연결하는 외부 쪽 네트워크. Elastic IP의 주소 풀을 제공한다.'],
['Elastic IP','Elastic IP (EIP)','Edge Network의 IP 풀에서 받아 사설 IP와 1:1 NAT로 연결하는 주소.'],
['NAT GW','NAT Gateway','Private Subnet의 VM이 Elastic IP를 통해 밖으로 나가게 해 주는 장치.'],
['Security Group','Security Group','네트워크 인터페이스에 붙이는 상태 저장 방식의 허용 규칙 묶음.'],
['Network Interface','Network Interface (ENI)','특정 Subnet의 IP를 가진 VM의 가상 NIC.'],
['DHCP Option Set','DHCP Option Set','VM이 DHCP로 받는 DNS 서버, 도메인 이름, NTP 서버 등의 설정 묶음.'],
['VPC DNS','VPC DNS','VPC 안의 이름을 풀어 주고, 외부 이름은 지정된 DNS 서버로 넘기는 서비스.'],
['Private Hosted Zone','Private Hosted Zone','하나 이상의 VPC에서 쓰는 DNS 레코드 묶음.'],
['Direct Subnet','Direct Subnet','VPC를 물리 VLAN에 L2로 직접 연결하는 Subnet. MSP나 Zadara 운영 조직이 만든다.'],
['DVS','Distributed Virtual Switch','VLAN 기반의 L2 네트워크 모델. VPC의 라우팅 기능을 제공하지 않는다.']
],
body:`
<h2 id="s1">Guest Networking과 Host Networking</h2>
<p>zCompute의 네트워크는 두 층으로 나뉜다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>Guest Networking</th><th>Host Networking</th></tr></thead><tbody>
<tr><td class="nw"><b>대상</b></td><td>VM과 테넌트의 가상 네트워크</td><td>노드, 스위치, 관리·스토리지 통신</td></tr>
<tr><td class="nw"><b>구성 요소</b></td><td>VPC, Subnet, Route Table, Security Group, Elastic IP</td><td>물리 케이블, VLAN, 노드 네트워크</td></tr>
<tr><td class="nw"><b>주로 다루는 사람</b></td><td>Member, Tenant Admin</td><td>MSP Admin, Zadara 운영 조직</td></tr>
</tbody></table></div>
<p>이 레슨은 <b>Guest Networking</b>을 설계한다. 두 층이 만나는 곳이 <b>Edge Network</b>다. Edge Network는 관리자가 준비하고, 테넌트는 Internet GW와 Elastic IP를 통해 사용한다.</p>
<p>VPC 설계는 다음 순서로 진행한다.</p>
<div class="flow"><div class="n"><b>VPC</b><small>전체 CIDR</small></div><span class="ar">→</span><div class="n"><b>Subnet</b><small>대역 나누기</small></div><span class="ar">→</span><div class="n"><b>Route Table</b><small>경로 정하기</small></div><span class="ar">→</span><div class="n"><b>GW · EIP</b><small>외부 연결</small></div><span class="ar">→</span><div class="n k"><b>Security Group</b><small>접근 제어</small></div></div>

<h2 id="s2">VPC: 분리된 가상 네트워크</h2>
<p><b>VPC</b><span class="small muted">(Virtual Private Cloud)</span>는 다른 VPC와 논리적으로 분리된 가상 네트워크다. 중심에 <b>논리 라우터</b>가 있어서 VPC 안의 Subnet들을 서로 연결한다. VPC를 만들 때 전체 주소 범위인 <b>CIDR</b><span class="small muted">(Classless Inter-Domain Routing)</span>을 정하고, Subnet은 모두 이 범위 안에서 겹치지 않게 나눈다.</p>
<p>VPC끼리는 분리되어 있으므로 서로 다른 VPC가 같은 IP 대역을 써도 된다. 다만 나중에 두 VPC를 연결(VPC Peering)할 계획이 있으면 대역이 겹치지 않게 잡는다.</p>
<h3>VPC 구성의 세 가지 형태</h3>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>형태</th><th>인터넷 연결</th><th>쓰는 곳</th></tr></thead><tbody>
<tr><td class="nw"><b>Private Subnet 하나</b></td><td>없음</td><td>외부와 분리된 내부 시스템</td></tr>
<tr><td class="nw"><b>Public Subnet 하나</b></td><td>Internet GW로 직접 연결, Security Group으로 제한</td><td>단순한 공개 서버</td></tr>
<tr><td class="nw"><b>Public + Private Subnet</b></td><td>Public은 직접, Private은 NAT GW로 나가기만</td><td>일반적인 Web 서비스</td></tr>
</tbody></table></div>
<h3>기본 VPC</h3>
<p>VPC 유형의 Project에는 <b>기본 VPC</b>가 자동으로 만들어진다. 기본 VPC에는 Subnet 하나, Internet GW, 기본 경로가 들어 있는 Route Table, 기본 Security Group, DHCP Option Set이 함께 있다. 바로 쓸 수는 있지만, 서비스용 네트워크는 용도에 맞게 VPC를 새로 설계한다.</p>

<h2 id="s3">Subnet: VPC의 대역 나누기</h2>
<p><b>Subnet</b>은 VPC의 CIDR을 나눈 IP 대역이고, 하나의 VPC에 속한다. 공식 가이드 기준 규칙은 다음과 같다.</p>
<ul><li>크기는 <b>/28 ~ /16</b>이다.</li><li>Subnet끼리 대역이 <b>겹칠 수 없다</b>.</li><li>Subnet은 한 번에 <b>하나의 Route Table</b>에 연결된다.</li></ul>
<h3>예약 주소: VM에 줄 수 없는 5개</h3>
<p>공식 가이드에 따르면 Subnet CIDR의 <b>처음 4개와 마지막 1개</b> 주소는 VM에 줄 수 없다. 10.0.1.0/24의 경우는 다음과 같다.</p>
<div class="tbl-wrap"><table><thead><tr><th>주소</th><th>용도</th></tr></thead><tbody>
<tr><td><code>10.0.1.0</code></td><td>네트워크 주소</td></tr>
<tr><td><code>10.0.1.1</code></td><td>게이트웨이(VPC 라우터)</td></tr>
<tr><td><code>10.0.1.2</code>, <code>10.0.1.3</code></td><td>DHCP 서버</td></tr>
<tr><td><code>10.0.1.255</code></td><td>마지막 주소</td></tr>
<tr><td><code>10.0.1.4</code> ~ <code>10.0.1.254</code></td><td><b>VM에 줄 수 있는 주소 (251개)</b></td></tr>
</tbody></table></div>
<div class="box mem"><span class="lbl">외울 것: Subnet에서 VM에 줄 수 있는 주소 수</span><b>2<sup>(32 − 프리픽스)</sup> − 5</b>. 예: /24는 256 − 5 = 251개, /28은 16 − 5 = 11개다.</div>
<p class="small muted">.2와 .3이 DHCP 서버라는 것은 가이드의 기본 VPC 예시 기준이다. Direct Subnet은 규칙이 다르다.</p>
<p>아래 계산기로 대역을 확인할 수 있다. <b>계산기의 "사용 가능한 범위"와 "사용 가능한 개수"는 2개만 뺀 일반 네트워크 기준</b>이므로, zCompute의 VPC Subnet에서는 개수에서 3개를 더 빼고, 범위는 .4부터 본다.</p>
<div data-widget="subnetcalc"></div>
<h3>Public Subnet과 Private Subnet</h3>
<p><mark>zCompute의 Subnet에는 Public이나 Private을 고르는 설정이 없다. 차이는 연결된 Route Table이 만든다.</mark></p>
<ul><li><b>Public Subnet</b>: Route Table에 <code>0.0.0.0/0 → Internet GW</code> 경로가 있다.</li><li><b>Private Subnet</b>: Internet GW로 가는 경로가 없다. 밖으로 나가야 하면 <code>0.0.0.0/0 → NAT GW</code> 경로를 둔다.</li></ul>

<h2 id="s4">Route Table: 트래픽을 어디로 보낼까</h2>
<p><b>Route Table</b>은 연결된 Subnet의 트래픽을 어디로 보낼지 정한다. 경로 한 줄은 <b>목적지 CIDR</b>과 <b>대상</b>으로 이루어진다.</p>
<ul><li>VPC에는 지울 수 없는 <b>Main Route Table</b>이 하나 있다. 다른 Route Table을 Main으로 바꿀 수는 있다.</li><li>새 Subnet은 자동으로 Main Route Table에 연결된다.</li><li>모든 Route Table에는 VPC 안의 통신을 위한 <b>local 경로</b>가 있고, 이 경로는 바꾸거나 지울 수 없다.</li><li>대상으로는 local, Internet GW, NAT GW, Network Interface 등을 쓴다.</li></ul>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>Route Table</th><th>목적지</th><th>대상</th><th>읽는 법</th></tr></thead><tbody>
<tr><td rowspan="2" class="nw"><b>public-rt</b></td><td><code>10.0.0.0/16</code></td><td>local</td><td>VPC 안으로 가는 통신은 VPC 라우터가 처리</td></tr>
<tr><td><code>0.0.0.0/0</code></td><td>Internet GW</td><td>나머지는 Internet GW로</td></tr>
<tr><td rowspan="2" class="nw"><b>private-rt</b></td><td><code>10.0.0.0/16</code></td><td>local</td><td>VPC 안으로 가는 통신은 VPC 라우터가 처리</td></tr>
<tr><td><code>0.0.0.0/0</code></td><td>NAT GW</td><td>나머지는 NAT GW로</td></tr>
</tbody></table></div>
<p>목적지 10.0.2.20은 두 줄에 모두 맞지만, 더 구체적인 <code>10.0.0.0/16</code>이 선택되어 VPC 안으로 간다. 목적지 8.8.8.8은 <code>0.0.0.0/0</code>에만 맞으므로 Internet GW나 NAT GW로 간다.</p>
<div class="box warn"><span class="lbl">흔한 실수</span><ul><li>Route Table을 만들고 <b>Subnet에 연결하지 않는다.</b> 연결하지 않은 Subnet은 Main Route Table을 그대로 쓴다.</li><li>Main Route Table에 Internet GW 경로를 넣는다. 그러면 새로 만드는 Subnet이 모두 Public이 된다. 경로는 용도별 Route Table에 넣는다.</li></ul></div>

<h2 id="s5">Internet GW, Edge Network, Elastic IP</h2>
<p><b>Internet GW</b>는 VPC의 라우터를 외부 네트워크에 연결하는 논리 장치이고, 한 번에 하나의 VPC에 붙는다. Internet GW 뒤에는 관리자가 준비한 <b>Edge Network</b>가 있다.</p>
<p><b>Edge Network</b>는 VPC를 인터넷이나 데이터센터 네트워크에 연결하는 외부 쪽 네트워크다. Edge Network에는 <b>IP 풀</b>이 있고, 여기서 Elastic IP를 받는다.</p>
<div class="flow"><div class="n"><b>VM</b><small>사설 IP</small></div><span class="ar">↔</span><div class="n"><b>VPC 라우터</b></div><span class="ar">↔</span><div class="n"><b>Internet GW</b></div><span class="ar">↔</span><div class="n k"><b>Edge Network</b><small>Edge Router가 NAT</small></div><span class="ar">↔</span><div class="n"><b>외부</b></div></div>
<h3>Elastic IP</h3>
<p><b>Elastic IP</b><span class="small muted">(EIP)</span>는 Edge Network의 IP 풀에서 받는 주소로, VM의 사설 IP와 <b>1:1 NAT</b>로 연결한다. 밖에서 VM으로 <b>들어오는 접속</b>을 받으려면 Elastic IP가 필요하다.</p>
<ul><li>Elastic IP는 한 번에 <b>하나의 Network Interface</b>에 연결한다.</li><li>Internet GW가 있는 VPC의 Network Interface에만 연결할 수 있다.</li></ul>
<p class="small muted">공식 가이드의 이름은 Elastic IP이다. 다만 회사 기능 소개 자료의 로드밸런서 생성 화면에는 같은 자리가 "Floating IP"로 표시되어 있다. 이 레슨은 Elastic IP로 쓰고, 콘솔에서 Floating IP로 보이면 같은 것으로 보고 사내 환경에서 확인한다.</p>
<h3>Elastic IP가 없는 VM이 밖으로 나갈 때</h3>
<p>교육자료에 따르면 Internet GW로 나가는 트래픽은 Edge Router가 NAT한다. 인터페이스에 Elastic IP가 있으면 그 주소로 1:1 NAT하고, 없으면 <b>Edge Router의 공인 IP</b>로 NAT한다. 따라서 Public Subnet의 VM은 Elastic IP 없이도 밖으로 나갈 수 있지만, 밖에서 그 VM으로 먼저 접속할 수는 없다.</p>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><ul><li>VM 안에서 <code>ip addr</code>를 실행했을 때 Elastic IP가 보이는지</li><li>콘솔에 표시되는 이름(Elastic IP 또는 Floating IP)</li><li>내 Project가 연결된 Edge Network와 쓸 수 있는 IP 수</li></ul></div>

<h2 id="s6">NAT GW: 나가기만 하는 통로</h2>
<p><b>NAT GW</b>는 Private Subnet의 VM이 Elastic IP를 통해 밖으로 나가게 해 주는 장치다. OS 패치나 패키지 설치처럼 <b>안에서 밖으로 시작하는 통신</b>에 쓴다. 밖에서 NAT GW를 통해 VM으로 먼저 접속할 수는 없다.</p>
<ol><li>Public Subnet에 NAT GW를 만들고 Elastic IP를 지정한다.</li><li>Private Subnet의 Route Table에 <code>0.0.0.0/0 → NAT GW</code>를 넣는다.</li><li>Public Subnet의 Route Table에는 <code>0.0.0.0/0 → Internet GW</code>가 있어야 한다.</li></ol>
<div class="flow"><div class="n"><b>Private VM</b></div><span class="ar">→</span><div class="n k"><b>NAT GW</b><small>Public Subnet</small></div><span class="ar">→</span><div class="n"><b>Internet GW</b></div><span class="ar">→</span><div class="n"><b>인터넷</b></div></div>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>Internet GW</th><th>NAT GW</th><th>Elastic IP</th></tr></thead><tbody>
<tr><td class="nw"><b>하는 일</b></td><td>VPC와 외부를 연결</td><td>Private VM의 나가는 통신을 대신함</td><td>공인 주소를 1:1로 연결</td></tr>
<tr><td class="nw"><b>붙는 곳</b></td><td>VPC</td><td>Public Subnet</td><td>Network Interface, NAT GW</td></tr>
<tr><td class="nw"><b>밖에서 먼저 접속</b></td><td>혼자서는 불가</td><td>불가</td><td>Security Group이 허용하면 가능</td></tr>
</tbody></table></div>

<h2 id="s7">Security Group과 Network Interface</h2>
<p><b>Network Interface</b>는 특정 Subnet의 IP를 가진 VM의 가상 NIC<span class="small muted">(Network Interface Card)</span>다. <b>Security Group</b>은 이 인터페이스에 붙는 허용 규칙 묶음이다.</p>
<ul><li><b>허용 규칙만</b> 있고, 어떤 규칙에도 맞지 않는 트래픽은 버려진다.</li><li><b>상태 저장</b> 방식이라 접속을 시작하는 방향만 적으면 된다.</li><li>VPC에는 <b>기본 Security Group</b>이 있고, 다른 것을 지정하지 않으면 VM에 이것이 붙는다.</li><li>출발지나 목적지로 <b>CIDR, IP 하나, 다른 Security Group</b>을 쓸 수 있다.</li></ul>
<div class="tbl-wrap"><table><thead><tr><th>항목</th><th>값</th></tr></thead><tbody>
<tr><td class="nw">방향</td><td>Ingress(들어오는), Egress(나가는)</td></tr>
<tr><td class="nw">프로토콜</td><td>TCP, UDP, ICMP, Any</td></tr>
<tr><td class="nw">포트</td><td>시작 포트와 끝 포트</td></tr>
<tr><td class="nw">출발지·목적지</td><td>Any, Group(다른 Security Group), Subnet(CIDR·IP)</td></tr>
</tbody></table></div>
<p><mark>규칙에 IP 대신 다른 Security Group을 적으면, VM이 늘거나 IP가 바뀌어도 규칙을 고치지 않아도 된다.</mark> 계층 구조에서는 "앞 계층의 Security Group에서 오는 접속만 허용"으로 쓴다.</p>
<div class="box warn"><span class="lbl">주의: 인터페이스는 VM당 하나를 권장한다</span>공식 가이드는 VM마다 Network Interface 하나를 권장한다. 인터페이스가 여러 개이면 DHCP가 기본 경로를 여러 개 주어서, Elastic IP로 들어온 접속의 응답이 다른 길로 나가 통신이 실패할 수 있다.</div>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span>기본 Security Group과 새로 만든 Security Group에 처음 들어 있는 규칙</div>

<h2 id="s8">DHCP Option Set과 DNS</h2>
<p>VM은 시작할 때 DHCP<span class="small muted">(Dynamic Host Configuration Protocol)</span>로 IP와 네트워크 설정을 받는다. 이때 받는 설정을 모아 둔 것이 <b>DHCP Option Set</b>이다.</p>
<div class="tbl-wrap"><table><thead><tr><th>옵션</th><th>뜻</th></tr></thead><tbody>
<tr><td class="nw"><code>domain-name-servers</code></td><td>사용할 DNS 서버</td></tr>
<tr><td class="nw"><code>domain-name</code></td><td>기본 도메인 이름</td></tr>
<tr><td class="nw"><code>ntp-servers</code></td><td>시간 동기화 서버</td></tr>
<tr><td class="nw"><code>netbios-name-servers</code>, <code>netbios-node-type</code></td><td>Windows 이름 해석 설정</td></tr>
</tbody></table></div>
<p>DHCP Option Set은 <b>VPC에 연결해야</b> 효과가 있다.</p>
<h3>zCompute의 DNS 두 단계</h3>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>VPC DNS</th><th>Private Hosted Zone</th></tr></thead><tbody>
<tr><td class="nw"><b>이름이 통하는 범위</b></td><td>VPC 하나</td><td>연결한 하나 이상의 VPC</td></tr>
<tr><td class="nw"><b>레코드 종류</b></td><td>A 레코드</td><td>Route 53 호환 레코드</td></tr>
</tbody></table></div>
<p>VPC DNS를 켜면 VM의 DNS 질의는 VPC DNS 서비스로 간다. 이 서비스는 VPC 안의 이름은 직접 답하고, 외부 이름은 DHCP Option Set의 DNS 서버로 넘긴다. VM은 IP가 a.b.c.d이면 <code>host-a-b-c-d</code> 형식의 내부 이름을 받는다.</p>
<p>VM의 IP는 바뀔 수 있으므로, 서버끼리는 IP보다 <b>이름으로</b> 접속하게 구성한다.</p>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span>기본 DHCP Option Set에 들어 있는 도메인 이름</div>

<h2 id="s9">Direct Subnet과 DVS: 개념만</h2>
<p>VPC 말고도 VM을 물리 네트워크에 직접 연결하는 방법이 두 가지 있다. 둘 다 관리자나 Zadara 운영 조직의 설정이 필요해서, 이 과정에서는 개념만 구분한다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>Direct Subnet</th><th>DVS</th></tr></thead><tbody>
<tr><td class="nw"><b>정체</b></td><td>VPC 안에서 쓰는, 물리 VLAN에 L2로 연결된 Subnet</td><td>VLAN 기반 L2 네트워크만 쓰는 Project 유형</td></tr>
<tr><td class="nw"><b>VPC 기능</b></td><td>VPC와 함께 사용</td><td>Route Table, Elastic IP 같은 VPC 기능이 없음</td></tr>
<tr><td class="nw"><b>쓰는 곳</b></td><td>VPSA 같은 외부 스토리지·장비에 직접 연결</td><td>기존 가상화 환경을 그대로 옮길 때</td></tr>
</tbody></table></div>
<p class="small muted">VPSA: Virtual Private Storage Array. 한 Project는 VPC 유형이거나 DVS 유형이고, 한 Account에 두 유형이 함께 있을 수 있다. VPSA 연결은 <a data-lesson="zs2"></a>에서 다룬다.</p>

<h2 id="s10">회사 참조 아키텍처와 실습용 VPC 설계</h2>
<p>회사의 3-Tier 참조 아키텍처를 VPC 설계로 옮긴다. 이 구성은 <b>ALB와 Web 서버를 Public Tier</b>에 두고 Security Group으로 접근을 제한한다. WAS와 DB는 Private Tier에 둔다. 로드밸런서만 Public Subnet에 두고 Web 서버도 Private Subnet에 두는 구성도 쓰인다. 이 과정의 zCompute 실습은 회사 참조 아키텍처를 따른다.</p>
<svg class="fig" viewBox="0 0 560 576" role="img" aria-label="회사 참조 아키텍처를 옮긴 VPC 설계. 인터넷이 Internet GW를 통해 VPC 10.0.0.0/16으로 들어온다. Public Subnet 10.0.1.0/24에 ALB, Web 서버 2대, NAT GW, Bastion이 있다. ALB가 Web 서버로 분산하고, Web 서버는 Private Subnet 10.0.2.0/24의 NLB를 거쳐 WAS 2대로 간다. WAS는 Private Subnet 10.0.3.0/24의 DB로 간다. Private Subnet의 나가는 통신은 NAT GW와 Internet GW를 거친다.">
<use href="#i-cloud" x="236" y="0" width="88" height="56"/><text x="336" y="36">인터넷</text>
<line x1="280" y1="56" x2="280" y2="72" class="ln acc" marker-end="url(#ar-acc)"/>
<rect x="4" y="92" width="552" height="478" rx="10" class="wall"/>
<rect x="232" y="74" width="96" height="36" rx="6" class="bx-a"/><text x="280" y="99" class="c b">IGW</text>
<text x="16" y="120" class="b">VPC 10.0.0.0/16</text>
<rect x="16" y="130" width="528" height="150" rx="8" class="zone"/>
<rect x="160" y="146" width="148" height="96" rx="8" class="pair"/>
<use href="#i-lb" x="40" y="160" width="48" height="48" class="acc"/><text x="64" y="232" class="c">ALB</text>
<use href="#i-server" x="172" y="156" width="48" height="48"/><text x="196" y="232" class="c">Web</text>
<use href="#i-server" x="248" y="156" width="48" height="48"/><text x="272" y="232" class="c">Web</text>
<use href="#i-router" x="370" y="160" width="48" height="48"/><text x="394" y="232" class="c">NAT GW</text>
<use href="#i-server" x="464" y="160" width="48" height="48" class="mut"/><text x="488" y="232" class="c">Bastion</text>
<text x="28" y="270" class="t-s">Public 10.0.1.0/24</text>
<path d="M250 110 V140 H64 V156" class="ln acc" marker-end="url(#ar-acc)"/>
<line x1="90" y1="184" x2="168" y2="184" class="ln acc" marker-end="url(#ar-acc)"/>
<path d="M394 158 V100 H332" class="ln dash" marker-end="url(#ar)"/>
<rect x="16" y="294" width="528" height="120" rx="8" class="zone"/>
<rect x="160" y="302" width="148" height="80" rx="8" class="pair"/>
<use href="#i-lb" x="40" y="308" width="44" height="44" class="acc"/><text x="62" y="374" class="c">NLB</text>
<use href="#i-server" x="174" y="306" width="44" height="44"/><text x="196" y="374" class="c">WAS</text>
<use href="#i-server" x="250" y="306" width="44" height="44"/><text x="272" y="374" class="c">WAS</text>
<text x="28" y="404" class="t-s">Private 10.0.2.0/24</text>
<path d="M234 244 V288 H62 V304" class="ln acc" marker-end="url(#ar-acc)"/>
<line x1="86" y1="330" x2="170" y2="330" class="ln acc" marker-end="url(#ar-acc)"/>
<path d="M394 294 V240" class="ln dash" marker-end="url(#ar)"/>
<text x="406" y="346" class="t-s">밖으로 나갈 때</text><text x="406" y="368" class="t-s">NAT GW 경유</text>
<line x1="394" y1="294" x2="394" y2="330" class="ln dash"/>
<rect x="16" y="428" width="528" height="130" rx="8" class="zone"/>
<rect x="160" y="436" width="148" height="84" rx="8" class="pair"/>
<use href="#i-db" x="174" y="442" width="44" height="44"/><text x="196" y="510" class="c">Primary</text>
<use href="#i-db" x="250" y="442" width="44" height="44"/><text x="272" y="510" class="c">Replica</text>
<text x="28" y="546" class="t-s">Private 10.0.3.0/24 (DB)</text>
<line x1="285" y1="384" x2="285" y2="434" class="ln acc" marker-end="url(#ar-acc)"/>
</svg>
<p class="fig-cap">파란 실선은 서비스 요청의 흐름, 점선은 Private Subnet이 밖으로 나가는 흐름이다.</p>
<h3>실습용 설계 예시</h3>
<p class="small muted">아래 값은 학습용 예시이고, 실제 대역은 사내 실습 환경의 지침을 따른다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>Subnet</th><th>CIDR</th><th>VM에 줄 수 있는 주소</th><th>Route Table</th><th>배치</th></tr></thead><tbody>
<tr><td class="nw"><b>public</b></td><td><code>10.0.1.0/24</code></td><td class="nw">10.0.1.4 ~ .254</td><td>public-rt (IGW)</td><td>ALB, Web, NAT GW, Bastion</td></tr>
<tr><td class="nw"><b>private-app</b></td><td><code>10.0.2.0/24</code></td><td class="nw">10.0.2.4 ~ .254</td><td>private-rt (NAT GW)</td><td>NLB, WAS</td></tr>
<tr><td class="nw"><b>private-db</b></td><td><code>10.0.3.0/24</code></td><td class="nw">10.0.3.4 ~ .254</td><td>private-rt (NAT GW)</td><td>DB</td></tr>
</tbody></table></div>
<h3>Security Group 설계 예시</h3>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>Security Group</th><th>Ingress 포트</th><th>출발지</th><th>이유</th></tr></thead><tbody>
<tr><td class="nw"><b>alb-sg</b></td><td>80, 443</td><td><code>0.0.0.0/0</code></td><td>사용자의 접속을 받는 입구</td></tr>
<tr><td class="nw"><b>web-sg</b></td><td>80</td><td>alb-sg</td><td>Public에 있어도 ALB에서 오는 접속만 받음</td></tr>
<tr><td class="nw"><b>bastion-sg</b></td><td>22</td><td><code>203.0.113.10/32</code></td><td>관리자의 주소만 허용(예시 주소)</td></tr>
<tr><td class="nw"><b>nlb-sg</b></td><td>8080</td><td>web-sg</td><td>Web 서버에서 오는 접속만</td></tr>
<tr><td class="nw"><b>was-sg</b></td><td>8080</td><td>사내 실습 환경에서 확인</td><td>NLB 뒤의 서버가 보는 출발지에 따라 정한다</td></tr>
<tr><td class="nw"><b>db-sg</b></td><td>3306</td><td>was-sg</td><td>WAS에서 오는 접속만</td></tr>
</tbody></table></div>
<p class="small muted">Web·WAS·DB의 SSH(22번)는 bastion-sg에서 오는 접속만 허용한다. 전체 구축은 <a data-lesson="zc8"></a>에서 한다.</p>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span>NLB 뒤의 서버가 보는 출발지. 이 값에 따라 was-sg의 출발지를 정하며, <a data-lesson="zc6"></a>의 로드밸런서 실습에서 확인한다.</div>
<div class="box warn"><span class="lbl">Web 서버가 Public Subnet에 있을 때 지킬 것</span>Web 서버에 Elastic IP를 붙이지 않고, web-sg의 80번 출발지를 <code>0.0.0.0/0</code>으로 열지 않는다. 사용자의 접속은 ALB로만 들어오게 한다.</div>
<h3>직접 해 보기</h3>
<p>VPC <code>10.20.0.0/16</code>에 Public Subnet 하나와 Private Subnet 하나를 /24로 만든다. Private Subnet의 VM은 패키지를 내려받아야 하지만, 밖에서 접속되면 안 된다. Subnet, Route Table, 필요한 Gateway를 적어 보고, Subnet 하나에서 VM에 줄 수 있는 주소 수를 계산해 보자.</p>
<details class="fold"><summary>답 보기</summary><p>예: Public <code>10.20.1.0/24</code>, Private <code>10.20.2.0/24</code>. Internet GW를 VPC에 붙이고, Public Subnet에 Elastic IP를 지정한 NAT GW를 만든다. public-rt는 <code>10.20.0.0/16 → local</code>, <code>0.0.0.0/0 → Internet GW</code>이고, private-rt는 <code>10.20.0.0/16 → local</code>, <code>0.0.0.0/0 → NAT GW</code>다. 각 Route Table을 해당 Subnet에 연결한다. VM에 줄 수 있는 주소는 256 − 5 = 251개다.</p></details>
`,
summary:['Guest Networking은 VM과 테넌트의 가상 네트워크, Host Networking은 노드와 물리 네트워크다.','VPC는 분리된 가상 네트워크이고, Subnet은 VPC의 CIDR 안에서 겹치지 않게 나눈다.','VPC Subnet의 처음 4개와 마지막 1개 주소는 VM에 줄 수 없다. 사용 가능한 주소는 2^(32−프리픽스) − 5개다.','Public과 Private은 설정값이 아니라 Route Table의 경로로 결정된다.','Internet GW는 VPC와 외부를 연결하고, Elastic IP는 들어오는 접속을 받게 하며, NAT GW는 Private VM의 나가는 통신만 처리한다.','Security Group은 Network Interface에 붙는 상태 저장 허용 규칙이고, 출발지로 다른 Security Group을 지정할 수 있다.','회사 참조 아키텍처는 ALB와 Web을 Public Tier에, WAS와 DB를 Private Tier에 둔다.'],
essay:[
{q:'Guest Networking과 Host Networking의 차이를 설명하고, 두 층이 만나는 곳이 어디인지 말해 보세요.',a:'Guest Networking은 VM과 테넌트가 쓰는 VPC, Subnet, Security Group 같은 가상 네트워크이고, Host Networking은 노드, 스위치, 관리·스토리지 통신 같은 물리 네트워크다. 두 층은 Edge Network에서 만난다.'},
{q:'zCompute에서 어떤 Subnet이 Public인지 Private인지 무엇으로 판단하나요?',a:'연결된 Route Table로 판단한다. 0.0.0.0/0 경로의 대상이 Internet GW이면 Public이고, Internet GW로 가는 경로가 없으면 Private이다.'},
{q:'10.0.1.0/24 Subnet에서 VM에 줄 수 없는 주소와 줄 수 있는 주소 수를 설명해 보세요.',a:'처음 4개(10.0.1.0~10.0.1.3)와 마지막 1개(10.0.1.255)는 줄 수 없다. 네트워크 주소, 게이트웨이, DHCP 서버, 마지막 주소다. 줄 수 있는 주소는 256 − 5 = 251개다.'},
{q:'Internet GW, NAT GW, Elastic IP의 역할을 통신 방향과 함께 구분해 보세요.',a:'Internet GW는 VPC와 외부를 연결하는 통로다. Elastic IP는 사설 IP와 1:1 NAT로 연결되어 밖에서 들어오는 접속을 받게 한다. NAT GW는 Private Subnet의 VM이 밖으로 나가는 통신만 처리하고, 밖에서 먼저 들어오는 접속은 받지 않는다.'},
{q:'Security Group 규칙의 출발지에 IP 대신 다른 Security Group을 적으면 어떤 장점이 있나요?',a:'그 Security Group이 붙은 대상에서 오는 접속을 허용하는 뜻이 되므로, VM이 늘어나거나 IP가 바뀌어도 규칙을 고치지 않아도 된다.'},
{q:'회사 참조 아키텍처에서 Web 서버는 Public Tier에 있다. 이때 Web 서버를 보호하는 방법을 설명해 보세요.',a:'Web 서버에 Elastic IP를 붙이지 않고, web-sg의 80번 포트 출발지를 ALB의 Security Group으로 제한한다. SSH는 Bastion의 Security Group에서 오는 접속만 허용한다.'}
],
quiz:[
{v:[
 {q:'VPC, Subnet, Security Group이 속하는 네트워크 층은?',o:['Guest Networking','Host Networking','물리 케이블 계층','스토리지 네트워크'],e:'VM과 테넌트가 쓰는 가상 네트워크는 Guest Networking이다.'},
 {q:'노드와 스위치를 잇는 물리 네트워크와 관리 통신을 부르는 말은?',o:['Host Networking','Guest Networking','Private Subnet','VPC Peering'],e:'노드, 스위치, 관리·스토리지 통신은 Host Networking이다.'}
]},
{v:[
 {q:'VPC에 대한 설명으로 맞는 것은?',o:['다른 VPC와 논리적으로 분리된 가상 네트워크이다','물리 스위치 한 대를 뜻한다','VM의 디스크를 묶은 것이다','사용자 권한을 관리하는 단위이다'],e:'VPC는 논리적으로 분리된 가상 네트워크이고, 중심의 논리 라우터가 Subnet들을 연결한다.'},
 {q:'VPC 안의 서로 다른 Subnet을 연결해 주는 것은?',o:['VPC의 논리 라우터','NAT GW','Elastic IP','DHCP Option Set'],e:'VPC의 중심에 있는 논리 라우터가 Subnet 사이의 통신을 처리한다.'}
]},
{v:[
 {q:'VPC와 Subnet의 CIDR 규칙으로 맞는 것은?',o:['Subnet은 VPC CIDR 안에서 서로 겹치지 않게 나눈다','Subnet은 VPC CIDR 밖에 만들어야 한다','Subnet끼리는 반드시 겹쳐야 한다','Subnet은 VPC 없이 만든다'],e:'Subnet은 VPC의 CIDR 범위 안에서 겹치지 않게 나눈다.'},
 {q:'Subnet과 Route Table의 관계로 맞는 것은?',o:['Subnet은 한 번에 하나의 Route Table에 연결된다','Subnet 하나에 Route Table을 여러 개 동시에 연결한다','Route Table은 Subnet에 연결할 수 없다','Route Table은 VM마다 하나씩 있다'],e:'Subnet은 한 번에 하나의 Route Table에만 연결되고, 하나의 Route Table은 여러 Subnet에 연결할 수 있다.'}
]},
{gen(){
  const p=[24,25,26,27,28][Math.floor(Math.random()*5)], t=Math.pow(2,32-p);
  return {q:'zCompute의 VPC에서 /'+p+' Subnet의 VM에 줄 수 있는 IP 주소는 몇 개인가? (zCompute는 서브넷마다 주소 5개를 예약한다: 처음 4개와 마지막 1개)',
    o:[t-5,t-2,t,t-4].map(n=>n+'개'),
    e:'/'+p+'의 주소는 2의 '+(32-p)+'제곱인 '+t+'개이다. 처음 4개와 마지막 1개를 빼면 '+t+' − 5 = '+(t-5)+'개이다.'};
}},
{gen(){
  const R=n=>Math.floor(Math.random()*n), k=1+R(9), p=[24,25,26,27][R(4)], b=Math.pow(2,32-p), pre='10.0.'+k+'.', first=R(2)===0;
  return first
   ? {q:'zCompute VPC의 Subnet '+pre+'0/'+p+'에서 VM에 줄 수 있는 첫 번째 주소는? (zCompute는 서브넷마다 주소 5개를 예약한다: 처음 4개와 마지막 1개)',
      o:[pre+'4',pre+'1',pre+'2',pre+'0'],
      e:pre+'0 ~ '+pre+'3이 예약되어 있으므로 첫 번째 주소는 '+pre+'4이다.'}
   : {q:'zCompute VPC의 Subnet '+pre+'0/'+p+'에서 VM에 줄 수 있는 마지막 주소는? (zCompute는 서브넷마다 주소 5개를 예약한다: 처음 4개와 마지막 1개)',
      o:[pre+(b-2),pre+(b-1),pre+(b-5),pre+(b-3)],
      e:'/'+p+'의 주소는 '+b+'개이므로 마지막 주소는 '+pre+(b-1)+'이다. 이 주소는 예약이므로 VM에 줄 수 있는 마지막 주소는 '+pre+(b-2)+'이다.'};
}},
{gen(){
  const R=n=>Math.floor(Math.random()*n), x=10+R(40), k=1+R(200);
  return {q:'VPC의 CIDR이 10.'+x+'.0.0/16일 때, 이 VPC 안에 만들 수 있는 Subnet은?',
    o:['10.'+x+'.'+k+'.0/24','10.'+(x+1)+'.'+k+'.0/24','172.31.'+k+'.0/24','192.168.'+k+'.0/24'],
    e:'/16이므로 앞 두 칸(10.'+x+')이 같아야 VPC 범위 안이다. 10.'+x+'.'+k+'.0/24만 이 조건에 맞는다.'};
}},
{gen(){
  const R=n=>Math.floor(Math.random()*n), k=1+R(50);
  return {q:'VPC에 Subnet 10.0.'+k+'.0/24가 이미 있다. 새로 만들면 대역이 겹치는 Subnet은?',
    o:['10.0.'+k+'.128/25','10.0.'+(k+1)+'.0/24','10.0.'+(k+2)+'.128/25','10.0.'+(k+3)+'.0/25'],
    e:'10.0.'+k+'.0/24는 10.0.'+k+'.0 ~ 10.0.'+k+'.255이다. 10.0.'+k+'.128/25는 이 범위 안에 있어서 겹친다.'};
}},
{v:[
 {q:'zCompute에서 Subnet이 Public인지 Private인지를 결정하는 것은?',o:['연결된 Route Table의 경로','Subnet을 만들 때 고르는 Public 설정','VM의 OS 종류','Security Group의 이름'],e:'Subnet에 별도의 Public 설정은 없다. Route Table에 Internet GW로 가는 기본 경로가 있으면 Public이다.'},
 {q:'Route Table에 0.0.0.0/0 → Internet GW 경로가 있는 Subnet은?',o:['Public Subnet','Private Subnet','Direct Subnet','DVS 네트워크'],e:'Internet GW로 가는 기본 경로가 있으면 Public Subnet이다.'},
 {q:'Route Table에 10.0.0.0/16 → local과 0.0.0.0/0 → NAT GW가 있다. 이 Subnet은?',o:['Private Subnet','Public Subnet','Direct Subnet','Edge Network'],e:'Internet GW로 직접 가는 경로가 없고 NAT GW로 나가므로 Private Subnet이다.'}
]},
{v:[
 {q:'모든 Route Table에 있는 local 경로의 특징은?',o:['VPC 안의 통신을 위한 경로이고 바꾸거나 지울 수 없다','인터넷으로 나가는 경로이다','관리자만 지울 수 있다','NAT GW를 만들면 생긴다'],e:'local 경로는 VPC 안의 통신을 처리하며 수정하거나 삭제할 수 없다.'},
 {q:'새로 만든 Subnet을 다른 Route Table에 연결하지 않으면?',o:['Main Route Table을 사용한다','통신이 전혀 되지 않는다','자동으로 Public Subnet이 된다','Route Table을 새로 자동 생성한다'],e:'새 Subnet은 자동으로 VPC의 Main Route Table에 연결된다.'}
]},
{v:[
 {q:'Route Table이 10.0.0.0/16 → local, 0.0.0.0/0 → Internet GW일 때 목적지 10.0.2.20으로 가는 트래픽은?',o:['local 경로로 VPC 안에서 전달된다','Internet GW로 나간다','버려진다','NAT GW로 간다'],e:'두 경로 모두 맞지만 더 구체적인 10.0.0.0/16이 선택된다.'},
 {q:'Route Table이 10.0.0.0/16 → local, 0.0.0.0/0 → NAT GW일 때 목적지 8.8.8.8로 가는 트래픽은?',o:['NAT GW로 간다','local 경로로 간다','Internet GW로 바로 간다','버려진다'],e:'8.8.8.8은 10.0.0.0/16에 속하지 않으므로 0.0.0.0/0 경로의 대상인 NAT GW로 간다.'}
]},
{v:[
 {q:'Internet GW의 역할은?',o:['VPC의 라우터를 외부 네트워크에 연결한다','VM에 사설 IP를 나눠 준다','VM의 디스크를 연결한다','사용자를 인증한다'],e:'Internet GW는 VPC와 외부 네트워크를 잇는 논리 장치이다.'},
 {q:'Edge Network가 제공하는 것은?',o:['VPC의 외부 연결과 Elastic IP의 주소 풀','VM의 CPU와 메모리','사용자 계정과 그룹','VM의 부팅 이미지'],e:'Edge Network는 VPC를 외부와 연결하고, Elastic IP를 받는 IP 풀을 제공한다.'}
]},
{v:[
 {q:'Elastic IP에 대한 설명으로 맞는 것은?',o:['Edge Network의 IP 풀에서 받아 사설 IP와 1:1 NAT로 연결한다','VPC 안에서만 쓰는 사설 IP이다','Subnet마다 자동으로 하나씩 생긴다','여러 Network Interface에 동시에 연결한다'],e:'Elastic IP는 한 번에 하나의 Network Interface에 연결되어 1:1 NAT로 동작한다.'},
 {q:'인터넷에서 VM으로 들어오는 접속을 받으려면 VM의 Network Interface에 필요한 것은?',o:['Elastic IP','NAT GW','DHCP Option Set','Private Hosted Zone'],e:'밖에서 들어오는 접속은 Elastic IP로 받는다. 이때 Security Group도 그 접속을 허용해야 한다.'}
]},
{v:[
 {q:'NAT GW의 주된 용도는?',o:['Private Subnet의 VM이 밖으로 나가는 통신을 처리한다','밖에서 Private VM으로 먼저 접속하게 한다','VM 사이의 부하를 분산한다','DNS 이름을 풀어 준다'],e:'NAT GW는 안에서 밖으로 시작하는 통신만 처리한다.'},
 {q:'NAT GW를 구성하는 방법으로 맞는 것은?',o:['Public Subnet에 Elastic IP와 함께 만들고, Private Route Table의 기본 경로 대상으로 지정한다','Private Subnet에 만들고 Internet GW 없이 쓴다','VM마다 하나씩 만들어 VM 안에 설치한다','Security Group의 규칙으로 지정한다'],e:'NAT GW는 Public Subnet에 두고, Private Route Table에 0.0.0.0/0 → NAT GW를 넣는다.'}
]},
{v:[
 {q:'Security Group이 붙는 대상은?',o:['Network Interface','Subnet의 Route Table','물리 스위치','사용자 계정'],e:'Security Group은 VM의 가상 NIC인 Network Interface에 적용된다.'},
 {q:'Security Group에서 어떤 규칙에도 맞지 않는 트래픽은?',o:['버려진다','자동으로 허용된다','NAT GW로 넘어간다','관리자에게 승인을 요청한다'],e:'Security Group은 허용 규칙만 있으며, 맞는 규칙이 없으면 트래픽을 버린다.'},
 {q:'Security Group이 상태 저장 방식이라는 것의 의미는?',o:['접속을 시작하는 방향만 허용하면 응답은 자동으로 통과한다','규칙을 파일로 저장한다','응답 방향의 규칙을 반드시 따로 적어야 한다','VM을 중지하면 규칙이 사라진다'],e:'세션을 추적하므로 시작 방향의 규칙만 적으면 응답은 자동으로 허용된다.'}
]},
{v:[
 {q:'db-sg의 Ingress 규칙 "TCP 3306, 출발지 was-sg"의 뜻은?',o:['was-sg가 붙은 대상에서 오는 3306번 접속을 허용한다','모든 주소의 3306번 접속을 허용한다','DB가 was-sg로 나가는 통신을 막는다','WAS의 3306번 포트를 연다'],e:'출발지에 Security Group을 적으면 그 Security Group이 붙은 대상에서 오는 접속을 뜻한다.'},
 {q:'Security Group 규칙의 출발지로 다른 Security Group을 지정하는 장점은?',o:['VM이 늘거나 IP가 바뀌어도 규칙을 고치지 않아도 된다','통신 속도가 빨라진다','포트를 적지 않아도 된다','Route Table이 필요 없어진다'],e:'IP 대신 그룹을 가리키므로 대상이 바뀌어도 규칙을 유지할 수 있다.'}
]},
{q:'공식 가이드가 VM마다 Network Interface 하나를 권장하는 이유는?',o:['인터페이스가 여러 개이면 기본 경로가 여러 개 생겨 응답이 다른 길로 나갈 수 있기 때문이다','인터페이스가 많으면 VM을 시작할 수 없기 때문이다','Elastic IP를 만들 수 없기 때문이다','Security Group을 붙일 수 없기 때문이다'],e:'DHCP가 인터페이스마다 기본 경로를 주어서, Elastic IP로 들어온 접속의 응답이 실패할 수 있다.'},
{v:[
 {q:'DHCP Option Set에 담기는 것은?',o:['DNS 서버, 도메인 이름, NTP 서버','Security Group 규칙','VM의 CPU 개수','Route Table의 경로'],e:'DHCP Option Set은 VM이 DHCP로 받는 네트워크 설정의 묶음이다.'},
 {q:'VPC DNS를 켰을 때 VM의 외부 이름 조회는 어떻게 처리되나?',o:['VPC DNS 서비스가 DHCP Option Set의 DNS 서버로 넘긴다','항상 실패한다','Elastic IP로 대신 답한다','Security Group이 이름을 풀어 준다'],e:'VPC DNS는 VPC 안의 이름은 직접 답하고, 외부 이름은 지정된 DNS 서버로 넘긴다.'}
]},
{v:[
 {q:'VPC DNS와 Private Hosted Zone의 차이로 맞는 것은?',o:['VPC DNS는 VPC 하나, Private Hosted Zone은 연결한 하나 이상의 VPC에서 이름이 통한다','VPC DNS는 인터넷 전체에 공개된다','Private Hosted Zone은 VM 하나에서만 쓴다','둘은 같은 기능이다'],e:'VPC DNS의 범위는 VPC 하나이고, Private Hosted Zone은 여러 VPC에 연결할 수 있다.'}
]},
{v:[
 {q:'DVS 유형의 Project에 대한 설명으로 맞는 것은?',o:['VLAN 기반 L2 네트워크를 쓰며 Route Table, Elastic IP 같은 VPC 기능이 없다','VPC보다 라우팅 기능이 더 많다','인터넷 연결에 Internet GW를 쓴다','VPC와 같은 Project 안에서 함께 쓴다'],e:'DVS는 L2 VLAN 네트워크 모델이고, 한 Project는 VPC 또는 DVS 중 하나이다.'},
 {q:'Direct Subnet의 주된 용도는?',o:['VPC를 물리 VLAN에 L2로 연결해 VPSA 같은 외부 장비에 직접 접근한다','VM에 공인 IP를 준다','Private Subnet의 인터넷 출구로 쓴다','사용자 인증을 처리한다'],e:'Direct Subnet은 VPC와 물리 VLAN을 L2로 연결한다.'}
]},
{v:[
 {q:'회사 참조 아키텍처에서 Public Tier에 두는 것은?',o:['ALB, Web 서버, NAT GW, Bastion','WAS와 DB','NLB와 WAS','DB와 zStorage'],e:'참조 아키텍처는 ALB, Web, NAT GW, Bastion을 Public Tier에, NLB, WAS, DB를 Private Tier에 둔다.'},
 {q:'Web 서버가 Public Subnet에 있을 때 web-sg의 80번 포트 출발지로 알맞은 것은?',o:['ALB의 Security Group','0.0.0.0/0','DB의 Security Group','NAT GW의 Elastic IP'],e:'사용자의 접속은 ALB로만 받도록, Web 서버는 ALB에서 오는 접속만 허용한다.'}
]}
]
});
