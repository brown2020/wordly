import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const appDir = path.join(here, "../app");

describe("route security (client-only)", () => {
  it("ships no API route handlers or server actions", () => {
    const walk = (dir: string): string[] => {
      const out: string[] = [];
      for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) out.push(...walk(p));
        else out.push(p);
      }
      return out;
    };
    const files = walk(appDir).map((f) => path.relative(appDir, f));
    assert.equal(
      files.some((f) => /(^|\/)route\.(ts|js|tsx|jsx)$/.test(f)),
      false
    );
    const page = fs.readFileSync(path.join(appDir, "page.tsx"), "utf8");
    assert.equal(/["']use server["']/.test(page), false);
  });

  it("does not ship the broken scores intercept route", () => {
    const walk = (dir: string): string[] => {
      const out: string[] = [];
      for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, ent.name);
        if (ent.isDirectory()) out.push(...walk(p));
        else out.push(p);
      }
      return out;
    };
    const files = walk(appDir);
    assert.equal(
      files.some((file) => file.includes("(.." + ")scores")),
      false
    );
  });

  it("does not allow every remote image host", () => {
    const config = fs.readFileSync(
      path.join(here, "../../next.config.mjs"),
      "utf8"
    );
    assert.equal(config.includes('hostname: "**"'), false);
    assert.equal(config.includes("hostname: '**'"), false);
    assert.equal(/remotePatterns\s*:/.test(config), false);
  });
});
