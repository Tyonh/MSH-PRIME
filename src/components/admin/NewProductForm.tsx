"use client";

import { createProduct } from "@/lib/actions/products";
import {
  Package, DollarSign, Database, Image as ImageIcon,
  Type, Target, ArrowLeft, Save, Tag
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface SelectOption { id: string; name: string }

interface Props {
  categories:  SelectOption[];
  brands:      SelectOption[];
  objectives:  SelectOption[];
}

export default function NewProductForm({ categories, brands, objectives }: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
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
          Voltar para Lista
        </Link>
        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-950">Novo Produto</h1>
      </div>

      <form
        action={async (formData) => {
          const result = await createProduct(formData);
          if (result?.error) alert(result.error);
        }}
        className="grid md:grid-cols-3 gap-8"
      >
        {/* ── Coluna Esquerda: Imagem e Flags ── */}
        <div className="md:col-span-1 space-y-6">
          {/* Upload de Imagem */}
          <div className="bg-white p-6 shadow-sm border border-zinc-100">
            <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 block">
              Foto do Produto
            </label>
            <div className="relative aspect-square bg-zinc-50 border-2 border-dashed border-zinc-200 flex items-center justify-center overflow-hidden">
              {preview ? (
                <img src={preview} alt="Preview" className="w-full h-full object-contain p-4" />
              ) : (
                <div className="text-center p-6">
                  <ImageIcon className="h-10 w-10 text-zinc-300 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-zinc-400 uppercase">Selecione uma imagem</p>
                </div>
              )}
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
            <p className="mt-3 text-[10px] text-zinc-400 font-medium italic">
              Recomendado: 1000×1000px, fundo branco.
            </p>
          </div>

          {/* Flags */}
          <div className="bg-white p-6 shadow-sm border border-zinc-100 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="is_visible" defaultChecked className="h-5 w-5 accent-brand-blue" />
              <div>
                <span className="text-sm font-black uppercase italic text-zinc-950 block">Visível no Site</span>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Exibe no catálogo</span>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="is_featured" className="h-5 w-5 accent-yellow-500" />
              <div>
                <span className="text-sm font-black uppercase italic text-zinc-950 block">Produto em Destaque</span>
                <span className="text-[10px] text-zinc-400 font-bold uppercase">Aparece na Home</span>
              </div>
            </label>
          </div>
        </div>

        {/* ── Coluna Direita: Dados ── */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-8 shadow-sm border border-zinc-100 space-y-6">

            {/* Nome */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Type className="h-3 w-3" /> Nome do Produto *
              </label>
              <input
                name="name"
                type="text"
                placeholder="EX: 100% PURE WHEY 900G"
                className="w-full bg-zinc-50 p-4 font-black text-lg uppercase italic focus:ring-2 focus:ring-brand-blue outline-none text-zinc-950"
                required
              />
            </div>

            {/* Preço + Estoque */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <DollarSign className="h-3 w-3" /> Preço (R$) *
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="w-full bg-zinc-50 p-4 font-black text-lg focus:ring-2 focus:ring-brand-blue outline-none text-zinc-950"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Database className="h-3 w-3" /> Estoque *
                </label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  className="w-full bg-zinc-50 p-4 font-black text-lg focus:ring-2 focus:ring-brand-blue outline-none text-zinc-950"
                  required
                />
              </div>
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Descrição</label>
              <textarea
                name="description"
                rows={4}
                className="w-full bg-zinc-50 p-4 font-medium text-zinc-700 focus:ring-2 focus:ring-brand-blue outline-none resize-none"
                placeholder="Benefícios, modo de uso, composição..."
              />
            </div>

            {/* Categoria + Marca */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Package className="h-3 w-3" /> Categoria
                </label>
                <select
                  name="category_id"
                  className="w-full bg-zinc-50 p-4 font-bold text-zinc-700 text-xs focus:ring-2 focus:ring-brand-blue outline-none cursor-pointer"
                >
                  <option value="">Sem categoria</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Tag className="h-3 w-3" /> Marca
                </label>
                <select
                  name="brand_id"
                  className="w-full bg-zinc-50 p-4 font-bold text-zinc-700 text-xs focus:ring-2 focus:ring-brand-blue outline-none cursor-pointer"
                >
                  <option value="">Sem marca</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Objetivo */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                <Target className="h-3 w-3" /> Objetivo Principal
              </label>
              <select
                name="objective_id"
                className="w-full bg-zinc-50 p-4 font-bold text-zinc-700 text-xs focus:ring-2 focus:ring-brand-blue outline-none cursor-pointer"
              >
                <option value="">Sem objetivo específico</option>
                {objectives.map((o) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-brand-blue text-white py-5 font-black uppercase italic text-lg flex items-center justify-center gap-3 hover:bg-zinc-900 transition-all shadow-xl shadow-brand-blue/20"
            >
              <Save className="h-6 w-6" />
              Salvar Produto
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
