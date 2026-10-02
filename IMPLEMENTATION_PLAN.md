# SACHIB ENERGY — Product Implementation Plan
### Intelligent Church Energy Solution
> *“Light in every dwelling.”* — Inspired by Exodus 10:23  
> **Source Document:** [Product Requirements Document (PRD.md)](prd/PRD.md)

---

## 1. Executive Overview & Plan Objective

This implementation plan translates the product vision, market validation, and architecture defined in the **SACHIB Energy PRD** into a concrete, phased engineering roadmap. 

The objective is to build a production-grade, responsive, and intelligent energy management application that empowers church administrators, facility directors, clinics, schools, and member entrepreneurs to:
1. **Monitor** live solar, battery, grid, and generator power flows from any device.
2. **Predict** solar availability and battery runtime based on dynamic facility demand and sunlight levels.
3. **Prescribe** actionable, high-priority energy advisories (e.g., shedding heavy loads before night vigils).
4. **Track** tangible mission impact: litres of diesel saved and Naira (₦) redirected from generator fuel into ministry.

---

## 2. Architecture & Technical Strategy

```mermaid
flowchart TD
    subgraph DataLayer ["Data & Telemetry Layer"]
        DS[Simulated IoT / Inverter Telemetry Stream]
        DB[(Browser IndexedDB & LocalStorage Cache)]
    end

    subgraph CoreEngine ["Intelligence & Analytics Engine"]
        PE[AI Predictive Forecast Engine\nIrradiance Curve & Battery Runtime]
        AE[Prescriptive Advisory Generator\nDeficit Warnings & Action Recommendations]
        FS[Financial & Diesel Savings Engine\nLitres Displaced & Naira Redirected]
    end

    subgraph UILayer ["User Interface (SPA / PWA)"]
        TOP[Live Energy Flow Topology]
        MOD[Facility & Service Mode Presets\nSunday Service / Night Vigil / Clinic]
        CIR[Interactive Circuit & Load Controls]
        AUD[Audit & Report Exporter (CSV/JSON)]
    end

    DataLayer --> CoreEngine
    CoreEngine --> UILayer
```

* **Core Stack:** Vanilla HTML5, Modern CSS3 (Design Tokens, Glassmorphism, Responsive Grid), Vanilla JavaScript (ES6+ modular state engine).
* **Storage:** Browser-native IndexedDB for time-series energy logs paired with LocalStorage for user preferences and facility presets.
* **Zero Backend Friction:** 100% self-contained client execution with mock IoT inverter telemetry streaming, requiring zero external server setup or npm builds.

---

## 3. Phased Implementation Roadmap

### Phase 1: Core Telemetry & Real-Time Flow Dynamics
*Focus: Establishing accurate, living power-flow metrics across the 4 power nodes (Solar PV, Battery Bank, Facility Load, Diesel Generator).*

- [ ] **Task 1.1 — Live Telemetry Heartbeat Engine**
  - Implement a configurable background ticker (1–3 second interval) simulating real-world inverter and battery fluctuation.
  - Realistic diurnal irradiance curve (morning ramp $\rightarrow$ midday peak $\rightarrow$ evening decline $\rightarrow$ night discharge).
- [ ] **Task 1.2 — Animated Power Flow Visualizer**
  - Upgrade the topology display with animated directional flow pulses showing where power is moving:
    - *Solar $\rightarrow$ Battery* (Surplus charging)
    - *Solar + Battery $\rightarrow$ Church Load* (Active daytime powering)
    - *Battery $\rightarrow$ Church Load* (Nighttime discharge)
    - *Generator $\rightarrow$ Church Load* (Emergency backup fallback)
- [ ] **Task 1.3 — Inverter & Battery Health Diagnostics**
  - Add battery state-of-health (SoH) metric, cycle count, cell temperature, and operating voltage.
  - Add inverter efficiency percentage and PV string voltage readouts.

---

### Phase 2: AI Predictive & Prescriptive Advisory Engine (PRD Section 7.2)
*Focus: Delivering the core differentiator — moving from passive monitoring to intelligent forecasting and prescriptive recommendations.*

- [ ] **Task 2.1 — Dynamic Runtime & Depletion Forecaster**
  - Algorithm that calculates:
    $$\text{Net Deficit (kW)} = \text{Facility Demand} - \text{PV Generation}$$
    $$\text{Estimated Runtime (Hours)} = \frac{\text{Usable Battery Capacity (kWh)}}{\text{Net Deficit (kW)}}$$
  - Dynamic time-of-depletion calculation (e.g., *"Battery will reach 15% cutoff at 03:45 AM"*).
