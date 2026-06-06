// Navegação adaptativa.
// - Desktop (lg+): barra lateral vertical à esquerda.
// - Mobile/tablet: cabeçalho compacto no topo + barra de abas fixa no rodapé.

import { Link, useRouterState } from "@tanstack/react-router";
import { Home, FileText, Tags, Wallet, CreditCard } from "lucide-react";

// Lista de itens do menu — fácil de estender no futuro.
const itens = [
  { titulo: "Home", url: "/", icone: Home },
  { titulo: "Faturas", url: "/faturas", icone: FileText },
  { titulo: "Categorias", url: "/categorias", icone: Tags },
  { titulo: "Contas", url: "/contas", icone: Wallet },
  { titulo: "Cartões", url: "/cartoes", icone: CreditCard },
];

// Logo reutilizado nas duas variantes
function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center">
        <Wallet className="w-5 h-5 text-primary" />
      </div>
      <span className="text-xl font-bold tracking-tight text-foreground">
        My Wallet
      </span>
    </div>
  );
}

export function Sidebar() {
  // Pega a rota atual para destacar o item selecionado
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <>
      {/* ============== MOBILE / TABLET ============== */}
      {/* Cabeçalho fixo no topo apenas com o logo */}
      <header className="lg:hidden sticky top-0 z-30 -mx-3 sm:-mx-4 px-3 sm:px-4 py-3 bg-background/90 backdrop-blur-md border-b border-border">
        <Logo />
      </header>

      {/* Barra de abas fixa no rodapé (estilo app mobile) */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-card border-t border-border px-2 py-2 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]"
        // Respeita o safe-area de iPhones
        style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))" }}
      >
        <ul className="flex items-center justify-around max-w-md mx-auto">
          {itens.map((item) => {
            const ativo = pathname === item.url;
            const Icone = item.icone;
            return (
              <li key={item.url} className="flex-1">
                <Link
                  to={item.url}
                  className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-xl transition-colors ${
                    ativo
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-10 h-7 rounded-full transition-colors ${
                      ativo ? "bg-primary text-primary-foreground" : ""
                    }`}
                  >
                    <Icone className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-medium leading-none">
                    {item.titulo}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ============== DESKTOP ============== */}
      <aside className="hidden lg:block lg:w-64 lg:shrink-0 lg:min-h-[calc(100vh-2rem)] bg-card rounded-3xl p-6 shadow-sm">
        <div className="mb-10 px-2">
          <Logo />
        </div>

        <nav className="flex flex-col gap-2">
          {itens.map((item) => {
            const ativo = pathname === item.url;
            const Icone = item.icone;
            return (
              <Link
                key={item.url}
                to={item.url}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-colors font-medium ${
                  ativo
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icone className="w-5 h-5" />
                <span>{item.titulo}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
