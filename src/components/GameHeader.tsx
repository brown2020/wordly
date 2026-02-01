import { FC } from "react";
import { HelpIcon, StatsIcon, SettingsIcon } from "./ui/icons";

interface GameHeaderProps {
  onShowHelp: () => void;
  onShowStats: () => void;
  onShowSettings: () => void;
}

export const GameHeader: FC<GameHeaderProps> = ({
  onShowHelp,
  onShowStats,
  onShowSettings,
}) => {
  return (
    <header className="grid h-14 grid-cols-3 items-center">
      <div className="flex items-center justify-start">
        <IconButton onClick={onShowHelp} label="How to play">
          <HelpIcon className="w-6 h-6" />
        </IconButton>
      </div>

      <div className="flex items-center justify-center">
        <Logo />
      </div>

      <div className="flex items-center justify-end gap-1">
        <IconButton onClick={onShowStats} label="Statistics">
          <StatsIcon className="w-6 h-6" />
        </IconButton>
        <IconButton onClick={onShowSettings} label="Settings">
          <SettingsIcon className="w-6 h-6" />
        </IconButton>
      </div>
    </header>
  );
};

const Logo = () => (
  <h1 className="select-none text-[clamp(1.25rem,3vw,2rem)] font-bold tracking-[0.1em] text-neutral-900 dark:text-white">
    Wordle
  </h1>
);

interface IconButtonProps {
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}

const IconButton: FC<IconButtonProps> = ({ onClick, label, children }) => (
  <button
    onClick={onClick}
    className="p-1.5 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
    aria-label={label}
    title={label}
  >
    {children}
  </button>
);
