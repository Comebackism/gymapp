'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardGrid } from '@/components/ui/card-grid';
import { LogOut, User, Shield, Activity, Dumbbell, TrendingUp, Flame, Target, Calculator } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';

interface UserData {
  id: string;
  email: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);
  const [showTDEE, setShowTDEE] = useState(false);
  const [tdeeData, setTDEEData] = useState({
    age: 25,
    gender: 'male' as 'male' | 'female',
    height: 175,
    weight: 75,
    activityLevel: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active',
    goal: 'maintain' as 'lose' | 'maintain' | 'gain'
  });
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      router.push('/login');
      return;
    }

    // Simple token validation for demo
    try {
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [id, email] = decoded.split(':');
      
      if (id && email) {
        setUser({ id, email });
      } else {
        router.push('/login');
        return;
      }
    } catch (error) {
      router.push('/login');
      return;
    }

    // Load recent workouts from localStorage
    const mockRecent = [
      { title: 'Push Day (Chest, Shoulders, Triceps)', date: 'Today', duration: '45 min', calories: 320, icon: <Dumbbell className="w-5 h-5 text-blue-600" /> },
      { title: 'Pull Day (Back & Biceps)', date: 'Yesterday', duration: '50 min', calories: 380, icon: <Activity className="w-5 h-5 text-purple-600" /> },
      { title: 'Leg Day & Core', date: '2 days ago', duration: '60 min', calories: 450, icon: <Target className="w-5 h-5 text-green-600" /> },
    ];
    let savedRecent: any[] = [];
    try {
      const stored = localStorage.getItem('workouts');
      if (stored) {
        const parsed = JSON.parse(stored);
        
        // Ensure parsing is array and has elements
        if (Array.isArray(parsed) && parsed.length > 0) {
          savedRecent = parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(w => ({
            title: w.exercises && w.exercises.length > 0 ? w.exercises.map((e: any) => e.name).join(', ') : 'Custom Workout',
            date: new Date(w.date).toLocaleDateString(),
            duration: `${w.duration} min`,
            calories: Math.round(w.duration * 6.5), // crude estimation for UI
            icon: <Activity className="w-5 h-5 text-blue-600" />
          }));
        }
      }
    } catch(e) {
      console.error("Failed to load recent workouts:", e);
    }
    
    setRecentWorkouts([...savedRecent, ...mockRecent].slice(0, 3));
    
    setIsLoading(false);
  }, [router]);

  const updateTDEEData = (field: string, value: string | number) => {
    setTDEEData(prev => ({ ...prev, [field]: value }));
  };

  const calculateTDEE = () => {
    const { age, gender, height, weight, activityLevel, goal } = tdeeData;
    
    // BMR calculation (Mifflin-St Jeor)
    let bmr;
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    // Activity multiplier
    const multipliers = {
      'sedentary': 1.2,
      'light': 1.375,
      'moderate': 1.55,
      'active': 1.725,
      'very-active': 1.9
    };
    
    const tdee = bmr * multipliers[activityLevel];
    
    // Adjust for goals
    let targetCalories = tdee;
    if (goal === 'lose') {
      targetCalories = tdee - 500; // 500 calorie deficit
    } else if (goal === 'gain') {
      targetCalories = tdee + 500; // 500 calorie surplus
    }
    
    return {
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      protein: Math.round(weight * 2.2), // 2.2g per kg
      carbs: Math.round((targetCalories * 0.5) / 4), // 50% from carbs
      fats: Math.round((targetCalories * 0.25) / 9) // 25% from fats
    };
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/login');
  };

  const tdeeResults = calculateTDEE();

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
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">{t('dashboard.title')}</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t('dashboard.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">{t('dashboard.welcome')}</h2>
          <p className="text-blue-100">{t('dashboard.subtitle')}</p>
        </div>

        {/* Quick Actions */}
        <CardGrid cols={4} className="mb-8">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.logWorkout')}</h3>
              <p className="text-gray-600 text-sm mb-4">{t('dashboard.logWorkoutDesc')}</p>
              <Button 
                onClick={() => router.push('/workouts/new')}
                className="w-full"
              >
                {t('dashboard.startWorkout')}
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Dumbbell className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.viewWorkouts')}</h3>
              <p className="text-gray-600 text-sm mb-4">{t('dashboard.viewWorkoutsDesc')}</p>
              <Button 
                onClick={() => router.push('/workouts')}
                variant="outline"
                className="w-full"
              >
                {t('dashboard.viewHistory')}
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.trackProgress')}</h3>
              <p className="text-gray-600 text-sm mb-4">{t('dashboard.trackProgressDesc')}</p>
              <Button 
                onClick={() => router.push('/progress')}
                variant="outline"
                className="w-full"
              >
                {t('dashboard.viewProgress')}
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <Calculator className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.1rmCalc')}</h3>
              <p className="text-gray-600 text-sm mb-4">{t('dashboard.1rmCalcDesc')}</p>
              <Button 
                onClick={() => router.push('/calculator')}
                variant="outline"
                className="w-full border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                {t('dashboard.openCalc')}
              </Button>
            </div>
          </div>
        </CardGrid>

        {/* Fitness Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100 bg-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{t('dashboard.statsWorkout')}</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">12</p>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-green-500 font-medium">+2</span> {t('workouts.thisMonth')}
            </p>
          </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{t('dashboard.statsCal')}</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">4,250</p>
              <p className="text-sm text-gray-500">Active kcal {t('workouts.thisMonth')}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{t('dashboard.statsVol')}</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">12.5k</p>
              <p className="text-sm text-gray-500">kg lifted {t('workouts.thisMonth')}</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{t('dashboard.statsStreak')}</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 mb-1">4 <span className="text-xl text-gray-500 font-normal">days</span></p>
              <p className="text-sm text-gray-500">Keep it up!</p>
            </div>
        </div>

        {/* Recent Workouts */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">{t('dashboard.recentWorkouts')}</h2>
            <Button variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50" onClick={() => router.push('/workouts')}>
              {t('dashboard.viewAllHistory')}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentWorkouts.map((workout, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 group-hover:scale-110 transition-all">
                    {workout.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">{workout.date}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">{workout.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-gray-400" />
                    {workout.duration}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="font-medium">{workout.calories}</span> kcal
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TDEE Section */}
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{t('dashboard.tdeeTitle')}</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowTDEE(!showTDEE)}
              >
                {showTDEE ? t('dashboard.hideTDEE') : t('dashboard.showTDEE')}
              </Button>
            </div>

          {showTDEE && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Age</Label>
                      <Input
                        type="number"
                        value={tdeeData.age}
                        onChange={(e) => updateTDEEData('age', parseInt(e.target.value) || 0)}
                        min="1"
                        max="120"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Gender</Label>
                      <select
                        value={tdeeData.gender}
                        onChange={(e) => updateTDEEData('gender', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Height (cm)</Label>
                      <Input
                        type="number"
                        value={tdeeData.height}
                        onChange={(e) => updateTDEEData('height', parseFloat(e.target.value) || 0)}
                        min="100"
                        max="250"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Weight (kg)</Label>
                      <Input
                        type="number"
                        value={tdeeData.weight}
                        onChange={(e) => updateTDEEData('weight', parseFloat(e.target.value) || 0)}
                        min="30"
                        max="300"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Activity Level</Label>
                      <select
                        value={tdeeData.activityLevel}
                        onChange={(e) => updateTDEEData('activityLevel', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="sedentary">Sedentary</option>
                        <option value="light">Light</option>
                        <option value="moderate">Moderate</option>
                        <option value="active">Active</option>
                        <option value="very-active">Very Active</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700">Goal</Label>
                      <select
                        value={tdeeData.goal}
                        onChange={(e) => updateTDEEData('goal', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="lose">Lose Weight</option>
                        <option value="maintain">Maintain Weight</option>
                        <option value="gain">Gain Weight</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-4">Your Results</h3>
                <div className="space-y-4 p-4 bg-white rounded-lg border">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">BMR</span>
                      <span className="font-semibold text-purple-600">{tdeeResults.bmr} kcal/day</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">TDEE</span>
                      <span className="font-semibold text-blue-600">{tdeeResults.tdee} kcal/day</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Target Calories</span>
                      <span className="font-semibold text-green-600">{tdeeResults.targetCalories} kcal/day</span>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Daily Macros</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">Protein</div>
                        <div className="text-lg font-bold text-purple-600">{tdeeResults.protein}g</div>
                        <div className="text-xs text-gray-500">({Math.round((tdeeResults.protein * 4) / tdeeResults.targetCalories)}%)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">Carbs</div>
                        <div className="text-lg font-bold text-blue-600">{tdeeResults.carbs}g</div>
                        <div className="text-xs text-gray-500">({Math.round((tdeeResults.carbs * 4) / tdeeResults.targetCalories)}%)</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600 mb-1">Fats</div>
                        <div className="text-lg font-bold text-orange-600">{tdeeResults.fats}g</div>
                        <div className="text-xs text-gray-500">({Math.round((tdeeResults.fats * 9) / tdeeResults.targetCalories)}%)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
