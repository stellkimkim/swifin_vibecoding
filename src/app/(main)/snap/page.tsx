'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { useAppStore } from '@/stores/app-store';
import { useHaptic } from '@/hooks/useHaptic';
import { motion, AnimatePresence } from 'framer-motion';

type SnapMode = 'camera' | 'upload' | 'manual';

export default function SnapPage() {
  const router = useRouter();
  const { triggerHaptic } = useHaptic();
  const addReceipt = useAppStore((state) => state.addReceipt);
  const profile = useAppStore((state) => state.profile);

  const [mode, setMode] = useState<SnapMode>('camera');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showResultForm, setShowResultForm] = useState(false);

  // Form Fields
  const [storeName, setStoreName] = useState('');
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [receiptDate, setReceiptDate] = useState('');
  const [receiptTime, setReceiptTime] = useState('');
  const [category, setCategory] = useState<'food' | 'cafe' | 'shopping' | 'transport' | 'culture' | 'subscription' | 'etc'>('cafe');
  const [memo, setMemo] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCapture = () => {
    triggerHaptic('medium');
    setIsScanning(true);
    setCapturedImage('mock-receipt-image-url');

    setTimeout(() => {
      const mockOcrResults = [
        { storeName: '스타벅스 신촌점', totalAmount: 4800, category: 'cafe', memo: '모닝 에스프레소' },
        { storeName: '올리브영 홍대점', totalAmount: 24500, category: 'shopping', memo: '보습 크림 구매' },
        { storeName: '맥도날드 이대점', totalAmount: 8900, category: 'food', memo: '상하이 버거 세트' },
      ];
      const result = mockOcrResults[Math.floor(Math.random() * mockOcrResults.length)];

      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].substring(0, 5);

      addReceipt({
        store_name: result.storeName,
        total_amount: result.totalAmount,
        receipt_date: dateStr,
        receipt_time: timeStr,
        category: result.category as any,
        memo: result.memo,
      });

      setIsScanning(false);
      triggerHaptic('success');
      router.push('/report');
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleCapture();
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || totalAmount <= 0 || !receiptDate) {
      triggerHaptic('error');
      alert('상호명, 날짜, 금액을 정확히 입력해 주세요.');
      return;
    }

    triggerHaptic('success');
    const newReceipt = addReceipt({
      store_name: storeName,
      total_amount: totalAmount,
      receipt_date: receiptDate,
      receipt_time: receiptTime || '12:00',
      category,
      memo,
    });

    // Go to Swipe screen
    router.push('/swipe');
  };

  return (
    <div className="flex-1 flex flex-col min-h-full">
      <Header title="SNAP" />

      <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col justify-between select-text pb-24">
        
        {/* Toggle navigation top */}
        <div className="flex bg-neutral-100 p-1 rounded-2xl mb-4 select-none">
          <button 
            onClick={() => { triggerHaptic('light'); setMode('camera'); setShowResultForm(false); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${mode === 'camera' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'}`}
          >
            카메라
          </button>
          <button 
            onClick={() => { triggerHaptic('light'); setMode('upload'); setShowResultForm(false); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${mode === 'upload' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'}`}
          >
            사진 업로드
          </button>
          <button 
            onClick={() => { triggerHaptic('light'); setMode('manual'); setShowResultForm(true); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${mode === 'manual' ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500'}`}
          >
            직접 입력
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!showResultForm ? (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col items-center justify-center gap-6"
            >
              {/* Receipt card simulator */}
              <div className="w-full max-w-[340px] bg-white rounded-3xl border border-neutral-100 shadow-lg p-6 flex flex-col items-center justify-between min-h-[380px] relative overflow-hidden select-none">
                <div className="text-center w-full">
                  <h3 className="text-base font-extrabold text-neutral-800">{profile.display_name}님의 소비카드</h3>
                  <span className="text-xs text-neutral-400 mt-1 block">
                    {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                  </span>
                </div>

                {/* Viewfinder simulator */}
                <div className="w-full aspect-[3/4] bg-neutral-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-neutral-200 relative overflow-hidden my-4">
                  {isScanning ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-3 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs text-neutral-500 font-bold tracking-tight">영수증 OCR 분석 중...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3 text-neutral-400">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                      </svg>
                      <span className="text-xs font-semibold">
                        {mode === 'camera' ? '여기를 터치하여 촬영' : '기기에서 영수증 파일 선택'}
                      </span>
                    </div>
                  )}

                  {/* Red laser line scanner simulation */}
                  {isScanning && (
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute left-0 right-0 h-0.5 bg-[#8B5CF6] shadow-lg shadow-purple-500/50"
                    />
                  )}
                </div>

                {/* Bottom trigger button */}
                <div className="w-full flex justify-center">
                  {mode === 'camera' ? (
                    <button
                      onClick={handleCapture}
                      disabled={isScanning}
                      className="w-14 h-14 rounded-full border-4 border-neutral-100 bg-[#8B5CF6] text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform disabled:bg-neutral-300 select-none"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="8"/>
                      </svg>
                    </button>
                  ) : (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isScanning}
                      className="w-full py-3 bg-neutral-900 text-white rounded-2xl text-xs font-bold hover:bg-neutral-800 transition-colors select-none"
                    >
                      파일 탐색기 열기
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              <p className="text-center text-[10px] text-neutral-400 leading-relaxed px-8 break-keep select-none">
                날짜, 시간, 상호명, 금액이 자동으로 등록됩니다.<br />
                우측 상단 '직접 입력' 탭을 통해 직접 추가하실 수도 있습니다.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="result-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex-1 flex flex-col gap-5 w-full max-w-[340px] mx-auto bg-white rounded-3xl border border-neutral-100 shadow-md p-6"
            >
              <div className="text-center select-none">
                <h3 className="text-sm font-black text-neutral-800">영수증 상세 정보 확인</h3>
                <p className="text-[10px] text-neutral-400 mt-1">OCR 분석 정보를 수정하거나 직접 입력하세요.</p>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                {/* Store name */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-neutral-400 select-none">상호명</label>
                  <input
                    type="text"
                    required
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    placeholder="예: 스타벅스 신촌점"
                    className="px-3.5 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#8B5CF6] text-neutral-800"
                  />
                </div>

                {/* Amount */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-neutral-400 select-none">금액 (원)</label>
                  <input
                    type="number"
                    required
                    value={totalAmount || ''}
                    onChange={(e) => setTotalAmount(parseInt(e.target.value) || 0)}
                    placeholder="예: 4500"
                    className="px-3.5 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#8B5CF6] text-neutral-800"
                  />
                </div>

                {/* Date / Time Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-neutral-400 select-none">날짜</label>
                    <input
                      type="date"
                      required
                      value={receiptDate}
                      onChange={(e) => setReceiptDate(e.target.value)}
                      className="px-3.5 py-3 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#8B5CF6] text-neutral-800"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-extrabold text-neutral-400 select-none">시간</label>
                    <input
                      type="time"
                      value={receiptTime}
                      onChange={(e) => setReceiptTime(e.target.value)}
                      className="px-3.5 py-3 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-[#8B5CF6] text-neutral-800"
                    />
                  </div>
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-neutral-400 select-none">카테고리</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="px-3.5 py-3 rounded-xl border border-neutral-200 text-sm bg-white focus:outline-none focus:border-[#8B5CF6] text-neutral-800"
                  >
                    <option value="cafe">☕ 카페/간식</option>
                    <option value="food">🍕 식비/배달</option>
                    <option value="shopping">🛍️ 쇼핑/생활</option>
                    <option value="transport">🚌 교통/택시</option>
                    <option value="culture">🎬 문화/취미</option>
                    <option value="subscription">🍿 구독/서비스</option>
                    <option value="etc">💸 기타 지출</option>
                  </select>
                </div>

                {/* Memo */}
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-neutral-400 select-none">소비 메모 (선택)</label>
                  <input
                    type="text"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="예: 퇴근길 나를 위한 아메리카노"
                    className="px-3.5 py-3 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#8B5CF6] text-neutral-800"
                  />
                </div>

                {/* Save CTA button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-2xl text-sm font-bold shadow-lg shadow-purple-500/10 transition-colors select-none mt-2"
                >
                  저장하고 평가하기
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
