import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ticker from './components/Ticker';
import Posts from './components/Posts';
import Members from './components/Members';
import Defy from './components/Defy';
import Events from './components/Events';
import LandingPage from './components/LandingPage';
import PixarIntro from './components/PixarIntro';

export default function App() {
  const [activePage, setActivePage] = useState('home');
  const [showLanding, setShowLanding] = useState(true);
  const [showIntro, setShowIntro] = useState(true);

  // Sync state from URL hash on load/change
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const validPages = ['home', 'posts', 'members', 'defy', 'events'];
      if (validPages.includes(hash)) {
        setActivePage(hash);
      } else {
        setActivePage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Initial check
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (page) => {
    setActivePage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Add visual feedback to floating navigation
    const island = document.getElementById('island');
    if (island) {
      island.classList.remove('squish');
      void island.offsetWidth; // Trigger reflow
      island.classList.add('squish');
    }
  };

  return (
    <>
      {showIntro && (
        <PixarIntro 
          onEnter={() => setShowIntro(false)} 
        />
      )}
      {showLanding && (
        <LandingPage 
          onEnter={() => {
            setShowLanding(false);
            handleNavigate('home');
          }} 
        />
      )}
      <Navbar activePage={activePage} onNavigate={handleNavigate} />
      
      <main>
        {activePage === 'home' && (
          <div className="page active">
            <Hero onNavigate={handleNavigate} />
            <Ticker />
          </div>
        )}
        
        {activePage === 'posts' && (
          <div className="page active">
            <Posts />
          </div>
        )}

        {activePage === 'members' && (
          <div className="page active">
            <Members />
          </div>
        )}

        {activePage === 'defy' && (
          <div className="page active">
            <Defy />
          </div>
        )}

        {activePage === 'events' && (
          <div className="page active">
            <Events />
          </div>
        )}
      </main>
    </>
  );
}
