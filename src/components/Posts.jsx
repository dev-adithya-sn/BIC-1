import React, { useState, useEffect } from 'react';
import { POSTS } from '../data/clubData';

export default function Posts() {
  const [activePost, setActivePost] = useState(null);

  useEffect(() => {
    if (activePost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activePost]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActivePost(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">Intel & Guides</span>
        <h1 className="display">The Library</h1>
        <p className="lede">
          Write-ups, walkthroughs, and survival guides built by the community. No fluff, just what we learned from building and launching.
        </p>
      </header>

      <section className="grid grid-3" id="posts-grid">
        {POSTS.map((p, idx) => (
          <button
            key={idx}
            className="card post-card rv in"
            onClick={() => setActivePost(p)}
          >
            <div className="meta">
              <span className="chip-solid">{p.tag}</span>
              <span className="min">{p.min}</span>
            </div>
            <h3>{p.title}</h3>
            <p>{p.excerpt}</p>
            <span className="more">Read →</span>
          </button>
        ))}
      </section>

      {activePost && (
        <div 
          className="reader open" 
          role="dialog" 
          aria-modal="true" 
          aria-label="Post reader"
          onClick={(e) => e.target === e.currentTarget && setActivePost(null)}
        >
          <div className="reader-inner">
            <button 
              className="reader-close" 
              onClick={() => setActivePost(null)} 
              aria-label="Close"
            >
              ✕
            </button>
            <div id="reader-content">
              <div className="meta">
                <span className="chip-solid">{activePost.tag}</span>
                <span className="min-tag">{activePost.min}</span>
              </div>
              <h2>{activePost.title}</h2>
              <div 
                className="reader-body" 
                dangerouslySetInnerHTML={{ __html: activePost.body }} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
