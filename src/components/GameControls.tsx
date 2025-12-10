import Link from "next/link";
import { BUTTON } from "@/constants/constants";
import { ChartIcon } from "./ui/icons";

interface GameControlsProps {
  onShowStats: () => void;
}

export function GameControls({ onShowStats }: GameControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
      <Link href="/scores" className={`${BUTTON.secondary} flex-1 text-center`}>
        <ChartIcon className="w-4 h-4 mr-2" />
        Score History
      </Link>

      <button onClick={onShowStats} className={`${BUTTON.accent} flex-1`}>
        <ChartIcon className="w-4 h-4 mr-2" />
        Statistics
      </button>
    </div>
  );
}
