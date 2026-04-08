'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calculator, ArrowLeft, Info, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/components/language-provider';

export default function CalculatorPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [weight, setWeight] = useState<number | ''>('');
  const [reps, setReps] = useState<number | ''>('');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');

  // Calculate 1RM using Epley Formula: Weight * (1 + Reps/30)
  // For 1 rep, it's just the weight.
  const calculate1RM = (): number => {
    if (!weight || !reps || reps <= 0 || weight <= 0) return 0;
    if (reps === 1) return Number(weight);
    return Number(weight) * (1 + Number(reps) / 30);
  };

  const oneRepMax = calculate1RM();

  const percentages = [
    100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50,
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/dashboard')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">{t('calc.title')}</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-2">{t('calc.subtitle')}</h2>
          <p className="text-indigo-100 max-w-xl">
            {t('calc.desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Input Section */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-50 pointer-events-none"></div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-indigo-500" />
                {t('calc.perfData')}
              </h3>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <Label className="text-sm font-medium text-gray-700">{t('calc.weightLifted')}</Label>
                    <div className="flex bg-gray-100 p-0.5 rounded-md">
                      <button 
                        onClick={() => setUnit('kg')}
                        className={`px-2.5 py-1 text-xs font-medium rounded ${unit === 'kg' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                      >
                        kg
                      </button>
                      <button 
                        onClick={() => setUnit('lbs')}
                        className={`px-2.5 py-1 text-xs font-medium rounded ${unit === 'lbs' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'}`}
                      >
                        lbs
                      </button>
                    </div>
                  </div>
                  <Input
                    type="number"
                    placeholder="e.g. 100"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    min="1"
                    className="text-lg h-12"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-1.5 block">{t('calc.repsTitle')}</Label>
                  <Input
                    type="number"
                    placeholder="e.g. 5"
                    value={reps}
                    onChange={(e) => setReps(e.target.value === '' ? '' : Number(e.target.value))}
                    min="1"
                    max="30"
                    className="text-lg h-12"
                  />
                  <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
                    <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                    {t('calc.repsInfo')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('calc.estMax')}</h3>
              
              {oneRepMax > 0 ? (
                <>
                  <div className="bg-indigo-50 rounded-xl p-6 text-center mb-6 border border-indigo-100">
                    <div className="text-indigo-600 text-sm font-semibold mb-1 uppercase tracking-wider">{t('calc.est1RM')}</div>
                    <div className="text-5xl font-extrabold text-indigo-900 flex items-baseline justify-center gap-2">

                      {Math.round(oneRepMax)}
                      <span className="text-xl font-medium text-indigo-500">{unit}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {percentages.map(percent => {
                      const calculatedWeight = Math.round(oneRepMax * (percent / 100));
                      // Color coding based on intensity zone
                      const getZoneColors = () => {
                        if (percent >= 90) return 'bg-red-50 text-red-700 border-red-100 hover:bg-red-100';
                        if (percent >= 80) return 'bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-100';
                        if (percent >= 70) return 'bg-yellow-50 text-yellow-700 border-yellow-100 hover:bg-yellow-100';
                        if (percent >= 60) return 'bg-green-50 text-green-700 border-green-100 hover:bg-green-100';
                        return 'bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100';
                      };

                      return (
                        <div 
                          key={percent} 
                          className={`border rounded-lg p-3 flex flex-col items-center justify-center transition-colors ${getZoneColors()}`}
                        >
                          <span className="text-xs font-semibold opacity-80 mb-1">{percent}%</span>
                          <span className="text-lg font-bold">{calculatedWeight} <span className="text-xs font-normal opacity-70">{unit}</span></span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <Calculator className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-gray-500">{t('calc.emptyState')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
