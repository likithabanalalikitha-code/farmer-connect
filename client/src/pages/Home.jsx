import React from 'react';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import AIFeaturePreview from '../components/landing/AIFeaturePreview';
import MarketplacePreview from '../components/landing/MarketplacePreview';
import Pricing from '../components/landing/Pricing';
import Testimonials from '../components/landing/Testimonials';
import FAQ from '../components/landing/FAQ';

const Home = () => {
  return (
    <div className="space-y-0">
      <Hero />
      <Features />
      <HowItWorks />
      <MarketplacePreview />
      <AIFeaturePreview />
      <Pricing />
      <Testimonials />
      <FAQ />
    </div>
  );
};

export default Home;
