OJT.lesson({
id:'d01', week:2, day:'01', tag:'일차 01', mins:'약 3시간',
title:'IT 인프라 아키텍처: 3-Tier와 Web·WAS·DB',
cover:[['서버·네트워크·스토리지의 역할','s2'],['요청과 응답의 흐름','s3'],['Web 서버 개념','s4'],['WAS 개념','s5'],['DB 개념','s6'],['3-Tier 구조','s7'],['이중화·로드밸런서','s9']],
act:'각 아키텍처 별 구성 요소 및 개념 설명',
goal:['서버·네트워크·스토리지가 각각 무슨 장비로 이루어지고 무슨 일을 하는지 말할 수 있다','Web 서버·WAS·DB 각각의 역할, 대표 소프트웨어, 기본 포트를 말할 수 있다','1-Tier·2-Tier·3-Tier를 비교하고, 3계층으로 나누는 이유를 설명할 수 있다','요청 하나가 사용자 → Web → WAS → DB를 거쳐 돌아오는 과정을 그림으로 그릴 수 있다'],
terms:[
['아키텍처','Architecture','시스템의 구성 요소와 그 연결 관계를 정리한 설계. "구성도"는 이것을 그림으로 그린 것.'],
['요청 / 응답','Request / Response','클라이언트가 서버에 무언가를 달라고 보내는 것 / 서버가 결과를 돌려주는 것.'],
['HTTP / HTTPS','HyperText Transfer Protocol','웹 브라우저와 웹 서버가 대화하는 약속(규칙). HTTPS는 암호화된 HTTP. 기본 포트 80 / 443.'],
['포트','Port','한 서버(IP 주소) 안에서 서비스를 구분하는 번호. 건물 주소 안의 호실 번호.'],
['스위치 / 라우터','Switch / Router','같은 네트워크 안의 장비끼리 연결하는 장비 / 서로 다른 네트워크를 연결해 길을 찾아 주는 장비.'],
['방화벽','Firewall','정해진 규칙에 따라 통신을 허용하거나 막는 장비·소프트웨어.'],
['웹 서버','Web Server','사용자의 요청을 가장 먼저 받고, 이미지·HTML 같은 정적 파일을 바로 돌려주며, 나머지는 WAS에 넘기는 서버. Nginx, Apache.'],
['리버스 프록시','Reverse Proxy','앞에서 요청을 대신 받아 뒤쪽 서버(WAS)로 전달하고 응답을 받아 돌려주는 역할. 웹 서버가 주로 맡는다.'],
['WAS','Web Application Server','로그인 확인, 주문 계산처럼 프로그램(비즈니스 로직)을 실행하는 서버. Tomcat, JEUS, WebLogic.'],
['DB / DBMS','Database / Database Management System','데이터를 체계적으로 저장하고 꺼내 주는 저장소 / 그것을 관리하는 소프트웨어. MySQL, PostgreSQL, Oracle.'],
['SQL','Structured Query Language','DB에 데이터를 넣고 꺼내고 고치라고 명령하는 언어. 예: SELECT, INSERT, UPDATE, DELETE.'],
['트랜잭션','Transaction','"전부 되거나 전부 안 되거나" 해야 하는 작업 묶음. 계좌 이체의 출금과 입금처럼.'],
['정적 / 동적 콘텐츠','Static / Dynamic','누가 요청해도 같은 내용(로고, CSS) / 사람과 상황에 따라 그때그때 만들어지는 내용(내 장바구니).'],
['3-Tier','3계층 구조','보여주는 층(Web), 처리하는 층(WAS), 저장하는 층(DB)으로 나눈 구조.'],
['이중화','Redundancy','같은 역할의 장비를 2개 이상 두어, 하나가 고장 나도 서비스가 계속되게 하는 것.'],
['SPOF','Single Point of Failure','그 하나가 고장 나면 전체 서비스가 멈추는 지점.'],
['로드밸런서','Load Balancer, LB','들어오는 요청을 여러 서버에 나눠 주는 장비·서비스. Health Check로 고장 난 서버를 빼고 보낸다.'],
['Scale-up / Scale-out','수직 / 수평 확장','서버 한 대의 CPU·메모리를 키우는 것 / 같은 서버의 대수를 늘리는 것.']
],
body:`
<h2 id="s1">아키텍처와 구성도</h2>
<p><b>아키텍처</b>는 "무엇이 있고, 서로 어떻게 연결되어 있나"를 정리한 설계입니다. 엔지니어는 이것을 그림으로 그린 <b>구성도</b>로 대화합니다. 고객의 구축 요청을 받으면 가장 먼저 그리는 것도, 장애가 나면 가장 먼저 펼쳐 보는 것도 구성도입니다. 6주차 산출물인 "인프라 아키텍처 구성도"도 오늘 배우는 내용으로 그립니다.</p>
<p>구성도에는 보통 이런 약속이 있습니다. 회사마다 아이콘은 달라도 의미는 비슷합니다.</p>
<div class="tbl-wrap"><table><thead><tr><th>그림</th><th>뜻</th></tr></thead><tbody>
<tr><td><svg class="fig-ico" viewBox="0 0 96 48" role="img" aria-label="구름 모양"><use href="#i-cloud" x="16" y="4" width="64" height="40"/></svg>구름</td><td>인터넷(바깥 세상)</td></tr>
<tr><td><svg class="fig-ico" viewBox="0 0 96 48" role="img" aria-label="서버 상자와 이름 Web 01"><use href="#i-server" x="0" y="4" width="40" height="40"/><text x="44" y="30">Web 01</text></svg>사각형 + 이름</td><td>서버 (Web 01, WAS 01 …)</td></tr>
<tr><td><svg class="fig-ico" viewBox="0 0 96 48" role="img" aria-label="원통 모양: DB와 스토리지"><use href="#i-db" x="8" y="4" width="40" height="40"/><use href="#i-storage" x="50" y="4" width="40" height="40"/></svg>원통</td><td>DB나 스토리지</td></tr>
<tr><td><svg class="fig-ico" viewBox="0 0 96 48" role="img" aria-label="Private 이름표가 붙은 점선 상자"><rect x="3" y="5" width="90" height="38" rx="5" class="zone"/><text x="11" y="23">Private</text></svg>점선 상자</td><td>네트워크 영역 (Public, Private, VPC 등)</td></tr>
<tr><td><svg class="fig-ico" viewBox="0 0 96 48" role="img" aria-label="443이 적힌 오른쪽 화살표"><line x1="6" y1="32" x2="86" y2="32" class="ln" marker-end="url(#ar)"/><text x="46" y="22" text-anchor="middle">443</text></svg>화살표 + 숫자</td><td>요청이 가는 방향과 포트 번호 (예: → 443)</td></tr>
</tbody></table></div>
<p>오늘의 목표는 이 레슨 맨 끝에 있는 구성도를 <mark>안 보고 손으로 다시 그릴 수 있게</mark> 되는 것입니다.</p>

<h2 id="s2">인프라 3요소를 장비로 보기</h2>
<p>1주차에 배운 서버·네트워크·스토리지를 이번에는 <b>실제 장비와 역할</b>로 구체적으로 봅니다.</p>
<h3>서버: 일을 처리하는 컴퓨터</h3>
<p>물리 서버일 수도 있고 VM일 수도 있습니다. 실무에서는 <b>하는 일</b>로 이름을 붙입니다. 웹 서버, WAS 서버, DB 서버, 배치 서버(정해진 시간에 작업 실행), 모니터링 서버처럼요. 같은 컴퓨터라도 무엇을 설치하느냐에 따라 역할이 정해집니다.</p>
<h3>네트워크: 데이터를 실어 나르는 길</h3>
<div class="tbl-wrap"><table><thead><tr><th>장비</th><th>하는 일</th><th>비유</th></tr></thead><tbody>
<tr><td><b>스위치</b> (L2)</td><td>같은 네트워크 안의 장비들을 케이블로 연결</td><td>한 건물 안의 복도</td></tr>
<tr><td><b>라우터</b> (L3)</td><td>서로 다른 네트워크를 연결하고 목적지까지 길을 찾음</td><td>건물과 건물을 잇는 교차로와 표지판</td></tr>
<tr><td><b>방화벽</b></td><td>규칙에 따라 통신을 허용·차단</td><td>출입구 경비원</td></tr>
<tr><td><b>로드밸런서</b> (L4/L7)</td><td>들어온 요청을 여러 서버에 나눠 줌</td><td>은행 번호표 안내원</td></tr>
</tbody></table></div>
<p class="small muted">L2, L3 같은 숫자는 3주차에 배우는 "OSI 7계층"의 층 번호입니다. 지금은 "숫자가 클수록 더 많은 정보를 보고 판단한다" 정도로 알아 두세요.</p>
<h3>스토리지: 데이터를 오래 보관하는 곳</h3>
<div class="tbl-wrap"><table><thead><tr><th>방식</th><th>뜻</th><th>비유</th></tr></thead><tbody>
<tr><td><b>DAS</b></td><td>서버에 직접 꽂힌 디스크</td><td>내 책상 서랍</td></tr>
<tr><td><b>NAS</b></td><td>네트워크로 연결하는 공유 폴더 (파일 단위)</td><td>사무실 공용 캐비닛</td></tr>
<tr><td><b>SAN</b></td><td>전용 네트워크로 연결해 서버가 자기 디스크처럼 쓰는 저장소 (블록 단위)</td><td>창고를 통째로 빌려 내 창고처럼 쓰기</td></tr>
</tbody></table></div>
<p class="small muted">4주차(Storage 기초)와 7주차(zStorage)에서 자세히 배웁니다. DB 서버는 빠른 스토리지가 특히 중요하다는 것만 기억하세요.</p>

<h2 id="s3">요청과 응답: 웹사이트 하나가 동작하는 과정</h2>
<p>쇼핑몰에서 "내 주문 내역" 버튼을 누르면 무슨 일이 일어날까요?</p>
<div class="flow"><div class="n"><b>사용자</b><small>브라우저</small></div><span class="ar">→</span><div class="n"><b>인터넷</b><small>네트워크</small></div><span class="ar">→</span><div class="n k"><b>Web</b><small>:443</small></div><span class="ar">→</span><div class="n k"><b>WAS</b><small>:8080</small></div><span class="ar">→</span><div class="n k"><b>DB</b><small>:3306</small></div></div>
<ol>
<li>브라우저가 <code>https://shop.example.com/orders</code> 로 <b>HTTPS 요청</b>을 보냅니다. 서버 IP의 443번 포트로 갑니다.</li>
<li><b>웹 서버</b>가 요청을 받습니다. 암호화를 풀고, 요청한 것이 로고 이미지 같은 정적 파일이면 바로 돌려줍니다. 주문 내역처럼 계산이 필요한 요청이면 WAS(8080번 포트)로 넘깁니다.</li>
<li><b>WAS</b>가 "이 사람 로그인했나? 이 사람의 주문은?"을 계산하며 DB(3306번 포트)에 SQL로 물어봅니다.</li>
<li><b>DB</b>가 저장된 주문 데이터를 찾아 돌려줍니다.</li>
<li>WAS가 결과로 화면(HTML)이나 데이터(JSON)를 만들어 웹 서버에 주고, 웹 서버가 암호화해서 사용자에게 <b>응답</b>합니다.</li>
</ol>
<p>응답에는 결과를 알려 주는 <b>상태 코드</b>가 붙습니다. 장애 대응 때 자주 보니 대표적인 것만 알아 두세요.</p>
<div class="tbl-wrap"><table><thead><tr><th>코드</th><th>뜻</th><th>보통 어디 문제?</th></tr></thead><tbody>
<tr><td><code>200</code></td><td>성공</td><td>-</td></tr>
<tr><td><code>404</code></td><td>요청한 것이 없음</td><td>주소 오타, 파일 없음</td></tr>
<tr><td><code>500</code></td><td>서버 내부 오류</td><td>WAS 프로그램 오류인 경우가 많음</td></tr>
<tr><td><code>502</code> / <code>504</code></td><td>뒤쪽 서버 응답 이상 / 시간 초과</td><td>웹 서버는 살아 있는데 WAS가 죽었거나 느림</td></tr>
</tbody></table></div>

<h2 id="s4">Web 서버: 맨 앞에서 손님을 맞는 층</h2>
<p><b>웹 서버</b>는 사용자의 요청을 가장 먼저 받는 서버입니다. 하는 일은 크게 다섯 가지입니다.</p>
<ol>
<li><b>요청 접수</b>: 80(HTTP), 443(HTTPS) 포트에서 요청을 기다립니다.</li>
<li><b>정적 파일 제공</b>: 이미지, CSS, JavaScript, HTML 파일처럼 이미 만들어진 파일은 직접 빠르게 돌려줍니다.</li>
<li><b>WAS로 전달 (리버스 프록시)</b>: 계산이 필요한 요청은 뒤쪽 WAS에 대신 전달하고, 받은 결과를 사용자에게 돌려줍니다. 사용자는 WAS가 있는지도 모릅니다.</li>
<li><b>HTTPS 암호화 처리</b>: 인증서를 가지고 암호화·복호화를 맡습니다. (4주차 TLS)</li>
<li><b>접속 기록</b>: 누가 언제 무엇을 요청했는지 access log, 오류는 error log에 남깁니다.</li>
</ol>
<div class="tbl-wrap"><table><thead><tr><th>대표 소프트웨어</th><th>특징</th></tr></thead><tbody>
<tr><td><b>Nginx</b> (엔진엑스)</td><td>가볍고 동시 접속 처리에 강함. 요즘 가장 많이 씀. 5주차 실습에서 설치</td></tr>
<tr><td><b>Apache httpd</b></td><td>오래되고 기능이 많음. 리눅스 서비스 이름은 httpd</td></tr>
<tr><td><b>WebtoB</b></td><td>국내(티맥스) 제품. 공공기관·금융권에서 자주 보임</td></tr>
</tbody></table></div>
<p>Nginx 설정 파일 일부를 보면 웹 서버가 하는 일이 그대로 보입니다. 지금 문법을 외울 필요는 없고, 의미만 읽어 보세요.</p>
<pre class="code">server {
    listen 443 ssl;                          <span class="c"># 443번 포트에서 HTTPS 요청을 받는다</span>
    location /images/ {
        root /usr/share/nginx/html;          <span class="c"># 이미지는 이 디렉터리에서 직접 돌려준다 (정적)</span>
    }
    location / {
        proxy_pass http://10.0.2.11:8080;    <span class="c"># 나머지 요청은 WAS(10.0.2.11의 8080)로 넘긴다 (리버스 프록시)</span>
    }
}</pre>

<h2 id="s5">WAS: 계산하고 판단하는 층</h2>
<p><b>WAS(Web Application Server)</b>는 개발자가 만든 프로그램을 실행하는 서버입니다. "이 사람이 로그인했나?", "재고가 있나?", "할인을 적용하면 얼마지?" 같은 판단과 계산(<b>비즈니스 로직</b>)을 합니다.</p>
<ul>
<li><b>프로그램 실행</b>: Java, Python, Node.js 등으로 만든 애플리케이션을 돌립니다.</li>
<li><b>DB 연결 관리</b>: DB에 연결을 미리 여러 개 열어 두고 돌려 씁니다(커넥션 풀). 매번 새로 연결하면 느리기 때문입니다.</li>
<li><b>세션 관리</b>: "이 사용자는 로그인한 상태"라는 정보를 기억합니다.</li>
</ul>
<div class="tbl-wrap"><table><thead><tr><th>대표 소프트웨어</th><th>특징</th></tr></thead><tbody>
<tr><td><b>Apache Tomcat</b></td><td>Java WAS의 대표. 무료. 기본 포트 8080</td></tr>
<tr><td><b>JEUS</b></td><td>국내(티맥스) 제품. WebtoB와 짝으로 공공·금융권에서 많이 씀</td></tr>
<tr><td><b>WebLogic, JBoss(WildFly)</b></td><td>대기업용 Java WAS</td></tr>
<tr><td>Node.js, Python(Django 등) 앱</td><td>자바가 아닌 언어로 만든 앱 서버. 하는 역할은 같음</td></tr>
</tbody></table></div>
<h3>WAS도 웹 요청을 받을 수 있는데, 왜 웹 서버를 따로 둘까?</h3>
<ol>
<li><b>효율</b>: 이미지 같은 단순한 파일까지 WAS가 처리하면 비싼 계산 자원을 낭비합니다. 단순한 일은 웹 서버가 빠르게 처리합니다.</li>
<li><b>보안</b>: WAS를 인터넷에 직접 노출하지 않고 웹 서버 뒤에 숨깁니다.</li>
<li><b>분배</b>: 웹 서버가 여러 대의 WAS에 요청을 나눠 줄 수 있습니다.</li>
</ol>

<h2 id="s6">DB: 데이터를 기억하는 층</h2>
<p><b>데이터베이스(DB)</b>는 회원 정보, 상품, 주문 내역처럼 서비스가 기억해야 할 데이터를 체계적으로 저장하는 곳입니다. DB를 관리하는 소프트웨어를 <b>DBMS</b>라고 하지만, 보통 둘 다 "DB"라고 부릅니다.</p>
<div class="box analogy"><span class="lbl">비유로 보면</span>DB는 <b>엑셀 파일</b>과 비슷합니다. 시트 하나가 <b>테이블</b>, 가로 한 줄이 데이터 한 건(<b>행</b>), 세로 칸이 항목(<b>열</b>)입니다. 다만 엑셀과 달리 수천 명이 동시에 읽고 써도 데이터가 꼬이지 않도록 관리해 줍니다.</div>
<div class="tbl-wrap"><table><thead><tr><th>order_id</th><th>user_id</th><th>상품</th><th>금액</th><th>주문일</th></tr></thead><tbody>
<tr><td>5001</td><td>1001</td><td>키보드</td><td>59,000</td><td>2026-11-02</td></tr>
<tr><td>5002</td><td>1002</td><td>마우스</td><td>32,000</td><td>2026-11-03</td></tr>
</tbody></table></div>
<p>WAS는 <b>SQL</b>이라는 언어로 DB에 일을 시킵니다.</p>
<pre class="code">SELECT * FROM orders WHERE user_id = 1001;   <span class="c"># orders 테이블에서 1001번 회원의 주문을 모두 꺼내라</span></pre>
<h3>DB의 종류</h3>
<div class="tbl-wrap"><table><thead><tr><th>종류</th><th>대표 제품 (기본 포트)</th><th>특징</th></tr></thead><tbody>
<tr><td><b>관계형 (RDBMS)</b></td><td>MySQL·MariaDB (3306), PostgreSQL (5432), Oracle (1521), MS SQL Server (1433)</td><td>표 형태, SQL 사용. 주문·결제처럼 정확해야 하는 데이터</td></tr>
<tr><td><b>NoSQL</b></td><td>MongoDB, Redis</td><td>표가 아닌 형태. 대량·빠른 처리, 캐시 등</td></tr>
</tbody></table></div>
<h3>DB가 특별히 중요한 이유</h3>
<ul>
<li><b>정확성</b>: 계좌 이체에서 "출금은 됐는데 입금이 안 된" 상태가 생기면 안 됩니다. DB는 이런 작업을 <b>트랜잭션</b>으로 묶어 "전부 되거나 전부 취소"되게 합니다.</li>
<li><b>스토리지 성능</b>: DB는 디스크를 아주 많이 읽고 씁니다. 그래서 DB 서버에는 빠른 스토리지(높은 IOPS)를 붙입니다. Zadara zStorage 같은 스토리지가 활약하는 곳입니다.</li>
<li><b>백업과 이중화</b>: 서버는 다시 만들 수 있어도 데이터는 잃으면 끝입니다. 그래서 DB는 백업을 하고, 보통 <b>Active(주)–Standby(대기)</b> 두 대로 구성해 데이터를 계속 복제(Replication)합니다.</li>
</ul>

<h2 id="s7">1-Tier, 2-Tier, 3-Tier 비교</h2>
<div class="tbl-wrap"><table><thead><tr><th>구조</th><th>모양</th><th>장점</th><th>단점</th><th>예</th></tr></thead><tbody>
<tr><td><b>1-Tier</b></td><td>한 대에 화면·로직·데이터 전부</td><td>단순, 저렴</td><td>한 대가 죽으면 끝, 확장 불가</td><td>개인 PC 프로그램, 테스트 서버</td></tr>
<tr><td><b>2-Tier</b></td><td>클라이언트(또는 Web+WAS 한 대) ↔ DB</td><td>데이터는 분리됨</td><td>앞단이 무겁고 보안·확장에 한계</td><td>소규모 사내 시스템</td></tr>
<tr><td><b>3-Tier</b></td><td>Web ↔ WAS ↔ DB</td><td>보안·확장·장애 격리</td><td>구성이 복잡, 서버가 많음</td><td>대부분의 기업 웹 서비스</td></tr>
</tbody></table></div>
<div class="box analogy"><span class="lbl">비유로 보면 (식당)</span><b>홀 직원(Web)</b>이 주문을 받고, 물·반찬처럼 이미 준비된 것은 바로 가져다줍니다(정적). 요리가 필요한 주문은 <b>주방(WAS)</b>에 넘깁니다. 주방은 <b>창고·냉장고(DB)</b>에서 재료를 꺼내 요리합니다. 손님은 주방이나 창고에 직접 들어갈 수 없습니다. 1-Tier는 혼자 주문받고 요리하고 장보는 포장마차입니다.</div>
<div class="tbl-wrap"><table><thead><tr><th>계층</th><th>다른 이름</th><th>하는 일</th><th>대표 SW</th><th>기본 포트</th></tr></thead><tbody>
<tr><td><b>Web</b></td><td>Presentation</td><td>요청 접수, 정적 파일, WAS 전달</td><td>Nginx, Apache, WebtoB</td><td>80, 443</td></tr>
<tr><td><b>WAS</b></td><td>Application</td><td>비즈니스 로직 실행</td><td>Tomcat, JEUS</td><td>8080 (흔한 값)</td></tr>
<tr><td><b>DB</b></td><td>Data</td><td>데이터 저장·조회</td><td>MySQL, PostgreSQL, Oracle</td><td>3306, 5432, 1521</td></tr>
</tbody></table></div>

<h2 id="s8">왜 굳이 나눌까</h2>
<ol>
<li><b>보안</b>: DB에는 가장 중요한 데이터가 있습니다. 그래서 DB는 인터넷에서 직접 닿지 않는 <b>내부망(Private)</b>에 두고, WAS만 DB에 접근하게 합니다.</li>
<li><b>확장</b>: 손님이 몰리면 부족한 층만 늘리면 됩니다. 예: 웹 서버만 2대에서 4대로.</li>
<li><b>장애 격리</b>: 한 층에 문제가 생겨도 원인을 찾기 쉽고 다른 층에 영향이 덜 갑니다. 예: 502 오류 → WAS 쪽부터 확인.</li>
<li><b>역할별 관리</b>: 웹, 애플리케이션, DB 담당이 각자 맡은 부분을 관리하고 따로 업데이트합니다.</li>
</ol>
<div class="zones">
<div><h5>PUBLIC 영역 (인터넷에서 접근)</h5><b>로드밸런서</b><br><span class="muted small">외부 요청의 유일한 입구</span></div>
<div><h5>PRIVATE 영역</h5><b>Web · WAS</b><br><span class="muted small">LB를 거친 요청만 받음</span></div>
<div><h5>PRIVATE 영역 (가장 안쪽)</h5><b>DB</b><br><span class="muted small">WAS만 접근 가능</span></div>
</div>
<p class="small muted">이 Public/Private 구분은 3주차(네트워크)와 6주차 과제 3("Public/Private Subnet 구분")에서 직접 구성합니다.</p>

<h2 id="s9">이중화, SPOF, 로드밸런서</h2>
<p>웹 서버가 1대뿐이면 그 서버가 고장 나는 순간 서비스 전체가 멈춥니다. 이렇게 <mark>하나가 망가지면 전체가 멈추는 지점을 SPOF</mark>라고 합니다. 해결책은 같은 역할을 2대 이상 두는 <b>이중화</b>입니다.</p>
<p>서버가 2대면 사용자는 어디로 접속해야 할까요? 앞에 <b>로드밸런서(LB)</b>를 둡니다. LB는 요청을 서버들에 나눠 주고, 몇 초마다 각 서버에 "살아 있니?"라고 확인(<b>Health Check</b>)해서 응답이 없는 서버로는 보내지 않습니다.</p>
<svg class="fig" viewBox="0 0 520 250" role="img" aria-label="로드밸런서 그림: 사용자 요청이 LB로 가고, LB는 정상인 Web 1에만 요청을 보낸다. Health Check에 실패한 Web 2로 가는 선은 점선과 ✕로 표시되어 요청에서 제외된다.">
<use href="#i-cloud" x="0" y="90" width="88" height="56"/>
<text x="44" y="168" class="c">사용자</text>
<line x1="90" y1="120" x2="148" y2="120" class="ln" marker-end="url(#ar)"/>
<use href="#i-lb" x="152" y="92" width="56" height="56" class="acc"/>
<text x="180" y="170" class="c b">LB</text>
<text x="180" y="192" class="c t-s">나눠 주기</text>
<line x1="212" y1="110" x2="372" y2="52" class="ln acc" marker-end="url(#ar-acc)"/>
<text x="286" y="66" class="c t-acc">요청</text>
<line x1="212" y1="132" x2="372" y2="170" class="ln bad dash"/>
<use href="#i-x" x="280" y="139" width="24" height="24" class="bad"/>
<text x="282" y="212" class="c t-bad">Health Check 실패</text>
<use href="#i-server" x="380" y="20" width="56" height="56"/>
<text x="408" y="98" class="c">Web 1</text>
<text x="408" y="120" class="c t-good">정상</text>
<use href="#i-server" x="380" y="142" width="56" height="56" class="bad"/>
<text x="408" y="220" class="c">Web 2</text>
<text x="408" y="242" class="c t-bad">고장 → 제외</text>
</svg>
<h3>계층마다 SPOF 점검하기</h3>
<div class="tbl-wrap"><table><thead><tr><th>계층</th><th>SPOF를 없애는 방법</th></tr></thead><tbody>
<tr><td>LB</td><td>LB 자체도 2대(또는 클라우드의 관리형 LB 사용)</td></tr>
<tr><td>Web</td><td>2대 이상 + LB로 분배</td></tr>
<tr><td>WAS</td><td>2대 이상 + 웹 서버나 내부 LB가 분배</td></tr>
<tr><td>DB</td><td>Active–Standby 2대 + 데이터 복제, 정기 백업</td></tr>
<tr><td>네트워크·전원</td><td>스위치·회선·전원 이중화 (데이터센터·클라우드가 담당)</td></tr>
</tbody></table></div>
<h3>Scale-up과 Scale-out</h3>
<ul><li><b>Scale-up(수직 확장)</b>: 서버 한 대를 더 좋게(CPU·메모리 증설). 간단하지만 한계가 있고, 여전히 1대라 SPOF. DB에 자주 씀.</li><li><b>Scale-out(수평 확장)</b>: 같은 서버를 여러 대로. LB와 함께 쓰며, Web·WAS에 주로 씀. 클라우드의 오토스케일링이 이것을 자동으로 해 줍니다.</li></ul>
<p>6주차 실습 과제 2가 정확히 이것입니다. "웹 서버 2대 + LB를 만들고, 1대를 멈춰도 서비스가 계속되는지 확인하기."</p>

<h2 id="s10">종합: 구성도 한 장으로 정리</h2>
<p>아래는 오늘 배운 것을 모두 합친 전형적인 웹 서비스 구성도입니다. 손노트에 <b>직접 따라 그린 뒤, 다음 날 안 보고 다시 그려 보세요.</b></p>
<svg class="fig" viewBox="0 0 560 868" role="img" aria-label="3-Tier 웹 서비스 종합 구성도: 맨 위 인터넷/사용자 구름에서 HTTPS 443으로 PUBLIC 영역의 Load Balancer에 들어온다. LB는 80번 포트로 PRIVATE 영역의 Web 01과 Web 02에 요청을 나눈다. 각 Web은 8080번으로 WAS 01, WAS 02에, WAS는 3306번으로 DB Active에 연결된다. DB Active와 Standby는 서로 복제하고, DB는 Block 방식으로 스토리지/백업에 연결된다. Web·WAS·DB는 각각 2대로 이중화되어 있다. 그림의 번호 1~6은 아래 체크리스트 번호와 같다.">
<use href="#i-cloud" x="248" y="8" width="104" height="64"/>
<text x="300" y="94" class="c b">인터넷 / 사용자</text>
<g class="badge"><circle cx="384" cy="42" r="13"/><text x="384" y="48">1</text></g>
<line x1="300" y1="102" x2="300" y2="174" class="ln" marker-end="url(#ar)"/>
<text x="312" y="140">HTTPS 443</text>
<g class="badge"><circle cx="430" cy="134" r="13"/><text x="430" y="140">3</text></g>
<rect x="16" y="156" width="528" height="122" rx="12" class="zone"/>
<text x="32" y="184" class="b t-s">PUBLIC</text>
<g class="badge"><circle cx="112" cy="178" r="13"/><text x="112" y="184">4</text></g>
<use href="#i-lb" x="272" y="176" width="56" height="56" class="acc"/>
<text x="340" y="210">Load Balancer</text>
<line x1="284" y1="234" x2="210" y2="328" class="ln" marker-end="url(#ar)"/>
<line x1="316" y1="234" x2="390" y2="328" class="ln" marker-end="url(#ar)"/>
<text x="230" y="276" class="e">80</text>
<text x="370" y="276">80</text>
<rect x="16" y="298" width="528" height="558" rx="12" class="zone"/>
<text x="32" y="326" class="b t-s">PRIVATE</text>
<g class="badge"><circle cx="124" cy="320" r="13"/><text x="124" y="326">4</text></g>
<rect x="138" y="332" width="324" height="90" rx="12" class="pair"/>
<use href="#i-server" x="172" y="336" width="56" height="56"/>
<use href="#i-server" x="372" y="336" width="56" height="56"/>
<text x="200" y="412" class="c">Web 01</text>
<text x="400" y="412" class="c">Web 02</text>
<g class="badge"><circle cx="40" cy="364" r="13"/><text x="40" y="370">2</text></g>
<text x="60" y="370" class="b">Web</text>
<text x="60" y="394" class="t-s">2대</text>
<g class="badge"><circle cx="488" cy="376" r="13"/><text x="488" y="382">5</text></g>
<line x1="200" y1="422" x2="200" y2="474" class="ln" marker-end="url(#ar)"/>
<line x1="400" y1="422" x2="400" y2="474" class="ln" marker-end="url(#ar)"/>
<text x="212" y="454">8080</text>
<text x="412" y="454">8080</text>
<rect x="138" y="478" width="324" height="90" rx="12" class="pair"/>
<use href="#i-server" x="172" y="482" width="56" height="56"/>
<use href="#i-server" x="372" y="482" width="56" height="56"/>
<text x="200" y="558" class="c">WAS 01</text>
<text x="400" y="558" class="c">WAS 02</text>
<text x="60" y="516" class="b">WAS</text>
<text x="60" y="540" class="t-s">2대</text>
<line x1="200" y1="568" x2="200" y2="630" class="ln" marker-end="url(#ar)"/>
<line x1="392" y1="568" x2="214" y2="632" class="ln" marker-end="url(#ar)"/>
<text x="188" y="606" class="e">3306</text>
<text x="330" y="614">3306</text>
<rect x="138" y="636" width="324" height="92" rx="12" class="pair"/>
<use href="#i-db" x="172" y="640" width="56" height="56"/>
<use href="#i-db" x="372" y="640" width="56" height="56"/>
<line x1="234" y1="668" x2="366" y2="668" class="ln acc" marker-start="url(#ar-acc)" marker-end="url(#ar-acc)"/>
<text x="300" y="658" class="c t-acc">복제</text>
<text x="200" y="718" class="c">DB Active</text>
<text x="400" y="718" class="c">DB Standby</text>
<text x="60" y="674" class="b">DB</text>
<text x="60" y="698" class="t-s">2대</text>
<line x1="200" y1="728" x2="200" y2="766" class="ln" marker-end="url(#ar)"/>
<text x="212" y="754">Block</text>
<use href="#i-storage" x="172" y="770" width="56" height="56"/>
<text x="200" y="846" class="c b">스토리지 / 백업</text>
<g class="badge"><circle cx="262" cy="798" r="13"/><text x="262" y="804">6</text></g>
</svg>
<p class="fig-cap">Web·WAS·DB 뒤의 파란 배경은 같은 역할을 2대로 둔 이중화 묶음입니다. 번호는 아래 체크리스트와 같습니다.</p>
<p>구성도를 그릴 때 빠뜨리지 말아야 할 것: <b>① 사용자 진입점 ② 계층별 서버와 대수 ③ 화살표 방향과 포트 ④ Public/Private 영역 ⑤ 이중화 표시 ⑥ 스토리지·백업</b>.</p>
`,
summary:['인프라 장비: 서버(역할별 이름) · 네트워크(스위치·라우터·방화벽·LB) · 스토리지(DAS·NAS·SAN).','요청 흐름: 사용자 → 인터넷 → Web(443) → WAS(8080) → DB(3306), 응답은 거꾸로. 상태 코드 200·404·500·502.','Web = 요청 접수, 정적 파일, WAS로 전달(리버스 프록시), HTTPS, 로그 (Nginx·Apache·WebtoB).','WAS = 비즈니스 로직, DB 연결 관리, 세션 (Tomcat·JEUS). DB = 테이블·SQL·트랜잭션, 백업과 Active-Standby (MySQL·PostgreSQL·Oracle).','3-Tier로 나누는 이유: 보안(DB는 가장 안쪽) · 확장 · 장애 격리 · 역할별 관리.','SPOF는 이중화로 없앤다. 여러 대 앞에 LB(Health Check). Scale-up = 한 대 키움, Scale-out = 대수 늘림.'],
essay:[
{q:'쇼핑몰에서 "주문하기" 버튼을 눌렀을 때부터 완료 화면이 뜰 때까지, Web·WAS·DB가 각각 무엇을 하는지 포트 번호와 함께 순서대로 설명해 보세요.',a:'브라우저가 HTTPS(443)로 주문 요청을 보내면 웹 서버가 받아 암호화를 풀고, 계산이 필요한 요청이므로 WAS(8080)로 전달한다. WAS는 로그인 여부, 재고, 결제 금액을 계산하고 SQL로 DB(3306)에 주문 데이터를 저장한다. DB는 트랜잭션으로 정확히 저장한 뒤 결과를 돌려준다. WAS가 완료 화면을 만들어 웹 서버에 주고, 웹 서버가 사용자에게 응답한다.'},
{q:'Web 서버와 WAS의 차이를 설명하고, WAS가 있는데도 웹 서버를 따로 두는 이유를 말해 보세요.',a:'웹 서버는 요청을 맨 앞에서 받아 이미지·CSS 같은 정적 파일을 바로 돌려주고, 나머지 요청을 WAS로 전달한다. WAS는 로그인 확인, 금액 계산 같은 비즈니스 로직을 실행하고 DB와 연결한다. 웹 서버를 따로 두는 이유는 단순한 파일 처리에 WAS 자원을 낭비하지 않기 위해(효율), WAS를 인터넷에 직접 노출하지 않기 위해(보안), 여러 WAS에 요청을 나눠 주기 위해(분배)다.'},
{q:'1-Tier, 2-Tier, 3-Tier를 비교하고, 기업 서비스가 3-Tier를 많이 쓰는 이유를 설명해 보세요.',a:'1-Tier는 한 대에 화면·로직·데이터가 다 있어 단순하지만 그 한 대가 죽으면 끝이다. 2-Tier는 데이터를 DB로 분리했지만 앞단이 무겁다. 3-Tier는 Web·WAS·DB로 나눠 DB를 가장 안쪽 내부망에 둘 수 있어 보안이 좋고, 부족한 계층만 늘릴 수 있으며, 장애가 나도 어느 계층 문제인지 찾기 쉽다.'},
{q:'웹 서버 1대, WAS 1대, DB 1대로 된 서비스에서 SPOF를 모두 찾고, 각각 어떻게 개선할지 말해 보세요.',a:'세 대 모두 SPOF다. 웹 서버는 2대 이상으로 늘리고 앞에 로드밸런서를 둔다(LB도 이중화하거나 관리형 LB 사용). WAS도 2대 이상으로 늘려 웹 서버나 내부 LB가 나눠 준다. DB는 Active–Standby 2대로 구성해 데이터를 복제하고, 정기 백업을 한다.'}
],
quiz:[
{q:'3-Tier 구조를 사용자 쪽부터 순서대로 나열하면?',o:['Web → WAS → DB','DB → WAS → Web','WAS → Web → DB','Web → DB → WAS'],e:'사용자 요청은 Web이 먼저 받고, WAS가 처리하며, DB가 데이터를 줍니다.'},
{q:'로그인 정보 확인, 결제 금액 계산 같은 비즈니스 로직을 처리하는 계층은?',o:['WAS','Web','DB','로드밸런서'],e:'프로그램 로직 실행은 WAS의 역할입니다. 식당으로 치면 주방입니다.'},
{q:'회원 정보와 주문 내역을 테이블 형태로 저장하고 SQL로 조회하는 것은?',o:['DB (관계형 DBMS)','Web 서버','WAS','방화벽'],e:'MySQL, PostgreSQL, Oracle 같은 관계형 DB입니다.'},
{q:'Nginx, Apache, WebtoB는 주로 어느 계층에 쓰이나요?',o:['Web','WAS','DB','스토리지'],e:'대표적인 웹 서버 소프트웨어입니다. Tomcat, JEUS는 WAS입니다.'},
{q:'웹 서버가 받은 요청을 뒤쪽 WAS에 대신 전달하고 응답을 받아 돌려주는 역할을 무엇이라 하나요?',o:['리버스 프록시','트랜잭션','스냅샷','하이퍼바이저'],e:'Nginx 설정의 proxy_pass가 바로 이 기능입니다.'},
{q:'다음 중 기본 포트 연결이 틀린 것은?',o:['MySQL - 443','HTTP - 80','HTTPS - 443','PostgreSQL - 5432'],e:'MySQL의 기본 포트는 3306입니다. 443은 HTTPS입니다.'},
{q:'DB를 인터넷에서 직접 접근할 수 없는 내부망에 두는 가장 큰 이유는?',o:['가장 중요한 데이터를 보호하기 위해(보안)','DB 속도를 높이기 위해','비용을 줄이기 위해','특별한 이유는 없다'],e:'외부에서는 Web·WAS를 거쳐서만 DB에 닿도록 해 공격 경로를 줄입니다.'},
{q:'웹 페이지에 502 또는 504 오류가 뜬다. 가장 먼저 의심할 곳은?',o:['웹 서버 뒤쪽의 WAS가 죽었거나 너무 느림','사용자 브라우저의 글꼴 설정','DB의 테이블 이름','로고 이미지 파일 크기'],e:'502/504는 웹 서버(프록시)가 뒤쪽 서버로부터 제대로 된 응답을 받지 못했다는 뜻입니다.'},
{q:'SPOF(Single Point of Failure)의 뜻은?',o:['그 하나가 고장 나면 전체 서비스가 멈추는 지점','서버 성능을 측정하는 단위','로드밸런서의 다른 이름','데이터베이스 백업 방식'],e:'SPOF를 없애는 방법이 이중화입니다.'},
{q:'같은 웹 서버를 여러 대로 늘리고 로드밸런서로 나눠 처리하는 확장 방식은?',o:['Scale-out (수평 확장)','Scale-up (수직 확장)','1-Tier','트랜잭션'],e:'대수를 늘리면 Scale-out, 한 대를 키우면 Scale-up입니다.'},
{q:'계좌 이체에서 "출금과 입금이 전부 되거나 전부 취소되게" 묶는 DB 기능은?',o:['트랜잭션','리버스 프록시','Health Check','Scale-out'],e:'트랜잭션은 데이터의 정확성을 지키는 DB의 핵심 기능입니다.'},
{q:'정적 콘텐츠의 예로 알맞은 것은?',o:['사이트 로고 이미지, CSS 파일','내 장바구니 목록','로그인 결과 화면','실시간 주문 내역'],e:'누가 요청해도 같은 내용이면 정적, 사람·상황마다 다르면 동적입니다.'}
]
});
