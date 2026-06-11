/* =========================================================
   Matrix Science Publication — Shared data
   Subjects, placeholder articles, and an inline-SVG thumbnail
   generator (no binary image assets required).
   ========================================================= */

const SUBJECTS = {
  physics:       { key: 'physics',       name: 'Physics',       color: '#1e3a8a', soft: '#dbe3f6', glyph: '⚛' },
  biology:       { key: 'biology',       name: 'Biology',       color: '#047857', soft: '#d6efe4', glyph: '🧬' },
  chemistry:     { key: 'chemistry',     name: 'Chemistry',     color: '#b45309', soft: '#f7e6cf', glyph: '⚗' },
  astrophysics:  { key: 'astrophysics',  name: 'Astrophysics',  color: '#5b21b6', soft: '#e7ddf6', glyph: '✦' },
  biotechnology: { key: 'biotechnology', name: 'Biotechnology', color: '#0d9488', soft: '#d2efec', glyph: '🔬' }
};

const SUBJECT_ORDER = ['physics', 'biology', 'chemistry', 'astrophysics', 'biotechnology'];

const ARTICLE_TYPES = ['Research Article', 'Review', 'Perspective', 'News & Views', 'Editorial', 'Brief Communication'];

/* Placeholder articles spanning all five subjects.
   New articles published through the Netlify CMS (/admin) are merged in at runtime. */
const ARTICLES = [
  { id: 'a01', subject: 'physics', type: 'Research Article', date: '2026-05-28',
    title: 'Tabletop measurement of vacuum birefringence using a high-finesse optical cavity',
    summary: 'A student-built cavity places a new bound on photon–photon scattering in strong magnetic fields.',
    author: 'M. Okafor, L. Tan & R. Mehta' },
  { id: 'a02', subject: 'biology', type: 'Research Article', date: '2026-05-21',
    title: 'Microhabitat temperature buffering by leaf-litter depth in temperate woodland',
    summary: 'Field sensors show even 2 cm of litter halves diurnal temperature swings for ground invertebrates.',
    author: 'S. Iyer & the MSP Field Group' },
  { id: 'a03', subject: 'chemistry', type: 'Review', date: '2026-05-14',
    title: 'Green routes to perovskite precursors: a review for the school laboratory',
    summary: 'We survey low-toxicity syntheses suitable for supervised secondary-school chemistry.',
    author: 'D. Petrova' },
  { id: 'a04', subject: 'astrophysics', type: 'Research Article', date: '2026-05-09',
    title: 'Period–luminosity scatter in archival Cepheid photometry from open data',
    summary: 'Reanalysis of public survey light curves quantifies metallicity-linked scatter in the P–L relation.',
    author: 'J. Yelamarthi & A. Novák' },
  { id: 'a05', subject: 'biotechnology', type: 'Perspective', date: '2026-05-02',
    title: 'Should CRISPR base editors enter the high-school curriculum?',
    summary: 'A perspective on teaching precision gene editing safely and ethically before university.',
    author: 'P. Adeyemi' },
  { id: 'a06', subject: 'physics', type: 'Brief Communication', date: '2026-04-25',
    title: 'A 3D-printed torsion balance reproduces Coulomb’s law to within 4%',
    summary: 'An accessible apparatus recovers the inverse-square electrostatic force with everyday materials.',
    author: 'K. Brandt & V. Rao' },
  { id: 'a07', subject: 'biology', type: 'News & Views', date: '2026-04-18',
    title: 'What declining urban pollinator counts mean for student ecology projects',
    summary: 'New citizen-science data reframe how schools should design pollinator surveys.',
    author: 'Editorial Desk' },
  { id: 'a08', subject: 'chemistry', type: 'Research Article', date: '2026-04-11',
    title: 'Colorimetric nitrate detection in river water using anthocyanin extracts',
    summary: 'Red-cabbage indicators give a low-cost, semi-quantitative field assay for nitrate pollution.',
    author: 'H. Nakamura & L. Costa' },
  { id: 'a09', subject: 'astrophysics', type: 'Review', date: '2026-04-04',
    title: 'Exoplanet transit photometry for amateurs: methods and pitfalls',
    summary: 'A practical review of detrending, timing, and error budgets for small-telescope transit work.',
    author: 'T. Fischer' },
  { id: 'a10', subject: 'biotechnology', type: 'Research Article', date: '2026-03-28',
    title: 'Cellulose-degrading bacteria from compost as a bioplastics feedstock screen',
    summary: 'Isolates were ranked by enzymatic activity to guide a school-scale bioplastic pipeline.',
    author: 'M. Santos, R. Owusu & Y. Chen' },
  { id: 'a11', subject: 'physics', type: 'Editorial', date: '2026-03-20',
    title: 'Reproducibility starts in the classroom',
    summary: 'Why Matrix asks every submission to publish its raw data and analysis code.',
    author: 'J. Yelamarthi, Editor-in-Chief' },
  { id: 'a12', subject: 'biology', type: 'Research Article', date: '2026-03-13',
    title: 'Germination rates of native seeds under simulated drought stress',
    summary: 'Controlled water-potential trials reveal species-specific drought thresholds for restoration.',
    author: 'A. Kowalski & N. Hassan' },
  { id: 'a13', subject: 'chemistry', type: 'Perspective', date: '2026-03-06',
    title: 'Teaching reaction kinetics with smartphone colorimetry',
    summary: 'How free phone sensors turn the iodine clock into a quantitative kinetics experiment.',
    author: 'E. Larsson' },
  { id: 'a14', subject: 'astrophysics', type: 'Research Article', date: '2026-02-27',
    title: 'Estimating the solar rotation period from sunspot tracking over one term',
    summary: 'Daily projected-image observations recover the differential rotation of the photosphere.',
    author: 'C. Mwangi & D. Park' },
  { id: 'a15', subject: 'biotechnology', type: 'Review', date: '2026-02-20',
    title: 'At-home PCR is here: a review of low-cost thermocyclers for education',
    summary: 'We compare open-hardware thermocyclers on price, accuracy, and classroom safety.',
    author: 'F. Bianchi' }
];

