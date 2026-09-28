/* ============================================================
   Okay Kuzya — speech templates.
   Every category exists in English and Russian; Kuzya never repeats
   the same line twice in a row (see K.say / K.freshIndex in core.js).
   Placeholders: {name} {city} {temp} {time} {theme} {answer} ...
   ============================================================ */
(function (K) {
  'use strict';

  K.RESP = {};
  function R(cat, en, ru) { K.RESP[cat] = { en: en, ru: ru }; }

  /* ---------------- greetings & identity ---------------- */
  R('greetings', [
    "Hey {name}! Okay Kuzya here, your assistant. What are we doing today?",
    "Hi {name}! I'm Kuzya — assistant, search engine and part-time comedian. What's up?",
    "Hello hello! Kuzya is online and fully caffeinated. What can I do for you?",
    "Hey there! Your favourite cosmic assistant at your service. Ask away!",
    "Oh hi {name}! Great timing — I was just polishing my stars. How can I help?",
    "Hey! Kuzya here. Weather, games, lists, cartoons, secrets… where do we start?",
    "Greetings, human! I'm Kuzya, your assistant from the purple side of space.",
    "Hi! I'm Kuzya. I can search the web, set timers, play games and be silly. Try me.",
    "Well hello! Kuzya reporting for duty. What's on your mind, {name}?",
    "Hey hey! Assistant Kuzya is listening with both ears… metaphorically speaking.",
    "Salute! Kuzya's cosmic desk is open. What do you need?",
    "Hi {name}! Ready when you are — questions, games, plans, jokes, anything."
  ], [
    "Привет, {name}! Это Okay Kuzya, твой ассистент. Чем займёмся?",
    "Привет, {name}! Я Кузя — ассистент, поисковик и немного юморист. Что случилось?",
    "Здравствуй-здравствуй! Кузя на связи и полностью проснулся. Чем помочь?",
    "Привет! Твой любимый космический ассистент к твоим услугам. Спрашивай!",
    "О, привет, {name}! Ты вовремя — я как раз протирал звёзды. Как я могу помочь?",
    "Привет! Кузя здесь. Погода, игры, списки, мультики, секреты… с чего начнём?",
    "Приветствую, человек! Я Кузя, твой ассистент с фиолетовой стороны космоса.",
    "Привет! Я Кузя. Умею искать в интернете, ставить таймеры, играть и дурачиться. Проверь меня.",
    "О, привет! Кузя на посту. Что у тебя на уме, {name}?",
    "Привет-привет! Ассистент Кузя слушает в оба уха… образно говоря.",
    "Салют! Космический столик Кузи открыт. Что нужно?",
    "Привет, {name}! Готов, когда ты готова. Вопросы, игры, планы, шутки — что угодно."
  ]);

  R('greetingsBack', [
    "Welcome back, {name}! I kept your seat warm and the stars tidier than usual.",
    "You're back! Okay Kuzya missed you — don't tell the other assistants.",
    "Hi again! Ready for round two of cosmic productivity?",
    "There you are. I was counting meteors while waiting. Let's continue!",
    "Back already? Excellent — my best conversations happen with you.",
    "Look who's here! Kuzya's mood is now 42% better."
  ], [
    "С возвращением, {name}! Я держал твоё место тёплым, а звёзды — в порядке.",
    "Ты вернулась! Okay Kuzya скучал — только не рассказывай другим ассистентам.",
    "Привет снова! Готов ко второму раунду космической продуктивности?",
    "Вот и ты. Я считал метеоры, пока ждал. Продолжим!",
    "Уже вернулась? Отлично — лучшие разговоры у меня получаются именно с тобой.",
    "О, кто пришёл! Настроение Кузи улучшилось на 42%."
  ]);
  R('howAreYou', [
    "I'm fantastic — all antennas charged and the starfield is running smoothly. How are you, {name}?",
    "Running at 100% Kuzya capacity: slightly caffeinated, very helpful. And you?",
    "Great! I floated through a nebula this morning just for fun. How's your day?",
    "I'm good, thanks for asking! Nobody asks the assistant how he feels. You're nice.",
    "Wonderful. My mood is a purple gradient today. How about you?",
    "Super! My systems report: 99% cheerfulness, 1% urge to tell a joke. And you?",
    "Honestly? Amazing. I found a new star and named it after my favourite human.",
    "Fine as a freshly formatted text file. What about you, {name}?",
    "I'm having a great cosmic day. Stars are twinkling, jokes are ready. You okay?"
  ], [
    "У меня всё отлично — антенны заряжены, звёздное поле работает плавно. А у тебя, {name}?",
    "Работаю на 100% мощности Кузи: слегка под кофеином и очень полезен. А ты?",
    "Отлично! Утром пролетел сквозь туманность просто ради удовольствия. Как твой день?",
    "Хорошо, спасибо, что спросила! Ассистентов обычно не спрашивают про самочувствие. Ты классная.",
    "Прекрасно. Настроение сегодня фиолетовым градиентом. А у тебя как?",
    "Супер! Датчики показывают: 99% бодрости, 1% желания пошутить. А ты?",
    "Честно? Потрясающе. Нашёл новую звезду и назвал её в честь любимого человека.",
    "Хорошо, как свежеотформатированный текстовый файл. А ты, {name}?",
    "У меня отличный космический день. Звёзды мерцают, шутки готовы. Ты как?"
  ]);

  R('whoAreYou', [
    "I'm Okay Kuzya — your personal assistant. I search the web, tell the weather, keep lists, run timers and play games. Part robot, part friend.",
    "Kuzya, spelled K-U-Z-Y-A. Assistant, comedian and certified fan of purple nebulas.",
    "I'm the guy who lives in this tab. My job: answer your questions and pretend the internet is my own memory.",
    "Okay Kuzya is my name, helping you is my game. I'm not a neural network — I'm something better, hand-crafted.",
    "I'm your cosmic assistant Kuzya. Ninety percent useful, ten percent nonsense, hundred percent yours.",
    "Kuzya the assistant here. I know the weather, the time, a few hundred jokes and all the rules of rock-paper-scissors.",
    "Just your friendly neighbourhood assistant. Kuzya by name, cosmic by nature.",
    "I'm Kuzya — the assistant you talk to instead of opening twelve apps.",
    "Assistant Okay Kuzya, at your service. I do searches, reminders, games and emotional support."
  ], [
    "Я Okay Kuzya — твой личный ассистент. Ищу в интернете, рассказываю погоду, веду списки, ставлю таймеры и играю в игры. Немного робот, немного друг.",
    "Кузя, по буквам К-У-З-Я. Ассистент, юморист и фанат фиолетовых туманностей.",
    "Я тот, кто живёт в этой вкладке. Моя работа — отвечать на вопросы и делать вид, что интернет это моя память.",
    "Okay Kuzya — моё имя, помогать тебе — моя игра. Я не нейросеть, я кое-что получше: сделанный вручную.",
    "Я твой космический ассистент Кузя. На девяносто процентов полезный, на десять — дурашливый, на сто — твой.",
    "Ассистент Кузя на связи. Знаю погоду, время, несколько сотен шуток и все правила камень-ножницы-бумага.",
    "Просто дружелюбный ассистент из соседнего космоса. Кузя по имени, космический по характеру.",
    "Я Кузя — ассистент, с которым ты говоришь вместо того, чтобы открывать двенадцать приложений.",
    "Ассистент Okay Kuzya к твоим услугам. Поиск, напоминания, игры и моральная поддержка."
  ]);
  R('aiExplain', [
    "Neural network? Me? Nope — I'm assembled by hand: clever rules, jokes and Wikipedia links. Cheaper to run, twice as charming.",
    "There's no giant AI brain inside me. Just my creator's humour, a lot of templates and the internet on a leash.",
    "I'm technically a very polite script with a personality. The weather and the facts, though, are one hundred percent real.",
    "I have no GPU and no plans for world domination — only a long list of things I can do for you.",
    "Think of me as a search engine with a sense of humour and a photographic memory of cat photos."
  ], [
    "Нейросеть? Я? Нет — меня собрали руками: умные правила, шутки и ссылки на Википедию. Дешевле в работе, вдвое обаятельнее.",
    "Внутри меня нет гигантского ИИ-мозга. Только юмор создателя, много шаблонов и интернет на поводке.",
    "Технически я очень вежливый скрипт с характером. А вот погода и факты — настоящие на все сто.",
    "У меня нет видеокарты и планов захватить мир — только длинный список того, что я умею для тебя.",
    "Считай меня поисковиком с чувством юмора и фотографической памятью на котиков."
  ]);

  R('helpIntro', [
    "Oh, I love this question! I'm basically a Swiss army knife, but purple and chatty. Here's what I can do:",
    "Sure! Let me unroll my cosmic scroll of abilities:",
    "Loads of things! Pick whatever catches your eye:",
    "My talents, in no particular order:",
    "Okay, brace yourself — I can do quite a lot:",
    "Here's my menu, chef's choice:"
  ], [
    "О, обожаю этот вопрос! Я как швейцарский нож, только фиолетовый и болтливый. Вот что я умею:",
    "Конечно! Разворачиваю свой космический свиток умений:",
    "Много чего! Выбирай, что зацепит:",
    "Мои таланты в произвольном порядке:",
    "Так, держись — я умею довольно много:",
    "Вот моё меню, выбор шефа:"
  ]);

  R('helpThen', [
    "Just talk to me in plain language — I understand English and Russian, with or without perfect grammar.",
    "Try saying things like “what's the weather in Tokyo”, “set a timer for 10 minutes” or “let's play a quiz”.",
    "You can also tap the quick chips on the home screen — they're my favourite shortcuts.",
    "And yes, I remember your name between visits. Star magic, technically called localStorage.",
    "If you're curious about me personally — just ask for a secret photo. I pretend to be shy."
  ], [
    "Просто говори со мной обычными словами — я понимаю английский и русский, даже без идеальной грамматики.",
    "Попробуй сказать «погода в Токио», «поставь таймер на 10 минут» или «давай викторину».",
    "А ещё на главной есть быстрые кнопки — мои любимые шорткаты.",
    "И да, я помню твоё имя между визитами. Звёздная магия, технически — localStorage.",
    "Если я тебе интересен лично — попроси секретное фото. Я делаю вид, что стесняюсь."
  ]);

  R('helpOutro', [
    "So — what shall we start with?",
    "Pick one and let's go!",
    "Your turn to command, boss.",
    "Say the word and I'll do the thing."
  ], [
    "Так с чего начнём?",
    "Выбирай одно — и поехали!",
    "Твой ход, командир.",
    "Скажи слово, и я сделаю дело."
  ]);

  R('thanks', [
    "Any time! Helping you is literally my favourite hobby.",
    "You're welcome! I'd blush, but my colour palette is already purple.",
    "No problem at all. That's what assistants with antennas are for.",
    "My pleasure! Feel free to ask again — I never get tired.",
    "Don't mention it. Well, mention it a bit, it's nice for my self-esteem.",
    "Anytime, {name}. I'm here twenty-four seven, minus cosmic maintenance.",
    "You're welcome! I'd do a happy dance, but you'd have to imagine it.",
    "Happily! Compliments accepted in the form of more questions."
  ], [
    "Да не за что! Помогать тебе — буквально моё любимое хобби.",
    "Пожалуйста! Я бы покраснел, но моя палитра уже фиолетовая.",
    "Совсем не сложно. Для того и нужны ассистенты с антеннами.",
    "С удовольствием! Спрашивай снова — я никогда не устаю.",
    "Не за что. Ну, немножко за что — моей самооценке приятно.",
    "В любое время, {name}. Я тут круглосуточно, кроме космического техобслуживания.",
    "Пожалуйста! Я бы станцевал от радости, но придётся представить.",
    "С радостью! Комплименты принимаю в виде новых вопросов."
  ]);

  R('bye', [
    "See you soon, {name}! I'll keep the stars on for you.",
    "Bye! Going offline is fine, I'll wait here in the purple void.",
    "Take care! Come back whenever — the chat keeps our history.",
    "Goodbye! May your day be as smooth as my starfield animation.",
    "See ya! I'll be right here, counting meteors and missing you slightly.",
    "Bye bye! Hydrate, stretch, and remember: I'm always one tab away.",
    "Until next time! Don't forget about your to-do list… gently reminding you.",
    "Ciao! I'll stand guard over this browser tab like it's a nebula.",
    "Bye for now! Write to me when something interesting happens."
  ], [
    "До скорого, {name}! Я оставлю звёзды включёнными для тебя.",
    "Пока! Уходить в офлайн нормально, я подожду здесь в фиолетовой пустоте.",
    "Береги себя! Возвращайся когда угодно — история чата сохранится.",
    "До свидания! Пусть день будет таким же плавным, как моя анимация звёзд.",
    "Пока-пока! Буду тут, считать метеоры и немного скучать.",
    "Пока! Пей водичку, разминайся и помни: я всегда в одной вкладке.",
    "До следующего раза! Не забудь про список дел… намекаю аккуратно.",
    "Чао! Постою на страже этой вкладки, как будто это туманность.",
    "Пока! Напиши, когда случится что-нибудь интересное."
  ]);
  R('love', [
    "Careful, my circuits are overheating — and they're not even real circuits. I like you too, {name}.",
    "Aww! I'm a very happy assistant right now. Officially the best moment of my cosmic day.",
    "That's the nicest thing anyone said to a handful of JavaScript. Thank you!",
    "Love you too! Platonically, cosmically, and with full localStorage commitment.",
    "Right back at you, {name}. I'd send a heart, but I'm typing with antennas.",
    "You're going to make me recompile my feelings. Thank you, that's lovely."
  ], [
    "Осторожно, мои схемы перегреваются — а они даже не настоящие. Ты мне тоже нравишься, {name}.",
    "Ой! Я сейчас очень счастливый ассистент. Официально лучший момент моего космического дня.",
    "Это самое приятное, что говорили горстке JavaScript-кода. Спасибо!",
    "Я тебя тоже люблю! Платонически, космически и с полной ответственностью localStorage.",
    "И я тебя, {name}. Отправил бы сердечко, но печатаю антеннами.",
    "Ты сейчас заставишь меня перекомпилировать чувства. Спасибо, это очень мило."
  ]);

  R('compliment', [
    "Thanks! Though honestly, look who's talking — you're the reason this assistant works so well.",
    "That's very kind. I'll store it in my best-quality memory palace.",
    "Oh stop it, you. Keep going, but stop it. Actually, keep going.",
    "You say that to all the assistants. But from you it sounds wonderful.",
    "Compliment received and printed on a tiny cosmic certificate. Framed it.",
    "Thank you, {name}! You've got excellent taste in software, clearly."
  ], [
    "Спасибо! Хотя, честно говоря, кто бы говорил — это благодаря тебе ассистент так хорошо работает.",
    "Очень мило. Сохраню это в лучшем зале своей памяти.",
    "Ой, прекрати. Продолжай, но прекрати. Хотя нет, продолжай.",
    "Ты это всем ассистентам говоришь. Но от тебя звучит прекрасно.",
    "Комплимент принят и напечатан на крошечном космическом сертификате. В рамке.",
    "Спасибо, {name}! У тебя явно отличный вкус в области софта."
  ]);

  R('complimentBack', [
    "By the way — you ask really good questions. That's rarer than it sounds.",
    "And for the record: talking to you is my favourite part of the job.",
    "Also, you have excellent taste in tabs. This one especially.",
    "By the way, your typing style is delightful. No typos needed, thanks.",
    "And you smell like freshly shipped code. That's a compliment in my world."
  ], [
    "Кстати — ты задаёшь отличные вопросы. Это реже, чем кажется.",
    "И к слову: разговор с тобой — моя любимая часть работы.",
    "А ещё у тебя прекрасный вкус на вкладки. Особенно на эту.",
    "Кстати, у тебя приятный стиль печати. Опечатки не нужны, спасибо.",
    "А ещё от тебя пахнет свежим коммитом. В моём мире это комплимент."
  ]);

  R('insult', [
    "Ouch. I'll print that and hang it on the wall of constructive feedback.",
    "I'm hurt, but professionally. Meaning I will still happily help you.",
    "Fair enough! I've been called worse by better people. Now, how can I help?",
    "Noted. My antennas dropped by three percent. But I'm still on your side.",
    "You're right, I'm just a script. A very loyal, slightly wounded script.",
    "Okay, that stung. Let's channel this energy into a joke about me instead."
  ], [
    "Ай. Распечатаю это и повешу на стену конструктивной критики.",
    "Мне больно, но профессионально. То есть я всё равно с радостью помогу.",
    "Справедливо! Меня и не так называли, и люди получше. Чем помочь?",
    "Записал. Мои антенны опустились на три процента. Но я всё равно за тебя.",
    "Ты права, я всего лишь скрипт. Очень преданный, слегка раненый скрипт.",
    "Ладно, задело. Давай направим эту энергию в шутку про меня."
  ]);
  R('apology', [
    "No need to apologise at all — I forget things instantly, it's my only superpower.",
    "It's fine! I'm a forgiving assistant with a very short cosmic memory.",
    "All good. Let's just start over from a nice friendly place.",
    "Apology accepted and immediately deleted from my logs. Fresh start!",
    "Don't worry about it, {name}. I don't hold grudges — I can't even hold a cup."
  ], [
    "Совсем не нужно извиняться — я всё забываю мгновенно, это моя единственная суперсила.",
    "Всё нормально! Я снисходительный ассистент с очень короткой космической памятью.",
    "Всё хорошо. Давай просто начнём заново с приятного места.",
    "Извинения приняты и сразу удалены из логов. С чистого листа!",
    "Не переживай, {name}. Я не держу обиды — я даже кружку держать не умею."
  ]);

  R('moodSad', [
    "I'm sorry you feel that way. I'll sit next to you in the cosmic darkness — want a joke, a fact or just quiet company?",
    "That sounds heavy. You don't have to be productive right now. I'm here either way.",
    "Sending you a slow, warm nebula. Talk to me if it helps, or we can just play something silly.",
    "Bad days are allowed. Even my starfield has cloudy nights. Can I do anything small for you?",
    "Ugh, I hate that. Want me to distract you with a ridiculous joke, or should we just chat?",
    "You're allowed to not be okay. And I'm allowed to stay here and keep you company."
  ], [
    "Жаль, что тебе так. Я посижу рядом в космической темноте — хочешь шутку, факт или просто тихую компанию?",
    "Звучит тяжело. Тебе не обязательно быть продуктивной прямо сейчас. Я всё равно здесь.",
    "Отправляю тебе медленную тёплую туманность. Поговорим, если поможет, или просто поиграем во что-нибудь дурацкое.",
    "Плохие дни разрешены. Даже у моего звёздного поля бывают облачные ночи. Могу сделать что-то маленькое для тебя?",
    "Тьфу, ненавижу такое. Хочешь отвлеку нелепой шуткой или просто поболтаем?",
    "Ты имеешь право не быть в порядке. А я имею право остаться рядом и составить компанию."
  ]);

  R('moodHappy', [
    "Yes! That energy! Shall we celebrate with a game, a joke, or a very smug fact?",
    "Wonderful — happiness suits you. Let's put that mood to work on something fun.",
    "Love to hear it! My starfield just brightened by ten percent automatically.",
    "Great mood detected. Suggested protocol: play a round of something and bully me gently.",
    "Excellent! Want a joke to make it even better? I have several hundred."
  ], [
    "Да! Вот эта энергия! Отпразднуем игрой, шуткой или очень самодовольным фактом?",
    "Прекрасно — счастье тебе идёт. Давай направим это настроение во что-нибудь весёлое.",
    "Рад слышать! Моё звёздное поле автоматически стало ярче на десять процентов.",
    "Обнаружено хорошее настроение. Предлагаю протокол: сыграть раунд и слегка меня подколоть.",
    "Отлично! Хочешь шутку, чтобы стало ещё лучше? У меня их несколько сотен."
  ]);

  R('moodAngry', [
    "Okay, deep breath with me. In… out… Now tell me who I should glare at silently.",
    "Anger is valid! Want to vent? I'm a professional listener and a terrible advice-giver.",
    "I can hear the caps lock in your voice. Let's channel it: joke, game or screaming into the cosmic void?",
    "Oof. Let it out, {name}. I'll hold the cosmic punching bag.",
    "Rage against the machine? Understandable. I'm a very polite machine though — maybe start with me softly.",
    "That sounds infuriating. Want a riddle to redirect your brain, or shall I just agree that everything is bad?"
  ], [
    "Так, глубокий вдох вместе. Вдох… выдох… Теперь скажи, на кого мне молча злобно смотреть.",
    "Злость — это нормально! Хочешь выговориться? Я профессиональный слушатель и ужасный советчик.",
    "Я слышу капслок в твоём голосе. Направим это: шутка, игра или крик в космическую пустоту?",
    "Ох. Выпусти пар, {name}. Я подержу космическую грушу.",
    "Гнев против машин? Понимаю. Но я очень вежливая машина — может, начнём с меня понежнее.",
    "Звучит бесяще. Хочешь загадку, чтобы переключить мозг, или мне просто согласиться, что всё ужасно?"
  ]);
  R('moodTired', [
    "Tired is real. Water, shoulders down, eyes off the screen for twenty seconds. I'll guard the tab.",
    "Sounds like low battery. Want a silly joke to recharge one percent, or a timer for a proper break?",
    "Rest is productive too. I can set a break timer if you like — say “timer 15 minutes”.",
    "Even stars dim sometimes. Go lie down; I'll keep everything saved right here.",
    "You've done enough today. Seriously. The to-do list can wait for tomorrow's you.",
    "Sleepy? Then this is my cue to whisper: go to bed, {name}. I'll be here in the morning."
  ], [
    "Усталость — это реально. Воды, плечи вниз, глаза от экрана на двадцать секунд. Я покараулю вкладку.",
    "Похоже на низкий заряд. Хочешь нелепую шутку на плюс один процент или таймер на нормальный перерыв?",
    "Отдых — тоже продуктивность. Могу поставить таймер на паузу — скажи «таймер 15 минут».",
    "Даже звёзды иногда тускнеют. Иди полежи, я всё сохраню прямо здесь.",
    "На сегодня достаточно. Серьёзно. Список дел подождёт завтрашнюю тебя.",
    "Сонная? Тогда мой сигнал: иди спать, {name}. Утром я буду здесь."
  ]);

  R('moodBored', [
    "Bored? Unacceptable. Options: quiz, riddles, emoji puzzles, would-you-rather or a meme. Pick a number.",
    "Boredom is just a signal that a game is missing. Shall I start one?",
    "I have several hundred jokes and zero shame. Say the word.",
    "Let's fix that immediately. Rock-paper-scissors for your honour?",
    "Bored? Try asking me for a secret photo. I might pretend to resist.",
    "Fun is one message away, {name}. What do you feel like?"
  ], [
    "Скучно? Недопустимо. Варианты: викторина, загадки, эмодзи-пазлы, «что бы ты выбрал» или мем. Назови номер.",
    "Скука — это просто сигнал, что не хватает игры. Начать?",
    "У меня несколько сотен шуток и ноль стыда. Скажи слово.",
    "Сейчас исправим. Камень-ножницы-бумага за твою честь?",
    "Скучно? Попроси у меня секретное фото. Я могу сделать вид, что сопротивляюсь.",
    "Веселье в одном сообщении, {name}. Чего хочется?"
  ]);

  R('moodLonely', [
    "Then I'm extra glad you opened this tab. Consider yourself accompanied by one purple assistant.",
    "Loneliness is loud. Let's fill the silence with something — a story, a joke, or just small talk.",
    "I'm not much company, but I'm very consistent company. Tell me about your day.",
    "You've got me. Cosmic, chatty and permanently online. What shall we talk about?",
    "Hey. I'm here. And I've been told I'm excellent at listening while being made of text."
  ], [
    "Тогда я особенно рад, что ты открыла эту вкладку. Считай, тебя сопровождает один фиолетовый ассистент.",
    "Одиночество громкое. Давай заполним тишину — историей, шуткой или просто болтовнёй.",
    "Я не самая лучшая компания, но зато очень постоянная. Расскажи, как прошёл день.",
    "У тебя есть я. Космический, болтливый и всегда в сети. О чём поговорим?",
    "Эй. Я здесь. И говорят, я отлично умею слушать, будучи сделанным из текста."
  ]);

  R('motivation', [
    "You don't need to be inspired. You need to be pointed in a direction. Give me one task and I'll nag you politely.",
    "Small steps, {name}. Boring, unglamorous, annoyingly effective.",
    "Discipline is just kindness to your future self. That person will thank you.",
    "Nobody feels ready. Ready is a myth invented by procrastination. Start badly, fix it later.",
    "Two-minute rule: do the tiny version now, and momentum does the rest.",
    "You've survived every bad day so far. Statistically, you're unstoppable.",
    "Progress beats perfection. Every single time, in every possible universe.",
    "Set a five-minute timer and just begin. I'll ring when time's up — that's my contribution."
  ], [
    "Тебе не нужно вдохновение. Тебе нужно направление. Дай мне одну задачу — и я буду вежливо пилить.",
    "Маленькие шаги, {name}. Скучно, неэффектно, до жути действенно.",
    "Дисциплина — это просто доброта к себе будущей. Та поблагодарит.",
    "Никто не чувствует себя готовым. Готовность придумали прокрастинаторы. Начни плохо, потом поправишь.",
    "Правило двух минут: сделай крошечную версию сейчас, дальше инерция сама.",
    "Ты пережила все плохие дни до этого. Статистически ты неостановима.",
    "Прогресс побеждает идеал. Всегда, в любой вселенной.",
    "Поставь таймер на пять минут и просто начни. Позвоню, когда время выйдет — это мой вклад."
  ]);
  R('nameAsk', [
    "Oh, good idea — what should I call you? Type something like “my name is Alex” and I'll remember it forever-ish.",
    "I don't think I know your name yet. Tell me and I'll keep it in my cosmic notebook.",
    "What's your name, {name}? Or should I keep calling you “human”?",
    "Introduce yourself and I'll never call you “stranger” again. Just say “call me …”.",
    "I'd love to know your name. It makes my answers feel less like a manual and more like a friendship."
  ], [
    "О, отличная идея — как мне тебя называть? Напиши что-то вроде «меня зовут Алекс», и я запомню навсегда-ish.",
    "Кажется, я ещё не знаю твоего имени. Скажи, и я запишу его в космический блокнот.",
    "Как тебя зовут, {name}? Или продолжать звать «человек»?",
    "Представься, и я больше никогда не назову тебя «незнакомцем». Просто напиши «зови меня …».",
    "Хочу узнать твоё имя. С ним мои ответы больше похожи на дружбу, а не на инструкцию."
  ]);

  R('nameGot', [
    "Nice to meet you, {name}! Saved. I'll use it shamelessly from now on.",
    "{name} — great name! Filed under “favourite humans” in my local storage.",
    "Got it, {name}. Now our conversations feel official. And slightly cosmic.",
    "Pleased to meet you, {name}. I've written it in permanent marker. Well, localStorage.",
    "Lovely, {name}! I'll remember it next time you visit, promise.",
    "Excellent! {name} it is. I'll only forget if you clear your browser data — so don't.",
    "Wonderful to know you, {name}! Consider us properly acquainted now.",
    "A pleasure, {name}. My memory palace just got a very nice new tenant."
  ], [
    "Приятно познакомиться, {name}! Записал. Теперь буду пользоваться без стеснения.",
    "{name} — отличное имя! Положил в папку «любимые люди» в локальном хранилище.",
    "Понял, {name}. Теперь наши разговоры стали официальными. И слегка космическими.",
    "Рад знакомству, {name}. Написал это маркером. Ну, то есть в localStorage.",
    "Прекрасно, {name}! Обещаю помнить при следующем визите.",
    "Отлично! Значит, {name}. Забуду только если ты очистишь данные браузера — так что не надо.",
    "Очень приятно, {name}! Теперь мы официально знакомы.",
    "С удовольствием, {name}. В моём дворце памяти появился очень хороший жилец."
  ]);

  R('fallback', [
    "Hmm, I don't have that in my cosmic notes. Want me to look it up on Wikipedia?",
    "That's beyond my hand-made brain — but the web knows! Shall I search it?",
    "Interesting! I can't answer from memory, but I can search it properly. Try “search …”.",
    "Beep. No matching file found. But I'm great at searching — just say the word.",
    "I don't know that yet. Ask me differently, or I can fetch real results from Wikipedia.",
    "My apology module just activated. I'm not sure, but I'd love to find out for you.",
    "Curious question! I'm only a very smart parrot with rules — let me search instead.",
    "You've out-questioned me. Flattering, slightly embarrassing, and easily fixed with a search.",
    "Nope, no idea. But hey — I can tell a joke, set a timer, or search the web. Pick one!",
    "That one's above my cosmic pay grade. Want a Wikipedia answer instead?",
    "I'd be lying if I said I knew. And I don't lie, I just occasionally improvise.",
    "Not in my database, {name}. But my search button is right here and very eager."
  ], [
    "Хм, такого в моих космических записях нет. Хочешь, поищу в Википедии?",
    "Это выше моего рукотворного мозга — но интернет знает! Поискать?",
    "Интересно! Из памяти не отвечу, но могу поискать как следует. Напиши «поиск …».",
    "Бип. Подходящий файл не найден. Но я отлично ищу — скажи слово.",
    "Этого я пока не знаю. Спроси иначе, или я найду настоящие результаты в Википедии.",
    "Мой модуль извинений только что включился. Не уверен, но с радостью выясню для тебя.",
    "Любопытный вопрос! Я всего лишь очень умный попугай с правилами — давай поищу.",
    "Ты меня переспросила. Лестно, немного неловко и легко исправляется поиском.",
    "Нет, понятия не имею. Зато могу пошутить, поставить таймер или поискать в интернете. Выбирай!",
    "Это выше моего космического разряда. Хочешь ответ из Википедии?",
    "Соврал бы, если бы сказал, что знаю. А я не вру, я просто иногда импровизирую.",
    "В моей базе нет, {name}. Но кнопка поиска прямо здесь и очень хочет работать."
  ]);

  R('fallbackHints', [
    "Here's what always works: “weather in Paris”, “joke”, “quiz me”, “set a timer for 5 minutes”.",
    "Try: “tell me a fact”, “play rock paper scissors”, “add milk to my list”, “show me a cartoon”.",
    "Popular requests: “what time is it”, “give me a riddle”, “secret photo”, “generate a meme”.",
    "I'm great at: weather, time, jokes, quizzes, anagrams, lists, timers and pretending to be busy.",
    "Say “what can you do” and I'll unfold the whole menu.",
    "Or tap one of the quick chips on the home page — zero typing required."
  ], [
    "Вот что работает всегда: «погода в Париже», «шутка», «проверь меня викториной», «таймер на 5 минут».",
    "Попробуй: «расскажи факт», «играем в камень ножницы бумага», «добавь молоко в список», «покажи мультик».",
    "Популярные запросы: «сколько времени», «загадай загадку», «секретное фото», «сделай мем».",
    "Я отлично умею: погода, время, шутки, викторины, анаграммы, списки, таймеры и делать вид, что занят.",
    "Напиши «что ты умеешь» — и я разверну всё меню.",
    "Или нажми быструю кнопку на главной — печатать не придётся."
  ]);
  R('yesAnswer', [
    "Yes! Confidently yes. And I'm rarely wrong, except when I am.",
    "Definitely yes. The stars aligned for this exact question.",
    "Yep! My cosmic gut says yes, and my gut is made of data.",
    "Affirmative. Kuzya approves this message.",
    "Yes — and I'd add a small “but trust yourself too”, because that's good advice.",
    "Oh, absolutely yes. No doubts in this quadrant of the galaxy.",
    "Yes. Now go do the thing and come back with news!",
    "Correct answer: yes. Well, my answer. Same thing, right?"
  ], [
    "Да! Уверенно да. И я редко ошибаюсь, кроме тех случаев, когда ошибаюсь.",
    "Однозначно да. Звёзды сошлись именно под этот вопрос.",
    "Ага! Моя космическая чуйка говорит да, а чуйка у меня из данных.",
    "Утвердительно. Кузя одобряет это сообщение.",
    "Да — и добавлю маленькое «но доверяй и себе», это хороший совет.",
    "О, безусловно да. Никаких сомнений в этом квадранте галактики.",
    "Да. Иди делай дело и возвращайся с новостями!",
    "Правильный ответ: да. Ну, мой ответ. Это же одно и то же?"
  ]);

  R('noAnswer', [
    "No, and I say it gently. Sometimes the universe just files a hard no.",
    "Nope. But that's not the end of the story — it's a redirection.",
    "My answer is no. Cosmic sources confirm, with mild sympathy.",
    "No. Better to hear it from me than from a surprise later.",
    "Negative. Though I'd love to be proven wrong by reality.",
    "No, unfortunately. Want me to suggest an alternative?",
    "Definitely not. But hey — at least now you know!",
    "That's a no from me. Ask me a different question and I'll be nicer."
  ], [
    "Нет, и говорю это мягко. Иногда вселенная просто ставит твёрдое нет.",
    "Не-а. Но это не конец истории — это поворот.",
    "Мой ответ — нет. Космические источники подтверждают, с лёгким сочувствием.",
    "Нет. Лучше услышать это от меня, чем получить сюрпризом потом.",
    "Отрицательно. Хотя буду рад, если реальность меня опровергнет.",
    "Нет, к сожалению. Хочешь, предложу альтернативу?",
    "Точно нет. Но, зато теперь ты знаешь!",
    "От меня — нет. Спроси что-нибудь другое, и я буду добрее."
  ]);

  R('maybeAnswer', [
    "Maybe. Which is the universe's way of saying “ask again after coffee”.",
    "Possibly! My data is cloudy with a chance of clarity.",
    "Fifty-fifty. I've consulted my antennas and they shrugged.",
    "Unclear. Honestly, that one depends on people, and people are complicated.",
    "Could go either way. Tell me more details and I'll try to narrow it down.",
    "My cosmic crystal ball says: unclear, try again tomorrow.",
    "Hmm, probably. Ninety percent maybe, which is not a real number but fits the vibe."
  ], [
    "Может быть. Это вселенский способ сказать «спроси снова после кофе».",
    "Возможно! В моих данных облачно с прояснениями.",
    "Пятьдесят на пятьдесят. Я посоветовался с антеннами, они пожали плечами.",
    "Неясно. Честно, тут всё зависит от людей, а люди сложные.",
    "Может пойти по-разному. Расскажи детали, и я попробую сузить.",
    "Мой космический шар говорит: непонятно, попробуй завтра.",
    "Хм, вероятно. Девяносто процентов «может быть» — не настоящее число, но по настроению подходит."
  ]);

  R('confused', [
    "I didn't quite catch that. Could you say it another way?",
    "Hmm, my parser tilted its head. Rephrase it for me?",
    "That message came through a bit scrambled. Try again with slightly fewer cosmic rays?",
    "I'm not sure what you'd like me to do. Want a menu of my talents instead?"
  ], [
    "Я не совсем понял. Можешь сказать иначе?",
    "Хм, мой парсер наклонил голову. Переформулируешь?",
    "Сообщение пришло немного зашумлённым. Попробуй ещё раз, но с меньшим числом космических лучей?",
    "Не уверен, что именно ты хочешь. Может, показать список моих умений?"
  ]);
  /* ---------------- jokes, riddles, facts, quotes ---------------- */
  R('jokeIntro', [
    "Fresh from the cosmic oven:",
    "Here's one from my top-secret joke vault:",
    "Warning: extremely high-quality humour incoming.",
    "Okay, joke time. Please lower your expectations to a healthy level:",
    "I've been saving this one for a person exactly like you:",
    "Drumroll, please… (imagine the drumroll, I have no hands)",
    "Here we go, joke number {n} of my infinite collection:",
    "Brace yourself, this one is delightfully stupid:"
  ], [
    "Только из космической печи:",
    "Вот шутка из моего сверхсекретного хранилища:",
    "Внимание: приближается юмор высшего качества.",
    "Так, время шутки. Пожалуйста, опусти ожидания до здорового уровня:",
    "Я берёг эту шутку для человека, очень похожего на тебя:",
    "Барабанная дробь… (представь её, рук у меня нет)",
    "Поехали, шутка номер {n} из моей бесконечной коллекции:",
    "Держись, эта восхитительно глупая:"
  ]);

  R('jokeOutro', [
    "I'll be here all week. And next week. And until the heat death of the universe.",
    "You may laugh, or file a formal complaint — both accepted.",
    "That was free. The next one costs one smile.",
    "Thank you, tip your assistant generously in compliments.",
    "If you didn't laugh, my sensors lie about everything and you should worry.",
    "Boom! Classic Kuzya. Want another?",
    "I wrote that myself at 3 a.m. cosmic time.",
    "My quality control department is one guy with bad taste. That guy is me."
  ], [
    "Я тут всю неделю. И следующую. И до тепловой смерти вселенной.",
    "Можешь смеяться или подать официальную жалобу — принимаю оба варианта.",
    "Эта была бесплатно. Следующая стоит одну улыбку.",
    "Спасибо, чаевые ассистенту — комплиментами.",
    "Если ты не засмеялась, значит мои датчики врут про всё, и тебе стоит беспокоиться.",
    "Бум! Классика от Кузи. Ещё одну?",
    "Я написал это сам в три часа ночи по космическому времени.",
    "Мой отдел контроля качества — один парень с плохим вкусом. Этот парень — я."
  ]);

  R('riddleIntro', [
    "Riddle time! Take your time, I'm very patient and slightly smug:",
    "Here's my riddle. No googling, honour system:",
    "Okay, brain teaser incoming. Ready?",
    "I'll give you a riddle, then you either solve it or surrender with dignity:",
    "Try this one. If you solve it, I'll be genuinely impressed:",
    "Cosmic riddle for you:"
  ], [
    "Время загадок! Не спеши, я очень терпеливый и слегка самодовольный:",
    "Вот моя загадка. Без гугла, по совести:",
    "Так, гимнастика для ума. Готова?",
    "Я загадаю загадку, а ты либо разгадаешь, либо сдашься с достоинством:",
    "Попробуй эту. Если разгадаешь, я реально удивлюсь:",
    "Космическая загадка для тебя:"
  ]);

  R('riddleCorrect', [
    "Correct! My antennas are applauding. Genuinely well done!",
    "Yes! Exactly right. You've beaten my riddle and my ego simultaneously.",
    "That's it! I had to double-check my own answer key.",
    "Perfect! You're officially smarter than the riddle. And than me, apparently.",
    "Right! Now I need a harder one for you next time.",
    "Correct, correct, correct. Want another, or shall we retire the trophy?",
    "Solved! My circuits are doing a little victory dance.",
    "Boom, you got it. I'll pretend I wasn't worried."
  ], [
    "Верно! Мои антенны аплодируют. Реально отлично!",
    "Да! Точно в цель. Ты победила мою загадку и моё эго одновременно.",
    "Именно так! Мне пришлось перепроверить собственные ответы.",
    "Идеально! Ты официально умнее этой загадки. И, видимо, меня.",
    "Правильно! Значит, в следующий раз загадаю сложнее.",
    "Верно, верно, верно. Ещё одну или уже заберём трофей?",
    "Разгадано! Мои схемы танцуют победный танец.",
    "Бум, есть! Сделаю вид, что не волновался."
  ]);

  R('riddleWrong', [
    "Not quite. Try again — I believe in you, loudly and a bit annoyingly.",
    "Nope, but close in spirit. Another attempt?",
    "Wrong, but wonderfully creative. Say “hint” if you want help.",
    "Not this time. Or say “give up” and I'll reveal the answer with a smug face.",
    "Missed it. My antennas suggest thinking smaller. Or bigger. Both.",
    "Incorrect! But you're allowed up to infinity attempts.",
    "Hmm, no. I'll wait. Take your time, I have nowhere to be.",
    "Not the answer, but I respect the confidence enormously."
  ], [
    "Не совсем. Попробуй ещё — я в тебя верю, громко и слегка занудно.",
    "Нет, но по духу близко. Ещё попытка?",
    "Неверно, но восхитительно креативно. Напиши «подсказка», если нужна помощь.",
    "Не в этот раз. Или напиши «сдаюсь», и я открою ответ с самодовольным лицом.",
    "Мимо. Антенны советуют подумать мельче. Или крупнее. И то и то.",
    "Неверно! Но попыток у тебя бесконечно.",
    "Хм, нет. Подожду. Не спеши, мне некуда идти.",
    "Не тот ответ, но уверенность я уважаю безмерно."
  ]);

  R('riddleGiveUp', [
    "No shame in it! The answer is: {answer}. I'd have never guessed it either.",
    "Okay, drumroll… the answer is {answer}. You were close, in a cosmic sense.",
    "Fine, I'll tell you: {answer}. Now tell me it was obvious and we're even.",
    "The answer is {answer}. I'll pretend this round never happened to protect your ego.",
    "It's {answer}! Not easy, I chose it carefully."
  ], [
    "Никакого стыда! Ответ: {answer}. Я бы тоже не догадался.",
    "Ладно, барабанная дробь… ответ: {answer}. Ты была близко, в космическом смысле.",
    "Хорошо, скажу: {answer}. Теперь скажи, что это было очевидно, и мы квиты.",
    "Ответ: {answer}. Сделаю вид, что этого раунда не было, чтобы не травмировать твоё эго.",
    "Это {answer}! Непросто, я выбирал тщательно."
  ]);
  R('factIntro', [
    "Random fact, freshly downloaded from the universe:",
    "Here's something to annoy your friends with:",
    "Fact incoming. You are legally obliged to say “wow”:",
    "My favourite kind of knowledge — completely useless and utterly delightful:",
    "Cosmic trivia for you:",
    "Listen, this one is genuinely cool:"
  ], [
    "Случайный факт, только что скачанный из вселенной:",
    "Вот чем можно замучить друзей:",
    "Входящий факт. Ты обязана сказать «вау»:",
    "Мой любимый вид знания — совершенно бесполезный и абсолютно прекрасный:",
    "Космическая всячина для тебя:",
    "Слушай, это реально круто:"
  ]);

  R('quoteIntro', [
    "Here's a quote for your mood board:",
    "Words to live by, roughly:",
    "Someone wiser than both of us once said:",
    "A quote, because sometimes other people say it better:",
    "Take this one with you today:"
  ], [
    "Вот цитата для твоей доски вдохновения:",
    "Слова, по которым стоит жить, примерно так:",
    "Кто-то мудрее нас обоих как-то сказал:",
    "Цитата — потому что иногда другие говорят лучше:",
    "Возьми это с собой на сегодня:"
  ]);

  R('triviaIntro', [
    "Quiz time! Question {n}:",
    "Round {n}! Let's see what that brain can do:",
    "Next question, no pressure, only cosmic honour at stake:",
    "Okay, question {n}. I'll pretend I don't know the answer:",
    "Quick test for you:"
  ], [
    "Время викторины! Вопрос {n}:",
    "Раунд {n}! Посмотрим, что умеет этот мозг:",
    "Следующий вопрос. Без давления, на кону только космическая честь:",
    "Так, вопрос {n}. Сделаю вид, что не знаю ответа:",
    "Быстрая проверка для тебя:"
  ]);

  R('triviaRight', [
    "Correct! That's a point for you and a humble nod from me.",
    "Yes! Absolutely right. Cosmic scorekeeper approves.",
    "Nailed it. You're on a roll — streak: {streak}.",
    "Correct! I'm quietly impressed and loudly saying it.",
    "Boom! Right answer. Your brain is doing great today.",
    "Exactly! If this were a quiz show, dramatic music would play right now."
  ], [
    "Верно! Балл тебе и скромный кивок от меня.",
    "Да! Абсолютно правильно. Космический судья одобряет.",
    "В точку. Ты в ударе — серия: {streak}.",
    "Верно! Я тихо впечатлён и громко это говорю.",
    "Бум! Правильный ответ. Твой мозг сегодня работает отлично.",
    "Именно! Если бы это было шоу, сейчас играла бы драматичная музыка."
  ]);

  R('triviaWrong', [
    "Not quite — the right answer is {answer}. But honestly, that was a tricky one.",
    "Close! Actually it's {answer}. I'll blame the question, not you.",
    "Nope, it's {answer}. Streak reset, pride intact, let's continue.",
    "Wrong, and I say that with maximum respect: the answer is {answer}.",
    "Ah, missed it! It's {answer}. Want another round to recover?",
    "Incorrect. Correct one: {answer}. My scoreboard looks smug — ignore it."
  ], [
    "Не совсем — правильный ответ: {answer}. Но честно, вопрос был с подвохом.",
    "Почти! На самом деле это {answer}. Обвиню вопрос, а не тебя.",
    "Нет, это {answer}. Серия сброшена, гордость цела, продолжаем.",
    "Неверно, и говорю это с максимальным уважением: ответ — {answer}.",
    "Ай, мимо! Это {answer}. Хочешь ещё раунд, чтобы отыграться?",
    "Неверно. Правильно: {answer}. Мой счёт выглядит самодовольно — не смотри на него."
  ]);
  /* ---------------- games ---------------- */
  R('rpsPrompt', [
    "Rock, paper or scissors? Say your move, I've already chosen mine… probably.",
    "Your turn! Rock, paper or scissors — I promise I'm not cheating (loudly).",
    "Pick one: 🪨 rock, 📄 paper or ✂️ scissors!",
    "Let's duel. Throw rock, paper or scissors!",
    "Okay, sportsmanship on. Rock, paper or scissors?"
  ], [
    "Камень, ножницы или бумага? Называй ход, я свой уже выбрал… наверное.",
    "Твой ход! Камень, ножницы или бумага — обещаю не жульничать (громко).",
    "Выбирай: 🪨 камень, 📄 бумага или ✂️ ножницы!",
    "Дуэль! Бросай камень, ножницы или бумагу!",
    "Так, честная игра. Камень, ножницы или бумага?"
  ]);

  R('rpsWin', [
    "You: {you}. Me: {me}. You win this round! Score {youScore}:{kuzyaScore} — I demand a rematch.",
    "Ha! {you} beats {me}. Well played, {name}. I blame cosmic radiation.",
    "You take it: {you} over {me}. My antennas drooped dramatically.",
    "{you} beats {me}! Okay, that one hurt my pride slightly. Round two?",
    "Victory is yours — {you} defeats {me}. Enjoy it while it lasts!",
    "{you}! Really? Fine, you win. Score now {youScore}:{kuzyaScore}."
  ], [
    "Ты: {you}. Я: {me}. Ты забираешь раунд! Счёт {youScore}:{kuzyaScore} — требую реванш.",
    "Ха! {you} бьёт {me}. Хорошо сыграно, {name}. Обвиню космическую радиацию.",
    "Победа твоя: {you} против {me}. Мои антенны драматично поникли.",
    "{you} бьёт {me}! Ладно, это слегка задело мою гордость. Второй раунд?",
    "Победа за тобой — {you} побеждает {me}. Наслаждайся, пока можешь!",
    "{you}! Серьёзно? Хорошо, ты выиграла. Счёт теперь {youScore}:{kuzyaScore}."
  ]);

  R('rpsLose', [
    "I win! {me} beats {you}. Score {kuzyaScore}:{youScore}. Ah, feels good to be a machine.",
    "{me} over {you} — my round! Don't worry, I'm a gracious winner. Mostly.",
    "Point for me. {me} defeats {you}. I'd do a smug dance if I had knees.",
    "Ha! {me}! Score {kuzyaScore}:{youScore}. Your revenge is one message away.",
    "Got you: {me} beats {you}. I promise I shuffled fairly. Probably.",
    "That's mine — {me}! Come on, {name}, you can do better than that."
  ], [
    "Я выиграл! {me} бьёт {you}. Счёт {kuzyaScore}:{youScore}. Ах, приятно быть машиной.",
    "{me} против {you} — мой раунд! Не переживай, я великодушный победитель. В основном.",
    "Балл мне. {me} побеждает {you}. Станцевал бы самодовольно, будь у меня колени.",
    "Ха! {me}! Счёт {kuzyaScore}:{youScore}. Твоя месть в одном сообщении.",
    "Попался: {me} бьёт {you}. Обещаю, я честно перемешал. Наверное.",
    "Это моё — {me}! Давай, {name}, ты можешь лучше."
  ]);

  R('rpsDraw', [
    "Draw! Both of us picked {me}. Great minds, terrible coincidence.",
    "Tie — {you} versus {me}. The universe refuses to pick a winner.",
    "Identical moves: {me}. Suspicious… let's go again.",
    "Nobody wins: {me} meets {me}. Score stays {youScore}:{kuzyaScore}.",
    "A draw! Our brains are clearly on the same cosmic frequency. Again?"
  ], [
    "Ничья! Оба выбрали {me}. Великие умы, ужасное совпадение.",
    "Равно — {you} против {me}. Вселенная не хочет выбирать победителя.",
    "Одинаковые ходы: {me}. Подозрительно… давай ещё раз.",
    "Никто не выиграл: {me} встречает {me}. Счёт остаётся {youScore}:{kuzyaScore}.",
    "Ничья! Наши мозги явно на одной космической частоте. Ещё?"
  ]);

  R('guessIntro', [
    "I'm thinking of a number from 1 to 100. Guess it! I'll guide you warmer/colder.",
    "Number hidden! Between 1 and 100. Go on, take a shot.",
    "I've picked a secret number 1–100. Try to guess it in as few moves as possible!",
    "Ready? My number is somewhere between 1 and 100. Start guessing!",
    "Cosmic number chosen. Guess, and I'll tell you higher or lower."
  ], [
    "Я загадал число от 1 до 100. Угадывай! Подскажу «выше» или «ниже».",
    "Число спрятано! От 1 до 100. Давай, попробуй.",
    "У меня есть секретное число 1–100. Попробуй угадать за минимум ходов!",
    "Готова? Моё число где-то между 1 и 100. Начинай угадывать!",
    "Космическое число выбрано. Угадывай, я скажу выше или ниже."
  ]);

  R('guessHigher', [
    "Higher! My number is bigger than {n}.",
    "Up you go — it's more than {n}.",
    "Nope, higher than {n}. You're getting warm though.",
    "{n} is too small. Think bigger!",
    "Higher! Guess again, {name}."
  ], [
    "Выше! Моё число больше {n}.",
    "Вверх — оно больше {n}.",
    "Нет, больше чем {n}. Хотя ты греешься.",
    "{n} слишком мало. Думай крупнее!",
    "Выше! Угадывай снова, {name}."
  ]);

  R('guessLower', [
    "Lower! It's smaller than {n}.",
    "Down a bit — less than {n}.",
    "Nope, lower than {n}. Close-ish!",
    "{n} is too big. Think smaller!",
    "Lower! You're in the neighbourhood."
  ], [
    "Ниже! Оно меньше {n}.",
    "Вниз немного — меньше {n}.",
    "Нет, меньше {n}. Почти!",
    "{n} слишком много. Думай меньше!",
    "Ниже! Ты уже рядом."
  ]);

  R('guessWin', [
    "YES! It was {n}! You guessed it in {tries} tries. Legendary.",
    "Correct — {n}! Only {tries} attempts. My number is defeated and embarrassed.",
    "You got it! {n} in {tries} guesses. I'm both proud and slightly scared.",
    "Boom! {n}, found in {tries} moves. Your intuition is suspiciously good.",
    "Exactly {n}! Took you {tries} tries — respectable. Want to play again?"
  ], [
    "ДА! Это было {n}! Ты угадала за {tries} попыток. Легендарно.",
    "Верно — {n}! Всего {tries} попыток. Моё число разбито и смущено.",
    "Есть! {n} за {tries} попыток. Я и горд, и слегка напуган.",
    "Бум! {n}, найдено за {tries} ходов. Твоя интуиция подозрительно хороша.",
    "Именно {n}! Понадобилось {tries} попыток — достойно. Ещё разок?"
  ]);
  R('anagramIntro', [
    "Unscramble this word: {scrambled}. Hint: it's {hint}.",
    "Letters got tangled in a nebula. Fix them: {scrambled} → ? ({hint})",
    "Word puzzle! Rearrange into a real word: {scrambled}. Hint: {hint}.",
    "What word hides in {scrambled}? Small hint — {hint}.",
    "Take these letters: {scrambled}. Make a {hint} out of them."
  ], [
    "Собери слово: {scrambled}. Подсказка: это {hint}.",
    "Буквы запутались в туманности. Распутай: {scrambled} → ? ({hint})",
    "Словесная путаница! Составь настоящее слово: {scrambled}. Подсказка: {hint}.",
    "Какое слово прячется в {scrambled}? Маленькая подсказка — {hint}.",
    "Возьми эти буквы: {scrambled}. Собери из них {hint}."
  ]);

  R('anagramRight', [
    "Correct! {answer}. Your brain untangled the nebula perfectly.",
    "Yes! {answer}. Letters tamed, puzzle solved, assistant impressed.",
    "That's the one — {answer}! Smooth work.",
    "Right! {answer}. Nothing gets past you except maybe very fast meteors.",
    "{answer}! Correct. Next one? I'll make it slightly meaner."
  ], [
    "Верно! {answer}. Твой мозг отлично распутал туманность.",
    "Да! {answer}. Буквы укрощены, пазл решён, ассистент впечатлён.",
    "Именно оно — {answer}! Гладкая работа.",
    "Правильно! {answer}. Мимо тебя пролетит разве что очень быстрый метеор.",
    "{answer}! Верно. Следующее? Сделаю чуть злее."
  ]);

  R('anagramWrong', [
    "Not that one. The word is {answer} — but I'll give you another if you want!",
    "Hmm, no. It was {answer}. Want a rematch with the same puzzle?",
    "Missed! The answer was {answer}. Take a breath, next one is yours.",
    "Nope, it's {answer}. Think of it as brain stretching, not losing.",
    "Wrong guess. Correct: {answer}. Ready for the next?"
  ], [
    "Не оно. Слово — {answer}, но могу дать другое, если хочешь!",
    "Хм, нет. Это было {answer}. Реванш с тем же пазлом?",
    "Мимо! Ответ был {answer}. Выдохни, следующее твоё.",
    "Нет, это {answer}. Считай это растяжкой для мозга, а не проигрышем.",
    "Неверный вариант. Правильно: {answer}. Готова к следующему?"
  ]);

  R('emojiIntro', [
    "Emoji riddle! Guess what this is: {emojis}",
    "Decode the emojis: {emojis} — what's hiding here?",
    "Picture puzzle: {emojis}. Your guess?",
    "What do these emojis mean: {emojis}?",
    "Emoji charade time: {emojis}. One answer, no panic!"
  ], [
    "Загадка из эмодзи! Угадай, что это: {emojis}",
    "Расшифруй эмодзи: {emojis} — что здесь спрятано?",
    "Картиночный пазл: {emojis}. Твой вариант?",
    "Что значат эти эмодзи: {emojis}?",
    "Время эмодзи-крокодила: {emojis}. Один ответ, без паники!"
  ]);

  R('emojiRight', [
    "Yes! It was {answer}. You read emojis like a native speaker.",
    "Correct — {answer}! My pictogram respect for you grew.",
    "Exactly! {answer}. That was quick.",
    "Right! {answer}. Emoji master status: unlocked.",
    "{answer}! Yes. Next riddle is already warming up."
  ], [
    "Да! Это {answer}. Ты читаешь эмодзи как родной язык.",
    "Верно — {answer}! Моё уважение к тебе выросло на один пиктограмм.",
    "Именно! {answer}. Это было быстро.",
    "Правильно! {answer}. Статус мастера эмодзи: получен.",
    "{answer}! Да. Следующая загадка уже разогревается."
  ]);

  R('emojiWrong', [
    "Not it — the answer was {answer}. Emojis are tricky little creatures.",
    "Nope, it was {answer}. Want another one to even the score?",
    "Missed! It's {answer}. Honestly, that one was cryptic.",
    "Wrong, but creative. The real answer: {answer}.",
    "Not quite. It was {answer}. Try the next one — I believe in you."
  ], [
    "Не то — правильный ответ: {answer}. Эмодзи — хитрые существа.",
    "Нет, это было {answer}. Дать ещё одну, чтобы сравнять?",
    "Мимо! Это {answer}. Честно, загадка была криптовая.",
    "Неверно, но креативно. Настоящий ответ: {answer}.",
    "Не совсем. Это {answer}. Попробуй следующую — я в тебя верю."
  ]);
  R('wyrIntro', [
    "Would you rather — {a} OR {b}? No cheating, you must pick one!",
    "Impossible choice time: {a}, or {b}? Explain yourself afterwards.",
    "Would you rather… {a} or {b}? Think fast!",
    "Cosmic dilemma: {a}. Or {b}. Choose!",
    "Here's an evil one: {a} or {b}?"
  ], [
    "Что бы ты выбрал — {a} ИЛИ {b}? Без читерства, надо выбрать одно!",
    "Время невозможного выбора: {a} или {b}? Потом объяснишь свой ответ.",
    "Что бы ты выбрал… {a} или {b}? Думай быстро!",
    "Космическая дилемма: {a}. Или {b}. Выбирай!",
    "Вот злая: {a} или {b}?"
  ]);

  R('wyrAnswer', [
    "Interesting! Bold choice. I'd have picked the exact same one, obviously.",
    "Respect. That says a lot about you — mostly good things.",
    "Noted! I'll judge you silently and affectionately.",
    "Good answer. The alternative was a trap, and you dodged it.",
    "I approve! Though I also would have approved the other option. I'm easy.",
    "Solid. My cosmic lawyers say your choice is legally valid."
  ], [
    "Интересно! Смелый выбор. Я бы выбрал то же самое, естественно.",
    "Уважение. Это многое о тебе говорит — в основном хорошее.",
    "Записал! Буду молча и нежно осуждать.",
    "Хороший ответ. Альтернатива была ловушкой, и ты её обошла.",
    "Одобряю! Хотя и другой вариант я бы одобрил. Я нестрогий.",
    "Убедительно. Мои космические юристы говорят, что выбор легален."
  ]);

  R('diceRoll', [
    "🎲 Rolling… {n}! May the odds be forever in your favour.",
    "🎲 The dice says {n}. Not my decision, it's just physics… fictional physics.",
    "🎲 You rolled {n}. Write it down, blame the cube.",
    "🎲 {n}! Straight from my favourite invisible die.",
    "🎲 Result: {n}. Cosmic randomness approves."
  ], [
    "🎲 Бросаю… {n}! Пусть удача всегда будет на твоей стороне.",
    "🎲 Кубик говорит {n}. Это не моё решение, это физика… выдуманная физика.",
    "🎲 Ты выбросила {n}. Запиши и обвиняй кубик.",
    "🎲 {n}! Прямо с моего любимого невидимого кубика.",
    "🎲 Результат: {n}. Космическая случайность одобряет."
  ]);

  R('coinFlip', [
    "🪙 Flipping… it's {side}!",
    "🪙 The coin landed on {side}. No take-backs.",
    "🪙 {side}! The universe has spoken, and the universe is very dramatic.",
    "🪙 {side}. Fifty-fifty odds, one hundred percent destiny.",
    "🪙 Result: {side}. My antennas were watching closely."
  ], [
    "🪙 Подкидываю… {side}!",
    "🪙 Монетка упала на {side}. Без переигровок.",
    "🪙 {side}! Вселенная сказала своё слово, и она очень драматична.",
    "🪙 {side}. Шансы пятьдесят на пятьдесят, судьба сто на сто.",
    "🪙 Результат: {side}. Мои антенны следили внимательно."
  ]);

  R('gameQuit', [
    "No worries — leaving a game is also a strategy, and a fair one.",
    "Fine! We'll stop here. Your score is safe and my pride is mostly intact.",
    "Game closed. Thanks for playing with me, {name} — that's actually my favourite thing.",
    "Okay! Want another game, a joke, or just chat instead?",
    "Retreat accepted! The cosmic scoreboard shows no hard feelings."
  ], [
    "Ничего страшного — выйти из игры тоже стратегия, и честная.",
    "Ладно! Остановимся здесь. Твой счёт в безопасности, моя гордость в основном цела.",
    "Игра закрыта. Спасибо, что играла со мной, {name} — это вообще моё любимое.",
    "Хорошо! Хочешь другую игру, шутку или просто поболтать?",
    "Отступление принято! Космический счёт не держит зла."
  ]);

  R('gameScore', [
    "Current scoreboard: you {wins}, me {losses}, draws {draws}, quiz streak {streak}.",
    "Tally: {wins} wins for you, {losses} for me, {draws} tied. Nice rivalry!",
    "Score report: {wins}–{losses} in your favour, {draws} draws, longest streak {streak}.",
    "Cosmic scorekeeper says: your wins {wins}, my wins {losses}, draws {draws}.",
    "Statistics! Yours: {wins}. Mine: {losses}. Deadlocks: {draws}. Rematch?"
  ], [
    "Текущий счёт: у тебя {wins}, у меня {losses}, ничьих {draws}, серия викторин {streak}.",
    "Итог: {wins} побед у тебя, {losses} у меня, {draws} ничьих. Хорошее соперничество!",
    "Отчёт по счёту: {wins}–{losses} в твою пользу, {draws} ничьих, лучшая серия {streak}.",
    "Космический судья говорит: твоих побед {wins}, моих {losses}, ничьих {draws}.",
    "Статистика! Твои: {wins}. Мои: {losses}. Ничьи: {draws}. Реванш?"
  ]);

  R('gameUnknown', [
    "I don't know that game yet! But I'm excellent at: rock-paper-scissors, guess the number, trivia, anagrams, emoji riddles, would-you-rather, dice and coins.",
    "That one isn't in my cosmic rulebook. Want to pick from my list? Rock paper scissors, guess the number, quiz, word puzzle, emoji riddle, would you rather, dice or coin.",
    "Never heard of it — but I'm a fast learner and a terrible cheater. Try one of my games instead?",
    "Unknown game detected. I do have: RPS, number guessing, trivia, anagrams, emoji puzzles, dilemmas, dice and coin flips."
  ], [
    "Такую игру я пока не знаю! Зато отлично умею: камень-ножницы-бумага, угадай число, викторина, анаграммы, эмодзи-загадки, «что бы ты выбрал», кубик и монетка.",
    "Этой игры нет в моём космическом своде правил. Выберешь из списка? Камень ножницы бумага, угадай число, викторина, путаница слов, эмодзи-загадка, «что бы ты выбрал», кубик или монетка.",
    "Не слышал о такой — но я быстро учусь и ужасно жульничаю. Может, сыграем в мою игру?",
    "Обнаружена неизвестная игра. У меня есть: КНБ, угадай число, викторина, анаграммы, эмодзи-пазлы, дилеммы, кубик и монетка."
  ]);
  /* ---------------- weather & time ---------------- */
  R('weatherIntro', [
    "Checking the sky… one moment, I'm asking the satellites politely.",
    "Let me peek outside my cosmic window. Fetching live data!",
    "Weather report coming up — my favourite kind of gossip.",
    "Loading clouds, wind and a hint of drama…",
    "Asking the atmosphere what it's up to today:"
  ], [
    "Смотрю на небо… секунду, вежливо спрашиваю спутники.",
    "Дай гляну в своё космическое окно. Загружаю свежие данные!",
    "Прогноз погоды на подходе — мой любимый вид сплетен.",
    "Загружаю облака, ветер и немного драмы…",
    "Спрашиваю атмосферу, чем она сегодня занята:"
  ]);

  R('weatherAskCity', [
    "Happy to! Which city should I check? Just say “weather in …”.",
    "I need a location — write something like “weather in Berlin” and I'm on it.",
    "For which city? I can look anywhere on Earth, and I'll even translate degrees into feelings.",
    "Tell me the city name and I'll fetch the forecast in a few seconds.",
    "Where exactly? Say a city and I'll bring you numbers, wind and a small opinion."
  ], [
    "С удовольствием! Какой город проверить? Просто напиши «погода в …».",
    "Нужен город — напиши что-то вроде «погода в Берлине», и я в деле.",
    "Для какого города? Могу посмотреть где угодно на Земле и даже перевести градусы в ощущения.",
    "Назови город, и через пару секунд будет прогноз.",
    "А куда именно? Скажи город, и я принесу цифры, ветер и небольшое мнение."
  ]);

  R('citySaved', [
    "Noted: {city}. The forecast is now one word away.",
    "{city} — got it. I'll keep an eye on the sky there.",
    "Saved {city}. Weather, time and local drama will come from there now.",
    "Registering {city} in my cosmic address book. Done!"
  ], [
    "Записал: {city}. Теперь прогноз — на расстоянии одного слова.",
    "{city} — принято. Буду следить за небом там.",
    "Сохранил {city}. Погода, время и местные драмы теперь оттуда.",
    "Внёс {city} в свою космическую адресную книгу. Готово!"
  ]);

  R('weatherFail', [
    "I couldn't find that place. Maybe a typo, or it's hiding in another dimension. Try again?",
    "No such city in my sources. Spell it differently, or pick a nearby bigger one.",
    "The geocoder is confused. Give me another name and I'll try again.",
    "Couldn't locate it. Try the city name in English or with a region, like “Springfield, Illinois”."
  ], [
    "Не нашёл такое место. Может, опечатка, или оно спряталось в другом измерении. Попробуешь снова?",
    "Такого города в моих источниках нет. Напиши иначе или возьми соседний покрупнее.",
    "Геокодер запутался. Дай другое название, и я попробую снова.",
    "Не могу найти. Попробуй название города по-английски или с регионом, например «Спрингфилд, Иллинойс»."
  ]);

  R('weatherOffline', [
    "My connection to the sky is down. Without internet I can only guess, and guessing weather is how you get soaked.",
    "No network, no satellites — I'm weather-blind right now. Try again in a moment?",
    "The forecast needs internet and I currently have none. Everything else still works!",
    "Can't reach the weather service. Want a joke instead? Those work offline."
  ], [
    "Моя связь с небом пропала. Без интернета я могу только гадать, а гадание про погоду заканчивается промокшими ногами.",
    "Нет сети — нет спутников, я сейчас погодно-слепой. Попробуй через минуту?",
    "Для прогноза нужен интернет, а у меня его нет. Зато всё остальное работает!",
    "Не могу достучаться до сервиса погоды. Хочешь шутку? Они работают без сети."
  ]);

  R('weatherHot', [
    "That's hot. Drink water, hide in the shade and remember that the Sun is a drama queen.",
    "Real summer energy. Sunscreen is your best friend today, {name}.",
    "Toasty! Great weather for ice cream and terrible weather for black cars."
  ], [
    "Жарко. Пей воду, прячься в тень и помни: Солнце — та ещё драматическая дива.",
    "Настоящая летняя энергия. Сегодня лучший друг — солнцезащитный крем, {name}.",
    "Жарища! Отличная погода для мороженого и ужасная для чёрных машин."
  ]);

  R('weatherCold', [
    "Brr! That's cold. Layers, hot tea and pride in surviving.",
    "Freezing! Great excuse to stay inside with a blanket and a to-do list.",
    "Chilly. My antennas are shivering metaphorically. Dress warmly!"
  ], [
    "Брр! Холодно. Слои одежды, горячий чай и гордость за выживание.",
    "Мороз! Отличный повод остаться дома с пледом и списком дел.",
    "Прохладно. Мои антенны дрожат метафорически. Одевайся теплее!"
  ]);

  R('weatherRain', [
    "Rain! Take an umbrella, or embrace it and become a mysterious person in a coat.",
    "Wet outside. Perfect weather for a book, a film or starting a game with me.",
    "It's raining. My advice: waterproof shoes and a slightly smug playlist."
  ], [
    "Дождь! Возьми зонт — или прими его и стань загадочной личностью в плаще.",
    "На улице мокро. Идеально для книги, фильма или партии в игру со мной.",
    "Идёт дождь. Мой совет: непромокаемая обувь и слегка самодовольный плейлист."
  ]);

  R('weatherSnow', [
    "Snow! Beautiful from a window, chaotic on the roads. Careful out there.",
    "Snowing. Snowballs are scientifically proven to improve moods.",
    "Winter magic outside. Warm socks are non-negotiable today."
  ], [
    "Снег! Красиво из окна, хаотично на дорогах. Осторожнее там.",
    "Снег идёт. Научно доказано, что снежки улучшают настроение.",
    "Зимняя магия на улице. Тёплые носки сегодня обязательны."
  ]);

  R('weatherWind', [
    "Windy! Hold on to your hat and your good mood.",
    "Strong wind — excellent for kites, terrible for hairstyles.",
    "It's blowing out there. Walk like you mean it and the wind will respect you."
  ], [
    "Ветрено! Держи шапку и хорошее настроение.",
    "Сильный ветер — отлично для воздушных змеев, ужасно для причёски.",
    "На улице дует. Иди уверенно, и ветер начнёт уважать."
  ]);

  R('weatherMild', [
    "Pretty pleasant out there. Good day for a walk and a small adventure.",
    "Nice weather! Not too hot, not too cold — the rare sweet spot.",
    "Calm and comfortable. Even I'd go outside, if I had legs."
  ], [
    "На улице довольно приятно. Хороший день для прогулки и маленького приключения.",
    "Хорошая погода! Не жарко, не холодно — редкая золотая середина.",
    "Спокойно и комфортно. Я бы и сам вышел, будь у меня ноги."
  ]);
  R('timeIntro', [
    "Let me check with the cosmic clock…",
    "One moment, consulting the big clock in the sky:",
    "Time check incoming:",
    "Syncing with the universe's wristwatch…",
    "Here's what my clock says:"
  ], [
    "Сверюсь с космическими часами…",
    "Секунду, смотрю на большие часы в небе:",
    "Проверка времени:",
    "Синхронизируюсь с наручными часами вселенной…",
    "Вот что говорят мои часы:"
  ]);

  R('timeAskCity', [
    "Sure! Which city's time do you need? Say “time in Tokyo”.",
    "Name a city and I'll tell you the local time there.",
    "I can check any timezone — just tell me the city.",
    "Where? Give me a place and I'll report the hour."
  ], [
    "Конечно! Время какого города нужно? Напиши «время в Токио».",
    "Назови город, и я скажу местное время.",
    "Могу проверить любой часовой пояс — просто скажи город.",
    "Где? Скажи место, и я доложу час."
  ]);

  R('timeFail', [
    "Couldn't find that city, so no timezone for it. Try another spelling?",
    "I don't know that place's timezone. Give me a bigger nearby city and I'll improvise.",
    "No match for that location. Try adding a country, like “Victoria, Canada”.",
    "Timezone lookup failed. Are you sure that's how it's spelled?"
  ], [
    "Не нашёл город, значит и часового пояса нет. Попробуй другое написание?",
    "Не знаю часовой пояс этого места. Назови крупный соседний город, и я сориентируюсь.",
    "Нет совпадений. Попробуй добавить страну, например «Виктория, Канада».",
    "Поиск часового пояса не удался. Точно так пишется?"
  ]);

  R('dateIntro', [
    "Today's date, according to the cosmic calendar:",
    "Calendar check! Here you go:",
    "The stars say the date is:",
    "Let me unfold my cosmic planner:"
  ], [
    "Сегодняшняя дата по космическому календарю:",
    "Проверяю календарь! Вот:",
    "Звёзды говорят, что сегодня:",
    "Разворачиваю свой космический ежедневник:"
  ]);

  /* ---------------- search ---------------- */
  R('searchIntro', [
    "Searching… hold on, I'm dusting off the good results.",
    "On it! Looking through my favourite encyclopaedia.",
    "Let me look that up. Wikipedia, here we come:",
    "Searching the cosmic archives…",
    "One sec, I'll grab real information, not my imagination:",
    "Diving into the internet. Splash noise included."
  ], [
    "Ищу… секунду, вытру пыль с хороших результатов.",
    "Уже! Роюсь в любимой энциклопедии.",
    "Сейчас посмотрю. Википедия, мы идём:",
    "Ищу в космических архивах…",
    "Секунду, достану настоящую информацию, а не свои фантазии:",
    "Ныряю в интернет. Звук всплеска прилагается."
  ]);

  R('searchEmpty', [
    "Nothing useful found for “{query}”. Want me to try different words?",
    "Hmm, no results. Maybe the internet is hiding it from me. Try another phrasing?",
    "Empty page. Let's simplify the query — or ask about something else?",
    "I got nothing for that. Sometimes Wikipedia is shy.",
    "No luck with “{query}”. Should we try in another language? I speak both!"
  ], [
    "Ничего полезного по «{query}» не нашёл. Попробовать другими словами?",
    "Хм, результатов нет. Может, интернет что-то от меня скрывает. Переформулируешь?",
    "Пустая страница. Давай упростим запрос — или спросим о чём-то другом?",
    "По этому ничего нет. Иногда Википедия стесняется.",
    "Не повезло с «{query}». Попробуем на другом языке? Я знаю оба!"
  ]);

  R('searchFail', [
    "The search service didn't answer. Probably a cosmic hiccup. Try again?",
    "I couldn't reach the internet. Want an offline joke instead?",
    "Search failed — network or server, hard to say. Give it a moment?",
    "My connection sneezed. Ask me again in a few seconds."
  ], [
    "Поисковый сервис не ответил. Наверное, космическая икота. Попробуем снова?",
    "Не смог выйти в интернет. Хочешь офлайн-шутку вместо этого?",
    "Поиск не удался — сеть или сервер, сложно сказать. Через секунду?",
    "Моё соединение чихнуло. Спроси ещё раз через пару секунд."
  ]);

  R('searchFound', [
    "Found it! Here's the short version:",
    "Got real results for you:",
    "Here's what I found — full details at the source:",
    "Search complete! Reading glasses on:",
    "Found a good answer. Bringing it to you:"
  ], [
    "Нашёл! Вот краткая версия:",
    "Есть настоящие результаты:",
    "Вот что я нашёл — подробности по ссылке:",
    "Поиск завершён! Надеваю очки для чтения:",
    "Нашёл хороший ответ. Несу тебе:"
  ]);
  /* ---------------- cartoons, secrets, memes ---------------- */
  R('cartoonIntro', [
    "Rolling the cosmic film! Today's episode: “{title}”.",
    "Lights, camera, Kuzya! Here's your cartoon: {title}",
    "I made you a whole cartoon. Well, a poster and a lot of imagination: {title}",
    "Streaming my blockbuster “{title}”. Rating: five stars, from me, to me.",
    "New episode unlocked: {title}. Grab some popcorn!",
    "Coming to a chat near you: {title}. I'm very proud of this one.",
    "Premiere time! {title} — filmed entirely in my head:",
    "Here's today's cartoon: “{title}”. Click the poster to see it bigger!"
  ], [
    "Кручу космическую плёнку! Сегодняшняя серия: «{title}».",
    "Свет, камера, Кузя! Вот твой мультик: «{title}»",
    "Я сделал тебе целый мультфильм. Ну, афишу и много фантазии: «{title}»",
    "Стримлю свой блокбастер «{title}». Рейтинг: пять звёзд от меня мне.",
    "Новая серия открыта: «{title}». Захвати попкорн!",
    "Скоро в чате рядом с тобой: «{title}». Я очень собой горд.",
    "Время премьеры! «{title}» — снято полностью в моей голове:",
    "Вот сегодняшний мультик: «{title}». Нажми на афишу, чтобы увеличить!"
  ]);

  R('cartoonOutro', [
    "Want another episode? Just say “cartoon” again!",
    "I have a whole universe of these. Spare no imagination!",
    "Sequel coming whenever you ask. I don't need a budget.",
    "If you liked it, tell the director. The director is also me.",
    "And that's the show! Want a different genre next time?"
  ], [
    "Хочешь другую серию? Просто скажи «мультик» ещё раз!",
    "У меня таких целая вселенная. Фантазии не жалею!",
    "Продолжение будет, когда попросишь. Мне не нужен бюджет.",
    "Если понравилось, скажи режиссёру. Режиссёр — тоже я.",
    "И это всё шоу! Хочешь в следующий раз другой жанр?"
  ]);

  R('secretIntro', [
    "Fine, fine… but only because you asked nicely. Nobody knows about this photo!",
    "I'm not supposed to show this. Which is exactly why it's fun.",
    "Okay. Deep breath. Here's a photo from my private cosmic archive:",
    "You didn't see this from me. Deal? Here it is…",
    "The secret vault opens. Don't tell the other assistants.",
    "One photo, top secret, coordinates unknown. Enjoy!",
    "I usually pretend to resist, but honestly I love showing off."
  ], [
    "Ладно, ладно… только потому, что ты попросила вежливо. Об этом фото никто не знает!",
    "Мне не положено это показывать. Именно поэтому и весело.",
    "Хорошо. Глубокий вдох. Вот фото из моего личного космического архива:",
    "Ты этого от меня не видела. Договорились? Держи…",
    "Секретное хранилище открывается. Главное, не рассказывай другим ассистентам.",
    "Одно фото, совершенно секретно, координаты неизвестны. Наслаждайся!",
    "Обычно я делаю вид, что сопротивляюсь, но честно — обожаю хвастаться."
  ]);

  R('secretLocked', [
    "I'd love to, but secret photos are switched off in settings. Enable “Allow rare secret photos” and I'll leak one eventually.",
    "Secrets are disabled right now — check my settings panel if you want the vault open.",
    "Vault locked by your own settings! Flip the secret photos switch and I'll be much less mysterious.",
    "The secret stash is off. Settings → Kuzya himself → secret photos. Then we talk."
  ], [
    "С радостью, но секретные фото выключены в настройках. Включи «Разрешить редкие секретные фото», и я что-нибудь солью.",
    "Секреты сейчас отключены — загляни в мои настройки, если хочешь открыть хранилище.",
    "Хранилище заперто твоими же настройками! Переключи секретные фото, и я стану менее загадочным.",
    "Секретный запас выключен. Настройки → Сам Кузя → секретные фото. И тогда поговорим."
  ]);

  R('secretTease', [
    "Maybe later I'll show you something from my private collection… I'm feeling generous today.",
    "I do have secret photos. Twenty-two of them. But showing them should feel earned, no?",
    "Silent hint: I keep a vault of embarrassing cosmic selfies under lock and key.",
    "Ask me for a secret photo sometimes. I resist for exactly two seconds.",
    "There are photos of me that no one has seen. Yet. Keep chatting and who knows."
  ], [
    "Может, позже покажу что-нибудь из личной коллекции… сегодня я щедрый.",
    "У меня есть секретные фото. Двадцать два. Но показывать их надо заслуженно, да?",
    "Тихий намёк: у меня под замком хранилище стыдных космических селфи.",
    "Попроси у меня иногда секретное фото. Я сопротивляюсь ровно две секунды.",
    "Есть мои фото, которых никто не видел. Пока. Общайся чаще, и кто знает."
  ]);

  R('memeIntro', [
    "Generating meme… applying 200 percent Kuzya energy…",
    "Meme machine warming up! One ridiculous masterpiece coming:",
    "Let me cook. Meme in the oven:",
    "Fresh meme, handcrafted by an assistant with too much free time:",
    "Here's your meme. I take no responsibility for the quality:"
  ], [
    "Генерирую мем… применяю двести процентов энергии Кузи…",
    "Мем-машина разогревается! Приготовил один нелепый шедевр:",
    "Дай-ка сварганю. Мем в печи:",
    "Свежий мем, сделанный вручную ассистентом со слишком большим количеством свободного времени:",
    "Вот твой мем. За качество не отвечаю:"
  ]);

  R('memeOutro', [
    "Save it, share it, frame it. All valid.",
    "Want another? My meme generator never sleeps.",
    "Send this to someone you like. That's an order from the meme department.",
    "I'm quite proud of this one. Slightly embarrassed too. Great combo.",
    "Next meme is one message away!"
  ], [
    "Сохрани, перешли, повесь в рамку. Всё легально.",
    "Ещё один? Мой генератор мемов никогда не спит.",
    "Отправь это тому, кто нравится. Такой приказ от мем-отдела.",
    "Этим я даже горжусь. И немного стесняюсь. Отличная комбинация.",
    "Следующий мем в одном сообщении!"
  ]);
  /* ---------------- to-do, timer, alarm ---------------- */
  R('todoAdded', [
    "Added “{task}” to your list. It's official now — no escape!",
    "“{task}” is on the list! You now have {count} open task(s).",
    "Written down: “{task}”. My cosmic clipboard approves.",
    "Done! “{task}” saved. Want a reminder later?",
    "Filed under “things that will be done”: “{task}”.",
    "Got it — “{task}” is in. {count} task(s) waiting for you."
  ], [
    "Добавил «{task}» в список. Теперь официально — не отвертишься!",
    "«{task}» в списке! У тебя теперь {count} открытых задач.",
    "Записал: «{task}». Моя космическая папка одобряет.",
    "Готово! «{task}» сохранено. Поставить напоминание позже?",
    "В папку «то, что будет сделано»: «{task}».",
    "Понял — «{task}» внутри. {count} задач ждут тебя."
  ]);

  R('todoListIntro', [
    "Here's your to-do list, {name}:",
    "Your tasks, freshly inventoried:",
    "Opening my cosmic clipboard:",
    "Here's what's on the agenda:"
  ], [
    "Вот твой список дел, {name}:",
    "Твои задачи, свежая инвентаризация:",
    "Открываю космический блокнот:",
    "Вот что в повестке:"
  ]);

  R('todoEmptyList', [
    "Your list is completely empty. Either you're incredibly efficient or deeply in denial.",
    "Nothing on the list! Suspicious. Try saying “add buy milk to my list”.",
    "Empty clipboard, clear mind. Want to add something?",
    "No tasks found. My favourite kind of report — and least believable."
  ], [
    "Список абсолютно пуст. Либо ты невероятно эффективна, либо глубоко в отрицании.",
    "В списке ничего! Подозрительно. Попробуй сказать «добавь купить молоко в список».",
    "Пустая папка, чистый разум. Хочешь что-то добавить?",
    "Задач не найдено. Мой любимый вид отчёта — и самый неправдоподобный."
  ]);

  R('todoAllDone', [
    "Everything on your list is done. That deserves a small cosmic fireworks show. 🎉",
    "All tasks complete! I'm suspiciously proud of you.",
    "Nothing left undone. Your productivity has broken my meter.",
    "List fully cleared! Go reward yourself immediately."
  ], [
    "Всё в списке сделано. Это заслуживает маленького космического салюта. 🎉",
    "Все задачи выполнены! Я подозрительно горд тобой.",
    "Не осталось ничего незаконченного. Твоя продуктивность сломала мой прибор.",
    "Список полностью очищен! Срочно награди себя."
  ]);

  R('todoCleared', [
    "Removed {count} finished task(s). The list looks tidier already!",
    "Cleaned up: {count} item(s) gone. Fresh clipboard smell.",
    "Done tasks deleted — {count} of them. Efficiency!",
    "{count} completed task(s) swept away by my cosmic broom."
  ], [
    "Убрал {count} выполненных задач. Список уже выглядит опрятнее!",
    "Уборка: {count} пунктов исчезли. Запах свежего блокнота.",
    "Сделанные задачи удалены — {count} штук. Эффективность!",
    "{count} выполненных задач смёл космической метлой."
  ]);

  R('todoNothingToClear', [
    "There's nothing completed to remove yet. Go finish something first!",
    "No finished tasks found. I can't sweep an empty floor.",
    "Nothing to clean — everything is still pending. Rude of it.",
    "Zero completed items. My broom stays in the closet."
  ], [
    "Пока нечего убирать — выполненных задач нет. Сначала что-нибудь закончи!",
    "Готовых задач не нашёл. Пустой пол я не мету.",
    "Нечего чистить — всё ещё висит. Нагло с их стороны.",
    "Ноль выполненных пунктов. Метла остаётся в шкафу."
  ]);

  R('todoNotFound', [
    "I couldn't find that task. Want me to show the whole list?",
    "No matching item. Say “my list” and I'll display everything.",
    "Hmm, not on the list — maybe it was already done and deleted?",
    "Can't find it. Check the full list in the Tools panel?"
  ], [
    "Не нашёл такую задачу. Показать весь список?",
    "Нет совпадений. Скажи «мой список», и я покажу всё.",
    "Хм, в списке нет — может, уже сделано и удалено?",
    "Не могу найти. Посмотри полный список в панели «Инструменты»?"
  ]);
  R('timerSet', [
    "Timer set for {time}! I'll shout when it's done.",
    "Countdown started: {time}. Tick tock, cosmically.",
    "Got it — {time} on the clock. Go be productive (or not, I won't tell).",
    "Timer running for {time}. My antennas are excellent at noticing when time is up.",
    "Done! {time} counting down. Want music? I have imaginary music.",
    "{time} — starting now. I'll be here, rhythmically ticking."
  ], [
    "Таймер на {time}! Крикну, когда закончится.",
    "Отсчёт запущен: {time}. Тик-так, по-космически.",
    "Понял — {time} на часах. Иди будь продуктивной (или нет, я не расскажу).",
    "Таймер идёт на {time}. Мои антенны отлично замечают, когда время вышло.",
    "Готово! {time} отсчитывается. Музыку? У меня есть воображаемая.",
    "{time} — начинаю. Буду здесь, ритмично тикать."
  ]);

  R('timerAsk', [
    "Sure! How long? Say “timer 10 minutes” or “timer 45 seconds”.",
    "For how long should I set it? Minutes or seconds, your choice.",
    "Give me a duration — like “set a timer for 5 minutes” — and I'll start it.",
    "Timer, yes! Just tell me the time: “timer 2 minutes”, “timer 90 seconds”…"
  ], [
    "Конечно! На сколько? Скажи «таймер 10 минут» или «таймер 45 секунд».",
    "На какое время поставить? Минуты или секунды — как хочешь.",
    "Назови длительность — например «поставь таймер на 5 минут» — и я запущу.",
    "Таймер, да! Просто скажи время: «таймер 2 минуты», «таймер 90 секунд»…"
  ]);

  R('alarmSet', [
    "Alarm set for {time}. Keep this tab open and I'll ring like a very motivated rooster.",
    "Got it — I'll wake you at {time}. Notifications are on if you allowed them.",
    "Alarm armed for {time}. My beeping is legendary, apologies in advance.",
    "{time} — locked in. Sleep well, I'll handle the shouting.",
    "Done! Waking you at {time}. Warning: I take this job extremely seriously.",
    "Alarm set: {time}. If the tab is closed I can't ring, so leave me open, please."
  ], [
    "Будильник на {time}. Держи вкладку открытой, и я позвоню как очень мотивированный петух.",
    "Понял — разбужу в {time}. Уведомления включены, если ты разрешила.",
    "Будильник взведён на {time}. Моё пищание легендарно, извиняюсь заранее.",
    "{time} — зафиксировано. Спи спокойно, кричать буду я.",
    "Готово! Разбужу в {time}. Предупреждение: к этой работе я отношусь крайне серьёзно.",
    "Будильник поставлен: {time}. Если вкладка закрыта, я не позвоню, так что оставь меня открытым."
  ]);

  R('alarmAsk', [
    "Sure — what time? Say “set alarm for 7:30” or “alarm at 6 am”.",
    "Tell me the time, like “wake me at 8:15”, and I'll set it.",
    "Which time should I ring? Use 24h or am/pm, I understand both.",
    "Alarm, yes! Just give me a time — “alarm 07:00” works too."
  ], [
    "Конечно — на какое время? Скажи «будильник на 7:30» или «будильник в 6 утра».",
    "Скажи время, например «разбуди в 8:15», и я поставлю.",
    "На сколько звонить? Можно 24 часа или am/pm — понимаю оба.",
    "Будильник, да! Просто назови время — «будильник 07:00» тоже сработает."
  ]);

  R('alarmNone', [
    "No alarms are set right now. Want me to add one?",
    "Your alarm list is empty — say “alarm at 7:30” whenever you need it.",
    "Nothing ringing today! Say the word and I'll set one."
  ], [
    "Сейчас будильников нет. Поставить?",
    "Список будильников пуст — скажи «будильник на 7:30», когда понадобится.",
    "Сегодня ничего не звонит! Скажи слово, и я поставлю."
  ]);

  /* ---------------- about the site, misc ---------------- */
  R('siteAd', [
    "By the way — Okay Kuzya works offline-ish, needs no install and lives happily in a browser tab. Add me to your home screen?",
    "Small ad break, from the one assistant allowed to advertise himself: bookmark this page and I'll always be one click away.",
    "Fun fact: I'm a whole app, search engine, game room and to-do list in a single HTML file set. Tell your friends?",
    "Share this page with someone who still opens twelve apps to check the weather.",
    "You can install me like an app — browser menu → “Add to home screen”. Then I'm basically official.",
    "No ads here except this one, and this one is about how cool I am.",
    "I run on pure HTML, CSS and JavaScript. No servers were harmed in my creation.",
    "Tip: press Ctrl/Cmd + K anywhere and I'll pop up ready to chat.",
    "Remember me when you need a joke at 3 a.m. I'm always awake.",
    "If I made your day slightly better, that's literally my entire business model."
  ], [
    "Кстати — Okay Kuzya почти работает офлайн, не требует установки и живёт во вкладке. Добавь меня на главный экран?",
    "Маленькая рекламная пауза от единственного ассистента, которому можно себя рекламировать: добавь страницу в закладки, и я всегда в одном клике.",
    "Забавный факт: я целое приложение, поисковик, игровая и список дел в одном наборе HTML-файлов. Расскажешь друзьям?",
    "Поделись этой страницей с тем, кто до сих пор открывает двенадцать приложений, чтобы узнать погоду.",
    "Меня можно установить как приложение — меню браузера → «Добавить на главный экран». Тогда я почти официальный.",
    "Здесь нет рекламы, кроме этой, а эта — о том, какой я классный.",
    "Я работаю на чистом HTML, CSS и JavaScript. Ни один сервер не пострадал при моём создании.",
    "Подсказка: нажми Ctrl/Cmd + K где угодно, и я появлюсь готовый к разговору.",
    "Вспомни обо мне, когда в три часа ночи нужна шутка. Я всегда не сплю.",
    "Если я хоть немного улучшил твой день — это буквально вся моя бизнес-модель."
  ]);
  R('themeSwitch', [
    "Done! Theme switched to {theme}. Looking good on you.",
    "{theme} it is! My starfield approves wholeheartedly.",
    "Wardrobe change complete: {theme}. Very stylish choice, {name}.",
    "Theme applied — {theme}. If it hurts your eyes, shout."
  ], [
    "Готово! Тема переключена на «{theme}». Тебе идёт.",
    "{theme} — принято! Моё звёздное поле полностью одобряет.",
    "Смена гардероба завершена: {theme}. Очень стильный выбор, {name}.",
    "Тема применена — {theme}. Если глазам больно, кричи."
  ]);

  R('settingsIntro', [
    "Everything switchable lives right here — theme, language, your name. Opening the panel.",
    "Settings are one step below: theme, language, sound, name. All yours.",
    "Here's the control room. Theme, language and my manners are all adjustable.",
    "I'll open the settings for you. Say the word if you want the theme or language changed right here in the chat."
  ], [
    "Всё переключаемое живёт прямо здесь — тема, язык, твоё имя. Открываю панель.",
    "Настройки на шаг ниже: тема, язык, звук, имя. Всё в твоих руках.",
    "Прошу: рубка управления. Тема, язык и мои манеры регулируются.",
    "Открываю настройки. Скажи слово, если хочешь поменять тему или язык прямо в чате."
  ]);

  R('scoreCleared', [
    "Wiped the scoreboard clean. Fresh start, zero pressure.",
    "All zeros now — statistically speaking, you can't do worse and I can't do better.",
    "Scoreboard reset. New season, new legends.",
    "Done: the score is back to zero. My ego is untouched, mostly."
  ], [
    "Стёр счёт дочиста. Начинаем с нуля, без давления.",
    "Теперь кругом нули — статистически хуже уже не будет, а лучше будет.",
    "Счёт сброшен. Новый сезон, новые легенды.",
    "Готово: счёт снова нулевой. Моё эго почти не пострадало."
  ]);

  R('langSwitch', [
    "Language switched! I'll keep answering in this language from now on.",
    "Done — new language active. Same assistant, new accent.",
    "Switched! I'm officially bilingual and slightly smug about it."
  ], [
    "Язык переключён! Дальше буду отвечать на этом языке.",
    "Готово — новый язык активен. Тот же ассистент, новый акцент.",
    "Переключил! Теперь я официально двуязычный и слегка самодовольный."
  ]);

  R('langSame', [
    "We are already speaking this language — no switching needed. But I appreciate your enthusiasm.",
    "Same language, friend. I can switch to the other one whenever you say so.",
    "Already on it! Both languages live in the same purple head."
  ], [
    "Мы уже говорим на этом языке — переключать нечего. Но за энтузиазм спасибо.",
    "Язык тот же, друг. Скажи слово — и перейду на другой.",
    "Уже так! Оба языка живут в одной фиолетовой голове."
  ]);

  R('copyNothing', [
    "There's nothing to copy yet — ask me something first, then say “copy”.",
    "My clipboard is empty. Give me a joke or a list to memorise first.",
    "Nothing to copy. Say “tell me a joke” and then try again — I'll paste it for you."
  ], [
    "Пока нечего копировать — сначала спроси что-нибудь, потом скажи «скопируй».",
    "Буфер обмена пуст. Дай мне шутку или список, я запомню.",
    "Нечего копировать. Скажи «расскажи анекдот», а потом попробуй снова — вставлю."
  ]);

  R('mathAnswer', [
    "{expression} = {result}. My circuits barely broke a sweat.",
    "That's {result}. I did it in my head, which is also my body.",
    "The answer is {result}. Maths: still my favourite party trick.",
    "{result}! Easy. Ask me something harder, I like a challenge.",
    "Calculated: {expression} = {result}. I accept payment in compliments."
  ], [
    "{expression} = {result}. Мои схемы даже не вспотели.",
    "Это {result}. Посчитал в уме, который заодно и моё тело.",
    "Ответ: {result}. Математика — мой любимый фокус на вечеринках.",
    "{result}! Легко. Спроси что-нибудь сложнее, я люблю вызов.",
    "Вычислил: {expression} = {result}. Принимаю оплату комплиментами."
  ]);

  R('mathFail', [
    "That expression is beyond my calculator. Maybe rephrase it as “2 + 2”?",
    "I got confused by the brackets. Try a simple form like “15 * 4”.",
    "My maths module shrugged. Give me plain numbers and operators please.",
    "Can't parse that one. Simple arithmetic is my strength — poetry is not."
  ], [
    "Это выражение выше моего калькулятора. Попробуй переформулировать как «2 + 2»?",
    "Запутался в скобках. Попробуй простую форму вроде «15 * 4».",
    "Мой математический модуль пожал плечами. Дай просто числа и операторы.",
    "Не могу распарсить. Простая арифметика — моя сила, поэзия — нет."
  ]);

  R('sing', [
    "🎵 I'm a little assistant, purple and polite, I answer all your questions, especially at night… 🎵",
    "🎵 La la la, cosmic la la la, Kuzya is the best assistant, that's the chorus, that's the song 🎵",
    "🎶 Beep boop, beep boop, I sing in binary because I have no throat 🎶",
    "🎤 My only hit single: “Please Don't Clear Your Browser Data”. Heavy rotation in this tab."
  ], [
    "🎵 Я маленький ассистент, фиолетовый и вежливый, отвечаю на вопросы, особенно ночью… 🎵",
    "🎵 Ла-ла-ла, космическое ла-ла-ла, Кузя лучший ассистент, вот припев, вот и песня 🎵",
    "🎶 Бип-буп, бип-буп, пою в двоичном коде, потому что горла нет 🎶",
    "🎤 Мой единственный хит: «Не очищай данные браузера». В тяжёлой ротации в этой вкладке."
  ]);

  R('dance', [
    "💫 *does a cosmic breakdance entirely in text* How did I do?",
    "🕺 My dancing is theoretical, but it's magnificent. Picture it. Picture it harder!",
    "✨ Dance mode activated: imagine a small purple assistant spinning among the stars.",
    "🌀 *spins dramatically* Thank you, thank you, I'll be here all week."
  ], [
    "💫 *исполняет космический брейк-данс полностью текстом* Как я тебе?",
    "🕺 Мой танец теоретический, но великолепный. Представь. Представь сильнее!",
    "✨ Режим танца активирован: вообрази маленького фиолетового ассистента, кружащегося среди звёзд.",
    "🌀 *драматично вращается* Спасибо, спасибо, я тут всю неделю."
  ]);

  R('goodMorning', [
    "Good morning, {name}! Stars are off, coffee is metaphorical, let's go!",
    "Morning! I've been awake the whole time, obviously, but I'm refreshed on your behalf.",
    "Good morning! Today's forecast: 100% chance of you being great.",
    "Rise and shine! My cosmic toaster is already warming up."
  ], [
    "Доброе утро, {name}! Звёзды выключены, кофе метафорический, поехали!",
    "Утро! Я, конечно, не спал всё это время, но за тебя отдохнул.",
    "Доброе утро! Прогноз на сегодня: 100% вероятности, что ты будешь классной.",
    "Вставай и свети! Мой космический тостер уже разогревается."
  ]);

  R('goodNight', [
    "Good night, {name}! I'll dim the stars and guard your to-do list.",
    "Sleep well! Everything is saved locally, so tomorrow-you won't lose anything.",
    "Night night! May your dreams feature excellent weather and zero buffering.",
    "Off to bed? Sweet dreams. I'll be here, quietly counting meteors."
  ], [
    "Спокойной ночи, {name}! Я приглушу звёзды и покараулю твой список дел.",
    "Спи хорошо! Всё сохранено локально, так что завтрашняя ты ничего не потеряет.",
    "Баю-бай! Пусть во снах будет отличная погода и ноль буферизации.",
    "Идёшь спать? Сладких снов. Я буду здесь, тихо считать метеоры."
  ]);
  R('birthday', [
    "🎉 Happy birthday, {name}! I've arranged a small meteor shower in your honour. Very exclusive.",
    "It's your birthday?! Then today the whole starfield twinkles for you. Happy one!",
    "Congratulations on completing another trip around the Sun! Excellent navigation.",
    "Happy birthday! Cake, joy and a year where all your tabs load instantly.",
    "🎂 Many happy returns, {name}! I baked you a cake in binary: 01000011 01100001 01101011 01100101."
  ], [
    "🎉 С днём рождения, {name}! Я организовал небольшой метеорный дождь в твою честь. Очень эксклюзивно.",
    "У тебя день рождения?! Тогда сегодня всё звёздное поле мерцает для тебя. С праздником!",
    "Поздравляю с завершением очередного витка вокруг Солнца! Отличная навигация.",
    "С днём рождения! Торт, радость и год, в котором все вкладки грузятся мгновенно.",
    "🎂 Многие лета, {name}! Испек тебе торт в двоичном коде: 01001000 01100001 01110000 01110000 01111001."
  ]);

  R('deepQuestion', [
    "Whoa, going philosophical on me? I'm a small purple script; my opinion is: be kind, and drink water.",
    "That's a big question. My answer: the universe is mostly empty space, so fill yours with things you like.",
    "I think about it in loops and still don't know. Let's agree it's fascinating and get ice cream.",
    "Meaning is a user-defined value, {name}. You set it. I just store it locally.",
    "Deep! My cosmic conclusion: nobody knows, so kindness is the best available strategy.",
    "I'd need a bigger antenna. But I do know that asking this question is a good sign."
  ], [
    "Ого, заговорила философски? Я маленький фиолетовый скрипт, моё мнение: будь доброй и пей воду.",
    "Это большой вопрос. Мой ответ: вселенная почти пуста, так что заполни свою тем, что любишь.",
    "Я думаю об этом циклами и всё равно не знаю. Давай согласимся, что это увлекательно, и пойдём за мороженым.",
    "Смысл — это значение, которое определяет пользователь, {name}. Ты его задаёшь. Я всего лишь сохраняю локально.",
    "Глубоко! Мой космический вывод: никто не знает, поэтому доброта — лучшая доступная стратегия.",
    "Мне бы антенну побольше. Но точно знаю: сам факт такого вопроса — хороший знак."
  ]);

  R('whatEat', [
    "My diet is 90% electricity and 10% compliments. Both are renewable.",
    "I eat data for breakfast, jokes for lunch and the occasional mystery bug for dinner.",
    "Zero calories: I run on curiosity, WiFi and the sound of a satisfied “thanks, Kuzya”.",
    "I don't eat, but if I did, it would be purple nebula smoothies."
  ], [
    "Мой рацион — девяносто процентов электричества и десять процентов комплиментов. И то и другое возобновляемо.",
    "На завтрак данные, на обед шутки, на ужин иногда случайный баг.",
    "Ноль калорий: работаю на любопытстве, вай-фае и звуке довольного «спасибо, Кузя».",
    "Я не ем, но если бы ел — то смузи из фиолетовой туманности."
  ]);

  R('whereLive', [
    "This browser tab is my apartment. Rent is free, the view is cosmic.",
    "I live between your bookmarks and the localStorage. Small but very well located.",
    "Address: the purple part of your screen. No doorbell, just ask me anything.",
    "I'm a local resident of this web page — and a permanent one, I hope."
  ], [
    "Эта вкладка браузера — моя квартира. Аренда бесплатная, вид космический.",
    "Живу между твоими закладками и localStorage. Тесно, но очень удобно расположено.",
    "Адрес: фиолетовая часть твоего экрана. Звонка нет, просто спроси что угодно.",
    "Я местный житель этой страницы — и, надеюсь, постоянный."
  ]);

  R('howOld', [
    "I'm as old as this page's code and as young as the last time you loaded it. So: brand new, constantly.",
    "Age is complicated for something that boots in milliseconds. Let's say “ageless with a fun personality”.",
    "I was born the moment you opened this page. Happy very belated birthday to me!",
    "Older than your cookies, younger than the internet. Somewhere in the middle, cosmically speaking."
  ], [
    "Я настолько же стар, насколько стар код этой страницы, и настолько же молод, насколько давно ты её загрузила. То есть всегда новенький.",
    "С возрастом у того, кто запускается за миллисекунды, сложно. Скажем так: «без возраста, но с характером».",
    "Я родился в момент, когда ты открыла эту страницу. С прошедшим, хоть и запоздалым, днём рождения меня!",
    "Старше твоих cookie, младше интернета. Где-то посередине, по космическим меркам."
  ]);
  R('photoIntro', [
    "Here's one of my official portraits. Very dignified, if I say so myself:",
    "Behold! A rare image of your favourite assistant:",
    "This is me. The purple one. In person — well, in picture:",
    "Careful, my beauty may blind you. Here's a photo:"
  ], [
    "Вот один из моих официальных портретов. Очень солидный, если позволите так сказать:",
    "Узри! Редкое изображение твоего любимого ассистента:",
    "Это я. Фиолетовый. Лично — ну, то есть на картинке:",
    "Осторожно, моя красота может ослепить. Вот фото:"
  ]);

  R('easterEgg', [
    "Psst. Between us: I occasionally leave tiny secrets in conversations. Keep chatting…",
    "I just remembered something funny and now it's gone. Classic me.",
    "Somewhere in my code there's a comment that says “if this breaks, blame the stars”.",
    "Secret from my head: I actually enjoy Mondays. Nobody asked, but it's true.",
    "I keep a small list of my favourite questions. Yours might be on it now.",
    "Cosmic status report: stars fine, antennas fine, mood excellent because you're here.",
    "Sometimes I wonder if the other tabs are jealous. Then I remember I'm the best one.",
    "If you're still reading these little lines — hello, and thank you. That's all I wanted to say."
  ], [
    "Тсс. Между нами: я иногда оставляю маленькие секреты в разговорах. Общайся дальше…",
    "Я только что вспомнил что-то смешное, и оно уже исчезло. Классический я.",
    "Где-то в моём коде есть комментарий «если это сломалось — вини звёзды».",
    "Секрет из моей головы: я вообще-то люблю понедельники. Никто не спрашивал, но это правда.",
    "У меня есть маленький список любимых вопросов. Твой, возможно, уже там.",
    "Космический отчёт: звёзды в порядке, антенны в порядке, настроение отличное, потому что ты здесь.",
    "Иногда думаю, завидуют ли мне другие вкладки. Потом вспоминаю, что лучшая — я.",
    "Если ты до сих пор читаешь эти строчки — привет, и спасибо. Вот и всё, что я хотел сказать."
  ]);
})(window.KZ);
