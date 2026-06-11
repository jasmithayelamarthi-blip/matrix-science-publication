/* =========================================================
   Science Wordle — 5-letter science words with fun facts.
   Green = right letter & spot · Yellow = right letter, wrong spot ·
   Gray = not in word (and these keys fade away from the keyboard).
   ========================================================= */
(function () {
  var WORDS = [
    { w: 'ATOMS', f: 'Atoms are about 99.9999999% empty space — the dense nucleus is minuscule next to the electron cloud.' },
    { w: 'QUARK', f: 'Quarks are never found alone; they are permanently confined inside particles like protons and neutrons.' },
    { w: 'LASER', f: '"LASER" is an acronym: Light Amplification by Stimulated Emission of Radiation.' },
    { w: 'PHASE', f: 'Water has more than a dozen known solid (ice) phases that appear at different pressures.' },
    { w: 'FORCE', f: 'One newton of force is roughly the weight of a medium apple here on Earth.' },
    { w: 'LIGHT', f: 'Sunlight takes about 8 minutes and 20 seconds to travel from the Sun to Earth.' },
    { w: 'SOLAR', f: 'The Sun holds about 99.86% of all the mass in the entire Solar System.' },
    { w: 'LUNAR', f: 'The Moon is drifting away from Earth at roughly 3.8 centimetres every year.' },
    { w: 'COMET', f: "A comet's tail always points away from the Sun, blown back by the solar wind." },
    { w: 'GENES', f: 'Humans share around 60% of their genes with a banana.' },
    { w: 'CELLS', f: 'Your body builds roughly 330 billion new cells every single day.' },
    { w: 'VIRUS', f: 'Viruses are not classed as alive — they cannot reproduce without hijacking a host cell.' },
    { w: 'SPORE', f: 'Some bacterial spores can survive thousands of years and even the vacuum of space.' },
    { w: 'NERVE', f: 'Nerve impulses can race along at speeds of over 100 metres per second.' },
    { w: 'BONES', f: 'Gram for gram, bone resists compression better than steel.' },
    { w: 'ACIDS', f: 'Stomach acid has a pH around 1.5 — strong enough to dissolve metal.' },
    { w: 'METAL', f: 'Mercury is the only metal that is liquid at ordinary room temperature.' },
    { w: 'XENON', f: 'Despite being a "noble" gas, xenon can form compounds such as xenon hexafluoride.' },
    { w: 'OZONE', f: "The ozone layer shields life by absorbing most of the Sun's harmful ultraviolet light." },
    { w: 'MAGMA', f: 'Molten rock is called magma underground and only becomes lava once it erupts.' },
    { w: 'ORBIT', f: 'The International Space Station completes an orbit of Earth about every 90 minutes.' },
    { w: 'IONIC', f: 'Table salt is held together by ionic bonds between sodium and chloride ions.' },
    { w: 'BORON', f: 'Boron is not forged in stars — it is made by cosmic rays shattering heavier atoms.' },
    { w: 'RADON', f: 'Radon, a radioactive gas, is the second-leading cause of lung cancer.' },
    { w: 'ARGON', f: 'Argon makes up nearly 1% of the air you breathe yet almost never reacts.' },
    { w: 'PRION', f: 'Prions are misfolded proteins that cause disease with no DNA or RNA of their own.' },
    { w: 'ALGAE', f: 'Ocean algae produce more than half of all the oxygen in our atmosphere.' },
    { w: 'FUNGI', f: 'The largest known organism is a fungus in Oregon spanning about 9 square kilometres.' },
    { w: 'AMINO', f: 'Just 20 amino acids are enough to build essentially every protein in your body.' },
    { w: 'HELIX', f: "DNA's double helix completes a full twist roughly every 10 base pairs." },
    { w: 'LIPID', f: 'Cell membranes are built from a double layer of lipid molecules.' },
    { w: 'PRISM', f: 'A prism splits white light into a rainbow because each colour bends by a different amount.' },
    { w: 'SOUND', f: 'Sound travels about four times faster through water than through air.' },
    { w: 'STEAM', f: 'Steam stores far more energy than boiling water at the very same temperature.' },
    { w: 'VAPOR', f: 'Water vapour is actually the most abundant greenhouse gas in the atmosphere.' },
    { w: 'REDOX', f: 'Rusting is a slow redox reaction in which iron loses electrons to oxygen.' },
    { w: 'MOLAR', f: "One mole contains Avogadro's number — about 6.022 × 10²³ particles." },
    { w: 'JOULE', f: 'One joule is roughly the energy needed to lift an apple one metre against gravity.' },
    { w: 'PLUTO', f: 'Pluto is so distant that a single Plutonian year lasts 248 Earth years.' },
    { w: 'VENUS', f: 'Venus rotates so slowly that its day is longer than its entire year.' },
    { w: 'EARTH', f: 'Earth is the only planet not named after a Greek or Roman deity.' },
    { w: 'NOVAE', f: 'A nova is a sudden flare-up of a star, often a white dwarf in a binary system.' },
    { w: 'GLUON', f: 'Gluons are the particles that "glue" quarks together inside protons and neutrons.' },
    { w: 'MESON', f: 'A meson is a particle built from one quark bound to one antiquark.' },
    { w: 'TIDES', f: "Ocean tides are driven mainly by the Moon's gravitational pull on the seas." },
    { w: 'CRUST', f: "Earth's crust is proportionally as thin as the skin on an apple." },
    { w: 'AORTA', f: "The aorta is the body's largest artery — about as wide as a garden hose." },
    { w: 'SPINE', f: 'A baby is born with 33 vertebrae; several fuse, leaving adults with 26.' },
    { w: 'FLAME', f: "The hottest part of a candle flame is the faint blue region near its base." },
    { w: 'OPTIC', f: 'Each optic nerve carries well over a million nerve fibres from the eye.' }
  ];

  var ROWS = 6, COLS = 5;
  var board = document.getElementById('wordleBoard');
  var keyboardEl = document.getElementById('keyboard');
  var msgEl = document.getElementById('wordleMessage');
  var factEl = document.getElementById('factCard');
  if (!board) return;

  var target, current, row, finished, keyState;

  var KB = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
  ];

  function pick() { return WORDS[Math.floor(Math.random() * WORDS.length)]; }

  function newGame() {
    var t = pick();
    target = t.w; window._mspFact = t.f;
    current = ''; row = 0; finished = false; keyState = {};
    buildBoard(); buildKeyboard();
    msgEl.textContent = 'Guess the 5-letter science word.';
    factEl.classList.remove('show'); factEl.innerHTML = '';
  }

  function buildBoard() {
    board.innerHTML = '';
    for (var r = 0; r < ROWS; r++) {
      var rowEl = document.createElement('div');
      rowEl.className = 'wordle-row';
      for (var c = 0; c < COLS; c++) {
        var t = document.createElement('div');
        t.className = 'wordle-tile';
        t.id = 'tile-' + r + '-' + c;
        rowEl.appendChild(t);
      }
      board.appendChild(rowEl);
    }
  }

  function buildKeyboard() {
    keyboardEl.innerHTML = '';
    KB.forEach(function (kr) {
      var rowEl = document.createElement('div');
      rowEl.className = 'keyboard-row';
      kr.forEach(function (k) {
        var b = document.createElement('button');
        b.className = 'key' + (k.length > 1 ? ' wide' : '');
        b.textContent = k === 'DEL' ? '⌫' : k;
        b.setAttribute('data-key', k);
        b.addEventListener('click', function () { handle(k); });
        rowEl.appendChild(b);
      });
      keyboardEl.appendChild(rowEl);
    });
  }

  function flash(text) {
    msgEl.textContent = text;
  }

  function shakeRow() {
    for (var c = 0; c < COLS; c++) {
      var t = document.getElementById('tile-' + row + '-' + c);
      t.classList.add('shake');
      (function (tile) { setTimeout(function () { tile.classList.remove('shake'); }, 450); })(t);
    }
  }

  function draw() {
    for (var c = 0; c < COLS; c++) {
      var t = document.getElementById('tile-' + row + '-' + c);
      var ch = current[c] || '';
      t.textContent = ch;
      t.classList.toggle('filled', !!ch);
    }
  }

  function score(guess) {
    var res = new Array(COLS).fill('absent');
    var counts = {};
    for (var i = 0; i < COLS; i++) counts[target[i]] = (counts[target[i]] || 0) + 1;
    for (var i = 0; i < COLS; i++) {
      if (guess[i] === target[i]) { res[i] = 'correct'; counts[guess[i]]--; }
    }
    for (var i = 0; i < COLS; i++) {
      if (res[i] === 'correct') continue;
      if (counts[guess[i]] > 0) { res[i] = 'present'; counts[guess[i]]--; }
    }
    return res;
  }

  function rank(s) { return s === 'correct' ? 3 : s === 'present' ? 2 : 1; }

  function submit() {
    if (current.length < COLS) { flash('Not enough letters'); shakeRow(); return; }
    if (!/^[A-Z]{5}$/.test(current)) { flash('Letters only'); shakeRow(); return; }
    var guess = current;
    var res = score(guess);

    for (var c = 0; c < COLS; c++) {
      (function (c) {
        var t = document.getElementById('tile-' + row + '-' + c);
        setTimeout(function () {
          t.classList.add('flip');
          setTimeout(function () { t.classList.add(res[c]); }, 250);
        }, c * 220);
      })(c);
    }

    // update keyboard after the tiles finish flipping
    setTimeout(function () {
      for (var c = 0; c < COLS; c++) {
        var ch = guess[c], s = res[c];
        if (!keyState[ch] || rank(s) > rank(keyState[ch])) {
          keyState[ch] = s;
          var keyBtn = keyboardEl.querySelector('[data-key="' + ch + '"]');
          if (keyBtn) {
            keyBtn.classList.remove('correct', 'present', 'absent');
            keyBtn.classList.add(s); // 'absent' triggers the fade-and-collapse in CSS
          }
        }
      }
    }, COLS * 220 + 280);

    if (guess === target) {
      finished = true;
      setTimeout(function () { flash('Brilliant! 🎉'); reveal(true); }, COLS * 220 + 320);
      return;
    }
    row++; current = '';
    if (row >= ROWS) {
      finished = true;
      setTimeout(function () { flash('Out of guesses'); reveal(false); }, COLS * 220 + 320);
    }
  }

  function reveal(won) {
    factEl.innerHTML =
      '<div class="fact-label">' + (won ? 'You solved it · Did you know?' : 'The word was ' + target + ' · Did you know?') + '</div>' +
      '<div class="fact-word">' + target + '</div>' +
      '<p>' + window._mspFact + '</p>' +
      '<button class="btn" id="playAgain">Play again ↻</button>';
    factEl.classList.add('show');
    document.getElementById('playAgain').addEventListener('click', newGame);
    factEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function handle(k) {
    if (finished) return;
    if (k === 'ENTER') { submit(); return; }
    if (k === 'DEL') { current = current.slice(0, -1); draw(); return; }
    if (/^[A-Z]$/.test(k) && current.length < COLS) { current += k; draw(); }
  }

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (k === 'Enter') handle('ENTER');
    else if (k === 'Backspace') handle('DEL');
    else if (/^[a-zA-Z]$/.test(k)) handle(k.toUpperCase());
  });

  newGame();
})();
