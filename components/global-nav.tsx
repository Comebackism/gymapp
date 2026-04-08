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
      <div className="fixed bottom-6 right-6 z-50 print:hidden">
        <button 
          onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-gray-200 shadow-lg px-3 py-2 rounded-full text-xs font-bold text-gray-800 hover:bg-white hover:scale-105 transition-all uppercase ring-1 ring-black/5"
          title="Toggle Language"
        >
          <div className="w-5 h-5 bg-blue-50 rounded-full flex items-center justify-center">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
          </div>
          {language === 'en' ? 'Thai' : 'English'}
        </button>
      </div>

      {children}
    </>
  );
}
