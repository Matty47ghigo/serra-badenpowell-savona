import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import History from './components/History';
import BotanicalHeritage from './components/BotanicalHeritage';
import SocialProject from './components/SocialProject';
import PartnersSection from './components/PartnersSection';
import GalleryCarousel from './components/GalleryCarousel';
import SocialFeed from './components/SocialFeed';
import BookingSection from './components/BookingSection';
import InfoFaq from './components/InfoFaq';
import Footer from './components/Footer';
import DashboardModal from './components/DashboardModal';
import AutonomousManageModal from './components/AutonomousManageModal';

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navbar */}
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Main Content */}
      <main>
        <Hero />
        <About />
        <History />
        <BotanicalHeritage />
        <SocialProject />
        <PartnersSection />
        <GalleryCarousel />
        <SocialFeed />
        <BookingSection />
        <InfoFaq />
      </main>

      {/* Footer */}
      <Footer onOpenAuth={() => setIsAuthOpen(true)} />

      {/* Auth & RBAC Dashboard Modal */}
      <DashboardModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Autonomous Manage Modal (triggered via ?token=... in URL) */}
      <AutonomousManageModal />
    </div>
  );
}
