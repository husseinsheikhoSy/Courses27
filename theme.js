/* theme.js — Day (white + emerald) / Night (deep green-black + emerald) shared by index.html and details.html
   First visit follows Telegram's colour scheme; after the toggle is tapped the choice is remembered. */
(function () {
  'use strict';
  var KEY = 'c27_theme_v1';
  var tg = (window.Telegram && window.Telegram.WebApp) || null;
  var root = document.documentElement;

  var CSS = '' +
    'html[data-theme="light"]{color-scheme:light;' +
      '--bg:#eef8f3;--surface:#ffffff;--surface-2:#f2faf6;--surface-3:#e1f2ea;' +
      '--text:#06281c;--muted:#4b6b5d;--faint:#8aa699;--border:rgba(5,120,85,.16);' +
      '--em-b:#10b981;--em:#059669;--em-d:#047857;--em-soft:rgba(16,185,129,.12);--tint:#047857;--deep:#e6f6ee;' +
      '--on-accent:#fff;--fg:6,40,28;--sh:6,60,40;--bar:255,255,255;--ac:16,185,129;--ac-d:5,150,105;' +
      '--success:#059669;--danger:#d62f48;--warn:#c27410;--gold:#b7791f;' +
      '--hdr-a:#059669;--hdr-b:#10b981;--shadow:0 18px 50px rgba(5,100,70,.14);--shadow-em:0 10px 26px rgba(5,150,105,.22)}' +
    'html[data-theme="dark"]{color-scheme:dark;' +
      '--bg:#030d09;--surface:#07160f;--surface-2:#0c2017;--surface-3:#133023;' +
      '--text:#eafff5;--muted:#9fc2b2;--faint:#678a79;--border:rgba(52,211,153,.16);' +
      '--em-b:#34d399;--em:#10b981;--em-d:#059669;--em-soft:rgba(52,211,153,.12);--tint:#6ee7b7;--deep:#0a2a1d;' +
      '--on-accent:#04140d;--fg:234,255,245;--sh:0,0,0;--bar:7,22,15;--ac:16,185,129;--ac-d:5,150,105;' +
      '--success:#34d399;--danger:#ff5d73;--warn:#e0902f;--gold:#fbbf24;' +
      '--hdr-a:#064e3b;--hdr-b:#047857;--shadow:0 24px 70px rgba(0,0,0,.6);--shadow-em:0 10px 26px rgba(16,185,129,.2)}' +
    'html[data-theme="light"]{--btn-fg:#fff}html[data-theme="dark"]{--btn-fg:#03130c}' +
    '.theme-btn{width:40px;height:40px;flex:0 0 40px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;' +
      'border:1px solid var(--border);background:rgba(var(--fg),.06);color:var(--text);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:background .2s,transform .12s}' +
    '.theme-btn:active{transform:scale(.92)}' +
    '.theme-btn svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}' +
    '.theme-btn .i-sun{display:none}' +
    'html[data-theme="dark"] .theme-btn .i-sun{display:block}' +
    'html[data-theme="dark"] .theme-btn .i-moon{display:none}';

  var BTN_HTML =
    '<svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 019.5 4 8.5 8.5 0 1020 14.5z"/></svg>' +
    '<svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/>' +
    '<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';

  function stored() { try { var s = localStorage.getItem(KEY); return (s === 'light' || s === 'dark') ? s : null; } catch (e) { return null; } }
  function initial() {
    var s = stored(); if (s) return s;
    return 'light';   // white + emerald by default; night mode only when the user taps the toggle
  }

  var st = document.createElement('style'); st.id = 'theme-css'; st.textContent = CSS;
  (document.head || root).appendChild(st);

  function syncTelegram() {
    var dark = root.getAttribute('data-theme') === 'dark';
    var bg = dark ? '#07160f' : '#ffffff';
    try {
      if (tg) {
        if (typeof tg.setHeaderColor === 'function') tg.setHeaderColor(bg);
        if (typeof tg.setBackgroundColor === 'function') tg.setBackgroundColor(bg);
        if (typeof tg.setBottomBarColor === 'function') tg.setBottomBarColor(bg);
      }
    } catch (e) {}
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', bg);
  }
  function label(t) { return t === 'dark' ? 'Switch to day mode' : 'Switch to night mode'; }
  function paintBtns() {
    var t = root.getAttribute('data-theme');
    [].forEach.call(document.querySelectorAll('.theme-btn'), function (b) { b.setAttribute('aria-label', label(t)); b.title = label(t); });
  }
  function set(t, persist) {
    t = t === 'dark' ? 'dark' : 'light';
    root.setAttribute('data-theme', t);
    if (persist !== false) { try { localStorage.setItem(KEY, t); } catch (e) {} }
    syncTelegram(); paintBtns();
    try { document.dispatchEvent(new CustomEvent('themechange', { detail: t })); } catch (e) {}
  }
  root.setAttribute('data-theme', initial());

  var api = {
    get: function () { return root.getAttribute('data-theme'); },
    set: function (t) { set(t, true); },
    toggle: function () { set(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true); },
    syncTelegram: syncTelegram
  };
  window.AppTheme = api;

  function mountButton() {
    if (document.querySelector('.theme-btn')) return;
    var bar = document.querySelector('.top-bar'); if (!bar) return;
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'theme-btn'; b.innerHTML = BTN_HTML;
    b.addEventListener('click', function () { api.toggle(); try { if (tg && tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light'); } catch (e) {} });
    bar.appendChild(b); paintBtns(); syncTelegram();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mountButton); else mountButton();

  // follow Telegram's own switch until the user picks manually
  /* Telegram's own scheme no longer overrides the app theme */
  try { if (false && tg && typeof tg.onEvent === 'function') tg.onEvent('themeChanged', function () { if (!stored()) set(tg.colorScheme === 'light' ? 'light' : 'dark', false); }); } catch (e) {}
})();
