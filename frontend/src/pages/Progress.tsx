import { useState, useEffect } from 'react';
import { TrendingUp, Award, Calendar, Dumbbell, Target, Scale, Plus } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getSessions, getExercises } from '../services/workoutService';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface ExerciseWithMuscles {
  id: number;
  name: string;
  muscle_group: string;
  secondary_muscles: string | string[];
}

export const Progress = () => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [exercises, setExercises] = useState<ExerciseWithMuscles[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
  const [bodyWeights, setBodyWeights] = useState<any[]>([]);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('month');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sessionsData, exercisesData] = await Promise.all([
        getSessions({ is_completed: true }),
        getExercises(),
      ]);
      setSessions(sessionsData);
      setExercises(exercisesData);
      await loadBodyWeights();
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBodyWeights = async () => {
    try {
      const response = await axios.get(`${API_URL}/users/body-weight/`);
      setBodyWeights(response.data);
    } catch (error) {
      console.error('Failed to load body weights:', error);
    }
  };

  const saveBodyWeight = async () => {
    if (!newWeight) return;
    try {
      await axios.post(`${API_URL}/users/body-weight/`, {
        weight: parseFloat(newWeight),
        date: new Date().toISOString().split('T')[0],
      });
      setNewWeight('');
      setShowWeightModal(false);
      loadBodyWeights();
    } catch (error: any) {
      console.error('Failed to save weight:', error);
      if (error.response?.status === 400) {
        alert('Weight already logged for today. Update from history instead.');
      }
    }
  };

  const filterByTimeRange = (items: any[], dateField: string = 'start_time') => {
    const now = new Date();
    return items.filter((item) => {
      const itemDate = new Date(item[dateField]);
      const diffDays = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);
      if (timeRange === 'week') return diffDays <= 7;
      if (timeRange === 'month') return diffDays <= 30;
      return true;
    }).sort((a, b) => new Date(a[dateField]).getTime() - new Date(b[dateField]).getTime());
  };

  // Calculate muscle group volume
  const getMuscleGroupVolumeData = () => {
    const filtered = filterByTimeRange(sessions);
    const muscleVolumes: { [key: string]: { [date: string]: number } } = {};

    filtered.forEach((session) => {
      const date = new Date(session.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      (session.exercise_sets || []).forEach((set: any) => {
        const exercise = exercises.find(e => e.id === set.exercise);
        if (!exercise) return;

        const volume = (parseFloat(set.weight) || 0) * (set.reps || 0);
        
        // Primary muscle
        if (!muscleVolumes[exercise.muscle_group]) muscleVolumes[exercise.muscle_group] = {};
        muscleVolumes[exercise.muscle_group][date] = (muscleVolumes[exercise.muscle_group][date] || 0) + volume;

        // Secondary muscles (split volume)
        if (exercise.secondary_muscles) {
          // Handle both array and string formats
          const secondaryMuscles = Array.isArray(exercise.secondary_muscles)
            ? exercise.secondary_muscles
            : exercise.secondary_muscles.split(',').map(m => m.trim());
          
          const splitVolume = volume / (secondaryMuscles.length + 1); // +1 for primary
          
          secondaryMuscles.forEach(muscle => {
            if (muscle) {
              if (!muscleVolumes[muscle]) muscleVolumes[muscle] = {};
              muscleVolumes[muscle][date] = (muscleVolumes[muscle][date] || 0) + splitVolume;
            }
          });
        }
      });
    });

    // Convert to chart format
    const dates = Array.from(new Set(filtered.map(s => 
      new Date(s.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    )));

    return dates.map(date => {
      const dataPoint: any = { date };
      Object.keys(muscleVolumes).forEach(muscle => {
        dataPoint[muscle] = muscleVolumes[muscle][date] || 0;
      });
      return dataPoint;
    });
  };

  // Get strength progression for specific exercise
  const getExerciseStrengthProgression = () => {
    if (!selectedExercise) return [];

    const exerciseSets = sessions
      .flatMap((session) => session.exercise_sets || [])
      .filter((set) => set.exercise === selectedExercise);

    const grouped: { [key: string]: any[] } = {};
    exerciseSets.forEach((set) => {
      const date = new Date(set.created_at || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(set);
    });

    return Object.entries(grouped)
      .map(([date, sets]) => ({
        date,
        maxWeight: Math.max(...sets.map((s) => parseFloat(s.weight) || 0)),
        avgWeight: sets.reduce((sum, s) => sum + (parseFloat(s.weight) || 0), 0) / sets.length,
        totalVolume: sets.reduce((sum, s) => sum + ((parseFloat(s.weight) || 0) * s.reps), 0),
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Body weight chart data
  const getBodyWeightChartData = () => {
    return filterByTimeRange(bodyWeights, 'date').map(log => ({
      date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: parseFloat(log.weight),
    }));
  };

  const stats = {
    totalWorkouts: filterByTimeRange(sessions).length,
    totalVolume: filterByTimeRange(sessions).reduce((sum, s) => sum + parseFloat(s.total_volume), 0),
    totalSets: filterByTimeRange(sessions).reduce((sum, s) => sum + s.total_sets, 0),
    avgDuration: filterByTimeRange(sessions).reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / (filterByTimeRange(sessions).length || 1),
    currentWeight: bodyWeights[0]?.weight || 0,
    weightChange: bodyWeights.length >= 2 ? parseFloat(bodyWeights[0].weight) - parseFloat(bodyWeights[bodyWeights.length - 1].weight) : 0,
  };

  const muscleGroupData = getMuscleGroupVolumeData();
  const strengthData = getExerciseStrengthProgression();
  const bodyWeightData = getBodyWeightChartData();
  const muscleGroups = Array.from(new Set(muscleGroupData.flatMap(d => Object.keys(d).filter(k => k !== 'date'))));

  const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Progress Tracking</h1>

          {/* Time Range Filter */}
          <div className="flex space-x-4 mb-6">
            <button onClick={() => setTimeRange('week')} className={`px-4 py-2 rounded-lg font-medium transition ${timeRange === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Last 7 Days
            </button>
            <button onClick={() => setTimeRange('month')} className={`px-4 py-2 rounded-lg font-medium transition ${timeRange === 'month' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              Last 30 Days
            </button>
            <button onClick={() => setTimeRange('all')} className={`px-4 py-2 rounded-lg font-medium transition ${timeRange === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
              All Time
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <Calendar className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Workouts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalWorkouts}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalVolume.toFixed(0)} kg</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <Dumbbell className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-sm text-gray-600">Total Sets</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSets}</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-4">
              <Target className="w-6 h-6 text-orange-600 mb-2" />
              <p className="text-sm text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgDuration.toFixed(0)} min</p>
            </div>
            <div className="bg-pink-50 rounded-lg p-4">
              <Scale className="w-6 h-6 text-pink-600 mb-2" />
              <p className="text-sm text-gray-600">Current Weight</p>
              <p className="text-2xl font-bold text-gray-900">{stats.currentWeight ? `${stats.currentWeight} kg` : '-'}</p>
            </div>
            <div className={`rounded-lg p-4 ${stats.weightChange > 0 ? 'bg-red-50' : stats.weightChange < 0 ? 'bg-green-50' : 'bg-gray-50'}`}>
              <TrendingUp className={`w-6 h-6 mb-2 ${stats.weightChange > 0 ? 'text-red-600' : stats.weightChange < 0 ? 'text-green-600' : 'text-gray-600'}`} />
              <p className="text-sm text-gray-600">Weight Change</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.weightChange !== 0 ? `${stats.weightChange > 0 ? '+' : ''}${stats.weightChange.toFixed(1)} kg` : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Body Weight Tracking */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Body Weight Tracking</h2>
            <button onClick={() => setShowWeightModal(true)} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              <Plus className="w-5 h-5" />
              <span>Log Weight</span>
            </button>
          </div>
          {bodyWeightData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bodyWeightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#ec4899" strokeWidth={2} name="Weight (kg)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-center py-8">Start logging your weight to track progress!</p>
          )}
        </div>

        {/* Muscle Group Volume */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Volume by Muscle Group</h2>
          {muscleGroupData.length > 0 && muscleGroups.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={muscleGroupData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                {muscleGroups.map((muscle, idx) => (
                  <Bar key={muscle} dataKey={muscle} stackId="a" fill={colors[idx % colors.length]} name={muscle.charAt(0).toUpperCase() + muscle.slice(1)} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-center py-8">Complete workouts to see muscle group breakdown</p>
          )}
        </div>

        {/* Exercise Strength Progression */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Strength Progression</h2>
            <select value={selectedExercise || ''} onChange={(e) => setSelectedExercise(Number(e.target.value) || null)} className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">Select an exercise</option>
              {exercises.map((ex) => (
                <option key={ex.id} value={ex.id}>{ex.name}</option>
              ))}
            </select>
          </div>
          {selectedExercise && strengthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={strengthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="maxWeight" stroke="#8b5cf6" strokeWidth={2} name="Max Weight (kg)" />
                <Line type="monotone" dataKey="avgWeight" stroke="#ec4899" strokeWidth={2} name="Avg Weight (kg)" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-600 text-center py-8">{selectedExercise ? 'No data for this exercise' : 'Select an exercise to view strength progression'}</p>
          )}
        </div>
      </div>

      {/* Weight Log Modal */}
      {showWeightModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Log Body Weight</h3>
            <input
              type="number"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4"
              placeholder="Weight (kg)"
              step="0.1"
            />
            <div className="flex space-x-4">
              <button onClick={() => setShowWeightModal(false)} className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-medium">
                Cancel
              </button>
              <button onClick={saveBodyWeight} className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
