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
