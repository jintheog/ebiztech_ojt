OJT.lesson({
id:'d05', week:2, day:'05', tag:'일차 05', mins:'약 3시간',
title:'Linux 시스템 운영: 프로세스, 데몬, systemd, 로그, 자원 모니터링',
cover:[['Process','s1'],['프로세스 확인·종료 (ps, kill)','s2'],['Daemon','s3'],['systemd와 systemctl','s4'],['System Log (journalctl, /var/log)','s5'],['CPU/Memory 모니터링 (uptime, top, free)','s6'],['점검 순서 종합','s7']],
act:'서비스 상태·로그 및 자원 사용량 확인',
goal:['프로그램과 프로세스의 차이, PID·PPID를 설명하고 ps로 프로세스를 찾을 수 있다','데몬이 무엇인지 말하고, systemctl로 서비스 상태 확인·시작·중지·자동 시작 설정을 할 수 있다','start와 enable의 차이를 설명할 수 있다','journalctl과 /var/log로 로그를 찾아 읽을 수 있다','uptime·top·free 결과를 읽고 CPU·메모리가 정상인지 판단할 수 있다'],
terms:[
['프로그램 / 프로세스','Program / Process','디스크에 저장된 실행 파일 / 그것이 실행되어 메모리에서 돌고 있는 상태. 레시피와 요리 중인 냄비.'],
['PID / PPID','Process ID / Parent PID','프로세스마다 붙는 번호 / 그 프로세스를 실행시킨 부모 프로세스의 번호.'],
['시그널','Signal','프로세스에 보내는 신호. 15(TERM, 정상 종료 요청), 9(KILL, 강제 종료).'],
['데몬','Daemon','화면 없이 뒤에서 계속 돌며 서비스를 제공하는 프로세스. 이름이 d로 끝나는 경우가 많다(sshd, crond).'],
['서비스','Service','systemd가 관리하는 데몬 단위. 예: sshd.service, nginx.service.'],
['유닛','Unit','systemd가 관리하는 대상 하나. 서비스(.service), 타깃(.target), 마운트(.mount) 등.'],
['systemctl','시스템컨트롤','systemd에 명령하는 도구. 서비스 상태 확인·시작·중지·자동 시작 설정.'],
['start / enable','지금 켜기 / 부팅 시 자동','start는 지금 당장 실행, enable은 다음 부팅부터 자동으로 실행되게 등록. 둘은 별개.'],
['journal / journalctl','저널','systemd가 모으는 로그 저장소 / 그 로그를 조회하는 명령.'],
['rsyslog','알시스로그','로그를 /var/log/messages 같은 텍스트 파일로 기록하는 서비스.'],
['logrotate','로그로테이트','로그 파일이 너무 커지지 않게 날짜별로 잘라 보관하고 오래된 것은 지우는 도구.'],
['Load Average','부하 평균','최근 1분·5분·15분 동안 CPU를 쓰고 있거나 기다리던 작업 수의 평균. CPU 코어 수와 비교한다.'],
['top','탑','CPU·메모리 사용량과 프로세스 목록을 실시간으로 보여 주는 명령.'],
['free','프리','메모리와 스왑 사용량을 보여 주는 명령. available 값을 본다.'],
['buff/cache','버퍼/캐시','리눅스가 남는 메모리를 파일 캐시로 쓰는 양. 필요하면 바로 내주므로 "사용 중"이 아니다.'],
['OOM Killer','Out Of Memory Killer','메모리가 바닥나면 커널이 프로세스를 강제 종료하는 기능.']
],
body:`
<h2 id="s1">프로그램과 프로세스</h2>
<p><b>프로그램</b>은 디스크에 저장된 실행 파일입니다(<code>/usr/sbin/nginx</code>). 이것을 실행하면 메모리에 올라와 CPU를 쓰며 일하는 상태가 되는데, 이것이 <b>프로세스</b>입니다. 같은 프로그램을 세 번 실행하면 프로세스가 세 개 생깁니다.</p>
<div class="box analogy"><span class="lbl">비유로 보면</span>프로그램은 <b>레시피 책</b>, 프로세스는 <b>지금 불 위에서 끓고 있는 냄비</b>입니다. 레시피 하나로 냄비 여러 개를 동시에 끓일 수 있습니다.</div>
<ul>
<li><b>PID</b>: 프로세스마다 붙는 고유 번호. 프로세스를 지목할 때 씁니다.</li>
<li><b>PPID</b>: 나를 실행시킨 부모 프로세스의 번호. 모든 프로세스는 부모가 있고, 거슬러 올라가면 맨 위에 <b>PID 1 systemd</b>가 있습니다(일차 03 부팅 순서).</li>
<li><b>소유자</b>: 프로세스도 어떤 사용자의 권한으로 돕니다. nginx는 nginx 계정, 내가 실행한 것은 내 계정(일차 04).</li>
</ul>
<div class="tree">systemd(1)
├── sshd(1021)              <span class="c"># SSH 접속을 기다리는 데몬</span>
│   └── sshd(3305)          <span class="c"># trainee의 접속 세션</span>
│       └── bash(3311)      <span class="c"># trainee의 셸</span>
│           └── ps(5120)    <span class="c"># 방금 친 명령도 잠깐 프로세스가 된다</span>
├── crond(870)
└── nginx(2301)
    └── nginx(2302)         <span class="c"># 마스터가 일꾼(worker)을 낳는다</span></div>
<p class="small muted"><code>pstree</code> 명령으로 실제 서버에서 이런 나무를 볼 수 있습니다.</p>

<h2 id="s2">프로세스 확인과 종료: ps, kill</h2>
<pre class="code">ps aux                   <span class="c"># 모든 사용자의 모든 프로세스를 자세히</span>
ps -ef                   <span class="c"># 같은 목적, 다른 형식 (PPID가 보임)</span>
ps aux | grep nginx      <span class="c"># 파이프로 nginx가 들어간 줄만 찾기 (가장 많이 쓰는 형태)</span>
pgrep -l nginx           <span class="c"># 이름으로 PID만 찾기</span></pre>
<h3>ps aux 결과 읽기</h3>
<pre class="code">USER       PID %CPU %MEM    VSZ   RSS TTY   STAT START   TIME COMMAND
root         1  0.0  0.3 171820 13420 ?     Ss   Nov01   0:04 /usr/lib/systemd/systemd
root      1021  0.0  0.2  16112  9020 ?     Ss   Nov01   0:00 sshd: /usr/sbin/sshd -D
trainee   4120 97.8  0.0   7600  1200 pts/0 R    12:51  12:41 stress-test --cpu 1</pre>
<div class="tbl-wrap"><table><thead><tr><th>칸</th><th>뜻</th></tr></thead><tbody>
<tr><td>USER</td><td>프로세스를 실행한 사용자(권한)</td></tr>
<tr><td>PID</td><td>프로세스 번호</td></tr>
<tr><td>%CPU / %MEM</td><td>CPU 사용률 / 메모리 사용률. <b>문제의 프로세스를 찾을 때 가장 먼저 보는 칸</b></td></tr>
<tr><td>RSS</td><td>실제로 쓰고 있는 메모리 양(KB)</td></tr>
<tr><td>TTY</td><td>연결된 터미널. <code>?</code>는 터미널 없음 = 데몬</td></tr>
<tr><td>STAT</td><td>상태. R 실행 중, S 대기(잠자는 중), D 디스크 기다림, Z 좀비(끝났는데 정리 안 됨)</td></tr>
<tr><td>COMMAND</td><td>실행한 명령</td></tr>
</tbody></table></div>
<h3>프로세스 종료: kill</h3>
<pre class="code">kill 4120          <span class="c"># 정상 종료 요청 (시그널 15, TERM). 프로그램이 정리하고 끝낼 기회를 줌</span>
kill -9 4120       <span class="c"># 강제 종료 (시그널 9, KILL). 정리 없이 즉시 죽임</span>
pkill stress-test  <span class="c"># 이름으로 종료</span></pre>
<div class="box warn"><span class="lbl">kill -9는 마지막 수단</span><p>-9로 죽이면 프로그램이 저장 중이던 데이터를 정리하지 못해 파일이 깨질 수 있습니다(특히 DB). <b>먼저 그냥 kill(15)</b>, 그래도 안 죽을 때만 -9. 그리고 서비스(nginx 등)는 kill보다 <code>systemctl stop</code>으로 멈추는 것이 정석입니다. 남의 프로세스는 root만 종료할 수 있습니다.</p></div>

<h2 id="s3">데몬: 뒤에서 일하는 프로세스</h2>
<p><b>데몬(Daemon)</b>은 화면 없이 백그라운드에서 계속 돌면서 요청을 기다리고 서비스를 제공하는 프로세스입니다. 이름 끝에 <b>d</b>가 붙는 경우가 많습니다.</p>
<div class="tbl-wrap"><table><thead><tr><th>데몬</th><th>하는 일</th></tr></thead><tbody>
<tr><td><code>sshd</code></td><td>SSH 접속을 기다림 (22번 포트)</td></tr>
<tr><td><code>nginx</code> / <code>httpd</code></td><td>웹 요청을 기다림 (80·443번 포트)</td></tr>
<tr><td><code>crond</code></td><td>정해진 시간에 작업을 실행 (예약 작업)</td></tr>
<tr><td><code>chronyd</code></td><td>서버 시각을 정확하게 맞춤 (로그 시각이 틀리면 장애 분석이 어려움)</td></tr>
<tr><td><code>rsyslogd</code>, <code>systemd-journald</code></td><td>로그 수집·기록</td></tr>
<tr><td><code>firewalld</code></td><td>서버 자체 방화벽</td></tr>
</tbody></table></div>
<div class="box analogy"><span class="lbl">비유로 보면</span>데몬은 <b>24시간 편의점 직원</b>입니다. 손님(요청)이 없어도 자리를 지키고 있다가, 손님이 오면 바로 응대합니다. 이 직원들의 출퇴근을 관리하는 점장이 <b>systemd</b>입니다.</div>

<h2 id="s4">systemd와 systemctl: 서비스 관리</h2>
<p>systemd는 부팅할 때 서비스들을 순서대로 켜고, 실행 중에도 서비스를 감시하고 관리합니다. 관리 대상 하나하나를 <b>유닛(unit)</b>이라 하고, 데몬은 <b>서비스 유닛</b>(<code>nginx.service</code>)입니다. 우리는 <b>systemctl</b>로 systemd에게 명령합니다.</p>
<div class="tbl-wrap"><table><thead><tr><th>명령</th><th>하는 일</th><th>권한</th></tr></thead><tbody>
<tr><td><code>systemctl status nginx</code></td><td>상태 보기 (가장 많이 씀)</td><td>누구나</td></tr>
<tr><td><code>sudo systemctl start nginx</code></td><td>지금 켜기</td><td>root</td></tr>
<tr><td><code>sudo systemctl stop nginx</code></td><td>지금 끄기</td><td>root</td></tr>
<tr><td><code>sudo systemctl restart nginx</code></td><td>껐다 켜기 (설정 변경 적용, 잠깐 끊김)</td><td>root</td></tr>
<tr><td><code>sudo systemctl reload nginx</code></td><td>끊지 않고 설정만 다시 읽기 (지원하는 서비스만)</td><td>root</td></tr>
<tr><td><code>sudo systemctl enable nginx</code></td><td>부팅 시 자동 시작 등록</td><td>root</td></tr>
<tr><td><code>sudo systemctl disable nginx</code></td><td>자동 시작 해제</td><td>root</td></tr>
<tr><td><code>sudo systemctl enable --now nginx</code></td><td>자동 시작 등록 + 지금 켜기를 한 번에</td><td>root</td></tr>
<tr><td><code>systemctl is-active nginx</code> / <code>is-enabled</code></td><td>켜져 있나? / 자동 시작인가? 한 단어로 답</td><td>누구나</td></tr>
<tr><td><code>systemctl list-units --type=service</code></td><td>서비스 목록</td><td>누구나</td></tr>
<tr><td><code>systemctl --failed</code></td><td>실패한 서비스만</td><td>누구나</td></tr>
</tbody></table></div>
<div class="box mem"><span class="lbl">꼭 구분할 것: start ≠ enable</span><p><b>start</b>는 "지금 켜라", <b>enable</b>은 "다음 부팅부터 자동으로 켜라"입니다. start만 하고 enable을 안 하면 <b>재부팅 후 서비스가 안 올라옵니다.</b> 실무에서 정말 자주 나는 실수입니다. 새 서비스를 설치하면 <code>enable --now</code>로 둘 다 하세요.</p></div>
<h3>systemctl status 결과 읽기</h3>
<pre class="code">● nginx.service - The nginx HTTP and reverse proxy server
     Loaded: loaded (/usr/lib/systemd/system/nginx.service; <b>enabled</b>; preset: disabled)
     Active: <b>active (running)</b> since Wed 2026-11-04 13:05:00 KST; 2min ago
   Main PID: 2301 (nginx)
      Tasks: 3
     Memory: 4.1M
     CGroup: /system.slice/nginx.service
             ├─2301 "nginx: master process /usr/sbin/nginx"
             └─2302 "nginx: worker process"

Nov 04 13:05:00 ojt-web01 systemd[1]: Starting nginx.service...
Nov 04 13:05:00 ojt-web01 systemd[1]: Started nginx.service.</pre>
<div class="tbl-wrap"><table><thead><tr><th>줄</th><th>보는 법</th></tr></thead><tbody>
<tr><td>●</td><td>초록 = 실행 중, 흰색 = 꺼짐, 빨강 = 실패</td></tr>
<tr><td>Loaded</td><td>유닛 파일 위치, <b>enabled/disabled</b> = 부팅 시 자동 시작 여부</td></tr>
<tr><td>Active</td><td><b>active (running)</b> 정상 실행 / <b>inactive (dead)</b> 꺼짐 / <b>failed</b> 실패. 언제부터인지도 나옴</td></tr>
<tr><td>Main PID</td><td>메인 프로세스 번호</td></tr>
<tr><td>맨 아래 몇 줄</td><td>이 서비스의 <b>최근 로그</b>. failed일 때 원인이 여기 찍혀 있는 경우가 많음</td></tr>
</tbody></table></div>
<p>서비스 설정(유닛 파일)은 <code>/usr/lib/systemd/system/</code>(패키지가 설치한 원본)과 <code>/etc/systemd/system/</code>(관리자가 바꾼 것, 우선)에 있습니다. 유닛 파일을 고치면 <code>sudo systemctl daemon-reload</code>로 다시 읽게 합니다.</p>

<h2 id="s5">System Log: 무슨 일이 있었는지 기록</h2>
<p>로그는 서버의 <b>블랙박스</b>입니다. 장애가 나면 "언제, 무엇이, 왜"를 로그에서 찾습니다. 리눅스에서 로그를 보는 길은 두 가지입니다.</p>
<h3>① journalctl: systemd가 모은 로그</h3>
<pre class="code">journalctl                       <span class="c"># 전체 로그 (오래된 것부터, less처럼 넘김)</span>
journalctl -u nginx              <span class="c"># nginx 서비스 로그만 (가장 많이 씀)</span>
journalctl -u nginx -n 20        <span class="c"># 최근 20줄만</span>
journalctl -f                    <span class="c"># 새 로그를 실시간으로 계속 보기 (Ctrl+C로 나감)</span>
journalctl -b                    <span class="c"># 이번 부팅 이후 로그</span>
journalctl -p err                <span class="c"># 오류(err) 이상 심각한 것만</span>
journalctl --since "1 hour ago"  <span class="c"># 최근 1시간</span></pre>
<h3>② /var/log의 텍스트 로그 파일</h3>
<div class="tbl-wrap"><table><thead><tr><th>파일 (Rocky 기준)</th><th>Ubuntu</th><th>내용</th></tr></thead><tbody>
<tr><td><code>/var/log/messages</code></td><td><code>/var/log/syslog</code></td><td>시스템 전반</td></tr>
<tr><td><code>/var/log/secure</code></td><td><code>/var/log/auth.log</code></td><td>로그인, SSH, sudo 기록</td></tr>
<tr><td><code>/var/log/dnf.log</code></td><td><code>/var/log/apt/</code></td><td>프로그램 설치 기록</td></tr>
<tr><td><code>/var/log/nginx/access.log</code>, <code>error.log</code></td><td>같음</td><td>웹 접속 기록, 웹 오류</td></tr>
<tr><td><code>/var/log/cron</code></td><td>syslog에 포함</td><td>예약 작업 실행 기록</td></tr>
</tbody></table></div>
<pre class="code">sudo tail -n 50 /var/log/messages          <span class="c"># 최근 50줄 (로그 파일은 대부분 root만 읽기 가능)</span>
sudo tail -f /var/log/nginx/error.log      <span class="c"># 실시간으로 계속 보기</span>
sudo grep -i "fail" /var/log/secure        <span class="c"># 실패한 로그인 찾기</span></pre>
<h3>로그 한 줄 읽기</h3>
<pre class="code">Nov  4 09:20:13 ojt-web01 sshd[2210]: Failed password for invalid user admin from 203.0.113.50 port 40022 ssh2
<span class="c">시각            서버이름  프로그램[PID]  메시지 → "없는 사용자 admin으로 203.0.113.50에서 비밀번호 로그인 시도 실패"</span></pre>
<p>이런 줄이 수백 개 있다면 누군가 무작위로 비밀번호를 대입하고 있는 것입니다. 일차 04에서 배운 "비밀번호 로그인 끄기"가 필요한 이유입니다.</p>
<p>로그는 계속 쌓이므로 <b>logrotate</b>가 날짜별로 잘라 보관하고(<code>messages-20261101</code>처럼) 오래된 것은 지웁니다. 그래도 로그가 디스크를 가득 채우는 일이 흔해서, 일차 06의 용량 확인과 연결됩니다.</p>

<h2 id="s6">CPU와 메모리 모니터링</h2>
<h3>uptime: 한 줄 건강 상태</h3>
<pre class="code">$ uptime
 13:05:12 up 3 days,  4:12,  1 user,  load average: 1.95, 1.60, 1.02
<span class="c">현재시각   켜진 지 3일 4시간   접속자 1명   부하 평균: 최근 1분, 5분, 15분</span></pre>
<p><b>Load Average</b>는 "CPU를 쓰고 있거나 쓰려고 줄 서 있는 작업 수"의 평균입니다. <mark>CPU 코어 수와 비교</mark>해서 판단합니다. 코어가 2개(<code>nproc</code> = 2)라면 load 2.0이 꽉 찬 상태, 4.0이면 작업이 두 배로 밀려 있는 상태입니다. 1분 값이 15분 값보다 크면 부하가 올라가는 중입니다.</p>
<div class="box analogy"><span class="lbl">비유로 보면</span>계산대(코어)가 2개인 마트에서 load 1.95는 "계산대 두 곳이 거의 쉬지 않고 바쁜 상태", load 4.0은 "계산 중인 손님 2명 + 줄 선 손님 2명"입니다.</div>
<h3>top: 실시간 작업 관리자</h3>
<pre class="code">top - 13:05:12 up 3 days,  4:12,  1 user,  load average: 1.95, 1.60, 1.02
Tasks: 112 total,   2 running, 110 sleeping,   0 stopped,   0 zombie
%Cpu(s): 49.6 us,  0.8 sy,  0.0 ni, 49.1 id,  0.3 wa,  0.0 hi,  0.2 si,  0.0 st
MiB Mem :   3932.2 total,   1640.5 free,   1102.4 used,   1189.3 buff/cache
MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   2481.0 avail Mem

    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND
   4120 trainee   20   0    7600   1200    900 R  97.8   0.0  12:41.07 stress-test
   2301 root      20   0   12345   4100   2900 S   0.3   0.1   0:00.12 nginx</pre>
<div class="tbl-wrap"><table><thead><tr><th>줄</th><th>보는 법</th></tr></thead><tbody>
<tr><td>1줄</td><td>uptime과 같음</td></tr>
<tr><td>Tasks</td><td>프로세스 수. <b>zombie</b>가 계속 늘면 문제</td></tr>
<tr><td>%Cpu(s)</td><td><b>us</b> 사용자 프로그램, <b>sy</b> 커널, <b>id</b> 놀고 있음(idle), <b>wa</b> 디스크를 기다리는 시간. <b>id가 낮으면 CPU가 바쁨</b>, <b>wa가 높으면 디스크가 느림</b>, <b>st</b>가 높으면 VM이 하이퍼바이저에게 CPU를 못 받는 중(일차 02의 계층)</td></tr>
<tr><td>MiB Mem / Swap</td><td>메모리·스왑 요약. avail Mem이 실제로 더 쓸 수 있는 양</td></tr>
<tr><td>목록</td><td>기본은 CPU 많이 쓰는 순서. 범인 프로세스를 찾는 곳</td></tr>
</tbody></table></div>
<p>top 안에서: <kbd>P</kbd> CPU 순 정렬, <kbd>M</kbd> 메모리 순 정렬, <kbd>1</kbd> 코어별로 보기, <kbd>q</kbd> 나가기. 위 예시는 trainee가 실행한 <code>stress-test</code>가 CPU 한 코어를 거의 다 쓰고 있는 상황입니다(코어 2개라 전체 us는 약 50%).</p>
<h3>free: 메모리 사용량</h3>
<pre class="code">$ free -h
               total        used        free      shared  buff/cache   available
Mem:           3.8Gi       1.1Gi       1.6Gi        16Mi       1.2Gi       2.4Gi
Swap:          2.0Gi          0B       2.0Gi</pre>
<div class="box mem"><span class="lbl">free에서 볼 것은 available</span><p>리눅스는 남는 메모리를 파일 캐시(<b>buff/cache</b>)로 써서 <b>free</b>가 작게 보이는 게 정상입니다. 실제로 더 쓸 수 있는 양은 <b>available</b>입니다. available이 계속 줄고 <b>Swap used</b>가 늘어나면 메모리 부족 신호입니다(일차 02: 스왑 → OOM Killer).</p></div>
<h3>그 밖의 확인 명령</h3>
<div class="tbl-wrap"><table><thead><tr><th>명령</th><th>보는 것</th></tr></thead><tbody>
<tr><td><code>nproc</code>, <code>lscpu</code></td><td>CPU 개수와 정보 (load와 비교할 기준)</td></tr>
<tr><td><code>vmstat 1</code></td><td>1초마다 CPU·메모리·디스크 대기 요약</td></tr>
<tr><td><code>htop</code></td><td>top을 보기 좋게 만든 도구 (따로 설치)</td></tr>
<tr><td><code>dmesg</code></td><td>커널 메시지 (OOM Killer 기록 등)</td></tr>
</tbody></table></div>

<h2 id="s7">종합: "웹이 안 돼요" 점검 순서</h2>
<p>오늘 배운 명령을 실제 장애 상황 순서로 묶으면 이렇습니다. 손노트에 옮겨 적어 두세요.</p>
<ol>
<li><code>systemctl status nginx</code> → 서비스가 active (running)인가? failed면 아래 로그 줄 확인</li>
<li><code>journalctl -u nginx -n 50</code>, <code>sudo tail /var/log/nginx/error.log</code> → 오류 메시지 확인</li>
<li><code>uptime</code>, <code>top</code> → CPU가 꽉 찼나? 어떤 프로세스가 범인인가?</li>
<li><code>free -h</code> → available이 바닥났나? 스왑을 쓰고 있나?</li>
<li><code>df -h</code> → 디스크가 꽉 찼나? (일차 06)</li>
<li>조치 후 <code>sudo systemctl restart nginx</code> → 다시 status 확인 → 작업 로그 기록 → 보고</li>
</ol>
<p class="small muted">재부팅 후 서비스가 안 올라왔다면 <code>systemctl is-enabled nginx</code>부터 확인합니다(start ≠ enable).</p>

<h2 id="s8">직접 해 보기</h2>
<p>연습 터미널의 <b>"미션 C: 서비스·로그·자원"</b>에서 CPU를 독차지하는 프로세스를 찾아 종료하고, nginx를 켜고, 로그를 확인해 봅니다.</p>
<div class="btn-row"><a class="btn pri" href="#term">연습 터미널 열기 (미션 C)</a></div>
`,
summary:['프로그램 = 디스크의 실행 파일(레시피), 프로세스 = 실행 중인 상태(냄비). PID, PPID, 맨 위 조상은 systemd(1).','ps aux | grep 이름 으로 찾고, %CPU·%MEM·STAT을 본다. kill(15)이 먼저, kill -9는 마지막. 서비스는 systemctl stop.','데몬 = 뒤에서 계속 도는 서비스 프로세스(sshd, nginx, crond, chronyd). 관리자는 systemd.','systemctl status/start/stop/restart/reload/enable/disable. start(지금) ≠ enable(부팅 시 자동) → enable --now.','로그: journalctl -u 서비스 / -f / -b / -p err, /var/log/messages·secure·nginx. 로그 한 줄 = 시각·서버·프로그램[PID]·메시지.','uptime의 load average는 코어 수와 비교. top: id 낮으면 CPU 바쁨, wa 높으면 디스크 느림. free는 available을 본다.'],
essay:[
{q:'프로그램과 프로세스의 차이를 설명하고, PID와 PPID가 무엇인지 말해 보세요.',a:'프로그램은 디스크에 저장된 실행 파일이고, 프로세스는 그것이 실행되어 메모리에서 CPU를 쓰며 일하는 상태다. 같은 프로그램으로 여러 프로세스를 만들 수 있다. PID는 프로세스마다 붙는 고유 번호이고, PPID는 그 프로세스를 실행시킨 부모 프로세스의 번호다. 맨 위 조상은 PID 1 systemd다. (비유: 프로그램은 레시피 책, 프로세스는 지금 끓고 있는 냄비)'},
{q:'systemctl start와 enable의 차이를 설명하고, 둘을 구분하지 않으면 생기는 실무 사고를 말해 보세요.',a:'start는 서비스를 지금 당장 실행하는 것이고, enable은 다음 부팅부터 자동으로 실행되도록 등록하는 것이다. start만 하고 enable을 안 하면 지금은 잘 돌지만 재부팅 후 서비스가 올라오지 않아 장애가 난다. 그래서 새 서비스는 sudo systemctl enable --now 로 둘 다 한다.'},
{q:'systemctl status nginx 결과에서 확인해야 할 줄 3가지와 각각의 의미를 말해 보세요.',a:'① Loaded 줄의 enabled/disabled로 부팅 시 자동 시작 여부를 본다. ② Active 줄에서 active (running)이면 정상, inactive (dead)면 꺼짐, failed면 실패이며 언제부터인지도 본다. ③ 맨 아래 최근 로그 몇 줄에서 실패 원인을 찾는다. (Main PID로 메인 프로세스 번호도 확인)'},
{q:'CPU가 2개인 서버에서 uptime이 load average: 3.90, 2.10, 0.80 이라면 어떤 상황인가요? 다음에 무엇을 확인하겠습니까?',a:'코어가 2개인데 최근 1분 부하가 3.9라서 CPU가 꽉 차고 작업이 거의 두 배로 밀려 있다. 15분 0.8, 5분 2.1, 1분 3.9로 부하가 빠르게 올라가는 중이다. top으로 CPU를 많이 쓰는 프로세스를 찾고(%CPU, id 값), wa가 높으면 디스크 문제도 의심한다. 원인 프로세스가 서비스면 로그를 확인하고, 불필요한 프로세스면 kill로 정상 종료를 요청한다.'},
{q:'free -h 결과에서 free가 200Mi밖에 안 남았다고 메모리 부족이라고 판단하면 안 되는 이유는? 무엇을 봐야 하나요?',a:'리눅스는 남는 메모리를 파일 캐시(buff/cache)로 쓰기 때문에 free가 작게 보이는 것이 정상이다. 캐시는 필요하면 바로 내준다. 실제로 더 쓸 수 있는 양은 available이므로 available을 보고, Swap used가 늘고 있는지도 함께 본다. available이 바닥나고 스왑이 늘면 메모리 부족이다.'}
],
quiz:[
{v:[
 {q:'디스크에 저장된 실행 파일이 실행되어 메모리에서 동작하고 있는 상태를 무엇이라 하나요?',o:['프로세스','프로그램','패키지','유닛 파일'],e:'디스크에 저장된 실행 파일이 프로그램이고, 그것이 실행되어 메모리에서 CPU를 쓰며 동작하는 상태가 프로세스입니다. (비유: 레시피 책과 지금 끓고 있는 냄비)'},
 {q:'프로그램과 프로세스의 차이로 맞는 것은?',o:['프로그램은 디스크에 저장된 실행 파일이고, 프로세스는 그것이 실행되어 메모리에서 동작하는 상태다','프로그램은 실행 중인 상태이고, 프로세스는 디스크에 저장된 파일이다','둘은 같은 말이다','프로세스는 설치 패키지의 다른 이름이다'],e:'같은 프로그램을 세 번 실행하면 프로세스가 세 개 생깁니다.'}
]},
{v:[
 {q:'모든 프로세스의 맨 위 조상이며 PID가 1인 것은?',o:['systemd','bash','sshd','kernel.log'],e:'커널이 가장 먼저 실행하는 systemd가 PID 1입니다.'},
 {q:'systemd의 PID가 1인 이유는?',o:['커널이 가장 먼저 실행하는 프로그램이기 때문에','가장 중요한 사용자가 실행하기 때문에','가장 메모리를 많이 쓰기 때문에','가장 마지막에 실행되기 때문에'],e:'커널이 부팅 때 가장 먼저 systemd를 실행하므로 PID 1이고, 모든 프로세스의 조상이 됩니다.'}
]},
{v:[
 {q:'nginx 프로세스가 떠 있는지 찾는 가장 흔한 명령은?',o:['ps aux | grep nginx','ls nginx','cat nginx','chmod nginx'],e:'ps aux로 전체 목록을 뽑고 파이프로 grep에 넘겨 nginx가 들어간 줄만 봅니다.'},
 {q:'실행 중인 모든 프로세스 목록을 자세히 보는 명령은?',o:['ps aux','ls -la','cat /proc','systemctl enable'],e:'ps aux는 모든 사용자의 프로세스를 자세히 보여 줍니다. 특정 프로세스는 ps aux | grep 이름 으로 찾습니다.'}
]},
{v:[
 {q:'프로세스를 종료할 때 먼저 시도해야 하는 것은?',o:['kill PID (시그널 15, 정상 종료 요청)','kill -9 PID (강제 종료)','서버 재부팅','rm 로 프로그램 파일 삭제'],e:'-9는 정리할 기회 없이 죽여서 데이터가 깨질 수 있습니다. 마지막 수단입니다.'},
 {q:'kill -9 PID 의 의미는?',o:['정리할 기회 없이 프로세스를 강제로 종료한다','프로세스에게 정상 종료를 요청한다','프로세스를 잠시 멈춘다','프로세스의 우선순위를 높인다'],e:'kill PID(시그널 15)는 정상 종료 요청이고, 듣지 않을 때만 kill -9로 강제 종료합니다.'}
]},
{v:[
 {q:'데몬(Daemon)에 대한 설명으로 맞는 것은?',o:['화면 없이 백그라운드에서 계속 돌며 서비스를 제공하는 프로세스','사용자가 직접 입력하는 명령어','로그 파일의 다른 이름','삭제된 프로세스'],e:'sshd, crond, nginx처럼 요청을 기다리며 계속 돕니다.'},
 {q:'다음 중 데몬(Daemon)에 해당하는 것은?',o:['sshd','ls','cd','pwd'],e:'sshd, nginx, crond처럼 백그라운드에서 계속 돌며 요청을 기다리는 프로세스가 데몬입니다. 이름 끝에 d가 붙는 경우가 많습니다.'}
]},
{v:[
 {q:'재부팅 후에도 nginx가 자동으로 실행되게 하려면?',o:['sudo systemctl enable nginx','sudo systemctl start nginx','sudo systemctl status nginx','sudo systemctl reload nginx'],e:'start는 지금만, enable은 부팅 시 자동입니다. enable --now로 둘 다 할 수 있습니다.'},
 {q:'systemctl start와 enable의 차이로 맞는 것은?',o:['start는 지금 바로 실행하고, enable은 부팅할 때 자동으로 실행되게 한다','start는 부팅 때 자동 실행, enable은 지금 바로 실행','둘 다 같은 기능이다','enable은 서비스를 삭제한다'],e:'둘은 별개입니다. 지금 켜고 부팅 때도 켜지게 하려면 둘 다 해야 합니다(enable --now).'}
]},
{v:[
 {q:'systemctl status 결과에서 서비스가 정상 실행 중임을 뜻하는 것은?',o:['Active: active (running)','Active: inactive (dead)','Active: failed','Loaded: not-found'],e:'inactive(dead)는 꺼짐, failed는 실행 실패입니다.'},
 {q:'systemctl status 결과에서 부팅 때 자동 시작 여부(enabled/disabled)를 보여 주는 줄은?',o:['Loaded','Active','Main PID','Memory'],e:'Loaded 줄에 enabled/disabled가, Active 줄에 지금 실행 상태(active (running) 등)가 나옵니다.'}
]},
{v:[
 {q:'서비스를 끊지 않고 설정 파일만 다시 읽게 하는 명령은?',o:['systemctl reload','systemctl restart','systemctl stop','systemctl disable'],e:'restart는 껐다 켜서 잠깐 끊기고, reload는 지원하는 서비스에서 끊김 없이 설정만 반영합니다.'},
 {q:'systemctl reload와 restart의 차이로 맞는 것은?',o:['reload는 서비스를 끊지 않고 설정만 다시 읽고, restart는 껐다 켜서 잠깐 끊긴다','reload는 껐다 켜고, restart는 설정만 다시 읽는다','둘 다 같은 기능이다','reload는 서비스를 삭제한다'],e:'설정 파일만 바꿨다면 reload로 끊김 없이 적용할 수 있습니다.'}
]},
{v:[
 {q:'nginx 서비스의 로그만 골라 보는 명령은?',o:['journalctl -u nginx','journalctl -b','dmesg','free -h'],e:'-u는 유닛(서비스)을 지정합니다. -f를 붙이면 실시간으로 계속 봅니다.'},
 {q:'journalctl에서 새 로그를 실시간으로 계속 보는 옵션은?',o:['-f','-b','-u','-p'],e:'-f는 실시간(follow), -b는 이번 부팅 이후, -u는 특정 서비스, -p는 심각도 지정입니다.'}
]},
{v:[
 {q:'Rocky Linux에서 로그인·SSH·sudo 기록이 남는 로그 파일은?',o:['/var/log/secure','/var/log/dnf.log','/etc/passwd','/var/log/cron'],e:'Ubuntu에서는 /var/log/auth.log입니다.'},
 {q:'Ubuntu에서 로그인·SSH·sudo 기록이 남는 로그 파일은?',o:['/var/log/auth.log','/var/log/secure','/var/log/syslog','/var/log/apt/'],e:'같은 내용이 Rocky에서는 /var/log/secure, Ubuntu에서는 /var/log/auth.log에 남습니다.'}
]},
{v:[
 {q:'CPU 코어가 4개인 서버의 load average가 1.0이라면?',o:['여유 있는 상태 (코어 4개 중 1개 분량만 바쁨)','CPU가 꽉 차서 위험하다','메모리가 부족하다','디스크가 가득 찼다'],e:'load는 코어 수와 비교합니다. 4코어에서 4.0이 꽉 찬 상태입니다.'},
 {q:'CPU 코어가 2개인 서버의 load average가 4.0이라면?',o:['작업이 코어 수의 두 배로 밀려 있다','CPU가 절반만 바쁘다','CPU가 완전히 놀고 있다','메모리가 부족하다'],e:'코어가 2개라면 load 2.0이 꽉 찬 상태이고, 4.0이면 작업이 두 배로 밀려 있는 상태입니다.'}
]},
{v:[
 {q:'top의 %Cpu(s) 줄에서 wa 값이 높다면 무엇을 의심하나요?',o:['디스크(I/O)가 느려서 CPU가 기다리고 있다','CPU가 놀고 있다','메모리가 너무 많다','네트워크가 빠르다'],e:'wa = I/O wait. 디스크나 스토리지 성능 문제를 의심합니다.'},
 {q:'top의 %Cpu(s) 줄에서 id 값이 낮다면?',o:['CPU가 바쁘다','CPU가 놀고 있다','디스크가 느리다','메모리가 남는다'],e:'id는 idle(놀고 있음)입니다. id가 낮으면 CPU가 바쁘고, wa가 높으면 디스크를 기다리는 것입니다.'}
]},
{v:[
 {q:'free -h 결과에서 "실제로 더 쓸 수 있는 메모리"를 보려면 어느 칸을 보나요?',o:['available','free','shared','total'],e:'buff/cache는 필요하면 내주므로, 실제 여유는 available입니다.'},
 {q:'free -h 결과의 buff/cache는 무엇인가?',o:['리눅스가 남는 메모리를 파일 캐시로 쓴 것으로, 필요하면 비워서 내준다','이미 다 써서 다시 쓸 수 없는 메모리','스왑으로 옮겨진 메모리','고장 난 메모리'],e:'그래서 free가 작아 보여도 정상일 수 있고, 실제 여유는 available을 봅니다.'}
]},
{v:[
 {q:'uptime 결과의 load average: 1.95, 1.60, 1.02 에서 세 숫자의 뜻은?',o:['최근 1분, 5분, 15분 동안의 부하 평균','CPU 1, 2, 3번의 사용률','최근 1시간, 5시간, 15시간의 부하 평균','현재·최대·최소 CPU 사용률'],e:'세 숫자는 최근 1분·5분·15분 평균입니다. 1분 값이 15분 값보다 크면 최근에 부하가 늘고 있는 것입니다.'},
 {q:'load average와 비교할 기준인 CPU(논리 CPU) 개수를 보는 명령은?',o:['nproc','free -h','df -h','journalctl'],e:'load average는 코어 수와 비교해서 판단합니다. nproc나 lscpu로 CPU 개수를 확인합니다.'}
]},
{v:[
 {q:'Rocky Linux에서 시스템 전반의 로그가 쌓이는 파일은?',o:['/var/log/messages','/var/log/secure','/var/log/dnf.log','/var/log/cron'],e:'시스템 전반은 /var/log/messages(Ubuntu는 /var/log/syslog), 로그인 기록은 /var/log/secure, 설치 기록은 /var/log/dnf.log입니다.'},
 {q:'nginx 웹 서버의 오류 로그가 쌓이는 파일은?',o:['/var/log/nginx/error.log','/var/log/nginx/access.log','/var/log/secure','/var/log/dnf.log'],e:'access.log에는 웹 접속 기록, error.log에는 웹 오류가 쌓입니다.'}
]},
{v:[
 {q:'"웹이 안 돼요" 점검 순서에서 가장 먼저 실행하는 명령은?',o:['systemctl status nginx','free -h','df -h','sudo reboot'],e:'먼저 서비스가 active (running)인지 보고, 그다음 로그(journalctl, error.log) → CPU(uptime, top) → 메모리(free -h) → 디스크(df -h) 순서로 봅니다.'},
 {q:'재부팅 후 서비스가 자동으로 올라오지 않았을 때 먼저 확인하는 명령은?',o:['systemctl is-enabled nginx','systemctl reload nginx','free -h','ps aux'],e:'start와 enable은 다릅니다. 부팅 때 자동 시작이 설정(enable)되어 있는지부터 확인합니다.'}
]}
]
});
