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
| Home | `index.html` | Premium touch-swipeable banner carousel, next-draw countdown, mascot strip with live stats, 25-year heritage banner, 4-step interactive tutorial |
| Next Draw | `upcoming.html` | Countdowns for MineBig 4D & 6D, game banners, ticket prices, recent-winners sample, prize accordions, interactive tutorial link |
| Results & Winners | `winning.html` | Latest 4D/6D results, browsable results timeline (winner city/country only), Help & Support buttons |
| Star Numbers | `star-numbers.html` | Searchable Symbolic Dictionary with emojis/images, dynamic digit statistics |
| Try Your Luck | `try-your-luck.html` | Pick numbers (4D/6D), live availability check, links to Symbolic Dictionary/Statistics, clipboard, agent hand-off |
| Play Responsibly | `play-responsibly.html` | 21+ age banner, lantern ghost mascot, know-your-limits, support resources, privacy & terms |
| Biggest Sensation | `biggest-sensation.html` | Content pending (per content doc) |
| Help — FAQs | `faq.html` | Categorized accordion: Getting Started, Buying, Draws, Prizes, Account |
| Help — Contact | `contact.html` | Customer service info + contact form |
| Careers | `careers.html` | Content pending (footer link) |
| About | `about.html` | 25-year reborn story + how the site works |
| Testimonials | `testimonials.html` | Latest-draw winners grouped by prize tier |
| Check Status | `check.html` | Ticket status lookup (keypad entry for 4D or 6D, auto-detects length) + 4- or 6-digit code availability |

One login, two channels:

| Page | Path | What it does |
|---|---|---|
| Login | `login.html` | Player login by default; small "Agent login" link at the bottom opens the agent channel |
| My Account | `user-portal.html` | Player channel: save ticket codes, see win/sold/not-found status, latest draw |
| Agent Portal | `agent-portal.html` | Agent channel: pick/lock 6-digit codes with per-code locking, record sale → permanent log book → winner announcements |

## Weekly logic (implemented)

- Draws run **every Sunday at 12:00 PM** (visitor's local time), last 15 minutes
  — one countdown per game (MineBig 4D, MineBig 6D).
- Codes are **4 digits (MineBig 4D) or 6 digits (MineBig 6D)** built from
  single digits 0-9; a bought code is **locked** for that week.
- **Every Sunday the pool resets** — taken codes are keyed by week
  (`minebig_taken_<game>_<year-W##>`).
- Log book entries are **permanent** — no edit or delete.
- Try Your Luck availability is per game (4D = 4 digits, 6D = 6 digits), seeded
  with sample "taken" numbers, reset weekly. The selection clipboard persists
  in localStorage until cleared and hands off to the agent form.

## Demo tips

- Winning demo code (check page): the latest draw's first-prize code per game
  (defaults: 6D `482196`, 4D `4821`) → shows the WINNER result.
- Taken demo codes: 6D `111111`, `000000`, `888888`, … and 4D `1111`, `0000`,
  `8888`, … (see `SEED_TAKEN_BY_GAME` in `js/data.js`).
- Try Your Luck: `1234` (4D) is available; `1111` is taken. Switch to 6D and
  try a 6-digit code.
- `Next Draw` → "Preview live" shows the 15-minute live state.
- `Login` → player login by default; the bottom "Agent login" link opens the agent channel (any credentials work).
- Agent Portal → "Reset numbers" clears this week's locked codes.

## Run locally

```bash
cd minebig
python3 -m http.server 8099
# open http://127.0.0.1:8099
```

Any static file server works. The site uses the Rubik Google Font with system
fallbacks.

## Symbolic Dictionary Tooling

A zero-dependency Node tool (`scripts/dictionary-tool.mjs`) is provided to import and export the Symbolic Dictionary. It syncs the dictionary data in `js/data.js` with the CSV file `data/symbolic-dictionary.csv`.

- **Export dictionary to CSV:**
  ```bash
  node scripts/dictionary-tool.mjs export
  ```
- **Import dictionary from CSV:**
  ```bash
  node scripts/dictionary-tool.mjs import
  ```

CSV schema (header row required):
- `word`: the symbol's name (string)
- `nums`: one or more 4-digit numbers, joined with `|` (e.g. `0417|2914`)
- `symbol`: an emoji shown when no image is set
- `image`: optional image URL; wins over `symbol` when set
- `meaning`: optional free-text meaning shown under the word

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
- Real draw data feed and backend for codes (currently browser-local demo logic; an optional published Google Sheet CSV feed slot lives in `js/data.js` as `RESULTS_SHEET_CSV_URL` with columns `date,game,num`)
