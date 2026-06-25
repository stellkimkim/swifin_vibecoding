'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PersonaCardProps {
  persona: string;
}

export const PersonaCard: React.FC<PersonaCardProps> = ({ persona }) => {
  const getEmoji = (name: string) => {
    switch (name) {
      case '행복 수집가': return '🎭';
      case '충동 사냥꾼': return '🏹';
      case '효율 추구형': return '⚡';
      case '취미 투자형': return '🎨';
      default: return '👤';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.25 }}
      className="bg-white rounded-3xl p-5 border border-neutral-100/80 shadow-sm relative overflow-hidden flex items-center justify-between"
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-bold text-neutral-400">이번 달 소비 페르소나</span>
        <h4 className="text-base font-extrabold text-neutral-800">{persona}</h4>
      </div>
      <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center text-2xl shadow-md">
        {getEmoji(persona)}
      </div>
    </motion.div>
  );
};
