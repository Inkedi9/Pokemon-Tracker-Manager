"use client";

import { useState } from "react";

import {
    CheckCircle2,
    CircleStar,
    Languages,
    Layers3,
    Pencil,
    Plus,
    Target,
    Wallet,
} from "lucide-react";

import {
    getGoalLabel,
    getGoalUnit,
    type CollectionGoal,
    type CollectionGoalProgress,
    type CollectionGoalType,
} from "@/lib/collection-goals";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CollectionGoalsProps = {
    goals: CollectionGoal[];
    progress: CollectionGoalProgress[];
    onUpdateGoal: (
        id: string,
        updates: Partial<CollectionGoal>
    ) => void;
};

type GoalItemProps = {
    item: CollectionGoalProgress;
    onEdit: (goal: CollectionGoal) => void;
};

function getGoalIcon(type: CollectionGoalType) {
    switch (type) {
        case "cards":
            return (
                <Target className="h-4 w-4 text-blue-400" />
            );

        case "value":
            return (
                <Wallet className="h-4 w-4 text-emerald-400" />
            );

        case "sets":
            return (
                <Layers3 className="h-4 w-4 text-violet-400" />
            );

        case "languages":
            return (
                <Languages className="h-4 w-4 text-amber-400" />
            );
    }
}

function formatCurrentValue(
    type: CollectionGoalType,
    value: number
) {
    if (type === "value") {
        return `${value.toFixed(2)} €`;
    }

    return value.toLocaleString("fr-FR");
}

function GoalItem({
    item,
    onEdit,
}: GoalItemProps) {
    const {
        goal,
        current,
        progress,
        remaining,
        completed,
    } = item;

    return (
        <div className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
            <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/5 bg-white/[0.03]">
                        {getGoalIcon(goal.type)}
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-zinc-300">
                            {getGoalLabel(goal.type)}
                        </p>

                        <p className="mt-0.5 text-[10px] text-zinc-600">
                            Objectif :{" "}
                            {goal.type === "value"
                                ? `${goal.target.toFixed(2)} €`
                                : `${goal.target.toLocaleString(
                                    "fr-FR"
                                )} ${getGoalUnit(
                                    goal.type
                                )}`}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {completed ? (
                        <Badge
                            variant="outline"
                            className="border-emerald-400/20 bg-emerald-400/5 text-[9px] text-emerald-300"
                        >
                            Atteint
                        </Badge>
                    ) : (
                        <Badge
                            variant="outline"
                            className="border-white/10 bg-white/[0.02] text-[9px] text-zinc-500"
                        >
                            {progress}%
                        </Badge>
                    )}

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-zinc-600 hover:bg-white/5 hover:text-zinc-300"
                        onClick={() => onEdit(goal)}
                    >
                        <Pencil className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>

            <div className="mt-4">
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                        className={`h-full rounded-full transition-all ${completed
                                ? "bg-emerald-400"
                                : "bg-blue-400"
                            }`}
                        style={{
                            width: `${progress}%`,
                        }}
                    />
                </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-zinc-600">
                    {formatCurrentValue(
                        goal.type,
                        current
                    )}
                </span>

                {completed ? (
                    <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" />
                        Objectif atteint
                    </span>
                ) : (
                    <span className="text-[10px] text-zinc-600">
                        Encore{" "}
                        {formatCurrentValue(
                            goal.type,
                            remaining
                        )}
                    </span>
                )}
            </div>
        </div>
    );
}

