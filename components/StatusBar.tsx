'use client';

import React from 'react';
import { ShieldCheck, AlertCircle, Zap, Activity, Cpu, Terminal } from 'lucide-react';
import { DashboardMetrics } from '../lib/types';

interface StatusBarProps {
  metrics: DashboardMetrics;
  averageLatencyMs: number;
  showConsole: boolean;
  onToggleConsole: () => void;
  logCount: number;
}

export const StatusBar: React.FC<StatusBarProps> = ({ 
  metrics, 
  averageLatencyMs,
  showConsole,
  onToggleConsole,
  logCount,
}) => {
  const total = metrics.total || 1;
  const passPercent = (metrics.passed / total) * 100;
  const failPercent = (metrics.failed / total) * 100;
  const notRunPercent = (metrics.notRun / total) * 100;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-sm shadow-md space-y-3" suppressHydrationWarning>
      {/* Header with Title and Overall Health Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-teal-400" />
          <h2 className="text-xs sm:text-sm font-semibold text-slate-200">
            Journey Health &amp; Visual Execution Status
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Console Toggle Button */}
          <button
            onClick={onToggleConsole}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors ${
              showConsole
                ? 'border-teal-500/40 bg-teal-500/10 text-teal-300'
                : 'border-slate-700 bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Terminal className="h-3 w-3 text-teal-400" />
            <span>{showConsole ? 'Hide Console' : 'Show Console'}</span>
            {logCount > 0 && (
              <span className="rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] text-slate-400 font-mono">
                {logCount}
              </span>
            )}
          </button>

          {/* Health Badge */}
          {metrics.failed === 0 && metrics.notRun === 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/60 px-2.5 py-1 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              100% Release Ready
            </span>
          ) : metrics.criticalIssues > 0 ? (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-950/70 px-2.5 py-1 text-xs font-semibold text-rose-300">
              <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
              {metrics.criticalIssues} Critical Blocker{metrics.criticalIssues > 1 ? 's' : ''}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-950/60 px-2.5 py-1 text-xs font-semibold text-teal-300">
              <Zap className="h-3.5 w-3.5 text-teal-400" />
              {passPercent.toFixed(0)}% Overall Pass Rate
            </span>
          )}
        </div>
      </div>

      {/* Segmented Multi-Color Progress Indicator Bar */}
      <div className="space-y-2">
        <div className="relative flex h-3 w-full overflow-hidden rounded-full bg-slate-800/90 p-0.5 ring-1 ring-inset ring-slate-700/50">
          {/* Passed segment */}
          <div
            style={{ width: `${passPercent}%` }}
            className="h-full rounded-l-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500 ease-out"
            title={`Passed: ${metrics.passed} (${passPercent.toFixed(1)}%)`}
          />
          {/* Failed segment */}
          <div
            style={{ width: `${failPercent}%` }}
            className={`h-full bg-gradient-to-r from-rose-500 to-red-600 transition-all duration-500 ease-out ${
              passPercent === 0 ? 'rounded-l-full' : ''
            } ${notRunPercent === 0 ? 'rounded-r-full' : ''}`}
            title={`Failed: ${metrics.failed} (${failPercent.toFixed(1)}%)`}
          />
          {/* Not run segment */}
          <div
            style={{ width: `${notRunPercent}%` }}
            className={`h-full bg-slate-700/80 transition-all duration-500 ease-out ${
              passPercent === 0 && failPercent === 0 ? 'rounded-l-full' : ''
            } rounded-r-full`}
            title={`Not Run: ${metrics.notRun} (${notRunPercent.toFixed(1)}%)`}
          />
        </div>

        {/* Legend under progress bar */}
        <div className="flex flex-wrap items-center justify-between pt-0.5 text-xs text-slate-400 gap-2">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" />
              <span className="font-medium text-slate-300">Passed:</span> {metrics.passed} ({passPercent.toFixed(0)}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500 ring-2 ring-rose-500/20" />
              <span className="font-medium text-slate-300">Failed:</span> {metrics.failed} ({failPercent.toFixed(0)}%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-600 ring-2 ring-slate-600/20" />
              <span className="font-medium text-slate-300">Not Run:</span> {metrics.notRun} ({notRunPercent.toFixed(0)}%)
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-slate-400">
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-teal-400" />
              Avg Latency: <strong className="text-slate-200">{averageLatencyMs}ms</strong>
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <Cpu className="h-3 w-3 text-teal-400" />
              AI Triage: <strong className="text-teal-300">100% Active</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
