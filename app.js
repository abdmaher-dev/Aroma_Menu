// ============================================================
//  app.js — Aroma Cafe | يقرأ menu.json ويبني الصفحة ديناميكياً
// ============================================================

// ---- تحميل البيانات من ملف JSON ----
async function loadMenu() {
  try {
    const response = await fetch('menu.json');
    if (!response.ok) throw new Error('تعذّر تحميل ملف القائمة');
    const data = await response.json();
    buildPage(data);
  } catch (error) {
    console.error('خطأ في تحميل القائمة:', error);
    showError();
  }
}

// ---- بناء الصفحة كاملةً ----
function buildPage(data) {
  const { cafe, categories, items } = data;

  // ① تحديث معلومات الكافيه في Hero
  // اللوقو صورة ثابتة — لا نغيّرها
  document.querySelector('.hero-title').textContent  = cafe.name;

  // ② بناء التابات ديناميكياً
  buildTabs(categories);

  // ③ بناء القسمين بالكروت
  Object.keys(categories).forEach(catKey => {
    const cat      = categories[catKey];
    const catItems = items.filter(item => item.category === catKey);
    buildSection(catKey, cat, catItems);
  });

  // ④ تفعيل التاب الأول تلقائياً
  const firstKey = Object.keys(categories)[0];
  activateTab(firstKey);
}

// ---- بناء أزرار التابات ----
function buildTabs(categories) {
  const tabsEl = document.getElementById('tabs');
  tabsEl.innerHTML = '';

  Object.keys(categories).forEach((key, index) => {
    const cat = categories[key];
    const btn = document.createElement('button');
    btn.className    = 'tab-btn' + (index === 0 ? ' active' : '');
    btn.dataset.tab  = key;
    btn.innerHTML    = ` ${cat.label}${cat.icon}`;
    btn.addEventListener('click', () => activateTab(key));
    tabsEl.appendChild(btn);
  });
}

// ---- بناء قسم كامل (هيدر + شبكة كروت) ----
function buildSection(catKey, cat, items) {
  const wrapper = document.getElementById('sections');

  // حاوية القسم
  const section = document.createElement('div');
  section.id        = catKey;
  section.className = 'tab-content';

  // هيدر القسم
  section.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">${cat.label} ${cat.icon}</h2>
      <p class="section-subtitle">${cat.subtitle}</p>
    </div>
    <div class="grid-icon"></div>
    <div class="menu-grid" id="grid-${catKey}"></div>
  `;

  wrapper.appendChild(section);

  // إضافة الكروت
  const grid = section.querySelector(`#grid-${catKey}`);
  items.forEach((item, index) => {
    grid.appendChild(buildCard(item, index));
  });
}

// ---- بناء كرت منتج واحد ----
function buildCard(item, index) {
  const card = document.createElement('div');
  card.className = 'menu-card';
  card.style.animationDelay = `${index * 0.06}s`;

  card.innerHTML = `
    <div class="card-image-wrap">
      <img
        class="card-image"
        src="${item.image}"
        alt="${item.name}"
        onerror="this.src='images/placeholder.jpg'; this.onerror=null;"
      />
    </div>
    <div class="card-body">
      <div class="card-top">
        <span class="card-name">${item.name}</span>
        <span class="card-price">${item.price} د.ع</span>
      </div>
      <p class="card-desc">${item.description}</p>
    </div>
  `;

  return card;
}

// ---- تبديل التاب النشط ----
function activateTab(tabKey) {
  // أزرار
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabKey);
  });
  // المحتوى
  document.querySelectorAll('.tab-content').forEach(section => {
    section.classList.toggle('active', section.id === tabKey);
  });
}

// ---- رسالة خطأ عند الفشل ----
function showError() {
  document.getElementById('sections').innerHTML = `
    <div style="text-align:center; padding:60px 20px; color:#b06ac8; font-size:1.1rem;">
      ⚠️ تعذّر تحميل القائمة، تأكد من وجود ملف <strong>menu.json</strong> بجانب الصفحة.
    </div>
  `;
}

// ---- تشغيل عند تحميل الصفحة ----
document.addEventListener('DOMContentLoaded', loadMenu);