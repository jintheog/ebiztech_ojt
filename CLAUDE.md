# Zadara Korea 2026 신입사원 기술 OJT

이 폴더는 Zadara Korea 신입사원 기술 OJT(7주 과정) 학습 자료와 산출물을 모아두는 곳입니다.
출처: `Zadara_Korea_7주_교육일정표.pdf` (관련 자료: `Zadara Cloud Platform 기능 소개_20261103.pdf`)

과정 흐름: **회사 이해 → IT 인프라 기초 → Zadara 제품 교육 → 기본 구축·운영 실습**

## 주차별 개요

| 주차 | 교육 주제 | 주요 내용 | 주요 산출물 |
|---|---|---|---|
| 1주 | 회사 및 비즈니스 이해 | Zadara 사업·제품 개요, 업무 기본 소양, IT 인프라 구성요소·클라우드 개념 | 필독서 과제 1, IT 용어 정리 |
| 2주 | IT 기초 ① 서버·가상화·Linux | IT 아키텍처, 서버 HW, 가상화, Linux 구조·CLI·SSH·계정/권한 | 구성도, Linux 학습 결과 |
| 3주 | IT 기초 ② Linux·Network | Linux 운영·디스크, TCP/IP, IP·Subnet, Routing, DNS, NAT | 운영 명령어, Subnet 과제 |
| 4주 | IT 기초 ③ 보안·Storage·Cloud | Firewall·HTTP, Block/File/Object, Snapshot·Backup, Cloud 서비스 모델 | 기술 비교 자료, 기초 학습 발표 |
| 5주 | Zadara zCompute ① | Region·Account·Project·IAM, VPC·Subnet, Security Group, VM·Image·Key Pair | VM 구축 결과, 설정 내역서 |
| 6주 | Zadara zCompute ② | Volume, Load Balancer, Target Group, Events/Alarms, Web 서비스 통합 구축 | 아키텍처, 구축 작업서 |
| 7주 | Zadara zStorage | VPSA·Volume, Block/NFS/SMB, NGOS·Object, Snapshot/Clone/Backup, 데이터 복구 | 스토리지 구성·복구 보고서 |

- 1~2주: 직장생활 필독서 2권 병행
- OJT 이후: 주요 고객사·KT Cloud/AWS 연계 환경 및 운영 업무 후속 교육

## IT 인프라 기초 (2~4주, 1일 1개 핵심 주제)

| 일차 | 주제 | 주요 학습 항목 | 학습 확인 / 활동 |
|---|---|---|---|
| 01 | IT 인프라 아키텍처 | 서버·네트워크·스토리지 역할, 3-Tier, Web/WAS/DB | 아키텍처별 구성 요소·개념 설명 |
| 02 | 서버 하드웨어, 가상화 | CPU, Memory, Disk, NIC, Hypervisor | 서버·Hypervisor·VM 계층 구분 |
| 03 | Linux 기본 | 주요 디렉터리, 기본 파일, 부팅 순서 | 디렉터리 구조, 부팅 순서 |
| 04 | Linux 접근 관리 | 기본 명령어, 계정·그룹, 파일 권한, chmod/chown, SSH | 계정 생성·권한 설정·SSH 접속 |
| 05 | Linux 시스템 운영 | Process, Daemon, systemd, System Log, CPU/Memory 모니터링 | 서비스 상태·로그·자원 사용량 확인 |
| 06 | Linux 디스크 관리 | Disk, Partition, Filesystem, Mount, fstab | 디스크 연결·Mount·용량 확인 |
| 07 | Network 기초 | OSI 7계층, TCP/IP, IPv4, Subnet, CIDR | IP/Subnet 범위 계산 |
| 08 | Network 통신 구조 | Gateway, Routing, VLAN, Public/Private IP, L2/L3 | 패킷 이동 경로 설명 |
| 09 | Network 주요 서비스 | DNS, NAT, TCP/UDP, Port, 통신 확인 명령어 | DNS 조회·포트·경로 테스트 |
| 10 | Network 보안·서비스 | Firewall, Security Group, HTTP/HTTPS, TLS, SSH, Load Balancing | 접속 허용/차단, 웹 요청 경로 설명 |
| 11 | Storage 기초 Ⅰ | Block Storage, SAN, RAID, iSCSI, Volume, LUN | 서버의 Block Volume 사용 과정 |
| 12 | Storage 기초 Ⅱ | File/NAS, NFS, SMB, Object Storage, S3 API | Block·File·Object 차이 비교 |
| 13 | 데이터 보호 | Snapshot, Clone, Backup, Restore, Replication, RPO/RTO | 보호 방식·복구 목표 구분 |
| 14 | Cloud Computing | IaaS/PaaS/SaaS, Public/Private/Hybrid, Shared Responsibility | 서비스 유형·책임 범위 설명 |

