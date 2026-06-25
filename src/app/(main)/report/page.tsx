'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { ReportDocument } from '@/components/report/ReportDocument';
import { useAppStore } from '@/stores/app-store';
import { useHaptic } from '@/hooks/useHaptic';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReportPage() {
  const report = useAppStore((state) => state.report);
  const receipts = useAppStore((state) => state.receipts);
  const { triggerHaptic } = useHaptic();
  
  const [showToast, setShowToast] = useState(false);

  const handleShare = () => {
    triggerHaptic('success');
    
    if (navigator.share) {
      navigator.share({
        title: 'SWIFIN 소비 리플렉션 리포트',
        text: `이번 달 내 소비 스코어는 ${report.score}점! 나의 소비 페르소나는 [${report.persona}]입니다.`,
        url: window.location.origin
      }).catch((err) => console.log(err));
    } else {
      // Fallback: Copy link
      navigator.clipboard.writeText(
        `[SWIFIN 소비 리플렉션 리포트]\n이번 달 소비점수: ${report.score}점\n소비 페르소나: ${report.persona}\n\n"덜 쓰는 것이 아니라, 잘 쓰는 것" 소비 성찰 시작하기!`
      );
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  // Check if we have at least some data
  const hasData = receipts.length > 0;

  return (
    <div className="flex-1 flex flex-col min-h-full">
      <Header title="REPORT" />

      {/* Main content scroll wrapper */}
      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col justify-between pb-28">
        
        {hasData ? (
          <div className="flex flex-col gap-6">
            <div className="px-1 select-none">
              <h2 className="text-lg font-extrabold text-neutral-800">{report.year_month} 월간 분석 리포트</h2>
              <p className="text-xs text-neutral-400 mt-1">소비 습관의 만족과 후회를 토대로 한 리플렉션 보고서입니다.</p>
            </div>

            {/* Document layout */}
            <ReportDocument report={report} />

            {/* Share CTA button */}
            <button
              onClick={handleShare}
              className="w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-2xl text-sm font-bold shadow-lg shadow-purple-500/10 transition-colors select-none"
            >
              공유하기
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 select-none my-auto">
            <span className="text-5xl mb-4">📊</span>
            <h3 className="text-base font-extrabold text-neutral-800">충분한 데이터가 없습니다</h3>
            <p className="text-xs text-neutral-400 mt-2 leading-relaxed break-keep px-4">
              영수증을 등록하고 최소 1개 이상의 소비에 대해 만족/후회 스와이프를 완료해 주시면 AI 월간 리포트가 생성됩니다!
            </p>
          </div>
        )}

      </div>

      {/* Toast Notification for sharing fallback */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-xs font-semibold px-5 py-3.5 rounded-full shadow-lg z-50 select-none tracking-tight"
          >
            📋 리포트 요약본이 클립보드에 복사되었습니다!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
