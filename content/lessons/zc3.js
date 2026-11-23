OJT.lesson({
id:'zc3', week:5, tag:'zCompute 3', mins:'약 4시간',
title:'VM 리소스: Instance Type, Machine Image, Key Pair',
cover:[['Instance Type','s2'],['Machine Image','s4'],['cloud-init','s5'],['Key Pair','s6'],['부팅 디스크','s7'],['VM 생명주기','s8'],['Placement Rule','s9']],
act:'Instance Type·Image·Key Pair를 골라 VM 구성을 설명',
goal:['VM을 만들 때 고르는 자원과 각각의 역할을 설명할 수 있다','Instance Type 이름을 읽어 vCPU와 메모리를 계산할 수 있다','노드 용량에서 타입별 최대 VM 수를 계산할 수 있다','Machine Image, 클라우드 이미지, QCOW, cloud-init의 관계를 설명할 수 있다','공개키와 개인키를 누가 갖는지, 개인키를 잃으면 어떻게 되는지 설명할 수 있다','VM의 상태 변화와 Placement Rule의 Hard·Soft 차이를 구분할 수 있다'],
terms:[
['Instance Type','Instance Type (Flavor)','VM이 쓸 vCPU와 메모리 같은 자원을 정해 둔 템플릿.'],
['vCPU','Virtual CPU','VM에 할당되는 가상 CPU.'],
['GiB','Gibibyte','메모리 단위. 1GiB = 1,024MiB.'],
['Machine Image','Machine Image','부팅할 수 있는 OS가 든 가상 디스크를 담은 파일.'],
['클라우드 이미지','Cloud Image','클라우드에서 바로 부팅하도록 준비된 OS 이미지. 보통 cloud-init이 들어 있다.'],
['QCOW2','QEMU Copy-On-Write 2','KVM 계열에서 쓰는 가상 디스크 이미지 형식.'],
['ISO','ISO Image','OS 설치 미디어를 담은 이미지 파일.'],
['Marketplace','Image Marketplace','제공되는 OS와 가상 어플라이언스 이미지를 골라 내려받는 곳.'],
['cloud-init','cloud-init','Linux VM이 시작될 때 사용자, 키, 패키지 등을 자동으로 설정하는 게스트 안의 서비스.'],
['user-data','User Data','사용자가 VM에 넘기는 초기 설정 내용.'],
['Cloudbase-init','Cloudbase-init','Windows에서 cloud-init과 같은 역할을 하는 서비스.'],
['Key Pair','Key Pair','공개키와 개인키 한 쌍. VM에 접속하는 사용자를 확인하는 데 쓴다.'],
['공개키','Public Key','VM에 등록해 두는 키. 공개되어도 이것으로 개인키를 알아낼 수 없다.'],
['개인키','Private Key','사용자가 보관하는 키. 접속할 때 본인임을 증명한다.'],
['Boot Volume','Boot Volume','VM의 OS가 들어 있고 VM이 부팅하는 볼륨.'],
['Active','Active','VM이 실행 중인 상태.'],
['Shutoff','Shutoff','VM이 꺼져 있는 상태. 타입 변경과 삭제는 이 상태에서 한다.'],
['Placement Rule','VM Placement Rule','VM을 어떤 물리 노드에 둘지 태그로 정하는 규칙.'],
['Hard / Soft','Hard / Soft Enforcement','Hard는 규칙을 지킬 수 있을 때만 배치하고, Soft는 가능하면 지키되 안 되면 그래도 배치한다.'],
['KMS','Key Management Service','조직 네트워크 안에서 Windows 라이선스를 활성화하는 서비스.']
],
body:`
<h2 id="s1">VM을 만들 때 고르는 것</h2>
<p>VM 하나는 여러 자원의 조합이다. 만들 때 <b>얼마나 큰 VM인가, 어떤 OS로 시작하는가, 누가 접속하는가, 어디에 저장하는가, 어느 네트워크에 두는가</b>를 정한다.</p>
<svg class="fig" viewBox="0 0 560 366" role="img" aria-label="VM을 이루는 다섯 가지 자원. Instance Type은 vCPU와 메모리, Machine Image는 OS, Key Pair는 접속 인증, Boot Volume은 OS 디스크, Network Interface는 Subnet과 Security Group을 정하고, 이 다섯 가지가 합쳐져 VM이 된다.">
<rect x="8" y="6" width="244" height="62" rx="8" class="bx-a"/><text x="130" y="32" class="c b">Instance Type</text><text x="130" y="56" class="c t-m">vCPU · 메모리</text>
<rect x="8" y="78" width="244" height="62" rx="8" class="bx-a"/><text x="130" y="104" class="c b">Machine Image</text><text x="130" y="128" class="c t-m">OS와 초기 내용</text>
<rect x="8" y="150" width="244" height="62" rx="8" class="bx-a"/><text x="130" y="176" class="c b">Key Pair</text><text x="130" y="200" class="c t-m">접속 인증</text>
<rect x="8" y="222" width="244" height="62" rx="8" class="bx-a"/><text x="130" y="248" class="c b">Boot Volume</text><text x="130" y="272" class="c t-m">OS가 놓이는 디스크</text>
<rect x="8" y="294" width="244" height="62" rx="8" class="bx-a"/><text x="130" y="320" class="c b">Network Interface</text><text x="130" y="344" class="c t-m">Subnet · Security Group</text>
<line x1="252" y1="37" x2="296" y2="37" class="ln"/><line x1="252" y1="109" x2="296" y2="109" class="ln"/><line x1="252" y1="181" x2="296" y2="181" class="ln"/><line x1="252" y1="253" x2="296" y2="253" class="ln"/><line x1="252" y1="325" x2="296" y2="325" class="ln"/>
<line x1="296" y1="37" x2="296" y2="325" class="ln"/>
<line x1="296" y1="181" x2="346" y2="181" class="ln acc" marker-end="url(#ar-acc)"/>
<rect x="352" y="96" width="196" height="170" rx="10" class="wall"/>
<use href="#i-server" x="414" y="124" width="72" height="72" class="acc"/>
<text x="450" y="234" class="c b">VM</text>
</svg>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>zCompute</th><th>AWS에서 비슷한 것</th><th>정하는 것</th></tr></thead><tbody>
<tr><td class="nw"><b>Instance Type</b></td><td class="nw">EC2 Instance Type</td><td>vCPU, 메모리</td></tr>
<tr><td class="nw"><b>Machine Image</b></td><td class="nw">AMI</td><td>시작할 OS 디스크</td></tr>
<tr><td class="nw"><b>Key Pair</b></td><td class="nw">EC2 Key Pair</td><td>SSH 공개키 인증</td></tr>
<tr><td class="nw"><b>Boot Volume</b></td><td class="nw">EBS 루트 볼륨</td><td>OS 디스크의 크기와 유형</td></tr>
<tr><td class="nw"><b>Placement Rule</b></td><td class="nw">Placement Group</td><td>VM을 둘 물리 노드의 관계</td></tr>
</tbody></table></div>
<p class="small muted">AWS 열은 개념을 잇기 위한 것이다. 세부 동작은 서로 다를 수 있다. 예를 들어 zCompute의 VM 삭제는 Shutoff 상태에서만 할 수 있다.</p>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><p>이 레슨의 메뉴와 절차는 공식 가이드 25.06.1 기준이다. 사내 환경의 콘솔 화면, 쓸 수 있는 타입과 이미지는 다를 수 있다.</p></div>

<h2 id="s2">Instance Type: 이름 읽는 법</h2>
<p><b>Instance Type</b>은 VM이 쓸 자원을 정해 둔 템플릿이다. Flavor라고도 부른다. 이름은 <code>계열.크기</code> 형식이다.</p>
<pre class="code">z2.2xlarge
│ │  └ 크기: 2xlarge = 4 × 2 = 8 vCPU
│ └ 숫자: vCPU 하나당 메모리 2GiB
└ 계열: Z (Standard)

결과: 8 vCPU, 8 × 2 = 16GiB</pre>
<p><b>z2 계열 기준</b>으로 크기 이름은 다음과 같이 읽는다.</p>
<div class="tbl-wrap"><table><thead><tr><th>크기 이름</th><th>vCPU</th><th>z2 타입의 예</th></tr></thead><tbody>
<tr><td class="nw"><code>medium</code></td><td>1</td><td><code>z2.medium</code> = 1 vCPU, 2GiB</td></tr>
<tr><td class="nw"><code>large</code></td><td>2</td><td><code>z2.large</code> = 2 vCPU, 4GiB</td></tr>
<tr><td class="nw"><code>xlarge</code></td><td>4</td><td><code>z2.xlarge</code> = 4 vCPU, 8GiB</td></tr>
<tr><td class="nw"><code>Nxlarge</code></td><td>4 × N</td><td><code>z2.4xlarge</code> = 16 vCPU, 32GiB</td></tr>
</tbody></table></div>
<p class="small muted">가이드는 크기 규칙을 문장으로 적지 않는다. 위 규칙은 z2 타입 표를 읽어 정리한 것이다. 다른 계열의 크기와 실제로 있는 타입은 그 계열의 타입 표에서 확인한다.</p>
<h3>메모리 비율과 계열</h3>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>이름의 숫자</th><th>vCPU : 메모리</th><th>성격</th><th>AWS에서 비슷한 것</th></tr></thead><tbody>
<tr><td class="nw"><b>2</b></td><td>1 : 2</td><td>Compute Optimized</td><td>C 타입</td></tr>
<tr><td class="nw"><b>4</b></td><td>1 : 4</td><td>General Purpose</td><td>M 타입</td></tr>
<tr><td class="nw"><b>8</b></td><td>1 : 8</td><td>Memory Optimized</td><td>R 타입</td></tr>
<tr><td class="nw"><b>16</b></td><td>1 : 16</td><td>메모리를 더 많이 쓰는 작업</td><td></td></tr>
</tbody></table></div>
<div class="tbl-wrap"><table><thead><tr><th>계열</th><th>구분</th></tr></thead><tbody>
<tr><td class="nw"><b>Z</b>, <b>ZP</b></td><td>Standard, Premium</td></tr>
<tr><td class="nw"><b>ZC</b>, <b>ZU</b></td><td>고성능 Standard, 고성능 Premium</td></tr>
<tr><td class="nw"><b>ZD</b>, <b>ZUD</b></td><td>로컬 NVMe 장치가 붙는 타입</td></tr>
<tr><td class="nw"><b>ZRTX</b></td><td>GPU 타입</td></tr>
</tbody></table></div>
<div class="box warn"><span class="lbl">주의: 로컬 NVMe는 임시 저장 공간이다</span><p>ZD 계열의 NVMe는 노드의 장치를 VM에 직접 연결한 것으로, 데이터가 영구히 보존되는 저장소가 아니다. 이런 VM은 유지보수를 위해 다른 노드로 옮길 수 없다.</p></div>

<h2 id="s3">타입별 최대 VM 수 계산</h2>
<p>노드에 VM이 몇 대 들어가는지는 <b>vCPU와 메모리를 각각 나누고 더 작은 값</b>을 고르면 된다. 둘 중 먼저 바닥나는 자원이 VM 수를 정한다.</p>
<div class="box mem"><span class="lbl">계산식</span><p>최대 VM 수 = min( ⌊쓸 수 있는 vCPU ÷ 타입의 vCPU⌋, ⌊쓸 수 있는 메모리 ÷ 타입의 메모리⌋ )</p></div>
<p>아래는 회사 기능 소개 자료의 용량 예시로 계산한 것이다. <b>가정한 값:</b> 사용 가능한 노드 3대, 노드당 128 vCPU·512GiB, 사용 비율 0.9.</p>
<pre class="code">쓸 수 있는 vCPU   = 3 × 128 × 0.9 = 345.6 → 345
쓸 수 있는 메모리 = 3 × 512 × 0.9 = 1,382.4 → 1,382GiB</pre>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>타입</th><th>vCPU</th><th>메모리</th><th>vCPU 기준</th><th>메모리 기준</th><th>최대 VM 수</th></tr></thead><tbody>
<tr><td class="nw"><code>z2.large</code></td><td>2</td><td>4GiB</td><td>172</td><td>345</td><td><b>172</b></td></tr>
<tr><td class="nw"><code>z2.xlarge</code></td><td>4</td><td>8GiB</td><td>86</td><td>172</td><td><b>86</b></td></tr>
<tr><td class="nw"><code>z2.2xlarge</code></td><td>8</td><td>16GiB</td><td>43</td><td>86</td><td><b>43</b></td></tr>
<tr><td class="nw"><code>z2.4xlarge</code></td><td>16</td><td>32GiB</td><td>21</td><td>43</td><td><b>21</b></td></tr>
<tr><td class="nw"><code>z8.xlarge</code></td><td>4</td><td>32GiB</td><td>86</td><td>43</td><td><b>43</b></td></tr>
</tbody></table></div>
<p>Z2는 vCPU가 먼저 바닥나고, Z8은 메모리가 먼저 바닥난다. 그래서 같은 4 vCPU라도 <code>z8.xlarge</code>는 <code>z2.xlarge</code>의 절반만 들어간다.</p>
<div class="box warn"><span class="lbl">주의: 이 값은 이론상 상한이다</span><p>실제 수용량은 HA, 오버커밋, 스토리지, OS, 워크로드 조건에 따라 달라진다. 계산 결과를 실제 환경의 수용량으로 쓰지 않는다.</p></div>
<h3>직접 계산해 보기</h3>
<p>같은 가정(345 vCPU, 1,382GiB)에서 <code>z4.2xlarge</code>(8 vCPU, 32GiB)와 <code>z8.2xlarge</code>(8 vCPU, 64GiB)는 각각 최대 몇 대인가?</p>
<details class="fold"><summary>답 보기</summary><p><code>z4.2xlarge</code>는 vCPU 기준 345 ÷ 8 = 43, 메모리 기준 1,382 ÷ 32 = 43이므로 <b>43대</b>다. <code>z8.2xlarge</code>는 vCPU 기준 43, 메모리 기준 1,382 ÷ 64 = 21이므로 <b>21대</b>다.</p></details>

<h2 id="s4">Machine Image: 클라우드 이미지와 QCOW</h2>
<p><b>Machine Image</b>는 부팅할 수 있는 OS가 든 가상 디스크를 담은 파일이다. VM은 이미지를 복사한 Boot Volume으로 시작하므로, 같은 이미지로 같은 상태의 VM을 여러 대 만들 수 있다.</p>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>구분</th><th>내용</th><th>쓰는 때</th></tr></thead><tbody>
<tr><td class="nw"><b>클라우드 이미지</b></td><td>OS가 이미 설치되어 있고 보통 cloud-init이 들어 있다</td><td>VM을 바로 시작할 때</td></tr>
<tr><td class="nw"><b>ISO</b></td><td>OS 설치 미디어</td><td>OS를 직접 설치해 이미지를 만들 때</td></tr>
<tr><td class="nw"><b>사용자 이미지</b></td><td>VM, Volume, Snapshot에서 만든 이미지</td><td>설정을 마친 서버를 복제할 때</td></tr>
</tbody></table></div>
<h3>이미지 형식과 조건</h3>
<p>zCompute는 KVM 호환 <b>QCOW2</b>와 <b>RAW</b>, VMware의 <b>OVA</b>를 이미지 원본으로 받는다. QCOW2는 KVM 계열에서 널리 쓰는 가상 디스크 형식이다. 이미지로 쓰려면 다음 조건을 갖춰야 한다.</p>
<ul><li>부팅 가능한 시스템 디스크가 <b>하나</b>여야 한다.</li><li>네트워크 주소를 <b>DHCP</b>로 받도록 설정되어 있어야 한다.</li><li>원격으로 접속할 수단이 있어야 한다. Linux는 SSH 서버, Windows는 VNC나 원격 접속 서비스다.</li></ul>
<h3>이미지의 범위와 펌웨어</h3>
<p>이미지의 범위(Scope)는 <b>Project</b>(그 Project에 접근할 수 있는 사용자)와 <b>Account</b>(Account의 모든 사용자) 중에서 고른다. <b>Marketplace</b>에서는 제공되는 OS와 가상 어플라이언스 이미지를 골라 내려받는다.</p>
<p>VM의 펌웨어(BIOS 또는 UEFI)는 이미지의 OS가 설치된 방식과 맞아야 한다. 맞지 않아도 VM은 만들어지지만 부팅되지 않을 수 있다.</p>

<h2 id="s5">cloud-init: 처음 시작할 때 자동 설정</h2>
<p><b>cloud-init</b>은 VM 안에서 동작하는 초기화 서비스다. VM이 시작될 때 플랫폼의 메타데이터 서비스에서 정보를 가져와 사용자, SSH 키 같은 설정을 적용한다. 사용자가 넘기는 설정을 <b>user-data</b>라고 하고, VM을 만들 때 Config 단계에서 파일로 넣는다.</p>
<pre class="code">#cloud-config
users:
  - name: webadmin
    groups: sudo
    shell: /bin/bash
    ssh_authorized_keys:
      - ssh-rsa AAAA...공개키...</pre>
<p class="small muted">학습용 예시다. 첫 줄은 <code>#cloud-config</code>이고, 형식은 YAML이라 들여쓰기에 탭이 아니라 공백을 쓴다.</p>
<ul><li>플랫폼은 메타데이터와 user-data를 제공하고, 이를 실제로 적용하는 것은 <b>이미지 안의 cloud-init</b>이다. 그래서 결과는 이미지의 설정에 따라 다르다.</li><li>스크립트는 이미지에 그 인터프리터가 있어야 실행된다. Bash는 대체로 되지만 Python이나 Ruby는 이미지에 없을 수 있다.</li><li>Windows에서는 <b>Cloudbase-init</b>이 같은 역할을 한다.</li></ul>
<div class="box warn"><span class="lbl">주의: 비밀번호 로그인을 켜지 않는다</span><p>제공되는 클라우드 이미지는 SSH Key Pair를 쓰고 기본 사용자 이름과 비밀번호 로그인은 켜져 있지 않다. cloud-init으로 비밀번호를 만들 수는 있지만 보안상 권장하지 않는다.</p></div>

<h2 id="s6">Key Pair: 누가 무엇을 갖는가</h2>
<p><b>Key Pair</b>는 공개키와 개인키 한 쌍으로, VM에 접속하는 사용자를 확인하는 데 쓴다. <b>공개키는 플랫폼과 VM에, 개인키는 사용자 PC에</b> 있다.</p>
<svg class="fig" viewBox="0 0 560 318" role="img" aria-label="Key Pair의 위치. 내 PC에는 개인키가 있고, zCompute에는 공개키가 보관되며, VM을 만들 때 공개키가 VM에 등록된다. SSH로 접속할 때 내 PC의 개인키로 본인임을 증명한다.">
<rect x="6" y="8" width="164" height="196" rx="10" class="bx-a"/>
<text x="88" y="38" class="c b">내 PC</text>
<use href="#i-pc" x="60" y="52" width="56" height="56" class="acc"/>
<text x="88" y="142" class="c b t-acc">개인키</text>
<text x="88" y="170" class="c t-m">직접 보관</text>
<rect x="198" y="8" width="164" height="196" rx="10" class="bx-n"/>
<text x="280" y="38" class="c b">zCompute</text>
<use href="#i-cloud" x="244" y="56" width="72" height="46"/>
<text x="280" y="142" class="c b">공개키</text>
<text x="280" y="170" class="c t-m">VM 만들 때 사용</text>
<rect x="390" y="8" width="164" height="196" rx="10" class="bx-g"/>
<text x="472" y="38" class="c b">VM</text>
<use href="#i-server" x="444" y="52" width="56" height="56"/>
<text x="472" y="142" class="c b">공개키</text>
<text x="472" y="170" class="c t-m">접속 허용 목록</text>
<line x1="362" y1="106" x2="386" y2="106" class="ln" marker-end="url(#ar)"/>
<path d="M88 204 V252 H472 V210" fill="none" class="ln acc" marker-end="url(#ar-acc)"/>
<text x="280" y="242" class="c b t-acc">SSH 접속</text>
<text x="280" y="290" class="c t-m">개인키로 본인임을 증명한다. 개인키는 VM으로 보내지 않는다.</text>
</svg>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>만드는 방법</th><th>과정</th><th>개인키 위치</th></tr></thead><tbody>
<tr><td class="nw"><b>Create</b></td><td>플랫폼에서 키 쌍을 만들고 <code>.pem</code> 파일을 내려받는다</td><td>내려받은 내 PC</td></tr>
<tr><td class="nw"><b>Upload</b></td><td>내 PC에서 <code>ssh-keygen</code>으로 만들고 공개키만 올린다</td><td>처음부터 내 PC</td></tr>
</tbody></table></div>
<p>개인키 파일은 나만 읽을 수 있게 권한을 400이나 600으로 둔다. 접속 명령과 기본 사용자 이름은 <a data-lesson="zc4"></a>에서 다룬다.</p>
<h3>개인키를 잃어버리면</h3>
<p><mark>공개키로 개인키를 다시 만들 수는 없다.</mark> 개인키를 잃으면 그 키로는 VM에 접속할 수 없다. VM 자체가 사라지는 것은 아니므로, 다음과 같이 접근을 되찾는다.</p>
<ul><li>이미 접속할 수 있는 다른 계정이나 키가 있으면, 그 계정으로 들어가 <b>새 공개키를 등록</b>하고 잃어버린 키의 공개키를 지운다.</li><li>접속할 길이 없으면 <b>데이터를 새 VM으로 옮기는</b> 방법을 검토한다.</li><li>VNC 콘솔도 OS 로그인이 필요하다. 비밀번호가 없는 클라우드 이미지에서는 콘솔이 복구 수단이 되지 않는다.</li></ul>
<p class="small muted">위 대응은 zCompute 가이드의 절차가 아니라 일반적인 SSH·VM 운영 방법이다. 사내 절차는 실습 환경에서 확인한다.</p>
<div class="box warn"><span class="lbl">주의: 개인키가 유출되면</span><p>개인키를 저장소나 메신저에 올리지 않는다. 유출되었다면 그 키의 공개키를 VM에서 지우고 새 키로 바꾼다.</p></div>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><ul><li>플랫폼에서 개인키를 다시 내려받을 수 있는지(가이드에 적혀 있지 않다)</li><li>개인키를 잃었을 때 사내에서 정한 복구 절차</li></ul></div>

<h2 id="s7">부팅 디스크</h2>
<p><b>Boot Volume</b>은 OS가 들어 있고 VM이 부팅하는 볼륨이다. VM을 만들 때 시작 원본을 <b>Image, ISO, Volume</b> 중에서 고르고, Boot Volume의 <b>크기</b>와 <b>Volume Type</b>을 정한다.</p>
<ul><li>크기는 나중에 <b>늘릴 수 있지만 줄일 수는 없다.</b> 그래서 처음에는 필요한 만큼만 잡는다.</li><li>볼륨을 늘려도 OS 안의 파티션과 파일시스템은 따로 늘려야 할 수 있다.</li><li>OS와 데이터의 수명이 다르므로, 서비스 데이터는 Boot Volume이 아니라 별도의 데이터 볼륨에 둔다.</li></ul>
<p>교육자료는 Boot Volume에 SSD를 쓴다고 설명한다. 데이터 볼륨, Volume Type, 스냅샷은 <a data-lesson="zc5"></a>에서 다룬다.</p>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><p>VM을 삭제할 때 Boot Volume과 데이터 볼륨이 함께 지워지는지(가이드에 적혀 있지 않다). 확인하기 전에는 지워도 되는 VM으로만 시험한다.</p></div>

<h2 id="s8">VM 생명주기</h2>
<p>VM은 시작하면 <b>Spawning</b>을 거쳐 <b>Active</b>가 되고, 중지하면 <b>Shutoff</b>가 된다. 삭제는 Shutoff 상태에서만 할 수 있다.</p>
<svg class="fig" viewBox="0 0 560 270" role="img" aria-label="VM 상태 변화. Spawning에서 Active가 되고, Stop을 하면 Shutoff가 된다. Shutoff에서 Start를 하면 Spawning을 거쳐 Active로 돌아가고, Shutoff에서 Delete를 하면 삭제된다.">
<path d="M480 76 V34 H80 V70" fill="none" class="ln" marker-end="url(#ar)"/>
<text x="280" y="26" class="c b">Start</text>
<rect x="10" y="76" width="140" height="60" rx="8" class="bx-n"/><text x="80" y="113" class="c b">Spawning</text>
<rect x="210" y="76" width="140" height="60" rx="8" class="bx-g"/><text x="280" y="113" class="c b">Active</text>
<rect x="410" y="76" width="140" height="60" rx="8" class="bx-a"/><text x="480" y="113" class="c b">Shutoff</text>
<line x1="150" y1="106" x2="206" y2="106" class="ln" marker-end="url(#ar)"/>
<line x1="350" y1="106" x2="406" y2="106" class="ln acc" marker-end="url(#ar-acc)"/>
<text x="380" y="94" class="c t-m">Stop</text>
<line x1="480" y1="136" x2="480" y2="194" class="ln" marker-end="url(#ar)"/>
<text x="468" y="172" class="e b">Delete</text>
<rect x="410" y="200" width="140" height="58" rx="8" class="wall"/><text x="480" y="236" class="c">삭제됨</text>
</svg>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>동작</th><th>상태 변화</th><th>알아 둘 점</th></tr></thead><tbody>
<tr><td class="nw"><b>시작 (Start)</b></td><td class="nw">Shutoff → Spawning → Active</td><td>플랫폼이 VM을 둘 노드를 정한다</td></tr>
<tr><td class="nw"><b>중지 (Stop)</b></td><td class="nw">Active → Shutoff</td><td>게스트에 정상 종료를 요청하고, 정해진 시간 안에 끝나지 않으면 강제로 끈다</td></tr>
<tr><td class="nw"><b>재부팅</b></td><td class="nw">Active 유지</td><td>OS 안에서 <code>sudo reboot</code>로 한다. VM의 하드웨어 설정 변경은 적용되지 않는다</td></tr>
<tr><td class="nw"><b>삭제 (Delete)</b></td><td class="nw">Shutoff → 삭제</td><td>먼저 Stop해야 한다</td></tr>
</tbody></table></div>
<div class="box warn"><span class="lbl">주의: 재부팅과 Stop 후 Start는 다르다</span><p>펌웨어 변경은 OS 안의 재부팅으로는 적용되지 않고, VM을 완전히 Stop한 뒤 Start해야 적용된다. Instance Type과 펌웨어를 바꾸는 Modify도 Shutoff 상태에서만 할 수 있다.</p></div>
<p>콘솔의 Stop은 가이드 25.06.1 기준으로 60초를 기다린 뒤 강제로 끈다. 큰 DB처럼 종료가 오래 걸리는 VM은 OS 안에서 먼저 <code>sudo shutdown --poweroff</code>로 정상 종료한다.</p>
<h3>VM을 지켜 주는 옵션</h3>
<ul><li><b>Protect from deletion</b>: 실수로 VM을 삭제하지 못하게 막는다.</li><li><b>High Availability</b>: 장애가 나면 VM을 다시 시작해 준다. 서비스 이중화를 대신하지는 않는다. 이중화는 <a data-lesson="zc6"></a>에서 다룬다.</li></ul>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><ul><li>콘솔에 재부팅 버튼이 있는지(가이드의 VM 작업에는 따로 설명이 없다)</li><li>Stop 후 Start했을 때 사설 IP와 Elastic IP가 유지되는지</li></ul></div>

<h2 id="s9">Placement Rule</h2>
<p><b>Placement Rule</b>은 VM을 어떤 물리 노드에 둘지 <b>태그</b>로 정하는 규칙이다. 예를 들어 Web 서버 2대가 같은 노드에 있으면 그 노드의 장애로 둘 다 멈춘다. 같은 태그의 VM을 <b>서로 다른 노드</b>에 두면 이 위험을 줄일 수 있다.</p>
<div class="flow"><div class="n"><b>유형</b><small>어떤 태그끼리</small></div><span class="ar">→</span><div class="n"><b>강제 수준</b><small>Hard · Soft</small></div><span class="ar">→</span><div class="n k"><b>범위</b><small>Project · 시스템</small></div></div>
<div class="tbl-wrap"><table class="wide"><thead><tr><th>유형</th><th>뜻</th><th>쓰는 사람</th></tr></thead><tbody>
<tr><td class="nw"><b>같은 태그의 VM</b></td><td>같은 태그의 VM을 같은 노드 또는 다른 노드에 둔다</td><td>사용자</td></tr>
<tr><td class="nw"><b>다른 태그의 VM</b></td><td>한 태그의 VM을 다른 태그의 VM과 같은 노드 또는 다른 노드에 둔다</td><td>사용자</td></tr>
<tr><td class="nw"><b>VM과 노드 태그</b></td><td>VM 태그를 노드 태그와 맞추거나 떼어 놓는다</td><td>관리자</td></tr>
</tbody></table></div>
<div class="tbl-wrap"><table><thead><tr><th>강제 수준</th><th>규칙을 지킬 수 없을 때</th></tr></thead><tbody>
<tr><td class="nw"><b>Hard</b></td><td>배치하지 않는다</td></tr>
<tr><td class="nw"><b>Soft</b></td><td>규칙을 어기더라도 배치한다</td></tr>
</tbody></table></div>
<p>일반 사용자의 규칙은 현재 Project에 적용되고, 시스템 전체 범위는 관리자만 쓴다. <b>Simulate</b>는 바꾸지 않고 영향받는 VM만 보여 주고, <b>Apply</b>는 규칙을 적용한다. Apply할 때 규칙대로 둘 수 없는 VM은 중지하거나 현재 위치에서 계속 실행하도록 고른다. 여러 규칙을 쓸 때는 서로 중복되거나 모순되지 않아야 한다.</p>
<div class="box warn"><span class="lbl">사내 실습 환경에서 확인</span><p>규칙이 새로 만들거나 다시 시작하는 VM에 자동으로 적용되는지(가이드에 적혀 있지 않다)</p></div>

<h2 id="s10">Windows KMS와 GPU 인스턴스</h2>
<h3>Windows KMS</h3>
<p>Windows VM은 라이선스 활성화가 필요하다. <b>KMS</b><span class="small muted">(Key Management Service)</span>는 VM마다 Microsoft 서버에 접속하거나 제품 키를 넣지 않고 조직 네트워크 안에서 활성화하는 서비스다. 한 번 활성화하는 MAK<span class="small muted">(Multiple Activation Key)</span>와 달리 KMS는 주기적으로 활성화를 확인한다. 교육자료에 따르면 zCompute의 VPC에서는 KMS Proxy 서비스를 통해 KMS 서버에 닿는다. 사내 환경의 라이선스 방식은 사내 실습 환경에서 확인한다.</p>
<h3>GPU 인스턴스</h3>
<p><b>GPU</b>는 대량의 단순 계산을 병렬로 빠르게 처리하는 프로세서로, AI 학습·추론, HPC, 그래픽 렌더링에 쓴다. GPU VM을 쓰려면 <b>GPU가 달린 노드</b>와 <b>GPU 인스턴스 타입</b>이 있어야 하고, OS에 <b>GPU 드라이버</b>를 설치해야 한다. 공식 가이드에는 ZRTX 계열이 GPU 타입으로 실려 있다. 사내 환경에서 쓸 수 있는지는 사내 실습 환경에서 확인한다.</p>
`,
summary:['VM은 Instance Type, Machine Image, Key Pair, Boot Volume, Network Interface의 조합이다.','Instance Type 이름은 계열.크기이고, 계열의 숫자는 vCPU당 메모리(GiB)다. z2 계열 기준으로 large는 2 vCPU, xlarge는 4 vCPU, Nxlarge는 4 × N vCPU다.','최대 VM 수는 vCPU와 메모리를 각각 나눈 값 중 작은 값이며, 실제 수용량은 조건에 따라 달라진다.','Machine Image는 부팅 가능한 OS 디스크 파일이고, QCOW2는 KVM 계열의 이미지 형식이다.','cloud-init은 VM 안에서 시작 시 사용자와 키 등을 자동 설정한다.','공개키는 플랫폼과 VM에, 개인키는 사용자에게 있다. 공개키로 개인키를 다시 만들 수 없다.','Boot Volume은 늘릴 수 있지만 줄일 수 없다.','VM 상태는 Spawning → Active → Shutoff이고, Modify와 Delete는 Shutoff에서 한다.','Placement Rule의 Hard는 지킬 수 없으면 배치하지 않고, Soft는 그래도 배치한다.'],
essay:[
{q:'VM을 만들 때 고르는 다섯 가지 자원과 각각의 역할을 설명해 보세요.',a:'Instance Type은 vCPU와 메모리, Machine Image는 시작할 OS, Key Pair는 접속 인증, Boot Volume은 OS가 놓이는 디스크, Network Interface는 Subnet과 Security Group을 정한다.'},
{q:'z2.2xlarge의 vCPU와 메모리를 이름에서 읽는 과정을 설명해 보세요.',a:'z2 타입 표 기준으로 2xlarge는 4 × 2 = 8 vCPU다. 계열의 숫자 2는 vCPU 하나당 메모리 2GiB이므로 메모리는 8 × 2 = 16GiB다.'},
{q:'노드 용량에서 타입별 최대 VM 수를 구할 때 vCPU와 메모리를 모두 계산하는 이유는 무엇인가요?',a:'둘 중 먼저 바닥나는 자원이 VM 수를 정하기 때문이다. vCPU 기준과 메모리 기준을 각각 나누어 더 작은 값을 고른다. 이 값은 이론상 상한이고 실제 수용량은 HA나 오버커밋 등에 따라 달라진다.'},
{q:'Machine Image와 cloud-init의 역할을 구분해 보세요.',a:'Machine Image는 부팅할 수 있는 OS가 든 디스크 파일이다. cloud-init은 그 이미지 안에 있는 서비스로, VM이 시작될 때 user-data 등을 읽어 사용자와 SSH 키 같은 설정을 적용한다.'},
{q:'Key Pair에서 공개키와 개인키는 각각 어디에 있고, 개인키를 잃으면 어떻게 되나요?',a:'공개키는 플랫폼과 VM에 있고 개인키는 사용자가 보관한다. 공개키로 개인키를 다시 만들 수 없으므로 그 키로는 접속할 수 없다. 다른 접속 수단이 있으면 새 공개키를 등록하고, 없으면 데이터를 새 VM으로 옮기는 방법을 검토한다.'},
{q:'Placement Rule의 Hard와 Soft 차이를 Web 서버 2대를 다른 노드에 두는 예로 설명해 보세요.',a:'Hard는 두 VM을 다른 노드에 둘 수 없으면 배치하지 않는다. Soft는 가능하면 다른 노드에 두지만, 불가능하면 같은 노드에라도 배치한다.'}
],
quiz:[
{v:[
 {q:'Instance Type이 정하는 것은?',o:['VM이 쓸 vCPU와 메모리','VM의 OS 종류','VM의 Security Group','VM에 접속할 사용자'],e:'Instance Type은 VM의 자원을 정해 둔 템플릿이다.'},
 {q:'VM의 vCPU와 메모리 크기를 정해 둔 템플릿은?',o:['Instance Type','Machine Image','Key Pair','Placement Rule'],e:'Instance Type(Flavor)이 VM의 자원 크기를 정한다.'}
]},
{v:[
 {q:'Instance Type 이름 z4.xlarge에서 숫자 4의 뜻은?',o:['vCPU 하나당 메모리 4GiB','vCPU 4개','노드 4대','디스크 4TB'],e:'계열의 숫자는 vCPU 하나당 메모리(GiB)를 뜻한다.'},
 {q:'같은 크기일 때 메모리가 가장 많은 Instance Type 계열은?',o:['Z8','Z4','Z2','세 계열 모두 같다'],e:'계열의 숫자가 클수록 vCPU당 메모리가 많다.'}
]},
{gen(){
  const r=2, s=[['large',2],['xlarge',4],['2xlarge',8],['4xlarge',16],['8xlarge',32]][Math.floor(Math.random()*5)], v=s[1];
  const f=(c,m)=>c+' vCPU, '+m+'GiB';
  return {q:'Instance Type z2.'+s[0]+'의 vCPU와 메모리는? (본문의 z2 타입 표 기준: large = 2 vCPU, xlarge = 4 vCPU, Nxlarge = 4 × N vCPU, vCPU당 메모리 2GiB)',
    o:[f(v,v*r),f(v,v*r*2),f(v*2,v*r*2),f(v*2,v*r)],
    e:'z2 타입 표 기준으로 '+s[0]+'는 '+v+' vCPU이고, vCPU당 '+r+'GiB이므로 메모리는 '+v+' × '+r+' = '+(v*r)+'GiB다.'};
}},
{gen(){
  const r=[2,4,8][Math.floor(Math.random()*3)], s=[['large',2],['xlarge',4],['2xlarge',8]][Math.floor(Math.random()*3)], n=[3,5,6,10][Math.floor(Math.random()*4)], v=s[1];
  const f=(c,m)=>c+' vCPU, '+m+'GiB';
  return {q:'z'+r+'.'+s[0]+'('+v+' vCPU, '+(v*r)+'GiB) VM '+n+'대가 쓰는 vCPU와 메모리의 합계는? (오버커밋은 없다고 가정)',
    o:[f(n*v,n*v*r),f(n*v,v*r),f(v,n*v*r),f(n*v,n*v*r*2)],
    e:'한 대가 '+v+' vCPU, '+(v*r)+'GiB이므로 '+n+'대는 '+(n*v)+' vCPU, '+(n*v*r)+'GiB다.'};
}},
{gen(){
  const V=345, M=1382, r=[2,4,8][Math.floor(Math.random()*3)], s=[['large',2],['xlarge',4],['2xlarge',8],['4xlarge',16]][Math.floor(Math.random()*4)], v=s[1], m=v*r;
  const a=Math.floor(V/v), b=Math.floor(M/m), ans=Math.min(a,b), pool=[Math.max(a,b),Math.min(Math.floor(384/v),Math.floor(1536/m)),ans*2,Math.floor(ans/2),ans+1,ans+2], w=[];
  pool.forEach(x=>{ if(x!==ans && x>0 && w.indexOf(x)<0 && w.length<3) w.push(x); });
  return {q:'쓸 수 있는 자원이 '+V+' vCPU, '+M.toLocaleString('en-US')+'GiB일 때 z'+r+'.'+s[0]+'('+v+' vCPU, '+m+'GiB) VM은 이론상 최대 몇 대인가? (가정한 값: 노드 3대 × 128 vCPU·512GiB × 0.9. vCPU와 메모리만 계산하고 소수점은 버림)',
    o:[ans+'대'].concat(w.map(x=>x+'대')),
    e:'이 타입은 '+v+' vCPU, '+m+'GiB다. vCPU 기준 '+V+' ÷ '+v+' = '+a+'대, 메모리 기준 '+M+' ÷ '+m+' = '+b+'대이므로 더 작은 '+ans+'대다.'};
}},
{v:[
 {q:'노드 용량에서 최대 VM 수를 구하는 방법으로 맞는 것은?',o:['vCPU 기준과 메모리 기준을 각각 구해 더 작은 값을 고른다','vCPU 기준만 계산한다','두 기준을 더한다','두 기준 중 더 큰 값을 고른다'],e:'먼저 바닥나는 자원이 VM 수를 정하므로 더 작은 값을 고른다.'},
 {q:'같은 vCPU 수의 타입 중 메모리 비율이 큰 Z8의 최대 VM 수가 Z2보다 적어지는 이유는?',o:['메모리가 먼저 바닥나기 때문이다','vCPU가 더 빠르기 때문이다','디스크를 쓰지 않기 때문이다','네트워크가 다르기 때문이다'],e:'vCPU당 메모리가 많으면 vCPU보다 메모리가 먼저 바닥난다.'}
]},
{v:[
 {q:'Machine Image에 대한 설명으로 맞는 것은?',o:['부팅할 수 있는 OS가 든 가상 디스크를 담은 파일이다','VM의 vCPU 수를 정하는 템플릿이다','VM의 접속 비밀번호 목록이다','물리 노드의 펌웨어이다'],e:'Machine Image는 부팅 가능한 OS가 든 가상 디스크 파일이다.'},
 {q:'같은 OS 상태의 VM을 여러 대 만들 때 원본으로 쓰는 것은?',o:['Machine Image','Instance Type','Key Pair','Security Group'],e:'같은 이미지로 시작하면 같은 OS 상태의 VM을 만들 수 있다.'}
]},
{q:'QCOW2에 대한 설명으로 맞는 것은?',o:['KVM 계열에서 쓰는 가상 디스크 이미지 형식이다','SSH 키 파일 형식이다','네트워크 터널 방식이다','Instance Type의 한 계열이다'],e:'QCOW2는 QEMU Copy-On-Write 2의 줄임말로, KVM 계열의 가상 디스크 형식이다.'},
{q:'Machine Image로 쓰기 위한 조건으로 맞는 것은?',o:['부팅 가능한 시스템 디스크가 하나이고 DHCP로 주소를 받는다','디스크가 반드시 세 개 이상이다','고정 IP만 설정되어 있어야 한다','원격 접속 수단이 없어야 한다'],e:'이미지는 부팅 디스크 하나, DHCP 설정, 원격 접속 수단을 갖춰야 한다.'},
{v:[
 {q:'cloud-init의 역할은?',o:['VM이 시작될 때 VM 안에서 사용자, 키 등의 초기 설정을 적용한다','물리 노드에 OS를 설치한다','VM을 다른 노드로 옮긴다','Security Group 규칙을 검사한다'],e:'cloud-init은 게스트 안의 초기화 서비스다.'},
 {q:'user-data의 내용을 실제로 VM에 적용하는 것은?',o:['이미지 안의 cloud-init','Instance Type','Route Table','Placement Rule'],e:'플랫폼은 데이터를 제공하고, 적용은 게스트 안의 cloud-init이 한다.'}
]},
{q:'Windows에서 cloud-init과 같은 역할을 하는 것은?',o:['Cloudbase-init','KMS','QCOW2','Marketplace'],e:'Windows에서는 Cloudbase-init이 초기 설정을 맡는다.'},
{v:[
 {q:'Key Pair에서 사용자가 보관하고 남에게 주면 안 되는 것은?',o:['개인키','공개키','Instance Type 이름','Security Group ID'],e:'개인키는 본인임을 증명하는 키이므로 사용자만 보관한다.'},
 {q:'VM에 등록되어 접속 허용 여부를 확인하는 데 쓰이는 키는?',o:['공개키','개인키','KMS 키','MAK 키'],e:'VM에는 공개키가 등록되고, 접속할 때 사용자가 개인키로 본인임을 증명한다.'}
]},
{v:[
 {q:'개인키를 잃어버렸을 때의 설명으로 맞는 것은?',o:['공개키로 개인키를 다시 만들 수 없어 그 키로는 접속할 수 없다','공개키로 개인키를 복원하면 된다','VM이 자동으로 삭제된다','VM을 재부팅하면 새 개인키가 만들어진다'],e:'키 쌍은 공개키에서 개인키를 계산할 수 없게 설계되어 있다.'},
 {q:'Upload 방식으로 Key Pair를 만들 때 플랫폼에 올리는 것은?',o:['공개키만','개인키만','공개키와 개인키 모두','OS 비밀번호'],e:'내 PC에서 키 쌍을 만들고 공개키만 올리므로 개인키는 내 PC를 떠나지 않는다.'}
]},
{q:'Boot Volume의 크기를 바꾸는 규칙으로 맞는 것은?',o:['늘릴 수 있지만 줄일 수는 없다','줄일 수 있지만 늘릴 수는 없다','만든 뒤에는 절대 바꿀 수 없다','재부팅할 때마다 자동으로 늘어난다'],e:'볼륨은 늘릴 수 있지만 줄일 수 없으므로 필요한 만큼만 잡는다.'},
{v:[
 {q:'VM의 시작 과정에서 상태가 바뀌는 순서는?',o:['Shutoff → Spawning → Active','Active → Spawning → Shutoff','Spawning → Shutoff → Active','Shutoff → Active → Spawning'],e:'Start를 누르면 Spawning을 거쳐 Active가 된다.'},
 {q:'실행 중인 VM을 Stop하면 어떤 상태가 되나?',o:['Shutoff','Spawning','Active','Deleted'],e:'Stop을 하면 Active에서 Shutoff로 바뀐다.'}
]},
{v:[
 {q:'VM을 삭제할 수 있는 상태는?',o:['Shutoff','Active','Spawning','어떤 상태에서든 가능'],e:'zCompute의 VM은 Shutoff 상태에서만 삭제할 수 있다.'},
 {q:'VM의 Instance Type을 바꿀 수 있는 상태는?',o:['Shutoff','Active','Spawning','재부팅 중'],e:'Instance Type을 바꾸는 Modify는 Shutoff 상태에서 한다.'}
]},
{q:'VM의 펌웨어 설정을 바꾼 뒤 적용하려면?',o:['VM을 완전히 Stop한 뒤 Start한다','OS 안에서 재부팅한다','Security Group을 다시 붙인다','Key Pair를 다시 만든다'],e:'펌웨어 변경은 게스트 재부팅으로는 적용되지 않고 Stop 후 Start해야 한다.'},
{v:[
 {q:'Placement Rule의 Hard에 대한 설명으로 맞는 것은?',o:['규칙을 지킬 수 있을 때만 VM을 배치한다','규칙을 못 지켜도 VM을 배치한다','규칙을 무시한다','VM을 항상 같은 노드에 둔다'],e:'Hard는 제약을 지킬 수 있을 때만 배치한다.'},
 {q:'Placement Rule의 Soft에 대한 설명으로 맞는 것은?',o:['가능하면 규칙을 지키고, 안 되면 그래도 VM을 배치한다','규칙을 못 지키면 VM을 삭제한다','규칙을 못 지키면 배치하지 않는다','관리자만 쓸 수 있다'],e:'Soft는 가능하면 규칙을 따르되, 불가능해도 배치한다.'}
]},
{q:'이중화한 Web 서버 2대에 Placement Rule을 쓰는 이유는?',o:['서로 다른 노드에 두어 노드 하나의 장애로 함께 멈추지 않게 한다','두 VM의 메모리를 합친다','두 VM의 IP를 같게 만든다','Key Pair를 공유하게 한다'],e:'같은 태그의 VM을 다른 노드에 두면 노드 장애의 영향을 줄인다.'},
{q:'KMS의 역할은?',o:['조직 네트워크 안에서 Windows 라이선스를 활성화한다','VM의 SSH 키를 만든다','VM을 노드에 배치한다','디스크 이미지를 변환한다'],e:'KMS는 VM마다 제품 키를 넣지 않고 조직 네트워크 안에서 Windows를 활성화하는 서비스다.'}
]
});
