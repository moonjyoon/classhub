// ==========================================
// 수도권 여행 가이드 - 메인 JavaScript
// ==========================================

class TravelGuideApp {
    constructor() {
        this.allPlaces = [];
        this.filteredPlaces = [];
        this.displayedPlaces = [];
        this.currentPage = 0;
        this.placesPerPage = 12;
        this.favorites = this.loadFavorites();
        this.currentFilters = {
            region: '전체',
            category: '전체',
            search: ''
        };

        this.init();
    }

    // 초기화
    async init() {
        try {
            await this.loadPlaces();
            this.setupEventListeners();
            this.applyFilters();
            this.updateFavoritesCount();
            this.hideLoading();
        } catch (error) {
            console.error('앱 초기화 오류:', error);
            this.showError('데이터를 불러오는 중 오류가 발생했습니다.');
            this.hideLoading();
        }
    }

    // 데이터 로드
    async loadPlaces() {
        try {
            const response = await fetch('/api/places');
            if (!response.ok) throw new Error('데이터 로드 실패');

            this.allPlaces = await response.json();
            this.filteredPlaces = [...this.allPlaces];
        } catch (error) {
            console.error('장소 데이터 로드 오류:', error);
            throw error;
        }
    }

    // 이벤트 리스너 설정
    setupEventListeners() {
        // 검색 기능
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const clearSearch = document.getElementById('clearSearch');

        searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.handleSearch();
            }
        });

        searchBtn.addEventListener('click', this.handleSearch.bind(this));
        clearSearch.addEventListener('click', this.clearSearch.bind(this));

        // 지역 탭
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const region = e.currentTarget.dataset.region;
                this.setActiveTab(e.currentTarget, '.tab-btn');
                this.currentFilters.region = region;
                this.applyFilters();
            });
        });

        // 카테고리 필터
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.setActiveTab(e.currentTarget, '.filter-btn');
                this.currentFilters.category = category;
                this.applyFilters();
            });
        });

        // 모달 관련
        const modal = document.getElementById('detailModal');
        const closeModal = document.getElementById('closeModal');
        const modalOverlay = document.querySelector('.modal-overlay');

        closeModal.addEventListener('click', this.closeModal.bind(this));
        modalOverlay.addEventListener('click', this.closeModal.bind(this));

        // ESC 키로 모달 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });

        // 즐겨찾기 및 공유 버튼
        document.getElementById('favoriteBtn').addEventListener('click', this.toggleFavoriteModal.bind(this));
        document.getElementById('shareBtn').addEventListener('click', this.sharePlace.bind(this));
        document.getElementById('getDirectionsBtn').addEventListener('click', this.getDirections.bind(this));

        // 더 보기 버튼
        document.getElementById('loadMoreBtn').addEventListener('click', this.loadMore.bind(this));

        // 네비게이션
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.currentTarget.dataset.section;
                this.handleNavigation(section);
            });
        });

        // 맨 위로 버튼
        const scrollToTopBtn = document.getElementById('scrollToTop');
        scrollToTopBtn.addEventListener('click', this.scrollToTop.bind(this));

        // 스크롤 이벤트
        window.addEventListener('scroll', this.handleScroll.bind(this));

        // 푸터 링크
        document.querySelectorAll('.footer-section a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const region = e.currentTarget.dataset.region;
                const category = e.currentTarget.dataset.category;

                if (region) {
                    this.filterByRegion(region);
                } else if (category) {
                    this.filterByCategory(category);
                }
            });
        });
    }

    // 디바운스 함수
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 검색 처리
    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');
        const query = searchInput.value.trim();

        this.currentFilters.search = query;

        // 클리어 버튼 표시/숨김
        clearSearch.style.display = query ? 'flex' : 'none';

        this.applyFilters();
    }

    // 검색 초기화
    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');

        searchInput.value = '';
        clearSearch.style.display = 'none';
        this.currentFilters.search = '';

        this.applyFilters();
    }

    // 활성 탭 설정
    setActiveTab(activeElement, selector) {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.remove('active');
        });
        activeElement.classList.add('active');
    }

    // 필터 적용
    applyFilters() {
        let filtered = [...this.allPlaces];

        // 지역 필터
        if (this.currentFilters.region !== '전체') {
            filtered = filtered.filter(place =>
                place.region === this.currentFilters.region
            );
        }

        // 카테고리 필터
        if (this.currentFilters.category !== '전체') {
            filtered = filtered.filter(place =>
                place.category === this.currentFilters.category
            );
        }

        // 검색 필터
        if (this.currentFilters.search) {
            const searchTerm = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(place =>
                place.name.toLowerCase().includes(searchTerm) ||
                place.region.toLowerCase().includes(searchTerm) ||
                place.category.toLowerCase().includes(searchTerm) ||
                place.address.toLowerCase().includes(searchTerm) ||
                place.description.toLowerCase().includes(searchTerm) ||
                place.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        this.filteredPlaces = filtered;
        this.currentPage = 0;
        this.displayPlaces(true);
        this.updateResultsInfo();
    }

    // 결과 정보 업데이트
    updateResultsInfo() {
        const resultsTitle = document.getElementById('resultsTitle');
        const resultsCount = document.getElementById('resultsCount');

        let title = '전체 여행지';

        if (this.currentFilters.search) {
            title = `"${this.currentFilters.search}" 검색 결과`;
        } else if (this.currentFilters.region !== '전체' && this.currentFilters.category !== '전체') {
            title = `${this.currentFilters.region} ${this.currentFilters.category}`;
        } else if (this.currentFilters.region !== '전체') {
            title = `${this.currentFilters.region} 여행지`;
        } else if (this.currentFilters.category !== '전체') {
            title = `${this.currentFilters.category}`;
        }

        resultsTitle.textContent = title;
        resultsCount.textContent = this.filteredPlaces.length;
    }

    // 장소 표시
    displayPlaces(reset = false) {
        const cardGrid = document.getElementById('cardGrid');
        const noResults = document.getElementById('noResults');
        const loadMoreBtn = document.getElementById('loadMoreBtn');

        if (reset) {
            cardGrid.innerHTML = '';
            this.displayedPlaces = [];
        }

        const startIndex = this.currentPage * this.placesPerPage;
        const endIndex = startIndex + this.placesPerPage;
        const placesToShow = this.filteredPlaces.slice(startIndex, endIndex);

        if (this.filteredPlaces.length === 0) {
            noResults.style.display = 'block';
            loadMoreBtn.style.display = 'none';
            return;
        }

        noResults.style.display = 'none';

        placesToShow.forEach(place => {
            const card = this.createPlaceCard(place);
            cardGrid.appendChild(card);
        });

        this.displayedPlaces.push(...placesToShow);

        // 더 보기 버튼 표시/숨김
        if (this.displayedPlaces.length < this.filteredPlaces.length) {
            loadMoreBtn.style.display = 'block';
        } else {
            loadMoreBtn.style.display = 'none';
        }

        // 카드 애니메이션
        setTimeout(() => {
            cardGrid.querySelectorAll('.place-card').forEach((card, index) => {
                if (!card.classList.contains('fade-in-up')) {
                    setTimeout(() => {
                        card.classList.add('fade-in-up');
                    }, index * 50);
                }
            });
        }, 100);
    }

    // 장소 카드 생성
    createPlaceCard(place) {
        const card = document.createElement('div');
        card.className = 'place-card';
        card.dataset.placeId = place.id;

        const isFavorite = this.favorites.includes(place.id);
        const stars = this.generateStars(place.rating);
        const categoryIcon = this.getCategoryIcon(place.category);

        card.innerHTML = `
            <div class="card-image" data-category="${place.category}" data-region="${place.region}">
                <i class="placeholder-icon ${categoryIcon}"></i>
                <div class="card-category">${place.category}</div>
                <button class="favorite-icon ${isFavorite ? 'active' : ''}" data-place-id="${place.id}">
                    <i class="${isFavorite ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
            <div class="card-content">
                <div class="card-header">
                    <h3 class="card-title">${place.name}</h3>
                    <span class="card-region">${place.region}</span>
                </div>
                <div class="card-rating">
                    <div class="stars">${stars}</div>
                    <span class="rating-text">${place.rating.toFixed(1)}</span>
                </div>
                <p class="card-description">${place.description}</p>
                <div class="card-info">
                    <div class="card-info-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${place.address}</span>
                    </div>
                    <div class="card-info-item">
                        <i class="fas fa-clock"></i>
                        <span>${place.hours}</span>
                    </div>
                    <div class="card-info-item">
                        <i class="fas fa-won-sign"></i>
                        <span>${place.price}</span>
                    </div>
                </div>
                <div class="card-tags">
                    ${place.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;

        // 카드 클릭 이벤트
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.favorite-icon')) {
                this.showModal(place);
            }
        });

        // 즐겨찾기 버튼 이벤트
        const favoriteBtn = card.querySelector('.favorite-icon');
        favoriteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFavorite(place.id);
            this.updateFavoriteButton(favoriteBtn, this.favorites.includes(place.id));
        });

        return card;
    }

    // 별점 생성
    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let stars = '';

        // 채워진 별
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star star"></i>';
        }

        // 반별
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt star"></i>';
        }

        // 빈 별
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star star"></i>';
        }

        return stars;
    }

    // 카테고리별 아이콘 반환
    getCategoryIcon(category) {
        const icons = {
            '관광지': 'fas fa-camera',
            '맛집': 'fas fa-utensils',
            '쇼핑': 'fas fa-shopping-bag',
            '문화시설': 'fas fa-palette',
            '자연명소': 'fas fa-tree'
        };
        return icons[category] || 'fas fa-map-marker-alt';
    }

    // 모달 표시
    showModal(place) {
        const modal = document.getElementById('detailModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalImage = document.getElementById('modalImage');
        const modalCategory = document.getElementById('modalCategory');
        const modalRating = document.getElementById('modalRating');
        const modalStars = document.getElementById('modalStars');
        const modalDescription = document.getElementById('modalDescription');
        const modalAddress = document.getElementById('modalAddress');
        const modalPhone = document.getElementById('modalPhone');
        const modalHours = document.getElementById('modalHours');
        const modalPrice = document.getElementById('modalPrice');
        const modalWebsite = document.getElementById('modalWebsite');
        const modalTags = document.getElementById('modalTags');
        const phoneDetail = document.getElementById('phoneDetail');
        const websiteDetail = document.getElementById('websiteDetail');
        const favoriteBtn = document.getElementById('favoriteBtn');

        // 현재 장소 정보 저장
        modal.dataset.currentPlaceId = place.id;

        // 모달 내용 설정
        modalTitle.textContent = place.name;
        modalCategory.textContent = place.category;
        modalRating.textContent = place.rating.toFixed(1);
        modalStars.innerHTML = this.generateStars(place.rating);
        modalDescription.textContent = place.description;
        modalAddress.textContent = place.address;
        modalHours.textContent = place.hours;
        modalPrice.textContent = place.price;

        // 전화번호 표시/숨김
        if (place.phone && place.phone.trim()) {
            modalPhone.textContent = place.phone;
            phoneDetail.style.display = 'flex';
        } else {
            phoneDetail.style.display = 'none';
        }

        // 웹사이트 표시/숨김
        if (place.website && place.website.trim()) {
            modalWebsite.textContent = place.website;
            modalWebsite.href = place.website.startsWith('http') ? place.website : `https://${place.website}`;
            websiteDetail.style.display = 'flex';
        } else {
            websiteDetail.style.display = 'none';
        }

        // 태그 표시
        modalTags.innerHTML = place.tags.map(tag =>
            `<span class="tag">${tag}</span>`
        ).join('');

        // 즐겨찾기 버튼 상태
        const isFavorite = this.favorites.includes(place.id);
        this.updateFavoriteButton(favoriteBtn, isFavorite);

        // 이미지 설정
        const modalImageContainer = modalImage.parentElement;
        modalImageContainer.setAttribute('data-category', place.category);
        modalImageContainer.setAttribute('data-region', place.region);

        // placeholder 아이콘 추가
        const categoryIcon = this.getCategoryIcon(place.category);
        let placeholderIcon = modalImageContainer.querySelector('.placeholder-icon');
        if (!placeholderIcon) {
            placeholderIcon = document.createElement('i');
            placeholderIcon.className = `placeholder-icon ${categoryIcon}`;
            placeholderIcon.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                font-size: 4rem;
                color: rgba(255, 255, 255, 0.8);
                z-index: 1;
            `;
            modalImageContainer.appendChild(placeholderIcon);
        }

        modalImage.src = '';
        modalImage.alt = place.name;
        modalImage.style.display = 'none';

        // 모달 표시
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    // 모달 닫기
    closeModal() {
        const modal = document.getElementById('detailModal');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }

    // 즐겨찾기 토글
    toggleFavorite(placeId) {
        const index = this.favorites.indexOf(placeId);
        if (index > -1) {
            this.favorites.splice(index, 1);
        } else {
            this.favorites.push(placeId);
        }

        this.saveFavorites();
        this.updateFavoritesCount();

        // 현재 표시된 모든 카드의 즐겨찾기 버튼 업데이트
        document.querySelectorAll(`[data-place-id="${placeId}"]`).forEach(btn => {
            this.updateFavoriteButton(btn, this.favorites.includes(placeId));
        });
    }

    // 모달의 즐겨찾기 토글
    toggleFavoriteModal() {
        const modal = document.getElementById('detailModal');
        const placeId = parseInt(modal.dataset.currentPlaceId);
        this.toggleFavorite(placeId);
    }

    // 즐겨찾기 버튼 업데이트
    updateFavoriteButton(button, isFavorite) {
        const icon = button.querySelector('i');

        if (isFavorite) {
            button.classList.add('active');
            icon.className = 'fas fa-heart';
        } else {
            button.classList.remove('active');
            icon.className = 'far fa-heart';
        }
    }

    // 즐겨찾기 수 업데이트
    updateFavoritesCount() {
        const count = document.querySelector('.favorites-count');
        count.textContent = this.favorites.length;

        if (this.favorites.length === 0) {
            count.style.display = 'none';
        } else {
            count.style.display = 'flex';
        }
    }

    // 즐겨찾기 로드
    loadFavorites() {
        try {
            const saved = localStorage.getItem('travelGuideFavorites');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('즐겨찾기 로드 오류:', error);
            return [];
        }
    }

    // 즐겨찾기 저장
    saveFavorites() {
        try {
            localStorage.setItem('travelGuideFavorites', JSON.stringify(this.favorites));
        } catch (error) {
            console.error('즐겨찾기 저장 오류:', error);
        }
    }

    // 더 보기
    loadMore() {
        this.currentPage++;
        this.displayPlaces(false);
    }

    // 네비게이션 처리
    handleNavigation(section) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => link.classList.remove('active'));

        if (section === 'home') {
            document.querySelector('[data-section="home"]').classList.add('active');
            this.showAllPlaces();
        } else if (section === 'favorites') {
            document.querySelector('[data-section="favorites"]').classList.add('active');
            this.showFavorites();
        }
    }

    // 전체 장소 표시
    showAllPlaces() {
        // 필터 초기화
        this.currentFilters = {
            region: '전체',
            category: '전체',
            search: ''
        };

        // 탭 초기화
        document.querySelector('.tab-btn.active').classList.remove('active');
        document.querySelector('[data-region="전체"]').classList.add('active');
        document.querySelector('.filter-btn.active').classList.remove('active');
        document.querySelector('[data-category="전체"]').classList.add('active');

        // 검색 초기화
        document.getElementById('searchInput').value = '';
        document.getElementById('clearSearch').style.display = 'none';

        this.applyFilters();
    }

    // 즐겨찾기 표시
    showFavorites() {
        if (this.favorites.length === 0) {
            this.showNoFavorites();
            return;
        }

        const favoritePlaces = this.allPlaces.filter(place =>
            this.favorites.includes(place.id)
        );

        this.filteredPlaces = favoritePlaces;
        this.currentPage = 0;
        this.displayPlaces(true);

        document.getElementById('resultsTitle').textContent = '즐겨찾기';
        document.getElementById('resultsCount').textContent = favoritePlaces.length;
    }

    // 즐겨찾기 없음 표시
    showNoFavorites() {
        const cardGrid = document.getElementById('cardGrid');
        const noResults = document.getElementById('noResults');
        const loadMoreBtn = document.getElementById('loadMoreBtn');

        cardGrid.innerHTML = '';
        noResults.innerHTML = `
            <div class="no-results-content">
                <i class="far fa-heart"></i>
                <h3>즐겨찾기가 없습니다</h3>
                <p>마음에 드는 장소를 하트 버튼을 눌러 즐겨찾기에 추가해보세요.</p>
            </div>
        `;
        noResults.style.display = 'block';
        loadMoreBtn.style.display = 'none';

        document.getElementById('resultsTitle').textContent = '즐겨찾기';
        document.getElementById('resultsCount').textContent = '0';
    }

    // 지역별 필터링
    filterByRegion(region) {
        this.setActiveTab(document.querySelector(`[data-region="${region}"]`), '.tab-btn');
        this.currentFilters.region = region;
        this.applyFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 카테고리별 필터링
    filterByCategory(category) {
        this.setActiveTab(document.querySelector(`[data-category="${category}"]`), '.filter-btn');
        this.currentFilters.category = category;
        this.applyFilters();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 장소 공유
    sharePlace() {
        const modal = document.getElementById('detailModal');
        const placeId = modal.dataset.currentPlaceId;
        const place = this.allPlaces.find(p => p.id == placeId);

        if (!place) return;

        const shareData = {
            title: `${place.name} - 수도권 여행 가이드`,
            text: place.description,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData)
                .catch(err => console.log('공유 오류:', err));
        } else {
            // 클립보드에 복사
            const shareText = `${place.name}\n${place.description}\n${place.address}\n\n${window.location.href}`;
            navigator.clipboard.writeText(shareText).then(() => {
                this.showToast('링크가 클립보드에 복사되었습니다!');
            }).catch(() => {
                this.showToast('공유 기능을 사용할 수 없습니다.');
            });
        }
    }

    // 길찾기
    getDirections() {
        const modal = document.getElementById('detailModal');
        const placeId = modal.dataset.currentPlaceId;
        const place = this.allPlaces.find(p => p.id == placeId);

        if (!place) return;

        const query = encodeURIComponent(place.address);
        const url = `https://map.kakao.com/link/to/${encodeURIComponent(place.name)},${place.latitude},${place.longitude}`;

        window.open(url, '_blank', 'noopener,noreferrer');
    }

    // 맨 위로 스크롤
    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // 스크롤 처리
    handleScroll() {
        const scrollToTopBtn = document.getElementById('scrollToTop');

        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    }

    // 토스트 메시지 표시
    showToast(message) {
        // 토스트가 이미 있으면 제거
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--gray-800);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 10000;
            animation: fadeInUp 0.3s ease-out;
        `;
        toast.textContent = message;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease-out';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // 에러 표시
    showError(message) {
        const cardGrid = document.getElementById('cardGrid');
        const noResults = document.getElementById('noResults');

        cardGrid.innerHTML = '';
        noResults.innerHTML = `
            <div class="no-results-content">
                <i class="fas fa-exclamation-triangle" style="color: var(--error-color);"></i>
                <h3>오류가 발생했습니다</h3>
                <p>${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-refresh"></i>
                    새로고침
                </button>
            </div>
        `;
        noResults.style.display = 'block';
    }

    // 로딩 숨기기
    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.style.opacity = '0';
            setTimeout(() => {
                loading.style.display = 'none';
            }, 300);
        }
    }
}

// ==========================================
// 앱 초기화
// ==========================================

// DOM이 로드되면 앱 시작
document.addEventListener('DOMContentLoaded', () => {
    new TravelGuideApp();
});

// 브라우저 뒤로가기/앞으로가기 처리
window.addEventListener('popstate', (event) => {
    // 필요시 구현
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    // 필요시 구현
});

// 오프라인/온라인 상태 처리
window.addEventListener('online', () => {
    console.log('온라인 상태입니다.');
});

window.addEventListener('offline', () => {
    console.log('오프라인 상태입니다.');
});

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(-50%) translateY(0); }
        to { opacity: 0; transform: translateX(-50%) translateY(10px); }
    }
`;
document.head.appendChild(style);