OJT.lesson({
id:'zc1', week:5, tag:'zCompute 1', mins:'약 3시간',
title:'플랫폼 및 권한: Region, Account, Project, IAM',
cover:[['Region','s1'],['Account','s3'],['Project','s3'],['IAM','s5']],
act:'zCompute의 리소스 계층과 권한 구조 설명',
goal:['zCompute의 구성(Region, 노드, 테넌트)을 설명할 수 있다','Region → Account → Project → VPC·VM 계층과 각 단위가 나누는 것을 설명할 수 있다','Cloud Admin, MSP Admin, Tenant Admin, Member의 관리 범위를 구분할 수 있다','사용자·그룹·역할·정책의 관계와 Zadara 정책과 AWS API 정책의 차이를 설명할 수 있다','콘솔 로그인, MFA, AD 연동, API 토큰과 Access Key의 쓰임을 구분할 수 있다'],
terms:[
['zCompute','Zadara zCompute','Zadara의 IaaS 컴퓨팅 서비스. VM, 가상 네트워크, 로드밸런서 등을 셀프 서비스로 제공하고 AWS 호환 API를 지원한다.'],
['Region','Region','zCompute 서비스의 최상위 물리·논리 단위(서비스 지역). 계층은 Region → Account → Project → 자원이다.'],
['노드','Node','zCompute가 설치되어 컴퓨팅·스토리지·메모리를 제공하는 물리 서버.'],
['클러스터','Cluster','노드의 묶음. VM은 클러스터의 노드 위에서 실행된다.'],
['테넌트','Tenant','같은 물리 자원을 나눠 쓰면서 논리적으로 분리된 사용 조직.'],
['멀티 테넌시','Multi-tenancy','하나의 플랫폼을 여러 테넌트가 서로 분리된 상태로 함께 쓰는 구조.'],
['MSP','Managed Service Provider','고객을 대신해 클라우드와 IT 서비스를 운영하는 사업자.'],
['Account','Account','고객이나 큰 조직 단위. 사용자·그룹·Project와 그 사이의 권한 관계를 담는다.'],
['Project','Project','서비스 자원을 논리적으로 나누는 공간. VPC, VM, Volume 등이 들어 있다.'],
['Limit (쿼터)','Limit / Quota','Account나 Project가 쓸 수 있는 자원의 상한.'],
['IAM','Identity and Access Management','누가 어떤 자원에 무엇을 할 수 있는지 관리하는 기능.'],
['역할 (Zadara)','Role','Member, Tenant Admin처럼 사용자가 Project 안에서 갖는 관리 등급.'],
['정책','Policy','허용되는 동작을 적은 권한 묶음. Zadara 정책과 AWS API 정책이 있다.'],
['AWS IAM Role','AWS IAM Role','권한 정책과 신뢰 정책을 묶은 것. 사용자나 VM이 맡아서(Assume) 임시로 그 권한을 쓴다. Zadara의 역할과 다른 개념이다.'],
['Instance Profile','Instance Profile','AWS IAM Role을 VM에 연결하는 데 쓰는 묶음.'],
['MFA','Multi-Factor Authentication','비밀번호에 일회용 코드 같은 두 번째 요소를 더해 확인하는 인증.'],
['AD / LDAP','Active Directory / Lightweight Directory Access Protocol','조직의 사용자·그룹을 중앙에서 관리하는 디렉터리 서비스 / 디렉터리에 접근하는 프로토콜.'],
['API 토큰','API Token','로그인 후 발급받아 Zadara 고유 API(Symp API) 호출에 쓰는 임시 인증 값. Account 또는 Project 범위를 갖는다.'],
['Access Key','Access Key / Secret Key','AWS 호환 API와 도구가 쓰는 인증 키 한 쌍. Secret Key는 만들 때만 확인할 수 있다.']
],
body:`
<h2 id="s1">zCompute의 구성: Region, 노드, 테넌트</h2>
<p><b>zCompute</b>는 Zadara의 IaaS<span class="small muted">(Infrastructure as a Service)</span> 컴퓨팅 서비스다. 사용자는 웹 콘솔이나 API로 VM<span class="small muted">(Virtual Machine)</span>, 가상 네트워크, 로드밸런서를 직접 만들어 쓴다. 고객 데이터센터나 지정한 IDC<span class="small muted">(Internet Data Center)</span>에 설치할 수 있고, AWS<span class="small muted">(Amazon Web Services)</span> 호환 API를 제공한다.</p>
<div class="tbl-wrap"><table><thead><tr><th>구성</th><th>뜻</th></tr></thead><tbody>
<tr><td class="nw"><b>Region</b></td><td>zCompute 서비스의 최상위 물리·논리 단위(서비스 지역). 그 안에 여러 Account가 있다.</td></tr>
<tr><td class="nw"><b>노드</b></td><td>zCompute가 설치된 물리 서버. CPU, 메모리, 디스크를 제공한다.</td></tr>
<tr><td class="nw"><b>클러스터</b></td><td>노드의 묶음. VM은 클러스터의 노드 위에서 실행된다.</td></tr>
<tr><td class="nw"><b>테넌트</b></td><td>플랫폼을 함께 쓰면서 논리적으로 분리된 사용 조직.</td></tr>
</tbody></table></div>
<p class="small muted">회사 소개 자료나 일부 문서는 zCompute 환경을 "클라우드"라고 부르기도 한다. AWS의 Region은 여러 가용 영역으로 이루어진 지역 단위이므로 zCompute의 Region과 규모가 다를 수 있다. AWS 도구에는 유효한 AWS Region 값을 넣어야 하지만, zCompute는 이 값을 무시한다.</p>
<p>zCompute의 핵심 구조는 <b>멀티 테넌시</b>다. 하이퍼바이저, 스위치, 스토리지 같은 <b>물리 자원은 함께 쓰고</b>, VM·네트워크·스토리지 같은 <b>가상 자원은 테넌트별로 분리</b>한다.</p>
<div class="box analogy"><span class="lbl">비유</span>건물(물리 자원)은 하나지만 입주사(테넌트)마다 사무실과 출입 권한이 따로 있는 것과 비슷하다.</div>
<h3>AWS 이름과의 대응</h3>
<div class="tbl-wrap"><table><thead><tr><th>AWS</th><th>Zadara</th></tr></thead><tbody>
<tr><td>EC2<span class="small muted"> (Elastic Compute Cloud)</span></td><td>zCompute VM 인스턴스</td></tr>
<tr><td>VPC<span class="small muted"> (Virtual Private Cloud)</span></td><td>Zadara VPC</td></tr>
<tr><td>EBS<span class="small muted"> (Elastic Block Store)</span></td><td>zCompute Volume (zStorage 기반)</td></tr>
<tr><td>IAM</td><td>Zadara Identity &amp; Access</td></tr>
</tbody></table></div>
<p class="small muted">이름이 같아도 세부 동작은 다를 수 있으므로, 동작은 Zadara 공식 가이드로 확인한다.</p>

<h2 id="s2">리소스 계층: Region → Account → Project → 자원</h2>
<p>zCompute의 자원과 권한은 세 범위로 나뉜다. <b>Region</b>(서비스 전체), <b>Account</b>(사용자와 권한을 관리하는 단위), <b>Project</b>(자원이 실제로 있는 단위)다.</p>
<svg class="fig" viewBox="0 0 560 420" role="img" aria-label="리소스 계층도. Region 안에 Account A와 Account B가 있다. Account A에는 Project 1과 Project 2가, Account B에는 Project 3이 있고, 각 Project 안에 VPC, VM, Volume이 있다. 가상 자원은 분리되어 있고, 맨 아래의 서버, 스위치, 스토리지 같은 물리 자원은 여러 Account가 함께 쓴다.">
<rect x="4" y="4" width="552" height="412" rx="10" class="wall"/>
<text x="22" y="34" class="b">Region</text>
<rect x="20" y="48" width="346" height="256" rx="10" class="zone"/>
<text x="36" y="76" class="b">Account A</text>
<rect x="34" y="88" width="154" height="202" rx="8" class="pair"/>
<text x="111" y="116" class="c b">Project 1</text>
<text x="111" y="156" class="c">VPC</text><text x="111" y="196" class="c">VM</text><text x="111" y="236" class="c">Volume</text>
<rect x="198" y="88" width="154" height="202" rx="8" class="pair"/>
<text x="275" y="116" class="c b">Project 2</text>
<text x="275" y="156" class="c">VPC</text><text x="275" y="196" class="c">VM</text><text x="275" y="236" class="c">Volume</text>
<rect x="378" y="48" width="164" height="256" rx="10" class="zone"/>
<text x="392" y="76" class="b">Account B</text>
<rect x="390" y="88" width="140" height="202" rx="8" class="pair"/>
<text x="460" y="116" class="c b">Project 3</text>
<text x="460" y="156" class="c">VPC</text><text x="460" y="196" class="c">VM</text><text x="460" y="236" class="c">Volume</text>
<line x1="20" y1="320" x2="540" y2="320" class="ln dash"/>
<text x="22" y="350" class="t-s">물리 자원: 함께 사용</text>
<use href="#i-server" x="232" y="334" width="52" height="52"/><text x="258" y="406" class="c t-s">노드</text>
<use href="#i-switch" x="340" y="334" width="52" height="52"/><text x="366" y="406" class="c t-s">스위치</text>
<use href="#i-storage" x="448" y="334" width="52" height="52"/><text x="474" y="406" class="c t-s">스토리지</text>
</svg>
<p class="fig-cap">점선 위의 가상 자원은 Account와 Project로 분리되고, 점선 아래의 물리 자원은 함께 쓴다.</p>
<ul><li><b>Account</b>는 사용자, 그룹, Project와 그 사이의 권한 관계를 담는다.</li><li><b>Project</b>는 VPC, VM, Volume 같은 자원을 담는다. 사용자는 자기에게 배정된 Project의 자원만 보고 다룬다.</li><li><b>자원</b>은 Project 안에 만든다. 가상 네트워크 VPC<span class="small muted">(Virtual Private Cloud)</span>도 Project에 속한다.</li></ul>
<p>VPC 방식의 Project에는 <b>기본 VPC</b>가 자동으로 만들어진다. Project를 만들 때 네트워크 유형을 VPC 또는 DVS<span class="small muted">(Distributed Virtual Switch)</span>로 고른다. 이 과정의 실습은 VPC 유형을 기준으로 하고, 설계는 <a data-lesson="zc2"></a>에서 다룬다.</p>

<h2 id="s3">Account와 Project로 나누는 이유</h2>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>Account</th><th>Project</th></tr></thead><tbody>
<tr><td class="nw"><b>나누는 기준</b></td><td>조직, 고객사, 업무 영역</td><td>과제, 서비스, 개발·운영 환경</td></tr>
<tr><td class="nw"><b>담는 것</b></td><td>사용자, 그룹, Project, 인증 설정</td><td>VPC, VM, Volume, 로드밸런서 등 자원</td></tr>
<tr><td class="nw"><b>사용자 소속</b></td><td>사용자는 <b>한 Account</b>에 속한다</td><td>사용자는 <b>여러 Project</b>에 배정될 수 있다</td></tr>
<tr><td class="nw"><b>권한</b></td><td>Tenant Admin이 자기 Account를 관리한다</td><td>Project마다 역할과 정책을 따로 준다</td></tr>
<tr><td class="nw"><b>분리</b></td><td>일반 사용자는 다른 Account의 자원에 접근할 수 없다</td><td>배정되지 않은 Project의 자원은 보이지 않는다</td></tr>
</tbody></table></div>
<p>예를 들어 한 회사의 연구 조직을 Account 하나로 두고, 그 안에 AI 과제, 서비스 개발, 테스트를 각각 Project와 VPC로 나눌 수 있다.</p>
<div class="flow"><div class="n k"><b>Account</b><small>연구 조직</small></div><span class="ar">→</span><div class="n"><b>Project: AI</b><small>VPC-A</small></div><div class="n"><b>Project: 서비스</b><small>VPC-B</small></div><div class="n"><b>Project: 테스트</b><small>VPC-C</small></div></div>
<ul><li><b>실수의 영향이 줄어든다.</b> 테스트 Project의 작업이 운영 Project의 자원을 건드리지 않는다.</li><li><b>권한을 업무에 맞출 수 있다.</b> 같은 사람에게 테스트 Project는 변경 권한을, 운영 Project는 읽기 권한만 줄 수 있다.</li><li><b>자원 사용량을 나눠서 통제할 수 있다.</b></li></ul>
<h3>Limit: 쓸 수 있는 자원의 상한</h3>
<p><b>Limit</b>는 CPU 코어 수, 메모리, 인스턴스 수, 스토리지 용량처럼 쓸 수 있는 자원의 상한이다. Account와 Project 양쪽에 둘 수 있다.</p>
<p><mark>Project Limit의 합은 Account Limit보다 커도 되지만, 실제 사용량은 어느 쪽 Limit도 넘을 수 없다.</mark> 예를 들어 Account Limit이 100코어이고 두 Project의 Limit이 각각 70코어이면, 한 Project는 70코어까지 쓸 수 있지만 두 Project의 합은 100코어를 넘을 수 없다.</p>

<h2 id="s4">사용자 유형과 관리 경계</h2>
<p>회사 자료와 교육자료는 zCompute의 사용자를 네 유형으로 나눈다. 차이는 <b>어디까지 관리할 수 있느냐</b>다.</p>
<svg class="fig" viewBox="0 0 560 276" role="img" aria-label="사용자 유형별 관리 범위. Member는 배정된 Project까지, Tenant Admin은 자기 Account까지, MSP Admin은 다른 Account까지와 물리 자원의 일부, Cloud Admin은 물리 자원까지 전부 관리한다.">
<text x="200" y="24" class="c t-s">배정된</text><text x="200" y="44" class="c t-s">Project</text>
<text x="300" y="24" class="c t-s">자기</text><text x="300" y="44" class="c t-s">Account</text>
<text x="400" y="24" class="c t-s">다른</text><text x="400" y="44" class="c t-s">Account</text>
<text x="500" y="24" class="c t-s">물리</text><text x="500" y="44" class="c t-s">자원</text>
<text x="4" y="86" class="b">Member</text><rect x="152" y="62" width="96" height="38" rx="6" class="bx-a"/>
<text x="4" y="140" class="b">Tenant Admin</text><rect x="152" y="116" width="196" height="38" rx="6" class="bx-a"/>
<text x="4" y="194" class="b">MSP Admin</text><rect x="152" y="170" width="296" height="38" rx="6" class="bx-a"/><rect x="454" y="170" width="94" height="38" rx="6" class="zone"/><text x="501" y="195" class="c t-s">일부</text>
<text x="4" y="248" class="b">Cloud Admin</text><rect x="152" y="224" width="396" height="38" rx="6" class="bx-a"/>
</svg>
<p class="fig-cap">막대가 그 유형이 관리할 수 있는 범위다. 점선은 일부만 가능하다는 뜻이다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>유형</th><th>누가</th><th>하는 일</th></tr></thead><tbody>
<tr><td class="nw"><b>Cloud Admin</b></td><td>Zadara 운영 조직</td><td>Region의 물리 자원 전체(노드, 디스크, 물리 네트워크)를 관리한다.</td></tr>
<tr><td class="nw"><b>MSP Admin</b></td><td>Region을 운영하는 사업자</td><td>모든 Account의 자원을 보고 변경할 수 있고, Region 설정 일부를 관리한다.</td></tr>
<tr><td class="nw"><b>Tenant Admin</b></td><td>고객사 IT 담당자</td><td>자기 Account의 Project와 사용자를 만들고 역할과 정책을 준다.</td></tr>
<tr><td class="nw"><b>Member</b></td><td>최종 사용자</td><td>배정된 Project에서 VM, Volume, VPC 같은 자원을 만들고 쓴다.</td></tr>
</tbody></table></div>
<p class="small muted">공식 가이드는 MSP Admin과 Tenant Admin을 묶어 3가지(Member, MSP or Tenant Admin, Zadara Ops Admin)로 설명한다. 이 레슨은 회사 자료 기준의 4가지로 쓴다.</p>
<p>일반 Account의 사용자는 서로 엄격히 분리되어, 다른 Account의 자원을 볼 권한을 받을 수 없다. 반면 MSP Admin은 Account를 넘어 자원을 변경하고 삭제까지 할 수 있으므로, Region 수준의 작업에만 쓰고 MFA와 강한 비밀번호로 보호한다.</p>
<div class="box mem"><span class="lbl">외울 것: 관리 범위</span><ul><li><b>Member</b>: 배정된 Project의 자원을 쓴다.</li><li><b>Tenant Admin</b>: 자기 Account를 관리한다.</li><li><b>MSP Admin</b>: 여러 Account를 넘어 관리한다.</li><li><b>Cloud Admin</b>: Region의 물리 자원까지 관리한다.</li></ul></div>

<h2 id="s5">사용자, 그룹, 역할</h2>
<p><b>IAM</b><span class="small muted">(Identity and Access Management)</span>은 <b>누가(Who), 어떤 서비스에서(Which), 무엇을 할 수 있는지(What)</b>를 관리한다.</p>
<div class="tbl-wrap"><table><thead><tr><th>구성 요소</th><th>뜻</th></tr></thead><tbody>
<tr><td class="nw"><b>사용자</b></td><td>로그인하는 개인. 하나의 Account에 속하고, 할당된 역할과 정책에 따라 자원을 제어한다.</td></tr>
<tr><td class="nw"><b>그룹</b></td><td>사용자의 묶음. 같은 권한을 여러 사람에게 한 번에 줄 때 쓴다.</td></tr>
<tr><td class="nw"><b>역할</b></td><td>Project 안에서의 관리 등급. Member, Tenant Admin 등이 있다.</td></tr>
<tr><td class="nw"><b>정책</b></td><td>허용되는 동작을 적은 묶음. 예: VM을 읽기만 허용.</td></tr>
</tbody></table></div>
<p>권한은 <b>Project 단위로</b> 준다. 그래서 같은 사용자가 Project마다 다른 권한을 가질 수 있다.</p>
<div class="tbl-wrap"><table><thead><tr><th>사용자</th><th>Project</th><th>역할</th><th>정책</th></tr></thead><tbody>
<tr><td rowspan="2">kim</td><td>test</td><td>Member</td><td>전체 사용</td></tr>
<tr><td>prod</td><td>Member</td><td>읽기 전용</td></tr>
</tbody></table></div>
<p>사용자가 자원을 다루려면 <b>최소 하나의 Project에 역할과 Zadara 정책이 함께 배정</b>되어 있어야 한다. Account에 사용자를 만들기만 해서는 아무 자원도 쓸 수 없다.</p>
<div class="box warn"><span class="lbl">주의: 사용자를 지워도 자원은 남는다</span>사용자를 삭제해도 그 사용자가 만든 VM이나 Volume은 지워지지 않고, Project에 접근할 수 있는 다른 사람이 계속 쓸 수 있다. 자원의 소유 단위는 사람이 아니라 Project다.</div>

<h2 id="s6">정책: Zadara 정책과 AWS API 정책</h2>
<p>zCompute는 API를 두 벌 제공하고, 권한도 그에 맞춰 두 종류가 있다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>Zadara 정책 (ZCS Policy)</th><th>AWS API 정책</th></tr></thead><tbody>
<tr><td class="nw"><b>적용 대상</b></td><td>웹 콘솔, Symp API·CLI</td><td>AWS 호환 API(EC2, VPC, ELB, IAM 등)와 AWS 도구</td></tr>
<tr><td class="nw"><b>함께 필요한 것</b></td><td>Zadara 역할</td><td>사용자, 그룹, AWS IAM Role에 연결</td></tr>
<tr><td class="nw"><b>이름 예</b></td><td class="nw">VMFullAccess<br>VMReadOnlyAccess</td><td class="nw">AmazonEC2FullAccess<br>AmazonEC2ReadOnlyAccess</td></tr>
<tr><td class="nw"><b>부여 단위</b></td><td>Project</td><td>Project</td></tr>
</tbody></table></div>
<p class="small muted">ZCS: Zadara Cloud Services · Symp: zCompute 고유의 API와 CLI 이름 · ELB: Elastic Load Balancer · CLI: Command Line Interface.</p>
<p><mark>콘솔에서 할 수 있다고 AWS CLI로도 할 수 있는 것은 아니다.</mark> 예를 들어 콘솔의 VM 생성과 AWS API의 <code>RunInstances</code>는 서로 다른 정책으로 허용한다. 권한 오류가 나면 <b>어느 경로로 호출했는지</b>부터 확인한다.</p>
<div class="flow"><div class="n"><b>웹 콘솔 · Symp</b><small>Zadara 역할 + Zadara 정책</small></div><div class="n"><b>AWS CLI · Terraform</b><small>AWS API 정책</small></div></div>
<p class="small muted">Zadara 역할, Zadara 정책, AWS API 정책이 한 동작에 함께 걸릴 때의 판정 순서는 공식 가이드에 자세히 나와 있지 않다. 정책 변경은 다시 로그인해야 반영된다.</p>

<h2 id="s7">AWS IAM Role과 Instance Profile</h2>
<p>"역할"이라는 이름이 두 곳에서 쓰이므로 구분해야 한다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>Zadara 역할</th><th>AWS IAM Role</th></tr></thead><tbody>
<tr><td class="nw"><b>정체</b></td><td>사용자의 관리 등급</td><td>권한 정책 + 신뢰 정책의 묶음</td></tr>
<tr><td class="nw"><b>예</b></td><td>Member, Tenant Admin</td><td>"S3 읽기 전용 역할"처럼 직접 만든 것</td></tr>
<tr><td class="nw"><b>쓰는 방식</b></td><td>사용자에게 Project별로 배정</td><td>사용자나 VM이 <b>맡아서(Assume)</b> 임시로 사용</td></tr>
</tbody></table></div>
<ul><li><b>권한 정책</b>: 이 Role로 무엇을 할 수 있는가.</li><li><b>신뢰 정책</b>: 누가 이 Role을 맡을 수 있는가.</li></ul>
<p><b>Instance Profile</b>은 AWS IAM Role을 VM에 연결하는 묶음이다. VM 안의 프로그램이 Access Key를 파일에 저장하지 않고도 그 Role의 권한으로 API를 호출할 수 있다. 키가 서버에 남지 않으므로 유출 위험이 줄어든다.</p>

<h2 id="s8">인증: 콘솔, MFA, AD 연동, API</h2>
<p>인증은 "이 사람이 누구인가"를 확인하고, 앞의 역할과 정책은 "무엇을 할 수 있는가"를 정한다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>방식</th><th>쓰는 곳</th><th>핵심</th></tr></thead><tbody>
<tr><td class="nw"><b>비밀번호 로그인</b></td><td>웹 콘솔</td><td>Account 이름, 사용자 이름, 비밀번호</td></tr>
<tr><td class="nw"><b>MFA</b></td><td>로그인 보강</td><td>비밀번호 + 인증 앱의 일회용 코드(TOTP)</td></tr>
<tr><td class="nw"><b>AD 연동</b></td><td>조직 계정으로 로그인</td><td>Account 단위로 AD를 연결한다</td></tr>
<tr><td class="nw"><b>API 토큰</b></td><td>Symp API</td><td>로그인으로 발급. Account 범위와 Project 범위가 있다</td></tr>
<tr><td class="nw"><b>Access Key</b></td><td>AWS CLI, Terraform 등</td><td>Access Key와 Secret Key 한 쌍</td></tr>
</tbody></table></div>
<p class="small muted">TOTP: Time-based One-Time Password. 교육자료는 외부 인증으로 SAML(Security Assertion Markup Language)도 소개하지만 별도 승인이 필요한 기능으로 적고 있다.</p>
<h3>AD 연동에서 알아 둘 점</h3>
<ul><li>연결한 뒤에는 새 사용자와 그룹을 <b>AD에서만</b> 만든다. 비밀번호도 AD에서 관리한다.</li><li>AD 사용자도 <b>Project와 역할을 배정받아야</b> 로그인해서 쓸 수 있다.</li><li>AD에 문제가 생겨도 들어갈 수 있도록, 연결 전에 <b>비상용 로컬 Tenant Admin</b>을 하나 만들어 둔다.</li></ul>
<h3>Access Key 다루기</h3>
<ul><li><b>Secret Key는 만들 때만 볼 수 있다.</b> 놓치면 새 키를 만들어야 한다.</li><li>코드나 Git 저장소에 넣지 않는다. 공개 저장소에 올라간 키는 유출된 것으로 보고 바로 폐기한다.</li><li>VM 안에서 API를 쓸 때는 키를 저장하는 대신 Instance Profile을 쓴다.</li></ul>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><ul><li>내 Account·Project 이름, 내게 배정된 역할과 정책</li><li>콘솔의 메뉴 이름과 위치, Access Key를 만드는 화면</li><li>MFA 사용 여부, AD 연동 여부</li><li>Project에 설정된 Limit</li></ul>이 값들은 화면에서 확인하고, 공개 저장소나 문서에 계정 정보를 적지 않는다.</div>

<h2 id="s9">정리: 권한을 설계하는 순서</h2>
<ol><li><b>조직을 Account로 나눈다.</b></li><li><b>과제와 환경을 Project로 나눈다.</b> 개발과 운영은 분리한다.</li><li><b>사용자를 만들고 그룹으로 묶는다.</b></li><li><b>Project마다 역할과 정책을 준다.</b> 필요한 최소 권한만 준다.</li><li><b>인증을 강화한다.</b> MFA를 켜고, API 키는 안전하게 다룬다.</li><li><b>Limit으로 자원 사용을 제한한다.</b></li></ol>
<div class="box mem"><span class="lbl">외울 것: 한 줄 요약</span><b>Account</b>는 사람과 권한의 경계, <b>Project</b>는 자원의 경계, <b>역할과 정책</b>은 그 안에서 할 수 있는 일이다.</div>
<h3>직접 해 보기</h3>
<p>한 회사가 쇼핑몰 서비스를 zCompute에 올린다. 개발자 3명은 개발 환경을 마음대로 쓰고, 운영 환경은 보기만 해야 한다. 운영 담당자 1명은 운영 환경을 변경할 수 있어야 한다. Account와 Project를 어떻게 나누고 권한을 어떻게 줄까?</p>
<details class="fold"><summary>답 보기</summary><p>Account 하나에 <code>dev</code>와 <code>prod</code> Project를 만든다. 개발자 3명을 그룹으로 묶어 <code>dev</code>에는 Member 역할과 전체 사용 정책을, <code>prod</code>에는 Member 역할과 읽기 전용 정책을 준다. 운영 담당자에게는 <code>prod</code>에 Member 역할과 전체 사용 정책을 준다. 사용자와 Project를 관리할 Tenant Admin은 따로 정하고, 모두 MFA를 켠다.</p></details>
<p class="small muted">이 구조 위에 만드는 네트워크는 <a data-lesson="zc2"></a>, VM은 <a data-lesson="zc3"></a>에서 다룬다.</p>
`,
summary:['zCompute는 물리 자원을 함께 쓰고 가상 자원을 테넌트별로 분리하는 멀티 테넌트 IaaS다.','계층은 Region → Account → Project → VPC·VM·Volume이다.','Account는 사용자와 권한의 경계, Project는 자원의 경계다. 사용자는 한 Account에 속하고 여러 Project에 배정될 수 있다.','관리 범위는 Member < Tenant Admin < MSP Admin < Cloud Admin 순으로 넓어진다.','권한은 Project 단위로 주며, 웹 콘솔·Symp는 Zadara 역할과 정책, AWS 호환 API는 AWS API 정책을 따른다.','Zadara 역할은 관리 등급이고, AWS IAM Role은 맡아서 임시로 쓰는 권한 묶음이다.','Secret Key는 만들 때만 볼 수 있고, VM 안에서는 Access Key 대신 Instance Profile을 쓴다.'],
essay:[
{q:'Region, Account, Project, VM의 포함 관계를 설명하고, Account와 Project가 각각 무엇을 나누는지 말해 보세요.',a:'Region 안에 Account가 있고, Account 안에 Project가 있으며, VM·VPC·Volume 같은 자원은 Project 안에 있다. Account는 조직 단위로 사용자·그룹·권한을 나누고, Project는 과제나 환경 단위로 자원을 나눈다.'},
{q:'멀티 테넌시에서 함께 쓰는 것과 분리되는 것을 구분해 보세요.',a:'하이퍼바이저, 스위치, 스토리지 같은 물리 자원은 함께 쓴다. VM, 네트워크, 스토리지 같은 가상 자원과 사용자·권한은 테넌트별로 분리된다.'},
{q:'Cloud Admin, MSP Admin, Tenant Admin, Member의 관리 범위 차이를 설명해 보세요.',a:'Member는 배정된 Project의 자원을 쓴다. Tenant Admin은 자기 Account의 Project와 사용자를 관리한다. MSP Admin은 여러 Account의 자원과 Region 설정 일부를 관리한다. Cloud Admin은 노드와 물리 네트워크까지 Region 전체를 관리한다.'},
{q:'Zadara 정책과 AWS API 정책은 각각 어떤 경로의 호출에 적용되나요?',a:'Zadara 정책은 Zadara 역할과 함께 웹 콘솔과 Symp API·CLI에 적용된다. AWS API 정책은 AWS CLI, Terraform처럼 AWS 호환 API를 쓰는 호출에 적용된다.'},
{q:'Zadara 역할과 AWS IAM Role의 차이를 설명해 보세요.',a:'Zadara 역할은 Member, Tenant Admin처럼 사용자에게 Project별로 배정하는 관리 등급이다. AWS IAM Role은 권한 정책과 신뢰 정책의 묶음으로, 사용자나 VM이 맡아서 임시로 그 권한을 쓴다.'},
{q:'VM 안의 프로그램이 API를 호출해야 할 때 Access Key를 파일에 저장하는 대신 무엇을 쓰고, 왜 그렇게 하나요?',a:'AWS IAM Role을 연결한 Instance Profile을 쓴다. 서버에 키를 남기지 않으므로 키가 유출될 위험이 줄어든다.'}
],
quiz:[
{v:[
 {q:'zCompute의 리소스 계층으로 맞는 것은?',o:['Region → Account → Project → VPC·VM','Region → Project → Account → VPC·VM','Account → Region → VM → Project','Project → VM → Account → Region'],e:'Region 안에 Account가, Account 안에 Project가, Project 안에 VPC·VM 같은 자원이 있다.'},
 {q:'VM과 Volume 같은 클라우드 자원이 실제로 들어 있는 단위는?',o:['Project','Account','Region','사용자 그룹'],e:'자원은 Project 안에 만든다. Account는 사용자·그룹·Project와 권한 관계를 담는다.'}
]},
{v:[
 {q:'Account가 담는 것으로 가장 알맞은 것은?',o:['사용자, 그룹, Project와 그 사이의 권한 관계','물리 노드와 스위치','VM의 디스크 데이터','Subnet의 라우팅 규칙'],e:'Account는 조직 단위의 관리 경계로, 사용자·그룹·Project와 권한 관계를 담는다.'},
 {q:'Account와 Project를 나누는 기준으로 알맞은 것은?',o:['Account는 조직·업무 영역, Project는 과제·환경','Account는 VM 종류, Project는 OS 종류','Account는 IP 대역, Project는 포트 번호','Account는 디스크, Project는 메모리'],e:'Account로 조직을 나누고, 그 안에서 과제나 개발·운영 환경을 Project로 나눈다.'}
]},
{v:[
 {q:'멀티 테넌시에서 테넌트끼리 함께 쓰는 것은?',o:['하이퍼바이저, 스위치 같은 물리 자원','VM','사용자 계정','Project의 권한'],e:'물리 자원은 함께 쓰고, VM·네트워크·스토리지 같은 가상 자원과 계정은 분리한다.'},
 {q:'zCompute의 멀티 테넌시를 바르게 설명한 것은?',o:['물리 자원은 공유하고 가상 자원은 테넌트별로 분리한다','물리 자원도 테넌트마다 반드시 따로 둔다','모든 테넌트가 같은 VPC를 쓴다','한 Region에는 테넌트가 하나만 있다'],e:'물리 자원을 함께 써서 효율을 얻고, 가상 자원을 분리해 테넌트를 격리한다.'}
]},
{v:[
 {q:'사용자와 Account·Project의 관계로 맞는 것은?',o:['한 Account에 속하고, 여러 Project에 배정될 수 있다','여러 Account에 속하고, Project는 하나만 가능하다','Account 없이 Project에만 속한다','Project마다 사용자를 새로 만들어야 한다'],e:'사용자는 하나의 Account에 속하고, 그 안의 여러 Project에 배정될 수 있다.'},
 {q:'한 사용자가 test Project에서는 변경하고 prod Project에서는 보기만 할 수 있는 이유는?',o:['권한을 Project 단위로 주기 때문이다','사용자 계정을 두 개 쓰기 때문이다','VM마다 비밀번호가 다르기 때문이다','Cloud Admin만 prod를 볼 수 있기 때문이다'],e:'역할과 정책은 Project마다 따로 배정하므로 Project별로 권한이 달라질 수 있다.'}
]},
{v:[
 {q:'자기 Account의 Project와 사용자를 만들고 권한을 주는 유형은?',o:['Tenant Admin','Member','Cloud Admin','Instance Profile'],e:'Tenant Admin은 자기 Account 안에서 Project와 사용자를 관리한다.'},
 {q:'Tenant Admin이 할 수 없는 일은?',o:['다른 Account의 자원 관리','자기 Account에 Project 만들기','자기 Account에 사용자 만들기','자기 Account의 사용자에게 Project 권한 주기'],e:'Tenant Admin의 범위는 자기 Account까지다.'}
]},
{v:[
 {q:'노드, 디스크, 물리 네트워크까지 Region 전체를 관리하는 유형은?',o:['Cloud Admin','Tenant Admin','Member','그룹 관리자'],e:'Cloud Admin은 Region의 물리 자원까지 관리한다.'},
 {q:'관리 범위가 좁은 것에서 넓은 것 순서로 맞는 것은?',o:['Member → Tenant Admin → MSP Admin → Cloud Admin','Tenant Admin → Member → Cloud Admin → MSP Admin','Cloud Admin → MSP Admin → Tenant Admin → Member','Member → MSP Admin → Tenant Admin → Cloud Admin'],e:'Member는 배정된 Project, Tenant Admin은 Account, MSP Admin은 여러 Account, Cloud Admin은 Region의 물리 자원까지다.'}
]},
{v:[
 {q:'MSP Admin 계정을 평소 작업에 쓰지 말아야 하는 이유는?',o:['여러 Account의 자원을 변경·삭제할 수 있어 실수와 유출의 영향이 크기 때문이다','VM을 만들 수 없기 때문이다','로그인할 때마다 비용이 나기 때문이다','Project에 접근할 수 없기 때문이다'],e:'MSP Admin은 Account를 넘어 자원을 다룰 수 있으므로 Region 수준의 작업에만 쓴다.'},
 {q:'일반 Account의 사용자와 MSP Admin의 차이로 맞는 것은?',o:['일반 사용자는 다른 Account에 접근할 수 없고, MSP Admin은 Account를 넘어 관리할 수 있다','일반 사용자도 권한을 받으면 다른 Account를 볼 수 있다','MSP Admin은 자기 Project만 볼 수 있다','둘의 범위는 같다'],e:'일반 Account는 서로 엄격히 분리된다. Account를 넘는 관리는 MSP Admin의 권한이다.'}
]},
{v:[
 {q:'Limit(쿼터)의 역할은?',o:['Account나 Project가 쓸 수 있는 자원의 상한을 정한다','VM의 비밀번호 길이를 정한다','Subnet의 IP 범위를 정한다','로그인 가능한 시간을 정한다'],e:'Limit는 코어, 메모리, 인스턴스 수, 스토리지 같은 자원 사용의 상한이다.'},
 {q:'Account Limit이 100코어이고 Project 두 개의 Limit이 각각 70코어일 때 맞는 것은?',o:['한 Project는 70코어까지 쓸 수 있지만, 두 Project의 합은 100코어를 넘을 수 없다','두 Project가 합쳐 140코어까지 쓸 수 있다','Project Limit의 합이 Account Limit보다 크므로 설정할 수 없다','각 Project는 50코어까지만 쓸 수 있다'],e:'Project Limit의 합은 Account Limit보다 커도 되지만, 실제 사용량은 어느 쪽 Limit도 넘을 수 없다.'}
]},
{v:[
 {q:'사용자가 Project의 자원을 다루기 위해 필요한 것은?',o:['그 Project에 배정된 역할과 Zadara 정책','Cloud Admin 권한','VM의 root 비밀번호','별도의 Account'],e:'최소 하나의 Project에 역할과 Zadara 정책이 함께 배정되어야 한다.'},
 {q:'Account에 사용자를 만들었지만 Project를 배정하지 않았다. 이 사용자는?',o:['Project의 자원을 다룰 수 없다','Account의 모든 자원을 다룰 수 있다','자동으로 Tenant Admin이 된다','다른 Account의 자원을 볼 수 있다'],e:'권한은 Project 단위로 주므로, 배정이 없으면 자원을 다룰 수 없다.'}
]},
{q:'사용자를 삭제하면 그 사용자가 만든 VM은 어떻게 되나?',o:['지워지지 않고 Project에 남는다','함께 삭제된다','자동으로 중지된다','다른 Account로 옮겨진다'],e:'자원의 소유 단위는 Project이다. 사용자를 지워도 자원은 남고, Project에 접근할 수 있는 사람이 계속 쓸 수 있다.'},
{v:[
 {q:'AWS CLI나 Terraform으로 zCompute를 호출할 때 적용되는 권한은?',o:['AWS API 정책','Zadara 역할만','Linux 파일 권한','Security Group 규칙'],e:'AWS 호환 API를 쓰는 호출은 AWS API 정책의 적용을 받는다.'},
 {q:'웹 콘솔과 Symp API·CLI의 권한을 정하는 것은?',o:['Zadara 역할과 Zadara 정책','AWS IAM Role의 신뢰 정책만','Instance Profile','Subnet의 Route Table'],e:'웹 콘솔과 Symp API는 Zadara 역할과 Zadara(ZCS) 정책으로 권한을 정한다.'}
]},
{q:'콘솔에서는 VM을 만들 수 있는데 AWS CLI의 RunInstances는 권한 오류가 난다. 먼저 확인할 것은?',o:['AWS API 정책에 그 동작이 허용되어 있는지','VM의 디스크 용량','Web 서버 프로그램의 상태','DNS 레코드의 TTL'],e:'콘솔과 AWS 호환 API는 서로 다른 정책으로 허용한다. 호출 경로에 맞는 정책을 확인한다.'},
{v:[
 {q:'Zadara 역할과 AWS IAM Role의 차이로 맞는 것은?',o:['Zadara 역할은 관리 등급이고, AWS IAM Role은 맡아서 임시로 쓰는 권한 묶음이다','둘은 같은 것의 다른 이름이다','Zadara 역할은 VM에만, AWS IAM Role은 사람에게만 쓴다','AWS IAM Role은 물리 노드를 관리한다'],e:'Member·Tenant Admin은 Zadara 역할이고, AWS IAM Role은 권한 정책과 신뢰 정책의 묶음이다.'},
 {q:'AWS IAM Role의 신뢰 정책이 정하는 것은?',o:['누가 이 Role을 맡을 수 있는가','이 Role로 어떤 동작을 할 수 있는가','VM의 CPU 개수','Project의 Limit'],e:'신뢰 정책은 맡을 수 있는 대상을, 권한 정책은 할 수 있는 동작을 정한다.'}
]},
{v:[
 {q:'Instance Profile의 역할은?',o:['AWS IAM Role을 VM에 연결한다','VM의 CPU와 메모리 크기를 정한다','VM에 공인 IP를 붙인다','VM의 OS 이미지를 저장한다'],e:'Instance Profile을 쓰면 VM 안의 프로그램이 Role의 권한으로 API를 호출할 수 있다.'},
 {q:'VM 안의 프로그램이 API를 호출할 때 Instance Profile을 쓰는 장점은?',o:['Access Key를 서버에 저장하지 않아도 된다','네트워크가 빨라진다','VM의 비용이 없어진다','Security Group이 필요 없어진다'],e:'키가 서버에 남지 않으므로 유출 위험이 줄어든다.'}
]},
{v:[
 {q:'MFA에 대한 설명으로 맞는 것은?',o:['비밀번호에 일회용 코드 같은 두 번째 요소를 더해 확인한다','비밀번호를 두 번 입력한다','사용자 두 명이 함께 로그인한다','네트워크를 암호화하는 프로토콜이다'],e:'zCompute의 MFA는 비밀번호와 인증 앱의 일회용 코드(TOTP)를 함께 쓴다.'},
 {q:'인증과 권한의 차이로 맞는 것은?',o:['인증은 누구인지 확인하고, 권한은 무엇을 할 수 있는지 정한다','인증은 무엇을 할 수 있는지 정하고, 권한은 누구인지 확인한다','둘은 같은 말이다','인증은 VM에만, 권한은 사람에게만 적용된다'],e:'로그인·MFA는 인증이고, 역할과 정책은 권한이다.'}
]},
{v:[
 {q:'Account를 AD에 연결한 뒤의 사용자 관리로 맞는 것은?',o:['새 사용자와 그룹은 AD에서 만들고, Project와 역할은 배정해야 한다','AD 사용자는 자동으로 Tenant Admin이 된다','비밀번호는 zCompute에서 바꾼다','Project 배정 없이 모든 자원을 쓸 수 있다'],e:'계정은 AD에서 관리하지만, 자원을 쓰려면 Project와 역할 배정이 필요하다.'},
 {q:'AD를 연결하기 전에 비상용 로컬 Tenant Admin을 만들어 두는 이유는?',o:['AD에 문제가 생겨도 Account를 관리할 수 있게 하려고','AD의 비용을 줄이려고','VM의 성능을 높이려고','Project 수를 늘리려고'],e:'AD 장애로 아무도 로그인하지 못하는 상황을 막기 위해 로컬 관리자를 하나 둔다.'}
]},
{v:[
 {q:'AWS CLI와 Terraform이 인증에 쓰는 것은?',o:['Access Key와 Secret Key','SSH 개인키','VM의 root 비밀번호','Security Group ID'],e:'AWS 호환 도구는 Access Key와 Secret Key 한 쌍으로 인증한다.'},
 {q:'Symp API를 호출할 때 쓰는 인증 값으로, 로그인으로 발급받고 Account 또는 Project 범위를 갖는 것은?',o:['API 토큰','SSH Key Pair','Instance Type','DHCP Option Set'],e:'Symp API는 로그인으로 발급받은 토큰을 쓰며, 토큰에는 Account 범위와 Project 범위가 있다.'}
]},
{v:[
 {q:'Access Key를 다루는 방법으로 맞는 것은?',o:['Secret Key는 만들 때 안전하게 보관하고, 코드나 Git에 넣지 않는다','편하도록 공개 저장소에 올려 둔다','팀 전체가 같은 키를 메신저로 나눠 쓴다','Secret Key는 언제든 콘솔에서 다시 볼 수 있으니 저장하지 않아도 된다'],e:'Secret Key는 만들 때만 볼 수 있다. 공개 저장소에 올라간 키는 유출된 것으로 보고 폐기한다.'},
 {q:'Secret Key를 만들 때 저장하지 못했다면?',o:['다시 볼 수 없으므로 새 키를 만든다','콘솔에서 언제든 다시 확인한다','VM 안의 파일에서 찾는다','Cloud Admin에게 원래 값을 받는다'],e:'Secret Key는 만들 때만 확인할 수 있다.'}
]}
]
});
