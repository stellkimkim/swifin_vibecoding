'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { useAppStore } from '@/stores/app-store';
import { useHaptic } from '@/hooks/useHaptic';
import { Receipt } from '@/types';
import { motion as motionWeb, useMotionValue as useMotionValueWeb, useTransform as useTransformWeb, useAnimation as useAnimationWeb, AnimatePresence } from 'framer-motion';

export default function SwipePage() {
  const router = useRouter();
  const { triggerHaptic } = useHaptic();
  const getPendingSwipes = useAppStore((state) => state.getPendingSwipes);
  const addSwipe = useAppStore((state) => state.addSwipe);
  const swipes = useAppStore((state) => state.swipes);
  const receipts = useAppStore((state) => state.receipts);

  const [pendingQueue, setPendingQueue] = useState<Receipt[]>([]);
  const [currentCard, setCurrentCard] = useState<Receipt | null>(null);
  
  // Tag selector bottom sheet state
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'worth' | 'regret' | null>(null);
  
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStoreName, setEditStoreName] = useState('');
  const [editAmount, setEditAmount] = useState(0);

  // Ratio calculator
  const worthCount = swipes.filter((s) => s.direction === 'worth').length;
  const totalCount = swipes.length;
  const worthPercentage = totalCount > 0 ? Math.round((worthCount / totalCount) * 100) : 78; // 78 is from mock default
  const regretPercentage = 100 - worthPercentage;

  useEffect(() => {
    const queue = getPendingSwipes();
    setPendingQueue(queue);
    setCurrentCard(queue[queue.length - 1] || null);
  }, [swipes, receipts]);

  // Framer Motion Drag values
  const x = useMotionValueWeb(0);
  const rotate = useTransformWeb(x, [-200, 200], [-30, 30]);
  const opacity = useTransformWeb(x, [-200, -150, 0, 150, 200], [0.5, 1, 1, 1, 0.5]);
  const worthOpacity = useTransformWeb(x, [0, 100], [0, 1]);
  const regretOpacity = useTransformWeb(x, [-100, 0], [1, 0]);

  const controls = useAnimationWeb();

  const handleSwipe = async (direction: 'worth' | 'regret') => {
    if (!currentCard) return;
    triggerHaptic('medium');
    setSwipeDirection(direction);

    // Animate card off screen
    await controls.start({
      x: direction === 'worth' ? 300 : -300,
      opacity: 0,
      transition: { duration: 0.2 }
    });

    // Show tag selection bottom sheet
    setShowTagSelector(true);
  };

  const handleSelectTag = (tag: string) => {
    if (!currentCard || !swipeDirection) return;
    triggerHaptic('success');
    
    // Save swipe evaluation in Zustand store
    addSwipe(currentCard.id, swipeDirection, tag);

    // Reset values for next card
    x.set(0);
    controls.set({ x: 0, opacity: 1 });
    setShowTagSelector(false);
    setSwipeDirection(null);
  };

  // Helper for mock past pattern matching the wireframe UI
  const getPastPattern = (storeName: string) => {
    const matchedSwipes = swipes.filter((s) => {
      const receipt = receipts.find((r) => r.id === s.receipt_id);
      return receipt?.store_name.includes(storeName) || storeName.includes(receipt?.store_name || 'NULL');
    });

    if (matchedSwipes.length === 0) {
      // Pick random realistic pattern
      const patterns = [
        '최근 3번 중 2번 후회했어요',
        '처음 소비하는 곳입니다',
        '자주 만족하며 지출하는 곳이에요',
        '이번 달에 벌써 4번째 소비입니다',
      ];
      return patterns[Math.floor(Math.random() * patterns.length)];
    }

    const regrets = matchedSwipes.filter((s) => s.direction === 'regret').length;
    return `최근 ${matchedSwipes.length}번 중 ${regrets}번 후회했어요`;
  };

  const formatWon = (value: number) => {
    return new Intl.NumberFormat('ko-KR').format(value) + '원';
  };

  const getCategoryTag = (cat: string) => {
    switch (cat) {
      case 'food': return '식비/배달 🍕';
      case 'cafe': return '카페/간식 ☕';
      case 'shopping': return '쇼핑/생활 🛍️';
      case 'transport': return '교통/택시 🚌';
      case 'culture': return '문화/취미 🎬';
      case 'subscription': return '구독/서비스 🍿';
      default: return '기타 소비 💸';
    }
  };

  const handleEditOpen = () => {
    if (!currentCard) return;
    setEditStoreName(currentCard.store_name);
    setEditAmount(currentCard.total_amount);
    setShowEditModal(true);
  };

  const handleEditSave = () => {
    if (!currentCard) return;
    useAppStore.getState().updateReceipt(currentCard.id, {
      store_name: editStoreName,
      total_amount: editAmount
    });
    setShowEditModal(false);
    triggerHaptic('success');
  };

  // Tags sets
  const worthTags = ['😊 행복했음', '💡 가치 있었음', '🔥 꼭 필요했음', '🎉 좋은 경험'];
  const regretTags = ['😵 충동구매', '💸 너무 비쌌음', '🤷 안 쓰게 됨', '😅 분위기에 휩쓸림'];

  return (
    <div className="fixed inset-0 bg-[#FAFAFA] flex flex-col justify-between font-sans z-50 overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="bg-white border-b border-neutral-100 flex items-center px-4 justify-between h-14">
        <button 
          onClick={() => { triggerHaptic('light'); router.push('/home'); }}
          className="p-1 -ml-1 text-neutral-600 hover:text-neutral-900 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>
        <span className="text-lg font-black text-[#8B5CF6]">SWIFIN!</span>
        <div className="w-6 h-6"></div> {/* balance spacer */}
      </div>

      {/* Regret / Worth ratio indicator matching the wireframe UI */}
      <div className="bg-[#8B5CF6]/5 py-2 px-6 flex justify-center items-center gap-2 select-none text-[11px] font-bold text-neutral-600 border-b border-purple-50/50">
        <span>😟 후회해요 {regretPercentage}%</span>
        <div className="flex-1 max-w-[100px] h-1.5 bg-neutral-200 rounded-full overflow-hidden flex">
          <div className="h-full bg-[#EF4444]" style={{ width: `${regretPercentage}%` }}></div>
          <div className="h-full bg-[#22C55E]" style={{ width: `${worthPercentage}%` }}></div>
        </div>
        <span>만족해요 {worthPercentage}% 😊</span>
      </div>

      {/* Main card stack area */}
      <div className="flex-1 flex items-center justify-center relative p-6">
        <AnimatePresence>
          {currentCard ? (
            <motionWeb.div
              style={{ x, rotate, opacity }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.8}
              onDragEnd={(e, info) => {
                if (info.offset.x > 120) {
                  handleSwipe('worth');
                } else if (info.offset.x < -120) {
                  handleSwipe('regret');
                } else {
                  // bounce back
                  controls.start({ x: 0, rotate: 0 });
                }
              }}
              animate={controls}
              className="absolute w-full max-w-[310px] aspect-[3/4.2] bg-[#FEF3C7] border border-amber-200/60 rounded-[32px] p-6 shadow-xl flex flex-col justify-between cursor-grab active:cursor-grabbing select-none"
            >
              {/* Green/Red Worth/Regret overlays on dragging */}
              <motionWeb.div 
                style={{ opacity: worthOpacity }}
                className="absolute inset-0 bg-[#22C55E]/10 border-4 border-[#22C55E] rounded-[32px] flex items-center justify-center pointer-events-none"
              >
                <span className="text-3xl font-black text-[#22C55E] tracking-widest rotate-12 uppercase">👍 WORTH IT</span>
              </motionWeb.div>

              <motionWeb.div 
                style={{ opacity: regretOpacity }}
                className="absolute inset-0 bg-[#EF4444]/10 border-4 border-[#EF4444] rounded-[32px] flex items-center justify-center pointer-events-none"
              >
                <span className="text-3xl font-black text-[#EF4444] tracking-widest -rotate-12 uppercase">👎 REGRET</span>
              </motionWeb.div>

              {/* Card Contents */}
              <div className="flex flex-col gap-1 select-none">
                <span className="text-xs text-amber-800/60 font-semibold">
                  {currentCard.receipt_time || '12:00'}
                </span>
                <h2 className="text-xl font-extrabold text-amber-950 mt-1 line-clamp-1">
                  {currentCard.store_name}
                </h2>
                <span className="text-[11px] font-bold text-amber-800/50 bg-amber-500/10 px-2 py-0.5 rounded-md w-max mt-1">
                  {getPastPattern(currentCard.store_name)}
                </span>
              </div>

              {/* Centered amount display */}
              <div className="text-center my-auto py-6 select-text flex flex-col items-center gap-1">
                <div className="flex items-center gap-2 text-2xl font-black text-amber-950">
                  <span className="text-amber-900/30 text-xl font-medium select-none">≪</span>
                  -{formatWon(currentCard.total_amount)}
                  <span className="text-amber-900/30 text-xl font-medium select-none">≫</span>
                </div>
                <span className="text-[10px] text-amber-800/40 select-none font-bold mt-1">이 소비를 다시 해도 괜찮을까요?</span>
              </div>

              {/* Card Footer tags and edit button */}
              <div className="flex justify-between items-center w-full mt-auto select-none border-t border-amber-950/5 pt-4">
                <span className="text-xs font-extrabold text-amber-900/80">
                  {getCategoryTag(currentCard.category)}
                </span>
                <button
                  onClick={handleEditOpen}
                  className="text-xs font-extrabold text-[#8B5CF6] flex items-center gap-1 hover:underline"
                >
                  수정하기 ✏️
                </button>
              </div>
            </motionWeb.div>
          ) : (
            <motionWeb.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8 flex flex-col items-center gap-4 select-none"
            >
              <span className="text-5xl">🎉</span>
              <h3 className="text-lg font-extrabold text-neutral-800">모든 소비 평가 완료!</h3>
              <p className="text-xs text-neutral-400 break-keep leading-relaxed px-4">
                새로운 영수증을 등록해 소비에 가치를 더해보세요.<br />
                홈 화면에서 현재까지 성찰한 점수를 확인할 수 있습니다.
              </p>
              <button
                onClick={() => { triggerHaptic('light'); router.push('/home'); }}
                className="mt-2 py-3 px-6 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-2xl text-xs font-bold shadow-md transition-colors"
              >
                홈으로 돌아가기
              </button>
            </motionWeb.div>
          )}
        </AnimatePresence>
      </div>

      {/* Swipe guides */}
      {currentCard && !showTagSelector && (
        <div className="flex flex-col items-center gap-4 py-6 border-t border-neutral-100 bg-white select-none">
          <div className="flex justify-center gap-10 items-center">
            {/* Left Button */}
            <button
              onClick={() => handleSwipe('regret')}
              className="w-14 h-14 rounded-full border border-neutral-200 shadow-md bg-white hover:bg-neutral-50 flex items-center justify-center text-xl text-[#EF4444] active:scale-95 transition-transform"
            >
              👎
            </button>
            
            <span className="text-[10px] text-neutral-400 font-extrabold text-center tracking-wider max-w-[120px] break-keep leading-relaxed">
              좌우로 스와이프하거나<br />버튼을 누르세요
            </span>

            {/* Right Button */}
            <button
              onClick={() => handleSwipe('worth')}
              className="w-14 h-14 rounded-full border border-neutral-200 shadow-md bg-white hover:bg-neutral-50 flex items-center justify-center text-xl text-[#22C55E] active:scale-95 transition-transform"
            >
              👍
            </button>
          </div>

          <button
            onClick={() => { triggerHaptic('light'); router.push('/snap'); }}
            className="w-[calc(100%-48px)] py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-2xl text-sm font-bold shadow-lg shadow-purple-500/10 transition-colors mt-2"
          >
            직접 추가하기
          </button>
        </div>
      )}

      {/* Tag Selector Bottom Sheet Overlay */}
      <AnimatePresence>
        {showTagSelector && (
          <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50">
            {/* Click outside to cancel */}
            <div 
              className="absolute inset-0 cursor-pointer"
              onClick={() => {
                triggerHaptic('light');
                setShowTagSelector(false);
                x.set(0);
                controls.set({ x: 0, opacity: 1 });
              }}
            />
            
            <motionWeb.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="w-full max-w-[412px] bg-white rounded-t-[32px] p-6 shadow-2xl relative z-10 select-none border-t border-neutral-100"
            >
              <div className="w-12 h-1 bg-neutral-200 rounded-full mx-auto mb-4 select-none"></div>

              <h3 className="text-center font-extrabold text-neutral-800 text-sm mb-5 break-keep leading-tight">
                {swipeDirection === 'worth' ? '이 소비가 좋았던 이유는 무엇인가요? 👍' : '이 소비가 아쉬웠던 이유는 무엇인가요? 👎'}
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {(swipeDirection === 'worth' ? worthTags : regretTags).map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSelectTag(tag)}
                    className={`py-3.5 px-4 text-xs font-bold rounded-2xl border text-center transition-all ${
                      swipeDirection === 'worth' 
                        ? 'border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/50 text-[#22C55E]' 
                        : 'border-rose-100 bg-rose-50/50 hover:bg-rose-100/50 text-[#EF4444]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  triggerHaptic('light');
                  setShowTagSelector(false);
                  x.set(0);
                  controls.set({ x: 0, opacity: 1 });
                }}
                className="w-full py-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-2xl text-xs font-bold transition-all text-center"
              >
                태그 없이 선택 완료
              </button>
            </motionWeb.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Modal Dialog */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <motionWeb.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-[28px] p-6 max-w-sm w-full shadow-2xl flex flex-col gap-4"
            >
              <h3 className="text-center font-extrabold text-neutral-800 text-sm select-none">소비카드 수정</h3>
              
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-extrabold text-neutral-400 select-none">상호명</label>
                <input
                  type="text"
                  value={editStoreName}
                  onChange={(e) => setEditStoreName(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#8B5CF6] text-neutral-800 font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-extrabold text-neutral-400 select-none">금액 (원)</label>
                <input
                  type="number"
                  value={editAmount || ''}
                  onChange={(e) => setEditAmount(parseInt(e.target.value) || 0)}
                  className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#8B5CF6] text-neutral-800 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2 select-none">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all"
                >
                  취소
                </button>
                <button
                  onClick={handleEditSave}
                  className="py-3 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl text-xs font-bold shadow-md transition-all"
                >
                  저장
                </button>
              </div>
            </motionWeb.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
