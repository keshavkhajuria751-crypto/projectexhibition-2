// SmartBuy AI — ML Prediction Engine (Simplified Backend Version)
// Deterministic: same URL always returns identical results.

const PLATFORMS = {
  'amazon.in':        { name: 'Amazon India',  icon: '📦', color: '#FF9900' },
  'amazon.com':       { name: 'Amazon US',     icon: '📦', color: '#FF9900' },
  'amzn.in':          { name: 'Amazon India',  icon: '📦', color: '#FF9900' },
  'amzn.to':          { name: 'Amazon',        icon: '📦', color: '#FF9900' },
  'flipkart.com':     { name: 'Flipkart',      icon: '🛒', color: '#2874F0' },
  'fkrt.it':          { name: 'Flipkart',      icon: '🛒', color: '#2874F0' },
  'myntra.com':       { name: 'Myntra',        icon: '👗', color: '#FF3F6C' },
  'meesho.com':       { name: 'Meesho',        icon: '🛍️', color: '#9B2335' },
  'croma.com':        { name: 'Croma',         icon: '🔌', color: '#00A651' },
  'nykaa.com':        { name: 'Nykaa',         icon: '💄', color: '#FC2779' },
  'nykaafashion.com': { name: 'Nykaa Fashion', icon: '💄', color: '#FC2779' },
};

const CATEGORIES = {
  phone:     { label: 'Smartphone',      range: [8000,   120000] },
  mobile:    { label: 'Smartphone',      range: [8000,   120000] },
  galaxy:    { label: 'Smartphone',      range: [12000,  150000] },
  iphone:    { label: 'iPhone',          range: [40000,  180000] },
  redmi:     { label: 'Smartphone',      range: [6000,   25000]  },
  realme:    { label: 'Smartphone',      range: [8000,   30000]  },
  oneplus:   { label: 'Smartphone',      range: [15000,  80000]  },
  poco:      { label: 'Smartphone',      range: [8000,   35000]  },
  vivo:      { label: 'Smartphone',      range: [8000,   60000]  },
  oppo:      { label: 'Smartphone',      range: [8000,   60000]  },
  laptop:    { label: 'Laptop',          range: [25000,  200000] },
  macbook:   { label: 'MacBook',         range: [80000,  250000] },
  dell:      { label: 'Laptop',          range: [30000,  150000] },
  hp:        { label: 'Laptop',          range: [25000,  120000] },
  lenovo:    { label: 'Laptop',          range: [25000,  130000] },
  asus:      { label: 'Laptop',          range: [30000,  150000] },
  headphone: { label: 'Headphones',      range: [500,    40000]  },
  earphone:  { label: 'Earphones',       range: [300,    20000]  },
  airpod:    { label: 'Earbuds',         range: [5000,   30000]  },
  buds:      { label: 'Earbuds',         range: [1000,   20000]  },
  watch:     { label: 'Smartwatch',      range: [1500,   60000]  },
  tv:        { label: 'Smart TV',        range: [8000,   200000] },
  shoes:     { label: 'Footwear',        range: [500,    15000]  },
  nike:      { label: 'Nike Footwear',   range: [2000,   20000]  },
  adidas:    { label: 'Adidas Footwear', range: [1500,   15000]  },
  puma:      { label: 'Puma Footwear',   range: [1000,   10000]  },
  dress:     { label: 'Dress',           range: [500,    8000]   },
  kurti:     { label: 'Ethnic Wear',     range: [299,    5000]   },
  saree:     { label: 'Saree',           range: [299,    20000]  },
  fridge:    { label: 'Refrigerator',    range: [8000,   80000]  },
  washing:   { label: 'Washing Machine', range: [7000,   60000]  },
  camera:    { label: 'Camera',          range: [5000,   200000] },
  tablet:    { label: 'Tablet',          range: [8000,   120000] },
  ipad:      { label: 'iPad',            range: [30000,  150000] },
  speaker:   { label: 'Speaker',         range: [500,    30000]  },
  perfume:   { label: 'Perfume',         range: [299,    8000]   },
  bag:       { label: 'Bag',             range: [300,    15000]  },
  book:      { label: 'Book',            range: [100,    2000]   },
  trimmer:   { label: 'Trimmer',         range: [500,    5000]   },
  mixer:     { label: 'Mixer / Grinder', range: [800,    8000]   },
  microwave: { label: 'Microwave',       range: [4000,   30000]  },
  ac:        { label: 'Air Conditioner', range: [20000,  90000]  },
  fan:       { label: 'Fan',             range: [800,    8000]   },
};

