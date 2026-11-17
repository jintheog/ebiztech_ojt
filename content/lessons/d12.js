OJT.lesson({
id:'d12', week:4, day:'12', tag:'일차 12', mins:'약 3시간',
title:'Storage 기초 Ⅱ: File·NAS, NFS·SMB, Object Storage와 S3 API',
cover:[['File/NAS','s2'],['NFS','s3'],['SMB','s3'],['Object Storage','s4'],['S3 API','s5'],['Block·File·Object 차이 비교','s6']],
act:'Block·File·Object 차이 비교',
goal:['Block, File, Object Storage가 같은 파일을 어떻게 다르게 저장하고 꺼내는지 설명할 수 있다','File Storage와 NAS가 무엇이고 여러 서버가 같은 파일을 함께 쓸 수 있는 이유를 설명할 수 있다','NFS와 SMB를 주로 쓰는 OS, 서버에 붙이는 방법, 권한을 다루는 방식으로 비교할 수 있다','Object Storage의 버킷, 객체, 키, 메타데이터와 HTTP로 접근하는 방식을 설명할 수 있다','용도에 맞는 저장 방식을 고르고 그 이유를 말할 수 있다'],
terms:[
['File Storage','File Storage','파일과 디렉터리(폴더) 구조 그대로 저장 공간을 내주는 방식. 여러 서버가 같은 파일을 함께 쓸 수 있다.'],
['NAS','Network Attached Storage','네트워크로 연결해 File Storage를 제공하는 저장 장치나 서비스.'],
['공유','Share / Export','NAS가 서버들에 내주는 디렉터리 하나. NFS에서는 Export, SMB에서는 Share라고 부른다.'],
['NFS','Network File System','네트워크로 파일을 공유하는 프로토콜. 주로 Linux·Unix에서 쓴다. 기본 포트 TCP 2049.'],
['SMB','Server Message Block','네트워크로 파일을 공유하는 프로토콜. 주로 Windows에서 쓴다. 기본 포트 TCP 445. 예전 이름은 CIFS.'],
['마운트 포인트','Mount Point','NAS의 공유를 붙일 서버의 디렉터리. 예: /mnt/share'],
['UID·GID 매핑','UID / GID Mapping','NFS에서 파일의 주인을 사용자 이름이 아니라 번호(UID·GID)로 맞추는 것. 서버마다 번호가 같아야 권한이 맞다.'],
['ACL','Access Control List','파일이나 공유마다 "누가 무엇을 할 수 있는지"를 사용자·그룹별로 적은 목록. SMB에서 주로 쓴다.'],
['Active Directory','Active Directory (AD)','Windows 환경에서 사용자와 그룹 계정을 한곳에서 관리하는 서비스. SMB 공유의 권한을 이 계정으로 준다.'],
['Object Storage','Object Storage','파일을 디렉터리 없이 "객체"로 통째로 저장하고, HTTP로 키를 지정해 올리고 내려받는 방식.'],
['객체','Object','Object Storage에 저장하는 단위. 데이터, 메타데이터, 키로 이루어진다.'],
['버킷','Bucket','객체를 담는 가장 위의 그릇. 버킷 안에는 디렉터리 없이 객체만 있다.'],
['키','Key','버킷 안에서 객체를 구분하는 이름. 예: images/2026/logo.png. 슬래시가 있어도 디렉터리가 아니라 이름의 일부다.'],
['메타데이터','Metadata','데이터에 대한 정보. 크기, 종류, 만든 시각, 사용자가 붙인 태그 등.'],
['S3 API','Amazon S3 Application Programming Interface','AWS의 Object Storage(S3)를 쓰는 HTTP 요청 규칙. 많은 Object Storage가 같은 규칙을 지원해서 사실상 표준이 되었다.'],
['액세스 키 / 시크릿 키','Access Key / Secret Key','Object Storage에 요청할 때 누구인지 증명하는 열쇠 한 쌍. 시크릿 키는 비밀번호처럼 다룬다.'],
['엔드포인트','Endpoint','API 요청을 보낼 주소. 예: https://s3.example.com'],
['PUT / GET','HTTP PUT / GET','Object Storage에서 객체를 올리는 요청 / 내려받는 요청.']
],
body:`
<h2 id="s1">같은 파일을 세 방식으로 저장하기</h2>
<p><a data-lesson="d11"></a>에서 서버에 디스크 한 개처럼 보이는 <b>Block Storage</b>를 배웠습니다. 저장 방식은 두 가지가 더 있습니다. 여러 서버가 함께 쓰는 공유 폴더로 보이는 <b>File Storage</b>와, 주소로 파일을 통째로 올리고 내려받는 <b>Object Storage</b>입니다. 이 레슨의 중심은 이 세 가지를 비교하는 것입니다.</p>
<p>같은 파일 <code>report.pdf</code> 하나를 세 방식으로 저장하면 이렇게 다릅니다.</p>
<div class="tier-cmp">
<figure>
<svg class="fig" viewBox="0 0 220 280" role="img" aria-label="Block 방식: 서버의 파일시스템이 report.pdf를 블록 여러 개로 나눠 기록한다. 스토리지는 몇 번 블록인지만 알고, 그것이 report.pdf라는 것은 모른다.">
<text x="110" y="22" class="c b">Block</text>
<rect x="20" y="36" width="180" height="40" rx="6" class="bx-n"/><text x="110" y="62" class="c t-m">서버의 파일시스템</text>
<line x1="110" y1="78" x2="110" y2="100" class="ln" marker-end="url(#ar)"/>
<rect x="30" y="106" width="34" height="30" class="bx-n"/><rect x="72" y="106" width="34" height="30" class="bx-a"/><rect x="114" y="106" width="34" height="30" class="bx-a"/><rect x="156" y="106" width="34" height="30" class="bx-n"/>
<rect x="30" y="144" width="34" height="30" class="bx-a"/><rect x="72" y="144" width="34" height="30" class="bx-n"/><rect x="114" y="144" width="34" height="30" class="bx-n"/><rect x="156" y="144" width="34" height="30" class="bx-n"/>
<text x="110" y="204" class="c t-s">파란 블록 3개가</text><text x="110" y="226" class="c t-s">report.pdf</text>
<text x="110" y="256" class="c t-m">스토리지는</text><text x="110" y="276" class="c t-m">블록 번호만 앎</text>
</svg>
<figcaption>블록 번호로 읽고 씀</figcaption>
</figure>
<figure>
<svg class="fig" viewBox="0 0 220 280" role="img" aria-label="File 방식: NAS가 디렉터리 구조를 가지고 있고, report.pdf는 /share/docs/report.pdf라는 경로에 있다. 서버 여러 대가 같은 경로로 이 파일을 연다.">
<text x="110" y="22" class="c b">File</text>
<rect x="20" y="36" width="180" height="40" rx="6" class="bx-n"/><text x="110" y="62" class="c t-m">NAS의 디렉터리</text>
<text x="34" y="106" class="t-m">/share</text>
<line x1="44" y1="114" x2="44" y2="134" class="ln"/><line x1="44" y1="134" x2="60" y2="134" class="ln"/><text x="64" y="140" class="t-m">docs</text>
<line x1="74" y1="148" x2="74" y2="168" class="ln"/><line x1="74" y1="168" x2="90" y2="168" class="ln"/>
<rect x="92" y="152" width="112" height="30" class="bx-a"/><text x="148" y="173" class="c t-m">report.pdf</text>
<text x="110" y="226" class="c t-s">경로로 찾음</text>
<text x="110" y="256" class="c t-m">여러 서버가</text><text x="110" y="276" class="c t-m">같은 경로로 엶</text>
</svg>
<figcaption>경로로 열고 고침</figcaption>
</figure>
<figure>
<svg class="fig" viewBox="0 0 220 280" role="img" aria-label="Object 방식: 버킷 company-docs 안에 객체 하나가 있다. 객체는 키 docs/report.pdf, 데이터, 메타데이터로 이루어진다. HTTP 주소로 통째로 올리고 내려받는다.">
<text x="110" y="22" class="c b">Object</text>
<rect x="14" y="36" width="192" height="168" rx="8" class="zone"/><text x="110" y="60" class="c t-m">버킷 company-docs</text>
<rect x="28" y="72" width="164" height="118" rx="4" class="bx-a"/>
<text x="38" y="96" class="t-m">키:</text><text x="38" y="118" class="t-m">docs/report.pdf</text>
<text x="38" y="146" class="t-m">데이터</text><text x="38" y="174" class="t-m">메타데이터</text>
<text x="110" y="226" class="c t-s">HTTP 주소로</text>
<text x="110" y="256" class="c t-m">통째로 올리고</text><text x="110" y="276" class="c t-m">통째로 받음</text>
</svg>
<figcaption>키로 통째로 주고받음</figcaption>
</figure>
</div>
<ul><li><b>Block</b>: 스토리지는 블록 번호만 압니다. 어느 블록이 <code>report.pdf</code>인지는 <b>서버의 파일시스템</b>이 정리합니다. 그래서 서버 한 대가 씁니다.</li><li><b>File</b>: <b>NAS가 디렉터리 구조와 파일 이름을 직접 관리</b>합니다. 서버는 <code>/share/docs/report.pdf</code> 같은 경로로 파일을 엽니다. 여러 서버가 같은 경로로 같은 파일을 볼 수 있습니다.</li><li><b>Object</b>: 디렉터리 없이 <b>버킷</b> 안에 <b>객체</b>로 통째로 넣습니다. 객체는 키(이름), 데이터, 메타데이터로 이루어지고, HTTP로 주고받습니다.</li></ul>
<p>세 방식의 자세한 비교는 뒤의 <a href="#d12" data-sec="s6">「종합 비교」 절</a>에서 표로 정리합니다. 먼저 File Storage부터 봅니다.</p>

<h2 id="s2">File Storage와 NAS</h2>
<p><b>File Storage</b>는 파일과 디렉터리 구조 그대로 저장 공간을 내주는 방식입니다. 이 방식을 제공하는 장비나 서비스를 <b>NAS</b><span class="small muted">(Network Attached Storage)</span>라고 합니다. <a data-lesson="d01"></a>에서 "네트워크로 연결하는 공유 폴더(파일 단위)"로 한 줄 봤던 것입니다.</p>
<p>Block Storage와의 가장 큰 차이는 <b>파일시스템이 어디에 있느냐</b>입니다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>Block Storage</th><th>File Storage (NAS)</th></tr></thead><tbody>
<tr><td class="nw"><b>파일시스템</b></td><td>서버가 만든다(mkfs)</td><td><b>NAS가 가지고 있다</b>. 서버는 만들지 않는다</td></tr>
<tr><td class="nw"><b>서버가 보내는 요청</b></td><td>"몇 번 블록을 읽어라"</td><td>"이 경로의 파일을 열어라, 읽어라"</td></tr>
<tr><td class="nw"><b>서버에 보이는 모양</b></td><td>새 디스크(<code>lsblk</code>)</td><td>마운트한 디렉터리(<code>df -h</code>)</td></tr>
<tr><td class="nw"><b>여러 서버가 동시에</b></td><td>안 됨(<a data-lesson="d11"></a>)</td><td><b>됨</b></td></tr>
</tbody></table></div>
<p>파일시스템을 NAS 한 곳이 관리하므로, 서버 A가 파일을 고치면 서버 B도 바로 그 변경을 봅니다. 누가 어떤 파일을 쓰고 있는지도 NAS가 관리합니다. 그래서 여러 서버가 같은 파일을 안전하게 함께 쓸 수 있습니다.</p>
<p><b>공유</b>: NAS가 서버들에 내주는 디렉터리 하나를 공유라고 합니다. NFS에서는 <b>Export</b>, SMB에서는 <b>Share</b>라고 부릅니다. NAS에서 공유마다 "어느 서버(또는 사용자)가 읽기만 할지, 쓰기도 할지"를 정합니다.</p>
<h3>쓰는 곳</h3>
<ul><li><b>여러 서버가 함께 쓰는 파일</b>: Web 서버 여러 대가 같은 이미지·업로드 파일을 보여 줘야 할 때(<a data-lesson="d01"></a>의 이중화 구성)</li><li><b>부서 공유 폴더</b>: 사람들이 문서를 함께 열고 고치는 곳</li><li><b>홈 디렉터리</b>: 어느 서버에 로그인해도 같은 내 파일이 보이게 할 때</li></ul>
<div class="box analogy"><span class="lbl">비유로 보면</span>File Storage는 사무실의 공용 서류함과 비슷합니다. 서랍(디렉터리)과 서류 이름표(파일 이름)는 서류함이 가지고 있고, 여러 사람이 와서 같은 서류를 꺼내 봅니다.</div>
<p class="small muted">File Storage는 파일을 열 때마다 네트워크를 거치고 NAS가 잠금과 권한을 확인하므로, 같은 조건이면 Block Storage보다 느린 편입니다. DB처럼 아주 잦은 작은 읽기·쓰기에는 보통 Block Storage를 씁니다.</p>

<h2 id="s3">NFS와 SMB: 파일을 공유하는 두 가지 프로토콜</h2>
<p>서버가 NAS의 파일을 열고 읽으려면 둘이 같은 약속을 써야 합니다. 대표적인 프로토콜이 <b>NFS</b>와 <b>SMB</b>입니다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>NFS</th><th>SMB</th></tr></thead><tbody>
<tr><td class="nw"><b>이름</b></td><td>Network File System</td><td>Server Message Block. 예전 이름 CIFS</td></tr>
<tr><td class="nw"><b>주로 쓰는 OS</b></td><td>Linux, Unix</td><td>Windows</td></tr>
<tr><td class="nw"><b>기본 포트</b></td><td>TCP 2049</td><td>TCP 445</td></tr>
<tr><td class="nw"><b>서버에서 붙이는 방법</b></td><td><code>mount -t nfs</code>로 디렉터리에 마운트</td><td>Windows는 네트워크 드라이브 연결(<code>\\\\NAS\\share</code>), Linux는 <code>mount -t cifs</code></td></tr>
<tr><td class="nw"><b>권한을 다루는 방식</b></td><td><b>서버(호스트)의 IP 주소</b>로 공유 접근을 허용하고, 파일 권한은 <b>UID·GID 번호</b>로 맞춘다</td><td><b>사용자 계정</b>으로 로그인하고, 파일 권한은 <b>ACL</b>로 준다. Active Directory 계정과 연동하는 일이 많다</td></tr>
</tbody></table></div>
<p class="small muted">CIFS: Common Internet File System · ACL: Access Control List. 포트는 <a data-lesson="d09"></a>, 방화벽에서 이 포트를 허용하는 것은 <a data-lesson="d10"></a>에서 배웠습니다. Linux에서 SMB 공유를 붙이려면 cifs-utils 같은 패키지가 필요할 수 있습니다.</p>
<h3>NFS: Linux 서버에 붙이기</h3>
<p>NFS 공유는 <a data-lesson="d06"></a>에서 디스크를 붙이던 것과 같은 <code>mount</code> 명령으로 붙입니다. 다른 점은 장치 이름 자리에 <b>NAS의 주소와 공유 경로</b>를 쓰고, <b>mkfs를 하지 않는다</b>는 것입니다. 파일시스템은 NAS에 이미 있기 때문입니다. 아래는 학습용 예시이고, 주소와 경로는 지어낸 값입니다.</p>
<pre class="code"><span class="c"># 마운트 포인트 만들기</span>
sudo mkdir -p /mnt/share
<span class="c"># NAS주소:공유경로 를 /mnt/share 에 붙이기</span>
sudo mount -t nfs 10.0.5.20:/exports/share /mnt/share
<span class="c"># 붙었는지 확인. 장치 자리에 NAS 주소가 보임</span>
df -h /mnt/share</pre>
<p>재부팅해도 붙도록 <code>/etc/fstab</code>에 등록합니다(<a data-lesson="d06"></a>). 네트워크가 준비된 뒤에 붙도록 <code>_netdev</code>를 넣습니다.</p>
<pre class="code">10.0.5.20:/exports/share  /mnt/share  nfs  defaults,_netdev  0 0</pre>
<p class="small muted">Linux에서 NFS 공유를 붙이려면 nfs-utils(Rocky Linux)나 nfs-common(Ubuntu) 같은 패키지가 필요할 수 있습니다. NFS에는 v3, v4 같은 버전이 있고, 버전에 따라 옵션과 동작이 조금씩 다릅니다.</p>
<h3>권한을 다루는 방식의 차이</h3>
<ul><li><b>NFS</b>: NAS는 먼저 <b>어느 서버가 접속했는지(IP 주소)</b>를 보고 공유 접근을 허용합니다. 그다음 파일의 주인은 사용자 이름이 아니라 <b>UID·GID 번호</b>로 확인합니다(<a data-lesson="d04"></a>). 그래서 서버 A의 <code>kim</code>(UID 1001)과 서버 B의 <code>lee</code>(UID 1001)는 NAS에서 같은 사람으로 보입니다. 여러 서버에서 같은 사용자는 같은 UID를 쓰게 맞춰야 합니다.</li><li><b>SMB</b>: 사용자가 <b>계정과 비밀번호로 로그인</b>하고, 파일과 폴더마다 <b>ACL</b>로 "이 사용자·그룹은 읽기, 저 그룹은 쓰기"를 정합니다. 회사에서는 Active Directory의 계정으로 권한을 주는 일이 많습니다.</li></ul>
<div class="box warn"><span class="lbl">흔한 문제</span><ul><li><b>마운트는 되는데 파일을 못 고칩니다.</b> 공유가 읽기 전용으로 허용되었거나, 서버의 UID와 NAS 파일의 주인 UID가 다른 경우가 흔합니다. NFS에서 root는 보통 NAS 쪽에서 권한이 낮은 사용자로 바뀝니다(root squash).</li><li><b>마운트가 안 됩니다.</b> 원인은 여러 가지입니다. NAS가 이 서버의 IP 주소를 허용하지 않았거나, 2049번(SMB는 445번) 포트가 막혔거나, 공유 경로가 틀렸거나, 필요한 패키지가 없을 수 있습니다. <a data-lesson="d09"></a>의 순서(주소 → 포트 → 경로)로 확인합니다.</li><li><b>NAS와의 연결이 끊기면</b> 그 디렉터리를 쓰는 프로그램이 멈추거나 오류를 낼 수 있습니다.</li></ul></div>

<h2 id="s4">Object Storage: 버킷, 객체, 키, 메타데이터</h2>
<p><b>Object Storage</b>는 파일을 디렉터리 없이 <b>객체</b>로 통째로 저장하고, HTTP로 이름(키)을 지정해 올리고 내려받는 방식입니다. 서버에 디스크나 디렉터리로 붙지 않고, 프로그램이 인터넷 주소로 요청을 보내서 씁니다.</p>
<div class="tbl-wrap"><table><thead><tr><th>이름</th><th>뜻</th><th>예</th></tr></thead><tbody>
<tr><td class="nw"><b>버킷</b></td><td>객체를 담는 가장 위의 그릇. 권한과 설정을 버킷 단위로 정하는 일이 많음</td><td><code>company-docs</code></td></tr>
<tr><td class="nw"><b>객체</b></td><td>저장하는 단위. 데이터 + 메타데이터 + 키</td><td>파일 하나</td></tr>
<tr><td class="nw"><b>키</b></td><td>버킷 안에서 객체를 구분하는 이름</td><td><code>docs/2026/report.pdf</code></td></tr>
<tr><td class="nw"><b>메타데이터</b></td><td>데이터에 대한 정보. 시스템이 붙이는 것(크기, 종류, 만든 시각)과 사용자가 붙이는 것(태그)이 있음</td><td><code>Content-Type: application/pdf</code></td></tr>
</tbody></table></div>
<h3>디렉터리가 없다</h3>
<p>키 <code>docs/2026/report.pdf</code>에는 슬래시가 있지만, <b>docs나 2026이라는 디렉터리는 없습니다</b>. 슬래시까지 포함한 전체가 이름 하나입니다. 버킷 안은 칸막이 없이 평평하고, 객체가 이름표를 달고 놓여 있을 뿐입니다. 화면이나 도구가 슬래시를 기준으로 폴더처럼 보여 주는 것은 보기 편하게 하려는 것입니다. 키의 앞부분(<code>docs/2026/</code>)을 <b>접두사</b><span class="small muted">(Prefix)</span>라고 하고, "이 접두사로 시작하는 객체 목록"처럼 검색할 때 씁니다.</p>
<h3>통째로 올리고 통째로 받는다</h3>
<ul><li>객체는 <b>통째로</b> 올리고(PUT) <b>통째로</b> 받습니다(GET). File Storage처럼 파일의 가운데 일부만 고쳐 쓸 수 없습니다. 고치려면 고친 파일을 같은 키로 <b>다시 올려서 바꿉니다</b>.</li><li>그래서 자주 조금씩 고치는 데이터(DB, 실행 중인 프로그램의 파일)에는 맞지 않습니다. 한 번 쓰고 여러 번 읽는 데이터에 맞습니다.</li></ul>
<h3>왜 쓰나</h3>
<ul><li><b>아주 많이, 아주 크게</b> 저장할 수 있습니다. 디렉터리 구조를 관리하지 않아서 객체가 수십억 개로 늘어나도 다루기 쉽습니다.</li><li><b>HTTP로 어디서든</b> 접근합니다. 서버에 마운트하지 않아도 되고, 웹 브라우저나 프로그램이 주소로 바로 내려받을 수 있습니다.</li><li><b>메타데이터</b>를 붙여서 객체를 분류하고 찾을 수 있습니다.</li><li>보통 같은 용량이면 Block·File보다 저렴하게 운영합니다.</li></ul>
<p><b>쓰는 곳</b>: 사진·동영상 같은 웹 콘텐츠, 백업 파일과 보관 자료(<a data-lesson="d13"></a>), 로그 모음, 데이터 분석용 원본 자료(데이터 레이크).</p>
<div class="box analogy"><span class="lbl">비유로 보면</span>Object Storage는 물품 보관소와 비슷합니다. 짐(데이터)을 통째로 맡기면 번호표(키)를 받고, 짐에는 꼬리표(메타데이터)를 붙입니다. 짐을 찾을 때도 통째로 찾고, 보관소 안에서 짐을 풀어 일부만 바꿀 수는 없습니다.</div>

<h2 id="s5">HTTP로 접근하기와 S3 API</h2>
<p>Object Storage에는 HTTP 요청으로 접근합니다(<a data-lesson="d10"></a>). 요청 하나가 "어느 버킷의 어느 키를 어떻게 하라"입니다.</p>
<div class="tbl-wrap"><table><thead><tr><th>HTTP 메서드</th><th>하는 일</th></tr></thead><tbody>
<tr><td><code>PUT</code></td><td>객체 올리기 (같은 키가 있으면 바꿔 씀)</td></tr>
<tr><td><code>GET</code></td><td>객체 내려받기, 버킷의 객체 목록 보기</td></tr>
<tr><td><code>HEAD</code></td><td>데이터 없이 메타데이터만 보기</td></tr>
<tr><td><code>DELETE</code></td><td>객체 지우기</td></tr>
</tbody></table></div>
<p>요청을 보낼 주소를 <b>엔드포인트</b>라고 합니다. 요청에는 <b>액세스 키</b>로 만든 서명을 붙여서 "누가 보낸 요청인지"를 증명합니다. 버킷과 객체에 허용된 사용자만 읽고 쓸 수 있습니다.</p>
<p>아래는 HTTP 요청의 모양을 보여 주는 <b>학습용 예시</b>입니다. 엔드포인트와 이름은 지어낸 값이고, 서명 값은 줄였습니다.</p>
<pre class="code"><span class="c"># 객체 올리기</span>
PUT /company-docs/docs/report.pdf HTTP/1.1
Host: s3.example.com
Content-Type: application/pdf
Authorization: AWS4-HMAC-SHA256 Credential=액세스키/..., Signature=...

(파일 내용)

<span class="c"># 응답</span>
HTTP/1.1 200 OK</pre>
<p class="small muted">주소에 버킷 이름을 경로로 넣는 방식(<code>s3.example.com/company-docs/…</code>)과 호스트 이름 앞에 넣는 방식(<code>company-docs.s3.example.com/…</code>)이 있습니다. 어느 방식을 쓰는지는 제품과 설정에 따라 다릅니다.</p>
<h3>S3 API가 사실상 표준이 된 이유</h3>
<p><b>S3</b><span class="small muted">(Simple Storage Service)</span>는 AWS<span class="small muted">(Amazon Web Services)</span>의 Object Storage 서비스이고, <b>S3 API</b>는 그 서비스를 쓰는 HTTP 요청의 규칙입니다. 국제 표준 기관이 정한 규칙은 아니지만, 지금은 Object Storage의 사실상 표준입니다.</p>
<ul><li><b>먼저, 널리 쓰였습니다.</b> S3는 2006년에 공개된 뒤 많은 서비스와 회사가 Object Storage로 쓰기 시작했습니다.</li><li><b>도구가 S3 API에 맞춰졌습니다.</b> 백업 프로그램, 분석 도구, 프로그래밍 언어의 라이브러리, 명령줄 도구가 S3 API로 말하도록 만들어졌습니다.</li><li><b>그래서 다른 제품도 같은 규칙을 지원합니다.</b> 이것을 <b>S3 호환</b>이라고 합니다. 프로그램은 그대로 두고 <b>엔드포인트와 키만 바꾸면</b> 다른 Object Storage로 옮겨 갈 수 있습니다. 쓰는 사람은 도구를 다시 만들 필요가 없고, 제품을 만드는 쪽은 이미 있는 도구를 그대로 쓸 수 있게 됩니다.</li></ul>
<p class="small muted">S3 호환 제품이라도 S3 API의 모든 기능을 똑같이 지원하지는 않을 수 있습니다. 쓰려는 기능이 지원되는지 제품의 문서에서 확인합니다.</p>
<h3>명령줄 도구로 해 보기</h3>
<p>AWS의 명령줄 도구(aws CLI)는 S3 호환 Object Storage에도 쓸 수 있습니다. <code>--endpoint-url</code>로 요청을 보낼 곳을 바꿉니다. 아래는 <b>학습용 예시</b>이고, 엔드포인트와 버킷 이름은 지어낸 값입니다.</p>
<pre class="code"><span class="c"># 액세스 키와 시크릿 키를 한 번 등록하고, 엔드포인트 주소를 변수 E에 넣기</span>
aws configure
E=https://s3.example.com
<span class="c"># 버킷 만들기 (make bucket)</span>
aws s3 mb s3://company-docs --endpoint-url $E
<span class="c"># 올리기 (PUT)</span>
aws s3 cp report.pdf s3://company-docs/docs/report.pdf --endpoint-url $E
<span class="c"># 접두사 docs/ 로 시작하는 객체 목록</span>
aws s3 ls s3://company-docs/docs/ --endpoint-url $E
<span class="c"># 내려받기 (GET)</span>
aws s3 cp s3://company-docs/docs/report.pdf ./ --endpoint-url $E</pre>
<div class="box warn"><span class="lbl">주의할 점</span><ul><li><b>시크릿 키는 비밀번호와 같습니다.</b> 코드나 공개 저장소에 그대로 적지 않습니다. 새어 나갔으면 바로 키를 바꿉니다.</li><li><b>버킷을 누구나 읽을 수 있게(공개) 열면</b> 인터넷의 누구든 주소만 알면 내려받습니다. 공개가 꼭 필요한 객체가 아니면 열지 않습니다. <a data-lesson="d10"></a>의 "필요한 사람에게만 허용"과 같은 원칙입니다.</li><li><b>지운 객체는 기본적으로 되살릴 수 없습니다.</b> 지난 판을 남기는 버전 관리 같은 기능은 제품마다 다르고, 백업은 <a data-lesson="d13"></a>에서 배웁니다.</li></ul></div>

<h2 id="s6">종합 비교: Block, File, Object</h2>
<p>세 가지 저장 방식을 한 표로 비교합니다. 이 레슨에서 가장 중요한 표입니다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th></th><th>Block</th><th>File</th><th>Object</th></tr></thead><tbody>
<tr><td class="nw"><b>서버에 보이는 모양</b></td><td>빈 디스크 한 개(<code>lsblk</code>)</td><td>마운트한 공유 디렉터리(<code>df -h</code>)</td><td>보이지 않음. 엔드포인트 주소로 요청</td></tr>
<tr><td class="nw"><b>접근 단위</b></td><td>블록</td><td>파일 (일부만 읽고 고칠 수 있음)</td><td>객체 (통째로 올리고 받음)</td></tr>
<tr><td class="nw"><b>찾는 방법</b></td><td>블록 번호. 파일 이름은 서버의 파일시스템이 관리</td><td>디렉터리 경로</td><td>버킷 + 키 (디렉터리 없음)</td></tr>
<tr><td class="nw"><b>접근 방법</b></td><td>iSCSI, Fibre Channel, 클라우드의 Volume 연결</td><td>NFS, SMB</td><td>HTTP API (S3 API)</td></tr>
<tr><td class="nw"><b>파일시스템</b></td><td>서버가 만듦(mkfs)</td><td>NAS가 가지고 있음</td><td>없음</td></tr>
<tr><td class="nw"><b>여러 서버가 동시에 쓰기</b></td><td>안 됨 (Volume 하나는 서버 한 대)</td><td>됨</td><td>서로 다른 객체는 동시에 됨. 같은 키에 동시에 올리면 마지막 것만 남음</td></tr>
<tr><td class="nw"><b>장점</b></td><td>빠르고 지연이 짧음</td><td>여러 서버가 같은 파일을 함께 열고 고침</td><td>아주 많이 저장하고 어디서든 HTTP로 접근</td></tr>
<tr><td class="nw"><b>대표 용도</b></td><td>운영체제 디스크, DB, VM 디스크</td><td>공유 폴더, 여러 Web 서버가 함께 쓰는 파일, 홈 디렉터리</td><td>사진·동영상, 백업·보관, 로그, 데이터 레이크</td></tr>
<tr><td class="nw"><b>예</b></td><td>SAN의 LUN, 클라우드의 Block Volume</td><td>NAS의 공유</td><td>S3와 S3 호환 Object Storage</td></tr>
</tbody></table></div>
<p class="small muted">Object의 "동시 쓰기"는 File과 뜻이 다릅니다. 여러 서버가 <b>서로 다른 객체</b>를 동시에 올리고 받는 것은 문제가 없습니다. 하지만 <b>같은 키</b>에 두 서버가 동시에 올리면 마지막에 올린 것만 남고 앞의 것은 사라집니다. 객체는 일부만 고칠 수 없고 통째로 다시 올리기 때문입니다. 여러 서버가 같은 파일의 내용을 함께 고쳐야 하면 File Storage를 씁니다.</p>
<p class="small muted">AWS에서는 Block을 EBS(Elastic Block Store), File을 EFS(Elastic File System), Object를 S3로 제공합니다.</p>
<div class="box mem"><span class="lbl">외울 것: 고르는 기준</span><ul><li><b>서버 한 대가 빠르게 읽고 쓴다</b> → Block</li><li><b>여러 서버(사람)가 같은 파일을 함께 열고 고친다</b> → File</li><li><b>많은 파일을 쌓아 두고 HTTP로 주고받는다, 한 번 쓰고 여러 번 읽는다</b> → Object</li></ul></div>
<p>한 서비스 안에서 셋을 함께 쓰는 일이 흔합니다. 예를 들어 웹 쇼핑몰이라면 이렇게 나눕니다.</p>
<div class="tbl-wrap"><table><thead><tr><th>데이터</th><th>저장 방식</th><th>이유</th></tr></thead><tbody>
<tr><td>DB의 데이터 파일</td><td class="nw"><b>Block</b></td><td>잦은 작은 읽기·쓰기를 빠르게 해야 함</td></tr>
<tr><td>Web 서버 여러 대가 함께 보여 줄 설정·템플릿 파일</td><td class="nw"><b>File</b></td><td>여러 서버가 같은 파일을 봐야 함</td></tr>
<tr><td>상품 사진, 매일 밤의 백업 파일</td><td class="nw"><b>Object</b></td><td>양이 많고, 한 번 올리면 주로 읽기만 함</td></tr>
</tbody></table></div>

<h2 id="s7">Zadara에서는</h2>
<div class="box"><b class="small">회사 자료에서 확인한 것</b><ul style="margin-bottom:0"><li>Zadara zStorage는 VPSA<span class="small muted">(Virtual Private Storage Array)</span>로 Block, File, Object를 모두 제공합니다(<a data-lesson="d11"></a>).</li><li><b>File</b>은 NFS와 CIFS(SMB)로 제공하고, Active Directory와 연동할 수 있습니다.</li><li><b>Object</b>는 S3 API와 Swift API로 접근합니다. Swift는 OpenStack이라는 클라우드 소프트웨어의 Object Storage API입니다. Zadara의 Object Storage는 NGOS<span class="small muted">(Next Generation Object Storage)</span>라는 이름으로 소개되어 있습니다.</li><li>AWS의 EBS, EFS, S3에 해당하는 것이 zStorage의 Block, File, Object입니다.</li></ul></div>
<p class="small muted">공유를 만드는 화면, 접근 허용을 정하는 방법, Object Storage의 엔드포인트 주소와 키를 받는 절차는 회사 자료로 확인할 수 없어서 쓰지 않았습니다. <b>사내 실습 환경에서 확인</b>합니다. NAS 공유를 만들고 Linux에서 NFS로 마운트하는 실습은 <a data-lesson="zs3"></a>, 버킷을 만들고 객체를 올리고 내려받는 실습은 <a data-lesson="zs4"></a>에서 합니다. 클라우드가 어떤 것까지 관리해 주는지(서비스 모델)는 <a data-lesson="d14"></a>에서 배웁니다.</p>

<h2 id="s8">직접 해 보기</h2>
<p>손노트에 풀어 보세요. 먼저 풀고 나서, 문제 아래의 「답 보기」를 눌러 확인합니다.</p>
<h3>1. 어느 저장 방식을 쓸까</h3>
<p>아래 데이터마다 Block, File, Object 가운데 알맞은 것을 고르고 이유를 한 줄로 적어 보세요.</p>
<ol><li>MySQL DB의 데이터 파일</li><li>Web 서버 4대가 함께 쓰는, 사용자가 올린 첨부 파일</li><li>매일 밤 만드는 백업 파일을 1년 동안 보관</li><li>부서원 20명이 함께 열고 고치는 문서 폴더(Windows PC)</li><li>모바일 앱에서 내려받는 상품 이미지 수백만 개</li></ol>
<details class="fold"><summary>답 보기</summary><p class="small muted">① Block. 잦은 작은 읽기·쓰기를 빠르게 해야 하고 서버 한 대가 씁니다. ② File(NFS). 여러 서버가 같은 파일을 봐야 합니다. 프로그램이 S3 API를 쓰도록 만들 수 있다면 Object도 많이 씁니다. ③ Object. 양이 많고 한 번 쓰고 보관만 합니다. ④ File(SMB). Windows에서 여러 사람이 같은 파일을 열고 고칩니다. ⑤ Object. 아주 많고, HTTP로 바로 내려받습니다.</p></details>
<h3>2. NFS와 SMB 구분하기</h3>
<p>아래 설명이 NFS의 것인지 SMB의 것인지 적어 보세요.</p>
<ol><li>Windows에서 <code>\\\\nas01\\share</code>로 네트워크 드라이브를 연결한다.</li><li>NAS가 접속한 서버의 IP 주소로 공유 접근을 허용한다.</li><li>파일 권한을 사용자 계정의 ACL로 준다.</li><li>기본 포트가 TCP 2049다.</li><li>서버마다 같은 사용자의 UID를 맞춰야 권한이 맞다.</li></ol>
<details class="fold"><summary>답 보기</summary><p class="small muted">① SMB ② NFS ③ SMB ④ NFS(SMB는 445) ⑤ NFS. NFS는 파일의 주인을 이름이 아니라 UID 번호로 확인하기 때문입니다.</p></details>
<h3>3. 키와 디렉터리</h3>
<p>버킷 <code>logs</code>에 키가 <code>web01/2026/11/access.log</code>인 객체가 있습니다. 이 버킷에 <code>web01</code>이라는 디렉터리가 있나요? <code>aws s3 ls s3://logs/web01/2026/</code>는 무엇을 보여 주나요?</p>
<details class="fold"><summary>답 보기</summary><p class="small muted">디렉터리는 없습니다. <code>web01/2026/11/access.log</code> 전체가 객체의 이름(키) 하나입니다. 이 명령은 키가 <code>web01/2026/</code>(접두사)으로 시작하는 객체들을 보여 줍니다. 도구가 슬래시를 기준으로 폴더처럼 묶어서 보여 줄 뿐입니다.</p></details>
<h3>4. 상황 판단하기</h3>
<ol><li>Block Volume 하나를 Web 서버 두 대에 동시에 마운트해서 업로드 파일을 공유하려고 합니다. 괜찮은가요?</li><li>NFS 공유를 마운트했는데 파일을 만들려고 하면 "Permission denied"가 나옵니다. 무엇을 확인하나요?</li><li>동료가 시크릿 키를 테스트 코드에 적어서 공개 저장소에 올렸습니다. 어떻게 해야 하나요?</li></ol>
<details class="fold"><summary>답 보기</summary><p class="small muted">① 안 됩니다. 일반 파일시스템으로 만든 Block Volume을 두 서버가 동시에 쓰면 서로 덮어써서 데이터가 깨집니다. File Storage(NFS)나 Object Storage를 씁니다. ② 공유가 이 서버에 읽기 전용으로 허용되었는지, 내 UID와 디렉터리 주인의 UID가 맞는지, root로 했다면 NAS가 root를 낮은 권한의 사용자로 바꿨는지(root squash)를 확인합니다. ③ 키가 이미 새어 나갔다고 보고 바로 그 키를 사용하지 못하게 하고 새 키를 발급합니다. 코드에서 키를 지우는 것만으로는 부족합니다. 저장소의 기록에 남아 있기 때문입니다.</p></details>
`,
summary:['같은 파일을 Block은 블록 번호로(파일시스템은 서버), File은 디렉터리 경로로(파일시스템은 NAS), Object는 버킷+키로 통째로(디렉터리 없음) 저장한다.','File Storage는 파일·디렉터리 구조 그대로 내주고 NAS가 파일시스템을 가진다. 그래서 여러 서버가 같은 파일을 함께 쓸 수 있다. 서버는 mkfs 없이 mount만 한다.','NFS: Linux·Unix, TCP 2049, mount -t nfs, 서버 IP로 접근 허용, 파일 권한은 UID·GID 번호. SMB: Windows, TCP 445, 네트워크 드라이브(Linux는 mount -t cifs), 사용자 계정과 ACL, Active Directory 연동.','Object Storage: 버킷 안에 객체(데이터+메타데이터+키). 키의 슬래시는 디렉터리가 아니라 이름의 일부(접두사). 통째로 올리고(PUT) 받는다(GET). 일부만 고칠 수 없다.','Object Storage는 HTTP로 엔드포인트에 요청하고 액세스 키로 서명한다. S3 API는 먼저 널리 쓰였고 도구가 그에 맞춰져서 사실상 표준이 됐다. S3 호환이면 엔드포인트와 키만 바꿔 옮길 수 있다.','고르는 기준: 서버 한 대가 빠르게 → Block, 여러 서버가 같은 파일을 함께 → File, 많이 쌓고 HTTP로 주고받기 → Object. 한 서비스에서 셋을 함께 쓰는 일이 흔하다.','시크릿 키는 비밀번호처럼 다루고, 버킷은 필요할 때만 공개한다. zStorage는 File을 NFS·CIFS(+AD)로, Object를 S3·Swift API로 제공한다(NGOS). 실습은 [[zs3]], [[zs4]].'],
essay:[
{q:'같은 파일 하나를 Block, File, Object Storage에 저장할 때 각각 어떻게 저장되고 어떻게 다시 찾는지 비교해 설명해 보세요.',a:'Block Storage에서는 서버의 파일시스템이 파일을 블록 여러 개로 나눠 기록하고, 스토리지는 몇 번 블록인지만 안다. 어느 블록이 그 파일인지는 서버의 파일시스템이 관리하므로 서버 한 대가 쓴다. File Storage에서는 NAS가 디렉터리 구조와 파일 이름을 직접 관리하고, 서버는 /share/docs/report.pdf 같은 경로로 파일을 열고 일부를 읽거나 고친다. 여러 서버가 같은 경로로 같은 파일을 볼 수 있다. Object Storage에서는 디렉터리 없이 버킷 안에 객체로 통째로 넣는다. 객체는 키(이름), 데이터, 메타데이터로 이루어지고, HTTP로 키를 지정해 통째로 올리고 받는다.'},
{q:'File Storage(NAS)를 쓰면 여러 서버가 같은 파일을 함께 쓸 수 있는 이유를 Block Storage와 비교해 설명해 보세요.',a:'Block Storage는 파일시스템을 서버가 만들고 관리하므로, 두 서버가 같은 Volume을 동시에 쓰면 서로의 기록을 모른 채 덮어써서 데이터가 깨진다. File Storage는 파일시스템을 NAS 한 곳이 가지고 있고, 서버들은 블록이 아니라 "이 경로의 파일을 열어라, 읽어라"라고 요청한다. 누가 어떤 파일을 쓰는지와 변경 내용을 NAS가 한곳에서 관리하므로, 서버 A가 고친 내용을 서버 B도 바로 보고 여러 서버가 안전하게 함께 쓸 수 있다. 그래서 서버는 mkfs를 하지 않고 NAS의 공유를 mount만 한다.'},
{q:'NFS와 SMB를 주로 쓰는 OS, 서버에서 붙이는 방법, 권한을 다루는 방식으로 비교해 보세요.',a:'NFS는 주로 Linux와 Unix에서 쓰고 기본 포트는 TCP 2049다. Linux 서버에서 mount -t nfs NAS주소:공유경로 마운트포인트로 붙이고, fstab에는 _netdev 옵션을 넣어 등록한다. 권한은 NAS가 먼저 접속한 서버의 IP 주소로 공유 접근을 허용하고, 파일의 주인은 사용자 이름이 아니라 UID·GID 번호로 확인한다. 그래서 여러 서버에서 같은 사용자의 UID를 맞춰야 한다. SMB는 주로 Windows에서 쓰고 기본 포트는 TCP 445이며 예전 이름은 CIFS다. Windows에서는 \\\\NAS\\share로 네트워크 드라이브를 연결하고, Linux에서는 mount -t cifs로 붙인다. 사용자가 계정으로 로그인하고 파일과 폴더마다 ACL로 권한을 주며, Active Directory 계정과 연동하는 일이 많다.'},
{q:'Object Storage의 버킷, 객체, 키, 메타데이터를 설명하고, 키에 슬래시가 있어도 디렉터리가 아닌 이유를 말해 보세요.',a:'버킷은 객체를 담는 가장 위의 그릇이고, 권한과 설정을 버킷 단위로 정하는 일이 많다. 객체는 저장하는 단위로 데이터, 메타데이터, 키로 이루어진다. 키는 버킷 안에서 객체를 구분하는 이름이고, 메타데이터는 크기, 종류, 만든 시각, 사용자가 붙인 태그 같은 데이터에 대한 정보다. Object Storage의 버킷 안에는 디렉터리가 없고 객체가 평평하게 놓여 있다. docs/2026/report.pdf라는 키는 슬래시까지 포함한 전체가 이름 하나이고, 도구가 슬래시를 기준으로 폴더처럼 묶어 보여 줄 뿐이다. 키의 앞부분은 접두사라고 하며 목록을 검색할 때 쓴다.'},
{q:'Object Storage에 HTTP로 접근하는 방식을 설명하고, S3 API가 사실상 표준이 된 이유를 말해 보세요.',a:'Object Storage는 서버에 마운트하지 않고, 엔드포인트 주소로 HTTP 요청을 보내서 쓴다. PUT으로 객체를 올리고, GET으로 내려받거나 목록을 보고, DELETE로 지운다. 객체는 통째로 주고받고 일부만 고칠 수 없다. 요청에는 액세스 키와 시크릿 키로 만든 서명을 붙여 누가 보낸 요청인지 증명한다. S3 API는 AWS의 Object Storage인 S3를 쓰는 요청 규칙이다. S3가 먼저 널리 쓰이면서 백업 프로그램, 분석 도구, 라이브러리, 명령줄 도구가 S3 API에 맞춰 만들어졌고, 그래서 다른 제품들도 같은 규칙을 지원하게 됐다(S3 호환). 프로그램은 그대로 두고 엔드포인트와 키만 바꾸면 다른 Object Storage로 옮겨 갈 수 있다.'},
{q:'웹 쇼핑몰의 DB 데이터 파일, 여러 Web 서버가 함께 쓰는 파일, 상품 사진과 백업 파일을 각각 어떤 저장 방식에 둘지 고르고 이유를 설명해 보세요.',a:'DB 데이터 파일은 Block Storage에 둔다. 잦은 작은 읽기·쓰기를 빠르게 해야 하고 서버 한 대가 쓰기 때문이다. 여러 Web 서버가 함께 보여 줘야 하는 파일은 File Storage에 둔다. NAS가 파일시스템을 관리해서 여러 서버가 같은 파일을 같은 경로로 볼 수 있기 때문이다. 상품 사진과 백업 파일은 Object Storage에 둔다. 양이 많고, 한 번 올리면 주로 읽기만 하며, HTTP로 어디서든 주고받을 수 있기 때문이다. 이렇게 한 서비스 안에서 세 가지를 용도에 맞게 함께 쓰는 일이 흔하다.'}
],
quiz:[
{v:[
 {q:'Block, File, Object Storage에서 파일 이름과 디렉터리를 관리하는 곳을 맞게 짝지은 것은?',o:['Block은 서버의 파일시스템, File은 NAS, Object는 디렉터리 없이 버킷과 키','Block은 NAS, File은 서버, Object는 서버','셋 모두 서버의 파일시스템','셋 모두 스토리지 장비가 디렉터리로 관리'],e:'Block은 스토리지가 블록 번호만 알고 서버가 파일시스템을 만듭니다. File은 NAS가 디렉터리와 파일 이름을 관리합니다. Object는 디렉터리가 없고 버킷 안에 키로 구분합니다.'},
 {q:'같은 파일을 경로(/share/docs/report.pdf)로 열고, 일부만 읽거나 고칠 수 있는 저장 방식은?',o:['File Storage','Object Storage','어느 방식도 경로를 쓰지 않는다','Block Storage를 서버 두 대에 연결한 것'],e:'File Storage는 파일과 디렉터리 구조 그대로 내줍니다. Object Storage는 디렉터리가 없고 객체를 통째로 주고받습니다.'}
]},
{v:[
 {q:'NAS란?',o:['네트워크로 연결해 File Storage(공유 폴더)를 제공하는 저장 장치나 서비스','서버에 직접 꽂은 디스크','스토리지 전용 네트워크에서 블록 단위로 Volume을 주는 방식','HTTP로 객체를 주고받는 저장소'],e:'NAS(Network Attached Storage)는 파일 단위로 공유하는 저장소입니다. 블록 단위로 Volume을 주는 것은 SAN([[d11]]), HTTP로 객체를 주고받는 것은 Object Storage입니다.'},
 {q:'NAS의 공유를 Linux 서버에 붙일 때 mkfs를 하지 않는 이유는?',o:['파일시스템을 NAS가 이미 가지고 있어서','NAS의 공유는 크기가 정해져 있지 않아서','mkfs는 Windows에서만 쓰는 명령이라서','NAS는 블록 단위로만 동작해서'],e:'File Storage는 NAS가 파일시스템을 관리합니다. 서버는 mount만 합니다. mkfs는 서버가 파일시스템을 직접 만드는 Block Storage에서 합니다.'}
]},
{v:[
 {q:'여러 Web 서버가 같은 업로드 파일을 함께 보여 줘야 한다. File Storage가 알맞은 이유는?',o:['NAS가 파일시스템을 한곳에서 관리해서 여러 서버가 같은 파일을 안전하게 함께 쓸 수 있어서','File Storage는 Block Storage보다 항상 빠르기 때문에','File Storage는 서버 한 대만 쓸 수 있어서','File Storage는 HTTP로만 접근해서'],e:'NAS가 누가 어떤 파일을 쓰는지와 변경 내용을 한곳에서 관리하므로, 서버 A가 고친 내용을 서버 B도 바로 봅니다.'},
 {q:'일반 파일시스템으로 만든 Block Volume 하나를 서버 두 대에 동시에 마운트하면 안 되는 이유는?',o:['각 서버의 파일시스템이 서로의 기록을 모른 채 덮어써서 데이터가 깨지기 때문에','Block Volume은 마운트할 수 없어서','두 서버의 IP 주소가 같아져서','속도가 두 배로 빨라져 장비가 고장 나서'],e:'Block Storage는 파일시스템을 서버가 관리합니다. 여러 서버가 같은 파일을 함께 써야 하면 File Storage를 씁니다.'}
]},
{v:[
 {q:'NFS와 SMB를 주로 쓰는 OS를 맞게 짝지은 것은?',o:['NFS는 Linux·Unix, SMB는 Windows','NFS는 Windows, SMB는 Linux·Unix','둘 다 Windows 전용','둘 다 Linux 전용'],e:'NFS는 Linux·Unix에서, SMB(예전 이름 CIFS)는 Windows에서 주로 씁니다. Linux도 cifs-utils 등으로 SMB 공유를 붙일 수 있습니다.'},
 {q:'SMB의 예전 이름은?',o:['CIFS','NFS','iSCSI','S3'],e:'SMB는 예전에 CIFS(Common Internet File System)라고도 불렸습니다. 회사 자료에도 File을 NFS와 CIFS로 제공한다고 나옵니다.'}
]},
{v:[
 {q:'NFS와 SMB의 기본 포트를 맞게 짝지은 것은?',o:['NFS는 TCP 2049, SMB는 TCP 445','NFS는 TCP 445, SMB는 TCP 2049','NFS는 TCP 3260, SMB는 TCP 443','둘 다 TCP 80'],e:'NFS는 2049, SMB는 445입니다. 3260은 iSCSI([[d11]]), 443은 HTTPS입니다. 방화벽에서 이 포트가 허용되어야 마운트됩니다.'},
 {q:'NFS 공유 마운트가 안 될 때 확인할 것으로 알맞지 않은 것은?',o:['서버에서 mkfs를 다시 했는지','NAS가 이 서버의 IP 주소를 허용했는지','서버에서 NAS의 2049번 포트에 닿는지','공유 경로가 맞는지'],e:'NFS는 mkfs를 하지 않습니다. 마운트가 안 되는 원인은 접근 허용, 포트, 공유 경로, 필요한 패키지 가운데 하나일 수 있어서 차례로 확인합니다.'}
]},
{v:[
 {q:'Linux 서버에서 NFS 공유를 붙이는 명령으로 맞는 것은?',o:['sudo mount -t nfs 10.0.5.20:/exports/share /mnt/share','sudo mkfs.xfs 10.0.5.20:/exports/share','sudo iscsiadm -m node --login','aws s3 cp /exports/share /mnt/share'],e:'NFS는 mount 명령으로 "NAS주소:공유경로"를 마운트 포인트에 붙입니다. 재부팅해도 붙도록 /etc/fstab에 _netdev 옵션과 함께 등록합니다([[d06]]).'},
 {q:'NFS 공유를 /etc/fstab에 등록할 때 _netdev 옵션을 넣는 이유는?',o:['네트워크가 준비된 뒤에 마운트하게 하려고','읽기 전용으로 만들려고','UID를 바꾸려고','mkfs를 자동으로 하려고'],e:'NFS 공유는 네트워크로 붙습니다. 네트워크가 올라오기 전에 마운트하려 하면 실패하므로 _netdev로 순서를 맞춥니다.'}
]},
{v:[
 {q:'NFS에서 파일의 주인을 확인하는 방식은?',o:['사용자 이름이 아니라 UID·GID 번호로 확인한다','사용자 계정의 비밀번호로 확인한다','파일 이름으로 확인한다','MAC 주소로 확인한다'],e:'NFS는 UID·GID 번호로 주인을 맞춥니다. 그래서 여러 서버에서 같은 사용자는 같은 UID를 써야 권한이 맞습니다([[d04]]).'},
 {q:'서버 A의 kim(UID 1001)과 서버 B의 lee(UID 1001)가 같은 NFS 공유를 쓴다. NAS는 둘을 어떻게 보나?',o:['UID가 같으므로 같은 사용자로 본다','이름이 다르므로 다른 사용자로 본다','둘 다 root로 본다','둘 다 접근을 거부한다'],e:'NFS는 번호로 주인을 확인합니다. 이름이 달라도 UID가 같으면 같은 사람으로 보이므로, 서버마다 UID를 맞춰야 합니다.'}
]},
{v:[
 {q:'SMB에서 권한을 주는 방식으로 맞는 것은?',o:['사용자 계정으로 로그인하고, 파일과 폴더마다 ACL로 사용자·그룹별 권한을 준다','접속한 서버의 IP 주소로만 판단하고 사용자는 구분하지 않는다','UID 번호만 보고 판단한다','권한 개념이 없다'],e:'SMB는 계정 기반입니다. 회사에서는 Active Directory 계정과 연동해 권한을 주는 일이 많습니다.'},
 {q:'Windows 환경에서 사용자와 그룹 계정을 한곳에서 관리하고, SMB 공유의 권한을 이 계정으로 주는 서비스는?',o:['Active Directory','DNS','NAT','iSCSI'],e:'Active Directory는 Windows 계정을 한곳에서 관리합니다. 회사 자료에도 zStorage의 File이 Active Directory와 연동된다고 나옵니다.'}
]},
{v:[
 {q:'Object Storage의 객체를 이루는 것은?',o:['데이터, 메타데이터, 키','블록 번호와 파티션','디렉터리와 파일 이름','UID와 GID'],e:'객체는 실제 내용(데이터), 데이터에 대한 정보(메타데이터), 버킷 안에서 구분하는 이름(키)으로 이루어집니다.'},
 {q:'Object Storage의 버킷이란?',o:['객체를 담는 가장 위의 그릇','객체 하나의 이름','객체에 붙인 태그','HTTP 요청을 보낼 주소'],e:'버킷 안에 객체를 넣습니다. 권한과 설정을 버킷 단위로 정하는 일이 많습니다. 객체의 이름은 키, 요청을 보낼 주소는 엔드포인트입니다.'},
 {q:'Object Storage의 메타데이터에 해당하는 것은?',o:['객체의 크기, 종류(Content-Type), 만든 시각, 사용자가 붙인 태그','객체가 저장된 블록 번호','객체를 연 서버의 UID','객체의 디렉터리 경로'],e:'메타데이터는 데이터에 대한 정보입니다. 시스템이 붙이는 것과 사용자가 붙이는 것이 있고, 객체를 분류하고 찾는 데 씁니다.'}
]},
{v:[
 {q:'버킷 logs에 키가 web01/2026/access.log인 객체가 있다. 맞는 설명은?',o:['web01/2026/access.log 전체가 객체의 이름이고, web01이라는 디렉터리는 없다','web01 디렉터리 안에 2026 디렉터리가 있다','web01/2026은 다른 버킷의 이름이다','슬래시가 있는 키는 만들 수 없다'],e:'Object Storage의 버킷 안은 디렉터리 없이 평평합니다. 슬래시까지 포함한 전체가 키 하나이고, 도구가 폴더처럼 보여 줄 뿐입니다.'},
 {q:'Object Storage에서 키의 앞부분(예: docs/2026/)을 부르는 이름과 쓰임새는?',o:['접두사(Prefix). 그 접두사로 시작하는 객체 목록을 찾을 때 쓴다','디렉터리. 그 안에 객체를 넣으려면 먼저 만들어야 한다','엔드포인트. 요청을 보낼 주소다','메타데이터. 객체의 크기를 나타낸다'],e:'접두사는 키의 앞부분입니다. aws s3 ls s3://버킷/docs/2026/처럼 접두사로 목록을 볼 수 있습니다.'}
]},
{v:[
 {q:'Object Storage에 올린 큰 파일의 가운데 일부만 고치고 싶다. 어떻게 하나?',o:['고친 파일 전체를 같은 키로 다시 올려서 바꾼다','파일의 가운데만 바로 고쳐 쓴다','mkfs를 다시 한다','버킷을 지우고 새로 만든다'],e:'객체는 통째로 올리고 통째로 받습니다. 일부만 고쳐 쓸 수 없으므로, 자주 조금씩 고치는 데이터에는 맞지 않습니다.'},
 {q:'Object Storage가 잘 맞지 않는 데이터는?',o:['DB의 데이터 파일처럼 잦은 작은 쓰기가 일어나는 데이터','사진과 동영상','백업 파일','로그 모음'],e:'객체는 일부만 고칠 수 없고 HTTP로 통째로 주고받습니다. 잦은 작은 쓰기에는 Block Storage가 맞습니다.'}
]},
{v:[
 {q:'Object Storage에 접근하는 방법은?',o:['엔드포인트 주소로 HTTP 요청(PUT, GET 등)을 보낸다','서버에 mount해서 디렉터리로 쓴다','iSCSI로 접속해 디스크로 쓴다','SMB로 네트워크 드라이브를 연결한다'],e:'Object Storage는 서버에 마운트하지 않고 HTTP API로 씁니다. mount는 File Storage, iSCSI는 Block Storage의 방법입니다.'},
 {q:'Object Storage에서 객체를 올리는 HTTP 메서드와 내려받는 HTTP 메서드는?',o:['올리기 PUT, 내려받기 GET','올리기 GET, 내려받기 PUT','올리기 POST만, 내려받기 DELETE','둘 다 HEAD'],e:'PUT으로 올리고(같은 키가 있으면 바꿔 씀), GET으로 내려받습니다. HEAD는 메타데이터만 보고, DELETE는 지웁니다.'}
]},
{v:[
 {q:'S3 API가 Object Storage의 사실상 표준이 된 이유로 맞는 것은?',o:['S3가 먼저 널리 쓰여 도구와 라이브러리가 그 규칙에 맞춰졌고, 다른 제품도 같은 규칙을 지원하게 되어서','국제 표준 기관이 S3 API를 공식 표준으로 정해서','S3 API만 HTTP를 쓰기 때문에','S3 API를 쓰면 데이터가 지워지지 않아서'],e:'S3 API는 공식 표준이 아니지만, 많은 도구가 이 규칙으로 말하도록 만들어지면서 다른 Object Storage도 S3 호환을 지원하게 됐습니다.'},
 {q:'"S3 호환" Object Storage를 쓰면 좋은 점은?',o:['S3 API용으로 만든 프로그램과 도구를 엔드포인트와 키만 바꿔 그대로 쓸 수 있다','AWS 안에서만 쓸 수 있다','디렉터리를 만들 수 있게 된다','파일의 일부만 고쳐 쓸 수 있게 된다'],e:'S3 호환이면 같은 요청 규칙을 쓰므로 aws CLI 같은 도구를 --endpoint-url만 바꿔 씁니다. 다만 모든 기능이 똑같이 지원되는지는 제품 문서에서 확인합니다.'}
]},
{v:[
 {q:'Object Storage에 요청할 때 액세스 키와 시크릿 키를 쓰는 이유는?',o:['누가 보낸 요청인지 증명해서, 허용된 사용자만 읽고 쓰게 하려고','요청을 빠르게 하려고','객체의 크기를 줄이려고','디렉터리를 만들려고'],e:'요청에 키로 만든 서명을 붙여 누구인지 증명합니다. 시크릿 키는 비밀번호처럼 다룹니다.'},
 {q:'시크릿 키를 실수로 공개 저장소의 코드에 올렸다. 알맞은 조치는?',o:['그 키를 바로 쓰지 못하게 하고 새 키를 발급한다','코드에서 키 한 줄만 지우면 된다','버킷 이름만 바꾸면 된다','아무것도 하지 않아도 된다'],e:'저장소의 기록에 키가 남아 있으므로 이미 새어 나갔다고 봐야 합니다. 그 키를 무효로 하고 새 키를 씁니다.'},
 {q:'버킷을 "누구나 읽기"로 공개하면 생기는 일은?',o:['주소만 알면 인터넷의 누구든 객체를 내려받을 수 있다','액세스 키가 있는 사람만 읽을 수 있다','객체가 자동으로 암호화된다','객체를 지울 수 없게 된다'],e:'공개가 꼭 필요한 객체가 아니면 버킷을 공개하지 않습니다. 필요한 사람에게만 허용하는 원칙입니다([[d10]]).'}
]},
{v:[
 {q:'aws s3 cp report.pdf s3://company-docs/docs/report.pdf --endpoint-url https://s3.example.com 명령이 하는 일은?',o:['로컬의 report.pdf를 company-docs 버킷에 키 docs/report.pdf로 올린다(PUT)','버킷 company-docs를 만든다','버킷의 객체 목록을 본다','S3에서 report.pdf를 내려받는다'],e:'cp의 앞이 로컬 파일, 뒤가 s3:// 주소이면 올리기입니다. --endpoint-url은 요청을 보낼 S3 호환 Object Storage의 주소입니다.'},
 {q:'aws CLI에서 --endpoint-url 옵션을 쓰는 이유는?',o:['AWS가 아닌 S3 호환 Object Storage로 요청을 보내려고','파일을 압축하려고','버킷을 공개하려고','디렉터리를 만들려고'],e:'aws CLI는 기본으로 AWS의 S3에 요청합니다. 다른 S3 호환 저장소를 쓸 때는 그 엔드포인트 주소를 지정합니다.'}
]},
{v:[
 {q:'서버에 빈 디스크 한 개로 보이는 저장 방식은?',o:['Block Storage','File Storage','Object Storage','셋 모두'],e:'Block은 lsblk에 새 디스크로, File은 마운트한 공유 디렉터리로 보이고, Object는 서버에 붙지 않고 HTTP로 씁니다.'},
 {q:'서버에 마운트하지 않고 엔드포인트 주소로 요청해서 쓰는 저장 방식은?',o:['Object Storage','Block Storage','File Storage','DAS'],e:'Object Storage는 HTTP API로 접근합니다. Block과 File은 서버에 붙여서 디스크나 디렉터리로 씁니다.'}
]},
{v:[
 {q:'Block, File, Object의 접근 방법(프로토콜)을 맞게 짝지은 것은?',o:['Block은 iSCSI·FC, File은 NFS·SMB, Object는 HTTP(S3 API)','Block은 NFS, File은 iSCSI, Object는 SMB','Block은 HTTP, File은 iSCSI, Object는 NFS','셋 모두 HTTP'],e:'Block은 iSCSI·Fibre Channel이나 클라우드의 Volume 연결, File은 NFS·SMB, Object는 HTTP API(S3 API)로 접근합니다.'},
 {q:'여러 서버가 같은 데이터에 동시에 접근하는 것에 대해 맞는 설명은?',o:['Block은 Volume 하나를 서버 한 대가 쓰고, File과 Object는 여러 서버가 함께 쓸 수 있다','Block만 여러 서버가 함께 쓸 수 있다','셋 모두 서버 한 대만 쓸 수 있다','Object만 서버 한 대가 쓴다'],e:'File은 NAS가 파일시스템을 관리해서, Object는 객체 단위로 HTTP로 주고받아서 여러 서버가 함께 씁니다. 다만 Object에서 같은 키에 동시에 올리면 마지막에 올린 것만 남습니다.'}
]},
{v:[
 {q:'Windows PC 20대에서 부서원들이 함께 열고 고치는 문서 폴더에 알맞은 것은?',o:['File Storage (SMB)','Block Storage','Object Storage','DAS'],e:'여러 사람이 같은 파일을 함께 열고 고치므로 File Storage가 맞고, Windows에서는 SMB를 씁니다.'},
 {q:'매일 밤 만드는 백업 파일을 1년 동안 쌓아 두는 곳으로 알맞은 것은?',o:['Object Storage','Block Storage','서버의 /tmp 디렉터리','DB의 데이터 파일'],e:'한 번 쓰고 보관만 하며 양이 많으므로 Object Storage가 맞습니다. 백업은 [[d13]]에서 배웁니다.'},
 {q:'DB 서버의 데이터 파일을 두는 곳으로 알맞은 것은?',o:['Block Storage','Object Storage','SMB 공유','공개 버킷'],e:'DB는 잦은 작은 읽기·쓰기를 빠르게 해야 하고 서버 한 대가 씁니다. Block Storage가 맞습니다.'}
]},
{v:[
 {q:'회사 자료에 따르면 Zadara zStorage의 File과 Object는 각각 어떤 방식으로 제공되나?',o:['File은 NFS·CIFS(Active Directory 연동), Object는 S3·Swift API','File은 iSCSI, Object는 NFS','File은 S3 API, Object는 SMB','둘 다 Fibre Channel'],e:'zStorage는 VPSA로 Block, File, Object를 모두 제공합니다. File은 NFS와 CIFS로, Object는 S3와 Swift API로 접근합니다.'},
 {q:'AWS의 EBS, EFS, S3에 해당하는 zStorage의 저장 방식을 순서대로 맞게 짝지은 것은?',o:['Block, File, Object','File, Block, Object','Object, File, Block','Block, Object, File'],e:'EBS(Elastic Block Store)는 Block, EFS(Elastic File System)는 File, S3는 Object입니다. 회사 자료도 이 대응을 보여 줍니다.'}
]}
]
});
