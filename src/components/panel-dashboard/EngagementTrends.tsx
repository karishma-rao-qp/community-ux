'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  ENGAGEMENT_TRENDS,
  type EngagementTab,
} from '@/data/mock-panel-dashboard';

const TABS: { id: EngagementTab; label: string }[] = [
  { id: 'surveys', label: 'Surveys' },
  { id: 'polls', label: 'Polls' },
  { id: 'topics', label: 'Topics' },
  { id: 'ideaboards', label: 'Ideaboards' },
];

export function EngagementTrends() {
  const [activeTab, setActiveTab] = useState<EngagementTab>('surveys');
  const data = ENGAGEMENT_TRENDS[activeTab];
  const donutData = [
    { value: data.responseRate },
    { value: 100 - data.responseRate },
  ];

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 h-full">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Engagement Trends</h3>

      <div className="flex gap-1 mb-4 border-b border-[#E5E7EB]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? 'border-[#185FA5] text-[#185FA5]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-3xl font-semibold text-gray-900">
            {data.totalResponses.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            Total {activeTab === 'polls' ? 'polls taken' : 'responses'}
          </p>
        </div>
        <div>
          <p className="text-3xl font-semibold text-gray-900">
            {data.totalInvites.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">Total invites sent</p>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-6">
        <div className="w-24 h-24">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={40}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
              >
                <Cell fill="#1D9E75" />
                <Cell fill="#E5E7EB" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div>
          <p className="text-2xl font-semibold text-gray-900">{data.responseRate}%</p>
          <p className="text-sm text-gray-500">Response rate</p>
        </div>
      </div>

      {(activeTab === 'topics' || activeTab === 'ideaboards') && data.comments !== undefined && (
        <div className="grid grid-cols-3 gap-3 mt-6 pt-4 border-t border-[#E5E7EB]">
          <div>
            <p className="text-lg font-semibold text-gray-900">{data.comments?.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Comments</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{data.likes?.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Likes</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900">{data.dislikes?.toLocaleString()}</p>
            <p className="text-xs text-gray-500">Dislikes</p>
          </div>
        </div>
      )}
    </div>
  );
}
