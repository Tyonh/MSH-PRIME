"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart, Check, Plus } from "lucide-react";
import { useState } from "react";

interface Props {
  product: {
    id: string;
    name: string;
    price: number;
    price_pix: number | null;
    image_url: string | null;
    stock_quantity: number;
  };
  className?: string;
  variant?: "default" | "compact";
}

export function AddToCartButton({ product, className = "", variant = "default" }: Props) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const disabled = product.stock_quantity === 0;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      price_pix: product.price_pix,
      image_url: product.image_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  if (variant === "compact") {
    return (
      <button
        onClick={handleClick}
        disabled={disabled}
        className={`h-10 w-10 md:h-12 md:w-12 rounded-full border border-zinc-100 bg-white shadow-xl flex items-center justify-center transition-all ${
          disabled 
            ? "bg-zinc-100 text-zinc-300 cursor-not-allowed" 
            : added 
            ? "bg-brand-green text-white" 
            : "text-brand-blue hover:scale-110 active:scale-95"
        } ${className}`}
      >
        {added ? <Check className="h-5 w-5 md:h-6 md:w-6" /> : <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`w-full py-4 font-black italic uppercase text-xs flex items-center justify-center gap-3 transition-all ${
        disabled
          ? "bg-zinc-200 text-zinc-400 cursor-not-allowed"
          : added
          ? "bg-brand-green text-white"
          : "bg-zinc-950 text-white hover:bg-brand-blue"
      } ${className}`}
    >
      {disabled ? (
        "Esgotado"
      ) : added ? (
        <>
          <Check className="h-4 w-4" /> Adicionado!
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4" /> Adicionar ao Carrinho
        </>
      )}
    </button>
  );
}
