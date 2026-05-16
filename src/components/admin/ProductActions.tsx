"use client";

import { Eye, EyeOff, Star, Trash2, Edit3 } from "lucide-react";
import { toggleVisibility, toggleFeatured, deleteProduct } from "@/lib/actions/products";
import Link from "next/link";
import { useTransition } from "react";

interface Product {
  id: string;
  name: string;
  is_visible: boolean;
  is_featured: boolean;
  stock: number;
}

export function ProductActions({ product }: { product: Product }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex justify-end items-center gap-1">
      {/* Toggle Visibilidade */}
      <button
        title={product.is_visible ? "Ocultar do catálogo" : "Exibir no catálogo"}
        disabled={isPending}
        onClick={() =>
          startTransition(() => toggleVisibility(product.id, product.is_visible))
        }
        className={`p-2 transition-colors rounded ${
          product.is_visible
            ? "text-brand-green hover:bg-green-50"
            : "text-zinc-400 hover:bg-zinc-100"
        }`}
      >
        {product.is_visible ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
      </button>

      {/* Toggle Destaque */}
      <button
        title={product.is_featured ? "Remover destaque" : "Marcar como destaque"}
        disabled={isPending}
        onClick={() =>
          startTransition(() => toggleFeatured(product.id, product.is_featured))
        }
        className={`p-2 transition-colors rounded ${
          product.is_featured
            ? "text-yellow-500 hover:bg-yellow-50"
            : "text-zinc-400 hover:bg-zinc-100"
        }`}
      >
        <Star className="h-5 w-5" />
      </button>

      {/* Editar */}
      <Link
        href={`/admin/products/${product.id}/edit`}
        className="p-2 text-zinc-400 hover:text-brand-blue hover:bg-blue-50 transition-colors rounded"
        title="Editar produto"
      >
        <Edit3 className="h-5 w-5" />
      </Link>

      {/* Excluir */}
      <button
        title="Excluir produto"
        disabled={isPending}
        onClick={() => {
          if (confirm(`Excluir "${product.name}"? Esta ação não pode ser desfeita.`)) {
            startTransition(() => deleteProduct(product.id));
          }
        }}
        className="p-2 text-zinc-400 hover:text-brand-red hover:bg-red-50 transition-colors rounded"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
