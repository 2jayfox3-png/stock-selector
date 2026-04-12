const fallbackStocks = [
  {
    ticker: 'NVDA',
    price: 188.4,
    score: 91,
    verdict: 'Strong Candidate',
    trend: 'Bullish, aligned daily + weekly',
    ma150: 'Above and rising',
    setup: 'Pullback in uptrend',
    entryZone: '184-188',
    invalidation: '176 close',
    riskNote: 'Controlled pullback, RR > 2',
    relativeStrength: '+8.4%',
    distanceToEntry: 'Inside zone',
    explanation: 'המחיר נשאר מעל MA150 עולה, ה-pullback מסודר וליד תמיכה, והמבנה עדיין נקי עם invalidation ברור.',
    checklist: ['מחיר מעל MA150 עם שיפוע עולה', 'Higher highs / higher lows עדיין תקפים', 'ה-pullback נכנס לאזור תמיכה סביר', 'אין הרחבה קיצונית מה-entry האידאלי', 'יש invalidation ברור מתחת ל-176'],
    prices: [146, 148, 151, 149, 154, 158, 162, 160, 166, 170, 174, 171, 176, 179, 183, 187, 190, 186, 188],
  },
  {
    ticker: 'TSM',
    price: 153.2,
    score: 84,
    verdict: 'Strong Candidate',
    trend: 'Bullish with steady weekly trend',
    ma150: 'Above and rising',
    setup: 'Breakout from base',
    entryZone: '149-152',
    invalidation: '145 close',
    riskNote: 'Healthy breakout, slight extension',
    relativeStrength: '+5.1%',
    distanceToEntry: '+0.8%',
    explanation: 'פריצה מבסיס מסודר עם volume תומך, MA150 חיובי, והמרחק מה-entry עדיין סביר.',
    checklist: ['Base ברור עם contraction', 'פריצה עם confirmation סביר', 'טרנד שבועי תומך בטרנד היומי', 'מרחק מה-entry עדיין לא חריג', 'stop לוגי מתחת ל-145'],
    prices: [124, 126, 127, 129, 128, 131, 133, 136, 137, 139, 140, 142, 145, 146, 147, 149, 151, 154, 153],
  },
  {
    ticker: 'GOOG',
    price: 168.9,
    score: 73,
    verdict: 'Watchlist',
    trend: 'Bullish but needs confirmation',
    ma150: 'Above and flattening higher',
    setup: 'MA150 reclaim',
    entryZone: '165-167',
    invalidation: '160 close',
    riskNote: 'Good if reclaim holds',
    relativeStrength: '+2.2%',
    distanceToEntry: '+1.1%',
    explanation: 'יש reclaim יפה מעל MA150, אבל עדיין חסר follow-through חד כדי לשדרג ל-strong candidate.',
    checklist: ['Reclaim נקי מעל MA150', 'מבנה היומי משתפר', 'עדיין אין breakout expansion משכנע', 'הסיכון סביר אם 160 מחזיק', 'דורש confirmation נוסף במחיר וב-volume'],
    prices: [141, 139, 138, 140, 142, 143, 145, 147, 149, 151, 153, 155, 157, 159, 161, 164, 166, 168, 169],
  },
];

const storageKeys = {
  watchlist: 'nova-stock-selector-watchlist',
  journal: 'nova-stock-selector-journal',
};

const state = {
  stocks: structuredClone(fallbackStocks),
  selectedTicker: 'NVDA',
  watchlist: loadJSON(storageKeys.watchlist, ['NVDA', 'TSM']),
  journal: loadJSON(storageKeys.journal, []),
  dataMeta: null,
};

