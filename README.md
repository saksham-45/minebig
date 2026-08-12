# MineBig.com V2.0 — Website + Agent Portal (Demo Prototype)

**Live demo:** https://minebig.vercel.app
**Source:** https://github.com/saksham-45/minebig (public)

Functional preview of the MineBig.com relaunch: a public lottery/draw website
and separate player/agent areas behind one login. Pure static HTML/CSS/JS — no
build step, no backend. Deploys automatically on every push to `main` (Vercel +
GitHub integration).

**This is a demo prototype, not the live product.** All data is sample data
stored in the visitor's browser (localStorage). Prize amounts, logo, photos,
real credentials, and lead routing are open items to be finalized.

**No payments anywhere.** MineBig.com never processes payments, sells tickets
online, or collects prizes online. The website informs and connects; tickets,
receipts and prizes are handled face to face by verified agents. There is no
cart, no checkout, no wallet, and no payment page.

## Visual world — "Teletext Results Service"

The site is designed as a broadcast teletext magazine (the chosen direction
from the impeccable design-roll flow):

- Flat black CRT ground with subtle scanlines; the broadcast eight — white
  body, yellow double-height headers, cyan live figures, green available,
  red alerts; no gradients, no blur, no rounded corners
- VT323 bitmap typeface; block-mosaic number tiles; hard 2px rules
- Page-number navigation: P100 Home · P110 Events · P120 About · P130
  Testimonials · P140 Results · P150 Check · P160 Agent · P170 FAQ · P200
  18+ · P500 Login · P510 My Account · P520 Agent Portal
- Broadcast idioms: live clock in the header bar, blinking seconds, HOLD
  (freezes the countdown), REVEAL (ticket results), keyed-digit input
  (on-screen keypad on the Check page), subpage index navigation on mobile
- Structural research from Magnum 4D still applies to content: results-first
  homepage, how-the-draw-works transparency, where-to-claim, lucky number
  generator, FAQ, responsible play, newsletter footer

## Pages

Public website:

| Page | Path | What it does |
|---|---|---|
| Home | `index.html` (P100) | Hero, latest draw feed, lucky number generator, how-the-draw-works, where-to-claim |
| Upcoming Events | `upcoming.html` (P110) | Live countdown to Sunday 12 PM; 15-min live window; preview + HOLD demo controls |
| About Us | `about.html` (P120) | 25-year relaunch story + how the site works |
| Testimonials | `testimonials.html` (P130) | Latest-draw winners grouped by the 7 prize tiers |
| Winning Numbers | `winning.html` (P140) | Latest draw, last 3 months, lifetime number frequency |
| Check Status | `check.html` (P150) | Ticket status lookup (keypad entry) + availability with suggestions |
| Connect to Agent | `connect.html` (P160) | Lead form (name, phone, area, preferred time) + email |
| FAQ | `faq.html` (P170) | Help accordion |
| Play Responsibly | `play-responsibly.html` (P200) | Responsible play, privacy, terms (anchored) |

One login, two channels:

| Page | Path | What it does |
|---|---|---|
| Login | `login.html` (P500) | Single login — the user selects **Player** or **Agent** (keys 1/2), then signs in |
| My Account | `user-portal.html` (P510) | Player channel: save ticket codes, see win/sold/not-found status, latest draw |
| Agent Portal | `agent-portal.html` (P520) | Agent channel: pick 6 numbers with live availability → buy & lock the code → record the sale → permanent log book → winner announcements |

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
  (any of these triggers the "taken" state and suggested alternatives).
- `Events` → "Preview live event" shows the 15-minute live state; "HOLD
  countdown" freezes the tick.
- `Login` → pick Player or Agent (any credentials work), or press 1 / 2.
- Agent Portal → "Demo: reset this week's taken numbers" clears the pool.

## Run locally

```bash
cd minebig
python3 -m http.server 8099
# open http://127.0.0.1:8099
```

Any static file server works. The site uses the VT323 Google Font with
monospace fallbacks.

## Deploy (free)

The site is fully static — drop the folder onto any static host:

- **Vercel (connected)** — push to `main`, auto-deploys to production
- **Netlify Drop** — drag the folder into https://app.netlify.com/drop
- **GitHub Pages** — push to a repo and enable Pages (root branch)

## Open items before launch

- Brand logo / visual identity (V2.0 look)
- Testimonial photos and real quotes
- Prize amounts per tier (currently RM, amounts TBD)
- Real player and agent credentials and lead routing (email/CRM) for the form
- Licensing confirmation for the operating region (Malaysia)
- Real draw data feed and backend for codes (currently browser-local demo logic)
