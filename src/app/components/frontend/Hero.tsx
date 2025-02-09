import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Sparkles } from 'lucide-react';
import { BackgroundGradient } from '../ui/BackgroundGradient';
import { AnimatedCounter } from '../ui/AnimatedCounter';
import { RotatingText } from '../ui/RotatingText';
// Enhanced MouseSpotlight Component
const MouseSpotlight = () => {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
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

// Feature Tag Component
const FeatureTag = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div 
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Sparkles className="w-4 h-4 text-blue-600" />
      <span className="text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        {children}
      </span>
    </motion.div>
  );
};

// Stats Card Component
const StatsCard = ({ label, value, suffix = "+" }: { label: string; value: number; suffix?: string }) => {
  return (
    <motion.div
      className="relative group"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400 }}
    >
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"
      />
      <div className="relative bg-white rounded-lg p-4 flex flex-col items-center">
        <motion.span 
          className="text-3xl font-bold text-gray-900 mb-1 flex items-center gap-1"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <AnimatedCounter value={value} />
          {suffix}
        </motion.span>
        <span className="text-sm text-gray-600">{label}</span>
      </div>
    </motion.div>
  );
};

export const Hero = () => {
  return (
    <section className="pt-32 pb-16 relative overflow-hidden">
      <MouseSpotlight />
      
      {/* Animated Background Gradients */}
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

      <div className="container mx-auto px-6 relative">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <FeatureTag>New: Multi-Modal AI Processing</FeatureTag>
            
            <motion.h1 
                className="text-6xl font-bold leading-tight mt-6 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
            <span className="block text-gray-800">Transform</span>
            <RotatingText />
             <span className="block text-gray-500">into Actionable Progress</span>
            </motion.h1>

            <motion.p 
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Tylz.AI uses advanced AI to automatically convert your team's conversations into structured workflows and actionable tasks. Save hours on meeting follow-ups and never miss important action items again.
            </motion.p>

            <div className="flex flex-wrap gap-4 mb-12">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium hover:shadow-lg transition-all flex items-center gap-2 group"
              >
                Start Free Trial
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-full font-medium hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                Watch Demo
                <Play className="w-5 h-5" />
              </motion.button>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <StatsCard label="Active Users" value={10000} />
              <StatsCard label="Tasks Created" value={500000} />
              <StatsCard label="Time Saved" value={25000} suffix="h" />
            </div>
          </div>

          {/* Right side hero visualization */}
          <div className="md:w-1/2">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <BackgroundGradient>
                <div className="relative bg-white rounded-xl shadow-2xl p-2">
                  {/* Window Header */}
                  <div className="flex items-center gap-2 p-3 border-b border-gray-100">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                  </div>
                  
                  <img
                    src="/api/placeholder/800/600"
                    alt="AI-driven workflows"
                    className="rounded-lg"
                  />
                  
                  {/* Floating Cards */}
                  <motion.div
                    initial={{ opacity: 0, y: 20, x: 20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -right-8 top-8 bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
                    whileHover={{ scale: 1.05, rotate: 2 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-5 h-5 text-blue-600"
                        >
                          ⚙️
                        </motion.div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">AI Analysis</div>
                        <div className="text-xs text-gray-500">
                          <motion.span
                            animate={{ opacity: [1, 0.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            Processing...
                          </motion.span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: -20, x: -20 }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="absolute -left-8 bottom-8 bg-white rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-shadow"
                    whileHover={{ scale: 1.05, rotate: -2 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-5 h-5 text-green-600"
                        >
                          ✓
                        </motion.div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Task Created</div>
                        <div className="text-xs text-gray-500">Just now</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </BackgroundGradient>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};