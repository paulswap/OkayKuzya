/* ============================================================
   Okay Kuzya — brain.js
   The intent engine. Understands English and Russian, remembers the
   user's name, runs game states, and answers with words, cards,
   chips, photos and links. Async work (weather, Wikipedia) is done
   through K.svc; everything else is offline.
   ============================================================ */
(function (K) {
  'use strict';

  K.BRAIN = { stage: { kind: '', data: {}, at: 0 }, count: K.store.get('msgCount', 0) || 0, lastIntent: '' };

  /* ------------------------- the user's profile ------------------------- */
  K.profile = {
    name: '', jokes: 2, secrets: true,
    load: function () {
      var p = K.store.get('profile', {}) || {};
      this.name = typeof p.name === 'string' ? p.name : '';
      this.jokes = (p.jokes === undefined || p.jokes === null) ? 2 : K.clamp(Number(p.jokes) || 0, 0, 3);
      this.secrets = p.secrets !== false;
      return this;
    },
    save: function () {
      K.store.set('profile', { name: this.name, jokes: this.jokes, secrets: this.secrets });
      return this;
    },
    setName: function (name) {
      var clean = String(name || '').trim().replace(/\s+/g, ' ').slice(0, 40);
      if (clean) this.name = K.titleCase(clean);
      this.save();
      return this.name;
    }
  };
  K.profile.load();
  K.userName = function () { return K.profile.name || ''; };
  /* Every {name} / {city} placeholder in RESP gets filled from here.
     Without a saved name we use a friendly word so that lines addressing
     the user never render as “Thanks, !” */
  K.vars = function (extra) {
    var v = {
      name: K.userName() || (K.lang === 'ru' ? 'друг' : 'friend'),
      city: K.store.get('city', '') || ''
    };
    if (extra) {
      for (var k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k)) v[k] = extra[k];
      }
    }
    return v;
  };
  K.sayTo = function (category, extra) { return K.say(category, K.vars(extra)); };

  /* ------------------------- reading the message ------------------------- */
  var WORD_CHARS = 'a-zа-яё0-9';
  /* Russian words inflect ("шутк" -> шутка/шутки/шутку), so a plain Cyrillic
     token also swallows its own endings. Tokens already written as patterns
     ("час[аовыуе]*") are left untouched. */
  var PLAIN_TOKEN = /^[a-zA-Zа-яА-ЯёЁ'’\- ]+$/;
  function re(list) {
    var parts = list.map(function (w) {
      var token = String(w);
      return PLAIN_TOKEN.test(token) ? token + '[а-яё]*' : token;
    });
    return new RegExp('(^|[^' + WORD_CHARS + '])(' + parts.join('|') + ')([^' + WORD_CHARS + ']|$)', 'i');
  }
  function ctxOf(text) {
    var raw = String(text === undefined || text === null ? '' : text);
    var p = K.stripPunct(raw);
    return { raw: raw, t: K.norm(raw), p: p, words: p.split(/\s+/).filter(Boolean) };
  }
  function has(c, rx) { return rx.test(c.t); }
  function hasExact(c, list) {
    return list.some(function (w) { return c.t === w || c.p === w; });
  }
  var RE_WEATHER = re(['weather', 'forecast', 'rain', 'raining', 'snow', 'snowing', 'sunny', 'temperature',
    'hot', 'cold', 'windy', 'umbrella', 'погод', 'прогноз', 'дожд', 'снег', 'солнечн', 'температур', 'жарко',
    'холодно', 'зонт', 'ветрено', 'градус']);
  var RE_TIME = re(['time', 'clock', 'hour', 'время', 'час[аовыуе]*', 'сколько времени', 'часы']);
  var RE_DATE = re(['date', 'today', 'what day', 'дата', 'число', 'какой день', 'сегодня']);
  var RE_SEARCH = re(['tell me about', 'what is', 'who is', 'who was', 'explain', 'look up', 'search for', 'find out',
    'what do you know about', 'what do you know', 'do you know anything about',
    'расскажи про', 'расскажи о', 'что такое', 'кто такой', 'кто такая', 'объясни', 'найди', 'поищи', 'загугли',
    'что ты знаешь о', 'что ты знаешь', 'что знаешь о']);
  var RE_MATH = re(['how much is', 'what is', 'calculate', 'solve', 'сколько будет', 'посчитай', 'вычисли', 'реши']);

  /* ------------------------- conversation stages ------------------------- */
  function setStage(kind, data) {
    K.BRAIN.stage = { kind: kind || '', data: data || {}, at: Date.now() };
    return K.BRAIN.stage;
  }
  function getStage(kind) {
    var s = K.BRAIN.stage || {};
    if (!s.kind) return null;
    if (kind && s.kind !== kind) return null;
    if (Date.now() - (s.at || 0) > 10 * 60 * 1000) { setStage(''); return null; }
    return s;
  }
  function clearStage() { K.BRAIN.stage = { kind: '', data: {}, at: 0 }; }
  K.clearStage = clearStage;

  /* ------------------------- chips ------------------------- */
  function chipsFor(keys) {
    var all = K.svc.chips();
    return keys.map(function (key) {
      var hit = null;
      all.forEach(function (c) { if (c.key === key) hit = c; });
      return hit || { key: key, label: K.t(key), say: K.t(key) };
    });
  }
  function packChip() {
    return { key: 'chip.help', label: K.t('seeAll'), say: K.t('chip.help') };
  }
  K.chipsFor = chipsFor;

  /* ------------------------- small content helpers ------------------------- */
  function knowledge(name) {
    var group = K.KNOW && K.KNOW[name];
    if (!group) return [];
    if (Array.isArray(group)) return group;
    return group[K.lang] || group.en || [];
  }
  function drawItem(name) {
    var list = knowledge(name);
    if (!list.length) return null;
    return list[K.freshIndex('know:' + name + ':' + K.lang, list.length)];
  }
  K.KNOW = K.KNOW || {};
  K.brain = { draw: drawItem, knowledge: knowledge, ctx: ctxOf };
  /* Filler "Kuzya is thinking" lines the app shows while fetching */
  K.thinkWord = function () { return K.sayTo('confused') || ''; };
  /* ------------------------- name handling ------------------------- */
  var NAME_STOP = ['tired', 'sad', 'happy', 'angry', 'hungry', 'fine', 'ok', 'okay', 'good', 'great', 'bored',
    'lonely', 'sleepy', 'here', 'back', 'sorry', 'ready', 'done', 'busy', 'working', 'learning', 'thinking',
    'a', 'an', 'the', 'just', 'still', 'not', 'so', 'very', 'really', 'also',
    'устал', 'устала', 'голоден', 'голодна', 'готов', 'готова', 'занят', 'занята', 'рад', 'рада', 'зол', 'зла',
    'грустно', 'весело', 'скучно', 'тут', 'здесь', 'сейчас', 'уже', 'тоже', 'очень', 'люблю', 'хочу', 'буду',
    'могу', 'не', 'всё', 'все', 'норм', 'нормально', 'хорошо', 'плохо', 'дома',
    /* filler and question words — a name stage answer must not swallow them */
    'hmm', 'hm', 'huh', 'um', 'uhm', 'eh', 'meh', 'lol', 'yes', 'no', 'maybe', 'sup', 'yo',
    'hi', 'hello', 'hey', 'what', 'why', 'how', 'who', 'when', 'where',
    'хм', 'хмм', 'ага', 'угу', 'неа', 'ну', 'эх', 'ладно', 'ясно', 'понятно', 'ок', 'окей',
    'привет', 'здравствуй', 'спасибо', 'пока', 'чё', 'че', 'что', 'как', 'где', 'когда',
    'почему', 'зачем', 'кто', 'да', 'нет', 'друг', 'подруга'];
  function extractName(c) {
    var patterns = [
      /my name is\s+([^\s,!.?]+)/i,
      /\bi'?m\s+([^\s,!.?]+)/i,
      /\bi am\s+([^\s,!.?]+)/i,
      /call me\s+([^\s,!.?]+)/i,
      /\bменя зовут\s+([^\s,!.?]+)/i,
      /\bмоё имя\s+([^\s,!.?]+)/i,
      /\bмое имя\s+([^\s,!.?]+)/i,
      /\bзови меня\s+([^\s,!.?]+)/i,
      /\bя\s+([^\s,!.?]+)/i
    ];
    for (var i = 0; i < patterns.length; i++) {
      var m = c.raw.match(patterns[i]);
      if (!m) continue;
      var word = m[1].replace(/[^\wА-Яа-яЁё'-]/g, '');
      if (word.length < 2 || word.length > 24) continue;
      if (NAME_STOP.indexOf(K.norm(word)) !== -1) continue;
      return word;
    }
    return '';
  }

  /* ------------------------- intent registry ------------------------- */
  var INTENTS = [];
  function intent(id, when, run) { INTENTS.push({ id: id, when: when, run: run }); }
  K.brain.intents = INTENTS;

  var RE_NAMEQ = re(['what is my name', 'whats my name', 'what is my name again', 'do you remember my name',
    'как меня зовут', 'помнишь моё имя', 'помнишь мое имя', 'знаешь моё имя']);
  intent('nameQuestion', function (c) { return has(c, RE_NAMEQ); }, function () {
    var name = K.userName();
    if (name) {
      return K.msg(K.sayTo('nameGot'), { chips: chipsFor(['chip.joke', 'chip.riddle']), sound: 'receive' });
    }
    setStage('name', {});
    return K.msg(K.sayTo('nameAsk'), { chips: chipsFor(['chip.help']) });
  });

  var RE_LOVE = re(['i love you', 'love you kuzya', 'you are my favourite', 'я люблю тебя', 'люблю тебя',
    'ты лучший', 'ты мой любимый']);
  intent('love', function (c) { return has(c, RE_LOVE); }, function () {
    return K.msg(K.sayTo('love'), { chips: chipsFor(['chip.joke', 'chip.help']), sound: 'receive' });
  });

  var RE_TIRED = re(['i am tired', "i'm tired", 'im tired', 'exhausted', 'sleepy', 'need sleep', 'no sleep',
    'устал', 'устала', 'вымотал', 'спать хочу', 'не выспал']);
  intent('moodTired', function (c) { return has(c, RE_TIRED); }, function () {
    return K.msg(K.sayTo('moodTired'), { chips: chipsFor(['chip.joke', 'chip.quiz', 'chip.help']) });
  });
  var RE_SAD = re(['i am sad', "i'm sad", 'im sad', 'sad', 'upset', 'bad day', 'feel bad', 'грустн', 'печаль',
    'мне плохо', 'расстроен', 'тоскл', 'плачу']);
  intent('moodSad', function (c) { return has(c, RE_SAD); }, function () {
    return K.msg(K.sayTo('moodSad'), {
      card: { emoji: '🫂', title: K.sayTo('motivation'), lines: [] },
      chips: chipsFor(['chip.joke', 'chip.fact', 'chip.rps'])
    });
  });
  var RE_HAPPY = re(['i am happy', "i'm happy", 'im happy', 'so happy', 'great mood', 'feeling great',
    'я рад', 'я счастлив', 'мне весело', 'отличное настроение', 'классно']);
  intent('moodHappy', function (c) { return has(c, RE_HAPPY); }, function () {
    return K.msg(K.sayTo('moodHappy'), { chips: chipsFor(['chip.joke', 'chip.meme', 'chip.quiz']) });
  });
  var RE_ANGRY = re(['i am angry', "i'm angry", 'im angry', 'furious', 'so mad', 'annoyed', 'бесит', 'злюсь',
    'я злой', 'раздраж', 'ненавижу']);
  intent('moodAngry', function (c) { return has(c, RE_ANGRY); }, function () {
    return K.msg(K.sayTo('moodAngry'), { chips: chipsFor(['chip.joke', 'chip.rps', 'chip.meme']) });
  });
  var RE_BORED = re(['bored', 'boring', 'nothing to do', 'so dull', 'скучно', 'нечего делать', 'заняться нечем']);
  intent('moodBored', function (c) { return has(c, RE_BORED); }, function () {
    return K.msg(K.sayTo('moodBored'), {
      chips: chipsFor(['chip.rps', 'chip.quiz', 'chip.guess', 'chip.meme']), sound: 'receive'
    });
  });
  var RE_LONELY = re(['lonely', 'i am alone', "i'm alone", 'no friends', 'одиноко', 'мне одинок', 'нет друзей']);
  intent('moodLonely', function (c) { return has(c, RE_LONELY); }, function () {
    return K.msg(K.sayTo('moodLonely'), { chips: chipsFor(['chip.joke', 'chip.rps', 'chip.riddle']) });
  });
  var RE_MOTIVATE = re(['motivate me', 'motivation', 'inspire me', 'i give up', 'want to give up',
    'мотивируй', 'вдохнови', 'мотивац', 'я сдаюсь', 'нет сил']);
  intent('motivation', function (c) { return has(c, RE_MOTIVATE); }, function () {
    return K.msg(K.sayTo('motivation'), { chips: chipsFor(['chip.fact', 'chip.joke']) });
  });
  var RE_HOWAREYOU = re(['how are you', 'how are you doing', 'how is it going', "how's it going", 'how do you do',
    'как дела', 'как ты', 'как жизнь', 'как сам', 'что нового']);
  intent('howAreYou', function (c) { return has(c, RE_HOWAREYOU); }, function () {
    return K.msg(K.sayTo('howAreYou'), { chips: chipsFor(['chip.joke', 'chip.fact']), sound: 'receive' });
  });
  var RE_WHOAREYOU = re(['who are you', 'what are you', 'your name', 'who is kuzya', 'what is kuzya',
    'кто ты', 'что ты такое', 'как тебя зовут', 'ты кто', 'кто такой кузя']);
  intent('whoAreYou', function (c) { return has(c, RE_WHOAREYOU); }, function () {
    return K.msg(K.sayTo('whoAreYou'), { chips: chipsFor(['chip.help', 'chip.joke']) });
  });
  var RE_AI = re(['are you a robot', 'are you ai', 'are you human', 'are you real', 'do you have feelings',
    'ты робот', 'ты живой', 'ты человек', 'ты ии', 'ты бот', 'искусственный интеллект', 'у тебя есть чувства']);
  intent('aiExplain', function (c) { return has(c, RE_AI); }, function () {
    return K.msg(K.sayTo('aiExplain'), { chips: chipsFor(['chip.help']), sound: 'receive' });
  });
  var RE_THANKS = re(['thank you', 'thanks', 'thx', 'appreciate it', 'спасибо', 'благодар', 'спс', 'выручил']);
  intent('thanks', function (c) { return has(c, RE_THANKS); }, function () {
    return K.msg(K.sayTo('thanks'), { chips: chipsFor(['chip.joke', 'chip.help']) });
  });
  var RE_BYE = re(['bye', 'goodbye', 'see you', 'i am going', 'talk later',
    'пока(?!з|ж)', 'до свидания', 'до встречи', 'я спать', 'увидимся']);
  intent('bye', function (c) { return has(c, RE_BYE); }, function () {
    clearStage();
    return K.msg(K.sayTo('bye'), { chips: chipsFor(['chip.joke']), sound: 'bell' });
  });
  var RE_COMPLIMENT = re(['you are cool', 'you are great', 'you are the best', 'you are amazing', 'you are awesome',
    'amazing', 'awesome', 'good job', 'well done', 'nice one', 'impressive',
    'ты классный', 'ты классная', 'ты лучший', 'ты лучшая', 'молодец', 'хорошая работа', 'ты супер', 'ты крутой', 'ты крутая']);
  intent('compliment', function (c) { return has(c, RE_COMPLIMENT); }, function () {
    return K.msg(K.sayTo('compliment'), {
      card: { emoji: '😌', title: K.sayTo('complimentBack'), lines: [] }, sound: 'receive'
    });
  });
  var RE_INSULT = re(['you are stupid', 'you are dumb', 'useless', 'shut up',
    'ты дурак', 'ты тупой', 'бесполезн', 'замолчи', 'ты не прав', 'глупый бот', 'плохой бот']);
  intent('insult', function (c) { return has(c, RE_INSULT); }, function () {
    return K.msg(K.sayTo('insult'), { chips: chipsFor(['chip.joke', 'chip.help']) });
  });
  var RE_SORRY = re(['i am sorry', "i'm sorry", 'im sorry', 'sorry', 'forgive me', 'my bad', 'my fault',
    'извини', 'извиняюсь', 'прости', 'прошу прощения', 'сорри', 'я виноват', 'я виновата']);
  intent('apology', function (c) { return has(c, RE_SORRY); }, function () {
    return K.msg(K.sayTo('apology'), { chips: chipsFor(['chip.joke']), sound: 'receive' });
  });
  /* Wrapped so both the nav button and the "what can you do" chip work */
  K.help = function () {
    return K.msg(K.sayTo('helpIntro') + ' ' + K.sayTo('helpThen'), {
      card: { emoji: '🧭', title: K.t('nav.help'), lines: [K.sayTo('helpOutro')] },
      chips: chipsFor(['chip.weather', 'chip.joke', 'chip.riddle', 'chip.search', 'chip.rps', 'chip.quiz',
        'chip.todo', 'chip.timer', 'chip.cartoon', 'chip.secret']),
      sound: 'receive'
    });
  };
  var RE_HELP = re(['what can you do', 'what can i ask', 'help me', 'help', 'how do you work', 'what are you good at',
    'list of skills', 'commands', 'что ты умеешь', 'что можно спросить', 'помоги', 'помощь', 'команды',
    'что ты можешь', 'какие команды']);
  intent('help', function (c) { return has(c, RE_HELP) || K.norm(c.raw) === K.norm(K.t('chip.help')); },
    function () { return K.help(); });

  /* A bare name, right after Kuzya asked for it */
  /* “asdfgh” is not a name — reject keyboard mash with long consonant runs */
  function looksLikeName(word) {
    var w = K.norm(word);
    if (!w || w.length > 24) return false;
    return !/[bcdfghjklmnpqrstvwxz]{5,}|[бвгджзклмнпрстфхцчшщ]{5,}/.test(w);
  }
  function nameStageBeat(c) {
    var name = extractName(c);
    if (!name && c.words.length === 1 && c.words[0].length >= 2 && NAME_STOP.indexOf(c.words[0]) === -1
      && looksLikeName(c.words[0])) {
      name = c.words[0];
    }
    if (!name) return null;
    clearStage();
    var saved = K.profile.setName(name);
    return K.msg(K.sayTo('nameGot', { name: saved }), {
      chips: chipsFor(['chip.joke', 'chip.riddle', 'chip.weather']),
      sound: 'receive', toast: { title: K.t('toast.nameSaved', { name: saved }), body: K.t('toast.nameSavedBody') }
    });
  }
  /* "I'm Alex" outside the name stage */
  var RE_IM = re(["i'm", 'i am', 'my name is', 'call me', 'меня зовут', 'моё имя', 'мое имя', 'зови меня']);
  intent('setName', function (c) { return has(c, RE_IM); }, function (c) {
    var name = extractName(c);
    if (!name) return null;
    clearStage();
    var saved = K.profile.setName(name);
    return K.msg(K.sayTo('nameGot', { name: saved }), {
      chips: chipsFor(['chip.joke', 'chip.riddle']),
      sound: 'receive', toast: { title: K.t('toast.nameSaved', { name: saved }), body: K.t('toast.nameSavedBody') }
    });
  });

  /* ------------------------- jokes, riddles, facts ------------------------- */
  var RE_JOKE = re(['joke', 'jokes', 'make me laugh', 'something funny', 'funny', 'anecdote', 'pun',
    'шутк', 'анекдот', 'рассмеши', 'пошути', 'смешн', 'прикол', 'юмор']);
  intent('joke', function (c) { return has(c, RE_JOKE); }, function () {
    var pair = drawItem('jokes');
    var body = pair ? K.langs(pair) : K.t('g.noContent');
    K.BRAIN.jokes = (K.BRAIN.jokes || 0) + 1;
    return K.msgCard({
      emoji: '😄', title: K.sayTo('jokeIntro', { n: K.BRAIN.jokes }), lines: [body],
      footer: K.sayTo('jokeOutro')
    }, {
      chips: chipsFor(['chip.joke', 'chip.riddle', 'chip.fact']), sound: 'receive'
    });
  });

  var RE_RIDDLE = re(['riddle', 'puzzle me', 'brain teaser', 'tease my brain', 'загадк', 'загадай', 'головоломк',
    'разгадай', 'ребус']);
  intent('riddle', function (c) {
    /* “emoji riddle” is the emoji game, not a word riddle */
    if (K.games.byText(c.raw)) return false;
    return has(c, RE_RIDDLE);
  }, function () {
    var item = drawItem('riddles');
    if (!item) return K.msg(K.t('g.noContent'));
    setStage('riddle', { item: item, tries: 0 });
    return K.msgCard({
      emoji: '🧩', title: K.sayTo('riddleIntro'), lines: [K.langs(item.q || item)]
    }, {
      chips: chipsFor(['chip.riddle']).concat([
        { key: 'roger', label: K.t('g.revealAnswer'), say: K.t('g.revealAnswer') },
        { key: 'stop', label: K.t('g.stop'), say: K.t('g.stop') }
      ]),
      sound: 'receive'
    });
  });
  function riddleStageBeat(c) {
    var st = getStage('riddle');
    if (!st) return null;
    var item = (st.data || {}).item || {};
    var answer = K.langs(item.a || '');
    if (K.games.isAny(c.raw, ['g.revealAnswer', 'g.giveUp'])) {
      clearStage();
      return K.msgCard({
        emoji: '🏳️', title: K.sayTo('riddleGiveUp', { answer: answer }), lines: []
      }, { chips: chipsFor(['chip.riddle', 'chip.joke']) });
    }
    if (answer && K.games.loose(c.raw, answer)) {
      clearStage();
      return K.msgCard({
        emoji: '✅', title: K.sayTo('riddleCorrect', { answer: answer }), lines: []
      }, { chips: chipsFor(['chip.riddle', 'chip.joke']), sound: 'receive' });
    }
    st.data.tries = (st.data.tries || 0) + 1;
    st.at = Date.now();
    if (st.data.tries >= 2) {
      clearStage();
      return K.msgCard({
        emoji: '🙃', title: K.sayTo('riddleWrong', { answer: answer }), lines: []
      }, { chips: chipsFor(['chip.riddle', 'chip.joke']) });
    }
    return K.msgCard({ emoji: '🧩', title: K.t('g.tryAgain'), lines: [] }, {
      chips: [{ key: 'roger', label: K.t('g.revealAnswer'), say: K.t('g.revealAnswer') }]
    });
  }

  var RE_FACT = re(['fact', 'interesting fact', 'tell me something interesting', 'fun fact', 'did you know',
    'факт', 'интересное', 'что-нибудь интересное', 'знаешь ли ты', 'интересный факт']);
  intent('fact', function (c) { return has(c, RE_FACT); }, function () {
    var pair = drawItem('facts');
    var body = pair ? K.langs(pair) : K.t('g.noContent');
    return K.msgCard({ emoji: '💡', title: K.sayTo('factIntro'), lines: [body] }, {
      chips: chipsFor(['chip.fact', 'chip.joke', 'chip.search']), sound: 'receive'
    });
  });

  var RE_QUOTE = re(['quote', 'inspire me with words', 'wise words', 'wisdom', 'цитат', 'мудрост', 'вдохновляющ',
    'мысль дня', 'афоризм']);
  intent('quote', function (c) { return has(c, RE_QUOTE); }, function () {
    var item = drawItem('quotes') || {};
    return K.msgCard({
      emoji: '📜',
      title: K.sayTo('quoteIntro'),
      lines: ['«' + (item.text || '') + '» — ' + (item.author || '')]
    }, { chips: chipsFor(['chip.fact', 'chip.help']), sound: 'receive' });
  });
  /* ------------------------- secret photos ------------------------- */
  K.SECRET = {
    total: K.SECRET_COUNT,
    found: [],
    load: function () {
      var saved = K.store.get('secrets', []);
      this.found = Array.isArray(saved) ? saved.filter(function (n) {
        return typeof n === 'number' && n >= 1 && n <= K.SECRET_COUNT;
      }) : [];
      return this.found;
    },
    save: function () {
      K.store.set('secrets', this.found);
      if (typeof K.onSecretChange === 'function') K.onSecretChange(this.found);
      return this.found;
    },
    has: function (n) { return this.found.indexOf(n) !== -1; },
    remaining: function () { return this.total - this.found.length; },
    nextIndex: function () {
      for (var i = 1; i <= this.total; i++) { if (!this.has(i)) return i; }
      return null;
    },
    caption: function (n) {
      var captions = knowledge('secretCaptions');
      if (!captions.length) return '';
      return captions[(n - 1) % captions.length];
    },
    url: function (n) { return K.url(K.SECRETS[n - 1] || ''); },
    /* Open one photo (the next unseen one by default) and remember it */
    unlock: function (n) {
      var idx = n || this.nextIndex();
      if (!idx) return null;
      var seen = this.has(idx);
      if (!seen) { this.found.push(idx); this.save(); }
      return { n: idx, url: this.url(idx), caption: this.caption(idx), fresh: !seen };
    },
    /* Rows for the gallery panel in app.js */
    list: function () {
      var self = this;
      return K.SECRETS.map(function (file, i) {
        var n = i + 1;
        return { n: n, file: file, unlocked: self.has(n), caption: self.caption(n), url: self.url(n) };
      });
    },
    /* Rare surprise: every 9th message Kuzya slips in a new secret photo */
    maybe: function (count) {
      if (!K.profile.secrets) return null;
      if (!count || count % 9 !== 0) return null;
      if (this.remaining() <= 0) return null;
      if (!K.chance(0.6)) return null;
      return this.unlock();
    },
    /* Build the chat bubble for one unlocked photo */
    beat: function (photo, title, extraChips) {
      var chips = chipsFor(['chip.secret', 'chip.joke']);
      return K.msgCard({
        emoji: '🤫',
        title: title || K.sayTo('secretIntro'),
        lines: [photo.caption],
        footer: K.t('secret.found', { found: this.found.length, total: this.total })
      }, {
        photo: { url: photo.url, caption: photo.caption, n: photo.n },
        chips: extraChips || chips,
        sound: 'bell',
        toast: {
          title: K.t('toast.secretFound'),
          body: K.t('toast.secretFoundBody', { found: this.found.length, total: this.total })
        }
      });
    }
  };
  K.SECRET.load();

  /* ------------------------- cartoons & memes ------------------------- */
  function link(label, url, kind) { return { label: label, url: url, kind: kind || 'web' }; }
  function cartoonBeat(name) {
    var clip = name || K.pick(knowledge('cartoons'));
    var search = K.svc.youTubeSearch(clip + (K.lang === 'ru' ? ' мультик' : ' cartoon'));
    return K.msgCard({
      emoji: '📺', title: K.sayTo('cartoonIntro', { title: clip }), lines: [clip], footer: K.sayTo('cartoonOutro')
    }, {
      chips: chipsFor(['chip.cartoon', 'chip.joke']),
      link: link(K.t('search.open') + ': ' + clip, search, 'video'), sound: 'receive'
    });
  }
  var RE_CARTOON = re(['cartoon', 'cartoons', 'watch something', 'show me a cartoon', 'animated',
    'мультик', 'мультфильм', 'мультики', 'что посмотреть']);
  intent('cartoon', function (c) { return has(c, RE_CARTOON); }, function (c) {
    /* "show me Tom and Jerry" — respect a title the user names */
    var named = '';
    knowledge('cartoons').forEach(function (title) {
      if (!named && K.norm(c.raw).indexOf(K.norm(title)) !== -1) named = title;
    });
    return cartoonBeat(named);
  });

  var RE_MEME = re(['meme', 'memes', 'make me a meme', 'мем', 'мемасик', 'мемчик', 'сделай мем']);
  intent('meme', function (c) { return has(c, RE_MEME); }, function () { return K.games.once.meme(); });

  var RE_SING = re(['sing', 'sing me a song', 'song', 'serenade', 'спой', 'песенк', 'песню', 'спеть', 'споёшь']);
  intent('sing', function (c) { return has(c, RE_SING); }, function () {
    return K.msg(K.sayTo('sing'), { chips: chipsFor(['chip.joke', 'chip.fact']), sound: 'receive' });
  });
  var RE_DANCE = re(['dance', 'show me a dance', 'танцуй', 'станцуй', 'потанцуем', 'танец']);
  intent('dance', function (c) { return has(c, RE_DANCE); }, function () {
    return K.msg(K.sayTo('dance'), { chips: chipsFor(['chip.joke', 'chip.meme']) });
  });

  /* ------------------------- Kuzya himself ------------------------- */
  var RE_SECRET = re(['secret photo', 'secret photos', 'secret picture', 'your secret', 'hidden photo',
    'секретное фото', 'секретные фото', 'секрет', 'тайное фото', 'потайное фото']);
  intent('secretAsk', function (c) { return has(c, RE_SECRET); }, function () {
    var vars = { found: K.SECRET.found.length, total: K.SECRET.total };
    if (!K.profile.secrets) {
      return K.msg(K.sayTo('secretLocked', vars), { chips: chipsFor(['chip.secret', 'chip.joke']) });
    }
    if (K.SECRET.remaining() <= 0) {
      return K.msgCard({
        emoji: '🗝️', title: K.sayTo('secretTease'),
        lines: [K.t('secret.found', vars), K.t('gallery.secretHint')]
      }, { chips: chipsFor(['chip.joke', 'chip.fact']), sound: 'receive' });
    }
    var photo = K.SECRET.unlock();
    return K.SECRET.beat(photo);
  });
  /* "open the gallery" — the app switches to the gallery view for this beat */
  var RE_GALLERY = re(['gallery', 'photo album', 'open the gallery', 'your photos', 'your pictures',
    'галере', 'фотоальбом', 'альбом', 'твои фото', 'твои фотки', 'покажи галерею', 'открой галере']);
  intent('gallery', function (c) { return has(c, RE_GALLERY); }, function () {
    var n = K.rand(1, K.PHOTOS.length);
    return K.msgCard({
      emoji: '🖼️',
      title: K.t('view.gallery'),
      lines: [K.t('gallery.notePublic')],
      footer: K.t('secret.found', { found: K.SECRET.found.length, total: K.SECRET.total })
    }, {
      photo: { url: K.photoUrl(n), caption: K.t('cap' + n), n: n },
      chips: chipsFor(['chip.secret', 'chip.joke']), sound: 'receive', view: 'gallery'
    });
  });

  var RE_PHOTO = re(['your photo', 'picture of you', 'photo of you', 'show yourself', 'your picture',
    'твоё фото', 'твое фото', 'твоя фотка', 'покажи себя', 'фото кузи']);
  intent('photo', function (c) { return has(c, RE_PHOTO); }, function () {
    var n = K.rand(1, K.PHOTOS.length);
    return K.msg(K.sayTo('photoIntro'), {
      photo: { url: K.photoUrl(n), caption: K.t('cap' + n), n: n },
      chips: chipsFor(['chip.joke', 'chip.secret']), sound: 'receive'
    });
  });
  var RE_HOWOLD = re(['how old are you', 'your age', 'when is your birthday', 'when were you made',
    'сколько тебе лет', 'твой возраст', 'когда твой день рождения', 'когда тебя создали']);
  intent('howOld', function (c) { return has(c, RE_HOWOLD); }, function () {
    return K.msgCard({
      emoji: '🎂', title: K.sayTo('howOld'), lines: [K.sayTo('birthday')]
    }, { chips: chipsFor(['chip.fact', 'chip.joke']) });
  });
  var RE_WHERELIVE = re(['where do you live', 'where are you from', 'where are you now', 'your home',
    'где ты живёшь', 'где ты живешь', 'откуда ты', 'где твой дом', 'где ты находишься']);
  intent('whereLive', function (c) { return has(c, RE_WHERELIVE); }, function () {
    return K.msg(K.sayTo('whereLive'), {
      card: { emoji: '🪐', title: K.sayTo('deepQuestion'), lines: [] },
      chips: chipsFor(['chip.fact', 'chip.search'])
    });
  });
  var RE_DEEP = re(['meaning of life', 'why are we here', 'do you dream', 'what is love', 'are we alone',
    'is there life out there', 'смысл жизни', 'зачем мы здесь', 'тебе снится', 'что такое любовь',
    'мы одни во вселенной', 'есть ли жизнь']);
  intent('deep', function (c) { return has(c, RE_DEEP); }, function () {
    return K.msgCard({ emoji: '🌌', title: K.sayTo('deepQuestion'), lines: [] }, {
      chips: chipsFor(['chip.fact', 'chip.riddle']), sound: 'receive'
    });
  });
  var RE_EAT = re(['what should i eat', 'what do you eat', 'what to eat', 'hungry', 'dinner idea', 'lunch idea',
    'что поесть', 'что съесть', 'что ты ешь', 'я голоден', 'я голодна', 'хочу есть', 'что на ужин', 'что на обед']);
  intent('whatEat', function (c) { return has(c, RE_EAT); }, function () {
    return K.msg(K.sayTo('whatEat'), { chips: chipsFor(['chip.joke', 'chip.fact']) });
  });
  var RE_EASTER = re(['42', 'are you skynet', 'do you know everything', 'tell me a secret about yourself',
    'кузя кузя', 'ты скайнет', 'расскажи о себе', 'секрет о себе']);
  intent('easterEgg', function (c) { return hasExact(c, ['42']) || has(c, RE_EASTER); }, function () {
    return K.msgCard({ emoji: '🥚', title: K.sayTo('easterEgg'), lines: [] }, {
      chips: chipsFor(['chip.secret', 'chip.joke']), sound: 'receive'
    });
  });
  var RE_SITE = re(['who made you', 'who built you', 'your creator', 'about this site', 'what is this site',
    'кто тебя сделал', 'кто тебя создал', 'о сайте', 'что это за сайт']);
  intent('siteAd', function (c) { return has(c, RE_SITE); }, function () {
    return K.msgCard({ emoji: '✨', title: K.sayTo('siteAd'), lines: [] }, {
      chips: chipsFor(['chip.help', 'chip.joke']), sound: 'receive'
    });
  });
  /* ------------------------- cities, weather, clocks ------------------------- */
  var CITY_FILLER = ['what', 'is', 'the', 'weather', 'like', 'today', 'now', 'in', 'at', 'for', 'currently',
    'tell', 'me', 'about', 'forecast', 'temperature', 'outside', 'please',
    'какая', 'какой', 'погода', 'сегодня', 'сейчас', 'в', 'во', 'на', 'для', 'мне', 'скажи',
    'прогноз', 'температура', 'улице', 'будет', 'пожалуйста'];
  function cleanCity(raw) {
    var words = K.stripPunct(raw).split(/\s+/).filter(Boolean);
    var out = words.filter(function (w) { return CITY_FILLER.indexOf(w) === -1 && w.length > 1; });
    if (!out.length) return '';
    return out.join(' ').split(/[?!.]/)[0].trim().slice(0, 40);
  }
  function savedCity() { return String(K.store.get('city', '') || '').trim(); }
  K.setCity = function (city) {
    var clean = String(city || '').trim().slice(0, 40);
    if (clean && K.svc && typeof K.svc.knownCityName === 'function') {
      var known = K.svc.knownCityName(clean);   /* “Киеве” -> “Киев” */
      if (known) clean = known;
    }
    if (clean) K.store.set('city', clean);
    return clean;
  };

  function weatherBeat(city) {
    var place = city || savedCity();
    return K.svc.weather(place).then(function (w) {
      if (!w) {
        return K.msg(K.sayTo('weatherFail'), {
          link: link(K.t('search.open') + ': ' + place, K.svc.webSearch('weather ' + place), 'web'),
          chips: chipsFor(['chip.weather', 'chip.help'])
        });
      }
      K.setCity(w.city || place);
      var moodKey = { rain: 'weatherRain', snow: 'weatherSnow', wind: 'weatherWind',
        hot: 'weatherHot', cold: 'weatherCold', mild: 'weatherMild' }[w.mood] || 'weatherMild';
      var lines = [K.svc.weatherLine(w), K.sayTo('weatherIntro'), K.sayTo(moodKey)];
      if (w.daily && w.daily[0]) {
        lines.push(K.t('w.day') + ': ' + w.daily[0].min + '° / ' + w.daily[0].max + '°');
      }
      return K.msgCard({
        emoji: w.condition.emoji,
        title: w.city + (w.place && w.place.country ? ', ' + w.place.country : ''),
        lines: lines
      }, { chips: chipsFor(['chip.time', 'chip.fact', 'chip.help']), sound: 'receive' });
    }).catch(function (err) {
      var offline = err && err.message === 'offline';
      return K.msg(K.sayTo(offline ? 'weatherOffline' : 'weatherFail'), {
        link: link(K.t('search.open') + ': ' + K.t('stat.weather'), K.svc.webSearch('weather ' + place), 'web'),
        chips: chipsFor(['chip.weather', 'chip.help'])
      });
    });
  }
  intent('weather', function (c) { return has(c, RE_WEATHER); }, function (c) {
    if (RE_WEATHER_MOOD.test(c.t)) return null;      /* "I'm cold" is a feeling, not a forecast */
    if (RE_TIMER_WORDS.test(c.t) || RE_ALARM_WORDS.test(c.t)) return null;
    var city = cleanCity(c.raw);
    if (city) { clearStage(); return weatherBeat(city); }
    var saved = savedCity();
    if (saved) return weatherBeat(saved);
    setStage('city', {});
    return K.msg(K.sayTo('weatherAskCity'), { chips: chipsFor(['chip.weather']) });
  });
  /* Follow-up: the user replies with just a city name after we asked */
  function cityStageBeat(c) {
    var city = cleanCity(c.raw);
    if (!city || city.length < 2) return null;
    clearStage();
    return weatherBeat(city);
  }
  /* “I live in Berlin” — remember the city without asking for a forecast */
  var RE_CITY_SET = re(['i live in', 'i am from', 'i come from', 'my city is', 'my town is',
    'я живу в', 'я из', 'мой город', 'я нахожусь в']);
  var CITY_SET_FILLER = ['i', 'live', 'in', 'am', 'from', 'come', 'my', 'city', 'town', 'is', 'based',
    'located', 'moving', 'moved', 'to', 'я', 'живу', 'из', 'мой', 'город', 'нахожусь', 'переехал', 'переехала'];
  function cityFromText(raw) {
    var words = K.stripPunct(raw).split(/\s+/).filter(Boolean);
    var out = words.filter(function (w) {
      return CITY_FILLER.indexOf(w) === -1 && CITY_SET_FILLER.indexOf(w) === -1 && w.length > 1;
    });
    if (!out.length) return '';
    return out.join(' ').split(/[?!.]/)[0].trim().slice(0, 40);
  }
  intent('setCity', function (c) { return has(c, RE_CITY_SET) && !!cityFromText(c.raw); }, function (c) {
    var city = K.setCity(K.titleCase(cityFromText(c.raw)));
    clearStage();
    return K.msgCard({ emoji: '📍', title: K.sayTo('citySaved', { city: city }), lines: [] }, {
      chips: chipsFor(['chip.weather', 'chip.time']), sound: 'receive'
    });
  });

  function timeBeat(city) {
    var tz = K.svc.localTimezone();
    var name = city;
    if (name && K.svc.knownCities[name.toLowerCase()]) {
      tz = K.svc.knownCities[name.toLowerCase()].timezone;
      name = K.svc.knownCities[name.toLowerCase()].name;
    }
    var clock = K.svc.timeIn(tz);
    if (!clock) return K.msg(K.sayTo('timeFail'), { chips: chipsFor(['chip.time']) });
    return K.msgCard({
      emoji: '🕰️',
      title: (name ? name + ' · ' : '') + clock.time,
      lines: [K.sayTo('timeIntro'), clock.date, K.t('stat.time') + ': ' + clock.local + ' (' + tz + ')']
    }, { chips: chipsFor(['chip.time', 'chip.weather', 'chip.timer']), sound: 'receive' });
  }
  intent('time', function (c) { return has(c, RE_TIME); }, function (c) {
    /* "in an hour", "timer in 10 minutes" belong to the timer, not the clock */
    if (RE_TIMER_WORDS.test(c.t)) return null;
    return timeBeat(cleanCity(c.raw));
  });

  intent('date', function (c) {
    /* “угадай число” is a game, not a calendar question */
    if (K.games.byText(c.raw)) return false;
    return has(c, RE_DATE);
  }, function () {
    var now = new Date();
    return K.msgCard({
      emoji: '📅',
      title: K.fmtDate(now),
      lines: [K.sayTo('dateIntro'), K.fmtTime(now) + ' · ' + ({ morning: '🌅', day: '☀️', evening: '🌇', night: '🌙' }[K.partOfDay()] || '')]
    }, { chips: chipsFor(['chip.time', 'chip.joke']), sound: 'receive' });
  });
  /* ------------------------- Wikipedia search ------------------------- */
  var QUERY_FILLER = ['tell', 'me', 'about', 'what', 'is', 'are', 'who', 'was', 'were', 'explain', 'look', 'up',
    'search', 'for', 'find', 'out', 'please', 'the', 'a', 'an', 'of', 'in', 'on',
    'расскажи', 'про', 'о', 'об', 'что', 'такое', 'кто', 'такой', 'такая', 'объясни', 'найди', 'поищи',
    'загугли', 'пожалуйста', 'мне', 'это'];
  function cleanQuery(raw) {
    var words = K.stripPunct(raw).split(/\s+/).filter(Boolean);
    var out = words.filter(function (w) { return QUERY_FILLER.indexOf(w) === -1; });
    return (out.length ? out : words).join(' ').trim().slice(0, 80);
  }
  function searchBeat(query) {
    if (!query) return K.msg(K.sayTo('searchEmpty', { query: K.t('chip.search') }), { chips: chipsFor(['chip.search', 'chip.help']) });
    if (!K.svc.online()) {
      return K.msgCard({
        emoji: '📡', title: K.t('toast.offline'), lines: [K.t('toast.offlineBody')]
      }, {
        link: link(K.t('search.open') + ': ' + query, K.svc.webSearch(query), 'web'),
        chips: chipsFor(['chip.search', 'chip.help'])
      });
    }
    return K.svc.wiki(query).then(function (hit) {
      if (!hit) {
        return K.msgCard({
          emoji: '🔎', title: K.sayTo('searchFail'), lines: [query]
        }, {
          link: link(K.t('search.open') + ': ' + query, K.svc.webSearch(query), 'web'),
          chips: chipsFor(['chip.search', 'chip.help'])
        });
      }
      var lines = [K.sayTo('searchIntro'), hit.extract];
      if (hit.description) lines.push(hit.description);
      var extra = {
        link: link(K.t('search.open') + ': ' + hit.title, hit.url, 'wiki'),
        chips: chipsFor(['chip.fact', 'chip.help']), sound: 'receive'
      };
      if (hit.thumbnail) extra.photo = { url: hit.thumbnail, caption: hit.title };
      return K.msgCard({ emoji: '📚', title: hit.title, lines: lines, footer: K.t('search.source') }, extra);
    }).catch(function () {
      return K.msgCard({
        emoji: '📡', title: K.sayTo('searchFail'), lines: [query]
      }, { link: link(K.t('search.open') + ': ' + query, K.svc.webSearch(query), 'web') });
    });
  }
  intent('search', function (c) { return has(c, RE_SEARCH); }, function (c) {
    if (mathExpr(c.raw)) return null;   /* "what is 2+2" is arithmetic, not Wikipedia */
    return searchBeat(cleanQuery(c.raw));
  });
  /* ------------------------- arithmetic ------------------------- */
  /* “twelve plus eight”, “20 плюс 20” — word operators become symbols
     before the expression is picked out of the sentence. */
  var WORD_MATH = [
    { rx: re(['plus', 'плюс']), sym: '+' },
    { rx: re(['minus', 'минус']), sym: '-' },
    { rx: re(['times', 'multiplied by', 'умножить на', 'умножь на', 'умножаем на']), sym: '*' },
    { rx: re(['divided by', 'divide by', 'разделить на', 'поделить на', 'делить на']), sym: '/' }
  ];
  function mathText(raw) {
    var text = String(raw || '');
    WORD_MATH.forEach(function (w) {
      text = text.replace(new RegExp(w.rx.source, 'gi'), ' ' + w.sym + ' ');
    });
    return text;
  }
  function mathExpr(raw) {
    var text = mathText(raw).replace(/[×х]/gi, '*').replace(/÷/g, '/').replace(/\^/g, '**').replace(/,/g, '.');
    var m = text.match(/\d+(?:\.\d+)?(?:\s*[-+*/%]\s*\d+(?:\.\d+)?)+/);
    if (!m) return '';
    var expr = m[0].replace(/\s+/g, '');
    return expr.length > 40 ? '' : expr;
  }
  function compute(expr) {
    if (!expr || !/^[-+*/%().\d]+$/.test(expr)) return null;
    try {
      var val = Function('"use strict";return (' + expr + ');')();
      if (typeof val !== 'number' || !isFinite(val)) return null;
      return Math.round(val * 1e6) / 1e6;
    } catch (e) { return null; }
  }
  function niceNumber(n) {
    try { return n.toLocaleString(K.lang === 'ru' ? 'ru-RU' : 'en-US'); } catch (e) { return String(n); }
  }
  intent('math', function (c) { return !!mathExpr(c.raw); }, function (c) {
    var expr = mathExpr(c.raw);
    var val = compute(expr);
    var shown = expr.replace(/\*\*/g, ' ^ ').replace(/\*/g, ' × ').replace(/\//g, ' ÷ ');
    if (val === null) {
      return K.msg(K.sayTo('mathFail'), { chips: chipsFor(['chip.help']) });
    }
    return K.msgCard({
      emoji: '🧮', title: shown + ' = ' + niceNumber(val),
      lines: [K.sayTo('mathAnswer', { expression: shown, result: niceNumber(val) })]
    }, { chips: chipsFor(['chip.joke', 'chip.fact']), sound: 'receive' });
  });

  /* ------------------------- durations & clock times ------------------------- */
  var NUM_WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, fifteen: 15, twenty: 20, thirty: 30, forty: 40, fortyfive: 45, sixty: 60,
    'один': 1, 'одну': 1, 'два': 2, 'две': 2, 'три': 3, 'четыре': 4, 'пять': 5, 'шесть': 6, 'семь': 7,
    'восемь': 8, 'девять': 9, 'десять': 10, 'одиннадцать': 11, 'двенадцать': 12, 'пятнадцать': 15,
    'двадцать': 20, 'тридцать': 30, 'сорок': 40, 'сорок пять': 45, 'шестьдесят': 60 };
  function wordNumber(text) {
    var words = K.norm(text).split(/[^a-zа-яё0-9]+/).filter(Boolean);
    for (var i = 0; i < words.length; i++) {
      if (NUM_WORDS[words[i]] !== undefined) return NUM_WORDS[words[i]];
    }
    return null;
  }
  K.fmtDuration = function (sec) {
    var m = Math.floor(sec / 60), s = Math.round(sec % 60), parts = [];
    if (m) parts.push(m + ' ' + K.t('timer.min'));
    if (s) parts.push(s + ' ' + K.t('timer.sec'));
    if (!parts.length) parts.push('0 ' + K.t('timer.sec'));
    return parts.join(' ');
  };
  /* "10 minutes", "90 seconds", "в 5 минут", "полчаса" -> seconds (0 = nothing found) */
  K.parseDuration = function (text) {
    var t = K.norm(String(text || '')) + ' ';
    var total = 0, hit = false;
    function grab(unitRx, mult) {
      var m = t.match(new RegExp('(\\d+|[a-zа-яё]+)\\s*(' + unitRx + ')(?![a-zа-яё])'));
      if (!m) return;
      var n = /^\d+$/.test(m[1]) ? parseInt(m[1], 10) : wordNumber(m[1]);
      if (n === null || n === undefined) return;
      total += n * mult; hit = true;
    }
    grab('h|hr|hrs|hours?|час(?:а|ов)?', 3600);
    grab('min|mins|minutes?|мин(?:ут|уты|уту)?', 60);
    grab('s|sec|secs|seconds?|сек(?:унд|унды|унду)?', 1);
    if (hit) return K.clamp(total, 1, 12 * 3600);
    if (K.lang === 'ru' && /полчас/.test(t)) return 1800;
    if (/half an hour|half hour/.test(t)) return 1800;
    var bare = t.match(/(\d+)\s*(?:$|[?!.,])/);
    if (bare) return K.clamp(parseInt(bare[1], 10) * 60, 60, 12 * 3600);
    var word = wordNumber(t);
    return word ? K.clamp(word * 60, 60, 12 * 3600) : 0;
  };
  /* "7:30", "at 7 pm", "в 6 утра" -> { h, m } or null */
  K.parseClock = function (text) {
    var t = K.norm(String(text || '')) + ' ';
    var m = t.match(/(\d{1,2})\s*[:.]\s*(\d{2})\s*(am|pm)?/);
    var h = null, mi = 0, suffix = '';
    if (m) {
      h = parseInt(m[1], 10); mi = parseInt(m[2], 10); suffix = m[3] || '';
    } else {
      var m2 = t.match(/(?:at|в|на)\s*(\d{1,2})\s*(am|pm|утра|дня|вечера|ночи|часов|часа|hours?|o'?clock)?/);
      if (m2) { h = parseInt(m2[1], 10); suffix = m2[2] || ''; }
    }
    if (h === null || isNaN(h)) return null;
    var pm = /pm|дня|вечера/.test(suffix) || /\bpm\b/.test(t);
    var am = /am|утра|ночи/.test(suffix) || /\bam\b/.test(t);
    if (pm && h < 12) h += 12;
    if (!pm && !am && h <= 7 && /\bpm\b/.test(t)) h += 12;
    if (am && h === 12) h = 0;
    if (h > 23 || mi > 59) return null;
    return { h: h, m: mi };
  };
  K.nextClock = function (h, mi) {
    var now = new Date();
    var at = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, mi || 0, 0, 0);
    if (at.getTime() <= now.getTime() + 1000) at.setDate(at.getDate() + 1);
    return at;
  };
  /* ------------------------- shared keyword sets ------------------------- */
  var RE_TIMER_WORDS = re(['timer', 'таймер', 'напомни через', 'remind me in', 'in an hour', 'через час', 'через минуту']);
  var RE_ALARM_WORDS = re(['alarm', 'wake me', 'wake-up', 'wake up call', 'remind me at', 'будильник', 'разбуди', 'разбудить']);
  var RE_WEATHER_MOOD = re(['i am cold', "i'm cold", 'im cold', 'i am hot', "i'm hot", 'im hot',
    'я замёрз', 'я замерз', 'мне холодно', 'мне жарко', 'мне зябко']);

  /* ------------------------- to-do list ------------------------- */
  var TODO_MAX = 200;
  K.TODO = {
    items: [],
    load: function () {
      var saved = K.store.get('todo', []);
      this.items = Array.isArray(saved) ? saved.filter(function (i) { return i && i.text; }) : [];
      return this.items;
    },
    save: function () {
      K.store.set('todo', this.items);
      if (typeof K.onTodoChange === 'function') K.onTodoChange(this.items);
      return this.items;
    },
    add: function (text) {
      var clean = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 140);
      clean = clean.replace(/^[:\-\u2013\u2014\s]+/, '').replace(/[.\s]+$/, '');
      if (!clean) return null;
      if (this.items.length >= TODO_MAX) this.items.shift();
      var item = { id: K.uid(), text: clean, done: false, at: Date.now() };
      this.items.push(item);
      this.save();
      return item;
    },
    toggle: function (id) {
      var hit = null;
      this.items.forEach(function (i) { if (i.id === id) { i.done = !i.done; hit = i; } });
      if (hit) this.save();
      return hit;
    },
    remove: function (id) {
      var before = this.items.length;
      this.items = this.items.filter(function (i) { return i.id !== id; });
      this.save();
      return this.items.length !== before;
    },
    byNumber: function (n) {
      var idx = Number(n) - 1;
      if (!isFinite(idx) || idx < 0 || idx >= this.items.length) return null;
      return this.items[idx];
    },
    clearDone: function () {
      var done = this.items.filter(function (i) { return i.done; }).length;
      if (!done) return 0;
      this.items = this.items.filter(function (i) { return !i.done; });
      this.save();
      return done;
    },
    clearAll: function () {
      var n = this.items.length;
      this.items = [];
      this.save();
      return n;
    },
    open: function () { return this.items.filter(function (i) { return !i.done; }); },
    line: function () {
      return this.items.map(function (i, idx) {
        return (idx + 1) + '. ' + (i.done ? '✅ ' : '⬜ ') + i.text;
      });
    },
    count: function () { return this.open().length; },
    /* The chat answer for "what's on my list?" */
    say: function () {
      if (!this.items.length) {
        return K.msgCard({ emoji: '📝', title: K.sayTo('todoEmptyList'), lines: [] }, {
          chips: chipsFor(['chip.todo', 'chip.help']), sound: 'receive'
        });
      }
      return K.msgCard({
        emoji: '✅',
        title: K.sayTo('todoListIntro'),
        lines: this.line().slice(0, 12),
        footer: K.todoCountLine()
      }, { chips: chipsFor(['chip.todo', 'chip.timer', 'chip.help']), sound: 'receive' });
    }
  };
  K.TODO.load();
  /* i18n uses “{done} done · {total} total” everywhere, so build it once */
  K.todoCountLine = function () {
    return K.t('todo.count', {
      done: K.TODO.items.length - K.TODO.count(), total: K.TODO.items.length
    });
  };
  var RE_TODO_SHOW = re(['my list', 'my to-do', 'my todo', 'my todos', 'todo list', 'task list', 'todo',
    'todos', 'what is on my list', 'show my list', 'my tasks', 'all my tasks',
    'список дел', 'мой список', 'мои задачи', 'задачи', 'что в списке', 'покажи список',
    'список задач']);
  /* Registered after add/clear/item on purpose: “clear my list” and
     “add milk to my list” also contain “my list”. */
  var RE_TODO_CLEAR = re(['clear my list', 'clear the list', 'delete my list', 'remove done',
    'clear completed', 'clear done', 'clear everything', 'delete everything', 'wipe my list', 'wipe the list',
    'очисти список', 'удали выполненные', 'убери выполненные', 'очисти задачи', 'удали список',
    'удали всё', 'удали все', 'удали все задачи', 'удали все дела', 'убери все', 'стереть список']);
  intent('todoClear', function (c) { return has(c, RE_TODO_CLEAR); }, function () {
    var done = K.TODO.clearDone();
    if (done) {
      return K.msgCard({
        emoji: '🧹', title: K.sayTo('todoCleared', { count: done }), lines: [K.t('todo.clearedMsg', { n: done })],
        footer: K.todoCountLine()
      }, { chips: chipsFor(['chip.todo', 'chip.help']), sound: 'tap' });
    }
    if (K.TODO.items.length) {
      var left = K.TODO.items.length;
      K.TODO.clearAll();
      return K.msgCard({
        emoji: '🧽', title: K.sayTo('todoAllDone'), lines: [K.t('todo.wipedMsg', { n: left })],
        footer: K.todoCountLine()
      }, { chips: chipsFor(['chip.todo', 'chip.joke']), sound: 'tap' });
    }
    return K.msg(K.sayTo('todoNothingToClear'), { chips: chipsFor(['chip.todo', 'chip.joke']) });
  });

  var RE_TODO_ADD = re(['add', 'remind me to', 'put on my list', 'add to my list', 'note down', 'write down',
    'добавь', 'запиши', 'напомни мне', 'в список', 'добавь в список']);
  var RE_TODO_STRIP = ['add', 'please', 'to', 'my', 'the', 'list', 'todo', 'to-do', 'task', 'note', 'down',
    'put', 'on', 'remind', 'me', 'that', 'i', 'need', 'must', 'should', 'about', 'it',
    'добавь', 'пожалуйста', 'в', 'мой', 'список', 'задачу', 'задачи', 'запиши', 'напомни', 'мне', 'что',
    'надо', 'нужно', 'это'];
  intent('todoAdd', function (c) { return has(c, RE_TODO_ADD); }, function (c) {
    if (RE_TIMER_WORDS.test(c.t) || RE_ALARM_WORDS.test(c.t)) return null;
    var words = K.stripPunct(c.raw).split(/\s+/).filter(Boolean);
    var kept = words.filter(function (w) { return RE_TODO_STRIP.indexOf(w) === -1; });
    var text = kept.join(' ').trim();
    /* “add” on its own means the task is still coming */
    if (text.length < 2) {
      setStage('todo', {});
      return K.msg(K.t('todo.placeholder'), { chips: chipsFor(['chip.todo', 'chip.help']) });
    }
    var item = K.TODO.add(text);
    if (!item) {
      setStage('todo', {});
      return K.msg(K.t('todo.placeholder'), { chips: chipsFor(['chip.todo', 'chip.help']) });
    }
    clearStage();
    return K.msgCard({
      emoji: '📌',
      title: K.sayTo('todoAdded', { task: item.text, count: K.TODO.count() }),
      lines: [item.text],
      footer: K.todoCountLine()
    }, {
      chips: chipsFor(['chip.todo', 'chip.timer', 'chip.help']),
      sound: 'receive',
      toast: { title: K.t('todo.addedToast'), body: item.text }
    });
  });

  /* "done 2", "delete 3", "готово 2", "удали 1" */
  var RE_TODO_DONE = re(['done', 'complete', 'completed', 'tick', 'finish', 'готово', 'выполнено', 'сделано', 'зачеркни']);
  var RE_TODO_DEL = re(['delete', 'remove', 'drop', 'удали', 'убери', 'сотри']);
  intent('todoItem', function (c) {
    if (!/\d/.test(c.t)) return false;
    return RE_TODO_DONE.test(c.t) || RE_TODO_DEL.test(c.t);
  }, function (c) {
    var m = c.t.match(/\d{1,2}/);
    var item = m ? K.TODO.byNumber(m[0]) : null;
    if (!item) return K.msg(K.sayTo('todoNotFound'), { chips: chipsFor(['chip.todo']) });
    if (RE_TODO_DEL.test(c.t)) {
      K.TODO.remove(item.id);
      return K.msgCard({
        emoji: '🗑️', title: K.t('todo.removedMsg', { task: item.text }), lines: K.TODO.line().slice(0, 8),
        footer: K.todoCountLine()
      }, { chips: chipsFor(['chip.todo', 'chip.help']), sound: 'tap' });
    }
    if (RE_TODO_DONE.test(c.t)) {
      K.TODO.toggle(item.id);
      return K.msgCard({
        emoji: '✅', title: K.t('todo.doneMsg', { task: item.text }), lines: K.TODO.line().slice(0, 8),
        footer: K.todoCountLine()
      }, { chips: chipsFor(['chip.todo', 'chip.joke']), sound: 'receive' });
    }
    return null;
  });
  /* “what's on my list?” — last of the to-do intents, see the note above */
  intent('todoShow', function (c) {
    return has(c, RE_TODO_SHOW) || K.norm(c.raw) === K.norm(K.t('chip.todo'));
  }, function () { return K.TODO.say(); });
  /* ------------------------- timers & alarms ------------------------- */
  /* app.js provides K.uiTimer / K.uiAlarm; without them Kuzya still answers
     politely (and the plain chat stays usable). */
  K.runTimer = function (sec, label) {
    if (K.uiTimer && typeof K.uiTimer.start === 'function') return K.uiTimer.start(sec, label);
    return K.msg(K.sayTo('timerSet', { time: K.fmtDuration(sec) }), {
      chips: chipsFor(['chip.timer', 'chip.help']), sound: 'receive'
    });
  };
  K.runAlarm = function (at, label) {
    if (K.uiAlarm && typeof K.uiAlarm.add === 'function') return K.uiAlarm.add(at, label);
    return K.msg(K.sayTo('alarmSet', { time: K.fmtTime(at) }), {
      chips: chipsFor(['chip.timer', 'chip.help']), sound: 'bell'
    });
  };
  var RE_TIMER_STOP = re(['stop the timer', 'cancel the timer', 'stop timer', 'останови таймер', 'отмени таймер',
    'выключи таймер']);
  intent('timerStop', function (c) { return has(c, RE_TIMER_STOP); }, function () {
    var stopped = K.uiTimer && K.uiTimer.stop ? K.uiTimer.stop() : false;
    return K.msg(stopped ? K.t('timer.reset') : K.t('timer.ready'), {
      chips: chipsFor(['chip.timer', 'chip.help']), sound: 'tap'
    });
  });

  var RE_TIMER = re(['timer', 'countdown', 'таймер', 'обратный отсчёт', 'напомни через', 'remind me in']);
  intent('timer', function (c) { return has(c, RE_TIMER) || has(c, RE_TIMER_WORDS); }, function (c) {
    var sec = K.parseDuration(c.raw);
    if (!sec) {
      setStage('timer', {});
      return K.msg(K.sayTo('timerAsk'), {
        chips: [
          { key: 't1', label: '1 ' + K.t('timer.min'), say: K.lang === 'ru' ? 'таймер на 1 минуту' : 'timer for 1 minute' },
          { key: 't5', label: '5 ' + K.t('timer.min'), say: K.lang === 'ru' ? 'таймер на 5 минут' : 'timer for 5 minutes' },
          { key: 't10', label: '10 ' + K.t('timer.min'), say: K.lang === 'ru' ? 'таймер на 10 минут' : 'timer for 10 minutes' },
          { key: 't25', label: '25 ' + K.t('timer.min'), say: K.lang === 'ru' ? 'таймер на 25 минут' : 'timer for 25 minutes' }
        ]
      });
    }
    clearStage();
    return K.runTimer(sec, '');
  });
  /* Just a duration, right after Kuzya asked how long */
  function timerStageBeat(c) {
    var sec = K.parseDuration(c.raw);
    if (!sec) return null;
    clearStage();
    return K.runTimer(sec, '');
  }

  intent('alarmList', function (c) {
    return re(['what alarms', 'my alarms', 'list alarms', 'какие будильники', 'мои будильники']).test(c.t);
  }, function () {
    if (K.uiAlarm && K.uiAlarm.list) {
      var beat = K.uiAlarm.list();
      if (beat) return beat;
    }
    return K.msg(K.sayTo('alarmNone'), { chips: chipsFor(['chip.timer', 'chip.help']) });
  });

  var RE_ALARM_ASK = re(['alarm', 'wake me', 'wake me up', 'wake-up call', 'remind me at', 'будильник', 'разбуди', 'разбудить']);
  intent('alarm', function (c) { return has(c, RE_ALARM_ASK); }, function (c) {
    var clock = K.parseClock(c.raw);
    if (!clock) {
      setStage('alarm', {});
      return K.msg(K.sayTo('alarmAsk'), {
        chips: [
          { key: 'a7', label: '07:00', say: K.lang === 'ru' ? 'будильник на 7:00' : 'alarm at 7:00' },
          { key: 'a8', label: '08:30', say: K.lang === 'ru' ? 'будильник на 8:30' : 'alarm at 8:30' },
          { key: 'a22', label: '22:00', say: K.lang === 'ru' ? 'будильник на 22:00' : 'alarm at 22:00' }
        ]
      });
    }
    clearStage();
    return K.runAlarm(K.nextClock(clock.h, clock.m), '');
  });
  function alarmStageBeat(c) {
    var clock = K.parseClock(c.raw);
    if (!clock) return null;
    clearStage();
    return K.runAlarm(K.nextClock(clock.h, clock.m), '');
  }
  /* ------------------------- the game room ------------------------- */
  /* A game session owns the conversation while it runs; these intents
     handle one-off rounds and the ways of starting a game. */
  var RE_SCORE_RESET = re(['reset the score', 'reset my score', 'reset score', 'clear the score', 'clear my score',
    'wipe the score', 'start the score over', 'сбрось счёт', 'сбрось счет', 'сбросить счёт', 'сбросить счет',
    'обнули счёт', 'обнули счет', 'очисти счёт', 'очисти счет']);
  intent('scoreReset', function (c) { return has(c, RE_SCORE_RESET); }, function () {
    K.SCORE.reset();
    return K.msgCard({
      emoji: '🧼', title: K.sayTo('scoreCleared'), lines: [K.SCORE.line()]
    }, { chips: chipsFor(['chip.rps', 'chip.quiz']), sound: 'tap' });
  });
  var RE_SCORE = re(['score', 'my score', 'scoreboard', 'my results', 'how am i doing', 'statistics',
    'счёт', 'счет', 'мой результат', 'статистик', 'табло', 'счёт в игре', 'побед']);
  intent('gameScore', function (c) { return has(c, RE_SCORE); }, function () {
    return K.games.once.score();
  });

  /* Stop-words without a running game still deserve an answer */
  intent('gameStopOnly', function (c) {
    return !K.gameActive() && K.games.isStop(c.raw);
  }, function () {
    return K.msg(K.t('g.noGame'), { chips: chipsFor(['chip.rps', 'chip.quiz', 'chip.help']) });
  });

  /* "rock" / "камень" in the chat = one quick round of rock-paper-scissors */
  intent('rpsQuick', function (c) { return !!K.games.findMove(c.raw); }, function (c) {
    return K.games.once.rps(c.raw);
  });

  var RE_DICE = re(['roll', 'roll a dice', 'roll the dice', 'dice', 'die', 'coin', 'flip a coin', 'flip',
    'roll again', 'flip again', 'one more roll', 'heads or tails', 'again', 'one more time', 'once more',
    'кубик', 'кубики', 'кости', 'брось кубик', 'подбрось', 'монетк', 'орел или решка', 'орёл или решка',
    'ещё раз', 'еще раз', 'ещё разок']);
  intent('diceQuick', function (c) { return has(c, RE_DICE); }, function (c) {
    return K.games.once.dice(c.raw);
  });

  /* Any game named by hand: "quiz me", "anagram", "would you rather"…
     Registered before "let's play" so the chosen game always wins. */
  intent('gameStart', function (c) {
    var game = K.games.byText(c.raw);
    return !!(game && game.id !== 'dice');
  }, function (c) {
    var game = K.games.byText(c.raw);
    return K.startGame(game.id, K.gameActive() === game.id);
  });

  /* "let's play" — Kuzya picks a game for you */
  var RE_PLAY = re(['play', 'let us play', 'lets play', 'play something', 'play a game', 'a game',
    'давай поиграем', 'поиграем', 'сыграем', 'игру', 'игра', 'играть', 'играем', 'погнали играть']);
  intent('play', function (c) { return has(c, RE_PLAY); }, function () {
    var options = K.games.list.filter(function (g) { return g.id !== 'meme'; });
    var game = K.pick(options);
    var beat = K.startGame(game.id);
    beat.chips = K.chips((beat.chips || []).concat(K.games.restartChips(game.id)));
    return beat;
  });
  /* ------------------------- language & appearance ------------------------- */
  var RE_LANG_RU = re(['speak russian', 'switch to russian', 'go russian', 'in russian', 'russian please',
    'по-русски', 'по русски', 'говори по-русски', 'переключи на русский', 'русский язык', 'на русском',
    'перейди на русский', 'говори на русском']);
  var RE_LANG_EN = re(['speak english', 'switch to english', 'go english', 'in english', 'english please',
    'по-английски', 'по английски', 'говори по-английски', 'переключи на английский', 'английский язык',
    'на английском', 'перейди на английский', 'говори на английском']);
  intent('langSwitch', function (c) { return has(c, RE_LANG_RU) || has(c, RE_LANG_EN); }, function (c) {
    var lang = has(c, RE_LANG_RU) ? 'ru' : 'en';
    if (lang === K.lang) {
      return K.msg(K.sayTo('langSame'), { chips: chipsFor(['chip.help', 'chip.joke']) });
    }
    K.setLang(lang);                       /* app.js re-renders through K.onLangChange */
    return K.msg(K.sayTo('langSwitch'), {
      chips: chipsFor(['chip.help', 'chip.joke']), sound: 'tap',
      toast: { title: K.t('toast.langChanged'), body: K.t('toast.langChangedBody') }
    });
  });

  var THEME_WORDS = {
    cosmic: ['cosmic', 'space', 'космич', 'космос'],
    nebula: ['nebula', 'туманн'],
    graphite: ['graphite', 'графит'],
    midnight: ['midnight', 'полноч'],
    daylight: ['daylight', 'light', 'светл', 'дневн']
  };
  var RE_THEME = re(['theme', 'dark theme', 'light theme', 'change the theme', 'switch the theme', 'daylight',
    'тему', 'тема', 'тёмную', 'темную', 'светлую', 'смени тему', 'переключи тему']);
  intent('themeSwitch', function (c) { return has(c, RE_THEME); }, function (c) {
    var target = '';
    Object.keys(THEME_WORDS).forEach(function (theme) {
      if (target) return;
      var hit = THEME_WORDS[theme].some(function (w) { return c.t.indexOf(w) !== -1; });
      if (hit) target = theme;
    });
    var current = (typeof K.themeName === 'function') ? K.themeName() : 'cosmic';
    if (target && typeof K.setTheme === 'function') {
      K.setTheme(target);
      return K.msg(K.sayTo('themeSwitch', { theme: K.t('theme.' + target) }), {
        chips: chipsFor(['chip.help', 'chip.joke']), sound: 'tap',
        toast: { title: K.t('toast.themeChanged'), body: K.t('theme.' + target) }
      });
    }
    return K.msg(K.sayTo('themeSwitch', { theme: K.t('theme.' + current) }), {
      chips: chipsFor(['chip.help']),
      link: link(K.t('nav.settings') + ' · ' + K.t('set.theme'), '#settings', 'view')
    });
  });

  /* “settings” — the app opens the settings panel for this beat */
  var RE_SETTINGS = re(['settings', 'preferences', 'options', 'open settings', 'настройки', 'параметры',
    'настройка', 'настроить']);
  intent('settings', function (c) { return has(c, RE_SETTINGS); }, function () {
    return K.msg(K.sayTo('settingsIntro'), {
      card: {
        emoji: '⚙️',
        title: K.t('nav.settings'),
        lines: [K.t('set.theme') + ' · ' + K.t('set.language'), K.t('set.yourName'), K.t('set.aboutShortcuts')]
      },
      chips: chipsFor(['chip.theme', 'chip.lang', 'chip.help']),
      view: 'settings', sound: 'tap'
    });
  });

  /* ------------------------- copying & small talk ------------------------- */
  var lastBeat = null;
  function beatText(beat) {
    if (!beat) return '';
    var parts = [beat.text];
    if (beat.card) {
      parts.push(beat.card.title);
      parts = parts.concat(beat.card.lines || []);
      if (beat.card.footer) parts.push(beat.card.footer);
    }
    if (beat.link) parts.push(beat.link.url);
    return parts.filter(Boolean).join('\n');
  }
  var RE_COPY = re(['copy', 'copy it', 'copy that', 'copy the meme', 'скопируй', 'скопировать', 'скопируй это']);
  intent('copy', function (c) { return has(c, RE_COPY); }, function () {
    var text = beatText(lastBeat);
    if (!text) return K.msg(K.sayTo('copyNothing'), { chips: chipsFor(['chip.joke', 'chip.help']) });
    try { K.copyToClipboard(text); } catch (e) {}
    return K.msgCard({
      emoji: '📋', title: K.t('copy'), lines: [text.length > 240 ? text.slice(0, 240) + '…' : text]
    }, {
      chips: chipsFor(['chip.joke', 'chip.help']), sound: 'tap',
      toast: { title: K.t('toast.copied'), body: K.t('copy') }
    });
  });

  /* Short "yes / no / maybe" so Kuzya can answer rhetorical questions too */
  var YES_WORDS = ['yes', 'yep', 'yeah', 'sure', 'да', 'ага', 'конечно', 'окей'];
  var NO_WORDS = ['no', 'nope', 'nah', 'нет', 'неа', 'не хочу'];
  var MAYBE_WORDS = ['maybe', 'probably', 'i do not know', 'i dont know', 'dunno', 'возможно',
    'наверное', 'может быть', 'не знаю'];
  function bareYesNo(c) {
    if (c.words.length > 2) return '';
    var t = c.t;
    if (YES_WORDS.indexOf(t) !== -1) return 'yes';
    if (NO_WORDS.indexOf(t) !== -1) return 'no';
    if (MAYBE_WORDS.indexOf(t) !== -1) return 'maybe';
    return '';
  }
  intent('bareAnswer', function (c) { return !!bareYesNo(c); }, function (c) {
    var kind = bareYesNo(c);
    var key = kind === 'yes' ? 'yesAnswer' : kind === 'no' ? 'noAnswer' : 'maybeAnswer';
    return K.msg(K.sayTo(key), { chips: chipsFor(['chip.joke', 'chip.help']) });
  });
  /* ------------------------- greetings ------------------------- */
  var RE_GREET = re(['hi', 'hii', 'hey', 'hello', 'hiya', 'yo', 'good morning', 'good afternoon',
    'good evening', 'good night', 'greetings',
    'привет', 'прив', 'хай', 'здравствуй', 'здравствуйте', 'доброе утро', 'добрый день',
    'добрый вечер', 'доброй ночи', 'ку(-ку)?', 'салют']);
  intent('greeting', function (c) { return c.words.length <= 5 && has(c, RE_GREET); }, function (c) {
    var key = 'greetings';
    if (/good night|доброй ночи/.test(c.t)) key = 'goodNight';
    else if (/good morning|доброе утро/.test(c.t)) key = 'goodMorning';
    var line = K.sayTo(key);
    if (K.userName()) line += ' ' + K.sayTo('greetingsBack');
    return K.msg(line, {
      chips: chipsFor(['chip.help', 'chip.joke', 'chip.weather']), sound: 'receive'
    });
  });

  /* ------------------------- the dispatcher ------------------------- */
  /* One more to-do task, shared by the “add …” intent and the stage beat */
  function todoAddedBeat(item) {
    return K.msgCard({
      emoji: '📌',
      title: K.sayTo('todoAdded', { task: item.text, count: K.TODO.count() }),
      lines: [item.text],
      footer: K.todoCountLine()
    }, {
      chips: chipsFor(['chip.todo', 'chip.timer', 'chip.help']),
      sound: 'receive',
      toast: { title: K.t('todo.addedToast'), body: item.text }
    });
  }
  /* Kuzya asked “what should I add?” and this is the answer */
  function todoStageBeat(c) {
    if (!c.words.length || c.words.length > 14) return null;
    if (/\?$/.test(c.raw.trim())) return null;
    if (RE_TIMER_WORDS.test(c.t) || RE_ALARM_WORDS.test(c.t)) return null;
    if (has(c, RE_HELP) || has(c, RE_WEATHER) || has(c, RE_TIME)) return null;
    var item = K.TODO.add(c.raw);
    if (!item) return null;
    clearStage();
    return todoAddedBeat(item);
  }
  var STAGE_BEATS = {
    name: nameStageBeat, riddle: riddleStageBeat, city: cityStageBeat,
    todo: todoStageBeat, timer: timerStageBeat, alarm: alarmStageBeat
  };

  function asPromise(v) {
    return (v && typeof v.then === 'function') ? v : Promise.resolve(v);
  }
  /* Nothing matched: admit it, offer the web, keep the chips handy */
  function fallbackBeat(c) {
    var beat = K.msg(K.sayTo('fallback') + ' ' + K.sayTo('fallbackHints'), {
      chips: chipsFor(['chip.search', 'chip.help', 'chip.joke']), sound: 'receive'
    });
    var query = String(c.raw || '').trim().replace(/\s+/g, ' ').slice(0, 90);
    if (query.length > 2) {
      beat.link = link(K.t('search.open') + ': ' + query, K.svc.webSearch(query), 'web');
    }
    if (!K.svc.online()) {
      beat.toast = { title: K.t('toast.offline'), body: K.t('toast.offlineBody') };
    }
    return beat;
  }

  function finish(beatRaw) {
    var beat = beatRaw || K.msg('');
    lastBeat = beat;
    K.BRAIN.lastBeat = beat;
    /* Every ninth message Kuzya may slip in a secret photo after the answer */
    var photo = K.SECRET.maybe(K.BRAIN.count);
    if (photo) beat.after = K.SECRET.beat(photo);
    return beat;
  }

  /* First intent that claims the message, or null. Checking the table before
     the pending question keeps commands usable mid-question. */
  function firstIntent(c) {
    for (var i = 0; i < INTENTS.length; i++) {
      if (INTENTS[i].when(c)) return INTENTS[i];
    }
    return null;
  }

  /* Commands that stay usable while a game is running: the game keeps its
     state, but these intents answer instead of “that is not an option”. */
  var GAME_INTERRUPTS = ['themeSwitch', 'langSwitch', 'gallery', 'photo', 'secretAsk', 'copy',
    'help', 'gameScore', 'scoreReset', 'todoShow', 'todoAdd', 'todoItem', 'todoClear',
    'timer', 'timerStop', 'alarm', 'alarmList', 'math', 'search', 'settings', 'bye', 'gameStart'];

  /* The single entry point app.js talks to. Returns a promise of one beat. */
  function think(raw) {
    var text = String(raw === undefined || raw === null ? '' : raw);
    if (!text.trim()) return Promise.resolve(null);
    var c = ctxOf(text);
    K.BRAIN.count += 1;
    K.BRAIN.lastIntent = '';
    K.store.set('msgCount', K.BRAIN.count);

    var match = firstIntent(c);
    var interrupting = match && GAME_INTERRUPTS.indexOf(match.id) !== -1;
    /* A running game owns the conversation first */
    if (K.gameActive() && !interrupting) {
      var gid = K.GAME.id;                  /* keeping the id: “stop the game” clears it */
      var reply = K.gameReply(text);
      if (reply) {
        K.BRAIN.lastIntent = 'game:' + gid;
        return asPromise(finish(reply));
      }
      /* the message was not part of the game — fall through to the rest */
    }
    var start = 0;
    if (match) {
      K.BRAIN.lastIntent = match.id;
      var out = match.run(c);
      if (out) return asPromise(out).then(finish);
      start = INTENTS.indexOf(match) + 1;    /* it declined — look below it */
    }
    /* A pending question (“what's your name?”, “what city?”) takes the message
       next, so plain answers still work in the middle of a conversation. */
    var stage = getStage();
    if (stage && STAGE_BEATS[stage.kind]) {
      var staged = STAGE_BEATS[stage.kind](c);
      if (staged) {
        K.BRAIN.lastIntent = 'stage:' + stage.kind;
        return asPromise(finish(staged));
      }
    }
    /* Intents below the one that declined part-way through */
    for (var j = start; match && j < INTENTS.length; j++) {
      if (!INTENTS[j].when(c)) continue;
      var alt = INTENTS[j].run(c);
      if (alt) {
        K.BRAIN.lastIntent = INTENTS[j].id;
        return asPromise(alt).then(finish);
      }
    }
    return asPromise(fallbackBeat(c)).then(finish);
  }

  /* app.js: K.answer(text).then(beat => render(beat)) */
  K.answer = think;
  K.brain.think = think;
  K.brain.fallback = fallbackBeat;
  K.brain.lastIntent = function () { return K.BRAIN.lastIntent; };
  K.brain.stages = function () { return Object.keys(STAGE_BEATS); };
  K.brain.last = function () { return lastBeat; };
})(window.KZ);
