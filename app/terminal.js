/* 연습 터미널 (가상 Rocky Linux 9) + 미션 A~D. reference_학습장.html 에서 그대로 이전. */
const MISSION_OF = { d03: 'a', d04: 'b', d05: 'c', d06: 'd' };

const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const KB = 1024, MB = 1024 ** 2, GB = 1024 ** 3;
const nowHM = () => { const d = new Date(); return pad(d.getHours()) + ':' + pad(d.getMinutes()); };
const nowHMS = () => { const d = new Date(); return pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()); };
const stamp = () => { const d = new Date(); return MON[d.getMonth()] + ' ' + String(d.getDate()).padStart(2, ' ') + ' ' + nowHM(); };
const jstamp = () => { const d = new Date(); return MON[d.getMonth()] + ' ' + pad(d.getDate()) + ' ' + nowHMS(); };
const D0 = 'Nov  1 09:00';
const mkD = (o, g, p, c) => ({ t: 'd', o, g, p, c: c || {}, m: D0 });
const mkF = (o, g, p, x, extra) => Object.assign({ t: 'f', o, g, p, x: x || '', m: D0 }, extra || {});
const R = (p, c) => mkD('root', 'root', p || '755', c);
const RF = (p, x, extra) => mkF('root', 'root', p, x, extra);
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); });
const UUID_ROOT = '9b2f4c1a-6d3e-4f8a-b1c2-7e5d3a9f0b14', UUID_BOOT = '4e7a1c92-0d5b-4a3f-8e61-2c9b7f1d3a58';

