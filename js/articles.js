/* Articles page: Nature-style list with Article Type, Subject & Year filters
   plus optional ?q= search from the header search box. */
(function () {
  var M = window.MSP;
  var listEl = document.getElementById('articleList');
  var typeSel = document.getElementById('fType');
  var subjSel = document.getElementById('fSubject');
  var yearSel = document.getElementById('fYear');
  var countEl = document.getElementById('articleCount');
  var qNote = document.getElementById('searchNote');
  if (!listEl) return;

  var all = [];
  var query = (new URLSearchParams(location.search).get('q') || '').toLowerCase();

  function years() {
    var set = {};
    all.forEach(function (a) { if (a.date) set[a.date.slice(0, 4)] = true; });
    return Object.keys(set).sort().reverse();
  }

  function opt(sel, list, allLabel) {
    sel.innerHTML = '<option value="">' + allLabel + '</option>' +
      list.map(function (o) { return '<option value="' + o.val + '">' + o.label + '</option>'; }).join('');
  }

  function apply() {
    var t = typeSel.value, s = subjSel.value, y = yearSel.value;
    var filtered = all.filter(function (a) {
      if (t && a.type !== t) return false;
      if (s && a.subject !== s) return false;
      if (y && (a.date || '').slice(0, 4) !== y) return false;
      if (query) {
        var hay = (a.title + ' ' + a.summary + ' ' + (a.author || '') + ' ' + M.SUBJECTS[a.subject].name).toLowerCase();
        if (hay.indexOf(query) === -1) return false;
      }
      return true;
    });
    M.renderList(listEl, filtered, query ? 'No articles match “' + M.escapeHtml(query) + '”.' : 'No articles match these filters yet.');
    if (countEl) countEl.textContent = filtered.length + ' result' + (filtered.length === 1 ? '' : 's');
  }

  M.loadAllArticles().then(function (data) {
    all = data;
    opt(typeSel, M.ARTICLE_TYPES.map(function (t) { return { val: t, label: t }; }), 'All article types');
    opt(subjSel, M.SUBJECT_ORDER.map(function (k) { return { val: k, label: M.SUBJECTS[k].name }; }), 'All subjects');
    opt(yearSel, years().map(function (y) { return { val: y, label: y }; }), 'All years');
    [typeSel, subjSel, yearSel].forEach(function (s) { s.addEventListener('change', apply); });
    if (query && qNote) { qNote.style.display = 'block'; qNote.textContent = 'Showing results for “' + query + '”'; }
    apply();
  });
})();
