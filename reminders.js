/* ============================================================
   Hub — reminders.js (the Reminders tab)

   A reminder is { id, text, date, done, doneDay }.
   `date` is "YYYY-MM-DD", or "" for a someday-reminder.

   What makes this a *reminder* and not just another list:
   anything due today (or overdue) also appears in the
   "Don't forget" card at the top of Today, and as a number on
   the ⏰ tab button — Hub taps you on the shoulder the moment
   you open it.

   (Real phone notifications while Hub is closed need cloud
   tech — that idea lives in the README parking lot for now.)
   ============================================================ */

// "2026-07-12" → "Sun, Jul 12". Built from the parts by hand to
// avoid timezone slips (new Date("2026-07-12") would parse as UTC).
function prettyDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function openReminders() {
  return data.reminders.filter((r) => !r.done);
}

// Due = has a date that is today or already past.
function dueReminders() {
  const today = Storage.todayKey();
  return openReminders().filter((r) => r.date && r.date <= today);
}

// Build one reminder row. Shared by the Today card and this tab.
function reminderRow(r, showDate) {
  const today = Storage.todayKey();
  const li = document.createElement("li");
  li.className = r.done ? "done" : "";

  const tick = document.createElement("button");
  tick.className = "tick";
  tick.textContent = "✓";
  tick.setAttribute("aria-label", r.done ? "Mark as not done" : "Mark as done");
  tick.onclick = () => {
    r.done = !r.done;
    r.doneDay = r.done ? today : null;
    saveAndRender();
  };

  const text = document.createElement("span");
  text.className = "task-text";
  text.textContent = r.text;

  li.append(tick, text);

  if (showDate && r.date) {
    const chip = document.createElement("span");
    const overdue = !r.done && r.date < today;
    chip.className = "rem-date" + (overdue ? " overdue" : "");
    chip.textContent = overdue ? `was ${prettyDate(r.date)}` : prettyDate(r.date);
    li.appendChild(chip);
  }

  const del = document.createElement("button");
  del.className = "del";
  del.textContent = "✕";
  del.setAttribute("aria-label", `Delete reminder: ${r.text}`);
  del.onclick = () => {
    data.reminders = data.reminders.filter((x) => x.id !== r.id);
    saveAndRender();
  };
  li.appendChild(del);

  return li;
}

/* ---------- the "Don't forget" card on Today ---------- */

function renderTodayReminders() {
  const today = Storage.todayKey();
  // Everything due, plus due things you already ticked off today —
  // those stay visible, struck through (a tiny victory lap).
  const items = data.reminders.filter(
    (r) => r.date && r.date <= today && (!r.done || r.doneDay === today)
  );
  $("#due-card").hidden = items.length === 0;
  const list = $("#due-list");
  list.innerHTML = "";
  items.forEach((r) => list.appendChild(reminderRow(r, true)));
}

/* ---------- the Reminders tab itself ---------- */

function renderRemindersPage() {
  const today = Storage.todayKey();
  const open = openReminders();

  // [title, items, extra css class for the title]
  const groups = [
    ["Overdue", open.filter((r) => r.date && r.date < today), "overdue"],
    ["Today", open.filter((r) => r.date === today), ""],
    ["Coming up", open.filter((r) => r.date > today).sort((a, b) => (a.date < b.date ? -1 : 1)), ""],
    ["Someday", open.filter((r) => !r.date), ""],
    ["Done today", data.reminders.filter((r) => r.done && r.doneDay === today), ""],
  ];

  const wrap = $("#reminder-groups");
  wrap.innerHTML = "";
  let any = false;

  groups.forEach(([title, items, extra]) => {
    if (!items.length) return;
    any = true;
    const h = document.createElement("h3");
    h.className = "group-title" + (extra ? " " + extra : "");
    h.textContent = title;
    const ul = document.createElement("ul");
    ul.className = "task-list";
    // "Today" rows skip the date chip — it would just say today.
    items.forEach((r) => ul.appendChild(reminderRow(r, title !== "Today")));
    wrap.append(h, ul);
  });

  $("#reminder-empty").style.display = any ? "none" : "block";
}

/* ---------- the number on the ⏰ tab button ---------- */

function renderReminderBadge() {
  const n = dueReminders().length;
  const badge = $("#reminder-badge");
  badge.hidden = n === 0;
  badge.textContent = n;
}

/* ---------- wiring (called once, from app.js startup) ---------- */

function setupReminders() {
  $("#reminder-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = $("#new-reminder").value.trim();
    if (!text) return;
    data.reminders.push({
      id: makeId(),
      text,
      date: $("#new-reminder-date").value || "",
      done: false,
      doneDay: null,
    });
    $("#new-reminder").value = "";
    $("#new-reminder-date").value = "";
    saveAndRender();
    $("#new-reminder").focus();
  });
}
