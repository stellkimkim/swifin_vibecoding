'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AiInsightCardProps {
  insight: string;
}

export const AiInsightCard: React.FC<AiInsightCardProps> = ({ insight }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-3xl p-5 border border-neutral-100/80 shadow-sm relative overflow-hidden"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-bold text-[#8B5CF6] bg-purple-50 px-2.5 py-0.5 rounded-full">AI Insight</span>
      </div>
      <p className="text-sm font-semibold text-neutral-800 leading-relaxed break-keep">
        "{insight}"
      </p>
    </motion.div>
  );
};
