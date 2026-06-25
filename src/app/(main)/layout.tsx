import React from 'react';
import { MobileShell } from '@/components/layout/MobileShell';
import { BottomTabBar } from '@/components/layout/BottomTabBar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MobileShell>
      <div className="flex-1 flex flex-col w-full min-h-full pb-3">
        {children}
      </div>
      <BottomTabBar />
    </MobileShell>
  );
}
