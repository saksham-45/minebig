#!/usr/bin/env python3
"""Write the MineBig dictionary icon pack (gold/noir SVGs)."""
from pathlib import Path

OUT = Path("/Users/saksham/minebig/img/dict")
G = "#ffc000"
GD = "#f5a800"
INK = "#171B1F"
FILL = "#fff3c4"

HEAD = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">'
FOOT = "</svg>"
ST = f'stroke="{G}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"'


def svg(body):
    return HEAD + body + FOOT


ICONS = {
    "_default": f'''
  <circle cx="32" cy="32" r="22" fill="{FILL}" {ST}/>
  <path d="M32 16l3.6 11.2H48l-10 7.2 3.8 11.6L32 39.2 22.2 46l3.8-11.6-10-7.2h12.4Z" fill="{G}" stroke="{GD}" stroke-width="1.4" stroke-linejoin="round"/>
''',
    "rose": f'''
  <circle cx="32" cy="26" r="12" fill="{FILL}" {ST}/>
  <path d="M32 18c4 3 6 6 6 8s-2 5-6 5-6-3-6-5 2-5 6-8Z" fill="{G}" {ST}/>
  <path d="M32 38v12M32 42c-6 2-10 6-10 10M32 42c6 2 10 6 10 10" {ST}/>
''',
    "raven": f'''
  <path d="M14 36c8-2 12-12 20-14 6-2 12 2 16 8-6 0-10 2-12 6 8 0 14 4 18 10H18c-4-4-6-8-4-10Z" fill="{FILL}" {ST}/>
  <path d="M34 24c4-8 10-10 14-8" {ST}/>
  <circle cx="28" cy="30" r="1.6" fill="{INK}"/>
''',
    "flower": f'''
  <circle cx="32" cy="32" r="6" fill="{G}" {ST}/>
  <path d="M32 12c6 6 6 12 0 14-6-2-6-8 0-14Z" fill="{FILL}" {ST}/>
  <path d="M32 52c-6-6-6-12 0-14 6 2 6 8 0 14Z" fill="{FILL}" {ST}/>
  <path d="M12 32c6-6 12-6 14 0-2 6-8 6-14 0Z" fill="{FILL}" {ST}/>
  <path d="M52 32c-6 6-12 6-14 0 2-6 8-6 14 0Z" fill="{FILL}" {ST}"/>
''',
    "cat": f'''
  <path d="M16 28l6-12 6 8 8-8 6 12c2 10-4 22-16 22S14 38 16 28Z" fill="{FILL}" {ST}/>
  <circle cx="26" cy="34" r="2" fill="{INK}"/>
  <circle cx="38" cy="34" r="2" fill="{INK}"/>
  <path d="M30 40h4M28 44c2 2 6 2 8 0" {ST}/>
''',
    "snake": f'''
  <path d="M12 40c8-16 12-4 20-4s10-14 20-8c2 10-6 18-16 16S24 52 12 44" fill="{FILL}" {ST}/>
  <circle cx="48" cy="30" r="1.8" fill="{INK}"/>
''',
    "fish": f'''
  <path d="M10 32c8-12 28-14 36-6-8 8-28 6-36 6Z" fill="{FILL}" {ST}/>
  <path d="M46 26l12-8v24L46 38" fill="{FILL}" {ST}/>
  <circle cx="22" cy="30" r="2" fill="{INK}"/>
''',
    "bird": f'''
  <path d="M14 36c8-14 22-16 30-8 2 8-6 16-16 18-8 0-14-4-14-10Z" fill="{FILL}" {ST}/>
  <path d="M44 28l12-10" {ST}/>
  <circle cx="28" cy="30" r="1.8" fill="{INK}"/>
''',
    "lotus": f'''
  <path d="M32 50c-10-4-16-14-16-22 8 4 14 8 16 14 2-6 8-10 16-14 0 8-6 18-16 22Z" fill="{FILL}" {ST}/>
  <path d="M32 50c-6-12-6-22 0-28 6 6 6 16 0 28Z" fill="{G}" {ST}/>
  <path d="M16 28h32" {ST}/>
''',
    "mango": f'''
  <path d="M24 18c12-8 26 2 24 18-2 14-16 22-26 16S12 26 24 18Z" fill="{FILL}" {ST}/>
  <path d="M34 16c4-8 12-8 14-4" {ST}/>
''',
    "durian": f'''
  <ellipse cx="32" cy="34" rx="16" ry="18" fill="{FILL}" {ST}/>
  <path d="M32 16l3 8 8-2-4 8 8 4-8 4 4 8-8-2-3 8-3-8-8 2 4-8-8-4 8-4-4-8 8 2Z" {ST}/>
''',
    "rain": f'''
  <path d="M20 28h22c6 0 10 4 10 9s-4 9-10 9H22c-7 0-12-5-12-11s6-10 14-8c2-6 8-10 14-8" fill="{FILL}" {ST}/>
  <path d="M24 50v6M32 48v8M40 50v6" {ST}/>
''',
    "lightning": f'''
  <path d="M34 8L18 34h12L22 56l24-30H34L42 8H34Z" fill="{G}" stroke="{GD}" stroke-width="2" stroke-linejoin="round"/>
''',
    "moon": f'''
  <path d="M40 12a20 20 0 1 0 8 36 22 22 0 0 1-8-36Z" fill="{FILL}" {ST}/>
''',
    "sun": f'''
  <circle cx="32" cy="32" r="10" fill="{G}" {ST}/>
  <path d="M32 8v6M32 50v6M8 32h6M50 32h6M14 14l4 4M46 46l4 4M14 50l4-4M46 18l4-4" {ST}/>
''',
    "star": f'''
  <path d="M32 8l6.2 18.8H58L42 38.4 48.4 58 32 46.8 15.6 58 22 38.4 6 26.8h19.8Z" fill="{G}" stroke="{GD}" stroke-width="1.8" stroke-linejoin="round"/>
''',
    "boat": f'''
  <path d="M12 42h40l-6 10H18L12 42Z" fill="{FILL}" {ST}/>
  <path d="M32 12v30M32 12l16 22H16L32 12Z" fill="{G}" {ST}/>
''',
    "train": f'''
  <rect x="12" y="18" width="40" height="26" rx="6" fill="{FILL}" {ST}/>
  <path d="M12 32h40M22 18v-6h12v6" {ST}/>
  <circle cx="22" cy="50" r="4" fill="{G}" {ST}/>
  <circle cx="42" cy="50" r="4" fill="{G}" {ST}/>
''',
    "car": f'''
  <path d="M10 36l6-12h20l10 12v10H10V36Z" fill="{FILL}" {ST}/>
  <path d="M16 24l4-8h14l6 8" {ST}/>
  <circle cx="20" cy="48" r="4" fill="{G}" {ST}/>
  <circle cx="44" cy="48" r="4" fill="{G}" {ST}/>
''',
    "house": f'''
  <path d="M10 30L32 10l22 20v24H10V30Z" fill="{FILL}" {ST}/>
  <path d="M26 54V38h12v16" {ST}/>
''',
    "tree": f'''
  <circle cx="32" cy="24" r="14" fill="{FILL}" {ST}/>
  <path d="M32 30v24M24 54h16" {ST}/>
''',
    "baby": f'''
  <circle cx="32" cy="26" r="12" fill="{FILL}" {ST}/>
  <path d="M20 50c2-8 8-12 12-12s10 4 12 12" {ST}/>
  <circle cx="27" cy="26" r="1.8" fill="{INK}"/>
  <circle cx="37" cy="26" r="1.8" fill="{INK}"/>
  <path d="M28 32c2 2 6 2 8 0" {ST}/>
''',
    "wedding": f'''
  <circle cx="26" cy="32" r="12" fill="{FILL}" {ST}/>
  <circle cx="38" cy="32" r="12" fill="{FILL}" {ST}"/>
  <path d="M32 22v20" {ST}/>
''',
    "funeral": f'''
  <path d="M32 12c6 8 8 16 0 28-8-12-6-20 0-28Z" fill="{G}" {ST}/>
  <rect x="28" y="40" width="8" height="12" rx="1" fill="{FILL}" {ST}/>
  <path d="M22 54h20" {ST}/>
''',
    "gold": f'''
  <ellipse cx="32" cy="32" rx="18" ry="18" fill="{FILL}" {ST}/>
  <path d="M24 32h16M32 24v16" {ST}/>
  <circle cx="32" cy="32" r="10" {ST}/>
''',
    "water": f'''
  <path d="M32 8c12 16 18 24 18 34a18 18 0 0 1-36 0c0-10 6-18 18-34Z" fill="{FILL}" {ST}"/>
''',
    "fire": f'''
  <path d="M32 58c-12-2-18-14-14-26 8 4 10-6 8-16 12 8 22 18 20 32-2 8-8 12-14 10Z" fill="{G}" stroke="{GD}" stroke-width="2.2" stroke-linejoin="round"/>
''',
    "dragon": f'''
  <path d="M10 40c8-18 16-8 24-12 6-4 8-12 16-10-2 8 2 14 8 16-8 4-16 2-20 8 8 4 10 12 4 16H18c-6-2-10-8-8-18Z" fill="{FILL}" {ST}/>
  <path d="M46 18l6-8M50 20l8-4" {ST}"/>
  <circle cx="48" cy="22" r="1.6" fill="{INK}"/>
''',
    "phoenix": f'''
  <path d="M32 20c10-10 22-6 24 4-10 2-16 8-18 16 12 2 18 10 16 18H22c-8-6-10-16-4-24-4-8 2-16 14-14Z" fill="{FILL}" {ST}/>
  <path d="M18 28c-8 0-12-6-10-12" {ST}"/>
  <circle cx="38" cy="26" r="1.6" fill="{INK}"/>
''',
    "tiger": f'''
  <path d="M14 28l6-12 8 6 8-6 6 12c2 12-4 24-16 24S12 40 14 28Z" fill="{FILL}" {ST}"/>
  <path d="M24 30v6M32 28v8M40 30v6" {ST}/>
  <circle cx="26" cy="34" r="1.8" fill="{INK}"/>
  <circle cx="38" cy="34" r="1.8" fill="{INK}"/>
''',
    "elephant": f'''
  <path d="M16 30c0-10 8-16 18-16 12 0 18 8 18 16v16H38V38c0-4-2-6-6-6H16V30Z" fill="{FILL}" {ST}"/>
  <path d="M16 32c-6 6-8 14-4 20" {ST}"/>
  <circle cx="40" cy="28" r="1.8" fill="{INK}"/>
  <circle cx="22" cy="50" r="3.2" fill="{G}" {ST}"/>
  <circle cx="46" cy="50" r="3.2" fill="{G}" {ST}"/>
''',
}

