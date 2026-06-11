'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import DatePicker from 'react-datepicker';
import { Copy, Download } from 'lucide-react';
import { subDays } from 'date-fns';
import { useWuShowToast } from '@npm-questionpro/wick-ui-lib';
import { KPI_METRICS, PORTAL_URL, type ChurnSegment } from '@/data/mock-panel-dashboard';
import { KPICard } from '@/components/panel-dashboard/KPICard';
import { EngagementTrends } from '@/components/panel-dashboard/EngagementTrends';
import { ActivityBreakdown } from '@/components/panel-dashboard/ActivityBreakdown';
import { ChurnSection } from '@/components/panel-dashboard/ChurnSection';
import { ActivityTrendsChart } from '@/components/panel-dashboard/ActivityTrendsChart';
import { MemberHeatmap } from '@/components/panel-dashboard/MemberHeatmap';
import { Leaderboard } from '@/components/panel-dashboard/Leaderboard';
import { TopEngagedMembers } from '@/components/panel-dashboard/TopEngagedMembers';
import { SessionsChart } from '@/components/panel-dashboard/SessionsChart';
import { CommunityHealthRow } from '@/components/panel-dashboard/CommunityHealthRow';
import { ActionPanel } from '@/components/panel-dashboard/ActionPanel';
import { SendModal } from '@/components/panel-dashboard/SendModal';

import 'react-datepicker/dist/react-datepicker.css';

const WuButton = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuButton })),
  { ssr: false }
);
const WuMenu = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuMenu })),
  { ssr: false }
);
const WuMenuItem = dynamic(
  () => import('@npm-questionpro/wick-ui-lib').then((m) => ({ default: m.WuMenuItem })),
  { ssr: false }
);

export default function PanelDashboardPage() {
  const { showToast } = useWuShowToast();
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    subDays(new Date(), 30),
    new Date(),
  ]);
  const [startDate, endDate] = dateRange;
  const [sendSegment, setSendSegment] = useState<ChurnSegment | null>(null);
  const [sendModalOpen, setSendModalOpen] = useState(false);

  function handleSendCampaign(segment: ChurnSegment) {
    setSendSegment(segment);
    setSendModalOpen(true);
  }

  function handleCopyPortal() {
    navigator.clipboard.writeText(PORTAL_URL);
    showToast({ message: 'Portal link copied to clipboard', variant: 'success' });
  }

  function handleExport(format: 'csv' | 'pdf') {
    showToast({
      message: `Exporting dashboard as ${format.toUpperCase()}…`,
      variant: 'success',
    });
  }

  return (
    <div className="p-6 pb-24 bg-[#F8F9FA] min-h-full">
      {/* Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Panel Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Real-time community health, engagement, and churn monitoring
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5">
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(update) => setDateRange(update)}
              dateFormat="MMM d, yyyy"
              className="text-sm text-gray-700 outline-none w-[220px]"
            />
          </div>

          <div className="flex items-center gap-1 bg-white border border-[#E5E7EB] rounded-lg px-3 py-1.5">
            <input
              type="text"
              readOnly
              value={PORTAL_URL}
              className="text-sm text-gray-600 outline-none w-48 lg:w-64 bg-transparent truncate"
            />
            <button
              type="button"
              onClick={handleCopyPortal}
              className="p-1 rounded hover:bg-gray-100 text-gray-500"
              aria-label="Copy portal link"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          <WuMenu
            Trigger={
              <WuButton variant="secondary">
                <Download className="w-4 h-4 mr-1" /> Export
              </WuButton>
            }
            align="end"
          >
            <WuMenuItem onSelect={() => handleExport('csv')}>Export as CSV</WuMenuItem>
            <WuMenuItem onSelect={() => handleExport('pdf')}>Export as PDF</WuMenuItem>
          </WuMenu>
        </div>
      </div>

      {/* Row 1 — KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {KPI_METRICS.map((metric) => (
          <KPICard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Row 2 — Engagement Trends + Activity Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <div className="lg:col-span-3">
          <EngagementTrends />
        </div>
        <div className="lg:col-span-2">
          <ActivityBreakdown />
        </div>
      </div>

      {/* Row 3 — Engagement & Churn */}
      <div className="mb-6">
        <ChurnSection onSendCampaign={handleSendCampaign} />
      </div>

      {/* Row 4 — Activity Trends + Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <ActivityTrendsChart />
        <MemberHeatmap />
      </div>

      {/* Row 5 — Leaderboard + Top Engaged */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <div className="lg:col-span-2">
          <Leaderboard />
        </div>
        <div className="lg:col-span-3">
          <TopEngagedMembers />
        </div>
      </div>

      {/* Row 6 — Sessions Chart */}
      <div className="mb-6">
        <SessionsChart />
      </div>

      {/* Row 7 — Community Health */}
      <CommunityHealthRow />

      {/* Action Panel + Send Modal */}
      <ActionPanel onSendCampaign={handleSendCampaign} />
      <SendModal
        open={sendModalOpen}
        onOpenChange={setSendModalOpen}
        segment={sendSegment}
      />
    </div>
  );
}