- 주간 과제(3·4주): 학습 내용 정리 제출, 특정 주제 발표, 리뷰 진행

## Zadara zCompute (5~6주)

**학습 주제:** 플랫폼·권한(Region·Account·Project·IAM) → 네트워크 설계(VPC·Subnet·Route Table·SG) → VM 리소스(Instance Type·Image·Key Pair) → Linux Web 서버(SSH·Nginx/Apache·SG) → 데이터 볼륨 → Load Balancing(LB·Target Group·Listener·Health Check) → 기본 모니터링(Metrics·Events·Alarms) → 구축 결과 검증

**실습 과제 1) Linux 서버 구축**
1. Linux VM 생성 또는 실습용 환경 준비
2. 사용자 계정 생성 및 SSH 접속
3. Nginx/Apache 설치 및 Web 서비스 실행
4. SG 및 접근 포트 설정
5. 서비스 동작 및 네트워크 연결 확인
6. 시스템 로그 및 리소스 사용량 확인

**실습 과제 2) Web 서버 이중화 구성**
1. 테스트 VPC 및 Subnet 생성
2. Linux Web VM 2대 생성
3. Web 서버 설치 및 서비스 확인
4. Load Balancer와 Target Group 구성
5. Security Group 접근 정책 설정
6. Web 서버 1대 중지 시 서비스 상태 확인
7. 리소스 및 Event 정보 확인

**실습 과제 3) Zadara Cloud 기반 고객 Web 서비스 인프라 구축 및 운영**
가상의 고객사 요청을 받은 클라우드 엔지니어로서 인프라를 설계·구축하고 문서화
1. Web/App 서버 2대씩 구성 및 서비스 이중화
2. Load Balancer를 통한 외부 HTTP 서비스 제공
3. Public/Private Subnet 구분
4. 내부 서버 접근 통제 방안
5. Storage 연결 및 데이터 저장 방식
6. Protection Group을 통한 백업·복구 절차와 정책 마련
7. SG를 사용한 Network 및 접근 제어

**제출물:** 인프라 아키텍처 구성도(네트워크 및 서비스 플로우), 리소스 내역서, 작업 절차 최종 보고서

## Zadara zStorage (7주)

| 순서 | 교육 주제 | 주요 학습 및 실습 내용 | 실습 목표 / 확인 |
|---|---|---|---|
| 1 | zStorage 플랫폼 이해 | VPSA 아키텍처, Storage Pool, Volume | VPSA·Pool·Volume 관계 설명 |
| 2 | Block Storage | iSCSI, Volume 생성·연결, Linux Filesystem, Mount | VM에서 Volume 연결·사용 |
| 3 | File Storage (NAS) | NFS/SMB, Share 구성, 접근 제어, Linux NFS Mount | NAS Share 생성·마운트 |
| 4 | Object Storage | NGOS, S3 호환 API, 계정·컨테이너/버킷, 객체 전송 | 객체 업로드·다운로드 |
| 5 | 데이터 보호·장애 점검 | Snapshot, Clone, Backup, Restore, 연결 장애 진단 | 데이터 변경 후 복구 검증 |

**제출물:** 스토리지 구성 작업 절차 최종 보고서

## 작업 시 참고
- 산출물(보고서·구성도·내역서)은 한국어로 작성하는 것을 기본으로 함
- 질문·도움 요청은 현재 진행 중인 주차와 해당 산출물 기준으로 맥락을 맞출 것
- 원본 일정표 참고 사항: 2~4주 슬라이드 부제는 "15일 과정(01–15일)"이지만 표에는 01~14일차만 있음

---

# 학습용 웹 앱 작업 현황 (이어서 작업할 때 여기부터 읽기)

`reference_학습장.html`(기존 단일 파일 학습장: 1주차 + 일차 01~06)의 디자인·기능을 바탕으로, 위 7주 커리큘럼 전체를 담는 학습 웹 앱을 만드는 중입니다.

