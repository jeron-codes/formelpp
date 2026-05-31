// ── State ──────────────────────────────────────────────────────────
let currentView    = 'home';
let prevView       = 'home';
let currentFormula = null;
let currentVar     = null;
let currentUser    = null;
let favorites      = new Set();            // formula IDs
let folders        = [];                   // [{id, name, formulas: Set}]
let quizQueue      = [];
let quizIndex      = 0;
let quizMode       = 'flashcard';
let quizSource     = 'all';
let quizFolderID   = null;                 // null = alle / fav; string = Ordner-ID
let quizFlipped    = false;
let quizResults    = { know: 0, unsure: 0, dontknow: 0 };
let supabaseReady  = false;
let sigFigs        = parseInt(localStorage.getItem('sigFigs') || '3');
let currentTheme   = localStorage.getItem('theme') || 'dark';

// ── SVG Pictogram constants (small 14px for buttons, large for standalone icons) ──
const IC = {
  star:     `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`,
  folder:   `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/></svg>`,
  file:     `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/></svg>`,
  pen:      `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash:    `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>`,
  check:    `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20,6 9,17 4,12"/></svg>`,
  x:        `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  search:   `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  camera:   `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  upload:   `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17,8 12,3 7,8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  plus:     `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  warn:     `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  calc:     `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/><line x1="8" y1="18" x2="12" y2="18"/><line x1="15" y1="14" x2="17" y2="16"/><line x1="17" y1="14" x2="15" y2="16"/></svg>`,
  list:     `<svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  // Large standalone icons
  cam48:    `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  star48:   `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>`,
  check36:  `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9,12 11,14 15,10"/></svg>`,
  warn32:   `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  signal48: `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0119 12.55"/><path d="M5 12.55a10.94 10.94 0 015.17-2.39"/><path d="M10.71 5.05A16 16 0 0122.56 9"/><path d="M1.42 9a15.91 15.91 0 014.7-2.88"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>`,
};

// ── Lehrberuf / Lehrjahr Filter ────────────────────────────────────
let selectedBeruf    = localStorage.getItem('beruf')    || 'alle';
let selectedLehrjahr = parseInt(localStorage.getItem('lehrjahr') || '0'); // 0 = alle

function getVisibleFormulas() {
  return FORMULAS.filter(f => {
    // Beruf-Filter
    if (selectedBeruf !== 'alle') {
      const fb = f.berufe || ['alle'];
      if (!fb.includes('alle') && !fb.includes(selectedBeruf)) return false;
    }
    // Lehrjahr-Filter (kumulativ: zeige nur lehrjahr <= selectedLehrjahr)
    if (selectedLehrjahr > 0) {
      const fj = f.lehrjahr || 1;
      if (fj > selectedLehrjahr) return false;
    }
    return true;
  });
}

function setBeruf(beruf) {
  selectedBeruf = beruf;
  localStorage.setItem('beruf', beruf);
  refreshFilterUI();
  buildHome();
}

function setLehrjahr(jahr) {
  selectedLehrjahr = jahr;
  localStorage.setItem('lehrjahr', jahr);
  refreshFilterUI();
  buildHome();
}

function refreshFilterUI() {
  document.querySelectorAll('.filter-beruf-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.beruf === selectedBeruf));
  document.querySelectorAll('.filter-lj-btn').forEach(btn =>
    btn.classList.toggle('active', parseInt(btn.dataset.lj) === selectedLehrjahr));
}

// ── Unit Conversions ────────────────────────────────────────────────
// factor: multiply user input by factor to get SI base value
const UNIT_CONV = {
  'm/s':   [{ l:'m/s', f:1 },       { l:'km/h', f:1/3.6 },   { l:'km/s', f:1000 }],
  'm':     [{ l:'m', f:1 },         { l:'km', f:1000 },       { l:'cm', f:.01 },      { l:'mm', f:.001 }],
  's':     [{ l:'s', f:1 },         { l:'ms', f:.001 },       { l:'min', f:60 },      { l:'h', f:3600 }],
  'kg':    [{ l:'kg', f:1 },        { l:'g', f:.001 },        { l:'t', f:1000 }],
  'N':     [{ l:'N', f:1 },         { l:'kN', f:1000 },       { l:'MN', f:1e6 }],
  'J':     [{ l:'J', f:1 },         { l:'kJ', f:1000 },       { l:'MJ', f:1e6 },      { l:'kWh', f:3.6e6 }],
  'W':     [{ l:'W', f:1 },         { l:'kW', f:1000 },       { l:'MW', f:1e6 }],
  'Pa':    [{ l:'Pa', f:1 },        { l:'kPa', f:1000 },      { l:'bar', f:1e5 }],
  'V':     [{ l:'V', f:1 },         { l:'mV', f:.001 },       { l:'kV', f:1000 }],
  'A':     [{ l:'A', f:1 },         { l:'mA', f:.001 },       { l:'μA', f:1e-6 }],
  'Ω':     [{ l:'Ω', f:1 },         { l:'kΩ', f:1000 },       { l:'MΩ', f:1e6 }],
  'Hz':    [{ l:'Hz', f:1 },        { l:'kHz', f:1000 },      { l:'MHz', f:1e6 }],
  'F':     [{ l:'F', f:1 },         { l:'mF', f:.001 },       { l:'μF', f:1e-6 },     { l:'nF', f:1e-9 }],
  'H':     [{ l:'H', f:1 },         { l:'mH', f:.001 },       { l:'μH', f:1e-6 }],
  'C':     [{ l:'C', f:1 },         { l:'mC', f:.001 },       { l:'μC', f:1e-6 }],
  'rad/s': [{ l:'rad/s', f:1 },     { l:'U/min', f:2*Math.PI/60 }],
  '°':     [{ l:'°', f:1 },         { l:'rad', f:180/Math.PI }],
  'rad':   [{ l:'rad', f:1 },       { l:'°', f:Math.PI/180 }],
  'Wh':    [{ l:'Wh', f:1 },        { l:'kWh', f:1000 }],
  'kWh':   [{ l:'kWh', f:1 },       { l:'Wh', f:.001 }],
  'm²':    [{ l:'m²', f:1 },        { l:'cm²', f:.0001 },     { l:'mm²', f:1e-6 }],
  'm³':    [{ l:'m³', f:1 },        { l:'l', f:.001 },        { l:'ml', f:1e-6 }],
};

// ── Supabase helpers ───────────────────────────────────────────────
function isSupabaseConfigured() {
  return typeof SUPABASE_URL !== 'undefined' &&
         !SUPABASE_URL.includes('DEIN-PROJEKT');
}

async function initSupabase() {
  if (!isSupabaseConfigured()) {
    document.getElementById('setup-banner').classList.remove('hidden');
    // Fall back to localStorage
    favorites = new Set(JSON.parse(localStorage.getItem('fav') || '[]'));
    return;
  }

  supabaseReady = true;

  // "Nicht merken" — Session löschen wenn neue Browser-Session
  if (localStorage.getItem('formelpp_no_remember') && !sessionStorage.getItem('formelpp_active')) {
    await sb.auth.signOut();
    cacheUserLocally(null);
  }
  sessionStorage.setItem('formelpp_active', '1');

  // Sofort-App-Anzeige wenn cached user vorhanden (verhindert Login-Screen-Flash)
  if (getCachedUser() && !localStorage.getItem('formelpp_no_remember')) showApp();

  // Auth state listener
  sb.auth.onAuthStateChange(async (event, session) => {
    currentUser = session?.user ?? null;
    updateAuthUI();
    if (currentUser) {
      cacheUserLocally(currentUser);        // für Offline-Sessions speichern
      // Nur bei echtem Login/Session-Start laden — nicht bei Token-Refresh
      // (Token-Refresh würde sonst lokale Favoriten-Änderungen überschreiben)
      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        await loadFavoritesFromDB();
        await loadApprovedFormulas();
        checkOnboarding();
        checkPendingCount();
      }
      showApp();
    } else {
      // Kein aktiver Login — prüfen ob offline mit gespeicherter Session
      const cached = getCachedUser();
      if (!navigator.onLine && cached) {
        // Offline + vorher eingeloggt → App mit lokalen Daten zeigen
        currentUser = cached;
        favorites = new Set(JSON.parse(localStorage.getItem('fav_cache') || '[]'));
        updateAuthUI();
        showApp();
        buildFavorites();
      } else {
        cacheUserLocally(null);             // Cache löschen bei echtem Logout
        favorites = new Set(JSON.parse(localStorage.getItem('fav') || '[]'));
        showStartScreen();
      }
    }
    buildFavorites();
    if (currentFormula) updateFavBtn(currentFormula.id);
  });

  // Get current session on load
  const { data: { session } } = await sb.auth.getSession();
  currentUser = session?.user ?? null;
  updateAuthUI();

  // Seed formulas on first use (runs once if table is empty)
  await seedFormulasIfEmpty();

  if (currentUser) await loadFavoritesFromDB();
  else favorites = new Set(JSON.parse(localStorage.getItem('fav') || '[]'));
}

async function seedFormulasIfEmpty() {
  try {
    const { count } = await sb.from('formulas')
      .select('*', { count: 'exact', head: true });
    if (count === 0) {
      const rows = FORMULAS.map(f => ({
        id:          f.id,
        name:        f.name,
        category:    f.category,
        subcategory: f.sub,
        description: f.desc || '',
        variables:   f.vars,
        forms:       f.forms,
        default_var: f.def
      }));
      await sb.from('formulas').insert(rows);
      console.log(`${rows.length} Formeln in Supabase gespeichert.`);
    }
  } catch (e) {
    console.warn('Seed übersprungen:', e.message);
  }
}

async function loadFavoritesFromDB() {
  try {
    const { data, error } = await sb.from('favorites').select('formula_id');
    if (!error) {
      favorites = new Set((data || []).map(r => r.formula_id));
      localStorage.setItem('fav_cache', JSON.stringify([...favorites])); // für Offline
    }
  } catch (e) {
    console.warn('Favoriten konnten nicht geladen werden:', e.message);
    // Offline-Fallback: letzten bekannten Stand verwenden
    const cached = localStorage.getItem('fav_cache');
    if (cached) favorites = new Set(JSON.parse(cached));
  }
}

