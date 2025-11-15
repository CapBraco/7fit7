import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Workouts } from './pages/Workouts';
import { CreateRoutine } from './pages/CreateRoutine';
import { ActiveWorkout } from './pages/ActiveWorkout';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes with Navbar */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/workouts" element={<Workouts />} />
                    <Route path="/workouts/create" element={<CreateRoutine />} />
                    <Route path="/workouts/active/:routineId" element={<ActiveWorkout />} />
                    <Route path="/history" element={<div className="p-8 text-center">History - Coming Soon!</div>} />
                    <Route path="/progress" element={<div className="p-8 text-center">Progress - Coming Soon!</div>} />
                    <Route path="/profile" element={<div className="p-8 text-center">Profile - Coming Soon!</div>} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </>
              </ProtectedRoute>
            }
          />
          
          {/* 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;