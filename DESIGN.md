# Design

<!-- impeccable:design-schema 1 -->

Surface: MineBig.com V2.0 — public lottery/draw website + player/agent areas.
Documented from the built world (ground truth over intention).

## World

**Teletext Results Service** (chosen by the captain via the impeccable direction
page; seed e8b9b4b6; challenger fused: broadcast teletext magazine).

The draw announces like a teletext broadcast: flat black CRT ground with subtle
scanlines, page-numbered navigation (P100–P520), yellow double-height headers,
cyan live figures, block-mosaic number tiles, REVEAL and HOLD states, keyed-digit
input. The captain's later marketing steer added a flashy hero layer on top:
logo-left/search-right top bar, hero banner with mosaic artwork, "Get yours now"
CTA, next-winner countdown row, a moving info ticker, and a scrollable "Inside
MineBig" carousel led by "What our winners say".

## Palette

Broadcast eight on black (teletext's fixed palette, not a picked scheme):

- Black `#000000` ground (CRT), panels `#0a0a0a` / `#111`
- White `#ffffff` body text
- Yellow `#ffff00` — headers, primary CTA, winners
- Cyan `#00ffff` — live figures, countdown, links, availability
- Magenta `#ff00ff` — special tier, V2.0 chip, accents
- Green `#00ff00` — available states
- Red `#ff0000` — alerts, LIVE, demo band, 18+ (always as block fill with black glyphs)

Rule: colored elements are filled blocks with black glyphs — never colored text
on dark at small sizes. Contrast floor: black-on-color blocks everywhere.

## Type

- Display + body + data: **VT323** (teletext bitmap face), fallback ui-monospace.
- Sizes: body 16–17px; h1 clamp(34–58px) line-height ~1.1–1.18 uppercase;
  section titles 27–34px uppercase yellow; countdown figures 30–60px cyan.
- Uppercase reserved for headings, labels, buttons, control rows — not prose.

## Components

- **Top bar:** logo (M tile + wordmark + V2.0 chip) left; page chip + live clock
  (blinking seconds) + Search button right. Second row: page strip (numbered
  tabs) ending in a Login button. Mobile: clock/chip hidden, strip collapses to
  a Pages/Index toggle.
- **Search panel:** keyword jump list — Next draw & countdown, Past results,
  Check a ticket, About us, What our winners say, Connect to an agent, FAQ,
  Play responsibly, Login — each links to its numbered page. Closes on
  outside click / Escape.
- **Hero banner:** copy + CTA left, block-mosaic SVG scene right (trophy, balls,
  confetti, SUNDAY 12PM), stacks on mobile. No eyebrow.
- **Next winner row:** "Next winner on SUN 16 AUG 2026 · 12:00 PM" + live
  countdown units (blinking seconds).
- **Ticker:** infinite marquee of live facts (winners so far, tickets left,
  draw times); duplicated track for seamless loop; static under
  prefers-reduced-motion. (Captain-requested marketing element.)
- **Carousel:** scroll-snap slides — What our winners say / Latest draw /
  Lucky numbers / How it works; arrow + dot controls; instant scroll
  (smooth+mandatory snap stalls in Chromium).
- **Blocks:** cards = flat panels, hard 2px rules, zero radius/blur/gradient
  (except scanlines). Buttons = solid blocks, press = 2px shift.
- **States:** REVEAL (results), HOLD (countdown freeze), blinking LIVE/seconds,
  hover = solid color fills with black glyphs, keyboard focus = 3px yellow
  outline, reduced motion respected for blink/scroll.

## Motion

Blink (demo band, LIVE, seconds, play button) — the broadcast idiom; ticker
marquee; press-shift buttons. One authored moment per surface; no entrance
animation stunts.

## Notes

- Detector findings on hover-state contrast are resolution noise: every hover
  rule pairs a solid fill with black glyphs (verified in computed styles).
- Scanlines are the world's deliberate CRT texture (detector's
  repeating-stripes flag accepted).
- Login: one page (P500), role cards Player/Agent (keys 1/2) → P510/P520.
