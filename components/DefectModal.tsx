'use client';

import React, { useState } from 'react';
import { 
  X, 
  Bug, 
  Upload, 
  Copy, 
  Check, 
  Terminal, 
  Image as ImageIcon, 
  FileText, 
  Maximize2, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  AlertOctagon, 
  Edit3,
  ExternalLink,
  Code
} from 'lucide-react';
import { TestCase, DefectDetail, EvidenceAttachment } from '../lib/types';

interface DefectModalProps {
  test: TestCase;
  isOpen: boolean;
  onClose: () => void;
  onUpdateDefect: (testId: string, updatedDefect: DefectDetail) => void;
  onRerunTest: (testId: string) => void;
}

export const DefectModal: React.FC<DefectModalProps> = ({
  test,
  isOpen,
  onClose,
  onUpdateDefect,
  onRerunTest,
}) => {
  if (!isOpen || !test.defect) return null;

  const defect = test.defect;

  const [activeTab, setActiveTab] = useState<'details' | 'evidence' | 'logs' | 'ai'>('evidence');
  const [copied, setCopied] = useState(false);
  const [copiedFix, setCopiedFix] = useState(false);
  const [isEditingLogs, setIsEditingLogs] = useState(false);
  const [manualLogs, setManualLogs] = useState(defect.errorLogs);
  const [isZoomed, setIsZoomed] = useState(false);
  const [attachments, setAttachments] = useState<EvidenceAttachment[]>(defect.attachments || []);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string>(
    defect.screenshotUrl || (defect.attachments.find(a => a.type === 'image')?.dataUrl ?? '')
  );
  const [saveToast, setSaveToast] = useState(false);

  // Copy logs to clipboard
  const handleCopyLogs = () => {
    navigator.clipboard.writeText(manualLogs);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Copy code fix
  const handleCopyFix = () => {
    if (defect.aiAnalysis?.codeSnippet) {
      navigator.clipboard.writeText(defect.aiAnalysis.codeSnippet);
      setCopiedFix(true);
      setTimeout(() => setCopiedFix(false), 2000);
    }
  };

  // Handle file upload for evidence attachment
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const isImg = file.type.startsWith('image/');

      const newAtt: EvidenceAttachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        type: isImg ? 'image' : 'log',
        dataUrl: isImg ? dataUrl : undefined,
        content: isImg ? undefined : dataUrl,
        timestamp: new Date().toLocaleString(),
        size: `${(file.size / 1024).toFixed(1)} KB`,
      };

      const updated = [newAtt, ...attachments];
      setAttachments(updated);
      if (isImg) {
        setSelectedScreenshot(dataUrl);
      }
    };

    if (file.type.startsWith('image/')) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  // Delete attachment
  const handleDeleteAttachment = (id: string) => {
    const updated = attachments.filter((a) => a.id !== id);
    setAttachments(updated);
    if (updated.length > 0) {
      const nextImg = updated.find((a) => a.type === 'image');
      setSelectedScreenshot(nextImg?.dataUrl || '');
    } else {
      setSelectedScreenshot('');
    }
  };

  // Save changes back to parent
  const handleSaveChanges = () => {
    const updatedDefect: DefectDetail = {
      ...defect,
      errorLogs: manualLogs,
      attachments: attachments,
      screenshotUrl: selectedScreenshot,
    };
    onUpdateDefect(test.id, updatedDefect);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity" 
      />

      {/* Modal Dialog Window */}
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-700/80 bg-slate-900 shadow-2xl ring-1 ring-slate-800">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/40">
              <Bug className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-semibold text-rose-400">
                  {defect.id}
                </span>
                <span className="text-slate-600">•</span>
                <span className="font-mono text-xs text-teal-400">{test.id}</span>
                <span className="rounded-md border border-rose-500/30 bg-rose-950/60 px-2 py-0.5 text-[11px] font-semibold text-rose-400">
                  {defect.severity} Severity
                </span>
                {defect.targetElement && (
                  <span className="hidden md:inline-flex rounded-md border border-teal-500/30 bg-teal-950/40 px-2 py-0.5 font-mono text-[11px] text-teal-300">
                    Target: {defect.targetElement}
                  </span>
                )}
                {defect.errorCode && (
                  <span className="hidden sm:inline-flex rounded-md border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono text-[11px] text-slate-300">
                    {defect.errorCode}
                  </span>
                )}
              </div>
              <h2 className="text-base font-bold text-slate-100 sm:text-lg">
                {defect.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 text-xs font-medium text-slate-400">
          <button
            onClick={() => setActiveTab('evidence')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 transition-colors ${
              activeTab === 'evidence'
                ? 'border-teal-400 text-teal-300 font-semibold'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Screenshot &amp; Evidence</span>
            <span className="rounded-full bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-300 font-mono">
              {attachments.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 transition-colors ${
              activeTab === 'logs'
                ? 'border-teal-400 text-teal-300 font-semibold'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>HTTP Error Logs &amp; Traces</span>
          </button>

          <button
            onClick={() => setActiveTab('details')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 transition-colors ${
              activeTab === 'details'
                ? 'border-teal-400 text-teal-300 font-semibold'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Defect Description &amp; Steps</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 border-b-2 py-3 px-3 transition-colors ${
              activeTab === 'ai'
                ? 'border-teal-400 text-teal-300 font-semibold'
                : 'border-transparent hover:text-slate-200'
            }`}
          >
            <Sparkles className="h-4 w-4 text-teal-400" />
            <span>AI Root Cause &amp; Remediation</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 text-sm">
          {/* TAB 1: Evidence & Screenshot Viewer */}
          {activeTab === 'evidence' && (
            <div className="space-y-6">
              {/* Evidence toolbar with upload */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <span className="font-semibold text-teal-400">Captured Artifacts:</span>
                  <span>{attachments.length} files attached for triage</span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-500/10 px-3 py-1.5 text-xs font-semibold text-teal-300 hover:bg-teal-500/20 transition-all">
                    <Upload className="h-3.5 w-3.5" />
                    <span>Attach Evidence (Image/Log)</span>
                    <input
                      type="file"
                      accept="image/*,.log,.txt,.json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Main Screenshot Preview */}
              {selectedScreenshot ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 font-medium text-slate-300">
                      <ImageIcon className="h-3.5 w-3.5 text-teal-400" />
                      Visual Failure Artifact Preview
                    </span>
                    <button
                      onClick={() => setIsZoomed(!isZoomed)}
                      className="inline-flex items-center gap-1 text-teal-400 hover:underline"
                    >
                      <Maximize2 className="h-3.5 w-3.5" />
                      <span>{isZoomed ? 'Shrink View' : 'Expand High-Res'}</span>
                    </button>
                  </div>

                  <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-inner">
                    <img
                      src={selectedScreenshot}
                      alt="Defect visual evidence preview"
                      className={`w-full object-contain transition-all ${
                        isZoomed ? 'max-h-[650px]' : 'max-h-[380px]'
                      }`}
                    />
                    <div className="absolute bottom-2 right-2 rounded-md bg-slate-950/80 px-2 py-1 text-[11px] font-mono text-slate-400 backdrop-blur-sm border border-slate-800">
                      Auto-Captured on Test Failure
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-500">
                  <ImageIcon className="mx-auto h-8 w-8 mb-2 text-slate-600" />
                  <p>No screenshot currently selected.</p>
                </div>
              )}

              {/* Attachments List */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Attached Files Dossier
                </h4>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {attachments.map((att) => (
                    <div
                      key={att.id}
                      onClick={() => {
                        if (att.dataUrl) setSelectedScreenshot(att.dataUrl);
                      }}
                      className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors ${
                        att.dataUrl && selectedScreenshot === att.dataUrl
                          ? 'border-teal-500/60 bg-teal-950/20'
                          : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        {att.type === 'image' ? (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-teal-500/10 text-teal-400">
                            <ImageIcon className="h-4 w-4" />
                          </div>
                        ) : (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-amber-500/10 text-amber-400">
                            <FileText className="h-4 w-4" />
                          </div>
                        )}
                        <div className="truncate">
                          <p className="truncate text-xs font-medium text-slate-200">
                            {att.name}
                          </p>
                          <p className="text-[10px] text-slate-500">
                            {att.size} • {att.timestamp}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAttachment(att.id);
                          }}
                          className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-rose-400"
                          title="Remove attachment"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HTTP Error Logs & Console Traces */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-teal-400" />
                  <span className="text-xs font-semibold text-slate-300">
                    HTTP Request/Response &amp; Runtime Stack Traces
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingLogs(!isEditingLogs)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-teal-400" />
                    <span>{isEditingLogs ? 'Preview Trace' : 'Edit / Add Manual Evidence'}</span>
                  </button>

                  <button
                    onClick={handleCopyLogs}
                    className="inline-flex items-center gap-1 rounded-lg border border-teal-500/30 bg-teal-500/10 px-2.5 py-1 text-xs font-semibold text-teal-300 hover:bg-teal-500/20"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Trace</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isEditingLogs ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-400">
                    Enter or paste manual evidence, additional cURL commands, response headers, or server logs:
                  </p>
                  <textarea
                    rows={14}
                    value={manualLogs}
                    onChange={(e) => setManualLogs(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-xs text-teal-300 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
                    placeholder="Paste HTTP headers, console error outputs, or server logs here..."
                  />
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 shadow-inner">
                  <pre className="whitespace-pre-wrap leading-relaxed text-slate-300 selection:bg-teal-500/20">
                    {manualLogs}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Defect Details & Reproduction Steps */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Target Element & Selector */}
              {defect.targetElement && (
                <div className="rounded-xl border border-teal-500/30 bg-teal-950/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-teal-300 mb-1">
                        Target Selector / DOM Element
                      </h3>
                      <code className="font-mono text-xs text-teal-200 bg-slate-950/80 px-2.5 py-1 rounded border border-teal-500/20 inline-block">
                        {defect.targetElement}
                      </code>
                    </div>
                    <span className="rounded-md border border-teal-500/30 bg-teal-950/60 px-2 py-0.5 font-mono text-[11px] text-teal-300">
                      Selector Bound
                    </span>
                  </div>
                </div>
              )}

              {/* Description box */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Defect Description
                </h3>
                <p className="text-slate-200 leading-relaxed">
                  {defect.description}
                </p>
              </div>

              {/* Steps to Reproduce */}
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Steps to Reproduce (Deterministic Flow)
                </h3>
                <div className="space-y-2">
                  {defect.stepsToReproduce.map((step, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 rounded-lg border border-slate-800/80 bg-slate-950/40 p-2.5 text-xs text-slate-300"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-800 text-[11px] font-bold text-teal-400 font-mono">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5 leading-normal">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expected vs Actual Results */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 mb-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Expected Behavior
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {defect.expectedResult}
                  </p>
                </div>

                <div className="rounded-xl border border-rose-900/40 bg-rose-950/20 p-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 mb-1.5">
                    <AlertOctagon className="h-4 w-4" />
                    Actual Observed Defect
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {defect.actualResult}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI Root Cause Analysis & Remediation */}
          {activeTab === 'ai' && (
            <div className="space-y-5">
              {defect.aiAnalysis ? (
                <>
                  <div className="rounded-xl border border-teal-500/30 bg-teal-950/20 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-teal-400" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-teal-300">
                          AI Root Cause Analysis
                        </h3>
                      </div>
                      <span className="rounded-full bg-teal-500/20 border border-teal-500/40 px-2 py-0.5 font-mono text-[11px] font-bold text-teal-300">
                        {defect.aiAnalysis.confidence}% AI Confidence
                      </span>
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      {defect.aiAnalysis.rootCause}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        Recommended Remediation Strategy
                      </h4>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed mb-4">
                      {defect.aiAnalysis.recommendedFix}
                    </p>

                    {defect.aiAnalysis.codeSnippet && (
                      <div className="relative rounded-lg border border-slate-800 bg-slate-900/90 p-3 font-mono text-xs">
                        <button
                          onClick={handleCopyFix}
                          className="absolute right-3 top-3 inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-1 text-[11px] text-teal-300 hover:bg-slate-700"
                        >
                          {copiedFix ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-400" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span>Copy Patch</span>
                            </>
                          )}
                        </button>
                        <pre className="text-teal-200 overflow-x-auto pt-4 leading-normal">
                          {defect.aiAnalysis.codeSnippet}
                        </pre>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-10 text-slate-500">
                  <Sparkles className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                  <p>AI Diagnosis not available for this defect.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 bg-slate-950 px-6 py-4">
          <div className="flex items-center gap-2">
            {saveToast && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400 animate-fadeIn">
                <Check className="h-3.5 w-3.5" />
                Evidence &amp; logs updated successfully!
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveChanges}
              className="rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
            >
              Save Evidence &amp; Updates
            </button>

            <button
              onClick={() => {
                handleSaveChanges();
                onRerunTest(test.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-teal-500/40 bg-teal-500 px-4 py-2 text-xs font-semibold text-slate-950 shadow-sm hover:bg-teal-400 transition-all active:scale-95"
            >
              <span>Re-execute Test ({test.id})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

