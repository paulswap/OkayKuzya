/* ============================================================
   Okay Kuzya — live services.
   Open-Meteo (forecast + geocoding), Wikipedia summaries, world
   clocks, suggestions and notifications. Everything is cached in
   localStorage so repeated questions are instant and offline-safe.
   ============================================================ */
(function (K) {
  'use strict';

  var GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
  var FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
  var FETCH_TIMEOUT = 9000;

  var WEATHER_TTL = 10 * 60 * 1000;    /* 10 minutes for the forecast   */
  var WIKI_TTL = 24 * 60 * 60 * 1000;  /* a day for encyclopaedia pages */

  /* ------------------------- cache ------------------------- */
  function cacheGet(key, ttl) {
    var hit = K.store.get('cache:' + key, null);
    if (!hit || !hit.t) return null;
    if (ttl && (Date.now() - hit.t) > ttl) return null;
    return hit.v;
  }
  function cacheSet(key, value) {
    K.store.set('cache:' + key, { t: Date.now(), v: value });
    return value;
  }

  /* ------------------------- fetch with timeout ------------------------- */
  function getJSON(url) {
    var controller = null;
    var timer = null;
    var opts = { cache: 'no-store' };
    if (typeof AbortController !== 'undefined') {
      controller = new AbortController();
      opts.signal = controller.signal;
      timer = setTimeout(function () { try { controller.abort(); } catch (e) {} }, FETCH_TIMEOUT);
    }
    return fetch(url, opts).then(function (res) {
      if (timer) clearTimeout(timer);
      if (!res.ok) throw new Error('http ' + res.status);
      return res.json();
    }).catch(function (err) {
      if (timer) clearTimeout(timer);
      throw err;
    });
  }

  /* ------------------------- online state ------------------------- */
  K.svc = {};
  K.svc.online = function () {
    try { return navigator.onLine !== false; } catch (e) { return true; }
  };
  K.svc.watchConnection = function (onChange) {
    K.on(window, 'online', function () { if (onChange) onChange(true); });
    K.on(window, 'offline', function () { if (onChange) onChange(false); });
  };

  /* ------------------------- sky conditions ------------------------- */
  /* WMO weather codes -> Kuzya's own vocabulary */
  var CODE_MAP = [
    { codes: [0], key: 'clear', emoji: '☀️' },
    { codes: [1], key: 'mostlyClear', emoji: '🌤️' },
    { codes: [2], key: 'partlyCloudy', emoji: '⛅' },
    { codes: [3], key: 'clouds', emoji: '☁️' },
    { codes: [45, 48], key: 'fog', emoji: '🌫️' },
    { codes: [51, 53, 55, 56, 57], key: 'drizzle', emoji: '🌦️' },
    { codes: [61, 63, 65, 66, 67, 80, 81, 82], key: 'rain', emoji: '🌧️' },
    { codes: [71, 73, 75, 77, 85, 86], key: 'snow', emoji: '🌨️' },
    { codes: [95, 96, 99], key: 'storm', emoji: '⛈️' }
  ];
  K.svc.condition = function (code, isDay) {
    var i, hit = null;
    for (i = 0; i < CODE_MAP.length; i++) {
      if (CODE_MAP[i].codes.indexOf(Number(code)) !== -1) { hit = CODE_MAP[i]; break; }
    }
    if (!hit) return { key: 'unknown', emoji: '🌡️' };
    if (isDay === 0 && hit.key === 'clear') return { key: 'clearNight', emoji: '🌙' };
    return { key: hit.key, emoji: hit.emoji };
  };
  /* Which of Kuzya's spoken weather lines matches the reading */
  K.svc.weatherMood = function (current) {
    var c = K.svc.condition(current.code, current.isDay);
    if (c.key === 'rain' || c.key === 'drizzle' || c.key === 'storm') return 'rain';
    if (c.key === 'snow') return 'snow';
    if (current.wind >= 30) return 'wind';
    if (current.temp >= 26) return 'hot';
    if (current.temp <= 4) return 'cold';
    return 'mild';
  };
  /* ------------------------- geocoding ------------------------- */
  K.svc.geocode = function (name) {
    var query = String(name || '').trim();
    if (query.length < 2) return Promise.resolve(null);
    var key = 'geo:' + query.toLowerCase() + ':' + K.lang;
    var cached = cacheGet(key, WIKI_TTL);
    if (cached) return Promise.resolve(cached);

    var url = GEO_URL + '?name=' + encodeURIComponent(query) +
      '&count=1&format=json&language=' + (K.lang === 'ru' ? 'ru' : 'en');
    return getJSON(url).then(function (data) {
      var hit = data && data.results && data.results[0];
      if (!hit) return null;
      var place = {
        name: hit.name,
        country: hit.country || '',
        countryCode: hit.country_code || '',
        admin1: hit.admin1 || '',
        lat: hit.latitude,
        lon: hit.longitude,
        timezone: hit.timezone || 'UTC'
      };
      return cacheSet(key, place);
    });
  };

  /* A few well-known cities, so weather works while offline too */
  K.svc.knownCities = {
    moscow: { name: 'Moscow', country: 'Russia', lat: 55.7558, lon: 37.6173, timezone: 'Europe/Moscow' },
    'москва': { name: 'Москва', country: 'Россия', lat: 55.7558, lon: 37.6173, timezone: 'Europe/Moscow' },
    london: { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
    'лондон': { name: 'Лондон', country: 'Великобритания', lat: 51.5074, lon: -0.1278, timezone: 'Europe/London' },
    'new york': { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006, timezone: 'America/New_York' },
    'нью-йорк': { name: 'Нью-Йорк', country: 'США', lat: 40.7128, lon: -74.006, timezone: 'America/New_York' },
    paris: { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris' },
    'париж': { name: 'Париж', country: 'Франция', lat: 48.8566, lon: 2.3522, timezone: 'Europe/Paris' },
    berlin: { name: 'Berlin', country: 'Germany', lat: 52.52, lon: 13.405, timezone: 'Europe/Berlin' },
    'берлин': { name: 'Берлин', country: 'Германия', lat: 52.52, lon: 13.405, timezone: 'Europe/Berlin' },
    tokyo: { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
    'токио': { name: 'Токио', country: 'Япония', lat: 35.6762, lon: 139.6503, timezone: 'Asia/Tokyo' },
    dubai: { name: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708, timezone: 'Asia/Dubai' },
    'дубай': { name: 'Дубай', country: 'ОАЭ', lat: 25.2048, lon: 55.2708, timezone: 'Asia/Dubai' },
    istanbul: { name: 'Istanbul', country: 'Türkiye', lat: 41.0082, lon: 28.9784, timezone: 'Europe/Istanbul' },
    'стамбул': { name: 'Стамбул', country: 'Турция', lat: 41.0082, lon: 28.9784, timezone: 'Europe/Istanbul' },
    'kyiv': { name: 'Kyiv', country: 'Ukraine', lat: 50.4501, lon: 30.5234, timezone: 'Europe/Kyiv' },
    'киев': { name: 'Киев', country: 'Украина', lat: 50.4501, lon: 30.5234, timezone: 'Europe/Kyiv' },
    'tel aviv': { name: 'Tel Aviv', country: 'Israel', lat: 32.0853, lon: 34.7818, timezone: 'Asia/Jerusalem' },
    'тель-авив': { name: 'Тель-Авив', country: 'Израиль', lat: 32.0853, lon: 34.7818, timezone: 'Asia/Jerusalem' },
    almaty: { name: 'Almaty', country: 'Kazakhstan', lat: 43.2220, lon: 76.8512, timezone: 'Asia/Almaty' },
    'алматы': { name: 'Алматы', country: 'Казахстан', lat: 43.2220, lon: 76.8512, timezone: 'Asia/Almaty' },
    'st petersburg': { name: 'St Petersburg', country: 'Russia', lat: 59.9311, lon: 30.3609, timezone: 'Europe/Moscow' },
    'saint petersburg': { name: 'St Petersburg', country: 'Russia', lat: 59.9311, lon: 30.3609, timezone: 'Europe/Moscow' },
    'питер': { name: 'Питер', country: 'Россия', lat: 59.9311, lon: 30.3609, timezone: 'Europe/Moscow' },
    'спб': { name: 'Санкт-Петербург', country: 'Россия', lat: 59.9311, lon: 30.3609, timezone: 'Europe/Moscow' },
    'санкт-петербург': { name: 'Санкт-Петербург', country: 'Россия', lat: 59.9311, lon: 30.3609, timezone: 'Europe/Moscow' },
    kazan: { name: 'Kazan', country: 'Russia', lat: 55.7963, lon: 49.1088, timezone: 'Europe/Moscow' },
    'казань': { name: 'Казань', country: 'Россия', lat: 55.7963, lon: 49.1088, timezone: 'Europe/Moscow' },
    novosibirsk: { name: 'Novosibirsk', country: 'Russia', lat: 55.0084, lon: 82.9357, timezone: 'Asia/Novosibirsk' },
    'новосибирск': { name: 'Новосибирск', country: 'Россия', lat: 55.0084, lon: 82.9357, timezone: 'Asia/Novosibirsk' },
    yekaterinburg: { name: 'Yekaterinburg', country: 'Russia', lat: 56.8389, lon: 60.6057, timezone: 'Asia/Yekaterinburg' },
    'екатеринбург': { name: 'Екатеринбург', country: 'Россия', lat: 56.8389, lon: 60.6057, timezone: 'Asia/Yekaterinburg' },
    minsk: { name: 'Minsk', country: 'Belarus', lat: 53.9006, lon: 27.5590, timezone: 'Europe/Minsk' },
    'минск': { name: 'Минск', country: 'Беларусь', lat: 53.9006, lon: 27.5590, timezone: 'Europe/Minsk' },
    tbilisi: { name: 'Tbilisi', country: 'Georgia', lat: 41.7151, lon: 44.8271, timezone: 'Asia/Tbilisi' },
    'тбилиси': { name: 'Тбилиси', country: 'Грузия', lat: 41.7151, lon: 44.8271, timezone: 'Asia/Tbilisi' },
    yerevan: { name: 'Yerevan', country: 'Armenia', lat: 40.1872, lon: 44.5152, timezone: 'Asia/Yerevan' },
    'ереван': { name: 'Ереван', country: 'Армения', lat: 40.1872, lon: 44.5152, timezone: 'Asia/Yerevan' },
    prague: { name: 'Prague', country: 'Czechia', lat: 50.0755, lon: 14.4378, timezone: 'Europe/Prague' },
    'прага': { name: 'Прага', country: 'Чехия', lat: 50.0755, lon: 14.4378, timezone: 'Europe/Prague' },
    warsaw: { name: 'Warsaw', country: 'Poland', lat: 52.2297, lon: 21.0122, timezone: 'Europe/Warsaw' },
    'варшава': { name: 'Варшава', country: 'Польша', lat: 52.2297, lon: 21.0122, timezone: 'Europe/Warsaw' },
    amsterdam: { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lon: 4.9041, timezone: 'Europe/Amsterdam' },
    'амстердам': { name: 'Амстердам', country: 'Нидерланды', lat: 52.3676, lon: 4.9041, timezone: 'Europe/Amsterdam' },
    madrid: { name: 'Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038, timezone: 'Europe/Madrid' },
    'мадрид': { name: 'Мадрид', country: 'Испания', lat: 40.4168, lon: -3.7038, timezone: 'Europe/Madrid' },
    rome: { name: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964, timezone: 'Europe/Rome' },
    'рим': { name: 'Рим', country: 'Италия', lat: 41.9028, lon: 12.4964, timezone: 'Europe/Rome' },
    barcelona: { name: 'Barcelona', country: 'Spain', lat: 41.3874, lon: 2.1686, timezone: 'Europe/Madrid' },
    'барселона': { name: 'Барселона', country: 'Испания', lat: 41.3874, lon: 2.1686, timezone: 'Europe/Madrid' },
    vienna: { name: 'Vienna', country: 'Austria', lat: 48.2082, lon: 16.3738, timezone: 'Europe/Vienna' },
    'вена': { name: 'Вена', country: 'Австрия', lat: 48.2082, lon: 16.3738, timezone: 'Europe/Vienna' }
  };
  /* City names arrive inflected (“погода в Москве”, “weather in Paris”) —
     drop a few endings before comparing, so the dictionary still hits. */
  function cityStem(s) {
    return K.norm(s).replace(/(ой|ом|ем|ей|ов|ам|ах|ий|ии|ия|е|у|ы|и|а|ю|ь)$/, '');
  }
  var CITY_STEMS = null;
  function stemMap() {
    if (CITY_STEMS) return CITY_STEMS;
    CITY_STEMS = {};
    Object.keys(K.svc.knownCities).forEach(function (key) {
      var stem = cityStem(key);
      if (stem.length >= 3 && !CITY_STEMS[stem]) CITY_STEMS[stem] = key;
    });
    return CITY_STEMS;
  }
  function knownCity(q) {
    if (K.svc.knownCities[q]) return K.svc.knownCities[q];
    var key = stemMap()[cityStem(q)];
    return key ? K.svc.knownCities[key] : null;
  }
  /* Synchronous dictionary hit, for saved places: “киеве” -> “Киев” */
  K.svc.knownCityName = function (q) {
    var hit = knownCity(K.stripPunct(q || ''));
    return hit ? hit.name : '';
  };
  /* Misspelling-tolerant lookup: dictionary first, then the API */
  K.svc.findplace = function (name) {
    var q = K.stripPunct(name);
    if (!q) return Promise.resolve(null);
    var known = knownCity(q);
    if (known) {
      return Promise.resolve({
        name: known.name, country: known.country, countryCode: '', admin1: '',
        lat: known.lat, lon: known.lon, timezone: known.timezone
      });
    }
    if (!K.svc.online()) return Promise.resolve(null);
    return K.svc.geocode(name).catch(function () { return null; });
  };
  /* ------------------------- weather ------------------------- */
  /* K.svc.weather(city) -> { place, current, daily[] } | null          */
  K.svc.weather = function (city) {
    var name = K.stripPunct(city || '');
    if (!name) return Promise.reject(new Error('no-city'));
    if (!K.svc.online()) return Promise.reject(new Error('offline'));

    var key = 'wx:' + name + ':' + (K.lang === 'ru' ? 'ru' : 'en');
    var cached = cacheGet(key, WEATHER_TTL);
    if (cached) return Promise.resolve(cached);

    return K.svc.findplace(name).then(function (place) {
      if (!place) throw new Error('not-found');
      var url = FORECAST_URL +
        '?latitude=' + place.lat + '&longitude=' + place.lon +
        '&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m' +
        '&daily=weather_code,temperature_2m_max,temperature_2m_min' +
        '&timezone=auto&forecast_days=4';
      return getJSON(url).then(function (data) {
        var cur = data && data.current;
        if (!cur) throw new Error('no-data');
        var daily = [];
        var d = (data.daily || {});
        for (var i = 0; i < (d.time || []).length; i++) {
          daily.push({
            date: d.time[i],
            code: d.weather_code ? d.weather_code[i] : 0,
            min: Math.round(d.temperature_2m_min ? d.temperature_2m_min[i] : 0),
            max: Math.round(d.temperature_2m_max ? d.temperature_2m_max[i] : 0)
          });
        }
        var out = {
          place: place,
          current: {
            temp: Math.round(cur.temperature_2m),
            feels: Math.round(cur.apparent_temperature),
            wind: Math.round(cur.wind_speed_10m),
            humidity: Math.round(cur.relative_humidity_2m),
            code: cur.weather_code,
            isDay: cur.is_day,
            time: cur.time
          },
          daily: daily,
          units: 'metric',
          city: place.name
        };
        out.mood = K.svc.weatherMood(out.current);
        out.condition = K.svc.condition(out.current.code, out.current.isDay);
        return cacheSet(key, out);
      });
    });
  };

  /* Ready-made one-liner: "12°C, light rain, wind 14 km/h" */
  K.svc.weatherLine = function (w) {
    if (!w || !w.current) return '';
    return w.current.temp + '°C · ' + w.condition.emoji + ' · ' +
      K.t('w.wind', { v: w.current.wind }) + ' · ' +
      K.t('w.humidity', { v: w.current.humidity });
  };

  /* ------------------------- world clocks ------------------------- */
  K.svc.timeIn = function (timezone, date) {
    var d = date || new Date();
    var tz = timezone || 'UTC';
    var time, day;
    try {
      time = new Intl.DateTimeFormat(K.lang === 'ru' ? 'ru-RU' : 'en-GB', {
        hour: '2-digit', minute: '2-digit', timeZone: tz
      }).format(d);
      day = new Intl.DateTimeFormat(K.lang === 'ru' ? 'ru-RU' : 'en-US', {
        weekday: 'long', day: 'numeric', month: 'long', timeZone: tz
      }).format(d);
    } catch (e) {
      return null;
    }
    return { time: time, date: day, timezone: tz, local: K.fmtTime(d), localDate: K.fmtDate(d) };
  };
  K.svc.localTimezone = function () {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'; } catch (e) { return 'UTC'; }
  };
  /* ------------------------- Wikipedia ------------------------- */
  function wikiSearch(lang, query) {
    var url = 'https://' + lang + '.wikipedia.org/w/api.php?action=query&list=search' +
      '&srsearch=' + encodeURIComponent(query) + '&srlimit=1&redirects=1&format=json&origin=*';
    return getJSON(url).then(function (data) {
      var hits = data && data.query && data.query.search;
      if (!hits || !hits.length) return null;
      return wikiSummary(lang, hits[0].title);
    });
  }
  function wikiSummary(lang, title) {
    var url = 'https://' + lang + '.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(title.replace(/ /g, '_'));
    return getJSON(url).then(function (page) {
      if (!page) return null;
      var extract = String(page.extract || '').replace(/\s+/g, ' ').trim();
      if (!extract && !page.title) return null;
      return {
        lang: lang,
        title: page.title || title,
        extract: extract,
        description: page.description || '',
        thumbnail: page.thumbnail && page.thumbnail.source ? page.thumbnail.source : '',
        url: (page.content_urls && page.content_urls.desktop && page.content_urls.desktop.page) ||
             K.svc.wikiUrl(page.title || title, lang),
        query: title
      };
    }).catch(function () { return null; });
  }
  /* Shorten an article extract to whole sentences (~max chars) */
  K.svc.sentences = function (text, max) {
    var limit = max || 600;
    text = String(text || '').replace(/\s+/g, ' ').trim();
    if (text.length <= limit) return text;
    var slice = text.slice(0, limit);
    var cut = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('! '), slice.lastIndexOf('? '));
    if (cut < limit * 0.4) cut = slice.lastIndexOf(' ');
    if (cut <= 0) cut = limit;
    return slice.slice(0, cut + 1).trim();
  };

  /* Look something up: prefers the interface language, falls back to the other */
  K.svc.wiki = function (query) {
    var q = String(query || '').trim();
    if (q.length < 2) return Promise.resolve(null);
    if (!K.svc.online()) return Promise.reject(new Error('offline'));
    var key = 'wiki:' + K.lang + ':' + q.toLowerCase();
    var cached = cacheGet(key, WIKI_TTL);
    if (cached) return Promise.resolve(cached);

    var order = K.lang === 'ru' ? ['ru', 'en'] : ['en', 'ru'];
    return wikiSearch(order[0], q).then(function (first) {
      if (first) return first;
      return wikiSearch(order[1], q);
    }).then(function (hit) {
      if (!hit) return null;
      hit.extract = K.svc.sentences(hit.extract, 620);
      cacheSet(key, hit);
      return hit;
    });
  };
  K.svc.wikiUrl = function (title, lang) {
    return 'https://' + (lang || (K.lang === 'ru' ? 'ru' : 'en')) + '.wikipedia.org/wiki/' +
      encodeURIComponent(String(title || '').replace(/ /g, '_'));
  };
  /* Direct web results for anything Wikipedia is shy about */
  K.svc.webSearch = function (query) {
    return 'https://duckduckgo.com/?q=' + encodeURIComponent(String(query || ''));
  };
  K.svc.youTubeSearch = function (query) {
    return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(String(query || ''));
  };
  K.svc.openUrl = function (url) {
    try {
      var w = window.open(url, '_blank', 'noopener');
      if (w) return true;
      return false;
    } catch (e) { return false; }
  };
  /* ------------------------- suggestions ------------------------- */
  K.svc.chipKeys = [
    'chip.weather', 'chip.time', 'chip.joke', 'chip.riddle', 'chip.rps', 'chip.quiz',
    'chip.meme', 'chip.guess', 'chip.fact', 'chip.search', 'chip.cartoon', 'chip.todo',
    'chip.timer', 'chip.secret', 'chip.help'
  ];
  K.svc.chips = function () {
    return K.svc.chipKeys.map(function (key) {
      return { key: key, label: K.t(key), say: K.t(key) };
    });
  };
  /* Instant, offline-friendly autocomplete for the search bar */
  K.svc.suggest = function (query, limit) {
    var max = limit || 5;
    var chips = K.svc.chips();
    var q = K.norm(query);
    if (!q) return chips.slice(0, max);

    var out = chips.filter(function (c) { return K.norm(c.label).indexOf(q) !== -1; });

    /* "weather in пари" -> "Weather in Paris · прогноз" style entries */
    var prefix = q.slice(0, 3);
    Object.keys(K.svc.knownCities).forEach(function (slug) {
      if (out.length >= max) return;
      if (slug.indexOf(q) !== 0 && slug.indexOf(prefix) !== 0) return;
      var city = K.svc.knownCities[slug].name;
      var ask = K.lang === 'ru' ? 'погода в ' + city : 'weather in ' + city;
      out.push({ key: 'city', label: K.t('stat.city', { city: city }), say: ask });
    });

    /* Non-chip text still gets a helpful "look it up" entry */
    if (out.length < max && q.length >= 3) {
      out.push({
        key: 'lookup',
        label: (K.lang === 'ru' ? 'Найти: ' : 'Look up: ') + String(query).trim(),
        say: String(query).trim()
      });
    }
    if (out.length < max) out.push({ key: 'chip.help', label: K.t('chip.help'), say: K.t('chip.help') });
    return out.slice(0, max);
  };

  /* ------------------------- notifications ------------------------- */
  K.svc.notificationsSupported = function () {
    return typeof Notification !== 'undefined';
  };
  K.svc.notificationsAllowed = function () {
    if (!K.svc.notificationsSupported()) return false;
    return Notification.permission === 'granted';
  };
  K.svc.askNotifications = function () {
    if (!K.svc.notificationsSupported() || Notification.permission === 'granted') {
      return Promise.resolve(K.svc.notificationsAllowed());
    }
    if (Notification.permission === 'denied') return Promise.resolve(false);
    try {
      return Notification.requestPermission().then(function (p) { return p === 'granted'; });
    } catch (e) {
      /* Safari's legacy callback form */
      return new Promise(function (resolve) { Notification.requestPermission(function (p) { resolve(p === 'granted'); }); });
    }
  };
  K.svc.notify = function (title, body) {
    if (!K.svc.notificationsAllowed()) return false;
    if (K.store.get('notifications', true) === false) return false;
    try {
      new Notification(title, { body: body || '', tag: 'okay-kuzya' });
      return true;
    } catch (e) { return false; }
  };

  /* ------------------------- warm-up ------------------------- */
  /* Quietly pre-fetch the saved city so the home card fills instantly */
  K.svc.warmUp = function (city) {
    if (!city || !K.svc.online()) return;
    try { K.svc.weather(city).catch(function () {}); } catch (e) {}
  };
})(window.KZ);
