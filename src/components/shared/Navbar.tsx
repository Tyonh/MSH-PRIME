"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { totalItems, toggleCart } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fecha o menu ao redimensionar para desktop
  useEffect(() => {
    const handleResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { label: "Início", href: "/" },
    { label: "Produtos", href: "/produtos" },
    { label: "Objetivos", href: "/objetivos" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled || menuOpen ? "bg-black py-3 shadow-2xl" : "bg-transparent py-4 md:py-6"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex flex-col group" onClick={() => setMenuOpen(false)}>
            <span className="text-2xl md:text-3xl font-black italic tracking-tighter leading-none text-white">
              MSH <span className="text-brand-blue-light">PRIME</span>
            </span>
            <span className="text-[8px] md:text-[10px] font-black tracking-[0.2em] text-white/60 uppercase leading-none mt-0.5 group-hover:text-brand-blue-light transition-colors">
              Suplementos
            </span>
          </Link>

          {/* Links Desktop */}
          <div className="hidden md:flex gap-10 items-center">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-black text-xs uppercase italic tracking-widest text-white hover:text-brand-blue-light transition-all relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-blue-light transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>

          {/* Ações (Carrinho + Hambúrguer) */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Carrinho */}
            <button
              onClick={toggleCart}
              className="text-white hover:text-brand-blue transition-colors flex items-center gap-2 relative"
            >
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
              <span className="hidden md:inline font-black text-xs uppercase italic tracking-widest">
                Carrinho
              </span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-red text-white text-[10px] font-black h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hambúrguer Mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-white hover:text-brand-blue-light transition-colors p-1"
              aria-label="Menu"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Menu Mobile */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
            menuOpen ? "max-h-screen bg-black/95 backdrop-blur-md border-t border-zinc-800" : "max-h-0"
          }`}
        >
          <div className="flex flex-col p-6 gap-4">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="font-black text-2xl uppercase italic tracking-widest text-zinc-300 hover:text-brand-blue-light transition-all"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
