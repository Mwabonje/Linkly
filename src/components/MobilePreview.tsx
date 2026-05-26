import type { Link as LinkType, User } from '../types';

interface MobilePreviewProps {
  user: User | null;
  links: LinkType[];
  theme?: 'dark' | 'light';
}

export function MobilePreview({ user, links, theme = 'dark' }: MobilePreviewProps) {
  const activeLinks = links.filter((l) => l.active);

  return (
    <div className="w-[380px] h-[780px] relative">
      {/* Device frame */}
      <div className="absolute inset-0 border-[14px] border-[#1E293B] bg-[#0A0D14] rounded-[3rem] shadow-2xl overflow-hidden ring-1 ring-white/10">
        
        {/* Notch */}
        <div className="absolute top-0 inset-x-0 h-6 flex justify-center">
          <div className="w-32 h-6 bg-[#1E293B] rounded-b-3xl"></div>
        </div>

        {/* Content */}
        <div className="w-full h-full pt-16 px-6 pb-8 overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a233a] via-[#0A0D14] to-[#0A0D14]">
          {user ? (
            <div className="flex flex-col items-center mb-8 isolate">
              <div className="relative mb-4">
                <img 
                  src={user.avatarUrl} 
                  alt={user.fullName} 
                  className="w-24 h-24 rounded-full object-cover border-4 border-primary ring-2 ring-primary/20"
                />
              </div>
              <h2 className="text-xl font-bold text-white mb-1">{user.fullName}</h2>
              <p className="text-sm text-center text-muted max-w-xs">{user.role}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center mb-8 animate-pulse">
              <div className="w-24 h-24 rounded-full bg-surface-hover mb-4"></div>
              <div className="w-32 h-5 bg-surface-hover rounded mb-2"></div>
              <div className="w-48 h-4 bg-surface-hover rounded"></div>
            </div>
          )}

          <div className="flex flex-col space-y-4 w-full relative z-10">
            {activeLinks.map((link) => (
              <a
                key={link.id}
                href={link.url !== '#' ? link.url : undefined}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between w-full p-4 rounded-[20px] bg-[#161C2C]/80 border border-white/5 backdrop-blur-sm hover:bg-[#1E2536] hover:border-white/10 transition-all text-white font-medium text-center shadow-lg min-h-[60px]"
                onClick={(e) => { e.preventDefault(); }} // disable clicks in preview
              >
                <div className="flex items-center space-x-3 w-full">
                   <div className="w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                      <span className="font-semibold">{link.title.charAt(0)}</span>
                   </div>
                   <span className="tracking-wide text-sm truncate">{link.title}</span>
                </div>
              </a>
            ))}
            
            {activeLinks.length === 0 && (
              <div className="text-center text-muted text-sm py-10 opacity-70 border border-dashed border-white/10 rounded-2xl">
                No active links
              </div>
            )}
          </div>
          
          
          <div className="mt-12 mb-6 text-center">
             <div className="flex items-center justify-center space-x-1 text-[10px] font-semibold tracking-[0.2em] text-[#64748B] uppercase">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                <span>Linkly</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
