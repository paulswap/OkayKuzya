/* ============================================================
   Okay Kuzya — app.js
   The UI shell: navigation, home, the chat renderer, the tool
   panels (to-do, timer, alarms), the game room, the gallery,
   settings, toasts, sounds, the starfield and every keyboard
   shortcut. All thinking is done by K.answer(text) from brain.js.
   ============================================================ */
(function (K) {
  'use strict';

  /* ------------------------- configuration ------------------------- */
  var VIEWS = ['home', 'chat', 'tools', 'games', 'gallery', 'settings'];
  var NAV = [
    { id: 'home', icon: '🏠', key: 'view.home' },
    { id: 'chat', icon: '💬', key: 'view.chat' },
    { id: 'tools', icon: '🧰', key: 'view.tools' },
    { id: 'games', icon: '🎮', key: 'view.games' },
    { id: 'gallery', icon: '🖼️', key: 'view.gallery' },
    { id: 'settings', icon: '⚙️', key: 'view.settings' }
  ];
  var THEMES = [
    { id: 'cosmic', swatch: 'linear-gradient(135deg,#050a1f,#12225e 55%,#7c3aed)' },
    { id: 'nebula', swatch: 'linear-gradient(135deg,#0a0420,#3b1380 55%,#ff5ac8)' },
    { id: 'graphite', swatch: 'linear-gradient(135deg,#0d0e11,#2a2e37 55%,#7c3aed)' },
    { id: 'midnight', swatch: 'linear-gradient(135deg,#01030a,#081138 55%,#5b6bff)' },
    { id: 'daylight', swatch: 'linear-gradient(135deg,#eef1f8,#ffffff 55%,#7c3aed)' }
  ];
  /* Chips offered on the home screen and under the chat composer */
  var HOME_CHIPS = ['chip.weather', 'chip.time', 'chip.joke', 'chip.riddle', 'chip.rps', 'chip.quiz',
    'chip.search', 'chip.cartoon', 'chip.meme', 'chip.todo', 'chip.timer', 'chip.secret', 'chip.help'];
  var CHAT_CHIPS = ['chip.joke', 'chip.fact', 'chip.riddle', 'chip.rps', 'chip.quiz', 'chip.meme',
    'chip.todo', 'chip.timer', 'chip.weather', 'chip.cartoon'];
  /* Home page cards: icon, title key, description key, chip that starts it */
  var FEATURES = [
    { icon: '🌤️', t: 'feat.weather.t', d: 'feat.weather.d', chip: 'chip.weather' },
    { icon: '🕰️', t: 'feat.time.t', d: 'feat.time.d', chip: 'chip.time' },
    { icon: '🎮', t: 'feat.games.t', d: 'feat.games.d', chip: 'chip.quiz' },
    { icon: '✅', t: 'feat.todo.t', d: 'feat.todo.d', chip: 'chip.todo' },
    { icon: '📚', t: 'feat.search.t', d: 'feat.search.d', chip: 'chip.search' },
    { icon: '📺', t: 'feat.cartoon.t', d: 'feat.cartoon.d', chip: 'chip.cartoon' },
    { icon: '🖼️', t: 'feat.meme.t', d: 'feat.meme.d', chip: 'chip.meme' },
    { icon: '🤫', t: 'feat.secret.t', d: 'feat.secret.d', chip: 'chip.secret' },
    { icon: '⏱️', t: 'feat.tools.t', d: 'feat.tools.d', chip: 'chip.timer' }
  ];
  var CHIP_ICONS = {
    'chip.weather': '🌤️', 'chip.time': '🕰️', 'chip.joke': '😄', 'chip.riddle': '🧩', 'chip.rps': '✂️',
    'chip.quiz': '❓', 'chip.meme': '🖼️', 'chip.guess': '🔢', 'chip.fact': '💡', 'chip.search': '🔎',
    'chip.cartoon': '📺', 'chip.todo': '✅', 'chip.timer': '⏱️', 'chip.secret': '🤫', 'chip.help': '🧭',
    'chip.theme': '🎨', 'chip.lang': '🌍', 'chip.settings': '⚙️'
  };
  var TIMER_PRESETS = [1, 3, 5, 10, 25];
  var CHAT_LOG_MAX = 60;
  var SOUNDS = { receive: 'receive', send: 'send', tap: 'tap', bell: 'bell' };

  /* ------------------------- live state ------------------------- */
  var prefs = {
    theme: 'cosmic', stars: true, typewriter: false, density: 'cozy',
    sound: true, volume: 0.6, notif: true, galleryTab: 'public'
  };
  var chatLog = [];          /* { who:'user'|'bot', text?, beat? } — persisted, capped */
  var els = {};              /* cached DOM nodes */
  var view = 'home';
  var busy = false;          /* Kuzya is thinking */
  var typingNode = null;
  var lastUserText = '';
  var reducedMotion = false;
  try {
    reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (e) { reducedMotion = false; }

  /* ------------------------- tiny helpers ------------------------- */
  function $(sel) { return K.$(sel); }
  function clear(node) { while (node && node.firstChild) node.removeChild(node.firstChild); return node; }
  function show(node, on) { if (node) node.hidden = !on; return node; }
  function label(node, text) { if (node) node.textContent = text; return node; }
  function play(sound) {
    var name = SOUNDS[sound];
    if (!name || !K.sound || typeof K.sound[name] !== 'function') return;
    K.sound[name]();
  }
  function cacheEls() {
    var ids = ['stars', 'viewTitle', 'statusClock', 'btnLang', 'btnSound', 'btnTheme', 'navSide', 'navTab',
      'btnHelp', 'homeForm', 'homeInput', 'homeSuggest', 'homeChips', 'statRow', 'featureCards', 'siteAd',
      'chatScroll', 'chatIntro', 'messages', 'chatForm', 'chatInput', 'chatSuggest', 'chatChips', 'chatNew',
      'chatStatus', 'todoPanel', 'todoForm', 'todoInput', 'todoList', 'todoEmpty', 'todoCount', 'todoClear',
      'timerPanel', 'timerDisplay', 'timerBar', 'timerPresets', 'timerMin', 'timerSec', 'timerStart',
      'timerPause', 'timerReset', 'alarmPanel', 'alarmTime', 'alarmLabel', 'alarmAdd', 'alarmList', 'alarmTest',
      'gameCards', 'scoreGrid', 'gamesResetScore', 'galleryTabs', 'secretTab', 'galleryNote', 'galleryGrid',
      'galleryRandom', 'gallerySecretHint', 'themeSwatches', 'themeDesc', 'setStars', 'setTypewriter',
      'setDensity', 'langSeg', 'setName', 'setNameSave', 'setJokes', 'setSecrets', 'setSound', 'setVolume',
      'setNotif', 'dataExport', 'dataClearChat', 'dataReset', 'appVersion', 'lightbox', 'lbImg', 'lbCaption',
      'lbClose', 'toasts'];
    ids.forEach(function (id) { els[id] = document.getElementById(id); });
    els.views = {};
    VIEWS.forEach(function (v) { els.views[v] = document.getElementById('view-' + v); });
  }


  /* ------------------------- preferences ------------------------- */
  function loadPrefs() {
    var saved = K.store.get('prefs', {}) || {};
    Object.keys(prefs).forEach(function (k) {
      if (saved[k] !== undefined && saved[k] !== null) prefs[k] = saved[k];
    });
    prefs.theme = K.store.get('theme', prefs.theme);
    prefs.density = K.store.get('density', prefs.density);
    prefs.sound = K.store.get('sound', prefs.sound);
    prefs.volume = K.store.get('volume', prefs.volume);
    prefs.stars = K.store.get('stars', prefs.stars);
    prefs.typewriter = K.store.get('typewriter', prefs.typewriter);
    prefs.notif = K.store.get('notif', prefs.notif);
    prefs.galleryTab = K.store.get('galleryTab', prefs.galleryTab);
    var themeIds = THEMES.map(function (t) { return t.id; });
    if (themeIds.indexOf(prefs.theme) === -1) prefs.theme = 'cosmic';
    if (prefs.density !== 'compact') prefs.density = 'cozy';
    prefs.volume = K.clamp(Number(prefs.volume) || 0.6, 0, 1);
    prefs.notif = prefs.notif !== false;
    prefs.stars = prefs.stars !== false;
    prefs.typewriter = prefs.typewriter === true;
    prefs.sound = prefs.sound !== false;
    return prefs;
  }
  function savePrefs() {
    K.store.set('prefs', prefs);
    K.store.set('theme', prefs.theme);
    K.store.set('density', prefs.density);
    K.store.set('sound', prefs.sound);
    K.store.set('volume', prefs.volume);
    K.store.set('stars', prefs.stars);
    K.store.set('typewriter', prefs.typewriter);
    K.store.set('notif', prefs.notif);
    K.store.set('galleryTab', prefs.galleryTab);
    return prefs;
  }
  /* Push the stored preferences into the live document */
  function applyPrefs() {
    var root = document.documentElement;
    root.setAttribute('data-theme', prefs.theme);
    root.setAttribute('data-density', prefs.density);
    K.sound.enabled = prefs.sound;
    K.sound.volume = prefs.volume;
    if (els.setSound) els.setSound.checked = prefs.sound;
    if (els.setVolume) els.setVolume.value = String(Math.round(prefs.volume * 100));
    if (els.setStars) els.setStars.checked = prefs.stars;
    if (els.setTypewriter) els.setTypewriter.checked = prefs.typewriter;
    if (els.setDensity) els.setDensity.checked = prefs.density === 'compact';
    if (els.setNotif) els.setNotif.checked = prefs.notif;
    if (els.btnSound) els.btnSound.classList.toggle('is-off', !prefs.sound);
    return prefs;
  }

  /* ------------------------- navigation ------------------------- */
  function navItem(def) {
    var btn = K.el('button', 'nav-btn');
    btn.type = 'button';
    btn.setAttribute('data-goto', def.id);
    btn.appendChild(K.el('span', 'ic', def.icon));
    btn.appendChild(K.el('span', 'nav-label', K.t(def.key)));
    btn.setAttribute('title', K.t(def.key));
    return btn;
  }
  /* The little counter on the to-do nav button */
  function hasBadge(id) {
    if (id === 'tools') {
      var n = K.TODO.count();
      return n ? String(n) : '';
    }
    if (id === 'gallery') return K.SECRET.remaining() ? '' : '★';
    return '';
  }
  function renderNav() {
    [els.navSide, els.navTab].forEach(function (host) {
      if (!host) return;
      clear(host);
      NAV.forEach(function (def) {
        var btn = navItem(def);
        var badge = hasBadge(def.id);
        if (badge) btn.appendChild(K.el('span', 'badge', badge));
        host.appendChild(btn);
      });
    });
    markNav();
  }
  function markNav() {
    K.$$('[data-goto]').forEach(function (btn) {
      if (btn.classList.contains('nav-btn')) btn.classList.toggle('is-current', btn.getAttribute('data-goto') === view);
    });
    VIEWS.forEach(function (v) {
      if (els.views[v]) els.views[v].classList.toggle('is-active', v === view);
    });
    label(els.viewTitle, K.t('view.' + view));
    document.body.setAttribute('data-page', view);
  }
  function nav(next, opts) {
    opts = opts || {};
    if (VIEWS.indexOf(next) === -1) next = 'home';
    view = next;
    markNav();
    if (!opts.silent) {
      try { history.replaceState(null, '', '#' + next); } catch (e) { location.hash = next; }
    }
    if (next === 'chat') {
      if (!opts.silent) setTimeout(function () { if (els.chatInput) els.chatInput.focus(); }, 60);
      scrollChat();
    }
    if (next === 'games') { renderGames(); renderScores(); }
    if (next === 'gallery') renderGallery();
    if (next === 'tools') { renderTodos(); renderAlarms(); renderTimer(); }
    return view;
  }
  function routeFromHash() {
    var want = String(location.hash || '').replace(/^#\/?/, '');
    nav(VIEWS.indexOf(want) === -1 ? 'home' : want, { silent: true });
  }

  /* ============================================================
     home
     ============================================================ */
  function chipNode(chip, cls) {
    var btn = K.el('button', cls || 'chip');
    btn.type = 'button';
    var text = str(chip.label) || str(chip.say);
    var say = str(chip.say) || text;
    btn.textContent = (chip.icon ? chip.icon + ' ' : '') + text;
    btn.setAttribute('data-say', say);
    btn.setAttribute('title', say);
    K.on(btn, 'click', function () { play('tap'); ask(btn.getAttribute('data-say'), true); });
    return btn;
  }
  /* only ever hand strings to the DOM — never "[object Object]" */
  function str(v) { return typeof v === 'string' ? v : ''; }
  function chipRow(keys, cls) {
    var host = K.el('div', cls || 'm-actions');
    chipsByKeys(keys).forEach(function (chip) { host.appendChild(chipNode(chip)); });
    return host;
  }
  /* Chips reach this point in two shapes: the home/chat rows hand over plain
     keys ('chip.joke'), while every beat from brain.js (chipsFor/packChip and
     the inline presets) already carries a ready { key, label, say } object.
     Normalise both into one chip object so neither can end up as a key. */
  function normalizeChip(item) {
    if (item && typeof item === 'object') {
      var label = str(item.label) || str(item.say) || (item.key ? K.t(String(item.key)) : '');
      return { key: item.key || label, label: label, say: str(item.say) || label, icon: item.icon || '' };
    }
    var key = String(item === undefined || item === null ? '' : item);
    var hit = null;
    K.svc.chips().forEach(function (c) { if (c.key === key) hit = c; });
    return hit || { key: key, label: K.t(key), say: K.t(key), icon: '' };
  }
  /* Every chip K.svc knows, filtered (and translated) by key */
  function chipsByKeys(keys) {
    return (keys || []).map(normalizeChip);
  }
  function renderHomeChips() {
    if (!els.homeChips) return;
    clear(els.homeChips);
    chipsByKeys(HOME_CHIPS).forEach(function (chip) { els.homeChips.appendChild(chipNode(chip)); });
  }
  function renderChatChips() {
    if (!els.chatChips) return;
    clear(els.chatChips);
    chipsByKeys(CHAT_CHIPS).forEach(function (chip) { els.chatChips.appendChild(chipNode(chip)); });
  }
  function renderFeatures() {
    if (!els.featureCards) return;
    clear(els.featureCards);
    FEATURES.forEach(function (f) {
      var card = K.el('button', 'card');
      card.type = 'button';
      card.appendChild(K.el('span', 'card-ic', f.icon));
      card.appendChild(K.el('b', null, K.t(f.t)));
      card.appendChild(K.el('small', null, K.t(f.d)));
      card.appendChild(K.el('span', 'card-tag', K.t(f.chip)));
      card.setAttribute('data-say', K.t(f.chip));
      K.on(card, 'click', function () { play('tap'); ask(K.t(f.chip), true); });
      els.featureCards.appendChild(card);
    });
  }
  function statNode(icon, value, key) {
    var node = K.el('div', 'stat');
    node.appendChild(K.el('span', 'si', icon));
    var body = K.el('span');
    body.appendChild(K.el('b', null, value));
    body.appendChild(K.el('small', null, K.t(key)));
    node.appendChild(body);
    return node;
  }
  function renderStats(silent) {
    if (!els.statRow) return;
    var city = K.store.get('city', '') || '';
    var open = K.TODO.count();
    var secrets = K.SECRET.found.length + '/' + K.SECRET.total;
    /* three offline stats right away — weather fills in when it arrives */
    function paint(weatherText, weatherKey) {
      clear(els.statRow);
      els.statRow.appendChild(statNode('🌤️', weatherText, weatherKey));
      els.statRow.appendChild(statNode('🕰️', K.fmtTime(new Date()), 'stat.time'));
      els.statRow.appendChild(statNode('✅', String(open), 'stat.tasks'));
      els.statRow.appendChild(statNode('🤫', secrets, 'stat.secrets'));
    }
    paint(K.t('stat.loading'), 'stat.weather');
    if (silent) return;
    K.svc.weather(city).then(function (w) {
      if (!w) { paint(K.t('stat.location'), 'stat.weather'); return; }
      paint(w.temp + '° · ' + w.condition.emoji, 'stat.weather');
    }).catch(function () { paint(K.t('stat.location'), 'stat.weather'); });
  }

  /* ============================================================
     the input suggestions (home search bar + chat composer)
     ============================================================ */
  function Suggester(input, host, list) {
    this.input = input;
    this.host = host;
    this.rows = [];
    this.index = -1;
    var self = this;
    if (!input || !host) return;
    K.on(input, 'input', function () { self.update(input.value); });
    K.on(input, 'keydown', function (e) { self.keys(e); });
    K.on(input, 'blur', function () { setTimeout(function () { self.hide(); }, 120); });
    if (list) K.on(list, 'mousedown', function (e) { e.preventDefault(); });
  }
  Suggester.prototype.update = function (query) {
    var self = this;
    var items = K.svc.suggest(query, 5);
    clear(this.host);
    this.rows = [];
    this.index = -1;
    if (!items.length) { this.hide(); return; }
    items.forEach(function (item) {
      var row = K.el('button', 'sug-item');
      row.type = 'button';
      var icon = CHIP_ICONS[item.key] || (item.key === 'city' ? '📍' : '💡');
      row.appendChild(K.el('span', 'sug-ic', icon));
      row.appendChild(K.el('span', 'sug-label', item.label));
      if (item.key === 'city') row.appendChild(K.el('span', 'sug-kind', '📍'));
      row.setAttribute('data-say', item.say || item.label);
      K.on(row, 'mousedown', function (e) {
        e.preventDefault();
        self.hide();
        ask(row.getAttribute('data-say'), true);
      });
      self.host.appendChild(row);
      self.rows.push(row);
    });
    this.host.hidden = false;
  };
  Suggester.prototype.keys = function (e) {
    if (this.host.hidden || !this.rows.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      var step = e.key === 'ArrowDown' ? 1 : -1;
      this.index = (this.index + step + this.rows.length + 1) % (this.rows.length + 1);
      if (this.index === this.rows.length) this.index = 0;
      var idx = this.index;
      this.rows.forEach(function (r, i) { r.classList.toggle('is-sel', i === idx); });
      return;
    }
    if (e.key === 'Escape') { this.hide(); return; }
    if (e.key === 'Enter' && this.index >= 0 && this.rows[this.index]) {
      e.preventDefault();
      var say = this.rows[this.index].getAttribute('data-say');
      this.hide();
      ask(say, true);
    }
  };
  Suggester.prototype.hide = function () {
    if (this.host) this.host.hidden = true;
    clear(this.host);
    this.rows = [];
    this.index = -1;
  };


  /* ============================================================
     chat rendering
     ============================================================ */
  function scrollChat() {
    if (!els.chatScroll) return;
    els.chatScroll.scrollTop = els.chatScroll.scrollHeight;
  }
  function addNode(node, noScroll) {
    if (!els.messages) return node;
    els.messages.appendChild(node);
    if (els.chatIntro) els.chatIntro.hidden = els.messages.children.length > 0;
    if (!noScroll) scrollChat();
    return node;
  }
  function botNode() {
    var msg = K.el('div', 'msg bot');
    var avatar = K.el('img', 'm-avatar');
    avatar.src = K.photoUrl(1);
    avatar.alt = 'Kuzya';
    msg.appendChild(avatar);
    var bubble = K.el('div', 'bubble');
    msg.appendChild(bubble);
    return msg;
  }
  function userNode(text) {
    var msg = K.el('div', 'msg user');
    var avatar = K.el('img', 'm-avatar');
    avatar.src = K.photoUrl(2);
    avatar.alt = 'You';
    msg.appendChild(avatar);
    var bubble = K.el('div', 'bubble');
    bubble.appendChild(K.el('p', 'm-line', text));
    msg.appendChild(bubble);
    return msg;
  }
  function systemNode(text) {
    var msg = K.el('div', 'msg system');
    var bubble = K.el('div', 'bubble');
    bubble.appendChild(K.el('p', 'm-line', text));
    msg.appendChild(bubble);
    return msg;
  }
  /* Numbered lines ("1. ⬜ buy milk") become a real list, the rest is prose */
  function appendLines(host, lines) {
    var list = null;
    (lines || []).forEach(function (line) {
      var text = line === null || line === undefined ? '' : String(line);
      if (!text) return;
      if (/^\s*\d+[.)]\s+/.test(text)) {
        if (!list) { list = K.el('ul', 'm-list'); host.appendChild(list); }
        list.appendChild(K.el('li', null, text.replace(/^\s*\d+[.)]\s+/, '')));
        return;
      }
      list = null;
      host.appendChild(K.el('p', 'm-line', text));
    });
  }
  function cardNode(card) {
    var wrap = K.el('div', 'm-card');
    if (card.emoji || card.title) {
      var head = K.el('p', 'm-line');
      if (card.emoji) head.appendChild(document.createTextNode(card.emoji + ' '));
      head.appendChild(K.el('b', null, card.title || ''));
      wrap.appendChild(head);
    }
    appendLines(wrap, card.lines);
    if (card.footer) wrap.appendChild(K.el('p', 'm-note', card.footer));
    return wrap;
  }
  function photoNode(photo) {
    var fig = K.el('figure', 'm-photo' + (photo.n ? ' secret' : ''));
    var img = K.el('img');
    img.src = photo.url;
    img.alt = photo.caption || 'Kuzya';
    img.loading = 'lazy';
    K.on(img, 'click', function () { openLightbox(photo.url, photo.caption || ''); });
    fig.appendChild(img);
    if (photo.caption) fig.appendChild(K.el('figcaption', null, photo.caption));
    return fig;
  }
  /* https://www.youtube.com/watch?v=ID -> the matching thumbnail */
  function youTubeId(url) {
    var m = String(url || '').match(/[?&]v=([\w-]{6,})/) || String(url || '').match(/youtu\.be\/([\w-]{6,})/);
    return m ? m[1] : '';
  }
  function linkNode(link) {
    if (link.kind === 'view') {
      var btn = K.el('button', 'm-action');
      btn.type = 'button';
      btn.textContent = link.label || K.t('nav.settings');
      btn.setAttribute('data-goto', String(link.url || '').replace(/^#/, ''));
      K.on(btn, 'click', function () { play('tap'); nav(btn.getAttribute('data-goto')); });
      return btn;
    }
    var a = K.el('a', link.kind === 'video' ? 'm-video' : 'm-action');
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener';
    a.title = K.t('open');
    if (link.kind === 'video') {
      var thumb = K.el('div', 'thumb');
      var id = youTubeId(link.url);
      if (id) {
        var img = K.el('img');
        img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
        img.alt = '';
        img.loading = 'lazy';
        thumb.appendChild(img);
      }
      thumb.appendChild(K.el('span', 'play', '▶'));
      a.appendChild(thumb);
      a.appendChild(K.el('div', 'vmeta', link.label || link.url));
      return a;
    }
    a.textContent = link.label || K.t('open');
    return a;
  }
  /* Kuzya's answer: text, card, photo, link and the chip row */
  function renderBeat(beat, restore) {
    if (!beat) return null;
    var msg = botNode();
    var bubble = msg.lastChild;
    var rest = [];
    if (beat.card) rest.push(cardNode(beat.card));
    if (beat.photo) rest.push(photoNode(beat.photo));
    if (beat.link) rest.push(linkNode(beat.link));
    if (beat.chips && beat.chips.length) rest.push(chipRow(beat.chips));
    if (beat.text) {
      bubble.appendChild(K.el('p', 'm-line', beat.text));
      if (!restore && prefs.typewriter && !reducedMotion && beat.text.length > 2) {
        typewrite(bubble.firstChild, beat.text, rest);
      } else {
        rest.forEach(function (n) { bubble.appendChild(n); });
      }
    } else {
      rest.forEach(function (n) { bubble.appendChild(n); });
    }
    addNode(msg);
    play(beat.sound);
    if (beat.toast && !restore) K.toast(beat.toast.title, beat.toast.body);
    if (beat.view && VIEWS.indexOf(beat.view) !== -1 && !restore) nav(beat.view, { silent: true });
    if (beat.after && !restore) setTimeout(function () { renderBeat(beat.after); }, 1600);
    pushLog({ who: 'bot', beat: beat });
    refreshPanels();
    return msg;
  }
  /* Letter by letter, then everything else appears (settings switch) */
  function typewrite(node, text, rest) {
    var i = 0;
    var per = Math.max(7, Math.min(28, Math.floor(900 / Math.max(1, text.length))));
    node.textContent = '';
    var timer = setInterval(function () {
      i += 1;
      node.textContent = text.slice(0, i);
      scrollChat();
      if (i >= text.length) {
        clearInterval(timer);
        rest.forEach(function (n) { node.parentNode.appendChild(n); });
        scrollChat();
      }
    }, per);
  }




  /* ============================================================
     sending & receiving
     ============================================================ */
  function setThinking(on) {
    label(els.chatStatus, K.t(on ? 'chat.listening' : 'chat.status'));
    if (on) {
      if (typingNode) return;
      typingNode = botNode();
      var bubble = typingNode.lastChild;
      bubble.setAttribute('title', K.t('chat.typing'));
      var dots = K.el('span', 'm-typing');
      for (var i = 0; i < 3; i++) dots.appendChild(K.el('i'));
      bubble.appendChild(dots);
      addNode(typingNode);
    } else if (typingNode) {
      if (typingNode.parentNode) typingNode.parentNode.removeChild(typingNode);
      typingNode = null;
    }
  }
  function send(text) {
    var raw = String(text === undefined || text === null ? '' : text).trim();
    if (!raw || busy) return null;
    lastUserText = raw;
    addNode(userNode(raw));
    pushLog({ who: 'user', text: raw });
    if (els.chatInput) els.chatInput.value = '';
    if (suggesters) suggesters.forEach(function (s) { s.hide(); });
    busy = true;
    setThinking(true);
    var answer = K.answer(raw);
    Promise.resolve(answer).then(function (beat) {
      busy = false;
      setThinking(false);
      renderBeat(beat);
    })['catch'](function () {
      busy = false;
      setThinking(false);
      renderBeat({ text: K.t('toast.offlineBody'), chips: K.chipsFor(['chip.help']) });
    });
    return answer;
  }
  /* Send from anywhere: opens the chat first, then talks */
  function ask(text, toChat) {
    if (toChat !== false && view !== 'chat') nav('chat', { silent: true });
    return send(text);
  }

  /* ------------------------- chat history ------------------------- */
  function pushLog(row) {
    chatLog.push(row);
    if (chatLog.length > CHAT_LOG_MAX) chatLog = chatLog.slice(-CHAT_LOG_MAX);
    K.store.set('chat', chatLog);
    return row;
  }
  function restoreChat() {
    var saved = K.store.get('chat', []);
    if (!Array.isArray(saved) || !saved.length) {
      if (els.chatIntro) els.chatIntro.hidden = false;
      return false;
    }
    chatLog = [];
    saved.slice(-CHAT_LOG_MAX).forEach(function (row) {
      if (!row) return;
      if (row.who === 'user' && row.text) {
        addNode(userNode(row.text), true);
        chatLog.push(row);
      } else if (row.who === 'bot' && row.beat) {
        renderBeat(row.beat, true);
      }
    });
    scrollChat();
    return true;
  }
  function clearChat(silent) {
    chatLog = [];
    K.store.set('chat', chatLog);
    if (els.messages) clear(els.messages);
    if (els.chatIntro) els.chatIntro.hidden = false;
    if (!silent) {
      addNode(systemNode(K.t('chat.cleared')));
      K.toast(K.t('chat.new'), K.t('chat.cleared'));
    }
    return true;
  }

  /* ------------------------- lightbox ------------------------- */
  function openLightbox(url, caption) {
    if (!els.lightbox || !url) return false;
    els.lbImg.src = url;
    els.lbImg.alt = caption || 'Kuzya';
    label(els.lbCaption, caption || '');
    els.lightbox.hidden = false;
    els.lightbox.classList.add('is-open');
    return true;
  }
  function closeLightbox() {
    if (!els.lightbox) return;
    els.lightbox.hidden = true;
    els.lightbox.classList.remove('is-open');
    els.lbImg.removeAttribute('src');
  }
  function savePhoto() {
    var url = els.lbImg.getAttribute('src');
    if (!url) return false;
    var a = document.createElement('a');
    a.href = url;
    a.download = String(url).split('/').pop() || 'kuzya.jpg';
    a.target = '_blank';
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    K.toast(K.t('toast.photoSaved'), els.lbCaption ? els.lbCaption.textContent : '');
    return true;
  }

  /* Panels that mirror the brain's state after every answer */
  function refreshPanels() {
    renderTodos();
    renderScores();
    renderAlarms();
    renderGallery();
    renderNav();
  }

  /* ============================================================
     to-do panel
     ============================================================ */
  function renderTodos() {
    if (!els.todoList) return 0;
    var items = K.TODO.items || [];
    clear(els.todoList);
    show(els.todoEmpty, !items.length);
    label(els.todoCount, items.length ? K.todoCountLine() : '');
    items.forEach(function (it) {
      var li = K.el('li', 'todo-item' + (it.done ? ' done' : ''));
      var box = K.el('input');
      box.type = 'checkbox';
      box.checked = !!it.done;
      box.setAttribute('aria-label', it.text);
      K.on(box, 'change', function () {
        K.TODO.toggle(it.id);
        play('tap');
        renderTodos();
        renderNav();
      });
      li.appendChild(box);
      li.appendChild(K.el('span', 't-text', it.text));
      var del = K.el('button', 't-del', '✕');
      del.type = 'button';
      del.setAttribute('aria-label', '✕ ' + it.text);
      K.on(del, 'click', function () {
        K.TODO.remove(it.id);
        play('tap');
        renderTodos();
        renderNav();
      });
      li.appendChild(del);
      els.todoList.appendChild(li);
    });
    return items.length;
  }
  function addTodoFromPanel(text) {
    var item = K.TODO.add(text);
    if (!item) return null;
    play('send');
    K.toast(K.t('todo.addedToast'), item.text);
    renderTodos();
    renderNav();
    return item;
  }
  function clearDoneFromPanel() {
    var done = K.TODO.clearDone();
    if (done) {
      play('tap');
      K.toast(K.t('todo.allClear'), K.t('todo.clearedMsg', { n: done }));
    } else {
      K.toast(K.t('todo.allClear'), K.t('todo.empty'));
    }
    renderTodos();
    renderNav();
    return done;
  }



  /* ============================================================
     timer — a countdown that lives in the panel and rings in the chat
     ============================================================ */
  var timer = { total: 0, left: 0, end: 0, label: '', paused: false, ringing: false };
  var timerStatus = null;
  function two(n) { return (n < 10 ? '0' : '') + n; }
  function timerText(sec) {
    var s = Math.max(0, Math.round(sec));
    var h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), r = s % 60;
    return h ? (h + ':' + two(m) + ':' + two(r)) : (two(m) + ':' + two(r));
  }
  /* The little status line (“Ready” / “Running” / “Paused”) belongs to us */
  function ensureTimerStatus() {
    if (timerStatus) return timerStatus;
    if (!els.timerPanel) return null;
    timerStatus = K.el('p', 'muted tiny');
    var anchor = els.timerBar && els.timerBar.parentNode;
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(timerStatus, anchor.nextSibling);
    else els.timerPanel.appendChild(timerStatus);
    return timerStatus;
  }
  function renderTimer() {
    if (!els.timerDisplay) return timer;
    var active = timer.total > 0;
    label(els.timerDisplay, active ? timerText(timer.left) : '00:00');
    els.timerDisplay.classList.toggle('ringing', timer.ringing);
    if (els.timerBar) els.timerBar.style.width = (active ? K.clamp((timer.left / timer.total) * 100, 0, 100) : 0) + '%';
    if (els.timerPause) {
      els.timerPause.disabled = !active || timer.ringing;
      label(els.timerPause, timer.paused ? K.t('timer.start') : K.t('timer.pause'));
    }
    var status = ensureTimerStatus();
    if (status) {
      label(status, timer.ringing ? K.t('timer.done')
        : (timer.paused ? K.t('timer.paused')
          : (active ? K.t('timer.running') : K.t('timer.ready'))));
    }
    return timer;
  }
  function renderTimerPresets() {
    if (!els.timerPresets) return;
    clear(els.timerPresets);
    TIMER_PRESETS.forEach(function (mins) {
      var chip = K.el('button', 'chip', mins + ' ' + K.t('timer.min'));
      chip.type = 'button';
      chip.setAttribute('title', K.t('timer.presets'));
      K.on(chip, 'click', function () { play('tap'); K.uiTimer.start(mins * 60, '', true); });
      els.timerPresets.appendChild(chip);
    });
  }
  function ringTimer() {
    if (timer.ringing) return false;
    timer.ringing = true;
    K.alarmLoop.start();
    if (prefs.notif) K.notify(K.t('timer.done'), K.t('timer.doneBody'));
    K.toast(K.t('timer.done'), K.t('timer.doneBody'), { life: 9000 });
    renderBeat(K.msgCard({ emoji: '⏰', title: K.t('timer.done'), lines: [K.t('timer.doneBody')] }, {
      chips: K.chipsFor(['chip.timer', 'chip.joke']), sound: 'bell'
    }));
    renderTimer();
    setTimeout(function () {
      K.alarmLoop.stop();
      timer.ringing = false;
      timer.total = 0;
      timer.left = 0;
      renderTimer();
      renderNav();
    }, 9000);
    return true;
  }
  function timerTick() {
    if (!timer.total) return false;
    if (!timer.paused && !timer.ringing) {
      timer.left = Math.max(0, Math.round((timer.end - Date.now()) / 1000));
      if (timer.left <= 0) return ringTimer();
    }
    renderTimer();
    return false;
  }
  /* Start (or restart) the countdown — brain.js sends the returned beat to the chat */
  function startTimer(sec, labelText, quiet) {
    sec = K.clamp(Math.round(Number(sec) || 0), 1, 12 * 3600);
    timer.total = sec;
    timer.left = sec;
    timer.end = Date.now() + sec * 1000;
    timer.label = String(labelText || '').trim();
    timer.paused = false;
    timer.ringing = false;
    K.alarmLoop.stop();
    if (els.timerMin) els.timerMin.value = String(Math.floor(sec / 60));
    if (els.timerSec) els.timerSec.value = String(sec % 60);
    renderTimer();
    renderNav();
    var pretty = K.fmtDuration(sec);
    if (quiet) K.toast(K.t('toast.timerSet'), K.t('toast.timerSetBody', { time: pretty }), { life: 3000 });
    return K.msgCard({
      emoji: '⏱️',
      title: K.t('toast.timerSet'),
      lines: [pretty + (timer.label ? ' · ' + timer.label : '')]
    }, {
      chips: K.chipsFor(['chip.timer', 'chip.help']),
      sound: 'receive',
      toast: quiet ? null : { title: K.t('toast.timerSet'), body: K.t('toast.timerSetBody', { time: pretty }) }
    });
  }
  K.uiTimer = {
    /* brain.js calls K.uiTimer.start(sec, label) and sends the beat to the chat */
    start: function (sec, labelText) { return startTimer(sec, labelText, false); },
    /* Pause toggles; returns true when the timer is now paused */
    pause: function () {
      if (!timer.total || timer.ringing) return false;
      if (timer.paused) {
        timer.paused = false;
        timer.end = Date.now() + timer.left * 1000;
      } else {
        timer.left = Math.max(0, Math.round((timer.end - Date.now()) / 1000));
        timer.paused = true;
      }
      renderTimer();
      return timer.paused;
    },
    /* Returns true when there was something to stop */
    stop: function () {
      var had = !!(timer.total || timer.ringing);
      K.alarmLoop.stop();
      timer.total = 0;
      timer.left = 0;
      timer.end = 0;
      timer.paused = false;
      timer.ringing = false;
      renderTimer();
      renderNav();
      return had;
    },
    left: function () { return timer.total ? timer.left : 0; },
    running: function () { return timer.total > 0 && !timer.paused && !timer.ringing; },
    text: timerText
  };

  /* ============================================================
     alarms — one shot per day, ringing until the user stops them
     ============================================================ */
  var alarms = [];
  var ringingAlarm = null;
  var ringingTimeout = null;
  function nextDay(ms) {
    var d = new Date(Number(ms) || Date.now());
    d.setDate(d.getDate() + 1);
    return d.getTime();
  }
  function saveAlarms() { K.store.set('alarms', alarms); return alarms; }
  function loadAlarms() {
    var saved = K.store.get('alarms', []);
    var now = Date.now();
    alarms = Array.isArray(saved) ? saved.filter(function (a) { return a && a.at; }).map(function (a) {
      return { id: a.id || K.uid(), at: Number(a.at), label: String(a.label || ''), on: a.on !== false };
    }) : [];
    alarms.forEach(function (a) { if (a.on && a.at <= now + 1000) a.at = nextDay(a.at); });
    return alarms;
  }
  function alarmRows() {
    return alarms.slice().sort(function (a, b) { return a.at - b.at; });
  }
  function renderAlarms() {
    if (!els.alarmList) return alarms.length;
    clear(els.alarmList);
    var rows = alarmRows();
    if (!rows.length) {
      els.alarmList.appendChild(K.el('li', 'muted tiny', K.t('alarm.none')));
      return 0;
    }
    rows.forEach(function (a) {
      var time = K.fmtTime(new Date(a.at));
      var li = K.el('li', 'alarm-item' + (a.on ? '' : ' off'));
      li.appendChild(K.el('span', 'a-time', time));
      li.appendChild(K.el('span', 'a-label', a.label || ''));
      var sw = K.el('label', 'switch');
      var box = K.el('input');
      box.type = 'checkbox';
      box.checked = a.on !== false;
      box.setAttribute('aria-label', time);
      K.on(box, 'change', function () { K.uiAlarm.toggle(a.id); });
      sw.appendChild(box);
      sw.appendChild(K.el('span'));
      li.appendChild(sw);
      if (a.id === ringingAlarm) {
        var stopBtn = K.el('button', 'ghost-btn', K.t('alarm.stopped'));
        stopBtn.type = 'button';
        K.on(stopBtn, 'click', function () { play('tap'); stopRinging(); });
        li.appendChild(stopBtn);
      }
      var del = K.el('button', 'a-del', '✕');
      del.type = 'button';
      del.setAttribute('aria-label', '✕ ' + time);
      K.on(del, 'click', function () { play('tap'); K.uiAlarm.remove(a.id); });
      li.appendChild(del);
      els.alarmList.appendChild(li);
    });
    return rows.length;
  }
  function stopRinging() {
    K.alarmLoop.stop();
    if (ringingTimeout) { clearTimeout(ringingTimeout); ringingTimeout = null; }
    ringingAlarm = null;
    renderAlarms();
    return true;
  }
  function ringAlarm(alarm) {
    var time = K.fmtTime(new Date(alarm.at));
    ringingAlarm = alarm.id;
    K.alarmLoop.start();
    if (prefs.notif) K.notify(K.t('alarm.ringing'), K.t('alarm.ringingBody', { time: time }));
    K.toast(K.t('alarm.ringing'), K.t('alarm.ringingBody', { time: time }), { life: 9000 });
    renderBeat(K.msgCard({
      emoji: '⏰',
      title: K.t('alarm.ringing'),
      lines: [alarm.label ? alarm.label + ' · ' + time : K.t('alarm.ringingBody', { time: time })]
    }, { chips: K.chipsFor(['chip.timer', 'chip.joke']), sound: 'bell' }));
    alarm.on = false;
    alarm.at = nextDay(alarm.at);
    saveAlarms();
    renderAlarms();
    renderNav();
    if (ringingTimeout) clearTimeout(ringingTimeout);
    ringingTimeout = setTimeout(stopRinging, 45000);
    return true;
  }
  function alarmTick() {
    var now = Date.now(), hit = null;
    alarms.forEach(function (a) {
      if (!hit && a.on !== false && a.at <= now) hit = a;
    });
    if (hit) return ringAlarm(hit);
    return false;
  }


  K.uiAlarm = {
    /* brain.js: K.uiAlarm.add(at, label) -> a chat beat */
    add: function (at, labelText) {
      var when = Number(at && at.getTime ? at.getTime() : at);
      if (!when || !isFinite(when)) when = Date.now() + 3600000;
      if (when <= Date.now()) when = nextDay(when);
      var alarm = { id: K.uid(), at: when, label: String(labelText || '').trim().slice(0, 80), on: true };
      alarms.push(alarm);
      saveAlarms();
      renderAlarms();
      renderNav();
      var time = K.fmtTime(new Date(when));
      return K.msgCard({
        emoji: '⏰',
        title: K.t('alarm.added', { time: time }),
        lines: alarm.label ? [alarm.label] : []
      }, {
        chips: K.chipsFor(['chip.timer', 'chip.help']),
        sound: 'receive',
        toast: { title: K.t('toast.alarmSet'), body: K.t('toast.alarmSetBody', { time: time }) }
      });
    },
    /* brain.js: K.uiAlarm.list() -> a beat, or null when nothing is set */
    list: function () {
      var rows = alarmRows();
      if (!rows.length) return null;
      return K.msgCard({
        emoji: '⏰',
        title: K.t('alarm.title'),
        lines: rows.map(function (a, i) {
          return (i + 1) + '. ' + K.fmtTime(new Date(a.at)) + (a.label ? ' · ' + a.label : '') + (a.on === false ? ' ⏸' : '');
        })
      }, { chips: K.chipsFor(['chip.timer', 'chip.help']), sound: 'receive' });
    },
    remove: function (id) {
      alarms = alarms.filter(function (a) { return a.id !== id; });
      if (ringingAlarm === id) stopRinging();
      saveAlarms();
      renderAlarms();
      renderNav();
      return true;
    },
    toggle: function (id) {
      var hit = null;
      alarms.forEach(function (a) {
        if (a.id !== id) return;
        a.on = a.on === false;
        if (a.on && a.at <= Date.now()) a.at = nextDay(a.at);
        hit = a;
      });
      if (hit && hit.id === ringingAlarm && hit.on === false) stopRinging();
      saveAlarms();
      renderAlarms();
      renderNav();
      return hit;
    },
    rows: alarmRows,
    count: function () { return alarms.filter(function (a) { return a.on !== false; }).length; },
    stop: stopRinging
  };

  /* ============================================================
     game room & scoreboard
     ============================================================ */
  function renderGames() {
    if (!els.gameCards) return 0;
    clear(els.gameCards);
    var list = K.games.list || [];
    list.forEach(function (game) {
      var card = K.el('button', 'card');
      card.type = 'button';
      card.appendChild(K.el('span', 'card-ic', game.icon));
      card.appendChild(K.el('b', null, K.t(game.titleKey)));
      card.appendChild(K.el('small', null, K.t(game.descKey)));
      card.appendChild(K.el('span', 'card-tag', K.t('games.play')));
      /* The title is exactly what K.games.byText() understands */
      card.setAttribute('data-say', K.t(game.titleKey));
      card.setAttribute('title', K.t(game.titleKey));
      K.on(card, 'click', function () { play('tap'); ask(card.getAttribute('data-say'), true); });
      els.gameCards.appendChild(card);
    });
    return list.length;
  }
  function renderScores() {
    if (!els.scoreGrid) return null;
    clear(els.scoreGrid);
    K.SCORE.board().forEach(function (row) {
      var cell = K.el('div', 'score');
      cell.appendChild(K.el('span', 'si', row.icon));
      cell.appendChild(K.el('b', null, String(row.value)));
      cell.appendChild(K.el('small', null, K.t(row.key)));
      els.scoreGrid.appendChild(cell);
    });
    return K.SCORE.summary();
  }

  /* ============================================================
     gallery — four portraits and the secret shelf
     ============================================================ */
  var lastSecret = 0;
  function galItem(url, caption, locked, isNew, n) {
    var node = K.el('button', 'gal-item' + (locked ? ' locked' : '') + (isNew ? ' new' : ''));
    node.type = 'button';
    if (locked) {
      node.appendChild(K.el('span', 'gal-cap', '🔒 ' + caption));
      node.setAttribute('title', K.t('gallery.locked'));
      K.on(node, 'click', function () {
        play('tap');
        K.toast(K.t('gallery.locked'), K.t('secret.lockedMsg', {
          found: K.SECRET.found.length, total: K.SECRET.total
        }));
      });
      return node;
    }
    var img = K.el('img');
    img.src = url;
    img.alt = caption;
    img.loading = 'lazy';
    node.appendChild(img);
    node.appendChild(K.el('span', 'gal-cap', caption));
    K.on(node, 'click', function () {
      play('tap');
      openLightbox(url, n ? K.t('secret.single', { n: n, caption: caption }) : caption);
    });
    return node;
  }
  function renderGallery() {
    if (!els.galleryGrid) return null;
    var tab = prefs.galleryTab === 'secret' ? 'secret' : 'public';
    if (els.galleryTabs) {
      K.$$('[data-tab]', els.galleryTabs).forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-tab') === tab);
      });
    }
    clear(els.galleryGrid);
    if (tab === 'public') {
      K.PHOTOS.forEach(function (photo) {
        var cap = K.t('cap' + photo.n);
        els.galleryGrid.appendChild(galItem(K.url(photo.file), cap, false, false, 0));
      });
      label(els.galleryNote, K.t('gallery.notePublic'));
      return K.PHOTOS.length;
    }
    var list = K.SECRET.list();
    list.forEach(function (s) {
      els.galleryGrid.appendChild(galItem(
        s.url,
        s.unlocked ? (s.caption || K.t('gallery.secretCap', { n: s.n })) : K.t('gallery.secretCap', { n: s.n }),
        !s.unlocked,
        s.n === lastSecret,
        s.n
      ));
    });
    label(els.galleryNote, K.t('gallery.noteSecret', { found: K.SECRET.found.length, total: K.SECRET.total }));
    return list.length;
  }
  function switchGalleryTab(tab) {
    prefs.galleryTab = tab === 'secret' ? 'secret' : 'public';
    savePrefs();
    renderGallery();
    return prefs.galleryTab;
  }
  function randomPhoto() {
    var photo = K.pick(K.PHOTOS);
    if (!photo) return null;
    var cap = K.t('cap' + photo.n);
    openLightbox(K.url(photo.file), cap);
    return photo;
  }

  /* ============================================================
     settings
     ============================================================ */
  var APP_VERSION = '1.0';
  function renderSwatches() {
    if (!els.themeSwatches) return;
    clear(els.themeSwatches);
    THEMES.forEach(function (theme) {
      var btn = K.el('button', 'swatch' + (prefs.theme === theme.id ? ' is-active' : ''));
      btn.type = 'button';
      var fill = K.el('i');
      fill.style.background = theme.swatch;
      btn.appendChild(fill);
      btn.setAttribute('title', K.t('theme.' + theme.id));
      btn.setAttribute('aria-label', K.t('theme.' + theme.id));
      K.on(btn, 'click', function () {
        play('tap');
        K.setTheme(theme.id);
        K.toast(K.t('toast.themeChanged'), K.t('theme.' + theme.id));
      });
      els.themeSwatches.appendChild(btn);
    });
    label(els.themeDesc, K.t('theme.' + prefs.theme) + ' — ' + K.t('theme.' + prefs.theme + '.d'));
    return prefs.theme;
  }
  /* brain.js calls K.setTheme(id) for “switch to the dark theme” */
  function setTheme(id) {
    var ids = THEMES.map(function (t) { return t.id; });
    if (ids.indexOf(id) === -1) return prefs.theme;
    prefs.theme = id;
    savePrefs();
    document.documentElement.setAttribute('data-theme', id);
    renderSwatches();
    paintSky(true);
    return prefs.theme;
  }
  K.setTheme = setTheme;
  K.themeName = function () { return prefs.theme; };
  function cycleTheme() {
    var ids = THEMES.map(function (t) { return t.id; });
    var next = ids[(ids.indexOf(prefs.theme) + 1) % ids.length];
    setTheme(next);
    K.toast(K.t('toast.themeChanged'), K.t('theme.' + next));
    return next;
  }
  function renderSettings() {
    renderSwatches();
    if (els.setName) {
      els.setName.value = K.profile.name || '';
      els.setName.placeholder = K.t('set.namePlaceholder');
    }
    if (els.setJokes) els.setJokes.value = String(K.profile.jokes);
    if (els.setSecrets) els.setSecrets.checked = !!K.profile.secrets;
    if (els.langSeg) {
      K.$$('[data-lang]', els.langSeg).forEach(function (btn) {
        btn.classList.toggle('is-active', btn.getAttribute('data-lang') === K.lang);
      });
    }
    applyPrefs();
    label(els.appVersion, 'v' + APP_VERSION);
    return true;
  }
  function saveNameFromPanel() {
    if (!els.setName) return '';
    var saved = K.profile.setName(els.setName.value);
    if (saved) {
      play('tap');
      K.toast(K.t('toast.nameSaved', { name: saved }), K.t('toast.nameSavedBody'));
    }
    els.setName.value = K.profile.name || '';
    return saved;
  }
  /* ------------------------- data ------------------------- */
  function beatToText(beat) {
    var parts = [];
    if (!beat) return '';
    if (beat.text) parts.push(beat.text);
    if (beat.card) {
      if (beat.card.title) parts.push(beat.card.title);
      if (beat.card.lines) parts.push(beat.card.lines.join(' | '));
    }
    if (beat.photo && beat.photo.caption) parts.push('[' + beat.photo.caption + ']');
    if (beat.link) parts.push(beat.link.url);
    return parts.join(' ');
  }
  function chatAsText() {
    var lines = ['Okay Kuzya — chat export', new Date().toString(), ''];
    chatLog.forEach(function (row) {
      if (!row) return;
      if (row.who === 'user') lines.push('You: ' + row.text);
      else if (row.who === 'bot') lines.push('Kuzya: ' + beatToText(row.beat));
    });
    return lines.join('\n');
  }
  function exportChat() {
    var text = chatAsText();
    var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'okay-kuzya-chat.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    K.toast(K.t('toast.exported'), '');
    return text.length;
  }

  /* ============================================================
     language changes & the hooks brain.js calls
     ============================================================ */
  function relabelChrome() {
    K.applyI18n();
    label(els.btnLang, String(K.lang).toUpperCase());
    document.documentElement.setAttribute('lang', K.lang);
    if (els.setName) els.setName.placeholder = K.t('set.namePlaceholder');
    return true;
  }
  function reRenderAll() {
    relabelChrome();
    renderNav();
    renderHomeChips();
    renderChatChips();
    renderFeatures();
    renderGames();
    renderScores();
    renderTimerPresets();
    renderTimer();
    renderAlarms();
    renderGallery();
    renderSettings();
    renderTodos();
    renderStats();
    return true;
  }
  K.onLangChange(function () {
    reRenderAll();
    K.toast(K.t('toast.langChanged'), K.t('toast.langChangedBody'));
  });
  /* brain.js pings us whenever the to-do list or the secret shelf changes */
  K.onTodoChange = function () {
    renderTodos();
    renderNav();
  };
  K.onSecretChange = function (found) {
    lastSecret = (found && found.length) ? found[found.length - 1] : 0;
    renderGallery();
    renderNav();
  };
  function toggleLang() {
    K.setLang(K.lang === 'ru' ? 'en' : 'ru');
    return K.lang;
  }
  function toggleSound() {
    prefs.sound = !prefs.sound;
    savePrefs();
    applyPrefs();
    play('tap');
    K.toast(K.t('set.sound'), prefs.sound ? K.t('set.soundOn') : '');
    return prefs.sound;
  }
  function onConnectionChange(online) {
    if (online === false) K.toast(K.t('toast.offline'), K.t('toast.offlineBody'));
    else renderStats();
    return online;
  }

  /* ============================================================
     wiring
     ============================================================ */
  var suggesters = [];
  function wireChat() {
    if (els.chatForm) {
      K.on(els.chatForm, 'submit', function (e) {
        e.preventDefault();
        send(els.chatInput ? els.chatInput.value : '');
      });
    }
    if (els.chatNew) {
      K.on(els.chatNew, 'click', function () {
        play('tap');
        clearChat();
      });
    }
    if (els.homeForm) {
      K.on(els.homeForm, 'submit', function (e) {
        e.preventDefault();
        var text = els.homeInput ? els.homeInput.value : '';
        if (els.homeInput) els.homeInput.value = '';
        ask(text, true);
      });
    }
    if (els.btnHelp) K.on(els.btnHelp, 'click', function () { play('tap'); ask(K.t('chip.help'), true); });
    if (els.btnLang) K.on(els.btnLang, 'click', function () { play('tap'); toggleLang(); });
    if (els.btnSound) K.on(els.btnSound, 'click', function () { toggleSound(); });
    if (els.btnTheme) K.on(els.btnTheme, 'click', function () { play('tap'); cycleTheme(); });
    suggesters = [
      new Suggester(els.homeInput, els.homeSuggest, els.homeSuggest),
      new Suggester(els.chatInput, els.chatSuggest, els.chatSuggest)
    ];
    return true;
  }
  /* One listener for every [data-goto] / [data-ask] element in the page */
  function wireGlobalClicks() {
    K.on(document, 'click', function (e) {
      var node = e.target;
      while (node && node !== document) {
        if (node.getAttribute) {
          var go = node.getAttribute('data-goto');
          if (go) { play('tap'); nav(go); return; }
          var say = node.getAttribute('data-ask');
          if (say) { play('tap'); ask(say, true); return; }
        }
        node = node.parentNode;
      }
    });
  }
  function wireKeys() {
    K.on(document, 'keydown', function (e) {
      var key = String(e.key || '');
      if ((e.ctrlKey || e.metaKey) && key.toLowerCase() === 'k') {
        e.preventDefault();
        nav('chat');
        if (els.chatInput) els.chatInput.focus();
        return;
      }
      if (key === 'Escape') {
        if (els.lightbox && !els.lightbox.hidden) { closeLightbox(); return; }
        if (els.homeSuggest) els.homeSuggest.hidden = true;
        if (els.chatSuggest) els.chatSuggest.hidden = true;
        return;
      }
      if (key !== 'ArrowUp' || e.ctrlKey || e.metaKey || e.altKey) return;
      var t = e.target;
      if (!t || !t.id || t.value !== '' || !lastUserText) return;
      if (t.id === 'chatInput' && els.chatSuggest && !els.chatSuggest.hidden) return;
      if (t.id === 'homeInput' && els.homeSuggest && !els.homeSuggest.hidden) return;
      if (t.id === 'chatInput' || t.id === 'homeInput') {
        e.preventDefault();
        t.value = lastUserText;
      }
    });
  }

  /* ------------------------- timer panel helpers ------------------------- */
  K.uiTimer.reset = K.uiTimer.stop;
  /* Grab the timer.start() beat, but say it with a toast instead of the chat */
  function startTimerFromPanel() {
    var mins = els.timerMin ? parseInt(els.timerMin.value, 10) || 0 : 0;
    var secs = els.timerSec ? parseInt(els.timerSec.value, 10) || 0 : 0;
    var total = mins * 60 + (secs % 60);
    if (total <= 0) {
      K.toast(K.t('timer.title'), K.t('timer.presets'), { life: 2600 });
      return null;
    }
    startTimer(total, '', true);
    return timer;
  }
  /* ------------------------- tools panel ------------------------- */
  function addAlarmFromPanel() {
    var raw = els.alarmTime && els.alarmTime.value ? String(els.alarmTime.value) : '';
    var m = raw.match(/^(\d{1,2}):(\d{2})$/);
    if (!m) {
      play('tap');
      K.toast(K.t('alarm.title'), K.t('alarm.hint'), { life: 3200 });
      return null;
    }
    var at = K.nextClock(K.clamp(parseInt(m[1], 10), 0, 23), K.clamp(parseInt(m[2], 10), 0, 59));
    if (!K.uiAlarm.add(at, els.alarmLabel ? els.alarmLabel.value : '')) return null;
    play('send');
    if (els.alarmLabel) els.alarmLabel.value = '';
    K.toast(K.t('toast.alarmSet'), K.t('toast.alarmSetBody', { time: K.fmtTime(at) }));
    return at;
  }
  function wireTools() {
    if (els.todoForm) {
      K.on(els.todoForm, 'submit', function (e) {
        e.preventDefault();
        var text = els.todoInput ? els.todoInput.value : '';
        if (addTodoFromPanel(text) && els.todoInput) els.todoInput.value = '';
      });
    }
    if (els.todoClear) K.on(els.todoClear, 'click', clearDoneFromPanel);
    if (els.timerStart) K.on(els.timerStart, 'click', function () { play('tap'); startTimerFromPanel(); });
    if (els.timerPause) K.on(els.timerPause, 'click', function () { play('tap'); K.uiTimer.pause(); });
    if (els.timerReset) K.on(els.timerReset, 'click', function () { play('tap'); K.uiTimer.reset(); });
    [els.timerMin, els.timerSec, els.alarmTime].forEach(function (input) {
      if (!input) return;
      K.on(input, 'keydown', function (e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        if (input === els.alarmTime) addAlarmFromPanel();
        else startTimerFromPanel();
      });
    });
    if (els.alarmAdd) K.on(els.alarmAdd, 'click', function () { addAlarmFromPanel(); });
    if (els.alarmTest) {
      K.on(els.alarmTest, 'click', function () {
        play('bell');
        K.alarmLoop.start();
        K.toast(K.t('alarm.ringing'), K.t('alarm.hint'), { life: 4000 });
        setTimeout(function () { K.alarmLoop.stop(); }, 2600);
      });
    }
    return true;
  }
  /* ------------------------- gallery panel ------------------------- */
  function wireGallery() {
    if (els.galleryTabs) {
      K.on(els.galleryTabs, 'click', function (e) {
        var node = e.target;
        while (node && node !== els.galleryTabs && !(node.getAttribute && node.getAttribute('data-tab'))) {
          node = node.parentNode;
        }
        if (!node || !node.getAttribute) return;
        var tab = node.getAttribute('data-tab');
        if (!tab) return;
        play('tap');
        switchGalleryTab(tab);
      });
    }
    if (els.galleryRandom) K.on(els.galleryRandom, 'click', function () { play('tap'); randomPhoto(); });
    if (els.gallerySecretHint) K.on(els.gallerySecretHint, 'click', function () { play('tap'); ask(K.t('chip.secret'), true); });
    if (els.lbClose) K.on(els.lbClose, 'click', closeLightbox);
    if (els.lbImg) K.on(els.lbImg, 'click', function () { play('tap'); savePhoto(); });
    if (els.lightbox) {
      K.on(els.lightbox, 'click', function (e) {
        if (e.target === els.lightbox) closeLightbox();
      });
    }
    return true;
  }
  /* ------------------------- settings panel ------------------------- */
  function wireSettings() {
    if (els.setStars) {
      K.on(els.setStars, 'change', function () {
        prefs.stars = !!els.setStars.checked;
        savePrefs();
        paintSky(true);
      });
    }
    if (els.setTypewriter) {
      K.on(els.setTypewriter, 'change', function () {
        prefs.typewriter = !!els.setTypewriter.checked;
        savePrefs();
      });
    }
    if (els.setDensity) {
      K.on(els.setDensity, 'change', function () {
        prefs.density = els.setDensity.checked ? 'compact' : 'cozy';
        savePrefs();
        applyPrefs();
        paintSky(false);
      });
    }
    if (els.langSeg) {
      K.on(els.langSeg, 'click', function (e) {
        var node = e.target;
        while (node && node !== els.langSeg && !(node.getAttribute && node.getAttribute('data-lang'))) {
          node = node.parentNode;
        }
        if (!node || !node.getAttribute) return;
        var lang = node.getAttribute('data-lang');
        if (!lang || lang === K.lang) return;
        play('tap');
        K.setLang(lang);
      });
    }
    if (els.setNameSave) K.on(els.setNameSave, 'click', saveNameFromPanel);
    if (els.setName) {
      K.on(els.setName, 'keydown', function (e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        saveNameFromPanel();
      });
    }
    if (els.setJokes) {
      K.on(els.setJokes, 'input', function () {
        K.profile.jokes = K.clamp(parseInt(els.setJokes.value, 10) || 0, 0, 3);
        K.profile.save();
      });
      K.on(els.setJokes, 'change', function () {
        play('tap');
        K.toast(K.t('set.playful'), K.t('set.playful' + K.profile.jokes));
      });
    }
    if (els.setSecrets) {
      K.on(els.setSecrets, 'change', function () {
        K.profile.secrets = !!els.setSecrets.checked;
        K.profile.save();
        var found = K.SECRET.found.length, total = K.SECRET.total;
        if (K.profile.secrets) {
          K.toast(K.t('toast.secretFound'), K.t('toast.secretFoundBody', { found: found, total: total }), { life: 3600 });
        } else {
          K.toast(K.t('set.secrets'), '', { life: 2400 });
        }
      });
    }
    if (els.setSound) {
      K.on(els.setSound, 'change', function () {
        prefs.sound = !!els.setSound.checked;
        savePrefs();
        applyPrefs();
        play('tap');
      });
    }
    if (els.setVolume) {
      K.on(els.setVolume, 'input', function () {
        prefs.volume = K.clamp((parseInt(els.setVolume.value, 10) || 0) / 100, 0, 1);
        K.sound.volume = prefs.volume;
      });
      K.on(els.setVolume, 'change', function () {
        savePrefs();
        play('tap');
      });
    }
    if (els.setNotif) {
      K.on(els.setNotif, 'change', function () {
        prefs.notif = !!els.setNotif.checked;
        savePrefs();
        if (prefs.notif) K.svc.askNotifications();
      });
    }
    if (els.dataExport) K.on(els.dataExport, 'click', function () { play('tap'); exportChat(); });
    if (els.dataClearChat) K.on(els.dataClearChat, 'click', function () { play('tap'); clearChat(); });
    if (els.dataReset) K.on(els.dataReset, 'click', resetEverything);
    return true;
  }
  function resetEverything() {
    var ok = true;
    try { ok = window.confirm(K.t('set.resetAll') + '?'); } catch (e) { ok = true; }
    if (!ok) return false;
    K.store.wipe();
    K.toast(K.t('toast.resetDone'), '');
    setTimeout(function () { location.reload(); }, 700);
    return true;
  }

  /* ============================================================
     the starfield — a small canvas sky that can be switched off
     ============================================================ */
  var sky = { canvas: null, ctx: null, stars: [], w: 0, h: 0, raf: null, last: 0, rgb: [255, 255, 255] };
  function starsWanted() { return !!prefs.stars && !reducedMotion; }
  function starCount(w, h) { return K.clamp(Math.round((w * h) / 14000), 36, 150); }
  /* --star is set per theme, so read it back as plain rgb parts */
  function starRgb() {
    var raw = '';
    try { raw = getComputedStyle(document.documentElement).getPropertyValue('--star') || ''; } catch (e) { raw = ''; }
    raw = raw.trim();
    var hex = raw.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hex) {
      var s = hex[1];
      if (s.length === 3) s = s[0] + s[0] + s[1] + s[1] + s[2] + s[2];
      return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
    }
    var fn = raw.match(/rgba?\(([^)]+)\)/i);
    if (fn) {
      var parts = fn[1].split(',');
      if (parts.length >= 3) {
        return [parseInt(parts[0], 10) || 255, parseInt(parts[1], 10) || 255, parseInt(parts[2], 10) || 255];
      }
    }
    return [255, 255, 255];
  }
  function seedSky(w, h) {
    var total = starCount(w, h), i;
    sky.stars = [];
    for (i = 0; i < total; i++) {
      sky.stars.push({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 1.25 + 0.35,
        v: Math.random() * 0.1 + 0.02,
        a: Math.random() * 0.55 + 0.25,
        ph: Math.random() * Math.PI * 2
      });
    }
    return sky.stars.length;
  }
  function drawSky(dt) {
    var ctx = sky.ctx;
    if (!ctx) return false;
    ctx.clearRect(0, 0, sky.w, sky.h);
    if (!starsWanted()) return false;
    var rgb = sky.rgb, i, s, alpha;
    for (i = 0; i < sky.stars.length; i++) {
      s = sky.stars[i];
      if (dt) {
        s.y += s.v * dt * 0.12;
        s.ph += dt * 0.0012;
        if (s.y > sky.h + 2) { s.y = -2; s.x = Math.random() * sky.w; }
      }
      alpha = s.a * (0.62 + 0.38 * Math.sin(s.ph));
      ctx.fillStyle = 'rgba(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ',' + alpha.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    return true;
  }
  function skyLoop(ts) {
    if (!starsWanted()) { sky.raf = null; drawSky(0); return; }
    var dt = sky.last ? Math.min(80, ts - sky.last) : 16;
    sky.last = ts;
    drawSky(dt);
    sky.raf = window.requestAnimationFrame(skyLoop);
  }
  function paintSky(rebuild) {
    if (!sky.canvas || !sky.ctx) return false;
    var w = window.innerWidth || 0, h = window.innerHeight || 0;
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    sky.w = w; sky.h = h;
    sky.canvas.width = Math.max(1, Math.floor(w * dpr));
    sky.canvas.height = Math.max(1, Math.floor(h * dpr));
    sky.canvas.style.width = w + 'px';
    sky.canvas.style.height = h + 'px';
    sky.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sky.rgb = starRgb();
    if (rebuild || sky.stars.length !== starCount(w, h)) seedSky(w, h);
    drawSky(0);
    if (starsWanted()) {
      if (!sky.raf) { sky.last = 0; sky.raf = window.requestAnimationFrame(skyLoop); }
    } else if (sky.raf) {
      window.cancelAnimationFrame(sky.raf);
      sky.raf = null;
    }
    return true;
  }
  function initStars() {
    if (!els.stars || !els.stars.getContext) return false;
    sky.canvas = els.stars;
    sky.ctx = els.stars.getContext('2d');
    paintSky(true);
    K.on(window, 'resize', function () { paintSky(false); });
    return true;
  }

  /* ============================================================
     clock and boot
     ============================================================ */
  /* One second tick: header clock, home stat, timer, alarms */
  function tickClock() {
    var now = new Date();
    label(els.statusClock, K.fmtTime(now));
    if (els.statusClock) els.statusClock.setAttribute('title', K.fmtDate(now));
    if (view === 'home' && els.statRow && els.statRow.children[1]) {
      var value = els.statRow.children[1].querySelector('b');
      if (value) value.textContent = K.fmtTime(now);
    }
    timerTick();
    alarmTick();
    return now.getTime();
  }
  function boot() {
    if (!K || typeof K.answer !== 'function') return false;   /* brain.js loads first */
    cacheEls();
    loadPrefs();
    K.setLang(K.store.get('lang', 'en'), true);
    applyPrefs();
    relabelChrome();
    loadAlarms();
    /* The one “what can you do?” button in the ad block follows the language */
    var adBtn = els.siteAd ? els.siteAd.querySelector('[data-ask]') : null;
    if (adBtn) adBtn.setAttribute('data-ask', K.t('chip.help'));
    renderNav();
    renderHomeChips();
    renderChatChips();
    renderFeatures();
    renderGames();
    renderScores();
    renderTodos();
    renderTimerPresets();
    renderTimer();
    renderAlarms();
    renderGallery();
    renderSettings();
    renderStats();
    wireChat();
    wireGlobalClicks();
    wireKeys();
    wireTools();
    wireGallery();
    wireSettings();
    initStars();
    restoreChat();
    K.svc.watchConnection(onConnectionChange);
    K.svc.warmUp(K.store.get('city', '') || '');
    tickClock();
    setInterval(tickClock, 1000);
    routeFromHash();
    /* A tiny public API (handy in the console and for tests) */
    K.app = {
      ready: true,
      version: APP_VERSION,
      boot: boot,
      nav: nav,
      ask: ask,
      send: send,
      timer: K.uiTimer,
      alarms: K.uiAlarm,
      render: reRenderAll,
      chatText: chatAsText,
      theme: function () { return prefs.theme; },
      view: function () { return view; }
    };
    return true;
  }
  if (document.readyState === 'loading') K.on(document, 'DOMContentLoaded', boot);
  else boot();
})(window.KZ);

