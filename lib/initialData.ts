import { TestCase } from './types';

// Helper to safely format SVG as data URI without server/client branching
const svgToDataUri = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

const rawCheckoutDefectSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" fill="#090d16">
  <rect width="800" height="450" fill="#0b1120"/>
  <!-- Browser top bar -->
  <rect width="800" height="42" fill="#0f172a"/>
  <circle cx="24" cy="21" r="6" fill="#ef4444"/>
  <circle cx="44" cy="21" r="6" fill="#f59e0b"/>
  <circle cx="64" cy="21" r="6" fill="#10b981"/>
  <rect x="90" y="10" width="560" height="22" rx="4" fill="#1e293b"/>
  <text x="105" y="25" fill="#94a3b8" font-family="monospace" font-size="11">https://app.example.com/checkout/3ds-verify?session_id=cs_test_892b11</text>
  
  <!-- Checkout UI -->
  <rect x="40" y="70" width="440" height="340" rx="8" fill="#1e293b" stroke="#334155"/>
  <text x="65" y="105" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="18">Order Summary &amp; 3D Secure Verification</text>
  <rect x="65" y="125" width="390" height="1" fill="#334155"/>
  
  <!-- Form details -->
  <text x="65" y="160" fill="#94a3b8" font-family="sans-serif" font-size="13">Cardholder Name: Samia Qadir</text>
  <text x="65" y="188" fill="#94a3b8" font-family="sans-serif" font-size="13">Card ending in 4242 (Visa Verified)</text>
  <text x="65" y="216" fill="#94a3b8" font-family="sans-serif" font-size="13">Total Amount: $149.00 USD</text>
  
  <!-- Failure Banner -->
  <rect x="65" y="245" width="390" height="90" rx="6" fill="#450a0a" stroke="#ef4444"/>
  <circle cx="95" cy="275" r="14" fill="#ef4444"/>
  <text x="90" y="280" fill="#ffffff" font-family="sans-serif" font-weight="bold" font-size="16">!</text>
  <text x="125" y="272" fill="#fecaca" font-family="sans-serif" font-weight="bold" font-size="14">HTTP 504 Gateway Timeout</text>
  <text x="125" y="295" fill="#fca5a5" font-family="monospace" font-size="11">Webhook listener did not respond within 30000ms</text>
  <text x="125" y="315" fill="#f87171" font-family="monospace" font-size="10">Event ID: evt_3ds_timeout_4920a | Signature: t=17308001</text>
  
  <!-- DevTools side panel -->
  <rect x="500" y="70" width="260" height="340" rx="6" fill="#020617" stroke="#dc2626"/>
  <rect x="500" y="70" width="260" height="28" fill="#1e1b4b"/>
  <text x="515" y="88" fill="#a5b4fc" font-family="monospace" font-size="11">Console &amp; Network Trace</text>
  <text x="510" y="120" fill="#ef4444" font-family="monospace" font-size="10">[ERR_POST_TIMEOUT]</text>
  <text x="510" y="138" fill="#94a3b8" font-family="monospace" font-size="9">POST /api/webhooks/stripe</text>
  <text x="510" y="152" fill="#ef4444" font-family="monospace" font-size="9">&gt; Status: 504 Gateway Time-out</text>
  <text x="510" y="172" fill="#fca5a5" font-family="monospace" font-size="9">Uncaught (in promise) Error:</text>
  <text x="510" y="186" fill="#fca5a5" font-family="monospace" font-size="9">Idempotency lock held for &gt; 30s</text>
  <text x="510" y="200" fill="#64748b" font-family="monospace" font-size="9">at handleWebhook (stripe.ts:84)</text>
  <text x="510" y="214" fill="#64748b" font-family="monospace" font-size="9">at processTicks (node:internal:41)</text>
