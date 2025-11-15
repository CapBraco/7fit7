import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ============= EXERCISES =============

export const getExercises = async (params?: {
  category?: string;
  muscle_group?: string;
  equipment?: string;
  search?: string;
}) => {
  const response = await axios.get(`${API_URL}/workouts/exercises/`, { params });
  return response.data;
};

export const getExercise = async (id: number) => {
  const response = await axios.get(`${API_URL}/workouts/exercises/${id}/`);
  return response.data;
};

export const createExercise = async (data: any) => {
  const response = await axios.post(`${API_URL}/workouts/exercises/`, data);
  return response.data;
};

// ============= WORKOUT ROUTINES =============

export const getRoutines = async (params?: {
  my_routines?: boolean;
  public?: boolean;
  search?: string;
}) => {
  const response = await axios.get(`${API_URL}/workouts/routines/`, { params });
  return response.data;
};

export const getRoutine = async (id: number) => {
  const response = await axios.get(`${API_URL}/workouts/routines/${id}/`);
  return response.data;
};

export const createRoutine = async (data: any) => {
  const response = await axios.post(`${API_URL}/workouts/routines/`, data);
  return response.data;
};

export const updateRoutine = async (id: number, data: any) => {
  const response = await axios.put(`${API_URL}/workouts/routines/${id}/`, data);
  return response.data;
};

export const deleteRoutine = async (id: number) => {
  await axios.delete(`${API_URL}/workouts/routines/${id}/`);
};

export const likeRoutine = async (id: number) => {
  const response = await axios.post(`${API_URL}/workouts/routines/${id}/like/`);
  return response.data;
};

export const startWorkout = async (routineId: number) => {
  const response = await axios.post(`${API_URL}/workouts/routines/${routineId}/start/`);
  return response.data;
};

// ============= WORKOUT SESSIONS =============

export const getSessions = async (params?: {
  is_completed?: boolean;
  start_date?: string;
  end_date?: string;
}) => {
  const response = await axios.get(`${API_URL}/workouts/sessions/`, { params });
  return response.data;
};

export const getSession = async (id: number) => {
  const response = await axios.get(`${API_URL}/workouts/sessions/${id}/`);
  return response.data;
};

export const createSession = async (data: any) => {
  const response = await axios.post(`${API_URL}/workouts/sessions/`, data);
  return response.data;
};

export const updateSession = async (id: number, data: any) => {
  const response = await axios.put(`${API_URL}/workouts/sessions/${id}/`, data);
  return response.data;
};

export const completeSession = async (id: number) => {
  const response = await axios.post(`${API_URL}/workouts/sessions/${id}/complete/`);
  return response.data;
};

export const deleteSession = async (id: number) => {
  await axios.delete(`${API_URL}/workouts/sessions/${id}/`);
};

// ============= EXERCISE SETS =============

export const getSessionSets = async (sessionId: number) => {
  const response = await axios.get(`${API_URL}/workouts/sessions/${sessionId}/sets/`);
  return response.data;
};

export const createSet = async (sessionId: number, data: any) => {
  const payload = {
    ...data,
    session: sessionId
  };
  const response = await axios.post(`${API_URL}/workouts/sessions/${sessionId}/sets/`, payload);
  return response.data;
};

export const updateSet = async (id: number, data: any) => {
  const response = await axios.put(`${API_URL}/workouts/sets/${id}/`, data);
  return response.data;
};

export const deleteSet = async (id: number) => {
  await axios.delete(`${API_URL}/workouts/sets/${id}/`);
};

// ============= STATS =============

export const getWorkoutStats = async () => {
  const response = await axios.get(`${API_URL}/workouts/stats/`);
  return response.data;
};