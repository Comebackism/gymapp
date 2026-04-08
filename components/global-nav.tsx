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
      <div className="fixed top-6 right-6 z-50 print:hidden">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm px-3 py-2 rounded-full text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all uppercase"
          title="Toggle Language"
        >
          <Globe className="w-4 h-4 text-blue-600" />
          {language === 'en' ? 'TH' : 'EN'}
        </button>
      </div>

      {children}
    </>
  );
}
