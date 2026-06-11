/* Subject page: reads ?s=<subject>, themes the hero and lists that subject's articles. */
(function () {
  var M = window.MSP;
  var key = new URLSearchParams(location.search).get('s') || 'physics';
  var s = M.SUBJECTS[key] || M.SUBJECTS.physics;

  var DESC = {
    physics: 'From quantum mechanics to classical dynamics — student investigations into the fundamental laws that govern matter, energy, space and time.',
    biology: 'Ecology, genetics, physiology and beyond — research exploring the living world at every scale, from molecules to ecosystems.',
    chemistry: 'Reactions, materials and analysis — work on the composition, structure and transformation of matter, done safely in school laboratories.',
    astrophysics: 'Stars, galaxies and the cosmos — observational and computational studies of the universe using open data and small telescopes.',
    biotechnology: 'Engineering biology for the real world — gene editing, bioprocessing and synthetic biology investigated by the next generation of scientists.'
  };

  document.title = s.name + ' — Matrix Science Publication';
  var hero = document.getElementById('subjectHero');
  if (hero) {
    hero.style.background = 'linear-gradient(135deg,' + s.color + ' 0%, #0a0e1a 120%)';
    document.getElementById('subjectName').textContent = s.name;
    document.getElementById('subjectGlyph').textContent = s.glyph;
    document.getElementById('subjectDesc').textContent = DESC[key] || '';
    document.getElementById('subjectCrumb').textContent = s.name;
  }

  var listEl = document.getElementById('subjectArticles');
  var countEl = document.getElementById('subjectCount');

  M.loadAllArticles().then(function (data) {
    var items = data.filter(function (a) { return a.subject === key; });
    M.renderList(listEl, items, 'No ' + s.name + ' articles yet — check back soon.');
    if (countEl) countEl.textContent = items.length + ' article' + (items.length === 1 ? '' : 's');
  });
})();
