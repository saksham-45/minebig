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

  // Sunday 4D archive (10 years). Rebuild with: node scripts/generate-draws.mjs
  // BEGIN GENERATED DRAWS
  const DRAWS = {
    d4: [
      { date: "2026-08-23", num: "2485" },
      { date: "2026-08-16", num: "2541" },
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
      { date: "2026-04-26", num: "5225" },
      { date: "2026-04-19", num: "8609" },
      { date: "2026-04-12", num: "4654" },
      { date: "2026-04-05", num: "0265" },
      { date: "2026-03-29", num: "5840" },
      { date: "2026-03-22", num: "3435" },
      { date: "2026-03-15", num: "7132" },
      { date: "2026-03-08", num: "6070" },
      { date: "2026-03-01", num: "9444" },
      { date: "2026-02-22", num: "5812" },
      { date: "2026-02-15", num: "4777" },
      { date: "2026-02-08", num: "7394" },
      { date: "2026-02-01", num: "9615" },
      { date: "2026-01-25", num: "7114" },
      { date: "2026-01-18", num: "7078" },
      { date: "2026-01-11", num: "7363" },
      { date: "2026-01-04", num: "6452" },
      { date: "2025-12-28", num: "6248" },
      { date: "2025-12-21", num: "3303" },
      { date: "2025-12-14", num: "7556" },
      { date: "2025-12-07", num: "1998" },
      { date: "2025-11-30", num: "1508" },
      { date: "2025-11-23", num: "2886" },
      { date: "2025-11-16", num: "3494" },
      { date: "2025-11-09", num: "2208" },
      { date: "2025-11-02", num: "7961" },
      { date: "2025-10-26", num: "5356" },
      { date: "2025-10-19", num: "7599" },
      { date: "2025-10-12", num: "1232" },
      { date: "2025-10-05", num: "3761" },
      { date: "2025-09-28", num: "8472" },
      { date: "2025-09-21", num: "8526" },
      { date: "2025-09-14", num: "3688" },
      { date: "2025-09-07", num: "7760" },
      { date: "2025-08-31", num: "5507" },
      { date: "2025-08-24", num: "9807" },
      { date: "2025-08-17", num: "0730" },
      { date: "2025-08-10", num: "6193" },
      { date: "2025-08-03", num: "3358" },
      { date: "2025-07-27", num: "2708" },
      { date: "2025-07-20", num: "0794" },
      { date: "2025-07-13", num: "4004" },
      { date: "2025-07-06", num: "5088" },
      { date: "2025-06-29", num: "1168" },
      { date: "2025-06-22", num: "7366" },
      { date: "2025-06-15", num: "7201" },
      { date: "2025-06-08", num: "9532" },
      { date: "2025-06-01", num: "8476" },
      { date: "2025-05-25", num: "1934" },
      { date: "2025-05-18", num: "1726" },
      { date: "2025-05-11", num: "1889" },
      { date: "2025-05-04", num: "3100" },
      { date: "2025-04-27", num: "0326" },
      { date: "2025-04-20", num: "4878" },
      { date: "2025-04-13", num: "0531" },
      { date: "2025-04-06", num: "2107" },
      { date: "2025-03-30", num: "3373" },
      { date: "2025-03-23", num: "7594" },
      { date: "2025-03-16", num: "9473" },
      { date: "2025-03-09", num: "9573" },
      { date: "2025-03-02", num: "1928" },
      { date: "2025-02-23", num: "6782" },
      { date: "2025-02-16", num: "5698" },
      { date: "2025-02-09", num: "6699" },
      { date: "2025-02-02", num: "0539" },
      { date: "2025-01-26", num: "1349" },
      { date: "2025-01-19", num: "2598" },
      { date: "2025-01-12", num: "8062" },
      { date: "2025-01-05", num: "1311" },
      { date: "2024-12-29", num: "7608" },
      { date: "2024-12-22", num: "4213" },
      { date: "2024-12-15", num: "4200" },
      { date: "2024-12-08", num: "7911" },
      { date: "2024-12-01", num: "5353" },
      { date: "2024-11-24", num: "2544" },
      { date: "2024-11-17", num: "9440" },
      { date: "2024-11-10", num: "3485" },
      { date: "2024-11-03", num: "8296" },
      { date: "2024-10-27", num: "5441" },
      { date: "2024-10-20", num: "5805" },
      { date: "2024-10-13", num: "4133" },
      { date: "2024-10-06", num: "6308" },
      { date: "2024-09-29", num: "2900" },
      { date: "2024-09-22", num: "5424" },
      { date: "2024-09-15", num: "6981" },
      { date: "2024-09-08", num: "8839" },
      { date: "2024-09-01", num: "4922" },
      { date: "2024-08-25", num: "8130" },
      { date: "2024-08-18", num: "4469" },
      { date: "2024-08-11", num: "0117" },
      { date: "2024-08-04", num: "0033" },
      { date: "2024-07-28", num: "5347" },
      { date: "2024-07-21", num: "5729" },
      { date: "2024-07-14", num: "2590" },
      { date: "2024-07-07", num: "1703" },
      { date: "2024-06-30", num: "3119" },
      { date: "2024-06-23", num: "4656" },
      { date: "2024-06-16", num: "3986" },
      { date: "2024-06-09", num: "1391" },
      { date: "2024-06-02", num: "7331" },
      { date: "2024-05-26", num: "0438" },
      { date: "2024-05-19", num: "4591" },
      { date: "2024-05-12", num: "0058" },
      { date: "2024-05-05", num: "6885" },
      { date: "2024-04-28", num: "9193" },
      { date: "2024-04-21", num: "2240" },
      { date: "2024-04-14", num: "1928" },
      { date: "2024-04-07", num: "2688" },
      { date: "2024-03-31", num: "8364" },
      { date: "2024-03-24", num: "8093" },
      { date: "2024-03-17", num: "8821" },
      { date: "2024-03-10", num: "2795" },
      { date: "2024-03-03", num: "0330" },
      { date: "2024-02-25", num: "5112" },
      { date: "2024-02-18", num: "5833" },
      { date: "2024-02-11", num: "7617" },
      { date: "2024-02-04", num: "1626" },
      { date: "2024-01-28", num: "2604" },
      { date: "2024-01-21", num: "4561" },
      { date: "2024-01-14", num: "6460" },
      { date: "2024-01-07", num: "9980" },
      { date: "2023-12-31", num: "7354" },
      { date: "2023-12-24", num: "8552" },
      { date: "2023-12-17", num: "5726" },
      { date: "2023-12-10", num: "7590" },
      { date: "2023-12-03", num: "3658" },
      { date: "2023-11-26", num: "2641" },
      { date: "2023-11-19", num: "8486" },
      { date: "2023-11-12", num: "9760" },
      { date: "2023-11-05", num: "0412" },
      { date: "2023-10-29", num: "1420" },
      { date: "2023-10-22", num: "7408" },
      { date: "2023-10-15", num: "9425" },
      { date: "2023-10-08", num: "9793" },
      { date: "2023-10-01", num: "8039" },
      { date: "2023-09-24", num: "2601" },
      { date: "2023-09-17", num: "3396" },
      { date: "2023-09-10", num: "9101" },
      { date: "2023-09-03", num: "1177" },
      { date: "2023-08-27", num: "9689" },
      { date: "2023-08-20", num: "4423" },
      { date: "2023-08-13", num: "8206" },
      { date: "2023-08-06", num: "4676" },
      { date: "2023-07-30", num: "8449" },
      { date: "2023-07-23", num: "0768" },
      { date: "2023-07-16", num: "6261" },
      { date: "2023-07-09", num: "4583" },
      { date: "2023-07-02", num: "7520" },
      { date: "2023-06-25", num: "4834" },
      { date: "2023-06-18", num: "2399" },
      { date: "2023-06-11", num: "5874" },
      { date: "2023-06-04", num: "6757" },
      { date: "2023-05-28", num: "3607" },
      { date: "2023-05-21", num: "5060" },
      { date: "2023-05-14", num: "8098" },
      { date: "2023-05-07", num: "4168" },
      { date: "2023-04-30", num: "3186" },
      { date: "2023-04-23", num: "3515" },
      { date: "2023-04-16", num: "1612" },
      { date: "2023-04-09", num: "8261" },
      { date: "2023-04-02", num: "0927" },
      { date: "2023-03-26", num: "8515" },
      { date: "2023-03-19", num: "1719" },
      { date: "2023-03-12", num: "5743" },
      { date: "2023-03-05", num: "1793" },
      { date: "2023-02-26", num: "5129" },
      { date: "2023-02-19", num: "4709" },
      { date: "2023-02-12", num: "2730" },
      { date: "2023-02-05", num: "7183" },
      { date: "2023-01-29", num: "4032" },
      { date: "2023-01-22", num: "7415" },
      { date: "2023-01-15", num: "0805" },
      { date: "2023-01-08", num: "2002" },
      { date: "2023-01-01", num: "9564" },
      { date: "2022-12-25", num: "6916" },
      { date: "2022-12-18", num: "4522" },
      { date: "2022-12-11", num: "5954" },
      { date: "2022-12-04", num: "7807" },
      { date: "2022-11-27", num: "8410" },
      { date: "2022-11-20", num: "4346" },
      { date: "2022-11-13", num: "3266" },
      { date: "2022-11-06", num: "5636" },
      { date: "2022-10-30", num: "2785" },
      { date: "2022-10-23", num: "1603" },
      { date: "2022-10-16", num: "6943" },
      { date: "2022-10-09", num: "4463" },
      { date: "2022-10-02", num: "5911" },
      { date: "2022-09-25", num: "5969" },
      { date: "2022-09-18", num: "6983" },
      { date: "2022-09-11", num: "1155" },
      { date: "2022-09-04", num: "1780" },
      { date: "2022-08-28", num: "8999" },
      { date: "2022-08-21", num: "7248" },
      { date: "2022-08-14", num: "4787" },
      { date: "2022-08-07", num: "0556" },
      { date: "2022-07-31", num: "5615" },
      { date: "2022-07-24", num: "4421" },
      { date: "2022-07-17", num: "4456" },
      { date: "2022-07-10", num: "8672" },
      { date: "2022-07-03", num: "5726" },
      { date: "2022-06-26", num: "3716" },
      { date: "2022-06-19", num: "6315" },
      { date: "2022-06-12", num: "5888" },
      { date: "2022-06-05", num: "2263" },
      { date: "2022-05-29", num: "2650" },
      { date: "2022-05-22", num: "2783" },
      { date: "2022-05-15", num: "5436" },
      { date: "2022-05-08", num: "9262" },
      { date: "2022-05-01", num: "1301" },
      { date: "2022-04-24", num: "3292" },
      { date: "2022-04-17", num: "2505" },
      { date: "2022-04-10", num: "0316" },
      { date: "2022-04-03", num: "7163" },
      { date: "2022-03-27", num: "2370" },
      { date: "2022-03-20", num: "1788" },
      { date: "2022-03-13", num: "8001" },
      { date: "2022-03-06", num: "9181" },
      { date: "2022-02-27", num: "9323" },
      { date: "2022-02-20", num: "0646" },
      { date: "2022-02-13", num: "5318" },
      { date: "2022-02-06", num: "8486" },
      { date: "2022-01-30", num: "1607" },
      { date: "2022-01-23", num: "3130" },
      { date: "2022-01-16", num: "8148" },
      { date: "2022-01-09", num: "7523" },
      { date: "2022-01-02", num: "8415" },
      { date: "2021-12-26", num: "7447" },
      { date: "2021-12-19", num: "1037" },
      { date: "2021-12-12", num: "8648" },
      { date: "2021-12-05", num: "3787" },
      { date: "2021-11-28", num: "2035" },
      { date: "2021-11-21", num: "1994" },
      { date: "2021-11-14", num: "7460" },
      { date: "2021-11-07", num: "7118" },
      { date: "2021-10-31", num: "4908" },
      { date: "2021-10-24", num: "6955" },
      { date: "2021-10-17", num: "1658" },
      { date: "2021-10-10", num: "0036" },
      { date: "2021-10-03", num: "7500" },
      { date: "2021-09-26", num: "3133" },
      { date: "2021-09-19", num: "2074" },
      { date: "2021-09-12", num: "6493" },
      { date: "2021-09-05", num: "9553" },
      { date: "2021-08-29", num: "2297" },
      { date: "2021-08-22", num: "7053" },
      { date: "2021-08-15", num: "2464" },
      { date: "2021-08-08", num: "0599" },
      { date: "2021-08-01", num: "4126" },
      { date: "2021-07-25", num: "8291" },
      { date: "2021-07-18", num: "8134" },
      { date: "2021-07-11", num: "4325" },
      { date: "2021-07-04", num: "8966" },
      { date: "2021-06-27", num: "3294" },
      { date: "2021-06-20", num: "1085" },
      { date: "2021-06-13", num: "2446" },
      { date: "2021-06-06", num: "0177" },
      { date: "2021-05-30", num: "7399" },
      { date: "2021-05-23", num: "2363" },
      { date: "2021-05-16", num: "4606" },
      { date: "2021-05-09", num: "9587" },
      { date: "2021-05-02", num: "4414" },
      { date: "2021-04-25", num: "9877" },
      { date: "2021-04-18", num: "4665" },
      { date: "2021-04-11", num: "5668" },
      { date: "2021-04-04", num: "9828" },
      { date: "2021-03-28", num: "3987" },
      { date: "2021-03-21", num: "7897" },
      { date: "2021-03-14", num: "4934" },
      { date: "2021-03-07", num: "2727" },
      { date: "2021-02-28", num: "5246" },
      { date: "2021-02-21", num: "7739" },
      { date: "2021-02-14", num: "4028" },
      { date: "2021-02-07", num: "4736" },
      { date: "2021-01-31", num: "1450" },
      { date: "2021-01-24", num: "1675" },
      { date: "2021-01-17", num: "8955" },
      { date: "2021-01-10", num: "0647" },
      { date: "2021-01-03", num: "1159" },
      { date: "2020-12-27", num: "9763" },
      { date: "2020-12-20", num: "2304" },
      { date: "2020-12-13", num: "3958" },
      { date: "2020-12-06", num: "9859" },
      { date: "2020-11-29", num: "5503" },
      { date: "2020-11-22", num: "0911" },
      { date: "2020-11-15", num: "2044" },
      { date: "2020-11-08", num: "6303" },
      { date: "2020-11-01", num: "6240" },
      { date: "2020-10-25", num: "1877" },
      { date: "2020-10-18", num: "7870" },
      { date: "2020-10-11", num: "8827" },
      { date: "2020-10-04", num: "7387" },
      { date: "2020-09-27", num: "9837" },
      { date: "2020-09-20", num: "1981" },
      { date: "2020-09-13", num: "3060" },
      { date: "2020-09-06", num: "1843" },
      { date: "2020-08-30", num: "9188" },
      { date: "2020-08-23", num: "9399" },
      { date: "2020-08-16", num: "0845" },
      { date: "2020-08-09", num: "8807" },
      { date: "2020-08-02", num: "8825" },
      { date: "2020-07-26", num: "2768" },
      { date: "2020-07-19", num: "7249" },
      { date: "2020-07-12", num: "2324" },
      { date: "2020-07-05", num: "0012" },
      { date: "2020-06-28", num: "0848" },
      { date: "2020-06-21", num: "0535" },
      { date: "2020-06-14", num: "3404" },
      { date: "2020-06-07", num: "6097" },
      { date: "2020-05-31", num: "4629" },
      { date: "2020-05-24", num: "8965" },
      { date: "2020-05-17", num: "7765" },
      { date: "2020-05-10", num: "6005" },
      { date: "2020-05-03", num: "5498" },
      { date: "2020-04-26", num: "3358" },
      { date: "2020-04-19", num: "7267" },
      { date: "2020-04-12", num: "1078" },
      { date: "2020-04-05", num: "5308" },
      { date: "2020-03-29", num: "8298" },
      { date: "2020-03-22", num: "1374" },
      { date: "2020-03-15", num: "9978" },
      { date: "2020-03-08", num: "9181" },
      { date: "2020-03-01", num: "2090" },
      { date: "2020-02-23", num: "2345" },
      { date: "2020-02-16", num: "6713" },
      { date: "2020-02-09", num: "1072" },
      { date: "2020-02-02", num: "0504" },
      { date: "2020-01-26", num: "2241" },
      { date: "2020-01-19", num: "4373" },
      { date: "2020-01-12", num: "9430" },
      { date: "2020-01-05", num: "8408" },
      { date: "2019-12-29", num: "5045" },
      { date: "2019-12-22", num: "3040" },
      { date: "2019-12-15", num: "5715" },
      { date: "2019-12-08", num: "5708" },
      { date: "2019-12-01", num: "5955" },
      { date: "2019-11-24", num: "1431" },
      { date: "2019-11-17", num: "9949" },
      { date: "2019-11-10", num: "0149" },
      { date: "2019-11-03", num: "4258" },
      { date: "2019-10-27", num: "3146" },
      { date: "2019-10-20", num: "2455" },
      { date: "2019-10-13", num: "4482" },
      { date: "2019-10-06", num: "7470" },
      { date: "2019-09-29", num: "3294" },
      { date: "2019-09-22", num: "2478" },
      { date: "2019-09-15", num: "5741" },
      { date: "2019-09-08", num: "5443" },
      { date: "2019-09-01", num: "4228" },
      { date: "2019-08-25", num: "7131" },
      { date: "2019-08-18", num: "5801" },
      { date: "2019-08-11", num: "0580" },
      { date: "2019-08-04", num: "2471" },
      { date: "2019-07-28", num: "0037" },
      { date: "2019-07-21", num: "6066" },
      { date: "2019-07-14", num: "3266" },
      { date: "2019-07-07", num: "5424" },
      { date: "2019-06-30", num: "1794" },
      { date: "2019-06-23", num: "4174" },
      { date: "2019-06-16", num: "9850" },
      { date: "2019-06-09", num: "4625" },
      { date: "2019-06-02", num: "6005" },
      { date: "2019-05-26", num: "3101" },
      { date: "2019-05-19", num: "8924" },
      { date: "2019-05-12", num: "3145" },
      { date: "2019-05-05", num: "6047" },
      { date: "2019-04-28", num: "3746" },
      { date: "2019-04-21", num: "7094" },
      { date: "2019-04-14", num: "0746" },
      { date: "2019-04-07", num: "0197" },
      { date: "2019-03-31", num: "8866" },
      { date: "2019-03-24", num: "6356" },
      { date: "2019-03-17", num: "9399" },
      { date: "2019-03-10", num: "7467" },
      { date: "2019-03-03", num: "2304" },
      { date: "2019-02-24", num: "3737" },
      { date: "2019-02-17", num: "8456" },
      { date: "2019-02-10", num: "8722" },
      { date: "2019-02-03", num: "6435" },
      { date: "2019-01-27", num: "7232" },
      { date: "2019-01-20", num: "4225" },
      { date: "2019-01-13", num: "7498" },
      { date: "2019-01-06", num: "5055" },
      { date: "2018-12-30", num: "7873" },
      { date: "2018-12-23", num: "3019" },
      { date: "2018-12-16", num: "2233" },
      { date: "2018-12-09", num: "6490" },
      { date: "2018-12-02", num: "3754" },
      { date: "2018-11-25", num: "3346" },
      { date: "2018-11-18", num: "3120" },
      { date: "2018-11-11", num: "9084" },
      { date: "2018-11-04", num: "3849" },
      { date: "2018-10-28", num: "7048" },
      { date: "2018-10-21", num: "9805" },
      { date: "2018-10-14", num: "9934" },
      { date: "2018-10-07", num: "3540" },
      { date: "2018-09-30", num: "3134" },
      { date: "2018-09-23", num: "3051" },
      { date: "2018-09-16", num: "2254" },
      { date: "2018-09-09", num: "9060" },
      { date: "2018-09-02", num: "8942" },
      { date: "2018-08-26", num: "3327" },
      { date: "2018-08-19", num: "0174" },
      { date: "2018-08-12", num: "3136" },
      { date: "2018-08-05", num: "6080" },
      { date: "2018-07-29", num: "8116" },
      { date: "2018-07-22", num: "9488" },
      { date: "2018-07-15", num: "9483" },
      { date: "2018-07-08", num: "1361" },
      { date: "2018-07-01", num: "3889" },
      { date: "2018-06-24", num: "8826" },
      { date: "2018-06-17", num: "4864" },
      { date: "2018-06-10", num: "1402" },
      { date: "2018-06-03", num: "4886" },
      { date: "2018-05-27", num: "7121" },
      { date: "2018-05-20", num: "6965" },
      { date: "2018-05-13", num: "9761" },
      { date: "2018-05-06", num: "7781" },
      { date: "2018-04-29", num: "4735" },
      { date: "2018-04-22", num: "2793" },
      { date: "2018-04-15", num: "3684" },
      { date: "2018-04-08", num: "1100" },
      { date: "2018-04-01", num: "9808" },
      { date: "2018-03-25", num: "3504" },
      { date: "2018-03-18", num: "1312" },
      { date: "2018-03-11", num: "6117" },
      { date: "2018-03-04", num: "0493" },
      { date: "2018-02-25", num: "5600" },
      { date: "2018-02-18", num: "2110" },
      { date: "2018-02-11", num: "8468" },
      { date: "2018-02-04", num: "5824" },
      { date: "2018-01-28", num: "3020" },
      { date: "2018-01-21", num: "8110" },
      { date: "2018-01-14", num: "7925" },
      { date: "2018-01-07", num: "2909" },
      { date: "2017-12-31", num: "1760" },
      { date: "2017-12-24", num: "3612" },
      { date: "2017-12-17", num: "4567" },
      { date: "2017-12-10", num: "0424" },
      { date: "2017-12-03", num: "9470" },
      { date: "2017-11-26", num: "7834" },
      { date: "2017-11-19", num: "1351" },
      { date: "2017-11-12", num: "1017" },
      { date: "2017-11-05", num: "9524" },
      { date: "2017-10-29", num: "3381" },
      { date: "2017-10-22", num: "9322" },
      { date: "2017-10-15", num: "0858" },
      { date: "2017-10-08", num: "8685" },
      { date: "2017-10-01", num: "1051" },
      { date: "2017-09-24", num: "9530" },
      { date: "2017-09-17", num: "2854" },
      { date: "2017-09-10", num: "8925" },
      { date: "2017-09-03", num: "2983" },
      { date: "2017-08-27", num: "4665" },
      { date: "2017-08-20", num: "6001" },
      { date: "2017-08-13", num: "0612" },
      { date: "2017-08-06", num: "4394" },
      { date: "2017-07-30", num: "8035" },
      { date: "2017-07-23", num: "0552" },
      { date: "2017-07-16", num: "9133" },
      { date: "2017-07-09", num: "9092" },
      { date: "2017-07-02", num: "2607" },
      { date: "2017-06-25", num: "6287" },
      { date: "2017-06-18", num: "1799" },
      { date: "2017-06-11", num: "6940" },
      { date: "2017-06-04", num: "0169" },
      { date: "2017-05-28", num: "5466" },
      { date: "2017-05-21", num: "7025" },
      { date: "2017-05-14", num: "0807" },
      { date: "2017-05-07", num: "1221" },
      { date: "2017-04-30", num: "0237" },
      { date: "2017-04-23", num: "7708" },
      { date: "2017-04-16", num: "5643" },
      { date: "2017-04-09", num: "2795" },
      { date: "2017-04-02", num: "0435" },
      { date: "2017-03-26", num: "2785" },
      { date: "2017-03-19", num: "8312" },
      { date: "2017-03-12", num: "2301" },
      { date: "2017-03-05", num: "7935" },
      { date: "2017-02-26", num: "1371" },
      { date: "2017-02-19", num: "0762" },
      { date: "2017-02-12", num: "3215" },
      { date: "2017-02-05", num: "0525" },
      { date: "2017-01-29", num: "7181" },
      { date: "2017-01-22", num: "9926" },
      { date: "2017-01-15", num: "6112" },
      { date: "2017-01-08", num: "5073" },
      { date: "2017-01-01", num: "2071" },
      { date: "2016-12-25", num: "2914" },
      { date: "2016-12-18", num: "8261" },
      { date: "2016-12-11", num: "9289" },
      { date: "2016-12-04", num: "2143" },
      { date: "2016-11-27", num: "1591" },
      { date: "2016-11-20", num: "8873" },
      { date: "2016-11-13", num: "9122" },
      { date: "2016-11-06", num: "3551" },
      { date: "2016-10-30", num: "6708" },
      { date: "2016-10-23", num: "2044" },
      { date: "2016-10-16", num: "3277" },
      { date: "2016-10-09", num: "6528" },
      { date: "2016-10-02", num: "5390" },
      { date: "2016-09-25", num: "5967" },
      { date: "2016-09-18", num: "8507" },
      { date: "2016-09-11", num: "0313" },
      { date: "2016-09-04", num: "4258" },
      { date: "2016-08-28", num: "9551" },
    ],
  };
  // END GENERATED DRAWS

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
    const rest = uniqueNums(rng, digits, 22, used);
    return {
      date: draw.date,
      first: draw.num,
      second: rest[0],
      third: rest[1],
      special: rest.slice(2, 12),
      consolation: rest.slice(12, 22),
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
  const OVERRIDE_KEY = "minebig_draw_boards_v2";

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
    special = special.slice(0, 10);
    consolation = consolation.slice(0, 10);
    const missing = (second ? 0 : 1) + (third ? 0 : 1) + (10 - special.length) + (10 - consolation.length);
    if (missing > 0) {
      const rng = mulberry32(hashSeed(gameId + ":" + date + ":" + first));
      const used = new Set([first, second, third, ...special, ...consolation].filter(Boolean));
      const rest = uniqueNums(rng, digits, missing, used);
      let i = 0;
      if (!second) second = rest[i++];
      if (!third) third = rest[i++];
      while (special.length < 10) special.push(rest[i++]);
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
