'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/stores/app-store';

export default function RootPage() {
  const router = useRouter();
  const profile = useAppStore((state) => state.profile);

  useEffect(() => {
    if (profile.onboarding_completed) {
      router.push('/home');
    } else {
      router.push('/onboarding');
    }
  }, [profile.onboarding_completed, router]);

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-semibold tracking-wide text-neutral-400">Loading SWIFIN...</span>
      </div>
    </div>
  );
}
