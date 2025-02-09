import React from 'react';
import { Linkedin, Github, Instagram } from 'lucide-react';
import { X } from 'lucide-react';
import type { FooterColumn } from '../types';

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
  { icon: <X className="w-5 h-5" />, href: "#" },
  { icon: <Linkedin className="w-5 h-5" />, href: "#" },
  { icon: <Github className="w-5 h-5" />, href: "#" },
  { icon: <Instagram className="w-5 h-5" />, href: "#" }
];

export const Footer = ({ isDarkMode }: { isDarkMode: boolean }) => {
  return (
    <footer 
      className={`relative ${
        isDarkMode 
          ? 'bg-gray-900 text-white' 
          : 'bg-white text-gray-900 !bg-white'
      } py-16 z-[9999]`}
      style={{
        backgroundColor: isDarkMode ? '' : '#FFFFFF',
        isolation: 'isolate'
      }}
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Logo and Description */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Tylz.AI
              </span>
            </div>
            <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-6 max-w-md`}>
              Save time structuring projects with AI.
              Split up your dream today!
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`${
                    isDarkMode 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  } transition-colors`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer Columns */}
          {footerColumns.map((column, index) => (
            <div key={index}>
              <div>
                <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {column.title}
                </h3>
                <ul className="space-y-3">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a 
                        href="#" 
                        className={`${
                          isDarkMode 
                            ? 'text-gray-400 hover:text-white' 
                            : 'text-gray-600 hover:text-gray-900'
                        } transition-colors`}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className={`mt-16 pt-8 ${isDarkMode ? 'border-t border-gray-800' : 'border-t border-gray-200'}`}>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              © {new Date().getFullYear()} Tylz.AI. All rights reserved.
            </div>
            
            {/* Language Selector */}
            <select 
              className={`
                ${isDarkMode 
                  ? 'bg-gray-800 text-gray-400 border-gray-700' 
                  : 'bg-gray-100 text-gray-700 border-gray-300'
                } 
                rounded-lg px-4 py-2 border
              `}
            >
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