import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Search, X } from 'lucide-react';
import { getExercises, createRoutine } from '../services/workoutService';

interface Exercise {
  id: number;
  name: string;
  category: string;
  muscle_group: string;
  equipment: string;
}

interface RoutineExercise {
  exercise: number;
  exercise_details?: Exercise;
  order: number;
  default_sets: number;
  default_reps: number;
  default_weight: number;
  default_rest_seconds: number;
  notes: string;
}

export const CreateRoutine = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<RoutineExercise[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      const data = await getExercises();
      setExercises(data);
    } catch (error) {
      console.error('Failed to load exercises:', error);
    }
  };

  const addExercise = (exercise: Exercise) => {
    const newExercise: RoutineExercise = {
      exercise: exercise.id,
      exercise_details: exercise,
      order: selectedExercises.length,
      default_sets: 3,
      default_reps: 10,
      default_weight: 0,
      default_rest_seconds: 60,
      notes: '',
    };
    setSelectedExercises([...selectedExercises, newExercise]);
    setShowExercisePicker(false);
    setSearchTerm('');
  };

  const removeExercise = (index: number) => {
    const updated = selectedExercises.filter((_, i) => i !== index);
    // Update order
    updated.forEach((ex, i) => {
      ex.order = i;
    });
    setSelectedExercises(updated);
  };

  const updateExercise = (index: number, field: keyof RoutineExercise, value: any) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedExercises(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || selectedExercises.length === 0) {
      alert('Please add a name and at least one exercise');
      return;
    }

    setLoading(true);
    try {
      const routineData = {
        name,
        description,
        is_public: isPublic,
        exercises: selectedExercises.map(({ exercise_details, ...rest }) => rest),
      };
      await createRoutine(routineData);
      navigate('/workouts');
    } catch (error) {
      console.error('Failed to create routine:', error);
      alert('Failed to create routine');
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter((ex) =>
    ex.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create Workout Routine</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Routine Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="e.g., Push Day, Full Body Workout"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  rows={3}
                  placeholder="Describe your workout routine..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="isPublic" className="ml-2 text-sm text-gray-700">
                  Make this routine public (share with community)
                </label>
              </div>
            </div>
          </div>

          {/* Exercises */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Exercises</h2>
              <button
                type="button"
                onClick={() => setShowExercisePicker(true)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus className="w-5 h-5" />
                <span>Add Exercise</span>
              </button>
            </div>

            {selectedExercises.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No exercises added yet. Click "Add Exercise" to get started!
              </p>
            ) : (
              <div className="space-y-4">
                {selectedExercises.map((ex, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {index + 1}. {ex.exercise_details?.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {ex.exercise_details?.muscle_group} • {ex.exercise_details?.equipment}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeExercise(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Sets</label>
                        <input
                          type="number"
                          value={ex.default_sets}
                          onChange={(e) =>
                            updateExercise(index, 'default_sets', parseInt(e.target.value))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Reps</label>
                        <input
                          type="number"
                          value={ex.default_reps}
                          onChange={(e) =>
                            updateExercise(index, 'default_reps', parseInt(e.target.value))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          value={ex.default_weight}
                          onChange={(e) =>
                            updateExercise(index, 'default_weight', parseFloat(e.target.value))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          min="0"
                          step="0.5"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Rest (sec)</label>
                        <input
                          type="number"
                          value={ex.default_rest_seconds}
                          onChange={(e) =>
                            updateExercise(index, 'default_rest_seconds', parseInt(e.target.value))
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/workouts')}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Routine'}
            </button>
          </div>
        </form>
      </div>

      {/* Exercise Picker Modal */}
      {showExercisePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Add Exercise</h3>
                <button
                  onClick={() => setShowExercisePicker(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  placeholder="Search exercises..."
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-96 p-4">
              {filteredExercises.map((exercise) => (
                <button
                  key={exercise.id}
                  onClick={() => addExercise(exercise)}
                  className="w-full text-left p-4 hover:bg-gray-50 rounded-lg transition border-b border-gray-100"
                >
                  <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                  <p className="text-sm text-gray-600">
                    {exercise.muscle_group} • {exercise.equipment}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};