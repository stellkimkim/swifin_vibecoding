'use client';

import React from 'react';
import { MonthlyReport } from '@/types';
import { useHaptic } from '@/hooks/useHaptic';

interface ReportDocumentProps {
  report: MonthlyReport;
}

export const ReportDocument: React.FC<ReportDocumentProps> = ({ report }) => {
  const { triggerHaptic } = useHaptic();

  const formatWon = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value) + '원';
  };

  const getCategoryName = (cat: string) => {
    switch (cat) {
      case 'food': return '식비/배달';
      case 'cafe': return '카페/간식';
      case 'shopping': return '쇼핑/생활';
      case 'transport': return '교통/택시';
      case 'culture': return '문화/취미';
      case 'subscription': return '구독/서비스';
      default: return '기타 소비';
    }
  };

  const getCategoryEmoji = (cat: string) => {
    switch (cat) {
      case 'food': return '🍕';
      case 'cafe': return '☕';
      case 'shopping': return '🛍️';
      case 'transport': return '🚌';
      case 'culture': return '🎬';
      case 'subscription': return '🍿';
      default: return '💸';
    }
  };

  // Convert categories object to array sorted by total amount
  const categoryList = Object.entries(report.category_stats).map(([key, value]) => ({
    key,
    ...value
  })).sort((a, b) => b.total_amount - a.total_amount);

  const totalSpent = report.total_worth + report.total_regret;
  const worthRatio = totalSpent > 0 ? Math.round((report.total_worth / totalSpent) * 100) : 0;
  const regretRatio = totalSpent > 0 ? 100 - worthRatio : 0;

  return (
    <div className="bg-white border border-neutral-200/80 rounded-[32px] p-6 shadow-md relative overflow-hidden font-mono text-neutral-800 text-xs flex flex-col gap-6 select-text">
      
      {/* Receipts dotted edge line simulator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-neutral-200 via-transparent to-neutral-200 bg-[size:10px_4px] select-none"></div>

      {/* Report Header */}
      <div className="text-center border-b border-dashed border-neutral-200 pb-5 select-none">
        <h2 className="text-sm font-black tracking-widest text-[#8B5CF6]">SWIFIN REFLECTION</h2>
        <span className="text-[10px] text-neutral-400 mt-1 block">STATEMENT OF SPENDING REACTION</span>
        <span className="text-[10px] text-neutral-400">MONTH: {report.year_month}</span>
      </div>

      {/* Reflection Score Section */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between font-bold text-neutral-400 select-none">
          <span>소비 만족 스코어</span>
          <span>SCORE</span>
        </div>
        <div className="flex justify-between items-baseline py-1">
          <span className="text-sm font-extrabold text-neutral-700">이번 달 스코어</span>
          <span className="text-3xl font-black text-[#8B5CF6]">{report.score}점</span>
        </div>
        <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden flex select-none">
          <div className="h-full bg-[#8B5CF6]" style={{ width: `${report.score}%` }}></div>
        </div>
        <span className="text-[10px] text-neutral-400 mt-1 select-none">
          * 지출의 만족도(Worth It) 비율을 나타내는 반성 수치입니다.
        </span>
      </div>

      {/* Worth vs Regret Ratio Section */}
      <div className="border-t border-dashed border-neutral-200 pt-5 flex flex-col gap-3">
        <div className="flex justify-between font-bold text-neutral-400 select-none">
          <span>소비 비율 요약</span>
          <span>REACTION RATIO</span>
        </div>
        
        <div className="flex flex-col gap-2.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-base select-none">👍</span>
              <span className="font-bold text-neutral-700">만족 소비 (Worth It)</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-[#22C55E] text-sm block">{formatWon(report.total_worth)}</span>
              <span className="text-[10px] text-neutral-400">{worthRatio}%</span>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-base select-none">👎</span>
              <span className="font-bold text-neutral-700">후회 소비 (Regret)</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-[#EF4444] text-sm block">{formatWon(report.total_regret)}</span>
              <span className="text-[10px] text-neutral-400">{regretRatio}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Stats Section */}
      <div className="border-t border-dashed border-neutral-200 pt-5 flex flex-col gap-3">
        <div className="flex justify-between font-bold text-neutral-400 select-none">
          <span>카테고리별 분석</span>
          <span>BY CATEGORIES</span>
        </div>

        <div className="flex flex-col gap-3">
          {categoryList.map((cat) => {
            const satisfaction = cat.total > 0 ? Math.round((cat.worth_count / cat.total) * 100) : 0;
            return (
              <div key={cat.key} className="flex flex-col gap-1">
                <div className="flex justify-between items-center font-bold text-neutral-700">
                  <div className="flex items-center gap-1.5">
                    <span className="select-none">{getCategoryEmoji(cat.key)}</span>
                    <span>{getCategoryName(cat.key)}</span>
                  </div>
                  <span>{formatWon(cat.total_amount)}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-neutral-400">
                  <span>총 {cat.total}회 지출</span>
                  <span className={satisfaction > 70 ? 'text-[#22C55E]' : satisfaction < 40 ? 'text-[#EF4444]' : 'text-neutral-500'}>
                    만족도 {satisfaction}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Persona Analysis */}
      <div className="border-t border-dashed border-neutral-200 pt-5 flex flex-col gap-2">
        <div className="flex justify-between font-bold text-neutral-400 select-none">
          <span>소비 페르소나 분석</span>
          <span>SPENDING PERSONA</span>
        </div>
        <div className="bg-neutral-50 rounded-2xl p-4 mt-1 border border-neutral-100 flex flex-col gap-1">
          <div className="flex items-center gap-2 font-black text-neutral-800 text-sm">
            <span className="text-xl select-none">🎭</span>
            <span>{report.persona}</span>
          </div>
          <p className="text-[11px] text-neutral-500 leading-relaxed mt-1 font-sans">
            {report.persona_description}
          </p>
        </div>
      </div>

      {/* AI Insights & Coach message */}
      <div className="border-t border-dashed border-neutral-200 pt-5 flex flex-col gap-3.5">
        <div className="flex justify-between font-bold text-neutral-400 select-none">
          <span>AI 소비 인사이트</span>
          <span>AI INSIGHTS</span>
        </div>
        
        <div className="flex flex-col gap-2.5 font-sans text-[11px] leading-relaxed text-neutral-600">
          {report.ai_insights.map((insight, idx) => (
            <div key={idx} className="flex gap-2 items-start">
              <span className="text-[#8B5CF6] select-none">•</span>
              <p className="break-keep">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="border-t border-dashed border-neutral-200 pt-5 flex flex-col gap-3.5">
        <div className="flex justify-between font-bold text-neutral-400 select-none">
          <span>AI 개선 제안</span>
          <span>AI ACTION PLAN</span>
        </div>
        
        <div className="flex flex-col gap-2.5 font-sans text-[11px] leading-relaxed text-neutral-600">
          {report.ai_suggestions.map((suggest, idx) => (
            <div key={idx} className="flex gap-2 items-start bg-neutral-50 p-2.5 rounded-xl border border-neutral-100">
              <span className="text-[#8B5CF6] font-bold select-none">{idx + 1}.</span>
              <p className="break-keep text-neutral-700 font-medium">{suggest}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Coach Summary Card */}
      <div className="border-t-2 border-double border-neutral-300 pt-5 text-center flex flex-col gap-2 select-none">
        <span className="text-[#8B5CF6] text-xl">🏋️</span>
        <h4 className="font-extrabold text-neutral-800 tracking-wider">AI COACH MESSAGE</h4>
        <p className="font-sans text-xs text-neutral-500 leading-relaxed font-semibold px-4 break-keep mt-1 text-[#8B5CF6]">
          "{report.ai_coach_message}"
        </p>
      </div>

      {/* Barcode simulator */}
      <div className="flex flex-col items-center gap-1.5 border-t border-dashed border-neutral-200 pt-5 select-none">
        <div className="w-48 h-8 bg-neutral-800 flex items-center justify-center text-white tracking-widest text-[8px] font-black leading-none bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,#111_2px,#111_4px)]"></div>
        <span className="text-[9px] text-neutral-400">SWIFIN-202606-REFLECT</span>
      </div>

    </div>
  );
};
