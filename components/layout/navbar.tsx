import { Search, Settings, Sparkles } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-16 border-b border-white/10 bg-[#09090b]/90 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
            <Sparkles className="h-5 w-5 text-yellow-400" />
          </div>

          <div>
            <h1 className="text-sm font-bold tracking-wide text-white">
              POKÉMON TRACKER
            </h1>

            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              Collection Manager
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white">
            <Search className="h-5 w-5" />
          </button>

          <button className="rounded-lg p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}