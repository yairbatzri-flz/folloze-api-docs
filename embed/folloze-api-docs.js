(function () {
  const ROOT = document.querySelector('.flz-docs');
  if (!ROOT) { console.warn('[folloze-api-docs] .flz-docs root not found'); return; }

  // ---- Original document-level queries rewritten to ROOT ----
  // (We keep `document.addEventListener`, `document.body`, `window.*` references untouched.)

  // Provide a global switchTab so the inline onclick handlers work.
  window.switchTab = function (btn, contentId) {
    const tabs = btn.parentElement;
    tabs.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const container = tabs.parentElement;
    container.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    ROOT.querySelector('#' + CSS.escape(contentId)).classList.add('active');
  };

  // Highlight active section in sidebar as the host page scrolls.
  // Embed mode: body flows naturally, host page handles scrolling, sidebar is sticky.
  const links = ROOT.querySelectorAll('.sidebar a[href^="#"]');
  const sections = Array.from(links).map(a => ROOT.querySelector('#' + CSS.escape(a.getAttribute('href').slice(1)))).filter(Boolean);
  function onScroll() {
    const y = window.scrollY + 120;
    let active = sections[0];
    for (const s of sections) {
      const top = s.getBoundingClientRect().top + window.scrollY;
      if (top <= y) active = s;
    }
    links.forEach(a => a.classList.toggle('active', active && a.getAttribute('href') === '#' + active.id));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Term-help popovers
  const TERMS = {
    "board":          { name: "Board",            desc: "A published web page in Folloze that buyers visit. Made up of a header, body sections, and a footer; has a unique board_url.", help: "https://help.folloze.com/s/topic/0TOQj0000000JyjOAE/creating-folloze-boards" },
    "template-board": { name: "Template board",   desc: "A board marked as a template inside Folloze. Templates are the starting point — fill in account-specific copy and the API stamps out a new board from it.", help: "https://help.folloze.com/s/article/Tips-to-Build-a-Better-Board" },
    "section":        { name: "Section",          desc: "A horizontal block of a board (e.g. a banner, content carousel, value-prop columns, contact form). The body of a board is an ordered list of sections.", help: "https://help.folloze.com/s/article/Working-with-Board-Sections" },
    "ribbon":         { name: "Ribbon (API term)",desc: "Optional background or decorative layer behind a section — gradient, image, etc. Usually pass through unchanged from /describe." },
    "header":         { name: "Header",           desc: "The bar at the top of a board: logo(s), navigation links, optional CTA, and tagline. Folloze ships several pre-designed header types.", help: "https://help.folloze.com/s/article/Designing-a-Header-bx3" },
    "footer":         { name: "Footer",           desc: "The bottom area of a board (links, legal, social). Footers are reusable across boards; reference one by id when creating a board.", help: "https://help.folloze.com/s/article/Setting-Up-a-Board-s-Header-Footer" },
    "content-item":   { name: "Content item",     desc: "A single asset in your Folloze organization. Two types: links (URLs) and files (PDFs, slides, videos, images). Lives independently of any board.", help: "https://help.folloze.com/hc/en-us/articles/360044307633-Adding-an-Item-to-the-Content-Center" },
    "content-center": { name: "Content Center",   desc: "The place inside Folloze where all of your organization's content assets are hosted — the central library every board pulls from. Same library the API exposes via GET /v1/items.", help: "https://help.folloze.com/hc/en-us/articles/360044307413-Content-Center-Overview" },
    "board-item":     { name: "Board item",       desc: "A content item placed on a specific board. You can override title, description, thumbnail, tags, and schedule per board — without changing the underlying item.", help: "https://help.folloze.com/s/article/Adding-a-Content-Center-Item-to-a-Board" },
    "category":       { name: "Category",         desc: "A grouping bucket for board items on a section (e.g. 'Product Updates', 'Customer Stories'). Defined per board.", help: "https://help.folloze.com/s/article/Creating-Categories-of-Content-Items" },
    "subcategory":    { name: "Subcategory",      desc: "A category nested under a parent category. Same name/id rules apply.", help: "https://help.folloze.com/s/article/Creating-Categories-of-Content-Items" },
    "tag":            { name: "Tag",              desc: "A free-form label applied to a content item. Used for search/filter via GET /v1/items?tags[]=… — new tags are created on demand.", help: "https://help.folloze.com/s/article/Editing-a-Board" }
  };

  const popover = document.createElement('div');
  popover.className = 'term-popover';
  popover.setAttribute('role', 'dialog');
  document.body.appendChild(popover);

  let activeBtn = null;
  function closePopover() {
    if (activeBtn) activeBtn.setAttribute('aria-expanded', 'false');
    popover.classList.remove('open');
    activeBtn = null;
  }
  function openPopover(btn) {
    const term = TERMS[btn.dataset.term];
    if (!term) return;
    const links = [];
    if (term.help) links.push('<a href="' + term.help + '" target="_blank" rel="noopener">Open Help Center →</a>');
    links.push('<a href="#glossary">See full glossary →</a>');
    popover.innerHTML =
      '<div class="term-name">' + term.name + '</div>' +
      '<div class="term-desc">' + term.desc + '</div>' +
      '<div class="term-links">' + links.join('') + '</div>';
    popover.classList.add('open');
    const r = btn.getBoundingClientRect();
    const top = r.bottom + window.scrollY + 8;
    const popW = 320;
    let left = r.left + window.scrollX;
    if (left + popW > window.innerWidth - 16) left = window.innerWidth - popW - 16;
    if (left < 16) left = 16;
    popover.style.top = top + 'px';
    popover.style.left = left + 'px';
    btn.setAttribute('aria-expanded', 'true');
    activeBtn = btn;
  }

  ROOT.addEventListener('click', (e) => {
    const btn = e.target.closest('.term-help');
    if (btn) {
      e.preventDefault();
      if (activeBtn === btn) { closePopover(); return; }
      closePopover();
      openPopover(btn);
    }
  });
  document.addEventListener('click', (e) => {
    if (activeBtn && !popover.contains(e.target) && !ROOT.contains(e.target)) closePopover();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePopover(); });
  window.addEventListener('scroll', () => { if (activeBtn) closePopover(); }, { passive: true });
})();