</svg>`;

const rawA11yDefectSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450" fill="#090d16">
  <rect width="800" height="450" fill="#0b1120"/>
  <rect width="800" height="42" fill="#0f172a"/>
  <circle cx="24" cy="21" r="6" fill="#ef4444"/>
  <circle cx="44" cy="21" r="6" fill="#f59e0b"/>
  <circle cx="64" cy="21" r="6" fill="#10b981"/>
  <rect x="90" y="10" width="560" height="22" rx="4" fill="#1e293b"/>
  <text x="105" y="25" fill="#94a3b8" font-family="monospace" font-size="11">https://app.example.com/checkout/confirm-dialog</text>
  
  <rect x="60" y="80" width="680" height="320" rx="8" fill="#1e293b" opacity="0.4"/>
  <rect x="180" y="110" width="440" height="250" rx="10" fill="#0f172a" stroke="#14b8a6" stroke-width="2"/>
  <text x="210" y="145" fill="#f8fafc" font-family="sans-serif" font-weight="bold" font-size="16">Confirm Order Placement</text>
  
  <rect x="210" y="170" width="380" height="60" rx="6" fill="#450a0a" stroke="#ef4444"/>
  <text x="225" y="195" fill="#ef4444" font-family="sans-serif" font-weight="bold" font-size="13">WCAG 2.1 Failure: 2.1.2 No Keyboard Trap</text>
  <text x="225" y="215" fill="#fca5a5" font-family="sans-serif" font-size="11">Focus escaped active dialog onto background page navbar link</text>
  
  <rect x="210" y="290" width="120" height="36" rx="6" fill="#334155"/>
  <text x="245" y="313" fill="#f8fafc" font-family="sans-serif" font-size="13">Cancel</text>
  <rect x="350" y="290" width="160" height="36" rx="6" fill="#0d9488"/>
  <text x="375" y="313" fill="#ffffff" font-family="sans-serif" font-size="13">Confirm Purchase</text>
</svg>`;

export const mockCheckoutDefectScreenshot = svgToDataUri(rawCheckoutDefectSvg);
export const mockA11yDefectScreenshot = svgToDataUri(rawA11yDefectSvg);

