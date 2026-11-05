OJT.lesson({
id:'w1-3', week:1, tag:'1주차 · 3일', mins:'약 2시간',
title:'Zadara는 무슨 회사인가',
cover: [['Zadara 사업 개요','s1'],['퍼블릭 클라우드와 다른 점','s3'],['제품 개요: zCompute·zStorage','s4'],['한국에서의 Zadara','s5']], act: '회사와 제품 이해',
goal:['Zadara의 사업을 30초 안에 설명할 수 있다','zCompute와 zStorage가 각각 무엇인지 말할 수 있다','일반 퍼블릭 클라우드와 Zadara가 다른 점을 2가지 이상 말할 수 있다'],
terms:[
['완전 관리형','Fully Managed','장비 설치부터 모니터링, 장애 대응, 업그레이드까지 서비스 회사가 맡아 운영해 주는 방식.'],
['엣지 클라우드','Edge Cloud','큰 리전이 아니라 고객 가까운 곳(고객 데이터센터, 코로케이션, 지역 IDC)에 설치해 쓰는 클라우드.'],
['코로케이션','Colocation, 코로','데이터센터 공간·전원·네트워크만 빌리고 장비는 자기 것을 넣는 방식.'],
['zCompute','Zadara Compute','Zadara의 컴퓨팅 서비스. VM, 가상 네트워크(VPC), 로드밸런서, 오토스케일링, 쿠버네티스, GPU 등.'],
['zStorage','Zadara Storage','Zadara의 스토리지 서비스. Block·File·Object 저장소를 서비스로 제공.'],
['VPSA','Virtual Private Storage Array','고객마다 따로 할당되는 전용 가상 스토리지 장비. zStorage의 핵심 단위. 7주차에 실습.'],
['Object Storage','오브젝트 스토리지','파일을 "객체" 단위로 저장하는 방식. S3 호환 API로 접근. Zadara에서는 NGOS라는 이름이 쓰인다.'],
['S3 호환','S3 compatible','AWS의 오브젝트 저장소 S3와 같은 방식(API)으로 쓸 수 있다는 뜻.'],
['VPC','Virtual Private Cloud','클라우드 안에 만드는 나만의 가상 네트워크. 5주차에 실습.'],
['MSP','Managed Service Provider','고객 대신 IT를 운영해 주는 서비스 회사. Zadara의 중요한 판매 파트너.'],
['SLA','Service Level Agreement','서비스 수준 약속. 예: "1년 중 99.999% 시간 동안 정상 동작을 보장한다".'],
['멀티테넌트','Multi-tenant','한 플랫폼을 여러 고객(테넌트)이 서로 격리된 채로 함께 쓰는 구조.'],
['데이터 주권','Data Sovereignty','데이터가 저장된 나라의 법을 따라야 한다는 개념. 그래서 국내에 보관해야 하는 데이터가 있다.'],
['PoC','Proof of Concept','본 계약 전에 고객 환경에서 기능과 성능을 미리 검증해 보는 시험 구축.']
],
body:`
<div class="box warn"><span class="lbl">먼저 읽어 주세요</span><p>이 레슨은 Zadara 공식 웹사이트와 공개 보도자료를 바탕으로 정리했습니다. 회사에서 받은 소개서·교육 자료가 있다면 <b>그쪽이 우선</b>입니다. 다른 점을 발견하면 질문 노트에 적어 두세요.</p></div>

<h2 id="s1">한 문장으로 말하면</h2>
<p>Zadara는 <mark>컴퓨트·스토리지·네트워킹을 "완전 관리형 서비스"로, 쓴 만큼 내는 방식으로 제공하는 엣지 클라우드 회사</mark>입니다. 고객의 데이터센터(온프렘), 코로케이션, 파트너의 데이터센터 등 <b>원하는 위치</b>에 클라우드를 둘 수 있다는 점이 특징입니다.</p>
<p>본사는 미국 캘리포니아에 있고, 여러 나라에 거점이 있습니다. 처음에는 스토리지 서비스로 시작해 컴퓨트까지 넓혔습니다.</p>

<h2 id="s2">어제 배운 개념으로 Zadara 읽기</h2>
<div class="tbl-wrap"><table><thead><tr><th>어제 배운 개념</th><th>Zadara에서는</th></tr></thead><tbody>
<tr><td>클라우드 = 빌려 쓰고 쓴 만큼 냄</td><td>100% 사용량 기반 과금(OpEx). 초기 장비 구매 부담이 없다.</td></tr>
<tr><td>IaaS</td><td>zCompute(VM·네트워크), zStorage(저장소)가 IaaS에 해당한다.</td></tr>
<tr><td>엣지</td><td>고객이 원하는 곳에 설치해서, 가깝고 데이터가 밖으로 나가지 않는다.</td></tr>
<tr><td>프라이빗/하이브리드</td><td>고객 전용으로 둘 수도, 퍼블릭 클라우드와 연결해 쓸 수도 있다.</td></tr>
</tbody></table></div>

<h2 id="s3">일반 퍼블릭 클라우드와 다른 점</h2>
<ol>
<li><b>위치를 고를 수 있다.</b> AWS 같은 퍼블릭 클라우드는 정해진 리전에서만 씁니다. Zadara는 고객 데이터센터나 지역 데이터센터에 설치할 수 있어서, 데이터를 국내나 사내에 둬야 하는 고객(금융, 공공, 제조 등)에게 맞습니다. 이것을 <b>데이터 주권</b>이라고 합니다.</li>
<li><b>완전 관리형이다.</b> 장비가 고객 데이터센터에 있어도 운영·모니터링·장애 대응은 Zadara 운영팀이 원격으로 맡습니다. 고객은 IT 운영 부담 없이 서비스를 씁니다.</li>
<li><b>파트너를 통해 판매된다.</b> 통신사, 데이터센터 회사, MSP 같은 파트너가 Zadara를 바탕으로 자기 이름의 클라우드 서비스를 만들기도 합니다.</li>
<li><b>익숙한 클라우드 개념을 그대로 쓴다.</b> VPC, Security Group, Load Balancer처럼 AWS와 비슷한 구조라서, AWS 개념을 배워 두면 그대로 통합니다.</li>
</ol>

<h2 id="s4">제품 두 기둥: zCompute와 zStorage</h2>
<p>Zadara 기술 문서는 <b>zStorage가 아래를 받치고, 그 위에 zCompute가 올라가는</b> 구조로 설명합니다. 둘은 필요에 따라 각각 따로 늘릴 수 있습니다.</p>
<div class="layers">
<div class="l1"><b>zCompute</b><span>VM · VPC · Security Group · Load Balancer · Auto Scaling · Kubernetes · GPU</span></div>
<div><b>zStorage</b><span>VPSA(Block · File) · Object Storage(S3 호환)</span></div>
<div class="l0"><b>물리 장비</b><span>서버 · 디스크 · 네트워크 (데이터센터)</span></div>
</div>
<h3>zCompute (5~6주차)</h3>
<p>가상 서버(VM)를 만들고, 가상 네트워크(VPC)를 짜고, 방화벽 규칙(Security Group)과 로드밸런서를 붙이는 서비스입니다. AWS로 치면 EC2·VPC·ELB에 해당하는 영역입니다. 사용량에 따라 서버 수를 자동으로 늘리는 오토스케일링, 컨테이너를 위한 쿠버네티스, AI용 GPU도 제공합니다.</p>
<h3>zStorage (7주차)</h3>
<p>저장소를 서비스로 제공합니다. 핵심 단위는 <b>VPSA</b>(고객 전용 가상 스토리지 장비)입니다. 저장 방식 세 가지를 모두 다룹니다. 4주차에 자세히 배우니 지금은 이름만 눈에 익히세요.</p>
<ul><li><b>Block</b>: 서버에 디스크처럼 붙여서 쓰는 방식 (iSCSI)</li><li><b>File</b>: 공유 폴더처럼 쓰는 방식 (NFS, SMB)</li><li><b>Object</b>: 인터넷 주소로 파일을 올리고 받는 방식 (S3 호환)</li></ul>
<p>공개 자료에는 zStorage 99.999%, zCompute 99.5%의 SLA가 소개되어 있습니다. 실제 계약 조건은 회사 자료로 확인하세요.</p>

<h2 id="s5">한국에서의 Zadara</h2>
<ul>
<li>2015년, 국내 파트너 <b>이비즈테크</b>와 함께 KT의 클라우드 고객에게 VPSA 스토리지를 제공하기 시작했습니다.</li>
<li>2016년, KINX 데이터센터에 VPSA를 두고 AWS 서울 리전 사용 고객을 지원했습니다.</li>
<li>2022년, KINX의 멀티 클라우드 연결 플랫폼 <b>CloudHub</b>에 zStorage를 제공하는 파트너십을 맺었습니다.</li>
<li>최근에는 한진정보통신과의 파트너십, 클라우드 엔지니어 커뮤니티 협력 등이 보도되었습니다.</li>
</ul>
<p>OJT 일정표 마지막에 "주요 고객사·KT Cloud/AWS 연계 환경"이 후속 교육으로 잡혀 있는 이유가 이 배경입니다.</p>

<h2 id="s6">내 OJT 일정과 연결하기</h2>
<div class="tbl-wrap"><table><thead><tr><th>지금 배우는 개념</th><th>나중에 실습하는 곳</th></tr></thead><tbody>
<tr><td>서버, VM, 가상화</td><td>5주차: zCompute에서 VM 만들기</td></tr>
<tr><td>Linux, SSH, 계정·권한</td><td>5주차: VM에 SSH로 접속해 웹 서버 설치</td></tr>
<tr><td>네트워크, Subnet, 방화벽</td><td>5~6주차: VPC·Subnet·Security Group 구성</td></tr>
<tr><td>3-Tier, 이중화, 로드밸런서</td><td>6주차: 웹 서버 2대 + 로드밸런서 구성</td></tr>
<tr><td>Block·File·Object, 스냅샷</td><td>7주차: VPSA 연결, 스냅샷·복구 실습</td></tr>
</tbody></table></div>
<p>지금 배우는 모든 기초가 <b>5~7주차에 실제 손으로 하는 작업</b>으로 이어집니다. 기초를 대충 넘기면 그때 막힙니다.</p>

<h2 id="s7">회사에서 자주 듣게 될 말</h2>
<ul><li><b>고객사 / 파트너사</b>: 서비스를 쓰는 회사 / 함께 파는 회사.</li><li><b>PoC</b>: 계약 전에 고객 환경에서 시험 구축해 검증하는 것.</li><li><b>구축</b>: 처음 설치하고 설정하는 작업. <b>운영</b>: 구축 후 안정적으로 돌아가게 관리하는 일.</li><li><b>장애</b>: 서비스가 멈추거나 느려지는 문제. <b>장애 대응</b>: 원인을 찾고 복구하는 일.</li></ul>
<p class="src">참고한 공개 자료: <a href="https://www.zadara.com/llms.txt" target="_blank" rel="noopener">zadara.com 사이트 안내</a> · <a href="https://www.zadara.com/wp-content/uploads/Zadara-Cloud-Technical-Overview.pdf" target="_blank" rel="noopener">Zadara Cloud Technical Overview</a> · <a href="https://www.zadara.com/wp-content/uploads/zadara-cloud-services.pdf" target="_blank" rel="noopener">Zadara Cloud Services 소개서</a> · <a href="https://www.zadara.com/blog/2022/11/03/zadara-and-kinx-enter-into-strategic-partnership-to-power-korean-multi-cloud-environments/" target="_blank" rel="noopener">Zadara–KINX 파트너십</a> · <a href="https://businesswire.com/news/home/20160302005032/en/Zadara-Expands-Enterprise-Storage-as-a-Service-Coverage-in-AWS-Seoul-Region-with-eBiztech" target="_blank" rel="noopener">AWS 서울 리전 지원 발표(2016)</a> · <a href="https://www.newswire.co.kr/newsRead.php?no=1032309" target="_blank" rel="noopener">한진정보통신 파트너십 보도</a></p>
`,
summary:['Zadara = 컴퓨트·스토리지·네트워킹을 완전 관리형·사용량 기반으로 제공하는 엣지 클라우드.','차이점: 원하는 위치에 설치(데이터 주권), 완전 관리형, 파트너 판매, AWS와 비슷한 개념 구조.','zStorage가 아래, zCompute가 위. 각각 따로 확장 가능.','zCompute = VM·VPC·SG·LB·오토스케일링·K8s·GPU (5~6주차).','zStorage = VPSA(Block·File) + Object(S3 호환) (7주차).'],
essay:[
{q:'Zadara가 어떤 회사인지 친구에게 30초 안에 설명해 보세요. (소리 내서 말해 보고 적기)',a:'Zadara는 서버·스토리지·네트워크 같은 IT 인프라를 클라우드 서비스로 빌려주는 회사다. AWS처럼 정해진 리전만 쓰는 게 아니라 고객 데이터센터나 지역 데이터센터 등 원하는 곳에 설치할 수 있고, 운영은 Zadara가 다 맡아 준다(완전 관리형). 요금은 쓴 만큼만 낸다. 제품은 컴퓨트(zCompute)와 스토리지(zStorage) 두 축이다.'},
{q:'규제 때문에 해외 퍼블릭 클라우드를 쓰기 어려운 고객에게 Zadara가 줄 수 있는 장점을 설명해 보세요.',a:'Zadara는 고객 데이터센터나 국내 데이터센터에 설치할 수 있어서 데이터를 국내·사내에 둔 채 클라우드처럼 쓸 수 있다(데이터 주권). 그러면서도 완전 관리형이라 운영 인력 부담이 적고, 사용량 기반 과금이라 장비를 한꺼번에 살 필요가 없다.'},
{q:'zCompute와 zStorage는 각각 무엇이고, 둘은 어떤 관계인가요?',a:'zCompute는 VM·VPC·Security Group·로드밸런서 같은 컴퓨팅과 네트워크 서비스이고, zStorage는 VPSA(Block·File)와 Object 같은 저장 서비스다. zStorage가 아래에서 저장 기능을 받치고 그 위에 zCompute가 올라가는 구조이며, 둘은 필요에 따라 따로 늘릴 수 있다.'}
],
quiz:[
{q:'Zadara의 사업을 가장 잘 요약한 것은?',o:['컴퓨트·스토리지·네트워킹을 완전 관리형, 사용량 기반 과금으로 제공하는 엣지 클라우드 서비스','서버 하드웨어를 만들어 파는 제조사','사무용 SaaS 소프트웨어 회사','인터넷 회선을 파는 통신사'],e:'Zadara는 인프라를 서비스로 제공하는(IaaS) 엣지 클라우드 회사입니다.'},
{q:'"완전 관리형(Fully Managed)"의 의미로 맞는 것은?',o:['운영·모니터링·장애 대응을 서비스 회사가 맡고, 고객은 서비스를 사용한다','고객이 모든 장비를 직접 수리한다','요금이 무료라는 뜻이다','사람 없이 자동으로만 운영된다는 뜻이다'],e:'장비가 고객 데이터센터에 있어도 운영은 Zadara 팀이 맡습니다.'},
{q:'다음 중 zCompute에 속하지 않는 것은?',o:['VPSA (전용 가상 스토리지 장비)','VM (가상 서버)','VPC (가상 네트워크)','Load Balancer'],e:'VPSA는 zStorage의 핵심 단위입니다.'},
{q:'VPSA에 대한 설명으로 맞는 것은?',o:['고객마다 따로 할당되는 전용 가상 스토리지 장비','VM의 다른 이름','방화벽 규칙의 이름','네트워크 스위치의 한 종류'],e:'Virtual Private Storage Array. 7주차에 직접 구성합니다.'},
{q:'Zadara가 일반 퍼블릭 클라우드와 다른 점으로 맞는 것은?',o:['고객 데이터센터나 지역 데이터센터 등 원하는 위치에 클라우드를 둘 수 있다','해외 리전에서만 서비스한다','고객이 장비를 반드시 구매해야 한다','스토리지 서비스는 제공하지 않는다'],e:'위치 선택(엣지)과 데이터 주권이 Zadara의 핵심 강점입니다.'},
{q:'SLA의 뜻으로 맞는 것은?',o:['서비스 제공자가 약속하는 서비스 수준(가용률 등)에 대한 합의','보안 프로그램의 이름','스토리지 연결 방식','계약 해지 절차'],e:'Service Level Agreement. 예: 99.999% 가용률 보장.'},
{q:'OJT에서 zStorage를 집중적으로 배우는 주차는?',o:['7주차','5주차','2주차','1주차'],e:'5~6주차는 zCompute, 7주차가 zStorage입니다.'}
]
});
