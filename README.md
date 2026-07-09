# Hub

Megan's personal daily hub. One page, opened every day: how I'm doing, what I need to do, and a growing record of my days.

Started July 8, 2026, built with Claude (Fable 5).

## How to open it

- **Anywhere (phone or PC):** <https://megangit-lab.github.io/hub/> — the **Hub Online** desktop shortcut opens it. On the phone, open it in the browser and use *Add to Home Screen* so it feels like an app.
- **Offline spare:** double-clicking `index.html` (the old **Hub** shortcut) still works with no internet — but it keeps its own separate data, so stick to the website day-to-day.

## The one rule of this project

**New ideas become modules, not new projects.** When the itch for something new hits, don't start a fresh thing that fizzles — add a module to Hub and drop the idea in the parking lot below. Hub is the container; the ideas are the fuel.

## Where the data lives (important!)

Everything is saved inside the browser (localStorage) — not in this folder. Two things to know:

1. **Each device keeps its own data** — the phone and the PC don't see each other's entries yet (that's Phase 2b, cloud sync). Until then, "Backup" on one device + "Restore" on the other moves data by hand.
2. **Click "Backup" in the footer every week or two.** It downloads a `hub-backup-....json` file. If the browser's data ever gets cleared, "Restore" brings everything back.

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
- [x] **Phase 2a — Get it online**: Hub lives at <https://megangit-lab.github.io/hub/> (GitHub Pages, free). Learned git: the project's history now lives at <https://github.com/MeganGit-lab/hub> *(July 9, 2026)*
- [ ] **Phase 2b — Cloud sync**: one shared account so phone + PC see the same data automatically
- [ ] **Module 2 — Money**: quick expense logging, monthly picture
- [ ] **Module 3 — Journal**: the daily one-liner grows into real entries, searchable
- [ ] **Someday — AI features**: weekly summaries of my check-ins, an assistant that knows my data

## Idea parking lot

*(When a shiny new idea appears, write it here instead of abandoning ship. Review when bored.)*

- …

## Publishing a change (the git ritual)

After any change to the files, three commands in the Hub folder put it on the website (it updates itself about a minute later):

```
git add -A
git commit -m "say what you changed"
git push
```

Every commit is a saved snapshot — the whole story of Hub, one change at a time, visible at the GitHub link above.

## Working on Hub with Claude

Open Claude Code in this folder (`D:\Workspaces\hub`) and just say what you want, e.g. *"add a way to mark a task as important"* or *"start the money module."* Small changes are the way — one improvement at a time keeps it fun.
