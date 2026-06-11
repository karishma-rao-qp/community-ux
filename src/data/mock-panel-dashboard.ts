export type MomChange = {
  value: number;
  direction: 'up' | 'down';
};

export type KpiMetric = {
  id: string;
  label: string;
  value: string;
  mom: MomChange;
  icon: 'users' | 'sessions' | 'profile' | 'survey' | 'poll';
  variant?: 'donut' | 'gauge' | 'default';
  numericValue?: number;
};

export type EngagementTab = 'surveys' | 'polls' | 'topics' | 'ideaboards';

export type EngagementTrendData = {
  totalResponses: number;
  totalInvites: number;
  responseRate: number;
  comments?: number;
  likes?: number;
  dislikes?: number;
};

export type ActivityBreakdownItem = {
  name: string;
  value: number;
  color: string;
};

export type EngagementDriver = {
  rank: number;
  name: string;
  count: number;
};

export type ChurnSegment = {
  id: string;
  label: string;
  count: number;
  displayCount: string;
  color: string;
  ctaLabel: string;
  segmentType: 'at-risk' | 'abandoned' | 'active';
};

export type WeeklyTrendPoint = {
  week: string;
  overall: number;
  surveys: number;
  polls: number;
};

export type HeatmapCell = {
  day: number;
  hour: number;
  value: number;
};

export type LeaderboardMember = {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  points: number;
};

export type TopEngagedMember = {
  id: string;
  name: string;
  count: number;
  maxCount: number;
};

export type SessionDataPoint = {
  date: string;
  count: number;
};

export type MemberActivityPoint = {
  date: string;
  surveys: number;
  polls: number;
};

export type CommunityHealthMetric = {
  id: string;
  label: string;
  value: string;
  mom: MomChange;
  variant?: 'donut' | 'gauge' | 'default';
  numericValue?: number;
};

export const PORTAL_URL = 'https://panel.questionpro.com/community/us-gaming-panel';

export const DEFAULT_DATE_RANGE = {
  start: new Date(2025, 4, 10),
  end: new Date(2025, 5, 9),
};

export const KPI_METRICS: KpiMetric[] = [
  {
    id: 'active-members',
    label: 'Active Members',
    value: '140',
    mom: { value: 12.4, direction: 'up' },
    icon: 'users',
    variant: 'donut',
    numericValue: 140,
  },
  {
    id: 'sessions',
    label: 'Sessions',
    value: '713',
    mom: { value: 8.2, direction: 'up' },
    icon: 'sessions',
  },
  {
    id: 'profile-completion',
    label: 'Profile Completion',
    value: '99%',
    mom: { value: 2.1, direction: 'up' },
    icon: 'profile',
    variant: 'gauge',
    numericValue: 99,
  },
  {
    id: 'survey-response-rate',
    label: 'Survey Response Rate',
    value: '2.9%',
    mom: { value: 0.4, direction: 'down' },
    icon: 'survey',
  },
  {
    id: 'poll-completion-rate',
    label: 'Poll Completion Rate',
    value: '3.4%',
    mom: { value: 1.2, direction: 'up' },
    icon: 'poll',
  },
];

export const ENGAGEMENT_TRENDS: Record<EngagementTab, EngagementTrendData> = {
  surveys: {
    totalResponses: 2847,
    totalInvites: 98200,
    responseRate: 2.9,
  },
  polls: {
    totalResponses: 4120,
    totalInvites: 121000,
    responseRate: 3.4,
  },
  topics: {
    totalResponses: 1893,
    totalInvites: 45000,
    responseRate: 4.2,
    comments: 3421,
    likes: 8920,
    dislikes: 412,
  },
  ideaboards: {
    totalResponses: 756,
    totalInvites: 28000,
    responseRate: 2.7,
    comments: 1204,
    likes: 3890,
    dislikes: 98,
  },
};

