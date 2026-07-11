// === Общий список товаров (используется магазином и страницей товара) ===
const products = [
    // ===== APPLE =====
    { id:'macbookair', brand:'Apple', cat:'tech', name:'MacBook Air M3', img:'images/macbook.jpg', price:120000, stock:5,
      desc:'Тонкий и лёгкий ноутбук на чипе M3. До 18 часов работы, дисплей Liquid Retina.',
      colors:['Серебристый','Серый космос','Синий','Сияющая звезда'] },
    { id:'macbookpro', brand:'Apple', cat:'tech', name:'MacBook Pro 14', img:'images/macbookpro.jpg', price:240000, stock:3,
      desc:'Профессиональный ноутбук с дисплеем Liquid Retina XDR.', colors:['Серебристый','Серый космос'] },
    { id:'imac', brand:'Apple', cat:'tech', name:'iMac 24"', img:'images/imac.jpg', price:170000, stock:4,
      desc:'Моноблок с ярким дисплеем 4.5K в семи цветах.', colors:['Синий','Зелёный','Розовый','Серебристый'] },
    { id:'macmini', brand:'Apple', cat:'tech', name:'Mac mini M2', img:'images/macmini.jpg', price:65000, stock:7,
      desc:'Компактный настольный компьютер. Маленький корпус — большая мощность.', colors:[] },
    { id:'iphone', brand:'Apple', cat:'tech', name:'iPhone 15 Pro', img:'images/iphone.jpg', price:110000, stock:8,
      desc:'Титановый корпус, чип A17 Pro, камера Pro-уровня.', colors:['Титановый синий','Титановый натуральный','Титановый белый','Титановый чёрный'] },
    { id:'ipad', brand:'Apple', cat:'tech', name:'iPad Air', img:'images/ipad.jpg', price:70000, stock:0,
      desc:'Лёгкий и мощный планшет с поддержкой Apple Pencil Pro.', colors:['Синий','Фиолетовый','Розовый','Серый космос'] },
    { id:'watch', brand:'Apple', cat:'watch', name:'Apple Watch Series 11', img:'images/applewatch.jpg', price:45000, stock:6,
      desc:'Умные часы для здоровья и спорта.', colors:['Тёмная ночь','Сияющая звезда','Серебристый'] },
    { id:'ultra', brand:'Apple', cat:'watch', name:'Apple Watch Ultra 2', img:'images/applewatchultra.jpg', price:90000, stock:4,
      desc:'Самые прочные и автономные часы Apple. Титан, до 36 часов работы.', colors:['Натуральный титан','Чёрный титан'] },
    { id:'sportband', brand:'Apple', cat:'watch', name:'Ремешок Sport Band', img:'images/band_sport.jpg', price:5000, stock:20,
      desc:'Мягкий силиконовый ремешок для спорта.', colors:['Чёрный','Синий','Белый','Красный'] },
    { id:'milanese', brand:'Apple', cat:'watch', name:'Ремешок Миланская петля', img:'images/band_milanese.jpg', price:9000, stock:12,
      desc:'Элегантный ремешок из нержавеющей стали с магнитной застёжкой.', colors:['Золотой','Серебристый','Графитовый'] },
    { id:'airpods', brand:'Apple', cat:'acc', name:'AirPods Pro 2', img:'images/airpods.jpg', price:22000, stock:12,
      desc:'Наушники с активным шумоподавлением.', colors:[] },
    { id:'case', brand:'Apple', cat:'acc', name:'Чехол iPhone (MagSafe)', img:'images/case.jpg', price:5000, stock:20,
      desc:'Силиконовый чехол с MagSafe.', colors:['Чёрный','Синий','Розовый','Тёмно-зелёный'] },
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

function findProduct(id) { return products.find(p => p.id === id); }
