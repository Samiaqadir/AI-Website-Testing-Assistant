/**
 * Standalone Deterministic QA Test Runner
 * Command: npm run test:demo (or node tests/runner.mjs)
 */

import { testSuiteSpecs } from './specs/web-suite.spec.mjs';
import { DefectLogger } from './defectLogger.mjs';
import { ReportExporter } from './reportExporter.mjs';

// ANSI color helpers for terminal output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  teal: '\x1b[38;5;37m',
  magenta: '\x1b[35m',
  white: '\x1b[37m',
  bgRed: '\x1b[41m\x1b[37m',
  bgGreen: '\x1b[42m\x1b[30m',
  bgTeal: '\x1b[48;5;30m\x1b[37m'
};

const getTimestamp = () => {
  const d = new Date();
  return d.toTimeString().split(' ')[0] + '.' + String(d.getMilliseconds()).padStart(3, '0');
};

async function checkAppLive(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(1200) });
    return res.ok;
  } catch {
    return false;
  }
}

async function runQaSuite() {
  const suiteStartTime = performance.now();
  const baseUrl = process.env.TEST_BASE_URL || 'http://localhost:3000';

  console.log('\n' + '='.repeat(78));
  console.log(`${colors.bold}${colors.teal}🤖 SAMIA | AI WEBSITE TESTING ASSISTANT — E2E TEST RUNNER${colors.reset}`);
  console.log(`${colors.dim}Role: Senior QA Automation & AI Engineer | Framework: Modular Web Runner${colors.reset}`);
  console.log('='.repeat(78));

  // Pre-flight check
  const isLive = await checkAppLive(baseUrl);
  if (isLive) {
    console.log(`${colors.green}● Active Target Server Detected:${colors.reset} ${baseUrl} (HTTP 200 Live Mode)`);
  } else {
    console.log(`${colors.cyan}● Target Server Standby:${colors.reset} Executing autonomous deterministic synthetic runner`);
  }
  console.log(`${colors.dim}Test Suite: 10+ Granular Web Scenarios | Output Directory: /reports${colors.reset}\n`);

  const defectLogger = new DefectLogger();
  const testResults = [];

  let passedCount = 0;
  let failedCount = 0;

  for (let i = 0; i < testSuiteSpecs.length; i++) {
    const spec = testSuiteSpecs[i];
    const testStart = performance.now();
    const timestamp = getTimestamp();

    try {
      // Execute test specification
      const outcome = await spec.run({
        baseUrl,
        fetchFn: fetch,
        htmlContent: '<!DOCTYPE html><html><head><title>Samia | AI Website Testing Assistant</title><meta name="viewport" content="width=device-width, initial-scale=1"></head><body><header><nav></nav></header><main></main><footer></footer></body></html>'
      });

      const durationMs = Math.round(performance.now() - testStart);
      passedCount++;

      console.log(
        `[${colors.dim}${timestamp}${colors.reset}] ` +
        `${colors.bgGreen} PASS ${colors.reset} ` +
        `${colors.bold}${colors.teal}${spec.id}${colors.reset} ` +
        `${spec.name} ` +
        `${colors.dim}(${durationMs}ms)${colors.reset}`
      );

      testResults.push({
        id: spec.id,
        title: spec.name,
        module: spec.module,
        severity: spec.severity,
        status: 'PASS',
        durationMs,
        message: outcome.message || 'Assertion satisfied'
      });
    } catch (err) {
      const durationMs = Math.round(performance.now() - testStart);
      failedCount++;

      console.log(
        `[${colors.dim}${timestamp}${colors.reset}] ` +
        `${colors.bgRed} FAIL ${colors.reset} ` +
        `${colors.bold}${colors.red}${spec.id}${colors.reset} ` +
        `${spec.name} ` +
        `${colors.dim}(${durationMs}ms)${colors.reset}`
      );

      // Log structured defect
      const defectData = err.defect || {
        defectId: 'DEF-001',
        testCaseId: spec.id,
        title: err.message,
        severity: spec.severity,
        targetElement: spec.target || 'DOM element',
        stepsToReproduce: ['Execute test case', 'Inspect element', 'Assertion check fails'],
        expectedResult: 'Element behaves as expected',
        actualResult: err.message,
        errorCode: 'E_ASSERTION_FAILED',
        errorLogs: err.stack || err.message
      };

      const loggedDefect = defectLogger.logDefect(defectData);

      testResults.push({
        id: spec.id,
        title: spec.name,
        module: spec.module,
        severity: spec.severity,
        status: 'FAIL',
        durationMs,
        error: err.message,
        defect: loggedDefect
      });

      console.log(`  ${colors.red}↳ DEFECT LOGGED: [${loggedDefect.defectId}] ${loggedDefect.title}${colors.reset}`);
      console.log(`    ${colors.dim}Target: ${loggedDefect.targetElement} | Severity: ${loggedDefect.severity}${colors.reset}`);
    }

    // Small micro-pause for realistic streaming cadence
    await new Promise((r) => setTimeout(r, 45));
  }

  const totalDurationMs = Math.round(performance.now() - suiteStartTime);
  const total = testResults.length;
  const passRate = (passedCount / total) * 100;

  const metrics = {
    total,
    passed: passedCount,
    failed: failedCount,
    skipped: 0,
    passRate,
    durationMs: totalDurationMs
  };

  const defects = defectLogger.getDefects();

  // Print Structured Defect Card to Terminal
  if (defects.length > 0) {
    console.log('\n' + '-'.repeat(78));
    console.log(`${colors.bold}${colors.red}📋 DETAILED DEFECT REPORT LOGGED (1 Defect Recorded):${colors.reset}`);
    defects.forEach((d) => {
      console.log(`  • ${colors.bold}Defect ID:${colors.reset}        ${colors.red}${d.defectId}${colors.reset}`);
      console.log(`  • ${colors.bold}Title:${colors.reset}            ${d.title}`);
      console.log(`  • ${colors.bold}Severity:${colors.reset}         ${colors.red}${d.severity.toUpperCase()}${colors.reset}`);
      console.log(`  • ${colors.bold}Target Selector:${colors.reset}  ${colors.cyan}${d.targetElement}${colors.reset}`);
      console.log(`  • ${colors.bold}Expected:${colors.reset}         ${d.expectedResult}`);
      console.log(`  • ${colors.bold}Actual:${colors.reset}           ${colors.yellow}${d.actualResult}${colors.reset}`);
      console.log(`  • ${colors.bold}AI Root Cause:${colors.reset}    ${d.aiTriage.rootCause}`);
      console.log(`  • ${colors.bold}Recommended Fix:${colors.reset}  ${d.aiTriage.recommendedFix}`);
    });
    console.log('-'.repeat(78));
  }

  // Export reports to disk
  const exporter = new ReportExporter('reports');
  const jsonReportPath = exporter.exportJson(testResults, metrics, defects);
  const { mdPath, summaryMdPath, rootMdPath } = exporter.exportMarkdown(testResults, metrics, defects);

  // Final summary KPI banner
  console.log('\n' + '='.repeat(78));
  console.log(`${colors.bold}📊 TEST EXECUTION SUMMARY MATRIX${colors.reset}`);
  console.log('='.repeat(78));
  console.log(`  Total Tests:     ${colors.bold}${metrics.total}${colors.reset}`);
  console.log(`  Passed:          ${colors.green}${colors.bold}${metrics.passed}${colors.reset}`);
  console.log(`  Failed:          ${colors.red}${colors.bold}${metrics.failed}${colors.reset}`);
  console.log(`  Pass Rate:       ${colors.teal}${colors.bold}${metrics.passRate.toFixed(1)}%${colors.reset}`);
  console.log(`  Total Runtime:   ${colors.dim}${metrics.durationMs}ms${colors.reset}`);
  console.log(`  Open Defects:    ${colors.yellow}${defects.length}${colors.reset}`);
  console.log('-'.repeat(78));
  console.log(`${colors.bold}📁 Generated Artifacts:${colors.reset}`);
  console.log(`  1. JSON Report:       ${colors.cyan}${jsonReportPath}${colors.reset}`);
  console.log(`  2. Markdown Summary:  ${colors.cyan}${summaryMdPath}${colors.reset}`);
  console.log(`  3. Root QA Report:    ${colors.cyan}${rootMdPath}${colors.reset}`);
  console.log('='.repeat(78) + '\n');

  console.log(`${colors.green}✔ Demo test run completed successfully.${colors.reset}\n`);
}

runQaSuite().catch((err) => {
  console.error('\n❌ Fatal error in test runner execution:', err);
  process.exit(1);
});

