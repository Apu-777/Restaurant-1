(() => {
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const page   = document.body.dataset.page;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine   = matchMedia('(pointer:fine)').matches;
  const todayISO = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().split('T')[0]; };

  /* ================= Images (one place to edit) ================= */
  const IMG = {
    steak:   ['1544025162-d76694265947', 'Dry-aged ribeye'],
    dining:  ['1517248135467-4c7edcad34c4', 'The dining room'],
    chef:    ['1577219491135-ce391730fb2c', 'Chef Arman Rahim'],
    plate:   ['1414235077428-338989a2e8c0', 'Seasonal plate'],
    room:    ['1559339352-11d035aa65de', 'Evening in the room'],
    kitchen: ['1556910103-1c02745aae4d', 'Prep before service'],
    leeks:   ['1476224203421-9ac39bcb3327', 'Charred leeks'],
    lounge:  ['1555396273-367ea4eb4db5', 'Corner table'],
    plating: ['1600565193348-f74bd3c7ccdf', 'Plating'],
    pasta:   ['1473093295043-cdd812d0e601', 'Hand-rolled pasta'],
    crowd:   ['1424847651672-bf20a4b0982b', 'Full house'],
    market:  ['1504674900247-0877df9cc836', 'Market haul'],
  };
  const src = (k, w = 900) => `https://images.unsplash.com/photo-${IMG[k][0]}?auto=format&fit=crop&w=${w}&q=70`;
  const placeholder = k => 'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a211c"/><stop offset="1" stop-color="#5a2a18"/></linearGradient></defs><rect width="800" height="1000" fill="url(#g)"/><text x="400" y="510" fill="#efe7da" font-size="44" text-anchor="middle" font-family="Georgia,serif">${IMG[k][1]}</text></svg>`);
  // If an image fails to load, show a branded placeholder instead of a broken icon
  document.addEventListener('error', e => {
    const i = e.target;
    if (i.tagName !== 'IMG' || !i.dataset.img || i.dataset.ph) return;
    i.dataset.ph = '1'; i.src = placeholder(i.dataset.img);
  }, true);
  $$('img[data-img]').forEach(i => { i.src = src(i.dataset.img, +i.dataset.w || 1000); });
  const imgTag = (k, alt = '', w = 900) => `<img loading="lazy" data-img="${k}" alt="${alt}" src="${src(k, w)}">`;

  /* ================= Shared layout ================= */
  const LINKS = [
    ['index.html', 'Home', 'home'], ['about.html', 'About', 'about'], ['menu.html', 'Menu', 'menu'],
    ['chef.html', 'Chef', 'chef'], ['portfolio.html', 'Portfolio', 'portfolio'], ['gallery.html', 'Gallery', 'gallery'],
    ['blog.html', 'Blog', 'blog'], ['contact.html', 'Contact', 'contact'], ['reservations.html', 'Reservations', 'reservations'],
  ];
  const cur = k => k === page ? ' aria-current="page"' : '';
  const plain   = ([h, t, k]) => `<a href="${h}"${cur(k)}>${t}</a>`;
  const navLink = l => l[2] === 'reservations' ? `<a href="${l[0]}" class="btn btn--sm mag"${cur(l[2])}>${l[1]}</a>` : plain(l);

  document.body.insertAdjacentHTML('afterbegin', `
    <div class="prog"></div>
    <header class="nav">
      <a href="index.html" class="nav__logo">Ember<em>&amp;</em>Salt</a>
      <nav class="nav__links" aria-label="Main">${LINKS.map(navLink).join('')}</nav>
      <button class="nav__burger" aria-label="Toggle menu"><span></span><span></span></button>
    </header>`);

  $('main').insertAdjacentHTML('afterend', `
    <footer class="footer">
      <div class="wrap footer__grid">
        <div><a href="index.html" class="nav__logo">Ember<em>&amp;</em>Salt</a><p>Wood-fired cooking, seasonal produce and a short, honest menu.</p></div>
        <div><h4>Explore</h4><ul>${LINKS.map(l => `<li>${plain(l)}</li>`).join('')}</ul></div>
        <div><h4>Visit</h4><ul><li>24 Riverside Road</li><li>Tue – Sun · 6pm – 11pm</li><li>+880 1234 567 890</li><li>hello@emberandsalt.example</li></ul></div>
      </div>
      <div class="wrap footer__base"><span>© 2026 Ember &amp; Salt</span><span>Instagram · Facebook · Maps</span></div>
    </footer>
    <button class="totop" aria-label="Back to top">
      <svg class="ring" viewBox="0 0 56 56" aria-hidden="true"><circle class="bg" cx="28" cy="28" r="26"/><circle class="fg" cx="28" cy="28" r="26"/></svg>
      <svg class="arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
    </button>`);

  /* ================= Content data ================= */
  const MENU = {
    Starters: [
      ['Charred Leeks', 'Hazelnut romesco, smoked sheep’s curd, chive oil', '$12', 'V'],
      ['Beef Tartare', 'Hand-cut, ember-roasted shallot, rye crisp', '$16', ''],
      ['Burnt Honey Squash', 'Whipped feta, pepitas, sage brown butter', '$13', 'V·GF'],
      ['Grilled Prawns', 'Garlic, chilli, charred lemon, flatbread', '$18', ''],
    ],
    Mains: [
      ['Dry-Aged Ribeye', '300g, bone marrow butter, fire-roasted greens', '$44', 'GF'],
      ['Whole Seabass', 'Salt-baked, fennel, salsa verde', '$36', 'GF'],
      ['Oak-Smoked Lamb Shoulder', 'Slow-cooked, white beans, pickled chilli', '$34', ''],
      ['Wild Mushroom Risotto', 'Aged parmesan, thyme, black garlic', '$26', 'V·GF'],
    ],
    Sides: [
      ['Ember Potatoes', 'Smashed, rosemary salt, garlic aioli', '$8', 'V·GF'],
      ['Fire-Roasted Greens', 'Lemon, chilli, toasted almonds', '$9', 'V·GF'],
      ['Charred Flatbread', 'Brushed with cultured butter', '$6', 'V'],
    ],
    Desserts: [
      ['Burnt Basque Cheesecake', 'Roasted plum, vanilla cream', '$11', 'V·GF'],
      ['Dark Chocolate Pot', 'Sea salt, olive oil, toasted sourdough', '$10', 'V'],
      ['Ember-Baked Apple', 'Calvados caramel, oat crumble', '$10', 'V'],
    ],
    Drinks: [
      ['Smoked Old Fashioned', 'Oak-smoked bourbon, demerara, orange', '$14', ''],
      ['Salted Tamarind Soda', 'House tamarind, sea salt, soda', '$7', 'V·GF'],
      ['Natural Wine Flight', 'Three small pours, chef’s choice', '$22', ''],
      ['Single-Origin Espresso', 'Roasted weekly by local partners', '$4', 'V·GF'],
    ],
  };

  // [image key, caption, category]
  const GALLERY = [
    ['steak', 'Dry-aged ribeye off the coals', 'Food'],
    ['dining', 'The dining room at dusk', 'Space'],
    ['chef', 'Chef Arman at the pass', 'Team'],
    ['plate', 'Seasonal plate, early autumn', 'Food'],
    ['lounge', 'Corner table, late service', 'Space'],
    ['kitchen', 'Prep before service', 'Team'],
    ['leeks', 'Charred leeks, romesco', 'Food'],
    ['room', 'Evening in the main room', 'Space'],
    ['plating', 'Plating with tweezers and patience', 'Team'],
    ['pasta', 'Hand-rolled pasta', 'Food'],
    ['crowd', 'Friday night, full house', 'Space'],
    ['market', 'Market haul, Tuesday morning', 'Food'],
  ];

  const POSTS = [
    { cat: 'Kitchen', date: 'Oct 28, 2026', min: 5, img: 'kitchen', title: 'Why we only cook with oak',
      excerpt: 'Different woods burn differently. Here is why one tree runs our entire kitchen.',
      body: ['Oak burns hot, steady and clean. It gives us coals that last through a full service, and a gentle smokiness that supports the ingredient instead of covering it.', 'We source seasoned oak from a family mill nearby. Every log is split and stacked a full year before it ever reaches the hearth.'] },
    { cat: 'Sourcing', date: 'Oct 14, 2026', min: 4, img: 'market', title: 'A morning at the market',
      excerpt: 'Tuesday at 6am: how a menu actually changes, one crate at a time.',
      body: ['Most of our menu changes begin at the market. We arrive early, walk the stalls, and let the best produce decide what happens that week.', 'It’s inefficient and sometimes frustrating, and it is the reason the food tastes like the season it was served in.'] },
    { cat: 'Recipes', date: 'Sep 30, 2026', min: 6, img: 'leeks', title: 'Charred leeks, at home',
      excerpt: 'Our most-requested starter, scaled down for a domestic kitchen.',
      body: ['Halve the leeks lengthwise, oil them lightly and place them cut-side down on a very hot grill pan until properly blackened.', 'Wrap them for ten minutes to steam through, peel the outer layer, and serve over a spoonful of romesco with a little flaky salt.'] },
    { cat: 'News', date: 'Sep 12, 2026', min: 3, img: 'room', title: 'Sundays are now lunch',
      excerpt: 'From this month we’re opening at 1pm on Sundays, with a relaxed family-style menu.',
      body: ['After a year of requests, Sunday service now starts at lunch. Expect sharing platters, long tables and a menu built for conversation.', 'Booking is open now. Groups of up to twelve can reserve the long table.'] },
    { cat: 'Kitchen', date: 'Aug 22, 2026', min: 5, img: 'steak', title: 'Inside the dry-ageing room',
      excerpt: 'Forty-five days, one salt wall and a lot of patience.',
      body: ['Our ageing room holds a constant temperature and humidity, lined with Himalayan salt. Beef rests there for around forty-five days.', 'The result is deeper flavour and a tender texture that only time can build.'] },
    { cat: 'Recipes', date: 'Aug 5, 2026', min: 4, img: 'pasta', title: 'Hand-rolled pasta basics',
      excerpt: 'Two ingredients, a little rest, and the right amount of flour.',
      body: ['Good pasta starts with a firm dough. Use fine flour and eggs, knead until smooth, then let it rest under a cloth for at least thirty minutes.', 'Roll thin, cut by hand, and cook in generously salted water for just a couple of minutes.'] },
  ];

  // Sample case studies. Replace with your real events.
  const PROJECTS = [
    { t: 'Riverside Wedding Feast', cat: 'Events', year: '2026', client: 'Private wedding', img: 'room',
      d: 'A long-table feast for 180 guests on the riverbank, cooked on three portable hearths with a menu built around the couple’s grandparents’ recipes.', facts: ['180 guests', '5-course fire menu', '3 hearths on site'] },
    { t: 'Autumn Harvest Dinner', cat: 'Events', year: '2026', client: 'Partner farms', img: 'plate',
      d: 'A one-night dinner for our growers, with every plate built from produce harvested within 48 hours of service.', facts: ['48 guests', '14 farms credited', 'Zero-waste menu'] },
    { t: 'Tech Summit Catering', cat: 'Catering', year: '2025', client: 'Annual industry summit', img: 'crowd',
      d: 'Two days of lunch service for 600 delegates, built around grilled mains, shared salads and a live carving station.', facts: ['600 guests', '2 days', '4 live stations'] },
    { t: 'Sunday Fire Market', cat: 'Pop-ups', year: '2025', client: 'City market', img: 'market',
      d: 'A weekend pop-up in the old market square selling flatbreads, charred vegetables and smoked sausages from a single wood-fired grill.', facts: ['2 weekends', '3,200 portions', 'Sold out both days'] },
    { t: 'Wine & Embers', cat: 'Collabs', year: '2025', client: 'Hartley Cellars (sample)', img: 'lounge',
      d: 'A six-course pairing dinner with a small natural-wine producer, matching each course to a different cellar release.', facts: ['40 guests', '6 courses', '6 wines'] },
    { t: 'Rooftop Smoke Supper', cat: 'Pop-ups', year: '2024', client: 'Rooftop venue', img: 'steak',
      d: 'A summer-evening supper on a city rooftop, cooked on a mobile grill under open sky.', facts: ['80 guests', '1 night', 'Open-air service'] },
    { t: 'Grand Hall Corporate Gala', cat: 'Catering', year: '2024', client: 'Regional business awards', img: 'plating',
      d: 'A plated three-course dinner for 320 guests, with the main course finished over coals in a temporary open kitchen.', facts: ['320 guests', '3 courses', 'Open kitchen on stage'] },
    { t: 'Chef’s Table × Local Farms', cat: 'Collabs', year: '2024', client: 'Growers’ cooperative', img: 'leeks',
      d: 'A series of four farm-to-table dinners, each hosted in a different grower’s field and cooked entirely from that farm.', facts: ['4 dinners', '4 farms', '120 guests total'] },
  ];

  /* ================= Dialog helper ================= */
  let dlg;
  const openDlg = html => {
    if (!dlg) {
      dlg = document.createElement('dialog');
      dlg.addEventListener('click', e => { if (e.target === dlg || e.target.closest('.dlg__x')) dlg.close(); });
      document.body.append(dlg);
    }
    dlg.className = 'dlg';
    dlg.innerHTML = `<button class="dlg__x" aria-label="Close">×</button>${html}`;
    if (!dlg.open) dlg.showModal();
  };

  const tabsHTML = (names, active) =>
    names.map(n => `<button class="tab${n === active ? ' is-active' : ''}" role="tab" aria-selected="${n === active}" data-k="${n}">${n}</button>`).join('');
  const bindTabs = (box, cb) => box.addEventListener('click', e => {
    const t = e.target.closest('.tab');
    if (!t || t.classList.contains('is-active')) return;
    $$('.tab', box).forEach(x => { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
    t.classList.add('is-active'); t.setAttribute('aria-selected', 'true');
    cb(t.dataset.k);
  });
  const popIn = (sel, ctx) => { if (window.gsap && !reduce) gsap.from($$(sel, ctx), { y: 30, opacity: 0, duration: .7, stagger: .08, ease: 'power3.out', clearProps: 'all' }); };

  /* ================= Menu page ================= */
  /* The menu is a book. Each leaf has a front (right page) and a back (left page).
     Spread k shows the back of leaf k-1 on the left and the front of leaf k on the right. */
  let book = null;
  const bookEl = $('#book');
  if (bookEl) {
    const cats = Object.keys(MENU);
    const CAT_IMG = { Starters: 'leeks', Mains: 'steak', Sides: 'market', Desserts: 'plate', Drinks: 'lounge' };
    const num = i => String(i + 1).padStart(2, '0');
    const dishes = c => MENU[c].map(([n, d, p, t]) =>
      `<li class="dish"><div class="dish__top"><h3>${n}${t ? `<small>${t}</small>` : ''}</h3><i></i><span>${p}</span></div><p>${d}</p></li>`).join('');

    const cover = `<div class="pg pg--cover">
        <p class="eyebrow">Autumn 2026</p>
        <div><span class="pg__logo">Ember<em>&amp;</em>Salt</span><h2>The <em>Menu</em></h2></div>
        <p class="pg__hint">Scroll or press next to open</p></div>`;
    const listPage = (c, i) => `<div class="pg pg--list">
        <header class="pg__head"><span>${num(i)}</span><h2>${c}</h2></header>
        <ul class="pg__dishes">${dishes(c)}</ul>
        <footer class="pg__foot">${i * 2 + 3}</footer></div>`;
    const imagePage = (c, i) => `<div class="pg pg--img">${imgTag(CAT_IMG[c], IMG[CAT_IMG[c]][1], 900)}
        <div class="pg__cap"><span>Chapter ${num(i)}</span><h2>${c}</h2></div></div>`;
    const insideCover = `<div class="pg pg--plain">
        <p class="eyebrow">Welcome</p>
        <h2>Tonight, <em>from the fire.</em></h2>
        <p>Everything on this menu touches oak coals at some point. The list is short on purpose and changes with the market.</p>
        <p class="pg__legend"><b>V</b> Vegetarian &nbsp;·&nbsp; <b>GF</b> Gluten-free</p></div>`;
    const quotePage = `<div class="pg pg--plain pg--quote">
        <blockquote>“Good fire, good produce, and the patience to leave both alone.”</blockquote>
        <cite>Chef Arman Rahim</cite></div>`;
    const endPage = `<div class="pg pg--plain pg--end">
        <p class="eyebrow">That’s the menu</p>
        <h2>Hungry <em>yet?</em></h2>
        <p>Tue – Sun · 6pm – 11pm<br>24 Riverside Road</p>
        <a href="reservations.html" class="btn mag">Reserve a table</a></div>`;

    // Leaf fronts and backs, in order
    const fronts = [cover, ...cats.map(listPage)];
    const backs  = [...cats.map(imagePage), quotePage];
    const N = fronts.length;
    const LABELS = ['Cover', ...cats, 'The end'];

    bookEl.innerHTML =
      `<div class="book__base book__base--l">${insideCover}</div><div class="book__base book__base--r">${endPage}</div>` +
      fronts.map((f, i) => `<div class="leaf" data-i="${i}"><div class="leaf__face leaf__front">${f}</div><div class="leaf__face leaf__back">${backs[i]}</div></div>`).join('');
    const leaves = $$('.leaf', bookEl);
    const prev = $('#bookPrev'), next = $('#bookNext'), count = $('#bookCount');

    const state = { t: 0 };
    let shown = -1;
    const render = () => {
      const t = state.t;
      leaves.forEach((l, i) => {
        const p = Math.min(Math.max(t - i, 0), 1);
        l.style.transform = `rotateY(${-180 * p}deg)`;
        l.style.zIndex = p < .5 ? N - i : N + i;          // turning leaf switches stacks at the midpoint
        l.style.setProperty('--shade', Math.sin(p * Math.PI).toFixed(3));
        l.classList.toggle('is-turned', p >= .5);
      });
      const k = Math.round(t);
      if (k !== shown) {
        shown = k;
        count.innerHTML = `<b>${LABELS[k]}</b> · ${k + 1} / ${N + 1}`;
        prev.disabled = k === 0; next.disabled = k === N;
        // keep keyboard focus off pages that are hidden behind others
        leaves.forEach((l, i) => {
          $$('a,button', l).forEach(a => a.tabIndex = -1);
          l.setAttribute('aria-hidden', i === k || i === k - 1 ? 'false' : 'true');
        });
        $$('a', $('.book__base--r', bookEl)).forEach(a => a.tabIndex = k === N ? 0 : -1);
      }
    };

    // Without scroll animation: buttons flip pages with a CSS transition
    let timer;
    const goStatic = k => {
      bookEl.classList.add('is-static');
      const from = state.t;
      state.t = k; render();
      // pages moving in this step sit above everything until they land
      leaves.forEach((l, i) => { if (i >= Math.min(from, k) && i < Math.max(from, k)) l.style.zIndex = 3 * N; });
      clearTimeout(timer); timer = setTimeout(render, 900);
    };
    book = { N, state, render, el: bookEl, go: goStatic, current: () => Math.round(state.t) };

    prev.addEventListener('click', () => book.go(Math.max(book.current() - 1, 0)));
    next.addEventListener('click', () => book.go(Math.min(book.current() + 1, N)));
    render();
  }

  /* ================= Portfolio page ================= */
  const pgrid = $('#pgrid');
  if (pgrid) {
    const cats = ['All', 'Events', 'Catering', 'Pop-ups', 'Collabs'];
    const draw = (c, animate) => {
      const list = PROJECTS.filter(p => c === 'All' || p.cat === c);
      pgrid.innerHTML = list.map(p => `
        <button class="pcard reveal" data-view data-i="${PROJECTS.indexOf(p)}">
          <div class="card__img">${imgTag(p.img, p.t, 1000)}</div>
          <p class="post__meta">${p.cat} · ${p.year}</p>
          <h3>${p.t}</h3><p>${p.client}</p>
        </button>`).join('');
      if (animate) popIn('.pcard', pgrid);
    };
    $('#pTabs').innerHTML = tabsHTML(cats, 'All');
    bindTabs($('#pTabs'), c => draw(c, true));
    draw('All', false);
    pgrid.addEventListener('click', e => {
      const b = e.target.closest('.pcard'); if (!b) return;
      const p = PROJECTS[+b.dataset.i];
      openDlg(`<article><div class="art__img">${imgTag(p.img, p.t, 1400)}</div>
        <div class="art__body"><p class="post__meta">${p.cat} · ${p.year} · ${p.client}</p><h2>${p.t}</h2><p>${p.d}</p>
        <ul class="facts">${p.facts.map(f => `<li>${f}</li>`).join('')}</ul></div></article>`);
    });
  }

  /* ================= Gallery page ================= */
  const gal = $('#gal');
  if (gal) {
    let shown = [], at = 0;
    const cats = ['All', 'Food', 'Space', 'Team'];
    const draw = (c, animate) => {
      shown = GALLERY.filter(g => c === 'All' || g[2] === c);
      gal.innerHTML = shown.map((g, i) =>
        `<figure class="reveal" data-view data-i="${i}" tabindex="0">${imgTag(g[0], g[1])}<figcaption>${g[1]}</figcaption></figure>`).join('');
      if (animate) popIn('figure', gal);
    };
    const show = i => {
      at = (i + shown.length) % shown.length;
      const g = shown[at];
      openDlg(`${imgTag(g[0], g[1], 1600)}<div class="lb__bar"><button data-n="${at - 1}">← Prev</button><span>${g[1]}</span><button data-n="${at + 1}">Next →</button></div>`);
      dlg.classList.add('lb');
    };
    $('#galTabs').innerHTML = tabsHTML(cats, 'All');
    bindTabs($('#galTabs'), c => draw(c, true));
    draw('All', false);
    gal.addEventListener('click', e => { const f = e.target.closest('figure'); if (f) show(+f.dataset.i); });
    gal.addEventListener('keydown', e => { if (e.key === 'Enter') e.target.click(); });
    document.addEventListener('click', e => { const b = e.target.closest('.lb__bar button'); if (b) show(+b.dataset.n); });
    document.addEventListener('keydown', e => {
      if (!dlg || !dlg.open || !dlg.classList.contains('lb')) return;
      if (e.key === 'ArrowRight') show(at + 1);
      if (e.key === 'ArrowLeft') show(at - 1);
    });
  }

  /* ================= Blog page ================= */
  const posts = $('#posts');
  if (posts) {
    const cats = ['All', ...new Set(POSTS.map(p => p.cat))];
    const draw = (c, animate) => {
      const list = POSTS.filter(p => c === 'All' || p.cat === c);
      posts.innerHTML = list.map(p => `
        <button class="post reveal" data-view data-t="${p.title}">
          <div class="card__img">${imgTag(p.img)}</div>
          <p class="post__meta">${p.cat} · ${p.min} min read</p>
          <h3>${p.title}</h3><p>${p.excerpt}</p>
        </button>`).join('');
      if (animate) popIn('.post', posts);
    };
    $('#postTabs').innerHTML = tabsHTML(cats, 'All');
    bindTabs($('#postTabs'), c => draw(c, true));
    draw('All', false);
    posts.addEventListener('click', e => {
      const b = e.target.closest('.post'); if (!b) return;
      const p = POSTS.find(x => x.title === b.dataset.t);
      openDlg(`<article><div class="art__img">${imgTag(p.img, '', 1400)}</div>
        <div class="art__body"><p class="post__meta">${p.cat} · ${p.date} · ${p.min} min read</p><h2>${p.title}</h2>${p.body.map(t => `<p>${t}</p>`).join('')}</div></article>`);
    });
  }

  /* ================= Nav, progress bar, back-to-top ================= */
  const nav = $('.nav'), totop = $('.totop'), ring = $('.totop .fg'), prog = $('.prog');
  const C = 163.4; // ring circumference (2π × 26)
  $('.nav__burger').addEventListener('click', () => {
    nav.classList.toggle('open');
    document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
  });
  totop.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
  let lastY = 0;
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? Math.min(y / max, 1) : 0;
    nav.classList.toggle('is-solid', y > 80);
    nav.classList.toggle('is-hidden', y > lastY && y > 500 && !nav.classList.contains('open'));
    lastY = y;
    prog.style.transform = `scaleX(${p})`;
    ring.style.strokeDashoffset = C * (1 - p);
    totop.classList.toggle('show', y > 600);
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ================= Simple forms (contact, newsletter) ================= */
  $$('input[type=date]').forEach(i => i.min = todayISO());
  $$('form[data-form]').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    const msg = $('.form__msg', form);
    let ok = true;
    $$('input[required],textarea[required]', form).forEach(i => {
      const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value));
      i.classList.toggle('err', bad);
      if (bad) ok = false;
    });
    if (!ok) { msg.textContent = 'Please check the highlighted fields.'; return; }
    const first = form.name && form.name.value ? form.name.value.split(' ')[0] : '';
    msg.textContent = first ? `Thank you, ${first} — we’ll be in touch shortly.` : 'Thank you — you’re on the list.';
    form.reset();
    if (window.gsap && !reduce) gsap.from(msg, { y: 10, opacity: 0, duration: .6 });
  }));

  /* ================= Reservations wizard ================= */
  const wiz = $('#wiz');
  if (wiz) {
    const S = { step: 1, date: '', guests: 2, occasion: 'Dinner', seat: 'Dining room', time: '', name: '', ref: '' };
    const panes = $$('.pane', wiz), dots = $$('#steps li'), steps = $('#steps');
    const EVENING = ['6:00 pm', '6:30 pm', '7:00 pm', '7:30 pm', '8:00 pm', '8:30 pm', '9:00 pm', '9:30 pm'];
    const SUNDAY  = ['1:00 pm', '2:00 pm', '3:00 pm', '4:00 pm', '5:00 pm', '6:00 pm', '7:00 pm', '8:00 pm'];
    const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
    const dateIn = $('#rDate'); dateIn.min = todayISO();
    const prettyDate = () => { const [y, m, d] = S.date.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); };

    const err = (pane, msg) => { const el = $('.wiz__err', pane); el.textContent = msg; el.classList.remove('shake'); void el.offsetWidth; el.classList.add('shake'); };

    const drawSlots = () => {
      const box = $('#slots'), note = $('#slotNote');
      const [y, m, d] = S.date.split('-').map(Number), dow = new Date(y, m - 1, d).getDay();
      if (dow === 1) { box.innerHTML = ''; note.textContent = 'We’re closed on Mondays — please pick another day.'; return; }
      const list = dow === 0 ? SUNDAY : EVENING, h = hash(S.date);
      box.innerHTML = list.map((t, i) => {
        const full = (h + i * 7) % 5 === 0 || (S.guests >= 7 && i % 2 === 1);
        return `<button type="button" class="chip${S.time === t ? ' is-on' : ''}" data-t="${t}"${full ? ' disabled' : ''}>${t}</button>`;
      }).join('');
      note.textContent = 'Crossed-out times are fully booked.';
    };

    const go = n => {
      const from = panes[S.step - 1], to = panes[n - 1], dir = n > S.step ? 1 : -1;
      S.step = n;
      dots.forEach((d, i) => { d.classList.toggle('is-on', i + 1 === n); d.classList.toggle('is-done', i + 1 < n); });
      steps.style.setProperty('--p', (n - 1) / 3);
      if (n === 2) drawSlots();
      const swap = () => {
        from.hidden = true; to.hidden = false;
        if (window.gsap && !reduce) {
          gsap.fromTo(to, { x: 40 * dir, opacity: 0 }, { x: 0, opacity: 1, duration: .6, ease: 'power3.out', clearProps: 'all' });
          gsap.from($$('.stag', to), { y: 22, opacity: 0, duration: .6, stagger: .07, delay: .1, ease: 'power3.out', clearProps: 'all' });
        }
        if (n === 4) requestAnimationFrame(() => $('#ok').classList.add('go'));
        $('.res__main').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      };
      if (window.gsap && !reduce) gsap.to(from, { x: -40 * dir, opacity: 0, duration: .35, ease: 'power2.in', onComplete: () => { gsap.set(from, { clearProps: 'all' }); swap(); } });
      else swap();
    };

    dateIn.addEventListener('change', () => { S.date = dateIn.value; S.time = ''; });
    // Guests: 1–999, typed into the box or changed with − / + (hold a button to repeat)
    const G_MIN = 1, G_MAX = 999;
    const gIn = $('#gN'), gMinus = $('#gm'), gPlus = $('#gp');
    const setGuests = n => {
      n = Math.round(Number(n));
      S.guests = Math.max(G_MIN, Math.min(G_MAX, Number.isFinite(n) ? n : G_MIN));
      gIn.value = S.guests; S.time = '';
      gMinus.disabled = S.guests <= G_MIN; gPlus.disabled = S.guests >= G_MAX;
    };
    // While typing: digits only, max 3; the box may be empty mid-edit
    gIn.addEventListener('input', () => {
      const v = gIn.value.replace(/\D/g, '').slice(0, 3);
      if (v !== gIn.value) gIn.value = v;
      if (v !== '' && +v >= G_MIN) { S.guests = +v; S.time = ''; gMinus.disabled = S.guests <= G_MIN; gPlus.disabled = false; }
    });
    // When done typing (blur / Enter): settle on a valid number
    const commitGuests = () => setGuests(gIn.value === '' ? S.guests : gIn.value);
    gIn.addEventListener('change', commitGuests);
    gIn.addEventListener('blur', commitGuests);
    gIn.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); commitGuests(); gIn.blur(); } });
    gIn.addEventListener('focus', () => gIn.select());

    const holdRepeat = (btn, delta) => {
      let wait, rep, held = false;
      const stop = () => { clearTimeout(wait); clearInterval(rep); };
      btn.addEventListener('pointerdown', e => {
        if (e.button !== 0 || btn.disabled) return;
        stop(); held = false;
        wait = setTimeout(() => {
          let ticks = 0;
          held = true;
          rep = setInterval(() => {
            ticks++;
            setGuests(S.guests + delta * (ticks > 30 ? 10 : 1));   // speeds up after ~2 seconds
            if (btn.disabled) stop();
          }, 70);
        }, 400);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => btn.addEventListener(t, stop));
      btn.addEventListener('click', () => {  // single tap / keyboard (skipped right after a hold)
        if (held) { held = false; return; }
        setGuests(S.guests + delta);
      });
    };
    holdRepeat(gMinus, -1);
    holdRepeat(gPlus, 1);
    setGuests(S.guests);

    wiz.addEventListener('click', e => {
      const chip = e.target.closest('.chip');
      if (chip && !chip.disabled) {
        const g = chip.parentElement;
        $$('.chip', g).forEach(x => x.classList.remove('is-on'));
        chip.classList.add('is-on');
        if (g.id === 'occ') S.occasion = chip.dataset.v;
        if (g.id === 'seats') S.seat = chip.dataset.v;
        if (g.id === 'slots') S.time = chip.dataset.t;
      }
      if (e.target.closest('[data-back]')) go(S.step - 1);
      if (e.target.closest('[data-next]')) {
        if (S.step === 1) {
          commitGuests();
          if (!S.date) return err(panes[0], 'Please choose a date.');
          const [y, m, d] = S.date.split('-').map(Number);
          if (new Date(y, m - 1, d).getDay() === 1) return err(panes[0], 'We’re closed on Mondays — please pick another day.');
          go(2);
        } else if (S.step === 2) {
          if (!S.time) return err(panes[1], 'Please pick an available time.');
          go(3);
        }
      }
    });

    $('#rForm').addEventListener('submit', e => {
      e.preventDefault();
      const f = e.target; let ok = true;
      $$('input[required]', f).forEach(i => {
        const bad = !i.value.trim() || (i.type === 'email' && !/^\S+@\S+\.\S+$/.test(i.value));
        i.classList.toggle('err', bad); if (bad) ok = false;
      });
      if (!ok) return err(panes[2], 'Please check the highlighted fields.');
      S.name = f.name.value.trim();
      S.ref = 'ES-' + Math.random().toString(36).slice(2, 7).toUpperCase();
      $('#who').textContent = `You’re booked, ${S.name.split(' ')[0]}.`;
      $('#ref').textContent = S.ref;
      $('#sum').innerHTML = [['Date', prettyDate()], ['Time', S.time], ['Party', `${S.guests} ${S.guests === 1 ? 'guest' : 'guests'}`], ['Seating', S.seat], ['Occasion', S.occasion]]
        .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
      go(4);
    });

    $('#ics').addEventListener('click', () => {
      const [y, m, d] = S.date.split('-'); const [hm, ap] = S.time.split(' '); let [h, mi] = hm.split(':').map(Number);
      if (ap === 'pm' && h < 12) h += 12;
      const p = n => String(n).padStart(2, '0');
      const txt = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ember & Salt//EN', 'BEGIN:VEVENT', `UID:${S.ref}@emberandsalt`,
        `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
        `DTSTART:${y}${m}${d}T${p(h)}${p(mi)}00`, `DTEND:${y}${m}${d}T${p(h + 2)}${p(mi)}00`,
        'SUMMARY:Dinner at Ember & Salt', `DESCRIPTION:Table for ${S.guests}. Ref ${S.ref}`, 'LOCATION:24 Riverside Road', 'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([txt], { type: 'text/calendar' }));
      a.download = 'ember-and-salt-booking.ics'; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });

    $('#again').addEventListener('click', () => {
      Object.assign(S, { date: '', guests: 2, occasion: 'Dinner', seat: 'Dining room', time: '' });
      dateIn.value = ''; setGuests(2); $('#rForm').reset(); $('#ok').classList.remove('go');
      $$('#occ .chip').forEach((c, i) => c.classList.toggle('is-on', i === 0));
      $$('#seats .chip').forEach((c, i) => c.classList.toggle('is-on', i === 0));
      go(1);
    });
  }

  /* ================= Motion ================= */
  const curtain = $('.curtain');
  if (typeof gsap === 'undefined' || reduce) {
    curtain.remove();
    $$('[data-count]').forEach(el => el.textContent = (+el.dataset.count).toLocaleString());
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* -- Page intro: curtain lifts, hero text rises -- */
  const firstVisit = page === 'home' && !sessionStorage.getItem('es-seen');
  try { sessionStorage.setItem('es-seen', '1'); } catch (_) {}
  gsap.set('.hero__title .ln>span', { yPercent: 115 });
  gsap.set('.hero__meta', { opacity: 0, y: 20 });
  gsap.set('.curtain span', { y: 20 });

  const heroIn = () => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.to('.hero__title .ln>span', { yPercent: 0, duration: 1.3, stagger: .13 })
      .from('.hero__bg', { scale: 1.2, duration: 2.2 }, 0)
      .to('.hero__meta', { opacity: 1, y: 0, duration: 1, stagger: .12 }, .4)
      .from('.nav__links>*', { y: -18, opacity: 0, duration: .8, stagger: .05, clearProps: 'all' }, .5);
  };
  const intro = gsap.timeline();
  if (firstVisit) intro.to('.curtain span', { opacity: 1, y: 0, duration: .7, ease: 'power3.out' })
                       .to('.curtain span', { opacity: 0, y: -20, duration: .5, delay: .5 });
  intro.to(curtain, { yPercent: -100, duration: .9, ease: 'power3.inOut' })
       .add(heroIn, '-=.5')
       .set(curtain, { display: 'none' });

  /* -- Page-out: curtain wipes up, then navigate -- */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || a.target || a.hasAttribute('download') || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || u.pathname === location.pathname) return;
    e.preventDefault();
    gsap.set('.curtain span', { opacity: 0 });
    gsap.set(curtain, { display: 'grid', yPercent: 100 });
    gsap.to(curtain, { yPercent: 0, duration: .7, ease: 'power3.inOut', onComplete: () => location.href = a.href });
  });
  addEventListener('pageshow', e => { if (e.persisted) gsap.set(curtain, { display: 'none' }); });

  /* -- Headline word-by-word reveal -- */
  const splitNode = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === 3) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) frag.append(part);
        else { const w = document.createElement('span'); w.className = 'w'; w.innerHTML = `<span>${part}</span>`; frag.append(w); }
      });
      n.replaceWith(frag);
    } else if (n.nodeType === 1 && n.tagName !== 'BR') splitNode(n);
  });
  $$('h2.split').forEach(h => {
    splitNode(h);
    gsap.set($$('.w>span', h), { yPercent: 110 });
    ScrollTrigger.create({ trigger: h, start: 'top 88%', once: true,
      onEnter: () => gsap.to($$('.w>span', h), { yPercent: 0, duration: 1, stagger: .06, ease: 'power4.out' }) });
  });

  /* -- Parallax -- */
  $$('[data-speed]').forEach(el => {
    const s = +el.dataset.speed;
    gsap.fromTo(el, { yPercent: -s }, { yPercent: s, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* -- Scroll reveals -- */
  gsap.set('.reveal', { y: 40, opacity: 0 });
  ScrollTrigger.batch('.reveal', {
    start: 'top 90%', once: true,
    onEnter: els => gsap.to(els, { y: 0, opacity: 1, duration: 1, stagger: .12, ease: 'power3.out', overwrite: true }),
  });

  /* -- Divider lines draw in -- */
  $$('.rows li,.tl li').forEach(li => {
    gsap.set(li, { '--s': 0 });
    gsap.to(li, { '--s': 1, duration: 1.3, ease: 'power3.inOut',
      scrollTrigger: { trigger: li, start: 'top 92%', once: true } });
  });

  /* -- Image curtain reveal -- */
  $$('.clip').forEach(el => gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' },
    { clipPath: 'inset(0 0 0% 0)', duration: 1.5, ease: 'power4.inOut',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true } }));

  /* -- Counters -- */
  $$('[data-count]').forEach(el => {
    const o = { v: 0 };
    gsap.to(o, { v: +el.dataset.count, duration: 2, ease: 'power2.out',
      onUpdate: () => el.textContent = Math.round(o.v).toLocaleString(),
      scrollTrigger: { trigger: el, start: 'top 92%', once: true } });
  });

  /* -- Marquee that speeds up with scroll velocity -- */
  const mt = $('.marquee__track');
  if (mt) {
    mt.classList.add('is-js');
    const tw = gsap.to(mt, { xPercent: -50, duration: 30, ease: 'none', repeat: -1 });
    ScrollTrigger.create({ onUpdate: s => {
      const v = Math.min(Math.abs(s.getVelocity()) / 350, 8);
      gsap.to(tw, { timeScale: 1 + v, duration: .15, overwrite: true, onComplete: () => gsap.to(tw, { timeScale: 1, duration: 1.2 }) });
    } });
  }

  /* -- Pinned horizontal gallery (desktop); swipeable on mobile -- */
  const track = $('.hs__track');
  if (track) gsap.matchMedia().add('(min-width: 901px)', () => {
    gsap.to(track, { x: () => -(track.scrollWidth - innerWidth), ease: 'none',
      scrollTrigger: { trigger: '.hs', start: 'top top', end: () => '+=' + (track.scrollWidth - innerWidth),
        pin: true, scrub: .6, invalidateOnRefresh: true } });
  });

  /* -- Menu book: pinned while scrolling, each step of scroll turns one page -- */
  if (book) {
    book.el.classList.remove('is-static');
    // CSS smooth scrolling fights ScrollTrigger's snap (it overshoots a page), so turn it off here
    document.documentElement.style.scrollBehavior = 'auto';
    let aim = null;   // page a button click is heading to, so quick repeat clicks keep counting
    // When scrolling stops part-way through a turn, finish it: one page forward when scrolling
    // down, one page back when scrolling up (no momentum, so a fast flick never skips a page).
    const snapPage = (p, self) => {
      if (aim !== null) return aim / book.N;
      const x = p * book.N;
      return (self.direction > 0 ? Math.ceil(x - .03) : Math.floor(x + .03)) / book.N;
    };
    const turn = gsap.to(book.state, { t: book.N, ease: 'none', onUpdate: book.render,
      scrollTrigger: { trigger: '.book-stage', start: 'top top', end: () => '+=' + innerHeight * .75 * book.N,
        pin: true, scrub: .7, invalidateOnRefresh: true,
        snap: { snapTo: snapPage, inertia: false, duration: { min: .3, max: .8 }, delay: .1, ease: 'power2.inOut' } } });
    // Buttons scroll to the spot where that page is open, so scroll and buttons stay in sync
    book.go = k => {
      const st = turn.scrollTrigger;
      aim = k;
      scrollTo({ top: st.start + (st.end - st.start) * k / book.N, behavior: 'smooth' });
    };
    book.current = () => aim !== null ? aim : Math.round(turn.scrollTrigger.progress * book.N);
    ScrollTrigger.addEventListener('scrollEnd', () => { aim = null; });
  }

  /* -- Floating embers in the home hero -- */
  const hero = $('.hero');
  if (hero) {
    const cv = document.createElement('canvas'); cv.className = 'embers';
    hero.querySelector('.hero__media').after(cv);
    const ctx = cv.getContext('2d');
    let W, H, run = true, parts = [];
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    const make = fresh => ({ x: Math.random() * W, y: fresh ? Math.random() * H : H + 10, r: Math.random() * 2 + .6,
      vy: Math.random() * .5 + .25, vx: (Math.random() - .5) * .25, ph: Math.random() * 6.28, a: Math.random() * .6 + .25 });
    const size = () => { W = cv.clientWidth; H = cv.clientHeight; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      parts = Array.from({ length: W < 700 ? 22 : 46 }, () => make(true)); };
    size(); addEventListener('resize', size);
    new IntersectionObserver(([e]) => { run = e.isIntersecting; if (run) loop(); }).observe(hero);
    const loop = () => {
      if (!run || document.hidden) return;
      ctx.clearRect(0, 0, W, H);
      parts.forEach((p, i) => {
        p.y -= p.vy; p.ph += .02; p.x += p.vx + Math.sin(p.ph) * .3;
        if (p.y < -10) parts[i] = make(false);
        const fade = Math.min(1, p.y / (H * .5));
        ctx.fillStyle = `rgba(226,85,43,${p.a * fade * .18})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 4, 0, 6.283); ctx.fill();
        ctx.fillStyle = `rgba(255,170,110,${p.a * fade})`;     ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill();
      });
      requestAnimationFrame(loop);
    };
    document.addEventListener('visibilitychange', () => { if (!document.hidden && run) loop(); });
    loop();
  }

  /* -- Fine-pointer extras: magnetic buttons, cursor ring, card tilt, hover image list -- */
  if (fine) {
    $$('.mag').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * .3, y: (e.clientY - r.top - r.height / 2) * .4, duration: .4 });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.4)' }));
    });

    const ringEl = document.createElement('div'); ringEl.className = 'cur'; document.body.append(ringEl);
    const rx = gsap.quickTo(ringEl, 'x', { duration: .35, ease: 'power3' }), ry = gsap.quickTo(ringEl, 'y', { duration: .35, ease: 'power3' });
    let tilted = null;
    document.addEventListener('mousemove', e => {
      rx(e.clientX); ry(e.clientY); ringEl.classList.add('on');
      const t = e.target, view = !!t.closest('[data-view]');
      ringEl.classList.toggle('is-view', view);
      ringEl.classList.toggle('is-link', !view && !!t.closest('a,button,summary,.tab,input,select,textarea,label'));
      // card tilt (delegated, so filtered/re-rendered cards work too)
      const c = t.closest('.card,.pcard');
      if (c !== tilted) { if (tilted) gsap.to(tilted, { rotationX: 0, rotationY: 0, duration: .8, ease: 'elastic.out(1,.5)' }); tilted = c; }
      if (c) { const r = c.getBoundingClientRect();
        gsap.to(c, { rotationY: ((e.clientX - r.left) / r.width - .5) * 8, rotationX: -((e.clientY - r.top) / r.height - .5) * 8, transformPerspective: 900, duration: .5, ease: 'power2.out' }); }
    });
    document.addEventListener('mouseleave', () => ringEl.classList.remove('on'));

    const links = $$('[data-pop]');
    if (links.length) {
      const pop = document.createElement('div'); pop.className = 'pop'; pop.innerHTML = '<img alt="">'; document.body.append(pop);
      const pimg = $('img', pop);
      gsap.set(pop, { opacity: 0, scale: .8 });
      const px = gsap.quickTo(pop, 'x', { duration: .5, ease: 'power3' }), py = gsap.quickTo(pop, 'y', { duration: .5, ease: 'power3' });
      document.addEventListener('mousemove', e => { px(e.clientX); py(e.clientY); });
      links.forEach(a => {
        a.addEventListener('mouseenter', () => {
          pimg.removeAttribute('data-ph'); pimg.dataset.img = a.dataset.pop; pimg.src = src(a.dataset.pop, 600);
          gsap.to(pop, { opacity: 1, scale: 1, duration: .4, ease: 'power3.out' });
        });
        a.addEventListener('mouseleave', () => gsap.to(pop, { opacity: 0, scale: .8, duration: .3 }));
      });
    }
  }
})();