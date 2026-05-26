import { useState, useEffect } from 'react';
import { Plus, Share2 } from 'lucide-react';
import { Sidebar, MobilePreview, DashboardStats, LinkCard } from '../components';
import type { Link as LinkType, User, AnalyticsData } from '../types';

export function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial data
    Promise.all([
      fetch('/api/user').then(r => r.json()),
      fetch('/api/links').then(r => r.json()),
      fetch('/api/analytics').then(r => r.json())
    ]).then(([u, l, a]) => {
      setUser(u);
      setLinks(l);
      setAnalytics(a);
      setLoading(false);
    });
  }, []);

  const handleUpdateLink = async (id: string, updates: Partial<LinkType>) => {
    setLinks(links.map(l => l.id === id ? { ...l, ...updates } : l));
    // Optimistic UI, fire request to backend
    fetch(`/api/links/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
  };

  const handleDeleteLink = async (id: string) => {
    setLinks(links.filter(l => l.id !== id));
    fetch(`/api/links/${id}`, { method: 'DELETE' });
  };

  const handleAddLink = async () => {
    const newLinkData = { title: 'New Link', url: 'https://' };
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLinkData)
    });
    const savedLink = await res.json();
    setLinks([...links, savedLink]);
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar user={user} />
      
      <main className="flex-1 ml-[260px] mr-[440px] px-12 py-10 overflow-y-auto">
        <header className="mb-10 max-w-4xl mx-auto flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">My Links</h1>
            <p className="text-muted">Personalize and manage your digital identity.</p>
          </div>
          <button 
            onClick={handleAddLink}
            className="bg-primary hover:bg-primary-hover text-white font-medium py-2.5 px-6 rounded-xl flex items-center space-x-2 transition-colors shadow-lg shadow-primary/25"
          >
            <Plus className="w-5 h-5" />
            <span>Add New Link</span>
          </button>
        </header>

        <div className="max-w-4xl mx-auto">
          <DashboardStats data={analytics} />

          <div className="space-y-4">
            {links.map((link, index) => (
              <div 
                key={link.id} 
                className="animate-in"
                style={{ 
                  '--animation-delay': `${index * 100}ms`, 
                  '--animation-duration': '600ms' 
                } as React.CSSProperties}
              >
                <LinkCard 
                  link={link} 
                  index={index}
                  onUpdate={handleUpdateLink}
                  onDelete={handleDeleteLink}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      <aside className="w-[440px] h-screen fixed right-0 border-l border-border/50 bg-[#090C15] flex flex-col items-center justify-center">
        <div className="w-full absolute top-0 pt-6 px-8 flex justify-end">
          <button className="flex items-center space-x-2 text-muted hover:text-white transition-colors text-sm font-medium px-4 py-2 bg-surface rounded-lg border border-white/5">
            <Share2 className="w-4 h-4" />
            <span>Live Preview</span>
          </button>
        </div>
        <MobilePreview user={user} links={links} />
      </aside>
    </div>
  );
}
