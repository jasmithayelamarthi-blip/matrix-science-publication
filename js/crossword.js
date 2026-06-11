/* =========================================================
   Science Crossword — NYT-style engine (pure JS).
   PUZZLE.rows is the solution grid ('#' = black square);
   PUZZLE.clues maps "<number><A|D>" -> clue text.
   Numbering + entries are derived from the grid at runtime.
   ========================================================= */
(function () {
  /* __PUZZLE_START__  (grid validated: 11x11, 46 entries, full interlock, all real words) */
  var PUZZLE = {
    rows: [
      "#SAGE##JOB#",
      "#PLAN#TAPE#",
      "RAISE#OMEGA",
      "ERA#RUN#RUG",
      "DESIGN#LANE",
      "###CYCLE###",
      "BASE#LITTLE",
      "ART#SEA#WIN",
      "DRAMA#BLIND",
      "#AGED#LACE#",
      "#YET##EYED#"
    ],
    clues: {
      // ACROSS
      "1A": "Wise advisor — or a grey-green kitchen herb",
      "5A": "Position of employment",
      "8A": "A scientist's step-by-step experimental ___",
      "9A": "Sticky roll used to label beakers",
      "10A": "Increase, as the temperature",
      "11A": "Last Greek letter; the symbol (Ω) for electrical resistance",
      "13A": "Geologic time span, such as the Mesozoic",
      "14A": "A single trial of an experiment",
      "16A": "Floor covering",
      "17A": "Plan a fair test, with controls and variables",
      "19A": "A swimmer's track — or a column of samples in gel electrophoresis",
      "20A": "The water ___, a repeating natural process",
      "22A": "Opposite of an acid on the pH scale",
      "25A": "Not much at all",
      "29A": "Creative subject some contrast with science",
      "30A": "Vast body of salt water",
      "31A": "Finish first",
      "32A": "Theatrical genre",
      "34A": "Type of study in which subjects don't know their group",
      "36A": "Matured over time, like a good cheese",
      "37A": "Delicate openwork fabric",
      "38A": "Nevertheless",
      "39A": "Looked at closely",
      // DOWN
      "1D": "Kept in reserve",
      "2D": "Assumed name",
      "3D": "State of matter that expands to fill its container",
      "4D": "Capacity to do work, measured in joules",
      "5D": "Fruit preserve",
      "6D": "Sung dramatic work",
      "7D": "Already started",
      "9D": "2,000 pounds",
      "10D": "Colour of the longest-wavelength visible light",
      "12D": "Number of years since a fossil formed, e.g.",
      "15D": "A parent's brother",
      "18D": "Frozen water — a solid phase",
      "19D": "Permit",
      "21D": "Legally responsible",
      "22D": "Not good",
      "23D": "Ordered arrangement of data or detectors",
      "24D": "Microscope platform that holds the slide",
      "26D": "Two times",
      "27D": "Ruled, as notebook paper",
      "28D": "Final part",
      "30D": "Feeling blue",
      "33D": "Encountered",
      "35D": "Set down"
    },
    fact: "Omega (Ω) is the symbol for the ohm, the unit of electrical resistance named after Georg Ohm — and it's also the last letter of the Greek alphabet, which is why 'the alpha and the omega' means from the very beginning to the very end."
  };
  /* __PUZZLE_END__ */

  var boardEl = document.getElementById('xwBoard');
  if (!boardEl) return;
  var inputEl = document.getElementById('xwInput');
  var acrossEl = document.getElementById('xwAcross');
  var downEl = document.getElementById('xwDown');
  var msgEl = document.getElementById('xwMessage');
  var clueBarText = document.getElementById('xwClueBarText');
  var timerEl = document.getElementById('xwTimer');

  var N = PUZZLE.rows.length;
  var grid = [];          // grid[r][c] = {block, sol, num, entries:{A,D}, input, el, ltrEl}
  var entries = [];       // {num, dir, cells:[{r,c}], clue, key}
  var entryByKey = {};
  var active = { r: 0, c: 0 };
  var dir = 'A';
  var solved = false;

  /* ---------- model ---------- */
  function build() {
    grid = PUZZLE.rows.map(function (row, r) {
      return row.split('').map(function (ch, c) {
        return { block: ch === '#', sol: ch === '#' ? null : ch, num: 0, entries: {}, input: '', r: r, c: c };
      });
    });
    var num = 0;
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      var cell = grid[r][c];
      if (cell.block) continue;
      var startA = (c === 0 || grid[r][c - 1].block) && c + 1 < N && !grid[r][c + 1].block;
      var startD = (r === 0 || grid[r - 1][c].block) && r + 1 < N && !grid[r + 1][c].block;
      if (startA || startD) { num++; cell.num = num; }
      if (startA) addEntry(num, 'A', r, c);
      if (startD) addEntry(num, 'D', r, c);
    }
  }
  function addEntry(num, d, r, c) {
    var cells = [], rr = r, cc = c;
    while (rr < N && cc < N && !grid[rr][cc].block) {
      cells.push({ r: rr, c: cc });
      grid[rr][cc].entries[d] = num + d;
      if (d === 'A') cc++; else rr++;
    }
    var key = num + d;
    var e = { num: num, dir: d, cells: cells, key: key, clue: (PUZZLE.clues[key] || '') };
    entries.push(e); entryByKey[key] = e;
  }

  /* ---------- render ---------- */
  function render() {
    boardEl.style.gridTemplateColumns = 'repeat(' + N + ', 1fr)';
    boardEl.innerHTML = '';
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      var cell = grid[r][c];
      var div = document.createElement('div');
      div.className = 'xword-cell' + (cell.block ? ' block' : '');
      if (!cell.block) {
        div.setAttribute('role', 'gridcell');
        if (cell.num) { var n = document.createElement('span'); n.className = 'xnum'; n.textContent = cell.num; div.appendChild(n); }
        var l = document.createElement('span'); l.className = 'xltr'; l.textContent = cell.input || ''; div.appendChild(l);
        cell.ltrEl = l;
        (function (rr, cc) {
          div.addEventListener('mousedown', function (e) { e.preventDefault(); onCellClick(rr, cc); });
          div.addEventListener('touchstart', function () { onCellClick(rr, cc); }, { passive: true });
        })(r, c);
      }
      cell.el = div;
      boardEl.appendChild(div);
    }
    renderClues();
  }

  function renderClues() {
    [['A', acrossEl], ['D', downEl]].forEach(function (pair) {
      var d = pair[0], el = pair[1];
      el.innerHTML = '';
      entries.filter(function (e) { return e.dir === d; }).forEach(function (e) {
        var li = document.createElement('li');
        li.dataset.key = e.key;
        li.innerHTML = '<b>' + e.num + '</b><span>' + escapeHtml(e.clue) + '</span>';
        li.addEventListener('click', function () { selectEntry(e.key, true); });
        el.appendChild(li);
      });
    });
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }

  /* ---------- selection / highlight ---------- */
  function currentEntry() {
    var key = grid[active.r][active.c].entries[dir];
    if (!key) { var other = dir === 'A' ? 'D' : 'A'; key = grid[active.r][active.c].entries[other]; if (key) dir = other; }
    return entryByKey[key];
  }
  function onCellClick(r, c) {
    if (grid[r][c].block) return;
    if (active.r === r && active.c === c) {
      var other = dir === 'A' ? 'D' : 'A';
      if (grid[r][c].entries[other]) dir = other;
    } else {
      active = { r: r, c: c };
      if (!grid[r][c].entries[dir]) dir = (dir === 'A' ? 'D' : 'A');
    }
    focusInput(); highlight();
  }
  function highlight() {
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      if (grid[r][c].block) continue;
      grid[r][c].el.classList.remove('hl', 'active');
    }
    var e = currentEntry();
    if (e) e.cells.forEach(function (p) { grid[p.r][p.c].el.classList.add('hl'); });
    grid[active.r][active.c].el.classList.add('active');
    // clue lists
    [acrossEl, downEl].forEach(function (el) {
      Array.prototype.forEach.call(el.children, function (li) { li.classList.toggle('active', e && li.dataset.key === e.key); });
    });
    if (e) {
      var li = (e.dir === 'A' ? acrossEl : downEl).querySelector('[data-key="' + e.key + '"]');
      if (li && li.scrollIntoView) li.scrollIntoView({ block: 'nearest' });
      clueBarText.textContent = e.num + (e.dir === 'A' ? ' Across' : ' Down') + ': ' + e.clue;
    }
  }
  function selectEntry(key, focusEmpty) {
    var e = entryByKey[key]; if (!e) return;
    dir = e.dir;
    var target = e.cells[0];
    if (focusEmpty) { for (var i = 0; i < e.cells.length; i++) { var p = e.cells[i]; if (!grid[p.r][p.c].input) { target = p; break; } } }
    active = { r: target.r, c: target.c };
    focusInput(); highlight();
  }

  /* ---------- movement ---------- */
  function nextWhite(r, c, dr, dc) {
    r += dr; c += dc;
    while (r >= 0 && c >= 0 && r < N && c < N) { if (!grid[r][c].block) return { r: r, c: c }; r += dr; c += dc; }
    return null;
  }
  function moveArrow(dr, dc) {
    dir = dc !== 0 ? 'A' : 'D';
    var nx = nextWhite(active.r, active.c, dr, dc);
    if (nx) active = nx;
    highlight();
  }
  function advance() {
    var e = currentEntry(); if (!e) return;
    var idx = e.cells.findIndex(function (p) { return p.r === active.r && p.c === active.c; });
    if (idx < e.cells.length - 1) { active = { r: e.cells[idx + 1].r, c: e.cells[idx + 1].c }; }
    highlight();
  }
  function gotoEntry(delta) {
    var e = currentEntry();
    var list = entries.slice().sort(function (a, b) { return a.dir === b.dir ? a.num - b.num : (a.dir === 'A' ? -1 : 1); });
    var i = list.findIndex(function (x) { return e && x.key === e.key; });
    i = (i + delta + list.length) % list.length;
    selectEntry(list[i].key, true);
  }

  /* ---------- input ---------- */
  function focusInput() { if (inputEl) { try { inputEl.focus({ preventScroll: true }); } catch (e) { inputEl.focus(); } } }
  function typeLetter(ch) {
    if (solved) return;
    var cell = grid[active.r][active.c];
    if (cell.block) return;
    cell.input = ch.toUpperCase();
    cell.el.classList.remove('wrong', 'revealed');
    cell.ltrEl.textContent = cell.input;
    startTimer();
    advance();
    checkWin();
  }
  function backspace() {
    if (solved) return;
    var cell = grid[active.r][active.c];
    if (cell.input) { cell.input = ''; cell.ltrEl.textContent = ''; cell.el.classList.remove('wrong', 'revealed'); highlight(); return; }
    var e = currentEntry(); if (!e) return;
    var idx = e.cells.findIndex(function (p) { return p.r === active.r && p.c === active.c; });
    if (idx > 0) {
      var p = e.cells[idx - 1]; active = { r: p.r, c: p.c };
      var pc = grid[p.r][p.c]; pc.input = ''; pc.ltrEl.textContent = ''; pc.el.classList.remove('wrong', 'revealed');
      highlight();
    }
  }

  var supportsBeforeInput = 'onbeforeinput' in document.documentElement;
  if (inputEl) {
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp') { e.preventDefault(); moveArrow(-1, 0); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); moveArrow(1, 0); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); moveArrow(0, -1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); moveArrow(0, 1); }
      else if (e.key === 'Tab') { e.preventDefault(); gotoEntry(e.shiftKey ? -1 : 1); }
      else if (e.key === 'Enter') { e.preventDefault(); var o = dir === 'A' ? 'D' : 'A'; if (grid[active.r][active.c].entries[o]) { dir = o; highlight(); } }
      else if (e.key === 'Backspace') { e.preventDefault(); if (!supportsBeforeInput) backspace(); else backspace(); }
      else if (!supportsBeforeInput && /^[a-zA-Z]$/.test(e.key)) { e.preventDefault(); typeLetter(e.key); }
    });
    if (supportsBeforeInput) {
      inputEl.addEventListener('beforeinput', function (e) {
        if (e.inputType === 'insertText' && e.data) {
          var m = e.data.replace(/[^a-zA-Z]/g, '');
          if (m) typeLetter(m[m.length - 1]);
          e.preventDefault();
        } else if (e.inputType === 'insertLineBreak') { e.preventDefault(); }
      });
    }
    inputEl.addEventListener('input', function () { inputEl.value = ''; });
    boardEl.addEventListener('focus', focusInput);
  }

  /* ---------- actions ---------- */
  function check() {
    var anyWrong = false;
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      var cell = grid[r][c]; if (cell.block || !cell.input) continue;
      if (cell.input !== cell.sol) { cell.el.classList.add('wrong'); anyWrong = true; }
      else cell.el.classList.remove('wrong');
    }
    msg(anyWrong ? 'Some letters aren’t right yet — keep going!' : 'Looking good so far!');
  }
  function reveal() {
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      var cell = grid[r][c]; if (cell.block) continue;
      cell.input = cell.sol; cell.ltrEl.textContent = cell.sol;
      cell.el.classList.remove('wrong'); cell.el.classList.add('revealed');
    }
    win(true);
  }
  function clearAll() {
    if (solved) return;
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      var cell = grid[r][c]; if (cell.block) continue;
      cell.input = ''; cell.ltrEl.textContent = ''; cell.el.classList.remove('wrong', 'revealed');
    }
    msg(''); highlight();
  }
  function checkWin() {
    for (var r = 0; r < N; r++) for (var c = 0; c < N; c++) {
      var cell = grid[r][c]; if (cell.block) continue;
      if (cell.input !== cell.sol) return;
    }
    win(false);
  }

  /* ---------- win / timer / message ---------- */
  function msg(t) { msgEl.textContent = t; msgEl.classList.remove('win'); var f = document.getElementById('xwFact'); if (f) f.classList.remove('show'); }
  function win(revealed) {
    solved = true; stopTimer();
    msgEl.classList.add('win');
    msgEl.textContent = revealed ? 'Revealed — here’s the full grid.' : '🎉 Solved in ' + timerEl.textContent + '! Nicely done.';
    var fact = document.getElementById('xwFact');
    if (!fact) {
      fact = document.createElement('div'); fact.className = 'xword-fact'; fact.id = 'xwFact';
      msgEl.parentNode.insertBefore(fact, msgEl.nextSibling);
    }
    fact.innerHTML = '<span class="fl">Did you know?</span><p>' + escapeHtml(PUZZLE.fact) + '</p>';
    fact.classList.add('show');
  }

  var t0 = null, tHandle = null;
  function startTimer() { if (t0 || solved) return; t0 = Date.now(); tHandle = setInterval(tick, 1000); }
  function stopTimer() { if (tHandle) clearInterval(tHandle); }
  function tick() {
    var s = Math.floor((Date.now() - t0) / 1000);
    timerEl.textContent = String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  /* ---------- wire buttons ---------- */
  document.getElementById('xwCheck').addEventListener('click', function () { check(); focusInput(); });
  document.getElementById('xwReveal').addEventListener('click', function () { reveal(); });
  document.getElementById('xwClear').addEventListener('click', function () { clearAll(); focusInput(); });
  document.getElementById('xwPrev').addEventListener('click', function () { gotoEntry(-1); });
  document.getElementById('xwNext').addEventListener('click', function () { gotoEntry(1); });

  /* ---------- init ---------- */
  build(); render();
  // start on the first across entry
  var first = entries.filter(function (e) { return e.dir === 'A'; }).sort(function (a, b) { return a.num - b.num; })[0] || entries[0];
  if (first) { dir = first.dir; active = { r: first.cells[0].r, c: first.cells[0].c }; }
  highlight();
})();
