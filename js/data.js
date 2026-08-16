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
  // Winner identity is never shown (per our privacy commitment).
  const DRAWS = {
    d4: [
      { date: "2026-08-09", num: "4821" },
      { date: "2026-08-02", num: "1930" },
      { date: "2026-07-26", num: "7745" },
      { date: "2026-07-19", num: "0218" },
      { date: "2026-07-12", num: "6689" },
      { date: "2026-07-05", num: "3417" },
      { date: "2026-06-28", num: "9052" },
      { date: "2026-06-21", num: "1834" },
      { date: "2026-06-14", num: "5601" },
      { date: "2026-06-07", num: "2274" },
      { date: "2026-05-31", num: "4890" },
      { date: "2026-05-24", num: "1153" },
      { date: "2026-05-17", num: "8476" },
      { date: "2026-05-10", num: "6602" },
      { date: "2026-05-03", num: "3079" },
    ],
    d6: [
      { date: "2026-08-09", num: "482196" },
      { date: "2026-08-02", num: "193055" },
      { date: "2026-07-26", num: "774512" },
      { date: "2026-07-19", num: "021897" },
      { date: "2026-07-12", num: "668930" },
      { date: "2026-07-05", num: "341728" },
      { date: "2026-06-28", num: "905261" },
      { date: "2026-06-21", num: "183476" },
      { date: "2026-06-14", num: "560198" },
      { date: "2026-06-07", num: "227443" },
      { date: "2026-05-31", num: "489075" },
      { date: "2026-05-24", num: "115364" },
      { date: "2026-05-17", num: "847625" },
      { date: "2026-05-10", num: "660219" },
      { date: "2026-05-03", num: "307948" },
    ],
  };

  function hashSeed(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function next() {
      let t = (a += 0x6D2B79F5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function uniqueNums(rng, digits, count, used) {
    const out = [];
    let guard = 0;
    const cap = 10 ** digits;
    while (out.length < count && guard < 8000) {
      const n = String(Math.floor(rng() * cap)).padStart(digits, "0");
      if (!used.has(n)) {
        used.add(n);
        out.push(n);
      }
      guard += 1;
    }
    return out;
  }

  function boardFromDraw(draw, digits, gameId) {
    const rng = mulberry32(hashSeed(gameId + ":" + draw.date + ":" + draw.num));
    const used = new Set([draw.num]);
    const rest = uniqueNums(rng, digits, 25, used);
    return {
      date: draw.date,
      first: draw.num,
      second: rest[0],
      third: rest[1],
      special: rest.slice(2, 15),
      consolation: rest.slice(15, 25),
    };
  }

  function boardsFor(gameId) {
    const game = GAMES.find((g) => g.id === gameId);
    const digits = game ? game.digits : 4;
    return (DRAWS[gameId] || []).map((d) => boardFromDraw(d, digits, gameId));
  }

  const BOARDS = {
    d4: boardsFor("d4"),
    d6: boardsFor("d6"),
  };

  function drawCode(dateStr) {
    const d = new Date(dateStr + "T12:00:00");
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const week = Math.floor((d - yearStart) / (7 * 864e5)) + 1;
    return `${String(week).padStart(3, "0")}/${String(d.getFullYear()).slice(2)}`;
  }

  function formatDrawDate(dateStr) {
    const d = new Date(dateStr + "T12:00:00");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()} (${days[d.getDay()]})`;
  }

  function formatShortDate(dateStr) {
    const d = new Date(dateStr + "T12:00:00");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${String(d.getDate()).padStart(2, "0")} ${months[d.getMonth()]} ${d.getFullYear()}`;
  }

  function meaningFor(num) {
    const n = String(num);
    const last4 = n.slice(-4);
    const hits = DICTIONARY.filter((entry) => entry.nums.some((x) => x === last4 || n.endsWith(x)));
    if (hits.length) {
      return hits.map((h) => h.word).join(", ");
    }
    return "No dictionary match for this sample number.";
  }

  // ---- draw board editor: simple text entry that auto-populates ----
  // One draw per line: YYYY-MM-DD | 1st 2nd 3rd | special... | consolation...
  // Omitted 2nd/3rd/Special/Consolation values auto-fill deterministically.
  const OVERRIDE_KEY = "minebig_draw_boards_v1";

  function boardToLine(board) {
    return [
      board.date,
      [board.first, board.second, board.third].filter(Boolean).join(" "),
      (board.special || []).join(" "),
      (board.consolation || []).join(" "),
    ].join(" | ");
  }

  function lineToBoard(line, digits, gameId) {
    const parts = line.split("|").map((p) => p.trim());
    if (!parts.length || !parts[0]) return null;
    const date = parts[0];
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { error: `Bad date "${date}" — use YYYY-MM-DD.` };
    }
    const ok = (n) => new RegExp(`^\\d{${digits}}$`).test(n);
    const nums = (parts[1] || "").split(/\s+/).filter(Boolean);
    if (!nums.length) return { error: `Missing numbers for ${date}.` };
    if (!nums.every(ok)) {
      return { error: `Numbers for ${date} must be exactly ${digits} digits.` };
    }
    let special = (parts[2] || "").split(/\s+/).filter(Boolean);
    let consolation = (parts[3] || "").split(/\s+/).filter(Boolean);
    if (special.some((n) => !ok(n)) || consolation.some((n) => !ok(n))) {
      return { error: `Special/Consolation numbers for ${date} must be exactly ${digits} digits.` };
    }
    const first = nums[0];
    let second = nums[1] || null;
    let third = nums[2] || null;
    special = special.slice(0, 13);
    consolation = consolation.slice(0, 10);
    const missing = (second ? 0 : 1) + (third ? 0 : 1) + (13 - special.length) + (10 - consolation.length);
    if (missing > 0) {
      const rng = mulberry32(hashSeed(gameId + ":" + date + ":" + first));
      const used = new Set([first, second, third, ...special, ...consolation].filter(Boolean));
      const rest = uniqueNums(rng, digits, missing, used);
      let i = 0;
      if (!second) second = rest[i++];
      if (!third) third = rest[i++];
      while (special.length < 13) special.push(rest[i++]);
      while (consolation.length < 10) consolation.push(rest[i++]);
    }
    return { date, first, second, third, special, consolation };
  }

  function parseBoardText(gameId, text) {
    const game = GAMES.find((g) => g.id === gameId);
    const digits = game ? game.digits : 4;
    const boards = [];
    const errors = [];
    for (const raw of String(text || "").split("\n")) {
      const line = raw.trim();
      if (!line) continue;
      const res = lineToBoard(line, digits, gameId);
      if (!res) continue;
      if (res.error) { errors.push(res.error); continue; }
      boards.push(res);
    }
    if (!boards.length) errors.push("No valid draw lines found.");
    boards.sort((a, b) => (a.date < b.date ? 1 : -1));
    return { boards, errors };
  }

  function serializeBoards(gameId) {
    return getBoards(gameId).map(boardToLine).join("\n");
  }

  function saveBoardOverrides(d4Text, d6Text) {
    try { localStorage.setItem(OVERRIDE_KEY, JSON.stringify({ d4: d4Text, d6: d6Text })); }
    catch (e) { /* storage unavailable */ }
  }

  function clearBoardOverrides() {
    try { localStorage.removeItem(OVERRIDE_KEY); } catch (e) { /* noop */ }
  }

  function getBoards(gameId) {
    try {
      const raw = localStorage.getItem(OVERRIDE_KEY);
      if (raw) {
        const store = JSON.parse(raw);
        const parsed = parseBoardText(gameId, store[gameId] || "");
        if (parsed.boards.length) return parsed.boards;
      }
    } catch (e) { /* fall back to demo */ }
    return BOARDS[gameId];
  }


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
    GAMES, PRIZE_TIERS, DRAWS, BOARDS,
    drawCode, formatDrawDate, formatShortDate, meaningFor,
    parseBoardText, serializeBoards, saveBoardOverrides, clearBoardOverrides, getBoards,
    getTakenForGame, isNumberTaken,
    DICTIONARY, digitFreq, mostFrequent, leastFrequent,
    getClipboard, addToClipboard, removeFromClipboard,
  };
})();
