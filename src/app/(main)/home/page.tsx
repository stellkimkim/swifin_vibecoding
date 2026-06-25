'use client';

import React from 'react';
import { Header } from '@/components/layout/Header';
import { ScoreCard } from '@/components/home/ScoreCard';
import { SummaryCards } from '@/components/home/SummaryCards';
import { AiInsightCard } from '@/components/home/AiInsightCard';
import { PersonaCard } from '@/components/home/PersonaCard';
import { PendingSwipeCard } from '@/components/home/PendingSwipeCard';
import { HistoryTimeline } from '@/components/home/HistoryTimeline';
import { useAppStore } from '@/stores/app-store';

export default function HomePage() {
  const report = useAppStore((state) => state.report);
  const receipts = useAppStore((state) => state.receipts);
  const swipes = useAppStore((state) => state.swipes);
  const getPendingSwipes = useAppStore((state) => state.getPendingSwipes);

  const pendingCount = getPendingSwipes().length;

  return (
    <div className="flex-1 flex flex-col min-h-full">
      <Header title="SWIFIN" />
      
      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-5 pb-8 select-text">
        {/* Pending swipes reminder alert */}
        <PendingSwipeCard count={pendingCount} />

        {/* Score circular gauge */}
        <ScoreCard score={report.score} />

        {/* Worth vs Regret 2-column summaries */}
        <SummaryCards 
          worthAmount={report.total_worth} 
          regretAmount={report.total_regret} 
        />

        {/* AI Insight banner */}
        {report.ai_insights && report.ai_insights.length > 0 && (
          <AiInsightCard insight={report.ai_insights[0]} />
        )}

        {/* Persona analysis card */}
        <PersonaCard persona={report.persona} />

        {/* Spending timeline history */}
        <HistoryTimeline 
          receipts={receipts.slice(0, 10)} 
          swipes={swipes} 
        />
      </div>
    </div>
  );
}
