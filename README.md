# Todo Item Card — Frontend Intern Stage 0 & 1

A responsive, accessible, and interactive Todo Card built with semantic HTML, CSS, and vanilla JavaScript.

## Links

- **Live Demo:** https://demiomotee.github.io/To-do-card/
- **Repo:** https://github.com/Demiomotee/To-do-card.git

---

## How to Run Locally

1. Clone the repo:
```bash
   git clone https://github.com/Demiomotee/To-do-card.git
   cd To-do-card
```

2. Open `index.html` in your browser or use VS Code Live Server.

No installs. No build step.

> **Note:** The edit modal uses `fetch()` to load its HTML template, so it requires a local server to work correctly. Use VS Code Live Server or any static server — opening `index.html` directly as a file will block the fetch request.

---

## Features

### Stage 0
- Semantic HTML with all required `data-testid` attributes
- Live date in the left panel — pulls from `new Date()` and auto-refreshes at midnight
- Real-time due date chip — updates every 60 seconds, flips from "Due in X days" to "Overdue by X" automatically
- Status badge driven by checkboxes — 0 checked = Pending, 1 checked = In Progress, all checked = Done
- Light/dark theme toggle — preference saved to `localStorage`
- Toast notifications instead of native `alert()` — slides in from bottom-right
- Fully keyboard navigable and screen-reader accessible

### Stage 1
- Edit modal — opens as a popup, pre-filled with current card values
- Saving updates the title, description, priority badge, due date, and time chip live
- Cancel or clicking outside the modal returns you to the card
- Description truncated to 2 lines with a "See more / See less" toggle
- Priority badge updates dynamically when changed in the edit form

---

## Decisions Made

- **Vanilla JS** — no framework needed for a single card component
- **ES Modules** — `app.js` uses `import` to pull in the edit component, keeping concerns separated
- **Component folder** — edit modal lives in `components/edit/` with its own HTML, CSS, and JS so the card code stays clean
- **System font stack** — uses SF Pro on Apple devices, Segoe UI on Windows, no external font request
- **CSS variables** — all colors defined once, theme switching with a single `setAttribute` call
- **Dynamic CSS injection** — edit modal CSS is loaded once on first open, not on every page load
- **`-webkit-line-clamp`** — used for the 2-line description truncation; widely supported and requires no JS to measure
- **Toast over `alert()`** — less disruptive, stays within the UI, auto-dismisses after 3.5 seconds

---

## Trade-offs

- **Hardcoded task data** — no backend or data layer; acceptable for a single card demo
- **`fetch()` for modal HTML** — requires a local server; won't work when opened as a raw file in the browser
- **60s interval on time chip** — accurate enough for a days/hours display; would need `setInterval(fn, 1000)` if seconds matter
- **No real delete** — button shows a toast but does not remove the card; a real implementation would call a delete API and remove the DOM node
- **No form validation** — the edit form saves whatever is in the fields; a production version would validate before saving

---

## Accessibility

- Real `<input type="checkbox">` with `aria-label`
- All buttons have accessible names
- `<time datetime="...">` for the due date
- `aria-live="polite"` on the time remaining chip
- Visible focus styles on all interactive elements
- Edit modal uses `role="dialog"` and `aria-modal="true"`
- Escape key closes the modal
- Focus returns to the Edit button after the modal closes

---

## Author

**Demiomotee**
https://github.com/Demiomotee
