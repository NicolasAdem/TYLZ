"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, ChevronLeft, Sun, Moon } from 'lucide-react';
import { BackgroundGradient } from '../components/ui/BackgroundGradient';
import { TextReveal } from '../components/ui/TextReveal';
import SuccessAnimation from '../components/SuccessAnimation';
import { Footer } from '../components/Footer';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

export default function ForgotPassword() {
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
    const email = formData.get('email');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email })
      });
  
      let result;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        throw new Error('Server returned non-JSON response');
      }
  
      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }
      
      setSuccessMessage('Verification code sent! Redirecting...');
      setTimeout(() => {
        window.location.href = `/reset-password-verify?email=${encodeURIComponent(email as string)}`;
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error 
          ? error.message 
          : 'Server error. Please try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };
    
  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-white'}`}>
      <MouseSpotlight />
      
      {/* Navigation Bar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isDarkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-md shadow-sm`}
      >
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
        {/* Background Gradients */}
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

<div className="w-full max-w-md flex flex-col items-center">
        <Link 
            href="/account"
            className={`inline-flex items-center gap-2 mb-6 text-sm ${
            isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
            } transition-colors group`}
        >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to login
        </Link>
        </div>

    <div className="flex flex-col items-center">
        <div className="max-w-md w-full">
        <TextReveal>
            <h1 className={`text-4xl font-bold text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            Reset Password
            </h1>
        </TextReveal>
        
            <BackgroundGradient>
              <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 space-y-8`}>
                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Enter your email address and we'll send you instructions to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="relative">
                    <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
                      isDarkMode ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      Email Address
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
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

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
                    {isProcessing ? 'Sending...' : 'Send Reset Instructions'}
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </form>

                {isProcessing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`mt-4 p-4 ${
                      isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'
                    } text-blue-600 rounded-lg flex items-center justify-center`}
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
                    className={`mt-4 p-4 ${
                      isDarkMode ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'
                    } rounded-lg`}
                  >
                    {successMessage}
                  </motion.div>
                )}

                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 ${
                      isDarkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700'
                    } rounded-lg`}
                  >
                    {errorMessage}
                  </motion.div>
                )}
              </div>
            </BackgroundGradient>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}