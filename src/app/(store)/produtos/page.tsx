import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Search, Filter, Dumbbell, Tag, Award, Target, ChevronLeft, ChevronRight } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import ProductFilters from "@/components/store/ProductFilters";

interface Props {
  searchParams: Promise<{
    busca?: string;
    objetivo?: string;
    marca?: string;
    categoria?: string;
    pagina?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { busca, objetivo, marca, categoria, pagina } = await searchParams;
  const supabase = createAdminClient();
  
  const currentPage = Number(pagina) || 1;
  const pageSize = 20;

  // 1. Busca dados para os filtros
  const [
    { data: objectives },
    { data: brands },
    { data: categories },
  ] = await Promise.all([
    supabase.from("objectives").select("id, name, slug").order("name"),
    supabase.from("brands").select("id, name, slug").order("name"),
    supabase.from("categories").select("id, name, slug").order("name"),
  ]);

  // 2. Query de produtos (Contagem total para paginação)
  let query = supabase
    .from("products")
    .select(`
      id,
      name,
      slug,
      price,
      price_pix,
      price_card,
      discount_label,
      stock_quantity,
      is_visible,
      product_images ( image_url, display_order ),
      brands ( id, name, slug ),
      categories ( id, name ),
      product_objectives ( objective_id )
    `, { count: "exact" })
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  if (busca) query = query.ilike("name", `%${busca}%`);
  if (marca) query = query.eq("brand_id", marca);
  if (categoria) query = query.eq("category_id", categoria);

  // Filtro de objetivo (N:N) - Infelizmente o Supabase não filtra bem N:N direto na query sem joins complexos
  // Se houver filtro de objetivo, buscaremos tudo e filtraremos em memória (para simplificar o código atual)
  // Mas para paginação real, o ideal seria uma query SQL customizada ou RPC.
  // Vamos manter a lógica de memória por enquanto, mas aplicar o range depois.
  
  const { data: allProducts, count } = await query;
  let products = allProducts ?? [];

  if (objetivo) {
    products = products.filter((p) =>
      (p.product_objectives as any[])?.some((obj: any) => obj.objective_id === objetivo)
    );
  }

  const totalCount = objetivo ? products.length : (count || 0);
  const totalPages = Math.ceil(totalCount / pageSize);
  
  // Aplica "paginação" manual se houver filtro de objetivo, ou usa o range se não houver
  const paginatedProducts = products.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Helper para manter filtros ao clicar
  const buildFilterUrl = (key: string, value: string | number) => {
    const params = new URLSearchParams();
    if (busca) params.set("busca", busca);
    if (objetivo) params.set("objetivo", objetivo);
    if (marca) params.set("marca", marca);
    if (categoria) params.set("categoria", categoria);
    
    if (key === "pagina") {
      params.set("pagina", value.toString());
    } else {
      params.set("pagina", "1"); // Reseta para pag 1 ao trocar filtro
      if (params.get(key) === value) {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    }
    const qs = params.toString();
    return `/produtos${qs ? `?${qs}` : ""}`;
  };

  const activeFilters = [objetivo, marca, categoria].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#f5f6f8] pt-24 md:pt-32 pb-12 md:pb-20">
      <div className="container mx-auto px-4 md:px-6">

        {/* Header */}
        <div className="mb-6 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-3 md:gap-4">
          <div>
            <p className="text-[8px] md:text-[10px] font-black tracking-[0.3em] md:tracking-[0.4em] text-brand-blue uppercase mb-1 md:mb-2">Linha Completa</p>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black italic tracking-tighter text-zinc-950 uppercase">
              Catálogo de <span className="text-brand-blue">Produtos</span>
            </h1>
          </div>
          {activeFilters > 0 && (
            <Link
              href="/produtos"
              className="text-[10px] font-black text-brand-red uppercase tracking-widest hover:underline"
            >
              ✕ Limpar {activeFilters} filtro{activeFilters > 1 ? "s" : ""}
            </Link>
          )}
        </div>

        <div className="grid lg:grid-cols-4 gap-6 md:gap-10">

          {/* ── FILTROS ── */}
          <aside className="lg:block lg:sticky lg:top-28 lg:h-fit space-y-4 md:space-y-6">
            {/* Mobile: filtros agrupados */}
            <div className="lg:hidden w-full">
              <Suspense fallback={<div className="h-16 bg-white animate-pulse" />}>
                <ProductFilters
                  categories={categories ?? []}
                  brands={brands ?? []}
                  objectives={objectives ?? []}
                  activeCategory={categoria}
                  activeBrand={marca}
                  activeObjective={objetivo}
                />
              </Suspense>
            </div>
            {/* Busca */}
            <div className="hidden lg:block bg-white p-5 shadow-sm border border-zinc-100">
              <h3 className="text-[10px] font-black uppercase italic text-zinc-950 mb-3 flex items-center gap-2 tracking-widest">
                <Search className="h-3.5 w-3.5 text-brand-blue" /> Buscar
              </h3>
              <form action="/produtos" method="GET">
                {objetivo && <input type="hidden" name="objetivo" value={objetivo} />}
                {marca && <input type="hidden" name="marca" value={marca} />}
                {categoria && <input type="hidden" name="categoria" value={categoria} />}
                <input
                  type="text"
                  name="busca"
                  defaultValue={busca}
                  placeholder="O QUE VOCÊ BUSCA?"
                  className="w-full bg-zinc-50 p-3 font-black text-[10px] uppercase tracking-widest focus:ring-2 focus:ring-brand-blue outline-none"
                />
              </form>
            </div>

            {/* Categorias */}
            {categories && categories.length > 0 && (
              <div className="hidden lg:block bg-white p-5 shadow-sm border border-zinc-100">
                <h3 className="text-[10px] font-black uppercase italic text-zinc-950 mb-3 flex items-center gap-2 tracking-widest">
                  <Tag className="h-3.5 w-3.5 text-purple-600" /> Categorias
                </h3>
                <div className="flex flex-col gap-1.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={buildFilterUrl("categoria", cat.id)}
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-2.5 transition-all ${
                        categoria === cat.id
                          ? "bg-purple-600 text-white"
                          : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Marcas */}
            {brands && brands.length > 0 && (
              <div className="hidden lg:block bg-white p-5 shadow-sm border border-zinc-100">
                <h3 className="text-[10px] font-black uppercase italic text-zinc-950 mb-3 flex items-center gap-2 tracking-widest">
                  <Award className="h-3.5 w-3.5 text-orange-500" /> Marcas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {brands.map((b) => (
                    <Link
                      key={b.id}
                      href={buildFilterUrl("marca", b.id)}
                      className={`px-3 py-2 text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                        marca === b.id
                          ? "border-orange-500 bg-orange-500 text-white"
                          : "border-zinc-100 text-zinc-400 hover:border-zinc-300"
                      }`}
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Objetivos */}
            {objectives && objectives.length > 0 && (
              <div className="hidden lg:block bg-white p-5 shadow-sm border border-zinc-100">
                <h3 className="text-[10px] font-black uppercase italic text-zinc-950 mb-3 flex items-center gap-2 tracking-widest">
                  <Target className="h-3.5 w-3.5 text-brand-blue" /> Objetivos
                </h3>
                <div className="flex flex-col gap-1.5">
                  {objectives.map((obj) => (
                    <Link
                      key={obj.id}
                      href={buildFilterUrl("objetivo", obj.id)}
                      className={`text-[10px] font-black uppercase tracking-widest px-3 py-2.5 transition-all ${
                        objetivo === obj.id
                          ? "bg-brand-blue text-white"
                          : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                      }`}
                    >
                      {obj.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* ── LISTAGEM ── */}
          <main className="lg:col-span-3">
            {/* Contador */}
            <div className="mb-6 flex items-center justify-between">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                {totalCount} produto{totalCount !== 1 ? "s" : ""} encontrado{totalCount !== 1 ? "s" : ""}
              </p>
              {totalPages > 1 && (
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                  Página {currentPage} de {totalPages}
                </p>
              )}
            </div>

            {paginatedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {paginatedProducts.map((product) => {
                    const imgs = (product.product_images as any[]) ?? [];
                    const mainImg = imgs.sort((a: any, b: any) => a.display_order - b.display_order)[0]?.image_url ?? null;
                    const brandName = (product.brands as any)?.name;

                    // Cálculo de preço para formato Mercado Livre (supresso de centavos)
                    const displayPrice = product.price_pix ? Number(product.price_pix) : Number(product.price);
                    const integerPart = Math.floor(displayPrice);
                    const decimalPart = Math.round((displayPrice - integerPart) * 100).toString().padStart(2, '0');

                    // Porcentagem de desconto se houver preço pix menor que o original
                    const discountPercent = product.price_pix && product.price > product.price_pix
                      ? Math.round(((product.price - product.price_pix) / product.price) * 100)
                      : null;

                    return (
                      <div key={product.id} className="group bg-white flex flex-row md:flex-col hover:shadow-lg transition-all border border-zinc-100 relative overflow-hidden">
                        
                        {/* Imagem (Quadrada 128px à esquerda no Mobile / Grid Full no Desktop, Padded via Inset) */}
                        <div className="relative aspect-square w-32 md:w-full shrink-0 overflow-hidden bg-white block border-r md:border-r-0 md:border-b border-zinc-100">
                          <Link href={`/produtos/${product.slug}`} className="absolute inset-4 block">
                            {mainImg ? (
                              <Image
                                src={mainImg}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 120px, 25vw"
                                className="object-contain group-hover:scale-105 transition-transform duration-500"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                                <Dumbbell className="h-10 w-10 text-zinc-300" />
                              </div>
                            )}
                          </Link>
                          
                          {/* Botão de Carrinho Flutuante Circular */}
                          <div className="absolute bottom-2 right-2 z-10">
                            <AddToCartButton
                              product={{
                                id: product.id,
                                name: product.name,
                                price: Number(product.price),
                                price_pix: product.price_pix ? Number(product.price_pix) : null,
                                image_url: mainImg,
                                stock_quantity: product.stock_quantity,
                              }}
                              variant="compact"
                            />
                          </div>

                          {/* Badge de Desconto */}
                          {product.discount_label && (
                            <div className="absolute top-3 left-3 z-10">
                              <span className="bg-brand-red text-white text-[9px] font-black px-2.5 py-1 uppercase italic tracking-widest shadow-md">
                                {product.discount_label}
                              </span>
                            </div>
                          )}

                          {product.stock_quantity === 0 && (
                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20">
                              <span className="bg-zinc-950 text-white px-2 py-1 font-black uppercase italic text-[8px]">Esgotado</span>
                            </div>
                          )}
                        </div>

                        {/* Conteúdo */}
                        <div className="p-3 flex flex-col flex-1 min-w-0 bg-white">
                          {/* Título de 2 Linhas */}
                          <Link href={`/produtos/${product.slug}`}>
                            <h3 className="font-normal text-zinc-900 text-xs md:text-sm leading-tight line-clamp-2 mb-1 hover:text-brand-blue transition-colors">
                              {product.name}
                            </h3>
                          </Link>

                          {/* Marca com Verificado */}
                          {brandName && (
                            <div className="flex items-center gap-1 mb-1.5">
                              <span className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest">{brandName}</span>
                              <span className="inline-flex items-center justify-center bg-brand-blue text-white rounded-full w-3.5 h-3.5 text-[7px] font-bold">✓</span>
                            </div>
                          )}

                          {/* Preços (Original e com Desconto se houver) */}
                          <div className="mt-auto">
                            {product.price_pix && product.price > product.price_pix ? (
                              <div className="space-y-0.5">
                                <p className="text-zinc-400 text-[10px] font-bold line-through">
                                  R$ {Number(product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </p>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-[9px] font-black text-brand-green uppercase italic shrink-0">No PIX</span>
                                  <p className="text-base md:text-xl font-black italic text-zinc-950 leading-none">
                                    R$ {Number(product.price_pix).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <p className="text-base md:text-xl font-black italic text-zinc-950 leading-none">
                                R$ {Number(product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                              </p>
                            )}
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center items-center gap-4">
                    {currentPage > 1 ? (
                      <Link 
                        href={buildFilterUrl("pagina", currentPage - 1)}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-100 text-zinc-950 font-black uppercase italic text-[10px] tracking-widest hover:bg-zinc-50 transition-all shadow-sm"
                      >
                        <ChevronLeft className="h-4 w-4" /> Anterior
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 px-6 py-3 bg-zinc-50 text-zinc-300 font-black uppercase italic text-[10px] tracking-widest cursor-not-allowed">
                        <ChevronLeft className="h-4 w-4" /> Anterior
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="w-10 h-10 flex items-center justify-center bg-brand-blue text-white font-black italic text-xs shadow-lg shadow-brand-blue/20">
                        {currentPage}
                      </span>
                    </div>

                    {currentPage < totalPages ? (
                      <Link 
                        href={buildFilterUrl("pagina", currentPage + 1)}
                        className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-100 text-zinc-950 font-black uppercase italic text-[10px] tracking-widest hover:bg-zinc-50 transition-all shadow-sm"
                      >
                        Próxima <ChevronRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 px-6 py-3 bg-zinc-50 text-zinc-300 font-black uppercase italic text-[10px] tracking-widest cursor-not-allowed">
                        Próxima <ChevronRight className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white p-10 md:p-20 text-center border-2 border-dashed border-zinc-100">
                <Filter className="h-10 w-10 md:h-16 md:w-16 text-zinc-100 mx-auto mb-4 md:mb-6" />
                <h2 className="text-lg md:text-2xl font-black italic uppercase text-zinc-950 mb-2">Nenhum resultado</h2>
                <p className="text-zinc-400 font-medium normal-case text-sm">Tente ajustar seus filtros.</p>
                <Link href="/produtos" className="inline-flex items-center gap-2 text-brand-blue font-black uppercase italic text-xs mt-8 hover:underline">
                  Limpar Filtros
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
