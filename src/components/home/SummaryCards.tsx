'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface SummaryCardsProps {
  worthAmount: number;
  regretAmount: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ worthAmount, regretAmount }) => {
  const formatWon = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value) + '원';
  };

  return (
    <div className="grid grid-cols-2 gap-3.5">
      {/* Worth card */}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-3xl p-5 border border-neutral-100/80 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden"
      >
        <div className="flex justify-between items-start">
          <span className="text-xs font-bold text-neutral-400">만족 소비</span>
          <span className="text-lg">👍</span>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-black text-[#22C55E] truncate">{formatWon(worthAmount)}</span>
          <span className="text-[10px] text-neutral-400 mt-0.5">다시 해도 좋은 지출</span>
        </div>
      </motion.div>

      {/* Regret card */}
      <motion.div
        initial={{ opacity: 0, x: 15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-white rounded-3xl p-5 border border-neutral-100/80 shadow-sm flex flex-col justify-between h-28 relative overflow-hidden"
      >
        <div className="flex justify-between items-start">
          <span className="text-xs font-bold text-neutral-400">후회 소비</span>
          <span className="text-lg">👎</span>
        </div>
        <div className="flex flex-col">
          <span className="text-base font-black text-[#EF4444] truncate">{formatWon(regretAmount)}</span>
          <span className="text-[10px] text-neutral-400 mt-0.5">아쉬움이 남는 지출</span>
        </div>
      </motion.div>
    </div>
  );
};
