import React from 'react';
import { DEFY_NEXT, DEFY_EDITIONS } from '../data/clubData';

export default function Defy() {
  return (
    <div className="wrap">
      <header className="page-head">
        <span className="eyebrow">Flagship Hackathon</span>
        <h1 className="display">DeFy Hack</h1>
        <p className="lede">
          Our annual flagship hackathon bringing together the sharpest developers and business minds to build products that matter.
        </p>
      </header>

      {/* Next Edition Accent Panel */}
      <section className="panel-acid" id="defy-next">
        <span className="spark" aria-hidden="true">✦</span>
        <span className="chip-solid">{DEFY_NEXT.label}</span>
        <h2>{DEFY_NEXT.title}</h2>
        <p>{DEFY_NEXT.blurb}</p>
        <div className="ed-facts">
          {DEFY_NEXT.chips.map((c, i) => (
            <span key={i} className="chip">{c}</span>
          ))}
        </div>
        <div className="panel-cta">
          <a
            className="btn btn-dark"
            href={DEFY_NEXT.link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {DEFY_NEXT.link.text}
          </a>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="sec">
        <h2>Editions & Timeline</h2>
        <p className="sub">Tracing the history of DeFy editions from our beginnings to the latest showcases.</p>
        
        <div id="defy-tl" className="tl-container">
          {DEFY_EDITIONS.map((e, idx) => (
            <div key={idx} className="tl-item rv in">
              <div className="when">{e.when}</div>
              <div className="ed-card">
                <h3>{e.ed}</h3>
                <p className="theme">{e.theme}</p>
                <div className="ed-facts">
                  {e.facts.map((f, i) => (
                    <span key={i} className="chip">{f}</span>
                  ))}
                </div>
                {e.winners && e.winners.length > 0 && (
                  <div className="winners">
                    {e.winners.map((w, i) => (
                      <div key={i} className="win-row">
                        <span className="pos">{w.pos}</span>
                        <span className="team">{w.team}</span>
                        {w.prize && <span className="prize">{w.prize}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
