import React, { useEffect, useState } from 'react';

const SuccessAnimation = ({ isLogin = true }) => {
  const [dots, setDots] = useState([]);
  const [showMessage, setShowMessage] = useState(false);

  const message = isLogin 
    ? "Welcome back! Taking you home..." 
    : "Welcome to the Tylz family! Taking you home...";

  useEffect(() => {
    const radius = 20;
    const totalDots = 6;
    const newDots = Array.from({ length: totalDots }).map((_, i) => ({
      id: i,
      angle: (i * 2 * Math.PI) / totalDots,
      delay: i * 0.15
    }));
    setDots(newDots);

    setTimeout(() => setShowMessage(true), 400);
  }, []);

  return (
    <div className="relative p-8 bg-green-50 rounded-lg overflow-hidden">
      <div className="flex justify-center mb-4">
        <div className="relative w-12 h-12">
          {dots.map((dot) => (
            <div
              key={dot.id}
              className="absolute w-2 h-2 bg-green-600 rounded-full"
              style={{
                left: `${50 + Math.cos(dot.angle) * 20}%`,
                top: `${50 + Math.sin(dot.angle) * 20}%`,
                animation: `spin 1.5s linear infinite, fade 1s ease-in-out infinite`,
                animationDelay: `${dot.delay}s`,
              }}
            />
          ))}
        </div>
      </div>
      
      <div className={`text-center transition-opacity duration-500 ${showMessage ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-green-700 text-lg font-medium">{message}</p>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.5);
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes fade {
          0%, 100% {
            opacity: 0.4;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default SuccessAnimation;