- **상세 계획 파일:** `C:\Users\user\.claude\plans\foamy-shimmying-widget.md` (폴더 구조, 레슨 형식, 단계, 검증 방법)
- **원격 저장소:** https://github.com/jintheog/ebiztech_ojt.git (`main`)
- **최종 갱신:** 2026-11-06, 보완 1 완료 시점

## 진행 상황

| 단계 | 내용 | 상태 |
|---|---|---|
| 1 | 앱 골격 + 기존 레슨 10개(w1-1~w1-4, d01~d06) 이전 | ✅ 완료 (커밋 `8704a00`) |
| 2 | 3주차 일차 07~10 Network 레슨 4개 (`d07`~`d10`) + 서브넷 계산기 위젯(넣을지 사용자 확인 필요) | ⏭ 다음 차례 |
| 3 | 4주차 일차 11~14 Storage·데이터 보호·Cloud 레슨 4개 (`d11`~`d14`) | 대기 |
| 4 | 5~6주차 zCompute 레슨 8개 (`zc1`~`zc8`, 실습 과제 1~3은 zc4·zc6·zc8의 `tasks`) | 대기 |
| 5 | 7주차 zStorage 레슨 5개 (`zs1`~`zs5`) | 대기 |
| 6 | 마무리: 이 문서에 최종 구조 반영, 전체 점검 | 대기 |

기존 레슨 보완 작업 (앱 개발 1~6단계와 구분해 "보완"으로 부름):

| 보완 | 내용 | 상태 |
|---|---|---|
| 1 | 퀴즈 문제 은행(10문제 출제), v·gen 형식, 종합시험 출제 범위(exam:false, x:1, 레슨별 최소 3문제) | ✅ 완료 |
| 2 | 1주차 w1-1~w1-4 정리: 기술 외 문제 삭제, w1-3 회사 PDF 반영, 은행 20슬롯, 셀프체크 5~6 | ⏭ 다음 차례 |
| 3 | 일차 d01~d06 심화: 출력 해석·장애 시나리오 보강, 은행 20슬롯(gen 8 포함), 레슨 하나씩 진행 | 대기 |

- 앱 개발 2단계 이후(`d07`~)의 새 레슨은 처음부터 새 기준(문제 은행 20슬롯, v·gen 형식, 아래 "문제 은행 규칙")으로 만듭니다.

사용자 결정 사항:
- 블록 하나를 끝낼 때마다 사용자에게 확인을 받고 다음 단계로 넘어갑니다.
- 연습 터미널, 종합시험, 질문 노트, 복습 일정은 모두 유지합니다.
- 일차 번호와 tag는 교육일정표 PDF 표를 따릅니다: 일차 07~10은 3주차, 일차 11~14는 4주차입니다.

## 앱 구조

```
index.html            더블클릭으로 열림 (서버 없음, file://)
app/
  core.js             공통 함수, 상태(localStorage), OJT.lesson() 등록, 레슨 로더, 목차, 라우터
  home.js             홈(진도·복습·대응표·7주 계획표·백업), 공부법
  lesson.js           레슨 화면, 셀프체크, 퀴즈, 실습 체크리스트(tasks), 완료·복습, 준비 중 화면(vSoon)
  cards.js exam.js qnote.js widgets.js terminal.js styles.css
content/
  curriculum.js       블록 6개 · 레슨 31개 순서/메타(일차, 학습 항목, 활동) · 블록별 종합시험 · PLAN(7주 계획표)
  guide.js            공부법 본문
  lessons/<id>.js     레슨 1개 = 파일 1개
tests/apptest.html    동작 테스트 페이지
```

- `file://`에서는 ES 모듈과 fetch를 쓸 수 없습니다. 그래서 모든 파일은 일반 `<script>`이고 전역 스코프를 공유합니다.
- `core.js`가 `curriculum.js`의 순서대로 `content/lessons/<id>.js`를 동적으로 불러옵니다. 파일이 없으면 목차와 홈에 "준비 중"으로 표시됩니다(개발자 도구의 파일 없음 오류는 정상입니다).
- 저장 키는 `zadara-ojt-7w-v1`입니다. 상태 구조는 `{guide, L:{레슨id:{quiz,qlast,es,et,note,done,rv,tk}}, cards, exams, term, qn, ts}`입니다.

## 레슨 추가하는 법

