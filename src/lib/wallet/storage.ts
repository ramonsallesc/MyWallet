// Camada de armazenamento dos lançamentos.
// Hoje usa localStorage. No futuro, basta trocar estas funções
// por chamadas ao Supabase mantendo a mesma assinatura.

import type { Lancamento } from "./types";

const STORAGE_KEY = "my-wallet:lancamentos";

// Lê todos os lançamentos do navegador
export function carregarLancamentos(): Lancamento[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Lancamento[];
  } catch {
    return [];
  }
}

// Salva a lista completa (mais simples que update item a item)
export function salvarLancamentos(lista: Lancamento[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
}

// Adiciona um novo lançamento à lista existente
export function adicionarLancamento(novo: Lancamento): Lancamento[] {
  const atual = carregarLancamentos();
  const lista = [novo, ...atual];
  salvarLancamentos(lista);
  return lista;
}
