export default function Loading() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px] mx-auto flex flex-col min-h-[540px] p-6">
        <div className="h-4 w-20 rounded-full bg-white/70 animate-pulse" />
        <div className="mt-8 h-8 w-44 rounded-full bg-white/75 animate-pulse" />
        <div className="mt-10 grid grid-cols-2 gap-5">
          <div className="h-24 rounded-2xl bg-white/70 animate-pulse" />
          <div className="h-24 rounded-2xl bg-white/70 animate-pulse" />
          <div className="h-24 rounded-2xl bg-white/70 animate-pulse" />
          <div className="h-24 rounded-2xl bg-white/70 animate-pulse" />
        </div>
      </div>
    </main>
  );
}
