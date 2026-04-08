'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Activity, Calendar, TrendingUp, Dumbbell, ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';

interface Workout {
  id: string;
  date: string;
  exercises: Exercise[];
  duration: number;
  notes?: string;
}

interface Exercise {
  id: string;
  name: string;
  sets: Set[];
}

interface Set {
  reps: number;
  weight: number;
  rest?: number;
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
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

    // Load mock data
    const mockWorkouts: Workout[] = [
      {
        id: '1',
        date: '2024-03-20',
        duration: 45,
        exercises: [
          {
            id: '1',
            name: 'Bench Press',
            sets: [
              { reps: 12, weight: 60 },
              { reps: 10, weight: 70 },
              { reps: 8, weight: 80 }
            ]
          },
          {
            id: '2',
            name: 'Squats',
            sets: [
              { reps: 15, weight: 80 },
              { reps: 12, weight: 90 },
              { reps: 10, weight: 100 }
            ]
          }
        ]
      },
      {
        id: '2',
        date: '2024-03-18',
        duration: 60,
        exercises: [
          {
            id: '3',
            name: 'Deadlifts',
            sets: [
              { reps: 10, weight: 100 },
              { reps: 8, weight: 120 }
            ]
          }
        ]
      }
    ];

    let savedWorkouts: Workout[] = [];
    try {
      const stored = localStorage.getItem('workouts');
      if (stored) {
        savedWorkouts = JSON.parse(stored);
      }
    } catch (e) {
      console.error("Could not parse stored workouts", e);
    }

    const allWorkouts = [...savedWorkouts, ...mockWorkouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    setWorkouts(allWorkouts);
    setIsLoading(false);
  }, [router]);

  const totalWorkouts = workouts.length;
  const totalExercises = workouts.reduce((acc, workout) => acc + workout.exercises.length, 0);
  const totalSets = workouts.reduce((acc, workout) => 
    acc + workout.exercises.reduce((exAcc, exercise) => exAcc + exercise.sets.length, 0), 0
  );

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
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">{t('workouts.title')}</h1>
              </div>
            </div>
            
            <Button
              onClick={() => router.push('/workouts/new')}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {t('workouts.newBtn')}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{t('workouts.totalWorkouts')}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{totalWorkouts}</p>
            <p className="text-sm text-gray-600">{t('workouts.allTime')}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{t('workouts.exercises')}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{totalExercises}</p>
            <p className="text-sm text-gray-600">{t('workouts.thisMonth')}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{t('workouts.totalSets')}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{totalSets}</p>
            <p className="text-sm text-gray-600">{t('workouts.thisMonth')}</p>
          </div>
        </div>

        {/* Workouts List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">{t('workouts.recent')}</h2>
          </div>
          
          <div className="divide-y">
            {workouts.length === 0 ? (
              <div className="p-8 text-center">
                <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('workouts.noWorkouts')}</h3>
                <p className="text-gray-600 mb-4">{t('workouts.startLogging')}</p>
                <Button onClick={() => router.push('/workouts/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('workouts.logFirst')}
                </Button>
              </div>
            ) : (
              workouts.map((workout) => (
                <div key={workout.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {new Date(workout.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {workout.duration} minutes
                        </div>
                        <div className="flex items-center gap-1">
                          <Dumbbell className="w-4 h-4" />
                          {workout.exercises.length} exercises
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="space-y-3">
                    {workout.exercises.map((exercise) => (
                      <div key={exercise.id} className="bg-gray-50 rounded-lg p-3">
                        <h4 className="font-medium text-gray-900 mb-2">{exercise.name}</h4>
                        <div className="flex flex-wrap gap-2">
                          {exercise.sets.map((set, index) => (
                            <span key={index} className="bg-white px-2 py-1 rounded text-sm border">
                              {set.reps} reps × {set.weight}kg
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
