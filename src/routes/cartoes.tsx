import { createFileRoute } from "@tanstack/react-router";
import { PaginaEmDesenvolvimento } from "@/components/wallet/pagina-em-desenvolvimento";

export const Route = createFileRoute("/cartoes")({
  component: () => <PaginaEmDesenvolvimento titulo="Cartões" />,
});
