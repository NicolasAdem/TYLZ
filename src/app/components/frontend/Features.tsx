import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Brain, BarChart, ArrowRight, FileText, Globe, Shield } from 'lucide-react';
import { BackgroundGradient } from '../ui/BackgroundGradient';
import { TextReveal } from '../ui/TextReveal';
import type { Feature } from '../types';

const features: Feature[] = [
  {
    icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
    title: "Smart Conversations",
    description: "AI-powered analysis of chats, voice, and files that transforms conversations into clear, actionable tasks.",
    demo: "Learn more...."
  },
  {
    icon: <Brain className="w-6 h-6 text-purple-600" />,
    title: "Automated Workflows",
    description: "Convert discussions into actionable tasks instantly with intelligent prioritization and assignment.",
    demo: "Auto-assign tasks"
  },
  {
    icon: <BarChart className="w-6 h-6 text-blue-600" />,
    title: "Real-time Analytics",
    description: "Monitor performance with AI-driven insights, to uncover productivity patterns and optimize workflows.",
    demo: "View analytics"
  },
  {
    icon: <FileText className="w-6 h-6 text-purple-600" />,
    title: "Document Analysis",
    description: "Extract key information and action items from documents, PDFs, and presentations automatically.",
    demo: "Try demo"
  },
  {
    icon: <Globe className="w-6 h-6 text-blue-600" />,
    title: "Multi-language Support",
    description: "Work seamlessly across languages with automatic translation and task extraction in 30+ languages.",
    demo: "See languages"
  },
  {
    icon: <Shield className="w-6 h-6 text-purple-600" />,
    title: "Enterprise Security",
    description: "Bank-grade encryption and compliance with SOC 2, GDPR, and other major security standards.",
    demo: "Security details"
  }
];

const FeatureCard = ({ feature, index }: { feature: Feature; index: number }) => {
  return (
    <motion.div
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
  );
};

export const Features = () => {
  return (
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
              Powerful Features to Revolutionize Your Workflow
            </motion.h2>
            <p className="text-xl text-gray-600">
              Unleash the full potential of your team with cutting-edge tools designed to simplify, optimize, and accelerate your processes.
            </p>
          </div>
        </TextReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};