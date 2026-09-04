"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useCollection } from "@/components/collection/collection-provider";

import type { PokemonCard } from "@/types/card";

type DeleteCardDialogProps = {
  card: PokemonCard;
};

export function DeleteCardDialog({
  card,
}: DeleteCardDialogProps) {
  const { deleteCard } = useCollection();

  const [open, setOpen] = useState(false);

  function handleDelete() {
    deleteCard(card.id);

    toast.success("Carte supprimée", {
      description: `${card.name} a été retirée de ta collection.`,
    });

    setOpen(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger className="inline-flex h-9 w-9 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400">
        <Trash2 className="h-3.5 w-3.5" />
      </AlertDialogTrigger>

      <AlertDialogContent className="border-white/10 bg-[#111114] text-white">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Supprimer cette carte ?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-zinc-500">
            Tu es sur le point de supprimer{" "}
            <span className="font-medium text-zinc-300">
              {card.name}
            </span>{" "}
            de ta collection.
            <br />
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel className="border-white/10 bg-transparent text-zinc-400 hover:bg-white/5 hover:text-white">
            Annuler
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-500 text-white hover:bg-red-400"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}