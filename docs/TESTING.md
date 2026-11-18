# Test results

Fill in the "Result" column yourself after testing in Chrome DevTools (F12 → Toggle device toolbar, Ctrl+Shift+M).

## Responsive checks

| Width | Expected | Result |
|---|---|---|
| 360px | 1 column, no horizontal scrollbar, all buttons tappable | ☐ Pass |
| 768px | 2 columns, filters in one row | ☐ Pass |
| 1280px (desktop) | 3 columns | ☐ Pass |

## Keyboard checks

| Action | Expected | Result |
|---|---|---|
| Press Tab from page start | "Skip to internship results" appears first | ☐ Pass |
| Press `/` | Focus moves to Search | ☐ Pass |
| Tab to a card, press Enter | Dialog opens, focus lands on Full name | ☐ Pass |
| Press Esc | Dialog closes, focus returns to the same card button | ☐ Pass |

## Functional checks

| Scenario | Expected | Result |
|---|---|---|
| Search `sql` | INT-102 and INT-104 | ☐ Pass |
| Domain = UI/UX | Only INT-103 | ☐ Pass |
| Search `zzz` | Empty state with "Clear filters" | ☐ Pass |
| Tick "Simulate a network error" | Error state; unticking then Retry loads list | ☐ Pass |
| Submit empty form | Errors on name and email, focus on first invalid | ☐ Pass |
| Email `abc` | "Enter a valid email address" | ☐ Pass |
| Portfolio `javascript:alert(1)` | Rejected as unsafe link | ☐ Pass |
| Apply twice with same email | "Duplicate application" | ☐ Pass |

## Accessibility tools

- Lighthouse (Chrome DevTools → Lighthouse → Accessibility): score ______
- Screenshot of results saved in `docs/` (optional)
