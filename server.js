const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// JSON 데이터 로드 함수
async function loadPlacesData() {
    try {
        const data = await fs.readFile(path.join(__dirname, 'data', 'places.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('데이터 파일을 읽는 중 오류 발생:', error);
        return { places: [] };
    }
}

// API 엔드포인트

// 전체 장소 데이터 반환
app.get('/api/places', async (req, res) => {
    try {
        const data = await loadPlacesData();
        res.json(data.places);
    } catch (error) {
        console.error('전체 장소 데이터 조회 오류:', error);
        res.status(500).json({ error: '데이터를 불러오는 중 오류가 발생했습니다.' });
    }
});

// 지역별 장소 데이터 반환
app.get('/api/places/region/:region', async (req, res) => {
    try {
        const { region } = req.params;
        const data = await loadPlacesData();
        const filteredPlaces = data.places.filter(place =>
            place.region === decodeURIComponent(region)
        );
        res.json(filteredPlaces);
    } catch (error) {
        console.error('지역별 장소 데이터 조회 오류:', error);
        res.status(500).json({ error: '데이터를 불러오는 중 오류가 발생했습니다.' });
    }
});

// 카테고리별 장소 데이터 반환
app.get('/api/places/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const data = await loadPlacesData();
        const filteredPlaces = data.places.filter(place =>
            place.category === decodeURIComponent(category)
        );
        res.json(filteredPlaces);
    } catch (error) {
        console.error('카테고리별 장소 데이터 조회 오류:', error);
        res.status(500).json({ error: '데이터를 불러오는 중 오류가 발생했습니다.' });
    }
});

// 지역과 카테고리 필터링
app.get('/api/places/filter', async (req, res) => {
    try {
        const { region, category } = req.query;
        const data = await loadPlacesData();
        let filteredPlaces = data.places;

        if (region && region !== '전체') {
            filteredPlaces = filteredPlaces.filter(place =>
                place.region === decodeURIComponent(region)
            );
        }

        if (category && category !== '전체') {
            filteredPlaces = filteredPlaces.filter(place =>
                place.category === decodeURIComponent(category)
            );
        }

        res.json(filteredPlaces);
    } catch (error) {
        console.error('필터링 오류:', error);
        res.status(500).json({ error: '데이터를 불러오는 중 오류가 발생했습니다.' });
    }
});

// 검색 기능
app.get('/api/search', async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.json([]);
        }

        const data = await loadPlacesData();
        const searchTerm = decodeURIComponent(q).toLowerCase();

        const searchResults = data.places.filter(place =>
            place.name.toLowerCase().includes(searchTerm) ||
            place.region.toLowerCase().includes(searchTerm) ||
            place.category.toLowerCase().includes(searchTerm) ||
            place.address.toLowerCase().includes(searchTerm) ||
            place.description.toLowerCase().includes(searchTerm) ||
            place.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );

        res.json(searchResults);
    } catch (error) {
        console.error('검색 오류:', error);
        res.status(500).json({ error: '검색 중 오류가 발생했습니다.' });
    }
});

// 특정 장소 상세 정보
app.get('/api/places/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = await loadPlacesData();
        const place = data.places.find(place => place.id === parseInt(id));

        if (!place) {
            return res.status(404).json({ error: '장소를 찾을 수 없습니다.' });
        }

        res.json(place);
    } catch (error) {
        console.error('장소 상세 정보 조회 오류:', error);
        res.status(500).json({ error: '데이터를 불러오는 중 오류가 발생했습니다.' });
    }
});

// 메인 페이지 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 핸들러
app.use((req, res) => {
    res.status(404).json({ error: '페이지를 찾을 수 없습니다.' });
});

// 에러 핸들러
app.use((error, req, res, next) => {
    console.error('서버 오류:', error);
    res.status(500).json({ error: '내부 서버 오류가 발생했습니다.' });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`
    ================================================
    🏛️  수도권 여행 가이드 웹앱이 시작되었습니다!
    ================================================

    🌐 서버 주소: http://localhost:${PORT}
    📁 데이터: 총 52개의 장소 정보 제공
    🏙️ 지역: 서울, 경기도, 인천
    📱 기능: 검색, 필터링, 상세보기, 즐겨찾기

    ================================================
    `);
});