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
  (Star Numbers, Help) on hover/focus with white cards; search, on-the-fly
  language switcher using the free Google Translate widget (English, Hindi,
  Tamil, Telugu, Kannada, Malayalam, Spanish, French, German, Italian), and a
  gold **Log In** pill (defaults to Player login with an Agent link). Mobile:
  hamburger → full drawer with grouped sub-links.
- **Banner slider (home):** A touch-swipeable premium carousel with 3 rotating
  banners: banner 1 gets a motion graphic where a gold price box explodes with
  confetti and reveals three grand prize cards, banner 2 keeps its get-started
  steps and adds a 'How to Play' button anchoring to the interactive tutorial,
  and banner 3 is a winners spotlight with a real quote. Auto-advance 7s,
  dots + arrows, pause on hover/touch, reduced-motion respected.
- **Mascot Strip & Mascot SVG:** High-quality original SVG friendly beaver mascot
  (hero pose and responsible-play pose) replacing old mannequins. Home page uses
  a mobile-friendly mascot strip with live stats instead of a marquee ticker.
  Responsible-play pose carries the key messages on the play-responsibly page.
- **Heroes & Heritage Banner:** noir + gold-glow radial, floating glossy number balls.
  The 25-years hero is a premium heritage banner featuring paragraph text up top,
  Mine Big title and winner quote at the bottom, and single-digit lucky numbers inside.
- **Interactive Tutorial:** A new interactive 4-step 'How the draw works' tutorial
  (pick 6 digits on keypad, ticket step, draw reveal with match verdict, claim step)
  replacing static steps. Tutorial cards link here wherever 'see how it works' appears.
- **Buttons:** pills with gold/blue/orange/green gradients, lift
  `translateY(-2px)` on hover, deeper shadow; press shifts down 1px.
- **Number balls:** all lottery numbers site-wide display as single digits 0-9
  forming 4- or 6-digit codes (winners archive, portals, testimonials, check page,
  agent portal picker). Visualized as glossy radial-gold circles with black numerals;
  color variants per game/tier.
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

One authored moment per surface: banner slider premium touch-swipe carousel transitions, confetti gold price box explosion (home), countdown seconds blink, floating hero balls, button lift, and interactive tutorial animations. Exponential ease-out curves; no entrance stunts.

## Notes

- Age gate uses 21+ per the content document's reference (confirm MineBig's
  policy before launch).
- All hero/prize/winner copy marked `[pending client confirmation]` stays
  visibly open — nothing fabricated.
- Verified: no horizontal overflow at 1440/390px, zero console errors on all
  17 pages, availability/clipboard/login/portal flows exercised in browser.
