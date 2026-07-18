import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EVENTS } from '../data/clubData';

gsap.registerPlugin(ScrollTrigger);

export default function Events() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('.reveal-up').forEach((el) => {
        gsap.fromTo(el, 
          { opacity: 0, y: 30 },
          {
            scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
            opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section className="events-section container" ref={sectionRef}>
      {/* Page Hero */}
      <div className="page-hero">
        <span className="section-tag reveal-up">Events</span>
        <h1 className="page-hero-title reveal-up">What We <em>Run</em></h1>
        <p className="page-hero-sub reveal-up">
          From flagship hackathons to late-night build sessions — if there's something to build, learn, or pitch, BiC is running it.
        </p>
      </div>

      {/* Stats Banner */}
      <div className="stats-banner reveal-up">
        <div className="stat-block featured">
          <div className="stat-number">3<sup>+</sup></div>
          <div className="stat-label">Major Events / Year</div>
          <div className="stat-desc">DeFy, TechnoVIT, and a roster of internal events every semester.</div>
        </div>
        <div className="stat-block">
          <div className="stat-number">500<sup>+</sup></div>
          <div className="stat-label">Total Participants</div>
          <div className="stat-desc">Across all editions of DeFy and BiC internal events.</div>
        </div>
        <div className="stat-block">
          <div className="stat-number">10<sup>+</sup></div>
          <div className="stat-label">Partner Sponsors</div>
          <div className="stat-desc">Industry sponsors and partner organizations backing BiC events.</div>
        </div>
      </div>

      {/* TechnoVIT Section */}
      <h2 className="page-hero-title reveal-up" style={{ fontSize: 'clamp(30px,4vw,48px)', marginBottom: 28 }}>
        TechnoVIT <em>'26</em>
      </h2>
      <div className="events-main-grid reveal-up">
        {EVENTS.technovit.map((ev, i) => (
          <div key={i} className="event-card">
            <div>
              {ev.chips.map((c, j) => <span key={j} className="event-chip">{c}</span>)}
            </div>
            <div className="event-title">{ev.title}</div>
            <div className="event-lead">Student Coordinators: {ev.lead}</div>
            <p className="event-blurb">{ev.blurb}</p>
          </div>
        ))}
      </div>

      {/* General Events */}
      <h2 className="page-hero-title reveal-up" style={{ fontSize: 'clamp(28px,3.5vw,44px)', marginBottom: 24 }}>
        Club <em>Initiatives</em>
      </h2>
      <div className="number-list reveal-up">
        {EVENTS.general.map((ev, i) => (
          <div key={i} className="number-item">
            <span className="number-item-num">0{i+1}</span>
            <div className="number-item-body">
              <div className="number-item-title">{ev.title}</div>
              <div className="number-item-sub">{ev.blurb}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
