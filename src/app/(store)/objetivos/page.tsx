import type { Metadata } from "next";
import Link from "next/link";
import { Dumbbell, Flame, Zap, Target, Heart, Brain, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Objetivos",
  description: "Encontre os suplementos certos para o seu objetivo: ganho de massa, emagrecimento, energia, força e mais.",
};

const objectives = [
  {
    id: "massa",
    name: "Ganho de Massa",
    tagline: "Construa músculos com ciência",
    description:
      "Hipercalóricos, Whey Proteins e Creatina para quem quer aumentar o volume muscular com eficiência e qualidade.",
    icon: Dumbbell,
    color: "bg-brand-blue",
    hoverColor: "group-hover:bg-brand-blue",
    accentColor: "text-brand-blue",
    borderColor: "border-brand-blue",
    products: ["Hipercalórico 3KG", "100% Pure Whey", "Creatina Monohidratada", "BCAA 2400"],
    href: "/produtos?objetivo=massa",
  },
  {
    id: "emagrecimento",
    name: "Emagrecimento",
    tagline: "Queime gordura, preserve músculo",
    description:
      "Termogênicos, L-Carnitina e proteínas de baixo carboidrato para acelerar o metabolismo e manter a massa magra.",
    icon: Flame,
    color: "bg-brand-red",
    hoverColor: "group-hover:bg-brand-red",
    accentColor: "text-brand-red",
    borderColor: "border-brand-red",
    products: ["Termogênico Max", "L-Carnitina 3000", "Whey Isolado Zero Carbo", "CLA 1000"],
    href: "/produtos?objetivo=emagrecimento",
  },
  {
    id: "energia",
    name: "Energia e Performance",
    tagline: "Mais explosão em cada treino",
    description:
      "Pré-treinos, cafeína e complexos energéticos para treinar mais forte, por mais tempo e com foco máximo.",
    icon: Zap,
    color: "bg-yellow-500",
    hoverColor: "group-hover:bg-yellow-500",
    accentColor: "text-yellow-600",
    borderColor: "border-yellow-500",
    products: ["Horus Pre-Workout", "Cafeína 200mg", "Beta-Alanina", "Maltodextrina"],
    href: "/produtos?objetivo=energia",
  },
  {
    id: "forca",
    name: "Força e Resistência",
    tagline: "Supere seus limites",
    description:
      "Creatina, Beta-Alanina e suplementos para aumentar a força máxima, resistência muscular e recuperação.",
    icon: Target,
    color: "bg-purple-600",
    hoverColor: "group-hover:bg-purple-600",
    accentColor: "text-purple-600",
    borderColor: "border-purple-600",
    products: ["Creatina Monohidratada", "Beta-Alanina", "Arginina", "ZMA Complex"],
    href: "/produtos?objetivo=forca",
  },
  {
    id: "recuperacao",
    name: "Recuperação",
    tagline: "Recupere-se para evoluir",
    description:
      "BCAA, Glutamina e vitaminas para reduzir o catabolismo, acelerar a recuperação e voltar ao treino mais forte.",
    icon: Heart,
    color: "bg-brand-green",
    hoverColor: "group-hover:bg-brand-green",
    accentColor: "text-brand-green",
    borderColor: "border-brand-green",
    products: ["BCAA 2400", "Glutamina Powder", "Vitamina C 1000", "Ômega 3"],
    href: "/produtos?objetivo=recuperacao",
  },
  {
    id: "saude",
    name: "Saúde Geral",
    tagline: "Cuide de dentro para fora",
    description:
      "Vitaminas, minerais e suplementos para manter a saúde em dia e apoiar a performance no dia a dia.",
    icon: Brain,
    color: "bg-teal-600",
    hoverColor: "group-hover:bg-teal-600",
    accentColor: "text-teal-600",
    borderColor: "border-teal-600",
    products: ["Multivitamínico", "Ômega 3", "Vitamina D3+K2", "Magnésio"],
    href: "/produtos?objetivo=saude",
  },
];

export default function ObjectivesPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-zinc-950 pt-32 pb-20">
        <div className="container mx-auto px-6">
          <span className="text-[10px] font-black tracking-[0.4em] text-brand-blue-light uppercase">
            Encontre o seu caminho
          </span>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter text-white mt-2 max-w-3xl">
            Qual é o seu
            <span className="text-brand-blue-light"> Objetivo?</span>
          </h1>
          <p className="text-zinc-400 text-lg font-medium normal-case not-italic tracking-normal mt-6 max-w-xl">
            Cada meta exige uma estratégia diferente. Selecione o seu objetivo e encontre os suplementos certos para a sua jornada.
          </p>
        </div>
      </section>

      {/* Grid de Objetivos */}
      <section className="bg-[#f5f6f8] py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objectives.map((obj) => (
              <Link
                key={obj.id}
                href={obj.href}
                className="group bg-white border-b-4 border-transparent hover:border-brand-blue shadow-sm hover:shadow-2xl transition-all flex flex-col"
              >
                {/* Topo Colorido */}
                <div className={`${obj.color} p-8 flex items-center justify-between`}>
                  <obj.icon className="h-12 w-12 text-white" />
                  <ArrowRight className="h-6 w-6 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>

                {/* Conteúdo */}
                <div className="p-8 flex flex-col flex-1">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${obj.accentColor} mb-2`}>
                    {obj.tagline}
                  </span>
                  <h2 className="text-2xl font-black italic tracking-tighter text-zinc-950 group-hover:text-brand-blue transition-colors mb-4">
                    {obj.name}
                  </h2>
                  <p className="text-zinc-500 text-sm font-medium normal-case not-italic tracking-normal leading-relaxed mb-6">
                    {obj.description}
                  </p>

                  {/* Produtos Sugeridos */}
                  <div className="mt-auto">
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">
                      Produtos recomendados:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {obj.products.map((p) => (
                        <span
                          key={p}
                          className="px-2 py-1 bg-zinc-100 text-zinc-600 text-[10px] font-bold uppercase"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-zinc-950 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-black italic tracking-tighter text-white mb-4">
            Não sabe por onde começar?
          </h2>
          <p className="text-zinc-400 text-lg font-medium normal-case not-italic tracking-normal mb-10">
            Nossa equipe especializada te ajuda a montar o protocolo ideal para os seus objetivos.
          </p>
          <a
            href="https://wa.me/558592994635"
            className="inline-flex items-center gap-3 bg-brand-green text-white px-10 py-5 font-black italic uppercase text-sm hover:bg-white hover:text-brand-green transition-all shadow-2xl"
          >
            Falar com Especialista
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>
    </>
  );
}
