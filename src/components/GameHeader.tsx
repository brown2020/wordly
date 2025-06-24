interface GameHeaderProps {
  score: number;
}

export const GameHeader = ({ score }: GameHeaderProps) => {
  return (
    <header className="flex justify-between items-center p-6">
      <Logo />
      <ScoreDisplay score={score} />
    </header>
  );
};

const Logo = () => (
  <div className="flex items-center space-x-2">
    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-purple rounded-lg flex items-center justify-center">
      <span className="text-white font-bold text-lg">W</span>
    </div>
    <h1 className="text-3xl font-bold gradient-text">
      Wordly
    </h1>
  </div>
);

const ScoreDisplay = ({ score }: { score: number }) => (
  <div className="flex items-center space-x-2 bg-gradient-to-r from-primary-50 to-accent-purple/10 px-4 py-2 rounded-full border border-primary-200/50">
    <svg className="w-4 h-4 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
    <div className="text-sm">
      <span className="text-neutral-600 font-medium">Score:</span>
      <span className="ml-1 font-bold text-primary-700">{score}</span>
    </div>
  </div>
);
