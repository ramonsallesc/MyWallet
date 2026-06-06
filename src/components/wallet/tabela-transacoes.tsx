// Tabela das últimas transações registradas.
// Permite busca por texto, filtro por categoria e ordenação por data.

import { useMemo, useState } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import type { Lancamento } from "@/lib/wallet/types";
import { CATEGORIAS } from "@/lib/wallet/types";
import { formatarReal } from "@/lib/wallet/format";

interface Props {
  lancamentos: Lancamento[];
}

type Ordem = "recente" | "antigo";

export function TabelaTransacoes({ lancamentos }: Props) {
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState<string>("todas");
  const [ordem, setOrdem] = useState<Ordem>("recente");

  // Aplica filtros e ordenação. useMemo evita reprocessar a cada render.
  const filtradas = useMemo(() => {
    let lista = [...lancamentos];

    // Filtro por categoria
    if (categoria !== "todas") {
      lista = lista.filter((l) => l.categoria === categoria);
    }

    // Busca textual (estabelecimento, descrição, método)
    if (busca.trim()) {
      const q = busca.toLowerCase();
      lista = lista.filter(
        (l) =>
          l.estabelecimento.toLowerCase().includes(q) ||
          (l.descricao ?? "").toLowerCase().includes(q) ||
          l.metodoPagamento.toLowerCase().includes(q),
      );
    }

    // Ordenação por data + hora
    lista.sort((a, b) => {
      const da = `${a.data}T${a.hora}`;
      const db = `${b.data}T${b.hora}`;
      return ordem === "recente" ? db.localeCompare(da) : da.localeCompare(db);
    });

    return lista;
  }, [lancamentos, busca, categoria, ordem]);

  const inputCls =
    "px-4 py-2 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition";

  return (
    <div className="bg-card rounded-3xl p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-5">
        Últimas transações
      </h2>

      {/* Barra de filtros */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar transação..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className={`${inputCls} pl-9 w-full`}
          />
        </div>

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className={inputCls}
        >
          <option value="todas">Todas categorias</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setOrdem((o) => (o === "recente" ? "antigo" : "recente"))}
          className={`${inputCls} inline-flex items-center gap-2 hover:bg-muted`}
        >
          <ArrowUpDown className="w-4 h-4" />
          {ordem === "recente" ? "Mais recentes" : "Mais antigas"}
        </button>
      </div>

      {/* Estado vazio */}
      {filtradas.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          Nenhuma transação encontrada.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground uppercase tracking-wide">
                <th className="py-3 px-2 font-medium">Data</th>
                <th className="py-3 px-2 font-medium">Estabelecimento</th>
                <th className="py-3 px-2 font-medium">Categoria</th>
                <th className="py-3 px-2 font-medium">Método</th>
                <th className="py-3 px-2 font-medium">Descrição</th>
                <th className="py-3 px-2 font-medium text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map((l) => (
                <tr
                  key={l.id}
                  className="border-t border-border hover:bg-muted/40 transition-colors"
                >
                  <td className="py-3 px-2">
                    <div className="font-medium text-foreground">
                      {new Date(l.data).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="text-xs text-muted-foreground">{l.hora}</div>
                  </td>
                  <td className="py-3 px-2 font-medium text-foreground">
                    {l.estabelecimento}
                  </td>
                  <td className="py-3 px-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-accent text-accent-foreground text-xs font-medium">
                      {l.categoria}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">
                    {l.metodoPagamento}
                  </td>
                  <td className="py-3 px-2 text-muted-foreground max-w-[200px] truncate">
                    {l.descricao ?? "—"}
                  </td>
                  <td
                    className={`py-3 px-2 text-right font-semibold ${
                      l.tipo === "receita" ? "text-success" : "text-destructive"
                    }`}
                  >
                    {l.tipo === "receita" ? "+" : "-"}
                    {formatarReal(l.valor)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
