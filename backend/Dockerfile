ARG NODE_VERSION=22.19.0

FROM node:${NODE_VERSION} AS dev

# 컨테이너 내부의 작업 디렉토리를 /src로 설정하겠다는 것인데
# src 디렉토리가 없으면 알아서 생성을 해주며, 그 폴더로 이동도 해준다.
# 기준은 컨테이너 파일 시스템의 루트 /를 기준으로 한다.
WORKDIR /src

# package.json과 package-lock.json을 ./ (현재 작업 디렉토리, ./는 현재위치 의미)로 복사한다.
COPY package.json package-lock.json* ./

# 의존성 설치함
RUN --mount=type=cache,target=/root/.npm npm ci

# 이후 로컬 프로젝트 전체를 복사해낸다.
COPY . .

# prisma 파일 기반으로 client를 생성한다.
RUN npx prisma generate 

# 배포 환경은 빌드 결과물을 바탕으로 실행할 것이기 때문.
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]