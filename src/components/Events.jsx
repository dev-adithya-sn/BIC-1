import React from 'react';
import { EVENTS } from '../data/clubData';

export default function Events() {
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">On the Radar</span>
        <h1 className="display">Club Events</h1>
        <p className="lede">
          From massive technical fests to weekly coffee meetups and developer build nights, here is what we are planning.
        </p>
      </header>

      {/* Featured TechnoVIT events */}
      <section className="sec">
        <h2>Flagship / TechnoVIT Lineup</h2>
        <p className="sub">Flagship events designed and proposed for the upcoming TechnoVIT festival.</p>
        
        <div id="events-feat" className="feat-grid">
          {EVENTS.technovit.map((e, idx) => (
            <div key={idx} className="feat-card rv in">
              <div className="meta">
                {e.chips.map((c, i) => (
                  <span key={i} className="chip">{c}</span>
                ))}
              </div>
              <h3>{e.title}</h3>
              <p>{e.blurb}</p>
              <span className="lead-tag">Lead — {e.lead}</span>
            </div>
          ))}
        </div>
      </section>

      {/* General proposed events */}
      <section className="sec">
        <h2>Proposed / Ideas Board</h2>
        <p className="sub">Events pitch proposals from core meets awaiting schedule locks. Feel free to vote or chip in.</p>
        
        <div id="events-grid" className="grid grid-2">
          {EVENTS.general.map((e, idx) => (
            <div key={idx} className="card rv in">
              <span className="chip">Proposed</span>
              <h3>{e.title}</h3>
              <p>{e.blurb}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
