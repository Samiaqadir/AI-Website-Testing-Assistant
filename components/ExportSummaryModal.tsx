'use client';

import React, { useState } from 'react';
import { 
  X, 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  CheckCircle2, 
  AlertTriangle,
  Eye,
  Sparkles,
  Layers
} from 'lucide-react';
import { TestCase, DashboardMetrics } from '../lib/types';
import { generateMarkdownSummary, generateCsvSummary, downloadFile } from '../lib/exportUtils';

interface ExportSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  tests: TestCase[];
  metrics: DashboardMetrics;
}

export const ExportSummaryModal: React.FC<ExportSummaryModalProps> = ({
  isOpen,
  onClose,
  tests,
  metrics,
}) => {
  if (!isOpen) return null;

  const [activeFormat, setActiveFormat] = useState<'markdown' | 'csv'>('markdown');
  const [copied, setCopied] = useState(false);

  const markdownContent = generateMarkdownSummary(tests, metrics);
  const csvContent = generateCsvSummary(tests, metrics);

  const handleDownloadMarkdown = () => {
    const filename = `qa-summary-${new Date().toISOString().slice(0, 10)}.md`;
    downloadFile(markdownContent, filename, 'text/markdown');
  };

  const handleDownloadCsv = () => {
    const filename = `qa-test-matrix-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadFile(csvContent, filename, 'text/csv');
  };

  const handleCopy = () => {
    const content = activeFormat === 'markdown' ? markdownContent : csvContent;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl ring-1 ring-slate-800">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/20 text-teal-400 ring-1 ring-teal-500/30">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md border border-teal-500/30 bg-teal-950/60 px-2 py-0.5 text-[11px] font-semibold text-teal-300">
                  One-Page QA Summary Export
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400">{tests.length} Total Tests Documented</span>
              </div>
              <h2 className="text-base font-bold text-slate-100 sm:text-lg">
                Executive Test Execution &amp; Defect Report
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Format Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950/40 px-6 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFormat('markdown')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeFormat === 'markdown'
                  ? 'border border-teal-500/40 bg-teal-500/10 text-teal-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Markdown Report (.md)</span>
            </button>

            <button
              onClick={() => setActiveFormat('csv')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                activeFormat === 'csv'
                  ? 'border border-teal-500/40 bg-teal-500/10 text-teal-300 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>CSV Spreadsheet (.csv)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-teal-400" />
                  <span>Copy Raw Content</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Document Preview Body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-slate-400">Total Run</span>
              <p className="mt-1 text-lg font-bold text-white">{metrics.total}</p>
            </div>
            <div className="rounded-lg border border-emerald-900/30 bg-emerald-950/20 p-3">
              <span className="text-emerald-400">Passed</span>
              <p className="mt-1 text-lg font-bold text-emerald-300">{metrics.passed}</p>
            </div>
            <div className="rounded-lg border border-rose-900/30 bg-rose-950/20 p-3">
              <span className="text-rose-400">Failed</span>
              <p className="mt-1 text-lg font-bold text-rose-300">{metrics.failed}</p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
              <span className="text-slate-400">Pending</span>
              <p className="mt-1 text-lg font-bold text-slate-300">{metrics.notRun}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 shadow-inner">
            <pre className="whitespace-pre-wrap leading-relaxed text-slate-300 select-all max-h-[360px] overflow-y-auto">
              {activeFormat === 'markdown' ? markdownContent : csvContent}
            </pre>
          </div>
        </div>

        {/* Footer with Instant Download Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sparkles className="h-4 w-4 text-teal-400" />
            <span>Includes executive metrics, defect dossier &amp; evidence attachments</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadCsv}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
              <span>Download CSV</span>
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm hover:bg-teal-400 transition-all active:scale-95"
            >
              <Download className="h-4 w-4 fill-slate-950" />
              <span>Download One-Page QA Summary (.md)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

