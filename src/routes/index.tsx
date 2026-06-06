// Página inicial (Home) do My Wallet.
// Reúne sidebar, saldo, formulário, tabela e painel de gráficos.

import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/wallet/sidebar";
import { CardSaldo } from "@/components/wallet/card-saldo";
import { FormularioLancamento } from "@/components/wallet/formulario-lancamento";
import { TabelaTransacoes } from "@/components/wallet/tabela-transacoes";
import { PainelGraficos } from "@/components/wallet/painel-graficos";
import { useLancamentos } from "@/hooks/use-lancamentos";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My Wallet — Controle financeiro pessoal" },
      {
        name: "description",
        content:
          "Gerencie seus lançamentos, acompanhe seu saldo e visualize gráficos das suas finanças.",
      },
      { property: "og:title", content: "My Wallet" },
      {
        property: "og:description",
        content: "Controle financeiro pessoal simples e elegante.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  // Estado global da home: lançamentos + saldo
  const { lancamentos, adicionar, saldo } = useLancamentos();

  return (
    <div className="min-h-screen bg-background px-3 sm:px-4 lg:p-6 pb-28 lg:pb-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 max-w-[1600px] mx-auto">
        {/* Coluna 1 — Sidebar (desktop) / Header + bottom nav (mobile) */}
        <Sidebar />

        {/* Coluna 2 — Conteúdo principal */}
        <main className="flex-1 flex flex-col gap-4 lg:gap-6 min-w-0 mt-4 lg:mt-0">
          <CardSaldo saldo={saldo} />
          <FormularioLancamento onRegistrar={adicionar} />
          <TabelaTransacoes lancamentos={lancamentos} />
        </main>

        {/* Coluna 3 — Painel de gráficos */}
        <PainelGraficos lancamentos={lancamentos} />
      </div>
    </div>
  );
}
