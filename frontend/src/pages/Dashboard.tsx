import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Dumbbell, 
  TrendingUp, 
  Target, 
  Users,
  Calendar,
  Flame,
  Clock,
  ChevronRight
} from 'lucide-react';
import { getSessions } from '../services/workoutService';

export const Dashboard = () => {
  const { user } = useAuth();
  const [recentWorkouts, setRecentWorkouts] = useState<any[]>([]);

  useEffect(() => {
    loadRecentWorkouts();
  }, []);

  const loadRecentWorkouts = async () => {
    try {
      const data = await getSessions({ is_completed: true });
      setRecentWorkouts(data.slice(0, 3)); // Get last 3 workouts
    } catch (error) {
      console.error('Failed to load recent workouts:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const stats = [
    {
      label: 'Total Workouts',
      value: user?.stats?.total_workouts || 0,
      icon: Dumbbell,
      color: 'bg-blue-500',
    },
    {
      label: 'Current Streak',
      value: `${user?.stats?.current_streak || 0} days`,
      icon: Flame,
      color: 'bg-orange-500',
    },
    {
      label: 'Total Volume',
      value: `${user?.stats?.total_volume || 0} kg`,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      label: 'Followers',
      value: user?.stats?.followers_count || 0,
      icon: Users,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                Welcome back, {user?.first_name || user?.username}! 👋
              </h2>
              <p className="text-blue-100">
                Goal: {user?.fitness_goal?.replace('_', ' ').toUpperCase()}
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                <Calendar className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/workouts"
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <Dumbbell className="w-6 h-6 text-blue-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">My Workouts</p>
                <p className="text-sm text-gray-600">View your routines</p>
              </div>
            </a>
            
            <a
              href="/workouts/create"
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition"
            >
              <Target className="w-6 h-6 text-green-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Create Routine</p>
                <p className="text-sm text-gray-600">Build a new workout</p>
              </div>
            </a>
            
            <a
              href="/progress"
              className="flex items-center space-x-3 p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition"
            >
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <div className="text-left">
                <p className="font-semibold text-gray-900">Progress</p>
                <p className="text-sm text-gray-600">Track your gains</p>
              </div>
            </a>
          </div>
        </div>

        {/* User Profile Info */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Profile Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-semibold text-gray-900">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Username</p>
              <p className="font-semibold text-gray-900">@{user?.username}</p>
            </div>
            {user?.height && (
              <div>
                <p className="text-sm text-gray-600">Height</p>
                <p className="font-semibold text-gray-900">{user.height} cm</p>
              </div>
            )}
            {user?.weight && (
              <div>
                <p className="text-sm text-gray-600">Weight</p>
                <p className="font-semibold text-gray-900">{user.weight} kg</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};