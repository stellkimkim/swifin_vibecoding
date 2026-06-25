'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Receipt, Swipe } from '@/types';
import Link from 'next/link';

interface HistoryTimelineProps {
  receipts: Receipt[];
  swipes: Swipe[];
}

export const HistoryTimeline: React.FC<HistoryTimelineProps> = ({ receipts, swipes }) => {
  const getSwipeStatus = (receiptId: string) => {
    const swipe = swipes.find((s) => s.receipt_id === receiptId);
    return swipe ? { evaluated: true, direction: swipe.direction, tag: swipe.tag } : { evaluated: false };
  };

  const formatWon = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value) + '원';
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'food': return '🍕';
      case 'cafe': return '☕';
      case 'shopping': return '🛍️';
      case 'transport': return '🚌';
      case 'culture': return '🎬';
      case 'subscription': return '🍿';
      default: return '💸';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center px-1 select-none">
        <h3 className="text-base font-extrabold text-neutral-800">최근 소비 히스토리</h3>
        <span className="text-[11px] font-bold text-neutral-400">최근 10건</span>
      </div>

      <div className="flex flex-col gap-3">
        {receipts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-neutral-100/80 text-center flex flex-col items-center gap-2 select-none">
            <span className="text-3xl">📝</span>
            <p className="text-sm font-semibold text-neutral-400">아직 등록된 소비 카드가 없어요.</p>
            <p className="text-xs text-neutral-300">스냅 탭에서 영수증을 등록해 보세요!</p>
          </div>
        ) : (
          receipts.map((receipt, index) => {
            const status = getSwipeStatus(receipt.id);

            return (
              <motion.div
                key={receipt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-white rounded-3xl p-4 border border-neutral-100/80 shadow-sm flex items-center justify-between gap-3 relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-neutral-50 flex items-center justify-center text-xl select-none">
                    {getCategoryEmoji(receipt.category)}
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <span className="text-sm font-extrabold text-neutral-800 line-clamp-1">{receipt.store_name}</span>
                    <span className="text-[10px] text-neutral-400 mt-0.5">
                      {receipt.receipt_date} {receipt.receipt_time}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end justify-center">
                  <span className="text-sm font-bold text-neutral-900">-{formatWon(receipt.total_amount)}</span>
                  {status.evaluated ? (
                    <span className={`text-[10px] font-black mt-1.5 px-2 py-0.5 rounded-full select-none ${
                      status.direction === 'worth' 
                        ? 'bg-emerald-50 text-[#22C55E]' 
                        : 'bg-rose-50 text-[#EF4444]'
                    }`}>
                      {status.tag || (status.direction === 'worth' ? '👍 WORTH' : '👎 REGRET')}
                    </span>
                  ) : (
                    <Link
                      href="/swipe"
                      className="text-[10px] font-black mt-1.5 px-2 py-0.5 rounded-full bg-amber-50 text-amber-500 border border-amber-200/50 hover:bg-amber-100 transition-colors select-none"
                    >
                      ⏳ 평가 대기
                    </Link>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
