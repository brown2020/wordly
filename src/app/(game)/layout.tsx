export default function GameLayout({
  children,
  scores,
}: {
  children: React.ReactNode;
  scores: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex flex-col">{children}</main>
      {scores}
      <footer className="bg-white py-4 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Wordly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
