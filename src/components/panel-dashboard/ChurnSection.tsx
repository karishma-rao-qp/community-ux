'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import dynamic from 'next/dynamic';
import { CHURN_SEGMENTS, type ChurnSegment } from '@/data/mock-panel-dashboard';

const WuButton = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuButton })),
  { ssr: false }
);

type ChurnSectionProps = {
  onSendCampaign: (segment: ChurnSegment) => void;
};

function SegmentDonut({ segment }: { segment: ChurnSegment }) {
  const maxVal = segment.segmentType === 'active' ? 200 : segment.segmentType === 'at-risk' ? 8000 : 3000;
  const data = [
    { value: segment.count },
    { value: maxVal - segment.count },
  ];

  return (
    <div className="w-20 h-20 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={24}
            outerRadius={36}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill={segment.color} />
            <Cell fill="#E5E7EB" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChurnSection({ onSendCampaign }: ChurnSectionProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Engagement & Churn</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CHURN_SEGMENTS.map((segment) => (
          <div key={segment.id} className="text-center">
            <SegmentDonut segment={segment} />
            <p className="text-2xl font-semibold text-gray-900 mt-2">{segment.displayCount}</p>
            <p className="text-sm text-gray-500 mb-3">{segment.label}</p>
            {segment.ctaLabel && (
              <WuButton
                variant="secondary"
                size="sm"
                onClick={() => onSendCampaign(segment)}
                className="text-[#185FA5]"
              >
                {segment.ctaLabel}
              </WuButton>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
