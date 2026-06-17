/* ════════════════════════════════════════
   KitsunePlay — app.js
   Главный файл: логика, данные, API
════════════════════════════════════════ */
// Автоматически определяем адрес бэкенда:
// адрес бэкенда — автоматически определяется по домену
const API_BASE = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000'
  : 'https://web-production-fe425.up.railway.app'

// ── РАСПИСАНИЕ — редактируется в админ-панели, хранится в браузере ──
const DAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
// Определяем сегодняшний день динамически
const TODAY = DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];

function getSchedule() {
  try { return JSON.parse(localStorage.getItem('kp_schedule') || 'null'); } catch { return null; }
}
function saveSchedule(s) {
  localStorage.setItem('kp_schedule', JSON.stringify(s));
}

// Дефолтное расписание — заполняется один раз если пусто
const DEFAULT_SCHEDULE = {
  'Пн': [{time:'18:00',id:11061,ep:'Сез. 4 · Сер. 87'},{time:'21:00',id:40748,ep:'Сез. 3 · Сер. 9'},{time:'23:00',id:4181,ep:'Сез. 5 · Сер. 136'}],
  'Вт': [{time:'17:30',id:21,ep:'Сез. 12 · Сер. 1104'},{time:'20:00',id:9253,ep:'Сез. 1 · Сер. 18'}],
  'Ср': [{time:'19:00',id:136430,ep:'Сез. 3 · Сер. 12'},{time:'22:00',id:38000,ep:'Сез. 2 · Сер. 10'}],
  'Чт': [{time:'17:30',id:16498,ep:'Сез. 4 · Сер. 8'},{time:'20:00',id:31964,ep:'Сез. 7 · Сер. 5'},{time:'23:00',id:5114,ep:'Сез. 1 · Сер. 30'}],
  'Пт': [{time:'18:00',id:1535,ep:'Сез. 1 · Сер. 25'},{time:'21:30',id:22319,ep:'Сез. 4 · Сер. 8'}],
  'Сб': [{time:'17:00',id:4181,ep:'Сез. 3 · Сер. 58'},{time:'20:00',id:38000,ep:'Сез. 2 · Сер. 11'},{time:'23:00',id:136430,ep:'Сез. 3 · Сер. 13'}],
  'Вс': [{time:'16:00',id:21,ep:'Сез. 12 · Сер. 1105'},{time:'19:30',id:11061,ep:'Сез. 4 · Сер. 88'},{time:'22:00',id:31964,ep:'Сез. 7 · Сер. 6'}],
};

// ── ПЛЕЕР — ссылки на стриминговые платформы ──
// Для полноценного плеера нужен Kodik (kodik.info) — бесплатно по заявке
// Ссылки на страницы аниме (для кнопок "Смотреть")
const ANIMEGO_SLUGS = {
  11061: 'ataka-titanov',
  16498: 'klinok-rassekayushchiy-demonov',
  31964: 'moya-geroiskaya-akademiya',
  1535:  'tetrad-smerti',
  5114:  'stalnoj-alhimik-bratstvo',
  136430:'magicheskaya-bitva',
  9253:  'gates-shtejna',
  22319: 'tokijskij-gul',
  38000: 'saga-o-vinkande',
  40748: 'doktor-stoun',
  21:    'van-pis',
  4181:  'ohothik-ohothik',
};

// AniLibria — главная платформа с русской озвучкой
const ANILIBRIA_IDS = {
  11061: 'Ataka-Titanov',
  16498: 'Klinok-Rassekayuschiy-Demonov',
  31964: 'Moya-Geroiskaya-Akademiya',
  1535:  'Tetrad-Smerti',
  5114:  'Stalnoj-Alhimik-Bratstvo',
  136430:'Magicheskaya-Bitva',
  9253:  'Steins-Gate',
  22319: 'Tokijskij-Gul',
  38000: 'Sega-o-Vinklade',
  40748: 'Dr-Stone',
  21:    'Van-Pis',
  4181:  'Hunter-x-Hunter-2011',
};

function getPlayerUrl(a) {
  if (a.trailer_url) return a.trailer_url;
  // ссылка на страницу аниме на AniLibria
  const slug = ANILIBRIA_IDS[a.id];
  if (slug) {
    return `https://www.anilibria.tv/release/${slug}.html`;
  }
  return null;
}

// ── FALLBACK ДАННЫЕ ──
const FALLBACK = [
  {id:11061,title:'Атака Титанов',rating:9.0,year:2013,eps:25,status:'finished',studio:'Wit Studio',genres:['Action','Drama','Fantasy'],
   desc:'Столетиями человечество живёт за гигантскими стенами, спасаясь от титанов — огромных существ, пожирающих людей. Когда сверхмощный Колоссальный Титан разрушает ворота, молодой Эрен Йегер теряет мать и клянётся истребить всех титанов до единого. Он вступает в Разведывательный Корпус — элитный отряд, который сражается с титанами за стенами. Но чем дальше Эрен заходит в своей борьбе, тем больше тайн открывается о природе титанов и истинной истории человечества.',
   image:'https://cdn.myanimelist.net/images/anime/10/47347l.jpg',members:3500000,emoji:'🔱'},
  {id:16498,title:'Клинок, рассекающий демонов',rating:8.7,year:2019,eps:26,status:'ongoing',studio:'Ufotable',genres:['Action','Fantasy','Historical'],
   desc:'Япония эпохи Тайсё. Тандзиро Камадо — добрый юноша, который продаёт уголь, чтобы прокормить семью. Вернувшись домой однажды вечером, он обнаруживает, что вся его семья вырезана демоном, а единственная выжившая сестра Незуко превращена в демона. Тандзиро вступает в ряды Корпуса охотников на демонов, чтобы найти способ вернуть Незуко человеческий облик и отомстить за семью. Аниме поражает невероятной анимацией студии Ufotable и глубокими персонажами.',
   image:'https://cdn.myanimelist.net/images/anime/1286/99889l.jpg',members:2900000,emoji:'⚔️'},
  {id:31964,title:'Моя геройская академия',rating:8.2,year:2016,eps:113,status:'ongoing',studio:'BONES',genres:['Action','Comedy','School'],
   desc:'В мире, где 80% людей рождаются со сверхспособностями — Причудами, — мальчик Изуку Мидория появляется на свет совершенно обычным человеком. Несмотря на это, он мечтает стать героем — как его кумир Всемогущий, величайший герой планеты. Судьба делает невероятный поворот: Всемогущий выбирает Изуку своим преемником и передаёт ему свою силу. Теперь Изуку поступает в Академию героев, где ему предстоит пройти суровую подготовку и доказать, что настоящий герой — это состояние души, а не врождённый дар.',
   image:'https://cdn.myanimelist.net/images/anime/10/78745l.jpg',members:2100000,emoji:'🌸'},
  {id:1535,title:'Тетрадь смерти',rating:9.0,year:2006,eps:37,status:'finished',studio:'Madhouse',genres:['Mystery','Psychological','Thriller'],
   desc:'Блестящий старшеклассник Лайт Ягами случайно находит тетрадь смерти — мистический предмет, позволяющий убить любого человека, просто написав его имя. За тетрадью стоит бог смерти Рюк, которому стало скучно в своём мире. Лайт решает использовать тетрадь, чтобы очистить мир от преступников и стать богом нового идеального мира. Но за ним начинает охоту таинственный гений-детектив Л. Начинается интеллектуальное противостояние двух величайших умов, каждый из которых считает себя правым.',
   image:'https://cdn.myanimelist.net/images/anime/9/9453l.jpg',members:3800000,emoji:'📓'},
  {id:5114,title:'Стальной алхимик: Братство',rating:9.1,year:2009,eps:64,status:'finished',studio:'BONES',genres:['Action','Adventure','Drama','Fantasy'],
   desc:'В мире, где алхимия является наукой и искусством, братья Эдвард и Альфонс Элрик нарушают главный запрет — пытаются воскресить умершую мать. Ритуал оборачивается катастрофой: Эдвард теряет руку и ногу, а тело Альфонса поглощает тьма — его душу удаётся привязать лишь к металлическому доспеху. Чтобы вернуть потерянное, братья ищут Философский камень — легендарный артефакт, способный обойти законы алхимии. Но чем глубже они погружаются в поиски, тем страшнее тайны, которые им открываются.',
   image:'https://cdn.myanimelist.net/images/anime/1223/96541l.jpg',members:3300000,emoji:'⚗️'},
  {id:136430,title:'Магическая битва',rating:8.6,year:2020,eps:24,status:'ongoing',studio:'MAPPA',genres:['Action','Fantasy','School'],
   desc:'Юдзи Итадори — физически одарённый старшеклассник, который ради спасения друзей проглатывает палец Риодана Гето — одного из сильнейших проклятых духов в истории. Тем самым он становится сосудом для чудовищной сущности. Вместо немедленной казни Юдзи получает задание: найти и поглотить все пальцы Риодана, после чего будет казнён. Он поступает в Токийскую школу магии, где учится сражаться с проклятыми духами бок о бок с эксцентричными, но невероятно сильными наставниками.',
   image:'https://cdn.myanimelist.net/images/anime/1171/109222l.jpg',members:2200000,emoji:'🌙'},
  {id:9253,title:'Врата Штейна',rating:9.1,year:2011,eps:24,status:'finished',studio:'White Fox',genres:['Drama','Sci-Fi','Thriller'],
   desc:'Ринтаро Окабэ — эксцентричный студент, называющий себя «безумным учёным», — вместе с друзьями случайно изобретает машину времени из микроволновки и телефона. Устройство позволяет отправлять сообщения в прошлое, меняя ход событий. Поначалу это кажется увлекательной игрой, но вскоре Окабэ обнаруживает, что за изобретением охотится могущественная организация SERN. Каждое изменение прошлого влечёт непредсказуемые последствия, и герою придётся раз за разом переживать трагедии, чтобы найти единственную временну́ю линию, где все останутся живы.',
   image:'https://cdn.myanimelist.net/images/anime/5/73199l.jpg',members:2400000,emoji:'⏰'},
  {id:22319,title:'Токийский гуль',rating:7.9,year:2014,eps:12,status:'finished',studio:'Pierrot',genres:['Action','Horror','Mystery'],
   desc:'Студент Кэн Канэки едва не погибает от рук девушки-гуля — существа, питающегося человеческой плотью. После трансплантации органов погибшей гули он сам превращается в полугуля: вынужден питаться людьми, но сохраняет человеческое сознание. Канэки оказывается между двух миров — люди считают его монстром, а гули не доверяют ему как полукровке. Аниме исследует темы идентичности, принадлежности и того, что значит оставаться человеком, когда тебя таковым больше не считают.',
   image:'https://cdn.myanimelist.net/images/anime/5/64449l.jpg',members:1900000,emoji:'👁️'},
  {id:38000,title:'Сага о Винланде',rating:8.7,year:2019,eps:24,status:'finished',studio:'Wit Studio',genres:['Action','Adventure','Drama','Historical'],
   desc:'Скандинавия, начало XI века. Молодой викинг Торфинн вырос на рассказах отца о легендарной земле Винланд — месте без войны и рабства. Когда наёмник Аскеладд убивает его отца, Торфинн примыкает к его отряду, движимый жаждой мести. Годами он совершенствует боевое мастерство, участвует в жестоких сражениях и постепенно теряет себя в ненависти. Аниме — это глубокая история о цикле насилия, поиске смысла жизни и пути от мести к подлинному миру.',
   image:'https://cdn.myanimelist.net/images/anime/1500/103005l.jpg',members:1200000,emoji:'⚡'},
  {id:40748,title:'Доктор Стоун',rating:8.2,year:2019,eps:24,status:'finished',studio:'TMS Entertainment',genres:['Adventure','Comedy','Sci-Fi'],
   desc:'Однажды всё человечество внезапно превращается в каменные статуи. Через несколько тысяч лет гений-учёный Сэнку Исигами освобождается из каменного плена и обнаруживает мир, поглощённый дикой природой. С нуля, опираясь только на знание науки, он начинает восстанавливать цивилизацию — от костра до антибиотиков и радио. Аниме уникально тем, что каждое научное открытие показано детально и достоверно, превращая химию и физику в захватывающее приключение.',
   image:'https://cdn.myanimelist.net/images/anime/1613/102576l.jpg',members:1100000,emoji:'🧪'},
  {id:21,title:'Ван-Пис',rating:8.7,year:1999,eps:1000,status:'ongoing',studio:'Toei Animation',genres:['Action','Adventure','Comedy','Fantasy'],
   desc:'Монки Д. Луффи — жизнерадостный юноша, тело которого стало резиновым после того, как он съел Дьявольский фрукт. Его мечта — найти легендарное сокровище Ван-Пис и стать Королём пиратов. Он собирает разношёрстную команду — фехтовальщика, навигатора, снайпера, повара и других — и отправляется в бесконечное путешествие по Великому морю. За более чем 20 лет аниме создало один из самых богатых вымышленных миров в истории манги, полный уникальных персонажей, островов и тайн.',
   image:'https://cdn.myanimelist.net/images/anime/6/73245l.jpg',members:2800000,emoji:'☠️'},
  {id:4181,title:'Охотник × Охотник',rating:9.0,year:2011,eps:148,status:'finished',studio:'Madhouse',genres:['Action','Adventure','Fantasy'],
   desc:'Двенадцатилетний Гон Фрикс живёт на небольшом острове и мечтает стать Охотником — элитным специалистом с особыми привилегиями — чтобы найти своего отца, бросившего семью ради этого опасного ремесла. На вступительных испытаниях он знакомится с Киллуа — наследником клана убийц, Леорио — мечтающим стать врачом, и Курапикой — последним выжившим из своего клана. Аниме известно продуманной системой боевых способностей «Нэн» и одной из самых тёмных и философски насыщенных арок в жанре.',
   image:'https://cdn.myanimelist.net/images/anime/1337/99013l.jpg',members:2600000,emoji:'🃏'},
];

