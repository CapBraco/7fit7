import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Search, X, ChevronDown, ChevronUp, Copy, GripVertical } from 'lucide-react';
import { getExercises, createRoutine } from '../services/workoutService';

interface Exercise {
  id: number;
  name: string;
  category: string;
  muscle_group: string;
  equipment: string;
}

interface CustomSet {
  set_number: number;
  reps: number;
  weight: number;
  rest_seconds: number;
  notes: string;
  set_name?: string;
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
  custom_sets?: CustomSet[];
  use_custom_sets: boolean;
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
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [draggedSet, setDraggedSet] = useState<{ exerciseIdx: number; setIdx: number } | null>(null);
  const [editingSetName, setEditingSetName] = useState<{ exerciseIdx: number; setIdx: number } | null>(null);

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
      use_custom_sets: false,
      custom_sets: [],
    };
    setSelectedExercises([...selectedExercises, newExercise]);
    setSearchTerm('');
    setShowExercisePicker(false);
  };

  const removeExercise = (index: number) => {
    const updated = selectedExercises.filter((_, i) => i !== index);
    updated.forEach((ex, i) => {
      ex.order = i;
    });
    setSelectedExercises(updated);
    if (expandedExercise === index) setExpandedExercise(null);
  };

  const updateExercise = (index: number, field: keyof RoutineExercise, value: any) => {
    const updated = [...selectedExercises];
    
    // Handle numeric fields - prevent NaN and apply limits
    if (['default_sets', 'default_reps', 'default_rest_seconds'].includes(field)) {
      value = value === '' || isNaN(value) ? 0 : parseInt(value);
      // Apply max limits
      if (field === 'default_sets' && value > 30) value = 30;
      if (field === 'default_reps' && value > 999) value = 999;
      if (field === 'default_rest_seconds' && value > 600) value = 600; // Max 10 minutes rest
    }
    if (field === 'default_weight') {
      value = value === '' || isNaN(value) ? 0 : parseFloat(value);
      if (value > 999) value = 999; // Max 999kg
    }
    
    updated[index] = { ...updated[index], [field]: value };
    
    // Generate custom sets when number of sets changes and custom sets are enabled
    if (field === 'default_sets' && updated[index].use_custom_sets && value > 0) {
      generateCustomSets(index, value);
    }
    
    setSelectedExercises(updated);
  };

  const toggleCustomSets = (index: number) => {
    const updated = [...selectedExercises];
    const exercise = updated[index];
    exercise.use_custom_sets = !exercise.use_custom_sets;
    
    if (exercise.use_custom_sets) {
      generateCustomSets(index, exercise.default_sets);
      setExpandedExercise(index); // Auto-expand when enabling custom sets
    } else {
      exercise.custom_sets = [];
      if (expandedExercise === index) {
        setExpandedExercise(null);
      }
    }
    
    setSelectedExercises(updated);
  };

  const generateCustomSets = (exerciseIndex: number, numSets: number) => {
    const updated = [...selectedExercises];
    const exercise = updated[exerciseIndex];
    const sets: CustomSet[] = [];
    
    for (let i = 0; i < numSets; i++) {
      sets.push({
        set_number: i + 1,
        reps: exercise.default_reps,
        weight: exercise.default_weight,
        rest_seconds: exercise.default_rest_seconds,
        notes: '',
        set_name: '',
      });
    }
    
    exercise.custom_sets = sets;
    setSelectedExercises(updated);
  };

  const updateCustomSet = (exerciseIndex: number, setIndex: number, field: keyof CustomSet, value: any) => {
    const updated = [...selectedExercises];
    if (updated[exerciseIndex].custom_sets) {
      // Handle numeric fields - prevent NaN and apply limits
      if (['reps', 'rest_seconds'].includes(field)) {
        value = value === '' || isNaN(value) ? 0 : parseInt(value);
        if (field === 'reps' && value > 999) value = 999;
        if (field === 'rest_seconds' && value > 600) value = 600;
      }
      if (field === 'weight') {
        value = value === '' || isNaN(value) ? 0 : parseFloat(value);
        if (value > 999) value = 999;
      }
      
      updated[exerciseIndex].custom_sets![setIndex] = {
        ...updated[exerciseIndex].custom_sets![setIndex],
        [field]: value,
      };
      setSelectedExercises(updated);
    }
  };

  const cloneSet = (exerciseIndex: number, setIndex: number) => {
    const updated = [...selectedExercises];
    const exercise = updated[exerciseIndex];
    if (exercise.custom_sets) {
      const setToClone = { ...exercise.custom_sets[setIndex] };
      setToClone.set_number = exercise.custom_sets.length + 1;
      exercise.custom_sets.push(setToClone);
      exercise.default_sets = exercise.custom_sets.length;
      setSelectedExercises(updated);
    }
  };

  const handleDragStart = (exerciseIdx: number, setIdx: number) => {
    setDraggedSet({ exerciseIdx, setIdx });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (exerciseIdx: number, targetSetIdx: number) => {
    if (!draggedSet || draggedSet.exerciseIdx !== exerciseIdx) return;

    const updated = [...selectedExercises];
    const exercise = updated[exerciseIdx];
    
    if (exercise.custom_sets) {
      const sets = [...exercise.custom_sets];
      const [movedSet] = sets.splice(draggedSet.setIdx, 1);
      sets.splice(targetSetIdx, 0, movedSet);
      
      // Renumber sets
      sets.forEach((set, idx) => {
        set.set_number = idx + 1;
      });
      
      exercise.custom_sets = sets;
      setSelectedExercises(updated);
    }
    
    setDraggedSet(null);
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
        exercises: selectedExercises.map(({ exercise_details, use_custom_sets, custom_sets, ...rest }) => rest),
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
            <h2 className="text-xl font-bold text-gray-900 mb-4">Exercises</h2>
            
            {/* Inline Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setShowExercisePicker(true)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                placeholder="Search and add exercises..."
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setShowExercisePicker(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Exercise Results Dropdown */}
            {showExercisePicker && searchTerm && (
              <div className="mb-4 max-h-64 overflow-y-auto border border-gray-200 rounded-lg bg-white shadow-lg">
                {filteredExercises.length > 0 ? (
                  filteredExercises.map((exercise) => (
                    <button
                      key={exercise.id}
                      type="button"
                      onClick={() => addExercise(exercise)}
                      className="w-full text-left p-3 hover:bg-blue-50 transition border-b border-gray-100 last:border-b-0"
                    >
                      <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                      <p className="text-sm text-gray-600">
                        {exercise.muscle_group} • {exercise.equipment}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="p-4 text-gray-600 text-center">No exercises found</p>
                )}
              </div>
            )}

            {selectedExercises.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                Start typing above to search and add exercises!
              </p>
            ) : (
              <div className="space-y-4">
                {selectedExercises.map((ex, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    {/* Exercise Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
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
                        className="text-red-600 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quick Settings (Always Visible) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Sets</label>
                        <input
                          type="number"
                          value={ex.default_sets || ''}
                          onChange={(e) =>
                            updateExercise(index, 'default_sets', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          min="1"
                          max="30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Reps</label>
                        <input
                          type="number"
                          value={ex.default_reps || ''}
                          onChange={(e) =>
                            updateExercise(index, 'default_reps', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          min="1"
                          max="999"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Weight (kg)</label>
                        <input
                          type="number"
                          value={ex.default_weight || ''}
                          onChange={(e) =>
                            updateExercise(index, 'default_weight', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          min="0"
                          max="999"
                          step="0.5"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Rest (sec)</label>
                        <input
                          type="number"
                          value={ex.default_rest_seconds || ''}
                          onChange={(e) =>
                            updateExercise(index, 'default_rest_seconds', e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                          min="0"
                          max="600"
                        />
                      </div>
                    </div>

                    {/* Customize Sets Toggle */}
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => toggleCustomSets(index)}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {ex.use_custom_sets ? '✓ Using custom sets' : '+ Customize each set'}
                      </button>
                      {ex.use_custom_sets && (
                        <button
                          type="button"
                          onClick={() => setExpandedExercise(expandedExercise === index ? null : index)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          {expandedExercise === index ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    {/* Expanded View - Custom Sets */}
                    {expandedExercise === index && ex.use_custom_sets && ex.custom_sets && (
                      <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
                        <p className="text-sm font-medium text-gray-700">Custom Sets:</p>
                        {ex.custom_sets.map((set, setIdx) => (
                          <div
                            key={setIdx}
                            draggable
                            onDragStart={() => handleDragStart(index, setIdx)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index, setIdx)}
                            className={`bg-gray-50 rounded-lg p-3 space-y-2 cursor-move hover:bg-gray-100 transition ${
                              draggedSet?.exerciseIdx === index && draggedSet?.setIdx === setIdx
                                ? 'opacity-50 border-2 border-blue-400'
                                : 'border border-gray-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <GripVertical className="w-4 h-4 text-gray-400" />
                                {editingSetName?.exerciseIdx === index && editingSetName?.setIdx === setIdx ? (
                                  <input
                                    type="text"
                                    value={set.set_name || ''}
                                    onChange={(e) => updateCustomSet(index, setIdx, 'set_name', e.target.value)}
                                    onBlur={() => setEditingSetName(null)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') setEditingSetName(null);
                                    }}
                                    autoFocus
                                    className="text-sm font-semibold text-gray-900 bg-white border border-blue-500 rounded px-2 py-1 outline-none"
                                    placeholder={`Set ${set.set_number}`}
                                  />
                                ) : (
                                  <span
                                    onClick={() => setEditingSetName({ exerciseIdx: index, setIdx })}
                                    className="text-sm font-semibold text-gray-900 cursor-text hover:text-blue-600 transition"
                                  >
                                    {set.set_name || `Set ${set.set_number}`}
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => cloneSet(index, setIdx)}
                                className="text-blue-600 hover:text-blue-700 text-xs flex items-center space-x-1"
                              >
                                <Copy className="w-4 h-4" />
                                <span>Clone</span>
                              </button>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Reps</label>
                                <input
                                  type="number"
                                  value={set.reps || ''}
                                  onChange={(e) =>
                                    updateCustomSet(index, setIdx, 'reps', e.target.value)
                                  }
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  min="1"
                                  max="999"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Weight</label>
                                <input
                                  type="number"
                                  value={set.weight || ''}
                                  onChange={(e) =>
                                    updateCustomSet(index, setIdx, 'weight', e.target.value)
                                  }
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  min="0"
                                  max="999"
                                  step="0.5"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">Rest (s)</label>
                                <input
                                  type="number"
                                  value={set.rest_seconds || ''}
                                  onChange={(e) =>
                                    updateCustomSet(index, setIdx, 'rest_seconds', e.target.value)
                                  }
                                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                  min="0"
                                  max="600"
                                />
                              </div>
                            </div>
                            <input
                              type="text"
                              value={set.notes}
                              onChange={(e) =>
                                updateCustomSet(index, setIdx, 'notes', e.target.value)
                              }
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                              placeholder="Notes (e.g., warm-up, drop set)..."
                            />
                          </div>
                        ))}
                      </div>
                    )}
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
    </div>
  );
};