// Tipos do domínio My Wallet
// Centraliza as estruturas de dados usadas na aplicação.

export type TipoLancamento = "receita" | "despesa";

// Estrutura de um lançamento financeiro
export interface Lancamento {
  id: string;
  valor: number; // valor em reais (positivo)
  tipo: TipoLancamento; // receita aumenta saldo, despesa diminui
  metodoPagamento: string; // ex: "Crédito", "Débito", "Pix", "Dinheiro"
  estabelecimento: string; // ex: "Bar do Zé"
  categoria: string; // ex: "Alimentação"
  data: string; // formato ISO "YYYY-MM-DD"
  hora: string; // formato "HH:MM"
  descricao?: string;
  parcelas: number; // 1 = à vista
  recorrencia: string; // ex: "Não", "Mensal", "Semanal"
  criadoEm: string; // ISO timestamp
}

// Opções fixas usadas nos selects
export const METODOS_PAGAMENTO = [
  "Dinheiro",
  "Pix",
  "Débito",
  "Crédito",
  "Boleto",
  "Transferência",
];

export const CATEGORIAS = [
  "Alimentação",
  "Moradia",
  "Transporte",
  "Saúde",
  "Educação",
  "Lazer",
  "Compras",
  "Investimento",
  "Salário",
  "Outros",
];

export const RECORRENCIAS = ["Não", "Diária", "Semanal", "Mensal", "Anual"];