const el = {
  navBtns: document.querySelectorAll('.nav-btn'),
  screens: document.querySelectorAll('.screen'),
  scannerTableBody: document.getElementById('scannerTableBody'),
  searchInput: document.getElementById('searchInput'),
  verdictFilter: document.getElementById('verdictFilter'),
  setupFilter: document.getElementById('setupFilter'),
  sortBy: document.getElementById('sortBy'),
  universeCount: document.getElementById('universeCount'),
  strongCount: document.getElementById('strongCount'),
  watchlistCount: document.getElementById('watchlistCount'),
  statusGeneratedAt: document.getElementById('statusGeneratedAt'),
  statusSource: document.getElementById('statusSource'),
  statusMode: document.getElementById('statusMode'),
  detailTitle: document.getElementById('detailTitle'),
  detailSubtitle: document.getElementById('detailSubtitle'),
  detailWatchlistBtn: document.getElementById('detailWatchlistBtn'),
  detailPriceBadge: document.getElementById('detailPriceBadge'),
  detailScore: document.getElementById('detailScore'),
  detailVerdict: document.getElementById('detailVerdict'),
  detailExplanation: document.getElementById('detailExplanation'),
  metricTrend: document.getElementById('metricTrend'),
  metricMA150: document.getElementById('metricMA150'),
  metricSetup: document.getElementById('metricSetup'),
  metricRS: document.getElementById('metricRS'),
  metricEntry: document.getElementById('metricEntry'),
  metricInvalidation: document.getElementById('metricInvalidation'),
  detailChecklist: document.getElementById('detailChecklist'),
  chartCanvas: document.getElementById('chartCanvas'),
  watchlistCards: document.getElementById('watchlistCards'),
  journalTicker: document.getElementById('journalTicker'),
  journalSetup: document.getElementById('journalSetup'),
  journalOutcome: document.getElementById('journalOutcome'),
  journalEntry: document.getElementById('journalEntry'),
  journalStop: document.getElementById('journalStop'),
  journalThesis: document.getElementById('journalThesis'),
  journalNotes: document.getElementById('journalNotes'),
  journalForm: document.getElementById('journalForm'),
  journalEntries: document.getElementById('journalEntries'),
  backToScannerBtn: document.getElementById('backToScannerBtn'),
  seedDemoBtn: document.getElementById('seedDemoBtn'),
};

async function init() {
  bindEvents();
  await loadLiveData();
  populateFilters();
  populateJournalTicker();
  ensureSelectedTicker();
  renderAll();
}

function bindEvents() {
  el.navBtns.forEach((btn) => btn.addEventListener('click', () => showScreen(btn.dataset.screen)));
  el.searchInput.addEventListener('input', renderScanner);
  el.verdictFilter.addEventListener('change', renderScanner);
  el.setupFilter.addEventListener('change', renderScanner);
  el.sortBy.addEventListener('change', renderScanner);
  el.detailWatchlistBtn.addEventListener('click', () => toggleWatchlist(state.selectedTicker));
  el.backToScannerBtn.addEventListener('click', () => showScreen('scanner'));
  el.seedDemoBtn.addEventListener('click', resetToFallbackData);

  el.journalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const entry = {
      ticker: el.journalTicker.value,
      setup: el.journalSetup.value.trim(),
      outcome: el.journalOutcome.value.trim() || 'Pending',
      entry: el.journalEntry.value.trim(),
      stop: el.journalStop.value.trim(),
      thesis: el.journalThesis.value.trim(),
      notes: el.journalNotes.value.trim(),
      createdAt: new Date().toISOString(),
    };
    state.journal.unshift(entry);
    persistJSON(storageKeys.journal, state.journal);
    el.journalForm.reset();
    renderJournal();
  });
}

