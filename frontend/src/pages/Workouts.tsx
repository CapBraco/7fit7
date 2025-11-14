import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Dumbbell, Clock, TrendingUp, Heart } from 'lucide-react';
import { getRoutines, likeRoutine } from '../services/workoutService';

interface Routine {
  id: number;
  name: string;
  description: string;
  exercise_count: number;
  total_uses: number;
  average_duration: number;
  is_liked: boolean;
  likes_count: number;
  username: string;
  is_public: boolean;
}

export const Workouts = () => {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'my' | 'public'>('my');

  useEffect(() => {
    loadRoutines();
  }, [filter]);

  const loadRoutines = async () => {
    try {
      setLoading(true);
      const params = {
        my_routines: filter === 'my',
        public: filter === 'public',
      };
      const data = await getRoutines(params);
      setRoutines(data);
    } catch (error) {
      console.error('Failed to load routines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: number) => {
    try {
      await likeRoutine(id);
      loadRoutines();
    } catch (error) {
      console.error('Failed to like routine:', error);
    }
  };

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
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">My Workouts</h1>
            <Link
              to="/workouts/create"
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Create Routine</span>
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => setFilter('my')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'my'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              My Routines
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('public')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'public'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Community
            </button>
          </div>
        </div>
      </div>

      {/* Routines Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {routines.length === 0 ? (
          <div className="text-center py-12">
            <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No routines yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first workout routine to get started!
            </p>
            <Link
              to="/workouts/create"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-5 h-5" />
              <span>Create Routine</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routines.map((routine) => (
              <div
                key={routine.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {routine.name}
                    </h3>
                    <p className="text-sm text-gray-600">by @{routine.username}</p>
                  </div>
                  <button
                    onClick={() => handleLike(routine.id)}
                    className="ml-2"
                  >
                    <Heart
                      className={`w-6 h-6 ${
                        routine.is_liked
                          ? 'fill-red-500 text-red-500'
                          : 'text-gray-400 hover:text-red-500'
                      } transition`}
                    />
                  </button>
                </div>

                {/* Description */}
                {routine.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {routine.description}
                  </p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <Dumbbell className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Exercises</p>
                    <p className="font-semibold text-gray-900">{routine.exercise_count}</p>
                  </div>
                  <div className="text-center">
                    <Clock className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Avg Time</p>
                    <p className="font-semibold text-gray-900">
                      {routine.average_duration || 0}m
                    </p>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">Uses</p>
                    <p className="font-semibold text-gray-900">{routine.total_uses}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    to={`/workouts/routine/${routine.id}`}
                    className="flex-1 text-center bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition font-medium"
                  >
                    View
                  </Link>
                  <Link
                    to={`/workouts/start/${routine.id}`}
                    className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
                  >
                    Start
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};