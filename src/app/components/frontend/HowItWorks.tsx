import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Brain, Rocket } from 'lucide-react';
import { BackgroundGradient } from '../ui/BackgroundGradient';
import { TextReveal } from '../ui/TextReveal';

const steps = [
  {
    icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
    title: "1. Connect Your Conversations",
    description: "Seamlessly integrate with your team's chat platforms, video meetings, and document sharing systems."
  },
  {
    icon: <Brain className="w-8 h-8 text-purple-600" />,
    title: "2. AI Processing",
    description: "Our advanced AI analyzes conversations in real-time, identifying action items, decisions, and key insights."
  },
  {
    icon: <Rocket className="w-8 h-8 text-blue-600" />,
    title: "3. Automated Workflows",
    description: "Tasks are automatically created, prioritized, and assigned to team members with smart due dates."
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-gray-50 relative overflow-hidden" id="how-it-works">
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
          
          {steps.map((step, index) => (
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

                  {/* Progress Indicator */}
                  <div className="mt-6 flex items-center gap-2">
                    <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-blue-600"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.3 }}
                      />
                    </div>
                    <span className="text-sm text-gray-500">
                      Step {index + 1}
                    </span>
                  </div>
                </motion.div>
              </BackgroundGradient>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};