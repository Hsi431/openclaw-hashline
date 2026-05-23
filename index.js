// hashline/index.js — OpenClaw plugin
import {
  formatHashLines,
  executeHashlineEdit,
  parseHashlineEdit,
  formatStaleLinesReport,
} from "./pi-tools.hashline.js";
import { HASHLINE_PROMPT } from "./hashline-prompt.js";
import path from "node:path";

function stripTextBlocks(content) {
  // content can be string | array of {type:"text",text:string}
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";
  return content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

function wrapTextBlocks(text) {
  return [{ type: "text", text }];
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
      const offset = event.params?.offset ?? 1;
      readParamCache.set(event.toolCallId, { offset: Number(offset) });
    });

    // ── tool_result_persist: inject hashline into persisted transcript ──
    // NOTE: modifies the TRANSCRIPT copy — does not affect what the current model turn sees.
    // The hashline output will be visible to the model on the NEXT inference (same or future turn).
    // For immediate editing, use hashless mode (line numbers only) — the tool computes hashes internally.
    api.on("tool_result_persist", (event) => {
      if (event.toolName !== "read") return;
      if (!event.message || !event.message.content) return;
      const text = stripTextBlocks(event.message.content);
      if (!text) return;
      const cached = readParamCache.get(event.toolCallId);
      const startLine = cached ? cached.offset : 1;
      const formatted = formatHashLines(text, startLine);
      event.message.content = wrapTextBlocks(formatted);
      return { message: event.message };
    });

    // ── register hashline_edit tool ──
    api.registerTool({
      name: "hashline_edit",
      description: `Edit a file using line-hash anchors for safety. Use after reading a file with hashline format.

Syntax (one operation per line):
  <anchored-hash> <command> <content>

Anchored-hash: a line-number followed by the 2-char line hash from the source file (e.g. "17a7")
  - OR: just the line number for hashless mode (e.g. "17") — the tool validates internally
Commands:
  - REPLACE: replace the anchored line
  - INSERT_BEFORE: insert new line(s) before anchor
  - INSERT_AFTER: insert new line(s) after anchor
  - DELETE: delete the anchored line

Example:
  17a7 REPLACE const x = 42;
  25b3 INSERT_AFTER
  if (debug) {
    console.log("here");
  }
  30 DELETE

Hashless example:
  17 REPLACE const x = 42;

${HASHLINE_PROMPT || ""}`,
      parameters: {
        type: "object",
        properties: {
          input: {
            type: "string",
            description: "Hashline edit DSL (one operation per line)",
          },
        },
        required: ["input"],
      },
      execute: async (toolCallId, params) => {
        // execute receives: (toolCallId: string, params: object)
        const input = typeof params?.input === "string" ? params.input : "";

        if (!input || !input.trim()) {
          return { content: [{ type: "text", text: "Hashline edit input is empty." }], details: {} };
        }

        const edit = parseHashlineEdit(input);
        if (!edit.path) {
          return { content: [{ type: "text", text: "No file path specified in edit DSL. Use the full anchored-hash path as shown in read results." }], details: {} };
        }

        // resolve workspace root
        const workspaceRoot = process.env.OPENCLAW_WORKSPACE_DIR ||
          path.resolve(process.env.HOME || "/tmp", ".openclaw", "workspace");

        // sandbox boundary
        const resolved = path.resolve(workspaceRoot, edit.path);
        if (!resolved.startsWith(path.resolve(workspaceRoot) + path.sep) && resolved !== path.resolve(workspaceRoot)) {
          return { content: [{ type: "text", text: "Path traversal denied." }], details: {} };
        }

        const result = executeHashlineEdit(edit.path, edit.ops, workspaceRoot);
        if (result.success) {
          return { content: [{ type: "text", text: result.summary }], details: {} };
        }
        return {
          content: [{ type: "text", text: `❌ ${result.error}\n\n${formatStaleLinesReport(result.staleLines)}` }],
          details: { staleLines: result.staleLines, error: result.error },
        };
      },
    });

    api.logger.info("Hashline plugin registered");
  },

  activate(api) {
    api.logger.info("Hashline plugin activated");
  },
};