// ── Auth UI ────────────────────────────────────────────────────────
function updateAuthUI() {
  const loggedOut = document.getElementById('user-loggedout');
  const loggedIn  = document.getElementById('user-loggedin');
  if (currentUser) {
    loggedOut.classList.add('hidden');
    loggedIn.classList.remove('hidden');
    document.getElementById('user-email').textContent = currentUser.email;
    document.getElementById('user-avatar').textContent =
      currentUser.email[0].toUpperCase();
  } else {
    loggedOut.classList.remove('hidden');
    loggedIn.classList.add('hidden');
  }
}

function showAuthModal() {
  document.getElementById('auth-overlay').classList.remove('hidden');
  switchAuthTab('login');
}

function hideAuthModal() {
  document.getElementById('auth-overlay').classList.add('hidden');
}

function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === tab));
  document.getElementById('form-login').classList.toggle('hidden',  tab !== 'login');
  document.getElementById('form-signup').classList.toggle('hidden', tab !== 'signup');
}

function setAuthLoading(formId, loading) {
  const btn = document.querySelector(`#${formId} .auth-submit`);
  btn.disabled = loading;
  btn.innerHTML = loading
    ? '<span class="spinner"></span> Wird verarbeitet…'
    : (formId === 'form-login' ? 'Anmelden' : 'Registrieren');
}

function showAuthError(formId, msg) {
  const el = document.getElementById(formId === 'form-login' ? 'login-error' : 'signup-error');
  el.textContent = msg;
  el.classList.remove('hidden');
}

function clearAuthErrors() {
  ['login-error','signup-error','signup-success'].forEach(id => {
    const el = document.getElementById(id);
    el.classList.add('hidden');
    el.textContent = '';
  });
}

// ── Auth actions ───────────────────────────────────────────────────
async function handleLogin(e) {
  e.preventDefault();
  clearAuthErrors();
  const email      = document.getElementById('login-email').value.trim();
  const pw         = document.getElementById('login-pw').value;
  const rememberMe = document.getElementById('login-remember')?.checked ?? true;
  setAuthLoading('form-login', true);
  try {
    const { error } = await sb.auth.signInWithPassword({ email, password: pw });
    if (error) { showAuthError('form-login', error.message); return; }
    if (rememberMe) localStorage.removeItem('formelpp_no_remember');
    else            localStorage.setItem('formelpp_no_remember', '1');
    hideAuthModal();
  } catch (err) {
    showAuthError('form-login', 'Verbindungsfehler — bitte nochmals versuchen.');
  } finally {
    setAuthLoading('form-login', false);
  }
}

async function handleSignup(e) {
  e.preventDefault();
  clearAuthErrors();
  const email = document.getElementById('signup-email').value.trim();
  const pw    = document.getElementById('signup-pw').value;
  setAuthLoading('form-signup', true);
  try {
    const { error } = await sb.auth.signUp({ email, password: pw });
    if (error) { showAuthError('form-signup', error.message); return; }
    document.getElementById('signup-success').classList.remove('hidden');
  } catch (err) {
    showAuthError('form-signup', 'Verbindungsfehler — bitte nochmals versuchen.');
  } finally {
    setAuthLoading('form-signup', false);
  }
}

async function handleLogout() {
  await sb.auth.signOut();
  cacheUserLocally(null);               // Offline-Cache löschen
  localStorage.removeItem('fav_cache'); // Favoriten-Cache löschen
  localStorage.removeItem('formelpp_no_remember'); // Remember-Me Präferenz zurücksetzen
  favorites = new Set();
  buildFavorites();
  if (currentFormula) updateFavBtn(currentFormula.id);
  showStartScreen();
}

// ── Theme ──────────────────────────────────────────────────────────
// ── App visibility (login wall) ────────────────────────
function showApp() {
  document.getElementById('start-screen').classList.add('hidden');
  document.getElementById('sidebar').style.display = '';
  document.getElementById('main').style.display    = '';
}

function showStartScreen() {
  document.getElementById('start-screen').classList.remove('hidden');
  document.getElementById('sidebar').style.display = 'none';
  document.getElementById('main').style.display    = 'none';
}

// ── Offline-Session-Cache ──────────────────────────────────────────
// Speichert User-Infos lokal damit die App auch offline nutzbar bleibt,
// wenn man sich zuvor eingeloggt hatte.
function cacheUserLocally(user) {
  if (user) localStorage.setItem('cachedUser', JSON.stringify({ id: user.id, email: user.email }));
  else       localStorage.removeItem('cachedUser');
}
function getCachedUser() {
  try { return JSON.parse(localStorage.getItem('cachedUser') || 'null'); }
  catch { return null; }
}

// ── Onboarding ─────────────────────────────────────────
function checkOnboarding() {
  if (localStorage.getItem('onboarded')) return;
  const overlay = document.getElementById('onboarding-overlay');
  overlay.classList.remove('hidden');

  // Sync buttons with current state
  let obTheme = currentTheme;
  let obSf    = sigFigs;

  const syncTheme = () => {
    document.querySelectorAll('#ob-theme-choice .theme-choice-btn').forEach(b =>
      b.classList.toggle('active', b.dataset.theme === obTheme));
  };
  const syncSf = () => {
    document.querySelectorAll('#ob-sf-choice .sf-btn').forEach(b =>
      b.classList.toggle('active', parseInt(b.dataset.sf) === obSf));
  };
  syncTheme(); syncSf();

  document.querySelectorAll('#ob-theme-choice .theme-choice-btn').forEach(b => {
    b.onclick = () => { obTheme = b.dataset.theme; applyTheme(obTheme); syncTheme(); };
  });
  document.querySelectorAll('#ob-sf-choice .sf-btn').forEach(b => {
    b.onclick = () => { obSf = parseInt(b.dataset.sf); syncSf(); };
  });

  document.getElementById('onboarding-done').onclick = () => {
    currentTheme = obTheme; sigFigs = obSf;
    localStorage.setItem('theme', currentTheme);
    localStorage.setItem('sigFigs', String(sigFigs));
    localStorage.setItem('onboarded', '1');
    applyTheme(currentTheme);
    overlay.classList.add('hidden');
    buildSettings();
  };
}

function applyTheme(t) {
  document.body.classList.toggle('light-mode', t === 'light');
}

function setTheme(t) {
  currentTheme = t;
  localStorage.setItem('theme', t);
  applyTheme(t);
  buildSettings();
}

// ── Significant figures ────────────────────────────────────────────
function setSigFigs(n) {
  sigFigs = n;
  localStorage.setItem('sigFigs', String(n));
}

function fmtNum(n) {
  if (!isFinite(n) || isNaN(n)) return String(n);
  return parseFloat(n.toPrecision(sigFigs));
}

// ── Settings view ──────────────────────────────────────────────────
function buildSettings() {
  // Beruf-Filter Buttons
  document.querySelectorAll('.filter-beruf-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.beruf === selectedBeruf);
    btn.onclick = () => setBeruf(btn.dataset.beruf);
  });
  // Lehrjahr-Filter Buttons
  document.querySelectorAll('.filter-lj-btn').forEach(btn => {
    btn.classList.toggle('active', parseInt(btn.dataset.lj) === selectedLehrjahr);
    btn.onclick = () => setLehrjahr(parseInt(btn.dataset.lj));
  });

  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === currentTheme);
    btn.onclick = () => setTheme(btn.dataset.theme);
  });
  const sel = document.getElementById('sigfigs-select');
  if (sel) {
    sel.value = sigFigs;
    sel.onchange = () => setSigFigs(parseInt(sel.value));
  }
  const apiKeyInput = document.getElementById('api-key-input');
  if (apiKeyInput) {
    apiKeyInput.value = localStorage.getItem('googleApiKey') || '';
    apiKeyInput.onchange = () => {
      const val = apiKeyInput.value.trim();
      if (val) localStorage.setItem('googleApiKey', val);
      else     localStorage.removeItem('googleApiKey');
    };
  }
  // Admin section
  const adminSection = document.getElementById('admin-section');
  if (adminSection) {
    if (isAdmin()) {
      adminSection.classList.remove('hidden');
      buildAdminPanel();
    } else {
      adminSection.classList.add('hidden');
    }
  }
}

// ── Admin ──────────────────────────────────────────────────────────
function isAdmin() {
  return !!(currentUser && typeof ADMIN_EMAIL !== 'undefined' &&
            currentUser.email === ADMIN_EMAIL);
}

async function checkPendingCount() {
  if (!isAdmin() || !supabaseReady) return;
  try {
    const { count } = await sb.from('pending_formulas')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');
    const badge = document.getElementById('admin-badge');
    if (!badge) return;
    if (count > 0) { badge.textContent = count; badge.classList.remove('hidden'); }
    else             badge.classList.add('hidden');
  } catch (_) {}
}

async function loadApprovedFormulas() {
  if (!supabaseReady) return;
  try {
    const { data } = await sb.from('pending_formulas')
      .select('*')
      .eq('status', 'approved');
    if (!data) return;
    data.forEach(f => {
      if (FORMULAS.find(x => x.id === f.id)) return;
      const defaultVar = Object.keys(f.vars || {})[0] || 'x';
      FORMULAS.push({
        id: f.id, name: f.name, category: f.category, sub: f.sub,
        desc: f.description || '', vars: f.vars || {},
        forms: { [defaultVar]: f.latex || '' },
        def: defaultVar, custom: true, approved: true
      });
    });
    buildHome();
  } catch (_) {}
}

