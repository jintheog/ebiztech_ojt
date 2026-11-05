/* 커리큘럼 정의: 블록(목차 그룹) · 레슨 순서 · 종합시험 · 7주 계획표.
   레슨 본문은 content/lessons/<id>.js 에 있습니다. 파일이 아직 없는 레슨은 "준비 중"으로 표시됩니다.
   일차 번호(day)와 주제는 Zadara_Korea_7주_교육일정표.pdf 표 기준입니다. */
const CURRICULUM = [
  {
    id: 'w1', title: '1주차 · 회사와 IT 기초', short: '1주차',
    exam: { id: 'ex-w1', title: '1주차 종합시험', n: 15 },
    lessons: [
      { id: 'w1-1', week: 1, tag: '1주차 · 1일', title: 'IT 인프라 첫걸음: 컴퓨터, 서버, 데이터센터' },
      { id: 'w1-2', week: 1, tag: '1주차 · 2일', title: '클라우드란 무엇인가' },
      { id: 'w1-3', week: 1, tag: '1주차 · 3일', title: 'Zadara는 무슨 회사인가' },
      { id: 'w1-4', week: 1, tag: '1주차 · 4일', title: '업무 기본 소양과 1주차 산출물' }
    ]
  },
  {
    id: 'it1', title: 'IT 기초 ① · 일차 01–06 서버·가상화·Linux', short: '일차 01–06',
    exam: { id: 'ex-it1', title: '일차 01–06 종합시험', n: 20 },
    lessons: [
      { id: 'd01', week: 2, day: '01', tag: '일차 01', title: 'IT 인프라 아키텍처', act: '각 아키텍처 별 구성 요소 및 개념 설명' },
      { id: 'd02', week: 2, day: '02', tag: '일차 02', title: '서버 하드웨어, 가상화 기술', act: '자원별 역할과 서버·Hypervisor·VM 계층 구분 설명' },
      { id: 'd03', week: 2, day: '03', tag: '일차 03', title: 'Linux 기본', act: '리눅스 디렉토리 구조, 부팅 순서' },
      { id: 'd04', week: 2, day: '04', tag: '일차 04', title: 'Linux 접근 관리', act: '계정 생성·권한 설정·SSH 접속 방법' },
      { id: 'd05', week: 2, day: '05', tag: '일차 05', title: 'Linux 시스템 운영', act: '서비스 상태·로그 및 자원 사용량 확인' },
      { id: 'd06', week: 2, day: '06', tag: '일차 06', title: 'Linux 디스크 관리', act: '디스크 연결·Mount 및 용량 확인' }
    ]
  },
  {
    id: 'it2', title: 'IT 기초 ② · 일차 07–10 Network (3주차)', short: '일차 07–10',
    exam: { id: 'ex-it2', title: '일차 07–10 종합시험', n: 15 },
    lessons: [
      { id: 'd07', week: 3, day: '07', tag: '일차 07', title: 'Network 기초', items: 'OSI 7계층, TCP/IP, IPv4 Address, Subnet, CIDR', act: 'IP/Subnet 범위 계산 및 설명' },
      { id: 'd08', week: 3, day: '08', tag: '일차 08', title: 'Network 통신 구조', items: 'Gateway, Routing, VLAN, Public/Private IP, L2/L3', act: '패킷이 목적지까지 이동하는 경로 설명' },
      { id: 'd09', week: 3, day: '09', tag: '일차 09', title: 'Network 주요 서비스', items: 'DNS, NAT, TCP/UDP, Port, 통신 확인 명령어', act: 'DNS 조회·포트·경로 테스트' },
      { id: 'd10', week: 3, day: '10', tag: '일차 10', title: 'Network 보안·서비스', items: 'Firewall, Security Group, HTTP/HTTPS, TLS, SSH, Load Balancing', act: '접속 허용/차단 및 웹 요청 경로 설명' }
    ]
  },
  {
    id: 'it3', title: 'IT 기초 ③ · 일차 11–14 Storage·Cloud (4주차)', short: '일차 11–14',
    exam: { id: 'ex-it3', title: '일차 11–14 종합시험', n: 15 },
    lessons: [
      { id: 'd11', week: 4, day: '11', tag: '일차 11', title: 'Storage 기초 Ⅰ', items: 'Block Storage, SAN, RAID, iSCSI, Volume, LUN', act: '서버의 Block Volume 사용 과정 설명' },
      { id: 'd12', week: 4, day: '12', tag: '일차 12', title: 'Storage 기초 Ⅱ', items: 'File/NAS, NFS, SMB, Object Storage, S3 API', act: 'Block·File·Object 차이 비교' },
      { id: 'd13', week: 4, day: '13', tag: '일차 13', title: '데이터 보호', items: 'Snapshot, Clone, Backup, Restore, Replication, RPO/RTO', act: '데이터 보호 방식과 복구 목표 구분' },
      { id: 'd14', week: 4, day: '14', tag: '일차 14', title: 'Cloud Computing', items: 'IaaS/PaaS/SaaS, Public/Private/Hybrid Cloud, Shared Responsibility', act: '클라우드 서비스 유형·책임 범위 설명' }
    ]
  },
  {
    id: 'zc', title: 'Zadara zCompute (5–6주차)', short: 'zCompute',
    exam: { id: 'ex-zc', title: 'zCompute 종합시험', n: 20 },
    lessons: [
      { id: 'zc1', week: 5, tag: 'zCompute 1', title: '플랫폼 및 권한', items: 'Region · Account · Project · IAM' },
      { id: 'zc2', week: 5, tag: 'zCompute 2', title: '네트워크 설계', items: 'VPC · Subnet · Route Table · Security Group' },
      { id: 'zc3', week: 5, tag: 'zCompute 3', title: 'VM 리소스', items: 'Instance Type · Image · Key Pair' },
      { id: 'zc4', week: 5, tag: 'zCompute 4', title: 'Linux Web 서버 (실습 과제 1)', items: 'SSH 접근 · Nginx/Apache · SG 설정' },
      { id: 'zc5', week: 6, tag: 'zCompute 5', title: '데이터 볼륨', items: 'Volume 연결 및 기본 데이터 보호 개념' },
      { id: 'zc6', week: 6, tag: 'zCompute 6', title: 'Load Balancing (실습 과제 2)', items: 'LB · Target Group · Listener · Health Check' },
      { id: 'zc7', week: 6, tag: 'zCompute 7', title: '기본 모니터링', items: 'Metrics · Events · Alarms · 상태 점검' },
      { id: 'zc8', week: 6, tag: 'zCompute 8', title: '구축 결과 검증 (실습 과제 3)', items: 'Web/App 기본 아키텍처 작성, 구축 보고서 작성' }
    ]
  },
  {
    id: 'zs', title: 'Zadara zStorage (7주차)', short: 'zStorage',
    exam: { id: 'ex-zs', title: 'zStorage 종합시험', n: 15 },
    lessons: [
      { id: 'zs1', week: 7, tag: 'zStorage 1', title: 'zStorage 플랫폼 이해', items: 'VPSA 아키텍처, Storage Pool, Volume, 스토리지 구성 요소', act: 'VPSA·Pool·Volume 관계 설명' },
      { id: 'zs2', week: 7, tag: 'zStorage 2', title: 'Block Storage', items: 'iSCSI, Volume 생성·연결, Linux Filesystem, Mount', act: 'VM에서 Volume 연결·사용' },
      { id: 'zs3', week: 7, tag: 'zStorage 3', title: 'File Storage (NAS)', items: 'NFS/SMB, Share 구성, 접근 제어, Linux NFS Mount', act: 'NAS Share 생성·마운트' },
      { id: 'zs4', week: 7, tag: 'zStorage 4', title: 'Object Storage', items: 'NGOS, S3 호환 API, 계정·컨테이너/버킷, 객체 전송', act: '객체 업로드·다운로드' },
      { id: 'zs5', week: 7, tag: 'zStorage 5', title: '데이터 보호·장애 점검', items: 'Snapshot, Clone, Backup, Restore, 연결 장애 진단', act: '데이터 변경 후 복구 검증' }
    ]
  }
];

