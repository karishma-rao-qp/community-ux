export type WorkflowStatus =
  | 'Completed'
  | 'Scheduled'
  | 'Draft'
  | 'Needs Attention'
  | 'Failed';

export interface RecentWorkflow {
  id: string;
  name: string;
  requestSummary: string;
  status: WorkflowStatus;
  membersAffected: number;
  updatedAt: string;
}

export const SUGGESTED_PROMPTS: string[] = [
  'Invite members from a saved segment to take a survey.',
  'Assign rewards to members who completed the latest survey.',
  'Re-engage inactive members with a discussion invitation.',
  'Create a recurring poll for active community members.',
];

export const FOLLOW_UP_SEGMENTS: string[] = [
  'All Active Members',
  'Inactive for 30+ Days',
  'New Members — Last 30 Days',
  'Highly Engaged Members',
];

export const RECENT_WORKFLOWS: RecentWorkflow[] = [
  {
    id: 'wf-1048',
    name: 'Q3 Product Feedback Invitations',
    requestSummary: 'Invite highly engaged members to the Q3 product feedback survey.',
    status: 'Completed',
    membersAffected: 428,
    updatedAt: '2026-07-22T08:30:00+05:30',
  },
  {
    id: 'wf-1047',
    name: 'New Member Welcome Poll',
    requestSummary: 'Run a weekly welcome poll for members who joined in the last 30 days.',
    status: 'Scheduled',
    membersAffected: 186,
    updatedAt: '2026-07-21T16:10:00+05:30',
  },
  {
    id: 'wf-1046',
    name: 'July Completion Rewards',
    requestSummary: 'Assign 250 points to eligible members who completed the July study.',
    status: 'Needs Attention',
    membersAffected: 92,
    updatedAt: '2026-07-21T11:45:00+05:30',
  },
  {
    id: 'wf-1045',
    name: 'Inactive Member Re-engagement',
    requestSummary: 'Invite members inactive for 30 days to join the community discussion.',
    status: 'Draft',
    membersAffected: 0,
    updatedAt: '2026-07-20T15:20:00+05:30',
  },
  {
    id: 'wf-1044',
    name: 'Quarterly Research Participation Reward Eligibility Review',
    requestSummary: 'Review reward eligibility for members across active research studies.',
    status: 'Failed',
    membersAffected: 317,
    updatedAt: '2026-07-19T09:05:00+05:30',
  },
  {
    id: 'wf-1043',
    name: 'Healthcare Panel Profile Review',
    requestSummary: 'Create a report of incomplete healthcare member profiles.',
    status: 'Completed',
    membersAffected: 0,
    updatedAt: '2026-07-18T14:35:00+05:30',
  },
  {
    id: 'wf-1042',
    name: 'Monthly Community Pulse',
    requestSummary: 'Publish the approved monthly pulse poll to active members.',
    status: 'Scheduled',
    membersAffected: 1240,
    updatedAt: '2026-07-17T10:00:00+05:30',
  },
  {
    id: 'wf-1041',
    name: 'Language Preference Audit',
    requestSummary: 'Report member language preferences by region.',
    status: 'Completed',
    membersAffected: 0,
    updatedAt: '2026-07-16T17:25:00+05:30',
  },
];