function initFS() {
  const dev = (name, g) => mkF('root', g || 'disk', '660', '', { dev: true });
  return R('755', {
    bin: R('755', { bash: RF('755', '(실행 파일: bash 셸)'), ls: RF('755', '(실행 파일)'), cat: RF('755', '(실행 파일)'), ps: RF('755', '(실행 파일)') }),
    sbin: R('755', { useradd: RF('755', '(관리자용 실행 파일)'), 'mkfs.xfs': RF('755', '(관리자용 실행 파일)'), reboot: RF('755', '(관리자용 실행 파일)') }),
    boot: R('555', { 'vmlinuz-5.14.0-427.el9.x86_64': RF('755', '(리눅스 커널 파일)'), 'initramfs-5.14.0-427.el9.x86_64.img': RF('600', '(initramfs)'), grub2: R('700', { 'grub.cfg': RF('600', '# 부트로더(GRUB2) 설정 파일\n') }) }),
    dev: R('755', { vda: dev(), vda1: dev(), vda2: dev(), vdb: dev(), null: mkF('root', 'root', '666', '', { dev: true }) }),
    etc: R('755', {
      hostname: RF('644', 'ojt-web01\n'),
      hosts: RF('644', '127.0.0.1   localhost\n10.0.1.10   ojt-web01\n10.0.2.20   ojt-db01\n'),
      'resolv.conf': RF('644', 'nameserver 10.0.0.2\n'),
      passwd: RF('644', 'root:x:0:0:root:/root:/bin/bash\nsshd:x:74:74:Privilege-separated SSH:/usr/share/empty.sshd:/sbin/nologin\nchrony:x:992:992:chrony system user:/var/lib/chrony:/sbin/nologin\nnginx:x:991:991:Nginx web server:/var/lib/nginx:/sbin/nologin\ntrainee:x:1000:1000:OJT Trainee:/home/trainee:/bin/bash\n'),
      shadow: RF('000', 'root:$6$...(암호화된 비밀번호)...\n'),
      group: RF('644', 'root:x:0:\nwheel:x:10:trainee\nnginx:x:991:\ntrainee:x:1000:\n'),
      sudoers: RF('440', '%wheel  ALL=(ALL)  ALL\n'),
      'os-release': RF('644', 'NAME="Rocky Linux"\nVERSION="9.4 (Blue Onyx)"\nID="rocky"\nPRETTY_NAME="Rocky Linux 9.4 (Blue Onyx)"\n'),
      fstab: RF('644', '# /etc/fstab : 부팅 때 자동으로 연결할 파일시스템 목록\n# <장치>                                   <마운트포인트> <종류> <옵션>   <dump> <fsck>\nUUID=' + UUID_ROOT + '  /       xfs     defaults  0 0\nUUID=' + UUID_BOOT + '  /boot   xfs     defaults  0 0\n'),
      ssh: R('755', { sshd_config: RF('600', 'Port 22\nPermitRootLogin no\nPubkeyAuthentication yes\nPasswordAuthentication no\n') }),
      systemd: R('755', { system: R('755', { 'multi-user.target.wants': R('755', {}) }) }),
      nginx: R('755', { 'nginx.conf': RF('644', 'user nginx;\nworker_processes auto;\nhttp {\n    server {\n        listen 80;\n        root /usr/share/nginx/html;\n    }\n}\n') })
    }),
    home: R('755', {
      trainee: mkD('trainee', 'trainee', '700', {
        'memo.txt': mkF('trainee', 'trainee', '644', 'OJT 2주차: 리눅스 명령어 연습 중!\n모르는 건 질문 노트에 적기.\n'),
        '.bashrc': mkF('trainee', 'trainee', '644', '# 셸 설정 파일 (점으로 시작하면 숨김 파일)\nalias ll=\'ls -l\'\n'),
        '.ssh': mkD('trainee', 'trainee', '700', { authorized_keys: mkF('trainee', 'trainee', '600', 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAA...(공개키=자물쇠) trainee@laptop\n') })
      })
    }),
    root: R('550', { 'secret.txt': RF('600', 'root만 볼 수 있는 파일입니다.\n') }),
    tmp: R('777', {}),
    usr: R('755', { bin: R('755', {}), share: R('755', { nginx: R('755', { html: R('755', { 'index.html': RF('644', '<h1>Welcome to nginx on Rocky Linux</h1>\n') }) }) }), lib: R('755', { systemd: R('755', { system: R('755', { 'nginx.service': RF('644', '[Unit]\nDescription=The nginx HTTP and reverse proxy server\n[Service]\nExecStart=/usr/sbin/nginx\n[Install]\nWantedBy=multi-user.target\n'), 'sshd.service': RF('644', '[Unit]\nDescription=OpenSSH server daemon\n[Service]\nExecStart=/usr/sbin/sshd -D\n[Install]\nWantedBy=multi-user.target\n') }) }) }) }),
    var: R('755', {
      lib: R('755', {}),
      log: R('755', {
        messages: RF('600', 'Nov  4 09:00:01 ojt-web01 systemd[1]: Started OpenSSH server daemon.\nNov  4 09:00:02 ojt-web01 systemd[1]: Reached target Multi-User System.\nNov  4 11:47:10 ojt-web01 systemd[1]: Failed to start dnf-makecache.service - dnf makecache.\n'),
        'messages-20261101': RF('600', '(지난주 로그를 날짜별로 잘라 둔 파일. logrotate가 만듦)\n', { sz: 1288490188 }),
        secure: RF('600', 'Nov  4 09:12:01 ojt-web01 sshd[1021]: Accepted publickey for trainee from 10.0.0.25 port 51234 ssh2\nNov  4 09:20:13 ojt-web01 sshd[2210]: Failed password for invalid user admin from 203.0.113.50 port 40022 ssh2\nNov  4 09:20:16 ojt-web01 sshd[2210]: Failed password for invalid user admin from 203.0.113.50 port 40031 ssh2\nNov  4 09:20:19 ojt-web01 sshd[2212]: Failed password for root from 203.0.113.50 port 40044 ssh2\nNov  4 12:40:05 ojt-web01 sshd[3305]: Accepted publickey for trainee from 10.0.0.25 port 52211 ssh2\n'),
        'secure-20261101': RF('600', '(지난주 인증 로그)\n', { sz: 3460300 }),
        cron: RF('600', 'Nov  4 12:00:01 ojt-web01 CROND[3011]: (root) CMD (run-parts /etc/cron.hourly)\n'),
        'dnf.log': RF('644', '2026-11-01T09:30:00+0900 INFO 패키지 설치: nginx-1.20.1\n', { sz: 812000 }),
        journal: R('755', { 'system.journal': RF('640', '(systemd 저널 데이터. journalctl로 읽음)', { sz: 58720256 }) }),
        nginx: R('755', { 'access.log': RF('644', ''), 'error.log': RF('644', '') })
      })
    }),
    opt: R('755', {}), mnt: R('755', {}), run: R('755', {}),
    proc: R('555', { cpuinfo: RF('444', 'processor\t: 0\nmodel name\t: Intel Xeon Processor (Icelake)\nprocessor\t: 1\nmodel name\t: Intel Xeon Processor (Icelake)\n'), meminfo: RF('444', 'MemTotal:        4026532 kB\nMemFree:         1679872 kB\nMemAvailable:    2540456 kB\n') })
  });
}
function initT() {
  const P = (pid, ppid, user, cmd, o) => Object.assign({ pid, ppid, user, cmd, cpu: 0, mem: 0.1, vsz: 16000, rss: 6000, tty: '?', stat: 'Ss', start: 'Nov01', time: '0:00' }, o || {});
  return {
    fs: initFS(), cwd: '/home/trainee', rootShell: false, sudoed: false, hist: [], hi: -1, out: [], nextPid: 5120, stressOn: true,
    users: { root: { uid: 0, home: '/root' }, sshd: { uid: 74, home: '/usr/share/empty.sshd' }, chrony: { uid: 992, home: '/var/lib/chrony' }, nginx: { uid: 991, home: '/var/lib/nginx' }, trainee: { uid: 1000, home: '/home/trainee' } },
    groups: { root: { gid: 0, m: [] }, wheel: { gid: 10, m: ['trainee'] }, sshd: { gid: 74, m: [] }, chrony: { gid: 992, m: [] }, nginx: { gid: 991, m: [] }, disk: { gid: 6, m: [] }, trainee: { gid: 1000, m: [] } },
    procs: [
      P(1, 0, 'root', '/usr/lib/systemd/systemd --switched-root --system', { vsz: 171820, rss: 13420, time: '0:04' }),
      P(2, 0, 'root', '[kthreadd]', { vsz: 0, rss: 0, stat: 'S', mem: 0 }),
      P(612, 1, 'root', '/usr/lib/systemd/systemd-journald', { rss: 14200, mem: 0.3 }),
      P(801, 1, 'root', '/usr/sbin/rsyslogd -n', { svc: 'rsyslog', rss: 5200 }),
      P(845, 1, 'chrony', '/usr/sbin/chronyd -F 2', { svc: 'chronyd', stat: 'S', rss: 3100 }),
      P(870, 1, 'root', '/usr/sbin/crond -n', { svc: 'crond', rss: 3500 }),
      P(902, 1, 'root', '/usr/bin/python3 -s /usr/sbin/firewalld --nofork --nopid', { svc: 'firewalld', vsz: 129000, rss: 41000, mem: 1.0, time: '0:02' }),
      P(1021, 1, 'root', 'sshd: /usr/sbin/sshd -D [listener] 0 of 10-100 startups', { svc: 'sshd', rss: 9020, mem: 0.2 }),
      P(3305, 1021, 'root', 'sshd: trainee [priv]', { start: '12:40', rss: 10900, mem: 0.3 }),
      P(3310, 3305, 'trainee', 'sshd: trainee@pts/0', { start: '12:40', stat: 'S', rss: 6800 }),
      P(3311, 3310, 'trainee', '-bash', { tty: 'pts/0', start: '12:40', stat: 'Ss', vsz: 8400, rss: 5200 }),
      P(4120, 3311, 'trainee', 'stress-test --cpu 1', { tty: 'pts/0', start: '12:51', stat: 'R', cpu: 97.8, mem: 0.0, vsz: 7600, rss: 1200, time: '12:41', stress: true })
    ],
    svcs: {
      sshd: { desc: 'OpenSSH server daemon', active: true, enabled: true, pid: 1021, since: 'Sun 2026-11-01 09:00:01 KST', ago: '3 days ago' },
      crond: { desc: 'Command Scheduler', active: true, enabled: true, pid: 870, since: 'Sun 2026-11-01 09:00:01 KST', ago: '3 days ago' },
      chronyd: { desc: 'NTP client/server', active: true, enabled: true, pid: 845, since: 'Sun 2026-11-01 09:00:01 KST', ago: '3 days ago' },
      firewalld: { desc: 'firewalld - dynamic firewall daemon', active: true, enabled: true, pid: 902, since: 'Sun 2026-11-01 09:00:01 KST', ago: '3 days ago' },
      rsyslog: { desc: 'System Logging Service', active: true, enabled: true, pid: 801, since: 'Sun 2026-11-01 09:00:01 KST', ago: '3 days ago' },
      nginx: { desc: 'The nginx HTTP and reverse proxy server', active: false, enabled: false, pid: null, since: null }
    },
    journal: [
      { t: 'Nov 01 09:00:00', u: 'kernel', id: 'kernel', m: 'Linux version 5.14.0-427.el9.x86_64 (Rocky Linux 9.4)', p: 6 },
      { t: 'Nov 01 09:00:01', u: 'sshd', id: 'systemd[1]', m: 'Started OpenSSH server daemon.', p: 6 },
      { t: 'Nov 01 09:00:01', u: 'crond', id: 'systemd[1]', m: 'Started Command Scheduler.', p: 6 },
      { t: 'Nov 01 09:00:02', u: 'firewalld', id: 'firewalld[902]', m: 'WARNING: AllowZoneDrifting is enabled. This is considered an insecure configuration option.', p: 4 },
      { t: 'Nov 01 09:00:02', u: 'systemd', id: 'systemd[1]', m: 'Reached target Multi-User System.', p: 6 },
      { t: 'Nov 04 09:12:01', u: 'sshd', id: 'sshd[1021]', m: 'Accepted publickey for trainee from 10.0.0.25 port 51234 ssh2', p: 6 },
      { t: 'Nov 04 09:20:13', u: 'sshd', id: 'sshd[2210]', m: 'Failed password for invalid user admin from 203.0.113.50 port 40022 ssh2', p: 4 },
      { t: 'Nov 04 09:20:19', u: 'sshd', id: 'sshd[2212]', m: 'Failed password for root from 203.0.113.50 port 40044 ssh2', p: 4 },
      { t: 'Nov 04 11:47:10', u: 'dnf-makecache', id: 'systemd[1]', m: 'Failed to start dnf-makecache.service - dnf makecache.', p: 3 },
      { t: 'Nov 04 12:40:05', u: 'sshd', id: 'sshd[3305]', m: 'Accepted publickey for trainee from 10.0.0.25 port 52211 ssh2', p: 6 }
    ],
    devs: {
      vda: { type: 'disk', size: 20 * GB, mm: '252:0' },
      vda1: { type: 'part', parent: 'vda', size: 1 * GB, fs: 'xfs', uuid: UUID_BOOT, mnt: '/boot', mm: '252:1', used: 220 * MB, cap: 1014 * MB },
      vda2: { type: 'part', parent: 'vda', size: 19 * GB, fs: 'xfs', uuid: UUID_ROOT, mnt: '/', mm: '252:2', used: 4.2 * GB, cap: 19 * GB },
      vdb: { type: 'disk', size: 10 * GB, fs: null, uuid: null, mnt: null, mm: '252:16' }
    }
  };
}
let T = initT();
let TMSET = 'a';

const curUser = () => T.rootShell ? 'root' : 'trainee';
const userGroups = u => [u].concat(Object.keys(T.groups).filter(g => T.groups[g].m.includes(u) && g !== u));
function norm(p, u) {
  const home = (T.users[u || curUser()] || T.users.trainee).home;
  if (p == null || p === '' || p === '~') return home;
  if (p.startsWith('~/')) p = home + p.slice(1);
  const parts = (p.startsWith('/') ? p : T.cwd + '/' + p).split('/');
  const st = [];
  parts.forEach(s => { if (!s || s === '.') return; if (s === '..') st.pop(); else st.push(s); });
  return '/' + st.join('/');
}
function getNode(abs) { if (abs === '/') return T.fs; let n = T.fs; for (const s of abs.split('/').filter(Boolean)) { if (!n || n.t !== 'd') return null; n = n.c[s]; } return n || null; }
const splitP = abs => { const i = abs.lastIndexOf('/'); return [i <= 0 ? '/' : abs.slice(0, i), abs.slice(i + 1)]; };
function can(n, bit, u) { if (u === 'root') return true; const d = n.o === u ? n.p[0] : userGroups(u).includes(n.g) ? n.p[1] : n.p[2]; return (parseInt(d, 8) & bit) !== 0; }
function travOk(abs, u) { if (u === 'root') return true; let n = T.fs; for (const s of abs.split('/').filter(Boolean)) { if (!n || n.t !== 'd') return true; if (!can(n, 1, u)) return false; n = n.c[s]; } return true; }
function look(p, u) { const abs = norm(p, u); return { abs, node: getNode(abs), denied: !travOk(abs, u) }; }
const symP = n => (n.t === 'd' ? 'd' : n.dev ? 'b' : '-') + n.p.split('').map(d => { d = parseInt(d, 8); return (d & 4 ? 'r' : '-') + (d & 2 ? 'w' : '-') + (d & 1 ? 'x' : '-'); }).join('');
const fsize = n => n.t === 'd' ? 4096 : (n.sz != null ? n.sz : new TextEncoder().encode(n.x).length);
function hum(b) { const u = ['', 'K', 'M', 'G', 'T']; let i = 0, v = b; while (v >= 1024 && i < 4) { v /= 1024; i++; } if (i === 0) return v ? '4.0K' : '0'; const r = Math.ceil(v * 10) / 10; return (r < 10 ? r.toFixed(1) : String(Math.ceil(v))) + u[i]; }
function humSort(s) { const m = String(s).trim().match(/^([\d.]+)([KMGT]?)/); if (!m) return 0; return parseFloat(m[1]) * ({ '': 1, K: KB, M: MB, G: GB, T: GB * 1024 }[m[2]]); }
const plainText = h => h.replace(/<[^>]+>/g, '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');

function tokenize(line) {
  const out = []; let cur = '', q = null, has = false;
  const push = () => { if (cur || has) { out.push(cur); cur = ''; has = false; } };
  for (const ch of line) {
    if (q) { if (ch === q) q = null; else cur += ch; }
    else if (ch === '"' || ch === "'") { q = ch; has = true; }
    else if (/\s/.test(ch)) push();
    else if (ch === '>') { if (cur === '2') { cur = ''; out.push('2>'); continue; } push(); if (out[out.length - 1] === '>') out[out.length - 1] = '>>'; else out.push('>'); }
    else cur += ch;
  }
  push(); return out;
}
function splitPipe(line) { const segs = []; let cur = '', q = null; for (const ch of line) { if (q) { if (ch === q) q = null; cur += ch; } else if (ch === '"' || ch === "'") { q = ch; cur += ch; } else if (ch === '|') { segs.push(cur); cur = ''; } else cur += ch; } segs.push(cur); return segs.map(s => s.trim()); }
function expandGlob(tk, u) {
  const out = [];
  tk.forEach((t, i) => {
    if (i === 0 || !t.includes('*') || t.startsWith('-')) { out.push(t); return; }
    const abs = norm(t, u); const [dir, pat] = splitP(abs); const dn = getNode(dir);
    if (!dn || dn.t !== 'd' || !travOk(dir, u) || !can(dn, 4, u)) { out.push(t); return; }
    const re = new RegExp('^' + pat.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
    const base = t.slice(0, t.length - pat.length);
    const m = Object.keys(dn.c).filter(k => !k.startsWith('.') && re.test(k)).sort();
    if (m.length) m.forEach(k => out.push(base + k)); else out.push(t);
  });
  return out;
}

const MAN = {
  pwd: '지금 내가 있는 위치(디렉터리)를 보여 줍니다.', ls: '목록. -l 자세히, -a 숨김 파일 포함, -h 크기 단위', cd: '디렉터리 이동. cd 만 치면 홈으로.',
  mkdir: '디렉터리 만들기. -p 중간 디렉터리까지', touch: '빈 파일 만들기', cp: '복사. cp 원본 대상', mv: '이동·이름 바꾸기', rm: '삭제. 되돌릴 수 없음! 디렉터리는 rm -r',
  cat: '파일 내용 출력', head: '앞부분 보기. -n 숫자', tail: '뒷부분 보기. -n 숫자', grep: '글자가 들어간 줄만 보기. -i 대소문자 무시, -v 제외, -c 개수', echo: '글자 출력. > 덮어쓰기, >> 이어 쓰기',
  sort: '정렬. -h 크기 단위, -r 거꾸로, -n 숫자', wc: '줄 수 세기 (wc -l)', tee: '받은 내용을 화면과 파일에 함께 쓰기. -a 이어 쓰기',
  whoami: '현재 사용자 이름', id: 'UID, GID, 소속 그룹', groups: '소속 그룹', who: '지금 로그인한 사람', last: '최근 로그인 기록', umask: '새 파일 기본 권한에서 빼는 값',
  chmod: '권한 변경. chmod 644 파일, chmod u+x 파일', chown: '소유자 변경(root만). chown 사용자[:그룹] 파일',
  sudo: '명령 하나를 관리자 권한으로. sudo -i 는 root로 전환(exit로 복귀)', useradd: '사용자 추가(root)', userdel: '사용자 삭제(root). -r 홈까지', passwd: '비밀번호 변경', groupadd: '그룹 추가(root)', usermod: '사용자 수정. usermod -aG 그룹 사용자',
  ssh: '원격 접속. ssh 사용자@IP', 'ssh-keygen': 'SSH 키 한 쌍 만들기',
  ps: '프로세스 목록. ps aux, ps -ef', pstree: '프로세스 부모-자식 나무', kill: '프로세스 종료. kill PID (15), kill -9 PID (강제)', pkill: '이름으로 프로세스 종료', pgrep: '이름으로 PID 찾기',
  top: 'CPU·메모리·프로세스 실시간 현황 (여기서는 한 장면만)', uptime: '켜진 시간과 load average', free: '메모리 사용량. free -h', nproc: 'CPU 개수', lscpu: 'CPU 정보', dmesg: '커널 메시지(root)',
  systemctl: '서비스 관리. status/start/stop/restart/reload/enable/disable/is-active/is-enabled/list-units/get-default', journalctl: '로그 보기. -u 서비스, -n 줄수, -f 실시간, -b 이번 부팅, -p err',
  lsblk: '디스크·파티션·마운트 위치. -f 파일시스템까지', blkid: 'UUID와 파일시스템 종류', fdisk: '파티션 보기(fdisk -l, root)', 'mkfs.xfs': '파일시스템 만들기(포맷, root)', 'mkfs.ext4': '파일시스템 만들기(포맷, root)',
  mount: '연결. mount 장치 디렉터리 / mount -a (fstab대로) / mount (목록)', umount: '연결 해제. umount 디렉터리', df: '파일시스템별 용량. df -h', du: '디렉터리 용량. du -sh 경로',
  history: '입력한 명령 목록', clear: '화면 지우기', hostname: '서버 이름', uname: '커널 정보. -a 전부', date: '현재 시각'
};

/* output: CAP != null 이면 파이프·리다이렉트용으로 모은다 */
let CAP = null;
function tPrint(html, err) {
  if (CAP && !err) { CAP.push(plainText(html)); return; }
  T.out.push(html); if (T.out.length > 500) T.out.splice(0, T.out.length - 500);
  const o = $('#ttyOut'); if (o) { o.insertAdjacentHTML('beforeend', html + '\n'); o.scrollTop = o.scrollHeight; }
}
const tErr = s => { if (tErrHide) return; tPrint('<span class="t-e">' + esc(s) + '</span>', true); };
const tHint = s => tPrint('<span class="t-m">' + esc(s) + '</span>', true);
const tTxt = s => tPrint(esc(s));
const promptHTML = () => { const u = curUser(), home = T.users[u].home; const w = T.cwd === home ? '~' : (T.cwd === '/' ? '/' : splitP(T.cwd)[1]); return '<span class="t-p">[' + u + '@ojt-web01</span> <span class="t-d">' + esc(w) + '</span><span class="t-p">]' + (u === 'root' ? '#' : '$') + '</span>'; };

let info = {};
function run(line) {
  tPrint(promptHTML() + ' ' + esc(line), true);
  const trimmed = line.trim(); if (!trimmed) { info = {}; return; }
  T.hist.push(trimmed); T.hi = T.hist.length;
  const segs = splitPipe(trimmed);
  let stdin = null; const all = [];
  for (let i = 0; i < segs.length; i++) {
    if (!segs[i]) { tErr('bash: syntax error near unexpected token `|\''); break; }
    const last = i === segs.length - 1;
    CAP = last ? null : [];
    const inf = runOne(segs[i], stdin);
    all.push(inf);
    stdin = CAP ? CAP.join('\n') : null;
  }
  CAP = null;
  info = all[0] || {}; info.all = all; info.cmds = all.map(x => x.cmd);
}
function runOne(seg, stdin) {
  let tk = tokenize(seg);
  const inf = { cmd: tk[0], args: [], flags: '', abs: [], ok: true, denied: false, sudo: false, sub: null };
  info = inf;
  // redirect (> >> 2>) : 파일 쓰기는 "내 셸"의 권한으로 처리된다
  let redir = null, errNull = false;
  for (let i = 0; i < tk.length; i++) {
    if (tk[i] === '2>') { errNull = tk[i + 1] === '/dev/null'; tk.splice(i, 2); i--; continue; }
    if (tk[i] === '>' || tk[i] === '>>') { redir = { mode: tk[i], file: tk[i + 1] }; tk.splice(i, 2); break; }
  }
  if (tk[0] === 'll') tk = ['ls', '-l'].concat(tk.slice(1));
  const prevCap = CAP; if (redir) CAP = [];
  const savedErr = tErrHide; if (errNull) tErrHide = true;
  if (tk[0] === 'sudo') {
    inf.sudo = true;
    if (tk.length === 1) tErr('usage: sudo 명령어   (예: sudo cat /var/log/secure)');
    else if (tk[1] === '-i' || tk[1] === 'su' || tk[1] === '-s') { askPw(); T.rootShell = true; T.cwd = '/root'; inf.cmd = 'sudo-i'; tHint('root로 전환했습니다. 프롬프트 끝이 # 로 바뀐 것을 확인하세요. 돌아가려면 exit'); }
    else { if (!T.rootShell) askPw(); inf.cmd = tk[1]; exec(expandGlob(tk.slice(1), 'root'), 'root', stdin); }
  } else exec(expandGlob(tk, curUser()), curUser(), stdin);
  tErrHide = savedErr;
  if (redir) {
    const text = CAP.join('\n'); CAP = prevCap;
    if (!redir.file) tErr('bash: syntax error near unexpected token `newline\'');
    else writeFile(redir.file, text ? text + '\n' : '', redir.mode === '>>', curUser(), 'bash');
  }
  return inf;
}
let tErrHide = false;
function askPw() { if (!T.sudoed) { tHint('[sudo] password for trainee: (연습 터미널이라 입력 생략)'); T.sudoed = true; } }
function writeFile(p, text, append, u, who) {
  const abs = norm(p, u); info.abs.push(abs);
  const n = getNode(abs); const [pa, name] = splitP(abs); const par = getNode(pa);
  if (n) {
    if (n.t === 'd') { tErr(who + ': ' + p + ': Is a directory'); info.ok = false; return false; }
    if (n.dev) { return true; }
    if (!travOk(abs, u) || !can(n, 2, u)) { tErr(who + ': ' + p + ': Permission denied'); info.ok = false; info.denied = true; return false; }
    n.x = append ? n.x + text : text; delete n.sz; n.m = stamp(); return true;
  }
  if (!par || par.t !== 'd') { tErr(who + ': ' + p + ': No such file or directory'); info.ok = false; return false; }
  if (!travOk(abs, u) || !can(par, 2, u)) { tErr(who + ': ' + p + ': Permission denied'); info.ok = false; info.denied = true; return false; }
  const c = mkF(u, u, '644', text); c.m = stamp(); par.c[name] = c; return true;
}
function readInput(files, stdin, u, cmd) {
  if (!files.length) { if (stdin == null) { tErr(cmd + ': 파일 이름을 적어 주세요 (또는 파이프 | 로 넘겨 주세요)'); info.ok = false; return null; } return [{ name: null, text: stdin }]; }
  const res = [];
  files.forEach(p => {
    const r = look(p, u); info.abs.push(r.abs);
    if (!r.node) { tErr(cmd + ': ' + p + ': No such file or directory'); info.ok = false; return; }
    if (r.node.t === 'd') { tErr(cmd + ': ' + p + ': Is a directory'); info.ok = false; return; }
    if (r.denied || !can(r.node, 4, u)) { tErr(cmd + ': ' + p + ': Permission denied'); info.ok = false; info.denied = true; return; }
    if (r.node.dev) { tHint('(디스크 장치 파일은 내용을 직접 읽지 않습니다)'); return; }
    res.push({ name: p, text: r.node.x.replace(/\n$/, '') });
  });
  return res;
}

/* ---- system helpers ---- */
const svcName = s => (s || '').replace(/\.service$/, '');
const findProc = pid => T.procs.find(p => p.pid === pid);
function jlog(u, id, m, p) { T.journal.push({ t: jstamp(), u, id, m, p: p == null ? 6 : p }); }
function svcStart(n) {
  const s = T.svcs[n]; if (s.active) return;
  jlog(n, 'systemd[1]', 'Starting ' + n + '.service - ' + s.desc + '...');
  const pid = T.nextPid += 7; s.pid = pid; s.active = true; s.since = new Date().toString().slice(0, 3) + ' ' + today() + ' ' + nowHMS() + ' KST'; s.ago = 'just now';
  if (n === 'nginx') {
    T.procs.push({ pid, ppid: 1, user: 'root', cmd: 'nginx: master process /usr/sbin/nginx', cpu: 0, mem: 0.1, vsz: 12345, rss: 4100, tty: '?', stat: 'Ss', start: nowHM(), time: '0:00', svc: 'nginx' });
    T.procs.push({ pid: pid + 1, ppid: pid, user: 'nginx', cmd: 'nginx: worker process', cpu: 0, mem: 0.1, vsz: 13001, rss: 5200, tty: '?', stat: 'S', start: nowHM(), time: '0:00', svc: 'nginx' });
    T.procs.push({ pid: pid + 2, ppid: pid, user: 'nginx', cmd: 'nginx: worker process', cpu: 0, mem: 0.1, vsz: 13001, rss: 5200, tty: '?', stat: 'S', start: nowHM(), time: '0:00', svc: 'nginx' });
    const el = getNode('/var/log/nginx/error.log'); if (el) el.x += today().replace(/-/g, '/') + ' ' + nowHMS() + ' [notice] ' + pid + '#' + pid + ': start worker processes\n';
    const al = getNode('/var/log/nginx/access.log'); if (al) al.x += '10.0.0.25 - - [' + pad(new Date().getDate()) + '/Nov/2026:' + nowHMS() + ' +0900] "GET / HTTP/1.1" 200 615 "-" "curl/7.76.1"\n';
  } else T.procs.push({ pid, ppid: 1, user: 'root', cmd: '/usr/sbin/' + n, cpu: 0, mem: 0.1, vsz: 16000, rss: 6000, tty: '?', stat: 'Ss', start: nowHM(), time: '0:00', svc: n });
  jlog(n, 'systemd[1]', 'Started ' + n + '.service - ' + s.desc + '.');
}
function svcStop(n, quietJ) {
  const s = T.svcs[n]; if (!s.active) return;
  if (!quietJ) jlog(n, 'systemd[1]', 'Stopping ' + n + '.service - ' + s.desc + '...');
  T.procs = T.procs.filter(p => p.svc !== n || (n === 'sshd' && p.pid !== s.pid));
  s.active = false; s.pid = null; s.since = new Date().toString().slice(0, 3) + ' ' + today() + ' ' + nowHMS() + ' KST'; s.ago = 'just now';
  jlog(n, 'systemd[1]', n + '.service: Deactivated successfully.');
  if (!quietJ) jlog(n, 'systemd[1]', 'Stopped ' + n + '.service - ' + s.desc + '.');
}
const loadAvg = () => T.stressOn ? '1.95, 1.60, 1.02' : '0.12, 0.85, 0.79';
const memUsed = () => 1128856 + (T.svcs.nginx.active ? 14500 : 0);
function mountedDevs() { return Object.entries(T.devs).filter(([k, d]) => d.mnt).sort((a, b) => a[1].mnt.length - b[1].mnt.length); }
function devByPath(p) { const m = String(p).match(/^\/dev\/(\w+)$/); return m && T.devs[m[1]] ? m[1] : null; }
function treeBytes(n) { if (!n) return 0; if (n.t !== 'd') return n.dev ? 0 : Math.ceil(fsize(n) / 4096) * 4096; return Object.values(n.c).reduce((a, c) => a + treeBytes(c), 0); }
function doMount(name, mnt) {
  const d = T.devs[name], dir = getNode(mnt);
  d.mnt = mnt; dir._hid = dir.c; dir.c = d.files || {}; d.files = null; dir._m = true;
}
function doUmount(name) {
  const d = T.devs[name], dir = getNode(d.mnt);
  if (dir) { d.files = dir.c; dir.c = dir._hid || {}; delete dir._hid; delete dir._m; }
  d.mnt = null;
}

function exec(tk, u, stdin) {
  const cmd = tk[0]; const args = tk.slice(1);
  let flags = ''; const plain = [];
  args.forEach(a => { if (/^-[A-Za-z]+$/.test(a) && cmd !== 'chmod' && cmd !== 'kill') flags += a.slice(1); else if (!/^--/.test(a) || cmd === 'systemctl' || cmd === 'journalctl') plain.push(a); });
  info.args = plain; info.flags = flags;
  const fail = () => { info.ok = false; };
  const deny = () => { info.ok = false; info.denied = true; };
  const needRoot = (msg) => { if (u !== 'root') { tErr(msg); deny(); return true; } return false; };
  switch (cmd) {
    case 'help': tPrint('<span class="t-y">쓸 수 있는 명령어</span>\n' + Object.keys(MAN).join('  ') + '\n<span class="t-m">설명: man 명령어   ·   Tab 자동 완성   ·   ↑ 이전 명령   ·   | 파이프   ·   > 파일로 저장</span>'); break;
    case 'man': if (!plain[0]) tErr('What manual page do you want?  (예: man ls)'); else if (MAN[plain[0]]) tTxt(plain[0] + ' — ' + MAN[plain[0]]); else tErr('No manual entry for ' + plain[0]); break;
    case 'clear': T.out = []; { const o = $('#ttyOut'); if (o) o.innerHTML = ''; } break;
    case 'pwd': tTxt(T.cwd); break;
    case 'whoami': tTxt(u); break;
    case 'hostname': tTxt('ojt-web01'); break;
    case 'date': tTxt(new Date().toString().replace(/ GMT.*$/, ' KST')); break;
    case 'uname': tTxt(flags.includes('a') ? 'Linux ojt-web01 5.14.0-427.el9.x86_64 #1 SMP PREEMPT_DYNAMIC x86_64 x86_64 x86_64 GNU/Linux' : (flags.includes('r') ? '5.14.0-427.el9.x86_64' : 'Linux')); break;
    case 'history': T.hist.forEach((h, i) => tTxt(String(i + 1).padStart(5, ' ') + '  ' + h)); break;
    case 'umask': tTxt('0022'); break;
    case 'who': tTxt('trainee  pts/0        ' + today() + ' 12:40 (10.0.0.25)'); break;
    case 'w': tTxt(' ' + nowHMS() + ' up 3 days,  4:12,  1 user,  load average: ' + loadAvg() + '\nUSER     TTY        LOGIN@   IDLE   JCPU   PCPU WHAT\ntrainee  pts/0     12:40    0.00s  0.05s  0.00s w'); break;
    case 'last': tTxt('trainee  pts/0        10.0.0.25        Wed Nov  4 12:40   still logged in\ntrainee  pts/0        10.0.0.25        Wed Nov  4 09:12 - 11:30  (02:18)\nreboot   system boot  5.14.0-427.el9.x Sun Nov  1 09:00   still running'); break;
    case 'id': {
      const who = plain[0] || u; if (!T.users[who]) { tErr('id: \'' + who + '\': no such user'); fail(); break; }
      const gs = userGroups(who); const pg = T.groups[who] ? who : 'root';
      tTxt('uid=' + T.users[who].uid + '(' + who + ') gid=' + T.groups[pg].gid + '(' + pg + ') groups=' + gs.filter(g => T.groups[g]).map(g => T.groups[g].gid + '(' + g + ')').join(',')); break;
    }
    case 'groups': { const who = plain[0] || u; if (!T.users[who]) { tErr('groups: \'' + who + '\': no such user'); fail(); break; } tTxt((plain[0] ? who + ' : ' : '') + userGroups(who).join(' ')); break; }
    case 'ls': {
      const targets = plain.length ? plain : ['.'];
      targets.forEach((p, ti) => {
        const r = look(p, u); info.abs.push(r.abs);
        if (!r.node) { tErr('ls: cannot access \'' + p + '\': No such file or directory'); fail(); return; }
        if (r.denied || (r.node.t === 'd' && !can(r.node, 4, u))) { tErr('ls: cannot open directory \'' + p + '\': Permission denied'); deny(); return; }
        if (targets.length > 1 && r.node.t === 'd') tTxt((ti ? '\n' : '') + p + ':');
        let ents;
        if (r.node.t !== 'd') ents = [[p, r.node]];
        else { ents = Object.keys(r.node.c).sort().filter(k => flags.includes('a') || !k.startsWith('.')).map(k => [k, r.node.c[k]]); if (flags.includes('a')) ents = [['.', r.node], ['..', getNode(splitP(r.abs)[0]) || r.node]].concat(ents); }
        const nm = ([k, n]) => n.t === 'd' ? '<span class="t-d">' + esc(k) + '</span>' : n.dev ? '<span class="t-y">' + esc(k) + '</span>' : (n.t === 'f' && (parseInt(n.p[0], 8) & 1)) ? '<span class="t-p">' + esc(k) + '</span>' : esc(k);
        if (flags.includes('l')) {
          if (r.node.t === 'd') tTxt('total ' + ents.length * 4);
          ents.forEach(e => { const sz = e[1].dev ? '252, 0' : (flags.includes('h') ? hum(fsize(e[1])) : String(fsize(e[1]))); tPrint(symP(e[1]) + ' 1 ' + e[1].o.padEnd(8) + ' ' + e[1].g.padEnd(8) + ' ' + sz.padStart(10) + ' ' + e[1].m + ' ' + nm(e)); });
        } else if (ents.length) tPrint(ents.map(nm).join('  '));
      });
      break;
    }
    case 'cd': {
      const p = plain[0]; if (p === '-') { tErr('연습 터미널에서는 cd - 를 지원하지 않아요. 경로를 직접 적어 주세요.'); fail(); break; }
      const r = look(p, u); info.abs.push(r.abs);
      if (!r.node) { tErr('bash: cd: ' + p + ': No such file or directory'); fail(); break; }
      if (r.node.t !== 'd') { tErr('bash: cd: ' + p + ': Not a directory'); fail(); break; }
      if (r.denied || !can(r.node, 1, u)) { tErr('bash: cd: ' + (p || '~') + ': Permission denied'); deny(); break; }
      T.cwd = r.abs; break;
    }
    case 'cat': { const ins = readInput(plain, stdin, u, 'cat'); if (ins) ins.forEach(x => { if (x.text) tTxt(x.text); }); break; }
    case 'head': case 'tail': {
      let n = 10; const ni = args.indexOf('-n'); let files = plain;
      if (ni >= 0) { n = parseInt(args[ni + 1], 10) || 10; files = plain.filter(x => x !== args[ni + 1]); }
      const follow = flags.includes('f');
      const ins = readInput(files, stdin, u, cmd); if (!ins) break;
      ins.forEach(x => { if (ins.length > 1) tTxt('==> ' + x.name + ' <=='); let L = x.text ? x.text.split('\n') : []; L = cmd === 'head' ? L.slice(0, n) : L.slice(-n); if (L.length) tTxt(L.join('\n')); });
      if (follow) tHint('(-f: 실제로는 새 줄이 생길 때마다 계속 출력되고, Ctrl+C로 빠져나옵니다)');
      break;
    }
    case 'grep': {
      const pat = plain[0]; if (pat == null) { tErr('Usage: grep [옵션] 찾을글자 [파일...]'); fail(); break; }
      const ins = readInput(plain.slice(1), stdin, u, 'grep'); if (!ins) break;
      const ci = flags.includes('i'), inv = flags.includes('v'), cnt = flags.includes('c');
      const re = new RegExp(pat.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), ci ? 'gi' : 'g');
      let total = 0;
      ins.forEach(x => {
        const L = x.text ? x.text.split('\n') : [];
        const hits = L.filter(l => { re.lastIndex = 0; const h = re.test(l); return inv ? !h : h; });
        total += hits.length;
        if (cnt) { tTxt((ins.length > 1 ? x.name + ':' : '') + hits.length); return; }
        hits.forEach(l => tPrint((ins.length > 1 ? '<span class="t-m">' + esc(x.name) + ':</span>' : '') + (inv ? esc(l) : esc(l).replace(new RegExp(esc(pat).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), ci ? 'gi' : 'g'), mm => '<span class="t-e">' + mm + '</span>'))));
      });
      if (!total && !cnt) info.ok = false;
      break;
    }
    case 'sort': {
      const ins = readInput(plain, stdin, u, 'sort'); if (!ins) break;
      let L = ins.flatMap(x => x.text ? x.text.split('\n') : []);
      if (flags.includes('h')) L.sort((a, b) => humSort(a) - humSort(b)); else if (flags.includes('n')) L.sort((a, b) => parseFloat(a) - parseFloat(b)); else L.sort();
      if (flags.includes('r')) L.reverse();
      if (L.length) tTxt(L.join('\n')); break;
    }
    case 'wc': { const ins = readInput(plain, stdin, u, 'wc'); if (!ins) break; ins.forEach(x => { const n = x.text ? x.text.split('\n').length : 0; tTxt(String(n) + (x.name ? ' ' + x.name : '')); }); break; }
    case 'tee': {
      const text = stdin == null ? '' : stdin;
      if (!plain[0]) { tTxt(text); break; }
      if (writeFile(plain[0], text ? text + '\n' : '', flags.includes('a'), u, 'tee')) { if (text) tTxt(text); }
      break;
    }
    case 'echo': tTxt(args.join(' ')); break;
    case 'mkdir': case 'touch': {
      if (!plain.length) { tErr(cmd + ': missing operand  (예: ' + cmd + ' study)'); fail(); break; }
      plain.forEach(p => {
        const abs = norm(p, u); info.abs.push(abs);
        const mk = (abs2) => { const [pa, name] = splitP(abs2); const par = getNode(pa); if (!par || par.t !== 'd') return 'nf'; if (!travOk(abs2, u) || !can(par, 2, u)) return 'pd'; const n = cmd === 'mkdir' ? mkD(u, u === 'root' ? 'root' : u, '755') : mkF(u, u, '644', ''); n.m = stamp(); par.c[name] = n; return 'ok'; };
        const ex = getNode(abs);
        if (ex) { if (cmd === 'mkdir' && !flags.includes('p')) { tErr('mkdir: cannot create directory \'' + p + '\': File exists'); fail(); } else if (cmd === 'touch') ex.m = stamp(); return; }
        let res;
        if (cmd === 'mkdir' && flags.includes('p')) { const segs = abs.split('/').filter(Boolean); let acc = ''; for (const s of segs) { acc += '/' + s; if (!getNode(acc)) { res = mk(acc); if (res !== 'ok') break; } } }
        else res = mk(abs);
        if (res === 'nf') { tErr(cmd + ': cannot ' + (cmd === 'mkdir' ? 'create directory' : 'touch') + ' \'' + p + '\': No such file or directory'); fail(); }
        if (res === 'pd') { tErr(cmd + ': cannot ' + (cmd === 'mkdir' ? 'create directory' : 'touch') + ' \'' + p + '\': Permission denied'); deny(); }
      });
      break;
    }
    case 'rm': {
      if (!plain.length) { tErr('rm: missing operand'); fail(); break; }
      plain.forEach(p => {
        const abs = norm(p, u); info.abs.push(abs);
        if (abs === '/') { tErr('rm: it is dangerous to operate recursively on \'/\'  (루트 전체 삭제는 막혀 있습니다)'); fail(); return; }
        const n = getNode(abs); const [pa, name] = splitP(abs); const par = getNode(pa);
        if (!n) { if (!flags.includes('f')) { tErr('rm: cannot remove \'' + p + '\': No such file or directory'); fail(); } return; }
        if (n._m) { tErr('rm: cannot remove \'' + p + '\': Device or resource busy  (마운트된 디렉터리)'); fail(); return; }
        if (n.t === 'd' && !flags.includes('r')) { tErr('rm: cannot remove \'' + p + '\': Is a directory  (디렉터리는 rm -r)'); fail(); return; }
        if (!travOk(abs, u) || !can(par, 2, u)) { tErr('rm: cannot remove \'' + p + '\': Permission denied'); deny(); return; }
        delete par.c[name];
      });
      break;
    }
    case 'cp': case 'mv': {
      if (plain.length < 2) { tErr(cmd + ': missing destination file operand  (예: ' + cmd + ' memo.txt memo2.txt)'); fail(); break; }
      const [s, d] = plain; const rs = look(s, u);
      if (!rs.node) { tErr(cmd + ': cannot stat \'' + s + '\': No such file or directory'); fail(); break; }
      if (rs.node.t === 'd' && cmd === 'cp' && !flags.includes('r')) { tErr('cp: -r not specified; omitting directory \'' + s + '\''); fail(); break; }
      if (rs.denied || (cmd === 'cp' && !can(rs.node, 4, u))) { tErr(cmd + ': cannot open \'' + s + '\' for reading: Permission denied'); deny(); break; }
      let dabs = norm(d, u); const dn = getNode(dabs);
      if (dn && dn.t === 'd') dabs = (dabs === '/' ? '' : dabs) + '/' + splitP(rs.abs)[1];
      const [dpa, dname] = splitP(dabs); const dpar = getNode(dpa);
      if (!dpar || dpar.t !== 'd') { tErr(cmd + ': cannot create \'' + d + '\': No such file or directory'); fail(); break; }
      if (!travOk(dabs, u) || !can(dpar, 2, u)) { tErr(cmd + ': cannot create \'' + d + '\': Permission denied'); deny(); break; }
      if (cmd === 'cp') { const c = JSON.parse(JSON.stringify(rs.node)); c.o = u; c.g = u; c.m = stamp(); dpar.c[dname] = c; }
      else { const [spa, sname] = splitP(rs.abs); const spar = getNode(spa); if (!can(spar, 2, u)) { tErr('mv: cannot move \'' + s + '\': Permission denied'); deny(); break; } delete spar.c[sname]; dpar.c[dname] = rs.node; }
      info.abs.push(dabs); break;
    }
    case 'chmod': {
      const [mode, ...files] = args.filter(a => a !== '-R');
      if (!mode || !files.length) { tErr('chmod: missing operand  (예: chmod 600 note.txt)'); fail(); break; }
      const num = /^[0-7]{3}$/.test(mode), sm = mode.match(/^([ugoa]*)([+\-=])([rwx]+)$/);
      if (!num && !sm) { tErr('chmod: invalid mode: \'' + mode + '\'  (예: 644, u+x, go-w)'); fail(); break; }
      files.forEach(p => {
        const r = look(p, u); info.abs.push(r.abs);
        if (!r.node || r.denied) { tErr('chmod: cannot access \'' + p + '\': ' + (r.denied ? 'Permission denied' : 'No such file or directory')); r.denied ? deny() : fail(); return; }
        if (u !== 'root' && r.node.o !== u) { tErr('chmod: changing permissions of \'' + p + '\': Operation not permitted  (소유자나 root만 바꿀 수 있어요)'); deny(); return; }
        if (num) r.node.p = mode;
        else {
          const who = sm[1] && !sm[1].includes('a') ? sm[1] : 'ugo'; const mask = (sm[3].includes('r') ? 4 : 0) | (sm[3].includes('w') ? 2 : 0) | (sm[3].includes('x') ? 1 : 0);
          const dd = r.node.p.split('').map(x => parseInt(x, 8));
          ['u', 'g', 'o'].forEach((w, i) => { if (!who.includes(w)) return; dd[i] = sm[2] === '+' ? dd[i] | mask : sm[2] === '-' ? dd[i] & ~mask : mask; });
          r.node.p = dd.join('');
        }
      });
      break;
    }
    case 'chown': {
      const [spec, ...files] = plain;
      if (!spec || !files.length) { tErr('chown: missing operand  (예: sudo chown kim note.txt)'); fail(); break; }
      const [nu, ng] = spec.split(':');
      if (nu && !T.users[nu]) { tErr('chown: invalid user: \'' + spec + '\''); fail(); break; }
      if (ng && !T.groups[ng]) { tErr('chown: invalid group: \'' + spec + '\''); fail(); break; }
      files.forEach(p => {
        const r = look(p, u); info.abs.push(r.abs);
        if (!r.node) { tErr('chown: cannot access \'' + p + '\': No such file or directory'); fail(); return; }
        if (u !== 'root') { tErr('chown: changing ownership of \'' + p + '\': Operation not permitted  (소유자 변경은 root만 → sudo)'); deny(); return; }
        if (nu) r.node.o = nu; if (ng) r.node.g = ng;
      });
      break;
    }
    case 'su': tHint('연습 터미널에서는 비밀번호 입력을 생략하기 위해 su 대신 sudo -i 를 써 보세요. (root로 전환, exit로 복귀)'); break;
    case 'exit': case 'logout':
      if (T.rootShell) { T.rootShell = false; T.cwd = '/home/trainee'; tTxt('logout'); info.cmd = 'exit-root'; }
      else tHint('연습 터미널은 닫히지 않아요. 다른 화면으로 가려면 목차를 누르세요.');
      break;
    case 'useradd': case 'adduser': {
      const name = plain[plain.length - 1];
      if (needRoot(cmd + ': Permission denied.\n' + cmd + ': cannot lock /etc/passwd; try again later.  (계정 추가는 root만 → sudo)')) break;
      if (!name) { tErr('Usage: useradd 사용자명'); fail(); break; }
      if (T.users[name]) { tErr('useradd: user \'' + name + '\' already exists'); fail(); break; }
      const uid = Math.max(...Object.values(T.users).map(x => x.uid).filter(x => x >= 1000)) + 1;
      T.users[name] = { uid, home: '/home/' + name }; T.groups[name] = { gid: uid, m: [] };
      getNode('/home').c[name] = mkD(name, name, '700', {}); getNode('/home/' + name).m = stamp();
      getNode('/etc/passwd').x += name + ':x:' + uid + ':' + uid + '::/home/' + name + ':/bin/bash\n';
      getNode('/etc/group').x += name + ':x:' + uid + ':\n';
      tHint('(성공하면 아무 메시지도 나오지 않는 것이 리눅스의 습관입니다. id ' + name + ' 로 확인해 보세요)');
      break;
    }
    case 'userdel': {
      const name = plain[0];
      if (needRoot('userdel: Permission denied.')) break;
      if (!name || !T.users[name]) { tErr('userdel: user \'' + (name || '') + '\' does not exist'); fail(); break; }
      if (['root', 'trainee', 'nginx', 'sshd', 'chrony'].includes(name)) { tErr('연습 터미널에서는 ' + name + ' 계정을 지울 수 없게 막아 두었습니다.'); fail(); break; }
      delete T.users[name]; delete T.groups[name]; Object.values(T.groups).forEach(g => g.m = g.m.filter(x => x !== name));
      if (flags.includes('r')) delete getNode('/home').c[name];
      getNode('/etc/passwd').x = getNode('/etc/passwd').x.split('\n').filter(l => !l.startsWith(name + ':')).join('\n');
      break;
    }
    case 'groupadd': {
      const name = plain[0];
      if (needRoot('groupadd: Permission denied.')) break;
      if (!name) { tErr('Usage: groupadd 그룹명'); fail(); break; }
      if (T.groups[name]) { tErr('groupadd: group \'' + name + '\' already exists'); fail(); break; }
      T.groups[name] = { gid: 1500 + Object.keys(T.groups).length, m: [] }; getNode('/etc/group').x += name + ':x:' + T.groups[name].gid + ':\n'; break;
    }
    case 'usermod': {
      if (needRoot('usermod: Permission denied.')) break;
      const gi = args.findIndex(a => /^-(aG|Ga|G)$/.test(a)); const app = gi >= 0 && args[gi].includes('a');
      const grp = gi >= 0 ? args[gi + 1] : null; const who = args[args.length - 1];
      if (!grp || !who || who === grp) { tErr('Usage: usermod -aG 그룹 사용자'); fail(); break; }
      if (!T.users[who]) { tErr('usermod: user \'' + who + '\' does not exist'); fail(); break; }
      const gl = grp.split(','); const bad = gl.find(g => !T.groups[g]); if (bad) { tErr('usermod: group \'' + bad + '\' does not exist'); fail(); break; }
      if (!app) { Object.entries(T.groups).forEach(([g, o]) => { if (g !== who) o.m = o.m.filter(x => x !== who); }); tPrint('<span class="t-y">(주의: -a 없이 실행해서 ' + esc(who) + '의 기존 보조 그룹이 모두 지워졌습니다. 보통은 -aG 를 씁니다)</span>', true); }
      gl.forEach(g => { if (!T.groups[g].m.includes(who)) T.groups[g].m.push(who); });
      break;
    }
    case 'passwd': {
      const who = plain[0] || u;
      if (plain[0] && u !== 'root') { tErr('passwd: Only root can specify a user name.  (sudo passwd ' + plain[0] + ')'); deny(); break; }
      if (!T.users[who]) { tErr('passwd: user \'' + who + '\' does not exist'); fail(); break; }
      tPrint('Changing password for user ' + esc(who) + '.\n<span class="t-m">New password: (연습 터미널이라 입력 생략)</span>\npasswd: all authentication tokens updated successfully.'); break;
    }
    case 'ssh': {
      const target = plain.find(a => a.includes('@'));
      tHint('연습 터미널에서는 실제 서버에 접속할 수 없어요.');
      if (target && /^[a-z_][a-z0-9_-]*@[\w.-]+$/i.test(target)) tPrint('<span class="t-p">형식은 올바릅니다: 사용자명(' + esc(target.split('@')[0]) + ') @ 서버 주소(' + esc(target.split('@')[1]) + ')' + (args.includes('-i') ? ', 개인키 지정(-i)' : '') + (args.includes('-p') ? ', 포트 지정(-p)' : '') + '</span>', true);
      else tPrint('<span class="t-y">형식: ssh 사용자명@서버IP   ·   키: ssh -i 키파일 사용자명@서버IP   ·   포트: ssh -p 2222 사용자명@서버IP</span>', true);
      break;
    }
    case 'ssh-keygen': {
      const home = T.users[u].home; let sshd = getNode(home + '/.ssh');
      if (!sshd) { getNode(home).c['.ssh'] = mkD(u, u, '700', {}); sshd = getNode(home + '/.ssh'); }
      const k = mkF(u, u, '600', '-----BEGIN OPENSSH PRIVATE KEY-----\n(개인키 = 열쇠. 절대 공유 금지)\n-----END OPENSSH PRIVATE KEY-----\n'); k.m = stamp();
      const pb = mkF(u, u, '644', 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...(공개키 = 자물쇠) ' + u + '@ojt-web01\n'); pb.m = stamp();
      sshd.c.id_ed25519 = k; sshd.c['id_ed25519.pub'] = pb;
      tTxt('Generating public/private ed25519 key pair.\nYour identification has been saved in ' + home + '/.ssh/id_ed25519\nYour public key has been saved in ' + home + '/.ssh/id_ed25519.pub');
      tHint('(ls -l ~/.ssh 로 개인키 600, 공개키 644 권한을 확인해 보세요)');
      break;
    }
    /* ---- processes ---- */
    case 'ps': {
      const me = T.nextPid += 3;
      const list = T.procs.concat([{ pid: me, ppid: 3311, user: u === 'root' ? 'root' : 'trainee', cmd: 'ps ' + args.join(' '), cpu: 0, mem: 0.1, vsz: 10100, rss: 3700, tty: 'pts/0', stat: 'R+', start: nowHM(), time: '0:00' }]);
      const a = args.join(' ');
      if (/aux|-e|ax/.test(a)) {
        if (a.includes('-ef') || (a.includes('-e') && a.includes('f'))) {
          tTxt('UID          PID    PPID  C STIME TTY          TIME CMD');
          list.forEach(p => tTxt(p.user.padEnd(8) + String(p.pid).padStart(8) + String(p.ppid).padStart(8) + ' ' + String(Math.round(p.cpu)).padStart(2) + ' ' + p.start.padEnd(5) + ' ' + (p.tty === '?' ? '?' : p.tty).padEnd(8) + ' 00:' + p.time.padStart(5, '0') + ' ' + p.cmd));
        } else {
          tTxt('USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND');
          list.forEach(p => tTxt(p.user.padEnd(8) + String(p.pid).padStart(8) + ' ' + p.cpu.toFixed(1).padStart(4) + ' ' + p.mem.toFixed(1).padStart(4) + ' ' + String(p.vsz).padStart(6) + ' ' + String(p.rss).padStart(5) + ' ' + p.tty.padEnd(8) + ' ' + p.stat.padEnd(4) + ' ' + p.start.padEnd(5) + ' ' + p.time.padStart(6) + ' ' + p.cmd));
        }
      } else {
        tTxt('    PID TTY          TIME CMD');
        list.filter(p => p.tty === 'pts/0').forEach(p => tTxt(String(p.pid).padStart(7) + ' pts/0    00:' + p.time.padStart(5, '0') + ' ' + p.cmd.split(' ')[0].replace(/^-/, '')));
      }
      break;
    }
    case 'pstree': {
      const kids = pid => T.procs.filter(p => p.ppid === pid && p.pid !== 2);
      const name = p => p.cmd.replace(/^-/, '').replace(/^sshd: .*/, 'sshd').replace(/^nginx: .*/, 'nginx').split(' ')[0].split('/').pop();
      const lines = [];
      const walk = (p, pre, last, root) => { lines.push(root ? name(p) + '(' + p.pid + ')' : pre + (last ? '└─' : '├─') + name(p) + '(' + p.pid + ')'); const k = kids(p.pid); k.forEach((c, i) => walk(c, root ? '' : pre + (last ? '  ' : '│ '), i === k.length - 1, false)); };
      walk(findProc(1), '', true, true); tTxt(lines.join('\n')); break;
    }
    case 'pgrep': { const pat = plain[0]; if (!pat) { tErr('pgrep: no matching criteria specified'); fail(); break; } const m = T.procs.filter(p => p.cmd.includes(pat)); if (!m.length) fail(); m.forEach(p => tTxt(p.pid + (flags.includes('l') ? ' ' + p.cmd.split(' ')[0].replace(/:$/, '') : ''))); break; }
    case 'kill': case 'pkill': {
      const sig = args.find(a => /^-(9|15|KILL|TERM|SIGKILL|SIGTERM)$/.test(a)); const force = sig && /9|KILL/.test(sig);
      const targets = cmd === 'kill' ? args.filter(a => /^\d+$/.test(a)).map(Number) : T.procs.filter(p => p.cmd.includes(args.filter(a => !a.startsWith('-'))[0] || '\u0000')).map(p => p.pid);
      if (!targets.length) { tErr(cmd === 'kill' ? 'kill: usage: kill [-9] PID   (PID는 ps aux 나 top 으로 찾으세요)' : 'pkill: 일치하는 프로세스가 없습니다'); fail(); break; }
      targets.forEach(pid => {
        const p = findProc(pid);
        if (!p) { tErr('bash: kill: (' + pid + ') - No such process'); fail(); return; }
        if (u !== 'root' && p.user !== u) { tErr('bash: kill: (' + pid + ') - Operation not permitted  (남의 프로세스는 root만 종료 가능)'); deny(); return; }
        if (pid === 1 || pid === 2) { tErr('연습 터미널: systemd(PID 1)는 종료할 수 없게 막아 두었습니다.'); fail(); return; }
        if (pid === 3311 || pid === 3310 || pid === 3305) { tErr('연습 터미널: 내 접속 세션을 종료하면 연결이 끊깁니다. (막아 둠)'); fail(); return; }
        if (p.svc && T.svcs[p.svc] && T.svcs[p.svc].pid === pid) { svcStop(p.svc, true); tHint('(서비스의 메인 프로세스를 kill 했습니다. 서비스는 systemctl stop 으로 멈추는 것이 정석입니다)'); return; }
        T.procs = T.procs.filter(x => x.pid !== pid);
        if (p.stress) { T.stressOn = false; if (force) tHint('(-9로 강제 종료했습니다. 다음에는 먼저 kill ' + pid + ' (정상 종료 요청)부터 해 보세요)'); }
      });
      info.killed = targets; break;
    }
    case 'top': {
      const us = T.stressOn ? 49.6 : 1.1, id = (100 - us - 1.3).toFixed(1);
      const total = 3932.2, used = memUsed() / 1024, cache = 1189.3, free = total - used - cache;
      tTxt('top - ' + nowHMS() + ' up 3 days,  4:12,  1 user,  load average: ' + loadAvg());
      tTxt('Tasks: ' + (100 + T.procs.length) + ' total,   ' + (T.stressOn ? 2 : 1) + ' running, ' + (99 + T.procs.length - (T.stressOn ? 1 : 0)) + ' sleeping,   0 stopped,   0 zombie');
      tTxt('%Cpu(s): ' + us.toFixed(1).padStart(4) + ' us,  0.8 sy,  0.0 ni, ' + String(id).padStart(4) + ' id,  0.3 wa,  0.0 hi,  0.2 si,  0.0 st');
      tTxt('MiB Mem :   ' + total.toFixed(1) + ' total,   ' + free.toFixed(1) + ' free,   ' + used.toFixed(1) + ' used,   ' + cache.toFixed(1) + ' buff/cache');
      tTxt('MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.   ' + (total - used - 350).toFixed(1) + ' avail Mem\n');
      tPrint('<span class="t-y">    PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND</span>');
      T.procs.slice().sort((a, b) => b.cpu - a.cpu || b.rss - a.rss).slice(0, 8).forEach(p => tTxt(String(p.pid).padStart(7) + ' ' + p.user.padEnd(9) + ' 20   0 ' + String(p.vsz).padStart(7) + ' ' + String(p.rss).padStart(6) + ' ' + String(Math.round(p.rss * 0.7)).padStart(6) + ' ' + p.stat[0] + ' ' + (p.cpu ? p.cpu.toFixed(1) : '0.0').padStart(5) + ' ' + p.mem.toFixed(1).padStart(5) + ' ' + (p.time + '.07').padStart(9) + ' ' + p.cmd.split(' ')[0].replace(/^-/, '').replace(/:$/, '').split('/').pop()));
      tHint('(실제 top은 3초마다 갱신되고 q로 나갑니다. P: CPU순, M: 메모리순, 1: 코어별)');
      break;
    }
    case 'uptime': tTxt(' ' + nowHMS() + ' up 3 days,  4:12,  1 user,  load average: ' + loadAvg()); break;
    case 'nproc': tTxt('2'); break;
    case 'lscpu': tTxt('Architecture:            x86_64\nCPU(s):                  2\nModel name:              Intel Xeon Processor (Icelake)\nThread(s) per core:      1\nCore(s) per socket:      1\nSocket(s):               2\nHypervisor vendor:       KVM\nVirtualization type:     full'); tHint('(Hypervisor vendor: KVM → 이 서버는 KVM 위에서 도는 VM입니다. 일차 02 참고)'); break;
    case 'free': {
      const t = 4026532, us = memUsed(), sh = 16384, bc = 1218560, fr = t - us - bc, av = t - us - 360000;
      if (flags.includes('h')) {
        const g = k => { const b = k * 1024; return b >= GB ? (b / GB).toFixed(1) + 'Gi' : b >= MB ? Math.round(b / MB) + 'Mi' : b ? Math.round(b / KB) + 'Ki' : '0B'; };
        tTxt('               total        used        free      shared  buff/cache   available');
        tTxt('Mem:' + g(t).padStart(15) + g(us).padStart(12) + g(fr).padStart(12) + g(sh).padStart(12) + g(bc).padStart(12) + g(av).padStart(12));
        tTxt('Swap:' + '2.0Gi'.padStart(14) + '0B'.padStart(12) + '2.0Gi'.padStart(12));
      } else {
        tTxt('               total        used        free      shared  buff/cache   available');
        tTxt('Mem:' + String(t).padStart(15) + String(us).padStart(12) + String(fr).padStart(12) + String(sh).padStart(12) + String(bc).padStart(12) + String(av).padStart(12));
        tTxt('Swap:' + '2097148'.padStart(14) + '0'.padStart(12) + '2097148'.padStart(12));
        tHint('(단위 KiB. 사람이 읽기 쉽게 보려면 free -h)');
      }
      break;
    }
    case 'dmesg': if (needRoot('dmesg: read kernel buffer failed: Operation not permitted  (커널 메시지는 root만 → sudo dmesg)')) break;
      tTxt('[    0.000000] Linux version 5.14.0-427.el9.x86_64 (Rocky Linux 9.4)\n[    0.000000] Hypervisor detected: KVM\n[    1.204331] virtio_blk virtio1: [vda] 41943040 512-byte logical blocks (21.5 GB/20.0 GiB)\n[    1.210118] virtio_blk virtio2: [vdb] 20971520 512-byte logical blocks (10.7 GB/10.0 GiB)\n[    2.918772] XFS (vda2): Mounting V5 Filesystem'); break;
    case 'systemctl': {
      const pos = plain.filter(a => !a.startsWith('--')); const sub = plain.includes('--failed') ? '--failed' : (pos[0] || 'list-units'); const name = svcName(pos[1]); info.sub = sub; info.svc = name;
      const now = plain.includes('--now');
      const known = n => { if (!T.svcs[n]) { tErr((sub === 'status' ? 'Unit ' : 'Failed to ' + sub + ' ') + n + '.service' + (sub === 'status' ? ' could not be found.' : ': Unit ' + n + '.service not found.')); fail(); return false; } return true; };
      const ctl = ['start', 'stop', 'restart', 'reload', 'enable', 'disable'];
      if (ctl.includes(sub)) {
        if (!pos[1]) { tErr('Too few arguments.  (예: sudo systemctl ' + sub + ' nginx)'); fail(); break; }
        if (!known(name)) break;
        if (u !== 'root') { tErr('Failed to ' + sub + ' ' + name + '.service: Access denied\nSee system logs and \'systemctl status ' + name + '.service\' for details.'); tHint('(서비스 제어는 root 권한이 필요합니다 → sudo systemctl ' + sub + ' ' + name + ')'); deny(); break; }
        const s = T.svcs[name];
        if (sub === 'start') svcStart(name);
        if (sub === 'stop') { svcStop(name); if (name === 'sshd') tHint('(실제 서버에서 sshd를 멈추면 새 SSH 접속이 막힙니다. 이미 연결된 세션은 유지됩니다)'); }
        if (sub === 'restart') { svcStop(name); svcStart(name); }
        if (sub === 'reload') { if (!s.active) { tErr('nginx.service is not active, cannot reload.'.replace('nginx', name)); fail(); break; } jlog(name, 'systemd[1]', 'Reloaded ' + name + '.service - ' + s.desc + '.'); }
        if (sub === 'enable') { if (!s.enabled) tTxt('Created symlink /etc/systemd/system/multi-user.target.wants/' + name + '.service → /usr/lib/systemd/system/' + name + '.service.'); s.enabled = true; if (now) svcStart(name); }
        if (sub === 'disable') { if (s.enabled) tTxt('Removed "/etc/systemd/system/multi-user.target.wants/' + name + '.service".'); s.enabled = false; if (now) svcStop(name); }
        break;
      }
      if (sub === 'status') {
        if (!pos[1]) { tTxt('● ojt-web01\n    State: running\n    Units: 312 loaded\n     Jobs: 0 queued\n   Failed: 0 units\n    Since: Sun 2026-11-01 09:00:00 KST; 3 days ago'); break; }
        if (!known(name)) break;
        const s = T.svcs[name];
        const dot = s.active ? '<span class="t-p">●</span>' : '○';
        tPrint(dot + ' ' + esc(name) + '.service - ' + esc(s.desc));
        tTxt('     Loaded: loaded (/usr/lib/systemd/system/' + name + '.service; ' + (s.enabled ? 'enabled' : 'disabled') + '; preset: disabled)');
        tPrint('     Active: ' + (s.active ? '<span class="t-p">active (running)</span>' : 'inactive (dead)') + (s.since ? ' since ' + esc(s.since) + '; ' + esc(s.ago || '') : ''));
        if (s.active) {
          const ps = T.procs.filter(p => p.svc === name && (name !== 'sshd' || p.pid === s.pid));
          tTxt('   Main PID: ' + s.pid + ' (' + name + ')\n      Tasks: ' + ps.length + '\n     Memory: ' + (ps.reduce((a, p) => a + p.rss, 0) / 1024).toFixed(1) + 'M\n     CGroup: /system.slice/' + name + '.service');
          ps.forEach((p, i) => tTxt('             ' + (i === ps.length - 1 ? '└─' : '├─') + p.pid + ' "' + p.cmd + '"'));
        }
        const logs = T.journal.filter(j => j.u === name).slice(-5);
        if (logs.length) { tTxt(''); logs.forEach(j => tTxt(j.t + ' ojt-web01 ' + j.id + ': ' + j.m)); }
        break;
      }
      if (sub === 'is-active') { if (!known(name)) break; tTxt(T.svcs[name].active ? 'active' : 'inactive'); if (!T.svcs[name].active) info.ok = false; break; }
      if (sub === 'is-enabled') { if (!known(name)) break; tTxt(T.svcs[name].enabled ? 'enabled' : 'disabled'); break; }
      if (sub === 'get-default') { tTxt('multi-user.target'); break; }
      if (sub === 'daemon-reload') { if (u !== 'root') { tErr('Failed to reload daemon: Access denied'); deny(); } break; }
      if (sub === '--failed') { tTxt('  UNIT                    LOAD   ACTIVE SUB    DESCRIPTION\n● dnf-makecache.service   loaded failed failed dnf makecache\n\n1 loaded units listed.'); break; }
      if (sub === 'list-units') {
        tTxt('  UNIT                LOAD   ACTIVE   SUB     DESCRIPTION');
        Object.entries(T.svcs).forEach(([k, s]) => { if (s.active) tTxt('  ' + (k + '.service').padEnd(20) + 'loaded active   running ' + s.desc); });
        tTxt('\n' + Object.values(T.svcs).filter(s => s.active).length + ' loaded units listed.');
        break;
      }
      tErr('Unknown command verb \'' + sub + '\'.  (예: status, start, stop, restart, enable, disable)'); fail(); break;
    }
    case 'journalctl': {
      let list = T.journal.slice();
      const ui = args.indexOf('-u'); if (ui >= 0) { const n = svcName(args[ui + 1]); info.unit = n; list = list.filter(j => j.u === n); if (!list.length) tTxt('-- No entries --'); }
      const pi = args.indexOf('-p'); if (pi >= 0) { const lv = { emerg: 0, alert: 1, crit: 2, err: 3, warning: 4, notice: 5, info: 6 }[args[pi + 1]]; if (lv != null) list = list.filter(j => j.p <= lv); }
      if (flags.includes('b')) list = list.filter(j => j.t >= 'Nov 01');
      const ni = args.indexOf('-n'); if (ni >= 0) list = list.slice(-(parseInt(args[ni + 1], 10) || 10));
      list.forEach(j => tPrint((j.p <= 3 ? '<span class="t-e">' : j.p === 4 ? '<span class="t-y">' : '<span>') + esc(j.t + ' ojt-web01 ' + j.id + ': ' + j.m) + '</span>'));
      if (flags.includes('f')) tHint('(-f: 실제로는 새 로그가 생길 때마다 계속 출력되고 Ctrl+C로 빠져나옵니다)');
      break;
    }
    /* ---- disks ---- */
    case 'lsblk': {
      const f = flags.includes('f');
      tTxt(f ? 'NAME   FSTYPE UUID                                 MOUNTPOINTS' : 'NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINTS');
      const row = (pre, k, d) => f ? tTxt((pre + k).padEnd(7) + (d.fs || '').padEnd(7) + (d.uuid || '').padEnd(37) + (d.mnt || '')) : tTxt((pre + k).padEnd(7) + d.mm.padStart(7) + '    0 ' + (d.size % GB === 0 ? d.size / GB + 'G' : hum(d.size)).padStart(4) + '  0 ' + d.type.padEnd(4) + ' ' + (d.mnt || ''));
      Object.entries(T.devs).filter(([k, d]) => d.type === 'disk').forEach(([k, d]) => { row('', k, d); const ps = Object.entries(T.devs).filter(([pk, pd]) => pd.parent === k); ps.forEach(([pk, pd], i) => row(i === ps.length - 1 ? '└─' : '├─', pk, pd)); });
      break;
    }
    case 'blkid': {
      const want = plain[0] ? devByPath(plain[0]) : null;
      if (plain[0] && !want) { fail(); break; }
      Object.entries(T.devs).filter(([k, d]) => d.fs && (!want || k === want)).forEach(([k, d]) => tTxt('/dev/' + k + ': UUID="' + d.uuid + '" TYPE="' + d.fs + '"'));
      if (want && !T.devs[want].fs) { info.ok = false; tHint('(아무것도 안 나오면 아직 파일시스템이 없는 디스크입니다 → mkfs)'); }
      break;
    }
    case 'fdisk': case 'parted': {
      if (needRoot(cmd + ': cannot open /dev/vda: Permission denied  (→ sudo)')) break;
      if (cmd === 'fdisk' && !flags.includes('l')) { tHint('연습 터미널에서는 fdisk 대화형 편집은 지원하지 않아요. sudo fdisk -l 로 정보만 볼 수 있습니다. (실습은 파티션 없이 디스크 통째로 진행)'); break; }
      tTxt('Disk /dev/vda: 20 GiB, 21474836480 bytes, 41943040 sectors\nDisklabel type: gpt\nDevice       Start      End  Sectors Size Type\n/dev/vda1     2048  2099199  2097152   1G Linux filesystem\n/dev/vda2  2099200 41940991 39841792  19G Linux filesystem\n\nDisk /dev/vdb: 10 GiB, 10737418240 bytes, 20971520 sectors');
      break;
    }
    case 'mkfs.xfs': case 'mkfs.ext4': case 'mkfs': {
      const fs = cmd === 'mkfs' ? (args.includes('-t') ? args[args.indexOf('-t') + 1] : 'ext4') : cmd.split('.')[1];
      const target = plain.filter(a => a !== fs)[0]; const k = devByPath(target);
      if (!target) { tErr(cmd + ': no device name given'); fail(); break; }
      if (u !== 'root') { tErr(cmd + ': cannot open ' + target + ': Permission denied  (포맷은 root만 → sudo)'); deny(); break; }
      if (!k) { tErr(cmd + ': cannot open ' + target + ': No such file or directory'); fail(); break; }
      const d = T.devs[k];
      if (d.mnt) { tErr(cmd + ': ' + target + ' contains a mounted filesystem  (마운트된 디스크는 포맷할 수 없습니다)'); fail(); break; }
      if (Object.values(T.devs).some(x => x.parent === k)) { tErr(cmd + ': ' + target + ' appears to contain a partition table (gpt).\n' + cmd + ': Use the -f option to force overwrite.'); tHint('(OS가 들어 있는 디스크입니다! 장치 이름을 다시 확인하세요. lsblk)'); fail(); break; }
      if (d.fs && !flags.includes('f') && !flags.includes('F')) { tErr(cmd + ': ' + target + ' appears to contain an existing filesystem (' + d.fs + ').\n' + cmd + ': Use the -f option to force overwrite.'); fail(); break; }
      d.fs = fs; d.uuid = uuid(); d.files = { }; d.used = fs === 'xfs' ? 104 * MB : 24 * KB; d.cap = fs === 'xfs' ? 10 * GB - 70 * MB : 9.8 * GB;
      if (fs === 'xfs') tTxt('meta-data=' + target + '               isize=512    agcount=4, agsize=655360 blks\ndata     =                       bsize=4096   blocks=2621440, imaxpct=25\nlog      =internal log           bsize=4096   blocks=16384, version=2\nrealtime =none                   extsz=4096   blocks=0, rtextents=0\nDiscarding blocks...Done.');
      else tTxt('mke2fs 1.46.5 (30-Dec-2021)\nCreating filesystem with 2621440 4k blocks and 655360 inodes\nFilesystem UUID: ' + d.uuid + '\nWriting superblocks and filesystem accounting information: done');
      break;
    }
    case 'mount': {
      if (!plain.length && !flags.includes('a')) {
        tTxt('proc on /proc type proc (rw,nosuid,nodev,noexec,relatime)');
        mountedDevs().forEach(([k, d]) => tTxt('/dev/' + k + ' on ' + d.mnt + ' type ' + d.fs + ' (rw,relatime,seclabel,attr2,inode64,logbufs=8,logbsize=32k,noquota)'));
        break;
      }
      if (u !== 'root') { tErr('mount: ' + (plain[1] || plain[0] || '') + ': must be superuser to use mount.  (→ sudo)'); deny(); break; }
      const tryMount = (spec, mnt, fsType, src) => {
        let k = null;
        if (/^UUID=/.test(spec)) { const uu = spec.slice(5); k = Object.keys(T.devs).find(x => T.devs[x].uuid === uu); if (!k) { tErr('mount: ' + mnt + ': can\'t find UUID=' + uu + '.'); return false; } }
        else { k = devByPath(spec); if (!k) { tErr('mount: ' + mnt + ': special device ' + spec + ' does not exist.'); return false; } }
        const d = T.devs[k]; const dir = getNode(mnt);
        if (!dir || dir.t !== 'd') { tErr('mount: ' + mnt + ': mount point does not exist.'); return false; }
        if (d.mnt === mnt) { if (src !== 'fstab') tErr('mount: ' + mnt + ': /dev/' + k + ' already mounted on ' + mnt + '.'); return src === 'fstab'; }
        if (d.mnt) { tErr('mount: ' + mnt + ': /dev/' + k + ' already mounted on ' + d.mnt + '.'); return false; }
        if (!d.fs || (fsType && fsType !== d.fs && fsType !== 'auto')) { tErr('mount: ' + mnt + ': wrong fs type, bad option, bad superblock on /dev/' + k + ', missing codepage or helper program, or other error.'); if (!d.fs) tHint('(파일시스템이 없는 디스크입니다. 먼저 mkfs 로 포맷하세요)'); else tHint('(fstab에 적은 파일시스템 종류(' + fsType + ')와 실제(' + d.fs + ')가 다릅니다)'); return false; }
        doMount(k, mnt); return true;
      };
      if (flags.includes('a')) {
        let okAll = true;
        getNode('/etc/fstab').x.split('\n').forEach(l => { l = l.trim(); if (!l || l.startsWith('#')) return; const f = l.split(/\s+/); if (f.length < 4) { tErr('mount: /etc/fstab: parse error: ignore entry "' + l + '"'); okAll = false; return; } if (f[2] === 'swap') return; if (!tryMount(f[0], f[1], f[2], 'fstab')) okAll = false; });
        if (!okAll) { info.ok = false; tHint('(mount -a 에서 오류가 났습니다. 이대로 재부팅하면 emergency mode로 들어갈 수 있으니 fstab을 고치세요)'); }
        break;
      }
      if (plain.length < 2) { tErr('mount: 사용법: sudo mount 장치 디렉터리   (예: sudo mount /dev/vdb /data)'); fail(); break; }
      if (!tryMount(plain[0], norm(plain[1], u), null, 'cmd')) fail();
      info.abs.push(norm(plain[1], u));
      break;
    }
    case 'umount': {
      const t = plain[0]; if (!t) { tErr('umount: bad usage'); fail(); break; }
      if (u !== 'root') { tErr('umount: ' + t + ': must be superuser to unmount.  (→ sudo)'); deny(); break; }
      const k = devByPath(t) || Object.keys(T.devs).find(x => T.devs[x].mnt === norm(t, u));
      if (!k || !T.devs[k].mnt) { tErr('umount: ' + t + ': not mounted.'); fail(); break; }
      const m = T.devs[k].mnt;
      if (m === '/' || m === '/boot' || T.cwd === m || T.cwd.startsWith(m + '/')) { tErr('umount: ' + m + ': target is busy.'); if (T.cwd === m || T.cwd.startsWith(m + '/')) tHint('(지금 ' + m + ' 안에 들어가 있어서 그렇습니다. cd 로 밖으로 나온 뒤 다시 하세요)'); fail(); break; }
      doUmount(k); break;
    }
    case 'df': {
      const h = flags.includes('h'), Tf = flags.includes('T'), I = flags.includes('i');
      const rows = [['devtmpfs', 'devtmpfs', 4 * MB, 0, '/dev'], ['tmpfs', 'tmpfs', 1.9 * GB, 0, '/dev/shm'], ['tmpfs', 'tmpfs', 777 * MB, 8.6 * MB, '/run']];
      mountedDevs().forEach(([k, d]) => { const extra = d.mnt === '/' ? 0 : treeBytes(getNode(d.mnt)); rows.push(['/dev/' + k, d.fs, d.cap || d.size, (d.used || 0) + extra, d.mnt]); });
      let show = rows;
      if (plain[0]) { const abs = norm(plain[0], u); const best = rows.filter(r => abs === r[4] || abs.startsWith(r[4] === '/' ? '/' : r[4] + '/')).sort((a, b) => b[4].length - a[4].length)[0]; show = best ? [best] : []; info.abs.push(abs); }
      if (I) { tTxt('Filesystem      Inodes IUsed   IFree IUse% Mounted on'); show.forEach(r => tTxt(r[0].padEnd(14) + ' ' + (r[2] > GB ? '9.5M' : '485K').padStart(6) + ' ' + (r[3] > GB ? '68K' : '1').padStart(5) + ' ' + (r[2] > GB ? '9.4M' : '485K').padStart(7) + ' ' + (r[3] > GB ? '1%' : '1%').padStart(5) + ' ' + r[4])); break; }
      tTxt('Filesystem     ' + (Tf ? 'Type     ' : '') + (h ? ' Size  Used Avail Use%' : ' 1K-blocks     Used Available Use%') + ' Mounted on');
      show.forEach(r => { const pct = r[2] ? Math.ceil(r[3] / r[2] * 100) : 0; const av = r[2] - r[3]; tTxt(r[0].padEnd(15) + (Tf ? r[1].padEnd(9) : '') + (h ? hum(r[2]).padStart(5) + ' ' + hum(r[3]).padStart(5) + ' ' + hum(av).padStart(5) + ' ' : String(Math.round(r[2] / KB)).padStart(10) + ' ' + String(Math.round(r[3] / KB)).padStart(8) + ' ' + String(Math.round(av / KB)).padStart(9) + ' ') + (pct + '%').padStart(4) + ' ' + r[4]); });
      break;
    }
    case 'du': {
      const h = flags.includes('h'), s = flags.includes('s');
      const targets = plain.length ? plain : ['.'];
      const fmt = b => h ? hum(b) : String(Math.ceil(b / KB));
      const sizeOf = (abs, n, out) => {
        if (n.t !== 'd') return n.dev ? 0 : Math.ceil(fsize(n) / 4096) * 4096;
        if (u !== 'root' && (!can(n, 4, u) || !can(n, 1, u))) { tErr('du: cannot read directory \'' + abs + '\': Permission denied'); info.denied = true; return 0; }
        let tot = 0; Object.entries(n.c).forEach(([k, c]) => { tot += sizeOf((abs === '/' ? '' : abs) + '/' + k, c, out); });
        if (out) tTxt(fmt(tot).padEnd(7) + ' ' + abs); return tot;
      };
      targets.forEach(p => { const r = look(p, u); info.abs.push(r.abs); if (!r.node) { tErr('du: cannot access \'' + p + '\': No such file or directory'); fail(); return; } if (r.denied) { tErr('du: cannot access \'' + p + '\': Permission denied'); deny(); return; } const tot = sizeOf(r.abs, r.node, !s && r.node.t === 'd'); if (s || r.node.t !== 'd') tTxt(fmt(tot).padEnd(7) + ' ' + p); });
      break;
    }
    case 'vi': case 'vim': case 'nano': tHint('연습 터미널에서는 편집기를 쓸 수 없어요. 파일에 한 줄 추가는 echo "내용" | sudo tee -a 파일 로 해 보세요.'); break;
    case 'dnf': case 'yum': case 'apt': tHint('연습 터미널에서는 프로그램 설치를 지원하지 않아요. (nginx는 이미 설치되어 있습니다: systemctl status nginx)'); break;
    case 'reboot': case 'shutdown': tHint('연습 터미널에서는 재부팅하지 않아요. 실제 서버에서는 재부팅 전에 반드시 sudo mount -a 로 fstab을 검증하세요.'); break;
    case 'dir': tErr('bash: dir: command not found'); tHint('리눅스에서는 dir 대신 ls 를 씁니다.'); fail(); break;
    case 'cls': tErr('bash: cls: command not found'); tHint('리눅스에서는 cls 대신 clear 를 씁니다.'); fail(); break;
    default: tErr('bash: ' + cmd + ': command not found'); tHint('help 를 입력하면 쓸 수 있는 명령어가 나옵니다.'); fail();
  }
}

/* ---- missions ---- */
const has = abs => (info.all || [info]).some(x => (x.abs || []).includes(abs));
const anyCmd = c => (info.cmds || [info.cmd]).includes(c);
const MISSIONS = {
  a: { name: 'A 탐험', lesson: 'd03', items: [
    { t: '지금 내가 어디에 있는지 확인하기', h: 'pwd', c: () => info.cmd === 'pwd' },
    { t: '지금 있는 곳의 파일 목록 보기', h: 'ls', c: () => info.cmd === 'ls' && info.ok },
    { t: '숨김 파일(.으로 시작)까지 보기', h: 'ls -a', c: () => info.cmd === 'ls' && info.flags.includes('a') && info.ok },
    { t: '파일 시스템의 꼭대기(루트)로 이동하기', h: 'cd /', c: () => info.cmd === 'cd' && T.cwd === '/' },
    { t: '설정 파일이 모인 디렉터리로 이동하기', h: 'cd /etc  (또는 루트에 있다면 cd etc)', c: () => info.cmd === 'cd' && T.cwd === '/etc' },
    { t: '이 서버의 이름이 적힌 파일 읽기', h: 'cat hostname  (지금 /etc 에 있으니 상대경로로)', c: () => ['cat', 'head', 'tail'].includes(info.cmd) && has('/etc/hostname') && info.ok },
    { t: '이 서버의 리눅스 배포판 이름 확인하기', h: 'cat /etc/os-release', c: () => ['cat', 'head'].includes(info.cmd) && has('/etc/os-release') && info.ok },
    { t: '부팅 파일(커널)이 있는 디렉터리 목록 보기', h: 'ls /boot', c: () => info.cmd === 'ls' && info.ok && (T.cwd === '/boot' || has('/boot')) },
    { t: '로그 디렉터리로 이동해서 목록 보기', h: 'cd /var/log  →  ls', c: () => info.cmd === 'ls' && info.ok && (T.cwd === '/var/log' || has('/var/log')) },
    { t: '한 번에 내 홈 디렉터리로 돌아가기', h: 'cd  (아무것도 안 붙이면 홈) 또는 cd ~', c: () => info.cmd === 'cd' && T.cwd === '/home/trainee' },
    { t: '상대경로로 한 단계 위(/home)로 이동하기', h: 'cd ..', c: () => info.cmd === 'cd' && info.args[0] === '..' && T.cwd === '/home' }
  ] },
  b: { name: 'B 권한', lesson: 'd04', items: [
    { t: '내가 누구인지 확인하기', h: 'whoami', c: () => info.cmd === 'whoami' },
    { t: '내 UID와 소속 그룹 확인하기 (wheel 그룹이 보이나요? sudo를 쓸 수 있는 그룹입니다)', h: 'id', c: () => info.cmd === 'id' && info.ok },
    { t: '계정 목록 파일에서 내 줄만 찾기', h: 'grep trainee /etc/passwd', c: () => anyCmd('grep') && has('/etc/passwd') && info.ok !== false },
    { t: '홈 디렉터리에 study 디렉터리 만들기', h: 'cd  →  mkdir study', c: () => { const n = getNode('/home/trainee/study'); return !!n && n.t === 'd'; } },
    { t: 'study 안에 note.txt 파일 만들기', h: 'cd study  →  touch note.txt', c: () => !!getNode('/home/trainee/study/note.txt') },
    { t: 'note.txt의 권한과 소유자를 자세히 보기', h: 'ls -l', c: () => info.cmd === 'ls' && info.flags.includes('l') && info.ok && (T.cwd === '/home/trainee/study' || has('/home/trainee/study') || has('/home/trainee/study/note.txt')) },
    { t: 'note.txt를 "나만 읽고 쓰기"로 바꾸기', h: 'chmod 600 note.txt  →  ls -l 로 -rw------- 확인', c: () => { const n = getNode('/home/trainee/study/note.txt'); return !!n && n.p === '600'; } },
    { t: '관리자 전용 로그 /var/log/secure 읽어 보기 (거부되는 게 정상!)', h: 'cat /var/log/secure', c: () => info.cmd === 'cat' && has('/var/log/secure') && info.denied && !info.sudo },
    { t: '관리자 권한을 빌려서 같은 파일 다시 읽기', h: 'sudo cat /var/log/secure', c: () => info.sudo && info.cmd === 'cat' && has('/var/log/secure') && info.ok },
    { t: '새 사용자 kim 만들기', h: 'sudo useradd kim  →  id kim 으로 확인', c: () => !!T.users.kim },
    { t: 'note.txt의 소유자를 kim으로 바꾸기', h: 'sudo chown kim note.txt  (study 디렉터리 안에서)', c: () => { const n = getNode('/home/trainee/study/note.txt'); return !!n && n.o === 'kim'; } },
    { t: 'root로 전환했다가 돌아오기 (프롬프트의 $와 # 비교)', h: 'sudo -i  →  whoami  →  exit', c: () => info.cmd === 'exit-root' },
    { t: 'SSH 키 한 쌍을 만들고 권한 확인하기', h: 'ssh-keygen  →  ls -l ~/.ssh', c: () => info.cmd === 'ls' && info.flags.includes('l') && has('/home/trainee/.ssh') && !!getNode('/home/trainee/.ssh/id_ed25519') }
  ] },
  c: { name: 'C 운영', lesson: 'd05', items: [
    { t: '서버가 켜진 지 얼마나 됐고, 부하(load average)는 얼마인지 보기', h: 'uptime', c: () => info.cmd === 'uptime' },
    { t: 'CPU가 몇 개인지 확인하기 (load와 비교할 기준)', h: 'nproc  (또는 lscpu)', c: () => info.cmd === 'nproc' || info.cmd === 'lscpu' },
    { t: 'top으로 CPU를 가장 많이 쓰는 프로세스 찾기', h: 'top  → 맨 위 줄의 PID와 COMMAND 확인', c: () => info.cmd === 'top' },
    { t: 'ps와 grep으로 그 프로세스만 골라 보기', h: 'ps aux | grep stress', c: () => info.cmd === 'ps' && anyCmd('grep') },
    { t: '그 프로세스를 정상 종료 요청으로 끝내기 → 다시 uptime/top으로 확인', h: 'kill 4120   (-9 말고 그냥 kill 먼저)', c: () => !T.stressOn },
    { t: 'SSH 서비스(sshd)의 상태 보기', h: 'systemctl status sshd', c: () => info.cmd === 'systemctl' && info.sub === 'status' && info.svc === 'sshd' },
    { t: '웹 서비스(nginx)의 상태 보기 (꺼져 있을 거예요)', h: 'systemctl status nginx', c: () => info.cmd === 'systemctl' && info.sub === 'status' && info.svc === 'nginx' },
    { t: 'nginx를 지금 켜기', h: 'sudo systemctl start nginx  →  status 로 active (running) 확인', c: () => T.svcs.nginx.active },
    { t: 'nginx를 부팅 시 자동 시작으로 등록하기 (start ≠ enable)', h: 'sudo systemctl enable nginx', c: () => T.svcs.nginx.enabled },
    { t: 'nginx 서비스의 로그만 보기', h: 'journalctl -u nginx', c: () => info.cmd === 'journalctl' && info.unit === 'nginx' },
    { t: '메모리 사용량을 읽기 쉬운 단위로 보기 (available 확인)', h: 'free -h', c: () => info.cmd === 'free' && info.flags.includes('h') },
    { t: '로그인 실패 기록 찾기 (누가 무작위로 비밀번호를 대입하고 있나?)', h: 'sudo grep Failed /var/log/secure', c: () => anyCmd('grep') && has('/var/log/secure') && info.ok !== false && !info.denied }
  ] },
  d: { name: 'D 디스크', lesson: 'd06', items: [
    { t: '디스크 목록 보기: 새로 붙은 빈 디스크는?', h: 'lsblk  → vdb (10G, 마운트 위치 없음)', c: () => info.cmd === 'lsblk' },
    { t: '지금 연결된 파일시스템과 용량 보기', h: 'df -h', c: () => info.cmd === 'df' && info.flags.includes('h') },
    { t: 'vdb에 xfs 파일시스템 만들기 (장치 이름 두 번 확인!)', h: 'sudo mkfs.xfs /dev/vdb', c: () => !!T.devs.vdb.fs },
    { t: '연결할 자리 /data 만들기', h: 'sudo mkdir /data', c: () => { const n = getNode('/data'); return !!n && n.t === 'd'; } },
    { t: 'vdb를 /data에 연결하기', h: 'sudo mount /dev/vdb /data', c: () => T.devs.vdb.mnt === '/data' },
    { t: '연결됐는지 용량으로 확인하기', h: 'df -h   (/dev/vdb 10G /data 가 보이나요?)', c: () => info.cmd === 'df' && T.devs.vdb.mnt === '/data' },
    { t: 'vdb의 UUID 확인하기', h: 'sudo blkid /dev/vdb', c: () => info.cmd === 'blkid' && info.ok !== false && !!T.devs.vdb.uuid },
    { t: '/etc/fstab에 자동 연결 줄 추가하기', h: 'echo "UUID=복사한값 /data xfs defaults 0 0" | sudo tee -a /etc/fstab   (cat /etc/fstab 으로 확인)', c: () => { const d = T.devs.vdb; return !!d.uuid && getNode('/etc/fstab').x.split('\n').some(l => { const f = l.trim().split(/\s+/); return (f[0] === 'UUID=' + d.uuid || f[0] === '/dev/vdb') && f[1] === '/data' && f[2] === d.fs; }); } },
    { t: 'fstab을 검증하려고 /data 연결을 한 번 풀기', h: 'sudo umount /data   (target is busy 가 나오면 cd 로 밖에 나와서)', c: () => info.cmd === 'umount' && !T.devs.vdb.mnt },
    { t: 'fstab대로 다시 연결해서 검증하기 (오류 없이 붙으면 성공)', h: 'sudo mount -a  →  df -h /data', c: () => info.cmd === 'mount' && info.flags.includes('a') && T.devs.vdb.mnt === '/data' && info.ok !== false },
    { t: '/var/log에서 가장 큰 파일 찾기', h: 'sudo du -sh /var/log/* | sort -h', c: () => info.cmd === 'du' && anyCmd('sort') }
  ] }
};
const MSETS = ['a', 'b', 'c', 'd'];
function checkMission() {
  const set = MISSIONS[TMSET].items, k = S.term[TMSET] || 0;
  if (k >= set.length) return;
  let ok = false; try { ok = !!set[k].c(); } catch (e) {}
  if (ok) {
    S.term[TMSET] = k + 1; save(true);
    tPrint('<span class="t-y">✓ 미션 ' + (k + 1) + ' 완료: ' + esc(set[k].t) + '</span>', true);
    if (k + 1 === set.length) { tPrint('<span class="t-y">★ 미션 ' + TMSET.toUpperCase() + ' 전부 완료! 잘했습니다.</span>', true); toast('미션 ' + TMSET.toUpperCase() + ' 완료!'); }
    drawMissions(); renderNav();
  }
}
function drawMissions() {
  const box = $('#mBox'); if (!box) return;
  const M = MISSIONS[TMSET], set = M.items, k = S.term[TMSET] || 0;
  box.innerHTML = '<div class="seg" id="mSet" style="margin-bottom:10px">' + MSETS.map(s => '<button data-v="' + s + '" class="' + (TMSET === s ? 'on' : '') + '">' + MISSIONS[s].name + ((S.term[s] || 0) >= MISSIONS[s].items.length ? ' ✓' : '') + '</button>').join('') + '</div>' +
    '<div class="small muted" style="margin-bottom:6px">' + Math.min(k, set.length) + ' / ' + set.length + ' 완료 · <a href="#' + M.lesson + '">' + esc(LMAP[M.lesson].tag) + ' 레슨</a> 연습</div>' +
    set.map((m, i) => '<div class="mi ' + (i < k ? 'ok' : i === k ? 'cur' : 'todo') + '"><span class="ck">' + (i < k ? '✓' : i + 1) + '</span><div>' + esc(m.t) + (i === k ? '<div class="hint"><button class="btn sm" data-hint style="padding:2px 8px;font-size:.76rem">힌트 보기</button><span data-ht hidden> <code>' + esc(m.h) + '</code></span></div>' : '') + '</div></div>').join('') +
    '<div class="btn-row"><button class="btn sm" id="mReset">이 미션 처음부터</button></div>';
  $$('#mSet button').forEach(b => b.onclick = () => { TMSET = b.dataset.v; drawMissions(); $('#ttyIn').focus(); });
  const hb = $('[data-hint]', box); if (hb) hb.onclick = () => { $('[data-ht]', box).hidden = false; hb.hidden = true; };
  $('#mReset').onclick = () => { S.term[TMSET] = 0; save(); T = initT(); vTerm(); };
}
function vTerm() {
  let h = '<div class="eyebrow">셀프 테스트 · 일차 03–06</div><h1>연습 터미널</h1><p class="lede">진짜 서버(Rocky Linux 9 VM)처럼 명령어를 입력해 보는 곳입니다. 이 페이지 안에서만 동작하는 가짜 리눅스라서 무엇을 지워도 괜찮습니다.</p>';
  h += '<p class="small muted">오른쪽 미션을 순서대로 하세요. 막히면 <code>help</code>, <code>man 명령어</code>, 또는 미션의 "힌트 보기". 명령어를 친 뒤 <kbd>Enter</kbd>, 이름 일부만 치고 <kbd>Tab</kbd>을 누르면 자동 완성됩니다. 파이프(<code>|</code>)와 <code>&gt;</code>도 됩니다.</p>';
  h += '<div class="term-wrap"><div class="tty" id="tty"><div class="tty-bar"><i></i><i></i><i></i><span style="margin-left:6px">trainee@ojt-web01 — 연습용 (Rocky Linux 9 · KVM VM)</span></div><div class="tty-out" id="ttyOut"></div><div class="tty-in"><span id="ttyPs"></span><input id="ttyIn" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="명령어 입력"></div></div><div class="missions" id="mBox"></div></div>';
  h += '<div class="btn-row"><button class="btn sm" id="tReset">터미널 초기화 (파일·서비스·디스크 원래대로)</button></div>';
  h += '<h2>기억할 것</h2><ul><li>에러 메시지는 영어지만 읽으면 이유가 적혀 있습니다. <code>No such file or directory</code> = 그런 파일 없음, <code>Permission denied</code> = 권한 없음, <code>command not found</code> = 그런 명령 없음(오타 확인), <code>target is busy</code> = 사용 중.</li><li>리눅스는 성공하면 대개 아무 말도 하지 않습니다. 결과는 <code>ls</code>, <code>id</code>, <code>systemctl status</code>, <code>df -h</code> 같은 명령으로 직접 확인하는 습관을 들이세요.</li><li>대소문자를 구분합니다. <code>Memo.txt</code>와 <code>memo.txt</code>는 다른 파일입니다.</li><li>미션은 순서대로만 인정됩니다. 앞 미션을 먼저 끝내세요.</li></ul>';
  $('#view').innerHTML = h;
  const out = $('#ttyOut');
  if (!T.out.length) T.out.push('<span class="t-m">Rocky Linux 9.4 · 연습 터미널에 오신 것을 환영합니다.\nhelp 를 입력하면 쓸 수 있는 명령어가 나옵니다.\nLast login: Wed Nov  4 12:40:05 2026 from 10.0.0.25</span>\n');
  out.innerHTML = T.out.join('\n') + '\n'; out.scrollTop = out.scrollHeight;
  const inp = $('#ttyIn');
  const ps = () => { $('#ttyPs').innerHTML = promptHTML(); };
  ps();
  $('#tty').addEventListener('click', () => { if (!window.getSelection().toString()) inp.focus(); });
  inp.addEventListener('keydown', e => {
    if (e.key === 'Enter') { const v = inp.value; inp.value = ''; run(v); if (v.trim()) checkMission(); ps(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (T.hi > 0) { T.hi--; inp.value = T.hist[T.hi] || ''; } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (T.hi < T.hist.length) { T.hi++; inp.value = T.hist[T.hi] || ''; } }
    else if (e.key === 'Tab') { e.preventDefault(); complete(inp); }
    else if (e.key === 'c' && e.ctrlKey && !window.getSelection().toString()) { e.preventDefault(); tPrint(promptHTML() + ' ' + esc(inp.value) + '^C', true); inp.value = ''; }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); T.out = []; out.innerHTML = ''; }
  });
  $('#tReset').onclick = () => { T = initT(); vTerm(); toast('파일·서비스·디스크를 처음 상태로 돌렸습니다 (미션 진도는 유지)'); };
  drawMissions();
  if (window.matchMedia('(min-width: 881px)').matches) inp.focus({ preventScroll: true });
}
function complete(inp) {
  const v = inp.value, parts = v.split(' '), last = parts[parts.length - 1];
  let cands;
  const prev = parts[parts.length - 2], prev2 = parts[parts.length - 3];
  const first = parts.length === 1 || (parts.length === 2 && parts[0] === 'sudo') || prev === '|' || (prev === 'sudo' && prev2 === '|');
  if (first) cands = Object.keys(MAN).concat(['sudo', 'll', 'exit', 'man', 'help']).filter(c => c.startsWith(last));
  else {
    const i = last.lastIndexOf('/'); const dirPart = i >= 0 ? last.slice(0, i + 1) : ''; const base = i >= 0 ? last.slice(i + 1) : last;
    const dn = getNode(norm(dirPart || '.', curUser()));
    if (!dn || dn.t !== 'd') return;
    cands = Object.keys(dn.c).filter(k => k.startsWith(base) && (base.startsWith('.') || !k.startsWith('.'))).map(k => dirPart + k + (dn.c[k].t === 'd' ? '/' : ''));
  }
  if (cands.length === 1) { parts[parts.length - 1] = cands[0]; inp.value = parts.join(' ') + (cands[0].endsWith('/') ? '' : ' '); }
  else if (cands.length > 1) {
    tPrint(promptHTML() + ' ' + esc(v) + '\n' + cands.map(esc).join('  '), true);
    let pre = cands[0]; cands.forEach(c => { while (!c.startsWith(pre)) pre = pre.slice(0, -1); });
    if (pre.length > last.length) { parts[parts.length - 1] = pre; inp.value = parts.join(' '); }
  }
}
