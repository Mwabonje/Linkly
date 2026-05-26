import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import type { User, Link as LinkType } from '../types';
import { Globe, Mail, MessageSquare, Share2 } from 'lucide-react';

export function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reusing the same simulated endpoint for demo purposes, 
    // ideally this fetch specific user data by username
    document.title = `@${username} | Linkly`;
    
    Promise.all([
      fetch('/api/user').then(r => r.json()),
      fetch('/api/links').then(r => r.json()),
    ])
    .then(([u, l]) => {
      // simulate check
      if (u.username !== username && username !== 'alex') {
        setError(true);
      } else {
        setUser(u);
        setLinks(l.filter((link: LinkType) => link.active));
      }
      setLoading(false);
    })
    .catch(() => {
      setError(true);
      setLoading(false);
    });
  }, [username]);

  if (loading) return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center">
       <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white/10 mb-4"></div>
          <div className="w-32 h-6 bg-white/10 rounded mb-2"></div>
       </div>
    </div>
  );

  if (error || !user) return <div className="min-h-screen text-center pt-20 text-white bg-background">User not found</div>;

  return (
    <div className="min-h-screen bg-[#0A0D14] text-white flex flex-col items-center py-20 px-4">
      <div 
        className="w-full max-w-2xl px-4 flex flex-col items-center animate-in"
        style={{ '--animation-delay': '100ms', '--animation-duration': '700ms' } as React.CSSProperties}
      >
        <div className="relative mb-6">
          <img 
            src={user.avatarUrl} 
            alt={user.fullName} 
            className="w-28 h-28 rounded-full object-cover border-4 border-[#0A0D14] ring-2 ring-[#7C3AED]"
          />
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-2 text-white">{user.fullName}</h1>
        <p className="text-center text-[#94A3B8] text-sm font-medium leading-relaxed max-w-md mx-auto mb-10">
          {user.role}
        </p>

        <div 
          className="w-full space-y-4 max-w-[580px] animate-in"
          style={{ '--animation-delay': '300ms', '--animation-duration': '700ms' } as React.CSSProperties}
        >
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center w-full p-4 rounded-[20px] bg-[#161925] border border-white/5 hover:bg-[#1C202F] transition-all duration-300 shadow-md"
            >
              <div className="flex items-center space-x-4 w-full">
                 <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#2D244A] text-[#C4B5FD] flex-shrink-0">
                    <span className="font-bold text-lg">{link.title.charAt(0)}</span>
                 </div>
                 <span className="font-semibold tracking-wide text-white">{link.title}</span>
              </div>
            </a>
          ))}
        </div>

        <div 
          className="mt-16 text-center animate-in"
          style={{ '--animation-delay': '500ms', '--animation-duration': '700ms' } as React.CSSProperties}
        >
          <a href="/admin" className="inline-flex items-center space-x-1.5 opacity-60 hover:opacity-100 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-[#64748B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
            <span className="text-xs font-semibold tracking-[0.25em] text-[#64748B] uppercase">Linkly</span>
          </a>
        </div>
      </div>
    </div>
  );
}