async function buildAdminPanel() {
  const panel = document.getElementById('admin-panel');
  if (!panel) return;
  panel.innerHTML = '<div class="admin-empty">Lade…</div>';

  try {
    const { data } = await sb.from('pending_formulas')
      .select('*').eq('status', 'pending')
      .order('submitted_at', { ascending: false });

    if (!data || data.length === 0) {
      panel.innerHTML = `<div class="admin-empty">${IC.check} Keine ausstehenden Formeln</div>`;
      return;
    }

    panel.innerHTML = '';
    data.forEach(f => {
      const catClass = catToClass(f.category || 'Mathematik');
      const latexEl  = document.createElement('span');
      if (f.latex) {
        try { katex.render(f.latex, latexEl, { throwOnError: false, displayMode: true }); }
        catch (_) { latexEl.textContent = f.latex; }
      } else { latexEl.textContent = '—'; latexEl.style.color = 'var(--muted)'; }

      const card = document.createElement('div');
      card.className = 'admin-formula-card';
      card.innerHTML = `
        <div class="admin-card-name">${f.name}</div>
        <div class="admin-card-meta">
          <span class="badge ${catClass}">${f.category}</span>
          <span style="color:var(--muted);font-size:.76rem;">${f.sub || ''}</span>
          <span style="color:var(--muted);font-size:.7rem;margin-left:auto;">
            ${new Date(f.submitted_at).toLocaleDateString('de-CH')}
          </span>
        </div>
        <div class="admin-card-latex"></div>
        ${f.description ? `<div class="admin-card-desc">${f.description}</div>` : ''}
        <div class="admin-card-actions">
          <button class="admin-approve-btn">${IC.check} Bestätigen</button>
          <button class="admin-reject-btn">${IC.x} Ablehnen</button>
        </div>`;

      card.querySelector('.admin-card-latex').appendChild(latexEl);

      card.querySelector('.admin-approve-btn').onclick = async () => {
        await sb.from('pending_formulas').update({ status: 'approved' }).eq('id', f.id);
        buildAdminPanel();
        checkPendingCount();
        loadApprovedFormulas();
      };
      card.querySelector('.admin-reject-btn').onclick = async () => {
        if (confirm(`"${f.name}" ablehnen und löschen?`)) {
          await sb.from('pending_formulas').delete().eq('id', f.id);
          buildAdminPanel();
          checkPendingCount();
        }
      };
      panel.appendChild(card);
    });
  } catch (e) {
    panel.innerHTML = `<div class="admin-empty" style="color:var(--danger)">Fehler: ${e.message}</div>`;
  }
}

