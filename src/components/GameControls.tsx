import Link from "next/link";
import { BUTTON } from "@/constants/constants";
import { ChartIcon } from "./ui/icons";

interface GameControlsProps {
  onShowStats: () => void;
}

export function GameControls({ onShowStats }: GameControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
      <Link
        href="/scores"
        className={`${BUTTON.secondary} flex-1 inline-flex items-center justify-center gap-2`}
      >
        <ChartIcon className="h-4 w-4" />
        Score History
      </Link>

      <button
        onClick={onShowStats}
        className={`${BUTTON.accent} flex-1 inline-flex items-center justify-center gap-2`}
      >
        <ChartIcon className="h-4 w-4" />
        Statistics
      </button>
    </div>
  );
}
