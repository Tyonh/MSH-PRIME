"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";

interface Props {
  id: string;
  name: string;
  onDelete: (id: string) => Promise<void>;
}

export function DeleteItemButton({ id, name, onDelete }: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        if (confirm(`Excluir "${name}"?`)) {
          startTransition(() => onDelete(id));
        }
      }}
      className="p-2 text-zinc-400 hover:text-brand-red hover:bg-red-50 transition-colors rounded disabled:opacity-40"
      title="Excluir"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
