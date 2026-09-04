"use client";

import {
  Clock3,
  Crown,
  Globe2,
  Layers3,
  Sparkles,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { PokemonCard } from "@/types/card";

type CollectionHighlightsProps = {
  cards: PokemonCard[];
};

export function CollectionHighlights({
  cards,
}: CollectionHighlightsProps) {
  /* --------------------------------
   * Most valuable card
   * -------------------------------- */
  const mostValuableCard = [...cards]
    .sort(
      (a, b) =>
        b.estimatedValue * b.quantity -
        a.estimatedValue * a.quantity
    )
    .slice(0, 1)[0];

  /* --------------------------------
   * Recent cards
   * -------------------------------- */
  const recentCards = [...cards].slice(-3).reverse();

  /* --------------------------------
   * Collection insights
   * -------------------------------- */
  const languageCounts = cards.reduce<Record<string, number>>(
    (result, card) => {
      result[card.language] =
        (result[card.language] ?? 0) + card.quantity;

      return result;
    },
    {}
  );

  const rarityCounts = cards.reduce<Record<string, number>>(
    (result, card) => {
      result[card.rarity] =
        (result[card.rarity] ?? 0) + card.quantity;

      return result;
    },
    {}
  );

  const setCounts = cards.reduce<Record<string, number>>(
    (result, card) => {
      result[card.set] =
        (result[card.set] ?? 0) + card.quantity;

      return result;
    },
    {}
  );

  const dominantLanguage =
    Object.entries(languageCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? "—";

  const dominantRarity =
    Object.entries(rarityCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? "—";

  const dominantSet =
    Object.entries(setCounts).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? "—";

  const uniqueCards = cards.length;

  return (
    <div className="mt-4 grid gap-4 xl:grid-cols-3">
      {/* --------------------------------
       * Most valuable card
       * -------------------------------- */}
      <Card className="rounded-xl border-white/10 bg-[#111114]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
            <Crown className="h-4 w-4 text-yellow-400" />
            Carte la plus valorisée
          </CardTitle>

          <p className="text-xs text-zinc-600">
            Carte avec la valeur estimée la plus élevée
          </p>
        </CardHeader>

        <CardContent>
          {!mostValuableCard ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-zinc-600">
                Aucune carte dans la collection.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.03]">
                {mostValuableCard.image ? (
                  <img
                    src={mostValuableCard.image}
                    alt={mostValuableCard.name}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <Crown className="h-6 w-6 text-yellow-400/60" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">
                  {mostValuableCard.name}
                </p>

                <p className="mt-1 truncate text-xs text-zinc-500">
                  {mostValuableCard.set} · #
                  {mostValuableCard.number}
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-500">
                    {mostValuableCard.language}
                  </span>

                  <span className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[10px] text-zinc-500">
                    {mostValuableCard.rarity}
                  </span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-lg font-bold text-white">
                  {mostValuableCard.estimatedValue.toFixed(2)} €
                </p>

                <p className="text-[10px] text-zinc-600">
                  valeur estimée
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* --------------------------------
       * Recent cards
       * -------------------------------- */}
      <Card className="rounded-xl border-white/10 bg-[#111114]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
            <Clock3 className="h-4 w-4 text-blue-400" />
            Ajouts récents
          </CardTitle>

          <p className="text-xs text-zinc-600">
            Les dernières cartes ajoutées
          </p>
        </CardHeader>

        <CardContent>
          {recentCards.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-zinc-600">
                Aucune carte dans la collection.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] p-2.5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white/[0.03]">
                    {card.image ? (
                      <img
                        src={card.image}
                        alt={card.name}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <Clock3 className="h-4 w-4 text-zinc-700" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-zinc-300">
                      {card.name}
                    </p>

                    <p className="truncate text-[10px] text-zinc-600">
                      {card.set} · {card.language}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-medium text-white">
                      {card.estimatedValue.toFixed(2)} €
                    </p>

                    <p className="text-[10px] text-zinc-600">
                      x{card.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* --------------------------------
       * Collection insights
       * -------------------------------- */}
      <Card className="rounded-xl border-white/10 bg-[#111114]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm text-zinc-300">
            <Sparkles className="h-4 w-4 text-violet-400" />
            Collection Insights
          </CardTitle>

          <p className="text-xs text-zinc-600">
            Quelques informations sur ta collection
          </p>
        </CardHeader>

        <CardContent>
          {cards.length === 0 ? (
            <div className="flex h-32 items-center justify-center">
              <p className="text-sm text-zinc-600">
                Aucune donnée disponible.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Language */}
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-400/10">
                    <Globe2 className="h-4 w-4 text-blue-400" />
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Langue dominante
                    </p>

                    <p className="text-sm font-medium text-white">
                      {dominantLanguage}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-zinc-600">
                  {languageCounts[dominantLanguage] ?? 0} cartes
                </span>
              </div>

              {/* Rarity */}
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-violet-400/10">
                    <Sparkles className="h-4 w-4 text-violet-400" />
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Rareté dominante
                    </p>

                    <p className="text-sm font-medium text-white">
                      {dominantRarity}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-zinc-600">
                  {rarityCounts[dominantRarity] ?? 0} cartes
                </span>
              </div>

              {/* Set */}
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-yellow-400/10">
                    <Layers3 className="h-4 w-4 text-yellow-400" />
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Extension dominante
                    </p>

                    <p className="max-w-[150px] truncate text-sm font-medium text-white">
                      {dominantSet}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-zinc-600">
                  {setCounts[dominantSet] ?? 0} cartes
                </span>
              </div>

              {/* Unique cards */}
              <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-400/10">
                    <Layers3 className="h-4 w-4 text-emerald-400" />
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Cartes uniques
                    </p>

                    <p className="text-sm font-medium text-white">
                      {uniqueCards}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-zinc-600">
                  références
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}