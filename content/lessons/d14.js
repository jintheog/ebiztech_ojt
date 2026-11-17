OJT.lesson({
id:'d14', week:4, day:'14', tag:'일차 14', mins:'약 3시간',
title:'Cloud Computing: 서비스 모델, 배포 모델, 공동 책임 모델',
cover:[['IaaS/PaaS/SaaS','s2'],['Shared Responsibility','s3'],['Public/Private/Hybrid Cloud','s5'],['서비스 유형·책임 범위 설명','s4']],
act:'클라우드 서비스 유형·책임 범위 설명',
goal:['지금까지 배운 서버·가상화·네트워크·스토리지·데이터 보호가 클라우드의 어느 계층에 놓이는지 설명할 수 있다','IaaS·PaaS·SaaS에서 고객이 받는 것과 직접 하는 일을 구분할 수 있다','공동 책임 모델 표를 보고 계층마다 고객과 클라우드 사업자 중 누구 몫인지 말할 수 있다','클라우드여도 데이터와 백업, Security Group 규칙, 계정 관리가 고객 몫인 이유를 설명할 수 있다','퍼블릭·프라이빗·하이브리드 클라우드와 멀티 클라우드를 구분하고, Zadara가 어디에 해당하는지 회사 자료로 설명할 수 있다'],
terms:[
['클라우드 컴퓨팅','Cloud Computing','서버·스토리지·네트워크 같은 IT 자원을 필요할 때 네트워크로 빌려 쓰고, 쓴 만큼 비용을 내는 방식([[w1-2]]).'],
['서비스 모델','Service Model','클라우드 사업자가 어디까지 만들어서 빌려주느냐에 따른 구분. IaaS, PaaS, SaaS.'],
['IaaS','Infrastructure as a Service','VM·스토리지·네트워크 같은 인프라를 빌려주는 서비스. OS부터 위는 고객이 관리한다.'],
['PaaS','Platform as a Service','앱을 실행할 환경(OS, 런타임, DB 엔진 등)까지 사업자가 관리해 주는 서비스. 고객은 앱과 데이터에 집중한다.'],
['SaaS','Software as a Service','완성된 소프트웨어를 웹이나 앱으로 빌려 쓰는 서비스. 고객은 데이터와 사용자 계정을 관리한다.'],
['런타임','Runtime','앱이 실행되는 데 필요한 환경. 예: Java, Python 실행 환경, 웹 서버·WAS 프로그램, DB 엔진.'],
['공동 책임 모델','Shared Responsibility Model','클라우드에서 보안과 운영의 책임을 클라우드 사업자와 고객이 계층별로 나눠 지는 것. 책임 공유 모델이라고도 한다.'],
['클라우드의 보안 / 클라우드 안의 보안','Security of the Cloud / Security in the Cloud','사업자가 지키는 기반(데이터센터, 장비, 하이퍼바이저) / 고객이 지키는 것(데이터, 계정, 설정).'],
['IAM','Identity and Access Management','클라우드에서 사용자와 권한을 관리하는 기능. 누가 어떤 자원에 무엇을 할 수 있는지 정한다.'],
['관리형 서비스','Managed Service','설치, 패치, 백업 같은 운영 일을 사업자가 대신 해 주는 서비스. 관리형 DB 등.'],
['배포 모델','Deployment Model','클라우드를 누가 쓰고 어디에 두느냐에 따른 구분. 퍼블릭, 프라이빗, 하이브리드.'],
['퍼블릭 클라우드','Public Cloud','클라우드 사업자의 데이터센터에 있는 자원을 여러 고객이 나눠 쓰는 클라우드.'],
['프라이빗 클라우드','Private Cloud','한 조직만 쓰는 전용 클라우드. 그 조직의 데이터센터나 다른 곳의 전용 장비에 둔다.'],
['하이브리드 클라우드','Hybrid Cloud','온프레미스·프라이빗 클라우드와 퍼블릭 클라우드를 연결해 하나처럼 함께 쓰는 것.'],
['멀티 클라우드','Multi-Cloud','여러 클라우드 사업자의 서비스를 함께 쓰는 것.'],
['데이터 주권','Data Sovereignty','데이터를 어느 나라, 어느 장소에 두고 누가 통제하느냐에 대한 요구. 법이나 규정으로 정해지기도 한다.'],
['전용 연결','Dedicated Connection','인터넷을 거치지 않고 데이터센터와 클라우드를 잇는 전용 회선. AWS Direct Connect, Azure ExpressRoute 등.']
],
body:`
<h2 id="s1">지금까지 배운 것이 클라우드의 어디에 놓이나</h2>
<p>클라우드가 무엇인지, 온프레미스와 무엇이 다른지, IaaS·PaaS·SaaS와 퍼블릭·프라이빗의 뜻은 <a data-lesson="w1-2"></a>에서 배웠습니다. 이 레슨은 한 단계 더 들어가서, <b>지금까지 배운 기술이 클라우드에서 누구 몫인지</b>를 연결합니다.</p>
<p>서비스 하나는 아래처럼 여러 계층이 쌓여서 돌아갑니다. 계층마다 어느 레슨에서 배웠는지 함께 적었습니다.</p>
<div class="layers" style="max-width:none">
<div class="l1"><b>데이터, 계정·권한</b><span>데이터 보호 <a data-lesson="d13"></a> · 계정과 권한 <a data-lesson="d04"></a></span></div>
<div class="l1"><b>앱</b><span>Web·WAS·DB의 역할 <a data-lesson="d01"></a></span></div>
<div class="l1"><b>런타임</b><span>웹 서버·WAS 프로그램, DB 엔진 <a data-lesson="d05"></a></span></div>
<div class="l1"><b>게스트 OS</b><span>Linux <a data-lesson="d03"></a>~<a data-lesson="d06"></a></span></div>
<div><b>네트워크 설정</b><span>Subnet, 라우팅, Security Group <a data-lesson="d07"></a>~<a data-lesson="d10"></a></span></div>
<div><b>VM, 하이퍼바이저</b><span>가상화 <a data-lesson="d02"></a></span></div>
<div class="l0"><b>물리 서버, 스토리지, 네트워크 장비, 데이터센터</b><span><a data-lesson="w1-1"></a>, <a data-lesson="d02"></a>, <a data-lesson="d11"></a>, <a data-lesson="d12"></a></span></div>
</div>
<p class="small muted">아래로 갈수록 기반이고, 위로 갈수록 서비스를 쓰는 쪽에 가깝습니다. 런타임은 앱이 실행되는 데 필요한 환경(웹 서버·WAS 프로그램, Java 실행 환경, DB 엔진 등)입니다.</p>
<p>온프레미스에서는 이 모든 계층을 회사가 직접 사고, 설치하고, 운영합니다. 클라우드에서는 <b>아래쪽 계층부터 일부를 클라우드 사업자가 맡고</b>, 어디까지 맡느냐가 서비스 모델(IaaS·PaaS·SaaS)입니다. 그 경계를 정리한 것이 이 레슨의 중심인 <b>공동 책임 모델</b>입니다.</p>

<h2 id="s2">서비스 모델 다시 보기: IaaS, PaaS, SaaS</h2>
<p><a data-lesson="w1-2"></a>의 표를 "고객이 무엇을 받고, 무엇을 직접 하나"로 다시 봅니다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>IaaS</th><th>PaaS</th><th>SaaS</th></tr></thead><tbody>
<tr><td class="nw"><b>고객이 받는 것</b></td><td>VM, Volume, 가상 네트워크(VPC·Subnet), 로드밸런서</td><td>앱을 올리기만 하면 되는 실행 환경, 관리형 DB</td><td>완성된 소프트웨어</td></tr>
<tr><td class="nw"><b>고객이 직접 하는 일</b></td><td>OS 설치·패치, 런타임과 앱 설치, 네트워크와 Security Group 설정, 백업 설정, 계정 관리</td><td>앱 코드 배포, 데이터, 접근 권한, 일부 설정(백업 보관 기간 등)</td><td>데이터, 사용자 계정과 권한, 공유 설정</td></tr>
<tr><td class="nw"><b>자유도</b></td><td>가장 높음</td><td>중간</td><td>가장 낮음</td></tr>
<tr><td class="nw"><b>운영 부담</b></td><td>가장 큼</td><td>중간</td><td>가장 작음</td></tr>
<tr><td class="nw"><b>예</b></td><td>AWS EC2, Zadara zCompute의 VM</td><td>관리형 DB(AWS RDS 등), 관리형 쿠버네티스</td><td>Microsoft 365, Gmail, Zoom</td></tr>
</tbody></table></div>
<p class="small muted">EC2: Elastic Compute Cloud · RDS: Relational Database Service. 예는 모델을 이해하기 위한 것입니다. 같은 사업자 안에서도 서비스마다 모델이 다릅니다.</p>
<p><mark>사업자가 더 많이 맡을수록 운영은 편해지지만, 고객이 바꿀 수 있는 범위는 줄어듭니다.</mark> 예를 들어 DB를 IaaS의 VM에 직접 설치하면 DB 버전과 설정을 마음대로 고를 수 있지만, OS 패치와 DB 백업을 직접 해야 합니다. 관리형 DB(PaaS)를 쓰면 패치와 백업을 사업자가 해 주지만, 고를 수 있는 버전과 설정이 정해져 있습니다.</p>
<p class="small muted">"as a Service"는 다른 자원에도 붙습니다. 스토리지를 빌려주면 STaaS(Storage as a Service), DB를 빌려주면 DBaaS(Database as a Service)라고 부릅니다. 크게 보면 각각 IaaS나 PaaS의 한 종류입니다.</p>

<h2 id="s3">공동 책임 모델: 계층마다 누구 몫인가</h2>
<p><b>공동 책임 모델</b><span class="small muted">(Shared Responsibility Model)</span>은 클라우드에서 보안과 운영의 책임을 <b>클라우드 사업자와 고객이 계층별로 나눠 지는 것</b>입니다. <a data-lesson="w1-2"></a>와 <a data-lesson="d02"></a>에서는 "책임 공유 모델"이라는 이름으로 예고했습니다. 흔히 이렇게 요약합니다.</p>
<ul><li><b>클라우드의 보안</b><span class="small muted">(Security of the Cloud)</span>: 데이터센터, 장비, 하이퍼바이저처럼 클라우드 자체를 지키는 것은 <b>사업자</b> 몫입니다.</li><li><b>클라우드 안의 보안</b><span class="small muted">(Security in the Cloud)</span>: 고객이 클라우드에 올린 데이터, 계정, 설정을 지키는 것은 <b>고객</b> 몫입니다.</li></ul>
<p>아래 표가 이 레슨에서 가장 중요한 표입니다. "고객"은 그 계층을 고객이 관리한다는 뜻이고, "사업자"는 클라우드 사업자가 관리한다는 뜻입니다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>계층</th><th>온프레미스</th><th>IaaS</th><th>PaaS</th><th>SaaS</th><th>배운 곳</th></tr></thead><tbody>
<tr><td class="nw"><b>데이터</b> (백업 포함)</td><td class="nw">고객</td><td class="nw"><b>고객</b></td><td class="nw"><b>고객</b></td><td class="nw"><b>고객</b></td><td><a data-lesson="d13"></a></td></tr>
<tr><td class="nw"><b>계정·권한</b></td><td class="nw">고객</td><td class="nw"><b>고객</b></td><td class="nw"><b>고객</b></td><td class="nw"><b>고객</b></td><td><a data-lesson="d04"></a>, <a data-lesson="zc1"></a></td></tr>
<tr><td class="nw"><b>앱</b></td><td class="nw">고객</td><td class="nw">고객</td><td class="nw">고객</td><td class="nw">사업자</td><td><a data-lesson="d01"></a></td></tr>
<tr><td class="nw"><b>런타임</b></td><td class="nw">고객</td><td class="nw">고객</td><td class="nw">사업자</td><td class="nw">사업자</td><td><a data-lesson="d05"></a></td></tr>
<tr><td class="nw"><b>게스트 OS</b> (패치 포함)</td><td class="nw">고객</td><td class="nw">고객</td><td class="nw">사업자</td><td class="nw">사업자</td><td><a data-lesson="d03"></a>~<a data-lesson="d06"></a></td></tr>
<tr><td class="nw"><b>네트워크 설정</b> (Subnet, Security Group 규칙 등)</td><td class="nw">고객</td><td class="nw"><b>고객</b></td><td class="nw">나눠서</td><td class="nw">사업자</td><td><a data-lesson="d08"></a>, <a data-lesson="d10"></a></td></tr>
<tr><td class="nw"><b>VM</b> (만들기, 크기, 연결할 Volume)</td><td class="nw">고객</td><td class="nw">고객</td><td class="nw">사업자</td><td class="nw">사업자</td><td><a data-lesson="d02"></a></td></tr>
<tr><td class="nw"><b>하이퍼바이저</b></td><td class="nw">고객</td><td class="nw">사업자</td><td class="nw">사업자</td><td class="nw">사업자</td><td><a data-lesson="d02"></a></td></tr>
<tr><td class="nw"><b>물리 서버</b></td><td class="nw">고객</td><td class="nw">사업자</td><td class="nw">사업자</td><td class="nw">사업자</td><td><a data-lesson="d02"></a></td></tr>
<tr><td class="nw"><b>스토리지</b> (장비, RAID)</td><td class="nw">고객</td><td class="nw">사업자</td><td class="nw">사업자</td><td class="nw">사업자</td><td><a data-lesson="d11"></a>, <a data-lesson="d12"></a></td></tr>
<tr><td class="nw"><b>네트워크 장비</b></td><td class="nw">고객</td><td class="nw">사업자</td><td class="nw">사업자</td><td class="nw">사업자</td><td><a data-lesson="d08"></a></td></tr>
<tr><td class="nw"><b>데이터센터</b> (전원, 냉각, 출입)</td><td class="nw">고객</td><td class="nw">사업자</td><td class="nw">사업자</td><td class="nw">사업자</td><td><a data-lesson="w1-1"></a></td></tr>
</tbody></table></div>
<p class="small muted">PaaS의 네트워크 설정은 서비스에 따라 다릅니다. 관리형 DB라도 어느 Subnet에 둘지, 어디서 접속을 허용할지(Security Group)는 고객이 정하는 경우가 많습니다. 이 표는 일반적인 나눔이고, 실제 경계는 서비스와 계약마다 다르므로 그 서비스의 문서에서 확인합니다.</p>
<div class="box mem"><span class="lbl">외울 것</span><ul><li>표의 맨 위 두 줄, <b>데이터와 계정·권한은 어느 모델에서든 고객 몫</b>입니다. SaaS여도 마찬가지입니다.</li><li>IaaS에서 사업자와 고객의 경계는 <b>하이퍼바이저와 VM 사이</b>입니다(<a data-lesson="d02"></a>). VM 안의 OS부터 위는 고객이 관리합니다.</li><li>PaaS로 갈수록 사업자 몫이 OS·런타임까지 올라오고, SaaS에서는 앱까지 올라옵니다.</li></ul></div>
<svg class="fig" viewBox="0 0 560 330" role="img" aria-label="공동 책임 모델을 그림으로 나타냈다. 온프레미스는 모든 계층이 고객 몫이다. IaaS는 데이터·계정, 앱, 런타임, OS, 네트워크 설정·VM이 고객 몫이고, 하이퍼바이저부터 데이터센터까지가 사업자 몫이다. PaaS는 데이터·계정과 앱이 고객 몫이고, 런타임과 OS는 사업자 몫이며, 네트워크 설정은 나눠서 맡고, 그 아래는 사업자 몫이다. SaaS는 데이터·계정만 고객 몫이고 나머지는 모두 사업자 몫이다.">
<text x="198" y="26" class="c b">온프렘</text><text x="300" y="26" class="c b">IaaS</text><text x="402" y="26" class="c b">PaaS</text><text x="504" y="26" class="c b">SaaS</text>
<text x="140" y="64" class="e t-m">데이터·계정</text><text x="140" y="104" class="e t-m">앱</text><text x="140" y="144" class="e t-m">런타임</text><text x="140" y="184" class="e t-m">게스트 OS</text><text x="140" y="224" class="e t-m">네트워크 설정·VM</text><text x="140" y="264" class="e t-m">하이퍼바이저~DC</text>
<rect x="152" y="40" width="92" height="36" class="bx-a"/><rect x="152" y="80" width="92" height="36" class="bx-a"/><rect x="152" y="120" width="92" height="36" class="bx-a"/><rect x="152" y="160" width="92" height="36" class="bx-a"/><rect x="152" y="200" width="92" height="36" class="bx-a"/><rect x="152" y="240" width="92" height="36" class="bx-a"/>
<rect x="254" y="40" width="92" height="36" class="bx-a"/><rect x="254" y="80" width="92" height="36" class="bx-a"/><rect x="254" y="120" width="92" height="36" class="bx-a"/><rect x="254" y="160" width="92" height="36" class="bx-a"/><rect x="254" y="200" width="92" height="36" class="bx-a"/><rect x="254" y="240" width="92" height="36" class="bx-g"/>
<rect x="356" y="40" width="92" height="36" class="bx-a"/><rect x="356" y="80" width="92" height="36" class="bx-a"/><rect x="356" y="120" width="92" height="36" class="bx-g"/><rect x="356" y="160" width="92" height="36" class="bx-g"/><rect x="356" y="200" width="92" height="36" class="bx-n"/><rect x="356" y="240" width="92" height="36" class="bx-g"/>
<rect x="458" y="40" width="92" height="36" class="bx-a"/><rect x="458" y="80" width="92" height="36" class="bx-g"/><rect x="458" y="120" width="92" height="36" class="bx-g"/><rect x="458" y="160" width="92" height="36" class="bx-g"/><rect x="458" y="200" width="92" height="36" class="bx-g"/><rect x="458" y="240" width="92" height="36" class="bx-g"/>
<text x="198" y="64" class="c t-m">고객</text><text x="198" y="104" class="c t-m">고객</text><text x="198" y="144" class="c t-m">고객</text><text x="198" y="184" class="c t-m">고객</text><text x="198" y="224" class="c t-m">고객</text><text x="198" y="264" class="c t-m">고객</text>
<text x="300" y="64" class="c t-m">고객</text><text x="300" y="104" class="c t-m">고객</text><text x="300" y="144" class="c t-m">고객</text><text x="300" y="184" class="c t-m">고객</text><text x="300" y="224" class="c t-m">고객</text><text x="300" y="264" class="c t-m">사업자</text>
<text x="402" y="64" class="c t-m">고객</text><text x="402" y="104" class="c t-m">고객</text><text x="402" y="144" class="c t-m">사업자</text><text x="402" y="184" class="c t-m">사업자</text><text x="402" y="224" class="c t-m">나눠서</text><text x="402" y="264" class="c t-m">사업자</text>
<text x="504" y="64" class="c t-m">고객</text><text x="504" y="104" class="c t-m">사업자</text><text x="504" y="144" class="c t-m">사업자</text><text x="504" y="184" class="c t-m">사업자</text><text x="504" y="224" class="c t-m">사업자</text><text x="504" y="264" class="c t-m">사업자</text>
<rect x="152" y="300" width="22" height="18" class="bx-a"/><text x="182" y="315" class="t-s">고객 몫</text>
<rect x="282" y="300" width="22" height="18" class="bx-g"/><text x="312" y="315" class="t-s">사업자 몫</text>
<rect x="420" y="300" width="22" height="18" class="bx-n"/><text x="450" y="315" class="t-s">나눠서</text>
</svg>
<p class="fig-cap">위의 표를 여섯 묶음으로 줄인 그림입니다. 맨 윗줄(데이터·계정)은 네 모델 모두 고객 몫입니다.</p>

<h2 id="s4">클라우드여도 고객 몫인 것</h2>
<p>"클라우드로 옮기면 운영과 보안은 사업자가 다 해 준다"는 흔한 오해입니다. 사업자가 맡는 것은 표의 아래쪽입니다. 실제 사고는 <b>고객 몫인 위쪽</b>에서 많이 일어납니다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th style="width:22%">고객 몫</th><th style="width:44%">고객이 하지 않으면 생기는 일</th><th style="width:34%">배운 곳</th></tr></thead><tbody>
<tr><td><b>데이터와 백업</b></td><td>실수로 지운 데이터, 랜섬웨어에 암호화된 데이터를 되살릴 수 없음. 사업자의 장비가 이중화되어 있어도 고객의 실수는 그대로 반영됨</td><td>RPO·RTO, 3-2-1 규칙, 복구 테스트 <a data-lesson="d13"></a></td></tr>
<tr><td><b>Security Group 규칙</b></td><td>22번 포트나 DB 포트를 0.0.0.0/0으로 열어 두면 인터넷 전체에서 공격이 들어옴. 사업자는 고객이 연 규칙을 막아 주지 않음</td><td>규칙 읽기, 최소 허용 <a data-lesson="d10"></a></td></tr>
<tr><td><b>계정과 권한</b></td><td>쉬운 비밀번호, 공유한 관리자 계정, 코드에 적은 키가 새어 나가면 누군가 자원을 지우거나 데이터를 가져감</td><td>계정·권한 <a data-lesson="d04"></a>, 시크릿 키 <a data-lesson="d12"></a>, IAM <a data-lesson="zc1"></a></td></tr>
<tr><td><b>OS 패치</b> (IaaS)</td><td>VM의 OS를 업데이트하지 않으면 알려진 취약점이 그대로 남음. IaaS에서 VM 안은 사업자가 손대지 않음</td><td>Linux 운영 <a data-lesson="d05"></a></td></tr>
<tr><td><b>공개 설정</b></td><td>Object Storage 버킷을 누구나 읽게 열어 두면 주소만 알면 누구든 내려받음</td><td><a data-lesson="d12"></a></td></tr>
</tbody></table></div>
<div class="box warn"><span class="lbl">"사업자가 이중화했으니 백업은 필요 없다"는 틀린 생각입니다</span><p>사업자가 디스크를 RAID로 묶고 장비를 이중화하는 것은 <b>사업자 몫인 장비 고장</b>에 대비하는 것입니다. 고객이 데이터를 지우거나 덮어쓰면 그 변경도 이중화된 장비에 그대로 반영됩니다(<a data-lesson="d11"></a>, <a data-lesson="d13"></a>). 데이터를 과거 시점으로 되돌릴 수 있게 스냅샷과 백업을 설정하고, 복구를 시험해 보는 것은 <b>고객의 일</b>입니다.</p></div>
<p class="small muted">사업자가 백업 기능을 제공하더라도, 그 기능을 켜고, 보관 기간을 정하고, 복구가 되는지 확인하는 것은 보통 고객이 합니다. 어디까지 사업자가 해 주는지는 서비스와 계약마다 다르므로 문서와 계약서에서 확인합니다.</p>

<h2 id="s5">배포 모델: 퍼블릭, 프라이빗, 하이브리드</h2>
<p>서비스 모델이 "어디까지 빌리나"라면, 배포 모델은 "<b>누가 쓰고, 어디에 있고, 누가 운영하나</b>"입니다. 뜻은 <a data-lesson="w1-2"></a>에서 배웠고, 여기서는 세 가지 질문으로 비교합니다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>퍼블릭 클라우드</th><th>프라이빗 클라우드</th><th>하이브리드 클라우드</th></tr></thead><tbody>
<tr><td class="nw"><b>누가 쓰나</b></td><td>여러 고객이 나눠 씀</td><td>한 조직만 씀</td><td>한 조직이 두 가지를 함께 씀</td></tr>
<tr><td class="nw"><b>어디에 있나</b></td><td>클라우드 사업자의 데이터센터</td><td>그 조직의 데이터센터, 또는 다른 곳의 전용 장비</td><td>온프레미스·프라이빗 + 퍼블릭, 둘을 네트워크로 연결</td></tr>
<tr><td class="nw"><b>누가 운영하나</b></td><td>클라우드 사업자</td><td>그 조직, 또는 운영을 맡은 업체</td><td>각자 맡은 쪽을 운영</td></tr>
<tr><td class="nw"><b>좋은 점</b></td><td>바로 쓰고 쓴 만큼 냄, 확장이 쉬움</td><td>데이터가 어디 있는지 통제, 전용 자원이라 성능이 일정</td><td>데이터는 안쪽에, 늘었다 줄었다 하는 일은 퍼블릭에</td></tr>
<tr><td class="nw"><b>신경 쓸 점</b></td><td>데이터의 위치와 통제가 사업자에 달림</td><td>장비를 갖추고 운영하는 부담</td><td>두 환경을 잇는 네트워크와 일관된 관리</td></tr>
</tbody></table></div>
<ul><li><b>하이브리드 클라우드</b>는 온프레미스·프라이빗과 퍼블릭을 <b>연결해서 하나처럼</b> 씁니다. 예: 고객 데이터는 사내 프라이빗 클라우드에, 이벤트 기간에 몰리는 웹 서버는 퍼블릭 클라우드에 두고 전용 회선으로 잇습니다.</li><li><b>멀티 클라우드</b>는 <b>여러 사업자</b>의 클라우드를 함께 쓰는 것입니다. 하이브리드는 "위치나 운영 방식이 다른 것을 연결"하는 데, 멀티 클라우드는 "사업자가 여럿"인 데 초점이 있습니다. 둘이 함께 쓰이기도 합니다.</li></ul>
<p class="small muted">회사의 데이터센터와 퍼블릭 클라우드는 인터넷 대신 전용 회선으로 잇는 일이 많습니다. AWS의 Direct Connect, Azure의 ExpressRoute가 그 예입니다. 데이터를 어느 나라·장소에 두고 누가 통제하느냐는 요구를 <b>데이터 주권</b>이라고 하며, 금융·공공 분야에서 프라이빗이나 하이브리드를 고르는 이유가 되기도 합니다.</p>

<h2 id="s6">Zadara는 어디에 해당하나</h2>
<div class="box"><b class="small">회사 자료에서 확인한 것</b><ul style="margin-bottom:0"><li>Zadara는 자신을 <b>퍼블릭 클라우드와 프라이빗 클라우드의 장점을 결합한</b> 엔터프라이즈 클라우드 플랫폼으로 소개합니다. 프라이빗 쪽 장점으로 데이터 주권, 물리적 전용 자원, 보안·성능을, 퍼블릭 쪽 장점으로 사용량 기반 과금, 유연한 확장, 완전 관리형 서비스를 듭니다. 한 문장으로는 "Public Cloud Experience, Private Cloud Control"입니다.</li><li>플랫폼은 Compute·Storage·Network·IAM으로 이루어집니다. 이 과정에서 배우는 <b>zCompute</b>(IaaS)와 <b>zStorage</b>(STaaS, 스토리지를 서비스로 제공)가 그 중심입니다.</li><li>Zadara Edge Cloud(zCompute·zStorage)는 <b>고객의 데이터센터</b>에도, <b>서비스 사업자의 데이터센터</b>에도 둘 수 있습니다. 고객 데이터센터에서는 기존 장비(Legacy) 옆에 놓입니다.</li><li>AWS·Azure·Google Cloud 같은 퍼블릭 클라우드와는 Direct Connect, ExpressRoute, Partner Interconnect 같은 전용 연결로 이어지고, 이 연결로 백업과 재해 복구를 구성하는 그림이 소개되어 있습니다.</li><li>Zadara Global Customer Center가 전문 인력으로 이 클라우드를 관리한다고 되어 있습니다.</li><li>네트워크 구조와 이름, API가 AWS와 호환됩니다. EC2에 해당하는 것이 zCompute VM, EBS·EFS·S3에 해당하는 것이 zStorage의 Block·File·Object, VPC에 해당하는 것이 Zadara VPC입니다(<a data-lesson="d08"></a>, <a data-lesson="d12"></a>).</li></ul></div>
<p>회사 기능 소개 자료는 Zadara의 위치를 <b>"Public Cloud Experience, Private Cloud Control"</b>이라고 표현합니다. 풀어 쓰면, 퍼블릭 클라우드처럼 쓰는 경험(Public Cloud Experience)을 고객이 원하는 장소(고객 데이터센터나 파트너 데이터센터)에서 고객이 통제하며(Private Cloud Control) 쓰는 클라우드입니다. 그래서 고객의 기존 장비나 퍼블릭 클라우드와 연결하면 하이브리드 구성이 됩니다.</p>
<p class="small muted">Zadara 환경에서 공동 책임 모델의 경계가 정확히 어디인지(예: 고객 데이터센터에 둔 경우 장비와 데이터센터를 누가 맡는지, 백업을 어디까지 Zadara가 해 주는지)는 회사 자료로 확인할 수 없어서 쓰지 않았습니다. 고객과의 계약과 운영 방식에 따라 다를 수 있으니 <b>사내 실습 환경에서 확인</b>합니다.</p>

<h2 id="s7">다음 단계: zCompute와 zStorage로</h2>
<p>여기까지가 IT 인프라 기초입니다. 다음 레슨부터는 Zadara의 실제 플랫폼에서 지금까지 배운 것을 직접 만들어 봅니다. zCompute는 IaaS이므로, 공동 책임 모델에서 <b>고객 몫인 부분을 여러분이 직접 설정</b>하게 됩니다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>기초에서 배운 것</th><th>Zadara에서 직접 해 볼 곳</th></tr></thead><tbody>
<tr><td>계정·권한(<a data-lesson="d04"></a>), 데이터와 계정은 고객 몫(이 레슨)</td><td><a data-lesson="zc1"></a>: Region·Account·Project·IAM</td></tr>
<tr><td>Subnet·CIDR(<a data-lesson="d07"></a>), 라우팅·Public/Private(<a data-lesson="d08"></a>), Security Group(<a data-lesson="d10"></a>)</td><td><a data-lesson="zc2"></a>: VPC·Subnet·Route Table·Security Group</td></tr>
<tr><td>VM·하이퍼바이저(<a data-lesson="d02"></a>), SSH 키(<a data-lesson="d04"></a>)</td><td><a data-lesson="zc3"></a>: Instance Type·Image·Key Pair</td></tr>
<tr><td>Linux 운영(<a data-lesson="d03"></a>~<a data-lesson="d05"></a>), 포트와 접속 확인(<a data-lesson="d09"></a>)</td><td><a data-lesson="zc4"></a>: Linux Web 서버 (실습 과제 1)</td></tr>
<tr><td>디스크·마운트(<a data-lesson="d06"></a>), Block Volume(<a data-lesson="d11"></a>), 데이터 보호(<a data-lesson="d13"></a>)</td><td><a data-lesson="zc5"></a>: 데이터 볼륨</td></tr>
<tr><td>이중화·로드밸런서(<a data-lesson="d01"></a>, <a data-lesson="d10"></a>)</td><td><a data-lesson="zc6"></a>: Load Balancing (실습 과제 2)</td></tr>
<tr><td>로그·자원 모니터링(<a data-lesson="d05"></a>)</td><td><a data-lesson="zc7"></a>: Metrics·Events·Alarms</td></tr>
<tr><td>전체 구성과 백업·복구 정책</td><td><a data-lesson="zc8"></a>: 구축 결과 검증 (실습 과제 3)</td></tr>
<tr><td>Block·RAID·iSCSI(<a data-lesson="d11"></a>), File·Object(<a data-lesson="d12"></a>), 스냅샷·백업(<a data-lesson="d13"></a>)</td><td><a data-lesson="zs1"></a>부터 시작하는 zStorage 레슨: VPSA·Pool·Volume, Block, NAS, Object, 데이터 보호</td></tr>
</tbody></table></div>
<p>다음 레슨 <a data-lesson="zc1"></a>에서는 zCompute의 계정과 권한 구조부터 시작합니다. 이 레슨에서 본 것처럼, 계정과 권한은 어느 서비스 모델에서든 고객 몫이기 때문입니다. zStorage는 <a data-lesson="zs1"></a>에서 VPSA·Pool·Volume의 관계부터 배웁니다.</p>

<h2 id="s8">직접 해 보기</h2>
<p>손노트에 풀어 보세요. 먼저 풀고 나서, 문제 아래의 「답 보기」를 눌러 확인합니다.</p>
<h3>1. 누구 몫인가</h3>
<p>아래 일이 IaaS(예: VM을 빌려 쓰는 경우)에서 고객 몫인지 사업자 몫인지 적어 보세요.</p>
<ol><li>VM에 설치한 Rocky Linux의 보안 업데이트</li><li>VM이 돌아가는 물리 서버의 디스크 교체</li><li>Web 서버 VM의 Security Group에서 80번 포트 열기</li><li>DB 데이터의 매일 밤 백업과 복구 테스트</li><li>하이퍼바이저의 보안 패치</li><li>퇴사한 직원의 클라우드 계정 삭제</li></ol>
<details class="fold"><summary>답 보기</summary><p class="small muted">① 고객(IaaS에서 VM 안의 OS는 고객 몫). ② 사업자(물리 서버). ③ 고객(네트워크 설정, Security Group 규칙). ④ 고객(데이터와 백업은 어느 모델에서든 고객 몫). ⑤ 사업자(하이퍼바이저). ⑥ 고객(계정·권한은 어느 모델에서든 고객 몫).</p></details>
<h3>2. 모델이 바뀌면</h3>
<p>회사 DB를 IaaS의 VM에 직접 설치해서 쓰다가 관리형 DB(PaaS)로 옮겼습니다. 고객이 더 이상 하지 않아도 되는 일과, 여전히 해야 하는 일을 나눠 적어 보세요.</p>
<details class="fold"><summary>답 보기</summary><p class="small muted">하지 않아도 되는 일: OS 설치와 패치, DB 엔진 설치와 업데이트, 엔진 수준의 기본 운영(서비스에 따라 백업 실행 자체도). 여전히 해야 하는 일: 데이터 관리, DB 사용자 계정과 권한, 어디서 접속을 허용할지(Security Group 등 네트워크 설정), 백업 보관 기간 설정과 복구 확인. 데이터와 계정은 어느 모델에서든 고객 몫입니다. 정확한 경계는 그 서비스의 문서에서 확인합니다.</p></details>
<h3>3. 배포 모델 고르기</h3>
<p>아래 상황에 퍼블릭, 프라이빗, 하이브리드 가운데 무엇이 알맞은지와 이유를 적어 보세요.</p>
<ol><li>새로 시작하는 작은 회사가 장비를 사지 않고 빨리 서비스를 열고 싶다.</li><li>규정 때문에 고객 데이터를 반드시 회사가 통제하는 곳에 두어야 하는 금융 회사</li><li>고객 데이터는 사내에 두고, 연말에만 몰리는 웹 트래픽은 늘렸다 줄였다 하고 싶은 회사</li></ol>
<details class="fold"><summary>답 보기</summary><p class="small muted">① 퍼블릭. 장비 없이 바로 쓰고 쓴 만큼 냅니다. ② 프라이빗. 데이터가 어디 있는지를 직접 통제합니다(데이터 주권). ③ 하이브리드. 데이터는 안쪽(온프레미스·프라이빗)에, 늘었다 줄었다 하는 웹은 퍼블릭에 두고 전용 회선으로 잇습니다.</p></details>
<h3>4. 오해 바로잡기</h3>
<p>동료가 이렇게 말합니다. 무엇이 틀렸는지 설명해 보세요.</p>
<ol><li>"클라우드 사업자가 장비를 이중화해 두었으니 우리는 백업을 안 해도 된다."</li><li>"SaaS를 쓰면 보안은 전부 사업자 책임이다."</li></ol>
<details class="fold"><summary>답 보기</summary><p class="small muted">① 사업자의 이중화는 장비 고장에 대비하는 것입니다. 고객이 지우거나 덮어쓴 변경, 랜섬웨어의 암호화는 이중화된 장비에도 그대로 반영됩니다. 데이터와 백업은 고객 몫입니다. ② SaaS에서도 데이터와 사용자 계정·권한, 공유 설정은 고객 몫입니다. 쉬운 비밀번호나 잘못된 공유 설정으로 생긴 사고는 고객이 막아야 합니다.</p></details>
`,
summary:['서비스는 데이터·계정 → 앱 → 런타임 → 게스트 OS → 네트워크 설정 → VM·하이퍼바이저 → 물리 서버·스토리지·네트워크 장비·데이터센터로 쌓인다. 클라우드는 아래쪽부터 사업자가 맡고, 어디까지 맡느냐가 서비스 모델이다.','IaaS는 VM·Volume·가상 네트워크를 받고 OS부터 위를 고객이 관리한다. PaaS는 런타임·OS까지 사업자가 맡고 고객은 앱과 데이터에 집중한다. SaaS는 완성된 소프트웨어를 쓰고 고객은 데이터와 계정을 관리한다. 사업자가 많이 맡을수록 편하지만 바꿀 수 있는 범위는 줄어든다.','공동 책임 모델: 클라우드의 보안(데이터센터·장비·하이퍼바이저)은 사업자, 클라우드 안의 보안(데이터·계정·설정)은 고객. IaaS의 경계는 하이퍼바이저와 VM 사이.','데이터와 계정·권한은 온프레미스·IaaS·PaaS·SaaS 모두 고객 몫이다. 실제 경계는 서비스와 계약마다 다르므로 문서에서 확인한다.','클라우드여도 데이터와 백업, Security Group 규칙, 계정 관리, (IaaS의) OS 패치, 공개 설정은 고객 몫이다. 사업자의 이중화는 장비 고장 대비이고 고객의 실수는 막지 못한다.','배포 모델: 퍼블릭(여러 고객, 사업자 데이터센터, 사업자 운영), 프라이빗(한 조직, 자체나 전용 장비), 하이브리드(둘을 연결해 하나처럼). 멀티 클라우드는 사업자가 여럿인 것.','Zadara: 퍼블릭과 프라이빗의 장점을 결합("Public Cloud Experience, Private Cloud Control"). zCompute(IaaS)·zStorage(STaaS)를 고객이나 서비스 사업자의 데이터센터에 두고, 퍼블릭 클라우드와 전용 연결, AWS 호환. 다음은 [[zc1]], [[zs1]].'],
essay:[
{q:'IaaS, PaaS, SaaS에서 고객이 받는 것과 직접 하는 일을 비교해 설명해 보세요.',a:'IaaS에서는 VM, Volume, 가상 네트워크, 로드밸런서 같은 인프라를 받고, OS 설치와 패치, 런타임과 앱 설치, 네트워크와 Security Group 설정, 백업 설정, 계정 관리를 고객이 직접 한다. PaaS에서는 앱을 올리기만 하면 되는 실행 환경이나 관리형 DB를 받고, OS와 런타임은 사업자가 관리하며, 고객은 앱 코드와 데이터, 접근 권한, 일부 설정을 맡는다. SaaS에서는 완성된 소프트웨어를 쓰고, 고객은 데이터와 사용자 계정·권한, 공유 설정을 맡는다. 사업자가 많이 맡을수록 운영은 편해지지만 고객이 바꿀 수 있는 범위는 줄어든다.'},
{q:'공동 책임 모델이 무엇인지 설명하고, IaaS에서 고객과 사업자의 경계가 어디인지 말해 보세요.',a:'공동 책임 모델은 클라우드에서 보안과 운영의 책임을 사업자와 고객이 계층별로 나눠 지는 것이다. 데이터센터, 물리 서버, 스토리지 장비, 네트워크 장비, 하이퍼바이저처럼 클라우드 자체를 지키는 것은 사업자 몫이고(클라우드의 보안), 고객이 올린 데이터, 계정, 설정을 지키는 것은 고객 몫이다(클라우드 안의 보안). IaaS에서 경계는 하이퍼바이저와 VM 사이다. 하이퍼바이저와 그 아래는 사업자가 관리하고, VM 안의 게스트 OS, 런타임, 앱, 네트워크 설정, 데이터, 계정은 고객이 관리한다.'},
{q:'클라우드를 써도 고객 몫으로 남는 것을 세 가지 이상 들고, 각각 하지 않으면 무슨 일이 생기는지 설명해 보세요.',a:'첫째, 데이터와 백업이다. 백업을 하지 않으면 실수로 지운 데이터나 랜섬웨어에 암호화된 데이터를 되살릴 수 없다. 사업자의 이중화는 장비 고장 대비라서 고객의 실수도 그대로 반영된다. 둘째, Security Group 규칙이다. 22번이나 DB 포트를 0.0.0.0/0으로 열어 두면 인터넷 전체에서 공격이 들어오고, 사업자는 고객이 연 규칙을 막아 주지 않는다. 셋째, 계정과 권한이다. 쉬운 비밀번호나 공유 계정, 코드에 적은 키가 새어 나가면 누군가 자원을 지우거나 데이터를 가져간다. 그 밖에 IaaS에서는 VM의 OS 패치, Object Storage 버킷의 공개 설정도 고객 몫이다.'},
{q:'퍼블릭, 프라이빗, 하이브리드 클라우드를 "누가 쓰나, 어디에 있나, 누가 운영하나"로 비교하고, 멀티 클라우드와 하이브리드의 차이를 말해 보세요.',a:'퍼블릭 클라우드는 여러 고객이 나눠 쓰고, 클라우드 사업자의 데이터센터에 있으며, 사업자가 운영한다. 프라이빗 클라우드는 한 조직만 쓰고, 그 조직의 데이터센터나 다른 곳의 전용 장비에 있으며, 그 조직이나 운영을 맡은 업체가 운영한다. 하이브리드 클라우드는 한 조직이 온프레미스·프라이빗과 퍼블릭을 네트워크로 연결해 하나처럼 쓰는 것이고, 각자 맡은 쪽을 운영한다. 하이브리드는 위치나 운영 방식이 다른 것을 연결하는 데 초점이 있고, 멀티 클라우드는 여러 사업자의 클라우드를 함께 쓰는 데 초점이 있다.'},
{q:'회사 자료를 바탕으로 Zadara 클라우드가 배포 모델에서 어디에 해당하는지 설명해 보세요.',a:'Zadara는 퍼블릭 클라우드와 프라이빗 클라우드의 장점을 결합한 엔터프라이즈 클라우드 플랫폼으로 소개된다. 사용량 기반 과금, 유연한 확장, 완전 관리형 서비스 같은 퍼블릭의 장점과, 데이터 주권, 물리적 전용 자원, 보안과 성능 같은 프라이빗의 장점을 함께 내세운다("Public Cloud Experience, Private Cloud Control"). zCompute(IaaS)와 zStorage(STaaS)로 이루어진 Zadara Edge Cloud를 고객의 데이터센터나 서비스 사업자의 데이터센터에 둘 수 있고, AWS·Azure·Google Cloud와 전용 연결로 이어 백업과 재해 복구를 구성할 수 있다. 네트워크 구조와 API는 AWS와 호환된다. 그래서 고객의 기존 장비나 퍼블릭 클라우드와 연결하면 하이브리드 구성이 된다.'},
{q:'"클라우드로 옮기면 운영과 보안은 사업자가 다 해 준다"는 말이 왜 틀렸는지, 지금까지 배운 레슨과 연결해 설명해 보세요.',a:'사업자가 맡는 것은 공동 책임 모델의 아래쪽인 데이터센터, 물리 서버, 스토리지 장비, 네트워크 장비, 하이퍼바이저다. 그 위는 서비스 모델에 따라 고객 몫이 남는다. IaaS라면 Linux OS의 패치와 서비스 운영([[d05]]), Subnet과 Security Group 규칙([[d10]]), 계정과 권한([[d04]]), 데이터의 스냅샷·백업과 복구 테스트([[d13]])를 고객이 해야 한다. 특히 데이터와 계정·권한은 SaaS에서도 고객 몫이다. 사업자의 RAID와 이중화는 장비 고장에 대비할 뿐 고객의 실수나 잘못된 설정을 막아 주지 않는다.'}
],
quiz:[
{v:[
 {q:'IaaS에서 고객이 직접 관리하는 것은?',o:['VM 안의 OS 패치, 앱 설치, Security Group 규칙','하이퍼바이저 패치','물리 서버의 디스크 교체','데이터센터의 전원과 냉각'],e:'IaaS에서 사업자는 하이퍼바이저와 그 아래를, 고객은 VM 안의 OS부터 위와 네트워크 설정을 관리합니다.'},
 {q:'IaaS에서 클라우드 사업자가 관리하는 것은?',o:['하이퍼바이저와 물리 서버','VM의 게스트 OS 업데이트','VM에 설치한 웹 서버 프로그램','고객 데이터의 백업 설정'],e:'IaaS의 경계는 하이퍼바이저와 VM 사이입니다. 그 아래는 사업자, 그 위는 고객 몫입니다([[d02]]).'}
]},
{v:[
 {q:'PaaS에서 IaaS와 달리 사업자가 맡아 주는 것은?',o:['OS와 런타임(실행 환경)','데이터','사용자 계정과 권한','앱 코드'],e:'PaaS에서는 OS와 런타임까지 사업자가 관리하므로, 고객은 앱과 데이터에 집중합니다. 데이터와 계정은 여전히 고객 몫입니다.'},
 {q:'DB를 IaaS의 VM에 직접 설치하는 대신 관리형 DB(PaaS)를 쓸 때의 차이로 맞는 것은?',o:['OS와 DB 엔진의 패치를 사업자가 해 주지만, 고를 수 있는 버전과 설정이 정해져 있다','데이터와 DB 계정 관리도 사업자가 대신 한다','고객이 하는 일이 더 많아진다','네트워크 설정이 필요 없어진다'],e:'사업자가 많이 맡을수록 운영은 편하지만 고객이 바꿀 수 있는 범위는 줄어듭니다. 데이터와 계정은 여전히 고객 몫입니다.'}
]},
{v:[
 {q:'SaaS에서도 고객 몫으로 남는 것은?',o:['데이터와 사용자 계정·권한','앱의 버그 수정','서버의 OS 패치','데이터센터의 출입 통제'],e:'SaaS는 앱까지 사업자가 관리하지만, 데이터와 계정·권한, 공유 설정은 고객이 관리합니다.'},
 {q:'"SaaS를 쓰면 보안은 전부 사업자 책임이다"가 틀린 이유는?',o:['SaaS에서도 데이터와 사용자 계정·권한, 공유 설정은 고객이 관리해야 해서','SaaS는 사업자가 아무것도 관리하지 않아서','SaaS는 고객이 OS를 패치해야 해서','SaaS에는 계정 개념이 없어서'],e:'쉬운 비밀번호나 잘못된 공유 설정으로 생긴 사고는 고객이 막아야 합니다.'}
]},
{v:[
 {q:'서비스 모델이 IaaS → PaaS → SaaS로 갈수록 나타나는 변화는?',o:['사업자가 맡는 범위가 넓어지고, 고객이 바꿀 수 있는 범위는 줄어든다','고객이 맡는 범위가 넓어진다','데이터가 사업자 몫이 된다','하이퍼바이저를 고객이 관리하게 된다'],e:'사업자 몫이 OS·런타임, 이어서 앱까지 올라옵니다. 운영은 편해지지만 자유도는 낮아집니다.'},
 {q:'고객이 OS의 종류와 설정까지 마음대로 고를 수 있는 서비스 모델은?',o:['IaaS','PaaS','SaaS','셋 모두 같다'],e:'IaaS는 VM 안의 OS부터 고객이 관리하므로 자유도가 가장 높고, 그만큼 운영 부담도 큽니다.'}
]},
{v:[
 {q:'공동 책임 모델이란?',o:['클라우드에서 보안과 운영의 책임을 사업자와 고객이 계층별로 나눠 지는 것','모든 책임을 사업자가 지는 것','모든 책임을 고객이 지는 것','여러 고객이 같은 서버를 나눠 쓰는 것'],e:'클라우드의 보안(기반)은 사업자, 클라우드 안의 보안(데이터·계정·설정)은 고객 몫입니다.'},
 {q:'"클라우드의 보안(Security of the Cloud)"에 해당하는 것은?',o:['데이터센터, 장비, 하이퍼바이저를 지키는 것','고객의 데이터를 백업하는 것','Security Group 규칙을 정하는 것','사용자 계정의 비밀번호를 관리하는 것'],e:'클라우드 자체의 기반을 지키는 것은 사업자 몫입니다. 나머지 셋은 클라우드 안의 보안으로 고객 몫입니다.'}
]},
{v:[
 {q:'온프레미스, IaaS, PaaS, SaaS 모두에서 고객 몫인 것은?',o:['데이터와 계정·권한','앱','게스트 OS','하이퍼바이저'],e:'공동 책임 모델 표의 맨 위 두 줄은 어느 모델에서든 고객 몫입니다.'},
 {q:'IaaS에서 고객과 사업자의 책임 경계는 어디인가?',o:['하이퍼바이저와 VM 사이','앱과 데이터 사이','데이터센터와 물리 서버 사이','OS와 런타임 사이'],e:'하이퍼바이저와 그 아래는 사업자, VM 안의 OS부터 위는 고객 몫입니다.'}
]},
{v:[
 {q:'클라우드의 VM에서 22번 포트를 0.0.0.0/0으로 열어 두어 공격을 받았다. 책임은 주로 누구에게 있나?',o:['고객. Security Group 규칙은 고객이 설정하는 몫이다','사업자. 사업자가 모든 포트를 막아야 한다','책임이 없다','하이퍼바이저를 만든 회사'],e:'IaaS에서 네트워크 설정과 Security Group 규칙은 고객 몫입니다. 사업자는 고객이 연 규칙을 막아 주지 않습니다([[d10]]).'},
 {q:'클라우드에서 고객이 직접 챙겨야 하는 일이 아닌 것은?',o:['데이터센터의 냉각 설비 점검','데이터 백업과 복구 테스트','Security Group 규칙 관리','퇴사자의 계정 삭제'],e:'데이터센터는 사업자 몫입니다. 데이터·백업, 네트워크 규칙, 계정은 고객 몫입니다.'}
]},
{v:[
 {q:'"사업자가 장비를 이중화했으니 우리는 백업을 안 해도 된다"가 틀린 이유는?',o:['사업자의 이중화는 장비 고장 대비이고, 고객이 지우거나 덮어쓴 변경은 이중화된 장비에도 그대로 반영되기 때문에','이중화된 장비는 고장 나지 않기 때문에','백업은 사업자만 할 수 있기 때문에','이중화하면 데이터가 두 배로 늘어나기 때문에'],e:'RAID와 이중화는 디스크·장비 고장만 막습니다. 데이터와 백업은 고객 몫입니다([[d11]], [[d13]]).'},
 {q:'클라우드 사업자가 백업 기능을 제공할 때 보통 고객이 하는 일은?',o:['기능을 켜고, 보관 기간을 정하고, 복구가 되는지 확인한다','아무것도 하지 않아도 된다','백업 장비를 직접 산다','하이퍼바이저를 업데이트한다'],e:'백업 기능이 있어도 설정과 복구 확인은 보통 고객이 합니다. 정확한 범위는 서비스와 계약마다 다릅니다.'}
]},
{v:[
 {q:'IaaS의 VM에서 OS 보안 업데이트를 하지 않으면?',o:['알려진 취약점이 그대로 남는다. VM 안의 OS는 고객 몫이라 사업자가 대신 해 주지 않는다','사업자가 자동으로 업데이트해 준다','하이퍼바이저가 대신 막아 준다','VM이 자동으로 지워진다'],e:'IaaS에서 사업자는 VM 안에 손대지 않습니다. OS 패치는 고객이 합니다([[d05]]).'},
 {q:'관리형 DB(PaaS)로 옮긴 뒤에도 고객이 해야 하는 일은?',o:['DB 사용자 계정과 권한, 어디서 접속을 허용할지 정하기','DB 엔진 설치','DB 서버의 OS 패치','물리 서버 교체'],e:'PaaS에서도 데이터와 계정, 접속 허용 같은 설정은 고객 몫입니다.'}
]},
{v:[
 {q:'퍼블릭 클라우드의 특징은?',o:['여러 고객이 사업자의 데이터센터에 있는 자원을 나눠 쓰고, 사업자가 운영한다','한 조직만 쓰는 전용 클라우드다','고객의 데이터센터에만 둔다','반드시 고객이 직접 운영한다'],e:'퍼블릭 클라우드는 바로 쓰고 쓴 만큼 내며 확장이 쉽지만, 데이터의 위치와 통제는 사업자에 달려 있습니다.'},
 {q:'프라이빗 클라우드의 특징은?',o:['한 조직만 쓰며, 그 조직의 데이터센터나 다른 곳의 전용 장비에 둔다','여러 회사가 같은 장비를 나눠 쓴다','반드시 인터넷으로만 접속한다','데이터 위치를 통제할 수 없다'],e:'프라이빗 클라우드는 데이터가 어디 있는지 통제하고 전용 자원을 쓰는 대신, 장비와 운영의 부담이 있습니다.'}
]},
{v:[
 {q:'하이브리드 클라우드란?',o:['온프레미스·프라이빗 클라우드와 퍼블릭 클라우드를 연결해 하나처럼 함께 쓰는 것','여러 사업자의 퍼블릭 클라우드를 함께 쓰는 것','한 조직만 쓰는 클라우드','클라우드를 쓰지 않는 것'],e:'예: 고객 데이터는 사내 프라이빗에, 몰리는 웹 트래픽은 퍼블릭에 두고 전용 회선으로 잇습니다.'},
 {q:'멀티 클라우드와 하이브리드 클라우드의 차이로 맞는 것은?',o:['멀티 클라우드는 사업자가 여럿인 데, 하이브리드는 위치·운영 방식이 다른 환경을 연결하는 데 초점이 있다','둘은 같은 것을 가리키는 다른 이름이다','멀티 클라우드는 한 사업자만 쓴다','하이브리드는 퍼블릭 클라우드만 쓴다'],e:'둘은 함께 쓰이기도 합니다. 예: 사내 프라이빗과 여러 퍼블릭 클라우드를 함께 연결.'}
]},
{v:[
 {q:'규정 때문에 고객 데이터를 회사가 통제하는 곳에 두어야 하는 금융 회사에 알맞은 배포 모델은?',o:['프라이빗 클라우드(또는 프라이빗을 포함한 하이브리드)','퍼블릭 클라우드만','SaaS만','배포 모델과 상관없다'],e:'데이터를 어디에 두고 누가 통제하느냐(데이터 주권)는 프라이빗이나 하이브리드를 고르는 이유가 됩니다.'},
 {q:'장비를 사지 않고 빨리 서비스를 시작하고 싶은 작은 회사에 알맞은 배포 모델은?',o:['퍼블릭 클라우드','프라이빗 클라우드','온프레미스','배포 모델이 필요 없다'],e:'퍼블릭 클라우드는 장비 없이 바로 쓰고 쓴 만큼 냅니다.'}
]},
{v:[
 {q:'회사 데이터센터와 퍼블릭 클라우드를 연결할 때, 인터넷 대신 쓰는 경우가 많은 것은?',o:['전용 연결(전용 회선)','Object Storage의 공개 버킷','DNS의 CNAME 레코드','RAID 0'],e:'하이브리드 구성에서는 전용 연결로 두 환경을 이어 안정적인 속도와 보안을 얻습니다.'},
 {q:'데이터 주권이란?',o:['데이터를 어느 나라·장소에 두고 누가 통제하느냐에 대한 요구','데이터를 압축하는 기술','데이터를 여러 디스크에 나눠 쓰는 방식','데이터를 공개하는 권리'],e:'법이나 규정으로 정해지기도 하며, 회사 자료에도 프라이빗 클라우드의 장점으로 데이터 주권이 나옵니다.'}
]},
{v:[
 {q:'회사 자료에서 Zadara 클라우드를 소개하는 방식으로 맞는 것은?',o:['퍼블릭 클라우드와 프라이빗 클라우드의 장점을 결합한 클라우드 플랫폼','SaaS 전용 사무용 소프트웨어','하드웨어를 팔지 않는 순수 퍼블릭 클라우드만','데이터 백업만 하는 서비스'],e:'회사 자료는 "Public Cloud Experience, Private Cloud Control"이라고 요약합니다.'},
 {q:'회사 자료에 따르면 Zadara Edge Cloud(zCompute·zStorage)를 둘 수 있는 곳은?',o:['고객의 데이터센터, 서비스 사업자의 데이터센터','고객의 개인 PC','휴대폰','DNS 서버 안'],e:'고객 데이터센터에서는 기존 장비 옆에, 서비스 사업자 데이터센터에서는 클라우드·호스팅 서비스 옆에 놓이는 그림이 소개되어 있습니다.'}
]},
{v:[
 {q:'회사 자료에서 Zadara가 AWS와 호환된다고 하는 것의 뜻으로 맞는 것은?',o:['네트워크 구조와 이름, API가 AWS와 비슷하게 맞춰져 있어서 AWS 경험을 그대로 쓸 수 있다','Zadara는 AWS 안에서만 동작한다','AWS와 같은 회사다','AWS의 데이터센터를 빌려 쓴다'],e:'예: EC2 ↔ zCompute VM, EBS·EFS·S3 ↔ zStorage의 Block·File·Object, VPC ↔ Zadara VPC.'},
 {q:'Zadara 클라우드를 고객의 기존 장비나 퍼블릭 클라우드와 연결해 함께 쓰면 어떤 배포 모델이 되나?',o:['하이브리드 클라우드','순수 퍼블릭 클라우드','SaaS','배포 모델이 아니다'],e:'위치와 운영 방식이 다른 환경을 연결해 함께 쓰는 것이 하이브리드입니다.'}
]},
{v:[
 {q:'다음 중 서비스 모델의 예를 맞게 짝지은 것은?',o:['VM을 빌려 OS부터 직접 관리 → IaaS, 관리형 DB → PaaS, 웹으로 쓰는 메일·문서 도구 → SaaS','VM을 빌려 쓰기 → SaaS, 관리형 DB → IaaS, 메일 도구 → PaaS','셋 모두 IaaS','셋 모두 SaaS'],e:'모델은 사업자가 어디까지 맡느냐로 구분합니다. VM은 IaaS, 실행 환경·관리형 DB는 PaaS, 완성된 소프트웨어는 SaaS입니다.'},
 {q:'zCompute는 어떤 서비스 모델에 해당하고, 그래서 고객이 직접 설정하는 것은?',o:['IaaS. VM 안의 OS와 앱, 네트워크·Security Group, 데이터와 계정','SaaS. 데이터만 관리','PaaS. 앱 코드만 관리','온프레미스. 장비까지 모두 관리'],e:'zCompute는 IaaS이므로 공동 책임 모델에서 VM 위쪽과 네트워크 설정을 고객이 맡습니다. 다음 레슨 [[zc1]]부터 직접 설정합니다.'}
]}
]
});