export const initialTestCases: TestCase[] = [
  {
    id: 'TC-01',
    title: 'Page Load & HTTP Status 200 Verification',
    module: 'Landing Page & Routing',
    status: 'Passed',
    severity: 'Critical',
    durationMs: 42,
    lastRun: 'Just now',
    route: '/',
    description: 'Verify server responds with HTTP 200 OK, valid text/html content-type, and sub-500ms TTFB.',
  },
  {
    id: 'TC-02',
    title: 'Document Head Meta Tags & Title Presence Check',
    module: 'SEO & Document Head',
    status: 'Passed',
    severity: 'Medium',
    durationMs: 18,
    lastRun: 'Just now',
    route: '/',
    description: 'Verify <title> exists and is populated, UTF-8 charset is declared, and mobile viewport meta tag is present.',
  },
  {
    id: 'TC-03',
    title: 'Responsive Viewport Layout Check (Mobile 375px & Desktop 1280px)',
    module: 'Responsive Layout & Viewport',
    status: 'Passed',
    severity: 'High',
    durationMs: 65,
    lastRun: 'Just now',
    route: '/',
    description: 'Verify responsive breakpoint utilities render cleanly across mobile (375px) and desktop (1280px) without horizontal scrollbar overflow.',
  },
  {
    id: 'TC-04',
    title: 'Navigation Bar Links & Brand Integrity Check',
    module: 'Navigation & Headers',
    status: 'Passed',
    severity: 'High',
    durationMs: 28,
    lastRun: 'Just now',
    route: '/',
    description: 'Validate header navigation bar renders brand identity and all anchor links return valid targets without 404 dead links.',
  },
  {
    id: 'TC-05',
    title: 'Main CTA Button Clickability & State Validation',
    module: 'Interactive Elements & CTAs',
    status: 'Passed',
    severity: 'Critical',
    durationMs: 34,
    lastRun: 'Just now',
    route: '/',
    description: 'Validate primary "Run Pending Tests" and "Export QA Summary" CTA buttons are clickable, focusable, and trigger expected state updates.',
  },
  {
    id: 'TC-06',
    title: 'Form Input Validation (Empty Submission Error Trigger)',
    module: 'Form Validation & Feedback',
    status: 'Passed',
    severity: 'High',
    durationMs: 52,
    lastRun: 'Just now',
    route: '/',
    description: 'Ensure form validation triggers error state and prevents submission when mandatory fields are left empty.',
  },
  {
    id: 'TC-07',
    title: 'Valid Form Submission Handling & State Transition',
    module: 'Form Validation & Feedback',
    status: 'Passed',
    severity: 'High',
    durationMs: 88,
    lastRun: 'Just now',
    route: '/',
    description: 'Verify submitting valid payload triggers network dispatch, updates application state, and provides clear visual success feedback.',
  },
  {
    id: 'TC-08',
    title: 'Image Asset Loading & Mandatory Alt Attribute Audit',
    module: 'Media & Asset Auditing',
    status: 'Passed',
    severity: 'Medium',
    durationMs: 45,
    lastRun: 'Just now',
    route: '/',
    description: 'Ensure all image elements and SVG icons load successfully (no broken sources) and contain valid alt descriptions or aria-hidden attributes.',
  },
  {
    id: 'TC-09',
    title: 'Accessibility Baseline Audit (ARIA Landmarks, Labels & Tabs)',
    module: 'Accessibility & WCAG 2.1',
    status: 'Passed',
    severity: 'High',
    durationMs: 61,
    lastRun: 'Just now',
    route: '/',
    description: 'Validate standard ARIA landmarks (<header>, <main>, <footer>), form control label bindings, and baseline WCAG 2.1 AA color contrast.',
  },
  {
    id: 'TC-10',
    title: 'Intentional Edge-Case: Modal Dialog Keyboard Focus Trap & Escape',
    module: 'Accessibility & Edge Cases',
    status: 'Failed',
    severity: 'Critical',
    durationMs: 74,
    lastRun: 'Just now',
    route: '/checkout/confirm-dialog',
    description: 'Validate that screen readers and Tab key focus navigation loop strictly inside the open confirmation modal.',
    defect: {
      id: 'DEF-001',
      testCaseId: 'TC-10',
      title: 'Focus escapes modal dialog boundary onto background navigation link',
      severity: 'Critical',
      targetElement: 'div.dialog-overlay > div.modal-content',
      description: 'When the modal dialog is rendered, pressing Tab past the "Confirm Purchase" action button releases keyboard focus into the inert background navigation tree instead of cycling back to the initial "Cancel" button.',
      stepsToReproduce: [
        'Launch application and open the Defect Review or Confirmation modal dialog.',
        'Press Tab key sequentially through "Cancel" and "Confirm Purchase" buttons.',
        'Press Tab key once more past the final interactive button.',
        'Observe focus indicator escaping modal boundary onto background <a class="logo-link">.'
      ],
      expectedResult: 'Focus must remain strictly trapped within modal boundary as required by WCAG 2.1 Success Criterion 2.1.2 (No Keyboard Trap).',
      actualResult: 'ActiveElement escaped modal boundary and focused background element: <a class="logo-link" href="/" tabindex="0">.',
      errorCode: 'WCAG-2.1.2 / FOCUS_TRAP_LEAK',
      errorLogs: `[Axe-Core Audit Report]
Rule: "focus-order-semantics" (Severity: Serious / Blocker)
Target Element: div.dialog-overlay > div.modal-content
Expected Boundary: <dialog aria-modal="true">
ActiveElement: <a class="logo-link" href="/" tabindex="0">

Failure Stack:
at evaluateFocusTrap (lib/a11y/focusAudit.ts:84:14)
at runAccessibilitySuite (tests/specs/web-suite.spec.mjs:188:9)`,
      screenshotUrl: mockA11yDefectScreenshot,
      attachments: [
        {
          id: 'att-1',
          name: 'wcag-focus-leak-capture.png',
          type: 'image',
          dataUrl: mockA11yDefectScreenshot,
          timestamp: '2026-11-06 10:54:03',
          size: '98 KB'
        },
        {
          id: 'att-2',
          name: 'axe-core-a11y-audit.log',
          type: 'log',
          content: `axe.run() Result:
Violation: "focus-order-semantics"
Nodes affected: 1 (div.dialog-overlay > div.modal-content)
Help: Focusable elements must be contained inside modal dialog
WCAG SC: 2.1.2 (Level A)`,
          timestamp: '2026-11-06 10:54:03',
          size: '12 KB'
        }
      ],
      aiAnalysis: {
        rootCause: 'The custom Modal component uses raw <div> elements without aria-modal="true" and lacks an active keydown event listener to trap Tab / Shift+Tab cycles.',
        confidence: 98,
        recommendedFix: 'Implement keyboard focus wrap listener on keydown (Tab / Shift+Tab) or upgrade to HTML5 <dialog> with showModal().',
        codeSnippet: `const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key !== 'Tab') return;
  if (e.shiftKey && document.activeElement === firstEl) {
    lastEl.focus();
    e.preventDefault();
  } else if (!e.shiftKey && document.activeElement === lastEl) {
    firstEl.focus();
    e.preventDefault();
  }
};`
      },
      reportedAt: '2026-11-06 10:54:03'
    }
  },
  {
    id: 'TC-11',
    title: 'High-concurrency Checkout Stock Reservation & Race Conditions',
    module: 'Checkout & Cart',
    status: 'Not Run',
    severity: 'Critical',
    durationMs: undefined,
    lastRun: 'Never',
    route: '/api/cart/reserve',
    description: 'Simulate 50 parallel shoppers attempting to buy the last 2 available units of flash-sale inventory.',
  },
  {
    id: 'TC-12',
    title: 'Async Batch CSV Export Stream & Backpressure Handling',
    module: 'REST API & Webhooks',
    status: 'Not Run',
    severity: 'Medium',
    durationMs: undefined,
    lastRun: 'Never',
    route: '/api/reports/export-csv',
    description: 'Verify streaming response of 100,000 transaction records uses chunked transfer encoding without buffering the entire dataset in heap memory.',
  }
];
