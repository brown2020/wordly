import { useEffect, useState } from "react";
import { useGameStore } from "@/stores/game-store";

export function useGameController() {
    const {
        score,
        guesses,
        isGameOver,
        isWinner,
        answer,
        handleKey,
        startNewGame,
    } = useGameStore();
    const [showModal, setShowModal] = useState(false);

    // Handle keyboard input
    useEffect(() => {
        // Ensure a game is initialized (random by default)
        if (!answer) {
            startNewGame("random");
        }
        const handleKeyDown = (event: KeyboardEvent) => {
            handleKey(event.key);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [handleKey, answer, startNewGame]);

    // Handle game over state
    useEffect(() => {
        if (isGameOver) {
            setShowModal(true);
            const won = isWinner;
            const numGuesses = guesses.length;
            // Update stats API (edge runtime in-memory)
            fetch("/api/stats", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ won, guesses: won ? numGuesses : 0 }),
            }).catch(() => { });
            // Persist lightweight score history
            try {
                const existing = JSON.parse(
                    localStorage.getItem("wordly-scores") || "[]"
                );
                existing.push({
                    score,
                    attempts: numGuesses,
                    word: answer,
                    date: new Date().toISOString(),
                });
                localStorage.setItem("wordly-scores", JSON.stringify(existing));
            } catch { }
        }
    }, [isGameOver, isWinner, guesses.length, score, answer]);

    const handlePlayAgain = () => {
        setShowModal(false);
        startNewGame();
    };

    return {
        showModal,
        setShowModal,
        handlePlayAgain,
        guesses,
        isWinner,
        answer,
    };
}
