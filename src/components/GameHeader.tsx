interface GameHeaderProps {
  score: number;
}

export const GameHeader = ({ score }: GameHeaderProps) => {
  return (
    <header className="flex justify-between items-center p-5 border-b">
      <Logo />
      <ScoreDisplay score={score} />
    </header>
  );
};

const Logo = () => <h1 className="text-2xl font-bold">Wordly</h1>;

const ScoreDisplay = ({ score }: { score: number }) => (
  <div className="text-sm">
    Score: <span className="font-bold">{score}</span>
  </div>
);
