"use client";

import React, { useState, useEffect, useMemo } from 'react';

const EnhancedTypewriterLoader = () => {
  // Messages array remains the same
  const messages = useMemo(() => [
    // All previous messages remain the same...
    // Project Progress Messages
    "Unraveling your project's secrets, one clever clue at a time...",
    "Turning big dreams into clear, step-by-step plans...",
    "Orchestrating the perfect symphony of code and creativity...",
    "Weaving together the threads of innovation...",
    "Building bridges between ideas and implementation...",
    
    // Technical Process Messages
    "Optimizing algorithms for maximum efficiency...",
    "Debugging the matrix, one line at a time...",
    "Compiling brilliance into executable solutions...",
    "Refactoring the fabric of possibility...",
    "Calculating quantum probabilities of success...",
    
    // Data-Related Messages
    "Mining through mountains of data for golden insights...",
    "Transforming raw data into actionable wisdom...",
    "Discovering patterns in the digital cosmos...",
    "Connecting dots across the data landscape...",
    "Decoding the secrets hidden in your data...",
    
    // AI-Focused Messages
    "Training neural networks to think outside the box...",
    "Teaching machines to dream in algorithms...",
    "Evolving artificial intelligence to new heights...",
    "Merging human intuition with machine precision...",
    "Crafting AI solutions that feel like magic...",
    
    // Innovation Messages
    "Pushing the boundaries of what's possible...",
    "Breaking through conventional limitations...",
    "Innovating at the speed of thought...",
    "Creating tomorrow's solutions today...",
    "Pioneering new frontiers in technology...",
    
    // Future-Oriented Messages
    "Building bridges to the future of technology...",
    "Shaping tomorrow's technological landscape...",
    "Preparing for the next wave of innovation...",
    "Future-proofing your digital presence...",
    "Setting the stage for what comes next...",
    
    // Optimization Messages
    "Fine-tuning performance to perfection...",
    "Streamlining processes for maximum impact...",
    "Optimizing every byte and pixel...",
    "Enhancing efficiency across all systems...",
    "Polishing until everything shines...",
    
    // Creative Messages
    "Painting with pixels and programming logic...",
    "Sculpting solutions from raw possibility...",
    "Composing digital symphonies of success...",
    "Crafting experiences that inspire wonder...",
    "Designing moments of digital delight...",
    
    // Success Messages
    "Turning challenges into opportunities...",
    "Converting obstacles into stepping stones...",
    "Transforming complexity into clarity...",
    "Making the impossible seem routine...",
    "Achieving new heights of excellence...",
    
    // Engagement Messages
    "Engaging users with intuitive design...",
    "Creating connections that matter...",
    "Building bridges between ideas...",
    "Fostering meaningful interactions...",
    "Cultivating digital relationships...",
    
    // Final Polish Messages
    "Adding those finishing touches...",
    "Polishing every pixel to perfection...",
    "Making sure everything is just right...",
    "Applying the final layer of magic...",
    "Getting ready for the big reveal..."
  ], []);

  const [currentMessage, setCurrentMessage] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [hue, setHue] = useState(0);
  const [usedIndices, setUsedIndices] = useState(new Set());

  // Get random message index ensuring no immediate repeats
  const getNextMessageIndex = () => {
    let availableIndices = Array.from(
      { length: messages.length },
      (_, i) => i
    ).filter(i => !usedIndices.has(i));

    if (availableIndices.length === 0) {
      setUsedIndices(new Set());
      availableIndices = Array.from({ length: messages.length }, (_, i) => i);
    }

    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    setUsedIndices(prev => new Set([...prev, randomIndex]));
    return randomIndex;
  };

  // Color transition effect
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setHue(prevHue => (prevHue + 1) % 360);
    }, 50);
    return () => clearInterval(colorInterval);
  }, []);

  // Message typing effect
  useEffect(() => {
    if (charIndex < messages[messageIndex].length) {
      const typingTimer = setTimeout(() => {
        setCurrentMessage(prev => prev + messages[messageIndex][charIndex]);
        setCharIndex(prev => prev + 1);
      }, 50);

      return () => clearTimeout(typingTimer);
    } else {
      const nextMessageTimer = setTimeout(() => {
        setCurrentMessage('');
        setCharIndex(0);
        setMessageIndex(getNextMessageIndex());
      }, 2000);

      return () => clearTimeout(nextMessageTimer);
    }
  }, [charIndex, messageIndex, messages]);

  const dynamicStyles = {
    color: `hsl(${hue}, 70%, 50%)`,
    textShadow: `0 0 10px hsla(${hue}, 70%, 50%, 0.3)`,
  };

  const spinnerStyles = {
    outer: {
      borderColor: `hsla(${hue}, 70%, 50%, 0.2)`,
      borderTopColor: `hsl(${hue}, 70%, 50%)`,
    },
    inner: {
      borderColor: `hsla(${(hue + 60) % 360}, 70%, 50%, 0.2)`,
      borderTopColor: `hsl(${(hue + 60) % 360}, 70%, 50%)`,
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
      <div className="max-w-3xl px-8 py-12 text-center relative">
        {/* Loader circles container */}
        <div className="relative w-20 h-20 mx-auto mb-8">
          {/* Outer circle */}
          <div 
            className="absolute inset-0 border-4 rounded-full animate-spin"
            style={{
              ...spinnerStyles.outer,
              animationDuration: '3s'
            }}
          />
          {/* Inner circle - centered and fixed in position */}
          <div 
            className="absolute border-4 rounded-full animate-spin"
            style={{
              ...spinnerStyles.inner,
              animationDuration: '1.5s',
              width: '60%',
              height: '60%',
              top: '20%',
              left: '20%'
            }}
          />
        </div>
        
        <p className="text-4xl font-bold leading-relaxed font-mono transition-colors duration-300"
           style={dynamicStyles}>
          {currentMessage}
          <span className="animate-pulse ml-1">|</span>
        </p>
      </div>
    </div>
  );
};

export default EnhancedTypewriterLoader;