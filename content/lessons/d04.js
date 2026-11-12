OJT.lesson({
id:'d04', week:2, day:'04', tag:'일차 04', mins:'약 3시간',
title:'Linux 접근 관리: 명령어, 계정·그룹, 권한, SSH',
cover:[['기본 명령어','s2'],['계정','s3'],['그룹과 sudo','s4'],['파일 권한','s5'],['chmod / chown','s6'],['SSH 접근 방식','s7'],['실습 시나리오: 계정 생성부터 SSH 접속까지','s8']],
act:'계정 생성·권한 설정·SSH 접속 방법',
goal:['기본 명령어(pwd, ls, cd, mkdir, cp, mv, rm, cat, grep)를 쓸 수 있다','root·시스템 계정·일반 계정을 구분하고 /etc/passwd 한 줄을 읽을 수 있다','그룹과 sudo로 권한을 나눠 주는 방법을 설명할 수 있다','ls -l 결과의 권한(rwx)을 읽고 숫자로 바꾸며, chmod·chown을 쓸 수 있다','SSH 키 인증의 원리와 접속 명령, 접속 실패 원인을 설명할 수 있다'],
terms:[
['명령어 형식','Command Syntax','명령어 [옵션] [대상]. 예: ls -l /etc'],
['옵션','Option, Flag','명령어의 동작을 바꾸는 추가 설정. -l, -a 처럼 - 로 시작한다.'],
['파이프','Pipe, |','앞 명령의 결과를 뒤 명령의 입력으로 넘기는 기호. 예: ps aux | grep nginx'],
['grep','글자 찾기','파일이나 결과에서 특정 글자가 들어간 줄만 골라 보여 주는 명령.'],
['root','슈퍼유저','모든 권한을 가진 관리자 계정. UID는 0.'],
['시스템 계정','System Account','사람이 아니라 서비스(sshd, nginx 등)가 쓰는 계정. 로그인할 수 없게 막아 둔다.'],
['UID / GID','User ID / Group ID','사용자와 그룹을 구분하는 번호. 시스템은 이름보다 번호로 구분한다.'],
['그룹','Group','여러 사용자를 묶어 같은 권한을 주기 위한 단위. 기본 그룹 1개 + 보조 그룹(없어도 되고 여러 개도 가능).'],
['sudo','superuser do','허락받은 사용자가 명령 하나를 관리자 권한으로 실행하는 명령. 기록이 남는다.'],
['sudoers','/etc/sudoers','누가 어떤 명령을 sudo로 쓸 수 있는지 적은 설정. visudo로만 고친다.'],
['su','switch user','다른 사용자로 아예 전환하는 명령.'],
['권한 (rwx)','Permission','r(읽기) w(쓰기) x(실행). 소유자·그룹·기타 사용자에게 각각 따로 준다.'],
['chmod / chown','change mode / owner','파일 권한을 바꾸는 명령 / 파일 소유자(와 그룹)를 바꾸는 명령(root만).'],
['umask','유마스크','새 파일을 만들 때 꺼 둘 권한을 적어 둔 설정값. 보통 022 → 파일 644, 디렉터리 755.'],
['SSH','Secure Shell','네트워크로 다른 서버에 암호화된 통로를 만들어 접속하는 방식. 기본 포트 22.'],
['sshd','SSH Daemon','서버에서 SSH 접속을 기다리는 서비스(데몬). 설정 파일은 /etc/ssh/sshd_config.'],
['공개키 / 개인키','Public / Private Key','한 쌍으로 만들어지는 열쇠. 공개키는 자물쇠(서버에 등록), 개인키는 열쇠(내가 보관, 공유 금지).'],
['authorized_keys','~/.ssh/authorized_keys','서버에서 "이 공개키를 가진 사람은 들여보내도 된다"고 등록해 두는 파일.'],
['known_hosts','~/.ssh/known_hosts','내 PC가 "이 서버는 전에 접속해 본 그 서버가 맞다"를 확인하려고 저장해 두는 서버 지문 목록.'],
['scp','secure copy','SSH 통로로 파일을 서버와 주고받는 명령.']
],
body:`
<h2 id="s1">명령어의 문법과 꼭 알아야 할 키</h2>
<pre class="code">ls     -l      /etc
<span class="c">명령어  옵션    대상</span></pre>
<ul><li>명령어는 <b>동사</b>, 옵션은 <b>부사</b>(어떻게), 대상은 <b>목적어</b>(무엇을)라고 생각하면 됩니다.</li><li>옵션은 <code>-l -a</code>처럼 따로 써도 되고 <code>-la</code>처럼 붙여 써도 됩니다.</li><li>긴 옵션은 <code>--help</code>처럼 하이픈(-) 두 개로 씁니다.</li></ul>
<div class="tbl-wrap"><table><thead><tr><th>키·기호</th><th>하는 일</th></tr></thead><tbody>
<tr><td><kbd>Tab</kbd></td><td>파일·명령 이름 자동 완성. 오타를 줄여 주니 습관처럼 누르세요.</td></tr>
<tr><td><kbd>↑</kbd> <kbd>↓</kbd></td><td>이전에 입력한 명령 다시 불러오기</td></tr>
<tr><td><kbd>Ctrl</kbd>+<kbd>C</kbd></td><td>실행 중인 명령 강제로 멈추기</td></tr>
<tr><td><code>명령어 --help</code>, <code>man 명령어</code></td><td>사용법 보기 (man 화면은 q로 나감)</td></tr>
<tr><td><code>|</code> (파이프)</td><td>앞 명령의 결과를 뒤 명령에 넘김. 예: <code>cat /etc/passwd | grep trainee</code></td></tr>
<tr><td><code>&gt;</code> / <code>&gt;&gt;</code></td><td>결과를 파일에 덮어쓰기 / 이어 쓰기</td></tr>
</tbody></table></div>

<h2 id="s2">기본 명령어</h2>
<div class="tbl-wrap"><table><thead><tr><th>명령어</th><th>뜻 (어원)</th><th>예</th><th>설명</th></tr></thead><tbody>
<tr><td><code>pwd</code></td><td>print working directory</td><td><code>pwd</code></td><td>지금 내 위치 보기</td></tr>
<tr><td><code>ls</code></td><td>list</td><td><code>ls -la</code></td><td>목록 보기. -l 자세히, -a 숨김 파일까지, -h 크기를 KB·MB로</td></tr>
<tr><td><code>cd</code></td><td>change directory</td><td><code>cd /var/log</code></td><td>이동. <code>cd</code>만 치면 홈으로</td></tr>
<tr><td><code>mkdir</code></td><td>make directory</td><td><code>mkdir -p a/b/c</code></td><td>디렉터리 만들기. -p는 중간 디렉터리까지 한 번에</td></tr>
<tr><td><code>touch</code></td><td>(건드리다)</td><td><code>touch note.txt</code></td><td>빈 파일 만들기 (있으면 수정 시각만 바꿈)</td></tr>
<tr><td><code>cp</code></td><td>copy</td><td><code>cp -r dir1 dir2</code></td><td>복사. 디렉터리는 -r. 설정 파일을 고치기 전에는 <code>cp 파일 파일.bak</code>으로 백업하는 습관</td></tr>
<tr><td><code>mv</code></td><td>move</td><td><code>mv a.txt old/</code></td><td>이동, 또는 이름 바꾸기</td></tr>
<tr><td><code>rm</code></td><td>remove</td><td><code>rm a.txt</code></td><td>삭제. <b>휴지통이 없어서 되돌릴 수 없음</b>. 디렉터리는 <code>rm -r</code></td></tr>
<tr><td><code>cat</code></td><td>concatenate</td><td><code>cat /etc/hostname</code></td><td>파일 내용 출력</td></tr>
<tr><td><code>less</code></td><td>-</td><td><code>less /var/log/messages</code></td><td>긴 파일을 한 화면씩 보기. 스페이스 다음 장, /글자 검색, q 나가기</td></tr>
<tr><td><code>head</code> / <code>tail</code></td><td>머리 / 꼬리</td><td><code>tail -n 20 파일</code></td><td>앞부분 / 뒷부분만 보기. 로그는 최신이 뒤에 있어서 tail을 많이 씀. <code>tail -f</code>는 실시간으로 계속 보기</td></tr>
<tr><td><code>grep</code></td><td>global regular expression print (글자 찾기)</td><td><code>grep -i error /var/log/messages</code></td><td>특정 글자가 들어간 줄만 보기. -i 대소문자 무시, -v 제외</td></tr>
<tr><td><code>echo</code></td><td>메아리</td><td><code>echo hello &gt; a.txt</code></td><td>글자 출력. 파일에 쓰기</td></tr>
<tr><td><code>whoami</code> / <code>id</code></td><td>who am I</td><td><code>id</code></td><td>나는 누구? / 내 UID와 그룹</td></tr>
<tr><td><code>history</code></td><td>-</td><td><code>history</code></td><td>지금까지 입력한 명령 목록</td></tr>
</tbody></table></div>
<div class="box warn"><span class="lbl">rm 사고를 막는 습관</span><ul><li>지우기 전에 <code>pwd</code>로 내 위치를, <code>ls</code>로 지울 대상을 먼저 확인합니다.</li><li><code>rm -rf</code>는 묻지도 않고 전부 지웁니다. 운영 서버에서는 특히 조심하고, 경로는 절대경로로 씁니다.</li></ul></div>

<h2 id="s3">계정: 누가 이 서버를 쓰나</h2>
<p>리눅스는 처음부터 <b>여러 사람과 여러 서비스가 한 서버를 함께 쓰도록</b> 만들어졌습니다. 그래서 "누가 무엇을 할 수 있나"를 꼼꼼하게 나눕니다.</p>
<div class="tbl-wrap"><table><thead><tr><th>종류</th><th>UID</th><th>예</th><th>특징</th></tr></thead><tbody>
<tr><td><b>root</b></td><td>0</td><td>root</td><td>모든 권한. 실수 한 번이 시스템 전체를 망가뜨릴 수 있어 평소에는 쓰지 않음</td></tr>
<tr><td><b>시스템 계정</b></td><td>1~999</td><td>sshd, nginx, mysql</td><td>서비스가 쓰는 계정. 로그인 셸이 <code>/sbin/nologin</code>이라 사람이 로그인할 수 없음. 서비스가 해킹돼도 피해를 그 계정 권한 안으로 줄임</td></tr>
<tr><td><b>일반 계정</b></td><td>1000~</td><td>trainee, kim</td><td>사람이 쓰는 계정. 자기 홈과 허락받은 파일만 다룸</td></tr>
</tbody></table></div>
<h3>계정 정보가 저장되는 파일</h3>
<pre class="code"><span class="c"># /etc/passwd : 계정 목록 (누구나 읽을 수 있음)</span>
trainee:x:1000:1000:OJT Trainee:/home/trainee:/bin/bash
<span class="c">이름   :비번:UID :GID :설명       :홈 디렉터리   :로그인 셸
        └ x = 비밀번호는 /etc/shadow에 따로 보관</span>

<span class="c"># /etc/shadow : 암호화된 비밀번호 (root만 읽을 수 있음)</span>
trainee:$6$Xy...(암호화된 값):20395:0:99999:7:::
<span class="c">이름   :비밀번호 해시          :마지막 변경일:최소 사용 일수:최대 사용 일수:만료 경고일</span>

<span class="c"># /etc/group : 그룹 목록</span>
wheel:x:10:trainee,kim
<span class="c">그룹명:비번:GID:소속 사용자들</span></pre>
<h3>계정 관리 명령 (root 또는 sudo 필요)</h3>
<div class="tbl-wrap"><table><thead><tr><th>명령</th><th>하는 일</th></tr></thead><tbody>
<tr><td><code>sudo useradd kim</code></td><td>사용자 kim 만들기 (홈 /home/kim, 같은 이름의 기본 그룹도 생성). Ubuntu의 <code>useradd</code>는 <code>-m</code>을 붙여야 홈 디렉터리를 만들고, Ubuntu에서는 대화형 <code>adduser</code>도 많이 씀</td></tr>
<tr><td><code>sudo passwd kim</code></td><td>kim의 비밀번호 설정 (설정 전에는 비밀번호로 로그인 불가)</td></tr>
<tr><td><code>sudo userdel -r kim</code></td><td>kim 삭제 (-r: 홈 디렉터리도 함께)</td></tr>
<tr><td><code>sudo chage -l kim</code></td><td>비밀번호 만료 정책 확인</td></tr>
<tr><td><code>id kim</code>, <code>groups kim</code></td><td>kim의 UID와 소속 그룹 확인</td></tr>
<tr><td><code>who</code>, <code>w</code>, <code>last</code></td><td>지금 로그인한 사람 / 하는 일 / 최근 로그인 기록</td></tr>
</tbody></table></div>

<h2 id="s4">그룹과 sudo: 권한을 나눠 주는 방법</h2>
<p><b>그룹</b>은 여러 사용자에게 같은 권한을 한 번에 주기 위한 묶음입니다. 개발자 5명이 같은 디렉터리를 써야 한다면, 5명에게 따로 권한을 주지 않고 <code>dev</code> 그룹에 넣고 디렉터리를 그 그룹 소유로 만듭니다.</p>
<ul><li><b>기본 그룹</b>: 모든 사용자가 반드시 1개 가집니다. 사용자를 만들 때 보통 사용자 이름과 같은 그룹이 자동으로 생성되어 기본 그룹이 됩니다. 새 파일을 만들면 이 그룹 소유가 됩니다.</li><li><b>보조 그룹</b>: 필요에 따라 추가로 가입하는 그룹입니다. 없어도 되고 여러 개여도 됩니다. 예: wheel, dev, docker.</li></ul>
<p>접근 권한을 검사할 때는 기본·보조를 구분하지 않고, 가입한 모든 그룹의 권한을 똑같이 받습니다. 둘의 차이는 새 파일이 어느 그룹 소유로 만들어지느냐뿐입니다.</p>
<pre class="code">$ id alice
uid=1001(alice) gid=1001(alice) groups=1001(alice),10(wheel),1002(dev)
<span class="c"># gid= 기본 그룹 / groups= 가입한 전체 그룹(기본 + 보조)</span></pre>
<div class="tbl-wrap"><table><thead><tr><th>명령</th><th>하는 일</th></tr></thead><tbody>
<tr><td><code>sudo groupadd dev</code></td><td>그룹 dev 만들기</td></tr>
<tr><td><code>sudo usermod -aG dev kim</code></td><td>kim을 dev 그룹에 <b>추가</b>. <b>-a를 빼먹으면 기존 보조 그룹이 지워지고</b> dev만 남으니 주의. 그룹 변경은 다시 로그인해야 적용</td></tr>
<tr><td><code>sudo gpasswd -d kim dev</code></td><td>kim을 dev 그룹에서 빼기</td></tr>
</tbody></table></div>
<p>그룹을 바꾸는 명령:</p>
<pre class="code">sudo usermod -aG dev alice   <span class="c"># 보조 그룹에 추가 (-a를 빼면 기존 보조 그룹이 전부 지워짐)</span>
sudo usermod -g dev alice    <span class="c"># 기본 그룹 자체를 dev로 변경</span></pre>
<h3>sudo와 su</h3>
<ul><li><code>sudo 명령어</code>: 허락받은 사용자가 그 명령 <b>한 번만</b> 관리자 권한으로 실행합니다. 처음에 <b>자기</b> 비밀번호를 묻고, 누가 언제 무엇을 했는지 기록이 남습니다(Red Hat 계열 <code>/var/log/secure</code>, Ubuntu <code>/var/log/auth.log</code>). <mark>실무에서는 root로 직접 로그인하지 않고 sudo를 씁니다.</mark></li><li><code>su - 사용자</code>: 그 사용자로 아예 전환합니다. <b>상대방의</b> 비밀번호가 필요합니다. <code>sudo -i</code>는 root로 전환(프롬프트가 <code>#</code>로 바뀜), <code>exit</code>로 돌아옵니다.</li></ul>
<p>누가 sudo를 쓸 수 있는지는 <code>/etc/sudoers</code> 파일에 적혀 있습니다. 이 파일에는 "특정 그룹의 멤버는 sudo를 쓸 수 있다"는 규칙이 미리 들어 있는데, 그 그룹이 Red Hat 계열은 <b>wheel</b>, Ubuntu는 <b>sudo</b>입니다.</p>
<pre class="code">%wheel  ALL=(ALL)  ALL        <span class="c"># wheel 그룹은 모든 명령을 sudo로 실행 가능</span>
sudo visudo                   <span class="c"># sudoers는 반드시 visudo로 수정 (문법 오류를 검사해 줌)</span></pre>
<p>그룹은 폴더가 아니라 <code>/etc/group</code> 파일의 한 줄이며, 사용자를 그룹에 넣으면 그 줄의 멤버 목록에 이름이 추가됩니다.</p>
<pre class="code">$ sudo usermod -aG wheel lee
$ grep wheel /etc/group
wheel:x:10:trainee,kim,lee</pre>
<div class="box analogy"><span class="lbl">비유로 보면</span>root는 건물의 <b>마스터키</b>. 마스터키를 항상 들고 다니면 잃어버리거나 실수로 아무 문이나 열게 됩니다. sudo는 "필요할 때 관리실에서 마스터키를 빌리고, 대장에 이름을 적는 것"입니다. wheel 그룹은 "마스터키를 빌릴 수 있는 사람 명단"입니다.</div>

<h2 id="s5">파일 권한: 누가 무엇을 할 수 있나</h2>
<p><code>ls -l</code>을 치면 이런 줄이 나옵니다. 맨 앞 10글자가 권한입니다.</p>
<pre class="code">-rw-r--r--  1  trainee  trainee  120  Nov  4 10:00  memo.txt
<span class="c">권한        링크 소유자   소유 그룹 크기  수정 시각     이름</span></pre>
<div class="perm-anat"><span class="pa-t">-<small>종류</small></span><span class="pa-u">rw-<small>소유자 (u)</small></span><span class="pa-g">r--<small>그룹 (g)</small></span><span class="pa-o">r--<small>기타 (o)</small></span></div>
<ul><li><b>첫 글자</b>: <code>-</code> 일반 파일, <code>d</code> 디렉터리, <code>l</code> 링크</li><li><b>그다음 3글자씩</b>: 소유자(user) / 소유 그룹(group) / 그 밖의 모든 사람(others)</li></ul>
<div class="tbl-wrap"><table><thead><tr><th>글자</th><th>파일일 때</th><th>디렉터리일 때</th><th>숫자</th></tr></thead><tbody>
<tr><td><code>r</code> read</td><td>내용 읽기</td><td>목록 보기(ls)</td><td><b>4</b></td></tr>
<tr><td><code>w</code> write</td><td>내용 고치기</td><td>안에 파일 만들기·지우기·이름 바꾸기</td><td><b>2</b></td></tr>
<tr><td><code>x</code> execute</td><td>프로그램으로 실행</td><td>안으로 들어가기(cd)</td><td><b>1</b></td></tr>
<tr><td><code>-</code></td><td colspan="2">권한 없음</td><td>0</td></tr>
</tbody></table></div>
<h3>리눅스가 권한을 판단하는 순서</h3>
<ol><li>내가 <b>root</b>면 → 거의 무조건 허용</li><li>내가 파일의 <b>소유자</b>면 → 소유자 칸(앞 3글자)<b>만</b> 본다</li><li>내가 파일의 <b>그룹</b>에 속하면 → 그룹 칸(가운데 3글자)만 본다</li><li>둘 다 아니면 → 기타 칸(뒤 3글자)을 본다</li></ol>
<p class="small muted">그래서 소유자 칸이 <code>---</code>이고 기타 칸이 <code>rwx</code>여도, 소유자 본인은 읽을 수 없습니다. 위에서부터 처음 해당하는 칸 하나만 봅니다.</p>
<h3>숫자로 바꾸기: 더하기만 하면 된다</h3>
<p>세 자리를 각각 더합니다. <code>rw-</code> = 4+2+0 = <b>6</b>, <code>r-x</code> = 4+0+1 = <b>5</b>, <code>rwx</code> = 4+2+1 = <b>7</b>.</p>
<div class="box mem"><span class="lbl">외울 것: 자주 쓰는 권한</span>
<div class="tbl-wrap" style="margin:.5rem 0 0"><table><tbody>
<tr><td><code>755</code></td><td><code>rwxr-xr-x</code></td><td>디렉터리, 실행 파일. 나는 다 하고, 나머지는 읽기·실행만</td></tr>
<tr><td><code>644</code></td><td><code>rw-r--r--</code></td><td>일반 파일. 나는 읽고 쓰고, 나머지는 읽기만</td></tr>
<tr><td><code>600</code></td><td><code>rw-------</code></td><td>비밀 파일, <b>SSH 개인키</b>, authorized_keys. 나만 읽고 쓰기</td></tr>
<tr><td><code>700</code></td><td><code>rwx------</code></td><td>나만 쓰는 디렉터리 (예: ~/.ssh)</td></tr>
<tr><td><code>770</code></td><td><code>rwxrwx---</code></td><td>팀 공유 디렉터리 (소유자와 그룹만)</td></tr>
</tbody></table></div></div>
<div data-widget="permcalc"></div>
<h3>새 파일의 기본 권한: umask</h3>
<ul><li><b>umask</b>는 "새 파일을 만들 때 꺼 둘 권한"을 적어 둔 설정값입니다.</li><li>프로그램이 파일을 만들 때 요청하는 최대치(파일 666, 디렉터리 777)가 있고, 시스템이 만드는 순간에 umask에 적힌 권한을 꺼서 만듭니다.</li><li>umask의 각 자리는 끌 권한을 뜻합니다. 0은 아무것도 끄지 않고, 2는 w를, 7은 rwx를 모두 끕니다. 뺄셈이 아니라 권한을 끄는 것이므로, umask 027이면 666은 640(<code>rw-r-----</code>)이 됩니다.</li></ul>
<div class="tbl-wrap"><table><thead><tr><th></th><th>요청값</th><th>umask 022</th><th>결과</th></tr></thead><tbody>
<tr><td><b>파일</b></td><td>666 <code>rw-rw-rw-</code></td><td><code>----w--w-</code> 제거</td><td><b>644</b> <code>rw-r--r--</code></td></tr>
<tr><td><b>디렉터리</b></td><td>777 <code>rwxrwxrwx</code></td><td><code>----w--w-</code> 제거</td><td><b>755</b> <code>rwxr-xr-x</code></td></tr>
</tbody></table></div>
<p>umask는 서버마다 다를 수 있습니다. 대부분 022지만 보장되지 않으니, 새 서버에 들어가면 <code>umask</code>로 확인하는 것이 안전합니다. umask는 배포판·서버·사용자·세션 단위로 달라질 수 있습니다.</p>
<div class="tbl-wrap"><table><thead><tr><th>단위</th><th>예</th></tr></thead><tbody>
<tr><td><b>배포판</b></td><td>대부분 022. 배포판과 버전에 따라 일반 사용자는 002인 경우도 있음</td></tr>
<tr><td><b>서버</b></td><td>보안 정책이 엄격한 회사는 027이나 077로 바꿔 둠</td></tr>
<tr><td><b>사용자</b></td><td>각자 <code>~/.bashrc</code>(셸을 시작할 때 읽는 개인 설정 파일)에 <code>umask 077</code>을 넣으면 그 사용자만 달라짐</td></tr>
<tr><td><b>세션</b></td><td>터미널에서 <code>umask 077</code>을 입력하면 그 터미널에서만 적용되고, 로그아웃하면 사라짐</td></tr>
</tbody></table></div>
<h3>특수 권한 (이름만 알아 두기)</h3>
<ul><li><b>sticky bit</b> (<code>t</code>): <code>/tmp</code>는 <code>drwxrwxrwt</code>입니다. 누구나 파일을 만들 수 있지만, <b>남의 파일은 지울 수 없게</b> 막습니다.</li><li><b>setuid</b> (<code>s</code>): <code>/usr/bin/passwd</code>는 <code>-rwsr-xr-x</code>입니다. 일반 사용자가 실행해도 잠깐 root 권한으로 동작해서 자기 비밀번호를 바꿀 수 있습니다.</li></ul>

<h2 id="s6">chmod와 chown</h2>
<pre class="code">chmod 600 mykey.pem          <span class="c"># 숫자 방식: 나만 읽고 쓰기</span>
chmod u+x deploy.sh          <span class="c"># 기호 방식: 소유자(u)에게 실행(x) 추가(+)</span>
chmod go-w report.txt        <span class="c"># 그룹(g)과 기타(o)에게서 쓰기(w) 빼기(-)</span>
chmod -R 750 /srv/app        <span class="c"># -R: 디렉터리 안의 모든 파일까지 한 번에</span>
sudo chown kim note.txt      <span class="c"># 소유자를 kim으로 (root만 가능 → sudo)</span>
sudo chown kim:dev note.txt  <span class="c"># 소유자는 kim, 그룹은 dev로</span>
sudo chown -R nginx:nginx /usr/share/nginx/html   <span class="c"># 웹 파일을 nginx 계정 소유로</span></pre>
<ul><li><b>chmod</b>는 파일 <b>소유자</b>나 root만 할 수 있습니다.</li><li><b>chown</b>은 <b>root만</b> 할 수 있습니다. 일반 사용자가 남에게 파일을 떠넘기지 못하게 하기 위해서입니다.</li></ul>
<div class="box warn"><span class="lbl">하지 말 것: chmod 777</span><p>안 되면 일단 777로 다 열어 버리는 것은 가장 흔한 나쁜 습관입니다. 누구나 고치고 지울 수 있게 됩니다. <b>필요한 사람에게 필요한 권한만</b>(최소 권한 원칙) 주세요.</p></div>

<h2 id="s7">SSH: 멀리 있는 서버에 들어가는 문</h2>
<p>데이터센터나 클라우드에 있는 서버에는 화면도 키보드도 없습니다. 엔지니어는 자기 PC에서 <b>SSH</b>로 접속합니다. SSH는 내 PC와 서버 사이에 <b>암호화된 통로</b>를 만들어서, 중간에서 누가 엿봐도 내용을 알 수 없게 합니다. (예전에 쓰던 telnet은 암호화가 없어서 지금은 쓰지 않습니다.)</p>
<div class="flow"><div class="n"><b>내 PC</b><small>ssh (클라이언트)</small></div><span class="ar">→ 22번 포트 →</span><div class="n k"><b>서버</b><small>sshd (서버 데몬)</small></div></div>
<pre class="code">ssh trainee@10.0.1.10                       <span class="c"># 사용자명@서버IP (기본 22번 포트)</span>
ssh -p 2222 trainee@10.0.1.10               <span class="c"># 22가 아닌 포트로 접속할 때</span>
ssh -i ~/keys/ojt.pem rocky@203.0.113.10    <span class="c"># 개인키 파일을 지정해서 접속 (클라우드 VM)</span>
exit                                        <span class="c"># 접속 끊기</span></pre>
<p><b>포트</b>는 한 서버 안에서 여러 서비스를 구분하는 번호입니다(IP 주소가 건물 주소라면 포트는 호실 번호). SSH의 기본 포트는 <mark>22</mark>입니다. (웹 80·443, <a data-lesson="d09"></a>에서 자세히)</p>
<h3>인증 방법 두 가지</h3>
<ol><li><b>비밀번호</b>: 간단하지만 무작위로 계속 대입하는 공격(Brute Force)에 약합니다. 인터넷에 열린 서버의 <code>/var/log/secure</code>를 보면 이런 시도가 끊임없이 찍혀 있습니다.</li><li><b>키(Key) 인증</b>: 실무와 클라우드의 표준. 비밀번호 로그인을 아예 꺼 두는 경우가 많습니다.</li></ol>
<h3>키 인증의 원리: 공개키와 개인키</h3>
<p><b>공개키</b>와 <b>개인키</b>는 한 쌍으로 만들어집니다. 공개키는 여러 서버에 등록해도 괜찮습니다(공개해도 됨). 하지만 개인키는 나만 가지고 있어야 합니다. 접속할 때 서버가 "이 공개키와 짝인 개인키를 가졌는지 증명해 봐"라고 문제를 내고, 내 PC가 개인키로 답을 만들어 보냅니다. 개인키 자체는 네트워크로 전송되지 않습니다.</p>
<div class="box analogy"><span class="lbl">비유로 보면</span><b>공개키는 자물쇠</b>, <b>개인키는 그 자물쇠에 맞는 유일한 열쇠</b>입니다. 자물쇠는 여러 개 복사해서 여러 서버 문에 달아도 괜찮지만, 열쇠는 나만 가지고 있어야 합니다.</div>
<div class="flow"><div class="n"><b>내 PC</b><small>~/.ssh/id_ed25519 (개인키, 600)</small></div><span class="ar">SSH →</span><div class="n k"><b>서버</b><small>~/.ssh/authorized_keys에<br>공개키 등록 (600)</small></div></div>
<pre class="code">ssh-keygen -t ed25519                <span class="c"># 내 PC에서 키 한 쌍 만들기 → id_ed25519(개인키), id_ed25519.pub(공개키)</span>
ssh-copy-id trainee@10.0.1.10        <span class="c"># 내 공개키를 서버의 authorized_keys에 자동 등록 (처음 한 번은 비밀번호 필요)</span>
ssh trainee@10.0.1.10                <span class="c"># 이후로는 키로 접속</span></pre>
<h3>SSH 관련 파일과 권한</h3>
<div class="tbl-wrap"><table><thead><tr><th>위치</th><th>파일</th><th>권한</th><th>내용</th></tr></thead><tbody>
<tr><td>내 PC</td><td><code>~/.ssh/id_ed25519</code></td><td><b>600</b></td><td>개인키. 너무 열려 있으면 SSH가 사용을 거부</td></tr>
<tr><td>내 PC</td><td><code>~/.ssh/known_hosts</code></td><td>644</td><td>접속해 본 서버들의 지문</td></tr>
<tr><td>서버</td><td><code>~/.ssh/</code></td><td><b>700</b></td><td>디렉터리 자체</td></tr>
<tr><td>서버</td><td><code>~/.ssh/authorized_keys</code></td><td><b>600</b></td><td>접속을 허락할 공개키 목록</td></tr>
<tr><td>서버</td><td><code>/etc/ssh/sshd_config</code></td><td>600</td><td>SSH 서버 설정</td></tr>
</tbody></table></div>
<h3>처음 접속할 때 나오는 질문</h3>
<pre class="code">The authenticity of host '10.0.1.10' can't be established.
ED25519 key fingerprint is SHA256:abc123...
Are you sure you want to continue connecting (yes/no)? <span class="c">← 처음 보는 서버가 맞는지 묻는 것. yes → known_hosts에 저장</span></pre>
<p>나중에 같은 IP인데 지문이 바뀌면 <code>WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!</code> 경고가 뜹니다. 서버를 새로 만들었다면 정상이고, 아니라면 중간에서 누가 가로채는 것일 수 있으니 사수에게 확인합니다.</p>
<h3>sshd_config 주요 설정</h3>
<pre class="code">Port 22                      <span class="c"># 접속 포트</span>
PermitRootLogin no           <span class="c"># root로 직접 SSH 로그인 금지 (일반 계정 + sudo 사용)</span>
PasswordAuthentication no    <span class="c"># 비밀번호 로그인 금지, 키만 허용</span>
PubkeyAuthentication yes     <span class="c"># 키 인증 허용</span></pre>
<div class="box warn"><span class="lbl">설정을 바꿀 때 절대 규칙</span><p><code>sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak</code>으로 백업 → 수정 → <code>sudo sshd -t</code>로 문법 확인 → <code>sudo systemctl restart sshd</code> → <b>지금 창은 닫지 말고 새 창으로 접속되는지 확인</b>. 잘못 고친 채로 끊기면 다시 들어갈 방법이 없을 수 있습니다.</p></div>
<h3>파일 주고받기: scp</h3>
<pre class="code">scp ./app.conf trainee@10.0.1.10:/tmp/       <span class="c"># 내 PC → 서버</span>
scp trainee@10.0.1.10:/var/log/app.log ./    <span class="c"># 서버 → 내 PC</span></pre>
<h3>Windows에서 SSH 쓰기</h3>
<p>Windows 10/11의 PowerShell이나 터미널에서 <code>ssh</code> 명령을 바로 쓸 수 있습니다. 회사에 따라 PuTTY, MobaXterm, Xshell 같은 프로그램도 씁니다. 팀에서 쓰는 도구를 사수에게 물어보세요.</p>
<h3>클라우드와 연결하기</h3>
<p><a data-lesson="zc3"></a>에서 VM을 만들 때 <b>Key Pair</b>를 지정합니다. 클라우드가 VM을 만들면서 공개키를 VM 안의 authorized_keys에 넣어 주고, 나는 내려받은 개인키(.pem)로 <code>ssh -i</code> 접속합니다. 오늘 배운 원리 그대로입니다.</p>
<div class="box warn"><span class="lbl">접속이 안 될 때 흔한 원인 (<a data-lesson="zc4"></a>에서 꼭 다시 보기)</span><ul><li><code>Permission denied (publickey)</code>: 사용자명이 틀렸거나(이미지마다 기본 사용자가 다름: rocky, ubuntu 등), 다른 키를 썼거나, 개인키·authorized_keys 권한이 너무 열려 있음</li><li><code>Connection timed out</code>: 방화벽·Security Group에서 22번 포트가 막혀 있거나 IP가 틀림</li><li><code>Connection refused</code>: 서버에서 SSH 서비스(sshd)가 꺼져 있음 → <code>systemctl status sshd</code> (<a data-lesson="d05"></a>)</li></ul></div>

<h2 id="s8">실습 시나리오: 계정 생성부터 SSH 접속까지</h2>
<p>실무에서 자주 받는 요청입니다. <b>"신규 개발자 kim에게 서버 접속 권한을 주세요. 개발팀(dev) 공유 폴더 /srv/dev도 쓸 수 있게요."</b> 순서를 손노트에 그대로 적어 두세요.</p>
<pre class="code">sudo useradd kim                          <span class="c"># 1. 계정 만들기</span>
sudo groupadd dev                         <span class="c"># 2. 팀 그룹 만들기 (이미 있으면 생략)</span>
sudo usermod -aG dev kim                  <span class="c"># 3. kim을 dev 그룹에 추가 (-a 잊지 않기!)</span>
sudo mkdir -p /srv/dev                    <span class="c"># 4. 공유 디렉터리 만들기</span>
sudo chown root:dev /srv/dev              <span class="c"># 5. 그룹 소유를 dev로</span>
sudo chmod 770 /srv/dev                   <span class="c"># 6. 소유자·dev 그룹만 읽기·쓰기·들어가기</span>
sudo mkdir -p /home/kim/.ssh              <span class="c"># 7. kim의 SSH 디렉터리</span>
sudo vi /home/kim/.ssh/authorized_keys    <span class="c"># 8. kim에게 받은 "공개키"를 붙여 넣기</span>
sudo chmod 700 /home/kim/.ssh             <span class="c"># 9. 권한 맞추기</span>
sudo chmod 600 /home/kim/.ssh/authorized_keys
sudo chown -R kim:kim /home/kim/.ssh      <span class="c"># 10. 소유자를 kim으로</span>
id kim                                    <span class="c"># 11. 확인: dev 그룹에 들어갔나</span>
<span class="c"># 12. kim이 자기 PC에서: ssh kim@서버IP → 접속되면 완료</span></pre>
<p class="small muted"><code>vi</code>는 리눅스의 기본 텍스트 편집기입니다. 기본 사용법(i로 입력, Esc 후 :wq로 저장·종료)은 <a data-lesson="d07"></a> 전에 따로 연습해 두면 좋습니다.</p>

<h2 id="s9">직접 해 보기</h2>
<p>연습 터미널의 <b>"미션 B: 계정과 권한"</b>을 끝까지 하세요. 사용자 만들기, 권한 바꾸기, sudo 쓰기, 키 만들기를 실제처럼 해 볼 수 있습니다.</p>
<div class="btn-row"><a class="btn pri" href="#term">연습 터미널 열기 (미션 B)</a></div>
`,
summary:['명령어 [옵션] [대상]. Tab 자동완성, ↑ 이전 명령, Ctrl+C 중단, | 파이프, grep 글자 찾기.','pwd·ls·cd·mkdir·touch·cp·mv·rm·cat·less·tail·grep. rm은 되돌릴 수 없다 → pwd·ls로 먼저 확인.','계정: root(0) / 시스템 계정(1~999, nologin) / 일반(1000~). /etc/passwd·shadow·group.','그룹으로 권한을 묶어 준다. usermod -aG(-a 필수). sudo = 한 번만 관리자 권한 + 기록, wheel 그룹, visudo.','권한: 소유자/그룹/기타 × r4 w2 x1, 처음 해당하는 칸만 본다. 755·644·600·700. umask 022. chmod(소유자·root), chown(root만). 777 금지.','SSH 포트 22. 공개키 = 자물쇠(서버 authorized_keys 600), 개인키 = 열쇠(내 PC 600). PermitRootLogin no, PasswordAuthentication no. 설정 변경 후 새 창으로 확인.'],
essay:[
{q:'-rwxr-x--- 1 kim dev 2048 Nov 4 deploy.sh 를 읽고, kim, dev 그룹의 lee, 그 밖의 park이 각각 무엇을 할 수 있는지 설명해 보세요. 숫자로는 몇인가요?',a:'일반 파일(-)이다. 소유자 kim은 읽기·쓰기·실행(rwx=7), dev 그룹 소속 lee는 읽기·실행(r-x=5)만 가능하고 수정은 못 한다. 그 밖의 park은 아무것도 못 한다(---=0). 숫자로 750.'},
{q:'root, 시스템 계정, 일반 계정의 차이를 설명하고, 서비스(nginx 등)를 root가 아닌 시스템 계정으로 실행하는 이유를 말해 보세요.',a:'root는 UID 0으로 모든 권한을 가진 관리자다. 시스템 계정(UID 1~999)은 sshd, nginx처럼 서비스가 쓰는 계정으로 로그인 셸이 nologin이라 사람이 로그인할 수 없다. 일반 계정(UID 1000~)은 사람이 쓰는 계정이다. 서비스를 시스템 계정으로 돌리면 서비스가 해킹당해도 공격자가 그 계정 권한 안에서만 움직일 수 있어 피해가 줄어든다.'},
{q:'root로 항상 작업하면 안 되는 이유와, 실무에서 sudo를 쓰는 이유를 설명하고, 사용자를 sudo 가능하게 만드는 방법을 말해 보세요.',a:'root는 권한 제한 없이 모든 파일을 고치고 지울 수 있어서, 오타 하나로 시스템 전체를 망가뜨릴 수 있다. sudo를 쓰면 평소에는 일반 사용자로 안전하게 작업하다가 필요한 명령 한 번만 관리자 권한으로 실행하고, 누가 언제 무엇을 실행했는지 /var/log/secure에 기록이 남는다. Red Hat 계열은 sudo usermod -aG wheel 사용자 로 wheel 그룹에 넣으면 sudo를 쓸 수 있다(sudoers의 %wheel 설정).'},
{q:'SSH 키 인증의 원리를 설명하고, 관련 파일의 위치와 권한을 말해 보세요.',a:'공개키와 개인키는 한 쌍이다. 공개키를 서버의 ~/.ssh/authorized_keys에 등록해 두면, 접속할 때 서버가 낸 문제를 내 PC가 개인키로 풀어 증명하고 접속된다. 개인키는 네트워크로 보내지 않는다. 내 PC의 개인키는 600, 서버의 ~/.ssh 디렉터리는 700, authorized_keys는 600으로 둔다. 개인키는 메신저나 메일로 절대 보내지 않는다. (비유: 공개키는 자물쇠, 개인키는 그 자물쇠에 맞는 열쇠)'},
{q:'신규 직원 kim에게 서버 접속 권한과 팀 공유 디렉터리(/srv/dev) 쓰기 권한을 주는 절차를 순서대로 말해 보세요.',a:'① sudo useradd kim ② sudo groupadd dev(없으면) ③ sudo usermod -aG dev kim ④ sudo mkdir -p /srv/dev ⑤ sudo chown root:dev /srv/dev ⑥ sudo chmod 770 /srv/dev ⑦ /home/kim/.ssh 를 만들고 kim의 공개키를 authorized_keys에 넣기 ⑧ .ssh는 700, authorized_keys는 600, 소유자는 kim으로 ⑨ id kim으로 그룹 확인 ⑩ kim이 ssh kim@서버IP로 접속 확인.'}
],
quiz:[
{v:[
 {q:'ls -l 결과가 -rw-r--r-- 일 때, "그룹"의 권한은?',o:['읽기만 가능','읽기와 쓰기 가능','모든 권한','아무 권한 없음'],e:'첫 글자(-) 다음 3글자씩 소유자(rw-) / 그룹(r--) / 기타(r--)입니다.'},
 {q:'ls -l 결과가 -rwxr-x--- 일 때, "기타 사용자"의 권한은?',o:['아무 권한 없음','읽기만 가능','읽기와 실행 가능','모든 권한'],e:'첫 글자 다음 3글자씩 소유자(rwx), 그룹(r-x), 기타(---)입니다. 기타는 아무 권한이 없습니다.'}
]},
{gen(){
  const pick=a=>a[Math.floor(Math.random()*a.length)];
  const R=['---','--x','-w-','-wx','r--','r-x','rw-','rwx'], s=n=>n.split('').map(d=>R[+d]).join('');
  const n=pick(['755','644','600','700','750','640','775','664']), d=n.split('').map(Number), f=a=>a.join('');
  const w=[...new Set([f([d[2],d[1],d[0]]), f(d.map(x=>x===5?6:x===6?5:x)), f(d.map(x=>x%2?x-1:x)), f(d.map(x=>x%2?x:x+1)), f([d[0],d[0],d[0]]), f([d[0],0,0]), '777'])].filter(x=>x!==n).slice(0,3);
  const e=d.map(x=>x+' = '+R[x]).join(', ')+'. 앞자리부터 소유자·그룹·기타입니다.';
  if(Math.random()<0.5) return {q:'chmod '+n+' file 을 실행한 뒤 ls -l 에 보이는 권한(소유자·그룹·기타 순서)은? (r=4, w=2, x=1)',o:[s(n)].concat(w.map(s)),e:e};
  return {q:'권한 '+s(n)+' 을 숫자로 나타내면? (r=4, w=2, x=1, 소유자·그룹·기타 순서)',o:[n].concat(w),e:e};
}},
{v:[
 {q:'SSH 개인키 파일에 권장되는 권한은?',o:['600','777','755','644'],e:'나만 읽고 쓰기. 권한이 너무 열려 있으면 SSH가 키 사용을 거부합니다.'},
 {q:'서버의 ~/.ssh/authorized_keys 파일에 권장되는 권한은?',o:['600','777','755','644'],e:'authorized_keys는 600, ~/.ssh 디렉터리는 700, 내 PC의 개인키도 600입니다. 너무 열려 있으면 SSH가 사용을 거부합니다.'}
]},
{v:[
 {q:'파일의 소유자를 바꾸는 명령과, 그것을 실행할 수 있는 사람은?',o:['chown, root만','chmod, 누구나','chown, 파일 소유자','mv, root만'],e:'chown은 root만 할 수 있습니다. 권한(r/w/x)을 바꾸는 chmod는 소유자나 root가 할 수 있습니다.'},
 {q:'파일의 소유자와 그룹을 바꾸는 명령은?',o:['chown','chmod','chgrp만 가능하다','mv'],e:'chown 사용자:그룹 파일 로 소유자와 그룹을 바꿉니다. chmod는 권한(rwx)을 바꿉니다.'}
]},
{v:[
 {q:'일반 사용자가 특정 명령 하나만 관리자 권한으로 실행하고, 기록도 남는 방법은?',o:['sudo','su -','root로 SSH 로그인','chmod 777'],e:'sudo는 명령 한 번만 관리자 권한으로 실행하고 /var/log/secure에 기록이 남습니다.'},
 {q:'sudo와 su - 의 차이로 맞는 것은?',o:['sudo는 명령 한 번만 관리자 권한으로 실행하고 기록이 남고, su - 는 다른 사용자로 아예 전환한다','sudo는 다른 사용자로 아예 전환하고, su - 는 명령 한 번만 실행한다','둘 다 같은 기능이다','sudo는 root만 쓸 수 있다'],e:'실무에서는 root로 전환하지 않고, 필요한 명령에만 sudo를 씁니다. 누가 언제 무엇을 했는지 기록이 남습니다.'}
]},
{v:[
 {q:'Rocky Linux에서 사용자를 sudo 가능하게 만들려면 보통 어느 그룹에 넣나요?',o:['wheel','root','nobody','users'],e:'Red Hat 계열은 wheel, Ubuntu는 sudo 그룹입니다.'},
 {q:'Ubuntu에서 사용자를 sudo 가능하게 만들려면 보통 어느 그룹에 넣나요?',o:['sudo','wheel','root','users'],e:'Ubuntu는 sudo 그룹, Red Hat 계열(Rocky 등)은 wheel 그룹입니다.'}
]},
{v:[
 {q:'nginx, sshd처럼 서비스가 쓰는 계정의 특징은?',o:['사람이 로그인할 수 없게 nologin 셸로 막혀 있다','UID가 0이다','모든 파일을 읽을 수 있다','비밀번호가 반드시 있다'],e:'시스템 계정은 UID 1~999, 로그인 불가. 해킹돼도 피해를 줄이기 위해서입니다.'},
 {q:'nginx 같은 서비스를 root가 아닌 전용 시스템 계정으로 실행하는 이유는?',o:['서비스가 해킹돼도 피해를 그 계정의 권한 안으로 줄이기 위해','서비스 속도를 높이기 위해','로그를 남기지 않기 위해','비밀번호를 쓰지 않기 위해'],e:'시스템 계정은 권한이 좁고 로그인도 막혀 있어서, 서비스가 뚫려도 시스템 전체로 피해가 번지지 않습니다.'}
]},
{v:[
 {q:'/etc/passwd의 trainee:x:1000:1000:...:/home/trainee:/bin/bash 에서 x의 의미는?',o:['비밀번호는 /etc/shadow에 따로 저장되어 있다','비밀번호가 x다','계정이 잠겼다','실행 권한이 있다'],e:'/etc/passwd는 누구나 읽을 수 있어서, 암호화된 비밀번호는 root만 읽는 /etc/shadow에 둡니다.'},
 {q:'암호화된 비밀번호가 저장되는 파일은?',o:['/etc/shadow','/etc/passwd','/etc/group','/etc/sudoers'],e:'/etc/passwd에는 계정 목록만 있고 비밀번호 자리는 x입니다. 암호화된 비밀번호는 root만 읽을 수 있는 /etc/shadow에 있습니다.'}
]},
{v:[
 {q:'SSH의 기본 포트 번호는?',o:['22','80','443','3306'],e:'80은 HTTP, 443은 HTTPS, 3306은 MySQL의 기본 포트입니다.'},
 {q:'SSH로 접속할 때 기본 포트(22)가 아닌 포트를 지정하는 옵션은?',o:['-p','-i','-l','-v'],e:'예: ssh -p 2222 trainee@10.0.1.10. -i는 개인키 파일을 지정하는 옵션입니다.'}
]},
{v:[
 {q:'SSH 키 인증에서 서버의 ~/.ssh/authorized_keys에 등록하는 것은?',o:['공개키','개인키','비밀번호','인증서는 필요 없다'],e:'서버의 authorized_keys에는 공개키를 등록하고, 개인키는 내 PC에만 둡니다. (비유: 서버에 자물쇠를 달고 열쇠는 내가 보관)'},
 {q:'SSH 키 인증에서 내 PC에만 두고 네트워크로 보내지 않는 것은?',o:['개인키','공개키','authorized_keys 파일','known_hosts 파일'],e:'개인키는 나만 가지고 있어야 하고 전송되지 않습니다. 공개키는 서버의 authorized_keys에 등록합니다.'}
]},
{v:[
 {q:'디렉터리에 x(실행) 권한이 있다는 것의 의미는?',o:['cd로 그 디렉터리 안에 들어갈 수 있다','디렉터리를 프로그램처럼 실행할 수 있다','디렉터리를 삭제할 수 있다','아무 의미 없다'],e:'디렉터리의 x는 "들어가기", r은 "목록 보기", w는 "안에 만들기·지우기"입니다.'},
 {q:'디렉터리에 r(읽기) 권한이 있다는 것의 의미는?',o:['ls로 그 안의 목록을 볼 수 있다','cd로 그 안에 들어갈 수 있다','그 안에 파일을 만들 수 있다','디렉터리를 실행할 수 있다'],e:'디렉터리의 r은 "목록 보기", x는 "들어가기", w는 "안에 만들기·지우기"입니다.'}
]},
{v:[
 {q:'sudo usermod -G dev kim 처럼 -a 를 빼먹으면?',o:['kim의 기존 보조 그룹이 지워지고 dev만 남을 수 있다','아무 차이 없다','kim 계정이 삭제된다','dev 그룹이 삭제된다'],e:'-a(append)가 있어야 기존 그룹을 유지한 채 추가합니다. wheel에서 빠지면 sudo도 못 쓰게 됩니다.'},
 {q:'kim의 기존 보조 그룹은 유지하면서 dev 그룹에 추가하는 명령은?',o:['sudo usermod -aG dev kim','sudo usermod -G dev kim','sudo useradd dev kim','sudo groupadd dev kim'],e:'-a(append)를 붙여야 기존 보조 그룹이 유지됩니다. -G만 쓰면 기존 보조 그룹이 지워질 수 있습니다.'}
]},
{v:[
 {q:'umask가 022일 때 새로 만든 일반 파일의 권한은?',o:['644','755','666','600'],e:'파일 요청값 666에서 022에 해당하는 w 권한(그룹·기타)을 끄면 644입니다. 디렉터리는 777에서 같은 권한을 끄면 755입니다.'},
 {q:'umask가 022일 때 새로 만든 디렉터리의 권한은?',o:['755','644','777','700'],e:'디렉터리 요청값 777에서 022에 해당하는 w 권한(그룹·기타)을 끄면 755입니다. 일반 파일은 666에서 같은 권한을 끄면 644입니다.'}
]},
{v:[
 {q:'sshd_config를 고친 뒤 가장 안전한 행동은?',o:['sshd -t로 문법 확인 → 재시작 → 기존 창은 유지한 채 새 창으로 접속 확인','바로 재부팅한다','기존 접속을 먼저 끊고 다시 접속해 본다','chmod 777로 바꾼다'],e:'설정이 잘못됐는데 기존 창까지 끊기면 서버에 다시 들어갈 방법이 없을 수 있습니다.'},
 {q:'sshd_config를 고친 뒤 문법이 맞는지 확인하는 명령은?',o:['sudo sshd -t','sudo systemctl stop sshd','sudo reboot','sudo rm /etc/ssh/sshd_config'],e:'sshd -t로 문법을 확인한 뒤 재시작하고, 기존 창은 유지한 채 새 창으로 접속되는지 확인합니다.'}
]},
{v:[
 {q:'"안 되면 일단 chmod 777"이 나쁜 이유는?',o:['누구나 파일을 읽고 고치고 지울 수 있게 되어 보안이 무너진다','파일이 삭제된다','속도가 느려진다','root만 쓸 수 있게 된다'],e:'최소 권한 원칙: 필요한 사람에게 필요한 권한만 줍니다.'},
 {q:'chmod 777 file 의 의미는?',o:['소유자·그룹·기타 모두에게 읽기·쓰기·실행을 허용한다','소유자만 모든 권한을 갖는다','아무도 접근할 수 없다','읽기만 허용한다'],e:'7 = rwx를 세 자리 모두 주는 것이라 누구나 읽고 고치고 지울 수 있습니다. 그래서 보안상 위험합니다.'}
]},
{v:[
 {q:'지금 내가 있는 위치(현재 디렉터리)를 보여 주는 명령은?',o:['pwd','ls','cd','whoami'],e:'pwd = print working directory. ls는 목록, cd는 이동, whoami는 나는 누구인지 보여 줍니다.'},
 {q:'디렉터리를 만드는 명령은?',o:['mkdir','touch','cd','rm'],e:'mkdir = make directory. touch는 빈 파일을 만듭니다.'},
 {q:'파일을 복사하는 명령은?',o:['cp','mv','rm','cat'],e:'cp = copy. mv는 이동·이름 바꾸기, rm은 삭제, cat은 내용 출력입니다.'}
]},
{v:[
 {q:'파일의 뒷부분만 보는 명령으로, 최신 로그를 확인할 때 많이 쓰는 것은?',o:['tail','head','less','echo'],e:'로그는 최신 내용이 뒤에 쌓이므로 tail을 많이 씁니다. tail -f는 실시간으로 계속 봅니다. head는 앞부분입니다.'},
 {q:'파일에서 특정 글자가 들어간 줄만 찾아 보여 주는 명령은?',o:['grep','cat','tail','history'],e:'예: grep -i error /var/log/messages. -i는 대소문자 무시, -v는 그 글자가 없는 줄만 봅니다.'}
]},
{v:[
 {q:'실행 중인 명령을 강제로 멈추는 키는?',o:['Ctrl + C','Tab','↑','q'],e:'Ctrl + C는 실행 중인 명령을 멈춥니다. Tab은 자동 완성, ↑는 이전 명령 불러오기입니다.'},
 {q:'파일·명령 이름을 자동 완성해 주는 키는?',o:['Tab','Ctrl + C','Enter','Esc'],e:'Tab으로 자동 완성하면 오타를 줄일 수 있습니다.'}
]},
{v:[
 {q:'사용자 kim을 새로 만드는 명령은?',o:['sudo useradd kim','sudo passwd kim','sudo userdel kim','sudo groupadd kim'],e:'useradd는 사용자를 만들고(홈 /home/kim, 같은 이름의 기본 그룹도 생성), passwd는 비밀번호를 설정합니다.'},
 {q:'사용자 kim의 비밀번호를 설정하는 명령은?',o:['sudo passwd kim','sudo useradd kim','sudo chown kim','sudo id kim'],e:'비밀번호를 설정하기 전에는 비밀번호로 로그인할 수 없습니다.'}
]}
]
});
