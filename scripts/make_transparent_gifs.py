#!/usr/bin/env python3
"""Chroma-key magenta frames to transparent looping GIFs."""
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

SRC = Path("/Users/saksham/.grok/sessions/%2FUsers%2Fsaksham/01a0162c-7c79-7610-abb9-a167b83735c9/images")
OUT = Path("/Users/saksham/minebig/img")


def chroma(path, size=480):
    im = Image.open(path).convert("RGBA")
    if max(im.size) > size:
        im.thumbnail((size, size), Image.Resampling.LANCZOS)
    arr = np.asarray(im).astype(np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    # Pink/magenta plate: red and blue both beat green.
    mag_ness = np.minimum(r, b) - g
    alpha = np.full(r.shape, 255.0, dtype=np.float32)
    mid = (mag_ness > 22) & (g < 195) & (r > 100) & (b > 70)
    strong = (mag_ness > 45) & (g < 175) & (r > 130) & (b > 90)
    alpha[mid] = np.clip((48.0 - mag_ness[mid]) / 26.0 * 255.0, 0, 255)
    alpha[strong] = 0
    # Kill leftover magenta cast on kept pixels (spill suppression).
    spill = (r > g + 12) & (b > g + 8) & (alpha > 0)
    pull = np.minimum(r - g, b - g) * 0.85
    r = np.where(spill, r - pull, r)
    b = np.where(spill, b - pull, b)
    arr[:, :, 0] = np.clip(r, 0, 255)
    arr[:, :, 2] = np.clip(b, 0, 255)
    arr[:, :, 3] = alpha
    out = Image.fromarray(arr.astype(np.uint8), "RGBA")
    a = out.split()[-1].filter(ImageFilter.GaussianBlur(0.45))
    out.putalpha(a)
    return out


def to_p(im):
    alpha = im.split()[-1]
    rgb = im.convert("RGB")
    pal = rgb.convert("P", palette=Image.ADAPTIVE, colors=255)
    mask = Image.eval(alpha, lambda a: 255 if a < 150 else 0)
    pal.paste(255, mask=mask)
    return pal


def save_gif(frames_rgba, dest, durations):
    pals = [to_p(f) for f in frames_rgba]
    pals[0].save(
        dest,
        save_all=True,
        append_images=pals[1:],
        duration=durations,
        loop=0,
        disposal=2,
        transparency=255,
        optimize=False,
    )
    print(dest, dest.stat().st_size)


def main():
    gift = [chroma(SRC / "10.jpg"), chroma(SRC / "19.jpg")]
    save_gif(gift, OUT / "gift.gif", [900, 1100])

    mascot = [chroma(SRC / "14.jpg"), chroma(SRC / "20.jpg")]
    save_gif(mascot, OUT / "mascot.gif", [700, 700])
    mascot[0].save(OUT / "mascot.png")

    steps = [
        chroma(SRC / "18.jpg"),
        chroma(SRC / "17.jpg"),
        chroma(SRC / "15.jpg"),
    ]
    save_gif(steps, OUT / "steps.gif", [1200, 1200, 1200])

    winners = [chroma(SRC / "13.jpg"), chroma(SRC / "22.jpg")]
    save_gif(winners, OUT / "winners.gif", [1400, 1400])

    coming = [chroma(SRC / "11.jpg"), chroma(SRC / "21.jpg")]
    save_gif(coming, OUT / "coming-soon.gif", [900, 1100])


if __name__ == "__main__":
    main()
