import { createAdminClient } from "@/lib/supabase/admin";
import { createObjective, deleteObjective } from "@/lib/actions/catalog";
import { DeleteItemButton } from "@/components/admin/DeleteItemButton";
import { Plus, Target } from "lucide-react";

export default async function ObjectivesPage() {
  const admin = createAdminClient();
  const { data: objectives } = await admin
    .from("objectives")
    .select("id, name, slug, created_at")
    .order("name");

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">Painel Admin</p>
        <h1 className="text-4xl font-black italic tracking-tighter uppercase text-zinc-950">Objetivos</h1>
        <p className="text-zinc-500 text-sm font-medium normal-case not-italic mt-2">
          Objetivos são usados para filtrar produtos por meta (ex: Ganho de Massa, Emagrecimento, Energia).
        </p>
      </div>

      {/* Formulário de Criação */}
      <div className="bg-white p-6 shadow-sm border border-zinc-100">
        <h2 className="text-base font-black italic uppercase tracking-tight text-zinc-950 mb-4">Novo Objetivo</h2>
        <form
          action={async (formData) => {
            "use server";
            await createObjective(formData);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="flex-1 relative">
            <Target className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              name="name"
              type="text"
              required
              placeholder="Ex: Ganho de Massa"
              className="w-full pl-12 pr-4 py-3 bg-zinc-50 font-bold text-zinc-950 focus:ring-2 focus:ring-brand-blue outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-brand-blue text-white font-black italic uppercase text-sm flex items-center justify-center gap-2 hover:bg-zinc-900 transition-colors w-full sm:w-auto shrink-0"
          >
            <Plus className="h-4 w-4" />
            Adicionar
          </button>
        </form>
      </div>

      {/* Listagem */}
      {objectives && objectives.length > 0 ? (
        <>
          {/* Tabela Desktop */}
          <div className="hidden md:block bg-white shadow-sm border border-zinc-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-zinc-100">
                  <th className="px-6 py-4 font-black uppercase italic text-[10px] tracking-widest text-zinc-400">Nome</th>
                  <th className="px-6 py-4 font-black uppercase italic text-[10px] tracking-widest text-zinc-400">Slug</th>
                  <th className="px-6 py-4 text-right font-black uppercase italic text-[10px] tracking-widest text-zinc-400">Ação</th>
                </tr>
              </thead>
              <tbody>
                {objectives.map((obj) => (
                  <tr key={obj.id} className="border-b border-zinc-50 hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4 font-black italic uppercase text-zinc-950">{obj.name}</td>
                    <td className="px-6 py-4 text-zinc-400 text-xs font-bold font-mono">{obj.slug}</td>
                    <td className="px-6 py-4 text-right">
                      <DeleteItemButton id={obj.id} name={obj.name} onDelete={deleteObjective} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lista Mobile */}
          <div className="md:hidden space-y-3">
            {objectives.map((obj) => (
              <div key={obj.id} className="bg-white p-4 border border-zinc-100 flex items-center justify-between shadow-sm">
                <div className="min-w-0 flex-1 pr-4">
                  <p className="font-black italic uppercase text-sm text-zinc-950 truncate">{obj.name}</p>
                  <p className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate">{obj.slug}</p>
                </div>
                <div className="shrink-0">
                  <DeleteItemButton id={obj.id} name={obj.name} onDelete={deleteObjective} />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white p-12 border border-zinc-100 shadow-sm text-center text-zinc-400 font-bold text-sm">
          Nenhum objetivo cadastrado ainda.
        </div>
      )}
    </div>
  );
}
