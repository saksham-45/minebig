import base64, json, urllib.request, glob, os, sys

import os
KEY = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
MODEL = os.environ.get("GEMINI_QA_MODEL", "gemini-3.1-pro-preview")

Q = (
    "Act as a senior design QA reviewer. This is a black-background teletext-style lottery "
    "website (public pages + agent/player portals). List EVERY design, UI and UX defect you can "
    "see, across ALL these categories: "
    "(1) cut-off/clipped content or text overflow, "
    "(2) overlapping elements or colliding hit areas, "
    "(3) alignment and symmetry problems (headers, buttons, grids, footer), "
    "(4) spacing inconsistencies (uneven margins/paddings/gaps), "
    "(5) typography issues (inconsistent sizes, bad hierarchy, cramped or oversized type), "
    "(6) contrast/readability problems, "
    "(7) hierarchy problems (what should stand out vs recede), "
    "(8) visual noise or distraction, "
    "(9) empty/awkward whitespace or dead zones, "
    "(10) anything that looks broken, unfinished or cheap. "
    "Be specific: name the element and what is wrong. If a category has no issue, skip it. "
    "If the page is genuinely clean, reply exactly: CLEAN. Terse bullets only."
)

def ask(path):
    img = base64.b64encode(open(path, "rb").read()).decode()
    body = {"contents": [{"parts": [
        {"inline_data": {"mime_type": "image/png", "data": img}},
        {"text": Q}]}],
        "generationConfig": {"maxOutputTokens": 900}}
    req = urllib.request.Request(
        "https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s" % (MODEL, KEY),
        data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
    try:
        r = json.load(urllib.request.urlopen(req, timeout=180))
        return r["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        return "ERROR: %s" % e

paths = sorted(glob.glob("/tmp/mb-*.png"))
issues = []
for p in paths:
    label = os.path.basename(p)
    verdict = ask(p)
    print("== %s ==\n%s\n" % (label, verdict))
    sys.stdout.flush()
    if "CLEAN" not in verdict.upper():
        issues.append((label, verdict))
print("SUMMARY: %d pages, %d with findings" % (len(paths), len(issues)))
