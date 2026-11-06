# Samia | AI Website Testing Assistant

> **Autonomous QA Automation & AI-Driven Regression Suite**  
> Role: Senior QA Automation & AI Engineer | Framework: Next.js (App Router), Node.js, Tailwind CSS, TypeScript

---

## 📌 Project Overview

**Samia | AI Website Testing Assistant** is a modern, modular end-to-end QA automation framework and real-time testing dashboard designed to audit web applications, orchestrate synthetic user journeys, capture deterministic defects, and generate executive QA compliance dossiers.

The project pairs a **headless automated CLI test runner** (`npm run test:demo`) with an **interactive web dashboard** (`npm run dev`) featuring real-time test execution streaming, visual pass/fail indicator bars, defect triage modals with visual screenshots, and one-click QA report exports.

---

## 💻 Prerequisites & Environment

| Component | Minimum Requirement | Recommended |
| :--- | :--- | :--- |
| **Node.js** | `>= 18.17.0` | `v20.x` LTS or newer |
| **NPM** | `>= 9.0.0` | `v10.x` / `v11.x` |
| **Operating System** | Windows 10/11, macOS, Linux | Cross-platform |
| **Browser Engine** | Headless Chromium, Blink, WebKit | Standard modern evergreen browsers |
| **Terminal Shell** | PowerShell, Bash, Zsh | UTF-8 enabled |

---

## ⚡ Quickstart & Installation

Clone the repository and install dependencies with a single command:

```bash
# 1. Clone repository (or navigate to project directory)
cd ai-qa-testing-assistant

# 2. Install dependencies (lightweight, zero bloated test packages)
npm install
```

---

## 🚀 How to Run the Demo

### 1. Terminal CLI Test Runner (Single Command)
Run the automated deterministic test suite directly from your terminal:

```bash
npm run test:demo
```

**What happens during this run:**
- Executes **12 granular web tests** covering full-stack web integrity.
- Streams live color-coded execution logs (`PASS`/`FAIL`, test name, timestamp, millisecond runtime).
- Automatically traps and formats **1 detailed defect** (`DEF-001`: Modal Focus Trap violation) with target DOM selector, expected vs. actual outcomes, steps to reproduce, and AI root cause diagnosis.
- Auto-generates structured reports:
  - `reports/qa-summary-report.json`
  - `reports/qa-summary-report.md`
  - `QA_REPORT.md`

### 2. Interactive Web Dashboard (UI Mode)
Launch the responsive dark-themed dashboard to visually run tests and review defects:

```bash
npm run dev
```

