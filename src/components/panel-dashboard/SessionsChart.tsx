'use client';

import { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { SESSIONS_DATA } from '@/data/mock-panel-dashboard';

export function SessionsChart() {
  const [rangeStart, setRangeStart] = useState(0);
  const [rangeEnd, setRangeEnd] = useState(100);

  const chartData = useMemo(() => {
    const startIdx = Math.floor((rangeStart / 100) * SESSIONS_DATA.length);
    const endIdx = Math.ceil((rangeEnd / 100) * SESSIONS_DATA.length);
    return SESSIONS_DATA.slice(startIdx, endIdx).map((d) => ({
      ...d,
      label: format(parseISO(d.date), 'MMM d'),
    }));
  }, [rangeStart, rangeEnd]);

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Sessions</h3>

      <div className="h-[240px] w-full min-w-0">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6B7280' }}
              axisLine={false}
              tickLine={false}
              label={{
                value: 'Login count',
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
              formatter={(value) => [value, 'Sessions']}
            />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#185FA5"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 px-2">
        <label className="text-xs text-gray-500 mb-1 block">Zoom date range</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={100}
            value={rangeStart}
            onChange={(e) => {
              const val = Number(e.target.value);
              setRangeStart(Math.min(val, rangeEnd - 5));
            }}
            className="flex-1 accent-[#185FA5]"
          />
          <input
            type="range"
            min={0}
            max={100}
            value={rangeEnd}
            onChange={(e) => {
              const val = Number(e.target.value);
              setRangeEnd(Math.max(val, rangeStart + 5));
            }}
            className="flex-1 accent-[#185FA5]"
          />
        </div>
      </div>
    </div>
  );
}
