OJT.lesson({
id:'zc6', week:6, tag:'zCompute 6', mins:'약 5시간',
title:'Load Balancing (실습 과제 2): ALB·NLB, Listener, Target Group, Health Check',
cover:[['Load Balancer','s1'],['구성 요소','s2'],['ALB와 NLB','s3'],['Listener와 규칙','s4'],['Target Group','s5'],['Health Check','s6'],['LB의 Security Group','s7'],['Web 2대 이중화','s8'],['Auto Scaling','s9'],['직접 해 보기','s10']],
act:'Web VM 2대 앞에 Load Balancer를 두고, 1대를 중지했을 때 서비스가 이어지는지 확인',
goal:['Load Balancer가 요청을 Listener, 규칙, Target Group 순서로 전달하는 과정을 설명할 수 있다','ALB와 NLB의 차이와 쓰임을 설명할 수 있다','Health Check의 항목을 읽고 대상이 제외되는 조건을 설명할 수 있다','Standard와 Managed Security Group의 차이를 설명할 수 있다','Web 2대 이중화를 구성하고 1대를 중지해 서비스 상태를 확인할 수 있다'],
terms:[
['Load Balancer','Load Balancer (LB)','받은 요청을 여러 대상으로 나누어 보내는 서비스.'],
['ALB','Application Load Balancer','HTTP·HTTPS 요청을 보고 나누는 L7 로드밸런서.'],
['NLB','Network Load Balancer','애플리케이션 프로토콜과 관계없이 TCP 연결 단위로 나누는 L4 로드밸런서.'],
['Listener','Listener','LB가 요청을 받는 프로토콜과 포트. 받은 요청을 규칙에 따라 처리한다.'],
['규칙','Rule','조건에 맞는 요청에 할 동작을 정한 것. 순서대로 비교하고 마지막 규칙이 기본 규칙이다.'],
['Forward','Forward','요청을 Target Group으로 보내는 동작.'],
['Redirect','Redirect','요청을 다른 주소로 보내라고 응답하는 동작.'],
['Fixed Response','Fixed Response','정해 둔 상태 코드와 내용으로 LB가 직접 응답하는 동작.'],
['Target Group','Target Group','LB가 요청을 보낼 대상의 묶음. 프로토콜, 포트, Health Check를 가진다.'],
['Target','Target','Target Group에 등록한 VM이나 IP 주소.'],
['Health Check','Health Check','LB가 대상이 정상인지 주기적으로 검사하는 것.'],
['Healthy Threshold','Healthy Threshold','연속 몇 번 성공하면 정상으로 판정할지 정한 값.'],
['Unhealthy Threshold','Unhealthy Threshold','연속 몇 번 실패하면 실패로 판정할지 정한 값.'],
['Sticky Session','Sticky Session','같은 사용자의 요청을 정해진 시간 동안 같은 대상으로 보내는 설정.'],
['인증서','SSL Certificate','HTTPS Listener가 TLS 연결에 쓰는 인증서와 개인키.'],
['Managed Security Group','Managed Security Group','LB 서비스가 만들고 Listener 포트를 모든 출발지에 여는 Security Group.'],
['High Availability','High Availability','대기용 LB를 두어 LB에 장애가 나면 자동으로 바꾸는 설정.'],
['Auto Scaling Group','Auto Scaling Group','조건에 따라 VM 수를 자동으로 늘리거나 줄이는 그룹.']
],
body:`
<h2 id="s1">Load Balancer</h2>
<p><b>Load Balancer</b>(LB)는 받은 요청을 여러 VM으로 나누어 보내는 서비스다. 같은 일을 하는 VM을 여러 대 두면 두 가지를 얻는다.</p>
<ul><li><b>부하 분산</b>: 요청을 나누어 처리하므로 한 대에 몰리지 않는다.</li><li><b>장애 대비</b>: 한 대가 멈춰도 나머지 VM이 요청을 받는다.</li></ul>
<p>zCompute의 LB는 플랫폼이 만드는 내부 VM으로 동작한다. 그래서 LB를 만들 때 <b>Instance Type</b>을 고르고, LB의 내부 자원은 사용자가 지우거나 바꾸지 못하게 보호된다. <b>High Availability</b>를 켜면 대기용 LB를 함께 만들어 LB에 장애가 났을 때 자동으로 바꾼다.</p>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><p>LB 기능은 시스템 관리자가 먼저 켜고 설정해야 쓸 수 있다. 실습 Project에서 LB를 만들 수 있는지 확인한다.</p></div>

<h2 id="s2">구성 요소</h2>
<p>요청은 <b>LB → Listener → 규칙 → Target Group → Target</b> 순서로 전달된다.</p>
<svg class="fig" viewBox="0 0 560 260" role="img" aria-label="사용자의 요청이 Elastic IP가 붙은 ALB에 도착하고, HTTP 80번 Listener의 규칙이 요청을 Target Group web-tg로 Forward한다. Target Group에는 Web 1과 Web 2가 있고, LB는 Health Check로 두 서버를 검사한다.">
<use href="#i-pc" x="12" y="92" width="56" height="56"/><text x="40" y="172" class="c b">사용자</text>
<line x1="70" y1="120" x2="112" y2="120" class="ln acc" marker-end="url(#ar-acc)"/>
<use href="#i-lb" x="116" y="92" width="56" height="56" class="acc"/><text x="144" y="172" class="c b">ALB</text><text x="144" y="196" class="c t-m">Elastic IP</text>
<line x1="174" y1="120" x2="212" y2="120" class="ln acc" marker-end="url(#ar-acc)"/>
<rect x="216" y="86" width="118" height="68" rx="8" class="bx-a"/><text x="275" y="114" class="c b">Listener</text><text x="275" y="140" class="c t-m">HTTP:80</text>
<line x1="336" y1="120" x2="384" y2="120" class="ln acc" marker-end="url(#ar-acc)"/>
<rect x="388" y="14" width="164" height="232" rx="10" class="zone"/><text x="470" y="40" class="c b t-m">Target Group</text><text x="470" y="62" class="c t-s">web-tg</text>
<use href="#i-server" x="404" y="86" width="50" height="50"/><text x="429" y="156" class="c t-m">Web 1</text>
<use href="#i-server" x="486" y="86" width="50" height="50"/><text x="511" y="156" class="c t-m">Web 2</text>
<text x="470" y="198" class="c t-m t-acc">Health Check</text><text x="470" y="222" class="c t-s">GET / → 200</text>
</svg>
<div class="tbl-wrap"><table><thead><tr><th>구성 요소</th><th>정하는 것</th></tr></thead><tbody>
<tr><td class="nw"><b>Load Balancer</b></td><td>종류(ALB·NLB), VPC와 Subnet, Elastic IP, Security Group</td></tr>
<tr><td class="nw"><b>Listener</b></td><td>요청을 받는 프로토콜과 포트, 규칙</td></tr>
<tr><td class="nw"><b>Target Group</b></td><td>대상, 대상의 프로토콜과 포트, Health Check</td></tr>
</tbody></table></div>
<p>LB의 상태(Active, Degraded, Error 등)는 LB 자체의 상태다. <mark>대상 VM이 정상인지는 LB 상태가 아니라 Target Group의 Health Check 결과로 본다.</mark></p>

<h2 id="s3">ALB와 NLB</h2>
<div class="tbl-wrap"><table><thead><tr><th></th><th>ALB</th><th>NLB</th></tr></thead><tbody>
<tr><td class="nw"><b>계층</b></td><td>L7</td><td>L4</td></tr>
<tr><td class="nw"><b>나누는 기준</b></td><td>HTTP·HTTPS 요청</td><td>TCP 연결(애플리케이션 프로토콜과 무관)</td></tr>
<tr><td class="nw"><b>Listener 프로토콜</b></td><td>HTTP, HTTPS</td><td>TCP</td></tr>
<tr><td class="nw"><b>규칙</b></td><td>경로, 호스트, 헤더 등으로 나눌 수 있다</td><td>기본 규칙 하나(Forward)</td></tr>
<tr><td class="nw"><b>참조 아키텍처</b></td><td>Public Tier에서 사용자 요청을 받아 Web으로</td><td>Private Tier에서 Web의 요청을 받아 WAS로</td></tr>
</tbody></table></div>
<p>HTTP 요청의 내용을 보고 나눠야 하면 ALB를, HTTP가 아니거나 연결 단위로만 나누면 되면 NLB를 쓴다.</p>

<h2 id="s4">Listener와 규칙</h2>
<p>LB에는 Listener가 하나 이상 있어야 한다. Listener는 <b>프로토콜과 포트</b>로 요청을 받고, 규칙을 <b>위에서부터 순서대로</b> 비교해 처음 맞는 규칙의 동작을 실행한다. 마지막 규칙은 <b>기본 규칙</b>으로, 앞의 규칙에 맞지 않은 요청을 처리한다.</p>
<div class="tbl-wrap"><table><thead><tr><th>ALB 규칙의 조건</th><th>ALB 규칙의 동작</th></tr></thead><tbody>
<tr><td>Path(경로), Host(호스트 이름), Header, Method, IP(출발지 CIDR)</td><td><b>Forward</b>: Target Group으로 보낸다<br><b>Redirect</b>: 다른 주소로 가라고 응답한다<br><b>Fixed Response</b>: 정해 둔 응답을 LB가 직접 보낸다</td></tr>
</tbody></table></div>
<p>NLB의 Listener는 TCP만 쓰고, 기본 규칙 하나로 Target Group에 Forward한다.</p>
<p><b>HTTPS</b> Listener는 TLS 연결에 쓸 <b>기본 인증서</b>가 필요하다. 인증서와 개인키를 플랫폼에 먼저 가져와(Import) 두고 Listener에서 고른다.</p>

<h2 id="s5">Target Group</h2>
<p><b>Target Group</b>은 LB가 요청을 보낼 대상의 묶음이다.</p>
<ul><li><b>Protocol</b>: ALB용은 HTTP, NLB용은 TCP다.</li><li><b>Default Port</b>: 대상이 요청을 받는 포트다. Listener 포트와 달라도 된다.</li><li><b>Target Type</b>: <b>Instance</b>(VM을 고름) 또는 <b>IP</b>(주소를 적음). 한 Target Group의 대상은 모두 같은 유형이어야 한다.</li><li><b>Sticky Session</b>: 켜면 같은 사용자의 요청을 정한 시간 동안 같은 대상으로 보낸다.</li></ul>

<h2 id="s6">Health Check</h2>
<p><b>Health Check</b>는 LB가 대상에 주기적으로 요청을 보내 정상인지 보는 검사다. 실패로 판정된 대상에는 요청을 보내지 않는다.</p>
<div class="tbl-wrap"><table><thead><tr><th>항목</th><th>뜻</th></tr></thead><tbody>
<tr><td class="nw"><b>Port</b></td><td>Traffic Port(대상의 포트) 또는 따로 정한 포트</td></tr>
<tr><td class="nw"><b>Interval</b></td><td>검사 간격(초)</td></tr>
<tr><td class="nw"><b>Timeout</b></td><td>응답을 기다리는 시간(초). 넘으면 실패</td></tr>
<tr><td class="nw"><b>Healthy Threshold</b></td><td>연속 몇 번 성공하면 정상으로 판정</td></tr>
<tr><td class="nw"><b>Unhealthy Threshold</b></td><td>연속 몇 번 실패하면 실패로 판정</td></tr>
<tr><td class="nw"><b>Path · HTTP Code</b></td><td>HTTP 검사에서 요청할 경로와 정상으로 볼 응답 코드(예: <code>200</code>, <code>200-399</code>)</td></tr>
</tbody></table></div>
<p>Interval이 10초이고 Unhealthy Threshold가 3이면, 대상이 멈춘 뒤 대략 10 × 3 = <b>30초</b> 안팎에 실패로 판정된다. 그동안 그 대상으로 간 요청은 실패할 수 있다.</p>

<h2 id="s7">LB의 Security Group</h2>
<p>LB를 만들 때 Security Group 방식을 고른다. <b>만든 뒤에는 바꿀 수 없다.</b></p>
<div class="tbl-wrap"><table><thead><tr><th>방식</th><th>Listener 포트</th></tr></thead><tbody>
<tr><td class="nw"><b>Standard</b></td><td>사용자가 고른 Security Group을 쓴다. Listener 포트를 열고 출발지를 제한하는 일은 사용자가 한다.</td></tr>
<tr><td class="nw"><b>Managed</b></td><td>LB 서비스가 만든다. Listener 포트가 <b>모든 출발지</b>에 자동으로 열린다.</td></tr>
</tbody></table></div>
<p>출발지를 좁혀야 하면 Standard를 쓴다. 대상 VM의 Security Group은 LB에서 오는 요청만 받도록 연다.</p>
<div class="tbl-wrap"><table><thead><tr><th>Security Group</th><th>Ingress</th><th>출발지</th></tr></thead><tbody>
<tr><td class="nw"><b>alb-sg</b></td><td>TCP 80</td><td>실습 중에는 내 공인 IP의 /32</td></tr>
<tr><td class="nw"><b>web-sg</b></td><td>TCP 80</td><td>alb-sg</td></tr>
<tr><td class="nw"><b>web-sg</b></td><td>TCP 22</td><td>설치하는 동안만 내 공인 IP의 /32. 끝나면 규칙을 지운다</td></tr>
</tbody></table></div>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><p>LB 뒤의 Web 서버가 보는 출발지 주소(가이드에 적혀 있지 않다). Web 서버의 access log에서 요청의 출발지가 LB의 주소인지 사용자의 주소인지 확인한다.</p></div>

<h2 id="s8">Web 2대 이중화</h2>
<p>실습 과제 2는 회사 참조 아키텍처의 Public Tier를 작게 만든 것이다. Web VM 2대를 Public Subnet에 둔다. Web 서버를 설치하는 동안만 각 VM에 Elastic IP를 잠시 붙이고 22번을 내 공인 IP의 /32로만 열어 SSH로 접속한다. 설치와 확인이 끝나면 Elastic IP를 떼고 22번 규칙을 지운 뒤, 사용자의 요청은 ALB로만 받는다.</p>
<div class="flow"><div class="n"><b>VPC·Subnet</b></div><span class="ar">→</span><div class="n"><b>Web VM 2대</b><small>Nginx 설치</small></div><span class="ar">→</span><div class="n"><b>Target Group</b><small>Health Check</small></div><span class="ar">→</span><div class="n"><b>ALB</b><small>Listener·Elastic IP</small></div><span class="ar">→</span><div class="n k"><b>확인</b><small>1대 중지</small></div></div>
<ol><li>설치를 마친 VM에서 Elastic IP를 떼고 web-sg의 22번 규칙을 지운다.</li><li>두 VM의 첫 화면에 서로 다른 글자(예: <code>web1</code>, <code>web2</code>)를 넣어 어느 서버가 응답했는지 구분한다.</li><li>Target Group의 두 대상이 모두 정상인지 확인한 뒤, ALB의 Elastic IP로 여러 번 요청한다.</li><li>Web 1을 중지하고, Health Check가 실패로 판정할 시간이 지난 뒤 다시 여러 번 요청한다.</li><li>Web 1을 다시 시작해 정상으로 돌아오는지 본다. LB와 VM의 Events에서 상태 변화도 확인한다.</li></ol>
<pre class="code"><span class="c"># 두 대 모두 정상일 때 (203.0.113.20은 학습용 예시 주소)</span>
$ for i in 1 2 3 4; do curl -s http://203.0.113.20/; done
web1
web2
web1
web2
<span class="c"># Web 1 중지 후, 실패 판정 시간이 지난 뒤</span>
$ for i in 1 2 3 4; do curl -s http://203.0.113.20/; done
web2
web2
web2
web2</pre>
<svg class="fig" viewBox="0 0 560 230" role="img" aria-label="Web 1이 중지되어 Health Check에 실패하면 ALB는 Web 1로 요청을 보내지 않고, 정상인 Web 2로만 보낸다.">
<use href="#i-lb" x="30" y="86" width="56" height="56" class="acc"/><text x="58" y="166" class="c b">ALB</text>
<line x1="90" y1="104" x2="296" y2="66" class="ln bad dash"/>
<use href="#i-x" x="178" y="70" width="30" height="30" class="bad"/>
<line x1="90" y1="126" x2="296" y2="172" class="ln acc" marker-end="url(#ar-acc)"/>
<use href="#i-server" x="304" y="36" width="56" height="56" class="bad"/><text x="374" y="60" class="b">Web 1</text><text x="374" y="86" class="t-bad t-m">unhealthy · 제외됨</text>
<use href="#i-server" x="304" y="146" width="56" height="56"/><text x="374" y="170" class="b">Web 2</text><text x="374" y="196" class="t-good t-m">healthy · 요청 받음</text>
</svg>
<p>web2의 응답만 돌아오면 이중화가 동작한 것이다. 모든 요청이 실패하면 Target Group의 대상 상태, web-sg의 출발지, Health Check의 Path와 응답 코드를 차례로 확인한다.</p>
<p class="small muted">위 출력은 학습용 예시다. 응답 순서는 분산 방식에 따라 다를 수 있다. Elastic IP 없이 관리 접속하는 구성(Bastion)은 <a data-lesson="zc8"></a>에서 다룬다.</p>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><p>Elastic IP를 뗀 Web VM이 패키지 설치처럼 외부로 나가는 통신을 할 수 있는지. 나갈 수 없으면 설치는 Elastic IP를 붙인 동안에 끝낸다.</p></div>

<h2 id="s9">Auto Scaling</h2>
<p><b>Auto Scaling Group</b>은 VM 수를 자동으로 조절하는 그룹이다. 최소·최대·원하는 VM 수를 정해 두고, 장애가 난 VM은 새 VM으로 바꾸며, CPU 사용률이나 네트워크 트래픽이 정한 목표를 넘으면 VM을 늘리고 줄인다. 새 VM은 Launch Configuration(이미지, Instance Type, Key Pair, Security Group)으로 만들어지고, 그룹에 Target Group을 지정하면 새 VM이 그 Target Group에 들어가 바로 LB의 대상이 된다. 실습 과제 2에서는 VM 2대를 직접 만든다.</p>

<h2 id="s10">직접 해 보기</h2>
<p>ALB의 HTTP:80 Listener에 규칙이 다음 순서로 있다. (1) Path <code>/api/*</code> → api-tg로 Forward, (2) Path <code>/old/*</code> → Redirect, (3) 기본 규칙 → web-tg로 Forward. 요청 <code>/api/users</code>, <code>/index.html</code>, <code>/old/a.html</code>은 각각 어떻게 처리되는가? 또 web-tg의 Interval이 5초, Unhealthy Threshold가 4일 때 Web 1을 중지하면 대략 몇 초 뒤 실패로 판정되는가?</p>
<details class="fold"><summary>답 보기</summary><p><code>/api/users</code>는 규칙 1에 맞아 api-tg로, <code>/index.html</code>은 앞의 두 규칙에 맞지 않아 기본 규칙으로 web-tg로 간다. <code>/old/a.html</code>은 규칙 2에 맞아 Redirect 응답을 받는다. 실패 판정은 대략 5 × 4 = <b>20초</b> 뒤다.</p></details>
`,
summary:['Load Balancer는 요청을 여러 VM으로 나누어 부하를 분산하고 장애에 대비한다.','요청은 LB → Listener → 규칙 → Target Group → Target 순서로 전달된다.','ALB는 HTTP·HTTPS 요청을 보는 L7, NLB는 TCP 연결 단위로 나누는 L4다.','규칙은 위에서부터 비교하고, 마지막 규칙이 기본 규칙이다. HTTPS Listener에는 인증서가 필요하다.','Health Check에서 연속 실패가 Unhealthy Threshold에 이르면 대상은 요청에서 제외된다.','LB 상태는 LB 자체의 상태이고, 대상의 상태는 Health Check로 본다.','Standard Security Group은 사용자가 포트와 출발지를 정하고, Managed는 Listener 포트를 모든 출발지에 연다. 만든 뒤 바꿀 수 없다.','Web 1대를 중지해도 정상인 대상으로 요청이 가면 이중화가 동작한 것이다.'],
essay:[
{q:'사용자 요청이 ALB를 거쳐 Web VM에 닿기까지의 순서를 설명해 보세요.',a:'요청이 ALB의 Elastic IP로 들어오면 Listener가 프로토콜과 포트로 받는다. 규칙을 위에서부터 비교해 맞는 규칙의 Forward 동작으로 Target Group에 보내고, Target Group은 정상인 대상 VM 중 하나로 요청을 전달한다.'},
{q:'ALB와 NLB의 차이와 참조 아키텍처에서 각각의 위치를 설명해 보세요.',a:'ALB는 HTTP·HTTPS 요청을 보고 나누는 L7 로드밸런서로, Public Tier에서 사용자 요청을 받아 Web으로 보낸다. NLB는 TCP 연결 단위로 나누는 L4 로드밸런서로, Private Tier에서 Web의 요청을 WAS로 보낸다.'},
{q:'Health Check의 Interval과 Unhealthy Threshold로 실패 판정 시간을 설명해 보세요.',a:'Interval마다 검사하고 연속 실패가 Unhealthy Threshold만큼 쌓이면 실패로 판정한다. 그래서 대략 Interval × Unhealthy Threshold 뒤에 그 대상이 요청에서 제외된다.'},
{q:'LB 상태가 Active인데 서비스가 안 될 수 있는 이유는 무엇인가요?',a:'LB 상태는 LB 자체의 상태이고 대상의 상태를 반영하지 않는다. 대상이 모두 Health Check에 실패하면 LB는 Active여도 요청을 보낼 곳이 없다.'},
{q:'Standard와 Managed Security Group 중 무엇을 고를지 설명해 보세요.',a:'Managed는 Listener 포트를 모든 출발지에 자동으로 연다. 출발지를 제한해야 하면 Standard를 골라 직접 포트와 출발지를 정한다. 만든 뒤에는 바꿀 수 없으므로 처음에 정한다.'},
{q:'Web 2대 이중화가 동작하는지 확인하는 방법을 설명해 보세요.',a:'두 Web 서버의 응답을 구분할 수 있게 하고, LB 주소로 여러 번 요청해 두 서버가 모두 응답하는지 본다. 한 대를 중지하고 Health Check가 실패로 판정한 뒤에도 다른 서버의 응답이 오는지 확인하고, 다시 시작해 정상으로 돌아오는지 본다.'}
],
quiz:[
{v:[
 {q:'Load Balancer를 쓰는 이유로 맞는 것은?',o:['요청을 여러 VM으로 나누고, 한 대가 멈춰도 서비스를 이어 가기 위해','VM의 디스크 크기를 늘리기 위해','VM에 공인 IP를 주지 않기 위해 반드시 필요해서','DNS 이름을 만들기 위해'],e:'LB는 부하를 나누고 장애가 난 VM을 피해 요청을 보낸다.'},
 {q:'같은 Web VM을 여러 대 두고 LB 뒤에 놓았을 때 얻는 것은?',o:['부하 분산과 장애 대비','데이터 백업','VM 생성 속도 향상','패키지 자동 설치'],e:'여러 대가 요청을 나누어 받고, 한 대가 멈추면 나머지가 받는다.'}
]},
{v:[
 {q:'요청이 전달되는 순서로 맞는 것은?',o:['LB → Listener → 규칙 → Target Group → Target','Target Group → LB → Listener → Target','Listener → Target → LB → 규칙','규칙 → Target → Target Group → LB'],e:'Listener가 받은 요청을 규칙에 따라 Target Group으로 보내고, Target Group이 대상으로 전달한다.'},
 {q:'LB가 요청을 받는 프로토콜과 포트를 정하는 것은?',o:['Listener','Target Group','Health Check','Sticky Session'],e:'Listener가 프로토콜과 포트로 요청을 받는다.'}
]},
{v:[
 {q:'HTTP 요청의 경로를 보고 다른 Target Group으로 나눌 수 있는 LB는?',o:['ALB','NLB','둘 다 아니다','NAT GW'],e:'ALB는 L7에서 HTTP 요청의 경로, 호스트, 헤더 등을 보고 나눈다.'},
 {q:'NLB의 설명으로 맞는 것은?',o:['애플리케이션 프로토콜과 관계없이 TCP 연결 단위로 나누는 L4 로드밸런서','HTTP 경로로 나누는 L7 로드밸런서','DNS 응답으로 나누는 장치','VM을 자동으로 늘리는 기능'],e:'NLB는 TCP 연결 단위로 나눈다.'}
]},
{q:'회사 참조 아키텍처에서 Private Tier의 WAS 앞에 있는 LB는?',o:['NLB','ALB','Internet GW','Bastion'],e:'ALB는 Public Tier에서 Web 앞에, NLB는 Private Tier에서 WAS 앞에 있다.'},
{v:[
 {q:'Listener의 규칙을 처리하는 방식으로 맞는 것은?',o:['위에서부터 비교해 처음 맞는 규칙을 실행하고, 마지막 규칙이 기본 규칙이다','모든 규칙을 동시에 실행한다','가장 최근에 만든 규칙만 실행한다','무작위로 하나를 고른다'],e:'규칙은 순서대로 비교하고, 맞는 것이 없으면 마지막 기본 규칙이 처리한다.'},
 {q:'어떤 규칙의 조건에도 맞지 않는 요청을 처리하는 것은?',o:['기본 규칙','Health Check','Sticky Session','Managed Security Group'],e:'마지막 규칙인 기본 규칙이 나머지 요청을 처리한다.'}
]},
{q:'ALB 규칙의 동작 중 요청을 Target Group으로 보내는 것은?',o:['Forward','Redirect','Fixed Response','Drop'],e:'Forward는 Target Group으로 보낸다. Redirect는 다른 주소로 가라고 응답하고, Fixed Response는 LB가 직접 응답한다.'},
{q:'HTTPS Listener를 만들 때 필요한 것은?',o:['기본 인증서','Key Pair','Elastic IP 두 개','NAT GW'],e:'HTTPS Listener는 TLS 연결에 쓸 기본 인증서가 필요하다.'},
{v:[
 {q:'Target Group의 설명으로 맞는 것은?',o:['LB가 요청을 보낼 대상의 묶음으로, 프로토콜·포트·Health Check를 가진다','LB가 요청을 받는 포트','VM 수를 자동으로 조절하는 그룹','사용자 권한의 묶음'],e:'Target Group은 대상과 대상의 포트, Health Check를 정한다.'},
 {q:'한 Target Group의 대상에 대한 규칙으로 맞는 것은?',o:['대상은 모두 같은 유형(Instance 또는 IP)이어야 한다','Instance와 IP를 섞어야 한다','대상은 한 개만 넣을 수 있다','대상은 다른 Project의 VM이어야 한다'],e:'한 Target Group의 대상은 모두 같은 Target Type이어야 한다.'}
]},
{q:'Sticky Session을 켜면 일어나는 일은?',o:['같은 사용자의 요청이 정한 시간 동안 같은 대상으로 간다','모든 요청이 첫 번째 대상으로만 간다','Health Check가 꺼진다','HTTPS가 HTTP로 바뀐다'],e:'Sticky Session은 같은 사용자를 정한 시간 동안 같은 대상에 붙여 둔다.'},
{v:[
 {q:'Health Check에서 실패로 판정된 대상은 어떻게 되는가?',o:['LB가 그 대상에 요청을 보내지 않는다','VM이 자동으로 삭제된다','LB 상태가 바로 Error가 된다','Target Group에서 영구히 지워진다'],e:'실패한 대상은 요청에서 제외되고, 다시 정상으로 판정되면 요청을 받는다.'},
 {q:'Unhealthy Threshold의 뜻은?',o:['연속 몇 번 실패하면 실패로 판정할지','검사 사이의 간격','응답을 기다리는 시간','정상으로 볼 HTTP 코드'],e:'Unhealthy Threshold는 실패 판정에 필요한 연속 실패 횟수다.'}
]},
{gen(){
  const iv=[5,10,15,30][Math.floor(Math.random()*4)], th=[2,3,5][Math.floor(Math.random()*3)], up=Math.random()<0.5;
  const s=v=>v+'초';
  return {q:'Target Group의 Health Check가 Interval '+iv+'초, '+(up?'Healthy':'Unhealthy')+' Threshold '+th+'이다. '+(up?'멈췄던 대상이 다시 응답하기 시작한 뒤 정상으로 판정되기까지':'대상이 멈춘 뒤 실패로 판정되기까지')+' 대략 몇 초가 걸리는가? (판정 시간 = Interval × Threshold로 계산)',
    o:[s(iv*th),s(iv),s(iv+th),s(iv*(th+1))],
    e:'연속 '+th+'번의 검사가 '+iv+'초 간격으로 필요하므로 '+iv+' × '+th+' = '+(iv*th)+'초다.'};
}},
{q:'LB 상태가 Active일 때 알 수 있는 것은?',o:['LB 자체가 정상이라는 것. 대상의 상태는 따로 확인해야 한다','모든 대상 VM이 정상이라는 것','Health Check가 꺼져 있다는 것','Listener가 없다는 것'],e:'LB 상태는 개별 대상의 상태를 반영하지 않는다.'},
{v:[
 {q:'Managed Security Group을 고른 LB의 Listener 포트는?',o:['모든 출발지에 자동으로 열린다','내 IP에만 열린다','닫혀 있어 직접 열어야 한다','Target Group의 포트와 같게 바뀐다'],e:'Managed 방식은 Listener 포트를 모든 출발지에 연다. 출발지를 좁히려면 Standard를 쓴다.'},
 {q:'LB의 출발지를 내 IP로 제한하려면 어떤 Security Group 방식을 고르는가?',o:['Standard','Managed','둘 다 출발지를 제한할 수 없다','Security Group 없이 만든다'],e:'Standard는 사용자가 포트와 출발지를 정한다.'}
]},
{q:'LB의 Security Group 방식(Standard·Managed)을 바꾸고 싶을 때 맞는 설명은?',o:['만든 뒤에는 바꿀 수 없으므로 LB를 만들 때 정한다','언제든 바꿀 수 있다','Target Group에서 바꾼다','LB를 재시작하면 바뀐다'],e:'Security Group 방식은 LB를 만든 뒤 바꿀 수 없다.'},
{q:'Web 서버의 web-sg에서 TCP 80의 출발지로 알맞은 것은?',o:['alb-sg','0.0.0.0/0','Web VM 자신의 Elastic IP','db-sg'],e:'Web 서버는 ALB에서 오는 요청만 받도록 출발지를 alb-sg로 둔다.'},
{q:'Web 2대 이중화를 시험할 때 Web 1을 중지한 뒤 확인할 것은?',o:['Health Check가 실패로 판정한 뒤 Web 2가 요청을 받는지','Web 2의 디스크 크기','LB의 Instance Type','Key Pair의 이름'],e:'한 대가 멈춰도 정상인 대상으로 요청이 가는지 보는 것이 이중화 확인이다.'},
{q:'Auto Scaling Group에 Target Group을 지정하면 일어나는 일은?',o:['새로 만들어진 VM이 그 Target Group에 들어가 LB의 대상이 된다','LB가 자동으로 삭제된다','Health Check가 꺼진다','VM이 다른 VPC에 만들어진다'],e:'Auto Scaling이 만든 VM은 지정한 Target Group에 들어간다.'}
],
tasks:[{title:'실습 과제 2) Web 서버 이중화 구성',items:['테스트 VPC 및 Subnet 생성','Linux Web VM 2대 생성','Web 서버 설치 및 서비스 확인','Load Balancer와 Target Group 구성','Security Group 접근 정책 설정','Web 서버 1대 중지 시 서비스 상태 확인','리소스 및 Event 정보 확인'],note:'단계 번호는 회사 일정표의 순서다. 실제 작업에서는 LB를 만들기 전에 Security Group을 먼저 만들어 둔다. Web 서버를 설치하는 동안만 Elastic IP를 붙이고 22번을 내 IP의 /32로 열며, 확인이 끝나면 Elastic IP를 떼고 22번 규칙을 지운 뒤 ALB로만 받는다.'}]
});
