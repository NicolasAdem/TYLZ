import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { BackgroundGradient } from '../ui/BackgroundGradient';
import { TextReveal } from '../ui/TextReveal';
import type { PricingPlan } from '../types';

const plans: PricingPlan[] = [
  {
    name: 'Starter',
    price: 'Free',
    features: [
      'Up to 5 Team Members',
      'Basic AI Analysis',
      '100 Tasks/month',
      'Email Support',
      'Basic Analytics',
      'Single Integration'
    ],
    highlighted: false
  },
  {
    name: 'Professional',
    price: '$49',
    features: [
      'Unlimited Team Members',
      'Advanced AI Analysis',
      'Unlimited Tasks',
      '24/7 Priority Support',
      'Custom Workflows',
      'API Access',
      'Advanced Analytics',
      'All Integrations'
    ],
    highlighted: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    features: [
      'Everything in Pro',
      'Dedicated Account Manager',
      'Custom Integration',
      'SLA Guarantee',
      'Advanced Analytics',
      'SSO & Advanced Security',
      'Custom AI Training',
      'Onboarding Support'
    ],
    highlighted: false
  }
];

const ComparisonFeatures = [
  { feature: "Team Members", starter: "5", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "AI Analysis", starter: "Basic", pro: "Advanced", enterprise: "Custom" },
  { feature: "Tasks per Month", starter: "100", pro: "Unlimited", enterprise: "Unlimited" },
  { feature: "Integrations", starter: "1", pro: "All", enterprise: "Custom" },
  { feature: "API Access", starter: "−", pro: "✓", enterprise: "✓" },
  { feature: "Analytics", starter: "Basic", pro: "Advanced", enterprise: "Custom" },
  { feature: "Support", starter: "Email", pro: "24/7", enterprise: "Dedicated" },
  { feature: "Security Features", starter: "Basic", pro: "Advanced", enterprise: "Enterprise" }
];

const PricingCard = ({ plan, index }: { plan: PricingPlan; index: number }) => {
  return (
    <motion.div
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
              {plan.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
            </motion.button>
          </motion.div>
        </div>
      </BackgroundGradient>
    </motion.div>
  );
};

export const Pricing = () => {
  return (
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

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan, index) => (
            <PricingCard key={index} plan={plan} index={index} />
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
                {ComparisonFeatures.map((row, index) => (
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
  );
};