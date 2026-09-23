"use client";

import {
    Check,
    MapPin,
    Package,
    Star,
} from "lucide-react";

import Image from "next/image";

import { Card } from "@/components/ui/card";

import type { PokemonCard } from "@/types/card";

import { EditCardDialog } from "@/components/collection/edit-card-dialog";
import { DeleteCardDialog } from "@/components/collection/delete-card-dialog";

import { getMarketPrice } from "@/lib/pricing";

type CardItemProps = {
    card: PokemonCard;
    isSelected: boolean;
    onSelect: () => void;
};

export function CardItem({ card, isSelected, onSelect, }: CardItemProps) {

    const marketPrice = getMarketPrice(card);

    const marketDifference =
        marketPrice === null
            ? null
            : marketPrice - card.purchasePrice;

    return (
        <Card
            className={`
    overflow-hidden
    rounded-xl
    border
    bg-[#111114]
    transition-all
    duration-200
    ${isSelected
                    ? "border-violet-400/40 shadow-lg shadow-violet-950/10"
                    : "border-white/10"
                }
    hover:-translate-y-0.5
    hover:border-white/15
    hover:bg-[#141418]
    hover:shadow-lg
    hover:shadow-black/20
`}
        >
            {/* Image */}
            <div className="relative aspect-[3/4] items-center justify-center bg-[#18181b]">
                <button
                    type="button"
                    onClick={onSelect}
                    aria-label={
                        isSelected
                            ? `Désélectionner ${card.name}`
                            : `Sélectionner ${card.name}`
                    }
                    className={`absolute left-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-lg border backdrop-blur-sm transition-all ${isSelected
                        ? "border-violet-400/40 bg-violet-400/20 text-violet-300 shadow-lg shadow-violet-950/20"
                        : "border-white/10 bg-black/40 text-white/40 hover:border-white/20 hover:bg-black/60 hover:text-white"
                        }`}
                >
                    {isSelected && <Check className="h-4 w-4" />}
                </button>
                {card.image ? (
                    <Image
                        src={card.image}
                        alt={card.name}
                        fill
                        unoptimized
                        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                    />
                ) : (
                    <div className="text-center">
                        <p className="text-xs uppercase tracking-[0.2em] text-zinc-700">
                            Pokémon Card
                        </p>

                        <p className="mt-2 text-4xl font-bold text-zinc-800">
                            ?
                        </p>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="truncate font-semibold text-white">
                            {card.name}
                        </h3>

                        <p className="mt-1 truncate text-xs text-zinc-500">
                            {card.set} · {card.number}
                        </p>
                    </div>

                    <span className="shrink-0 rounded-md bg-yellow-400/10 px-2 py-1 text-xs font-medium text-yellow-400">
                        {card.language}
                    </span>
                </div>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs text-zinc-400">
                        <Star className="h-3 w-3" />
                        {card.rarity}
                    </span>

                    <span className="rounded-md bg-white/5 px-2 py-1 text-xs text-zinc-400">
                        {card.condition}
                    </span>

                    <span className="flex items-center gap-1.5 rounded-md bg-white/5 px-2 py-1 text-xs text-zinc-400">
                        <Package className="h-3 w-3" />
                        x{card.quantity}
                    </span>
                </div>

                {/* Financial */}
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/5 pt-4">
                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                            Achat
                        </p>

                        <p className="mt-1 text-sm font-medium text-zinc-300">
                            {card.purchasePrice.toFixed(2)} €
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                            Estimation
                        </p>

                        <p className="mt-1 text-sm font-medium text-emerald-400">
                            {card.estimatedValue.toFixed(2)} €
                        </p>
                    </div>
                </div>

                {/* Market */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                            Achat
                        </p>

                        <p className="mt-1 font-mono text-sm font-medium text-zinc-300">
                            {card.purchasePrice.toFixed(2)} €
                        </p>
                    </div>

                    <div>
                        <p className="text-[10px] uppercase tracking-[0.16em] text-zinc-600">
                            Marché
                        </p>

                        <p className="mt-1 font-mono text-sm font-semibold text-white">
                            {marketPrice !== null
                                ? `${marketPrice.toFixed(2)} €`
                                : "—"}
                        </p>
                    </div>
                </div>
                {marketDifference !== null && (
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
                            P/L
                        </span>

                        <span
                            className={`text-[10px] font-medium ${marketDifference >= 0
                                ? "text-emerald-400"
                                : "text-red-400"
                                }`}
                        >
                            {marketDifference >= 0 ? "+" : ""}
                            {marketDifference.toFixed(2)} €
                        </span>
                    </div>
                )}

                {/* Location */}
                {card.location && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />

                        <span className="truncate">
                            {card.location}
                        </span>
                    </div>
                )}

                {/* Actions */}
                <div className="mt-4 flex gap-2 border-t border-white/5 pt-4">
                    <EditCardDialog card={card} />

                    <DeleteCardDialog card={card} />
                </div>
            </div>
        </Card>
    );
}