export const ACTIVITY_BREAKDOWN: ActivityBreakdownItem[] = [
  { name: 'Surveys', value: 38, color: '#185FA5' },
  { name: 'Polls', value: 32, color: '#1D9E75' },
  { name: 'Topics', value: 21, color: '#6366F1' },
  { name: 'Ideaboards', value: 9, color: '#EF9F27' },
];

export const ENGAGEMENT_DRIVERS: EngagementDriver[] = [
  { rank: 1, name: 'US Gaming 1', count: 1240 },
  { rank: 2, name: 'Brand Perception Q2', count: 982 },
  { rank: 3, name: 'Weekly Pulse Poll', count: 876 },
  { rank: 4, name: 'Product Feedback Survey', count: 654 },
  { rank: 5, name: 'Community Satisfaction', count: 521 },
];

export const CHURN_SEGMENTS: ChurnSegment[] = [
  {
    id: 'active',
    label: 'Active Members',
    count: 140,
    displayCount: '140',
    color: '#185FA5',
    ctaLabel: '',
    segmentType: 'active',
  },
  {
    id: 'at-risk',
    label: 'At Risk Members',
    count: 5500,
    displayCount: '5.5k',
    color: '#E24B4A',
    ctaLabel: 'Send Re-engagement Campaign →',
    segmentType: 'at-risk',
  },
  {
    id: 'abandoned',
    label: 'Survey Abandoned Members',
    count: 1800,
    displayCount: '1.8k',
    color: '#EF9F27',
    ctaLabel: 'Send Reminder →',
    segmentType: 'abandoned',
  },
];

export const WEEKLY_TRENDS: WeeklyTrendPoint[] = [
  { week: 'Week 1', overall: 190, surveys: 112, polls: 78 },
  { week: 'Week 2', overall: 98, surveys: 58, polls: 40 },
  { week: 'Week 3', overall: 42, surveys: 24, polls: 18 },
  { week: 'Week 4', overall: 18, surveys: 10, polls: 8 },
  { week: 'Week 5', overall: 5, surveys: 3, polls: 2 },
];

export const HEATMAP_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const HEATMAP_HOURS = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];

export const HEATMAP_DATA: HeatmapCell[] = (() => {
  const cells: HeatmapCell[] = [];
  for (let day = 0; day < 7; day++) {
    for (const hour of HEATMAP_HOURS) {
      let value = 8 + ((day * 3 + hour) % 17);
      if (day >= 1 && day <= 4 && hour >= 10 && hour <= 16) {
        value = 55 + ((day * 5 + hour) % 35);
      }
      if (day === 5 || day === 6) {
        value = 3 + ((day + hour) % 12);
      }
      cells.push({ day, hour, value });
    }
  }
  return cells;
})();

export const LEADERBOARD: LeaderboardMember[] = [
  { rank: 1, id: 'M-10482', name: 'Sarah Chen', avatar: 'SC', points: 4820 },
  { rank: 2, id: 'M-09231', name: 'Marcus Williams', avatar: 'MW', points: 4510 },
  { rank: 3, id: 'M-11847', name: 'Emily Rodriguez', avatar: 'ER', points: 4290 },
  { rank: 4, id: 'M-08765', name: 'James Thompson', avatar: 'JT', points: 3980 },
  { rank: 5, id: 'M-12003', name: 'Aisha Patel', avatar: 'AP', points: 3750 },
  { rank: 6, id: 'M-09456', name: 'David Kim', avatar: 'DK', points: 3620 },
  { rank: 7, id: 'M-11209', name: 'Olivia Martinez', avatar: 'OM', points: 3410 },
  { rank: 8, id: 'M-08392', name: 'Ryan O\'Connor', avatar: 'RO', points: 3180 },
  { rank: 9, id: 'M-10567', name: 'Priya Sharma', avatar: 'PS', points: 2950 },
  { rank: 10, id: 'M-09901', name: 'Michael Brown', avatar: 'MB', points: 2780 },
  { rank: 11, id: 'M-10734', name: 'Lisa Nguyen', avatar: 'LN', points: 2640 },
  { rank: 12, id: 'M-09128', name: 'Chris Anderson', avatar: 'CA', points: 2510 },
];

