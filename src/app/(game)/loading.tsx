export default function GameLoading() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
      <div className="animate-pulse flex flex-col items-center">
        <div className="text-3xl font-bold mb-6 text-gray-800">Wordly</div>
        <div className="grid grid-cols-5 gap-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 border-2 border-gray-300 flex items-center justify-center rounded"
              />
            ))}
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 border-2 border-gray-300 flex items-center justify-center rounded"
              />
            ))}
        </div>
        <div className="mt-4 grid grid-cols-5 gap-2">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="w-16 h-16 border-2 border-gray-300 flex items-center justify-center rounded"
              />
            ))}
        </div>
        <div className="mt-8 h-10 w-40 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}