# fix accidental extra quote in flower last path
ICONS["flower"] = f'''
  <circle cx="32" cy="32" r="6" fill="{G}" {ST}/>
  <path d="M32 12c6 6 6 12 0 14-6-2-6-8 0-14Z" fill="{FILL}" {ST}/>
  <path d="M32 52c-6-6-6-12 0-14 6 2 6 8 0 14Z" fill="{FILL}" {ST}/>
  <path d="M12 32c6-6 12-6 14 0-2 6-8 6-14 0Z" fill="{FILL}" {ST}/>
  <path d="M52 32c-6 6-12 6-14 0 2-6 8-6 14 0Z" fill="{FILL}" {ST}"/>
'''

# fix wedding extra quote
ICONS["wedding"] = f'''
  <circle cx="26" cy="32" r="12" fill="{FILL}" {ST}/>
  <circle cx="38" cy="32" r="12" fill="{FILL}" {ST}"/>
  <path d="M32 22v20" {ST}"/>
'''

# water extra quote
ICONS["water"] = f'''
  <path d="M32 8c12 16 18 24 18 34a18 18 0 0 1-36 0c0-10 6-18 18-34Z" fill="{FILL}" {ST}"/>
'''

# dragon extra quote
ICONS["dragon"] = f'''
  <path d="M10 40c8-18 16-8 24-12 6-4 8-12 16-10-2 8 2 14 8 16-8 4-16 2-20 8 8 4 10 12 4 16H18c-6-2-10-8-8-18Z" fill="{FILL}" {ST}"/>
  <path d="M46 18l6-8M50 20l8-4" {ST}"/>
  <circle cx="48" cy="22" r="1.6" fill="{INK}"/>
'''


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, body in ICONS.items():
        path = OUT / f"{name}.svg"
        path.write_text(svg(body), encoding="utf-8")
        print(path.name)


if __name__ == "__main__":
    main()
