// src/agents/hashline-prompt.ts
var HASHLINE_PROMPT = `
## Hashline edit tool

Read results may be persisted with line hashes:

#FILE:src/app.ts
42ab|const greeting = "hello";

Use hashline_edit with the same #FILE header and hashed line anchors.

### Syntax
#FILE:file/path
≔42ab REPLACE replacement line
≔42ab
replacement line or block
≔42ab..45cd
replacement block
»42ab
inserted after line 42
«42ab
inserted before line 42
≔42ab DELETE

Hashes are required by default. If you only have line numbers, set unsafe_line_only=true explicitly and understand that stale-line protection is bypassed.

Payload text is verbatim and preserves indentation.
`;
export {
  HASHLINE_PROMPT
};
