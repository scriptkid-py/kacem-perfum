/**
 * ============================================================
 *  products.js — Kacem Perfum
 * ============================================================
 *  Fallback data bundle when running locally via file:// protocol
 *  or offline. In production, script.js fetches perfumes.json.
 * ============================================================
 */

window.DEFAULT_PERFUMES_DATA = {
  "shopName": "كاسم بيرفيوم",
  "whatsapp": "213XXXXXXXXX",
  "sizes": [
    { "label": "12 ml", "enabled": true },
    { "label": "30 ml", "enabled": true },
    { "label": "50 ml", "enabled": true },
    { "label": "100 ml", "enabled": true }
  ],
  "perfumes": [
    {
      "id": 9,
      "name": "ليالي الأندلس",
      "nameEn": "Lyali Al Andalus",
      "category": "unisex",
      "price": 2500,
      "image": "",
      "strengths": ["x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10"],
      "notes": {
        "top": "برغموت، ياسمين",
        "heart": "عنبر، مسك",
        "base": "صندل، فانيليا"
      },
      "description": "عطر فاخر أصيل يجمع سحر الأندلس مع لمسات العنبر والمسك الدافئ — يدوم طويلاً.",
      "inStock": true,
      "bestSeller": true
    },
    {
      "id": 1,
      "name": "عود الملوك",
      "nameEn": "Royal Oud Oil",
      "category": "oils",
      "price": 1200,
      "image": "images/product-oil-oud.jpg",
      "strengths": ["x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10"],
      "notes": {
        "top": "عود خشبي، عنبر",
        "heart": "زعفران، ورد طائفي",
        "base": "مسك أبيض، صندل"
      },
      "description": "زيت عطري فاخر بعمق العود الأصيل ودفء المسك — يدوم طويلاً على البشرة.",
      "inStock": true,
      "bestSeller": true
    },
    {
      "id": 2,
      "name": "ورد الشرق",
      "nameEn": "Eastern Rose Oil",
      "category": "oils",
      "price": 1000,
      "image": "",
      "strengths": ["x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10"],
      "notes": {
        "top": "ورد دمشقي، نيرولي",
        "heart": "ياسمين، بخور",
        "base": "مسك، أرز"
      },
      "description": "مزيج حالم من الورد الدمشقي والياسمين على قاعدة مسك ناعمة.",
      "inStock": true,
      "bestSeller": false
    },
    {
      "id": 3,
      "name": "الفارس",
      "nameEn": "Inspired by Fresh Woody Intensity",
      "category": "men",
      "price": 2200,
      "image": "images/product-men-woody.jpg",
      "strengths": ["x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10"],
      "notes": {
        "top": "تفاح، برغموت",
        "heart": "أرز، جلد",
        "base": "أمبروكسان، مسك"
      },
      "description": "إلهام من العطور الخشبية الفاخرة — حضور قوي وإشعاع مميز طوال اليوم.",
      "inStock": true,
      "bestSeller": true
    },
    {
      "id": 4,
      "name": "نجم الليل",
      "nameEn": "Inspired by Oriental Spicy Warmth",
      "category": "men",
      "price": 2000,
      "image": "",
      "strengths": ["x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10"],
      "notes": {
        "top": "بهارات، هيل",
        "heart": "ورد، عود",
        "base": "فانيليا، مسك"
      },
      "description": "توليفة شرقية دافئة مستوحاة من الأجواء الليلية الغامضة.",
      "inStock": true,
      "bestSeller": false
    },
    {
      "id": 5,
      "name": "زهرة القمر",
      "nameEn": "Inspired by Sweet Floral Elegance",
      "category": "women",
      "price": 2000,
      "image": "",
      "strengths": ["x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10"],
      "notes": {
        "top": "كمثرى، فراولة",
        "heart": "فاوانيا، ورد",
        "base": "مسك أبيض، خشب صندل"
      },
      "description": "زهري ناعم وفواكه حالمة — مستوحى من أشهر العطور النسائية الفاخرة.",
      "inStock": true,
      "bestSeller": true
    },
    {
      "id": 6,
      "name": "ليلى",
      "nameEn": "Inspired by Gourmand Vanilla Bliss",
      "category": "women",
      "price": 1800,
      "image": "",
      "strengths": ["x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10"],
      "notes": {
        "top": "برتقال، لوز",
        "heart": "فانيليا، توباك",
        "base": "كراميل، مسك"
      },
      "description": "حلاوة الفانيليا وذكاء التوباك في عطر نسائي يملأ الأجواء دفئاً.",
      "inStock": false,
      "bestSeller": false
    },
    {
      "id": 7,
      "name": "سحر الصحراء",
      "nameEn": "Inspired by Smoky Amber & Oud",
      "category": "unisex",
      "price": 2400,
      "image": "",
      "strengths": ["x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10"],
      "notes": {
        "top": "بخور، توباك",
        "heart": "عود، عنبر",
        "base": "مسك، لبنى"
      },
      "description": "رائحة مبخرة غامضة تجمع عمق العود والعنبر في هوية جريئة وأنيقة.",
      "inStock": true,
      "bestSeller": true
    },
    {
      "id": 8,
      "name": "أزرق النهر",
      "nameEn": "Inspired by Aquatic Fresh Citrus",
      "category": "unisex",
      "price": 1800,
      "image": "",
      "strengths": ["x2", "x3", "x4", "x5", "x6", "x7", "x8", "x9", "x10"],
      "notes": {
        "top": "ليمون، نعناع",
        "heart": "بحر، أرز",
        "base": "مسك نظيف، أنبر"
      },
      "description": "انتعاش مائي خفيف ومنعش — مناسب للرجال والنساء في كل المناسبات.",
      "inStock": true,
      "bestSeller": false
    }
  ]
};

// Global PRODUCTS array reference
window.PRODUCTS = window.DEFAULT_PERFUMES_DATA.perfumes;
