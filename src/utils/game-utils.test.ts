import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  evaluateGuess,
  mergeKeyboardState,
  normalize,
  validateHardMode,
  getShareText,
} from "./game-utils";

describe("evaluateGuess", () => {
  it("marks all correct", () => {
    assert.deepEqual(evaluateGuess("CRANE", "CRANE"), [
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ]);
  });

  it("handles duplicate letters", () => {
    // answer APPLE, guess PAPER → P present, A present, P correct, E present, R absent
    assert.deepEqual(evaluateGuess("APPLE", "PAPER"), [
      "present",
      "present",
      "correct",
      "present",
      "absent",
    ]);
  });
});

describe("validateHardMode", () => {
  it("requires correct letters stay fixed", () => {
    const msg = validateHardMode(
      "BLAIN",
      ["CRANE"],
      [["absent", "correct", "absent", "absent", "absent"]]
    );
    assert.match(msg ?? "", /2nd letter must be R/i);
  });

  it("requires present letters appear", () => {
    const msg = validateHardMode(
      "XXXXX",
      ["CRANE"],
      [["present", "absent", "absent", "absent", "absent"]]
    );
    assert.match(msg ?? "", /must contain C/i);
  });

  it("allows valid hard-mode follow-up", () => {
    assert.equal(
      validateHardMode(
        "TRACE",
        ["CRANE"],
        [["present", "correct", "absent", "absent", "correct"]]
      ),
      null
    );
  });
});

describe("mergeKeyboardState", () => {
  it("prefers correct over present", () => {
    const once = mergeKeyboardState({}, "CRANE", [
      "present",
      "absent",
      "absent",
      "absent",
      "absent",
    ]);
    const twice = mergeKeyboardState(once, "CCCCC", [
      "correct",
      "absent",
      "absent",
      "absent",
      "absent",
    ]);
    assert.equal(twice.C, "correct");
  });
});

describe("normalize + share", () => {
  it("uppercases words", () => {
    assert.equal(normalize(" crane "), "CRANE");
  });

  it("builds share emoji grid", () => {
    const text = getShareText(
      {
        isWinner: true,
        guesses: ["CRANE"],
        evaluations: [
          ["correct", "correct", "correct", "correct", "correct"],
        ],
        mode: "daily",
        solutionId: "2026-09-22",
        puzzleNumber: 1921,
      },
      false,
      false
    );
    assert.match(text, /Wordly 1921 1\/6/);
    assert.match(text, /🟩🟩🟩🟩🟩/);
  });
});
