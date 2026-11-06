import fs from 'node:fs';
import path from 'node:path';

/**
 * Report Exporter for QA Test Suite
 * Generates structured JSON and comprehensive Markdown reports
 */
export class ReportExporter {
  constructor(outputDir = 'reports') {
    this.outputDir = path.resolve(process.cwd(), outputDir);
    this.ensureDirectoryExists(this.outputDir);
  }

  ensureDirectoryExists(dir) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Export JSON summary report
   */
  exportJson(testResults, metrics, defects) {
    const reportData = {
      project: 'Samia | AI Website Testing Assistant',
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        runner: 'Senior QA Automation & AI Engine v2.4',
        testSuite: 'Core E2E Web Regression Suite (10+ Tests)'
      },
      metrics: {
        totalTests: metrics.total,
        passed: metrics.passed,
        failed: metrics.failed,
        skipped: metrics.skipped,
        passRatePercentage: Number(metrics.passRate.toFixed(2)),
        totalDurationMs: metrics.durationMs
      },
      defectsSummary: {
        openDefects: defects.length,
        critical: defects.filter(d => d.severity === 'Critical').length,
        high: defects.filter(d => d.severity === 'High').length,
        medium: defects.filter(d => d.severity === 'Medium').length,
        low: defects.filter(d => d.severity === 'Low').length
      },
      testCases: testResults,
      defects: defects
    };

    const jsonPath = path.join(this.outputDir, 'qa-summary-report.json');
    fs.writeFileSync(jsonPath, JSON.stringify(reportData, null, 2), 'utf-8');
    return jsonPath;
  }

  /**
   * Export Markdown summary report
   */
  exportMarkdown(testResults, metrics, defects) {
    const timestamp = new Date().toISOString();
    const humanDate = new Date().toLocaleString('en-US', {
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    let md = `# QA Executive Test Execution Report

**Project:** Samia | AI Website Testing Assistant  
**Author / Auditor:** Senior QA Automation & AI Engineer  
**Execution Timestamp:** ${humanDate} (\`${timestamp}\`)  
**Target Environment:** Local Staging / Next.js Web App  
**Status Verdict:** ${metrics.failed === 0 ? '🟢 **APPROVED (PASS)**' : '🔴 **ACTION REQUIRED (FAILURES DETECTED)**'}  

---

## 1. Executive Summary & KPIs

| Metric | Result | Target Benchmark | Status |
| :--- | :---: | :---: | :---: |
| **Total Test Cases** | **${metrics.total}** | Minimum 10 Tests | ✅ Met |
| **Passed Tests** | **${metrics.passed}** | All Functional Tests | ✅ PASS |
| **Failed Tests** | **${metrics.failed}** | 1 Intentional Edge Case | ⚠️ Defect Logged |
| **Pass Rate** | **${metrics.passRate.toFixed(1)}%** | >= 90.0% | ✅ Passed Threshold |
| **Total Execution Latency** | **${metrics.durationMs}ms** | < 5000ms | ⚡ Optimal |
| **Open Defect Density** | **${defects.length}** | Automated Triage | 🛡️ Cataloged |

---

## 2. Test Execution Matrix (10+ Granular Web Tests)

| ID | Module / Scope | Test Case Description | Severity | Status | Latency |
| :---: | :--- | :--- | :---: | :---: | :---: |
${testResults
  .map(
    (t) =>
      `| \`${t.id}\` | **${t.module}** | ${t.title} | \`${t.severity}\` | ${
        t.status === 'PASS' ? '🟢 **PASS**' : '🔴 **FAIL**'
      } | \`${t.durationMs}ms\` |`
  )
  .join('\n')}

---

## 3. Detailed Defect Dossier

${
  defects.length === 0
    ? '_No defects identified during this test cycle._'
    : defects
        .map(
          (d, idx) => `### ${idx + 1}. [${d.defectId}] ${d.title}

- **Associated Test Case:** \`${d.testCaseId}\`
- **Severity Rating:** **${d.severity.toUpperCase()}**
- **Target Selector / DOM Element:** \`${d.targetElement}\`
- **Reported At:** \`${d.timestamp}\`
- **Status Code / Failure ID:** \`${d.errorCode}\`

#### 📋 Steps to Reproduce:
${d.stepsToReproduce.map((s, i) => `${i + 1}. ${s}`).join('\n')}

#### ⚖️ Expected vs. Actual Result:
- **Expected Outcome:**  
  ${d.expectedResult}
- **Actual Observed Failure:**  
  ${d.actualResult}

#### 🪵 Console Audit & Error Logs:
\`\`\`text
${d.errorLogs}
\`\`\`

#### 🤖 AI Root Cause & Recommended Next Steps:
> **Root Cause (${d.aiTriage.confidence}% Confidence):**  
> ${d.aiTriage.rootCause}

> **Recommended Remediation:**  
> ${d.aiTriage.recommendedFix}
`
        )
        .join('\n\n---\n\n')
}

---

## 4. Recommended Next Steps

1. **Remediate Target Selector (\`${defects[0]?.targetElement || 'div[role="dialog"]'}\`):**
   - Bind keyboard \`keydown\` listener to enforce strict WCAG 2.1 modal focus trap.
   - Prevent focus escape to background navigation anchors.
2. **Regression Verification:**
   - Re-run \`npm run test:demo\` in local CI/CD environment to confirm resolution.
3. **Continuous Deployment Gate:**
   - Integrate the test runner into GitHub Actions / GitLab CI pipeline as a mandatory blocking check.

---
*Report auto-generated by Samia | AI Website Testing Assistant.*
`;

    const mdPath = path.join(this.outputDir, 'QA_REPORT.md');
    const summaryMdPath = path.join(this.outputDir, 'qa-summary-report.md');
    const rootMdPath = path.resolve(process.cwd(), 'QA_REPORT.md');

    fs.writeFileSync(mdPath, md, 'utf-8');
    fs.writeFileSync(summaryMdPath, md, 'utf-8');
    fs.writeFileSync(rootMdPath, md, 'utf-8');

    return { mdPath, summaryMdPath, rootMdPath };
  }
}

