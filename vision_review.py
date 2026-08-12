import base64, json, urllib.request, sys, os

# Review key pages at both viewports with llama3.2-vision:11b
targets = [
    ("/tmp/mb-1440-index.png", "index desktop"),
    ("/tmp/mb-390-index.png", "index mobile"),
    ("/tmp/mb-1440-upcoming.png", "upcoming desktop"),
    ("/tmp/mb-390-upcoming.png", "upcoming mobile"),
    ("/tmp/mb-1440-winning.png", "winning desktop"),
    ("/tmp/mb-390-winning.png", "winning mobile"),
    ("/tmp/mb-1440-check.png", "check desktop"),
    ("/tmp/mb-390-check.png", "check mobile"),
    ("/tmp/mb-1440-login.png", "login desktop"),
    ("/tmp/mb-390-login.png", "login mobile"),
    ("/tmp/mb-1440-agent-portal.png", "agent portal desktop"),
    ("/tmp/mb-390-agent-portal.png", "agent portal mobile"),
]

Q = ("This is a black-background teletext-style lottery website page. "
     "Report ONLY real visual defects: (1) any content partially cut off or clipped at edges, "
     "(2) misaligned or asymmetric elements, (3) text overflowing its box, (4) overlapping elements, "
     "(5) inconsistent spacing that looks broken. If the page looks clean, reply exactly: CLEAN. "
     "Be terse; max 3 bullets.")

def ask(path, label):
    img = base64.b64encode(open(path, "rb").read()).decode()
    body = {
        "model": "llama3.2-vision:11b",
        "messages": [{"role": "user", "content": [
            {"type": "image_url", "image_url": {"url": "data:image/png;base64," + img}},
            {"type": "text", "text": Q},
        ]}],
        "stream": False, "max_tokens": 160,
    }
    req = urllib.request.Request("http://127.0.0.1:11434/v1/chat/completions",
                                 data=json.dumps(body).encode(), headers={"Content-Type": "application/json"})
    try:
        r = json.load(urllib.request.urlopen(req, timeout=240))
        return r["choices"][0]["message"]["content"].strip()
    except Exception as e:
        return "ERROR: %s" % e

for path, label in targets:
    if not os.path.exists(path):
        print(label, ": missing screenshot")
        continue
    verdict = ask(path, label)
    print("== %s ==\n%s\n" % (label, verdict))
    sys.stdout.flush()
