// === Общий список товаров (магазин + страница товара) ===
// type:'config' — товар с выбором версии/памяти/цвета. Иначе — обычный товар.

const iStorageOld = [{name:'128 ГБ',add:0},{name:'256 ГБ',add:8000},{name:'512 ГБ',add:18000}];
const iStorageNew = [{name:'128 ГБ',add:0},{name:'256 ГБ',add:9000},{name:'512 ГБ',add:20000},{name:'1 ТБ',add:34000}];
const iPadStorage = [{name:'128 ГБ',add:0},{name:'256 ГБ',add:10000},{name:'512 ГБ',add:22000},{name:'1 ТБ',add:40000}];

const products = [
    // ===== iPhone — конфигураторы по поколениям =====
    { id:'iphone13', brand:'Apple', cat:'tech', name:'iPhone 13', img:'images/ip13.jpg', type:'config', stock:12,
      desc:'Выбери версию, память и цвет. Чип A15 Bionic, экран Super Retina XDR.',
      storage:iStorageOld,
      versions:[
        {name:'iPhone 13', price:35000, img:'images/ip13.jpg', colors:['Тёмная ночь','Сияющая звезда','Синий','Розовый','Красный'],
          colorImages:{'Тёмная ночь':'images/ip13_midnight.jpg','Сияющая звезда':'images/ip13_starlight.jpg','Синий':'images/ip13_blue.jpg','Розовый':'images/ip13_pink.jpg','Красный':'images/ip13_red.jpg'}},
        {name:'iPhone 13 Pro', price:44000, img:'images/ip13pro.jpg', colors:['Графитовый','Золотой','Серебристый','Небесно-голубой']},
        {name:'iPhone 13 Pro Max', price:50000, img:'images/ip13promax.jpg', colors:['Графитовый','Золотой','Серебристый','Небесно-голубой']},
      ] },
    { id:'iphone14', brand:'Apple', cat:'tech', name:'iPhone 14', img:'images/ip14.jpg', type:'config', stock:12,
      desc:'Выбери версию, память и цвет. Dynamic Island (Pro), камера 48 Мп.',
      storage:iStorageOld,
      versions:[
        {name:'iPhone 14', price:46000, img:'images/ip14.jpg', colors:['Тёмная ночь','Сияющая звезда','Синий','Фиолетовый','Красный'],
          colorImages:{'Тёмная ночь':'images/ip14_midnight.jpg','Сияющая звезда':'images/ip14_starlight.jpg','Синий':'images/ip14_blue.jpg','Фиолетовый':'images/ip14_purple.jpg','Красный':'images/ip14_red.jpg'}},
        {name:'iPhone 14 Pro', price:57000, img:'images/ip14pro.jpg', colors:['Космический чёрный','Серебристый','Золотой','Тёмно-фиолетовый'],
          colorImages:{'Космический чёрный':'images/ip14pro_spaceblack.jpg','Серебристый':'images/ip14pro_silver.jpg','Золотой':'images/ip14pro_gold.jpg','Тёмно-фиолетовый':'images/ip14pro_deeppurple.jpg'}},
        {name:'iPhone 14 Pro Max', price:65000, img:'images/ip14promax.jpg', colors:['Космический чёрный','Серебристый','Золотой','Тёмно-фиолетовый'],
          colorImages:{'Космический чёрный':'images/ip14promax_spaceblack.jpg','Серебристый':'images/ip14promax_silver.jpg','Золотой':'images/ip14promax_gold.jpg','Тёмно-фиолетовый':'images/ip14promax_deeppurple.jpg'}},
      ] },
    { id:'iphone15', brand:'Apple', cat:'tech', name:'iPhone 15', img:'images/ip15.jpg', type:'config', stock:14,
      desc:'Выбери версию, память и цвет. USB-C, Dynamic Island, титан (Pro).',
      storage:iStorageNew,
      versions:[
        {name:'iPhone 15', price:50000, img:'images/ip15.jpg', colors:['Чёрный','Синий','Зелёный','Жёлтый','Розовый'],
          colorImages:{'Чёрный':'images/ip15_black.jpg','Синий':'images/ip15_blue.jpg','Зелёный':'images/ip15_green.jpg','Жёлтый':'images/ip15_yellow.jpg','Розовый':'images/ip15_pink.jpg'}},
        {name:'iPhone 15 Pro', price:66000, img:'images/ip15pro.jpg', colors:['Титановый чёрный','Титановый белый','Титановый синий','Титановый натуральный'],
          colorImages:{'Титановый чёрный':'images/ip15pro_black-titanium.jpg','Титановый белый':'images/ip15pro_white-titanium.jpg','Титановый синий':'images/ip15pro_blue-titanium.jpg','Титановый натуральный':'images/ip15pro_natural-titanium.jpg'}},
        {name:'iPhone 15 Pro Max', price:78000, img:'images/ip15promax.jpg', colors:['Титановый чёрный','Титановый белый','Титановый синий','Титановый натуральный'],
          colorImages:{'Титановый чёрный':'images/ip15promax_black-titanium.jpg','Титановый белый':'images/ip15promax_white-titanium.jpg','Титановый синий':'images/ip15promax_blue-titanium.jpg','Титановый натуральный':'images/ip15promax_natural-titanium.jpg'}},
      ] },
    { id:'iphone16', brand:'Apple', cat:'tech', name:'iPhone 16', img:'images/ip16.jpg', type:'config', stock:12,
      desc:'Выбери версию, память и цвет. Чип A18, кнопка камеры, Apple Intelligence.',
      storage:iStorageNew,
      versions:[
        {name:'iPhone 16', price:62000, img:'images/ip16.jpg', colors:['Чёрный','Белый','Розовый','Бирюзовый','Ультрамарин'],
          colorImages:{'Чёрный':'images/ip16_black.jpg','Белый':'images/ip16_white.jpg','Розовый':'images/ip16_pink.jpg','Бирюзовый':'images/ip16_teal.jpg','Ультрамарин':'images/ip16_ultramarine.jpg'}},
        {name:'iPhone 16 Pro', price:80000, img:'images/ip16pro.jpg', colors:['Титановый чёрный','Титановый белый','Титановый натуральный','Пустынный титан'],
          colorImages:{'Титановый чёрный':'images/ip16pro_black-titanium.jpg','Титановый белый':'images/ip16pro_white-titanium.jpg','Титановый натуральный':'images/ip16pro_natural-titanium.jpg','Пустынный титан':'images/ip16pro_desert-titanium.jpg'}},
        {name:'iPhone 16 Pro Max', price:90000, img:'images/ip16promax.jpg', colors:['Титановый чёрный','Титановый белый','Титановый натуральный','Пустынный титан'],
          colorImages:{'Титановый чёрный':'images/ip16promax_black-titanium.jpg','Титановый белый':'images/ip16promax_white-titanium.jpg','Титановый натуральный':'images/ip16promax_natural-titanium.jpg','Пустынный титан':'images/ip16promax_desert-titanium.jpg'}},
      ] },
    { id:'iphone17', brand:'Apple', cat:'tech', name:'iPhone 17', img:'images/ip17.jpg', type:'config', stock:10,
      desc:'Выбери версию, память и цвет. Новейшее поколение, топовая камера.',
      storage:iStorageNew,
      versions:[
        {name:'iPhone 17', price:69000, img:'images/ip17.jpg', colors:['Чёрный','Белый','Синий','Лавандовый'],
          colorImages:{'Чёрный':'images/ip17_black.jpg','Белый':'images/ip17_white.jpg','Синий':'images/ip17_mist-blue.jpg','Лавандовый':'images/ip17_lavender.jpg'}},
        {name:'iPhone 17 Pro', price:82000, img:'images/ip17pro.jpg', colors:['Космический оранжевый','Тёмно-синий','Серебристый'],
          colorImages:{'Космический оранжевый':'images/ip17pro_cosmic-orange.jpg','Тёмно-синий':'images/ip17pro_deep-blue.jpg','Серебристый':'images/ip17pro_silver.jpg'}},
        {name:'iPhone 17 Pro Max', price:95000, img:'images/ip17promax.jpg', colors:['Космический оранжевый','Тёмно-синий','Серебристый'],
          colorImages:{'Космический оранжевый':'images/ip17promax_cosmic-orange.jpg','Тёмно-синий':'images/ip17promax_deep-blue.jpg','Серебристый':'images/ip17promax_silver.jpg'}},
      ] },

    // ===== СКОРО =====
    { id:'ip18', brand:'Apple', cat:'tech', name:'iPhone 18', img:'images/ip17promax.jpg', price:0, stock:0,
      soon:true, release:'20 сентября 2026',
      desc:'Новое поколение iPhone. Скоро в продаже — оформи предзаказ в Telegram.', colors:[] },

    // ===== iPad — конфигуратор =====
    { id:'ipad', brand:'Apple', cat:'tech', name:'iPad', img:'images/ipad10.jpg', type:'config', stock:10,
      desc:'Выбери модель, память и цвет. От доступного iPad до профессионального iPad Pro.',
      storage:iPadStorage,
      versions:[
        {name:'iPad (10-е поколение)', price:40000, img:'images/ipad10.jpg', colors:['Синий','Розовый','Жёлтый','Серебристый'],
          colorImages:{'Синий':'images/ipad_blue.jpg','Розовый':'images/ipad_pink.jpg','Жёлтый':'images/ipad_yellow.jpg','Серебристый':'images/ipad_silver.jpg'}},
        {name:'iPad Air', price:70000, img:'images/ipad.jpg', colors:['Синий','Фиолетовый','Розовый','Серый космос']},
        {name:'iPad Pro 11"', price:120000, img:'images/ipadpro.jpg', colors:['Серебристый','Серый космос']},
      ] },

    // ===== Apple — компьютеры =====
    { id:'macbookair', brand:'Apple', cat:'tech', name:'MacBook Air M3', img:'images/macbook.jpg', price:120000, stock:5,
      desc:'Тонкий и лёгкий ноутбук на чипе M3. До 18 часов работы.', colors:['Серебристый','Серый космос','Синий','Сияющая звезда'] },
    { id:'macbookpro', brand:'Apple', cat:'tech', name:'MacBook Pro 14', img:'images/macbookpro.jpg', price:240000, stock:3,
      desc:'Профессиональный ноутбук с дисплеем Liquid Retina XDR.', colors:['Серебристый','Серый космос'] },
    { id:'imac', brand:'Apple', cat:'tech', name:'iMac 24"', img:'images/imac.jpg', price:170000, stock:4,
      desc:'Моноблок с ярким дисплеем 4.5K в семи цветах.', colors:['Синий','Зелёный','Розовый','Серебристый'] },
    { id:'macmini', brand:'Apple', cat:'tech', name:'Mac mini M2', img:'images/macmini.jpg', price:65000, stock:7,
      desc:'Компактный настольный компьютер. Маленький корпус — большая мощность.', colors:[] },

    // ===== Apple — часы и ремешки =====
    { id:'watchse', brand:'Apple', cat:'watch', name:'Apple Watch SE', img:'images/se_midnight.jpg', price:30000, stock:11,
      desc:'Умные часы по доступной цене. Все главные функции для здоровья и спорта.', colors:['Тёмная ночь','Сияющая звезда'],
      colorImages:{'Тёмная ночь':'images/se_midnight.jpg','Сияющая звезда':'images/se_starlight.jpg'} },
    { id:'watch', brand:'Apple', cat:'watch', name:'Apple Watch Series 11', img:'images/applewatch.jpg', price:45000, stock:6,
      desc:'Умные часы для здоровья и спорта.', colors:['Тёмная ночь','Сияющая звезда','Серебристый'] },
    { id:'ultra', brand:'Apple', cat:'watch', name:'Apple Watch Ultra 2', img:'images/ultra_natural.jpg', price:90000, stock:4,
      desc:'Самые прочные и автономные часы Apple. Титан, до 36 часов.', colors:['Натуральный титан','Чёрный титан'],
      colorImages:{'Натуральный титан':'images/ultra_natural.jpg','Чёрный титан':'images/ultra_black.jpg'} },
    { id:'sportband', brand:'Apple', cat:'watch', name:'Ремешок Sport Band', img:'images/band_sport.jpg', price:5000, stock:20,
      desc:'Мягкий силиконовый ремешок для спорта.', colors:['Чёрный','Синий','Белый','Красный'] },
    { id:'milanese', brand:'Apple', cat:'watch', name:'Ремешок Миланская петля', img:'images/band_milanese.jpg', price:9000, stock:12,
      desc:'Элегантный ремешок из нержавеющей стали с магнитной застёжкой.', colors:['Золотой','Серебристый','Графитовый'] },

    // ===== Apple — аксессуары =====
    { id:'airpodspro', brand:'Apple', cat:'acc', name:'AirPods Pro 2', img:'images/airpods.jpg', price:22000, stock:12,
      desc:'Наушники с активным шумоподавлением.', colors:[] },
    { id:'airpods4', brand:'Apple', cat:'acc', name:'AirPods 4', img:'images/airpods4.jpg', price:15000, stock:16,
      desc:'Новые AirPods с чипом H2 и улучшенным звуком.', colors:[] },
    { id:'case', brand:'Apple', cat:'acc', name:'Чехол iPhone (MagSafe)', img:'images/case_black.jpg', price:5000, stock:20,
      desc:'Силиконовый чехол с MagSafe. Выбери свой цвет — фото меняется под него.',
      colors:['Чёрный','Светлый мох','Ваниль','Тёмно-синий'],
      colorImages:{ 'Чёрный':'images/case_black.jpg', 'Светлый мох':'images/case_moss.jpg', 'Ваниль':'images/case_vanilla.jpg', 'Тёмно-синий':'images/case_midnight.jpg' } },
    { id:'powerbank', brand:'Apple', cat:'acc', name:'Повербанк MagSafe', img:'images/powerbank.jpg', price:9000, stock:15,
      desc:'Магнитная батарея. Крепится к iPhone и заряжает без проводов.', colors:[] },
    { id:'pencil', brand:'Apple', cat:'acc', name:'Apple Pencil Pro', img:'images/pencil.jpg', price:15000, stock:10,
      desc:'Стилус для точного рисования и заметок.', colors:[] },
    { id:'airtag', brand:'Apple', cat:'acc', name:'AirTag', img:'images/airtag.jpg', price:3500, stock:25,
      desc:'Маленький трекер для ключей и сумок.', colors:[] },

    // ===== SAMSUNG =====
    { id:'s24ultra', brand:'Samsung', cat:'tech', name:'Samsung Galaxy S24 Ultra', img:'images/samsung_s24.jpg', price:110000, stock:7,
      desc:'Титановый корпус, встроенный S Pen, камера 200 Мп и Galaxy AI.', colors:['Титановый серый','Титановый чёрный','Титановый фиолетовый','Титановый жёлтый'] },
    { id:'galaxywatch', brand:'Samsung', cat:'watch', name:'Samsung Galaxy Watch7', img:'images/samsung_watch.jpg', price:30000, stock:9,
      desc:'Умные часы с датчиками здоровья и Galaxy AI.', colors:['Зелёный','Кремовый','Серебристый'] },

    // ===== REDMI =====
    { id:'redminote13pro', brand:'Redmi', cat:'tech', name:'Redmi Note 13 Pro', img:'images/redmi_note13pro.jpg', price:28000, stock:15,
      desc:'Камера 200 Мп, AMOLED 120 Гц, быстрая зарядка 67 Вт.', colors:['Фиолетовый','Чёрный','Синий'] },
    { id:'redminote13', brand:'Redmi', cat:'tech', name:'Redmi Note 13', img:'images/redmi_note13.jpg', price:20000, stock:18,
      desc:'Большой AMOLED-экран, камера 108 Мп, ёмкий аккумулятор.', colors:['Синий','Чёрный','Мятный'] },

    // ===== POCO =====
    { id:'pocox6pro', brand:'POCO', cat:'tech', name:'POCO X6 Pro', img:'images/poco_x6pro.jpg', price:32000, stock:12,
      desc:'Процессор Dimensity 8300, AMOLED 120 Гц, зарядка 67 Вт.', colors:['Жёлтый','Чёрный','Серый'] },
    { id:'pocox6', brand:'POCO', cat:'tech', name:'POCO X6', img:'images/poco_x6.jpg', price:25000, stock:14,
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
