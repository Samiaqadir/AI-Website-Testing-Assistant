'use client';

import React, { useEffect, useRef } from 'react';
import { 
  Terminal, 
  RotateCw, 
  X,
  Trash2,
  Minimize2
} from 'lucide-react';
import { RunLog } from '../lib/types';

interface ExecutionConsoleProps {
  logs: RunLog[];
  isRunning: boolean;
  currentTestTitle?: string;
  progressPercent: number;
  onClose: () => void;
  onClearLogs: () => void;
}

export const ExecutionConsole: React.FC<ExecutionConsoleProps> = ({
  logs,
  isRunning,
  currentTestTitle,
  progressPercent,
  onClose,
  onClearLogs,
}) => {
  const terminalRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of logs as they stream in
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/95 shadow-2xl backdrop-blur-md overflow-hidden transition-all duration-300">
      {/* Console Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-slate-900/90 px-4 py-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-5 w-5 items-center justify-center rounded bg-teal-500/10 text-teal-400">
            <Terminal className="h-3 w-3" />
          </div>
          <span className="text-xs font-semibold text-slate-200">
            Live Test Execution Console
          </span>
          {isRunning ? (
            <span className="flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-950/80 px-2 py-0.5 text-[10px] font-semibold text-teal-300">
              <RotateCw className="h-2.5 w-2.5 animate-spin text-teal-400" />
              Running ({progressPercent}%)
            </span>
          ) : (
            <span className="rounded-full bg-slate-800 px-2 py-0.2 text-[10px] font-medium text-slate-400">
              Standby
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onClearLogs}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-[11px] text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            title="Clear console logs"
          >
            <Trash2 className="h-3 w-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
          <button
            onClick={onClose}
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            title="Minimize console"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar (when running) */}
      {isRunning && (
        <div className="h-1 w-full bg-slate-900">
          <div
            style={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 transition-all duration-300 ease-out"
          />
        </div>
      )}

      {/* Currently running test badge */}
      {isRunning && currentTestTitle && (
        <div className="flex items-center justify-between border-b border-slate-800/60 bg-slate-900/40 px-4 py-1.5 text-xs">
          <span className="text-slate-400 truncate">
            Target Journey: <strong className="text-teal-300 font-medium">{currentTestTitle}</strong>
          </span>
          <span className="font-mono text-[10px] text-slate-500 shrink-0">Chromium Worker #1</span>
        </div>
      )}

      {/* Terminal Log Stream */}
      <div
        ref={terminalRef}
        className="max-h-44 min-h-[100px] overflow-y-auto p-3.5 font-mono text-xs text-slate-300 space-y-1 select-text bg-slate-950/80"
      >
        {logs.length === 0 ? (
          <div className="py-4 text-center text-xs text-slate-600">
            Console ready. Click &quot;Run Pending Tests&quot; or individual test &quot;Run&quot; buttons to stream execution traces.
          </div>
        ) : (
          logs.map((log) => {
            let color = 'text-slate-300';
            if (log.level === 'success') color = 'text-emerald-400 font-medium';
            if (log.level === 'warn') color = 'text-amber-400';
            if (log.level === 'error') color = 'text-rose-400 font-medium';
            if (log.level === 'info') color = 'text-teal-300';

            return (
              <div key={log.id} className="flex items-start gap-2 leading-relaxed text-[11px]">
                <span className="shrink-0 text-slate-600 font-mono text-[10px]">
                  [{log.timestamp}]
                </span>
                {log.testId && (
                  <span className="shrink-0 rounded bg-slate-800/80 px-1 py-0.2 text-[10px] font-semibold text-slate-400 border border-slate-700/40">
                    {log.testId}
                  </span>
                )}
                <span className={`break-all ${color}`}>{log.message}</span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
