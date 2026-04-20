import { useState, useRef, useEffect } from "react";

const BRAND = {
  green: "#7bb534",
  greenDark: "#4d7a1a",   // darkened so white text passes AA on hover
  greenLight: "#a8d466",
  greenText: "#3d5e10",   // dark green for text on light backgrounds (AA compliant)
  cream: "#f8f7f6",
  black: "#1a1a18",
  gray: "#595954",        // darkened from #6b6b65 for AA contrast (~5.7:1 on cream)
  grayLight: "#e8e6e3",
  grayMid: "#c8c5bf",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .visually-hidden {
    position: absolute;
    width: 1px; height: 1px;
    padding: 0; margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .s-root {
    font-family: 'DM Sans', sans-serif;
    background: ${BRAND.cream};
    min-height: 100vh;
    color: ${BRAND.black};
  }

  .s-header {
    background: ${BRAND.black};
    padding: 18px 32px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .s-logo-mark {
    width: 30px; height: 30px;
    background: ${BRAND.green};
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .s-logo-text {
    font-family: 'DM Serif Display', serif;
    color: ${BRAND.cream};
    font-size: 17px;
    letter-spacing: 0.01em;
  }

  .s-progress-outer {
    height: 3px;
    background: ${BRAND.grayLight};
  }

  .s-progress-inner {
    height: 100%;
    background: ${BRAND.green};
    transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
  }

  .s-body {
    max-width: 620px;
    margin: 0 auto;
    padding: 52px 24px 96px;
  }

  .s-eyebrow {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: ${BRAND.greenText};
    margin-bottom: 8px;
  }

  .s-title {
    font-family: 'DM Serif Display', serif;
    font-size: 30px;
    line-height: 1.2;
    color: ${BRAND.black};
    margin-bottom: 10px;
  }

  .s-title:focus { outline: none; }

  .s-subtitle {
    font-size: 15px;
    color: ${BRAND.gray};
    line-height: 1.65;
    margin-bottom: 36px;
  }

  .s-divider { height: 1px; background: ${BRAND.grayLight}; margin: 28px 0; }

  .q-block { margin-bottom: 36px; }

  .q-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 4px;
  }

  .q-label {
    font-size: 15px;
    font-weight: 500;
    color: ${BRAND.black};
    line-height: 1.5;
    flex: 1;
  }

  .q-optional { font-size: 11px; color: ${BRAND.gray}; margin-left: 8px; flex-shrink: 0; }

  .q-hint { font-size: 13px; color: ${BRAND.gray}; margin-bottom: 12px; line-height: 1.5; }

  /* Single select */
  .opt-list { display: flex; flex-direction: column; gap: 7px; }

  .opt-btn {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 16px;
    border: 1.5px solid ${BRAND.grayLight};
    border-radius: 10px;
    background: white;
    cursor: pointer;
    text-align: left;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: ${BRAND.black};
    line-height: 1.5;
    transition: all 0.15s ease;
    width: 100%;
  }

  .opt-btn:hover { border-color: ${BRAND.greenLight}; background: #f5fbec; }
  .opt-btn.sel { border-color: ${BRAND.green}; background: #eef7dc; font-weight: 500; }
  .opt-btn:focus-visible { outline: 3px solid ${BRAND.green}; outline-offset: 2px; }

  .opt-dot {
    width: 17px; height: 17px;
    border-radius: 50%;
    border: 2px solid ${BRAND.grayMid};
    flex-shrink: 0;
    margin-top: 2px;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.15s ease;
  }

  .opt-btn.sel .opt-dot { background: ${BRAND.green}; border-color: ${BRAND.green}; }

  .dot-inner { width: 6px; height: 6px; background: white; border-radius: 50%; }

  /* Multi / tag cloud */
  .tag-hint {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: ${BRAND.greenText};
    margin-bottom: 10px;
  }

  .tag-cloud { display: flex; flex-wrap: wrap; gap: 8px; }

  .tag-btn {
    padding: 8px 15px;
    border: 1.5px solid ${BRAND.grayLight};
    border-radius: 100px;
    background: white;
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    color: ${BRAND.black};
    cursor: pointer;
    transition: all 0.15s ease;
    line-height: 1;
  }

  .tag-btn:hover { border-color: ${BRAND.greenLight}; background: #f5fbec; }
  .tag-btn.sel { background: ${BRAND.green}; border-color: ${BRAND.green}; color: ${BRAND.black}; }
  .tag-btn:focus-visible { outline: 3px solid ${BRAND.green}; outline-offset: 2px; }

  /* Open text */
  textarea, input[type="text"] {
    width: 100%;
    border: 1.5px solid ${BRAND.grayLight};
    border-radius: 10px;
    padding: 12px 16px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: ${BRAND.black};
    background: white;
    outline: none;
    transition: border-color 0.15s ease;
    line-height: 1.65;
  }

  textarea { resize: vertical; min-height: 100px; }
  textarea:focus, input[type="text"]:focus { border-color: ${BRAND.green}; }
  textarea:focus-visible, input[type="text"]:focus-visible { outline: 3px solid ${BRAND.green}; outline-offset: 2px; }

  /* Other + fill-in */
  .other-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border: 1.5px solid ${BRAND.grayLight};
    border-radius: 10px;
    background: white;
    transition: border-color 0.15s ease;
  }

  .other-row.active { border-color: ${BRAND.green}; background: #eef7dc; }

  .other-check {
    width: 17px; height: 17px;
    border-radius: 5px;
    border: 2px solid ${BRAND.grayMid};
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all 0.15s ease;
    background: transparent;
    padding: 0;
  }

  .other-row.active .other-check { background: ${BRAND.green}; border-color: ${BRAND.green}; }
  .other-check:focus-visible { outline: 3px solid ${BRAND.green}; outline-offset: 2px; }

  .other-input {
    flex: 1;
    border: none !important;
    padding: 0 !important;
    background: transparent !important;
    font-size: 14px;
    color: ${BRAND.black};
    outline: none;
  }

  .other-input::placeholder { color: ${BRAND.grayMid}; }

  /* Importance grid */
  .imp-grid { display: flex; flex-direction: column; gap: 12px; }

  .imp-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .imp-row-label {
    font-size: 14px;
    color: ${BRAND.black};
    flex: 0 0 210px;
    line-height: 1.4;
  }

  .imp-pills { display: flex; gap: 5px; flex-wrap: wrap; }

  .imp-pill {
    padding: 7px 11px;
    border: 1.5px solid ${BRAND.grayLight};
    border-radius: 7px;
    background: white;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    color: ${BRAND.gray};
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
  }

  .imp-pill:hover { border-color: ${BRAND.greenLight}; background: #f5fbec; }
  .imp-pill.sel { background: ${BRAND.green}; border-color: ${BRAND.green}; color: ${BRAND.black}; font-weight: 600; }
  .imp-pill:focus-visible { outline: 3px solid ${BRAND.green}; outline-offset: 2px; }

  /* Name field on intro */
  .name-field { margin-bottom: 28px; }

  .name-label {
    font-size: 14px;
    font-weight: 500;
    color: ${BRAND.black};
    margin-bottom: 8px;
    display: block;
  }

  /* Nav */
  .s-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 48px;
    gap: 12px;
  }

  .btn-back {
    padding: 12px 22px;
    border: 1.5px solid ${BRAND.grayLight};
    border-radius: 10px;
    background: transparent;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: ${BRAND.gray};
    cursor: pointer;
    transition: all 0.15s ease;
  }

  .btn-back:hover { border-color: ${BRAND.gray}; color: ${BRAND.black}; }
  .btn-back:focus-visible { outline: 3px solid ${BRAND.green}; outline-offset: 2px; }

  .btn-next {
    padding: 12px 32px;
    border: none;
    border-radius: 10px;
    background: ${BRAND.green};
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: ${BRAND.black};
    cursor: pointer;
    transition: all 0.15s ease;
    margin-left: auto;
  }

  .btn-next:hover:not(:disabled) { background: #8bc43d; }
  .btn-next:focus-visible { outline: 3px solid ${BRAND.greenDark}; outline-offset: 2px; }
  .btn-next:disabled { background: ${BRAND.grayLight}; color: ${BRAND.gray}; cursor: not-allowed; }

  .submit-error {
    font-size: 13px;
    color: #c0392b;
    margin-top: 10px;
    text-align: right;
  }

  .thankyou { text-align: center; padding: 40px 0; }

  .ty-icon {
    width: 68px; height: 68px;
    background: ${BRAND.green};
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 24px;
  }

  .fade-in { animation: fadeUp 0.28s ease both; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 520px) {
    .imp-row { flex-direction: column; align-items: flex-start; }
    .imp-row-label { flex: none; }
  }
`;

// ─── Survey data ───────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: "current_setup",
    title: "How you work now",
    subtitle: "Before I show you anything I'm building, I want to understand your current setup - the tools you use now and how they fit together.",
    questions: [
      {
        id: "programming_structure",
        type: "single",
        label: "How do you currently receive your programming from me?",
        options: [
          "Monthly programming with workouts assigned to specific days",
          "Monthly programming with workouts assigned weekly — you schedule the days yourself",
          "Workout plans created periodically — you schedule everything yourself",
        ],
        otherLabel: "Something else",
        hasOther: true,
      },
      {
        id: "program_delivery",
        type: "multi",
        label: "What format or tool do I currently use to deliver your programming?",
        hint: "Select all that apply",
        options: [
          "Google Sheets or spreadsheet",
          "Google Doc or PDF",
          "Email or message with each session",
        ],
        otherLabel: "Something else",
        hasOther: true,
      },
      {
        id: "other_tools",
        type: "multi",
        label: "What other tools or apps are you personally using to manage your training?",
        hint: "Select all that apply",
        options: [
          "Notes app (iPhone / Google Keep etc.)",
          "A dedicated lifting app (Strong, Hevy, etc.)",
          "Apple Watch",
          "Android / Wear OS watch",
          "Garmin watch",
          "Wahoo or Polar",
          "Whoop",
          "Oura ring",
          "MyFitnessPal or similar",
          "Paper / notebook",
          "Nothing else — just what you send me",
        ],
        otherLabel: "Something else",
        hasOther: true,
      },
      {
        id: "reference_during",
        type: "single",
        label: "During a session, how do you typically reference your program?",
        options: [
          "Phone — I keep it open on screen",
          "I memorize it beforehand",
          "Printed paper",
          "I wing it / go by feel",
          "Depends on the session type",
        ],
      },
    ],
  },
  {
    id: "friction",
    title: "Where things break down",
    subtitle: "I'm more interested in your honest frustrations than in what's working fine. This is how I figure out what I should build.",
    questions: [
      {
        id: "hardest_part",
        type: "open",
        label: "What's the most annoying or effortful part of your current training setup?",
        hint: "Think about the whole loop: getting your program, understanding it, doing the session, remembering what you did.",
        placeholder: "E.g. \"I can never find last week's session\" or \"I have to flip between three tabs mid-workout\" — anything that creates friction",
      },
      {
        id: "understanding_program",
        type: "single",
        label: "When you get a new program or program update from me, how easy is it to understand what I want you to do?",
        options: [
          "Always clear — I know exactly what to do",
          "Usually clear, occasional questions",
          "Sometimes unclear — I make my best guess",
          "Often unclear — I wish there was more explanation",
        ],
      },
      {
        id: "log_or_not",
        type: "single",
        label: "Do you currently log what you do each session (sets, reps, weights)?",
        options: [
          "Yes, consistently",
          "Yes, but inconsistently",
          "Rarely",
          "No — I don't track it at all",
        ],
      },
      {
        id: "why_no_log",
        type: "single",
        label: "If you don't log consistently, what's the main reason?",
        optional: true,
        hint: "Skip if you log consistently",
        options: [
          "It's too slow or disruptive during training",
          "I'm not sure what to log or how",
          "I don't see the value in it",
          "I forget to do it after",
          "I used to but stopped — it felt like busywork",
          "No good place to put it",
        ],
      },
      {
        id: "progress_awareness",
        type: "single",
        label: "Right now, how aware are you of your own progress over time?",
        options: [
          "Very aware — I can see clear trends",
          "Somewhat aware — I have a general sense",
          "Not very aware — I go session to session",
          "Not at all — I have no idea where I stand",
        ],
      },
    ],
  },
  {
    id: "jobs_to_be_done",
    title: "What matters most to you",
    subtitle: "These questions are about what you're trying to accomplish. There are no right answers.",
    questions: [
      {
        id: "most_important_job",
        type: "open",
        label: "When your training is going well, what does that feel like or look like?",
        hint: "Describe it in your own words — what's happening, what are you able to do, how do you feel.",
        placeholder: "\"I feel like I'm making consistent progress and I know what to do each session without thinking about it\"...",
      },
      {
        id: "success_metric",
        type: "multi",
        label: "How do you personally know a training period has been successful?",
        hint: "Select all that resonate",
        options: [
          "Numbers moved (weight, reps, times)",
          "How I feel physically — energy, recovery",
          "Body composition changes",
          "Hitting a specific performance goal",
          "Consistency — I just showed up",
          "Feedback from you (the coach)",
          "How my sport or life performance improved",
          "I honestly don't have a clear measure",
        ],
        otherLabel: "Something else",
        hasOther: true,
      },
      {
        id: "coach_relationship",
        type: "single",
        label: "In your ideal coaching relationship, how involved do you want me to be in your day-to-day training decisions?",
        options: [
          "Highly involved — check in often, adjust frequently",
          "Moderate — set the plan, touch base weekly",
          "Mostly hands-off — give me the program and I'll run it",
          "It depends on where I am in a training cycle",
        ],
      },
      {
        id: "accountability_source",
        type: "single",
        label: "What's the main thing that keeps you consistent with your training right now?",
        options: [
          "Internal motivation — I just want to train",
          "Having a plan from you that I feel accountable to",
          "Paying for coaching (sunk cost)",
          "A specific goal or event coming up",
          "Training partner or community",
          "Habit / routine — it's just part of my day",
          "Honestly, consistency is a challenge for me",
        ],
      },
    ],
  },
  {
    id: "app_vision",
    title: "What an app should do",
    subtitle: "Now I'll ask more directly about features, framed around what would be useful, not a wish list. Push back if something sounds pointless.",
    questions: [
      {
        id: "must_have_feeling",
        type: "open",
        label: "If an app delivered your programming from me, what would it need to do for you to actually use it every session?",
        hint: "Think about the moment you're in the gym, not the ideal version; what's the minimum it needs to nail?",
        placeholder: "\"Fast to pull up, show me exactly what I'm doing next, and let me mark it done quickly\"...",
      },
      {
        id: "feature_value",
        type: "importance",
        label: "How valuable would each of these be to you?",
        hint: "Rate each honestly — 'not useful' is a valid answer",
        items: [
          { id: "fi_program_view", label: "Seeing your full program clearly laid out" },
          { id: "fi_log", label: "Logging sets / reps / weights during a session" },
          { id: "fi_history", label: "Reviewing what you did in past sessions" },
          { id: "fi_progress", label: "Visual progress over time (charts, trends)" },
          { id: "fi_video", label: "Exercise demo videos or coaching notes" },
          { id: "fi_checkin", label: "Weekly check-in to report how training went" },
          { id: "fi_messaging", label: "Direct messaging with Bert inside the app" },
          { id: "fi_schedule", label: "Scheduling which days you'll train" },
          { id: "fi_adjustments", label: "Ability to substitute exercises in the program myself" },
          { id: "fi_bert_sees", label: "Bert can see your session logs to adjust your programming" },
        ],
        scale: ["Not useful", "Nice to have", "Useful", "Essential"],
      },
      {
        id: "would_not_use",
        type: "open",
        label: "Is there anything on that list or otherwise that you'd actively avoid or that would make you trust the app less?",
        optional: true,
        placeholder: "E.g. \"I'd never log mid-session\" or \"I don't want anything too gamified\"...",
      },
    ],
  },
  {
    id: "adaptive_features",
    title: "Adaptive programming",
    subtitle: "This section is about features that respond to your data over time. It would not be AI in the chatbot sense, but the app learning your patterns and helping your programming reflect them. I want your honest reaction, including skepticism.",
    questions: [
      {
        id: "auto_adjust_reaction",
        type: "single",
        label: "How would you feel about the app automatically adjusting your next session based on how your last one went and/or your subjective rating of your energy going into a session?",
        hint: "E.g. if you hit all your targets easily, it bumps the weight slightly — or if you log low energy before a session, it scales back the volume",
        options: [
          "I'd love it — that's what good programming should do",
          "Interested, but I'd want to approve changes before they apply",
          "I'd want to understand the reasoning first",
          "I'd prefer the program stays fixed unless you manually change it",
          "I don't know enough to say",
        ],
      },
      {
        id: "exercise_swap",
        type: "single",
        label: "If you could flag an exercise as not working (eg because of equipment access, discomfort, or something else) and the app suggested alternatives, how would you want that to work?",
        options: [
          "I tell the app why (equipment / pain / preference) and it suggests options",
          "It just shows me alternatives and I pick — no need to explain",
          "I'd rather message Bert directly for swaps",
          "I'd rarely need this — I'd just work around it myself",
        ],
      },
      {
        id: "pattern_insight_reaction",
        type: "single",
        label: "If the app noticed a pattern in your training data and surfaced an insight, like \"your performance tends to drop when you've had two nights of poor sleep in a row\", what would you do with that?",
        optional: true,
        hint: "Hypothetical — curious how you'd actually use it",
        options: [
          "Find it useful and act on it directly",
          "Interesting, but I'd probably ignore it",
          "I'd want Bert to interpret it, not just the app",
          "I'd find that kind of tracking intrusive",
          "Depends entirely on whether the insight was actually accurate",
        ],
      },
      {
        id: "adaptive_trust",
        type: "open",
        label: "What would need to be true for adaptive programming features to feel useful rather than noise?",
        optional: true,
        placeholder: "What's your honest reaction — what would make you trust it, or not?",
      },
      {
        id: "final_open",
        type: "open",
        label: "Anything else I should know as I build this?",
        optional: true,
        placeholder: "Open floor. What have I not asked that matters to you?",
      },
    ],
  },
];

// ─── Validation ────────────────────────────────────────────────────────────────

function isComplete(section, answers) {
  return section.questions.every((q) => {
    if (q.optional) return true;
    const v = answers[q.id];
    if (q.type === "open") return typeof v === "string" && v.trim().length > 0;
    if (q.type === "single") {
      if (q.hasOther && v && v.__other != null) return v.__other.trim().length > 0;
      return v != null && typeof v === "string";
    }
    if (q.type === "multi") {
      if (!Array.isArray(v) || v.length === 0) {
        if (q.hasOther && answers[q.id + "__other"]) return true;
        return false;
      }
      return true;
    }
    if (q.type === "importance") {
      return q.items.every((item) => v && v[item.id] != null);
    }
    return false;
  });
}

// ─── Components ────────────────────────────────────────────────────────────────

function Single({ q, value, onChange }) {
  const isOtherSelected = value && typeof value === "object";
  const otherText = isOtherSelected ? value.__other : "";
  const labelId = `ql-${q.id}`;
  const hintId = q.hint ? `qh-${q.id}` : undefined;

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      aria-describedby={hintId}
      className="opt-list"
    >
      {q.options.map((opt) => {
        const sel = value === opt;
        return (
          <button
            key={opt}
            type="button"
            role="radio"
            aria-checked={sel}
            className={`opt-btn ${sel ? "sel" : ""}`}
            onClick={() => onChange(opt)}
          >
            <span className="opt-dot" aria-hidden="true">
              {sel && <span className="dot-inner" />}
            </span>
            {opt}
          </button>
        );
      })}
      {q.hasOther && (
        <div className={`other-row ${isOtherSelected ? "active" : ""}`}>
          <button
            type="button"
            className="other-check"
            role="checkbox"
            aria-checked={!!isOtherSelected}
            aria-label={q.otherLabel || "Other — please specify"}
            onClick={() => {
              if (isOtherSelected) onChange(null);
              else onChange({ __other: "" });
            }}
          >
            {isOtherSelected && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                <path d="M1 4l2.5 2.5L9 1" stroke={BRAND.black} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <input
            type="text"
            className="other-input"
            aria-label={q.otherLabel || "Other — please specify"}
            placeholder={q.otherLabel || "Other — please specify"}
            value={otherText}
            onFocus={() => { if (!isOtherSelected) onChange({ __other: "" }); }}
            onChange={(e) => onChange({ __other: e.target.value })}
          />
        </div>
      )}
    </div>
  );
}

function Multi({ q, value = [], onChange, otherValue = "", onOtherChange }) {
  const toggle = (opt) => {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };
  const labelId = `ql-${q.id}`;
  const hintId = q.hint ? `qh-${q.id}` : undefined;
  const otherActive = otherValue !== null && otherValue !== undefined && otherValue !== "";

  return (
    <div role="group" aria-labelledby={labelId} aria-describedby={hintId}>
      <div className="tag-hint" aria-hidden="true">Select all that apply</div>
      <div className="tag-cloud">
        {q.options.map((opt) => {
          const sel = value.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              role="checkbox"
              aria-checked={sel}
              className={`tag-btn ${sel ? "sel" : ""}`}
              onClick={() => toggle(opt)}
            >
              {opt}
            </button>
          );
        })}
        {q.hasOther && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 14px",
              border: `1.5px solid ${otherActive ? BRAND.green : BRAND.grayLight}`,
              borderRadius: 100,
              background: otherActive ? "#eef7dc" : "white",
              cursor: "text",
            }}
          >
            <input
              type="text"
              aria-label={q.otherLabel || "Other"}
              placeholder={q.otherLabel || "Other"}
              value={otherValue || ""}
              onChange={(e) => onOtherChange(e.target.value)}
              style={{
                border: "none",
                background: "transparent",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                color: BRAND.black,
                outline: "none",
                width: 140,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function OpenText({ q, value = "", onChange }) {
  const labelId = `ql-${q.id}`;
  const hintId = q.hint ? `qh-${q.id}` : undefined;
  return (
    <textarea
      aria-labelledby={labelId}
      aria-describedby={hintId}
      placeholder={q.placeholder || ""}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
    />
  );
}

function Importance({ q, value = {}, onChange }) {
  const groupLabelId = `ql-${q.id}`;
  return (
    <div role="group" aria-labelledby={groupLabelId} className="imp-grid">
      {q.items.map((item) => {
        const rowLabelId = `imp-label-${item.id}`;
        return (
          <div key={item.id} className="imp-row">
            <div className="imp-row-label" id={rowLabelId}>{item.label}</div>
            <div
              role="radiogroup"
              aria-labelledby={rowLabelId}
              className="imp-pills"
            >
              {q.scale.map((label, i) => (
                <button
                  key={label}
                  type="button"
                  role="radio"
                  aria-checked={value[item.id] === i}
                  className={`imp-pill ${value[item.id] === i ? "sel" : ""}`}
                  onClick={() => onChange({ ...value, [item.id]: i })}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Question({ q, allAnswers, onAnswer, onOtherAnswer }) {
  const value = allAnswers[q.id];
  const otherValue = allAnswers[q.id + "__other"];

  const input = {
    single: <Single q={q} value={value} onChange={(v) => onAnswer(q.id, v)} />,
    multi: (
      <Multi
        q={q}
        value={value || []}
        onChange={(v) => onAnswer(q.id, v)}
        otherValue={otherValue}
        onOtherChange={(v) => onOtherAnswer(q.id + "__other", v)}
      />
    ),
    open: <OpenText q={q} value={value} onChange={(v) => onAnswer(q.id, v)} />,
    importance: <Importance q={q} value={value || {}} onChange={(v) => onAnswer(q.id, v)} />,
  }[q.type];

  return (
    <div className="q-block">
      <div className="q-header">
        <span className="q-label" id={`ql-${q.id}`}>{q.label}</span>
        {q.optional && <span className="q-optional">Optional</span>}
      </div>
      {q.hint && <div className="q-hint" id={`qh-${q.id}`}>{q.hint}</div>}
      {input}
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────

// initialStep / initialAnswers / initialName are for testing only
export default function Survey({ initialStep = 0, initialAnswers = {}, initialName = "" } = {}) {
  const [step, setStep] = useState(initialStep);
  const [name, setName] = useState(initialName);
  const [answers, setAnswers] = useState(initialAnswers);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const headingRef = useRef(null);

  const total = SECTIONS.length;
  const sectionIdx = step - 1;
  const section = SECTIONS[sectionIdx];
  const progress = step === 0 ? 0 : Math.round((step / total) * 100);

  const setAnswer = (qid, val) => setAnswers((p) => ({ ...p, [qid]: val }));

  const canAdvance =
    step === 0
      ? name.trim().length > 0
      : section && isComplete(section, answers);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    headingRef.current?.focus();
  }, [step, done]);

  const handleNext = async () => {
    if (step < total) {
      setStep((s) => s + 1);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const url = import.meta.env.VITE_APPS_SCRIPT_URL;
    if (!url) {
      // dev / test: no endpoint configured, skip fetch
      setDone(true);
      setSubmitting(false);
      return;
    }

    try {
      const payload = { name, answers, submittedAt: new Date().toISOString() };
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "text/plain" }, // avoids CORS preflight
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setDone(true);
    } catch {
      setSubmitError("Something went wrong — please try again, or email bert.m.cherry@gmail.com.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="s-root">
        <header className="s-header">
          <div className="s-logo-mark" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <path d="M6 20V10M12 20V4M18 20v-6" />
            </svg>
          </div>
          <span className="s-logo-text">Cherry Coaching</span>
        </header>

        <div
          className="s-progress-outer"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Survey progress"
        >
          <div className="s-progress-inner" style={{ width: `${progress}%` }} aria-hidden="true" />
        </div>

        <main className="s-body">
          {done ? (
            <div className="thankyou fade-in">
              <div className="ty-icon" aria-hidden="true">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={BRAND.black} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <h1
                className="s-title"
                ref={headingRef}
                tabIndex={-1}
              >
                You're done — thank you{name ? `, ${name.split(" ")[0]}` : ""}.
              </h1>
              <p className="s-subtitle" style={{ marginTop: 12, maxWidth: 420, margin: "12px auto 0" }}>
                Your input will shape what gets built. I may follow up with you directly once I've gone through responses.
              </p>
              <div className="s-divider" />
              <p style={{ fontSize: 13, color: BRAND.gray }}>You can close this tab.</p>
            </div>
          ) : step === 0 ? (
            <div className="fade-in">
              <div className="s-eyebrow">~10 minutes · 5 sections</div>
              <h1 className="s-title" ref={headingRef} tabIndex={-1}>
                I'm building an app to deliver your programming. I want your input so I can build something that serves my clients!
              </h1>
              <p className="s-subtitle">
                You'll get a custom app to receive your program, log sessions, and track progress instead of spreadsheets and messages. Before I prioritize features, I want to understand how your training works right now and what would make a real difference.
              </p>
              <p className="s-subtitle">
                No right answers. Skip anything you'd rather not answer. Blunt feedback is more useful than polite feedback.
              </p>
              <div className="s-divider" />
              <div className="name-field">
                <label className="name-label" htmlFor="respondent-name">Your name</label>
                <input
                  id="respondent-name"
                  type="text"
                  placeholder="First name is fine"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && canAdvance) handleNext(); }}
                />
              </div>
              <button
                type="button"
                className="btn-next"
                disabled={!canAdvance}
                onClick={handleNext}
              >
                Start →
              </button>
            </div>
          ) : (
            <div className="fade-in" key={step}>
              <div className="s-eyebrow">Section {step} of {total}</div>
              <h2 className="s-title" ref={headingRef} tabIndex={-1}>{section.title}</h2>
              <p className="s-subtitle">{section.subtitle}</p>
              <div className="s-divider" />

              {section.questions.map((q) => (
                <Question
                  key={q.id}
                  q={q}
                  allAnswers={answers}
                  onAnswer={setAnswer}
                  onOtherAnswer={setAnswer}
                />
              ))}

              <div className="s-nav">
                {step > 1 && (
                  <button
                    type="button"
                    className="btn-back"
                    onClick={() => setStep((s) => s - 1)}
                  >
                    ← Back
                  </button>
                )}
                <button
                  type="button"
                  className="btn-next"
                  disabled={!canAdvance || submitting}
                  aria-busy={submitting}
                  onClick={handleNext}
                >
                  {submitting ? "Submitting…" : step === total ? "Submit →" : "Continue →"}
                </button>
              </div>
              {submitError && (
                <p role="alert" className="submit-error">{submitError}</p>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
