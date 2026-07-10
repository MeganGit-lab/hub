/* ============================================================
   Hub — habits.js (the Habits tab)

   A habit itself is tiny: { id, name, why }. The daily ticks
   live inside each day's record (days[key].habits[habitId]),
   so this tab is a window onto the same check-ins you do on
   Today — plus the place to add, rename, remove, and keep the
   "why" that reminds you what each habit is for.
   ============================================================ */

// How many days in a row this habit was ticked. Today not ticked
// yet doesn't break it (same forgiving rule as the main streak).
function habitStreak(habitId) {
  const d = new Date();
  const ticked = (date) => {
    const rec = data.days[Storage.dayKey(date)];
    return !!(rec && rec.habits && rec.habits[habitId]);
  };
  if (!ticked(d)) d.setDate(d.getDate() - 1);
  let streak = 0;
  while (ticked(d)) {
    streak += 1;
    d.setDate(d.getDate() - 1);
  }
  return streak;
}

function renderHabitsPage() {
  const list = $("#habit-manage");
  list.innerHTML = "";
  $("#habit-empty").hidden = data.habits.length > 0;

  data.habits.forEach((habit) => {
    const li = document.createElement("li");
    li.className = "habit-card";

    // Row 1: the name (edit it right in place) + remove button.
    const row = document.createElement("div");
    row.className = "row";

    const name = document.createElement("input");
    name.className = "h-name";
    name.value = habit.name;
    name.setAttribute("aria-label", "Habit name");
    name.onchange = () => {
      habit.name = name.value.trim() || habit.name;
      saveAndRender();
    };

    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "✕";
    del.setAttribute("aria-label", `Remove habit ${habit.name}`);
    del.onclick = () => {
      if (confirm(`Remove "${habit.name}" from your daily list?`)) {
        data.habits = data.habits.filter((x) => x.id !== habit.id);
        saveAndRender();
      }
    };

    row.append(name, del);

    // Row 2: your why — the sentence that talks you into it.
    const why = document.createElement("input");
    why.className = "h-why";
    why.value = habit.why || "";
    why.placeholder = "Why this matters to you… (optional)";
    why.setAttribute("aria-label", `Why ${habit.name} matters`);
    why.onchange = () => {
      habit.why = why.value.trim();
      Storage.save(data);
    };

    // Row 3: the last 7 days as dots, and the habit's own streak.
    const stats = document.createElement("div");
    stats.className = "h-stats";

    const dots = document.createElement("div");
    dots.className = "dots";
    dots.title = "The last 7 days";
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const rec = data.days[Storage.dayKey(d)];
      const dot = document.createElement("span");
      const filled = rec && rec.habits && rec.habits[habit.id];
      dot.className = "dot" + (filled ? " filled" : "");
      dots.appendChild(dot);
    }

    const streak = document.createElement("span");
    streak.className = "h-streak";
    const n = habitStreak(habit.id);
    streak.textContent = n > 0 ? `🔥 ${n} day${n === 1 ? "" : "s"}` : "no streak yet";

    stats.append(dots, streak);
    li.append(row, why, stats);
    list.appendChild(li);
  });

  renderCommitments();
}

/* ---------- my commitments ---------- */

// A commitment is { id, text, day } — `day` is when you made it,
// so each one quietly shows how long you've been keeping it.

// "2026-07-10" → "10 Jul" (adds the year once it isn't this year).
function shortDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  const opts = { month: "short", day: "numeric" };
  if (y !== new Date().getFullYear()) opts.year = "numeric";
  return new Date(y, m - 1, d).toLocaleDateString(undefined, opts);
}

function renderCommitments() {
  const list = $("#commit-list");
  list.innerHTML = "";
  $("#commit-empty").hidden = data.commitments.length > 0;

  data.commitments.forEach((c) => {
    const li = document.createElement("li");

    const mark = document.createElement("span");
    mark.className = "commit-mark";
    mark.textContent = "✦";

    const body = document.createElement("div");
    body.className = "commit-body";
    const text = document.createElement("span");
    text.className = "commit-text";
    text.textContent = c.text;
    body.appendChild(text);
    if (c.day) {
      const since = document.createElement("span");
      since.className = "commit-since";
      since.textContent = `since ${shortDate(c.day)}`;
      body.appendChild(since);
    }

    const del = document.createElement("button");
    del.className = "del";
    del.textContent = "✕";
    del.setAttribute("aria-label", `Remove commitment: ${c.text}`);
    del.onclick = () => {
      if (confirm(`Let go of "${c.text}"?`)) {
        data.commitments = data.commitments.filter((x) => x.id !== c.id);
        saveAndRender();
      }
    };

    li.append(mark, body, del);
    list.appendChild(li);
  });
}

/* ---------- wiring (called once, from app.js startup) ---------- */

function setupHabits() {
  $("#habit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#new-habit");
    const nm = input.value.trim();
    if (!nm) return;
    data.habits.push({ id: makeId(), name: nm, why: "" });
    input.value = "";
    saveAndRender();
    input.focus();
  });

  $("#commit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = $("#new-commit");
    const text = input.value.trim();
    if (!text) return;
    data.commitments.push({ id: makeId(), text, day: Storage.todayKey() });
    input.value = "";
    saveAndRender();
    input.focus();
  });
}
