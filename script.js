/**
 * ============================================================
 *  script.js — Kacem Perfum
 *  Single-page app logic: loads perfumes.json dynamically,
 *  updates store info, handles size & strength selectors,
 *  cart persistence (localStorage), WhatsApp ordering.
 * ============================================================
 */

/* ── CONFIGURATION & STATE (Populated from perfumes.json) ── */
let WA_NUMBER   = "213XXXXXXXXX";
let SHOP_NAME   = "كاسم بيرفيوم";
let CURRENCY    = "دج";
let SIZES       = ["12 ml", "30 ml", "50 ml", "100 ml"];
let PRODUCTS    = [];

/* Category labels map */
const CAT_LABELS = {
  oils:   "زيوت عطرية",
  men:    "رجالي",
  women:  "نسائي",
  unisex: "مشترك"
};

/* Category emoji for placeholders */
const CAT_EMOJI = {
  oils:   "🟤",
  men:    "🖤",
  women:  "🌹",
  unisex: "✨"
};

/* State */
let cart = loadCart();   // array of { id, size, strength, qty }
let currentFilter = "all";
let searchQuery   = "";

/* Tracks user-selected size and strength for each product card */
const cardSelections = {};

/* ── DOM READY ────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", async () => {
  initNavbar();
  initHeroParticles();
  initMobileMenu();
  initScrollTop();

  // Load perfumes.json data dynamically
  await loadStoreData();

  initCatalog();
  renderBestSellers();
  initCart();
  syncCartBadge();
});

/* ════════════════════════════════════════════════════════════
   DATA LOADING & DYNAMIC SHOP BINDINGS
   ════════════════════════════════════════════════════════════ */
async function loadStoreData() {
  let data = null;

  // 1. Fetch perfumes.json
  try {
    const res = await fetch("perfumes.json?v=" + Date.now());
    if (res.ok) {
      data = await res.json();
    }
  } catch (err) {
    console.warn("Could not fetch perfumes.json directly (e.g. file:// protocol):", err);
  }

  // 2. Fallback to bundled data from products.js if fetch fails
  if (!data && window.DEFAULT_PERFUMES_DATA) {
    data = window.DEFAULT_PERFUMES_DATA;
  }

  if (!data) {
    console.error("No perfume data available");
    return;
  }

  // Bind configuration
  if (data.shopName) {
    SHOP_NAME = data.shopName;
  }
  if (data.whatsapp) {
    WA_NUMBER = String(data.whatsapp).replace(/\D/g, "");
  }

  // Process enabled sizes
  if (Array.isArray(data.sizes) && data.sizes.length > 0) {
    SIZES = data.sizes
      .filter(s => (typeof s === "string" ? true : s.enabled !== false))
      .map(s => (typeof s === "string" ? s : s.label));
    if (SIZES.length === 0) SIZES = ["50 ml"];
  }

  // Bind perfumes
  if (Array.isArray(data.perfumes)) {
    PRODUCTS = data.perfumes;
    window.PRODUCTS = PRODUCTS;
  }

  // Initialize card selections with default size and strength
  PRODUCTS.forEach(p => {
    const defaultStrength = (Array.isArray(p.strengths) && p.strengths.length > 0)
      ? p.strengths[0]
      : "x5";
    cardSelections[p.id] = {
      size: SIZES[0] || "50 ml",
      strength: defaultStrength
    };
  });

  // Apply dynamic store settings to HTML
  applyStoreBindings();
}

function applyStoreBindings() {
  // Update document title
  document.title = `${SHOP_NAME} — عطور فاخرة أصيلة`;

  // Update elements with data-shop-name
  document.querySelectorAll("[data-shop-name]").forEach(el => {
    el.textContent = SHOP_NAME;
  });

  // Update WhatsApp links
  document.querySelectorAll("[data-wa-link]").forEach(el => {
    el.href = `https://wa.me/${WA_NUMBER}`;
  });

  // Update phone display numbers
  document.querySelectorAll("[data-shop-phone]").forEach(el => {
    el.textContent = formatPhone(WA_NUMBER);
  });
}

