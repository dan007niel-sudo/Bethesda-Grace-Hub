// Bundles src/data/knowledge.md into the Supabase Edge Function as a TS string,
// so knowledge.md stays the single source of truth for the AI's context.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.resolve('src/data/knowledge.md');
const OUT = path.resolve('supabase/functions/chat/_knowledge.ts');

const md = await readFile(SRC, 'utf8');
const ts =
  '// Auto-generated from src/data/knowledge.md — do not edit by hand.\n' +
  '// Run `npm run knowledge:sync` to refresh.\n' +
  `export const KNOWLEDGE = ${JSON.stringify(md)};\n`;
await writeFile(OUT, ts);
console.log(`Synced ${path.relative(process.cwd(), SRC)} → ${path.relative(process.cwd(), OUT)}`);
