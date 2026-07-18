export const SOCIALS = [
  { label: "Medium", href: "https://medium.com/@businessinnovationcommunityvit" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/bic-vitc" },
];

export const POSTS = [
  {
    tag: "Hackathon",
    min: "4 min read",
    title: "What actually happens at DeFy",
    excerpt: "Two rounds, one all-nighter, nine finalists. A walkthrough of the whole pipeline so round one doesn't catch you off guard.",
    body: `
      <p>DeFy isn't a normal college hackathon, and the format trips up first-timers every year. Here's the whole pipeline.</p>
      <h3>Round 1 — ideate online</h3>
      <p>You pick a track, form a team of 4–6, and submit your idea as a deck on Devfolio. No code yet. This round filters for teams who can think about a problem, not just build for the sake of building. Shortlists come out a couple of weeks before the main event.</p>
      <h3>Round 2 — 24 hours on campus</h3>
      <p>Shortlisted teams show up at VIT Chennai and build for 24 hours straight. There are checkpoint evaluations through the night and morning — mentors walk the floor, judges take notes, and the second evaluation on day two decides who makes the cut.</p>
      <h3>The finale</h3>
      <p>The top nine teams get announced after the hackathon ends, and they pitch — prototype plus an investor-ready deck. Because DeFy is business × Web3, judges care as much about "who pays for this" as they do about your commit history. Track winners take home the prize pool; sponsor bounties stack on top.</p>
      <p>Rule of thumb: teams that scope small and demo something working beat teams with grand slides and a broken build. Every single year.</p>`
  },
  {
    tag: "Guide",
    min: "3 min read",
    title: "Hackathons 101: surviving your first 24 hours",
    excerpt: "Team composition, ruthless scoping, and why the demo matters more than the deck. Everything we tell first-timers.",
    body: `
      <p>If DeFy or any other hackathon is your first, here's the advice we give every fresher who asks.</p>
      <h3>Build the team before the idea</h3>
      <p>You want a builder, a designer-ish person, and someone who can talk. Four friends who all write backend code will build a great API that nobody can present.</p>
      <h3>Scope like a coward</h3>
      <p>Whatever you're planning, cut it in half. Then cut it again. A tiny thing that works beats an ambitious thing that almost works — judges can only score what they can see running.</p>
      <h3>Demo &gt; deck</h3>
      <p>Spend your final two hours rehearsing the demo path, not adding features. Know exactly which buttons you'll press, in what order, and what you'll say while a page loads. Have a screen recording as backup — live demos fail at the worst moments.</p>
      <h3>Sleep is a strategy</h3>
      <p>One person napping in rotation keeps the team's decision-making from falling off a cliff at 4 AM. The 4 AM rewrite is never, ever a good idea.</p>`
  },
  {
    tag: "Explainer",
    min: "4 min read",
    title: "Web3 without the jargon",
    excerpt: "Wallets, chains, and 'decentralized' — the five-minute primer so DeFy's problem statements make sense on day one.",
    body: `
      <p>DeFy is a Web3 hackathon, and half the fresher questions we get are secretly "what is Web3 actually?" Here's the no-jargon version.</p>
      <h3>The one-line answer</h3>
      <p>Web3 is software where the database is shared and public instead of owned by one company. That shared database is a blockchain. Everything else — tokens, wallets, smart contracts — is built on that one idea.</p>
      <h3>The three words you need</h3>
      <p><b>Wallet:</b> your login and your bank account, combined, that no company controls. <b>Smart contract:</b> code that lives on the chain and runs exactly as written — an agreement that can't be quietly edited. <b>DeFi:</b> rebuilding financial services (lending, exchange, insurance) out of smart contracts instead of banks.</p>
      <h3>Why it matters for DeFy</h3>
      <p>The interesting problem isn't the tech — it's finding a situation where "no single owner" genuinely beats a normal app. Ticketing without scalpers, credentials that can't be forged, community treasuries with transparent spending. If your idea works just as well as a normal web app, judges will ask why it's on-chain. Have an answer.</p>`
  }
];

export const MEMBERS = [
  {
    group: "Core '26 — current",
    people: [
      { name: "Sample Name", role: "President" },
      { name: "Sample Name", role: "Vice President" },
      { name: "Sample Name", role: "General Secretary" },
      { name: "Sample Name", role: "Tech Lead" },
      { name: "Sample Name", role: "Curation Lead" },
      { name: "Sample Name", role: "R&D Lead" },
      { name: "Sample Name", role: "Design Lead" },
      { name: "Sample Name", role: "Events Lead" },
    ]
  },
  {
    group: "Core '25",
    people: [
      { name: "Arjun —", role: "Senior core" },
      { name: "Aditya —", role: "Senior core" },
      { name: "Dani —", role: "Senior core" },
      { name: "Sample Name", role: "Senior core" },
    ]
  },
  {
    group: "Core '24",
    people: [
      { name: "Sample Name", role: "Ex-core" },
      { name: "Sample Name", role: "Ex-core" },
      { name: "Sample Name", role: "Ex-core" },
    ]
  },
  {
    group: "Founding team",
    people: [
      { name: "Sample Name", role: "Founder" },
      { name: "Sample Name", role: "Co-founder" },
      { name: "Sample Name", role: "Co-founder" },
    ]
  }
];

export const DEFY_NEXT = {
  label: "Next edition",
  title: "DeFy — VOID",
  blurb: "The next chapter is brewing. Tracks, dates and the prize pool drop on the socials first — but the name should tell you the vibe.",
  chips: ["Status: in the works", "Dates: TBA", "Tracks: TBA"],
  link: { text: "Visit the DeFy site ↗", href: "https://defy26.vercel.app" }
};

export const DEFY_EDITIONS = [
  {
    ed: "DeFy'26",
    when: "12–13 Jan 2026 · VIT Chennai",
    theme: "Third edition. Web3 × entrepreneurship — online ideation round, then a 24-hour onsite build and a top-nine finale.",
    facts: ["₹40,000 pool / track", "1st — ₹25,000", "2nd — ₹15,000", "+ Bounties", "Top 9 finale"],
    winners: [
      { pos: "1st", team: "TBA", prize: "₹25,000/-" },
      { pos: "2nd", team: "TBA", prize: "₹15,000/-" },
    ]
  },
  {
    ed: "DeFy'25",
    when: "10–11 Jan 2025 · MG Auditorium, VIT Chennai",
    theme: "Second edition. 24 hours of Web3 across two tracks — DeFi and Public Goods.",
    facts: ["Track: DeFi", "Track: Public Goods", "24-hour build"],
    winners: [
      { pos: "1st", team: "TBA", prize: "" },
      { pos: "2nd", team: "TBA", prize: "" },
    ]
  },
  {
    ed: "DeFy'24",
    when: "Jan 2024 · VIT Chennai",
    theme: "Where it started. The first edition that proved a business-first hackathon could pull a crowd.",
    facts: ["The original"],
    winners: [
      { pos: "1st", team: "TBA", prize: "" },
    ]
  }
];

export const EVENTS = {
  technovit: [
    {
      title: "Title under wraps",
      lead: "Daksh",
      blurb: "Daksh's flagship pitch for TechnoVIT '26. Scope locked, name pending — details drop here first.",
      chips: ["TechnoVIT '26", "Flagship"]
    },
    {
      title: "Title under wraps",
      lead: "Sharan",
      blurb: "Sharan's event for the TechnoVIT lineup. Same deal: locked in, loading…",
      chips: ["TechnoVIT '26", "Flagship"]
    }
  ],
  general: [
    { title: "6-hour ideathon", by: "Proposed at core meet", blurb: "One evening, one problem statement, teams of two. Sprint format — decks by dinner." },
    { title: "Pitch clinic", by: "Proposed at core meet", blurb: "Bring your idea, leave with a deck that survives hard questions. Seniors tear it apart kindly." }
  ]
};
