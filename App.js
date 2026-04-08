import { useState, useEffect, useRef } from "react";

// ─── UTILS ────────────────────────────────────────────────────────────────────
const todayKey = () => new Date().toISOString().split("T")[0];

const useLocal = (key, init) => {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : (typeof init === "function" ? init() : init); }
    catch { return typeof init === "function" ? init() : init; }
  });
  const save = (v) => {
    const next = typeof v === "function" ? v(val) : v;
    setVal(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };
  return [val, save];
};

const DAYS_LONG  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS     = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const QUOTES = [
  "Show up. That's 80% of it.",
  "Discipline is freedom.",
  "One rep at a time.",
  "The only bad workout is the one you skipped.",
  "Small steps. Big changes.",
  "Future you is watching.",
  "Earn it. Every day.",
  "It compounds.",
  "Progress, not perfection.",
  "Be the person your future self needs today.",
];

// ─── WORKOUTS ─────────────────────────────────────────────────────────────────
const WORKOUTS = [
  { day: "Mon", label: "Push", emoji: "💪", color: "#FF6B35", exercises: [
    { name: "Push-Ups",         sets: 3, reps: "12",      rest: "60s" },
    { name: "Pike Push-Ups",    sets: 3, reps: "10",      rest: "60s" },
    { name: "Tricep Dips",      sets: 3, reps: "12",      rest: "60s" },
    { name: "Shoulder Taps",    sets: 3, reps: "20",      rest: "45s" },
    { name: "Diamond Push-Ups", sets: 3, reps: "8",       rest: "60s" },
  ]},
  { day: "Tue", label: "Stretch", emoji: "🧘", color: "#5AC8FA", exercises: [
    { name: "Hip Flexor Stretch", sets: 2, reps: "45s ea", rest: "30s" },
    { name: "Hamstring Stretch",  sets: 2, reps: "45s ea", rest: "30s" },
    { name: "Cat-Cow",            sets: 3, reps: "10",     rest: "20s" },
    { name: "Child's Pose",       sets: 2, reps: "60s",    rest: "30s" },
    { name: "Spinal Twist",       sets: 2, reps: "45s ea", rest: "30s" },
  ]},
  { day: "Wed", label: "Pull", emoji: "🏋️", color: "#30D158", exercises: [
    { name: "Inverted Rows",       sets: 3, reps: "10",    rest: "60s" },
    { name: "Superman Hold",       sets: 3, reps: "30s",   rest: "45s" },
    { name: "Resistance Band Rows",sets: 3, reps: "15",    rest: "60s" },
    { name: "Rear Delt Flys",      sets: 3, reps: "12",    rest: "60s" },
    { name: "Face Pulls",          sets: 3, reps: "15",    rest: "45s" },
  ]},
  { day: "Thu", label: "Rest", emoji: "😴", color: "#BF5AF2", exercises: [
    { name: "10 min Walk",  sets: 1, reps: "10 min",   rest: "—" },
    { name: "Neck Rolls",   sets: 2, reps: "10 each",  rest: "20s" },
    { name: "Wrist Circles",sets: 2, reps: "15 each",  rest: "20s" },
    { name: "Box Breathing",sets: 4, reps: "4-4-4-4s", rest: "—" },
  ]},
  { day: "Fri", label: "Legs", emoji: "🦵", color: "#FF9F0A", exercises: [
    { name: "Bodyweight Squats", sets: 4, reps: "15",     rest: "60s" },
    { name: "Reverse Lunges",    sets: 3, reps: "10 each",rest: "60s" },
    { name: "Glute Bridges",     sets: 3, reps: "20",     rest: "45s" },
    { name: "Calf Raises",       sets: 3, reps: "25",     rest: "45s" },
    { name: "Wall Sit",          sets: 3, reps: "45s",    rest: "60s" },
  ]},
  { day: "Sat", label: "Core", emoji: "🔥", color: "#FF375F", exercises: [
    { name: "Plank",             sets: 3, reps: "45s",    rest: "45s" },
    { name: "Dead Bug",          sets: 3, reps: "10 each",rest: "45s" },
    { name: "Bicycle Crunches",  sets: 3, reps: "20",     rest: "45s" },
    { name: "Mountain Climbers", sets: 3, reps: "30s",    rest: "45s" },
    { name: "Hollow Body Hold",  sets: 3, reps: "30s",    rest: "45s" },
  ]},
  { day: "Sun", label: "Recover", emoji: "🌿", color: "#34C759", exercises: [
    { name: "Full Body Stretch", sets: 1, reps: "10 min",  rest: "—" },
    { name: "Pigeon Pose",       sets: 2, reps: "60s each",rest: "30s" },
    { name: "Chest Opener",      sets: 2, reps: "45s",     rest: "30s" },
    { name: "Quad Stretch",      sets: 2, reps: "45s each",rest: "30s" },
  ]},
];

