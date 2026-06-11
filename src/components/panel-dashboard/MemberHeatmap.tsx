'use client';

import { useState } from 'react';
import {
  HEATMAP_DATA,
  HEATMAP_DAYS,
  HEATMAP_HOURS,
} from '@/data/mock-panel-dashboard';

type FilterOption = 'overall' | 'surveys' | 'polls';

const FILTER_OPTIONS: { value: FilterOption; label: string }[] = [
  { value: 'surveys', label: 'Surveys' },
  { value: 'polls', label: 'Polls' },
  { value: 'overall', label: 'Overall' },
];

function getIntensity(value: number, max: number): string {
  const ratio = value / max;
  if (ratio < 0.25) return 'bg-[#185FA5]/10';
  if (ratio < 0.5) return 'bg-[#185FA5]/30';
  if (ratio < 0.75) return 'bg-[#185FA5]/55';
  return 'bg-[#185FA5]/90';
}

export function MemberHeatmap() {
  const [filter, setFilter] = useState<FilterOption>('overall');
  const maxValue = Math.max(...HEATMAP_DATA.map((c) => c.value));

  function getCellValue(day: number, hour: number): number {
    const cell = HEATMAP_DATA.find((c) => c.day === day && c.hour === hour);
    if (!cell) return 0;
    if (filter === 'surveys') return Math.round(cell.value * 0.6);
    if (filter === 'polls') return Math.round(cell.value * 0.4);
    return cell.value;
  }

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Member Activity Heatmap</h3>
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

      <div className="overflow-x-auto">
        <div className="min-w-[320px]">
          <div className="grid grid-cols-8 gap-0.5 mb-1">
            <div className="w-8" />
            {HEATMAP_DAYS.map((day) => (
              <div key={day} className="text-center text-xs text-gray-500 font-medium">
                {day}
              </div>
            ))}
          </div>
          {HEATMAP_HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-8 gap-0.5 mb-0.5">
              <div className="text-xs text-gray-400 w-8 flex items-center justify-end pr-1">
                {hour}
              </div>
              {HEATMAP_DAYS.map((_, dayIndex) => {
                const value = getCellValue(dayIndex, hour);
                return (
                  <div
                    key={`${dayIndex}-${hour}`}
                    className={`h-4 rounded-sm ${getIntensity(value, maxValue)}`}
                    title={`${HEATMAP_DAYS[dayIndex]} ${hour}:00 — ${value} interactions`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 text-xs text-gray-500">
        <span>Low activity</span>
        <div className="flex gap-0.5">
          <div className="w-4 h-3 rounded-sm bg-[#185FA5]/10" />
          <div className="w-4 h-3 rounded-sm bg-[#185FA5]/30" />
          <div className="w-4 h-3 rounded-sm bg-[#185FA5]/55" />
          <div className="w-4 h-3 rounded-sm bg-[#185FA5]/90" />
        </div>
        <span>High activity</span>
      </div>
    </div>
  );
}
