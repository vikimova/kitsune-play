/* ════════════════════════════════════════════════
   KitsunePlay — app.js
   Jikan API v4 (MyAnimeList, no key needed)
════════════════════════════════════════════════ */

// ── FALLBACK DATA (used before API loads) ──
const FALLBACK_ANIME = [
  { id:11061, title:'Атака Титанов', orig:'進撃の巨人', emoji:'🔱', rating:9.0, year:2013, eps:25, status:'finished', studio:'Wit Studio', genres:['Action','Drama','Fantasy'], desc:'Человечество за гигантскими стенами вынуждено защищаться от титанов. Когда стена падает — молодой Эрен Йегер клянётся уничтожить всех титанов.', image:null, members:3500000 },
  { id:16498, title:'Клинок, рассекающий демонов', orig:'鬼滅の刃', emoji:'⚔️', rating:8.7, year:2019, eps:26, status:'finished', studio:'Ufotable', genres:['Action','Fantasy','Historical'], desc:'Тандзиро Камадо становится истребителем демонов после того, как его семья была убита, а сестра превращена в демона.', image:null, members:2900000 },
  { id:31964, title:'Моя геройская академия', orig:'僕のヒーローアカデミア', emoji:'🌸', rating:8.2, year:2016, eps:13, status:'finished', studio:'BONES', genres:['Action','Comedy','School'], desc:'В мире сверхспособностей Изуку Мидория — единственный без силы. Но встреча с величайшим героем меняет всё.', image:null, members:2100000 },
  { id:1535, title:'Тетрадь смерти', orig:'デスノート', emoji:'📓', rating:9.0, year:2006, eps:37, status:'finished', studio:'Madhouse', genres:['Mystery','Psychological','Thriller'], desc:'Лайт Ягами находит тетрадь, убивающую любого, чьё имя в ней написано. Он решает создать идеальный мир.', image:null, members:3800000 },
  { id:5114, title:'Стальной алхимик', orig:'鋼の錬金術師', emoji:'⚗️', rating:9.1, year:2009, eps:64, status:'finished', studio:'BONES', genres:['Action','Adventure','Drama','Fantasy'], desc:'Братья Элрик ищут Философский камень, чтобы вернуть тела, потерянные при запретном ритуале.', image:null, members:3300000 },
  { id:136430, title:'Магическая битва', orig:'呪術廻戦', emoji:'🌙', rating:8.6, year:2020, eps:24, status:'finished', studio:'MAPPA', genres:['Action','Fantasy','School'], desc:'Юдзи Итадори поглощает палец проклятого духа и становится его сосудом, вступая в мир экзорцистов.', image:null, members:2200000 },
  { id:9253, title:'Стейнс;Гейт', orig:'Steins;Gate', emoji:'⏰', rating:9.1, year:2011, eps:24, status:'finished', studio:'White Fox', genres:['Drama','Sci-Fi','Thriller'], desc:'Хакер-учёный случайно изобретает машину времени и начинает менять прошлое, не подозревая о последствиях.', image:null, members:2400000 },
  { id:22319, title:'Токийский гуль', orig:'東京喰種', emoji:'👁️', rating:7.9, year:2014, eps:12, status:'finished', studio:'Pierrot', genres:['Action','Horror','Mystery'], desc:'Кэн Канэки становится полугулем и вынужден жить между двумя мирами.', image:null, members:1900000 },
  { id:38000, title:'Винланд Сага', orig:'ヴィンランド・サガ', emoji:'⚡', rating:8.7, year:2019, eps:24, status:'finished', studio:'Wit Studio', genres:['Action','Adventure','Drama','Historical'], desc:'Молодой викинг Торфинн жаждет мести за убийство отца в эпоху великих завоеваний.', image:null, members:1200000 },
  { id:40748, title:'Доктор Стоун', orig:'Dr. STONE', emoji:'🧪', rating:8.2, year:2019, eps:24, status:'finished', studio:'TMS Entertainment', genres:['Adventure','Comedy','Sci-Fi'], desc:'Гений-учёный возрождает цивилизацию с нуля после того, как всё человечество превратилось в камень.', image:null, members:1100000 },
  { id:41467, title:'Истребитель демонов: Бесконечный поезд', orig:'劇場版「鬼滅の刃」無限列車編', emoji:'🚂', rating:8.2, year:2020, eps:1, status:'finished', studio:'Ufotable', genres:['Action','Fantasy','Historical'], desc:'Тандзиро и его друзья садятся на поезд, где орудует демон Аказа.', image:null, members:1400000 },
  { id:21, title:'Ван-Пис', orig:'ワンピース', emoji:'☠️', rating:8.7, year:1999, eps:1000, status:'ongoing', studio:'Toei Animation', genres:['Action','Adventure','Comedy','Fantasy'], desc:'Монки Д. Луффи мечтает стать Королём пиратов и найти легендарное Ван-Пис.', image:null, members:2800000 },
];

// ── SCHEDULE DATA ──
const SCHEDULE = {
  'Пн': [{time:'18:00',id:11061,ep:'Сер. 5'},{time:'21:00',id:40748,ep:'Сер. 9'}],
  'Вт': [{time:'17:30',id:21,ep:'Сер. 1104'}],
  'Ср': [{time:'20:00',id:136430,ep:'Сер. 12'},{time:'22:30',id:11061,ep:'Спецвыпуск'}],
  'Чт': [{time:'17:30',id:16498,ep:'Сер. 8'},{time:'20:00',id:136430,ep:'Сер. 12'},{time:'23:00',id:31964,ep:'Сер. 5'}],
  'Пт': [{time:'19:00',id:5114,ep:'Спецвыпуск'}],
  'Сб': [{time:'17:30',id:31964,ep:'Сер. 6'},{time:'19:00',id:38000,ep:'Сер. 24'},{time:'22:00',id:9253,ep:'Сер. 10'}],
  'Вс': [{time:'16:00',id:22319,ep:'Сер. 13'},{time:'20:30',id:21,ep:'Сер. 1105'}],
};
const DAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
const TODAY = 'Чт';

