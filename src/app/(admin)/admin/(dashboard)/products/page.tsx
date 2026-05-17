import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Package, AlertCircle, Star } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { ProductActions } from "@/components/admin/ProductActions";

export default async function AdminProductsPage() {
  const supabase = createAdminClient();

  // Busca produtos com imagem principal e categoria
  const { data: products, error } = await supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      stock_quantity,
      is_visible,
      is_featured,
      created_at,
      categories ( name ),
      product_images ( image_url, display_order )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar produtos:", error);
  }

  const total      = products?.length ?? 0;
  const semEstoque = products?.filter((p) => p.stock_quantity === 0).length ?? 0;
  const visiveis   = products?.filter((p) => p.is_visible).length ?? 0;
  const destaques  = products?.filter((p) => p.is_featured).length ?? 0;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
            Painel Administrativo
          </p>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase text-zinc-950">
            Produtos
          </h1>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-4 font-black uppercase italic text-sm hover:bg-zinc-900 transition-colors shadow-lg shadow-brand-blue/20"
        >
          <Plus className="h-5 w-5" />
          Novo Produto
        </Link>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Cadastrado", value: total,      color: "border-brand-blue"  },
          { label: "Visíveis no Site",  value: visiveis,   color: "border-brand-green" },
          { label: "Em Destaque",       value: destaques,  color: "border-yellow-500"  },
          { label: "Sem Estoque",       value: semEstoque, color: "border-brand-red"   },
        ].map((card) => (
          <div key={card.label} className={`bg-white p-5 border-l-4 ${card.color} shadow-sm`}>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">
              {card.label}
            </p>
            <p className="text-4xl font-black italic text-zinc-950">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Busca */}
      <div className="bg-white p-4 shadow-sm border border-zinc-100">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="BUSCAR PRODUTO..."
            className="w-full pl-12 pr-4 py-3 bg-zinc-50 font-bold uppercase text-xs focus:ring-2 focus:ring-brand-blue outline-none"
          />
        </div>
      </div>

      {/* Listagem */}
      {products && products.length > 0 ? (
        <>
          {/* Tabela Desktop */}
          <div className="hidden md:block bg-white shadow-sm border border-zinc-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-zinc-100">
                    {["Produto", "Categoria", "Preço", "Estoque", "Status", "Ações"].map((h, i) => (
                      <th
                        key={h}
                        className={`px-6 py-4 font-black uppercase italic text-[10px] tracking-widest text-zinc-400 ${
                          i === 5 ? "text-right" : ""
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => {
                    const imgs = (product.product_images as { image_url: string; display_order: number }[]) ?? [];
                    const mainImg = imgs.sort((a, b) => a.display_order - b.display_order)[0]?.image_url;
                    const categoryName = (product.categories as unknown as { name: string }[])?.[0]?.name ?? "—";
                    const stock = product.stock_quantity;

                    return (
                      <tr key={product.id} className="border-b border-zinc-50 hover:bg-zinc-50/70 transition-colors group">
                        {/* Produto */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="relative h-14 w-14 bg-zinc-100 shrink-0 overflow-hidden">
                              {mainImg ? (
                                <Image src={mainImg} alt={product.name} fill sizes="56px" className="object-contain p-1" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package className="h-5 w-5 text-zinc-300" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                {product.is_featured && (
                                  <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" />
                                )}
                                <span className="font-black italic text-sm text-zinc-950 group-hover:text-brand-blue transition-colors uppercase truncate leading-tight">
                                  {product.name}
                                </span>
                              </div>
                              <span className="text-[10px] text-zinc-400 font-bold">{product.slug}</span>
                            </div>
                          </div>
                        </td>

                        {/* Categoria */}
                        <td className="px-6 py-4">
                          <span className="px-3 py-1.5 bg-zinc-100 text-zinc-600 font-bold uppercase text-[10px] tracking-widest">
                            {categoryName}
                          </span>
                        </td>

                        {/* Preço */}
                        <td className="px-6 py-4">
                          <span className="font-black text-sm text-zinc-950 whitespace-nowrap">
                            R$ {Number(product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                          </span>
                        </td>

                        {/* Estoque */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-black text-sm ${
                              stock === 0 ? "text-brand-red" : stock < 5 ? "text-orange-500" : "text-zinc-950"
                            }`}>
                              {stock} un
                            </span>
                            {stock < 5 && <AlertCircle className="h-4 w-4 text-orange-500 shrink-0" />}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-3 py-1.5 font-black uppercase italic text-[10px] tracking-widest ${
                            product.is_visible ? "bg-green-50 text-brand-green" : "bg-zinc-100 text-zinc-400"
                          }`}>
                            {product.is_visible ? "Visível" : "Oculto"}
                          </span>
                        </td>

                        {/* Ações */}
                        <td className="px-6 py-4 text-right">
                          <ProductActions
                            product={{
                              id: product.id,
                              name: product.name,
                              is_visible: product.is_visible ?? true,
                              is_featured: product.is_featured ?? false,
                              stock: stock,
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lista Mobile */}
          <div className="md:hidden space-y-3">
            {products.map((product) => {
              const imgs = (product.product_images as { image_url: string; display_order: number }[]) ?? [];
              const mainImg = imgs.sort((a, b) => a.display_order - b.display_order)[0]?.image_url;
              const categoryName = (product.categories as unknown as { name: string }[])?.[0]?.name ?? "—";
              const stock = product.stock_quantity;

              return (
                <div key={product.id} className="bg-white p-4 border border-zinc-100 shadow-sm space-y-3">
                  <div className="flex gap-3">
                    <div className="relative h-16 w-16 bg-zinc-50 border border-zinc-100 shrink-0 overflow-hidden">
                      {mainImg ? (
                        <Image src={mainImg} alt={product.name} fill sizes="64px" className="object-contain p-1" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-zinc-300" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        {product.is_featured && (
                          <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 shrink-0" />
                        )}
                        <span className="font-black italic text-sm text-zinc-950 uppercase truncate leading-tight block">
                          {product.name}
                        </span>
                      </div>
                      <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider mt-0.5">{categoryName}</p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <span className="font-black text-xs text-zinc-950">
                          R$ {Number(product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </span>
                        <span className={`text-[10px] font-black uppercase ${
                          stock === 0 ? "text-brand-red" : stock < 5 ? "text-orange-500" : "text-zinc-500"
                        }`}>
                          Estoque: {stock} un
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-zinc-50 pt-2 flex items-center justify-between">
                    <span className={`inline-flex px-2.5 py-1 font-black uppercase italic text-[9px] tracking-widest ${
                      product.is_visible ? "bg-green-50 text-brand-green" : "bg-zinc-100 text-zinc-400"
                    }`}>
                      {product.is_visible ? "Visível" : "Oculto"}
                    </span>

                    <ProductActions
                      product={{
                        id: product.id,
                        name: product.name,
                        is_visible: product.is_visible ?? true,
                        is_featured: product.is_featured ?? false,
                        stock: stock,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="bg-white p-12 border border-zinc-100 shadow-sm text-center">
          <Package className="h-14 w-14 text-zinc-200 mx-auto mb-4" />
          <p className="text-zinc-400 font-black uppercase italic tracking-widest text-sm mb-2">
            Nenhum produto cadastrado
          </p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 font-black uppercase italic text-sm hover:bg-zinc-900 transition-colors mt-4"
          >
            <Plus className="h-5 w-5" />
            Adicionar Primeiro Produto
          </Link>
        </div>
      )}
    </div>
  );
}
