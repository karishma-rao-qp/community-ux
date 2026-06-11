'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import type { ChurnSegment } from '@/data/mock-panel-dashboard';

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
const WuButton = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuButton })),
  { ssr: false }
);
const WuInput = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuInput })),
  { ssr: false }
);
const WuTextarea = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuTextarea })),
  { ssr: false }
);

type SendModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  segment: ChurnSegment | null;
};

const DEFAULT_SUBJECTS: Record<string, string> = {
  'at-risk': 'We miss you — come back to the community!',
  abandoned: 'Complete your survey — we value your feedback',
};

const DEFAULT_MESSAGES: Record<string, string> = {
  'at-risk':
    'Hi there,\n\nWe noticed you haven\'t been active in our community lately. We\'d love to have you back! Check out our latest surveys and polls.',
  abandoned:
    'Hi there,\n\nYou started a survey but didn\'t finish. Your opinion matters — complete it now and earn reward points!',
};

export function SendModal({ open, onOpenChange, segment }: SendModalProps) {
  const { showToast } = useWuShowToast();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (open && segment) {
      setSubject(DEFAULT_SUBJECTS[segment.segmentType] ?? '');
      setMessage(DEFAULT_MESSAGES[segment.segmentType] ?? '');
    }
  }, [open, segment]);

  function handleOpenChange(isOpen: boolean) {
    onOpenChange(isOpen);
  }

  function handleSend() {
    showToast({
      message: `Message sent to ${segment?.displayCount ?? ''} ${segment?.label ?? 'members'}`,
      variant: 'success',
    });
    onOpenChange(false);
  }

  return (
    <WuModal open={open} onOpenChange={handleOpenChange} size="md">
      <WuModalHeader>
        Send to {segment?.label ?? 'Members'}
      </WuModalHeader>
      <WuModalContent>
        <div className="flex flex-col gap-4">
          <p className="text-sm text-gray-500">
            Targeting <strong>{segment?.displayCount}</strong> members in this segment.
          </p>
          <WuInput
            Label="Subject"
            variant="outlined"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <WuTextarea
            Label="Message"
            variant="outlined"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
          />
        </div>
      </WuModalContent>
      <WuModalFooter>
        <WuModalClose variant="secondary">Cancel</WuModalClose>
        <WuButton onClick={handleSend} disabled={!subject.trim() || !message.trim()}>
          Send Message
        </WuButton>
      </WuModalFooter>
    </WuModal>
  );
}