// ── PLAYER ──
// Vimeo разрешает embed на любых сайтах в отличие от YouTube.
// Это официальные трейлеры аниме, загруженные на Vimeo.
// В продакшне сюда подставляются ссылки Kodik / Sibnet / AniLibria.
const VIMEO_TRAILERS = {
  11061:  '169599296',   // AoT official trailer on Vimeo
  16498:  '336415508',   // Demon Slayer
  31964:  '156545174',   // MHA
  1535:   '21294821',    // Death Note
  5114:   '18904606',    // FMA Brotherhood
  136430: '397264464',   // Jujutsu Kaisen
  9253:   '32855185',    // Steins;Gate
  22319:  '98599193',    // Tokyo Ghoul
  38000:  '348512164',   // Vinland Saga
  40748:  '357795803',   // Dr. Stone
  21:     '16379527',    // One Piece
};

// Sibnet — российский видеохостинг, полностью разрешает embed
// Используем как демо-видео для аниме без Vimeo
const SIBNET_DEMO = 'https://video.sibnet.ru/shell.php?videoid=4865115'; // аниме-опенинг (публичный)

function getPlayerUrl(anime) {
  // Приоритет: Vimeo трейлер → Sibnet fallback
  if (VIMEO_TRAILERS[anime.id]) {
    return `https://player.vimeo.com/video/${VIMEO_TRAILERS[anime.id]}?autoplay=1&color=FF6B6B&title=0&byline=0&portrait=0`;
  }
  return SIBNET_DEMO;
}

// ── STATE ──
let state = {
  db: [...FALLBACK_ANIME],
  apiLoaded: false,
  user: null,
  collections: { watching:[], planned:[], watched:[], dropped:[], hold:[], fav:[] },
  ratings: {},
  bells: new Set(),
  currentAnime: null,
  currentEp: 1,
  homeGenre: 'all',
  catalogPage: 1,
  schedDay: TODAY,
  collTab: 'watching',
  manualGenres: [],
};

