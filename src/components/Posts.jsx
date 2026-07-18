import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { POSTS } from '../data/clubData';

gsap.registerPlugin(ScrollTrigger);

export default function Posts() {
  const [open, setOpen] = useState(null);
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
    <section className="posts-section container" ref={sectionRef}>
      {/* Page Hero */}
      <div className="page-hero">
        <span className="section-tag reveal-up">Knowledge Base</span>
        <h1 className="page-hero-title reveal-up">Learn From<br />The <em>Builders</em></h1>
        <p className="page-hero-sub reveal-up">
          Guides, explainers, and the honest tips we give every fresher who walks into BiC.
        </p>
      </div>

      {/* Stats */}
      <div className="stats-banner reveal-up">
        <div className="stat-block featured">
          <div className="stat-number">{POSTS.length}</div>
          <div className="stat-label">Articles</div>
        </div>
        <div className="stat-block">
          <div className="stat-number">3–4</div>
          <div className="stat-label">Min Avg Read</div>
        </div>
        <div className="stat-block">
          <div className="stat-number">100<sup>%</sup></div>
          <div className="stat-label">Practical</div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="posts-grid">
        {POSTS.map((post, i) => (
          <article key={i} className="post-card reveal-up" onClick={() => setOpen(i)}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
              <span className="post-tag">{post.tag}</span>
              <span className="post-min">{post.min}</span>
            </div>
            <h3 className="post-title">{post.title}</h3>
            <p className="post-excerpt">{post.excerpt}</p>
            <span className="post-read">Read more →</span>
          </article>
        ))}
      </div>

      {/* Inline Feature Card */}
      <div className="feature-grid feature-grid-2 reveal-up" style={{ marginTop: 80 }}>
        <div className="feature-card dark-amber">
          <div className="fc-eyebrow">Want to write?</div>
          <div className="fc-title">Share Your Knowledge</div>
          <div className="fc-body">
            Got a lesson learned, a project walkthrough, or advice for freshers? BiC's knowledge base is community-written. DM <span style={{color:'var(--amber)'}}>@bic_vitc</span> to contribute.
          </div>
        </div>
        <div className="feature-card dark-violet">
          <div className="fc-eyebrow violet">Get Updates</div>
          <div className="fc-title">Follow BiC Socials</div>
          <div className="fc-body">
            New articles, event announcements, and recruitment drops hit <span style={{color:'var(--violet)'}}>@bic_vitc</span> first. Keep notifications on or you'll miss the DeFy registration window.
          </div>
        </div>
      </div>

      {/* Modal */}
      {open !== null && (
        <div className="post-modal-overlay" onClick={() => setOpen(null)}>
          <div className="post-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpen(null)}>✕ Close</button>
            <div className="modal-tag">{POSTS[open].tag}</div>
            <h2 className="modal-title">{POSTS[open].title}</h2>
            <div className="modal-meta">{POSTS[open].min}</div>
            <div className="modal-body" dangerouslySetInnerHTML={{ __html: POSTS[open].body }} />
          </div>
        </div>
      )}
    </section>
  );
}
