import React from 'react';
import { motion } from 'framer-motion';
import { Twitter, Linkedin, Github, Instagram } from 'lucide-react';
import type { FooterColumn } from './types';

const footerColumns: FooterColumn[] = [
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
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security", "Cookies"]
  }
];

const socialLinks = [
  { icon: <Twitter className="w-5 h-5" />, href: "#" },
  { icon: <Linkedin className="w-5 h-5" />, href: "#" },
  { icon: <Github className="w-5 h-5" />, href: "#" },
  { icon: <Instagram className="w-5 h-5" />, href: "#" }
];

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
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
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerColumns.map((column, index) => (
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
            
            {/* Language Selector */}
            <select className="bg-gray-800 text-gray-400 rounded-lg px-4 py-2 border border-gray-700">
              <option value="en">English (US)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};