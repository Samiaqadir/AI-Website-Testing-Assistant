'use client';

import dynamic from 'next/dynamic';

const DashboardClient = dynamic(() => import('../components/DashboardClient'), {
  ssr: false,
  loading: () => (
    <div 
      className="min-h-screen bg-[#090d16] text-slate-100 flex items-center justify-center" 
      suppressHydrationWarning
    >
      <div className="flex items-center gap-3 text-slate-400" suppressHydrationWarning>
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
        <span className="text-sm font-medium">Loading AI Testing Assistant...</span>
      </div>
    </div>
  ),
});

export default function Page() {
  return <DashboardClient />;
}
