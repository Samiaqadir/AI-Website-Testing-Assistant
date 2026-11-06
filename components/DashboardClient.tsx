'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { initialTestCases } from '../lib/initialData';
import { TestCase, DefectDetail, RunLog, DashboardMetrics } from '../lib/types';
import { Navbar } from './Navbar';
import { MetricCards } from './MetricCards';
import { StatusBar } from './StatusBar';
import { TestFilters } from './TestFilters';
import { TestTable } from './TestTable';
import { DefectModal } from './DefectModal';
import { ExportSummaryModal } from './ExportSummaryModal';
import { ExecutionConsole } from './ExecutionConsole';
import { 
  Play, 
  RefreshCw,
} from 'lucide-react';

export default function DashboardClient() {
  const [tests, setTests] = useState<TestCase[]>(initialTestCases);
  const [selectedDefectTest, setSelectedDefectTest] = useState<TestCase | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // Filters state
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [moduleFilter, setModuleFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Runner state
  const [isRunning, setIsRunning] = useState(false);
  const [runningTestIds, setRunningTestIds] = useState<string[]>([]);
  const [currentTestTitle, setCurrentTestTitle] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [showConsole, setShowConsole] = useState<boolean>(false);
  const [logs, setLogs] = useState<RunLog[]>([
    {
      id: 'log-0',
      timestamp: '10:00:00 AM',
      testId: 'SYSTEM',
      message: 'AI Website Testing Assistant initialized. Environment: Production-Staging. Headless runner standby.',
      level: 'info',
    },
  ]);

  // Derived metrics
  const metrics: DashboardMetrics = useMemo(() => {
    const total = tests.length;
    const passed = tests.filter((t) => t.status === 'Passed').length;
    const failed = tests.filter((t) => t.status === 'Failed').length;
    const notRun = tests.filter((t) => t.status === 'Not Run').length;
    const criticalIssues = tests.filter(
      (t) => t.status === 'Failed' && t.severity === 'Critical'
    ).length;
    const passRate = total > 0 ? (passed / total) * 100 : 0;

    return {
      total,
      passed,
      failed,
      notRun,
      passRate,
      criticalIssues,
    };
  }, [tests]);

  // Average latency
  const averageLatencyMs = useMemo(() => {
    const executed = tests.filter((t) => typeof t.durationMs === 'number' && t.durationMs > 0);
    if (executed.length === 0) return 0;
    const sum = executed.reduce((acc, curr) => acc + (curr.durationMs || 0), 0);
    return Math.round(sum / executed.length);
  }, [tests]);

  // Unique modules for filter
  const availableModules = useMemo(() => {
    const set = new Set(tests.map((t) => t.module));
    return Array.from(set).sort();
  }, [tests]);

  // Filtered test cases
  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      // Status filter
      if (statusFilter !== 'All' && test.status !== statusFilter) {
        return false;
      }
      // Severity filter
      if (severityFilter !== 'All' && test.severity !== severityFilter) {
        return false;
      }
      // Module filter
      if (moduleFilter !== 'All' && test.module !== moduleFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchId = test.id.toLowerCase().includes(q);
        const matchTitle = test.title.toLowerCase().includes(q);
        const matchRoute = test.route?.toLowerCase().includes(q);
        const matchModule = test.module.toLowerCase().includes(q);
        const matchDesc = test.description?.toLowerCase().includes(q);
        if (!matchId && !matchTitle && !matchRoute && !matchModule && !matchDesc) {
          return false;
        }
      }
      return true;
    });
  }, [tests, statusFilter, severityFilter, moduleFilter, searchQuery]);

  // Helper to append a log
  const addLog = (message: string, level: RunLog['level'] = 'info', testId: string = '') => {
    const newLog: RunLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      testId,
      message,
      level,
    };
    setLogs((prev) => [...prev, newLog]);
  };

  // Reset filters
  const handleResetFilters = () => {
    setStatusFilter('All');
    setSeverityFilter('All');
    setModuleFilter('All');
    setSearchQuery('');
  };

  // Toggle failure filter from navbar
  const handleToggleDefectsFilter = () => {
    if (statusFilter === 'Failed') {
      setStatusFilter('All');
    } else {
      setStatusFilter('Failed');
    }
  };

  // Run Pending Tests (Simulation)
  const handleRunPendingTests = async () => {
    if (isRunning) return;

    const pendingTests = tests.filter((t) => t.status === 'Not Run');
    if (pendingTests.length === 0) return;

    setIsRunning(true);
    setShowConsole(true);
    setProgressPercent(0);

    addLog(`Initiating automated test execution suite (${pendingTests.length} tests pending)...`, 'info', 'SUITE');

    for (let i = 0; i < pendingTests.length; i++) {
      const target = pendingTests[i];
      setRunningTestIds([target.id]);
      setCurrentTestTitle(target.title);

      const percent = Math.round(((i) / pendingTests.length) * 100);
      setProgressPercent(percent);

      addLog(`[Dispatch] Spawning Chromium headless worker for ${target.id} — "${target.title}"`, 'info', target.id);
      
      // Simulate network navigation & assertion latency
      await new Promise((resolve) => setTimeout(resolve, 800));

      const simulatedDuration = Math.floor(Math.random() * 280) + 120; // 120 - 400ms
      addLog(`[Assertion] Validating response headers and DOM selectors for ${target.route || target.id}...`, 'info', target.id);
      
      await new Promise((resolve) => setTimeout(resolve, 350));

      // Mark as passed
      setTests((prev) =>
        prev.map((item) =>
          item.id === target.id
            ? {
                ...item,
                status: 'Passed',
                durationMs: simulatedDuration,
                lastRun: 'Just now',
              }
            : item
        )
      );

      addLog(
        `[SUCCESS] ${target.id} passed all 8 assertions in ${simulatedDuration}ms. Status 200 OK.`,
        'success',
        target.id
      );
    }

    setProgressPercent(100);
    setRunningTestIds([]);
    setCurrentTestTitle('');
    setIsRunning(false);

    addLog(
      `Test suite execution complete. All pending tests executed successfully.`,
      'success',
      'SUITE'
    );
  };

  // Run a single test case
  const handleRunSingleTest = async (testId: string) => {
    if (isRunning) return;

    const target = tests.find((t) => t.id === testId);
    if (!target) return;

    setIsRunning(true);
    setShowConsole(true);
    setRunningTestIds([testId]);
    setCurrentTestTitle(target.title);

    addLog(`[Manual Trigger] Executing isolated test journey for ${testId}...`, 'info', testId);

    await new Promise((resolve) => setTimeout(resolve, 950));

    const simulatedDuration = Math.floor(Math.random() * 250) + 140;

    // If it was failed, let the rerun succeed to simulate fix verification!
    setTests((prev) =>
      prev.map((item) => {
        if (item.id === testId) {
          return {
            ...item,
            status: 'Passed',
            durationMs: simulatedDuration,
            lastRun: 'Just now',
          };
        }
        return item;
      })
    );

    addLog(
      `[PASS] ${testId} completed in ${simulatedDuration}ms. Regression assertions verified clean.`,
      'success',
      testId
    );

    setRunningTestIds([]);
    setCurrentTestTitle('');
    setIsRunning(false);
  };

  // Update defect details and evidence
  const handleUpdateDefect = (testId: string, updatedDefect: DefectDetail) => {
    setTests((prev) =>
      prev.map((t) => (t.id === testId ? { ...t, defect: updatedDefect } : t))
    );
    if (selectedDefectTest && selectedDefectTest.id === testId) {
      setSelectedDefectTest((prev) => (prev ? { ...prev, defect: updatedDefect } : null));
    }
    addLog(`Defect evidence updated for ${testId} (${updatedDefect.id}).`, 'info', testId);
  };

  // Reset entire test suite to initial mock state
  const handleResetEntireSuite = () => {
    setTests(initialTestCases);
    setStatusFilter('All');
    setSeverityFilter('All');
    setModuleFilter('All');
    setSearchQuery('');
    addLog('Entire test suite reset to initial factory snapshot.', 'warn', 'SYSTEM');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans" suppressHydrationWarning>
      {/* Top Navigation Bar */}
      <Navbar
        onRunPending={handleRunPendingTests}
        onOpenExport={() => setIsExportModalOpen(true)}
        onFilterDefects={handleToggleDefectsFilter}
        isRunning={isRunning}
        pendingCount={metrics.notRun}
        failedCount={metrics.failed}
        isFailedFilterActive={statusFilter === 'Failed'}
      />

      {/* Main Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 sm:px-6 lg:px-8 space-y-5" suppressHydrationWarning>
        
        {/* 1. Concise Dashboard: Metric Counters (Top Level KPI View) */}
        <section aria-label="Metric Counters">
          <MetricCards
            metrics={metrics}
            activeStatusFilter={statusFilter}
            onSelectStatusFilter={(status) => setStatusFilter(status)}
          />
        </section>

        {/* 1. Concise Dashboard: Visual Status Bar */}
        <section aria-label="Visual Status Indicators">
          <StatusBar
            metrics={metrics}
            averageLatencyMs={averageLatencyMs}
            showConsole={showConsole}
            onToggleConsole={() => setShowConsole(!showConsole)}
            logCount={logs.length}
          />
        </section>

        {/* Live Execution Console (collapsible, opens automatically when running) */}
        {showConsole && (
          <section aria-label="Live Execution Console" className="transition-all duration-300">
            <ExecutionConsole
              logs={logs}
              isRunning={isRunning}
              currentTestTitle={currentTestTitle}
              progressPercent={progressPercent}
              onClose={() => setShowConsole(false)}
              onClearLogs={() => setLogs([])}
            />
          </section>
        )}

        {/* 2 & 3. Test Journey Flow & Filters */}
        <section className="space-y-3.5" aria-label="Test Runner Matrix">
          
          {/* Section Heading & Quick Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Test Journey Suites</span>
                <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs font-mono text-slate-400">
                  {filteredTests.length}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Explore end-to-end critical paths, inspect failure evidence, and trigger automated re-runs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetEntireSuite}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/70 px-2.5 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                title="Reset test suite to original initial data"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset Suite</span>
              </button>

              {metrics.notRun > 0 && (
                <button
                  onClick={handleRunPendingTests}
                  disabled={isRunning}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-300 hover:bg-teal-500/20 active:scale-95 transition-all"
                >
                  <Play className="h-3.5 w-3.5 fill-teal-300 text-teal-300" />
                  <span>Execute {metrics.notRun} Pending</span>
                </button>
              )}
            </div>
          </div>

          {/* Multi-Dimensional Filter Bar */}
          <TestFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            severityFilter={severityFilter}
            setSeverityFilter={setSeverityFilter}
            moduleFilter={moduleFilter}
            setModuleFilter={setModuleFilter}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onResetFilters={handleResetFilters}
            totalCount={tests.length}
            filteredCount={filteredTests.length}
            availableModules={availableModules}
          />

          {/* Test Matrix Table */}
          <TestTable
            tests={filteredTests}
            onReviewDefect={(test) => setSelectedDefectTest(test)}
            onRunSingleTest={handleRunSingleTest}
            runningTestIds={runningTestIds}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Samia | AI Website Testing Assistant &copy; 2026</span>
          <span className="flex items-center gap-1 text-slate-400">
            Powered by Next.js 14 App Router, Tailwind CSS &amp; Lucide Icons
          </span>
        </div>
      </footer>

      {/* 4. Defect Review with Evidence Attachment Modal */}
      {selectedDefectTest && (
        <DefectModal
          test={selectedDefectTest}
          isOpen={!!selectedDefectTest}
          onClose={() => setSelectedDefectTest(null)}
          onUpdateDefect={handleUpdateDefect}
          onRerunTest={handleRunSingleTest}
        />
      )}

      {/* 5. One-Page QA Summary Export Modal */}
      <ExportSummaryModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        tests={tests}
        metrics={metrics}
      />
    </div>
  );
}

