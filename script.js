// Ссылка на твою таблицу
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTFT7EtIWvXIkbVnefj58KhAhTumPu3DvjWc3EuNcc8iLfDTvo3nYK9WLu6LH1evgxwyOVJPuy9a_aA/pub?output=csv';

let products = [];

// Функция для загрузки данных из Google Таблицы
async function fetchProducts() {
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.text();
        
        // Разбиваем CSV на строки и преобразуем в массив объектов
        const rows = data.split('\n').map(row => row.split(','));
        const headers = rows[0]; // Первая строка - это заголовки
        
        products = rows.slice(1).map(cols => {
            if (cols.length < 2) return null; // Пропускаем пустые строки
            return {
                id: parseInt(cols[0]),
                name: cols[1]?.trim(),
                category: cols[2]?.trim(), // Тут будет 'ətir', 'qram' или 'mystery'
                price: parseFloat(cols[3]),
                oldPrice: parseFloat(cols[4]),
                gender: cols[5]?.trim(),
                img: cols[6]?.trim(),
                mystery: cols[7]?.trim().toUpperCase() === 'TRUE'
            };
        }).filter(item => item !== null && item.name);

        console.log("Товары загружены:", products);
        
        // После загрузки запускаем отображение сайта
        initApp();

    } catch (error) {
        console.error("Ошибка загрузки данных из таблицы:", error);
    }
}

// Функция запуска функций сайта после загрузки данных
function initApp() {
    renderProducts();
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Запускаем загрузку
fetchProducts();

// --- ДАЛЕЕ ОСТАВЬ ВЕСЬ ОСТАЛЬНОЙ СВОЙ КОД БЕЗ ИЗМЕНЕНИЙ ---
// (Функции renderProducts, addToCart, filterProducts и т.д.)

const faqs = [
    { q: "Mystery Box (Sirli Qutu) nədir??", a:"Bu sürpriz bir qutudur. Siz 40 AZN ödəyirsiniz, lakin qutunun içindən hər şey çıxa bilər, minimum 10 AZN, maksimum 70 AZN və daha çox olan ətir və ya bədən spreyi çıxır. Bu, şansını yoxlamağı sevənlər üçün əla seçimdir!" },
    { q: "Çatdırılma necə həyata keçirilir?", a: "Bakı daxili kuryer, bölgələrə poçt vasitəsilə 3-5 iş günü ərzində." },
    { q: "Geri qaytarılma mümkündür?", a: "Qablaşdırması açılmayan məhsullar 3 gün ərzində dəyişdirilə bilər." },
    { q: "Ödəniş üsulları hansılardır?", a: "Nəqd və ya onlayn kart (M10, E-manat) vasitəsilə." }
];


const notifs = [
    { title: "TikTok-da Bizimləsiniz?", text: "Səhifəmizi izləyirsiniz? Ən son endirimləri qaçırmayın!", btn: "TikTok-a get", link: "https://tiktok.com/@aytacparfumm" },
    { title: "ŞOK Endirimlər!", text: "Bütün məhsullarda bu günə özəl 30%-dək endirim var!", btn: "Məhsullara bax", link: "#products" },
    { title: "Instagram-da bizə yazın", text: "1 mesaj kifayyətdir! ", btn: "Instagram", link: "https://instagram.com/aytac.parfummm" }
];

let cart = JSON.parse(localStorage.getItem('aytac_cart')) || [];

window.onload = () => {
    lucide.createIcons();
    renderProducts(products);
    renderFAQ();
    updateCartUI();
    startNotificationTimer();
    initScrollProgress();
    startStatsCounter();
    initWhatsAppBubbles();
};

function toggleDarkMode() { document.body.classList.toggle('dark-mode'); }

// 1. Progress Bar
function initScrollProgress() {
    window.onscroll = () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.getElementById("scroll-progress-bar").style.width = scrolled + "%";
    };
}

