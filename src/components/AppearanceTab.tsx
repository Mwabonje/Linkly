import type { User } from '../types';
import { Upload, Check } from 'lucide-react';

export function AppearanceTab({ user }: { user: User | null }) {
  if (!user) return null;
  
  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Appearance</h1>
        <p className="text-muted">Customize the look and feel of your profile.</p>
      </header>

      <div className="bg-surface border border-white/5 rounded-2xl p-6 mb-8 mt-8 shadow-sm">
        <h3 className="text-lg font-semibold mb-6 text-white">Profile</h3>
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative group">
            <img 
              src={user.avatarUrl} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full object-cover ring-4 ring-[#0A0D14]" 
            />
            <button className="absolute bottom-0 right-0 p-2.5 bg-white hover:bg-gray-200 text-[#090C15] rounded-full shadow-lg transition-transform hover:scale-105">
              <Upload className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <label className="text-[10px] uppercase font-semibold text-muted tracking-wider block mb-1.5">Profile Title</label>
              <input 
                type="text" 
                defaultValue={user.fullName} 
                className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted/50" 
              />
            </div>
          </div>
        </div>
        <div>
          <label className="text-[10px] uppercase font-semibold text-muted tracking-wider block mb-1.5">Bio</label>
          <textarea 
            defaultValue={user.role} 
            rows={3} 
            className="w-full bg-[#0A0D14] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none placeholder:text-muted/50"
          ></textarea>
        </div>
      </div>

      <div className="bg-surface border border-white/5 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6 text-white">Themes</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {/* Active Theme */}
          <div className="border-2 border-primary rounded-xl p-2 cursor-pointer relative bg-[#090C15]">
            <div className="absolute -top-3 -right-3 flex bg-primary text-white rounded-full p-1 shadow-lg ring-4 ring-surface">
               <Check className="w-4 h-4" />
            </div>
            <div className="h-40 bg-[#0A0D14] rounded-lg border border-white/10 flex flex-col items-center justify-center space-y-3 p-3">
               <div className="w-10 h-10 rounded-full bg-white/10" />
               <div className="w-16 h-2 bg-white/20 rounded-full" />
               <div className="w-full space-y-2 pt-2">
                 <div className="w-full h-6 bg-white/5 rounded-md" />
                 <div className="w-full h-6 bg-white/5 rounded-md" />
               </div>
            </div>
            <div className="text-center mt-3 text-sm font-medium text-white">Dark Minimal</div>
          </div>

          {/* Theme 2 */}
          <div className="border-2 border-transparent hover:border-white/10 rounded-xl p-2 cursor-pointer transition-colors bg-[#090C15]">
            <div className="h-40 bg-white rounded-lg border border-white/10 flex flex-col items-center justify-center space-y-3 p-3 shadow-inner">
               <div className="w-10 h-10 rounded-full bg-black/10" />
               <div className="w-16 h-2 bg-black/20 rounded-full" />
               <div className="w-full space-y-2 pt-2">
                 <div className="w-full h-6 bg-black/5 rounded-md" />
                 <div className="w-full h-6 bg-black/5 rounded-md" />
               </div>
            </div>
            <div className="text-center mt-3 text-sm font-medium text-muted">Clean Light</div>
          </div>

          {/* Theme 3 */}
          <div className="border-2 border-transparent hover:border-white/10 rounded-xl p-2 cursor-pointer transition-colors bg-[#090C15]">
            <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg border border-white/10 flex flex-col items-center justify-center space-y-3 p-3">
               <div className="w-10 h-10 rounded-full bg-white/20" />
               <div className="w-16 h-2 bg-white/40 rounded-full" />
               <div className="w-full space-y-2 pt-2">
                 <div className="w-full h-6 bg-white/20 rounded-md" />
                 <div className="w-full h-6 bg-white/20 rounded-md" />
               </div>
            </div>
            <div className="text-center mt-3 text-sm font-medium text-muted">Cosmic</div>
          </div>
        </div>
      </div>
    </div>
  );
}
