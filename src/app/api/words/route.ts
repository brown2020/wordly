import { NextResponse } from "next/server";
import { wordList } from "@/constants/wordlist";

export const runtime = "edge";

export async function GET() {
  // Return a random word from the list (no difficulty filtering)
  const randomIndex = Math.floor(Math.random() * wordList.length);
  const randomWord = wordList[randomIndex];

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
