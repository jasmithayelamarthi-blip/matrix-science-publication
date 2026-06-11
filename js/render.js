/* Shared article rendering helpers (used by home, articles & subject pages). */
(function () {
  var M = window.MSP;

  function articleRowHTML(a) {
    var s = M.SUBJECTS[a.subject];
    var thumb = a.image
      ? '<img src="' + a.image + '" alt="" loading="lazy">'
      : M.subjectThumb(a.subject, a.id || a.title);
    var href = a.url || ('subject.html?s=' + a.subject + '#' + (a.id || ''));
    return '<li class="article-row">' +
      '<div class="article-body">' +
        '<div class="meta">' +
          '<a class="subject-tag" style="background:' + s.color + '" href="subject.html?s=' + a.subject + '">' +
            '<span class="dot"></span>' + s.name + '</a>' +
          '<span class="article-type">' + (a.type || 'Article') + '</span>' +
          '<span class="article-date">' + M.formatDate(a.date) + '</span>' +
        '</div>' +
        '<h3><a href="' + href + '">' + escapeHtml(a.title) + '</a></h3>' +
        '<p class="summary">' + escapeHtml(a.summary || '') + '</p>' +
        (a.author ? '<p class="byline">' + escapeHtml(a.author) + '</p>' : '') +
      '</div>' +
      '<a class="article-thumb" href="' + href + '" aria-hidden="true" tabindex="-1">' + thumb + '</a>' +
    '</li>';
  }

  function renderList(container, articles, emptyMsg) {
    if (!container) return;
    if (!articles.length) {
      container.innerHTML = '<li class="empty-state">' + (emptyMsg || 'No articles match these filters yet.') + '</li>';
      return;
    }
    container.innerHTML = articles.map(articleRowHTML).join('');
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  M.articleRowHTML = articleRowHTML;
  M.renderList = renderList;
  M.escapeHtml = escapeHtml;
})();