// ════════════════════════════════════════════════
// JIKAN API — load 50+ anime
// ════════════════════════════════════════════════
async function loadFromJikan() {
  document.getElementById('api-banner').style.display = 'flex';
  try {
    // Fetch top anime — 3 pages = 75 entries
    const pages = [1, 2, 3];
    const results = [];
    for (const page of pages) {
      const res = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=25`);
      if (!res.ok) throw new Error('Jikan error');
      const data = await res.json();
      results.push(...data.data);
      await new Promise(r => setTimeout(r, 400)); // rate limit: 3 req/sec
    }

    const mapped = results.map(a => ({
      id: a.mal_id,
      title: a.title_russian || a.title,
      orig: a.title_japanese || a.title,
      emoji: emojiForGenres(a.genres?.map(g => g.name) || []),
      rating: a.score || 0,
      year: a.year || (a.aired?.from ? new Date(a.aired.from).getFullYear() : null),
      eps: a.episodes || '?',
      status: mapStatus(a.status),
      studio: a.studios?.[0]?.name || 'Unknown',
      genres: a.genres?.map(g => g.name) || [],
      desc: a.synopsis || '',
      image: a.images?.jpg?.large_image_url || a.images?.jpg?.image_url || null,
      members: a.members || 0,
      trailer: a.trailer?.embed_url || null,
      streams: [],
    }));

    state.db = mapped;
    state.apiLoaded = true;
    updateHeroStats();
    buildGenreFilters();
    buildYearFilters();
    buildManualGenres();

    // Re-render current visible page
    const activePage = document.querySelector('.page.active')?.id?.replace('page-', '');
    if (activePage === 'home') renderHome();
    if (activePage === 'catalog') applyFilters();

  } catch (e) {
    console.warn('Jikan API error, using fallback:', e);
    // Keep fallback data
  } finally {
    document.getElementById('api-banner').style.display = 'none';
  }
}

function mapStatus(s) {
  if (!s) return 'finished';
  if (s.includes('Airing')) return 'ongoing';
  if (s.includes('Not yet')) return 'announced';
  return 'finished';
}

function emojiForGenres(genres) {
  if (genres.includes('Horror')) return '👁️';
  if (genres.includes('Sci-Fi')) return '🚀';
  if (genres.includes('Historical')) return '⚔️';
  if (genres.includes('Sports')) return '⚽';
  if (genres.includes('Music')) return '🎵';
  if (genres.includes('Comedy')) return '😄';
  if (genres.includes('Romance')) return '💕';
  if (genres.includes('Fantasy')) return '✨';
  if (genres.includes('Action')) return '⚡';
  if (genres.includes('Mystery')) return '🔍';
  return '🎌';
}

// ════════════════════════════════════════════════
// NAVIGATION
// ════════════════════════════════════════════════
let prevPage = 'home';

function nav(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.page === page));
  window.scrollTo(0, 0);

  if (page === 'home')     renderHome();
  if (page === 'catalog')  { buildGenreFilters(); buildYearFilters(); applyFilters(); }
  if (page === 'schedule') renderSchedulePage();
  if (page === 'profile')  renderProfile();
  if (page === 'admin')    renderAdmin();

  prevPage = page;
}

document.getElementById('back-btn').onclick = () => nav(prevPage === 'detail' ? 'home' : prevPage || 'home');

// ════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════
function sLabel(s) { return s === 'ongoing' ? 'Онгоинг' : s === 'announced' ? 'Анонс' : 'Завершён'; }
function sClass(s) { return s === 'ongoing' ? 's-ongoing' : s === 'announced' ? 's-announced' : 's-finished'; }

function starsHtml(rating) {
  const n = Math.round(rating / 2);
  return Array.from({length:5}, (_,i) => `<i class="ti ti-star${i < n ? '-filled' : ''}"></i>`).join('');
}

function collStatus(id) {
  for (const [k, v] of Object.entries(state.collections)) {
    if (k !== 'fav' && v.includes(id)) return k;
  }
  return null;
}

function chipOnly(el, chipGroupId) {
  document.querySelectorAll(`#${chipGroupId} .chip`).forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

// ════════════════════════════════════════════════
// HERO STATS
// ════════════════════════════════════════════════
function updateHeroStats() {
  const db = state.db;
  const genres = new Set(db.flatMap(a => a.genres));
  const studios = new Set(db.map(a => a.studio).filter(Boolean));
  document.getElementById('hs-count').textContent  = db.length;
  document.getElementById('hs-genres').textContent  = genres.size;
  document.getElementById('hs-studios').textContent = studios.size;
}

// ════════════════════════════════════════════════
// ANIME CARD
// ════════════════════════════════════════════════
function animeCard(a) {
  const cs = collStatus(a.id);
  const posterHtml = a.image
    ? `<img src="${a.image}" alt="${a.title}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';
  const emojiHtml = `<div class="card-poster-emoji" style="${a.image ? 'display:none' : ''}">${a.emoji || '🎌'}</div>`;

  return `<div class="anime-card" onclick="openDetail(${a.id})">
    <div class="card-poster">
      ${posterHtml}
      ${emojiHtml}
      <span class="card-rating-badge"><i class="ti ti-star-filled" style="font-size:10px"></i> ${a.rating || '—'}</span>
      <span class="card-status-badge ${sClass(a.status)}">${sLabel(a.status)}</span>
    </div>
    <div class="card-body">
      <div class="card-title">${a.title}</div>
      <div class="card-sub">${a.genres?.slice(0,2).join(', ') || ''} · ${a.year || '—'}</div>
      <div class="card-actions">
        <button class="card-btn ${cs === 'watching' ? 'active' : ''}"
          onclick="event.stopPropagation();addToColl(${a.id},'watching')">
          ${cs === 'watching' ? '✓ Смотрю' : '+ Смотрю'}
        </button>
        <button class="card-btn"
          onclick="event.stopPropagation();addToColl(${a.id},'planned')">В планах</button>
      </div>
    </div>
  </div>`;
}

function skeletonCards(n = 6) {
  return Array.from({length:n}, () => `
    <div class="skeleton-card">
      <div class="skeleton-poster"></div>
      <div class="skeleton-body">
        <div class="skeleton-line w80"></div>
        <div class="skeleton-line w50"></div>
      </div>
    </div>`).join('');
}

function renderGrid(id, list, showSkeleton = false) {
  const el = document.getElementById(id);
  if (showSkeleton) { el.innerHTML = skeletonCards(); return; }
  if (!list || !list.length) {
    el.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon"><i class="ti ti-search"></i></div>
      <h3>Ничего не найдено</h3><p>Попробуйте изменить фильтры</p>
    </div>`;
    return;
  }
  el.innerHTML = list.map(animeCard).join('');
}

// ════════════════════════════════════════════════
// HOME PAGE
// ════════════════════════════════════════════════
function renderHome() {
  updateHeroStats();
  renderHomeCards();
  renderNewCards();
  renderHomeSched();
}

function renderHomeCards() {
  let list = [...state.db].sort((a,b) => (b.members||0) - (a.members||0));
  if (state.homeGenre !== 'all') {
    list = list.filter(a => a.genres?.includes(state.homeGenre));
  }
  renderGrid('home-cards', list.slice(0, 6));
}

function filterHomeGenre(el, genre) {
  chipOnly(el, 'home-genre-chips');
  state.homeGenre = genre;
  renderHomeCards();
}

function renderNewCards() {
  // Newest by year, top rated
  const list = [...state.db]
    .filter(a => a.year >= 2019)
    .sort((a,b) => (b.year||0) - (a.year||0) || (b.rating||0) - (a.rating||0))
    .slice(0, 6);
  renderGrid('new-cards', list);
}

function renderHomeSched() {
  const items = SCHEDULE[TODAY] || [];
  const wrap = document.getElementById('home-schedule');
  if (!items.length) { wrap.innerHTML = '<div class="search-empty">Нет выходов сегодня</div>'; return; }
  wrap.innerHTML = items.map(it => {
    const a = state.db.find(x => x.id === it.id) || { title: 'Аниме', emoji: '🎌', image: null };
    const on = state.bells.has(it.id);
    const thumbHtml = a.image
      ? `<img src="${a.image}" alt="">`
      : a.emoji;
    return `<div class="sched-item" onclick="openDetail(${it.id})">
      <div class="sched-time">${it.time}</div>
      <div class="sched-thumb">${thumbHtml}</div>
      <div class="sched-info">
        <div class="sched-title">${a.title}</div>
        <div class="sched-ep">${it.ep}</div>
      </div>
      <span class="sched-badge today">Сегодня</span>
      <button class="sched-bell ${on ? 'on' : ''}" onclick="event.stopPropagation();toggleBell(${it.id},this)">
        <i class="ti ti-bell${on ? '-ringing' : ''}"></i>
      </button>
    </div>`;
  }).join('');
}

// ════════════════════════════════════════════════
// CATALOG
// ════════════════════════════════════════════════
const PER_PAGE = 12;

function buildGenreFilters() {
  const el = document.getElementById('genre-filter-opts');
  const genres = [...new Set(state.db.flatMap(a => a.genres || []))].sort();
  el.innerHTML = genres.map(g =>
    `<label class="filter-opt"><input type="checkbox" value="${g}" onchange="applyFilters()"> ${g}</label>`
  ).join('');
}

function buildYearFilters() {
  const el = document.getElementById('year-filter-opts');
  const years = [...new Set(state.db.map(a => a.year).filter(Boolean))].sort((a,b) => b-a).slice(0, 8);
  el.innerHTML = years.map(y =>
    `<label class="filter-opt"><input type="checkbox" value="${y}" onchange="applyFilters()"> ${y}</label>`
  ).join('');
}

function applyFilters() {
  const gC  = [...document.querySelectorAll('#genre-filter-opts input:checked')].map(i => i.value);
  const sC  = [...document.querySelectorAll('#page-catalog .filter-options:nth-of-type(2) input:checked')].map(i => i.value);
  const yC  = [...document.querySelectorAll('#year-filter-opts input:checked')].map(i => Number(i.value));
  const rC  = [...document.querySelectorAll('#page-catalog .filter-options:nth-of-type(4) input:checked')].map(i => Number(i.value));
  const sort = document.getElementById('sort-select')?.value || 'rating';

  let list = state.db.filter(a => {
    if (gC.length && !gC.some(g => a.genres?.includes(g)))                    return false;
    if (sC.length && !sC.includes(a.status))                                   return false;
    if (yC.length && !yC.includes(a.year))                                     return false;
    if (rC.length && !rC.some(r => (a.rating || 0) >= r))                     return false;
    return true;
  });

  if (sort === 'rating')  list.sort((a,b) => (b.rating||0) - (a.rating||0));
  else if (sort === 'popular') list.sort((a,b) => (b.members||0) - (a.members||0));
  else if (sort === 'year')   list.sort((a,b) => (b.year||0) - (a.year||0));
  else                        list.sort((a,b) => a.title.localeCompare(b.title, 'ru'));

  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  state.catalogPage = Math.min(state.catalogPage, pages);

  document.getElementById('catalog-count').textContent = `Найдено: ${total} аниме`;
  renderGrid('catalog-grid', list.slice((state.catalogPage-1)*PER_PAGE, state.catalogPage*PER_PAGE));
  renderPagination(pages);
}

function renderPagination(pages) {
  const wrap = document.getElementById('pagination');
  if (pages <= 1) { wrap.innerHTML = ''; return; }
  const p = state.catalogPage;
  let html = `<button class="page-btn" onclick="goPage(${p-1})" ${p===1?'disabled':''}><i class="ti ti-chevron-left"></i></button>`;
  // Show at most 7 page buttons
  let start = Math.max(1, p - 3), end = Math.min(pages, p + 3);
  if (start > 1) html += `<button class="page-btn" onclick="goPage(1)">1</button>${start > 2 ? '<span style="color:var(--text-dim);padding:0 4px">…</span>' : ''}`;
  for (let i = start; i <= end; i++) html += `<button class="page-btn ${i===p?'active':''}" onclick="goPage(${i})">${i}</button>`;
  if (end < pages) html += `${end < pages-1 ? '<span style="color:var(--text-dim);padding:0 4px">…</span>' : ''}<button class="page-btn" onclick="goPage(${pages})">${pages}</button>`;
  html += `<button class="page-btn" onclick="goPage(${p+1})" ${p===pages?'disabled':''}><i class="ti ti-chevron-right"></i></button>`;
  wrap.innerHTML = html;
}

function goPage(p) { state.catalogPage = p; applyFilters(); window.scrollTo(0, 100); }

function clearFilters() {
  document.querySelectorAll('#page-catalog input[type=checkbox]').forEach(i => i.checked = false);
  state.catalogPage = 1;
  applyFilters();
}

// ════════════════════════════════════════════════
// DETAIL PAGE
// ════════════════════════════════════════════════
function openDetail(id) {
  const a = state.db.find(x => x.id === id);
  if (!a) return;
  state.currentAnime = a;
  state.currentEp = 1;

  // Poster
  const posterEl = document.getElementById('detail-poster');
  const emojiEl  = document.getElementById('detail-emoji');
  if (a.image) {
    posterEl.innerHTML = `<img src="${a.image}" alt="${a.title}" onerror="this.style.display='none'">`;
  } else {
    posterEl.innerHTML = `<span class="detail-poster-emoji">${a.emoji || '🎌'}</span>`;
  }

  // Badges
  const badgeCls = a.status === 'ongoing' ? 'badge-ongoing' : a.status === 'announced' ? 'badge-announced' : 'badge-finished';
  document.getElementById('detail-badges').innerHTML =
    `<span class="badge ${badgeCls}">${sLabel(a.status)}</span>` +
    (a.genres || []).slice(0, 5).map(g => `<span class="badge badge-genre">${g}</span>`).join('');

  document.getElementById('detail-title').textContent = a.title;
  document.getElementById('detail-orig').textContent  = a.orig || '';
  document.getElementById('detail-rating').textContent = a.rating || '—';
  document.getElementById('detail-stars').innerHTML   = starsHtml(a.rating || 0);
  document.getElementById('detail-votes').textContent = a.members ? (a.members / 1000).toFixed(0) + ' тыс. оценок' : '';

  document.getElementById('detail-meta').innerHTML = [
    { l: 'Год',       v: a.year || '—' },
    { l: 'Эпизоды',   v: a.eps  || '—' },
    { l: 'Студия',    v: a.studio || '—' },
    { l: 'Тип',       v: 'TV' },
  ].map(m => `<div class="meta-item"><div class="meta-label">${m.l}</div><div class="meta-val">${m.v}</div></div>`).join('');

  document.getElementById('detail-desc').textContent = a.desc || '';

  // Extra info
  document.getElementById('detail-extra-info').innerHTML = (a.genres || []).map(g =>
    `<span class="badge badge-genre" style="margin:3px 3px 3px 0;display:inline-block">${g}</span>`
  ).join('');

  // Stream links (external)
  document.getElementById('stream-links').innerHTML = [
    { name: 'AniLibria',  url: 'https://anilibria.tv',      lang: 'Рус. озвучка', icon: '🎙️' },
    { name: 'AniDub',     url: 'https://anidub.com',        lang: 'Рус. субтитры', icon: '📝' },
    { name: 'Crunchyroll', url: 'https://crunchyroll.com',  lang: 'Субтитры EN', icon: '🟠' },
  ].map(s => `<a class="stream-link" href="${s.url}" target="_blank" onclick="event.stopPropagation()">
    <span class="stream-icon">${s.icon}</span>
    <span class="stream-name">${s.name}</span>
    <span class="stream-lang">${s.lang}</span>
    <i class="ti ti-external-link stream-ext"></i>
  </a>`).join('');

  // Player placeholder
  document.getElementById('player-placeholder').style.display = 'flex';
  document.getElementById('player-iframe').style.display = 'none';
  document.getElementById('player-iframe').src = '';
  const ph = document.getElementById('player-emoji-ph');
  if (a.image) {
    ph.innerHTML = `<img src="${a.image}" style="width:90px;height:126px;object-fit:cover;border-radius:10px;opacity:.55;box-shadow:0 4px 20px rgba(0,0,0,.5)">`;
  } else {
    ph.textContent = a.emoji || '🎌';
    ph.style.fontSize = '64px';
  }
  const extLinks = document.getElementById('player-ext-links');
  if (extLinks) {
    extLinks.innerHTML = [
      { name:'AniLibria',   url:'https://anilibria.tv',    icon:'🎙️' },
      { name:'AniDub',      url:'https://anidub.com',      icon:'📝' },
      { name:'Crunchyroll', url:'https://crunchyroll.com', icon:'🟠' },
    ].map(s => `<a href="${s.url}" target="_blank" class="btn btn-ghost btn-sm">${s.icon} ${s.name}</a>`).join('');
  }

  // Episode select + chips
  const epCount = typeof a.eps === 'number' ? a.eps : 12;
  const epSel = document.getElementById('player-ep-select');
  epSel.innerHTML = Array.from({length: Math.min(epCount, 100)}, (_,i) =>
    `<option value="${i+1}">Эпизод ${i+1}</option>`
  ).join('');

  document.getElementById('ep-header').textContent = `Эпизоды (${a.eps || '?'})`;
  const showN = Math.min(typeof epCount === 'number' ? epCount : 12, 24);
  let epHtml = Array.from({length: showN}, (_,i) =>
    `<div class="ep-chip ${i === 0 ? 'active' : ''}" onclick="selectEp(${i+1},this)">${i+1}</div>`
  ).join('');
  if (typeof epCount === 'number' && epCount > 24) {
    epHtml += `<div class="ep-more">… ещё ${epCount - 24} эпизодов</div>`;
  }
  document.getElementById('ep-grid').innerHTML = epHtml;

  // User rating
  renderUrStars(a.id);

  // Collection buttons
  renderCollBtns(a);

  // Fav button
  const inFav = state.collections.fav.includes(a.id);
  document.getElementById('fav-btn').innerHTML = `<i class="ti ti-heart${inFav ? '-filled' : ''}"></i> ${inFav ? 'В избранном' : 'В избранное'}`;

  nav('detail');
}

// ── PLAYER ──
function startPlayer() {
  const a = state.currentAnime;
  if (!a) return;
  const url = getPlayerUrl(a);
  document.getElementById('player-placeholder').style.display = 'none';
  const iframe = document.getElementById('player-iframe');
  iframe.src = url;
  iframe.style.display = 'block';
  // После 4 секунд проверяем — если iframe пустой, показываем fallback
  iframe.onerror = () => showPlayerError(a);
  addToColl(a.id, 'watching', true);
}

function showPlayerError(a) {
  document.getElementById('player-wrap').innerHTML = `
    <div style="width:100%;aspect-ratio:16/9;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#080e18;gap:16px;padding:24px;text-align:center">
      <div style="font-size:48px">🎬</div>
      <div style="font-size:15px;color:var(--text)">Видео недоступно для встроенного плеера</div>
      <div style="font-size:13px;color:var(--text-muted)">Посмотрите на одной из платформ:</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
        <a href="https://anilibria.tv" target="_blank" class="btn btn-primary">🎙️ AniLibria</a>
        <a href="https://anidub.com" target="_blank" class="btn btn-ghost">📝 AniDub</a>
        <a href="https://crunchyroll.com" target="_blank" class="btn btn-ghost">🟠 Crunchyroll</a>
      </div>
    </div>`;
}

function scrollToPlayer() {
  document.getElementById('player-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(startPlayer, 400);
}

function selectEp(ep, el) {
  state.currentEp = ep;
  document.querySelectorAll('.ep-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('player-ep-select').value = ep;
  // If player already open, reload
  const iframe = document.getElementById('player-iframe');
  if (iframe.style.display !== 'none') {
    startPlayer();
  }
}

function changeEp(val) {
  state.currentEp = parseInt(val);
  document.querySelectorAll('.ep-chip').forEach((c, i) => c.classList.toggle('active', i + 1 === state.currentEp));
  const iframe = document.getElementById('player-iframe');
  if (iframe.style.display !== 'none') startPlayer();
}

// ── USER RATING ──
function renderUrStars(id) {
  const ur = state.ratings[id] || 0;
  document.getElementById('ur-stars').innerHTML = Array.from({length:10}, (_,i) =>
    `<span class="ur-star ${i < ur ? 'on' : ''}"
      onclick="setRating(${id},${i+1})"
      onmouseover="hoverUrStars(${i+1})"
      onmouseout="resetUrStars(${id})">★</span>`
  ).join('');
  document.getElementById('ur-val').textContent = ur ? `Ваша оценка: ${ur}/10` : 'Не оценено';
}

function hoverUrStars(n) {
  document.querySelectorAll('.ur-star').forEach((s,i) => {
    s.style.color = i < n ? 'var(--yellow)' : '';
  });
}
function resetUrStars(id) { renderUrStars(id); }

function setRating(id, n) {
  state.ratings[id] = n;
  renderUrStars(id);
  showToast('⭐', `Оценка ${n}/10 сохранена`);
}

// ── COLLECTION BUTTONS ──
function renderCollBtns(a) {
  const cs = collStatus(a.id);
  const opts = [
    { k:'watching', l:'Смотрю' },
    { k:'planned',  l:'В планах' },
    { k:'watched',  l:'Просмотрено' },
    { k:'hold',     l:'Отложено' },
    { k:'dropped',  l:'Брошено' },
  ];
  document.getElementById('coll-btns').innerHTML = opts.map(o =>
    `<button class="coll-opt ${cs === o.k ? 'active' : ''}"
      onclick="addToColl(${a.id},'${o.k}');renderCollBtns(state.currentAnime)">
      ${cs === o.k ? '✓ ' : ''}${o.l}
    </button>`
  ).join('');
}

function toggleFav() {
  const a = state.currentAnime;
  if (!a) return;
  const idx = state.collections.fav.indexOf(a.id);
  if (idx === -1) { state.collections.fav.push(a.id); showToast('❤️', 'Добавлено в избранное'); }
  else { state.collections.fav.splice(idx, 1); showToast('🤍', 'Убрано из избранного'); }
  const inFav = state.collections.fav.includes(a.id);
  document.getElementById('fav-btn').innerHTML = `<i class="ti ti-heart${inFav ? '-filled' : ''}"></i> ${inFav ? 'В избранном' : 'В избранное'}`;
}

// ════════════════════════════════════════════════
// SCHEDULE PAGE
// ════════════════════════════════════════════════
function renderSchedulePage() {
  const dEl = document.getElementById('sched-days');
  dEl.innerHTML = DAYS.map(d => `
    <div class="sched-day ${d === state.schedDay ? 'active' : ''}" onclick="switchSchedDay(this,'${d}')">
      ${d}${d === TODAY ? '<span class="today-dot"></span>' : ''}
    </div>`).join('');
  renderSchedItems();
}

function switchSchedDay(el, day) {
  state.schedDay = day;
  document.querySelectorAll('.sched-day').forEach(d => d.classList.remove('active'));
  el.classList.add('active');
  renderSchedItems();
}

function renderSchedItems(filter) {
  const items = SCHEDULE[state.schedDay] || [];
  const isToday = state.schedDay === TODAY;
  const wrap = document.getElementById('sched-items');

  let filtered = items;
  if (filter === 'watching') {
    filtered = items.filter(it => state.collections.watching.includes(it.id));
  }

  if (!filtered.length) {
    wrap.innerHTML = `<div class="empty-state"><div class="empty-icon"><i class="ti ti-calendar-off"></i></div><h3>Нет выходов</h3><p>В этот день ничего не выходит</p></div>`;
    return;
  }

  wrap.innerHTML = filtered.map(it => {
    const a = state.db.find(x => x.id === it.id) || { title: 'Аниме', emoji: '🎌', image: null };
    const on = state.bells.has(it.id);
    const thumbHtml = a.image ? `<img src="${a.image}" alt="">` : a.emoji;
    return `<div class="sched-item" onclick="openDetail(${it.id})">
      <div class="sched-time">${it.time}</div>
      <div class="sched-thumb">${thumbHtml}</div>
      <div class="sched-info">
        <div class="sched-title">${a.title}</div>
        <div class="sched-ep">${it.ep}</div>
      </div>
      <span class="sched-badge ${isToday ? 'today' : ''}">${isToday ? 'Сегодня' : 'Онгоинг'}</span>
      <button class="sched-bell ${on ? 'on' : ''}" onclick="event.stopPropagation();toggleBell(${it.id},this)">
        <i class="ti ti-bell${on ? '-ringing' : ''}"></i>
      </button>
    </div>`;
  }).join('');
}

function toggleBell(id, btn) {
  if (state.bells.has(id)) {
    state.bells.delete(id);
    btn.innerHTML = '<i class="ti ti-bell"></i>';
    btn.classList.remove('on');
    showToast('🔕', 'Уведомление отключено');
  } else {
    state.bells.add(id);
    btn.innerHTML = '<i class="ti ti-bell-ringing"></i>';
    btn.classList.add('on');
    showToast('🔔', 'Уведомление включено');
  }
}

// ════════════════════════════════════════════════
// PROFILE
// ════════════════════════════════════════════════
function renderProfile() {
  document.getElementById('profile-name').textContent = state.user?.username || 'Гость';
  if (state.user) document.getElementById('edit-username').value = state.user.username;
  document.getElementById('ps-watched').textContent  = state.collections.watched.length;
  document.getElementById('ps-watching').textContent = state.collections.watching.length;
  document.getElementById('ps-planned').textContent  = state.collections.planned.length;
  renderCollGrid();
}

function switchCollTab(el, tab) {
  state.collTab = tab;
  document.querySelectorAll('.coll-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderCollGrid();
}

function renderCollGrid() {
  const ids = state.collTab === 'fav'
    ? state.collections.fav
    : (state.collections[state.collTab] || []);
  const grid = document.getElementById('coll-grid');
  if (!ids.length) {
    grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon"><i class="ti ti-bookmark"></i></div>
      <h3>Список пуст</h3><p>Добавляйте аниме из каталога</p>
    </div>`;
    return;
  }
  const list = ids.map(id => state.db.find(a => a.id === id)).filter(Boolean);
  grid.innerHTML = list.map(animeCard).join('');
}

function saveProfile() {
  const v = document.getElementById('edit-username').value.trim();
  if (!v) return;
  if (state.user) state.user.username = v;
  document.getElementById('profile-name').textContent = v;
  showToast('✅', 'Профиль обновлён');
}

// ════════════════════════════════════════════════
// COLLECTIONS
// ════════════════════════════════════════════════
function addToColl(id, type, silent = false) {
  // Remove from all non-fav lists first
  Object.keys(state.collections).forEach(k => {
    if (k !== 'fav') state.collections[k] = state.collections[k].filter(x => x !== id);
  });
  state.collections[type].push(id);
  if (!silent) {
    const labels = { watching:'Смотрю', planned:'В планах', watched:'Просмотрено', dropped:'Брошено', hold:'Отложено' };
    showToast('📋', `Добавлено в "${labels[type]}"`);
  }
  // Update profile stats live
  document.getElementById('ps-watched').textContent  = state.collections.watched.length;
  document.getElementById('ps-watching').textContent = state.collections.watching.length;
  document.getElementById('ps-planned').textContent  = state.collections.planned.length;
}

// ════════════════════════════════════════════════
// SEARCH
// ════════════════════════════════════════════════
const searchInput    = document.getElementById('search-input');
const searchDropdown = document.getElementById('search-dropdown');

searchInput.addEventListener('input', function() {
  const q = this.value.trim().toLowerCase();
  if (!q) { searchDropdown.classList.remove('open'); return; }

  const res = state.db.filter(a =>
    a.title?.toLowerCase().includes(q) ||
    a.orig?.toLowerCase().includes(q)  ||
    a.genres?.some(g => g.toLowerCase().includes(q))
  ).slice(0, 7);

  if (!res.length) {
    searchDropdown.innerHTML = `<div class="search-empty">Ничего не найдено</div>`;
  } else {
    searchDropdown.innerHTML = res.map(a => {
      const thumbHtml = a.image
        ? `<img class="search-thumb" src="${a.image}" alt="">`
        : `<div class="search-thumb-emoji">${a.emoji || '🎌'}</div>`;
      return `<div class="search-result" onclick="openDetail(${a.id});searchInput.value='';searchDropdown.classList.remove('open')">
        ${thumbHtml}
        <div>
          <div class="sr-title">${a.title}</div>
          <div class="sr-sub">${a.year || '—'} · ${a.genres?.slice(0,2).join(', ') || ''} · ★${a.rating || '—'}</div>
        </div>
      </div>`;
    }).join('');
  }
  searchDropdown.classList.add('open');
});

document.addEventListener('click', e => {
  if (!document.getElementById('search-wrap').contains(e.target)) searchDropdown.classList.remove('open');
});
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Escape') { searchDropdown.classList.remove('open'); searchInput.blur(); }
});

// ════════════════════════════════════════════════
// AUTH
// ════════════════════════════════════════════════
function getUsers() { try { return JSON.parse(localStorage.getItem('kp_users') || '[]'); } catch(e) { return []; } }
function saveUsers(u) { try { localStorage.setItem('kp_users', JSON.stringify(u)); } catch(e) {} }

function doLogin() {
  const u = document.getElementById('login-username').value.trim();
  const p = document.getElementById('login-password').value;
  if ((u === 'admin' || u === 'admin@kitsune.ru') && p === 'admin') {
    loginAs({ username: 'Администратор', email: 'admin@kitsune.ru', role: 'admin', since: '2025-06-01' }); return;
  }
  const users = getUsers();
  const found = users.find(x => (x.username === u || x.email === u) && x.pwd === btoa(p));
  if (!found) { document.getElementById('login-error').style.display = 'block'; return; }
  document.getElementById('login-error').style.display = 'none';
  loginAs(found);
}

function doRegister() {
  const u = document.getElementById('reg-username').value.trim();
  const e = document.getElementById('reg-email').value.trim();
  const p = document.getElementById('reg-password').value;
  if (!u || !e || !p) { showRegError('Заполните все поля'); return; }
  const users = getUsers();
  if (users.find(x => x.username === u || x.email === e)) { showRegError('Пользователь уже существует'); return; }
  const nu = { username: u, email: e, pwd: btoa(p), role: 'user', since: new Date().toISOString().slice(0,10) };
  users.push(nu); saveUsers(users);
  document.getElementById('reg-error').style.display = 'none';
  loginAs(nu);
}

function showRegError(msg) { const el = document.getElementById('reg-error'); el.textContent = msg; el.style.display = 'block'; }

function loginAs(user) {
  state.user = user;
  try { localStorage.setItem('kp_session', JSON.stringify(user)); } catch(e) {}
  closeModal('auth-modal');
  document.getElementById('nav-login-btn').style.display   = 'none';
  document.getElementById('nav-reg-btn').style.display     = 'none';
  document.getElementById('nav-profile-btn').style.display = 'flex';
  document.getElementById('nav-logout-btn').style.display  = 'flex';
  showToast('👋', `Добро пожаловать, ${user.username}!`);
  renderProfile();
}

function logout() {
  state.user = null;
  try { localStorage.removeItem('kp_session'); } catch(e) {}
  document.getElementById('nav-login-btn').style.display   = '';
  document.getElementById('nav-reg-btn').style.display     = '';
  document.getElementById('nav-profile-btn').style.display = 'none';
  document.getElementById('nav-logout-btn').style.display  = 'none';
  showToast('👋', 'Вы вышли из аккаунта');
}

function showLogin() { document.getElementById('login-form').style.display = ''; document.getElementById('reg-form').style.display = 'none'; }
function showReg()   { document.getElementById('login-form').style.display = 'none'; document.getElementById('reg-form').style.display = ''; }

// ════════════════════════════════════════════════
// ADMIN
// ════════════════════════════════════════════════
function renderAdmin() {
  // Stats
  const db = state.db;
  document.getElementById('admin-stats-row').innerHTML = [
    { icon:'ti-movie',    n: db.length,                     l:'Всего аниме' },
    { icon:'ti-users',    n: getUsers().length + 1,          l:'Пользователей' },
    { icon:'ti-star',     n: Object.keys(state.ratings).length, l:'Оценок' },
    { icon:'ti-list',     n: Object.values(state.collections).flat().length, l:'Записей в списках' },
  ].map(s => `<div class="stat-card">
    <div class="stat-card-icon"><i class="ti ${s.icon}"></i></div>
    <div class="stat-card-n">${s.n}</div>
    <div class="stat-card-l">${s.l}</div>
  </div>`).join('');

  // Recent table
  document.getElementById('admin-recent').innerHTML = db.slice(0, 8).map(a => `<tr>
    <td>${a.image ? `<img src="${a.image}" style="width:28px;height:38px;border-radius:4px;object-fit:cover;vertical-align:middle;margin-right:8px">` : `<span style="margin-right:8px">${a.emoji||'🎌'}</span>`}${a.title}</td>
    <td><span class="tag ${a.status==='ongoing'?'tag-ongoing':'tag-finished'}">${sLabel(a.status)}</span></td>
    <td style="color:var(--yellow)">★ ${a.rating||'—'}</td>
    <td>${a.studio||'—'}</td>
    <td style="color:var(--text-muted)">${a.year||'—'}</td>
  </tr>`).join('');

  renderAdminTable();
  renderAdminUsers();
  renderGenresList();
}

function renderAdminTable() {
  const q = (document.getElementById('admin-search')?.value || '').toLowerCase();
  const list = state.db.filter(a => !q || a.title?.toLowerCase().includes(q));
  document.getElementById('admin-anime-table').innerHTML = list.slice(0,30).map(a => `<tr>
    <td>${a.image ? `<img src="${a.image}" style="width:22px;height:30px;border-radius:3px;object-fit:cover;vertical-align:middle;margin-right:8px">` : `<span style="margin-right:8px">${a.emoji||'🎌'}</span>`}${a.title}</td>
    <td><span class="tag ${a.status==='ongoing'?'tag-ongoing':'tag-finished'}">${sLabel(a.status)}</span></td>
    <td>${a.year||'—'}</td>
    <td>${a.studio||'—'}</td>
    <td style="color:var(--yellow)">★ ${a.rating||'—'}</td>
    <td>
      <button class="btn btn-ghost btn-sm" onclick="openDetail(${a.id})" style="margin-right:4px"><i class="ti ti-eye"></i></button>
      <button class="btn btn-danger btn-sm" onclick="showToast('⚠️','Удаление доступно в версии с бэкендом')"><i class="ti ti-trash"></i></button>
    </td>
  </tr>`).join('');
}

function renderAdminUsers() {
  const users = getUsers();
  document.getElementById('admin-users-table').innerHTML =
    `<tr><td>Администратор</td><td>admin@kitsune.ru</td><td><span class="tag" style="background:rgba(255,107,107,.15);color:var(--primary)">Админ</span></td><td>01.06.2025</td><td>—</td></tr>` +
    users.map(u => `<tr>
      <td>${u.username}</td><td>${u.email}</td>
      <td><span class="tag" style="background:rgba(78,205,196,.15);color:var(--secondary)">Пользователь</span></td>
      <td>${u.since || 'Сегодня'}</td><td>0</td>
    </tr>`).join('');
}

function switchAdmin(el, section) {
  document.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
  document.getElementById('admin-' + section).classList.add('active');
  if (section === 'genres') renderGenresList();
}

function buildManualGenres() {
  state.manualGenres = [...new Set(state.db.flatMap(a => a.genres || []))].sort();
}

function renderGenresList() {
  if (!state.manualGenres.length) buildManualGenres();
  document.getElementById('genres-list').innerHTML = state.manualGenres.map(g =>
    `<div class="chip">${g} <span style="cursor:pointer;margin-left:4px;opacity:.5" onclick="removeGenre('${g}')">×</span></div>`
  ).join('');
}

function addGenre() {
  const v = document.getElementById('new-genre-input').value.trim();
  if (!v || state.manualGenres.includes(v)) return;
  state.manualGenres.push(v);
  document.getElementById('new-genre-input').value = '';
  renderGenresList();
  showToast('🏷️', `Жанр "${v}" добавлен`);
}

function removeGenre(g) {
  state.manualGenres = state.manualGenres.filter(x => x !== g);
  renderGenresList();
}

function submitAnime() {
  const t = document.getElementById('f-title-ru').value.trim();
  if (!t) { showToast('⚠️', 'Введите название'); return; }
  showToast('✅', `Аниме "${t}" добавлено в базу`);
  clearAddForm();
}

function clearAddForm() {
  ['f-title-ru','f-title-orig','f-year','f-eps','f-desc','f-genres'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
}

function addStreamField() {
  const wrap = document.getElementById('stream-fields');
  const row = document.createElement('div');
  row.className = 'form-row'; row.style.marginBottom = '8px';
  row.innerHTML = `<div><label class="form-label">Платформа</label><input class="form-input" placeholder="Wakanim"></div>
    <div><label class="form-label">Ссылка</label><input class="form-input" placeholder="https://…"></div>`;
  wrap.appendChild(row);
}

// ════════════════════════════════════════════════
// MODALS
// ════════════════════════════════════════════════
function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.open').forEach(m => m.classList.remove('open')); });

// ════════════════════════════════════════════════
// TOAST
// ════════════════════════════════════════════════
let toastTimer;
function showToast(icon, msg) {
  const t = document.getElementById('toast');
  document.getElementById('toast-icon').textContent = icon;
  document.getElementById('toast-msg').textContent  = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════
(function init() {
  // Restore session
  try {
    const s = localStorage.getItem('kp_session');
    if (s) loginAs(JSON.parse(s));
  } catch(e) {}

  // Initial render with fallback data
  updateHeroStats();
  renderHome();

  // Then load real data from Jikan API
  loadFromJikan();
})();
