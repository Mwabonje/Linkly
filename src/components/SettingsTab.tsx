import type { User } from '../types';
import { Mail, Shield, AlertTriangle } from 'lucide-react';

export function SettingsTab({ user }: { user: User | null }) {
  if (!user) return null;
  
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted">Manage your account credentials and preferences.</p>
      </header>

      <div className="space-y-6">
        <div className="bg-surface border border-white/5 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-6 flex items-center">
            <Mail className="w-5 h-5 mr-3 text-primary" /> 
            My Account
          </h3>
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] uppercase font-semibold text-muted tracking-wider block mb-1.5">Username</label>
                <input 
                  type="text" 
                  defaultValue={user.username} 
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none opacity-60 cursor-not-allowed" 
                  disabled 
                />
              </div>
              <div>
                <label className="text-[10px] uppercase font-semibold text-muted tracking-wider block mb-1.5">Email</label>
                <input 
                  type="email" 
                  defaultValue={`${user.username}@gmail.com`} 
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all" 
                />
              </div>
            </div>
            <div className="pt-2 flex justify-end">
               <button className="bg-primary hover:bg-primary-hover text-white py-2.5 px-6 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-primary/25">
                 Save Changes
               </button>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-white/5 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-5 flex items-center">
            <Shield className="w-5 h-5 mr-3 text-emerald-400" /> 
            Subscription
          </h3>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-sidebar rounded-xl border border-white/5">
            <div>
              <div className="font-semibold mb-1 tracking-wide">Free Plan</div>
              <div className="text-sm text-muted">Basic link in bio features with standard analytics.</div>
            </div>
            <button className="bg-white text-black hover:bg-gray-200 py-2.5 px-5 rounded-xl text-sm font-semibold transition-colors shadow-md">
              Upgrade to Pro
            </button>
          </div>
        </div>

        <div className="bg-surface border border-rose-500/20 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 flex items-center text-rose-500">
            <AlertTriangle className="w-5 h-5 mr-3" /> 
            Danger Zone
          </h3>
          <p className="text-sm text-muted mb-6">
            Permanently delete your account and all associated links, analytics, and data. This action cannot be undone.
          </p>
          <button className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 py-2.5 px-5 rounded-xl text-sm font-medium transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
