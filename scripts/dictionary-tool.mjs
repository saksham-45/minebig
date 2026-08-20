#!/usr/bin/env node
/* ============================================================
   MineBig dictionary tooling (zero dependencies, Node >= 16).

   Export:  node scripts/dictionary-tool.mjs export
     Reads the DICTIONARY array from js/data.js and writes
     data/symbolic-dictionary.csv.

   Import:  node scripts/dictionary-tool.mjs import
     Reads data/symbolic-dictionary.csv and rewrites the
     DICTIONARY array in js/data.js to match.

   CSV schema (header row required):
     word     - the symbol's name (string)
     nums     - one or more 4-digit numbers, joined with "|"
                e.g. "0417|2914"
     symbol   - unused (icons live in img/dict/)
     image    - path under img/dict/{slug}.svg; new words auto-resolve by slug
     meaning  - optional free-text meaning shown under the word
   ============================================================ */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DATA_JS = join(ROOT, "js", "data.js");
const CSV_PATH = join(ROOT, "data", "symbolic-dictionary.csv");

// ---- minimal CSV parser (quoted fields, escaped quotes) ----
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

function csvEscape(v) {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}

// ---- locate the DICTIONARY array in js/data.js ----
function dictionaryRange(src) {
  const start = src.indexOf("const DICTIONARY = [");
  if (start < 0) throw new Error("DICTIONARY not found in js/data.js");
  const arrStart = src.indexOf("[", start);
  let depth = 0;
  let inStr = false;
  let q = "";
  for (let i = arrStart; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === "\\") { i++; continue; }
      if (ch === q) inStr = false;
      continue;
    }
    if (ch === '"' || ch === "'") { inStr = true; q = ch; continue; }
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) return { start, arrStart, arrEnd: i };
    }
  }
  throw new Error("Unbalanced DICTIONARY array in js/data.js");
}

function readDictionary() {
  const src = readFileSync(DATA_JS, "utf8");
  const { arrStart, arrEnd } = dictionaryRange(src);
  const arrText = src.slice(arrStart, arrEnd + 1);
  // eslint-disable-next-line no-eval
  return eval("(" + arrText + ")");
}

// ---- export ----
function exportCSV() {
  const dict = readDictionary();
  const lines = [["word", "nums", "symbol", "image", "meaning"].join(",")];
  for (const d of dict) {
    lines.push([
      d.word || "",
      (d.nums || []).join("|"),
      d.symbol || "",
      d.image || "",
      d.meaning || "",
    ].map(csvEscape).join(","));
  }
  writeFileSync(CSV_PATH, lines.join("\n") + "\n", "utf8");
  console.log(`exported ${dict.length} dictionary entries to data/symbolic-dictionary.csv`);
}

// ---- import ----
function importCSV() {
  const rows = parseCSV(readFileSync(CSV_PATH, "utf8")).filter((r) => r.some((c) => String(c).trim() !== ""));
  if (rows.length < 2) throw new Error("CSV is empty or missing rows");
  const head = rows[0].map((h) => String(h).trim().toLowerCase());
  const col = (name) => {
    const i = head.indexOf(name);
    return i < 0 ? null : (r) => String(r[i] ?? "").trim();
  };
  const word = col("word");
  const nums = col("nums");
  const symbol = col("symbol");
  const image = col("image");
  const meaning = col("meaning");
  if (!word || !nums) throw new Error("CSV must have `word` and `nums` columns");

  const entries = [];
  const seen = new Set();
  for (let i = 1; i < rows.length; i++) {
    const w = word(rows[i]);
    const n = nums(rows[i]).split("|").map((s) => s.trim()).filter(Boolean);
    if (!w) continue;
    if (!n.length || n.some((x) => !/^\d{4}$/.test(x))) {
      throw new Error(`Row ${i + 1} ("${w}"): nums must be 4-digit numbers joined with "|"`);
    }
    const key = w.toLowerCase();
    if (seen.has(key)) throw new Error(`Row ${i + 1}: duplicate word "${w}"`);
    seen.add(key);
    entries.push({
      word: w,
      nums: n,
      symbol: symbol ? symbol(rows[i]) : "",
      image: image ? image(rows[i]) : "",
      meaning: meaning ? meaning(rows[i]) : "",
    });
  }
  if (!entries.length) throw new Error("No dictionary rows found in the CSV");

  const src = readFileSync(DATA_JS, "utf8");
  const { start, arrEnd } = dictionaryRange(src);
  const body = entries.map((e) => {
    const fields = [
      `word: ${JSON.stringify(e.word)}`,
      `nums: ${JSON.stringify(e.nums)}`,
      `symbol: ${JSON.stringify(e.symbol)}`,
      `image: ${JSON.stringify(e.image)}`,
    ];
    if (e.meaning) fields.push(`meaning: ${JSON.stringify(e.meaning)}`);
    return `    { ${fields.join(", ")} },`;
  }).join("\n");
  const block = `const DICTIONARY = [\n${body}\n  ];`;
  const out = src.slice(0, start) + block + src.slice(arrEnd + 1);
  writeFileSync(DATA_JS, out, "utf8");
  console.log(`imported ${entries.length} dictionary entries into js/data.js`);
}

const mode = process.argv[2] || "help";
if (mode === "export") exportCSV();
else if (mode === "import") importCSV();
else {
  console.log("usage: node scripts/dictionary-tool.mjs <export|import>");
  process.exit(1);
}
