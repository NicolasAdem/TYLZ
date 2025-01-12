// components/Testimonials.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { BackgroundGradient } from './ui/BackgroundGradient';
import { TextReveal } from './ui/TextReveal';
import type { Testimonial } from './types';

const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'Product Manager at TechCorp',
    image: '/api/placeholder/64/64',
    content: 'Tylz.AI has transformed how our team collaborates. The AI-powered task extraction has saved us countless hours in meetings, and the automated workflows have significantly improved our productivity.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'CTO at StartupX',
    image: '/api/placeholder/64/64',
    content: 'The automated workflow creation is a game-changer. Our productivity has increased by 40% since implementing Tylz.AI. The AI understanding of context and priority is impressive.',
    rating: 5
  },
  {
    name: 'Emily Davis',
    role: 'Team Lead at InnovateCo',
    image: '/api/placeholder/64/64',
    content: 'Finally, an AI tool that actually delivers on its promises. The real-time analytics have helped us optimize our processes significantly. Customer support is also exceptional.',
    rating: 5
  }
];

const stats = [
  { label: "Customer Satisfaction", value: "98%" },
  { label: "Enterprise Clients", value: "500+" },
  { label: "Time Saved Weekly", value: "12hrs" }
];

const TestimonialCard = ({ testimonial, index }: { testimonial: Testimonial; index: number }) => {
  return (
    <BackgroundGradient>
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
          {/* Quote Icon */}
          <div className="absolute -top-4 -left-4">
            <motion.div
              className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Quote className="w-4 h-4 text-white" />
            </motion.div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-white"
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-blue-600"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
              <p className="text-sm text-gray-600">{testimonial.role}</p>
            </div>
          </div>

          <div className="flex mb-4">
            {[...Array(testimonial.rating)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
              >
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
              </motion.div>
            ))}
          </div>

          <p className="text-gray-600 leading-relaxed">
            "{testimonial.content}"
          </p>

          {/* Decorative Elements */}
          <motion.div
            className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-lg"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    </BackgroundGradient>
  );
};

export const Testimonials = () => {
  return (
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
                See what our customers have to say about their experience
              </p>
            </motion.div>
          </div>
        </TextReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>

        {/* Social Proof Stats */}
        <motion.div 
          className="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
            >
              <motion.div
                className="text-3xl font-bold text-blue-600 mb-2"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};