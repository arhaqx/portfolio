import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const app = resolve(root, "apps/vinty-pos");
const npmCli = process.env.npm_execpath;
const environment = { ...process.env, EXPO_NO_TELEMETRY: "1", EXPO_OFFLINE: "1", CI: "1" };
function run(command, args, env = environment) {
  const result = spawnSync(command, args, { cwd: app, env, stdio: "inherit" });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
if (!existsSync(resolve(app, "node_modules/expo/package.json"))) {
  if (!npmCli)
    throw new Error("Run with npm run build:pos so the npm CLI can install the Expo dependencies.");
  run(process.execPath, [npmCli, "ci", "--no-audit", "--no-fund"], process.env);
}
run(process.execPath, [
  resolve(app, "node_modules/expo/bin/cli"),
  "export",
  "--platform",
  "web",
  "--output-dir",
  resolve(root, "public/demos/vinty-pos"),
  "--max-workers",
  "2",
]);
