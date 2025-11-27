# NestJS 사용자 관리 애플리케이션

## 프로젝트 개요

이 프로젝트는 NestJS를 기반으로 구축된 간단한 사용자 관리(CRUD) 애플리케이션입니다. 사용자, 사용자 그룹, 사용자 설정을 관리하는 API를 제공합니다.

## 설치 및 실행 (Installation and Running)

이 애플리케이션은 PostgreSQL 데이터베이스를 사용합니다. 데이터베이스는 Docker를 통해 손쉽게 실행할 수 있으며, NestJS 애플리케이션은 로컬 환경에서 실행됩니다.

### 1. 환경 변수 설정 (.env)

`.env.sample` 파일을 참고하여 `.env` 파일을 생성하고 데이터베이스 연결 정보를 설정합니다.

```bash
cp .env.sample .env
# .env 파일을 열어 필요한 정보로 수정합니다.
```

예시 (`.env` 파일 내용):

```
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mydatabase
```

### 2. 데이터베이스 실행 (Docker)

Docker Compose를 사용하여 PostgreSQL 데이터베이스 컨테이너를 실행합니다.

```bash
docker-compose up -d postgres
```

데이터베이스 컨테이너가 성공적으로 시작되었는지 확인합니다.

### 3. 애플리케이션 설치 및 실행 (Local)

Node.js 환경에서 다음 명령어를 실행하여 애플리케이션 의존성을 설치하고 개발 모드로 실행합니다.

```bash
npm install
npm run start:dev
```

애플리케이션은 기본적으로 `http://localhost:3000`에서 실행됩니다.

## API 문서 (API Documentation)

애플리케이션이 실행 중인 경우, 다음 URL에서 Swagger UI를 통해 API 문서를 확인할 수 있습니다.

*   **Swagger UI**: `http://localhost:3000/api`

## 추가 개선 제안 (Suggestions for Further Improvements)

현재 애플리케이션은 기본적인 기능만을 제공하고 있습니다. 다음은 프로젝트를 더욱 고도화하기 위한 몇 가지 제안입니다.

1.  **인증 및 인가 (Authentication & Authorization)**: JWT(JSON Web Token) 등을 활용하여 사용자 로그인, 회원가입 기능을 구현하고, 각 API 엔드포인트에 대한 접근 권한을 관리합니다.
2.  **데이터 유효성 검사 강화 (Enhanced Data Validation)**: `class-validator`와 `class-transformer`를 더욱 적극적으로 활용하여 DTO(Data Transfer Object) 레벨에서 데이터 유효성 검사를 강화하고, 커스텀 유효성 검사 규칙을 추가합니다.
3.  **예외 처리 (Exception Handling)**: NestJS의 내장 예외 필터(Exception Filters)를 활용하여 일관된 방식으로 예외를 처리하고, 사용자에게 더 유용한 오류 메시지를 반환합니다.
4.  **로깅 (Logging)**: `Winston`이나 `Pino`와 같은 로깅 라이브러리를 통합하여 애플리케이션의 동작을 상세하게 기록하고, 운영 환경에서 문제 발생 시 진단을 용이하게 합니다.
5.  **테스트 코드 작성 (Writing Test Code)**: 현재 존재하는 기본적인 테스트 외에, 서비스 계층 및 컨트롤러 계층에 대한 단위 테스트와 통합 테스트를 추가하여 코드의 안정성을 높입니다.
6.  **페이지네이션 및 필터링 (Pagination & Filtering)**: 목록 조회 API에 페이지네이션, 정렬, 검색 및 필터링 기능을 추가하여 대량의 데이터를 효율적으로 다룰 수 있도록 합니다.
7.  **Docker 배포 환경 구축**: 현재는 DB만 Docker로 실행하고 있지만, 최종 배포를 위해 NestJS 애플리케이션도 Docker 컨테이너로 빌드하고 `docker-compose.yml`에 통합하여 단일 명령어로 전체 서비스를 배포할 수 있도록 합니다. (현재는 로컬 개발 편의성 위주)
8.  **환경별 설정 관리**: `@nestjs/config`를 활용하여 개발, 스테이징, 프로덕션 등 환경별로 다른 설정을 관리하는 체계를 더욱 명확히 합니다.