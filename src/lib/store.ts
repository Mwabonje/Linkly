import type { Link as LinkType, User, AnalyticsData } from '../types';

const defaultUser: User = {
  id: 'usr_1',
  username: 'alex',
  fullName: 'Alex Thompson',
  role: 'UX Designer & Tech Content Creator',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop',
};

const defaultLinks: LinkType[] = [
  { id: '1', title: 'Portfolio Website', url: 'https://alexthompson.design', clicks: 8400, active: true },
  { id: '2', title: 'Twitter Profile', url: 'https://twitter.com/alex_design', clicks: 2100, active: true },
  { id: '3', title: 'YouTube Channel', url: 'https://youtube.com/c/AlexThompson', clicks: 0, active: false }
];

const defaultAnalytics: AnalyticsData = {
  totalViews: 24800,
  viewsGrowth: 12,
  totalClicks: 12100,
  clicksGrowth: 8.2,
  avgCtr: 4.2
};

// Simple pseudo-store that uses localStorage to work fully as a static SPA on Netlify
export const store = {
  getUser: async (): Promise<User> => {
    const saved = localStorage.getItem('linkly_user');
    return saved ? JSON.parse(saved) : defaultUser;
  },
  getLinks: async (): Promise<LinkType[]> => {
    const saved = localStorage.getItem('linkly_links');
    return saved ? JSON.parse(saved) : defaultLinks;
  },
  saveLinks: async (links: LinkType[]) => {
    localStorage.setItem('linkly_links', JSON.stringify(links));
  },
  getAnalytics: async (): Promise<AnalyticsData> => {
    return defaultAnalytics;
  }
};
