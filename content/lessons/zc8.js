OJT.lesson({
id:'zc8', week:6, tag:'zCompute 8', mins:'약 6시간',
title:'구축 결과 검증 (실습 과제 3): 요구사항에서 설계, 구축, 검증, 보고서까지',
cover:[['요구사항 읽기','s1'],['전체 구성','s2'],['Public/Private 구분','s3'],['내부 서버 접근 통제','s4'],['Security Group 체인','s5'],['Storage','s6'],['Protection Group 정책','s7'],['구축 결과 검증','s8'],['산출물 양식','s9'],['직접 해 보기','s10']],
act:'가상의 고객 요청을 설계로 옮겨 구축하고, 검증 결과를 구성도·내역서·보고서로 정리',
goal:['실습 과제 3의 요구사항을 설계 요소와 검증 방법으로 옮길 수 있다','Public/Private Subnet에 자원을 나누어 배치하고 이유를 설명할 수 있다','Bastion을 통한 내부 서버 접근 통제를 설계할 수 있다','ALB → Web → NLB → WAS의 Security Group 체인을 쓸 수 있다','데이터 볼륨과 Protection Group 정책을 정하고 복구를 검증할 수 있다','구성도, 리소스 내역서, 작업 절차 보고서를 작성할 수 있다'],
terms:[
['요구사항','Requirement','고객이 인프라에 바라는 조건. 설계와 검증의 기준이 된다.'],
['참조 아키텍처','Reference Architecture','검증된 구성을 예로 보인 설계도. 이 과정은 회사의 3-Tier 참조 아키텍처를 따른다.'],
['Public Tier','Public Tier','인터넷과 직접 닿는 계층. ALB, Web, NAT GW, Bastion이 있다.'],
['Private Tier','Private Tier','인터넷에서 직접 닿지 않는 계층. NLB와 WAS가 있다.'],
['Bastion','Bastion Host','내부 서버로 들어가는 관리 접속의 유일한 입구로 두는 VM.'],
['SSH 프록시 점프','SSH ProxyJump','Bastion을 거쳐 내부 서버에 한 번에 SSH로 접속하는 방법(ssh -J).'],
['Security Group 체인','Security Group Chain','앞 계층의 Security Group만 출발지로 허용해 계층을 차례로 잇는 방식.'],
['서비스 플로우','Service Flow','사용자 요청이 어떤 자원을 어떤 포트로 거쳐 가는지 나타낸 흐름.'],
['데이터 볼륨','Data Volume','OS와 분리해 애플리케이션 데이터를 저장하는 볼륨.'],
['Protection Group','Backup Protection Group','백업 주기와 보관 기간을 정한 정책. VM과 볼륨을 넣어 보호한다.'],
['RPO','Recovery Point Objective','장애가 났을 때 잃어도 되는 데이터의 최대 시간 범위.'],
['RTO','Recovery Time Objective','장애에서 서비스를 다시 제공하기까지 허용하는 최대 시간.'],
['복구 검증','Restore Test','백업에서 실제로 복구해 데이터가 돌아오는지 확인하는 일.'],
['리소스 내역서','Resource Inventory','만든 자원의 이름, 설정, 관계를 정리한 문서.'],
['작업 절차 보고서','Work Procedure Report','무엇을 어떤 순서로 만들고 어떻게 검증했는지 적은 문서.'],
['검증 항목','Test Case','확인할 내용, 확인 방법, 기대 결과, 실제 결과를 한 줄로 적은 것.']
],
body:`
<h2 id="s1">요구사항 읽기</h2>
<p>실습 과제 3은 가상의 고객사 요청을 받은 클라우드 엔지니어가 Web 서비스 인프라를 설계하고, 구축하고, 문서로 남기는 과제다. 먼저 요구사항마다 <b>무엇으로 만들지</b>와 <b>어떻게 확인할지</b>를 정한다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>요구사항</th><th>설계 요소</th><th>확인 방법</th></tr></thead><tbody>
<tr><td>Web/App 서버 2대씩, 서비스 이중화</td><td>Web 2대 + ALB, WAS 2대 + NLB, 각 Target Group</td><td>한 대씩 중지해도 응답이 오는지</td></tr>
<tr><td>LB를 통한 외부 HTTP 서비스</td><td>ALB의 HTTP Listener, ALB에만 Elastic IP</td><td>밖에서 ALB 주소로 HTTP 응답</td></tr>
<tr><td>Public/Private Subnet 구분</td><td>Subnet 2개 이상, Route Table 2개</td><td>Route Table과 VM의 Elastic IP 유무</td></tr>
<tr><td>내부 서버 접근 통제</td><td>Bastion 하나만 SSH 입구로</td><td>Bastion을 거쳐야만 SSH가 되는지</td></tr>
<tr><td>Storage 연결과 데이터 저장 방식</td><td>WAS에 데이터 볼륨, 마운트와 fstab</td><td>재부팅 뒤에도 마운트되는지</td></tr>
<tr><td>Protection Group 백업·복구</td><td>주기·보관 기간 정책, B2OS</td><td>스냅샷 생성과 실제 복구</td></tr>
<tr><td>SG로 Network·접근 제어</td><td>ALB → Web → NLB → WAS 체인</td><td>허용한 경로만 통하는지</td></tr>
</tbody></table></div>
<p>요구사항에 없는 것은 넣지 않는다. 이 과제에는 DB가 없으므로 DB 계층은 그리지 않는다. 넣는다면 별도의 Private Subnet에 둔다.</p>

<h2 id="s2">전체 구성</h2>
<p>구성은 회사 3-Tier 참조 아키텍처의 Public Tier와 Private Tier를 따른다. Web 서버는 참조 아키텍처대로 Public Subnet에 두되 Elastic IP를 붙이지 않는다.</p>
<svg class="fig" viewBox="0 0 560 320" role="img" aria-label="인터넷에서 온 요청이 Public Subnet의 ALB를 거쳐 Web 1과 Web 2로 가고, Web 서버는 Private Subnet의 NLB를 거쳐 WAS 1과 WAS 2로 요청을 보낸다. Public Subnet에는 Bastion과 NAT GW도 있고, WAS에는 데이터 볼륨이 연결되어 Protection Group으로 보호된다.">
<rect x="70" y="14" width="482" height="140" rx="10" class="zone"/><text x="84" y="38" class="t-s">Public Subnet</text>
<rect x="70" y="170" width="482" height="140" rx="10" class="zone"/><text x="150" y="194" class="t-s">Private Subnet</text>
<use href="#i-cloud" x="4" y="64" width="60" height="38"/><text x="34" y="124" class="c t-m">인터넷</text>
<line x1="64" y1="84" x2="90" y2="84" class="ln acc" marker-end="url(#ar-acc)"/>
<use href="#i-lb" x="94" y="60" width="44" height="44" class="acc"/><text x="116" y="128" class="c t-m b">ALB</text>
<line x1="140" y1="82" x2="178" y2="82" class="ln acc" marker-end="url(#ar-acc)"/>
<use href="#i-server" x="182" y="60" width="44" height="44"/><text x="204" y="128" class="c t-m">Web 1</text>
<use href="#i-server" x="254" y="60" width="44" height="44"/><text x="276" y="128" class="c t-m">Web 2</text>
<use href="#i-server" x="364" y="60" width="44" height="44" class="mut"/><text x="386" y="128" class="c t-m">Bastion</text>
<use href="#i-router" x="456" y="60" width="44" height="44" class="mut"/><text x="478" y="128" class="c t-m">NAT GW</text>
<path d="M240 136 V160 H116 V210" fill="none" class="ln acc" marker-end="url(#ar-acc)"/>
<use href="#i-lb" x="94" y="216" width="44" height="44" class="acc"/><text x="116" y="284" class="c t-m b">NLB</text>
<line x1="140" y1="238" x2="178" y2="238" class="ln acc" marker-end="url(#ar-acc)"/>
<use href="#i-server" x="182" y="216" width="44" height="44"/><text x="204" y="284" class="c t-m">WAS 1</text>
<use href="#i-server" x="254" y="216" width="44" height="44"/><text x="276" y="284" class="c t-m">WAS 2</text>
<line x1="300" y1="238" x2="356" y2="238" class="ln dash"/>
<use href="#i-db" x="360" y="218" width="40" height="40"/><text x="380" y="284" class="c t-m">Volume</text>
<rect x="430" y="208" width="112" height="60" rx="8" class="bx-n"/><text x="486" y="234" class="c t-m">Protection</text><text x="486" y="256" class="c t-m">Group</text>
<line x1="402" y1="238" x2="426" y2="238" class="ln dash"/>
</svg>
<p class="small muted">파란 화살표는 서비스 요청의 흐름이다. 관리 접속(SSH)은 Bastion에서 각 서버로 들어간다. 그림의 배치는 학습용 예시다.</p>

<h2 id="s3">Public/Private 구분</h2>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>Subnet</th><th>Route Table의 기본 경로</th><th>배치</th><th>Elastic IP</th></tr></thead><tbody>
<tr><td class="nw"><b>public</b></td><td><code>0.0.0.0/0 → Internet GW</code></td><td>ALB, Web 1·2, Bastion, NAT GW</td><td>ALB, Bastion, NAT GW에만</td></tr>
<tr><td class="nw"><b>private-app</b></td><td><code>0.0.0.0/0 → NAT GW</code></td><td>NLB, WAS 1·2</td><td>없음</td></tr>
</tbody></table></div>
<p>Private Subnet의 VM은 NAT GW로 밖에 나갈 수 있지만, 밖에서 들어오는 접속은 받지 않는다. Web 서버는 Public Subnet에 있어도 Elastic IP가 없으므로 사용자는 ALB를 거쳐야만 닿는다.</p>

<h2 id="s4">내부 서버 접근 통제</h2>
<p><b>Bastion</b>은 내부 서버로 들어가는 관리 접속의 <b>유일한 입구</b>로 두는 VM이다. 관리자는 Bastion에 SSH로 들어간 뒤 내부 서버로 접속한다.</p>
<ul><li>Bastion에만 Elastic IP를 붙이고, 22번은 관리자 PC의 공인 IP /32로만 연다.</li><li>Web과 WAS의 22번은 <b>bastion-sg에서 오는 접속만</b> 허용한다.</li><li>개인키를 Bastion에 복사하지 않고, 내 PC에서 <code>ssh -J</code>로 Bastion을 거쳐 접속한다.</li><li>Bastion에는 접속에 필요한 것 외의 프로그램을 두지 않는다.</li></ul>
<pre class="code">$ ssh -J ubuntu@203.0.113.30 ubuntu@10.0.2.11    <span class="c"># Bastion을 거쳐 WAS 1로 (학습용 예시 주소)</span></pre>
<p class="small muted"><code>ssh -J</code>(ProxyJump)는 일반적인 OpenSSH 사용법이다. 내부 서버에 같은 키를 쓰는지, 서버마다 다른 키를 쓰는지는 실습 지침을 따른다.</p>

<h2 id="s5">Security Group 체인</h2>
<p>각 계층은 <b>바로 앞 계층의 Security Group</b>에서 오는 접속만 받는다. 앞 계층을 건너뛴 접속은 막힌다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>Security Group</th><th>Ingress</th><th>출발지</th><th>이유</th></tr></thead><tbody>
<tr><td class="nw"><b>alb-sg</b></td><td>TCP 80</td><td>서비스 대상(공개 전에는 내 공인 IP /32)</td><td>서비스 입구</td></tr>
<tr><td class="nw"><b>web-sg</b></td><td>TCP 80</td><td>alb-sg</td><td>ALB를 거친 요청만</td></tr>
<tr><td class="nw"><b>nlb-sg</b></td><td>TCP 8080</td><td>web-sg</td><td>Web 서버에서 오는 요청만</td></tr>
<tr><td class="nw"><b>was-sg</b></td><td>TCP 8080</td><td>nlb-sg 또는 web-sg</td><td>NLB 뒤의 WAS가 보는 출발지에 따라 정한다</td></tr>
<tr><td class="nw"><b>bastion-sg</b></td><td>TCP 22</td><td>관리자 PC의 공인 IP /32</td><td>관리 접속의 입구</td></tr>
<tr><td class="nw"><b>web-sg, was-sg</b></td><td>TCP 22</td><td>bastion-sg</td><td>Bastion을 거친 관리 접속만</td></tr>
</tbody></table></div>
<p class="small muted">포트 8080은 WAS의 예시 포트다. 실제 포트는 애플리케이션에 맞춘다.</p>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><p>NLB 뒤의 WAS가 보는 출발지 주소. WAS의 접속 로그에서 출발지가 NLB인지 Web 서버인지 보고 was-sg의 출발지를 정한다.</p></div>

<h3>Web → NLB → WAS 연결</h3>
<p>이 과제에는 정해진 애플리케이션이 없으므로, WAS에는 <b>8080번에서 응답하는 간단한 테스트 서버</b>를 띄운다. 응답에 서버 이름(<code>was1</code>, <code>was2</code>)이 보이게 해서 어느 WAS가 응답했는지 구분한다.</p>
<pre class="code"><span class="c"># WAS 1에서 (WAS 2는 was2로)</span>
$ mkdir -p ~/was && echo was1 > ~/was/index.html
$ nohup python3 -m http.server 8080 --directory ~/was &gt;/dev/null 2&gt;&amp;1 &amp;</pre>
<p>Web의 Nginx는 받은 요청을 <b>NLB 주소의 8080번</b>으로 넘긴다. Ubuntu에서는 <code>/etc/nginx/sites-available/default</code>의 <code>location /</code>을 다음과 같이 바꾼다.</p>
<pre class="code">location / {
    proxy_pass http://10.0.2.100:8080;   <span class="c"># NLB의 사설 주소 (학습용 예시 주소)</span>
}</pre>
<pre class="code">$ sudo nginx -t && sudo systemctl reload nginx   <span class="c"># 설정 검사 후 다시 읽기</span>
$ for i in 1 2 3 4; do curl -s http://203.0.113.20/; done   <span class="c"># ALB 주소로</span>
was1
was2
was1
was2</pre>
<p class="small muted">위 명령과 출력은 일반적인 Linux·Nginx 사용법으로 만든 학습용 예시다. 실제 서비스에서는 이 테스트 서버 자리에 애플리케이션이 들어간다.</p>

<h2 id="s6">Storage</h2>
<p>WAS의 애플리케이션 데이터와 로그는 Boot Volume이 아니라 <b>데이터 볼륨</b>에 둔다. OS와 데이터를 나누면 크기, Volume Type, 보호 정책을 따로 정할 수 있다.</p>
<ol><li>WAS마다 데이터 볼륨을 만들고 필요한 Volume Type을 고른다.</li><li>볼륨을 Attach하고 VM 안에서 파일시스템을 만들어 <code>/data</code> 같은 디렉터리에 마운트한다.</li><li><code>/etc/fstab</code>에 UUID로 등록하고 재부팅해서 다시 마운트되는지 확인한다.</li></ol>
<p>볼륨 하나는 VM 하나에 붙는다. WAS 2대가 <b>같은 파일을 함께</b> 읽고 써야 한다면 Block Volume 대신 File Storage를 검토한다. 이는 <a data-lesson="zs3"></a>에서 다룬다.</p>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><p>실습 Project에서 쓸 Volume Type과 볼륨 크기 지침</p></div>

<h2 id="s7">Protection Group 정책</h2>
<p>정책은 <b>얼마만큼의 데이터를 잃어도 되는가(RPO)</b>에서 출발한다. 스냅샷 주기가 RPO보다 짧아야 한다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>항목</th><th>예시 값</th><th>이유</th></tr></thead><tbody>
<tr><td class="nw"><b>보호 대상</b></td><td>WAS 1·2 VM(연결된 볼륨 포함)</td><td>데이터가 있는 서버. VM 단위로 넣어 볼륨을 같은 시점으로 찍는다</td></tr>
<tr><td class="nw"><b>로컬 주기</b></td><td>6시간마다</td><td>RPO 6시간</td></tr>
<tr><td class="nw"><b>로컬 보관</b></td><td>7일</td><td>최근 일주일 안의 시점으로 되돌리기</td></tr>
<tr><td class="nw"><b>원격(B2OS)</b></td><td>로컬 4개마다, 30일 보관</td><td>하루 한 번 로컬 저장소 바깥에 사본</td></tr>
</tbody></table></div>
<p class="small muted">위 값은 학습용 예시다. 실제 값은 고객의 RPO와 저장 용량을 함께 보고 정한다. Web 서버는 데이터가 없고 다시 만들 수 있으면 보호 대상에서 뺄 수 있다. 이때는 Web 서버를 다시 만드는 절차를 보고서에 적는다.</p>
<h3>복구 절차와 복구 검증</h3>
<ol><li>WAS 1의 데이터 볼륨에 시험 파일을 만들고 Protection Group의 <b>Trigger Now</b>로 스냅샷을 만든다.</li><li>시험 파일을 지운다.</li><li>스냅샷에서 <b>새 볼륨</b>을 만들어 WAS 1에 연결하고 마운트한다.</li><li>시험 파일이 돌아왔는지 확인하고, 걸린 시간을 기록한다.</li></ol>
<p>걸린 시간은 RTO를 정하는 근거가 된다. <mark>복구해 보지 않은 백업은 믿을 수 없다.</mark></p>

<h2 id="s8">구축 결과 검증</h2>
<p>요구사항마다 검증 항목을 만들고, <b>허용한 경로가 되는지</b>와 <b>막은 경로가 막히는지</b>를 함께 확인한다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>검증 항목</th><th>방법</th><th>기대 결과</th></tr></thead><tbody>
<tr><td>외부 HTTP</td><td>내 PC에서 ALB 주소로 <code>curl -I</code></td><td><code>200 OK</code></td></tr>
<tr><td>Web 직접 접속 차단</td><td>Web 서버에 Elastic IP가 없는지, web-sg의 80번 출발지가 alb-sg인지 확인</td><td>ALB 외의 경로 없음</td></tr>
<tr><td>Web 이중화</td><td>Web 1 중지 후 ALB로 반복 요청</td><td>응답이 계속 오고, 요청은 Web 2의 access log에만 남는다</td></tr>
<tr><td>WAS 이중화</td><td>WAS 1 중지 후 ALB로 반복 요청</td><td>was2의 응답만 돌아온다</td></tr>
<tr><td>WAS 접근 제어</td><td>Bastion에서 WAS의 8080으로 <code>nc -zv</code></td><td>막힘(timed out)</td></tr>
<tr><td>SSH 접근 통제</td><td>Bastion을 거쳐 SSH, 내 PC에서 WAS로 직접 SSH</td><td>앞은 됨, 뒤는 안 됨</td></tr>
<tr><td>Private 아웃바운드</td><td>WAS에서 패키지 저장소에 접속</td><td>NAT GW로 됨</td></tr>
<tr><td>Web 아웃바운드</td><td>Elastic IP가 없는 Web에서 패키지 저장소에 접속</td><td>사내 실습 환경에서 확인</td></tr>
<tr><td>Storage</td><td>WAS 재부팅 뒤 <code>df -h /data</code></td><td>마운트됨</td></tr>
<tr><td>백업·복구</td><td>Protection Group 스냅샷 생성, 복구 검증</td><td>시험 파일 복구</td></tr>
<tr><td>상태와 Event</td><td>LB 상태, Target Group 대상 상태, Events의 Error·Warning</td><td>대상 모두 정상, 설명되지 않는 Error 없음</td></tr>
</tbody></table></div>
<p class="small muted">"막힘"을 확인할 때는 timed out과 refused를 구분해 적는다. 결과가 기대와 다르면 원인과 조치를 보고서에 남긴다.</p>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><p>Elastic IP가 없는 Web VM이 패키지 설치처럼 밖으로 나가는 통신을 할 수 있는지. 나갈 수 없으면 Web 서버 설치는 Elastic IP를 잠시 붙인 동안에 끝낸다.</p></div>

<h2 id="s9">산출물 양식</h2>
<p>제출물은 <b>인프라 아키텍처 구성도</b>, <b>리소스 내역서</b>, <b>작업 절차 최종 보고서</b> 세 가지다. 아래는 빈 양식이다.</p>
<div class="box warn"><span class="lbl">주의: 채운 산출물은 outputs/에 두고 커밋하지 않는다</span><p>채운 구성도·내역서·보고서에는 사내 IP·계정·VM 이름이 들어간다. 이 저장소(public)에 올리지 않고 <code>outputs/</code> 폴더에 둔다. 이 폴더는 git에서 제외되어 있다. 개인키와 비밀번호는 문서에 적지 않는다.</p></div>
<h3>아키텍처 구성도에 넣을 것</h3>
<ul><li><b>네트워크</b>: VPC와 CIDR, Subnet과 CIDR, Route Table, Internet GW, NAT GW, Elastic IP</li><li><b>서비스 플로우</b>: 사용자 → ALB(80) → Web(80) → NLB(8080) → WAS(8080)를 화살표와 포트로</li><li><b>관리 플로우</b>: 관리자 PC → Bastion(22) → 각 서버(22)를 다른 선으로</li><li><b>Security Group</b>: 자원마다 붙은 이름, <b>Storage·백업</b>: 데이터 볼륨과 Protection Group</li></ul>
<h3>리소스 내역서</h3>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>구분</th><th>이름</th><th>주요 설정</th><th>위치(VPC·Subnet)</th><th>연결된 자원</th></tr></thead><tbody>
<tr><td class="nw"><b>네트워크</b></td><td></td><td>CIDR, Route Table</td><td></td><td></td></tr>
<tr><td class="nw"><b>VM</b></td><td></td><td>Instance Type, Image, 사설 IP</td><td></td><td></td></tr>
<tr><td class="nw"><b>Load Balancer</b></td><td></td><td>종류, Listener, Target Group, Health Check</td><td></td><td></td></tr>
<tr><td class="nw"><b>Security Group</b></td><td></td><td>Ingress 포트 / 출발지</td><td></td><td></td></tr>
<tr><td class="nw"><b>Volume</b></td><td></td><td>크기, Volume Type, 마운트 위치</td><td></td><td></td></tr>
<tr><td class="nw"><b>Protection Group</b></td><td></td><td>주기, 로컬·원격 보관 기간</td><td></td><td></td></tr>
<tr><td class="nw"><b>Elastic IP</b></td><td></td><td>연결 대상</td><td></td><td></td></tr>
</tbody></table></div>
<h3>작업 절차 최종 보고서의 목차</h3>
<ol><li>개요: 고객 요구사항과 이 문서의 범위</li><li>설계: 구성도, 요구사항 ↔ 설계 요소 대응표, 설계 결정과 이유</li><li>구축 절차: 만든 순서대로 작업 내용과 설정 값</li><li>검증 결과: 검증 항목, 방법, 기대 결과, 실제 결과</li><li>백업·복구 정책과 복구 검증 결과(걸린 시간 포함)</li><li>운영: 상태 점검 방법, 확인할 Event</li><li>남은 문제와 개선 제안</li></ol>

<h2 id="s10">직접 해 보기</h2>
<p>고객이 "WAS의 데이터는 최대 2시간까지만 잃어도 되고, WAS 서버 전체가 있는 저장소에 문제가 생겨도 하루 전 데이터는 남아 있어야 한다"고 요청했다. Protection Group의 로컬 주기와 원격 설정을 정해 보자. 또 내 PC에서 WAS로 SSH가 바로 된다면 어디를 고쳐야 하는가?</p>
<details class="fold"><summary>답 보기</summary><p>예: 로컬 주기를 2시간 이하(예: 2시간마다)로 하고, B2OS를 켜서 원격 스냅샷을 로컬 12개마다(2 × 12 = 24시간) 보낸다. SSH가 바로 된다면 WAS에 Elastic IP가 붙어 있는지, was-sg의 22번 출발지가 bastion-sg가 아닌 넓은 범위로 열려 있는지 확인해 고친다.</p></details>
`,
summary:['요구사항마다 설계 요소와 확인 방법을 정한 뒤 구축한다.','ALB, Web, Bastion, NAT GW는 Public Subnet에, NLB와 WAS는 Private Subnet에 둔다. Elastic IP는 ALB, Bastion, NAT GW에만 붙인다.','관리 접속은 Bastion 하나로만 들어가고, 내부 서버의 22번은 bastion-sg에서만 허용한다.','Security Group은 ALB → Web → NLB → WAS 순서로 바로 앞 계층만 출발지로 허용한다.','WAS의 데이터는 데이터 볼륨에 두고 fstab에 등록한다. 여러 서버가 같은 파일을 쓰려면 File Storage를 검토한다.','Protection Group 정책은 RPO에서 출발하고, 복구를 실제로 해 보아 검증한다.','검증은 허용한 경로가 되는지와 막은 경로가 막히는지를 함께 본다.','채운 산출물은 outputs/에 두고 커밋하지 않는다.'],
essay:[
{q:'실습 과제 3의 요구사항 하나를 골라 설계 요소와 확인 방법으로 옮겨 보세요.',a:'예: "내부 서버 접근 통제"는 Bastion 하나에만 Elastic IP와 22번(관리자 IP /32)을 열고, Web·WAS의 22번은 bastion-sg에서만 허용하는 설계로 옮긴다. 확인은 Bastion을 거친 SSH는 되고 내 PC에서 WAS로 바로 하는 SSH는 안 되는지 본다.'},
{q:'Web 서버가 Public Subnet에 있어도 사용자가 ALB를 거쳐야만 닿는 이유를 설명해 보세요.',a:'Web 서버에 Elastic IP를 붙이지 않아 밖에서 닿을 주소가 없고, web-sg의 80번 출발지가 alb-sg이므로 ALB를 거친 요청만 받는다.'},
{q:'ALB에서 WAS까지의 Security Group 체인을 설명해 보세요.',a:'alb-sg는 서비스 대상에게 80번을 열고, web-sg는 alb-sg에서 오는 80번만, nlb-sg는 web-sg에서 오는 8080번만, was-sg는 NLB 뒤에서 보이는 출발지(nlb-sg 또는 web-sg)의 8080번만 받는다. 각 계층은 바로 앞 계층에서 오는 접속만 받는다.'},
{q:'WAS 2대가 같은 파일을 함께 써야 할 때 데이터 볼륨만으로 부족한 이유를 설명해 보세요.',a:'데이터 볼륨은 VM 하나에 붙는 Block Storage라 두 서버가 같은 볼륨의 파일을 함께 쓸 수 없다. 함께 써야 하면 File Storage를 검토한다.'},
{q:'Protection Group 정책을 정하는 순서를 설명해 보세요.',a:'잃어도 되는 데이터의 범위(RPO)를 먼저 정하고, 로컬 스냅샷 주기를 그보다 짧게 한다. 되돌릴 기간에 맞춰 보관 기간을 정하고, 로컬 저장소 바깥에도 사본이 필요하면 B2OS의 원격 주기와 보관 기간을 정한다. 마지막으로 복구를 실제로 해 보아 검증한다.'},
{q:'구축 결과를 검증할 때 "막은 경로가 막히는지"도 확인하는 이유는 무엇인가요?',a:'허용한 경로만 보면 설정이 너무 넓게 열려 있어도 알 수 없다. 내 PC에서 WAS로 직접 SSH하거나 Bastion에서 WAS의 서비스 포트로 접속해 막히는지 보아야 접근 통제가 의도대로인지 확인할 수 있다.'}
],
quiz:[
{v:[
 {q:'참조 아키텍처를 따를 때 Public Subnet에 두는 것은?',o:['ALB, Web, Bastion, NAT GW','NLB, WAS','WAS, 데이터 볼륨','NLB, Bastion'],e:'Public Tier에는 ALB, Web, NAT GW, Bastion이 있다. NLB와 WAS는 Private Tier에 있다.'},
 {q:'참조 아키텍처를 따를 때 Private Subnet에 두는 것은?',o:['NLB와 WAS','ALB와 Web','Bastion','NAT GW'],e:'WAS와 그 앞의 NLB는 Private Tier에 둔다.'}
]},
{v:[
 {q:'이 설계에서 Elastic IP를 붙이는 자원은?',o:['ALB, Bastion, NAT GW','Web 1, Web 2','WAS 1, WAS 2','NLB'],e:'밖과 직접 통신해야 하는 ALB, Bastion, NAT GW에만 붙인다. Web과 WAS에는 붙이지 않는다.'},
 {q:'Web 서버가 Public Subnet에 있지만 밖에서 직접 닿지 않게 하는 방법은?',o:['Elastic IP를 붙이지 않고 web-sg의 80번 출발지를 alb-sg로 둔다','Route Table을 지운다','Web 서버를 중지한다','web-sg의 80번을 0.0.0.0/0으로 연다'],e:'공인 주소가 없고 ALB에서 오는 요청만 허용하면 ALB를 거쳐야만 닿는다.'}
]},
{q:'Private Subnet의 Route Table에서 0.0.0.0/0의 대상은?',o:['NAT GW','Internet GW','Bastion','ALB'],e:'Private Subnet은 NAT GW로 밖에 나가고, 밖에서 들어오는 접속은 받지 않는다.'},
{v:[
 {q:'Bastion의 역할은?',o:['내부 서버로 들어가는 관리 접속의 유일한 입구','사용자의 HTTP 요청을 나누는 장치','Private Subnet의 아웃바운드 통로','데이터 백업 저장소'],e:'관리자는 Bastion을 거쳐서만 내부 서버에 SSH로 접속한다.'},
 {q:'Web과 WAS의 22번 출발지로 알맞은 것은?',o:['bastion-sg','0.0.0.0/0','alb-sg','nlb-sg'],e:'관리 접속은 Bastion을 거친 것만 허용한다.'}
]},
{q:'Bastion을 거쳐 내부 서버에 접속할 때 개인키를 다루는 방법으로 알맞은 것은?',o:['개인키는 내 PC에 두고 ssh -J로 Bastion을 거쳐 접속한다','개인키를 Bastion에 복사해 둔다','개인키를 Security Group에 등록한다','개인키를 보고서에 적어 둔다'],e:'ssh -J(ProxyJump)를 쓰면 개인키를 Bastion에 두지 않고 내부 서버에 접속할 수 있다.'},
{v:[
 {q:'Security Group 체인에서 web-sg의 80번 출발지는?',o:['alb-sg','nlb-sg','was-sg','0.0.0.0/0'],e:'각 계층은 바로 앞 계층에서 오는 접속만 받는다. Web의 앞은 ALB다.'},
 {q:'Security Group 체인에서 nlb-sg의 서비스 포트 출발지는?',o:['web-sg','alb-sg','bastion-sg','0.0.0.0/0'],e:'NLB는 Web 서버에서 오는 요청만 받는다.'}
]},
{q:'Security Group 체인의 원칙으로 맞는 것은?',o:['각 계층은 바로 앞 계층의 Security Group에서 오는 접속만 받는다','모든 계층이 0.0.0.0/0을 허용한다','뒤 계층이 앞 계층으로만 접속한다','Security Group은 하나만 만든다'],e:'앞 계층을 건너뛴 접속은 막히므로 각 계층에 들어오는 경로가 하나로 정해진다.'},
{q:'WAS의 애플리케이션 데이터를 두는 곳으로 알맞은 것은?',o:['데이터 볼륨','Boot Volume','Bastion','ALB'],e:'데이터를 OS와 나누어 데이터 볼륨에 두면 크기, 성능, 보호 정책을 따로 정할 수 있다.'},
{q:'WAS 2대가 같은 파일을 함께 읽고 써야 할 때 검토할 저장소는?',o:['File Storage','각 WAS의 Boot Volume','Elastic IP','Security Group'],e:'볼륨은 VM 하나에 붙는 Block Storage다. 여러 서버가 같은 파일을 쓰려면 File Storage를 검토한다.'},
{v:[
 {q:'RPO의 뜻은?',o:['장애가 났을 때 잃어도 되는 데이터의 최대 시간 범위','서비스를 다시 제공하기까지 허용하는 최대 시간','백업을 보관하는 기간','스냅샷의 개수'],e:'RPO는 복구 시점 목표다. 복구 시간 목표는 RTO다.'},
 {q:'RPO가 4시간일 때 로컬 스냅샷 주기로 알맞은 것은?',o:['4시간 이하','하루','일주일','RPO와 관계없다'],e:'마지막 스냅샷 이후의 변경을 잃으므로 주기가 RPO보다 길면 안 된다.'}
]},
{q:'Protection Group의 Remote snapshots every가 4이고 로컬 주기가 6시간일 때 원격 사본의 주기는?',o:['24시간','10시간','6시간','4시간'],e:'원격은 로컬 스냅샷 4개마다 만들어지므로 6 × 4 = 24시간이다.'},
{v:[
 {q:'백업 정책을 마련한 뒤 반드시 할 일은?',o:['실제로 복구해 데이터가 돌아오는지 확인한다','스냅샷을 모두 지운다','Protection Group을 끈다','Volume Type을 바꾼다'],e:'복구해 보지 않은 백업은 믿을 수 없다.'},
 {q:'복구 검증에서 걸린 시간을 기록하는 이유는?',o:['RTO를 정하고 지킬 수 있는지 판단하는 근거가 된다','RPO를 줄이기 위해','Event를 지우기 위해','Security Group을 만들기 위해'],e:'복구에 걸린 시간이 서비스를 다시 제공하기까지의 시간을 보여 준다.'}
]},
{v:[
 {q:'접근 통제를 검증하는 방법으로 알맞은 것은?',o:['허용한 경로가 되는지와 막은 경로가 막히는지를 모두 확인한다','허용한 경로만 확인한다','Security Group 이름만 확인한다','LB 상태만 확인한다'],e:'막은 경로도 시험해야 설정이 너무 넓게 열려 있지 않은지 알 수 있다.'},
 {q:'내 PC에서 WAS로 SSH가 바로 된다면 먼저 확인할 것은?',o:['WAS에 Elastic IP가 붙었는지와 was-sg의 22번 출발지','ALB의 Listener 포트','Protection Group 주기','Volume Type'],e:'WAS는 Elastic IP가 없고 22번은 bastion-sg에서만 허용해야 한다.'}
]},
{q:'Web 이중화를 검증하는 방법은?',o:['Web 1을 중지하고 ALB로 반복 요청해 Web 2가 응답하는지 본다','Web 1의 Volume Type을 바꾼다','Bastion을 중지한다','NAT GW를 지운다'],e:'한 대를 멈춰도 다른 대상으로 요청이 가는지 확인한다.'},
{v:[
 {q:'아키텍처 구성도에서 서비스 플로우와 관리 플로우를 구분해 그리는 이유는?',o:['사용자 요청의 경로와 관리 접속(SSH)의 경로가 다르기 때문','둘이 같은 경로이기 때문','관리 플로우는 그리지 않아도 되기 때문','Security Group을 숨기기 위해'],e:'사용자는 ALB로, 관리자는 Bastion으로 들어가므로 경로를 나누어 그린다.'},
 {q:'리소스 내역서에 적는 것으로 알맞은 것은?',o:['자원의 이름, 주요 설정, 위치, 연결된 자원','개인키와 비밀번호','고객사의 단가','다른 Project의 Event'],e:'내역서는 만든 자원과 설정, 관계를 정리한 문서다. 비밀 정보는 적지 않는다.'}
]}
],
tasks:[{title:'실습 과제 3) Zadara Cloud 기반 고객 Web 서비스 인프라 구축 및 운영',items:['Web/App 서버 2대씩 구성 및 서비스 이중화','Load Balancer를 통한 외부 HTTP 서비스 제공','Public/Private Subnet 구분','내부 서버 접근 통제 방안','Storage 연결 및 데이터 저장 방식','Protection Group을 통한 백업·복구 절차와 정책 마련','SG를 사용한 Network 및 접근 제어'],note:'제출물은 인프라 아키텍처 구성도(네트워크 및 서비스 플로우), 리소스 내역서, 작업 절차 최종 보고서다. 본문의 빈 양식을 쓰고, 채운 문서는 outputs/에 두고 커밋하지 않는다.'}]
});
