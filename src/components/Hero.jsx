import React from 'react';

export default function Hero({ onNavigate }) {
  return (
    <section className="hero">
      <div className="hero-glow" aria-hidden="true" />
      
      <div className="spark-a" aria-hidden="true">✦</div>
      <div className="spark-b" aria-hidden="true">✦</div>

      <div className="deco deco-tris" aria-hidden="true">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <polygon points="50,15 90,85 10,85" stroke="var(--line)" strokeWidth="1.5" />
          <polygon points="50,30 80,80 20,80" stroke="var(--line)" strokeWidth="1" strokeDasharray="3 3" />
        </svg>
      </div>

      <div className="brand-logo-container">
        <span className="hero-logo-icon">💡</span>
        <h1 className="hero-brand-name">BiC</h1>
      </div>

      <h2 className="hero-tag">
        Business <em>Innovation</em> Community
      </h2>
      
      <p className="hero-lede">
        VIT Chennai's premier hub for creators, hackers, and future founders. 
        We build projects, run the DeFy hackathon, host TechnoVIT events, and foster 
        an ecosystem where business strategy meets technical execution.
      </p>

      <div className="hero-cta">
        <button className="btn btn-acid" onClick={() => onNavigate('defy')}>
          Explore DeFy Hackathon
        </button>
        <button className="btn btn-ghost" onClick={() => onNavigate('events')}>
          Upcoming Events
        </button>
      </div>
    </section>
  );
}
