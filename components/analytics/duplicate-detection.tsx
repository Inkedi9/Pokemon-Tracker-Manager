"use client";

import { useState } from "react";

import {
  AlertTriangle,
  Check,
  Copy,
  Package,
  ShieldAlert,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  getIgnoredDuplicateKeys,
  ignoreDuplicate,
} from "@/lib/ignored-duplicates";

import { mergeDuplicateCards } from "@/lib/duplicate-merge";
import { useCollection } from "@/components/collection/collection-provider";
import type { DuplicateGroup } from "@/lib/duplicate-detection";

import { toast } from "sonner";

type DuplicateDetectionProps = {
  groups: DuplicateGroup[];
};

type DuplicateGroupCardProps = {
  group: DuplicateGroup;
  onIgnore: (key: string) => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

function DuplicateGroupCard({
  group,
  onIgnore,
}: DuplicateGroupCardProps) {
  const { updateCard, deleteCard } = useCollection();

  const [selectedId, setSelectedId] = useState(
    group.cards[0]?.id
  );

  const [isMergeDialogOpen, setIsMergeDialogOpen] =
    useState(false);

  const selectedCard =
    group.cards.find((card) => card.id === selectedId) ??
    group.cards[0];

  if (!selectedCard) {
    return null;
  }

  const mergePreview = mergeDuplicateCards(
    group.cards,
    selectedCard.id
  );

  const handleIgnore = () => {
    onIgnore(group.key);

    toast.success("Doublon ignoré", {
      description: `${group.cards[0]?.name ?? "Carte"} ne sera plus signalée.`,
    });
  };

  const handleMerge = () => {
    if (!mergePreview) {
      return;
    }

    const mergedName = mergePreview.mergedCard.name;
    const removedCount = mergePreview.removedIds.length;

    updateCard(mergePreview.mergedCard);

    mergePreview.removedIds.forEach((id) => {
      deleteCard(id);
    });

    setIsMergeDialogOpen(false);

    toast.success("Fusion effectuée", {
      description: `${mergedName} : ${removedCount} doublon(s) supprimé(s).`,
    });
  };

  return (
    <Card className="border-white/10 bg-white/[0.02]">
      <CardHeader className="border-b border-white/5 px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <CardTitle className="truncate text-sm font-semibold text-zinc-100">
              {selectedCard.name}
            </CardTitle>

            <p className="mt-1 text-xs text-zinc-500">
              {selectedCard.set} · {selectedCard.number}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Badge
              variant="outline"
              className="border-white/10 bg-white/[0.03] text-zinc-400"
            >
              {selectedCard.language}
            </Badge>

            <Badge
              variant="outline"
              className="border-violet-400/20 bg-violet-400/5 text-violet-300"
            >
              {group.cards.length} entrées
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5">
        {/* Group stats */}
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-white/5 bg-black/10 p-3">
            <div className="flex items-center gap-2 text-zinc-600">
              <Package className="h-3.5 w-3.5" />

              <span className="text-[10px] uppercase tracking-wider">
                Quantité
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold text-zinc-200">
              {group.totalQuantity}
            </p>
          </div>

          <div className="rounded-lg border border-white/5 bg-black/10 p-3">
            <div className="flex items-center gap-2 text-zinc-600">
              <Wallet className="h-3.5 w-3.5" />

              <span className="text-[10px] uppercase tracking-wider">
                Investi
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold text-zinc-200">
              {formatCurrency(group.totalInvested)}
            </p>
          </div>

          <div className="rounded-lg border border-white/5 bg-black/10 p-3">
            <div className="flex items-center gap-2 text-zinc-600">
              <TrendingUp className="h-3.5 w-3.5" />

              <span className="text-[10px] uppercase tracking-wider">
                Valeur
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold text-zinc-200">
              {formatCurrency(group.totalEstimatedValue)}
            </p>
          </div>
        </div>

        {/* Entries */}
        <div className="mt-4 space-y-2">
          <p className="text-[10px] font-medium uppercase tracking-wider text-zinc-600">
            Entrées détectées
          </p>

          <div className="space-y-2">
            {group.cards.map((card) => {
              const isSelected = card.id === selectedId;

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setSelectedId(card.id)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    isSelected
                      ? "border-violet-400/30 bg-violet-400/[0.06]"
                      : "border-white/5 bg-white/[0.015] hover:border-white/10 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={
                            isSelected
                              ? "border-violet-400/30 text-violet-300"
                              : "border-white/10 text-zinc-400"
                          }
                        >
                          {isSelected ? "Principale" : "Entrée"}
                        </Badge>

                        <Badge
                          variant="outline"
                          className="border-white/10 text-zinc-500"
                        >
                          {card.condition}
                        </Badge>

                        <span className="text-xs text-zinc-400">
                          × {card.quantity}
                        </span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-zinc-600">
                        <span>
                          Achat :{" "}
                          {formatCurrency(card.purchasePrice)}
                        </span>

                        <span>
                          Valeur :{" "}
                          {formatCurrency(card.estimatedValue)}
                        </span>

                        {card.location && (
                          <span>
                            Emplacement : {card.location}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                        Valeur totale
                      </p>

                      <p className="mt-0.5 text-xs font-medium text-zinc-300">
                        {formatCurrency(
                          card.estimatedValue * card.quantity
                        )}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Merge preview */}
        {mergePreview && (
          <div className="mt-4 rounded-xl border border-violet-400/10 bg-violet-400/[0.03] p-4">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold text-violet-300">
                  Aperçu de la fusion
                </p>

                <p className="mt-1 text-[11px] text-zinc-600">
                  L'entrée principale sera conservée et les autres
                  seront supprimées.
                </p>
              </div>

              <Badge
                variant="outline"
                className="w-fit border-violet-400/20 bg-violet-400/5 text-violet-300"
              >
                {mergePreview.removedIds.length} entrée(s) supprimée(s)
              </Badge>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-white/5 bg-black/10 p-3">
                <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                  Quantité finale
                </p>

                <p className="mt-1 text-sm font-semibold text-zinc-200">
                  {mergePreview.mergedCard.quantity}
                </p>
              </div>

              <div className="rounded-lg border border-white/5 bg-black/10 p-3">
                <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                  Prix d'achat moyen
                </p>

                <p className="mt-1 text-sm font-semibold text-zinc-200">
                  {formatCurrency(
                    mergePreview.mergedCard.purchasePrice
                  )}
                </p>
              </div>

              <div className="rounded-lg border border-white/5 bg-black/10 p-3">
                <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                  Valeur estimée
                </p>

                <p className="mt-1 text-sm font-semibold text-zinc-200">
                  {formatCurrency(
                    mergePreview.mergedCard.estimatedValue
                  )}
                </p>
              </div>

              <div className="rounded-lg border border-white/5 bg-black/10 p-3">
                <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                  Condition retenue
                </p>

                <p className="mt-1 text-sm font-semibold text-zinc-200">
                  {mergePreview.mergedCard.condition}
                </p>
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-lg border border-white/5 bg-black/10 p-3">
                <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                  Emplacement final
                </p>

                <p className="mt-1 text-xs text-zinc-400">
                  {mergePreview.mergedCard.location ||
                    "Aucun emplacement"}
                </p>
              </div>

              <div className="rounded-lg border border-white/5 bg-black/10 p-3">
                <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                  Notes
                </p>

                <p className="mt-1 line-clamp-2 whitespace-pre-line text-xs text-zinc-400">
                  {mergePreview.mergedCard.notes || "Aucune note"}
                </p>
              </div>
            </div>

            <div className="mt-3 rounded-lg border border-white/5 bg-black/10 px-3 py-2">
              <p className="text-[10px] text-zinc-600">
                La condition affichée correspond à celle de l'entrée
                principale sélectionnée.
              </p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex flex-col gap-2 border-t border-white/5 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-[11px] text-zinc-600">
            L'entrée principale sera conservée lors de la prochaine
            étape de fusion.
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setIsMergeDialogOpen(true)}
              disabled={!mergePreview}
              className="border-violet-400/20 bg-violet-400/[0.04] text-violet-300 hover:bg-violet-400/[0.08] hover:text-violet-200"
            >
              <Check className="mr-1.5 h-3.5 w-3.5" />
              Fusionner
            </Button>

            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={handleIgnore}
              className="text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
            >
              Ignorer
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Merge confirmation dialog */}
      <Dialog
        open={isMergeDialogOpen}
        onOpenChange={setIsMergeDialogOpen}
      >
        <DialogContent className="border-white/10 bg-zinc-950 sm:max-w-lg">
          <DialogHeader>
            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/20 bg-amber-400/10">
              <AlertTriangle className="h-5 w-5 text-amber-400" />
            </div>

            <DialogTitle className="text-zinc-100">
              Confirmer la fusion
            </DialogTitle>

            <DialogDescription className="text-zinc-500">
              Cette opération regroupera les entrées détectées en une
              seule carte.
            </DialogDescription>
          </DialogHeader>

          {mergePreview && (
            <div className="space-y-3">
              <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                  Carte conservée
                </p>

                <div className="mt-1 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-zinc-200">
                      {mergePreview.mergedCard.name}
                    </p>

                    <p className="text-xs text-zinc-600">
                      {mergePreview.mergedCard.set} ·{" "}
                      {mergePreview.mergedCard.number}
                    </p>
                  </div>

                  <Badge
                    variant="outline"
                    className="border-violet-400/20 bg-violet-400/5 text-violet-300"
                  >
                    {mergePreview.mergedCard.condition}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                    Quantité finale
                  </p>

                  <p className="mt-1 text-sm font-semibold text-zinc-200">
                    {mergePreview.mergedCard.quantity}
                  </p>
                </div>

                <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-600">
                    Entrées supprimées
                  </p>

                  <p className="mt-1 text-sm font-semibold text-red-300">
                    {mergePreview.removedIds.length}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-red-400/10 bg-red-400/[0.03] p-3">
                <p className="text-xs font-medium text-red-300">
                  Attention
                </p>

                <p className="mt-1 text-[11px] leading-relaxed text-zinc-500">
                  Les {mergePreview.removedIds.length} entrée(s)
                  secondaire(s) seront supprimées lors de l'exécution
                  de la fusion. Cette étape ne peut pas encore être
                  annulée automatiquement.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsMergeDialogOpen(false)}
              className="text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
            >
              Annuler
            </Button>

            <Button
              type="button"
              disabled={!mergePreview}
              onClick={handleMerge}
              className="bg-violet-600 text-white hover:bg-violet-500"
            >
              Confirmer la fusion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

export function DuplicateDetection({
  groups,
}: DuplicateDetectionProps) {
  const [ignoredKeys, setIgnoredKeys] = useState<string[]>(() =>
    getIgnoredDuplicateKeys()
  );

  const visibleGroups = groups.filter(
    (group) => !ignoredKeys.includes(group.key)
  );

  const duplicatedEntries = visibleGroups.reduce(
    (total, group) => total + group.cards.length,
    0
  );

  const duplicatedQuantity = visibleGroups.reduce(
    (total, group) => total + group.totalQuantity,
    0
  );

  const handleIgnoreGroup = (key: string) => {
    ignoreDuplicate(key);

    setIgnoredKeys((current) =>
      current.includes(key)
        ? current
        : [...current, key]
    );
  };

  if (visibleGroups.length === 0) {
    return (
      <section className="mt-4">
        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="flex flex-col items-center justify-center px-6 py-10 text-center">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10">
              <ShieldAlert className="h-5 w-5 text-emerald-400" />
            </div>

            <h3 className="text-sm font-semibold text-zinc-200">
              Aucun doublon détecté
            </h3>

            <p className="mt-1 max-w-md text-xs text-zinc-500">
              Chaque carte de ta collection possède actuellement
              une entrée unique pour son nom, extension, numéro et
              langue.
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="mt-4">
      {/* Header */}
      <div className="mb-3">
        <div className="flex items-center gap-2">
          <Copy className="h-4 w-4 text-violet-400" />

          <h2 className="text-sm font-semibold text-zinc-200">
            Duplicate Detection
          </h2>

          <Badge
            variant="outline"
            className="border-violet-400/20 bg-violet-400/5 text-violet-300"
          >
            {visibleGroups.length}
          </Badge>
        </div>

        <p className="mt-1 text-xs text-zinc-500">
          Cartes enregistrées plusieurs fois dans ta collection.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-violet-400/20 bg-violet-400/10">
              <Copy className="h-4 w-4 text-violet-400" />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wider text-zinc-600">
                Groupes
              </p>

              <p className="mt-0.5 text-lg font-semibold text-zinc-100">
                {visibleGroups.length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-blue-400/20 bg-blue-400/10">
              <Package className="h-4 w-4 text-blue-400" />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wider text-zinc-600">
                Entrées
              </p>

              <p className="mt-0.5 text-lg font-semibold text-zinc-100">
                {duplicatedEntries}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/[0.02]">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-amber-400/20 bg-amber-400/10">
              <TrendingUp className="h-4 w-4 text-amber-400" />
            </div>

            <div>
              <p className="text-[11px] uppercase tracking-wider text-zinc-600">
                Exemplaires
              </p>

              <p className="mt-0.5 text-lg font-semibold text-zinc-100">
                {duplicatedQuantity}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Duplicate groups */}
      <div className="mt-3 space-y-3">
        {visibleGroups.map((group) => (
          <DuplicateGroupCard
            key={group.key}
            group={group}
            onIgnore={handleIgnoreGroup}
          />
        ))}
      </div>
    </section>
  );
}