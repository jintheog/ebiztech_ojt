OJT.lesson({
id:'zc7', week:6, tag:'zCompute 7', mins:'약 3시간',
title:'기본 모니터링: Metrics, Events, Alarms, 상태 점검',
cover:[['Metrics','s1'],['Project Overview','s2'],['Monitoring 탭','s3'],['Events','s4'],['Alarms','s5'],['SNS Topic','s6'],['보는 범위','s7'],['상태 점검 순서','s8'],['직접 해 보기','s9']],
act:'Project의 지표와 Event를 확인하고, Alarm 규칙을 읽어 상태 점검 순서 설명',
goal:['Metrics, Events, Alarms의 차이를 설명할 수 있다','Event의 심각도와 필터로 필요한 Event를 찾을 수 있다','Alarm의 Metric, Statistic, Threshold, Sampling Window를 읽고 상태를 판단할 수 있다','Alarm과 SNS Topic으로 알림이 가는 과정을 설명할 수 있다','테넌트 사용자와 관리자가 보는 범위를 구분할 수 있다','장애가 의심될 때 확인하는 순서를 말할 수 있다'],
terms:[
['Metric','Metric','시간에 따라 측정한 값. CPU 사용률, 메모리 사용량, 네트워크 송수신량 등.'],
['Event','Event','자원에서 일어난 일을 시각과 함께 남긴 기록. 작업, 상태 변화, 검사 결과, 로그인 등.'],
['Alarm','Alarm','Metric 하나를 규칙과 비교해 상태를 정하는 설정.'],
['심각도','Severity','Event의 중요도. Critical, Error, Warning, Info가 있다.'],
['Project Overview','Project Overview','Project의 VM·볼륨 요약과 자원 사용량 그래프를 보여 주는 화면.'],
['Monitoring 탭','Monitoring tab','VM이나 볼륨의 지표를 시간에 따라 보여 주는 탭.'],
['Events 탭','Events tab','자원 하나의 Event 목록과 시간선을 보여 주는 탭.'],
['Statistic','Statistic','Sampling Window 안의 값을 하나로 줄이는 방법. Average, Sum, Minimum, Maximum.'],
['Threshold','Threshold','Alarm이 비교하는 기준 값과 비교 연산자.'],
['Sampling Window','Sampling Window','한 번 판단할 때 값을 모으는 시간(초).'],
['OK','OK','Alarm의 조건에 맞지 않는 정상 상태.'],
['ALARM','ALARM','Alarm의 조건에 맞은 상태.'],
['INSUFFICIENT DATA','INSUFFICIENT DATA','지표를 측정할 수 없어 판단하지 못한 상태.'],
['SNS Topic','SNS Topic','이메일 주소를 구독자로 등록해 두는 알림 주제.'],
['UUID','Universally Unique Identifier','자원마다 붙는 고유 ID. 이름과 달리 겹치지 않는다.'],
['System Alert','System Alert','클라우드 구성 요소의 이상을 알리는 관리자용 경보.'],
['Symp','Symp','zCompute의 명령줄 도구와 API. 지표와 Event를 조회할 수 있다.']
],
body:`
<h2 id="s1">Metrics, Events, Alarms</h2>
<p>모니터링은 문제를 일찍 찾고 멈추는 시간을 줄이기 위해 자원의 상태를 지켜보는 일이다. zCompute에서는 세 가지를 함께 본다.</p>
<div class="tbl-wrap"><table><thead><tr><th>구분</th><th>무엇인가</th><th>예</th></tr></thead><tbody>
<tr><td class="nw"><b>Metrics</b></td><td>시간에 따라 측정한 <b>값</b></td><td>VM의 CPU 사용률, 메모리 사용량, 네트워크 송신량</td></tr>
<tr><td class="nw"><b>Events</b></td><td>일어난 <b>일</b>의 기록</td><td>VM 시작, 상태 변화, 실패한 작업, 로그인</td></tr>
<tr><td class="nw"><b>Alarms</b></td><td>Metric을 <b>규칙</b>과 비교한 결과</td><td>CPU 평균이 80% 이상이면 ALARM</td></tr>
</tbody></table></div>
<p>Metric은 "얼마나"를, Event는 "무슨 일이 언제"를 알려 준다. Alarm은 Metric을 계속 지켜보다가 규칙에 맞으면 상태를 바꾸고 알린다.</p>

<h2 id="s2">Project Overview</h2>
<p><b>Project Overview</b> 화면은 Project 전체의 요약과 사용량 그래프를 보여 준다. 가이드가 설명하는 항목은 다음과 같다.</p>
<div class="tbl-wrap"><table><thead><tr><th>항목</th><th>보여 주는 것</th></tr></thead><tbody>
<tr><td class="nw"><b>Summary - VMs</b></td><td>VM 수와 상태별 수(running, active, error, shutoff)</td></tr>
<tr><td class="nw"><b>Summary - Volumes</b></td><td>볼륨 수와 상태</td></tr>
<tr><td class="nw"><b>Top Virtual Machines</b></td><td>CPU, 메모리, 네트워크 수신·송신 사용량이 많은 VM</td></tr>
<tr><td class="nw"><b>CPU · Memory Usage</b></td><td>Project의 모든 VM을 합친 CPU와 메모리 사용량</td></tr>
<tr><td class="nw"><b>Network Usage · Drop</b></td><td>네트워크 송수신 속도와 버려진 패킷 수</td></tr>
</tbody></table></div>
<p>요약에서 error 상태의 VM이 보이거나 그래프가 갑자기 바뀌면, 그 자원의 Monitoring 탭과 Events로 들어가 원인을 좁힌다.</p>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><p>실습 Project의 Overview 화면에 실제로 보이는 항목. 버전과 권한에 따라 다를 수 있다.</p></div>

<h2 id="s3">Monitoring 탭</h2>
<p>VM과 볼륨 같은 일부 자원에는 <b>Monitoring 탭</b>이 있다. 이 탭은 그 자원의 지표를 시간에 따라 그래프로 보여 준다. 예를 들어 VM은 CPU와 메모리 사용률의 변화를 볼 수 있다.</p>
<ul><li>한 시점의 값보다 <b>변화</b>를 본다. 평소보다 높은 상태가 계속되는지, 특정 시각에 갑자기 바뀌었는지 확인한다.</li><li>그래프가 바뀐 시각을 기억해 두고, 같은 시각의 Event를 찾는다.</li></ul>
<p>화면 밖에서는 AWS 호환 API로 자원의 상태를, Symp API로 지표를 가져올 수 있다.</p>
<p class="small muted">플랫폼의 지표는 VM 바깥에서 본 값이다. 어떤 프로세스가 CPU를 쓰는지는 VM 안의 명령(<code>top</code>, <code>free</code> 등)으로 확인한다.</p>

<h2 id="s4">Events</h2>
<p><b>Event</b>는 자원에서 일어난 일을 시각과 함께 남긴 기록이다. 사용자나 자동화가 한 작업, 상태 변화, 검사 결과, 로그인과 로그인 시도까지 남는다.</p>
<div class="tbl-wrap"><table><thead><tr><th>보는 곳</th><th>범위</th></tr></thead><tbody>
<tr><td class="nw"><b>자원의 Events 탭</b></td><td>그 자원 하나의 Event와 시간선</td></tr>
<tr><td class="nw"><b>Monitoring &gt; Events</b></td><td>Project 안 모든 자원의 Event</td></tr>
</tbody></table></div>
<p>심각도는 <b>Critical, Error, Warning, Info</b>로 나뉜다. 시간선에서 Info는 초록, Warning은 주황, Error는 빨강 점으로 보인다.</p>
<ul><li><b>필터</b>: 기간, 심각도, 글자, 자원 유형, Event 이름, 사용자 등으로 좁힌다.</li><li><b>상세</b>: 행이나 점을 누르면 Event의 전체 내용을 본다.</li><li><b>내보내기</b>: 목록을 CSV 파일로 저장할 수 있다.</li></ul>
<p>Event는 정해진 기간이 지나거나 개수가 한도를 넘으면 오래된 것부터 지워진다. 나중에 필요한 기록은 내보내 둔다.</p>
<h3>자원은 UUID로 가리킨다</h3>
<p>이름은 겹칠 수 있다. 같은 이름의 VM을 여러 대 만들 수도 있고, 지운 뒤 같은 이름으로 다시 만들 수도 있다. 그래서 문제를 기록하거나 지원을 요청할 때는 자원의 <b>ID(UUID)</b>를 적는다.</p>

<h2 id="s5">Alarms</h2>
<p><b>Alarm</b>은 Metric 하나를 규칙과 비교해 상태를 정하는 설정이다. 교육자료는 사용자가 Auto Scaling Group, VM, Project, 볼륨에 Alarm을 만들 수 있고, 관리자는 클러스터와 노드 같은 클라우드 자원에도 만들 수 있다고 설명한다.</p>
<div class="tbl-wrap"><table><thead><tr><th>설정</th><th>뜻</th></tr></thead><tbody>
<tr><td class="nw"><b>Type · 대상</b></td><td>어떤 종류의 어느 자원을 볼지(예: VM 하나)</td></tr>
<tr><td class="nw"><b>Metric</b></td><td>볼 지표. 고를 수 있는 목록은 Type마다 다르다</td></tr>
<tr><td class="nw"><b>Statistic</b></td><td>모은 값을 하나로 줄이는 방법: Average, Sum, Minimum, Maximum</td></tr>
<tr><td class="nw"><b>Threshold</b></td><td>비교 연산자(&gt;=, &gt;, &lt;, &lt;=)와 기준 값</td></tr>
<tr><td class="nw"><b>Sampling Window</b></td><td>한 번 판단할 때 값을 모으는 시간(초)</td></tr>
</tbody></table></div>
<svg class="fig" viewBox="0 0 560 240" role="img" aria-label="VM의 CPU 사용률이라는 Metric을 Alarm이 Average 80 이상이라는 규칙과 비교한다. Alarm의 상태는 OK, ALARM, INSUFFICIENT DATA 중 하나이고, 상태가 바뀌면 Event가 기록되고 SNS Topic의 구독자에게 이메일이 간다.">
<rect x="10" y="84" width="124" height="70" rx="8" class="bx-n"/><text x="72" y="114" class="c b">Metric</text><text x="72" y="140" class="c t-m">VM CPU %</text>
<line x1="136" y1="119" x2="174" y2="119" class="ln" marker-end="url(#ar)"/>
<rect x="178" y="84" width="154" height="70" rx="8" class="bx-a"/><text x="255" y="114" class="c b">Alarm</text><text x="255" y="140" class="c t-m">Average ≥ 80</text>
<text x="255" y="186" class="c t-m">상태: OK · ALARM</text><text x="255" y="210" class="c t-m">INSUFFICIENT DATA</text>
<line x1="334" y1="106" x2="384" y2="66" class="ln acc" marker-end="url(#ar-acc)"/>
<line x1="334" y1="132" x2="384" y2="172" class="ln acc" marker-end="url(#ar-acc)"/>
<rect x="388" y="24" width="164" height="70" rx="8" class="bx-g"/><text x="470" y="54" class="c b">Event</text><text x="470" y="80" class="c t-m">상태 변화 기록</text>
<rect x="388" y="138" width="164" height="70" rx="8" class="bx-g"/><text x="470" y="168" class="c b">SNS Topic</text><text x="470" y="194" class="c t-m">구독자 이메일</text>
</svg>
<div class="tbl-wrap"><table><thead><tr><th>상태</th><th>뜻</th></tr></thead><tbody>
<tr><td class="nw"><b>OK</b></td><td>조건에 맞지 않는다</td></tr>
<tr><td class="nw"><b>ALARM</b></td><td>조건에 맞았다</td></tr>
<tr><td class="nw"><b>INSUFFICIENT DATA</b></td><td>지표를 측정하지 못해 판단할 수 없다(예: 만든 직후 값이 아직 모이지 않음)</td></tr>
</tbody></table></div>
<p>Alarm이 상태를 바꾸면 Event 로그에 기록이 남는다. Alarm을 만든 뒤에는 Alarm을 편집할 때 그 Metric의 기록도 볼 수 있다.</p>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><ul><li>테넌트의 일반 사용자(Member)가 Alarm과 SNS Topic을 만들 수 있는지. 가이드는 이 기능을 관리자 가이드에서만 설명하고, 교육자료는 사용자도 만들 수 있다고 설명한다.</li><li>Alarm에서 고를 수 있는 Metric 목록(가이드에 나열되어 있지 않다)</li></ul></div>

<h2 id="s6">SNS Topic</h2>
<p><b>SNS Topic</b>은 이메일 주소를 <b>구독자</b>로 등록해 두는 알림 주제다. Alarm에 Topic을 연결하면, 연결한 상태가 될 때 구독자 모두에게 이메일이 간다.</p>
<ul><li><b>ALARM이 될 때</b>: 지표가 조건에 맞았을 때</li><li><b>ALARM에서 벗어날 때</b>: 지표가 다시 조건에서 벗어났을 때</li><li><b>INSUFFICIENT DATA가 될 때</b>: 지표를 측정할 수 없을 때</li></ul>
<p>상태마다 Topic을 0개 이상 고를 수 있다. 사람마다 Alarm에 직접 주소를 넣지 않고 Topic에 모아 두면, 담당자가 바뀔 때 Topic의 구독자만 고치면 된다.</p>

<h2 id="s7">보는 범위</h2>
<p>테넌트 사용자는 자기 Project의 자원을 보고, 관리자는 클라우드 자체의 상태까지 본다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>테넌트 사용자</th><th>관리자(클라우드 수준)</th></tr></thead><tbody>
<tr><td class="nw"><b>대상</b></td><td>자기 Project의 VM, 볼륨, 네트워크 등</td><td>노드, 스토리지, 클라우드 서비스 전체</td></tr>
<tr><td class="nw"><b>도구</b></td><td>Project Overview, Monitoring 탭, Events, Alarm·SNS Topic, AWS·Symp API</td><td>위의 것에 더해 System Alerts, 클라우드 전체 대시보드, 로그·지표를 외부 서버로 보내는 설정</td></tr>
<tr><td class="nw"><b>할 일</b></td><td>지켜보고, 필터로 좁히고, 반복되는 문제는 관리자에게 알린다</td><td>대시보드를 보고, 알림을 설정하고, 클라우드 이상에 대응한다</td></tr>
</tbody></table></div>
<p class="small muted">System Alert는 노드 장애나 노드 CPU 과부하처럼 클라우드 구성 요소의 이상을 알리는 경보다. 테넌트 사용자가 직접 다루는 것이 아니다.</p>

<h2 id="s8">상태 점검 순서</h2>
<p>서비스가 느리거나 안 될 때는 넓은 곳에서 좁은 곳으로 확인한다.</p>
<div class="flow"><div class="n"><b>Overview</b><small>error 상태·그래프</small></div><span class="ar">→</span><div class="n"><b>자원 상태</b><small>VM·LB·볼륨</small></div><span class="ar">→</span><div class="n k"><b>Events</b><small>Error·Warning, 시각</small></div><span class="ar">→</span><div class="n"><b>Monitoring 탭</b><small>지표 변화</small></div><span class="ar">→</span><div class="n"><b>VM 안</b><small>서비스·로그</small></div></div>
<ol><li>Project Overview에서 error 상태의 자원과 갑자기 바뀐 그래프를 찾는다.</li><li>의심되는 자원의 상태를 본다. LB는 LB 상태와 Target Group의 대상 상태를 따로 본다.</li><li>Events를 기간과 심각도(Error, Warning)로 좁혀 문제가 시작된 시각과 그 직전의 작업을 찾는다.</li><li>같은 시각의 Monitoring 탭에서 CPU, 메모리, 네트워크 변화를 본다.</li><li>네트워크가 의심되면 Test Connectivity로 VM까지의 연결을 시험하고, VM 안에서 서비스 상태와 로그를 확인한다.</li><li>해결하지 못하면 자원의 UUID, 시각, 관찰한 내용을 적어 관리자에게 알린다.</li></ol>
<p class="small muted">위 순서는 가이드에 있는 절차가 아니라 일반적인 점검 방법이다.</p>
<p>구축 결과를 검증하고 보고서에 남기는 방법은 <a data-lesson="zc8"></a>에서 다룬다.</p>

<h2 id="s9">직접 해 보기</h2>
<p>VM의 CPU 사용률에 Alarm을 만들었다. Statistic은 Average, Threshold는 <code>&gt;= 80</code>, Sampling Window는 300초다. 한 Sampling Window 동안 모인 값이 <code>60, 95, 70, 75</code>이면 상태는? Statistic을 Maximum으로 바꾸면?</p>
<details class="fold"><summary>답 보기</summary><p>평균은 (60 + 95 + 70 + 75) ÷ 4 = 75이고 75 ≥ 80은 거짓이므로 <b>OK</b>다. Maximum은 95이고 95 ≥ 80이므로 <b>ALARM</b>이다. 같은 값이어도 Statistic에 따라 상태가 달라진다. Average는 잠깐 튄 값에 덜 민감하고, Maximum은 한 번만 높아도 조건에 맞는다.</p></details>
`,
summary:['Metrics는 측정한 값, Events는 일어난 일의 기록, Alarms는 Metric을 규칙과 비교한 결과다.','Project Overview는 VM·볼륨 요약과 CPU·메모리·네트워크 사용량을 보여 준다.','VM과 볼륨의 Monitoring 탭에서 지표의 변화를 보고, 같은 시각의 Event를 찾는다.','Event는 자원의 Events 탭이나 Monitoring > Events에서 보고, 기간과 심각도로 좁힌다.','자원은 이름이 아니라 UUID로 가리킨다.','Alarm은 Metric, Statistic, Threshold, Sampling Window로 상태(OK, ALARM, INSUFFICIENT DATA)를 정한다.','Alarm의 상태 변화는 Event로 남고, SNS Topic의 구독자에게 이메일로 알릴 수 있다.','점검은 Overview → 자원 상태 → Events → Monitoring 탭 → VM 안 순서로 좁혀 간다.'],
essay:[
{q:'Metrics, Events, Alarms의 차이를 설명해 보세요.',a:'Metrics는 CPU 사용률처럼 시간에 따라 측정한 값이다. Events는 VM 시작이나 상태 변화처럼 일어난 일을 시각과 함께 남긴 기록이다. Alarms는 Metric을 규칙과 비교해 상태를 정하고, 상태가 바뀌면 기록하고 알린다.'},
{q:'Event를 볼 수 있는 두 곳과 각각의 범위를 설명해 보세요.',a:'자원의 Events 탭은 그 자원 하나의 Event를 보여 주고, Monitoring > Events는 Project 안 모든 자원의 Event를 보여 준다.'},
{q:'문제를 기록할 때 자원 이름 대신 UUID를 쓰는 이유는 무엇인가요?',a:'이름은 겹칠 수 있고, 지운 뒤 같은 이름으로 다시 만들 수도 있다. UUID는 자원마다 하나뿐이라 어떤 자원인지 정확히 가리킨다.'},
{q:'Alarm의 Statistic을 Average로 할 때와 Maximum으로 할 때의 차이를 설명해 보세요.',a:'Average는 Sampling Window 안의 값의 평균으로 판단하므로 잠깐 튄 값에 덜 민감하다. Maximum은 가장 큰 값으로 판단하므로 한 번만 높아도 조건에 맞는다.'},
{q:'Alarm에 이메일 주소를 직접 넣지 않고 SNS Topic을 쓰는 장점은 무엇인가요?',a:'구독자를 Topic에 모아 두므로, 담당자가 바뀌면 Topic의 구독자만 고치면 된다. 여러 Alarm이 같은 Topic을 쓸 수도 있다.'},
{q:'서비스가 안 될 때 상태를 점검하는 순서를 설명해 보세요.',a:'Project Overview에서 error 상태와 그래프 변화를 찾고, 의심되는 자원의 상태를 본다. Events를 기간과 심각도로 좁혀 문제가 시작된 시각을 찾고, 같은 시각의 지표를 Monitoring 탭에서 본다. 그다음 연결 시험과 VM 안의 서비스·로그를 확인하고, 해결하지 못하면 UUID와 시각을 적어 관리자에게 알린다.'}
],
quiz:[
{v:[
 {q:'시간에 따라 측정한 값(예: CPU 사용률)을 무엇이라 하는가?',o:['Metric','Event','Alarm','SNS Topic'],e:'Metric은 측정한 값이다.'},
 {q:'"VM이 언제 시작되었는가"를 확인할 때 보는 것은?',o:['Event','Metric','Threshold','Statistic'],e:'Event는 일어난 일을 시각과 함께 기록한다.'},
 {q:'Metric을 규칙과 비교해 상태를 정하는 것은?',o:['Alarm','Event','UUID','Monitoring 탭'],e:'Alarm은 Metric과 규칙을 비교해 OK, ALARM, INSUFFICIENT DATA 중 하나로 정한다.'}
]},
{q:'Project Overview에서 확인할 수 있는 것은?',o:['VM의 상태별 수와 Project 전체의 CPU·메모리 사용량','VM 안의 프로세스 목록','다른 Project의 Event','노드의 하드웨어 상태'],e:'Project Overview는 Project의 VM·볼륨 요약과 사용량 그래프를 보여 준다.'},
{v:[
 {q:'VM 하나의 CPU와 메모리 사용률 변화를 그래프로 보는 곳은?',o:['그 VM의 Monitoring 탭','Monitoring > Events','SNS Topic','Security Group'],e:'VM과 볼륨의 Monitoring 탭이 자원의 지표를 시간에 따라 보여 준다.'},
 {q:'플랫폼 지표로 CPU가 높은 것을 확인했다. 어떤 프로세스가 CPU를 쓰는지는 어디서 보는가?',o:['VM 안의 top 같은 명령','Project Overview','SNS Topic','Event 필터'],e:'플랫폼 지표는 VM 바깥에서 본 값이다. 프로세스는 VM 안에서 확인한다.'}
]},
{v:[
 {q:'Project 안 모든 자원의 Event를 한 번에 보는 곳은?',o:['Monitoring > Events','자원의 Events 탭','Monitoring 탭','Summary - Volumes'],e:'자원의 Events 탭은 그 자원 하나만, Monitoring > Events는 Project 전체를 보여 준다.'},
 {q:'자원의 Events 탭이 보여 주는 범위는?',o:['그 자원 하나의 Event','Project 전체의 Event','클라우드 전체의 Event','다른 Account의 Event'],e:'자원의 Events 탭은 그 자원의 Event와 시간선만 보여 준다.'}
]},
{q:'Event 심각도 Info, Warning, Error 중 가장 심각한 것은?',o:['Error','Warning','Info','모두 같다'],e:'Info < Warning < Error 순서이고, 이보다 높은 Critical도 있다.'},
{q:'문제가 시작된 시각을 찾을 때 Event를 좁히는 방법으로 알맞은 것은?',o:['기간과 심각도로 필터한다','이름순으로 정렬만 한다','모든 Event를 지운다','Info만 남긴다'],e:'기간과 심각도(Error, Warning)로 좁히면 문제 시각 근처의 중요한 Event가 남는다.'},
{v:[
 {q:'지원을 요청할 때 자원을 가리키는 값으로 알맞은 것은?',o:['UUID','자원 이름','생성 시각','Instance Type'],e:'이름은 겹칠 수 있으므로 고유한 UUID를 쓴다.'},
 {q:'자원 이름으로 자원을 가리키면 안 되는 이유는?',o:['이름은 겹칠 수 있기 때문','이름은 영어만 쓸 수 있기 때문','이름은 Event에 남지 않기 때문','이름은 바꿀 수 없기 때문'],e:'같은 이름의 자원이 여러 개 있거나, 지운 뒤 같은 이름으로 다시 만들 수 있다.'}
]},
{v:[
 {q:'Alarm의 Statistic이 하는 일은?',o:['Sampling Window 안의 값을 하나로 줄인다','알림을 받을 주소를 정한다','지표의 이름을 바꾼다','Event를 지운다'],e:'Statistic(Average, Sum, Minimum, Maximum)은 모은 값을 하나로 줄인다.'},
 {q:'Alarm의 Sampling Window의 뜻은?',o:['한 번 판단할 때 값을 모으는 시간','Alarm을 보관하는 기간','이메일을 보내는 간격','Event를 지우는 시간'],e:'Sampling Window 동안 모은 값을 Statistic으로 줄여 Threshold와 비교한다.'}
]},
{v:[
 {q:'Alarm이 지표를 측정하지 못해 판단할 수 없을 때의 상태는?',o:['INSUFFICIENT DATA','OK','ALARM','Error'],e:'값이 모이지 않으면 INSUFFICIENT DATA가 된다.'},
 {q:'Alarm의 조건에 맞지 않는 정상 상태는?',o:['OK','ALARM','INSUFFICIENT DATA','Warning'],e:'조건에 맞으면 ALARM, 맞지 않으면 OK다.'}
]},
{gen(){
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const st=pick(['Average','Maximum','Minimum']), op=pick(['>=','>','<=','<']);
  const metric= op[0]==='>'? 'CPU 사용률(%)' : '여유 메모리 비율(%)';
  const test=x=> op==='>='? x>=th : op==='>'? x>th : op==='<='? x<=th : x<th;
  let v, th, ok=false;
  for(let i=0;i<500 && !ok;i++){
    v=[0,0,0,0].map(()=>40+5*Math.floor(Math.random()*12));
    th=pick([60,70,80]);
    // 값이 기준을 사이에 둘 때만 쓴다: Maximum과 Minimum의 결과가 갈리므로 Statistic에 따라 답이 달라진다
    ok= v.reduce((a,b)=>a+b,0)%4===0 && test(Math.max(...v))!==test(Math.min(...v));
  }
  if(!ok){ v=[60,95,70,75]; th=80; }
  const avg=v.reduce((a,b)=>a+b,0)/4, val= st==='Average'? avg : st==='Maximum'? Math.max(...v) : Math.min(...v);
  const hit=test(val), right=hit?'ALARM':'OK', wrong=hit?'OK':'ALARM';
  return {q:metric+' Alarm의 Statistic은 '+st+', Threshold는 '+op+' '+th+'이다. 한 Sampling Window 동안 모인 값이 '+v.join(', ')+'일 때 Alarm의 상태는? (이 네 값만으로 판단하고, 값이 모두 측정되었다고 가정)',
    o:[right,wrong,'INSUFFICIENT DATA','Error'],
    e:st+'는 '+val+'이고 '+val+' '+op+' '+th+'는 '+(hit?'참':'거짓')+'이므로 '+right+'다.'};
}},
{v:[
 {q:'SNS Topic의 역할은?',o:['구독자로 등록한 이메일 주소들에 Alarm 알림을 보낸다','지표를 수집한다','Event를 지운다','VM을 자동으로 늘린다'],e:'SNS Topic에 등록한 구독자가 Alarm의 알림 이메일을 받는다.'},
 {q:'Alarm에 SNS Topic을 연결하는 장점은?',o:['담당자가 바뀌면 Topic의 구독자만 고치면 된다','지표가 더 자주 측정된다','Alarm 상태가 OK로 고정된다','Event가 남지 않는다'],e:'구독자를 Topic에 모아 두면 여러 Alarm을 고치지 않고 받는 사람만 바꿀 수 있다.'}
]},
{q:'Alarm이 상태를 바꾸었을 때 남는 것은?',o:['Event 로그의 기록','새 VM','새 Security Group','볼륨 스냅샷'],e:'Alarm의 상태 변화는 Event로 기록되고, 연결한 SNS Topic으로 알림도 간다.'},
{v:[
 {q:'테넌트 사용자가 아니라 관리자가 다루는 것은?',o:['System Alerts','자기 Project의 Events','VM의 Monitoring 탭','Project Overview'],e:'System Alert는 클라우드 구성 요소의 이상을 알리는 관리자용 경보다.'},
 {q:'노드 장애처럼 클라우드 구성 요소의 이상을 알리는 것은?',o:['System Alert','Project Overview','Sticky Session','Volume Type'],e:'System Alert는 클라우드 수준의 이상을 관리자에게 알린다.'}
]},
{q:'반복되는 문제를 테넌트 사용자가 스스로 해결하지 못했을 때 할 일로 알맞은 것은?',o:['UUID, 시각, 관찰한 내용을 적어 관리자에게 알린다','Event를 모두 지운다','Alarm을 지워 알림을 멈춘다','VM 이름을 바꾼다'],e:'사용자는 지켜보고 좁힌 뒤, 해결하지 못한 문제는 정확한 정보와 함께 관리자에게 알린다.'},
{q:'상태 점검 순서로 알맞은 것은?',o:['Overview → 자원 상태 → Events → Monitoring 탭 → VM 안','VM 안 → Events → 자원 상태 → Overview','Alarm 삭제 → Overview → VM 재시작','Events 전체 내보내기 → VM 삭제'],e:'넓은 곳에서 좁은 곳으로 확인하고, Event로 시각을 찾은 뒤 같은 시각의 지표를 본다.'}
]
});
