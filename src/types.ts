export interface Link {
  id: string;
  title: string;
  url: string;
  clicks: number;
  active: boolean;
}

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: string;
  avatarUrl: string;
}

export interface AnalyticsData {
  totalViews: number;
  viewsGrowth: number;
  totalClicks: number;
  clicksGrowth: number;
  avgCtr: number;
}
