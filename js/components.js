/* =========================================================
   Matrix Science Publication — Header & Footer components
   Injected on every page so the navigation stays consistent.
   ========================================================= */
(function () {
  var ICON = {
    search: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
    user: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    caret: '<svg class="caret" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M2 4l4 4 4-4"/></svg>',
    bell: '<svg class="bell" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
    ext: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 17L17 7M7 7h10v10"/></svg>'
  };

  function dot(color) { return '<span class="dot" style="background:' + color + '"></span>'; }

  function buildHeader() {
    var S = window.MSP.SUBJECTS;
    return '' +
    '<a class="skip-link" href="#main">Skip to main content</a>' +
    '<header class="site-header">' +
      // utility bar
      '<div class="util-bar"><div class="wrap">' +
        '<button type="button" id="searchToggle" aria-expanded="false">' + ICON.search + ' Search</button>' +
        '<span class="sep"></span>' +
        '<a href="contact.html">' + ICON.user + ' Log in</a>' +
      '</div></div>' +

      // search panel
      '<div class="search-panel" id="searchPanel"><div class="wrap">' +
        '<form class="search-form" role="search" onsubmit="return MSPnav.doSearch(event)">' +
          '<input type="search" id="searchInput" placeholder="Search articles, subjects, authors…" aria-label="Search">' +
          '<button type="submit">Search</button>' +
        '</form>' +
      '</div></div>' +

      // brand row
      '<div class="brand-row"><div class="wrap">' +
        '<a class="brand" href="index.html" aria-label="Matrix Science Publication home">' +
          '<span class="mark">' + logoMark() + '</span>' +
          '<span class="brand-text">' +
            '<span class="brand-name">Matrix Science Publication</span>' +
            '<span class="brand-sub">International High-School Science Journal</span>' +
          '</span>' +
        '</a>' +
        '<button class="nav-toggle" id="navToggle" aria-expanded="false" aria-controls="primaryNav">☰ Menu</button>' +
      '</div></div>' +

      // main nav
      '<nav class="main-nav" aria-label="Primary"><div class="wrap">' +
        '<ul class="nav-list" id="primaryNav">' +
          navItem('Explore content', [
            { head: 'Browse' },
            { label: 'Research articles', href: 'articles.html' },
            { label: 'Videos', href: 'videos.html' },
            { label: 'Physics', href: 'subject.html?s=physics', dot: S.physics.color },
            { label: 'Biology', href: 'subject.html?s=biology', dot: S.biology.color },
            { label: 'Chemistry', href: 'subject.html?s=chemistry', dot: S.chemistry.color },
            { label: 'Astrophysics', href: 'subject.html?s=astrophysics', dot: S.astrophysics.color },
            { label: 'Biotechnology', href: 'subject.html?s=biotechnology', dot: S.biotechnology.color },
            { divider: true },
            { label: 'Current issue', href: 'articles.html#current' },
            { label: 'Browse issues', href: 'articles.html#issues' },
            { label: 'Collections', href: 'articles.html#collections' },
            { label: 'Subjects', href: 'articles.html#subjects' },
            { divider: true },
            { head: 'Follow us' },
            { label: 'Follow us on TikTok', href: 'https://www.tiktok.com/@matrixsciencepub', ext: true },
            { label: 'Follow us on Instagram', href: 'https://www.instagram.com/matrixsciencepub', ext: true },
            { label: 'Follow us on LinkedIn', href: 'https://www.linkedin.com/company/matrix-science-publication', ext: true }
          ]) +
          navItem('About the journal', [
            { label: 'Journal Staff', href: 'team.html' },
            { label: 'About the Editors', href: 'team.html#editors' },
            { label: 'Journal Information', href: 'about.html#information' },
            { label: 'Editorial Values Statement', href: 'about.html#values' },
            { label: 'Editorial Policies', href: 'about.html#policies' },
            { label: 'History of Matrix', href: 'about.html#history' },
            { divider: true },
            { label: 'Contact', href: 'contact.html' }
          ]) +
          '<li class="nav-item"><a class="nav-link" href="wordle.html">Science Wordle</a></li>' +
          '<li class="nav-item"><a class="nav-link" href="crossword.html">Crossword</a></li>' +
        '</ul>' +
      '</div></nav>' +

      // alerts bar
      '<div class="alert-bar"><div class="wrap">' +
        '<a href="contact.html#alerts">' + ICON.bell + ' Sign up for alerts</a>' +
      '</div></div>' +
    '</header>';
  }

  function navItem(label, items) {
    var id = 'dd-' + label.toLowerCase().replace(/[^a-z]+/g, '-');
    var inner = items.map(function (it) {
      if (it.divider) return '<div class="dd-divider"></div>';
      if (it.head) return '<div class="dd-head">' + it.head + '</div>';
      var d = it.dot ? dot(it.dot) : '';
      var ext = it.ext ? '<span class="ext">' + ICON.ext + '</span>' : '';
      var attrs = it.ext ? ' target="_blank" rel="noopener"' : '';
      return '<a href="' + it.href + '"' + attrs + '>' + d + '<span>' + it.label + '</span>' + ext + '</a>';
    }).join('');
    return '<li class="nav-item">' +
      '<button class="nav-trigger" aria-expanded="false" aria-controls="' + id + '">' + label + ' ' + ICON.caret + '</button>' +
      '<div class="dropdown" id="' + id + '">' + inner + '</div>' +
    '</li>';
  }

  function logoMark() {
    // A 2x2 "matrix" of subject-colored squares, nodding to crystals in the geode.
    var S = window.MSP.SUBJECTS;
    return '<svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">' +
      '<rect x="2" y="2" width="42" height="42" rx="8" fill="none"/>' +
      '<rect x="3" y="3" width="16.5" height="16.5" rx="3" fill="' + S.physics.color + '"/>' +
      '<rect x="22.5" y="3" width="16.5" height="16.5" rx="3" fill="' + S.chemistry.color + '"/>' +
      '<rect x="3" y="22.5" width="16.5" height="16.5" rx="3" fill="' + S.biology.color + '"/>' +
      '<rect x="22.5" y="22.5" width="16.5" height="16.5" rx="3" fill="' + S.astrophysics.color + '"/>' +
      '<circle cx="21" cy="21" r="6" fill="' + S.biotechnology.color + '" stroke="#0a0e1a" stroke-width="2.5"/>' +
    '</svg>';
  }

  function buildFooter() {
    var S = window.MSP.SUBJECTS;
    return '<footer class="site-footer">' +
      '<div class="footer-main"><div class="wrap"><div class="footer-grid">' +
        '<div class="footer-brand">' +
          '<div class="brand-name">Matrix Science Publication</div>' +
          '<p>A student-run, peer-reviewed international science journal publishing rigorous research by high-school scientists.</p>' +
          '<div class="social-row">' +
            '<a href="https://www.tiktok.com/@matrixsciencepub" target="_blank" rel="noopener" aria-label="TikTok">TT</a>' +
            '<a href="https://www.instagram.com/matrixsciencepub" target="_blank" rel="noopener" aria-label="Instagram">IG</a>' +
            '<a href="https://www.linkedin.com/company/matrix-science-publication" target="_blank" rel="noopener" aria-label="LinkedIn">in</a>' +
          '</div>' +
        '</div>' +
        '<div class="footer-col"><h4>Explore</h4><ul>' +
          '<li><a href="articles.html">Research articles</a></li>' +
          '<li><a href="subject.html?s=physics">Physics</a></li>' +
          '<li><a href="subject.html?s=biology">Biology</a></li>' +
          '<li><a href="subject.html?s=chemistry">Chemistry</a></li>' +
          '<li><a href="subject.html?s=astrophysics">Astrophysics</a></li>' +
          '<li><a href="subject.html?s=biotechnology">Biotechnology</a></li>' +
        '</ul></div>' +
        '<div class="footer-col"><h4>About</h4><ul>' +
          '<li><a href="about.html">About the journal</a></li>' +
          '<li><a href="team.html">Journal staff</a></li>' +
          '<li><a href="about.html#policies">Editorial policies</a></li>' +
          '<li><a href="about.html#values">Editorial values</a></li>' +
          '<li><a href="contact.html">Contact</a></li>' +
        '</ul></div>' +
        '<div class="footer-col"><h4>Engage</h4><ul>' +
          '<li><a href="videos.html">Videos</a></li>' +
          '<li><a href="wordle.html">Science Wordle</a></li>' +
          '<li><a href="crossword.html">Science Crossword</a></li>' +
          '<li><a href="contact.html#alerts">Sign up for alerts</a></li>' +
          '<li><a href="contact.html#submit">Submit a manuscript</a></li>' +
          '<li><a href="admin/index.html">Editor login (CMS)</a></li>' +
        '</ul></div>' +
      '</div></div></div>' +
      '<div class="footer-bottom"><div class="wrap">' +
        '<p>© 2026 Matrix Science Publication. Published by students, for science.</p>' +
        '<div class="legal">' +
          '<a href="about.html#policies">Privacy</a>' +
          '<a href="about.html#policies">Terms</a>' +
          '<a href="about.html#values">Editorial values</a>' +
        '</div>' +
      '</div></div>' +
    '</footer>';
  }

  /* ---------- Behaviour ---------- */
  function wire() {
    // dropdowns
    var triggers = document.querySelectorAll('.nav-trigger');
    triggers.forEach(function (t) {
      var dd = document.getElementById(t.getAttribute('aria-controls'));
      t.addEventListener('click', function (e) {
        e.stopPropagation();
        var open = dd.classList.contains('open');
        closeAll();
        if (!open) { dd.classList.add('open'); t.setAttribute('aria-expanded', 'true'); }
      });
    });
    document.addEventListener('click', closeAll);

    // search toggle
    var st = document.getElementById('searchToggle');
    var sp = document.getElementById('searchPanel');
    if (st) st.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = sp.classList.toggle('open');
      st.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) { var i = document.getElementById('searchInput'); if (i) i.focus(); }
    });

    // mobile nav toggle
    var nt = document.getElementById('navToggle');
    var nl = document.getElementById('primaryNav');
    if (nt) nt.addEventListener('click', function () {
      var open = nl.classList.toggle('open');
      nt.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
  }

  function closeAll() {
    document.querySelectorAll('.dropdown.open').forEach(function (d) { d.classList.remove('open'); });
    document.querySelectorAll('.nav-trigger[aria-expanded="true"]').forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
  }

  window.MSPnav = {
    doSearch: function (e) {
      e.preventDefault();
      var q = (document.getElementById('searchInput') || {}).value || '';
      window.location.href = 'articles.html?q=' + encodeURIComponent(q.trim());
      return false;
    }
  };

  function init() {
    var h = document.getElementById('site-header');
    var f = document.getElementById('site-footer');
    if (h) h.innerHTML = buildHeader();
    if (f) f.innerHTML = buildFooter();
    wire();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