const TOP_ENGAGED_NAMES = [
  'Sarah Chen', 'Marcus Williams', 'Emily Rodriguez', 'James Thompson', 'Aisha Patel',
  'David Kim', 'Olivia Martinez', 'Ryan O\'Connor', 'Priya Sharma', 'Michael Brown',
  'Lisa Nguyen', 'Chris Anderson', 'Jennifer Lee', 'Robert Garcia', 'Amanda Foster',
  'Daniel Wright', 'Sophia Turner', 'Kevin Johnson', 'Maria Santos', 'Thomas Evans',
  'Rachel Green', 'Brian Cooper', 'Nina Patel', 'Jason Miller', 'Laura Davis',
  'Eric Wilson', 'Hannah Brooks', 'Steven Clark', 'Megan Taylor', 'Andrew Moore',
  'Jessica Hall', 'Patrick Lewis', 'Catherine Young', 'Gregory Allen', 'Victoria King',
  'Nathan Scott', 'Stephanie Reed', 'Brandon Cook', 'Michelle Bell', 'Tyler Morgan',
  'Ashley Rivera', 'Justin Phillips', 'Samantha Ward', 'Derek Campbell', 'Brittany Parker',
  'Aaron Collins', 'Kayla Stewart', 'Jordan Hughes', 'Taylor Morris', 'Alexandra Price',
];

export const TOP_ENGAGED_MEMBERS: TopEngagedMember[] = TOP_ENGAGED_NAMES.map((name, i) => {
  const count = Math.max(12, 142 - i * 3);
  const idNum = 10482 + i * 127;
  return {
    id: `M-${String(idNum).padStart(5, '0')}`,
    name,
    count,
    maxCount: 142,
  };
});

export const SESSIONS_DATA: SessionDataPoint[] = [
  { date: '2025-05-10', count: 65 },
  { date: '2025-05-11', count: 48 },
  { date: '2025-05-12', count: 42 },
  { date: '2025-05-13', count: 38 },
  { date: '2025-05-14', count: 35 },
  { date: '2025-05-15', count: 41 },
  { date: '2025-05-16', count: 44 },
  { date: '2025-05-17', count: 39 },
  { date: '2025-05-18', count: 28 },
  { date: '2025-05-19', count: 32 },
  { date: '2025-05-20', count: 45 },
  { date: '2025-05-21', count: 52 },
  { date: '2025-05-22', count: 48 },
  { date: '2025-05-23', count: 55 },
  { date: '2025-05-24', count: 50 },
  { date: '2025-05-25', count: 58 },
  { date: '2025-05-26', count: 44 },
  { date: '2025-05-27', count: 39 },
  { date: '2025-05-28', count: 47 },
  { date: '2025-05-29', count: 51 },
  { date: '2025-05-30', count: 43 },
  { date: '2025-05-31', count: 36 },
  { date: '2025-06-01', count: 28 },
  { date: '2025-06-02', count: 32 },
  { date: '2025-06-03', count: 41 },
  { date: '2025-06-04', count: 38 },
  { date: '2025-06-05', count: 45 },
  { date: '2025-06-06', count: 49 },
  { date: '2025-06-07', count: 42 },
  { date: '2025-06-08', count: 35 },
  { date: '2025-06-09', count: 40 },
];

