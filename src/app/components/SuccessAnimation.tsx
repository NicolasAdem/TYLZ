import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

interface SuccessAnimationProps {
  isLogin?: boolean;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ isLogin = true }) => {
  const [showContent, setShowContent] = useState(false);

  const message = isLogin 
    ? "Welcome back! Taking you to your dashboard..." 
    : "Welcome to Tylz.AI! Your journey begins now...";

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/50 dark:to-green-800/50 rounded-2xl p-6 overflow-hidden shadow-lg"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 0.2
        }}
        className="flex justify-center mb-4"
      >
        <CheckCircle 
          className="text-green-600 dark:text-green-400 w-16 h-16" 
          strokeWidth={1.5}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 10 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="text-center space-y-2"
      >
        <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">
          {isLogin ? 'Login Successful' : 'Account Created'}
        </h3>
        <p className="text-lg font-medium text-green-700 dark:text-green-300">
          {message}
        </p>
      </motion.div>

      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-200 to-green-300 dark:from-green-800 dark:to-green-900 opacity-10 blur-3xl" />
      </motion.div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, ease: "linear" }}
        className="absolute bottom-0 left-0 h-1 bg-green-500 dark:bg-green-600"
      />
    </motion.div>
  );
};

export default SuccessAnimation;