1. `content/lessons/<id>.js` 파일을 만듭니다. id와 순서는 이미 `curriculum.js`에 정의되어 있습니다. 형식은 기존 파일(예: `d04.js`)을 그대로 따릅니다.
   ```js
   OJT.lesson({
     id:'d07', week:3, day:'07', tag:'일차 07', mins:'약 3시간',
     title:'…', cover:[['일정표 항목','s1'], …], act:'PDF의 학습 확인/활동',
     goal:[…], terms:[['용어','영문','정의'], …],
     body:`<h2 id="s1">…</h2> …`,      // 첫 절은 반드시 id="s1"
     summary:[…], essay:[{q,a}, …], quiz:[슬롯, …],   // quiz = 문제 은행 (아래 "문제 은행 규칙")
     tasks:[{title:'실습 과제 1) …', items:['단계', …], note:'선택'}],  // 선택
     // exam:false   ← 선택. 이 레슨 문제 전체를 종합시험에서 제외 (레슨 퀴즈는 그대로)
   });
   ```
2. 본문 박스는 `box analogy`(비유), `box mem`(외울 것), `box warn`(주의)를 씁니다. 그림은 `flow`, `layers`, 표는 `tbl-wrap`를 씁니다. 위젯은 `<div data-widget="이름"></div>`로 넣고 `app/widgets.js`의 `WIDGETS`에 등록합니다.
3. 분량과 문체는 기존 레슨에 맞춥니다: 용어 15~20개, 본문 8~10절, 셀프체크 5~6개, **문제 은행 20슬롯**, 쉬운 한국어와 비유.

### 문제 은행 규칙

- `quiz` 배열이 문제 은행이고, 항목 하나가 **슬롯** 하나입니다. 변형 문제는 버전이 여러 개여도 슬롯 1개로 셉니다.
- **레슨 퀴즈:** 풀 때마다 은행에서 10개를 무작위로 뽑습니다(은행이 10개 이하이면 전부 출제). 80점(8/10) 이상이면 통과입니다. "다시 풀기"를 누르거나 다른 레슨에 갔다 오면 새로 뽑습니다. 같은 레슨 화면이 다시 그려질 때(복습 완료, 셀프체크 채점 등)는 뽑힌 문제와 답한 상태를 유지합니다.
- **종합시험:** 블록의 출제 대상 슬롯에서 `n`개(`curriculum.js`)를 뽑습니다. 레슨별 출제 수는 슬롯 수에 비례하고, 레슨마다 최소 3문제가 나옵니다. 최소 합계가 `n`보다 크면 `n`을 그만큼 올립니다. 남는 문제는 무작위로 배분하며, 한 시험에서 같은 슬롯은 두 번 나오지 않습니다.
  - 레슨에 `exam:false`가 있으면 그 레슨 전체를 종합시험에서 뺍니다(예: `w1-4` 업무 기본 소양).
  - 슬롯에 `x:1`이 있으면 그 문제만 종합시험에서 뺍니다. 레슨 퀴즈에는 계속 나옵니다.
- **슬롯 형식 3가지** (구현은 `app/core.js`의 `qMake`·`qDraw`·`examBuild`). 모든 형식에서 `o[0]`이 정답이고, 화면에서는 보기를 섞습니다.
  - `{q, o, e}`: 기본 문제.
  - `{v:[{q,o,e}, …]}`: **변형 문제**. 출제할 때 버전 하나를 무작위로 고릅니다. **개념·상황 문제**는 이 형식으로 쓰고, 같은 개념을 다른 문장이나 시나리오로 묻는 버전을 2~3개 만듭니다.
  - `{gen(){ return {q,o,e} }}`: **생성 문제**. 출제할 때마다 실행합니다. **계산·출력 해석 문제**는 이 형식으로 씁니다. 정답과 오답 보기는 모두 코드로 계산하고, 오답은 흔한 실수로 나오는 값으로 만듭니다(8로 안 나눔, 1024와 1000 혼동 등).
  - gen이 오류를 내거나, 보기가 중복되거나, q·e가 비어 있으면 그 슬롯은 건너뛰고 다른 슬롯을 뽑습니다. 그래도 테스트에서는 실패로 잡히니 이런 슬롯을 남겨 두지 않습니다.
- **출제 범위:** 문제는 기술 내용만 출제합니다. OJT 일정, 몇 주차에 무엇을 배우는지, 앱 사용법은 출제하지 않습니다.

