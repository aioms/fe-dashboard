import { readdir, readFile, rm, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

async function artifactFiles(folder: string): Promise<string[]> {
  const entries = await readdir(folder, { withFileTypes: true });
  const files = await Promise.all(entries.map((entry) => entry.isDirectory()
    ? artifactFiles(join(folder, entry.name))
    : Promise.resolve([join(folder, entry.name)])));
  return files.flat();
}

/** Upload private maps before removing maps and public sourceMappingURL comments.
 * A failed configured upload fails the build; maps are still removed in finally.
 */
async function finishBuild() {
  const build = resolve("build");
  const files = await artifactFiles(build);
  try {
    if (process.env.POSTHOG_API_KEY && process.env.POSTHOG_PROJECT_ID) {
      if (!process.env.REACT_APP_RELEASE) {
        throw new Error("REACT_APP_RELEASE is required for private source map upload");
      }
      const cli = require.resolve("@posthog/cli/run-posthog-cli.js");
      const result = spawnSync(process.execPath, [cli, "sourcemap", "process",
        "--directory", build, "--release-name", "aiom-dashboard",
        "--release-version", process.env.REACT_APP_RELEASE, "--delete-after"], {
        stdio: "inherit", env: { ...process.env,
          POSTHOG_CLI_API_KEY: process.env.POSTHOG_API_KEY,
          POSTHOG_CLI_PROJECT_ID: process.env.POSTHOG_PROJECT_ID,
          POSTHOG_CLI_HOST: process.env.POSTHOG_HOST || "https://us.posthog.com" },
      });
      if (result.error || result.status !== 0) throw new Error("Private source map upload failed");
    } else {
      console.info("Private source map upload skipped: CI credentials unavailable");
    }
  } finally {
    for (const file of files) {
      if (file.endsWith(".map")) await rm(file, { force: true });
      else if (/\.(js|css)$/.test(file)) {
        const original = await readFile(file, "utf8");
        const cleaned = original.replace(/\/\/#[ \t]*sourceMappingURL=[^\r\n]*/g, "")
          .replace(/\/\*#[ \t]*sourceMappingURL=[\s\S]*?\*\//g, "");
        if (cleaned !== original) await writeFile(file, cleaned);
      }
    }
  }
}
finishBuild().catch(() => {
  console.error("Source map finalization failed; build must not be deployed");
  process.exitCode = 1;
});