// ── Custom Formulas (Scan) ─────────────────────────────────────────
// ── Formel-Text → LaTeX Konverter ─────────────────────────────────
function textToLatex(text) {
  let s = text;
  // Griechische Buchstaben
  [['alpha','\\alpha'],['beta','\\beta'],['gamma','\\gamma'],['delta','\\delta'],
   ['epsilon','\\epsilon'],['eta','\\eta'],['theta','\\theta'],['lambda','\\lambda'],
   ['mu','\\mu'],['nu','\\nu'],['xi','\\xi'],['pi','\\pi'],['rho','\\rho'],
   ['sigma','\\sigma'],['tau','\\tau'],['phi','\\phi'],['psi','\\psi'],
   ['omega','\\omega'],['infty','\\infty'],
   ['Gamma','\\Gamma'],['Delta','\\Delta'],['Theta','\\Theta'],['Lambda','\\Lambda'],
   ['Sigma','\\Sigma'],['Phi','\\Phi'],['Psi','\\Psi'],['Omega','\\Omega']
  ].forEach(([n, l]) => { s = s.replace(new RegExp(`\\b${n}\\b`, 'g'), l); });
  // Funktionen
  s = s.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
  s = s.replace(/\bsin\(/g,  '\\sin(');
  s = s.replace(/\bcos\(/g,  '\\cos(');
  s = s.replace(/\btan\(/g,  '\\tan(');
  s = s.replace(/\blog\(/g,  '\\log(');
  s = s.replace(/\bln\(/g,   '\\ln(');
  // Hochstellungen: x^2 → x^{2}, x^n → x^{n}
  s = s.replace(/\^(\w+)/g, (_, p) => `^{${p}}`);
  // Vergleichszeichen
  s = s.replace(/~=/g, '\\approx ');
  s = s.replace(/<=/g, '\\leq ');
  s = s.replace(/>=/g, '\\geq ');
  s = s.replace(/!=/g, '\\neq ');
  // Brüche: term/term → \frac{term}{term}
  s = s.replace(/([a-zA-Z0-9_{}\^\\]+)\s*\/\s*([a-zA-Z0-9_{}\^\\]+)/g, '\\frac{$1}{$2}');
  // Rechenzeichen
  s = s.replace(/\*/g, ' \\cdot ');
  s = s.replace(/·/g,  ' \\cdot ');
  s = s.replace(/÷/g,  ' \\div ');
  return s.trim();
}

// Text an Cursor-Position einfügen
function insertAtCursor(input, text) {
  const start = input.selectionStart;
  const end   = input.selectionEnd;
  input.value = input.value.slice(0, start) + text + input.value.slice(end);
  // Bei sqrt() Cursor in die Klammer setzen
  const pos = text === 'sqrt()' ? start + 5 : start + text.length;
  input.setSelectionRange(pos, pos);
  input.dispatchEvent(new Event('input'));
  input.focus();
}

function loadCustomFormulas() {
  try {
    const saved = JSON.parse(localStorage.getItem('customFormulas') || '[]');
    saved.forEach(f => {
      if (!FORMULAS.find(x => x.id === f.id)) FORMULAS.push(f);
    });
  } catch (e) {
    console.warn('Eigene Formeln konnten nicht geladen werden:', e);
  }
}

// ── Eigene Formel hinzufügen ───────────────────────────────────────
const AF_SYMBOLS = [
  { l:'·',     v:'*',      t:'Mal' },
  { l:'/',     v:'/',      t:'Geteilt / Bruch' },
  { l:'²',     v:'^2',     t:'Quadrat' },
  { l:'³',     v:'^3',     t:'Kubik' },
  { l:'xⁿ',   v:'^',      t:'Hochstellen' },
  { l:'√',     v:'sqrt()', t:'Wurzel' },
  { l:'π',     v:'pi',     t:'Pi' },
  { l:'α',     v:'alpha',  t:'Alpha' },
  { l:'β',     v:'beta',   t:'Beta' },
  { l:'γ',     v:'gamma',  t:'Gamma' },
  { l:'δ',     v:'delta',  t:'Delta' },
  { l:'Δ',     v:'Delta',  t:'Delta (gross)' },
  { l:'λ',     v:'lambda', t:'Lambda' },
  { l:'μ',     v:'mu',     t:'Mü' },
  { l:'ω',     v:'omega',  t:'Omega' },
  { l:'Ω',     v:'Omega',  t:'Omega (gross)' },
  { l:'η',     v:'eta',    t:'Eta' },
  { l:'ρ',     v:'rho',    t:'Rho' },
  { l:'σ',     v:'sigma',  t:'Sigma' },
  { l:'φ',     v:'phi',    t:'Phi' },
  { l:'τ',     v:'tau',    t:'Tau' },
  { l:'≈',     v:'~=',     t:'Ungefähr' },
  { l:'≤',     v:'<=',     t:'Kleiner gleich' },
  { l:'≥',     v:'>=',     t:'Grösser gleich' },
  { l:'≠',     v:'!=',     t:'Ungleich' },
  { l:'∞',     v:'infty',  t:'Unendlich' },
];

function buildScan() {
  const wrap = document.getElementById('scan-wrap');
  wrap.innerHTML = `
    <div class="af-form">
      <div class="af-field">
        <label class="af-label">Formelname *</label>
        <input type="text" class="af-input" id="af-name" placeholder="z.B. Ohmsches Gesetz" autocomplete="off">
      </div>
      <div class="af-row">
        <div class="af-field">
          <label class="af-label">Kategorie</label>
          <select class="af-input" id="af-cat">
            <option value="Mathematik">Mathematik</option>
            <option value="Physik">Physik</option>
            <option value="Elektrotechnik">Elektrotechnik</option>
          </select>
        </div>
        <div class="af-field">
          <label class="af-label">Unterkategorie</label>
          <input type="text" class="af-input" id="af-sub" placeholder="z.B. Kinematik" autocomplete="off">
        </div>
      </div>
      <div class="af-field">
        <label class="af-label">Formel *</label>
        <input type="text" class="af-input af-formula-input" id="af-formula"
          placeholder="z.B.  v = s/t   oder   F = m*a"
          autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
        <div class="af-sym-grid" id="af-sym-grid"></div>
        <div class="af-preview" id="af-preview">
          <span class="af-preview-hint">Vorschau erscheint beim Tippen…</span>
        </div>
      </div>
      <div class="af-field">
        <label class="af-label">Beschreibung <span class="af-optional">(optional)</span></label>
        <input type="text" class="af-input" id="af-desc" placeholder="Kurze Beschreibung" autocomplete="off">
      </div>
      <div class="af-field">
        <label class="af-label">Variablen <span class="af-optional">(optional)</span></label>
        <div id="af-vars-list" class="af-vars-list"></div>
        <button type="button" class="af-add-var-btn" id="af-add-var-btn">${IC.plus} Variable hinzufügen</button>
      </div>
      <div class="af-error hidden" id="af-error"></div>
      <button type="button" class="af-save-btn" id="af-save-btn">${IC.check} Formel speichern</button>
    </div>`;

  // Symbol-Buttons aufbauen
  const grid = document.getElementById('af-sym-grid');
  AF_SYMBOLS.forEach(({ l, v, t }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'af-sym-btn';
    btn.textContent = l;
    btn.title = t;
    btn.addEventListener('mousedown', e => {
      e.preventDefault(); // Fokus im Eingabefeld behalten
      insertAtCursor(document.getElementById('af-formula'), v);
    });
    grid.appendChild(btn);
  });

  // Live-Vorschau
  const inp     = document.getElementById('af-formula');
  const preview = document.getElementById('af-preview');
  inp.addEventListener('input', () => {
    const val = inp.value.trim();
    if (!val) { preview.innerHTML = '<span class="af-preview-hint">Vorschau erscheint beim Tippen…</span>'; return; }
    try {
      katex.render(textToLatex(val), preview, { throwOnError: true, displayMode: true });
    } catch (_) {
      preview.innerHTML = `<span class="af-preview-hint">${textToLatex(val)}</span>`;
    }
  });

  // Variable hinzufügen
  document.getElementById('af-add-var-btn').onclick = () => {
    const list = document.getElementById('af-vars-list');
    const row  = document.createElement('div');
    row.className = 'af-var-row';
    row.innerHTML = `
      <input type="text" class="af-input af-var-sym"  placeholder="Symbol (v)" autocomplete="off" autocorrect="off" autocapitalize="off">
      <input type="text" class="af-input af-var-name" placeholder="Bezeichnung (Geschwindigkeit)" autocomplete="off">
      <input type="text" class="af-input af-var-unit" placeholder="Einheit (m/s)" autocomplete="off">
      <button type="button" class="af-var-del">${IC.x}</button>`;
    row.querySelector('.af-var-del').onclick = () => row.remove();
    list.appendChild(row);
    row.querySelector('.af-var-sym').focus();
  };

  document.getElementById('af-save-btn').onclick = _saveCustomFormula;
}

function _saveCustomFormula() {
  const name    = document.getElementById('af-name').value.trim();
  const formula = document.getElementById('af-formula').value.trim();
  const cat     = document.getElementById('af-cat').value;
  const sub     = document.getElementById('af-sub').value.trim() || 'Eigene';
  const desc    = document.getElementById('af-desc').value.trim();
  const errEl   = document.getElementById('af-error');

  errEl.classList.add('hidden');
  if (!name)    { errEl.textContent = 'Bitte einen Formelnamen eingeben.'; errEl.classList.remove('hidden'); return; }
  if (!formula) { errEl.textContent = 'Bitte die Formel eingeben.';        errEl.classList.remove('hidden'); return; }
  const latex = textToLatex(formula);

  // Variablen einlesen
  const vars = {};
  document.querySelectorAll('.af-var-row').forEach(row => {
    const sym = row.querySelector('.af-var-sym').value.trim();
    if (sym) vars[sym] = {
      name: row.querySelector('.af-var-name').value.trim() || sym,
      unit: row.querySelector('.af-var-unit').value.trim() || '–'
    };
  });
  const defaultVar = Object.keys(vars)[0] || 'x';
  const id = 'custom_' + Date.now();

  const formula = { id, name, category: cat, sub, desc, vars,
    forms: { [defaultVar]: latex }, def: defaultVar, custom: true };

  // Sofort in Laufzeit einfügen
  FORMULAS.push(formula);
  buildHome();

  // Lokal speichern
  try {
    const saved = JSON.parse(localStorage.getItem('customFormulas') || '[]');
    saved.push(formula);
    localStorage.setItem('customFormulas', JSON.stringify(saved));
  } catch (_) {}

  // Optional an Supabase senden (zur Überprüfung durch Admin)
  if (supabaseReady && currentUser) {
    sb.from('pending_formulas').insert({
      id, name, latex, category: cat, sub, description: desc,
      vars, submitted_by: currentUser.id, status: 'pending'
    }).catch(() => {});
  }

  // Erfolgsseite
  const wrap = document.getElementById('scan-wrap');
  wrap.innerHTML = `
    <div class="scan-success" style="margin-top:32px;">
      <div class="scan-success-icon">${IC.check36}</div>
      <div class="scan-success-title">«${name}» gespeichert!</div>
      <div class="scan-success-sub">Formel ist ab sofort in deiner Sammlung verfügbar.</div>
    </div>
    <div class="scan-btn-row" style="margin-top:20px;">
      <button class="scan-action-primary" id="af-goto-btn">→ Formel öffnen</button>
      <button class="scan-reset-btn"      id="af-new-btn">${IC.plus} Weitere Formel hinzufügen</button>
    </div>`;
  document.getElementById('af-goto-btn').onclick = () => openFormula(id);
  document.getElementById('af-new-btn').onclick  = buildScan;
}

// ── PDF Export ─────────────────────────────────────────────────────
let _pendingPDFFolder = null;

function exportFolderToPDF(folderObj) {
  _pendingPDFFolder = folderObj;
  document.getElementById('pdf-picker-title').textContent = `PDF – ${folderObj.name}`;
  document.getElementById('pdf-picker-overlay').classList.remove('hidden');
}

function _generatePDF(folderObj, size) {
  const fmls = FORMULAS.filter(f => folderObj.formulas.has(f.id));
  if (!fmls.length) { alert('Keine Formeln in diesem Ordner.'); return; }

  const win = window.open('', '_blank');
  if (!win) { alert('Bitte Pop-ups für diese Seite erlauben.'); return; }

  const date = new Date().toLocaleDateString('de-CH');

  if (size === 'compact') {
    // ── KOMPAKT: 2 Spalten ──────────────────────────────
    const formulaHTML = fmls.map(f => {
      const formsHTML = Object.values(f.forms).map(v => {
        const el = document.createElement('span');
        try { katex.render(v, el, { throwOnError: false, displayMode: false }); }
        catch (e) { el.textContent = v; }
        return `<span class="form-chip">${el.outerHTML}</span>`;
      }).join('');
      const varsHTML = Object.entries(f.vars).map(([sym, info]) =>
        `<tr><td>${sym}</td><td>${info.name}</td><td>${info.unit}</td></tr>`
      ).join('');
      return `<div class="fblock">
        <div class="fname">${f.name} <span class="fsub">${f.category} · ${f.sub}</span></div>
        <div class="forms">${formsHTML}</div>
        <table><tbody>${varsHTML}</tbody></table>
      </div>`;
    }).join('');

    win.document.write(`<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">
<title>${folderObj.name}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<style>
  @page{margin:10mm 12mm;size:A4}*{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',system-ui,sans-serif;color:#111;font-size:11px}
  h1{font-size:13px;font-weight:900;color:#1e1b4b}
  .meta{color:#888;font-size:9px;border-bottom:1.5px solid #7c3aed;padding-bottom:4px;margin-bottom:8px;margin-top:1px}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
  .fblock{break-inside:avoid;border:1px solid #d0d7e5;border-radius:6px;padding:6px 8px}
  .fname{font-weight:700;font-size:10px;margin-bottom:2px}
  .fsub{font-weight:400;color:#6b7280;font-size:8.5px;margin-left:4px}
  .forms{display:flex;flex-wrap:wrap;gap:4px;margin:3px 0 4px;justify-content:center}
  .form-chip{background:#f0f4ff;border-radius:4px;padding:1px 5px;font-size:9px}
  table{width:100%;border-collapse:collapse;font-size:8.5px}
  td{padding:1px 4px;border:1px solid #e5e7eb}
  td:first-child{font-weight:600;white-space:nowrap}
  .katex{font-size:.85em!important}
</style></head><body>
<h1>${folderObj.name}</h1>
<div class="meta">${fmls.length} Formeln · Formel++ · ${date}</div>
<div class="grid">${formulaHTML}</div>
<script>window.onload=function(){setTimeout(function(){window.print()},400)}<\/script>
</body></html>`);

  } else {
    // ── NORMAL: 1 Spalte, grössere Darstellung ──────────
    const formulaHTML = fmls.map(f => {
      const formsHTML = Object.entries(f.forms).map(([k, v]) => {
        const el = document.createElement('div');
        try { katex.render(v, el, { throwOnError: false, displayMode: true }); }
        catch (e) { el.textContent = v; }
        return `<div class="form-item">${el.outerHTML}</div>`;
      }).join('');
      const varsHTML = Object.entries(f.vars).map(([sym, info]) =>
        `<tr><td><b>${sym}</b></td><td>${info.name}</td><td>${info.unit}</td></tr>`
      ).join('');
      return `<div class="fblock">
        <div class="fname">${f.name}</div>
        <div class="fsub">${f.category} · ${f.sub}</div>
        ${f.desc ? `<div class="fdesc">${f.desc}</div>` : ''}
        <div class="forms">${formsHTML}</div>
        <table><thead><tr><th>Symbol</th><th>Bezeichnung</th><th>Einheit</th></tr></thead>
        <tbody>${varsHTML}</tbody></table>
      </div>`;
    }).join('');

    win.document.write(`<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">
<title>${folderObj.name}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<style>
  @page{margin:14mm 18mm;size:A4}*{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'Segoe UI',system-ui,sans-serif;color:#111;font-size:13px}
  h1{font-size:18px;font-weight:900;color:#1e1b4b;margin-bottom:2px}
  .meta{color:#888;font-size:10px;border-bottom:2px solid #7c3aed;padding-bottom:6px;margin-bottom:16px;margin-top:2px}
  .fblock{break-inside:avoid;border:1.5px solid #d0d7e5;border-radius:10px;padding:14px 16px;margin-bottom:14px}
  .fname{font-weight:800;font-size:14px;margin-bottom:2px}
  .fsub{color:#6b7280;font-size:10px;margin-bottom:6px}
  .fdesc{color:#555;font-size:10px;background:#f5f7ff;border-radius:5px;padding:5px 8px;margin-bottom:8px}
  .forms{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0;justify-content:center}
  .form-item{flex:1;min-width:160px;text-align:center}
  table{width:100%;border-collapse:collapse;font-size:10px;margin-top:8px}
  th{background:#f0f4ff;padding:4px 8px;border:1px solid #d0d7e5;text-align:left;font-weight:700}
  td{padding:3px 8px;border:1px solid #e5e7eb}
  .katex-display{margin:4px 0!important}
  .katex{font-size:1em!important}
</style></head><body>
<h1>${folderObj.name}</h1>
<div class="meta">${fmls.length} Formeln · Formel++ · ${date}</div>
${formulaHTML}
<script>window.onload=function(){setTimeout(function(){window.print()},400)}<\/script>
</body></html>`);
  }

  win.document.close();
}

// ── Render helpers ──────────────────────────────────────────────────
function renderAll(container) {
  container.querySelectorAll('.tex').forEach(el => {
    const tex = el.dataset.tex;
    if (!tex) return;
    try {
      katex.render(tex, el, { throwOnError: false, displayMode: el.classList.contains('display') });
    } catch (e) { el.textContent = tex; }
  });
}

// ── Navigation ──────────────────────────────────────────────────────
function showView(id) {
  prevView = currentView;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.getElementById('view-' + id).classList.add('active');
  document.querySelectorAll('nav a').forEach(a =>
    a.classList.toggle('active', a.dataset.view === id));
  currentView = id;
  // Scroll zurücksetzen (wichtig auf Mobile mit overflow-y: auto)
  const main = document.getElementById('main');
  if (main) main.scrollTop = 0;
}

// ── Home ─────────────────────────────────────────────────────────────
function buildHome() {
  const counts = {};
  getVisibleFormulas().forEach(f => { counts[f.category] = (counts[f.category] || 0) + 1; });
  document.getElementById('cat-physik').querySelector('.cat-count').textContent =
    (counts['Physik'] || 0) + ' Formeln';
  document.getElementById('cat-mathematik').querySelector('.cat-count').textContent =
    (counts['Mathematik'] || 0) + ' Formeln';
  document.getElementById('cat-elektro').querySelector('.cat-count').textContent =
    (counts['Elektrotechnik'] || 0) + ' Formeln';
}

// ── Browse ────────────────────────────────────────────────────────────
function browseCategory(cat) {
  const formulas = getVisibleFormulas().filter(f => f.category === cat);
  renderFormulaList(formulas, cat);
  document.getElementById('browse-title').textContent = cat;
  showView('browse');
}

function renderFormulaList(formulas, title) {
  const list = document.getElementById('formula-list');
  list.innerHTML = '';

  if (formulas.length === 0) {
    list.innerHTML = '<p style="color:var(--muted);padding:20px">Keine Formeln gefunden.</p>';
    return;
  }

  const groups = {};
  formulas.forEach(f => { if (!groups[f.sub]) groups[f.sub] = []; groups[f.sub].push(f); });

  Object.entries(groups).forEach(([sub, fmls]) => {
    const header = document.createElement('h3');
    header.textContent = sub;
    header.style.cssText = 'color:var(--muted);font-size:.8rem;text-transform:uppercase;letter-spacing:.1em;margin:24px 0 10px;grid-column:1/-1;';
    list.appendChild(header);

    fmls.forEach(f => {
      const catClass = catToClass(f.category);
      const card = document.createElement('div');
      card.className = formulaCardClass(f);
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;">
          <span class="fc-name">${f.name}</span>
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
            <button class="fc-fav-btn${favorites.has(f.id) ? ' active' : ''}" data-id="${f.id}" title="Favorit">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/></svg>
            </button>
            <span class="badge ${catClass}">${f.sub}</span>
          </div>
        </div>
        <div class="fc-latex tex display" data-tex="${escTex(f.forms[f.def])}"></div>
      `;
      card.querySelector('.fc-fav-btn').addEventListener('click', e => {
        e.stopPropagation();
        toggleFav(f.id);
        e.currentTarget.classList.toggle('active');
      });
      card.addEventListener('click', () => openFormula(f.id));
      list.appendChild(card);
    });
  });

  renderAll(list);
}

// ── Formula Detail ────────────────────────────────────────────────────
function openFormula(id) {
  const f = FORMULAS.find(x => x.id === id);
  if (!f) return;
  currentFormula = f;
  currentVar     = f.def;

  const catClass = catToClass(f.category);
  document.getElementById('detail-name').textContent = f.name;
  document.getElementById('detail-sub').innerHTML =
    `<span class="badge ${catClass}">${f.category}</span>  ${f.sub}`;
  document.getElementById('detail-desc').textContent = f.desc || '';

  // Variable buttons
  const varBtns = document.getElementById('var-buttons');
  varBtns.innerHTML = '';
  Object.entries(f.vars).forEach(([sym, info]) => {
    const btn = document.createElement('button');
    btn.className = 'var-btn' + (sym === f.def ? ' active' : '');
    btn.dataset.var = sym;
    const texSym = sym.replace(/_(\w+)/g, '_{$1}');
    btn.innerHTML = `<span class="tex" data-tex="${escTex(texSym)}"></span><span class="vb-label">${info.name}</span>`;
    btn.addEventListener('click', () => setActiveVar(sym));
    varBtns.appendChild(btn);
  });
  renderAll(varBtns);

  // Variable table
  const tbody = document.getElementById('var-tbody');
  tbody.innerHTML = '';
  Object.entries(f.vars).forEach(([sym, info]) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${sym}</td><td>${info.name}</td><td class="unit-cell">${info.unit}</td>`;
    tbody.appendChild(tr);
  });

  updateFavBtn(id);
  buildFolderBtn(id);
  updateFormulaDisplay();
  showView('detail');
}

function setActiveVar(sym) {
  currentVar = sym;
  document.querySelectorAll('.var-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.var === sym));
  updateFormulaDisplay();
}

function updateFormulaDisplay() {
  const disp = document.getElementById('formula-display');
  const latex = currentFormula.forms[currentVar];
  disp.innerHTML = '';
  const inner = document.createElement('span');
  disp.appendChild(inner);
  try {
    katex.render(latex, inner, { throwOnError: false, displayMode: true });
  } catch (e) { inner.textContent = latex; }
  buildCalculator();
}

function buildCalculator() {
  const wrap = document.getElementById('calculator-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  const f = currentFormula;
  if (!f.calc || !f.calc[currentVar]) return;

  const inputVars = Object.keys(f.vars).filter(k => k !== currentVar);

  const title = document.createElement('div');
  title.className = 'calc-title';
  title.innerHTML = `${IC.calc} Berechnen`;
  wrap.appendChild(title);

  const grid = document.createElement('div');
  grid.className = 'calc-grid';

  inputVars.forEach(sym => {
    const info = f.vars[sym];
    const displaySym = sym.replace(/_(\w+)/g, '_{$1}');
    const row = document.createElement('div');
    row.className = 'calc-row';

    const label = document.createElement('label');
    label.className = 'calc-label';
    label.innerHTML = `<span class="tex calc-sym" data-tex="${escTex(displaySym)}"></span>
      <span class="calc-varname">${info.name}</span>`;

    const input = document.createElement('input');
    input.type = 'number';
    input.className = 'calc-input';
    input.dataset.sym = sym;
    input.placeholder = '...';
    input.addEventListener('input', computeResult);

    row.appendChild(label);
    row.appendChild(input);

    // Unit selector if alternatives exist
    const opts = UNIT_CONV[info.unit];
    if (opts && opts.length > 1) {
      const sel = document.createElement('select');
      sel.className = 'calc-unit-sel';
      sel.dataset.sym = sym;
      opts.forEach(o => {
        const opt = document.createElement('option');
        opt.value = o.f;
        opt.textContent = o.l;
        sel.appendChild(opt);
      });
      sel.addEventListener('change', computeResult);
      row.appendChild(sel);
    } else {
      const lbl = document.createElement('span');
      lbl.className = 'calc-unit-label';
      lbl.textContent = info.unit !== '–' ? info.unit : '';
      row.appendChild(lbl);
    }

    // ── Material-Dropdown ─────────────────────────────────────────────
    // Wenn die Variable ein 'material'-Feld hat (z.B. material: 'dichte'),
    // wird ein Dropdown angezeigt, das den Wert automatisch einfüllt.
    if (info.material && typeof MATERIALIEN !== 'undefined' && MATERIALIEN[info.material]) {
      const matData = MATERIALIEN[info.material];

      const matRow = document.createElement('div');
      matRow.className = 'calc-material-row';

      const matIcon = document.createElement('span');
      matIcon.className = 'calc-material-icon';
      matIcon.innerHTML = IC.list;

      const matLbl = document.createElement('span');
      matLbl.className = 'calc-material-label';
      matLbl.textContent = matData.label + ':';

      const matSel = document.createElement('select');
      matSel.className = 'calc-material-sel';

      const emptyOpt = document.createElement('option');
      emptyOpt.value = '';
      emptyOpt.textContent = '— Material wählen —';
      matSel.appendChild(emptyOpt);

      matData.options.forEach(opt => {
        const o = document.createElement('option');
        o.value = opt.v;
        o.textContent = `${opt.name}  (${opt.v} ${matData.unit})`;
        matSel.appendChild(o);
      });

      matSel.addEventListener('change', () => {
        if (matSel.value !== '') {
          input.value = matSel.value;
          input.classList.add('material-filled');
          computeResult();
        } else {
          input.value = '';
          input.classList.remove('material-filled');
          computeResult();
        }
      });

      // Wenn Nutzer direkt ins Eingabefeld tippt, Material-Auswahl zurücksetzen
      input.addEventListener('input', () => {
        if (input.value === '') {
          input.classList.remove('material-filled');
        } else {
          matSel.value = '';   // Dropdown-Selektion aufheben
          input.classList.add('material-filled');
        }
      }, true);

      matRow.appendChild(matIcon);
      matRow.appendChild(matLbl);
      matRow.appendChild(matSel);

      // Wrap both the input row and material row in a group
      const varGroup = document.createElement('div');
      varGroup.className = 'calc-var-group';
      varGroup.appendChild(row);
      varGroup.appendChild(matRow);
      grid.appendChild(varGroup);
    } else {
      grid.appendChild(row);
    }
  });
  wrap.appendChild(grid);

  // Result unit selector
  const resultUnit = f.vars[currentVar] ? f.vars[currentVar].unit : '';
  const resultOpts = UNIT_CONV[resultUnit];

  const resultBox = document.createElement('div');
  resultBox.className = 'calc-result hidden';
  resultBox.id = 'calc-result-box';
  if (resultOpts && resultOpts.length > 1) {
    const resSel = document.createElement('select');
    resSel.className = 'calc-res-unit-sel';
    resSel.id = 'calc-res-unit';
    resultOpts.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.f;
      opt.textContent = o.l;
      resSel.appendChild(opt);
    });
    resSel.addEventListener('change', computeResult);
    resultBox.appendChild(resSel);
  }
  wrap.appendChild(resultBox);

  renderAll(wrap);
}

function computeResult() {
  const f = currentFormula;
  if (!f.calc || !f.calc[currentVar]) return;
  const inputs = document.querySelectorAll('.calc-input');
  const vars = {};
  let allFilled = true;

  inputs.forEach(inp => {
    const val = parseFloat(inp.value);
    if (inp.value.trim() === '' || isNaN(val)) { allFilled = false; return; }
    // Apply input unit conversion factor → convert to SI base unit
    const sel = document.querySelector(`.calc-unit-sel[data-sym="${inp.dataset.sym}"]`);
    const factor = sel ? parseFloat(sel.value) : 1;
    vars[inp.dataset.sym] = val * factor;
  });

  const box = document.getElementById('calc-result-box');
  if (!box) return;
  if (!allFilled) { box.classList.add('hidden'); return; }

  // Preserve the unit selector if it exists
  const existingUnitSel = box.querySelector('.calc-res-unit-sel');

  try {
    const raw = f.calc[currentVar](vars);
    const baseUnit = f.vars[currentVar] ? f.vars[currentVar].unit : '';
    const sym      = currentVar.replace(/_(\w+)/g, '_{$1}');
    box.classList.remove('hidden');

    // Apply output unit conversion
    const resSel    = box.querySelector('.calc-res-unit-sel');
    const resFactor = resSel ? parseFloat(resSel.value) : 1;

    if (raw === null) {
      // Keep unit selector, replace rest
      const inner = box.querySelector('.calc-res-inner');
      if (inner) inner.remove();
      const err = document.createElement('span');
      err.className = 'calc-err';
      err.textContent = 'Keine reelle Lösung';
      box.insertBefore(err, resSel || null);
    } else if (typeof raw === 'object' && raw.x1 !== undefined) {
      const v1 = fmtNum(raw.x1 / resFactor);
      const v2 = fmtNum(raw.x2 / resFactor);
      box.innerHTML = (existingUnitSel ? existingUnitSel.outerHTML : '') +
        `<span class="calc-res-label">Ergebnis:</span>
         <span class="calc-res-val">x₁ = <strong>${v1}</strong></span>
         <span class="calc-res-val">x₂ = <strong>${v2}</strong></span>`;
      if (existingUnitSel) {
        box.querySelector('.calc-res-unit-sel').addEventListener('change', computeResult);
      }
    } else if (!isFinite(raw) || isNaN(raw)) {
      box.innerHTML = (existingUnitSel ? existingUnitSel.outerHTML : '') +
        '<span class="calc-err">Ungültige Eingabe</span>';
    } else {
      const displayVal = fmtNum(raw / resFactor);
      const dispUnit   = resSel ? resSel.options[resSel.selectedIndex].text : baseUnit;
      const unitTex    = dispUnit.replace(/μ/g, '\\mu ').replace(/Ω/g, '\\Omega ')
                                 .replace(/°/g, '^{\\circ}').replace(/²/g, '^2').replace(/³/g, '^3');
      box.innerHTML = (existingUnitSel ? existingUnitSel.outerHTML : '') +
        `<span class="calc-res-label">Ergebnis:</span>
         <span class="calc-res-val tex" data-tex="${escTex(sym + ' = ' + displayVal + '\\,\\text{' + dispUnit + '}')}">&nbsp;</span>`;
      if (existingUnitSel) {
        box.querySelector('.calc-res-unit-sel').addEventListener('change', computeResult);
      }
      renderAll(box);
    }
  } catch (e) {
    const box2 = document.getElementById('calc-result-box');
    if (box2) box2.innerHTML = '<span class="calc-err">Fehler bei Berechnung</span>';
  }
}

// ── Favorites ─────────────────────────────────────────────────────────
function updateFavBtn(id) {
  const btn = document.getElementById('fav-btn');
  if (!btn) return;
  const isFav = favorites.has(id);
  btn.classList.toggle('active', isFav);
  btn.innerHTML = `${IC.star} Favorit`;
}

async function toggleFav(id) {
  const isFav = favorites.has(id);

  // Sofort lokal updaten — UI reagiert ohne auf Netzwerk zu warten
  if (isFav) favorites.delete(id);
  else       favorites.add(id);
  localStorage.setItem('fav_cache', JSON.stringify([...favorites]));
  localStorage.setItem('fav',       JSON.stringify([...favorites]));
  updateFavBtn(id);
  buildFavorites();
  saveFoldersLocal();

  // Supabase im Hintergrund synchronisieren
  if (supabaseReady && currentUser && navigator.onLine) {
    try {
      if (isFav) {
        await sb.from('favorites').delete().match({ user_id: currentUser.id, formula_id: id });
      } else {
        await sb.from('favorites').insert({ user_id: currentUser.id, formula_id: id });
      }
      localStorage.setItem('fav_cache', JSON.stringify([...favorites]));
    } catch (_) {
      // Rollback bei Netzwerkfehler
      if (isFav) favorites.add(id);
      else       favorites.delete(id);
      localStorage.setItem('fav_cache', JSON.stringify([...favorites]));
      localStorage.setItem('fav',       JSON.stringify([...favorites]));
      updateFavBtn(id);
      buildFavorites();
    }
  }
}

function buildFavorites() {
  const container = document.getElementById('fav-list');
  container.innerHTML = '';

  // ── "Neuer Ordner" button ──
  const addBtn = document.createElement('button');
  addBtn.className = 'new-folder-big-btn';
  addBtn.innerHTML = `${IC.folder} Neuer Ordner erstellen`;
  addBtn.onclick = () => {
    const name = prompt('Ordner-Name:');
    if (name && name.trim()) createFolder(name.trim());
  };
  container.appendChild(addBtn);

  // ── Empty state ──
  if (favorites.size === 0 && folders.length === 0) {
    const loginHint = supabaseReady && !currentUser
      ? '<br><small style="color:var(--muted)">Melde dich an, um Favoriten zu synchronisieren.</small>'
      : '';
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.innerHTML = `<div class="big-icon">${IC.star48}</div>
      <p>Noch keine Favoriten.<br>Öffne eine Formel und klicke auf «Favorit».${loginHint}</p>`;
    container.appendChild(empty);
    return;
  }

  // ── "Alle Favoriten" panel (always shown, contains every favourite) ──
  if (favorites.size > 0) {
    const allPanel = buildFolderPanel(
      { id: 'all-favorites', name: 'Alle Favoriten', formulas: favorites },
      false   // not deletable/renameable
    );
    container.appendChild(allPanel);
  }

  // ── Custom folder panels ──
  folders.forEach(folder => {
    const panel = buildFolderPanel(folder, true);
    container.appendChild(panel);
  });

  renderAll(container);
}

// Builds a large folder panel with header, formula cards and drop zone
function buildFolderPanel(folder, deletable) {
  const fmls = FORMULAS.filter(f => folder.formulas.has(f.id));

  const panel = document.createElement('div');
  panel.className = 'folder-panel';

  // Header
  const header = document.createElement('div');
  header.className = 'folder-panel-header';

  const title = document.createElement('div');
  title.className = 'folder-panel-title';
  title.innerHTML = `${deletable ? IC.folder : IC.star} ${folder.name}
    <span class="folder-panel-count">${fmls.length}</span>`;
  header.appendChild(title);

  const actions = document.createElement('div');
  actions.className = 'folder-panel-actions';

  // PDF export button
  const pdfBtn = document.createElement('button');
  pdfBtn.className = 'folder-action-btn pdf-btn';
  pdfBtn.innerHTML = `${IC.file} PDF`;
  pdfBtn.title = 'Als PDF-Formelsammlung exportieren';
  pdfBtn.onclick = () => exportFolderToPDF(folder);
  actions.appendChild(pdfBtn);

  if (deletable) {
    const renameBtn = document.createElement('button');
    renameBtn.className = 'folder-action-btn';
    renameBtn.innerHTML = IC.pen;
    renameBtn.title = 'Umbenennen';
    renameBtn.onclick = () => {
      const n = prompt('Neuer Name:', folder.name);
      if (n && n.trim()) { folder.name = n.trim(); saveFoldersLocal(); buildFavorites(); }
    };
    actions.appendChild(renameBtn);

    const delBtn = document.createElement('button');
    delBtn.className = 'folder-action-btn del-btn';
    delBtn.innerHTML = IC.trash;
    delBtn.title = 'Ordner löschen';
    delBtn.onclick = () => {
      if (confirm(`Ordner „${folder.name}" löschen?`)) deleteFolder(folder.id);
    };
    actions.appendChild(delBtn);
  }

  header.appendChild(actions);
  panel.appendChild(header);

  // Formula cards
  if (fmls.length > 0) {
    const list = document.createElement('div');
    list.className = 'formula-list folder-formula-list';
    list.style.cssText = 'padding:14px 16px;';
    fmls.forEach(f => {
      const catClass = catToClass(f.category);
      const card = document.createElement('div');
      card.className = formulaCardClass(f);
      card.draggable = true;
      card.dataset.formulaId = f.id;
      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;">
          <span class="fc-name">${f.name}</span>
          <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;margin-left:8px;">
            <span class="badge ${catClass}">${f.category}</span>
            ${deletable ? `<button class="card-remove-btn" title="Aus Ordner entfernen">${IC.x}</button>` : ''}
          </div>
        </div>
        <div class="fc-latex tex display" data-tex="${escTex(f.forms[f.def])}"></div>`;
      card.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', f.id);
        e.dataTransfer.effectAllowed = 'copy';
        setTimeout(() => card.classList.add('dragging'), 0);
      });
      card.addEventListener('dragend', () => card.classList.remove('dragging'));
      card.addEventListener('click', () => openFormula(f.id));
      if (deletable) {
        card.querySelector('.card-remove-btn').addEventListener('click', e => {
          e.stopPropagation();
          folder.formulas.delete(f.id);
          saveFoldersLocal();
          buildFavorites();
        });
      }
      list.appendChild(card);
    });
    panel.appendChild(list);
  } else if (!deletable) {
    // empty "Alle Favoriten" state
    const hint = document.createElement('p');
    hint.style.cssText = 'padding:16px;color:var(--muted);font-size:.85rem;';
    hint.textContent = 'Öffne eine Formel und klicke auf «Favorit» um sie hier hinzuzufügen.';
    panel.appendChild(hint);
  }

  // Drop zone for custom folders only
  if (deletable) {
    const dropZone = document.createElement('div');
    dropZone.className = 'folder-drop-zone';
    dropZone.innerHTML = '⬇ Formel-Karte hierhin ziehen';
    dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      dropZone.classList.add('drag-over');
      panel.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', e => {
      if (!panel.contains(e.relatedTarget)) {
        dropZone.classList.remove('drag-over');
        panel.classList.remove('drag-over');
      }
    });
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      panel.classList.remove('drag-over');
      const formulaId = e.dataTransfer.getData('text/plain');
      if (formulaId) {
        folder.formulas.add(formulaId);
        if (!favorites.has(formulaId)) {
          favorites.add(formulaId);
          localStorage.setItem('fav', JSON.stringify([...favorites]));
        }
        saveFoldersLocal();
        buildFavorites();
      }
    });
    panel.appendChild(dropZone);
  }

  return panel;
}

function buildFormulaSection(title, fmls) {
  const wrap = document.createElement('div');
  wrap.className = 'fav-section';
  const h = document.createElement('div');
  h.className = 'fav-section-title';
  h.textContent = title;
  wrap.appendChild(h);
  const list = document.createElement('div');
  list.className = 'formula-list';
  fmls.forEach(f => {
    const catClass = catToClass(f.category);
    const card = document.createElement('div');
    card.className = formulaCardClass(f);
    card.draggable = true;
    card.dataset.formulaId = f.id;
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:4px;">
        <span class="fc-name">${f.name}</span>
        <span class="badge ${catClass}" style="margin-left:8px;">${f.category}</span>
      </div>
      <div class="fc-latex tex display" data-tex="${escTex(f.forms[f.def])}"></div>`;
    card.addEventListener('dragstart', e => {
      e.dataTransfer.setData('text/plain', f.id);
      e.dataTransfer.effectAllowed = 'copy';
      setTimeout(() => card.classList.add('dragging'), 0);
    });
    card.addEventListener('dragend', () => card.classList.remove('dragging'));
    card.addEventListener('click', () => openFormula(f.id));
    list.appendChild(card);
  });
  wrap.appendChild(list);
  return wrap;
}

function buildFolderChips() {
  const el = document.getElementById('folder-chips');
  if (!el) return;
  el.innerHTML = '';
  if (folders.length === 0) {
    el.innerHTML = '<span style="color:var(--muted);font-size:.8rem">Noch keine Ordner</span>';
    return;
  }
  folders.forEach(folder => {
    const chip = document.createElement('span');
    chip.className = 'folder-chip';
    chip.innerHTML = `${IC.folder} ${folder.name} <span class="folder-chip-count">${folder.formulas.size}</span>
      <button class="folder-chip-del" data-id="${folder.id}" title="Ordner löschen">${IC.x}</button>`;

    // Drop target: drag a formula card onto this chip
    chip.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      chip.classList.add('drag-over');
    });
    chip.addEventListener('dragleave', () => chip.classList.remove('drag-over'));
    chip.addEventListener('drop', e => {
      e.preventDefault();
      chip.classList.remove('drag-over');
      const formulaId = e.dataTransfer.getData('text/plain');
      if (formulaId && !folder.formulas.has(formulaId)) {
        folder.formulas.add(formulaId);
        // Ensure it is also a favourite
        if (!favorites.has(formulaId)) {
          favorites.add(formulaId);
          localStorage.setItem('fav', JSON.stringify([...favorites]));
        }
        saveFoldersLocal();
        buildFavorites();
      }
    });

    el.appendChild(chip);
  });
  el.querySelectorAll('.folder-chip-del').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      if (confirm(`Ordner "${folders.find(f=>f.id===btn.dataset.id)?.name}" löschen?`))
        deleteFolder(btn.dataset.id);
    });
  });
}

// ── Search ─────────────────────────────────────────────────────────────
function doSearch(query) {
  query = query.trim().toLowerCase();
  if (!query) { showView('home'); return; }
  const results = getVisibleFormulas().filter(f => {
    const hay = [
      f.name, f.sub, f.category, f.desc || '',
      ...Object.keys(f.vars),
      ...Object.values(f.vars).map(v => v.name)
    ].join(' ').toLowerCase();
    return hay.includes(query);
  });
  document.getElementById('browse-title').textContent = `Suche: «${query}»`;
  renderFormulaList(results, '');
  showView('browse');
}

// ── Quiz ───────────────────────────────────────────────────────────────
function buildQuizSetup() {
  document.querySelectorAll('.quiz-option-btn[data-mode]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === quizMode);
    btn.onclick = () => {
      quizMode = btn.dataset.mode;
      document.querySelectorAll('.quiz-option-btn[data-mode]').forEach(b =>
        b.classList.toggle('active', b.dataset.mode === quizMode));
    };
  });
  document.querySelectorAll('.quiz-option-btn[data-source]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.source === quizSource);
    btn.onclick = () => {
      quizSource = btn.dataset.source;
      quizFolderID = null;
      document.querySelectorAll('.quiz-option-btn[data-source]').forEach(b =>
        b.classList.toggle('active', b.dataset.source === quizSource));
      renderFolderPicker();
      validateStartBtn();
    };
  });

  renderFolderPicker();
  validateStartBtn();
}