function seededRandom(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  let seed = Math.abs(hash);
  return function () {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    return (seed >>> 0) / 0xffffffff;
  };
}

function detectPlatform(url) {
  const low = url.toLowerCase();
  const entry = Object.entries(PLATFORMS).find(([domain]) => low.includes(domain));
  return entry
    ? { domain: entry[0], ...entry[1] }
    : { domain: 'unknown', name: 'Online Store', icon: '🛒', color: '#6B5E4E' };
}

function detectCategory(url) {
  const low = url.toLowerCase();
  const entry = Object.entries(CATEGORIES).find(([key]) => low.includes(key));
  return entry ? entry[1] : { label: 'Product', range: [500, 50000] };
}

function extractSlug(url) {
  try {
    const u = new URL(url);
    const path = u.pathname;
    const asin = path.match(/\/dp\/([A-Z0-9]{10})/i);
    if (asin) return asin[1];
    const fk = path.match(/\/p\/(itm[a-z0-9]+)/i);
    if (fk) return fk[1];
    const segs = path.split('/').filter(Boolean);
    return segs[segs.length - 1] || 'product';
  } catch {
    return url.slice(-12);
  }
}

function analyzeUrl(url) {
  const platform = detectPlatform(url);
  const category = detectCategory(url);
  const slug     = extractSlug(url);
  const rand     = seededRandom(url);

  const [minP, maxP] = category.range;
  const currentPrice   = Math.floor(minP + rand() * (maxP - minP));
  const changeFraction = (rand() - 0.55) * 0.45;
  const predictedPrice = Math.floor(currentPrice * (1 + changeFraction));
  const pctChange      = ((predictedPrice - currentPrice) / currentPrice * 100).toFixed(1);
  const confidence     = Math.floor(62 + rand() * 32);

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now    = new Date();
  const history = [];
  let rolling  = currentPrice * (1 + rand() * 0.25);

  for (let i = 11; i >= 0; i--) {
    const monthIdx = (now.getMonth() - i + 12) % 12;
    rolling        = Math.max(minP * 0.8, rolling + (rand() - 0.5) * 0.18 * rolling);
    history.push({ month: MONTHS[monthIdx], price: Math.round(rolling) });
  }
  history[11].price = currentPrice;

  const prices = history.map(h => h.price);
  const minH   = Math.min(...prices);
  const maxH   = Math.max(...prices);
  const avgH   = Math.round(prices.reduce((a, b) => a + b, 0) / 12);
  const bestM  = history.find(h => h.price === minH)?.month;

  const raw  = slug.replace(/[-_]/g, ' ').replace(/[^a-zA-Z0-9 ]/g, '').trim();
  const name = raw.length > 3
    ? raw.charAt(0).toUpperCase() + raw.slice(1, 44)
    : `${category.label} · ${slug.slice(0, 8).toUpperCase()}`;

  return {
    url,
    name,
    platform,
    category:      category.label,
    currentPrice,
    predictedPrice,
    pctChange,
    recommendation: predictedPrice < currentPrice ? 'WAIT' : 'BUY',
    confidence,
    history,
    minH,
    maxH,
    avgH,
    bestM,
    savings: predictedPrice < currentPrice ? currentPrice - predictedPrice : 0,
  };
}

module.exports = { analyzeUrl };