- [ ] **Task 2.2 — Multi-Tier Prescriptive Advisory Banner**
  - Implement 3 severity tiers:
    - 🟢 **Optimal:** Solar surplus, battery fully cushioned for upcoming evening schedule.
    - 🟡 **Cautionary Advisory:** High load vs. declining irradiance; recommend pre-cooling or delaying laundry/pumping.
    - 🔴 **Critical Deficit Warning:** Battery will deplete before scheduled morning prayer/service; one-click action to shed non-essential circuits.
- [ ] **Task 2.3 — One-Click Action Automation**
  - Quick action buttons to immediately execute advisories (`⚡ Shed A/C Chillers`, `☀️ Prioritize Solar Charging`, `🛡️ Reserve 30% for Sunday Morning`).

---

### Phase 3: Specialized Church & Enterprise Service Presets (PRD Section 8 & 9)
*Focus: Tailoring energy management to real church operational routines and member businesses.*

- [ ] **Task 3.1 — Church Operational Mode Selector**
  - **Sunday Service Mode:** High load priority (Full Sanctuary A/C, Audio/Visual live streaming, Stage lighting).
  - **All-Night Vigil Mode:** Extended overnight battery conservation; prioritizes Audio/Mic and Security Lights while cycling A/C.
  - **Midweek / Fellowship Mode:** Zoned lighting and sound for chapel or fellowship hall only.
  - **Weekday Administrative Mode:** Office computers, pastor's study, security, and administrative lighting.
- [ ] **Task 3.2 — Multi-Facility Profile Hub (PRD Section 5.1 & 9)**
  - **Grace Cathedral (Main Sanctuary):** Large auditorium load profile.
  - **St. Luke’s Church Clinic:** 24/7 essential vaccine refrigeration, laboratory, and emergency lighting priority.
  - **Faith Academy School:** Daytime classroom fans, computer lab, and water pumping.
  - **Member Enterprise (Grace Bakery & Cold Store):** Commercial refrigeration preservation and blast freezer management.

---

### Phase 4: Financial Intelligence & Mission Impact Tracker (PRD Section 4.6 & 9.1)
*Focus: Measuring the true mission value — how much diesel was displaced and how much money was redirected to the Gospel and welfare.*

- [ ] **Task 4.1 — Diesel Displacement Calculator**
  - Convert generated solar kWh into equivalent generator diesel litres avoided:
    $$\text{Litres Displaced} = \frac{\text{Solar kWh Consumed}}{3.2 \text{ kWh/litre}}$$
- [ ] **Task 4.2 — Naira (₦) Ministry Savings Ledger**
  - Dynamic diesel price setting (e.g., ₦1,300/L).
  - Calculate cumulative daily, weekly, and monthly monetary savings.
  - Show church-centric impact metrics: *"Savings equivalent to 24 welfare food packages distributed."*
- [ ] **Task 4.3 — Generator Wear & Maintenance Avoidance**
  - Track engine run-hours avoided.
  - Estimated servicing costs and oil filter replacements deferred.

---

### Phase 5: Historical Analytics, Reporting & Mobile Polish
*Focus: Providing exportable accountability reports and a seamless mobile experience for on-the-go facility directors.*

- [ ] **Task 5.1 — Historical Energy Logs & Charts**
  - Interactive SVG/Canvas energy chart displaying hourly generation curve vs load demand curve.
- [ ] **Task 5.2 — Advanced Audit CSV / PDF Export**
  - Export structured compliance and financial audit logs with one click.
- [ ] **Task 5.3 — Mobile Optimization & Remote Monitoring Experience**
  - High-touch mobile navigation for smartphone browsers.
  - Offline caching using Service Worker / Web Storage.

---

## 4. Immediate Next Steps: Sprint 1 Execution

| Order | Action | Target Output |
| :---: | :--- | :--- |
| **Step 1** | Implement **Animated Power Flow & Real-Time Telemetry Engine** | Living, pulsing energy topology in `index.html` |
| **Step 2** | Integrate **Church Service Mode Presets** (Sunday Service, Vigil, Office) | One-touch operational preset switcher |
| **Step 3** | Enhance **AI Advisory Engine** with time-of-day deficit forecasting | Accurate depletion timestamps & recommendations |
| **Step 4** | Push updates to GitHub repository | Commit milestone to `SarahChidinma/SACHIB-CENERGY` |

---
*SACHIB Energy — Intelligent Church Energy Solution*  
*Document Version 1.0 • Ready for Sprint Execution*
