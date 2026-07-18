import React, { useState } from 'react';
import { MEMBERS } from '../data/clubData';

export default function Members() {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);

  const getInitials = (name) => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();
  };

  const currentGroup = MEMBERS[activeGroupIndex];

  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">The Network</span>
        <h1 className="display">Club Core</h1>
        <p className="lede">
          The builders, designers, and organizers maintaining the community. Select a cohort to view our members.
        </p>
      </header>

      <section className="mem-tabs-section">
        <div id="mem-chips" className="mem-chips" role="tablist">
          {MEMBERS.map((group, idx) => (
            <button
              key={idx}
              className={`fchip ${idx === activeGroupIndex ? 'on' : ''}`}
              role="tab"
              aria-selected={idx === activeGroupIndex}
              onClick={() => setActiveGroupIndex(idx)}
            >
              {group.group}
            </button>
          ))}
        </div>

        <div id="mem-grid" className="mem-grid">
          {currentGroup.people.map((m, idx) => (
            <div key={idx} className="mem">
              <div className="ava">{getInitials(m.name)}</div>
              <div className="mem-details">
                <b>{m.name}</b>
                <span>{m.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
