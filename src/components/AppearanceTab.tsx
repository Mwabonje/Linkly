import { useState } from 'react';
import type { User } from '../types';
import { Upload, Check, Save } from 'lucide-react';

export function AppearanceTab({ user, onUpdateUser }: { user: User | null, onUpdateUser: (updates: Partial<User>) => void }) {
  if (!user) return null;
  
  const [fullName, setFullName] = useState(user.fullName || '');
  const [username, setUsername] = useState(user.username || '');
  const [role, setRole] = useState(user.role || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');
  const [isSaving, setIsSaving] = useState(false);

  const currentTheme = user.theme || 'dark-minimal';

  const handleSave = async () => {
    setIsSaving(true);
    await onUpdateUser({ username, fullName, role, avatarUrl });
    setIsSaving(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setAvatarUrl(result);
        onUpdateUser({ avatarUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
      <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Appearance</h1>
          <p className="text-muted">Customize the look and feel of your profile.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-medium flex items-center space-x-2 transition-all disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
        </button>
      </header>

      <div className="bg-surface border border-white/5 rounded-2xl p-6 mb-8 mt-8 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Profile</h3>
        <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 space-x-0 md:space-x-6 mb-6">
          <div className="relative group">
            <img 
              src={avatarUrl || 'https://via.placeholder.com/150'} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full object-cover ring-4 ring-background" 
            />
            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 p-2.5 bg-white hover:bg-gray-200 text-background rounded-full shadow-lg transition-transform hover:scale-105 cursor-pointer">
              <Upload className="w-4 h-4" />
              <input 
                id="avatar-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarChange} 
              />
            </label>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <label className="text-[10px] uppercase font-semibold text-muted tracking-wider block mb-1.5">Profile Title</label>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted/50" 
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-semibold text-muted tracking-wider block mb-1.5">Username (Your Link)</label>
              <div className="flex items-center">
                <span className="bg-background border border-border border-r-0 rounded-l-xl px-4 py-3 text-sm text-muted">bioframe.netlify.app/</span>
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  className="w-full bg-background border border-border rounded-r-xl px-4 py-3 text-sm font-medium focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted/50" 
                  placeholder="username"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
          <label className="text-[10px] uppercase font-semibold text-muted tracking-wider block mb-1.5">Bio</label>
          <textarea 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            rows={3} 
            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all resize-none placeholder:text-muted/50"
          ></textarea>
        </div>
      </div>

      <div className="bg-surface border border-white/5 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Themes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Dark Minimal */}
          <div 
            onClick={() => onUpdateUser({ theme: 'dark-minimal' })}
            className={`border-2 rounded-xl p-2 cursor-pointer relative transition-colors ${currentTheme === 'dark-minimal' ? 'border-primary bg-sidebar' : 'border-transparent hover:border-white/10 bg-sidebar'}`}
          >
            {currentTheme === 'dark-minimal' && (
              <div className="absolute -top-3 -right-3 flex bg-primary text-white rounded-full p-1 shadow-lg ring-4 ring-surface z-10">
                 <Check className="w-4 h-4" />
              </div>
            )}
            <div className="h-40 bg-background rounded-lg border border-white/10 flex flex-col items-center justify-center space-y-3 p-3 group-hover:opacity-90">
               <div className="w-10 h-10 rounded-full bg-white/10" />
               <div className="w-16 h-2 bg-white/20 rounded-full" />
               <div className="w-full space-y-2 pt-2">
                 <div className="w-full h-6 bg-white/5 rounded-md" />
                 <div className="w-full h-6 bg-white/5 rounded-md" />
               </div>
            </div>
            <div className={`text-center mt-3 text-sm font-medium ${currentTheme === 'dark-minimal' ? 'text-white' : 'text-muted'}`}>Dark Minimal</div>
          </div>

          {/* Clean Light */}
          <div 
            onClick={() => onUpdateUser({ theme: 'clean-light' })}
            className={`border-2 rounded-xl p-2 cursor-pointer relative transition-colors ${currentTheme === 'clean-light' ? 'border-primary bg-sidebar' : 'border-transparent hover:border-white/10 bg-sidebar'}`}
          >
            {currentTheme === 'clean-light' && (
              <div className="absolute -top-3 -right-3 flex bg-primary text-white rounded-full p-1 shadow-lg ring-4 ring-surface z-10">
                 <Check className="w-4 h-4" />
              </div>
            )}
            <div className="h-40 bg-gray-50 rounded-lg border border-gray-200 flex flex-col items-center justify-center space-y-3 p-3 shadow-inner group-hover:opacity-90">
               <div className="w-10 h-10 rounded-full bg-gray-300" />
               <div className="w-16 h-2 bg-gray-300 rounded-full" />
               <div className="w-full space-y-2 pt-2">
                 <div className="w-full h-6 bg-gray-200 rounded-md" />
                 <div className="w-full h-6 bg-gray-200 rounded-md" />
               </div>
            </div>
            <div className={`text-center mt-3 text-sm font-medium ${currentTheme === 'clean-light' ? 'text-white' : 'text-muted'}`}>Clean Light</div>
          </div>

          {/* Cosmic Green */}
          <div 
            onClick={() => onUpdateUser({ theme: 'cosmic-green' })}
            className={`border-2 rounded-xl p-2 cursor-pointer relative transition-colors ${currentTheme === 'cosmic-green' ? 'border-primary bg-sidebar' : 'border-transparent hover:border-white/10 bg-sidebar'}`}
          >
            {currentTheme === 'cosmic-green' && (
              <div className="absolute -top-3 -right-3 flex bg-primary text-white rounded-full p-1 shadow-lg ring-4 ring-surface z-10">
                 <Check className="w-4 h-4" />
              </div>
            )}
            <div className="h-40 bg-gradient-to-br from-[#6E8649] to-[#477023] rounded-lg border border-white/10 flex flex-col items-center justify-center space-y-3 p-3 group-hover:opacity-90">
               <div className="w-10 h-10 rounded-full bg-white/20" />
               <div className="w-16 h-2 bg-white/40 rounded-full" />
               <div className="w-full space-y-2 pt-2">
                 <div className="w-full h-6 bg-white/20 rounded-md" />
                 <div className="w-full h-6 bg-white/20 rounded-md" />
               </div>
            </div>
            <div className={`text-center mt-3 text-sm font-medium ${currentTheme === 'cosmic-green' ? 'text-white' : 'text-muted'}`}>Cosmic Green</div>
          </div>
        </div>
      </div>
    </div>
  );
}