function renderFolderPicker() {
  let picker = document.getElementById('quiz-folder-picker');
  if (!picker) return;
  picker.innerHTML = '';
  if (folders.length === 0) { picker.style.display = 'none'; return; }
  picker.style.display = 'block';
  const label = document.createElement('h3');
  label.style.cssText = 'margin-bottom:12px;font-size:.9rem;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;';
  label.textContent = 'Oder nach Ordner filtern';
  picker.appendChild(label);
  const grid = document.createElement('div');
  grid.className = 'quiz-option-grid';
  folders.forEach(folder => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn' + (quizSource === 'folder' && quizFolderID === folder.id ? ' active' : '');
    btn.innerHTML = `<div class="qob-title">${IC.folder} ${folder.name}</div>
      <div class="qob-desc">${folder.formulas.size} Formeln</div>`;
    btn.onclick = () => {
      quizSource = 'folder';
      quizFolderID = folder.id;
      document.querySelectorAll('.quiz-option-btn[data-source]').forEach(b => b.classList.remove('active'));
      grid.querySelectorAll('.quiz-option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      validateStartBtn();
    };
    grid.appendChild(btn);
  });
  picker.appendChild(grid);
}

function validateStartBtn() {
  const pool = getQuizPool();
  const btn = document.getElementById('start-quiz-btn');
  btn.disabled = pool.length === 0;
  btn.textContent = pool.length === 0
    ? 'Keine Formeln vorhanden'
    : `Quiz starten (${pool.length} Formeln)`;
}

