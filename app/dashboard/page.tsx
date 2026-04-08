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
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                {t('dashboard.logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-2">{t('dashboard.welcome')}</h2>
          <p className="text-blue-100">{t('dashboard.subtitle')}</p>
        </div>

        {/* Quick Actions */}
        <CardGrid cols={4}>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
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
        <div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-xl border border-gray-100">
              {/* Profile Inputs */}
              <div className="space-y-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 pb-2 border-b">
                  <User className="w-4 h-4 text-blue-500" />
                  Personal Details
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Age</Label>
                    <Input
                      type="number"
                      value={tdeeData.age}
                      onChange={(e) => updateTDEEData('age', parseInt(e.target.value) || 0)}
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Gender</Label>
                    <select
                      value={tdeeData.gender}
                      onChange={(e) => updateTDEEData('gender', e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Height (cm)</Label>
                    <Input
                      type="number"
                      value={tdeeData.height}
                      onChange={(e) => updateTDEEData('height', parseFloat(e.target.value) || 0)}
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Weight (kg)</Label>
                    <Input
                      type="number"
                      value={tdeeData.weight}
                      onChange={(e) => updateTDEEData('weight', parseFloat(e.target.value) || 0)}
                      className="bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Activity Level</Label>
                  <select
                    value={tdeeData.activityLevel}
                    onChange={(e) => updateTDEEData('activityLevel', e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="sedentary">Sedentary (Office job)</option>
                    <option value="light">Light (1-2 days/week)</option>
                    <option value="moderate">Moderate (3-5 days/week)</option>
                    <option value="active">Active (6-7 days/week)</option>
                    <option value="very-active">Very Active (Elite athlete)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Your Goal</Label>
                  <select
                    value={tdeeData.goal}
                    onChange={(e) => updateTDEEData('goal', e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="lose">Lose Weight</option>
                    <option value="maintain">Maintain weight</option>
                    <option value="gain">Gain Muscle</option>
                  </select>
                </div>
              </div>

              {/* Results Display */}
              <div className="space-y-6">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 pb-2 border-b">
                  <Flame className="w-4 h-4 text-orange-500" />
                  Nutrition Results
                </h3>

                <div className="bg-white p-6 rounded-xl border border-blue-50 shadow-sm space-y-4">
                  <div className="text-center pb-4 border-b">
                    <div className="text-sm font-medium text-gray-500 mb-1">Target Calories</div>
                    <div className="text-4xl font-black text-blue-600 tracking-tight">
                      {tdeeResults.targetCalories}
                      <span className="text-sm font-bold text-gray-400 ml-1 uppercase">kcal/day</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-[10px] uppercase font-bold text-purple-400 mb-1">BMR</div>
                      <div className="text-sm font-bold text-purple-700">{tdeeResults.bmr}</div>
                    </div>
                    <div className="text-center p-3 bg-indigo-50 rounded-lg">
                      <div className="text-[10px] uppercase font-bold text-indigo-400 mb-1">TDEE</div>
                      <div className="text-sm font-bold text-indigo-700">{tdeeResults.tdee}</div>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        <span className="text-sm font-medium text-gray-600">Protein</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{tdeeResults.protein}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium text-gray-600">Carbs</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{tdeeResults.carbs}g</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                        <span className="text-sm font-medium text-gray-600">Fats</span>
                      </div>
                      <span className="text-sm font-bold text-gray-900">{tdeeResults.fats}g</span>
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
