import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DashboardStats } from './DashboardStats';
import type { AnalyticsData } from '../types';

const mockChartData = [
  { name: 'Mon', views: 4000, clicks: 2400 },
  { name: 'Tue', views: 3000, clicks: 1398 },
  { name: 'Wed', views: 2000, clicks: 9800 },
  { name: 'Thu', views: 2780, clicks: 3908 },
  { name: 'Fri', views: 1890, clicks: 4800 },
  { name: 'Sat', views: 2390, clicks: 3800 },
  { name: 'Sun', views: 3490, clicks: 4300 },
];

export function AnalyticsTab({ data }: { data: AnalyticsData | null }) {
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Analytics</h1>
        <p className="text-muted">Track your audience engagement over time.</p>
      </header>
      
      <DashboardStats data={data} />

      <div className="bg-surface border border-white/5 rounded-2xl p-6 mt-8 shadow-sm">
        <h3 className="text-lg font-semibold mb-6 flex items-center text-white">
          Audience Overview
        </h3>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#7C3AED" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#94A3B8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                dy={10}
              />
              <YAxis 
                stroke="#94A3B8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value / 1000}k`} 
                dx={-10}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#fff', fontWeight: 500 }}
                cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#7C3AED" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorViews)" 
                activeDot={{ r: 6, fill: '#7C3AED', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
