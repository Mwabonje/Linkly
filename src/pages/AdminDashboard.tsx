import { useState, useEffect } from 'react';
import { Plus, Share2, Menu, X } from 'lucide-react';
import { Sidebar, MobilePreview, DashboardStats, LinkCard, AnalyticsTab, AppearanceTab, SettingsTab } from '../components';
import type { Link as LinkType, User, AnalyticsData } from '../types';
import { store } from '../lib/store';
import { useLocation } from 'react-router-dom';

export function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; show: boolean }>({ message: '', show: false });
  const location = useLocation();

  const showToast = (message: string) => {
    setToast({ message, show: true });
    setTimeout(() => setToast({ message: '', show: false }), 3000);
  };

  useEffect(() => {
    // Fetch initial data
    Promise.all([
      store.getUser(),
      store.getLinks(),
      store.getAnalytics()
    ]).then(([u, l, a]) => {
      setUser(u);
      if (u && u.theme) {
        document.documentElement.dataset.theme = u.theme;
      }
      setLinks(l);
      setAnalytics(a);
      setLoading(false);
    });
  }, []);

  const handleUpdateUser = async (updates: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    await store.saveUser(updatedUser);
    if (updates.theme) {
      document.documentElement.dataset.theme = updates.theme;
    }
    showToast('Profile updated');
  };

  const handleUpdateLink = async (id: string, updates: Partial<LinkType>) => {
    const updatedLinks = links.map(l => l.id === id ? { ...l, ...updates } : l);
    setLinks(updatedLinks);
    await store.saveLinks(updatedLinks);
    showToast('Link updated successfully');
  };

  const handleDeleteLink = async (id: string) => {
    const updatedLinks = links.filter(l => l.id !== id);
    setLinks(updatedLinks);
    await store.saveLinks(updatedLinks);
    showToast('Link deleted');
  };

  const handleAddLink = async () => {
    const newLinkData = { 
      id: Date.now().toString(), 
      title: 'New Link', 
      url: 'https://', 
      clicks: 0, 
      active: true 
    };
    const updatedLinks = [...links, newLinkData];
    setLinks(updatedLinks);
    await store.saveLinks(updatedLinks);
    showToast('New link added');
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (!draggedId) return;

    const draggedIndex = links.findIndex(l => l.id === draggedId);
    if (draggedIndex === index || draggedIndex === -1) return;

    const items = [...links];
    const draggedItem = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(index, 0, draggedItem);
    
    setLinks(items);
  };

  const handleDragEnd = async () => {
    setDraggedId(null);
    await store.saveLinks(links);
    showToast('Link order saved');
  };

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-sidebar border-b border-border/50 flex items-center justify-between px-4 z-40">
        <div className="flex items-center space-x-3">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-white">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold tracking-tight">Bioframe</h1>
        </div>
        <button onClick={() => setIsPreviewOpen(true)} className="px-3 py-1.5 border border-white/10 rounded-lg text-sm bg-surface font-medium text-white shadow-sm flex items-center space-x-2">
          <span>Preview</span>
        </button>
      </div>

      {/* Mobile Menu Modal */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative flex w-[260px] flex-col bg-sidebar border-r border-border/50 z-50 animate-in slide-in-from-left">
            <button onClick={() => setIsMobileMenuOpen(false)} className="absolute top-4 right-4 p-2 text-muted hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <Sidebar user={user} onNavigate={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <Sidebar user={user} className="hidden lg:flex fixed left-0 top-0 border-r border-border/50 z-30" />
      
      <main className="flex-1 lg:ml-[260px] xl:mr-[440px] px-4 sm:px-8 lg:px-12 py-24 lg:py-10 overflow-y-auto max-w-full">
        {location.pathname === '/admin/analytics' ? (
          <AnalyticsTab data={analytics} />
        ) : location.pathname === '/admin/appearance' ? (
          <AppearanceTab user={user} onUpdateUser={handleUpdateUser} />
        ) : location.pathname === '/admin/settings' ? (
          <SettingsTab user={user} />
        ) : (
          <>
            <header className="mb-8 lg:mb-10 max-w-4xl mx-auto flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 sm:mb-2">My Links</h1>
                <p className="text-muted text-sm sm:text-base">Personalize and manage your digital identity.</p>
              </div>
              <button 
                onClick={handleAddLink}
                className="bg-primary hover:bg-primary-hover text-white font-medium py-2.5 px-6 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-primary/25 w-full sm:w-auto"
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
                      onDragStart={(e) => handleDragStart(e, link.id)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      isDragging={draggedId === link.id}
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </main>

      <aside className="hidden xl:flex w-[440px] h-screen fixed right-0 border-l border-border/50 bg-sidebar flex-col items-center justify-center z-30">
        <div className="w-full absolute top-0 pt-6 px-8 flex justify-end">
          <button 
            onClick={() => {
              if (user?.username) {
                window.open(`/${user.username}`, '_blank');
              } else {
                showToast('Please set a username in the Appearance tab first');
              }
            }}
            className="flex items-center space-x-2 text-muted hover:text-white transition-colors text-sm font-medium px-4 py-2 bg-surface rounded-lg border border-white/5"
          >
            <Share2 className="w-4 h-4" />
            <span>Live Preview</span>
          </button>
        </div>
        <MobilePreview user={user} links={links} />
      </aside>

      {/* Mobile Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md flex items-center justify-center p-4 xl:hidden animate-in fade-in zoom-in-95 duration-200">
          <button onClick={() => setIsPreviewOpen(false)} className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 sm:p-3 bg-surface rounded-full text-white border border-white/10 shadow-xl z-50">
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="scale-75 sm:scale-90 md:scale-100 origin-center">
            <MobilePreview user={user} links={links} />
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-[calc(260px+(100vw-260px-440px)/2)] lg:-translate-x-1/2 z-50 bg-surface text-white px-5 py-3 rounded-xl shadow-2xl border border-white/10 flex items-center space-x-3 transition-all duration-300 ${toast.show ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0 pointer-events-none'}`}
      >
        <div className="w-2 h-2 rounded-full bg-primary-hover"></div>
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
}