/* 7주 계획표: [날짜, 공부할 것, 링크(레슨·시험 id), 함께 할 것]. 회사 일정에 맞춰 날짜는 조정해도 됩니다. */
const PLAN = [
  ['1주차 1일', 'IT 인프라 첫걸음', 'w1-1', '온라인 노트에 페이지 3개 만들기 · 필독서 1권째 시작'],
  ['1주차 2일', '클라우드란 무엇인가', 'w1-2', '아침: 1일차 복습 15분 · 필독서'],
  ['1주차 3일', 'Zadara는 무슨 회사인가', 'w1-3', '아침: 2일차 복습 · 필독서'],
  ['1주차 4일', '업무 기본 소양과 1주차 산출물', 'w1-4', '아침: 3일차 복습 + 1일차 3일 복습 · 필독서'],
  ['1주차 5일', '오전: 1주차 종합시험 → 오후: 일차 01 IT 인프라 아키텍처', 'ex-w1', 'IT 용어 정리 · 필독서 과제 1 마무리'],
  ['2주차 1일', '일차 02 서버 하드웨어, 가상화 기술', 'd02', '아침: 일차 01 구성도 안 보고 다시 그리기 · 필독서 2권째'],
  ['2주차 2일', '일차 03 Linux 기본', 'd03', '연습 터미널 미션 A'],
  ['2주차 3일', '일차 04 Linux 접근 관리', 'd04', '미션 B · 명령어 모음 정리 시작'],
  ['2주차 4일', '일차 05 Linux 시스템 운영', 'd05', '미션 C'],
  ['2주차 5일', '일차 06 Linux 디스크 관리', 'd06', '미션 D · 산출물: 구성도, Linux 학습 결과'],
  ['3주차 1일', '오전: 일차 01–06 종합시험 → 일차 07 Network 기초', 'd07', '점수 낮은 레슨만 다시 보기'],
  ['3주차 2일', '일차 08 Network 통신 구조', 'd08', ''],
  ['3주차 3일', '일차 09 Network 주요 서비스', 'd09', ''],
  ['3주차 4일', '일차 10 Network 보안·서비스', 'd10', ''],
  ['3주차 5일', '일차 07–10 종합시험 · 주간 과제 발표·리뷰', 'ex-it2', '산출물: 운영 명령어, Subnet 과제'],
  ['4주차 1일', '일차 11 Storage 기초 Ⅰ', 'd11', ''],
  ['4주차 2일', '일차 12 Storage 기초 Ⅱ', 'd12', ''],
  ['4주차 3일', '일차 13 데이터 보호', 'd13', ''],
  ['4주차 4일', '일차 14 Cloud Computing', 'd14', ''],
  ['4주차 5일', '일차 11–14 종합시험 · 기초 학습 발표', 'ex-it3', '산출물: 기술 비교 자료, 기초 학습 발표'],
  ['5주차', 'zCompute 1–4: 플랫폼·권한, 네트워크, VM, Linux Web 서버', 'zc1', '실습 과제 1 · 산출물: VM 구축 결과, 설정 내역서'],
  ['6주차', 'zCompute 5–8: 볼륨, Load Balancing, 모니터링, 구축 결과 검증', 'zc5', '실습 과제 2·3 · 산출물: 아키텍처, 구축 작업서'],
  ['6주차 5일', 'zCompute 종합시험', 'ex-zc', ''],
  ['7주차', 'zStorage 1–5: VPSA, Block, NAS, Object, 데이터 보호', 'zs1', '산출물: 스토리지 구성·복구 보고서'],
  ['7주차 5일', 'zStorage 종합시험', 'ex-zs', 'OJT 이후: 고객사·KT Cloud/AWS 연계 환경, 운영 업무 후속 교육']
];
