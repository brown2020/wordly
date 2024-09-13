"use client";

import { wordList } from "@/constants/wordlist";
import {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";

export default function WordlyMain() {
  const [wordToGuess, setWordToGuess] = useState<string>("");
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [attempts, setAttempts] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0); // State for score
  const [hintUsed, setHintUsed] = useState<boolean>(false); // State for hint usage
  const [animateShake, setAnimateShake] = useState<boolean>(false); // State for shake animation
  const [difficulty, setDifficulty] = useState<number>(1); // State for difficulty level

  // Using useCallback to memoize startNewGame function
  const startNewGame = useCallback(() => {
    const filteredWords = wordList.filter(
      (word) => word.difficulty === difficulty
    ); // Filter words by selected difficulty
    const randomWordObj =
      filteredWords[Math.floor(Math.random() * filteredWords.length)];
    setWordToGuess(randomWordObj.word);
    setCurrentGuess("");
    setAttempts([]);
    setGameOver(false);
    setHintUsed(false);
    setAnimateShake(false);
  }, [difficulty]);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleDifficultyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setDifficulty(Number(event.target.value));
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCurrentGuess(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentGuess.length !== 5) {
      console.log("Triggering shake animation");
      setAnimateShake(true); // Trigger shake animation
      setTimeout(() => setAnimateShake(false), 500); // Remove shake after 500ms
      return;
    }

    const newAttempts: string[] = [...attempts, currentGuess];
    setAttempts(newAttempts);
    setCurrentGuess("");

    if (currentGuess === wordToGuess) {
      setGameOver(true);
      const pointsEarned = (6 - newAttempts.length) * 10;
      setScore(score + pointsEarned); // Update score based on attempts
      alert(
        `Congratulations! You guessed the word! You earned ${pointsEarned} points.`
      );
    } else if (newAttempts.length === 6) {
      setGameOver(true);
      alert(`Game Over! The word was ${wordToGuess}.`);
    }
  };

  const getLetterFeedback = (letter: string, index: number) => {
    if (wordToGuess[index] === letter) {
      return "bg-green-500 text-white"; // Letter is in the correct position
    } else if (wordToGuess.includes(letter)) {
      return "bg-yellow-500 text-black"; // Letter is in the word but in the wrong position
    } else {
      return "bg-gray-300 text-black"; // Letter is not in the word
    }
  };

  const useHint = () => {
    if (attempts.length >= 3 && !hintUsed) {
      // Allow hint after 3 attempts
      const unrevealedLetters = wordToGuess
        .split("")
        .filter((letter) => !attempts.join("").includes(letter));
      if (unrevealedLetters.length > 0) {
        alert(`Hint: One of the letters is "${unrevealedLetters[0]}".`);
        setHintUsed(true); // Mark hint as used
      }
    } else {
      alert("Hints are available after 3 attempts and only one per game.");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Wordly</h1>
      <p className="mb-4">Score: {score}</p> {/* Display the score */}
      {/* Difficulty Selector */}
      <div className="mb-4">
        <label htmlFor="difficulty" className="mr-2">
          Select Difficulty:
        </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={handleDifficultyChange}
          className="border p-2"
        >
          <option value={1}>Easy</option>
          <option value={2}>Medium</option>
          <option value={3}>Hard</option>
        </select>
      </div>
      <div className="space-y-2 mb-4">
        {Array.from({ length: 6 }).map((_, rowIndex) => (
          <div className="flex space-x-2" key={rowIndex}>
            {Array.from({ length: 5 }).map((_, letterIndex) => {
              const attempt = attempts[rowIndex];
              const letter = attempt ? attempt[letterIndex] : "";
              const feedbackClasses = letter
                ? getLetterFeedback(letter, letterIndex)
                : "";

              return (
                <div
                  key={letterIndex}
                  className={`w-10 h-10 flex items-center justify-center border-2 text-lg font-bold ${feedbackClasses} ${
                    animateShake && !letter ? "animate-shake" : ""
                  }`}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {!gameOver && (
        <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
          <input
            type="text"
            value={currentGuess}
            onChange={handleInputChange}
            maxLength={5}
            disabled={gameOver}
            className="border p-2 w-32 text-center"
          />
          <button
            type="submit"
            disabled={currentGuess.length !== 5 || gameOver}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={useHint}
            disabled={hintUsed || gameOver}
            className="bg-yellow-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Hint
          </button>
        </form>
      )}
      {gameOver && (
        <button
          onClick={startNewGame}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Start Over
        </button>
      )}
    </div>
  );
}
