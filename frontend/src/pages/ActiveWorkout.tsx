import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, Check, X, Plus, Timer } from 'lucide-react';
import {
  startWorkout,
  getRoutine,
  createSet,
  getSessionSets,
  completeSession,
} from '../services/workoutService';

interface Exercise {
  id: number;
  exercise: number;
  exercise_details: {
    id: number;
    name: string;
    muscle_group: string;
  };
  default_sets: number;
  default_reps: number;
  default_weight: number;
  default_rest_seconds: number;
}

interface SetLog {
  id?: number;
  exercise: number;
  set_number: number;
  reps: number;
  weight: number;
  completed: boolean;
}

export const ActiveWorkout = () => {
  const { routineId } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState<any>(null);
  const [routine, setRoutine] = useState<any>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sets, setSets] = useState<SetLog[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Session timer state
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [countdown, setCountdown] = useState(3);
  
  // Rest timer state
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [restDuration, setRestDuration] = useState(60);

  useEffect(() => {
    initWorkout();
  }, [routineId]);

  // Countdown timer before starting
  useEffect(() => {
    if (countdown > 0 && countdown <= 3) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !sessionStarted) {
      setSessionStarted(true);
    }
  }, [countdown, sessionStarted]);

  // Session timer (overall workout time)
  useEffect(() => {
    let interval: any;
    if (sessionStarted) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [sessionStarted]);

  // Rest timer (between sets)
  useEffect(() => {
    let interval: any;
    if (isResting && restTimeLeft > 0) {
      interval = setInterval(() => {
        setRestTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (restTimeLeft === 0 && isResting) {
      setIsResting(false);
    }
    return () => clearInterval(interval);
  }, [isResting, restTimeLeft]);

  const initWorkout = async () => {
    try {
      setLoading(true);
      // Get routine details
      const routineData = await getRoutine(Number(routineId));
      setRoutine(routineData);
      setExercises(routineData.exercises);

      // Start workout session
      const sessionData = await startWorkout(Number(routineId));
      setSession(sessionData);

      // Initialize sets for first exercise
      if (routineData.exercises.length > 0) {
        initializeSetsForExercise(routineData.exercises[0]);
      }
    } catch (error) {
      console.error('Failed to start workout:', error);
      alert('Failed to start workout');
      navigate('/workouts');
    } finally {
      setLoading(false);
    }
  };

  const initializeSetsForExercise = (exercise: Exercise) => {
    const newSets: SetLog[] = [];
    for (let i = 0; i < exercise.default_sets; i++) {
      newSets.push({
        exercise: exercise.exercise,
        set_number: i + 1,
        reps: exercise.default_reps,
        weight: exercise.default_weight,
        completed: false,
      });
    }
    setSets(newSets);
    setRestDuration(exercise.default_rest_seconds);
  };

  const updateSet = (index: number, field: 'reps' | 'weight', value: number) => {
    const updated = [...sets];
    const parsedValue = field === 'weight' ? parseFloat(value.toString()) || 0 : parseInt(value.toString()) || 0;
    updated[index] = { ...updated[index], [field]: parsedValue };
    setSets(updated);
  };

  const completeSet = async (index: number) => {
    const set = sets[index];
    
    // Validate set data
    if (!set.reps || set.reps < 1) {
      alert('Please enter valid reps (at least 1)');
      return;
    }
    
    if (set.weight === null || set.weight === undefined) {
      set.weight = 0; // Allow 0 for bodyweight exercises
    }
    
    try {
      // Save set to backend
      const savedSet = await createSet(session.id, {
        exercise: set.exercise,
        set_number: set.set_number,
        reps: set.reps,
        weight: set.weight,
      });

      // Mark as completed
      const updated = [...sets];
      updated[index] = { ...updated[index], completed: true, id: savedSet.id };
      setSets(updated);

      // Start rest timer if not last set
      if (index < sets.length - 1) {
        setRestTimeLeft(restDuration);
        setIsResting(true);
      }
    } catch (error) {
      console.error('Failed to save set:', error);
      alert('Failed to save set. Please try again.');
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimeLeft(0);
  };

  const addSet = () => {
    const lastSet = sets[sets.length - 1];
    setSets([
      ...sets,
      {
        exercise: lastSet.exercise,
        set_number: sets.length + 1,
        reps: lastSet.reps,
        weight: lastSet.weight,
        completed: false,
      },
    ]);
  };

  const nextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      initializeSetsForExercise(exercises[currentExerciseIndex + 1]);
      setIsResting(false);
    }
  };

  const previousExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(currentExerciseIndex - 1);
      initializeSetsForExercise(exercises[currentExerciseIndex - 1]);
      setIsResting(false);
    }
  };

  const finishWorkout = async () => {
    if (!window.confirm('Are you sure you want to finish this workout?')) {
      return;
    }

    try {
      await completeSession(session.id);
      navigate('/workouts');
    } catch (error) {
      console.error('Failed to complete workout:', error);
      alert('Failed to complete workout');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Countdown screen
  if (countdown > 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">Get Ready!</h1>
          <div className="text-9xl font-bold animate-pulse">{countdown}</div>
        </div>
      </div>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];
  const allSetsCompleted = sets.every((s) => s.completed);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{routine?.name}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span>Exercise {currentExerciseIndex + 1} of {exercises.length}</span>
                <span>•</span>
                <span className="flex items-center space-x-1">
                  <Timer className="w-4 h-4" />
                  <span>{formatTime(sessionTime)}</span>
                </span>
              </div>
            </div>
            <button
              onClick={finishWorkout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition"
            >
              Finish Workout
            </button>
          </div>
        </div>
      </div>

      {/* Rest Timer */}
      {isResting && (
        <div className="bg-orange-600 p-6 text-center">
          <div className="max-w-4xl mx-auto">
            <Timer className="w-12 h-12 mx-auto mb-2" />
            <p className="text-sm mb-2">REST TIME</p>
            <p className="text-5xl font-bold mb-4">{restTimeLeft}s</p>
            <button
              onClick={skipRest}
              className="bg-white text-orange-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Skip Rest
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4">
        {/* Current Exercise */}
        <div className="bg-gray-800 rounded-xl p-6 mb-4">
          <h2 className="text-3xl font-bold mb-2">{currentExercise?.exercise_details.name}</h2>
          <p className="text-gray-400">{currentExercise?.exercise_details.muscle_group}</p>
        </div>

        {/* Sets */}
        <div className="space-y-3 mb-6">
          {sets.map((set, index) => (
            <div
              key={index}
              className={`bg-gray-800 rounded-xl p-4 ${
                set.completed ? 'opacity-60 border-2 border-green-600' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-lg font-semibold">Set {set.set_number}</span>
                {set.completed && (
                  <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    ✓ Completed
                  </span>
                )}
              </div>

              {!set.completed ? (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Reps</label>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => updateSet(index, 'reps', parseInt(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-2xl text-center font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Weight (kg)</label>
                      <input
                        type="number"
                        value={set.weight}
                        onChange={(e) => updateSet(index, 'weight', parseFloat(e.target.value))}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-2xl text-center font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                        step="0.5"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => completeSet(index)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition flex items-center justify-center space-x-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>Complete Set</span>
                  </button>
                </>
              ) : (
                <div className="text-center text-gray-400">
                  {set.reps} reps × {set.weight} kg
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Set Button */}
        {allSetsCompleted && (
          <button
            onClick={addSet}
            className="w-full bg-gray-800 hover:bg-gray-700 border-2 border-dashed border-gray-600 text-gray-400 py-4 rounded-xl font-semibold transition flex items-center justify-center space-x-2 mb-6"
          >
            <Plus className="w-5 h-5" />
            <span>Add Another Set</span>
          </button>
        )}

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={previousExercise}
            disabled={currentExerciseIndex === 0}
            className="bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition"
          >
            ← Previous Exercise
          </button>
          <button
            onClick={nextExercise}
            disabled={currentExerciseIndex === exercises.length - 1}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-30 disabled:cursor-not-allowed py-4 rounded-xl font-semibold transition"
          >
            Next Exercise →
          </button>
        </div>
      </div>
    </div>
  );
};