import Image from "next/image";
import Link from "next/link";
import { Search, Filter, Dumbbell, ShoppingCart, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

interface Props {
  searchParams: Promise<{
    busca?: string;
    objetivo?: string;
    marca?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { busca, objetivo, marca } = await searchParams;
  const supabase = await createClient();

  // 1. Busca Categorias, Marcas e Objetivos para os filtros
  const [
    { data: objectives },
    { data: brands }
  ] = await Promise.all([
    supabase.from("objectives").select("id, name, slug").order("name"),
    supabase.from("brands").select("id, name, slug").order("name"),
  ]);

  // 2. Monta a query de produtos
  let query = supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      price_pix,
      discount_label,
      stock_quantity,
      is_visible,
      product_images ( image_url, display_order ),
      brands ( id, name, slug ),
      product_objectives ( objective_id )
    `)
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  // Filtro de Busca por Texto
  if (busca) {
    query = query.ilike("name", `%${busca}%`);
  }

  // Filtro de Marca
  if (marca) {
    query = query.eq("brand_id", marca);
  }

  const { data: allProducts } = await query;

  // Filtro de Objetivo (feito em memória por ser N:N)
  let products = allProducts ?? [];
  if (objetivo) {
    products = products.filter(p => 
      (p.product_objectives as any[])?.some(obj => obj.objective_id === objetivo)
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f8] pt-32 pb-20">
      <div className="container mx-auto px-6">
        
        {/* Header da Página */}
        <div className="mb-12">
          <p className="text-[10px] font-black tracking-[0.4em] text-brand-blue uppercase mb-2">Linha Completa</p>
          <h1 className="text-6xl font-black italic tracking-tighter text-zinc-950 uppercase">
            Catálogo de <span className="text-brand-blue">Produtos</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-4 gap-10">
          
          {/* ── SIDEBAR FILTROS ── */}
          <aside className="space-y-8">
            {/* Busca */}
            <div className="bg-white p-6 shadow-sm border border-zinc-100">
              <h3 className="text-xs font-black uppercase italic text-zinc-950 mb-4 flex items-center gap-2">
                <Search className="h-4 w-4 text-brand-blue" /> Buscar
              </h3>
              <form action="/produtos" method="GET" className="relative">
                <input
                  type="text"
                  name="busca"
                  defaultValue={busca}
                  placeholder="O QUE VOCÊ BUSCA?"
                  className="w-full bg-zinc-50 p-4 font-black text-[10px] uppercase tracking-widest focus:ring-2 focus:ring-brand-blue outline-none border-none"
                />
              </form>
            </div>

            {/* Objetivos */}
            <div className="bg-white p-6 shadow-sm border border-zinc-100">
              <h3 className="text-xs font-black uppercase italic text-zinc-950 mb-4 flex items-center gap-2">
                <Filter className="h-4 w-4 text-brand-blue" /> Por Objetivo
              </h3>
              <div className="flex flex-col gap-2">
                <Link 
                  href="/produtos"
                  className={`text-[10px] font-black uppercase tracking-widest p-3 transition-colors ${!objetivo ? 'bg-brand-blue text-white' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}`}
                >
                  Todos
                </Link>
                {objectives?.map((obj) => (
                  <Link
                    key={obj.id}
                    href={`/produtos?objetivo=${obj.id}${busca ? `&busca=${busca}` : ''}${marca ? `&marca=${marca}` : ''}`}
                    className={`text-[10px] font-black uppercase tracking-widest p-3 transition-colors ${objetivo === obj.id ? 'bg-brand-blue text-white' : 'bg-zinc-50 text-zinc-400 hover:bg-zinc-100'}`}
                  >
                    {obj.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Marcas */}
            <div className="bg-white p-6 shadow-sm border border-zinc-100">
              <h3 className="text-xs font-black uppercase italic text-zinc-950 mb-4 flex items-center gap-2">
                <Dumbbell className="h-4 w-4 text-brand-blue" /> Por Marca
              </h3>
              <div className="flex flex-wrap gap-2">
                {brands?.map((b) => (
                  <Link
                    key={b.id}
                    href={`/produtos?marca=${b.id}${busca ? `&busca=${busca}` : ''}${objetivo ? `&objetivo=${objetivo}` : ''}`}
                    className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all ${marca === b.id ? 'border-brand-blue bg-brand-blue text-white' : 'border-zinc-100 text-zinc-400 hover:border-zinc-200'}`}
                  >
                    {b.name}
                  </Link>
                ))}
              </div>
            </div>
          </aside>

          {/* ── LISTAGEM DE PRODUTOS ── */}
          <main className="lg:col-span-3">
            {products && products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => {
                  const imgs = (product.product_images as any[]) ?? [];
                  const mainImg = imgs.sort((a: any, b: any) => a.display_order - b.display_order)[0]?.image_url;
                  const brandName = (product.brands as any)?.name;

                  return (
                    <div key={product.id} className="group bg-white flex flex-col shadow-sm hover:shadow-xl transition-all border-b-4 border-transparent hover:border-brand-blue relative">
                      
                      {/* Badge de Desconto Customizado */}
                      {product.discount_label && (
                        <div className="absolute top-4 left-4 z-10">
                          <span className="bg-brand-red text-white text-[10px] font-black px-3 py-1 uppercase italic tracking-widest shadow-lg">
                            {product.discount_label}
                          </span>
                        </div>
                      )}

                      {/* Imagem */}
                      <div className="relative aspect-square overflow-hidden bg-zinc-50">
                        {mainImg ? (
                          <Image
                            src={mainImg}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-zinc-100 text-zinc-300">
                            <Dumbbell className="h-20 w-20" />
                          </div>
                        )}
                        
                        {/* Alerta de Estoque Baixo */}
                        {product.stock_quantity < 5 && product.stock_quantity > 0 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-orange-500/90 py-2 text-center">
                            <span className="text-white text-[10px] font-black uppercase italic">Últimas {product.stock_quantity} unidades!</span>
                          </div>
                        )}
                        {product.stock_quantity === 0 && (
                          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                            <span className="bg-zinc-950 text-white px-4 py-2 font-black uppercase italic text-xs">Esgotado</span>
                          </div>
                        )}
                      </div>

                      {/* Conteúdo */}
                      <div className="p-6 flex flex-col flex-1">
                        {brandName && (
                          <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-2">
                            {brandName}
                          </span>
                        )}
                        <h3 className="font-black italic uppercase tracking-tight text-zinc-950 group-hover:text-brand-blue transition-colors leading-tight mb-6 text-lg min-h-[3.5rem] line-clamp-2">
                          {product.name}
                        </h3>
                        
                        <div className="mt-auto space-y-4">
                          <div>
                            {product.price_pix ? (
                              <>
                                <p className="text-zinc-400 text-xs font-bold line-through mb-1">
                                  R$ {Number(product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </p>
                                <div className="flex items-baseline gap-2">
                                  <span className="text-[10px] font-black text-brand-green uppercase italic">No PIX</span>
                                  <p className="text-3xl font-black italic text-zinc-950 leading-none">
                                    R$ {Number(product.price_pix).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <p className="text-3xl font-black italic text-zinc-950 leading-none">
                                R$ {Number(product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </p>
                            )}
                          </div>

                          <a 
                            href={`https://wa.me/558592994635?text=Olá! Tenho interesse no produto: ${product.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full bg-zinc-950 text-white py-4 font-black italic uppercase text-xs flex items-center justify-center gap-3 hover:bg-brand-blue transition-all ${product.stock_quantity === 0 ? 'pointer-events-none opacity-20' : ''}`}
                          >
                            <ShoppingCart className="h-4 w-4" />
                            Comprar Agora
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* ESTADO VAZIO */
              <div className="bg-white p-20 text-center border-2 border-dashed border-zinc-100">
                <Search className="h-16 w-16 text-zinc-100 mx-auto mb-6" />
                <h2 className="text-2xl font-black italic uppercase text-zinc-950 mb-2">Nenhum resultado</h2>
                <p className="text-zinc-400 font-medium normal-case">Tente ajustar seus filtros ou buscar por outro termo.</p>
                <Link href="/produtos" className="inline-flex items-center gap-2 text-brand-blue font-black uppercase italic text-xs mt-8 hover:gap-4 transition-all">
                  Limpar Filtros <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
