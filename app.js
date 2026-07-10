/* ============================================================
   Hub — app.js (the Today tab + the glue)

   How it works, in one breath: there is one `data` object
   (loaded by storage.js). Whenever you do something — tick a
   habit, add a task — we change `data`, save it, and redraw
   the screen from scratch. Simple to reason about, and plenty
   fast at this size.

   The app is split by tab: this file owns Today and the tab
   bar; reminders.js and habits.js own their tabs. They all
   share the one `data` object and the helpers defined here.
   ============================================================ */

// Your name — change it and refresh!
const OWNER = "Megan";

const MOODS = ["😞", "😕", "😐", "🙂", "😄"];

let data = Storage.load();

const $ = (sel) => document.querySelector(sel);

function todayRec() {
  return Storage.getDay(data, Storage.todayKey());
}

function saveAndRender() {
  Storage.save(data);
  render();
}

/* ---------- header ---------- */

function renderHeader() {
  const h = new Date().getHours();
  const part = h < 5 ? "night" : h < 12 ? "morning" : h < 18 ? "afternoon" : "evening";
  $("#greeting").textContent =
    part === "night" ? `Up late, ${OWNER}?` : `Good ${part}, ${OWNER}`;

  $("#date-line").textContent = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  $("#streak").textContent = `🔥 ${computeStreak()}`;
}

// A day "counts" if you set a mood, ticked a habit, or wrote a note.
function dayHasActivity(rec) {
  if (!rec) return false;
  const anyHabit = rec.habits && Object.values(rec.habits).some(Boolean);
  return rec.mood !== null || anyHabit || (rec.note && rec.note.trim() !== "");
}

// Consecutive days of check-ins. Today not checked in yet? The streak
// you built through yesterday still stands — no pressure before bed.
function computeStreak() {
  const d = new Date();
  if (!dayHasActivity(data.days[Storage.dayKey(d)])) {
    d.setDate(d.getDate() - 1);
  }
  let streak = 0;
  while (dayHasActivity(data.days[Storage.dayKey(d)])) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

/* ---------- daily check-in ---------- */

function renderMood() {
  const rec = todayRec();
  const row = $("#mood-row");
  row.innerHTML = "";
  MOODS.forEach((emoji, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mood-btn" + (rec.mood === i ? " selected" : "");
    btn.textContent = emoji;
    btn.setAttribute("aria-pressed", rec.mood === i);
    btn.setAttribute("aria-label", `Mood ${i + 1} of 5`);
    btn.onclick = () => {
      rec.mood = rec.mood === i ? null : i; // tap again to clear
      saveAndRender();
    };
    row.appendChild(btn);
  });
}

function renderHabits() {
  const rec = todayRec();
  const list = $("#habit-list");
  list.innerHTML = "";

  data.habits.forEach((habit) => {
    const li = document.createElement("li");
    const done = !!rec.habits[habit.id];
    li.className = done ? "done" : "";
    const label = document.createElement("label");
    if (habit.why) label.title = habit.why; // hover a habit to see your why
    const box = document.createElement("input");
    box.type = "checkbox";
    box.checked = done;
    box.onchange = () => {
      rec.habits[habit.id] = box.checked;
      saveAndRender();
    };
    const name = document.createElement("span");
    name.className = "habit-name";
    name.textContent = habit.name;
    label.append(box, name);
    li.appendChild(label);
    list.appendChild(li);
  });
}

function renderNote() {
  // Only set the value — never rebuild this input while you type in it.
  $("#note").value = todayRec().note || "";
}

/* ---------- tasks ---------- */

function visibleTasks() {
  const today = Storage.todayKey();
  // Open tasks always show; finished ones show only on the day you
  // finished them (a little "look what I did" before they retire).
  const open = data.tasks.filter((t) => !t.done);
  const doneToday = data.tasks.filter((t) => t.done && t.doneDay === today);
  return [...open, ...doneToday];
}

function renderTasks() {
  const list = $("#task-list");
  list.innerHTML = "";
  const tasks = visibleTasks();

  $("#task-empty").style.display = tasks.length ? "none" : "block";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = task.done ? "done" : "";

    const tick = document.createElement("button");
    tick.className = "tick";
    tick.textContent = "✓";
    tick.setAttribute("aria-label", task.done ? "Mark as not done" : "Mark as done");
    tick.onclick = () => {
      task.done = !task.done;
      task.doneDay = task.done ? Storage.todayKey() : null;
      saveAndRender();
    };

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "✕";
    del.setAttribute("aria-label", `Delete task: ${task.text}`);
    del.onclick = () => {
      data.tasks = data.tasks.filter((x) => x.id !== task.id);
      saveAndRender();
    };

    li.append(tick, text, del);
    list.appendChild(li);
  });
}

