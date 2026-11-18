/* Responsive Internship Board - plain JavaScript, no framework.
 * Sections: 1) data layer  2) rendering  3) filters  4) dialog + form  5) boot
 */
(function () {
  "use strict";

  /* ---------- DOM references ---------- */
  const $ = (id) => document.getElementById(id);
  const els = {
    filters: $("filters"), search: $("search"), domain: $("domain"), mode: $("mode"),
    simulateError: $("simulate-error"), status: $("status"), results: $("results"),
    list: $("card-list"), loading: $("loading"), empty: $("empty"), error: $("error"),
    errorMessage: $("error-message"), retry: $("retry"), emptyClear: $("empty-clear"),
    dialog: $("detail-dialog"), dialogTitle: $("dialog-title"), dialogDetails: $("dialog-details"),
    dialogClose: $("dialog-close"), form: $("apply-form"), formMessage: $("form-message"),
    cancelApply: $("cancel-apply"),
    name: $("applicant-name"), email: $("applicant-email"), portfolio: $("applicant-portfolio"),
  };

  const state = { all: [], filtered: [], selected: null, lastTrigger: null };
  const STORAGE_KEY = "internship-board:applications";

  /* ---------- 1) Data layer ---------- */
  // Simulates an API call (latency + optional failure) so loading/error/retry states are real.
  function fetchInternships() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (els.simulateError.checked) {
          reject(new Error("Network error: the internship service could not be reached."));
          return;
        }
        if (!Array.isArray(window.INTERNSHIP_SEED)) {
          reject(new Error("Internship data is missing."));
          return;
        }
        resolve({
          status: "ok",
          data: window.INTERNSHIP_SEED.map((r) => ({ ...r })),
          pagination: { page: 1, pageSize: window.INTERNSHIP_SEED.length, total: window.INTERNSHIP_SEED.length },
        });
      }, 700);
    });
  }

  function readApplications() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch (e) { return []; }
  }
  function saveApplication(app) {
    try {
      const all = readApplications();
      all.push(app);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch (e) { /* storage unavailable: still show success for this demo */ }
  }

  /* ---------- 2) Rendering ---------- */
  function show(which) {
    els.list.hidden = which !== "list";
    els.loading.hidden = which !== "loading";
    els.empty.hidden = which !== "empty";
    els.error.hidden = which !== "error";
  }

  function el(tag, props = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    });
    children.forEach((c) => node.appendChild(c));
    return node;
  }

  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  // Reusable card factory: one function builds every card from a record.
  function createCard(item) {
    const titleId = `title-${item.id}`;
    const badges = el("ul", { class: "badges", "aria-label": "Domain and work mode" }, [
      el("li", { class: "badge", text: item.domain }),
      el("li", { class: `badge badge--${slug(item.mode)}`, text: item.mode }),
    ]);
    const skills = el("ul", { class: "skills", "aria-label": "Skills" },
      item.skills.map((s) => el("li", { class: "skill", text: s })));
    const button = el("button", {
      type: "button", class: "btn", "data-id": item.id,
      "aria-label": `View details for ${item.title}`,
      text: "View details",
    });
    const card = el("article", { class: "card", "aria-labelledby": titleId }, [
      el("h2", { id: titleId, text: item.title }),
      el("p", { class: "meta", text: `${item.location} · ${item.openings} ${item.openings === 1 ? "opening" : "openings"}` }),
      badges, skills, button,
    ]);
    return el("li", {}, [card]);
  }

  function renderList() {
    els.list.replaceChildren(...state.filtered.map(createCard));
    const n = state.filtered.length;
    els.status.textContent = `${n} ${n === 1 ? "internship" : "internships"} found`;
    show(n === 0 ? "empty" : "list");
  }

  /* ---------- 3) Filters ---------- */
  function fillSelect(select, values) {
    [...new Set(values)].sort().forEach((v) => select.appendChild(el("option", { value: v, text: v })));
  }

  function applyFilters() {
    const q = els.search.value.trim().toLowerCase();
    const domain = els.domain.value;
    const mode = els.mode.value;
    state.filtered = state.all.filter((r) => {
      const haystack = [r.title, r.domain, r.mode, r.location, ...r.skills].join(" ").toLowerCase();
      return (!q || haystack.includes(q)) && (!domain || r.domain === domain) && (!mode || r.mode === mode);
    });
    renderList();
  }

  function clearFilters() {
    els.filters.reset();
    applyFilters();
    els.search.focus();
  }

  async function load() {
    show("loading");
    els.status.textContent = "Loading internships…";
    try {
      const res = await fetchInternships();
      state.all = res.data;
      if (els.domain.options.length === 1) {
        fillSelect(els.domain, state.all.map((r) => r.domain));
        fillSelect(els.mode, state.all.map((r) => r.mode));
      }
      applyFilters();
    } catch (err) {
      els.errorMessage.textContent = err.message;
      els.status.textContent = "Could not load internships.";
      show("error");
      els.retry.focus();
    }
  }

  /* ---------- 4) Dialog + application form ---------- */
  function openDetails(id, trigger) {
    const item = state.all.find((r) => r.id === id);
    if (!item) return;
    state.selected = item;
    state.lastTrigger = trigger;
    els.dialogTitle.textContent = item.title;
    const rows = [
      ["Reference", item.id], ["Domain", item.domain], ["Work mode", item.mode],
      ["Location", item.location], ["Skills", item.skills.join(", ")], ["Openings", String(item.openings)],
    ];
    els.dialogDetails.replaceChildren(
      ...rows.flatMap(([k, v]) => [el("dt", { text: k }), el("dd", { text: v })])
    );
    resetForm();
    els.dialog.showModal();
    els.dialogTitle.setAttribute("tabindex", "-1");
    els.name.focus();
  }

  function closeDialog() {
    if (els.dialog.open) els.dialog.close();
  }

  function setError(input, message) {
    const errorEl = $(`${input.id.replace("applicant-", "")}-error`);
    if (message) {
      errorEl.textContent = message;
      errorEl.hidden = false;
      input.setAttribute("aria-invalid", "true");
    } else {
      errorEl.hidden = true;
      errorEl.textContent = "";
      input.removeAttribute("aria-invalid");
    }
  }

  function resetForm() {
    els.form.reset();
    [els.name, els.email, els.portfolio].forEach((i) => setError(i, ""));
    els.formMessage.textContent = "";
    els.formMessage.className = "form-message";
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  function isSafeUrl(value) {
    try {
      const u = new URL(value);
      return u.protocol === "https:" || u.protocol === "http:";
    } catch (e) { return false; }
  }

  function validate() {
    const errors = [];
    const name = els.name.value.trim();
    const email = els.email.value.trim();
    const portfolio = els.portfolio.value.trim();

    setError(els.name, name.length < 2 ? "Enter your full name." : "");
    setError(els.email, !EMAIL_RE.test(email) ? "Enter a valid email address, like name@example.com." : "");
    setError(els.portfolio, portfolio && !isSafeUrl(portfolio) ? "Enter a link starting with http:// or https://." : "");

    [els.name, els.email, els.portfolio].forEach((i) => { if (i.getAttribute("aria-invalid")) errors.push(i); });
    return { ok: errors.length === 0, firstInvalid: errors[0], name, email, portfolio };
  }

  function onSubmit(event) {
    event.preventDefault();
    const result = validate();
    if (!result.ok) {
      els.formMessage.className = "form-message is-error";
      els.formMessage.textContent = "Please fix the highlighted fields.";
      result.firstInvalid.focus();
      return;
    }
    const key = `${state.selected.id}:${result.email.toLowerCase()}`;
    if (readApplications().some((a) => a.key === key)) {
      setError(els.email, "You have already applied to this internship with this email.");
      els.formMessage.className = "form-message is-error";
      els.formMessage.textContent = "Duplicate application.";
      els.email.focus();
      return;
    }
    saveApplication({ key, internshipId: state.selected.id, submittedAt: new Date().toISOString() });
    els.formMessage.className = "form-message is-success";
    els.formMessage.textContent = `Application sent for ${state.selected.title}. Thank you, ${result.name}!`;
    els.form.reset();
  }

  /* ---------- 5) Boot ---------- */
  function bind() {
    els.search.addEventListener("input", applyFilters);
    els.domain.addEventListener("change", applyFilters);
    els.mode.addEventListener("change", applyFilters);
    els.filters.addEventListener("submit", (e) => e.preventDefault());
    els.filters.addEventListener("reset", () => setTimeout(applyFilters, 0));
    els.emptyClear.addEventListener("click", clearFilters);
    els.retry.addEventListener("click", load);
    els.simulateError.addEventListener("change", load);

    // Event delegation: one listener handles every card button.
    els.list.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-id]");
      if (btn) openDetails(btn.dataset.id, btn);
    });

    els.dialogClose.addEventListener("click", closeDialog);
    els.cancelApply.addEventListener("click", closeDialog);
    els.form.addEventListener("submit", onSubmit);
    // Return focus to the card button that opened the dialog.
    els.dialog.addEventListener("close", () => { if (state.lastTrigger) state.lastTrigger.focus(); });
    // Clicking the backdrop closes the dialog.
    els.dialog.addEventListener("click", (e) => { if (e.target === els.dialog) closeDialog(); });

    // "/" jumps to search (unless the user is typing in a field).
    document.addEventListener("keydown", (e) => {
      const tag = (document.activeElement && document.activeElement.tagName) || "";
      if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(tag) && !els.dialog.open) {
        e.preventDefault();
        els.search.focus();
      }
    });
  }

  bind();
  load();
})();