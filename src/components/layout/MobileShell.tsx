import React from 'react';

interface MobileShellProps {
  children: React.ReactNode;
}

export const MobileShell: React.FC<MobileShellProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-neutral-900 w-full flex items-center justify-center font-sans">
      {/* Phone container */}
      <div className="w-full max-w-[412px] h-screen sm:h-[844px] bg-[#FAFAFA] flex flex-col relative overflow-hidden sm:rounded-[40px] sm:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)] border-0 sm:border-8 sm:border-neutral-800">
        
        {/* Notch / Status Bar simulator for web preview */}
        <div className="hidden sm:flex h-6 bg-[#FAFAFA] justify-between items-center px-8 text-neutral-400 text-xs select-none">
          <span>19:30</span>
          <div className="w-32 h-4 bg-neutral-900 rounded-b-xl absolute top-0 left-1/2 -translate-x-1/2"></div>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L17.61 5.61C16.07 4.74 14.12 4 12 3zm5.66 3.39L5.39 18.66C6.93 19.53 8.88 20 11 20c4.97 0 9-4.03 9-9 0-2.12-.74-4.07-1.97-5.61z"/></svg>
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M17 5H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm-1 9H4v-2h12v2zm0-4H4V8h12v2z"/></svg>
          </div>
        </div>

        {/* Content Area */}
        <main className="flex-1 flex flex-col overflow-y-auto relative w-full pb-[80px]">
          {children}
        </main>

        {/* Home Indicator simulator for rounded screen */}
        <div className="hidden sm:block absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-300 rounded-full select-none pointer-events-none"></div>
      </div>
    </div>
  );
};
