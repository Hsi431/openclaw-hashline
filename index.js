// hashline/index.js — OpenClaw plugin
import {
  formatHashLines,
  executeHashlineEdit,
  parseHashlineEdit,
  formatStaleLinesReport,
} from "./pi-tools.hashline.js";
import { HASHLINE_PROMPT } from "./hashline-prompt.js";
import path from "node:path";

const READ_CONTINUATION_RE = /\n\n(\[(?:\d+ more lines in file\. Use offset=\d+ to continue\.|Showing lines \d+-\d+ of \d+(?: \([^)]+\))?\. Use offset=\d+ to continue\.)\])$/;

function extractTextOnly(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return null;
  const parts = [];
  for (const block of content) {
    if (!block || block.type !== "text" || typeof block.text !== "string") {
      return null;
    }
    parts.push(block.text);
  }
  return parts.join("\n");
}

function wrapTextBlocks(text) {
  return [{ type: "text", text }];
}

function normalizeReadParams(params) {
  const record = params && typeof params === "object" ? params : {};
  const filePath = typeof record.path === "string" ? record.path : typeof record.file_path === "string" ? record.file_path : typeof record.filePath === "string" ? record.filePath : "";
  const offsetRaw = Number(record.offset ?? 1);
  const offset = Number.isFinite(offsetRaw) && offsetRaw >= 1 ? Math.floor(offsetRaw) : 1;
  return { path: filePath.trim(), offset };
}

function normalizeReadText(text) {
  const trimmed = text.trim();
  if (/^\[Line \d+ is .+ exceeds .+ limit\. Use bash:/.test(trimmed)) {
    return null;
  }
  if (/^Read image file \[/.test(trimmed)) {
    return null;
  }
  const match = text.match(READ_CONTINUATION_RE);
  if (!match) return { text, suffix: "" };
  return {
    text: text.slice(0, -match[0].length),
    suffix: `[hashline note] ${match[1]}`,
  };
}

function textResult(text, details = {}) {
  return { content: [{ type: "text", text }], details };
}

function resolveWorkspaceRoot(ctx) {
  return ctx?.workspaceDir ||
    process.env.OPENCLAW_WORKSPACE_DIR ||
    path.resolve(process.env.HOME || "/tmp", ".openclaw", "workspace");
}

function createHashlineEditTool(ctx) {
  const workspaceRoot = resolveWorkspaceRoot(ctx);
  return {
    name: "hashline_edit",
    label: "Hashline Edit",
    description: `Edit an existing workspace file using line-hash anchors.

Use the #FILE header produced by read results:
  #FILE:src/app.ts
  ≔42ab REPLACE const greeting = "hello";
  »17cd
  console.log("added after line 17");
  «9ef
  // inserted before line 9
  ≔99xy DELETE
  ≔120aa..125bb
  // replacement block

Hash anchors are required by default. Hashless line-only edits are unsafe and only allowed when the tool parameter unsafe_line_only is true.

${HASHLINE_PROMPT || ""}`,
    parameters: {
      type: "object",
      properties: {
        input: {
          type: "string",
          description: "Hashline edit DSL with exactly one #FILE:path block",
        },
        unsafe_line_only: {
          type: "boolean",
          description: "Allow line-number-only anchors without hashes. Unsafe; use only when you accept stale-line risk.",
        },
      },
      required: ["input"],
    },
    execute: async (_toolCallId, params) => {
      const input = typeof params?.input === "string" ? params.input : "";
      const allowHashless = params?.unsafe_line_only === true;

      if (!input.trim()) {
        return textResult("Hashline edit input is empty.");
      }

      let edit;
      try {
        edit = parseHashlineEdit(input);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return textResult(`❌ ${message}`, { error: message });
      }

      const result = executeHashlineEdit(edit.path, edit.ops, workspaceRoot, { allowHashless });
      if (result.success) {
        const suffix = allowHashless ? "\n⚠️ unsafe_line_only was used; stale-line protection was bypassed for hashless anchors." : "";
        return textResult(result.summary + suffix, { unsafeLineOnly: allowHashless });
      }
      return textResult(
        `❌ ${result.error}\n\n${formatStaleLinesReport(result.staleLines, result.missingHashLines)}`,
        {
          staleLines: result.staleLines ?? [],
          missingHashLines: result.missingHashLines ?? [],
          error: result.error,
          unsafeLineOnly: allowHashless,
        }
      );
    },
  };
}

export default {
  id: "hashline",
  name: "Hashline Plugin",
  description: "Adds line-hash based file anchoring and editing for sub-agent tool safety",
  version: "1.0.0",

  register(api) {
    // ── per-toolCallId param cache (capture read params in before_tool_call) ──
    const readParamCache = new Map();

    // ── before_tool_call: capture read offset/limit params ──
    api.on("before_tool_call", (event) => {
      if (event.toolName !== "read") return;
      if (!event.toolCallId) return;
      readParamCache.set(event.toolCallId, normalizeReadParams(event.params));
    });

    // ── tool_result_persist: inject hashline into persisted transcript ──
    // NOTE: modifies the TRANSCRIPT copy — does not affect what the current model turn sees.
    // The hashline output will be visible to the model on the NEXT inference (same or future turn).
    api.on("tool_result_persist", (event) => {
      if (event.toolName !== "read") return;
      const cached = event.toolCallId ? readParamCache.get(event.toolCallId) : null;
      if (event.toolCallId) readParamCache.delete(event.toolCallId);
      if (!event.message || !event.message.content) return;
      if (!cached?.path) return;
      const text = extractTextOnly(event.message.content);
      if (text === null) return;
      const normalized = normalizeReadText(text);
      if (!normalized) return;
      const startLine = cached.offset;
      const formatted = formatHashLines(normalized.text, startLine, {
        filePath: cached.path,
        suffix: normalized.suffix,
      });
      event.message.content = wrapTextBlocks(formatted);
      return { message: event.message };
    });

    // ── register hashline_edit tool ──
    api.registerTool((ctx) => createHashlineEditTool(ctx), { name: "hashline_edit" });

    api.logger.info("Hashline plugin registered");
  },

  activate(api) {
    api.logger.info("Hashline plugin activated");
  },
};
