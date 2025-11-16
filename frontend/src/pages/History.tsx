import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, TrendingUp, Dumbbell, ChevronRight } from 'lucide-react';
import { getSessions } from '../services/workoutService';

interface WorkoutSession {
  id: number;
  routine_name: string;
  name: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_volume: number;
  total_sets: number;
  exercise_count: number;
  is_completed: boolean;
}

export const History = () => {
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed'>('completed');

  useEffect(() => {
    loadSessions();
  }, [filter]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const params = filter === 'completed' ? { is_completed: true } : {};
      const data = await getSessions(params);
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const groupSessionsByDate = (sessions: WorkoutSession[]) => {
    const grouped: { [key: string]: WorkoutSession[] } = {};
    
    sessions.forEach((session) => {
      const dateKey = new Date(session.start_time).toDateString();
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(session);
    });

    return Object.entries(grouped).sort((a, b) => 
      new Date(b[0]).getTime() - new Date(a[0]).getTime()
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const groupedSessions = groupSessionsByDate(sessions);
  const totalWorkouts = sessions.length;
  const totalVolume = sessions.reduce((sum, s) => sum + parseFloat(s.total_volume.toString()), 0);
  const totalTime = sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Workout History</h1>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
              <Dumbbell className="w-8 h-8 mb-2 opacity-80" />
              <p className="text-sm opacity-90">Total Workouts</p>
              <p className="text-3xl font-bold">{totalWorkouts}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
              <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
              <p className="text-sm opacity-90">Total Volume</p>
              <p className="text-3xl font-bold">{totalVolume.toFixed(0)} kg</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
              <Clock className="w-8 h-8 mb-2 opacity-80" />
              <p className="text-sm opacity-90">Total Time</p>
              <p className="text-3xl font-bold">{totalTime} min</p>
            </div>
          </div>

          {/* Filter */}
          <div className="flex space-x-4">
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === 'completed'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed
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
          </div>
        </div>
      </div>

      {/* Workout List */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {groupedSessions.length === 0 ? (
          <div className="text-center py-12">
            <Dumbbell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No workouts yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start a workout to see it here!
            </p>
            <Link
              to="/workouts"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              Browse Workouts
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {groupedSessions.map(([dateKey, dateSessions]) => (
              <div key={dateKey}>
                {/* Date Header */}
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-bold text-gray-900">
                    {formatDate(dateSessions[0].start_time)}
                  </h2>
                  <span className="text-sm text-gray-600">
                    ({dateSessions.length} workout{dateSessions.length > 1 ? 's' : ''})
                  </span>
                </div>

                {/* Workouts for this date */}
                <div className="space-y-3">
                  {dateSessions.map((session) => (
                    <Link
                      key={session.id}
                      to={`/history/${session.id}`}
                      className="block bg-white rounded-xl shadow-sm hover:shadow-md transition p-5"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-bold text-gray-900">
                              {session.routine_name || session.name}
                            </h3>
                            {session.is_completed && (
                              <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {formatTime(session.start_time)}
                          </p>

                          {/* Stats */}
                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center space-x-2 text-sm">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">
                                {session.duration_minutes || 0} min
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <Dumbbell className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">
                                {session.exercise_count} exercises
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <TrendingUp className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-700">
                                {session.total_volume} kg total
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-gray-700">
                                {session.total_sets} sets
                              </span>
                            </div>
                          </div>
                        </div>

                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};