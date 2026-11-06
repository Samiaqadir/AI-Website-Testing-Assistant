'use client';

import React from 'react';
import { 
  Bot, 
  Play, 
  Download, 
  Sparkles, 
  RotateCw, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface NavbarProps {
  onRunPending: () => void;
  onOpenExport: () => void;
  onFilterDefects: () => void;
  isRunning: boolean;
  pendingCount: number;
  failedCount: number;
  isFailedFilterActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  onRunPending,
  onOpenExport,
  onFilterDefects,
  isRunning,
  pendingCount,
  failedCount,
  isFailedFilterActive,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md" suppressHydrationWarning>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand identity */}
        <div className="flex items-center space-x-3.5">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-600 shadow-md shadow-teal-500/20">
            <Bot className="h-6 w-6 text-slate-950" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-500 ring-2 ring-slate-950"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold tracking-tight text-white sm:text-lg">
                Samia <span className="text-slate-500 font-normal">|</span>{' '}
                <span className="bg-gradient-to-r from-teal-300 via-teal-100 to-white bg-clip-text text-transparent">
                  AI Website Testing Assistant
                </span>
              </h1>
              <span className="hidden items-center gap-1 rounded-full border border-teal-500/30 bg-teal-950/60 px-2 py-0.5 text-[11px] font-medium text-teal-300 sm:inline-flex">
                <Sparkles className="h-3 w-3 text-teal-400" />
                AI QA Engine v2.4
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Autonomous regression runner, journey orchestration &amp; defect triage
            </p>
          </div>
        </div>

        {/* Global Action CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Quick status pill - now interactive filter! */}
          <button
            onClick={onFilterDefects}
            className={`hidden sm:inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-all ${
              isFailedFilterActive
                ? 'border-rose-500 bg-rose-950 text-rose-200 ring-2 ring-rose-500/40 font-semibold'
                : failedCount > 0
                ? 'border-rose-900/50 bg-rose-950/40 text-rose-300 hover:bg-rose-950/70 hover:border-rose-700'
                : 'border-slate-800 bg-slate-900/70 text-emerald-300'
            }`}
            title={failedCount > 0 ? 'Click to filter table by failed defects' : 'All suites clean'}
          >
            {isRunning ? (
              <>
                <RotateCw className="h-3.5 w-3.5 animate-spin text-teal-400" />
                <span className="text-teal-400 font-medium">Running Suite...</span>
              </>
            ) : failedCount > 0 ? (
              <>
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                <span>
                  {failedCount} open defect{failedCount > 1 ? 's' : ''}
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>All suites clean</span>
              </>
            )}
          </button>

          {/* Run Pending Tests Button */}
          <button
            onClick={onRunPending}
            disabled={isRunning || pendingCount === 0}
            className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold shadow-sm transition-all sm:text-sm ${
              isRunning || pendingCount === 0
                ? 'cursor-not-allowed border border-slate-800 bg-slate-900 text-slate-500'
                : 'border border-teal-500/40 bg-teal-500 text-slate-950 hover:bg-teal-400 hover:shadow-teal-500/25 active:scale-95'
            }`}
            title={pendingCount === 0 ? 'No pending tests left in queue' : `Run ${pendingCount} pending test(s)`}
          >
            {isRunning ? (
              <RotateCw className="h-4 w-4 animate-spin text-slate-950" />
            ) : (
              <Play className="h-4 w-4 fill-slate-950 text-slate-950" />
            )}
            <span>Run Pending Tests</span>
            {pendingCount > 0 && !isRunning && (
              <span className="flex h-5 items-center justify-center rounded-full bg-slate-950/20 px-1.5 text-[11px] font-bold text-slate-950">
                {pendingCount}
              </span>
            )}
          </button>

          {/* Export QA Summary CTA */}
          <button
            onClick={onOpenExport}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/90 px-3.5 py-2 text-xs font-semibold text-slate-100 shadow-sm transition-all hover:border-slate-600 hover:bg-slate-700/80 active:scale-95 sm:text-sm"
          >
            <Download className="h-4 w-4 text-teal-400" />
            <span className="hidden sm:inline">Export QA Summary</span>
            <span className="sm:hidden">Export</span>
          </button>
        </div>
      </div>
    </header>
  );
};
