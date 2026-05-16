"use client";

import { useState } from "react";
import {
  Package, DollarSign, Database, Image as ImageIcon,
  Type, Target, ArrowLeft, Save, Tag, Award,
  CreditCard, Banknote, Percent, Info, Trash2
} from "lucide-react";
import { createProduct, updateProduct, deleteProductImage } from "@/lib/actions/products";
import Link from "next/link";

interface SelectOption { id: string; name: string; }

interface ProductData {
  id:             string;
  name:           string;
  description:    string | null;
  price:          number;
  price_pix:      number | null;
  price_card:     number | null;
  discount_label: string | null;
  stock_quantity: number;
  is_visible:     boolean;
  is_featured:    boolean;
  category_id:    string | null;
  brand_id:       string | null;
  current_objective_id: string | null;
  current_image_url:    string | null;
  images?:        { image_url: string; display_order: number }[];
}

interface Props {
  categories:  SelectOption[];
  brands:      SelectOption[];
  objectives:  SelectOption[];
  product?:    ProductData; // undefined = criar novo
}

export default function ProductForm({ categories, brands, objectives, product }: Props) {
  const isEdit = !!product;
  const [previews, setPreviews] = useState<string[]>(
    product?.images?.map(img => img.image_url) ?? (product?.current_image_url ? [product.current_image_url] : [])
  );

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newPreviews: string[] = [];
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === files.length) {
          setPreviews(prev => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteImage = async (imageUrl: string) => {
    if (!product) return;
    if (!confirm("Tem certeza que deseja excluir esta foto?")) return;

    const result = await deleteProductImage(product.id, imageUrl);
    if (result?.success) {
      setPreviews(prev => prev.filter(p => p !== imageUrl));
    } else {
      alert(result?.error || "Erro ao excluir imagem");
    }
  };

  const handleSubmit = async (formData: FormData) => {
    if (isEdit) {
      const result = await updateProduct(product.id, formData);
      if (result?.error) alert(result.error);
    } else {
      const result = await createProduct(formData);
      if (result?.error) alert(result.error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 text-zinc-500 hover:text-brand-blue transition-colors font-bold uppercase italic text-xs tracking-widest"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-950">
          {isEdit ? `Editar: ${product.name}` : "Novo Produto"}
        </h1>
      </div>

      <form action={handleSubmit} className="grid md:grid-cols-3 gap-8">

        {/* ── Coluna Esquerda ── */}
        <div className="md:col-span-1 space-y-6">

          {/* Upload de Imagens */}
          <div className="bg-white p-6 shadow-sm border border-zinc-100">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 block">
              Fotos do Produto (múltiplas)
            </label>

            {/* Grid de previews */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-4">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square bg-zinc-50 border border-zinc-200 overflow-hidden group">
                    <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-contain p-2" />
                    <div className="absolute top-1 left-1 bg-zinc-950/70 text-white text-[10px] font-black px-1.5 py-0.5 z-10">
                      {i + 1}
                    </div>
                    {/* Botão de Excluir (apenas se for edição e a imagem não for um preview local recém-adicionado) */}
                    {isEdit && src.startsWith("http") && (
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(src)}
                        className="absolute top-1 right-1 bg-brand-red text-white p-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                        title="Excluir imagem"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Botão de adicionar */}
            <div className="relative bg-zinc-50 border-2 border-dashed border-zinc-200 p-6 text-center cursor-pointer hover:border-brand-blue transition-colors">
              <ImageIcon className="h-8 w-8 text-zinc-300 mx-auto mb-2" />
              <p className="text-[10px] font-bold text-zinc-400 uppercase">Clique para adicionar fotos</p>
              <p className="text-[8px] text-zinc-300 font-bold mt-1">A primeira será a foto principal</p>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Flags */}
          <div className="bg-white p-6 shadow-sm border border-zinc-100 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="is_visible" defaultChecked={product?.is_visible ?? true} className="h-5 w-5 accent-brand-blue" />
              <div>
                <span className="text-sm font-black uppercase italic text-zinc-950 block">Visível no Site</span>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Exibe no catálogo</span>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="is_featured" defaultChecked={product?.is_featured ?? false} className="h-5 w-5 accent-yellow-500" />
              <div>
                <span className="text-sm font-black uppercase italic text-zinc-950 block">Em Destaque</span>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Aparece na Home</span>
              </div>
            </label>
          </div>
        </div>

        {/* ── Coluna Direita ── */}
        <div className="md:col-span-2 space-y-6">

          {/* Dados Básicos */}
          <div className="bg-white p-8 shadow-sm border border-zinc-100 space-y-6">
            <h2 className="font-black italic uppercase text-zinc-950 tracking-tight text-lg border-b border-zinc-100 pb-4">
              Informações do Produto
            </h2>

            {/* Nome */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Type className="h-3 w-3" /> Nome *
              </label>
              <input
                name="name"
                type="text"
                defaultValue={product?.name}
                placeholder="EX: 100% PURE WHEY 900G"
                required
                className="w-full bg-zinc-50 p-4 font-black text-lg uppercase italic focus:ring-2 focus:ring-brand-blue outline-none text-zinc-950"
              />
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Descrição</label>
              <textarea
                name="description"
                rows={4}
                defaultValue={product?.description ?? ""}
                className="w-full bg-zinc-50 p-4 font-medium text-zinc-700 focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                placeholder="Benefícios, modo de uso, composição..."
              />
            </div>

            {/* Estoque */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Database className="h-3 w-3" /> Estoque *
              </label>
              <input
                name="stock"
                type="number"
                min="0"
                defaultValue={product?.stock_quantity ?? 0}
                className="w-full bg-zinc-50 p-4 font-black text-lg focus:ring-2 focus:ring-brand-blue outline-none text-zinc-950"
                required
              />
            </div>
          </div>

          {/* Preços */}
          <div className="bg-white p-8 shadow-sm border border-zinc-100 space-y-6">
            <h2 className="font-black italic uppercase text-zinc-950 tracking-tight text-lg border-b border-zinc-100 pb-4">
              Precificação
            </h2>

            {/* Preço Base */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <DollarSign className="h-3 w-3" /> Preço Base / De (R$) *
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.price}
                placeholder="0.00"
                required
                className="w-full bg-zinc-50 p-4 font-black text-lg focus:ring-2 focus:ring-brand-blue outline-none text-zinc-950"
              />
              <p className="text-[10px] text-zinc-400 font-bold italic flex items-center gap-1">
                <Info className="h-3 w-3" /> Preço original. Usado como referência para cálculo de desconto.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Preço PIX */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Banknote className="h-3 w-3 text-brand-green" /> Preço PIX / à vista (R$)
                </label>
                <input
                  name="price_pix"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={product?.price_pix ?? ""}
                  placeholder="0.00"
                  className="w-full bg-green-50 border border-green-200 p-4 font-black text-lg focus:ring-2 focus:ring-brand-green outline-none text-zinc-950"
                />
                <p className="text-[10px] text-brand-green font-black uppercase">✓ Melhor preço para o cliente</p>
              </div>

              {/* Preço Cartão */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <CreditCard className="h-3 w-3 text-brand-blue" /> Preço no Cartão (R$)
                </label>
                <input
                  name="price_card"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={product?.price_card ?? ""}
                  placeholder="0.00"
                  className="w-full bg-blue-50 border border-blue-200 p-4 font-black text-lg focus:ring-2 focus:ring-brand-blue outline-none text-zinc-950"
                />
                <p className="text-[10px] text-brand-blue font-black uppercase">Parcelado no cartão</p>
              </div>
            </div>

            {/* Badge de Desconto */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Percent className="h-3 w-3 text-brand-red" /> Badge / Aviso de Desconto
              </label>
              <input
                name="discount_label"
                type="text"
                defaultValue={product?.discount_label ?? ""}
                placeholder="Ex: 20% OFF, LANÇAMENTO, QUEIMA DE ESTOQUE, PROMOÇÃO"
                className="w-full bg-red-50 border border-red-200 p-4 font-black italic uppercase text-zinc-950 focus:ring-2 focus:ring-brand-red outline-none"
              />
              <p className="text-[10px] text-zinc-400 font-bold italic flex items-center gap-1">
                <Info className="h-3 w-3" /> Texto exibido no badge vermelho do produto. Deixe vazio para não exibir.
              </p>
              {/* Preview do badge */}
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Preview:</span>
                <span className="bg-brand-red text-white text-[10px] font-black px-3 py-1 badge-skew">
                  20% OFF
                </span>
                <span className="bg-brand-blue text-white text-[10px] font-black px-3 py-1 italic uppercase">
                  LANÇAMENTO
                </span>
              </div>
            </div>
          </div>

          {/* Classificação */}
          <div className="bg-white p-8 shadow-sm border border-zinc-100 space-y-6">
            <h2 className="font-black italic uppercase text-zinc-950 tracking-tight text-lg border-b border-zinc-100 pb-4">
              Classificação
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Package className="h-3 w-3" /> Categoria
                </label>
                <select
                  name="category_id"
                  defaultValue={product?.category_id ?? ""}
                  className="w-full bg-zinc-50 p-4 font-bold text-zinc-700 text-xs focus:ring-2 focus:ring-brand-blue outline-none cursor-pointer"
                >
                  <option value="">Sem categoria</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Award className="h-3 w-3" /> Marca
                </label>
                <select
                  name="brand_id"
                  defaultValue={product?.brand_id ?? ""}
                  className="w-full bg-zinc-50 p-4 font-bold text-zinc-700 text-xs focus:ring-2 focus:ring-brand-blue outline-none cursor-pointer"
                >
                  <option value="">Sem marca</option>
                  {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Target className="h-3 w-3" /> Objetivo Principal
              </label>
              <select
                name="objective_id"
                defaultValue={product?.current_objective_id ?? ""}
                className="w-full bg-zinc-50 p-4 font-bold text-zinc-700 text-xs focus:ring-2 focus:ring-brand-blue outline-none cursor-pointer"
              >
                <option value="">Sem objetivo específico</option>
                {objectives.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-blue text-white py-5 font-black uppercase italic text-lg flex items-center justify-center gap-3 hover:bg-zinc-900 transition-all shadow-xl shadow-brand-blue/20"
          >
            <Save className="h-6 w-6" />
            {isEdit ? "Salvar Alterações" : "Criar Produto"}
          </button>
        </div>
      </form>
    </div>
  );
}
