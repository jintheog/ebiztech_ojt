OJT.lesson({
id:'d03', week:2, day:'03', tag:'일차 03', mins:'약 3시간',
title:'Linux 기본: 리눅스란, 디렉터리, 기본 파일, 부팅 순서',
cover:[['리눅스란?','s1'],['커널·셸·터미널','s2'],['주요 디렉터리','s4'],['파일의 종류와 규칙','s5'],['기본 파일','s6'],['경로','s7'],['부팅 순서','s8']],
act:'리눅스 디렉토리 구조, 부팅 순서',
goal:['리눅스가 무엇이고 왜 서버에서 많이 쓰는지, 배포판의 차이를 말할 수 있다','커널·셸·터미널의 관계를 설명할 수 있다','주요 디렉터리 10개 이상과 기본 설정 파일의 용도를 말할 수 있다','절대경로와 상대경로를 구분해서 쓸 수 있다','부팅 5단계(BIOS/UEFI → GRUB → 커널 → systemd → 로그인)와 단계별 장애 증상을 설명할 수 있다'],
terms:[
['Linux','리눅스','1991년 리누스 토르발스가 만든 커널에서 시작한 오픈소스 운영체제. 서버와 클라우드 VM의 표준.'],
['UNIX','유닉스','1970년대에 만들어진 서버용 운영체제. 리눅스는 유닉스의 방식을 본떠 만들어졌다.'],
['오픈소스','Open Source','소스 코드가 공개되어 누구나 무료로 쓰고 고칠 수 있는 소프트웨어.'],
['커널','Kernel','OS의 핵심. 하드웨어를 직접 제어하고 메모리·프로세스·장치·파일 시스템을 관리한다.'],
['셸','Shell','사용자가 입력한 명령어를 해석해 커널에 전달하는 프로그램. 대표적으로 bash.'],
['터미널','Terminal','셸에 명령어를 입력하고 결과를 보는 창.'],
['CLI / GUI','Command Line / Graphical UI','글자로 명령어를 입력하는 방식 / 마우스로 아이콘을 누르는 방식.'],
['배포판','Distribution','리눅스 커널에 여러 도구를 묶어 완성한 OS 제품. RHEL, Rocky Linux, Ubuntu 등.'],
['패키지 관리자','Package Manager','프로그램 설치·업데이트·삭제를 해 주는 도구. Red Hat 계열 dnf, Debian 계열 apt.'],
['루트 디렉터리','/','리눅스 파일 시스템의 꼭대기. 모든 파일과 디렉터리가 여기서 시작한다.'],
['홈 디렉터리','~','사용자 개인 디렉터리. 일반 사용자는 /home/사용자명, root는 /root.'],
['숨김 파일','Hidden File','이름이 점(.)으로 시작하는 파일. ls -a로 봐야 보인다. 주로 설정 파일.'],
['절대경로 / 상대경로','Absolute / Relative','/에서 시작하는 전체 주소 / 지금 위치를 기준으로 한 주소.'],
['BIOS / UEFI','펌웨어','전원이 켜지면 가장 먼저 실행되어 하드웨어를 점검(POST)하고 부트로더를 찾는 프로그램. UEFI는 BIOS의 최신 방식.'],
['부트로더 (GRUB2)','Boot Loader','디스크에서 커널을 찾아 메모리에 올려 실행시키는 프로그램.'],
['initramfs','초기 램 파일 시스템','커널이 진짜 디스크를 읽기 전에 잠깐 쓰는 임시 파일 시스템. 디스크 드라이버 등이 들어 있다.'],
['systemd','시스템디','커널이 가장 먼저 실행하는 프로그램(PID 1). 나머지 서비스들을 순서대로 실행·관리한다.'],
['target','타깃','systemd가 도달할 목표 상태. multi-user.target(일반 서버), graphical.target(화면 있음), rescue.target(복구).'],
['커널 패닉','Kernel Panic','커널이 더 이상 진행할 수 없는 심각한 오류로 멈춘 상태.']
],
body:`
<h2 id="s1">리눅스란</h2>
<p>1970년대에 <b>유닉스(UNIX)</b>라는 서버용 운영체제가 있었습니다. 안정적이었지만 비싸고 자유롭게 쓸 수 없었습니다. 1991년 핀란드 대학생 <b>리누스 토르발스</b>가 유닉스와 비슷하게 동작하는 <b>커널</b>을 만들어 무료로 공개했고, 전 세계 개발자들이 함께 키웠습니다. 이것이 <b>리눅스</b>입니다.</p>
<h3>서버에서 리눅스를 쓰는 이유</h3>
<ul>
<li><b>무료·오픈소스</b>: 서버 수백 대에 설치해도 라이선스 비용이 없습니다(기업용 지원 계약은 별도).</li>
<li><b>안정성</b>: 몇 달, 몇 년씩 재부팅 없이 돌아가는 서버가 흔합니다.</li>
<li><b>가볍다</b>: 화면(GUI) 없이 꼭 필요한 것만 설치할 수 있습니다.</li>
<li><b>원격 관리와 자동화</b>: 모든 것을 명령어로 할 수 있어 SSH로 원격 관리하고 스크립트로 자동화하기 좋습니다.</li>
</ul>
<p>그래서 <mark>서버와 클라우드 VM 대부분이 리눅스</mark>입니다. <a data-lesson="zc3"></a>에서 만드는 VM도 리눅스입니다.</p>
<h3>배포판</h3>
<p>커널만으로는 쓸 수 없어서, 커널에 셸·명령어·패키지 관리자 등을 묶어 완성한 제품을 <b>배포판</b>이라고 합니다. 기업 서버에서 자주 보는 것은 두 계열입니다.</p>
<div class="tbl-wrap"><table><thead><tr><th>계열</th><th>배포판</th><th>패키지 관리자</th><th>특징</th></tr></thead><tbody>
<tr><td>Red Hat 계열</td><td>RHEL(유료 지원), Rocky Linux·AlmaLinux(무료 호환판), CentOS(개발 종료)</td><td><code>dnf</code> (예전 <code>yum</code>)</td><td>기업·공공에서 많이 씀</td></tr>
<tr><td>Debian 계열</td><td>Ubuntu, Debian</td><td><code>apt</code></td><td>클라우드·개발 환경에서 많이 씀</td></tr>
</tbody></table></div>
<p class="small muted">배포판마다 로그 파일 이름 같은 세부가 조금 다릅니다. 이 레슨은 Red Hat 계열(Rocky Linux) 기준이고, 다른 점은 괄호로 표시했습니다.</p>

<h2 id="s2">커널, 셸, 터미널</h2>
<div class="layers">
<div><b>사용자</b><span>명령어를 입력</span></div>
<div><b>터미널</b><span>입력하고 결과를 보는 창</span></div>
<div class="l1"><b>셸 (bash)</b><span>명령어를 해석해서 전달</span></div>
<div class="l1"><b>커널</b><span>하드웨어를 실제로 제어</span></div>
<div class="l0"><b>하드웨어</b><span>CPU · 메모리 · 디스크 · NIC</span></div>
</div>
<p>커널이 하는 일은 크게 네 가지입니다. ① 프로세스 관리(어떤 프로그램이 언제 CPU를 쓸지), ② 메모리 관리, ③ 장치 관리(디스크, NIC 드라이버), ④ 파일 시스템 관리. 셸은 bash 외에도 zsh, sh 등이 있지만 서버에서는 대부분 <b>bash</b>입니다.</p>
<div class="box analogy"><span class="lbl">비유로 보면</span>해외 공장에 일을 시킨다고 생각하세요. <b>터미널</b>은 내가 쓰는 메신저 창, <b>셸</b>은 내 말을 공장 언어로 바꿔 주는 통역사, <b>커널</b>은 실제로 기계를 돌리는 공장장입니다.</div>

<h2 id="s3">왜 마우스가 아니라 명령어일까</h2>
<ul><li><b>가볍다</b>: 화면을 그릴 자원을 서비스에 씁니다.</li><li><b>원격에 강하다</b>: 글자만 주고받으니 멀리서도 빠릅니다.</li><li><b>자동화</b>: 명령어를 파일에 적어 두면(스크립트) 100대 서버에 똑같이 실행할 수 있습니다.</li><li><b>기록이 남는다</b>: 무엇을 했는지 그대로 복사해 작업 로그·작업서에 붙일 수 있습니다.</li></ul>
<h3>프롬프트 읽는 법</h3>
<pre class="code">[trainee@ojt-web01 ~]$  <span class="c">← Red Hat 계열 모양: [사용자명@서버이름 현재위치]$</span>
trainee@ojt-web01:~$    <span class="c">← Ubuntu 모양: 사용자명@서버이름:현재위치$</span>
[root@ojt-web01 ~]#     <span class="c">← 끝이 # 이면 root(관리자). 실수하면 피해가 크니 더 조심</span></pre>
<p><code>~</code>는 내 홈 디렉터리를 뜻합니다. 맨 끝 기호가 <mark><code>$</code>면 일반 사용자, <code>#</code>면 root</mark>입니다.</p>

<h2 id="s4">디렉터리 구조: 모든 것은 / 에서 시작한다</h2>
<p>Windows는 <code>C:\\</code>, <code>D:\\</code>처럼 드라이브별로 시작하지만, 리눅스는 <b>단 하나의 꼭대기 <code>/</code>(루트)</b>에서 나무처럼 뻗어 나갑니다. 새 디스크를 붙여도 드라이브 문자가 생기지 않고, 이 나무의 한 가지(예: <code>/data</code>)에 연결합니다(<a data-lesson="d06"></a>의 마운트). "디렉터리"는 폴더와 같은 말입니다.</p>
<div class="tree">/                <span class="c"># 루트: 모든 것의 시작</span>
├── <span class="d">bin</span>          <span class="c"># 기본 명령어 실행 파일 (ls, cp, cat …)</span>
├── <span class="d">sbin</span>         <span class="c"># 관리자용 명령어 (useradd, reboot, mkfs …)</span>
├── <span class="d">boot</span>         <span class="c"># 부팅에 필요한 파일: 커널(vmlinuz), initramfs, GRUB 설정</span>
├── <span class="d">dev</span>          <span class="c"># 장치 파일: 디스크(/dev/sda, VM은 /dev/vda), /dev/null</span>
├── <span class="d">etc</span>          <span class="c"># ★ 설정 파일 모음</span>
├── <span class="d">home</span>         <span class="c"># ★ 일반 사용자 홈 (/home/trainee)</span>
├── <span class="d">root</span>         <span class="c"># root 사용자의 홈 (/home 아님!)</span>
├── <span class="d">tmp</span>          <span class="c"># 임시 파일. 누구나 쓸 수 있고, 재부팅 때 지워질 수 있음</span>
├── <span class="d">usr</span>          <span class="c"># 설치된 프로그램과 라이브러리 (/usr/bin, /usr/lib)</span>
├── <span class="d">var</span>          <span class="c"># 계속 변하는 데이터</span>
│   ├── <span class="d">log</span>      <span class="c"># ★ 로그 파일</span>
│   ├── <span class="d">lib</span>      <span class="c">#   프로그램 데이터 (DB 데이터 /var/lib/mysql 등)</span>
│   └── <span class="d">spool</span>    <span class="c">#   대기 중인 작업 (메일, 예약 작업)</span>
├── <span class="d">opt</span>          <span class="c"># 추가로 설치한 별도 프로그램 (상용 SW 등)</span>
├── <span class="d">mnt</span>          <span class="c"># 디스크를 임시로 연결(마운트)하는 자리</span>
├── <span class="d">proc</span>         <span class="c"># 실행 중인 시스템 정보 (CPU, 메모리, 프로세스). 진짜 파일이 아님</span>
└── <span class="d">run</span>          <span class="c"># 실행 중에만 필요한 임시 정보 (PID 파일 등)</span></div>
<div class="box mem"><span class="lbl">외울 것 (★ 3개 먼저)</span><p><b>/etc</b> = 설정, <b>/var/log</b> = 로그, <b>/home</b> = 사용자 집. 장애가 나면 엔지니어는 거의 항상 <code>/var/log</code>부터 봅니다. 그다음 /root, /tmp, /boot, /dev, /usr, /proc 순서로 외우세요.</p></div>
<p class="small muted">요즘 배포판은 <code>/bin</code>이 <code>/usr/bin</code>을 가리키는 바로가기(링크)인 경우가 많습니다. 둘 다 "명령어가 있는 곳"으로 이해하면 됩니다.</p>

<h2 id="s5">파일의 종류와 리눅스의 규칙</h2>
<p>리눅스에는 <b>"모든 것은 파일이다"</b>라는 말이 있습니다. 설정도 파일, 로그도 파일, 디스크 장치(<code>/dev/vda</code>)도 파일처럼 다룹니다. 그래서 파일을 읽고 고치는 법만 알면 대부분을 관리할 수 있습니다.</p>
<div class="tbl-wrap"><table><thead><tr><th><code>ls -l</code> 맨 앞 글자</th><th>종류</th><th>예</th></tr></thead><tbody>
<tr><td><code>-</code></td><td>일반 파일</td><td>/etc/hostname, memo.txt</td></tr>
<tr><td><code>d</code></td><td>디렉터리</td><td>/etc, /home</td></tr>
<tr><td><code>l</code></td><td>링크(바로가기)</td><td>/bin → /usr/bin</td></tr>
<tr><td><code>b</code> / <code>c</code></td><td>장치 파일 (블록 / 문자)</td><td>/dev/vda (디스크), /dev/null</td></tr>
</tbody></table></div>
<ul>
<li><b>대소문자를 구분합니다.</b> <code>Memo.txt</code>와 <code>memo.txt</code>는 다른 파일입니다.</li>
<li><b>확장자는 그냥 이름의 일부</b>입니다. Windows처럼 확장자로 프로그램이 정해지지 않습니다. 실행 가능 여부는 권한(x)이 정합니다(<a data-lesson="d04"></a>).</li>
<li><b>점(.)으로 시작하면 숨김 파일</b>입니다. <code>.bashrc</code>, <code>.ssh</code> 같은 개인 설정이 숨김 파일로 되어 있고, <code>ls -a</code>로 봐야 보입니다.</li>
<li>파일 이름에 띄어쓰기는 피합니다. 명령어에서 다루기 불편합니다. <code>my_file.txt</code>처럼 밑줄을 씁니다.</li>
</ul>

<h2 id="s6">꼭 알아야 할 기본 파일</h2>
<div class="tbl-wrap"><table><thead><tr><th>파일</th><th>내용</th><th>어디서 다시 나오나</th></tr></thead><tbody>
<tr><td><code>/etc/hostname</code></td><td>이 서버의 이름</td><td></td></tr>
<tr><td><code>/etc/os-release</code></td><td>배포판 이름과 버전</td><td>장애 문의 때 먼저 확인</td></tr>
<tr><td><code>/etc/hosts</code></td><td>이름 → IP 주소를 직접 적어 두는 메모장</td><td><a data-lesson="d09"></a></td></tr>
<tr><td><code>/etc/resolv.conf</code></td><td>이름을 물어볼 DNS 서버 주소</td><td><a data-lesson="d09"></a></td></tr>
<tr><td><code>/etc/passwd</code></td><td>사용자 계정 목록 (비밀번호는 없음)</td><td><a data-lesson="d04"></a></td></tr>
<tr><td><code>/etc/shadow</code></td><td>암호화된 비밀번호 (root만 읽기 가능)</td><td><a data-lesson="d04"></a></td></tr>
<tr><td><code>/etc/group</code></td><td>그룹 목록</td><td><a data-lesson="d04"></a></td></tr>
<tr><td><code>/etc/sudoers</code></td><td>누가 sudo를 쓸 수 있는지</td><td><a data-lesson="d04"></a></td></tr>
<tr><td><code>/etc/ssh/sshd_config</code></td><td>SSH 접속 설정</td><td><a data-lesson="d04"></a></td></tr>
<tr><td><code>/etc/fstab</code></td><td>부팅할 때 자동으로 연결할 디스크 목록</td><td><a data-lesson="d06"></a></td></tr>
<tr><td><code>/etc/systemd/system/</code></td><td>서비스 설정(유닛 파일)</td><td><a data-lesson="d05"></a></td></tr>
<tr><td><code>/var/log/messages</code> <span class="muted small">(Ubuntu: syslog)</span></td><td>시스템 전반 로그</td><td><a data-lesson="d05"></a></td></tr>
<tr><td><code>/var/log/secure</code> <span class="muted small">(Ubuntu: auth.log)</span></td><td>로그인·인증·sudo 기록</td><td><a data-lesson="d04"></a>, <a data-lesson="d05"></a></td></tr>
<tr><td><code>~/.bashrc</code></td><td>내 셸의 개인 설정 (별칭 등)</td><td></td></tr>
</tbody></table></div>

<h2 id="s7">경로: 절대경로와 상대경로</h2>
<ul><li><b>절대경로</b>: <code>/</code>로 시작하는 전체 주소. 어디서 말해도 같은 곳. 예: <code>/etc/ssh/sshd_config</code></li><li><b>상대경로</b>: 지금 위치를 기준으로 한 주소. 예: 지금 <code>/etc</code>에 있다면 <code>ssh/sshd_config</code></li></ul>
<div class="tbl-wrap"><table><thead><tr><th>기호</th><th>뜻</th><th>예</th></tr></thead><tbody>
<tr><td><code>/</code></td><td>루트(맨 꼭대기), 또는 경로 구분자</td><td><code>cd /</code></td></tr>
<tr><td><code>.</code></td><td>지금 있는 곳</td><td><code>./script.sh</code></td></tr>
<tr><td><code>..</code></td><td>한 단계 위</td><td><code>cd ..</code>, <code>cd ../..</code>(두 단계 위)</td></tr>
<tr><td><code>~</code></td><td>내 홈 디렉터리</td><td><code>cd ~</code> (그냥 <code>cd</code>만 쳐도 같음)</td></tr>
</tbody></table></div>
<div class="box analogy"><span class="lbl">비유로 보면</span>절대경로는 "서울시 강남구 테헤란로 123", 상대경로는 "여기서 두 블록 위". 상대경로는 지금 어디 있느냐에 따라 뜻이 달라집니다. 작업서나 스크립트에는 실수를 줄이기 위해 <b>절대경로</b>를 씁니다.</div>
<h3>연습 문제</h3>
<p>지금 <code>/var/log</code>에 있습니다. <code>/etc/hosts</code>를 상대경로로 쓰면? → <code>../../etc/hosts</code> (한 단계 위 /var, 두 단계 위 /, 거기서 etc/hosts)</p>

<h2 id="s8">부팅 순서: 전원 버튼부터 로그인까지</h2>
<div class="flow"><div class="n"><b>① BIOS/UEFI</b><small>하드웨어 점검(POST)</small></div><span class="ar">→</span><div class="n"><b>② 부트로더</b><small>GRUB2가 커널 선택</small></div><span class="ar">→</span><div class="n k"><b>③ 커널</b><small>하드웨어 인식, 루트(/) 연결</small></div><span class="ar">→</span><div class="n k"><b>④ systemd</b><small>PID 1, 서비스 실행</small></div><span class="ar">→</span><div class="n"><b>⑤ 로그인</b><small>target 도달</small></div></div>
<h3>① BIOS / UEFI</h3>
<p>전원을 켜면 메인보드에 들어 있는 펌웨어가 먼저 실행됩니다. CPU·메모리·디스크가 정상인지 점검(<b>POST</b>, Power-On Self Test)하고, 정해진 순서대로 부팅할 디스크를 찾습니다. <b>UEFI</b>는 오래된 BIOS를 대체한 최신 방식으로, 큰 디스크(2TB 이상)와 빠른 부팅을 지원합니다.</p>
<div class="tbl-wrap"><table><thead><tr><th></th><th>BIOS (Legacy)</th><th>UEFI</th></tr></thead><tbody>
<tr><td>디스크 파티션 방식</td><td>MBR (2TB까지)</td><td>GPT (매우 큰 디스크 가능)</td></tr>
<tr><td>부트로더 위치</td><td>디스크 맨 앞 작은 영역</td><td>EFI 시스템 파티션(/boot/efi)</td></tr>
</tbody></table></div>
<h3>② 부트로더 (GRUB2)</h3>
<p>디스크에서 <b>GRUB2</b>가 실행되어 <code>/boot</code>에 있는 <b>커널 파일(vmlinuz)</b>과 <b>initramfs</b>를 메모리에 올립니다. 커널이 여러 버전 설치되어 있으면 어느 것으로 부팅할지 고르는 메뉴가 여기서 나옵니다. 업데이트 후 문제가 생기면 이 메뉴에서 이전 커널을 고르거나 복구 모드로 들어갑니다.</p>
<h3>③ 커널</h3>
<p>커널이 실행되어 CPU·메모리·장치를 인식합니다. 아직 진짜 디스크를 읽을 드라이버가 준비되지 않았을 수 있어서, 임시 파일 시스템인 <b>initramfs</b>의 도움을 받아 드라이버를 올린 뒤, 진짜 <b>루트 파일 시스템(/)</b>을 연결합니다. 그리고 첫 번째 프로그램인 systemd를 실행합니다.</p>
<h3>④ systemd</h3>
<p>커널이 가장 먼저 실행하는 프로그램이라 프로세스 번호(PID)가 <b>1</b>입니다. 모든 프로세스의 조상입니다. <code>/etc/fstab</code>을 읽어 디스크를 연결하고, 네트워크, SSH(sshd), 웹 서버 같은 서비스를 <b>정해진 의존 순서대로</b> 실행합니다. 서비스 관리 명령(<code>systemctl</code>)은 <a data-lesson="d05"></a>에서 배웁니다.</p>
<h3>⑤ target 도달과 로그인</h3>
<p>systemd는 목표 상태(<b>target</b>)까지 서비스를 올리면 부팅을 마칩니다. target이란 '이 서비스들이 다 떠 있으면 이 단계까지 준비된 것으로 본다'를 정해 둔 서비스 묶음입니다. 서버는 보통 <code>multi-user.target</code>입니다. 이제 로그인 프롬프트가 뜨고 SSH 접속도 받을 수 있습니다.</p>
<div class="tbl-wrap"><table><thead><tr><th>target</th><th>뜻</th><th>예전 이름 (runlevel)</th></tr></thead><tbody>
<tr><td><code>multi-user.target</code></td><td>여러 사용자 로그인, 네트워크 포함 일반 서버 모드 (GUI 없음)</td><td>3</td></tr>
<tr><td><code>graphical.target</code></td><td><code>multi-user</code> + 화면(GUI)까지 켬</td><td>5</td></tr>
<tr><td><code>rescue.target</code></td><td>최소 기능만 켜는 복구 모드(root 혼자)</td><td>1</td></tr>
<tr><td><code>emergency.target</code></td><td>아주 최소한만 켠 응급 모드</td><td>-</td></tr>
</tbody></table></div>
<div class="box analogy"><span class="lbl">비유로 보면 (가게 문 열기)</span>① 건물 전기·설비 점검 → ② 열쇠로 문 열기 → ③ 점장 출근 → ④ 점장이 직원들을 순서대로 출근시킴 → ⑤ 영업 시작(손님 받기)</div>
<div class="box mem"><span class="lbl">외우는 법</span><p>앞 글자만 따서 <b>"바·부·커·시·로"</b> (BIOS → 부트로더 → 커널 → systemd → 로그인). 소리 내서 다섯 번 말하세요.</p></div>
<h3>부팅이 어디서 멈췄는지 알아보기</h3>
<p>부팅 순서를 아는 이유는 <b>장애 위치를 찾기 위해서</b>입니다. 클라우드 VM은 콘솔 화면으로 이 단계를 볼 수 있습니다.</p>
<div class="tbl-wrap"><table><thead><tr><th>보이는 증상</th><th>멈춘 단계</th><th>흔한 원인</th></tr></thead><tbody>
<tr><td>아무 화면도 없음, 하드웨어 오류 메시지</td><td>① BIOS/UEFI</td><td>하드웨어 고장, 부팅 디스크를 못 찾음</td></tr>
<tr><td><code>grub&gt;</code> 프롬프트에서 멈춤</td><td>② 부트로더</td><td>GRUB 설정·/boot 손상</td></tr>
<tr><td><code>Kernel panic</code> 메시지</td><td>③ 커널</td><td>커널·initramfs 문제, 루트 디스크를 못 찾음</td></tr>
<tr><td><code>emergency mode</code> 진입</td><td>④ systemd</td><td><b>/etc/fstab을 잘못 적어</b> 디스크 연결 실패 (<a data-lesson="d06"></a>에서 꼭 기억!)</td></tr>
<tr><td>부팅은 됐는데 웹이 안 뜸</td><td>⑤ 이후</td><td>서비스가 자동 시작으로 설정되지 않음 (<a data-lesson="d05"></a>)</td></tr>
</tbody></table></div>
<p>부팅 관련 확인 명령 (<a data-lesson="d05"></a>에서 직접 써 봅니다): <code>uptime</code>(켜진 지 얼마나), <code>systemctl get-default</code>(기본 target), <code>journalctl -b</code>(이번 부팅의 로그), <code>dmesg</code>(커널 메시지).</p>

<h2 id="s9">직접 해 보기</h2>
<p>디렉터리와 경로는 눈으로 읽는 것보다 직접 돌아다녀 보는 게 훨씬 빨리 외워집니다. <b>연습 터미널의 "미션 A: 파일 시스템 탐험"</b>을 끝까지 해 보세요. 이 페이지 안에서만 동작하니 마음껏 틀려도 됩니다.</p>
<div class="btn-row"><a class="btn pri" href="#term">연습 터미널 열기 (미션 A)</a></div>
`,
summary:['리눅스 = 유닉스를 본뜬 오픈소스 OS. 무료·안정·가볍고 원격·자동화에 강해 서버 표준. RHEL·Rocky(dnf) / Ubuntu(apt).','커널 = 하드웨어 제어(공장장), 셸(bash) = 명령 해석(통역사), 터미널 = 입력 창. 프롬프트 $ = 일반, # = root.','/etc 설정, /var/log 로그, /home 사용자, /root root의 집, /tmp 임시, /boot 커널, /dev 장치, /usr 프로그램, /proc 시스템 정보.','모든 것은 파일. 대소문자 구분, 확장자는 이름일 뿐, 점(.)으로 시작하면 숨김 파일.','절대경로(/부터) vs 상대경로(지금 위치 기준). . 여기, .. 위, ~ 홈.','부팅: BIOS/UEFI(POST) → GRUB2(커널·initramfs 로드) → 커널(루트 연결) → systemd(PID 1, 서비스) → target·로그인. "바부커시로". fstab 오류 = emergency mode.'],
essay:[
{q:'리눅스가 서버에서 많이 쓰이는 이유를 3가지 말하고, Red Hat 계열과 Debian 계열 배포판의 차이를 설명해 보세요.',a:'무료 오픈소스라 비용이 없고, 오래 켜 둬도 안정적이며, 화면 없이 가볍고 명령어로 원격 관리·자동화하기 좋다. Red Hat 계열(RHEL, Rocky Linux)은 기업·공공에서 많이 쓰고 패키지 관리자로 dnf를 쓰며, Debian 계열(Ubuntu)은 클라우드·개발 환경에서 많이 쓰고 apt를 쓴다. 로그 파일 이름 같은 세부도 조금 다르다.'},
{q:'커널, 셸, 터미널이 각각 하는 일과 서로의 관계를 설명해 보세요.',a:'터미널은 내가 명령어를 입력하고 결과를 보는 창이다. 셸(bash)은 내가 입력한 명령어를 해석해 커널에 전달한다. 커널은 실제로 CPU·메모리·디스크 같은 하드웨어를 제어하고 프로세스·메모리·장치·파일 시스템을 관리한다. (비유: 메신저 창·통역사·공장장)'},
{q:'/etc, /var/log, /home, /root, /tmp, /boot, /dev에는 각각 무엇이 들어 있나요?',a:'/etc 설정 파일, /var/log 로그 파일, /home 일반 사용자들의 개인 디렉터리, /root는 root 사용자의 홈, /tmp 누구나 쓰는 임시 파일, /boot 커널과 부트로더 등 부팅 파일, /dev 디스크 같은 장치 파일.'},
{q:'리눅스 부팅 5단계를 각 단계에서 하는 일과 함께 설명하고, /etc/fstab을 잘못 적으면 어느 단계에서 어떤 증상이 생기는지 말해 보세요.',a:'① BIOS/UEFI가 하드웨어를 점검(POST)하고 부팅 디스크를 찾는다. ② 부트로더 GRUB2가 커널과 initramfs를 메모리에 올린다. ③ 커널이 하드웨어를 인식하고 루트 파일 시스템을 연결한 뒤 systemd를 실행한다. ④ systemd(PID 1)가 fstab의 디스크를 연결하고 서비스를 순서대로 실행한다. ⑤ multi-user.target에 도달하면 로그인할 수 있다. fstab이 잘못되면 ④ systemd 단계에서 디스크 연결에 실패해 emergency mode로 들어간다.'},
{q:'지금 /home/trainee에 있을 때 /var/log/messages를 절대경로와 상대경로로 각각 어떻게 쓰나요?',a:'절대경로: /var/log/messages. 상대경로: ../../var/log/messages (/home/trainee에서 한 단계 위는 /home, 두 단계 위는 /, 거기서 var/log/messages).'}
],
quiz:[
{v:[
 {q:'리눅스 커널의 역할로 맞는 것은?',o:['하드웨어를 직접 제어하고 프로세스·메모리·장치·파일 시스템을 관리한다','명령어를 입력하는 창이다','웹 페이지를 보여 주는 프로그램이다','파일을 압축하는 도구다'],e:'커널은 OS의 핵심(공장장)입니다. 입력하는 창은 터미널입니다.'},
 {q:'하드웨어를 직접 제어하고 프로세스·메모리·장치·파일 시스템을 관리하는 리눅스의 핵심은?',o:['커널','셸','터미널','부트로더'],e:'커널이 하드웨어를 실제로 제어합니다. 셸은 명령을 해석해 커널에 전달하고, 터미널은 입력하고 결과를 보는 창입니다.'}
]},
{v:[
 {q:'사용자가 입력한 명령어를 해석해 커널에 전달하는 프로그램은?',o:['셸(Shell)','부트로더','하이퍼바이저','BIOS'],e:'대표적인 셸이 bash입니다.'},
 {q:'셸(bash)의 역할로 맞는 것은?',o:['사용자가 입력한 명령어를 해석해 커널에 전달한다','하드웨어를 직접 제어한다','부팅할 커널을 고른다','디스크를 자동으로 연결한다'],e:'셸은 명령어 해석기입니다. 서버에서는 대부분 bash를 씁니다.'}
]},
{v:[
 {q:'Rocky Linux에서 프로그램을 설치할 때 쓰는 패키지 관리자는?',o:['dnf','apt','exe','msi'],e:'Red Hat 계열은 dnf(예전 yum), Debian/Ubuntu 계열은 apt입니다.'},
 {q:'Ubuntu(Debian 계열)에서 프로그램을 설치할 때 쓰는 패키지 관리자는?',o:['apt','dnf','yum','exe'],e:'Debian/Ubuntu 계열은 apt, Red Hat 계열(Rocky 등)은 dnf(예전 yum)입니다.'}
]},
{v:[
 {q:'시스템과 프로그램의 설정 파일이 주로 모여 있는 디렉터리는?',o:['/etc','/var/log','/home','/tmp'],e:'/etc = 설정. 예: /etc/hosts, /etc/ssh/sshd_config'},
 {q:'/etc 디렉터리에 주로 들어 있는 것은?',o:['시스템과 프로그램의 설정 파일','로그 파일','사용자 개인 파일','부팅에 필요한 커널 파일'],e:'/etc = 설정. 예: /etc/hosts, /etc/ssh/sshd_config. 로그는 /var/log, 개인 파일은 /home, 커널은 /boot입니다.'}
]},
{v:[
 {q:'장애가 났을 때 가장 먼저 확인하는 로그 파일들이 있는 곳은?',o:['/var/log','/etc','/boot','/usr'],e:'/var는 계속 변하는 데이터, 그중 log 디렉터리에 로그가 쌓입니다.'},
 {q:'/var/log 디렉터리에 주로 쌓이는 것은?',o:['시스템과 서비스의 로그 파일','설정 파일','실행 명령어','임시 파일'],e:'/var는 계속 변하는 데이터, 그중 /var/log에 로그가 쌓입니다. 장애가 나면 가장 먼저 봅니다.'}
]},
{v:[
 {q:'root 사용자의 홈 디렉터리는?',o:['/root','/home/root','/','/etc/root'],e:'일반 사용자는 /home/이름, root는 별도로 /root입니다. 루트 디렉터리(/)와 헷갈리지 마세요.'},
 {q:'일반 사용자 trainee의 홈 디렉터리는?',o:['/home/trainee','/root/trainee','/trainee','/etc/trainee'],e:'일반 사용자는 /home/이름, root는 별도로 /root입니다.'}
]},
{v:[
 {q:'커널 파일(vmlinuz)과 부트로더 설정이 들어 있는 디렉터리는?',o:['/boot','/bin','/dev','/opt'],e:'/boot = 부팅에 필요한 파일.'},
 {q:'/boot 디렉터리에 들어 있는 것은?',o:['커널 파일과 부트로더 설정 같은 부팅에 필요한 파일','사용자 계정 목록','로그 파일','장치 파일'],e:'/boot = 부팅에 필요한 파일. 커널(vmlinuz)과 GRUB 설정이 여기에 있습니다.'}
]},
{v:[
 {q:'리눅스 파일 규칙으로 틀린 것은?',o:['파일 이름은 대소문자를 구분하지 않는다','점(.)으로 시작하는 파일은 숨김 파일이다','확장자는 이름의 일부일 뿐이다','디스크도 /dev 아래 파일처럼 다룬다'],e:'리눅스는 대소문자를 구분합니다. Memo.txt와 memo.txt는 다른 파일입니다.'},
 {q:'리눅스에서 점(.)으로 시작하는 이름의 파일은?',o:['숨김 파일','실행 파일','삭제된 파일','설정이 잠긴 파일'],e:'점으로 시작하는 파일은 숨김 파일입니다. ls -a로 볼 수 있습니다.'}
]},
{v:[
 {q:'다음 중 절대경로는?',o:['/etc/ssh/sshd_config','../log','ssh/sshd_config','./script.sh'],e:'/로 시작하면 절대경로입니다.'},
 {q:'다음 중 상대경로는?',o:['../log','/var/log','/etc/hosts','/home/trainee'],e:'/로 시작하면 절대경로, 지금 위치를 기준으로 쓰면 상대경로입니다.'}
]},
{v:[
 {q:'리눅스 부팅 순서로 맞는 것은?',o:['BIOS/UEFI → 부트로더(GRUB) → 커널 → systemd → 로그인','커널 → BIOS → systemd → 부트로더 → 로그인','부트로더 → BIOS → 로그인 → 커널 → systemd','systemd → 커널 → BIOS → 부트로더 → 로그인'],e:'"바·부·커·시·로"로 외우세요.'},
 {q:'부팅 순서에서 부트로더(GRUB) 바로 다음 단계는?',o:['커널','systemd','BIOS/UEFI','로그인'],e:'BIOS/UEFI → 부트로더(GRUB) → 커널 → systemd → 로그인 순서입니다. 부트로더가 커널을 메모리에 올립니다.'}
]},
{v:[
 {q:'systemd의 프로세스 번호(PID)는?',o:['1','0','22','1000'],e:'커널이 가장 먼저 실행하는 프로그램이라 PID 1입니다.'},
 {q:'커널이 가장 먼저 실행하는, 모든 프로세스의 조상인 프로그램은?',o:['systemd','bash','sshd','GRUB'],e:'systemd는 커널이 처음 실행하는 프로그램이라 PID 1이고, 모든 프로세스의 조상입니다.'}
]},
{v:[
 {q:'화면(GUI) 없이 네트워크를 포함한 일반 서버 모드로 부팅하는 systemd target은?',o:['multi-user.target','graphical.target','rescue.target','boot.target'],e:'서버의 기본 target은 대부분 multi-user.target(예전 runlevel 3)입니다.'},
 {q:'복구용 최소 모드(root 혼자)로 부팅하는 systemd target은?',o:['rescue.target','multi-user.target','graphical.target','network.target'],e:'rescue.target은 복구용 최소 모드입니다. 서버의 일반 모드는 multi-user.target, 화면까지 켜면 graphical.target입니다.'}
]},
{v:[
 {q:'/etc/fstab에 잘못된 내용을 적고 재부팅했을 때 흔히 보는 증상은?',o:['emergency mode로 들어간다','BIOS 화면에서 멈춘다','grub> 프롬프트가 뜬다','정상 부팅된다'],e:'systemd가 fstab의 디스크를 연결하다 실패하면 응급 모드로 들어갑니다. [[d06]]에서 다시 다룹니다.'},
 {q:'부팅할 때 자동으로 연결할 디스크 목록이 적힌 파일은?',o:['/etc/fstab','/etc/hosts','/etc/passwd','/etc/hostname'],e:'/etc/fstab에 적힌 디스크를 systemd가 부팅 때 연결합니다. 잘못 적으면 emergency mode로 들어갑니다.'}
]},
{v:[
 {q:'사용자 계정 목록이 들어 있는 파일은?',o:['/etc/passwd','/etc/shadow','/etc/group','/etc/hosts'],e:'/etc/passwd는 계정 목록(비밀번호는 없음), 암호화된 비밀번호는 /etc/shadow, 그룹 목록은 /etc/group입니다.'},
 {q:'이름 → IP 주소를 직접 적어 두는 파일은?',o:['/etc/hosts','/etc/resolv.conf','/etc/hostname','/etc/fstab'],e:'/etc/hosts에 이름과 IP를 직접 적습니다. /etc/resolv.conf는 이름을 물어볼 DNS 서버 주소, /etc/hostname은 이 서버의 이름입니다.'}
]},
{v:[
 {q:'cd .. 명령의 뜻은?',o:['한 단계 위 디렉터리로 이동','내 홈 디렉터리로 이동','루트(/)로 이동','지금 있는 곳에 머무름'],e:'..은 한 단계 위, .은 지금 있는 곳, ~는 내 홈 디렉터리, /는 루트입니다.'},
 {q:'경로에서 ~ 기호가 뜻하는 곳은?',o:['내 홈 디렉터리','루트 디렉터리(/)','한 단계 위 디렉터리','지금 있는 디렉터리'],e:'~는 내 홈 디렉터리입니다. cd ~ 또는 그냥 cd만 쳐도 홈으로 갑니다.'}
]}
]
});
