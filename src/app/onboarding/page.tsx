'use client';

import React from 'react';
import { MobileShell } from '@/components/layout/MobileShell';
import { OnboardingSlider } from '@/components/onboarding/OnboardingSlider';

export default function OnboardingPage() {
  return (
    <MobileShell>
      <div className="flex-1 flex flex-col h-full bg-[#FAFAFA] pb-0">
        <OnboardingSlider />
      </div>
    </MobileShell>
  );
}