export function CollectionGoals({
    goals,
    progress,
    onUpdateGoal,
}: CollectionGoalsProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedType, setSelectedType] =
        useState<CollectionGoalType>("cards");
    const [target, setTarget] = useState("100");
    const [enabled, setEnabled] = useState(true);

    const activeGoals = progress;

    function openEditor(goal?: CollectionGoal) {
        const goalToEdit =
            goal ??
            goals.find(
                (item) => item.type === selectedType
            ) ??
            goals[0];

        if (!goalToEdit) {
            return;
        }

        setSelectedType(goalToEdit.type);
        setTarget(String(goalToEdit.target));
        setEnabled(goalToEdit.enabled);
        setDialogOpen(true);
    }

    function handleTypeChange(type: CollectionGoalType) {
        setSelectedType(type);

        const goal = goals.find(
            (item) => item.type === type
        );

        if (!goal) {
            return;
        }

        setTarget(String(goal.target));
        setEnabled(goal.enabled);
    }

    function handleSave() {
        const numericTarget = Number(target);

        if (!Number.isFinite(numericTarget) || numericTarget <= 0) {
            return;
        }

        const goal = goals.find(
            (item) => item.type === selectedType
        );

        if (!goal) {
            return;
        }

        onUpdateGoal(goal.id, {
            target: numericTarget,
            enabled,
        });

        setDialogOpen(false);
    }

    return (
        <>
            <Card className="rounded-xl border-white/10 bg-[#111114]">
                <CardContent className="p-4 sm:p-5">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <CircleStar className="h-4 w-4 text-violet-400" />

                                <h2 className="text-sm font-semibold text-zinc-200">
                                    Collection Goals
                                </h2>

                                <Badge
                                    variant="outline"
                                    className="border-white/10 bg-white/[0.02] text-[10px] text-zinc-500"
                                >
                                    M3.4
                                </Badge>
                            </div>

                            <p className="mt-1 text-xs text-zinc-500">
                                Définis des objectifs et suis leur progression.
                            </p>
                        </div>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 text-[10px] text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                            onClick={() => openEditor()}
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Ajouter
                        </Button>
                    </div>

                    {activeGoals.length > 0 ? (
                        <div className="grid gap-3 md:grid-cols-2">
                            {activeGoals.map((item) => (
                                <GoalItem
                                    key={item.goal.id}
                                    item={item}
                                    onEdit={openEditor}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-xl border border-white/10 bg-[#111114] p-5 text-center">
                            <Target className="mx-auto h-5 w-5 text-zinc-600" />

                            <p className="mt-2 text-xs font-medium text-zinc-400">
                                Aucun objectif actif
                            </p>

                            <p className="mt-1 text-[10px] text-zinc-600">
                                Active un objectif pour commencer à suivre ta progression.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
            >
                <DialogContent className="border-white/10 bg-[#111114] text-zinc-200 sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-sm">
                            Configurer un objectif
                        </DialogTitle>

                        <DialogDescription className="text-xs text-zinc-500">
                            Définis la cible et active ou désactive cet objectif.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-5 py-2">
                        <div className="space-y-2">
                            <Label
                                htmlFor="goal-type"
                                className="text-xs text-zinc-400"
                            >
                                Type d&apos;objectif
                            </Label>

                            <select
                                id="goal-type"
                                value={selectedType}
                                onChange={(event) =>
                                    handleTypeChange(
                                        event.target.value as CollectionGoalType
                                    )
                                }
                                className="flex h-9 w-full rounded-md border border-white/10 bg-white/[0.03] px-3 text-xs text-zinc-300 outline-none transition-colors focus:border-violet-400/40 focus:ring-1 focus:ring-violet-400/20"
                            >
                                <option
                                    value="cards"
                                    className="bg-[#111114]"
                                >
                                    Nombre de cartes
                                </option>

                                <option
                                    value="value"
                                    className="bg-[#111114]"
                                >
                                    Valeur estimée
                                </option>

                                <option
                                    value="sets"
                                    className="bg-[#111114]"
                                >
                                    Extensions
                                </option>

                                <option
                                    value="languages"
                                    className="bg-[#111114]"
                                >
                                    Langues
                                </option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="goal-target"
                                className="text-xs text-zinc-400"
                            >
                                Cible
                            </Label>

                            <div className="relative">
                                <Input
                                    id="goal-target"
                                    type="number"
                                    min="1"
                                    step={
                                        selectedType === "value"
                                            ? "0.01"
                                            : "1"
                                    }
                                    value={target}
                                    onChange={(event) =>
                                        setTarget(
                                            event.target.value
                                        )
                                    }
                                    className="border-white/10 bg-white/[0.03] text-xs text-zinc-200 placeholder:text-zinc-700"
                                />

                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600">
                                    {getGoalUnit(selectedType)}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3">
                            <div>
                                <p className="text-xs font-medium text-zinc-300">
                                    Objectif actif
                                </p>

                                <p className="mt-0.5 text-[10px] text-zinc-600">
                                    Afficher cet objectif dans Analytics
                                </p>
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className={`h-8 text-[10px] ${enabled
                                        ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300 hover:bg-emerald-400/10"
                                        : "border-white/10 bg-white/[0.02] text-zinc-500 hover:bg-white/5"
                                    }`}
                                onClick={() =>
                                    setEnabled(
                                        (current) => !current
                                    )
                                }
                            >
                                {enabled
                                    ? "Activé"
                                    : "Désactivé"}
                            </Button>
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="text-xs text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                            onClick={() =>
                                setDialogOpen(false)
                            }
                        >
                            Annuler
                        </Button>

                        <Button
                            type="button"
                            className="bg-violet-500 text-xs text-white hover:bg-violet-500/90"
                            onClick={handleSave}
                        >
                            Enregistrer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
