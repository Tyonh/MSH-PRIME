"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  LayoutDashboard,
  Package, 
  Tag, 
  Settings, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Target,
  Award
} from "lucide-react";
import { signOut } from "@/lib/actions/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard",   href: "/admin/dashboard",  icon: LayoutDashboard },
    { name: "Produtos",    href: "/admin/products",   icon: Package          },
    { name: "Categorias",  href: "/admin/categories", icon: Tag              },
    { name: "Marcas",      href: "/admin/brands",     icon: Settings         },
    { name: "Objetivos",   href: "/admin/objectives", icon: Target           },
  ];

  return (
    <div className="flex min-h-screen bg-[#f4f4f7]">
      {/* Sidebar - Desktop */}
      <aside className="w-64 bg-zinc-950 text-white hidden md:flex flex-col border-r border-zinc-800">
        <div className="p-6 border-b border-zinc-800">
          <Link href="/admin/dashboard" className="flex flex-col">
            <span className="text-2xl font-[1000] italic tracking-tighter leading-none text-brand-blue-light">
              MSH <span className="text-white">ADMIN</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 text-zinc-400 font-bold uppercase italic text-xs tracking-widest hover:bg-zinc-900 hover:text-white transition-all group"
            >
              <item.icon className="h-5 w-5 group-hover:text-brand-blue-light" />
              {item.name}
              <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <form action={signOut}>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 font-bold uppercase italic text-xs tracking-widest hover:text-brand-red transition-colors">
              <LogOut className="h-5 w-5" />
              Sair do Painel
            </button>
          </form>
        </div>
      </aside>

      {/* Sidebar - Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[100] md:hidden backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)} 
        />
      )}
      
      {/* Sidebar - Mobile Drawer */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-zinc-950 text-white z-[110] transform transition-transform duration-300 md:hidden flex flex-col ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
          <span className="text-xl font-black italic tracking-tighter text-brand-blue-light">
            MSH <span className="text-white">ADMIN</span>
          </span>
          <button onClick={() => setSidebarOpen(false)} className="text-zinc-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-zinc-400 font-bold uppercase italic text-xs tracking-widest hover:bg-zinc-900 hover:text-white transition-all"
            >
              <item.icon className="h-5 w-5 text-brand-blue-light" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <form action={signOut}>
            <button className="flex items-center gap-3 w-full px-4 py-3 text-zinc-400 font-bold uppercase italic text-xs tracking-widest">
              <LogOut className="h-5 w-5" />
              Sair do Painel
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Mobile */}
        <header className="md:hidden bg-zinc-950 text-white p-4 flex justify-between items-center shrink-0 border-b border-zinc-800">
          <span className="text-xl font-black italic tracking-tighter">MSH ADMIN</span>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 bg-zinc-900 hover:bg-brand-blue transition-colors"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
