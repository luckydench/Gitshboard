<div align="center">

<img width="400" src="./readme_img/Gitshboard_logo.png" />


# Gitshboard

<br />


<img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
<img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/React_Router-7.13-CA4245?style=flat-square&logo=reactrouter&logoColor=white" alt="React Router" />
<img src="https://img.shields.io/badge/Tailwind_CSS-4.2-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
<img src="https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat-square&logo=reactquery&logoColor=white" alt="TanStack Query" />
<img src="https://img.shields.io/badge/Zustand-5-433E38?style=flat-square" alt="Zustand" />
<br />
<img src="https://img.shields.io/badge/Node.js-22-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
<img src="https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
<img src="https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
<img src="https://img.shields.io/badge/GitHub_API-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub API" />
<img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />

</div>


## 개요

[Gitshboard](https://gitshboard.vercel.app/)

`Gitshboard`는 GitHub 계정과 연동하여 프로필, 저장소, 커밋 이력 등의 데이터를 시각적으로 정리하는 웹 애플리케이션입니다. 

주 사용 기술, 선호 커밋 시간, 요일별 활동, 개발 분야와 프로젝트 활성도를 분석해 사용자의 개발 패턴을 보여줍니다.


## 주요 기능

#### 1. 프로필 대시보드
프로필, 팔로워·팔로잉 수, 저장소 수와 계정 정보를 확인합니다.

#### 2. 저장소 목록
저장소 설명, 주 사용 언어, Watcher 수, Fork 여부를 카드 형태로 제공합니다.

#### 3. 기술 스택 분석
저장소별 언어 사용량을 집계하여 주요 기술과 비율을 계산합니다.


#### 4. 커밋 패턴 분석
기본 브랜치의 커밋 이력을 기반으로 선호 시간대와 요일별 활동량을 분석합니다.

#### 5. 개발 성향 분석
저장소 언어와 Topic을 조합해 Frontend, Backend, AI, Game, DevOps 등의 성향을 도출합니다.


#### 6. 프로젝트 상태 분석
마지막 Push 시점과 보관 여부를 기준으로 프로젝트를 Active, Idle, Dormant, Archived 상태로 구분합니다.


외에도 현재 다른 계정 검색, 레포 통계 확인 등의 기능을 준비 중입니다.


## 아키텍처
> 해당 아키텍처는 최종 아키텍처가 아니며, 추후 인프라 설계가 바뀌면 아키텍처도 바뀔 수 있습니다.

```mermaid
flowchart LR
    U[사용자 브라우저]
    F[React 프런트엔드<br/>React Router · TanStack Query · Zustand]
    B[Express API 서버<br/>JWT 인증 미들웨어]
    G[GitHub OAuth<br/>REST · GraphQL API]
    P[(PostgreSQL)]

    U --> F
    F -->|OAuth 인증 요청| G
    G -->|Authorization Code| F
    F -->|Code · API 요청<br/>HttpOnly Cookie| B
    B -->|Access Token 교환<br/>사용자·저장소 데이터 조회| G
    G -->|GitHub 데이터| B
    B <-->|Prisma ORM<br/>사용자·토큰 저장| P
    B -->|JSON 응답| F
```

- **Frontend (`frontend/`)**: React Router 기반 SPA로 화면 라우팅, API 상태 관리, 통계 계산과 시각화를 담당합니다.
- **Backend (`backend/`)**: Express 기반 REST API로 OAuth 처리, JWT 검증, GitHub API 연동을 담당합니다.
- **Database**: Prisma를 통해 PostgreSQL에 GitHub 사용자 식별 정보와 Access Token을 저장합니다.
- **External API**: GitHub REST API로 사용자·저장소 정보를, GraphQL API로 언어·커밋·Topic·활성도 데이터를 조회합니다.
- **Deployment**: 프런트엔드는 Vercel, 백엔드는 Docker 이미지 기반 Cloudtype 배포 구성을 사용합니다.


## 실 서비스

![alt text](/readme_img/image.png)

![alt text](/readme_img/image-1.png)