```js
// v 형식: 개념·상황 문제, 버전 2~3개
{v:[
  {q:'VM만 빌리고 OS 설치·패치·앱은 회사가 직접 관리한다. 어떤 서비스 모델인가?', o:['IaaS','PaaS','SaaS','온프레미스'], e:'인프라만 빌리고 OS부터 위는 고객이 관리하면 IaaS입니다.'},
  {q:'고객이 OS 보안 패치까지 책임지는 클라우드 서비스 모델은?', o:['IaaS','PaaS','SaaS','해당 없음'], e:'PaaS·SaaS에서는 OS를 제공자가 관리합니다. OS를 고객이 관리하는 것은 IaaS입니다.'}
]},
// gen 형식: 계산 문제. 정답·오답 모두 코드로 계산
{gen(){
  const mbps=[100,200,500,800][Math.floor(Math.random()*4)], gb=[1,2,4][Math.floor(Math.random()*3)];
  const s=v=>(Math.round(v*10)/10)+'초';
  return {q:mbps+'Mbps 회선으로 '+gb+'GB 파일을 받는 데 이론상 최소 몇 초가 걸릴까? (1GB = 1,000MB)',
    o:[s(gb*1000/(mbps/8)),      // 정답: bit → Byte로 8로 나눔
       s(gb*1000/mbps),          // 오답: 8로 안 나눔
       s(gb*1024/(mbps/8)),      // 오답: 1024와 1000 혼동
       s(gb*1000*8/(mbps/8))],   // 오답: 8을 곱함
    e:mbps+'Mbps ÷ 8 = '+(mbps/8)+'MB/s. '+(gb*1000)+'MB ÷ '+(mbps/8)+' = '+s(gb*1000/(mbps/8))+'.'};
}}
```
4. zCompute·zStorage 레슨은 쓰기 전에 `Zadara Cloud Platform 기능 소개_20261103.pdf`와 `신입사원 기술 부문 OJT 계획서_v4_20261103.pdf`를 먼저 읽습니다. 자료로 확인할 수 없는 콘솔 화면이나 절차는 지어내지 않고 "사내 실습 환경에서 확인" 박스로 표시합니다.

## 검증 방법

Chrome 확장(claude-in-chrome)은 사용자가 설치하지 않기로 했습니다. 대신 설치된 Chrome을 화면 없이(headless) 실행합니다.

```bash
CH="/c/Program Files/Google/Chrome/Application/chrome.exe"; P="<스크래치 폴더>/prof"   # 반드시 별도 프로필
# 화면 렌더 확인
"$CH" --headless=new --disable-gpu --user-data-dir="$P" --virtual-time-budget=4000 --dump-dom "file:///C:/Users/user/Desktop/OJT/index.html#d07"
# 동작 테스트 (phase=1 다음 phase=2, 같은 프로필). 전부 PASS여야 함
"$CH" --headless=new --disable-gpu --user-data-dir="$P" --virtual-time-budget=15000 --dump-dom "file:///C:/Users/user/Desktop/OJT/tests/apptest.html?phase=1"
```
- ⚠ `apptest.html?phase=1`은 localStorage를 지웁니다. 사용자의 평소 브라우저로 열지 말고, 반드시 별도 `--user-data-dir`로 실행합니다.
- 페이지 콘솔 로그는 headless stderr에 잡히지 않습니다. JS 오류는 테스트 페이지의 `JSERROR` 줄로 확인합니다.
- 현재 기준 결과는 phase 1 41개 PASS, phase 2 6개 PASS입니다(문제 은행 규칙 반영 후). `--virtual-time-budget`은 15000 이상으로 줍니다.
- 테스트는 모든 레슨의 gen 슬롯을 각각 100번 실행해 오류, 보기 중복, 정답 개수를 검사합니다. v 슬롯은 모든 버전의 q·o·e를 검사하고, 모든 슬롯이 출제 가능한지도 검사합니다. 새 레슨을 추가한 뒤에는 이 테스트가 전부 PASS인지와 레슨 화면의 셀프체크·용어 개수를 확인합니다.

## git 규칙

- 저장소 사용자는 `jintheog <jintheog11@gmail.com>`입니다(저장소 로컬 설정).
- **단계가 끝날 때마다 커밋하고 `git push`합니다.** 강제 push는 하지 않습니다. 원격에 예상하지 못한 변경이 있으면 멈추고 사용자에게 먼저 알립니다.
- 커밋 메시지는 한국어로 "N단계: …" 형식으로 쓰고, 끝에 `Co-Authored-By` 줄을 붙입니다.
- PDF(회사 원본 자료)는 `.gitignore`로 저장소에서 제외되어 있습니다.
