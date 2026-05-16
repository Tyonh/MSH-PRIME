import Image from "next/image";
import Link from "next/link";
import { Search, Filter, Dumbbell, Tag, Award, Target } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { AddToCartButton } from "@/components/store/AddToCartButton";

interface Props {
  searchParams: Promise<{
    busca?: string;
    objetivo?: string;
    marca?: string;
    categoria?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const { busca, objetivo, marca, categoria } = await searchParams;
  const supabase = createAdminClient();

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

  // 2. Query de produtos
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
    `)
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  if (busca) query = query.ilike("name", `%${busca}%`);
  if (marca) query = query.eq("brand_id", marca);
  if (categoria) query = query.eq("category_id", categoria);

  const { data: allProducts } = await query;

  // Filtro de objetivo (N:N — feito em memória)
  let products = allProducts ?? [];
  if (objetivo) {
    products = products.filter((p) =>
      (p.product_objectives as any[])?.some((obj: any) => obj.objective_id === objetivo)
    );
  }

  // Helper para manter filtros ao clicar
  const buildFilterUrl = (key: string, value: string) => {
    const params = new URLSearchParams();
    if (busca) params.set("busca", busca);
    if (objetivo) params.set("objetivo", objetivo);
    if (marca) params.set("marca", marca);
    if (categoria) params.set("categoria", categoria);
    // Toggle: se já selecionado, remove; se não, define
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    return `/produtos${qs ? `?${qs}` : ""}`;
  };

  const activeFilters = [objetivo, marca, categoria].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#f5f6f8] pt-32 pb-20">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black tracking-[0.4em] text-brand-blue uppercase mb-2">Linha Completa</p>
            <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-zinc-950 uppercase">
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

        <div className="grid lg:grid-cols-4 gap-10">

          {/* ── SIDEBAR FILTROS ── */}
          <aside className="space-y-6">
            {/* Busca */}
            <div className="bg-white p-5 shadow-sm border border-zinc-100">
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
              <div className="bg-white p-5 shadow-sm border border-zinc-100">
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
              <div className="bg-white p-5 shadow-sm border border-zinc-100">
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
              <div className="bg-white p-5 shadow-sm border border-zinc-100">
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
                {products.length} produto{products.length !== 1 ? "s" : ""} encontrado{products.length !== 1 ? "s" : ""}
              </p>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => {
                  const imgs = (product.product_images as any[]) ?? [];
                  const mainImg = imgs.sort((a: any, b: any) => a.display_order - b.display_order)[0]?.image_url ?? null;
                  const brandName = (product.brands as any)?.name;

                  return (
                    <div key={product.id} className="group bg-white flex flex-col shadow-sm hover:shadow-xl transition-all border-b-4 border-transparent hover:border-brand-blue relative">

                      {/* Badge de Desconto */}
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
                          <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                            <Dumbbell className="h-20 w-20 text-zinc-300" />
                          </div>
                        )}
                        {product.stock_quantity > 0 && product.stock_quantity < 5 && (
                          <div className="absolute bottom-0 left-0 right-0 bg-orange-500/90 py-2 text-center">
                            <span className="text-white text-[10px] font-black uppercase italic">Últimas {product.stock_quantity} un!</span>
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
                          <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-2">{brandName}</span>
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

                          <AddToCartButton
                            product={{
                              id: product.id,
                              name: product.name,
                              price: Number(product.price),
                              price_pix: product.price_pix ? Number(product.price_pix) : null,
                              image_url: mainImg,
                              stock_quantity: product.stock_quantity,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white p-20 text-center border-2 border-dashed border-zinc-100">
                <Filter className="h-16 w-16 text-zinc-100 mx-auto mb-6" />
                <h2 className="text-2xl font-black italic uppercase text-zinc-950 mb-2">Nenhum resultado</h2>
                <p className="text-zinc-400 font-medium normal-case">Tente ajustar seus filtros ou buscar por outro termo.</p>
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
