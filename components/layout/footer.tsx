import { Layers3 } from "lucide-react";

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative border-t border-white/5 bg-[#0a0a0d]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent" />

            <div className="mx-auto flex min-h-32 max-w-[1600px] flex-col items-center justify-between gap-6 px-4 py-6 text-sm sm:flex-row sm:items-start sm:px-6 lg:px-8">

                {/* --- GAUCHE : Identité & Description --- */}
                <div className="flex flex-col items-center gap-2 sm:items-start">
                    {/* Logo + Titre */}
                    <div className="flex items-center gap-2 text-zinc-500">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md border border-white/10 bg-white/[0.03]">
                            <Layers3 className="h-3.5 w-3.5 text-yellow-400" />
                        </div>
                        <span className="font-medium text-zinc-400">Pokémon Tracker Manager</span>
                    </div>

                    {/* Sous-titre & Description */}
                    <div className="flex flex-col items-center gap-1 sm:items-start">
                        <span className="text-xs text-zinc-600">Personal Collection Manager</span>
                        <span className="text-xs text-zinc-700">
                            Votre plateforme pour gérer votre collection de cartes Pokémon.
                        </span>
                    </div>
                </div>

                {/* --- DROITE : Navigation & Version --- */}
                <div className="flex flex-col items-center gap-4 sm:items-end">

                    {/* Menu de navigation */}
                    <nav className="flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-zinc-400">
                        <a href="./" className="transition-colors hover:text-yellow-400">Dashboard</a>
                        <a href="/collection" className="transition-colors hover:text-yellow-400">Ma Collection</a>
                        <a href="/analytics" className="transition-colors hover:text-yellow-400">Analytique</a>
                        <a href="/settings" className="transition-colors hover:text-yellow-400">Paramètres</a>
                    </nav>

                    {/* Version & Copyright (tout en bas à droite) */}
                    <div className="mt-8 flex flex-col gap-2 border-t border-white/5 pt-5 text-xs text-neutral-600 sm:flex-row sm:items-center sm:justify-between">
                        <span>v1.0.0</span>
                        <span className="text-zinc-700">•</span>
                        <span>© {year}</span>
                    </div>

                </div>

            </div>
        </footer>
    );
}