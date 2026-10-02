# SACHIB ENERGY — Detailed Implementation Plan v2.0
### Intelligent Church Energy Solution
> *“Light in every dwelling.”* — Exodus 10:23
> **Source:** `prd/PRD.md` (Phase 1 Q1) + `Copy of SACHIB_CEnergy_PRD_Q1.docx.md`
> **Repo:** `SarahChidinma/SACHIB-ENERGY-PILOT` | **Branch:** `main`
> **Users:** 2 types only — Admin (incl. Designer subtype) + Member / Energy User

---

## 0. PRD Traceability — What We Are Building

| PRD Section | Must Deliver in Q1 | Maps to Plan Phase |
| :--- | :--- | :--- |
| §2 Promise: Know / Predict / Optimize / Monitor anywhere | Live dashboard + forecast + advice + remote view | Phase 2, 3, 6 |
| §4 Validation: 70% unreliable, 60% outages 3-4x/wk, 89% max interest, 67% definite buy, blockers = cost + quality | Credibility-first: SoH/diagnostics, savings ledger, audit export | Phase 2, 5 |
| §5 Users: **2 types only** | Admin (Ops + Designer) vs Member permission gate | Phase 4 |
| §7 Capabilities: Monitor/Predict/Analyze/Advise/Optimize/Alert/Remote (+Eventual Control) | All except Control = read-only + shed-action simulation in Q1 | Phase 2, 3, 4 |
| §7.2 AI Advantage: from "35%" to "35% + will deplete by 03:45, shed loads" | Depletion forecaster + 3-tier advisory + one-click action | Phase 3 |
| §8 Journey: Connect→View→Analyze→Predict→Advise→Act→Monitor remotely | Mock-connect + full journey on one page | Phase 2–6 |
| §9 Impact: diesel/₦ saved, business/health/education/employment | Diesel/₦/gen-hours tracker + welfare-packs equivalent | Phase 5 |
| §10-12 Boundary: software intelligence layer on partner hardware, NO manufacturing in Q1 | No hardware fab, adapter-pattern telemetry for future inverters | ADR-3, Phase 6 |

**Q1 Out of Scope (explicit):** real inverter control, payments/financing, multi-org SaaS backend, manufacturing. We leave seams for them but don't build them.

---

## 1. Product Principles & Q1 Boundary

1. **Credibility before features.** Every number must show source + health (SoH, efficiency, cycles) — addresses #1 blocker (quality).
2. **One page that lives.** `index.html` is the pilot. No router, no build step. Opens by double-click.
3. **Designer = Admin.** No third role. Designer gets Admin access scoped to design/config (sizing, circuits, presets). Enforced by a single `roleGate()`.
4. **Mock now, integrate later.** All telemetry goes through `TelemetryAdapter` so Phase-2 real inverters swap in without UI rewrites.
5. **Mission money visible.** Diesel litres, ₦, gen-hours, welfare-packs always on screen — ties to §4.6 voice-of-customer.

---

## 2. Users & Permissions (2 Types Only)

### Type 1 — Admin (Ops + Designer subtype)
- **Who:** Church admin / Facility / Energy manager (operations) + **Designer** (sizing, circuit map, presets, commissioning defaults).
- **Can:** onboard site, connect hardware (mock in Q1), configure circuits + service modes, manage Member access, view all data, act on advisories, export audits, use remote view. Remote *control* simulated as eco-shed only.
- **Cannot (Q1):** billing/org ownership unless Owner flag (reserved, not built).

### Type 2 — Member / Energy User
- **Who:** Business owners, households, school/clinic/office staff.
- **Can:** view own site(s), receive alerts/advisories, monitor remotely, track savings, toggle own non-essential loads.
- **Cannot:** configure system, manage users, export compliance audits, change presets.

**Implementation:** `AppState.role = 'admin' | 'designer' | 'member'` where `designer` inherits `admin` permissions + shows Design panel. `roleGate('admin')` hides: circuit editor, preset editor, audit export, facility switcher admin actions. Prototype switch in header (`#roleText`) — already in `index.html:878`, extend to 3-way: Admin / Designer / Member view.

---

## 3. Brand, Logo & Visual Identity

### 3.1 Logo Concept — "Dwelling Light"
- **Mark:** rounded-square dwelling (roof) + rising sun + subtle cross-beam in negative space. One mark, no stock icon.
- **Construction:** 32×32 grid, 4px stroke, roof angle 90°, sun = 8-ray circle clipped at horizon, cross formed by roof ridge + sun pillar.
- **Colors:** Solar Gold `#F59E0B` (sun), Energy Emerald `#10B981` (dwelling base / growth), on Deep Navy `#060A10`. Mono fallback: white on navy.
- **Lockup:** mark + `SACHIB` (Outfit 800, tracking -0.02em) + `ENERGY` (Outfit 500, gold, letterspaced 0.18em) + motto micro-caption.
- **Files to add:** `assets/logo.svg`, `assets/logo-mono.svg`, `assets/favicon.svg` (all inline-SVG, no binary). Reference from `index.html` header + `design.html` brand section.
- **Inline starter (drop into header, replace emoji):**

