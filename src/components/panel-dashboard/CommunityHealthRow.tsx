'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import {
  COMMUNITY_HEALTH_METRICS,
  MEMBER_ACTIVITY_DATA,
  type CommunityHealthMetric,
} from '@/data/mock-panel-dashboard';

function HealthMetricCard({ metric }: { metric: CommunityHealthMetric }) {
  const isUp = metric.mom.direction === 'up';
  const momColor = isUp ? 'text-[#1D9E75]' : 'text-[#E24B4A]';

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
      <div className="flex items-start justify-between mb-2">
        {metric.variant === 'donut' && metric.numericValue ? (
          <div className="w-14 h-14">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[{ value: metric.numericValue }, { value: 1000 - metric.numericValue }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={18}
                  outerRadius={26}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  strokeWidth={0}
                >
                  <Cell fill="#185FA5" />
                  <Cell fill="#E5E7EB" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : metric.variant === 'gauge' && metric.numericValue ? (
          <div className="w-14 h-14 relative">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#E5E7EB" strokeWidth="4" />
              <circle
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke="#1D9E75"
                strokeWidth="4"
                strokeDasharray={`${(metric.numericValue / 100) * 88} 88`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        ) : null}
        <div className={`flex items-center gap-0.5 text-xs font-medium ${momColor}`}>
          {isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {metric.mom.value}%
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{metric.label}</p>
    </div>
  );
}

export function CommunityHealthRow() {
  const activityData = MEMBER_ACTIVITY_DATA.map((d) => ({
    ...d,
    label: format(parseISO(d.date), 'MMM d'),
  }));

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-900">Community Health Metrics</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {COMMUNITY_HEALTH_METRICS.map((metric) => (
          <HealthMetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Member Activity Chart</h4>
        <div className="h-[240px] w-full min-w-0">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={activityData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 12, fill: '#6B7280' }}
                axisLine={false}
                tickLine={false}
                label={{
                  value: 'Panel members',
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
                dataKey="surveys"
                name="Surveys"
                stroke="#1F2937"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="polls"
                name="Polls"
                stroke="#93C5FD"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex gap-4 mt-2 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-gray-800 inline-block" /> Surveys
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-300 inline-block" /> Polls
          </span>
        </div>
      </div>
    </div>
  );
}
