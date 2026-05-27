import React, { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import type { User, Link as LinkType } from '../types';
import { Globe, Mail, MessageSquare, Share2 } from 'lucide-react';
import { store } from '../lib/store';

export function PublicProfile() {
  const { username } = useParams<{ username: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    document.title = username ? `@${username} | Bioframe` : 'My Profile | Bioframe';
    
    if (username) {
      store.getProfileAndLinks(username).then((data) => {
        if (!data || data.user.id === '') {
          setError(true);
        } else {
          setUser(data.user);
          setLinks(data.links.filter(link => link.active));
          if (data.user.theme) {
            document.documentElement.dataset.theme = data.user.theme;
          }
        }
        setLoading(false);
      }).catch(() => {
        setError(true);
        setLoading(false);
      });
    } else {
      setError(true);
      setLoading(false);
    }
  }, [username]);

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
       <div className="animate-pulse flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-white/10 mb-4"></div>
          <div className="w-32 h-6 bg-white/10 rounded mb-2"></div>
       </div>
    </div>
  );

  if (error || !user) return <div className="min-h-screen text-center pt-20 bg-background">User not found</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-20 px-4">
      <div 
        className="w-full max-w-2xl px-4 flex flex-col items-center animate-in"
        style={{ '--animation-delay': '100ms', '--animation-duration': '700ms' } as React.CSSProperties}
      >
        <div className="relative mb-6">
          <img 
            src={user.avatarUrl} 
            alt={user.fullName} 
            className="w-28 h-28 rounded-full object-cover border-4 border-background ring-2 ring-primary"
          />
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-2">{user.fullName}</h1>
        <p className="text-center text-muted text-sm font-medium leading-relaxed max-w-md mx-auto mb-10">
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
              className="group flex items-center w-full p-4 rounded-[20px] bg-surface border border-border hover:bg-surface-hover transition-all duration-300 shadow-md"
            >
              <div className="flex items-center space-x-4 w-full">
                 <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/20 text-primary-hover flex-shrink-0">
                    <span className="font-bold text-lg">{link.title.charAt(0)}</span>
                 </div>
                 <span className="font-semibold tracking-wide">{link.title}</span>
              </div>
            </a>
          ))}
        </div>


      </div>
    </div>
  );
}
