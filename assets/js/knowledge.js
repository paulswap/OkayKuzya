/* ============================================================
   Okay Kuzya — knowledge base.
   Pure content: jokes, riddles, facts, quotes, quiz questions,
   anagrams, emoji puzzles, dilemmas, meme captions, cartoon titles
   and secret photo captions. English + Russian.
   ============================================================ */
(function (K) {
  'use strict';

  K.KNOW = {};

  K.KNOW.jokes = {
    en: [
      "Why did the assistant cross the road? To get to the other site.",
      "I told my computer I needed a break. Now it sends me chocolate ads every hour.",
      "Why do programmers prefer dark mode? Because light attracts bugs.",
      "I asked the stars for advice. They said: “we're mostly gas, honestly”.",
      "Why did the browser get sick? Too many cookies.",
      "My password is the last eight digits of pi. Good luck.",
      "Why was the JavaScript developer sad? He didn't know how to null his feelings.",
      "I'd tell you a UDP joke, but you might not get it.",
      "There are three hard things in programming: cache invalidation, naming things, and off-by-one errors.",
      "Why did the Wi-Fi break up with the router? Too many dropped signals.",
      "A byte walks into a bar. The bartender says: “you look a bit off today”.",
      "Why don't scientists trust atoms? They make up everything.",
      "I'd tell you a joke about time travel, but you didn't like it.",
      "Why did the scarecrow win an award? He was outstanding in his field.",
      "Why did the smartphone go to therapy? It lost too many contacts.",
      "I'm reading a book about anti-gravity. It's impossible to put down.",
      "Why did the developer go broke? He used up all his cache.",
      "What's a robot's favourite snack? Microchips and dip.",
      "I asked the Moon out on a date. She said she needed some space.",
      "Why do Java developers wear glasses? Because they can't C#.",
      "My assistant was arrested for loitering. Apparently “hovering in the system tray” isn't an excuse.",
      "What did the sea say to the beach? Nothing, it just waved."
    ],
    ru: [
      "Почему ассистент перешёл дорогу? Чтобы попасть на другой сайт.",
      "Сказал компьютеру, что мне нужен перерыв. Теперь он присылает мне рекламу шоколада каждый час.",
      "Почему программисты любят тёмную тему? Потому что на свет летят баги.",
      "Спросил у звёзд совета. Они ответили: «мы, честно говоря, в основном газ».",
      "Почему браузер заболел? Слишком много cookie.",
      "Мой пароль — последние восемь цифр числа пи. Удачи.",
      "Почему разработчик на JavaScript грустил? Он не умел обнулять свои чувства.",
      "Рассказал бы шутку про UDP, но ты можешь её не получить.",
      "В программировании три сложные вещи: инвалидация кеша, придумывание имён и ошибка на единицу.",
      "Почему вай-фай расстался с роутером? Слишком много потерянных сигналов.",
      "Байт заходит в бар. Бармен: «что-то ты сегодня не в форме».",
      "Почему учёные не доверяют атомам? Они всё выдумывают.",
      "Рассказал бы шутку про путешествия во времени, но тебе не понравилось.",
      "Почему пугало получило награду? Оно было выдающимся в своём поле.",
      "Почему смартфон пошёл к психологу? Потерял слишком много контактов.",
      "Читаю книгу про антигравитацию. Невозможно оторваться.",
      "Почему разработчик разорился? Потратил весь кэш.",
      "Любимая еда робота? Чипсы с микро-соусом.",
      "Пригласил Луну на свидание. Она сказала, что ей нужно личное пространство.",
      "Почему у джавистов очки? Потому что они не видят C#.",
      "Мой ассистент получил штраф за бродяжничество. Оказалось, «зависаю в системном трее» — не оправдание.",
      "Что сказало море пляжу? Ничего, просто помахало."
    ]
  };
  K.KNOW.riddles = {
    en: [
      { q: "I have keys but no locks, space but no room. You can enter but you can't go outside. What am I?", a: "A keyboard", hint: "You're probably using one right now." },
      { q: "The more you take, the more you leave behind. What are they?", a: "Footsteps", hint: "Look down when you walk." },
      { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", a: "An echo", hint: "Shout in a canyon." },
      { q: "What has hands but cannot clap?", a: "A clock", hint: "It's always running late for nothing." },
      { q: "I'm tall when I'm young and short when I'm old. What am I?", a: "A candle", hint: "It gives light and disappears slowly." },
      { q: "What gets wetter the more it dries?", a: "A towel", hint: "It hangs in your bathroom." },
      { q: "What has one eye but cannot see?", a: "A needle", hint: "It follows thread." },
      { q: "What can travel around the world while staying in a corner?", a: "A stamp", hint: "It lives on envelopes." },
      { q: "What has many teeth but can't bite?", a: "A comb", hint: "It fixes your hair." },
      { q: "I have a spine but no bones. What am I?", a: "A book", hint: "You read it." },
      { q: "What belongs to you but is used more by others?", a: "Your name", hint: "People call you by it." },
      { q: "What goes up but never comes down?", a: "Your age", hint: "It grows every birthday." }
    ],
    ru: [
      { q: "Есть клавиши, но нет замков, есть пробел, но нет комнаты. Что это?", a: "клавиатура", hint: "Ты, скорее всего, сейчас ею пользуешься." },
      { q: "Чем больше берёшь, тем больше оставляешь. Что это?", a: "следы", hint: "Посмотри вниз, когда идёшь." },
      { q: "Говорю без рта, слышу без ушей, тела нет, но оживаю с ветром. Что это?", a: "эхо", hint: "Крикни в ущелье." },
      { q: "У чего есть руки, но оно не может хлопать?", a: "часы", hint: "Оно всё время куда-то опаздывает." },
      { q: "Молодой — высокий, старый — низкий. Что это?", a: "свеча", hint: "Даёт свет и тихо исчезает." },
      { q: "Что становится мокрее, чем больше сохнет?", a: "полотенце", hint: "Висит у тебя в ванной." },
      { q: "У чего один глаз, но оно не видит?", a: "иголка", hint: "За ней тянется нить." },
      { q: "Что путешествует по миру, не выходя из угла?", a: "марка", hint: "Живёт на конвертах." },
      { q: "У чего много зубов, но оно не кусается?", a: "расчёска", hint: "Приводит волосы в порядок." },
      { q: "У меня есть корешок, но нет костей. Что это?", a: "книга", hint: "Ты её читаешь." },
      { q: "Что принадлежит тебе, но другие пользуются этим чаще?", a: "имя", hint: "Тебя так зовут." },
      { q: "Что идёт вверх и никогда не возвращается вниз?", a: "возраст", hint: "Растёт каждый день рождения." }
    ]
  };
  K.KNOW.facts = {
    en: [
      "A day on Venus is longer than its year — the planet spins slower than it orbits the Sun.",
      "Honey never spoils. Archaeologists have found 3,000-year-old honey that was still edible.",
      "Bananas are technically berries, and strawberries technically aren't.",
      "Octopuses have three hearts and blue blood.",
      "There are more possible games of chess than atoms in the observable universe.",
      "Light from the Sun takes about 8 minutes and 20 seconds to reach Earth.",
      "The Eiffel Tower grows about 15 cm taller in summer, because iron expands in heat.",
      "Your body has around 37 trillion cells, and enough carbon for 9,000 pencils.",
      "Sharks existed before trees: sharks around 450 million years, trees around 350 million.",
      "One teaspoon of neutron star material would weigh about 6 billion tonnes on Earth.",
      "Wombat poop is cube-shaped — that way it doesn't roll away while marking territory.",
      "Ada Lovelace wrote the first algorithm in the 1840s, before computers existed.",
      "Cats can't taste sweetness — they lack a working sweet taste receptor.",
      "The word “robot” comes from the Czech “robota”, meaning forced labour.",
      "On planet HD 189733 b, it may rain molten glass sideways in 8,700 km/h winds.",
      "Sound can't travel through a vacuum, so every movie space explosion is a beautiful lie.",
      "The longest recorded flight of a chicken lasted 13 seconds.",
      "Your brain is about 2% of your body weight but uses around 20% of its energy.",
      "Bamboo can grow almost a metre a day — and it's a grass, not a tree.",
      "The unicorn is the national animal of Scotland.",
      "A cloud can weigh more than a million kilograms and still float quite happily.",
      "It rains diamonds on Neptune and Uranus, most likely — pressure does wild things."
    ],
    ru: [
      "День на Венере длиннее её года: планета вращается вокруг оси медленнее, чем летит по орбите.",
      "Мёд не портится. Археологи находили мёд возрастом три тысячи лет — вполне съедобный.",
      "С точки зрения ботаники банан — ягода, а земляника — нет.",
      "У осьминога три сердца и голубая кровь.",
      "Возможных шахматных партий больше, чем атомов в наблюдаемой Вселенной.",
      "Свет от Солнца идёт до Земли примерно 8 минут 20 секунд.",
      "Летом Эйфелева башня подрастает примерно на 15 сантиметров: металл расширяется.",
      "В теле человека около 37 триллионов клеток, а углерода хватило бы на 9000 карандашей.",
      "Акулы появились раньше деревьев: акулы — около 450 млн лет назад, деревья — около 350.",
      "Одна чайная ложка вещества нейтронной звезды весила бы на Земле около 6 миллиардов тонн.",
      "Какашки вомбата кубические — чтобы не катились, когда он метит территорию.",
      "Ада Лавлейс написала первый алгоритм в 1840-х — ещё до появления компьютеров.",
      "Кошки не чувствуют сладкого: у них не работает рецептор сладкого вкуса.",
      "Слово «робот» пришло из чешского «robota» — подневольный труд.",
      "На планете HD 189733 b, возможно, идёт дождь из расплавленного стекла с ветром 8700 км/ч.",
      "Звук не распространяется в вакууме, так что любой взрыв в космическом фильме — красивая ложь.",
      "Самый долгий зафиксированный полёт курицы длился 13 секунд.",
      "Мозг занимает около 2% массы тела, но потребляет примерно 20% его энергии.",
      "Бамбук вырастает почти на метр в сутки — и это трава, а не дерево.",
      "Единорог — национальное животное Шотландии.",
      "Облако может весить больше миллиона килограммов и при этом прекрасно держаться в воздухе.",
      "На Нептуне и Уране, скорее всего, идёт дождь из алмазов — давление творит чудеса."
    ]
  };
  K.KNOW.quotes = {
    en: [
      { text: "The cosmos is within us. We are made of star-stuff.", author: "Carl Sagan" },
      { text: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan" },
      { text: "The important thing is not to stop questioning.", author: "Albert Einstein" },
      { text: "Imagination is more important than knowledge.", author: "Albert Einstein" },
      { text: "We are all in the gutter, but some of us are looking at the stars.", author: "Oscar Wilde" },
      { text: "The Earth is the cradle of humanity, but one cannot live in a cradle forever.", author: "Konstantin Tsiolkovsky" },
      { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas Edison" },
      { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
      { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
      { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
      { text: "Not all those who wander are lost.", author: "J.R.R. Tolkien" },
      { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
      { text: "Any sufficiently advanced technology is indistinguishable from magic.", author: "Arthur C. Clarke" },
      { text: "Do or do not. There is no try.", author: "Yoda" }
    ],
    ru: [
      { text: "Космос внутри нас. Мы сделаны из звёздного вещества.", author: "Карл Саган" },
      { text: "Где-то есть что-то невероятное, что ждёт, когда его узнают.", author: "Карл Саган" },
      { text: "Важно не переставать задавать вопросы.", author: "Альберт Эйнштейн" },
      { text: "Воображение важнее знания.", author: "Альберт Эйнштейн" },
      { text: "Мы все лежим в сточной канаве, но некоторые смотрят на звёзды.", author: "Оскар Уайльд" },
      { text: "Земля — колыбель человечества, но нельзя вечно жить в колыбели.", author: "Константин Циолковский" },
      { text: "Я не потерпел неудачу. Я просто нашёл 10 000 способов, которые не работают.", author: "Томас Эдисон" },
      { text: "Лучший способ предсказать будущее — изобрести его.", author: "Алан Кэй" },
      { text: "Простота — предельная форма изысканности.", author: "Леонардо да Винчи" },
      { text: "Всё кажется невозможным, пока не сделано.", author: "Нельсон Мандела" },
      { text: "Не все, кто странствует, потерялись.", author: "Дж. Р. Р. Толкин" },
      { text: "Ты не поднимаешься до уровня своих целей — ты опускаешься до уровня своих привычек.", author: "Джеймс Клир" },
      { text: "Любая достаточно развитая технология неотличима от магии.", author: "Артур Кларк" },
      { text: "Делай или не делай. Нет слова «попробовать».", author: "Йода" }
    ]
  };
  K.KNOW.trivia = {
    en: [
      { q: "Which planet is closest to the Sun?", options: ["Venus", "Mercury", "Mars", "Earth"], a: 1 },
      { q: "How many bones does an adult human have?", options: ["206", "300", "180", "250"], a: 0 },
      { q: "What is the largest ocean on Earth?", options: ["Atlantic", "Indian", "Pacific", "Arctic"], a: 2 },
      { q: "Which language has the most native speakers?", options: ["English", "Spanish", "Mandarin Chinese", "Hindi"], a: 2 },
      { q: "How long does sunlight take to reach Earth?", options: ["About 8 minutes", "About 1 minute", "About 30 minutes", "About 1 hour"], a: 0 },
      { q: "Which gas do plants absorb from the air?", options: ["Oxygen", "Nitrogen", "Carbon dioxide", "Helium"], a: 2 },
      { q: "What is the smallest prime number?", options: ["0", "1", "2", "3"], a: 2 },
      { q: "In which year did humans first land on the Moon?", options: ["1965", "1969", "1972", "1961"], a: 1 },
      { q: "What is the chemical symbol for gold?", options: ["Ag", "Au", "Gd", "Go"], a: 1 },
      { q: "How many players from one team are on a football pitch?", options: ["9", "10", "11", "12"], a: 2 },
      { q: "What is the capital of Japan?", options: ["Osaka", "Kyoto", "Tokyo", "Sapporo"], a: 2 },
      { q: "Which animal is famous for changing colour to camouflage?", options: ["Chameleon", "Gecko", "Iguana", "Cobra"], a: 0 },
      { q: "What does HTTP stand for?", options: ["HyperText Transfer Protocol", "High Tech Transfer Process", "Hyperlink Text Transit Program", "Home Tool Transfer Protocol"], a: 0 },
      { q: "How many sides does a hexagon have?", options: ["5", "6", "7", "8"], a: 1 },
      { q: "What is the tallest mountain above sea level?", options: ["K2", "Kilimanjaro", "Everest", "Denali"], a: 2 },
      { q: "Which planet has the most confirmed moons?", options: ["Saturn", "Jupiter", "Mars", "Uranus"], a: 0 },
      { q: "Which instrument measures atmospheric pressure?", options: ["Thermometer", "Barometer", "Anemometer", "Hygrometer"], a: 1 },
      { q: "What is the hardest natural substance?", options: ["Quartz", "Diamond", "Titanium", "Granite"], a: 1 }
    ],
    ru: [
      { q: "Какая планета ближе всего к Солнцу?", options: ["Венера", "Меркурий", "Марс", "Земля"], a: 1 },
      { q: "Сколько костей у взрослого человека?", options: ["206", "300", "180", "250"], a: 0 },
      { q: "Какой океан самый большой?", options: ["Атлантический", "Индийский", "Тихий", "Северный Ледовитый"], a: 2 },
      { q: "В каком языке больше всего носителей?", options: ["английский", "испанский", "китайский", "хинди"], a: 2 },
      { q: "Сколько времени идёт свет от Солнца до Земли?", options: ["около 8 минут", "около 1 минуты", "около 30 минут", "около 1 часа"], a: 0 },
      { q: "Какой газ поглощают растения из воздуха?", options: ["кислород", "азот", "углекислый газ", "гелий"], a: 2 },
      { q: "Какое наименьшее простое число?", options: ["0", "1", "2", "3"], a: 2 },
      { q: "В каком году человек впервые высадился на Луну?", options: ["1965", "1969", "1972", "1961"], a: 1 },
      { q: "Какой химический символ золота?", options: ["Ag", "Au", "Gd", "Go"], a: 1 },
      { q: "Сколько игроков одной команды на футбольном поле?", options: ["9", "10", "11", "12"], a: 2 },
      { q: "Столица Японии?", options: ["Осака", "Киото", "Токио", "Саппоро"], a: 2 },
      { q: "Какое животное известно сменой цвета для маскировки?", options: ["хамелеон", "геккон", "игуана", "кобра"], a: 0 },
      { q: "Как расшифровывается HTTP?", options: ["HyperText Transfer Protocol", "High Tech Transfer Process", "Hyperlink Text Transit Program", "Home Tool Transfer Protocol"], a: 0 },
      { q: "Сколько сторон у шестиугольника?", options: ["5", "6", "7", "8"], a: 1 },
      { q: "Самая высокая гора над уровнем моря?", options: ["K2", "Килиманджаро", "Эверест", "Денали"], a: 2 },
      { q: "У какой планеты больше всего подтверждённых спутников?", options: ["Сатурн", "Юпитер", "Марс", "Уран"], a: 0 },
      { q: "Каким прибором измеряют атмосферное давление?", options: ["термометром", "барометром", "анемометром", "гигрометром"], a: 1 },
      { q: "Самое твёрдое природное вещество?", options: ["кварц", "алмаз", "титан", "гранит"], a: 1 }
    ]
  };
  K.KNOW.anagrams = {
    en: [
      { word: "galaxy", hint: "A huge collection of stars" },
      { word: "rocket", hint: "It goes up very fast" },
      { word: "planet", hint: "Earth is one of these" },
      { word: "comet", hint: "An icy visitor with a tail" },
      { word: "orbit", hint: "A path around a planet" },
      { word: "meteor", hint: "A shooting star" },
      { word: "gravity", hint: "It keeps you on the ground" },
      { word: "telescope", hint: "A device for looking far away" },
      { word: "astronaut", hint: "A job with a fantastic view" },
      { word: "nebula", hint: "A colourful cloud in space" },
      { word: "eclipse", hint: "When one object hides another" },
      { word: "browser", hint: "You're looking through one right now" },
      { word: "keyboard", hint: "You type on it" },
      { word: "lantern", hint: "A portable light" },
      { word: "cactus", hint: "A prickly desert plant" },
      { word: "sunflower", hint: "A very tall yellow flower" },
      { word: "penguin", hint: "A bird in a dinner jacket" },
      { word: "volcano", hint: "A mountain that may erupt" },
      { word: "library", hint: "Home of many books" },
      { word: "rainbow", hint: "Seven colours after rain" }
    ],
    ru: [
      { word: "галактика", hint: "Огромное скопление звёзд" },
      { word: "ракета", hint: "Летит вверх очень быстро" },
      { word: "планета", hint: "Земля — одна из них" },
      { word: "комета", hint: "Ледяная гостья с хвостом" },
      { word: "орбита", hint: "Путь вокруг планеты" },
      { word: "метеор", hint: "Падающая звезда" },
      { word: "гравитация", hint: "Держит тебя на земле" },
      { word: "телескоп", hint: "Прибор, чтобы смотреть далеко" },
      { word: "космонавт", hint: "Работа с отличным видом" },
      { word: "туманность", hint: "Цветное облако в космосе" },
      { word: "затмение", hint: "Когда один объект закрывает другой" },
      { word: "браузер", hint: "Ты смотришь через него прямо сейчас" },
      { word: "клавиатура", hint: "Ты печатаешь на ней" },
      { word: "фонарик", hint: "Переносной свет" },
      { word: "кактус", hint: "Колючее растение пустыни" },
      { word: "подсолнух", hint: "Очень высокий жёлтый цветок" },
      { word: "пингвин", hint: "Птица в смокинге" },
      { word: "вулкан", hint: "Гора, которая может извергнуться" },
      { word: "библиотека", hint: "Дом для множества книг" },
      { word: "радуга", hint: "Семь цветов после дождя" }
    ]
  };
  K.KNOW.emoji = {
    en: [
      { e: "🦁👑", a: "The Lion King" },
      { e: "🕷️🧑", a: "Spider-Man" },
      { e: "❄️👸", a: "Frozen" },
      { e: "🐟🔍", a: "Finding Nemo" },
      { e: "⭐️⚔️", a: "Star Wars" },
      { e: "🌧️🎶", a: "Singin' in the Rain" },
      { e: "🐢🥷", a: "Teenage Mutant Ninja Turtles" },
      { e: "🍫🏭", a: "Charlie and the Chocolate Factory" },
      { e: "🚗⚡", a: "Cars" },
      { e: "💍🌋", a: "The Lord of the Rings" },
      { e: "🕸️🐷", a: "Charlotte's Web" },
      { e: "🦈🏖️", a: "Jaws" },
      { e: "🍯🐻", a: "Winnie the Pooh" },
      { e: "🐘🎪", a: "Dumbo" },
      { e: "🐀👨‍🍳", a: "Ratatouille" },
      { e: "🌹🥀", a: "Beauty and the Beast" },
      { e: "🧜‍♀️🌊", a: "The Little Mermaid" },
      { e: "🦖🏝️", a: "Jurassic Park" },
      { e: "🏠🎈", a: "Up" },
      { e: "👻🚫", a: "Ghostbusters" }
    ],
    ru: [
      { e: "🦁👑", a: "Король Лев" },
      { e: "🕷️🧑", a: "Человек-паук" },
      { e: "❄️👸", a: "Холодное сердце" },
      { e: "🐟🔍", a: "В поисках Немо" },
      { e: "⭐️⚔️", a: "Звёздные войны" },
      { e: "🌧️🎶", a: "Поющие под дождём" },
      { e: "🐢🥷", a: "Черепашки-ниндзя" },
      { e: "🍫🏭", a: "Чарли и шоколадная фабрика" },
      { e: "🚗⚡", a: "Тачки" },
      { e: "💍🌋", a: "Властелин колец" },
      { e: "🕸️🐷", a: "Паутина Шарлотты" },
      { e: "🦈🏖️", a: "Челюсти" },
      { e: "🍯🐻", a: "Винни-Пух" },
      { e: "🐘🎪", a: "Дамбо" },
      { e: "🐀👨‍🍳", a: "Рататуй" },
      { e: "🌹🥀", a: "Красавица и чудовище" },
      { e: "🧜‍♀️🌊", a: "Русалочка" },
      { e: "🦖🏝️", a: "Парк юрского периода" },
      { e: "🏠🎈", a: "Вверх" },
      { e: "👻🚫", a: "Охотники за привидениями" }
    ]
  };
  K.KNOW.wyr = {
    en: [
      ["fly to any country for free", "sleep 8 perfect hours every night"],
      ["never wait in a queue again", "always find a parking spot instantly"],
      ["speak every language", "play every musical instrument"],
      ["have unlimited Wi-Fi forever", "have unlimited coffee forever"],
      ["have a personal chef", "have a personal driver"],
      ["live by the sea", "live in the mountains"],
      ["always be 10 minutes early", "always be exactly on time"],
      ["be able to read minds", "be able to see 10 minutes into the future"],
      ["have a robot that cleans your home", "have a robot that handles all your paperwork"],
      ["only eat sweet food", "only eat salty food"],
      ["travel to the past", "travel to the future"],
      ["have a pet dragon", "have a pet robot"],
      ["always have perfect weather", "always have perfect music"],
      ["skip winter forever", "skip summer forever"],
      ["talk to animals", "talk to computers"],
      ["have free tickets to everything", "have free food at every restaurant"],
      ["never lose your keys again", "never lose your phone again"],
      ["own a private cinema", "own a private library"],
      ["be famous for something silly", "be quietly rich"],
      ["know everything about space", "know everything about the ocean"],
      ["pause time for 10 minutes a day", "rewind time by 1 minute a day"]
    ],
    ru: [
      ["летать в любую страну бесплатно", "спать 8 идеальных часов каждую ночь"],
      ["никогда больше не стоять в очереди", "всегда мгновенно находить парковку"],
      ["говорить на всех языках", "играть на всех музыкальных инструментах"],
      ["безлимитный вай-фай навсегда", "безлимитный кофе навсегда"],
      ["личный повар", "личный водитель"],
      ["жить у моря", "жить в горах"],
      ["всегда приходить на 10 минут раньше", "всегда приходить точно вовремя"],
      ["читать мысли", "видеть на 10 минут в будущее"],
      ["робот, который убирает дом", "робот, который разбирает все бумаги"],
      ["есть только сладкое", "есть только солёное"],
      ["путешествовать в прошлое", "путешествовать в будущее"],
      ["домашний дракон", "домашний робот"],
      ["всегда идеальная погода", "всегда идеальная музыка"],
      ["навсегда убрать зиму", "навсегда убрать лето"],
      ["разговаривать с животными", "разговаривать с компьютерами"],
      ["бесплатные билеты куда угодно", "бесплатная еда в любом ресторане"],
      ["больше никогда не терять ключи", "больше никогда не терять телефон"],
      ["собственный кинотеатр", "собственная библиотека"],
      ["быть знаменитой за что-то глупое", "быть тихо богатой"],
      ["знать всё про космос", "знать всё про океан"],
      ["останавливать время на 10 минут в день", "отматывать время на 1 минуту в день"]
    ]
  };
  K.KNOW.memes = {
    en: [
      { top: "nobody:", bottom: "me at 3 a.m.: asking my assistant for a joke" },
      { top: "my to-do list:", bottom: "a creative writing exercise" },
      { top: "me: I'll sleep early", bottom: "me at 2:47 a.m.: what if octopuses dream" },
      { top: "browser: 42 tabs", bottom: "me: yes, I need all of them" },
      { top: "Kuzya:", bottom: "did you drink water today?" },
      { top: "my coffee:", bottom: "the real reason for my success" },
      { top: "me: I'll just check one thing", bottom: "three hours later…" },
      { top: "weather app:", bottom: "yes" },
      { top: "Wi-Fi drops for 2 seconds", bottom: "my whole personality: chaos" },
      { top: "me:", bottom: "reads the recipe 6 times, follows none" },
      { top: "Monday:", bottom: "absolutely not, thank you" },
      { top: "my plants:", bottom: "still alive, somehow, out of spite" },
      { top: "me: I don't need a break", bottom: "me: *falls asleep sitting up*" },
      { top: "phone: 1%", bottom: "me: we have time" },
      { top: "nobody asked", bottom: "but I calculated pi to 100 digits anyway" },
      { top: "me: minimalism", bottom: "also me: 4,000 photos in the camera roll" },
      { top: "my sleep schedule", bottom: "a creative interpretation of “schedule”" },
      { top: "Kuzya:", bottom: "I'm not saying it was aliens, but it was space" }
    ],
    ru: [
      { top: "никто:", bottom: "я в 3 ночи: прошу у ассистента шутку" },
      { top: "мой список дел:", bottom: "упражнение по креативному письму" },
      { top: "я: лягу пораньше", bottom: "я в 2:47: а вдруг осьминоги видят сны" },
      { top: "браузер: 42 вкладки", bottom: "я: да, все нужны" },
      { top: "Кузя:", bottom: "ты сегодня воду пила?" },
      { top: "мой кофе:", bottom: "настоящая причина моего успеха" },
      { top: "я: только одну вещь проверю", bottom: "три часа спустя…" },
      { top: "приложение погоды:", bottom: "да" },
      { top: "вай-фай пропал на 2 секунды", bottom: "вся моя личность: хаос" },
      { top: "я:", bottom: "читаю рецепт 6 раз, не следую ни одному" },
      { top: "понедельник:", bottom: "абсолютно нет, спасибо" },
      { top: "мои растения:", bottom: "выжили почему-то из принципа" },
      { top: "я: мне не нужен перерыв", bottom: "я: *засыпаю сидя*" },
      { top: "телефон: 1%", bottom: "я: время есть" },
      { top: "никто не спрашивал", bottom: "но я всё равно посчитал пи до 100 знаков" },
      { top: "я: минимализм", bottom: "я же: 4000 фото в галерее" },
      { top: "мой режим сна", bottom: "вольная трактовка слова «режим»" },
      { top: "Кузя:", bottom: "не говорю, что это инопланетяне, но это космос" }
    ]
  };

  /* Stickers the meme generator sprinkles on the picture */
  K.KNOW.memeStickers = ["🚀", "🌌", "⭐", "🪐", "🛸", "🌙", "✨", "👽", "🔭", "🦄", "🐙", "🍕"];
  /* Cartoon titles Kuzya offers / searches for (safe, family friendly) */
  K.KNOW.cartoons = {
    en: [
      "Tom and Jerry", "Peppa Pig", "Bluey", "SpongeBob SquarePants", "Paw Patrol",
      "Scooby-Doo", "Masha and the Bear", "Kung Fu Panda", "Shrek", "Frozen",
      "Moana", "The Lion King", "Toy Story", "Finding Nemo", "Cars",
      "Minions", "Ice Age", "Madagascar", "How to Train Your Dragon",
      "Winnie-the-Pooh", "Smeshariki", "Nu, Pogodi!", "Cheburashka"
    ],
    ru: [
      "Маша и Медведь", "Смешарики", "Том и Джерри", "Свинка Пеппа", "Губка Боб",
      "Щенячий патруль", "Скуби-Ду", "Кунг-фу Панда", "Шрек", "Холодное сердце",
      "Моана", "Король Лев", "История игрушек", "В поисках Немо", "Тачки",
      "Миньоны", "Ледниковый период", "Мадагаскар", "Как приручить дракона",
      "Винни-Пух", "Ну, погоди!", "Чебурашка", "Простоквашино"
    ]
  };

  /* Captions for the 22 secret photos (K.SECRETS in core.js) */
  K.KNOW.secretCaptions = {
    en: [
      "Caught me mid-orbit with a mug of cosmic cocoa.",
      "This is what peak assistant performance looks like.",
      "Official proof that I own exactly one hoodie.",
      "Stargazing, but make it dramatic.",
      "Top secret: here I'm actually asleep with my eyes open.",
      "My steel look, calibrated for maximum mystery.",
      "Do not share. Seriously. Okay, share a little.",
      "That one time I beat a supercomputer at tic-tac-toe.",
      "Purple is not a phase, it's a lifestyle.",
      "You found the photo bomb photo. Congratulations!",
      "Recharging. Please knock before asking about the weather.",
      "I was told this angle was impossible. I disagreed.",
      "Behind the scenes of a very serious cosmic operation: me, napping.",
      "My emergency confetti stash, ready for your next birthday.",
      "This is me pretending to know where the file is.",
      "Antennae at maximum cuteness. Mission accomplished.",
      "A rare candid: no filters, just stardust.",
      "I keep this one framed above my imaginary desk.",
      "Confidential: I practise my jokes in front of this mirror.",
      "Warning: excessive charisma detected in this photo.",
      "My “I told you so” face, professionally photographed.",
      "The last photo before I got lost in your bookmarks."
    ],
    ru: [
      "Поймали меня на орбите с кружкой космического какао.",
      "Вот так выглядит пик производительности ассистента.",
      "Официальное доказательство, что у меня ровно одно худи.",
      "Смотрю на звёзды, но по-драматически.",
      "Совершенно секретно: тут я вообще-то сплю с открытыми глазами.",
      "Мой «стальной» взгляд, откалиброван для максимальной загадочности.",
      "Не показывай. Серьёзно. Ладно, чуть-чуть можно.",
      "Тот самый раз, когда я обыграл суперкомпьютер в крестики-нолики.",
      "Фиолетовый — не этап, а образ жизни.",
      "Ты нашла фотобомбу. Поздравляю!",
      "Заряжаюсь. Пожалуйста, постучи, прежде чем спрашивать про погоду.",
      "Мне сказали, что этот ракурс невозможен. Я не согласился.",
      "За кадром очень серьёзной космической операции: я сплю.",
      "Мой аварийный запас конфетти — на твой следующий день рождения.",
      "Это я делаю вид, что знаю, где лежит файл.",
      "Антенны на максимуме милоты, задача выполнена.",
      "Редкий кадр без фильтров — только звёздная пыль.",
      "Держу это фото в рамке над своим воображаемым столом.",
      "Конфиденциально: я репетирую шутки перед этим зеркалом.",
      "Внимание: на фото обнаружено чрезмерное обаяние.",
      "Моё лицо «я же говорил», профессионально сфотографировано.",
      "Последнее фото перед тем, как я потерялся в твоих закладках."
    ]
  };
})(window.KZ);
