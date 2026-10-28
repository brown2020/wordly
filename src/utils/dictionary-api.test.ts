import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import {
  clearValidatedWordCache,
  validateWordWithAPI,
} from "./dictionary-api";

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
  clearValidatedWordCache();
});

describe("validateWordWithAPI", () => {
  it("accepts a bundled word without calling the network", async () => {
    let called = false;
    globalThis.fetch = async () => {
      called = true;
      return new Response("", { status: 404 });
    };

    assert.equal(await validateWordWithAPI("crane"), true);
    assert.equal(called, false);
  });

  it("caches only a definitive 404 for an unknown word", async () => {
    let status = 404;
    globalThis.fetch = async () => new Response("", { status });

    assert.equal(await validateWordWithAPI("qqqqq"), false);
    status = 200;
    assert.equal(await validateWordWithAPI("qqqqq"), false);
  });

  it("does not cache a server error as an invalid word", async () => {
    let status = 503;
    globalThis.fetch = async () => new Response("", { status });

    assert.equal(await validateWordWithAPI("qqqqw"), false);
    status = 200;
    assert.equal(await validateWordWithAPI("qqqqw"), true);
  });

  it("does not cache a network failure", async () => {
    let fail = true;
    globalThis.fetch = async () => {
      if (fail) throw new Error("offline");
      return new Response("", { status: 200 });
    };

    assert.equal(await validateWordWithAPI("zzzzj"), false);
    fail = false;
    assert.equal(await validateWordWithAPI("zzzzj"), true);
  });

  it("rejects words that are not five letters", async () => {
    globalThis.fetch = async () => new Response("", { status: 200 });
    assert.equal(await validateWordWithAPI("ab"), false);
    assert.equal(await validateWordWithAPI("../etc"), false);
  });
});
