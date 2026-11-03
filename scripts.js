// Step 1: reusable card data
const internships = [
  { id: 1, title: "Frontend Developer Intern", company: "PixelWorks", domain: "Web Development", duration: "3 months" },
  { id: 2, title: "Data Analyst Intern", company: "DataNest", domain: "Data Science", duration: "2 months" },
  { id: 3, title: "UI/UX Design Intern", company: "DesignHub", domain: "Design", duration: "3 months" },
  { id: 4, title: "Bioanalytical Research Intern", company: "LifeLabs", domain: "Research", duration: "6 months" },
  { id: 5, title: "Backend Developer Intern", company: "CodeForge", domain: "Web Development", duration: "4 months" },
  { id: 6, title: "Digital Marketing Intern", company: "BrandBoost", domain: "Marketing", duration: "2 months" }
];

const searchEl = document.getElementById("search");
const domainEl = document.getElementById("domain");
const resultsEl = document.getElementById("results");
const statusEl = document.getElementById("status");
const messageEl = document.getElementById("message");

function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.className = "message" + (isError ? " error" : "");
  messageEl.hidden = false;
}

function populateDomains(data) {
  [...new Set(data.map(i => i.domain))].forEach(d => {
    const opt = document.createElement("option");
    opt.value = d; opt.textContent = d;
    domainEl.appendChild(opt);
  });
}

function cardHTML(i) {
  return `
    <article class="card" tabindex="0">
      <h2>${i.title}</h2>
      <p>${i.company} · ${i.duration}</p>
      <span class="tag">${i.domain}</span><br />
      <a href="#" aria-label="Apply for ${i.title} at ${i.company}">Apply</a>
    </article>`;
}

// Step 2: search + filter with empty and error states
function render() {
  try {
    if (!Array.isArray(internships)) throw new Error("Data unavailable");
    const q = searchEl.value.trim().toLowerCase();
    const d = domainEl.value;

    const filtered = internships.filter(i =>
      (d === "all" || i.domain === d) &&
      (i.title + i.company + i.domain).toLowerCase().includes(q)
    );

    messageEl.hidden = true;
    resultsEl.innerHTML = filtered.map(cardHTML).join("");
    statusEl.textContent = `${filtered.length} internship(s) found`;

    if (filtered.length === 0) {
      showMessage("No internships match your search. Try a different keyword or domain.");
    }
  } catch (err) {
    resultsEl.innerHTML = "";
    statusEl.textContent = "";
    showMessage("Something went wrong while loading internships. Please refresh.", true);
  }
}

// Step 3: keyboard navigation (Arrow keys move between cards)
resultsEl.addEventListener("keydown", e => {
  const cards = [...resultsEl.querySelectorAll(".card")];
  const idx = cards.indexOf(document.activeElement);
  if (idx === -1) return;
  if (e.key === "ArrowRight" || e.key === "ArrowDown") {
    e.preventDefault(); (cards[idx + 1] || cards[0]).focus();
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
    e.preventDefault(); (cards[idx - 1] || cards[cards.length - 1]).focus();
  }
});

searchEl.addEventListener("input", render);
domainEl.addEventListener("change", render);

populateDomains(internships);
render(); 