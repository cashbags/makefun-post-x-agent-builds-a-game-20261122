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
//
// Contract this program must keep (design note, second pass):
// - The grader reads exactly one thing from the output: POST.json, and it
//   reads the `url` field inside it. That URL has to be the real, public X
//   post URL. The placeholder in POST.json must be replaced with the actual
//   post link before submit, or the entry scores nothing no matter how good
//   the video is — the program cannot fix a missing post, it can only pass
//   the address along.
// - The copy must stay byte-exact. The file written to the output directory
//   is the same bytes as the file in the repo: no re-formatting, no added
//   newline, no re-encoding. The grader expects the output to mirror the
//   submitted POST.json, so any transformation, however small, breaks that.
// - The program never touches the network and never edits the post. The one
//   failure worth guarding is a malformed POST.json — bad JSON, or a `url`
//   that is missing or not a string. That is checked up front below and
//   fails loudly instead of silently handing the grader a broken pointer.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const post = readFileSync(join(botDir, 'POST.json'));

// Validate before writing: POST.json must parse as JSON and carry a string
// `url` field. Only the parsed copy is inspected — the raw bytes are still
// what gets written, so the output stays byte-exact.
let parsed;
try {
  parsed = JSON.parse(post.toString('utf8'));
} catch {
  throw new Error('POST.json is not valid JSON — fix it before submitting');
}
const record = parsed !== null && typeof parsed === 'object' ? parsed : null;
const url = record === null ? undefined : record.url;
if (typeof url !== 'string') {
  throw new Error('POST.json must contain a string `url` field — fix it before submitting');
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'POST.json'), post);
