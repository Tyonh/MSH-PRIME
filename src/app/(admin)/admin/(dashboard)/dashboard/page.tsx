import { createAdminClient } from "@/lib/supabase/admin";
import { Package, Tag, Target, Award, ShoppingCart, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = createAdminClient();

  // Busca dados para o resumo
  const [
    { count: totalProducts },
    { count: totalCategories },
    { count: totalBrands },
    { data: lowStockProducts }
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("brands").select("*", { count: "exact", head: true }),
    supabase.from("products").select("name, stock_quantity").lt("stock_quantity", 5).limit(5)
  ]);

  const stats = [
    { label: "Produtos", value: totalProducts || 0, icon: Package, color: "text-brand-blue", bg: "bg-brand-blue/10" },
    { label: "Categorias", value: totalCategories || 0, icon: Tag, color: "text-purple-600", bg: "bg-purple-600/10" },
    { label: "Marcas", value: totalBrands || 0, icon: Award, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Visão Geral</p>
        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-zinc-950">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-8 shadow-sm border border-zinc-100 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <p className="text-5xl font-[1000] italic text-zinc-950 tracking-tighter">{stat.value}</p>
            </div>
            <div className={`${stat.bg} p-4`}>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Alerta de Estoque */}
        <div className="bg-white shadow-sm border border-zinc-100">
          <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
            <h2 className="font-black italic uppercase text-zinc-950 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-brand-red" /> Estoque Crítico
            </h2>
            <Link href="/admin/products" className="text-[10px] font-black text-brand-blue uppercase hover:underline">Ver Todos</Link>
          </div>
          <div className="p-6">
            {lowStockProducts && lowStockProducts.length > 0 ? (
              <div className="space-y-4">
                {lowStockProducts.map((p) => (
                  <div key={p.name} className="flex items-center justify-between p-3 bg-zinc-50 border-l-4 border-brand-red">
                    <span className="font-bold text-sm text-zinc-700 uppercase truncate pr-4">{p.name}</span>
                    <span className="font-black text-brand-red text-sm shrink-0">{p.stock_quantity} un</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-zinc-400 text-sm font-medium text-center py-10">Tudo em dia com o estoque!</p>
            )}
          </div>
        </div>

        {/* Atalhos Rápidos */}
        <div className="bg-zinc-950 p-8 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black italic text-white uppercase mb-2 tracking-tighter">Ações Rápidas</h2>
            <p className="text-zinc-500 text-sm font-medium mb-8">Gerencie seu catálogo com um clique.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/admin/products/new" className="bg-brand-blue text-white p-4 font-black italic uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-white hover:text-brand-blue transition-all">
              <PlusIcon className="h-4 w-4" /> Novo Produto
            </Link>
            <Link href="/" className="bg-zinc-800 text-white p-4 font-black italic uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-brand-blue transition-all">
              <TrendingUp className="h-4 w-4" /> Ver Loja
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
  )
}
