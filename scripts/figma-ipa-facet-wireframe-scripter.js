/**
 * IPA facet wireframe — full rebuild from scratch.
 * Run inside Figma via Scripter plugin.
 *
 * Creates on the "Wireframe" page:
 *   01 — Home        : nav + hero + article grid
 *   02 — Search results : nav + full-width overlay (sidebar + 4-col card grid)
 *
 * Prototype link: click search input on 01 → navigate to 02
 *                 click "← Back" on 02 → navigate to 01
 */
(async () => {
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });

  // ─── Find or create page ────────────────────────────────────────────────────
  let page = figma.root.children.find((p) => p.name.includes('Wireframe'));
  if (!page) {
    page = figma.root.appendChild(figma.createPage());
    page.name = 'Wireframe';
  }
  await figma.setCurrentPageAsync(page);

  // Remove all existing frames on the page
  [...page.children].forEach((n) => n.remove());

  // ─── Colour palette ─────────────────────────────────────────────────────────
  const c = {
    white:   { r: 1,    g: 1,    b: 1    },
    pageBg:  { r: 0.95, g: 0.95, b: 0.96 },
    navBg:   { r: 1,    g: 1,    b: 1    },
    line:    { r: 0.85, g: 0.87, b: 0.89 },
    inputBg: { r: 0.96, g: 0.96, b: 0.96 },
    cardBg:  { r: 1,    g: 1,    b: 1    },
    imgBg:   { r: 0.88, g: 0.90, b: 0.93 },
    chip:    { r: 0.91, g: 0.94, b: 0.99 },
    chipBr:  { r: 0.35, g: 0.52, b: 0.95 },
    blue:    { r: 0.02, g: 0.40, b: 0.86 },
    muted:   { r: 0.40, g: 0.40, b: 0.40 },
    warn:    { r: 0.98, g: 0.94, b: 0.88 },
    hero:    { r: 0.07, g: 0.07, b: 0.10 },
  };

  const shadow = (a = 0.10, y = 4, blur = 8) => ({
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a },
    offset: { x: 0, y },
    radius: blur,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  });

  // ─── Text helper ────────────────────────────────────────────────────────────
  function tx(str, size, weight = 'regular', colour = null) {
    const style = weight === 'semi' ? 'Semi Bold' : weight === 'medium' ? 'Medium' : 'Regular';
    const t = figma.createText();
    t.fontName = { family: 'Inter', style };
    t.characters = str;
    t.fontSize = size;
    t.fills = [{ type: 'SOLID', color: colour ?? { r: 0.10, g: 0.11, b: 0.14 } }];
    return t;
  }
  function muted(str, size = 10) {
    const t = tx(str, size, 'regular', c.muted);
    t.opacity = 0.6;
    return t;
  }

  // ─── Shared: nav bar builder ─────────────────────────────────────────────────
  function buildNav(parent, searchLabel) {
    const nav = figma.createFrame();
    nav.name = 'Nav bar';
    nav.layoutMode = 'HORIZONTAL';
    nav.primaryAxisAlignItems = 'SPACE_BETWEEN';
    nav.counterAxisAlignItems = 'CENTER';
    nav.paddingLeft = 32;
    nav.paddingRight = 32;
    nav.fills = [{ type: 'SOLID', color: c.navBg }];
    nav.strokes = [{ type: 'SOLID', color: c.line }];
    nav.strokeWeight = 1;
    nav.effects = [shadow(0.08, 2, 8)];
    nav.resize(1440, 64);
    nav.layoutSizingHorizontal = 'FILL';
    nav.layoutSizingVertical = 'FIXED';
    parent.appendChild(nav);

    nav.appendChild(tx('Adobe Developer Blog', 15, 'semi'));

    const right = figma.createFrame();
    right.layoutMode = 'HORIZONTAL';
    right.itemSpacing = 24;
    right.counterAxisAlignItems = 'CENTER';
    right.fills = [];
    right.layoutSizingHorizontal = 'HUG';
    right.layoutSizingVertical = 'HUG';
    nav.appendChild(right);

    ['Topics', 'Events', 'Community'].forEach((label) => {
      const link = tx(label, 13, 'regular', c.muted);
      right.appendChild(link);
    });

    const searchBox = figma.createFrame();
    searchBox.name = 'Search input (nav)';
    searchBox.layoutMode = 'HORIZONTAL';
    searchBox.counterAxisAlignItems = 'CENTER';
    searchBox.itemSpacing = 8;
    searchBox.paddingLeft = 12;
    searchBox.paddingRight = 32;
    searchBox.paddingTop = 8;
    searchBox.paddingBottom = 8;
    searchBox.fills = [{ type: 'SOLID', color: c.inputBg }];
    searchBox.strokes = [{ type: 'SOLID', color: c.line }];
    searchBox.strokeWeight = 1;
    searchBox.cornerRadius = 6;
    searchBox.layoutSizingHorizontal = 'HUG';
    searchBox.layoutSizingVertical = 'HUG';
    right.appendChild(searchBox);

    searchBox.appendChild(tx('🔍', 12));
    searchBox.appendChild(tx(searchLabel, 13, 'regular', c.muted));

    return { nav, searchBox };
  }

  // ─── Shared: article card builder ───────────────────────────────────────────
  const cardData = [
    { tag: 'UXP',     title: 'Building accessible UXP plugins for Photoshop' },
    { tag: 'AEM',     title: 'AEM as a Cloud Service: content migration guide' },
    { tag: 'FIREFLY', title: 'Firefly API: generate images at scale' },
    { tag: 'EXPRESS', title: 'Adobe Express Add-ons deep dive' },
  ];

  function buildCard(data, cardH = 494) {
    const card = figma.createFrame();
    card.name = `Article card — ${data.tag}`;
    card.layoutMode = 'VERTICAL';
    card.itemSpacing = 0;
    card.fills = [{ type: 'SOLID', color: c.cardBg }];
    card.strokes = [{ type: 'SOLID', color: c.line }];
    card.strokeWeight = 1;
    card.cornerRadius = 4;
    card.effects = [shadow(0.10, 4, 4)];
    card.resize(260, cardH);
    card.layoutSizingHorizontal = 'FILL';
    card.layoutSizingVertical = 'FIXED';
    card.clipsContent = true;

    // 16:9 image
    const img = figma.createFrame();
    img.name = 'Image 16:9';
    img.fills = [{ type: 'SOLID', color: c.imgBg }];
    img.resize(260, 146);
    img.layoutSizingHorizontal = 'FILL';
    img.layoutSizingVertical = 'FIXED';
    const imgTx = muted('16 : 9', 11);
    img.appendChild(imgTx);
    card.appendChild(img);

    // Tag (uppercase — matches .search-result-tags)
    const tagWrap = figma.createFrame();
    tagWrap.layoutMode = 'HORIZONTAL';
    tagWrap.paddingLeft = 16;
    tagWrap.paddingRight = 16;
    tagWrap.paddingTop = 10;
    tagWrap.paddingBottom = 4;
    tagWrap.fills = [];
    tagWrap.layoutSizingHorizontal = 'FILL';
    tagWrap.layoutSizingVertical = 'HUG';
    card.appendChild(tagWrap);
    tagWrap.appendChild(tx(data.tag, 11, 'medium', c.muted));

    // Title
    const titleWrap = figma.createFrame();
    titleWrap.layoutMode = 'VERTICAL';
    titleWrap.paddingLeft = 16;
    titleWrap.paddingRight = 16;
    titleWrap.paddingTop = 4;
    titleWrap.paddingBottom = 8;
    titleWrap.fills = [];
    titleWrap.layoutSizingHorizontal = 'FILL';
    titleWrap.layoutSizingVertical = 'HUG';
    card.appendChild(titleWrap);
    const titleTx = tx(data.title, 15, 'semi');
    titleTx.layoutSizingHorizontal = 'FILL';
    titleTx.textAutoResize = 'HEIGHT';
    titleWrap.appendChild(titleTx);

    // Description
    const descWrap = figma.createFrame();
    descWrap.layoutMode = 'VERTICAL';
    descWrap.paddingLeft = 16;
    descWrap.paddingRight = 16;
    descWrap.paddingTop = 0;
    descWrap.paddingBottom = 24;
    descWrap.fills = [];
    descWrap.layoutSizingHorizontal = 'FILL';
    descWrap.layoutSizingVertical = 'HUG';
    card.appendChild(descWrap);
    const descTx = muted(
      'Short article description. Search term highlighted. Up to 3 lines shown, rest clipped.',
      12,
    );
    descTx.opacity = 0.7;
    descTx.layoutSizingHorizontal = 'FILL';
    descTx.textAutoResize = 'HEIGHT';
    descWrap.appendChild(descTx);

    return card;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FRAME 01 — HOME
  // ═══════════════════════════════════════════════════════════════════════════
  const f01 = figma.createFrame();
  f01.name = '01 — Home';
  f01.layoutMode = 'VERTICAL';
  f01.itemSpacing = 0;
  f01.paddingLeft = 0;
  f01.paddingRight = 0;
  f01.paddingTop = 0;
  f01.paddingBottom = 0;
  f01.fills = [{ type: 'SOLID', color: c.pageBg }];
  f01.resize(1440, 900);
  page.appendChild(f01);

  const { searchBox: searchBoxHome } = buildNav(f01, 'Search articles...');

  // Hero
  const hero = figma.createFrame();
  hero.name = 'Hero';
  hero.layoutMode = 'VERTICAL';
  hero.itemSpacing = 12;
  hero.counterAxisAlignItems = 'CENTER';
  hero.paddingLeft = 80;
  hero.paddingRight = 80;
  hero.paddingTop = 64;
  hero.paddingBottom = 64;
  hero.fills = [{ type: 'SOLID', color: c.hero }];
  hero.layoutSizingHorizontal = 'FILL';
  hero.layoutSizingVertical = 'HUG';
  f01.appendChild(hero);

  const heroTitle = tx('Adobe Developer Blog', 40, 'semi', c.white);
  heroTitle.textAlignHorizontal = 'CENTER';
  hero.appendChild(heroTitle);

  const heroSub = tx('Tutorials · APIs · Best practices for Adobe developers', 16, 'regular', c.white);
  heroSub.opacity = 0.7;
  heroSub.textAlignHorizontal = 'CENTER';
  hero.appendChild(heroSub);

  // Featured articles
  const featured = figma.createFrame();
  featured.name = 'Featured articles';
  featured.layoutMode = 'VERTICAL';
  featured.itemSpacing = 16;
  featured.paddingLeft = 32;
  featured.paddingRight = 32;
  featured.paddingTop = 32;
  featured.paddingBottom = 32;
  featured.fills = [];
  featured.layoutSizingHorizontal = 'FILL';
  featured.layoutSizingVertical = 'HUG';
  f01.appendChild(featured);

  featured.appendChild(tx('Latest articles', 18, 'semi'));

  const homeGrid = figma.createFrame();
  homeGrid.name = 'Article grid (home)';
  homeGrid.layoutMode = 'HORIZONTAL';
  homeGrid.itemSpacing = 16;
  homeGrid.layoutWrap = 'WRAP';
  homeGrid.fills = [];
  homeGrid.layoutSizingHorizontal = 'FILL';
  homeGrid.layoutSizingVertical = 'HUG';
  featured.appendChild(homeGrid);

  cardData.forEach((d) => homeGrid.appendChild(buildCard(d, 380)));

  // ═══════════════════════════════════════════════════════════════════════════
  // FRAME 02 — SEARCH RESULTS
  // ═══════════════════════════════════════════════════════════════════════════
  const f02 = figma.createFrame();
  f02.name = '02 — Search results';
  f02.layoutMode = 'VERTICAL';
  f02.itemSpacing = 0;
  f02.paddingLeft = 0;
  f02.paddingRight = 0;
  f02.paddingTop = 0;
  f02.paddingBottom = 0;
  f02.fills = [{ type: 'SOLID', color: c.pageBg }];
  f02.resize(1440, 900);
  f02.x = 1520;
  page.appendChild(f02);

  const { searchBox: searchBoxResults } = buildNav(f02, '"AI"  |');

  // Overlay panel
  const overlay = figma.createFrame();
  overlay.name = 'Search overlay (position: fixed, below nav)';
  overlay.layoutMode = 'VERTICAL';
  overlay.itemSpacing = 16;
  overlay.paddingLeft = 20;
  overlay.paddingRight = 20;
  overlay.paddingTop = 20;
  overlay.paddingBottom = 20;
  overlay.fills = [{ type: 'SOLID', color: c.white }];
  overlay.effects = [shadow(0.15, 8, 24)];
  overlay.resize(1440, 836);
  overlay.layoutSizingHorizontal = 'FILL';
  overlay.layoutSizingVertical = 'FILL';
  f02.appendChild(overlay);

  // Chips row
  const chipsRow = figma.createFrame();
  chipsRow.name = 'Active filter chips';
  chipsRow.layoutMode = 'HORIZONTAL';
  chipsRow.itemSpacing = 8;
  chipsRow.paddingTop = 8;
  chipsRow.paddingBottom = 8;
  chipsRow.paddingLeft = 10;
  chipsRow.paddingRight = 10;
  chipsRow.counterAxisAlignItems = 'CENTER';
  chipsRow.fills = [{ type: 'SOLID', color: { r: 0.97, g: 0.98, b: 1 } }];
  chipsRow.strokes = [{ type: 'SOLID', color: c.line }];
  chipsRow.strokeWeight = 1;
  chipsRow.cornerRadius = 6;
  chipsRow.layoutWrap = 'WRAP';
  chipsRow.layoutSizingHorizontal = 'FILL';
  chipsRow.layoutSizingVertical = 'HUG';
  overlay.appendChild(chipsRow);

  function chip(label) {
    const f = figma.createFrame();
    f.layoutMode = 'HORIZONTAL';
    f.itemSpacing = 6;
    f.paddingLeft = 10;
    f.paddingRight = 10;
    f.paddingTop = 5;
    f.paddingBottom = 5;
    f.cornerRadius = 999;
    f.fills = [{ type: 'SOLID', color: c.chip }];
    f.strokes = [{ type: 'SOLID', color: c.chipBr }];
    f.strokeWeight = 1;
    f.counterAxisAlignItems = 'CENTER';
    f.layoutSizingHorizontal = 'HUG';
    f.layoutSizingVertical = 'HUG';
    f.appendChild(tx(label, 12));
    f.appendChild(tx('×', 13, 'semi'));
    return f;
  }

  chipsRow.appendChild(chip('Product: AEM'));
  chipsRow.appendChild(chip('Category: UXP'));

  const spacer = figma.createFrame();
  spacer.fills = [];
  spacer.layoutSizingHorizontal = 'FILL';
  spacer.resize(10, 1);
  chipsRow.appendChild(spacer);

  const clearBtn = figma.createFrame();
  clearBtn.layoutMode = 'HORIZONTAL';
  clearBtn.paddingLeft = 10;
  clearBtn.paddingRight = 10;
  clearBtn.paddingTop = 5;
  clearBtn.paddingBottom = 5;
  clearBtn.fills = [];
  clearBtn.layoutSizingHorizontal = 'HUG';
  clearBtn.layoutSizingVertical = 'HUG';
  const clearTx = tx('Clear all', 12, 'semi', c.blue);
  clearBtn.appendChild(clearTx);
  chipsRow.appendChild(clearBtn);

  // Main row
  const mainRow = figma.createFrame();
  mainRow.name = 'Sidebar + Results';
  mainRow.layoutMode = 'HORIZONTAL';
  mainRow.itemSpacing = 20;
  mainRow.fills = [];
  mainRow.layoutSizingHorizontal = 'FILL';
  mainRow.layoutSizingVertical = 'FILL';
  overlay.appendChild(mainRow);

  // Sidebar
  const sidebar = figma.createFrame();
  sidebar.name = 'Facet sidebar (hidden on mobile — NF02)';
  sidebar.layoutMode = 'VERTICAL';
  sidebar.itemSpacing = 10;
  sidebar.paddingLeft = 14;
  sidebar.paddingRight = 14;
  sidebar.paddingTop = 14;
  sidebar.paddingBottom = 14;
  sidebar.fills = [{ type: 'SOLID', color: { r: 0.98, g: 0.98, b: 0.99 } }];
  sidebar.strokes = [{ type: 'SOLID', color: c.line }];
  sidebar.strokeWeight = 1;
  sidebar.cornerRadius = 8;
  sidebar.resize(280, 100);
  sidebar.layoutSizingHorizontal = 'FIXED';
  sidebar.layoutSizingVertical = 'FILL';
  mainRow.appendChild(sidebar);

  function sectionTitle(s) {
    const t = tx(s, 12, 'semi');
    t.layoutSizingHorizontal = 'FILL';
    return t;
  }
  function hr() {
    const d = figma.createFrame();
    d.fills = [{ type: 'SOLID', color: c.line }];
    d.resize(252, 1);
    d.layoutSizingHorizontal = 'FILL';
    return d;
  }
  function checkRow(label, count) {
    const row = figma.createFrame();
    row.layoutMode = 'HORIZONTAL';
    row.itemSpacing = 8;
    row.primaryAxisAlignItems = 'SPACE_BETWEEN';
    row.counterAxisAlignItems = 'CENTER';
    row.fills = [];
    row.layoutSizingHorizontal = 'FILL';
    row.layoutSizingVertical = 'HUG';

    const left = figma.createFrame();
    left.layoutMode = 'HORIZONTAL';
    left.itemSpacing = 8;
    left.counterAxisAlignItems = 'CENTER';
    left.fills = [];
    left.layoutSizingHorizontal = 'HUG';

    const box = figma.createFrame();
    box.resize(13, 13);
    box.fills = [{ type: 'SOLID', color: c.white }];
    box.strokes = [{ type: 'SOLID', color: c.line }];
    box.strokeWeight = 1;
    box.cornerRadius = 2;
    left.appendChild(box);
    left.appendChild(tx(label, 12));
    row.appendChild(left);

    const cnt = muted(`(${count})`, 11);
    row.appendChild(cnt);
    return row;
  }

  // Kategorie
  sidebar.appendChild(sectionTitle('Kategorie'));
  sidebar.appendChild(checkRow('UXP', 12));
  sidebar.appendChild(checkRow('Adobe Express Add-ons', 5));
  sidebar.appendChild(checkRow('Firefly Services', 3));
  sidebar.appendChild(hr());

  // Produkt
  sidebar.appendChild(sectionTitle('Produkt'));
  sidebar.appendChild(checkRow('AEM', 18));
  sidebar.appendChild(checkRow('Photoshop', 9));
  sidebar.appendChild(checkRow('Express', 6));
  sidebar.appendChild(hr());

  // Autor
  sidebar.appendChild(sectionTitle('Autor'));
  sidebar.appendChild(checkRow('Jane Doe', 4));
  sidebar.appendChild(checkRow('John Smith', 7));
  sidebar.appendChild(hr());

  // Publikationsdatum
  sidebar.appendChild(sectionTitle('Publikationsdatum'));
  const dateRow = figma.createFrame();
  dateRow.layoutMode = 'HORIZONTAL';
  dateRow.itemSpacing = 6;
  dateRow.layoutWrap = 'WRAP';
  dateRow.fills = [];
  dateRow.layoutSizingHorizontal = 'FILL';
  dateRow.layoutSizingVertical = 'HUG';
  sidebar.appendChild(dateRow);
  ['Last week', 'Last month', 'Last year', 'Any'].forEach((label) => {
    const pill = figma.createFrame();
    pill.layoutMode = 'HORIZONTAL';
    pill.paddingLeft = 8;
    pill.paddingRight = 8;
    pill.paddingTop = 4;
    pill.paddingBottom = 4;
    pill.fills = [{ type: 'SOLID', color: { r: 0.93, g: 0.94, b: 0.96 } }];
    pill.cornerRadius = 6;
    pill.layoutSizingHorizontal = 'HUG';
    pill.appendChild(tx(label, 11));
    dateRow.appendChild(pill);
  });
  sidebar.appendChild(muted('Spec: date range slider or presets'));
  sidebar.appendChild(hr());

  // Artikel-Typ
  sidebar.appendChild(sectionTitle('Artikel-Typ'));
  const tagRow = figma.createFrame();
  tagRow.layoutMode = 'HORIZONTAL';
  tagRow.itemSpacing = 6;
  tagRow.layoutWrap = 'WRAP';
  tagRow.fills = [];
  tagRow.layoutSizingHorizontal = 'FILL';
  tagRow.layoutSizingVertical = 'HUG';
  sidebar.appendChild(tagRow);
  ['Tutorial', 'Case Study', 'Deep Dive'].forEach((label) => {
    const t = figma.createFrame();
    t.layoutMode = 'HORIZONTAL';
    t.paddingLeft = 8;
    t.paddingRight = 8;
    t.paddingTop = 4;
    t.paddingBottom = 4;
    t.fills = [{ type: 'SOLID', color: { r: 0.93, g: 0.94, b: 0.96 } }];
    t.cornerRadius = 4;
    t.layoutSizingHorizontal = 'HUG';
    t.appendChild(tx(label, 11));
    tagRow.appendChild(t);
  });
  sidebar.appendChild(muted('Show more ▾  (when >10 options — F12)'));
  sidebar.appendChild(muted('Articles without Artikel-Typ are ignored (F15)'));

  // Results area
  const resultsArea = figma.createFrame();
  resultsArea.name = 'Results area';
  resultsArea.layoutMode = 'VERTICAL';
  resultsArea.itemSpacing = 12;
  resultsArea.fills = [];
  resultsArea.layoutSizingHorizontal = 'FILL';
  resultsArea.layoutSizingVertical = 'FILL';
  mainRow.appendChild(resultsArea);

  const countRow = figma.createFrame();
  countRow.layoutMode = 'HORIZONTAL';
  countRow.itemSpacing = 10;
  countRow.counterAxisAlignItems = 'CENTER';
  countRow.fills = [];
  countRow.layoutSizingHorizontal = 'FILL';
  countRow.layoutSizingVertical = 'HUG';
  resultsArea.appendChild(countRow);
  countRow.appendChild(tx('42 results  ·  query: "AI"', 13, 'semi'));
  countRow.appendChild(muted('counts update live on filter change (F04, F09)'));

  // 4-col card grid
  const grid = figma.createFrame();
  grid.name = '4-col article card grid';
  grid.layoutMode = 'HORIZONTAL';
  grid.itemSpacing = 16;
  grid.layoutWrap = 'WRAP';
  grid.fills = [];
  grid.layoutSizingHorizontal = 'FILL';
  grid.layoutSizingVertical = 'FILL';
  resultsArea.appendChild(grid);

  cardData.forEach((d) => grid.appendChild(buildCard(d, 494)));

  // Empty state
  const empty = figma.createFrame();
  empty.name = 'Empty state (0 results — F14)';
  empty.layoutMode = 'VERTICAL';
  empty.itemSpacing = 4;
  empty.paddingLeft = 12;
  empty.paddingRight = 12;
  empty.paddingTop = 10;
  empty.paddingBottom = 10;
  empty.fills = [{ type: 'SOLID', color: c.warn }];
  empty.cornerRadius = 6;
  empty.layoutSizingHorizontal = 'FILL';
  empty.layoutSizingVertical = 'HUG';
  resultsArea.appendChild(empty);
  empty.appendChild(tx('"No results match your filters. Try removing some filters."', 12));
  empty.appendChild(muted('Shown only when active filters return 0 articles'));

  // ─── Prototype connections ──────────────────────────────────────────────────
  // Frame 01 search input → Frame 02
  await searchBoxHome.setReactionsAsync([{
    trigger: { type: 'ON_CLICK' },
    actions: [{
      type: 'NODE',
      destinationId: f02.id,
      navigation: 'NAVIGATE',
      transition: { type: 'DISSOLVE', easing: { type: 'EASE_OUT' }, duration: 0.2 },
      resetScrollPosition: true,
    }],
  }]);

  // Frame 02 search input → stays on 02 (already there)
  // Back button → Frame 01
  const backBtn = figma.createFrame();
  backBtn.name = '← Back to home (prototype hotspot)';
  backBtn.layoutMode = 'HORIZONTAL';
  backBtn.paddingLeft = 12;
  backBtn.paddingRight = 12;
  backBtn.paddingTop = 7;
  backBtn.paddingBottom = 7;
  backBtn.fills = [{ type: 'SOLID', color: { r: 0.93, g: 0.94, b: 0.96 } }];
  backBtn.strokes = [{ type: 'SOLID', color: c.chipBr }];
  backBtn.strokeWeight = 1;
  backBtn.cornerRadius = 6;
  backBtn.layoutSizingHorizontal = 'HUG';
  backBtn.layoutSizingVertical = 'HUG';
  backBtn.appendChild(tx('← Back to home', 13, 'semi'));
  overlay.appendChild(backBtn);

  await backBtn.setReactionsAsync([{
    trigger: { type: 'ON_CLICK' },
    actions: [{
      type: 'NODE',
      destinationId: f01.id,
      navigation: 'NAVIGATE',
      transition: { type: 'DISSOLVE', easing: { type: 'EASE_OUT' }, duration: 0.2 },
      resetScrollPosition: true,
    }],
  }]);

  // ─── Zoom to fit ────────────────────────────────────────────────────────────
  figma.viewport.scrollAndZoomIntoView([f01, f02]);

  figma.notify('Wireframe rebuilt — Frame 01 (Home) + Frame 02 (Search overlay). ✓');
  figma.closePlugin();
})();