function getQuizPool() {
  if (quizSource === 'fav')    return getVisibleFormulas().filter(f => favorites.has(f.id));
  if (quizSource === 'folder' && quizFolderID) {
    const folder = folders.find(f => f.id === quizFolderID);
    return folder ? getVisibleFormulas().filter(f => folder.formulas.has(f.id)) : [];
  }
  return getVisibleFormulas();
}

function startQuiz() {
  const pool = getQuizPool();
  quizQueue   = shuffle([...pool]);
  quizIndex   = 0;
  quizResults = { know: 0, unsure: 0, dontknow: 0 };
  document.getElementById('quiz-setup').style.display  = 'none';
  document.getElementById('quiz-runner').style.display = 'block';
  document.getElementById('quiz-result').style.display = 'none';
  showQuizCard();
}

function showQuizCard() {
  if (quizIndex >= quizQueue.length) { showQuizResult(); return; }
  const f = quizQueue[quizIndex];
  quizFlipped = false;
  updateProgress();

  const card      = document.getElementById('quiz-card');
  const actionsEl = document.getElementById('quiz-actions');

  if (quizMode === 'flashcard') {
    card.innerHTML = `
      <div class="qc-tag">${f.category} · ${f.sub}</div>
      <div class="qc-name">${f.name}</div>
      <div class="qc-question">Wie lautet die Formel?</div>
      <div id="qc-formula" style="opacity:0;transition:opacity .3s;min-height:60px;"></div>
      <div style="margin-top:16px;font-size:.75rem;color:var(--muted);">Karte anklicken zum Aufdecken</div>
    `;
    card.style.cursor = 'pointer';
    card.onclick = () => flipCard();
    actionsEl.innerHTML = '';

  } else {
    const varKeys   = Object.keys(f.forms);
    const targetVar = varKeys[Math.floor(Math.random() * varKeys.length)];
    const srcVar    = f.def === targetVar ? (varKeys.find(k => k !== targetVar) || f.def) : f.def;
    const correct   = f.forms[targetVar];
    const choices   = shuffle([correct, ...generateDistractors(f, targetVar, correct, 3)]);
    const texTarget = escTex(targetVar.replace(/_(\w+)/g, '_{$1}'));

    card.innerHTML = `
      <div class="qc-tag">${f.category} · ${f.sub}</div>
      <div class="qc-name">${f.name}</div>
      <div class="qc-question">
        Forme nach <strong class="tex" data-tex="${texTarget}"></strong> um:
      </div>
      <div class="qc-formula tex display" data-tex="${escTex(f.forms[srcVar])}"></div>
    `;
    renderAll(card);

    const wrap = document.createElement('div');
    wrap.className = 'quiz-choices';
    choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.dataset.correct = ch === correct ? '1' : '0';
      try { katex.render(ch, btn, { throwOnError: false, displayMode: false }); }
      catch (e) { btn.textContent = ch; }
      btn.addEventListener('click', () => answerChoice(btn, correct));
      wrap.appendChild(btn);
    });
    actionsEl.innerHTML = '';
    actionsEl.appendChild(wrap);
  }
}

