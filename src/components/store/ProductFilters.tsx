"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tag, Award, Target } from "lucide-react";

interface FilterItem {
  id: string;
  name: string;
}

interface ProductFiltersProps {
  categories: FilterItem[];
  brands: FilterItem[];
  objectives: FilterItem[];
  activeCategory?: string;
  activeBrand?: string;
  activeObjective?: string;
}

export default function ProductFilters({
  categories,
  brands,
  objectives,
  activeCategory = "",
  activeBrand = "",
  activeObjective = "",
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSelectChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pagina", "1");
    if (value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    const qs = params.toString();
    router.push(`/produtos${qs ? `?${qs}` : ""}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
      {/* Categorias */}
      {categories && categories.length > 0 && (
        <div className="relative w-full">
          <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest mb-1.5 flex items-center gap-1">
            <Tag className="h-3 w-3 text-purple-600" /> Categoria
          </label>
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => handleSelectChange("categoria", e.target.value)}
              className="w-full bg-white border border-zinc-100 p-3.5 font-bold uppercase text-[10px] tracking-widest text-zinc-700 focus:ring-2 focus:ring-brand-blue outline-none shadow-sm cursor-pointer appearance-none pr-10 rounded-none"
            >
              <option value="">TODAS AS CATEGORIAS</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 font-bold text-[8px]">
              ▼
            </div>
          </div>
        </div>
      )}

      {/* Marcas */}
      {brands && brands.length > 0 && (
        <div className="relative w-full">
          <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest mb-1.5 flex items-center gap-1">
            <Award className="h-3 w-3 text-orange-500" /> Marca
          </label>
          <div className="relative">
            <select
              value={activeBrand}
              onChange={(e) => handleSelectChange("marca", e.target.value)}
              className="w-full bg-white border border-zinc-100 p-3.5 font-bold uppercase text-[10px] tracking-widest text-zinc-700 focus:ring-2 focus:ring-brand-blue outline-none shadow-sm cursor-pointer appearance-none pr-10 rounded-none"
            >
              <option value="">TODAS AS MARCAS</option>
              {brands.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 font-bold text-[8px]">
              ▼
            </div>
          </div>
        </div>
      )}

      {/* Objetivos */}
      {objectives && objectives.length > 0 && (
        <div className="relative w-full">
          <label className="text-[9px] font-black uppercase text-zinc-400 tracking-widest mb-1.5 flex items-center gap-1">
            <Target className="h-3 w-3 text-brand-blue" /> Objetivo
          </label>
          <div className="relative">
            <select
              value={activeObjective}
              onChange={(e) => handleSelectChange("objetivo", e.target.value)}
              className="w-full bg-white border border-zinc-100 p-3.5 font-bold uppercase text-[10px] tracking-widest text-zinc-700 focus:ring-2 focus:ring-brand-blue outline-none shadow-sm cursor-pointer appearance-none pr-10 rounded-none"
            >
              <option value="">TODOS OS OBJETIVOS</option>
              {objectives.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.name.toUpperCase()}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 font-bold text-[8px]">
              ▼
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
