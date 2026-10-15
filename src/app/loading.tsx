export default function Loading() {
  return (
    <div
      data-testid="loading"
      className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4"
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
        </div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-400 tracking-wide animate-pulse">
        Loading...
      </p>
    </div>
  );
}
