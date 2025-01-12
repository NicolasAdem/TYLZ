// components/CallToAction.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { BackgroundGradient } from './ui/BackgroundGradient';
import { TextReveal } from './ui/TextReveal';

export const CallToAction = () => {
  return (
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
              
              {/* Animated Benefits List */}
              <div className="mb-8 flex flex-col gap-3">
                {[
                  "14-day free trial, no credit card required",
                  "Full access to all features during trial",
                  "Dedicated onboarding support"
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="flex items-center justify-center gap-2 text-lg"
                  >
                    <span className="w-2 h-2 rounded-full bg-white" />
                    {benefit}
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white text-blue-600 rounded-full font-medium hover:bg-gray-100 transition-colors shadow-lg group flex items-center justify-center gap-2"
                >
                  Start Free Trial
                  <motion.span
                    className="inline-block"
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
                    className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                  >
                    Schedule Demo
                    <span>📅</span>
                  </motion.button>
                </BackgroundGradient>
              </div>
            </motion.div>
          </TextReveal>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-12 pt-12 border-t border-white/20"
          >
            <p className="text-sm opacity-80 mb-4">Trusted by leading companies worldwide</p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className="w-24 h-8 bg-white/20 rounded-md" />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};