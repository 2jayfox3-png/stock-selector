# Stock Selector

Public MVP for a disciplined stock selection workflow.

## What it is
Stock Selector is a lightweight scanner-style web app for evaluating stocks using a clear rules-based framework:
- trend quality
- MA150 regime
- setup quality
- entry zone
- invalidation level
- risk quality

This MVP is intentionally simple and explainable. It is a decision-support tool, not an auto-trading system.

## Included in this public version
- Scanner view
- Stock detail view
- Watchlist
- Journal
- Demo/live snapshot data via `data.json`

## Tech
Plain static frontend:
- `index.html`
- `styles.css`
- `app.js`
- `data.json`

This means it can be hosted easily on GitHub Pages.

## Local run
Because this is a static app, you can open `index.html` directly, or serve it locally.

Example:
```bash
python3 -m http.server 8000
```
Then open:
```text
http://localhost:8000
```

## Notes
- This repo is an MVP UI/prototype.
- It uses a static JSON snapshot for now.
- Future versions can connect to a live pipeline and richer scoring logic.

## Product docs
- `PRD.md`
- `scoring-engine-v1.md`

## License
TBD
