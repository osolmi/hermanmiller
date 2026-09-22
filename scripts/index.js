/* =================  내비 데이터 ================= */
const navData = {
    living:   { sub:["View All","Living Room","Lounge Chairs & Ottomans","Sofas & Sectionals","Coffee & Side Tables","Benches & Stools","Side Chairs","Living Room Storage","Shelving & Storage"], caption:"Relax in the Eames Lounge Chair and Ottoman", img:"./images/nav/living.jpg" },
    dining:   { sub:["View All","Dining Tables","Dining Chairs & Stools","Buffets, Sideboards & Credenzas"], caption:"Set the table with Eames Dining Chairs", img:"./images/nav/dining.jpg" },
    lighting: { sub:["View All","Ceiling Lights & Pendants","Desk & Table Lamps","Floor Lamps","Wall Lights & Sconces"], caption:"Shop Nelson Bubble Lamps", img:"./images/nav/lighting.jpg" },
    eames:    { sub:["View All","Lounge Chairs & Ottomans","Dining Chairs","Molded Plywood Collection","Storage & Shelving"], caption:"65 Years of the Eames Lounge Chair", img:"./images/nav/eames.jpg"},
    office:   { sub:["View All","Office Chairs","Aeron Chair","Standing Desks","Home Office Storage","Gaming Chairs & Desks"], caption:"Try Our Office Chair Quiz", img:"./images/nav/office.jpg" },
    gaming:   { sub:["Gaming Chairs","Gaming Desks","Gaming Accessories","Gaming Sale: Up to 25% Off","Logitech G"], caption:"Find your ideal gaming chair with our quiz", img:"./images/nav/gaming.jpg" },
    decor:    { sub:["View All","Wall Decor & Art","Rugs","Decorative Objects","Pillows & Throws","Clocks"], caption:"Shop Eames Hang-It-All", img:"./images/nav/decor.jpg" },
    sale:     { sub:["Fall Sale: 25% Off","Markdowns: Up to 40% Off"], caption:"" }
};

/* ================= 엘리먼트 참조 ================= */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const navOverlay = document.getElementById('navOverlay');
const navCatList = document.getElementById('navCatList');
const navCatItems = navCatList.querySelectorAll('li');
const navCatDot = document.getElementById('navCatDot');
const navSubList = document.getElementById('navSubList');
const navFeatureCaption = document.getElementById('navFeatureCaption');
const navFeatureImg = document.querySelector('.nav-feature-img img');

/* ================= dot 이동 ================= */
function moveNavCatDot(li){
    if(!navCatDot || !li) return;
    navCatDot.style.top = (li.offsetTop + li.offsetHeight/2 - 3) + 'px';
    }


/* ================= 하위메뉴 렌더링 ================= */
function renderNavSub(key){
    const d = navData[key];
    if(!d) return;
    // 1. 서브메뉴 목록 출력
    navSubList.innerHTML = d.sub.map(s => `<li>${s}</li>`).join('');
    // 2. 우측 캡션 적용
    navFeatureCaption.textContent = d.caption || '';
    // 3. 이미지 유무 체크 및 처리
    if (navFeatureImg) {
        if (d.img && d.img.trim() !== '') {
            navFeatureImg.src = d.img;
            navFeatureImg.alt = d.caption || key;
            navFeatureImg.style.display = 'block'; // 이미지가 있으면 보이기
        } else {
            navFeatureImg.src = '';
            navFeatureImg.style.display = 'none';  // 이미지가 없으면 숨기기
        }
    }
}

navCatItems.forEach(li => {
    li.addEventListener('click', () => {
    navCatItems.forEach(x => x.classList.remove('active'));
    li.classList.add('active');
    moveNavCatDot(li);
    renderNavSub(li.dataset.cat);
    });
});

/* ================= 열기 / 닫기 (햄버거 하나로 토글) ================= */
function openNav(){
    hamburgerBtn.classList.add('open');
    navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    // 오버레이가 보이게 된 후 dot 위치 재계산 (숨김 상태에서는 offsetTop이 0으로 잡히므로)
    requestAnimationFrame(() => {
    const activeCatLi = navCatList.querySelector('li.active');
    if (activeCatLi) moveNavCatDot(activeCatLi);
    });
}
function closeNav(){
    hamburgerBtn.classList.remove('open');
    navOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

hamburgerBtn.addEventListener('click', () => {
    navOverlay.classList.contains('open') ? closeNav() : openNav();
});

/* ESC 키로도 닫히게 */
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && navOverlay.classList.contains('open')) closeNav();
});

