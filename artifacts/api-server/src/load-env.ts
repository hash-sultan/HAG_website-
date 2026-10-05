import fs from "node:fs";
import path from "node:path";

function applyEnvFile(filePath: string): void {
  const text = fs.readFileSync(filePath, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (value && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

let dir = process.cwd();
for (let i = 0; i < 8; i += 1) {
  const candidate = path.join(dir, ".env");
  if (fs.existsSync(candidate)) {
    applyEnvFile(candidate);
    break;
  }
  const parent = path.dirname(dir);
  if (parent === dir) break;
  dir = parent;
}
