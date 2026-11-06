'use client';

import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Play, 
  RotateCw, 
  Bug,
  FileText
} from 'lucide-react';
import { TestCase, TestSeverity, TestStatus } from '../lib/types';

interface TestTableProps {
  tests: TestCase[];
  onReviewDefect: (test: TestCase) => void;
  onRunSingleTest: (testId: string) => void;
  runningTestIds: string[];
}

export const TestTable: React.FC<TestTableProps> = ({
  tests,
  onReviewDefect,
  onRunSingleTest,
  runningTestIds,
}) => {
  const getSeverityBadge = (sev: TestSeverity) => {
    switch (sev) {
      case 'Critical':
        return (
          <span className="inline-flex items-center rounded-md border border-red-500/30 bg-red-950/70 px-2 py-0.5 text-xs font-semibold text-red-400">
            Critical
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center rounded-md border border-orange-500/30 bg-orange-950/70 px-2 py-0.5 text-xs font-semibold text-orange-400">
            High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center rounded-md border border-amber-500/30 bg-amber-950/70 px-2 py-0.5 text-xs font-semibold text-amber-400">
            Medium
          </span>
        );
      case 'Low':
        return (
          <span className="inline-flex items-center rounded-md border border-slate-600/40 bg-slate-800/80 px-2 py-0.5 text-xs font-semibold text-slate-300">
            Low
          </span>
        );
      default:
        return null;
    }
  };

  const getStatusBadge = (status: TestStatus, isRunning: boolean) => {
    if (isRunning) {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/40 bg-teal-950/80 px-2.5 py-1 text-xs font-medium text-teal-300 animate-pulse">
          <RotateCw className="h-3.5 w-3.5 animate-spin text-teal-400" />
          Running...
        </span>
      );
    }

    switch (status) {
      case 'Passed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-1 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            Passed
          </span>
        );
      case 'Failed':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-950/70 px-2.5 py-1 text-xs font-semibold text-rose-300 shadow-sm shadow-rose-950/50">
            <XCircle className="h-3.5 w-3.5 text-rose-400" />
            Failed
          </span>
        );
      case 'Not Run':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-xs font-medium text-slate-400">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            Not Run
          </span>
        );
    }
  };

  if (tests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/30 py-16 text-center">
        <FileText className="h-10 w-10 text-slate-600 mb-3" />
        <h3 className="text-base font-medium text-slate-300">No test cases match your criteria</h3>
        <p className="mt-1 text-xs text-slate-500 max-w-sm">
          Try loosening your filter parameters or search term to see existing test journeys.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800/90 bg-slate-900/50 backdrop-blur-sm shadow-xl" suppressHydrationWarning>
      <div className="overflow-x-auto" suppressHydrationWarning>
        <table className="w-full text-left text-sm text-slate-300 table-auto" suppressHydrationWarning>
          <thead className="border-b border-slate-800 bg-slate-950/80 text-xs uppercase tracking-wider text-slate-400">
            <tr>
              <th scope="col" className="w-24 px-4 py-3.5 font-semibold">
                Test ID
              </th>
              <th scope="col" className="min-w-[280px] px-4 py-3.5 font-semibold">
                Test Journey / Title
              </th>
              <th scope="col" className="w-48 px-4 py-3.5 font-semibold">
                Module
              </th>
              <th scope="col" className="w-24 px-4 py-3.5 font-semibold">
                Severity
              </th>
              <th scope="col" className="w-28 px-4 py-3.5 font-semibold">
                Status
              </th>
              <th scope="col" className="w-24 px-4 py-3.5 font-semibold">
                Duration
              </th>
              <th scope="col" className="w-48 px-4 py-3.5 font-semibold text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-normal" suppressHydrationWarning>
            {tests.map((test) => {
              const isRunning = runningTestIds.includes(test.id);
              const isFailed = test.status === 'Failed';

              return (
                <tr
                  key={test.id}
                  className={`group transition-colors ${
                    isFailed
                      ? 'bg-rose-950/15 hover:bg-rose-950/25'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Test ID */}
                  <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs font-semibold text-teal-400">
                    <span className="rounded bg-slate-800/90 px-2 py-1 border border-slate-700/60">
                      {test.id}
                    </span>
                  </td>

                  {/* Title and Route */}
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-slate-100 group-hover:text-white">
                      {test.title}
                    </div>
                    {test.route && (
                      <div className="mt-0.5 flex items-center gap-1 font-mono text-[11px] text-slate-500">
                        <span>{test.route}</span>
                      </div>
                    )}
                  </td>

                  {/* Module */}
                  <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-400">
                    <span className="rounded-md bg-slate-800/70 px-2.5 py-1 text-slate-300 border border-slate-700/50">
                      {test.module}
                    </span>
                  </td>

                  {/* Severity */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    {getSeverityBadge(test.severity)}
                  </td>

                  {/* Status */}
                  <td className="whitespace-nowrap px-4 py-3.5">
                    {getStatusBadge(test.status, isRunning)}
                  </td>

                  {/* Duration */}
                  <td className="whitespace-nowrap px-4 py-3.5 font-mono text-xs text-slate-400">
                    {test.durationMs ? `${test.durationMs}ms` : '—'}
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Review Defect Button for Failures */}
                      {isFailed && (
                        <button
                          onClick={() => onReviewDefect(test)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/50 bg-rose-950/70 px-2.5 py-1.5 text-xs font-semibold text-rose-300 shadow-sm transition-all hover:bg-rose-900/70 hover:text-white hover:border-rose-400 active:scale-95"
                          title="Review defect logs, stack traces and screenshot evidence"
                        >
                          <Bug className="h-3.5 w-3.5 text-rose-400" />
                          <span>Review Defect</span>
                          {test.defect?.attachments && test.defect.attachments.length > 0 && (
                            <span className="flex h-4 items-center justify-center rounded-full bg-rose-500/20 px-1 text-[10px] text-rose-300 font-mono">
                              {test.defect.attachments.length}
                            </span>
                          )}
                        </button>
                      )}

                      {/* Single Test Run Button */}
                      <button
                        onClick={() => onRunSingleTest(test.id)}
                        disabled={isRunning}
                        className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all ${
                          isRunning
                            ? 'border-slate-800 bg-slate-900 text-slate-600'
                            : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:border-teal-500/40 hover:bg-slate-700 hover:text-teal-300'
                        }`}
                        title={test.status === 'Not Run' ? 'Execute this test case' : 'Re-run this test case'}
                      >
                        {isRunning ? (
                          <RotateCw className="h-3.5 w-3.5 animate-spin text-teal-400" />
                        ) : (
                          <Play className="h-3 w-3 fill-slate-300 text-slate-300" />
                        )}
                        <span>{test.status === 'Not Run' ? 'Run' : 'Re-run'}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