```html
<svg width="34" height="34" viewBox="0 0 32 32" fill="none" aria-label="SACHIB Energy logo">
  <rect x="1.5" y="1.5" width="29" height="29" rx="8" fill="#0C1322" stroke="rgba(245,158,11,.4)"/>
  <circle cx="16" cy="14" r="5.2" fill="#F59E0B"/>
  <g stroke="#F59E0B" stroke-width="1.6" stroke-linecap="round">
    <path d="M16 5.5v2M8.5 8.5l1.4 1.4M23.5 8.5l-1.4 1.4M6 14h2M24 14h2"/>
  </g>
  <path d="M8 20L16 13l8 7" stroke="#F8FAFC" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M11 19.5V24h10v-4.5" stroke="#10B981" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 13v11" stroke="rgba(248,250,252,.28)" stroke-width="1.2"/>
</svg>
```

- **Acceptance:** renders at 16px favicon → 64px header without blur; passes contrast on navy; mono version legible in CSV/PDF export header.

### 3.2 Typography / Color (already in `design.html`, lock in Phase 1)
- Headings: Outfit; Body: Inter; Numbers: JetBrains Mono (all telemetry + ₦).
- Tokens: `--solar-gold #F59E0B`, `--energy-emerald #10B981`, `--grid-blue #3B82F6`, `--battery-cyan #06B6D4`, `--generator-amber #F97316`, `--alert-crimson #EF4444`, bg `#060A10/#0C1322`, text `#F8FAFC/#94A3B8/#64748B`.
- Glassmorphism cards, 8/14/20px radii, glow shadows for solar/emerald only.

---

## 4. Architecture Decisions (ADRs)

### ADR-1 — Vanilla HTML/CSS/JS, No Build (LOCKED for pilot)
- **Choice:** Single `index.html` + `design.html` tokens, ES6 modules inline, no npm/vite/react.
- **Why:** zero-install grading, double-click run, OneDrive-safe. Tradeoff: manual discipline for modularity (enforce `AppState → Engine → Render` pattern).
- **Seam:** `js/` split later without rewrite (state.js, telemetry.js, forecast.js, advisory.js, savings.js).

### ADR-2 — Client-Only Data: IndexedDB + LocalStorage (LOCKED for Q1)
- **Choice:** IndexedDB `sachib.energy.v1` (stores: telemetry 1s→rollup 1min, events, audits) + LocalStorage (prefs, role, facility, presets, diesel price).
- **Why:** offline pilot, no secrets in repo, no server cost. Tradeoff: single-device, no multi-user sync — acceptable for pilot, documented.
- **Schema v1:** `sites{id,name,type}`, `telemetry{ts,siteId,solarKw,battSoc,loadKw,genKw,irradiance}`, `events{ts,severity,msg}`, `auditDaily{date,solarKwh,litres,ngn,genHrs}`.

### ADR-3 — Telemetry Adapter Pattern (REQUIRED)
- **Choice:** `TelemetryAdapter.read()` returns `{solarKw,battSoc,loadKw,genKw,irradiance,temp}`. Q1 impl = `MockInverter` (diurnal curve + noise). Future = `ModbusAdapter` / `MQTTAdapter` with same shape.
- **Why:** satisfies §12 boundary (partner hardware later) without UI churn.

### ADR-4 — Forecast = Transparent Math, Not Black Box (Q1)
- `NetDeficit = Load − PV`; `RuntimeHrs = UsableKWh / max(NetDeficit,0.05)`; depletion time = now + runtime; irradiance curve = sine 06:00→18:00 × cloud factor. Show formula in tooltip. ML/sky-API deferred to Phase 2 roadmap.

### ADR-5 — Auth = Local Role Mock + Gate (Q1)
- `localStorage sachib.role`; `roleGate()` hides admin-only DOM. No passwords/tokens in repo. Real auth (Supabase/Auth.js) is Phase-7 seam only.

### ADR-6 — Design Tokens Single Source
- `design.html` is source of truth; `index.html` copies tokens verbatim. Any token change → update both + note in commit.

---

## 5. Target File Structure (end of Q1)

```text
SACHIB-ENERGY-PILOT/
├── index.html              # pilot app (only page)
├── design.html             # tokens + components + logo spec
├── assets/
│   ├── logo.svg / logo-mono.svg / favicon.svg
│   └── icons/ (inline SVG set, no emoji in UI)
├── prd/PRD.md
├── IMPLEMENTATION_PLAN.md  # this file
├── README.md
└── docs/
    ├── sizing-notes.md     # P_pv + Battery formulas from README
    └── pilot-checklist.md  # Sunday-service dry run script
```

