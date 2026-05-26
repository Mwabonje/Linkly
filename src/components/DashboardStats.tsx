import { Eye, MousePointerClick, TrendingUp } from 'lucide-react';
import type { AnalyticsData } from '../types';

export function DashboardStats({ data }: { data: AnalyticsData | null }) {
  if (!data) return <div className="animate-pulse h-32 bg-surface rounded-2xl mb-8"></div>;

  return (
    <div className="grid grid-cols-3 gap-6 mb-10">
      <div className="bg-surface rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
            <Eye className="w-5 h-5 text-indigo-400" />
          </div>
          <div className={`text-sm font-medium flex items-center ${data.viewsGrowth > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            {data.viewsGrowth}%
          </div>
        </div>
        <div className="text-muted text-sm font-medium mb-1">Total Views</div>
        <div className="text-3xl font-bold tracking-tight">
          {(data.totalViews / 1000).toFixed(1)}k
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <MousePointerClick className="w-5 h-5 text-purple-400" />
          </div>
          <div className={`text-sm font-medium flex items-center ${data.clicksGrowth > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            <TrendingUp className="w-4 h-4 mr-1" />
            {data.clicksGrowth}%
          </div>
        </div>
        <div className="text-muted text-sm font-medium mb-1">Clicks</div>
        <div className="text-3xl font-bold tracking-tight">
          {(data.totalClicks / 1000).toFixed(1)}k
        </div>
      </div>

      <div className="bg-surface rounded-2xl p-6 border border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <div className="text-sm font-medium flex items-center text-muted">
            Avg. CTR
          </div>
        </div>
        <div className="text-muted text-sm font-medium mb-1">Avg. CTR</div>
        <div className="text-3xl font-bold tracking-tight">
          {data.avgCtr}%
        </div>
      </div>
    </div>
  );
}
