'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileShell } from '@/components/layout/MobileShell';
import { useAppStore } from '@/stores/app-store';
import { useHaptic } from '@/hooks/useHaptic';

export default function SettingsPage() {
  const router = useRouter();
  const { triggerHaptic } = useHaptic();
  const profile = useAppStore((state) => state.profile);
  const resetData = useAppStore((state) => state.resetData);

  const [displayName, setDisplayName] = useState(profile.display_name);
  const [email, setEmail] = useState(profile.email);

  const handleReset = () => {
    triggerHaptic('warning');
    if (confirm('모든 소비 기록과 성찰 데이터가 초기 mock 상태로 재설정됩니다. 진행하시겠습니까?')) {
      resetData();
      triggerHaptic('success');
      alert('데이터가 초기화되었습니다.');
      router.push('/home');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    triggerHaptic('success');
    useAppStore.setState((state) => ({
      profile: {
        ...state.profile,
        display_name: displayName,
        email: email
      }
    }));
    alert('설정이 저장되었습니다.');
    router.push('/home');
  };

  return (
    <MobileShell>
      <div className="flex-1 flex flex-col h-full bg-[#FAFAFA] pb-6 select-text">
        {/* Settings Header */}
        <header className="h-14 px-5 border-b border-neutral-100 flex items-center justify-between bg-white sticky top-0 z-40 select-none">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { triggerHaptic('light'); router.push('/home'); }}
              className="p-1 -ml-1 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <h1 className="text-base font-extrabold text-neutral-800">설정</h1>
          </div>
          <div></div>
        </header>

        {/* Settings Body */}
        <div className="flex-1 px-5 py-6 flex flex-col justify-between">
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            
            {/* Profile settings */}
            <div className="flex flex-col gap-4 bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm">
              <h3 className="text-xs font-black text-neutral-400 select-none uppercase tracking-wider">프로필 설정</h3>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-extrabold text-neutral-400 select-none">이름</label>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#8B5CF6] text-neutral-800 font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-extrabold text-neutral-400 select-none">이메일</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-[#8B5CF6] text-neutral-800 font-semibold"
                />
              </div>
            </div>

            {/* Development tools */}
            <div className="flex flex-col gap-4 bg-white rounded-3xl p-5 border border-neutral-100 shadow-sm">
              <h3 className="text-xs font-black text-[#EF4444] select-none uppercase tracking-wider">개발자 도구</h3>
              
              <div className="flex flex-col gap-1.5 select-none">
                <span className="text-[10px] text-neutral-400 leading-relaxed break-keep">
                  데모 버전을 초기 모드(온보딩 미완료, mock 영수증) 상태로 되돌립니다.
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3 w-full bg-rose-50 border border-rose-200 text-[#EF4444] rounded-2xl text-xs font-black hover:bg-rose-100 transition-colors mt-1"
                >
                  데이터 초기화 (Reset)
                </button>
              </div>
            </div>

            {/* Save CTA button */}
            <button
              type="submit"
              className="w-full py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-2xl text-sm font-bold shadow-lg shadow-purple-500/10 transition-colors select-none mt-2"
            >
              설정 저장하기
            </button>
          </form>

          {/* App Info Footer */}
          <div className="text-center text-[10px] text-neutral-400 select-none mt-8 leading-relaxed">
            <span>SWIFIN MVP Prototype</span><br />
            <span>Version 1.0.0 (develop)</span>
          </div>
        </div>
      </div>
    </MobileShell>
  );
}
