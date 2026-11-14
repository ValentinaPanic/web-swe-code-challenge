// Appends each user prompt and each final assistant reply to .claude/ai-log.jsonl.
// Wired to the UserPromptSubmit and Stop hooks in .claude/settings.json.
// This is the raw log; SPEC.md's "AI usage" section is a hand-picked summary of it.
// Never blocks Claude: every failure is swallowed, the exit code is always 0, and nothing
// is written to stdout (UserPromptSubmit stdout would be injected into the conversation).

import { appendFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";

const MAX_REPLY_CHARS = 4000;

function readStdin() {
  try {
    return JSON.parse(readFileSync(0, "utf8"));
  } catch {
    return null;
  }
}

// The Stop payload has no reply text, so take the last assistant text from the transcript.
function lastAssistantText(transcriptPath) {
  const lines = readFileSync(transcriptPath, "utf8").trim().split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    let entry;
    try {
      entry = JSON.parse(lines[i]);
    } catch {
      continue;
    }
    if (entry.type !== "assistant") continue;
    const content = entry.message?.content;
    const text = Array.isArray(content)
      ? content.filter((c) => c.type === "text").map((c) => c.text).join("\n")
      : typeof content === "string" ? content : "";
    if (text.trim()) return text;
  }
  return "";
}

try {
  const input = readStdin();
  if (input) {
    const projectDir = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd();
    const logFile = join(projectDir, ".claude", "ai-log.jsonl");
    const entry = {
      ts: new Date().toISOString(),
      session: input.session_id,
      event: input.hook_event_name,
    };

    if (input.hook_event_name === "UserPromptSubmit") {
      entry.prompt = input.prompt;
    } else if (input.hook_event_name === "Stop" && input.transcript_path) {
      const reply = lastAssistantText(input.transcript_path);
      entry.reply =
        reply.length > MAX_REPLY_CHARS ? `${reply.slice(0, MAX_REPLY_CHARS)}… [truncated]` : reply;
    }

    mkdirSync(dirname(logFile), { recursive: true });
    appendFileSync(logFile, `${JSON.stringify(entry)}\n`);
  }
} catch {
  // Logging must never interrupt the session.
}

process.exit(0);
