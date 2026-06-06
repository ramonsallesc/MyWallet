// Painel direito com gráficos: receitas x despesas e distribuição por categoria.
// Usa dados reais quando existem; complementa com dados fictícios para
// preencher o painel até que o usuário tenha histórico suficiente.

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { Lancamento } from "@/lib/wallet/types";
import { formatarReal } from "@/lib/wallet/format";

interface Props {
  lancamentos: Lancamento[];
}

// Cores dos gráficos (consistentes com o design system)
const CORES_PIZZA = [
  "oklch(0.25 0.05 160)",
  "oklch(0.4 0.1 160)",
  "oklch(0.6 0.15 145)",
  "oklch(0.83 0.22 142)",
  "oklch(0.9 0.1 142)",
];

export function PainelGraficos({ lancamentos }: Props) {
  // Agrupa receitas e despesas por mês do ano atual
  const dadosBarras = useMemo(() => {
    const meses = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez",
    ];
    const ano = new Date().getFullYear();
    const acc = meses.map((m) => ({ mes: m, receita: 0, despesa: 0 }));

    lancamentos.forEach((l) => {
      const d = new Date(l.data);
      if (d.getFullYear() !== ano) return;
      const idx = d.getMonth();
      if (l.tipo === "receita") acc[idx].receita += l.valor;
      else acc[idx].despesa += l.valor;
    });

    // Se tudo zerado, adiciona dados fictícios para preview
    const algumValor = acc.some((m) => m.receita > 0 || m.despesa > 0);
    if (!algumValor) {
      return meses.map((m, i) => ({
        mes: m,
        receita: 3000 + Math.round(Math.random() * 4000),
        despesa: 1500 + Math.round(Math.random() * 3500),
      }));
    }
    return acc;
  }, [lancamentos]);

  // Agrupa despesas por categoria (para o donut)
  const dadosPizza = useMemo(() => {
    const mapa = new Map<string, number>();
    lancamentos
      .filter((l) => l.tipo === "despesa")
      .forEach((l) => {
        mapa.set(l.categoria, (mapa.get(l.categoria) ?? 0) + l.valor);
      });

    const lista = Array.from(mapa, ([nome, valor]) => ({ nome, valor }))
      .sort((a, b) => b.valor - a.valor)
      .slice(0, 5);

    if (lista.length === 0) {
      // Dados fictícios para preview
      return [
        { nome: "Moradia", valor: 2100 },
        { nome: "Alimentação", valor: 525 },
        { nome: "Educação", valor: 420 },
        { nome: "Lazer", valor: 280 },
        { nome: "Transporte", valor: 175 },
      ];
    }
    return lista;
  }, [lancamentos]);

  const totalDespesa = dadosPizza.reduce((s, d) => s + d.valor, 0);

  return (
    <aside className="w-full lg:w-80 xl:w-96 lg:shrink-0 flex flex-col gap-4 lg:gap-6">
      {/* Card principal de gráficos */}
      <div className="bg-card rounded-3xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Gráficos</h2>
          <span className="text-xs text-muted-foreground">Este ano</span>
        </div>

        {/* Receita x Despesa */}
        <div className="mb-6">
          <p className="text-xs text-muted-foreground mb-1">Receita x Despesa</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dadosBarras} barCategoryGap={4}>
                <XAxis
                  dataKey="mes"
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(v: number) => formatarReal(v)}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="receita" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="despesa" fill="var(--secondary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut de despesas por categoria */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Despesas por categoria</p>
          <div className="relative h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dadosPizza}
                  dataKey="valor"
                  nameKey="nome"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="none"
                >
                  {dadosPizza.map((_, i) => (
                    <Cell key={i} fill={CORES_PIZZA[i % CORES_PIZZA.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatarReal(v)} />
              </PieChart>
            </ResponsiveContainer>
            {/* Total no centro */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-muted-foreground">Total despesas</span>
              <span className="text-lg font-bold text-foreground">
                {formatarReal(totalDespesa)}
              </span>
            </div>
          </div>

          {/* Legenda manual */}
          <ul className="mt-4 space-y-2">
            {dadosPizza.map((d, i) => {
              const pct = totalDespesa > 0 ? Math.round((d.valor / totalDespesa) * 100) : 0;
              return (
                <li key={d.nome} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="inline-flex items-center justify-center w-9 h-6 rounded-full text-[10px] font-semibold text-primary-foreground"
                      style={{ backgroundColor: CORES_PIZZA[i % CORES_PIZZA.length] }}
                    >
                      {pct}%
                    </span>
                    <span className="text-foreground">{d.nome}</span>
                  </div>
                  <span className="font-medium text-foreground">
                    {formatarReal(d.valor)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Espaços reservados para futuros gráficos */}
      <FutureCard titulo="Cashflow anual" />
      <FutureCard titulo="Limites vs gastos" />
      <FutureCard titulo="Últimas faturas" />
    </aside>
  );
}

// Card placeholder para os próximos gráficos da roadmap
function FutureCard({ titulo }: { titulo: string }) {
  return (
    <div className="bg-card rounded-3xl p-4 sm:p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-foreground mb-2">{titulo}</h3>
      <div className="h-24 rounded-xl bg-muted/60 flex items-center justify-center text-xs text-muted-foreground">
        Em breve
      </div>
    </div>
  );
}
