'use client';

import { ArrowDown, ArrowUp, Users, LogIn, UserCheck, ClipboardList, BarChart2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import type { KpiMetric } from '@/data/mock-panel-dashboard';

const ICONS = {
  users: Users,
  sessions: LogIn,
  profile: UserCheck,
  survey: ClipboardList,
  poll: BarChart2,
};

const COLORS = {
  primary: '#185FA5',
  teal: '#1D9E75',
};

function MiniDonut({ value, max = 200, color = COLORS.primary }: { value: number; max?: number; color?: string }) {
  const data = [
    { value },
    { value: max - value },
  ];
  return (
    <div className="w-10 h-10">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={12}
            outerRadius={18}
            startAngle={90}
            endAngle={-270}
            dataKey="value"
            strokeWidth={0}
          >
            <Cell fill={color} />
            <Cell fill="#E5E7EB" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

function MiniGauge({ value }: { value: number }) {
  return (
    <div className="w-10 h-10 relative">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        <circle cx="18" cy="18" r="14" fill="none" stroke="#E5E7EB" strokeWidth="4" />
        <circle
          cx="18"
          cy="18"
          r="14"
          fill="none"
          stroke={COLORS.teal}
          strokeWidth="4"
          strokeDasharray={`${(value / 100) * 88} 88`}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export function KPICard({ metric }: { metric: KpiMetric }) {
  const Icon = ICONS[metric.icon];
  const isUp = metric.mom.direction === 'up';
  const momColor = isUp ? 'text-[#1D9E75]' : 'text-[#E24B4A]';

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {metric.variant === 'donut' && metric.numericValue ? (
            <MiniDonut value={metric.numericValue} color={COLORS.primary} />
          ) : metric.variant === 'gauge' && metric.numericValue ? (
            <MiniGauge value={metric.numericValue} />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[#185FA5]/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-[#185FA5]" />
            </div>
          )}
        </div>
        <div className={`flex flex-col items-end gap-0.5 text-xs font-medium ${momColor}`}>
          <span className="flex items-center gap-0.5">
            {isUp ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
            {metric.mom.value}%
          </span>
          <span className="text-[10px] text-gray-400 font-normal">MOM</span>
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
        <p className="text-sm text-gray-500 mt-0.5">{metric.label}</p>
      </div>
    </div>
  );
}
