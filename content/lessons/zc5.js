OJT.lesson({
id:'zc5', week:6, tag:'zCompute 5', mins:'약 4시간',
title:'데이터 볼륨: Volume, Snapshot, Protection Group',
cover:[['Volume','s1'],['Volume Type','s2'],['생성과 연결','s3'],['VM 안에서 쓰기','s4'],['확장·분리·삭제','s5'],['Snapshot','s6'],['Protection Group','s7'],['B2OS','s8'],['복구','s9']],
act:'Volume을 VM에 연결해 데이터를 저장하고, 보호 정책과 복구 방법 설명',
goal:['Boot Volume과 데이터 볼륨의 차이를 설명할 수 있다','Volume Type이 정하는 것을 설명할 수 있다','Volume을 만들어 VM에 연결하고 VM 안에서 쓰기까지의 순서를 말할 수 있다','개별 Snapshot과 Protection Group의 차이를 설명할 수 있다','Protection Group의 주기와 보관 기간을 읽을 수 있다','로컬 스냅샷과 B2OS 원격 스냅샷의 역할을 구분할 수 있다'],
terms:[
['Block Storage','Block Storage','데이터를 블록 단위로 읽고 쓰는 저장소. VM에는 디스크처럼 보인다.'],
['Volume','Volume','VM에 연결해 디스크로 쓰는 Block Storage 자원.'],
['Boot Volume','Boot Volume','OS가 들어 있고 VM이 부팅하는 볼륨.'],
['데이터 볼륨','Data Volume','OS와 분리해 애플리케이션 데이터를 저장하는 볼륨.'],
['Volume Type','Volume Type','볼륨의 성능과 기능, 저장 위치(Storage Class)를 정하는 유형.'],
['Storage Class','Storage Class','Volume Type 아래에 있는 저장 장치 묶음. SSD 클래스와 HDD 클래스가 있다.'],
['IOPS','Input/Output Operations Per Second','1초에 처리하는 읽기·쓰기 횟수.'],
['처리량','Throughput','1초에 옮기는 데이터 양. MB/s로 표시한다.'],
['Retype','Retype','볼륨의 Volume Type을 바꾸는 작업.'],
['mkfs','make filesystem','디스크에 파일시스템을 만드는 명령. 기존 데이터를 지운다.'],
['마운트','Mount','파일시스템을 디렉터리에 연결하는 작업.'],
['Snapshot','Snapshot','볼륨이나 VM의 특정 시점 상태를 남긴 것.'],
['Crash-consistent','Crash-consistent','VM의 모든 볼륨을 같은 시점으로 맞춘 상태. 전원이 갑자기 꺼진 순간의 디스크와 같다.'],
['Protection Group','Backup Protection Group','백업 주기와 보관 기간을 정한 정책. VM과 볼륨을 넣어 보호한다.'],
['보관 기간','Retention','스냅샷을 남겨 두는 기간.'],
['B2OS','Backup to Object Storage','Protection Group의 스냅샷을 Object Storage로 보내 보관하고 복원하는 기능.'],
['External Endpoint','External Endpoint','B2OS가 스냅샷을 보낼 Object Storage의 접속 정보.'],
['Restore Protection Group','Restore Protection Group','다른 사이트나 다른 Account로 복원할 때 쓰는 복원용 그룹.']
],
body:`
<h2 id="s1">Volume</h2>
<p><b>Volume</b>은 VM에 연결해 디스크로 쓰는 <b>Block Storage</b> 자원이다. zCompute의 볼륨은 Zadara의 VPSA 스토리지 구조 위에서 제공된다.</p>
<ul><li><b>Boot Volume</b>: OS가 들어 있고 VM이 부팅하는 볼륨이다.</li><li><b>데이터 볼륨</b>: 애플리케이션 데이터를 OS와 나누어 저장하는 볼륨이다.</li></ul>
<svg class="fig" viewBox="0 0 560 230" role="img" aria-label="VM 하나에 Boot Volume과 Data Volume이 연결되어 있다. Boot Volume은 SSD, Data Volume은 SSD 또는 HDD이고, 두 볼륨 모두 zStorage의 VPSA 위에 있다.">
<use href="#i-server" x="24" y="88" width="56" height="56"/><text x="52" y="170" class="c b">VM</text>
<line x1="84" y1="106" x2="168" y2="66" class="ln" marker-end="url(#ar)"/>
<line x1="84" y1="128" x2="168" y2="176" class="ln" marker-end="url(#ar)"/>
<rect x="172" y="28" width="190" height="72" rx="8" class="bx-a"/><text x="267" y="58" class="c b">Boot Volume</text><text x="267" y="84" class="c t-m">OS · SSD</text>
<rect x="172" y="140" width="190" height="72" rx="8" class="bx-g"/><text x="267" y="170" class="c b">Data Volume</text><text x="267" y="196" class="c t-m">데이터 · SSD 또는 HDD</text>
<line x1="364" y1="66" x2="452" y2="104" class="ln dash" marker-end="url(#ar)"/>
<line x1="364" y1="176" x2="452" y2="130" class="ln dash" marker-end="url(#ar)"/>
<use href="#i-storage" x="458" y="88" width="56" height="56"/><text x="486" y="170" class="c b">zStorage</text><text x="486" y="194" class="c t-m">VPSA</text>
</svg>
<p>데이터를 별도 볼륨에 두면 OS와 데이터의 크기, 성능, 보호 정책을 따로 정할 수 있다. 교육자료는 Boot Volume에 SSD를, 데이터 볼륨에 SSD나 HDD를 쓴다고 설명한다.</p>

<h2 id="s2">Volume Type</h2>
<p><b>Volume Type</b>은 볼륨의 성능과 기능을 정하는 유형이다. 사용자는 볼륨을 만들 때 Volume Type을 고른다.</p>
<div class="tbl-wrap"><table><thead><tr><th>정하는 것</th><th>내용</th></tr></thead><tbody>
<tr><td class="nw"><b>저장 위치</b></td><td>볼륨이 놓일 Storage Class(SSD 또는 HDD)</td></tr>
<tr><td class="nw"><b>성능 한도</b></td><td>최대 <b>IOPS</b>(초당 읽기·쓰기 횟수)와 <b>처리량</b>(MB/s)</td></tr>
<tr><td class="nw"><b>기능</b></td><td>암호화, 중복 제거, 압축</td></tr>
</tbody></table></div>
<p>Volume Type과 Storage Class는 관리자가 구성한다. 사용자는 그 아래의 장치를 직접 다루지 않고 필요한 Volume Type만 고른다.</p>
<p>쓰는 도중 성능이 더 필요하면 <b>Retype</b>으로 Volume Type을 바꾼다. 가이드는 이 작업을 온라인으로 할 수 있다고 설명한다. 내부에서는 새 위치에 볼륨을 구성하고 데이터를 옮기므로, 옮기는 동안에는 Protection Group의 예약 스냅샷이 그 볼륨에서 실행되지 않는다.</p>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><ul><li>실습 Project에서 고를 수 있는 Volume Type의 이름과 성능</li><li>테넌트 사용자에게 Volume Type의 어떤 정보가 보이는지(가이드에 적혀 있지 않다)</li></ul></div>

<h2 id="s3">생성과 연결</h2>
<p>볼륨은 VM을 만들 때 함께 붙일 수도 있고, 나중에 만들어 붙일 수도 있다. 나중에 붙이는 순서는 다음과 같다.</p>
<div class="flow"><div class="n"><b>Create Volume</b><small>이름·Type·크기</small></div><span class="ar">→</span><div class="n"><b>Attach</b><small>연결할 VM 선택</small></div><span class="ar">→</span><div class="n k"><b>VM Stop</b></div><span class="ar">→</span><div class="n k"><b>VM Start</b></div></div>
<ol><li><b>Storage &gt; Block Storage</b>에서 <b>+</b>를 눌러 이름, 설명, Volume Type, 크기, Protection Group을 정한다.</li><li>볼륨을 선택하고 <b>Attach</b>를 누른 뒤 VM을 고른다. Attach는 아직 연결되지 않은 볼륨에서만 쓸 수 있다.</li><li>가이드의 절차에 따라 VM을 <b>Stop한 뒤 Start</b>한다.</li></ol>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><ul><li>볼륨 하나를 여러 VM에 동시에 연결할 수 있는지(가이드에 적혀 있지 않다)</li><li>Stop 없이 연결한 디스크가 VM 안에 보이는지</li></ul></div>

<h2 id="s4">VM 안에서 쓰기</h2>
<p>볼륨을 연결해도 바로 파일을 저장할 수는 없다. 새 디스크에 <b>파일시스템</b>을 만들고 디렉터리에 <b>마운트</b>해야 한다.</p>
<pre class="code">$ lsblk                                  <span class="c"># 새 디스크 이름 확인</span>
$ sudo mkfs.ext4 /dev/sdb                <span class="c"># 파일시스템 생성 (기존 데이터 삭제)</span>
$ sudo mkdir -p /data
$ sudo mount /dev/sdb /data
$ df -h /data                            <span class="c"># 용량 확인</span>
$ sudo blkid /dev/sdb                    <span class="c"># fstab에 적을 UUID 확인</span></pre>
<p>재부팅 뒤에도 마운트되도록 <code>/etc/fstab</code>에 UUID로 등록한다. <code>nofail</code>은 이 디스크가 없어도 부팅을 멈추지 않게 하는 옵션이다.</p>
<pre class="code">UUID=&lt;blkid로 확인한 값&gt;  /data  ext4  defaults,nofail  0  2</pre>
<p class="small muted">위 명령은 일반적인 Linux 사용법이고 학습용 예시다. 디스크 이름은 환경에 따라 다르므로 <code>lsblk</code>의 크기로 확인한다.</p>
<div class="box warn"><span class="lbl">주의: mkfs는 데이터를 지운다</span><p>이미 데이터가 있는 디스크에 실행하면 그 데이터를 잃는다. 실행하기 전에 대상 디스크가 맞는지 확인한다.</p></div>

<h2 id="s5">확장·분리·삭제</h2>
<ul><li><b>Extend</b>: 볼륨을 늘린다. <b>늘릴 수만 있고 줄일 수는 없다.</b> VM에 연결된 볼륨을 늘릴 때 VM을 재시작할 필요는 없지만, VM 안의 파티션이나 파일시스템은 따로 늘려야 할 수 있다.</li><li><b>Detach</b>: 볼륨을 VM에서 분리한다. 분리 전에 VM 안에서 쓰기를 멈추고 <code>umount</code>하는 것이 일반적인 방법이다.</li><li><b>Delete</b>: 볼륨을 삭제한다. 지우기 전에 필요한 데이터와 스냅샷을 확인한다.</li></ul>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><ul><li>Detach할 때 VM을 먼저 멈춰야 하는지(가이드에 조건이 적혀 있지 않다)</li><li>볼륨을 삭제하면 그 볼륨의 스냅샷이 어떻게 되는지</li></ul></div>

<h2 id="s6">Snapshot</h2>
<p><b>Snapshot</b>은 볼륨이나 VM의 <b>특정 시점 상태</b>를 남긴 것이다. VM 스냅샷에는 Boot Volume과 여러 데이터 볼륨이 포함될 수 있다. 첫 스냅샷 뒤의 스냅샷은 바뀐 내용을 기록한다.</p>
<div class="tbl-wrap"><table><thead><tr><th>대상</th><th>스냅샷으로 할 수 있는 일</th></tr></thead><tbody>
<tr><td class="nw"><b>Volume</b></td><td>스냅샷에서 새 볼륨 만들기, 이미지 만들기</td></tr>
<tr><td class="nw"><b>VM</b></td><td>스냅샷에서 VM 복원하기</td></tr>
</tbody></table></div>
<p>VM 화면이나 Storage 화면에서 직접 찍은 스냅샷은 볼륨마다 따로 찍힌다. 그래서 <mark>여러 볼륨을 같은 시점으로 맞춘 Crash-consistent 상태가 아니다.</mark> 가이드는 Crash-consistent 백업에 Protection Group을 쓰도록 권장한다.</p>
<p class="small muted">Crash-consistent는 전원이 갑자기 꺼진 순간의 디스크와 같은 상태다. 메모리에만 있던 내용은 포함되지 않으므로, DB는 복구한 뒤 자체 복구 과정과 데이터를 확인한다(일반적인 운영 지식).</p>

<h2 id="s7">Protection Group</h2>
<p><b>Backup Protection Group</b>은 <b>백업 주기와 보관 기간을 정한 정책</b>이다. 여기에 VM과 볼륨을 넣으면 정책대로 스냅샷이 만들어진다. VM을 넣으면 그 VM에 연결된 볼륨도 함께 보호되고, 한 VM의 모든 볼륨을 같은 시점으로 찍는다.</p>
<div class="tbl-wrap"><table><thead><tr><th>정책 항목</th><th>뜻</th></tr></thead><tbody>
<tr><td class="nw"><b>Recurrence · Every</b></td><td>스냅샷을 찍는 단위와 간격(예: 6시간마다)</td></tr>
<tr><td class="nw"><b>Start Time</b></td><td>일정을 시작하는 시각</td></tr>
<tr><td class="nw"><b>Local Retention</b></td><td>로컬 스냅샷의 보관 기간(일)</td></tr>
<tr><td class="nw"><b>Backup to Object Store</b></td><td>원격 보관을 켜는 설정. 켜면 External Endpoint를 고른다</td></tr>
<tr><td class="nw"><b>Remote snapshots every</b></td><td>로컬 스냅샷 <b>몇 개마다</b> 하나를 원격으로 보낼지</td></tr>
<tr><td class="nw"><b>Remote Retention</b></td><td>원격 스냅샷의 보관 기간(일)</td></tr>
</tbody></table></div>
<h3>정책 읽기</h3>
<p>6시간마다 찍고 <code>Remote snapshots every = 4</code>이면 원격 스냅샷은 6 × 4 = <b>24시간마다</b> 만들어진다. 주기가 짧을수록 잃는 데이터가 줄지만 스냅샷이 많아진다.</p>
<ul><li>Protection Group은 <b>같은 Project 안에서</b> 백업하고 복구한다.</li><li>보호 대상 볼륨 중 하나라도 <b>Ready 상태가 아니면</b> 그 스냅샷은 건너뛴다. 정책을 만든 뒤에도 스냅샷이 실제로 생기는지 확인한다.</li><li>이미 그룹에 단독으로 들어 있는 볼륨의 VM을 같은 그룹에 넣으면 실패한다. 볼륨의 보호를 먼저 해제하고 VM을 넣는다.</li></ul>
<p>실습 과제에 맞는 정책을 정하는 방법은 <a data-lesson="zc8"></a>에서 다룬다.</p>

<h2 id="s8">B2OS</h2>
<p><b>B2OS</b>(Backup to Object Storage)는 Protection Group의 스냅샷을 <b>Object Storage로 보내 보관</b>하고 필요할 때 복원하는 기능이다. 로컬 스냅샷은 로컬 Block Storage 안에 있으므로, 그 바깥에 사본을 두려면 B2OS를 켠다. VM에 별도 에이전트를 설치하지 않으며, 현재 대상은 Zadara Object Storage(NGOS)다.</p>
<svg class="fig" viewBox="0 0 560 240" role="img" aria-label="Protection Group 안의 VM과 Volume이 주기마다 로컬 스냅샷을 만들고, B2OS를 켜면 로컬 스냅샷 N개마다 하나가 Object Storage의 원격 스냅샷으로 전송된다.">
<rect x="8" y="16" width="176" height="200" rx="10" class="zone"/><text x="96" y="44" class="c b t-m">Protection Group</text>
<use href="#i-server" x="30" y="62" width="50" height="50"/><text x="55" y="136" class="c">VM</text>
<use href="#i-db" x="112" y="62" width="50" height="50"/><text x="137" y="136" class="c">Volume</text>
<text x="96" y="176" class="c t-m">주기·보관 기간</text><text x="96" y="198" class="c t-s">정책으로 관리</text>
<line x1="186" y1="100" x2="224" y2="100" class="ln acc" marker-end="url(#ar-acc)"/>
<rect x="228" y="62" width="124" height="76" rx="8" class="bx-a"/><text x="290" y="94" class="c b">로컬</text><text x="290" y="120" class="c b">스냅샷</text>
<text x="290" y="166" class="c t-m">주기마다 생성</text>
<line x1="354" y1="100" x2="412" y2="100" class="ln acc dash" marker-end="url(#ar-acc)"/><text x="383" y="46" class="c t-acc t-m">B2OS</text>
<rect x="416" y="62" width="136" height="76" rx="8" class="bx-g"/><text x="484" y="94" class="c b">원격</text><text x="484" y="120" class="c b">스냅샷</text>
<text x="484" y="166" class="c t-m">로컬 N개마다</text><text x="484" y="190" class="c t-m">Object Storage</text>
</svg>
<p class="small muted">Object Storage의 구성은 <a data-lesson="zs4"></a>에서 다룬다.</p>
<div class="box warn"><span class="lbl">주의: B2OS 버킷을 직접 고치지 않는다</span><p>이 버킷은 zCompute가 단독으로 관리한다. 안의 객체를 손으로 바꾸면 백업이 망가질 수 있다. 보호 데이터는 보관 기간을 바꾸거나 Protection Group을 삭제해서 지운다.</p></div>

<h2 id="s9">복구</h2>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>복구할 것</th><th>방법</th></tr></thead><tbody>
<tr><td class="nw"><b>VM</b></td><td>VM 스냅샷의 <b>Restore</b>로 VM을 복원한다. 연결된 볼륨도 함께 복원된다.</td></tr>
<tr><td class="nw"><b>Volume</b></td><td>볼륨 스냅샷의 <b>Create Volume</b>으로 새 볼륨을 만든다.</td></tr>
<tr><td class="nw"><b>다른 사이트·Account</b></td><td><b>Restore Protection Group</b>을 만들어 원격 스냅샷에서 복원한다.</td></tr>
</tbody></table></div>
<p>콘솔에는 그룹 전체를 한 번에 복구하는 기능이 없다. <b>VM과 분리된 볼륨을 하나씩</b> 복구한다.</p>
<div class="box mem"><span class="lbl">복구는 실제로 해 봐야 안다</span><p>스냅샷이 있어도 복구되는지는 따로 확인한다. 파일을 만들고 스냅샷을 찍은 뒤 파일을 지우고, 복구한 볼륨에서 파일이 돌아왔는지 본다.</p></div>
<h3>직접 해 보기</h3>
<p>Protection Group이 0시에 시작해 4시간마다 스냅샷을 찍고, <code>Remote snapshots every = 3</code>이다. (1) 원격 스냅샷의 주기는? (2) 9시 30분에 데이터가 망가졌고 로컬 스냅샷을 쓸 수 있다면, 최대 얼마만큼의 변경을 잃는가?</p>
<details class="fold"><summary>답 보기</summary><p>(1) 4 × 3 = <b>12시간</b>이다. (2) 마지막 스냅샷은 8시이므로 <b>1시간 30분</b>의 변경을 잃는다.</p></details>
`,
summary:['Volume은 VM에 디스크로 연결하는 Block Storage 자원이고, Boot Volume과 데이터 볼륨으로 나누어 쓴다.','Volume Type은 Storage Class, 성능 한도, 기능을 정한다.','볼륨은 Create → Attach → VM Stop·Start 순서로 연결하고, VM 안에서 파일시스템을 만들어 마운트한다.','볼륨은 늘릴 수 있지만 줄일 수 없다.','개별 스냅샷은 Crash-consistent가 아니고, Protection Group은 VM의 모든 볼륨을 같은 시점으로 찍는다.','Protection Group은 백업 주기와 보관 기간을 정한 정책이며 같은 Project 안에서 백업하고 복구한다.','B2OS는 Protection Group의 스냅샷을 Object Storage로 보내 보관한다.','복구는 VM과 볼륨을 하나씩 하고, 복구 결과를 실제로 확인한다.'],
essay:[
{q:'OS와 데이터를 별도 볼륨에 두는 이유를 설명해 보세요.',a:'크기, 성능, 보호 정책을 따로 정할 수 있기 때문이다. 데이터 볼륨에는 필요한 Volume Type과 Protection Group을 따로 적용할 수 있다.'},
{q:'Volume Type이 정하는 것 세 가지를 설명해 보세요.',a:'볼륨이 놓일 Storage Class, 최대 IOPS와 처리량 같은 성능 한도, 암호화·중복 제거·압축 같은 기능을 정한다.'},
{q:'새 볼륨을 VM에서 파일 저장에 쓰기까지의 순서를 설명해 보세요.',a:'볼륨을 만들어 VM에 Attach하고 VM을 Stop한 뒤 Start한다. VM 안에서 lsblk로 디스크를 확인하고 mkfs로 파일시스템을 만든 뒤 디렉터리에 마운트한다. 재부팅 뒤에도 쓰려면 fstab에 UUID로 등록한다.'},
{q:'개별 Snapshot과 Protection Group의 차이를 설명해 보세요.',a:'개별 스냅샷은 볼륨마다 따로 찍혀 여러 볼륨의 시점이 맞지 않을 수 있다. Protection Group은 주기와 보관 기간을 정책으로 관리하고, 한 VM의 모든 볼륨을 같은 시점으로 찍는다.'},
{q:'6시간마다 찍고 Remote snapshots every가 4인 정책을 읽어 보세요.',a:'로컬 스냅샷은 6시간마다 만들어지고, 로컬 스냅샷 4개마다 하나가 원격으로 가므로 원격 스냅샷의 주기는 24시간이다.'},
{q:'로컬 스냅샷이 있는데 B2OS를 함께 쓰는 이유를 설명해 보세요.',a:'로컬 스냅샷은 로컬 Block Storage 안에 있다. B2OS는 Object Storage에 사본을 두므로 로컬 저장소 바깥의 복구 지점을 만들고, 다른 사이트나 Account로 복원할 수 있게 한다.'}
],
quiz:[
{v:[
 {q:'VM이 부팅할 때 쓰는 OS가 들어 있는 볼륨은?',o:['Boot Volume','데이터 볼륨','Object Storage 버킷','Snapshot'],e:'Boot Volume에 OS가 들어 있고 VM은 이 볼륨으로 부팅한다.'},
 {q:'애플리케이션 데이터를 OS와 나누어 저장하는 볼륨은?',o:['데이터 볼륨','Boot Volume','Instance Type','External Endpoint'],e:'데이터 볼륨은 OS와 분리해 데이터를 저장한다.'}
]},
{q:'zCompute의 Volume은 어떤 종류의 저장소인가?',o:['Block Storage','File Storage','Object Storage','메모리 캐시'],e:'Volume은 VM에 디스크로 연결되는 Block Storage다.'},
{v:[
 {q:'Volume Type이 정하는 것이 아닌 것은?',o:['VM의 vCPU 수','최대 IOPS','Storage Class','암호화 사용 여부'],e:'vCPU 수는 Instance Type이 정한다. Volume Type은 저장 위치, 성능 한도, 기능을 정한다.'},
 {q:'볼륨의 성능 한도와 저장 위치를 정하는 것은?',o:['Volume Type','Key Pair','Security Group','Route Table'],e:'Volume Type이 Storage Class와 IOPS·처리량 한도를 정한다.'}
]},
{q:'IOPS와 처리량(Throughput)의 차이로 맞는 것은?',o:['IOPS는 초당 읽기·쓰기 횟수, 처리량은 초당 옮기는 데이터 양이다','IOPS는 디스크 크기, 처리량은 파일 개수다','IOPS는 네트워크 지연, 처리량은 CPU 사용률이다','둘은 같은 값이다'],e:'IOPS는 횟수이고 처리량은 MB/s 같은 데이터 양이다.'},
{q:'볼륨의 Volume Type을 바꾸는 작업의 이름은?',o:['Retype','Attach','Extend','Restore'],e:'Retype은 볼륨을 새 Volume Type으로 옮기는 작업이다.'},
{v:[
 {q:'새 볼륨을 VM 안에서 쓰는 순서로 맞는 것은?',o:['디스크 확인 → 파일시스템 생성 → 마운트','마운트 → 디스크 확인 → 파일시스템 생성','파일시스템 생성 → 볼륨 연결 → 디스크 확인','마운트 → 파일시스템 생성 → 볼륨 연결'],e:'연결된 디스크를 lsblk로 확인하고, mkfs로 파일시스템을 만든 뒤 마운트한다.'},
 {q:'데이터가 있는 디스크에 실행하면 기존 데이터를 잃는 명령은?',o:['mkfs.ext4','lsblk','df -h','blkid'],e:'mkfs는 새 파일시스템을 만들면서 기존 내용을 지운다.'}
]},
{q:'/etc/fstab에 디스크를 등록하는 목적은?',o:['재부팅 뒤에도 자동으로 마운트하기 위해','디스크를 암호화하기 위해','볼륨 크기를 늘리기 위해','스냅샷을 예약하기 위해'],e:'fstab은 부팅할 때 마운트할 파일시스템을 적는 파일이다.'},
{q:'볼륨 크기를 조정할 때의 규칙으로 맞는 것은?',o:['늘릴 수 있지만 줄일 수는 없다','줄일 수 있지만 늘릴 수는 없다','크기는 만든 뒤 바꿀 수 없다','늘리거나 줄이는 것 모두 자유롭다'],e:'Extend는 크기를 늘리는 작업이고 줄일 수는 없다.'},
{q:'연결된 볼륨을 Extend한 뒤 VM 안에서 추가로 필요할 수 있는 일은?',o:['파티션이나 파일시스템 늘리기','Key Pair 다시 만들기','Elastic IP 다시 연결하기','Security Group 삭제하기'],e:'볼륨이 커져도 OS 안의 파티션과 파일시스템은 따로 늘려야 할 수 있다.'},
{v:[
 {q:'Snapshot의 설명으로 맞는 것은?',o:['볼륨이나 VM의 특정 시점 상태를 남긴 것','VM의 CPU를 늘리는 기능','트래픽을 나누는 기능','네트워크 경로를 저장한 표'],e:'Snapshot은 특정 시점의 상태를 남긴다.'},
 {q:'볼륨 스냅샷으로 할 수 있는 일은?',o:['그 시점의 내용으로 새 볼륨 만들기','VM의 Instance Type 바꾸기','Subnet의 CIDR 바꾸기','Security Group 복사하기'],e:'볼륨 스냅샷에서 새 볼륨이나 이미지를 만들 수 있다.'}
]},
{v:[
 {q:'VM의 여러 볼륨을 같은 시점으로 맞춰 백업하려면 무엇을 쓰는가?',o:['Protection Group','볼륨마다 개별 Snapshot','Volume Type','Target Group'],e:'개별 스냅샷은 볼륨마다 따로 찍힌다. Protection Group은 VM의 모든 볼륨을 같은 시점으로 찍는다.'},
 {q:'Crash-consistent 상태의 뜻은?',o:['VM의 모든 볼륨이 같은 시점으로 맞춰진, 전원이 갑자기 꺼진 순간과 같은 상태','메모리 내용까지 모두 저장한 상태','DB 트랜잭션이 모두 정리된 상태','스냅샷이 원격에 저장된 상태'],e:'Crash-consistent는 볼륨의 시점은 맞지만 메모리 내용은 포함하지 않는다.'}
]},
{v:[
 {q:'Protection Group의 정의로 맞는 것은?',o:['백업 주기와 보관 기간을 정한 정책','VM의 트래픽을 나누는 그룹','사용자 권한을 묶은 그룹','Subnet을 묶은 그룹'],e:'Protection Group은 백업 일정과 보관 기간을 정의하고 VM과 볼륨에 적용한다.'},
 {q:'VM을 Protection Group에 넣었을 때 그 VM에 연결된 볼륨은?',o:['함께 보호된다','따로 넣기 전에는 보호되지 않는다','연결이 끊어진다','Object Storage로 옮겨진다'],e:'그룹에 넣은 VM의 볼륨은 자동으로 포함된다.'}
]},
{q:'Protection Group의 Remote snapshots every 값의 뜻은?',o:['로컬 스냅샷 몇 개마다 하나를 원격으로 보낼지','원격 스냅샷을 며칠 보관할지','한 번에 보호할 VM 수','원격 저장소의 개수'],e:'이 값은 시간이 아니라 로컬 스냅샷의 개수다.'},
{gen(){
  const h=[2,4,6,8,12][Math.floor(Math.random()*5)], n=[2,3,4,6][Math.floor(Math.random()*4)];
  const t=v=>v+'시간';
  return {q:'Protection Group이 '+h+'시간마다 로컬 스냅샷을 찍고 Remote snapshots every가 '+n+'이다. 원격 스냅샷은 몇 시간마다 만들어지는가? (Remote snapshots every = 로컬 스냅샷 개수, 건너뛴 스냅샷은 없다고 가정)',
    o:[t(h*n),t(h),t(h*(n+1)),t(h*n*2)],
    e:h+'시간 × '+n+'개 = '+(h*n)+'시간이다.'};
}},
{gen(){
  const h=[2,3,4,6][Math.floor(Math.random()*4)], k=2+Math.floor(Math.random()*2), r=1+Math.floor(Math.random()*(h-1)), m=[0,30][Math.floor(Math.random()*2)];
  const f=h*k+r, last=h*k, lost=r*60+m;
  const d=v=>{const a=Math.floor(v/60),b=v%60;return (a?a+'시간':'')+(a&&b?' ':'')+(b?b+'분':'')};
  const p=(a,b)=>a+'시'+(b?' '+b+'분':'');
  return {q:'Protection Group이 0시에 시작해 '+h+'시간마다 로컬 스냅샷을 찍는다. 같은 날 '+p(f,m)+'에 데이터가 망가져 가장 최근 스냅샷으로 복구하면 잃는 변경은 최대 얼마인가? (스냅샷은 모두 성공했고 찍는 시간은 0으로 가정)',
    o:[d(lost),d(lost+h*60),d(h*60),d(f*60+m)],
    e:'마지막 스냅샷은 '+last+'시이므로 '+p(f,m)+'까지 '+d(lost)+'의 변경을 잃는다.'};
}},
{v:[
 {q:'B2OS의 역할은?',o:['Protection Group의 스냅샷을 Object Storage로 보내 보관하고 복원한다','VM의 CPU를 자동으로 늘린다','Block Volume을 NFS로 공유한다','Security Group을 백업한다'],e:'B2OS는 Backup to Object Storage다.'},
 {q:'B2OS에서 스냅샷을 보낼 Object Storage의 접속 정보를 담는 것은?',o:['External Endpoint','Volume Type','Key Pair','Listener'],e:'External Endpoint에 Object Storage의 주소와 버킷, 접근 키를 지정한다.'}
]},
{q:'로컬 스냅샷만 두는 것과 비교한 B2OS의 장점은?',o:['로컬 Block Storage 바깥에 복구 지점을 둔다','VM의 성능 한도가 올라간다','볼륨 크기를 줄일 수 있다','스냅샷을 찍지 않아도 된다'],e:'B2OS는 Object Storage에 사본을 두어 로컬 저장소 바깥의 복구 지점을 만든다.'},
{q:'스냅샷에서 볼륨을 복구한 뒤 해야 할 일로 가장 알맞은 것은?',o:['복구한 볼륨에서 데이터가 실제로 돌아왔는지 확인한다','바로 원본 스냅샷을 모두 지운다','확인 없이 복구 완료로 기록한다','Volume Type을 반드시 바꾼다'],e:'복구는 데이터가 돌아왔는지 확인해야 끝난다.'}
]
});
