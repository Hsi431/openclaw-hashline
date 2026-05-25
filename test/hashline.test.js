import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import plugin from "../index.js";
import {
  computeLineHash,
  executeHashlineEdit,
  formatHashLines,
  parseAnchor,
  parseHashlineEdit,
  xxHash32,
} from "../pi-tools.hashline.js";

function withTempRoot(fn) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "hashline-test-"));
  try {
    const result = fn(root);
    if (result && typeof result.then === "function") {
      return result.finally(() => fs.rmSync(root, { recursive: true, force: true }));
    }
    fs.rmSync(root, { recursive: true, force: true });
    return result;
  } catch (err) {
    fs.rmSync(root, { recursive: true, force: true });
    throw err;
  }
}

function writeSample(root, file = "a.txt") {
  fs.writeFileSync(path.join(root, file), "one\ntwo\nthree", "utf-8");
}

test("xxHash32 uses standard vectors", () => {
  assert.equal(xxHash32("").toString(16).padStart(8, "0"), "02cc5d05");
  assert.equal(xxHash32("hello").toString(16).padStart(8, "0"), "fb0077f9");
  assert.equal(xxHash32("The quick brown fox jumps over the lazy dog").toString(16).padStart(8, "0"), "e85ea4de");
});

test("formatHashLines can include #FILE header", () => {
  const formatted = formatHashLines("one\ntwo", 10, { filePath: "src/app.ts" });
  assert.match(formatted, /^#FILE:src\/app\.ts\n10[a-z]{2}\|one\n11[a-z]{2}\|two$/);
});

test("anchors are strict and do not silently downgrade malformed hashes", () => {
  const hash = computeLineHash("two");
  assert.deepEqual(parseAnchor(`2${hash}`), { line: 2, hash });
  assert.deepEqual(parseAnchor("2"), { line: 2, hash: null });
  assert.throws(() => parseAnchor("42a3"), /Invalid anchor/);
  assert.throws(() => parseAnchor("12foo"), /Invalid anchor/);
});

test("README marker syntax parses", () => {
  const hash = computeLineHash("two");
  const edit = parseHashlineEdit(`#FILE:a.txt\n\u22542${hash} REPLACE TWO`);
  assert.equal(edit.path, "a.txt");
  assert.deepEqual(edit.ops, [
    { kind: "replace", anchor: { line: 2, hash }, payload: "TWO" },
  ]);
});

test("hash mismatch rejects stale edits", () => withTempRoot((root) => {
  writeSample(root);
  const oldHash = computeLineHash("two");
  const edit = parseHashlineEdit(`#FILE:a.txt\n\u22542${oldHash} REPLACE TWO`);
  fs.writeFileSync(path.join(root, "a.txt"), "one\nchanged\nthree", "utf-8");
  const result = executeHashlineEdit(edit.path, edit.ops, root);
  assert.equal(result.success, false);
  assert.match(result.error, /do not match/);
  assert.equal(result.staleLines[0].line, 2);
}));

test("hash includes trailing spaces and edits preserve CRLF", () => withTempRoot((root) => {
  fs.writeFileSync(path.join(root, "a.txt"), "one\r\ntwo  \r\nthree", "utf-8");
  assert.notEqual(computeLineHash("two"), computeLineHash("two  "));
  const h2 = computeLineHash("two  ");
  const edit = parseHashlineEdit("#FILE:a.txt\n\u22542" + h2 + " REPLACE TWO  ");
  const result = executeHashlineEdit(edit.path, edit.ops, root);
  assert.equal(result.success, true);
  assert.equal(fs.readFileSync(path.join(root, "a.txt"), "utf-8"), "one\r\nTWO  \r\nthree");
}));

test("hashless edits are rejected unless explicitly allowed", () => withTempRoot((root) => {
  writeSample(root);
  const edit = parseHashlineEdit("#FILE:a.txt\n\u22542 REPLACE TWO");
  const blocked = executeHashlineEdit(edit.path, edit.ops, root);
  assert.equal(blocked.success, false);
  assert.match(blocked.error, /Missing hash|require hashes/);

  const allowed = executeHashlineEdit(edit.path, edit.ops, root, { allowHashless: true });
  assert.equal(allowed.success, true);
  assert.equal(fs.readFileSync(path.join(root, "a.txt"), "utf-8"), "one\nTWO\nthree");
}));

test("empty ops and reversed ranges are rejected", () => withTempRoot((root) => {
  writeSample(root);
  const empty = parseHashlineEdit("#FILE:a.txt");
  assert.equal(executeHashlineEdit(empty.path, empty.ops, root).success, false);

  const h2 = computeLineHash("two");
  const h3 = computeLineHash("three");
  const reversed = parseHashlineEdit(`#FILE:a.txt\n\u22543${h3}..2${h2}\nX`);
  const result = executeHashlineEdit(reversed.path, reversed.ops, root);
  assert.equal(result.success, false);
  assert.match(result.error, /start must be <= end/);
}));

test("directory symlink traversal is denied", { skip: process.platform === "win32" }, () => withTempRoot((root) => {
  const outsideDir = fs.mkdtempSync(path.join(os.tmpdir(), "hashline-outside-"));
  try {
    fs.writeFileSync(path.join(outsideDir, "target.txt"), "secret\nline2", "utf-8");
    fs.symlinkSync(outsideDir, path.join(root, "dir"), "dir");
    const h1 = computeLineHash("secret");
    const edit = parseHashlineEdit(`#FILE:dir/target.txt\n\u22541${h1} REPLACE changed`);
    const result = executeHashlineEdit(edit.path, edit.ops, root);
    assert.equal(result.success, false);
    assert.match(result.error, /Path traversal denied/);
    assert.equal(fs.readFileSync(path.join(outsideDir, "target.txt"), "utf-8"), "secret\nline2");
  } finally {
    fs.rmSync(outsideDir, { recursive: true, force: true });
  }
}));

test("plugin read hook emits #FILE header and leaves continuation notice un-hashed", () => {
  const hooks = {};
  let toolFactory;
  plugin.register({
    on(name, handler) {
      hooks[name] = handler;
    },
    registerTool(tool) {
      toolFactory = tool;
    },
    logger: { info() {}, warn() {}, error() {}, debug() {} },
  });

  assert.equal(typeof toolFactory, "function");
  hooks.before_tool_call({
    toolName: "read",
    toolCallId: "read-1",
    params: { path: "src/app.ts", offset: 42 },
  });
  const event = {
    toolName: "read",
    toolCallId: "read-1",
    message: {
      content: [{ type: "text", text: "line A\nline B\n\n[3 more lines in file. Use offset=44 to continue.]" }],
    },
  };
  hooks.tool_result_persist(event);
  const text = event.message.content[0].text;
  assert.match(text, /^#FILE:src\/app\.ts\n42[a-z]{2}\|line A\n43[a-z]{2}\|line B\n\[hashline note\]/);
  assert.doesNotMatch(text, /^44[a-z]{2}\|\[3 more lines/m);
});

test("plugin tool uses ctx.workspaceDir", async () => withTempRoot(async (root) => {
  writeSample(root);
  const h2 = computeLineHash("two");
  let toolFactory;
  plugin.register({
    on() {},
    registerTool(tool) {
      toolFactory = tool;
    },
    logger: { info() {}, warn() {}, error() {}, debug() {} },
  });
  const tool = toolFactory({ workspaceDir: root });
  assert.equal(tool.label, "Hashline Edit");
  const result = await tool.execute("call-1", {
    input: `#FILE:a.txt\n\u22542${h2} REPLACE TWO`,
  });
  assert.equal(result.details.unsafeLineOnly, false);
  assert.match(result.content[0].text, /成功套用 1/);
  assert.equal(fs.readFileSync(path.join(root, "a.txt"), "utf-8"), "one\nTWO\nthree");
}));