function flipCard() {
  if (quizFlipped) return;
  quizFlipped = true;
  const f  = quizQueue[quizIndex];
  const el = document.getElementById('qc-formula');
  el.style.opacity = '1';
  try { katex.render(f.forms[f.def], el, { throwOnError: false, displayMode: true }); }
  catch (e) { el.textContent = f.forms[f.def]; }

  document.getElementById('quiz-actions').innerHTML = `
    <div class="grade-btns">
      <button class="grade-btn know"     onclick="gradeCard('know')">${IC.check} Gewusst</button>
      <button class="grade-btn unsure"   onclick="gradeCard('unsure')">~ Fast</button>
      <button class="grade-btn dontknow" onclick="gradeCard('dontknow')">${IC.x} Nicht gewusst</button>
    </div>`;
}

function gradeCard(grade) {
  quizResults[grade]++;
  quizIndex++;
  showQuizCard();
}

function answerChoice(btn, correct) {
  document.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (b.dataset.correct === '1') b.classList.add('correct');
    else if (b === btn)            b.classList.add('wrong');
  });
  quizResults[btn.dataset.correct === '1' ? 'know' : 'dontknow']++;
  setTimeout(() => { quizIndex++; showQuizCard(); }, 1200);
}

function updateProgress() {
  const pct = quizQueue.length ? (quizIndex / quizQueue.length) * 100 : 0;
  document.getElementById('progress-fill').style.width = pct + '%';
  document.getElementById('progress-text').textContent =
    `${Math.min(quizIndex + 1, quizQueue.length)} / ${quizQueue.length}`;
}

