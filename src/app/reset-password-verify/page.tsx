import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Lock, KeyRound, ChevronLeft, Sun, Moon } from 'lucide-react';
import { BackgroundGradient } from '../components/ui/BackgroundGradient';
import { TextReveal } from '../components/ui/TextReveal';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { ResetPasswordFormData, ApiResponse } from '../components/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const ResetPasswordVerify = () => {
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const email = searchParams.get('email');
    if (email) {
      setFormData(prev => ({ ...prev, email }));
    }
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDark);
  }, [searchParams]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const validateForm = () => {
    if (!formData.email) {
      setErrorMessage('Email is required');
      return false;
    }
    if (!formData.code || formData.code.length !== 6) {
      setErrorMessage('Please enter the 6-digit verification code');
      return false;
    }
    if (formData.newPassword.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    
    setIsProcessing(true);
    setErrorMessage('');
    setSuccessMessage('');
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          code: formData.code,
          newPassword: formData.newPassword
        })
      });
  
      let result;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        result = await response.json();
      } else {
        throw new Error('Server returned non-JSON response');
      }
  
      if (!response.ok) {
        throw new Error(result.error || 'Failed to reset password');
      }
  
      setSuccessMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/account';
      }, 2000);
  
    } catch (error) {
      console.error('Reset password error:', error);
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

      <main className="pt-32 pb-16 min-h-screen flex flex-col items-center relative overflow-hidden">
        {/* Back to Login Link */}
        <div className="w-full max-w-md mb-8">
          <Link 
            href="/account"
            className={`inline-flex items-center gap-2 text-sm ${
              isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'
            } transition-colors group`}
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to login
          </Link>
        </div>

        <div className="w-full max-w-md">
          <TextReveal>
            <h1 className={`text-4xl font-bold text-center mb-8 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              Reset Your Password
            </h1>
          </TextReveal>

          <BackgroundGradient>
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-8 space-y-6`}>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Verification Code
                  </label>
                  <div className="relative">
                    <KeyRound className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    } w-5 h-5`} />
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    } w-5 h-5`} />
                    <input
                      type="password"
                      value={formData.newPassword}
                      onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Enter new password"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    } w-5 h-5`} />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      placeholder="Confirm new password"
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
                  {isProcessing ? 'Processing...' : 'Reset Password'}
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </form>

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 ${
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
                  className={`p-4 ${
                    isDarkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-700'
                  } rounded-lg`}
                >
                  {errorMessage}
                </motion.div>
              )}
            </div>
          </BackgroundGradient>
        </div>
      </main>
    </div>
  );
};

export default ResetPasswordVerify;