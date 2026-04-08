'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Activity, Target, Calendar, Scale, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '@/components/language-provider';

interface ProgressData {
  date: string;
  weight: number;
  bodyFat?: number;
  measurements?: {
    chest: number;
    waist: number;
    arms: number;
    thighs: number;
  };
}

interface WorkoutStats {
  totalWorkouts: number;
  totalVolume: number;
  favoriteExercise: string;
  streak: number;
}

export default function ProgressPage() {
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Load mock progress data
    const mockProgressData: ProgressData[] = [
      {
        date: '2024-03-20',
        weight: 75.5,
        bodyFat: 15.2,
        measurements: {
          chest: 102,
          waist: 82,
          arms: 35,
          thighs: 58
        }
      },
      {
        date: '2024-03-15',
        weight: 76.2,
        bodyFat: 15.8,
        measurements: {
          chest: 101,
          waist: 83,
          arms: 34.5,
          thighs: 59
        }
      },
      {
        date: '2024-03-10',
        weight: 77.0,
        bodyFat: 16.5,
        measurements: {
          chest: 100,
          waist: 85,
          arms: 34,
          thighs: 60
        }
      },
      {
        date: '2024-03-05',
        weight: 78.1,
        bodyFat: 17.2,
        measurements: {
          chest: 98,
          waist: 87,
          arms: 33,
          thighs: 61
        }
      }
    ];

    const mockStats: WorkoutStats = {
      totalWorkouts: 24,
      totalVolume: 125000, // kg
      favoriteExercise: 'Bench Press',
      streak: 5
    };

    setProgressData(mockProgressData);
    setStats(mockStats);
    setIsLoading(false);
  }, [router]);

  const currentWeight = progressData[0]?.weight || 0;
  const previousWeight = progressData[1]?.weight || 0;
  const weightChange = currentWeight - previousWeight;
  const weightChangePercent = previousWeight > 0 ? (weightChange / previousWeight) * 100 : 0;

  const currentBodyFat = progressData[0]?.bodyFat || 0;
  const previousBodyFat = progressData[1]?.bodyFat || 0;
  const bodyFatChange = currentBodyFat - previousBodyFat;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/dashboard')}
                className="text-gray-500 hover:text-gray-700 -ml-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">{t('progress.title')}</h1>
              </div>
            </div>
            
            <Button className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              {t('progress.logBtn')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{t('progress.totalWorkouts')}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats?.totalWorkouts || 0}</p>
            <p className="text-sm text-gray-600">{t('workouts.allTime')}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Scale className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{t('progress.currentWeight')}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{currentWeight} kg</p>
            <div className="flex items-center gap-2 text-sm">
              {weightChange > 0 ? (
                <TrendingUp className="w-4 h-4 text-red-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-500" />
              )}
              <span className={weightChange > 0 ? 'text-red-600' : 'text-green-600'}>
                {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg ({weightChangePercent.toFixed(1)}%)
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{t('progress.bodyFat')}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{currentBodyFat}%</p>
            <div className="flex items-center gap-2 text-sm">
              {bodyFatChange > 0 ? (
                <TrendingUp className="w-4 h-4 text-red-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-500" />
              )}
              <span className={bodyFatChange > 0 ? 'text-red-600' : 'text-green-600'}>
                {bodyFatChange > 0 ? '+' : ''}{bodyFatChange.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{t('progress.currentStreak')}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stats?.streak || 0} days</p>
            <p className="text-sm text-gray-600">Keep it up!</p>
          </div>
        </div>

        {/* Progress Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weight Progress */}
          <div className="bg-white rounded-lg shadow p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{t('progress.weightChart')}</h2>
              <div className="text-sm text-gray-500">
                <span className={weightChange > 0 ? 'text-red-500 font-medium' : 'text-green-500 font-medium'}>
                  {weightChange > 0 ? '+' : ''}{weightChange.toFixed(1)} kg
                </span>
                {' '}{t('progress.thisMonth')}
              </div>
            </div>
            <div className="flex-1 min-h-[256px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[...progressData].reverse()} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(tick) => new Date(tick).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    stroke="#9ca3af"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    domain={['dataMin - 1', 'dataMax + 1']} 
                    stroke="#9ca3af"
                    fontSize={12}
                    tickFormatter={(value) => `${value}kg`}
                    tickLine={false}
                    axisLine={false}
                    width={40}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    labelFormatter={(label) => new Date(label as string).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    formatter={(value: any) => [`${value} kg`, 'Weight']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#4f46e5" 
                    strokeWidth={3} 
                    dot={{ fill: '#4f46e5', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Body Measurements */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('progress.bodyMeasurements')}</h2>
            {progressData[0]?.measurements ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{t('progress.chest')}</span>
                  <span className="text-sm font-semibold text-gray-900">{progressData[0].measurements?.chest} cm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{t('progress.waist')}</span>
                  <span className="text-sm font-semibold text-gray-900">{progressData[0].measurements?.waist} cm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{t('progress.arms')}</span>
                  <span className="text-sm font-semibold text-gray-900">{progressData[0].measurements?.arms} cm</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">{t('progress.thighs')}</span>
                  <span className="text-sm font-semibold text-gray-900">{progressData[0].measurements?.thighs} cm</span>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">{t('progress.noMeasurements')}</p>
                  <Button className="mt-4" size="sm">
                    {t('progress.logFirst')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Progress */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">{t('progress.history')}</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Weight (kg)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Body Fat (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chest (cm)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Waist (cm)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arms (cm)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thighs (cm)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {progressData.map((data, index) => (
                  <tr key={index} className={index === 0 ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(data.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.weight}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.bodyFat}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.measurements?.chest || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.measurements?.waist || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.measurements?.arms || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {data.measurements?.thighs || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
