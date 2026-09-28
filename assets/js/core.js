/* ============================================================
   Okay Kuzya — core utilities, storage, sound, toasts, i18n engine
   ============================================================ */
window.KZ = window.KZ || {};

(function (K) {
  'use strict';

  /* ------------------------- tiny DOM helpers ------------------------- */
  K.$ = function (sel, root) { return (root || document).querySelector(sel); };
  K.$$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  K.el = function (tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  };
  K.on = function (node, ev, fn, opts) { if (node) node.addEventListener(ev, fn, opts); return node; };

  /* ------------------------- math & random ------------------------- */
  K.rand = function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };
  K.chance = function (p) { return Math.random() < p; };
  K.pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  K.shuffle = function (arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };
  K.pickN = function (arr, n) { return K.shuffle(arr).slice(0, n); };
  K.clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  K.sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  K.debounce = function (fn, ms) {
    var t = null;
    return function () {
      var args = arguments, self = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(self, args); }, ms);
    };
  };

  /* ------------------------- strings ------------------------- */
  K.esc = function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  K.norm = function (s) {
    return String(s == null ? '' : s).toLowerCase()
      .replace(/[’‘`]/g, "'")
      .replace(/[ёЁ]/g, function (c) { return c === 'ё' ? 'е' : 'Е'; })
      .replace(/\s+/g, ' ')
      .trim();
  };
  K.stripPunct = function (s) {
    return K.norm(s).replace(/[!?.,;:()"“”«»]+/g, ' ').replace(/\s+/g, ' ').trim();
  };
  K.titleCase = function (s) {
    return String(s || '').replace(/\S+/g, function (w) { return w.charAt(0).toUpperCase() + w.slice(1); });
  };
  K.cut = function (s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n - 1).trim() + '…' : s; };
  K.interpolate = function (tpl, vars) {
    return String(tpl).replace(/\{(\w+)\}/g, function (m, key) {
      return (vars && vars[key] !== undefined && vars[key] !== null) ? String(vars[key]) : '';
    });
  };
  K.pad2 = function (n) { return (n < 10 ? '0' : '') + n; };

  /* ------------------------- storage ------------------------- */
  var PREFIX = 'okaykuzya:';
  K.store = {
    get: function (key, def) {
      try {
        var raw = localStorage.getItem(PREFIX + key);
        if (raw === null) return def;
        return JSON.parse(raw);
      } catch (e) { return def; }
    },
    set: function (key, val) {
      try { localStorage.setItem(PREFIX + key, JSON.stringify(val)); } catch (e) { /* private mode */ }
      return val;
    },
    del: function (key) { try { localStorage.removeItem(PREFIX + key); } catch (e) {} },
    keys: function () {
      var out = [];
      try {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i);
          if (k && k.indexOf(PREFIX) === 0) out.push(k.slice(PREFIX.length));
        }
      } catch (e) {}
      return out;
    },
    wipe: function () { K.store.keys().forEach(function (k) { K.store.del(k); }); }
  };

  /* ------------------------- no-repeat random pools ------------------------- */
  /* Keeps the conversation from repeating lines twice in a row, even after a
     reload. Pools reset themselves automatically once exhausted. */
  function Pool(key, size) { this.key = key; this.size = size; this.used = K.store.get('pool:' + key, []) || []; }
  Pool.prototype.next = function () {
    if (!this.size) return 0;
    var i, free = [];
    for (i = 0; i < this.size; i++) if (this.used.indexOf(i) === -1) free.push(i);
    if (!free.length) { this.used = []; for (i = 0; i < this.size; i++) free.push(i); }
    var idx = free[Math.floor(Math.random() * free.length)];
    this.used.push(idx);
    if (this.used.length > Math.max(2, Math.floor(this.size * 0.75))) this.used.shift();
    K.store.set('pool:' + this.key, this.used);
    return idx;
  };
  K.pools = {};
  K.freshIndex = function (key, size) {
    if (!K.pools[key] || K.pools[key].size !== size) K.pools[key] = new Pool(key, size);
    return K.pools[key].next();
  };

  /* ------------------------- dates & time ------------------------- */
  K.fmtTime = function (date, opts) {
    return new Intl.DateTimeFormat(K.lang === 'ru' ? 'ru-RU' : 'en-GB', Object.assign({
      hour: '2-digit', minute: '2-digit'
    }, opts || {})).format(date || new Date());
  };
  K.fmtDate = function (date, opts) {
    return new Intl.DateTimeFormat(K.lang === 'ru' ? 'ru-RU' : 'en-US', Object.assign({
      weekday: 'long', day: 'numeric', month: 'long'
    }, opts || {})).format(date || new Date());
  };
  K.fmtDateShort = function (date) {
    return new Intl.DateTimeFormat(K.lang === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'short' }).format(date || new Date());
  };
  K.partOfDay = function (h) {
    h = (h === undefined) ? new Date().getHours() : h;
    if (h < 5) return 'night';
    if (h < 12) return 'morning';
    if (h < 17) return 'day';
    if (h < 22) return 'evening';
    return 'night';
  };

  /* ------------------------- images ------------------------- */
  K.PHOTOS = [
    { file: "Kuzya's Photos/1.png", n: 1 },
    { file: "Kuzya's Photos/2.png", n: 2 },
    { file: "Kuzya's Photos/3.png", n: 3 },
    { file: "Kuzya's Photos/4.png", n: 4 }
  ];
  K.SECRET_COUNT = 22;
  K.SECRETS = (function () {
    var out = [];
    for (var i = 1; i <= K.SECRET_COUNT; i++) out.push('secret photos/' + i + '.jpg');
    return out;
  })();
  K.url = function (path) { return encodeURI(path); };
  K.photoUrl = function (n) { return encodeURI("Kuzya's Photos/" + n + '.png'); };

  /* ------------------------- sound ------------------------- */
  K.sound = {
    enabled: true,
    volume: 0.6,
    _ctx: null,
    ctx: function () {
      if (this._ctx) return this._ctx;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      try { this._ctx = new AC(); } catch (e) { return null; }
      return this._ctx;
    },
    tone: function (freq, dur, type, gainScale) {
      if (!this.enabled) return;
      var ctx = this.ctx();
      if (!ctx) return;
      if (ctx.state === 'suspended') { try { ctx.resume(); } catch (e) {} }
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.value = freq;
      var peak = Math.max(0.0001, this.volume * (gainScale || 0.18));
      var t0 = ctx.currentTime;
      gain.gain.setValueAtTime(0, t0);
      gain.gain.linearRampToValueAtTime(peak, t0 + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + (dur || 0.16));
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(t0); osc.stop(t0 + (dur || 0.16) + 0.02);
    },
    send: function () { this.tone(520, 0.09, 'triangle', 0.12); },
    receive: function () {
      this.tone(760, 0.12, 'sine', 0.1);
      setTimeout(function () { K.sound.tone(980, 0.1, 'sine', 0.08); }, 90);
    },
    tap: function () { this.tone(420, 0.06, 'square', 0.06); },
    bell: function () {
      this.tone(880, 0.5, 'sine', 0.22);
      setTimeout(function () { K.sound.tone(1320, 0.6, 'sine', 0.18); }, 180);
    }
  };
  K.alarmLoop = {
    _id: null,
    start: function () {
      this.stop();
      K.sound.bell();
      this._id = setInterval(function () { K.sound.bell(); }, 1600);
    },
    stop: function () { if (this._id) { clearInterval(this._id); this._id = null; } }
  };

  /* ------------------------- toasts ------------------------- */
  var toastHost = null;
  K.toast = function (title, body, opts) {
    opts = opts || {};
    if (!toastHost) toastHost = K.$('#toasts');
    if (!toastHost) return;
    var node = K.el('div', 'toast');
    if (title) node.appendChild(K.el('b', null, title));
    if (body) node.appendChild(K.el('span', null, body));
    toastHost.appendChild(node);
    if (opts.sound !== false) K.sound.receive();
    var life = opts.life || 4200;
    setTimeout(function () {
      node.classList.add('out');
      setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 260);
    }, life);
    K.on(node, 'click', function () { node.classList.remove('out'); if (node.parentNode) node.parentNode.removeChild(node); });
    return node;
  };

  /* ------------------------- i18n engine ------------------------- */
  K.UI = {};            /* filled by i18n.js */
  K.lang = 'en';
  var langListeners = [];
  K.onLangChange = function (fn) { langListeners.push(fn); };
  K.t = function (key, vars) {
    var dict = K.UI[K.lang] || K.UI.en || {};
    var val = dict[key];
    if (val === undefined) val = (K.UI.en || {})[key];
    if (val === undefined) return key;
    return K.interpolate(val, vars);
  };
  K.setLang = function (lang, silent) {
    K.lang = (lang === 'ru') ? 'ru' : 'en';
    K.store.set('lang', K.lang);
    try { document.documentElement.setAttribute('lang', K.lang); } catch (e) {}
    if (!silent) langListeners.forEach(function (fn) { try { fn(K.lang); } catch (e) {} });
  };
  K.applyI18n = function (root) {
    K.$$('[data-i18n]', root).forEach(function (n) { n.textContent = K.t(n.getAttribute('data-i18n')); });
    K.$$('[data-i18n-ph]', root).forEach(function (n) { n.setAttribute('placeholder', K.t(n.getAttribute('data-i18n-ph'))); });
    K.$$('[data-i18n-title]', root).forEach(function (n) { n.setAttribute('title', K.t(n.getAttribute('data-i18n-title'))); });
    K.$$('[data-i18n-aria]', root).forEach(function (n) { n.setAttribute('aria-label', K.t(n.getAttribute('data-i18n-aria'))); });
  };

  /* ------------------------- language-aware line helpers ------------------------- */
  /* K.say('greetings', {name:'Alex'}) -> random never-repeating English/Russian line */
  K.say = function (category, vars) {
    var bucket = (K.RESP || {})[category];
    if (!bucket) return '';
    var arr = bucket[K.lang] || bucket.en || [];
    if (!arr.length) return '';
    var line = arr[K.freshIndex('resp:' + category + ':' + K.lang, arr.length)];
    return K.interpolate(line, vars);
  };
  K.sayHas = function (category) {
    var b = (K.RESP || {})[category];
    return !!(b && (b[K.lang] || b.en || []).length);
  };
  /* Works with [{en:'',ru:''}, ...] lists (jokes, facts, riddles ...) */
  K.pair = function (list, key, vars) {
    if (!list || !list.length) return null;
    var idx = key ? K.freshIndex('pair:' + key + ':' + K.lang, list.length) : Math.floor(Math.random() * list.length);
    var item = list[idx];
    if (!item) return null;
    var val = (typeof item === 'string') ? item : (item[K.lang] || item.en);
    if (val && typeof val === 'object') {           /* nested {en:{...}, ru:{...}} style */
      return val;
    }
    return K.interpolate(val || '', vars);
  };
  K.pairIndex = function (list, key) {
    if (!list || !list.length) return { index: 0, item: null };
    var idx = K.freshIndex('pair:' + key + ':' + K.lang, list.length);
    return { index: idx, item: list[idx] };
  };
  K.langs = function (obj, vars) {
    if (!obj) return '';
    var val = (typeof obj === 'string') ? obj : (obj[K.lang] || obj.en || '');
    return K.interpolate(val, vars);
  };

  /* ------------------------- misc ------------------------- */
  var idCounter = 0;
  K.uid = function () { idCounter += 1; return 'k' + Date.now().toString(36) + idCounter.toString(36); };

  K.notify = function (title, body) {
    try {
      if (!('Notification' in window)) return false;
      if (Notification.permission === 'granted') {
        new Notification(title, { body: body, icon: K.photoUrl(1), badge: K.photoUrl(1) });
        return true;
      }
      if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(function (p) {
          if (p === 'granted') new Notification(title, { body: body, icon: K.photoUrl(1) });
        });
      }
    } catch (e) {}
    return false;
  };

  K.escapeForHtml = K.esc;
  K.copyToClipboard = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    try {
      var ta = document.createElement('textarea');
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); document.body.removeChild(ta);
      return Promise.resolve();
    } catch (e) { return Promise.reject(e); }
  };
})(window.KZ);
