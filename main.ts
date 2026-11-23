// Star Catch on X — entry program for the make.fun post-x bounty.
//
// The post itself is the entry: a 12-second vertical video about an AI agent
// building a tiny browser game ("Star Catch") from one prompt, posted natively
// on X. This program's only job is to hand the grader the post's address: it
// copies POST.json from the repository root into the output directory, where
// the gate reads it. Nothing about the post is scored here.
//
// Local run:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
// out/POST.json is then byte for byte this directory's POST.json.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const post = readFileSync(join(botDir, 'POST.json'));
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'POST.json'), post);
