'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { WEEKLY_TRENDS } from '@/data/mock-panel-dashboard';

type FilterOption = 'overall' | 'surveys' | 'polls';

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'overall', label: 'Overall' },
  { value: 'surveys', label: 'Surveys' },
  { value: 'polls', label: 'Polls' },
];

export function ActivityTrendsChart() {
  const [filter, setFilter] = useState<FilterOption>('overall');

  const dataKey = filter;

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Activity Trends</h3>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterOption)}
          className="text-sm border border-[#E5E7EB] rounded-lg px-2 py-1.5 text-gray-700 bg-white"
        >
          {FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="h-[220px] w-full min-w-0">
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={WEEKLY_TRENDS} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="week"
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              label={{
                value: 'Total interactions',
                angle: -90,
                position: 'insideLeft',
                style: { fontSize: 11, fill: '#9CA3AF' },
              }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #E5E7EB',
                fontSize: 13,
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#185FA5"
              strokeWidth={2}
              dot={{ r: 4, fill: '#185FA5' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