/* ================= 초기 실행 ================= */
renderNavSub('living');

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 히어로 세로 슬라이더
    const SLIDE_DURATION = 6000;
    const slides = document.querySelectorAll('.hero-slide');
    const fills = document.querySelectorAll('.slidebar-seg .fill');
    let current = 0;
    let startTime = null;

    function setSlide(i){
        if(slides.length === 0) return;
        slides.forEach((s, idx) => s.classList.toggle('active', idx === i));
        fills.forEach((f, idx) => { f.style.height = idx < i ? '100%' : '0%'; });
        current = i;
        startTime = null;
        requestAnimationFrame(() => requestAnimationFrame(tick));
    }
    
    function tick(ts){
        if(startTime === null) startTime = ts;
        const elapsed = ts - startTime;
        const pct = Math.min(100, (elapsed / SLIDE_DURATION) * 100);
        if(fills[current]) fills[current].style.height = pct + '%';
        
        if(elapsed < SLIDE_DURATION){
            requestAnimationFrame(tick);
        } else {
            setSlide((current + 1) % slides.length);
        }
    }

    setSlide(0);

// ================= WISHLIST TOGGLE (하트 아이콘 껐다 켰다) =================
document.addEventListener('click', (e) => {
    // .heart 또는 .heart-btn 요소를 클릭했는지 확인
    const heartBtn = e.target.closest('.heart, .heart-btn');
    if (!heartBtn) return;

    e.preventDefault(); // 기본 동작 방지

    const img = heartBtn.querySelector('img');
    if (!img) return;

    // active 클래스 토글
    const isActive = heartBtn.classList.toggle('active');

    if (isActive) {
        // [ON] 채워진 빨간 하트 이미지
        img.src = './images/icons/wish-full.png';
        img.alt = 'wishlist active';
    } else {
        // [OFF] 빈 하트 이미지
        img.src = './images/icons/wish.png';
        img.alt = 'wishlist';
    }
});
/* ================= Bestsellers DATA ================= */
const bestsellerData = {
    office:  [
        {name:"Aeron Chair", price:"$1,555.00 - $2,745.00", img:"./images/bs/office_1.png"},
        {name:"Embody Chair", price:"$$2,090.00 - $2,565.00", img:"./images/bs/office_2.png"},
        {name:"Sayl Chair", price:"$$885.00 - $1,530.00", img:"./images/bs/office_3.png"},
        {name:"Cosm Chair", price:"$$1,585.00 - $2,060.00", img:"./images/bs/office_4.png"}
    ],
    lounge:  [
        {name:"Eames Lounge Chair and Ottoman", price:"$6,745.00 - $8,996.25"},
        {name:"Eames Molded Plywood Lounge Chair", price:"$1,421.25 - $1,795.00"},
        {name:"Eames Lounge Chair", price:"$995.00 - $1,325.00"},
        {name:"Eames Aluminum Group Lounge Chair", price:"$521.25 - $667.50"}
    ],
    coffee:  [
        {name:"Noguchi Table", originalPrice: "$2,895.00 - $3,195.00", price:"$2,171.25 - $2,396.25", discount: "25% off", img:"./images/bs/coffee_1.png"},
        {name:"Eames Wire Base Low Table", originalPrice: "$275.00 - $325.00", price:"$206.25 - $243.75", discount: "25% off", img:"./images/bs/coffee_2.png"},
        {name:"Eames Molded Plywood Coffee Table", originalPrice: "$1,430.00 - $1,530.00", price:"$1,072.50 - $1,147.50", discount: "25% off", img:"./images/bs/coffee_3.png"},
        {name:"Eames Elliptical Table", originalPrice: "$1,435.00 - $2,830.00", price:"$1,076.25 - $2,122.50", discount: "25% off", img:"./images/bs/coffee_4.png"}
    ],
    dining:  [
        {name:"Eames Molded Plywood Dining Chair", price:"$521.25 - $667.50"},
        {name:"Eames Table, Rectangular", price:"$1,895.00 - $2,995.00"},
        {name:"Eames Wire Chair", price:"$521.25 - $667.50"},
        {name:"Nelson Swag Leg Table", price:"$1,495.00 - $2,195.00"}
    ],
    desks:   [
        {name:"Eames Desk Unit", price:"$1,560.00 - $1,890.00"},
        {name:"Jarvis Bamboo Standing Desk", price:"$693.75 - $893.75"},
        {name:"Renew Sit-to-Stand Desk", price:"$895.00 - $1,195.00"},
        {name:"Nelson Basic Cabinet Desk", price:"$1,995.00 - $2,495.00"}
    ],
    gaming:  [
        {name:"Embody Gaming Chair", price:"$1,895.00 - $2,145.00"},
        {name:"Vantum Gaming Chair", price:"$895.00 - $1,095.00"},
        {name:"Vantum Gaming Desk", price:"$795.00 - $995.00"},
        {name:"OE1 Gaming Cart", price:"$495.00 - $695.00"}
    ],
    storage: [
        {name:"Nelson Storage Unit", price:"$1,560.00 - $1,890.00"},
        {name:"Eames Storage Unit", price:"$1,495.00 - $1,895.00"},
        {name:"Nelson Bookcase", price:"$895.00 - $1,295.00"},
        {name:"Basic Cabinet Series", price:"$1,195.00 - $1,795.00"}
    ],
    decor:   [
        {name:"Eames Hang-It-All", price:"$275.00 - $380.00"},
        {name:"Nelson Ball Bubble Pendant", price:"$465.00 - $813.75"},
        {name:"Girard Wooden Dolls", price:"$95.00 - $145.00"},
        {name:"Eames House Bird", price:"$135.00 - $165.00"}
    ]
};

    // 2. 베스트셀러 탭 및 카드 렌더링
    const tabList = document.getElementById('tabList');
    const tabDot = document.getElementById('tabDot');
    const bestsellerGrid = document.getElementById('bestsellerGrid');

    if (tabList && bestsellerGrid) {
        const tabItems = tabList.querySelectorAll('li');

function renderBestsellers(key){
    if (!bestsellerData[key]) return;
    bestsellerGrid.innerHTML = bestsellerData[key].map(p => `
        <div class="product-card">
            <div class="product-thumb">
                <img src="${p.img}" alt="${p.name}" class="product-img">
                <p class="heart"><img src="./images/icons/wish.png" alt="wish"></p>
            </div>
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-price-group">
                    ${p.originalPrice ? `<div class="product-price-bf">${p.originalPrice}</div>` : ''}
                    <div class="product-price">${p.price}</div>
                    ${p.discount ? `<span class="sale-badge">${p.discount}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}
        //
        function moveDot(li){
            if(!tabDot || !li) return;
            tabDot.style.top = (li.offsetTop + li.offsetHeight/2 - 3) + 'px';
        }

        tabItems.forEach(li => {
            li.addEventListener('click', () => {
                tabItems.forEach(x => x.classList.remove('active'));
                li.classList.add('active');
                moveDot(li);
                renderBestsellers(li.dataset.tab);
            });
        });

        // 초기 실행
        renderBestsellers('coffee');
        const activeLi = tabList.querySelector('li.active');
        if (activeLi) moveDot(activeLi);
    }
});

