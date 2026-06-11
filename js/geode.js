/* =========================================================
   Matrix Science Publication — Animated SVG geode
   Click the geode to crack it open; each crystal inside is a
   subject and links to that subject's page.
   ========================================================= */
(function () {
  var stage = document.getElementById('geodeStage');
  if (!stage) return;
  var S = window.MSP.SUBJECTS, ORDER = window.MSP.SUBJECT_ORDER;

  var CX = 230, CY = 205, RX = 162, RY = 150;
  var TOP = CY - RY, BOT = CY + RY;

  // jagged crack midline (top -> bottom)
  var crack = [
    [CX, TOP], [CX - 16, TOP + 36], [CX + 14, TOP + 78], [CX - 12, TOP + 120],
    [CX + 18, TOP + 165], [CX - 14, TOP + 208], [CX + 12, TOP + 250], [CX, BOT]
  ];
  // Both shell halves return along the same jagged crack, traversed bottom -> top.
  var crackUp = crack.slice().reverse().map(function (p) { return p.join(' '); }).join(' L ');

  function crystal(i) {
    var sub = S[ORDER[i]];
    var angle = (-44 + i * 22) * Math.PI / 180;       // fan out from -44° to +44°
    var bx = CX, by = CY + 64;
    var len = 150, hw = 24;
    var dx = Math.sin(angle), dy = -Math.cos(angle);
    var px = Math.cos(angle), py = Math.sin(angle);
    var tip = [bx + dx * len, by + dy * len];
    var sd = len * 0.42;
    var sl = [bx + dx * sd - px * hw, by + dy * sd - py * hw];
    var sr = [bx + dx * sd + px * hw, by + dy * sd + py * hw];
    var pts = [[bx, by], sl, tip, sr].map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    var facet = [[bx, by], tip, sr].map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    var lx = bx + dx * (len + 16), ly = by + dy * (len + 16);

    return '<a class="geode-crystal" data-subject="' + sub.key + '" href="subject.html?s=' + sub.key + '" ' +
             'role="link" tabindex="0" aria-label="' + sub.name + ' — open subject" style="color:' + sub.color + '">' +
             '<polygon points="' + pts + '" fill="' + sub.color + '" stroke="rgba(255,255,255,.45)" stroke-width="1.2"/>' +
             '<polygon points="' + facet + '" fill="rgba(255,255,255,.18)"/>' +
             '<text class="geode-label" x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle">' + sub.name + '</text>' +
           '</a>';
  }

  var crystals = ORDER.map(function (_, i) { return crystal(i); }).join('');

  var svg = '' +
  '<svg class="geode-svg geode" id="geodeSvg" viewBox="0 0 460 410" role="group" aria-label="Interactive geode. Activate to reveal subjects.">' +
    '<defs>' +
      '<radialGradient id="geGlow" cx="50%" cy="46%" r="55%">' +
        '<stop offset="0" stop-color="#fff7cf" stop-opacity=".9"/>' +
        '<stop offset="45%" stop-color="#9fc3ff" stop-opacity=".35"/>' +
        '<stop offset="100%" stop-color="#9fc3ff" stop-opacity="0"/>' +
      '</radialGradient>' +
      '<linearGradient id="rockL" x1="0" y1="0" x2="1" y2="1">' +
        '<stop offset="0" stop-color="#3a3f4d"/><stop offset="1" stop-color="#23262f"/>' +
      '</linearGradient>' +
      '<linearGradient id="rockR" x1="1" y1="0" x2="0" y2="1">' +
        '<stop offset="0" stop-color="#41475a"/><stop offset="1" stop-color="#262a35"/>' +
      '</linearGradient>' +
    '</defs>' +

    // glow behind the cavity
    '<circle class="geode-glow" cx="' + CX + '" cy="' + (CY - 6) + '" r="150" fill="url(#geGlow)"/>' +

    // crystals (revealed when cracked)
    '<g class="crystals">' + crystals + '</g>' +

    // druzy rim hint
    '<circle cx="' + CX + '" cy="' + CY + '" r="118" fill="none" stroke="rgba(255,255,255,.10)" stroke-width="10" stroke-dasharray="2 7" class="geode-glow"/>' +

    // outer shell — two halves
    '<path class="geode-shell shell-left" d="M ' + CX + ' ' + TOP +
      ' A ' + RX + ' ' + RY + ' 0 0 0 ' + CX + ' ' + BOT +
      ' L ' + crackUp + ' Z" fill="url(#rockL)" stroke="#15171d" stroke-width="2"/>' +
    '<path class="geode-shell shell-right" d="M ' + CX + ' ' + TOP +
      ' A ' + RX + ' ' + RY + ' 0 0 1 ' + CX + ' ' + BOT +
      ' L ' + crackUp + ' Z" fill="url(#rockR)" stroke="#15171d" stroke-width="2"/>' +

    // rocky speckles on the shell
    '<g class="geode-shell shell-left" opacity=".5">' +
      '<circle cx="150" cy="150" r="6" fill="#1c1e25"/><circle cx="120" cy="240" r="4" fill="#4b5063"/><circle cx="175" cy="300" r="5" fill="#1c1e25"/>' +
    '</g>' +
    '<g class="geode-shell shell-right" opacity=".5">' +
      '<circle cx="320" cy="140" r="5" fill="#1c1e25"/><circle cx="345" cy="235" r="4" fill="#52576b"/><circle cx="300" cy="305" r="6" fill="#1c1e25"/>' +
    '</g>' +
  '</svg>';

  stage.innerHTML = svg;

  var el = document.getElementById('geodeSvg');
  var hint = document.getElementById('geodeHint');

  function crackOpen() {
    if (el.classList.contains('cracked')) return;
    el.classList.add('cracked');
    if (hint) hint.textContent = 'Tap a crystal to explore that subject';
  }

  // clicking the shell toggles open; clicking a crystal navigates (only once open)
  el.addEventListener('click', function (e) {
    var cry = e.target.closest('.geode-crystal');
    if (!el.classList.contains('cracked')) {
      e.preventDefault();
      crackOpen();
      return;
    }
    if (!cry) { /* clicked shell again — keep open */ }
  });

  // keyboard: Enter/Space on a focused crystal
  el.addEventListener('keydown', function (e) {
    var cry = e.target.closest('.geode-crystal');
    if (!cry) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!el.classList.contains('cracked')) { crackOpen(); }
      else { window.location.href = cry.getAttribute('href'); }
    }
  });

  // crystals shouldn't navigate before the geode is open
  el.querySelectorAll('.geode-crystal').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (!el.classList.contains('cracked')) { e.preventDefault(); crackOpen(); }
    });
  });
})();
