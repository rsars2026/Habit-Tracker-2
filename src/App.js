import { useState, useEffect } from "react";

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #080808; }
    :root {
      --bg: #080808; --bg1: #111111; --bg2: #1a1a1a; --bg3: #222222;
      --border: #1f1f1f; --text: #f0ebe0; --muted: #444; --dim: #2a2a2a;
      --gold: #e8c547; --gold-dim: rgba(232,197,71,0.08); --gold-border: rgba(232,197,71,0.22);
      --green: #4caf7d; --green-dim: rgba(76,175,125,0.08);
      --red: #e05c5c; --red-dim: rgba(224,92,92,0.08);
      --blue: #5c9ee0;
      --mono: 'DM Mono', monospace; --display: 'Bebas Neue', sans-serif;
    }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: var(--dim); border-radius: 2px; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
    @keyframes pop { 0% { transform: scale(1); } 40% { transform: scale(1.18); } 100% { transform: scale(1); } }
    .fade-up { animation: fadeUp 0.35s ease both; }
    .pop { animation: pop 0.3s ease both; }
    .tab-nav {
      position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
      width: 100%; max-width: 430px; background: rgba(8,8,8,0.95);
      backdrop-filter: blur(12px); border-top: 1px solid var(--border);
      display: flex; z-index: 50; padding-bottom: env(safe-area-inset-bottom, 0px);
    }
    .tab-btn {
      flex: 1; display: flex; flex-direction: column; align-items: center;
      gap: 4px; padding: 10px 4px 12px; background: none; border: none; cursor: pointer;
      font-family: var(--mono); font-size: 9px; letter-spacing: 0.14em;
      color: var(--muted); text-transform: uppercase; transition: color 0.2s;
    }
    .tab-btn.active { color: var(--gold); }
    .tab-btn svg { transition: transform 0.2s; }
    .tab-btn.active svg { transform: translateY(-2px); }
    .habit-row {
      display: flex; align-items: center; gap: 14px; padding: 13px 0;
      border-bottom: 1px solid var(--border); cursor: pointer; user-select: none;
      transition: opacity 0.15s; animation: fadeUp 0.3s ease both;
    }
    .habit-row:last-child { border-bottom: none; }
    .habit-row:active { opacity: 0.55; }
    .check-box {
      width: 24px; height: 24px; border-radius: 6px; border: 1.5px solid var(--dim);
      flex-shrink: 0; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; background: transparent;
    }
    .check-box.done { background: var(--gold); border-color: var(--gold); animation: pop 0.25s ease; }
    .macro-bar-wrap { height: 5px; background: var(--bg2); border-radius: 3px; overflow: hidden; }
    .macro-bar-fill { height: 100%; border-radius: 3px; transition: width 0.5s ease; }
    .field {
      background: var(--bg1); border: 1.5px solid var(--border); color: var(--text);
      font-family: var(--mono); font-size: 13px; padding: 10px 13px; border-radius: 9px;
      width: 100%; outline: none; transition: border-color 0.2s;
    }
    .field:focus { border-color: var(--gold-border); }
    .field::placeholder { color: var(--muted); }
    .btn-primary {
      background: var(--gold); border: none; color: #080808; font-family: var(--mono);
      font-size: 11px; letter-spacing: 0.14em; font-weight: 500; padding: 13px 20px;
      border-radius: 9px; cursor: pointer; text-transform: uppercase; width: 100%;
      transition: opacity 0.2s;
    }
    .btn-primary:active { opacity: 0.75; }
    .btn-ghost {
      background: none; border: 1.5px solid var(--border); color: var(--text);
      font-family: var(--mono); font-size: 11px; letter-spacing: 0.12em; padding: 11px 20px;
      border-radius: 9px; cursor: pointer; text-transform: uppercase; width: 100%;
      transition: border-color 0.2s;
    }
    .btn-ghost:hover { border-color: var(--gold-border); }
    .ex-card {
      background: var(--bg1); border: 1px solid var(--border); border-radius: 12px;
      padding: 16px; display: flex; align-items: center; gap: 14px; margin-bottom: 10px;
      cursor: pointer; transition: border-color 0.2s, background 0.2s; animation: fadeUp 0.3s ease both;
    }
    .ex-card.done { background: var(--green-dim); border-color: rgba(76,175,125,0.25); }
    .ex-card:active { opacity: 0.65; }
    .stat-card { background: var(--bg1); border: 1px solid var(--border); border-radius: 12px; padding: 18px 16px; animation: fadeUp 0.3s ease both; }
    .pill { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-family: var(--mono); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; }
    .pill-gold { background: var(--gold-dim); color: var(--gold); border: 1px solid var(--gold-border); }
    .pill-green { background: var(--green-dim); color: var(--green); border: 1px solid rgba(76,175,125,0.25); }
    .ring-track { fill: none; stroke: var(--bg2); }
    .ring-fill { fill: none; stroke: var(--gold); stroke-linecap: round; transition: stroke-dashoffset 0.6s ease; }
    .overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.88); z-index: 80;
      display: flex; align-items: flex-end; animation: fadeUp 0.2s ease;
    }
    .sheet {
      background: var(--bg1); width: 100%; max-width: 430px; margin: 0 auto;
      border-radius: 20px 20px 0 0; border-top: 1px solid var(--border); padding: 28px 24px 40px;
    }
  `}</style>
);

const WORKOUTS = [
  { day: "Mon", label: "PUSH", emoji: "💪", exercises: [
    { name: "Push-Ups", sets: 3, reps: "12", rest: "60s" },
    { name: "Pike Push-Ups", sets: 3, reps: "10", rest: "60s" },
    { name: "Tricep Dips", sets: 3, reps: "12", rest: "60s" },
    { name: "Shoulder Taps", sets: 3, reps: "20", rest: "45s" },
    { name: "Diamond Push-Ups", sets: 3, reps: "8", rest: "60s" },
  ]},
  { day: "Tue", label: "STRETCH", emoji: "🧘", exercises: [
    { name: "Hip Flexor Stretch", sets: 2, reps: "45s each", rest: "30s" },
    { name: "Hamstring Stretch", sets: 2, reps: "45s each", rest: "30s" },
    { name: "Cat-Cow", sets: 3, reps: "10", rest: "20s" },
    { name: "Child's Pose", sets: 2, reps: "60s", rest: "30s" },
    { name: "Spinal Twist", sets: 2, reps: "45s each", rest: "30s" },
  ]},
  { day: "Wed", label: "PULL", emoji: "🏋️", exercises: [
    { name: "Inverted Rows", sets: 3, reps: "10", rest: "60s" },
    { name: "Superman Hold", sets: 3, reps: "30s", rest: "45s" },
    { name: "Resistance Band Rows", sets: 3, reps: "15", rest: "60s" },
    { name: "Rear Delt Flys", sets: 3, reps: "12", rest: "60s" },
    { name: "Face Pulls", sets: 3, reps: "15", rest: "45s" },
  ]},
  { day: "Thu", label: "REST", emoji: "😴", exercises: [
    { name: "10 min Walk", sets: 1, reps: "10 min", rest: "—" },
    { name: "Neck Rolls", sets: 2, reps: "10 each", rest: "20s" },
    { name: "Wrist Circles", sets: 2, reps: "15 each", rest: "20s" },
    { name: "Box Breathing", sets: 4, reps: "4-4-4-4s", rest: "—" },
  ]},
  { day: "Fri", label: "LEGS", emoji: "🦵", exercises: [
    { name: "Bodyweight Squats", sets: 4, reps: "15", rest: "60s" },
    { name: "Reverse Lunges", sets: 3, reps: "10 each", rest: "60s" },
    { name: "Glute Bridges", sets: 3, reps: "20", rest: "45s" },
    { name: "Calf Raises", sets: 3, reps: "25", rest: "45s" },
    { name: "Wall Sit", sets: 3, reps: "45s", rest: "60s" },
  ]},
  { day: "Sat", label: "CORE", emoji: "🔥", exercises: [
    { name: "Plank", sets: 3, reps: "45s", rest: "45s" },
    { name: "Dead Bug", sets: 3, reps: "10 each", rest: "45s" },
    { name: "Bicycle Crunches", sets: 3, reps: "20", rest: "45s" },
    { name: "Mountain Climbers", sets: 3, reps: "30s", rest: "45s" },
    { name: "Hollow Body Hold", sets: 3, reps: "30s", rest: "45s" },
  ]},
  { day: "Sun", label: "RECOVER", emoji: "🌿", exercises: [
    { name: "Full Body Stretch", sets: 1, reps: "10 min", rest: "—" },
    { name: "Pigeon Pose", sets: 2, reps: "60s each", rest: "30s" },
    { name: "Chest Opener", sets: 2, reps: "45s", rest: "30s" },
    { name: "Quad Stretch", sets: 2, reps: "45s each", rest: "30s" },
  ]},
];

const QUOTES = [
  "Show up. That's 80% of it.",
  "Discipline is freedom.",
  "One rep at a time.",
  "The only bad workout is the one you skipped.",
  "Small steps. Big changes.",
  "Future you is watching.",
  "Earn it.",
  "It compounds.",
];

const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const todayKey = () => new Date().toISOString().split("T")[0];

const useLocal = (key, init) => {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; }
    catch { return init; }
  });
  const save = (v) => { setVal(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };
  return [val, save];
};

const Ring = ({ pct, size = 80, stroke = 6, children }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(pct, 1));
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle className="ring-track" cx={size/2} cy={size/2} r={r} strokeWidth={stroke} />
        <circle className="ring-fill" cx={size/2} cy={size/2} r={r} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {children}
      </div>
    </div>
  );
};

const WeightChart = ({ entries }) => {
  if (entries.length < 2) return null;
  const vals = entries.map(e => e.w);
  const min = Math.min(...vals) - 1;
  const max = Math.max(...vals) + 1;
  const W = 280, H = 60;
  const pts = entries.map((e, i) => {
    const x = (i / (entries.length - 1)) * W;
    const y = H - ((e.w - min) / (max - min)) * H;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <polyline points={pts} fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {entries.map((e, i) => {
        const x = (i / (entries.length - 1)) * W;
        const y = H - ((e.w - min) / (max - min)) * H;
        return <circle key={i} cx={x} cy={y} r="3" fill="var(--gold)" />;
      })}
    </svg>
  );
};

const DailyTab = ({ habits, toggleHabit, weight, setWeightSheet }) => {
  const today = new Date();
  const todayWI = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const done = Object.values(habits).filter(Boolean).length;
  const total = 8;
  const pct = done / total;
  const quote = QUOTES[today.getDate() % QUOTES.length];
  const HABIT_LIST = [
    { key: "workout",  icon: "🏋️", label: "Workout / Run",   sub: WORKOUTS[todayWI].label },
    { key: "steps",    icon: "👟", label: "10K Steps",        sub: "Daily movement goal" },
    { key: "bible",    icon: "📖", label: "Bible",            sub: "Read today" },
    { key: "pray",     icon: "🙏", label: "Pray",             sub: "Morning or night" },
    { key: "3sec",     icon: "❤️", label: "3 Seconds",        sub: "Kiss, hug or close moment" },
    { key: "alcohol",  icon: "🚫", label: "Alcohol-Free Day", sub: "No drinks today" },
    { key: "worktrip", icon: "✈️", label: "Work Trip",        sub: "Travel day" },
    { key: "weight",   icon: "⚖️", label: "Weight Logged",    sub: weight ? `${weight} kg` : "Tap to log" },
  ];
  return (
    <div style={{ padding: "52px 20px 100px" }}>
      <div style={{ marginBottom: "24px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase", marginBottom: "4px" }}>
          {today.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}
        </div>
        <div style={{ fontFamily: "var(--display)", fontSize: "44px", letterSpacing: "0.04em", lineHeight: 1, color: "var(--text)" }}>
          Daily Check-In
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "20px", background: "var(--bg1)", border: "1px solid var(--border)", borderRadius: "14px", padding: "18px 20px", marginBottom: "24px" }}>
        <Ring pct={pct} size={72} stroke={5}>
          <span style={{ fontFamily: "var(--display)", fontSize: "22px", color: pct === 1 ? "var(--gold)" : "var(--text)" }}>
            {Math.round(pct * 100)}
          </span>
        </Ring>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.15em", color: "var(--muted)", textTransform: "uppercase", marginBottom: "4px" }}>
            {done}/{total} complete
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "#666", fontStyle: "italic", lineHeight: 1.5 }}>
            "{quote}"
          </div>
          {pct >= 0.25 && (
            <div style={{ marginTop: "8px" }}>
              <span className="pill pill-green">✓ 25% unlocked</span>
            </div>
          )}
        </div>
      </div>
      <div style={{ background: "var(--bg1)", border: "1px solid var(--border)", borderRadius: "14px", padding: "4px 16px" }}>
        {HABIT_LIST.map((h, i) => (
          <div key={h.key} className="habit-row" style={{ animationDelay: `${i * 0.04}s` }}
            onClick={() => h.key === "weight" ? setWeightSheet(true) : toggleHabit(h.key)}>
            <div className={`check-box ${habits[h.key] ? "done" : ""}`}>
              {habits[h.key] && (
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                  <path d="M1 4.5L4 7.5L11 1" stroke="#080808" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div style={{ fontSize: "18px", lineHeight: 1, flexShrink: 0 }}>{h.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "13px", color: habits[h.key] ? "var(--muted)" : "var(--text)", textDecoration: habits[h.key] ? "line-through" : "none", transition: "all 0.2s", marginBottom: "2px" }}>{h.label}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--dim)", letterSpacing: "0.1em" }}>{h.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WorkoutsTab = () => {
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const [selectedDay, setSelectedDay] = useState(todayIdx);
  const [checked, setChecked] = useLocal("workout_checks_" + todayKey(), {});
  const [celebrate, setCelebrate] = useState(false);
  const w = WORKOUTS[selectedDay];
  const isToday = selectedDay === todayIdx;
  const done = w.exercises.filter((_, i) => checked[`${selectedDay}_${i}`]).length;
  const pct = done / w.exercises.length;
  const toggle = (i) => {
    const key = `${selectedDay}_${i}`;
    const next = { ...checked, [key]: !checked[key] };
    setChecked(next);
    const allDone = w.exercises.every((_, j) => next[`${selectedDay}_${j}`]);
    if (allDone) { setCelebrate(true); setTimeout(() => setCelebrate(false), 2500); }
  };
  return (
    <div style={{ padding: "52px 20px 100px" }}>
      {celebrate && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", zIndex: 90, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "64px" }}>🏆</div>
          <div style={{ fontFamily: "var(--display)", fontSize: "52px", color: "var(--gold)", letterSpacing: "0.06em" }}>DONE.</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--muted)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Workout complete</div>
        </div>
      )}
      <div style={{ fontFamily: "var(--display)", fontSize: "44px", letterSpacing: "0.04em", marginBottom: "20px", color: "var(--text)" }}>
        {w.emoji} {w.label}
      </div>
      <div style={{ display: "flex", gap: "6px", overflowX: "auto", paddingBottom: "4px", marginBottom: "20px" }}>
        {WORKOUTS.map((wk, i) => (
          <button key={i} onClick={() => setSelectedDay(i)} style={{
            background: selectedDay === i ? "var(--gold)" : "var(--bg1)",
            border: `1px solid ${selectedDay === i ? "var(--gold)" : "var(--border)"}`,
            color: selectedDay === i ? "#080808" : i === todayIdx ? "var(--gold)" : "var(--muted)",
            fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: "0.14em", textTransform: "uppercase",
            padding: "7px 12px", borderRadius: "20px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
          }}>{wk.day}</button>
        ))}
      </div>
      <div style={{ background: "var(--bg1)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 16px", marginBottom: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.15em", color: "var(--muted)", textTransform: "uppercase" }}>Progress</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: pct === 1 ? "var(--gold)" : "var(--muted)" }}>{done}/{w.exercises.length}</span>
        </div>
        <div className="macro-bar-wrap">
          <div className="macro-bar-fill" style={{ width: `${pct * 100}%`, background: pct === 1 ? "var(--green)" : "var(--gold)" }} />
        </div>
      </div>
      {w.exercises.map((ex, i) => {
        const k = `${selectedDay}_${i}`;
        return (
          <div key={i} className={`ex-card ${checked[k] ? "done" : ""}`} style={{ animationDelay: `${i * 0.05}s` }} onClick={() => isToday && toggle(i)}>
            <div className={`check-box ${checked[k] ? "done" : ""}`} style={{ background: checked[k] ? "var(--green)" : "transparent", borderColor: checked[k] ? "var(--green)" : "var(--dim)" }}>
              {checked[k] && (
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                  <path d="M1 4.5L4 7.5L11 1" stroke="#080808" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "var(--mono)", fontSize: "13px", color: checked[k] ? "var(--muted)" : "var(--text)", textDecoration: checked[k] ? "line-through" : "none", marginBottom: "3px" }}>{ex.name}</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--dim)", letterSpacing: "0.1em" }}>{ex.sets} sets · {ex.reps} · {ex.rest} rest</div>
            </div>
          </div>
        );
      })}
      {!isToday && (
        <div style={{ textAlign: "center", fontFamily: "var(--mono)", fontSize: "10px", color: "var(--muted)", letterSpacing: "0.12em", marginTop: "12px" }}>
          Viewing {w.day} — come back on the day to check off
        </div>
      )}
    </div>
  );
};

const MACRO_GOALS = { cal: 2200, protein: 160, carbs: 220, fat: 70 };

const FoodTab = () => {
  const [meals, setMeals] = useLocal("meals_" + todayKey(), []);
  const [sheet, setSheet] = useState(false);
  const [form, setForm] = useState({ name: "", cal: "", protein: "", carbs: "", fat: "" });
  const totals = meals.reduce((acc, m) => ({
    cal: acc.cal + (Number(m.cal) || 0),
    protein: acc.protein + (Number(m.protein) || 0),
    carbs: acc.carbs + (Number(m.carbs) || 0),
    fat: acc.fat + (Number(m.fat) || 0),
  }), { cal: 0, protein: 0, carbs: 0, fat: 0 });
  const addMeal = () => {
    if (!form.name) return;
    setMeals([...meals, { ...form, id: Date.now() }]);
    setForm({ name: "", cal: "", protein: "", carbs: "", fat: "" });
    setSheet(false);
  };
  const removeMeal = (id) => setMeals(meals.filter(m => m.id !== id));
  const MacroRow = ({ label, val, goal, color }) => (
    <div style={{ marginBottom: "14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.14em", color: "var(--muted)", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: val >= goal ? "var(--green)" : "var(--text)" }}>
          {val}<span style={{ color: "var(--muted)" }}>/{goal}{label === "Calories" ? "" : "g"}</span>
        </span>
      </div>
      <div className="macro-bar-wrap">
        <div className="macro-bar-fill" style={{ width: `${Math.min((val / goal) * 100, 100)}%`, background: color }} />
      </div>
    </div>
  );
  return (
    <div style={{ padding: "52px 20px 100px" }}>
      {sheet && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setSheet(false)}>
          <div className="sheet">
            <div style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase", marginBottom: "20px" }}>Log a meal</div>
            {[
              { key: "name", label: "Meal name", placeholder: "e.g. Chicken & rice" },
              { key: "cal", label: "Calories", placeholder: "kcal" },
              { key: "protein", label: "Protein (g)", placeholder: "g" },
              { key: "carbs", label: "Carbs (g)", placeholder: "g" },
              { key: "fat", label: "Fat (g)", placeholder: "g" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: "12px" }}>
                <label style={{ fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: "0.16em", color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: "6px" }}>{f.label}</label>
                <input className="field" placeholder={f.placeholder} value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
              </div>
            ))}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button className="btn-ghost" onClick={() => setSheet(false)}>Cancel</button>
              <button className="btn-primary" onClick={addMeal}>Add Meal</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ fontFamily: "var(--display)", fontSize: "44px", letterSpacing: "0.04em", marginBottom: "20px", color: "var(--text)" }}>🥗 Nutrition</div>
      <div style={{ background: "var(--bg1)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", marginBottom: "20px" }}>
        <MacroRow label="Calories" val={totals.cal} goal={MACRO_GOALS.cal} color="var(--gold)" />
        <MacroRow label="Protein" val={totals.protein} goal={MACRO_GOALS.protein} color="#5c9ee0" />
        <MacroRow label="Carbs" val={totals.carbs} goal={MACRO_GOALS.carbs} color="#4caf7d" />
        <MacroRow label="Fat" val={totals.fat} goal={MACRO_GOALS.fat} color="#e07a5c" />
      </div>
      {meals.length > 0 && (
        <div style={{ marginBottom: "16px" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase", marginBottom: "10px" }}>Today's meals</div>
          {meals.map((m, i) => (
            <div key={m.id} style={{ background: "var(--bg1)", border: "1px solid var(--border)", borderRadius: "12px", padding: "14px 16px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "12px", animation: "fadeUp 0.3s ease both", animationDelay: `${i * 0.05}s` }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--mono)", fontSize: "13px", color: "var(--text)", marginBottom: "4px" }}>{m.name}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: "9px", color: "var(--muted)", letterSpacing: "0.1em" }}>
                  {m.cal ? `${m.cal} kcal` : ""}{m.protein ? ` · P:${m.protein}g` : ""}{m.carbs ? ` · C:${m.carbs}g` : ""}{m.fat ? ` · F:${m.fat}g` : ""}
                </div>
              </div>
              <button onClick={() => removeMeal(m.id)} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: "16px", padding: "4px" }}>×</button>
            </div>
          ))}
        </div>
      )}
      <button className="btn-primary" onClick={() => setSheet(true)}>+ Log Meal</button>
    </div>
  );
};

const StatsTab = ({ streak, weightLog }) => {
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return { label: DAYS_SHORT[d.getDay()], done: Math.random() > 0.35 };
  });
  weekDays[6].done = streak > 0;
  return (
    <div style={{ padding: "52px 20px 100px" }}>
      <div style={{ fontFamily: "var(--display)", fontSize: "44px", letterSpacing: "0.04em", marginBottom: "20px", color: "var(--text)" }}>📊 Stats</div>
      <div style={{ background: "var(--bg1)", border: "1px solid var(--gold-border)", borderRadius: "14px", padding: "20px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "20px" }}>
        <Ring pct={Math.min(streak / 30, 1)} size={80} stroke={6}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--display)", fontSize: "26px", color: "var(--gold)", lineHeight: 1 }}>{streak}</div>
          </div>
        </Ring>
        <div>
          <div style={{ fontFamily: "var(--display)", fontSize: "28px", color: "var(--text)", lineHeight: 1, marginBottom: "4px" }}>Day Streak</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--muted)", letterSpacing: "0.12em" }}>
            {streak >= 7 ? "🔥 On fire — keep going" : streak >= 3 ? "💪 Building momentum" : "Get the chain going"}
          </div>
          <div style={{ marginTop: "8px" }}>
            <span className="pill pill-gold">{streak >= 30 ? "30+ day legend" : `${30 - streak} days to 30`}</span>
          </div>
        </div>
      </div>
      <div className="stat-card" style={{ marginBottom: "16px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase", marginBottom: "16px" }}>This week</div>
        <div style={{ display: "flex", gap: "6px", justifyContent: "space-between" }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: d.done ? "var(--gold-dim)" : "var(--bg2)", border: `1px solid ${d.done ? "var(--gold-border)" : "var(--border)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                {d.done ? "✓" : ""}
              </div>
              <span style={{ fontFamily: "var(--mono)", fontSize: "8px", letterSpacing: "0.1em", color: "var(--muted)" }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="stat-card" style={{ marginBottom: "16px" }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase", marginBottom: "12px" }}>Weight trend</div>
        {weightLog.length >= 2 ? (
          <>
            <WeightChart entries={weightLog.slice(-14)} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "12px" }}>
              {[
                { label: "Current", val: `${weightLog[weightLog.length - 1]?.w} kg` },
                { label: "7d change", val: weightLog.length >= 7 ? `${(weightLog[weightLog.length-1]?.w - weightLog[weightLog.length-7]?.w).toFixed(1)} kg` : "—" },
                { label: "Logged days", val: weightLog.length },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--display)", fontSize: "22px", color: "var(--gold)", lineHeight: 1, marginBottom: "3px" }}>{s.val}</div>
                  <div style={{ fontFamily: "var(--mono)", fontSize: "8px", letterSpacing: "0.12em", color: "var(--muted)", textTransform: "uppercase" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--muted)", textAlign: "center", padding: "20px 0" }}>
            Log weight on the Daily tab to see your trend
          </div>
        )}
      </div>
      <div className="stat-card">
        <div style={{ fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase", marginBottom: "16px" }}>Habit breakdown</div>
        {[
          { label: "Workout", pct: 0.71 }, { label: "Steps", pct: 0.57 },
          { label: "Bible", pct: 0.86 }, { label: "Pray", pct: 0.9 },
          { label: "3 Seconds", pct: 0.95 }, { label: "Alcohol-Free", pct: 0.85 },
        ].map((h, i) => (
          <div key={i} style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--text)", letterSpacing: "0.08em" }}>{h.label}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: h.pct >= 0.8 ? "var(--green)" : "var(--muted)" }}>{Math.round(h.pct * 100)}%</span>
            </div>
            <div className="macro-bar-wrap">
              <div className="macro-bar-fill" style={{ width: `${h.pct * 100}%`, background: h.pct >= 0.8 ? "var(--green)" : "var(--gold)" }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function App() {
  const [tab, setTab] = useState("daily");
  const [habits, setHabits] = useLocal("habits_" + todayKey(), {});
  const [weightLog, setWeightLog] = useLocal("weight_log", []);
  const [weightSheet, setWeightSheet] = useState(false);
  const [weightInput, setWeightInput] = useState("");
  const [streak, setStreak] = useLocal("streak", 0);
  const todayWeight = weightLog.find(e => e.d === todayKey())?.w;
  const toggleHabit = (key) => { setHabits({ ...habits, [key]: !habits[key] }); };
  const logWeight = () => {
    const w = parseFloat(weightInput);
    if (!w) return;
    const existing = weightLog.filter(e => e.d !== todayKey());
    setWeightLog([...existing, { d: todayKey(), w }].sort((a, b) => a.d.localeCompare(b.d)));
    setHabits({ ...habits, weight: true });
    setWeightInput("");
    setWeightSheet(false);
  };
  const TABS = [
    { key: "daily", label: "Daily", icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--gold)" : "var(--muted)"} strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
        <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
      </svg>
    )},
    { key: "workouts", label: "Workout", icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--gold)" : "var(--muted)"} strokeWidth="1.8" strokeLinecap="round">
        <path d="M6 4v16M18 4v16M3 9h3M18 9h3M3 15h3M18 15h3M6 9h12M6 15h12"/>
      </svg>
    )},
    { key: "food", label: "Food", icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--gold)" : "var(--muted)"} strokeWidth="1.8" strokeLinecap="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    )},
    { key: "stats", label: "Stats", icon: (active) => (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={active ? "var(--gold)" : "var(--muted)"} strokeWidth="1.8" strokeLinecap="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    )},
  ];
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", maxWidth: "430px", margin: "0 auto", position: "relative" }}>
      <GlobalStyles />
      {weightSheet && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setWeightSheet(false)}>
          <div className="sheet">
            <div style={{ fontFamily: "var(--mono)", fontSize: "10px", letterSpacing: "0.2em", color: "var(--muted)", textTransform: "uppercase", marginBottom: "8px" }}>Log weight</div>
            {todayWeight && (
              <div style={{ fontFamily: "var(--mono)", fontSize: "11px", color: "var(--muted)", marginBottom: "16px" }}>Today: {todayWeight} kg</div>
            )}
            <label style={{ fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: "0.16em", color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>Weight (kg)</label>
            <input className="field" type="number" placeholder="e.g. 83.5" value={weightInput}
              onChange={e => setWeightInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && logWeight()}
              style={{ marginBottom: "16px" }} />
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-ghost" onClick={() => setWeightSheet(false)}>Cancel</button>
              <button className="btn-primary" onClick={logWeight}>Save</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ overflowY: "auto", height: "100vh" }}>
        {tab === "daily"    && <DailyTab habits={habits} toggleHabit={toggleHabit} weight={todayWeight} setWeightSheet={setWeightSheet} />}
        {tab === "workouts" && <WorkoutsTab />}
        {tab === "food"     && <FoodTab />}
        {tab === "stats"    && <StatsTab streak={streak} weightLog={weightLog} />}
      </div>
      <nav className="tab-nav">
        {TABS.map(t => (
          <button key={t.key} className={`tab-btn ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
            {t.icon(tab === t.key)}
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}