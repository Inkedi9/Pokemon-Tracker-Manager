import { Layers3 } from "lucide-react";

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative border-t border-white/5 bg-[#0a0a0d]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />

            <div className="mx-auto flex min-h-16 max-w-[1600px] flex-col items-center justify-between gap-3 px-4 py-4 text-xs sm:flex-row sm:px-6 lg:px-8">
                <div className="flex items-center gap-2 text-zinc-500">
                    <div className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.03]">
                        <Layers3 className="h-3.5 w-3.5 text-yellow-400" />
                    </div>

                    <span className="font-medium text-zinc-400">
                        Pokémon Tracker Manager
                    </span>

                    <span className="hidden text-zinc-700 sm:inline">
                        •
                    </span>

                    <span className="hidden text-zinc-600 sm:inline">
                        Personal Collection Manager
                    </span>
                </div>

                <div className="flex items-center gap-3 text-zinc-600">
                    <span>v1.0.0</span>

                    <span>•</span>

                    <span>© {year}</span>
                </div>
            </div>
        </footer>
    );
}