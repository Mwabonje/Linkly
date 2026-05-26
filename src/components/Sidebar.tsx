import { Link, useLocation } from 'react-router-dom';
import { Link2, BarChart2, Palette, Settings, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import type { User } from '../types';

interface SidebarProps {
  user: User | null;
  className?: string;
  onNavigate?: () => void;
}

export function Sidebar({ user, className, onNavigate }: SidebarProps) {
  const location = useLocation();

  const navItems = [
    { name: 'Links', path: '/admin', icon: Link2 },
    { name: 'Analytics', path: '/admin/analytics', icon: BarChart2 },
    { name: 'Appearance', path: '/admin/appearance', icon: Palette },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className={cn("w-[260px] h-screen bg-sidebar flex flex-col justify-between py-6", className)}>
      <div>
        <div className="px-6 mb-8">
          <h1 className="text-2xl font-bold tracking-tight">Linkly</h1>
          <p className="text-muted text-xs mt-1">Admin Dashboard</p>
        </div>

        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={onNavigate}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-muted hover:text-white hover:bg-surface-hover"
                )}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-4 space-y-4">
        <button className="w-full bg-indigo-100 text-indigo-900 font-semibold py-3 px-4 rounded-xl flex items-center justify-center space-x-2 hover:bg-indigo-200 transition-colors">
          <Zap className="w-4 h-4 fill-current" />
          <span>Upgrade to Pro</span>
        </button>

        {user && (
          <div className="flex items-center space-x-3 px-2">
            <img src={user.avatarUrl} alt={user.fullName} className="w-10 h-10 rounded-full object-cover border border-border" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{user.fullName}</p>
              <button 
                onClick={async () => {
                  if (typeof window !== 'undefined' && (await import('../lib/supabase')).supabase) {
                     const { supabase } = await import('../lib/supabase');
                     await supabase?.auth.signOut();
                  }
                }} 
                className="text-xs text-muted hover:text-white truncate transition-colors text-left"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