// 2. WhatsApp Bubbles logic
function initWhatsAppBubbles() {
    const bubble = document.getElementById('wa-bubble');
    setTimeout(() => {
        bubble.innerText = "Sualınız var?";
        bubble.style.opacity = "1";
        bubble.style.transform = "translateY(0)";
    }, 5000);

    setTimeout(() => {
        bubble.innerText = "Kömək lazımdır?";
    }, 20000);
}

// 3. Stats Counter
function startStatsCounter() {
    const updateStats = () => {
        const day = 10000 + Math.floor(Math.random() * 500);
        const week = 75000 + Math.floor(Math.random() * 2000);
        const month = 320000 + Math.floor(Math.random() * 10000);
        
        document.getElementById('stats-day').innerText = day.toLocaleString() + "+";
        document.getElementById('stats-week').innerText = week.toLocaleString() + "+";
        document.getElementById('stats-month').innerText = month.toLocaleString() + "+";
    };
    updateStats();
    setInterval(updateStats, 10000);
}

function renderProducts(data) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = data.map(p => {
        const initialSeconds = ((p.id * 7919) % 28800) + 7200; 
        const viewers = 10 + Math.floor(Math.random() * 25);
        
        return `
        <div class="product-card p-4 rounded-3xl relative overflow-hidden group">
            ${p.trend ? `<div class="trend-badge">${p.trend}</div>` : ''}
            <div class="absolute top-4 left-4 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">-${Math.round(((p.oldPrice-p.price)/p.oldPrice)*100)}%</div>
            <div class="relative overflow-hidden rounded-2xl mb-4">
                <img src="${p.img}" class="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110 ${p.mystery ? 'grayscale contrast-125' : ''}">
                ${p.mystery ? '<div class="absolute inset-0 flex items-center justify-center text-6xl font-black text-white drop-shadow-lg">?</div>' : ''}
            </div>
            <h4 class="font-bold text-lg">${p.name}</h4>
            <div class="flex gap-3 items-center my-2">
                <span class="text-2xl font-black">${p.price} AZN</span>
                <span class="text-sm opacity-50 line-through">${p.oldPrice} AZN</span>
            </div>
            <div class="viewers-count text-[10px] opacity-60 mb-2">
                <i data-lucide="eye" class="inline w-3 h-3 mr-1"></i> İndi <span class="view-num font-bold">${viewers}</span> nəfər bu məhsula baxır
            </div>
            <div class="countdown-timer">
                <div class="timer-display" data-base-seconds="${initialSeconds}">00:00:00</div>
            </div>
            <button onclick="addToCart(${p.id})" class="w-full py-4 border-2 border-[var(--text-color)] rounded-2xl hover:bg-[var(--text-color)] hover:text-[var(--bg-color)] transition-all font-bold">Səbətə at</button>
        </div>
    `;}).join('');
    
    lucide.createIcons();
    initIntersectionObserver();
    startAllTimers(); 
    updateViewers();
}

function updateViewers() {
    setInterval(() => {
        document.querySelectorAll('.view-num').forEach(el => {
            const current = parseInt(el.innerText);
            const change = Math.random() > 0.5 ? 1 : -1;
            el.innerText = Math.max(5, current + change);
        });
    }, 5000);
}