//======================= MD pick
const mdPickData = [
    {name:"Eames Turned Stool", originalPrice: "$1,095.00 - $1,420.00", price:"$621.25 - $1,065.00", discount: "25% off", img:"./images/md/1.png"},
    {name:"Nelson Ball Bubble Pendant", originalPrice: "$620.00 - $1,085.00", price:"$465.00 - $813.75", discount: "25% off", img:"./images/md/2.png"},
    {name:"Eames Molded Plywood Dining Chair Metal Base (DCM)", originalPrice: "$1,295.00 - $1,645.00", price:"$$971.25 - $1,233.75", discount: "25% off", img:"./images/md/3.png"},
    {name:"Eames Molded Fiberglass Armchair", originalPrice: "$695.00 - $890.00", price:"$521.25 - $667.50", discount: "25% off", img:"./images/md/4.png"},
    {name:"Nelson Marshmallow Sofa", originalPrice: "$6,635.00 - $7,370.00", price:"$4,976.25 - $5,527.50", discount: "25% off", img:"./images/md/5.png"},
    {name:"Eames Storage Unit", originalPrice: "$2,080.00 - $2,520.00", price:"$1,560.00 - $1,890.00", discount: "25% off", img:"./images/md/6.png"}
];

//======================== Collection
const roomProducts = [
    {num:"01", name:"Eames Lounge Chair and Ottoman", material:"Walnut veneer, leather", year:"1956", designer:"Charles & Ray Eames", price:"$6,745.00", img: "./images/collection/ottoman.png", x:12, y:45},
    {num:"02", name:"Noguchi Table", material:"Glass, walnut", year:"1948", designer:"Isamu Noguchi", price:"$2,171.25", img: "./images/collection/noguchi.png", x:46, y:60},
    {num:"03", name:"Nelson Pear Lotus Table Lamp", material:"Steel, styrene shade", year:"1947", designer:"George Nelson", price:"$465.00", img: "./images/collection/chair.png", x:25, y:27},
    {num:"04", name:"Nelson Face Print", material:"Paper, wood frame", year:"1979", designer:"Nelson", price:"$120.00", img: "./images/collection/chair.png", x:35, y:7},
    {num:"05", name:"Eames Molded Plywood Lounge Chair", material:"Walnut veneer, molded plywood", year:"1946", designer:"Charles & Ray Eames", price:"$1,895.00", img: "./images/collection/chair.png", x:60, y:38}
];
let currentCollectionIndex = 0; // 현재 선택된 상품 인덱스 저장
// ======================== New In 데이터 ========================
const newInData = [
    { name: "Pursuit Rug by Edith Van Berkel", price: "$2,145.00 - $9,295.00", img: "./images/new/1.png" },
    { name: "Luva Modular Sectional", originalPrice: "$9,034.00 - $11,410.00", price: "$8,775.50 - $8,657.50", discount: "25% off", img: "./images/new/2.png" },
    { name: "New Canaan Low Bookshelf", originalPrice: "$5,295.00 - $5,495.00", price: "$3,971.25 - $4,121.25", discount: "25% off", img: "./images/new/3.png" },
    { name: "Eames Wire Chair Low Wire Base", originalPrice: "$1,995.00", price: "$1,496.25", discount: "25% off", img: "./images/new/4.png" },
    { name: "Passport Table", originalPrice: "$11,700.00 - $11,540.00", price: "$1,295.00 - $1,795.00", discount: "25% off", img: "./images/new/2.png" },
    { name: "Zeph Chair", originalPrice: "$11,700.00 - $11,540.00", price: "$795.00 - $1,095.00", discount: "25% off", img: "./images/new/3.png" },
    { name: "Zeph Chair", originalPrice: "$11,700.00 - $11,540.00", price: "$795.00 - $1,095.00", discount: "25% off", img: "./images/new/3.png" },
    { name: "Zeph Chair", originalPrice: "$11,700.00 - $11,540.00", price: "$795.00 - $1,095.00", discount: "25% off", img: "./images/new/3.png" }
];

