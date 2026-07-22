'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { PageHeader } from '@/components/ui/PageHeader';
import {
  FOLLOW_UP_SEGMENTS,
  RECENT_WORKFLOWS,
  SUGGESTED_PROMPTS,
  type RecentWorkflow,
  type WorkflowStatus,
} from '@/data/mock-agent';
import { formatRelativeDate, truncate } from '@/data/mock-utils';

const WuButton = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuButton })),
  { ssr: false }
);
const WuCard = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuCard })),
  { ssr: false }
);
const WuTextarea = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuTextarea })),
  { ssr: false }
);
const WuChip = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuChip })),
  { ssr: false }
);
const WuModal = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuModal })),
  { ssr: false }
);
const WuModalHeader = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuModalHeader })),
  { ssr: false }
);
const WuModalContent = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuModalContent })),
  { ssr: false }
);
const WuModalFooter = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuModalFooter })),
  { ssr: false }
);
const WuModalClose = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuModalClose })),
  { ssr: false }
);
const WuSelect = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuSelect })),
  { ssr: false }
);

type AgentFlowState = 'idle' | 'loading' | 'follow-up' | 'ready' | 'error';
type MessageRole = 'agent' | 'manager';

interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
}

interface FrequencyOption {
  value: 'manual' | 'once' | 'daily' | 'weekly' | 'monthly';
  label: string;
}

const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { value: 'manual', label: 'Manual' },
  { value: 'once', label: 'Once' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'agent',
  text: 'Welcome! Tell me what you want to accomplish in your community, and I’ll help you prepare a safe, reviewable workflow.',
};

const STATUS_COLORS: Partial<Record<WorkflowStatus, 'success' | 'warning' | 'danger'>> = {
  Completed: 'success',
  'Needs Attention': 'warning',
  Failed: 'danger',
};

function hasMemberTarget(request: string): boolean {
  const normalized = request.toLowerCase();
  return [
    'active members',
    'inactive members',
    'saved segment',
    'completed the',
    'new members',
    'highly engaged',
  ].some((target) => normalized.includes(target));
}

function WorkflowStatusChip({ status }: { status: WorkflowStatus }) {
  return (
    <WuChip
      size="sm"
      variant={STATUS_COLORS[status] ? 'primary' : 'secondary'}
      color={STATUS_COLORS[status]}
    >
      {status}
    </WuChip>
  );
}

