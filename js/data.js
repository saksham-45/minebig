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
  const CODE_PATTERN = /^[0-9]+([\s,\-;]+[0-9]+)*$/;
  function normalize(code) {
    return code.trim().split(/[\s,\-;]+/).filter(Boolean).join("-");
  }
  function isValidCodeShape(codeStr) {
    // digits + separators only, exactly 6 natural numbers
    if (typeof codeStr !== "string" || !CODE_PATTERN.test(codeStr.trim())) return false;
    const parts = normalize(codeStr).split("-");
    return parts.length === 6 && parts.every((p) => /^[1-9][0-9]*$/.test(p));
  }
  function lookupTicket(codeStr) {
    const raw = String(codeStr || "").trim();
    if (!raw) return { status: "missing" };
    if (!CODE_PATTERN.test(raw)) return { status: "invalid", code: raw };
    const c = normalize(raw);
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

  // ============================================================
  // MineBig 4D / 6D games (content-document model)
  // ============================================================

  const GAMES = [
    {
      id: "d4",
      name: "MineBig 4D",
      digits: 4,
      tagline: "Pick your lucky 4 digits, win big.",
      price: "Entry — confirm with client",
      accent: "gold",
    },
    {
      id: "d6",
      name: "MineBig 6D",
      digits: 6,
      tagline: "Six digits, bigger shot at the jackpot.",
      price: "Entry — confirm with client",
      accent: "blue",
    },
  ];

  const PRIZE_TIERS = [
    { key: "first", label: "1st Prize" },
    { key: "second", label: "2nd Prize" },
    { key: "third", label: "3rd Prize" },
    { key: "special", label: "Special" },
    { key: "consolation", label: "Consolation" },
  ];

  // Demo draw archive per game — most recent first.
  // Winner identity is never shown: only city + country (per content doc).
  const DRAWS = {
    d4: [
      { date: "2026-08-09", num: "4821", city: "Kuala Lumpur", country: "Malaysia" },
      { date: "2026-08-02", num: "1930", city: "Penang", country: "Malaysia" },
      { date: "2026-07-26", num: "7745", city: "Johor Bahru", country: "Malaysia" },
      { date: "2026-07-19", num: "0218", city: "Ipoh", country: "Malaysia" },
      { date: "2026-07-12", num: "6689", city: "Kuching", country: "Malaysia" },
      { date: "2026-07-05", num: "3417", city: "Kota Kinabalu", country: "Malaysia" },
      { date: "2026-06-28", num: "9052", city: "Melaka", country: "Malaysia" },
      { date: "2026-06-21", num: "1834", city: "Shah Alam", country: "Malaysia" },
      { date: "2026-06-14", num: "5601", city: "Kuala Terengganu", country: "Malaysia" },
      { date: "2026-06-07", num: "2274", city: "Seremban", country: "Malaysia" },
      { date: "2026-05-31", num: "4890", city: "Alor Setar", country: "Malaysia" },
      { date: "2026-05-24", num: "1153", city: "Kuantan", country: "Malaysia" },
      { date: "2026-05-17", num: "8476", city: "Kuala Lumpur", country: "Malaysia" },
      { date: "2026-05-10", num: "6602", city: "Miri", country: "Malaysia" },
      { date: "2026-05-03", num: "3079", city: "Petaling Jaya", country: "Malaysia" },
    ],
    d6: [
      { date: "2026-08-09", num: "482196", city: "Kuala Lumpur", country: "Malaysia" },
      { date: "2026-08-02", num: "193055", city: "Penang", country: "Malaysia" },
      { date: "2026-07-26", num: "774512", city: "Johor Bahru", country: "Malaysia" },
      { date: "2026-07-19", num: "021897", city: "Ipoh", country: "Malaysia" },
      { date: "2026-07-12", num: "668930", city: "Kuching", country: "Malaysia" },
      { date: "2026-07-05", num: "341728", city: "Kota Kinabalu", country: "Malaysia" },
      { date: "2026-06-28", num: "905261", city: "Melaka", country: "Malaysia" },
      { date: "2026-06-21", num: "183476", city: "Shah Alam", country: "Malaysia" },
      { date: "2026-06-14", num: "560198", city: "Kuala Terengganu", country: "Malaysia" },
      { date: "2026-06-07", num: "227443", city: "Seremban", country: "Malaysia" },
      { date: "2026-05-31", num: "489075", city: "Alor Setar", country: "Malaysia" },
      { date: "2026-05-24", num: "115364", city: "Kuantan", country: "Malaysia" },
      { date: "2026-05-17", num: "847625", city: "Kuala Lumpur", country: "Malaysia" },
      { date: "2026-05-10", num: "660219", city: "Miri", country: "Malaysia" },
      { date: "2026-05-03", num: "307948", city: "Petaling Jaya", country: "Malaysia" },
    ],
  };

  // Demo "taken" numbers per game (weekly reset, like the 6-number pool).
  const SEED_TAKEN_BY_GAME = {
    d4: ["0000", "1111", "4821", "1930", "7745", "8888", "9999", "0218"],
    d6: ["482196", "193055", "774512", "111111", "000000", "021897", "888888"],
  };

  function gameTakenKey(gameId) {
    return `minebig_taken_${gameId}_${weekKey()}`;
  }

  function getTakenForGame(gameId) {
    try {
      const raw = localStorage.getItem(gameTakenKey(gameId));
      if (raw) return new Set(JSON.parse(raw));
    } catch (e) { /* fall through to seed */ }
    return new Set(SEED_TAKEN_BY_GAME[gameId] || []);
  }

  function isNumberTaken(gameId, numStr) {
    return getTakenForGame(gameId).has(String(numStr).trim());
  }

  // ---- Symbolic Dictionary (star numbers) ----
  // Sample mappings only — full word→number list comes from the client.
  const DICTIONARY = [
    { word: "Rose", nums: ["0417", "2914"] },
    { word: "Raven", nums: ["0713", "8206"] },
    { word: "Flower (general)", nums: ["1834", "6610"] },
    { word: "Cat", nums: ["2290", "4551"] },
    { word: "Snake", nums: ["0318", "7412"] },
    { word: "Fish", nums: ["5538", "9027"] },
    { word: "Bird", nums: ["1297", "3814"] },
    { word: "Lotus", nums: ["8812", "2309"] },
    { word: "Mango", nums: ["4206", "7754"] },
    { word: "Durian", nums: ["1335", "6980"] },
    { word: "Rain", nums: ["9004", "2711"] },
    { word: "Lightning", nums: ["6680", "1122"] },
    { word: "Moon", nums: ["7015", "4493"] },
    { word: "Sun", nums: ["2111", "8880"] },
    { word: "Star", nums: ["7702", "3158"] },
    { word: "Boat", nums: ["5699", "2045"] },
    { word: "Train", nums: ["4040", "9582"] },
    { word: "Car", nums: ["8123", "6750"] },
    { word: "House", nums: ["1414", "9290"] },
    { word: "Tree", nums: ["2304", "7689"] },
    { word: "Baby", nums: ["6611", "0330"] },
    { word: "Wedding", nums: ["8800", "4627"] },
    { word: "Funeral", nums: ["1413", "7719"] },
    { word: "Gold", nums: ["9990", "0842"] },
    { word: "Water", nums: ["3021", "6508"] },
    { word: "Fire", nums: ["5566", "1937"] },
    { word: "Dragon", nums: ["8888", "2199"] },
    { word: "Phoenix", nums: ["7788", "4013"] },
    { word: "Tiger", nums: ["0123", "5555"] },
    { word: "Elephant", nums: ["4000", "8211"] },
  ];

  // ---- statistics helpers (star numbers) ----
  function digitFreq(gameId, days = 0) {
    const draws = DRAWS[gameId] || [];
    const cutoff = days > 0 ? Date.now() - days * 864e5 : 0;
    const counts = {};
    for (const d of draws) {
      if (days > 0 && new Date(d.date).getTime() < cutoff) continue;
      for (const ch of d.num) counts[ch] = (counts[ch] || 0) + 1;
    }
    return counts;
  }

  function mostFrequent(gameId, days = 0, n = 10) {
    return Object.entries(digitFreq(gameId, days))
      .sort((a, b) => b[1] - a[1] || a[0] - b[0])
      .slice(0, n);
  }

  function leastFrequent(gameId, days = 0, n = 10) {
    return Object.entries(digitFreq(gameId, days))
      .sort((a, b) => a[1] - b[1] || a[0] - b[0])
      .slice(0, n);
  }

  // ---- selection clipboard (try your luck) ----
  function getClipboard() {
    try { return JSON.parse(localStorage.getItem("minebig_clipboard")) || []; }
    catch (e) { return []; }
  }
  function addToClipboard(gameId, num) {
    const list = getClipboard().filter((x) => !(x.game === gameId && x.num === num));
    list.push({ game: gameId, num: String(num), at: Date.now() });
    localStorage.setItem("minebig_clipboard", JSON.stringify(list));
    return list;
  }
  function removeFromClipboard(gameId, num) {
    const list = getClipboard().filter((x) => !(x.game === gameId && x.num === num));
    localStorage.setItem("minebig_clipboard", JSON.stringify(list));
    return list;
  }

  return {
    weekKey, isLiveWindow, nextSundayNoon,
    getTaken, setTaken, isTaken, suggestAlternatives,
    getLogbook, addLogEntry,
    TIERS, WINNERS, lifetimeCounts,
    DEMO_WIN_CODE, lookupTicket, normalize, isValidCodeShape,
    agentName, setAgent, clearAgent,
    GAMES, PRIZE_TIERS, DRAWS,
    getTakenForGame, isNumberTaken,
    DICTIONARY, digitFreq, mostFrequent, leastFrequent,
    getClipboard, addToClipboard, removeFromClipboard,
  };
})();
