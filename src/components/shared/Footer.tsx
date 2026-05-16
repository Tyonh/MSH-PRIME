import Link from "next/link";
import { MessageCircle, MapPin, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Logo + Descrição */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex flex-col mb-6">
              <span className="text-4xl font-black italic tracking-tighter text-white leading-none">
                MSH <span className="text-brand-blue-light">PRIME</span>
              </span>
              <span className="text-[10px] font-black tracking-[0.3em] text-zinc-500 uppercase mt-1">
                Performance System
              </span>
            </Link>
            <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-sm">
              Suplementação de alta performance para atletas e entusiastas que buscam resultados reais. Produtos originais com garantia de qualidade.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://wa.me/558592994635"
                className="flex items-center gap-2 bg-zinc-900 hover:bg-brand-green/20 px-4 py-2 text-zinc-400 hover:text-brand-green transition-all text-[10px] font-black uppercase tracking-widest"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <a
                href="https://www.instagram.com/msh.prime/"
                className="flex items-center gap-2 bg-zinc-900 hover:bg-brand-blue/20 px-4 py-2 text-zinc-400 hover:text-brand-blue-light transition-all text-[10px] font-black uppercase tracking-widest"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                Instagram
              </a>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="text-white text-xs font-black uppercase italic tracking-widest mb-6 not-italic">
              Navegação
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Início", href: "/" },
                { label: "Produtos", href: "/produtos" },
                { label: "Objetivos", href: "/objetivos" },
                { label: "Sobre", href: "/sobre" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-white text-sm font-bold uppercase italic transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-white text-xs font-black uppercase italic tracking-widest mb-6 not-italic">
              Contato
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-zinc-400">
                <Phone className="h-4 w-4 mt-0.5 text-brand-blue-light shrink-0" />
                <span className="text-sm font-bold">(85) 99299-4635</span>
              </li>
              <li className="flex items-start gap-3 text-zinc-400">
                <MessageCircle className="h-4 w-4 mt-0.5 text-brand-green shrink-0" />
                <span className="text-sm font-bold">85 9299-4635</span>
              </li>
              <li className="flex items-start gap-3 text-zinc-400">
                <MapPin className="h-4 w-4 mt-0.5 text-brand-red shrink-0" />
                <span className="text-sm font-bold">Fortaleza, CE - Brasil</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-800 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">
            © {new Date().getFullYear()} MSH PRIME. Todos os direitos reservados.
          </p>
          <p className="text-zinc-700 text-[10px] font-bold uppercase tracking-widest">
            Suplementos 100% Originais · Entrega Nacional
          </p>
        </div>
      </div>
    </footer>
  );
}
