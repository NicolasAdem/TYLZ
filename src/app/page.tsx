'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useSpring, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Brain, 
  Rocket, 
  BarChart,
  X,
  Menu, 
  Shield, 
  Globe,
  Check, 
  Star,
  ArrowRight,
  Play
} from 'lucide-react';

// TextReveal Component
const TextReveal = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <motion.div
      initial={{ clipPath: "inset(0 100% 0 0)" }}
      whileInView={{ clipPath: "inset(0 0% 0 0)" }}
      transition={{ duration: 1, ease: "easeInOut" }}
      viewport={{ once: true }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// BackgroundGradient Component
const BackgroundGradient = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative group">
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-50 group-hover:opacity-100 transition duration-1000"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "mirror",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
};

// Enhanced MouseSpotlight
const MouseSpotlight = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.body.getBoundingClientRect();
      setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      setOpacity(1);
    };

    const handleMouseLeave = () => setOpacity(0);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(29,78,216,.15), transparent 80%)`,
        opacity,
      }}
    />
  );
};

// AnimatedCounter Component
const AnimatedCounter = ({ value }: { value: number }) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<number>(0);

  useEffect(() => {
    const duration = 2000;
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
  }, [value]);

  return <span>{count}</span>;
};
// Enhanced Tracing Beam
const TracingBeam = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end']
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const x = useSpring(scrollYProgress, springConfig);
  
  return (
    <>
      <motion.div
        ref={ref}
        className="fixed left-8 top-0 w-1 h-full bg-gradient-to-b from-blue-600 to-purple-600 origin-top"
        style={{ scaleY: x }}
      />
      <motion.div
        className="fixed left-8 w-4 h-4 rounded-full bg-blue-600 -ml-1.5"
        style={{ 
          top: useTransform(x, (v) => `calc(${v * 100}% - 8px)`),
          boxShadow: "0 0 20px 4px rgba(37, 99, 235, 0.3)"
        }}
      />
    </>
  );
};

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <MouseSpotlight />
      <TracingBeam />
      {/* Navigation */}
      <nav 
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
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
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
            </div>

            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="hidden md:block px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </motion.button>

              <BackgroundGradient>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="hidden md:block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Get Started
                </motion.button>
              </BackgroundGradient>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="py-4 space-y-4">
                  <a href="#features" className="block text-gray-600 hover:text-gray-900 transition-colors">Features</a>
                  <a href="#how-it-works" className="block text-gray-600 hover:text-gray-900 transition-colors">How it Works</a>
                  <a href="#pricing" className="block text-gray-600 hover:text-gray-900 transition-colors">Pricing</a>
                  <a href="#testimonials" className="block text-gray-600 hover:text-gray-900 transition-colors">Testimonials</a>
                  <BackgroundGradient>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      Get Started
                    </motion.button>
                  </BackgroundGradient>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            initial={{ opacity: 0.5 }}
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
            className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          />
          <motion.div
            initial={{ opacity: 0.5 }}
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
            className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          />
        </div>

        <div className="container mx-auto px-6 relative">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <TextReveal>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  {/* Enhanced Tag Badge */}
                  <motion.div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 mb-8"
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-75" />
                      <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse delay-150" />
                    </div>
                    <span className="text-sm text-blue-600 font-medium">
                      New: AI-Powered Automation
                    </span>
                  </motion.div>
                  
                  <h1 className="text-6xl font-bold leading-tight mb-6">
                    <motion.span 
                      className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto]"
                      animate={{ 
                        backgroundPosition: ['0%', '200%'],
                      }}
                      transition={{ 
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      From Conversations
                    </motion.span>
                    <motion.span 
                      className="text-gray-900"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      to Actions
                    </motion.span>
                  </h1>
                  <motion.p 
                    className="text-xl text-gray-600 mb-8 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    Harness the power of AI to transform your team's communication into
                    structured, actionable workflows.
                    <br />
                    <motion.span 
                      className="font-medium text-gray-900 relative inline-block"
                      whileHover={{ scale: 1.02 }}
                    >
                      Where your team meets AI-driven insights.
                      <motion.span 
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                      />
                    </motion.span>
                  </motion.p>

                  <div className="flex gap-4 flex-wrap">
                    <BackgroundGradient>
                      <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 15px 20px -5px rgb(0 0 0 / 0.1)" }}
                        whileTap={{ scale: 0.30 }}
                        className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        Get Started Free
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRight className="w-5 h-5" />
                        </motion.span>
                      </motion.button>
                    </BackgroundGradient>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full hover:bg-blue-50 transition-colors flex items-center gap-2"
                    >
                      Watch Demo
                      <Play className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/*
                  Stats section 
                  <div className="mt-12 grid grid-cols-3 gap-8">
                    {[
                      { label: "Active Users", value: 10000 },
                      { label: "Tasks Automated", value: 1000000 },
                      { label: "Time Saved", value: 1000 }
                    ].map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="text-center group"
                      >
                        <motion.div 
                          className="text-2xl font-bold text-gray-900"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <AnimatedCounter value={stat.value} />
                          {stat.label === "Time Saved" ? "h+" : "+"}
                        </motion.div>
                        <div className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  */}
                </motion.div>
              </TextReveal> 
              
              
            </div>
            {/* Right Side of Hero */}
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
                          <Brain className="w-5 h-5 text-blue-600" />
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
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <Rocket className="w-5 h-5 text-purple-600" />
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
      
      {/* Features Grid */}
      <section className="py-24 bg-white" id="features">
        <div className="container mx-auto px-6">
          <TextReveal>
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-bold text-gray-900 mb-4"
              >
                Powerful Features
              </motion.h2>
              <p className="text-xl text-gray-600">
                Everything you need to streamline your team's workflow
              </p>
            </div>
          </TextReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
                title: "Smart Conversations",
                description: "AI-powered chat analysis and task extraction with real-time insights and contextual understanding.",
                demo: "Transform meeting notes into actionable items"
              },
              {
                icon: <Brain className="w-6 h-6 text-purple-600" />,
                title: "Automated Workflows",
                description: "Convert discussions into actionable tasks instantly with intelligent prioritization and assignment.",
                demo: "Auto-assign tasks based on expertise"
              },
              {
                icon: <BarChart className="w-6 h-6 text-blue-600" />,
                title: "Real-time Analytics",
                description: "Track performance and identify patterns with advanced metrics and customizable dashboards.",
                demo: "Monitor team productivity trends"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative"
              >
                <BackgroundGradient>
                  <div className="p-8 rounded-2xl bg-white transition-all duration-300">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-12 h-12 bg-blue-50 rounded-xl shadow-sm flex items-center justify-center mb-6"
                    >
                      {feature.icon}
                    </motion.div>
                    <TextReveal>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {feature.title}
                      </h3>
                    </TextReveal>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    
                    <motion.div
                      className="flex items-center gap-2 text-sm text-blue-600"
                      whileHover={{ x: 10 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <span>{feature.demo}</span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </motion.div>
                  </div>
                </BackgroundGradient>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* How it Works Section */}
      <section className="py-24 bg-gray-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <TextReveal>
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  How It Works
                </h2>
                <p className="text-xl text-gray-600">
                  Transform conversations into actionable workflows in three simple steps
                </p>
              </motion.div>
            </div>
          </TextReveal>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <motion.div 
              className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 -translate-y-1/2"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 }}
            />
            
            {[
              {
                icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
                title: "1. Connect Your Conversations",
                description: "Integrate with your team's chat platforms and meetings"
              },
              {
                icon: <Brain className="w-8 h-8 text-purple-600" />,
                title: "2. AI Processing",
                description: "Our AI analyzes conversations and extracts actionable items"
              },
              {
                icon: <Rocket className="w-8 h-8 text-blue-600" />,
                title: "3. Automated Workflows",
                description: "Tasks are automatically created and assigned to team members"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative z-10"
              >
                <BackgroundGradient>
                  <motion.div
                    className="bg-white rounded-2xl p-8"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div 
                      className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-6"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {step.icon}
                    </motion.div>
                    <TextReveal>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {step.title}
                      </h3>
                    </TextReveal>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </motion.div>
                </BackgroundGradient>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative">
          <TextReveal>
            <div className="text-center mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl font-bold text-gray-900 mb-4"
              >
                Simple, Transparent Pricing
              </motion.h2>
              <p className="text-xl text-gray-600">Choose the perfect plan for your team</p>
            </div>
          </TextReveal>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                name: 'Starter',
                price: '$29',
                features: ['5 Team Members', 'Basic AI Analysis', '100 Tasks/month', 'Email Support'],
                highlighted: false
              },
              {
                name: 'Professional',
                price: '$99',
                features: ['Unlimited Team Members', 'Advanced AI Analysis', 'Unlimited Tasks', '24/7 Priority Support', 'Custom Workflows', 'API Access'],
                highlighted: true
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                features: ['Everything in Pro', 'Dedicated Account Manager', 'Custom Integration', 'SLA Guarantee', 'Advanced Analytics'],
                highlighted: false
              }
            ].map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <BackgroundGradient>
                  <div className={`rounded-2xl p-8 ${
                    plan.highlighted
                      ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                      : 'bg-white text-gray-900'
                  }`}>
                    <motion.div
                      whileHover={{ y: -5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className={`text-2xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                            {plan.name}
                          </h3>
                          <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold">{plan.price}</span>
                            {plan.price !== 'Custom' && <span className="text-lg mb-1">/month</span>}
                          </div>
                        </div>
                        {plan.highlighted && (
                          <motion.span 
                            className="px-3 py-1 text-sm bg-white/20 rounded-full"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            Popular
                          </motion.span>
                        )}
                      </div>

                      <ul className="space-y-4 mb-8">
                        {plan.features.map((feature, featureIndex) => (
                          <motion.li 
                            key={featureIndex} 
                            className="flex items-center gap-3"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: featureIndex * 0.1 }}
                          >
                            <Check className={`w-5 h-5 ${plan.highlighted ? 'text-white' : 'text-blue-600'}`} />
                            <span>{feature}</span>
                          </motion.li>
                        ))}
                      </ul>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full py-3 rounded-lg font-medium transition-colors ${
                          plan.highlighted
                            ? 'bg-white text-blue-600 hover:bg-gray-50'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        Get Started
                      </motion.button>
                    </motion.div>
                  </div>
                </BackgroundGradient>
              </motion.div>
            ))}
          </div>
          {/* Feature Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="px-6 py-4 bg-gray-50 border-b">
              <TextReveal>
                <h3 className="text-xl font-semibold text-gray-900">Feature Comparison</h3>
              </TextReveal>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Starter</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-600">Professional</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Team Members", starter: "5", pro: "Unlimited", enterprise: "Unlimited" },
                    { feature: "AI Analysis", starter: "Basic", pro: "Advanced", enterprise: "Custom" },
                    { feature: "API Access", starter: "−", pro: "✓", enterprise: "✓" },
                    { feature: "Custom Integration", starter: "−", pro: "✓", enterprise: "✓" },
                    { feature: "Analytics", starter: "Basic", pro: "Advanced", enterprise: "Custom" },
                    { feature: "Support", starter: "Email", pro: "24/7", enterprise: "Dedicated" }
                  ].map((row, index) => (
                    <motion.tr 
                      key={index} 
                      className="border-b"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">{row.feature}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{row.starter}</td>
                      <td className="px-6 py-4 text-center text-sm text-blue-600 font-medium">{row.pro}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">{row.enterprise}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <TextReveal>
            <div className="text-center mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Loved by Teams Worldwide
                </h2>
                <p className="text-xl text-gray-600">
                  See what our customers have to say
                </p>
              </motion.div>
            </div>
          </TextReveal>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Product Manager at TechCorp',
                image: '/api/placeholder/64/64',
                content: 'Tylz.AI has transformed how our team collaborates. The AI-powered task extraction has saved us countless hours in meetings.',
                rating: 5
              },
              {
                name: 'Michael Chen',
                role: 'CTO at StartupX',
                image: '/api/placeholder/64/64',
                content: 'The automated workflow creation is a game-changer. Our productivity has increased by 40% since implementing Tylz.AI.',
                rating: 5
              },
              {
                name: 'Emily Davis',
                role: 'Team Lead at InnovateCo',
                image: '/api/placeholder/64/64',
                content: 'Finally, an AI tool that actually delivers on its promises. The real-time analytics have helped us optimize our processes significantly.',
                rating: 5
              }
            ].map((testimonial, index) => (
              <BackgroundGradient key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="group relative"
                >
                  <motion.div
                    className="relative bg-white rounded-2xl p-8"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover ring-4 ring-white"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      "{testimonial.content}"
                    </p>
                  </motion.div>
                </motion.div>
              </BackgroundGradient>
            ))}
          </div>
        </div>
      </section>
      {/* Call-to-Action Section */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black opacity-10" />
          <motion.div 
            className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"
            animate={{
              backgroundPosition: ['0px 0px', '100px 100px'],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        </div>
        
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center text-white">
            <TextReveal>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold mb-6">
                  Ready to Transform Your Team's Workflow?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Join thousands of teams already using Tylz.AI to streamline their operations
                  and boost productivity.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-blue-600 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg group"
                  >
                    Start Free Trial
                    <motion.span
                      className="inline-block ml-2"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </motion.button>
                  <BackgroundGradient>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors"
                    >
                      Schedule Demo
                    </motion.button>
                  </BackgroundGradient>
                </div>
              </motion.div>
            </TextReveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Logo and Description */}
            <div className="col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 mb-6"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg" />
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tylz.AI
                </span>
              </motion.div>
              <p className="text-gray-400 mb-6 max-w-md">
                Transform your team's conversations into actionable workflows with the power of AI.
                Streamline operations and boost productivity.
              </p>
            </div>

            {/* Footer Links */}
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Security", "Roadmap", "What's New"]
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Blog", "Press", "Contact"]
              },
              {
                title: "Resources",
                links: ["Documentation", "Help Center", "API Reference", "Status", "Partners"]
              }
            ].map((column, index) => (
              <div key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="font-semibold mb-4">{column.title}</h3>
                  <ul className="space-y-3">
                    {column.links.map((link, linkIndex) => (
                      <motion.li
                        key={linkIndex}
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                          {link}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-400 text-sm">
                © {new Date().getFullYear()} Tylz.AI. All rights reserved.
              </div>
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
      