export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse flex flex-col items-center">
        <div className="text-3xl font-bold mb-4">Wordly</div>
        <div className="grid grid-cols-5 gap-1.5">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="flex h-14 w-14 items-center justify-center rounded border-2 border-neutral-300"
              />
            ))}
        </div>
      </div>
    </div>
  );
}
