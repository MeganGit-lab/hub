# Hub

Megan's personal daily hub, opened every day. Two jobs, one app: remind me of my chores and errands — and give me a place to write about how I'm feeling, keep the promises I've made to myself, and encourage myself to make my life better.

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
| `app.js` | The Today tab, the bottom tab bar, and shared helpers |
| `reminders.js` | The ⏰ Reminders tab (and the "Don't forget" card on Today) |
| `habits.js` | The 🌱 Habits tab — habits, whys, streaks, and My commitments |
| `storage.js` | How data is saved — the only file that touches storage |

That's the module pattern: each new tab is its own small file. Money and Journal will join the same way.

Change your name in the greeting at the top of `app.js` (`const OWNER = ...`).

## Roadmap

- [x] **v1 — Today page**: tasks, mood, habits, daily note, streak, 7-day view *(July 8, 2026)*
- [x] **Phase 2a — Get it online**: Hub lives at <https://megangit-lab.github.io/hub/> (GitHub Pages, free). Learned git: the project's history now lives at <https://github.com/MeganGit-lab/hub> *(July 9, 2026)*
- [x] **v1.1 — Tabs**: bottom tab bar. ⏰ Reminders (dated reminders that surface on Today and count on the tab button) and 🌱 Habits (add/rename/remove, a "why" for each, 7-day dots, per-habit streaks) *(July 10, 2026)*
- [x] **v1.2 — My commitments**: a list on the Habits tab of the things I'm committed to improving, each with a "since" date *(July 10, 2026)*
- [x] **v1.3 — The delight layer**: colour per tab, a streak buddy that grows with your streak (🌰→🌱→🌿→🪴→🌳→🌸), emoji sparks when you tick things off, confetti for a full habit day, a daily line of encouragement, mood colours on the week strip *(July 13, 2026)*
- [ ] **Phase 2b — Cloud sync**: one shared account so phone + PC see the same data automatically
- [ ] **Module 2 — Money**: quick expense logging, monthly picture
- [ ] **Module 3 — Journal**: the daily one-liner grows into real entries, searchable
- [ ] **Someday — AI features**: weekly summaries of my check-ins, an assistant that knows my data

## Idea parking lot

*(When a shiny new idea appears, write it here instead of abandoning ship. Review when bored.)*

- Real push notifications — the phone pings you even when Hub is closed. Needs cloud machinery (a service worker + a push server), so it pairs naturally with Phase 2b.
- A month-grid calendar view of reminders (the list groups cover daily use for now).

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