/* ---------- Inline-SVG thumbnail generator ---------- */
function subjectThumb(subjectKey, seed) {
  const s = SUBJECTS[subjectKey] || SUBJECTS.physics;
  const n = (typeof seed === 'string')
    ? seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    : (seed || 7);
  const a = (n % 40) + 10, b = (n % 25) + 20, c = (n * 3 % 50) + 30;
  const light = mix(s.color, '#ffffff', 0.35);
  const dark = mix(s.color, '#000000', 0.25);
  return `
  <svg viewBox="0 0 132 96" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" role="img" aria-hidden="true">
    <defs>
      <linearGradient id="g${n}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${light}"/>
        <stop offset="1" stop-color="${dark}"/>
      </linearGradient>
    </defs>
    <rect width="132" height="96" fill="url(#g${n})"/>
    <circle cx="${a + 20}" cy="${b}" r="${18 + (n % 10)}" fill="#ffffff" opacity="0.10"/>
    <circle cx="${c + 30}" cy="${70 - (n % 18)}" r="${10 + (n % 8)}" fill="#000000" opacity="0.10"/>
    <path d="M0 ${70 + (n % 12)} Q33 ${48 + (n % 18)} 66 ${66 - (n % 14)} T132 ${60}" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.30"/>
    <text x="66" y="58" font-family="Georgia, serif" font-size="34" fill="#ffffff" opacity="0.92" text-anchor="middle" dominant-baseline="middle">${s.glyph}</text>
  </svg>`;
}

function mix(hex1, hex2, t) {
  const a = hexToRgb(hex1), b = hexToRgb(hex2);
  const r = Math.round(a.r + (b.r - a.r) * t);
  const g = Math.round(a.g + (b.g - a.g) * t);
  const bl = Math.round(a.b + (b.b - a.b) * t);
  return `rgb(${r},${g},${bl})`;
}
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return { r: parseInt(h.substring(0, 2), 16), g: parseInt(h.substring(2, 4), 16), b: parseInt(h.substring(4, 6), 16) };
}

function formatDate(iso) {
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* Merge any CMS-published articles (content/articles.json) with the built-in set.
   Returns a promise resolving to the combined, date-sorted list. */
async function loadAllArticles() {
  let extra = [];
  try {
    const res = await fetch('content/articles.json', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      // CMS writes { "articles": [...] }; also accept a bare [...] array.
      if (Array.isArray(data)) extra = data;
      else if (data && Array.isArray(data.articles)) extra = data.articles;
    }
  } catch (e) { /* no CMS index yet — fine */ }
  const all = [...extra, ...ARTICLES].filter(a => a && a.title && SUBJECTS[a.subject]);
  all.sort((x, y) => (y.date || '').localeCompare(x.date || ''));
  return all;
}

if (typeof window !== 'undefined') {
  window.MSP = { SUBJECTS, SUBJECT_ORDER, ARTICLE_TYPES, ARTICLES, subjectThumb, formatDate, loadAllArticles };
}
