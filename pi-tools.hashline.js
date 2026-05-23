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
var PRIME32_3 = 3266489909;
var PRIME32_4 = 668265263;
var PRIME32_5 = 374761393;
function rotl32(x, r) {
  return (x << r | x >>> 32 - r) >>> 0;
}
function read32LE(data, offset) {
  return (data[offset] | data[offset + 1] << 8 | data[offset + 2] << 16 | data[offset + 3] << 24 >>> 0) >>> 0;
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
      let lane = read32LE(data, index);
      v1 = v1 + (lane * PRIME32_2 >>> 0) >>> 0;
      v1 = rotl32(v1, 13);
      v1 = v1 * PRIME32_1 >>> 0;
      index += 4;
      lane = read32LE(data, index);
      v2 = v2 + (lane * PRIME32_2 >>> 0) >>> 0;
      v2 = rotl32(v2, 13);
      v2 = v2 * PRIME32_1 >>> 0;
      index += 4;
      lane = read32LE(data, index);
      v3 = v3 + (lane * PRIME32_2 >>> 0) >>> 0;
      v3 = rotl32(v3, 13);
      v3 = v3 * PRIME32_1 >>> 0;
      index += 4;
      lane = read32LE(data, index);
      v4 = v4 + (lane * PRIME32_2 >>> 0) >>> 0;
      v4 = rotl32(v4, 13);
      v4 = v4 * PRIME32_1 >>> 0;
      index += 4;
    }
    h32 = rotl32(v1, 1) + rotl32(v2, 7) + rotl32(v3, 12) + rotl32(v4, 18) >>> 0;
  } else {
    h32 = seed + PRIME32_5 >>> 0;
  }
  h32 = h32 + len >>> 0;
  while (index + 4 <= len) {
    const lane = read32LE(data, index);
    h32 = h32 + (lane * PRIME32_3 >>> 0) >>> 0;
    h32 = rotl32(h32, 17);
    h32 = h32 * PRIME32_4 >>> 0;
    index += 4;
  }
  while (index < len) {
    h32 = h32 + data[index] * PRIME32_5 >>> 0;
    h32 = rotl32(h32, 11);
    h32 = h32 * PRIME32_1 >>> 0;
    index += 1;
  }
  h32 = (h32 ^ h32 >>> 15) >>> 0;
  h32 = h32 * PRIME32_2 >>> 0;
  h32 = (h32 ^ h32 >>> 13) >>> 0;
  h32 = h32 * PRIME32_3 >>> 0;
  h32 = (h32 ^ h32 >>> 16) >>> 0;
  return h32 >>> 0;
}
function computeLineHash(line) {
  const line_clean = line.replace(/\r/g, "").trimEnd();
  const h = xxHash32(line_clean, 0);
  return bigrams_default[h % bigrams_default.length];
}
function formatHashLines(text, startLine = 1) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    const h = computeLineHash(line);
    return `${startLine + i}${h}|${line}`;
  }).join("\n");
}
function parseAnchor(raw) {
  raw = raw.trimEnd();
  const lastTwo = raw.slice(-2);
  if (raw.length >= 3 && /^[a-z]{2}$/.test(lastTwo)) {
    const lineStr = raw.slice(0, -2);
    const line = parseInt(lineStr, 10);
    if (!isNaN(line) && line >= 1) {
      return { line, hash: lastTwo };
    }
  }
  const line = parseInt(raw, 10);
  if (isNaN(line) || line < 1) {
    throw new Error(`Invalid anchor: "${raw}" \u2014 must be lineNumber or lineNumber+2-char-bigram`);
  }
  return { line, hash: null };
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
      const opMarker = currentLine[0];
      if (opMarker === "\xBB" || opMarker === "\xAB" || opMarker === "\u2254") {
        const rest = currentLine.slice(1).trim();
        let kind;
        let anchor;
        let range;
        if (opMarker === "\xBB") {
          kind = "insert_after";
          anchor = parseAnchor(rest);
        } else if (opMarker === "\xAB") {
          kind = "insert_before";
          anchor = parseAnchor(rest);
        } else {
          const rangeParts = rest.split("..");
          let inlinePayload = null;
          if (rangeParts.length === 2) {
            kind = "replace";
            const endPart = rangeParts[1];
            const replaceIdx = endPart.indexOf(" REPLACE ");
            if (replaceIdx >= 0) {
              range = { start: parseAnchor(rangeParts[0].trim()), end: parseAnchor(endPart.substring(0, replaceIdx).trim()) };
              inlinePayload = endPart.substring(replaceIdx + 9);
            } else {
              range = { start: parseAnchor(rangeParts[0].trim()), end: parseAnchor(endPart.trim()) };
            }
          } else {
            const replaceIdx = rest.indexOf(" REPLACE ");
            const deleteIdx = rest.indexOf(" DELETE");
            if (replaceIdx >= 0) {
              kind = "replace";
              anchor = parseAnchor(rest.substring(0, replaceIdx).trim());
              inlinePayload = rest.substring(replaceIdx + 9);
            } else if (deleteIdx >= 0) {
              kind = "replace";
              anchor = parseAnchor(rest.substring(0, deleteIdx).trim());
              inlinePayload = "";
            } else {
              kind = "replace";
              anchor = parseAnchor(rest.trim());
            }
          }
          if (inlinePayload !== null) {
            i++;
            if (range) ops.push({ kind, range, payload: inlinePayload });
            else ops.push({ kind, anchor, payload: inlinePayload });
            while (i < inputLines.length) {
              const peek = inputLines[i];
              if (peek.startsWith("#FILE:") || peek.startsWith("\xBB") || peek.startsWith("\xAB") || peek.startsWith("\u2254")) break;
              i++;
            }
            continue;
          }
        }
        i++;
        const payloadLines = [];
        while (i < inputLines.length) {
          const peek = inputLines[i];
          if (peek.startsWith("#FILE:") || peek.startsWith("\xBB") || peek.startsWith("\xAB") || peek.startsWith("\u2254")) {
            break;
          }
          payloadLines.push(peek);
          i++;
        }
        const payload = payloadLines.join("\n");
        if (range) {
          ops.push({ kind, range, payload });
        } else if (anchor) {
          ops.push({ kind, anchor, payload });
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
  return { path: blocks[0].path, ops: blocks[0].ops };
}
function validateAnchors(filePath, anchors) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const staleLines = [];
  for (const a of anchors) {
    const lineIdx = a.line - 1;
    const actualHash = computeLineHash(lineIdx < lines.length ? lines[lineIdx] : "");
    if (lineIdx >= lines.length) {
      staleLines.push({ line: a.line, expectedHash: a.hash ?? "(none)", actualHash });
      continue;
    }
    if (a.hash !== null && a.hash !== actualHash) {
      staleLines.push({ line: a.line, expectedHash: a.hash, actualHash });
    }
  }
  if (staleLines.length === 0) {
    return { valid: true };
  }
  return { valid: false, staleLines };
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
function executeHashlineEdit(filePath, ops, root) {
  const resolved = path.resolve(root ?? "", filePath);
  if (root) {
    const normalizedRoot = path.resolve(root) + path.sep;
    if (!resolved.startsWith(normalizedRoot) && resolved !== path.resolve(root)) {
      return { success: false, error: "Path traversal denied.", staleLines: [] };
    }
  }
  const anchors = collectAnchors(ops);
  if (anchors.length > 0) {
    const validation = validateAnchors(resolved, anchors);
    if (!validation.valid) {
      return {
        success: false,
        error: "Hashline anchors do not match the current file content \u2014 the file may have changed since the last read.",
        staleLines: validation.staleLines
      };
    }
  }
  const content = fs.readFileSync(resolved, "utf-8");
  const lines = content.split("\n");
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
    }
  }
  const newContent = lines.join("\n");
  const tmpPath = resolved + ".tmp";
  fs.writeFileSync(tmpPath, newContent, "utf-8");
  fs.renameSync(tmpPath, resolved);
  return {
    success: true,
    summary: `\u6210\u529F\u5957\u7528 ${ops.length} \u7B46\u7DE8\u8F2F\u81F3 ${filePath}`
  };
}
function formatStaleLinesReport(staleLines) {
  if (staleLines.length === 0) return "\u6C92\u6709\u767C\u73FE stale \u884C\u3002";
  const header = `\u26A0\uFE0F \u767C\u73FE ${staleLines.length} \u884C hash \u4E0D\u5339\u914D\uFF08\u6A94\u6848\u53EF\u80FD\u5DF2\u88AB\u5916\u90E8\u4FEE\u6539\uFF09\uFF1A
`;
  const rows = staleLines.map((s) => {
    return `  - \u7B2C ${s.line} \u884C\uFF1A\u9810\u671F hash\u300C${s.expectedHash}\u300D\uFF0C\u5BE6\u969B hash\u300C${s.actualHash}\u300D`;
  });
  const footer = "\n\n\u8ACB\u91CD\u65B0\u8B80\u53D6\u6A94\u6848\u53D6\u5F97\u6700\u65B0 hash \u5F8C\u518D\u8A66\u3002";
  return header + rows.join("\n") + footer;
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
