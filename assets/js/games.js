/* ============================================================
   Okay Kuzya — game room.
   Nine playable games that live right inside the chat: rock paper
   scissors, guess the number, trivia, word puzzles, emoji riddles,
   would-you-rather, dice & coins, the meme generator — plus a shared
   scoreboard and the message helpers brain.js and app.js speak.
   ============================================================ */
(function (K) {
  'use strict';

  /* ------------------------- message helpers ------------------------- */
  /* A "beat" is one answer from Kuzya:
     { text, card?, chips?, sound?, photo?, link? }                      */
  K.msg = function (text, extra) {
    var m = { text: text || '' };
    if (extra) {
      for (var k in extra) {
        if (Object.prototype.hasOwnProperty.call(extra, k)) m[k] = extra[k];
      }
    }
    return m;
  };
  K.msgCard = function (card, extra) {
    var opts = extra || {};
    opts.card = card;
    return K.msg(opts.text || '', opts);
  };
  /* chip({label, say}) — quick answers rendered under Kuzya's message */
  K.chip = function (label, say, icon) {
    return { label: label || say || '', say: say || label || '', icon: icon || '' };
  };
  K.chips = function (list) { return list.filter(Boolean); };

  /* ------------------------- knowledge pickers ------------------------- */
  /* Knowledge arrays are split by language: pick from the right one. */
  function pool(name) {
    var group = K.KNOW && K.KNOW[name];
    if (!group) return [];
    if (Array.isArray(group)) return group;
    return group[K.lang] || group.en || [];
  }
  function draw(name) {
    var list = pool(name);
    if (!list.length) return null;
    return list[K.freshIndex('know:' + name + ':' + K.lang, list.length)];
  }
  K.games = {};
  K.games.draw = draw;
  K.games.pool = pool;

  /* ------------------------- scoreboard ------------------------- */
  var DEFAULT_SCORE = {
    rps: { wins: 0, losses: 0, draws: 0 },
    guess: { solved: 0 },
    trivia: { right: 0, wrong: 0, streak: 0, best: 0 },
    anagram: { right: 0, wrong: 0 },
    emoji: { right: 0, wrong: 0 },
    wyr: { answered: 0 },
    dice: { rolls: 0, flips: 0 },
    rounds: 0
  };
  function freshScore() { return JSON.parse(JSON.stringify(DEFAULT_SCORE)); }

  K.SCORE = {
    data: freshScore(),
    load: function () {
      var saved = K.store.get('score', null);
      this.data = Object.assign(freshScore(), saved || {});
      var k;
      for (k in DEFAULT_SCORE) {
        if (typeof DEFAULT_SCORE[k] === 'object') {
          this.data[k] = Object.assign({}, DEFAULT_SCORE[k], this.data[k] || {});
        }
      }
      return this.data;
    },
    save: function () { K.store.set('score', this.data); return this.data; },
    add: function (path, n) {
      var parts = path.split('.'), node = this.data, i;
      for (i = 0; i < parts.length - 1; i++) node = node[parts[i]];
      var leaf = parts[parts.length - 1];
      node[leaf] = (node[leaf] || 0) + (n === undefined ? 1 : n);
      return this.save();
    },
    reset: function () {
      this.data = freshScore();
      K.store.set('score', this.data);
      return this.data;
    },
    /* Finished rounds: dialogue + puzzles together */
    bump: function () { this.add('rounds', 1); },
    summary: function () {
      var d = this.data;
      return {
        wins: d.rps.wins + d.trivia.right + d.anagram.right + d.emoji.right,
        losses: d.rps.losses + d.trivia.wrong + d.anagram.wrong + d.emoji.wrong,
        draws: d.rps.draws,
        streak: d.trivia.streak,
        best: d.trivia.best,
        guess: d.guess.solved,
        rounds: d.rounds
      };
    },
    /* Rows for the scoreboard panel in index.html */
    board: function () {
      var s = this.summary();
      return [
        { key: 'score.wins', icon: '🏅', value: s.wins },
        { key: 'score.losses', icon: '😅', value: s.losses },
        { key: 'score.draws', icon: '🤝', value: s.draws },
        { key: 'score.quiz', icon: '🔥', value: s.streak },
        { key: 'score.guess', icon: '🔢', value: s.guess },
        { key: 'score.rounds', icon: '🎲', value: s.rounds }
      ];
    },
    line: function () {
      var s = this.summary();
      return K.t('g.score', { wins: s.wins, losses: s.losses, draws: s.draws, streak: s.streak, rounds: s.rounds });
    },
    say: function () {
      var s = this.summary();
      return K.say('gameScore', { wins: s.wins, losses: s.losses, draws: s.draws, streak: s.streak });
    }
  };
  K.SCORE.load();
  /* ------------------------- text helpers ------------------------- */
  var STOP_WORDS = ['stop', 'quit', 'exit', 'end', 'finish', 'cancel', 'enough', 'no more', 'leave',
    'стоп', 'хватит', 'выйти', 'выйди', 'закончить', 'конец', 'отмена', 'отстань', 'надоело', 'стоп игра'];
  var NUMBER_WORDS = {
    one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10,
    a: 1, b: 2, c: 3, d: 4,
    'один': 1, 'два': 2, 'три': 3, 'четыре': 4, 'пять': 5, 'шесть': 6, 'семь': 7, 'восемь': 8, 'девять': 9, 'десять': 10,
    'первый': 1, 'второй': 2, 'третий': 3, 'четвертый': 4, 'пятый': 5,
    'первое': 1, 'второе': 2, 'третье': 3, 'четвертое': 4
  };
  K.games.isStop = function (text) {
    var t = K.stripPunct(text);
    if (!t) return false;
    return STOP_WORDS.some(function (w) { return t === w || t.indexOf(' ' + w + ' ') !== -1 || t.indexOf(w + ' ') === 0; });
  };
  /* First number in a phrase, digits or simple words ("три", "fourth") */
  K.games.number = function (text) {
    var t = K.stripPunct(text);
    var m = t.match(/-?\d+/);
    if (m) return parseInt(m[0], 10);
    var words = t.split(/[\s-]+/);
    for (var i = 0; i < words.length; i++) {
      if (NUMBER_WORDS[words[i]] !== undefined) return NUMBER_WORDS[words[i]];
    }
    return null;
  };
  /* Loose comparison good enough for "lion king" vs "The Lion King!" */
  K.games.loose = function (a, b) {
    var x = K.stripPunct(a).replace(/\b(the|a|an|of|and|movie|film|мультфильм|фильм|это)\b/g, ' ').replace(/\s+/g, ' ').trim();
    var y = K.stripPunct(b).replace(/\b(the|a|an|of|and|movie|film|мультфильм|фильм|это)\b/g, ' ').replace(/\s+/g, ' ').trim();
    if (!x || !y) return false;
    return x === y || x.indexOf(y) !== -1 || y.indexOf(x) !== -1;
  };

  /* ------------------------- rock · paper · scissors ------------------------- */
  var MOVES = [
    { key: 'rock', icon: '🪨', words: ['rock', 'stone', 'камень', 'камушек'] },
    { key: 'paper', icon: '📄', words: ['paper', 'бумага', 'лист'] },
    { key: 'scissors', icon: '✂️', words: ['scissors', 'scissor', 'ножницы', 'ножниц'] }
  ];
  function moveName(move) { return K.t('g.' + move.key); }
  K.games.findMove = function (text) {
    var t = K.stripPunct(text);
    if (!t) return null;
    var i, j;
    for (i = 0; i < MOVES.length; i++) {
      if (MOVES[i].icon && text.indexOf(MOVES[i].icon) !== -1) return MOVES[i];
      for (j = 0; j < MOVES[i].words.length; j++) {
        if (t === MOVES[i].words[j] || K.norm(text).indexOf(MOVES[i].words[j]) !== -1) return MOVES[i];
      }
    }
    return null;
  };
  function moveChips() {
    return K.chips([
      K.chip(moveName(MOVES[0]), moveName(MOVES[0]), MOVES[0].icon),
      K.chip(moveName(MOVES[1]), moveName(MOVES[1]), MOVES[1].icon),
      K.chip(moveName(MOVES[2]), moveName(MOVES[2]), MOVES[2].icon),
      K.chip(K.t('g.stop'), K.t('g.stop'), '🚪')
    ]);
  }
  /* One round of RPS; also used as a one-off game from the chat */
  K.games.rpsPlay = function (moveKey, state) {
    var you = null, i;
    for (i = 0; i < MOVES.length; i++) if (MOVES[i].key === moveKey) you = MOVES[i];
    if (!you) return null;
    var me = K.pick(MOVES);
    state = state || {};
    var beats = { rock: 'scissors', paper: 'rock', scissors: 'paper' };
    var result = you.key === me.key ? 'draw' : (beats[you.key] === me.key ? 'win' : 'lose');
    if (!state.youScore) state.youScore = 0;
    if (!state.kuzyaScore) state.kuzyaScore = 0;
    if (result === 'win') { state.youScore++; K.SCORE.add('rps.wins'); }
    else if (result === 'lose') { state.kuzyaScore++; K.SCORE.add('rps.losses'); }
    else { K.SCORE.add('rps.draws'); }
    K.SCORE.bump();

    var vars = {
      you: moveName(you), me: moveName(me), youScore: state.youScore,
      kuzyaScore: state.kuzyaScore, name: K.userName ? K.userName() : ''
    };
    var text = K.say(result === 'win' ? 'rpsWin' : result === 'lose' ? 'rpsLose' : 'rpsDraw', vars);
    var card = {
      emoji: you.icon + ' ' + me.icon,
      title: moveName(you) + ' — ' + moveName(me),
      lines: ['🧑 ' + state.youScore + ' : ' + state.kuzyaScore + ' 🤖'],
      footer: K.say('rpsPrompt')
    };
    return K.msgCard(card, { text: text, chips: moveChips(), sound: 'receive' });
  };
  /* Chips send their own label back, so compare against translated keys */
  /* People click chips, but they also just type — accept the obvious
     synonyms so “i give up” counts as the “Give up” chip. */
  var KEY_SYNONYMS = {
    'g.giveUp': ['give up', 'i give up', 'im giving up', "i'm giving up", 'surrender', 'i surrender',
      'skip', 'skip it', 'no idea', 'i have no idea', 'i do not know', "i don't know",
      'сдаюсь', 'я сдаюсь', 'хватит', 'не знаю', 'без понятия', 'пропустить', 'пропусти'],
    'g.revealAnswer': ['reveal', 'reveal it', 'reveal the answer', 'show the answer', 'show me the answer',
      'tell me the answer', 'the answer', 'show answer', 'покажи ответ', 'скажи ответ', 'показать ответ'],
    'g.hint': ['hint', 'a hint', 'give me a hint', 'one hint', 'подсказка', 'подскажи', 'дай подсказку'],
    'g.next': ['next', 'next one', 'next question', 'one more', 'another one', 'more', 'go on',
      'следующий', 'следующий вопрос', 'дальше', 'ещё', 'еще'],
    'g.again': ['again', 'one more time', 'once more', 'roll again', 'flip again',
      'ещё раз', 'еще раз', 'ещё разок', 'повтори'],
    'g.memeNext': ['another meme', 'next meme', 'more memes', 'ещё мем', 'еще мем', 'другой мем'],
    'g.both': ['both', 'both of them', 'both please', 'both at once', 'всё сразу', 'все сразу',
      'оба', 'и то и другое'],
    'g.dice': ['dice', 'a dice', 'the dice', 'roll', 'roll the dice', 'roll a dice',
      'бросить кубик', 'кубик', 'брось кубик', 'кости'],
    'g.coin': ['coin', 'a coin', 'flip', 'flip a coin', 'flip the coin',
      'подбросить монетку', 'монетка', 'монетку', 'подбрось монетку'],
    'g.wyrFirst': ['the first one', 'first one', 'the first', 'first', '1', 'первый', 'первый вариант'],
    'g.wyrSecond': ['the second one', 'second one', 'the second', 'second', '2', 'второй', 'второй вариант']
  };
  K.games.isKey = function (text, key) {
    if (K.norm(text) === K.norm(K.t(key)) || K.stripPunct(text) === K.stripPunct(K.t(key))) return true;
    var list = KEY_SYNONYMS[key];
    if (!list) return false;
    var t = K.stripPunct(text);
    return !!t && list.some(function (s) { return K.stripPunct(s) === t; });
  };
  K.games.isAny = function (text, keys) {
    return keys.some(function (key) { return K.games.isKey(text, key); });
  };

  /* ------------------------- guess the number ------------------------- */
  var GUESS_MIN = 1, GUESS_MAX = 100;
  K.games.guessStart = function (state) {
    state.n = K.rand(GUESS_MIN, GUESS_MAX);
    state.tries = 0;
    state.last = null;
    state.min = GUESS_MIN;
    state.max = GUESS_MAX;
    var card = {
      emoji: '🔢',
      title: K.say('guessIntro'),
      lines: [K.t('g.range', { min: GUESS_MIN, max: GUESS_MAX })],
      footer: K.t('g.guessTip')
    };
    return K.msgCard(card, {
      chips: K.chips([
        K.chip(K.t('g.giveUp'), K.t('g.giveUp'), '🏳️'),
        K.chip(K.t('g.stop'), K.t('g.stop'), '🚪')
      ])
    });
  };
  K.games.guessReply = function (state, text) {
    if (K.games.isAny(text, ['g.giveUp', 'g.revealAnswer'])) {
      K.SCORE.bump();
      var give = K.t('g.reveal', { answer: state.n });
      return K.msgCard({
        emoji: '🙈', title: give, lines: [K.t('g.triesUsed', { tries: state.tries })]
      }, {
        chips: K.chips([
          K.chip(K.t('g.again'), K.t('g.again'), '🔁'),
          K.chip(K.t('g.stop'), K.t('g.stop'), '🚪')
        ])
      });
    }
    var guess = K.games.number(text);
    if (guess === null) return K.msg(K.t('g.badNumber', { min: GUESS_MIN, max: GUESS_MAX }));
    if (guess < GUESS_MIN || guess > GUESS_MAX) {
      return K.msg(K.t('g.outOfRange', { min: GUESS_MIN, max: GUESS_MAX }));
    }
    state.tries += 1;
    if (guess === state.n) {
      K.SCORE.add('guess.solved');
      K.SCORE.bump();
      return K.msgCard({
        emoji: '🎉', title: K.say('guessWin', { n: state.n, tries: state.tries }),
        lines: [K.t('g.triesUsed', { tries: state.tries })]
      }, {
        chips: K.chips([
          K.chip(K.t('g.again'), K.t('g.again'), '🔁'),
          K.chip(K.t('g.stop'), K.t('g.stop'), '🚪')
        ]),
        sound: 'bell'
      });
    }
    var higher = state.n > guess;
    var line = K.say(higher ? 'guessHigher' : 'guessLower', { n: guess, name: K.userName ? K.userName() : '' });
    var closer = state.last === null ? null : (Math.abs(guess - state.n) < Math.abs(state.last - state.n));
    var extra = closer === null ? '' : (closer ? K.t('g.closer') : K.t('g.farther'));
    var lines = [line + (extra ? ' ' + extra : '')];
    if (state.tries >= 6) {
      lines.push(K.t('g.parityTip', { parity: K.t(state.n % 2 === 0 ? 'g.even' : 'g.odd') }));
    }
    state.last = guess;
    return K.msgCard({ emoji: higher ? '⬆️' : '⬇️', title: String(guess), lines: lines }, {
      chips: K.chips([
        K.chip(K.t('g.giveUp'), K.t('g.giveUp'), '🏳️'),
        K.chip(K.t('g.stop'), K.t('g.stop'), '🚪')
      ])
    });
  };

  /* ------------------------- trivia quiz ------------------------- */
  K.games.triviaStart = function (state) {
    var item = draw('trivia');
    if (!item) return K.msg(K.t('g.noContent'));
    state.item = item;
    state.round = (state.round || 0) + 1;
    state.answered = false;
    return K.games.triviaCard(state, true);
  };
  K.games.triviaCard = function (state, withIntro) {
    var item = state.item;
    var lines = item.options.map(function (o, i) { return (i + 1) + '. ' + o; });
    var card = { emoji: '❓', title: item.q, lines: lines, footer: K.t('g.pickOption') };
    var text = withIntro ? K.say('triviaIntro', { n: state.round }) : '';
    var chips = item.options.map(function (o, i) {
      return K.chip((i + 1) + '. ' + K.cut(o, 18), o);
    });
    chips.push(K.chip(K.t('g.giveUp'), K.t('g.giveUp'), '🏳️'));
    chips.push(K.chip(K.t('g.stop'), K.t('g.stop'), '🚪'));
    return K.msgCard(card, { text: text, chips: chips });
  };
  K.games.triviaReply = function (state, text) {
    var item = state.item;
    if (!item) return K.games.triviaStart(state);
    if (K.games.isKey(text, 'g.giveUp') || K.games.isKey(text, 'g.revealAnswer')) {
      K.SCORE.data.trivia.streak = 0;
      K.SCORE.save();
      K.SCORE.bump();
      return K.msgCard({
        emoji: '🏳️',
        title: K.t('g.reveal', { answer: item.options[item.a] }),
        lines: [K.t('g.streakLine', { streak: 0 })]
      }, { chips: nextChips() });
    }
    var pick = K.games.number(text);
    var chosen = -1;
    if (pick !== null && pick >= 1 && pick <= item.options.length) {
      chosen = pick - 1;
    } else {
      item.options.forEach(function (o, i) { if (chosen === -1 && K.games.loose(text, o)) chosen = i; });
    }
    if (chosen === -1) {
      return K.msg(K.t('g.badMove', { options: '1–' + item.options.length }));
    }
    var right = chosen === item.a;
    if (right) {
      K.SCORE.add('trivia.right');
      K.SCORE.add('trivia.streak');
      var s = K.SCORE.summary();
      if (s.streak > K.SCORE.data.trivia.best) K.SCORE.data.trivia.best = s.streak;
      K.SCORE.save();
      K.SCORE.bump();
      var card = {
        emoji: '✅',
        title: K.say('triviaRight', { streak: s.streak }),
        lines: [item.options[item.a]],
        footer: K.t('g.streakLine', { streak: s.streak })
      };
      return K.msgCard(card, { chips: nextChips(), sound: 'receive' });
    }
    K.SCORE.add('trivia.wrong');
    K.SCORE.data.trivia.streak = 0;
    K.SCORE.save();
    K.SCORE.bump();
    return K.msgCard({
      emoji: '❌',
      title: K.say('triviaWrong', { answer: item.options[item.a] }),
      lines: [K.t('g.yourPick') + ': ' + item.options[chosen]],
      footer: K.t('g.streakLine', { streak: 0 })
    }, { chips: nextChips() });
  };
  function nextChips() {
    return K.chips([
      K.chip(K.t('g.next'), K.t('g.next'), '➡️'),
      K.chip(K.t('g.stop'), K.t('g.stop'), '🚪')
    ]);
  }
  /* ------------------------- word puzzle (anagram) ------------------------- */
  function scramble(word) {
    var letters = word.split('');
    var out = word;
    var guard = 0;
    while (K.norm(out) === K.norm(word) && guard < 12) {
      letters = K.shuffle(letters);
      out = letters.join('');
      guard += 1;
    }
    return out;
  }
  K.games.anagramStart = function (state) {
    var item = draw('anagrams');
    if (!item) return K.msg(K.t('g.noContent'));
    state.item = item;
    state.scrambled = scramble(item.word);
    state.attempts = 0;
    state.round = (state.round || 0) + 1;
    return K.msgCard({
      emoji: '🔤',
      title: state.scrambled.split('').join(' ').toUpperCase(),
      lines: [K.say('anagramIntro', { scrambled: state.scrambled, hint: item.hint })],
      footer: K.t('g.lettersCount', { n: item.word.length })
    }, {
      chips: K.chips([
        K.chip(K.t('g.hint'), K.t('g.hint'), '💡'),
        K.chip(K.t('g.giveUp'), K.t('g.giveUp'), '🏳️'),
        K.chip(K.t('g.stop'), K.t('g.stop'), '🚪')
      ])
    });
  };
  K.games.anagramReply = function (state, text) {
    var item = state.item;
    if (!item) return K.games.anagramStart(state);
    if (K.games.isKey(text, 'g.hint')) {
      return K.msgCard({ emoji: '💡', title: K.t('g.hintIs', { hint: item.hint }), lines: [] }, {
        chips: K.chips([
          K.chip(K.t('g.giveUp'), K.t('g.giveUp'), '🏳️'),
          K.chip(K.t('g.stop'), K.t('g.stop'), '🚪')
        ])
      });
    }
    if (K.games.isKey(text, 'g.giveUp') || K.games.isKey(text, 'g.revealAnswer')) {
      K.SCORE.bump();
      return K.msgCard({ emoji: '🙈', title: K.t('g.reveal', { answer: item.word }), lines: [item.hint] }, {
        chips: nextChips()
      });
    }
    if (K.games.loose(text, item.word)) {
      K.SCORE.add('anagram.right');
      K.SCORE.bump();
      return K.msgCard({
        emoji: '🎯', title: K.say('anagramRight', { answer: item.word }),
        lines: [K.t('g.lettersCount', { n: item.word.length })]
      }, { chips: nextChips(), sound: 'receive' });
    }
    state.attempts += 1;
    if (state.attempts < 2) {
      return K.msgCard({ emoji: '🤔', title: K.t('g.tryAgain'), lines: [K.t('g.startsEnds', {
        first: item.word.charAt(0).toUpperCase(), last: item.word.charAt(item.word.length - 1), n: item.word.length
      })] }, {
        chips: K.chips([
          K.chip(K.t('g.hint'), K.t('g.hint'), '💡'),
          K.chip(K.t('g.giveUp'), K.t('g.giveUp'), '🏳️'),
          K.chip(K.t('g.stop'), K.t('g.stop'), '🚪')
        ])
      });
    }
    K.SCORE.add('anagram.wrong');
    K.SCORE.bump();
    return K.msgCard({
      emoji: '❌', title: K.say('anagramWrong', { answer: item.word }), lines: [item.hint]
    }, { chips: nextChips() });
  };

  /* ------------------------- emoji riddles ------------------------- */
  K.games.emojiStart = function (state) {
    var item = draw('emoji');
    if (!item) return K.msg(K.t('g.noContent'));
    state.item = item;
    state.attempts = 0;
    state.round = (state.round || 0) + 1;
    return K.msgCard({
      emoji: item.e,
      title: item.e,
      lines: [K.say('emojiIntro', { emojis: item.e })],
      footer: K.t('g.emojiHint')
    }, {
      chips: K.chips([
        K.chip(K.t('g.giveUp'), K.t('g.giveUp'), '🏳️'),
        K.chip(K.t('g.stop'), K.t('g.stop'), '🚪')
      ])
    });
  };
  K.games.emojiReply = function (state, text) {
    var item = state.item;
    if (!item) return K.games.emojiStart(state);
    if (K.games.isKey(text, 'g.giveUp') || K.games.isKey(text, 'g.revealAnswer')) {
      K.SCORE.bump();
      return K.msgCard({ emoji: '🙈', title: K.t('g.reveal', { answer: item.a }), lines: [item.e] }, {
        chips: nextChips()
      });
    }
    if (K.games.loose(text, item.a)) {
      K.SCORE.add('emoji.right');
      K.SCORE.bump();
      return K.msgCard({
        emoji: '🎬', title: K.say('emojiRight', { answer: item.a }), lines: [item.e]
      }, { chips: nextChips(), sound: 'receive' });
    }
    state.attempts += 1;
    if (state.attempts < 2) {
      return K.msgCard({ emoji: '🤔', title: K.t('g.tryAgain'), lines: [K.t('g.emojiHint')] }, {
        chips: K.chips([
          K.chip(K.t('g.giveUp'), K.t('g.giveUp'), '🏳️'),
          K.chip(K.t('g.stop'), K.t('g.stop'), '🚪')
        ])
      });
    }
    K.SCORE.add('emoji.wrong');
    K.SCORE.bump();
    return K.msgCard({
      emoji: '❌', title: K.say('emojiWrong', { answer: item.a }), lines: [item.e]
    }, { chips: nextChips() });
  };
  /* ------------------------- would you rather ------------------------- */
  K.games.wyrStart = function (state) {
    var item = draw('wyr');
    if (!item) return K.msg(K.t('g.noContent'));
    state.item = item;
    state.round = (state.round || 0) + 1;
    return K.msgCard({
      emoji: '🤷',
      title: K.say('wyrIntro', { a: item[0], b: item[1] }),
      lines: ['🅰️ ' + item[0], '🅱️ ' + item[1]],
      footer: K.t('g.wyrFooter')
    }, {
      chips: K.chips([
        K.chip(K.t('g.wyrFirst'), K.t('g.wyrFirst'), '🅰️'),
        K.chip(K.t('g.wyrSecond'), K.t('g.wyrSecond'), '🅱️'),
        K.chip(K.t('g.next'), K.t('g.next'), '➡️'),
        K.chip(K.t('g.stop'), K.t('g.stop'), '🚪')
      ])
    });
  };
  K.games.wyrReply = function (state, text) {
    var item = state.item;
    if (!item) return K.games.wyrStart(state);
    if (!text || !String(text).trim()) return null;
    var picked = null;
    if (K.games.isKey(text, 'g.wyrFirst')) picked = item[0];
    if (K.games.isKey(text, 'g.wyrSecond')) picked = item[1];
    K.SCORE.add('wyr.answered');
    K.SCORE.bump();
    return K.msgCard({
      emoji: '🧠',
      title: K.say('wyrAnswer'),
      lines: picked ? [K.t('g.yourPick') + ': ' + picked] : [K.cut(String(text), 120)],
      footer: K.t('g.wyrCount', { n: K.SCORE.data.wyr.answered })
    }, {
      chips: K.chips([
        K.chip(K.t('g.next'), K.t('g.next'), '➡️'),
        K.chip(K.t('g.stop'), K.t('g.stop'), '🚪')
      ])
    });
  };

  /* ------------------------- dice & coin ------------------------- */
  var DICE_WORDS = ['roll', 'dice', 'die', 'd6', 'кубик', 'кубика', 'бросить', 'бросок', 'кости'];
  var COIN_WORDS = ['flip', 'coin', 'heads', 'tails', 'монет', 'подбросить', 'орел', 'решка'];
  function hasWord(text, words) {
    var t = K.stripPunct(text);
    if (!t) return false;
    return words.some(function (w) { return t.indexOf(w) !== -1; });
  }
  K.games.dicePrompt = function () {
    return K.msgCard({
      emoji: '🎲',
      title: K.t('g.diceTitle'),
      lines: [K.t('g.diceHint')],
      footer: K.t('g.diceCountHint')
    }, {
      chips: K.chips([
        K.chip(K.t('g.dice'), K.t('g.dice'), '🎲'),
        K.chip(K.t('g.coin'), K.t('g.coin'), '🪙'),
        K.chip(K.t('g.both'), K.t('g.both'), '✨'),
        K.chip(K.t('chip.help'), K.t('chip.help'), '🧭')
      ])
    });
  };
  K.games.rollDice = function (count) {
    var n = K.clamp(count || 1, 1, 6);
    var results = [], total = 0, i;
    for (i = 0; i < n; i++) { var r = K.rand(1, 6); results.push(r); total += r; }
    K.SCORE.add('dice.rolls', n);
    K.SCORE.bump();
    var text = K.say('diceRoll', { n: results[0] });
    var lines = [];
    if (n > 1) {
      text = '';
      lines.push(results.map(function (r) { return '🎲 ' + r; }).join('   '));
      lines.push(K.t('g.rollTotal', { total: total }));
    }
    return K.msgCard({
      emoji: '🎲', title: String(n > 1 ? results.join(' + ') + ' = ' + total : results[0]), lines: lines
    }, { text: text, chips: diceChips() });
  };
  K.games.flipCoin = function () {
    var heads = K.chance(0.5);
    K.SCORE.add('dice.flips');
    K.SCORE.bump();
    var side = K.t(heads ? 'g.heads' : 'g.tails');
    return K.msgCard({
      emoji: heads ? '🪙' : '🔘',
      title: (heads ? '🦅 ' : '🌙 ') + side,
      lines: [K.t('g.flipCount', { n: K.SCORE.data.dice.flips })]
    }, { text: K.say('coinFlip', { side: side }), chips: diceChips() });
  };
  function diceChips() {
    return K.chips([
      K.chip(K.t('g.dice'), K.t('g.dice'), '🎲'),
      K.chip(K.t('g.coin'), K.t('g.coin'), '🪙'),
      K.chip(K.t('g.again'), K.t('g.again'), '🔁')
    ]);
  }
  /* Last dice/coin action, so “One more” repeats the right thing */
  var LAST_ROLL = { kind: 'dice', count: 1 };
  function rollBoth(count) {
    var roll = K.games.rollDice(count);
    var flip = K.games.flipCoin();
    roll.card.lines = roll.card.lines.concat(flip.card.title);
    roll.card.footer = flip.text;
    return roll;
  }
  K.games.diceReply = function (state, text) {
    if (K.games.isKey(text, 'g.again')) {
      if (LAST_ROLL.kind === 'coin') return K.games.flipCoin();
      if (LAST_ROLL.kind === 'both') return rollBoth(LAST_ROLL.count || 1);
      return K.games.rollDice(LAST_ROLL.count || 1);
    }
    var both = K.games.isKey(text, 'g.both');
    var dice = both || K.games.isKey(text, 'g.dice') || hasWord(text, DICE_WORDS);
    var coin = both || K.games.isKey(text, 'g.coin') || hasWord(text, COIN_WORDS);
    if (!dice && !coin) return null;
    var count = 1;
    var m = K.stripPunct(text).match(/(\d+)\s*(dice|die|кубик|кост|d6)/);
    if (m) count = parseInt(m[1], 10);
    if (dice && coin) { LAST_ROLL = { kind: 'both', count: count }; return rollBoth(count); }
    if (dice) { LAST_ROLL = { kind: 'dice', count: count }; return K.games.rollDice(count); }
    LAST_ROLL = { kind: 'coin', count: count };
    return K.games.flipCoin();
  };

  /* ------------------------- meme generator ------------------------- */
  K.games.memeCard = function () {
    var item = draw('memes');
    if (!item) return K.msg(K.t('g.noContent'));
    var stickers = K.pickN(K.KNOW.memeStickers, 3).join(' ');
    var words = (item.top + ' ' + item.bottom).split(/\s+/).length;
    return K.msgCard({
      emoji: stickers,
      title: item.top,
      lines: [item.bottom],
      footer: K.t('g.memeFooter', { words: words })
    }, { chips: K.chips([
      K.chip(K.t('g.memeNext'), K.t('g.memeNext'), '🔁'),
      K.chip(K.t('copy'), K.t('copy'), '📋'),
      K.chip(K.t('chip.help'), K.t('chip.help'), '🧭')
    ]) });
  };
  K.games.meme = function () {
    var beat = K.games.memeCard();
    beat.text = K.say('memeIntro');
    beat.footer = K.say('memeOutro');
    return beat;
  };
  /* ------------------------- registry & session ------------------------- */
  var LIST = [
    {
      id: 'rps', icon: '✌️', titleKey: 'game.rps', descKey: 'game.rps.d', chipKey: 'chip.rps',
      keys: ['rock paper', 'камень ножницы', 'rps'],
      start: function (state) {
        if (state.youScore === undefined) { state.youScore = 0; state.kuzyaScore = 0; }
        return K.msgCard({
          emoji: '✌️',
          title: K.say('rpsPrompt'),
          lines: [K.t('g.rpsScoreLine', { you: state.youScore, kuzya: state.kuzyaScore })]
        }, { chips: moveChips() });
      },
      reply: function (state, text) {
        var move = K.games.findMove(text);
        return move ? K.games.rpsPlay(move.key, state) : null;
      }
    },
    {
      id: 'guess', icon: '🔢', titleKey: 'game.guess', descKey: 'game.guess.d', chipKey: 'chip.guess',
      keys: ['guess the number', 'guess number', 'угадай число', 'число от 1'],
      start: K.games.guessStart, reply: K.games.guessReply
    },
    {
      id: 'trivia', icon: '❓', titleKey: 'game.trivia', descKey: 'game.trivia.d', chipKey: 'chip.quiz',
      keys: ['quiz', 'trivia', 'викторин', 'вопросы с вариантами'],
      start: K.games.triviaStart, reply: K.games.triviaReply
    },
    {
      id: 'anagram', icon: '🔤', titleKey: 'game.anagram', descKey: 'game.anagram.d', chipKey: null,
      keys: ['anagram', 'word puzzle', 'анаграм', 'собери слово', 'перемешанн'],
      start: K.games.anagramStart, reply: K.games.anagramReply
    },
    {
      id: 'emoji', icon: '🎬', titleKey: 'game.emoji', descKey: 'game.emoji.d', chipKey: null,
      keys: ['emoji riddle', 'emoji puzzle', 'эмодзи', 'загадка из эмодзи'],
      start: K.games.emojiStart, reply: K.games.emojiReply
    },
    {
      id: 'wyr', icon: '🤷', titleKey: 'game.wyr', descKey: 'game.wyr.d', chipKey: null,
      keys: ['would you rather', 'что бы ты выбрал', 'дилемм'],
      start: K.games.wyrStart, reply: K.games.wyrReply
    },
    {
      id: 'dice', icon: '🎲', titleKey: 'game.dice', descKey: 'game.dice.d', chipKey: null,
      keys: ['dice', 'coin', 'кубик', 'монетк', 'подбрось монет', 'кости'],
      start: function () { return K.games.dicePrompt(); },
      reply: K.games.diceReply
    },
    {
      id: 'meme', icon: '🖼️', titleKey: 'game.meme', descKey: 'game.meme.d', chipKey: 'chip.meme',
      keys: ['meme', 'мем', 'мемасик'],
      start: function () { return K.games.memeCard(); },
      reply: function () { return K.games.memeCard(); }
    }
  ];

  K.games.list = LIST;
  K.games.get = function (id) {
    var hit = null;
    LIST.forEach(function (g) { if (g.id === id) hit = g; });
    return hit;
  };
  /* Find a game from free text: title, chip label or keywords */
  K.games.byText = function (text) {
    var t = K.norm(text);
    if (!t) return null;
    var found = null;
    LIST.forEach(function (g) {
      if (found) return;
      if (K.norm(K.t(g.titleKey)) === t) found = g;
      if (!found && g.chipKey && K.norm(K.t(g.chipKey)) === t) found = g;
    });
    if (found) return found;
    LIST.forEach(function (g) {
      if (found) return;
      var hit = (g.keys || []).some(function (w) { return t.indexOf(w) !== -1; });
      if (hit) found = g;
    });
    return found;
  };
  K.games.restartChips = function (id) {
    var game = K.games.get(id);
    if (!game) return [];
    if (game.chipKey) return [K.chip(K.t(game.chipKey), K.t(game.chipKey), game.icon)];
    return [];
  };

  /* Current session (brain.js routes messages here while a game is on) */
  K.GAME = { id: null, state: {} };
  K.gameActive = function () { return K.GAME.id; };
  K.startGame = function (id, silentIntro) {
    var game = K.games.get(id);
    if (!game) return K.msg(K.say('gameUnknown'));
    K.GAME.id = game.id;
    K.GAME.state = {};
    var beat = game.start(K.GAME.state) || K.msg('');
    if (!silentIntro) {
      beat.text = (beat.text ? beat.text + ' ' : '') + K.t('g.startLine', { game: K.t(game.titleKey) });
    }
    beat.sound = beat.sound || 'receive';
    return beat;
  };
  K.gameStop = function (quiet) {
    var id = K.GAME.id;
    if (!id) return K.msg(K.t('g.noGame'));
    K.GAME.id = null;
    K.GAME.state = {};
    if (quiet) return null;
    return K.msgCard({
      emoji: '🏁',
      title: K.say('gameQuit', { name: K.userName ? K.userName() : '' }),
      lines: [K.SCORE.line()],
      footer: K.SCORE.say()
    }, { chips: K.games.restartChips(id), sound: 'tap' });
  };
  /* Returns a beat, or null when the message belongs to the general chat */
  K.gameReply = function (text) {
    if (!K.GAME.id) return null;
    var game = K.games.get(K.GAME.id);
    if (!game) { K.GAME.id = null; return null; }
    if (K.games.isStop(text)) return K.gameStop();
    if (K.games.isKey(text, 'g.next') || K.games.isKey(text, 'g.again') || K.games.isKey(text, 'g.memeNext')) {
      return game.start(K.GAME.state) || null;
    }
    return game.reply ? game.reply(K.GAME.state, text) : null;
  };
  /* One-off helpers the brain uses outside a session */
  K.games.once = {
    rps: function (text) {
      var move = K.games.findMove(text);
      return move ? K.games.rpsPlay(move.key, {}) : null;
    },
    dice: function (text) { return K.games.diceReply({}, text); },
    meme: function () { return K.games.meme(); },
    trivia: function () { return K.startGame('trivia'); },
    anagram: function () { return K.startGame('anagram'); },
    emoji: function () { return K.startGame('emoji'); },
    wyr: function () { return K.startGame('wyr'); },
    guess: function () { return K.startGame('guess'); },
    score: function () {
      return K.msgCard({
        emoji: '🏆', title: K.SCORE.line(), lines: [K.SCORE.say()], footer: K.t('games.scoreboard')
      }, { chips: K.chips([
        K.chip(K.t('chip.rps'), K.t('chip.rps'), '✌️'),
        K.chip(K.t('chip.quiz'), K.t('chip.quiz'), '❓'),
        K.chip(K.t('games.resetScore'), K.t('games.resetScore'), '🧼')
      ]) });
    }
  };
})(window.KZ);
