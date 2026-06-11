'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { ACTION_ITEMS, CHURN_SEGMENTS, type ChurnSegment } from '@/data/mock-panel-dashboard';

const WuButton = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuButton })),
  { ssr: false }
);

type ActionPanelProps = {
  onSendCampaign: (segment: ChurnSegment) => void;
};

export function ActionPanel({ onSendCampaign }: ActionPanelProps) {
  const { showToast } = useWuShowToast();
  const [isOpen, setIsOpen] = useState(true);
  const [showHeatmapTip, setShowHeatmapTip] = useState(false);

  function handleAction(item: (typeof ACTION_ITEMS)[number]) {
    if (item.segmentType) {
      const segment = CHURN_SEGMENTS.find((s) => s.segmentType === item.segmentType);
      if (segment) onSendCampaign(segment);
      return;
    }
    if (item.action === 'heatmap') {
      setShowHeatmapTip(true);
      return;
    }
    if (item.action === 'incentive') {
      showToast({ message: 'Opening incentive module…', variant: 'success' });
    }
  }

  return (
    <>
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-30 flex items-center">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ x: 280 }}
              animate={{ x: 0 }}
              exit={{ x: 280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-72 bg-white border border-[#E5E7EB] rounded-l-xl shadow-lg p-4 mr-0"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-4 h-4 text-[#EF9F27]" />
                <h3 className="text-sm font-semibold text-gray-900">Actions</h3>
              </div>
              <div className="flex flex-col gap-2">
                {ACTION_ITEMS.map((item) => (
                  <WuButton
                    key={item.id}
                    variant="secondary"
                    size="sm"
                    className="justify-start text-left w-full"
                    onClick={() => handleAction(item)}
                  >
                    {item.label}
                  </WuButton>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="bg-[#185FA5] text-white p-2 rounded-l-md shadow-md hover:bg-[#185FA5]/90"
          aria-label={isOpen ? 'Collapse actions panel' : 'Expand actions panel'}
        >
          {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {showHeatmapTip && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowHeatmapTip(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white rounded-xl border border-[#E5E7EB] p-6 max-w-md shadow-xl"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Boost Low-Activity Days</h3>
              <p className="text-sm text-gray-600 mb-4">
                Activity peaks Tuesday–Thursday, 10 AM–4 PM. Consider scheduling campaigns for
                Monday mornings and weekend afternoons when engagement is lowest.
              </p>
              <div className="bg-[#F8F9FA] rounded-lg p-3 mb-4 text-sm text-gray-700">
                <strong>Suggested send times:</strong>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Monday 9:00 AM</li>
                  <li>Saturday 2:00 PM</li>
                  <li>Sunday 11:00 AM</li>
                </ul>
              </div>
              <WuButton onClick={() => setShowHeatmapTip(false)}>Got it</WuButton>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
