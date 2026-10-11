/* ============================================================
   Technic Store — CMS-движок (общий для всех страниц)
   База данных (localStorage) + админка + окно заказа + подвал + Telegram-кнопка
   Подключается на index/store, product, order. Данные-семя берёт из products.js.
============================================================ */
(function(){
  "use strict";

  /* ---------- стандартные данные ---------- */
  const LS = { prod:'zerus_products', cats:'zerus_categories', store:'zerus_store', admin:'zerus_admin', content:'zerus_content' };
  const DEFAULT_CATEGORIES = ['Apple','Samsung','Redmi','POCO','Часы','Аксессуары'];
  const DEFAULT_STORE = {
    name:'Technic Store',
    about:'Магазин техники Apple, Samsung, Redmi и POCO. Официально, с гарантией и доставкой по всей России.',
    address:'Укажите адрес магазина в админке',
    hours:'Пн–Вс: 10:00–21:00',
    telegram:'zerus9501', whatsapp:'', instagram:'',
    currency:'₽', hero:''
  };
  const DEFAULT_ADMIN = { user:'admin', pass:'zerus2026' };
  const PLACEHOLDER = 'https://picsum.photos/seed/technic/700/700';

  const clone = o => JSON.parse(JSON.stringify(o));
  function seedProducts(){ return (typeof products !== 'undefined' && Array.isArray(products)) ? clone(products) : []; }

  const DB = {
    load(key, def){ try{ const v=localStorage.getItem(key); return v?JSON.parse(v):clone(def); }catch(e){ return clone(def); } },
    save(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); return true; }
      catch(e){ toast('Недостаточно места в браузере — используйте ссылки на фото вместо загрузки.'); return false; } },
    products(){ return this.load(LS.prod, seedProducts()); },
    categories(){ return this.load(LS.cats, DEFAULT_CATEGORIES); },
    store(){ return Object.assign(clone(DEFAULT_STORE), this.load(LS.store, {})); },
    admin(){ return Object.assign(clone(DEFAULT_ADMIN), this.load(LS.admin, {})); },
    content(){ return this.load(LS.content, {}); }
  };

  /* категория товара (для каталога) */
  function catOf(p){
    if(p.category) return p.category;
    if(p.cat==='watch') return 'Часы';
    if(p.cat==='acc')   return 'Аксессуары';
    return p.brand || 'Другое';
  }
  function applyMeta(list){
    list.forEach(p=>{
      if(!p.category) p.category = catOf(p);
      if(!p.specs) p.specs = [];
      if(!p.img) p.img = PLACEHOLDER;
    });
    return list;
  }

  /* живые данные */
  let PRODUCTS=[], CATEGORIES=[], STORE={}, CONTENT={};
  function loadData(){
    PRODUCTS = applyMeta(DB.products());
    CATEGORIES = DB.categories();
    STORE = DB.store();
    CONTENT = DB.content();
  }

  /* ---------- helpers ---------- */
  const $ = s => document.querySelector(s);
  const esc = s => String(s==null?'':s).replace(/[&<>"]/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
  function money(n){ n = +n||0; return n.toLocaleString('ru-RU') + ' ' + (STORE.currency||'₽'); }
  function priceOf(p){ return (p.type==='config' && typeof minPrice==='function') ? minPrice(p) : (p.price||0); }
  function isConfig(p){ return p.type==='config'; }
  let toastT;
  function toast(m){ const el=$('#cmsToast'); if(!el){ return; } el.textContent=m; el.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('show'),2300); }

  /* ---------- CSS ---------- */
  const CSS = `
  :root{ --c-bg:#0A0A0C; --c-surf:#141418; --c-surf2:#1B1B21; --c-line:rgba(255,255,255,.08); --c-line2:rgba(255,255,255,.15);
    --c-blue:#2F6BFF; --c-blue2:#5a86ff; --c-blue-s:rgba(47,107,255,.14); --c-gold:#2F6BFF; --c-gold-s:rgba(47,107,255,.14);
    --c-text:#F5F5F7; --c-mut:#9A9AA3; --c-mut2:#6A6A73; --c-inp:rgba(255,255,255,.04); --c-inp2:rgba(255,255,255,.07);
    --c-bar:#101014; --c-ovr:rgba(0,0,0,.68); --c-disp:'Space Grotesk',sans-serif; --c-sans:'Manrope',-apple-system,sans-serif; }
  :root[data-theme="light"]{ --c-bg:#F5F5F7; --c-surf:#FFFFFF; --c-surf2:#FFFFFF; --c-line:rgba(0,0,0,.09); --c-line2:rgba(0,0,0,.14);
    --c-blue:#0A5FE0; --c-blue2:#0A5FE0; --c-blue-s:rgba(10,95,224,.1); --c-gold:#0A5FE0; --c-gold-s:rgba(10,95,224,.1);
    --c-text:#1D1D1F; --c-mut:#6E6E73; --c-mut2:#9093A0; --c-inp:rgba(0,0,0,.035); --c-inp2:rgba(0,0,0,.06);
    --c-bar:#FFFFFF; --c-ovr:rgba(0,0,0,.4); }
  #cmsToast{ position:fixed; bottom:92px; left:50%; transform:translateX(-50%) translateY(16px); z-index:4000; background:var(--c-surf2); border:1px solid var(--c-line2);
    color:var(--c-text); font-family:var(--c-sans); padding:12px 24px; border-radius:12px; font-size:.86rem; opacity:0; pointer-events:none; transition:.35s cubic-bezier(.2,.7,.3,1); }
  #cmsToast.show{ opacity:1; transform:translateX(-50%); }
  .cms-modal{ position:fixed; inset:0; z-index:5000; display:flex; align-items:center; justify-content:center; padding:20px; font-family:var(--c-sans);
    background:var(--c-ovr); opacity:0; pointer-events:none; transition:opacity .3s; }
  .cms-modal.open{ opacity:1; pointer-events:auto; }
  .cms-modal .box{ width:min(560px,100%); max-height:90vh; overflow-y:auto; background:var(--c-surf); border:1px solid var(--c-line2); border-radius:18px; color:var(--c-text);
    transform:translateY(14px) scale(.985); transition:transform .3s; }
  .cms-modal.open .box{ transform:none; }
  .cms-mh{ display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid var(--c-line); position:sticky; top:0; background:var(--c-surf); z-index:2; }
  .cms-mh h3{ font-family:var(--c-disp); font-size:1.4rem; font-weight:600; margin:0; }
  .cms-x{ width:34px; height:34px; display:grid; place-items:center; border:none; background:none; color:var(--c-mut); font-size:1.2rem; cursor:pointer; border-radius:8px; }
  .cms-x:hover{ color:var(--c-gold); }
  .cms-mb{ padding:22px 24px; } .cms-mf{ padding:18px 24px; border-top:1px solid var(--c-line); display:flex; gap:12px; }
  .cms-btn{ display:inline-flex; align-items:center; justify-content:center; gap:8px; border-radius:999px; padding:12px 22px; font-family:var(--c-sans); font-weight:500; font-size:.88rem; cursor:pointer; border:1px solid var(--c-line2); background:transparent; color:var(--c-text); transition:.2s; }
  .cms-btn:hover{ border-color:var(--c-gold); color:var(--c-gold); }
  .cms-btn.pri{ background:var(--c-blue); border-color:var(--c-blue); color:#fff; } .cms-btn.pri:hover{ background:var(--c-blue2); color:#fff; }
  .cms-btn.gold{ background:var(--c-gold); border-color:var(--c-gold); color:#fff; } .cms-btn.gold:hover{ filter:brightness(1.07); color:#fff; }
  .cms-btn.block{ width:100%; }
  .cms-hint{ font-size:.8rem; color:var(--c-mut); line-height:1.6; } .cms-hint b{ color:var(--c-text); }
  .cms-fld{ margin-bottom:15px; } .cms-fld label{ display:block; font-family:var(--c-disp); font-size:.62rem; letter-spacing:.16em; text-transform:uppercase; color:var(--c-mut); margin-bottom:7px; }
  .cms-inp{ width:100%; background:var(--c-inp); color:var(--c-text); border:1px solid var(--c-line2); border-radius:10px; padding:11px 14px; font-family:var(--c-sans); font-size:.9rem; outline:none; }
  .cms-inp:focus{ border-color:var(--c-blue); } textarea.cms-inp{ resize:vertical; min-height:84px; line-height:1.5; }
  .cms-row2{ display:grid; grid-template-columns:1fr 1fr; gap:13px; }
  .cms-chips{ display:flex; flex-wrap:wrap; gap:8px; } .cms-chip{ font-size:.74rem; padding:8px 13px; border:1px solid var(--c-line2); border-radius:9px; cursor:pointer; user-select:none; transition:.2s; }
  .cms-chip.on{ border-color:var(--c-blue); color:var(--c-blue2); background:var(--c-blue-s); }
  .cms-file{ display:inline-flex; align-items:center; gap:8px; font-size:.64rem; letter-spacing:.1em; text-transform:uppercase; padding:10px 15px; border:1px solid var(--c-line2); border-radius:9px; cursor:pointer; transition:.2s; }
  .cms-file:hover{ border-color:var(--c-gold); color:var(--c-gold); }
  /* order channels */
  .cms-ch{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:10px; margin:16px 0 18px; }
  .cms-chb{ display:flex; flex-direction:column; align-items:center; gap:8px; padding:16px 6px; border:1px solid var(--c-line2); border-radius:12px; cursor:pointer; color:var(--c-text); transition:.2s; }
  .cms-chb:hover{ border-color:var(--c-gold); transform:translateY(-2px); } .cms-chb i{ font-size:1.5rem; } .cms-chb span{ font-size:.58rem; letter-spacing:.1em; text-transform:uppercase; }
  .cms-ot{ width:100%; min-height:150px; background:var(--c-inp); color:var(--c-text); border:1px solid var(--c-line2); border-radius:10px; padding:13px; font-family:var(--c-sans); font-size:.84rem; line-height:1.5; resize:vertical; }
  /* admin panel */
  .cms-admin{ position:fixed; inset:0; z-index:4800; background:var(--c-bg); color:var(--c-text); font-family:var(--c-sans); overflow-y:auto; opacity:0; pointer-events:none; transition:opacity .3s; }
  .cms-admin.open{ opacity:1; pointer-events:auto; }
  .cms-atop{ position:sticky; top:0; z-index:5; display:flex; align-items:center; justify-content:space-between; gap:12px; padding:15px clamp(14px,4vw,36px); background:var(--c-surf); backdrop-filter:blur(14px); border-bottom:1px solid var(--c-line); }
  .cms-atop .tt{ font-family:var(--c-disp); font-size:1.3rem; } .cms-atop .tt b{ color:var(--c-gold); }
  .cms-atabs{ display:flex; gap:6px; flex-wrap:wrap; padding:16px clamp(14px,4vw,36px) 0; }
  .cms-atab{ font-size:.62rem; letter-spacing:.14em; text-transform:uppercase; color:var(--c-mut); padding:10px 15px; border:1px solid var(--c-line2); border-radius:9px; background:none; cursor:pointer; transition:.2s; font-family:var(--c-sans); }
  .cms-atab.on{ color:var(--c-gold); border-color:var(--c-gold); }
  .cms-abody{ padding:20px clamp(14px,4vw,36px) 90px; max-width:1040px; }
  .cms-sech{ display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:16px; }
  .cms-sech h2{ font-family:var(--c-disp); font-size:1.5rem; margin:0; }
  .cms-arow{ display:flex; align-items:center; gap:13px; padding:11px 13px; border:1px solid var(--c-line); border-radius:11px; margin-bottom:9px; background:var(--c-surf); }
  .cms-arow img{ width:44px; height:44px; object-fit:contain; background:var(--c-inp); border-radius:8px; flex-shrink:0; }
  .cms-arow .i{ flex:1; min-width:0; } .cms-arow .n{ font-size:.86rem; } .cms-arow .m{ font-size:.72rem; color:var(--c-mut); margin-top:2px; }
  .cms-arow .acts{ display:flex; gap:7px; flex-shrink:0; }
  .cms-mini{ font-size:.56rem; letter-spacing:.12em; text-transform:uppercase; padding:8px 12px; border:1px solid var(--c-line2); border-radius:8px; background:none; color:var(--c-text); cursor:pointer; white-space:nowrap; transition:.2s; }
  .cms-mini:hover{ border-color:var(--c-gold); color:var(--c-gold); } .cms-mini.danger:hover{ border-color:#e06a5a; color:#e06a5a; }
  .cms-empty{ color:var(--c-mut); padding:32px 0; text-align:center; }
  .cms-login-ic{ width:48px; height:48px; border-radius:50%; background:var(--c-gold-s); display:grid; place-items:center; margin:0 auto 14px; color:var(--c-gold); font-size:1.4rem; }
  /* admin bar + inline */
  #cmsBar{ position:fixed; top:0; left:0; right:0; z-index:4600; display:none; align-items:center; gap:10px; height:44px; padding:0 clamp(12px,3vw,22px);
    background:var(--c-bar); border-bottom:1px solid var(--c-gold); color:var(--c-text); font-family:var(--c-sans); font-size:.62rem; letter-spacing:.14em; text-transform:uppercase; }
  body.cms-admin-on #cmsBar{ display:flex; }
  #cmsBar .d{ width:7px; height:7px; border-radius:50%; background:var(--c-gold); box-shadow:0 0 9px var(--c-gold); flex-shrink:0; }
  #cmsBar .t{ color:var(--c-gold); white-space:nowrap; } #cmsBar .sp{ flex:1; }
  #cmsBar button{ font:inherit; letter-spacing:.12em; text-transform:uppercase; color:var(--c-text); background:none; border:1px solid rgba(255,255,255,.2); border-radius:7px; padding:7px 12px; cursor:pointer; white-space:nowrap; transition:.2s; }
  #cmsBar button:hover{ border-color:var(--c-gold); color:var(--c-gold); } #cmsBar button.pri{ background:var(--c-gold); color:#fff; border-color:var(--c-gold); }
  body.cms-admin-on{ padding-top:44px; }
  body.cms-admin-on .nav-a, body.cms-admin-on .navbar-apple{ top:44px!important; }
  .cms-inline{ display:inline-flex; align-items:center; gap:7px; font-size:.6rem; letter-spacing:.12em; text-transform:uppercase; font-family:var(--c-sans);
    padding:9px 14px; border:1px solid var(--c-gold); color:var(--c-gold); background:var(--c-surf); border-radius:9px; cursor:pointer; transition:.2s; }
  .cms-inline:hover{ background:var(--c-gold); color:#fff; }
  body:not(.cms-admin-on) .cms-inline{ display:none; }
  /* inline content editing affordance */
  body.cms-admin-on [data-edit]{ cursor:pointer; border-radius:5px; outline:1.5px solid transparent; outline-offset:2px; transition:background .18s, outline-color .18s; }
  body.cms-admin-on [data-edit]:hover{ background:var(--c-blue-s); outline-color:var(--c-blue); }
  body.cms-admin-on [data-edit].cms-img-chip{ outline:none; background:none; }
  /* tg float */
  #cmsTg{ position:fixed; right:22px; bottom:22px; z-index:4500; width:56px; height:56px; border-radius:50%; background:#229ED9; display:grid; place-items:center;
    box-shadow:0 14px 34px -10px rgba(34,158,217,.7); color:#fff; font-size:1.6rem; transition:transform .25s; }
  #cmsTg:hover{ transform:translateY(-3px) scale(1.05); color:#fff; }
  /* theme toggle */
  #cmsTheme{ position:fixed; right:22px; bottom:88px; z-index:4500; width:46px; height:46px; border-radius:50%; background:var(--c-surf);
    border:1px solid var(--c-line2); color:var(--c-text); display:grid; place-items:center; font-size:1.15rem; cursor:pointer;
    box-shadow:0 12px 30px -14px rgba(0,0,0,.6); transition:transform .25s, color .2s, border-color .2s; }
  #cmsTheme:hover{ transform:translateY(-3px); color:var(--c-blue2); border-color:var(--c-blue2); }
  body.cms-admin-on #cmsTheme{ bottom:88px; }
  /* footer */
  .cms-foot .fgrid{ display:grid; grid-template-columns:1.5fr 1fr 1.2fr; gap:34px; }
  .cms-foot .fb{ font-family:var(--c-disp); font-weight:700; font-size:1.3rem; display:flex; align-items:center; gap:8px; }
  .cms-foot .fb .dot{ width:7px; height:7px; border-radius:50%; background:var(--c-gold); }
  .cms-foot p{ color:var(--c-mut); font-weight:300; font-size:.9rem; margin-top:12px; max-width:36ch; line-height:1.55; }
  .cms-foot .fh{ font-family:var(--c-disp); font-size:.66rem; letter-spacing:.2em; text-transform:uppercase; color:var(--c-mut2); margin-bottom:13px; }
  .cms-foot .fi{ display:flex; gap:10px; align-items:flex-start; color:var(--c-mut); font-size:.88rem; margin-bottom:11px; font-weight:300; line-height:1.4; }
  .cms-foot .fi i{ color:var(--c-gold); margin-top:2px; } .cms-foot .fi a{ color:var(--c-mut); } .cms-foot .fi a:hover{ color:var(--c-gold); }
  .cms-foot .fcat{ display:block; color:var(--c-mut); font-size:.9rem; margin-bottom:10px; cursor:pointer; } .cms-foot .fcat:hover{ color:var(--c-gold); }
  .cms-foot .fbot{ border-top:1px solid var(--c-line); margin-top:34px; padding-top:20px; color:var(--c-mut2); font-size:.78rem; display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px; }
  @media(max-width:760px){ .cms-foot .fgrid{ grid-template-columns:1fr; gap:26px; } }
  @media(max-width:560px){
    .cms-ch{ grid-template-columns:1fr 1fr 1fr; } .cms-row2{ grid-template-columns:1fr; }
    .cms-modal{ padding:0; align-items:flex-end; } .cms-modal .box{ width:100%; max-height:94vh; border-radius:16px 16px 0 0; }
    #cmsTg{ right:16px; bottom:16px; width:52px; height:52px; }
    #cmsTheme{ right:16px; bottom:78px; width:42px; height:42px; font-size:1.05rem; }
    #cmsBar{ overflow-x:auto; } #cmsBar .d,#cmsBar .t,#cmsBar .sp{ display:none; } #cmsBar button{ flex:0 0 auto; }
    .cms-arow{ flex-wrap:wrap; } .cms-arow .acts{ width:100%; } .cms-mini{ flex:1; text-align:center; }
  }`;

  /* ---------- UI (инъекция общих блоков) ---------- */
  const UI = `
  <div id="cmsToast"></div>
  <button id="cmsTheme" onclick="cmsToggleTheme()" aria-label="Сменить тему"><i class="bi bi-moon-stars"></i></button>
  <a id="cmsTg" href="#" target="_blank" rel="noopener" aria-label="Telegram"><i class="bi bi-telegram"></i></a>
  <div id="cmsBar">
    <span class="d"></span><span class="t">Режим админа</span><span class="sp"></span>
    <button class="pri" onclick="editProduct(null)">+ Товар</button>
    <button onclick="openAdminAt('cats')">Каталог</button>
    <button onclick="openAdminAt('store')">Магазин</button>
    <button onclick="openAdminAt('products')">Панель</button>
    <button onclick="logoutAdmin()">Выйти</button>
  </div>
  <div class="cms-modal" id="cmsOrder"><div class="box">
    <div class="cms-mh"><h3>Оформление заказа</h3><button class="cms-x" onclick="closeOrder()"><i class="bi bi-x-lg"></i></button></div>
    <div class="cms-mb">
      <p class="cms-hint" style="margin-bottom:12px">Выберите, где написать менеджеру. Текст заказа скопируется — вставьте его в чат (или он подставится сам).</p>
      <div class="cms-ch">
        <button class="cms-chb" onclick="sendOrder('whatsapp')"><i class="bi bi-whatsapp" style="color:#25D366"></i><span>WhatsApp</span></button>
        <button class="cms-chb" onclick="sendOrder('telegram')"><i class="bi bi-telegram" style="color:#229ED9"></i><span>Telegram</span></button>
        <button class="cms-chb" onclick="sendOrder('instagram')"><i class="bi bi-instagram" style="color:#E4405F"></i><span>Instagram</span></button>
      </div>
      <label style="font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;color:var(--c-mut);display:block;margin-bottom:8px">Текст заказа</label>
      <textarea class="cms-ot" id="cmsOrderText" readonly></textarea>
    </div>
    <div class="cms-mf"><button class="cms-btn block" onclick="copyOrder()">Скопировать</button><button class="cms-btn pri block" onclick="closeOrder()">Готово</button></div>
  </div></div>
  <div class="cms-modal" id="cmsLogin"><div class="box" style="width:min(410px,100%)">
    <div class="cms-mh"><h3>Вход в админку</h3><button class="cms-x" onclick="closeLogin()"><i class="bi bi-x-lg"></i></button></div>
    <div class="cms-mb">
      <div class="cms-login-ic"><i class="bi bi-lock"></i></div>
      <div class="cms-fld"><label>Логин</label><input class="cms-inp" id="cmsLoginU" autocomplete="username"></div>
      <div class="cms-fld"><label>Пароль</label><input class="cms-inp" id="cmsLoginP" type="password" autocomplete="current-password" onkeydown="if(event.key==='Enter')tryLogin()"></div>
      <div id="cmsLoginErr" style="color:#e06a5a;font-size:.78rem;display:none">Неверный логин или пароль.</div>
    </div>
    <div class="cms-mf"><button class="cms-btn pri block" onclick="tryLogin()">Войти</button></div>
  </div></div>
  <div class="cms-admin" id="cmsAdmin">
    <div class="cms-atop"><div class="tt"><b>Technic</b> · Админка</div>
      <div style="display:flex;gap:10px;align-items:center"><button class="cms-mini" onclick="logoutAdmin()">Выйти</button><button class="cms-x" onclick="closeAdmin()"><i class="bi bi-x-lg"></i></button></div></div>
    <div class="cms-atabs" id="cmsTabs">
      <button class="cms-atab on" data-t="products" onclick="admTab('products')">Товары</button>
      <button class="cms-atab" data-t="cats" onclick="admTab('cats')">Каталог</button>
      <button class="cms-atab" data-t="store" onclick="admTab('store')">Магазин</button>
      <button class="cms-atab" data-t="access" onclick="admTab('access')">Доступ</button>
      <button class="cms-atab" data-t="data" onclick="admTab('data')">База</button>
    </div>
    <div class="cms-abody" id="cmsAdmBody"></div>
  </div>
  <div class="cms-modal" id="cmsForm"><div class="box">
    <div class="cms-mh"><h3 id="cmsFormTitle">Товар</h3><button class="cms-x" onclick="closeForm()"><i class="bi bi-x-lg"></i></button></div>
    <div class="cms-mb" id="cmsFormBody"></div>
    <div class="cms-mf"><button class="cms-btn block" onclick="closeForm()">Отмена</button><button class="cms-btn pri block" id="cmsFormSave">Сохранить</button></div>
  </div></div>
  <div class="cms-modal" id="cmsConfirm"><div class="box" style="width:min(410px,100%)">
    <div class="cms-mh"><h3>Подтверждение</h3></div>
    <div class="cms-mb"><p id="cmsConfirmMsg" style="font-size:.9rem;line-height:1.6;color:var(--c-mut)"></p></div>
    <div class="cms-mf"><button class="cms-btn block" onclick="closeConfirm()">Отмена</button><button class="cms-btn pri block" id="cmsConfirmYes">Подтвердить</button></div>
  </div></div>`;

  /* ---------- ЗАКАЗ ---------- */
  function buildOrderText(cart){
    const lines = cart.map((it,i)=>`${i+1}. ${it.name} — ${money(it.price)}`);
    const total = cart.reduce((s,it)=>s+(+it.price||0),0);
    return `Здравствуйте! Хочу оформить заказ в ${STORE.name}:\n\n${lines.join('\n')}\n\nИтого: ${money(total)}\n\nПодскажите, пожалуйста, по оплате и доставке.`;
  }
  let orderCart=[];
  function openOrder(cart){
    orderCart = cart||[];
    if(!orderCart.length){ toast('Корзина пуста'); return; }
    $('#cmsOrderText').value = buildOrderText(orderCart);
    $('#cmsOrder').classList.add('open');
  }
  function closeOrder(){ $('#cmsOrder').classList.remove('open'); }
  function copyOrder(){ const t=$('#cmsOrderText'); t.select(); try{ navigator.clipboard.writeText(t.value); }catch(e){ try{document.execCommand('copy');}catch(_){} } toast('Текст скопирован'); }
  function sendOrder(ch){
    const raw=$('#cmsOrderText').value; const text=encodeURIComponent(raw);
    try{ navigator.clipboard.writeText(raw); }catch(e){}
    let url='';
    if(ch==='whatsapp'){ const n=(STORE.whatsapp||'').replace(/\D/g,''); if(!n){ toast('Номер WhatsApp не указан в админке'); return; } url=`https://wa.me/${n}?text=${text}`; }
    else if(ch==='telegram'){ if(!STORE.telegram){ toast('Telegram не указан в админке'); return; } url=`https://t.me/${STORE.telegram}`; toast('Текст скопирован — вставьте в чат'); }
    else if(ch==='instagram'){ if(!STORE.instagram){ toast('Instagram не указан в админке'); return; } url=`https://ig.me/m/${STORE.instagram}`; toast('Текст скопирован — вставьте в чат'); }
    window.open(url,'_blank','noopener');
  }

  /* ---------- ПОДТВЕРЖДЕНИЕ / ФОРМА ---------- */
  let confirmCb=null;
  function confirmAction(msg, cb){ $('#cmsConfirmMsg').textContent=msg; confirmCb=cb; $('#cmsConfirm').classList.add('open'); }
  function closeConfirm(){ $('#cmsConfirm').classList.remove('open'); confirmCb=null; }
  function closeForm(){ $('#cmsForm').classList.remove('open'); }
  function promptModal(title,label,value,onOk,multiline){
    $('#cmsFormTitle').textContent=title;
    const field = multiline
      ? `<textarea class="cms-inp" id="cmsPrompt" style="min-height:100px">${esc(value)}</textarea>`
      : `<input class="cms-inp" id="cmsPrompt" value="${esc(value)}">`;
    $('#cmsFormBody').innerHTML=`<div class="cms-fld"><label>${esc(label)}</label>${field}</div>`;
    $('#cmsFormSave').textContent='Сохранить';
    $('#cmsFormSave').onclick=()=>onOk($('#cmsPrompt').value);
    $('#cmsForm').classList.add('open'); setTimeout(()=>{ const el=$('#cmsPrompt'); if(el){el.focus(); if(!multiline)el.select();} },90);
  }

  /* ---------- РЕДАКТИРОВАНИЕ КОНТЕНТА САЙТА (инлайн, с главной страницы) ---------- */
  function applyContent(){
    document.querySelectorAll('[data-edit]').forEach(el=>{
      const k=el.dataset.edit, type=el.dataset.editType||'text';
      if(type==='image'){
        if(k==='heroImg' && STORE.hero){ const bg=document.querySelector('.hero .bg'); if(bg) bg.style.backgroundImage='url("'+String(STORE.hero).replace(/["\\]/g,'')+'")'; }
        return;
      }
      const v=CONTENT[k];
      if(v!=null && v!=='') el.textContent=v;
    });
  }
  function editContent(el){
    const k=el.dataset.edit, type=el.dataset.editType||'text', label=el.dataset.editLabel||'Текст';
    if(type==='image'){ openImageEditor(k,label); return; }
    const cur = (CONTENT[k]!=null && CONTENT[k]!=='') ? CONTENT[k] : el.textContent.trim();
    promptModal('Изменить: '+label,'Текст на сайте',cur,function(v){
      confirmAction('Сохранить изменение на сайте?', function(){
        v=(v||'').trim();
        if(v==='') delete CONTENT[k]; else CONTENT[k]=v;
        DB.save(LS.content,CONTENT); applyContent(); closeForm(); toast('Сохранено');
      });
    }, true);
  }
  function openImageEditor(k,label){
    $('#cmsFormTitle').textContent='Изменить: '+label;
    const cur = (k==='heroImg') ? (STORE.hero||'') : (CONTENT[k]||'');
    $('#cmsFormBody').innerHTML=`<div class="cms-fld"><label>Фото — ссылка</label>
      <input class="cms-inp" id="cmsImgUrl" value="${esc(cur)}" placeholder="https://...">
      <label class="cms-file" style="margin-top:8px"><input type="file" accept="image/*" hidden onchange="cmsPickImg(this,'cmsImgUrl')">Загрузить фото с устройства</label>
      <div class="cms-hint" style="margin-top:8px">Оставьте пустым, чтобы вернуть стандартную картинку.</div></div>`;
    $('#cmsFormSave').textContent='Сохранить';
    $('#cmsFormSave').onclick=function(){
      const v=$('#cmsImgUrl').value.trim();
      confirmAction('Сохранить изображение?', function(){
        if(k==='heroImg'){ const s=DB.store(); s.hero=v; DB.save(LS.store,s); }
        else { if(v) CONTENT[k]=v; else delete CONTENT[k]; DB.save(LS.content,CONTENT); }
        reloadAll(); applyContent(); closeForm(); toast('Сохранено');
      });
    };
    $('#cmsForm').classList.add('open');
  }

  /* ---------- АДМИН ---------- */
  function isAdmin(){ try{ return sessionStorage.getItem('zerus_authed')==='1'; }catch(e){ return false; } }
  let adminTab='products';
  function openAdminGate(){
    if(isAdmin()){ openAdmin(); return; }
    $('#cmsLoginU').value=''; $('#cmsLoginP').value=''; $('#cmsLoginErr').style.display='none';
    $('#cmsLogin').classList.add('open'); setTimeout(()=>$('#cmsLoginU').focus(),100);
  }
  function closeLogin(){ $('#cmsLogin').classList.remove('open'); }
  function tryLogin(){
    const a=DB.admin();
    if($('#cmsLoginU').value.trim()===a.user && $('#cmsLoginP').value===a.pass){
      try{ sessionStorage.setItem('zerus_authed','1'); }catch(e){}
      enableAdminMode(); closeLogin(); openAdmin(); toast('Вы вошли. Нажимайте на тексты и фото прямо на сайте, чтобы править их.');
    } else { $('#cmsLoginErr').style.display='block'; }
  }
  function logoutAdmin(){ try{ sessionStorage.removeItem('zerus_authed'); }catch(e){} disableAdminMode(); closeAdmin(); toast('Вы вышли из админки'); }
  function openAdmin(){ if(isAdmin() && !document.body.classList.contains('cms-admin-on')) enableAdminMode(); $('#cmsAdmin').classList.add('open'); admTab(adminTab); }
  function closeAdmin(){ $('#cmsAdmin').classList.remove('open'); if(location.hash==='#admin') history.replaceState(null,'',location.pathname+location.search); }
  function openAdminAt(t){ adminTab=t; openAdmin(); }
  function admTab(t){ adminTab=t; document.querySelectorAll('.cms-atab').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
    ({products:admProducts,cats:admCats,store:admStore,access:admAccess,data:admData}[t]||admProducts)(); }

  function admProducts(){
    const rows = PRODUCTS.map(p=>{
      const pr = isConfig(p) ? ('от '+money(priceOf(p))) : money(p.price);
      return `<div class="cms-arow"><img src="${esc(p.img||PLACEHOLDER)}" alt="">
        <div class="i"><div class="n">${esc(p.name)}</div><div class="m">${esc(catOf(p))} · ${pr}${isConfig(p)?' · конфигуратор':''}${p.soon?' · скоро':''}</div></div>
        <div class="acts"><button class="cms-mini" onclick="editProduct('${p.id}')">Изменить</button><button class="cms-mini danger" onclick="askDeleteProduct('${p.id}')">Удалить</button></div></div>`;
    }).join('');
    $('#cmsAdmBody').innerHTML = `<div class="cms-sech"><h2>Товары</h2><button class="cms-btn pri" onclick="editProduct(null)">+ Добавить товар</button></div>
      <div class="cms-hint" style="margin-bottom:16px">Фото, описание, характеристики, цена, категория. Изменения видны на сайте сразу и хранятся в этом браузере. Чтобы их увидели все — вкладка <b>База</b> → «Экспорт», и пришлите файл для публикации.</div>
      ${rows||'<div class="cms-empty">Товаров нет. Добавьте первый.</div>'}`;
  }
  let editingId=null;
  function editProduct(id){
    editingId=id;
    const src = id ? PRODUCTS.find(x=>x.id===id) : null;
    const p = src ? clone(src) : { id:'', name:'', category:CATEGORIES[0]||'', description:'', price:0, oldPrice:null, img:'', stock:1, specs:[], newArrival:false, soon:false, release:'' };
    const cfg = isConfig(p);
    $('#cmsFormTitle').textContent = id?'Редактирование товара':'Новый товар';
    const catOpts = CATEGORIES.map(c=>`<option ${c===catOf(p)?'selected':''}>${esc(c)}</option>`).join('');
    const specsText = (p.specs||[]).map(s=>`${s.k}: ${s.v}`).join('\n');
    $('#cmsFormBody').innerHTML = `
      <div class="cms-fld"><label>Название</label><input class="cms-inp" id="fName" value="${esc(p.name)}"></div>
      <div class="cms-row2">
        <div class="cms-fld"><label>Категория</label><select class="cms-inp" id="fCat">${catOpts}</select></div>
        ${cfg ? `<div class="cms-fld"><label>Цена</label><input class="cms-inp" value="от ${esc(priceOf(p).toLocaleString('ru-RU'))} ₽ (конфигуратор)" disabled></div>`
              : `<div class="cms-fld"><label>Цена (${esc(STORE.currency)})</label><input class="cms-inp" id="fPrice" type="number" min="0" value="${p.price||0}"></div>`}
      </div>
      ${cfg ? '' : `<div class="cms-row2">
        <div class="cms-fld"><label>Старая цена (для скидки)</label><input class="cms-inp" id="fOld" type="number" min="0" value="${p.oldPrice||''}"></div>
        <div class="cms-fld"><label>На складе (шт.)</label><input class="cms-inp" id="fStock" type="number" min="0" value="${p.stock==null?1:p.stock}"></div>
      </div>`}
      <div class="cms-fld"><label>Метки</label><div class="cms-chips">
        <span class="cms-chip${p.newArrival?' on':''}" id="fNew" onclick="this.classList.toggle('on')">Новинка</span>
        <span class="cms-chip${p.soon?' on':''}" id="fSoon" onclick="this.classList.toggle('on')">Скоро в продаже</span>
      </div></div>
      <div class="cms-fld" id="fReleaseWrap" style="${p.soon?'':'display:none'}"><label>Дата выхода (для «Скоро»)</label><input class="cms-inp" id="fRelease" value="${esc(p.release||'')}" placeholder="20 сентября 2026"></div>
      <div class="cms-fld"><label>Описание</label><textarea class="cms-inp" id="fDesc">${esc(p.description||p.desc||'')}</textarea></div>
      <div class="cms-fld"><label>Характеристики (каждая с новой строки: «Название: значение»)</label><textarea class="cms-inp" id="fSpecs" placeholder="Экран: 6.1&quot; OLED&#10;Память: 128 ГБ">${esc(specsText)}</textarea></div>
      <div class="cms-fld"><label>Фото — ссылка</label><input class="cms-inp" id="fImg" value="${esc(p.img||'')}" placeholder="https://...">
        <label class="cms-file" style="margin-top:8px"><input type="file" accept="image/*" hidden onchange="cmsPickImg(this,'fImg')">Загрузить фото</label></div>
      ${cfg ? '<div class="cms-hint" style="margin-top:4px">Это конфигуратор (версии/память/цвета). Здесь меняются название, категория, фото, описание и характеристики — варианты остаются как есть.</div>' : ''}`;
    const soonChip=$('#fSoon'); if(soonChip) soonChip.onclick=function(){ this.classList.toggle('on'); $('#fReleaseWrap').style.display=this.classList.contains('on')?'':'none'; };
    $('#cmsFormSave').textContent='Сохранить'; $('#cmsFormSave').onclick=saveProductForm;
    $('#cmsForm').classList.add('open');
  }
  function cmsPickImg(input,targetId){
    const f=input.files[0]; if(!f) return;
    if(f.size>1.5*1024*1024) toast('Фото большое — лучше вставить ссылку');
    const r=new FileReader(); r.onload=()=>{ $('#'+targetId).value=r.result; toast('Фото загружено'); }; r.readAsDataURL(f);
  }
  function saveProductForm(){
    const name=$('#fName').value.trim(); if(!name){ toast('Укажите название'); return; }
    const src = editingId ? DB.products().find(x=>x.id===editingId) : null;
    const cfg = src && src.type==='config';
    const specs=$('#fSpecs').value.split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{ const i=l.indexOf(':'); return i>-1?{k:l.slice(0,i).trim(),v:l.slice(i+1).trim()}:{k:l,v:''}; });
    const soon=$('#fSoon').classList.contains('on');
    let obj;
    if(cfg){ obj=Object.assign({}, src, { name, category:$('#fCat').value, description:$('#fDesc').value.trim(), img:$('#fImg').value.trim()||src.img, specs }); }
    else {
      obj={ id: editingId || ('p'+Date.now()), type:'simple', cat:(src&&src.cat)||'tech',
        name, category:$('#fCat').value, description:$('#fDesc').value.trim(),
        price: Math.max(0, parseFloat($('#fPrice').value)||0), oldPrice: parseFloat($('#fOld').value)||null,
        img: $('#fImg').value.trim()||PLACEHOLDER, stock: Math.max(0, parseInt($('#fStock').value)||0),
        specs, newArrival:$('#fNew').classList.contains('on'), soon, release: soon?$('#fRelease').value.trim():'' };
    }
    confirmAction(editingId?`Сохранить изменения в «${name}»?`:`Добавить товар «${name}»?`, ()=>{
      const list=DB.products();
      if(editingId){ const i=list.findIndex(x=>x.id===editingId); if(i>-1) list[i]=obj; else list.push(obj); } else list.push(obj);
      if(DB.save(LS.prod,list)){ reloadAll(); closeForm(); admProducts(); toast('Сохранено'); }
    });
  }
  function askDeleteProduct(id){ const p=PRODUCTS.find(x=>x.id===id);
    confirmAction(`Удалить товар «${p?p.name:''}»? Отменить будет нельзя.`, ()=>{ DB.save(LS.prod, DB.products().filter(x=>x.id!==id)); reloadAll(); admProducts(); toast('Товар удалён'); }); }

  function admCats(){
    const rows=CATEGORIES.map((c,i)=>`<div class="cms-arow"><div class="i"><div class="n">${esc(c)}</div><div class="m">${PRODUCTS.filter(p=>catOf(p)===c).length} товаров</div></div>
      <div class="acts"><button class="cms-mini" onclick="renameCat(${i})">Переименовать</button><button class="cms-mini danger" onclick="askDeleteCat(${i})">Удалить</button></div></div>`).join('');
    $('#cmsAdmBody').innerHTML=`<div class="cms-sech"><h2>Каталог</h2><button class="cms-btn pri" onclick="addCat()">+ Добавить категорию</button></div>
      <div class="cms-hint" style="margin-bottom:16px">Категории каталога (iPhone, Redmi, Samsung и т.д.). Показываются в магазине, фильтрах и подвале.</div>
      ${rows||'<div class="cms-empty">Категорий нет.</div>'}`;
  }
  function addCat(){ promptModal('Новая категория','Название','', v=>{ v=(v||'').trim(); if(!v) return; const list=DB.categories(); if(list.includes(v)){ toast('Такая категория уже есть'); return; }
    confirmAction(`Добавить категорию «${v}»?`, ()=>{ list.push(v); DB.save(LS.cats,list); reloadAll(); closeForm(); admCats(); toast('Категория добавлена'); }); }); }
  function renameCat(i){ const old=CATEGORIES[i]; promptModal('Переименовать категорию','Название',old, v=>{ v=(v||'').trim(); if(!v) return;
    confirmAction(`Переименовать «${old}» в «${v}»? Товары обновятся.`, ()=>{ const cats=DB.categories(); cats[i]=v; DB.save(LS.cats,cats);
      const prods=DB.products(); prods.forEach(p=>{ if(catOf(p)===old) p.category=v; }); DB.save(LS.prod,prods);
      reloadAll(); closeForm(); admCats(); toast('Переименовано'); }); }); }
  function askDeleteCat(i){ const c=CATEGORIES[i]; const n=PRODUCTS.filter(p=>catOf(p)===c).length;
    confirmAction(`Удалить категорию «${c}»?`+(n?` ${n} товаров останутся без этой категории.`:''), ()=>{ DB.save(LS.cats, DB.categories().filter((_,j)=>j!==i)); reloadAll(); admCats(); toast('Категория удалена'); }); }

  function admStore(){ const s=STORE;
    $('#cmsAdmBody').innerHTML=`<div class="cms-sech"><h2>Магазин</h2></div>
      <div class="cms-hint" style="margin-bottom:16px">Эти данные показываются в подвале сайта и используются для кнопок заказа и Telegram. Укажите реальные контакты.</div>
      <div class="cms-fld"><label>Название</label><input class="cms-inp" id="sName" value="${esc(s.name)}"></div>
      <div class="cms-fld"><label>О магазине (текст в подвале)</label><textarea class="cms-inp" id="sAbout">${esc(s.about)}</textarea></div>
      <div class="cms-row2"><div class="cms-fld"><label>Адрес</label><input class="cms-inp" id="sAddr" value="${esc(s.address)}"></div>
        <div class="cms-fld"><label>Время работы</label><input class="cms-inp" id="sHours" value="${esc(s.hours)}"></div></div>
      <div class="cms-row2"><div class="cms-fld"><label>Telegram (без @)</label><input class="cms-inp" id="sTg" value="${esc(s.telegram)}" placeholder="zerus9501"></div>
        <div class="cms-fld"><label>WhatsApp (номер)</label><input class="cms-inp" id="sWa" value="${esc(s.whatsapp)}" placeholder="7 (989) 000-00-00"></div></div>
      <div class="cms-row2"><div class="cms-fld"><label>Instagram (без @)</label><input class="cms-inp" id="sIg" value="${esc(s.instagram)}" placeholder="technic.store"></div>
        <div class="cms-fld"><label>Валюта</label><input class="cms-inp" id="sCur" value="${esc(s.currency)}" maxlength="3"></div></div>
      <div class="cms-fld"><label>Фото заставки (ссылка) — пусто = стандартное</label><input class="cms-inp" id="sHero" value="${esc(s.hero||'')}" placeholder="https://...">
        <label class="cms-file" style="margin-top:8px"><input type="file" accept="image/*" hidden onchange="cmsPickImg(this,'sHero')">Загрузить заставку</label></div>
      <button class="cms-btn pri" onclick="saveStore()">Сохранить изменения</button>`;
  }
  function saveStore(){ const obj={ name:$('#sName').value.trim()||'Technic Store', about:$('#sAbout').value.trim(), address:$('#sAddr').value.trim(), hours:$('#sHours').value.trim(),
      telegram:$('#sTg').value.trim().replace(/^@/,''), whatsapp:$('#sWa').value.trim(), instagram:$('#sIg').value.trim().replace(/^@/,''), currency:$('#sCur').value.trim()||'₽', hero:$('#sHero').value.trim() };
    confirmAction('Сохранить информацию о магазине?', ()=>{ DB.save(LS.store,obj); reloadAll(); toast('Сохранено'); }); }

  function admAccess(){ const a=DB.admin();
    $('#cmsAdmBody').innerHTML=`<div class="cms-sech"><h2>Доступ</h2></div>
      <div class="cms-hint" style="margin-bottom:16px">Логин и пароль администратора. Это лёгкая защита статического сайта — не используйте важные пароли.</div>
      <div class="cms-row2"><div class="cms-fld"><label>Логин</label><input class="cms-inp" id="aUser" value="${esc(a.user)}"></div>
        <div class="cms-fld"><label>Пароль</label><input class="cms-inp" id="aPass" value="${esc(a.pass)}"></div></div>
      <button class="cms-btn pri" onclick="saveAccess()">Сохранить</button>`;
  }
  function saveAccess(){ const u=$('#aUser').value.trim(), p=$('#aPass').value; if(!u||!p){ toast('Заполните логин и пароль'); return; }
    confirmAction('Изменить логин и пароль администратора?', ()=>{ DB.save(LS.admin,{user:u,pass:p}); toast('Доступ обновлён'); }); }

  function admData(){
    $('#cmsAdmBody').innerHTML=`<div class="cms-sech"><h2>База данных</h2></div>
      <div class="cms-hint" style="margin-bottom:16px">Товары, категории и настройки хранятся в этом браузере. <b>Экспорт</b> — скачать резервную копию. <b>Импорт</b> — загрузить её (на другом устройстве) или прислать мне для публикации всем посетителям.</div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="cms-btn pri" onclick="exportDB()">Экспорт базы</button>
        <label class="cms-btn" style="cursor:pointer">Импорт базы<input type="file" accept="application/json" hidden onchange="importDB(this)"></label>
        <button class="cms-btn gold" onclick="askReset()">Сбросить к стандартным</button>
      </div>`;
  }
  function exportDB(){ const data={ products:DB.products(), categories:DB.categories(), store:DB.store(), admin:DB.admin(), _v:1, _date:new Date().toISOString() };
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})); a.download='technic-store-base.json'; a.click(); URL.revokeObjectURL(a.href); toast('База экспортирована'); }
  function importDB(input){ const f=input.files[0]; if(!f) return; const r=new FileReader();
    r.onload=()=>{ let d; try{ d=JSON.parse(r.result); }catch(e){ toast('Файл повреждён'); return; }
      confirmAction('Импортировать базу? Текущие данные будут заменены.', ()=>{ if(d.products)DB.save(LS.prod,d.products); if(d.categories)DB.save(LS.cats,d.categories); if(d.store)DB.save(LS.store,d.store); if(d.admin)DB.save(LS.admin,d.admin); reloadAll(); admData(); toast('База импортирована'); }); };
    r.readAsText(f); input.value=''; }
  function askReset(){ confirmAction('Сбросить ВСЕ данные к стандартным? Ваши товары и настройки будут удалены.', ()=>{ [LS.prod,LS.cats,LS.store,LS.admin].forEach(k=>localStorage.removeItem(k)); reloadAll(); admTab(adminTab); toast('Сброшено к стандартным'); }); }

  /* ---------- РЕЖИМ АДМИНА НА САЙТЕ ---------- */
  function enableAdminMode(){ document.body.classList.add('cms-admin-on'); if(CMS.onChange) CMS.onChange(); }
  function disableAdminMode(){ document.body.classList.remove('cms-admin-on'); if(CMS.onChange) CMS.onChange(); }

  /* ---------- ПОДВАЛ ---------- */
  function renderFooter(elId){
    const el=document.getElementById(elId); if(!el) return; const s=STORE;
    const tg=s.telegram?`https://t.me/${encodeURIComponent(s.telegram)}`:'';
    const wa=s.whatsapp?`https://wa.me/${s.whatsapp.replace(/\D/g,'')}`:'';
    const ig=s.instagram?`https://instagram.com/${encodeURIComponent(s.instagram)}`:'';
    el.classList.add('cms-foot');
    el.innerHTML=`<div class="fgrid">
      <div><div class="fb"><span class="dot"></span>${esc(s.name)}</div><p>${esc(s.about)}</p>
        <button class="cms-inline" style="margin-top:14px" onclick="openAdminAt('store')"><i class="bi bi-pencil"></i>Изменить информацию</button></div>
      <div><div class="fh">Каталог</div>${CATEGORIES.map(c=>`<a class="fcat" data-cat="${esc(c)}">${esc(c)}</a>`).join('')||'—'}</div>
      <div><div class="fh">Магазин</div>
        <div class="fi"><i class="bi bi-geo-alt"></i><span>${esc(s.address)}</span></div>
        <div class="fi"><i class="bi bi-clock"></i><span>${esc(s.hours)}</span></div>
        ${s.telegram?`<div class="fi"><i class="bi bi-telegram"></i><a href="${tg}" target="_blank" rel="noopener">Telegram: @${esc(s.telegram)}</a></div>`:''}
        ${s.whatsapp?`<div class="fi"><i class="bi bi-whatsapp"></i><a href="${wa}" target="_blank" rel="noopener">WhatsApp: ${esc(s.whatsapp)}</a></div>`:''}
        ${s.instagram?`<div class="fi"><i class="bi bi-instagram"></i><a href="${ig}" target="_blank" rel="noopener">${esc(s.name)}</a></div>`:''}
      </div>
    </div>
    <div class="fbot"><span>© ${new Date().getFullYear()} ${esc(s.name)}</span><span>Официально · гарантия · доставка по РФ</span></div>`;
    el.querySelectorAll('.fcat').forEach(a=>a.addEventListener('click',()=>{ if(CMS.onCatPick) CMS.onCatPick(a.dataset.cat); }));
  }
  function updateTg(){ const f=$('#cmsTg'); if(!f) return; if(STORE.telegram){ f.href=`https://t.me/${encodeURIComponent(STORE.telegram)}`; f.style.display='grid'; } else f.style.display='none'; }

  /* ---------- ТЕМА (день/ночь) ---------- */
  function currentTheme(){ return document.documentElement.getAttribute('data-theme')==='light' ? 'light' : 'dark'; }
  function updateThemeIcons(){ const i=$('#cmsTheme i'); if(i) i.className = currentTheme()==='light' ? 'bi bi-sun' : 'bi bi-moon-stars'; }
  function applyTheme(t){
    if(t==='light') document.documentElement.setAttribute('data-theme','light');
    else document.documentElement.removeAttribute('data-theme');
    try{ localStorage.setItem('zerus_theme', t); }catch(e){}
    updateThemeIcons();
  }
  function cmsToggleTheme(){ applyTheme(currentTheme()==='light' ? 'dark' : 'light'); }

  /* ---------- перезагрузка ---------- */
  function reloadAll(){ loadData(); updateTg(); applyContent(); if(CMS.footerEl) renderFooter(CMS.footerEl); if(CMS.onChange) CMS.onChange(); }

  /* ---------- экспорт в window (для onclick в инъецированном HTML) ---------- */
  Object.assign(window, { openAdminGate, closeAdmin, closeLogin, tryLogin, logoutAdmin, openAdmin, openAdminAt, admTab,
    editProduct, saveProductForm, askDeleteProduct, cmsPickImg, addCat, renameCat, askDeleteCat, saveStore, saveAccess,
    exportDB, importDB, askReset, closeForm, closeConfirm, closeOrder, sendOrder, copyOrder, cmsToggleTheme });

  /* ---------- init ---------- */
  const CMS = {
    onChange:null, onCatPick:null, footerEl:null,
    getProducts:()=>PRODUCTS, getCategories:()=>CATEGORIES, getStore:()=>STORE,
    catOf, money, priceOf, isAdmin, openOrder, isConfig,
    reload:reloadAll, esc,
    init(opts){
      opts=opts||{};
      CMS.onChange=opts.onChange||null; CMS.onCatPick=opts.onCatPick||null; CMS.footerEl=opts.footerEl||null;
      const st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);
      document.body.insertAdjacentHTML('beforeend', UI);
      document.getElementById('cmsConfirmYes').addEventListener('click',()=>{ const cb=confirmCb; closeConfirm(); if(cb) cb(); });
      loadData(); updateTg(); updateThemeIcons(); applyContent();
      if(CMS.footerEl) renderFooter(CMS.footerEl);
      document.addEventListener('click', function(e){
        if(!document.body.classList.contains('cms-admin-on')) return;
        const el = e.target.closest('[data-edit]');
        if(!el) return;
        e.preventDefault(); e.stopPropagation();
        editContent(el);
      }, true);
      if(isAdmin()) enableAdminMode();
      if(location.hash==='#admin') openAdminGate();
    }
  };
  window.CMS = CMS;
})();
