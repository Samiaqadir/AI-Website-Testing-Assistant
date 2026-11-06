import { TestCase, DashboardMetrics } from './types';

export function generateMarkdownSummary(
  tests: TestCase[],
  metrics: DashboardMetrics,
  testedBy = 'Samia | AI Website Testing Assistant'
): string {
  const timestamp = new Date().toISOString();
  const humanDate = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  const failedTests = tests.filter((t) => t.status === 'Failed');
  const passedTests = tests.filter((t) => t.status === 'Passed');
  const pendingTests = tests.filter((t) => t.status === 'Not Run');

  let md = `# QA Executive Test Execution Summary
**Application:** Samia | AI Website Testing Assistant  
**Auditor / Runner:** ${testedBy}  
**Execution Timestamp:** ${humanDate} (${timestamp})  
**Build Environment:** Production-Staging (Next.js App Router)  

---

## 1. Executive Metric Summary

| Metric | Count | Percentage |
| :--- | :---: | :---: |
| **Total Tests** | **${metrics.total}** | 100% |
| **Passed Tests** | **${metrics.passed}** | ${metrics.passRate.toFixed(1)}% |
| **Failed Tests** | **${metrics.failed}** | ${((metrics.failed / (metrics.total || 1)) * 100).toFixed(1)}% |
| **Not Run (Pending)** | **${metrics.notRun}** | ${((metrics.notRun / (metrics.total || 1)) * 100).toFixed(1)}% |
| **Critical Defects** | **${metrics.criticalIssues}** | ${metrics.failed > 0 ? 'Action Required' : 'None'} |

> **Overall Health Assessment:**  
> ${
    metrics.failed === 0
      ? '🟢 **STABLE** — All executed test journeys passed successfully with zero blocking defects.'
      : metrics.criticalIssues > 0
      ? `🔴 **ACTION REQUIRED** — ${metrics.criticalIssues} Critical blocker defect(s) detected. Fixes must be deployed before release.`
      : '🟡 **MONITOR** — Non-critical defects observed. Review defect backlog below.'
  }

---

## 2. Test Execution Matrix

| Test ID | Module | Title | Severity | Status | Latency |
| :--- | :--- | :--- | :---: | :---: | :---: |
${tests
  .map(
    (t) =>
      `| \`${t.id}\` | ${t.module} | ${t.title} | **${t.severity}** | ${
        t.status === 'Passed'
          ? 'Passed'
          : t.status === 'Failed'
          ? 'FAILED'
          : 'Not Run'
      } | ${t.durationMs ? `${t.durationMs}ms` : '—'} |`
  )
  .join('\n')}

---

## 3. Defect Review & Evidence Dossier

${
  failedTests.length === 0
    ? '_No failures recorded during this test execution cycle._'
    : failedTests
        .map((t, idx) => {
          const d = t.defect;
          if (!d) {
            return `### ${idx + 1}. [${t.id}] ${t.title}\n*No detailed defect record registered.*`;
          }
          return `### ${idx + 1}. [${d.id}] ${d.title}
- **Associated Test:** \`${t.id}\` — ${t.title}
- **Target Route / Endpoint:** \`${t.route || 'N/A'}\`
- **Target Selector / DOM Element:** \`${d.targetElement || 'N/A'}\`
- **Severity Level:** **${d.severity.toUpperCase()}**
- **Reported At:** ${d.reportedAt}
- **Status Code / Error ID:** \`${d.errorCode || 'UNKNOWN'}\`

#### Defect Description:
${d.description}

#### Steps to Reproduce:
${d.stepsToReproduce.map((s, i) => `${i + 1}. ${s}`).join('\n')}

#### Expected vs Actual Result:
- **Expected:** ${d.expectedResult}
- **Actual:** ${d.actualResult}

#### HTTP Error Logs & Stack Trace Evidence:
\`\`\`text
${d.errorLogs}
\`\`\`

#### Attached Evidence Files:
${
  d.attachments.length > 0
    ? d.attachments
        .map(
          (att) =>
            `- 📎 **${att.name}** (${att.type}) — ${att.size || 'N/A'} [Recorded: ${att.timestamp}]`
        )
        .join('\n')
    : '- _No external evidence files attached._'
}

${
  d.aiAnalysis
    ? `#### AI Root Cause Analysis & Proposed Fix:
> **Root Cause (${d.aiAnalysis.confidence}% Confidence):**  
> ${d.aiAnalysis.rootCause}

> **Recommended Remediation:**  
> ${d.aiAnalysis.recommendedFix}

\`\`\`typescript
${d.aiAnalysis.codeSnippet || '// No code snippet provided'}
\`\`\`
`
    : ''
}
---`;
        })
        .join('\n\n')
}

## 4. Quality Assurance Sign-off
- **Lead QA Engineer:** Samia Qadir
- **Automation Engine:** AI Website Testing Assistant v1.0
- **Verification Result:** ${failedTests.length === 0 ? 'Approved for Staging/Release' : 'Blocked on Open Defects'}
- **Generated via:** One-Page QA Summary Export

`;

  return md;
}

export function generateCsvSummary(tests: TestCase[], metrics: DashboardMetrics): string {
  const headers = [
    'Test ID',
    'Title',
    'Module',
    'Severity',
    'Status',
    'Duration (ms)',
    'Route',
    'Defect ID',
    'Defect Title',
    'Target Selector',
    'Error Code',
    'Error Logs Summary',
    'Last Run',
  ];

  const escapeCsv = (str: string | undefined | null) => {
    if (!str) return '""';
    const clean = str.replace(/"/g, '""').replace(/\r?\n/g, ' ');
    return `"${clean}"`;
  };

  const rows = tests.map((t) => {
    return [
      escapeCsv(t.id),
      escapeCsv(t.title),
      escapeCsv(t.module),
      escapeCsv(t.severity),
      escapeCsv(t.status),
      escapeCsv(t.durationMs ? `${t.durationMs}` : ''),
      escapeCsv(t.route || ''),
      escapeCsv(t.defect?.id || ''),
      escapeCsv(t.defect?.title || ''),
      escapeCsv(t.defect?.targetElement || ''),
      escapeCsv(t.defect?.errorCode || ''),
      escapeCsv(t.defect?.errorLogs ? t.defect.errorLogs.slice(0, 150) + '...' : ''),
      escapeCsv(t.lastRun || ''),
    ].join(',');
  });

  // Prepend summary rows
  const summaryHeader = [
    '# SUMMARY METRICS',
    `Total Tests: ${metrics.total}`,
    `Passed: ${metrics.passed}`,
    `Failed: ${metrics.failed}`,
    `Not Run: ${metrics.notRun}`,
    `Pass Rate: ${metrics.passRate.toFixed(1)}%`,
    `Critical Issues: ${metrics.criticalIssues}`,
  ].join('\n');

  return `${summaryHeader}\n\n${headers.join(',')}\n${rows.join('\n')}`;
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

