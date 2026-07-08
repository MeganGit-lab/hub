# Hub

Megan's personal daily hub. One page, opened every day: how I'm doing, what I need to do, and a growing record of my days.

Started July 8, 2026, built with Claude (Fable 5).

## How to open it

Double-click `index.html` (or use the **Hub** shortcut on the desktop). That's it — no internet needed, nothing to install.

## The one rule of this project

**New ideas become modules, not new projects.** When the itch for something new hits, don't start a fresh thing that fizzles — add a module to Hub and drop the idea in the parking lot below. Hub is the container; the ideas are the fuel.

## Where the data lives (important!)

Everything is saved inside the browser (localStorage) — not in this folder. Two things to know:

1. **Use the same browser every time**, or your data won't follow you.
2. **Click "Backup" in the footer every week or two.** It downloads a `hub-backup-....json` file. If the browser's data ever gets cleared, "Restore" brings everything back.

(Phase 2 fixes this properly by putting the data in the cloud.)

## The files

| File | What it is |
|---|---|
| `index.html` | The structure of the page — what exists |
| `styles.css` | How it looks — colors, spacing, dark mode |
| `app.js` | How it behaves — every button and interaction |
| `storage.js` | How data is saved — the only file that touches storage |

Change your name in the greeting at the top of `app.js` (`const OWNER = ...`).

## Roadmap

- [x] **v1 — Today page**: tasks, mood, habits, daily note, streak, 7-day view *(July 8, 2026)*
- [ ] **Phase 2 — Get it online**: put Hub on the web (free hosting) so the phone can use it, with a shared account so phone + PC see the same data. Also: learn git along the way.
- [ ] **Module 2 — Money**: quick expense logging, monthly picture
- [ ] **Module 3 — Journal**: the daily one-liner grows into real entries, searchable
- [ ] **Someday — AI features**: weekly summaries of my check-ins, an assistant that knows my data

## Idea parking lot

*(When a shiny new idea appears, write it here instead of abandoning ship. Review when bored.)*

- …

## Working on Hub with Claude

Open Claude Code in this folder (`D:\Workspaces\hub`) and just say what you want, e.g. *"add a way to mark a task as important"* or *"start the money module."* Small changes are the way — one improvement at a time keeps it fun.