/* ---------- last 7 days ---------- */

function renderWeek() {
  const wrap = $("#week");
  wrap.innerHTML = "";
  const todayKey = Storage.todayKey();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = Storage.dayKey(d);
    const rec = data.days[key];

    const cell = document.createElement("div");
    cell.className = "day" + (key === todayKey ? " today" : "");

    const dow = document.createElement("div");
    dow.className = "dow";
    dow.textContent = d.toLocaleDateString(undefined, { weekday: "short" }).slice(0, 2);

    const mood = document.createElement("div");
    const hasMood = rec && rec.mood !== null && rec.mood !== undefined;
    mood.className = "mood" + (hasMood ? "" : " empty");
    mood.textContent = hasMood ? MOODS[rec.mood] : "·";

    const habitsDone = rec ? Object.values(rec.habits || {}).filter(Boolean).length : 0;
    const hd = document.createElement("div");
    hd.className = "habits-done";
    hd.textContent = habitsDone > 0 ? `${habitsDone} ✓` : " ";

    cell.append(dow, mood, hd);
    wrap.appendChild(cell);
  }
}

/* ---------- backup / restore ---------- */

function exportData() {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `hub-backup-${Storage.todayKey()}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const incoming = JSON.parse(reader.result);
      if (!incoming || !Array.isArray(incoming.tasks) || typeof incoming.days !== "object") {
        alert("That file doesn't look like a Hub backup.");
        return;
      }
      if (confirm("Replace everything in Hub with this backup?")) {
        // Older backups may predate newer features — fill in the gaps.
        data = Storage.normalize(incoming);
        saveAndRender();
      }
    } catch {
      alert("Couldn't read that file — is it a Hub backup (.json)?");
    }
  };
  reader.readAsText(file);
}

/* ---------- tabs ---------- */

// One .page div is visible at a time; the bottom bar picks which.
function switchTab(name) {
  document.querySelectorAll(".page").forEach((p) => {
    p.classList.toggle("active", p.id === "page-" + name);
  });
  document.querySelectorAll(".tab-btn").forEach((b) => {
    const on = b.dataset.tab === name;
    b.classList.toggle("active", on);
    if (on) b.setAttribute("aria-current", "page");
    else b.removeAttribute("aria-current");
  });
  window.scrollTo(0, 0);
}

document.querySelectorAll(".tab-btn").forEach((b) => {
  b.onclick = () => switchTab(b.dataset.tab);
});

/* ---------- wiring & startup ---------- */

// Redraw every tab from `data`. At this size that's instant, and
// it means no tab can ever show stale information.
function render() {
  renderHeader();
  renderTodayReminders();
  renderMood();
  renderHabits();
  renderNote();
  renderTasks();
  renderWeek();
  renderRemindersPage();
  renderReminderBadge();
  renderHabitsPage();
}

$("#task-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("#new-task");
  const text = input.value.trim();
  if (!text) return;
  data.tasks.push({
    id: makeId(),
    text,
    done: false,
    createdDay: Storage.todayKey(),
    doneDay: null,
  });
  input.value = "";
  saveAndRender();
  input.focus(); // keep the flow going if you're adding several
});

// The note saves as you type (no redraw — that would steal your cursor).
$("#note").addEventListener("input", () => {
  todayRec().note = $("#note").value;
  Storage.save(data);
});
// When you leave the note, refresh the streak/week display.
$("#note").addEventListener("blur", render);

$("#goto-habits").addEventListener("click", () => switchTab("habits"));

$("#export").addEventListener("click", exportData);
$("#import").addEventListener("click", () => $("#import-file").click());
$("#import-file").addEventListener("change", (e) => {
  if (e.target.files[0]) importData(e.target.files[0]);
  e.target.value = ""; // allow re-importing the same file later
});

// If the tab stays open past midnight, roll over to the new day
// when you come back to it.
let renderedDay = Storage.todayKey();
window.addEventListener("focus", () => {
  if (Storage.todayKey() !== renderedDay) {
    renderedDay = Storage.todayKey();
    render();
  }
});

setupReminders();
setupHabits();
render();
