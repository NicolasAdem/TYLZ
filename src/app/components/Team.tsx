import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter } from 'lucide-react';
import { TextReveal } from './ui/TextReveal';
import type { TeamMember } from './types';

const team: TeamMember[] = [
  {
    name: 'Jillian Dubbeling',
    role: 'Founder',
    imageUrl: '/api/placeholder/400/400'
  },
  {
    name: 'Nicolas Adem',
    role: 'Founder',
    imageUrl: 'NicolasAdem.png'
  }
];

const TeamMemberCard = ({ member, index }: { member: TeamMember; index: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="relative group"
    >
      <div className="relative h-80 w-64 overflow-hidden rounded-2xl">
        <img
          src={member.imageUrl}
          alt={member.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/75 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="translate-y-8 transform opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex justify-center space-x-4 mb-4">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-full bg-white/20 p-2 backdrop-blur-sm hover:bg-white/30"
              >
                <Twitter className="h-5 w-5 text-white" />
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="rounded-full bg-white/20 p-2 backdrop-blur-sm hover:bg-white/30"
              >
                <Linkedin className="h-5 w-5 text-white" />
              </motion.a>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-white">{member.name}</h3>
          <p className="text-sm text-gray-300">{member.role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export const Team = () => {
  return (
    <section id="team" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <TextReveal>
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Meet Our Team
            </motion.h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're a team of passionate innovators dedicated to transforming how teams work together. 
              Our mission is to make collaboration effortless and intelligent.
            </p>
          </div>
        </TextReveal>

        <div className="flex justify-center gap-12">
          {team.map((member, index) => (
            <TeamMemberCard key={index} member={member} index={index} />
          ))}
        </div>

        {/* Team Values */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Innovation First",
              description: "We're constantly pushing the boundaries of what's possible with AI and automation."
            },
            {
              title: "Customer Success",
              description: "Your success is our success. We're committed to helping teams achieve their full potential."
            },
            {
              title: "Open Collaboration",
              description: "We believe in transparent, open collaboration - both internally and with our customers."
            }
          ].map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};