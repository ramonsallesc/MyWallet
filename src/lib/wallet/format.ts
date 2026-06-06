// Utilitários de formatação para valores monetários em Real (R$).

// Formata número como moeda brasileira: 1234.5 -> "R$ 1.234,50"
export function formatarReal(valor: number): string {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Versão oculta do saldo (para o botão de ocultar)
export function ocultarValor(): string {
  return "R$ ••••••";
}

// Converte string "1.234,56" digitada pelo usuário em número 1234.56
export function parseValor(texto: string): number {
  if (!texto) return 0;
  const limpo = texto.replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
  const n = parseFloat(limpo);
  return isNaN(n) ? 0 : n;
}
