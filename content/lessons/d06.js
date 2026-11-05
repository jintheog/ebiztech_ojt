OJT.lesson({
id:'d06', week:2, day:'06', tag:'일차 06', mins:'약 3시간',
title:'Linux 디스크 관리: 파티션, 파일시스템, Mount, fstab, 용량',
cover:[['Disk (장치 이름, lsblk)','s2'],['Partition','s3'],['Filesystem','s4'],['Mount','s5'],['새 디스크 연결 전체 절차','s6'],['fstab','s7'],['디스크 용량 (df, du)','s8']],
act:'디스크 연결·Mount 및 용량 확인',
goal:['디스크 → 파티션 → 파일시스템 → 마운트의 관계를 비유로 설명할 수 있다','lsblk로 디스크와 파티션, 마운트 위치를 읽을 수 있다','새 디스크를 포맷(mkfs)하고 마운트하는 절차를 순서대로 말할 수 있다','/etc/fstab 한 줄을 읽고, 잘못 쓰면 생기는 일을 설명할 수 있다','df와 du로 용량을 확인하고, 디스크가 꽉 찼을 때 큰 파일을 찾을 수 있다'],
terms:[
['블록 장치','Block Device','디스크처럼 데이터를 일정한 크기(블록) 단위로 읽고 쓰는 장치. /dev/sda, /dev/vda, /dev/nvme0n1.'],
['파티션','Partition','디스크 하나를 여러 구역으로 나눈 것. /dev/vda1, /dev/vda2.'],
['파티션 테이블','MBR / GPT','파티션을 어떻게 나눴는지 적어 두는 표. MBR(옛날, 2TB 한계), GPT(요즘 표준).'],
['파일시스템','Filesystem','디스크에 파일을 어떤 규칙으로 저장하고 찾을지 정한 체계. xfs(RHEL 기본), ext4(Ubuntu 기본).'],
['포맷','mkfs','파티션이나 디스크에 파일시스템을 만드는 것. 안에 있던 데이터는 사라진다.'],
['마운트','Mount','파일시스템을 디렉터리 트리의 한 지점에 연결해서 쓸 수 있게 하는 것.'],
['마운트 포인트','Mount Point','파일시스템을 연결하는 디렉터리. 예: /data'],
['UUID','고유 식별자','파일시스템마다 만들어질 때 붙는 고유 번호. 장치 이름이 바뀌어도 변하지 않는다.'],
['/etc/fstab','파일시스템 테이블','부팅할 때 자동으로 마운트할 파일시스템 목록.'],
['lsblk','list block devices','디스크와 파티션, 마운트 위치를 나무 모양으로 보여 주는 명령.'],
['blkid','블록 ID','장치의 UUID와 파일시스템 종류를 보여 주는 명령.'],
['df','disk free','파일시스템별 전체·사용·남은 용량을 보여 주는 명령.'],
['du','disk usage','디렉터리나 파일이 실제로 차지하는 용량을 보여 주는 명령.'],
['LVM','Logical Volume Manager','여러 디스크를 묶어 하나처럼 쓰고, 나중에 크기를 늘리기 쉽게 해 주는 관리 방식.'],
['스왑','Swap','메모리가 모자랄 때 쓰는 디스크 공간. 파티션이나 파일로 만든다.'],
['inode','아이노드','파일 하나마다 쓰는 정보 칸. 용량이 남아도 inode가 다 차면 새 파일을 못 만든다.']
],
body:`
<h2 id="s1">큰 그림: 디스크를 쓰려면 4단계가 필요하다</h2>
<p>새 디스크를 서버에 붙였다고 바로 파일을 저장할 수는 없습니다. Windows는 이 과정을 자동으로 해 주지만, 서버 엔지니어는 직접 합니다.</p>
<div class="flow"><div class="n"><b>① 디스크</b><small>/dev/vdb</small></div><span class="ar">→</span><div class="n"><b>② 파티션</b><small>구역 나누기 (선택)</small></div><span class="ar">→</span><div class="n k"><b>③ 파일시스템</b><small>mkfs로 포맷</small></div><span class="ar">→</span><div class="n k"><b>④ 마운트</b><small>/data 에 연결</small></div></div>
<div class="box analogy"><span class="lbl">비유로 보면 (땅과 건물)</span>① 새 디스크는 <b>빈 땅</b>입니다. ② 파티션은 땅에 <b>구획선</b>을 긋는 것. ③ 파일시스템은 그 위에 <b>건물을 짓고 호실 번호 체계</b>를 만드는 것(어디에 무엇을 둘지 찾을 수 있게). ④ 마운트는 그 건물을 <b>도로(디렉터리 트리)에 연결하는 출입문</b>을 내는 것입니다. 출입문이 없으면 건물이 있어도 들어갈 수 없습니다.</div>
<p>일차 03에서 리눅스는 드라이브 문자(C:, D:) 없이 <code>/</code> 하나의 나무라고 배웠습니다. 새 디스크도 이 나무의 한 가지(<code>/data</code>)에 붙입니다. 그것이 마운트입니다.</p>

<h2 id="s2">디스크: 장치 이름과 lsblk</h2>
<p>리눅스에서 디스크는 <code>/dev</code> 아래 파일로 보입니다(일차 03 "모든 것은 파일").</p>
<div class="tbl-wrap"><table><thead><tr><th>이름</th><th>어떤 디스크</th><th>파티션 이름</th></tr></thead><tbody>
<tr><td><code>/dev/sda</code>, <code>/dev/sdb</code></td><td>SATA·SAS·SCSI 디스크, iSCSI로 붙인 디스크</td><td>sda1, sda2</td></tr>
<tr><td><code>/dev/vda</code>, <code>/dev/vdb</code></td><td><b>KVM 가상 머신의 가상 디스크</b> (클라우드 VM에서 자주 봄)</td><td>vda1, vda2</td></tr>
<tr><td><code>/dev/nvme0n1</code></td><td>NVMe SSD</td><td>nvme0n1p1</td></tr>
</tbody></table></div>
<p>a, b, c는 붙은 순서입니다. 첫 번째 디스크가 vda, 두 번째가 vdb입니다. 순서는 상황에 따라 바뀔 수 있어서, 나중에 fstab에는 이름 대신 <b>UUID</b>를 씁니다.</p>
<pre class="code">$ lsblk
NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS
vda    252:0    0   20G  0 disk
├─vda1 252:1    0    1G  0 part /boot
└─vda2 252:2    0   19G  0 part /
vdb    252:16   0   10G  0 disk              <span class="c">← 새로 붙인 디스크. 파티션도, 마운트 위치도 없음</span></pre>
<ul><li><b>TYPE</b>: disk(디스크 통째) / part(파티션)</li><li><b>SIZE</b>: 크기</li><li><b>MOUNTPOINTS</b>: 어디에 연결되어 있나. 비어 있으면 아직 쓸 수 없는 상태</li></ul>
<p><code>lsblk -f</code>를 하면 파일시스템 종류(FSTYPE)와 UUID까지 보입니다.</p>
<p>클라우드에서는 콘솔에서 <b>볼륨을 만들어 VM에 연결(Attach)</b>하면 VM 안에서 이렇게 새 디스크(vdb)가 나타납니다. 6주차 실습("Volume 연결")과 7주차 zStorage의 Block 볼륨 연결이 바로 이 상황입니다.</p>

<h2 id="s3">파티션: 디스크를 구역으로 나누기</h2>
<p>디스크 하나를 용도별로 나눕니다. 예를 들어 OS 디스크(vda)는 부팅용 <code>/boot</code>(vda1)와 나머지 <code>/</code>(vda2)로 나뉘어 있습니다.</p>
<div class="tbl-wrap"><table><thead><tr><th>파티션 테이블</th><th>최대 디스크 크기</th><th>파티션 개수</th><th>짝이 되는 부팅 방식</th></tr></thead><tbody>
<tr><td><b>MBR</b> (옛날)</td><td>2TB</td><td>주 파티션 4개</td><td>BIOS</td></tr>
<tr><td><b>GPT</b> (요즘 표준)</td><td>사실상 제한 없음</td><td>128개</td><td>UEFI</td></tr>
</tbody></table></div>
<pre class="code">sudo fdisk -l                 <span class="c"># 모든 디스크의 파티션 정보 보기</span>
sudo parted /dev/vdb print    <span class="c"># 특정 디스크의 파티션 정보</span>
sudo fdisk /dev/vdb           <span class="c"># 대화형으로 파티션 만들기 (n 새로, w 저장)</span></pre>
<p class="small muted">데이터 전용으로 붙인 디스크는 파티션을 나누지 않고 <b>디스크 통째로</b> 파일시스템을 만드는 경우도 많습니다. 클라우드 볼륨은 필요하면 볼륨 자체를 늘릴 수 있기 때문입니다. 이 레슨의 실습도 통째로 씁니다.</p>
<h3>LVM (이름만 알아 두기)</h3>
<p>디스크 여러 개를 하나의 큰 저장 풀(Volume Group)로 묶고, 거기서 필요한 만큼 잘라(Logical Volume) 씁니다. 나중에 디스크를 추가해 <b>크기를 늘리기 쉽다</b>는 것이 장점입니다. RHEL 계열 설치 기본값이 LVM인 경우가 많아서 <code>/dev/mapper/rl-root</code> 같은 이름을 보게 됩니다.</p>

<h2 id="s4">파일시스템: 파일을 저장하는 규칙</h2>
<p>디스크는 그냥 거대한 숫자 칸들의 모음입니다. "memo.txt는 몇 번째 칸부터 몇 칸"을 기록하고 찾는 규칙이 <b>파일시스템</b>입니다. 파일시스템을 만드는 것을 <b>포맷</b>이라고 하며, <b>그 안에 있던 데이터는 모두 사라집니다.</b></p>
<div class="tbl-wrap"><table><thead><tr><th>파일시스템</th><th>어디서 기본</th><th>특징</th></tr></thead><tbody>
<tr><td><b>xfs</b></td><td>RHEL, Rocky Linux</td><td>대용량·고성능. 크기를 늘릴 수는 있지만 줄일 수는 없음</td></tr>
<tr><td><b>ext4</b></td><td>Ubuntu, Debian</td><td>오래 검증됨. 늘리기·줄이기 모두 가능</td></tr>
<tr><td>swap</td><td>공통</td><td>파일 저장용이 아니라 메모리 보조용 공간</td></tr>
<tr><td>vfat</td><td>UEFI 부팅 파티션</td><td>/boot/efi에 씀</td></tr>
</tbody></table></div>
<pre class="code">sudo mkfs.xfs /dev/vdb        <span class="c"># vdb 전체에 xfs 파일시스템 만들기</span>
sudo mkfs.ext4 /dev/vdb1      <span class="c"># 파티션 vdb1에 ext4 만들기</span>
sudo blkid /dev/vdb           <span class="c"># 만들어진 파일시스템의 UUID와 종류 확인</span></pre>
<div class="box warn"><span class="lbl">포맷 전에 반드시 확인</span><p>mkfs는 확인 질문 없이 실행되는 경우가 많습니다. <b>장치 이름을 한 글자만 틀려도(vda ↔ vdb) OS 디스크를 날립니다.</b> 실행 전에 <code>lsblk</code>로 크기와 마운트 위치를 보고, "비어 있고 마운트되지 않은 그 디스크"가 맞는지 두 번 확인하세요.</p></div>

<h2 id="s5">마운트: 디렉터리에 연결하기</h2>
<pre class="code">sudo mkdir /data                 <span class="c"># 1. 연결할 자리(마운트 포인트) 만들기</span>
sudo mount /dev/vdb /data        <span class="c"># 2. vdb의 파일시스템을 /data에 연결</span>
df -h /data                      <span class="c"># 3. 확인</span>
sudo umount /data                <span class="c"># 연결 해제 (u-mount, n이 없음에 주의)</span></pre>
<ul>
<li>마운트하면 <b>/data 안에 넣는 파일은 vdb 디스크에 저장</b>됩니다. 다른 디렉터리는 계속 vda2(/)에 저장됩니다.</li>
<li>마운트 포인트에 원래 파일이 있었다면, 마운트하는 동안은 가려져서 안 보입니다(지워진 건 아님). 그래서 빈 디렉터리에 마운트합니다.</li>
<li><code>umount</code> 할 때 그 디렉터리 안에 내가 들어가 있거나 어떤 프로그램이 파일을 쓰고 있으면 <code>target is busy</code> 오류가 납니다. <code>cd</code>로 밖으로 나와서 다시 합니다.</li>
<li><code>mount</code> 명령만 치면 지금 연결된 목록이 나옵니다.</li>
</ul>
<div class="box mem"><span class="lbl">중요: mount 명령은 재부팅하면 사라진다</span><p>mount로 연결한 것은 <b>지금만</b> 유효합니다. 재부팅해도 자동으로 연결되게 하려면 <b>/etc/fstab에 등록</b>해야 합니다. (일차 05의 start ≠ enable과 같은 이야기입니다.)</p></div>

<h2 id="s6">새 디스크 연결 전체 절차</h2>
<p>실무 요청: <b>"웹 서버에 10GB 디스크를 추가해서 /data로 쓰게 해 주세요."</b> 이 순서를 손노트에 그대로 적으세요.</p>
<pre class="code">lsblk                                       <span class="c"># 1. 새 디스크 확인 (vdb, 10G, 마운트 없음)</span>
sudo mkfs.xfs /dev/vdb                      <span class="c"># 2. 파일시스템 만들기 (장치 이름 두 번 확인!)</span>
sudo mkdir /data                            <span class="c"># 3. 마운트 포인트 만들기</span>
sudo mount /dev/vdb /data                   <span class="c"># 4. 연결</span>
df -h                                       <span class="c"># 5. /data 가 10G로 보이는지 확인</span>
sudo blkid /dev/vdb                         <span class="c"># 6. UUID 확인</span>
sudo cp /etc/fstab /etc/fstab.bak           <span class="c"># 7. fstab 백업</span>
echo "UUID=복사한값 /data xfs defaults 0 0" | sudo tee -a /etc/fstab   <span class="c"># 8. fstab에 한 줄 추가</span>
sudo umount /data                           <span class="c"># 9. 한 번 풀고</span>
sudo mount -a                               <span class="c"># 10. fstab대로 다시 연결 → 오류 없이 붙으면 fstab이 맞다는 뜻</span>
df -h /data                                 <span class="c"># 11. 최종 확인 → 작업 로그 기록</span></pre>
<div class="box warn"><span class="lbl">왜 sudo echo &gt;&gt; /etc/fstab 은 안 될까</span><p><code>sudo echo "..." &gt;&gt; /etc/fstab</code>은 <b>Permission denied</b>가 납니다. sudo는 echo에만 붙고, 파일에 쓰는 <code>&gt;&gt;</code>는 내 셸(일반 사용자)이 하기 때문입니다. 그래서 <code>echo "..." | sudo tee -a 파일</code> 형태를 씁니다. tee가 root 권한으로 파일에 이어 씁니다. (또는 <code>sudo vi /etc/fstab</code>으로 직접 편집)</p></div>

<h2 id="s7">/etc/fstab: 부팅 때 자동으로 연결할 목록</h2>
<pre class="code">UUID=3f9c2d1e-8a7b-4c5d-9e0f-1a2b3c4d5e6f  /data  xfs  defaults  0 0
<span class="c">① 무엇을                                   ② 어디에 ③ 종류 ④ 옵션    ⑤ ⑥</span></pre>
<div class="tbl-wrap"><table><thead><tr><th>칸</th><th>뜻</th><th>예</th></tr></thead><tbody>
<tr><td>① 장치</td><td>연결할 파일시스템. <b>UUID 권장</b>(장치 이름은 바뀔 수 있음)</td><td><code>UUID=...</code>, <code>/dev/vdb</code></td></tr>
<tr><td>② 마운트 포인트</td><td>연결할 디렉터리 (미리 만들어 둬야 함)</td><td><code>/data</code></td></tr>
<tr><td>③ 파일시스템 종류</td><td>mkfs로 만든 종류와 같아야 함</td><td><code>xfs</code>, <code>ext4</code>, <code>swap</code></td></tr>
<tr><td>④ 옵션</td><td>보통 defaults. 읽기 전용은 ro, 네트워크 디스크는 _netdev, 없어도 부팅되게 하려면 nofail</td><td><code>defaults</code></td></tr>
<tr><td>⑤ dump</td><td>옛 백업 도구용. 거의 0</td><td><code>0</code></td></tr>
<tr><td>⑥ fsck 순서</td><td>부팅 때 검사 순서. / 는 1, 나머지 2, xfs는 보통 0</td><td><code>0</code></td></tr>
</tbody></table></div>
<div class="box warn"><span class="lbl">fstab을 틀리면 서버가 안 켜진다</span><p>UUID 오타, 없는 디렉터리, 잘못된 파일시스템 종류를 적고 재부팅하면, systemd가 마운트에 실패해 <b>emergency mode</b>로 들어갑니다(일차 03 부팅 장애 표). 클라우드 VM이면 SSH도 안 됩니다. 그래서 반드시 <b>① 백업 → ② 수정 → ③ <code>sudo mount -a</code>로 오류 없는지 검증</b> 후에만 재부팅합니다. 중요하지 않은 추가 디스크에는 <code>nofail</code> 옵션을 넣어 두면 그 디스크가 없어도 부팅은 됩니다.</p></div>

<h2 id="s8">디스크 용량 확인: df와 du</h2>
<h3>df: 파일시스템별 용량</h3>
<pre class="code">$ df -h
Filesystem      Size  Used Avail Use% Mounted on
devtmpfs        4.0M     0  4.0M   0% /dev
tmpfs           1.9G     0  1.9G   0% /dev/shm
/dev/vda2        19G  4.2G   15G  22% /
/dev/vda1      1014M  220M  795M  22% /boot
/dev/vdb         10G  104M  9.9G   2% /data</pre>
<ul><li><b>-h</b>: 사람이 읽기 쉬운 단위(G, M)로. 거의 항상 붙입니다.</li><li><b>Use%</b>가 핵심. 보통 <b>80%를 넘으면 주의, 90%를 넘으면 조치</b>합니다(회사 기준에 따름).</li><li>tmpfs, devtmpfs는 메모리 위의 임시 파일시스템이라 무시해도 됩니다.</li><li><code>df -T</code>: 파일시스템 종류도 표시. <code>df -i</code>: inode 사용률(작은 파일이 엄청 많을 때 용량은 남아도 꽉 찰 수 있음).</li></ul>
<h3>du: 무엇이 공간을 차지하나</h3>
<pre class="code">du -sh /var/log                    <span class="c"># /var/log 전체 크기 (-s 합계만, -h 단위)</span>
sudo du -sh /var/log/* | sort -h   <span class="c"># /var/log 안의 항목별 크기를 작은 것부터 정렬 → 맨 아래가 범인</span>
sudo du -sh /* 2&gt;/dev/null | sort -h   <span class="c"># 루트 아래 어디가 큰지 (권한 오류 메시지는 버림)</span></pre>
<h3>디스크가 꽉 차면 생기는 일</h3>
<ul><li>로그를 못 써서 서비스가 멈추거나 이상하게 동작합니다.</li><li>DB가 데이터를 저장하지 못합니다.</li><li>SSH 로그인조차 안 되는 경우도 있습니다.</li></ul>
<p><b>흔한 범인</b>: 정리되지 않은 오래된 로그(<code>/var/log</code>), 애플리케이션 로그, 백업 파일, <code>/tmp</code>의 임시 파일. 지우기 전에 <b>무엇인지 확인하고 사수에게 물어보세요</b>. 실행 중인 프로그램이 쓰고 있는 로그 파일을 rm으로 지우면 공간이 바로 돌아오지 않을 수도 있습니다.</p>

<h2 id="s9">종합: 디스크 관련 명령 한눈에</h2>
<div class="tbl-wrap"><table><thead><tr><th>하고 싶은 것</th><th>명령</th></tr></thead><tbody>
<tr><td>디스크·파티션·마운트 위치 보기</td><td><code>lsblk</code>, <code>lsblk -f</code></td></tr>
<tr><td>UUID·파일시스템 종류 보기</td><td><code>sudo blkid</code></td></tr>
<tr><td>파티션 보기·만들기</td><td><code>sudo fdisk -l</code>, <code>sudo fdisk /dev/vdb</code>, <code>parted</code></td></tr>
<tr><td>파일시스템 만들기(포맷)</td><td><code>sudo mkfs.xfs /dev/vdb</code>, <code>mkfs.ext4</code></td></tr>
<tr><td>연결 / 해제</td><td><code>sudo mount 장치 디렉터리</code> / <code>sudo umount 디렉터리</code></td></tr>
<tr><td>지금 연결된 목록</td><td><code>mount</code>, <code>findmnt</code></td></tr>
<tr><td>부팅 시 자동 연결 등록·검증</td><td><code>/etc/fstab</code> 수정 → <code>sudo mount -a</code></td></tr>
<tr><td>용량 확인</td><td><code>df -h</code> (파일시스템별), <code>du -sh 경로</code> (디렉터리별)</td></tr>
</tbody></table></div>
<p>4주차(Storage 기초)에서는 이 디스크가 네트워크 너머의 스토리지(SAN, iSCSI)에서 올 때를, 7주차(zStorage)에서는 VPSA 볼륨을 VM에 연결해 마운트하는 실습을 합니다. <b>오늘 절차가 그대로 반복됩니다.</b></p>

<h2 id="s10">직접 해 보기</h2>
<p>연습 터미널의 <b>"미션 D: 디스크 연결"</b>에서 새 디스크 vdb를 포맷하고, /data에 마운트하고, fstab에 등록해 검증까지 해 봅니다.</p>
<div class="btn-row"><a class="btn pri" href="#term">연습 터미널 열기 (미션 D)</a></div>
`,
summary:['디스크 → 파티션(선택) → 파일시스템(mkfs, 포맷) → 마운트(디렉터리에 연결). 빈 땅 → 구획 → 건물 → 출입문.','장치 이름: sda(물리·iSCSI), vda(KVM VM), nvme0n1. lsblk로 크기·TYPE·MOUNTPOINTS 확인.','파티션 테이블 MBR(2TB) vs GPT. 파일시스템 xfs(RHEL 기본) vs ext4(Ubuntu 기본). 포맷하면 데이터가 사라진다 → 장치 이름 두 번 확인.','mount는 지금만 유효. 재부팅 후에도 연결하려면 /etc/fstab(UUID 마운트포인트 종류 옵션 0 0)에 등록.','fstab 수정: 백업 → 수정 → mount -a로 검증 → 그다음 재부팅. 틀리면 emergency mode. sudo echo >> 대신 | sudo tee -a.','df -h = 파일시스템별 용량(Use% 80·90% 기준), du -sh 경로 | sort -h = 무엇이 큰지. 흔한 범인은 /var/log.'],
essay:[
{q:'디스크·파티션·파일시스템·마운트의 관계를 비유를 들어 설명해 보세요.',a:'새 디스크는 빈 땅이다. 파티션은 그 땅에 구획선을 긋는 것이고, 파일시스템(mkfs)은 그 위에 건물을 짓고 호실 번호 체계를 만들어 파일을 어디에 두고 찾을지 정하는 것이다. 마운트는 그 건물을 도로(디렉터리 트리)에 연결하는 출입문을 내는 것으로, 마운트해야 /data 같은 디렉터리를 통해 파일을 넣고 꺼낼 수 있다.'},
{q:'VM에 10GB 디스크를 새로 붙여 /data로 쓰게 하는 절차를 명령어와 함께 순서대로 말해 보세요.',a:'① lsblk로 새 디스크(vdb) 확인 ② sudo mkfs.xfs /dev/vdb 로 포맷(장치 이름 재확인) ③ sudo mkdir /data ④ sudo mount /dev/vdb /data ⑤ df -h 로 확인 ⑥ sudo blkid /dev/vdb 로 UUID 확인 ⑦ fstab 백업 후 "UUID=... /data xfs defaults 0 0" 추가(echo ... | sudo tee -a /etc/fstab) ⑧ sudo umount /data 후 sudo mount -a 로 fstab 검증 ⑨ df -h 최종 확인과 작업 로그 기록.'},
{q:'mount 명령으로 연결했는데 재부팅 후 /data가 비어 있다. 이유와 해결 방법은?',a:'mount 명령은 지금만 유효해서 재부팅하면 연결이 풀린다. 디스크가 /data에 연결되지 않아 원래의 빈 디렉터리가 보이는 것이다. /etc/fstab에 UUID로 /data 마운트 줄을 추가하고 sudo mount -a로 검증하면 부팅할 때마다 자동으로 연결된다.'},
{q:'/etc/fstab에 잘못된 UUID를 적고 재부팅하면 어떻게 되나요? 이를 막는 작업 습관을 말해 보세요.',a:'부팅 중 systemd가 그 디스크를 찾지 못해 마운트에 실패하고 emergency mode로 들어가 서버가 정상 부팅되지 않는다. 클라우드 VM이면 SSH도 안 된다. 막으려면 ① 수정 전에 fstab을 백업하고 ② UUID는 blkid 결과를 복사해 붙이고 ③ 수정 후 반드시 sudo mount -a로 오류가 없는지 검증한 다음에만 재부팅한다. 중요하지 않은 추가 디스크에는 nofail 옵션을 넣는다.'},
{q:'df -h에서 / 의 Use%가 95%다. 무엇이 공간을 차지하는지 찾는 방법과, 꽉 차면 생기는 문제를 말해 보세요.',a:'sudo du -sh /* | sort -h 로 루트 아래 어디가 큰지 보고, 큰 디렉터리(예: /var/log)로 들어가 sudo du -sh /var/log/* | sort -h 처럼 범위를 좁혀 범인을 찾는다. 디스크가 꽉 차면 로그를 못 써서 서비스가 멈추거나 DB가 저장을 못 하고, 심하면 로그인도 안 된다. 지우기 전에 무엇인지 확인하고 사수에게 묻는다.'}
],
quiz:[
{q:'새 디스크를 쓸 수 있게 만드는 순서로 맞는 것은?',o:['디스크 → (파티션) → 파일시스템 생성 → 마운트','마운트 → 파일시스템 생성 → 디스크','파일시스템 생성 → 디스크 → 마운트','fstab 등록 → 디스크 → 파티션'],e:'빈 땅 → 구획 → 건물 → 출입문 순서입니다.'},
{q:'KVM 기반 클라우드 VM에 두 번째로 붙인 가상 디스크의 이름으로 흔한 것은?',o:['/dev/vdb','/dev/vda','/dev/sda1','/dev/nvme0n1p1'],e:'가상 디스크는 vd + 순서(a, b, c). 첫 번째가 vda, 두 번째가 vdb입니다.'},
{q:'디스크와 파티션, 마운트 위치를 나무 모양으로 보여 주는 명령은?',o:['lsblk','df -h','free -h','top'],e:'lsblk = list block devices. MOUNTPOINTS가 비어 있으면 아직 연결 전입니다.'},
{q:'Rocky Linux(RHEL 계열)의 기본 파일시스템은?',o:['xfs','ext4','NTFS','FAT32'],e:'Ubuntu는 ext4가 기본입니다. NTFS는 Windows입니다.'},
{q:'2TB가 넘는 디스크도 쓸 수 있는 요즘 표준 파티션 테이블은?',o:['GPT','MBR','fstab','LVM'],e:'MBR은 2TB, 주 파티션 4개 제한이 있습니다.'},
{q:'mkfs 명령을 실행할 때 가장 주의할 점은?',o:['장치 이름을 잘못 쓰면 기존 데이터(OS 디스크 포함)가 모두 사라진다','반드시 재부팅해야 한다','root가 아니어도 된다','파일이 두 배로 늘어난다'],e:'포맷은 데이터를 지웁니다. lsblk로 크기와 마운트 여부를 보고 두 번 확인하세요.'},
{q:'sudo mount /dev/vdb /data 로 연결한 뒤 재부팅하면?',o:['연결이 풀린다 (fstab에 등록해야 유지)','영구히 유지된다','vdb가 삭제된다','/data가 삭제된다'],e:'mount 명령은 일회성입니다. 자동 연결은 /etc/fstab.'},
{q:'/etc/fstab 의 "UUID=xxxx /data xfs defaults 0 0" 에서 /data는?',o:['마운트 포인트(연결할 디렉터리)','파일시스템 종류','디스크 이름','마운트 옵션'],e:'순서: 장치 / 마운트 포인트 / 종류 / 옵션 / dump / fsck 순서.'},
{q:'fstab에 장치 이름(/dev/vdb) 대신 UUID를 권장하는 이유는?',o:['장치 이름은 붙는 순서에 따라 바뀔 수 있지만 UUID는 바뀌지 않는다','UUID가 더 짧아서','UUID를 쓰면 포맷이 필요 없어서','장치 이름은 root만 볼 수 있어서'],e:'디스크를 추가·제거하면 vdb가 vdc가 될 수 있습니다.'},
{q:'fstab을 수정한 뒤, 재부팅 전에 반드시 해야 하는 검증 명령은?',o:['sudo mount -a','sudo reboot','sudo mkfs.xfs','sudo rm /etc/fstab'],e:'mount -a는 fstab의 모든 항목을 연결해 봅니다. 오류가 나면 재부팅 전에 고칠 수 있습니다.'},
{q:'fstab에 잘못된 내용이 있는 상태로 재부팅하면 흔히 생기는 일은?',o:['emergency mode로 들어가 정상 부팅되지 않는다','아무 일도 없다','디스크가 자동 포맷된다','BIOS가 초기화된다'],e:'일차 03 부팅 장애 표에서 본 바로 그 상황입니다.'},
{q:'sudo echo "..." >> /etc/fstab 이 Permission denied가 나는 이유는?',o:['>> 리다이렉트는 sudo가 아닌 내 셸(일반 사용자)이 처리하기 때문','echo는 root가 쓸 수 없어서','fstab은 읽기 전용 디스크에 있어서','sudo 비밀번호가 틀려서'],e:'그래서 echo "..." | sudo tee -a /etc/fstab 을 씁니다.'},
{q:'파일시스템별 전체·사용·남은 용량을 보는 명령은?',o:['df -h','du -sh','lsblk','blkid'],e:'df = 파일시스템 단위, du = 디렉터리·파일 단위입니다.'},
{q:'/var/log 안에서 무엇이 공간을 많이 차지하는지 찾는 명령은?',o:['sudo du -sh /var/log/* | sort -h','df -h /var/log','lsblk /var/log','mount /var/log'],e:'항목별 크기를 정렬하면 맨 아래가 가장 큰 것입니다.'},
{q:'umount /data 를 했더니 "target is busy"가 나온다. 가장 흔한 원인은?',o:['내가 /data 안에 들어가 있거나 어떤 프로그램이 그 안의 파일을 쓰고 있다','디스크가 고장 났다','fstab에 등록되지 않았다','권한이 777이다'],e:'cd로 밖으로 나온 뒤 다시 시도합니다.'}
]
});
