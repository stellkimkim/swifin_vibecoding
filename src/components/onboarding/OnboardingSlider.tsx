'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';
import { useHaptic } from '@/hooks/useHaptic';

interface Slide {
  title: string;
  subtitle: string;
  illustration: React.ReactNode;
}

export const OnboardingSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();
  const completeOnboarding = useAppStore((state) => state.completeOnboarding);
  const { triggerHaptic } = useHaptic();

  const slides: Slide[] = [
    {
      title: '당신은 돈을 얼마나 잘 쓰고 있나요?',
      subtitle: '덜 쓰는 것이 아니라 잘 쓰는 것, SWIFIN이 돕습니다.',
      illustration: (
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border-4 border-dashed border-[#8B5CF6]/30 rounded-full"
          />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-36 h-36 bg-gradient-to-tr from-[#8B5CF6] to-[#A78BFA] rounded-3xl flex flex-col items-center justify-center text-white shadow-xl shadow-purple-500/20"
          >
            <span className="text-4xl">🤔</span>
            <span className="text-xl font-bold mt-2">소비 점수는?</span>
          </motion.div>
        </div>
      ),
    },
    {
      title: '후회 소비와 만족 소비를 구분해 보세요',
      subtitle: '카드를 쓱 스와이프하여 소비를 성찰하세요. Worth It 👍 또는 Regret 👎',
      illustration: (
        <div className="relative w-56 h-48 mx-auto flex items-center justify-center gap-4">
          <motion.div
            initial={{ x: -50, rotate: -15, opacity: 0 }}
            animate={{ x: 0, rotate: -10, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className="w-24 h-36 bg-[#FEF3C7] border border-amber-200 rounded-2xl p-3 shadow-md flex flex-col justify-between text-left"
          >
            <span className="text-xs text-neutral-400">후회 소비</span>
            <span className="text-lg font-bold text-[#EF4444]">👎 REGRET</span>
          </motion.div>
          
          <motion.div
            initial={{ x: 50, rotate: 15, opacity: 0 }}
            animate={{ x: 0, rotate: 10, opacity: 1 }}
            transition={{ type: 'spring', delay: 0.3 }}
            className="w-24 h-36 bg-[#FEF3C7] border border-amber-200 rounded-2xl p-3 shadow-md flex flex-col justify-between text-left"
          >
            <span className="text-xs text-neutral-400">만족 소비</span>
            <span className="text-lg font-bold text-[#22C55E]">👍 WORTH</span>
          </motion.div>
        </div>
      ),
    },
    {
      title: '기록이 아니라 소비를 이해하는 것입니다',
      subtitle: 'SWIFIN과 함께 당신만의 소비 페르소나와 AI 인사이트를 만나보세요.',
      illustration: (
        <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-40 h-40 bg-neutral-900 rounded-full flex flex-col items-center justify-center text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#8B5CF6]/10 animate-pulse"></div>
            <span className="text-4xl z-10">🎭</span>
            <span className="text-sm font-bold mt-2 z-10 text-[#8B5CF6]">행복 수집가</span>
            <span className="text-[10px] text-neutral-400 z-10 mt-0.5">나만의 페르소나</span>
          </motion.div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    triggerHaptic('light');
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding();
      router.push('/home');
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      triggerHaptic('light');
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-12 bg-[#FAFAFA] h-full text-center">
      {/* Top logo */}
      <div className="flex justify-between items-center h-10">
        <span className="text-xl font-black text-[#8B5CF6] tracking-tight">SWIFIN</span>
        {currentSlide < slides.length - 1 && (
          <button 
            onClick={() => {
              triggerHaptic('medium');
              completeOnboarding();
              router.push('/home');
            }}
            className="text-sm text-neutral-400 hover:text-neutral-600 font-semibold"
          >
            건너뛰기
          </button>
        )}
      </div>

      {/* Main Content */}
      <div className="my-auto py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="flex flex-col gap-8"
          >
            {/* Illustration */}
            <div className="h-48 flex items-center justify-center">
              {slides[currentSlide].illustration}
            </div>

            {/* Typography */}
            <div className="flex flex-col gap-3">
              <h2 className="text-2xl font-extrabold text-[#111111] leading-tight px-4 break-keep">
                {slides[currentSlide].title}
              </h2>
              <p className="text-sm text-neutral-500 px-6 break-keep leading-relaxed">
                {slides[currentSlide].subtitle}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom controls */}
      <div className="flex flex-col gap-8">
        {/* Indicators */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => {
                triggerHaptic('light');
                setCurrentSlide(index);
              }}
              className={`h-2 rounded-full cursor-pointer transition-all duration-300 ${
                index === currentSlide ? 'w-6 bg-[#8B5CF6]' : 'w-2 bg-neutral-200'
              }`}
            />
          ))}
        </div>

        {/* Action Button */}
        <div className="flex gap-3">
          {currentSlide > 0 && (
            <button
              onClick={handleBack}
              className="flex-1 py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-2xl font-bold text-sm transition-all"
            >
              이전
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-[2] py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-500/10 transition-all"
          >
            {currentSlide === slides.length - 1 ? '시작하기' : '다음'}
          </button>
        </div>
      </div>
    </div>
  );
};
