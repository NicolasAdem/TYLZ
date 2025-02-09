'use client'

import React from 'react';
import { Navigation } from './components/frontend/Navigation';
import { Hero } from './components/frontend/Hero';
import { Features } from './components/frontend/Features';
import { HowItWorks } from './components/frontend/HowItWorks';
import { Pricing } from './components/frontend/Pricing';
import { Testimonials } from './components/frontend/Testimonials';
import { Team } from './components/frontend/Team';
import { CallToAction } from './components/frontend/CallToAction';
import { Footer } from './components/frontend/Footer';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Pricing />
        <Testimonials />
        <Team />
        <CallToAction />
      </main>
      <Footer isDarkMode={false} />
    </div>
  );
};

export default Home;