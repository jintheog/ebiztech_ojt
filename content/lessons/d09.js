OJT.lesson({
id:'d09', week:3, day:'09', tag:'일차 09', mins:'약 3시간',
title:'Network 주요 서비스: DNS, NAT, TCP·UDP와 포트, 통신 확인 명령어',
cover:[['DNS','s1'],['NAT','s5'],['TCP/UDP','s3'],['Port','s4'],['통신 확인 명령어','s6'],['DNS 조회·포트·경로 테스트','s8']],
act:'DNS 조회·포트·경로 테스트',
goal:['DNS가 이름을 IP 주소로 바꾸는 과정을 설명할 수 있다','TCP와 UDP의 차이, 포트 번호의 역할을 설명할 수 있다','NAT가 패킷의 주소를 어떻게 바꾸는지 설명할 수 있다','ping, traceroute, nslookup·dig, ss, nc, curl의 용도와 출력에서 볼 곳을 말할 수 있다','접속이 안 될 때 DNS 조회 → 포트 확인 → 경로 확인 순서로 원인을 좁힐 수 있다'],
terms:[
['DNS','Domain Name System','도메인 이름을 IP 주소로 바꿔 주는 체계.'],
['도메인 이름','Domain Name','www.example.com처럼 IP 주소 대신 쓰는 이름. 오른쪽부터 루트, 최상위 도메인(TLD), 도메인, 호스트 이름 순서의 계층이다.'],
['리졸버','Recursive Resolver','내 PC의 질문을 받아 여러 네임서버에 차례로 물어서 답을 찾아 주는 DNS 서버. 답을 캐시에 보관한다.'],
['권한 있는 네임서버','Authoritative Name Server','그 도메인의 레코드 원본을 가지고 최종 답을 주는 서버.'],
['DNS 레코드','DNS Record','이름에 연결된 정보 한 줄. A(이름 → IPv4 주소), CNAME(이름 → 다른 이름) 등.'],
['TTL','Time To Live','① DNS: 답을 캐시에 보관해도 되는 시간(초). ② IP 패킷: 라우터를 지날 때마다 1씩 줄어드는 값. 0이 되면 버린다.'],
['TCP','Transmission Control Protocol','연결을 먼저 맺고, 데이터가 빠짐없이 순서대로 도착하게 관리하는 전송 계층 프로토콜.'],
['UDP','User Datagram Protocol','연결 없이 바로 보내는 전송 계층 프로토콜. 도착과 순서를 보장하지 않는 대신 가볍고 빠르다.'],
['3-way handshake','SYN, SYN+ACK, ACK','TCP가 연결을 맺는 절차. 클라이언트의 SYN, 서버의 SYN+ACK, 클라이언트의 ACK 순서로 주고받는다.'],
['포트 번호','Port Number','한 서버에서 돌아가는 여러 프로그램 가운데 어느 것에 전달할지 구분하는 번호(0~65535).'],
['잘 알려진 포트 / 임시 포트','Well-known Port / Ephemeral Port','서비스마다 정해 둔 0~1023번 포트 / 접속할 때 운영체제가 골라 주는 출발지 포트.'],
['소켓','Socket','IP 주소와 포트 번호의 짝. 프로그램은 소켓을 열어서 통신한다. 예: 10.0.1.10:443'],
['LISTEN','Listen','프로그램이 포트를 열고 접속 요청을 기다리는 상태.'],
['NAT','Network Address Translation','패킷의 IP 주소를 다른 주소로 바꿔 주는 기능. 무엇을 무엇으로 바꿨는지는 NAT 테이블에 기억한다.'],
['PAT (NAPT)','Port Address Translation (Network Address Port Translation)','IP 주소와 함께 포트 번호까지 바꾸는 NAT. 여러 장비가 공인 IP 하나를 함께 쓸 수 있다. 현장에서는 흔히 그냥 NAT라고 부른다.'],
['SNAT / DNAT','Source NAT / Destination NAT','출발지 주소를 바꾸는 NAT(안에서 밖으로 나갈 때) / 목적지 주소를 바꾸는 NAT(밖에서 안으로 들어올 때).'],
['ICMP','Internet Control Message Protocol','네트워크의 상태를 확인하고 오류를 알리는 데 쓰는 프로토콜. 포트 번호를 쓰지 않는다. ping과 traceroute가 이용한다.'],
['ping / traceroute','ping / traceroute','대상까지 패킷이 갔다가 돌아오는지와 왕복 시간을 확인하는 명령 / 목적지까지 거치는 라우터(홉)를 차례로 보여 주는 명령(Windows에서는 tracert).'],
['nslookup / dig','nslookup / domain information groper','DNS 조회를 직접 해 보는 명령.'],
['ss / nc / curl','socket statistics / netcat / client URL','이 서버의 열린 포트 보기 / 대상 포트에 연결되는지 확인 / HTTP 요청을 보내 응답 확인.']
],
body:`
<h2 id="s1">DNS: 이름을 IP 주소로 바꾸는 체계</h2>
<p>내 PC<span class="small muted">(Personal Computer)</span>의 브라우저에 <code>https://www.example.com</code>을 입력하고 화면이 뜨기까지, 네트워크에서는 아래 일이 차례로 일어납니다. 이 레슨은 이 순서를 따라갑니다.</p>
<ol><li><b>이름을 IP 주소로 바꿉니다</b> (DNS). 통신은 이름이 아니라 IP 주소로 하기 때문입니다.</li><li><b>서버와 연결을 맺습니다</b> (TCP). 데이터를 보내기 전에 양쪽이 준비됐는지 확인합니다.</li><li><b>서버 안의 어느 프로그램인지를 포트 번호로 가리킵니다</b> (포트). 웹 서버 프로그램은 443번 포트에서 기다립니다.</li><li>내 PC가 사설 IP를 쓰면, 인터넷으로 나가는 길목에서 <b>출발지 주소가 공인 IP로 바뀝니다</b> (NAT).</li><li>데이터는 패킷에 담겨 <a data-lesson="d08"></a>에서 배운 대로 게이트웨이와 라우터를 거쳐 서버에 도착하고, 응답이 돌아옵니다.</li></ol>
<p>어느 한 단계라도 막히면 "접속이 안 된다"가 됩니다. 그래서 뒤쪽 절에서는 단계마다 확인하는 명령과, 어디서 막혔는지 좁혀 가는 순서를 배웁니다. 먼저 첫 단계인 DNS입니다.</p>
<p>네트워크의 통신은 IP<span class="small muted">(Internet Protocol)</span> 주소로 이루어집니다(<a data-lesson="d07"></a>). 그런데 사람은 203.0.113.10 같은 숫자보다 www.example.com 같은 이름을 씁니다. <b>DNS</b><span class="small muted">(Domain Name System)</span>는 이 <b>도메인 이름을 IP 주소로 바꿔 주는 체계</b>입니다. 통신을 시작하기 전에 가장 먼저 일어나는 일이 DNS 조회입니다.</p>
<p>이름을 쓰면 좋은 점은 두 가지입니다.</p>
<ul><li>사람이 기억하고 전달하기 쉽습니다.</li><li>서버의 IP 주소가 바뀌어도 이름은 그대로 쓸 수 있습니다. 이름이 가리키는 IP 주소만 바꾸면 됩니다.</li></ul>
<h3>도메인 이름의 구조</h3>
<p>도메인 이름은 점으로 나뉜 계층 구조이고, <b>오른쪽이 위쪽</b>입니다. <code>www.example.com</code>을 오른쪽부터 읽으면 이렇습니다.</p>
<div class="tbl-wrap"><table><thead><tr><th>부분</th><th>이름</th><th>뜻</th></tr></thead><tbody>
<tr><td><code>.</code> <span class="small muted">(맨 끝, 보통 생략)</span></td><td class="nw"><b>루트</b></td><td>모든 이름의 시작점</td></tr>
<tr><td><code>com</code></td><td class="nw"><b>최상위 도메인</b> <span class="small muted">TLD</span></td><td>com, net, org, kr 같은 가장 위의 구분</td></tr>
<tr><td><code>example</code></td><td class="nw"><b>도메인</b></td><td>조직이 등록해서 쓰는 이름</td></tr>
<tr><td><code>www</code></td><td class="nw"><b>호스트 이름</b></td><td>조직이 그 아래에 자유롭게 붙이는 이름. www, api, mail 등</td></tr>
</tbody></table></div>
<p class="small muted">TLD: Top-Level Domain · example.com은 문서의 예시용으로 예약된 이름입니다. 이 레슨의 IP 주소도 <a data-lesson="d08"></a>에서 본 예시용 주소를 씁니다. www.example.com의 IP 주소로 적은 203.0.113.10은 설명을 위해 지어낸 값이라서, 실제로 조회하면 다른 주소가 나옵니다.</p>
<p>계층마다 그 아래 이름을 관리하는 <b>네임서버</b>가 따로 있습니다. 루트 네임서버는 com을 관리하는 네임서버가 어디인지 알고, com 네임서버는 example.com을 관리하는 네임서버가 어디인지 압니다. 전 세계의 이름을 한곳에 모아 두지 않고 이렇게 나눠서 관리합니다.</p>

<h2 id="s2">DNS 조회 과정과 레코드</h2>
<p>내 PC가 www.example.com의 IP 주소를 알아내는 과정에는 세 종류의 서버가 나옵니다.</p>
<ul><li><b>리졸버</b><span class="small muted">(Recursive Resolver, 재귀 DNS 서버)</span>: 내 PC가 질문을 보내는 DNS 서버입니다. 여러 네임서버에 차례로 물어서 답을 찾아 주고, 한 번 알아낸 답을 한동안 저장해 둡니다. 이렇게 저장해 두는 것을 <b>캐시</b>라고 합니다. 리졸버는 회사, 통신사, 클라우드가 제공합니다.</li><li><b>루트 네임서버, 최상위 도메인 네임서버</b>: "그 이름은 저 네임서버가 관리한다"고 다음에 물어볼 곳을 알려 줍니다.</li><li><b>권한 있는 네임서버</b><span class="small muted">(Authoritative Name Server)</span>: 그 도메인의 정보 원본을 가지고 최종 답을 줍니다.</li></ul>
<svg class="fig" viewBox="0 0 560 304" role="img" aria-label="DNS 조회 과정. 1번: 내 PC가 DNS 서버(리졸버)에 www.example.com의 IP 주소를 묻는다. 2번: 리졸버가 루트 네임서버에 묻고 com 네임서버의 위치를 받는다. 3번: com 네임서버에 묻고 example.com 네임서버의 위치를 받는다. 4번: example.com의 권한 있는 네임서버에 묻고 IP 주소를 받는다. 5번: 리졸버가 내 PC에 IP 주소를 알려 주고 캐시에 보관한다.">
<use href="#i-pc" x="16" y="118" width="48" height="48"/><text x="40" y="188" class="c">내 PC</text><text x="4" y="210" class="t-s">캐시·hosts 먼저</text>
<use href="#i-server" x="216" y="118" width="48" height="48" class="acc"/><text x="240" y="188" class="c">DNS 서버</text><text x="240" y="210" class="c t-s">리졸버 (캐시)</text>
<use href="#i-server" x="456" y="8" width="48" height="48"/><text x="480" y="76" class="c">루트 네임서버</text>
<use href="#i-server" x="456" y="106" width="48" height="48"/><text x="480" y="174" class="c">com 네임서버</text>
<use href="#i-server" x="456" y="204" width="48" height="48"/><text x="480" y="270" class="c">example.com</text><text x="480" y="292" class="c t-s">권한 있는 네임서버</text>
<line x1="68" y1="134" x2="212" y2="134" class="ln" marker-end="url(#ar)"/>
<line x1="212" y1="152" x2="68" y2="152" class="ln acc" marker-end="url(#ar-acc)"/>
<line x1="266" y1="128" x2="452" y2="40" class="ln" marker-start="url(#ar)" marker-end="url(#ar)"/>
<line x1="268" y1="140" x2="452" y2="132" class="ln" marker-start="url(#ar)" marker-end="url(#ar)"/>
<line x1="266" y1="154" x2="452" y2="224" class="ln" marker-start="url(#ar)" marker-end="url(#ar)"/>
<g class="badge"><circle cx="140" cy="118" r="11"/><text x="140" y="123.5">1</text></g>
<g class="badge"><circle cx="358" cy="84" r="11"/><text x="358" y="89.5">2</text></g>
<g class="badge"><circle cx="372" cy="136" r="11"/><text x="372" y="141.5">3</text></g>
<g class="badge"><circle cx="358" cy="189" r="11"/><text x="358" y="194.5">4</text></g>
<g class="badge"><circle cx="140" cy="170" r="11"/><text x="140" y="175.5">5</text></g>
</svg>
<p class="fig-cap">번호는 아래 순서와 같습니다. 리졸버가 내 PC를 대신해서 세 곳에 차례로 묻습니다.</p>
<ol><li>내 PC가 리졸버에 "www.example.com의 IP 주소는?" 하고 묻습니다. 그 전에 자기 캐시와 <code>/etc/hosts</code> 파일에 답이 있는지 먼저 봅니다.</li><li>리졸버가 <b>루트 네임서버</b>에 묻습니다. 루트는 "com은 저 네임서버가 관리한다"고 알려 줍니다.</li><li>리졸버가 <b>com 네임서버</b>에 묻습니다. "example.com은 저 네임서버가 관리한다"고 알려 줍니다.</li><li>리졸버가 <b>example.com의 권한 있는 네임서버</b>에 묻습니다. "www.example.com은 203.0.113.10"이라는 최종 답을 받습니다.</li><li>리졸버가 내 PC에 답을 알려 주고, 같은 질문에 바로 답할 수 있게 캐시에 보관합니다.</li></ol>
<h3>캐시와 TTL</h3>
<p>DNS의 답에는 <b>TTL</b><span class="small muted">(Time To Live)</span>이라는 값이 붙어 있습니다. 이 답을 캐시에 보관해도 되는 시간(초)입니다. 리졸버와 PC는 그 시간 동안 다시 묻지 않고 캐시의 답을 씁니다. 그래서 조회가 빠릅니다. 반대로 <mark>이름이 가리키는 IP 주소를 바꿔도, TTL이 지날 때까지는 예전 주소로 접속되는 사용자가 있을 수 있습니다.</mark></p>
<h3>레코드: 이름에 연결된 정보</h3>
<p>네임서버가 가진 정보 한 줄을 <b>레코드</b>라고 합니다. 종류에 따라 이름에 연결하는 것이 다릅니다.</p>
<div class="tbl-wrap"><table><thead><tr><th>종류</th><th>연결하는 것</th><th>예</th></tr></thead><tbody>
<tr><td><b>A</b></td><td>이름 → IPv4 주소</td><td class="nw">www.example.com → 203.0.113.10</td></tr>
<tr><td><b>AAAA</b></td><td>이름 → IPv6 주소</td><td>-</td></tr>
<tr><td><b>CNAME</b></td><td>이름 → 다른 이름 (별명)</td><td class="nw">shop.example.com → www.example.com</td></tr>
<tr><td><b>MX</b></td><td>이 도메인의 메일을 받는 서버</td><td>-</td></tr>
<tr><td><b>NS</b></td><td>이 도메인을 관리하는 네임서버</td><td>-</td></tr>
</tbody></table></div>
<p class="small muted">A: Address · CNAME: Canonical Name · MX: Mail Exchange · NS: Name Server · IPv4, IPv6: IP version 4, 6(<a data-lesson="d07"></a>)</p>
<h3>Linux 서버에서</h3>
<ul><li><code>/etc/hosts</code>: 이름과 IP 주소를 직접 적어 두는 파일입니다. 기본 설정에서는 DNS 서버에 묻기 전에 이 파일을 먼저 봅니다.</li><li><code>/etc/resolv.conf</code>: 질문을 보낼 DNS 서버(리졸버)의 주소가 <code>nameserver</code> 줄에 적혀 있습니다.</li></ul>
<p class="small muted">두 파일은 <a data-lesson="d03"></a>에서 기본 파일로 봤습니다. 회사나 클라우드 안에서만 쓰는 내부 이름은 내부 DNS 서버만 알고 있어서, 인터넷의 DNS로는 조회되지 않습니다.</p>

<h2 id="s3">TCP와 UDP</h2>
<p>IP 주소를 알아냈으면 데이터를 보낼 차례입니다. 데이터를 상대 프로그램까지 전달하는 일은 전송 계층(4계층, <a data-lesson="d07"></a>)이 맡고, 프로토콜은 두 가지입니다.</p>
<p>데이터는 작은 조각으로 나뉘어 IP 패킷에 담겨 갑니다(<a data-lesson="d07"></a>). IP는 패킷을 목적지 쪽으로 전달할 뿐이고, 중간에 사라지거나 순서가 뒤바뀌어도 알려 주지 않습니다. 그 빈틈을 어떻게 다루느냐가 두 프로토콜의 차이입니다.</p>
<p><b>TCP</b><span class="small muted">(Transmission Control Protocol)</span>는 <b>연결을 먼저 맺고</b>, 데이터가 <b>빠짐없이 순서대로</b> 도착하게 관리합니다. 앞의 예에서 브라우저는 DNS로 알아낸 203.0.113.10에 TCP 연결부터 맺습니다.</p>
<ul><li>데이터를 보내기 전에 양쪽이 준비됐는지 확인하는 절차를 거칩니다. 이것이 아래 그림의 <b>3-way handshake</b>입니다.</li><li>받은 쪽은 "여기까지 받았다"는 확인을 보냅니다. 확인이 오지 않으면 보낸 쪽이 다시 보냅니다.</li><li>조각마다 순서 번호가 있어서, 뒤바뀌어 도착해도 받는 쪽에서 순서를 맞춥니다.</li></ul>
<svg class="fig" viewBox="0 0 560 250" role="img" aria-label="TCP 3-way handshake. 클라이언트가 서버에 SYN(연결 요청)을 보내고, 서버가 SYN+ACK(요청 수락)로 답하고, 클라이언트가 ACK(확인)를 보내면 연결이 맺어진다. 그다음부터 데이터를 주고받는다.">
<text x="120" y="24" class="c b">클라이언트</text><text x="120" y="46" class="c t-s">임시 포트 (예: 50000)</text>
<text x="440" y="24" class="c b">서버</text><text x="440" y="46" class="c t-s">LISTEN 중인 포트 (예: 443)</text>
<line x1="120" y1="58" x2="120" y2="218" class="ln"/><line x1="440" y1="58" x2="440" y2="218" class="ln"/>
<text x="280" y="84" class="c">SYN (연결 요청)</text><line x1="124" y1="92" x2="436" y2="116" class="ln acc" marker-end="url(#ar-acc)"/>
<text x="280" y="130" class="c">SYN + ACK (요청 수락)</text><line x1="436" y1="138" x2="124" y2="162" class="ln acc" marker-end="url(#ar-acc)"/>
<text x="280" y="176" class="c">ACK (확인)</text><line x1="124" y1="184" x2="436" y2="208" class="ln acc" marker-end="url(#ar-acc)"/>
<g class="badge"><circle cx="96" cy="92" r="11"/><text x="96" y="97.5">1</text></g>
<g class="badge"><circle cx="464" cy="138" r="11"/><text x="464" y="143.5">2</text></g>
<g class="badge"><circle cx="96" cy="184" r="11"/><text x="96" y="189.5">3</text></g>
<text x="280" y="240" class="c t-s">연결 완료. 이제 데이터를 주고받음</text>
</svg>
<p class="small muted">SYN: Synchronize(연결을 시작하자는 신호) · ACK: Acknowledgment(받았다는 확인). 통신이 끝나면 FIN(Finish) 신호를 주고받아 연결을 닫습니다.</p>
<p><b>UDP</b><span class="small muted">(User Datagram Protocol)</span>는 <b>연결 없이 바로</b> 보냅니다. 도착했는지 확인하지 않고, 순서도 맞춰 주지 않습니다. 대신 절차가 적어서 가볍고 빠릅니다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>TCP</th><th>UDP</th></tr></thead><tbody>
<tr><td class="nw"><b>연결</b></td><td>먼저 맺음 (3-way handshake)</td><td>맺지 않음</td></tr>
<tr><td class="nw"><b>도착과 순서</b></td><td>빠짐없이 순서대로 (확인, 재전송)</td><td>보장하지 않음</td></tr>
<tr><td class="nw"><b>부담</b></td><td>절차가 많아 상대적으로 무거움</td><td>가볍고 빠름</td></tr>
<tr><td class="nw"><b>쓰는 곳</b></td><td>웹(HTTP·HTTPS), SSH, DB 접속, 파일 전송</td><td>DNS 조회, 음성·영상 통화처럼 조금 빠져도 지금 것이 중요한 통신</td></tr>
</tbody></table></div>
<p class="small muted">HTTP: HyperText Transfer Protocol · HTTPS: HTTP Secure · SSH: Secure Shell · DB: Database. HTTP와 HTTPS는 <a data-lesson="d10"></a>, SSH는 <a data-lesson="d04"></a>에서 다룹니다.</p>
<div class="box analogy"><span class="lbl">비유로 보면</span>TCP는 전화와 비슷합니다. 먼저 연결하고, 못 들은 말은 다시 말해 달라고 합니다. UDP는 안내 방송과 비슷합니다. 듣는 사람이 준비됐는지 확인하지 않고 바로 내보냅니다.</div>
<p>접속이 안 될 때 보는 오류는 대부분 3-way handshake 단계에서 납니다. 첫 SYN에 답이 없는지, 거절하는 답이 오는지에 따라 메시지가 달라집니다. 아래 <a href="#d09" data-sec="s7">「접속 실패의 세 가지 모양」 절</a>에서 봅니다.</p>

<h2 id="s4">포트: 서버 안의 어느 프로그램인가</h2>
<p>IP 주소는 서버까지만 알려 줍니다. 서버 한 대에서는 웹 서버, SSH 서버, DB 같은 프로그램이 여러 개 돌아갑니다. 그 가운데 <b>어느 프로그램에 전달할지 구분하는 번호가 포트 번호</b>입니다(<a data-lesson="d04"></a>에서 SSH의 22번 포트로 처음 봤습니다).</p>
<ul><li>포트 번호는 16비트라서 <b>0부터 65535까지</b>입니다. TCP와 UDP가 각자 따로 가집니다.</li><li>IP 주소와 포트 번호를 짝지은 것을 <b>소켓</b>이라고 하고 <code>10.0.1.10:443</code>처럼 씁니다. 프로그램은 소켓을 열어서 통신합니다. 웹 서버 프로그램은 "서버의 IP 주소:443" 소켓을 열어 놓고 기다리고, 브라우저는 "내 IP 주소:임시 포트" 소켓을 열어 거기에 접속합니다. 뒤에 나오는 <code>ss</code> 명령이 보여 주는 것이 이 소켓의 목록입니다.</li></ul>
<div class="tbl-wrap"><table><thead><tr><th>범위</th><th>이름</th><th>쓰임새</th></tr></thead><tbody>
<tr><td class="nw">0 ~ 1023</td><td class="nw"><b>잘 알려진 포트</b></td><td>널리 쓰는 서비스에 정해 둔 번호. Linux 기본 설정에서는 관리자 권한이 있어야 열 수 있음</td></tr>
<tr><td class="nw">1024 ~ 49151</td><td class="nw">등록된 포트</td><td>여러 프로그램이 등록해서 쓰는 번호. 예: 3306, 8080</td></tr>
<tr><td class="nw">49152 ~ 65535</td><td class="nw"><b>임시 포트</b></td><td>접속하는 쪽(클라이언트)이 잠깐 쓰는 번호</td></tr>
</tbody></table></div>
<p class="small muted">임시 포트로 실제 쓰는 범위는 운영체제에 따라 다릅니다. Linux의 기본값은 32768~60999입니다.</p>
<div class="box mem"><span class="lbl">외울 것: 자주 보는 포트 (기본값)</span>
<div class="tbl-wrap" style="margin:.5rem 0 0"><table><tbody>
<tr><td><code>22</code></td><td>SSH</td><td><code>80</code></td><td>HTTP</td><td><code>443</code></td><td>HTTPS</td></tr>
<tr><td><code>53</code></td><td>DNS</td><td><code>3306</code></td><td>MySQL (DB)</td><td><code>3389</code></td><td>Windows 원격 데스크톱</td></tr>
<tr><td><code>2049</code></td><td>NFS</td><td><code>445</code></td><td>SMB</td><td><code>3260</code></td><td>iSCSI</td></tr>
</tbody></table></div></div>
<p class="small muted">기본값일 뿐이고 설정으로 바꿀 수 있습니다. <a data-lesson="d01"></a>의 예에서는 WAS(Web Application Server)가 8080번을 썼습니다. NFS(Network File System)와 SMB(Server Message Block)는 <a data-lesson="d12"></a>, iSCSI(Internet Small Computer Systems Interface)는 <a data-lesson="d11"></a>에서 배웁니다. DNS는 주로 UDP 53번을 쓰고, 답이 클 때는 TCP 53번도 씁니다.</p>
<h3>서버 쪽: LISTEN</h3>
<p>서버 프로그램은 자기 포트를 열어 놓고 접속 요청을 기다립니다. 이 상태를 <b>LISTEN</b>이라고 합니다. 웹 서버가 80번 포트에서 LISTEN 중이어야 80번으로 온 요청을 받을 수 있습니다. 같은 IP 주소의 같은 포트는 한 프로그램만 쓸 수 있습니다.</p>
<h3>클라이언트 쪽: 임시 포트</h3>
<p>접속하는 쪽도 포트가 필요합니다. 응답을 돌려받을 곳이 있어야 하기 때문입니다. 접속할 때 운영체제가 비어 있는 <b>임시 포트</b>를 하나 골라 출발지 포트로 씁니다.</p>
<div class="tbl-wrap"><table><thead><tr><th></th><th>출발지 (IP 주소:포트)</th><th>목적지 (IP 주소:포트)</th></tr></thead><tbody>
<tr><td class="nw"><b>요청</b></td><td>10.0.1.10:<b>50000</b></td><td>203.0.113.10:<b>443</b></td></tr>
<tr><td class="nw"><b>응답</b></td><td>203.0.113.10:<b>443</b></td><td>10.0.1.10:<b>50000</b></td></tr>
</tbody></table></div>
<p>통신 하나는 <b>출발지 IP 주소, 출발지 포트, 목적지 IP 주소, 목적지 포트</b> 네 값으로 구분됩니다. 웹 서버의 443번 포트 하나에 수많은 사용자가 접속해도, 사용자마다 출발지 IP 주소와 포트가 달라서 섞이지 않습니다.</p>
<div class="box warn"><span class="lbl">"포트가 열려 있다"의 두 가지 조건</span><p>① 서버에서 프로그램이 그 포트를 LISTEN하고 있고, ② 중간의 방화벽이나 Security Group이 그 포트를 허용해야 합니다. 하나라도 빠지면 접속되지 않습니다. 방화벽은 규칙에 따라 통신을 허용하거나 막는 기능이고(<a data-lesson="d01"></a>), Security Group은 클라우드에서 VM<span class="small muted">(Virtual Machine)</span>에 붙이는 방화벽 규칙입니다. 자세한 내용은 <a data-lesson="d10"></a>에서 배웁니다.</p></div>

<h2 id="s5">NAT: 주소를 바꿔 주는 기능</h2>
<p><a data-lesson="d08"></a>에서 사설 IP는 인터넷에서 라우팅되지 않는다고 배웠습니다. 사설 IP를 출발지로 적은 패킷이 그대로 인터넷에 나가면, 서버가 응답을 보낼 길이 없습니다. 그래서 인터넷과 맞닿은 장비가 주소를 바꿔 줍니다. 이 기능이 <b>NAT</b><span class="small muted">(Network Address Translation)</span>입니다.</p>
<p>NAT는 넓은 뜻으로 "패킷의 주소를 바꿔 주는 기능" 전체를 가리킵니다. 무엇까지 바꾸느냐에 따라 둘로 나뉩니다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>바꾸는 것</th><th>사설 IP와 공인 IP의 짝</th><th>쓰는 곳</th></tr></thead><tbody>
<tr><td class="nw"><b>NAT</b> <span class="small muted">좁은 뜻, 1:1 NAT</span></td><td><b>IP 주소만</b>. 포트 번호는 그대로</td><td>사설 IP 하나 ↔ 공인 IP 하나</td><td>서버 한 대에 공인 IP 하나를 짝지어 줄 때</td></tr>
<tr><td class="nw"><b>PAT</b> <span class="small muted">NAPT</span></td><td><b>IP 주소와 포트 번호</b></td><td>사설 IP 여러 개 ↔ 공인 IP 하나</td><td>여러 장비가 공인 IP 하나로 인터넷에 나갈 때. 가정용 공유기가 대표적</td></tr>
</tbody></table></div>
<p class="small muted">PAT: Port Address Translation · NAPT: Network Address Port Translation. 둘은 같은 것을 가리키는 이름입니다. 현장에서는 PAT도 그냥 "NAT"라고 부르는 일이 많습니다. 그래서 "NAT"라는 말을 들으면 포트까지 바꾸는 방식인지 아닌지를 구분해서 봐야 합니다.</p>
<p>먼저 더 흔한 PAT의 동작을 따라갑니다.</p>
<svg class="fig" viewBox="0 0 560 280" role="img" aria-label="NAT 그림. 내 PC(10.0.1.10)가 보낸 패킷은 출발지 10.0.1.10:50000, 목적지 203.0.113.10:443이다. NAT 장비(공인 IP 198.51.100.5)를 지난 뒤에는 출발지가 198.51.100.5:61001로 바뀌고 목적지는 그대로다. NAT 장비는 이 변환을 NAT 테이블에 기억해 두었다가 응답이 오면 거꾸로 바꿔 준다.">
<use href="#i-pc" x="22" y="12" width="48" height="48"/><text x="46" y="80" class="c">내 PC</text><text x="46" y="100" class="c t-s">10.0.1.10</text>
<use href="#i-router" x="256" y="12" width="48" height="48" class="acc"/><text x="280" y="80" class="c">NAT 장비</text><text x="280" y="100" class="c t-s">공인 IP 198.51.100.5</text>
<use href="#i-server" x="476" y="12" width="48" height="48"/><text x="500" y="80" class="c">서버</text><text x="500" y="100" class="c t-s">203.0.113.10</text>
<line x1="72" y1="36" x2="258" y2="36" class="ln" marker-end="url(#ar)"/><line x1="302" y1="36" x2="478" y2="36" class="ln acc" marker-end="url(#ar-acc)"/>
<text x="20" y="132" class="t-s">NAT를 지나기 전</text><rect x="20" y="140" width="240" height="76" rx="4" class="bx-n"/>
<text x="32" y="170" class="t-m">출발지 10.0.1.10:50000</text><text x="32" y="198" class="t-m">목적지 203.0.113.10:443</text>
<text x="300" y="132" class="t-s">NAT를 지난 뒤</text><rect x="300" y="140" width="240" height="76" rx="4" class="bx-a"/>
<text x="312" y="170" class="t-m b t-acc">출발지 198.51.100.5:61001</text><text x="312" y="198" class="t-m">목적지 203.0.113.10:443</text>
<line x1="262" y1="178" x2="296" y2="178" class="ln acc" marker-end="url(#ar-acc)"/>
<text x="280" y="246" class="c b">NAT 테이블에 기억</text><text x="280" y="268" class="c t-m">10.0.1.10:50000 ↔ 198.51.100.5:61001</text>
</svg>
<p class="fig-cap">PAT의 예입니다. 나가는 패킷은 출발지의 IP 주소와 포트 번호가 바뀌고, 목적지는 그대로입니다.</p>
<ol><li>내 PC가 패킷을 보냅니다. 출발지는 10.0.1.10:50000, 목적지는 203.0.113.10:443입니다.</li><li>NAT 장비가 <b>출발지</b>를 자기 공인 IP와 새 포트(198.51.100.5:61001)로 바꿔서 인터넷으로 내보냅니다. 무엇을 무엇으로 바꿨는지는 <b>NAT 테이블</b>에 적어 둡니다.</li><li>서버는 198.51.100.5:61001에서 온 요청으로 알고, 그 주소로 응답합니다.</li><li>NAT 장비가 응답을 받으면 NAT 테이블을 보고 <b>목적지</b>를 10.0.1.10:50000으로 되돌려 내 PC에 전달합니다.</li></ol>
<ul><li>PAT는 포트 번호까지 함께 바꾸기 때문에, <b>PC 여러 대가 공인 IP 하나를 함께 쓸 수 있습니다</b>. 통신마다 다른 포트를 붙여서 구분합니다.</li><li>PAT에서는 밖에서 먼저 시작한 통신이 안쪽으로 들어오지 못합니다. NAT 테이블에 그 통신의 기록이 없기 때문입니다.</li><li>집에서 쓰는 인터넷 공유기가 이 일을 하는 대표적인 장비입니다.</li></ul>
<p><b>IP 주소만 바꾸는 1:1 NAT</b>라면 같은 패킷의 출발지는 10.0.1.10:50000에서 198.51.100.5:<b>50000</b>으로 바뀝니다. IP 주소만 바뀌고 포트 번호는 그대로입니다. 공인 IP 하나를 장비 한 대가 혼자 쓰므로 포트로 구분할 필요가 없고, 밖에서 그 공인 IP로 먼저 들어오는 통신도 짝지어진 장비로 전달할 수 있습니다.</p>
<p><a data-lesson="d08"></a>의 "IP 주소는 끝까지 그대로"에 이제 예외를 붙일 수 있습니다. <mark>라우터는 IP 주소를 바꾸지 않지만, NAT 장비를 지날 때는 출발지 주소가 바뀝니다.</mark> 목적지 IP 주소는 이때도 그대로입니다.</p>
<h3>방향에 따른 구분: SNAT와 DNAT</h3>
<p>어느 쪽 주소를 바꾸느냐로도 나눕니다. 위의 "IP 주소만 바꾸느냐, 포트까지 바꾸느냐"와는 별개의 구분입니다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>종류</th><th>바꾸는 것</th><th>쓰는 곳</th></tr></thead><tbody>
<tr><td class="nw"><b>SNAT</b> <span class="small muted">Source NAT</span></td><td>출발지 주소</td><td>사설 IP를 쓰는 장비가 인터넷으로 <b>나갈 때</b>. 위 그림의 예가 이것</td></tr>
<tr><td class="nw"><b>DNAT</b> <span class="small muted">Destination NAT</span></td><td>목적지 주소 (필요하면 포트 번호도)</td><td>밖에서 <b>들어온</b> 통신을 안쪽 서버로 넘길 때. 포트 포워딩이라고도 함</td></tr>
</tbody></table></div>
<h3>클라우드에서: VM의 사설 IP와 공인 IP</h3>
<p>클라우드의 VM은 Subnet의 사설 IP를 받고, 인터넷과 통신해야 하면 공인 IP를 연결합니다. 이때 <b>그 공인 IP가 VM 안에서 보이는지는 환경에 따라 다릅니다.</b></p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>환경</th><th>VM 안에서 <code>ip addr</code>를 보면</th><th>공인 IP가 연결되는 방식</th></tr></thead><tbody>
<tr><td class="nw"><b>AWS</b></td><td>사설 IP만 보임</td><td>공인 IP(Elastic IP)는 VM의 NIC에 붙지 않음. VPC의 인터넷 게이트웨이가 공인 IP와 사설 IP를 1:1로 바꿔 줌</td></tr>
<tr><td class="nw"><b>Zadara zCompute</b></td><td>사내 실습 환경에서 직접 확인</td><td>네트워크 구성 요소의 이름과 구조가 AWS의 VPC와 같음(인터넷 게이트웨이, NAT 게이트웨이, Elastic IP). 공인 IP는 Elastic IP로 할당</td></tr>
<tr><td class="nw"><b>공인 IP를 NIC에 직접 주는 환경</b></td><td>공인 IP가 보임</td><td>주소 변환 없이 서버가 공인 IP를 직접 가짐. 일부 호스팅 서비스와 온프레미스 서버</td></tr>
</tbody></table></div>
<p class="small muted">AWS: Amazon Web Services · NIC: Network Interface Card · VPC: Virtual Private Cloud. Private Subnet의 서버가 밖으로 나갈 때 거치는 NAT 게이트웨이(<a data-lesson="d08"></a>)는 여러 서버가 공인 IP 하나를 함께 쓰는 PAT 방식입니다. zCompute에서의 구성은 <a data-lesson="zc2"></a>에서 다룹니다.</p>
<div class="box warn"><span class="lbl">"서버가 아는 내 주소"와 "밖에서 보이는 주소"는 다를 수 있습니다</span><p>주소 변환을 거치는 환경에서는 VM 안에서 확인한 주소(사설 IP)와 사용자가 접속하는 주소(공인 IP)가 다릅니다. VM 안에서 공인 IP가 보이지 않는다고 고장은 아닙니다. 어느 방식인지는 환경마다 다르니 일반화하지 말고, 쓰는 환경에서 <code>ip addr</code>의 결과와 콘솔에 표시된 공인 IP를 비교해 확인합니다.</p></div>
<div class="box analogy"><span class="lbl">비유로 보면</span>회사에서 밖으로 전화를 걸면 상대에게는 대표 번호가 찍힙니다. 교환기는 어느 내선에서 건 전화인지 기억해 두었다가, 돌아오는 통화를 그 내선으로 연결합니다. 대표 번호가 공인 IP, 내선 번호가 사설 IP, 교환기의 기록이 NAT 테이블입니다.</div>
<p class="small muted">NAT는 주소를 바꾸는 기능이고, 통신을 허용하거나 막는 규칙은 방화벽과 Security Group(<a data-lesson="d10"></a>)이 맡습니다.</p>

<h2 id="s6">통신 확인 명령어</h2>
<p>여기까지 배운 것을 서버에서 직접 확인하는 명령입니다. <a data-lesson="d07"></a>과 <a data-lesson="d08"></a>에서 출력만 읽어 본 <code>ip addr</code>, <code>ip route</code>도 함께 정리합니다.</p>
<div class="box warn"><span class="lbl">아래 출력은 모두 학습용 예시입니다</span><p>IP 주소(10.0.x.x, 198.51.100.x, 203.0.113.x), 이름(example.com), 시간 값은 설명을 위해 지어낸 것이고, 줄 일부는 <code>...</code>로 줄였습니다. 같은 명령을 실제로 실행하면 값과 줄 수가 다르게 나옵니다. 여기서는 <b>어느 줄의 어디를 보는지</b>만 익히세요.</p></div>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>명령</th><th>하는 일</th><th>출력에서 볼 곳</th></tr></thead><tbody>
<tr><td class="nw"><code>ip addr</code></td><td>이 서버의 인터페이스와 IP 주소 보기</td><td><code>state UP</code>인지, <code>inet</code> 뒤의 IP 주소와 /숫자</td></tr>
<tr><td class="nw"><code>ip route</code></td><td>이 서버의 라우팅 테이블 보기</td><td><code>default via</code> 뒤의 기본 게이트웨이</td></tr>
<tr><td class="nw"><code>ping -c 4 대상</code></td><td>대상까지 갔다가 돌아오는지 확인</td><td><code>time=</code>(왕복 시간), <code>packet loss</code>(손실률)</td></tr>
<tr><td class="nw"><code>traceroute 대상</code></td><td>목적지까지 거치는 라우터(홉) 보기</td><td>몇 번째 홉까지 답이 오는지, <code>* * *</code></td></tr>
<tr><td class="nw"><code>nslookup 이름</code><br><code>dig 이름</code></td><td>DNS 조회</td><td>답으로 나온 IP 주소, 답해 준 DNS 서버</td></tr>
<tr><td class="nw"><code>ss -tlnp</code></td><td>이 서버에서 열려 있는(LISTEN) TCP 포트와 프로그램 보기</td><td><code>Local Address:Port</code>의 주소와 포트, 프로그램 이름</td></tr>
<tr><td class="nw"><code>nc -zv 대상 포트</code></td><td>대상의 포트에 TCP 연결이 되는지 확인</td><td>성공인지, refused인지, timed out인지</td></tr>
<tr><td class="nw"><code>curl -I URL</code></td><td>HTTP 요청을 보내 응답의 헤더만 보기</td><td>첫 줄의 상태 코드, 실패했을 때의 메시지</td></tr>
</tbody></table></div>
<p class="small muted">ss: socket statistics · dig: domain information groper · nc: netcat · curl: client URL · URL: Uniform Resource Locator(웹 주소). traceroute, dig, nc는 배포판에 따라 따로 설치해야 할 수 있습니다. Windows에서는 <code>ipconfig</code>, <code>ping</code>, <code>tracert</code>, <code>nslookup</code>을 같은 용도로 씁니다.</p>
<h3>ip addr, ip route: 내 설정 확인</h3>
<pre class="code">$ ip addr
1: lo: &lt;LOOPBACK,UP,LOWER_UP&gt; ...
    inet 127.0.0.1/8 scope host lo
2: eth0: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; ... state UP ...
    link/ether 52:54:00:00:01:10 brd ff:ff:ff:ff:ff:ff
    inet 10.0.1.10/24 brd 10.0.1.255 scope global eth0

$ ip route
default via 10.0.1.1 dev eth0
10.0.1.0/24 dev eth0 proto kernel scope link src 10.0.1.10</pre>
<ul><li>번호가 붙은 줄 하나가 <b>인터페이스</b> 하나입니다. 인터페이스는 서버가 네트워크에 연결되는 접점입니다(<a data-lesson="d08"></a>). <code>lo</code>는 자기 자신을 가리키는 루프백(127.0.0.1)이고, <code>eth0</code>이 실제 NIC입니다. 이름은 환경에 따라 다릅니다.</li><li><code>state UP</code>: 인터페이스가 켜져 있고 연결되어 있습니다. DOWN이면 케이블이나 연결부터 확인합니다.</li><li><code>link/ether</code>: 이 NIC의 MAC<span class="small muted">(Media Access Control)</span> 주소입니다.</li><li><code>inet 10.0.1.10/24</code>: IP 주소와 /숫자입니다(<a data-lesson="d07"></a>).</li><li><code>default via 10.0.1.1</code>: 기본 게이트웨이입니다(<a data-lesson="d08"></a>). 이 줄이 없으면 다른 네트워크로 나가지 못합니다.</li></ul>
<h3>ping: 갔다가 돌아오는지</h3>
<pre class="code">$ ping -c 4 10.0.1.1
64 bytes from 10.0.1.1: icmp_seq=1 ttl=64 time=0.412 ms
64 bytes from 10.0.1.1: icmp_seq=2 ttl=64 time=0.398 ms
...
4 packets transmitted, 4 received, 0% packet loss, time 3004ms</pre>
<p>ping은 <b>ICMP</b><span class="small muted">(Internet Control Message Protocol)</span>라는 프로토콜을 씁니다. TCP와 UDP가 프로그램의 데이터를 실어 나른다면, ICMP는 <b>네트워크의 상태를 확인하고 오류를 알리는 데</b> 쓰는 프로토콜입니다. IP 패킷에 바로 실려 가고 포트 번호가 없습니다(<a data-lesson="d07"></a>의 표에서 IP와 같은 인터넷 계층). ping은 ICMP로 "받으면 그대로 답해 달라"는 요청(에코 요청)을 보내고, 답(에코 응답)이 돌아오는지를 봅니다.</p>
<ul><li>한 줄이 답 하나입니다. <code>time=</code>은 갔다가 돌아오는 데 걸린 왕복 시간입니다.</li><li><code>ttl=64</code>는 돌아온 패킷에 남아 있던 TTL 값입니다. TTL은 아래 traceroute에서 설명합니다.</li><li>마지막 줄의 <code>0% packet loss</code>는 보낸 것이 모두 돌아왔다는 뜻입니다. 100%면 답이 하나도 없는 것입니다.</li><li><code>-c 4</code>는 4번만 보내라는 옵션입니다. Linux에서는 이 옵션이 없으면 <kbd>Ctrl</kbd>+<kbd>C</kbd>로 멈출 때까지 계속 보냅니다.</li></ul>
<div class="box warn"><span class="lbl">ping 결과를 읽을 때: 실패가 곧 연결 실패는 아닙니다</span><ul><li><b>ping 성공</b>: 대상까지 IP 패킷이 갔다가 돌아옵니다. 경로는 정상입니다. 다만 원하는 포트가 열려 있다는 뜻은 아닙니다.</li><li><b>ping 실패</b>: 이것만으로는 결론을 낼 수 없습니다. 보안 때문에 ICMP를 막아 둔 서버와 방화벽이 많습니다. 클라우드에서는 Security Group에 ICMP를 허용하는 규칙이 없으면 ping이 실패하는 것이 보통입니다. 이때도 웹이나 SSH 접속은 정상일 수 있습니다.</li><li>그래서 ping이 실패했다고 "네트워크가 끊겼다"거나 "서버가 꺼졌다"고 판단하지 않습니다. 포트 확인(<code>nc</code>, <code>curl</code>) 결과와 함께 봅니다.</li></ul></div>
<h3>traceroute: 어디까지 가는지</h3>
<pre class="code">$ traceroute 203.0.113.10
traceroute to 203.0.113.10 (203.0.113.10), 30 hops max, 60 byte packets
 1  10.0.1.1 (10.0.1.1)  0.412 ms  0.398 ms  0.377 ms
 2  198.51.100.1 (198.51.100.1)  1.203 ms  1.185 ms  1.240 ms
 3  * * *
 4  203.0.113.10 (203.0.113.10)  8.911 ms  9.102 ms  8.874 ms</pre>
<p><a data-lesson="d08"></a>에서 패킷은 라우터를 하나씩 건너 목적지까지 가고, 라우터 하나를 건너는 것을 1홉이라고 배웠습니다. traceroute는 그 라우터들을 차례로 보여 줍니다.</p>
<ul><li>번호가 붙은 한 줄이 1홉, 곧 라우터 하나입니다. 1번은 보통 내 기본 게이트웨이이고, 마지막 줄이 목적지입니다. 시간이 세 개인 것은 홉마다 세 번씩 재기 때문입니다.</li><li><code>* * *</code>는 그 홉에서 답이 오지 않았다는 뜻입니다. 뒤의 홉이 이어서 나오면 그 라우터가 답을 안 하도록 설정된 것뿐이라 문제가 아닙니다.</li><li>어느 홉부터 끝까지 <code>* * *</code>만 나오면 그 근처에서 막히거나 끊긴 것을 의심합니다. 다만 ping과 마찬가지로, 방화벽이 traceroute의 패킷이나 돌아오는 알림을 막아도 같은 모양이 됩니다. 이것만으로 단정하지 않습니다.</li></ul>
<p>traceroute는 IP 패킷의 <b>TTL</b>을 이용합니다. IP 패킷의 헤더에는 TTL이라는 숫자가 들어 있고, 라우터를 하나 지날 때마다 1씩 줄어듭니다. 0이 되면 그 라우터가 패킷을 버리고, 보낸 쪽에 ICMP로 "여기서 버렸다"고 알려 줍니다. traceroute는 TTL을 1, 2, 3으로 늘려 가며 보내서 홉마다 그 알림을 받고, 알림을 보낸 라우터의 주소를 한 줄씩 적습니다.</p>
<p class="small muted">DNS의 TTL(캐시에 보관하는 시간)과 이름은 같지만 다른 값입니다. IP 패킷의 TTL은 패킷이 네트워크 안에서 끝없이 도는 것을 막으려고 둔 값입니다.</p>
<h3>nslookup, dig: DNS 조회</h3>
<pre class="code">$ nslookup www.example.com
Server:         10.0.0.2
Address:        10.0.0.2#53

Non-authoritative answer:
Name:   www.example.com
Address: 203.0.113.10

$ dig www.example.com
...
;; ANSWER SECTION:
www.example.com.    300    IN    A    203.0.113.10
...
;; SERVER: 10.0.0.2#53(10.0.0.2)

$ dig +short www.example.com
203.0.113.10</pre>
<ul><li>nslookup의 위쪽 두 줄(<code>Server</code>, <code>Address</code>)은 답해 준 DNS 서버, 곧 리졸버의 주소입니다. <code>#53</code>은 53번 포트라는 뜻입니다.</li><li>아래쪽 <code>Name</code>과 <code>Address</code>가 조회한 이름과 그 IP 주소입니다. <code>Non-authoritative answer</code>는 권한 있는 네임서버가 직접 준 답이 아니라 리졸버가 찾아서(또는 캐시에서) 준 답이라는 뜻이고, 정상입니다.</li><li>dig의 <code>ANSWER SECTION</code>이 답입니다. 왼쪽부터 이름, TTL(초), <code>IN</code>(인터넷을 뜻하는 고정 값), 레코드 종류(A), IP 주소입니다. <code>SERVER</code> 줄은 답해 준 DNS 서버입니다.</li><li><code>dig +short</code>는 답만 짧게 보여 줍니다.</li><li>답이 나오지 않는 원인은 여러 가지입니다. 이름이 틀렸을 수도, 그 이름의 레코드가 없을 수도, <code>/etc/resolv.conf</code>의 DNS 서버에 닿지 못하는 것일 수도 있습니다.</li></ul>
<p class="small muted">위 출력의 203.0.113.10은 지어낸 예시 주소입니다. 실제로 www.example.com을 조회하면 다른 주소가 나옵니다.</p>
<h3>ss: 이 서버에서 열려 있는 포트</h3>
<pre class="code">$ sudo ss -tlnp
State   Local Address:Port   Peer Address:Port   Process
LISTEN  0.0.0.0:22           0.0.0.0:*           users:(("sshd",pid=812,fd=3))
LISTEN  0.0.0.0:80           0.0.0.0:*           users:(("nginx",pid=1034,fd=6))
LISTEN  127.0.0.1:3306       0.0.0.0:*           users:(("mysqld",pid=977,fd=22))</pre>
<p>ss는 이 서버의 프로그램들이 열어 둔 소켓의 목록을 보여 줍니다. 앞에서 배운 "서버 프로그램이 포트를 LISTEN한다"를 눈으로 확인하는 명령입니다.</p>
<ul><li>옵션은 <code>-t</code> TCP만, <code>-l</code> LISTEN 중인 것만, <code>-n</code> 이름 대신 숫자로, <code>-p</code> 프로그램 표시입니다. 다른 사용자의 프로그램 이름까지 보려면 sudo가 필요합니다.</li><li><code>0.0.0.0:80</code>: 이 서버의 <b>모든 IP 주소</b>에서 80번 포트로 접속을 받습니다. 다른 서버에서 접속할 수 있습니다.</li><li><code>127.0.0.1:3306</code>: <b>이 서버 안에서만</b> 접속할 수 있습니다. 다른 서버에서 접속하면 refused가 됩니다.</li><li>원하는 포트가 목록에 없으면, 프로그램이 떠 있지 않거나 다른 포트에서 기다리고 있는 것입니다. 서비스 상태는 <a data-lesson="d05"></a>의 <code>systemctl status</code>로 확인합니다.</li></ul>
<p class="small muted">위 출력은 일부 열을 줄인 것입니다. 실제로는 Recv-Q, Send-Q 같은 열이 더 있습니다.</p>
<h3>nc, curl: 상대의 포트에 연결되는지</h3>
<pre class="code">$ nc -zv 10.0.1.10 80
Connection to 10.0.1.10 80 port [tcp/http] succeeded!

$ curl -I http://10.0.1.10
HTTP/1.1 200 OK
Server: nginx
Content-Type: text/html
...</pre>
<ul><li><code>nc -zv</code>는 데이터를 보내지 않고 TCP 연결만 해 봅니다(<code>-z</code> 연결만, <code>-v</code> 결과를 자세히). 3-way handshake가 끝나면 성공입니다. 성공하면 succeeded나 Connected가 나오고, 문구는 배포판에 따라 다릅니다.</li><li><code>curl -I</code>는 HTTP 요청을 보내고 응답의 헤더만 보여 줍니다. 헤더는 응답 본문 앞에 붙는 정보로, 상태 코드와 서버 종류 등이 들어 있습니다. 첫 줄의 <code>200</code>이 상태 코드입니다(<a data-lesson="d01"></a>). 상태 코드가 나왔다면 DNS 조회, TCP 연결, 포트까지 모두 통과한 것입니다.</li><li>오래 기다리지 않으려면 <code>curl -I --connect-timeout 5 URL</code>처럼 기다릴 시간(초)을 정합니다.</li></ul>

<h2 id="s7">접속 실패의 세 가지 모양</h2>
<p>접속이 안 될 때 나오는 메시지는 크게 세 가지입니다. 메시지는 <b>무슨 일이 관찰됐는지</b>를 알려 줍니다. 원인을 하나로 정해 주지는 않습니다. 같은 메시지라도 원인은 여러 가지일 수 있으니, 흔한 것부터 차례로 확인합니다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th style="width:19%">메시지</th><th style="width:21%">관찰된 사실</th><th style="width:36%">원인이 될 수 있는 것</th><th style="width:24%">다음에 볼 것</th></tr></thead><tbody>
<tr><td class="nw"><b>Could not resolve host</b><br><span class="small muted">Name or service not known</span></td><td>이름을 IP 주소로 바꾸지 못함. 서버에는 아직 아무것도 보내지 않았음</td><td>· 이름 철자가 틀림<br>· 그 이름의 레코드가 없음<br>· DNS 서버 주소 설정이 틀림<br>· DNS 서버까지 통신이 안 됨<br>· 내부 전용 이름을 바깥 DNS에 물음</td><td><code>dig</code>, <code>/etc/resolv.conf</code>, DNS 서버까지의 통신</td></tr>
<tr><td class="nw"><b>Connection refused</b></td><td>SYN을 보냈더니 거절하는 답(RST)이 바로 옴</td><td>· 그 포트에서 LISTEN 중인 프로그램이 없음 (가장 흔함)<br>· 프로그램이 다른 포트나 127.0.0.1에서만 LISTEN<br>· 접속한 IP 주소나 포트 번호가 틀림<br>· 중간의 방화벽이 거절하는 답을 보내도록 설정됨</td><td>서버에서 <code>ss -tlnp</code>, 서비스 상태(<a data-lesson="d05"></a>), 접속한 주소와 포트</td></tr>
<tr><td class="nw"><b>Connection timed out</b></td><td>SYN을 보냈는데 정해진 시간 동안 아무 답도 없음</td><td>· 방화벽이나 Security Group이 말없이 버림 (흔함)<br>· 가는 경로나 돌아오는 경로가 없음<br>· 서버가 꺼져 있거나 IP 주소가 틀림<br>· 서버가 너무 바빠서 답하지 못함</td><td><code>ping</code>, <code>traceroute</code>, 방화벽 규칙(<a data-lesson="d10"></a>), 서버 상태</td></tr>
</tbody></table></div>
<p class="small muted">RST: Reset(연결을 거절하거나 끊는 신호). 거절하는 답은 서버가 보낼 수도 있고 중간의 방화벽이 보낼 수도 있습니다. 메시지의 자세한 표현은 프로그램과 버전에 따라 다릅니다. 예를 들어 DNS 조회 실패는 curl에서는 Could not resolve host, ping과 ssh에서는 Name or service not known, nslookup에서는 server can't find … NXDOMAIN으로 나옵니다.</p>
<div class="box mem"><span class="lbl">외울 것: 메시지가 알려 주는 것</span><ul><li><b>resolve 실패</b>: 이름을 IP 주소로 바꾸는 단계에서 멈췄다. 네트워크 연결은 아직 시도하지 않았다.</li><li><b>refused</b>: 거절하는 답이 <b>바로</b> 왔다. 가장 흔한 원인은 그 포트에 받는 프로그램이 없는 것이다.</li><li><b>timed out</b>: <b>한참 기다렸는데</b> 아무 답이 없다. 가장 흔한 원인은 방화벽이나 Security Group이 버린 것이다.</li><li>어느 메시지든 원인이 하나로 정해지지는 않는다. 다음 절의 순서로 좁힌다.</li></ul></div>
<p class="small muted"><a data-lesson="d04"></a>의 "SSH 접속이 안 될 때 흔한 원인"에 나온 Connection timed out과 Connection refused가 바로 이것입니다.</p>

<h2 id="s8">문제를 좁혀 가는 순서: DNS 조회 → 포트 확인 → 경로 확인</h2>
<p>"www.example.com에 접속이 안 된다"는 말만으로는 원인을 알 수 없습니다. 통신이 일어나는 순서대로 하나씩 확인해서 범위를 좁힙니다.</p>
<div class="flow"><div class="n k"><b>1. DNS 조회</b><small>이름이 IP 주소로 바뀌나</small></div><span class="ar">→</span><div class="n k"><b>2. 포트 확인</b><small>그 IP 주소의 포트에 연결되나</small></div><span class="ar">→</span><div class="n k"><b>3. 경로 확인</b><small>패킷이 어디까지 가나</small></div></div>
<h3>1단계: DNS 조회</h3>
<pre class="code">$ dig +short www.example.com</pre>
<ul><li><b>IP 주소가 나옴</b>: DNS는 정상입니다. 나온 주소가 내가 아는 서버의 주소가 맞는지 보고 2단계로 갑니다.</li><li><b>안 나옴</b>: 이름 철자, 그 이름의 레코드가 있는지, <code>/etc/resolv.conf</code>의 DNS 서버 주소, 그 DNS 서버까지의 통신을 차례로 확인합니다. 이름 대신 IP 주소로 접속했을 때 된다면 DNS 쪽의 문제입니다.</li></ul>
<h3>2단계: 포트 확인</h3>
<pre class="code">$ nc -zv 203.0.113.10 80
$ curl -I --connect-timeout 5 http://203.0.113.10</pre>
<ul><li><b>연결됨</b>: 네트워크는 정상입니다. 그래도 안 된다면 응용 프로그램 쪽을 봅니다. curl의 상태 코드가 단서입니다.</li><li><b>refused</b>: 거절하는 답이 왔으니 대부분 서버까지는 도착한 것입니다. 서버에 들어가서 <code>ss -tlnp</code>로 그 포트가 LISTEN 중인지, <code>127.0.0.1</code>에만 열려 있지는 않은지, 서비스가 떠 있는지 확인합니다. 서버 쪽이 정상이라면 접속한 IP 주소와 포트 번호가 맞는지, 중간의 방화벽이 거절하도록 설정되어 있지 않은지 봅니다.</li><li><b>timed out</b>: 답이 없습니다. 방화벽이 버린 것인지, 경로가 없는 것인지, 서버가 꺼진 것인지 아직 알 수 없습니다. 3단계로 갑니다.</li></ul>
<h3>3단계: 경로 확인</h3>
<pre class="code">$ ip addr; ip route          <span class="c"># 내 IP 주소와 기본 게이트웨이가 있는가</span>
$ ping -c 4 10.0.1.1         <span class="c"># 기본 게이트웨이까지 가는가</span>
$ ping -c 4 203.0.113.10     <span class="c"># 목적지까지 가는가</span>
$ traceroute 203.0.113.10    <span class="c"># 어느 홉까지 가는가</span></pre>
<ul><li>가까운 곳부터 확인합니다. 내 설정 → 기본 게이트웨이 → 목적지 순서입니다.</li><li><b>ping은 되는데 포트만 timed out</b>: 경로는 정상입니다. 중간의 방화벽이나 Security Group이 그 포트를 막고 있을 가능성이 큽니다(<a data-lesson="d10"></a>).</li><li><b>ping도 안 됨</b>: 이것만으로는 경로 문제인지 알 수 없습니다. ICMP만 막혀 있을 수 있기 때문입니다. 기본 게이트웨이까지는 ping이 되는지, traceroute가 어느 홉까지 가는지, 같은 서브넷의 다른 서버에서는 되는지를 함께 봅니다. 게이트웨이부터 안 되면 내 설정이나 서브넷을, 중간에서 끊기면 라우팅이나 방화벽을, 끝까지 가는데 답만 없으면 서버 쪽의 방화벽·Security Group이나 서버가 꺼졌는지를 의심합니다.</li><li><b>포트 연결은 되는데 ping만 안 됨</b>: 문제가 아닙니다. ICMP를 막아 둔 것입니다.</li></ul>
<div class="box warn"><span class="lbl">ping과 traceroute는 보조 수단입니다</span><p>이 순서에서 판단의 기준은 2단계의 <b>포트 확인</b>입니다. 실제 서비스가 쓰는 것이 그 포트이기 때문입니다. ping과 traceroute는 "어디까지 가는지"를 짐작하는 데 쓰는 보조 수단입니다. ICMP를 막아 둔 환경(많은 서버와 방화벽, 클라우드의 기본 보안 정책)에서는 통신이 정상인데도 실패합니다. ping 실패 하나로 네트워크 연결이 끊겼다고 결론 내리지 않습니다.</p></div>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>DNS 조회</th><th>포트 연결</th><th>ping</th><th>먼저 의심할 것</th></tr></thead><tbody>
<tr><td class="nw">실패</td><td class="nw">-</td><td class="nw">-</td><td>이름 철자, DNS 서버 설정, DNS 서버까지의 통신</td></tr>
<tr><td class="nw">성공</td><td class="nw">refused</td><td class="nw">됨</td><td>서버의 프로그램이 떠 있지 않음, 포트 번호가 다름, 127.0.0.1에만 열림</td></tr>
<tr><td class="nw">성공</td><td class="nw">timed out</td><td class="nw">됨</td><td>방화벽이나 Security Group이 그 포트를 막음</td></tr>
<tr><td class="nw">성공</td><td class="nw">timed out</td><td class="nw">안 됨</td><td>아직 판단할 수 없음. 경로(게이트웨이, 라우팅) 문제, 서버가 꺼짐, 방화벽이 포트와 ICMP를 함께 막음 가운데 하나. traceroute와 다른 서버에서의 시험으로 좁힘</td></tr>
<tr><td class="nw">성공</td><td class="nw">연결됨</td><td class="nw">안 됨</td><td>네트워크는 정상. ICMP만 막아 둔 것이라 문제가 아님</td></tr>
<tr><td class="nw">성공</td><td class="nw">연결됨</td><td class="nw">됨</td><td>네트워크는 정상. 응용 프로그램과 상태 코드를 확인</td></tr>
</tbody></table></div>
<p class="small muted">표는 가장 흔한 경우를 적은 것입니다. 원인이 하나로 정해지는 것은 아니므로, 의심한 곳을 확인해서 아니면 다음 후보로 넘어갑니다.</p>
<p>확인은 두 곳에서 합니다. 접속하는 쪽에서는 <code>dig</code>, <code>nc</code>, <code>curl</code>, <code>ping</code>, <code>traceroute</code>를 쓰고, 서버 쪽에서는 <code>ss -tlnp</code>와 서비스 상태를 봅니다. 한 가지 결과만으로 단정하지 말고, 단계마다 "여기까지는 정상"을 확인하며 좁혀 갑니다.</p>
<p class="small muted">이 순서는 <a data-lesson="zc4"></a>의 실습(서비스 동작과 네트워크 연결 확인)에서 그대로 씁니다.</p>

<h2 id="s9">직접 해 보기</h2>
<p>손노트에 풀어 보세요. 먼저 풀고 나서, 문제 아래의 「답 보기」를 눌러 확인합니다.</p>
<h3>1. ss 출력 읽기</h3>
<pre class="code">LISTEN  0.0.0.0:22         users:(("sshd",pid=801,fd=3))
LISTEN  0.0.0.0:8080       users:(("java",pid=1522,fd=45))
LISTEN  127.0.0.1:5432     users:(("postgres",pid=990,fd=5))</pre>
<p><code>ss -tlnp</code> 출력에서 상태, 주소:포트, 프로그램 열만 옮긴 예시입니다. 다른 서버에서 이 서버로 접속할 수 있는 포트는 무엇이고, 접속할 수 없는 포트는 무엇인가요? 이유도 적어 보세요.</p>
<details class="fold"><summary>답 보기</summary><p class="small muted">22번(sshd)과 8080번(java)은 0.0.0.0, 곧 모든 IP 주소에서 받으므로 다른 서버에서 접속할 수 있습니다(중간의 방화벽이 허용한다면). 5432번(postgres)은 127.0.0.1에만 열려 있어서 이 서버 안에서만 접속할 수 있고, 다른 서버에서 접속하면 refused가 됩니다.</p></details>
<h3>2. 증상으로 원인 좁히기</h3>
<p>아래 네 경우에 각각 무엇을 먼저 의심하고, 다음에 어떤 명령으로 확인할지 적어 보세요. 원인이 하나로 정해지지 않는 경우에는 후보를 모두 적습니다.</p>
<ol><li><code>curl: (6) Could not resolve host: web01.example.com</code></li><li><code>nc -zv 10.0.2.20 3306</code>의 결과가 Connection refused</li><li><code>ping 10.0.2.20</code>은 되는데 <code>curl http://10.0.2.20</code>은 Connection timed out</li><li><code>ping 10.0.2.20</code>은 100% packet loss인데 <code>nc -zv 10.0.2.20 22</code>는 성공</li></ol>
<details class="fold"><summary>답 보기</summary><p class="small muted">① DNS 조회 실패입니다. 이름 철자, 그 이름의 레코드가 있는지(<code>dig web01.example.com</code>), <code>/etc/resolv.conf</code>의 DNS 서버 주소, DNS 서버까지의 통신을 차례로 봅니다. ② 거절하는 답이 바로 왔으니 대부분 서버까지는 도착한 것입니다. 가장 흔한 원인은 3306번에서 LISTEN 중인 프로그램이 없는 것입니다. 10.0.2.20 서버에서 <code>ss -tlnp</code>로 3306번이 열려 있는지, 127.0.0.1에만 열려 있지 않은지, DB 서비스가 떠 있는지 봅니다. 서버가 정상이라면 접속한 주소와 포트, 중간의 방화벽 설정을 확인합니다. ③ ping이 되므로 경로는 정상이고 80번 포트만 답이 없습니다. 방화벽이나 Security Group이 80번을 막고 있는지를 먼저 확인합니다. ④ 문제가 아닙니다. 22번 포트에 연결되므로 네트워크는 정상이고, 서버나 방화벽이 ICMP만 막아 둔 것입니다.</p></details>
<h3>3. NAT 따라가기</h3>
<p>PC(10.0.2.15)가 임시 포트 51000으로 서버 198.51.100.20의 443번 포트에 접속합니다. 중간의 NAT 장비는 공인 IP 203.0.113.50을 쓰고, 포트까지 바꾸는 PAT 방식으로 이 통신에 포트 62000을 붙였습니다. ① 서버가 받은 패킷의 출발지와 목적지, ② 서버가 보낸 응답의 출발지와 목적지, ③ NAT 장비가 PC로 넘겨줄 때의 출발지와 목적지를 적어 보세요.</p>
<details class="fold"><summary>답 보기</summary><p class="small muted">① 출발지 203.0.113.50:62000, 목적지 198.51.100.20:443. ② 출발지 198.51.100.20:443, 목적지 203.0.113.50:62000. ③ 출발지 198.51.100.20:443, 목적지 10.0.2.15:51000. NAT 장비가 NAT 테이블(10.0.2.15:51000 ↔ 203.0.113.50:62000)을 보고 목적지를 되돌립니다. IP 주소만 바꾸는 1:1 NAT였다면 ①의 출발지는 203.0.113.50:51000으로, 포트 번호는 그대로였을 것입니다.</p></details>
<h3>4. 내 PC에서 해 보기</h3>
<p>Windows의 PowerShell이나 명령 프롬프트에서 아래 명령을 실행하고, 이 레슨에서 배운 "볼 곳"을 찾아보세요. 결과는 환경마다 다릅니다.</p>
<pre class="code">nslookup example.com      <span class="c"># 답해 준 DNS 서버와, 이름의 IP 주소</span>
ping example.com          <span class="c"># 왕복 시간과 손실률</span>
tracert example.com       <span class="c"># 첫 홉이 ipconfig의 기본 게이트웨이와 같은가</span></pre>
`,
summary:['DNS는 도메인 이름을 IP 주소로 바꾼다. 내 PC → 리졸버 → 루트 → 최상위 도메인 → 권한 있는 네임서버 순서로 묻고, 답은 TTL 동안 캐시한다. A 레코드는 이름 → IPv4 주소, CNAME은 이름 → 다른 이름.','TCP는 3-way handshake(SYN → SYN+ACK → ACK)로 연결을 맺고 빠짐없이 순서대로 전달한다. UDP는 연결 없이 보내고 보장하지 않지만 가볍다.','포트 번호는 서버 안의 어느 프로그램인지를 구분한다(0~65535). 서버는 포트를 LISTEN하고, 클라이언트는 임시 포트를 쓴다. 통신 하나는 출발지 IP·포트, 목적지 IP·포트 네 값으로 구분된다.','NAT는 패킷의 IP 주소를 바꾼다. IP 주소만 1:1로 바꾸는 NAT와, 포트 번호까지 바꿔서 여러 장비가 공인 IP 하나를 함께 쓰는 PAT(NAPT)가 있다. 나가는 통신의 출발지를 바꾸면 SNAT, 들어오는 통신의 목적지를 바꾸면 DNAT. 바꾼 내용은 NAT 테이블에 기억해서 응답을 되돌린다.','명령: ip addr·ip route(내 설정), ping(갔다 오는지), traceroute(어디까지 가는지), nslookup·dig(DNS 조회), ss -tlnp(이 서버의 열린 포트), nc -zv·curl -I(상대 포트에 연결되는지).','resolve 실패 = 이름을 IP로 못 바꿈. refused = 거절하는 답이 바로 옴(가장 흔한 원인: 그 포트에 받는 프로그램이 없음). timed out = 아무 답이 없음(방화벽·Security Group, 경로, 서버 꺼짐 등). 메시지 하나가 원인 하나를 뜻하지는 않는다.','접속이 안 되면 DNS 조회 → 포트 확인 → 경로 확인 순서로 좁힌다. ping은 ICMP가 막혀 있으면 통신이 정상이어도 실패하므로, ping 실패만으로 단정하지 않는다. ping은 되는데 포트만 timed out이면 방화벽·Security Group을 먼저 의심한다([[d10]]).'],
essay:[
{q:'www.example.com의 IP 주소를 알아내기까지의 DNS 조회 과정을 순서대로 설명해 보세요.',a:'내 PC는 먼저 자기 캐시와 /etc/hosts에 답이 있는지 보고, 없으면 /etc/resolv.conf에 적힌 DNS 서버(리졸버)에 묻는다. 리졸버는 캐시에 답이 없으면 루트 네임서버에 물어 com 네임서버의 위치를 받고, com 네임서버에 물어 example.com을 관리하는 네임서버의 위치를 받는다. 마지막으로 example.com의 권한 있는 네임서버에 물어 www.example.com의 IP 주소(A 레코드)를 받는다. 리졸버는 이 답을 내 PC에 알려 주고 TTL 시간 동안 캐시에 보관한다.'},
{q:'TCP와 UDP의 차이를 설명하고, TCP가 연결을 맺는 과정을 말해 보세요.',a:'TCP는 연결을 먼저 맺고, 받았다는 확인과 재전송, 순서 번호로 데이터가 빠짐없이 순서대로 도착하게 관리한다. UDP는 연결 없이 바로 보내고 도착과 순서를 보장하지 않는 대신 가볍고 빠르다. 웹, SSH, DB 접속은 TCP를 쓰고, DNS 조회나 음성·영상 통화는 UDP를 쓴다. TCP의 연결은 3-way handshake로 맺는다. 클라이언트가 SYN(연결 요청)을 보내고, 서버가 SYN+ACK(요청 수락)로 답하고, 클라이언트가 ACK(확인)를 보내면 연결이 완료된다.'},
{q:'포트 번호가 왜 필요한지 설명하고, 브라우저가 웹 서버의 443번 포트에 접속할 때 양쪽이 쓰는 포트를 말해 보세요.',a:'IP 주소는 서버까지만 알려 준다. 서버 한 대에서 여러 프로그램이 돌아가므로, 어느 프로그램에 전달할지 구분하는 번호가 포트 번호다. 서버의 웹 서버 프로그램은 443번 포트를 열고 접속을 기다린다(LISTEN). 브라우저가 접속할 때는 운영체제가 비어 있는 임시 포트를 골라 출발지 포트로 쓴다. 요청은 출발지 PC의 IP:임시 포트에서 목적지 서버의 IP:443으로 가고, 응답은 그 반대로 온다. 통신 하나는 출발지 IP, 출발지 포트, 목적지 IP, 목적지 포트 네 값으로 구분되므로 같은 443번에 여러 사용자가 접속해도 섞이지 않는다.'},
{q:'사설 IP를 쓰는 PC가 인터넷의 서버와 통신할 때 NAT가 하는 일을, 가는 패킷과 돌아오는 패킷으로 나눠 설명해 보세요.',a:'사설 IP는 인터넷에서 라우팅되지 않아서, 출발지가 사설 IP인 채로 나가면 응답이 돌아올 수 없다. 가는 패킷이 NAT 장비를 지날 때 NAT 장비는 출발지 IP 주소를 자기 공인 IP로 바꾸고, 그 내용을 NAT 테이블에 기록한다. 목적지는 바꾸지 않는다. 서버는 공인 IP에서 온 요청으로 알고 그 주소로 응답한다. 돌아오는 패킷이 NAT 장비에 도착하면 NAT 테이블을 보고 목적지를 원래의 사설 IP로 되돌려 PC에 전달한다. 여러 장비가 공인 IP 하나를 함께 쓰는 PAT(NAPT) 방식에서는 IP 주소와 함께 포트 번호도 새 값으로 바꿔서, 포트 번호로 어느 PC의 통신인지 구분한다. IP 주소만 1:1로 바꾸는 NAT에서는 포트 번호가 그대로다.'},
{q:'"Could not resolve host", "Connection refused", "Connection timed out"이 각각 무슨 뜻이고, 다음에 무엇을 확인할지 말해 보세요.',a:'Could not resolve host는 DNS 조회에 실패해 이름을 IP 주소로 바꾸지 못했다는 뜻이다. 이름 철자가 틀렸거나, 그 이름의 레코드가 없거나, DNS 서버 설정이 틀렸거나, DNS 서버까지 통신이 안 되는 경우가 있다. dig 결과와 /etc/resolv.conf를 확인한다. Connection refused는 거절하는 답이 바로 왔다는 뜻이다. 가장 흔한 원인은 그 포트에서 접속을 기다리는 프로그램이 없는 것이고, 프로그램이 127.0.0.1에만 열려 있거나 방화벽이 거절하도록 설정된 경우에도 나온다. 서버에서 ss -tlnp로 포트가 LISTEN 중인지, 서비스가 떠 있는지 확인한다. Connection timed out은 보낸 요청에 아무 답이 없다는 뜻이다. 방화벽이나 Security Group이 버렸거나, 경로가 없거나, 서버가 꺼져 있을 수 있다. ping과 traceroute로 경로를 확인하고 방화벽 규칙을 본다. 어느 메시지든 원인이 하나로 정해지지는 않으므로 흔한 것부터 차례로 확인한다.'},
{q:'이름으로 접속하던 웹 서버에 접속이 안 될 때, DNS 조회 → 포트 확인 → 경로 확인 순서로 원인을 좁히는 방법을 명령과 함께 설명해 보세요.',a:'1단계로 dig +short 이름(또는 nslookup)으로 IP 주소가 나오는지 본다. 안 나오면 이름 철자와 /etc/resolv.conf의 DNS 서버를 확인한다. 2단계로 nc -zv IP 포트나 curl -I로 그 포트에 연결되는지 본다. 연결되면 네트워크는 정상이므로 응용 프로그램과 상태 코드를 본다. refused면 서버에서 ss -tlnp와 서비스 상태를 확인한다. timed out이면 3단계로 간다. 3단계에서는 ip addr, ip route로 내 설정을 보고, 기본 게이트웨이와 목적지에 ping을 보내고, traceroute로 어느 홉까지 가는지 본다. ping은 되는데 포트만 timed out이면 방화벽이나 Security Group이 그 포트를 막고 있을 가능성이 크다. ping은 ICMP가 막혀 있으면 통신이 정상이어도 실패하므로, ping 실패만으로 네트워크가 끊겼다고 단정하지 않고 포트 확인 결과와 함께 판단한다.'}
],
quiz:[
{v:[
 {q:'DNS가 하는 일은?',o:['도메인 이름을 IP 주소로 바꿔 준다','IP 주소로 MAC 주소를 알아낸다','사설 IP를 공인 IP로 바꾼다','포트 번호로 프로그램을 구분한다'],e:'DNS는 www.example.com 같은 이름을 IP 주소로 바꿔 줍니다. IP 주소로 MAC 주소를 알아내는 것은 ARP([[d08]]), 사설 IP를 공인 IP로 바꾸는 것은 NAT입니다.'},
 {q:'IP 주소 대신 도메인 이름을 쓰면 좋은 점은?',o:['서버의 IP 주소가 바뀌어도 이름은 그대로 쓸 수 있다','통신이 자동으로 암호화된다','IP 주소 없이도 통신할 수 있게 된다','포트 번호가 필요 없어진다'],e:'이름이 가리키는 IP 주소만 바꾸면 사용자는 같은 이름으로 계속 접속합니다. 실제 통신은 여전히 IP 주소로 하므로, 통신 전에 DNS 조회가 먼저 일어납니다.'}
]},
{v:[
 {q:'내 PC의 질문을 받아 루트, 최상위 도메인, 권한 있는 네임서버에 차례로 물어서 답을 찾아 주는 것은?',o:['리졸버(재귀 DNS 서버)','기본 게이트웨이','NAT 장비','스위치'],e:'리졸버는 내 PC를 대신해 여러 네임서버에 차례로 묻고, 답을 캐시에 보관합니다. 리졸버의 주소는 /etc/resolv.conf에 적혀 있습니다.'},
 {q:'"권한 있는 네임서버"란?',o:['그 도메인의 레코드 원본을 가지고 최종 답을 주는 서버','전 세계 모든 도메인의 IP 주소를 저장해 둔 서버','내 PC 안에서 캐시를 관리하는 프로그램','IP 주소를 자동으로 나눠 주는 서버'],e:'권한 있는 네임서버는 자기가 관리하는 도메인의 정보 원본을 가지고 있습니다. 루트와 최상위 도메인 네임서버는 다음에 물어볼 곳만 알려 줍니다.'}
]},
{v:[
 {q:'www.example.com을 조회할 때 리졸버가 묻는 순서는?',o:['루트 네임서버 → com 네임서버 → example.com의 네임서버','example.com의 네임서버 → com 네임서버 → 루트 네임서버','www 네임서버 → example 네임서버 → com 네임서버','루트 네임서버에서 바로 최종 답을 받는다'],e:'도메인 이름은 오른쪽이 위쪽인 계층 구조입니다. 루트에서 시작해 com, example.com 순서로 내려가며 묻습니다.'},
 {q:'도메인 이름 www.example.com에서 최상위 도메인(TLD)은?',o:['com','www','example','www.example'],e:'도메인 이름은 오른쪽부터 읽습니다. 맨 끝의 루트(생략) 다음에 오는 com이 최상위 도메인이고, example이 도메인, www가 호스트 이름입니다.'}
]},
{v:[
 {q:'이름을 IPv4 주소로 연결하는 DNS 레코드는?',o:['A 레코드','CNAME 레코드','MX 레코드','NS 레코드'],e:'A 레코드는 이름을 IPv4 주소로 연결합니다. CNAME은 이름을 다른 이름으로, MX는 메일 서버, NS는 그 도메인의 네임서버를 가리킵니다.'},
 {q:'CNAME 레코드가 하는 일은?',o:['이름을 다른 이름으로 연결한다(별명)','이름을 IPv4 주소로 연결한다','메일을 받을 서버를 알려 준다','도메인을 관리하는 네임서버를 알려 준다'],e:'CNAME은 별명입니다. shop.example.com → www.example.com처럼 다른 이름을 가리키고, 그 이름의 A 레코드로 IP 주소를 찾습니다.'}
]},
{v:[
 {q:'이름이 가리키는 IP 주소를 바꿨는데, 한동안 예전 주소로 접속되는 사용자가 있다. 가장 흔한 이유는?',o:['리졸버나 PC가 예전 답을 TTL 시간 동안 캐시에 가지고 있어서','DNS는 하루에 한 번만 갱신되어서','새 IP 주소가 사설 IP라서','포트 번호를 함께 바꾸지 않아서'],e:'DNS의 답은 TTL에 적힌 시간 동안 캐시됩니다. 그 시간이 지나야 리졸버가 다시 물어서 새 주소를 받습니다.'},
 {q:'DNS의 답에 붙어 있는 TTL 값의 뜻은?',o:['이 답을 캐시에 보관해도 되는 시간(초)','조회에 걸린 시간','거쳐 온 라우터의 수','레코드를 만든 날짜'],e:'DNS의 TTL은 캐시 보관 시간입니다. IP 패킷의 TTL(라우터를 지날 때마다 1씩 줄어드는 값)과 이름은 같지만 다른 값입니다.'}
]},
{v:[
 {q:'Linux 서버가 이름을 IP 주소로 바꿀 때, 기본 설정에서 DNS 서버에 묻기 전에 먼저 보는 파일은?',o:['/etc/hosts','/etc/resolv.conf','/etc/passwd','/etc/fstab'],e:'/etc/hosts에 이름과 IP 주소를 직접 적어 둘 수 있고, 기본 설정에서는 이 파일을 먼저 봅니다. 없으면 /etc/resolv.conf에 적힌 DNS 서버에 묻습니다.'},
 {q:'/etc/resolv.conf에 적혀 있는 것은?',o:['질문을 보낼 DNS 서버(리졸버)의 주소','이름과 IP 주소를 직접 짝지은 목록','기본 게이트웨이의 주소','열려 있는 포트의 목록'],e:'/etc/resolv.conf의 nameserver 줄에 DNS 서버의 주소가 있습니다. 이름과 IP 주소를 직접 적는 파일은 /etc/hosts입니다.'}
]},
{v:[
 {q:'TCP와 UDP의 차이로 맞는 것은?',o:['TCP는 연결을 맺고 빠짐없이 순서대로 전달하며, UDP는 연결 없이 보내고 도착을 보장하지 않는다','UDP는 연결을 맺고 빠짐없이 전달하며, TCP는 연결 없이 보낸다','TCP는 포트 번호를 쓰고 UDP는 쓰지 않는다','TCP는 사설 IP에서만, UDP는 공인 IP에서만 쓴다'],e:'둘 다 전송 계층 프로토콜이고 포트 번호를 씁니다. TCP는 연결, 확인, 재전송으로 신뢰성을 관리하고, UDP는 그런 절차 없이 바로 보냅니다.'},
 {q:'데이터가 중간에 빠졌을 때 다시 보내서 빠짐없이 도착하게 하는 프로토콜은?',o:['TCP','UDP','ICMP','ARP'],e:'TCP는 받았다는 확인(ACK)이 오지 않으면 다시 보냅니다. UDP는 도착을 확인하지 않습니다.'},
 {q:'UDP가 TCP보다 가볍고 빠른 이유는?',o:['연결을 맺는 절차와 도착 확인·재전송을 하지 않아서','데이터를 암호화하지 않아서','IP 주소를 쓰지 않아서','라우터를 거치지 않아서'],e:'UDP는 3-way handshake도, 확인과 재전송도 하지 않습니다. 그래서 DNS 조회나 음성·영상 통화처럼 빠른 것이 중요한 통신에 씁니다.'}
]},
{v:[
 {q:'TCP가 연결을 맺는 3-way handshake의 순서는?',o:['SYN → SYN+ACK → ACK','ACK → SYN → SYN+ACK','SYN → ACK → FIN','SYN+ACK → SYN → ACK'],e:'클라이언트가 SYN(연결 요청)을 보내고, 서버가 SYN+ACK(요청 수락)로 답하고, 클라이언트가 ACK(확인)를 보내면 연결이 맺어집니다.'},
 {q:'TCP가 데이터를 보내기 전에 3-way handshake를 하는 이유는?',o:['양쪽이 주고받을 준비가 됐는지 확인하고 연결을 맺기 위해','상대의 MAC 주소를 알아내기 위해','이름을 IP 주소로 바꾸기 위해','사설 IP를 공인 IP로 바꾸기 위해'],e:'TCP는 연결을 먼저 맺는 프로토콜입니다. 접속 오류의 대부분이 이 단계에서 납니다. 답이 없으면 timed out, 거절하는 답이 오면 refused입니다.'}
]},
{v:[
 {q:'포트 번호의 역할은?',o:['한 서버에서 돌아가는 여러 프로그램 가운데 어느 것에 전달할지 구분한다','서버가 어느 서브넷에 있는지 나타낸다','같은 서브넷 안에서 장비를 구분한다','통신 속도를 정한다'],e:'IP 주소는 서버까지, 포트 번호는 그 서버 안의 프로그램까지를 가리킵니다.'},
 {q:'서버 한 대(IP 주소 하나)에서 웹 서버와 SSH 서버를 함께 운영할 수 있는 이유는?',o:['프로그램마다 다른 포트 번호에서 접속을 기다리기 때문에','프로그램마다 MAC 주소가 다르기 때문에','프로그램마다 서브넷 마스크가 다르기 때문에','한 번에 한 프로그램만 통신하기 때문에'],e:'웹 서버는 80번이나 443번, SSH 서버는 22번처럼 서로 다른 포트를 LISTEN합니다. 들어온 요청은 목적지 포트 번호에 따라 해당 프로그램에 전달됩니다.'}
]},
{v:[
 {q:'브라우저가 웹 서버의 443번 포트에 접속할 때, 내 PC 쪽의 출발지 포트는 어떻게 정해지나?',o:['운영체제가 비어 있는 임시 포트를 골라 준다','항상 443번을 쓴다','항상 80번을 쓴다','포트 없이 IP 주소만으로 보낸다'],e:'접속하는 쪽은 운영체제가 고른 임시 포트를 출발지 포트로 씁니다. 응답은 그 포트로 돌아옵니다.'},
 {q:'웹 서버의 443번 포트 하나에 수많은 사용자가 동시에 접속해도 통신이 섞이지 않는 이유는?',o:['통신마다 출발지 IP 주소와 출발지 포트가 달라서, 네 값의 조합으로 구분되기 때문에','사용자마다 서버가 다른 IP 주소를 쓰기 때문에','한 번에 한 사용자만 접속할 수 있기 때문에','서버가 사용자의 MAC 주소로 구분하기 때문에'],e:'통신 하나는 출발지 IP 주소, 출발지 포트, 목적지 IP 주소, 목적지 포트 네 값으로 구분됩니다.'}
]},
{v:[
 {q:'포트가 LISTEN 상태라는 것은?',o:['프로그램이 그 포트를 열고 접속 요청을 기다리고 있다는 뜻','그 포트가 방화벽에 막혀 있다는 뜻','그 포트로 지금 데이터를 내보내고 있다는 뜻','그 포트를 아무 프로그램도 쓰지 않는다는 뜻'],e:'서버 프로그램이 포트를 열고 기다리는 상태가 LISTEN입니다. ss -tlnp로 LISTEN 중인 포트와 프로그램을 볼 수 있습니다.'},
 {q:'ss -tlnp 결과에 "LISTEN 127.0.0.1:3306"이 보인다. 맞는 설명은?',o:['이 서버 안에서만 3306번 포트에 접속할 수 있고, 다른 서버에서는 접속할 수 없다','어느 서버에서든 3306번 포트에 접속할 수 있다','3306번 포트가 닫혀 있다','127.0.0.1이라는 다른 서버에 접속하고 있다'],e:'127.0.0.1은 자기 자신을 가리키는 루프백 주소입니다. 이 주소에만 열려 있으면 다른 서버에서 접속할 때 refused가 됩니다.'},
 {q:'ss -tlnp 결과에 "LISTEN 0.0.0.0:80"이 보인다. 여기서 0.0.0.0의 뜻은?',o:['이 서버의 모든 IP 주소에서 80번 포트로 접속을 받는다','어디에서도 접속을 받지 않는다','IP 주소가 설정되지 않았다','기본 경로로 내보낸다'],e:'Local Address가 0.0.0.0이면 이 서버가 가진 모든 IP 주소에서 접속을 받습니다. 다른 서버에서도 접속할 수 있습니다.'}
]},
{v:[
 {q:'NAT가 하는 일은?',o:['패킷의 IP 주소를 다른 주소로 바꿔 준다','이름을 IP 주소로 바꿔 준다','IP 주소로 MAC 주소를 알아낸다','목적지까지의 경로를 고른다'],e:'NAT는 패킷의 IP 주소를 바꾸는 기능입니다. 포트 번호까지 함께 바꾸는 방식은 PAT(NAPT)라고 합니다. 이름을 IP 주소로 바꾸는 것은 DNS, 경로를 고르는 것은 라우팅입니다.'},
 {q:'사설 IP를 쓰는 PC가 인터넷의 서버와 통신할 때 NAT가 필요한 이유는?',o:['사설 IP는 인터넷에서 라우팅되지 않아서, 응답이 돌아올 수 있는 공인 IP로 출발지를 바꿔야 하기 때문에','사설 IP는 포트 번호를 쓸 수 없기 때문에','인터넷의 서버가 MAC 주소를 요구하기 때문에','사설 IP로는 DNS 조회를 할 수 없기 때문에'],e:'출발지가 사설 IP인 채로 나가면 서버가 응답을 보낼 길이 없습니다. NAT 장비가 출발지를 공인 IP로 바꿔서 내보냅니다.'}
]},
{gen(){
  const R=n=>Math.floor(Math.random()*n);
  const pc='10.0.'+(1+R(9))+'.'+(10+R(200)), nat='198.51.100.'+(2+R(250)), dst='203.0.113.'+(2+R(250)), dp=[80,443][R(2)];
  const f=(s,d)=>'출발지 '+s+' / 목적지 '+d;
  return {q:'사설 IP '+pc+'을 쓰는 PC가 '+dst+':'+dp+'으로 패킷을 보낸다. 중간의 NAT 장비(공인 IP '+nat+')를 지난 뒤, 이 패킷의 출발지 IP 주소와 목적지 IP 주소는?',
    o:[f(nat,dst), f(pc,dst), f(pc,nat), f(nat,pc)],       // 오답: 안 바뀜, 목적지를 바꿈, 둘 다 뒤바꿈
    e:'NAT는 나가는 패킷의 출발지 주소를 공인 IP로 바꾸고 목적지는 그대로 둡니다. 그래서 출발지는 '+nat+', 목적지는 '+dst+'입니다. 서버는 '+nat+'에서 온 요청으로 알고 그 주소로 응답하고, NAT 장비가 NAT 테이블을 보고 원래의 PC('+pc+')에 전달합니다.'};
}},
{v:[
 {q:'NAT 장비가 변환 내용을 NAT 테이블에 기록해 두는 이유는?',o:['돌아오는 응답을 원래의 사설 IP 주소와 포트로 되돌려 전달하기 위해','패킷을 암호화하기 위해','DNS 조회를 빠르게 하기 위해','MAC 주소를 기억해 두기 위해'],e:'응답은 NAT 장비의 공인 IP와 포트로 돌아옵니다. NAT 테이블을 봐야 어느 PC의 어느 포트로 되돌릴지 알 수 있습니다.'},
 {q:'사설 IP를 쓰는 PC 여러 대가 공인 IP 하나로 동시에 인터넷을 쓸 수 있는 이유는?',o:['NAT 장비가 포트 번호까지 바꿔서(PAT), 통신마다 다른 포트 번호로 구분하기 때문에','PC들이 차례를 기다려 한 대씩만 통신하기 때문에','PC의 MAC 주소가 인터넷의 서버까지 전달되기 때문에','인터넷의 서버가 PC들의 사설 IP를 알고 있기 때문에'],e:'PAT(NAPT)는 IP 주소와 함께 포트 번호도 바꿉니다. 돌아온 응답의 포트 번호를 NAT 테이블에서 찾아 어느 PC의 통신인지 구분합니다.'},
 {q:'IP 주소만 바꾸는 NAT와 PAT(NAPT)의 차이는?',o:['PAT는 포트 번호까지 함께 바꿔서, 여러 장비가 공인 IP 하나를 함께 쓸 수 있다','PAT는 목적지 주소만 바꾸고, NAT는 출발지 주소만 바꾼다','PAT는 UDP에만 쓰고, NAT는 TCP에만 쓴다','PAT는 주소를 바꾸지 않고 통신을 막는 기능이다'],e:'IP 주소만 바꾸는 NAT는 사설 IP 하나와 공인 IP 하나를 1:1로 짝짓고 포트 번호는 그대로 둡니다. PAT는 포트 번호까지 바꿔서 여러 사설 IP가 공인 IP 하나를 함께 씁니다. 현장에서는 PAT도 흔히 NAT라고 부릅니다.'}
]},
{v:[
 {q:'밖에서 들어온 통신의 목적지 주소를 안쪽 서버의 사설 IP로 바꿔서 넘겨주는 것은?',o:['DNAT(포트 포워딩)','SNAT','ARP','DNS'],e:'DNAT는 목적지 주소를 바꿉니다. SNAT는 안에서 밖으로 나갈 때 출발지 주소를 바꿉니다.'},
 {q:'SNAT와 DNAT의 차이는?',o:['SNAT는 출발지 주소를, DNAT는 목적지 주소를 바꾼다','SNAT는 목적지 주소를, DNAT는 출발지 주소를 바꾼다','SNAT는 TCP에만, DNAT는 UDP에만 쓴다','둘은 같은 것을 가리키는 다른 이름이다'],e:'S는 Source(출발지), D는 Destination(목적지)입니다. 사설 IP가 인터넷으로 나갈 때는 SNAT, 밖에서 안쪽 서버로 들어올 때는 DNAT를 씁니다.'}
]},
{v:[
 {q:'ping이 확인하는 것은?',o:['대상 IP 주소까지 패킷이 갔다가 돌아오는지와 왕복 시간','대상 서버에서 열려 있는 포트의 목록','이름에 해당하는 IP 주소','거쳐 가는 라우터의 목록'],e:'ping은 ICMP로 요청을 보내고 답이 돌아오는지를 봅니다. 포트는 쓰지 않으므로, ping이 되더라도 원하는 포트가 열려 있다는 뜻은 아닙니다.'},
 {q:'서버에 ping이 실패했다. 알맞은 판단은?',o:['서버나 중간 장비가 ICMP를 막아 둔 것일 수도 있으니, 포트 연결 같은 다른 방법으로도 확인한다','서버가 꺼진 것이 확실하다','DNS 서버가 고장 난 것이 확실하다','서버의 디스크가 가득 찬 것이다'],e:'보안 때문에 ICMP를 막아 둔 서버와 방화벽이 많고, 클라우드에서는 Security Group에 ICMP 허용 규칙이 없으면 ping이 실패하는 것이 보통입니다. ping 실패만으로 단정하지 말고 nc나 curl로 포트 연결도 확인합니다.'}
]},
{v:[
 {q:'traceroute가 보여 주는 것은?',o:['목적지까지 거쳐 가는 라우터(홉)의 목록과 각 홉까지의 시간','이 서버에서 열려 있는 포트와 프로그램','이름에 해당하는 IP 주소','HTTP 응답의 상태 코드'],e:'traceroute는 한 줄에 1홉씩 경로의 라우터를 보여 줍니다. 어느 홉까지 답이 오는지를 보고 끊기는 위치를 짐작합니다.'},
 {q:'traceroute가 경로의 라우터를 하나씩 알아낼 수 있는 것은 무엇을 이용하기 때문인가?',o:['라우터를 지날 때마다 1씩 줄어드는 IP 패킷의 TTL','DNS 레코드의 TTL','포트 번호','MAC 주소 테이블'],e:'IP 패킷의 TTL이 0이 되면 그 라우터가 패킷을 버리고 보낸 쪽에 알려 줍니다. traceroute는 TTL을 1, 2, 3으로 늘려 가며 보내서 홉마다 그 알림을 받습니다.'}
]},
{v:[
 {q:'이 서버에서 어떤 포트가 LISTEN 중이고 어떤 프로그램이 쓰는지 확인하는 명령은?',o:['ss -tlnp','ip route','dig','ping'],e:'ss -tlnp는 LISTEN 중인 TCP 포트와 프로그램을 보여 줍니다. ip route는 라우팅 테이블, dig는 DNS 조회, ping은 도달 여부를 확인합니다.'},
 {q:'도메인 이름에 해당하는 IP 주소를 직접 조회해 보는 명령은?',o:['dig 또는 nslookup','ss','traceroute','ip addr'],e:'dig와 nslookup은 DNS 서버에 직접 물어봅니다. 답으로 나온 IP 주소와 답해 준 DNS 서버를 볼 수 있습니다.'},
 {q:'웹 서버에 HTTP 요청을 보내고 응답의 상태 코드를 확인하는 명령은?',o:['curl -I','ping','ip route','ss -tlnp'],e:'curl -I는 HTTP 요청을 보내고 응답의 헤더만 보여 줍니다. 첫 줄에 200 같은 상태 코드가 나옵니다.'}
]},
{v:[
 {q:'접속을 시도했더니 바로 "Connection refused"가 나왔다. 가장 흔한 원인은?',o:['요청이 서버까지 도착했지만, 그 포트에서 접속을 기다리는 프로그램이 없다','이름을 IP 주소로 바꾸지 못했다','중간에서 패킷이 버려져 아무 답도 받지 못했다','비밀번호가 틀렸다'],e:'refused는 거절하는 답이 바로 온 것입니다. 가장 흔한 원인은 그 포트에 LISTEN 중인 프로그램이 없는 것입니다. 프로그램이 127.0.0.1에만 열려 있거나 방화벽이 거절하도록 설정된 경우에도 나옵니다. 서버에서 ss -tlnp로 확인합니다.'},
 {q:'접속을 시도했더니 한참 기다린 뒤 "Connection timed out"이 나왔다. 알맞은 해석은?',o:['보낸 요청에 아무 답이 없다. 방화벽이 버렸거나, 경로가 없거나, 서버가 꺼져 있을 수 있다','서버가 "그 포트에는 프로그램이 없다"고 바로 답했다','이름을 IP 주소로 바꾸지 못했다','서버의 프로그램이 요청을 정상으로 처리했다'],e:'timed out은 답이 없다는 뜻입니다. ping과 traceroute로 경로를 확인하고, 방화벽이나 Security Group 규칙을 봅니다.'},
 {q:'"Connection refused"와 "Connection timed out"의 차이는?',o:['refused는 거절하는 답이 바로 온 것이고, timed out은 아무 답도 오지 않은 것이다','refused는 답이 없는 것이고, timed out은 거절하는 답이 온 것이다','둘 다 DNS 조회에 실패했다는 뜻이다','둘 다 비밀번호가 틀렸다는 뜻이다'],e:'refused는 거절하는 답을 받은 것이라 대부분 서버까지는 도착했다는 뜻입니다. timed out은 중간에서 버려졌거나 서버가 답하지 못하는 상황입니다. 어느 쪽이든 원인이 하나로 정해지지는 않으므로 단계별로 확인합니다.'}
]},
{v:[
 {q:'www.example.com에 접속이 안 된다. dig로 조회하니 IP 주소는 정상으로 나왔다. 다음에 확인할 것은?',o:['그 IP 주소의 포트에 연결되는지(nc, curl)','/etc/resolv.conf의 DNS 서버 주소','도메인 이름의 철자','DNS 레코드의 TTL'],e:'DNS 조회가 됐으면 DNS는 정상입니다. 다음은 포트 확인이고, 그 결과가 refused인지 timed out인지에 따라 서버 쪽이나 경로를 봅니다.'},
 {q:'서버에 ping은 잘 되는데, 80번 포트 접속만 "Connection timed out"이 난다. 먼저 의심할 것은?',o:['중간의 방화벽이나 Security Group이 80번 포트를 막고 있다','DNS 서버가 응답하지 않는다','기본 게이트웨이 설정이 빠졌다','서버의 IP 주소가 사설 IP다'],e:'ping이 되면 경로는 정상입니다. 특정 포트만 답이 없으면 그 포트로 가는 패킷을 버리는 규칙을 의심합니다([[d10]]).'}
]}
]
});
