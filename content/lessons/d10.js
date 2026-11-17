OJT.lesson({
id:'d10', week:3, day:'10', tag:'일차 10', mins:'약 3시간',
title:'Network 보안·서비스: 방화벽, Security Group, HTTPS·TLS, 로드밸런싱',
cover:[['Firewall','s1'],['Security Group','s3'],['HTTP/HTTPS','s4'],['TLS','s5'],['SSH','s6'],['Load Balancing','s7'],['접속 허용/차단 및 웹 요청 경로','s8']],
act:'접속 허용/차단 및 웹 요청 경로 설명',
goal:['방화벽 규칙의 구성 요소와 기본 거부 원칙, 상태 저장을 설명할 수 있다','Security Group 규칙을 읽고 어떤 접속이 허용되고 차단되는지 판단할 수 있다','HTTP와 HTTPS의 차이, TLS와 인증서가 하는 일을 설명할 수 있다','SSH 접속을 네트워크에서 안전하게 여는 방법과, L4·L7 로드밸런서의 차이를 설명할 수 있다','웹 요청 한 번이 DNS, 로드밸런서, Web 서버, WAS, DB를 지나는 경로를 구간별 포트와 허용 규칙으로 설명할 수 있다'],
terms:[
['방화벽','Firewall','규칙에 따라 통신을 허용하거나 막는 장비·기능.'],
['규칙','Rule','방향, 프로토콜, 포트, 상대 주소, 동작(허용·거부)으로 적은 조건 한 줄.'],
['인바운드 / 아웃바운드','Inbound / Outbound (Ingress / Egress)','밖에서 들어오는 통신 / 안에서 나가는 통신. 먼저 접속을 시작한 쪽을 기준으로 본다.'],
['기본 거부','Default Deny','허용한다고 적지 않은 통신은 모두 막는 원칙. 필요한 것만 골라서 허용한다.'],
['상태 저장','Stateful','방화벽이 허용한 연결을 기억해 두고, 그 연결의 응답은 규칙을 다시 따지지 않고 통과시키는 방식.'],
['DROP / REJECT','Drop / Reject','패킷을 말없이 버리는 것(접속하는 쪽은 timed out) / 거절하는 답을 보내는 것(접속하는 쪽은 refused).'],
['호스트 방화벽','Host Firewall','서버의 운영체제 안에서 동작하는 방화벽. Rocky Linux의 firewalld, Ubuntu의 ufw 등.'],
['Security Group','Security Group','클라우드에서 VM의 네트워크 인터페이스에 붙이는 방화벽 규칙 묶음. 허용 규칙만 적고, 상태 저장 방식이다.'],
['HTTP','HyperText Transfer Protocol','브라우저와 웹 서버가 요청과 응답을 주고받는 약속. 기본 포트 80. 내용이 암호화되지 않는다.'],
['메서드','HTTP Method','요청이 무엇을 하려는지 나타내는 말. GET(가져오기), POST(보내기) 등.'],
['상태 코드','Status Code','응답의 결과를 알려 주는 세 자리 숫자. 2xx 성공, 3xx 다른 주소로 이동, 4xx 요청 쪽 문제, 5xx 서버 쪽 문제.'],
['HTTPS','HTTP Secure','HTTP를 TLS로 암호화해서 주고받는 것. 기본 포트 443.'],
['TLS','Transport Layer Security','통신을 암호화하고, 내용이 바뀌지 않았는지와 상대가 진짜 그 서버인지를 확인해 주는 프로토콜. 예전 이름은 SSL.'],
['인증서','Certificate','"이 도메인 이름의 서버가 맞다"를 증명하는 문서. 도메인 이름, 서버의 공개키, 발급 기관의 서명, 유효 기간이 들어 있다.'],
['CA','Certificate Authority','인증서를 발급하고 서명하는 기관. 브라우저와 운영체제는 믿을 수 있는 CA의 목록을 가지고 있다.'],
['TLS 종료','TLS Termination','로드밸런서 같은 앞단 장비가 TLS 암호화를 풀고, 뒤쪽 서버와는 따로 통신하는 구성.'],
['Bastion 호스트','Bastion Host','Private 영역의 서버에 관리자가 접속할 때 거쳐 가는 관리용 서버. Public 영역에 한 대만 둔다.'],
['ALB / NLB','Application Load Balancer / Network Load Balancer','HTTP 내용을 보고 나눠 주는 L7 로드밸런서 / IP 주소와 포트만 보고 나눠 주는 L4 로드밸런서.'],
['Listener / Target Group','Listener / Target Group','로드밸런서가 요청을 기다리는 포트와 프로토콜 / 요청을 나눠 받을 서버 묶음.'],
['Health Check','Health Check','로드밸런서가 대상 서버가 살아 있는지 주기적으로 확인하는 기능. 실패한 서버로는 보내지 않는다([[d01]]).']
],
body:`
<h2 id="s1">방화벽: 규칙으로 통신을 허용하고 막는다</h2>
<p>사용자가 <code>https://shop.example.com</code>에 접속해서 화면이 뜨기까지, 요청은 DNS<span class="small muted">(Domain Name System)</span> 조회 → 로드밸런서 → Web 서버 → WAS<span class="small muted">(Web Application Server)</span> → DB<span class="small muted">(Database)</span> 순서로 지나갑니다(<a data-lesson="d01"></a>, <a data-lesson="d09"></a>). 이 길의 구간마다 두 가지가 맞아야 합니다.</p>
<ol><li><b>그 통신이 규칙으로 허용되어 있어야 합니다.</b> 방화벽과 Security Group이 맡습니다. 이 레슨의 앞부분입니다.</li><li><b>양쪽이 같은 약속으로 주고받아야 합니다.</b> 웹에서는 HTTP와 HTTPS(TLS)이고, 요청을 여러 서버에 나눠 주는 것은 로드밸런서입니다. 이 레슨의 뒷부분입니다.</li></ol>
<p>마지막에 이 둘을 합쳐서, 웹 요청 한 번의 경로를 구간별 포트와 허용 규칙으로 따라갑니다. 먼저 허용과 차단입니다.</p>
<p><b>방화벽</b>은 규칙에 따라 통신을 허용하거나 막는 장비·기능입니다. <a data-lesson="d01"></a>의 망 분리에서 구역 사이를 지키던 것이 방화벽입니다. 방화벽은 패킷이 올 때마다 규칙과 비교해서 통과시킬지 정합니다.</p>
<h3>규칙의 구성 요소</h3>
<div class="tbl-wrap"><table><thead><tr><th>항목</th><th>뜻</th><th>예</th></tr></thead><tbody>
<tr><td class="nw"><b>방향</b></td><td>들어오는 통신인지(인바운드), 나가는 통신인지(아웃바운드)</td><td class="nw">인바운드</td></tr>
<tr><td class="nw"><b>프로토콜</b></td><td>TCP, UDP, ICMP 가운데 무엇인지</td><td>TCP</td></tr>
<tr><td class="nw"><b>포트</b></td><td>어느 포트로 가는 통신인지(<a data-lesson="d09"></a>)</td><td>443</td></tr>
<tr><td class="nw"><b>상대 주소</b></td><td>인바운드는 어디서 오는지(출발지), 아웃바운드는 어디로 가는지(목적지). CIDR로 적음(<a data-lesson="d07"></a>)</td><td class="nw">0.0.0.0/0</td></tr>
<tr><td class="nw"><b>동작</b></td><td>허용할지, 거부할지</td><td>허용</td></tr>
</tbody></table></div>
<p class="small muted">TCP: Transmission Control Protocol · UDP: User Datagram Protocol · ICMP: Internet Control Message Protocol · CIDR: Classless Inter-Domain Routing. 방향은 Ingress(인바운드), Egress(아웃바운드)라고도 부릅니다.</p>
<p>규칙표의 예입니다. 웹 서버 앞의 방화벽이라고 생각하고 읽어 보세요.</p>
<div class="tbl-wrap"><table><thead><tr><th>순서</th><th>방향</th><th>프로토콜</th><th>포트</th><th>출발지</th><th>동작</th></tr></thead><tbody>
<tr><td>1</td><td>인바운드</td><td>TCP</td><td>443</td><td>0.0.0.0/0</td><td><b>허용</b></td></tr>
<tr><td>2</td><td>인바운드</td><td>TCP</td><td>22</td><td>203.0.113.0/24</td><td><b>허용</b></td></tr>
<tr><td>3</td><td>인바운드</td><td>모두</td><td>모두</td><td>0.0.0.0/0</td><td>거부</td></tr>
</tbody></table></div>
<ul><li>1번: 누구든(0.0.0.0/0) 443번 포트로 오는 접속은 허용합니다.</li><li>2번: 22번 포트는 203.0.113.0 ~ 203.0.113.255에서 오는 접속만 허용합니다.</li><li>3번: 나머지는 모두 거부합니다.</li></ul>
<div class="box mem"><span class="lbl">외울 것: 규칙을 쓰는 원칙</span><ul><li><b>기본 거부</b>: 허용한다고 적지 않은 통신은 모두 막습니다. 필요한 것만 골라서 엽니다.</li><li><b>최소한으로</b>: 포트는 필요한 번호만, 출발지는 필요한 범위만 엽니다. <a data-lesson="d04"></a>의 "필요한 사람에게 필요한 권한만"과 같은 원칙입니다.</li><li><b>순서</b>: 순서가 있는 방화벽은 위에서부터 비교해서 <b>처음 맞는 규칙 하나</b>를 적용합니다. 그래서 "모두 거부"는 맨 아래에 둡니다.</li></ul></div>
<h3>방화벽이 있는 곳</h3>
<div class="tbl-wrap"><table><thead><tr><th>종류</th><th>위치</th><th>예</th></tr></thead><tbody>
<tr><td class="nw"><b>네트워크 방화벽</b></td><td>구역과 구역 사이. 지나가는 통신 전체를 봄</td><td>방화벽 장비</td></tr>
<tr><td class="nw"><b>호스트 방화벽</b></td><td>서버의 운영체제 안. 그 서버로 드나드는 통신만 봄</td><td>Rocky Linux의 firewalld, Ubuntu의 ufw</td></tr>
<tr><td class="nw"><b>Security Group</b></td><td>클라우드에서 VM의 네트워크 인터페이스 앞</td><td>아래 절에서 설명</td></tr>
</tbody></table></div>
<p>방화벽이 여러 겹이면 <b>모든 겹이 허용해야</b> 통신이 됩니다. Security Group은 열었는데 서버 안의 호스트 방화벽이 막고 있는 경우가 흔합니다.</p>
<h3>거부하는 두 가지 방식</h3>
<ul><li><b>DROP</b>: 패킷을 말없이 버립니다. 접속하는 쪽은 답을 받지 못해서 한참 뒤에 <b>timed out</b>이 됩니다.</li><li><b>REJECT</b>: 거절한다는 답을 보냅니다. 접속하는 쪽은 바로 <b>refused</b>가 됩니다.</li></ul>
<p class="small muted"><a data-lesson="d09"></a>에서 본 두 메시지가 방화벽에서는 이렇게 생깁니다. 다만 timed out과 refused에는 방화벽 말고도 원인이 여러 가지 있습니다. 또 ping이 쓰는 ICMP도 규칙으로 허용해야 통과합니다. 규칙에 ICMP가 없으면 ping이 실패하는 것이 정상입니다.</p>

<h2 id="s2">상태 저장: 응답은 따로 허용하지 않아도 된다</h2>
<p>위의 규칙표에는 "443번으로 들어오는 접속 허용"만 있고, 서버가 사용자에게 돌려보내는 응답을 허용하는 규칙은 없습니다. 그래도 통신이 되는 것은 방화벽이 <b>상태 저장</b><span class="small muted">(Stateful)</span> 방식이기 때문입니다.</p>
<p>상태 저장 방화벽은 규칙에 맞아 통과시킨 연결을 기억해 둡니다. 그 연결에 속한 응답 패킷은 규칙을 다시 따지지 않고 통과시킵니다.</p>
<svg class="fig" viewBox="0 0 560 180" role="img" aria-label="상태 저장 방화벽. 1번: 사용자의 요청이 인바운드 규칙 TCP 443 허용에 맞아서 방화벽을 통과해 서버로 간다. 방화벽은 이 연결을 기억한다. 2번: 서버의 응답은 방화벽이 기억해 둔 연결이라서 규칙을 다시 보지 않고 통과한다.">
<use href="#i-pc" x="46" y="14" width="48" height="48"/><text x="70" y="84" class="c">사용자</text><text x="70" y="104" class="c t-s">임시 포트 50000</text>
<use href="#i-lock" x="256" y="14" width="48" height="48" class="acc"/><text x="280" y="84" class="c">방화벽</text><text x="280" y="104" class="c t-s">연결을 기억함</text>
<use href="#i-server" x="476" y="14" width="48" height="48"/><text x="500" y="84" class="c">서버</text><text x="500" y="104" class="c t-s">443번 포트</text>
<line x1="98" y1="30" x2="254" y2="30" class="ln acc" marker-end="url(#ar-acc)"/><line x1="306" y1="30" x2="474" y2="30" class="ln acc" marker-end="url(#ar-acc)"/>
<line x1="474" y1="48" x2="306" y2="48" class="ln" marker-end="url(#ar)"/><line x1="254" y1="48" x2="98" y2="48" class="ln" marker-end="url(#ar)"/>
<g class="badge"><circle cx="176" cy="15" r="11"/><text x="176" y="20.5">1</text></g>
<g class="badge"><circle cx="176" cy="64" r="11"/><text x="176" y="69.5">2</text></g>
<text x="20" y="140" class="t-m">1 요청: 인바운드 규칙 "TCP 443 허용"에 맞아서 통과</text>
<text x="20" y="166" class="t-m">2 응답: 기억해 둔 연결이라 규칙을 다시 보지 않고 통과</text>
</svg>
<p>이 방식이 필요한 이유는 응답의 목적지 포트 때문입니다. 응답은 사용자의 <b>임시 포트</b>(<a data-lesson="d09"></a>)로 돌아가는데, 임시 포트는 접속할 때마다 달라집니다. 상태 저장이 없다면 응답을 위해 넓은 포트 범위를 통째로 열어 둬야 합니다.</p>
<div class="tbl-wrap"><table><thead><tr><th></th><th>상태 저장 (Stateful)</th><th>상태 비저장 (Stateless)</th></tr></thead><tbody>
<tr><td class="nw"><b>응답 패킷</b></td><td>허용한 연결의 응답은 자동으로 통과</td><td>응답도 규칙으로 따로 허용해야 함</td></tr>
<tr><td class="nw"><b>규칙을 쓰는 법</b></td><td>접속을 <b>시작하는 방향</b>만 적음</td><td>가는 방향과 오는 방향을 모두 적음</td></tr>
</tbody></table></div>
<p>그래서 상태 저장 방화벽의 규칙은 <b>누가 먼저 접속을 시작하느냐</b>로 방향을 정합니다. 사용자가 서버에 접속하는 것은 서버의 인바운드 규칙이고, 서버가 업데이트를 받으러 밖으로 나가는 것은 서버의 아웃바운드 규칙입니다.</p>
<p class="small muted">대부분의 방화벽과 Security Group은 상태 저장 방식입니다. 상태 비저장 방식의 규칙을 함께 쓰는 환경도 있으니, 쓰는 환경이 어느 쪽인지 확인합니다.</p>

<h2 id="s3">Security Group: 클라우드에서 VM에 붙이는 규칙</h2>
<p><b>Security Group</b>은 클라우드에서 VM<span class="small muted">(Virtual Machine)</span>의 네트워크 인터페이스에 붙이는 방화벽 규칙 묶음입니다. VM으로 드나드는 통신은 그 VM에 붙은 Security Group의 규칙을 통과해야 합니다.</p>
<ul><li><b>허용 규칙만 적습니다.</b> 적지 않은 통신은 기본으로 차단됩니다. "거부" 규칙은 따로 없습니다.</li><li><b>상태 저장 방식</b>입니다. 허용한 접속의 응답은 자동으로 통과합니다.</li><li><b>VM마다 붙입니다.</b> 같은 Subnet에 있는 VM끼리도 Security Group이 허용해야 통신할 수 있습니다.</li><li>규칙에 순서가 없습니다. 규칙 가운데 <b>하나라도 맞으면</b> 허용됩니다.</li></ul>
<p class="small muted">위 내용은 AWS(Amazon Web Services) 방식의 Security Group 기준입니다. Zadara zCompute의 Security Group도 Ingress·Egress 규칙을 쓰고, 상태 저장 방식이며, 허용 규칙에 없는 통신은 기본으로 차단합니다. VM, 로드밸런서, 네트워크 인터페이스에 붙일 수 있습니다. zCompute에서 실제로 설정하는 방법은 <a data-lesson="zc2"></a>에서 배웁니다.</p>
<h3>규칙 읽는 법</h3>
<p>규칙 한 줄은 <b>방향, 프로토콜, 포트, 상대 주소</b>로 되어 있습니다. Web 서버에 붙인 Security Group의 예입니다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>방향</th><th>프로토콜</th><th>포트</th><th>상대 주소</th><th>읽는 법</th></tr></thead><tbody>
<tr><td class="nw">Inbound</td><td>TCP</td><td>80</td><td class="nw">10.0.1.0/24</td><td>로드밸런서가 있는 Subnet(10.0.1.0 ~ 10.0.1.255)에서 80번 포트로 오는 접속을 허용</td></tr>
<tr><td class="nw">Inbound</td><td>TCP</td><td>22</td><td class="nw">10.0.1.5/32</td><td>10.0.1.5 한 대에서 22번 포트로 오는 접속만 허용</td></tr>
<tr><td class="nw">Outbound</td><td>모두</td><td>모두</td><td class="nw">0.0.0.0/0</td><td>이 서버가 밖으로 시작하는 통신은 모두 허용</td></tr>
</tbody></table></div>
<ul><li><b>방향</b>: Inbound는 이 VM으로 들어오는 접속, Outbound는 이 VM이 시작해서 나가는 접속입니다.</li><li><b>상대 주소</b>: Inbound 규칙에서는 <b>출발지</b>, Outbound 규칙에서는 <b>목적지</b>입니다. <code>0.0.0.0/0</code>은 모든 주소, <code>/32</code>는 주소 한 개입니다(<a data-lesson="d07"></a>).</li><li>위 규칙에 없는 접속, 예를 들어 인터넷에서 이 서버의 80번 포트로 바로 오는 접속은 차단됩니다.</li></ul>
<p>AWS 방식에서는 상대 주소에 CIDR 대신 <b>다른 Security Group</b>을 적을 수도 있습니다. "로드밸런서의 Security Group이 붙은 장비에서 오는 접속"이라는 뜻입니다. 로드밸런서의 IP 주소가 바뀌거나 대수가 늘어도 규칙을 고치지 않아도 됩니다. 이 기능을 쓸 수 있는지는 환경에 따라 다릅니다.</p>
<div class="box warn"><span class="lbl">흔한 실수</span><ul><li><b>22번 포트를 0.0.0.0/0으로 엽니다.</b> 인터넷 전체에서 SSH 접속 시도가 들어옵니다. 관리자가 쓰는 주소로만 좁힙니다.</li><li><b>안 되면 "모두 허용"을 넣고 그대로 둡니다.</b> <a data-lesson="d04"></a>의 chmod 777과 같은 습관입니다. 원인을 찾은 뒤에는 필요한 규칙만 남깁니다.</li><li><b>응답용 규칙을 따로 넣습니다.</b> 상태 저장 방식이라 필요 없습니다.</li><li><b>한쪽만 봅니다.</b> 보내는 쪽의 Outbound와 받는 쪽의 Inbound가 모두 허용해야 합니다. 서버 안의 호스트 방화벽도 함께 확인합니다.</li><li><b>ping이 안 된다고 규칙이 틀렸다고 생각합니다.</b> ICMP를 허용하지 않았으면 ping은 실패하는 것이 정상입니다. 실제로 쓰는 포트로 확인합니다(<a data-lesson="d09"></a>).</li></ul></div>
<p class="small muted">새로 만든 Security Group에 처음 들어 있는 규칙은 환경마다 다릅니다. 예를 들어 AWS는 Inbound 규칙이 하나도 없고(모두 차단) Outbound는 모두 허용인 상태로 시작합니다. Security Group에 막힌 접속은 보통 답이 없어서 timed out으로 보입니다.</p>

<h2 id="s4">HTTP: 웹의 요청과 응답</h2>
<p>규칙이 통신을 허용했다면, 그 위에서 양쪽이 주고받는 약속이 필요합니다. 웹에서 쓰는 약속이 <b>HTTP</b><span class="small muted">(HyperText Transfer Protocol)</span>입니다. 브라우저가 <b>요청</b>을 보내면 서버가 <b>응답</b>을 돌려줍니다. 7계층의 프로토콜이고(<a data-lesson="d07"></a>), TCP 연결 위에서 동작하며, 기본 포트는 80입니다.</p>
<h3>주소(URL)의 구조</h3>
<pre class="code">https://shop.example.com:443/orders?page=2</pre>
<div class="tbl-wrap"><table><thead><tr><th>부분</th><th>이름</th><th>뜻</th></tr></thead><tbody>
<tr><td><code>https</code></td><td class="nw">방식</td><td>어떤 약속으로 접속할지. http 또는 https</td></tr>
<tr><td><code>shop.example.com</code></td><td class="nw">호스트 이름</td><td>어느 서버인지. DNS로 IP 주소를 알아냄</td></tr>
<tr><td><code>:443</code></td><td class="nw">포트</td><td>보통 생략함. 생략하면 http는 80, https는 443</td></tr>
<tr><td><code>/orders</code></td><td class="nw">경로</td><td>그 서버에서 무엇을 요청하는지</td></tr>
<tr><td><code>?page=2</code></td><td class="nw">질의</td><td>요청에 덧붙이는 값</td></tr>
</tbody></table></div>
<p class="small muted">URL: Uniform Resource Locator(웹 주소). shop.example.com은 예시용 이름입니다.</p>
<h3>요청과 응답의 모양</h3>
<pre class="code"><span class="c"># 요청: 브라우저 → 서버</span>
GET /orders?page=2 HTTP/1.1
Host: shop.example.com
User-Agent: ...

<span class="c"># 응답: 서버 → 브라우저</span>
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 5120

&lt;html&gt; ... &lt;/html&gt;</pre>
<ul><li><b>요청의 첫 줄</b>: 메서드(<code>GET</code>), 경로(<code>/orders?page=2</code>), HTTP 버전입니다.</li><li><b>헤더</b>: 요청이나 응답에 덧붙이는 정보입니다. <code>Host</code>는 어느 사이트로 온 요청인지를 알려 줍니다. 서버 한 대나 로드밸런서 하나가 여러 이름의 사이트를 함께 받을 때 이 값으로 구분합니다.</li><li><b>응답의 첫 줄</b>: 결과를 알려 주는 <b>상태 코드</b>(<code>200</code>)가 있습니다.</li><li><b>본문</b>: 빈 줄 다음에 실제 내용(화면, 데이터)이 옵니다.</li></ul>
<div class="tbl-wrap"><table><thead><tr><th>메서드</th><th>하려는 일</th></tr></thead><tbody>
<tr><td><code>GET</code></td><td>가져오기. 화면을 열거나 목록을 볼 때</td></tr>
<tr><td><code>POST</code></td><td>보내기. 글을 쓰거나 주문을 넣을 때</td></tr>
<tr><td><code>PUT</code> / <code>DELETE</code></td><td>바꾸기 / 지우기</td></tr>
</tbody></table></div>
<div class="tbl-wrap"><table><thead><tr><th>상태 코드</th><th>뜻</th><th>예</th></tr></thead><tbody>
<tr><td class="nw"><b>2xx</b></td><td>성공</td><td>200 OK</td></tr>
<tr><td class="nw"><b>3xx</b></td><td>다른 주소로 가라는 안내</td><td>301, 302. http로 온 요청을 https로 보낼 때 흔히 씀</td></tr>
<tr><td class="nw"><b>4xx</b></td><td><b>요청 쪽</b>의 문제</td><td>403 접근 권한 없음, 404 없는 주소</td></tr>
<tr><td class="nw"><b>5xx</b></td><td><b>서버 쪽</b>의 문제</td><td>500 서버 내부 오류, 502·503·504는 아래 로드밸런서 절에서</td></tr>
</tbody></table></div>
<p class="small muted">자주 보는 상태 코드는 <a data-lesson="d01"></a>에서도 다뤘습니다. 응답의 헤더와 상태 코드는 <a data-lesson="d09"></a>의 <code>curl -I</code>로 볼 수 있습니다.</p>
<p><mark>HTTP는 내용을 암호화하지 않습니다.</mark> 요청과 응답이 위에서 본 글자 그대로 네트워크를 지나갑니다. 중간에서 볼 수 있는 사람은 아이디, 비밀번호, 주문 내용을 그대로 읽을 수 있고 바꿀 수도 있습니다. 이 문제를 해결한 것이 HTTPS입니다.</p>

<h2 id="s5">HTTPS와 TLS: 암호화와 인증서</h2>
<p><b>HTTPS</b><span class="small muted">(HTTP Secure)</span>는 HTTP를 <b>TLS</b>로 감싸서 주고받는 것입니다. 기본 포트는 443입니다. <b>TLS</b><span class="small muted">(Transport Layer Security)</span>는 통신을 보호하는 프로토콜이고, 예전 이름은 SSL<span class="small muted">(Secure Sockets Layer)</span>입니다. 지금도 습관적으로 "SSL 인증서"라고 부르는 사람이 많습니다.</p>
<div class="box mem"><span class="lbl">외울 것: TLS가 해 주는 세 가지</span><ul><li><b>암호화</b>: 중간에서 봐도 내용을 읽을 수 없습니다.</li><li><b>무결성</b>: 중간에서 내용을 바꾸면 받는 쪽이 알아챕니다.</li><li><b>인증</b>: 접속한 상대가 진짜 그 이름의 서버인지 확인합니다.</li></ul></div>
<h3>인증서: 진짜 그 서버인지 확인하는 수단</h3>
<p>암호화만으로는 부족합니다. 가짜 서버와 암호화 통신을 해도 소용이 없기 때문입니다. 그래서 서버는 <b>인증서</b>를 내보입니다. 인증서에는 다음이 들어 있습니다.</p>
<ul><li><b>도메인 이름</b>: 이 인증서가 어느 이름의 서버 것인지</li><li><b>서버의 공개키</b>: 짝이 되는 개인키는 서버만 가지고 있습니다. 공개키와 개인키의 관계는 <a data-lesson="d04"></a>의 SSH 키와 같습니다.</li><li><b>발급 기관의 서명</b>: 인증서를 발급한 기관을 <b>CA</b><span class="small muted">(Certificate Authority)</span>라고 합니다. 브라우저와 운영체제는 믿을 수 있는 CA의 목록을 가지고 있습니다.</li><li><b>유효 기간</b>: 기간이 지나면 다시 발급받아야 합니다.</li></ul>
<p>브라우저는 인증서를 받으면 세 가지를 확인합니다. 접속하려는 이름과 인증서의 이름이 같은지, 유효 기간 안인지, 믿을 수 있는 CA가 서명했는지입니다.</p>
<h3>TLS 연결이 맺어지는 순서</h3>
<svg class="fig" viewBox="0 0 560 272" role="img" aria-label="TLS 연결 순서. TCP 연결이 끝난 뒤에 시작한다. 1번: 브라우저가 접속할 이름과 쓸 수 있는 암호 방식을 서버에 알린다. 2번: 서버가 인증서를 보낸다. 3번: 브라우저가 인증서를 확인한다. 4번: 양쪽이 같은 비밀 키를 만든다. 5번: 그 비밀 키로 암호화한 HTTP 통신을 주고받는다.">
<text x="150" y="24" class="c b">브라우저</text><text x="450" y="24" class="c b">서버</text>
<text x="300" y="48" class="c t-s">TCP 연결이 끝난 뒤에 시작</text>
<line x1="150" y1="58" x2="150" y2="262" class="ln"/><line x1="450" y1="58" x2="450" y2="262" class="ln"/>
<text x="300" y="84" class="c">접속할 이름과 암호 방식을 알림</text><line x1="154" y1="92" x2="446" y2="108" class="ln" marker-end="url(#ar)"/>
<text x="300" y="128" class="c">인증서를 보냄</text><line x1="446" y1="136" x2="154" y2="152" class="ln" marker-end="url(#ar)"/>
<text x="110" y="182" class="e t-s">인증서 확인</text>
<text x="300" y="204" class="c">양쪽이 같은 비밀 키를 만듦</text><line x1="154" y1="212" x2="446" y2="212" class="ln" marker-start="url(#ar)" marker-end="url(#ar)"/>
<text x="300" y="244" class="c b t-acc">비밀 키로 암호화한 HTTP 통신</text><line x1="154" y1="252" x2="446" y2="252" class="ln acc" marker-start="url(#ar-acc)" marker-end="url(#ar-acc)"/>
<g class="badge"><circle cx="126" cy="92" r="11"/><text x="126" y="97.5">1</text></g>
<g class="badge"><circle cx="474" cy="136" r="11"/><text x="474" y="141.5">2</text></g>
<g class="badge"><circle cx="126" cy="176" r="11"/><text x="126" y="181.5">3</text></g>
<g class="badge"><circle cx="126" cy="212" r="11"/><text x="126" y="217.5">4</text></g>
<g class="badge"><circle cx="126" cy="252" r="11"/><text x="126" y="257.5">5</text></g>
</svg>
<p class="fig-cap">1~4번이 TLS 연결을 맺는 과정이고, 5번부터 실제 HTTP 요청과 응답이 암호화되어 오갑니다.</p>
<ol><li>브라우저가 접속하려는 이름과, 자기가 쓸 수 있는 암호 방식을 알립니다.</li><li>서버가 인증서를 보냅니다.</li><li>브라우저가 인증서를 확인합니다. 문제가 있으면 여기서 경고를 띄우고 멈춥니다.</li><li>양쪽이 이 연결에서만 쓸 <b>같은 비밀 키</b>를 만듭니다. 이 키는 네트워크로 보내지 않고 양쪽에서 각자 계산합니다.</li><li>그 뒤의 HTTP 요청과 응답은 모두 이 비밀 키로 암호화합니다.</li></ol>
<p><mark>순서는 TCP 연결(3-way handshake) → TLS 연결 → HTTP 요청입니다.</mark> 그래서 443번 포트가 방화벽에 막혀 있으면 TLS는 시작도 하지 못합니다(<a data-lesson="d09"></a>).</p>
<p class="small muted">TLS가 가려 주는 것은 내용(경로, 헤더, 본문)입니다. 어느 IP 주소의 몇 번 포트와 통신하는지는 가려지지 않습니다.</p>
<h3>인증서에 문제가 있을 때</h3>
<div class="tbl-wrap"><table><thead><tr><th>보이는 것</th><th>원인이 될 수 있는 것</th></tr></thead><tbody>
<tr><td>브라우저의 "연결이 비공개로 설정되어 있지 않습니다" 같은 경고,<br><code>curl: (60) SSL certificate problem</code></td><td>· 인증서의 유효 기간이 지남<br>· 접속한 이름과 인증서의 이름이 다름<br>· 믿을 수 있는 CA가 서명하지 않음(직접 만든 인증서 등)<br>· 내 PC의 날짜와 시간이 틀림</td></tr>
</tbody></table></div>
<p class="small muted">경고가 떴다고 곧바로 공격이라고 단정하지는 않습니다. 그렇다고 무시하고 진행하지도 않습니다. 위의 원인 가운데 어느 것인지 확인합니다. 메시지의 표현은 브라우저와 프로그램 버전에 따라 다릅니다.</p>
<p>인증서의 정보는 <code>curl -v</code>로 볼 수 있습니다. 아래는 학습용 예시이고, 이름과 날짜와 발급 기관은 지어낸 값입니다.</p>
<pre class="code">$ curl -vI https://shop.example.com
...
* Server certificate:
*  subject: CN=shop.example.com
*  expire date: Mar  1 23:59:59 2027 GMT
*  issuer: C=US; O=Example CA; CN=Example CA R1
*  SSL certificate verify ok.
...
&lt; HTTP/1.1 200 OK</pre>
<ul><li><code>subject</code>의 <code>CN</code>: 이 인증서가 어느 이름의 것인지입니다.</li><li><code>expire date</code>: 유효 기간이 끝나는 날입니다.</li><li><code>issuer</code>: 인증서를 발급한 CA입니다.</li><li><code>SSL certificate verify ok</code>: 세 가지 확인을 모두 통과했다는 뜻입니다.</li></ul>
<h3>TLS 종료: 암호화를 어디서 푸는가</h3>
<p>암호화를 푸는 곳이 꼭 Web 서버일 필요는 없습니다. 로드밸런서가 인증서를 가지고 TLS를 풀고, 뒤쪽의 Web 서버와는 HTTP(80번 포트)로 통신하는 구성이 흔합니다. 이것을 <b>TLS 종료</b>라고 합니다. 인증서를 로드밸런서 한 곳에서만 관리하면 되고, 로드밸런서가 HTTP의 내용을 볼 수 있게 됩니다. <a data-lesson="d01"></a>의 종합 구성도가 이 방식입니다.</p>
<p class="small muted">보안 정책에 따라 로드밸런서와 Web 서버 사이도 HTTPS로 암호화하는 구성이 있습니다. 로드밸런서 없이 Web 서버가 직접 TLS를 처리하기도 합니다.</p>

<h2 id="s6">SSH: 관리용 접속을 여는 규칙</h2>
<p>SSH<span class="small muted">(Secure Shell)</span>는 서버에 원격으로 접속해 명령을 실행하는 암호화된 통로입니다. 접속 방법과 키 인증은 <a data-lesson="d04"></a>에서 배웠습니다. 여기서는 그 22번 포트를 <b>네트워크에서 어떻게 열지</b>를 봅니다.</p>
<ul><li><b>출발지를 좁힙니다.</b> 22번 포트를 0.0.0.0/0으로 열면 인터넷 전체에서 접속 시도가 들어옵니다(<a data-lesson="d04"></a>의 무작위 대입 공격). 회사의 공인 IP 대역이나 관리자의 주소 하나(<code>/32</code>)로만 엽니다.</li><li><b>Private 영역의 서버는 인터넷에서 직접 접속하지 않습니다.</b> 사설 IP만 있어서 인터넷에서 닿을 수도 없습니다(<a data-lesson="d08"></a>). 대신 <b>Bastion 호스트</b>를 거칩니다.</li></ul>
<p><b>Bastion 호스트</b>는 관리자가 안쪽 서버에 접속할 때 거쳐 가는 관리용 서버입니다. Public 영역에 한 대만 두고, 관리자는 먼저 Bastion에 SSH로 접속한 다음 거기서 안쪽 서버로 다시 접속합니다.</p>
<div class="flow"><div class="n"><b>관리자 PC</b><small>회사의 공인 IP</small></div><span class="ar">→ 22 →</span><div class="n k"><b>Bastion 호스트</b><small>Public Subnet<br>허용: 22 ← 관리자의 주소만</small></div><span class="ar">→ 22 →</span><div class="n"><b>Web · WAS · DB 서버</b><small>Private Subnet<br>허용: 22 ← Bastion에서만</small></div></div>
<ul><li>인터넷에 SSH가 열린 서버가 Bastion 한 대로 줄어듭니다. 지킬 곳과 기록을 볼 곳이 한 곳이 됩니다.</li><li>안쪽 서버의 규칙은 "22번은 Bastion에서 오는 것만 허용"입니다.</li></ul>
<p class="small muted">PC: Personal Computer. 회사의 참조 아키텍처에도 Public 쪽에 Bastion이 있습니다. 내부 서버의 접근 통제는 <a data-lesson="zc8"></a>의 실습 과제에서 직접 설계합니다. 키 인증, root 로그인 금지 같은 서버 쪽 설정은 <a data-lesson="d04"></a>를 다시 보세요.</p>
<div class="tbl-wrap"><table><thead><tr><th></th><th>SSH</th><th>TLS (HTTPS)</th></tr></thead><tbody>
<tr><td class="nw"><b>쓰는 곳</b></td><td>서버 원격 접속, 파일 전송</td><td>웹을 비롯한 응용 통신의 보호</td></tr>
<tr><td class="nw"><b>기본 포트</b></td><td>22</td><td>443</td></tr>
<tr><td class="nw"><b>상대 확인</b></td><td>서버 지문(known_hosts)과 사용자 키</td><td>CA가 서명한 인증서</td></tr>
</tbody></table></div>

<h2 id="s7">로드밸런싱: 요청을 여러 서버에 나눠 주기</h2>
<p>로드밸런서가 왜 필요한지(이중화, SPOF, Health Check)는 <a data-lesson="d01"></a>에서, L4와 L7이라는 이름의 뜻은 <a data-lesson="d07"></a>에서 배웠습니다. 여기서는 로드밸런서가 어떤 부품으로 이루어지고, L4와 L7이 실제로 무엇이 다른지를 봅니다.</p>
<h3>구성 요소</h3>
<div class="tbl-wrap"><table><thead><tr><th>부품</th><th>하는 일</th><th>예</th></tr></thead><tbody>
<tr><td class="nw"><b>Listener</b></td><td>로드밸런서가 요청을 기다리는 포트와 프로토콜</td><td>HTTPS 443</td></tr>
<tr><td class="nw"><b>Target Group</b></td><td>요청을 나눠 받을 서버 묶음과 그 포트</td><td>Web 서버 2대의 80번 포트</td></tr>
<tr><td class="nw"><b>Health Check</b></td><td>대상 서버가 살아 있는지 주기적으로 확인. 실패한 서버로는 보내지 않음</td><td>10초마다 80번 포트에 요청</td></tr>
</tbody></table></div>
<p>요청은 Listener로 들어와서, Target Group 안의 건강한 서버 가운데 하나로 전달됩니다. 어느 서버로 보낼지는 차례대로 돌아가며 보내는 방식(라운드 로빈)이나 연결이 가장 적은 서버로 보내는 방식 등으로 정합니다.</p>
<h3>L4 로드밸런서와 L7 로드밸런서</h3>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>L4 로드밸런서 <span class="small muted">NLB</span></th><th>L7 로드밸런서 <span class="small muted">ALB</span></th></tr></thead><tbody>
<tr><td class="nw"><b>보는 것</b></td><td>IP 주소와 포트 번호</td><td>HTTP 요청의 내용(Host 헤더, 경로 등)</td></tr>
<tr><td class="nw"><b>나누는 단위</b></td><td>TCP·UDP 연결</td><td>HTTP 요청</td></tr>
<tr><td class="nw"><b>할 수 있는 일</b></td><td>어떤 TCP·UDP 통신이든 분배. 하는 일이 적어 빠름</td><td>경로나 이름에 따라 다른 Target Group으로 분배, TLS 종료</td></tr>
<tr><td class="nw"><b>쓰는 곳</b></td><td>HTTP가 아닌 통신, 안쪽 서버 사이의 분배</td><td>웹 서비스의 입구</td></tr>
</tbody></table></div>
<p class="small muted">NLB: Network Load Balancer · ALB: Application Load Balancer. AWS와 Zadara zCompute가 이 이름을 씁니다. 회사의 참조 아키텍처는 Web 서버 앞에 ALB를, WAS 앞에 NLB를 둡니다. zCompute에서 Listener와 Target Group을 만드는 실습은 <a data-lesson="zc6"></a>에서 합니다.</p>
<p>L7 로드밸런서가 경로를 보고 나눌 수 있는 것은 HTTP의 내용을 읽기 때문입니다. HTTPS라면 내용이 암호화되어 있으므로, 로드밸런서가 TLS를 풀어야(TLS 종료) 읽을 수 있습니다.</p>
<p class="small muted">L7 로드밸런서를 거치면 Web 서버가 보는 접속 상대는 사용자가 아니라 로드밸런서입니다. 그래서 로드밸런서는 원래 사용자의 IP 주소를 <code>X-Forwarded-For</code>라는 헤더에 적어서 넘겨주는 것이 보통입니다.</p>
<p>로드밸런서 뒤의 서버는 규칙도 달라집니다. 사용자는 로드밸런서에만 접속하므로, Web 서버의 Security Group은 <b>로드밸런서에서 오는 접속만</b> 허용하면 됩니다.</p>

<h2 id="s8">종합: 웹 요청 한 번의 경로</h2>
<p>지금까지 배운 것을 한 장으로 합칩니다. 사용자가 <code>https://shop.example.com/orders</code>를 열 때의 경로입니다. 배치는 <a data-lesson="d01"></a>과 <a data-lesson="d08"></a>의 기본 원칙(로드밸런서만 Public, Web 서버·WAS·DB는 Private)을 따릅니다.</p>
<svg class="fig" viewBox="0 0 560 460" role="img" aria-label="웹 요청 경로. 사용자의 브라우저가 DNS 조회로 로드밸런서의 공인 IP를 알아내고, HTTPS 443번 포트로 Public Subnet의 로드밸런서에 접속한다. 로드밸런서는 모든 주소에서 오는 443번 접속을 허용하고, 여기서 TLS 암호화를 푼다. 로드밸런서는 HTTP 80번 포트로 Private Subnet의 Web 서버에 전달한다. Web 서버는 로드밸런서에서 오는 80번 접속만 허용한다. Web 서버는 8080번 포트로 WAS에, WAS는 3306번 포트로 DB에 접속하고, 각각 바로 앞 단계에서 오는 접속만 허용한다.">
<use href="#i-pc" x="60" y="6" width="48" height="48"/><text x="190" y="26" class="b">사용자 (브라우저)</text><text x="190" y="48" class="t-s">DNS 조회: 이름 → 로드밸런서의 공인 IP</text>
<line x1="84" y1="56" x2="84" y2="114" class="ln acc" marker-end="url(#ar-acc)"/><text x="98" y="84" class="t-acc">HTTPS 443</text>
<rect x="8" y="96" width="544" height="76" rx="10" class="zone"/><text x="544" y="118" class="e t-s">Public Subnet</text>
<use href="#i-lb" x="60" y="110" width="48" height="48" class="acc"/><text x="190" y="118" class="b">로드밸런서</text><text x="190" y="140" class="t-s">TLS 종료: 여기서 암호화를 푸는 곳</text><text x="190" y="162" class="t-s">허용: 443 ← 모든 주소 (0.0.0.0/0)</text>
<line x1="84" y1="158" x2="84" y2="226" class="ln" marker-end="url(#ar)"/><text x="98" y="196">HTTP 80</text>
<rect x="8" y="208" width="544" height="244" rx="10" class="zone"/><text x="544" y="230" class="e t-s">Private Subnet</text>
<use href="#i-server" x="60" y="222" width="48" height="48"/><text x="190" y="238" class="b">Web 서버</text><text x="190" y="260" class="t-s">허용: 80 ← 로드밸런서에서만</text>
<line x1="84" y1="268" x2="84" y2="312" class="ln" marker-end="url(#ar)"/><text x="98" y="296">8080</text>
<use href="#i-server" x="60" y="308" width="48" height="48"/><text x="190" y="324" class="b">WAS</text><text x="190" y="346" class="t-s">허용: 8080 ← Web 서버에서만</text>
<line x1="84" y1="354" x2="84" y2="398" class="ln" marker-end="url(#ar)"/><text x="98" y="382">3306</text>
<use href="#i-db" x="60" y="394" width="48" height="48"/><text x="190" y="410" class="b">DB</text><text x="190" y="432" class="t-s">허용: 3306 ← WAS에서만</text>
</svg>
<p class="fig-cap">화살표 옆의 숫자는 그 구간의 목적지 포트입니다. 응답은 같은 길을 거꾸로 돌아갑니다.</p>
<ol><li><b>DNS 조회</b>: 브라우저가 shop.example.com의 IP 주소를 알아냅니다. 답은 로드밸런서의 공인 IP입니다(<a data-lesson="d09"></a>).</li><li><b>브라우저 → 로드밸런서 (443)</b>: TCP 연결을 맺고, TLS 연결을 맺으며 인증서를 확인한 뒤, 암호화한 HTTP 요청을 보냅니다. 로드밸런서의 규칙은 "443번은 모든 주소에서 허용"입니다.</li><li><b>로드밸런서</b>: TLS를 풀어 요청 내용을 읽고, Target Group에서 건강한 Web 서버 하나를 고릅니다.</li><li><b>로드밸런서 → Web 서버 (80)</b>: Web 서버의 규칙은 "80번은 로드밸런서에서 오는 것만 허용"입니다. Web 서버는 정적 파일이면 바로 응답하고, 계산이 필요하면 WAS로 넘깁니다(<a data-lesson="d01"></a>).</li><li><b>Web 서버 → WAS (8080)</b>: WAS의 규칙은 "8080번은 Web 서버에서 오는 것만 허용"입니다.</li><li><b>WAS → DB (3306)</b>: DB의 규칙은 "3306번은 WAS에서 오는 것만 허용"입니다.</li><li><b>응답</b>: DB → WAS → Web 서버 → 로드밸런서 순서로 돌아오고, 로드밸런서가 다시 암호화해서 브라우저에 보냅니다. 상태 저장 방식이라 응답을 위한 규칙은 따로 필요 없습니다.</li></ol>
<div class="box mem"><span class="lbl">외울 것: 구간 하나가 통하려면</span><p>① 가는 <b>경로</b>가 있고(<a data-lesson="d08"></a>의 라우팅), ② <b>규칙이 허용</b>하고(이 레슨), ③ 받는 쪽 <b>프로그램이 그 포트를 LISTEN</b>하고 있어야 합니다(<a data-lesson="d09"></a>). 구간마다 이 세 가지를 확인합니다.</p></div>
<p class="small muted">회사의 참조 아키텍처는 Web 서버를 Public Tier에 두고 WAS 앞에 로드밸런서를 하나 더 둡니다(<a data-lesson="d08"></a>). 구역과 장비의 수는 달라도, 요청이 지나는 순서와 "구간마다 앞 단계에서 오는 접속만 허용한다"는 원리는 같습니다.</p>
<h3>어디서 막히면 어떻게 보이나</h3>
<div class="tbl-wrap"><table class="wide"><thead><tr><th style="width:26%">보이는 것</th><th style="width:44%">먼저 의심할 곳</th><th style="width:30%">확인</th></tr></thead><tbody>
<tr><td>이름을 찾지 못함</td><td>DNS 조회(<a data-lesson="d09"></a>)</td><td><code>dig</code></td></tr>
<tr><td>443번 접속이 timed out</td><td>· 로드밸런서의 Inbound 규칙에 443이 없음<br>· 이름이 가리키는 IP 주소가 틀림</td><td><code>nc</code>, <code>curl</code>, 규칙</td></tr>
<tr><td>인증서 경고</td><td>· 인증서의 기간이 지남<br>· 접속한 이름과 인증서의 이름이 다름</td><td><code>curl -v</code></td></tr>
<tr><td>502, 503, 504</td><td>로드밸런서는 살아 있고 그 뒤가 문제<br>· Web 서버가 죽었거나 Health Check에 실패<br>· Web 서버의 규칙이 로드밸런서를 막음<br>· Web 서버나 WAS가 느림</td><td>Target Group의 상태, Web 서버의 규칙, <code>ss -tlnp</code></td></tr>
<tr><td>500</td><td>· WAS 프로그램의 오류<br>· WAS에서 DB로 가는 접속이 막힘</td><td>WAS의 로그(<a data-lesson="d05"></a>), DB의 규칙</td></tr>
</tbody></table></div>
<p class="small muted">표는 먼저 볼 곳을 적은 것입니다. 같은 증상이라도 원인은 여러 가지일 수 있으니, 의심한 곳이 아니면 다음 구간으로 넘어갑니다. 502·503·504가 정확히 어떤 경우에 나오는지는 로드밸런서의 종류에 따라 조금씩 다릅니다.</p>

<h2 id="s9">직접 해 보기</h2>
<p>손노트에 풀어 보세요. 먼저 풀고 나서, 문제 아래의 「답 보기」를 눌러 확인합니다.</p>
<h3>1. 규칙을 읽고 허용·차단 판단하기</h3>
<p>어떤 서버의 Security Group에 Inbound 규칙이 세 줄 있습니다. Outbound는 모두 허용입니다.</p>
<div class="tbl-wrap"><table><thead><tr><th>프로토콜</th><th>포트</th><th>출발지</th></tr></thead><tbody>
<tr><td>TCP</td><td>443</td><td>0.0.0.0/0</td></tr>
<tr><td>TCP</td><td>22</td><td>198.51.100.0/24</td></tr>
<tr><td>TCP</td><td>3306</td><td>10.0.2.0/24</td></tr>
</tbody></table></div>
<p>아래 접속이 각각 허용되는지 차단되는지 판단하고 이유를 적어 보세요.</p>
<ol><li>203.0.113.9에서 443번 포트로</li><li>203.0.113.9에서 22번 포트로</li><li>198.51.100.77에서 22번 포트로</li><li>10.0.3.15에서 3306번 포트로</li><li>이 서버가 밖의 서버 443번 포트로 접속하고 받는 응답</li><li>198.51.100.77에서 보낸 ping</li></ol>
<details class="fold"><summary>답 보기</summary><p class="small muted">① 허용. 443은 모든 주소에 열려 있습니다. ② 차단. 22번은 198.51.100.0 ~ 198.51.100.255에서만 허용하는데 203.0.113.9는 그 범위 밖입니다. ③ 허용. 198.51.100.77은 198.51.100.0/24 안입니다. ④ 차단. 3306은 10.0.2.0 ~ 10.0.2.255에서만 허용하는데 10.0.3.15는 범위 밖입니다. ⑤ 허용. 이 서버가 시작한 접속은 Outbound 규칙으로 허용되고, 상태 저장 방식이라 그 응답은 Inbound 규칙 없이 들어옵니다. ⑥ 차단. ICMP를 허용하는 규칙이 없습니다. ping이 실패해도 22번 접속은 정상으로 됩니다.</p></details>
<h3>2. 규칙 쓰기</h3>
<p>WAS 서버에 붙일 Security Group의 Inbound 규칙을 적어 보세요. 조건은 두 가지입니다. Web 서버들이 있는 Subnet(10.0.2.0/24)에서 8080번 포트로 오는 접속을 받고, SSH는 Bastion 호스트(10.0.1.5) 한 대에서만 받습니다.</p>
<details class="fold"><summary>답 보기</summary><p class="small muted">TCP 8080 ← 10.0.2.0/24, TCP 22 ← 10.0.1.5/32 두 줄입니다. 그 밖의 Inbound는 적지 않습니다. 적지 않은 통신은 기본으로 차단됩니다. 응답을 위한 규칙도 필요 없습니다.</p></details>
<h3>3. 웹 요청 경로 설명하기</h3>
<p>사용자가 <code>https://shop.example.com/orders</code>를 열었을 때 요청이 DB까지 가는 경로를 순서대로 적어 보세요. 구간마다 목적지 포트, 그 구간을 허용하는 규칙, TLS를 푸는 곳을 함께 적습니다.</p>
<details class="fold"><summary>답 보기</summary><p class="small muted">① DNS 조회로 로드밸런서의 공인 IP를 알아냅니다. ② 브라우저 → 로드밸런서: 443번. TCP 연결, TLS 연결(인증서 확인), 암호화한 HTTP 요청 순서입니다. 규칙은 443 ← 모든 주소. ③ 로드밸런서가 TLS를 풀고 건강한 Web 서버를 고릅니다. ④ 로드밸런서 → Web 서버: 80번. 규칙은 80 ← 로드밸런서에서만. ⑤ Web 서버 → WAS: 8080번. 규칙은 8080 ← Web 서버에서만. ⑥ WAS → DB: 3306번. 규칙은 3306 ← WAS에서만. 응답은 같은 길을 거꾸로 돌아오고, 상태 저장 방식이라 응답용 규칙은 필요 없습니다.</p></details>
<h3>4. 증상으로 볼 곳 정하기</h3>
<ol><li>브라우저에 503이 나옵니다. 주소창의 자물쇠는 정상입니다.</li><li>집에서는 서버에 SSH 접속이 timed out인데, 회사에서는 됩니다.</li><li>서버에 ping은 안 되는데 https 접속은 됩니다.</li></ol>
<details class="fold"><summary>답 보기</summary><p class="small muted">① 자물쇠가 정상이고 상태 코드가 왔으므로 DNS, 443번 접속, TLS는 통과한 것입니다. 로드밸런서 뒤쪽을 먼저 봅니다. Target Group의 서버들이 Health Check에 통과하고 있는지, Web 서버의 규칙이 로드밸런서를 허용하는지, Web 서버가 떠 있는지를 확인합니다. ② 22번 포트의 Inbound 규칙이 회사의 주소로만 열려 있을 가능성을 먼저 봅니다. 이 경우 고장이 아니라 의도한 동작입니다. 집의 공인 IP가 규칙에 없는지 확인합니다. ③ 문제가 아닙니다. ICMP를 허용하는 규칙이 없을 뿐이고, 실제 서비스가 쓰는 443번은 정상입니다.</p></details>
`,
summary:['방화벽 규칙 = 방향, 프로토콜, 포트, 상대 주소, 동작. 기본 거부로 두고 필요한 것만 최소한으로 허용한다. 순서가 있는 방화벽은 처음 맞는 규칙을 적용한다. DROP은 timed out, REJECT는 refused로 보인다.','상태 저장 방화벽은 허용한 연결을 기억해서 응답을 자동으로 통과시킨다. 규칙은 접속을 시작하는 방향만 적는다.','Security Group은 클라우드에서 VM에 붙이는 규칙 묶음. 허용 규칙만 적고 적지 않은 통신은 차단, 상태 저장 방식. 규칙은 방향·프로토콜·포트·상대 주소(CIDR)로 읽는다. 22번을 0.0.0.0/0으로 열지 않는다.','HTTP는 요청(메서드, 경로, 헤더)과 응답(상태 코드, 헤더, 본문)으로 된 웹의 약속이고 암호화되지 않는다. 4xx는 요청 쪽, 5xx는 서버 쪽 문제.','HTTPS = HTTP + TLS(443). TLS는 암호화, 무결성, 인증을 해 준다. 인증서에는 도메인 이름, 공개키, CA의 서명, 유효 기간이 있다. 순서는 TCP 연결 → TLS 연결 → HTTP. 로드밸런서에서 암호화를 푸는 것이 TLS 종료.','SSH는 출발지를 좁혀서 열고, Private 영역의 서버는 Bastion 호스트를 거쳐 접속한다. 로드밸런서는 Listener, Target Group, Health Check로 이루어진다. L4(NLB)는 IP·포트만, L7(ALB)은 HTTP 내용을 보고 나눈다.','웹 요청 경로: DNS 조회 → 로드밸런서(443, TLS 종료) → Web 서버(80) → WAS(8080) → DB(3306). 구간마다 앞 단계에서 오는 접속만 허용한다. 구간 하나가 통하려면 경로, 허용 규칙, LISTEN 중인 프로그램이 모두 있어야 한다.'],
essay:[
{q:'방화벽 규칙이 어떤 항목으로 이루어지는지 말하고, 기본 거부 원칙과 상태 저장 방식을 설명해 보세요.',a:'규칙은 방향(인바운드·아웃바운드), 프로토콜(TCP·UDP·ICMP), 포트, 상대 주소(출발지나 목적지의 CIDR), 동작(허용·거부)으로 이루어진다. 기본 거부는 허용한다고 적지 않은 통신을 모두 막는 원칙으로, 필요한 포트와 출발지만 최소한으로 연다. 상태 저장 방식은 방화벽이 규칙에 맞아 통과시킨 연결을 기억해 두고, 그 연결의 응답은 규칙을 다시 따지지 않고 통과시키는 것이다. 응답은 접속할 때마다 달라지는 임시 포트로 돌아가므로, 상태 저장이 없으면 넓은 포트 범위를 열어야 한다. 그래서 규칙은 접속을 시작하는 방향만 적는다.'},
{q:'Security Group에 Inbound 규칙이 "TCP 443 ← 0.0.0.0/0", "TCP 22 ← 203.0.113.0/24" 두 줄만 있습니다. 어떤 접속이 허용되고 어떤 접속이 차단되는지, 이유와 함께 설명해 보세요.',a:'443번 포트로 오는 접속은 출발지가 어디든 허용된다. 0.0.0.0/0이 모든 주소이기 때문이다. 22번 포트로 오는 접속은 출발지가 203.0.113.0 ~ 203.0.113.255일 때만 허용되고, 그 밖의 주소에서 오면 차단된다. 80번이나 3306번처럼 규칙에 없는 포트로 오는 접속은 모두 차단된다. Security Group은 허용 규칙만 적고 적지 않은 통신은 기본으로 차단하기 때문이다. ICMP 규칙이 없으므로 ping도 실패한다. 허용된 접속의 응답은 상태 저장 방식이라 따로 규칙이 없어도 나간다. 차단된 접속은 보통 답이 없어서 timed out으로 보인다.'},
{q:'HTTP와 HTTPS의 차이를 설명하고, TLS가 해 주는 일과 인증서의 역할을 말해 보세요.',a:'HTTP는 요청과 응답을 암호화하지 않고 그대로 보내므로, 중간에서 내용을 읽거나 바꿀 수 있다. HTTPS는 HTTP를 TLS로 감싸서 보내는 것이고 기본 포트는 443이다. TLS는 세 가지를 해 준다. 내용을 읽을 수 없게 하는 암호화, 중간에 바뀌면 알아채는 무결성, 상대가 진짜 그 서버인지 확인하는 인증이다. 인증은 인증서로 한다. 인증서에는 도메인 이름, 서버의 공개키, 발급 기관(CA)의 서명, 유효 기간이 들어 있고, 브라우저는 이름이 맞는지, 기간 안인지, 믿을 수 있는 CA가 서명했는지를 확인한다. 순서는 TCP 연결, TLS 연결, HTTP 요청이다.'},
{q:'Private 영역에 있는 서버에 관리자가 SSH로 접속할 수 있게 하려면 네트워크 규칙을 어떻게 잡아야 하는지 설명해 보세요.',a:'22번 포트를 모든 주소(0.0.0.0/0)에 열지 않는다. Private 영역의 서버는 사설 IP만 있어서 인터넷에서 직접 닿지 않으므로, Public 영역에 Bastion 호스트를 한 대 두고 거쳐 간다. Bastion의 규칙은 22번을 관리자의 주소(회사의 공인 IP 대역이나 주소 하나)에서만 허용하고, 안쪽 서버의 규칙은 22번을 Bastion에서 오는 것만 허용한다. 이렇게 하면 인터넷에 SSH가 열린 서버가 한 대로 줄어든다. 키 인증을 쓰고 root 로그인을 막는 서버 쪽 설정은 [[d04]]에서 배운 대로 한다.'},
{q:'L4 로드밸런서와 L7 로드밸런서의 차이를 설명하고, Listener, Target Group, Health Check가 각각 무엇인지 말해 보세요.',a:'L4 로드밸런서(NLB)는 IP 주소와 포트 번호만 보고 TCP·UDP 연결을 나눠 준다. 어떤 통신이든 분배할 수 있고 하는 일이 적어 빠르다. L7 로드밸런서(ALB)는 HTTP 요청의 내용(Host 헤더, 경로)을 보고 나눠 준다. 경로에 따라 다른 서버 묶음으로 보낼 수 있고 TLS 종료도 맡는다. HTTPS의 내용을 읽으려면 로드밸런서가 TLS를 풀어야 한다. Listener는 로드밸런서가 요청을 기다리는 포트와 프로토콜이고, Target Group은 요청을 나눠 받을 서버 묶음이다. Health Check는 대상 서버가 살아 있는지 주기적으로 확인하는 기능으로, 실패한 서버로는 요청을 보내지 않는다.'},
{q:'사용자가 https://shop.example.com/orders를 열었을 때 요청이 DB까지 가는 경로를 순서대로 설명해 보세요. 구간마다 포트와 허용 규칙을 함께 말합니다.',a:'먼저 DNS 조회로 로드밸런서의 공인 IP를 알아낸다. 브라우저는 로드밸런서의 443번 포트에 TCP 연결을 맺고, TLS 연결을 맺으며 인증서를 확인한 뒤, 암호화한 HTTP 요청을 보낸다. 로드밸런서의 규칙은 443번을 모든 주소에서 허용하는 것이다. 로드밸런서는 TLS를 풀고(TLS 종료) Target Group에서 건강한 Web 서버를 골라 80번 포트로 전달한다. Web 서버의 규칙은 80번을 로드밸런서에서 오는 것만 허용한다. Web 서버는 계산이 필요한 요청을 WAS의 8080번으로 넘기고, WAS는 DB의 3306번에 접속한다. WAS는 Web 서버에서 오는 8080번만, DB는 WAS에서 오는 3306번만 허용한다. 응답은 같은 길을 거꾸로 돌아가고, 상태 저장 방식이라 응답용 규칙은 필요 없다. 구간마다 경로, 허용 규칙, LISTEN 중인 프로그램이 모두 있어야 통한다.'}
],
quiz:[
{v:[
 {q:'방화벽이 하는 일은?',o:['규칙에 따라 통신을 허용하거나 막는다','이름을 IP 주소로 바꿔 준다','요청을 여러 서버에 나눠 준다','사설 IP를 공인 IP로 바꾼다'],e:'방화벽은 패킷을 규칙과 비교해서 통과시킬지 정합니다. 이름을 IP 주소로 바꾸는 것은 DNS, 요청을 나누는 것은 로드밸런서, 주소를 바꾸는 것은 NAT입니다.'},
 {q:'서버 앞의 Security Group은 열었는데 서버 안의 호스트 방화벽이 막고 있으면?',o:['통신이 되지 않는다. 방화벽이 여러 겹이면 모든 겹이 허용해야 한다','통신이 된다. 하나만 허용하면 충분하다','Security Group이 호스트 방화벽을 자동으로 끈다','응답만 막히고 요청은 전달된다'],e:'네트워크 방화벽, Security Group, 호스트 방화벽은 따로 동작합니다. 지나가는 길에 있는 모든 겹이 허용해야 통신이 됩니다.'}
]},
{v:[
 {q:'방화벽 규칙 한 줄을 이루는 항목으로 맞는 것은?',o:['방향, 프로토콜, 포트, 상대 주소, 동작(허용·거부)','사용자 이름, 비밀번호, 홈 디렉터리','도메인 이름, 레코드 종류, TTL','MAC 주소, VLAN ID, 스위치 포트'],e:'규칙은 "어느 방향으로, 어떤 프로토콜의, 몇 번 포트로, 어디서 오는(가는) 통신을, 허용할지 거부할지"를 적은 것입니다.'},
 {q:'인바운드 규칙 "TCP 443, 출발지 0.0.0.0/0, 허용"을 읽으면?',o:['어느 주소에서든 443번 포트로 들어오는 TCP 접속을 허용한다','이 서버가 밖의 443번 포트로 나가는 접속을 허용한다','0.0.0.0이라는 주소 하나에서 오는 접속만 허용한다','443번 포트로 오는 접속을 모두 거부한다'],e:'인바운드는 들어오는 접속이고, 0.0.0.0/0은 모든 주소입니다. 그래서 누구든 443번 포트로 접속할 수 있습니다.'}
]},
{v:[
 {q:'방화벽의 "기본 거부" 원칙이란?',o:['허용한다고 적지 않은 통신은 모두 막고, 필요한 것만 골라서 연다','모든 통신을 허용하고, 문제가 된 것만 골라서 막는다','모든 통신을 막아서 아무것도 통하지 않게 한다','관리자의 접속만 거부한다'],e:'기본 거부는 필요한 포트와 출발지만 최소한으로 여는 방식입니다. 권한을 필요한 만큼만 주는 최소 권한 원칙과 같습니다.'},
 {q:'문제를 해결하려고 "모든 포트, 모든 주소 허용" 규칙을 넣었다. 원인을 찾은 뒤에 해야 할 일은?',o:['그 규칙을 지우고, 필요한 포트와 출발지만 허용하는 규칙을 남긴다','그대로 둔다. 통신이 잘 되기 때문이다','모든 규칙을 지워서 처음 상태로 둔다','같은 규칙을 다른 서버에도 넣는다'],e:'모두 허용은 chmod 777과 같은 습관입니다. 원인을 찾았으면 필요한 규칙만 남깁니다.'}
]},
{v:[
 {q:'규칙에 순서가 있는 방화벽에서, 패킷에 맞는 규칙이 여러 개면 어느 것을 적용하나?',o:['위에서부터 비교해서 처음 맞는 규칙','맨 아래에 있는 규칙','허용 규칙을 항상 먼저','맞는 규칙을 모두 합쳐서'],e:'순서가 있는 방화벽은 위에서부터 비교해서 처음 맞는 규칙 하나를 적용합니다. 그래서 "모두 거부"는 맨 아래에 둡니다.'},
 {q:'순서가 있는 방화벽에서 "모두 거부" 규칙을 맨 위에 두면?',o:['모든 통신이 그 규칙에 먼저 걸려서, 아래의 허용 규칙이 쓰이지 않는다','아래의 허용 규칙이 먼저 적용된다','아무 영향이 없다','허용 규칙과 합쳐져서 절반만 허용된다'],e:'위에서부터 처음 맞는 규칙을 적용하므로, 맨 위의 "모두 거부"가 모든 통신을 막습니다.'}
]},
{v:[
 {q:'상태 저장(Stateful) 방화벽에서, 허용된 접속의 응답 패킷은?',o:['방화벽이 그 연결을 기억하고 있어서 규칙을 다시 따지지 않고 통과한다','응답을 허용하는 규칙이 따로 있어야 통과한다','항상 차단된다','암호화되어 있을 때만 통과한다'],e:'상태 저장 방화벽은 규칙에 맞아 통과시킨 연결을 기억합니다. 그 연결의 응답은 자동으로 통과합니다.'},
 {q:'상태 저장 방화벽에서 웹 서버가 사용자의 접속을 받게 하려면 어떤 규칙이 필요한가?',o:['웹 서버의 인바운드에 443번 포트 허용 한 줄','인바운드 443 허용과, 응답을 위한 아웃바운드 임시 포트 전체 허용','아웃바운드 443 허용 한 줄','인바운드와 아웃바운드를 모두 "모두 허용"으로'],e:'접속을 시작하는 방향만 적으면 됩니다. 사용자가 서버에 접속하는 것이므로 서버의 인바운드 규칙 한 줄이면 되고, 응답은 자동으로 나갑니다.'},
 {q:'상태 저장 방식이 없다면 응답을 위해 넓은 포트 범위를 열어야 하는 이유는?',o:['응답이 돌아가는 클라이언트의 임시 포트가 접속할 때마다 달라서','응답은 항상 1번 포트로 가서','응답은 포트를 쓰지 않아서','응답의 출발지 IP 주소가 매번 바뀌어서'],e:'응답의 목적지는 클라이언트가 접속할 때 쓴 임시 포트입니다. 어떤 번호가 될지 미리 알 수 없으므로, 연결을 기억하지 못하는 방화벽은 범위를 통째로 열어야 합니다.'}
]},
{v:[
 {q:'방화벽이 패킷을 DROP으로 처리하면 접속하는 쪽에는 어떻게 보이나?',o:['답이 없어서 한참 뒤에 timed out이 된다','바로 refused가 된다','이름을 찾을 수 없다고 나온다','정상으로 접속된다'],e:'DROP은 말없이 버리는 것이라 접속하는 쪽은 답을 받지 못합니다. REJECT는 거절하는 답을 보내서 바로 refused가 됩니다.'},
 {q:'방화벽의 DROP과 REJECT의 차이는?',o:['DROP은 말없이 버리고, REJECT는 거절한다는 답을 보낸다','DROP은 허용이고, REJECT는 거부다','DROP은 인바운드에만, REJECT는 아웃바운드에만 쓴다','둘은 같은 동작의 다른 이름이다'],e:'둘 다 통신을 막지만 방식이 다릅니다. 접속하는 쪽에는 DROP이 timed out으로, REJECT가 refused로 보입니다.'}
]},
{v:[
 {q:'Security Group에 대한 설명으로 맞는 것은?',o:['허용 규칙만 적고, 적지 않은 통신은 기본으로 차단된다','거부 규칙만 적고, 적지 않은 통신은 기본으로 허용된다','한 번 만들면 규칙을 바꿀 수 없다','DNS 조회만 통제한다'],e:'Security Group은 허용할 통신만 적는 방식입니다. 규칙에 없는 통신은 차단됩니다.'},
 {q:'Security Group은 어디에 붙여서 쓰나?',o:['VM의 네트워크 인터페이스. 그 VM으로 드나드는 통신을 통제한다','인터넷 전체','DNS 서버에만','스위치의 케이블마다'],e:'Security Group은 VM(정확히는 네트워크 인터페이스)에 붙입니다. 같은 Subnet의 VM끼리도 Security Group이 허용해야 통신할 수 있습니다.'}
]},
{v:[
 {q:'Security Group의 Inbound 규칙 "TCP 22 ← 10.0.1.5/32"를 읽으면?',o:['10.0.1.5 한 대에서 22번 포트로 오는 접속만 허용한다','10.0.1.0 ~ 10.0.1.255에서 오는 접속을 허용한다','이 서버가 10.0.1.5의 22번 포트로 나가는 접속을 허용한다','22번 포트로 오는 접속을 모두 허용한다'],e:'/32는 주소 한 개입니다. Inbound 규칙의 상대 주소는 출발지이므로, 10.0.1.5에서 오는 22번 접속만 허용합니다.'},
 {q:'Security Group 규칙의 "상대 주소"는 방향에 따라 무엇을 뜻하나?',o:['Inbound에서는 출발지, Outbound에서는 목적지','Inbound에서는 목적지, Outbound에서는 출발지','어느 방향이든 이 서버 자신의 주소','어느 방향이든 기본 게이트웨이의 주소'],e:'Inbound는 들어오는 접속이므로 어디서 오는지(출발지)를, Outbound는 나가는 접속이므로 어디로 가는지(목적지)를 적습니다.'},
 {q:'Web 서버의 Security Group에 Inbound 규칙이 "TCP 80 ← 10.0.1.0/24" 하나뿐이다. 인터넷의 사용자가 이 서버의 80번 포트로 직접 접속하면?',o:['차단된다. 10.0.1.0/24에서 오는 접속만 허용하기 때문이다','허용된다. 80번 포트가 열려 있기 때문이다','허용된다. 응답 통신이기 때문이다','거부 규칙이 없으므로 허용된다'],e:'허용 규칙의 출발지 범위(10.0.1.0 ~ 10.0.1.255) 밖에서 오는 접속은 맞는 규칙이 없어서 차단됩니다.'}
]},
{gen(){
  const R=n=>Math.floor(Math.random()*n), N=['203.0.113','198.51.100','192.0.2'], i=R(3), net=N[i], other=N[(i+1+R(2))%3], h=()=>2+R(250), k=R(4);
  const src=[other+'.'+h(), net+'.'+h(), other+'.'+h(), [net,other][R(2)]+'.'+h()][k], port=[443,22,22,[80,3306,8080][R(3)]][k];
  const A='허용된다. ① 규칙에 맞는다', B='허용된다. ② 규칙에 맞는다', C='차단된다. 맞는 허용 규칙이 없다', D='허용된다. 응답 통신이라 규칙이 필요 없다';
  const ans=[A,B,C,C][k];
  const why=['443번 포트는 ① 규칙이 모든 주소(0.0.0.0/0)에 열어 두었습니다.', '22번 포트는 ② 규칙이 '+net+'.0 ~ '+net+'.255에서 오는 접속을 허용하고, '+src+'는 그 범위 안입니다.', '22번 포트는 ② 규칙이 '+net+'.0 ~ '+net+'.255에서 오는 접속만 허용하는데, '+src+'는 그 범위 밖입니다. ① 규칙은 443번 포트에만 해당합니다.', port+'번 포트를 허용하는 규칙이 없습니다. 규칙에 적지 않은 통신은 차단됩니다.'][k];
  return {q:'Security Group의 Inbound 규칙이 두 줄이다. ① TCP 443 ← 0.0.0.0/0, ② TCP 22 ← '+net+'.0/24. 출발지 '+src+'에서 이 서버의 TCP '+port+'번 포트로 새로 접속하면? (규칙 가운데 하나라도 맞으면 허용, 맞는 규칙이 없으면 차단)',
    o:[ans].concat([A,B,C,D].filter(x=>x!==ans)),
    e:why+' 밖에서 새로 시작한 접속이므로 응답 통신도 아닙니다.'};
}},
{v:[
 {q:'SSH의 22번 포트를 0.0.0.0/0으로 열어 두면 안 되는 이유는?',o:['인터넷 전체에서 접속 시도가 들어와서 공격에 노출되기 때문에','22번 포트는 원래 열 수 없는 포트이기 때문에','SSH가 암호화되지 않기 때문에','응답이 돌아오지 못하기 때문에'],e:'0.0.0.0/0은 모든 주소입니다. 관리용 접속은 회사의 공인 IP 대역이나 관리자의 주소 하나로만 엽니다.'},
 {q:'Bastion 호스트의 역할은?',o:['Private 영역의 서버에 관리자가 접속할 때 거쳐 가는 관리용 서버','웹 요청을 여러 서버에 나눠 주는 장비','이름을 IP 주소로 바꿔 주는 서버','인증서를 발급하는 기관'],e:'Bastion 호스트를 Public 영역에 한 대만 두면, 인터넷에 SSH가 열린 서버가 그 한 대로 줄어듭니다. 안쪽 서버는 Bastion에서 오는 22번 접속만 허용합니다.'},
 {q:'Bastion 호스트를 쓰는 구성에서, Private 영역에 있는 서버의 22번 포트 규칙은?',o:['Bastion 호스트에서 오는 접속만 허용한다','모든 주소에서 오는 접속을 허용한다','관리자의 집 주소에서 오는 접속을 허용한다','22번 포트는 열지 않는다'],e:'관리자는 Bastion을 거쳐서 들어오므로, 안쪽 서버는 Bastion에서 오는 22번 접속만 허용하면 됩니다.'}
]},
{v:[
 {q:'HTTP 요청의 첫 줄 "GET /orders HTTP/1.1"에 들어 있는 것은?',o:['메서드, 경로, HTTP 버전','상태 코드, 경로, 포트 번호','출발지 IP 주소, 목적지 IP 주소, 포트 번호','인증서, 공개키, 유효 기간'],e:'요청의 첫 줄은 무엇을 하려는지(메서드 GET), 무엇을 요청하는지(경로 /orders), HTTP 버전입니다. 상태 코드는 응답의 첫 줄에 있습니다.'},
 {q:'HTTP 요청의 Host 헤더가 알려 주는 것은?',o:['어느 이름의 사이트로 온 요청인지','요청을 보낸 사용자의 비밀번호','응답의 결과','거쳐 온 라우터의 수'],e:'서버 한 대나 로드밸런서 하나가 여러 이름의 사이트를 함께 받을 때 Host 헤더로 구분합니다. L7 로드밸런서도 이 값을 보고 나눌 수 있습니다.'}
]},
{v:[
 {q:'HTTP 상태 코드에서 4xx와 5xx의 차이는?',o:['4xx는 요청 쪽의 문제, 5xx는 서버 쪽의 문제','4xx는 성공, 5xx는 실패','4xx는 서버 쪽의 문제, 5xx는 요청 쪽의 문제','4xx는 다른 주소로 가라는 안내, 5xx는 성공'],e:'4xx는 없는 주소를 요청했거나(404) 권한이 없는(403) 것처럼 요청 쪽의 문제입니다. 5xx는 서버 쪽에서 처리하지 못한 것입니다.'},
 {q:'http로 접속했더니 https 주소로 자동으로 옮겨졌다. 이때 서버가 보낸 상태 코드의 범위는?',o:['3xx (다른 주소로 가라는 안내)','2xx (성공)','4xx (요청 쪽의 문제)','5xx (서버 쪽의 문제)'],e:'3xx는 "다른 주소로 가라"는 안내입니다. http로 온 요청을 https로 보낼 때 301이나 302를 흔히 씁니다.'},
 {q:'브라우저에 상태 코드가 5xx로 나왔다. 여기서 알 수 있는 것은?',o:['서버까지 요청은 도착했고, 서버 쪽에서 처리하지 못했다','DNS 조회에 실패했다','방화벽이 요청을 버렸다','주소를 잘못 입력했다'],e:'상태 코드가 왔다는 것은 DNS 조회, TCP 연결, 포트까지는 통과했다는 뜻입니다. 5xx는 그 뒤의 서버 쪽 문제입니다.'}
]},
{v:[
 {q:'HTTP와 HTTPS의 차이는?',o:['HTTPS는 HTTP를 TLS로 암호화해서 주고받는다','HTTPS는 HTTP보다 항상 빠르다','HTTPS는 TCP를 쓰지 않는다','HTTPS는 포트 번호를 쓰지 않는다'],e:'HTTPS는 HTTP를 TLS로 감싼 것입니다. 기본 포트는 HTTP가 80, HTTPS가 443입니다.'},
 {q:'HTTP로 로그인하면 위험한 이유는?',o:['요청이 암호화되지 않아서, 중간에서 아이디와 비밀번호를 읽을 수 있기 때문에','HTTP는 로그인 기능을 지원하지 않기 때문에','HTTP는 응답을 돌려주지 않기 때문에','HTTP는 방화벽을 통과할 수 없기 때문에'],e:'HTTP는 요청과 응답이 글자 그대로 네트워크를 지나갑니다. 중간에서 볼 수 있으면 내용을 읽고 바꿀 수 있습니다.'}
]},
{v:[
 {q:'TLS가 해 주는 세 가지는?',o:['암호화, 무결성, 인증','압축, 캐시, 분배','라우팅, 주소 변환, 이름 조회','백업, 복제, 복구'],e:'TLS는 내용을 읽을 수 없게 하고(암호화), 바뀌면 알아채고(무결성), 상대가 진짜 그 서버인지 확인합니다(인증).'},
 {q:'TLS의 "인증"이 확인해 주는 것은?',o:['접속한 상대가 진짜 그 이름의 서버인지','사용자의 비밀번호가 맞는지','통신 속도가 충분한지','방화벽 규칙이 맞는지'],e:'암호화만으로는 가짜 서버를 걸러 낼 수 없습니다. 서버가 인증서를 내보이고 브라우저가 그것을 확인해서, 진짜 그 이름의 서버인지 확인합니다.'}
]},
{v:[
 {q:'TLS 인증서에 들어 있는 것은?',o:['도메인 이름, 서버의 공개키, 발급 기관(CA)의 서명, 유효 기간','서버의 개인키와 관리자 비밀번호','방화벽 규칙의 목록','사용자의 접속 기록'],e:'인증서는 "이 이름의 서버가 맞다"를 CA가 서명으로 보증한 문서입니다. 개인키는 서버만 가지고 있고 인증서에는 들어 있지 않습니다.'},
 {q:'브라우저가 서버의 인증서를 받고 확인하는 것이 아닌 것은?',o:['서버의 CPU 사용률','접속하려는 이름과 인증서의 이름이 같은지','유효 기간 안인지','믿을 수 있는 CA가 서명했는지'],e:'브라우저는 이름, 유효 기간, 서명한 CA 세 가지를 확인합니다. 하나라도 맞지 않으면 경고를 띄웁니다.'},
 {q:'어제까지 잘 열리던 https 사이트에 오늘 갑자기 인증서 경고가 뜬다. 가장 먼저 확인할 것은?',o:['인증서의 유효 기간이 지났는지','서버의 디스크가 가득 찼는지','DNS 레코드의 TTL','사용자의 임시 포트 번호'],e:'갑자기 뜨기 시작한 인증서 경고는 유효 기간 만료가 흔한 원인입니다. 그 밖에 이름 불일치, 믿을 수 없는 발급 기관, PC의 날짜 오류도 원인이 될 수 있습니다.'}
]},
{v:[
 {q:'https 주소에 접속할 때 일어나는 순서로 맞는 것은?',o:['TCP 연결 → TLS 연결 → HTTP 요청','TLS 연결 → TCP 연결 → HTTP 요청','HTTP 요청 → TLS 연결 → TCP 연결','TCP 연결 → HTTP 요청 → TLS 연결'],e:'TCP 연결(3-way handshake)이 먼저 맺어지고, 그 위에서 TLS 연결을 맺은 다음, 암호화한 HTTP 요청을 보냅니다.'},
 {q:'443번 포트가 방화벽에 막혀 있으면 https 접속은 어떻게 되나?',o:['TCP 연결부터 맺어지지 않아서, TLS와 HTTP는 시작도 하지 못한다','TLS 연결은 되지만 HTTP 요청만 실패한다','인증서 경고가 뜬다','http로 자동으로 바뀌어 접속된다'],e:'TLS와 HTTP는 TCP 연결 위에서 동작합니다. 포트가 막히면 첫 단계인 TCP 연결에서 멈춥니다.'}
]},
{v:[
 {q:'"TLS 종료"란?',o:['로드밸런서 같은 앞단 장비가 TLS 암호화를 풀고, 뒤쪽 서버와는 따로 통신하는 구성','인증서의 유효 기간이 끝나는 것','브라우저가 접속을 끊는 것','TLS를 쓰지 않도록 설정하는 것'],e:'로드밸런서가 인증서를 가지고 TLS를 풀면, 인증서를 한 곳에서 관리할 수 있고 로드밸런서가 HTTP 내용을 볼 수 있습니다.'},
 {q:'L7 로드밸런서가 HTTPS 요청의 경로를 보고 나누려면 무엇이 필요한가?',o:['로드밸런서가 TLS를 풀어서(TLS 종료) 요청 내용을 읽을 수 있어야 한다','로드밸런서가 포트 번호만 볼 수 있으면 된다','Web 서버가 로드밸런서에 경로를 미리 알려 줘야 한다','사용자가 http로 접속해야 한다'],e:'HTTPS의 내용은 암호화되어 있습니다. 경로나 헤더를 보려면 로드밸런서가 TLS를 풀어야 합니다.'}
]},
{v:[
 {q:'주소의 경로에 따라 서로 다른 서버 묶음으로 요청을 보낼 수 있는 로드밸런서는?',o:['L7 로드밸런서(ALB). HTTP 요청의 내용을 보기 때문이다','L4 로드밸런서(NLB). IP 주소와 포트를 보기 때문이다','둘 다 할 수 있다','둘 다 할 수 없다'],e:'경로는 HTTP 요청 안에 있습니다. HTTP 내용을 읽는 L7 로드밸런서만 경로를 보고 나눌 수 있습니다.'},
 {q:'HTTP가 아닌 TCP 통신을 여러 서버에 나눠 주려면 어떤 로드밸런서를 쓰나?',o:['L4 로드밸런서(NLB)','L7 로드밸런서(ALB)','어떤 로드밸런서도 쓸 수 없다','DNS 서버'],e:'L4 로드밸런서는 IP 주소와 포트만 보고 TCP·UDP 연결을 나눠 주므로, HTTP가 아닌 통신에도 쓸 수 있습니다.'}
]},
{v:[
 {q:'로드밸런서의 Listener란?',o:['로드밸런서가 요청을 기다리는 포트와 프로토콜','요청을 나눠 받을 서버 묶음','서버가 살아 있는지 확인하는 기능','인증서를 발급하는 기관'],e:'Listener로 들어온 요청이 Target Group의 서버로 전달됩니다. 예를 들어 "HTTPS 443"이 Listener입니다.'},
 {q:'로드밸런서의 Target Group이란?',o:['요청을 나눠 받을 서버 묶음과 그 포트','로드밸런서가 요청을 기다리는 포트','방화벽 규칙의 묶음','사용자의 접속 기록'],e:'Target Group에는 요청을 받을 서버들이 들어 있습니다. 로드밸런서는 그 가운데 Health Check를 통과한 서버로 보냅니다.'},
 {q:'Target Group의 서버 한 대가 Health Check에 계속 실패하면 로드밸런서는?',o:['그 서버로는 요청을 보내지 않고, 나머지 서버로만 보낸다','모든 서버로 가는 요청을 멈춘다','그 서버로 요청을 더 많이 보낸다','그 서버를 자동으로 다시 설치한다'],e:'Health Check는 대상 서버가 살아 있는지 주기적으로 확인하는 기능입니다. 실패한 서버는 분배 대상에서 빠집니다.'}
]},
{v:[
 {q:'웹 요청 한 번이 지나는 순서로 맞는 것은?',o:['DNS 조회 → 로드밸런서 → Web 서버 → WAS → DB','로드밸런서 → DNS 조회 → DB → WAS → Web 서버','Web 서버 → 로드밸런서 → DNS 조회 → DB → WAS','DNS 조회 → DB → WAS → Web 서버 → 로드밸런서'],e:'이름을 IP 주소로 바꾼 뒤(DNS), 로드밸런서, Web 서버, WAS, DB 순서로 지나가고 응답은 거꾸로 돌아옵니다.'},
 {q:'로드밸런서 뒤에 있는 Web 서버의 80번 포트 규칙으로 알맞은 것은?',o:['로드밸런서에서 오는 접속만 허용한다','모든 주소에서 오는 접속을 허용한다','DB에서 오는 접속만 허용한다','80번 포트는 열지 않는다'],e:'사용자는 로드밸런서에만 접속합니다. Web 서버는 로드밸런서에서 오는 80번 접속만 받으면 됩니다.'},
 {q:'어떤 구간의 통신이 되려면 갖춰져야 하는 세 가지는?',o:['가는 경로, 허용하는 규칙, 그 포트를 LISTEN 중인 프로그램','인증서, 개인키, 비밀번호','VLAN ID, MAC 주소, 스위치 포트','도메인 이름, TTL, 레코드 종류'],e:'경로가 있고(라우팅), 규칙이 허용하고(방화벽·Security Group), 받는 프로그램이 그 포트에서 기다려야 합니다. 셋 중 하나라도 빠지면 통하지 않습니다.'}
]}
]
});
