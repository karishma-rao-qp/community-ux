'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { formatDate } from '@/data/mock-utils';
import {
  TOP_ENGAGED_MEMBERS,
  MEMBER_PROFILES,
  type MemberProfile,
} from '@/data/mock-panel-dashboard';

type FilterBy = 'overall' | 'surveys' | 'polls';
type LimitOption = 10 | 25 | 50;

type TopEngagedMembersProps = {
  onMemberClick?: (memberId: string) => void;
};

export function TopEngagedMembers({ onMemberClick }: TopEngagedMembersProps) {
  const [filterBy, setFilterBy] = useState<FilterBy>('overall');
  const [limit, setLimit] = useState<LimitOption>(10);
  const [selectedMember, setSelectedMember] = useState<MemberProfile | null>(null);

  const members = TOP_ENGAGED_MEMBERS.slice(0, limit).map((m) => ({
    ...m,
    count:
      filterBy === 'surveys'
        ? Math.round(m.count * 0.65)
        : filterBy === 'polls'
          ? Math.round(m.count * 0.35)
          : m.count,
  }));

  function handleMemberClick(id: string) {
    const profile =
      MEMBER_PROFILES[id] ??
      ({
        id,
        name: TOP_ENGAGED_MEMBERS.find((m) => m.id === id)?.name ?? id,
        email: `${id.toLowerCase()}@email.com`,
        joinDate: '2024-06-01',
        status: 'active' as const,
        points: 2000,
        surveysCompleted: 30,
        pollsCompleted: 20,
      } satisfies MemberProfile);
    setSelectedMember(profile);
    onMemberClick?.(id);
  }

  return (
    <>
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 h-full flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
          <h3 className="text-sm font-semibold text-gray-900">Top Engaged Members</h3>
          <div className="flex gap-2">
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as FilterBy)}
              className="text-sm border border-[#E5E7EB] rounded-lg px-2 py-1.5 text-gray-700 bg-white"
            >
              <option value="surveys">Surveys</option>
              <option value="polls">Polls</option>
              <option value="overall">Overall</option>
            </select>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value) as LimitOption)}
              className="text-sm border border-[#E5E7EB] rounded-lg px-2 py-1.5 text-gray-700 bg-white"
            >
              <option value={10}>10 members</option>
              <option value={25}>25 members</option>
              <option value={50}>50 members</option>
            </select>
          </div>
        </div>

        <div className="overflow-auto flex-1">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-[#E5E7EB]">
                <th className="pb-2 pr-4 w-24">Member ID</th>
                <th className="pb-2 pr-4">Interaction</th>
                <th className="pb-2 text-right w-16">Count</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-[#E5E7EB]/60 last:border-0">
                  <td className="py-2.5 pr-4">
                    <button
                      type="button"
                      onClick={() => handleMemberClick(member.id)}
                      className="text-[#185FA5] hover:underline font-medium"
                    >
                      {member.id}
                    </button>
                  </td>
                  <td className="py-2.5 pr-4">
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#185FA5] rounded-full"
                        style={{ width: `${(member.count / member.maxCount) * 100}%` }}
                      />
                    </div>
                  </td>
                  <td className="py-2.5 text-right font-medium text-gray-900">{member.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedMember && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setSelectedMember(null)}
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-[#E5E7EB]">
                <h2 className="text-lg font-semibold text-gray-900">Member Profile</h2>
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 flex flex-col gap-4 overflow-auto">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-[#185FA5]/10 text-[#185FA5] text-lg font-semibold flex items-center justify-center">
                    {selectedMember.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{selectedMember.name}</p>
                    <p className="text-sm text-gray-500">{selectedMember.id}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#F8F9FA] rounded-lg p-3">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm font-medium text-gray-900">{selectedMember.email}</p>
                  </div>
                  <div className="bg-[#F8F9FA] rounded-lg p-3">
                    <p className="text-xs text-gray-500">Joined</p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatDate(selectedMember.joinDate)}
                    </p>
                  </div>
                  <div className="bg-[#F8F9FA] rounded-lg p-3">
                    <p className="text-xs text-gray-500">Points</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedMember.points.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-[#F8F9FA] rounded-lg p-3">
                    <p className="text-xs text-gray-500">Status</p>
                    <p className="text-sm font-medium capitalize text-gray-900">
                      {selectedMember.status}
                    </p>
                  </div>
                  <div className="bg-[#F8F9FA] rounded-lg p-3">
                    <p className="text-xs text-gray-500">Surveys Completed</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedMember.surveysCompleted}
                    </p>
                  </div>
                  <div className="bg-[#F8F9FA] rounded-lg p-3">
                    <p className="text-xs text-gray-500">Polls Completed</p>
                    <p className="text-sm font-medium text-gray-900">
                      {selectedMember.pollsCompleted}
                    </p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
