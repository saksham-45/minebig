# Design

<!-- impeccable:design-schema 1 -->

Surface: MineBig.com V2.0 — public lottery/draw website + player/agent areas.
Documented from the built world (ground truth over intention).

## World

**Jackpot Lounge** — the gameified premium-lottery world the captain pinned to
magnum4d.my as the client standard. The terminal/teletext world (previous
pass) is retired: no scanlines, no VT323, no page-number strips. The draw now
feels like a premium game night — gold, noir, and a glowing countdown.

Built and QA-verified with Gemini vision against magnum4d.my screenshots
(desktop full page, desktop hero, mobile) plus the site's own CSS tokens.

## Palette

Gold + noir on white, taken from Magnum's own stylesheet tokens:

- Gold `#ffc000` (primary) with `#ffd54f` highlight and `#f5a800` deep —
  CTAs, active nav, number balls, accents. Button gradient `#ffd54f→#ffc000`.
- Noir: `#040707` ink; hero/footer gradients from `#171a28` → `#141821` →
  `#0c0f1a`, with a gold radial glow (`rgba(255,200,0,.2)` ellipse at top)
- Blue `#00a3e3` (game 2 accent, links), Orange `#f58220`, Red `#eb2020`,
  Green `#0ea864` (available), Violet `#7b2ff7` (special tier)
- Neutrals: white ground, `#f7f8fa` section alt, `#333` body text, `#6b7078`
  dim, `#e8eaed` hairlines
- Shadows: soft navy (`0 8px 32px rgba(3,0,39,.10) + 0 4px 24px rgba(3,0,39,.07)`),
  the Magnum elevation feel

Rule: gold fills carry black glyphs; colored text only at large sizes or on
light tints. Contrast floor AA (`--dim: #6b7078` on white ≈ 5.5:1).

## Type

- **Rubik** (300–900, Google Fonts) — the Magnum face, loaded with system
  fallbacks. No monospace anywhere as costume.
- Scale: body 15.5–16px; hero h1 clamp(34–58px) weight 900, tight tracking
  (-0.02em); section titles 26–34px weight 800; labels 12–13.5px uppercase,
  tracked 0.4–1.5px. Uppercase reserved for labels, buttons, control rows.

## Components

- **Header:** sticky two-row light bar (logo row + nav row, like Magnum).
  Gold radial M tile; nav tabs pill-shaped with gold active state; dropdowns
  (Star Numbers, Help) on hover/focus with white cards; search, language
  (demo), and a gold **Log In** pill. Mobile: hamburger → full drawer with
  grouped sub-links.
- **Banner slider (home):** 3 rotating banners per the content document —
  Jackpot Hero (gold), New Player Promo (blue, 4 steps), Winners Spotlight
  (orange, pending tag). Auto-advance 7s, dots + arrows, pause on hover/touch,
  reduced-motion respected.
- **Heroes:** noir + gold-glow radial, floating glossy number balls
  (float animation, staggered).
- **Buttons:** pills with gold/blue/orange/green gradients, lift
  `translateY(-2px)` on hover, deeper shadow; press shifts down 1px.
- **Number balls:** glossy radial-gold circles with black numerals; color
  variants per game/tier.
- **Countdown:** dark cards with gold top-edge datum, large gold mono-figure
  numerals, blinking seconds, tracked uppercase labels. Two countdowns on the
  Next Draw page (4D + 6D).
- **Cards:** white, 20px radius, 1px hairline, soft navy shadow, hover
  elevation. Nested cards avoided.
- **Tables:** white rounded containers, dark header rows, gold pill number
  chips, hover row tint.
- **Clipboard (Try Your Luck):** sticky bottom panel, gold border, number
  chips with per-game labels, remove buttons, agent hand-off CTA.
- **Forms/keypad:** 2px borders, gold focus ring, rounded game-style keypad
  buttons (round, gold ENTER).
- **Footer:** dark noir trust footer — brand + socials + 21+ chip, Company
  links (FAQ, Careers, Contact Us, About, Biggest Sensation), Customer
  Service (phone/hours/email), Draw Alerts newsletter, bottom bar with
  © 2026 MineBig Corporation Sdn Bhd, Privacy, Disclaimer & Terms. Fixed
  gold "back to top" button appears after scroll.

## Motion

One authored moment per surface: banner slider cross-fade (home), countdown
seconds blink, floating hero balls, button lift, ticker marquee (paused under
reduced motion). Exponential ease-out curves; no entrance stunts.

## Notes

- Age gate uses 21+ per the content document's reference (confirm MineBig's
  policy before launch).
- All hero/prize/winner copy marked `[pending client confirmation]` stays
  visibly open — nothing fabricated.
- Verified: no horizontal overflow at 1440/390px, zero console errors on all
  17 pages, availability/clipboard/login/portal flows exercised in browser.
