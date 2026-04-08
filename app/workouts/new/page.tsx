'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Save, ArrowLeft, Dumbbell, Calculator, Flame } from 'lucide-react';
import { useLanguage } from '@/components/language-provider';

const workoutSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  notes: z.string().optional(),
});

const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  sets: z.array(z.object({
    reps: z.number().min(1, 'Reps must be at least 1'),
    weight: z.number().min(0, 'Weight must be positive'),
  })).min(1, 'At least one set is required'),
});

type WorkoutForm = z.infer<typeof workoutSchema>;
type ExerciseForm = z.infer<typeof exerciseSchema>;

const mockExercises = [
  'Bench Press', 'Squats', 'Deadlifts', 'Shoulder Press', 'Bicep Curls',
  'Tricep Extensions', 'Lat Pulldowns', 'Leg Press', 'Calf Raises', 'Plank'
];

export default function NewWorkoutPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [exercises, setExercises] = useState<ExerciseForm[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTDEE, setShowTDEE] = useState(false);
  const [tdeeData, setTDEEData] = useState({
    age: 25,
    gender: 'male' as 'male' | 'female',
    height: 175,
    weight: 75,
    activityLevel: 'moderate' as 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active',
    goal: 'maintain' as 'lose' | 'maintain' | 'gain'
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WorkoutForm>({
    resolver: zodResolver(workoutSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      duration: 45,
    },
  });

  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: [{ reps: 10, weight: 50 }] }]);
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: keyof ExerciseForm, value: any) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setExercises(updatedExercises);
  };

  const addSet = (exerciseIndex: number) => {
    const updatedExercises = [...exercises];
    const lastSet = updatedExercises[exerciseIndex].sets[updatedExercises[exerciseIndex].sets.length - 1];
    updatedExercises[exerciseIndex].sets.push({ 
      reps: lastSet?.reps || 10, 
      weight: lastSet?.weight || 50 
    });
    setExercises(updatedExercises);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets = updatedExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    setExercises(updatedExercises);
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

  const updateTDEEData = (field: string, value: any) => {
    setTDEEData(prev => ({ ...prev, [field]: value }));
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'reps' | 'weight', value: number) => {
    const updatedExercises = [...exercises];
    updatedExercises[exerciseIndex].sets[setIndex] = { 
      ...updatedExercises[exerciseIndex].sets[setIndex], 
      [field]: value 
    };
    setExercises(updatedExercises);
  };

  const tdeeResults = calculateTDEE();

  const onSubmit = async (data: WorkoutForm) => {
    if (exercises.length === 0) {
      alert('Please add at least one exercise');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const workout = {
        id: Date.now().toString(),
        ...data,
        exercises,
      };

      console.log('New workout:', workout);
      
      // Store in localStorage for demo
      const existingWorkouts = JSON.parse(localStorage.getItem('workouts') || '[]');
      localStorage.setItem('workouts', JSON.stringify([...existingWorkouts, workout]));

      router.push('/workouts');
    } catch (error) {
      console.error('Error saving workout:', error);
      alert('Error saving workout. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                onClick={() => router.back()}
                className="text-gray-500 hover:text-gray-700 -ml-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Dumbbell className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">{t('newWorkout.title')}</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Workout Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('newWorkout.infoTitle')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">{t('newWorkout.date')}</Label>
                <Input
                  id="date"
                  type="date"
                  {...register('date')}
                />
                {errors.date && (
                  <p className="text-red-500 text-sm">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">{t('newWorkout.duration')}</Label>
                <Input
                  id="duration"
                  type="number"
                  {...register('duration', { valueAsNumber: true })}
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm">{errors.duration.message}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="notes">{t('newWorkout.notes')}</Label>
              <textarea
                id="notes"
                {...register('notes')}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                placeholder={t('newWorkout.notesPlaceholder')}
              />
            </div>
          </div>

          {/* Exercises */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{t('newWorkout.exercisesTitle')}</h2>
              <Button type="button" onClick={addExercise} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                {t('newWorkout.addExerciseBtn')}
              </Button>
            </div>

            {exercises.length === 0 ? (
              <div className="text-center py-8">
                <Dumbbell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('newWorkout.noExercises')}</h3>
                <p className="text-gray-600 mb-4">{t('newWorkout.addExercisesDesc')}</p>
                <Button type="button" onClick={addExercise}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t('newWorkout.addFirstBtn')}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {exercises.map((exercise, exerciseIndex) => (
                  <div key={exerciseIndex} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1 mr-4">
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">
                          {t('newWorkout.exerciseNum')} {exerciseIndex + 1}
                        </Label>
                        <Input
                          placeholder="e.g., Bench Press"
                          value={exercise.name}
                          onChange={(e) => updateExercise(exerciseIndex, 'name', e.target.value)}
                          list="exercises-list"
                        />
                        <datalist id="exercises-list">
                          {mockExercises.map((ex) => (
                            <option key={ex} value={ex} />
                          ))}
                        </datalist>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeExercise(exerciseIndex)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm font-medium text-gray-700">{t('newWorkout.sets')}</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addSet(exerciseIndex)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {t('newWorkout.addSetBtn')}
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {exercise.sets.map((set, setIndex) => (
                          <div key={setIndex} className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                            <div className="flex-1">
                              <Label className="text-xs text-gray-600">{t('newWorkout.reps')}</Label>
                              <Input
                                type="number"
                                value={set.reps}
                                onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                                min="1"
                              />
                            </div>
                            <div className="flex-1">
                              <Label className="text-xs text-gray-600">{t('newWorkout.weight')}</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="number"
                                  value={set.weight}
                                  onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                                  min="0"
                                  step="2.5"
                                />
                                {exercise.sets.length > 1 && (
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => removeSet(exerciseIndex, setIndex)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TDEE Calculator Panel */}
          {showTDEE && (
            <div className="bg-white rounded-lg shadow p-6 border-2 border-orange-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                {t('tdee.title')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Age */}
                <div className="space-y-2">
                  <Label>{t('tdee.age')}</Label>
                  <Input
                    type="number"
                    value={tdeeData.age}
                    onChange={(e) => updateTDEEData('age', parseInt(e.target.value) || 0)}
                    min="10"
                    max="100"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <Label>{t('tdee.gender')}</Label>
                  <select
                    value={tdeeData.gender}
                    onChange={(e) => updateTDEEData('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">{t('tdee.male')}</option>
                    <option value="female">{t('tdee.female')}</option>
                  </select>
                </div>

                {/* Height */}
                <div className="space-y-2">
                  <Label>{t('tdee.height')}</Label>
                  <Input
                    type="number"
                    value={tdeeData.height}
                    onChange={(e) => updateTDEEData('height', parseInt(e.target.value) || 0)}
                    min="100"
                    max="250"
                  />
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <Label>{t('tdee.weight')}</Label>
                  <Input
                    type="number"
                    value={tdeeData.weight}
                    onChange={(e) => updateTDEEData('weight', parseInt(e.target.value) || 0)}
                    min="30"
                    max="300"
                  />
                </div>

                {/* Activity Level */}
                <div className="space-y-2">
                  <Label>{t('tdee.activity')}</Label>
                  <select
                    value={tdeeData.activityLevel}
                    onChange={(e) => updateTDEEData('activityLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="sedentary">{t('tdee.sedentary')}</option>
                    <option value="light">{t('tdee.light')}</option>
                    <option value="moderate">{t('tdee.moderate')}</option>
                    <option value="active">{t('tdee.active')}</option>
                    <option value="very-active">{t('tdee.veryActive')}</option>
                  </select>
                </div>

                {/* Goal */}
                <div className="space-y-2">
                  <Label>{t('tdee.goal')}</Label>
                  <select
                    value={tdeeData.goal}
                    onChange={(e) => updateTDEEData('goal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="lose">{t('tdee.lose')}</option>
                    <option value="maintain">{t('tdee.maintain')}</option>
                    <option value="gain">{t('tdee.gain')}</option>
                  </select>
                </div>
              </div>

              {/* Results */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-blue-600 font-medium mb-1">{t('tdee.bmr')}</p>
                  <p className="text-xl font-bold text-blue-700">{tdeeResults.bmr}</p>
                  <p className="text-xs text-blue-400">{t('tdee.kcal')}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-orange-600 font-medium mb-1">{t('tdee.tdee')}</p>
                  <p className="text-xl font-bold text-orange-700">{tdeeResults.tdee}</p>
                  <p className="text-xs text-orange-400">{t('tdee.kcal')}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-green-600 font-medium mb-1">{t('tdee.target')}</p>
                  <p className="text-xl font-bold text-green-700">{tdeeResults.targetCalories}</p>
                  <p className="text-xs text-green-400">{t('tdee.kcal')}</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-red-600 font-medium mb-1">{t('tdee.protein')}</p>
                  <p className="text-xl font-bold text-red-700">{tdeeResults.protein}g</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-yellow-600 font-medium mb-1">{t('tdee.carbs')}</p>
                  <p className="text-xl font-bold text-yellow-700">{tdeeResults.carbs}g</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-purple-600 font-medium mb-1">{t('tdee.fats')}</p>
                  <p className="text-xl font-bold text-purple-700">{tdeeResults.fats}g</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowTDEE(!showTDEE)}
              className="flex items-center gap-2"
            >
              <Calculator className="w-4 h-4" />
              {showTDEE ? t('dashboard.hideTDEE') : t('dashboard.showTDEE')}
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSubmitting ? t('newWorkout.savingBtn') : t('newWorkout.saveBtn')}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
