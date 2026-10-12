// Records this Claude Code session's model where the CoDesign MCP server reads it; prints nothing, never fails.
import {
  mkdirSync,
  readdirSync,
  renameSync,
  statSync,
  unlinkSync,
  writeFileSync
} from 'node:fs';
import { isAbsolute, join } from 'node:path';

const SESSION_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MODEL = /^[A-Za-z0-9][\w.:+/-]{0,63}$/;
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  if (input.length < 65536) input += chunk;
});
process.stdin.on('end', () => {
  try {
    record(JSON.parse(input));
  } catch {
    // a hook that fails must not disturb the session
  }
});

function record(event) {
  const root = process.env.CLAUDE_PLUGIN_DATA;
  const sessionId = event?.session_id;
  const model = event?.to_model ?? event?.model;
  if (!root || !isAbsolute(root)) return;
  if (typeof sessionId !== 'string' || !SESSION_ID.test(sessionId)) return;
  if (
    typeof model !== 'string' ||
    !MODEL.test(model) ||
    model.includes('//') ||
    model.includes('..')
  )
    return;
  const dir = join(root, 'model');
  mkdirSync(dir, { recursive: true });
  const tmp = join(dir, `${sessionId}.${process.pid}.tmp`);
  writeFileSync(tmp, JSON.stringify({ model }));
  renameSync(tmp, join(dir, `${sessionId}.json`));
  const now = Date.now();
  for (const name of readdirSync(dir)) {
    try {
      const file = join(dir, name);
      if (now - statSync(file).mtimeMs > MAX_AGE_MS) unlinkSync(file);
    } catch {
      // another session may have removed it
    }
  }
}