export const COMMUNITY_HEALTH_METRICS: CommunityHealthMetric[] = [
  {
    id: 'sign-ups',
    label: 'Sign Ups',
    value: '12',
    mom: { value: 89.58, direction: 'down' },
  },
  {
    id: 'verified-members',
    label: 'Verified Members',
    value: '6',
    mom: { value: 500, direction: 'up' },
  },
  {
    id: 'sessions-health',
    label: 'Sessions',
    value: '713',
    mom: { value: 8.2, direction: 'up' },
    variant: 'donut',
    numericValue: 713,
  },
  {
    id: 'profile-completion-health',
    label: 'Profile Completion',
    value: '99%',
    mom: { value: 2.1, direction: 'up' },
    variant: 'gauge',
    numericValue: 99,
  },
];

export const MEMBER_ACTIVITY_DATA: MemberActivityPoint[] = [
  { date: '2025-05-10', surveys: 12, polls: 8 },
  { date: '2025-05-11', surveys: 18, polls: 12 },
  { date: '2025-05-12', surveys: 24, polls: 16 },
  { date: '2025-05-13', surveys: 31, polls: 22 },
  { date: '2025-05-14', surveys: 45, polls: 28 },
  { date: '2025-05-15', surveys: 72, polls: 38 },
  { date: '2025-05-16', surveys: 88, polls: 42 },
  { date: '2025-05-17', surveys: 65, polls: 35 },
  { date: '2025-05-18', surveys: 42, polls: 24 },
  { date: '2025-05-19', surveys: 38, polls: 20 },
  { date: '2025-05-20', surveys: 52, polls: 30 },
  { date: '2025-05-21', surveys: 48, polls: 28 },
  { date: '2025-05-22', surveys: 55, polls: 32 },
  { date: '2025-05-23', surveys: 62, polls: 36 },
  { date: '2025-05-24', surveys: 58, polls: 34 },
  { date: '2025-05-25', surveys: 44, polls: 26 },
  { date: '2025-05-26', surveys: 39, polls: 22 },
  { date: '2025-05-27', surveys: 47, polls: 28 },
  { date: '2025-05-28', surveys: 51, polls: 30 },
  { date: '2025-05-29', surveys: 43, polls: 25 },
  { date: '2025-05-30', surveys: 36, polls: 20 },
  { date: '2025-06-01', surveys: 28, polls: 16 },
  { date: '2025-06-02', surveys: 32, polls: 18 },
  { date: '2025-06-03', surveys: 41, polls: 24 },
  { date: '2025-06-04', surveys: 38, polls: 22 },
  { date: '2025-06-05', surveys: 45, polls: 26 },
  { date: '2025-06-06', surveys: 49, polls: 28 },
  { date: '2025-06-07', surveys: 42, polls: 24 },
  { date: '2025-06-08', surveys: 35, polls: 20 },
  { date: '2025-06-09', surveys: 40, polls: 22 },
];

export const ACTION_ITEMS = [
  {
    id: 're-engage',
    label: 'Re-engage at-risk members (5.5k)',
    segmentType: 'at-risk' as const,
  },
  {
    id: 'follow-up',
    label: 'Follow up survey abandoners (1.8k)',
    segmentType: 'abandoned' as const,
  },
  {
    id: 'boost-activity',
    label: 'Boost low-activity days',
    action: 'heatmap' as const,
  },
  {
    id: 'reward-top',
    label: 'Reward top members',
    action: 'incentive' as const,
  },
];

export type MemberProfile = {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  status: 'active' | 'at-risk' | 'inactive';
  points: number;
  surveysCompleted: number;
  pollsCompleted: number;
};

export const MEMBER_PROFILES: Record<string, MemberProfile> = {
  'M-10482': {
    id: 'M-10482',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    joinDate: '2024-03-15',
    status: 'active',
    points: 4820,
    surveysCompleted: 89,
    pollsCompleted: 53,
  },
  'M-09231': {
    id: 'M-09231',
    name: 'Marcus Williams',
    email: 'marcus.w@email.com',
    joinDate: '2024-01-22',
    status: 'active',
    points: 4510,
    surveysCompleted: 76,
    pollsCompleted: 52,
  },
};
