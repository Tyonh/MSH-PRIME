"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, ShoppingBag } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? "bg-black py-3 shadow-2xl" : "bg-transparent py-6"
    }`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="flex flex-col group">
          <span className="text-3xl font-black italic tracking-tighter leading-none text-white">
            MSH <span className="text-brand-blue-light">PRIME</span>
          </span>
          <span className="text-[10px] font-black tracking-[0.2em] text-white/60 uppercase leading-none mt-1 group-hover:text-brand-blue-light transition-colors">
            Performance System
          </span>
        </Link>

        <div className="hidden md:flex gap-10 items-center">
          {[
            { label: "Início", href: "/" },
            { label: "Produtos", href: "/produtos" },
            { label: "Objetivos", href: "/objetivos" },
            { label: "Sobre", href: "/sobre" },
          ].map((item) => (
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

        <div className="flex items-center gap-6">
          <button className="text-white hover:text-brand-blue transition-colors">
            <Search className="h-6 w-6" />
          </button>
          <div className="relative">
            <button className="text-white hover:text-brand-blue transition-colors flex items-center gap-2">
              <ShoppingBag className="h-6 w-6" />
              <span className="hidden md:inline font-black text-xs uppercase italic tracking-widest">
                Meu Carrinho
              </span>
              <span className="bg-brand-red text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-none skew-x-[-15deg]">
                0
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
