# Todo Item Card — Frontend Intern Stage 0

A responsive, accessible Todo Card built with semantic HTML, CSS, and vanilla JavaScript.

## Links

- **Live Demo:** https://demiomotee.github.io/To-do-card/
- **Repo:** https://github.com/Demiomotee/To-do-card.git

---

## How to Run Locally

1. Clone the repo:
```bash
   git clone https://github.com/Demiomotee/To-do-card.git
   cd to-do card
```

2. Open `index.html` in your browser or use VS Code Live Server.

No installs. No build step.

---

## Decisions Made

- **Vanilla JS** — no framework needed for a single card component
- **System font stack** — uses SF Pro on Apple devices, Segoe UI on Windows, no external font request
- **CSS variables** — light/dark theme switching with one `setAttribute` call, preference saved to `localStorage`
- **Status tied to checkboxes** — 0 checked = Pending, 1 checked = In Progress, all checked = Done
- **Live date** — left panel pulls from `new Date()` and refreshes at midnight automatically
- **Toast over `alert()`** — custom banner slides in from bottom-right instead of blocking the page

---

## Trade-offs

- Hardcoded task data — no backend or data layer, acceptable for a single card
- 60s interval on time chip — accurate enough for a days/hours display
- No real delete — button shows a toast but doesn't remove the card

---

## Author

**Demiomotee**
https://github.com/Demiomotee
