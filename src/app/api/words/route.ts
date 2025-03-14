import { NextRequest, NextResponse } from "next/server";
import { wordList } from "@/constants/wordlist";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const difficultyParam = searchParams.get("difficulty") || "1";

  // Convert difficulty to number
  const difficulty = parseInt(difficultyParam, 10) || 1;

  // Filter words by difficulty
  const filteredWords = wordList.filter(
    (word) => word.difficulty === difficulty
  );

  // Return a random word from the filtered list
  const randomIndex = Math.floor(Math.random() * filteredWords.length);
  const randomWord = filteredWords[randomIndex];

  return NextResponse.json(
    { word: randomWord.word.toUpperCase() },
    {
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json",
      },
    }
  );
}
