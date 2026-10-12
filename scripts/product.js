/* ===== product.js — 제품 상세 인터랙션 ===== */
document.addEventListener('DOMContentLoaded', () => {

/* 1. 수량 스테퍼 (1 ~ 99) */
const qty = document.querySelector('.pdp-qty');
if (qty) {
const out = qty.querySelector('output');
const [minus, plus] = qty.querySelectorAll('button');
const setQty = n => { out.textContent = Math.min(99, Math.max(1, n)); };
minus.addEventListener('click', () => setQty(Number(out.textContent) - 1));
plus.addEventListener('click',  () => setQty(Number(out.textContent) + 1));
}

/* 2. 히어로 스트립: 관성 드래그 + 진행 바 */
const strip = document.querySelector('.pdp-strip');
const bar = document.querySelector('.pdp-bar');
const thumb = bar && bar.querySelector('i');

if (strip) {
const maxScroll = () => strip.scrollWidth - strip.clientWidth;
let dragging = false, lastX = 0, lastT = 0, vel = 0, pos = 0, raf = 0;

/* 진행 바: 썸 너비 = 보이는 비율, 위치 = 스크롤 비율 */
const updateBar = () => {
    if (!thumb) return;
    const ratio = strip.clientWidth / strip.scrollWidth;
    const p = maxScroll() > 0 ? strip.scrollLeft / maxScroll() : 0;
    thumb.style.width = `${ratio * 100}%`;
    thumb.style.transform = `translateX(${p * (1 / ratio - 1) * 100}%)`;
};
strip.addEventListener('scroll', updateBar, { passive: true });
window.addEventListener('resize', updateBar);
window.addEventListener('load', updateBar);
updateBar();

/* 관성: 매 프레임 속도에 마찰(0.94)을 곱해 서서히 멈춤 */
const glide = () => {
    pos = Math.max(0, Math.min(maxScroll(), pos + vel));
    strip.scrollLeft = pos;
    vel *= 0.94;                       // 1에 가까울수록 오래 미끄러짐
    raf = (Math.abs(vel) > 0.15 && pos > 0 && pos < maxScroll())
    ? requestAnimationFrame(glide) : 0;
};

strip.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse') return;
    cancelAnimationFrame(raf);
    dragging = true; vel = 0;
    lastX = e.clientX; lastT = performance.now();
    strip.classList.add('is-drag');
    strip.setPointerCapture(e.pointerId);
});

strip.addEventListener('pointermove', e => {
    if (!dragging) return;
    const now = performance.now();
    const dx = lastX - e.clientX;
    strip.scrollLeft += dx;
    // 프레임 기준 속도(px/frame)로 정규화 + 평활화
    vel = vel * 0.6 + (dx / Math.max(1, now - lastT) * 16.7) * 0.4;
    lastX = e.clientX; lastT = now;
});

const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    strip.classList.remove('is-drag');
    if (performance.now() - lastT > 80) vel = 0;   // 멈췄다가 놓으면 미끄러지지 않음
    pos = strip.scrollLeft;
    raf = requestAnimationFrame(glide);
};
strip.addEventListener('pointerup', endDrag);
strip.addEventListener('pointercancel', endDrag);
strip.addEventListener('dragstart', e => e.preventDefault());

/* 진행 바 직접 드래그/클릭 */
if (bar && thumb) {
    let seeking = false;
    const seek = e => {
    if (maxScroll() <= 0) return;
    const r = bar.getBoundingClientRect();
    const tw = thumb.offsetWidth;
    const p = (e.clientX - r.left - tw / 2) / (r.width - tw);
    strip.scrollLeft = Math.min(1, Math.max(0, p)) * maxScroll();
    };
    bar.addEventListener('pointerdown', e => {
    cancelAnimationFrame(raf);
    seeking = true; bar.setPointerCapture(e.pointerId); seek(e);
    });
    bar.addEventListener('pointermove', e => { if (seeking) seek(e); });
    ['pointerup', 'pointercancel'].forEach(t =>
    bar.addEventListener(t, () => { seeking = false; }));
}
}

/* 3. 리뷰 전환 (데이터 배열 → 카드 내용 교체)
// const reviews = [
// { title: 'Surprisingly comfortable',
//     text: "This chair has to be the most comfortable ever. Such a simple design of molded plywood and yet you feel supported and relaxed. It is always such a privilege to have an Eames' design in the home.",
//     img: 'images/product/review_01.jpg' },
// { title: 'TODO 리뷰 제목 2', text: 'TODO 리뷰 본문 2', img: 'images/product/review_02.jpg' },
// { title: 'TODO 리뷰 제목 3', text: 'TODO 리뷰 본문 3', img: 'images/product/review_03.jpg' }
// ];

// const card = document.querySelector('.pdp-review');
// const revNext = document.querySelector('.pdp-rev-next');
// if (card && revNext && reviews.length > 1) {
// let idx = 0;
// revNext.addEventListener('click', () => {
//     idx = (idx + 1) % reviews.length;
//     const r = reviews[idx];
//     card.classList.add('is-swap');           // 페이드 아웃
//     setTimeout(() => {
//     card.querySelector('h3').textContent = r.title;
//     card.querySelector('.pdp-review-text p').textContent = r.text;
//     card.querySelector(':scope > img').src = r.img;
//     card.classList.remove('is-swap');      // 페이드 인
//     }, 200);
// });
// }

/* 4. You May Also Like: 카드 1장씩 이동 + 양끝 비활성 */
const list = document.querySelector('.pdp-rel-list');
const prev = document.querySelector('.pdp-arrow.prev');
const next = document.querySelector('.pdp-arrow.next');
if (list && prev && next) {
const step = () => {
    const cardEl = list.querySelector('.product-card');
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    return cardEl.offsetWidth + gap;
};
const update = () => {
    prev.disabled = list.scrollLeft <= 1;
    next.disabled = list.scrollLeft + list.clientWidth >= list.scrollWidth - 1;
};
prev.addEventListener('click', () => list.scrollBy({ left: -step(), behavior: 'smooth' }));
next.addEventListener('click', () => list.scrollBy({ left:  step(), behavior: 'smooth' }));
list.addEventListener('scroll', update, { passive: true });
window.addEventListener('resize', update);
update();
}

});