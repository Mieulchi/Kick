# React 관련 라이브러리들 설치

### `npm install`

### `npm start`

# backend 서버 구동 : kick/src/backend/server.js,

### cd 'kick/src/backend' 폴더에서 npm install

### then 'node server.js' : 게시글 관련 기능들을 실행하기 위해 필요합니다.

### 자체 개발 환경에서는 npm install, npm start, node server.js 로 모두 실행 가능합니다.

### 혹시 라이브러리 관련 오류가 뜬다면 npm install ${해당 라이브러리 이름} 부탁드립니다 ...

# core libraries used in Kick

### GoogleMap APIs
"@react-google-maps/api": "^2.20.3", 
"@vis.gl/react-google-maps": "^1.4.0", //이 두 개는 구글맵 관련 api
"react-places-autocomplete": "^7.3.0", //장소 검색 api

### 각종 API 사용 위한 Axios
    "axios": "^1.7.8",

### React 자체 라이브러리 + Css
    "react": "^18.3.1",
    "react-bootstrap": "^2.10.5",
    "react-icons": "^5.3.0",
    "bootstrap": "^5.3.3",

### 써드파티 라이브러리이지만 중요, Page Routing 관련 기능들
    "react-router-dom": "^6.27.0",
    "react-dom": "^18.3.1",

### 백엔드 기능
    "express": "^4.21.1",
    "multer": "^1.4.5-lts.1",
    "sqlite3": "^5.1.7",
    "upload": "^1.3.2",
    "jsonwebtoken": "^9.0.2",
    "cors": "^2.8.5",

### 네이버 API 사용 시 CORS 문제 해결
package.json - "proxy": "https://openapi.naver.com" 추가
