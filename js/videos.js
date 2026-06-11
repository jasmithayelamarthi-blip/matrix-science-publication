/* Videos hub — Nature-style video cards with subject filter tags. */
(function () {
  var M = window.MSP;
  var grid = document.getElementById('videoGrid');
  var filtersEl = document.getElementById('videoFilters');
  if (!grid) return;

  var active = 'all';

  var PLAY = '<svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="rgba(255,255,255,.92)"/><path d="M9.5 7.5v9l7-4.5z" fill="#0a0e1a"/></svg>';

  function buildFilters() {
    var tags = [{ key: 'all', name: 'All videos', color: '#0a0e1a' }]
      .concat(M.SUBJECT_ORDER.map(function (k) { return { key: k, name: M.SUBJECTS[k].name, color: M.SUBJECTS[k].color }; }));
    filtersEl.innerHTML = tags.map(function (t) {
      return '<button class="video-tag' + (t.key === active ? ' active' : '') + '" role="tab" ' +
        'data-key="' + t.key + '" style="--tag:' + t.color + '" aria-selected="' + (t.key === active) + '">' +
        (t.key !== 'all' ? '<span class="tdot" style="background:' + t.color + '"></span>' : '') + t.name + '</button>';
    }).join('');
    filtersEl.querySelectorAll('.video-tag').forEach(function (b) {
      b.addEventListener('click', function () { active = b.getAttribute('data-key'); buildFilters(); render(); });
    });
  }

  function render() {
    var items = M.VIDEOS.filter(function (v) { return active === 'all' || v.subject === active; })
      .sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
    if (!items.length) { grid.innerHTML = '<p class="empty-state">No videos in this subject yet.</p>'; return; }
    grid.innerHTML = items.map(function (v) {
      var s = M.SUBJECTS[v.subject];
      return '<article class="video-card">' +
        '<a class="video-thumb" href="videos.html" aria-label="Play: ' + M.escapeHtml(v.title) + '">' +
          M.subjectThumb(v.subject, v.id) +
          '<span class="video-play">' + PLAY + '</span>' +
          '<span class="video-duration">' + v.duration + '</span>' +
        '</a>' +
        '<div class="video-body">' +
          '<a class="subject-tag" style="background:' + s.color + '" href="subject.html?s=' + v.subject + '"><span class="dot"></span>' + s.name + '</a>' +
          '<h3><a href="videos.html">' + M.escapeHtml(v.title) + '</a></h3>' +
          '<p class="video-meta">' + M.escapeHtml(v.speaker) + ' · ' + M.formatDate(v.date) + '</p>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  buildFilters();
  render();
})();
