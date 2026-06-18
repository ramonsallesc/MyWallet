// Formulário para criar um novo lançamento financeiro.
// Mantém o estado localmente e chama "onRegistrar" ao salvar.

import { useState } from "react";
import { ArrowUp, X } from "lucide-react";
import type { Lancamento, TipoLancamento } from "@/lib/wallet/types";
import {
  CATEGORIAS,
  METODOS_PAGAMENTO,
  RECORRENCIAS,
} from "@/lib/wallet/types";
import { parseValor } from "@/lib/wallet/format";
import { toast } from "sonner";

interface Props {
  onRegistrar: (novo: Lancamento) => void;
}

// Estado inicial do formulário (também usado pelo botão "Limpar")
const estadoInicial = {
  valor: "",
  tipo: "despesa" as TipoLancamento,
  metodoPagamento: "",
  estabelecimento: "",
  categoria: "",
  data: new Date().toISOString().slice(0, 10), // YYYY-MM-DD de hoje
  hora: new Date().toTimeString().slice(0, 5), // HH:MM
  descricao: "",
  parcelas: "1",
  recorrencia: "Não",
};

export function FormularioLancamento({ onRegistrar }: Props) {
  const [form, setForm] = useState(estadoInicial);

  // Helper para atualizar um campo do formulário
  function set<K extends keyof typeof estadoInicial>(
    chave: K,
    valor: (typeof estadoInicial)[K],
  ) {
    setForm((f) => ({ ...f, [chave]: valor }));
  }

  function limpar() {
    setForm(estadoInicial);
  }

  // Formata valor como moeda brasileira
  function formatarValor(valor: string): string {
    // Remove tudo que não é dígito
    const apenasNumeros = valor.replace(/\D/g, "");
    
    // Se vazio, retorna vazio
    if (!apenasNumeros) return "";
    
    // Converte para número e formata (ex: 12345 → "123,45")
    const numeroFormatado = (parseInt(apenasNumeros, 10) / 100)
      .toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    
    return numeroFormatado;
  }

  function limpar() {
    setForm(estadoInicial);
  }

  function registrar(e: React.FormEvent) {
    e.preventDefault();

    // Validação simples dos campos obrigatórios
    const valorNum = parseValor(form.valor);
    if (valorNum <= 0) {
      toast.error("Informe um valor maior que zero.");
      return;
    }
    if (!form.metodoPagamento) {
      toast.error("Selecione o método de pagamento.");
      return;
    }
    if (!form.categoria) {
      toast.error("Selecione uma categoria.");
      return;
    }
    if (!form.estabelecimento.trim()) {
      toast.error("Informe o estabelecimento.");
      return;
    }

    const novo: Lancamento = {
      id: crypto.randomUUID(),
      valor: valorNum,
      tipo: form.tipo,
      metodoPagamento: form.metodoPagamento,
      estabelecimento: form.estabelecimento.trim(),
      categoria: form.categoria,
      data: form.data,
      hora: form.hora,
      descricao: form.descricao.trim() || undefined,
      parcelas: parseInt(form.parcelas, 10) || 1,
      recorrencia: form.recorrencia,
      criadoEm: new Date().toISOString(),
    };

    onRegistrar(novo);
    toast.success("Lançamento registrado com sucesso!");
    limpar();
  }

  // Classes reutilizadas dos inputs (mantém visual consistente)
  const inputCls =
    "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition";
  const labelCls = "block text-sm font-medium text-foreground mb-1.5";

  return (
    <form onSubmit={registrar} className="bg-card rounded-3xl p-4 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-5">
        Criar lançamento
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Valor */}
        <div>
          <label className={labelCls}>Valor (R$)</label>
          <input
            type="text"
            inputMode="numeric"
            placeholder="0,00"
            value={form.valor}
            onChange={(e) => set("valor", formatarValor(e.target.value))}
            className={`${inputCls}`}
          />
        </div>

        {/* Categoria */}
        <div>
          <label className={labelCls}>Categoria</label>
          <select
            value={form.categoria}
            onChange={(e) => set("categoria", e.target.value)}
            className={`${inputCls}`}
          >
            <option value="">Selecionar...</option>
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Estabelecimento */}
        <div>
          <label className={labelCls}>Estabelecimento</label>
          <input
            type="text"
            placeholder="Ex: Bar do Zé"
            value={form.estabelecimento}
            onChange={(e) => set("estabelecimento", e.target.value)}
            className={`${inputCls}`}
          />
        </div>

        {/* Método de pagamento */}
        <div>
          <label className={labelCls}>Método de pagamento</label>
          <select
            value={form.metodoPagamento}
            onChange={(e) => set("metodoPagamento", e.target.value)}
            className={`${inputCls}`}
          >
            <option value="">Selecionar...</option>
            {METODOS_PAGAMENTO.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

          {/* Data + Hora (lado a lado) */}
          <div className="flex gap-1 min-w-0">
            <div className="flex-[1.3]  min-w-0">
            <label className={labelCls}>Data</label>
              <input
                type="date"
                value={form.data}
                onChange={(e) => set("data", e.target.value)}
                className={`${inputCls} w-full`}
              />
            </div>
            <div className="flex-1 min-w-0">
            <label className={labelCls}>Hora</label>
            <input
              type="time"
              value={form.hora}
              onChange={(e) => set("hora", e.target.value)}
              className={`${inputCls} w-full`}
            />
            </div>
          </div>

        {/* Descrição */}
        <div>
          <label className={labelCls}>Descrição</label>
          <input
            type="text"
            placeholder="Opcional"
            value={form.descricao}
            onChange={(e) => set("descricao", e.target.value)}
            className={`${inputCls}`}
          />
        </div>

        {/* Parcelas */}
        <div>
          <label className={labelCls}>Parcelas</label>
          <select
            value={form.parcelas}
            onChange={(e) => set("parcelas", e.target.value)}
            className={`${inputCls}`}
          >
            <option value="1">À vista</option>
            {[2, 3, 4, 5, 6, 10, 12, 18, 24].map((n) => (
              <option key={n} value={n}>
                {n}x
              </option>
            ))}
          </select>
        </div>

        {/* Recorrência */}
        <div>
          <label className={labelCls}>Recorrência</label>
          <select
            value={form.recorrencia}
            onChange={(e) => set("recorrencia", e.target.value)}
            className={`${inputCls}`}
          >
            {RECORRENCIAS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo (receita/despesa) + Botões */}
        <div className="flex flex-col justify-end gap-3">
          {/* Toggle tipo */}
          <div className="grid grid-cols-2 gap-1 p-1 bg-muted rounded-xl">
            <button
              type="button"
              onClick={() => set("tipo", "despesa")}
              className={`py-2 text-sm font-medium rounded-lg transition ${
                form.tipo === "despesa"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Despesa
            </button>
            <button
              type="button"
              onClick={() => set("tipo", "receita")}
              className={`py-2 text-sm font-medium rounded-lg transition ${
                form.tipo === "receita"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Receita
            </button>
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-medium hover:opacity-90 transition shadow-sm"
        >
          <ArrowUp className="w-4 h-4" />
          Registrar
        </button>
        <button
          type="button"
          onClick={limpar}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted text-foreground font-medium hover:bg-muted/70 transition"
        >
          <X className="w-4 h-4" />
          Limpar
        </button>
      </div>
    </form>
  );
}
