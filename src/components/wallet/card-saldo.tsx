// Card do saldo atual.
// Mostra/oculta o valor através de um botão de "olho".

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { formatarReal, ocultarValor } from "@/lib/wallet/format";

interface Props {
  saldo: number;
}

export function CardSaldo({ saldo }: Props) {
  // Por padrão o saldo inicia oculto (conforme requisito)
  const [visivel, setVisivel] = useState(false);

  return (
    <div className="bg-card rounded-3xl p-4 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="text-base font-semibold text-foreground">Saldo atual</h2>
        <button
          type="button"
          onClick={() => setVisivel((v) => !v)}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label={visivel ? "Ocultar saldo" : "Mostrar saldo"}
        >
          {visivel ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-4xl font-bold tracking-tight text-foreground">
        {visivel ? formatarReal(saldo) : ocultarValor()}
      </p>
    </div>
  );
}
