import { useState, useCallback } from 'react';

export const useSound = (soundPath: string): (() => void) => {
  const [audio] = useState<HTMLAudioElement>(() => {
    if (typeof window !== 'undefined') {
      return new Audio(soundPath);
    }
    // Return a dummy audio element for SSR
    return new Audio();
  });

  const play = useCallback(() => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(e => console.log('Error playing sound:', e));
    }
  }, [audio]);

  return play;
};