// ── СЕЗОНЫ — количество серий по сезонам для каждого аниме ──
const SEASONS = {
  // Атака Титанов
  11061: [{n:1,eps:25,year:2013},{n:2,eps:12,year:2017},{n:3,eps:22,year:2018},{n:4,eps:16,year:2020,title:'Финал часть 1'},{n:5,eps:12,year:2022,title:'Финал часть 2'}],
  // Клинок, рассекающий демонов
  16498: [{n:1,eps:26,year:2019},{n:2,eps:18,year:2021,title:'Квартал развлечений'},{n:3,eps:11,year:2023,title:'Деревня кузнецов'},{n:4,eps:8,year:2024,title:'Столица демонов'}],
  // Моя геройская академия
  31964: [{n:1,eps:13,year:2016},{n:2,eps:25,year:2017},{n:3,eps:25,year:2018},{n:4,eps:25,year:2019},{n:5,eps:25,year:2021},{n:6,eps:25,year:2022},{n:7,eps:21,year:2024}],
  // Тетрадь смерти
  1535:  [{n:1,eps:37,year:2006}],
  // Стальной алхимик: Братство
  5114:  [{n:1,eps:64,year:2009}],
  // Магическая битва
  136430:[{n:1,eps:24,year:2020},{n:2,eps:23,year:2023},{n:3,eps:12,year:2024,title:'Скрытые запасы'}],
  // Врата Штейна
  9253:  [{n:1,eps:24,year:2011},{n:2,eps:11,year:2015,title:'0'},{n:3,eps:3,year:2015,title:'Бурный поток OVA'}],
  // Токийский гуль
  22319: [{n:1,eps:12,year:2014},{n:2,eps:12,year:2015,title:'√A'},{n:3,eps:12,year:2018,title:'Re:'},{n:4,eps:12,year:2018,title:'Re: Часть 2'}],
  // Сага о Винланде
  38000: [{n:1,eps:24,year:2019},{n:2,eps:24,year:2023}],
  // Доктор Стоун
  40748: [{n:1,eps:24,year:2019},{n:2,eps:11,year:2021,title:'Каменные войны'},{n:3,eps:22,year:2023,title:'New World'},{n:4,eps:10,year:2024,title:'Science Future'}],
  // Ван-Пис
  21:    [
    {n:1,eps:61,year:1999,title:'Ист Блю'},{n:2,eps:35,year:2000,title:'Алабаста'},
    {n:3,eps:36,year:2001,title:'Небесный остров'},{n:4,eps:34,year:2002,title:'Вотер 7'},
    {n:5,eps:30,year:2004,title:'Эниес Лобби'},{n:6,eps:35,year:2005,title:'Саботи'},
    {n:7,eps:49,year:2007,title:'Маринфорд'},{n:8,eps:50,year:2011,title:'Рыбий остров'},
    {n:9,eps:73,year:2012,title:'Панк-Хазард и Дресс-Роза'},{n:10,eps:69,year:2016,title:'Зоу и Целаж'},
    {n:11,eps:95,year:2018,title:'Вано'},{n:12,eps:40,year:2023,title:'Финальная сага'},
  ],
  // Охотник × Охотник
  4181:  [{n:1,eps:26,year:2011,title:'Экзамен Охотников'},{n:2,eps:26,year:2012,title:'Небесная арена'},{n:3,eps:26,year:2012,title:'Йорк Нью'},{n:4,eps:36,year:2013,title:'Химерные муравьи'},{n:5,eps:34,year:2014,title:'Выборы президента'}],
};

// ── СОСТОЯНИЕ ПРИЛОЖЕНИЯ — все данные хранятся здесь ──
let state = {
  db: [...FALLBACK],
  backendOnline: false,
  usingBackend: false,
  user: null,
  collMap: {},
  ratings: {},
  comments: {},
  bells: new Set(),
  currentAnime: null,
  currentEp: 1,
  currentSeason: 1,
  homeGenre: 'all',
  catalogPage: 1,
  schedDay: TODAY,
  collTab: 'watching',
};

// ════════════════════════════════════════
// API КЛИЕНТ — все запросы к бэкенду
// ════════════════════════════════════════
const api = {
  headers() {
    const h = {'Content-Type':'application/json'};
    const t = localStorage.getItem('kp_token');
    if (t) h['Authorization'] = `Bearer ${t}`;
    return h;
  },
  async get(path) {
    const r = await fetch(API_BASE+path, {headers:this.headers()});
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },
  async post(path, body) {
    const r = await fetch(API_BASE+path, {method:'POST',headers:this.headers(),body:JSON.stringify(body)});
    const d = await r.json();
    if (!r.ok) throw new Error(d.error||`${r.status}`);
    return d;
  },
  async patch(path, body) {
    const r = await fetch(API_BASE+path, {method:'PATCH',headers:this.headers(),body:JSON.stringify(body)});
    const d = await r.json();
    if (!r.ok) throw new Error(d.error||`${r.status}`);
    return d;
  },
  async del(path) {
    const r = await fetch(API_BASE+path, {method:'DELETE',headers:this.headers()});
    if (!r.ok) throw new Error(`${r.status}`);
    return r.json();
  },
};


// ════════════════════════════════════════
// ЛОКАЛЬНОЕ ХРАНИЛИЩЕ — сохраняем данные в браузере
// ════════════════════════════════════════
function saveLocal() {
  try {
    localStorage.setItem('kp_comments', JSON.stringify(state.comments));
    localStorage.setItem('kp_ratings',  JSON.stringify(state.ratings));
    localStorage.setItem('kp_collmap',  JSON.stringify(state.collMap));
    localStorage.setItem('kp_bells',    JSON.stringify([...state.bells]));
  } catch(e) { console.warn('saveLocal:', e); }
}

function loadLocal() {
  try {
    const c = localStorage.getItem('kp_comments');
    const r = localStorage.getItem('kp_ratings');
    const m = localStorage.getItem('kp_collmap');
    const b = localStorage.getItem('kp_bells');
    if (c) state.comments = JSON.parse(c);
    if (r) state.ratings  = JSON.parse(r);
    if (m) state.collMap  = JSON.parse(m);
    if (b) state.bells    = new Set(JSON.parse(b));
  } catch(e) { console.warn('loadLocal:', e); }
}

