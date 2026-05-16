import { signUp } from "@/lib/actions/auth";
import { ShieldAlert, User, Mail, Lock } from "lucide-react";
import Link from "next/link";

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <span className="text-4xl font-[1000] italic tracking-tighter leading-none text-white block mb-2">
            MSH <span className="text-brand-blue-light">ADMIN</span>
          </span>
          <span className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase">
            Criar Nova Conta Administrativa
          </span>
        </div>

        <div className="bg-zinc-900 p-8 border-t-4 border-brand-blue shadow-2xl">
          <form action={signUp} className="space-y-6">
            {error && (
              <div className="bg-brand-red/10 border border-brand-red/20 p-4 flex items-center gap-3 text-brand-red text-xs font-black uppercase italic">
                <ShieldAlert className="h-5 w-5" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Nome Completo</label>
              <div className="relative">
                <input 
                  name="name"
                  type="text" 
                  required
                  className="w-full bg-zinc-800 border-none p-4 text-white font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                  placeholder="Seu Nome"
                />
                <User className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">E-mail</label>
              <div className="relative">
                <input 
                  name="email"
                  type="email" 
                  required
                  className="w-full bg-zinc-800 border-none p-4 text-white font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                  placeholder="exemplo@mshprime.com.br"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Senha</label>
              <div className="relative">
                <input 
                  name="password"
                  type="password" 
                  required
                  className="w-full bg-zinc-800 border-none p-4 text-white font-bold focus:ring-2 focus:ring-brand-blue outline-none"
                  placeholder="••••••••"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600" />
              </div>
            </div>

            <button className="w-full bg-brand-blue text-white py-4 font-black uppercase italic text-sm hover:bg-white hover:text-brand-blue transition-all transform hover:-translate-y-1 shadow-lg shadow-brand-blue/20">
              Registrar Conta
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/admin/login" className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
              Já tem uma conta? Faça login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