---

## 6. Phased Roadmap — Design System → Everything

### PHASE 0 — Repo & Tooling Foundation ✅ DONE
- [x] `main` branch, remote `SACHIB-ENERGY-PILOT`, credential-saved push, 6 files.
- Acceptance: `git pull && git push` with no login; GitHub shows 1 commit.

### PHASE 1 — Design System Lock + Logo (START HERE)
**Goal:** tokens + components + logo identical in both HTML files. PRD: §2 promise, §7.1.
- [ ] Task 1.1 Tokens sync: copy `:root` from `design.html:11-49` → `index.html`, verify gold/emerald/blue/cyan/amber/crimson + radii + shadows.
- [ ] Task 1.2 Component library in `design.html`: advisory card (3 tiers), node card, mode card, load item, slider, savings stat, status chip. Each with do/don't + contrast note.
- [ ] Task 1.3 Logo: add `assets/*.svg` + inline in headers, favicon link, export header. Remove emoji logo.
- [ ] Task 1.4 Accessibility: focus rings, `aria-live` on advisory, mono numerals, 4.5:1 text check, keyboard toggles.
- **Acceptance:** side-by-side `design.html` vs `index.html` same palette/type; logo legible 16–64px; Lighthouse a11y ≥90.
- **Output:** commit `feat(design): lock tokens + dwelling-light logo`.

### PHASE 2 — Core Telemetry & Living Topology
**Goal:** 4 nodes pulse with truthful numbers. PRD §7.1 Monitor, §8 steps 1–2.
- [ ] Task 2.1 Heartbeat engine (1–3s): diurnal irradiance sine + noise, SoC integrate, load = base + circuits + mode. Files: inline `tick()` + `TelemetryAdapter`.
- [ ] Task 2.2 Flow visualizer: Solar→Battery / Solar+Battery→Load / Battery→Load / Gen→Load pulses (`#flowSolarBat` etc. in `index.html:1003-1016`).
- [ ] Task 2.3 Health diagnostics: SoH, cycles, temp, voltage, PV string V, inverter % (`#batterySoH`, `#pvStringV` etc.). Degrade SoH 0.001%/cycle.
- **Math:** `UsableKWh = RatedKWh × DoD × η_inv`; clamp SoC 5–100%, Gen kicks at SoC≤12% or deficit>30min.
- **Acceptance:** night → Battery→Load only; midday surplus → Solar→Battery pulse; Gen standby 0.00kW unless forced; no NaN across 10-min soak.
- **Output:** commit `feat(telemetry): living 4-node flow + diagnostics`.

### PHASE 3 — AI Predictive & Prescriptive Engine (DIFFERENTIATOR)
**Goal:** from "35%" to "depletes 03:45, shed A/C". PRD §7.2, §8 steps 3–6.
- [ ] Task 3.1 Forecaster: net deficit, runtime hrs, depletion timestamp (`#depletionTime`), timeline bar. Tooltip shows formula.
- [ ] Task 3.2 3-tier banner (`#advisoryBanner`): 🟢 Optimal / 🟡 Caution / 🔴 Critical with thresholds (green: runtime > next service +2h; yellow: <2h; red: depletes before next service).
- [ ] Task 3.3 One-click actions: `Shed A/C` (−3.1kW), `Prioritize charge`, `Reserve 30% for Sunday` — recalc instantly + turn badge green. Wire `toggleEcoMode()`, `simulateCloudEvent()`.
- **Acceptance:** set sun slider 20% + SoC 35% → red banner with time; click Shed → runtime +≥2h and badge flips; cloud sim reproducible.
- **Output:** commit `feat(ai): depletion forecast + prescriptive actions`.

### PHASE 4 — Roles, Facilities, Modes, Circuits (2-USER MODEL)
**Goal:** Admin/Designer vs Member enforced. PRD §5 (2 types), §8–9.
- [ ] Task 4.1 Role gate: header switcher Admin / Designer / Member; `designer` shows +Design panel (sizing defaults, circuit map); `member` hides editors + export + facility admin. Persist in LocalStorage.
- [ ] Task 4.2 Service modes: Normal / Sunday / Vigil / Midweek / Admin (`#modePresetsGrid`) — each = load vector (e.g. Sunday: A/C 3.1 + AV 1.2 + Lights 0.9; Vigil: AV 0.6 + Security 0.4, A/C cycled).
- [ ] Task 4.3 Facility hub: Grace Cathedral / St Luke Clinic (24/7 fridge priority, never shed) / Faith Academy (day pump) / Grace Bakery (freezer holdover 2h). Switching rewrites circuits + labels.
- [ ] Task 4.4 Circuit controls (`#circuitsList`): per-circuit kW + essential flag; shedding respects essential (clinic fridge unsheddable, shows lock).
- **Acceptance:** Member cannot see Export/Design; Designer can edit circuits but not Owner; Vigil overnight sim survives to 06:00 on battery; clinic fridge never shed.
- **Output:** commit `feat(roles): admin/designer/member + modes + facilities`.

