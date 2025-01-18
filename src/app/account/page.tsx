"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, UserCircle, Sun, Moon } from 'lucide-react';
import { BackgroundGradient } from '../components/ui/BackgroundGradient';
import { TextReveal } from '../components/ui/TextReveal';
import SuccessAnimation from '../components/SuccessAnimation';
import { Footer } from '../components/Footer';
import Link from 'next/link';

const MouseSpotlight = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleMouseMove = (e: MouseEvent) => {
      setIsVisible(true);
      clearTimeout(timeoutId);
      
      const rect = document.body.getBoundingClientRect();
      setPosition({ 
        x: e.clientX - rect.left,
        y: e.clientY - rect.top 
      });

      timeoutId = setTimeout(() => setIsVisible(false), 100);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(29,78,216,.15), transparent 80%)`,
      }}
    />
  );
};

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    
    try {
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
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <MouseSpotlight />
      
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md shadow-sm`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg"
              />
              <TextReveal>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tylz.AI
                </span>
              </TextReveal>
            </Link>
            
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-16 min-h-screen flex flex-col relative overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{ 
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.1, 1],
            x: [0, 20, 0],
            y: [0, -30, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{ 
            opacity: [0.4, 0.6, 0.4],
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
            y: [0, 20, 0]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />

        <div className="container mx-auto px-6 flex-grow">
          <div className="max-w-md mx-auto">
            <TextReveal>
              <h1 className={`text-4xl font-bold text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h1>
            </TextReveal>

            <BackgroundGradient>
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 space-y-8`}>
                <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                  <motion.button 
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-3 rounded-lg transition-all duration-200 text-sm font-semibold ${
                      isLogin ? 'bg-blue-600 text-white' : 'text-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Log In
                  </motion.button>
                  <motion.button 
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-3 rounded-lg transition-all duration-200 text-sm font-semibold ${
                      !isLogin ? 'bg-blue-600 text-white' : 'text-gray-700'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign Up
                  </motion.button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div className="relative">
                      <label htmlFor="signup-name" className={`block text-sm font-medium mb-2 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        Full Name
                      </label>
                      <div className="relative">
                        <UserCircle className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        } w-6 h-6`} />
                        <input
                          type="text"
                          id="signup-name"
                          name="name"
                          required
                          className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
                            isDarkMode 
                              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                          }`}
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                  )}

                  <div className="relative">
                    <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Email
                    </label>
                    <div className="relative">
                      <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } w-6 h-6`} />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label htmlFor="password" className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Password
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } w-6 h-6`} />
                      <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        pattern={!isLogin ? "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$" : undefined}
                        className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-colors ${
                          isDarkMode 
                            ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="••••••••"
                      />
                    </div>
                    {!isLogin && (
                      <p className={`mt-2 text-sm ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        Must be at least 8 characters with letters and numbers
                      </p>
                    )}
                  </div>

                  {isLogin && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input 
                          type="checkbox" 
                          className={`rounded border focus:ring-2 focus:ring-offset-2 transition-colors ${
                            isDarkMode 
                              ? 'border-gray-600 bg-gray-700 text-blue-600 focus:ring-offset-gray-900' 
                              : 'border-gray-300 bg-white text-blue-600 focus:ring-offset-white'
                          }`} 
                        />
                        <span className={`ml-2 text-sm ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          Remember me
                        </span>
                      </label>
                      <Link 
                        href="/forgot-password" 
                        className={`text-sm text-blue-600 hover:text-blue-500 transition-colors ${
                          isDarkMode ? 'text-blue-500 hover:text-blue-400' : 'text-blue-600 hover:text-blue-700'
                        }`}
                      >
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      isDarkMode 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isProcessing}
                  >
                    {isLogin ? 'Log In' : 'Sign Up'}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </form>

                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-4 bg-blue-100 text-blue-700 rounded-lg flex items-center justify-center"
                  >
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </motion.div>
                )}

                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <SuccessAnimation isLogin={isLogin} />
                  </motion.div>
                )}

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg"
                  >
                    {errorMessage}
                  </motion.div>
                )}
              </div>
            </BackgroundGradient>

            <div className={`mt-8 text-center text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-700'}`}>
              <p>By continuing, you agree to our</p>
              <div className="space-x-4 mt-2">
                <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
                <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}