// ════════════════════════════════════════
// INIT
// ════════════════════════════════════════
async function init() {
  restoreSession();
  loadLocal();      // загружаем данные сохранённые ранее
  updateAuthUI();
  updateProfileStats(); // сразу обновляем счётчики из localStorage

  // Инициализируем расписание
  if (!getSchedule()) saveSchedule(DEFAULT_SCHEDULE);

  // показываем резервные данные пока грузится сервер
  updateHeroStats();
  buildAllFilters();
  renderHome();

  // пробуем подключиться к серверу
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000); // таймаут 8 сек
    const r = await fetch(API_BASE + '/api', {signal: ctrl.signal});
    clearTimeout(timer);
    if (r.ok) {
      state.backendOnline = true;
      setBanner('🟢 Подключено к серверу', 'success');
      await loadFromBackend();      // загружаем аниме с сервера (на русском)
      if (state.user) await syncUserData();
      updateHeroStats(); buildAllFilters(); renderHome();
      return;
    }
  } catch(e) {
    // сервер не ответил — работаем без него
  }

  // Сервер недоступен — тихо работаем с резервными данными
  state.backendOnline = false;
  updateHeroStats(); buildAllFilters(); renderHome();
}

function setBanner(msg, type) {
  const el = document.getElementById('api-banner');
  el.style.display = 'flex';
  el.style.color = type==='success' ? 'var(--secondary)' : type==='warn' ? 'var(--yellow)' : 'var(--text-muted)';
  el.style.borderBottomColor = type==='success' ? 'rgba(78,205,196,.2)' : 'rgba(255,209,102,.2)';
  document.getElementById('api-banner-text').textContent = msg;
  // Скрываем через 4 сек
  setTimeout(() => { el.style.opacity='0'; setTimeout(()=>{ el.style.display='none'; el.style.opacity='1'; },500); }, 4000);
}

// ════════════════════════════════════════
// ЗАГРУЗКА ДАННЫХ
// ════════════════════════════════════════
async function loadFromBackend() {
  try {
    // Грузим все аниме с сервера — они уже на русском
    const data = await api.get('/api/anime?per_page=200&sort=popular');
    if (data.items && data.items.length > 0) {
      state.db = data.items.map(normalizeAnime);
      state.usingBackend = true;
    }
  } catch(e) {
    console.warn('Ошибка загрузки аниме:', e.message);
    // используем резервные данные
  }
}

function normalizeAnime(a) {
  return {
    id: a.id, mal_id: a.mal_id,
    title: a.title,
    rating: a.rating||0, year: a.year, eps: a.episodes,
    status: a.status, studio: a.studio||'',
    genres: a.genres||[], desc: a.description||'',
    image: a.image_url||null, members: a.members||0,
    streams: a.streams||[], trailer_url: a.trailer_url||null,
    emoji: emojiFor(a.genres||[]),
  };
}

async function loadFromJikan() {
  const el = document.getElementById('api-banner');
  el.style.display = 'flex';
  el.style.color = 'var(--secondary)';
  document.getElementById('api-banner-text').textContent = 'Загружаем аниме из MyAnimeList…';
  try {
    const res = [];
    for (const p of [1,2,3]) {
      const r = await fetch(`https://api.jikan.moe/v4/top/anime?page=${p}&limit=25`);
      if (!r.ok) throw new Error('jikan');
      res.push(...(await r.json()).data);
      await new Promise(ok=>setTimeout(ok,500));
    }
    state.db = res.map(a=>({
      id: a.mal_id,
      title: a.title_russian || a.title,
      rating: a.score||0,
      year: a.year||(a.aired?.from?new Date(a.aired.from).getFullYear():null),
      eps: a.episodes||'?',
      status: mapStatus(a.status),
      studio: a.studios?.[0]?.name||'',
      genres: a.genres?.map(g=>g.name)||[],
      desc: a.synopsis||'',
      image: a.images?.jpg?.large_image_url||null,
      members: a.members||0,
      streams: [], trailer_url: a.trailer?.embed_url||null,
      emoji: emojiFor(a.genres?.map(g=>g.name)||[]),
    }));
  } catch {
    console.warn('Jikan недоступен, используем fallback');
  }
  el.style.display = 'none';
  updateHeroStats(); buildAllFilters();
  const pg = document.querySelector('.page.active')?.id?.replace('page-','');
  if (pg==='home') renderHome();
  if (pg==='catalog') applyFilters();
}

function mapStatus(s) {
  if (!s) return 'finished';
  if (s.includes('Airing')) return 'ongoing';
  if (s.includes('Not yet')) return 'announced';
  return 'finished';
}

function emojiFor(genres) {
  if (genres.includes('Horror'))     return '👁️';
  if (genres.includes('Sci-Fi'))     return '🚀';
  if (genres.includes('Historical')) return '⚔️';
  if (genres.includes('Sports'))     return '⚽';
  if (genres.includes('Music'))      return '🎵';
  if (genres.includes('Comedy'))     return '😄';
  if (genres.includes('Romance'))    return '💕';
  if (genres.includes('Fantasy'))    return '✨';
  if (genres.includes('Action'))     return '⚡';
  if (genres.includes('Mystery'))    return '🔍';
  return '🎌';
}

async function syncUserData() {
  if (!state.user || !state.backendOnline) return;
  try {
    const [collData, ratingData] = await Promise.all([
      api.get('/api/collections?per_page=500'),
      api.get('/api/ratings'),
    ]);
    state.collMap = {};
    (collData.items||[]).forEach(c => { state.collMap[c.anime_id] = c.status; });
    state.ratings = {};
    (ratingData||[]).forEach(r => { state.ratings[r.anime_id] = r.score; });
  } catch(e) { console.warn('syncUserData:', e); }
}

// ════════════════════════════════════════
// НАВИГАЦИЯ МЕЖДУ СТРАНИЦАМИ
// ════════════════════════════════════════
let prevPage = 'home';
function nav(page) {
  // Защита: админка только для администраторов
  if (page === 'admin' && state.user?.role !== 'admin') {
    showToast('🔒', 'Доступ только для администраторов');
    return;
  }
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.getElementById('page-'+page).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(l=>l.classList.toggle('active',l.dataset.page===page));
  window.scrollTo(0,0);
  if (page==='home')     renderHome();
  if (page==='catalog')  applyFilters();
  if (page==='schedule') renderSchedulePage();
  if (page==='profile')  renderProfile();
  if (page==='admin')    renderAdmin();
  prevPage = page;
}
document.getElementById('back-btn').onclick = () => nav(prevPage==='detail'?'home':prevPage||'home');

// ════════════════════════════════════════
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ════════════════════════════════════════
function sLabel(s) { return s==='ongoing'?'Онгоинг':s==='announced'?'Анонс':'Завершён'; }
function sClass(s) { return s==='ongoing'?'s-ongoing':s==='announced'?'s-announced':'s-finished'; }
function starsHtml(r) {
  const n=Math.round(r/2);
  return Array.from({length:5},(_,i)=>`<i class="ti ti-star${i<n?'-filled':''}"></i>`).join('');
}
function collStatus(id) { return state.collMap[id]||null; }
function chipOnly(el,gid) {
  document.querySelectorAll(`#${gid} .chip`).forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
}
function updateHeroStats() {
  document.getElementById('hs-count').textContent   = state.db.length;
  document.getElementById('hs-genres').textContent  = new Set(state.db.flatMap(a=>a.genres)).size;
  document.getElementById('hs-studios').textContent = new Set(state.db.map(a=>a.studio).filter(Boolean)).size;
}

