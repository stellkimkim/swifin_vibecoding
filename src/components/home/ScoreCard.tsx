'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ScoreCardProps {
  score: number;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({ score }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-3xl p-6 border border-neutral-100/80 shadow-sm relative overflow-hidden flex items-center justify-between"
    >
      {/* Decorative gradient blur */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#8B5CF6]/5 rounded-full blur-2xl"></div>

      <div className="flex flex-col gap-1 z-10">
        <span className="text-xs font-bold text-neutral-400 tracking-wider">REFLECTIVE SCORE</span>
        <h3 className="text-lg font-bold text-neutral-800 leading-tight">이번 달 소비 점수</h3>
        <p className="text-xs text-neutral-400 mt-1 select-none">"얼마나"가 아니라 "어떻게" 썼는가</p>
      </div>

      <div className="relative flex items-center justify-center z-10">
        {/* Simple Progress Ring background */}
        <svg className="w-20 h-20 -rotate-90">
          <circle
            cx="40"
            cy="40"
            r="34"
            className="stroke-neutral-100"
            strokeWidth="6"
            fill="transparent"
          />
          <motion.circle
            cx="40"
            cy="40"
            r="34"
            className="stroke-[#8B5CF6]"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={213.6}
            initial={{ strokeDashoffset: 213.6 }}
            animate={{ strokeDashoffset: 213.6 - (213.6 * score) / 100 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-xl font-black text-[#111111]">{score}</span>
          <span className="text-[9px] font-bold text-neutral-400 -mt-1">SCORE</span>
        </div>
      </div>
    </motion.div>
  );
};
