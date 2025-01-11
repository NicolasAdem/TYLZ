"use client";

import SuccessAnimation from '../components/SuccessAnimation';
import React, { useState } from 'react';
import Footer from '../components/Footer';

export default function Auth() {

  const [isLogin, setIsLogin] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
      // In your Auth.tsx component, update the fetch calls to include the full URL:
      const endpoint = isLogin 
        ? 'http://localhost:3001/api/auth/login' 
        : 'http://localhost:3001/api/auth/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Something went wrong');
      
      setSuccessMessage('success');
      localStorage.setItem('token', result.token);
      setTimeout(() => window.location.href = '/dashboard', 2000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="pt-20 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
              <button 
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2 rounded-lg transition-all duration-200 text-sm font-semibold ${
                  isLogin ? 'bg-blue-600 text-white' : 'text-gray-700'
                }`}>
                Log In
              </button>
              <button 
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2 rounded-lg transition-all duration-200 text-sm font-semibold ${
                  !isLogin ? 'bg-blue-600 text-white' : 'text-gray-700'
                }`}>
                Sign Up
              </button>
            </div>

            {isLogin ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="login-email" className="block text-sm font-medium text-gray-800 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="login-email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-black"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="login-password" className="block text-sm font-medium text-gray-800 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="login-password"
                    name="password"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-black"
                    placeholder="••••••••"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-600 text-black" />
                    <span className="ml-2 text-sm text-gray-700">Remember me</span>
                  </label>
                  <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800">
                    Forgot password?
                  </a>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Log In
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="signup-name" className="block text-sm font-medium text-gray-800 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="signup-name"
                    name="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-black"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-800 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="signup-email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-black"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-800 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="signup-password"
                    name="password"
                    required
                    pattern="^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent text-black"
                    placeholder="••••••••"
                  />
                  <p className="mt-1 text-sm text-gray-600">Must be at least 8 characters with letters and numbers</p>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors">
                  Sign Up
                </button>
              </form>
            )}

            {isProcessing && (
              <div className="mt-4 p-4 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </div>
            )}

              {successMessage && (
                <div className="mt-4">
                  <SuccessAnimation isLogin={isLogin} />
                </div>
              )}

            {errorMessage && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                {errorMessage}
              </div>
            )}
          </div>

          <div className="mt-8 text-center text-sm text-gray-700">
            <p>By continuing, you agree to our</p>
            <div className="space-x-4 mt-2">
              <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
              <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a>
            </div>
          </div>
        </div>
      </main>
      <Footer></Footer>
    </div>
  );
}