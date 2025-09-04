import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { RegisterCredentials } from '../types';
import { authApi } from '../services/api';

const Register: React.FC = () => {
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterCredentials>>({});
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name as keyof RegisterCredentials]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterCredentials> = {};

    if (!credentials.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (credentials.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!credentials.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (credentials.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!credentials.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (credentials.password !== credentials.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: Implement actual registration logic
      console.log('Registration attempt:', credentials);
      
      // Simulate API call
      const response = await authApi.register({
        username: credentials.username,
        password: credentials.password,
        confirmPassword: credentials.confirmPassword,
      });

      console.log('Registration successful:', response);
      
      // For demo purposes, accept registration
      navigate('/login', { 
        state: { message: 'Registration successful! Please sign in.' }
      });
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-white/80">Join us and start your quiz adventure</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="input-field"
              placeholder="Choose a username"
              value={credentials.username}
              onChange={handleInputChange}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-300">{errors.username}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input-field"
              placeholder="Create a password"
              value={credentials.password}
              onChange={handleInputChange}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-300">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="input-field"
              placeholder="Confirm your password"
              value={credentials.confirmPassword}
              onChange={handleInputChange}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-300">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/80">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-300 hover:text-purple-200 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;