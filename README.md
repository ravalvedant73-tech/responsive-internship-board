<<<<<<< HEAD
# Responsive Internship Board

An accessible, responsive internship listing built with **plain HTML, CSS and JavaScript** (no framework, no build step).
Built for the EdVyro Full Stack Development — Task 1.

**Repository:** `https://github.com/ravalvedant73-tech/responsive-internship-board`  
**Live demo (GitHub Pages):** `https://ravalvedant73-tech.github.io/responsive-internship-board/`



## Features

- Reusable card factory (`createCard`) driven by a JSON data set (`data/internships.json`, original IDs preserved)
- Search (title, skill, location, domain) + **Domain** and **Work mode** filters, combined
- **Loading, empty, error and retry** states (tick "Simulate a network error" to see the error + Retry flow)
- Details dialog and an application form with validation:
  missing name, invalid email, unsafe portfolio URL and duplicate application are all rejected
- Keyboard accessible: skip link, visible focus, labelled controls, `/` to focus search, `Esc` closes dialog, focus returns to the card button
- Screen reader support: `aria-live` result count, `role="alert"` for errors, `aria-invalid` + described error messages
- Responsive: 1 column at 360px, 2 at 768px, 3 on desktop; no horizontal scrolling

## Project structure

```
responsive-internship-board/
├── index.html
├── css/styles.css
├── js/
│   ├── data.js          # seed records as a script (works from file://)
│   └── app.js           # all behaviour
├── data/internships.json # seed records (reference copy)
├── docs/TESTING.md      # responsive + accessibility test results
├── .gitignore
└── README.md
```

## Run locally

Option 1: double-click `index.html`.

Option 2 (recommended, VS Code): install the **Live Server** extension, right-click `index.html` → *Open with Live Server*.

Option 3: `python -m http.server 8000` then open http://localhost:8000

No installation, no environment variables and no secrets are needed.

## Deploy (GitHub Pages)

Repository → **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save**.

## Test results

Tested in Chrome DevTools (device toolbar) and an automated headless browser run:

| Check | Result |
|---|---|
| 360px: 1 column, no horizontal scroll | Pass |
| 768px: 2 columns | Pass |
| 1280px: 3 columns | Pass |
| Search `sql` returns 2 records; domain + search combine; empty state with Clear filters | Pass |
| Simulated network error shows Retry; Retry recovers | Pass |
| Form rejects empty name/email, invalid email, `javascript:` link, duplicate application | Pass |
| Esc closes dialog and returns focus to the card button | Pass |

Screenshots: `docs/screenshot-360px.png`, `docs/screenshot-desktop.png`. Details: `docs/TESTING.md`.

## Short explanation

1. **Structure:** header, filter form, live status line, results region, details dialog.
2. **Data:** the seed JSON is loaded through a small async function that simulates latency and failure, returning an envelope `{ status, data, pagination }`.
3. **Cards:** one `createCard(record)` function builds every card, so adding a record needs no HTML changes.
4. **Filters:** one `applyFilters()` function combines search text, domain and mode.
5. **Accessibility:** native `<dialog>`, real `<label>`s, semantic lists/headings, visible focus, 44px touch targets, AA colour contrast.
6. **Testing:** see `docs/TESTING.md`.

## Notes

All internship records are fictional. Applications are stored only in the browser's `localStorage` for the duplicate check demo.

# internship-board
Internship of full stack developer
 4e6be62b91dbbe4fa92ff71da94adc06d0f8d70e