function filterProducts() {
    const search = document.getElementById('productSearch').value.toLowerCase();
    const cat = document.getElementById('categoryFilter').value;
    const gen = document.getElementById('genderFilter').value;
    const sort = document.getElementById('sortFilter').value;
    const grid = document.getElementById('product-grid');

    if (cat === 'sprey') {
        grid.innerHTML = `
            <div class="col-span-full py-16 px-6 border-4 border-dashed border-[var(--text-color)] border-opacity-20 rounded-[3rem] text-center space-y-6 bg-[var(--card-bg)] shadow-inner">
                <div class="inline-block p-6 bg-[var(--text-color)] bg-opacity-10 rounded-full mb-4">
                    <i data-lucide="flask-conical" class="w-16 h-16 text-[var(--text-color)]"></i>
                </div>
                <h3 class="text-4xl font-extrabold tracking-tight">Özəl Bədən Spreyləri</h3>
                <p class="text-xl opacity-80 max-w-2xl mx-auto leading-relaxed">
                    İstənilən ətir qoxusunda bədən spreylərini sizin üçün özəl hazırlayırıq. 
                </p>
                <div class="text-3xl font-black text-red-600">50 ml -20 azn</div>
                <div class="text-3xl font-black text-red-600">100 ml -30 azn</div>
                <div class="pt-4">
                    <a href="#contact" class="inline-flex items-center gap-3 px-10 py-5 bg-[var(--text-color)] text-[var(--bg-color)] font-bold rounded-2xl hover:scale-105 transition-transform shadow-lg">
                        <i data-lucide="message-square" class="w-6 h-6"></i> Sifariş üçün yazın
                    </a>
                </div>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    let filtered = products.filter(p => 
        p.name.toLowerCase().includes(search) &&
        (cat === 'all' || p.category === cat) &&
        (gen === 'all' || p.gender === gen)
    );

    if (sort === 'cheap') filtered.sort((a,b) => a.price - b.price);
    if (sort === 'expensive') filtered.sort((a,b) => b.price - a.price);
    
    if (filtered.length === 0) {
        grid.innerHTML = `<p class="col-span-full text-center py-10 opacity-50 text-xl">Məhsul tapılmadı...</p>`;
    } else {
        renderProducts(filtered);
    }
}

function renderFAQ() {
    const container = document.getElementById('faq-container');
    container.innerHTML = faqs.map((f, i) => `
        <div class="faq-item">
            <button onclick="toggleFAQ(${i})">${f.q} <i data-lucide="chevron-down"></i></button>
            <div class="faq-content"><div class="faq-answer-box">${f.a}</div></div>
        </div>
    `).join('');
    lucide.createIcons();
}

function toggleFAQ(i) {
    document.querySelectorAll('.faq-item')[i].classList.toggle('active');
}

function addToCart(id) {
    const p = products.find(x => x.id === id);
    const item = cart.find(x => x.id === id);
    if(item) item.qty++; else cart.push({...p, qty: 1});
    saveCart(); updateCartUI(); toggleCart(true);
}

function saveCart() { localStorage.setItem('aytac_cart', JSON.stringify(cart)); }

function updateCartUI() {
    const list = document.getElementById('cart-items');
    document.getElementById('cart-count').innerText = cart.reduce((a,b) => a + b.qty, 0);
    list.innerHTML = cart.map(i => `
        <div class="flex items-center gap-4 bg-[var(--bg-color)] p-4 rounded-2xl border border-opacity-10 border-[var(--text-color)]">
            <img src="${i.img}" class="w-16 h-16 rounded-xl object-cover">
            <div class="flex-grow">
                <h5 class="font-bold text-sm">${i.name}</h5>
                <p class="text-xs font-black">${i.price} AZN</p>
                <div class="flex items-center gap-2 mt-1">
                    <button onclick="changeQty(${i.id}, -1)" class="w-6 h-6 border rounded">-</button>
                    <span class="text-xs font-bold">${i.qty}</span>
                    <button onclick="changeQty(${i.id}, 1)" class="w-6 h-6 border rounded">+</button>
                </div>
            </div>
        </div>
    `).join('');
    const sum = cart.reduce((a,b) => a + (b.price * b.qty), 0);
    document.getElementById('cart-total').innerText = sum.toFixed(2) + " AZN";
}

function changeQty(id, d) {
    const i = cart.find(x => x.id === id);
    if (!i) return;
    i.qty += d;
    if(i.qty <= 0) cart = cart.filter(x => x.id !== id);
    saveCart(); updateCartUI();
}

function toggleCart(f) {
    const s = document.getElementById('cart-sidebar');
    if(f === true) s.classList.remove('translate-x-full');
    else s.classList.toggle('translate-x-full');
}

// 4. Share Cart logic
function shareCart() {
    if (cart.length === 0) return alert("Səbət boşdur!");
    const itemsText = cart.map(i => `• ${i.name}`).join('\n');
    const msg = `Bax, mən AYTAC PARFUM-da bunları bəyəndim, mənə hədiyyə ala bilərsən:\n\n${itemsText}\n\nSayta keçid: https://aytacparfum.com`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`);
}

function checkoutWhatsApp() {
    if (cart.length === 0) {
        return alert("Səbətiniz boşdur!");
    }

    // Считаем общую сумму
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    
    // Формируем красивый текст
    let msg = "🛍️ *YENİ SİFARİŞ (AYTAC PARFUM)*\n";
    msg += "--------------------------\n\n";

    cart.forEach((item, index) => {
        msg += `*${index + 1}. ${item.name}*\n`;
        msg += `   Qiymət: ${item.price} AZN | Say: ${item.qty} ədəd\n\n`;
    });

    msg += "--------------------------\n";
    msg += `💰 *YEKUN MƏBLƏĞ: ${total} AZN*\n\n`;
    msg += "📍 *Zəhmət olmasa, çatdırılma ünvanınızı qeyd edin:*";

    window.open(`https://wa.me/994515975206?text=${encodeURIComponent(msg)}`);
}

function startNotificationTimer() {
    setTimeout(() => {
        showNotification(notifs[Math.floor(Math.random() * notifs.length)]);
    }, 30000);
}

function showNotification(data) {
    const el = document.getElementById('notification');
    document.getElementById('notif-title').innerText = data.title;
    document.getElementById('notif-text').innerText = data.text;
    const btn = document.getElementById('notif-btn');
    btn.innerText = data.btn;
    btn.onclick = () => {
        if(data.link.startsWith('#')) document.querySelector(data.link).scrollIntoView({behavior:'smooth'});
        else window.open(data.link, '_blank');
        closeNotification();
    };
    el.classList.add('show');lucide.createIcons(); 
}

function closeNotification() { document.getElementById('notification').classList.remove('show'); }

function initIntersectionObserver() {
    const obs = new IntersectionObserver((es) => {
        es.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.product-card').forEach(c => obs.observe(c));
}

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    const icon = document.getElementById('menu-icon');
    if (menu.classList.contains('hidden')) {
        menu.classList.remove('hidden');
        menu.classList.add('flex');
        icon.setAttribute('data-lucide', 'x');
    } else {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
        icon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons();
}

function startAllTimers() {
    const timers = document.querySelectorAll('.timer-display');
    const startTime = Date.now();
    const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        timers.forEach(timer => {
            const baseSeconds = parseInt(timer.getAttribute('data-base-seconds'));
            let timeLeft = baseSeconds - elapsed;
            if (timeLeft <= 0) timeLeft = 0;
            const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
            const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
            const s = (timeLeft % 60).toString().padStart(2, '0');
            timer.innerHTML = `<span style="color:#ff0000 !important;">${h}:${m}:${s}</span>`;
        });
        if (timers.length === 0) clearInterval(interval);
    }, 1000);
}

function sendFakeReview(event) {
    event.preventDefault();
    event.target.reset();
    alert("Təşəkkür edirik! Rəyiniz qəbul olundu və yoxlanıldıqdan sonra saytda görünəcək.");
}

const prizes = [
    { label: "10% ENDİRİM", color: "#013366" },
    { label: "20% ENDİRİM", color: "#022a54" },
    { label: "30%-DƏK ENDİRİM", color: "#e11d48" },
    { label: "PULSUZ ÇATDIRILMA", color: "#013366" }
];

let startAngle = 0;
const arc = Math.PI / (prizes.length / 2);

function drawWheel() {
    const canvas = document.getElementById("wheelCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cw = canvas.width;
    const rad = cw / 2;
    ctx.clearRect(0, 0, cw, cw);
    prizes.forEach((prize, i) => {
        const angle = startAngle + i * arc;
        ctx.fillStyle = prize.color;
        ctx.beginPath(); ctx.moveTo(rad, rad);
        ctx.arc(rad, rad, rad, angle, angle + arc, false);
        ctx.lineTo(rad, rad); ctx.fill();
        ctx.strokeStyle = "white"; ctx.lineWidth = 4; ctx.stroke();
        ctx.save();
        ctx.translate(rad + Math.cos(angle + arc / 2) * rad * 0.6, rad + Math.sin(angle + arc / 2) * rad * 0.6);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        ctx.fillStyle = "white"; ctx.font = "bold 24px Poppins"; ctx.textAlign = "center";
        ctx.fillText(prize.label, 0, 0); ctx.restore();
    });
}

function spinWheel() {
    const btn = document.getElementById("spin-btn");
    const canvas = document.getElementById("wheelCanvas");
    btn.disabled = true; btn.style.opacity = "0.5";
    const prizeIndex = Math.random() < 0.9 ? 2 : Math.floor(Math.random() * 2); 
    const extraRounds = 10;
    const sectorAngle = (360 / prizes.length);
    const stopAngle = (extraRounds * 360) + (360 - (prizeIndex * sectorAngle)) - (sectorAngle / 2) - 90;
    canvas.style.transition = "transform 8s cubic-bezier(0.1, 0, 0, 1)";
    canvas.style.transform = `rotate(${stopAngle}deg)`;
    setTimeout(() => {
        document.getElementById("prize-text").innerText = prizes[prizeIndex].label;
        document.getElementById("prize-result").classList.remove("hidden");
        btn.classList.add("hidden");
    }, 8000);
}

function closeWheel() {
    document.getElementById("wheel-overlay").classList.add("hidden");
    document.body.style.overflow = "auto";
}

window.addEventListener('load', () => {
    drawWheel();
    setTimeout(() => {
        const overlay = document.getElementById("wheel-overlay");
        overlay.classList.remove("hidden");
        document.body.style.overflow = "hidden";
    }, 1000);
});

function startLiveSales() {
    setInterval(() => {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const liveSaleEl = document.getElementById('live-sale');
        document.getElementById('live-sale-img').innerHTML = `<img src="${randomProduct.img}" class="w-full h-full object-cover">`;
        document.getElementById('live-sale-text').innerText = `${randomProduct.name} artıq satıldı`;
        liveSaleEl.classList.remove('translate-y-[200%]');
        setTimeout(() => liveSaleEl.classList.add('translate-y-[200%]'), 6000);
    }, 80000);
}

function showCenterPopup(type) {
    const popup = document.getElementById('center-popup');
    const content = document.getElementById('popup-content');
    const icon = document.getElementById('popup-icon');
    if (type === 'stock') {
        if (cart.length === 0) return;
        const randomItem = cart[Math.floor(Math.random() * cart.length)];
        icon.innerHTML = `<i data-lucide="alert-triangle" class="w-12 h-12"></i>`;
        content.innerHTML = `<h3 class="text-xl font-black italic">TƏLƏSİN!</h3><p class="text-lg">Səbətinizdəki <b>${randomItem.name}</b> bitmək üzrədir! Cəmi 5 ədəd qaldı.</p><button onclick="toggleCart(true); closeCenterPopup();" class="w-full py-3 bg-[var(--text-color)] text-[var(--bg-color)] rounded-xl font-bold uppercase">Sifarişi tamamla</button>`;
    } else if (type === 'delivery') {
        const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        if (total >= 200 || total === 0) return;
        const diff = 200 - total;
        icon.innerHTML = `<i data-lucide="truck" class="w-12 h-12 text-blue-600"></i>`;
        content.innerHTML = `<h3 class="text-xl font-black italic">PULSUZ ÇATDIRILMA</h3><p class="text-lg italic">Səbətinizə daha <b>${diff.toFixed(2)} AZN</b>-lik məhsul əlavə edin və çatdırılma <b>PULSUZ</b> olsun!</p><button onclick="closeCenterPopup()" class="w-full py-3 bg-[var(--text-color)] text-[var(--bg-color)] rounded-xl font-bold uppercase">Alış-verişə davam</button>`;
    }
    popup.classList.remove('hidden');
    lucide.createIcons();
}

function closeCenterPopup() { document.getElementById('center-popup').classList.add('hidden'); }

window.addEventListener('load', () => {
    startLiveSales();
    setInterval(() => showCenterPopup('delivery'), 240000);
    setInterval(() => showCenterPopup('stock'), 150000);
});


