import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, TrendingUp, Dumbbell, Calendar } from 'lucide-react';
import { getSession } from '../services/workoutService';

interface ExerciseSet {
  id: number;
  exercise_name: string;
  set_number: number;
  reps: number;
  weight: number;
  volume: number;
  notes: string;
}

interface WorkoutSession {
  id: number;
  routine_name: string;
  name: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  total_volume: number;
  total_sets: number;
  is_completed: boolean;
  notes: string;
  exercise_sets: ExerciseSet[];
}

export const WorkoutDetail = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      setLoading(true);
      const data = await getSession(Number(sessionId));
      setSession(data);
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const groupSetsByExercise = (sets: ExerciseSet[]) => {
    const grouped: { [key: string]: ExerciseSet[] } = {};
    
    sets.forEach((set) => {
      if (!grouped[set.exercise_name]) {
        grouped[set.exercise_name] = [];
      }
      grouped[set.exercise_name].push(set);
    });

    return Object.entries(grouped);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Workout not found</p>
      </div>
    );
  }

  const exerciseGroups = groupSetsByExercise(session.exercise_sets);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/history')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to History</span>
          </button>

          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {session.routine_name || session.name}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(session.start_time)}</span>
                </div>
                <span>•</span>
                <span>{formatTime(session.start_time)}</span>
              </div>
            </div>
            {session.is_completed && (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                Completed
              </span>
            )}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <Clock className="w-6 h-6 text-blue-600 mb-2" />
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-xl font-bold text-gray-900">
                {session.duration_minutes || 0} min
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
              <p className="text-sm text-gray-600">Total Volume</p>
              <p className="text-xl font-bold text-gray-900">
                {session.total_volume} kg
              </p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <Dumbbell className="w-6 h-6 text-purple-600 mb-2" />
              <p className="text-sm text-gray-600">Total Sets</p>
              <p className="text-xl font-bold text-gray-900">
                {session.total_sets}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Details */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Exercises</h2>

        {exerciseGroups.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No exercises logged</p>
        ) : (
          <div className="space-y-6">
            {exerciseGroups.map(([exerciseName, sets], index) => {
              const totalVolume = sets.reduce((sum, set) => sum + set.volume, 0);
              const avgWeight = sets.reduce((sum, set) => sum + (parseFloat(set.weight.toString()) || 0), 0) / sets.length;
              const hasValidWeight = avgWeight > 0;

              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6">
                  {/* Exercise Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {exerciseName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {sets.length} sets • {totalVolume.toFixed(0)} kg volume
                        {hasValidWeight && ` • Avg ${avgWeight.toFixed(1)} kg`}
                      </p>
                    </div>
                  </div>

                  {/* Sets Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-gray-200">
                        <tr className="text-left text-sm text-gray-600">
                          <th className="pb-3 font-medium">Set</th>
                          <th className="pb-3 font-medium">Reps</th>
                          <th className="pb-3 font-medium">Weight</th>
                          <th className="pb-3 font-medium">Volume</th>
                          {sets.some(s => s.notes) && (
                            <th className="pb-3 font-medium">Notes</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {sets.map((set) => (
                          <tr key={set.id} className="border-b border-gray-100 last:border-b-0">
                            <td className="py-3 text-gray-900 font-medium">
                              {set.set_number}
                            </td>
                            <td className="py-3 text-gray-900">{set.reps}</td>
                            <td className="py-3 text-gray-900">{set.weight} kg</td>
                            <td className="py-3 text-gray-900 font-semibold">
                              {set.volume.toFixed(0)} kg
                            </td>
                            {sets.some(s => s.notes) && (
                              <td className="py-3 text-gray-600 text-sm">
                                {set.notes || '-'}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Notes */}
        {session.notes && (
          <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Notes</h3>
            <p className="text-gray-700">{session.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
};