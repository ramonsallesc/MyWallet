// Página simples reutilizada por Faturas, Categorias, Contas e Cartões.
// Apenas exibe "Em desenvolvimento" enquanto essas áreas ainda não existem.

import { Sidebar } from "@/components/wallet/sidebar";

export function PaginaEmDesenvolvimento({ titulo }: { titulo: string }) {
  return (
    <div className="min-h-screen bg-background px-3 sm:px-4 lg:p-6 pb-28 lg:pb-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 max-w-[1600px] mx-auto">
        <Sidebar />
        <main className="flex-1 bg-card rounded-3xl p-8 lg:p-12 shadow-sm flex flex-col items-center justify-center text-center min-h-[60vh] mt-4 lg:mt-0">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">{titulo}</h1>
          <p className="text-muted-foreground">Em desenvolvimento.</p>
        </main>
      </div>
    </div>
  );
}
