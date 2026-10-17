// === Общий список товаров (магазин + страница товара) ===
// type:'config' — товар с выбором версии/памяти/цвета. Иначе — обычный товар.

const iStorageOld = [{name:'128 ГБ',add:0},{name:'256 ГБ',add:8000},{name:'512 ГБ',add:18000}];
const iStorageNew = [{name:'128 ГБ',add:0},{name:'256 ГБ',add:9000},{name:'512 ГБ',add:20000},{name:'1 ТБ',add:34000}];
const iStorage18  = [{name:'256 ГБ',add:0},{name:'512 ГБ',add:20000},{name:'1 ТБ',add:34000}];
const iPadStorage = [{name:'128 ГБ',add:0},{name:'256 ГБ',add:10000},{name:'512 ГБ',add:22000},{name:'1 ТБ',add:40000}];
// Тип SIM (eSIM / физическая SIM) — доступно на всех iPhone
const iSim = [{name:'eSIM + SIM',add:0},{name:'eSIM',add:0}];

const products = [
    // ===== iPhone — конфигураторы по поколениям =====
    { id:'iphone13', brand:'Apple', cat:'tech', name:'iPhone 13', img:'images/ip13_blue.png', type:'config', stock:12,
      desc:'Выбери версию, память и цвет. Чип A15 Bionic, экран Super Retina XDR.',
      storage:iStorageOld, sim:iSim,
      versions:[
        {name:'iPhone 13', price:35000, img:'images/ip13.png', colors:['Тёмная ночь','Сияющая звезда','Синий','Розовый','Красный'],
          colorImages:{'Тёмная ночь':'images/ip13_midnight.png','Сияющая звезда':'images/ip13_starlight.png','Синий':'images/ip13_blue.png','Розовый':'images/ip13_pink.png','Красный':'images/ip13_red.png'}},
        {name:'iPhone 13 Pro', price:44000, img:'images/ip13pro.png', colors:['Графитовый','Золотой','Серебристый','Небесно-голубой']},
        {name:'iPhone 13 Pro Max', price:50000, img:'images/ip13promax.png', colors:['Графитовый','Золотой','Серебристый','Небесно-голубой']},
      ] },
    { id:'iphone14', brand:'Apple', cat:'tech', name:'iPhone 14', img:'images/ip14_midnight.png', type:'config', stock:12,
      desc:'Выбери версию, память и цвет. Dynamic Island (Pro), камера 48 Мп.',
      storage:iStorageOld, sim:iSim,
      versions:[
        {name:'iPhone 14', price:46000, img:'images/ip14.png', colors:['Тёмная ночь','Сияющая звезда','Синий','Фиолетовый','Красный'],
          colorImages:{'Тёмная ночь':'images/ip14_midnight.png','Сияющая звезда':'images/ip14_starlight.png','Синий':'images/ip14_blue.png','Фиолетовый':'images/ip14_purple.png','Красный':'images/ip14_red.png'}},
        {name:'iPhone 14 Pro', price:57000, img:'images/ip14pro.png', colors:['Космический чёрный','Серебристый','Золотой','Тёмно-фиолетовый'],
          colorImages:{'Космический чёрный':'images/ip14pro_spaceblack.png','Серебристый':'images/ip14pro_silver.png','Золотой':'images/ip14pro_gold.png','Тёмно-фиолетовый':'images/ip14pro_deeppurple.png'}},
        {name:'iPhone 14 Pro Max', price:65000, img:'images/ip14promax.png', colors:['Космический чёрный','Серебристый','Золотой','Тёмно-фиолетовый'],
          colorImages:{'Космический чёрный':'images/ip14promax_spaceblack.png','Серебристый':'images/ip14promax_silver.png','Золотой':'images/ip14promax_gold.png','Тёмно-фиолетовый':'images/ip14promax_deeppurple.png'}},
      ] },
    { id:'iphone15', brand:'Apple', cat:'tech', name:'iPhone 15', img:'images/ip15_pink.png', type:'config', stock:14,
      desc:'Выбери версию, память и цвет. USB-C, Dynamic Island, титан (Pro).',
      storage:iStorageNew,
      sim:iSim,
      versions:[
        {name:'iPhone 15', price:50000, img:'images/ip15.png', colors:['Чёрный','Синий','Зелёный','Жёлтый','Розовый'],
          colorImages:{'Чёрный':'images/ip15_black.png','Синий':'images/ip15_blue.png','Зелёный':'images/ip15_green.png','Жёлтый':'images/ip15_yellow.png','Розовый':'images/ip15_pink.png'}},
        {name:'iPhone 15 Pro', price:66000, img:'images/ip15pro.png', colors:['Титановый чёрный','Титановый белый','Титановый синий','Титановый натуральный'],
          colorImages:{'Титановый чёрный':'images/ip15pro_black-titanium.png','Титановый белый':'images/ip15pro_white-titanium.png','Титановый синий':'images/ip15pro_blue-titanium.png','Титановый натуральный':'images/ip15pro_natural-titanium.png'}},
        {name:'iPhone 15 Pro Max', price:78000, img:'images/ip15promax.png', colors:['Титановый чёрный','Титановый белый','Титановый синий','Титановый натуральный'],
          colorImages:{'Титановый чёрный':'images/ip15promax_black-titanium.png','Титановый белый':'images/ip15promax_white-titanium.png','Титановый синий':'images/ip15promax_blue-titanium.png','Титановый натуральный':'images/ip15promax_natural-titanium.png'}},
      ] },
    { id:'iphone16', brand:'Apple', cat:'tech', name:'iPhone 16', img:'images/ip16_ultramarine.png', type:'config', stock:12,
      desc:'Выбери версию, память и цвет. Чип A18, кнопка камеры, Apple Intelligence.',
      storage:iStorageNew,
      sim:iSim,
      versions:[
        {name:'iPhone 16', price:62000, img:'images/ip16.png', colors:['Чёрный','Белый','Розовый','Бирюзовый','Ультрамарин'],
          colorImages:{'Чёрный':'images/ip16_black.png','Белый':'images/ip16_white.png','Розовый':'images/ip16_pink.png','Бирюзовый':'images/ip16_teal.png','Ультрамарин':'images/ip16_ultramarine.png'}},
        {name:'iPhone 16 Pro', price:80000, img:'images/ip16pro.png', colors:['Титановый чёрный','Титановый белый','Титановый натуральный','Пустынный титан'],
          colorImages:{'Титановый чёрный':'images/ip16pro_black-titanium.png','Титановый белый':'images/ip16pro_white-titanium.png','Титановый натуральный':'images/ip16pro_natural-titanium.png','Пустынный титан':'images/ip16pro_desert-titanium.png'}},
        {name:'iPhone 16 Pro Max', price:90000, img:'images/ip16promax.png', colors:['Титановый чёрный','Титановый белый','Титановый натуральный','Пустынный титан'],
          colorImages:{'Титановый чёрный':'images/ip16promax_black-titanium.png','Титановый белый':'images/ip16promax_white-titanium.png','Титановый натуральный':'images/ip16promax_natural-titanium.png','Пустынный титан':'images/ip16promax_desert-titanium.png'}},
      ] },
    { id:'iphone17', brand:'Apple', cat:'tech', name:'iPhone 17', img:'images/ip17_lavender.png', type:'config', stock:10,
      desc:'Выбери версию, память и цвет. Новейшее поколение, топовая камера.',
      storage:iStorageNew,
      sim:iSim,
      versions:[
        {name:'iPhone 17', price:69000, img:'images/ip17.png', colors:['Чёрный','Белый','Синий','Лавандовый'],
          colorImages:{'Чёрный':'images/ip17_black.png','Белый':'images/ip17_white.png','Синий':'images/ip17_mist-blue.png','Лавандовый':'images/ip17_lavender.png'}},
        {name:'iPhone 17 Pro', price:82000, img:'images/ip17pro.png', colors:['Космический оранжевый','Тёмно-синий','Серебристый'],
          colorImages:{'Космический оранжевый':'images/ip17pro_cosmic-orange.png','Тёмно-синий':'images/ip17pro_deep-blue.png','Серебристый':'images/ip17pro_silver.png'}},
        {name:'iPhone 17 Pro Max', price:95000, img:'images/ip17promax.png', colors:['Космический оранжевый','Тёмно-синий','Серебристый'],
          colorImages:{'Космический оранжевый':'images/ip17promax_cosmic-orange.png','Тёмно-синий':'images/ip17promax_deep-blue.png','Серебристый':'images/ip17promax_silver.png'}},
      ] },

    // ===== iPhone 18 — уже в продаже =====
    { id:'ip18', brand:'Apple', cat:'tech', name:'iPhone 18', img:'images/ip17promax_silver.png', type:'config', stock:9,
      desc:'Новейшее поколение iPhone. Выбери версию, память, цвет и тип SIM. Чип нового поколения, улучшенная камера и экран.',
      storage:iStorage18, sim:iSim,
      versions:[
        {name:'iPhone 18', price:79000, img:'images/ip17.png', colors:['Чёрный','Белый','Синий','Лавандовый'],
          colorImages:{'Чёрный':'images/ip17_black.png','Белый':'images/ip17_white.png','Синий':'images/ip17_mist-blue.png','Лавандовый':'images/ip17_lavender.png'}},
        {name:'iPhone 18 Pro', price:92000, img:'images/ip17pro.png', colors:['Космический оранжевый','Тёмно-синий','Серебристый','Титановый чёрный','Титановый золотой','Титановый натуральный'],
          colorImages:{'Космический оранжевый':'images/ip17pro_cosmic-orange.png','Тёмно-синий':'images/ip17pro_deep-blue.png','Серебристый':'images/ip17pro_silver.png'}},
        {name:'iPhone 18 Pro Max', price:105000, img:'images/ip17promax.png', colors:['Космический оранжевый','Тёмно-синий','Серебристый','Титановый чёрный','Титановый золотой','Титановый натуральный'],
          colorImages:{'Космический оранжевый':'images/ip17promax_cosmic-orange.png','Тёмно-синий':'images/ip17promax_deep-blue.png','Серебристый':'images/ip17promax_silver.png'}},
      ] },

    // ===== iPad — конфигуратор =====
    { id:'ipad', brand:'Apple', cat:'tech', name:'iPad', img:'images/ipad10.png', type:'config', stock:10,
      desc:'Выбери модель, память и цвет. От доступного iPad до профессионального iPad Pro.',
      storage:iPadStorage,
      versions:[
        {name:'iPad (10-е поколение)', price:40000, img:'images/ipad10.png', colors:['Синий','Розовый','Жёлтый','Серебристый'],
          colorImages:{'Синий':'images/ipad_blue.png','Розовый':'images/ipad_pink.png','Жёлтый':'images/ipad_yellow.png','Серебристый':'images/ipad_silver.png'}},
        {name:'iPad Air', price:70000, img:'images/ipad.png', colors:['Синий','Фиолетовый','Розовый','Серый космос']},
        {name:'iPad Pro 11"', price:120000, img:'images/ipadpro.png', colors:['Серебристый','Серый космос']},
      ] },

    // ===== Apple — компьютеры =====
    { id:'macbookair', brand:'Apple', cat:'tech', name:'MacBook Air M3', img:'images/macbook.png', price:120000, stock:5,
      desc:'Тонкий и лёгкий ноутбук на чипе M3. До 18 часов работы.', colors:['Серебристый','Серый космос','Синий','Сияющая звезда'] },
    { id:'macbookpro', brand:'Apple', cat:'tech', name:'MacBook Pro 14', img:'images/macbookpro.png', price:240000, stock:3,
      desc:'Профессиональный ноутбук с дисплеем Liquid Retina XDR.', colors:['Серебристый','Серый космос'] },
    { id:'imac', brand:'Apple', cat:'tech', name:'iMac 24"', img:'images/imac.png', price:170000, stock:4,
      desc:'Моноблок с ярким дисплеем 4.5K в семи цветах.', colors:['Синий','Зелёный','Розовый','Серебристый'] },
    { id:'macmini', brand:'Apple', cat:'tech', name:'Mac mini M2', img:'images/macmini.png', price:65000, stock:7,
      desc:'Компактный настольный компьютер. Маленький корпус, большая мощность.', colors:[] },

    // ===== Apple — часы и ремешки =====
    { id:'watchse', brand:'Apple', cat:'watch', name:'Apple Watch SE', img:'images/se_midnight.png', price:30000, stock:11,
      desc:'Умные часы по доступной цене. Все главные функции для здоровья и спорта.', colors:['Тёмная ночь','Сияющая звезда'],
      colorImages:{'Тёмная ночь':'images/se_midnight.png','Сияющая звезда':'images/se_starlight.png'} },
    { id:'watch', brand:'Apple', cat:'watch', name:'Apple Watch Series 11', img:'images/applewatch.png', price:45000, stock:6,
      desc:'Умные часы для здоровья и спорта.', colors:['Тёмная ночь','Сияющая звезда','Серебристый'] },
    { id:'ultra', brand:'Apple', cat:'watch', name:'Apple Watch Ultra 2', img:'images/ultra_natural.png', price:90000, stock:4,
      desc:'Самые прочные и автономные часы Apple. Титан, до 36 часов.', colors:['Натуральный титан','Чёрный титан'],
      colorImages:{'Натуральный титан':'images/ultra_natural.png','Чёрный титан':'images/ultra_black.png'} },
    { id:'sportband', brand:'Apple', cat:'watch', name:'Ремешок Sport Band', img:'images/band_sport.png', price:5000, stock:20,
      desc:'Мягкий силиконовый ремешок для спорта.', colors:['Чёрный','Синий','Белый','Красный'] },
    { id:'milanese', brand:'Apple', cat:'watch', name:'Ремешок Миланская петля', img:'images/band_milanese.png', price:9000, stock:12,
      desc:'Элегантный ремешок из нержавеющей стали с магнитной застёжкой.', colors:['Золотой','Серебристый','Графитовый'] },

    // ===== Apple — аксессуары =====
    { id:'airpodspro', brand:'Apple', cat:'acc', name:'AirPods Pro 2', img:'images/airpods.png', price:22000, stock:12,
      desc:'Наушники с активным шумоподавлением.', colors:[] },
    { id:'airpods4', brand:'Apple', cat:'acc', name:'AirPods 4', img:'images/airpods4.png', price:15000, stock:16,
      desc:'Новые AirPods с чипом H2 и улучшенным звуком.', colors:[] },
    { id:'case', brand:'Apple', cat:'acc', name:'Чехол iPhone (MagSafe)', img:'images/case_black.png', price:5000, stock:20,
      desc:'Силиконовый чехол с MagSafe. Выбери свой цвет: фото меняется под него.',
      colors:['Чёрный','Светлый мох','Ваниль','Тёмно-синий'],
      colorImages:{ 'Чёрный':'images/case_black.png', 'Светлый мох':'images/case_moss.png', 'Ваниль':'images/case_vanilla.png', 'Тёмно-синий':'images/case_midnight.png' } },
    { id:'powerbank', brand:'Apple', cat:'acc', name:'Повербанк MagSafe', img:'images/powerbank.png', price:9000, stock:15,
      desc:'Магнитная батарея. Крепится к iPhone и заряжает без проводов.', colors:[] },
    { id:'pencil', brand:'Apple', cat:'acc', name:'Apple Pencil Pro', img:'images/pencil.png', price:15000, stock:10,
      desc:'Стилус для точного рисования и заметок.', colors:[] },
    { id:'airtag', brand:'Apple', cat:'acc', name:'AirTag', img:'images/airtag.png', price:3500, stock:25,
      desc:'Маленький трекер для ключей и сумок.', colors:[] },

    // ===== SAMSUNG =====
    { id:'s24ultra', brand:'Samsung', cat:'tech', name:'Samsung Galaxy S24 Ultra', img:'images/samsung_s24.png', price:110000, stock:7,
      desc:'Титановый корпус, встроенный S Pen, камера 200 Мп и Galaxy AI.', colors:['Титановый серый','Титановый чёрный','Титановый фиолетовый','Титановый жёлтый'] },
    { id:'galaxywatch', brand:'Samsung', cat:'watch', name:'Samsung Galaxy Watch7', img:'images/samsung_watch.png', price:30000, stock:9,
      desc:'Умные часы с датчиками здоровья и Galaxy AI.', colors:['Зелёный','Кремовый','Серебристый'] },

    // ===== REDMI =====
    { id:'redminote13pro', brand:'Redmi', cat:'tech', name:'Redmi Note 13 Pro', img:'images/redmi_note13pro.png', price:28000, stock:15,
      desc:'Камера 200 Мп, AMOLED 120 Гц, быстрая зарядка 67 Вт.', colors:['Фиолетовый','Чёрный','Синий'] },
    { id:'redminote13', brand:'Redmi', cat:'tech', name:'Redmi Note 13', img:'images/redmi_note13.png', price:20000, stock:18,
      desc:'Большой AMOLED-экран, камера 108 Мп, ёмкий аккумулятор.', colors:['Синий','Чёрный','Мятный'] },

    // ===== POCO =====
    { id:'pocox6pro', brand:'POCO', cat:'tech', name:'POCO X6 Pro', img:'images/poco_x6pro.png', price:32000, stock:12,
      desc:'Процессор Dimensity 8300, AMOLED 120 Гц, зарядка 67 Вт.', colors:['Жёлтый','Чёрный','Серый'] },
    { id:'pocox6', brand:'POCO', cat:'tech', name:'POCO X6', img:'images/poco_x6.png', price:25000, stock:14,
      desc:'Яркий AMOLED-дисплей, камера 64 Мп, быстрая зарядка.', colors:['Синий','Белый','Чёрный'] },
];

// минимальная цена конфигуратора (для карточки «от ... ₽»)
function minPrice(p) {
    if (p.type === 'config') {
        const vmin = Math.min(...p.versions.map(v => v.price));
        const smin = Math.min(...p.storage.map(s => s.add));
        return vmin + smin;
    }
    return p.price;
}

function findProduct(id) { return products.find(p => p.id === id); }
