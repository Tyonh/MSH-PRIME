import { createClient } from "@/lib/supabase/server";
import { createCategory, deleteCategory } from "@/lib/actions/catalog";
import { DeleteItemButton } from "@/components/admin/DeleteItemButton";
import { Plus, Tag } from "lucide-react";

export default async function CategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, created_at")
    .order("name");

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Painel Admin</p>
        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-zinc-950">Categorias</h1>
        <p className="text-zinc-500 text-sm font-medium normal-case not-italic mt-2">
          Categorias são usadas para organizar os produtos no catálogo (ex: Proteínas, Aminoácidos).
        </p>
      </div>

      {/* Formulário de Criação */}
      <div className="bg-white p-6 shadow-sm border border-zinc-100">
        <h2 className="text-base font-black italic uppercase tracking-tight text-zinc-950 mb-4">Nova Categoria</h2>
        <form
          action={async (formData) => {
            "use server";
            await createCategory(formData);
          }}
          className="flex gap-3"
        >
          <div className="flex-1 relative">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              name="name"
              type="text"
              required
              placeholder="Ex: Proteínas"
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 font-bold text-zinc-950 focus:ring-2 focus:ring-brand-blue outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-brand-blue text-white font-black italic uppercase text-sm flex items-center gap-2 hover:bg-zinc-900 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </button>
        </form>
      </div>

      {/* Lista */}
      <div className="bg-white shadow-sm border border-zinc-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-zinc-100">
              <th className="px-6 py-4 font-black uppercase italic text-[10px] tracking-widest text-zinc-400">Nome</th>
              <th className="px-6 py-4 font-black uppercase italic text-[10px] tracking-widest text-zinc-400">Slug</th>
              <th className="px-6 py-4 text-right font-black uppercase italic text-[10px] tracking-widest text-zinc-400">Ação</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((cat) => (
              <tr key={cat.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                <td className="px-6 py-4 font-black italic uppercase text-zinc-950">{cat.name}</td>
                <td className="px-6 py-4 text-zinc-400 text-xs font-bold font-mono">{cat.slug}</td>
                <td className="px-6 py-4 text-right">
                  <DeleteItemButton id={cat.id} name={cat.name} onDelete={deleteCategory} />
                </td>
              </tr>
            ))}
            {(!categories || categories.length === 0) && (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-zinc-400 font-bold text-sm">
                  Nenhuma categoria cadastrada ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
