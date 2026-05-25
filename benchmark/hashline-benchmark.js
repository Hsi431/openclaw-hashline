import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  computeLineHash,
  executeHashlineEdit,
  parseHashlineEdit,
} from "../pi-tools.hashline.js";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TARGET_FILES = [
  "pi-tools.hashline.js",
  "index.js",
  "hashline-prompt.js",
  "test/hashline.test.js",
  "package.json",
  "openclaw.plugin.json",
];
const EDIT_COUNT = 20;
const MIN_LINE_LENGTH = 40;
const MAX_LINE_LENGTH = 200;
const MAX_REPLACEMENT_LENGTH = 220;

function readRepoFile(relPath) {
  return fs.readFileSync(path.join(REPO_ROOT, relPath), "utf-8");
}

function splitFile(content) {
  const newline = content.includes("\r\n") ? "\r\n" : "\n";
  return { lines: content.replace(/\r\n/g, "\n").split("\n"), newline };
}

function approxTokens(text) {
  return Math.ceil(text.length / 4);
}

function percent(part, total) {
  return total === 0 ? 0 : part / total * 100;
}

function scanCandidates(relPath) {
  const { lines } = splitFile(readRepoFile(relPath));
  const counts = new Map();
  for (const line of lines) {
    counts.set(line, (counts.get(line) ?? 0) + 1);
  }

  return lines.flatMap((line, index) => {
    const trimmedLength = line.trim().length;
    if (trimmedLength < MIN_LINE_LENGTH || trimmedLength > MAX_LINE_LENGTH) return [];
    if (counts.get(line) !== 1) return [];
    return [{
      file: relPath,
      line: index + 1,
      oldLine: line,
      hash: computeLineHash(line),
    }];
  });
}

function selectCandidates(buckets, count) {
  const selected = [];
  let offset = 0;
  let madeProgress = true;

  while (selected.length < count && madeProgress) {
    madeProgress = false;
    for (const bucket of buckets) {
      const candidate = bucket[offset];
      if (!candidate) continue;
      selected.push({
        ...candidate,
        ordinal: selected.length + 1,
      });
      madeProgress = true;
      if (selected.length === count) return selected;
    }
    offset++;
  }

  return selected;
}

function makeReplacement(line, ordinal) {
  const marker = ` /* benchmark:${String(ordinal).padStart(2, "0")} */`;
  if (line.length + marker.length <= MAX_REPLACEMENT_LENGTH) {
    return line + marker;
  }
  return line.slice(0, Math.max(0, MAX_REPLACEMENT_LENGTH - marker.length)) + marker;
}

function copyTargets(root) {
  for (const relPath of TARGET_FILES) {
    const targetPath = path.join(root, relPath);
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, readRepoFile(relPath), "utf-8");
  }
}

