'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Globe } from 'lucide-react';
import { useLanguage } from './language-provider';

export function GlobalNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  
  return (
    <>
      <div className="fixed bottom-6 right-6 md:bottom-auto md:top-6 md:right-6 z-50 print:hidden">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
          className="flex items-center gap-1.5 md:gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-md md:shadow-sm px-2.5 py-1.5 md:px-3 md:py-2 rounded-full text-[10px] md:text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all uppercase"
          title="Toggle Language"
        >
          <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
          {language === 'en' ? 'TH' : 'EN'}
        </button>
      </div>

      {children}
    </>
  );
}
