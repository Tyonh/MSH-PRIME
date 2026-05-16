import { signUp } from "@/lib/actions/auth";
import { ShieldAlert, User, Mail, Lock, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6 relative overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-block bg-white p-3 mb-6 transform -skew-x-12">
            <span className="text-4xl font-[1000] italic tracking-tighter leading-none text-zinc-950 block transform skew-x-12">
              MSH <span className="text-brand-blue text-gradient-blue">PRIME</span>
            </span>
          </div>
          <h2 className="text-[10px] font-[1000] tracking-[0.4em] text-zinc-500 uppercase flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-zinc-800"></span>
            Novo Administrador
            <span className="h-px w-8 bg-zinc-800"></span>
          </h2>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-sm p-1 shadow-2xl border border-zinc-800">
          <div className="bg-zinc-900 p-8 border-t-4 border-brand-blue">
            <form action={signUp} className="space-y-6">
              {error && (
                <div className="bg-brand-red/10 border-l-4 border-brand-red p-4 flex items-center gap-3 text-brand-red text-[10px] font-black uppercase italic tracking-wider">
                  <ShieldAlert className="h-5 w-5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-[1000] text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <User className="h-3 w-3" /> Nome de Exibição
                </label>
                <div className="relative">
                  <input 
                    name="name"
                    type="text" 
                    required
                    className="w-full bg-zinc-800/50 border border-zinc-800 p-4 text-white font-bold focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all placeholder:text-zinc-600"
                    placeholder="Nome Completo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-[1000] text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="h-3 w-3" /> E-mail Corporativo
                </label>
                <div className="relative">
                  <input 
                    name="email"
                    type="email" 
                    required
                    className="w-full bg-zinc-800/50 border border-zinc-800 p-4 text-white font-bold focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all placeholder:text-zinc-600"
                    placeholder="admin@mshprime.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-[1000] text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Lock className="h-3 w-3" /> Senha Segura
                </label>
                <div className="relative">
                  <input 
                    name="password"
                    type="password" 
                    required
                    className="w-full bg-zinc-800/50 border border-zinc-800 p-4 text-white font-bold focus:ring-2 focus:ring-brand-blue focus:border-transparent outline-none transition-all placeholder:text-zinc-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button className="group w-full bg-zinc-950 text-white py-4 font-[1000] uppercase italic text-sm hover:bg-brand-blue transition-all transform hover:-translate-y-1 shadow-lg shadow-black/20 flex items-center justify-center gap-2 border border-zinc-800">
                Criar Conta Admin
                <ShieldCheck className="h-5 w-5 group-hover:text-white transition-colors" />
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-800/50 text-center">
              <Link href="/admin/login" className="text-zinc-500 hover:text-brand-blue text-[10px] font-[1000] uppercase tracking-[0.2em] transition-all">
                Já possui acesso? Faça Login
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-center text-zinc-700 text-[10px] font-black uppercase tracking-[0.3em] leading-relaxed">
            Área Reservada <span className="text-zinc-800 mx-2">|</span> Auditoria Ativa
          </p>
        </div>
      </div>
    </div>
  );
}

