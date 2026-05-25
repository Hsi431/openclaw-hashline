// src/agents/pi-tools.hashline.ts
import fs from "node:fs";
import path from "node:path";

// src/agents/data/bigrams.json
var bigrams_default = [
  "aa",
  "ab",
  "ac",
  "ad",
  "ae",
  "af",
  "ag",
  "ah",
  "ai",
  "aj",
  "ak",
  "al",
  "am",
  "an",
  "ao",
  "ap",
  "aq",
  "ar",
  "as",
  "at",
  "au",
  "av",
  "aw",
  "ax",
  "ay",
  "az",
  "ba",
  "bb",
  "bc",
  "bd",
  "be",
  "bf",
  "bg",
  "bh",
  "bi",
  "bj",
  "bk",
  "bl",
  "bm",
  "bn",
  "bo",
  "bp",
  "br",
  "bs",
  "bt",
  "bu",
  "bv",
  "bw",
  "bx",
  "by",
  "bz",
  "ca",
  "cb",
  "cc",
  "cd",
  "ce",
  "cf",
  "cg",
  "ch",
  "ci",
  "cj",
  "ck",
  "cl",
  "cm",
  "cn",
  "co",
  "cp",
  "cq",
  "cr",
  "cs",
  "ct",
  "cu",
  "cv",
  "cw",
  "cx",
  "cy",
  "cz",
  "da",
  "db",
  "dc",
  "dd",
  "de",
  "df",
  "dg",
  "dh",
  "di",
  "dj",
  "dk",
  "dl",
  "dm",
  "dn",
  "do",
  "dp",
  "dq",
  "dr",
  "ds",
  "dt",
  "du",
  "dv",
  "dw",
  "dx",
  "dy",
  "dz",
  "ea",
  "eb",
  "ec",
  "ed",
  "ee",
  "ef",
  "eg",
  "eh",
  "ei",
  "ej",
  "ek",
  "el",
  "em",
  "en",
  "eo",
  "ep",
  "eq",
  "er",
  "es",
  "et",
  "eu",
  "ev",
  "ew",
  "ex",
  "ey",
  "ez",
  "fa",
  "fb",
  "fc",
  "fd",
  "fe",
  "ff",
  "fg",
  "fh",
  "fi",
  "fj",
  "fk",
  "fl",
  "fm",
  "fn",
  "fo",
  "fp",
  "fq",
  "fr",
  "fs",
  "ft",
  "fu",
  "fv",
  "fw",
  "fx",
  "fy",
  "fz",
  "ga",
  "gb",
  "gc",
  "gd",
  "ge",
  "gf",
  "gg",
  "gh",
  "gi",
  "gj",
  "gl",
  "gm",
  "gn",
  "go",
  "gp",
  "gr",
  "gs",
  "gt",
  "gu",
  "gv",
  "gw",
  "gx",
  "gy",
  "gz",
  "ha",
  "hb",
  "hc",
  "hd",
  "he",
  "hf",
  "hg",
  "hh",
  "hi",
  "hj",
  "hk",
  "hl",
  "hm",
  "hn",
  "ho",
  "hp",
  "hq",
  "hr",
  "hs",
  "ht",
  "hu",
  "hv",
  "hw",
  "hx",
  "hy",
  "hz",
  "ia",
  "ib",
  "ic",
  "id",
  "ie",
  "if",
  "ig",
  "ih",
  "ii",
  "ij",
  "ik",
  "il",
  "im",
  "in",
  "io",
  "ip",
  "iq",
  "ir",
  "is",
  "it",
  "iu",
  "iv",
  "iw",
  "ix",
  "iy",
  "iz",
  "ja",
  "jb",
  "jc",
  "jd",
  "je",
  "jf",
  "jg",
  "jh",
  "ji",
  "jj",
  "jk",
  "jl",
  "jm",
  "jn",
  "jo",
  "jp",
  "jq",
  "jr",
  "js",
  "jt",
  "ju",
  "jw",
  "jx",
  "jy",
  "ka",
  "kb",
  "kc",
  "kd",
  "ke",
  "kf",
  "kg",
  "kh",
  "ki",
  "kj",
  "kk",
  "kl",
  "km",
  "kn",
  "ko",
  "kp",
  "kr",
  "ks",
  "kt",
  "ku",
  "kv",
  "kw",
  "kx",
  "ky",
  "la",
  "lb",
  "lc",
  "ld",
  "le",
  "lf",
  "lg",
  "lh",
  "li",
  "lj",
  "lk",
  "ll",
  "lm",
  "ln",
  "lo",
  "lp",
  "lr",
  "ls",
  "lt",
  "lu",
  "lv",
  "lw",
  "lx",
  "ly",
  "lz",
  "ma",
  "mb",
  "mc",
  "md",
  "me",
  "mf",
  "mg",
  "mh",
  "mi",
  "mj",
  "mk",
  "ml",
  "mm",
  "mn",
  "mo",
  "mp",
  "mq",
  "mr",
  "ms",
  "mt",
  "mu",
  "mv",
  "mw",
  "mx",
  "my",
  "mz",
  "na",
  "nb",
  "nc",
  "nd",
  "ne",
  "nf",
  "ng",
  "nh",
  "ni",
  "nj",
  "nk",
  "nl",
  "nm",
  "nn",
  "no",
  "np",
  "nr",
  "ns",
  "nt",
  "nu",
  "nv",
  "nw",
  "nx",
  "ny",
  "nz",
  "oa",
  "ob",
  "oc",
  "od",
  "oe",
  "of",
  "og",
  "oh",
  "oi",
  "oj",
  "ok",
  "ol",
  "om",
  "on",
  "oo",
  "op",
  "oq",
  "or",
  "os",
  "ot",
  "ou",
  "ov",
  "ow",
  "ox",
  "oy",
  "oz",
  "pa",
  "pb",
  "pc",
  "pd",
  "pe",
  "pf",
  "pg",
  "ph",
  "pi",
  "pj",
  "pk",
  "pl",
  "pm",
  "pn",
  "po",
  "pp",
  "pq",
  "pr",
  "ps",
  "pt",
  "pu",
  "pv",
  "pw",
  "px",
  "py",
  "pz",
  "qa",
  "qb",
  "qc",
  "qd",
  "qe",
  "qh",
  "qi",
  "ql",
  "qm",
  "qn",
  "qo",
  "qp",
  "qq",
  "qr",
  "qs",
  "qt",
  "qu",
  "qw",
  "qx",
  "qy",
  "ra",
  "rb",
  "rc",
  "rd",
  "re",
  "rf",
  "rg",
  "rh",
  "ri",
  "rk",
  "rl",
  "rm",
  "rn",
  "ro",
  "rp",
  "rq",
  "rr",
  "rs",
  "rt",
  "ru",
  "rv",
  "rw",
  "rx",
  "ry",
  "rz",
  "sa",
  "sb",
  "sc",
  "sd",
  "se",
  "sf",
  "sg",
  "sh",
  "si",
  "sj",
  "sk",
  "sl",
  "sm",
  "sn",
  "so",
  "sp",
  "sq",
  "sr",
  "ss",
  "st",
  "su",
  "sv",
  "sw",
  "sx",
  "sy",
  "sz",
  "ta",
  "tb",
  "tc",
  "td",
  "te",
  "tf",
  "tg",
  "th",
  "ti",
  "tj",
  "tk",
  "tl",
  "tm",
  "tn",
  "to",
  "tp",
  "tr",
  "ts",
  "tt",
  "tu",
  "tv",
  "tw",
  "tx",
  "ty",
  "tz",
  "ua",
  "ub",
  "uc",
  "ud",
  "ue",
  "uf",
  "ug",
  "uh",
  "ui",
  "uj",
  "uk",
  "ul",
  "um",
  "un",
  "uo",
  "up",
  "uq",
  "ur",
  "us",
  "ut",
  "uu",
  "uv",
  "uw",
  "ux",
  "uy",
  "uz",
  "va",
  "vb",
  "vc",
  "vd",
  "ve",
  "vf",
  "vg",
  "vh",
  "vi",
  "vj",
  "vk",
  "vl",
  "vm",
  "vn",
  "vo",
  "vp",
  "vq",
  "vr",
  "vs",
  "vt",
  "vu",
  "vv",
  "vw",
  "vx",
  "vy",
  "vz",
  "wa",
  "wb",
  "wc",
  "wd",
  "we",
  "wf",
  "wg",
  "wh",
  "wi",
  "wj",
  "wk",
  "wl",
  "wm",
  "wn",
  "wo",
  "wp",
  "wr",
  "ws",
  "wt",
  "wu",
  "wv",
  "ww",
  "wx",
  "wy",
  "xa",
  "xb",
  "xc",
  "xd",
  "xe",
  "xf",
  "xh",
  "xi",
  "xl",
  "xm",
  "xn",
  "xo",
  "xp",
  "xr",
  "xs",
  "xt",
  "xu",
  "xx",
  "xy",
  "xz",
  "ya",
  "yb",
  "yc",
  "yd",
  "ye",
  "yf",
  "yg",
  "yh",
  "yi",
  "yj",
  "yk",
  "yl",
  "ym",
  "yn",
  "yo",
  "yp",
  "yr",
  "ys",
  "yt",
  "yu",
  "yv",
  "yw",
  "yx",
  "yy",
  "yz",
  "za",
  "zb",
  "zc",
  "zd",
  "ze",
  "zf",
  "zg",
  "zh",
  "zi",
  "zk",
  "zl",
  "zm",
  "zn",
  "zo",
  "zp",
  "zr",
  "zs",
  "zt",
  "zu",
  "zw",
  "zx",
  "zy",
  "zz"
];

