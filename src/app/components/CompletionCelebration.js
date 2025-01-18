import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Trophy, X } from 'lucide-react';

const CompletionCelebration = ({ onDeleteProject, show, onKeepProject }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    let timer;
    
    if (show) {
      setShowConfetti(false);
      setShowMessage(false);
      
      setShowConfetti(true);
      timer = setTimeout(() => setShowMessage(true), 1000);
  
      // Create and play the sound
      const playSound = async () => {
        const audio = new Audio('/completedsound.mp3');
        audio.volume = 0.3;
        
        try {
          // Need to wait for user interaction due to browser policies
          await audio.play();
        } catch (error) {
          console.log('Audio playback failed:', error);
        }
      };
  
      playSound();
    }
  
    return () => {
      if (timer) clearTimeout(timer);
      setShowConfetti(false);
      setShowMessage(false);
    };
  }, [show]);
  
  // Increased number of confetti particles significantly
  const confetti = Array.from({ length: 300 }).map((_, i) => ({
    id: i,
    // Distribute evenly across the entire window width
    x: (i / 300) * window.innerWidth,  // This ensures even distribution
    y: -20, // Start slightly above screen
    rotation: Math.random() * 360,
    size: 6 + Math.random() * 12,
    color: [
      '#FFD700', // Gold
      '#FF69B4', // Hot Pink
      '#00CED1', // Turquoise
      '#FF6347', // Tomato
      '#98FB98', // Pale Green
      '#DDA0DD', // Plum
      '#87CEEB', // Sky Blue
      '#FFA500', // Orange
      '#9370DB', // Medium Purple
      '#20B2AA', // Light Sea Green
      '#FF4500', // Orange Red
      '#7FFFD4', // Aquamarine
      '#FF1493', // Deep Pink
      '#00FF00'  // Lime
    ][Math.floor(Math.random() * 14)]
  }));
  

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Light/Dark mode aware overlay with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 dark:bg-gray-900 bg-gray-100 backdrop-blur-sm"
          />

          {/* Confetti with absolute positioning */}
          {showConfetti && confetti.map(particle => (
          <motion.div
            key={particle.id}
            initial={{ 
              x: particle.x,
              y: -50,
              rotate: 0,
              scale: 0,
              position: 'fixed'
            }}
            animate={{ 
              x: particle.x,
              y: window.innerHeight + 50,  // Ensure it goes beyond bottom of screen
              rotate: particle.rotation * 2,
              scale: 1
            }}
            transition={{ 
              duration: 2.5 + Math.random() * 2.5,
              ease: "easeOut",
              delay: Math.random() * 0.7
            }}
            className="absolute rounded-full"
            style={{
              backgroundColor: particle.color,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              boxShadow: `0 0 10px ${particle.color}40`,
              top: 0,
              left: 0,
              position: 'fixed'
            }}
          />
        ))}

          {/* Completion Dialog */}
          {showMessage && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ delay: 0.5, type: "spring", bounce: 0.4 }}
              className="relative z-10 max-w-lg w-full mx-4"
            >
              <div className="bg-white dark:bg-gray-900/95 border border-gray-200 dark:border-gray-700/50 shadow-2xl rounded-2xl p-8 backdrop-blur-xl">
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    <Trophy className="w-16 h-16 text-yellow-400 mb-4" />
                  </motion.div>
                  
                  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 mb-3 text-center">
                    Project Complete! 🎉
                  </h2>
                  
                  <p className="text-gray-700 dark:text-gray-300 text-lg text-center mb-8">
                    Fantastic work! All tasks have been successfully completed.
                    What would you like to do with this project?
                  </p>
                  
                  <div className="flex flex-col sm:flex-row w-full gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onDeleteProject}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-xl transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-red-500/20"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete Project
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onKeepProject}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 text-white rounded-xl transition-all duration-200 text-lg font-semibold shadow-lg hover:shadow-emerald-500/20"
                    >
                      <X className="w-5 h-5" />
                      Keep Project
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </AnimatePresence>
  );
};

export default CompletionCelebration;