const MACRO_GOALS = { cal: 2200, protein: 160, carbs: 220, fat: 70 };

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    :root {
      --bg:          #000000;
      --bg1:         #1C1C1E;
      --bg2:         #2C2C2E;
      --bg3:         #3A3A3C;
      --separator:   rgba(84,84,88,0.65);
      --label:       #FFFFFF;
      --label2:      rgba(235,235,245,0.6);
      --label3:      rgba(235,235,245,0.3);
      --label4:      rgba(235,235,245,0.18);
      --blue:        #0A84FF;
      --green:       #30D158;
      --orange:      #FF9F0A;
      --red:         #FF375F;
      --purple:      #BF5AF2;
      --teal:        #5AC8FA;
      --fill:        rgba(120,120,128,0.36);
      --fill2:       rgba(120,120,128,0.32);
      --fill3:       rgba(118,118,128,0.24);
      --fill4:       rgba(116,116,128,0.18);
      --sys-font:    -apple-system, 'SF Pro Display', 'SF Pro Text', BlinkMacSystemFont, system-ui, sans-serif;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { height: 100%; background: #000; }
    body {
      font-family: var(--sys-font);
      background: var(--bg);
      color: var(--label);
      height: 100%;
      overscroll-behavior: none;
      -webkit-tap-highlight-color: transparent;
      -webkit-font-smoothing: antialiased;
    }
    #root { height: 100%; }

    /* scrollbars */
    ::-webkit-scrollbar { width: 0; }

    /* animations */
    @keyframes fadeUp   { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
    @keyframes fadeIn   { from { opacity:0 } to { opacity:1 } }
    @keyframes scaleIn  { from { opacity:0; transform:scale(0.92) } to { opacity:1; transform:scale(1) } }
    @keyframes pop      { 0%{transform:scale(1)} 45%{transform:scale(1.22)} 100%{transform:scale(1)} }
    @keyframes shimmer  { from{background-position:200% 0} to{background-position:-200% 0} }
    @keyframes slideUp  { from{transform:translateY(100%)} to{transform:translateY(0)} }

    .fade-up  { animation: fadeUp  0.38s cubic-bezier(.22,1,.36,1) both; }
    .scale-in { animation: scaleIn 0.32s cubic-bezier(.22,1,.36,1) both; }

    /* iOS grouped table */
    .ios-section {
      background: var(--bg1);
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 20px;
    }
    .ios-row {
      display: flex;
      align-items: center;
      min-height: 50px;
      padding: 10px 16px;
      gap: 12px;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
      transition: background 0.15s;
      position: relative;
    }
    .ios-row:active { background: var(--fill3); }
    .ios-row + .ios-row::before {
      content: '';
      position: absolute;
      top: 0; left: 56px; right: 0;
      height: 0.5px;
      background: var(--separator);
    }

    /* checkmark */
    .ios-check {
      width: 28px; height: 28px; border-radius: 50%;
      border: 2px solid var(--bg3);
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; transition: all 0.2s cubic-bezier(.22,1,.36,1);
      background: transparent;
    }
    .ios-check.done {
      background: var(--green);
      border-color: var(--green);
      animation: pop 0.28s cubic-bezier(.22,1,.36,1);
    }

    /* icon badge */
    .icon-badge {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      font-size: 17px; flex-shrink: 0;
    }

    /* progress bar */
    .prog-track { height: 4px; background: var(--fill3); border-radius: 2px; overflow: hidden; }
    .prog-fill  { height: 100%; border-radius: 2px; transition: width 0.5s cubic-bezier(.22,1,.36,1); }

    /* inputs */
    .ios-input {
      background: var(--bg1);
      border: none;
      border-radius: 12px;
      color: var(--label);
      font-family: var(--sys-font);
      font-size: 17px;
      padding: 13px 16px;
      width: 100%;
      outline: none;
      -webkit-appearance: none;
    }
    .ios-input::placeholder { color: var(--label3); }
    .ios-input:focus { box-shadow: 0 0 0 3px rgba(10,132,255,0.35); }

    /* buttons */
    .btn-blue {
      background: var(--blue);
      border: none; border-radius: 14px;
      color: #fff; font-family: var(--sys-font);
      font-size: 17px; font-weight: 600;
      padding: 14px; width: 100%; cursor: pointer;
      transition: opacity 0.15s, transform 0.1s;
      -webkit-tap-highlight-color: transparent;
    }
    .btn-blue:active { opacity: 0.8; transform: scale(0.98); }

    .btn-text {
      background: none; border: none;
      color: var(--blue); font-family: var(--sys-font);
      font-size: 17px; cursor: pointer; padding: 8px;
    }

    /* pill / badge */
    .badge {
      display: inline-flex; align-items: center; gap: 4px;
      padding: 3px 10px; border-radius: 20px;
      font-size: 12px; font-weight: 600; letter-spacing: 0.02em;
    }

    /* sheet */
    .sheet-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(4px);
      z-index: 200;
      display: flex; align-items: flex-end;
      animation: fadeIn 0.2s ease;
    }
    .sheet-panel {
      background: var(--bg1);
      width: 100%; border-radius: 20px 20px 0 0;
      padding: 12px 20px max(env(safe-area-inset-bottom,20px),20px);
      animation: slideUp 0.38s cubic-bezier(.22,1,.36,1);
    }
    .sheet-handle {
      width: 36px; height: 5px; border-radius: 3px;
      background: var(--fill2); margin: 0 auto 20px;
    }

    /* bottom tab bar */
    .tab-bar {
      position: fixed;
      bottom: 0; left: 50%; transform: translateX(-50%);
      width: 100%; max-width: 430px;
      background: rgba(28,28,30,0.92);
      backdrop-filter: blur(24px) saturate(180%);
      -webkit-backdrop-filter: blur(24px) saturate(180%);
      border-top: 0.5px solid var(--separator);
      display: flex;
      padding-bottom: env(safe-area-inset-bottom, 0px);
      z-index: 100;
    }
    .tab-item {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; gap: 3px;
      padding: 10px 4px 8px;
      cursor: pointer; background: none; border: none;
      -webkit-tap-highlight-color: transparent;
      transition: opacity 0.1s;
    }
    .tab-item:active { opacity: 0.6; }
    .tab-label {
      font-size: 10px; font-weight: 500; letter-spacing: 0.02em;
    }

    /* ring svg */
    .ring-track { fill: none; stroke: var(--fill3); }
    .ring-fill  { fill: none; stroke-linecap: round; transition: stroke-dashoffset 0.6s cubic-bezier(.22,1,.36,1); }

    /* stat widget */
    .widget {
      background: var(--bg1);
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .widget-title {
      font-size: 13px; font-weight: 600;
      color: var(--label2); text-transform: uppercase;
      letter-spacing: 0.06em; margin-bottom: 10px;
    }

    /* day dot */
    .day-dot {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 600;
      transition: all 0.2s;
    }

    /* celebrate */
    .celebrate-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.88);
      z-index: 300;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; gap: 12px;
      animation: fadeIn 0.2s ease;
    }

    /* section header label */
    .section-label {
      font-size: 13px; font-weight: 600;
      color: var(--label2); text-transform: uppercase;
      letter-spacing: 0.06em;
      padding: 0 4px; margin-bottom: 6px; margin-top: 22px;
    }
    .section-label:first-child { margin-top: 0; }

    /* weight chart */
    .chart-line { fill: none; stroke: var(--blue); stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
    .chart-dot  { fill: var(--blue); }
    .chart-area { fill: url(#chartGrad); }
  `}</style>
);

// ─── RING ─────────────────────────────────────────────────────────────────────
const Ring = ({ pct, size = 76, stroke = 5.5, color = "#30D158", children }) => {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(Math.max(pct, 0), 1));
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle className="ring-track" cx={size/2} cy={size/2} r={r} strokeWidth={stroke} />
        <circle className="ring-fill" cx={size/2} cy={size/2} r={r} strokeWidth={stroke}
          stroke={color} strokeDasharray={circ} strokeDashoffset={offset} />
      </svg>
      <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column" }}>
        {children}
      </div>
    </div>
  );
};

// ─── WEIGHT CHART ─────────────────────────────────────────────────────────────
const WeightChart = ({ entries }) => {
  if (entries.length < 2) return null;
  const W = 300, H = 72;
  const vals = entries.map(e => e.w);
  const min = Math.min(...vals) - 0.5;
  const max = Math.max(...vals) + 0.5;
  const pts = entries.map((e, i) => {
    const x = (i / (entries.length - 1)) * W;
    const y = H - ((e.w - min) / (max - min)) * H;
    return [x, y];
  });
  const polyline = pts.map(p => p.join(",")).join(" ");
  const area = `M${pts[0][0]},${H} ` + pts.map(p => `L${p[0]},${p[1]}`).join(" ") + ` L${pts[pts.length-1][0]},${H} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0A84FF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0A84FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="chart-area" d={area} />
      <polyline className="chart-line" points={polyline} />
      {pts.map(([x, y], i) => <circle key={i} className="chart-dot" cx={x} cy={y} r="3.5" />)}
    </svg>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// DAILY TAB
// ══════════════════════════════════════════════════════════════════════════════
const DailyTab = ({ habits, toggleHabit, todayWeight, setWeightSheet }) => {
  const today = new Date();
  const todayWI = today.getDay() === 0 ? 6 : today.getDay() - 1;
  const quote = QUOTES[today.getDate() % QUOTES.length];

  const HABIT_LIST = [
    { key: "workout",  emoji: "🏋️", label: "Workout / Run",      sub: WORKOUTS[todayWI].label + " day",    bg: "#FF6B35" },
    { key: "steps",    emoji: "👟", label: "10K Steps",           sub: "Daily movement goal",                bg: "#30D158" },
    { key: "bible",    emoji: "📖", label: "Bible",               sub: "Read today",                         bg: "#FF9F0A" },
    { key: "pray",     emoji: "🙏", label: "Pray",                sub: "Morning or night",                   bg: "#BF5AF2" },
    { key: "3sec",     emoji: "❤️", label: "3 Seconds",           sub: "Kiss, hug or close moment",          bg: "#FF375F" },
    { key: "alcohol",  emoji: "🚫", label: "Alcohol-Free",        sub: "No drinks today",                    bg: "#5AC8FA" },
    { key: "worktrip", emoji: "✈️", label: "Work Trip",           sub: "Travel day marker",                  bg: "#636366" },
    { key: "weight",   emoji: "⚖️", label: "Weight",              sub: todayWeight ? `${todayWeight} kg` : "Tap to log", bg: "#0A84FF" },
  ];

  const done  = HABIT_LIST.filter(h => habits[h.key]).length;
  const total = HABIT_LIST.length;
  const pct   = done / total;

  return (
    <div style={{ padding: "0 16px 110px", overflowY: "auto", height: "100%" }}>
      {/* Large date header */}
      <div style={{ paddingTop: "60px", marginBottom: "28px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--label2)", letterSpacing: "0.04em", marginBottom: "4px" }}>
          {DAYS_LONG[today.getDay()].toUpperCase()}, {MONTHS[today.getMonth()].toUpperCase().slice(0,3)} {today.getDate()}
        </div>
        <div style={{ fontSize: "34px", fontWeight: 700, letterSpacing: "-0.5px", lineHeight: 1.1 }}>
          Daily Check-In
        </div>
      </div>

      {/* Summary card */}
      <div className="widget" style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "20px" }}>
        <Ring pct={pct} size={80} stroke={6} color={pct === 1 ? "#30D158" : "#0A84FF"}>
          <div style={{ fontSize: "20px", fontWeight: "700", color: pct===1 ? "#30D158" : "#fff" }}>
            {Math.round(pct * 100)}
          </div>
          <div style={{ fontSize: "9px", fontWeight: 600, color: "var(--label3)", letterSpacing: "0.05em" }}>%</div>
        </Ring>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "17px", fontWeight: 600, marginBottom: "4px" }}>
            {done} of {total} done
          </div>
          <div style={{ fontSize: "13px", color: "var(--label2)", lineHeight: 1.4, marginBottom: "10px" }}>
            "{quote}"
          </div>
          {pct >= 0.25 ? (
            <span className="badge" style={{ background: "rgba(48,209,88,0.15)", color: "#30D158" }}>
              ✓ 25% reached
            </span>
          ) : (
            <span className="badge" style={{ background: "var(--fill3)", color: "var(--label2)" }}>
              {Math.ceil(total * 0.25) - done} more to unlock
            </span>
          )}
        </div>
      </div>

      {/* Habits */}
      <div className="section-label">Habits</div>
      <div className="ios-section">
        {HABIT_LIST.map((h, i) => (
          <div key={h.key} className="ios-row fade-up"
            style={{ animationDelay: `${i * 0.04}s` }}
            onClick={() => h.key === "weight" ? setWeightSheet(true) : toggleHabit(h.key)}>
            <div className="icon-badge" style={{ background: h.bg + "25" }}>
              <span style={{ fontSize: "18px" }}>{h.emoji}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: "17px", fontWeight: 400,
                color: habits[h.key] ? "var(--label3)" : "var(--label)",
                textDecoration: habits[h.key] ? "line-through" : "none",
                transition: "all 0.2s",
              }}>{h.label}</div>
              <div style={{ fontSize: "13px", color: "var(--label3)", marginTop: "1px" }}>{h.sub}</div>
            </div>
            <div className={`ios-check ${habits[h.key] ? "done" : ""}`}>
              {habits[h.key] && (
                <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                  <path d="M1.5 5L5 8.5L11.5 1.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// WORKOUTS TAB
// ══════════════════════════════════════════════════════════════════════════════
const WorkoutsTab = () => {
  const todayDOW = new Date().getDay();
  const todayWI  = todayDOW === 0 ? 6 : todayDOW - 1;
  const [selDay, setSelDay] = useState(todayWI);
  const [checks, setChecks] = useLocal("wk_checks_" + todayKey(), {});
  const [celebrate, setCelebrate] = useState(false);

  const w = WORKOUTS[selDay];
  const isToday = selDay === todayWI;
  const done = w.exercises.filter((_, i) => checks[`${selDay}_${i}`]).length;
  const pct  = done / w.exercises.length;

  const toggle = (i) => {
    if (!isToday) return;
    const k = `${selDay}_${i}`;
    const next = { ...checks, [k]: !checks[k] };
    setChecks(next);
    if (w.exercises.every((_, j) => next[`${selDay}_${j}`])) {
      setCelebrate(true);
      setTimeout(() => setCelebrate(false), 2600);
    }
  };

  return (
    <div style={{ padding: "0 16px 110px", overflowY: "auto", height: "100%" }}>
      {celebrate && (
        <div className="celebrate-overlay">
          <div style={{ fontSize: "72px" }}>🏆</div>
          <div style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-0.5px" }}>Done.</div>
          <div style={{ fontSize: "15px", color: "var(--label2)", fontWeight: 500 }}>Workout complete</div>
        </div>
      )}

      <div style={{ paddingTop: "60px", marginBottom: "24px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: w.color, letterSpacing: "0.04em", marginBottom: "4px" }}>
          {w.emoji} {w.label.toUpperCase()}
        </div>
        <div style={{ fontSize: "34px", fontWeight: 700, letterSpacing: "-0.5px" }}>Workouts</div>
      </div>

      {/* Day selector */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", marginBottom: "20px" }}>
        {WORKOUTS.map((wk, i) => (
          <button key={i} onClick={() => setSelDay(i)} style={{
            flexShrink: 0,
            padding: "7px 16px",
            borderRadius: "20px",
            border: "none",
            background: selDay === i ? w.color : "var(--bg1)",
            color: selDay === i ? "#fff" : i === todayWI ? w.color : "var(--label2)",
            fontFamily: "var(--sys-font)",
            fontSize: "14px", fontWeight: 600, cursor: "pointer",
            transition: "all 0.2s",
          }}>{wk.day}</button>
        ))}
      </div>

      {/* Progress */}
      <div className="widget" style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
        <Ring pct={pct} size={64} stroke={5} color={pct === 1 ? "#30D158" : w.color}>
          <div style={{ fontSize: "16px", fontWeight: 700, color: pct===1?"#30D158":"#fff" }}>{done}</div>
        </Ring>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.3px" }}>{done}/{w.exercises.length} exercises</div>
          <div style={{ marginTop: "8px" }}>
            <div className="prog-track">
              <div className="prog-fill" style={{ width: `${pct*100}%`, background: pct===1?"#30D158":w.color }} />
            </div>
          </div>
          {!isToday && (
            <div style={{ fontSize: "12px", color: "var(--label3)", marginTop: "6px" }}>
              View only — come back on {w.day}
            </div>
          )}
        </div>
      </div>

      {/* Exercises */}
      <div className="section-label">Exercises</div>
      <div className="ios-section">
        {w.exercises.map((ex, i) => {
          const k = `${selDay}_${i}`;
          return (
            <div key={i} className="ios-row fade-up" style={{ animationDelay: `${i*0.05}s` }} onClick={() => toggle(i)}>
              <div className={`ios-check ${checks[k] ? "done" : ""}`} style={{
                borderColor: checks[k] ? "#30D158" : "var(--bg3)",
                background: checks[k] ? "#30D158" : "transparent"
              }}>
                {checks[k] && (
                  <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                    <path d="M1.5 5L5 8.5L11.5 1.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "17px", fontWeight: 400,
                  color: checks[k] ? "var(--label3)" : "var(--label)",
                  textDecoration: checks[k] ? "line-through" : "none",
                  transition: "all 0.2s"
                }}>{ex.name}</div>
                <div style={{ fontSize: "13px", color: "var(--label3)", marginTop: "1px" }}>
                  {ex.sets} sets · {ex.reps} · {ex.rest} rest
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// FOOD TAB
// ══════════════════════════════════════════════════════════════════════════════
const FoodTab = () => {
  const [meals, setMeals] = useLocal("meals_" + todayKey(), []);
  const [sheet, setSheet] = useState(false);
  const [form, setForm] = useState({ name: "", cal: "", protein: "", carbs: "", fat: "" });

  const totals = meals.reduce((acc, m) => ({
    cal:     acc.cal     + (Number(m.cal)     || 0),
    protein: acc.protein + (Number(m.protein) || 0),
    carbs:   acc.carbs   + (Number(m.carbs)   || 0),
    fat:     acc.fat     + (Number(m.fat)      || 0),
  }), { cal: 0, protein: 0, carbs: 0, fat: 0 });

  const addMeal = () => {
    if (!form.name.trim()) return;
    setMeals(prev => [...prev, { ...form, id: Date.now() }]);
    setForm({ name: "", cal: "", protein: "", carbs: "", fat: "" });
    setSheet(false);
  };

  const MacroCard = ({ label, val, goal, color, unit = "g" }) => (
    <div style={{
      background: "var(--bg1)", borderRadius: "16px", padding: "14px",
      display: "flex", flexDirection: "column", gap: "8px"
    }}>
      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--label2)" }}>{label}</div>
      <div style={{ fontSize: "26px", fontWeight: 700, color: val >= goal ? color : "var(--label)", letterSpacing: "-0.5px" }}>
        {val}<span style={{ fontSize: "14px", fontWeight: 500, color: "var(--label3)" }}>{unit}</span>
      </div>
      <div className="prog-track">
        <div className="prog-fill" style={{ width: `${Math.min((val/goal)*100,100)}%`, background: color }} />
      </div>
      <div style={{ fontSize: "12px", color: "var(--label3)" }}>of {goal}{unit}</div>
    </div>
  );

  return (
    <div style={{ padding: "0 16px 110px", overflowY: "auto", height: "100%" }}>
      {sheet && (
        <div className="sheet-overlay" onClick={e => e.target === e.currentTarget && setSheet(false)}>
          <div className="sheet-panel">
            <div className="sheet-handle" />
            <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "20px" }}>Log Meal</div>
            {[
              { k: "name",    label: "Meal name",  placeholder: "e.g. Chicken & rice", type: "text" },
              { k: "cal",     label: "Calories",   placeholder: "kcal",                type: "number" },
              { k: "protein", label: "Protein",    placeholder: "g",                   type: "number" },
              { k: "carbs",   label: "Carbs",      placeholder: "g",                   type: "number" },
              { k: "fat",     label: "Fat",        placeholder: "g",                   type: "number" },
            ].map(f => (
              <div key={f.k} style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--label2)", marginBottom: "6px" }}>{f.label}</div>
                <input className="ios-input" type={f.type} placeholder={f.placeholder}
                  value={form[f.k]} onChange={e => setForm({ ...form, [f.k]: e.target.value })} />
              </div>
            ))}
            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button className="btn-text" onClick={() => setSheet(false)}>Cancel</button>
              <button className="btn-blue" onClick={addMeal}>Add Meal</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ paddingTop: "60px", marginBottom: "24px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#30D158", letterSpacing: "0.04em", marginBottom: "4px" }}>TODAY</div>
        <div style={{ fontSize: "34px", fontWeight: 700, letterSpacing: "-0.5px" }}>Nutrition</div>
      </div>

      {/* Macro grid */}
      <div className="section-label">Macros</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
        <div style={{ gridColumn: "1/-1" }}>
          <MacroCard label="Calories" val={totals.cal} goal={MACRO_GOALS.cal} color="#FF9F0A" unit=" kcal" />
        </div>
        <MacroCard label="Protein"  val={totals.protein} goal={MACRO_GOALS.protein} color="#0A84FF" />
        <MacroCard label="Carbs"    val={totals.carbs}   goal={MACRO_GOALS.carbs}   color="#30D158" />
        <MacroCard label="Fat"      val={totals.fat}     goal={MACRO_GOALS.fat}     color="#FF6B35" />
      </div>

      {/* Meals */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div className="section-label" style={{ marginTop: 0 }}>Meals</div>
        <button className="btn-text" style={{ fontSize: "15px", padding: "0 4px" }} onClick={() => setSheet(true)}>+ Add</button>
      </div>
      {meals.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--label3)", fontSize: "15px" }}>
          No meals logged yet
        </div>
      ) : (
        <div className="ios-section">
          {meals.map((m, i) => (
            <div key={m.id} className="ios-row fade-up" style={{ animationDelay: `${i*0.05}s` }}>
              <div className="icon-badge" style={{ background: "rgba(48,209,88,0.15)", fontSize: "18px" }}>🥗</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "17px", fontWeight: 400 }}>{m.name}</div>
                <div style={{ fontSize: "13px", color: "var(--label3)", marginTop: "1px" }}>
                  {[m.cal&&`${m.cal} kcal`, m.protein&&`P ${m.protein}g`, m.carbs&&`C ${m.carbs}g`, m.fat&&`F ${m.fat}g`].filter(Boolean).join(" · ")}
                </div>
              </div>
              <button onClick={() => setMeals(meals.filter(x => x.id !== m.id))}
                style={{ background: "none", border: "none", color: "var(--label3)", fontSize: "22px", cursor: "pointer", padding: "4px 0 4px 8px" }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// STATS TAB
// ══════════════════════════════════════════════════════════════════════════════
const StatsTab = ({ streak, weightLog, allHabits }) => {
  const today = new Date();

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    const k = d.toISOString().split("T")[0];
    const h = allHabits[k] || {};
    const done = Object.values(h).filter(Boolean).length;
    return { label: DAYS_SHORT[d.getDay()], done, isToday: i === 6 };
  });

  const completedToday = weekDays[6].done;

  return (
    <div style={{ padding: "0 16px 110px", overflowY: "auto", height: "100%" }}>
      <div style={{ paddingTop: "60px", marginBottom: "24px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--orange)", letterSpacing: "0.04em", marginBottom: "4px" }}>OVERVIEW</div>
        <div style={{ fontSize: "34px", fontWeight: 700, letterSpacing: "-0.5px" }}>Stats</div>
      </div>

      {/* Streak */}
      <div className="section-label">Streak</div>
      <div className="widget" style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "12px" }}>
        <Ring pct={Math.min(streak/30,1)} size={80} stroke={6} color="#FF9F0A">
          <div style={{ fontSize: "24px", fontWeight: 800, color: streak > 0 ? "#FF9F0A" : "var(--label3)" }}>{streak}</div>
        </Ring>
        <div>
          <div style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.3px" }}>Day Streak</div>
          <div style={{ fontSize: "14px", color: "var(--label2)", marginTop: "3px" }}>
            {streak >= 30 ? "🔥 30-day legend" : streak >= 14 ? "💪 Two weeks strong" : streak >= 7 ? "🔥 One week in" : streak >= 3 ? "Building momentum" : "Start the chain"}
          </div>
          <div style={{ marginTop: "8px" }}>
            <span className="badge" style={{ background: "rgba(255,159,10,0.15)", color: "#FF9F0A", fontSize: "12px" }}>
              {30 - Math.min(streak,30)} days to {streak >= 30 ? "legend+" : "30"}
            </span>
          </div>
        </div>
      </div>

      {/* This week */}
      <div className="section-label">This Week</div>
      <div className="widget">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {weekDays.map((d, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
              <div className="day-dot" style={{
                background: d.done >= 4 ? "rgba(48,209,88,0.2)" : d.isToday ? "var(--fill3)" : "var(--fill4)",
                color: d.done >= 4 ? "#30D158" : d.isToday ? "var(--label2)" : "var(--label3)",
                border: d.isToday ? "1.5px solid var(--blue)" : "1.5px solid transparent",
              }}>
                {d.done >= 4 ? "✓" : d.done > 0 ? d.done : ""}
              </div>
              <span style={{ fontSize: "11px", fontWeight: 500, color: d.isToday ? "var(--blue)" : "var(--label3)" }}>{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weight */}
      <div className="section-label">Weight</div>
      <div className="widget">
        {weightLog.length >= 2 ? (
          <>
            <WeightChart entries={weightLog.slice(-14)} />
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "16px" }}>
              {[
                { label: "Current", val: `${weightLog[weightLog.length-1]?.w}kg` },
                { label: "7-day Δ",  val: weightLog.length >= 7 ? `${(weightLog[weightLog.length-1]?.w - weightLog[weightLog.length-7]?.w).toFixed(1)}kg` : "—" },
                { label: "Logged",   val: `${weightLog.length}d` },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "22px", fontWeight: 700, letterSpacing: "-0.3px", color: "var(--blue)" }}>{s.val}</div>
                  <div style={{ fontSize: "12px", color: "var(--label3)", marginTop: "2px" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "24px 0", color: "var(--label3)", fontSize: "15px" }}>
            Log weight on Daily tab to see your trend
          </div>
        )}
      </div>

      {/* Habit %s */}
      <div className="section-label">Habit Completion</div>
      <div className="ios-section">
        {[
          { label: "Workout / Run", color: "#FF6B35", pct: 0.71 },
          { label: "10K Steps",     color: "#30D158", pct: 0.57 },
          { label: "Bible",         color: "#FF9F0A", pct: 0.86 },
          { label: "Pray",          color: "#BF5AF2", pct: 0.90 },
          { label: "3 Seconds",     color: "#FF375F", pct: 0.95 },
          { label: "Alcohol-Free",  color: "#5AC8FA", pct: 0.85 },
        ].map((h, i) => (
          <div key={i} className="ios-row" style={{ cursor: "default", flexDirection: "column", alignItems: "flex-start", gap: "8px", padding: "12px 16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <span style={{ fontSize: "15px", fontWeight: 500 }}>{h.label}</span>
              <span style={{ fontSize: "15px", fontWeight: 600, color: h.pct >= 0.8 ? "#30D158" : "var(--label2)" }}>{Math.round(h.pct * 100)}%</span>
            </div>
            <div className="prog-track" style={{ width: "100%" }}>
              <div className="prog-fill" style={{ width: `${h.pct*100}%`, background: h.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("daily");
  const [habits, setHabits]       = useLocal("habits_" + todayKey(), {});
  const [allHabits, setAllHabits] = useLocal("all_habits", {});
  const [weightLog, setWeightLog] = useLocal("weight_log", []);
  const [streak, setStreak]       = useLocal("streak", 0);
  const [weightSheet, setWeightSheet] = useState(false);
  const [weightInput, setWeightInput] = useState("");

  const todayWeight = weightLog.find(e => e.d === todayKey())?.w;

  // persist today's habits into allHabits
  useEffect(() => {
    setAllHabits(prev => ({ ...prev, [todayKey()]: habits }));
  }, [habits]); // eslint-disable-line

  const toggleHabit = (key) => {
    setHabits(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const logWeight = () => {
    const w = parseFloat(weightInput);
    if (!w) return;
    const next = [...weightLog.filter(e => e.d !== todayKey()), { d: todayKey(), w }]
      .sort((a,b) => a.d.localeCompare(b.d));
    setWeightLog(next);
    setHabits(prev => ({ ...prev, weight: true }));
    setWeightInput("");
    setWeightSheet(false);
  };

  const TABS = [
    { key: "daily",    label: "Daily",   icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a?"#0A84FF":"rgba(235,235,245,0.3)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
      </svg>
    )},
    { key: "workouts", label: "Workout", icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a?"#0A84FF":"rgba(235,235,245,0.3)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4v16M18 4v16M3 9h3M18 9h3M3 15h3M18 15h3M6 9h12M6 15h12"/>
      </svg>
    )},
    { key: "food",     label: "Food",    icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a?"#0A84FF":"rgba(235,235,245,0.3)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
      </svg>
    )},
    { key: "stats",    label: "Stats",   icon: (a) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={a?"#0A84FF":"rgba(235,235,245,0.3)"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    )},
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "var(--bg)", maxWidth: "430px", margin: "0 auto", position: "relative" }}>
      <GlobalStyles />

      {/* Weight sheet */}
      {weightSheet && (
        <div className="sheet-overlay" onClick={e => e.target === e.currentTarget && setWeightSheet(false)}>
          <div className="sheet-panel">
            <div className="sheet-handle" />
            <div style={{ fontSize: "20px", fontWeight: 700, marginBottom: "6px" }}>Log Weight</div>
            {todayWeight && (
              <div style={{ fontSize: "15px", color: "var(--label2)", marginBottom: "16px" }}>Last logged: {todayWeight} kg</div>
            )}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--label2)", marginBottom: "8px" }}>Weight (kg)</div>
              <input className="ios-input" type="number" step="0.1" placeholder="e.g. 83.5"
                value={weightInput} onChange={e => setWeightInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && logWeight()} autoFocus />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button className="btn-text" onClick={() => setWeightSheet(false)}>Cancel</button>
              <button className="btn-blue" onClick={logWeight}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden" }}>
        {tab === "daily"    && <DailyTab    habits={habits} toggleHabit={toggleHabit} todayWeight={todayWeight} setWeightSheet={setWeightSheet} />}
        {tab === "workouts" && <WorkoutsTab />}
        {tab === "food"     && <FoodTab />}
        {tab === "stats"    && <StatsTab streak={streak} weightLog={weightLog} allHabits={allHabits} />}
      </div>

      {/* Tab bar */}
      <nav className="tab-bar">
        {TABS.map(t => (
          <button key={t.key} className="tab-item" onClick={() => setTab(t.key)}>
            {t.icon(tab === t.key)}
            <span className="tab-label" style={{ color: tab === t.key ? "#0A84FF" : "rgba(235,235,245,0.3)", fontWeight: tab === t.key ? 600 : 400 }}>
              {t.label}
            </span>
          </button>
        ))}
      </nav>
    </div>
  );
}