// src/agents/pi-tools.hashline.ts
var textEncoder = new TextEncoder();
var PRIME32_1 = 2654435761;
var PRIME32_2 = 2246822519;
var PRIME32_3 = 3266489917;
var PRIME32_4 = 668265263;
var PRIME32_5 = 374761393;
function rotl32(x, r) {
  return (x << r | x >>> 32 - r) >>> 0;
}
function read32LE(data, offset) {
  return (data[offset] | data[offset + 1] << 8 | data[offset + 2] << 16 | data[offset + 3] << 24) >>> 0;
}
function xxRound(acc, input) {
  acc = acc + Math.imul(input, PRIME32_2) >>> 0;
  acc = rotl32(acc, 13);
  return Math.imul(acc, PRIME32_1) >>> 0;
}
function xxHash32(input, seed = 0) {
  const data = textEncoder.encode(input);
  const len = data.length;
  let index = 0;
  let h32;
  if (len >= 16) {
    let v1 = seed + PRIME32_1 + PRIME32_2 >>> 0;
    let v2 = seed + PRIME32_2 >>> 0;
    let v3 = seed >>> 0;
    let v4 = seed - PRIME32_1 >>> 0;
    const limit = len - 16;
    while (index <= limit) {
      v1 = xxRound(v1, read32LE(data, index));
      index += 4;
      v2 = xxRound(v2, read32LE(data, index));
      index += 4;
      v3 = xxRound(v3, read32LE(data, index));
      index += 4;
      v4 = xxRound(v4, read32LE(data, index));
      index += 4;
    }
    h32 = rotl32(v1, 1) + rotl32(v2, 7) + rotl32(v3, 12) + rotl32(v4, 18) >>> 0;
  } else {
    h32 = seed + PRIME32_5 >>> 0;
  }
  h32 = h32 + len >>> 0;
  while (index + 4 <= len) {
    const lane = read32LE(data, index);
    h32 = h32 + Math.imul(lane, PRIME32_3) >>> 0;
    h32 = rotl32(h32, 17);
    h32 = Math.imul(h32, PRIME32_4) >>> 0;
    index += 4;
  }
  while (index < len) {
    h32 = h32 + Math.imul(data[index], PRIME32_5) >>> 0;
    h32 = rotl32(h32, 11);
    h32 = Math.imul(h32, PRIME32_1) >>> 0;
    index += 1;
  }
  h32 = (h32 ^ h32 >>> 15) >>> 0;
  h32 = Math.imul(h32, PRIME32_2) >>> 0;
  h32 = (h32 ^ h32 >>> 13) >>> 0;
  h32 = Math.imul(h32, PRIME32_3) >>> 0;
  h32 = (h32 ^ h32 >>> 16) >>> 0;
  return h32 >>> 0;
}
function computeLineHash(line) {
  const line_clean = String(line).replace(/\r/g, "");
  const h = xxHash32(line_clean, 0);
  return bigrams_default[h % bigrams_default.length];
}
function formatHashLines(text, startLine = 1, options = {}) {
  const lines = text.split("\n");
  const body = lines.map((line, i) => {
    const h = computeLineHash(line);
    return `${startLine + i}${h}|${line}`;
  }).join("\n");
  const header = options.filePath ? `#FILE:${options.filePath}\n` : "";
  const suffix = options.suffix ? `\n${options.suffix}` : "";
  return header + body + suffix;
}
function parseAnchor(raw) {
  raw = raw.trim();
  const withHash = raw.match(/^([1-9]\d*)([a-z]{2})$/);
  if (withHash) {
    return { line: parseInt(withHash[1], 10), hash: withHash[2] };
  }
  const withoutHash = raw.match(/^([1-9]\d*)$/);
  if (withoutHash) {
    return { line: parseInt(withoutHash[1], 10), hash: null };
  }
  throw new Error(`Invalid anchor: "${raw}" \u2014 must be lineNumber or lineNumber+2 lowercase letters`);
}
function isOpStart(line) {
  return line.startsWith("\xBB") || line.startsWith("\xAB") || line.startsWith("\u2254") || /^([1-9]\d*(?:[a-z]{2})?)\s+(REPLACE|DELETE|INSERT_BEFORE|INSERT_AFTER)(?:\s|$)/.test(line.trim());
}
function splitInlinePayload(header, command) {
  const token = ` ${command}`;
  const idx = header.indexOf(token);
  if (idx < 0) return null;
  const anchorText = header.slice(0, idx).trim();
  const rest = header.slice(idx + token.length);
  if (rest === "") return { anchorText, inlinePayload: null };
  if (!rest.startsWith(" ")) return null;
  return { anchorText, inlinePayload: rest.slice(1) };
}
function parseReplaceHeader(rest) {
  const deleteMatch = rest.match(/^(.*?)\s+DELETE\s*$/);
  if (deleteMatch) {
    const target = deleteMatch[1].trim();
    if (target.includes("..")) {
      const [start, end] = target.split("..");
      return { kind: "delete", range: { start: parseAnchor(start), end: parseAnchor(end) }, inlinePayload: "" };
    }
    return { kind: "delete", anchor: parseAnchor(target), inlinePayload: "" };
  }
  const replace = splitInlinePayload(rest, "REPLACE");
  const target = replace ? replace.anchorText : rest.trim();
  const rangeParts = target.split("..");
  const parsed = { kind: "replace", inlinePayload: replace ? replace.inlinePayload : null };
  if (rangeParts.length === 2) {
    parsed.range = { start: parseAnchor(rangeParts[0]), end: parseAnchor(rangeParts[1]) };
  } else if (rangeParts.length === 1) {
    parsed.anchor = parseAnchor(target);
  } else {
    throw new Error(`Invalid range anchor: "${target}"`);
  }
  return parsed;
}
function parseCommandHeader(line) {
  const source = line.replace(/^\s+/, "");
  const match = source.match(/^([1-9]\d*(?:[a-z]{2})?)\s+(REPLACE|DELETE|INSERT_BEFORE|INSERT_AFTER)(?:\s(.*))?$/);
  if (!match) return null;
  const anchor = parseAnchor(match[1]);
  const command = match[2];
  const inlinePayload = match[3] ?? null;
  if (command === "DELETE") return { kind: "delete", anchor, inlinePayload: "" };
  if (command === "REPLACE") return { kind: "replace", anchor, inlinePayload };
  if (command === "INSERT_BEFORE") return { kind: "insert_before", anchor, inlinePayload };
  return { kind: "insert_after", anchor, inlinePayload };
}
function parseOpLine(line) {
  const opMarker = line[0];
  if (opMarker === "\xBB") {
    return { kind: "insert_after", anchor: parseAnchor(line.slice(1).trim()), inlinePayload: null };
  }
  if (opMarker === "\xAB") {
    return { kind: "insert_before", anchor: parseAnchor(line.slice(1).trim()), inlinePayload: null };
  }
  if (opMarker === "\u2254") {
    return parseReplaceHeader(line.slice(1).replace(/^\s+/, ""));
  }
  return parseCommandHeader(line);
}
function parseHashlineEdit(input) {
  const blocks = [];
  const inputLines = input.split("\n");
  let i = 0;
  while (i < inputLines.length) {
    while (i < inputLines.length && inputLines[i].trim() === "") {
      i++;
    }
    if (i >= inputLines.length) break;
    const line = inputLines[i];
    if (!line.startsWith("#FILE:") || line.length < 6) {
      i++;
      continue;
    }
    const path2 = line.slice(6).trim();
    i++;
    const ops = [];
    while (i < inputLines.length) {
      const currentLine = inputLines[i];
      if (currentLine.startsWith("#FILE:")) {
        break;
      }
      const parsed = parseOpLine(currentLine);
      if (parsed) {
        i++;
        const payloadLines = parsed.inlinePayload !== null ? [parsed.inlinePayload] : [];
        while (i < inputLines.length) {
          const peek = inputLines[i];
          if (peek.startsWith("#FILE:") || isOpStart(peek)) {
            break;
          }
          payloadLines.push(peek);
          i++;
        }
        const payload = parsed.kind === "delete" ? "" : payloadLines.join("\n");
        if (parsed.range) {
          ops.push({ kind: parsed.kind, range: parsed.range, payload });
        } else if (parsed.anchor) {
          ops.push({ kind: parsed.kind, anchor: parsed.anchor, payload });
        } else {
          throw new Error(`No anchor parsed for: "${currentLine}"`);
        }
      } else {
        i++;
      }
    }
    if (ops.length > 0 || path2) {
      blocks.push({ path: path2, ops });
    }
  }
  if (blocks.length !== 1) {
    throw new Error(
      `parseHashlineEdit expects exactly one #FILE: block, got ${blocks.length}`
    );
  }
  if (!blocks[0].path) {
    throw new Error("Hashline edit #FILE path is empty");
  }
  return { path: blocks[0].path, ops: blocks[0].ops };
}
function validateAnchors(filePath, anchors, options = {}) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const staleLines = [];
  const missingHashLines = [];
  for (const a of anchors) {
    const lineIdx = a.line - 1;
    const actualHash = computeLineHash(lineIdx < lines.length ? lines[lineIdx] : "");
    if (lineIdx >= lines.length) {
      staleLines.push({ line: a.line, expectedHash: a.hash ?? "(none)", actualHash });
      continue;
    }
    if (a.hash === null && options.allowHashless !== true) {
      missingHashLines.push({ line: a.line, actualHash });
      continue;
    }
    if (a.hash !== null && a.hash !== actualHash) {
      staleLines.push({ line: a.line, expectedHash: a.hash, actualHash });
    }
  }
  if (staleLines.length === 0 && missingHashLines.length === 0) {
    return { valid: true };
  }
  return { valid: false, staleLines, missingHashLines };
}
function collectAnchors(ops) {
  const out = [];
  for (const op of ops) {
    if (op.anchor) out.push(op.anchor);
    if (op.range) {
      out.push(op.range.start);
      out.push(op.range.end);
    }
  }
  return out;
}
function sortOpsDesc(ops) {
  return [...ops].sort((a, b) => {
    const lineA = a.range ? a.range.end.line : a.anchor.line;
    const lineB = b.range ? b.range.end.line : b.anchor.line;
    return lineB - lineA;
  });
}
function isPathInside(candidate, root) {
  const rel = path.relative(root, candidate);
  return rel === "" || !!rel && !rel.startsWith("..") && !path.isAbsolute(rel);
}
function resolveWorkspaceFile(filePath, root) {
  if (root) {
    const lexicalRoot = path.resolve(root);
    const lexicalCandidate = path.resolve(lexicalRoot, filePath);
    if (!isPathInside(lexicalCandidate, lexicalRoot)) {
      return { ok: false, error: "Path traversal denied." };
    }
    let realRoot;
    let realCandidate;
    try {
      realRoot = fs.realpathSync.native(lexicalRoot);
      realCandidate = fs.realpathSync.native(lexicalCandidate);
    } catch (err) {
      return { ok: false, error: `Unable to resolve file path: ${err instanceof Error ? err.message : String(err)}` };
    }
    if (!isPathInside(realCandidate, realRoot)) {
      return { ok: false, error: "Path traversal denied." };
    }
    return { ok: true, path: realCandidate };
  }
  return { ok: true, path: path.resolve(filePath) };
}
function validateOperations(ops, options = {}) {
  if (!Array.isArray(ops) || ops.length === 0) {
    return { ok: false, error: "No hashline operations were provided." };
  }
  for (const op of ops) {
    if (!["insert_before", "insert_after", "replace", "delete"].includes(op.kind)) {
      return { ok: false, error: `Unknown operation kind: ${op.kind}` };
    }
    if (op.range && op.range.start.line > op.range.end.line) {
      return { ok: false, error: `Invalid range ${op.range.start.line}..${op.range.end.line}: start must be <= end.` };
    }
    if ((op.kind === "insert_before" || op.kind === "insert_after" || op.kind === "replace") && op.payload === "") {
      return { ok: false, error: `${op.kind} operation has an empty payload. Use DELETE for deletion.` };
    }
    for (const anchor of collectAnchors([op])) {
      if (anchor.hash === null && options.allowHashless !== true) {
        return { ok: false, error: `Missing hash for line ${anchor.line}. Re-read the file and use the line hash, or set unsafe_line_only=true explicitly.` };
      }
    }
  }
  return { ok: true };
}
function splitFileLines(content) {
  const newline = content.includes("\r\n") ? "\r\n" : "\n";
  return { lines: content.replace(/\r\n/g, "\n").split("\n"), newline };
}
function writeFileAtomic(filePath, content, mode) {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath);
  const tmpPath = path.join(dir, `.${base}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`);
  let fd;
  try {
    fd = fs.openSync(tmpPath, "wx", mode ?? 0o666);
    fs.writeFileSync(fd, content, "utf-8");
    fs.fsyncSync(fd);
    fs.closeSync(fd);
    fd = void 0;
    if (mode !== void 0) fs.chmodSync(tmpPath, mode);
    fs.renameSync(tmpPath, filePath);
    try {
      const dirFd = fs.openSync(dir, "r");
      try {
        fs.fsyncSync(dirFd);
      } finally {
        fs.closeSync(dirFd);
      }
    } catch {
    }
  } catch (err) {
    if (fd !== void 0) {
      try {
        fs.closeSync(fd);
      } catch {
      }
    }
    try {
      fs.unlinkSync(tmpPath);
    } catch {
    }
    throw err;
  }
}
function executeHashlineEdit(filePath, ops, root, options = {}) {
  const resolvedFile = resolveWorkspaceFile(filePath, root);
  if (!resolvedFile.ok) {
    return { success: false, error: resolvedFile.error, staleLines: [], missingHashLines: [] };
  }
  const resolved = resolvedFile.path;
  const shape = validateOperations(ops, { allowHashless: options.allowHashless === true });
  if (!shape.ok) {
    return { success: false, error: shape.error, staleLines: [], missingHashLines: [] };
  }
  const anchors = collectAnchors(ops);
  if (anchors.length > 0) {
    const validation = validateAnchors(resolved, anchors, { allowHashless: options.allowHashless === true });
    if (!validation.valid) {
      return {
        success: false,
        error: validation.missingHashLines?.length ? "Hashline anchors require hashes by default." : "Hashline anchors do not match the current file content \u2014 the file may have changed since the last read.",
        staleLines: validation.staleLines ?? [],
        missingHashLines: validation.missingHashLines ?? []
      };
    }
  }
  const content = fs.readFileSync(resolved, "utf-8");
  const { lines, newline } = splitFileLines(content);
  const stat = fs.statSync(resolved);
  const sorted = sortOpsDesc(ops);
  for (const op of sorted) {
    const payloadLines = op.payload === "" ? [] : op.payload.split("\n");
    if (op.kind === "insert_before") {
      const idx = op.anchor.line - 1;
      lines.splice(idx, 0, ...payloadLines);
    } else if (op.kind === "insert_after") {
      const idx = op.anchor.line;
      lines.splice(idx, 0, ...payloadLines);
    } else if (op.kind === "replace") {
      if (op.range) {
        const startIdx = op.range.start.line - 1;
        const endIdx = op.range.end.line - 1;
        const removeCount = endIdx - startIdx + 1;
        lines.splice(startIdx, removeCount, ...payloadLines);
      } else {
        const idx = op.anchor.line - 1;
        lines.splice(idx, 1, ...payloadLines);
      }
    } else if (op.kind === "delete") {
      if (op.range) {
        const startIdx = op.range.start.line - 1;
        const endIdx = op.range.end.line - 1;
        const removeCount = endIdx - startIdx + 1;
        lines.splice(startIdx, removeCount);
      } else {
        const idx = op.anchor.line - 1;
        lines.splice(idx, 1);
      }
    }
  }
  const newContent = lines.join(newline);
  writeFileAtomic(resolved, newContent, stat.mode);
  return {
    success: true,
    summary: `\u6210\u529F\u5957\u7528 ${ops.length} \u7B46\u7DE8\u8F2F\u81F3 ${filePath}`
  };
}
function formatStaleLinesReport(staleLines = [], missingHashLines = []) {
  if (staleLines.length === 0 && missingHashLines.length === 0) return "\u6C92\u6709\u767C\u73FE stale \u884C\u3002";
  const sections = [];
  if (missingHashLines.length > 0) {
    sections.push(`\u26A0\uFE0F \u6709 ${missingHashLines.length} \u884C\u7F3A\u5C11 hash\uFF08\u9810\u8A2D\u62D2\u7D55 hashless \u7DE8\u8F2F\uFF09\uFF1A
${missingHashLines.map((s) => `  - \u7B2C ${s.line} \u884C\uFF1A\u76EE\u524D hash\u300C${s.actualHash}\u300D`).join("\n")}`);
  }
  if (staleLines.length > 0) {
    const header = `\u26A0\uFE0F \u767C\u73FE ${staleLines.length} \u884C hash \u4E0D\u5339\u914D\uFF08\u6A94\u6848\u53EF\u80FD\u5DF2\u88AB\u5916\u90E8\u4FEE\u6539\uFF09\uFF1A
`;
    const rows = staleLines.map((s) => {
      return `  - \u7B2C ${s.line} \u884C\uFF1A\u9810\u671F hash\u300C${s.expectedHash}\u300D\uFF0C\u5BE6\u969B hash\u300C${s.actualHash}\u300D`;
    });
    sections.push(header + rows.join("\n"));
  }
  return sections.join("\n\n") + "\n\n\u8ACB\u91CD\u65B0\u8B80\u53D6\u6A94\u6848\u53D6\u5F97\u6700\u65B0 hash \u5F8C\u518D\u8A66\u3002";
}
export {
  computeLineHash,
  executeHashlineEdit,
  formatHashLines,
  formatStaleLinesReport,
  parseAnchor,
  parseHashlineEdit,
  validateAnchors,
  xxHash32
};
