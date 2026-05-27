import { GripVertical, Pencil, Trash2, Globe, LayoutGrid, Check, X } from 'lucide-react';
import type { Link as LinkType } from '../types';
import { cn, getFaviconUrl } from '../lib/utils';
import { useState } from 'react';

interface LinkCardProps {
  link: LinkType;
  onUpdate: (id: string, updates: Partial<LinkType>) => void;
  onDelete: (id: string) => void;
  index: number;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  isDragging?: boolean;
}

export function LinkCard({ link, onUpdate, onDelete, index, onDragStart, onDragOver, onDragEnd, isDragging }: LinkCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title);
  const [editUrl, setEditUrl] = useState(link.url);

  const toggleActive = () => onUpdate(link.id, { active: !link.active });

  const handleSave = () => {
    onUpdate(link.id, { title: editTitle, url: editUrl });
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditTitle(link.title);
    setEditUrl(link.url);
    setIsEditing(false);
  };

  return (
    <div 
      className={cn(
        "bg-surface rounded-2xl p-4 flex items-center justify-between border transition-all group",
        isEditing ? "border-primary/50 shadow-lg shadow-primary/5" : "border-transparent hover:border-white/5",
        isDragging && "opacity-50 scale-[0.98] border-primary/30"
      )}
      draggable={!isEditing}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div className="flex items-center space-x-2 sm:space-x-4 flex-1 overflow-hidden pr-2 sm:pr-4">
        <div className="w-8 sm:w-10 h-10 flex items-center justify-center cursor-grab text-muted hover:text-white transition-colors opacity-100 md:opacity-50 group-hover:opacity-100 shrink-0">
          <GripVertical className="w-5 h-5" />
        </div>
        
        <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
          {link.url && getFaviconUrl(link.url) ? (
            <img 
              src={getFaviconUrl(link.url)!} 
              alt="" 
              className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                e.currentTarget.parentElement?.querySelector('.fallback-icon')?.classList.remove('hidden');
              }} 
            />
          ) : null}
          <LayoutGrid className={cn("w-4 h-4 sm:w-5 sm:h-5 text-muted fallback-icon", link.url && getFaviconUrl(link.url) ? "hidden absolute" : "")} />
        </div>
        
        <div className="flex-1 min-w-0 pr-4">
          {isEditing ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted tracking-wider px-1">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted/50"
                  placeholder="Link Title"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-semibold text-muted tracking-wider px-1">URL</label>
                <input
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted/50"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-semibold truncate text-base flex items-center mb-0.5">
                {link.title}
              </h3>
              <p className="text-muted text-sm truncate flex items-center">
                {link.url}
              </p>
            </>
          )}
        </div>
        
        {!isEditing && (
          <div className="text-right px-4 hidden md:block">
            <div className="text-sm font-medium">
              {link.clicks >= 1000 ? (link.clicks / 1000).toFixed(1) + 'k' : link.clicks}
            </div>
            <div className="text-xs text-muted">Clicks</div>
          </div>
        )}
      </div>
      
      <div className="flex items-center pl-2 sm:pl-4 border-l border-white/5 h-full shrink-0">
        {isEditing ? (
          <div className="flex items-center space-x-1 sm:space-x-2">
            <button 
              onClick={handleCancel}
              className="text-muted hover:text-rose-400 transition-colors p-1.5 sm:p-2.5 rounded-lg hover:bg-rose-400/10 text-xs sm:text-sm font-medium"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="bg-primary hover:bg-primary-hover text-white transition-colors py-1.5 sm:py-2 px-3 sm:px-4 rounded-lg flex items-center space-x-2 text-xs sm:text-sm font-medium"
            >
              <span>Save</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center sm:space-x-3">
            <div className="flex items-center space-x-0.5 sm:space-x-1">
              <button 
                onClick={() => setIsEditing(true)}
                className="text-muted hover:text-white transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-white/5"
              >
                <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button 
                onClick={() => onDelete(link.id)}
                className="text-muted hover:text-rose-400 transition-colors p-1.5 sm:p-2 rounded-lg hover:bg-rose-400/10"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>
            
            <div className="w-[1px] h-6 sm:h-8 bg-white/5 mx-1 sm:mx-2" />
            
            {/* Simple Switch */}
            <button 
              onClick={toggleActive}
              className={cn(
                "w-10 sm:w-12 h-5 sm:h-6 rounded-full relative transition-colors duration-200 ease-in-out border-2",
                link.active 
                  ? "bg-primary border-primary" 
                  : "bg-surface-hover border-surface-hover"
              )}
            >
              <span 
                className={cn(
                  "absolute top-0.5 left-0.5 bg-white w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-transform duration-200 ease-in-out shadow-sm block",
                  link.active ? "translate-x-5 sm:translate-x-6" : "translate-x-0"
                )}
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
