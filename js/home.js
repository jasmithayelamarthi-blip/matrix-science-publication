/* Homepage: subject strip + latest-articles list with Type & Subject filters. */
(function () {
  var M = window.MSP;
  var listEl = document.getElementById('homeArticles');
  var typeSel = document.getElementById('homeType');
  var subjSel = document.getElementById('homeSubject');
  var countEl = document.getElementById('homeCount');
  var stripEl = document.getElementById('subjectStrip');
  if (!listEl) return;

  var all = [];

  function populate(sel, values, allLabel) {
    if (!sel) return;
    sel.innerHTML = '<option value="">' + allLabel + '</option>' +
      values.map(function (v) { return '<option value="' + v.val + '">' + v.label + '</option>'; }).join('');
  }

  function apply() {
    var t = typeSel ? typeSel.value : '';
    var s = subjSel ? subjSel.value : '';
    var filtered = all.filter(function (a) {
      return (!t || a.type === t) && (!s || a.subject === s);
    }).slice(0, 10);
    M.renderList(listEl, filtered);
    if (countEl) countEl.textContent = filtered.length + ' article' + (filtered.length === 1 ? '' : 's');
  }

  function buildStrip() {
    if (!stripEl) return;
    stripEl.innerHTML = M.SUBJECT_ORDER.map(function (k) {
      var s = M.SUBJECTS[k];
      var n = all.filter(function (a) { return a.subject === k; }).length;
      return '<a class="subject-card" href="subject.html?s=' + k + '" style="background:' + s.color + '">' +
        '<span class="sc-icon" style="font-size:22px">' + s.glyph + '</span>' +
        '<span class="sc-name">' + s.name + '</span>' +
        '<span class="sc-count">' + n + ' article' + (n === 1 ? '' : 's') + '</span>' +
      '</a>';
    }).join('');
  }

  M.loadAllArticles().then(function (data) {
    all = data;
    populate(typeSel, M.ARTICLE_TYPES.map(function (t) { return { val: t, label: t }; }), 'All article types');
    populate(subjSel, M.SUBJECT_ORDER.map(function (k) { return { val: k, label: M.SUBJECTS[k].name }; }), 'All subjects');
    if (typeSel) typeSel.addEventListener('change', apply);
    if (subjSel) subjSel.addEventListener('change', apply);
    buildStrip();
    apply();
  });
})();
