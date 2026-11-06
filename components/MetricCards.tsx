'use client';

import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Layers, 
  ArrowRight
} from 'lucide-react';
import { DashboardMetrics } from '../lib/types';

interface MetricCardsProps {
  metrics: DashboardMetrics;
  activeStatusFilter: string;
  onSelectStatusFilter: (status: string) => void;
}

export const MetricCards: React.FC<MetricCardsProps> = ({
  metrics,
  activeStatusFilter,
  onSelectStatusFilter,
}) => {
  const cards = [
    {
      label: 'Total Tests',
      count: metrics.total,
      subtext: 'Across 6 active modules',
      icon: Layers,
      color: 'slate',
      badge: '100% cataloged',
      badgeClass: 'bg-slate-800 text-slate-300 border-slate-700',
      borderClass: 'border-slate-800 hover:border-slate-700',
      filterValue: 'All',
      glowClass: 'hover:shadow-slate-800/40',
      activeRingClass: 'ring-2 ring-slate-400 ring-offset-2 ring-offset-slate-950 bg-slate-900',
    },
    {
      label: 'Passed',
      count: metrics.passed,
      subtext: `${metrics.passRate.toFixed(1)}% success rate`,
      icon: CheckCircle2,
      color: 'emerald',
      badge: 'Verified Clean',
      badgeClass: 'bg-emerald-950/70 text-emerald-400 border-emerald-800/60',
      borderClass: 'border-emerald-900/40 hover:border-emerald-700/60',
      filterValue: 'Passed',
      glowClass: 'hover:shadow-emerald-950/30',
      activeRingClass: 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950 bg-emerald-950/30 border-emerald-500/50',
    },
    {
      label: 'Failed',
      count: metrics.failed,
      subtext: metrics.criticalIssues > 0 ? `${metrics.criticalIssues} Critical blocker(s)` : 'No blocking defects',
      icon: XCircle,
      color: 'rose',
      badge: metrics.failed > 0 ? 'Defects Logged' : 'Zero Defects',
      badgeClass: metrics.failed > 0 ? 'bg-rose-950/80 text-rose-400 border-rose-800/60' : 'bg-slate-800 text-slate-400 border-slate-700',
      borderClass: metrics.failed > 0 ? 'border-rose-900/60 hover:border-rose-700/80' : 'border-slate-800 hover:border-slate-700',
      filterValue: 'Failed',
      glowClass: 'hover:shadow-rose-950/40',
      activeRingClass: 'ring-2 ring-rose-500 ring-offset-2 ring-offset-slate-950 bg-rose-950/30 border-rose-500/60',
    },
    {
      label: 'Not Run',
      count: metrics.notRun,
      subtext: metrics.notRun > 0 ? 'Pending execution' : 'All tests executed',
      icon: Clock,
      color: 'amber',
      badge: metrics.notRun > 0 ? 'Ready in Queue' : 'Complete',
      badgeClass: 'bg-amber-950/60 text-amber-400 border-amber-800/50',
      borderClass: 'border-amber-900/40 hover:border-amber-700/60',
      filterValue: 'Not Run',
      glowClass: 'hover:shadow-amber-950/30',
      activeRingClass: 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950 bg-amber-950/30 border-amber-500/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" suppressHydrationWarning>
      {cards.map((card) => {
        const Icon = card.icon;
        // Only mark card as selected when specifically filtering by that status (do not select Total Tests by default)
        const isSelected = card.filterValue !== 'All' && activeStatusFilter === card.filterValue;

        const handleClick = () => {
          if (card.filterValue === 'All') {
            onSelectStatusFilter('All');
          } else {
            onSelectStatusFilter(isSelected ? 'All' : card.filterValue);
          }
        };

        return (
          <div
            key={card.label}
            onClick={handleClick}
            className={`group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border bg-slate-900/60 p-5 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${card.borderClass} ${card.glowClass} ${
              isSelected ? card.activeRingClass : ''
            }`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400 group-hover:text-slate-300">
                {card.label}
              </span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  card.color === 'emerald'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : card.color === 'rose'
                    ? 'bg-rose-500/10 text-rose-400'
                    : card.color === 'amber'
                    ? 'bg-amber-500/10 text-amber-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>

            {/* Metric count */}
            <div className="my-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-white">
                {card.count}
              </span>
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${card.badgeClass}`}
              >
                {card.badge}
              </span>
            </div>

            {/* Bottom info row */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{card.subtext}</span>
              <span className="flex items-center gap-1 text-[11px] text-teal-400 opacity-0 transition-opacity group-hover:opacity-100 font-medium">
                {isSelected ? 'Clear filter' : card.filterValue === 'All' ? 'View all' : 'Filter by'}
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
