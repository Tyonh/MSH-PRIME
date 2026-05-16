import Link from "next/link";
import { 
  LayoutDashboard,
  Package, 
  Tag, 
  Settings, 
  LogOut, 
  ChevronRight,
  Menu,
  Target,
  Award
} from "lucide-react";
import { signOut } from "@/lib/actions/auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = [
    { name: "Dashboard",   href: "/admin/dashboard",  icon: LayoutDashboard },
    { name: "Produtos",    href: "/admin/products",   icon: Package          },
    { name: "Categorias",  href: "/admin/categories", icon: Tag              },
    { name: "Marcas",      href: "/admin/brands",     icon: Settings         },
    { name: "Objetivos",   href: "/admin/objectives", icon: Target           },
  ];

  return (
    <div className="flex min-h-screen bg-[#f4f4f7]">
      {/* Sidebar */}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Mobile */}
        <header className="md:hidden bg-zinc-950 text-white p-4 flex justify-between items-center">
          <span className="text-xl font-black italic tracking-tighter">MSH ADMIN</span>
          <button className="p-2 bg-zinc-900">
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
