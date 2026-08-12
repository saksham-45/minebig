/* ============================================================
   MineBig.com V2.0 — shared demo data + week logic
   Everything here is DEMO data persisted in the browser only.
   ============================================================ */

const MINEBIG = (() => {
  // ---- weekly key: taken numbers reset every Sunday 12:00 ----
  function weekKey(d = new Date()) {
    const sunday = new Date(d);
    const day = sunday.getDay();
    sunday.setDate(sunday.getDate() - day);
    sunday.setHours(0, 0, 0, 0);
    const yearStart = new Date(sunday.getFullYear(), 0, 1);
    const week = Math.floor((sunday - yearStart) / (7 * 864e5)) + 1;
    return `${sunday.getFullYear()}-W${String(week).padStart(2, "0")}`;
  }

  function isLiveWindow(now = new Date()) {
    const day = now.getDay();
    if (day !== 0) return null; // not Sunday
    const noon = new Date(now);
    noon.setHours(12, 0, 0, 0);
    const end = new Date(noon.getTime() + 15 * 60 * 1000);
    if (now >= noon && now < end) return end; // live until this time
    return null;
  }

  function nextSundayNoon(now = new Date()) {
    const t = new Date(now);
    const days = (7 - t.getDay()) % 7;
    t.setDate(t.getDate() + days);
    t.setHours(12, 0, 0, 0);
    return t;
  }

  // ---- seeded "taken" numbers for the demo (weekly) ----
  const SEED_TAKEN = [4, 7, 12, 19, 23, 27, 33, 41, 49, 56, 61, 78];

  function storageKey(prefix) {
    return `${prefix}_${weekKey()}`;
  }

  function getTaken() {
    try {
      const raw = localStorage.getItem(storageKey("minebig_taken"));
      if (raw) return new Set(JSON.parse(raw));
    } catch (e) { /* fall through to seed */ }
    return new Set(SEED_TAKEN);
  }

  function setTaken(set) {
    localStorage.setItem(storageKey("minebig_taken"), JSON.stringify([...set]));
  }

  function isTaken(n) {
    return getTaken().has(Number(n));
  }

  function suggestAlternatives(n, count = 5) {
    const taken = getTaken();
    const out = [];
    let i = 1;
    let cand = Number(n) + 1;
    while (out.length < count && i < 200) {
      if (!taken.has(cand) && cand > 0) out.push(cand);
      cand += 1;
      i += 1;
    }
    i = 1; cand = Number(n) - 1;
    while (out.length < count && i < 200) {
      if (!taken.has(cand) && cand > 0) out.push(cand);
      cand -= 1;
      i += 1;
    }
    return out;
  }

  // ---- demo log book (agent portal, permanent once submitted) ----
  function getLogbook() {
    try { return JSON.parse(localStorage.getItem("minebig_logbook")) || []; }
    catch (e) { return []; }
  }
  function addLogEntry(entry) {
    const book = getLogbook();
    book.unshift({ id: Date.now(), ...entry });
    localStorage.setItem("minebig_logbook", JSON.stringify(book));
  }

  // ---- demo winners archive: last 3 months of Sunday draws ----
  const TIERS = [
    { key: "first", label: "1st", cls: "" },
    { key: "second", label: "2nd", cls: "mag" },
    { key: "third", label: "3rd", cls: "teal" },
    { key: "special", label: "Special Prize", cls: "violet" },
    { key: "c1", label: "Consolation 1", cls: "mag" },
    { key: "c2", label: "Consolation 2", cls: "teal" },
    { key: "c3", label: "Consolation 3", cls: "" },
  ];

  const WINNERS = [
    { date: "2026-08-09", nums: [4, 19, 27, 33, 41, 49], winners: { first: "Aiman R.", second: "Siti N.", third: "Wei L.", special: "Kumar V.", c1: "Farah Z.", c2: "Jason T.", c3: "Mei H." } },
    { date: "2026-08-02", nums: [8, 14, 22, 37, 45, 60], winners: { first: "Daniel O.", second: "Nurul A.", third: "Hafiz M.", special: "Priya S.", c1: "Azlan K.", c2: "Sarah W.", c3: "Bob C." } },
    { date: "2026-07-26", nums: [3, 11, 28, 34, 52, 66], winners: { first: "Lina C.", second: "Ravi D.", third: "Amira Y.", special: "Tommy B.", c1: "Shah R.", c2: "Grace L.", c3: "Ivan P." } },
    { date: "2026-07-19", nums: [9, 16, 25, 39, 48, 55], winners: { first: "Zack M.", second: "Hana I.", third: "Omar F.", special: "Dina Q.", c1: "Ken W.", c2: "Alya E.", c3: "Rizal J." } },
    { date: "2026-07-12", nums: [6, 13, 21, 40, 47, 58], winners: { first: "Maya T.", second: "Eddy G.", third: "Suria B.", special: "Vikram N.", c1: "Lily H.", c2: "Rudy S.", c3: "Nina O." } },
    { date: "2026-07-05", nums: [2, 17, 30, 36, 44, 62], winners: { first: "Ali P.", second: "Joan K.", third: "Faisal D.", special: "Tina W.", c1: "Marcus J.", c2: "Zara M.", c3: "Heng L." } },
    { date: "2026-06-28", nums: [10, 15, 24, 43, 51, 64], winners: { first: "Nadia R.", second: "Chris B.", third: "Yusof A.", special: "Pam G.", c1: "Liam X.", c2: "Aina S.", c3: "Denzel F." } },
    { date: "2026-06-21", nums: [5, 18, 26, 35, 50, 57], winners: { first: "Kevin L.", second: "Rose T.", third: "Ammar Z.", special: "Iqbal H.", c1: "Cindy Y.", c2: "Samy V.", c3: "Ella N." } },
    { date: "2026-06-14", nums: [1, 20, 29, 38, 46, 59], winners: { first: "Fatin M.", second: "Randy P.", third: "Joe W.", special: "Sunita K.", c1: "Arif B.", c2: "Dora E.", c3: "Hans G." } },
    { date: "2026-06-07", nums: [7, 12, 31, 42, 53, 63], winners: { first: "Peter C.", second: "Laila D.", third: "Sam O.", special: "Rina J.", c1: "Tony H.", c2: "Mila F.", c3: "Zain A." } },
    { date: "2026-05-31", nums: [11, 23, 32, 41, 54, 61], winners: { first: "Grace K.", second: "Ahmad S.", third: "Vera L.", special: "Hock T.", c1: "Bella R.", c2: "Oscar M.", c3: "Jia W." } },
    { date: "2026-05-24", nums: [13, 19, 27, 40, 49, 60], winners: { first: "Rizwan Q.", second: "Amy C.", third: "Dato S.", special: "Nora B.", c1: "Felix P.", c2: "Uma K.", c3: "Ben H." } },
    { date: "2026-05-17", nums: [4, 16, 25, 37, 52, 58], winners: { first: "Sharon V.", second: "Imran G.", third: "Kai L.", special: "Muthu R.", c1: "Ada T.", c2: "Nana W.", c3: "Roy D." } },
  ];

  // ---- lifetime frequency: how often each number has won ----
  function lifetimeCounts() {
    const counts = {};
    for (const draw of WINNERS) {
      for (const n of draw.nums) counts[n] = (counts[n] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0] - b[0]);
  }

  // ---- demo ticket-status lookup ----
  const DEMO_WIN_CODE = "4-19-27-33-41-49"; // the demo winning code
  function normalize(code) {
    return code.trim().split(/[\s,\-;]+/).filter(Boolean).join("-");
  }
  function lookupTicket(codeStr) {
    const c = normalize(codeStr);
    if (!c) return { status: "missing" };
    if (c === DEMO_WIN_CODE) return { status: "win", code: c };
    const nums = c.split("-").map(Number);
    if (nums.some((n) => isTaken(n))) return { status: "taken", code: c };
    return { status: "notfound", code: c };
  }

  // ---- agent session ----
  function agentName() {
    try { return sessionStorage.getItem("minebig_agent") || null; }
    catch (e) { return null; }
  }
  function setAgent(name) {
    sessionStorage.setItem("minebig_agent", name);
  }
  function clearAgent() {
    sessionStorage.removeItem("minebig_agent");
  }

  return {
    weekKey, isLiveWindow, nextSundayNoon,
    getTaken, setTaken, isTaken, suggestAlternatives,
    getLogbook, addLogEntry,
    TIERS, WINNERS, lifetimeCounts,
    DEMO_WIN_CODE, lookupTicket,
    agentName, setAgent, clearAgent,
  };
})();
