export interface TopicCategoryTranslation {
  id: string;
  categoryId: string;
  languageCode: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface TopicCategory {
  id: string;
  key: string;
  title: string;
  description: string;
  criteria: string;
  topicCount: number;
  createdAt: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  filterId: string | null;
  tags: string[];
  status: 'active' | 'draft' | 'deleted';
  createdBy: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  comments: number;
}

export interface TopicFilter {
  id: string;
  label: string;
}

export interface TopicTranslation {
  id: string;
  topicId: string;
  languageCode: string;
  title: string;
  description: string;
  tags: string;
  createdAt: string;
  updatedAt: string;
}

export const TOPIC_TITLE_MAX_LENGTH = 128;
export const TOPIC_DESCRIPTION_MAX_LENGTH = 2000;

export const MOCK_TOPIC_FILTERS: TopicFilter[] = [
  { id: 'filter-001', label: 'All members' },
  { id: 'filter-002', label: 'Active panelists' },
  { id: 'filter-003', label: 'Survey completers' },
  { id: 'filter-004', label: 'Beta testers' },
  { id: 'filter-005', label: 'Researchers only' },
];

export const MOCK_CATEGORY_CRITERIA_OPTIONS = [
  { value: 'all-active', label: 'Open to all active members' },
  {
    value: 'survey-completers',
    label: 'Open to all active members with at least one completed survey',
  },
  {
    value: 'event-attendees',
    label: 'Members who have attended at least one community event',
  },
  {
    value: 'researcher-badge',
    label: 'Panel members with Researcher or Expert badge',
  },
  { value: 'beta-testers', label: 'Invited beta testers only' },
] as const;

export const CATEGORY_TITLE_MAX_LENGTH = 200;
export const CATEGORY_DESCRIPTION_MAX_LENGTH = 1000;

export const MOCK_TOPIC_CATEGORIES: TopicCategory[] = [
  {
    id: 'cat-default',
    key: 'default',
    title: 'Default',
    description: 'General community discussions without a specific category.',
    criteria: 'Open to all active members.',
    topicCount: 4,
    createdAt: '2024-11-01T08:00:00Z',
  },
  {
    id: 'cat-001',
    key: 'product-feedback',
    title: 'Product Feedback',
    description: 'Share ideas and feedback about our products and services.',
    criteria: 'Open to all active members with at least one completed survey.',
    topicCount: 12,
    createdAt: '2025-01-15T10:00:00Z',
  },
  {
    id: 'cat-002',
    key: 'community-events',
    title: 'Community Events',
    description: 'Discuss upcoming events, webinars, and community meetups.',
    criteria: 'Members who have attended at least one community event.',
    topicCount: 8,
    createdAt: '2025-02-03T14:30:00Z',
  },
  {
    id: 'cat-003',
    key: 'research-insights',
    title: 'Research Insights',
    description: 'Deep dives into research methodology and industry trends.',
    criteria: 'Panel members with Researcher or Expert badge.',
    topicCount: 5,
    createdAt: '2025-03-10T09:15:00Z',
  },
  {
    id: 'cat-004',
    key: 'off-topic-lounge',
    title: 'Off-Topic Lounge — A Very Long Category Name That Tests Truncation in the UI',
    description: 'Casual conversations unrelated to research. Keep it friendly!',
    criteria: '',
    topicCount: 23,
    createdAt: '2025-04-22T16:45:00Z',
  },
  {
    id: 'cat-005',
    key: 'beta-testing',
    title: 'Beta Testing',
    description: 'Early access discussions for new features and prototypes.',
    criteria: 'Invited beta testers only.',
    topicCount: 3,
    createdAt: '2025-05-01T11:00:00Z',
  },
];

export const MOCK_TOPIC_CATEGORY_TRANSLATIONS: TopicCategoryTranslation[] = [
  {
    id: 'tr-001',
    categoryId: 'cat-001',
    languageCode: 'es',
    title: 'Comentarios sobre el producto',
    description: 'Comparte ideas y comentarios sobre nuestros productos y servicios.',
    createdAt: '2025-06-01T10:00:00Z',
    updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'tr-002',
    categoryId: 'cat-001',
    languageCode: 'fr',
    title: 'Retours produit',
    description: 'Partagez vos idées et commentaires sur nos produits et services.',
    createdAt: '2025-06-01T10:00:00Z',
    updatedAt: '2025-06-01T10:00:00Z',
  },
  {
    id: 'tr-003',
    categoryId: 'cat-002',
    languageCode: 'es',
    title: 'Eventos de la comunidad',
    description: 'Habla de próximos eventos, seminarios web y encuentros comunitarios.',
    createdAt: '2025-06-02T10:00:00Z',
    updatedAt: '2025-06-02T10:00:00Z',
  },
  {
    id: 'tr-004',
    categoryId: 'cat-003',
    languageCode: 'de',
    title: 'Forschungserkenntnisse',
    description: 'Vertiefende Einblicke in Forschungsmethoden und Branchentrends.',
    createdAt: '2025-06-03T10:00:00Z',
    updatedAt: '2025-06-03T10:00:00Z',
  },
];

export const MOCK_TOPICS: Topic[] = [
  {
    id: 'topic-001',
    title: 'Test 6 400 × 225 px.jpg',
    categoryId: 'cat-default',
    description: '',
    filterId: null,
    tags: [],
    status: 'active',
    createdBy: 'karishma.rao',
    createdAt: '2026-04-06T12:56:52Z',
    likes: 0,
    dislikes: 0,
    comments: 0,
  },
  {
    id: 'topic-002',
    title: 'What feature would you add to the mobile app?',
    categoryId: 'cat-001',
    description: 'Share your ideas for improving our mobile experience.',
    filterId: 'filter-002',
    tags: ['mobile', 'feedback'],
    status: 'active',
    createdBy: 'james.chen',
    createdAt: '2026-03-18T09:14:22Z',
    likes: 12,
    dislikes: 1,
    comments: 8,
  },
  {
    id: 'topic-003',
    title: 'Summer webinar recap and Q&A',
    categoryId: 'cat-002',
    description: '',
    filterId: null,
    tags: ['events'],
    status: 'active',
    createdBy: 'maria.gonzalez',
    createdAt: '2026-03-12T16:30:00Z',
    likes: 24,
    dislikes: 0,
    comments: 15,
  },
  {
    id: 'topic-004',
    title: 'Best practices for longitudinal studies',
    categoryId: 'cat-003',
    description: '',
    filterId: 'filter-005',
    tags: [],
    status: 'active',
    createdBy: 'david.okonkwo',
    createdAt: '2026-02-28T11:05:33Z',
    likes: 7,
    dislikes: 2,
    comments: 4,
  },
  {
    id: 'topic-005',
    title: 'Favorite books this month',
    categoryId: 'cat-004',
    description: '',
    filterId: null,
    tags: ['off-topic'],
    status: 'active',
    createdBy: 'sophie.martin',
    createdAt: '2026-02-20T18:42:10Z',
    likes: 31,
    dislikes: 3,
    comments: 22,
  },
  {
    id: 'topic-006',
    title: 'New dashboard prototype feedback',
    categoryId: 'cat-005',
    description: '',
    filterId: 'filter-004',
    tags: ['beta'],
    status: 'draft',
    createdBy: 'alex.kim',
    createdAt: '2026-02-15T14:00:00Z',
    likes: 0,
    dislikes: 0,
    comments: 0,
  },
  {
    id: 'topic-007',
    title: 'How do you prefer to receive survey invitations?',
    categoryId: 'cat-default',
    description: '',
    filterId: null,
    tags: [],
    status: 'active',
    createdBy: 'priya.sharma',
    createdAt: '2026-01-30T10:22:18Z',
    likes: 5,
    dislikes: 0,
    comments: 11,
  },
  {
    id: 'topic-008',
    title: 'Community meetup photos — January edition',
    categoryId: 'cat-002',
    description: '',
    filterId: null,
    tags: ['events'],
    status: 'active',
    createdBy: 'karishma.rao',
    createdAt: '2026-01-22T08:15:44Z',
    likes: 18,
    dislikes: 1,
    comments: 9,
  },
  {
    id: 'topic-009',
    title: 'Tips for improving survey completion rates',
    categoryId: 'cat-003',
    description: '',
    filterId: 'filter-005',
    tags: [],
    status: 'active',
    createdBy: 'li.wei',
    createdAt: '2026-01-10T13:48:05Z',
    likes: 42,
    dislikes: 0,
    comments: 19,
  },
  {
    id: 'topic-010',
    title: 'Weekend plans thread',
    categoryId: 'cat-004',
    description: '',
    filterId: null,
    tags: ['off-topic'],
    status: 'active',
    createdBy: 'emma.wilson',
    createdAt: '2025-12-28T20:11:30Z',
    likes: 9,
    dislikes: 4,
    comments: 27,
  },
  {
    id: 'topic-011',
    title: 'Beta feature: dark mode — early impressions',
    categoryId: 'cat-005',
    description: '',
    filterId: 'filter-004',
    tags: ['beta'],
    status: 'active',
    createdBy: 'carlos.rivera',
    createdAt: '2025-12-15T07:33:21Z',
    likes: 15,
    dislikes: 2,
    comments: 6,
  },
  {
    id: 'topic-012',
    title: 'Archived discussion — holiday rewards program 2025',
    categoryId: 'cat-default',
    description: '',
    filterId: null,
    tags: [],
    status: 'deleted',
    createdBy: 'admin.user',
    createdAt: '2025-11-20T15:00:00Z',
    likes: 3,
    dislikes: 0,
    comments: 2,
  },
  {
    id: 'topic-013',
    title: 'Spam post removed by moderator',
    categoryId: 'cat-default',
    description: '',
    filterId: null,
    tags: [],
    status: 'deleted',
    createdBy: 'unknown.member',
    createdAt: '2025-10-05T03:12:00Z',
    likes: 0,
    dislikes: 5,
    comments: 0,
  },
];
