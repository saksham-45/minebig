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

## Visual world — "Jackpot Lounge"

Gameified premium lottery look, modeled on **magnum4d.my** (the client's pinned
canon — analyzed with Gemini vision):

- White ground with gold `#ffc000` primary; high-contrast noir heroes with a
  gold-glow radial; glossy number balls; Rubik type (the Magnum face)
- 16–20px radius cards, soft navy shadows (`0 8px 32px rgba(3,0,39,…)`),
  pill CTAs with lift-on-hover, 0.3s ease transitions
- Content structured per the MineBig content document (`MineBig_Website_Content.pdf`):
  banner slider (3 banners), two-game countdowns, results timeline with winner
  city/country only, symbolic dictionary + statistics, Try Your Luck flow with
  a selection clipboard, Biggest Sensation (pending), Help (Contact Us + FAQ)

## Pages

Public website:

| Page | Path | What it does |
|---|---|---|
| Home | `index.html` | 3-banner slider, next-draw countdown, ticker, carousel, how-the-draw-works |
| Next Draw | `upcoming.html` | Countdowns for MineBig 4D & 6D, game banners, how-draws-work accordion, prize accordions, demo walkthrough |
| Results & Winners | `winning.html` | Latest 4D/6D results + browsable results timeline (winner city/country only) |
| Star Numbers | `star-numbers.html` | Symbolic Dictionary (searchable) + Statistics (most/least drawn digits, date filters) |
| Try Your Luck | `try-your-luck.html` | Pick numbers (4D/6D), live availability check, selection clipboard, agent hand-off |
| Play Responsibly | `play-responsibly.html` | 21+ age banner, know-your-limits, support resources, privacy & terms (anchored) |
| Biggest Sensation | `biggest-sensation.html` | Content pending (per content doc) |
| Help — FAQs | `faq.html` | Categorized accordion: Getting Started, Buying, Draws, Prizes, Account |
| Help — Contact | `contact.html` | Customer service info + contact form |
| Careers | `careers.html` | Content pending (footer link) |
| About | `about.html` | 25-year reborn story + how the site works |
| Testimonials | `testimonials.html` | Latest-draw winners grouped by prize tier |
| Check Status | `check.html` | Ticket status lookup (keypad entry) + 6-number availability |

One login, two channels:

| Page | Path | What it does |
|---|---|---|
| Login | `login.html` | Single login — the user selects **Player** or **Agent** (keys 1/2), then signs in |
| My Account | `user-portal.html` | Player channel: save ticket codes, see win/sold/not-found status, latest draw |
| Agent Portal | `agent-portal.html` | Agent channel: pick 6 numbers with live availability → lock the code → record the sale → permanent log book → winner announcements |

## Weekly logic (implemented)

- Draws run **every Sunday at 12:00 PM** (visitor's local time), last 15 minutes
  — one countdown per game (MineBig 4D, MineBig 6D).
- Codes are **any 6 natural numbers** in the agent/portal model, subject to
  availability; a bought combination is **locked** for that week.
- **Every Sunday the pool resets** — taken numbers are keyed by week
  (`minebig_taken_<year-W##>`).
- Log book entries are **permanent** — no edit or delete.
- Try Your Luck availability is per game (4D = 4 digits, 6D = 6 digits), seeded
  with sample "taken" numbers, reset weekly. The selection clipboard persists
  in localStorage until cleared and hands off to the agent form.

## Demo tips

- Winning demo code (check page): `4 19 27 33 41 49` → shows the WINNER result.
- Taken demo numbers: `7`, `12`, `19`, `23`, `27`, `33`, `41`, `49`, `56`, `61`,
  `78` (any of these triggers the "taken" state and suggested alternatives).
- Try Your Luck: `1234` (4D) is available; `1111` is taken. Switch to 6D and
  try a 6-digit number.
- `Next Draw` → "Preview live" shows the 15-minute live state.
- `Login` → pick Player or Agent (any credentials work), or press 1 / 2.
- Agent Portal → "Reset numbers" clears this week's pool.

## Run locally

```bash
cd minebig
python3 -m http.server 8099
# open http://127.0.0.1:8099
```

Any static file server works. The site uses the Rubik Google Font with system
fallbacks.

## Deploy (free)

The site is fully static — drop the folder onto any static host:

- **Vercel (connected)** — push to `main`, auto-deploys to production
- **Netlify Drop** — drag the folder into https://app.netlify.com/drop
- **GitHub Pages** — push to a repo and enable Pages (root branch)

## Open items before launch

- Brand logo / visual identity (V2.0 look)
- Testimonial photos and real quotes
- Prize amounts per tier (currently RM, amounts TBD)
- Entry prices for MineBig 4D / 6D
- Draw mechanism details (officiation, generation, verification) per content doc
- Full symbolic dictionary word→number list
- Real player and agent credentials and lead routing (email/CRM) for the forms
- Hand-off mechanism for agent connection (WhatsApp / live chat / call)
- Minimum age policy confirmation (21 used per content doc reference)
- Phone number, registration number, social platform links (footer)
- Licensing confirmation for the operating region (Malaysia)
- Real draw data feed and backend for codes (currently browser-local demo logic)
