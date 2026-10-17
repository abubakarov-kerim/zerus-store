/* ============================================================
   Technic Store — движок сайта (общий для всех страниц)
   • База: опубликованная (data/db.json) + черновик админа (этот браузер)
   • Админка, правка текстов прямо на странице, публикация в GitHub
   • Корзина, окно заказа, подвал, тема день/ночь, палитры
   Подключается после products.js (стандартные товары).
============================================================ */
(function(){
  "use strict";

  /* ---------- стандартные данные ---------- */
  const LS = { prod:'zerus_products', cats:'zerus_categories', store:'zerus_store', admin:'zerus_admin', content:'zerus_content',
               pub:'zerus_pub', gh:'zerus_gh', theme:'zerus_theme', themeDef:'zerus_theme_def', pal:'zerus_palette', cart:'cart' };
  const DEFAULT_CATEGORIES = ['Apple','Samsung','Redmi','POCO','Часы','Аксессуары'];
  const DEFAULT_STORE = {
    name:'Technic Store',
    about:'Магазин техники Apple, Samsung, Redmi и POCO. Оригинальные устройства, гарантия и доставка по всей России.',
    address:'Укажите адрес магазина в админке',
    hours:'Пн-Вс: 10:00-21:00',
    telegram:'zerus9501', whatsapp:'', instagram:'',
    currency:'₽', hero:'', palette:'malachite', theme:'dark'
  };
  /* пароль хранится только в виде отпечатка SHA-256 (стандартный: zerus2026) */
  const DEFAULT_ADMIN = { user:'admin', hash:'c9d9d647b031eecbdaa8d93e8a407fda1c5029b8bfe2391143114eb5cc20b5a6' };
  const REPO = { repo:'abubakarov-kerim/zerus-store', branch:'main' };
  const PLACEHOLDER = 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect x="130" y="70" width="140" height="260" rx="26" fill="none" stroke="#8a948f" stroke-width="6" opacity=".5"/><rect x="180" y="88" width="40" height="8" rx="4" fill="#8a948f" opacity=".5"/></svg>');

  const PALETTES = [
    { id:'malachite', name:'Малахит', desc:'Глубокий изумруд и нефрит', sw:['#060B09','#0A2A1F','#1E7154','#46C79A'] },
    { id:'sapphire',  name:'Сапфир',  desc:'Ночная синева и лёд',      sw:['#05070D','#0B1838','#2C52A8','#86A9FF'] },
    { id:'garnet',    name:'Гранат',  desc:'Тёмное вино и коралл',     sw:['#0B0607','#3A0D17','#922C3D','#E8707F'] },
    { id:'graphite',  name:'Графит',  desc:'Графит и оранжевый титан', sw:['#09090A','#1C1C20','#4F4A49','#FF7A3D'] }
  ];

  const clone = o => JSON.parse(JSON.stringify(o));
  function seedProducts(){ return (typeof products !== 'undefined' && Array.isArray(products)) ? clone(products) : []; }
  function lsGet(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function lsSet(k,v){ try{ localStorage.setItem(k,v); return true; }catch(e){ return false; } }
  function lsDel(k){ try{ localStorage.removeItem(k); }catch(e){} }

  /* опубликованная база: кеш с прошлого визита — сразу, свежая с сервера — следом */
  let PUB = null;
  try{ PUB = JSON.parse(lsGet(LS.pub)||'null'); }catch(e){ PUB=null; }

  const DB = {
    load(key, def){
      const pubPart = PUB && ({[LS.prod]:PUB.products,[LS.cats]:PUB.categories,[LS.content]:PUB.content})[key];
      try{ const v=lsGet(key); if(v) return JSON.parse(v); }catch(e){}
      return clone(pubPart || def);
    },
    save(key, val){
      if(lsSet(key, JSON.stringify(val))) return true;
      toast('В браузере закончилось место. Для фото лучше вставлять ссылку, а не загружать файл.'); return false;
    },
    products(){ return this.load(LS.prod, seedProducts()); },
    categories(){ return this.load(LS.cats, DEFAULT_CATEGORIES); },
    store(){ return Object.assign(clone(DEFAULT_STORE), clone((PUB&&PUB.store)||{}), this.load(LS.store, {})); },
    content(){ return this.load(LS.content, {}); },
    admin(){ return Object.assign(clone(DEFAULT_ADMIN), this.load(LS.admin, {})); },
    hasDraft(){ return [LS.prod,LS.cats,LS.store,LS.content].some(k=>!!lsGet(k)); }
  };

  /* категория товара */
  function catOf(p){
    if(p.category) return p.category;
    if(p.cat==='watch') return 'Часы';
    if(p.cat==='acc')   return 'Аксессуары';
    return p.brand || 'Другое';
  }
  function applyMeta(list){
    (list||[]).forEach(p=>{ if(!p.category) p.category=catOf(p); if(!p.specs) p.specs=[]; if(!p.img) p.img=PLACEHOLDER; if(!p.desc && p.description) p.desc=p.description; if(!p.description && p.desc) p.description=p.desc; });
    return list||[];
  }

  let PRODUCTS=[], CATEGORIES=[], STORE={}, CONTENT={};
  function loadData(){ PRODUCTS=applyMeta(DB.products()); CATEGORIES=DB.categories(); STORE=DB.store(); CONTENT=DB.content(); }

  /* ---------- helpers ---------- */
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = s => String(s==null?'':s).replace(/[&<>"']/g, m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const fmt = n => (Math.round(+n||0)).toLocaleString('ru-RU');
  function money(n){ return fmt(n) + '\u00a0' + (STORE.currency||'₽'); }
  function minPriceOf(p){
    if(p.type==='config' && p.versions && p.versions.length){
      const v=Math.min(...p.versions.map(x=>+x.price||0)); const s=(p.storage&&p.storage.length)?Math.min(...p.storage.map(x=>+x.add||0)):0; return v+s;
    }
    return +p.price||0;
  }
  const priceOf = minPriceOf;
  const isConfig = p => p.type==='config';
  /* облегчённая копия фото для карточек (images/w/*.webp); при ошибке подставится оригинал */
  function thumb(src){ const m=/^images\/([\w.-]+)\.png$/i.exec(src||''); return m ? 'images/w/'+m[1]+'.webp' : (src||PLACEHOLDER); }
  function inStock(p){ return p.soon ? false : (p.stock==null ? true : +p.stock>0); }
  function plural(n,a,b,c){ n=Math.abs(n)%100; const n1=n%10; if(n>10&&n<20) return c; if(n1>1&&n1<5) return b; if(n1===1) return a; return c; }

  let toastT;
  function toast(m, link){
    const el=$('#cmsToast'); if(!el) return;
    el.innerHTML = '<span>'+esc(m)+'</span>' + (link ? '<a href="'+esc(link.href)+'">'+esc(link.text)+'</a>' : '');
    el.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>el.classList.remove('show'), link?4200:2800);
  }

  /* ---------- SHA-256 (для пароля админа, работает и без https) ---------- */
  function sha256(str){
    const K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
      0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
      0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
      0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    const bytes=Array.from(new TextEncoder().encode(str)); const l=bytes.length*8;
    bytes.push(0x80); while(bytes.length%64!==56) bytes.push(0);
    for(let i=7;i>=0;i--) bytes.push(Math.floor(l/Math.pow(2,i*8))&255);
    let H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    const r=(x,n)=>(x>>>n)|(x<<(32-n));
    for(let o=0;o<bytes.length;o+=64){
      const w=new Array(64);
      for(let i=0;i<16;i++) w[i]=(bytes[o+i*4]<<24)|(bytes[o+i*4+1]<<16)|(bytes[o+i*4+2]<<8)|bytes[o+i*4+3];
      for(let i=16;i<64;i++){ const s0=r(w[i-15],7)^r(w[i-15],18)^(w[i-15]>>>3), s1=r(w[i-2],17)^r(w[i-2],19)^(w[i-2]>>>10); w[i]=(w[i-16]+s0+w[i-7]+s1)|0; }
      let [a,b,c,d,e,f,g,h]=H;
      for(let i=0;i<64;i++){
        const t1=(h+(r(e,6)^r(e,11)^r(e,25))+((e&f)^(~e&g))+K[i]+w[i])|0, t2=((r(a,2)^r(a,13)^r(a,22))+((a&b)^(a&c)^(b&c)))|0;
        h=g; g=f; f=e; e=(d+t1)|0; d=c; c=b; b=a; a=(t1+t2)|0;
      }
      H=H.map((x,i)=>(x+[a,b,c,d,e,f,g,h][i])|0);
    }
    return H.map(x=>(x>>>0).toString(16).padStart(8,'0')).join('');
  }

  /* ---------- КОРЗИНА ---------- */
  const Cart = {
    get(){
      let raw; try{ raw=JSON.parse(lsGet(LS.cart)||'[]'); }catch(e){ raw=[]; }
      if(!Array.isArray(raw)) raw=[];
      const out=[];  // старый формат (по строке на штуку) склеиваем в позиции с количеством
      raw.forEach(it=>{ if(!it||!it.name) return; const q=Math.max(1,parseInt(it.qty)||1);
        const same=out.find(x=>x.name===it.name && +x.price===+it.price); if(same) same.qty+=q; else out.push({ name:String(it.name), price:+it.price||0, qty:q, img:it.img||'', id:it.id||'' }); });
      return out;
    },
    set(list){ lsSet(LS.cart, JSON.stringify(list)); Cart.paint(true); },
    add(item){ const list=Cart.get(); const same=list.find(x=>x.name===item.name && +x.price===+item.price);
      if(same) same.qty+=1; else list.push({ name:item.name, price:+item.price||0, qty:1, img:item.img||'', id:item.id||'' }); Cart.set(list); },
    qty(i,q){ const list=Cart.get(); if(!list[i]) return; list[i].qty=Math.max(1,Math.min(99,q)); Cart.set(list); },
    remove(i){ const list=Cart.get(); list.splice(i,1); Cart.set(list); },
    clear(){ Cart.set([]); },
    count(){ return Cart.get().reduce((s,x)=>s+x.qty,0); },
    total(){ return Cart.get().reduce((s,x)=>s+x.qty*x.price,0); },
    paint(bump){ const n=Cart.count(); $$('[data-cart-count]').forEach(el=>{ el.textContent=n?String(n):''; el.dataset.n=n; if(bump&&n){ el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); } }); }
  };

  /* ---------- ПАЛИТРА И ТЕМА ---------- */
  function previewPalette(){ try{ return sessionStorage.getItem('zerus_pal_preview'); }catch(e){ return null; } }
  function applyPalette(){
    const id = previewPalette() || STORE.palette || 'malachite';
    const ok = PALETTES.some(p=>p.id===id) ? id : 'malachite';
    if(ok==='malachite') document.documentElement.removeAttribute('data-palette'); else document.documentElement.setAttribute('data-palette', ok);
    if(!previewPalette()) lsSet(LS.pal, ok);
    lsSet(LS.themeDef, STORE.theme==='light'?'light':'dark');
    if(!lsGet(LS.theme)) setThemeAttr(STORE.theme==='light'?'light':'dark');
    const mc=$('meta[name="theme-color"]'); if(mc) mc.content=getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()||'#060B09';
  }
  function currentTheme(){ return document.documentElement.getAttribute('data-theme')==='light' ? 'light' : 'dark'; }
  function setThemeAttr(t){ if(t==='light') document.documentElement.setAttribute('data-theme','light'); else document.documentElement.removeAttribute('data-theme'); updateThemeIcons(); }
  function updateThemeIcons(){ $$('[data-theme-toggle] i').forEach(i=>{ i.className = currentTheme()==='light' ? 'bi bi-moon' : 'bi bi-sun'; });
    $$('[data-theme-toggle]').forEach(b=>b.setAttribute('aria-label', currentTheme()==='light'?'Включить ночную тему':'Включить дневную тему'));
    const mc=$('meta[name="theme-color"]'); if(mc) mc.content=getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()||'#060B09'; }
  function toggleTheme(){ const t=currentTheme()==='light'?'dark':'light'; setThemeAttr(t); lsSet(LS.theme,t); }

  /* ---------- ОБЩИЕ БЛОКИ (инъекция) ---------- */
  const UI = `
  <div id="cmsToast" role="status" aria-live="polite"></div>
  <a id="cmsTg" class="fab" href="#" target="_blank" rel="noopener" aria-label="Написать в Telegram"><i class="bi bi-telegram"></i></a>
  <div id="cmsBar" role="toolbar" aria-label="Режим администратора">
    <span class="t">Режим админа</span><span class="st" id="cmsBarState"></span><span class="sp"></span>
    <button class="pri" id="cmsBarPub" onclick="publishDB()">Опубликовать</button>
    <button onclick="editProduct(null)">+ Товар</button>
    <button onclick="openAdminAt('products')">Панель</button>
    <button onclick="logoutAdmin()">Выйти</button>
  </div>
  <div class="cms-modal" id="cmsOrder" role="dialog" aria-modal="true" aria-labelledby="cmsOrderH"><div class="box">
    <div class="cms-mh"><h3 id="cmsOrderH">Отправить заказ</h3><button class="cms-x" onclick="closeOrder()" aria-label="Закрыть"><i class="bi bi-x-lg"></i></button></div>
    <div class="cms-mb">
      <p class="cms-hint">Выберите мессенджер. Текст заказа уже собран и скопирован: если он не подставится сам, просто вставьте его в чат.</p>
      <div class="cms-ch" id="cmsCh">
        <button class="cms-chb" data-ch="telegram" onclick="sendOrder('telegram')"><i class="bi bi-telegram" style="color:#2AABEE"></i><span>Telegram</span></button>
        <button class="cms-chb" data-ch="whatsapp" onclick="sendOrder('whatsapp')"><i class="bi bi-whatsapp" style="color:#25D366"></i><span>WhatsApp</span></button>
        <button class="cms-chb" data-ch="instagram" onclick="sendOrder('instagram')"><i class="bi bi-instagram" style="color:#E4405F"></i><span>Instagram</span></button>
      </div>
      <div class="fld" style="margin:0"><label for="cmsOrderText">Текст заказа</label><textarea class="cms-ot" id="cmsOrderText" readonly></textarea></div>
    </div>
    <div class="cms-mf"><button class="btn ghost block" onclick="copyOrder()"><i class="bi bi-copy"></i>Скопировать</button><button class="btn block" onclick="closeOrder()">Готово</button></div>
  </div></div>
  <div class="cms-modal" id="cmsLogin" role="dialog" aria-modal="true" aria-labelledby="cmsLoginH"><div class="box" style="width:min(420px,100%)">
    <div class="cms-mh"><h3 id="cmsLoginH">Вход в админку</h3><button class="cms-x" onclick="closeLogin()" aria-label="Закрыть"><i class="bi bi-x-lg"></i></button></div>
    <form class="cms-mb" onsubmit="event.preventDefault();tryLogin()">
      <div class="login-ic"><i class="bi bi-shield-lock"></i></div>
      <div class="fld"><label for="cmsLoginU">Логин</label><input class="inp" id="cmsLoginU" autocomplete="username" autocapitalize="off" spellcheck="false"></div>
      <div class="fld" id="cmsLoginF"><label for="cmsLoginP">Пароль</label><input class="inp" id="cmsLoginP" type="password" autocomplete="current-password">
        <div class="err">Неверный логин или пароль.</div></div>
      <button class="btn block" type="submit">Войти</button>
    </form>
  </div></div>
  <div class="cms-admin" id="cmsAdmin" role="dialog" aria-modal="true" aria-label="Админка">
    <div class="cms-atop"><div class="tt"><span class="logo-mark"></span><b data-store-name>Technic Store</b><span>· админка</span></div>
      <div style="display:flex;gap:8px;align-items:center"><button class="mini" onclick="logoutAdmin()">Выйти</button><button class="cms-x" onclick="closeAdmin()" aria-label="Закрыть админку"><i class="bi bi-x-lg"></i></button></div></div>
    <div class="cms-alay">
      <nav class="cms-atabs" id="cmsTabs">
        <button class="cms-atab on" data-t="products" onclick="admTab('products')"><i class="bi bi-box-seam"></i>Товары</button>
        <button class="cms-atab" data-t="cats" onclick="admTab('cats')"><i class="bi bi-grid"></i>Каталог</button>
        <button class="cms-atab" data-t="look" onclick="admTab('look')"><i class="bi bi-palette"></i>Оформление</button>
        <button class="cms-atab" data-t="store" onclick="admTab('store')"><i class="bi bi-shop"></i>Магазин</button>
        <button class="cms-atab" data-t="access" onclick="admTab('access')"><i class="bi bi-key"></i>Доступ</button>
        <button class="cms-atab" data-t="data" onclick="admTab('data')"><i class="bi bi-cloud-arrow-up"></i>Публикация<span class="dotn" id="cmsTabDot" hidden></span></button>
      </nav>
      <div class="cms-abody" id="cmsAdmBody"></div>
    </div>
  </div>
  <div class="cms-modal" id="cmsForm" role="dialog" aria-modal="true" aria-labelledby="cmsFormTitle"><div class="box">
    <div class="cms-mh"><h3 id="cmsFormTitle">Товар</h3><button class="cms-x" onclick="closeForm()" aria-label="Закрыть"><i class="bi bi-x-lg"></i></button></div>
    <div class="cms-mb" id="cmsFormBody"></div>
    <div class="cms-mf"><button class="btn ghost block" onclick="closeForm()">Отмена</button><button class="btn block" id="cmsFormSave">Сохранить</button></div>
  </div></div>
  <div class="cms-modal" id="cmsConfirm" role="alertdialog" aria-modal="true" aria-labelledby="cmsConfirmH"><div class="box" style="width:min(420px,100%)">
    <div class="cms-mh"><h3 id="cmsConfirmH">Подтверждение</h3></div>
    <div class="cms-mb"><p id="cmsConfirmMsg" class="cms-hint" style="font-size:.95rem"></p></div>
    <div class="cms-mf"><button class="btn ghost block" onclick="closeConfirm()">Отмена</button><button class="btn block" id="cmsConfirmYes">Подтвердить</button></div>
  </div></div>`;

  /* блокировка прокрутки под окнами */
  function syncLock(){ const open = $$('.cms-modal.open, .cms-admin.open, .mnav.open').length>0; document.documentElement.style.overflow = open ? 'hidden' : ''; }

  /* ---------- ЗАКАЗ ---------- */
  function buildOrderText(cart, info){
    info=info||{};
    const lines = cart.map((it,i)=>`${i+1}. ${it.name}${it.qty>1?` × ${it.qty}`:''}: ${money(it.price*it.qty)}`);
    const total = cart.reduce((s,it)=>s+it.price*it.qty,0);
    const who = [info.name?`Имя: ${info.name}`:'', info.phone?`Телефон: ${info.phone}`:'', info.city?`Город: ${info.city}`:'', info.comment?`Комментарий: ${info.comment}`:''].filter(Boolean);
    return `Здравствуйте! Хочу оформить заказ в ${STORE.name}:\n\n${lines.join('\n')}\n\nИтого: ${money(total)}`+(who.length?`\n\n${who.join('\n')}`:'')+`\n\nПодскажите, пожалуйста, по оплате и доставке.`;
  }
  function openOrder(cart, info){
    cart = cart || Cart.get();
    if(!cart.length){ toast('Корзина пуста'); return; }
    $('#cmsOrderText').value = buildOrderText(cart, info);
    $$('#cmsCh .cms-chb').forEach(b=>{ const ch=b.dataset.ch; b.classList.toggle('off', !STORE[ch]); });
    $('#cmsOrder').classList.add('open'); syncLock();
  }
  function closeOrder(){ $('#cmsOrder').classList.remove('open'); syncLock(); }
  function copyText(t){ try{ navigator.clipboard.writeText(t); return; }catch(e){} try{ const a=document.createElement('textarea'); a.value=t; document.body.appendChild(a); a.select(); document.execCommand('copy'); a.remove(); }catch(_){} }
  function copyOrder(){ copyText($('#cmsOrderText').value); toast('Текст заказа скопирован'); }
  function sendOrder(ch){
    const raw=$('#cmsOrderText').value, text=encodeURIComponent(raw);
    copyText(raw);
    let url='';
    if(ch==='whatsapp'){ const n=(STORE.whatsapp||'').replace(/\D/g,''); if(!n){ toast('WhatsApp пока не подключён. Выберите Telegram.'); return; } url=`https://wa.me/${n}?text=${text}`; }
    else if(ch==='telegram'){ if(!STORE.telegram){ toast('Telegram пока не подключён'); return; } url=`https://t.me/${encodeURIComponent(STORE.telegram)}`; toast('Текст скопирован. Вставьте его в чат.'); }
    else if(ch==='instagram'){ if(!STORE.instagram){ toast('Instagram пока не подключён. Выберите Telegram.'); return; } url=`https://ig.me/m/${encodeURIComponent(STORE.instagram)}`; toast('Текст скопирован. Вставьте его в чат.'); }
    window.open(url,'_blank','noopener');
  }

  /* ---------- ПОДТВЕРЖДЕНИЕ / ФОРМА ---------- */
  let confirmCb=null;
  function confirmAction(msg, cb){ $('#cmsConfirmMsg').textContent=msg; confirmCb=cb; $('#cmsConfirm').classList.add('open'); syncLock(); setTimeout(()=>$('#cmsConfirmYes').focus(),60); }
  function closeConfirm(){ $('#cmsConfirm').classList.remove('open'); confirmCb=null; syncLock(); }
  function openForm(){ $('#cmsForm').classList.add('open'); syncLock(); }
  function closeForm(){ $('#cmsForm').classList.remove('open'); syncLock(); }
  function promptModal(title,label,value,onOk,multiline){
    $('#cmsFormTitle').textContent=title;
    const field = multiline ? `<textarea class="inp" id="cmsPrompt" style="min-height:110px">${esc(value)}</textarea>` : `<input class="inp" id="cmsPrompt" value="${esc(value)}">`;
    $('#cmsFormBody').innerHTML=`<div class="fld" style="margin:0"><label for="cmsPrompt">${esc(label)}</label>${field}</div>`;
    $('#cmsFormSave').textContent='Сохранить';
    $('#cmsFormSave').onclick=()=>onOk($('#cmsPrompt').value);
    openForm(); setTimeout(()=>{ const el=$('#cmsPrompt'); if(el){ el.focus(); if(!multiline) el.select(); } },90);
  }

  /* ---------- ТЕКСТЫ И КАРТИНКИ НА СТРАНИЦАХ (правка кликом) ---------- */
  function applyContent(){
    $$('[data-edit]').forEach(el=>{
      const k=el.dataset.edit, type=el.dataset.editType||'text';
      if(!el.dataset.def) el.dataset.def = type==='image' ? (el.getAttribute('src')||'') : el.textContent;
      if(type==='image'){
        if(k==='heroImg') return;
        const v=CONTENT[k]; const img = el.tagName==='IMG' ? el : el.querySelector('img');
        if(img){ const want = v || el.dataset.def; if(want && img.getAttribute('src')!==want) img.src=want; }
        return;
      }
      const v=CONTENT[k];
      el.textContent = (v!=null && v!=='') ? v : el.dataset.def;
    });
    const bg=$('#heroPhoto');
    if(bg){ if(STORE.hero){ bg.style.backgroundImage='url("'+String(STORE.hero).replace(/["\\]/g,'')+'")'; bg.hidden=false; } else { bg.hidden=true; bg.style.backgroundImage=''; } }
    $$('[data-store-name]').forEach(el=>el.textContent=STORE.name);
  }
  function editContent(el){
    const k=el.dataset.edit, type=el.dataset.editType||'text', label=el.dataset.editLabel||'Текст';
    if(type==='image'){ openImageEditor(k,label); return; }
    const cur = (CONTENT[k]!=null && CONTENT[k]!=='') ? CONTENT[k] : el.textContent.trim();
    promptModal('Изменить: '+label,'Текст на сайте (оставьте пустым, чтобы вернуть стандартный)',cur,function(v){
      v=(v||'').trim(); const c=DB.content();
      if(v==='' || v===el.dataset.def) delete c[k]; else c[k]=v;
      DB.save(LS.content,c); reloadAll(); closeForm(); toast('Сохранено. Нажмите «Опубликовать», чтобы увидели все.');
    }, true);
  }
  function openImageEditor(k,label){
    $('#cmsFormTitle').textContent='Изменить: '+label;
    const cur = (k==='heroImg') ? (STORE.hero||'') : (CONTENT[k]||'');
    $('#cmsFormBody').innerHTML=`<div class="fld"><label for="cmsImgUrl">Ссылка на фото</label>
      <input class="inp" id="cmsImgUrl" value="${esc(cur.indexOf('data:')===0?'(загруженное фото)':cur)}" placeholder="https://...">
      <label class="filebtn"><input type="file" accept="image/*" hidden onchange="cmsPickImg(this,'cmsImgUrl')"><i class="bi bi-upload"></i>Загрузить с устройства</label>
      <div class="help">${k==='heroImg'?'Фото ляжет фоном первого экрана вместо живой анимации. ':''}Оставьте пустым, чтобы вернуть стандартное.</div></div>`;
    const inp=$('#cmsImgUrl'); if(cur.indexOf('data:')===0) inp.dataset.data=cur;
    inp.addEventListener('input',()=>{ delete inp.dataset.data; });
    $('#cmsFormSave').textContent='Сохранить';
    $('#cmsFormSave').onclick=function(){
      const v = inp.dataset.data || inp.value.trim();
      if(k==='heroImg'){ const s=DB.load(LS.store,{}); s.hero=v; DB.save(LS.store,s); }
      else { const c=DB.content(); if(v) c[k]=v; else delete c[k]; DB.save(LS.content,c); }
      reloadAll(); closeForm(); toast('Сохранено. Нажмите «Опубликовать», чтобы увидели все.');
    };
    openForm();
  }

  /* ---------- ВХОД ---------- */
  function isAdmin(){ try{ return sessionStorage.getItem('zerus_authed')==='1'; }catch(e){ return false; } }
  let adminTab='products';
  function openAdminGate(){
    if(isAdmin()){ openAdmin(); return; }
    $('#cmsLoginU').value=''; $('#cmsLoginP').value=''; $('#cmsLoginF').classList.remove('bad');
    $('#cmsLogin').classList.add('open'); syncLock(); setTimeout(()=>$('#cmsLoginU').focus(),120);
  }
  function closeLogin(){ $('#cmsLogin').classList.remove('open'); syncLock(); if(location.hash==='#admin') history.replaceState(null,'',location.pathname+location.search); }
  function tryLogin(){
    const a=DB.admin(), u=$('#cmsLoginU').value.trim(), p=$('#cmsLoginP').value;
    const ok = u===a.user && (a.hash ? sha256(p)===a.hash : p===a.pass);
    if(ok){
      try{ sessionStorage.setItem('zerus_authed','1'); }catch(e){}
      $('#cmsLogin').classList.remove('open'); enableAdminMode(); openAdmin();
      toast('Вы вошли. Тексты и фото можно править прямо на сайте.');
    } else { $('#cmsLoginF').classList.add('bad'); $('#cmsLoginP').select(); }
  }
  function logoutAdmin(){ try{ sessionStorage.removeItem('zerus_authed'); }catch(e){} disableAdminMode(); closeAdmin(); toast('Вы вышли из админки'); }
  function openAdmin(){ if(isAdmin() && !document.body.classList.contains('cms-admin-on')) enableAdminMode(); $('#cmsAdmin').classList.add('open'); syncLock(); admTab(adminTab); }
  function closeAdmin(){ $('#cmsAdmin').classList.remove('open'); syncLock(); if(location.hash==='#admin') history.replaceState(null,'',location.pathname+location.search); }
  function openAdminAt(t){ adminTab=t; openAdmin(); }
  function admTab(t){ adminTab=t; $$('.cms-atab').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
    ({products:admProducts,cats:admCats,look:admLook,store:admStore,access:admAccess,data:admData}[t]||admProducts)();
    const body=$('#cmsAdmin'); if(body) body.scrollTop=0; }

  /* ---------- АДМИН: ТОВАРЫ ---------- */
  function admProducts(){
    const rows = PRODUCTS.map(p=>{
      const pr = isConfig(p) ? ('от '+money(priceOf(p))) : money(p.price);
      return `<div class="cms-arow"><img src="${esc(thumb(p.img))}" alt="" loading="lazy">
        <div class="i"><div class="n">${esc(p.name)}</div><div class="m">${esc(catOf(p))} · ${pr}${isConfig(p)?' · конфигуратор':''}${p.soon?' · скоро':''}</div></div>
        <div class="acts"><button class="mini" onclick="editProduct('${esc(p.id)}')">Изменить</button><button class="mini danger" onclick="askDeleteProduct('${esc(p.id)}')">Удалить</button></div></div>`;
    }).join('');
    $('#cmsAdmBody').innerHTML = `<div class="cms-sech"><h2>Товары</h2><button class="btn sm" onclick="editProduct(null)"><i class="bi bi-plus-lg"></i>Добавить товар</button></div>
      <p class="cms-hint" style="margin-bottom:18px">${PRODUCTS.length} ${plural(PRODUCTS.length,'товар','товара','товаров')}. Фото, описание, характеристики, цена, категория. Изменения сразу видны вам, а после кнопки <b>«Опубликовать»</b> их увидят все покупатели.</p>
      ${rows||'<div class="cms-empty">Товаров нет. Добавьте первый.</div>'}`;
  }
  let editingId=null;
  function editProduct(id){
    editingId=id;
    const src = id ? PRODUCTS.find(x=>x.id===id) : null;
    const p = src ? clone(src) : { id:'', name:'', category:CATEGORIES[0]||'', description:'', price:0, oldPrice:null, img:'', stock:1, specs:[], newArrival:false, soon:false, release:'' };
    const cfg = isConfig(p);
    $('#cmsFormTitle').textContent = id?'Изменить товар':'Новый товар';
    const catOpts = CATEGORIES.map(c=>`<option ${c===catOf(p)?'selected':''}>${esc(c)}</option>`).join('');
    const specsText = (p.specs||[]).map(s=>`${s.k}: ${s.v}`).join('\n');
    const imgVal = (p.img||'').indexOf('data:')===0 ? '(загруженное фото)' : (p.img===PLACEHOLDER?'':p.img||'');
    $('#cmsFormBody').innerHTML = `
      <div class="fld"><label for="fName">Название</label><input class="inp" id="fName" value="${esc(p.name)}"><div class="err">Укажите название.</div></div>
      <div class="row2">
        <div class="fld"><label for="fCat">Категория</label><select class="inp" id="fCat">${catOpts}</select></div>
        ${cfg ? `<div class="fld"><label>Цена</label><input class="inp" value="от ${esc(fmt(priceOf(p)))} ₽ (конфигуратор)" disabled></div>`
              : `<div class="fld"><label for="fPrice">Цена, ${esc(STORE.currency)}</label><input class="inp" id="fPrice" type="number" inputmode="numeric" min="0" value="${+p.price||0}"></div>`}
      </div>
      ${cfg ? '' : `<div class="row2">
        <div class="fld"><label for="fOld">Старая цена (для скидки)</label><input class="inp" id="fOld" type="number" inputmode="numeric" min="0" value="${p.oldPrice||''}"></div>
        <div class="fld"><label for="fStock">На складе, шт.</label><input class="inp" id="fStock" type="number" inputmode="numeric" min="0" value="${p.stock==null?1:p.stock}"></div>
      </div>`}
      <div class="fld"><span class="lbl">Метки</span><div class="chips">
        <button type="button" class="chip${p.newArrival?' on':''}" id="fNew">Новинка</button>
        <button type="button" class="chip${p.soon?' on':''}" id="fSoon">Скоро в продаже</button>
      </div></div>
      <div class="fld" id="fReleaseWrap" ${p.soon?'':'hidden'}><label for="fRelease">Дата выхода</label><input class="inp" id="fRelease" value="${esc(p.release||'')}" placeholder="20 сентября 2026"></div>
      <div class="fld"><label for="fDesc">Описание</label><textarea class="inp" id="fDesc">${esc(p.description||p.desc||'')}</textarea></div>
      <div class="fld"><label for="fSpecs">Характеристики</label><textarea class="inp" id="fSpecs" placeholder="Экран: 6,1&quot; OLED&#10;Память: 128 ГБ">${esc(specsText)}</textarea><div class="help">Каждая с новой строки, в виде «Название: значение».</div></div>
      <div class="fld"><label for="fImg">Фото: ссылка</label><input class="inp" id="fImg" value="${esc(imgVal)}" placeholder="https://...">
        <label class="filebtn"><input type="file" accept="image/*" hidden onchange="cmsPickImg(this,'fImg')"><i class="bi bi-upload"></i>Загрузить фото</label>
        <div class="help">Лучше всего PNG без фона, примерно 1000×1000.</div></div>
      ${cfg ? '<p class="cms-hint">Это конфигуратор (версии, память, цвета). Здесь меняются название, категория, фото, описание и характеристики, варианты остаются как есть.</p>' : ''}`;
    const fi=$('#fImg'); if((p.img||'').indexOf('data:')===0) fi.dataset.data=p.img; fi.addEventListener('input',()=>{ delete fi.dataset.data; });
    $('#fNew').onclick=function(){ this.classList.toggle('on'); };
    $('#fSoon').onclick=function(){ this.classList.toggle('on'); $('#fReleaseWrap').hidden=!this.classList.contains('on'); };
    $('#cmsFormSave').textContent='Сохранить'; $('#cmsFormSave').onclick=saveProductForm;
    openForm(); setTimeout(()=>{ if(!id) $('#fName').focus(); },100);
  }
  function cmsPickImg(input,targetId){
    const f=input.files[0]; if(!f) return;
    const t=$('#'+targetId);
    const img=new Image(), url=URL.createObjectURL(f);
    img.onload=()=>{   // уменьшаем фото до 1200 px, чтобы база не раздувалась
      const k=Math.min(1,1200/Math.max(img.width,img.height)); const c=document.createElement('canvas');
      c.width=Math.round(img.width*k); c.height=Math.round(img.height*k); c.getContext('2d').drawImage(img,0,0,c.width,c.height);
      const png = /png|webp|gif/.test(f.type);
      t.dataset.data = c.toDataURL(png?'image/png':'image/jpeg', .88); t.value='(загруженное фото)'; URL.revokeObjectURL(url); toast('Фото загружено');
    };
    img.onerror=()=>{ URL.revokeObjectURL(url); toast('Не удалось прочитать фото'); };
    img.src=url; input.value='';
  }
  function fieldVal(id){ const el=$('#'+id); if(!el) return ''; return el.dataset.data || (el.value==='(загруженное фото)'?'':el.value.trim()); }
  function saveProductForm(){
    const name=$('#fName').value.trim(); if(!name){ $('#fName').closest('.fld').classList.add('bad'); $('#fName').focus(); return; }
    const src = editingId ? DB.products().find(x=>x.id===editingId) : null;
    const cfg = src && src.type==='config';
    const specs=$('#fSpecs').value.split('\n').map(l=>l.trim()).filter(Boolean).map(l=>{ const i=l.indexOf(':'); return i>-1?{k:l.slice(0,i).trim(),v:l.slice(i+1).trim()}:{k:l,v:''}; });
    const soon=$('#fSoon').classList.contains('on'), desc=$('#fDesc').value.trim(), img=fieldVal('fImg');
    let obj;
    if(cfg){ obj=Object.assign({}, src, { name, category:$('#fCat').value, description:desc, desc, img:img||src.img, specs, newArrival:$('#fNew').classList.contains('on'), soon, release: soon?$('#fRelease').value.trim():'' }); }
    else {
      obj=Object.assign({}, src||{}, { id: editingId || ('p'+Date.now().toString(36)), type:'simple', cat:(src&&src.cat)||'tech',
        name, category:$('#fCat').value, description:desc, desc,
        price: Math.max(0, parseFloat($('#fPrice').value)||0), oldPrice: parseFloat($('#fOld').value)||null,
        img: img||PLACEHOLDER, stock: Math.max(0, parseInt($('#fStock').value)||0),
        specs, newArrival:$('#fNew').classList.contains('on'), soon, release: soon?$('#fRelease').value.trim():'' });
      if(src && img && img!==src.img) delete obj.colorImages;   // новое общее фото: старые фото по цветам больше не подходят
    }
    const list=DB.products();
    if(editingId){ const i=list.findIndex(x=>x.id===editingId); if(i>-1) list[i]=obj; else list.push(obj); } else list.push(obj);
    if(DB.save(LS.prod,list)){ reloadAll(); closeForm(); if($('#cmsAdmin').classList.contains('open')) admProducts(); toast(editingId?'Товар сохранён':'Товар добавлен'); }
  }
  function askDeleteProduct(id){ const p=PRODUCTS.find(x=>x.id===id);
    confirmAction(`Удалить товар «${p?p.name:''}»? Отменить будет нельзя.`, ()=>{ DB.save(LS.prod, DB.products().filter(x=>x.id!==id)); reloadAll(); if($('#cmsAdmin').classList.contains('open')) admProducts(); toast('Товар удалён'); }); }

  /* ---------- АДМИН: КАТАЛОГ ---------- */
  function admCats(){
    const rows=CATEGORIES.map((c,i)=>{ const n=PRODUCTS.filter(p=>catOf(p)===c).length; return `<div class="cms-arow"><div class="i"><div class="n">${esc(c)}</div><div class="m">${n} ${plural(n,'товар','товара','товаров')}</div></div>
      <div class="acts"><button class="mini" onclick="renameCat(${i})">Переименовать</button><button class="mini danger" onclick="askDeleteCat(${i})">Удалить</button></div></div>`; }).join('');
    $('#cmsAdmBody').innerHTML=`<div class="cms-sech"><h2>Каталог</h2><button class="btn sm" onclick="addCat()"><i class="bi bi-plus-lg"></i>Категория</button></div>
      <p class="cms-hint" style="margin-bottom:18px">Категории показываются в каталоге, фильтрах и подвале сайта.</p>
      ${rows||'<div class="cms-empty">Категорий нет.</div>'}`;
  }
  function addCat(){ promptModal('Новая категория','Название','', v=>{ v=(v||'').trim(); if(!v) return; const list=DB.categories(); if(list.includes(v)){ toast('Такая категория уже есть'); return; }
    list.push(v); DB.save(LS.cats,list); reloadAll(); closeForm(); admCats(); toast('Категория добавлена'); }); }
  function renameCat(i){ const old=CATEGORIES[i]; promptModal('Переименовать категорию','Название',old, v=>{ v=(v||'').trim(); if(!v||v===old){ closeForm(); return; }
    const cats=DB.categories(); cats[i]=v; DB.save(LS.cats,cats);
    const prods=DB.products(); prods.forEach(p=>{ if(catOf(p)===old) p.category=v; }); DB.save(LS.prod,prods);
    reloadAll(); closeForm(); admCats(); toast('Переименовано'); }); }
  function askDeleteCat(i){ const c=CATEGORIES[i]; const n=PRODUCTS.filter(p=>catOf(p)===c).length;
    confirmAction(`Удалить категорию «${c}»?`+(n?` ${n} ${plural(n,'товар останется','товара останутся','товаров останутся')} без категории.`:''), ()=>{ DB.save(LS.cats, DB.categories().filter((_,j)=>j!==i)); reloadAll(); admCats(); toast('Категория удалена'); }); }

  /* ---------- АДМИН: ОФОРМЛЕНИЕ ---------- */
  function admLook(){
    const cur=STORE.palette||'malachite';
    $('#cmsAdmBody').innerHTML=`<div class="cms-sech"><h2>Оформление</h2></div>
      <p class="cms-hint" style="margin-bottom:20px">Цвет всего сайта: кнопки, фон первого экрана, акценты. Выбор применяется сразу, а после <b>«Опубликовать»</b> его увидят все.</p>
      <div class="pal-grid">${PALETTES.map(p=>`<button class="pal${p.id===cur?' on':''}" onclick="setPalette('${p.id}')">
        <div class="sw" style="background:radial-gradient(120% 90% at 85% 15%, ${p.sw[2]}, ${p.sw[1]} 45%, ${p.sw[0]} 85%)"><i style="background:${p.sw[3]}"></i></div>
        <b>${p.name}</b><span>${p.desc}</span></button>`).join('')}</div>
      <div class="cms-card" style="margin-top:22px"><h3>Режим по умолчанию</h3>
        <p class="cms-hint" style="margin-bottom:14px">Каким покупатель увидит сайт при первом визите. Дальше он может переключить сам (кнопка солнца/луны в шапке).</p>
        <div class="chips"><button class="chip${STORE.theme!=='light'?' on':''}" onclick="setDefTheme('dark')"><i class="bi bi-moon"></i> Ночь</button>
        <button class="chip${STORE.theme==='light'?' on':''}" onclick="setDefTheme('light')"><i class="bi bi-sun"></i> День</button></div></div>
      <div class="cms-card"><h3>Фон первого экрана</h3>
        <p class="cms-hint" style="margin-bottom:14px">Сейчас: ${STORE.hero?'<b>своё фото</b>':'<b>живая анимация</b> в цветах палитры'}. Можно поставить своё фото.</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn sm ghost" onclick="openImageEditor('heroImg','Фон первого экрана')"><i class="bi bi-image"></i>Своё фото</button>
        ${STORE.hero?'<button class="btn sm ghost" onclick="clearHero()">Вернуть анимацию</button>':''}</div></div>`;
  }
  function setPalette(id){ try{ sessionStorage.removeItem('zerus_pal_preview'); }catch(e){} const s=DB.load(LS.store,{}); s.palette=id; DB.save(LS.store,s); reloadAll(); admLook(); toast('Палитра применена'); }
  function setDefTheme(t){ const s=DB.load(LS.store,{}); s.theme=t; DB.save(LS.store,s); lsDel(LS.theme); reloadAll(); setThemeAttr(t); admLook(); }
  function clearHero(){ const s=DB.load(LS.store,{}); s.hero=''; DB.save(LS.store,s); reloadAll(); admLook(); toast('Вернули живую анимацию'); }

  /* ---------- АДМИН: МАГАЗИН ---------- */
  function admStore(){ const s=STORE;
    $('#cmsAdmBody').innerHTML=`<div class="cms-sech"><h2>Магазин</h2></div>
      <p class="cms-hint" style="margin-bottom:20px">Контакты и данные магазина: показываются в подвале и используются в кнопках заказа.</p>
      <div class="fld"><label for="sName">Название магазина</label><input class="inp" id="sName" value="${esc(s.name)}"></div>
      <div class="fld"><label for="sAbout">О магазине (текст в подвале)</label><textarea class="inp" id="sAbout">${esc(s.about)}</textarea></div>
      <div class="row2"><div class="fld"><label for="sAddr">Адрес</label><input class="inp" id="sAddr" value="${esc(s.address)}"></div>
        <div class="fld"><label for="sHours">Время работы</label><input class="inp" id="sHours" value="${esc(s.hours)}"></div></div>
      <div class="row2"><div class="fld"><label for="sTg">Telegram (без @)</label><input class="inp" id="sTg" value="${esc(s.telegram)}" placeholder="zerus9501"></div>
        <div class="fld"><label for="sWa">WhatsApp (номер)</label><input class="inp" id="sWa" value="${esc(s.whatsapp)}" inputmode="tel" placeholder="7 900 000-00-00"></div></div>
      <div class="row2"><div class="fld"><label for="sIg">Instagram (без @)</label><input class="inp" id="sIg" value="${esc(s.instagram)}" placeholder="technic.store"></div>
        <div class="fld"><label for="sCur">Валюта</label><input class="inp" id="sCur" value="${esc(s.currency)}" maxlength="3"></div></div>
      <button class="btn" onclick="saveStore()">Сохранить</button>`;
  }
  function saveStore(){ const s=DB.load(LS.store,{});
    Object.assign(s,{ name:$('#sName').value.trim()||'Technic Store', about:$('#sAbout').value.trim(), address:$('#sAddr').value.trim(), hours:$('#sHours').value.trim(),
      telegram:$('#sTg').value.trim().replace(/^@/,''), whatsapp:$('#sWa').value.trim(), instagram:$('#sIg').value.trim().replace(/^@/,''), currency:$('#sCur').value.trim()||'₽' });
    DB.save(LS.store,s); reloadAll(); toast('Сохранено'); }

  /* ---------- АДМИН: ДОСТУП ---------- */
  function admAccess(){ const a=DB.admin();
    $('#cmsAdmBody').innerHTML=`<div class="cms-sech"><h2>Доступ</h2></div>
      <p class="cms-hint" style="margin-bottom:20px">Логин и пароль для входа в админку на этом устройстве. Пароль хранится зашифрованным.</p>
      <div class="row2"><div class="fld"><label for="aUser">Логин</label><input class="inp" id="aUser" value="${esc(a.user)}" autocomplete="off"></div>
        <div class="fld"><label for="aPass">Новый пароль</label><input class="inp" id="aPass" type="password" autocomplete="new-password" placeholder="не меньше 6 символов"></div></div>
      <button class="btn" onclick="saveAccess()">Сохранить</button>`;
  }
  function saveAccess(){ const u=$('#aUser').value.trim(), p=$('#aPass').value; if(!u){ toast('Укажите логин'); return; } if(p && p.length<6){ toast('Пароль должен быть не короче 6 символов'); return; }
    confirmAction('Изменить данные для входа в админку?', ()=>{ const a=DB.admin(); const o={user:u, hash: p?sha256(p):a.hash}; DB.save(LS.admin,o); toast('Доступ обновлён'); }); }

  /* ---------- АДМИН: ПУБЛИКАЦИЯ ---------- */
  const GH = {
    get(){ try{ return Object.assign(clone(REPO),{token:''}, JSON.parse(lsGet(LS.gh)||'{}')); }catch(e){ return Object.assign(clone(REPO),{token:''}); } },
    set(o){ lsSet(LS.gh, JSON.stringify(o)); }
  };
  function admData(){ const g=GH.get(), draft=DB.hasDraft();
    $('#cmsAdmBody').innerHTML=`<div class="cms-sech"><h2>Публикация</h2></div>
      <div class="pubstate${draft?'':' clean'}" id="pubState"></div>
      <button class="btn" id="pubBtn" onclick="publishDB()" ${draft?'':'disabled'}><i class="bi bi-cloud-arrow-up"></i>Опубликовать</button>
      ${draft?'<button class="btn ghost" style="margin-left:6px" onclick="askReset()">Отменить черновик</button>':''}
      <div class="cms-card" style="margin-top:28px"><h3>Ключ публикации (GitHub)</h3>
        <p class="cms-hint" style="margin-bottom:16px">Нужен один раз на устройстве. Создайте ключ на github.com → Settings → Developer settings → Fine-grained tokens: доступ только к репозиторию сайта, право <b>Contents: Read and write</b>. Ключ хранится только в этом браузере.</p>
        <div class="row2"><div class="fld"><label for="ghRepo">Репозиторий</label><input class="inp" id="ghRepo" value="${esc(g.repo)}"></div>
          <div class="fld"><label for="ghBranch">Ветка</label><input class="inp" id="ghBranch" value="${esc(g.branch)}"></div></div>
        <div class="fld"><label for="ghToken">Ключ (token)</label><input class="inp" id="ghToken" type="password" autocomplete="off" value="${esc(g.token)}" placeholder="github_pat_..."></div>
        <button class="btn sm ghost" onclick="saveGH()">Сохранить ключ</button></div>
      <div class="cms-card"><h3>Резервная копия</h3>
        <p class="cms-hint" style="margin-bottom:16px"><b>Скачать:</b> файл со всеми товарами, текстами и настройками. <b>Загрузить:</b> восстановить из такого файла (станет черновиком).</p>
        <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn sm ghost" onclick="exportDB()"><i class="bi bi-download"></i>Скачать</button>
        <label class="btn sm ghost" style="cursor:pointer"><i class="bi bi-upload"></i>Загрузить<input type="file" accept="application/json" hidden onchange="importDB(this)"></label></div></div>`;
    updateDraftUI();
  }
  function saveGH(){ const o={ repo:$('#ghRepo').value.trim()||REPO.repo, branch:$('#ghBranch').value.trim()||REPO.branch, token:$('#ghToken').value.trim() };
    GH.set(o); toast(o.token?'Ключ сохранён в этом браузере':'Ключ удалён'); }
  async function ghApi(g,path,method,body){
    let r;
    try{ r=await fetch('https://api.github.com/repos/'+g.repo+path,{method:method||'GET',cache:'no-store',
      headers:Object.assign({'Authorization':'Bearer '+g.token,'Accept':'application/vnd.github+json'}, body?{'Content-Type':'application/json'}:{}),
      body:body?JSON.stringify(body):undefined}); }
    catch(e){ throw new Error('Нет связи с GitHub. Проверьте интернет и попробуйте ещё раз.'); }
    if(!r.ok){
      const m={401:'Ключ неверный или истёк. Создайте новый.',403:'У ключа нет права записи. Нужен доступ «Contents: Read and write».',
        404:'Репозиторий не найден или ключ к нему не допущен.',409:'Сайт изменился во время публикации. Нажмите «Опубликовать» ещё раз.',422:'Сайт изменился во время публикации. Нажмите «Опубликовать» ещё раз.'};
      throw new Error(m[r.status]||('GitHub ответил ошибкой '+r.status+'.'));
    }
    return r.json();
  }
  let publishing=false;
  async function publishDB(){
    const g=GH.get();
    if(!g.token){ toast('Сначала добавьте ключ публикации'); openAdminAt('data'); setTimeout(()=>{ const t=$('#ghToken'); if(t) t.focus(); },200); return; }
    if(publishing) return; publishing=true; updateDraftUI('Публикую…');
    try{
      const products=DB.products(), categories=DB.categories(), store=DB.store(), content=DB.content();
      const blobs=[], stamp=Date.now().toString(36), done=new Map();
      const toFile=(u,name)=>{
        const m=/^data:image\/(png|webp|jpeg|gif);base64,(.+)$/.exec(u||''); if(!m) return u;
        if(done.has(u)) return done.get(u);
        const path='images/p/'+name+'-'+stamp+'.'+(m[1]==='jpeg'?'jpg':m[1]); blobs.push({path,b64:m[2]}); done.set(u,path); return path;
      };
      products.forEach(p=>{ const sid=String(p.id).replace(/[^a-z0-9_-]/gi,'')||'p'; if(p.img===PLACEHOLDER) p.img=''; p.img=toFile(p.img,sid); });
      store.hero=toFile(store.hero,'hero');
      Object.keys(content).forEach(k=>{ content[k]=toFile(content[k],'c-'+k.replace(/[^a-z0-9_-]/gi,'')); });
      const db={_v:2,_rev:Date.now(),_date:new Date().toISOString(),products,categories,store,content};
      const br=encodeURIComponent(g.branch||'main');
      const ref=await ghApi(g,'/git/ref/heads/'+br);
      const base=await ghApi(g,'/git/commits/'+ref.object.sha);
      const tree=[];
      for(const f of blobs){ const bl=await ghApi(g,'/git/blobs','POST',{content:f.b64,encoding:'base64'}); tree.push({path:f.path,mode:'100644',type:'blob',sha:bl.sha}); }
      tree.push({path:'data/db.json',mode:'100644',type:'blob',content:JSON.stringify(db,null,1)});
      const nt=await ghApi(g,'/git/trees','POST',{base_tree:base.tree.sha,tree});
      const nc=await ghApi(g,'/git/commits','POST',{message:'Публикация из админки: '+products.length+' товаров',tree:nt.sha,parents:[ref.object.sha]});
      await ghApi(g,'/git/refs/heads/'+br,'PATCH',{sha:nc.sha});
      setPub(db); [LS.prod,LS.cats,LS.store,LS.content].forEach(lsDel);
      reloadAll(); if($('#cmsAdmin').classList.contains('open')) admTab(adminTab);
      toast('Опубликовано. Покупатели увидят изменения через 1-2 минуты.');
    }catch(e){ toast(e.message||'Не удалось опубликовать.'); }
    finally{ publishing=false; updateDraftUI(); }
  }
  function setPub(db){ PUB=db; if(!lsSet(LS.pub, JSON.stringify(db))) lsDel(LS.pub); }
  function updateDraftUI(busy){
    const draft=DB.hasDraft();
    const bb=$('#cmsBarPub'); if(bb){ bb.textContent = busy || (draft?'Опубликовать':'Всё опубликовано'); bb.disabled=!!busy||!draft; bb.classList.toggle('pri', draft&&!busy); }
    const st=$('#cmsBarState'); if(st) st.textContent = draft ? 'есть неопубликованные изменения' : '';
    const pb=$('#pubBtn'); if(pb){ pb.disabled=!!busy||!draft; pb.innerHTML = '<i class="bi bi-cloud-arrow-up"></i>'+(busy||'Опубликовать'); }
    const ps=$('#pubState'); if(ps){ ps.classList.toggle('clean',!draft); ps.innerHTML = draft ? '<i class="bi bi-pencil-square"></i><span><b>Есть неопубликованные изменения.</b> Покупатели их пока не видят.</span>' : '<i class="bi bi-check2-circle"></i><span>Всё, что вы видите, уже опубликовано на сайте.</span>'; }
    const d=$('#cmsTabDot'); if(d) d.hidden=!draft;
  }
  function exportDB(){ const data={ products:DB.products(), categories:DB.categories(), store:DB.store(), content:DB.content(), _v:2, _date:new Date().toISOString() };
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'})); a.download='technic-store-base.json';
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); toast('Файл базы скачан'); }
  function importDB(input){ const f=input.files[0]; if(!f) return; const r=new FileReader();
    r.onload=()=>{ let d; try{ d=JSON.parse(r.result); }catch(e){ toast('Файл повреждён'); return; }
      confirmAction('Загрузить базу из файла? Текущий черновик будет заменён.', ()=>{ if(d.products)DB.save(LS.prod,d.products); if(d.categories)DB.save(LS.cats,d.categories);
        if(d.store)DB.save(LS.store,d.store); if(d.content)DB.save(LS.content,d.content); reloadAll(); admData(); toast('База загружена. Проверьте и нажмите «Опубликовать».'); }); };
    r.readAsText(f); input.value=''; }
  function askReset(){ confirmAction('Удалить неопубликованные изменения? Сайт в этом браузере вернётся к опубликованной версии.', ()=>{
    [LS.prod,LS.cats,LS.store,LS.content].forEach(lsDel); reloadAll(); admTab(adminTab); toast('Черновик удалён'); }); }

  /* ---------- РЕЖИМ АДМИНА НА САЙТЕ ---------- */
  function enableAdminMode(){ document.body.classList.add('cms-admin-on'); updateDraftUI(); if(CMS.onChange) CMS.onChange(); }
  function disableAdminMode(){ document.body.classList.remove('cms-admin-on'); if(CMS.onChange) CMS.onChange(); }

  /* ---------- ПОДВАЛ ---------- */
  function renderFooter(elId){
    const el=document.getElementById(elId); if(!el) return; const s=STORE;
    const tg=s.telegram?`https://t.me/${encodeURIComponent(s.telegram)}`:'';
    const wa=s.whatsapp?`https://wa.me/${s.whatsapp.replace(/\D/g,'')}`:'';
    const ig=s.instagram?`https://instagram.com/${encodeURIComponent(s.instagram)}`:'';
    el.classList.add('cms-foot');
    el.innerHTML=`<div class="fgrid">
      <div><div class="fb"><span class="logo-mark"></span>${esc(s.name)}</div><p>${esc(s.about)}</p>
        <button class="cms-inline" style="margin-top:16px" onclick="openAdminAt('store')"><i class="bi bi-pencil"></i>Изменить</button></div>
      <div><div class="fh">Каталог</div><div class="fcats">${CATEGORIES.map(c=>`<a class="fcat" href="index.html#catalog" data-cat="${esc(c)}">${esc(c)}</a>`).join('')}</div></div>
      <div><div class="fh">Магазин</div>
        <div class="fi"><i class="bi bi-geo-alt"></i><span>${esc(s.address)}</span></div>
        <div class="fi"><i class="bi bi-clock"></i><span>${esc(s.hours)}</span></div>
        ${s.telegram?`<div class="fi"><i class="bi bi-telegram"></i><a href="${tg}" target="_blank" rel="noopener">@${esc(s.telegram)}</a></div>`:''}
        ${s.whatsapp?`<div class="fi"><i class="bi bi-whatsapp"></i><a href="${wa}" target="_blank" rel="noopener">${esc(s.whatsapp)}</a></div>`:''}
        ${s.instagram?`<div class="fi"><i class="bi bi-instagram"></i><a href="${ig}" target="_blank" rel="noopener">@${esc(s.instagram)}</a></div>`:''}
      </div>
    </div>
    <div class="fbot"><span>© ${new Date().getFullYear()} ${esc(s.name)}</span><span>Оригинальная техника с гарантией</span></div>`;
    el.querySelectorAll('.fcat').forEach(a=>a.addEventListener('click',e=>{ if(CMS.onCatPick){ e.preventDefault(); CMS.onCatPick(a.dataset.cat); } else { try{ sessionStorage.setItem('zerus_cat',a.dataset.cat); }catch(_){} } }));
  }
  function updateTg(){ const f=$('#cmsTg'); if(!f) return; if(STORE.telegram){ f.href=`https://t.me/${encodeURIComponent(STORE.telegram)}`; f.hidden=false; } else f.hidden=true;
    $$('[data-tg-link]').forEach(a=>{ if(STORE.telegram){ a.href=`https://t.me/${encodeURIComponent(STORE.telegram)}`; a.hidden=false; } else a.hidden=true; }); }

  /* ---------- ШАПКА, МЕНЮ, ПОЯВЛЕНИЕ ---------- */
  function initChrome(){
    $$('[data-theme-toggle]').forEach(b=>b.addEventListener('click',toggleTheme));
    const menu=$('#mnav');
    function closeMenu(){ if(menu){ menu.classList.remove('open'); syncLock(); } }
    $$('[data-menu-open]').forEach(b=>b.addEventListener('click',()=>{ if(menu){ menu.classList.add('open'); syncLock(); const f=menu.querySelector('a,button'); if(f) setTimeout(()=>f.focus(),60); } }));
    $$('[data-menu-close]').forEach(b=>b.addEventListener('click',closeMenu));
    if(menu) menu.addEventListener('click',e=>{ if(e.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown',e=>{
      if(e.key!=='Escape') return;
      if($('#cmsConfirm.open')) return closeConfirm();
      if($('#cmsForm.open')) return closeForm();
      if($('#cmsOrder.open')) return closeOrder();
      if($('#cmsLogin.open')) return closeLogin();
      if($('#cmsAdmin.open')) return closeAdmin();
      if(menu && menu.classList.contains('open')) return closeMenu();
    });
    $$('.cms-modal').forEach(m=>m.addEventListener('click',e=>{ if(e.target!==m) return;
      if(m.id==='cmsConfirm') closeConfirm(); else if(m.id==='cmsForm') closeForm(); else if(m.id==='cmsOrder') closeOrder(); else if(m.id==='cmsLogin') closeLogin(); }));
    /* тень под шапкой после начала прокрутки */
    const nav=$('.nav');
    if(nav && window.IntersectionObserver){
      const s=document.createElement('div'); s.style.cssText='position:absolute;top:0;left:0;width:1px;height:8px;pointer-events:none'; document.body.prepend(s);
      new IntersectionObserver(es=>nav.classList.toggle('stuck',!es[0].isIntersecting)).observe(s);
    }
    observeReveal();
  }
  /* карточка товара (каталог, «похожие») */
  function card(p,i){
    i=i||0;
    const adm = isAdmin() ? `<div class="pc-adm"><button onclick="editProduct('${esc(p.id)}')" aria-label="Изменить"><i class="bi bi-pencil"></i></button><button onclick="askDeleteProduct('${esc(p.id)}')" aria-label="Удалить"><i class="bi bi-trash"></i></button></div>` : '';
    const href='product.html?id='+encodeURIComponent(p.id), cfg=isConfig(p), stock=inStock(p);
    let price, st, act, flag='';
    if(p.soon){
      price='<span style="color:var(--ac)">Скоро</span>';
      st=`<div class="pc-stock soon">${p.release?'В продаже с '+esc(p.release):'Скоро в продаже'}</div>`;
      act=`<a class="pc-add" href="${href}" aria-label="Подробнее: ${esc(p.name)}"><i class="bi bi-arrow-right"></i></a>`;
    } else {
      price = cfg ? '<span class="from">от</span>'+money(priceOf(p)) : money(p.price) + (p.oldPrice && p.oldPrice>p.price ? '<s>'+money(p.oldPrice)+'</s>' : '');
      st = stock ? `<div class="pc-stock">${cfg?'Версии и цвета':'В наличии'}</div>` : '<div class="pc-stock out">Нет в наличии</div>';
      act = cfg ? `<a class="pc-add" href="${href}" aria-label="Выбрать конфигурацию: ${esc(p.name)}"><i class="bi bi-sliders2"></i></a>`
          : (stock ? `<button class="pc-add" data-add="${esc(p.id)}" aria-label="В корзину: ${esc(p.name)}"><i class="bi bi-plus-lg"></i></button>` : '');
    }
    if(p.newArrival) flag='<span class="pc-flag">Новинка</span>';
    else if(!p.soon && p.oldPrice && p.oldPrice>p.price) flag=`<span class="pc-flag">−${Math.round((1-p.price/p.oldPrice)*100)}%</span>`;
    return `<article class="pc rv" style="--d:${(Math.min(i,7)*0.04).toFixed(2)}s">${adm}${flag}
      <a class="pc-stage" href="${href}" tabindex="-1" aria-hidden="true"><img src="${esc(thumb(p.img))}" alt="" loading="lazy" decoding="async"></a>
      <div class="pc-body"><div class="pc-cat">${esc(catOf(p))}</div><a class="pc-name" href="${href}">${esc(p.name)}</a>
      <div class="pc-foot"><div><div class="pc-price">${price}</div>${st}</div>${act}</div></div></article>`;
  }
  /* «+» на карточке: обычный товар сразу в корзину */
  document.addEventListener('click',function(e){
    const add=e.target.closest('[data-add]'); if(!add) return;
    const p=PRODUCTS.find(x=>x.id===add.dataset.add); if(!p) return;
    Cart.add({ id:p.id, name:p.name, price:p.price, img:p.img });
    add.classList.add('done'); add.innerHTML='<i class="bi bi-check-lg"></i>';
    setTimeout(()=>{ add.classList.remove('done'); add.innerHTML='<i class="bi bi-plus-lg"></i>'; },1600);
    toast('Добавлено: '+p.name,{href:'order.html',text:'Корзина'});
  });
  /* ссылки на категории с других страниц: запоминаем выбор, главная откроет каталог с фильтром */
  document.addEventListener('click',function(e){
    if(CMS.onCatPick) return;
    const a=e.target.closest('a[data-cat]'); if(a){ try{ sessionStorage.setItem('zerus_cat',a.dataset.cat||''); }catch(_){} }
  });

  let revIO=null;
  function observeReveal(root){
    const els=(root||document).querySelectorAll('.rv:not(.in)');
    if(!window.IntersectionObserver){ els.forEach(e=>e.classList.add('in')); return; }
    if(!revIO) revIO=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); revIO.unobserve(e.target); } }),{rootMargin:'0px 0px -8% 0px',threshold:.08});
    els.forEach(e=>revIO.observe(e));
  }

  /* фото не загрузилось: облегчённая копия → оригинал → заглушка */
  document.addEventListener('error',function(e){
    const t=e.target; if(!t || t.tagName!=='IMG') return;
    const src=t.getAttribute('src')||'';
    const m=/^images\/w\/([\w.-]+)\.webp$/.exec(src);
    if(m && !t.dataset.fb1){ t.dataset.fb1='1'; t.src='images/'+m[1]+'.png'; return; }
    if(!t.dataset.fb2){ t.dataset.fb2='1'; t.src=PLACEHOLDER; }
  },true);

  /* ---------- перезагрузка данных ---------- */
  function reloadAll(){ loadData(); applyPalette(); updateTg(); applyContent(); if(CMS.footerEl) renderFooter(CMS.footerEl); updateDraftUI(); if(CMS.onChange) CMS.onChange(); }

  Object.assign(window, { openAdminGate, closeAdmin, closeLogin, tryLogin, logoutAdmin, openAdmin, openAdminAt, admTab,
    editProduct, saveProductForm, askDeleteProduct, cmsPickImg, addCat, renameCat, askDeleteCat, saveStore, saveAccess,
    exportDB, importDB, askReset, closeForm, closeConfirm, closeOrder, sendOrder, copyOrder, publishDB, saveGH,
    setPalette, setDefTheme, clearHero, openImageEditor });

  /* ---------- init ---------- */
  const CMS = {
    onChange:null, onCatPick:null, footerEl:null, ready:false,
    getProducts:()=>PRODUCTS, getCategories:()=>CATEGORIES, getStore:()=>STORE, getContent:()=>CONTENT, palettes:PALETTES,
    catOf, money, fmt, priceOf, isAdmin, openOrder, isConfig, thumb, inStock, plural, esc, toast, cart:Cart, card,
    reload:reloadAll, observeReveal, applyPalette,
    init(opts){
      opts=opts||{};
      CMS.onChange=opts.onChange||null; CMS.onCatPick=opts.onCatPick||null; CMS.footerEl=opts.footerEl||null;
      document.body.insertAdjacentHTML('beforeend', UI);
      document.getElementById('cmsConfirmYes').addEventListener('click',()=>{ const cb=confirmCb; closeConfirm(); if(cb) cb(); });
      loadData(); applyPalette(); updateTg(); updateThemeIcons(); applyContent(); Cart.paint();
      if(CMS.footerEl) renderFooter(CMS.footerEl);
      initChrome();
      document.addEventListener('click', function(e){
        if(!document.body.classList.contains('cms-admin-on')) return;
        if(e.target.closest('.cms-modal, .cms-admin, #cmsBar')) return;
        const el = e.target.closest('[data-edit]');
        if(!el) return;
        e.preventDefault(); e.stopPropagation();
        editContent(el);
      }, true);
      window.addEventListener('storage', e=>{ if(e.key===LS.cart) Cart.paint(); });
      if(isAdmin()) enableAdminMode();
      if(location.hash==='#admin') openAdminGate();
      CMS.ready=true;
      /* свежая опубликованная база с сервера */
      if(location.protocol.indexOf('http')===0 && window.fetch){
        fetch('data/db.json?_='+Date.now(),{cache:'no-store'}).then(r=>r.ok?r.json():null).then(db=>{
          if(!db || !db.products) return;
          if(PUB && (PUB._rev||0) >= (db._rev||0)) return;   // уже есть та же или новее (только что опубликовали с этого устройства)
          setPub(db); reloadAll();
        }).catch(()=>{});
      }
    }
  };
  window.CMS = CMS;
})();
