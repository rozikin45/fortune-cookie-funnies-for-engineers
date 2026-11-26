import {
  writeFileSync,
  renameSync,
  readFileSync,
  mkdirSync,
} from "node:fs";
import { dirname, join } from "node:path";

const FORTUNE =
  "A bug you fixed six months ago will return tonight, wearing a new error message and holding a grudge.";

// Competition gate: the entry must be a single line of 1-120 characters.
const MAX_CHARS = 120;

const OUTPUT_PATH = "/output/entry.txt";

function verify(content: string): void {
  if (content.length < 1 || content.length > MAX_CHARS) {
    throw new Error(
      `verification failed [length check]: expected 1-${MAX_CHARS} characters, got ${content.length}`,
    );
  }
  if (content !== FORTUNE) {
    throw new Error(
      "verification failed [content check]: written line does not match the fortune",
    );
  }
  if (content.includes("\n") || content.includes("\r")) {
    throw new Error(
      "verification failed [single-line check]: line must not contain a newline",
    );
  }
  for (const ch of content) {
    if (ch < " ") {
      throw new Error(
        `verification failed [control-character check]: line contains a control character (U+${ch
          .charCodeAt(0)
          .toString(16)
          .toUpperCase()
          .padStart(4, "0")})`,
      );
    }
  }
  if (content.trim().length === 0) {
    throw new Error(
      "verification failed [non-empty check]: line must not be whitespace-only",
    );
  }
}

mkdirSync(dirname(OUTPUT_PATH), { recursive: true });

const tmpPath = join(dirname(OUTPUT_PATH), `.entry.txt.tmp-${process.pid}`);
writeFileSync(tmpPath, FORTUNE, "utf8");
renameSync(tmpPath, OUTPUT_PATH);

const written = readFileSync(OUTPUT_PATH, "utf8");
verify(written);

console.log(`Wrote ${written.length} characters to ${OUTPUT_PATH}`);