function withTempWorkspace(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "hashline-benchmark-"));
  try {
    copyTargets(root);
    return fn(root);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

function hashlineDsl(edit, hash = edit.hash) {
  const anchor = hash === null ? String(edit.line) : `${edit.line}${hash}`;
  return `#FILE:${edit.file}\n\u2254${anchor} REPLACE ${edit.newLine}`;
}

function hashlineToolPayload(edit) {
  return JSON.stringify({ input: hashlineDsl(edit) });
}

function searchReplaceToolPayload(edit) {
  return JSON.stringify({
    path: edit.file,
    old_string: edit.oldLine,
    new_string: edit.newLine,
  });
}

function replaceExactLine(root, edit) {
  const filePath = path.join(root, edit.file);
  const { lines, newline } = splitFile(fs.readFileSync(filePath, "utf-8"));
  const matches = [];
  lines.forEach((line, index) => {
    if (line === edit.oldLine) matches.push(index);
  });

  if (matches.length !== 1) {
    return { success: false, error: `expected 1 exact line match, got ${matches.length}` };
  }

  lines[matches[0]] = edit.newLine;
  fs.writeFileSync(filePath, lines.join(newline), "utf-8");
  return { success: true };
}

function applyHashlineEdits(root, edits, options = {}) {
  const failures = [];
  const start = process.hrtime.bigint();

  for (const edit of edits) {
    const hash = options.hashless ? null : edit.hash;
    const parsed = parseHashlineEdit(hashlineDsl(edit, hash));
    const result = executeHashlineEdit(parsed.path, parsed.ops, root, {
      allowHashless: options.hashless === true,
    });
    if (!result.success) {
      failures.push({ edit, error: result.error });
    }
  }

  const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
  return { success: edits.length - failures.length, failures, elapsedMs };
}

function applySearchReplaceEdits(root, edits) {
  const failures = [];
  const start = process.hrtime.bigint();

  for (const edit of edits) {
    const result = replaceExactLine(root, edit);
    if (!result.success) failures.push({ edit, error: result.error });
  }

  const elapsedMs = Number(process.hrtime.bigint() - start) / 1e6;
  return { success: edits.length - failures.length, failures, elapsedMs };
}

function mutateSelectedLines(root, edits) {
  const byFile = new Map();
  for (const edit of edits) {
    if (!byFile.has(edit.file)) byFile.set(edit.file, []);
    byFile.get(edit.file).push(edit);
  }

  for (const [relPath, fileEdits] of byFile) {
    const filePath = path.join(root, relPath);
    const { lines, newline } = splitFile(fs.readFileSync(filePath, "utf-8"));
    for (const edit of fileEdits) {
      lines[edit.line - 1] += ` /* external:${String(edit.ordinal).padStart(2, "0")} */`;
    }
    fs.writeFileSync(filePath, lines.join(newline), "utf-8");
  }
}

function runStaleScenario(edits) {
  const hashed = withTempWorkspace((root) => {
    mutateSelectedLines(root, edits);
    return applyHashlineEdits(root, edits);
  });
  const unsafe = withTempWorkspace((root) => {
    mutateSelectedLines(root, edits);
    return applyHashlineEdits(root, edits, { hashless: true });
  });
  const exact = withTempWorkspace((root) => {
    mutateSelectedLines(root, edits);
    return applySearchReplaceEdits(root, edits);
  });

  return {
    hashlineRejected: edits.length - hashed.success,
    unsafeOverwrote: unsafe.success,
    searchReplaceRejected: edits.length - exact.success,
  };
}

function countByFile(edits) {
  const counts = new Map();
  for (const edit of edits) {
    counts.set(edit.file, (counts.get(edit.file) ?? 0) + 1);
  }
  return [...counts.entries()].map(([file, count]) => `${file}:${count}`).join(", ");
}

function main() {
  const buckets = TARGET_FILES.map(scanCandidates);
  const selected = selectCandidates(buckets, EDIT_COUNT).map((edit) => ({
    ...edit,
    newLine: makeReplacement(edit.oldLine, edit.ordinal),
  }));

  if (selected.length < EDIT_COUNT) {
    throw new Error(`Need ${EDIT_COUNT} candidate lines, found ${selected.length}`);
  }

  const searchPayload = selected.map(searchReplaceToolPayload).join("\n");
  const hashlinePayload = selected.map(hashlineToolPayload).join("\n");
  const searchChars = searchPayload.length;
  const hashlineChars = hashlinePayload.length;
  const searchTokens = approxTokens(searchPayload);
  const hashlineTokens = approxTokens(hashlinePayload);

  const searchApply = withTempWorkspace((root) => applySearchReplaceEdits(root, selected));
  const hashlineApply = withTempWorkspace((root) => applyHashlineEdits(root, selected));
  const stale = runStaleScenario(selected);

  console.log("OpenClaw Hashline benchmark");
  console.log(`Fixture: ${selected.length} single-line replacements across ${new Set(selected.map((e) => e.file)).size} files`);
  console.log(`Files: ${countByFile(selected)}`);
  console.log(`Line length filter: ${MIN_LINE_LENGTH}-${MAX_LINE_LENGTH} trimmed chars`);
  console.log("Metric: edit tool-call payload only; approx tokens = ceil(chars / 4)");
  console.log("");
  console.log("| Method | Success | Payload chars | Approx tokens | Apply ms |");
  console.log("|---|---:|---:|---:|---:|");
  console.log(`| search_replace exact old line | ${searchApply.success}/${selected.length} | ${searchChars} | ${searchTokens} | ${searchApply.elapsedMs.toFixed(2)} |`);
  console.log(`| hashline_edit | ${hashlineApply.success}/${selected.length} | ${hashlineChars} | ${hashlineTokens} | ${hashlineApply.elapsedMs.toFixed(2)} |`);
  console.log("");
  console.log(`Payload saved by hashline_edit: ${searchChars - hashlineChars} chars (${percent(searchChars - hashlineChars, searchChars).toFixed(1)}%), approx ${searchTokens - hashlineTokens} tokens (${percent(searchTokens - hashlineTokens, searchTokens).toFixed(1)}%)`);
  console.log("");
  console.log("| Stale scenario | Result |");
  console.log("|---|---:|");
  console.log(`| hashline_edit with hashes rejected stale edits | ${stale.hashlineRejected}/${selected.length} |`);
  console.log(`| hashline_edit unsafe_line_only overwrote stale lines | ${stale.unsafeOverwrote}/${selected.length} |`);
  console.log(`| search_replace exact old line rejected stale edits | ${stale.searchReplaceRejected}/${selected.length} |`);

  const ok = searchApply.success === selected.length &&
    hashlineApply.success === selected.length &&
    stale.hashlineRejected === selected.length &&
    stale.unsafeOverwrote === selected.length &&
    stale.searchReplaceRejected === selected.length;

  if (!ok) {
    process.exitCode = 1;
  }
}

main();
