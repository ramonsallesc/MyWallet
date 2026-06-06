// Hook que gerencia o estado dos lançamentos.
// Centraliza leitura/escrita para que vários componentes
// fiquem em sincronia (saldo, tabela, gráficos).

import { useCallback, useEffect, useState } from "react";
import type { Lancamento } from "@/lib/wallet/types";
import {
  adicionarLancamento as addStorage,
  carregarLancamentos,
} from "@/lib/wallet/storage";

export function useLancamentos() {
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);

  // Carrega ao montar (no cliente)
  useEffect(() => {
    setLancamentos(carregarLancamentos());
  }, []);

  // Adiciona um novo lançamento e atualiza o estado
  const adicionar = useCallback((novo: Lancamento) => {
    const lista = addStorage(novo);
    setLancamentos(lista);
  }, []);

  // Calcula o saldo atual: receitas - despesas
  const saldo = lancamentos.reduce((acc, l) => {
    return l.tipo === "receita" ? acc + l.valor : acc - l.valor;
  }, 0);

  return { lancamentos, adicionar, saldo };
}
