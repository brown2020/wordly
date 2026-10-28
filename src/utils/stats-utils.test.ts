import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { calculateStats } from "./stats-utils";

describe("calculateStats", () => {
  it("breaks the current streak when today is a loss", () => {
    const today = new Date().toISOString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const stats = calculateStats([
      { date: yesterday, attempts: 2, word: "CRANE", isWin: true },
      { date: today, attempts: 6, word: "BRAVE", isWin: false },
    ]);

    assert.equal(stats.currentStreak, 0);
    assert.equal(stats.wins, 1);
    assert.equal(stats.maxStreak, 1);
  });

  it("counts a win today after a win yesterday", () => {
    const today = new Date().toISOString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const stats = calculateStats([
      { date: yesterday, attempts: 2, word: "CRANE", isWin: true },
      { date: today, attempts: 3, word: "BRAVE", isWin: true },
    ]);

    assert.equal(stats.currentStreak, 2);
  });

  it("skips records with an invalid date", () => {
    const today = new Date().toISOString();
    const stats = calculateStats([
      { date: "not-a-date", attempts: 1, word: "APPLE", isWin: true },
      { date: today, attempts: 1, word: "CRANE", isWin: true },
    ]);

    assert.equal(stats.totalGames, 1);
    assert.equal(stats.wins, 1);
    assert.equal(stats.currentStreak, 1);
  });
});
