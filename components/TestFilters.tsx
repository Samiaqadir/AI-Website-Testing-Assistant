'use client';

import React from 'react';
import { 
  Search, 
  RotateCcw, 
  ChevronDown, 
  X, 
  SlidersHorizontal,
  AlertTriangle,
  Clock,
  CheckCircle2,
  AlertOctagon
} from 'lucide-react';

interface TestFiltersProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  severityFilter: string;
  setSeverityFilter: (severity: string) => void;
  moduleFilter: string;
  setModuleFilter: (module: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
  availableModules: string[];
}

export const TestFilters: React.FC<TestFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  severityFilter,
  setSeverityFilter,
  moduleFilter,
  setModuleFilter,
  searchQuery,
  setSearchQuery,
  onResetFilters,
  totalCount,
  filteredCount,
  availableModules,
}) => {
  const isFiltered =
    statusFilter !== 'All' ||
    severityFilter !== 'All' ||
    moduleFilter !== 'All' ||
    searchQuery.trim() !== '';

  return (
    <div className="rounded-xl border border-slate-800/90 bg-slate-900/70 p-3.5 backdrop-blur-md shadow-lg space-y-3" suppressHydrationWarning>
      {/* Top Filter Bar: Search + Custom Sleek Dropdowns */}
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
        
        {/* Search input & Dropdowns */}
        <div className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center sm:flex-wrap">
          
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tests, routes, modules..."
              className="w-full rounded-lg border border-slate-700 bg-slate-800/90 py-1.5 pl-8 pr-7 text-xs text-slate-100 placeholder-slate-400 transition-colors focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-200"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Status Dropdown with Custom Chevron */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400">Status:</span>
            <div className="relative inline-block">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none cursor-pointer rounded-lg border border-slate-700 bg-slate-800/90 py-1.5 pl-3 pr-7 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
              >
                <option value="All" className="bg-slate-900 text-slate-100">All Statuses</option>
                <option value="Passed" className="bg-slate-900 text-emerald-400">Passed</option>
                <option value="Failed" className="bg-slate-900 text-rose-400">Failed</option>
                <option value="Not Run" className="bg-slate-900 text-slate-300">Not Run</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Severity Dropdown with Custom Chevron */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400">Severity:</span>
            <div className="relative inline-block">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="appearance-none cursor-pointer rounded-lg border border-slate-700 bg-slate-800/90 py-1.5 pl-3 pr-7 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400"
              >
                <option value="All" className="bg-slate-900 text-slate-100">All Severities</option>
                <option value="Critical" className="bg-slate-900 text-rose-400">Critical</option>
                <option value="High" className="bg-slate-900 text-orange-400">High</option>
                <option value="Medium" className="bg-slate-900 text-amber-400">Medium</option>
                <option value="Low" className="bg-slate-900 text-slate-300">Low</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Module Dropdown with Custom Chevron */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-medium text-slate-400">Module:</span>
            <div className="relative inline-block max-w-[210px]">
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="appearance-none cursor-pointer truncate rounded-lg border border-slate-700 bg-slate-800/90 py-1.5 pl-3 pr-7 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 focus:border-teal-400 focus:outline-none focus:ring-1 focus:ring-teal-400 w-full"
              >
                <option value="All" className="bg-slate-900 text-slate-100">All Modules</option>
                {availableModules.map((m) => (
                  <option key={m} value={m} className="bg-slate-900 text-slate-200">
                    {m}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

        </div>

        {/* Right side: Count & Reset */}
        <div className="flex items-center justify-between gap-3 border-t border-slate-800/60 pt-2 lg:border-t-0 lg:pt-0">
          <div className="text-xs text-slate-400">
            Showing <strong className="font-semibold text-teal-300">{filteredCount}</strong> of{' '}
            <strong className="font-semibold text-slate-200">{totalCount}</strong> tests
          </div>

          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            >
              <RotateCcw className="h-3 w-3 text-teal-400" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Quick Filter Chips for Instant 1-Click Filtering */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
        <span className="text-[11px] font-medium text-slate-400 mr-1">Quick:</span>
        
        <button
          onClick={() => {
            setStatusFilter('All');
            setSeverityFilter('All');
          }}
          className={`rounded-md px-2.5 py-0.5 text-[11px] font-medium transition-all ${
            statusFilter === 'All' && severityFilter === 'All'
              ? 'bg-slate-700 text-white shadow-sm'
              : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          All
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'Failed' ? 'All' : 'Failed')}
          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[11px] font-medium transition-all ${
            statusFilter === 'Failed'
              ? 'border border-rose-500/50 bg-rose-950/80 text-rose-300 font-semibold shadow-sm'
              : 'border border-rose-900/30 bg-rose-950/30 text-rose-400 hover:bg-rose-950/60'
          }`}
        >
          <AlertTriangle className="h-3 w-3 text-rose-400" />
          <span>Only Failures</span>
        </button>

        <button
          onClick={() => setSeverityFilter(severityFilter === 'Critical' ? 'All' : 'Critical')}
          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[11px] font-medium transition-all ${
            severityFilter === 'Critical'
              ? 'border border-red-500/50 bg-red-950/80 text-red-300 font-semibold shadow-sm'
              : 'border border-red-900/30 bg-red-950/30 text-red-400 hover:bg-red-950/60'
          }`}
        >
          <AlertOctagon className="h-3 w-3 text-red-400" />
          <span>Critical Severity</span>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'Not Run' ? 'All' : 'Not Run')}
          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[11px] font-medium transition-all ${
            statusFilter === 'Not Run'
              ? 'border border-amber-500/50 bg-amber-950/80 text-amber-300 font-semibold shadow-sm'
              : 'border border-amber-900/30 bg-amber-950/30 text-amber-400 hover:bg-amber-950/60'
          }`}
        >
          <Clock className="h-3 w-3 text-amber-400" />
          <span>Pending Execution</span>
        </button>

        <button
          onClick={() => setStatusFilter(statusFilter === 'Passed' ? 'All' : 'Passed')}
          className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-[11px] font-medium transition-all ${
            statusFilter === 'Passed'
              ? 'border border-emerald-500/50 bg-emerald-950/80 text-emerald-300 font-semibold shadow-sm'
              : 'border border-emerald-900/30 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-950/60'
          }`}
        >
          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
          <span>Passed</span>
        </button>
      </div>
    </div>
  );
};
