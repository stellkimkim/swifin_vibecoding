'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface PendingSwipeCardProps {
  count: number;
}

export const PendingSwipeCard: React.FC<PendingSwipeCardProps> = ({ count }) => {
  if (count === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 100, 
        damping: 15,
        delay: 0.3
      }}
      className="relative overflow-hidden rounded-3xl p-5 bg-[#8B5CF6] text-white shadow-xl shadow-purple-500/20"
    >
      {/* Pulse background effect */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-8 -translate-y-8 blur-lg animate-pulse"></div>

      <div className="flex flex-col gap-1.5 relative z-10">
        <div className="flex justify-between items-center">
          <span className="text-[10px] font-black tracking-widest bg-white/20 px-2 py-0.5 rounded-full uppercase">Reflect pending</span>
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-400"></span>
          </span>
        </div>
        <h4 className="text-base font-extrabold mt-1">미평가 소비가 {count}건 있습니다</h4>
        <p className="text-xs text-purple-100 leading-relaxed break-keep">
          "이 소비를 다시 해도 괜찮을까요?"<br />
          소비를 돌아보고 만족과 후회를 선택해 보세요.
        </p>
        <Link 
          href="/swipe" 
          className="mt-3 py-2.5 px-4 bg-white hover:bg-neutral-50 text-[#8B5CF6] rounded-2xl text-center text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-md"
        >
          지금 평가하러 가기
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </Link>
      </div>
    </motion.div>
  );
};
