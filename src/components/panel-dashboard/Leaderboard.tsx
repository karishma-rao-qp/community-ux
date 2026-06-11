'use client';

import { Trophy } from 'lucide-react';
import { LEADERBOARD } from '@/data/mock-panel-dashboard';

function TrophyIcon({ rank }: { rank: number }) {
  if (rank > 3) return <span className="w-5 text-center text-sm text-gray-400">{rank}</span>;
  const colors = ['text-yellow-500', 'text-gray-400', 'text-amber-700'];
  return <Trophy className={`w-4 h-4 ${colors[rank - 1]}`} />;
}

export function Leaderboard() {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 h-full flex flex-col">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Points Leaderboard</h3>
      <div className="overflow-auto flex-1 max-h-[360px]">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 border-b border-[#E5E7EB]">
              <th className="pb-2 pr-2 w-8">Rank</th>
              <th className="pb-2 pr-2 w-8" />
              <th className="pb-2 pr-2">Member Name</th>
              <th className="pb-2 pr-2">Member ID</th>
              <th className="pb-2 text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            {LEADERBOARD.map((member) => (
              <tr key={member.id} className="border-b border-[#E5E7EB]/60 last:border-0">
                <td className="py-2.5 pr-2">
                  <TrophyIcon rank={member.rank} />
                </td>
                <td className="py-2.5 pr-2">
                  <div className="w-7 h-7 rounded-full bg-[#185FA5]/10 text-[#185FA5] text-xs font-medium flex items-center justify-center">
                    {member.avatar}
                  </div>
                </td>
                <td className="py-2.5 pr-2 font-medium text-gray-900">{member.name}</td>
                <td className="py-2.5 pr-2 text-gray-500">{member.id}</td>
                <td className="py-2.5 text-right font-semibold text-gray-900">
                  {member.points.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
