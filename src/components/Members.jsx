import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MEMBERS } from '../data/clubData';

gsap.registerPlugin(ScrollTrigger);

export default function Members() {
  const [activeGroup, setActiveGroup] = useState(0);
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

  const group = MEMBERS[activeGroup];

  return (
    <section className="members-section container" ref={sectionRef}>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="reveal-up">
          <span className="section-tag">Core Team</span>
        </div>
        <h1 className="page-hero-title reveal-up">
          The People<br />Who <em>Build</em> BiC
        </h1>
        <p className="page-hero-sub reveal-up">
          Every great idea needs obsessed people to execute it. Meet the core behind BiC.
        </p>
      </div>

      {/* Stats Banner — Finguard style */}
      <div className="stats-banner reveal-up" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="stat-block featured">
          <div className="stat-number">3<sup>rd</sup></div>
          <div className="stat-label">Year Running</div>
          <div className="stat-desc">BiC has been building the innovation culture at VIT Chennai since 2024.</div>
        </div>
        <div className="stat-block">
          <div className="stat-number">5</div>
          <div className="stat-label">Departments</div>
          <div className="stat-desc">Tech · Curation · R&D · Design · Events.</div>
        </div>
      </div>

      {/* Cohort Tabs */}
      <div className="cohort-tabs reveal-up">
        {MEMBERS.map((g, i) => (
          <button
            key={i}
            className={`cohort-tab ${i === activeGroup ? 'active' : ''}`}
            onClick={() => setActiveGroup(i)}
          >
            {g.group}
          </button>
        ))}
      </div>

      {/* Member Grid */}
      <div className="member-grid">
        {group.people.map((person, i) => (
          <div key={i} className="member-card reveal-up">
            <div className="member-avatar">{person.name.charAt(0)}</div>
            <div className="member-name">{person.name}</div>
            <div className="member-role">{person.role}</div>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div style={{ marginTop: 80 }}>
        <div className="feature-grid feature-grid-auto">
          {[
            { tag: 'Tech', title: 'Engineering', body: 'Build projects, run workshops, maintain the club website, and develop the tools that keep BiC running.' },
            { tag: 'Curation', title: 'Curation', body: 'Curate speakers, partnerships, and opportunities worth bringing back to the club.' },
            { tag: 'R&D', title: 'Research & Development', body: 'Explore new ideas, tools, and trends before they land in a workshop or a build.' },
            { tag: 'Design', title: 'Visual Identity', body: 'Own the look of BiC — social assets, event branding, and everything in between.' },
            { tag: 'Events', title: 'Events', body: 'Coordinate DeFy, TechnoVIT, and every BiC event from logistics to execution.' },
          ].map((d, i) => (
            <div key={i} className="feature-card reveal-up">
              <div className="fc-eyebrow">{d.tag}</div>
              <div className="fc-title">{d.title}</div>
              <div className="fc-body">{d.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
