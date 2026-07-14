import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Candidate } from '../data/mock';

// ─── Tipo resultado ────────────────────────────────────────────────────────────
export interface WaPrescreeningResult {
  score: number;
  status: 'continua' | 'pendiente' | 'rechazado';
  resumen: string;
  noNegociables: { label: string; score: number; evidencia: string }[];
  plusDetectados: string[];
  senales: string[];
}

// ─── Generador de resultados mock basado en el candidato ──────────────────────
export function generateWaResult(candidate: Candidate): WaPrescreeningResult {
  const s = Math.min(100, Math.round(candidate.score * 0.94));
  const status: WaPrescreeningResult['status'] = s >= 72 ? 'continua' : s >= 52 ? 'pendiente' : 'rechazado';
  const firstName = candidate.name.split(' ')[0];
  return {
    score: s,
    status,
    resumen: `Pre-entrevista completada vía WhatsApp con Alex IA (~8 min). ${firstName} confirmó experiencia en servicio al cliente, disponibilidad para turnos rotativos y cumplimiento de no negociables. Expectativa salarial ${candidate.salaryRange === 'en_rango' ? 'en rango' : 'fuera de rango'}.`,
    noNegociables: [
      { label: 'Mín. 6 meses experiencia certificada en servicio al cliente', score: s >= 80 ? 95 : s >= 65 ? 80 : 55, evidencia: s >= 80 ? `${firstName} confirmó experiencia certificada en servicio al cliente con referencias verificables.` : s >= 65 ? 'Experiencia declarada en límite mínimo; pendiente verificación de referencias.' : 'No acreditó experiencia suficiente en servicio al cliente.' },
      { label: 'Disponibilidad completa para turnos rotativos (lunes a domingo)', score: s >= 80 ? 97 : s >= 65 ? 82 : 50, evidencia: s >= 80 ? `Confirma disponibilidad total lunes a domingo, incluyendo festivos. Sin restricciones de horario.` : s >= 65 ? 'Acepta turnos rotativos; solicitó no trabajar todos los festivos.' : 'Expresó limitaciones de disponibilidad que no se ajustan al cargo.' },
      { label: 'Experiencia en restaurante de cadena (deseable)', score: s >= 80 ? 88 : s >= 65 ? 72 : 48, evidencia: s >= 80 ? `${firstName} tiene experiencia previa en restaurante de cadena o establecimiento de volumen similar.` : s >= 65 ? 'Experiencia en servicio al cliente general; no específicamente en cadena de restaurantes.' : 'Sin experiencia en restaurante de cadena.' },
      { label: 'Expectativa salarial', score: candidate.salaryRange === 'en_rango' ? 88 : 42, evidencia: candidate.salaryRange === 'en_rango' ? 'Expectativa declarada dentro del rango presupuestado para el cargo.' : 'Expectativa salarial superior al presupuesto disponible. Requiere negociación.' },
    ],
    plusDetectados: candidate.scoringAI?.logros?.slice(0, 2).length
      ? candidate.scoringAI.logros.slice(0, 2)
      : ['Buena capacidad de síntesis', 'Comunicación clara y directa'],
    senales: candidate.scoringAI?.senales?.slice(0, 1) ?? [],
  };
}

// ─── Context ───────────────────────────────────────────────────────────────────
interface WaPrescreeningCtx {
  isCompleted: (candidateId: string) => boolean;
  getResult:   (candidateId: string) => WaPrescreeningResult | undefined;
  markCompleted: (candidates: Candidate[]) => void;
}

const Ctx = createContext<WaPrescreeningCtx | null>(null);

export function WaPrescreeningProvider({ children }: { children: ReactNode }) {
  const [results, setResults] = useState<Record<string, WaPrescreeningResult>>({});

  const isCompleted = useCallback(
    (id: string) => id in results,
    [results],
  );

  const getResult = useCallback(
    (id: string) => results[id],
    [results],
  );

  const markCompleted = useCallback((candidates: Candidate[]) => {
    setResults(prev => {
      const next = { ...prev };
      candidates.forEach(c => { next[c.id] = generateWaResult(c); });
      return next;
    });
  }, []);

  return (
    <Ctx.Provider value={{ isCompleted, getResult, markCompleted }}>
      {children}
    </Ctx.Provider>
  );
}

export function useWaPrescreening() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useWaPrescreening must be used inside WaPrescreeningProvider');
  return ctx;
}
