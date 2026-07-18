import React from 'react';

export default function Ticker() {
  const words = ["Build", "✦", "Innovate", "✦", "Create", "✦", "Defy the limits", "✦"];
  
  // Multiply list to create a seamless infinite scroll effect
  const tickerItems = Array(4).fill(words).flat();

  return (
    <div className="ticker">
      <div className="ticker-track">
        {tickerItems.map((item, index) => {
          if (item === "✦") {
            return <b key={index}>✦</b>;
          }
          return <span key={index}>{item}</span>;
        })}
      </div>
    </div>
  );
}