async function loadLiveData() {
  try {
    const response = await fetch(`./data.json?ts=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    if (Array.isArray(payload.stocks) && payload.stocks.length) {
      state.stocks = payload.stocks;
      state.dataMeta = payload;
    }
  } catch (error) {
    state.dataMeta = { source: 'Fallback demo data', generatedAt: null, error: error.message };
  }
}

function ensureSelectedTicker() {
  if (!state.stocks.find((stock) => stock.ticker === state.selectedTicker)) {
    state.selectedTicker = state.stocks[0]?.ticker || null;
  }
}

function populateFilters() {
  populateSelect(el.verdictFilter, [...new Set(state.stocks.map((stock) => stock.verdict))]);
  populateSelect(el.setupFilter, [...new Set(state.stocks.map((stock) => stock.setup))]);
}

function populateSelect(select, values) {
  select.innerHTML = '<option value="all">הכל</option>' + values.map((value) => `<option value="${value}">${value}</option>`).join('');
}

function populateJournalTicker() {
  el.journalTicker.innerHTML = state.stocks.map((stock) => `<option value="${stock.ticker}">${stock.ticker}</option>`).join('');
}

function showScreen(screenId) {
  el.screens.forEach((screen) => screen.classList.toggle('active', screen.id === screenId));
  el.navBtns.forEach((btn) => btn.classList.toggle('active', btn.dataset.screen === screenId));
}

function renderAll() {
  renderStats();
  renderDataStatus();
  renderScanner();
  renderDetail();
  renderWatchlist();
  renderJournal();
}

function renderDataStatus() {
  const generatedAt = state.dataMeta?.generatedAt ? formatDate(state.dataMeta.generatedAt) : 'Demo / unavailable';
  const source = state.dataMeta?.source || 'Fallback demo data';
  const mode = state.dataMeta?.reportMode || 'demo';

  el.statusGeneratedAt.textContent = generatedAt;
  el.statusSource.textContent = source;
  el.statusMode.textContent = mode;
}

function renderStats() {
  el.universeCount.textContent = state.stocks.length;
  el.strongCount.textContent = state.stocks.filter((stock) => stock.verdict === 'Strong Candidate').length;
  el.watchlistCount.textContent = state.watchlist.length;
}

function getFilteredStocks() {
  const search = el.searchInput.value.trim().toUpperCase();
  const verdict = el.verdictFilter.value;
  const setup = el.setupFilter.value;
  const sortBy = el.sortBy.value;

  const filtered = state.stocks.filter((stock) => {
    const matchesSearch = !search || stock.ticker.includes(search);
    const matchesVerdict = verdict === 'all' || stock.verdict === verdict;
    const matchesSetup = setup === 'all' || stock.setup === setup;
    return matchesSearch && matchesVerdict && matchesSetup;
  });

  filtered.sort((a, b) => {
    if (sortBy === 'ticker') return a.ticker.localeCompare(b.ticker);
    if (sortBy === 'distance') return parseDistance(a.distanceToEntry) - parseDistance(b.distanceToEntry);
    return (b.score || 0) - (a.score || 0);
  });

  return filtered;
}

function renderScanner() {
  const stocks = getFilteredStocks();
  if (!stocks.length) {
    el.scannerTableBody.innerHTML = `<tr><td colspan="8"><div class="empty-state">אין תוצאות לפילטרים האלה.</div></td></tr>`;
    return;
  }

  el.scannerTableBody.innerHTML = stocks.map((stock) => `
    <tr>
      <td><strong>${stock.ticker}</strong></td>
      <td>${stock.score ?? '—'}</td>
      <td><span class="badge ${badgeClass(stock.verdict)}">${stock.verdict}</span></td>
      <td>${stock.trend}</td>
      <td>${stock.setup}</td>
      <td>${stock.entryZone}</td>
      <td>${stock.riskNote}</td>
      <td class="table-actions"><button class="icon-btn" data-action="detail" data-ticker="${stock.ticker}">Open</button></td>
    </tr>
  `).join('');

  el.scannerTableBody.querySelectorAll('[data-action="detail"]').forEach((btn) => {
    btn.addEventListener('click', () => openDetail(btn.dataset.ticker));
  });
}

function openDetail(ticker) {
  state.selectedTicker = ticker;
  renderDetail();
  showScreen('detail');
}

function renderDetail() {
  const stock = state.stocks.find((item) => item.ticker === state.selectedTicker) || state.stocks[0];
  if (!stock) return;

  el.detailTitle.textContent = `${stock.ticker} · ${stock.setup}`;
  el.detailSubtitle.textContent = state.dataMeta?.generatedAt
    ? `${state.dataMeta?.reportMode || 'live'} · ${formatDate(state.dataMeta.generatedAt)}`
    : stock.trend;
  el.detailPriceBadge.textContent = stock.price ? `$${stock.price}` : '—';
  el.detailScore.textContent = stock.score ?? '—';
  el.detailVerdict.textContent = stock.verdict;
  el.detailExplanation.textContent = stock.explanation;
  el.metricTrend.textContent = stock.trend;
  el.metricMA150.textContent = stock.ma150;
  el.metricSetup.textContent = stock.setup;
  el.metricRS.textContent = stock.relativeStrength;
  el.metricEntry.textContent = stock.entryZone;
  el.metricInvalidation.textContent = stock.invalidation;
  el.detailChecklist.innerHTML = (stock.checklist || []).map((item) => `<li>${item}</li>`).join('');
  el.detailWatchlistBtn.textContent = state.watchlist.includes(stock.ticker) ? 'Remove from Watchlist' : 'Add to Watchlist';
  drawChart(stock);
}

function renderWatchlist() {
  const items = state.watchlist.map((ticker) => state.stocks.find((stock) => stock.ticker === ticker)).filter(Boolean);
  if (!items.length) {
    el.watchlistCards.innerHTML = `<div class="empty-state">עוד אין מניות שמורות. פתח מניה מה-scanner והוסף אותה.</div>`;
    return;
  }

  el.watchlistCards.innerHTML = items.map((stock) => `
    <article class="watch-card">
      <span class="badge ${badgeClass(stock.verdict)}">${stock.verdict}</span>
      <h3>${stock.ticker}</h3>
      <p>${stock.explanation}</p>
      <div class="card-actions">
        <button class="secondary-btn" data-open="${stock.ticker}">Open</button>
        <button class="text-btn" data-remove="${stock.ticker}">Remove</button>
      </div>
    </article>
  `).join('');

  el.watchlistCards.querySelectorAll('[data-open]').forEach((btn) => btn.addEventListener('click', () => openDetail(btn.dataset.open)));
  el.watchlistCards.querySelectorAll('[data-remove]').forEach((btn) => btn.addEventListener('click', () => toggleWatchlist(btn.dataset.remove)));
}

function renderJournal() {
  if (!state.journal.length) {
    el.journalEntries.innerHTML = `<div class="empty-state">עדיין אין entries. תתחיל מ-thesis קצר.</div>`;
    return;
  }
  el.journalEntries.innerHTML = state.journal.map((entry) => `
    <article class="journal-entry">
      <h3>${entry.ticker} · ${entry.setup || 'No setup'}</h3>
      <p>${formatDate(entry.createdAt)} · ${entry.outcome}</p>
      <p><strong>Entry:</strong> ${entry.entry || '-'} | <strong>Stop:</strong> ${entry.stop || '-'}</p>
      <p>${entry.thesis || 'No thesis provided.'}</p>
      <p>${entry.notes || ''}</p>
    </article>
  `).join('');
}

function toggleWatchlist(ticker) {
  state.watchlist = state.watchlist.includes(ticker) ? state.watchlist.filter((item) => item !== ticker) : [...state.watchlist, ticker];
  persistJSON(storageKeys.watchlist, state.watchlist);
  renderStats();
  renderDetail();
  renderWatchlist();
}

function drawChart(stock) {
  const canvas = el.chartCanvas;
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);

  const prices = stock.prices || [];
  if (!prices.length) return;

  const padding = 28;
  const ma150Series = movingAverage(prices, 5);
  const maxPrice = Math.max(...prices, ...ma150Series);
  const minPrice = Math.min(...prices, ...ma150Series);
  const xFor = (index) => padding + (index / Math.max(prices.length - 1, 1)) * (width - padding * 2);
  const yFor = (value) => height - padding - ((value - minPrice) / Math.max(maxPrice - minPrice, 1)) * (height - padding * 2);

  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 4; i += 1) {
    const y = padding + ((height - padding * 2) / 3) * i;
    ctx.beginPath(); ctx.moveTo(padding, y); ctx.lineTo(width - padding, y); ctx.stroke();
  }

  ctx.strokeStyle = '#8db4ff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  prices.forEach((value, index) => {
    const x = xFor(index); const y = yFor(value);
    if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();

  ctx.strokeStyle = '#58d2b4';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ma150Series.forEach((value, index) => {
    const x = xFor(index); const y = yFor(value);
    if (index === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
}

function movingAverage(values, windowSize) {
  return values.map((_, index) => {
    const start = Math.max(0, index - windowSize + 1);
    const slice = values.slice(start, index + 1);
    return slice.reduce((sum, value) => sum + value, 0) / slice.length;
  });
}

function resetToFallbackData() {
  state.stocks = structuredClone(fallbackStocks);
  state.dataMeta = { source: 'Fallback demo data', generatedAt: null };
  ensureSelectedTicker();
  populateFilters();
  populateJournalTicker();
  renderAll();
}

function badgeClass(verdict = '') {
  if (verdict.includes('Strong')) return 'good';
  if (verdict.includes('Watchlist') || verdict.includes('Needs')) return 'warn';
  if (verdict.includes('Avoid') || verdict.includes('Broken') || verdict.includes('Weak')) return 'bad';
  return 'info';
}

function parseDistance(value = '') {
  if (value === 'Inside zone') return -1;
  if (value.includes('Too extended')) return 999;
  return Number.parseFloat(String(value).replace('%', '')) || 0;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('he-IL', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(date);
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function persistJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

init();