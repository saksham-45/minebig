# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS, no build step; served on Vercel (production: https://minebig.vercel.app) with auto-deploy from the public GitHub repo saksham-45/minebig. Google Fonts over CDN with system fallbacks. No backend, no payments.

## Users

- **Players** (primary public audience): Malaysian adults who play the weekly Sunday draw. Scene: checking results on a phone, weekday evenings; buy via a local agent face to face; want to know when the draw is, whether their 4- or 6-digit code won, and who to contact. No accounts required to check status — a free player login lets them save codes.
- **Agents** (portal users): verified local sellers. Scene: on their phone at the shop or market; pick a 4- or 6-digit code for a buyer, lock the code, record the sale in a permanent log book, contact winners for prize handover.

## Product Purpose

MineBig.com V2.0 is the relaunch of a 25-year-old word-of-mouth brand: the website informs and connects (draw countdown, live Sunday 12 PM event, results, testimonials, status checks, lead form), while every real transaction — ticket sale, receipt, prize — happens face to face through a verified agent. The site is currently a demo prototype; nothing on it is a real transaction.

## Positioning

"Same trust, same dreams, improved experience, better care" — a legacy name reborn (Version 2.0), where the draw is live and transparent (Sunday 12 PM, 15 minutes), every code is locked weekly so no one else can sell the same combination, results are published publicly, and prizes are delivered personally by the selling agent. The website never touches money.

## Operating Context

- Draw cadence: every Sunday 12:00 PM (visitor's local time), 15-minute live playback, then countdown to next Sunday. One countdown per game.
- Games: MineBig 4D (4-digit number) and MineBig 6D (6-digit number), per the MineBig content document. Availability is checked live per game; taken numbers are seeded sample data reset weekly. All lottery numbers site-wide, including the agent portal picker, display as single digits 0-9 forming 4- or 6-digit codes.
- Prizes: 5 tiers per game (1st, 2nd, 3rd, Special, Consolation), currency RM; amounts still TBD/pending client confirmation.
- Region: Malaysia. Licensing for the operating entity is an open item.
- One login page where player login is default, with a small "Agent login" link at the bottom; player area saves codes and shows status; agent area sells/locks codes and keeps a permanent log book.
- Demo data (winners, taken numbers, log book) lives in browser localStorage, keyed by week.

## Capabilities and Constraints

- Public pages: Home (premium banner carousel, countdown, mascot strip with live stats, 25-year heritage banner, 4-step interactive tutorial), Next Draw (4D/6D countdowns, game banners, ticket prices, recent winners, prize accordions, interactive tutorial link), Results & Winners (latest 4D/6D + timeline with winner city/country, Help & Support button), MineBig Star Numbers (Symbolic Dictionary with emojis/images, dynamic statistics), Try Your Luck (pick 4D/6D, availability, dictionary/statistics links, clipboard, agent hand-off), Play Responsibly (21+, Milly beaver pose, limits, support, privacy, terms), Biggest Sensation (content pending), Help (Contact Us + FAQ), About Us (25-year reborn story), Testimonials (prize-tier winners), Check Status (4D/6D keypad status lookup with auto-detect length + availability), Careers (content pending).
- Portals: player login → My Codes; agent login → pick/lock codes, record sales, log book, winner announcements.
- No payments, no checkout, no wallet, no online transactions of any kind.
- Static site constraint: no real backend, no real auth, no persistence beyond the browser.
- Open items (must remain visibly open, not fabricated): brand logo/visual identity, testimonial photos, prize amounts, real credentials, lead routing, licensing confirmation.

## Brand Commitments

- Name: MineBig.com; Version 2.0 ("reborn" positioning); tagline "MineBig.com is back, better than ever."; sub-line "Same trust. Same dreams. Improved experience, better care."
- About Us narrative (locked wording from captain): 25 years of trust passed along word of mouth, long before it was ever about the tech; now reborn under transformed guidance, more refined, in a fresh new attire.
- 21+ responsible-play stance per the content document (21 used as reference — confirm MineBig's actual age policy); Play Responsibly, Privacy, Disclaimer & Terms pages exist.
- Captain's design brief for this pass: more beautiful and stylish, "silent yet catchy", fully mobile-device friendly, change every element that needs changing. No payments surface.

## Evidence on Hand

- Full product spec conversation (Claude share 633a3e90-dcfa-4017-bf19-2fba94373033): site structure, weekly cycle, prize tiers, agent portal rules (permanent log book, weekly reset, code locking).
- Magnum 4D (magnum4d.my) researched as closest comparable Malaysian lottery site: results-first homepage, transparency/"how draws work" section, where-to-claim guidance, lucky number widget, FAQ/responsibility/legal pages, newsletter, rich footer.
- Live demo site at /Users/saksham/minebig (source) and https://minebig.vercel.app (deployed).
- Absences that must not be fabricated: real prize amounts, real winner photos, real logo, real agent credentials, licensing confirmation.

## Product Principles

1. The website informs and connects; the agent delivers — never simulate a transaction.
2. Transparency is the product: live draw, published results, weekly code locks, permanent sale records.
3. A small weekly chance should feel like care and hope, not pressure or gambling mechanics.
4. Demo prototype: every sample datum stays visibly sample, every open item stays open.
5. Work beautifully on a phone first — that is where players and agents live.

## Accessibility & Inclusion

- Mobile-first responsive; keyboard focus visible; reduced-motion respected (design target for this pass).
- No product-specific accessibility standard was established beyond general web practice.
