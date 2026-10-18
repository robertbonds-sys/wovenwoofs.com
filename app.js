/* Woven Woofs drops, newest first.
   `date` is the reveal date (YYYY-MM-DD, Eastern): the drop stays
   hidden until midnight ET of that day, then appears on its own.
   To stage a future drop: copy an entry, bump the number, point image
   at images/drop-NNN.jpg, set the date. No code changes needed.
   Hero, ticker, vault cards, and countdown all read the visible list. */

const DROPS = [
  {
    n: 4,
    title: "The Lobster Dachshund",
    line: "A dachshund in a lobster costume.",
    image: "images/drop-004.jpg",
    date: "2026-10-18"
  },
  {
    n: 3,
    title: "The Bumblepug",
    line: "A pug in black-and-yellow bumblebee stripes.",
    image: "images/drop-003.jpg",
    date: "2026-10-16"
  },
  {
    n: 2,
    title: "The Corgi Cadet",
    line: "A corgi in an astronaut suit, looking up.",
    image: "images/drop-002.jpg",
    date: "2026-10-15"
  },
  {
    n: 1,
    title: "The Puggle Lion",
    line: "First drop: a puggle in a stitched lion mane.",
    image: "images/drop-001.jpg",
    date: "2026-10-14"
  }
];

const pad = n => String(n).padStart(3, "0");

/* --- Drop scheduling: drops auto-reveal at midnight America/New_York ---
   A drop renders only once its reveal date has arrived in ET. Staged
   future drops sit in this file, invisible, until their day comes. */
function etTodayISO() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit"
  }).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t).value;
  return `${get("year")}-${get("month")}-${get("day")}`;
}
const revealed = DROPS.filter(d => d.date <= etTodayISO());
/* Never render an empty page: if every entry is staged for the future,
   fall back to the earliest drop (a config slip, but the site stays up). */
const live = revealed.length ? revealed : [DROPS[DROPS.length - 1]];
const fmtDate = iso =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", timeZone: "UTC"
  });

/* --- Collection: per device, no accounts ---
   Collect buttons are label-driven on purpose. To sell later,
   swap the label to "Buy" and point at checkout — no redesign. */
const STORE_KEY = "wovenwoofs.collection.v1";

function loadCollected() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORE_KEY) || "[]"));
  } catch (err) {
    return new Set();
  }
}
function saveCollected(set) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify([...set]));
  } catch (err) { /* private mode etc.: collecting just won't persist */ }
}
let collected = loadCollected();

/* --- Hero = today's drop (newest revealed) --- */
const latest = live[0];
document.getElementById("hero-kicker").textContent = `Drop Nº ${pad(latest.n)} · fresh today`;
document.getElementById("hero-title").textContent = latest.title;
const heroVideo = document.getElementById("hero-video");
heroVideo.poster = latest.image;
document.getElementById("hero-video-src").src = `images/hero-${pad(latest.n)}.mp4`;
heroVideo.load(); // missing file? the poster still shows — slot preserved

/* --- Ticker (content duplicated for a seamless loop) --- */
const seq = live.map(d => `Fresh drop daily <i>✿</i> Nº ${pad(d.n)} · ${d.title}`).join(" ") + " ";
document.getElementById("ticker-track").innerHTML = `<span>${seq}</span><span>${seq}</span>`;

/* --- Vault: collector cards, newest first --- */
const grid = document.getElementById("drop-grid");

live.forEach((drop, i) => {
  const card = document.createElement("article");
  card.className = "drop-card reveal";
  const badge = i === 0
    ? `<span class="badge badge-new">New</span>`
    : `<span class="badge badge-vault">In the vault</span>`;
  card.innerHTML = `
    <div class="card-media">
      <img src="${drop.image}" alt="Patch Drop Nº ${pad(drop.n)} — ${drop.title}: ${drop.line}" loading="lazy">
      ${badge}
    </div>
    <div class="drop-card-body">
      <p class="drop-num"><span class="stitch-tag">Nº ${pad(drop.n)}</span><time datetime="${drop.date}">${fmtDate(drop.date)}</time></p>
      <h3>${drop.title}</h3>
      <p class="drop-line">${drop.line}</p>
      <button class="collect-btn" type="button" data-n="${drop.n}" aria-pressed="false"></button>
    </div>`;
  grid.appendChild(card);
});

function refreshCollectUI() {
  document.querySelectorAll(".collect-btn").forEach(btn => {
    const n = Number(btn.dataset.n);
    const has = collected.has(n);
    btn.classList.toggle("is-collected", has);
    btn.textContent = has ? "✓ Collected" : `Collect Nº ${pad(n)}`;
    btn.setAttribute("aria-pressed", String(has));
  });
  const heroBtn = document.getElementById("hero-collect");
  const hasLatest = collected.has(latest.n);
  heroBtn.classList.toggle("is-collected", hasLatest);
  heroBtn.textContent = hasLatest ? "✓ In your collection" : `Collect Nº ${pad(latest.n)}`;
  heroBtn.setAttribute("aria-pressed", String(hasLatest));

  const done = live.filter(d => collected.has(d.n)).length;
  const total = live.length;
  document.getElementById("collection-progress").textContent =
    (done === total && total > 0)
      ? `Your collection: ${done} of ${total} — complete set`
      : `Your collection: ${done} of ${total}`;
}

function toggleCollect(n) {
  if (collected.has(n)) collected.delete(n);
  else collected.add(n);
  saveCollected(collected);
  refreshCollectUI();
}

document.addEventListener("click", e => {
  const btn = e.target.closest(".collect-btn");
  if (btn) toggleCollect(Number(btn.dataset.n));
});
document.getElementById("hero-collect").addEventListener("click", () => toggleCollect(latest.n));
refreshCollectUI();

/* --- Countdown to the next drop: next midnight America/New_York. Real, honest. --- */
function msToNextMidnightET() {
  const etNow = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
  const next = new Date(etNow);
  next.setHours(24, 0, 0, 0);
  return Math.max(0, next - etNow);
}
function tickCountdown() {
  const ms = msToNextMidnightET();
  const h = Math.floor(ms / 3.6e6);
  const m = Math.floor(ms % 3.6e6 / 6e4);
  const s = Math.floor(ms % 6e4 / 1e3);
  document.getElementById("countdown").textContent =
    `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
tickCountdown();
setInterval(tickCountdown, 1000);

/* --- Gentle scroll reveal --- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* --- Thread-draw divider: the one signature scroll motion --- */
const divider = document.querySelector(".thread-divider");
if (divider) {
  const drawObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        divider.classList.add("drawn");
        obs.disconnect();
      }
    });
  }, { threshold: 0.5 });
  drawObserver.observe(divider);
}
