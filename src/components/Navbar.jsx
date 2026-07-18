import React, { useRef, useEffect } from 'react';

export default function Navbar({ activePage, onNavigate }) {
  const pages = [
    { id: 'home', label: 'Home' },
    { id: 'posts', label: 'Library' },
    { id: 'members', label: 'Core' },
    { id: 'defy', label: 'DeFy' },
    { id: 'events', label: 'Events' }
  ];

  const containerRef = useRef(null);
  const indicatorRef = useRef(null);

  useEffect(() => {
    const activeBtn = containerRef.current?.querySelector(`.isl-btn.on`);
    if (activeBtn && indicatorRef.current) {
      indicatorRef.current.style.left = `${activeBtn.offsetLeft}px`;
      indicatorRef.current.style.width = `${activeBtn.offsetWidth}px`;
    }
  }, [activePage]);

  return (
    <div className="top">
      <div className="brand">
        BiC <span className="spark">✦</span>
      </div>
      
      <div id="island" className="island" ref={containerRef}>
        <div id="isl-ind" className="isl-ind" ref={indicatorRef} />
        {pages.map((p) => (
          <button
            key={p.id}
            data-page={p.id}
            className={`isl-btn ${activePage === p.id ? 'on' : ''}`}
            onClick={() => onNavigate(p.id)}
          >
            {p.label}
          </button>
        ))}
      </div>

      <button className="top-chip" onClick={() => onNavigate('members')}>
        JOIN US
      </button>
    </div>
  );
}
