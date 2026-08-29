#!/usr/bin/env node
/* ============================================================
   Generate 10 years of Sunday MineBig 4D first-prize codes.

   Usage:  node scripts/generate-draws.mjs

   Writes:
     data/draws-d4.json     — source of truth, newest first
     js/data.js             — the DRAWS block between BEGIN/END markers

   Known demo first-prize codes are kept. Every other Sunday gets a
   seeded 4-digit code so re-running the script is stable.
   ============================================================ */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const JSON_PATH = join(ROOT, "data", "draws-d4.json");
const DATA_JS = join(ROOT, "js", "data.js");

const PRESERVE = {
  "2026-08-09": "4821",
  "2026-08-02": "1930",
  "2026-07-26": "7745",
  "2026-07-19": "0218",
  "2026-07-12": "6689",
  "2026-07-05": "3417",
  "2026-06-28": "9052",
  "2026-06-21": "1834",
  "2026-06-14": "5601",
  "2026-06-07": "2274",
  "2026-05-31": "4890",
  "2026-05-24": "1153",
  "2026-05-17": "8476",
  "2026-05-10": "6602",
  "2026-05-03": "3079",
};

function iso(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

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

function lastCompletedSunday(now) {
  const d = new Date(now);
  const sunday = new Date(d);
  sunday.setHours(12, 0, 0, 0);
  sunday.setDate(sunday.getDate() - sunday.getDay());
  if (d.getDay() === 0) {
    const noon = new Date(sunday);
    if (d < noon) sunday.setDate(sunday.getDate() - 7);
  }
  return sunday;
}

function firstSundayOnOrAfter(d) {
  const x = new Date(d);
  x.setHours(12, 0, 0, 0);
  const add = (7 - x.getDay()) % 7;
  x.setDate(x.getDate() + add);
  return x;
}

function codeFor(date) {
  if (PRESERVE[date]) return PRESERVE[date];
  const rng = mulberry32(hashSeed("d4-first:" + date));
  return String(Math.floor(rng() * 10000)).padStart(4, "0");
}

function buildArchive(now = new Date()) {
  const end = lastCompletedSunday(now);
  const startRaw = new Date(end);
  startRaw.setFullYear(startRaw.getFullYear() - 10);
  const start = firstSundayOnOrAfter(startRaw);
  const draws = [];
  for (const cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 7)) {
    const date = iso(cursor);
    draws.push({ date, num: codeFor(date) });
  }
  draws.reverse();
  return { start: iso(start), end: iso(end), count: draws.length, draws };
}

function patchDataJs(draws) {
  const src = readFileSync(DATA_JS, "utf8");
  const body = draws.map((d) => `      { date: "${d.date}", num: "${d.num}" },`).join("\n");
  const block =
    `  // Sunday 4D archive (10 years). Rebuild with: node scripts/generate-draws.mjs\n` +
    `  // BEGIN GENERATED DRAWS\n` +
    `  const DRAWS = {\n` +
    `    d4: [\n` +
    `${body}\n` +
    `    ],\n` +
    `  };\n` +
    `  // END GENERATED DRAWS`;

  const marked = /  \/\/ Sunday 4D archive[\s\S]*?  \/\/ END GENERATED DRAWS/;
  const legacy = /  \/\/ Demo draw archive per game[\s\S]*?  const DRAWS = \{[\s\S]*?\n  \};/;
  let next;
  if (marked.test(src)) next = src.replace(marked, block);
  else if (legacy.test(src)) next = src.replace(legacy, block);
  else {
    throw new Error("Could not find DRAWS block in js/data.js");
  }
  writeFileSync(DATA_JS, next);
}

const archive = buildArchive(new Date());
writeFileSync(JSON_PATH, JSON.stringify({
  generated: new Date().toISOString().slice(0, 10),
  start: archive.start,
  end: archive.end,
  count: archive.count,
  draws: archive.draws,
}, null, 2) + "\n");
patchDataJs(archive.draws);

console.log(`Wrote ${archive.count} Sunday draws ${archive.start} → ${archive.end}`);
console.log(`  ${JSON_PATH}`);
console.log(`  ${DATA_JS}`);