function createProductCardHTML(item) {
    const hasDiscount = Boolean(item.originalPrice);
    return `
        <div class="product-card">
            <div class="product-thumb">
                <img src="${item.img}" alt="${item.name}">
                <button class="heart" aria-label="Wishlist">
                    <img src="./images/wish.png" alt="heart">
                </button>
            </div>
            <div class="product-info">
                <p class="product-name">${item.name}</p>
                <div class="product-price-group">
                    ${hasDiscount ? `<span class="product-price-bf">${item.originalPrice}</span>` : ''}
                    <div>
                        <span class="product-price">${item.price}</span>
                        ${item.discount ? `<span class="sale-badge">${item.discount}</span>` : ''}
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 1. MD Pick 렌더링
// MD's Pick 우측 동적 렌더링
function renderMdPick() {
    const mdPickList = document.getElementById('mdPickList');
    if (!mdPickList) return;

    mdPickList.innerHTML = mdPickData.map(p => `
        <div class="product-card">
            <div class="product-thumb">
                <img src="${p.img}" alt="${p.name}" class="product-img">
                <p class="heart"><img src="./images/icons/wish.png" alt="wish"></p>
            </div>
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-price-group">
                    ${p.originalPrice ? `<div class="product-price-bf">${p.originalPrice}</div>` : ''}
                    <div class="product-price">${p.price}</div>
                    ${p.discount ? `<span class="sale-badge">${p.discount}</span>` : ''}
                </div>
            </div>
        </div>
    `).join('');
}

// ======================== NEW IN SLIDER LOGIC ========================

// 1. 단일화된 상품 카드 HTML 생성 함수 (.product-thumb 및 데이터 연동 discount 적용)
// New In 영역에서 사용하는 상품 카드 생성 함수
function createProductCardHTML(item) {
    return `
        <div class="product-card">
            <div class="product-thumb">
                <img src="${item.img}" alt="${item.name}" class="product-img">
                <button class="heart" aria-label="Wishlist">
                    <img src="./images/icons/wish.png" alt="wish">
                </button>
            </div>
            <div class="product-info">
                <div class="product-name">${item.name}</div>
                <div class="product-price-group">
                    ${item.originalPrice ? `<div class="product-price-bf">${item.originalPrice}</div>` : ''}
                    <div class="product-price">${item.price}</div>
                    ${item.discount ? `<span class="sale-badge">${item.discount}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

// 2. New In 렌더링
function renderNewIn() {
    const container = document.getElementById('newInRow');
    if (!container) return;
    container.innerHTML = newInData.map(createProductCardHTML).join('');
}

// 3. 슬라이더 및 트랙바 이벤트 설정
function initNewInSlider() {
    const newInRow = document.getElementById('newInRow');
    const newInPrev = document.getElementById('newInPrev');
    const newInNext = document.getElementById('newInNext');
    const newInBar = document.getElementById('newInBar');

    if (!newInRow || !newInPrev || !newInNext || !newInBar) return;

    let currentStep = 0; // 0: 1단계 (앞 4개), 1: 2단계 (뒤 4개)

function updateSliderPosition() {
    // newInRow.clientWidth 만큼 이동하면 정확히 4개 단위로 넘어갑니다.
    const scrollAmount = newInRow.clientWidth + parseFloat(getComputedStyle(newInRow).gap || 0);

    if (currentStep === 0) {
        newInRow.scrollTo({ left: 0, behavior: 'smooth' });
        newInBar.style.width = '50%';
    } else {
        newInRow.scrollTo({ left: newInRow.scrollWidth - newInRow.clientWidth, behavior: 'smooth' });
        newInBar.style.width = '100%';
    }
}

    newInNext.addEventListener('click', () => {
        currentStep = 1;
        updateSliderPosition();
    });

    newInPrev.addEventListener('click', () => {
        currentStep = 0;
        updateSliderPosition();
    });
}

// DOM 로드 완료 시 렌더링 및 이벤트 초기화
document.addEventListener('DOMContentLoaded', () => {
    renderNewIn();
    initNewInSlider();
});

// 3. Collection (Room Products) 핫스팟 & 카드 렌더링
function renderCollection() {
    const hotspotArea = document.getElementById('hotspotArea') || document.querySelector('.main-image-wrap');
    if (!hotspotArea) return;

    // 핫스팟 동적 생성
    hotspotArea.innerHTML = roomProducts.map((p, i) => `
        <button type="button" 
                class="hotspot ${i === 0 ? 'active' : ''}" 
                data-index="${i}"
                style="left:${p.x}%; top:${p.y}%;">
            ${i + 1}
        </button>
    `).join('');

    // 첫 번째 상품으로 정보 카드 초기화
    updateCollectionCard(0);

    // 핫스팟 클릭 이벤트
    hotspotArea.addEventListener('click', (e) => {
        const btn = e.target.closest('.hotspot');
        if (!btn) return;
        
        const idx = parseInt(btn.dataset.index, 10);
        updateCollectionCard(idx);
    });

    // 카드 좌우 화살표 버튼 이벤트 연동
    const prevBtn = document.querySelector('.collection-card .prev-btn');
    const nextBtn = document.querySelector('.collection-card .next-btn');

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const prevIdx = (currentCollectionIndex - 1 + roomProducts.length) % roomProducts.length;
            updateCollectionCard(prevIdx);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const nextIdx = (currentCollectionIndex + 1) % roomProducts.length;
            updateCollectionCard(nextIdx);
        });
    }
}

// Collection 우측 카드 정보 갱신
function updateCollectionCard(index) {
    const item = roomProducts[index];
    if (!item) return;

    currentCollectionIndex = index; // 현재 인덱스 업데이트

    // 핫스팟 active 클래스 교체
    document.querySelectorAll('.hotspot').forEach((h, i) => {
        h.classList.toggle('active', i === index);
    });

    // 텍스트 정보 업데이트
    document.getElementById('card-num').textContent = item.num;
    document.getElementById('card-name').textContent = item.name;
    document.getElementById('card-material').textContent = item.material;
    document.getElementById('card-year').textContent = item.year;
    document.getElementById('card-designer').textContent = item.designer;
    
    // 가격 태그 (내부 span 보존)
    const priceEl = document.getElementById('card-price');
    if (priceEl) {
        priceEl.innerHTML = `<span class="sale-price">${item.price}</span>`;
    }

    // 이미지 태그 업데이트 (HTML의 .card-image img 선택)
    const cardImg = document.querySelector('.card-image img');
    if (cardImg && item.img) {
        cardImg.src = item.img;
        cardImg.alt = item.name;
    }
}

// DOM 로드 완료 시 실행
document.addEventListener('DOMContentLoaded', () => {
    if (typeof renderMdPick === 'function') renderMdPick();
    if (typeof renderNewIn === 'function') renderNewIn();
    renderCollection();
});