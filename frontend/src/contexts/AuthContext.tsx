import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  full_name: string;
  bio: string;
  profile_picture: string | null;
  fitness_goal: string;
  height: number | null;
  weight: number | null;
  age: number | null;
  stats?: {
    total_workouts: number;
    current_streak: number;
    longest_streak: number;
    total_volume: number;
    followers_count: number;
    following_count: number;
  };
}

interface AuthTokens {
  access: string;
  refresh: string;
}

interface AuthContextType {
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

interface RegisterData {
  email: string;
  username: string;
  password: string;
  password_confirm: string;
  first_name?: string;
  last_name?: string;
  fitness_goal?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to set auth header
const setAuthHeader = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile
  const loadUser = async (token: string) => {
    try {
      setAuthHeader(token);
      const response = await axios.get(`${API_URL}/users/profile/`);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Initialize - Check for existing tokens
  useEffect(() => {
    const initAuth = () => {
      const storedTokens = localStorage.getItem('tokens');
      
      if (storedTokens && storedTokens !== 'undefined') {
        try {
          const parsedTokens = JSON.parse(storedTokens);
          console.log('Found stored tokens, loading user...');
          setTokens(parsedTokens);
          loadUser(parsedTokens.access);
        } catch (error) {
          console.error('Failed to parse stored tokens:', error);
          localStorage.removeItem('tokens');
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login...');
      const response = await axios.post(`${API_URL}/users/auth/login/`, {
        email,
        password,
      });

      console.log('Login response:', response.data);

      const { user: userData, tokens: tokenData } = response.data;

      if (!userData || !tokenData) {
        throw new Error('Invalid response format from server');
      }

      // Save to state
      setUser(userData);
      setTokens(tokenData);
      
      // Save to localStorage
      localStorage.setItem('tokens', JSON.stringify(tokenData));
      console.log('Tokens saved to localStorage');
      
      // Set axios header
      setAuthHeader(tokenData.access);
      
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.error('Login error:', error.response?.data);
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };

  // Register function
  const register = async (data: RegisterData) => {
    try {
      const response = await axios.post(`${API_URL}/users/auth/register/`, data);
      const { user: userData, tokens: tokenData } = response.data;

      setUser(userData);
      setTokens(tokenData);
      localStorage.setItem('tokens', JSON.stringify(tokenData));
      setAuthHeader(tokenData.access);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      const errorMessage = error.response?.data?.email?.[0] || 
                          error.response?.data?.username?.[0] ||
                          error.response?.data?.password?.[0] ||
                          'Registration failed';
      throw new Error(errorMessage);
    }
  };

  // Logout function
  const logout = () => {
    console.log('Logging out...');
    setUser(null);
    setTokens(null);
    localStorage.removeItem('tokens');
    setAuthHeader(null);
  };

  // Update user function
  const updateUser = (userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  };

  const value = {
    user,
    tokens,
    loading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};