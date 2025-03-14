import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

// In a real app, this would be stored in a database
const gameStats = {
  totalGames: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  guessDistribution: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  },
};

export async function GET() {
  return NextResponse.json(gameStats);
}

export async function POST(request: NextRequest) {
  try {
    const { won, guesses } = await request.json();

    // Update stats
    gameStats.totalGames += 1;

    if (won) {
      gameStats.wins += 1;
      gameStats.currentStreak += 1;

      if (gameStats.currentStreak > gameStats.maxStreak) {
        gameStats.maxStreak = gameStats.currentStreak;
      }

      // Update guess distribution
      if (guesses >= 1 && guesses <= 6) {
        gameStats.guessDistribution[
          guesses as keyof typeof gameStats.guessDistribution
        ] += 1;
      }
    } else {
      gameStats.currentStreak = 0;
    }

    return NextResponse.json(
      { success: true, stats: gameStats },
      { status: 200 }
    );
  } catch (error) {
    // Log the actual error
    console.error("Error processing stats request:", error);
    return NextResponse.json(
      { success: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
