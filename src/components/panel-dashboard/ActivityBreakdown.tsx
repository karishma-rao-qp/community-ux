'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { ACTIVITY_BREAKDOWN, ENGAGEMENT_DRIVERS } from '@/data/mock-panel-dashboard';

export function ActivityBreakdown() {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Activity Breakdown</h3>

      <div className="h-[200px] w-full min-w-0">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={ACTIVITY_BREAKDOWN}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              dataKey="value"
              strokeWidth={0}
            >
              {ACTIVITY_BREAKDOWN.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={8}
              formatter={(value) => (
                <span className="text-xs text-gray-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-[#E5E7EB]">
        <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wide">
          Engagement Drivers
        </p>
        <ul className="space-y-1.5">
          {ENGAGEMENT_DRIVERS.map((driver) => (
            <li key={driver.rank} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">
                {driver.rank}. {driver.name}
              </span>
              <span className="text-gray-400 text-xs">{driver.count.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