function formatPhone(num) {
  if (!num || num.length < 9) return num;
  // Format e.g. 213551234567 -> +213 55 12 34 567
  if (num.startsWith("213") && num.length >= 11) {
    const rest = num.slice(3);
    return `+213 ${rest.slice(0, 2)} ${rest.slice(2, 4)} ${rest.slice(4, 6)} ${rest.slice(6)}`;
  }
  return `+${num}`;
}

/* ════════════════════════════════════════════════════════════
   NAVBAR & MOBILE MENU
   ════════════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const onScroll = () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

function initMobileMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu   = document.getElementById("mobile-menu");
  if (!toggle || !menu) return;
  const links  = menu.querySelectorAll("a");

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", isOpen);
  });

  links.forEach(link => {
    link.addEventListener("click", () => {
      menu.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("click", e => {
    if (!menu.contains(e.target) && !toggle.contains(e.target)) {
      menu.classList.remove("open");
      toggle.classList.remove("open");
    }
  });
}

/* ════════════════════════════════════════════════════════════
   HERO PARTICLES
   ════════════════════════════════════════════════════════════ */
function initHeroParticles() {
  const container = document.querySelector(".hero-particles");
  if (!container) return;
  const count = 22;
  for (let i = 0; i < count; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 3 + 1;
    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      bottom: ${Math.random() * -20}%;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.6 + 0.2};
    `;
    container.appendChild(p);
  }
}

/* ════════════════════════════════════════════════════════════
   PRODUCT CARD BUILDER (With Size & Strength Selectors)
   ════════════════════════════════════════════════════════════ */
function escapeHTML(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function buildCard(product) {
  const outOfStock = product.inStock === false;

  // Current selections
  const currentSel = cardSelections[product.id] || {
    size: SIZES[0] || "50 ml",
    strength: (product.strengths && product.strengths[0]) || "x5"
  };

  // Image or placeholder
  const imgHTML = product.image
    ? `<img
         src="${escapeHTML(product.image)}"
         alt="${escapeHTML(product.name)} — ${escapeHTML(product.nameEn || '')}"
         loading="lazy"
         onerror="this.parentElement.innerHTML='<div class=\\'img-placeholder ${escapeHTML(product.category)}\\'>${CAT_EMOJI[product.category] || '🌟'}</div>'"
       />`
    : `<div class="img-placeholder ${escapeHTML(product.category)}" aria-hidden="true">${CAT_EMOJI[product.category] || "🌟"}</div>`;

  // Sizes chips HTML
  const sizesChipsHTML = SIZES.map(sz => {
    const isAct = sz === currentSel.size ? "active" : "";
    return `<button type="button" class="opt-chip ${isAct}" data-card-opt="size" data-id="${product.id}" data-val="${escapeHTML(sz)}">${escapeHTML(sz)}</button>`;
  }).join("");

  // Strengths chips HTML
  const strengthsList = (Array.isArray(product.strengths) && product.strengths.length > 0)
    ? product.strengths
    : ["x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10"];

  const strengthsChipsHTML = strengthsList.map(st => {
    const isAct = st === currentSel.strength ? "active" : "";
    return `<button type="button" class="opt-chip ${isAct}" data-card-opt="strength" data-id="${product.id}" data-val="${escapeHTML(st)}">${escapeHTML(st)}</button>`;
  }).join("");

  // Notes chips
  const notesHTML = product.notes ? `
    <div class="card-notes" aria-label="مكونات العطر">
      ${product.notes.top   ? `<span class="note-chip" title="نوتة أولى">🌿 ${escapeHTML(product.notes.top)}</span>` : ""}
      ${product.notes.heart ? `<span class="note-chip" title="نوتة القلب">🌺 ${escapeHTML(product.notes.heart)}</span>` : ""}
      ${product.notes.base  ? `<span class="note-chip" title="نوتة القاعدة">🪵 ${escapeHTML(product.notes.base)}</span>` : ""}
    </div>` : "";

  return `
  <article class="product-card" data-id="${product.id}" tabindex="0" aria-label="${escapeHTML(product.name)}">
    <div class="card-img-wrap">
      ${imgHTML}
      ${product.bestSeller ? '<div class="badge-bestseller" aria-label="الأكثر مبيعاً">⭐ الأكثر مبيعاً</div>' : ""}
      ${outOfStock ? '<div class="badge-outofstock" aria-label="نفدت الكمية">نفدت الكمية</div>' : ""}
    </div>
    <div class="card-body">
      <p class="card-category">${CAT_LABELS[product.category] || escapeHTML(product.category)}</p>
      <h3 class="card-name">${escapeHTML(product.name)}</h3>
      ${product.nameEn ? `<p class="card-name-en">${escapeHTML(product.nameEn)}</p>` : ""}
      <p class="card-desc">${escapeHTML(product.description || "")}</p>
      ${notesHTML}

      <!-- Size Selector -->
      <div class="card-option-group" aria-label="اختيار الحجم">
        <span class="card-option-label">
          <span>الحجم:</span>
          <span class="opt-label-val" data-label-role="size-${product.id}">${escapeHTML(currentSel.size)}</span>
        </span>
        <div class="card-chips" role="group" aria-label="أحجام العطر">
          ${sizesChipsHTML}
        </div>
      </div>

      <!-- Strength Selector -->
      <div class="card-option-group" aria-label="اختيار التركيز">
        <span class="card-option-label">
          <span>التركيز:</span>
          <span class="opt-label-val" data-label-role="strength-${product.id}">${escapeHTML(currentSel.strength)}</span>
        </span>
        <div class="card-chips" role="group" aria-label="تراكيز العطر">
          ${strengthsChipsHTML}
        </div>
      </div>

      <div class="card-footer" style="margin-top:0.6rem;">
        <p class="card-price">${(product.price || 2000).toLocaleString("ar-DZ")}<small> ${CURRENCY}</small></p>
      </div>

      <div class="card-actions">
        <button
          class="btn btn-add-cart"
          data-action="add-cart"
          data-id="${product.id}"
          ${outOfStock ? "disabled aria-disabled='true'" : ""}
          aria-label="أضف ${escapeHTML(product.name)} إلى السلة"
        >
          ${outOfStock ? "غير متوفر" : "🛒 أضف للسلة"}
        </button>
        <button
          class="btn btn-wa"
          data-action="order-wa"
          data-id="${product.id}"
          ${outOfStock ? "disabled aria-disabled='true'" : ""}
          aria-label="اطلب ${escapeHTML(product.name)} عبر واتساب"
        >
          📲 اطلب
        </button>
      </div>
    </div>
  </article>`;
}

/* ════════════════════════════════════════════════════════════
   BEST SELLERS SECTION
   ════════════════════════════════════════════════════════════ */
function renderBestSellers() {
  const grid = document.getElementById("best-sellers-grid");
  if (!grid) return;
  const items = PRODUCTS.filter(p => p.bestSeller);
  grid.innerHTML = items.map(buildCard).join("");
  attachCardListeners(grid);
}

/* ════════════════════════════════════════════════════════════
   CATALOG / FILTER / SEARCH
   ════════════════════════════════════════════════════════════ */
function initCatalog() {
  const grid   = document.getElementById("catalog-grid");
  const noRes  = document.getElementById("no-results");
  const search = document.getElementById("search-input");
  const filterBtns = document.querySelectorAll(".filter-btn");

  function render() {
    const q = searchQuery.trim().toLowerCase();
    const filtered = PRODUCTS.filter(p => {
      const matchCat = currentFilter === "all" || p.category === currentFilter;
      const matchQ   = !q ||
        p.name.toLowerCase().includes(q) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
    grid.innerHTML = filtered.map(buildCard).join("");
    if (noRes) noRes.classList.toggle("visible", filtered.length === 0);
    attachCardListeners(grid);
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      currentFilter = btn.dataset.filter;
      render();
    });
  });

  let searchTimer;
  if (search) {
    search.addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        searchQuery = search.value;
        render();
      }, 250);
    });
  }

  render();
}

function refreshAllGrids() {
  const bsGrid = document.getElementById("best-sellers-grid");
  if (bsGrid) {
    bsGrid.innerHTML = PRODUCTS.filter(p => p.bestSeller).map(buildCard).join("");
    attachCardListeners(bsGrid);
  }
  const catGrid = document.getElementById("catalog-grid");
  if (catGrid) {
    const q = searchQuery.trim().toLowerCase();
    const filtered = PRODUCTS.filter(p => {
      const matchCat = currentFilter === "all" || p.category === currentFilter;
      const matchQ   = !q ||
        p.name.toLowerCase().includes(q) ||
        (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q));
      return matchCat && matchQ;
    });
    catGrid.innerHTML = filtered.map(buildCard).join("");
    attachCardListeners(catGrid);
  }
}

/* ════════════════════════════════════════════════════════════
   CARD EVENT DELEGATION (Options & Actions)
   ════════════════════════════════════════════════════════════ */
function attachCardListeners(container) {
  container.addEventListener("click", e => {
    // 1. Check if user clicked an option chip (Size or Strength)
    const optChip = e.target.closest("[data-card-opt]");
    if (optChip) {
      e.preventDefault();
      e.stopPropagation();
      const type = optChip.dataset.cardOpt; // 'size' or 'strength'
      const id   = parseInt(optChip.dataset.id, 10);
      const val  = optChip.dataset.val;

      if (!cardSelections[id]) {
        cardSelections[id] = { size: SIZES[0] || "50 ml", strength: "x5" };
      }
      cardSelections[id][type] = val;

      // Update active state in current card
      const parentCard = optChip.closest(".product-card");
      if (parentCard) {
        const chipsInGroup = parentCard.querySelectorAll(`[data-card-opt="${type}"]`);
        chipsInGroup.forEach(c => c.classList.toggle("active", c.dataset.val === val));

        const labelVal = parentCard.querySelector(`[data-label-role="${type}-${id}"]`);
        if (labelVal) labelVal.textContent = val;
      }
      return;
    }

    // 2. Check if user clicked Add-to-Cart or WhatsApp order button
    const btn = e.target.closest("[data-action]");
    if (!btn || btn.disabled) return;
    const id  = parseInt(btn.dataset.id, 10);
    const action = btn.dataset.action;

    if (action === "add-cart") addToCart(id);
    if (action === "order-wa") orderOneWA(id);
  });
}

/* ════════════════════════════════════════════════════════════
   WHATSAPP ORDERING
   ════════════════════════════════════════════════════════════ */
function orderOneWA(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;

  const sel = cardSelections[id] || {
    size: SIZES[0] || "50 ml",
    strength: (p.strengths && p.strengths[0]) || "x5"
  };

  const msg =
`مرحباً، أريد طلب:

🛍️ *${p.name}*
📦 الحجم: ${sel.size}
⚡ التركيز: ${sel.strength}
💰 السعر: ${(p.price || 2000).toLocaleString("ar-DZ")} ${CURRENCY}

من ${SHOP_NAME}`;

  openWA(msg);
}

function orderCartWA() {
  if (cart.length === 0) return;
  let lines = `مرحباً، أريد طلب ما يلي من ${SHOP_NAME}:\n\n`;
  let total = 0;

  cart.forEach(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return;
    const price = p.price || 2000;
    const sub = price * item.qty;
    total += sub;
    lines += `• *${p.name}* (الحجم: ${item.size} - تركيز: ${item.strength}) × ${item.qty} = ${sub.toLocaleString("ar-DZ")} ${CURRENCY}\n`;
  });

  lines += `\n💰 *الإجمالي: ${total.toLocaleString("ar-DZ")} ${CURRENCY}*\n\nشكراً لك!`;
  openWA(lines);
}

function openWA(text) {
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

/* ════════════════════════════════════════════════════════════
   CART — State & Persistence
   ════════════════════════════════════════════════════════════ */
function loadCart() {
  try {
    return JSON.parse(localStorage.getItem("kacem_cart")) || [];
  } catch {
    return [];
  }
}

function saveCart() {
  localStorage.setItem("kacem_cart", JSON.stringify(cart));
}

function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p || p.inStock === false) return;

  const sel = cardSelections[id] || {
    size: SIZES[0] || "50 ml",
    strength: (p.strengths && p.strengths[0]) || "x5"
  };

  // Find item with matching ID, size, and strength
  const existing = cart.find(
    c => c.id === id && c.size === sel.size && c.strength === sel.strength
  );

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: id,
      size: sel.size,
      strength: sel.strength,
      qty: 1
    });
  }

  saveCart();
  syncCartBadge();
  renderCartItems();
  showToast(`✅ تمت الإضافة: ${p.name} (${sel.size} - ${sel.strength})`);
}

function removeFromCart(id, size, strength) {
  cart = cart.filter(
    c => !(c.id === id && c.size === size && c.strength === strength)
  );
  saveCart();
  syncCartBadge();
  renderCartItems();
}

function changeQty(id, size, strength, delta) {
  const item = cart.find(
    c => c.id === id && c.size === size && c.strength === strength
  );
  if (!item) return;

  item.qty += delta;
  if (item.qty < 1) {
    removeFromCart(id, size, strength);
    return;
  }
  saveCart();
  syncCartBadge();
  renderCartItems();
}

function clearCart() {
  cart = [];
  saveCart();
  syncCartBadge();
  renderCartItems();
  showToast("تم تفريغ السلة");
}

function getCartTotal() {
  return cart.reduce((acc, item) => {
    const p = PRODUCTS.find(x => x.id === item.id);
    const price = p ? (p.price || 2000) : 2000;
    return acc + (price * item.qty);
  }, 0);
}

function getCartCount() {
  return cart.reduce((acc, item) => acc + item.qty, 0);
}

/* ════════════════════════════════════════════════════════════
   CART — UI
   ════════════════════════════════════════════════════════════ */
function initCart() {
  const overlay  = document.getElementById("cart-overlay");
  const cartBtn  = document.getElementById("cart-btn");
  const closeBtn = document.getElementById("cart-close");
  const orderBtn = document.getElementById("cart-order-wa");
  const clearBtn = document.getElementById("cart-clear");

  if (cartBtn) cartBtn.addEventListener("click", openCartSidebar);
  if (closeBtn) closeBtn.addEventListener("click", closeCartSidebar);
  if (overlay) {
    overlay.addEventListener("click", e => {
      if (e.target === overlay) closeCartSidebar();
    });
  }
  if (orderBtn) orderBtn.addEventListener("click", orderCartWA);
  if (clearBtn) clearBtn.addEventListener("click", clearCart);

  const sidebar = document.getElementById("cart-sidebar");
  if (sidebar) {
    sidebar.addEventListener("keydown", e => {
      if (e.key === "Escape") closeCartSidebar();
    });
  }

  renderCartItems();
}

function openCartSidebar() {
  const overlay = document.getElementById("cart-overlay");
  if (!overlay) return;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
  const cartBtn = document.getElementById("cart-btn");
  if (cartBtn) cartBtn.setAttribute("aria-expanded", "true");
  const closeBtn = document.getElementById("cart-close");
  if (closeBtn) closeBtn.focus();
}

function closeCartSidebar() {
  const overlay = document.getElementById("cart-overlay");
  if (!overlay) return;
  overlay.classList.remove("open");
  document.body.style.overflow = "";
  const cartBtn = document.getElementById("cart-btn");
  if (cartBtn) {
    cartBtn.setAttribute("aria-expanded", "false");
    cartBtn.focus();
  }
}

function renderCartItems() {
  const list     = document.getElementById("cart-items-list");
  const total    = document.getElementById("cart-total-amount");
  const orderBtn = document.getElementById("cart-order-wa");
  const clearBtn = document.getElementById("cart-clear");
  if (!list) return;

  if (cart.length === 0) {
    list.innerHTML = `<div class="cart-empty-msg"><span>🛒</span>سلتك فارغة حالياً</div>`;
    if (total) total.textContent = `0 ${CURRENCY}`;
    if (orderBtn) orderBtn.disabled = true;
    if (clearBtn) clearBtn.disabled = true;
    return;
  }

  if (orderBtn) orderBtn.disabled = false;
  if (clearBtn) clearBtn.disabled = false;

  list.innerHTML = cart.map(item => {
    const p = PRODUCTS.find(x => x.id === item.id);
    if (!p) return "";
    const price = p.price || 2000;
    const imgPart = p.image
      ? `<img class="cart-item-img" src="${escapeHTML(p.image)}" alt="${escapeHTML(p.name)}" loading="lazy">`
      : `<div class="cart-item-img-ph ${escapeHTML(p.category)}">${CAT_EMOJI[p.category] || "🌟"}</div>`;

    return `
    <div class="cart-item" data-id="${p.id}">
      ${imgPart}
      <div class="cart-item-info">
        <p class="cart-item-name">${escapeHTML(p.name)}</p>
        <p class="cart-item-size">📦 ${escapeHTML(item.size)} • ⚡ ${escapeHTML(item.strength)}</p>
        <p class="cart-item-price">${(price * item.qty).toLocaleString("ar-DZ")} ${CURRENCY}</p>
      </div>
      <div class="cart-item-controls">
        <button
          class="qty-btn"
          onclick="changeQty(${p.id}, '${escapeHTML(item.size)}', '${escapeHTML(item.strength)}', -1)"
          aria-label="تقليل الكمية"
        >−</button>
        <span class="qty-val" aria-live="polite">${item.qty}</span>
        <button
          class="qty-btn"
          onclick="changeQty(${p.id}, '${escapeHTML(item.size)}', '${escapeHTML(item.strength)}', 1)"
          aria-label="زيادة الكمية"
        >+</button>
        <button
          class="cart-remove-btn"
          onclick="removeFromCart(${p.id}, '${escapeHTML(item.size)}', '${escapeHTML(item.strength)}')"
          aria-label="حذف المنتج من السلة"
        >🗑️</button>
      </div>
    </div>`;
  }).join("");

  if (total) {
    total.textContent = `${getCartTotal().toLocaleString("ar-DZ")} ${CURRENCY}`;
  }
}

function syncCartBadge() {
  const badge = document.getElementById("cart-count");
  if (!badge) return;
  const count = getCartCount();
  badge.textContent = count;
  badge.classList.toggle("visible", count > 0);
}

/* ════════════════════════════════════════════════════════════
   SCROLL TO TOP & TOAST
   ════════════════════════════════════════════════════════════ */
function initScrollTop() {
  const btn = document.getElementById("scroll-top");
  if (!btn) return;
  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

let toastTimer;
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2800);
}

document.addEventListener("DOMContentLoaded", () => {
  const shopNowBtn = document.getElementById("hero-shop-now");
  if (shopNowBtn) {
    shopNowBtn.addEventListener("click", () => {
      const catalog = document.getElementById("catalog");
      if (catalog) catalog.scrollIntoView({ behavior: "smooth" });
    });
  }
});
