import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
}

export const AnimatedCounter = ({ value, duration = 2000 }: AnimatedCounterProps) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<number>(0);

  useEffect(() => {
    const startTime = Date.now();
    
    const updateCounter = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      counterRef.current = Math.floor(progress * value);
      setCount(counterRef.current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
};