function showQuizResult() {
  document.getElementById('quiz-runner').style.display = 'none';
  document.getElementById('quiz-result').style.display = 'block';
  const total = quizQueue.length;
  const pct   = Math.round((quizResults.know / total) * 100);
  document.getElementById('result-score').textContent = pct + '%';
  document.getElementById('result-label').textContent =
    pct >= 80 ? 'Sehr gut!' : pct >= 50 ? 'Gut gemacht!' : 'Weiter üben!';
  document.getElementById('result-know').textContent     = quizResults.know;
  document.getElementById('result-unsure').textContent   = quizResults.unsure;
  document.getElementById('result-dontknow').textContent = quizResults.dontknow;
}

function restartQuiz() {
  document.getElementById('quiz-setup').style.display  = 'block';
  document.getElementById('quiz-runner').style.display = 'none';
  document.getElementById('quiz-result').style.display = 'none';
  buildQuizSetup();
}

// ── Helpers ────────────────────────────────────────────────────────────
function catToClass(cat) {
  return cat === 'Physik' ? 'physik' : cat === 'Mathematik' ? 'mathematik' : 'elektro';
}

// Add subject colour class to formula cards for hover glow
function formulaCardClass(f) {
  return 'formula-card ' + catToClass(f.category);
}

// Maps JS variable key names to their LaTeX equivalents
function varToLatex(v) {
  const greek = {
    alpha:  '\\alpha',  beta:   '\\beta',   gamma: '\\gamma',
    delta:  '\\delta',  phi:    '\\varphi', theta: '\\theta',
    omega:  '\\omega',  sigma:  '\\sigma',  mu:    '\\mu',
    rho:    '\\rho',    lambda: '\\lambda', eta:   '\\eta',
    tau:    '\\tau',    alpha1: '\\alpha_1', alpha2: '\\alpha_2',
  };
  return greek[v] || v;  // subscripts like v_0, U_R work as-is in KaTeX
}

// Generates quiz distractors by permuting the SAME formula's own variables
function generateDistractors(formula, targetVar, correct, count) {
  const t = varToLatex(targetVar);
  const others = Object.keys(formula.vars)
    .filter(v => v !== targetVar)
    .map(varToLatex);

  const candidates = [];

  if (others.length === 2) {
    const [a, b] = others;
    [
      `${t} = ${a} \\cdot ${b}`,
      `${t} = \\dfrac{${a}}{${b}}`,
      `${t} = \\dfrac{${b}}{${a}}`,
      `${t} = ${a} + ${b}`,
      `${t} = ${a} - ${b}`,
      `${t} = ${b} - ${a}`,
    ].forEach(p => { if (p !== correct) candidates.push(p); });

  } else if (others.length === 1) {
    const [a] = others;
    [
      `${t} = ${a}^2`,
      `${t} = \\sqrt{${a}}`,
      `${t} = 2 \\cdot ${a}`,
      `${t} = \\dfrac{${a}}{2}`,
      `${t} = \\dfrac{1}{${a}}`,
    ].forEach(p => { if (p !== correct) candidates.push(p); });

  } else if (others.length >= 3) {
    const [a, b, c] = others;
    [
      `${t} = \\dfrac{${a} \\cdot ${b}}{${c}}`,
      `${t} = \\dfrac{${a} \\cdot ${c}}{${b}}`,
      `${t} = \\dfrac{${b} \\cdot ${c}}{${a}}`,
      `${t} = ${a} \\cdot ${b} \\cdot ${c}`,
      `${t} = \\dfrac{${a}}{${b} \\cdot ${c}}`,
      `${t} = ${a} + ${b} - ${c}`,
    ].forEach(p => { if (p !== correct) candidates.push(p); });
  }

  const result = shuffle(candidates).slice(0, count);

  // If still short, pull from other formulas solving the same variable
  if (result.length < count) {
    const seen = new Set([correct, ...result]);
    const extra = shuffle(
      FORMULAS
        .filter(f => f.id !== formula.id && f.forms[targetVar] && !seen.has(f.forms[targetVar]))
        .map(f => f.forms[targetVar])
    ).slice(0, count - result.length);
    result.push(...extra);
  }

  return result;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function escTex(tex) {
  return (tex || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// ── Ordner ─────────────────────────────────────────────────────────────
function loadFoldersLocal() {
  try {
    const raw = JSON.parse(localStorage.getItem('folders') || '[]');
    folders = raw.map(f => ({ ...f, formulas: new Set(f.formulas || []) }));
  } catch { folders = []; }
}

function saveFoldersLocal() {
  const raw = folders.map(f => ({ ...f, formulas: [...f.formulas] }));
  localStorage.setItem('folders', JSON.stringify(raw));
}

function createFolder(name) {
  const id = 'f_' + Date.now();
  folders.push({ id, name, formulas: new Set() });
  saveFoldersLocal();
  if (currentFormula) buildFolderBtn(currentFormula.id);
  buildFavorites();
  buildQuizSetup();
}

function deleteFolder(id) {
  folders = folders.filter(f => f.id !== id);
  saveFoldersLocal();
  if (currentFormula) buildFolderBtn(currentFormula.id);
  buildFavorites();
  buildQuizSetup();
}

function toggleFormulaInFolder(folderId, formulaId) {
  const folder = folders.find(f => f.id === folderId);
  if (!folder) return;
  if (folder.formulas.has(formulaId)) folder.formulas.delete(formulaId);
  else folder.formulas.add(formulaId);
  saveFoldersLocal();
  buildFolderBtn(formulaId);
  buildFavorites();
}

function buildFolderBtn(formulaId) {
  const wrap = document.getElementById('folder-btn-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  if (folders.length === 0) {
    const hint = document.createElement('span');
    hint.className = 'folder-hint';
    hint.textContent = 'Noch keine Ordner — erstelle einen in "Favoriten"';
    wrap.appendChild(hint);
    return;
  }
  folders.forEach(folder => {
    const inFolder = folder.formulas.has(formulaId);
    const btn = document.createElement('button');
    btn.className = 'folder-tag-btn' + (inFolder ? ' active' : '');
    btn.innerHTML = `${IC.folder} ${folder.name}`;
    btn.onclick = () => { toggleFormulaInFolder(folder.id, formulaId); };
    wrap.appendChild(btn);
  });
}

// ── Init ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {

  // Category cards
  document.getElementById('cat-physik').onclick     = () => browseCategory('Physik');
  document.getElementById('cat-mathematik').onclick = () => browseCategory('Mathematik');
  document.getElementById('cat-elektro').onclick    = () => browseCategory('Elektrotechnik');

  // Sidebar nav
  document.querySelectorAll('nav a[data-view]').forEach(a => {
    a.onclick = () => {
      const v = a.dataset.view;
      if (v === 'favorites') buildFavorites();
      if (v === 'quiz')      buildQuizSetup();
      if (v === 'settings')  buildSettings();
      if (v === 'scan')      buildScan();
      if (v === 'browse') {
        document.getElementById('browse-title').textContent = 'Alle Formeln';
        renderFormulaList(getVisibleFormulas(), 'Alle Formeln');
      }
      showView(v);
    };
  });

  // Back buttons
  document.getElementById('back-btn').onclick       = () => showView('home');
  document.getElementById('detail-back-btn').onclick = () =>
    showView(prevView === 'detail' ? 'browse' : prevView);

  // Fav button (delegated, since it's recreated)
  document.getElementById('fav-btn').onclick = () =>
    currentFormula && toggleFav(currentFormula.id);

  // Search – nur bei Enter
  document.getElementById('search-input').addEventListener('keydown', e => {
    if (e.key === 'Enter')  doSearch(e.target.value);
    if (e.key === 'Escape') { e.target.value = ''; showView('home'); }
  });

  // Auth modal
  document.getElementById('open-auth-btn').onclick = showAuthModal;
  document.getElementById('auth-close').onclick    = hideAuthModal;
  document.getElementById('auth-overlay').onclick  = e => {
    if (e.target === document.getElementById('auth-overlay')) hideAuthModal();
  };
  document.querySelectorAll('.auth-tab').forEach(t =>
    t.onclick = () => { clearAuthErrors(); switchAuthTab(t.dataset.tab); });
  document.getElementById('form-login').onsubmit  = handleLogin;
  document.getElementById('form-signup').onsubmit = handleSignup;
  document.getElementById('logout-btn').onclick   = handleLogout;

  // Quiz start
  document.getElementById('start-quiz-btn').onclick = startQuiz;

  // Start screen buttons
  document.getElementById('start-login-btn').onclick  = () => { showAuthModal(); switchAuthTab('login');  };
  document.getElementById('start-signup-btn').onclick = () => { showAuthModal(); switchAuthTab('signup'); };

  // PDF size picker
  document.getElementById('pdf-create-btn').onclick = () => {
    const size = document.querySelector('input[name="pdf-size"]:checked')?.value || 'normal';
    document.getElementById('pdf-picker-overlay').classList.add('hidden');
    if (_pendingPDFFolder) { _generatePDF(_pendingPDFFolder, size); _pendingPDFFolder = null; }
  };
  document.getElementById('pdf-cancel-btn').onclick = () => {
    document.getElementById('pdf-picker-overlay').classList.add('hidden');
    _pendingPDFFolder = null;
  };

  loadFoldersLocal();
  loadCustomFormulas();
  applyTheme(currentTheme);
  buildHome();
  showView('home');

  // Init Supabase (async, non-blocking for basic usage)
  await initSupabase();
});