export default function AgentHomePage() {
  const router = useRouter();
  const { showToast } = useWuShowToast();
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [request, setRequest] = useState('');
  const [originalRequest, setOriginalRequest] = useState('');
  const [flowState, setFlowState] = useState<AgentFlowState>('idle');
  const [hasAskedFollowUp, setHasAskedFollowUp] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [frequency, setFrequency] = useState<FrequencyOption>(FREQUENCY_OPTIONS[0]);

  function finishProcessing(text: string) {
    if (text.toLowerCase().includes('simulate error')) {
      setFlowState('error');
      return;
    }

    if (!hasAskedFollowUp && !hasMemberTarget(text)) {
      setMessages((current) => [
        ...current,
        {
          id: `agent-${Date.now()}`,
          role: 'agent',
          text: 'Which member segment should I use?',
        },
      ]);
      setHasAskedFollowUp(true);
      setFlowState('follow-up');
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: `agent-${Date.now()}`,
        role: 'agent',
        text: 'Your plan is ready to review.',
      },
    ]);
    setFlowState('ready');
    showToast({ message: 'Your plan is ready to review.', variant: 'success' });
  }

  function processRequest(text: string, appendMessage = true) {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (appendMessage) {
      setMessages((current) => [
        ...current,
        { id: `manager-${Date.now()}`, role: 'manager', text: trimmed },
      ]);
    }
    if (!originalRequest) setOriginalRequest(trimmed);
    setRequest('');
    setFlowState('loading');
    window.setTimeout(() => finishProcessing(trimmed), 1100);
  }

  function handleRetry() {
    setRequest(originalRequest);
    setFlowState('loading');
    window.setTimeout(() => finishProcessing(originalRequest), 1100);
  }

  function handleEditRequest() {
    setRequest(originalRequest);
    setFlowState('idle');
  }

  function handleWorkflowOpen(workflow: RecentWorkflow) {
    if (workflow.status === 'Failed') {
      setOriginalRequest(workflow.requestSummary);
      setRequest(workflow.requestSummary);
      setFlowState('error');
      return;
    }
    showToast({ message: `${workflow.name} selected`, variant: 'success' });
  }

  function handleSaveDraft() {
    setIsSaveOpen(false);
    showToast({ message: 'Workflow saved as a draft.', variant: 'success' });
  }

  const canSend = request.trim().length > 0 && flowState !== 'loading';

  return (
    <div className="min-h-full bg-slate-50 p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          title="Community Manager Agent"
          description="Describe what you want to accomplish, then review and approve every action before it runs."
          action={
            <div className="flex items-center gap-2">
              <WuButton variant="secondary" onClick={() => router.push('/community-admin')}>
                <span className="wm-arrow-back" /> Back
              </WuButton>
              <WuButton
                variant="outline"
                disabled={!originalRequest}
                onClick={() => setIsSaveOpen(true)}
              >
                <span className="wm-draft" /> Save Draft
              </WuButton>
            </div>
          }
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
          <WuCard rounded className="overflow-hidden border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-white px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-sm">
                  <span className="wm-auto-awesome" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">Welcome to your community workspace</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    I can help prepare invitations, rewards, member updates, reports, and recurring community workflows.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex min-h-[350px] flex-col gap-4 px-6 py-5" aria-live="polite">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'manager' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === 'manager'
                        ? 'rounded-br-md bg-blue-600 text-white'
                        : 'rounded-bl-md border border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}

              {flowState === 'loading' && (
                <div className="max-w-md rounded-2xl rounded-bl-md border border-blue-100 bg-blue-50 px-4 py-4">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="font-medium text-blue-900">Reviewing your request…</span>
                    <span className="text-xs text-blue-700">Preparing next step</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-blue-100">
                    <div className="h-full w-2/3 animate-pulse rounded-full bg-blue-600" />
                  </div>
                </div>
              )}

              {flowState === 'follow-up' && (
                <div className="ml-1 flex flex-wrap gap-2">
                  {FOLLOW_UP_SEGMENTS.map((segment) => (
                    <WuButton
                      key={segment}
                      size="sm"
                      variant="outline"
                      onClick={() => setRequest(segment)}
                    >
                      {segment}
                    </WuButton>
                  ))}
                </div>
              )}

              {flowState === 'ready' && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  <div className="flex items-center gap-2 font-medium">
                    <span className="wm-check-circle" /> Your plan is ready to review.
                  </div>
                  <p className="mt-1 text-emerald-700">No community action has been performed.</p>
                </div>
              )}

              {flowState === 'error' && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-900">
                  <div className="flex gap-3">
                    <span className="wm-error mt-0.5 text-lg" />
                    <div className="flex-1">
                      <p className="font-medium">We couldn’t process your request right now.</p>
                      <p className="mt-1 text-red-700">Please try again or edit your request.</p>
                      <div className="mt-3 flex gap-2">
                        <WuButton size="sm" color="error" onClick={handleRetry}>Try Again</WuButton>
                        <WuButton size="sm" variant="outline" onClick={handleEditRequest}>Edit Request</WuButton>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-200 bg-white px-6 py-5">
              <WuTextarea
                Label={flowState === 'follow-up' ? 'Your answer' : 'What would you like the agent to do?'}
                variant="outlined"
                rows={4}
                placeholder="Example: Invite highly engaged members to complete our product feedback survey."
                value={request}
                onChange={(event) => setRequest(event.target.value)}
                onKeyDown={(event) => {
                  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && canSend) {
                    processRequest(request);
                  }
                }}
                className="w-full resize-none"
              />
              <div className="mt-3 flex items-center justify-between gap-4">
                <p className="text-xs text-slate-500">Press ⌘ + Enter to send</p>
                <WuButton
                  disabled={!canSend}
                  loading={flowState === 'loading'}
                  Icon={<span className="wm-send" />}
                  iconPosition="right"
                  onClick={() => processRequest(request)}
                >
                  Send
                </WuButton>
              </div>
            </div>
          </WuCard>

          <div className="flex flex-col gap-6">
            <WuCard rounded className="border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <span className="wm-auto-awesome text-blue-600" />
                <h2 className="font-semibold text-slate-900">Suggested prompts</h2>
              </div>
              <div className="flex flex-col gap-2.5">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <WuButton
                    key={prompt}
                    variant="outline"
                    className="h-auto justify-start whitespace-normal px-3 py-2.5 text-left"
                    onClick={() => setRequest(prompt)}
                  >
                    <span className="wm-magic-button shrink-0 text-blue-600" />
                    <span>{prompt}</span>
                  </WuButton>
                ))}
              </div>
            </WuCard>

            <WuCard rounded className="border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                <div className="flex items-center gap-2">
                  <span className="wm-history text-slate-500" />
                  <h2 className="font-semibold text-slate-900">Recent workflows</h2>
                </div>
                <span className="text-xs text-slate-500">Latest 5</span>
              </div>
              <div className="divide-y divide-slate-100">
                {RECENT_WORKFLOWS.slice(0, 5).map((workflow) => (
                  <div key={workflow.id} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900" title={workflow.name}>
                          {workflow.name}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          {truncate(workflow.requestSummary, 82)}
                        </p>
                      </div>
                      <WorkflowStatusChip status={workflow.status} />
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-xs text-slate-500">
                        {workflow.membersAffected > 0
                          ? `${workflow.membersAffected.toLocaleString()} members · `
                          : ''}
                        {formatRelativeDate(workflow.updatedAt)}
                      </span>
                      <WuButton size="sm" variant="link" onClick={() => handleWorkflowOpen(workflow)}>
                        Open
                      </WuButton>
                    </div>
                  </div>
                ))}
              </div>
            </WuCard>
          </div>
        </div>
      </div>

      <WuModal open={isSaveOpen} onOpenChange={setIsSaveOpen} size="sm">
        <WuModalHeader>Save workflow</WuModalHeader>
        <WuModalContent>
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-6 text-slate-600">
              Save this workflow as a draft. Publishing remains unavailable until the plan has been reviewed and approved.
            </p>
            <WuSelect
              Label="Deployment frequency"
              variant="outlined"
              data={FREQUENCY_OPTIONS}
              accessorKey={{ value: 'value', label: 'label' }}
              value={frequency}
              onSelect={(value) => setFrequency(value as FrequencyOption)}
            />
          </div>
        </WuModalContent>
        <WuModalFooter>
          <WuModalClose variant="secondary">Cancel</WuModalClose>
          <WuButton variant="outline" disabled>Save and Publish</WuButton>
          <WuButton onClick={handleSaveDraft}>Save Draft</WuButton>
        </WuModalFooter>
      </WuModal>
    </div>
  );
}
