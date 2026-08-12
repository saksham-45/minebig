# MineBig.com V2.0 — Website + Agent Portal (Demo Prototype)

**Live demo:** https://minebig.vercel.app
**Source:** https://github.com/saksham-45/minebig (public)

Functional preview of the MineBig.com relaunch: a public lottery/draw website
and separate login areas for players and agents. Pure static HTML/CSS/JS — no
build step, no backend. Deploys automatically on every push to `main` (Vercel +
GitHub integration).

**This is a demo prototype, not the live product.** All data is sample data
stored in the visitor's browser (localStorage). Prize amounts, logo, photos,
real credentials, and lead routing are open items to be finalized.

**No payments anywhere.** MineBig.com never processes payments, sells tickets
online, or collects prizes online. The website informs and connects; tickets,
receipts and prizes are handled face to face by verified agents. There is no
cart, no checkout, no wallet, and no payment page.

## Pages

Public website:

| Page | Path | What it does |
|---|---|---|
| Home | `index.html` | Hero tagline, short About blurb with “More →”, latest draw results, lucky number generator, how-the-draw-works steps, where-to-claim, feature cards |
| Upcoming Events | `upcoming.html` | Live countdown to Sunday 12:00 PM; 15-min live window with playback timer; “Preview live event” demo toggle |
| About Us | `about.html` | 25-year relaunch story + “about this website and how it works” |
| Testimonials | `testimonials.html` | Latest-draw winners grouped by the 7 prize tiers |
| Winning Numbers | `winning.html` | Latest draw, last 3 months of draws, lifetime number frequency |
| Check Status | `check.html` | Ticket status lookup + live number availability with suggested alternatives |
| Connect to Agent | `connect.html` | Lead form (name, phone, area, preferred time) + fallback email |
| FAQ | `faq.html` | Help accordion: draw times, buying, codes, prizes, claiming |
| Play Responsibly | `play-responsibly.html` | Responsible-play commitments, privacy, terms & disclaimer (anchored sections) |

Player area (separate from agents):

| Page | Path | What it does |
|---|---|---|
| Player Login | `user-login.html` | Demo sign-in (any name + password) |
| My Account | `user-portal.html` | Save ticket codes, see win/sold/not-found status, latest draw, reminders |

Agent Portal (separate login, agents only):

| Page | Path | What it does |
|---|---|---|
| Agent Login | `agent-login.html` | Demo sign-in (any name + password) |
| Agent Portal | `agent-portal.html` | Pick 6 numbers with live availability → buy & lock the code → record the sale → permanent log book → winner announcements |

## Design research — Magnum 4D

Structure and elements follow research on magnum4d.my (the closest comparable
Malaysian lottery site), adapted to MineBig's agent-mediated, no-payments model:

- Results-first homepage (latest draw + winners on the home page)
- “How the draw works” transparency steps (Magnum's “random and fair” trust block)
- “Where to claim” guidance (Magnum's claim table → agent face-to-face model)
- Lucky number generator with copy (Magnum's “your lucky number” widget)
- 7-tier prize presentation (1st / 2nd / 3rd / Special / C1–C3), like Magnum's
  top-prize / special / consolation structure
- FAQ / Help, Play Responsibly, Privacy & Terms pages
- Newsletter signup + contact + legal links in the footer, “18+ play responsibly”

## Weekly logic (implemented)

- Draw runs **every Sunday at 12:00 PM** (visitor's local time), lasts 15 minutes.
- Countdown runs all week; at 12:00 PM Sunday it switches to the live playback
  state and loops back to the next Sunday when the 15 minutes end.
- Codes are **any 6 natural numbers**, subject to availability.
- A bought combination is **locked** (no other agent can sell it) for that week.
- **Every Sunday the pool resets** — taken numbers are keyed by week
  (`minebig_taken_<year-W##>`) and clear automatically.
- Log book entries are **permanent** — no edit or delete.

## Demo tips

- Winning demo code: `4 19 27 33 41 49` → shows the WINNER result.
- Taken demo numbers: `7`, `12`, `19`, `23`, `27`, `33`, `41`, `49`, `56`, `61`, `78`
  (any of these triggers the “taken” state and suggested alternatives).
- `Upcoming Events` → “Preview live event” shows the 15-minute live state anytime.
- Player Login and Agent Login are separate — try both (any credentials work).
- Agent Portal → “Demo: reset this week's taken numbers” clears the pool.

## Run locally

```bash
cd minebig
python3 -m http.server 8099
# open http://127.0.0.1:8099
```

Any static file server works (`npx serve .`, VS Code Live Server, etc.).
The site uses Google Fonts (Poppins/Orbitron) over CDN with system-font fallbacks.

## Deploy (free)

The site is fully static — drop the folder onto any static host:

- **Netlify Drop** — drag the folder into https://app.netlify.com/drop
- **Vercel** — `npx vercel` in this folder
- **GitHub Pages** — push to a repo and enable Pages (root branch)

## Open items before launch

- Brand logo / visual identity (V2.0 look)
- Testimonial photos and real quotes
- Prize amounts per tier (currently RM, amounts TBD)
- Real player and agent credentials and lead routing (email/CRM) for the form
- Licensing confirmation for the operating region (Malaysia)
- Real draw data feed and backend for codes (currently browser-local demo logic)
