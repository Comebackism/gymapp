'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Activity, Dumbbell, TrendingUp, Calculator, ShieldCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';

export default function LandingPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col selection:bg-blue-100">
      {/* Navigation */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                GymApp
              </span>
            </div>
            <div className="flex items-center gap-4 mr-24 md:mr-0">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                {t('nav.login')}
              </Link>
              <Link href="/signup">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 shadow-sm hover:shadow-md transition-all">
                  {t('nav.getStarted')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
          
          {/* Hero Content */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium mb-6 border border-blue-100">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {t('landing.newFeatures')}
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
            {t('landing.title1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              {t('landing.title2')}
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-500 mb-10">
            {t('landing.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <Button size="lg" className="h-14 px-8 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all w-full sm:w-auto flex items-center gap-2 font-medium">
                {t('landing.startFree')}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all w-full sm:w-auto font-medium">
                {t('landing.signIn')}
              </Button>
            </Link>
          </div>
          
          {/* Dashboard Application Mockup */}
          <div className="mt-16 sm:mt-24 w-full max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-gray-100 bg-white transform hover:scale-[1.01] transition-transform duration-500">
            <img 
              src="https://images.unsplash.com/photo-1594882645126-14020914d58d?q=80&w=1200&auto=format&fit=crop" 
              alt="Gym Tracking Performance" 
              className="w-full h-auto max-h-[600px] object-cover object-top"
            />
          </div>
          
        </div>
      </section>

      {/* Preview Showcase */}
      <section className="py-16 bg-white overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -ml-[50vw] w-[100vw] h-full bg-gradient-to-b from-gray-50/50 to-white pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 relative">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('landing.features.title')}</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">{t('landing.features.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
              <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-100 transition-all">
                <Dumbbell className="w-7 h-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.feature1.title')}</h3>
              <p className="text-gray-500 leading-relaxed">
                {t('landing.feature1.desc')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all duration-300 group">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-100 transition-all">
                <TrendingUp className="w-7 h-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.feature2.title')}</h3>
              <p className="text-gray-500 leading-relaxed">
                {t('landing.feature2.desc')}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 group">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-100 transition-all">
                <Calculator className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('landing.feature3.title')}</h3>
              <p className="text-gray-500 leading-relaxed">
                {t('landing.feature3.desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white mt-auto">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-blue-200 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('landing.cta.title')}</h2>
          <p className="text-blue-100 text-xl mb-10 max-w-2xl mx-auto">
            {t('landing.cta.desc')}
          </p>
          <Link href="/signup">
            <Button size="lg" className="h-14 px-10 text-lg bg-white text-blue-600 hover:bg-gray-50 rounded-full shadow-lg hover:shadow-xl transition-all font-medium">
              {t('landing.cta.btn')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
