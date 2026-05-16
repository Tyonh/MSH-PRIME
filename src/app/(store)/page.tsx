import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Truck,
  MessageCircle,
  Shield,
  Flame,
  Zap,
  Dumbbell,
  Target,
} from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { AddToCartButton } from "@/components/store/AddToCartButton";

const quickCategories = [
  { name: "Proteínas",      icon: Dumbbell, color: "bg-brand-blue", href: "/produtos" },
  { name: "Energia",        icon: Zap,      color: "bg-yellow-500", href: "/produtos" },
  { name: "Emagrecimento",  icon: Flame,    color: "bg-brand-red",  href: "/produtos" },
  { name: "Ganho de Massa", icon: Target,   color: "bg-purple-600", href: "/produtos" },
];

const trustBadges = [
  { title: "Originalidade", desc: "Produtos com Garantia",                       icon: CheckCircle2 },
  { title: "Logística",     desc: "Entrega em Fortaleza e Região Metropolitana", icon: Truck        },
  { title: "Atendimento",   desc: "Suporte Especializado",                       icon: MessageCircle },
  { title: "Segurança",     desc: "Compra 100% Protegida",                       icon: Shield       },
];

export default async function HomePage() {
  const supabase = createAdminClient();

  const { data: featuredProducts } = await supabase
    .from("products")
    .select(`
      id,
      name,
      price,
      price_pix,
      stock_quantity,
      product_images ( image_url, display_order )
    `)
    .eq("is_featured", true)
    .eq("is_visible", true)
    .order("created_at", { ascending: false })
    .limit(4);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative h-[92vh] flex items-center overflow-hidden bg-zinc-950">
        <Image
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop"
          alt="Atleta MSH PRIME"
          fill
          sizes="100vw"
          className="object-cover opacity-40"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block text-[10px] font-black tracking-[0.4em] text-brand-blue-light uppercase mb-6 border border-brand-blue-light/30 px-4 py-2">
              Alta Performance
            </span>
            <h1 className="text-7xl md:text-9xl font-black text-white leading-none mb-6 italic tracking-tighter">
              ELEVE SEU<br />
              <span className="text-brand-blue-light">NÍVEL</span>
            </h1>
            <p className="text-lg text-zinc-300 mb-10 font-medium leading-relaxed max-w-lg not-italic normal-case tracking-normal">
              Suplementação de elite para quem não aceita mediocridade. Resultados reais, produtos originais.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/produtos" className="group inline-flex items-center gap-3 bg-brand-blue text-white px-10 py-5 font-black italic uppercase text-sm hover:bg-white hover:text-brand-blue transition-all">
                Ver Catálogo
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="https://wa.me/558592994635" className="inline-flex items-center gap-3 border-2 border-white/30 text-white px-8 py-5 font-black italic uppercase text-sm hover:border-brand-green hover:text-brand-green transition-all">
                <MessageCircle className="h-5 w-5" />
                Fale Conosco
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-20 bg-[#f5f6f8]" style={{ clipPath: "polygon(0 100%, 100% 40%, 100% 100%)" }} />
      </section>

      {/* ── CATEGORIAS ── */}
      <section className="py-20 bg-[#f5f6f8]">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] font-black tracking-[0.4em] text-brand-blue uppercase">Explore por objetivo</span>
            <h2 className="text-5xl font-black italic tracking-tighter text-zinc-950 mt-2">Categorias</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickCategories.map((cat) => (
              <Link key={cat.name} href={cat.href} className="group bg-white p-8 flex flex-col items-center text-center hover:bg-zinc-950 transition-all duration-300 shadow-sm hover:shadow-2xl">
                <div className={`${cat.color} p-5 mb-5 group-hover:scale-110 transition-transform`}>
                  <cat.icon className="h-8 w-8 text-white" />
                </div>
                <span className="font-black italic uppercase text-zinc-950 group-hover:text-white transition-colors tracking-tight text-lg">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="bg-zinc-950 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustBadges.map((badge) => (
              <div key={badge.title} className="flex items-center gap-4">
                <badge.icon className="h-10 w-10 text-brand-blue-light shrink-0" />
                <div>
                  <p className="text-white font-black italic uppercase text-sm leading-none">{badge.title}</p>
                  <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-1">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUTOS EM DESTAQUE ── */}
      <section className="py-24 bg-[#f5f6f8]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-[10px] font-black tracking-[0.4em] text-brand-blue uppercase">Os favoritos da galera</span>
              <h2 className="text-5xl md:text-6xl font-black italic tracking-tighter text-zinc-950 mt-2">Mais Vendidos</h2>
            </div>
            <Link href="/produtos" className="group inline-flex items-center gap-2 border-2 border-zinc-950 text-zinc-950 px-8 py-3 font-black italic uppercase text-sm hover:bg-zinc-950 hover:text-white transition-all">
              Ver Todos
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => {
                const imgs = (product.product_images as { image_url: string; display_order: number }[]) ?? [];
                const mainImg = imgs.sort((a, b) => a.display_order - b.display_order)[0]?.image_url ?? null;
                return (
                  <div key={product.id} className="group bg-white flex flex-col shadow-sm hover:shadow-xl transition-all border-b-4 border-transparent hover:border-brand-blue">
                    <div className="relative aspect-square overflow-hidden bg-zinc-50">
                      {mainImg ? (
                        <Image
                          src={mainImg}
                          alt={product.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-100">
                          <Dumbbell className="h-16 w-16 text-zinc-300" />
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="font-black italic uppercase tracking-tight text-zinc-950 group-hover:text-brand-blue transition-colors leading-tight mb-4 text-base">
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
            <div className="text-center py-16 border-2 border-dashed border-zinc-200 bg-white">
              <Dumbbell className="h-16 w-16 text-zinc-200 mx-auto mb-4" />
              <p className="text-zinc-400 font-black italic uppercase tracking-widest">
                Nenhum produto em destaque ainda.
              </p>
              <p className="text-zinc-300 text-sm font-bold mt-2 normal-case not-italic">
                Marque produtos como &quot;Em Destaque&quot; no painel administrativo.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA WHATSAPP ── */}
      <section className="bg-brand-blue py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-black italic text-white mb-6 tracking-tighter">
            Dúvidas? <span className="text-white/60">Fale</span><br />com a gente!
          </h2>
          <p className="text-white/70 text-lg mb-10 font-medium normal-case tracking-normal not-italic">
            Nossa equipe está pronta para te ajudar a escolher o suplemento ideal.
          </p>
          <a href="https://wa.me/558592994635" className="inline-flex items-center gap-3 bg-white text-brand-blue px-10 py-5 font-black italic uppercase text-sm hover:bg-zinc-950 hover:text-white transition-all shadow-2xl">
            <MessageCircle className="h-6 w-6" />
            Chamar no WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