Open your browser at: **[http://localhost:3000](http://localhost:3000)**

**UI Features:**
- **Executive Metric Counters:** Total Tests, Passed, Failed, and Not Run.
- **Visual Status Progress Bar:** Multi-color proportional distribution bar with latency telemetry.
- **Run Pending Tests:** Real-time test simulation updating statuses, metrics, and terminal logs live.
- **Review Defect Modal:** Deep defect inspection displaying target selector, reproduction steps, HTTP error traces, and screenshot previews.
- **Export QA Summary:** Instant 1-click downloads for Markdown (`.md`) and CSV (`.csv`) summaries.

---

## 🎯 Test Scope & Coverage

The automated test suite (`tests/specs/web-suite.spec.mjs`) deterministically covers:

| Test ID | Scope / Category | Description | Target Selector / Route |
| :---: | :--- | :--- | :--- |
| `TC-01` | **Network & Routing** | Page Load & HTTP Status 200 Verification | `/` (Content-Type: `text/html`) |
| `TC-02` | **SEO & Document Head** | Meta tags, OpenGraph, Charset & Title presence | `<title>`, `<meta name="viewport">` |
| `TC-03` | **Responsive Viewport** | Mobile (375px) and Desktop (1280px) layout integrity | `body`, `.max-w-7xl`, zero horizontal scroll |
| `TC-04` | **Navigation & Headers** | Navbar header links, brand logo anchor integrity | `header nav a`, `a.logo-link` |
| `TC-05` | **Interactive CTAs** | Primary CTA button clickability, hover, & focus state | `button.cta`, `button[title*="Run"]` |
| `TC-06` | **Form Validation** | Empty submission rejection & input error trigger | `form#qa-input-form`, `:invalid` fields |
| `TC-07` | **Form Submission** | Valid payload submission & client state transition | `form`, `button[type="submit"]` |
| `TC-08` | **Media & Assets** | Image asset loading (404 detection) & `alt` tags audit | `img[src]`, `svg[role="img"]` |
| `TC-09` | **Accessibility (a11y)** | ARIA landmarks, form label bindings, WCAG AA contrast | `<main>`, `<header>`, `<footer>`, `label[for]` |
| `TC-10` | **Intentional Edge-Case** | Modal keyboard focus trap & escape boundary check | `div.dialog-overlay > div.modal-content` |
| `TC-11` | **API & Webhooks** | REST endpoint health check & JSON payload schema | `/api/health`, `application/json` |
| `TC-12` | **Runtime Reliability** | React error boundary & unhandled rejection guard | `window.onerror`, Error Boundary state |

---

## ⚠️ Known Limitations

In compliance with enterprise QA security policies:
1. **Third-Party Anti-Bot Challenges:** CAPTCHA, Cloudflare Turnstile, and reCAPTCHA challenge solvers are excluded by design to prevent security circumvention.
2. **Complex Canvas WebGL Contexts:** Deep pixel-perfect assertions on non-DOM WebGL `<canvas>` elements require dedicated GPU frame grabbers.
3. **Hard Hardware 2FA / Passkeys:** WebAuthn hardware security keys requiring physical USB biometric touch are simulated via mock credentials.

---

## 📁 Artifacts & Output Locations

All test execution runs automatically output versioned reports:

| Artifact | Location | Purpose |
| :--- | :--- | :--- |
| **JSON QA Report** | [`/reports/qa-summary-report.json`](file:///c:/Users/samiaqadir/Desktop/SMJPROJECTS/ai-qa-testing-assistant/reports/qa-summary-report.json) | Structured machine-readable schema for CI/CD and Jira integration |
| **Markdown QA Report** | [`/reports/qa-summary-report.md`](file:///c:/Users/samiaqadir/Desktop/SMJPROJECTS/ai-qa-testing-assistant/reports/qa-summary-report.md) | Formatted executive markdown summary with metrics and defect dossier |
| **Root Compliance Report** | [`/QA_REPORT.md`](file:///c:/Users/samiaqadir/Desktop/SMJPROJECTS/ai-qa-testing-assistant/QA_REPORT.md) | Permanent root audit record for stakeholder sign-off |

---

## 🏗️ Project Architecture

```
ai-qa-testing-assistant/
├── app/
│   ├── globals.css                # Slate/teal dark theme styles & custom scrollbars
│   ├── layout.tsx                 # Root layout with dark mode metadata
│   └── page.tsx                   # Interactive dashboard controller & state manager
├── components/
│   ├── Navbar.tsx                 # Header with AI status pill & quick defect filter
│   ├── MetricCards.tsx            # KPI metric cards (Total, Passed, Failed, Not Run)
│   ├── StatusBar.tsx              # Segmented visual progress bar & console toggle
│   ├── TestFilters.tsx            # Status, Severity, Module dropdowns & search
│   ├── TestTable.tsx              # Test matrix table with Review Defect action
│   ├── DefectModal.tsx            # Defect inspection modal (selector, traces, screenshots)
│   ├── ExecutionConsole.tsx       # Live terminal console streaming execution traces
│   └── ExportSummaryModal.tsx     # One-page Markdown & CSV export dialog
├── lib/
│   ├── types.ts                   # TypeScript interfaces (TestCase, DefectDetail, Metrics)
│   ├── initialData.ts             # 12 deterministic test journeys & Base64 screenshots
│   └── exportUtils.ts             # Client-side Markdown & CSV generator and downloader
├── tests/
│   ├── specs/
│   │   └── web-suite.spec.mjs     # 12 granular web tests (TC-01 through TC-12)
│   ├── defectLogger.mjs           # Enterprise defect schema formatter & aggregator
│   ├── reportExporter.mjs         # JSON and Markdown report generation engine
│   └── runner.mjs                 # CLI entrypoint (npm run test:demo)
├── reports/
│   ├── qa-summary-report.json     # Machine-readable test execution output
│   └── qa-summary-report.md       # Formatted Markdown QA summary
├── QA_REPORT.md                   # Root audit compliance report
├── package.json                   # Scripts: dev, build, start, test:demo
└── README.md                      # Complete documentation & usage guide
```

---

## 👨‍💻 Author & Sign-off
- **Lead QA Automation & AI Engineer:** Samia Qadir
- **Framework Status:** Production-Staging Ready
