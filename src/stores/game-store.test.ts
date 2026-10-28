import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { useGameStore } from "./game-store";

describe("game store transitions", () => {
  it("replays the current archive puzzle when play again omits the id", () => {
    useGameStore.getState().startNewGame("archive", 10);
    const first = useGameStore.getState();
    useGameStore.getState().startNewGame();
    const next = useGameStore.getState();

    assert.equal(next.mode, "archive");
    assert.equal(next.puzzleNumber, 10);
    assert.equal(next.answer, first.answer);
    assert.equal(next.solutionId, first.solutionId);
    assert.deepEqual(next.guesses, []);
  });

  it("leaves archive mode when that game has no puzzle number", () => {
    useGameStore.setState({
      mode: "archive",
      puzzleNumber: null,
      answer: "CRANE",
      gameEpoch: 3,
    });
    useGameStore.getState().startNewGame();
    assert.equal(useGameStore.getState().mode, "random");
    assert.equal(useGameStore.getState().puzzleNumber, null);
  });

  it("types letters and submits the answer", async () => {
    useGameStore.getState().startNewGame("daily");
    const answer = useGameStore.getState().answer;
    const { handleKey, submitGuess } = useGameStore.getState();

    for (const letter of answer) {
      handleKey(letter, false);
    }
    assert.equal(useGameStore.getState().currentGuess, answer);

    await submitGuess(false);
    const finished = useGameStore.getState();
    assert.equal(finished.isWinner, true);
    assert.equal(finished.isGameOver, true);
    assert.deepEqual(finished.guesses, [answer]);
    assert.deepEqual(finished.evaluations[0], [
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ]);
    assert.equal(finished.resultRecorded, false);
  });

  it("rejects a short guess before calling the dictionary", async () => {
    useGameStore.getState().startNewGame("daily");
    useGameStore.setState({ currentGuess: "cat" });
    await useGameStore.getState().submitGuess(false);
    assert.equal(useGameStore.getState().invalidReason, "too_short");
    assert.deepEqual(useGameStore.getState().guesses, []);
  });

  it("drops a guess that finishes after a new game has started", async () => {
    useGameStore.getState().startNewGame("daily");
    useGameStore.setState({ currentGuess: "crane" });
    const pending = useGameStore.getState().submitGuess(false);
    useGameStore.getState().startNewGame("random");
    const randomId = useGameStore.getState().solutionId;

    await pending;

    assert.equal(useGameStore.getState().solutionId, randomId);
    assert.deepEqual(useGameStore.getState().guesses, []);
    assert.equal(useGameStore.getState().isValidating, false);
  });
});
