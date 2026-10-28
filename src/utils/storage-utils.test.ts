import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  hasRecordedCompletion,
  sanitizeScoreRecords,
} from "./storage-utils";

describe("score records", () => {
  it("drops malformed score rows", () => {
    const today = new Date().toISOString();
    const records = sanitizeScoreRecords([
      "nope",
      { date: "not-a-date", attempts: 1, word: "APPLE" },
      { date: today, attempts: Number.NaN, word: "APPLE" },
      { date: today, attempts: 2, word: "CRANE", isWin: true },
    ]);

    assert.equal(records.length, 1);
    assert.equal(records[0]?.word, "CRANE");
  });

  it("treats one daily or archive puzzle as a single completion", () => {
    const today = new Date().toISOString();
    const existing = [
      {
        date: today,
        attempts: 4,
        word: "CRANE",
        mode: "daily" as const,
        puzzleNumber: 12,
        isWin: true,
      },
    ];

    assert.equal(
      hasRecordedCompletion(
        {
          date: today,
          attempts: 2,
          word: "CRANE",
          mode: "daily",
          puzzleNumber: 12,
          isWin: true,
        },
        existing
      ),
      true
    );
    assert.equal(
      hasRecordedCompletion(
        {
          date: today,
          attempts: 2,
          word: "BRAVE",
          mode: "random",
          puzzleNumber: null,
          isWin: true,
        },
        existing
      ),
      false
    );
  });
});
