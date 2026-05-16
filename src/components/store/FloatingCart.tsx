"use client";

import { useCart } from "@/context/CartContext";
import { ShoppingCart, X, Plus, Minus, Trash2, MessageCircle } from "lucide-react";
import Image from "next/image";

const WHATSAPP_NUMBER = "558592994635";

export function FloatingCart() {
  const { items, totalItems, totalPrice, isOpen, toggleCart, closeCart, removeItem, updateQuantity, clearCart } = useCart();

  // Monta mensagem para o WhatsApp
  const buildWhatsAppMessage = () => {
    let msg = "Olá! Vim pelo *site MSH PRIME* e tenho interesse nos seguintes produtos:\n\n";
    items.forEach((item, i) => {
      msg += `${i + 1}. *${item.name}*`;
      if (item.quantity > 1) msg += ` (${item.quantity}un)`;
      msg += `\n`;
    });
    msg += `\nAguardo retorno!`;
    return encodeURIComponent(msg);
  };

  return (
    <>
      {/* Botão Flutuante */}
      <button
        onClick={toggleCart}
        className="fixed bottom-6 right-6 z-50 bg-brand-blue text-white p-4 shadow-2xl shadow-brand-blue/30 hover:bg-zinc-950 transition-all group"
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-brand-red text-white text-[10px] font-black h-6 w-6 flex items-center justify-center animate-bounce">
            {totalItems}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm" onClick={closeCart} />
      )}

      {/* Painel Lateral */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        {/* Header */}
        <div className="bg-zinc-950 p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-5 w-5 text-brand-blue-light" />
            <h2 className="text-white font-black italic uppercase tracking-tight text-lg">
              Carrinho
            </h2>
            <span className="bg-brand-blue text-white text-[10px] font-black px-2 py-0.5">
              {totalItems}
            </span>
          </div>
          <button onClick={closeCart} className="text-zinc-400 hover:text-white transition-colors p-1">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingCart className="h-16 w-16 text-zinc-200 mb-4" />
              <p className="text-zinc-400 font-black italic uppercase tracking-widest text-sm">Carrinho vazio</p>
              <p className="text-zinc-300 text-xs font-medium mt-2 normal-case not-italic">
                Adicione produtos para montar seu pedido.
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-zinc-50 p-4 border border-zinc-100">
                {/* Imagem */}
                <div className="relative h-20 w-20 bg-white shrink-0 overflow-hidden">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.name} fill sizes="80px" className="object-contain p-2" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-zinc-200" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-black italic uppercase text-xs text-zinc-950 leading-tight line-clamp-2 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm font-black text-brand-blue">
                    R$ {(item.price_pix ?? item.price).toFixed(2)}
                  </p>

                  {/* Controles de Quantidade */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="h-7 w-7 flex items-center justify-center bg-zinc-200 hover:bg-zinc-300 transition-colors text-zinc-700"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-black text-sm text-zinc-950 w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="h-7 w-7 flex items-center justify-center bg-zinc-200 hover:bg-zinc-300 transition-colors text-zinc-700"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto text-zinc-300 hover:text-brand-red transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-100 p-6 space-y-4 shrink-0 bg-white">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Total do Pedido</span>
              <span className="text-2xl font-black italic text-zinc-950">
                R$ {totalPrice.toFixed(2)}
              </span>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${buildWhatsAppMessage()}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                clearCart();
                closeCart();
              }}
              className="w-full bg-brand-green text-white py-4 font-black italic uppercase text-sm flex items-center justify-center gap-3 hover:bg-green-700 transition-colors shadow-lg shadow-brand-green/30"
            >
              <MessageCircle className="h-5 w-5" />
              Enviar Pedido via WhatsApp
            </a>
            <button
              onClick={clearCart}
              className="w-full text-zinc-400 hover:text-brand-red text-[10px] font-black uppercase tracking-widest py-2 transition-colors"
            >
              Limpar Carrinho
            </button>
          </div>
        )}
      </div>
    </>
  );
}
