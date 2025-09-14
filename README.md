# 🏛️ 수도권 여행 가이드

서울, 경기도, 인천의 숨겨진 보석 같은 여행지와 맛집을 발견하는 인터랙티브한 여행 가이드 웹앱입니다.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-18.x-green.svg)
![Express](https://img.shields.io/badge/express-4.18.2-lightgray.svg)

## ✨ 주요 기능

### 🔍 스마트 검색 시스템
- **실시간 검색**: 입력하는 즉시 결과 표시
- **다중 필드 검색**: 장소명, 지역명, 카테고리, 주소, 설명, 태그 검색
- **자동완성**: 빠르고 직관적인 검색 경험

### 🗺️ 지역별 탐색
- **서울**: 경복궁, 명동, 홍대, 강남 등 20개 장소
- **경기도**: 에버랜드, 수원화성, 남이섬 등 20개 장소
- **인천**: 차이나타운, 월미도, 송도센트럴파크 등 12개 장소

### 🏷️ 카테고리 필터링
- **관광지**: 궁궐, 공원, 랜드마크
- **맛집**: 전통음식, 현대요리, 지역특산
- **쇼핑**: 백화점, 시장, 아울렛
- **문화시설**: 박물관, 갤러리, 공연장
- **자연명소**: 공원, 하천, 산, 바다

### ❤️ 개인화 기능
- **즐겨찾기**: 로컬 스토리지를 활용한 개인 컬렉션
- **상세 정보**: 주소, 전화번호, 운영시간, 가격 정보
- **평점 시스템**: 5점 만점 별점 표시
- **태그 시스템**: 관련 키워드로 빠른 탐색

### 📱 반응형 디자인
- **모바일 최적화**: 터치 인터페이스 지원
- **태블릿 호환**: 중간 화면 크기 최적화
- **데스크톱 경험**: 대화면에서의 최적 레이아웃

## 🚀 시작하기

### 필수 요구사항
- Node.js 18.x 이상
- npm 또는 yarn

### 설치 및 실행

1. **저장소 클론**
```bash
git clone <repository-url>
cd travel-guide-app
```

2. **의존성 설치**
```bash
npm install
```

3. **서버 실행**
```bash
npm start
```

4. **브라우저에서 확인**
```
http://localhost:3000
```

### 개발 모드 실행

개발 중 파일 변경 시 자동 재시작:
```bash
npm run dev
```

## 📁 프로젝트 구조

```
travel-guide-app/
├── package.json          # 프로젝트 설정 및 의존성
├── server.js             # Express 서버 메인 파일
├── data/
│   └── places.json       # 여행지/맛집 데이터 (52개 장소)
├── public/               # 정적 파일
│   ├── index.html        # 메인 HTML
│   ├── css/
│   │   └── style.css     # 메인 스타일시트
│   ├── js/
│   │   └── script.js     # 클라이언트 JavaScript
│   └── images/           # 이미지 파일
└── README.md            # 프로젝트 문서
```

## 🔌 API 엔드포인트

### 장소 정보 조회
- `GET /api/places` - 전체 장소 목록
- `GET /api/places/:id` - 특정 장소 상세 정보
- `GET /api/places/region/:region` - 지역별 장소 목록
- `GET /api/places/category/:category` - 카테고리별 장소 목록

### 필터링 및 검색
- `GET /api/places/filter?region=서울&category=맛집` - 복합 필터링
- `GET /api/search?q=경복궁` - 키워드 검색

### API 응답 예시
```json
{
  "id": 1,
  "name": "경복궁",
  "region": "서울",
  "category": "관광지",
  "description": "조선왕조의 첫 번째 궁궐...",
  "address": "서울특별시 종로구 사직로 161",
  "phone": "02-3700-3900",
  "hours": "09:00-18:00",
  "price": "성인 3,000원",
  "rating": 4.5,
  "tags": ["역사", "문화재", "궁궐"],
  "latitude": 37.5788,
  "longitude": 126.9770,
  "website": "www.royalpalace.go.kr"
}
```

## 🎨 기술 스택

### 백엔드
- **Node.js**: JavaScript 런타임
- **Express.js**: 웹 프레임워크
- **CORS**: Cross-Origin Resource Sharing
- **fs/promises**: 비동기 파일 시스템

### 프론트엔드
- **HTML5**: 시맨틱 마크업
- **CSS3**: 모던 스타일링, CSS Grid, Flexbox
- **Vanilla JavaScript**: ES6+, 클래스 기반 아키텍처
- **Font Awesome**: 아이콘 라이브러리
- **Google Fonts**: 웹 폰트 (Noto Sans KR)

### 주요 기능 구현
- **검색 최적화**: 디바운싱, 실시간 필터링
- **상태 관리**: 로컬 스토리지 활용
- **반응형**: CSS Grid, Media Queries
- **접근성**: 키보드 네비게이션, ARIA 지원

## 🌈 디자인 시스템

### 컬러 팔레트 (한국 전통 색상)
- **Primary**: `#c73e1d` (주홍색)
- **Secondary**: `#2c5282` (청색)
- **Accent**: `#d4b106` (황금색)
- **Neutral**: Gray 50-900 스케일

### 타이포그래피
- **Primary Font**: Noto Sans KR
- **Fallback**: -apple-system, system-ui
- **크기**: 0.75rem ~ 2.25rem (반응형)

### 간격 시스템
- **기본 단위**: 0.25rem (4px)
- **스케일**: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20

## 🔧 주요 JavaScript 클래스

### `TravelGuideApp`
메인 애플리케이션 클래스로 모든 기능을 관리합니다.

```javascript
class TravelGuideApp {
    constructor()       // 초기화
    init()             // 앱 시작
    loadPlaces()       // 데이터 로드
    applyFilters()     // 필터 적용
    displayPlaces()    // 장소 표시
    showModal()        // 상세 모달 표시
    toggleFavorite()   // 즐겨찾기 토글
    // ... 기타 메서드
}
```

### 주요 기능별 메서드
- **검색**: `handleSearch()`, `clearSearch()`
- **필터링**: `filterByRegion()`, `filterByCategory()`
- **즐겨찾기**: `loadFavorites()`, `saveFavorites()`
- **UI**: `showModal()`, `closeModal()`, `showToast()`

## 📊 데이터 구조

### 장소 정보 스키마
```javascript
{
  id: Number,           // 고유 식별자
  name: String,         // 장소명
  region: String,       // 지역 (서울/경기도/인천)
  category: String,     // 카테고리
  description: String,  // 설명
  address: String,      // 주소
  phone: String,        // 전화번호 (선택)
  hours: String,        // 운영시간
  price: String,        // 가격 정보
  rating: Number,       // 평점 (1-5)
  tags: Array,          // 태그 목록
  images: Array,        // 이미지 파일명 (선택)
  latitude: Number,     // 위도
  longitude: Number,    // 경도
  website: String       // 웹사이트 (선택)
}
```

## 🎯 사용법

### 1. 기본 탐색
1. 브라우저에서 앱에 접속
2. 지역 탭을 클릭하여 원하는 지역 선택
3. 카테고리 필터로 원하는 유형 선택
4. 장소 카드를 클릭하여 상세 정보 확인

### 2. 검색 활용
1. 상단 검색바에 키워드 입력
2. 실시간으로 필터링되는 결과 확인
3. 'X' 버튼으로 검색 초기화

### 3. 즐겨찾기 관리
1. 장소 카드의 하트 아이콘 클릭
2. 상단 메뉴의 '즐겨찾기' 클릭하여 모아보기
3. 브라우저를 닫아도 데이터 유지

### 4. 상세 정보 활용
1. 장소 카드 클릭으로 모달 열기
2. '길찾기' 버튼으로 카카오맵 연결
3. '공유하기'로 장소 정보 공유

## 🔍 포함된 주요 장소

### 서울 (20개)
**관광지**: 경복궁, N서울타워, 창덕궁, 덕수궁, 북촌한옥마을
**맛집**: 명동교자, 진미평양냉면, 삼원가든, 온천집, 광장시장
**문화시설**: 홍대, 인사동, 동대문 DDP, 이태원, 성수동
**자연명소**: 한강공원, 청계천, 반포한강공원, 여의도한강공원
**쇼핑**: 명동, 강남역
**기타**: 경희궁, 남산골한옥마을, 잠실 롯데월드타워

### 경기도 (20개)
**관광지**: 에버랜드, 한국민속촌, 수원화성, 남이섬, 임진각
**맛집**: 수원 통닭거리, 이천 쌀밥집, 가평 닭갈비, 안성 소고기
**문화시설**: 헤이리 예술마을, 포천 아트밸리
**자연명소**: 양평 들꽃수목원, 가평 자라섬, 연천 허브빌리지
**쇼핑**: 파주 프리미엄 아울렛
**기타**: 광명동굴

### 인천 (12개)
**관광지**: 월미도, 강화도, 인천대교, 인천 소래포구
**맛집**: 차이나타운 자장면, 신포국제시장, 연안부두 회센터, 부평 깡통시장
**문화시설**: 인천 차이나타운
**자연명소**: 송도센트럴파크, 청라호수공원, 인천 을왕리해수욕장

## 🛠️ 개발자 가이드

### 새로운 장소 추가
1. `data/places.json` 파일 열기
2. 스키마에 맞춰 새 객체 추가
3. 고유한 ID 부여
4. 서버 재시작

### 스타일 커스터마이징
1. `public/css/style.css`의 CSS 변수 수정
2. 색상, 폰트, 간격 등 조정 가능

### API 확장
1. `server.js`에 새 라우트 추가
2. 에러 처리 및 검증 로직 포함

## 🐛 알려진 이슈

- 이미지 파일은 placeholder로 표시됩니다
- 일부 웹사이트 링크는 예시입니다
- 지도 API는 카카오맵 웹 버전을 사용합니다

## 📈 향후 개선 계획

- [ ] 실제 이미지 추가
- [ ] 지도 API 통합
- [ ] 리뷰 시스템
- [ ] 사용자 계정
- [ ] PWA 지원
- [ ] 다국어 지원
- [ ] 더 많은 장소 데이터

## 🤝 기여하기

1. 포크 후 브랜치 생성
2. 기능 개발 또는 버그 수정
3. 테스트 후 Pull Request
4. 코드 리뷰 및 머지

## 📄 라이센스

MIT License - 자세한 내용은 LICENSE 파일을 참조하세요.

## 📞 문의

프로젝트에 대한 문의사항이나 제안이 있으시면 이슈를 생성해 주세요.

---

**🌟 수도권 여행을 더 즐겁고 편리하게! 🌟**