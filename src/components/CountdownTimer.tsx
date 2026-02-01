"use client";

import { FC, useState, useEffect } from "react";

interface CountdownTimerProps {
  className?: string;
}

export const CountdownTimer: FC<CountdownTimerProps> = ({ className = "" }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntilMidnight());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  return (
    <div className={className}>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wide mb-1">
        Next Wordle
      </p>
      <div className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-white">
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </div>
    </div>
  );
};

function getTimeUntilMidnight(): number {
  const now = new Date();
  const tomorrow = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + 1,
      0,
      0,
      0
    )
  );
  return tomorrow.getTime() - now.getTime();
}

export default CountdownTimer;
