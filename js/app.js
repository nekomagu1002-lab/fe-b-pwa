// ── State ────────────────────────────────────────────────
const state = {
  patterns: [],
  patternIndex: 0,
  stepIndex: 0
};

// ── Elements ─────────────────────────────────────────────
const el = {
  patternNav:   document.getElementById("patternNav"),
  patternTitle: document.getElementById("patternTitle"),
  patternDesc:  document.getElementById("patternDescription"),
  stepBadge:    document.getElementById("stepBadge"),
  stepTitle:    document.getElementById("stepTitle"),
  stepNote:     document.getElementById("stepNote"),
  codePanel:    document.getElementById("codePanel"),
  varBody:      document.getElementById("varBody"),
  progressText: document.getElementById("progressText"),
  navProgress:  document.getElementById("navProgress"),
  btnFirst:     document.getElementById("btnFirst"),
  btnPrev:      document.getElementById("btnPrev"),
  btnNext:      document.getElementById("btnNext"),
  btnLast:      document.getElementById("btnLast")
};

// ── Helpers ───────────────────────────────────────────────
function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function currentPattern() {
  return state.patterns[state.patternIndex];
}

function currentStep() {
  return currentPattern().steps[state.stepIndex];
}

// ── Load ──────────────────────────────────────────────────
async function loadPatterns() {
  try {
    const res = await fetch("data/patterns.json", { cache: "no-store" });
    if (!res.ok) throw new Error("fetch failed");
    const data = await res.json();
    state.patterns = Array.isArray(data.patterns) ? data.patterns : [];
    if (state.patterns.length === 0) throw new Error("no patterns");
    renderPatternNav();
    selectPattern(0);
  } catch {
    el.patternTitle.textContent = "データ読み込みに失敗しました";
    el.patternDesc.textContent  = "data/patterns.json が配置されているか確認してください。";
  }
}

// ── Pattern nav ───────────────────────────────────────────
function renderPatternNav() {
  el.patternNav.innerHTML = state.patterns.map((p, i) =>
    `<button class="pattern-tab" data-index="${i}" type="button">
      <span class="tab-num">${i + 1}</span>
      <span class="tab-label">${escHtml(p.title)}</span>
    </button>`
  ).join("");

  el.patternNav.querySelectorAll("[data-index]").forEach(btn => {
    btn.addEventListener("click", () => selectPattern(Number(btn.dataset.index)));
  });
}

function selectPattern(index) {
  state.patternIndex = index;
  state.stepIndex    = 0;

  el.patternNav.querySelectorAll("[data-index]").forEach((btn, i) => {
    btn.classList.toggle("active", i === index);
  });

  const activeTab = el.patternNav.querySelector("[data-index].active");
  if (activeTab) {
    activeTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }

  const p = currentPattern();
  el.patternTitle.textContent = p.title;
  el.patternDesc.textContent  = p.description;

  renderStep();
}

// ── Step render ───────────────────────────────────────────
function renderStep() {
  const pattern = currentPattern();
  const step    = currentStep();
  const total   = pattern.steps.length;
  const current = state.stepIndex + 1;

  const progressStr = `${current} / ${total}`;
  el.progressText.textContent = progressStr;
  el.navProgress.textContent  = progressStr;

  el.stepBadge.textContent = current;
  el.stepTitle.textContent = step.title;
  el.stepNote.textContent  = step.note;

  el.codePanel.innerHTML = pattern.code.map((line, i) => {
    const active = i === step.lineIndex;
    return `<div class="code-line${active ? " active" : ""}">
      <span class="line-num">${i + 1}</span>
      <span class="line-text">${escHtml(line)}</span>
    </div>`;
  }).join("");

  el.varBody.innerHTML = step.variables.map(v => {
    const cls = v.changed ? " class=\"var-updated\"" : "";
    return `<tr${cls}>
      <td class="var-name">${escHtml(v.name)}</td>
      <td class="var-value">${escHtml(v.value)}</td>
      <td class="var-change">${v.changed ? "更新" : "変化なし"}</td>
    </tr>`;
  }).join("");

  el.btnFirst.disabled = state.stepIndex === 0;
  el.btnPrev.disabled  = state.stepIndex === 0;
  el.btnNext.disabled  = state.stepIndex === total - 1;
  el.btnLast.disabled  = state.stepIndex === total - 1;
}

// ── Navigation ────────────────────────────────────────────
el.btnFirst.addEventListener("click", () => {
  state.stepIndex = 0;
  renderStep();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

el.btnPrev.addEventListener("click", () => {
  if (state.stepIndex > 0) {
    state.stepIndex--;
    renderStep();
  }
});

el.btnNext.addEventListener("click", () => {
  const max = currentPattern().steps.length - 1;
  if (state.stepIndex < max) {
    state.stepIndex++;
    renderStep();
  }
});

el.btnLast.addEventListener("click", () => {
  state.stepIndex = currentPattern().steps.length - 1;
  renderStep();
});

// ── Service Worker ────────────────────────────────────────
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

// ── Boot ──────────────────────────────────────────────────
loadPatterns();
