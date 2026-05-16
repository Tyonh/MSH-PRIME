import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { AddToCartButton } from "@/components/store/AddToCartButton";
import ProductGallery from "@/components/store/ProductGallery";
import { ArrowLeft, Check, ShieldCheck, Truck, Zap } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailsPage({ params }: Props) {
  const { slug } = await params;
  const supabase = createAdminClient();

  const { data: product } = await supabase
    .from("products")
    .select(`
      *,
      brands ( name, slug ),
      categories ( name, slug ),
      product_images ( image_url, display_order )
    `)
    .eq("slug", slug)
    .eq("is_visible", true)
    .single();

  if (!product) return notFound();

  const images = (product.product_images as any[])?.sort((a, b) => a.display_order - b.display_order) ?? [];
  const brandName = (product.brands as any)?.name;
  const categoryName = (product.categories as any)?.name;

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-32 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Breadcrumb / Voltar */}
        <div className="mb-8">
          <Link 
            href="/produtos" 
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-brand-blue font-black uppercase italic text-[10px] tracking-widest transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o catálogo
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Galeria */}
          <div className="relative">
             <ProductGallery images={images} productName={product.name} />
          </div>

          {/* Informações */}
          <div className="flex flex-col">
            <div className="mb-6">
              {product.discount_label && (
                <div className="mb-4">
                  <span className="bg-brand-red text-white text-[10px] font-black px-4 py-1.5 uppercase italic tracking-widest shadow-lg">
                    {product.discount_label}
                  </span>
                </div>
              )}
              {brandName && (
                <span className="text-xs font-black text-brand-blue uppercase tracking-widest mb-2 block">
                  {brandName}
                </span>
              )}
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-zinc-950 leading-none mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="bg-zinc-100 text-zinc-500 text-[10px] font-black px-3 py-1 uppercase tracking-widest">
                  {categoryName}
                </span>
                {product.stock_quantity > 0 ? (
                  <span className="text-brand-green text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                    <Check className="h-3 w-3" /> em estoque
                  </span>
                ) : (
                  <span className="text-brand-red text-[10px] font-black uppercase tracking-widest">Esgotado</span>
                )}
              </div>
            </div>

            {/* Preços */}
            <div className="bg-[#f5f6f8] p-8 border-l-4 border-brand-blue mb-8">
              {product.price_pix ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-zinc-400 text-sm font-bold line-through mb-1">
                      De: R$ {Number(product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-5xl font-black italic text-zinc-950 leading-none">
                        R$ {Number(product.price_pix).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                      <span className="bg-brand-green text-white text-[10px] font-black px-2 py-1 uppercase italic">No PIX</span>
                    </div>
                  </div>
                  <p className="text-zinc-500 text-xs font-bold">
                    Ou R$ {Number(product.price_card || product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} em até 12x no cartão
                  </p>
                </div>
              ) : (
                <p className="text-5xl font-black italic text-zinc-950 leading-none">
                  R$ {Number(product.price).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </p>
              )}
            </div>

            {/* Ações */}
            <div className="mb-10">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  price: Number(product.price),
                  price_pix: product.price_pix ? Number(product.price_pix) : null,
                  image_url: images[0]?.image_url,
                  stock_quantity: product.stock_quantity,
                }}
              />
            </div>

            {/* Selos de Confiança */}
            <div className="grid grid-cols-2 gap-4 pt-10 border-t border-zinc-100">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-brand-blue" />
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest leading-tight">Entrega Rápida em Fortaleza</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-brand-green" />
                <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest leading-tight">Produto 100% Original</span>
              </div>
            </div>
          </div>
        </div>

        {/* Descrição Detalhada */}
        {product.description && (
          <div className="mt-20 pt-20 border-t border-zinc-100 max-w-3xl">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-950 mb-8">
              Sobre o <span className="text-brand-blue">Produto</span>
            </h2>
            <div className="prose prose-zinc max-w-none">
              <p className="text-zinc-600 font-medium leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