// ════════════════════════════════════════
// КАРТОЧКА АНИМЕ — HTML одной карточки
// ════════════════════════════════════════
function animeCard(a, withRemove=false, showCollBtn=true) {
  const cs = collStatus(a.id);
  const poster = a.image
    ? `<img src="${a.image}" alt="${a.title}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
    : '';
  const emoji = `<div class="card-poster-emoji" style="${a.image?'display:none':''}">${a.emoji||'🎌'}</div>`;

  // Кнопка удаления из коллекции — только в профиле
  const removeBtn = withRemove
    ? `<button onclick="event.stopPropagation();removeFromColl(${a.id})"
        style="display:flex;align-items:center;justify-content:center;gap:6px;width:calc(100% - 24px);margin:0 12px 12px;padding:6px;background:none;border:1px solid rgba(255,107,107,.3);border-radius:6px;color:var(--primary);font-size:12px;cursor:pointer">
        <i class="ti ti-trash" style="font-size:12px"></i> Удалить из списка
       </button>` : '';

  // Жанры — всегда видны на карточке
  const genreTags = (a.genres||[]).slice(0,3).map(g =>
    `<span style="font-size:10px;padding:2px 7px;border-radius:4px;background:rgba(255,255,255,.07);color:var(--text-muted)">${g}</span>`
  ).join('');

  return `<div class="anime-card" style="position:relative">
    <div style="cursor:pointer" onclick="openDetail(${a.id})">
      <div class="card-poster">
        ${poster}${emoji}
        <span class="card-rating-badge"><i class="ti ti-star-filled" style="font-size:10px"></i> ${a.rating||'—'}</span>
        <span class="card-status-badge ${sClass(a.status)}">${sLabel(a.status)}</span>
      </div>
      <div class="card-body">
        <div class="card-title">${a.title}</div>
        <div class="card-sub">${a.year||'—'}</div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-top:6px">${genreTags}</div>
      </div>
    </div>
    ${removeBtn}
  </div>`;
}

function skeletons(n=6) {
  return Array.from({length:n},()=>`
    <div class="skeleton-card">
      <div class="skeleton-poster"></div>
      <div class="skeleton-body">
        <div class="skeleton-line w80"></div><div class="skeleton-line w50"></div>
      </div>
    </div>`).join('');
}

function renderGrid(id, list, withRemove=false, showCollBtn=true) {
  const el = document.getElementById(id);
  if (!list?.length) {
    el.innerHTML=`<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon"><i class="ti ti-search"></i></div>
      <h3>Ничего не найдено</h3><p>Попробуйте изменить фильтры</p>
    </div>`;
    return;
  }
  el.innerHTML = list.map(a=>animeCard(a,withRemove,showCollBtn)).join('');
}

// ════════════════════════════════════════
// ГЛАВНАЯ СТРАНИЦА
// ════════════════════════════════════════
function renderHome() {
  updateHeroStats();
  let list = [...state.db].sort((a,b)=>(b.members||0)-(a.members||0));
  if (state.homeGenre!=='all') list=list.filter(a=>a.genres?.includes(state.homeGenre));
  renderGrid('home-cards', list.slice(0,6), false, false);

  const newList = [...state.db].filter(a=>(a.year||0)>=2019)
    .sort((a,b)=>(b.year||0)-(a.year||0)||(b.rating||0)-(a.rating||0)).slice(0,6);
  renderGrid('new-cards', newList, false, false);
  renderHomeSched();
}

function filterHomeGenre(el,genre) {
  chipOnly(el,'home-genre-chips');
  state.homeGenre=genre;
  let list=[...state.db].sort((a,b)=>(b.members||0)-(a.members||0));
  if (genre!=='all') list=list.filter(a=>a.genres?.includes(genre));
  renderGrid('home-cards',list.slice(0,6), false, false);
}

function renderHomeSched() {
  const sched = getSchedule()||DEFAULT_SCHEDULE;
  const items = sched[TODAY]||[];
  const wrap  = document.getElementById('home-schedule');
  if (!items.length){wrap.innerHTML='<div class="search-empty">Нет выходов сегодня</div>';return;}
  wrap.innerHTML = items.map(it=>{
    const a=state.db.find(x=>x.id===it.id)||{title:'Аниме',emoji:'🎌',image:null};
    const on=state.bells.has(it.id);
    const thumb=a.image?`<img src="${a.image}" alt="">`:a.emoji;
    return `<div class="sched-item" onclick="openDetail(${it.id})">
      <div class="sched-time">${it.time}</div>
      <div class="sched-thumb">${thumb}</div>
      <div class="sched-info"><div class="sched-title">${a.title}</div><div class="sched-ep">${it.ep}</div></div>
      <span class="sched-badge today">Сегодня</span>
      <button class="sched-bell ${on?'on':''}" onclick="event.stopPropagation();toggleBell(${it.id},this)">
        <i class="ti ti-bell${on?'-ringing':''}"></i>
      </button>
    </div>`;
  }).join('');
}

// ════════════════════════════════════════
// КАТАЛОГ — фильтры, сортировка, пагинация
// ════════════════════════════════════════
const PER_PAGE = 12;

function buildAllFilters() {
  const gEl = document.getElementById('genre-filter-opts');
  gEl.innerHTML = '';
  const genres = [...new Set(state.db.flatMap(a=>a.genres||[]))].sort();
  gEl.innerHTML = genres.map(g=>`<label class="filter-opt"><input type="checkbox" value="${g}" onchange="applyFilters()"> ${g}</label>`).join('');

  const yEl = document.getElementById('year-filter-opts');
  yEl.innerHTML = '';
  const years = [...new Set(state.db.map(a=>a.year).filter(Boolean))].sort((a,b)=>b-a).slice(0,8);
  yEl.innerHTML = years.map(y=>`<label class="filter-opt"><input type="checkbox" value="${y}" onchange="applyFilters()"> ${y}</label>`).join('');
}

function getChecked(selector) {
  return [...document.querySelectorAll(selector+' input:checked')].map(i=>i.value);
}

function applyFilters() {
  const gC   = getChecked('#genre-filter-opts');
  const sC   = getChecked('#status-filter-opts');
  const yC   = getChecked('#year-filter-opts').map(Number);
  const rC   = getChecked('#rating-filter-opts').map(Number);
  const sort = document.getElementById('sort-select')?.value||'rating';

  let list = state.db.filter(a=>{
    if (gC.length && !gC.some(g=>a.genres?.includes(g)))         return false;
    if (sC.length && !sC.includes(a.status))                      return false;
    if (yC.length && !yC.includes(a.year))                        return false;
    if (rC.length && !rC.some(r=>(a.rating||0)>=r))               return false;
    return true;
  });

  ({
    rating:  ()=>list.sort((a,b)=>(b.rating||0)-(a.rating||0)),
    popular: ()=>list.sort((a,b)=>(b.members||0)-(a.members||0)),
    year:    ()=>list.sort((a,b)=>(b.year||0)-(a.year||0)),
    name:    ()=>list.sort((a,b)=>a.title.localeCompare(b.title,'ru')),
  }[sort]||(() => {}))();

  const total=list.length, pages=Math.max(1,Math.ceil(total/PER_PAGE));
  state.catalogPage=Math.min(state.catalogPage,pages);
  document.getElementById('catalog-count').textContent=`Найдено: ${total} аниме`;
  renderGrid('catalog-grid',list.slice((state.catalogPage-1)*PER_PAGE,state.catalogPage*PER_PAGE));
  renderPagination(pages);
}

function renderPagination(pages) {
  const wrap=document.getElementById('pagination');
  if (pages<=1){wrap.innerHTML='';return;}
  const p=state.catalogPage;
  let h=`<button class="page-btn" onclick="goPage(${p-1})" ${p===1?'disabled':''}><i class="ti ti-chevron-left"></i></button>`;
  let s=Math.max(1,p-3),e=Math.min(pages,p+3);
  if(s>1) h+=`<button class="page-btn" onclick="goPage(1)">1</button>${s>2?'<span style="color:var(--text-dim);padding:0 4px">…</span>':''}`;
  for(let i=s;i<=e;i++) h+=`<button class="page-btn ${i===p?'active':''}" onclick="goPage(${i})">${i}</button>`;
  if(e<pages) h+=`${e<pages-1?'<span style="color:var(--text-dim);padding:0 4px">…</span>':''}<button class="page-btn" onclick="goPage(${pages})">${pages}</button>`;
  h+=`<button class="page-btn" onclick="goPage(${p+1})" ${p===pages?'disabled':''}><i class="ti ti-chevron-right"></i></button>`;
  wrap.innerHTML=h;
}

function goPage(p){state.catalogPage=p;applyFilters();window.scrollTo(0,100);}
function clearFilters(){document.querySelectorAll('#page-catalog input[type=checkbox]').forEach(i=>i.checked=false);state.catalogPage=1;applyFilters();}

// ════════════════════════════════════════
// СТРАНИЦА АНИМЕ
// ════════════════════════════════════════
async function openDetail(id) {
  let a = state.db.find(x=>x.id===id);
  if (state.backendOnline && a) {
    try { a = normalizeAnime(await api.get(`/api/anime/${id}`)); } catch {}
  }
  if (!a) return;
  state.currentAnime=a; state.currentEp=1;

  // Постер
  document.getElementById('detail-poster').innerHTML = a.image
    ? `<img src="${a.image}" alt="${a.title}" onerror="this.style.display='none'">`
    : `<span class="detail-poster-emoji">${a.emoji||'🎌'}</span>`;

  // Бейджи
  const bc=a.status==='ongoing'?'badge-ongoing':a.status==='announced'?'badge-announced':'badge-finished';
  document.getElementById('detail-badges').innerHTML=
    `<span class="badge ${bc}">${sLabel(a.status)}</span>`+
    (a.genres||[]).slice(0,5).map(g=>`<span class="badge badge-genre">${g}</span>`).join('');

  document.getElementById('detail-title').textContent  = a.title;
  document.getElementById('detail-rating').textContent = a.rating||'—';
  document.getElementById('detail-rating-src').textContent = 'оценка MyAnimeList';
  document.getElementById('detail-stars').innerHTML    = starsHtml(a.rating||0);
  document.getElementById('detail-votes').textContent  = a.members?(a.members/1000).toFixed(0)+' тыс. оценок':'';

  document.getElementById('detail-meta').innerHTML=[
    {l:'Год',v:a.year||'—'},{l:'Эпизоды',v:a.eps||'—'},{l:'Студия',v:a.studio||'—'},{l:'Статус',v:sLabel(a.status)},
  ].map(m=>`<div class="meta-item"><div class="meta-label">${m.l}</div><div class="meta-val">${m.v}</div></div>`).join('');

  document.getElementById('detail-desc').textContent=a.desc||'';
  document.getElementById('detail-extra-info').innerHTML=(a.genres||[]).map(g=>
    `<span class="badge badge-genre" style="margin:3px 3px 3px 0;display:inline-block">${g}</span>`).join('');

  // Убираем старый ep-block если был
  const oldEpBlock = document.getElementById('ep-block');
  if (oldEpBlock) oldEpBlock.remove();
  // Плеер — заглушка
  renderPlayerPlaceholder(a);

  // Эпизоды
  const epCount = typeof a.eps==='number'?a.eps:12;
  document.getElementById('player-ep-select').innerHTML=
    Array.from({length:Math.min(epCount,100)},(_,i)=>`<option value="${i+1}">Эпизод ${i+1}</option>`).join('');
  // Сезоны
  state.currentSeason = 1;
  renderSeasons(a);

  // Блоки требующие авторизации
  renderDetailAuthBlocks(a);
  // Комментарии
  renderComments(a.id);

  // Кнопка закладок
  updateBookmarkBtn(a.id);

  nav('detail');
}

function renderDetailAuthBlocks(a) {
  const loggedIn = !!state.user;

  // Оценка — показываем всегда, но при клике без авторизации — модалка
  renderUrStars(a.id);

  // Форма комментария
  const cf = document.getElementById('comment-form');
  const ca = document.getElementById('comment-auth-hint');
  if (cf) cf.style.display = loggedIn ? 'block' : 'none';
  if (ca) ca.style.display = loggedIn ? 'none' : 'block';
}

// ── ВСТРОЕННЫЙ ПЛЕЕР ──
function renderSeasons(a) {
  // Ищем сезоны по mal_id или по id (для fallback данных где id === mal_id)
  const seasons = SEASONS[a.mal_id] || SEASONS[a.id] || [{n:1, eps: typeof a.eps==='number'?a.eps:12, year:a.year||'', title:''}];
  const headerEl = document.getElementById('ep-header');
  const gridEl   = document.getElementById('ep-grid');
  const epSel    = document.getElementById('player-ep-select');
  if (!headerEl || !gridEl) return;

  if (seasons.length > 1) {
    // ── ШАГ 1: показываем выбор сезона ──
    // (эпизоды появятся только после выбора сезона)
    headerEl.innerHTML = '<div style="font-size:15px;font-weight:600;margin-bottom:12px">Выберите сезон</div>';

    let grid = '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px">';
    seasons.forEach(function(s) {
      const isActive = s.n === state.currentSeason;
      const label = s.title ? s.title : ('Сезон ' + s.n);
      grid += '<button onclick="selectSeason(' + a.id + ',' + s.n + ')"'
        + ' style="padding:12px 16px;border-radius:10px;border:1px solid '
        + (isActive ? 'var(--primary)' : 'var(--border)') + ';'
        + 'background:' + (isActive ? 'rgba(255,107,107,.15)' : 'var(--card-bg)') + ';'
        + 'color:' + (isActive ? 'var(--primary)' : 'var(--text)') + ';'
        + 'font-size:13px;font-weight:600;cursor:pointer;text-align:left">'
        + '<div>' + label + '</div>'
        + '<div style="font-size:11px;color:var(--text-dim);margin-top:4px;font-weight:400">'
        + s.eps + ' серий · ' + (s.year||'') + '</div>'
        + '</button>';
    });
    grid += '</div>';
    gridEl.innerHTML = grid;

    // Если сезон уже выбран — показываем его эпизоды под сеткой сезонов
    if (state.currentSeason) {
      renderEpisodes(a, seasons);
    }

  } else {
    // Один сезон — сразу показываем эпизоды
    headerEl.innerHTML = '<div style="font-size:15px;font-weight:600;margin-bottom:10px">Эпизоды (' + (a.eps||'?') + ')</div>';
    renderEpisodesGrid(gridEl, epSel, seasons[0].eps);
  }
}

function selectSeason(animeId, seasonN) {
  state.currentSeason = seasonN;
  state.currentEp = 1;
  const a = state.db.find(function(x){return x.id===animeId || x.mal_id===animeId;});
  if (!a) return;
  // Перерисовываем — сезон теперь выбран
  renderSeasons(a);
  renderPlayerPlaceholder(a);
}

function renderEpisodes(a, seasons) {
  const season = seasons.find(function(s){return s.n===state.currentSeason;}) || seasons[0];
  const epSel  = document.getElementById('player-ep-select');
  const gridEl = document.getElementById('ep-grid');

  // Добавляем блок эпизодов под кнопками сезонов
  const existingEpBlock = document.getElementById('ep-block');
  if (existingEpBlock) existingEpBlock.remove();

  const epBlock = document.createElement('div');
  epBlock.id = 'ep-block';
  epBlock.style.marginTop = '16px';

  const label = season.title ? season.title : ('Сезон ' + season.n);
  epBlock.innerHTML = '<div style="font-size:13px;font-weight:600;color:var(--text-muted);margin-bottom:8px">'
    + label + ' — серии</div>';

  const epCount = season.eps;
  let epHtml = '<div class="ep-grid" id="ep-grid-inner">';
  for (let i = 0; i < epCount; i++) {
    epHtml += '<div class="ep-chip" onclick="selectEp(' + (i+1) + ',this)">' + (i+1) + '</div>';
  }
  epHtml += '</div>';
  epBlock.innerHTML += epHtml;
  gridEl.parentNode.appendChild(epBlock);

  // Обновляем селект
  if (epSel) {
    let opts = '';
    for (let i = 0; i < Math.min(epCount, 100); i++) {
      opts += '<option value="' + (i+1) + '">Эпизод ' + (i+1) + '</option>';
    }
    epSel.innerHTML = opts;
  }
}

function renderEpisodesGrid(gridEl, epSel, epCount) {
  let epHtml = '';
  for (let i = 0; i < epCount; i++) {
    epHtml += '<div class="ep-chip ' + (i===0?'active':'') + '" onclick="selectEp(' + (i+1) + ',this)">' + (i+1) + '</div>';
  }
  gridEl.innerHTML = epHtml;
  if (epSel) {
    let opts = '';
    for (let i = 0; i < Math.min(epCount,100); i++) {
      opts += '<option value="' + (i+1) + '">Эпизод ' + (i+1) + '</option>';
    }
    epSel.innerHTML = opts;
  }
}


// switchSeason заменена на selectSeason выше

function renderPlayerPlaceholder(a) {
  const wrap = document.getElementById('player-wrap');
  if (!wrap || !a) return;
  const img = a.image
    ? `<img src="${a.image}" style="width:100%;height:100%;object-fit:cover;opacity:.25;position:absolute;inset:0">`
    : '';
  wrap.innerHTML = `<div style="width:100%;aspect-ratio:16/9;background:#080e18;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;position:relative;cursor:pointer;border-radius:12px;overflow:hidden" onclick="startPlayer()">
    ${img}
    <div style="position:relative;z-index:1;text-align:center">
      <div style="font-size:56px;margin-bottom:12px">${a.emoji||'🎌'}</div>
      <button style="background:var(--primary);color:#fff;border:none;padding:13px 32px;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer;display:inline-flex;align-items:center;gap:8px">
        <i class="ti ti-player-play-filled"></i> Смотреть
      </button>
      <div style="font-size:12px;color:rgba(255,255,255,.35);margin-top:10px">Нажмите для воспроизведения</div>
    </div>
  </div>`;
}

function startPlayer() {
  const a = state.currentAnime; if (!a) return;
  const wrap = document.getElementById('player-wrap');
  const ep = state.currentEp || 1;
  const season = state.currentSeason || 1;

  // Формируем ссылки на платформы с нужным эпизодом
  const platforms = [
    { name: 'AniLibria', icon: '🎙️', color: '#4ECDC4',
      url: `https://anilibria.tv/release/${ANILIBRIA_IDS[a.id] || ''}.html` },
    { name: 'AniDub',    icon: '📝', color: '#9b7ff4',
      url: `https://anidub.com/?s=${encodeURIComponent(a.title)}` },
    { name: 'Crunchyroll', icon: '🟠', color: '#F47521',
      url: `https://crunchyroll.com/search?q=${encodeURIComponent(a.title)}` },
  ];

  wrap.innerHTML = `
    <div style="width:100%;aspect-ratio:16/9;background:#080e18;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;padding:32px;position:relative;overflow:hidden">
      ${a.image ? `<img src="${a.image}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.12">` : ''}
      <div style="position:relative;z-index:1;text-align:center;width:100%">
        <div style="font-size:13px;color:rgba(255,255,255,.5);margin-bottom:6px">Сезон ${season} · Эпизод ${ep}</div>
        <div style="font-family:'Montserrat',sans-serif;font-size:18px;font-weight:700;color:#fff;margin-bottom:4px">${a.title}</div>
        <div style="font-size:13px;color:rgba(255,255,255,.4);margin-bottom:24px">Выберите платформу для просмотра</div>
        <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
          ${platforms.map(p => `
            <a href="${p.url}" target="_blank"
              style="display:inline-flex;align-items:center;gap:8px;padding:12px 24px;border-radius:10px;
                     background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.12);
                     color:#fff;text-decoration:none;font-size:14px;font-weight:600;
                     transition:background .2s;backdrop-filter:blur(4px)"
              onmouseover="this.style.background='rgba(255,255,255,.15)'"
              onmouseout="this.style.background='rgba(255,255,255,.08)'">
              <span style="font-size:18px">${p.icon}</span> ${p.name}
            </a>`).join('')}
        </div>
        <div style="font-size:11px;color:rgba(255,255,255,.25);margin-top:20px">
          Встроенный плеер будет добавлен после подключения стримингового партнёра
        </div>
      </div>
    </div>`;
}
function scrollToPlayer() {
  document.getElementById('player-section').scrollIntoView({behavior:'smooth',block:'start'});
  setTimeout(startPlayer,300);
}
function selectEp(ep,el) {
  state.currentEp=ep;
  document.querySelectorAll('.ep-chip').forEach(c=>c.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('player-ep-select').value=ep;
  if (document.getElementById('player-iframe').style.display!=='none') startPlayer();
}
function changeEp(val) {
  state.currentEp=parseInt(val);
  document.querySelectorAll('.ep-chip').forEach((c,i)=>c.classList.toggle('active',i+1===state.currentEp));
  if (document.getElementById('player-iframe').style.display!=='none') startPlayer();
}

// ── ПОЛЬЗОВАТЕЛЬСКИЕ ОЦЕНКИ (1-10) ──
function renderUrStars(id) {
  const starsEl = document.getElementById('ur-stars');
  const valEl   = document.getElementById('ur-val');
  if (!starsEl) return;

  if (!state.user) {
    // Не авторизован — показываем приглашение
    starsEl.innerHTML = '';
    if (valEl) {
      valEl.innerHTML = '<span style="color:var(--text-dim);font-size:12px">'
        + '<i class="ti ti-lock" style="margin-right:4px"></i>'
        + '<span style="cursor:pointer;color:var(--secondary)" onclick="requireAuth()">'
        + 'Войдите чтобы оценить</span></span>';
    }
    return;
  }

  const ur = state.ratings[id] || 0;
  let html = '';
  for (let i = 0; i < 10; i++) {
    html += '<span class="ur-star ' + (i < ur ? 'on' : '') + '"'
      + ' onclick="setRating(' + id + ',' + (i+1) + ')"'
      + ' onmouseover="hoverUrStars(' + (i+1) + ')"'
      + ' onmouseout="resetUrStars(' + id + ')">★</span>';
  }
  starsEl.innerHTML = html;
  if (valEl) valEl.textContent = ur ? ('Ваша оценка: ' + ur + '/10') : 'Нажмите чтобы оценить';
}
function hoverUrStars(n){document.querySelectorAll('.ur-star').forEach((s,i)=>{s.style.color=i<n?'var(--yellow)':'';}); }
function resetUrStars(id){renderUrStars(id);}
async function setRating(id,n) {
  if (!state.user) { requireAuth(); return; }
  state.ratings[id]=n;
  saveLocal();
  renderUrStars(id);
  if (state.backendOnline && state.user) {
    try { await api.post('/api/ratings',{anime_id:id,score:n}); } catch {}
  }
  showToast('⭐',`Оценка ${n}/10 сохранена`);
}

// ── КНОПКИ ДОБАВЛЕНИЯ В КОЛЛЕКЦИЮ ──
function renderCollBtns(a) {
  const cs=collStatus(a.id);
  const opts=[{k:'watching',l:'Смотрю'},{k:'planned',l:'В планах'},{k:'watched',l:'Просмотрено'},{k:'hold',l:'Отложено'},{k:'dropped',l:'Брошено'}];
  document.getElementById('coll-btns').innerHTML=opts.map(o=>
    `<button class="coll-opt ${cs===o.k?'active':''}"
      onclick="toggleColl(${a.id},'${o.k}');renderCollBtns(state.currentAnime)">
      ${cs===o.k?'✓ ':''}${o.l}
    </button>`).join('');
}

// ── ЗАКЛАДКИ — выпадающее меню ──
function toggleBookmarkMenu() {
  if (!state.user) { requireAuth(); return; }
  const menu = document.getElementById('bookmark-menu');
  // Обновляем заголовок меню с текущим сезоном
  const a = state.currentAnime;
  if (a) {
    const seasons = SEASONS[a.id];
    if (seasons && seasons.length > 1 && state.currentSeason) {
      const s = seasons.find(function(x){return x.n===state.currentSeason;});
      const menuTitle = document.getElementById('bookmark-menu-title');
      if (menuTitle && s) {
        menuTitle.textContent = 'Добавить: ' + (s.title || ('Сезон ' + s.n));
      }
    }
  }
  menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
}

// Закрыть меню при клике вне его
document.addEventListener('click', function(e) {
  const menu = document.getElementById('bookmark-menu');
  if (!menu) return;
  if (!e.target.closest('#bookmark-menu') && !e.target.closest('[onclick="toggleBookmarkMenu()"]')) {
    menu.style.display = 'none';
  }
});

async function setBookmark(type) {
  if (!state.user) { requireAuth(); return; }
  const a = state.currentAnime; if (!a) return;

  // Сохраняем с информацией о текущем сезоне
  const seasons = SEASONS[a.mal_id] || SEASONS[a.id];
  if (seasons && seasons.length > 1 && state.currentSeason) {
    const s = seasons.find(function(x){return x.n===state.currentSeason;});
    const seasonLabel = s ? (s.title || ('Сезон ' + s.n)) : '';
    if (seasonLabel) {
      // Сохраняем сезон в отдельной структуре
      if (!state.seasonMap) state.seasonMap = {};
      state.seasonMap[a.id] = {season: state.currentSeason, label: seasonLabel};
      saveLocal();
    }
  }

  await addToColl(a.id, type);
  document.getElementById('bookmark-menu').style.display = 'none';
  updateBookmarkBtn(a.id);
}

async function removeBookmark() {
  const a = state.currentAnime; if (!a) return;
  await removeFromColl(a.id, true);
  document.getElementById('bookmark-menu').style.display = 'none';
  updateBookmarkBtn(a.id);
  showToast('🗑️', 'Удалено из списка');
}

function updateBookmarkBtn(id) {
  const status = state.collMap[id];
  const labels = {watching:'Смотрю',planned:'В планах',watched:'Просмотрено',hold:'Отложено',dropped:'Брошено',fav:'Избранное'};
  const label = document.getElementById('fav-label');
  const icon  = document.getElementById('fav-icon');
  const removeBtn = document.getElementById('bm-remove-btn');
  if (label) label.textContent = status ? labels[status] : 'В закладки';
  if (icon)  icon.className = status ? 'ti ti-bookmark-filled' : 'ti ti-bookmark';
  if (removeBtn) removeBtn.style.display = status ? 'flex' : 'none';
  // Подсветить активный пункт меню
  document.querySelectorAll('.bm-opt').forEach(el => el.classList.remove('active'));
  if (status) {
    document.querySelectorAll('.bm-opt').forEach(el => {
      if (el.getAttribute('onclick') === `setBookmark('${status}')`) el.classList.add('active');
    });
  }
}

async function toggleFav() {
  // Оставляем для совместимости — теперь не используется
  toggleBookmarkMenu();
}

// ════════════════════════════════════════
// КОЛЛЕКЦИИ
// ════════════════════════════════════════

// toggleColl: если уже стоит этот статус — убирает, иначе ставит
async function toggleColl(id, type) {
  if (!state.user) { requireAuth(); return; }
  if (state.collMap[id]===type) {
    await removeFromColl(id, true);
  } else {
    await addToColl(id, type);
  }
  // Обновляем карточки на текущей странице
  const pg=document.querySelector('.page.active')?.id?.replace('page-','');
  if (pg==='home') renderHome();
  if (pg==='catalog') applyFilters();
}

async function addToColl(id, type, silent=false) {
  // Убираем из всех не-fav статусов
  if (type!=='fav') {
    Object.keys(state.collMap).forEach(k=>{
      if (Number(k)===id && state.collMap[k]!=='fav') delete state.collMap[k];
    });
  }
  state.collMap[id]=type;
  saveLocal();
  if (state.backendOnline && state.user) {
    try{await api.post('/api/collections',{anime_id:id,status:type});}catch{}
  }
  if (!silent) {
    const labels={watching:'Смотрю',planned:'В планах',watched:'Просмотрено',dropped:'Брошено',hold:'Отложено',fav:'Закладки'};
    showToast('📋',`Добавлено: "${labels[type]}"`);
  }
  updateProfileStats();
}

async function removeFromColl(id, silent=false) {
  delete state.collMap[id];
  saveLocal();
  if (state.backendOnline && state.user) {
    try{await api.del(`/api/collections/${id}`);}catch{}
  }
  if (!silent) showToast('🗑️','Удалено из списка');
  updateProfileStats();
  renderCollGrid();
}

// ════════════════════════════════════════
// КОММЕНТАРИИ К АНИМЕ
// ════════════════════════════════════════
function renderComments(animeId) {
  const comments = (state.comments[animeId]||[]);
  document.getElementById('comments-count').textContent = comments.length ? `(${comments.length})` : '';
  const list=document.getElementById('comments-list');
  if (!comments.length) {
    list.innerHTML=`<div style="font-size:13px;color:var(--text-muted);padding:12px 0">Комментариев пока нет. Будьте первым!</div>`;
    return;
  }
  list.innerHTML=comments.map((c,i)=>`
    <div style="padding:12px 0;border-bottom:1px solid var(--border);display:flex;gap:10px">
      <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--primary),var(--secondary));display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0">🦊</div>
      <div style="flex:1;min-width:0">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
          <span style="font-size:13px;font-weight:600">${c.user}</span>
          <span style="font-size:11px;color:var(--text-dim)">${c.date}</span>
          ${c.user===state.user?.username?`<button onclick="deleteComment(${animeId},${i})" style="background:none;border:none;color:var(--text-dim);font-size:12px;cursor:pointer;margin-left:auto"><i class="ti ti-trash"></i></button>`:''}
        </div>
        <div style="font-size:14px;color:var(--text-muted);line-height:1.6">${c.text}</div>
      </div>
    </div>`).join('');
}

function submitComment() {
  if (!state.user) { requireAuth(); return; }
  const a=state.currentAnime; if(!a)return;
  const input=document.getElementById('comment-input');
  const text=input.value.trim();
  if (!text) return;

  if (!state.comments[a.id]) state.comments[a.id]=[];
  state.comments[a.id].push({
    user: state.user.username,
    text,
    date: new Date().toLocaleDateString('ru',{day:'numeric',month:'short',year:'numeric'}),
  });
  input.value='';
  saveLocal();
  renderComments(a.id);
  showToast('💬','Комментарий добавлен');
}

function deleteComment(animeId, idx) {
  state.comments[animeId].splice(idx,1);
  saveLocal();
  renderComments(animeId);
}

// ════════════════════════════════════════
// СТРАНИЦА РАСПИСАНИЯ
// ════════════════════════════════════════
function renderSchedulePage() {
  document.getElementById('sched-days').innerHTML=DAYS.map(d=>
    `<div class="sched-day ${d===state.schedDay?'active':''}" onclick="switchSchedDay(this,'${d}')">
      ${d}${d===TODAY?'<span class="today-dot"></span>':''}
    </div>`).join('');
  renderSchedItems();
}

function switchSchedDay(el,day) {
  state.schedDay=day;
  document.querySelectorAll('.sched-day').forEach(d=>d.classList.remove('active'));
  el.classList.add('active'); renderSchedItems();
}

function renderSchedItems(filter) {
  const sched=getSchedule()||DEFAULT_SCHEDULE;
  let items=sched[state.schedDay]||[];
  if (filter==='watching') items=items.filter(it=>state.collMap[it.id]==='watching');
  const isToday=state.schedDay===TODAY;
  const wrap=document.getElementById('sched-items');
  if (!items.length){
    wrap.innerHTML=`<div class="empty-state"><div class="empty-icon"><i class="ti ti-calendar-off"></i></div><h3>Нет выходов</h3><p>В этот день ничего не выходит</p></div>`;
    return;
  }
  wrap.innerHTML=items.map(it=>{
    const a=state.db.find(x=>x.id===it.id)||{title:'Аниме',emoji:'🎌',image:null};
    const on=state.bells.has(it.id);
    const thumb=a.image?`<img src="${a.image}" alt="">`:a.emoji;
    return `<div class="sched-item" onclick="openDetail(${it.id})">
      <div class="sched-time">${it.time}</div>
      <div class="sched-thumb">${thumb}</div>
      <div class="sched-info"><div class="sched-title">${a.title}</div><div class="sched-ep">${it.ep}</div></div>
      <span class="sched-badge ${isToday?'today':''}">${isToday?'Сегодня':'Онгоинг'}</span>
      <button class="sched-bell ${on?'on':''}" onclick="event.stopPropagation();toggleBell(${it.id},this)">
        <i class="ti ti-bell${on?'-ringing':''}"></i>
      </button>
    </div>`;
  }).join('');
}

function toggleBell(id,btn) {
  if(state.bells.has(id)){state.bells.delete(id);btn.innerHTML='<i class="ti ti-bell"></i>';btn.classList.remove('on');showToast('🔕','Уведомление отключено');}
  else{state.bells.add(id);btn.innerHTML='<i class="ti ti-bell-ringing"></i>';btn.classList.add('on');showToast('🔔','Уведомление включено');}
  saveLocal();
}

// ════════════════════════════════════════
// ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
// ════════════════════════════════════════
function renderProfile() {
  const loggedIn=!!state.user;
  document.getElementById('profile-name').textContent=state.user?.username||'Гость';
  document.getElementById('profile-settings-card').style.display=loggedIn?'':'none';
  document.getElementById('profile-guest-msg').style.display=loggedIn?'none':'block';
  document.getElementById('profile-coll-section').style.display=loggedIn?'block':'none';
  if (loggedIn) {
    document.getElementById('edit-username').value=state.user.username;
  }
  // Всегда обновляем статистику (данные из localStorage)
  updateProfileStats();
  if (loggedIn) renderCollGrid();
}

function updateProfileStats() {
  const all = Object.values(state.collMap);
  document.getElementById('ps-watched').textContent  = all.filter(s=>s==='watched').length;
  document.getElementById('ps-watching').textContent = all.filter(s=>s==='watching').length;
  document.getElementById('ps-planned').textContent  = all.filter(s=>s==='planned').length;

  // Все 6 типов закладок под ником
  const LABELS = {watching:'Смотрю',planned:'В планах',watched:'Просмотрено',dropped:'Брошено',hold:'Отложено',fav:'Избранное'};
  const ICONS  = {watching:'ti-player-play',planned:'ti-clock',watched:'ti-circle-check',dropped:'ti-x',hold:'ti-player-pause',fav:'ti-heart'};
  const allStatsEl = document.getElementById('profile-all-stats');
  if (allStatsEl) {
    allStatsEl.innerHTML = Object.entries(LABELS).map(function(entry) {
      const key = entry[0], label = entry[1];
      const cnt = all.filter(function(s){return s===key;}).length;
      return '<div style="display:flex;align-items:center;justify-content:space-between">'
        + '<div style="display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text-muted)">'
        + '<i class="ti ' + ICONS[key] + '" style="font-size:14px"></i>' + label + '</div>'
        + '<span style="font-size:13px;font-weight:600;color:' + (cnt>0?'var(--text)':'var(--text-dim)') + '">' + cnt + '</span>'
        + '</div>';
    }).join('');
  }

  // Счётчики на вкладках
  const tabCounts = {};
  Object.keys(LABELS).forEach(function(t) {
    tabCounts[t] = all.filter(function(s){return s===t;}).length;
  });
  document.querySelectorAll('.coll-tab').forEach(function(tab) {
    const fn = tab.getAttribute('onclick') || '';
    const match = fn.match(/'([a-z]+)'/);
    if (match) {
      const key = match[1];
      const cnt = tabCounts[key] || 0;
      tab.textContent = cnt > 0 ? (LABELS[key] + ' (' + cnt + ')') : (LABELS[key] || key);
    }
  });
}

function switchCollTab(el,tab) {
  state.collTab=tab;
  document.querySelectorAll('.coll-tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active'); renderCollGrid();
}

function renderCollGrid() {
  const ids=Object.entries(state.collMap).filter(([,v])=>v===state.collTab).map(([k])=>Number(k));
  const grid=document.getElementById('coll-grid');
  if (!ids.length){
    grid.innerHTML=`<div class="empty-state" style="grid-column:1/-1">
      <div class="empty-icon"><i class="ti ti-bookmark"></i></div>
      <h3>Список пуст</h3><p>Добавляйте аниме из каталога</p>
    </div>`; return;
  }
  const list = ids.map(id=>state.db.find(a=>a.id===id)).filter(Boolean);
  grid.innerHTML = list.map(a => animeCard(a, true)).join('');
}

async function saveProfile() {
  const v=document.getElementById('edit-username').value.trim(); if(!v)return;
  if (state.backendOnline && state.user) {
    try{const u=await api.patch('/api/auth/me',{username:v});state.user.username=u.username;}
    catch(e){showToast('⚠️',e.message||'Ошибка');return;}
  } else if (state.user) state.user.username=v;
  document.getElementById('profile-name').textContent=v;
  showToast('✅','Профиль обновлён');
}

// ════════════════════════════════════════
// ПОИСК ПО КАТАЛОГУ
// ════════════════════════════════════════
const searchInput=document.getElementById('search-input');
const searchDropdown=document.getElementById('search-dropdown');
searchInput.addEventListener('input',function(){
  const q=this.value.trim().toLowerCase();
  if(!q){searchDropdown.classList.remove('open');return;}
  const res=state.db.filter(a=>a.title?.toLowerCase().includes(q)||a.genres?.some(g=>g.toLowerCase().includes(q))).slice(0,7);
  searchDropdown.innerHTML=res.length
    ?res.map(a=>{
        const thumb=a.image?`<img class="search-thumb" src="${a.image}" alt="">`:`<div class="search-thumb-emoji">${a.emoji||'🎌'}</div>`;
        return `<div class="search-result" onclick="openDetail(${a.id});searchInput.value='';searchDropdown.classList.remove('open')">
          ${thumb}<div><div class="sr-title">${a.title}</div><div class="sr-sub">${a.year||'—'} · ${a.genres?.slice(0,2).join(', ')||''} · ★${a.rating||'—'}</div></div>
        </div>`;
      }).join('')
    :'<div class="search-empty">Ничего не найдено</div>';
  searchDropdown.classList.add('open');
});
document.addEventListener('click',e=>{if(!document.getElementById('search-wrap').contains(e.target))searchDropdown.classList.remove('open');});
searchInput.addEventListener('keydown',e=>{if(e.key==='Escape'){searchDropdown.classList.remove('open');searchInput.blur();}});

// ════════════════════════════════════════
// АВТОРИЗАЦИЯ — вход, регистрация, выход
// ════════════════════════════════════════
function requireAuth() {
  showToast('🔒','Войдите в аккаунт');
  openModal('auth-modal');
}

async function doLogin() {
  const username=document.getElementById('login-username').value.trim();
  const password=document.getElementById('login-password').value;
  const errEl=document.getElementById('login-error');
  errEl.style.display='none';

  if (state.backendOnline) {
    try {
      const data=await api.post('/api/auth/login',{username,password});
      localStorage.setItem('kp_token',data.token);
      loginAs(data.user); await syncUserData();
    } catch(e) { errEl.textContent=e.message||'Неверный логин или пароль'; errEl.style.display='block'; }
  } else {
    // Fallback
    if ((username==='admin'||username==='admin@kitsune.ru')&&password==='admin') {
      loginAs({username:'Администратор',email:'admin@kitsune.ru',role:'admin'}); return;
    }
    const users=getLocalUsers();
    const found=users.find(x=>(x.username===username||x.email===username)&&x.pwd===btoa(password));
    if (!found){errEl.textContent='Неверный логин или пароль';errEl.style.display='block';return;}
    loginAs(found);
  }
}

async function doRegister() {
  const username=document.getElementById('reg-username').value.trim();
  const email   =document.getElementById('reg-email').value.trim();
  const password=document.getElementById('reg-password').value;
  const errEl=document.getElementById('reg-error');
  errEl.style.display='none';

  if (!username||!email||!password){errEl.textContent='Заполните все поля';errEl.style.display='block';return;}

  if (state.backendOnline) {
    try {
      const data=await api.post('/api/auth/register',{username,email,password});
      localStorage.setItem('kp_token',data.token);
      loginAs(data.user); await syncUserData();
    } catch(e){errEl.textContent=e.message||'Ошибка регистрации';errEl.style.display='block';}
  } else {
    const users=getLocalUsers();
    if (users.find(x=>x.username===username||x.email===email)){errEl.textContent='Пользователь уже существует';errEl.style.display='block';return;}
    const nu={username,email,pwd:btoa(password),role:'user'};
    users.push(nu); localStorage.setItem('kp_users',JSON.stringify(users));
    loginAs(nu);
  }
}

function loginAs(user) {
  state.user=user;
  try{localStorage.setItem('kp_session',JSON.stringify(user));}catch{}
  closeModal('auth-modal');
  updateAuthUI();
  showToast('👋',`Добро пожаловать, ${user.username}!`);
  renderProfile();
  // Обновляем текущую страницу
  if (state.currentAnime) renderDetailAuthBlocks(state.currentAnime);
}

function logout() {
  state.user=null;
  // Оценки и закладки сохраняются после выхода:
  try{localStorage.removeItem('kp_session');localStorage.removeItem('kp_token');}catch{}
  updateAuthUI();
  showToast('👋','Вы вышли из аккаунта');
  renderProfile();
  if (state.currentAnime) renderDetailAuthBlocks(state.currentAnime);
}

function updateAuthUI() {
  const loggedIn=!!state.user;
  const isAdmin=state.user?.role==='admin';
  document.getElementById('nav-login-btn').style.display  =loggedIn?'none':'';
  document.getElementById('nav-reg-btn').style.display    =loggedIn?'none':'';
  document.getElementById('nav-profile-btn').style.display=loggedIn?'flex':'none';
  document.getElementById('nav-logout-btn').style.display =loggedIn?'flex':'none';
  // Никнейм в шапке
  const nameEl = document.getElementById('nav-username');
  if (nameEl) nameEl.textContent = state.user?.username || '';
  // Ссылка на админку — только для admin
  document.querySelectorAll('.admin-only').forEach(el=>el.style.display=isAdmin?'':'none');
}

function restoreSession() {
  try{const s=localStorage.getItem('kp_session');if(s)state.user=JSON.parse(s);}catch{}
}
function getLocalUsers(){try{return JSON.parse(localStorage.getItem('kp_users')||'[]');}catch{return[];}}
function showLogin(){document.getElementById('login-form').style.display='';document.getElementById('reg-form').style.display='none';}
function showReg()  {document.getElementById('login-form').style.display='none';document.getElementById('reg-form').style.display='';}

// ════════════════════════════════════════
// АДМИНИСТРАТИВНАЯ ПАНЕЛЬ
// ════════════════════════════════════════
function renderAdmin() {
  // Двойная защита
  if (state.user?.role!=='admin') { nav('home'); return; }

  document.getElementById('admin-stats-row').innerHTML=[
    {icon:'ti-movie',n:state.db.length,l:'Аниме'},
    {icon:'ti-users',n:getLocalUsers().length+1,l:'Пользователей'},
    {icon:'ti-star',n:Object.keys(state.ratings).length,l:'Оценок'},
    {icon:'ti-list',n:Object.keys(state.collMap).length,l:'Записей'},
  ].map(s=>`<div class="stat-card"><div class="stat-card-icon"><i class="ti ${s.icon}"></i></div><div class="stat-card-n">${s.n}</div><div class="stat-card-l">${s.l}</div></div>`).join('');

  document.getElementById('admin-recent').innerHTML=state.db.slice(0,8).map(a=>`<tr>
    <td>${a.image?`<img src="${a.image}" style="width:28px;height:38px;border-radius:4px;object-fit:cover;vertical-align:middle;margin-right:8px">`:`<span style="margin-right:8px">${a.emoji||'🎌'}</span>`}${a.title}</td>
    <td><span class="tag ${a.status==='ongoing'?'tag-ongoing':'tag-finished'}">${sLabel(a.status)}</span></td>
    <td style="color:var(--yellow)">★ ${a.rating||'—'}</td>
    <td>${a.studio||'—'}</td><td style="color:var(--text-muted)">${a.year||'—'}</td>
  </tr>`).join('');

  renderAdminTable();
  renderAdminUsers();
  renderSchedAdminTable();
}

function renderAdminTable() {
  const q=(document.getElementById('admin-search')?.value||'').toLowerCase();
  const list=state.db.filter(a=>!q||a.title?.toLowerCase().includes(q));
  document.getElementById('admin-anime-table').innerHTML=list.slice(0,30).map(a=>`<tr>
    <td>${a.image?`<img src="${a.image}" style="width:22px;height:30px;border-radius:3px;object-fit:cover;vertical-align:middle;margin-right:8px">`:`<span style="margin-right:8px">${a.emoji||'🎌'}</span>`}${a.title}</td>
    <td><span class="tag ${a.status==='ongoing'?'tag-ongoing':'tag-finished'}">${sLabel(a.status)}</span></td>
    <td>${a.year||'—'}</td><td style="color:var(--yellow)">★ ${a.rating||'—'}</td>
    <td>
      <button class="btn btn-ghost btn-sm" onclick="openDetail(${a.id})" style="margin-right:4px"><i class="ti ti-eye"></i></button>
      <button class="btn btn-danger btn-sm" onclick="adminDeleteAnime(${a.id})"><i class="ti ti-trash"></i></button>
    </td>
  </tr>`).join('');
}

function renderAdminUsers() {
  const users = getLocalUsers();
  const rows = users.map(function(u) {
    return '<tr><td>' + u.username + '</td><td>' + u.email
      + '</td><td><span class="tag" style="background:rgba(78,205,196,.15);color:var(--secondary)">Пользователь</span></td><td>—</td></tr>';
  }).join('');
  document.getElementById('admin-users-table').innerHTML =
    '<tr><td>Администратор</td><td>admin@kitsune.ru</td>'
    + '<td><span class="tag" style="background:rgba(255,107,107,.15);color:var(--primary)">Админ</span></td><td>—</td></tr>'
    + rows
    + (users.length === 0 ? '<tr><td colspan="4" style="text-align:center;color:var(--text-dim);padding:20px">Зарегистрированных пользователей нет</td></tr>' : '');
}

function switchAdmin(el,section) {
  document.querySelectorAll('.admin-nav-item').forEach(i=>i.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.admin-section').forEach(s=>s.classList.remove('active'));
  document.getElementById('admin-'+section).classList.add('active');
}

async function adminDeleteAnime(id) {
  if (!confirm('Удалить аниме?')) return;
  if (state.backendOnline) {
    try{await api.del(`/api/anime/${id}`);state.db=state.db.filter(a=>a.id!==id);showToast('🗑️','Удалено');renderAdminTable();}
    catch(e){showToast('⚠️',e.message);}
  } else {
    state.db=state.db.filter(a=>a.id!==id);showToast('🗑️','Удалено');renderAdminTable();
  }
}

async function submitAnime() {
  const title=document.getElementById('f-title-ru').value.trim();
  if(!title){showToast('⚠️','Введите название');return;}
  const a={
    id: Date.now(), title,
    studio: document.getElementById('f-studio').value.trim(),
    status: document.getElementById('f-status').value,
    year:   Number(document.getElementById('f-year').value)||null,
    eps:    Number(document.getElementById('f-eps').value)||null,
    image:  document.getElementById('f-image').value.trim()||null,
    desc:   document.getElementById('f-desc').value.trim(),
    genres: document.getElementById('f-genres').value.split(',').map(s=>s.trim()).filter(Boolean),
    rating: 0, members: 0, streams: [], emoji: '🎌',
  };
  if (state.backendOnline) {
    try{const d=await api.post('/api/anime',{...a,title_orig:'',image_url:a.image,description:a.desc,episodes:a.eps});state.db.unshift(normalizeAnime(d));}
    catch{state.db.unshift(a);}
  } else {
    state.db.unshift(a);
  }
  showToast('✅',`«${title}» добавлено`);
  clearAddForm(); renderAdminTable(); buildAllFilters();
}

function clearAddForm(){['f-title-ru','f-studio','f-year','f-eps','f-image','f-desc','f-genres'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});}

// ── РАСПИСАНИЕ В АДМИНКЕ ──
function searchForSched(q) {
  const res=document.getElementById('sched-search-res');
  if (!q.trim()){res.innerHTML='';return;}
  const found=state.db.filter(a=>a.title.toLowerCase().includes(q.toLowerCase())).slice(0,5);
  res.innerHTML=found.map(a=>
    `<div style="padding:6px 10px;background:var(--surface);border:1px solid var(--border);border-radius:6px;margin-top:4px;cursor:pointer;font-size:13px"
      onclick="selectSchedAnime(${a.id},'${a.title.replace(/'/g,"\\'")}')">
      ${a.title}
    </div>`).join('');
}

function selectSchedAnime(id, title) {
  document.getElementById('sched-anime-id').value=id;
  document.getElementById('sched-title-inp').value=title;
  document.getElementById('sched-search-res').innerHTML='';
}

function addSchedEntry() {
  const day   =document.getElementById('sched-day-sel').value;
  const time  =document.getElementById('sched-time-inp').value.trim();
  const animeId=Number(document.getElementById('sched-anime-id').value);
  const ep    =document.getElementById('sched-ep-inp').value.trim();

  if (!time||!animeId||!ep){showToast('⚠️','Заполните все поля');return;}

  const sched=getSchedule()||DEFAULT_SCHEDULE;
  if (!sched[day]) sched[day]=[];
  // Проверяем дубликат
  if (sched[day].find(i=>i.id===animeId)){showToast('⚠️','Это аниме уже есть в этом дне');return;}
  sched[day].push({time,id:animeId,ep});
  sched[day].sort((a,b)=>a.time.localeCompare(b.time));
  saveSchedule(sched);

  // Очищаем форму
  document.getElementById('sched-time-inp').value='';
  document.getElementById('sched-title-inp').value='';
  document.getElementById('sched-anime-id').value='';
  document.getElementById('sched-ep-inp').value='';

  showToast('📅','Добавлено в расписание');
  renderSchedAdminTable();
}

function renderSchedAdminTable() {
  const sched=getSchedule()||DEFAULT_SCHEDULE;
  let rows='';
  for (const day of DAYS) {
    (sched[day]||[]).forEach((it,idx)=>{
      const a=state.db.find(x=>x.id===it.id);
      rows+=`<tr>
        <td><span class="tag" style="background:rgba(78,205,196,.1);color:var(--secondary)">${day}</span></td>
        <td>${it.time}</td>
        <td>${a?a.title:`ID: ${it.id}`}</td>
        <td>${it.ep}</td>
        <td><button class="btn btn-danger btn-sm" onclick="removeSchedEntry('${day}',${idx})"><i class="ti ti-trash"></i></button></td>
      </tr>`;
    });
  }
  document.getElementById('sched-admin-table').innerHTML=rows||'<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:20px">Расписание пусто</td></tr>';
}

function removeSchedEntry(day,idx) {
  const sched=getSchedule()||DEFAULT_SCHEDULE;
  sched[day].splice(idx,1);
  saveSchedule(sched);
  showToast('🗑️','Удалено из расписания');
  renderSchedAdminTable();
}

// ════════════════════════════════════════
// МОДАЛКИ / ТОСТ
// ════════════════════════════════════════
function openModal(id) {
  document.getElementById(id).classList.add('open');
  // Очищаем поля авторизации при каждом открытии
  if (id === 'auth-modal') {
    ['login-username','login-password','reg-username','reg-email','reg-password'].forEach(function(f) {
      const el = document.getElementById(f);
      if (el) el.value = '';
    });
    const le = document.getElementById('login-error');
    const re = document.getElementById('reg-error');
    if (le) le.style.display = 'none';
    if (re) re.style.display = 'none';
    // Показываем форму входа (не регистрации)
    showLogin();
  }
}
function closeModal(id){document.getElementById(id).classList.remove('open');}
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.modal-overlay.open').forEach(m=>m.classList.remove('open'));});

let toastTimer;
function showToast(icon,msg){
  const t=document.getElementById('toast');
  document.getElementById('toast-icon').textContent=icon;
  document.getElementById('toast-msg').textContent=msg;
  t.classList.add('show'); clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),2800);
}

// ════════════════════════════════════════
// СТАРТ
// ════════════════════════════════════════
init();
