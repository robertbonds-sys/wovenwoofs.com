/* Woven Woofs drops. Newest first. To add a drop: copy an entry,
   bump the number, point image at images/drop-NNN.ext. */

const DROPS = [
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

const grid = document.getElementById("drop-grid");

DROPS.forEach(drop => {
  const card = document.createElement("article");
  card.className = "drop-card reveal";
  card.innerHTML = `
    <img src="${drop.image}" alt="Patch Drop #${String(drop.n).padStart(3, "0")} — ${drop.title}: ${drop.line}" loading="lazy">
    <div class="drop-card-body">
      <p class="drop-num">Patch Drop #${String(drop.n).padStart(3, "0")}</p>
      <h3>${drop.title}</h3>
      <p>${drop.line}</p>
    </div>`;
  grid.appendChild(card);
});

/* Gentle scroll reveal */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