### PHASE 5 — Mission Money, History & Audit Export
**Goal:** diesel/₦ proof + accountable reports. PRD §4.6, §9.1.
- [ ] Task 5.1 Savings engine: `Litres = SolarKWh/3.2`; `₦ = Litres × price` (editable, default ₦1300); gen-hours avoided; `welfarePacks = floor(₦/4500)`. Live in `#dieselLitres/#nairaSavings/#welfarePacks`.
- [ ] Task 5.2 History: IndexedDB rollup + SVG chart (gen vs load, 24h) + event log. Seed weekly church profile.
- [ ] Task 5.3 Export: one-click CSV (Blob API) `audit-YYYY-MM-DD.csv` with header incl. logo name + role + facility + diesel price; JSON dump for debug.
- **Acceptance:** 10kWh solar → 3.12L → ₦4062 at 1300; CSV opens in Excel; changing price recalculates history correctly.
- **Output:** commit `feat(impact): savings ledger + history + CSV export`.

### PHASE 6 — Mobile PWA Polish + Pilot Readiness (Q1 EXIT)
**Goal:** facility director can run Sunday from a phone offline. PRD §8 step 7.
- [ ] Task 6.1 Responsive: cards stack, topology → vertical flow, big touch targets (≥44px), sticky advisory on mobile.
- [ ] Task 6.2 Offline: Service Worker cache `index.html` + storage; "Offline • showing cached telemetry" badge; sliders still simulate.
- [ ] Task 6.3 QA + pilot script: `docs/pilot-checklist.md` (Sunday dry run: 09:00 service, 18:00 fellowship, vigil overnight); 10-min soak no errors; a11y + contrast pass.
- **Exit criteria (Q1 DONE):** all Phase 1–6 acceptance green; demo: connect(mock)→view→predict 03:45→shed→save ₦→export CSV→remote view on phone.
- **Output:** tag `v0.1-pilot` + commit `chore(release): v0.1 pilot ready`.

### PHASE 7 — Beyond Q1 (SEAMS ONLY, DO NOT BUILD)
- Real inverter (Modbus/MQTT) behind `TelemetryAdapter`; cloud backend + auth; multi-site fleet; financing ledger; manufacturing BOM hook. Document interface, no code in Q1.

---

## 7. Sizing Reference (for Designer subtype, from project README)

```text
P_pv (kWp) = E_daily / (PSH_worst-month × η_sys)
Battery_kWh = (E_daily × Autonomy_days) / (DoD × η_inv × η_batt)
Target: 1.5–2.5d autonomy, LiFePO4, LPSP <1% for ~99% availability
```

Designer panel shows these as read-only defaults + autonomy slider; full calculator is Phase-7.

---

## 8. Testing & Definition of Done (per phase)

- **Soak:** 10-min heartbeat, no NaN/undefined, memory flat.
- **Scenario matrix:** midday surplus / evening ramp / night discharge / overcast (sun 15%) / low SoC (15%) / Sunday peak / Vigil overnight / clinic priority.
- **Role matrix:** Admin sees all; Designer sees +Design; Member sees view-only (screenshot each).
- **Export check:** CSV opens, ₦ math matches, header has date/facility/role.
- **Perf:** first paint <1s local, tick <5ms, IndexedDB write batched 1/min.

---

## 9. Risks & Mitigations

| Risk | Mitigation |
| :--- | :--- |
| Mock ≠ real inverter | Adapter pattern + document Modbus map now |
| Overpromising AI | Label "rule-based forecast (Q1) — ML later", show formula |
| Cost concern (§4.5) | Savings ledger + export proves payback; partnership hardware note in README |
| Scope creep to backend/mfg | §12 boundary in every PR; Phase-7 seam only |
| Token/secret leak | No secrets in repo; localStorage only; `.gitignore` covers `.env` |

---

## 10. Immediate Sprint (next 3 commits)

| Order | Action | Output |
| :---: | :--- | :--- |
| 1 | Phase 1: tokens + logo assets + header lockup | `feat(design)` commit |
| 2 | Phase 2: heartbeat + flow pulses + diagnostics | `feat(telemetry)` commit |
| 3 | Phase 3: depletion time + 3-tier banner + shed action | `feat(ai)` commit |
| 4 | Tag + push | `v0.1-pilot` |

---
*SACHIB Energy — Implementation Plan v2.0 • 2-user model • Q1 pilot scope • Ready for execution*
