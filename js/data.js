/* ============================================================
   MineBig.com V2.0 - shared demo data + week logic
   Everything here is DEMO data persisted in the browser only.
   ============================================================ */

const MINEBIG = (() => {
  // ---- weekly key: taken numbers reset every Sunday 12:00 ----
  // ---- optional live results feed (published Google Sheet CSV) ----
  // Columns: date,game,num  (date=YYYY-MM-DD, game=d4, num=4-digit code).
  // Empty URL = built-in demo data. Paste the published-to-web CSV link to go live.
  const RESULTS_SHEET_CSV_URL = "";

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
    if (t.getTime() <= now.getTime()) t.setDate(t.getDate() + 7); // reset at 12:00 sharp
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

  // digits of a legacy pool draw as single-digit chips (display only)
  function digitCode(nums) {
    return nums.map((n) => String(Number(n) % 10));
  }


  // full 4D winning code for a draw date (winner numbers stay whole codes)
  function codesForDate(dateStr) {
    const hit = (DRAWS.d4 || []).find((d) => d.date === dateStr);
    return { d4: hit ? hit.num : null };
  }
  // ---- lifetime frequency: how often each number has won ----
  function lifetimeCounts() {
    const counts = {};
    for (const draw of WINNERS) {
      for (const n of draw.nums) counts[n] = (counts[n] || 0) + 1;
    }
    return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0] - b[0]);
  }

  // ---- ticket-status lookup (4-digit codes) ----
  const DEMO_WIN_CODE = "4821";

  function demoWinCodes() {
    const wins = {};
    for (const g of GAMES) {
      const boards = getBoards(g.id);
      if (boards.length) wins[g.id] = String(boards[0].first || "");
    }
    return wins;
  }

  function lookupTicket(codeStr) {
    const raw = String(codeStr || "").replace(/[\s,\-;]+/g, "").trim();
    if (!raw) return { status: "missing" };
    if (!/^\d{4}$/.test(raw)) return { status: "invalid", code: raw };
    const game = "d4";
    const code = raw.split("").join("-");
    const wins = demoWinCodes();
    if (wins[game] === raw) return { status: "win", code, game };
    if (isNumberTaken(game, raw)) return { status: "taken", code, game };
    return { status: "notfound", code, game };
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
  // MineBig 4D (content-document model)
  // ============================================================

  const GAMES = [
    {
      id: "d4",
      name: "MineBig 4D",
      digits: 4,
      tagline: "Pick your lucky 4 digits, win big.",
      price: "Entry - confirm with client",
      accent: "gold",
    },
  ];

  const PRIZE_TIERS = [
    { key: "first", label: "1st Prize" },
    { key: "second", label: "2nd Prize" },
    { key: "third", label: "3rd Prize" },
    { key: "special", label: "Special" },
    { key: "consolation", label: "Consolation" },
  ];

  // Demo draw archive per game - most recent first.
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
    const hits = DICTIONARY.filter((entry) => {
      const n4 = entry.nums || [];
      return n4.some((x) => x === last4 || n.endsWith(x) || x === n);
    });
    if (hits.length) {
      return hits.map((h) => h.word).join(", ");
    }
    return "No dictionary match for this number.";
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
      return { error: `Bad date "${date}" - use YYYY-MM-DD.` };
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

  function saveBoardOverrides(d4Text) {
    try { localStorage.setItem(OVERRIDE_KEY, JSON.stringify({ d4: d4Text })); }
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


  // Demo "taken" numbers per game (weekly reset, like the code pool).
  const SEED_TAKEN_BY_GAME = {
    d4: ["0000", "1111", "4821", "1930", "7745", "8888", "9999", "0218"],
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
  function setTakenForGame(gameId, set) {
    localStorage.setItem(gameTakenKey(gameId), JSON.stringify([...set]));
  }

  // ---- Symbolic Dictionary (star numbers) ----
  // Photos live in img/dict/{slug}.jpg. New words pick up a matching file
  // automatically (or img/dict/_default.jpg). Optional `image` overrides the slug.
  const DICTIONARY = [
    { word: "Rose", nums: ["0417","2914"], image: "img/dict/rose.jpg" },
    { word: "Raven", nums: ["0713","8206"], image: "img/dict/raven.jpg" },
    { word: "Flower (general)", nums: ["1834","6610"], image: "img/dict/flower.jpg" },
    { word: "Cat", nums: ["2290","4551"], image: "img/dict/cat.jpg" },
    { word: "Snake", nums: ["0318","7412"], image: "img/dict/snake.jpg" },
    { word: "Fish", nums: ["5538","9027"], image: "img/dict/fish.jpg" },
    { word: "Bird", nums: ["1297","3814"], image: "img/dict/bird.jpg" },
    { word: "Lotus", nums: ["8812","2309"], image: "img/dict/lotus.jpg" },
    { word: "Mango", nums: ["4206","7754"], image: "img/dict/mango.jpg" },
    { word: "Durian", nums: ["1335","6980"], image: "img/dict/durian.jpg" },
    { word: "Rain", nums: ["9004","2711"], image: "img/dict/rain.jpg" },
    { word: "Lightning", nums: ["6680","1122"], image: "img/dict/lightning.jpg" },
    { word: "Moon", nums: ["7015","4493"], image: "img/dict/moon.jpg" },
    { word: "Sun", nums: ["2111","8880"], image: "img/dict/sun.jpg" },
    { word: "Star", nums: ["7702","3158"], image: "img/dict/star.jpg" },
    { word: "Boat", nums: ["5699","2045"], image: "img/dict/boat.jpg" },
    { word: "Train", nums: ["4040","9582"], image: "img/dict/train.jpg" },
    { word: "Car", nums: ["8123","6750"], image: "img/dict/car.jpg" },
    { word: "House", nums: ["1414","9290"], image: "img/dict/house.jpg" },
    { word: "Tree", nums: ["2304","7689"], image: "img/dict/tree.jpg" },
    { word: "Baby", nums: ["6611","0330"], image: "img/dict/baby.jpg" },
    { word: "Wedding", nums: ["8800","4627"], image: "img/dict/wedding.jpg" },
    { word: "Funeral", nums: ["1413","7719"], image: "img/dict/funeral.jpg" },
    { word: "Gold", nums: ["9990","0842"], image: "img/dict/gold.jpg" },
    { word: "Water", nums: ["3021","6508"], image: "img/dict/water.jpg" },
    { word: "Fire", nums: ["5566","1937"], image: "img/dict/fire.jpg" },
    { word: "Dragon", nums: ["8888","2199"], image: "img/dict/dragon.jpg" },
    { word: "Phoenix", nums: ["7788","4013"], image: "img/dict/phoenix.jpg" },
    { word: "Tiger", nums: ["0123","5555"], image: "img/dict/tiger.jpg" },
    { word: "Elephant", nums: ["4000","8211"], image: "img/dict/elephant.jpg" },
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

  // ---- published-sheet results feed ----
  // CSV columns: date,game,num. New rows are prepended to the draw archive;
  // anything unparsable is skipped and the demo data stays untouched.
  function parseCSV(text) {
    const rows = [];
    let row = [];
    let cur = "";
    let q = false;
    const push = () => { row.push(cur); cur = ""; };
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (q) {
        if (ch === '"') {
          if (text[i + 1] === '"') { cur += '"'; i++; } else q = false;
        } else cur += ch;
      } else if (ch === '"') q = true;
      else if (ch === ",") push();
      else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && text[i + 1] === "\n") i++;
        push();
        rows.push(row);
        row = [];
      } else cur += ch;
    }
    push();
    rows.push(row);
    return rows;
  }

  function applySheetCSV(text) {
    const rows = parseCSV(text);
    if (rows.length < 2) return;
    const head = rows[0].map((h) => String(h).trim().toLowerCase());
    const iDate = head.indexOf("date");
    const iGame = head.indexOf("game");
    const iNum = head.indexOf("num");
    if (iDate < 0 || iGame < 0 || iNum < 0) return;
    for (let i = 1; i < rows.length; i++) {
      const r = rows[i];
      const date = String(r[iDate] || "").trim();
      const game = String(r[iGame] || "").trim().toLowerCase();
      const num = String(r[iNum] || "").trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
      if (game !== "d4") continue;
      if (!/^\d{4}$/.test(num)) continue;
      DRAWS.d4.unshift({ date, num });
    }
    const seen = new Set();
    DRAWS.d4 = DRAWS.d4
      .filter((d) => { const k = d.date + ":" + d.num; if (seen.has(k)) return false; seen.add(k); return true; })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
    BOARDS.d4 = boardsFor("d4");
    if (typeof window !== "undefined" && typeof CustomEvent === "function") {
      window.dispatchEvent(new CustomEvent("minebig:sheet-loaded"));
    }
  }

  let sheetLoaded = false;
  function loadSheetFeed() {
    if (!RESULTS_SHEET_CSV_URL || sheetLoaded) return;
    sheetLoaded = true;
    if (typeof fetch !== "function") return;
    fetch(RESULTS_SHEET_CSV_URL, { cache: "no-store" })
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error("sheet fetch failed"))))
      .then((text) => applySheetCSV(text))
      .catch(() => { /* silent fallback to demo data */ });
  }
  loadSheetFeed();

  return {
    weekKey, isLiveWindow, nextSundayNoon,
    getTaken, setTaken, isTaken, suggestAlternatives,
    TIERS, WINNERS, lifetimeCounts, digitCode, codesForDate,
    DEMO_WIN_CODE, lookupTicket,
    agentName, setAgent, clearAgent,
    GAMES, PRIZE_TIERS, DRAWS, BOARDS,
    drawCode, formatDrawDate, formatShortDate, meaningFor,
    parseBoardText, serializeBoards, saveBoardOverrides, clearBoardOverrides, getBoards,
    getTakenForGame, isNumberTaken, setTakenForGame,
    DICTIONARY, digitFreq, mostFrequent, leastFrequent,
    getClipboard, addToClipboard, removeFromClipboard,
  };
})();
