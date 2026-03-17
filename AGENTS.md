# AGENTS.md

이 파일은 이 리포지토리에서 사용되는 에이전트(예: GitHub Copilot, 내부 개발 봇 등)에 대한 기본 안내와 작업 흐름을 정리합니다.

## 목표
- 프로젝트의 목표와 범위를 간결하게 설명
- 작업 우선순위 및 진행 방식 안내
- 에이전트가 참고할 수 있는 설정/컨벤션 문서 링크

## 기본 정보
- **프로젝트**: RSS/Feed 수집 + 검색 + 요약 저장 시스템 (Kubernetes 학습용 MVP)
- **주요 언어**: TypeScript (NestJS)
- **데이터베이스**: PostgreSQL
- **캐시/큐**: Redis

## 에이전트에게 알려야 할 것들
1. **현재 상태**
   - NestJS API 서버 기본 골격 (컨테이너화됨)
   - Docker Compose로 전체 스택 실행 가능 (API + Postgres + Redis)
   - 아직 검색(예: OpenSearch) 또는 워커 컴포넌트가 없음
   - Kubernetes 매니페스트 미작성

2. **당면 과제**
   - RSS/피드 수집 스케줄링과 저장 로직 구현
   - 검색 인덱싱 (OpenSearch 예정)
   - 백그라운드 처리(큐 + 워커)
   - k8s 배포/매니페스트 작성

3. **개발 환경**
   - 전체 스택 실행: `docker compose up --build -d`
   - 로컬 개발: `npm run start:dev` (DB/Redis는 Docker로 실행)
   - API 엔드포인트: `http://localhost:3000`

## 참고
- `README.md`에서 최신 실행/설치 방법 확인
- 코드 스타일 및 린트 규칙은 추후 추가 예정
