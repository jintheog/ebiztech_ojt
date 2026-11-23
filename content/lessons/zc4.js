OJT.lesson({
id:'zc4', week:5, tag:'zCompute 4', mins:'약 5시간',
title:'Linux Web 서버 (실습 과제 1): SSH 접근, Nginx/Apache, Security Group',
cover:[['VM 생성','s2'],['Elastic IP와 Security Group','s3'],['SSH 접근','s4'],['사용자 계정','s5'],['Nginx/Apache','s6'],['동작 확인','s7'],['로그·자원 확인','s8'],['접속 장애 점검','s9'],['산출물 양식','s10']],
act:'Linux VM에 Web 서버를 구축하고 접속·로그·자원 사용량 확인',
goal:['웹 요청 한 번이 내 PC에서 VM의 Web 서버까지 가는 순서를 설명할 수 있다','Elastic IP와 Security Group을 설정해 22번은 내 IP로만, 80번은 필요한 범위로만 열 수 있다','개인키 권한과 이미지별 기본 사용자를 알고 SSH로 접속할 수 있다','사용자 계정을 만들고 Nginx 또는 Apache를 설치해 systemctl로 관리할 수 있다','curl, 로그, 자원 사용량으로 서비스 상태를 확인할 수 있다','접속이 안 될 때 관찰한 결과를 바탕으로 순서대로 점검할 수 있다'],
terms:[
['Elastic IP','Elastic IP (EIP)','VM의 사설 IP와 1:1 NAT로 연결해 밖에서 들어오는 접속을 받게 하는 공인 IP.'],
['Security Group','Security Group','네트워크 인터페이스에 붙이는 상태 저장 방식의 허용 규칙 묶음.'],
['Ingress','Ingress','VM으로 들어오는 방향의 트래픽.'],
['/32','/32 CIDR','IP 주소 하나만 가리키는 CIDR.'],
['개인키 권한','Private Key Permission','개인키 파일은 소유자만 읽도록 400이나 600으로 둔다.'],
['기본 사용자','Default User','클라우드 이미지에 미리 정해진 첫 로그인 계정. 이미지마다 다르다.'],
['authorized_keys','~/.ssh/authorized_keys','그 계정으로 접속을 허용할 공개키를 적어 두는 파일.'],
['sudo 그룹','sudo / wheel','관리자 명령을 쓸 수 있는 그룹. Ubuntu는 sudo, RHEL 계열은 wheel을 쓴다.'],
['Nginx','Nginx','널리 쓰이는 Web 서버 프로그램.'],
['Apache','Apache HTTP Server','널리 쓰이는 Web 서버 프로그램. 패키지 이름은 Ubuntu에서 apache2, RHEL 계열에서 httpd다.'],
['systemctl','systemctl','systemd의 서비스를 시작, 중지, 확인하는 명령.'],
['enable --now','systemctl enable --now','서비스를 부팅 때 자동으로 시작하게 하고 지금 바로 시작하는 옵션.'],
['LISTEN','LISTEN','프로그램이 포트에서 접속을 기다리는 상태.'],
['curl -I','curl -I','HTTP 응답의 헤더만 받아 상태 코드를 확인하는 명령.'],
['access log','Access Log','Web 서버가 받은 요청을 기록하는 로그.'],
['error log','Error Log','Web 서버의 오류를 기록하는 로그.'],
['OS 방화벽','ufw / firewalld','VM 안에서 동작하는 방화벽. Security Group과 별개다.'],
['Test Connectivity','Test Connectivity','콘솔에서 VM까지 ping 또는 arping을 시험하는 기능.']
],
body:`
<h2 id="s1">실습 흐름과 접속 한 번에 일어나는 일</h2>
<p>이 레슨은 Linux VM 한 대에 Web 서버를 올리고 내 PC에서 접속해 확인한다. 먼저 내 PC의 요청이 Web 서버까지 가는 순서를 본다. 뒤의 절은 모두 이 순서의 한 칸을 설정하거나 확인한다.</p>
<svg class="fig" viewBox="0 0 560 226" role="img" aria-label="웹 요청의 경로. 1 내 PC가 Elastic IP로 요청을 보내고, 2 인터넷을 지나, 3 Internet GW에서 Elastic IP가 VM의 사설 IP로 1:1 NAT되고, 4 Security Group이 포트와 출발지를 확인하고, 5 VM 안의 OS 방화벽을 지나 Web 서버가 응답한다.">
<rect x="212" y="10" width="342" height="204" rx="10" class="zone"/>
<text x="226" y="202" class="t-s">VPC</text>
<use href="#i-pc" x="16" y="62" width="56" height="56" class="acc"/><text x="44" y="146" class="c b">내 PC</text>
<use href="#i-cloud" x="108" y="68" width="72" height="46"/><text x="144" y="146" class="c b">인터넷</text>
<rect x="232" y="66" width="72" height="50" rx="8" class="bx-a"/><text x="268" y="98" class="c b">IGW</text><text x="268" y="146" class="c b">EIP</text><text x="268" y="172" class="c t-m">1:1 NAT</text>
<use href="#i-lock" x="358" y="64" width="52" height="52" class="acc"/><text x="384" y="146" class="c b">SG</text><text x="384" y="172" class="c t-m">허용 규칙</text>
<use href="#i-server" x="470" y="62" width="56" height="56"/><text x="498" y="146" class="c b">VM</text><text x="498" y="172" class="c t-m">Web 서버</text>
<line x1="74" y1="90" x2="104" y2="90" class="ln acc" marker-end="url(#ar-acc)"/>
<line x1="182" y1="90" x2="228" y2="90" class="ln acc" marker-end="url(#ar-acc)"/>
<line x1="306" y1="90" x2="354" y2="90" class="ln acc" marker-end="url(#ar-acc)"/>
<line x1="412" y1="90" x2="466" y2="90" class="ln acc" marker-end="url(#ar-acc)"/>
<g class="badge"><circle cx="44" cy="38" r="13"/><text x="44" y="44">1</text></g>
<g class="badge"><circle cx="144" cy="38" r="13"/><text x="144" y="44">2</text></g>
<g class="badge"><circle cx="268" cy="38" r="13"/><text x="268" y="44">3</text></g>
<g class="badge"><circle cx="384" cy="38" r="13"/><text x="384" y="44">4</text></g>
<g class="badge"><circle cx="498" cy="38" r="13"/><text x="498" y="44">5</text></g>
</svg>
<ol><li><b>내 PC</b>가 Elastic IP로 요청을 보낸다. 이름으로 접속하면 DNS로 IP를 먼저 찾는다.</li><li><b>인터넷</b>을 지나 VPC의 입구까지 간다.</li><li><b>Internet GW</b>를 지나며 목적지가 Elastic IP에서 VM의 사설 IP로 1:1 NAT된다. 포트는 바뀌지 않는다.</li><li><b>Security Group</b>이 출발지와 포트를 보고 허용 여부를 정한다.</li><li><b>VM 안</b>에서 OS 방화벽을 지나, 그 포트에서 LISTEN 중인 Web 서버가 응답한다.</li></ol>
<div class="flow"><div class="n"><b>VM 생성</b></div><span class="ar">→</span><div class="n"><b>Elastic IP</b></div><span class="ar">→</span><div class="n"><b>Security Group</b></div><span class="ar">→</span><div class="n"><b>SSH 접속</b></div><span class="ar">→</span><div class="n"><b>계정 생성</b></div><span class="ar">→</span><div class="n"><b>Web 서버</b></div><span class="ar">→</span><div class="n k"><b>확인</b></div></div>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><p>절차는 공식 가이드 25.06.1과 일반적인 Linux 사용법을 기준으로 쓴다. 사내 환경의 콘솔 화면, 쓸 수 있는 이미지와 타입, 네트워크 값은 다를 수 있다. 이 레슨의 주소, 이름, 명령 출력은 모두 <b>학습용 예시</b>다.</p></div>

<h2 id="s2">VM 생성</h2>
<p>공식 가이드 기준으로 <b>Compute &gt; Instances</b>에서 VM을 만든다. 만들 때 정하는 값은 다음과 같다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>단계</th><th>정하는 값</th><th>이 실습에서 고를 것</th></tr></thead><tbody>
<tr><td class="nw"><b>Compute</b></td><td>이름, 이미지, Instance Type, Key Pair</td><td>Linux 클라우드 이미지, 작은 타입, 개인키를 가진 Key Pair</td></tr>
<tr><td class="nw"><b>Storage</b></td><td>Boot Volume의 크기와 유형</td><td>OS와 Web 서버가 들어갈 만큼</td></tr>
<tr><td class="nw"><b>Networking</b></td><td>Subnet, IP, Security Group</td><td>Internet GW 경로가 있는 Public Subnet</td></tr>
<tr><td class="nw"><b>Config</b></td><td>cloud-init 파일, 메타데이터</td><td>이 실습은 손으로 설정하므로 비워 둔다</td></tr>
</tbody></table></div>
<p>VM을 시작하면 상태가 <b>Spawning</b>을 거쳐 <b>Active</b>가 된다. Active가 되면 Overview에서 사설 IP를 확인해 기록한다.</p>
<div class="box warn"><span class="lbl">주의: Key Pair를 먼저 확인한다</span><p>제공되는 클라우드 이미지는 기본 비밀번호로 로그인할 수 없다. 개인키를 가진 Key Pair를 고르지 않으면 SSH로 들어갈 수 없다.</p></div>

<h2 id="s3">Elastic IP와 Security Group</h2>
<h3>Elastic IP 연결</h3>
<p>VM은 기본적으로 공인 IP가 없다. <b>Networking &gt; Elastic IPs</b>에서 주소를 할당하고, VM의 Elastic IPs 탭에서 연결한다. 이 VM의 Subnet은 Route Table에 <code>0.0.0.0/0 → Internet GW</code>가 있어야 한다.</p>
<p>Elastic IP는 사설 IP와 1:1 NAT로 연결된다. VM 안의 <code>ip addr</code>에 Elastic IP가 보이지 않더라도 그것만으로 고장이라고 단정하지 않는다. VM 안에서 보이는지는 사내 실습 환경에서 확인한다.</p>
<h3>Security Group 규칙</h3>
<p>이 실습에 필요한 Ingress 규칙은 두 줄이다. 상태 저장 방식이므로 응답을 위한 규칙은 따로 넣지 않는다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>방향</th><th>프로토콜</th><th>포트</th><th>출발지</th><th>이유</th></tr></thead><tbody>
<tr><td class="nw">Ingress</td><td>TCP</td><td>22</td><td><code>198.51.100.25/32</code></td><td>SSH는 내 IP에서만</td></tr>
<tr><td class="nw">Ingress</td><td>TCP</td><td>80</td><td><code>198.51.100.25/32</code></td><td>실습 중 확인은 내 IP에서만</td></tr>
</tbody></table></div>
<p class="small muted"><code>198.51.100.25</code>는 문서용 예시 주소다. 내 IP는 PC의 사설 IP가 아니라 <b>내 PC가 인터넷으로 나갈 때 쓰는 공인 IP</b>다. 회사망이나 VPN에서는 이 주소가 다를 수 있다.</p>
<div class="box warn"><span class="lbl">주의: 22번을 0.0.0.0/0으로 열지 않는다</span><p>SSH 포트를 전체에 열면 인터넷의 자동 공격 대상이 된다. 80번은 실제로 공개하는 서비스일 때만 범위를 넓힌다.</p></div>
<p>이 실습은 VM 한 대에 Elastic IP를 직접 붙이는 구성이다. 서비스 구성에서는 Load Balancer를 입구로 두며, 이는 <a data-lesson="zc6"></a>와 <a data-lesson="zc8"></a>에서 다룬다.</p>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><ul><li>새 Security Group에 처음 들어 있는 규칙과 Egress 허용 여부</li><li>사내 환경에서 내 공인 IP를 확인하는 방법</li></ul></div>

<h2 id="s4">SSH 키 접속</h2>
<p>요청 경로가 준비되면 내 PC에서 SSH로 접속한다. 접속에 필요한 것은 <b>개인키, 기본 사용자, Elastic IP</b> 세 가지다.</p>
<pre class="code">$ chmod 400 ~/.ssh/ojt-key.pem                  <span class="c"># 소유자만 읽기</span>
$ ssh -i ~/.ssh/ojt-key.pem ubuntu@203.0.113.10 <span class="c"># -i 개인키 사용자@주소</span></pre>
<p class="small muted">학습용 예시다. 처음 접속할 때 서버 지문을 묻는 질문이 나오면 접속하려는 VM이 맞는지 확인하고 답한다.</p>
<ul><li><b>개인키 권한:</b> 다른 사용자도 읽을 수 있는 키는 SSH 클라이언트가 거부한다. 400이나 600으로 둔다.</li><li><b>기본 사용자:</b> 이미지마다 다르다. Ubuntu 이미지는 <code>ubuntu</code>이고, 다른 이미지는 그 이미지의 문서에서 확인한다.</li><li><b>Windows:</b> PuTTY를 쓰면 <code>.pem</code>을 PuTTYgen으로 <code>.ppk</code>로 변환한다.</li></ul>
<div class="box warn"><span class="lbl">주의: 개인키를 서버로 복사하지 않는다</span><p>개인키는 내 PC에만 둔다. VM, 공유 폴더, 저장소, 메신저에 올리지 않는다.</p></div>

<h2 id="s5">사용자 계정 만들기</h2>
<p>기본 사용자를 계속 함께 쓰면 누가 무엇을 했는지 구분하기 어렵다. 작업용 계정을 따로 만든다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>작업</th><th>Ubuntu</th><th>RHEL 계열(Rocky 등)</th></tr></thead><tbody>
<tr><td class="nw"><b>계정 생성</b></td><td><code>sudo adduser webadmin</code></td><td><code>sudo useradd -m webadmin</code></td></tr>
<tr><td class="nw"><b>비밀번호 설정</b></td><td><code>adduser</code>가 물어본다</td><td><code>sudo passwd webadmin</code></td></tr>
<tr><td class="nw"><b>sudo 권한</b></td><td><code>sudo usermod -aG sudo webadmin</code></td><td><code>sudo usermod -aG wheel webadmin</code></td></tr>
</tbody></table></div>
<p>이 비밀번호는 sudo를 쓸 때 필요하다. SSH 접속은 계속 키로 한다. 새 계정으로 키 접속을 하려면 공개키를 그 계정의 <code>authorized_keys</code>에 넣는다.</p>
<pre class="code">$ sudo install -d -m 700 -o webadmin -g webadmin /home/webadmin/.ssh
$ sudo install -m 600 -o webadmin -g webadmin \\
    ~/.ssh/authorized_keys /home/webadmin/.ssh/authorized_keys
<span class="c"># 내 PC의 새 터미널에서</span>
$ ssh -i ~/.ssh/ojt-key.pem webadmin@203.0.113.10
$ id    <span class="c"># 그룹에 sudo 또는 wheel이 있는지 확인</span></pre>
<p class="small muted">학습용으로 같은 공개키를 복사했다. 실제로는 그 계정을 쓸 사람의 공개키를 넣는다.</p>
<div class="box warn"><span class="lbl">주의: 처음 세션을 닫지 않는다</span><p>새 계정으로 접속과 sudo가 되는 것을 확인할 때까지 기존 SSH 세션을 열어 둔다. 설정을 잘못해도 그 세션으로 고칠 수 있다.</p></div>

<h2 id="s6">Nginx 또는 Apache 설치와 systemctl</h2>
<p>요청 경로의 마지막 칸인 Web 서버를 올린다. Nginx와 Apache 중 하나만 설치한다. 둘 다 기본으로 80번 포트를 쓰므로 함께 실행하면 충돌한다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>Nginx (Ubuntu)</th><th>Nginx (RHEL 계열)</th><th>Apache (Ubuntu)</th><th>Apache (RHEL 계열)</th></tr></thead><tbody>
<tr><td class="nw"><b>설치</b></td><td><code>apt install nginx</code></td><td><code>dnf install nginx</code></td><td><code>apt install apache2</code></td><td><code>dnf install httpd</code></td></tr>
<tr><td class="nw"><b>서비스 이름</b></td><td><code>nginx</code></td><td><code>nginx</code></td><td><code>apache2</code></td><td><code>httpd</code></td></tr>
<tr><td class="nw"><b>기본 문서 위치</b></td><td><code>/var/www/html</code></td><td><code>/usr/share/nginx/html</code></td><td><code>/var/www/html</code></td><td><code>/var/www/html</code></td></tr>
<tr><td class="nw"><b>로그 위치</b></td><td><code>/var/log/nginx/</code></td><td><code>/var/log/nginx/</code></td><td><code>/var/log/apache2/</code></td><td><code>/var/log/httpd/</code></td></tr>
</tbody></table></div>
<p class="small muted">문서 위치와 로그 위치는 배포판의 일반적인 기본값이고 버전에 따라 다를 수 있다.</p>
<pre class="code">$ sudo apt update
$ sudo apt install -y nginx
$ sudo systemctl enable --now nginx   <span class="c"># 부팅 시 자동 시작 + 지금 시작</span>
$ systemctl status nginx              <span class="c"># active (running) 확인</span>
$ sudo ss -tlnp | grep ':80'          <span class="c"># 80번에서 LISTEN 하는지 확인</span>
$ echo 'OJT web server' | sudo tee /var/www/html/index.html</pre>
<p class="small muted">Ubuntu와 Nginx 기준의 학습용 예시다.</p>
<div class="tbl-wrap"><table><thead><tr><th>명령</th><th>하는 일</th></tr></thead><tbody>
<tr><td class="nw"><code>systemctl start</code></td><td>지금 시작한다</td></tr>
<tr><td class="nw"><code>systemctl stop</code></td><td>지금 중지한다</td></tr>
<tr><td class="nw"><code>systemctl restart</code></td><td>껐다가 다시 켠다</td></tr>
<tr><td class="nw"><code>systemctl reload</code></td><td>실행을 유지한 채 설정을 다시 읽는다</td></tr>
<tr><td class="nw"><code>systemctl enable</code></td><td>부팅할 때 자동으로 시작하게 한다</td></tr>
<tr><td class="nw"><code>systemctl status</code></td><td>상태와 최근 로그를 본다</td></tr>
</tbody></table></div>
<div class="box warn"><span class="lbl">주의: OS 방화벽은 Security Group과 별개다</span><p>VM 안에 <code>ufw</code>나 <code>firewalld</code>가 켜져 있으면 Security Group을 열어도 막힐 수 있다. <code>sudo ufw status</code>나 <code>sudo firewall-cmd --state</code>로 확인하고, 켜져 있으면 해당 포트를 허용한다.</p></div>

<h2 id="s7">curl로 동작 확인</h2>
<p>안쪽부터 바깥쪽 순서로 확인한다. 어느 단계까지 되는지 알면 문제가 있는 칸이 좁혀진다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>확인 위치</th><th>명령</th><th>되면 알 수 있는 것</th></tr></thead><tbody>
<tr><td class="nw"><b>VM 안</b></td><td><code>curl -I http://localhost</code></td><td>Web 서버가 응답한다</td></tr>
<tr><td class="nw"><b>내 PC (포트)</b></td><td><code>nc -zv 203.0.113.10 80</code></td><td>경로, NAT, Security Group을 지나 포트까지 닿는다</td></tr>
<tr><td class="nw"><b>내 PC (HTTP)</b></td><td><code>curl -I http://203.0.113.10</code></td><td>내 PC에서 서비스를 받을 수 있다</td></tr>
</tbody></table></div>
<pre class="code">$ curl -I http://203.0.113.10
HTTP/1.1 200 OK
Server: nginx
Content-Type: text/html</pre>
<p class="small muted">학습용 예시 출력이다. Windows PowerShell에서는 포트 확인에 <code>Test-NetConnection 203.0.113.10 -Port 80</code>을 쓴다.</p>

<h2 id="s8">로그와 자원 사용량 확인</h2>
<p>서비스가 응답해도 기록과 자원을 확인해 둔다. 조금 전 내 요청이 access log에 남았는지부터 본다.</p>
<pre class="code">$ sudo tail -n 20 /var/log/nginx/access.log    <span class="c"># 받은 요청</span>
$ sudo tail -n 20 /var/log/nginx/error.log     <span class="c"># 오류</span>
$ journalctl -u nginx --since "10 min ago"     <span class="c"># 서비스 기록</span></pre>
<div class="tbl-wrap"><table><thead><tr><th>자원</th><th>명령</th><th>볼 것</th></tr></thead><tbody>
<tr><td class="nw"><b>CPU·프로세스</b></td><td><code>top</code></td><td>load average, CPU를 많이 쓰는 프로세스</td></tr>
<tr><td class="nw"><b>메모리</b></td><td><code>free -h</code></td><td><code>available</code> 값</td></tr>
<tr><td class="nw"><b>디스크</b></td><td><code>df -h</code></td><td>Boot Volume의 사용률</td></tr>
<tr><td class="nw"><b>포트</b></td><td><code>sudo ss -tlnp</code></td><td>필요한 포트만 열려 있는지</td></tr>
</tbody></table></div>
<p>플랫폼의 지표와 이벤트로 보는 방법은 <a data-lesson="zc7"></a>에서 다룬다.</p>

<h2 id="s9">접속이 안 될 때 점검 순서</h2>
<p>오류 메시지는 <b>관찰된 사실</b>이고, 원인은 여러 가지일 수 있다. 메시지 하나로 원인을 단정하지 않고 다음 순서로 좁힌다.</p>
<div class="flow"><div class="n"><b>메시지 기록</b></div><span class="ar">→</span><div class="n"><b>DNS 조회</b><small>이름을 쓸 때</small></div><span class="ar">→</span><div class="n k"><b>포트 확인</b><small>판단 기준</small></div><span class="ar">→</span><div class="n"><b>경로·규칙</b></div><span class="ar">→</span><div class="n"><b>서버 안</b></div></div>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>관찰한 결과</th><th>뜻</th><th>원인 후보</th><th>확인할 곳</th></tr></thead><tbody>
<tr><td class="nw"><b>Could not resolve host</b></td><td>이름을 IP로 바꾸지 못했다</td><td>이름 오타, 레코드 없음, DNS 설정</td><td><code>dig</code>, IP로 직접 접속</td></tr>
<tr><td class="nw"><b>Connection timed out</b></td><td>응답이 오지 않았다</td><td>Security Group, 내 공인 IP 변경, Elastic IP 미연결, Route Table, OS 방화벽, 회사망 차단</td><td>SG 규칙, Elastic IP 탭, Route Table</td></tr>
<tr><td class="nw"><b>Connection refused</b></td><td>거절하는 응답이 왔다</td><td>LISTEN 중인 프로그램 없음, 다른 포트 사용, OS 방화벽의 거절, 다른 VM에 연결된 EIP</td><td><code>systemctl status</code>, <code>ss -tlnp</code></td></tr>
<tr><td class="nw"><b>Permission denied (publickey)</b></td><td>서버까지 닿았지만 인증에 실패했다</td><td>사용자 이름, 다른 개인키, 공개키 미등록, 키나 <code>.ssh</code> 권한</td><td><code>ssh -v</code>, <code>authorized_keys</code></td></tr>
<tr><td class="nw"><b>HTTP 403, 404, 5xx</b></td><td>Web 서버까지 닿았고 응답이 왔다</td><td>문서 위치, 파일 권한, 설정, 뒤쪽 프로그램</td><td>error log, 설정 파일</td></tr>
</tbody></table></div>
<div class="box mem"><span class="lbl">외울 것: 판단 기준은 포트 확인이다</span><p>ping이 실패해도 연결 실패라고 단정하지 않는다. ICMP는 Security Group이나 보안 정책으로 막혀 있을 수 있다. 실제 서비스 포트를 <code>nc -zv</code>로 확인한다.</p></div>
<h3>콘솔의 Test Connectivity</h3>
<p>SSH로 들어갈 수 없을 때는 콘솔의 <b>Compute &gt; Instances &gt; More &gt; Test Connectivity</b>로 VM까지의 통신을 시험할 수 있다. 공식 가이드 기준으로 <b>ping</b>은 L3를 시험하며 Security Group에 막힐 수 있고, <b>arping</b>은 L2를 시험하며 Security Group을 거치지 않는다. 그래서 arping은 되는데 ping이 안 되면 VM이 꺼진 것이 아니라 규칙 때문일 수 있다.</p>
<h3>직접 해 보기</h3>
<p>내 PC에서 <code>nc -zv 203.0.113.10 80</code>은 timed out이고, VM 안의 <code>curl -I http://localhost</code>는 200이다. 어디부터 볼까?</p>
<details class="fold"><summary>답 보기</summary><p>VM 안의 Web 서버는 응답하므로 VM 바깥이나 입구 쪽을 본다. Security Group의 80번 규칙과 출발지(내 공인 IP가 바뀌었는지), OS 방화벽, Elastic IP 연결, Route Table 순서로 확인한다. timed out만으로 원인을 하나로 단정할 수는 없다.</p></details>

<h2 id="s10">산출물 양식: 설정 내역서와 VM 구축 결과</h2>
<p>아래는 빈 양식이다. 실제 값은 실습한 뒤 직접 적는다.</p>
<div class="box warn"><span class="lbl">주의: 채운 문서를 이 저장소에 올리지 않는다</span><p>채운 내역서·결과 문서에는 사내 IP·계정·VM 이름이 들어가므로 이 저장소(public)에 올리지 않는다. 개인키와 비밀번호는 문서에 적지 않는다.</p></div>
<h3>설정 내역서</h3>
<div class="tbl-wrap"><table><thead><tr><th>구분</th><th>항목</th><th>값</th></tr></thead><tbody>
<tr><td class="nw" rowspan="5"><b>VM</b></td><td>VM 이름</td><td></td></tr>
<tr><td>Instance Type</td><td></td></tr>
<tr><td>Machine Image</td><td></td></tr>
<tr><td>Boot Volume 크기·유형</td><td></td></tr>
<tr><td>Key Pair 이름</td><td></td></tr>
<tr><td class="nw" rowspan="4"><b>네트워크</b></td><td>VPC / CIDR</td><td></td></tr>
<tr><td>Subnet / CIDR</td><td></td></tr>
<tr><td>사설 IP</td><td></td></tr>
<tr><td>Elastic IP</td><td></td></tr>
<tr><td class="nw" rowspan="3"><b>Security Group</b></td><td>이름</td><td></td></tr>
<tr><td>Ingress 22 / 출발지</td><td></td></tr>
<tr><td>Ingress 80 / 출발지</td><td></td></tr>
<tr><td class="nw" rowspan="3"><b>OS·서비스</b></td><td>OS / 기본 사용자</td><td></td></tr>
<tr><td>작업용 계정</td><td></td></tr>
<tr><td>Web 서버 / 포트</td><td></td></tr>
</tbody></table></div>
<h3>VM 구축 결과</h3>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>확인 항목</th><th>확인 방법</th><th>결과</th><th>확인</th></tr></thead><tbody>
<tr><td>작업용 계정으로 SSH 접속</td><td><code>ssh</code>, <code>id</code></td><td></td><td></td></tr>
<tr><td>Web 서비스 실행</td><td><code>systemctl status</code></td><td></td><td></td></tr>
<tr><td>포트 LISTEN</td><td><code>ss -tlnp</code></td><td></td><td></td></tr>
<tr><td>VM 안에서 응답</td><td><code>curl -I localhost</code></td><td></td><td></td></tr>
<tr><td>내 PC에서 응답</td><td><code>curl -I</code> Elastic IP</td><td></td><td></td></tr>
<tr><td>허용하지 않은 출발지 차단</td><td>다른 네트워크에서 포트 확인</td><td></td><td></td></tr>
<tr><td>요청 로그</td><td>access log</td><td></td><td></td></tr>
<tr><td>오류 로그</td><td>error log</td><td></td><td></td></tr>
<tr><td>CPU·메모리·디스크</td><td><code>top</code>, <code>free -h</code>, <code>df -h</code></td><td></td><td></td></tr>
</tbody></table></div>
`,
summary:['요청은 내 PC → 인터넷 → Internet GW의 Elastic IP 1:1 NAT → Security Group → VM의 OS 방화벽과 Web 서버 순서로 간다.','VM은 기본적으로 공인 IP가 없으므로 Elastic IP를 연결하고, Subnet에는 Internet GW 경로가 있어야 한다.','Security Group에서 22번은 내 IP로만 열고, 80번은 필요한 범위로만 연다.','SSH 접속에는 개인키, 이미지의 기본 사용자, Elastic IP가 필요하고 개인키 권한은 400이나 600으로 둔다.','작업용 계정을 만든 뒤에는 새 접속과 sudo를 확인할 때까지 기존 세션을 닫지 않는다.','systemctl enable --now는 부팅 시 자동 시작을 켜고 지금 바로 시작한다.','확인은 VM 안의 curl → 내 PC의 포트 확인 → 내 PC의 curl 순서로 한다.','오류 메시지는 관찰된 사실이고 원인은 여러 가지다. ping보다 실제 서비스 포트 확인을 기준으로 삼는다.'],
essay:[
{q:'내 PC에서 보낸 웹 요청이 VM의 Web 서버에 닿기까지의 순서를 설명해 보세요.',a:'내 PC가 Elastic IP로 요청을 보내고 인터넷을 지나 Internet GW에 닿는다. 여기서 목적지가 VM의 사설 IP로 1:1 NAT되고, Security Group이 출발지와 포트를 확인한다. VM 안의 OS 방화벽을 지나 그 포트에서 LISTEN 중인 Web 서버가 응답한다.'},
{q:'이 실습의 Security Group 규칙을 쓰고 이유를 설명해 보세요.',a:'Ingress TCP 22는 내 공인 IP의 /32에서만 허용해 SSH 노출을 줄인다. Ingress TCP 80은 실습 중에는 내 IP에서만 허용하고, 실제로 공개할 때만 범위를 넓힌다. 상태 저장 방식이므로 응답을 위한 규칙은 넣지 않는다.'},
{q:'SSH 키 접속에 필요한 세 가지와, 개인키 권한을 제한하는 이유를 설명해 보세요.',a:'개인키, 이미지의 기본 사용자, Elastic IP가 필요하다. 개인키는 본인임을 증명하는 파일이므로 소유자만 읽도록 400이나 600으로 둔다. 다른 사용자도 읽을 수 있으면 SSH 클라이언트가 키를 거부한다.'},
{q:'systemctl start와 enable의 차이를 설명해 보세요.',a:'start는 서비스를 지금 시작하고, enable은 부팅할 때 자동으로 시작하도록 등록한다. enable --now는 두 가지를 함께 한다.'},
{q:'Web 서비스를 확인할 때 VM 안부터 바깥쪽 순서로 확인하는 이유는 무엇인가요?',a:'어느 단계까지 되는지 보면 문제가 있는 위치가 좁혀지기 때문이다. VM 안의 curl이 되면 Web 서버는 응답하고, 내 PC의 포트 확인이 안 되면 Security Group, Elastic IP, 경로, OS 방화벽 쪽을 본다.'},
{q:'Connection timed out과 Connection refused를 관찰했을 때 각각 어떻게 점검하나요?',a:'timed out은 응답이 오지 않은 것이므로 Security Group, Elastic IP, Route Table, OS 방화벽 등을 확인한다. refused는 거절 응답이 온 것이므로 해당 포트에서 LISTEN 중인 프로그램이 있는지 systemctl status와 ss -tlnp로 확인한다. 메시지만으로 원인을 하나로 단정하지 않는다.'}
],
quiz:[
{v:[
 {q:'내 PC에서 VM의 Web 서버로 가는 요청의 순서로 맞는 것은?',o:['Internet GW의 Elastic IP NAT → Security Group → OS 방화벽 → Web 서버','Web 서버 → OS 방화벽 → Security Group → Internet GW','Security Group → Web 서버 → Internet GW → OS 방화벽','OS 방화벽 → Internet GW → Web 서버 → Security Group'],e:'요청은 VPC 입구에서 NAT된 뒤 Security Group, OS 방화벽을 지나 Web 서버에 닿는다.'},
 {q:'Elastic IP로 온 요청이 VM에 닿을 때 목적지 주소에 일어나는 일은?',o:['VM의 사설 IP로 1:1 NAT된다','포트가 무작위로 바뀐다','DNS 이름으로 바뀐다','Security Group의 이름으로 바뀐다'],e:'Elastic IP는 사설 IP와 1:1 NAT로 연결된다.'}
]},
{q:'인터넷에서 접속할 VM의 Subnet에 필요한 경로는?',o:['0.0.0.0/0 → Internet GW','0.0.0.0/0 → Security Group','10.0.0.0/16 → Elastic IP','0.0.0.0/0 → VM'],e:'Internet GW로 가는 기본 경로가 있어야 밖과 통신할 수 있다.'},
{v:[
 {q:'SSH용 Security Group 규칙의 출발지로 가장 알맞은 것은?',o:['내 공인 IP의 /32','0.0.0.0/0','VPC의 Route Table','VM의 개인키'],e:'SSH는 필요한 주소에서만 접속하도록 내 공인 IP 하나로 제한한다.'},
 {q:'출발지 198.51.100.25/32가 뜻하는 범위는?',o:['IP 주소 하나','198.51.100.0 대역 전체','모든 IP 주소','VPC 내부 전체'],e:'/32는 주소 하나만 가리킨다.'}
]},
{q:'Security Group에 Ingress 80을 허용했을 때, 응답을 위해 추가로 필요한 규칙은?',o:['상태 저장 방식이므로 응답용 규칙은 따로 필요 없다','Egress 80 규칙이 반드시 필요하다','Ingress 443 규칙이 필요하다','Route Table에 응답 경로를 하나 더 넣는다'],e:'Security Group은 상태 저장 방식이라 허용된 접속의 응답은 자동으로 통과한다.'},
{v:[
 {q:'SSH 개인키 파일의 권한으로 알맞은 것은?',o:['400 또는 600','777','755','666'],e:'개인키는 소유자만 읽을 수 있어야 한다.'},
 {q:'ssh -i ~/.ssh/key.pem ubuntu@203.0.113.10에서 -i가 지정하는 것은?',o:['접속에 쓸 개인키 파일','접속할 사용자','접속할 포트','서버의 공개키'],e:'-i 옵션은 인증에 쓸 개인키 파일을 지정한다.'}
]},
{q:'클라우드 이미지의 기본 사용자에 대한 설명으로 맞는 것은?',o:['이미지마다 다르므로 이미지의 문서에서 확인한다','모든 이미지에서 root이다','모든 이미지에서 admin이다','VM 이름과 항상 같다'],e:'예를 들어 Ubuntu 이미지는 ubuntu를 쓰고, 다른 이미지는 다를 수 있다.'},
{q:'개인키를 두는 위치로 맞는 것은?',o:['내 PC에만 둔다','VM의 공유 폴더에 둔다','저장소에 올려 함께 쓴다','웹 문서 폴더에 둔다'],e:'개인키는 본인임을 증명하는 파일이므로 사용자만 보관한다.'},
{v:[
 {q:'새 계정에 키로 접속하려면 공개키를 어디에 넣나?',o:['그 계정의 ~/.ssh/authorized_keys','/etc/hostname','/var/log/auth.log','/var/www/html'],e:'authorized_keys에 등록된 공개키로 접속을 허용한다.'},
 {q:'새 작업용 계정을 만든 직후 기존 SSH 세션을 열어 두는 이유는?',o:['새 계정의 접속과 sudo가 안 될 때 기존 세션으로 고치기 위해서다','세션을 닫으면 VM이 삭제되기 때문이다','세션이 있어야 Web 서버가 동작하기 때문이다','Elastic IP가 해제되기 때문이다'],e:'접속이 확인될 때까지 기존 세션을 복구 수단으로 남겨 둔다.'}
]},
{q:'RHEL 계열에서 사용자를 관리자 명령 그룹에 넣는 명령은?',o:['sudo usermod -aG wheel webadmin','sudo usermod -g root webadmin','sudo chmod wheel webadmin','sudo systemctl enable webadmin'],e:'RHEL 계열은 wheel 그룹을 쓰고, -aG는 기존 보조 그룹을 유지하며 추가한다.'},
{q:'Apache의 서비스 이름을 배포판별로 맞게 짝지은 것은?',o:['Ubuntu는 apache2, RHEL 계열은 httpd','Ubuntu는 httpd, RHEL 계열은 apache2','둘 다 nginx','둘 다 www'],e:'같은 Apache라도 배포판마다 패키지와 서비스 이름이 다르다.'},
{v:[
 {q:'systemctl enable --now nginx가 하는 일은?',o:['부팅 시 자동 시작을 켜고 지금 바로 시작한다','지금만 시작하고 자동 시작은 끈다','Nginx를 삭제한다','설정 파일만 검사한다'],e:'enable은 자동 시작 등록, --now는 지금 시작이다.'},
 {q:'systemctl start와 enable의 차이로 맞는 것은?',o:['start는 지금 시작, enable은 부팅 시 자동 시작 등록','start는 삭제, enable은 설치','둘은 완전히 같다','start는 자동 시작 등록, enable은 지금 중지'],e:'지금 실행과 부팅 시 자동 실행은 서로 다른 설정이다.'}
]},
{q:'sudo ss -tlnp로 확인하는 것은?',o:['어떤 프로그램이 어떤 TCP 포트에서 LISTEN 중인지','디스크 사용량','메모리 사용량','접속 사용자의 비밀번호'],e:'-t TCP, -l LISTEN, -n 숫자 표시, -p 프로그램 표시다.'},
{q:'Security Group을 열었는데 VM 안의 방화벽 때문에 접속이 막힐 수 있는 이유는?',o:['ufw나 firewalld는 Security Group과 별개로 동작하기 때문이다','Security Group이 OS 방화벽을 자동으로 끄기 때문이다','OS 방화벽은 Elastic IP에서만 동작하기 때문이다','Route Table이 OS 방화벽을 대신하기 때문이다'],e:'Security Group은 VM 바깥, OS 방화벽은 VM 안에서 각각 트래픽을 검사한다.'},
{v:[
 {q:'curl -I http://localhost가 VM 안에서 200을 돌려줄 때 알 수 있는 것은?',o:['VM 안의 Web 서버가 응답한다','인터넷에서도 반드시 접속된다','Security Group이 열려 있다','Elastic IP가 연결되어 있다'],e:'VM 안의 확인은 Web 서버만 검증한다. 바깥 경로는 내 PC에서 따로 확인한다.'},
 {q:'Web 서비스 동작을 확인하는 순서로 알맞은 것은?',o:['VM 안의 curl → 내 PC의 포트 확인 → 내 PC의 curl','내 PC의 curl → VM 삭제 → VM 안의 curl','Route Table 삭제 → 포트 확인 → curl','로그 삭제 → VM 재시작 → curl'],e:'안쪽부터 확인하면 문제가 있는 위치가 좁혀진다.'}
]},
{q:'Web 서버가 받은 요청 기록을 보는 곳은?',o:['access log','error log','authorized_keys','Route Table'],e:'받은 요청은 access log에, 오류는 error log에 남는다.'},
{q:'명령과 확인하는 자원을 맞게 짝지은 것은?',o:['free -h는 메모리, df -h는 디스크','free -h는 디스크, df -h는 메모리','free -h는 포트, df -h는 로그','free -h는 CPU, df -h는 계정'],e:'free는 메모리, df는 파일시스템의 사용량을 보여 준다.'},
{v:[
 {q:'Connection refused를 관찰했을 때 먼저 확인할 것으로 알맞은 것은?',o:['그 포트에서 LISTEN 중인 프로그램이 있는지','개인키의 파일 이름','Instance Type의 이름','Machine Image의 범위'],e:'거절 응답이 왔으므로 서비스 상태와 LISTEN 포트부터 확인한다. 원인은 이것 하나로 단정하지 않는다.'},
 {q:'Connection timed out에 대한 설명으로 맞는 것은?',o:['응답이 오지 않았다는 관찰이고, Security Group이나 경로 등 원인 후보가 여러 가지다','항상 Web 서버가 꺼졌다는 뜻이다','항상 개인키가 틀렸다는 뜻이다','DNS 이름이 틀렸다는 뜻이다'],e:'timed out은 관찰된 사실이다. 규칙, Elastic IP, 경로, OS 방화벽 등을 확인한다.'}
]},
{q:'SSH에서 Permission denied (publickey)가 나왔을 때 알 수 있는 것은?',o:['서버까지 닿았지만 인증에 실패했다','Elastic IP가 연결되지 않았다','서버의 22번 포트가 닫혀 있다','DNS 조회에 실패했다'],e:'인증 단계까지 갔으므로 사용자 이름, 개인키, 공개키 등록, 권한을 확인한다.'},
{v:[
 {q:'ping이 실패했을 때 올바른 판단은?',o:['ICMP가 막혔을 수 있으므로 실제 서비스 포트를 확인한다','서버가 꺼졌다고 단정한다','Web 서비스도 반드시 실패한다','VM을 바로 삭제한다'],e:'ping 실패는 연결 실패와 같지 않다. 판단 기준은 포트 확인이다.'},
 {q:'콘솔의 Test Connectivity에서 Security Group을 거치지 않고 L2 통신을 시험하는 것은?',o:['arping','ping','curl','ssh'],e:'공식 가이드 기준으로 arping은 L2를 시험하고 Security Group을 거치지 않는다.'}
]}
],
tasks:[{title:'실습 과제 1) Linux 서버 구축',items:['Linux VM 생성 또는 실습용 환경 준비','사용자 계정 생성 및 SSH 접속','Nginx/Apache 설치 및 Web 서비스 실행','SG 및 접근 포트 설정','서비스 동작 및 네트워크 연결 확인','시스템 로그 및 리소스 사용량 확인'],note:'단계 번호는 회사 일정표의 순서다. 실제 작업에서는 SSH로 접속하기 전에 Security Group의 22번을 먼저 연다. 결과는 본문의 설정 내역서와 VM 구축 결과 양식에 적는다.'}]
});
