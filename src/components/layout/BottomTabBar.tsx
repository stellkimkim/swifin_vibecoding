'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const BottomTabBar: React.FC = () => {
  const pathname = usePathname();

  const tabs = [
    {
      label: '홈',
      href: '/home',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 transition-transform ${active ? 'scale-110' : ''}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
        </svg>
      )
    },
    {
      label: '스냅',
      href: '/snap',
      icon: (active: boolean) => (
        <div className={`p-2.5 rounded-full transition-transform ${active ? 'bg-[#8B5CF6] text-white scale-110 shadow-lg shadow-purple-500/20' : 'bg-neutral-100 text-neutral-600'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
          </svg>
        </div>
      )
    },
    {
      label: '리포트',
      href: '/report',
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 transition-transform ${active ? 'scale-110' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
        </svg>
      )
    }
  ];

  return (
    <nav className="absolute bottom-0 left-0 right-0 h-[72px] bg-white/80 backdrop-blur-lg border-t border-neutral-100 flex items-center justify-around px-6 pb-2 z-40 select-none">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const isSnap = tab.href === '/snap';

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center justify-center flex-1 py-1 text-xs font-semibold transition-colors duration-200 ${
              isSnap 
                ? 'h-full -translate-y-2' 
                : isActive 
                  ? 'text-[#8B5CF6]' 
                  : 'text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {tab.icon(isActive)}
            {!isSnap && <span className="mt-1">{tab.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
};
