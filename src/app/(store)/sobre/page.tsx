import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle2, Target, Zap, Users, Trophy, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Conheça a MSH PRIME — nossa história, missão e compromisso com a suplementação de alta performance.",
};

const values = [
  {
    icon: Target,
    title: "Foco em Resultados",
    desc: "Cada produto no nosso catálogo é selecionado com base em eficácia comprovada. Sem enrolação, só resultado.",
  },
  {
    icon: CheckCircle2,
    title: "100% Originais",
    desc: "Trabalhamos apenas com fornecedores certificados. Garantia total de autenticidade em todos os produtos.",
  },
  {
    icon: Zap,
    title: "Alta Performance",
    desc: "Nossa filosofia é simples: suplementação inteligente para atletas que levam o treino a sério.",
  },
  {
    icon: Users,
    title: "Comunidade",
    desc: "Mais de 5.000 atletas confiam na MSH PRIME para evoluir. Junte-se ao time.",
  },
];

const stats = [
  { value: "5.000+", label: "Clientes Ativos" },
  { value: "150+", label: "Produtos no Catálogo" },
  { value: "3 Anos", label: "de Mercado" },
  { value: "99%", label: "Satisfação" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-zinc-950 pt-32 pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="text-[10px] font-black tracking-[0.4em] text-brand-blue-light uppercase">
              Nossa História
            </span>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white mt-2">
              Somos a MSH
              <span className="text-brand-blue-light"> PRIME</span>
            </h1>
            <p className="text-zinc-400 text-xl font-medium normal-case not-italic tracking-normal mt-6 leading-relaxed">
              Nascemos da paixão pelo esporte e da insatisfação com produtos de qualidade duvidosa no mercado. Criamos a MSH PRIME para ser diferente: transparente, eficaz e comprometida com a evolução de cada cliente.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-brand-blue py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-5xl font-black italic text-white leading-none">{stat.value}</p>
                <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-2">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Missão */}
      <section className="bg-[#f5f6f8] py-24">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[10px] font-black tracking-[0.4em] text-brand-blue uppercase">
                Missão e Valores
              </span>
              <h2 className="text-5xl font-black italic tracking-tighter text-zinc-950 mt-2 mb-8">
                Por que escolher a MSH PRIME?
              </h2>
              <p className="text-zinc-600 text-base font-medium normal-case not-italic tracking-normal leading-relaxed mb-8">
                Acreditamos que a suplementação certa, combinada com treino e nutrição adequados, pode transformar a vida de qualquer pessoa. Nossa missão é democratizar o acesso à suplementação de alta qualidade com preços justos e total transparência.
              </p>
              <div className="space-y-4">
                {["Produtos selecionados por especialistas", "Entrega rápida para todo o Brasil", "Suporte via WhatsApp 7 dias por semana", "Garantia de autenticidade em tudo"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-brand-green shrink-0" />
                    <span className="text-zinc-700 font-bold text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative h-[500px]">
                <Image
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop"
                  alt="Academia e suplementação"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              {/* Badge Flutuante */}
              <div className="absolute -bottom-6 -left-6 bg-zinc-950 text-white p-6">
                <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
                <p className="text-2xl font-black italic leading-none">Top 1%</p>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1">
                  de Satisfação
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="bg-zinc-950 py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-[10px] font-black tracking-[0.4em] text-brand-blue-light uppercase">
              O que nos move
            </span>
            <h2 className="text-5xl font-black italic tracking-tighter text-white mt-2">
              Nossos Pilares
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val) => (
              <div key={val.title} className="bg-zinc-900 p-8 border-t-4 border-brand-blue hover:border-brand-blue-light transition-colors group">
                <val.icon className="h-10 w-10 text-brand-blue-light mb-6" />
                <h3 className="text-xl font-black italic text-white mb-4 tracking-tight">
                  {val.title}
                </h3>
                <p className="text-zinc-400 text-sm font-medium normal-case not-italic tracking-normal leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-[#f5f6f8] py-24">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-black italic tracking-tighter text-zinc-950 mb-4">
            Pronto para Evoluir?
          </h2>
          <p className="text-zinc-500 text-lg font-medium normal-case not-italic tracking-normal mb-10 max-w-lg mx-auto">
            Converse com nossa equipe e descubra os melhores produtos para o seu objetivo.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/5511999999999"
              className="inline-flex items-center gap-3 bg-zinc-950 text-white px-10 py-5 font-black italic uppercase text-sm hover:bg-brand-blue transition-all"
            >
              <MessageCircle className="h-5 w-5" />
              Falar com Especialista
            </a>
            <a
              href="/produtos"
              className="inline-flex items-center gap-3 border-2 border-zinc-950 text-zinc-950 px-10 py-5 font-black italic uppercase text-sm hover:bg-zinc-950 hover:text-white transition-all"
            >
              Ver Catálogo Completo
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
