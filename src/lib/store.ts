import { supabase } from './supabase';
import type { Link as LinkType, User, AnalyticsData } from '../types';

const defaultUser: User = {
  id: '',
  username: '',
  fullName: '',
  role: '',
  avatarUrl: '',
};

const defaultLinks: LinkType[] = [];

const defaultAnalytics: AnalyticsData = {
  totalViews: 0,
  viewsGrowth: 0,
  totalClicks: 0,
  clicksGrowth: 0,
  avgCtr: 0
};

let sessionPromise: Promise<any> | null = null;
const getSession = () => {
  if (!supabase) return Promise.resolve(null);
  if (!sessionPromise) {
    sessionPromise = supabase.auth.getSession().then(({ data: { session } }) => {
      // Clear it after a short delay so we can get fresh session if needed later,
      // but concurrent calls will share the promise.
      setTimeout(() => { sessionPromise = null; }, 100);
      return session;
    });
  }
  return sessionPromise;
};

export const store = {
  getUser: async (username?: string): Promise<User> => {
    if (!supabase) return defaultUser;

    try {
      let query = supabase.from('profiles').select('*');
      
      if (username) {
        query = query.eq('username', username);
      } else {
        const session = await getSession();
        if (session) {
          query = query.eq('id', session.user.id);
        } else {
          // Fallback if not logged in and no username
          return defaultUser;
        }
      }

      const { data, error } = await query.maybeSingle();

      if (data) {
        return {
          id: data.id,
          username: data.username || 'user',
          fullName: data.full_name || 'My Name',
          role: data.role || '',
          avatarUrl: data.avatar_url || defaultUser.avatarUrl,
          theme: data.theme || 'dark-minimal',
        };
      }
    } catch (e) {
      console.error(e);
    }
    return defaultUser;
  },

  getProfileAndLinks: async (username: string): Promise<{ user: User, links: LinkType[] } | null> => {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          links (*)
        `)
        .eq('username', username)
        .maybeSingle();

      if (data) {
        const user: User = {
          id: data.id,
          username: data.username || 'user',
          fullName: data.full_name || 'My Name',
          role: data.role || '',
          avatarUrl: data.avatar_url || defaultUser.avatarUrl,
          theme: data.theme || 'dark-minimal',
        };

        let rawLinks = (data.links || []) as any[];
        rawLinks.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

        const links: LinkType[] = rawLinks.map((d: any) => ({
          id: d.id,
          title: d.title,
          url: d.url,
          clicks: d.clicks || 0,
          active: d.active !== false
        }));

        return { user, links };
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  },

  saveUser: async (user: User) => {
    if (!supabase) return;
    try {
      const session = await getSession();
      if (!session) return;
      
      await supabase
        .from('profiles')
        .upsert({
          id: session.user.id, // Only allow updating own profile
          username: user.username,
          full_name: user.fullName,
          role: user.role,
          avatar_url: user.avatarUrl,
          theme: user.theme || 'dark-minimal',
          updated_at: new Date().toISOString()
        });
    } catch (e) {
      console.error(e);
    }
  },

  getLinks: async (userId?: string): Promise<LinkType[]> => {
    if (!supabase) return defaultLinks;
    try {
      let query = supabase.from('links').select('*').order('created_at', { ascending: true });
      
      if (userId) {
        query = query.eq('user_id', userId);
      } else {
        const session = await getSession();
        if (session) {
          query = query.eq('user_id', session.user.id);
        }
      }

      const { data, error } = await query;
      
      if (data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          title: d.title,
          url: d.url,
          clicks: d.clicks || 0,
          active: d.active !== false
        }));
      }
    } catch (e) {
      console.error(e);
    }
    return defaultLinks;
  },

  saveLinks: async (links: LinkType[]) => {
    if (!supabase) return;
    try {
      const session = await getSession();
      if (!session) return;

      // Delete existing
      await supabase.from('links').delete().eq('user_id', session.user.id);

      // Insert new
      const toInsert = links.map((link, index) => ({
        user_id: session.user.id,
        title: link.title,
        url: link.url,
        clicks: link.clicks,
        active: link.active,
        created_at: new Date(Date.now() + index).toISOString(), // ordering hack
      }));

      await supabase.from('links').insert(toInsert);
    } catch (e) {
      console.error(e);
    }
  },

  recordClick: async (linkId: string) => {
    if (!supabase) return;
    try {
      await supabase.rpc('increment_click', { link_id: linkId });
    } catch (e) {
      console.error('Failed to record click:', e);
    }
  },

  getAnalytics: async (): Promise<AnalyticsData> => {
    return defaultAnalytics;
  }
};
