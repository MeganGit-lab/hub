/* ============================================================
   Hub — storage.js (the data layer)

   Everything the app knows is one JSON object saved in the
   browser's localStorage. The shape:

   {
     version: 1,
     tasks:     [ { id, text, done, createdDay, doneDay } ],
     reminders: [ { id, text, date: "YYYY-MM-DD" or "", done, doneDay } ],
     days:      { "2026-07-08": { mood: 0-4 or null, habits: {habitId: true}, note: "" } },
     habits:    [ { id, name, why } ]
   }

   Keeping ALL reading/writing in this file means that later,
   when we add cloud sync (phase 2), we only change this file —
   the rest of the app won't care where the data lives.
   ============================================================ */

// Small unique-id helper (works everywhere, no dependencies).
function makeId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

const Storage = {
  KEY: "hub-data-v1",

  defaultData() {
    return {
      version: 1,
      tasks: [],
      reminders: [],
      days: {},
      habits: [
        { id: makeId(), name: "Move my body" },
        { id: makeId(), name: "Drink water" },
        { id: makeId(), name: "Read a little" },
      ],
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return this.defaultData();
      const data = JSON.parse(raw);
      // Basic sanity check so a corrupted save can't break the app.
      if (!data || !Array.isArray(data.tasks) || typeof data.days !== "object") {
        return this.defaultData();
      }
      return this.normalize(data);
    } catch (err) {
      console.warn("Could not read saved data, starting fresh.", err);
      return this.defaultData();
    }
  },

  // Fill in any keys this version of Hub expects but an older
  // save (or an old backup file being restored) might not have.
  normalize(data) {
    if (!Array.isArray(data.habits)) data.habits = [];
    if (!Array.isArray(data.reminders)) data.reminders = [];
    return data;
  },

  save(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data));
  },

  // Local date key like "2026-07-08" (NOT UTC — late-night entries
  // should count for the day you experienced, not the day in London).
  dayKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  },

  todayKey() {
    return this.dayKey(new Date());
  },

  // Get (and create if missing) the record for one day.
  getDay(data, key) {
    if (!data.days[key]) {
      data.days[key] = { mood: null, habits: {}, note: "" };
    }
    return data.days[key];
  },
};
