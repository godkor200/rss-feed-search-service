# RSS/Feed Search MVP (Kubernetes 학습용 사이드 프로젝트)

이 저장소는 **RSS/블로그/뉴스 피드 수집 + 검색 + 요약 저장 시스템**의 MVP 부트스트랩입니다.
프로젝트 목표는 **Kubernetes 학습**에 초점을 맞춘 확장 가능한 백엔드 아키텍처를 만드는 것입니다.

## 🧰 구성 요소
- NestJS API 서버 (TypeScript 기반)
- PostgreSQL (데이터 저장)
- Redis (캐시 및 큐 준비)

> 🔜 이후 단계: OpenSearch, Worker, Kubernetes 매니페스트 등 추가 예정

## 🚀 빠른 시작 (컨테이너화 - 추천)

### 전체 스택 실행 (Docker Compose)

```bash
docker compose up --build -d
```

- NestJS API: `http://localhost:3000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

### 서버 확인

- 건강 체크: `http://localhost:3000/health`
- 루트: `http://localhost:3000/`

---

## 🚀 빠른 시작 (개발 - 로컬 Node.js 환경)

### 1) 종속성 설치

```bash
npm install
```

### 2) Docker Compose로 PostgreSQL + Redis 실행

```bash
docker compose up -d postgres redis
```

### 3) 로컬 서버 실행

```bash
npm run start:dev
```

- 기본 연결 정보
  - PostgreSQL: `localhost:5432`
  - Redis: `localhost:6379`
  - 계정 정보: [`.env.example`](/Users/yubyeong-gug/project/side-project/.env.example)

### 4) 서버 확인

- 건강 체크: `http://localhost:3000/health`
- 루트: `http://localhost:3000/`

---

## 📦 프로젝트 구조

- `src/` - NestJS API 소스
- `Dockerfile` - NestJS 앱 컨테이너 빌드 설정
- `docker-compose.yml` - 전체 스택 (API + DB + 캐시) 컨테이너 오케스트레이션
- `.dockerignore` - Docker 빌드 제외 파일

---

## 🔭 다음 개발 단계

1. Feed 수집/파싱 서비스
2. 저장소 (Postgres) 모델 및 마이그레이션
3. 검색 인덱스 (OpenSearch)
4. 백그라운드 작업 큐와 Worker
5. Kubernetes 매니페스트
