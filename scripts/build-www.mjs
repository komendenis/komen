// Copies the static site into www/, the folder Capacitor bundles into the native apps.
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "www");
const files = ["index.html", "privacy.html", "manifest.webmanifest", "sw.js", "assets"];

rmSync(out, { recursive: true, force: true });
mkdirSync(out);
for (const f of files) cpSync(join(root, f), join(out, f), { recursive: true });
console.log("Built www/ from", files.join(", "));
