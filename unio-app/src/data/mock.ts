// ─── Types ───────────────────────────────────────────────────────────────────

export type VacanteStatus = 'activa' | 'en_pausa' | 'cerrada';
export type Priority = 'alta' | 'media' | 'baja';
export type StageStatus = 'completed' | 'in_progress' | 'not_started';
export type SalaryRange = 'en_rango' | 'fuera_de_rango';
export type PipelineStageKey = 'scoring' | 'prescreening' | 'prueba_manejo' | 'entrevistas' | 'evaluaciones' | 'prueba_conocimiento' | 'estudios' | 'finalistas';

// ── Prescreening two-step progress ───────────────────────────────────────────
export type ResumeValidationStatus = 'pending' | 'passed' | 'failed' | 'not_available';
export type WaPrescreeningStatus   = 'not_started' | 'in_progress' | 'completed';

export interface PrescreeningProgress {
  resumeValidation: {
    status: ResumeValidationStatus;
    validatedAt?: string;
    matchedCriteria?: number;
    totalCriteria?: number;
    failReason?: string;
  };
  whatsappPrescreening: {
    status: WaPrescreeningStatus;
  };
}

export interface Vacante {
  id: string;
  status: VacanteStatus;
  title: string;
  area: string[];
  priority: Priority;
  progressLabel: string;
  progressPct: number;
  total: number;
  activos: number;
  fecha: string;
  processId?: string;
  jobId?: string;
}

export interface PipelineStage {
  id: string;
  label: string;
  stageBadge: string;
  status: StageStatus;
  candidateCount: number;
  isAI: boolean;
  route: string;
  /** When true the action button is enabled regardless of status (overrides not_started lock) */
  forceEnabled?: boolean;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  sector: string;
  years: string;
  location: string;
  bio: string;
  score: number;
  avatarInitials: string;
  avatarColor: string;
  hasCurrentJob: boolean;
  currentCompany?: string;
  currentRole?: string;
  lastCompany?: string;
  lastRole?: string;
  lastDate?: string;
  superpoder: string;
  aspiration: string;
  budget: string;
  salaryRange: SalaryRange;
  currentStage: PipelineStageKey;
  photo?: string;
  scoringAI: {
    score: number;
    status: 'continua' | 'pendiente' | 'rechazado';
    resumen: string;
    noNegociables: NoNegociable[];
    logros: string[];
    senales: string[];
  };
  prescreeningAI?: {
    score: number;
    status: 'continua' | 'pendiente' | 'rechazado' | 'no_realizada';
    resumen: string;
    noNegociables: EvalRow[];
    plusDetectados: string[];
    senales: string[];
    entornoPersonal?: { label: string; value: string; status: 'ok' | 'warning' | 'neutral' }[];
    experienciaLaboral?: { empresa: string; rol: string; periodo: string; descripcion: string }[];
  };
  psychTest?: PsychTestResult;
  knowledgeTest?: KnowledgeTestResult;
  hasCV?: boolean;
  applicationHistory?: { count: number; lastDate?: string; status: 'recurrente' | 'primera_vez' };
  rejectionType?: 'definitivo' | 'circunstancial' | null;
  runtVerification?: {
    cc: string;
    totalManifiestos: number;
    licenseCategories: { categoria: string; fechaExpedicion: string; fechaVencimiento: string }[];
    tipoLicencia?: string;
    vigencia?: string;
    vehiculosExperiencia?: string[];
    anosExperiencia?: number;
  };
  pruebaManejo?: { status: 'agendada'; fecha: string; hora: string; lugar: string } | { status: 'pendiente' };
  /** Interview verdict — shown as chip on candidate cards in entrevistas/estudios/finalistas */
  veredictoEntrevista?: 'apto' | 'apto_reservas' | 'no_apto';
  /** Two-step prescreening progress: resume validation → WA prescreening */
  prescreeningProgress?: PrescreeningProgress;
}

export interface NoNegociable {
  label: string;
  cumple: boolean;
}

export interface KnowledgeQuestion {
  id: number;
  category: string;
  question: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface KnowledgeTestResult {
  score: number;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  observations: string;
  externalUrl: string;
  completedAt: string;
  questions: KnowledgeQuestion[];
}

export interface EvalRow {
  label: string;
  score: number;
  evidencia: string;
}

export interface PsychFitCard {
  axis: string;
  idealScore: number;
  candidateScore: number;
  summary: string;
  detail: string;
}

export interface RadarPoint {
  label: string;
  value: number;
}

export interface PsychTestResult {
  score: number;
  insight: string;
  fitCards: PsychFitCard[];
  radarPoints: RadarPoint[];
  veredicto: { title: string; body: string }[];
  preguntas: { tag: string; question: string; validates: string }[];
}

export type TechTestRecomendacion = 'avanzar' | 'avanzar_reservas' | 'no_recomendar';

export interface TechTestFeedback {
  ratings: {
    dominio: number;
    resolucion: number;
    calidad: number;
    comunicacion: number;
    iniciativa: number;
  };
  destacados: string;
  senalAlerta: string;
  recomendacion: TechTestRecomendacion | null;
  files: { name: string; size: number }[];
}

export interface FinalistProfile extends Candidate {
  resumenCandidato: string[];
  logrosDestacados: LogroMetric[];
  fitCultural: FitCultural;
  estiloTrabajo: EstiloTrabajo[];
}

export interface LogroMetric {
  value: string;
  label: string;
  descripcion: string;
}

export interface FitCultural {
  narrative: string;
  afinidad: string[];
  noNegociables: string[];
  proyeccion: string;
}

export interface EstiloTrabajo {
  label: string;
  score: number;
  descripcion: string;
}

// ─── Vacantes ────────────────────────────────────────────────────────────────

export const vacantes: Vacante[] = [
  { id: 'v1', status: 'activa', title: 'Senior Product Designer', area: ['Producto', 'Diseño'], priority: 'alta', progressLabel: 'Pre-entrevistas', progressPct: 35, total: 100, activos: 12, fecha: '15 Ene 2025' },
  { id: 'v2', status: 'en_pausa', title: 'Semi-Senior Product Designer', area: ['Producto', 'Diseño'], priority: 'media', progressLabel: 'Completado', progressPct: 100, total: 100, activos: 12, fecha: '15 Ene 2025' },
  { id: 'v3', status: 'activa', title: 'Junior Product Designer', area: ['Experiencia', 'Desarrollo'], priority: 'baja', progressLabel: 'Completado', progressPct: 100, total: 50, activos: 8, fecha: '10 Feb 2025' },
  { id: 'v4', status: 'en_pausa', title: 'Product Manager', area: ['Estrategia', 'Gestión'], priority: 'alta', progressLabel: 'Finalistas', progressPct: 80, total: 200, activos: 20, fecha: '01 Mar 2025' },
  { id: 'v5', status: 'cerrada', title: 'UX/UI Designer', area: ['Investigación', 'Diseño'], priority: 'media', progressLabel: 'Pruebas', progressPct: 60, total: 75, activos: 10, fecha: '15 Mar 2025' },
  { id: 'v6', status: 'en_pausa', title: 'Product Analyst', area: ['Datos', 'Análisis'], priority: 'baja', progressLabel: 'Entrevistas', progressPct: 45, total: 60, activos: 5, fecha: '20 Abr 2025' },
  { id: 'v7', status: 'cerrada', title: 'Lead Designer', area: ['Creatividad', 'Innovación'], priority: 'alta', progressLabel: 'Entrevistas', progressPct: 45, total: 150, activos: 15, fecha: '30 May 2025' },
  { id: 'v8', status: 'activa', title: 'Visual Designer', area: ['Estética', 'Branding'], priority: 'media', progressLabel: 'Revisión CVs', progressPct: 20, total: 80, activos: 7, fecha: '05 Jun 2025' },
];

// ─── Pipeline Stages ─────────────────────────────────────────────────────────

export const getPipelineStages = (jobId: string): PipelineStage[] => [
  {
    id: 'scoring',
    label: 'Scoring IA',
    stageBadge: 'Scoring',
    status: 'completed',
    candidateCount: 28,
    isAI: true,
    route: `/pipeline/${jobId}/scoring`,
  },
  {
    id: 'prescreening',
    label: 'Pre-entrevista IA',
    stageBadge: 'Pre screening',
    status: 'completed',
    candidateCount: 20,
    isAI: true,
    route: `/pipeline/${jobId}/prescreening`,
  },
  {
    id: 'entrevistas',
    label: 'Entrevistas',
    stageBadge: 'Entrevistas',
    status: 'in_progress',
    candidateCount: 10,
    isAI: false,
    route: `/pipeline/${jobId}/entrevistas`,
  },
  {
    id: 'evaluaciones',
    label: 'Pruebas',
    stageBadge: 'Pruebas',
    status: 'in_progress',
    candidateCount: 8,
    isAI: false,
    route: `/pipeline/${jobId}/evaluaciones`,
  },
  {
    id: 'finalistas',
    label: 'Finalistas',
    stageBadge: 'Finalistas',
    status: 'in_progress',
    candidateCount: 5,
    isAI: false,
    route: `/pipeline/${jobId}/finalistas`,
  },
];

// ─── Candidates ──────────────────────────────────────────────────────────────

export const candidates: Candidate[] = [
  {
    id: 'c1',
    name: 'Clara Fernández',
    role: 'Interaction Designer',
    sector: 'Software, Educación',
    years: '9 Años',
    location: 'Buenos Aires, Argentina',
    bio: 'Desarrolladora de herramientas educativas digitales, centradas en la gamificación y la interactividad.',
    score: 96,
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    avatarInitials: 'CF',
    avatarColor: '#8750F6',
    hasCurrentJob: false,
    lastCompany: 'MercadoLibre',
    lastRole: 'Product Designer',
    lastDate: '03/2024',
    superpoder: '"Visión estratégica: entiende el negocio"',
    aspiration: "$11'500.000",
    budget: "$12'000.000",
    salaryRange: 'en_rango',
    currentStage: 'prescreening',
    scoringAI: {
      score: 87,
      status: 'continua',
      resumen: 'Sr Product Designer con 6+ años en fintech B2B. Experiencia en sistemas de diseño escalables y productos digitales end-to-end.',
      noNegociables: [
        { label: 'Ubicación: Bogotá, Colombia', cumple: true },
        { label: 'Experiencia +5 años en Product Design', cumple: true },
        { label: 'Sector: Fintech o SaaS B2B', cumple: true },
        { label: 'Herramientas: Figma + Design Systems', cumple: true },
        { label: 'Inglés: Nivel avanzado (C1)', cumple: true },
      ],
      logros: [
        'Lideró implementación de design system escalable en 3 productos B2B durante 2022-2024, reduciendo inconsistencias de UI en 75%',
        'Redujo tiempo de diseño en 40% mediante biblioteca de componentes reutilizables adoptada por equipo de 15+ developers',
        'Portfolio documenta 8 casos de estudio completos en fintech B2B con métricas de impacto cuantificables',
      ],
      senales: [
        'Experiencia en metodologías ágiles (Scrum/Kanban) mencionada en CV pero sin detalle de ceremonias o artefactos específicos',
        'Liderazgo de equipos de diseño: Portfolio solo muestra trabajo individual, no evidencia de mentoría o coordinación de diseñadores',
        'Casos de negocio con métricas: Falta cuantificación consistente de impacto en adopción, conversión o retención de usuarios',
      ],
    },
    prescreeningAI: {
      score: 92,
      status: 'continua',
      resumen: 'Candidato con 7+ años en diseño de producto, actualmente liderando equipo de 5 diseñadores en fintech B2B. Comunicación clara y estructurada, responde con ejemplos concretos y métricas de impacto. Motivación genuina por el reto, valora cultura de autonomía y busca escalar a Head of Design',
      noNegociables: [
        { label: 'Experiencia en Design Systems', score: 85, evidencia: 'Creó biblioteca con 50+ componentes reutilizables adoptada por 15 developers. Sistema basado en Angular Material con 90% de adopción organizacional.' } as any,
        { label: 'Liderazgo de equipos', score: 96, evidencia: 'Creó biblioteca con 50+ componentes reutilizables adoptada por 15 developers. Sistema basado en Angular Material con 90% de adopción organizacional.' } as any,
        { label: 'Experiencia en productos B2B', score: 90, evidencia: 'Creó biblioteca con 50+ componentes reutilizables adoptada por 15 developers. Sistema basado en Angular Material con 90% de adopción organizacional.' } as any,
        { label: 'Dominio de Figma', score: 65, evidencia: 'Creó biblioteca con 50+ componentes reutilizables adoptada por 15 developers. Sistema basado en Angular Material con 90% de adopción organizacional.' } as any,
        { label: 'Inglés conversacional', score: 72, evidencia: 'Creó biblioteca con 50+ componentes reutilizables adoptada por 15 developers. Sistema basado en Angular Material con 90% de adopción organizacional.' } as any,
      ],
      plusDetectados: [
        'Lideró implementación de design system escalable en 3 productos B2B durante 2022-2024, reduciendo inconsistencias de UI en 75%',
        'Redujo tiempo de diseño en 40% mediante biblioteca de componentes reutilizables adoptada por equipo de 15+ developers',
        'Portfolio documenta 8 casos de estudio completos en fintech B2B con métricas de impacto cuantificables',
      ],
      senales: [
        'Experiencia en metodologías ágiles (Scrum/Kanban) mencionada en CV pero sin detalle de ceremonias o artefactos específicos',
        'Liderazgo de equipos de diseño: Portfolio solo muestra trabajo individual, no evidencia de mentoría o coordinación de diseñadores',
        'Casos de negocio con métricas: Falta cuantificación consistente de impacto en adopción, conversión o retención de usuarios',
      ],
    },
  },
  {
    id: 'c2',
    name: 'Gabriel Castillo',
    role: 'Product Designer',
    sector: 'Inteligencia Artificial, Salud',
    years: '7 Años',
    location: 'Lima, Perú',
    bio: 'Investigador en el uso de IA para diagnósticos médicos, con un enfoque en la precisión y la accesibilidad.',
    score: 96,
    photo: 'https://randomuser.me/api/portraits/men/32.jpg',
    avatarInitials: 'GC',
    avatarColor: '#27BE69',
    hasCurrentJob: true,
    currentCompany: 'HealthTech Labs',
    currentRole: 'Senior Product Designer',
    superpoder: '"Pensamiento sistémico aplicado a la salud"',
    aspiration: "$13'000.000",
    budget: "$12'000.000",
    salaryRange: 'fuera_de_rango',
    currentStage: 'evaluaciones',
    scoringAI: {
      score: 96,
      status: 'continua',
      resumen: 'Product Designer especializado en IA para salud. Vasta experiencia en investigación de usuarios y accesibilidad.',
      noNegociables: [
        { label: 'Ubicación: Lima, Perú', cumple: false },
        { label: 'Experiencia +5 años en Product Design', cumple: true },
        { label: 'Sector: Fintech o SaaS B2B', cumple: false },
        { label: 'Herramientas: Figma + Design Systems', cumple: true },
        { label: 'Inglés: Nivel avanzado (C1)', cumple: true },
      ],
      logros: [
        'Diseñó sistema de diagnóstico AI con 94% de precisión adoptado en 3 hospitales principales',
        'Redujo tiempo de diagnóstico en 60% mediante optimización de flujos de usuario',
        'Publicó 2 papers sobre accesibilidad en interfaces médicas',
      ],
      senales: [
        'Ubicación en Lima puede representar una barrera para trabajo presencial',
        'Experiencia principalmente en salud, no en fintech B2B',
      ],
    },
    prescreeningAI: {
      score: 88,
      status: 'continua',
      resumen: 'Gabriel demuestra pensamiento sistémico muy sólido y capacidad de articular decisiones de diseño con impacto clínico medible. Comunicación clara, responde con casos concretos. Motivado por el reto de aplicar su experiencia en IA a un contexto B2B de alto impacto.',
      noNegociables: [
        { label: 'Experiencia en Design Systems', score: 82, evidencia: 'Creó sistema de componentes médicos reutilizables adoptado por 3 hospitales. Basado en Material Design con adaptaciones para accesibilidad WCAG 2.1.' } as any,
        { label: 'Liderazgo de equipos', score: 78, evidencia: 'Lideró equipo de 3 diseñadores en HealthTech Labs durante proyecto de diagnóstico AI de 18 meses.' } as any,
        { label: 'Experiencia en productos B2B', score: 70, evidencia: 'Producto médico orientado a hospitales (B2B), aunque no en fintech. Transferibilidad alta en UX research y flujos complejos.' } as any,
        { label: 'Dominio de Figma', score: 90, evidencia: 'Portfolio completo en Figma con prototipos de alta fidelidad y hand-off documentado para equipos de 10+ developers.' } as any,
        { label: 'Inglés conversacional', score: 85, evidencia: 'Publicó 2 papers en inglés y presentó en conferencia internacional de UX en Boston 2023.' } as any,
      ],
      plusDetectados: [
        'Publicó 2 papers académicos sobre accesibilidad en interfaces médicas, evidenciando pensamiento investigativo riguroso',
        'Redujo tiempo de diagnóstico en 60% con optimización de flujos, métricas de impacto cuantificables y verificables',
        'Experiencia en IA aplicada a productos complejos — curva de aprendizaje en fintech sería corta',
      ],
      senales: [
        'Aspiración salarial $1M por encima del presupuesto: negociación necesaria',
        'Sector salud vs. fintech B2B: validar transferibilidad en entrevista con casos específicos',
        'Sin experiencia en equipos de diseño grandes (+5 personas)',
      ],
    },
    psychTest: {
      score: 84,
      insight: 'Perfil con alta Propulsión y Autonomía, alineado con ejes críticos del rol. Brecha menor en Impronta manejable con onboarding estructurado.',
      fitCards: [
        {
          axis: 'Autonomía en campo',
          idealScore: 82,
          candidateScore: 85,
          summary: 'Autonomía operativa alineada con autonomía de campo crítica.',
          detail: 'El candidato toma decisiones técnicas sin validación constante y resuelve problemas en campo de forma independiente. El rol opera en territorio extenso sin soporte presencial donde escalar detiene la operación del cliente. Alineación directa en capacidad de operar sin supervisión y ownership en implementaciones complejas.',
        },
        {
          axis: 'Drive comercial',
          idealScore: 80,
          candidateScore: 78,
          summary: 'Ownership en implementaciones alineado con modelo one-man show.',
          detail: 'Capacidad de identificar oportunidades de negocio durante la implementación y gestionar la relación con el cliente de forma autónoma. Perfil orientado a resultados con historial de cierre de oportunidades adicionales en cuentas activas.',
        },
        {
          axis: 'Credibilidad técnica',
          idealScore: 68,
          candidateScore: 68,
          summary: 'Capacidad de explicar conceptos técnicos a audiencias médicas.',
          detail: 'Dominio técnico del producto suficiente para generar confianza en interlocutores clínicos. La credibilidad no depende solo del conocimiento sino de la capacidad de traducirlo al lenguaje del cliente.',
        },
        {
          axis: 'Ritmo acelerado',
          idealScore: 50,
          candidateScore: 42,
          summary: 'Ritmo acelerado vs manejo de clientes pausados.',
          detail: 'El eje evalúa la capacidad de modular el ritmo de trabajo según las necesidades del cliente. Un ritmo muy acelerado puede generar fricciones con stakeholders que requieren validación pausada y procesos formales de aprobación.',
        },
        {
          axis: 'Orientación a procesos',
          idealScore: 72,
          candidateScore: 68,
          summary: 'Ownership en implementaciones alineado con modelo one-man show.',
          detail: 'Capacidad de seguir protocolos establecidos de implementación y documentación técnica. El rol requiere adherencia a procesos regulatorios del sector salud y trazabilidad de acciones en campo.',
        },
        {
          axis: 'Paciencia en validación',
          idealScore: 82,
          candidateScore: 77,
          summary: 'Capacidad de explicar conceptos técnicos a audiencias médicas.',
          detail: 'El sector salud requiere validaciones exhaustivas y procesos de aprobación prolongados. La capacidad de sostener la relación con el cliente durante estos ciclos sin generar presión es crítica para el éxito del rol.',
        },
      ],
      radarPoints: [
        { label: 'Iniciativa',          value: 74 },
        { label: 'Agente cambio',       value: 82 },
        { label: 'Proactividad',        value: 75 },
        { label: 'Inteligencia Social', value: 70 },
        { label: 'Influencia',          value: 68 },
        { label: 'Actitud de servicio', value: 65 },
        { label: 'Autonomía',           value: 85 },
        { label: 'Agilidad',            value: 80 },
        { label: 'Mentoreo',            value: 78 },
        { label: 'Empatía',             value: 55 },
        { label: 'Disponibilidad',      value: 42 },
        { label: 'Atención Activa',     value: 45 },
        { label: 'Precisión',           value: 72 },
        { label: 'Excelencia técnica',  value: 75 },
        { label: 'P. Analítico',        value: 68 },
        { label: 'Implementación',      value: 70 },
      ],
      veredicto: [
        {
          title: 'Quién es conductualmente',
          body: 'Este candidato muestra un perfil de alta autonomía y orientación a la acción. Opera con iniciativa propia, toma decisiones sin validación constante, y prioriza la velocidad de ejecución sobre el análisis exhaustivo. Su estilo natural es resolver problemas técnicos de forma independiente, con un ritmo acelerado que puede generar tensión en contextos donde se requiere validación pausada o coordinación detallada con stakeholders.',
        },
        {
          title: 'Fit con este rol específico',
          body: 'El RCP definió autonomía de campo y toma de decisiones sin supervisión como non_negotiables — este candidato los cumple de forma sobresaliente. Los ejes críticos del cargo (Propulsión y Autonomía) están fuertemente alineados. En entrevista HM se confirmó: "Resuelve sin escalar, ownership claro en implementaciones previas". La brecha en Impronta (ritmo acelerado vs clientes pausados) no afecta los requerimientos core del rol, pero requiere atención en onboarding para evitar fricciones con stakeholders senior o procesos formales de validación.',
        },
        {
          title: 'Fit con este rol específico',
          body: 'El RCP definió autonomía de campo y toma de decisiones sin supervisión como non_negotiables — este candidato los cumple de forma sobresaliente. Los ejes críticos del cargo (Propulsión y Autonomía) están fuertemente alineados. En entrevista HM se confirmó: "Resuelve sin escalar, ownership claro en implementaciones previas". La brecha en Impronta (ritmo acelerado vs clientes pausados) no afecta los requerimientos core del rol, pero requiere atención en onboarding para evitar fricciones con stakeholders senior o procesos formales de validación.',
        },
      ],
      preguntas: [
        {
          tag: 'Para: HR',
          question: '"Cuéntame de una implementación que tomó más tiempo del esperado - ¿cómo manejaste la frustración y adaptaste tu ritmo?"',
          validates: 'I (Impronta)',
        },
        {
          tag: 'Para: HM',
          question: '"Dame un ejemplo donde tuviste que adaptar tu ritmo a un cliente muy pausado o meticuloso en sus validaciones"',
          validates: 'I + R',
        },
        {
          tag: 'Para: HM',
          question: '"Dame un ejemplo donde tuviste que adaptar tu ritmo a un cliente muy pausado o meticuloso en sus validaciones"',
          validates: 'A + P',
        },
      ],
    },
  },
  {
    id: 'c3',
    name: 'Isabel Fernández',
    role: 'UX Designer',
    sector: 'Inteligencia Artificial, Salud',
    years: '7 Años',
    location: 'Lima, Perú',
    bio: 'Investigadora en el uso de IA para diagnósticos médicos, con un enfoque en la precisión y la accesibilidad.',
    score: 92,
    photo: 'https://randomuser.me/api/portraits/women/25.jpg',
    avatarInitials: 'IF',
    avatarColor: '#295BFF',
    hasCurrentJob: true,
    currentCompany: 'Nubank',
    currentRole: 'Lead UX Designer',
    superpoder: '"Diseño centrado en accesibilidad"',
    aspiration: "$11'000.000",
    budget: "$12'000.000",
    salaryRange: 'en_rango',
    currentStage: 'entrevistas',
    scoringAI: {
      score: 92,
      status: 'continua',
      resumen: 'UX Designer con fuerte enfoque en accesibilidad e investigación. Experiencia en productos fintech.',
      noNegociables: [
        { label: 'Ubicación: Lima, Perú', cumple: false },
        { label: 'Experiencia +5 años en Product Design', cumple: true },
        { label: 'Sector: Fintech o SaaS B2B', cumple: true },
        { label: 'Herramientas: Figma + Design Systems', cumple: true },
        { label: 'Inglés: Nivel avanzado (C1)', cumple: true },
      ],
      logros: [
        'Creó guía de accesibilidad adoptada por 50+ designers en la empresa',
        'Rediseñó flujo de onboarding mejorando conversión en 35%',
      ],
      senales: [
        'Portfolio enfocado en consumer finance, no B2B',
        'No evidencia de liderazgo de equipos de diseño',
      ],
    },
    prescreeningAI: {
      score: 91,
      status: 'continua',
      resumen: 'Isabel tiene comunicación excepcional y un enfoque muy estructurado en research. Actualmente en Nubank liderando UX — su experiencia en fintech B2C es directamente transferible. Motivación alta, busca rol con más impacto estratégico.',
      noNegociables: [
        { label: 'Experiencia en Design Systems', score: 88, evidencia: 'Co-creó design system de accesibilidad en Nubank adoptado por 50+ designers. Componentes documentados con guías WCAG y tokens de diseño.' } as any,
        { label: 'Liderazgo de equipos', score: 72, evidencia: 'Lead UX con coordinación de 2 diseñadores junior. Sin experiencia formal de gestión de equipo mayor.' } as any,
        { label: 'Experiencia en productos B2B', score: 75, evidencia: 'Nubank es B2C pero con procesos de diseño enterprise. Tiene proyectos internos de herramientas B2B como dashboard para operaciones.' } as any,
        { label: 'Dominio de Figma', score: 95, evidencia: 'Figma como herramienta principal. Crea prototipos interactivos de alta fidelidad y sistemas de componentes con variables y auto-layout avanzado.' } as any,
        { label: 'Inglés conversacional', score: 88, evidencia: 'Nivel C1 certificado. Presentó en Figma Config LATAM 2023 en inglés sobre accesibilidad en productos financieros.' } as any,
      ],
      plusDetectados: [
        'Guía de accesibilidad adoptada por 50+ designers — liderazgo de influencia sin autoridad formal',
        'Experiencia en fintech regulado (Nubank) — conoce compliance, privacidad y flujos de validación KYC',
        'Mejora del 35% en conversión de onboarding con cambios de UX medibles y documentados',
      ],
      senales: [
        'Transición de B2C a B2B: validar comprensión de ciclos de venta largos y múltiples stakeholders',
        'Liderazgo de equipo aún en desarrollo — ¿puede escalar a rol senior con gestión?',
        'Ubicación Lima: confirmar disponibilidad para viajes o reubicación si aplica',
      ],
    },
  },
  {
    id: 'c4',
    name: 'María Torres',
    role: 'Experience Designer',
    sector: 'Realidad Aumentada, Entretenimiento',
    years: '6 Años',
    location: 'São Paulo, Brasil',
    bio: 'Desarrolladora de experiencias de realidad aumentada para eventos y entretenimiento, creando interacciones memorables.',
    score: 96,
    photo: 'https://randomuser.me/api/portraits/women/48.jpg',
    avatarInitials: 'MT',
    avatarColor: '#FFBF0F',
    hasCurrentJob: true,
    currentCompany: 'ImmersiveTech',
    currentRole: 'Principal Designer',
    superpoder: '"Storytelling visual y experiencias inmersivas"',
    aspiration: "$14'000.000",
    budget: "$12'000.000",
    salaryRange: 'fuera_de_rango',
    currentStage: 'entrevistas',
    scoringAI: {
      score: 96,
      status: 'continua',
      resumen: 'Designer especializado en XR con fuerte storytelling visual.',
      noNegociables: [
        { label: 'Ubicación: São Paulo, Brasil', cumple: false },
        { label: 'Experiencia +5 años en Product Design', cumple: true },
        { label: 'Sector: Fintech o SaaS B2B', cumple: false },
        { label: 'Herramientas: Figma + Design Systems', cumple: true },
        { label: 'Inglés: Nivel avanzado (C1)', cumple: true },
      ],
      logros: [
        'Diseñó 10+ experiencias XR con 500K+ usuarios en festivales internacionales',
        'Fundó comunidad de diseño XR en LATAM con 2000+ miembros',
      ],
      senales: [
        'Experiencia principalmente en entretenimiento, no B2B',
        'Ubicación en Brasil',
      ],
    },
    prescreeningAI: {
      score: 85,
      status: 'continua',
      resumen: 'María sorprende por su capacidad de storytelling y visión de producto no convencional. Perfil diferenciador dentro del pipeline. Motivación genuina por llevar diseño inmersivo a contextos enterprise. Comunicación muy fluida en inglés y español.',
      noNegociables: [
        { label: 'Experiencia en Design Systems', score: 80, evidencia: 'Creó sistema de componentes XR reutilizables en Unity y Figma, adoptado por 4 estudios de producción. Incluye tokens de animación y estados de interacción.' } as any,
        { label: 'Liderazgo de equipos', score: 90, evidencia: 'Principal Designer liderando equipo de 6 diseñadores en ImmersiveTech. Gestión de roadmap y ceremonias ágiles.' } as any,
        { label: 'Experiencia en productos B2B', score: 60, evidencia: 'Proyectos para marcas corporativas (Ford, Samsung) en contexto B2B indirecto. Sin experiencia en SaaS B2B directo.' } as any,
        { label: 'Dominio de Figma', score: 88, evidencia: 'Figma como herramienta principal para wireframes y prototipos 2D. Complementa con ProtoPie para interacciones avanzadas.' } as any,
        { label: 'Inglés conversacional', score: 92, evidencia: 'C1 nativo. Presentó en conferencias internacionales en SXSW y Cannes Lions representando ImmersiveTech.' } as any,
      ],
      plusDetectados: [
        'Fundó comunidad XR LATAM con 2000+ miembros — liderazgo de comunidad y visibilidad en industria',
        '500K+ usuarios en experiencias diseñadas — escala real de impacto en productos de consumo masivo',
        'Perspectiva diferenciadora: diseño inmersivo puede impulsar demos de producto SaaS y onboarding',
      ],
      senales: [
        'Aspiración salarial $2M sobre presupuesto — negociación prioritaria antes de avanzar',
        'Cero experiencia en SaaS B2B: riesgo de curva de aprendizaje larga en contexto enterprise',
        'Ubicación São Paulo: confirmar modalidad de trabajo y disponibilidad para viajar',
      ],
    },
  },
  {
    id: 'c5',
    name: 'Ricardo Torres',
    role: 'Innovation Designer',
    sector: 'Automotriz, Innovación',
    years: '7 Años',
    location: 'Quito, Ecuador',
    bio: 'Experto en soluciones tecnológicas para la industria automotriz, centrado en la movilidad eléctrica y conectividad.',
    score: 96,
    photo: 'https://randomuser.me/api/portraits/men/18.jpg',
    avatarInitials: 'RT',
    avatarColor: '#8750F6',
    hasCurrentJob: true,
    currentCompany: 'Renault Innovation Lab',
    currentRole: 'Design Lead',
    superpoder: '"Innovación disruptiva en movilidad"',
    aspiration: "$12'500.000",
    budget: "$12'000.000",
    salaryRange: 'en_rango',
    currentStage: 'prescreening',
    scoringAI: {
      score: 96,
      status: 'continua',
      resumen: 'Innovation designer con background en movilidad y IoT.',
      noNegociables: [
        { label: 'Ubicación: Quito, Ecuador', cumple: false },
        { label: 'Experiencia +5 años en Product Design', cumple: true },
        { label: 'Sector: Fintech o SaaS B2B', cumple: false },
        { label: 'Herramientas: Figma + Design Systems', cumple: true },
        { label: 'Inglés: Nivel avanzado (C1)', cumple: true },
      ],
      logros: [
        'Diseñó cockpit digital para EV adoptado en 3 modelos de producción',
        'Patentó sistema de UI adaptativa para vehículos conectados',
      ],
      senales: [
        'Sector automotriz puede no transferirse a SaaS B2B',
      ],
    },
    prescreeningAI: {
      score: 84,
      status: 'continua',
      resumen: 'Ricardo sorprende por su capacidad de innovación en entornos de alta complejidad técnica. Comunicación sólida, articula sus decisiones con razonamiento de producto. Motivado por el reto de llevar su experiencia en IoT a plataformas SaaS B2B.',
      noNegociables: [
        { label: 'Experiencia en Design Systems', score: 85, evidencia: 'Creó sistema de componentes para dashboards de vehículos conectados, adoptado en 3 modelos Renault. Incluye estados, variantes y guías de uso para ingenieros.' } as any,
        { label: 'Liderazgo de equipos', score: 88, evidencia: 'Design Lead coordinando equipo de 4 diseñadores en Renault Innovation Lab. Responsable de roadmap de UX y revisiones de calidad.' } as any,
        { label: 'Experiencia en productos B2B', score: 65, evidencia: 'Productos orientados a manufactura automotriz (B2B industrial). Experiencia en flujos complejos con múltiples stakeholders y requisitos de cumplimiento.' } as any,
        { label: 'Dominio de Figma', score: 87, evidencia: 'Usa Figma para diseño de interfaces de cockpit y prototipado de interacciones físico-digitales. Design tokens y variables configuradas.' } as any,
        { label: 'Inglés conversacional', score: 80, evidencia: 'Trabajó con equipo global de Renault. Reuniones semanales en inglés con stakeholders de Francia y Alemania. Nivel conversacional fluido.' } as any,
      ],
      plusDetectados: [
        'Patentó sistema de UI adaptativa para vehículos — capacidad de innovación formal y protegida',
        'Cockpit digital adoptado en producción masiva — experiencia en diseño con restricciones técnicas críticas',
        'Background en IoT y conectividad: relevante para productos SaaS con integraciones de datos en tiempo real',
      ],
      senales: [
        'Ubicación en Quito: confirmar disponibilidad remota o reubicación',
        'Sector automotriz → SaaS B2B: validar comprensión de métricas de negocio SaaS (churn, activation, NPS)',
        'Aspiración salarial levemente sobre presupuesto — negociable pero confirmar expectativas',
      ],
    },
  },
  {
    id: 'c6',
    name: 'Javier López',
    role: 'E-commerce Designer',
    sector: 'E-commerce, Logística',
    years: '5 Años',
    location: 'Medellín, Colombia',
    bio: 'Especialista en la optimización de procesos logísticos y en la mejora de la experiencia de compra en línea.',
    score: 96,
    photo: 'https://randomuser.me/api/portraits/men/41.jpg',
    avatarInitials: 'JL',
    avatarColor: '#27BE69',
    hasCurrentJob: true,
    currentCompany: 'Rappi',
    currentRole: 'Product Designer',
    superpoder: '"Optimización de funnels de conversión"',
    aspiration: "$11'000.000",
    budget: "$12'000.000",
    salaryRange: 'en_rango',
    currentStage: 'prescreening',
    scoringAI: {
      score: 96,
      status: 'continua',
      resumen: 'Designer con expertise en e-commerce y logística, fuerte orientación a métricas.',
      noNegociables: [
        { label: 'Ubicación: Medellín, Colombia', cumple: true },
        { label: 'Experiencia +5 años en Product Design', cumple: true },
        { label: 'Sector: Fintech o SaaS B2B', cumple: false },
        { label: 'Herramientas: Figma + Design Systems', cumple: true },
        { label: 'Inglés: Nivel avanzado (C1)', cumple: false },
      ],
      logros: [
        'Aumentó conversión de checkout en 28% mediante rediseño de flujo',
        'Implementó design system para plataforma con 2M+ usuarios',
      ],
      senales: [
        'Inglés B2, no cumple C1 requerido',
        'Experiencia en B2C, no B2B',
      ],
    },
    prescreeningAI: {
      score: 82,
      status: 'continua',
      resumen: 'Javier es muy orientado a resultados y habla en métricas. Perfil data-driven con experiencia en optimización de producto a escala. Su limitación en inglés fue evidente en la pre-entrevista pero no bloqueante para el rol si el equipo opera en español.',
      noNegociables: [
        { label: 'Experiencia en Design Systems', score: 86, evidencia: 'Implementó design system en Rappi para plataforma con 2M+ usuarios. Sistema de componentes con 80+ elementos documentados para mobile y web.' } as any,
        { label: 'Liderazgo de equipos', score: 68, evidencia: 'Coordinación informal de 2 diseñadores junior en proyectos específicos. Sin rol formal de liderazgo en Rappi.' } as any,
        { label: 'Experiencia en productos B2B', score: 58, evidencia: 'Experiencia 100% B2C en e-commerce y delivery. Comprensión limitada de dinámicas B2B según la pre-entrevista.' } as any,
        { label: 'Dominio de Figma', score: 92, evidencia: 'Figma como herramienta central. Creó librería de componentes completa y maneja variables, auto-layout y prototipado avanzado con flujos de checkout.' } as any,
        { label: 'Inglés conversacional', score: 55, evidencia: 'Nivel B2 confirmado en pre-entrevista. Comunicación básica posible pero sin fluidez en discusiones técnicas complejas en inglés.' } as any,
      ],
      plusDetectados: [
        'Aumento de conversión de checkout en 28% — impacto medible en métricas clave de negocio',
        'Design system para plataforma con 2M+ usuarios — experiencia en escala real y gobernanza de sistema',
        'Muy orientado a datos: usa analytics y A/B testing como parte de su proceso de diseño',
      ],
      senales: [
        'Inglés B2 no cumple requisito C1 — riesgo real si el rol requiere comunicación con stakeholders internacionales',
        'Sin experiencia B2B: validar si puede adaptar su mentalidad de conversión al ciclo de venta enterprise',
        'Liderazgo aún informal — puede ser una limitante para rol senior con responsabilidades de equipo',
      ],
    },
  },
  {
    id: 'c7',
    name: 'Ana García',
    role: 'Digital Marketing Designer',
    sector: 'Marketing Digital, Redes Sociales',
    years: '8 Años',
    location: 'Buenos Aires, Argentina',
    bio: 'Estratega de contenido digital: ayudando a marcas a construir su presencia en redes sociales y aumentar el engagement.',
    score: 74,
    photo: 'https://randomuser.me/api/portraits/women/56.jpg',
    avatarInitials: 'AG',
    avatarColor: '#D32F2F',
    hasCurrentJob: true,
    currentCompany: 'WPP Agency',
    currentRole: 'Creative Director',
    superpoder: '"Narración de marca a escala"',
    aspiration: "$15'000.000",
    budget: "$12'000.000",
    salaryRange: 'fuera_de_rango',
    currentStage: 'scoring',
    scoringAI: {
      score: 74,
      status: 'pendiente',
      resumen: 'Designer con background en marketing y comunicación, sin experiencia en product design.',
      noNegociables: [
        { label: 'Ubicación: Buenos Aires, Argentina', cumple: false },
        { label: 'Experiencia +5 años en Product Design', cumple: false },
        { label: 'Sector: Fintech o SaaS B2B', cumple: false },
        { label: 'Herramientas: Figma + Design Systems', cumple: false },
        { label: 'Inglés: Nivel avanzado (C1)', cumple: true },
      ],
      logros: [
        'Dirigió campaña viral con 10M+ impresiones orgánicas',
        'Construyó equipo creativo de 20 personas desde cero',
      ],
      senales: [
        'No tiene experiencia en product design ni UX',
        'Background en marketing no se alinea con el rol',
        'Aspiración salarial 25% sobre presupuesto',
      ],
    },
  },
  {
    id: 'c8',
    name: 'Sofía Martínez',
    role: 'Sustainability Designer',
    sector: 'Desarrollo Sustentable, Energías Renovables',
    years: '4 Años',
    location: 'Santiago, Chile',
    bio: 'Consultora en proyectos de energías limpias, enfocada en promover la sostenibilidad y la eficiencia energética.',
    score: 74,
    photo: 'https://randomuser.me/api/portraits/women/62.jpg',
    avatarInitials: 'SM',
    avatarColor: '#FFBF0F',
    hasCurrentJob: false,
    lastCompany: 'SolarTech Chile',
    lastRole: 'UX Designer',
    lastDate: '01/2025',
    superpoder: '"Diseño para impacto ambiental positivo"',
    aspiration: "$9'000.000",
    budget: "$12'000.000",
    salaryRange: 'en_rango',
    currentStage: 'scoring',
    scoringAI: {
      score: 74,
      status: 'pendiente',
      resumen: 'Designer junior con enfoque en sustentabilidad, experiencia limitada en SaaS B2B.',
      noNegociables: [
        { label: 'Ubicación: Santiago, Chile', cumple: false },
        { label: 'Experiencia +5 años en Product Design', cumple: false },
        { label: 'Sector: Fintech o SaaS B2B', cumple: false },
        { label: 'Herramientas: Figma + Design Systems', cumple: true },
        { label: 'Inglés: Nivel avanzado (C1)', cumple: false },
      ],
      logros: [
        'Diseñó app de seguimiento de huella de carbono con 50K descargas',
        'Creó sistema de iconografía para campaña ambiental internacional',
      ],
      senales: [
        'Experiencia insuficiente (4 años vs +5 requeridos)',
        'Sector no alineado con fintech B2B',
      ],
    },
  },
  {
    id: 'c9',
    name: 'Diego Pérez',
    role: 'Biotech UX',
    sector: 'Salud, Biotecnología',
    years: '5 Años',
    location: 'Montevideo, Uruguay',
    bio: 'Investigador en biotecnología, enfocado en el desarrollo de nuevos terapias y tratamientos innovadores.',
    score: 74,
    photo: 'https://randomuser.me/api/portraits/men/55.jpg',
    avatarInitials: 'DP',
    avatarColor: '#295BFF',
    hasCurrentJob: true,
    currentCompany: 'GenomaTech',
    currentRole: 'UX Researcher',
    superpoder: '"Traducir ciencia compleja en UX intuitiva"',
    aspiration: "$10'000.000",
    budget: "$12'000.000",
    salaryRange: 'en_rango',
    currentStage: 'scoring',
    scoringAI: {
      score: 74,
      status: 'pendiente',
      resumen: 'UX con background científico, experiencia en biotech pero no en SaaS B2B.',
      noNegociables: [
        { label: 'Ubicación: Montevideo, Uruguay', cumple: false },
        { label: 'Experiencia +5 años en Product Design', cumple: true },
        { label: 'Sector: Fintech o SaaS B2B', cumple: false },
        { label: 'Herramientas: Figma + Design Systems', cumple: true },
        { label: 'Inglés: Nivel avanzado (C1)', cumple: true },
      ],
      logros: [
        'Diseñó interfaz para equipos de laboratorio reduciendo errores en 40%',
        'Publicó investigación sobre UX en entornos de alta precisión',
      ],
      senales: [
        'Sector biotecnología muy distante de fintech SaaS',
      ],
    },
  },
  {
    id: 'c10',
    name: 'Claudia Ruiz',
    role: 'EdTech Designer',
    sector: 'Educación, Tecnología',
    years: '6 Años',
    location: 'Ciudad de México, México',
    bio: 'Desarrolladora de plataformas educativas en línea, facilitando el acceso al aprendizaje digital.',
    score: 74,
    avatarInitials: 'CR',
    avatarColor: '#8750F6',
    hasCurrentJob: true,
    currentCompany: 'Coursera LATAM',
    currentRole: 'Product Designer',
    superpoder: '"Experiencias de aprendizaje que escalan"',
    aspiration: "$11'500.000",
    budget: "$12'000.000",
    salaryRange: 'en_rango',
    currentStage: 'scoring',
    scoringAI: {
      score: 74,
      status: 'pendiente',
      resumen: 'Designer en EdTech con experiencia en plataformas de alto tráfico, sin background en fintech.',
      noNegociables: [
        { label: 'Ubicación: Ciudad de México, México', cumple: false },
        { label: 'Experiencia +5 años en Product Design', cumple: true },
        { label: 'Sector: Fintech o SaaS B2B', cumple: false },
        { label: 'Herramientas: Figma + Design Systems', cumple: true },
        { label: 'Inglés: Nivel avanzado (C1)', cumple: false },
      ],
      logros: [
        'Rediseñó plataforma de aprendizaje usada por 2M+ estudiantes en LATAM',
        'Aumentó retención de usuarios en 45% con rediseño de onboarding',
      ],
      senales: [
        'Sector EdTech vs Fintech B2B',
        'Inglés B1, no cumple requisito',
      ],
    },
  },
  {
    id: 'c11',
    name: 'Fernando González',
    role: 'Cybersecurity UX',
    sector: 'Ciberseguridad, Tecnología',
    years: '7 Años',
    location: 'Caracas, Venezuela',
    bio: 'Experto en la protección de datos y sistemas informáticos, asegurando la integridad de la información.',
    score: 64,
    avatarInitials: 'FG',
    avatarColor: '#D32F2F',
    hasCurrentJob: true,
    currentCompany: 'CyberShield',
    currentRole: 'Security UX Lead',
    superpoder: '"Diseño seguro y privacidad por defecto"',
    aspiration: "$16'000.000",
    budget: "$12'000.000",
    salaryRange: 'fuera_de_rango',
    currentStage: 'scoring',
    scoringAI: {
      score: 64,
      status: 'rechazado',
      resumen: 'UX especializado en seguridad, con aspiración salarial muy por encima del presupuesto.',
      noNegociables: [
        { label: 'Ubicación: Caracas, Venezuela', cumple: false },
        { label: 'Experiencia +5 años en Product Design', cumple: true },
        { label: 'Sector: Fintech o SaaS B2B', cumple: false },
        { label: 'Herramientas: Figma + Design Systems', cumple: false },
        { label: 'Inglés: Nivel avanzado (C1)', cumple: true },
      ],
      logros: [
        'Diseñó arquitectura de seguridad UX para banco con 1M+ clientes',
      ],
      senales: [
        'Aspiración 33% sobre presupuesto',
        'No usa Figma como herramienta principal',
        'Ubicación Venezuela',
      ],
    },
  },
  {
    id: 'c12',
    name: 'Vanessa Castro',
    role: 'Brand Designer',
    sector: 'Diseño Gráfico, Branding',
    years: '5 Años',
    location: 'Quito, Ecuador',
    bio: 'Diseñadora gráfica especializada en la creación de identidades visuales y estrategias de branding efectivas.',
    score: 64,
    avatarInitials: 'VC',
    avatarColor: '#FFBF0F',
    hasCurrentJob: false,
    lastCompany: 'Publicis Ecuador',
    lastRole: 'Senior Brand Designer',
    lastDate: '11/2024',
    superpoder: '"Identidades de marca que perduran"',
    aspiration: "$9'500.000",
    budget: "$12'000.000",
    salaryRange: 'en_rango',
    currentStage: 'scoring',
    scoringAI: {
      score: 64,
      status: 'rechazado',
      resumen: 'Brand designer sin experiencia en product design o UX.',
      noNegociables: [
        { label: 'Ubicación: Quito, Ecuador', cumple: false },
        { label: 'Experiencia +5 años en Product Design', cumple: false },
        { label: 'Sector: Fintech o SaaS B2B', cumple: false },
        { label: 'Herramientas: Figma + Design Systems', cumple: false },
        { label: 'Inglés: Nivel avanzado (C1)', cumple: false },
      ],
      logros: [
        'Creó identidad visual para 30+ startups en LATAM',
      ],
      senales: [
        'No cumple prácticamente ningún no negociable',
        'Background en branding, no en UX/product',
      ],
    },
  },
  {
    id: 'c13',
    name: 'Hugo Alvarado',
    role: 'AI/ML Designer',
    sector: 'Desarrollo de Software, Inteligencia Artificial',
    years: '5 Años',
    location: 'Asunción, Paraguay',
    bio: 'Ingeniero de software con experiencia en el desarrollo de soluciones basadas en inteligencia artificial y machine learning.',
    score: 64,
    avatarInitials: 'HA',
    avatarColor: '#295BFF',
    hasCurrentJob: true,
    currentCompany: 'TechCorp AI',
    currentRole: 'ML Engineer / Designer',
    superpoder: '"Diseño de sistemas AI explicables"',
    aspiration: "$13'500.000",
    budget: "$12'000.000",
    salaryRange: 'fuera_de_rango',
    currentStage: 'scoring',
    scoringAI: {
      score: 64,
      status: 'rechazado',
      resumen: 'Perfil híbrido ingeniero-diseñador, sin profundidad en UX/product design.',
      noNegociables: [
        { label: 'Ubicación: Asunción, Paraguay', cumple: false },
        { label: 'Experiencia +5 años en Product Design', cumple: false },
        { label: 'Sector: Fintech o SaaS B2B', cumple: false },
        { label: 'Herramientas: Figma + Design Systems', cumple: false },
        { label: 'Inglés: Nivel avanzado (C1)', cumple: true },
      ],
      logros: [
        'Diseñó dashboards de ML interpretables para equipos de datos',
      ],
      senales: [
        'Perfil más de ingeniería que de diseño',
        'Sin portfolio de product design',
      ],
    },
  },
  {
    id: 'c14',
    name: 'Patricia Suárez',
    role: 'Motion Designer',
    sector: 'Animación, Entretenimiento',
    years: '6 Años',
    location: 'Lima, Perú',
    bio: 'Artista de animación con experiencia en producción de contenido para plataformas de streaming y publicidad digital.',
    score: 64,
    avatarInitials: 'PS',
    avatarColor: '#8750F6',
    hasCurrentJob: true,
    currentCompany: 'Netflix LATAM',
    currentRole: 'Motion Designer',
    superpoder: '"Animación que cuenta historias de marca"',
    aspiration: "$14'000.000",
    budget: "$12'000.000",
    salaryRange: 'fuera_de_rango',
    currentStage: 'scoring',
    scoringAI: {
      score: 64,
      status: 'rechazado',
      resumen: 'Motion designer sin experiencia en UX o product design.',
      noNegociables: [
        { label: 'Ubicación: Lima, Perú', cumple: false },
        { label: 'Experiencia +5 años en Product Design', cumple: false },
        { label: 'Sector: Fintech o SaaS B2B', cumple: false },
        { label: 'Herramientas: Figma + Design Systems', cumple: false },
        { label: 'Inglés: Nivel avanzado (C1)', cumple: true },
      ],
      logros: [
        'Creó más de 200 assets animados para campañas de Netflix LATAM',
      ],
      senales: [
        'Perfil de motion/entertaiment, no product design',
        'Aspiración sobre presupuesto',
      ],
    },
  },
];

// ─── Finalist Profiles ───────────────────────────────────────────────────────

export const finalistProfiles: FinalistProfile[] = [
  {
    ...candidates[0],
    resumenCandidato: [
      'Product Designer con +7 años liderando productos digitales en banca, Fintech y SaaS. Background sólido en diseño industrial y marketing.',
      'Ha creado Design System basado en Angular Material con 90% de adopción organizacional. Track record comprobado en mejora de experiencia.',
      'Perfil sistémico que se mueve cómodo en contextos consultivos y equipos que necesitan orden estructural y rigor técnico.',
    ],
    logrosDestacados: [
      { value: '40%', label: 'Menos tiempo de diseño', descripcion: 'Biblioteca de componentes reutilizables adoptada por 15 developers' },
      { value: '75%', label: 'Reducción inconsistencias', descripcion: 'Design System escalable en 3 productos B2B durante 2022-2024' },
      { value: '8', label: 'Casos de estudio', descripcion: 'Portfolio documenta proyectos fintech B2B con métricas de impacto' },
      { value: '8+', label: 'Proyectos simultáneos', descripcion: 'Colaboración cross-funcional con Product, Engineering y Data' },
    ],
    fitCultural: {
      narrative: 'Gilmar encaja como líder de producto que piensa como diseñador. Viene de entornos exigentes: Fintech B2B SaaS donde ha consolidado procesos y formalizado sistemas fragmentados. No es un ejecutor de pantallas: estructura, documenta y gobierna.',
      afinidad: [
        'Se mueve en equipos horizontales y colaborativos con cultura de datos y alta autonomía',
        'Encaja en organizaciones con madurez digital que requieren rigor técnico más que acompañamiento operativo',
      ],
      noNegociables: [
        'Mentalidad design-to-code: Entiende las implicaciones técnicas de sus decisiones',
        'Ownership y conexión directa con desarrollo para handoffs limpios',
        'Rigor en estructuración de procesos más que en micromanagement operativo',
      ],
      proyeccion: 'Head of Design → Referente de Design Systems en fintech LATAM',
    },
    estiloTrabajo: [
      { label: 'Autonomía', score: 85, descripcion: 'Toma decisiones sin necesitar validación constante. Se mueve bien en contextos de alta autonomía con ownership claro.' },
      { label: 'Estructura', score: 65, descripcion: 'Prefiere frameworks y procesos claros, pero es flexible cuando el contexto lo requiere. Balance entre orden y adaptabilidad.' },
      { label: 'Colaboración', score: 92, descripcion: 'Trabaja mejor en equipo que solo. Valora feedback continuo y sesiones de trabajo colaborativas con Product y Engineering.' },
      { label: 'Hard Skills', score: 78, descripcion: 'Dominio técnico sólido con herramientas core (Figma, Design Systems) con interés activo en profundizar en áreas como research generativo.' },
      { label: 'Adaptabilidad', score: 88, descripcion: 'Se ajusta rápido a cambios de prioridades y contextos nuevos. Experiencia trabajando en startups con pivots frecuentes.' },
    ],
  },
];

// ─── Interview Data ───────────────────────────────────────────────────────────

export type InterviewStatus = 'completed' | 'pending' | 'not_started';

export type RecomendacionValue = 'definitivamente' | 'con_reservas' | 'no_seguro' | 'no_recomiendo';

export interface InterviewFeedback {
  destacados: string;
  ratingA: number;
  ratingB: number;
  ratingC: number;
  senalAlerta: string;
  recomendacion: RecomendacionValue | null;
  date: string;
  duration: string;
  interviewer: string;
}

export interface CandidateInterview {
  candidateId: string;
  hrStatus: InterviewStatus;
  hmStatus: InterviewStatus;
  hrFeedback?: InterviewFeedback;
  hmFeedback?: InterviewFeedback;
  hmLink: string;
  hmMeta?: { date: string; duration: string; interviewer: string };
  techTestMeta?: { date: string; duration: string; interviewer: string };
}

export const interviewData: CandidateInterview[] = [
  {
    candidateId: 'c1',
    hrStatus: 'completed',
    hmStatus: 'pending',
    hrFeedback: {
      destacados: 'Excelente capacidad de comunicación y pensamiento sistémico. Demostró dominio profundo de design systems y su impacto en el negocio.',
      ratingA: 5,
      ratingB: 4,
      ratingC: 5,
      senalAlerta: 'Mencionó preferencia por trabajo completamente remoto.',
      recomendacion: 'definitivamente',
      date: '15 Dic 2024',
      duration: '45 min',
      interviewer: 'María López - HR Manager',
    },
    hmLink: 'https://unio.app/eval/abc123xyz789',
    hmMeta: { date: '17 Dic 2024', duration: '45 min', interviewer: 'Carlos Ruiz - VP Sales' },
  },
  {
    candidateId: 'c2',
    hrStatus: 'completed',
    hmStatus: 'completed',
    hrFeedback: {
      destacados: 'Perfil muy técnico con gran capacidad de investigación. Claridad en la articulación de sus decisiones de diseño.',
      ratingA: 4,
      ratingB: 5,
      ratingC: 4,
      senalAlerta: '',
      recomendacion: 'definitivamente',
      date: '16 Dic 2024',
      duration: '50 min',
      interviewer: 'María López - HR Manager',
    },
    hmFeedback: {
      destacados: 'Dominio técnico impresionante. Comprende los trade-offs de diseño en contextos de alta complejidad.',
      ratingA: 5,
      ratingB: 5,
      ratingC: 3,
      senalAlerta: 'Puede necesitar tiempo de adaptación al contexto B2B.',
      recomendacion: 'definitivamente',
      date: '18 Dic 2024',
      duration: '60 min',
      interviewer: 'Carlos Ruiz - VP Sales',
    },
    hmLink: 'https://unio.app/eval/def456xyz789',
    techTestMeta: { date: '22 Dic 2024', duration: '45 min', interviewer: 'Carlos Ruiz - VP Sales' },
  },
  {
    candidateId: 'c3',
    hrStatus: 'not_started',
    hmStatus: 'not_started',
    hmLink: 'https://unio.app/eval/ghi789xyz789',
  },
  {
    candidateId: 'c4',
    hrStatus: 'completed',
    hmStatus: 'pending',
    hrFeedback: {
      destacados: 'Gran capacidad de storytelling visual. Presenta sus ideas con mucha claridad y convicción.',
      ratingA: 4,
      ratingB: 3,
      ratingC: 5,
      senalAlerta: 'Experiencia principalmente en B2C podría requerir curva de adaptación.',
      recomendacion: 'con_reservas',
      date: '17 Dic 2024',
      duration: '40 min',
      interviewer: 'María López - HR Manager',
    },
    hmLink: 'https://unio.app/eval/jkl012xyz789',
    hmMeta: { date: '19 Dic 2024', duration: '40 min', interviewer: 'Carlos Ruiz - VP Sales' },
  },
  {
    candidateId: 'c5',
    hrStatus: 'pending',
    hmStatus: 'not_started',
    hmLink: 'https://unio.app/eval/mno345xyz789',
  },
  {
    candidateId: 'c6',
    hrStatus: 'completed',
    hmStatus: 'completed',
    hrFeedback: {
      destacados: 'Muy orientado a métricas y resultados. Sabe conectar el diseño con el impacto en conversión.',
      ratingA: 3,
      ratingB: 4,
      ratingC: 4,
      senalAlerta: '',
      recomendacion: 'con_reservas',
      date: '18 Dic 2024',
      duration: '45 min',
      interviewer: 'María López - HR Manager',
    },
    hmFeedback: {
      destacados: 'Conoce bien los flujos de e-commerce. Adaptable y con buena actitud.',
      ratingA: 3,
      ratingB: 4,
      ratingC: 4,
      senalAlerta: 'Inglés podría ser una barrera en reuniones con stakeholders internacionales.',
      recomendacion: 'con_reservas',
      date: '20 Dic 2024',
      duration: '55 min',
      interviewer: 'Carlos Ruiz - VP Sales',
    },
    hmLink: 'https://unio.app/eval/pqr678xyz789',
  },
  {
    candidateId: 'c7',
    hrStatus: 'not_started',
    hmStatus: 'not_started',
    hmLink: 'https://unio.app/eval/stu901xyz789',
  },
  {
    candidateId: 'c8',
    hrStatus: 'pending',
    hmStatus: 'not_started',
    hmLink: 'https://unio.app/eval/vwx234xyz789',
  },
  {
    candidateId: 'c9',
    hrStatus: 'not_started',
    hmStatus: 'not_started',
    hmLink: 'https://unio.app/eval/yza567xyz789',
  },
  {
    candidateId: 'c10',
    hrStatus: 'completed',
    hmStatus: 'pending',
    hrFeedback: {
      destacados: 'Candidato con gran experiencia en plataformas de alto tráfico. Muy metódico en su proceso de diseño.',
      ratingA: 4,
      ratingB: 4,
      ratingC: 3,
      senalAlerta: '',
      recomendacion: 'definitivamente',
      date: '19 Dic 2024',
      duration: '50 min',
      interviewer: 'María López - HR Manager',
    },
    hmLink: 'https://unio.app/eval/bcd890xyz789',
    hmMeta: { date: '21 Dic 2024', duration: '50 min', interviewer: 'Carlos Ruiz - VP Sales' },
  },
  // ─── Demo TH (mth-1 a mth-10) — Analista de Talento Humano ──────────────
  { candidateId: 'mth-1', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con proceso de selección masiva muy bien estructurado. Maneja KPIs de tiempo de cierre y costo por contratación con datos precisos. Dominio comprobado de ATS y pruebas Cleaver/DISC en entornos industriales.', ratingA: 5, ratingB: 5, ratingC: 4, senalAlerta: 'Confirmar disponibilidad de inicio inmediata para proceso urgente.', recomendacion: 'definitivamente', date: '10 Feb 2025', duration: '45 min', interviewer: 'Ana Rodríguez - Directora RRHH' }, hmFeedback: { destacados: 'Excelente comprensión de los requerimientos de selección para manufactura. Propuso mejoras al proceso de onboarding que evidencian visión más allá del cargo.', ratingA: 5, ratingB: 4, ratingC: 5, senalAlerta: '', recomendacion: 'definitivamente', date: '14 Feb 2025', duration: '40 min', interviewer: 'Patricia Salazar - Gerente de Planta' }, hmLink: 'https://unio.app/eval/mth-1' },
  { candidateId: 'mth-2', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con experiencia sólida en selección masiva y ATS. Presenta indicadores de gestión propios y metodología estructurada para entrevistas por competencias.', ratingA: 5, ratingB: 5, ratingC: 4, senalAlerta: 'Aspiración salarial ligeramente alta — validar flexibilidad.', recomendacion: 'definitivamente', date: '11 Feb 2025', duration: '45 min', interviewer: 'Ana Rodríguez - Directora RRHH' }, hmFeedback: { destacados: 'Muy buen entendimiento del reclutamiento operativo en manufactura. Velocidad de cierre notable y manejo claro de volúmenes altos.', ratingA: 5, ratingB: 5, ratingC: 4, senalAlerta: '', recomendacion: 'definitivamente', date: '15 Feb 2025', duration: '40 min', interviewer: 'Patricia Salazar - Gerente de Planta' }, hmLink: 'https://unio.app/eval/mth-2' },
  { candidateId: 'mth-3', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Perfil con experiencia directa en selección para líneas de producción. Manejo correcto de ATS y pruebas psicotécnicas. Buena comunicación y estructura en la entrevista.', ratingA: 4, ratingB: 5, ratingC: 4, senalAlerta: 'Confirmar disponibilidad para trabajar en planta dos días a la semana.', recomendacion: 'definitivamente', date: '11 Feb 2025', duration: '40 min', interviewer: 'Ana Rodríguez - Directora RRHH' }, hmFeedback: { destacados: 'Buen entendimiento del proceso de selección masiva en manufactura. Se adapta rápido a los requerimientos operativos del área.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Validar si ha gestionado procesos de más de 50 posiciones simultáneas.', recomendacion: 'definitivamente', date: '15 Feb 2025', duration: '35 min', interviewer: 'Patricia Salazar - Gerente de Planta' }, hmLink: 'https://unio.app/eval/mth-3' },
  { candidateId: 'mth-4', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con formación sólida y experiencia en selección y bienestar laboral. Maneja ATS y pruebas psicotécnicas con autonomía. Buena orientación al proceso.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Aspiración fuera de rango — necesita alineación.', recomendacion: 'definitivamente', date: '12 Feb 2025', duration: '40 min', interviewer: 'Ana Rodríguez - Directora RRHH' }, hmFeedback: { destacados: 'Comprende los requerimientos del área de manufactura y tiene buena disposición para adaptarse al ritmo operativo.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Revisar expectativa salarial antes de avanzar.', recomendacion: 'con_reservas', date: '16 Feb 2025', duration: '35 min', interviewer: 'Patricia Salazar - Gerente de Planta' }, hmLink: 'https://unio.app/eval/mth-4' },
  { candidateId: 'mth-5', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Perfil con experiencia en selección operativa y conocimiento de legislación laboral básica. Maneja entrevistas por competencias y trabaja bien con volúmenes de candidatos altos.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Sin experiencia en empresa de manufactura de gran escala.', recomendacion: 'definitivamente', date: '12 Feb 2025', duration: '40 min', interviewer: 'Ana Rodríguez - Directora RRHH' }, hmFeedback: { destacados: 'Disposición positiva y entiende la dinámica de selección en manufactura. Necesita acompañamiento inicial en los primeros meses.', ratingA: 4, ratingB: 4, ratingC: 3, senalAlerta: 'Curva de aprendizaje en el contexto industrial puede ser significativa.', recomendacion: 'con_reservas', date: '17 Feb 2025', duration: '35 min', interviewer: 'Patricia Salazar - Gerente de Planta' }, hmLink: 'https://unio.app/eval/mth-5' },
  { candidateId: 'mth-6', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con formación en RRHH y experiencia en selección básica. Maneja conceptos fundamentales del proceso y trabaja bien con candidatos. Menor autonomía en procesos masivos.', ratingA: 4, ratingB: 3, ratingC: 4, senalAlerta: 'Aspiración fuera de rango — confirmar si hay flexibilidad real.', recomendacion: 'con_reservas', date: '13 Feb 2025', duration: '35 min', interviewer: 'Ana Rodríguez - Directora RRHH' }, hmFeedback: { destacados: 'Conoce el proceso básico de selección. Necesitará refuerzo en selección masiva y en el ritmo exigente de manufactura.', ratingA: 3, ratingB: 3, ratingC: 4, senalAlerta: 'Sin experiencia en entornos de alta presión de selección.', recomendacion: 'con_reservas', date: '18 Feb 2025', duration: '30 min', interviewer: 'Patricia Salazar - Gerente de Planta' }, hmLink: 'https://unio.app/eval/mth-6' },
  { candidateId: 'mth-7', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con experiencia en apoyo a procesos de selección y aplicación de pruebas. Buen manejo de herramientas básicas de ATS. Requiere mayor autonomía para gestión sin supervisión.', ratingA: 3, ratingB: 4, ratingC: 3, senalAlerta: 'Poca experiencia en selección de personal operativo masivo.', recomendacion: 'con_reservas', date: '13 Feb 2025', duration: '35 min', interviewer: 'Ana Rodríguez - Directora RRHH' }, hmFeedback: { destacados: 'Tiene bases en RRHH pero el nivel de exigencia del cargo requiere más rodaje en procesos industriales de volumen.', ratingA: 3, ratingB: 3, ratingC: 3, senalAlerta: 'Validar si puede manejar 15+ posiciones abiertas simultáneamente.', recomendacion: 'con_reservas', date: '18 Feb 2025', duration: '30 min', interviewer: 'Patricia Salazar - Gerente de Planta' }, hmLink: 'https://unio.app/eval/mth-7' },
  { candidateId: 'mth-8', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata organizada con buen manejo de la entrevista. Experiencia en RRHH orientada más a administración de personal que a selección masiva. Conoce las herramientas pero con uso limitado.', ratingA: 3, ratingB: 3, ratingC: 4, senalAlerta: 'Menor experiencia en selección masiva que la requerida por el cargo.', recomendacion: 'con_reservas', date: '14 Feb 2025', duration: '35 min', interviewer: 'Ana Rodríguez - Directora RRHH' }, hmFeedback: { destacados: 'Perfil correcto pero con brecha en la velocidad y volumen de selección requeridos por Termoformados.', ratingA: 3, ratingB: 3, ratingC: 3, senalAlerta: 'Supervisar de cerca el onboarding y establecer metas claras de ramp-up.', recomendacion: 'con_reservas', date: '19 Feb 2025', duration: '30 min', interviewer: 'Patricia Salazar - Gerente de Planta' }, hmLink: 'https://unio.app/eval/mth-8' },
  { candidateId: 'mth-9', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con formación en proceso y experiencia puntual en selección. Sin dominio de ATS formal ni métricas de gestión. Requiere desarrollo significativo para el nivel del cargo.', ratingA: 3, ratingB: 3, ratingC: 3, senalAlerta: 'Aspiración fuera de rango — sin experiencia que lo justifique.', recomendacion: 'no_seguro', date: '14 Feb 2025', duration: '30 min', interviewer: 'Ana Rodríguez - Directora RRHH' }, hmFeedback: { destacados: 'No demuestra el nivel de autonomía esperado para el cargo. Requeriría supervisión constante en una operación de manufactura de alta demanda.', ratingA: 2, ratingB: 3, ratingC: 3, senalAlerta: 'Brecha significativa en experiencia y herramientas.', recomendacion: 'no_seguro', date: '19 Feb 2025', duration: '30 min', interviewer: 'Patricia Salazar - Gerente de Planta' }, hmLink: 'https://unio.app/eval/mth-9' },
  { candidateId: 'mth-10', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con conocimiento teórico de RRHH y poca práctica autónoma. No maneja ATS ni pruebas psicotécnicas certificadas. Perfil por debajo del mínimo requerido.', ratingA: 3, ratingB: 2, ratingC: 3, senalAlerta: 'Formación incompleta y sin métricas de gestión propias.', recomendacion: 'no_seguro', date: '15 Feb 2025', duration: '30 min', interviewer: 'Ana Rodríguez - Directora RRHH' }, hmFeedback: { destacados: 'Perfil con mucho por desarrollar. No está lista para manejar el volumen de selección que requiere Termoformados sin acompañamiento extenso.', ratingA: 2, ratingB: 2, ratingC: 3, senalAlerta: 'No recomendada para el cargo en esta etapa de desarrollo.', recomendacion: 'no_seguro', date: '20 Feb 2025', duration: '25 min', interviewer: 'Patricia Salazar - Gerente de Planta' }, hmLink: 'https://unio.app/eval/mth-10' },
  // ─── Demo Finanzas (mfin-1 a mfin-12) — Jefe de Finanzas ──────────────────
  { candidateId: 'mfin-1', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con dominio financiero excepcional. Maneja SAP FI/CO con fluidez, presenta indicadores ejecutivos con precisión y tiene experiencia sólida en costeo industrial de manufactura. Historial de liderazgo de equipos contables de alto rendimiento.', ratingA: 5, ratingB: 5, ratingC: 5, senalAlerta: 'Confirmar alineación con cultura organizacional antes del cierre.', recomendacion: 'definitivamente', date: '03 Mar 2025', duration: '50 min', interviewer: 'Luz Elena Vargas - Directora RRHH' }, hmFeedback: { destacados: 'Perfil financiero excepcional. Comprende el negocio industrial, presenta con claridad ejecutiva y tiene la visión estratégica que buscamos para liderar Finanzas en Termoformados.', ratingA: 5, ratingB: 5, ratingC: 5, senalAlerta: '', recomendacion: 'definitivamente', date: '07 Mar 2025', duration: '55 min', interviewer: 'Carlos Mora - Gerente General' }, hmLink: 'https://unio.app/eval/mfin-1', techTestMeta: { date: '11 Mar 2025', duration: '90 min', interviewer: 'Carlos Mora - Gerente General' } },
  { candidateId: 'mfin-2', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con amplia experiencia financiera en manufactura. Manejo avanzado de SAP y cierre contable mensual bajo presión. Excelente presentación de P&L y análisis de desviaciones presupuestales.', ratingA: 5, ratingB: 5, ratingC: 5, senalAlerta: 'Validar expectativa de planes de desarrollo a corto plazo.', recomendacion: 'definitivamente', date: '03 Mar 2025', duration: '50 min', interviewer: 'Luz Elena Vargas - Directora RRHH' }, hmFeedback: { destacados: 'Muy sólido. Entiende los KPIs financieros del negocio industrial y sabe conectarlos con las decisiones operativas de planta. Muy buen ajuste cultural también.', ratingA: 5, ratingB: 5, ratingC: 4, senalAlerta: '', recomendacion: 'definitivamente', date: '07 Mar 2025', duration: '50 min', interviewer: 'Carlos Mora - Gerente General' }, hmLink: 'https://unio.app/eval/mfin-2', techTestMeta: { date: '11 Mar 2025', duration: '90 min', interviewer: 'Carlos Mora - Gerente General' } },
  { candidateId: 'mfin-3', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con experiencia sólida en jefatura financiera. Maneja NIIF, SAP y análisis de costos por producto. Buena capacidad de liderazgo y presentación ejecutiva. Muy buen ajuste al perfil.', ratingA: 5, ratingB: 5, ratingC: 4, senalAlerta: 'Sin experiencia específica en sector de empaques plásticos — curva de aprendizaje en terminología técnica.', recomendacion: 'definitivamente', date: '04 Mar 2025', duration: '45 min', interviewer: 'Luz Elena Vargas - Directora RRHH' }, hmFeedback: { destacados: 'Candidato con visión financiera clara para manufactura. Sus análisis de costeo son sólidos y tiene experiencia en reportes a dirección regional. Muy buena opción.', ratingA: 5, ratingB: 4, ratingC: 5, senalAlerta: 'Reforzar en los primeros meses el conocimiento de la cadena de producción específica.', recomendacion: 'definitivamente', date: '08 Mar 2025', duration: '50 min', interviewer: 'Carlos Mora - Gerente General' }, hmLink: 'https://unio.app/eval/mfin-3', techTestMeta: { date: '12 Mar 2025', duration: '90 min', interviewer: 'Carlos Mora - Gerente General' } },
  { candidateId: 'mfin-4', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con experiencia financiera relevante y dominio de NIIF. Muy buena presentación ejecutiva y habilidad para comunicar el análisis financiero con claridad. Liderazgo de equipo demostrado.', ratingA: 5, ratingB: 5, ratingC: 4, senalAlerta: 'Sin experiencia en SAP — validar velocidad de adopción del ERP.', recomendacion: 'definitivamente', date: '04 Mar 2025', duration: '45 min', interviewer: 'Luz Elena Vargas - Directora RRHH' }, hmFeedback: { destacados: 'Buen perfil financiero. Presenta con claridad y tiene experiencia en presupuestación. Sin experiencia en SAP es una limitante pero manejable con entrenamiento rápido.', ratingA: 4, ratingB: 5, ratingC: 4, senalAlerta: 'Confirmar velocidad de onboarding en SAP antes de la decisión final.', recomendacion: 'definitivamente', date: '08 Mar 2025', duration: '45 min', interviewer: 'Carlos Mora - Gerente General' }, hmLink: 'https://unio.app/eval/mfin-4' },
  { candidateId: 'mfin-5', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con sólida formación financiera y experiencia en manufactura. Buen manejo de SAP y análisis de costos. Aspiración fuera de rango que requiere alineación antes de continuar.', ratingA: 4, ratingB: 4, ratingC: 5, senalAlerta: 'Aspiración fuera de rango — confirmar si hay flexibilidad real.', recomendacion: 'definitivamente', date: '05 Mar 2025', duration: '45 min', interviewer: 'Luz Elena Vargas - Directora RRHH' }, hmFeedback: { destacados: 'Perfil técnico sólido. Buen entendimiento del control financiero en manufactura. La brecha salarial es el único punto a resolver.', ratingA: 4, ratingB: 4, ratingC: 5, senalAlerta: 'Necesario alinear expectativa salarial antes de avanzar a decisión final.', recomendacion: 'con_reservas', date: '09 Mar 2025', duration: '45 min', interviewer: 'Carlos Mora - Gerente General' }, hmLink: 'https://unio.app/eval/mfin-5' },
  { candidateId: 'mfin-6', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con experiencia financiera sólida y buen manejo de NIIF. Excelente comunicación ejecutiva. Perfil equilibrado entre lo técnico y lo estratégico. Liderazgo de equipo comprobado.', ratingA: 5, ratingB: 4, ratingC: 4, senalAlerta: 'Menor experiencia en costeo industrial específico — área a reforzar.', recomendacion: 'definitivamente', date: '05 Mar 2025', duration: '45 min', interviewer: 'Luz Elena Vargas - Directora RRHH' }, hmFeedback: { destacados: 'Muy buen ajuste. Entiende el negocio industrial y comunica los números de forma ejecutiva y clara. Buen equilibrio entre rigor técnico y visión gerencial.', ratingA: 5, ratingB: 4, ratingC: 4, senalAlerta: '', recomendacion: 'definitivamente', date: '09 Mar 2025', duration: '45 min', interviewer: 'Carlos Mora - Gerente General' }, hmLink: 'https://unio.app/eval/mfin-6' },
  { candidateId: 'mfin-7', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con experiencia financiera en manufactura y buen dominio de SAP básico. Presenta informes con claridad y tiene experiencia en cierre contable mensual.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Sin experiencia en liderazgo de equipo financiero de más de 3 personas.', recomendacion: 'definitivamente', date: '06 Mar 2025', duration: '40 min', interviewer: 'Luz Elena Vargas - Directora RRHH' }, hmFeedback: { destacados: 'Conoce el entorno financiero de manufactura. Buen manejo técnico aunque con menor experiencia en liderazgo de equipo amplio.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Confirmar si ha liderado equipos de más de 3 personas formalmente.', recomendacion: 'con_reservas', date: '10 Mar 2025', duration: '40 min', interviewer: 'Carlos Mora - Gerente General' }, hmLink: 'https://unio.app/eval/mfin-7' },
  { candidateId: 'mfin-8', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con formación financiera correcta y experiencia en análisis de costos. Buena capacidad de comunicación. Nivel de inglés adecuado para reportes básicos.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Sin experiencia en SAP — maneja Siigo únicamente.', recomendacion: 'definitivamente', date: '06 Mar 2025', duration: '40 min', interviewer: 'Luz Elena Vargas - Directora RRHH' }, hmFeedback: { destacados: 'Candidato con base financiera sólida pero menor profundidad en liderazgo y visión estratégica del cargo. Buena actitud y disposición.', ratingA: 4, ratingB: 3, ratingC: 4, senalAlerta: 'Validar velocidad de adopción de SAP y capacidad para liderar equipo contable.', recomendacion: 'con_reservas', date: '10 Mar 2025', duration: '40 min', interviewer: 'Carlos Mora - Gerente General' }, hmLink: 'https://unio.app/eval/mfin-8' },
  { candidateId: 'mfin-9', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con experiencia financiera relevante y manejo de análisis de costos. Aspiración ligeramente fuera de rango. Perfil técnico adecuado pero con menor experiencia en liderazgo.', ratingA: 4, ratingB: 3, ratingC: 4, senalAlerta: 'Aspiración fuera de rango — revisar antes de continuar.', recomendacion: 'con_reservas', date: '06 Mar 2025', duration: '40 min', interviewer: 'Luz Elena Vargas - Directora RRHH' }, hmFeedback: { destacados: 'Candidato con conocimiento técnico correcto. Le falta profundidad en la visión estratégica del cargo. La brecha salarial también es un punto de fricción.', ratingA: 3, ratingB: 3, ratingC: 4, senalAlerta: 'Resolver la brecha salarial y validar visión estratégica antes de decisión.', recomendacion: 'con_reservas', date: '11 Mar 2025', duration: '35 min', interviewer: 'Carlos Mora - Gerente General' }, hmLink: 'https://unio.app/eval/mfin-9' },
  { candidateId: 'mfin-10', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con base contable sólida y experiencia en entorno de manufactura. Sin SAP formal pero con dominio de Excel avanzado y Siigo. Menor experiencia en presentaciones ejecutivas.', ratingA: 3, ratingB: 4, ratingC: 3, senalAlerta: 'Sin experiencia en jefatura formal ni presentaciones a comités directivos.', recomendacion: 'con_reservas', date: '07 Mar 2025', duration: '40 min', interviewer: 'Luz Elena Vargas - Directora RRHH' }, hmFeedback: { destacados: 'Candidato con bases técnicas correctas pero sin la visión ejecutiva requerida para el cargo de Jefe de Finanzas en esta escala.', ratingA: 3, ratingB: 3, ratingC: 3, senalAlerta: 'Requiere desarrollo importante en presentación ejecutiva y liderazgo.', recomendacion: 'no_seguro', date: '11 Mar 2025', duration: '35 min', interviewer: 'Carlos Mora - Gerente General' }, hmLink: 'https://unio.app/eval/mfin-10' },
  { candidateId: 'mfin-11', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con experiencia en contabilidad básica y análisis financiero incipiente. Formación adecuada pero sin manejo de ERP ni liderazgo de equipo.', ratingA: 3, ratingB: 3, ratingC: 4, senalAlerta: 'Sin SAP ni liderazgo de equipo comprobado.', recomendacion: 'no_seguro', date: '07 Mar 2025', duration: '35 min', interviewer: 'Luz Elena Vargas - Directora RRHH' }, hmFeedback: { destacados: 'Perfil con mucho desarrollo por delante. No está en el nivel de jefatura que requiere la empresa en este momento.', ratingA: 3, ratingB: 2, ratingC: 3, senalAlerta: 'No recomendada para el cargo en esta etapa de su carrera.', recomendacion: 'no_seguro', date: '12 Mar 2025', duration: '30 min', interviewer: 'Carlos Mora - Gerente General' }, hmLink: 'https://unio.app/eval/mfin-11' },
  { candidateId: 'mfin-12', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con experiencia financiera básica y aspiración fuera de rango. Sin dominio de SAP ni experiencia en jefatura. Perfil por debajo del umbral mínimo para el cargo.', ratingA: 3, ratingB: 3, ratingC: 3, senalAlerta: 'Aspiración fuera de rango y experiencia insuficiente para el nivel requerido.', recomendacion: 'no_seguro', date: '08 Mar 2025', duration: '35 min', interviewer: 'Luz Elena Vargas - Directora RRHH' }, hmFeedback: { destacados: 'No alcanza el perfil requerido para Jefe de Finanzas en empresa de manufactura.', ratingA: 2, ratingB: 3, ratingC: 3, senalAlerta: 'No recomendado para el cargo.', recomendacion: 'no_seguro', date: '12 Mar 2025', duration: '30 min', interviewer: 'Carlos Mora - Gerente General' }, hmLink: 'https://unio.app/eval/mfin-12' },
  // ─── Demo Ventas evaluaciones (mv-1 a mv-10) — Gerente de Ventas ───────────
  { candidateId: 'mv-1', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con trayectoria comercial excepcional en B2B industrial. Historial documentado de cumplimiento 108% sostenido, liderazgo de equipos de 15+ asesores y apertura exitosa de mercados. Presenta con precisión y visión estratégica.', ratingA: 5, ratingB: 5, ratingC: 5, senalAlerta: 'Confirmar motivo de salida del cargo actual.', recomendacion: 'definitivamente', date: '14 Mar 2025', duration: '55 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmFeedback: { destacados: 'El mejor candidato visto hasta ahora. Comprende el modelo de negocio B2B industrial, habló con datos concretos de sus resultados y tiene exactamente el perfil de liderazgo que buscamos en InduCom.', ratingA: 5, ratingB: 5, ratingC: 5, senalAlerta: '', recomendacion: 'definitivamente', date: '18 Mar 2025', duration: '60 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' }, hmLink: 'https://unio.app/eval/mv-1', techTestMeta: { date: '22 Mar 2025', duration: '120 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' } },
  { candidateId: 'mv-2', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con trayectoria comercial muy sólida. Liderazgo de equipos B2B con cumplimiento consistente de metas. Excelente relacionamiento estratégico y manejo de cuentas clave a nivel C-suite.', ratingA: 5, ratingB: 5, ratingC: 5, senalAlerta: 'Confirmarcarga de viaje esperada vs. disponibilidad.', recomendacion: 'definitivamente', date: '14 Mar 2025', duration: '50 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmFeedback: { destacados: 'Candidata con perfil gerencial claro. Dominio de Salesforce, visión de portafolio y experiencia real en apertura de nuevos mercados B2B en el sector industrial.', ratingA: 5, ratingB: 5, ratingC: 5, senalAlerta: '', recomendacion: 'definitivamente', date: '18 Mar 2025', duration: '55 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' }, hmLink: 'https://unio.app/eval/mv-2', techTestMeta: { date: '22 Mar 2025', duration: '120 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' } },
  { candidateId: 'mv-3', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con experiencia gerencial comercial sólida en distribución industrial. Excelente capacidad de relacionamiento y manejo de ciclos de venta largo B2B. Resultados verificables y sólidos.', ratingA: 5, ratingB: 5, ratingC: 4, senalAlerta: 'Validar experiencia específica en gestión de equipo de más de 10 asesores.', recomendacion: 'definitivamente', date: '15 Mar 2025', duration: '50 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmFeedback: { destacados: 'Muy buen perfil. Entiende el modelo comercial industrial, es disciplinado con los procesos y tiene la energía que busca InduCom para liderar la región.', ratingA: 5, ratingB: 5, ratingC: 4, senalAlerta: '', recomendacion: 'definitivamente', date: '19 Mar 2025', duration: '50 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' }, hmLink: 'https://unio.app/eval/mv-3', techTestMeta: { date: '23 Mar 2025', duration: '120 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' } },
  { candidateId: 'mv-4', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con trayectoria comercial sólida en B2B. Experiencia en gestión de equipos y cumplimiento de metas anuales. Buen manejo de Salesforce y pipeline de ventas.', ratingA: 5, ratingB: 4, ratingC: 4, senalAlerta: 'Aspiración en techo del rango — validar flexibilidad.', recomendacion: 'definitivamente', date: '15 Mar 2025', duration: '50 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmFeedback: { destacados: 'Perfil comercial consistente. Buen manejo de cuentas y visión estratégica razonable. Aspecto a revisar es la ambición de crecimiento vs. el alcance del cargo.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Confirmar alineación de expectativas de crecimiento con estructura de InduCom.', recomendacion: 'definitivamente', date: '19 Mar 2025', duration: '45 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' }, hmLink: 'https://unio.app/eval/mv-4', techTestMeta: { date: '23 Mar 2025', duration: '120 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' } },
  { candidateId: 'mv-5', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con experiencia en liderazgo comercial B2B y buen manejo de CRM. Historial de cumplimiento de metas individual y de equipo. Excelente comunicación y relacionamiento.', ratingA: 5, ratingB: 4, ratingC: 4, senalAlerta: 'Validar experiencia específica en sector industrial vs. consumo masivo.', recomendacion: 'definitivamente', date: '15 Mar 2025', duration: '45 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmFeedback: { destacados: 'Candidata con perfil comercial claro y orientación al resultado. Buena energía y relacionamiento. La adaptación al sector industrial requerirá acompañamiento inicial.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Confirmar velocidad de adaptación al contexto B2B industrial.', recomendacion: 'definitivamente', date: '20 Mar 2025', duration: '45 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' }, hmLink: 'https://unio.app/eval/mv-5', techTestMeta: { date: '24 Mar 2025', duration: '120 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' } },
  { candidateId: 'mv-6', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con experiencia sólida en gerencia comercial B2B. Resultados documentados y manejo de equipos. Aspiración fuera de rango que es un punto de fricción importante.', ratingA: 4, ratingB: 5, ratingC: 4, senalAlerta: 'Aspiración significativamente fuera de rango — requiere negociación.', recomendacion: 'con_reservas', date: '16 Mar 2025', duration: '50 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmFeedback: { destacados: 'Buen perfil gerencial pero la brecha salarial es un obstáculo real. El candidato no demostró flexibilidad. Buen candidato de backup si los top tres no cierran.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Solo avanzar si los tres primeros no se concretan.', recomendacion: 'con_reservas', date: '20 Mar 2025', duration: '45 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' }, hmLink: 'https://unio.app/eval/mv-6' },
  { candidateId: 'mv-7', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con experiencia comercial B2B y liderazgo de equipos medianos. Buen manejo de CRM y pipeline. Menor trayectoria en cuentas estratégicas de alto valor.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Sin experiencia en cuentas industriales de gran escala.', recomendacion: 'con_reservas', date: '16 Mar 2025', duration: '45 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmFeedback: { destacados: 'Candidata interesante con potencial. Le falta profundidad en la gestión de cuentas estratégicas para el nivel gerencial requerido.', ratingA: 4, ratingB: 3, ratingC: 4, senalAlerta: 'Validar si puede manejar relaciones C-suite con autonomía.', recomendacion: 'con_reservas', date: '20 Mar 2025', duration: '40 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' }, hmLink: 'https://unio.app/eval/mv-7' },
  { candidateId: 'mv-8', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con experiencia en ventas B2B y gestión de equipo. Manejo de Salesforce y buenos resultados individuales. Menor experiencia en apertura de nuevos territorios.', ratingA: 4, ratingB: 4, ratingC: 3, senalAlerta: 'Confirmar experiencia en gestión de nuevas cuentas vs. mantenimiento de cartera.', recomendacion: 'con_reservas', date: '16 Mar 2025', duration: '45 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmFeedback: { destacados: 'Candidato correcto pero sin el nivel de liderazgo y visión estratégica comercial requeridos por InduCom para una gerencia.', ratingA: 3, ratingB: 4, ratingC: 3, senalAlerta: 'No está listo para el nivel gerencial. Buen candidato para cargo de Líder Comercial.', recomendacion: 'con_reservas', date: '21 Mar 2025', duration: '40 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' }, hmLink: 'https://unio.app/eval/mv-8' },
  { candidateId: 'mv-9', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con experiencia en ventas y manejo de equipo pequeño. Aspiración fuera de rango. Buen relacionamiento pero sin la profundidad estratégica del cargo.', ratingA: 4, ratingB: 3, ratingC: 3, senalAlerta: 'Aspiración fuera de rango y experiencia gerencial limitada.', recomendacion: 'no_seguro', date: '17 Mar 2025', duration: '40 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmFeedback: { destacados: 'No alcanza el nivel gerencial requerido. Candidato de perfil junior para este cargo.', ratingA: 3, ratingB: 3, ratingC: 3, senalAlerta: 'No recomendado para el cargo de Gerente de Ventas.', recomendacion: 'no_seguro', date: '21 Mar 2025', duration: '35 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' }, hmLink: 'https://unio.app/eval/mv-9' },
  { candidateId: 'mv-10', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con experiencia comercial B2B básica. Sin dominio de CRM ni historial sólido de liderazgo de equipos. Perfil más orientado a asesor que a gerente.', ratingA: 3, ratingB: 4, ratingC: 3, senalAlerta: 'Sin métricas documentadas de cumplimiento ni liderazgo de equipo formal.', recomendacion: 'no_seguro', date: '17 Mar 2025', duration: '40 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmFeedback: { destacados: 'No tiene el perfil para el cargo. Recomendar para un rol de Asesor Comercial Senior en otra ocasión.', ratingA: 3, ratingB: 3, ratingC: 3, senalAlerta: 'No recomendada para este cargo.', recomendacion: 'no_seguro', date: '22 Mar 2025', duration: '30 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' }, hmLink: 'https://unio.app/eval/mv-10' },
  // ─── Demo Ventas entrevistas (mv-11 a mv-25) — HR completada ──────────────
  { candidateId: 'mv-11', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con experiencia gerencial en ventas B2B. Historial de cumplimiento de metas y buen manejo de equipo. Muy buena presentación ejecutiva.', ratingA: 4, ratingB: 4, ratingC: 5, senalAlerta: 'Confirmar disponibilidad para viaje frecuente.', recomendacion: 'definitivamente', date: '01 Mar 2025', duration: '45 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmFeedback: { destacados: 'Buen perfil comercial. Entiende el modelo B2B y tiene experiencia real en apertura de cuentas nuevas.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: '', recomendacion: 'definitivamente', date: '05 Mar 2025', duration: '40 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' }, hmLink: 'https://unio.app/eval/mv-11' },
  { candidateId: 'mv-12', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con trayectoria comercial consistente y liderazgo de equipos medianos. Buena comunicación ejecutiva. Resultados sólidos en los últimos 3 años.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Validar profundidad en sector industrial específicamente.', recomendacion: 'definitivamente', date: '01 Mar 2025', duration: '45 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmFeedback: { destacados: 'Buen candidato con orientación al resultado clara. Adaptación al sector puede tomar tiempo.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Monitorear adaptación al contexto industrial.', recomendacion: 'con_reservas', date: '05 Mar 2025', duration: '40 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' }, hmLink: 'https://unio.app/eval/mv-12' },
  { candidateId: 'mv-13', hrStatus: 'completed', hmStatus: 'pending', hrFeedback: { destacados: 'Candidato con experiencia comercial B2B y resultados comprobados. Aspiración ligeramente fuera de rango. Buen manejo de Salesforce y equipo de 8 asesores.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Aspiración fuera de rango — negociar antes de avanzar.', recomendacion: 'con_reservas', date: '02 Mar 2025', duration: '45 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmLink: 'https://unio.app/eval/mv-13' },
  { candidateId: 'mv-14', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con buena trayectoria en ventas B2B y liderazgo de equipo. Cumplimiento de metas documentado. Menor experiencia en sectores industriales específicos.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Sin experiencia en distribución industrial.', recomendacion: 'definitivamente', date: '02 Mar 2025', duration: '45 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmFeedback: { destacados: 'Perfil correcto con orientación al resultado. Curva de adaptación al sector industrial podría ser significativa.', ratingA: 4, ratingB: 3, ratingC: 4, senalAlerta: 'Acompañamiento en adaptación al contexto industrial.', recomendacion: 'con_reservas', date: '06 Mar 2025', duration: '40 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' }, hmLink: 'https://unio.app/eval/mv-14' },
  { candidateId: 'mv-15', hrStatus: 'completed', hmStatus: 'pending', hrFeedback: { destacados: 'Candidato con experiencia comercial sólida y manejo de CRM. Resultados anuales consistentes. Menor trayectoria en liderazgo de equipos grandes.', ratingA: 4, ratingB: 3, ratingC: 4, senalAlerta: 'Sin experiencia gestionando equipos de más de 6 personas.', recomendacion: 'definitivamente', date: '03 Mar 2025', duration: '40 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmLink: 'https://unio.app/eval/mv-15' },
  { candidateId: 'mv-16', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con experiencia en ventas B2B y manejo de cuentas medianas. Buen CRM y pipeline estructurado. Sin experiencia en liderazgo de equipo de más de 4 personas.', ratingA: 3, ratingB: 4, ratingC: 4, senalAlerta: 'Experiencia en liderazgo de equipo por debajo del umbral.', recomendacion: 'con_reservas', date: '03 Mar 2025', duration: '40 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmFeedback: { destacados: 'Candidata con orientación al resultado pero sin el nivel de liderazgo requerido para una gerencia comercial de esta escala.', ratingA: 3, ratingB: 4, ratingC: 3, senalAlerta: 'No está lista para el nivel gerencial. Seguir proceso como candidato backup.', recomendacion: 'no_seguro', date: '07 Mar 2025', duration: '35 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' }, hmLink: 'https://unio.app/eval/mv-16' },
  { candidateId: 'mv-17', hrStatus: 'completed', hmStatus: 'pending', hrFeedback: { destacados: 'Candidato con trayectoria en ventas B2B y liderazgo básico. Aspiración fuera de rango que complica el proceso.', ratingA: 3, ratingB: 4, ratingC: 3, senalAlerta: 'Aspiración fuera de rango — sin flexibilidad demostrada.', recomendacion: 'no_seguro', date: '03 Mar 2025', duration: '35 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmLink: 'https://unio.app/eval/mv-17' },
  { candidateId: 'mv-18', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con experiencia en ventas y seguimiento de cuentas. Sin liderazgo de equipo ni métricas formales. Perfil de asesor senior más que gerencial.', ratingA: 3, ratingB: 3, ratingC: 4, senalAlerta: 'Sin historial documentado de liderazgo de equipo.', recomendacion: 'no_seguro', date: '04 Mar 2025', duration: '35 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmFeedback: { destacados: 'No tiene el perfil gerencial. Buen asesor senior pero no gerente.', ratingA: 3, ratingB: 3, ratingC: 3, senalAlerta: 'No recomendada para el cargo.', recomendacion: 'no_seguro', date: '08 Mar 2025', duration: '30 min', interviewer: 'Andrés Castillo - CEO InduCom LATAM' }, hmLink: 'https://unio.app/eval/mv-18' },
  { candidateId: 'mv-19', hrStatus: 'completed', hmStatus: 'pending', hrFeedback: { destacados: 'Candidato con experiencia en ventas B2B básica. Sin métricas de liderazgo documentadas. Perfil insuficiente para el nivel gerencial.', ratingA: 3, ratingB: 3, ratingC: 3, senalAlerta: 'Sin liderazgo formal de equipo ni métricas de cumplimiento documentadas.', recomendacion: 'no_seguro', date: '04 Mar 2025', duration: '35 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmLink: 'https://unio.app/eval/mv-19' },
  { candidateId: 'mv-20', hrStatus: 'completed', hmStatus: 'pending', hrFeedback: { destacados: 'Candidata con experiencia básica en ventas y conocimiento del sector. Sin CRM formal ni liderazgo de equipo. Perfil de asesor.', ratingA: 3, ratingB: 3, ratingC: 3, senalAlerta: 'No cumple perfil gerencial mínimo.', recomendacion: 'no_seguro', date: '05 Mar 2025', duration: '30 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmLink: 'https://unio.app/eval/mv-20' },
  { candidateId: 'mv-21', hrStatus: 'completed', hmStatus: 'pending', hrFeedback: { destacados: 'Candidato con experiencia en ventas y manejo de cartera. Aspiración fuera de rango. Sin experiencia en gestión de equipos amplia ni en apertura de mercados.', ratingA: 3, ratingB: 3, ratingC: 3, senalAlerta: 'Aspiración fuera de rango y perfil de liderazgo insuficiente.', recomendacion: 'no_seguro', date: '05 Mar 2025', duration: '30 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmLink: 'https://unio.app/eval/mv-21' },
  { candidateId: 'mv-22', hrStatus: 'completed', hmStatus: 'pending', hrFeedback: { destacados: 'Candidata con experiencia comercial sin liderazgo formal. Buena actitud y comunicación pero sin la profundidad gerencial requerida.', ratingA: 3, ratingB: 3, ratingC: 3, senalAlerta: 'No cumple perfil gerencial.', recomendacion: 'no_seguro', date: '06 Mar 2025', duration: '30 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmLink: 'https://unio.app/eval/mv-22' },
  { candidateId: 'mv-23', hrStatus: 'completed', hmStatus: 'pending', hrFeedback: { destacados: 'Candidato con experiencia en ventas y manejo básico de CRM. Sin liderazgo de equipo documentado. Perfil insuficiente para gerencia comercial.', ratingA: 3, ratingB: 2, ratingC: 3, senalAlerta: 'Perfil por debajo del nivel gerencial mínimo.', recomendacion: 'no_seguro', date: '06 Mar 2025', duration: '30 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmLink: 'https://unio.app/eval/mv-23' },
  { candidateId: 'mv-24', hrStatus: 'completed', hmStatus: 'pending', hrFeedback: { destacados: 'Candidata con experiencia básica en ventas. Sin evidencia de liderazgo de equipo ni cumplimiento de metas documentado. Perfil de asesor junior.', ratingA: 2, ratingB: 3, ratingC: 3, senalAlerta: 'No cumple el perfil mínimo requerido.', recomendacion: 'no_seguro', date: '07 Mar 2025', duration: '25 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmLink: 'https://unio.app/eval/mv-24' },
  { candidateId: 'mv-25', hrStatus: 'completed', hmStatus: 'pending', hrFeedback: { destacados: 'Candidato con experiencia comercial básica. Aspiración fuera de rango y sin el perfil gerencial requerido. No cumple criterios mínimos.', ratingA: 2, ratingB: 2, ratingC: 3, senalAlerta: 'Aspiración fuera de rango y perfil insuficiente para el cargo.', recomendacion: 'no_seguro', date: '07 Mar 2025', duration: '25 min', interviewer: 'Fernanda Ríos - Gerente de Zona' }, hmLink: 'https://unio.app/eval/mv-25' },
  // ─── Comfandi GCA — Gestor(a) Comercial Convenios y Alianzas Crédito ─────────
  { candidateId: 'gca-1', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con trayectoria sólida en gestión comercial de convenios de libranza. Métricas documentadas: 14 convenios firmados en 2024 con cartera activa de $2.800M. Dominio completo del proceso desde prospección hasta legalización y seguimiento de indicadores de colocación.', ratingA: 5, ratingB: 4, ratingC: 5, senalAlerta: 'Confirmar disponibilidad para visitas de campo en el Área Metropolitana de Medellín.', recomendacion: 'definitivamente', date: '05 Feb 2025', duration: '45 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Perfil comercial excepcional para el cargo. Entiende con precisión el modelo de libranza y los ciclos de vinculación empresarial. Su historial de cumplimiento de metas y visión de portafolio complementario la ubican como la candidata de mayor impacto para el cargo.', ratingA: 5, ratingB: 5, ratingC: 4, senalAlerta: '', recomendacion: 'definitivamente', date: '07 Feb 2025', duration: '40 min', interviewer: 'Julián Agudelo - Jefe Banca Empresarial' }, hmLink: 'https://unio.app/eval/gca-1', techTestMeta: { date: '10 Feb 2025', duration: '60 min', interviewer: 'Julián Agudelo - Jefe Banca Empresarial' } },
  { candidateId: 'gca-2', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con historial comprobado en apertura de convenios corporativos y profundización de portafolio financiero. Presenta indicadores propios: tasa de conversión del 38% en 2024 y 11 convenios nuevos firmados. Excelente capacidad de relacionamiento con áreas de RRHH y financieras de empresas afiliadas.', ratingA: 5, ratingB: 4, ratingC: 4, senalAlerta: 'Validar experiencia específica en libranza con cajas de compensación.', recomendacion: 'definitivamente', date: '05 Feb 2025', duration: '45 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Candidato con visión comercial estratégica clara para el cargo. Identifica oportunidades de profundización del portafolio más allá del crédito inicial, lo que multiplica el valor del convenio. Muy buen ajuste con la cultura de relacionamiento a largo plazo de Comfandi.', ratingA: 5, ratingB: 4, ratingC: 5, senalAlerta: 'Confirmar disponibilidad de inicio inmediata.', recomendacion: 'definitivamente', date: '07 Feb 2025', duration: '40 min', interviewer: 'Julián Agudelo - Jefe Banca Empresarial' }, hmLink: 'https://unio.app/eval/gca-2', techTestMeta: { date: '10 Feb 2025', duration: '60 min', interviewer: 'Julián Agudelo - Jefe Banca Empresarial' } },
  { candidateId: 'gca-3', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con experiencia en gestión de convenios y vinculación empresarial con entidades del sector financiero. Manejo claro del proceso administrativo de legalización y seguimiento de indicadores. Cumplimiento de metas en 9 de 12 meses en cargo anterior.', ratingA: 4, ratingB: 5, ratingC: 4, senalAlerta: 'Confirmar experiencia puntual en convenios de libranza vs. convenios de otro tipo.', recomendacion: 'definitivamente', date: '06 Feb 2025', duration: '45 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Perfil equilibrado con buen entendimiento del cargo. La candidata comprende los ciclos de vinculación y tiene experiencia en la gestión documental y seguimiento de convenios activos. Ajuste cultural positivo con valores de Comfandi.', ratingA: 4, ratingB: 4, ratingC: 5, senalAlerta: 'Acompañar en los primeros meses en la gestión del portafolio complementario.', recomendacion: 'definitivamente', date: '08 Feb 2025', duration: '40 min', interviewer: 'Julián Agudelo - Jefe Banca Empresarial' }, hmLink: 'https://unio.app/eval/gca-3', techTestMeta: { date: '11 Feb 2025', duration: '60 min', interviewer: 'Julián Agudelo - Jefe Banca Empresarial' } },
  { candidateId: 'gca-4', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con experiencia en prospección comercial y relacionamiento con empresas del sector manufacturero. Buen manejo del proceso de vinculación y conocimiento del producto libranza. Estructura clara en la presentación del proceso comercial.', ratingA: 4, ratingB: 3, ratingC: 4, senalAlerta: 'Confirmación de métricas de resultados propios pendiente — validar en segunda instancia.', recomendacion: 'definitivamente', date: '12 Feb 2025', duration: '40 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Candidato con orientación comercial clara y buen relacionamiento. Entiende la dinámica del cargo aunque le falta profundidad en la gestión del portafolio complementario de Comfandi.', ratingA: 4, ratingB: 4, ratingC: 3, senalAlerta: 'Reforzar en la inducción el portafolio completo de servicios financieros de Comfandi.', recomendacion: 'definitivamente', date: '14 Feb 2025', duration: '35 min', interviewer: 'Julián Agudelo - Jefe Banca Empresarial' }, hmLink: 'https://unio.app/eval/gca-4' },
  { candidateId: 'gca-5', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con experiencia en ventas de productos financieros y manejo de cuentas empresariales. Buen proceso de prospección y seguimiento de pipeline. Presentación clara de resultados alcanzados.', ratingA: 3, ratingB: 4, ratingC: 4, senalAlerta: 'Aspiración salarial fuera del rango aprobado — revisar alineación antes de avanzar.', recomendacion: 'definitivamente', date: '12 Feb 2025', duration: '40 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Candidata con orientación al cliente y disciplina en seguimiento. La aspiración salarial es el único punto de tensión en el proceso.', ratingA: 4, ratingB: 3, ratingC: 4, senalAlerta: 'Revisar expectativa salarial y confirmar flexibilidad antes de decisión final.', recomendacion: 'con_reservas', date: '14 Feb 2025', duration: '35 min', interviewer: 'Julián Agudelo - Jefe Banca Empresarial' }, hmLink: 'https://unio.app/eval/gca-5' },
  { candidateId: 'gca-6', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con experiencia en gestión de convenios empresariales y conocimiento del proceso de libranza. Relacionamiento correcto y comprensión del ciclo comercial. Menor profundidad en gestión de indicadores propios.', ratingA: 4, ratingB: 3, ratingC: 3, senalAlerta: 'Reforzar conocimiento del portafolio financiero complementario de Comfandi.', recomendacion: 'definitivamente', date: '17 Feb 2025', duration: '35 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Perfil con base comercial correcta. Requiere acompañamiento en los primeros meses para alcanzar la autonomía esperada en el cargo.', ratingA: 3, ratingB: 4, ratingC: 3, senalAlerta: 'Establecer metas de ramp-up claras en los primeros 90 días.', recomendacion: 'con_reservas', date: '19 Feb 2025', duration: '30 min', interviewer: 'Julián Agudelo - Jefe Banca Empresarial' }, hmLink: 'https://unio.app/eval/gca-6' },
  { candidateId: 'gca-7', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con experiencia en ventas de servicios y seguimiento de clientes. Conocimiento básico del proceso de convenios. Actitud positiva y disposición para aprender el portafolio de Comfandi.', ratingA: 3, ratingB: 4, ratingC: 3, senalAlerta: 'Sin experiencia específica en libranza ni en gestión con departamentos de nómina.', recomendacion: 'con_reservas', date: '17 Feb 2025', duration: '35 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Candidata con potencial comercial pero con brecha en el conocimiento técnico del producto libranza y los procesos de vinculación empresarial de Comfandi.', ratingA: 3, ratingB: 3, ratingC: 4, senalAlerta: 'La curva de aprendizaje en el producto libranza puede impactar los primeros resultados.', recomendacion: 'con_reservas', date: '19 Feb 2025', duration: '30 min', interviewer: 'Julián Agudelo - Jefe Banca Empresarial' }, hmLink: 'https://unio.app/eval/gca-7' },
  { candidateId: 'gca-8', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con experiencia en atención al cliente y conocimiento básico del sector financiero. Presenta disposición para el cargo y comprende los aspectos fundamentales del relacionamiento comercial.', ratingA: 3, ratingB: 3, ratingC: 4, senalAlerta: 'Sin experiencia en prospección activa de empresas ni en gestión de convenios. Requiere formación intensiva.', recomendacion: 'con_reservas', date: '18 Feb 2025', duration: '35 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Perfil con disposición y actitud correcta pero con brechas significativas en la experiencia comercial requerida por el cargo.', ratingA: 3, ratingB: 3, ratingC: 3, senalAlerta: 'Validar si el plan de formación puede cubrir las brechas en el tiempo de ramp-up establecido.', recomendacion: 'con_reservas', date: '20 Feb 2025', duration: '30 min', interviewer: 'Julián Agudelo - Jefe Banca Empresarial' }, hmLink: 'https://unio.app/eval/gca-8' },
  // ─── Comfandi GCV — Gestor(a) Calidad de Vida Crédito ─────────────────────────
  { candidateId: 'gcv-1', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con historial sólido en venta consultiva de intangibles y seguimiento de portafolio de crédito. Métricas verificables: cumplimiento promedio 96% en meta mensual con 65 clientes activos en 2024. NPS personal de 71 en última medición semestral. Dominio del proceso desde originación hasta desembolso.', ratingA: 5, ratingB: 4, ratingC: 4, senalAlerta: 'Confirmar disponibilidad exclusiva presencial en Cali sin compromisos en otra empresa.', recomendacion: 'definitivamente', date: '05 Feb 2025', duration: '45 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'La candidata entiende con profundidad el modelo de venta consultiva de crédito y su conexión con la calidad de vida del afiliado. Presenta visión más allá del producto: habla de seguimiento de vida financiera del cliente. Muy buen ajuste con el propósito de Comfandi.', ratingA: 5, ratingB: 5, ratingC: 4, senalAlerta: '', recomendacion: 'definitivamente', date: '07 Feb 2025', duration: '40 min', interviewer: 'Adriana Torres - Coordinadora UES Crédito Cali' }, hmLink: 'https://unio.app/eval/gcv-1', techTestMeta: { date: '10 Feb 2025', duration: '50 min', interviewer: 'Adriana Torres - Coordinadora UES Crédito Cali' } },
  { candidateId: 'gcv-2', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con trayectoria en gestión de portafolio de crédito de consumo y seguimiento activo de base de preaprobados. Historial de cumplimiento: 94% en meta anual de colocación. Presentación clara de métricas de conversión y pipeline.', ratingA: 4, ratingB: 5, ratingC: 4, senalAlerta: 'Validar experiencia en líneas de crédito hipotecario además del consumo.', recomendacion: 'definitivamente', date: '05 Feb 2025', duration: '45 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Candidato con muy buen entendimiento del ciclo comercial de crédito. Domina el seguimiento desde originación hasta el desembolso y su capacidad de gestión de la cartera vencida fue especialmente destacable en la entrevista.', ratingA: 4, ratingB: 5, ratingC: 4, senalAlerta: 'Reforzar en la inducción el portafolio hipotecario que no manejó directamente.', recomendacion: 'definitivamente', date: '07 Feb 2025', duration: '40 min', interviewer: 'Adriana Torres - Coordinadora UES Crédito Cali' }, hmLink: 'https://unio.app/eval/gcv-2', techTestMeta: { date: '10 Feb 2025', duration: '50 min', interviewer: 'Adriana Torres - Coordinadora UES Crédito Cali' } },
  { candidateId: 'gcv-3', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con experiencia en asesoría financiera de crédito y manejo de base de clientes. Seguimiento proactivo de portafolio y orientación clara al cumplimiento de metas. Disponibilidad presencial confirmada en Cali.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Confirmar experiencia en gestión de cartera vencida y manejo de objeciones financieras.', recomendacion: 'definitivamente', date: '06 Feb 2025', duration: '40 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Candidata con disciplina comercial sólida y orientación al cliente. Entiende el modelo de calidad de vida crediticia de Comfandi y presenta disposición para profundizar el portafolio más allá del crédito de consumo.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Acompañar en los primeros meses en el manejo de la cartera hipotecaria.', recomendacion: 'definitivamente', date: '08 Feb 2025', duration: '40 min', interviewer: 'Adriana Torres - Coordinadora UES Crédito Cali' }, hmLink: 'https://unio.app/eval/gcv-3', techTestMeta: { date: '11 Feb 2025', duration: '50 min', interviewer: 'Adriana Torres - Coordinadora UES Crédito Cali' } },
  { candidateId: 'gcv-4', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con experiencia en servicios financieros y seguimiento de clientes. Buen manejo de herramientas de CRM y disciplina en seguimiento de pipeline. Aspiración salarial fuera del rango aprobado.', ratingA: 4, ratingB: 3, ratingC: 4, senalAlerta: 'Aspiración fuera de rango — confirmar flexibilidad antes de avanzar al proceso de decisión.', recomendacion: 'definitivamente', date: '12 Feb 2025', duration: '40 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Candidato con comprensión del modelo de crédito de consumo y seguimiento de portafolio. La aspiración salarial es el principal punto de tensión en el proceso.', ratingA: 4, ratingB: 3, ratingC: 3, senalAlerta: 'Necesario alinear expectativa salarial antes de avanzar a decisión final.', recomendacion: 'con_reservas', date: '14 Feb 2025', duration: '35 min', interviewer: 'Adriana Torres - Coordinadora UES Crédito Cali' }, hmLink: 'https://unio.app/eval/gcv-4' },
  { candidateId: 'gcv-5', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con experiencia en atención al cliente en servicios financieros. Buena orientación al cumplimiento de metas y seguimiento de base de preaprobados. Disponibilidad presencial confirmada en Cali.', ratingA: 3, ratingB: 4, ratingC: 4, senalAlerta: 'Confirmar profundidad en la gestión autónoma de portafolio desde originación.', recomendacion: 'definitivamente', date: '12 Feb 2025', duration: '40 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Perfil con orientación al cliente y disciplina. Requiere mayor desarrollo en la autonomía para la gestión del pipeline de crédito sin supervisión directa.', ratingA: 3, ratingB: 4, ratingC: 3, senalAlerta: 'Establecer metas de ramp-up con seguimiento quincenal en los primeros 3 meses.', recomendacion: 'con_reservas', date: '14 Feb 2025', duration: '35 min', interviewer: 'Adriana Torres - Coordinadora UES Crédito Cali' }, hmLink: 'https://unio.app/eval/gcv-5' },
  { candidateId: 'gcv-6', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con experiencia en ventas de servicios financieros y seguimiento de clientes en Cali. Conocimiento del producto crédito de consumo y manejo básico de base de preaprobados. Actitud positiva y disponibilidad presencial confirmada.', ratingA: 3, ratingB: 4, ratingC: 3, senalAlerta: 'Sin experiencia en venta activa de crédito hipotecario ni libranza.', recomendacion: 'con_reservas', date: '17 Feb 2025', duration: '35 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Candidata con disposición para el cargo y conocimiento básico del portafolio. Requiere acompañamiento en los primeros meses para desarrollar autonomía en la gestión de pipeline.', ratingA: 3, ratingB: 3, ratingC: 4, senalAlerta: 'Diseñar plan de onboarding con metas graduales por mes.', recomendacion: 'con_reservas', date: '19 Feb 2025', duration: '30 min', interviewer: 'Adriana Torres - Coordinadora UES Crédito Cali' }, hmLink: 'https://unio.app/eval/gcv-6' },
  { candidateId: 'gcv-7', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con experiencia en atención al cliente y servicios financieros básicos. Conoce el proceso de crédito de consumo. Actitud orientada al servicio y disponibilidad presencial en Cali.', ratingA: 3, ratingB: 3, ratingC: 4, senalAlerta: 'Sin experiencia comprobada en venta activa de intangibles con metas individuales.', recomendacion: 'con_reservas', date: '17 Feb 2025', duration: '35 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Perfil básico para el cargo con disposición y actitud positiva. La brecha en experiencia de venta activa es significativa para el nivel de autonomía requerido.', ratingA: 3, ratingB: 3, ratingC: 3, senalAlerta: 'Evaluar si la curva de aprendizaje es compatible con los tiempos de ramp-up del cargo.', recomendacion: 'con_reservas', date: '19 Feb 2025', duration: '30 min', interviewer: 'Adriana Torres - Coordinadora UES Crédito Cali' }, hmLink: 'https://unio.app/eval/gcv-7' },
  { candidateId: 'gcv-8', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con experiencia en servicios al cliente y conocimiento del proceso de crédito de consumo. Disponibilidad presencial en Cali confirmada. Actitud proactiva y disposición para aprender el portafolio completo de Comfandi.', ratingA: 3, ratingB: 3, ratingC: 3, senalAlerta: 'Sin experiencia en seguimiento activo de pipeline ni en gestión de portafolio con metas.', recomendacion: 'con_reservas', date: '18 Feb 2025', duration: '35 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Candidata con base correcta y actitud positiva. Las brechas en experiencia de venta activa requerirán un programa de formación sólido en los primeros meses.', ratingA: 3, ratingB: 3, ratingC: 3, senalAlerta: 'Validar plan de formación antes de la decisión final.', recomendacion: 'con_reservas', date: '20 Feb 2025', duration: '30 min', interviewer: 'Adriana Torres - Coordinadora UES Crédito Cali' }, hmLink: 'https://unio.app/eval/gcv-8' },
  // ─── Comfandi CB — Científico(a) Comportamental ────────────────────────────────
  { candidateId: 'cb-1', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con dominio metodológico excepcional en ciencias del comportamiento. Experiencia verificable en aplicación de EAST en proyectos de campo con 6 años de trayectoria. Producción académica indexada (2 artículos). Capacidad demostrada de transferencia metodológica a equipos no especializados con 85% de tasa de adopción en proyecto reciente.', ratingA: 5, ratingB: 5, ratingC: 4, senalAlerta: 'Confirmar disponibilidad para presencialidad en Bogotá y municipios aledaños.', recomendacion: 'definitivamente', date: '07 Feb 2025', duration: '50 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Candidato excepcional para el cargo. Su experiencia combinando rigor científico con transferencia metodológica a equipos operativos es exactamente lo que Comfandi necesita para escalar el modelo de acompañamiento a lo largo de la vida. La capacidad de comunicar hallazgos complejos a orientadores y gerencia es un diferencial clave.', ratingA: 5, ratingB: 5, ratingC: 5, senalAlerta: '', recomendacion: 'definitivamente', date: '10 Feb 2025', duration: '55 min', interviewer: 'Gloria Inés Montoya - Coordinadora Acompañamiento a lo Largo de la Vida' }, hmLink: 'https://unio.app/eval/cb-1', techTestMeta: { date: '13 Feb 2025', duration: '90 min', interviewer: 'Gloria Inés Montoya - Coordinadora Acompañamiento a lo Largo de la Vida' } },
  { candidateId: 'cb-2', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con trayectoria sólida en investigación aplicada con metodologías comportamentales. Experiencia de 5 años en diseño e implementación de pilotos con grupos de control. Publicaciones y reportes técnicos para entidades gubernamentales. Comunicación efectiva de hallazgos a audiencias no especializadas.', ratingA: 5, ratingB: 4, ratingC: 5, senalAlerta: 'Validar disponibilidad para trabajar con equipos de orientación escolar y psicosocial.', recomendacion: 'definitivamente', date: '07 Feb 2025', duration: '50 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Candidata con muy buen perfil para el cargo. Su experiencia en intervenciones de campo con metodología mixta y la capacidad de generar reportes técnicos accionables para tomadores de decisión son activos centrales para el modelo de Comfandi.', ratingA: 5, ratingB: 4, ratingC: 5, senalAlerta: 'Reforzar en la inducción el contexto específico de cajas de compensación.', recomendacion: 'definitivamente', date: '10 Feb 2025', duration: '50 min', interviewer: 'Gloria Inés Montoya - Coordinadora Acompañamiento a lo Largo de la Vida' }, hmLink: 'https://unio.app/eval/cb-2', techTestMeta: { date: '13 Feb 2025', duration: '90 min', interviewer: 'Gloria Inés Montoya - Coordinadora Acompañamiento a lo Largo de la Vida' } },
  { candidateId: 'cb-3', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con 4 años en investigación comportamental aplicada y dominio de EAST. Manejo avanzado de R (tidyverse, análisis longitudinal). Experiencia en diagnósticos comportamentales con entrega de reportes ejecutivos. Disposición documentada para trabajo interdisciplinario.', ratingA: 4, ratingB: 5, ratingC: 4, senalAlerta: 'Confirmar experiencia en trabajo directo con equipos de orientación social no académicos.', recomendacion: 'definitivamente', date: '08 Feb 2025', duration: '45 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Candidato con rigor metodológico sólido y buena capacidad de comunicación. La experiencia en transferencia metodológica a equipos operativos lo ubica bien para el cargo aunque requiere acompañamiento inicial en el contexto específico de educación y empleabilidad de Comfandi.', ratingA: 4, ratingB: 4, ratingC: 5, senalAlerta: 'Diseñar plan de inducción al contexto institucional de Comfandi en los primeros 60 días.', recomendacion: 'definitivamente', date: '11 Feb 2025', duration: '50 min', interviewer: 'Gloria Inés Montoya - Coordinadora Acompañamiento a lo Largo de la Vida' }, hmLink: 'https://unio.app/eval/cb-3', techTestMeta: { date: '14 Feb 2025', duration: '90 min', interviewer: 'Gloria Inés Montoya - Coordinadora Acompañamiento a lo Largo de la Vida' } },
  { candidateId: 'cb-4', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con 4 años en investigación aplicada y experiencia en diseño de cuestionarios psicotécnicos validados. Manejo de SPSS y metodologías mixtas. Muy buena capacidad de comunicación de hallazgos a equipos no especializados.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Confirmar dominio específico de metodología EAST o 3B más allá del conocimiento teórico.', recomendacion: 'definitivamente', date: '14 Feb 2025', duration: '45 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Candidata con perfil sólido y buena comprensión del rol. Su experiencia en diagnósticos comportamentales y la claridad de comunicación son activos importantes. Requiere acompañamiento en la aplicación de EAST en contexto de campo.', ratingA: 4, ratingB: 4, ratingC: 4, senalAlerta: 'Reforzar en primeros meses la aplicación de EAST en contexto operativo.', recomendacion: 'definitivamente', date: '17 Feb 2025', duration: '40 min', interviewer: 'Gloria Inés Montoya - Coordinadora Acompañamiento a lo Largo de la Vida' }, hmLink: 'https://unio.app/eval/cb-4' },
  { candidateId: 'cb-5', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con 3 años en investigación social aplicada y metodología cualitativa con ATLAS.ti. Experiencia en diagnósticos sociales y comunicación de resultados a gerencias de proyectos. Aspiración salarial fuera del rango aprobado.', ratingA: 4, ratingB: 4, ratingC: 3, senalAlerta: 'Aspiración salarial fuera de rango — revisar alineación antes del siguiente paso.', recomendacion: 'definitivamente', date: '14 Feb 2025', duration: '45 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Candidato con metodología sólida en investigación cualitativa. La aspiración salarial es el principal punto de tensión. Potencial de desarrollo en la aplicación de metodologías cuantitativas que el cargo requiere.', ratingA: 4, ratingB: 3, ratingC: 4, senalAlerta: 'Confirmar flexibilidad salarial y plan de desarrollo en metodologías cuantitativas.', recomendacion: 'con_reservas', date: '17 Feb 2025', duration: '40 min', interviewer: 'Gloria Inés Montoya - Coordinadora Acompañamiento a lo Largo de la Vida' }, hmLink: 'https://unio.app/eval/cb-5' },
  { candidateId: 'cb-6', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con 3 años en investigación social y experiencia en análisis de datos para proyectos de empleabilidad. Manejo de metodologías mixtas y reportes de diagnóstico. Disponibilidad presencial en Bogotá confirmada.', ratingA: 4, ratingB: 3, ratingC: 3, senalAlerta: 'Sin experiencia directa en metodologías comportamentales (EAST/3B/COMB) en campo.', recomendacion: 'con_reservas', date: '19 Feb 2025', duration: '40 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Candidata con base metodológica correcta pero con brecha en la aplicación de ciencias del comportamiento en contexto operativo. Requiere programa de formación específico en los primeros meses.', ratingA: 3, ratingB: 4, ratingC: 3, senalAlerta: 'Diseñar programa de formación en EAST/3B en primeros 90 días.', recomendacion: 'con_reservas', date: '21 Feb 2025', duration: '35 min', interviewer: 'Gloria Inés Montoya - Coordinadora Acompañamiento a lo Largo de la Vida' }, hmLink: 'https://unio.app/eval/cb-6' },
  { candidateId: 'cb-7', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidato con 2 años en investigación aplicada y experiencia en análisis estadístico básico con SPSS. Conocimiento teórico de ciencias del comportamiento y buena disposición para el trabajo interdisciplinario.', ratingA: 3, ratingB: 4, ratingC: 3, senalAlerta: 'Sin experiencia en diseño de pilotos iterativos ni en intervenciones de campo con grupos de control.', recomendacion: 'con_reservas', date: '19 Feb 2025', duration: '35 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Candidato con base teórica correcta pero con brechas significativas en la aplicación práctica de metodologías comportamentales en campo. La curva de aprendizaje puede ser extensa.', ratingA: 3, ratingB: 3, ratingC: 4, senalAlerta: 'Evaluar si la brecha en experiencia práctica es compatible con los plazos de impacto esperados.', recomendacion: 'con_reservas', date: '21 Feb 2025', duration: '30 min', interviewer: 'Gloria Inés Montoya - Coordinadora Acompañamiento a lo Largo de la Vida' }, hmLink: 'https://unio.app/eval/cb-7' },
  { candidateId: 'cb-8', hrStatus: 'completed', hmStatus: 'completed', hrFeedback: { destacados: 'Candidata con 2 años en investigación social y conocimiento básico de metodologías de diagnóstico. Actitud proactiva y orientación al aprendizaje. Disponibilidad presencial en Bogotá confirmada.', ratingA: 3, ratingB: 3, ratingC: 4, senalAlerta: 'Sin experiencia en intervenciones de campo ni en transferencia metodológica a equipos operativos.', recomendacion: 'con_reservas', date: '20 Feb 2025', duration: '35 min', interviewer: 'Carolina Mejía - Gestión Humana Comfandi' }, hmFeedback: { destacados: 'Candidata con disposición y actitud positiva pero con brechas importantes en la experiencia práctica requerida por el cargo. Requiere programa de formación extenso.', ratingA: 3, ratingB: 3, ratingC: 3, senalAlerta: 'Validar si el plan de formación puede cubrir las brechas en tiempo y presupuesto disponibles.', recomendacion: 'con_reservas', date: '22 Feb 2025', duration: '30 min', interviewer: 'Gloria Inés Montoya - Coordinadora Acompañamiento a lo Largo de la Vida' }, hmLink: 'https://unio.app/eval/cb-8' },
];


export const shortlistCandidates = [
  {
    id: 'f1',
    name: 'Sofia Rojas',
    role: 'UX UI Designer',
    years: '3 Años',
    sector: 'Healthcare',
    salary: '$12M / $13M',
    salaryRange: 'en_rango' as SalaryRange,
    score: 93,
    avatarInitials: 'SR',
    photo: 'https://www.figma.com/api/mcp/asset/0bd24614-6641-4e00-bcaa-0f7fc0f9e970',
    location: 'Lima, Perú',
    modalidad: 'Remoto',
    coreSkills: [{ label: 'User testing', score: 92 }, { label: 'Animation', score: 88 }, { label: 'Presentaciones', score: 87 }],
    additionalSkills: [{ label: 'Javascript', score: 75 }, { label: 'React', score: 70 }, { label: 'Responsive design', score: 90 }],
    fitCultural: 'Innovación, adaptabilidad.',
  },
  {
    id: 'f2',
    name: 'Mateo García',
    role: 'Product Designer',
    years: '5 Años',
    sector: 'SAAS',
    salary: '$12M / $14M',
    salaryRange: 'fuera_de_rango' as SalaryRange,
    score: 88,
    avatarInitials: 'IF',
    photo: 'https://www.figma.com/api/mcp/asset/ea3619e9-cd4f-4d42-8f2d-459345fa97bf',
    location: 'Bogotá, Colombia',
    modalidad: 'Remoto',
    coreSkills: [{ label: 'Diseño de producto', score: 91 }, { label: 'UI Design', score: 89 }, { label: 'UX Writing', score: 93 }],
    additionalSkills: [{ label: 'Figma', score: 85 }, { label: 'Prototipado', score: 90 }, { label: 'User Research', score: 88 }],
    fitCultural: 'Comunicación, proactividad',
  },
  {
    id: 'f3',
    name: 'Santiago Ruiz',
    role: 'UI/UX Designer',
    years: '2 Años',
    sector: 'Ecommerce',
    salary: '$10M / $11M',
    salaryRange: 'en_rango' as SalaryRange,
    score: 86,
    avatarInitials: 'MA',
    photo: 'https://www.figma.com/api/mcp/asset/dfdeedcd-1733-4731-b6ea-cdb5f41e6e9c',
    location: 'Medellín, Colombia',
    modalidad: 'Remoto',
    coreSkills: [{ label: 'Design systems', score: 85 }, { label: 'UI craft', score: 90 }, { label: 'Comunicación', score: 90 }],
    additionalSkills: [{ label: 'Vibecoding', score: 80 }, { label: 'Html y CSS', score: 75 }, { label: 'Prototipado', score: 90 }],
    fitCultural: 'Autonomía, gestión de equipos diversos.',
  },
  {
    id: 'f4',
    name: 'Lucas Mendoza',
    role: 'Product Designer',
    years: '4 Años',
    sector: 'Tecnología',
    salary: '$8M / $9M',
    salaryRange: 'en_rango' as SalaryRange,
    score: 88,
    avatarInitials: 'LM',
    location: 'Bogotá, Colombia',
    modalidad: 'Híbrido',
    coreSkills: [{ label: 'Research methods', score: 88 }, { label: 'Visual design', score: 85 }, { label: 'Trabajo en equipo', score: 95 }],
    additionalSkills: [{ label: 'Figma', score: 90 }, { label: 'InVision', score: 80 }, { label: 'Wireframing', score: 85 }],
    fitCultural: 'Colaboración, pensamiento crítico.',
  },
  {
    id: 'f5',
    name: 'Carlos Mendoza',
    role: 'UI/UX Designer',
    years: '1 Año',
    sector: 'Fintech',
    salary: '$10M / $10M',
    salaryRange: 'en_rango' as SalaryRange,
    score: 86,
    avatarInitials: 'CM',
    location: 'Buenos Aires, Argentina',
    modalidad: 'Híbrido',
    coreSkills: [{ label: 'Prototipado', score: 90 }, { label: 'Investigación de usuarios', score: 85 }, { label: 'Colaboración', score: 89 }],
    additionalSkills: [{ label: 'Figma', score: 80 }, { label: 'HTML/CSS', score: 78 }, { label: 'Design systems', score: 92 }],
    fitCultural: 'Empatía, creatividad.',
  },
];

// ─── DEMO VACANTES — SISTEMA DE 5 PROCESOS ────────────────────────────────────
const _p = (n: number, g: 'women' | 'men') => `https://randomuser.me/api/portraits/${g}/${n}.jpg`;

// ─── Job history tables per vacancy (c=company, r=role, d=end date) ──────────
const _recepJobs = [
  { c: 'Clínica Las Américas',              r: 'Recepcionista Médica',               d: '' },
  { c: 'Consultorios Médicos del Norte',    r: 'Recepcionista',                      d: '' },
  { c: 'Centro de Diagnóstico IPS',         r: 'Auxiliar Administrativa',            d: '' },
  { c: 'Clínica Chicamocha',                r: 'Recepcionista y Atención al Paciente',d: '' },
  { c: 'Hospital Universitario',            r: 'Recepcionista de Urgencias',         d: '' },
  { c: 'Clínica Los Andes',                 r: 'Recepcionista',                      d: '' },
  { c: 'Centro Médico La Victoria',         r: 'Recepcionista',                      d: '' },
  { c: 'Clínica CES Medellín',              r: 'Auxiliar de Admisiones',             d: '' },
  { c: 'Clínica Santa Fe de Bogotá',        r: 'Recepcionista',                      d: 'Feb 2025' },
  { c: 'Consultorios Grupo Especialistas',  r: 'Auxiliar Administrativa',            d: 'Dic 2024' },
  { c: 'Centro Médico Popular',             r: 'Recepcionista',                      d: 'Oct 2024' },
  { c: 'IPS Regional Manizales',            r: 'Auxiliar de Admisiones',             d: 'Ago 2024' },
  { c: 'Centro de Salud Municipal',         r: 'Recepcionista',                      d: 'Jun 2024' },
  { c: 'Cafam Tunja',                       r: 'Auxiliar de Admisiones',             d: 'Abr 2024' },
  { c: 'Droguería Colsubsidio',             r: 'Auxiliar de Caja y Atención',        d: 'Feb 2024' },
];
const _bodegaJobs = [
  { c: 'Alimentos Zenú (Grupo Nutresa)',    r: 'Auxiliar de Bodega',                 d: '' },
  { c: 'Postobón S.A.',                     r: 'Auxiliar de Almacén',                d: '' },
  { c: 'Bavaria S.A.',                      r: 'Auxiliar Logístico',                 d: '' },
  { c: 'Tecnoquímicas S.A.',                r: 'Auxiliar de Bodega',                 d: '' },
  { c: 'Gloria Colombia',                   r: 'Auxiliar de Despachos',              d: '' },
  { c: 'Coca-Cola FEMSA',                   r: 'Auxiliar de Distribución',           d: '' },
  { c: 'Carvajal Empaques',                 r: 'Operario de Bodega',                 d: '' },
  { c: 'Alimentos del Valle',               r: 'Auxiliar de Almacén',                d: '' },
  { c: 'Yanbal Colombia',                   r: 'Operario de Bodega',                 d: '' },
  { c: 'Cadena Logística Nacional',         r: 'Auxiliar de Bodega',                 d: 'Feb 2025' },
  { c: 'Distribuidora Enerpeq',             r: 'Auxiliar Logístico',                 d: 'Nov 2024' },
  { c: 'Almacenes Colombianos',             r: 'Auxiliar de Almacén',                d: 'Oct 2024' },
  { c: 'Logística ACOL S.A.S.',             r: 'Operario de Bodega',                 d: 'Sep 2024' },
  { c: 'Distribuidora del Caribe',          r: 'Auxiliar de Bodega',                 d: 'Jul 2024' },
  { c: 'Almacenes Flamingo',                r: 'Auxiliar de Recepción y Almacén',    d: 'Jun 2024' },
  { c: 'Transportes y Logística SAS',       r: 'Auxiliar de Bodega',                 d: 'Ago 2024' },
  { c: 'Supermercados La 14',               r: 'Auxiliar de Almacén',                d: 'May 2024' },
  { c: 'Autoservicio Regional',             r: 'Auxiliar de Bodega',                 d: 'Abr 2024' },
  { c: 'Comercializadora Surtimax',         r: 'Auxiliar General',                   d: 'Mar 2024' },
  { c: 'Tienda de Barrio El Progreso',      r: 'Auxiliar de Bodega',                 d: 'Feb 2024' },
];
const _thJobs = [
  { c: 'Grupo Nutresa',                     r: 'Analista de Selección',              d: '' },
  { c: 'Comestibles Aldor',                 r: 'Analista de RRHH',                   d: '' },
  { c: 'Plásticos Rimax',                   r: 'Analista de Talento Humano',         d: '' },
  { c: 'Carvajal Empaques',                 r: 'Coordinadora de Selección',          d: '' },
  { c: 'Alimentos del Valle',               r: 'Analista de RRHH',                   d: '' },
  { c: 'Colcerámica (Corona)',              r: 'Analista de Selección',              d: '' },
  { c: 'Proquinal S.A.',                    r: 'Analista de Talento Humano',         d: '' },
  { c: 'Sumitomo Colombia (SCI)',           r: 'Analista de RRHH',                   d: '' },
  { c: 'Familia Sancela',                   r: 'Analista de Selección',              d: '' },
  { c: 'Procesadora de Leches S.A.',        r: 'Analista de RRHH',                   d: '' },
  { c: 'Harinera del Valle',                r: 'Analista de Talento Humano',         d: '' },
  { c: 'Industrias Haceb',                  r: 'Auxiliar de Selección',              d: '' },
  { c: 'Cemex Colombia',                    r: 'Analista de RRHH',                   d: '' },
  { c: 'Acesco (Acerias)',                  r: 'Auxiliar de Talento Humano',         d: '' },
  { c: 'Argos Concretos',                   r: 'Analista de Selección',              d: 'Ene 2025' },
  { c: 'OLX Colombia',                      r: 'Analista de RRHH',                   d: 'Nov 2024' },
  { c: 'Bavaria S.A.',                      r: 'Auxiliar de RRHH',                   d: 'Sep 2024' },
  { c: 'Frigorífico Guadalupe',             r: 'Auxiliar de Selección',              d: 'Ago 2024' },
  { c: 'Distribuidora Colvanes',            r: 'Analista de RRHH',                   d: 'Jun 2024' },
  { c: 'Empresa Servicios TI',              r: 'Auxiliar de RRHH',                   d: 'May 2024' },
  { c: 'Cooperativa Multiactiva',           r: 'Auxiliar de Selección',              d: 'Abr 2024' },
  { c: 'Almacenes Éxito (Grupo)',           r: 'Auxiliar de RRHH',                   d: 'Mar 2024' },
  { c: 'Call Center Digitex',               r: 'Auxiliar de Selección',              d: 'Feb 2024' },
  { c: 'Servicio de Empleo Regional',       r: 'Orientador Laboral',                 d: 'Ene 2024' },
  { c: 'Fundación Social Minuto de Dios',   r: 'Auxiliar de Talento Humano',         d: 'Dic 2023' },
  { c: 'Clínica San José',                  r: 'Auxiliar Administrativa',            d: 'Nov 2023' },
  { c: 'Colegio Mayor de Antioquia',        r: 'Monitor de Prácticas RRHH',         d: 'Oct 2023' },
  { c: 'Comfenalco Antioquia',              r: 'Auxiliar Administrativo',            d: 'Sep 2023' },
  { c: 'Empresa Familiar',                  r: 'Asistente Administrativa',           d: 'Ago 2023' },
  { c: 'Prácticas Universitarias',          r: 'Practicante RRHH',                   d: 'Jun 2023' },
];
const _finJobs = [
  { c: 'Mexichem Colombia',                 r: 'Jefe de Finanzas',                   d: '' },
  { c: 'Argos Concretos',                   r: 'Jefe Financiero y Contable',         d: '' },
  { c: 'PAVCO Wavin Colombia',              r: 'Jefe de Finanzas',                   d: '' },
  { c: 'Corona S.A. (Sumicol)',             r: 'Directora Financiera',               d: '' },
  { c: 'Cementos San Marcos',               r: 'Jefe de Finanzas',                   d: '' },
  { c: 'Siemens Colombia',                  r: 'Jefa de Contabilidad y Costos',      d: '' },
  { c: 'Acerías Paz del Río',               r: 'Analista Financiero Senior',         d: '' },
  { c: 'Empresas Públicas de Medellín',     r: 'Analista Financiero Senior',         d: '' },
  { c: 'Grupo Odinsa',                      r: 'Analista de Costos Senior',          d: '' },
  { c: 'Sumitomo (SCI)',                    r: 'Analista Contable Senior',           d: '' },
  { c: 'Celsia Colombia',                   r: 'Analista Financiero',                d: '' },
  { c: 'ISA (Interconexión Eléctrica)',     r: 'Analista Contable',                  d: '' },
  { c: 'Coltabaco (PMI)',                   r: 'Analista Financiero Senior',         d: '' },
  { c: 'Bancolombia',                       r: 'Analista Financiero',                d: '' },
  { c: 'Davivienda',                        r: 'Analista Contable',                  d: '' },
  { c: 'Grupo Sura',                        r: 'Analista Financiero',                d: '' },
  { c: 'ISA (Interconexión)',               r: 'Analista de Costos',                 d: 'Dic 2024' },
  { c: 'Electrocol SAS',                    r: 'Analista Contable',                  d: 'Nov 2024' },
  { c: 'Construcciones El Cóndor',          r: 'Analista Financiero',                d: 'Sep 2024' },
  { c: 'Celsia Colombia',                   r: 'Analista de Presupuesto',            d: 'Jul 2024' },
  { c: 'Empresas Municipales de Cali',      r: 'Contador Junior',                    d: 'Jun 2024' },
  { c: 'Colpapel S.A.',                     r: 'Analista Contable',                  d: 'May 2024' },
  { c: 'Fogansa S.A.',                      r: 'Analista Financiero',                d: 'Abr 2024' },
  { c: 'Constructora Conconcreto',          r: 'Asistente Contable',                 d: 'Mar 2024' },
  { c: 'Almacénes Éxito',                   r: 'Asistente Financiero',               d: 'Feb 2024' },
  { c: 'Microempresa Servicios',            r: 'Auxiliar Contable',                  d: 'Ene 2024' },
  { c: 'Empresa Familiar',                  r: 'Auxiliar Contable',                  d: 'Dic 2023' },
  { c: 'Proveedora de Servicios',           r: 'Asistente Administrativo',           d: 'Nov 2023' },
  { c: 'Comercializadora Local',            r: 'Auxiliar Contable',                  d: 'Oct 2023' },
  { c: 'Prácticas Universitarias',          r: 'Practicante Finanzas',               d: 'Sep 2023' },
];
const _venJobs = [
  { c: 'Kimberly-Clark Colombia',           r: 'Gerente Comercial Región Andina',    d: '' },
  { c: '3M Colombia',                       r: 'Gerente de Zona Sur',                d: '' },
  { c: 'AB InBev Colombia',                 r: 'Gerente de Ventas Institucional',    d: '' },
  { c: 'Alpina Productos Alimenticios',     r: 'Gerente Comercial',                  d: '' },
  { c: 'Colanta',                           r: 'Jefa Comercial Regional',            d: '' },
  { c: 'Grupo Sura (Inversura)',            r: 'Gerente de Ventas',                  d: '' },
  { c: 'Indupalma S.A.',                    r: 'Gerente Comercial',                  d: '' },
  { c: 'Carvajal Soluciones',               r: 'Gerente de Ventas B2B',              d: '' },
  { c: 'Nestlé Colombia',                   r: 'Gerente de Canal Mayoristas',        d: '' },
  { c: 'PAVCO Wavin',                       r: 'Gerente Comercial',                  d: '' },
  { c: 'Acesco Acería',                     r: 'Gerente de Zona Caribe',             d: '' },
  { c: 'Tecnoquímicas S.A.',                r: 'Gerente de Ventas Institucional',    d: '' },
  { c: 'JGB (Grupo EMI)',                   r: 'Gerente Comercial',                  d: '' },
  { c: 'Plásticos del Litoral',             r: 'Gerente de Ventas',                  d: '' },
  { c: 'Eternit Colombia',                  r: 'Jefe Comercial',                     d: '' },
  { c: 'Condor SAS',                        r: 'Gerente de Cuenta Clave',            d: '' },
  { c: 'Distribuidora Yanbal',              r: 'Gerente de Zona',                    d: '' },
  { c: 'Seguros Bolívar',                   r: 'Gerente de Canal',                   d: '' },
  { c: 'Industria Licorera de Caldas',      r: 'Gerente de Ventas',                  d: '' },
  { c: 'Distriagro Colombia',               r: 'Gerente Comercial',                  d: '' },
  { c: 'Colineal Colombia',                 r: 'Gerente de Zona Centro',             d: '' },
  { c: 'Productos Quaker Colombia',         r: 'Gerente de Canal Moderno',           d: '' },
  { c: 'Propilco S.A.',                     r: 'Gerente Comercial',                  d: '' },
  { c: 'Cementos Argos',                    r: 'Gerente de Canal Distribuidor',      d: '' },
  { c: 'Gaseosas LUX',                      r: 'Gerente de Zona Norte',              d: '' },
  { c: 'Hada S.A.S.',                       r: 'Gerente de Zona',                    d: '' },
  { c: 'SIC Colombia',                      r: 'Gerente de Canal',                   d: '' },
  { c: 'Ingeniería Comercial SAS',          r: 'Gerente de Canal',                   d: '' },
  { c: 'Distribuidora Nacional',            r: 'Asesor Comercial Senior',            d: 'Ene 2025' },
  { c: 'Equitel Colombia',                  r: 'Ejecutivo de Ventas',                d: 'Dic 2024' },
  { c: 'Multiflex SAS',                     r: 'Asesor Comercial',                   d: 'Nov 2024' },
  { c: 'Industria Molinera del Valle',      r: 'Asesor de Ventas',                   d: 'Oct 2024' },
  { c: 'Plásticos del Valle',               r: 'Ejecutivo Comercial',                d: 'Sep 2024' },
  { c: 'Tecno Comunicaciones SAS',          r: 'Asesor de Ventas',                   d: 'Ago 2024' },
  { c: 'Distral Colombia',                  r: 'Asesor Comercial',                   d: 'Jul 2024' },
  { c: 'Corfesco S.A.',                     r: 'Ejecutivo de Ventas',                d: 'Jun 2024' },
  { c: 'Materiales JC SAS',                 r: 'Asesor de Distribución',             d: 'May 2024' },
  { c: 'Colrespuest SAS',                   r: 'Ejecutivo Comercial',                d: 'Abr 2024' },
  { c: 'Ingeniería Digital Colombia',       r: 'Asesor de Ventas',                   d: 'Mar 2024' },
  { c: 'Distribuidora Regional SAS',        r: 'Asesor Comercial',                   d: 'Feb 2024' },
  { c: 'Tienda Industrial del Sur',         r: 'Asesor de Ventas',                   d: 'Ene 2024' },
  { c: 'Comercializadora El Parque',        r: 'Asesor Comercial',                   d: 'Dic 2023' },
  { c: 'Pinturas Colombia SAS',             r: 'Asesor de Ventas',                   d: 'Nov 2023' },
  { c: 'Distribuidora ABC Ltda.',           r: 'Auxiliar Comercial',                 d: 'Oct 2023' },
  { c: 'Almacén de Repuestos Moto',         r: 'Asesor de Ventas',                   d: 'Sep 2023' },
  { c: 'Pequeño Negocio Familiar',          r: 'Vendedor',                           d: 'Ago 2023' },
  { c: 'Minimarket La Esquina',             r: 'Auxiliar de Ventas',                 d: 'Jul 2023' },
  { c: 'Electrodomésticos XYZ',             r: 'Vendedor',                           d: 'Jun 2023' },
  { c: 'Empresa Familiar',                  r: 'Auxiliar Comercial',                 d: 'May 2023' },
  { c: 'Sin experiencia previa relevante',  r: 'Estudiante',                         d: '' },
];

// ══════════════════════════════════════════════════════════════════════════════
// VACANTE 1 — RECEPCIONISTA | Clínica Integral de Especialistas | Solo Scoring
// ══════════════════════════════════════════════════════════════════════════════
function _mkRecep(id: string, name: string, score: number, photo: string, initials: string, color: string, city: string, years: string, aspiration: string, salaryRange: SalaryRange): Candidate {
  const hi = score >= 77; const md = score >= 60;
  return {
    id, name, role: 'Recepcionista', sector: 'Servicios de Salud',
    years, location: `${city}, Colombia`,
    bio: `Recepcionista con experiencia en atención al paciente, gestión de citas y coordinación de agendas en entornos clínicos y administrativos.`,
    score, photo, avatarInitials: initials, avatarColor: color,
    hasCurrentJob: score > 65,
    ...(() => { const j = _recepJobs[parseInt(id.split('-')[1])-1] ?? _recepJobs[0]; return score > 65 ? { currentCompany: j.c, currentRole: j.r } : { lastCompany: j.c, lastRole: j.r, lastDate: j.d }; })(),
    superpoder: '"Atención cálida y gestión simultánea de múltiples tareas"',
    aspiration, budget: "$2'000.000", salaryRange, currentStage: 'scoring',
    scoringAI: {
      score: Math.round(score * 0.92), status: score >= 60 ? 'continua' : 'pendiente',
      resumen: hi
        ? `${name} presenta perfil sólido para recepción clínica. Experiencia comprobada en gestión de citas, atención al paciente y manejo de sistemas de turnos digitales.`
        : md
        ? `${name} cumple requisitos básicos del cargo con experiencia en servicio al cliente. Menor especialización en entornos de salud.`
        : `${name} presenta limitaciones en criterios clave del perfil. Poca experiencia formal en recepción y sin evidencia de manejo de sistemas de gestión.`,
      noNegociables: [
        { label: 'Experiencia +1 año en recepción o atención al cliente', cumple: hi },
        { label: 'Manejo de sistemas digitales de citas o turnos', cumple: score >= 67 },
        { label: 'Disponibilidad horario rotativo 6am–8pm', cumple: score >= 48 },
        { label: 'Ortografía, redacción y comunicación verbal clara', cumple: md },
      ],
      logros: hi
        ? ['Gestionó agenda de 120+ citas diarias con tasa de ausentismo < 5%', 'Implementó protocolo de recepción que redujo tiempos de espera en 18%']
        : md
        ? ['Atendió público de forma continua en entorno de alta demanda', 'Apoyó procesos de admisión y gestión documental en consultorio médico']
        : ['Experiencia puntual en atención al público sin continuidad demostrada'],
      senales: hi
        ? ['Confirmar disponibilidad para turnos rotativos completos']
        : md
        ? ['Experiencia no documentada con métricas', 'Validar manejo de software de gestión clínica']
        : ['Muy poca experiencia formal en recepción', 'Sin evidencia de herramientas digitales de gestión'],
    },
  };
}
const recepCandidates: Candidate[] = [
  _mkRecep('mr-1',  'Sandra Morales',     88, _p(1, 'women'),  'SM', '#8750F6', 'Bogotá',       '4 Años',          "$1'800.000", 'en_rango'),
  _mkRecep('mr-2',  'Diana Ríos',         84, _p(2, 'women'),  'DR', '#27BE69', 'Medellín',     '3 Años',          "$1'900.000", 'en_rango'),
  _mkRecep('mr-3',  'Andrea Quintero',    81, _p(3, 'women'),  'AQ', '#295BFF', 'Cali',         '3 Años',          "$2'000.000", 'en_rango'),
  _mkRecep('mr-4',  'Juliana Pinto',      78, _p(4, 'women'),  'JP', '#F6A350', 'Bogotá',       '2 Años',          "$2'200.000", 'fuera_de_rango'),
  _mkRecep('mr-5',  'Paola Gómez',        75, _p(5, 'women'),  'PG', '#8750F6', 'Bucaramanga',  '3 Años',          "$1'800.000", 'en_rango'),
  _mkRecep('mr-6',  'Marcela Salcedo',    72, _p(6, 'women'),  'MS', '#27BE69', 'Pereira',      '2 Años',          "$2'300.000", 'fuera_de_rango'),
  _mkRecep('mr-7',  'Claudia Bermúdez',   69, _p(7, 'women'),  'CB', '#295BFF', 'Bogotá',       '2 Años',          "$1'700.000", 'en_rango'),
  _mkRecep('mr-8',  'Natalia Ospina',     66, _p(8, 'women'),  'NO', '#F6A350', 'Medellín',     '1 Año',           "$2'400.000", 'fuera_de_rango'),
  _mkRecep('mr-9',  'Carolina Gutiérrez', 63, _p(9, 'women'),  'CG', '#8750F6', 'Barranquilla', '2 Años',          "$1'900.000", 'en_rango'),
  _mkRecep('mr-10', 'Luisa Ochoa',        60, _p(10, 'women'), 'LO', '#27BE69', 'Cali',         '1 Año',           "$2'500.000", 'fuera_de_rango'),
  _mkRecep('mr-11', 'Mónica Castañeda',   57, _p(11, 'women'), 'MC', '#295BFF', 'Bogotá',       '1 Año',           "$1'600.000", 'en_rango'),
  _mkRecep('mr-12', 'Patricia Herrera',   53, _p(13, 'women'), 'PH', '#F6A350', 'Manizales',    '1 Año',           "$2'000.000", 'en_rango'),
  _mkRecep('mr-13', 'Esperanza Londoño',  50, _p(15, 'women'), 'EL', '#8750F6', 'Tunja',        'Sin experiencia', "$1'500.000", 'en_rango'),
  _mkRecep('mr-14', 'Yaneth Ramos',       46, _p(16, 'women'), 'YR', '#F65078', 'Bogotá',       'Sin experiencia', "$2'800.000", 'fuera_de_rango'),
  _mkRecep('mr-15', 'Rosa Avendaño',      43, _p(17, 'women'), 'RA', '#F6A350', 'Ibagué',       'Sin experiencia', "$1'800.000", 'en_rango'),
];

// ══════════════════════════════════════════════════════════════════════════════
// VACANTE 2 — AUXILIAR DE BODEGA | Termoformados del Valle S.A.S. | Scoring + Pre-screening
// ══════════════════════════════════════════════════════════════════════════════
function _mkBodega(id: string, name: string, score: number, photo: string, initials: string, color: string, city: string, years: string, aspiration: string, salaryRange: SalaryRange, withPre = false): Candidate {
  const hi = score >= 70; const md = score >= 52;
  const pre: Candidate['prescreeningAI'] = withPre ? {
    score: score + 2, status: 'continua',
    resumen: hi
      ? `${name} demuestra conocimiento operativo sólido en bodega y logística de manufactura. Sus respuestas evidencian dominio de procesos de recibo, despacho y control de inventario en entornos industriales.`
      : `${name} cuenta con experiencia básica en operaciones de bodega. Identifica los procesos principales pero con menor profundidad en sistemas y estándares operativos.`,
    noNegociables: [
      { label: 'Experiencia en recibo, despacho y control de inventario', score: hi ? score - 3 : score - 10, evidencia: hi ? 'Describió con precisión procesos de recibo por lotes y guías de remisión en empresa de distribución.' : 'Menciona experiencia básica sin detalle de procedimientos formales.' } as any,
      { label: 'Manejo físico de mercancía y seguridad industrial básica', score: hi ? score + 1 : score - 5, evidencia: hi ? 'Entrenado en manejo de cargas hasta 25 kg y uso de EPP en empresa manufacturera.' : 'Conoce normas básicas pero sin certificación formal.' } as any,
      { label: 'Lectura de órdenes de trabajo y documentación de bodega', score: hi ? score - 2 : score - 7, evidencia: hi ? 'Maneja guías de remisión, facturas de despacho y reportes de novedad.' : 'Conoce el proceso pero no lo ha aplicado de forma sistemática.' } as any,
      { label: 'Disponibilidad turno rotativo mañana / tarde / noche', score: hi ? score - 1 : score - 5, evidencia: hi ? 'Confirma disponibilidad total. Ha trabajado en esquemas de tres turnos.' : 'Disponibilidad condicionada; requiere confirmación.' } as any,
    ],
    plusDetectados: hi
      ? ['Experiencia en empresa de manufactura o distribución de consumo masivo', 'Conocimiento de seguridad industrial y BPM básico en bodega', 'Actitud proactiva y apertura a entrenamiento en nuevos procesos operativos']
      : ['Disposición para aprender procesos de bodega industrial', 'Actitud positiva y puntualidad evidenciada en referencias personales'],
    senales: hi
      ? ['Confirmar experiencia con sistema WMS o inventario digital', 'Verificar conocimiento en manejo de materiales plásticos o termoformados']
      : ['Validar resistencia física para jornadas de carga extendida', 'Sin experiencia en empresa de manufactura con procesos estandarizados'],
  } : undefined;
  return {
    id, name, role: 'Auxiliar de Bodega', sector: 'Manufactura / Termoformados',
    years, location: `${city}, Colombia`,
    bio: `Auxiliar de bodega con experiencia en operaciones logísticas de manufactura. Procesos de inventario, despacho y seguridad industrial en entornos de producción masiva de termoformados.`,
    score, photo, avatarInitials: initials, avatarColor: color,
    hasCurrentJob: score > 58,
    ...(() => { const j = _bodegaJobs[parseInt(id.split('-')[1])-1] ?? _bodegaJobs[0]; return score > 58 ? { currentCompany: j.c, currentRole: j.r } : { lastCompany: j.c, lastRole: j.r, lastDate: j.d }; })(),
    superpoder: '"Orden, precisión y cero errores en despacho"',
    aspiration, budget: "$1'800.000", salaryRange, currentStage: withPre ? 'prescreening' : 'scoring',
    scoringAI: {
      score: Math.round(score * 0.93), status: score >= 52 ? 'continua' : 'pendiente',
      resumen: hi
        ? `${name} presenta perfil operativo sólido con experiencia en logística de manufactura. Cumple criterios clave para el cargo de Auxiliar de Bodega en empresa de termoformados.`
        : md
        ? `${name} tiene conocimientos básicos del área pero con experiencia limitada en entornos industriales formales.`
        : `${name} no acredita experiencia suficiente en bodega industrial. Perfil por debajo del mínimo requerido.`,
      noNegociables: [
        { label: 'Experiencia +1 año en bodega, almacén u operación logística', cumple: hi },
        { label: 'Manejo básico de sistema de inventario (WMS, Excel o físico)', cumple: score >= 63 },
        { label: 'Capacidad de carga física (+20 kg) y turnos rotativos', cumple: md },
        { label: 'Sin antecedentes — apto para examen médico ocupacional', cumple: score >= 45 },
      ],
      logros: hi
        ? ['Gestionó despachos de 500+ unidades/día con 99% de precisión en inventario', 'Coordinó procesos de recibo e inspección en empresa de distribución de consumo masivo']
        : md
        ? ['Participó en procesos básicos de recibo y despacho', 'Colaboró en inventarios físicos periódicos de almacén']
        : ['Sin logros documentados en el área operativa'],
      senales: hi
        ? ['Verificar experiencia específica en termoformados o empaques plásticos']
        : md
        ? ['Confirmar experiencia en empresa estructurada con inventario formal', 'Validar manejo de montacargas o equipos auxiliares de bodega']
        : ['Muy poca experiencia documentable en logística industrial', 'Riesgo de rotación temprana'],
    },
    ...(pre ? { prescreeningAI: pre } : {}),
  };
}
const bodegaPreCandidates: Candidate[] = [
  _mkBodega('mb-1',  'Carlos Durán',       86, _p(1, 'men'),   'CD', '#8750F6', 'Bogotá',      '4 Años',          "$1'700.000", 'en_rango',       true),
  _mkBodega('mb-2',  'Andrés Pineda',       83, _p(2, 'men'),   'AP', '#27BE69', 'Medellín',    '3 Años',          "$1'800.000", 'en_rango',       true),
  _mkBodega('mb-3',  'Luis Felipe Cardona', 80, _p(3, 'men'),   'LC', '#295BFF', 'Cali',        '3 Años',          "$1'600.000", 'en_rango',       true),
  _mkBodega('mb-4',  'Miguel Torres',       77, _p(4, 'men'),   'MT', '#F6A350', 'Bogotá',      '2 Años',          "$1'900.000", 'fuera_de_rango', true),
  _mkBodega('mb-5',  'David Rodríguez',     74, _p(5, 'men'),   'DR', '#8750F6', 'Medellín',    '2 Años',          "$1'700.000", 'en_rango',       true),
  _mkBodega('mb-6',  'Sergio Peña',         72, _p(6, 'men'),   'SP', '#27BE69', 'Bogotá',      '3 Años',          "$1'800.000", 'en_rango',       true),
  _mkBodega('mb-7',  'Felipe Muñoz',        70, _p(7, 'men'),   'FM', '#295BFF', 'Cali',        '2 Años',          "$1'500.000", 'en_rango',       true),
  _mkBodega('mb-8',  'Iván Pulido',         68, _p(8, 'men'),   'IP', '#F6A350', 'Bogotá',      '1 Año',           "$2'000.000", 'fuera_de_rango', true),
  _mkBodega('mb-9',  'Óscar Vargas',        66, _p(9, 'men'),   'OV', '#8750F6', 'Medellín',    '2 Años',          "$1'700.000", 'en_rango',       true),
  _mkBodega('mb-10', 'Jorge Hurtado',       64, _p(10, 'men'),  'JH', '#27BE69', 'Cali',        '1 Año',           "$1'600.000", 'en_rango',       true),
  _mkBodega('mb-11', 'Mauricio Sánchez',    62, _p(12, 'men'),  'MS', '#295BFF', 'Bogotá',      '2 Años',          "$1'800.000", 'en_rango',       true),
  _mkBodega('mb-12', 'César Medina',        60, _p(13, 'men'),  'CM', '#F6A350', 'Medellín',    '1 Año',           "$2'100.000", 'fuera_de_rango', true),
  _mkBodega('mb-13', 'Rodrigo Lozano',      58, _p(14, 'men'),  'RL', '#8750F6', 'Bogotá',      '1 Año',           "$1'600.000", 'en_rango',       true),
  _mkBodega('mb-14', 'Hernando Carvajal',   55, _p(15, 'men'),  'HC', '#27BE69', 'Barranquilla','1 Año',           "$1'800.000", 'en_rango',       true),
  _mkBodega('mb-15', 'Mario Pedraza',       52, _p(16, 'men'),  'MP', '#295BFF', 'Bogotá',      'Sin experiencia', "$1'500.000", 'en_rango',       true),
];
const bodegaScoreOnly: Candidate[] = [
  _mkBodega('mb-16', 'Liliana Arias',       49, _p(20, 'women'), 'LA', '#F6A350', 'Cali',      '1 Año',           "$1'800.000", 'en_rango'),
  _mkBodega('mb-17', 'Carmen Velásquez',    46, _p(21, 'women'), 'CV', '#8750F6', 'Bogotá',    'Sin experiencia', "$2'200.000", 'fuera_de_rango'),
  _mkBodega('mb-18', 'Yessica Molina',      43, _p(22, 'women'), 'YM', '#27BE69', 'Medellín',  'Sin experiencia', "$1'600.000", 'en_rango'),
  _mkBodega('mb-19', 'Dora Vargas',         40, _p(23, 'women'), 'DV', '#295BFF', 'Bogotá',    'Sin experiencia', "$1'500.000", 'en_rango'),
  _mkBodega('mb-20', 'Jenny Córdoba',       37, _p(24, 'women'), 'JC', '#F65078', 'Cali',      'Sin experiencia', "$2'500.000", 'fuera_de_rango'),
];

// ══════════════════════════════════════════════════════════════════════════════
// VACANTE 3 — ANALISTA DE TALENTO HUMANO | Termoformados del Valle S.A.S.
// Scoring + Pre-screening + Entrevistas
// ══════════════════════════════════════════════════════════════════════════════
function _mkTH(id: string, name: string, score: number, photo: string, initials: string, color: string, city: string, years: string, aspiration: string, salaryRange: SalaryRange, stage: 'scoring'|'prescreening'|'entrevistas' = 'scoring'): Candidate {
  const hi = score >= 74; const md = score >= 57;
  const pre: Candidate['prescreeningAI'] = stage !== 'scoring' ? {
    score: score + 1, status: 'continua',
    resumen: hi
      ? `${name} demuestra dominio del proceso de selección en entornos de manufactura. Maneja ATS, estructura entrevistas por competencias y gestiona KPIs básicos de talento humano con autonomía.`
      : `${name} conoce el proceso de selección a nivel conceptual. Tiene experiencia en apoyo pero con menor autonomía en gestión autónoma de candidatos y cierres.`,
    noNegociables: [
      { label: 'Profesional o tecnólogo en RRHH, Psicología o afines', score: hi ? score - 2 : score - 8, evidencia: hi ? 'Tecnóloga en Gestión del Talento Humano con 3 años de experiencia activa en selección masiva.' : 'Estudiante de últimos semestres; experiencia práctica limitada.' } as any,
      { label: 'Experiencia +2 años en selección masiva de personal operativo', score: hi ? score - 5 : score - 12, evidencia: hi ? 'Gestionó procesos de selección masiva para líneas de producción en empresa de manufactura.' : 'Experiencia en selección básica sin volumen masivo ni entornos industriales.' } as any,
      { label: 'Dominio de ATS o sistema de seguimiento de candidatos', score: hi ? score - 3 : score - 9, evidencia: hi ? 'Maneja Buk, Zoho Recruit o plataformas similares para gestión de candidatos.' : 'Usa Excel como único sistema de seguimiento; sin ATS formal.' } as any,
      { label: 'Aplicación de pruebas psicotécnicas (Cleaver, DISC, Wonderlic)', score: hi ? score - 4 : score - 10, evidencia: hi ? 'Certificada en aplicación e interpretación de Cleaver y DISC.' : 'Conoce las pruebas pero sin certificación formal para aplicarlas e interpretarlas.' } as any,
    ],
    plusDetectados: hi
      ? ['Conocimiento de legislación laboral colombiana vigente', 'Experiencia en onboarding y bienestar laboral en manufactura', 'Manejo de KPIs: tiempo de selección, rotación, costo por contratación']
      : ['Interés genuino en el área de talento humano', 'Buena comunicación interpersonal y disposición de aprendizaje'],
    senales: hi
      ? ['Confirmar manejo de KPIs de selección con datos propios verificables', 'Validar velocidad de cierre en procesos masivos con alta presión de tiempo']
      : ['Escasa autonomía en gestión de procesos completos de selección', 'Validar manejo real de pruebas y entrevistas sin supervisión constante'],
  } : undefined;
  return {
    id, name, role: 'Analista de Talento Humano', sector: 'Manufactura / RRHH',
    years, location: `${city}, Colombia`,
    bio: `Analista de Talento Humano con experiencia en selección masiva y gestión de candidatos para empresa de manufactura. Manejo de ATS, pruebas psicotécnicas y onboarding operativo.`,
    score, photo, avatarInitials: initials, avatarColor: color,
    hasCurrentJob: score > 62,
    ...(() => { const j = _thJobs[parseInt(id.split('-')[1])-1] ?? _thJobs[0]; return score > 62 ? { currentCompany: j.c, currentRole: j.r } : { lastCompany: j.c, lastRole: j.r, lastDate: j.d }; })(),
    superpoder: '"Agilidad en selección masiva sin perder calidad del proceso"',
    aspiration, budget: "$2'800.000", salaryRange, currentStage: stage,
    scoringAI: {
      score: Math.round(score * 0.93), status: score >= 55 ? 'continua' : 'pendiente',
      resumen: hi
        ? `${name} presenta perfil sólido para Analista de Talento Humano en manufactura. Experiencia en selección masiva, uso de ATS y aplicación de pruebas psicotécnicas con autonomía.`
        : md
        ? `${name} tiene formación en RRHH con experiencia en selección básica. Requiere desarrollo en procesos masivos y herramientas avanzadas de gestión.`
        : `${name} tiene conocimiento teórico del área pero carece de experiencia práctica suficiente para el cargo autónomo.`,
      noNegociables: [
        { label: 'Profesional o tecnólogo en RRHH, Psicología o afines', cumple: hi },
        { label: 'Experiencia +2 años en selección masiva de personal operativo', cumple: score >= 68 },
        { label: 'Dominio de ATS o herramientas de seguimiento de candidatos', cumple: score >= 62 },
        { label: 'Aplicación e interpretación de pruebas psicotécnicas certificadas', cumple: md },
      ],
      logros: hi
        ? ['Lideró proceso de selección masiva para 80+ operarios en 45 días', 'Redujo tiempo promedio de cierre de posiciones operativas en 30%']
        : md
        ? ['Apoyó selección de personal para turnos de producción', 'Coordinó aplicación de pruebas psicotécnicas para procesos de ingreso']
        : ['Participación en procesos de selección sin liderazgo ni métricas propias'],
      senales: hi
        ? ['Confirmar experiencia en sector manufactura o volumen equivalente']
        : md
        ? ['Validar autonomía real en cierre de procesos de selección', 'Confirmar manejo de KPIs propios de gestión de talento']
        : ['Poca experiencia autónoma en selección', 'Sin manejo documentado de ATS ni pruebas psicotécnicas certificadas'],
    },
    ...(pre ? { prescreeningAI: pre } : {}),
  };
}
const thEntrevistasCandidates: Candidate[] = [
  _mkTH('mth-1',  'Laura Téllez',       91, _p(25, 'women'), 'LT', '#8750F6', 'Bogotá',    '5 Años', "$2'700.000", 'en_rango',       'entrevistas'),
  _mkTH('mth-2',  'Valentina Rojas',    88, _p(26, 'women'), 'VR', '#27BE69', 'Medellín',  '4 Años', "$2'800.000", 'en_rango',       'entrevistas'),
  _mkTH('mth-3',  'Sofía Mendoza',      85, _p(27, 'women'), 'SM', '#295BFF', 'Cali',      '3 Años', "$2'600.000", 'en_rango',       'entrevistas'),
  _mkTH('mth-4',  'Ana María Jaime',    83, _p(28, 'women'), 'AJ', '#F6A350', 'Bogotá',    '4 Años', "$2'900.000", 'fuera_de_rango', 'entrevistas'),
  _mkTH('mth-5',  'Isabella Castro',    81, _p(29, 'women'), 'IC', '#8750F6', 'Medellín',  '3 Años', "$2'700.000", 'en_rango',       'entrevistas'),
  _mkTH('mth-6',  'Daniela Perea',      79, _p(30, 'women'), 'DP', '#27BE69', 'Bogotá',    '3 Años', "$3'000.000", 'fuera_de_rango', 'entrevistas'),
  _mkTH('mth-7',  'Camila Aguirre',     77, _p(31, 'women'), 'CA', '#295BFF', 'Cali',      '2 Años', "$2'600.000", 'en_rango',       'entrevistas'),
  _mkTH('mth-8',  'Mariana Buitrago',   75, _p(32, 'women'), 'MB', '#F6A350', 'Bogotá',    '3 Años', "$2'800.000", 'en_rango',       'entrevistas'),
  _mkTH('mth-9',  'Paola Arango',       73, _p(35, 'women'), 'PA', '#8750F6', 'Medellín',  '2 Años', "$3'100.000", 'fuera_de_rango', 'entrevistas'),
  _mkTH('mth-10', 'Sara Nieto',         71, _p(36, 'women'), 'SN', '#27BE69', 'Bogotá',    '2 Años', "$2'600.000", 'en_rango',       'entrevistas'),
];
const thPreCandidates: Candidate[] = [
  _mkTH('mth-11', 'Marcela Rueda',      69, _p(37, 'women'), 'MR', '#295BFF', 'Cali',      '2 Años', "$2'700.000", 'en_rango',       'prescreening'),
  _mkTH('mth-12', 'Alejandra Torres',   67, _p(38, 'women'), 'AT', '#F6A350', 'Bogotá',    '2 Años', "$2'800.000", 'en_rango',       'prescreening'),
  _mkTH('mth-13', 'Tatiana Reyes',      65, _p(39, 'women'), 'TR', '#8750F6', 'Medellín',  '1 Año',  "$3'200.000", 'fuera_de_rango', 'prescreening'),
  _mkTH('mth-14', 'Leidy García',       63, _p(40, 'women'), 'LG', '#27BE69', 'Bogotá',    '2 Años', "$2'600.000", 'en_rango',       'prescreening'),
  _mkTH('mth-15', 'Yolanda Díaz',       61, _p(41, 'women'), 'YD', '#295BFF', 'Pereira',   '1 Año',  "$2'500.000", 'en_rango',       'prescreening'),
  _mkTH('mth-16', 'Nathalia Becerra',   59, _p(43, 'women'), 'NB', '#F6A350', 'Bogotá',    '1 Año',  "$2'800.000", 'en_rango',       'prescreening'),
  _mkTH('mth-17', 'Claudia Mesa',       57, _p(44, 'women'), 'CM', '#8750F6', 'Medellín',  '1 Año',  "$3'000.000", 'fuera_de_rango', 'prescreening'),
  _mkTH('mth-18', 'Rosa Peña',          55, _p(46, 'women'), 'RP', '#27BE69', 'Cali',      '1 Año',  "$2'700.000", 'en_rango',       'prescreening'),
];
const thScoreOnly: Candidate[] = [
  _mkTH('mth-19', 'Gloria Zapata',      53, _p(47, 'women'), 'GZ', '#295BFF', 'Bogotá',    '1 Año',           "$2'600.000", 'en_rango'),
  _mkTH('mth-20', 'Martha Hernández',   51, _p(48, 'women'), 'MH', '#F6A350', 'Manizales', 'Sin experiencia', "$2'400.000", 'en_rango'),
  _mkTH('mth-21', 'Fabián Correa',      49, _p(17, 'men'),   'FC', '#8750F6', 'Bogotá',    '1 Año',           "$2'800.000", 'en_rango'),
  _mkTH('mth-22', 'Andrés Salazar',     47, _p(18, 'men'),   'AS', '#27BE69', 'Medellín',  '1 Año',           "$3'200.000", 'fuera_de_rango'),
  _mkTH('mth-23', 'Ricardo Vásquez',    45, _p(19, 'men'),   'RV', '#295BFF', 'Cali',      'Sin experiencia', "$2'500.000", 'en_rango'),
  _mkTH('mth-24', 'Juan Carlos Orozco', 43, _p(20, 'men'),   'JO', '#F6A350', 'Bogotá',    'Sin experiencia', "$2'600.000", 'en_rango'),
  _mkTH('mth-25', 'Diego Castaño',      41, _p(21, 'men'),   'DC', '#8750F6', 'Medellín',  'Sin experiencia', "$2'800.000", 'en_rango'),
  _mkTH('mth-26', 'Héctor Rengifo',     39, _p(23, 'men'),   'HR', '#27BE69', 'Bogotá',    'Sin experiencia', "$3'000.000", 'fuera_de_rango'),
  _mkTH('mth-27', 'Nelson Ramírez',     37, _p(24, 'men'),   'NR', '#295BFF', 'Cali',      'Sin experiencia', "$2'400.000", 'en_rango'),
  _mkTH('mth-28', 'Jhon Álvarez',       35, _p(26, 'men'),   'JA', '#F6A350', 'Bogotá',    'Sin experiencia', "$2'600.000", 'en_rango'),
  _mkTH('mth-29', 'Omar González',      33, _p(27, 'men'),   'OG', '#8750F6', 'Medellín',  'Sin experiencia', "$2'800.000", 'en_rango'),
  _mkTH('mth-30', 'Víctor Espitia',     30, _p(28, 'men'),   'VE', '#F65078', 'Bogotá',    'Sin experiencia', "$3'500.000", 'fuera_de_rango'),
];

// ══════════════════════════════════════════════════════════════════════════════
// VACANTE 4 — JEFE DE FINANZAS | Termoformados del Valle S.A.S.
// Scoring + Pre-screening + Entrevistas + Evaluaciones
// ══════════════════════════════════════════════════════════════════════════════
function _psychFin(score: number, name: string): PsychTestResult {
  return {
    score: score - 4,
    insight: `Perfil con alto rigor analítico y orientación al control financiero industrial. ${name} opera con precisión, toma decisiones basadas en datos y construye reportes con visión estratégica para la operación manufacturera.`,
    fitCards: [
      { axis: 'Rigor financiero', idealScore: 90, candidateScore: score, summary: 'Precisión y control en la gestión de información financiera.', detail: 'Mantiene controles internos rigurosos, detecta inconsistencias contables y garantiza la integridad de los datos en entornos de manufactura de alto volumen.' },
      { axis: 'Liderazgo de equipo financiero', idealScore: 80, candidateScore: score - 7, summary: 'Conducción de equipos contables con foco en resultado.', detail: 'Guía equipos de contabilidad y tesorería. Establece rutinas de trabajo, define responsabilidades y retroalimenta con base en cumplimiento de indicadores.' },
      { axis: 'Orientación estratégica', idealScore: 75, candidateScore: score - 5, summary: 'Vincula las finanzas con las decisiones de negocio.', detail: 'Eleva la conversación contable a análisis de rentabilidad, control de costos por producto y proyección de escenarios financieros para decisiones gerenciales.' },
    ],
    radarPoints: [
      { label: 'Iniciativa',       value: score - 3 }, { label: 'Agente cambio',    value: score - 6 },
      { label: 'Proactividad',     value: score - 2 }, { label: 'Inteligencia Social', value: score - 9 },
      { label: 'Autonomía',        value: score + 2 }, { label: 'Agilidad',         value: score - 4 },
      { label: 'Precisión',        value: score + 8 }, { label: 'Rigor analítico',  value: score + 6 },
      { label: 'P. Analítico',     value: score + 4 }, { label: 'Orden y método',   value: score + 5 },
    ],
    veredicto: [
      { title: 'Quién es conductualmente', body: `Perfil con alta orientación al orden, precisión y control. Trabaja con metodología clara, establece procesos y los sigue rigurosamente. Su estilo es analítico y sistemático, lo que se traduce en reportes confiables y bajo índice de error. Puede generar fricción en contextos de alta incertidumbre.` },
      { title: 'Fit con este rol', body: `El rol requiere control financiero riguroso y capacidad de presentar información clave a gerencia — ejes en los que este candidato destaca. El liderazgo de equipo es un eje a desarrollar con acompañamiento en los primeros meses.` },
    ],
    preguntas: [
      { tag: 'Para: Gerente General', question: '"Cuéntame cómo estructuras el proceso de cierre contable mensual. ¿Qué indicadores presentas a gerencia y cómo los construyes?"', validates: 'Rigor financiero y visión estratégica' },
      { tag: 'Para: RRHH', question: '"¿Cómo manejas la tensión entre la urgencia del área operativa y los tiempos de procesamiento contable? Dame un ejemplo concreto."', validates: 'Liderazgo bajo presión' },
    ],
  };
}
function _mkFin(id: string, name: string, score: number, photo: string, initials: string, color: string, city: string, years: string, aspiration: string, salaryRange: SalaryRange, stage: 'scoring'|'prescreening'|'entrevistas'|'evaluaciones' = 'scoring'): Candidate {
  const hi = score >= 78; const md = score >= 60;
  const pre: Candidate['prescreeningAI'] = stage !== 'scoring' ? {
    score: score + 1, status: 'continua',
    resumen: hi
      ? `${name} demuestra dominio financiero sólido con enfoque en control de costos y reportes gerenciales para empresa industrial. Maneja ERP y tiene visión estratégica del área.`
      : `${name} tiene formación financiera y experiencia básica en contabilidad. Menor profundidad en analítica avanzada y liderazgo financiero estratégico.`,
    noNegociables: [
      { label: 'Profesional en Contaduría, Finanzas o Economía con especialización', score: hi ? score - 2 : score - 8, evidencia: hi ? 'Contador Público con especialización en Gerencia Financiera — UNAL / EAN.' : 'Profesional en contabilidad sin especialización completa.' } as any,
      { label: 'Experiencia +7 años en jefatura financiera o contable en manufactura', score: hi ? score - 5 : score - 12, evidencia: hi ? '9 años: Jefe de Contabilidad y Jefe de Finanzas en empresas de manufactura.' : '5 años en roles de analista sin cargo formal de jefatura.' } as any,
      { label: 'Dominio de SAP, Oracle o ERP financiero equivalente', score: hi ? score - 3 : score - 9, evidencia: hi ? 'Manejo avanzado de SAP FI/CO. Participó en implementación en empresa anterior.' : 'Manejo básico de Siigo y Excel. Sin experiencia en SAP.' } as any,
      { label: 'Inglés nivel B2 para reportes a casa matriz o socios', score: hi ? score - 4 : score - 11, evidencia: hi ? 'Presenta reportes mensuales en inglés a dirección regional. Certificación B2 vigente.' : 'Inglés básico funcional — sin reportes formales en inglés.' } as any,
    ],
    plusDetectados: hi
      ? ['Experiencia en presupuestación anual y control presupuestal mensual', 'Manejo de análisis de costos por producto y contribución marginal', 'Conocimiento de NIIF y legislación tributaria colombiana vigente']
      : ['Formación sólida en contabilidad con base técnica adecuada', 'Manejo de herramientas ofimáticas y básicas de gestión financiera'],
    senales: hi
      ? ['Confirmar experiencia específica en costeo industrial de manufactura', 'Validar capacidad de presentación financiera ejecutiva a nivel gerencial']
      : ['Escasa experiencia en liderazgo real de equipo financiero', 'Validar conocimiento de NIIF y costeo por centros de costo'],
  } : undefined;
  const psych = stage === 'evaluaciones' ? _psychFin(score, name) : undefined;
  return {
    id, name, role: 'Jefe de Finanzas', sector: 'Manufactura / Finanzas',
    years, location: `${city}, Colombia`,
    bio: `Jefe de Finanzas con experiencia en control financiero, presupuesto y reportes gerenciales para empresa de manufactura. Liderazgo de equipos contables y análisis de costos industriales.`,
    score, photo, avatarInitials: initials, avatarColor: color,
    hasCurrentJob: score > 60,
    ...(() => { const j = _finJobs[parseInt(id.split('-')[1])-1] ?? _finJobs[0]; return score > 60 ? { currentCompany: j.c, currentRole: j.r } : { lastCompany: j.c, lastRole: j.r, lastDate: j.d }; })(),
    superpoder: '"Rigor financiero y visión estratégica de la operación"',
    aspiration, budget: "$12'000.000", salaryRange, currentStage: stage,
    scoringAI: {
      score: Math.round(score * 0.94), status: score >= 58 ? 'continua' : 'pendiente',
      resumen: hi
        ? `${name} presenta perfil sólido para Jefe de Finanzas en manufactura. Experiencia en control financiero, reportes gerenciales y manejo de ERP en entornos industriales.`
        : md
        ? `${name} tiene formación financiera y experiencia básica. Requiere mayor desarrollo en liderazgo estratégico y herramientas ERP avanzadas.`
        : `${name} presenta perfil insuficiente para el nivel de jefatura requerido. Experiencia y formación por debajo del umbral mínimo.`,
      noNegociables: [
        { label: 'Profesional en Contaduría, Finanzas o Economía con especialización', cumple: hi },
        { label: 'Experiencia +7 años en jefatura financiera en manufactura', cumple: score >= 72 },
        { label: 'Dominio de SAP, Oracle o ERP financiero equivalente', cumple: score >= 66 },
        { label: 'Inglés nivel B2 para reportes a dirección regional', cumple: md },
      ],
      logros: hi
        ? ['Redujo costos financieros en 12% mediante renegociación de líneas de crédito', 'Implementó sistema de costeo ABC para 200+ referencias de manufactura', 'Lideró cierre contable mensual de empresa con $80B en ventas anuales']
        : md
        ? ['Apoyó proceso de presupuestación anual en empresa de manufactura', 'Elaboró reportes financieros mensuales para gerencia']
        : ['Participación en procesos contables básicos sin liderazgo estratégico ni jefatura'],
      senales: hi
        ? ['Confirmar experiencia específica en costeo industrial de termoformados']
        : md
        ? ['Validar experiencia real en liderazgo de equipo financiero', 'Confirmar nivel de inglés para reportes internacionales']
        : ['Perfil muy por debajo del nivel de jefatura requerido', 'Sin experiencia en manufactura ni ERP avanzado'],
    },
    ...(pre ? { prescreeningAI: pre } : {}),
    ...(psych ? { psychTest: psych } : {}),
  };
}
const finEvalCandidates: Candidate[] = [
  _mkFin('mfin-1', 'Mauricio Giraldo',   93, _p(29, 'men'),   'MG', '#8750F6', 'Bogotá',     '12 Años', "$11'000.000", 'en_rango',       'evaluaciones'),
  _mkFin('mfin-2', 'Carlos Montoya',     91, _p(30, 'men'),   'CM', '#27BE69', 'Medellín',   '10 Años', "$11'500.000", 'en_rango',       'evaluaciones'),
  _mkFin('mfin-3', 'Roberto Jiménez',    88, _p(31, 'men'),   'RJ', '#295BFF', 'Bogotá',     '9 Años',  "$11'000.000", 'en_rango',       'evaluaciones'),
  _mkFin('mfin-4', 'Patricia Moreno',    86, _p(47, 'women'), 'PM', '#F6A350', 'Medellín',   '8 Años',  "$12'000.000", 'en_rango',       'evaluaciones'),
  _mkFin('mfin-5', 'Santiago Restrepo',  84, _p(32, 'men'),   'SR', '#8750F6', 'Bogotá',     '8 Años',  "$13'000.000", 'fuera_de_rango', 'evaluaciones'),
  _mkFin('mfin-6', 'Adriana Ochoa',      82, _p(48, 'women'), 'AO', '#27BE69', 'Cali',       '7 Años',  "$11'500.000", 'en_rango',       'evaluaciones'),
];
const finEntrevistasCandidates: Candidate[] = [
  _mkFin('mfin-7',  'Jaime Gutiérrez',   80, _p(33, 'men'),   'JG', '#295BFF', 'Bogotá',    '8 Años',  "$11'000.000", 'en_rango',       'entrevistas'),
  _mkFin('mfin-8',  'Fernando Ríos',     78, _p(36, 'men'),   'FR', '#F6A350', 'Medellín',  '7 Años',  "$12'000.000", 'en_rango',       'entrevistas'),
  _mkFin('mfin-9',  'Leonardo Castro',   76, _p(37, 'men'),   'LC', '#8750F6', 'Bogotá',    '7 Años',  "$12'500.000", 'fuera_de_rango', 'entrevistas'),
  _mkFin('mfin-10', 'Gustavo Pedraza',   74, _p(38, 'men'),   'GP', '#27BE69', 'Cali',      '6 Años',  "$11'000.000", 'en_rango',       'entrevistas'),
  _mkFin('mfin-11', 'Cecilia Vargas',    72, _p(49, 'women'), 'CV', '#295BFF', 'Bogotá',    '6 Años',  "$11'500.000", 'en_rango',       'entrevistas'),
  _mkFin('mfin-12', 'Alberto Navarro',   70, _p(39, 'men'),   'AN', '#F6A350', 'Medellín',  '6 Años',  "$13'000.000", 'fuera_de_rango', 'entrevistas'),
];
const finPreCandidates: Candidate[] = [
  _mkFin('mfin-13', 'Hernán Mora',       68, _p(40, 'men'),   'HM', '#8750F6', 'Bogotá',    '7 Años',  "$11'000.000", 'en_rango',       'prescreening'),
  _mkFin('mfin-14', 'Eduardo Vargas',    66, _p(41, 'men'),   'EV', '#27BE69', 'Medellín',  '5 Años',  "$12'000.000", 'en_rango',       'prescreening'),
  _mkFin('mfin-15', 'Margarita Loaiza',  64, _p(50, 'women'), 'ML', '#295BFF', 'Bogotá',    '5 Años',  "$11'500.000", 'en_rango',       'prescreening'),
  _mkFin('mfin-16', 'Arturo Quintero',   62, _p(42, 'men'),   'AQ', '#F6A350', 'Cali',      '6 Años',  "$14'000.000", 'fuera_de_rango', 'prescreening'),
  _mkFin('mfin-17', 'Elena Pérez',       60, _p(51, 'women'), 'EP', '#8750F6', 'Bogotá',    '4 Años',  "$11'000.000", 'en_rango',       'prescreening'),
  _mkFin('mfin-18', 'Ramiro Suárez',     58, _p(43, 'men'),   'RS', '#27BE69', 'Medellín',  '5 Años',  "$12'000.000", 'en_rango',       'prescreening'),
  _mkFin('mfin-19', 'Germán Sánchez',    56, _p(44, 'men'),   'GS', '#295BFF', 'Bogotá',    '4 Años',  "$11'500.000", 'en_rango',       'prescreening'),
  _mkFin('mfin-20', 'Gloria Villamizar', 54, _p(52, 'women'), 'GV', '#F6A350', 'Bucaramanga','4 Años', "$15'000.000", 'fuera_de_rango', 'prescreening'),
];
const finScoreOnly: Candidate[] = [
  _mkFin('mfin-21', 'Zulma Ríos',        52, _p(53, 'women'), 'ZR', '#8750F6', 'Cali',      '3 Años',          "$11'000.000", 'en_rango'),
  _mkFin('mfin-22', 'Juan Pablo Herrera',50, _p(45, 'men'),   'JH', '#27BE69', 'Medellín',  '4 Años',          "$12'000.000", 'en_rango'),
  _mkFin('mfin-23', 'Beatriz Torres',    48, _p(54, 'women'), 'BT', '#295BFF', 'Bogotá',    '3 Años',          "$11'500.000", 'en_rango'),
  _mkFin('mfin-24', 'Rodrigo Betancur',  46, _p(46, 'men'),   'RB', '#F6A350', 'Cali',      '4 Años',          "$14'000.000", 'fuera_de_rango'),
  _mkFin('mfin-25', 'Amparo Díaz',       44, _p(56, 'women'), 'AD', '#8750F6', 'Medellín',  '3 Años',          "$11'000.000", 'en_rango'),
  _mkFin('mfin-26', 'Iván Darío Ospina', 42, _p(48, 'men'),   'IO', '#27BE69', 'Bogotá',    '3 Años',          "$12'000.000", 'en_rango'),
  _mkFin('mfin-27', 'Luz Marina Castro', 40, _p(57, 'women'), 'LM', '#295BFF', 'Bogotá',    '2 Años',          "$11'500.000", 'en_rango'),
  _mkFin('mfin-28', 'Mario Higuera',     38, _p(49, 'men'),   'MH', '#F6A350', 'Medellín',  '2 Años',          "$13'000.000", 'fuera_de_rango'),
  _mkFin('mfin-29', 'Cristian Leal',     36, _p(50, 'men'),   'CL', '#8750F6', 'Bogotá',    '2 Años',          "$11'000.000", 'en_rango'),
  _mkFin('mfin-30', 'Emilio Bonilla',    34, _p(51, 'men'),   'EB', '#27BE69', 'Cali',      '1 Año',           "$16'000.000", 'fuera_de_rango'),
];

// ══════════════════════════════════════════════════════════════════════════════
// VACANTE 5 — GERENTE DE VENTAS | InduCom LATAM | Pipeline completo
// ══════════════════════════════════════════════════════════════════════════════
function _psychVen(score: number, name: string): PsychTestResult {
  return {
    score: score - 3,
    insight: `Perfil con alta orientación al resultado comercial y liderazgo de equipos en B2B industrial. ${name} combina visión estratégica con capacidad natural de relacionamiento a nivel directivo.`,
    fitCards: [
      { axis: 'Orientación al resultado', idealScore: 90, candidateScore: score, summary: 'Impulso constante hacia el cumplimiento y superación de metas.', detail: 'Alta resiliencia ante la presión del cumplimiento. Establece objetivos de equipo, hace seguimiento periódico y ajusta estrategia sin perder el foco en el número de ventas.' },
      { axis: 'Liderazgo comercial', idealScore: 85, candidateScore: score - 5, summary: 'Conduce y motiva equipos de ventas en entornos B2B industriales.', detail: 'Capacidad comprobada de liderar equipos comerciales, asignar territorios, desarrollar planes de carrera y mantener cohesión en periodos de baja.' },
      { axis: 'Relacionamiento estratégico', idealScore: 80, candidateScore: score - 3, summary: 'Construye relaciones sólidas y de largo plazo con clientes clave.', detail: 'Gestión de cuentas estratégicas con presencia directa en C-suite del cliente. Entiende los ciclos de compra B2B y adapta el discurso a cada interlocutor.' },
    ],
    radarPoints: [
      { label: 'Iniciativa',         value: score + 2 }, { label: 'Agente cambio',      value: score - 2 },
      { label: 'Proactividad',       value: score + 4 }, { label: 'Inteligencia Social', value: score - 5 },
      { label: 'Autonomía',          value: score + 1 }, { label: 'Agilidad',           value: score - 3 },
      { label: 'Persuasión',         value: score + 6 }, { label: 'Liderazgo',          value: score + 3 },
      { label: 'P. Analítico',       value: score - 4 }, { label: 'Resiliencia',        value: score + 5 },
    ],
    veredicto: [
      { title: 'Quién es conductualmente', body: `Perfil con alta energía comercial y orientación al resultado. Opera con sentido de urgencia, prioriza el cierre de negocio y construye relaciones de confianza con naturalidad. Su liderazgo es inspirador aunque puede necesitar estructura en la gestión de procesos y actividades.` },
      { title: 'Fit con este rol', body: `El rol requiere combinar liderazgo de equipo con relacionamiento estratégico en cuentas industriales — ejes en los que este candidato destaca. La gestión formal de KPIs y pipeline es un área a reforzar con herramientas y procesos desde el onboarding.` },
    ],
    preguntas: [
      { tag: 'Para: CEO InduCom', question: '"Cuéntame el proceso de venta más complejo que hayas liderado: ¿cuántos interlocutores tenía el cliente, cómo gestionaste las objeciones y en cuánto tiempo cerraste?"', validates: 'Liderazgo comercial y cuentas estratégicas' },
      { tag: 'Para: RRHH', question: '"¿Cómo motivas a un asesor comercial que lleva dos meses sin cumplir su meta? ¿Cuál es tu enfoque de acompañamiento versus exigencia?"', validates: 'Liderazgo de equipos y cultura comercial' },
    ],
  };
}
function _mkVen(id: string, name: string, score: number, photo: string, initials: string, color: string, city: string, years: string, aspiration: string, salaryRange: SalaryRange, stage: 'scoring'|'prescreening'|'entrevistas'|'evaluaciones' = 'scoring'): Candidate {
  const hi = score >= 78; const md = score >= 60;
  const pre: Candidate['prescreeningAI'] = stage !== 'scoring' ? {
    score: score + 1, status: 'continua',
    resumen: hi
      ? `${name} demuestra trayectoria comercial sólida en B2B industrial. Liderazgo de equipos, gestión de cuentas clave y cumplimiento documentado de metas se alinean con el perfil de InduCom LATAM.`
      : `${name} tiene experiencia comercial con orientación al resultado pero menor trayectoria en B2B industrial y liderazgo formal de equipos grandes.`,
    noNegociables: [
      { label: 'Profesional con especialización en Ventas, Mercadeo o Administración', score: hi ? score - 2 : score - 8, evidencia: hi ? 'Administrador con especialización en Gerencia Comercial — CESA.' : 'Profesional sin especialización completa en el área comercial.' } as any,
      { label: 'Experiencia +7 años liderando equipos comerciales B2B', score: hi ? score - 5 : score - 11, evidencia: hi ? 'Gerente de Zona por 9 años en empresa de distribución industrial, equipo de 12 asesores.' : 'Asesor Comercial Senior por 6 años sin cargo de gerencia formal.' } as any,
      { label: 'Historial documentado de cumplimiento de cuotas 100%+ sostenido', score: hi ? score - 3 : score - 9, evidencia: hi ? 'Cumplimiento de meta 108% promedio en los últimos 3 años — datos verificables.' : 'Cumplimiento variable; sin métricas documentadas consistentes.' } as any,
      { label: 'Dominio de CRM (Salesforce, HubSpot o equivalente)', score: hi ? score - 4 : score - 10, evidencia: hi ? 'Usuario avanzado de Salesforce. Configuró pipelines para equipo de 12 asesores.' : 'Manejo básico de CRM; usa principalmente Excel para seguimiento.' } as any,
    ],
    plusDetectados: hi
      ? ['Red de contactos en sector distribución e industrial en Colombia', 'Experiencia en apertura de nuevos mercados B2B y captación de cuentas estratégicas', 'Manejo de presupuestos comerciales y proyección mensual/trimestral de ventas']
      : ['Orientación natural al resultado y alta tolerancia al rechazo comercial', 'Experiencia básica en coordinación de equipos pequeños de ventas'],
    senales: hi
      ? ['Confirmar historial de cumplimiento con documentación verificable de empleador anterior', 'Validar experiencia en distribución industrial o manufactura específicamente']
      : ['Escasa experiencia en liderazgo formal de equipos comerciales de más de 5 personas', 'Validar métricas reales de cumplimiento vs. estimadas por el candidato'],
  } : undefined;
  const psych = stage === 'evaluaciones' ? _psychVen(score, name) : undefined;
  return {
    id, name, role: 'Gerente de Ventas', sector: 'Distribución Industrial / Comercial',
    years, location: `${city}, Colombia`,
    bio: `Gerente de Ventas con experiencia en liderazgo comercial B2B para distribución industrial. Gestión de equipos, cuentas clave, KPIs y cumplimiento de metas en mercados de manufactura.`,
    score, photo, avatarInitials: initials, avatarColor: color,
    hasCurrentJob: score > 60,
    ...(() => { const j = _venJobs[parseInt(id.split('-')[1])-1] ?? _venJobs[0]; return score > 60 ? { currentCompany: j.c, currentRole: j.r } : { lastCompany: j.c, lastRole: j.r, lastDate: j.d }; })(),
    superpoder: '"Cierre de negocio y construcción de relaciones estratégicas duraderas"',
    aspiration, budget: "$15'000.000", salaryRange, currentStage: stage,
    scoringAI: {
      score: Math.round(score * 0.94), status: score >= 58 ? 'continua' : 'pendiente',
      resumen: hi
        ? `${name} presenta perfil comercial sólido con experiencia en liderazgo de equipos B2B y cumplimiento consistente de metas en distribución industrial.`
        : md
        ? `${name} tiene experiencia comercial con resultados razonables pero con menor profundidad en liderazgo formal y entornos B2B industriales de escala.`
        : `${name} presenta perfil insuficiente para el nivel gerencial requerido. Trayectoria y resultados por debajo del umbral mínimo.`,
      noNegociables: [
        { label: 'Especialización en Gerencia Comercial o área afín', cumple: hi },
        { label: 'Experiencia +7 años en gerencia comercial B2B industrial', cumple: score >= 72 },
        { label: 'Historial documentado de cumplimiento de cuotas 100%+', cumple: score >= 66 },
        { label: 'Dominio de CRM y herramientas de seguimiento comercial', cumple: md },
      ],
      logros: hi
        ? ['Creció el territorio comercial en 35% en 2 años: de 18 a 27 cuentas activas', 'Lideró equipo de 15 asesores alcanzando 112% de meta anual', 'Implantó metodología SPIN Selling reduciendo ciclo de venta de 60 a 42 días']
        : md
        ? ['Cumplió meta comercial individual durante 4 años consecutivos', 'Apoyó gestión de cuentas clave en empresa de distribución regional']
        : ['Sin historial documentado de resultados comerciales ni liderazgo de equipo a escala'],
      senales: hi
        ? ['Confirmar estabilidad laboral y razones de cambio del cargo actual']
        : md
        ? ['Validar experiencia real en liderazgo de equipo vs. coordinación informal', 'Confirmar métricas de cumplimiento con documentación del empleador']
        : ['Perfil muy por debajo del nivel gerencial requerido', 'Sin evidencia de liderazgo ni resultados comerciales a escala'],
    },
    ...(pre ? { prescreeningAI: pre } : {}),
    ...(psych ? { psychTest: psych } : {}),
  };
}
const venFinalistCandidates: Candidate[] = [
  _mkVen('mv-1', 'Andrés Ramírez',      95, _p(51, 'men'),   'AR', '#8750F6', 'Bogotá',   '12 Años', "$14'000.000", 'en_rango',       'evaluaciones'),
  _mkVen('mv-2', 'Mónica Sandoval',     93, _p(58, 'women'), 'MS', '#27BE69', 'Medellín', '10 Años', "$14'500.000", 'en_rango',       'evaluaciones'),
  _mkVen('mv-3', 'Carlos Pérez',        91, _p(52, 'men'),   'CP', '#295BFF', 'Cali',     '11 Años', "$13'500.000", 'en_rango',       'evaluaciones'),
];
const venEvalCandidates: Candidate[] = [
  _mkVen('mv-4',  'David Mejía',        89, _p(53, 'men'),   'DM', '#F6A350', 'Bogotá',   '9 Años',  "$15'000.000", 'en_rango',       'evaluaciones'),
  _mkVen('mv-5',  'Tatiana Cuadros',    87, _p(59, 'women'), 'TC', '#8750F6', 'Medellín', '8 Años',  "$14'000.000", 'en_rango',       'evaluaciones'),
  _mkVen('mv-6',  'Jorge Valderrama',   85, _p(54, 'men'),   'JV', '#27BE69', 'Bogotá',   '10 Años', "$16'000.000", 'fuera_de_rango', 'evaluaciones'),
  _mkVen('mv-7',  'Vanessa Granados',   84, _p(60, 'women'), 'VG', '#295BFF', 'Cali',     '7 Años',  "$14'500.000", 'en_rango',       'evaluaciones'),
  _mkVen('mv-8',  'Ricardo Salinas',    83, _p(55, 'men'),   'RS', '#F6A350', 'Bogotá',   '9 Años',  "$15'000.000", 'en_rango',       'evaluaciones'),
  _mkVen('mv-9',  'Camilo Torres',      82, _p(56, 'men'),   'CT', '#8750F6', 'Medellín', '8 Años',  "$15'500.000", 'fuera_de_rango', 'evaluaciones'),
  _mkVen('mv-10', 'Luisa Mora',         81, _p(61, 'women'), 'LM', '#27BE69', 'Bogotá',   '7 Años',  "$14'000.000", 'en_rango',       'evaluaciones'),
];
const venEntrevistasCandidates: Candidate[] = [
  _mkVen('mv-11', 'Felipe Herrera',     80, _p(57, 'men'),   'FH', '#295BFF', 'Cali',     '8 Años',  "$14'500.000", 'en_rango',       'entrevistas'),
  _mkVen('mv-12', 'Diana Zapata',       79, _p(62, 'women'), 'DZ', '#F6A350', 'Bogotá',   '7 Años',  "$15'000.000", 'en_rango',       'entrevistas'),
  _mkVen('mv-13', 'Sebastián Pardo',    78, _p(58, 'men'),   'SP', '#8750F6', 'Medellín', '8 Años',  "$16'000.000", 'fuera_de_rango', 'entrevistas'),
  _mkVen('mv-14', 'Claudia Rincón',     77, _p(63, 'women'), 'CR', '#27BE69', 'Bogotá',   '6 Años',  "$14'000.000", 'en_rango',       'entrevistas'),
  _mkVen('mv-15', 'Julián Mosquera',    76, _p(59, 'men'),   'JM', '#295BFF', 'Cali',     '7 Años',  "$14'500.000", 'en_rango',       'entrevistas'),
  _mkVen('mv-16', 'Andrea Cano',        75, _p(64, 'women'), 'AC', '#F6A350', 'Bogotá',   '6 Años',  "$15'000.000", 'en_rango',       'entrevistas'),
  _mkVen('mv-17', 'Eduardo Bermúdez',   74, _p(60, 'men'),   'EB', '#8750F6', 'Medellín', '6 Años',  "$17'000.000", 'fuera_de_rango', 'entrevistas'),
  _mkVen('mv-18', 'Marcela Agudelo',    73, _p(65, 'women'), 'MA', '#27BE69', 'Bogotá',   '6 Años',  "$14'000.000", 'en_rango',       'entrevistas'),
  _mkVen('mv-19', 'Leonardo Pedraza',   72, _p(61, 'men'),   'LP', '#295BFF', 'Cali',     '7 Años',  "$15'000.000", 'en_rango',       'entrevistas'),
  _mkVen('mv-20', 'Natalia Franco',     71, _p(66, 'women'), 'NF', '#F6A350', 'Medellín', '5 Años',  "$14'500.000", 'en_rango',       'entrevistas'),
  _mkVen('mv-21', 'Gustavo Lozano',     70, _p(63, 'men'),   'GL', '#8750F6', 'Bogotá',   '7 Años',  "$16'000.000", 'fuera_de_rango', 'entrevistas'),
  _mkVen('mv-22', 'Paola Giraldo',      69, _p(67, 'women'), 'PG', '#27BE69', 'Bogotá',   '5 Años',  "$14'000.000", 'en_rango',       'entrevistas'),
  _mkVen('mv-23', 'Camilo Vargas',      68, _p(64, 'men'),   'CV', '#295BFF', 'Medellín', '6 Años',  "$15'000.000", 'en_rango',       'entrevistas'),
  _mkVen('mv-24', 'Yolanda Restrepo',   67, _p(68, 'women'), 'YR', '#F6A350', 'Cali',     '5 Años',  "$14'500.000", 'en_rango',       'entrevistas'),
  _mkVen('mv-25', 'Rodrigo Silva',      66, _p(65, 'men'),   'RS', '#8750F6', 'Bogotá',   '6 Años',  "$16'500.000", 'fuera_de_rango', 'entrevistas'),
];
const venPreCandidates: Candidate[] = [
  _mkVen('mv-26', 'Ana Lucía Bermúdez', 65, _p(69, 'women'), 'AB', '#27BE69', 'Medellín', '5 Años',  "$14'000.000", 'en_rango',       'prescreening'),
  _mkVen('mv-27', 'Hernando Ríos',      63, _p(66, 'men'),   'HR', '#295BFF', 'Bogotá',   '5 Años',  "$15'000.000", 'en_rango',       'prescreening'),
  _mkVen('mv-28', 'Melissa Cárdenas',   61, _p(70, 'women'), 'MC', '#F6A350', 'Cali',     '4 Años',  "$15'500.000", 'fuera_de_rango', 'prescreening'),
  _mkVen('mv-29', 'Mario Castaño',      59, _p(67, 'men'),   'MC', '#8750F6', 'Medellín', '5 Años',  "$14'000.000", 'en_rango',       'prescreening'),
  _mkVen('mv-30', 'Sandra Pinzón',      57, _p(71, 'women'), 'SP', '#27BE69', 'Bogotá',   '4 Años',  "$14'500.000", 'en_rango',       'prescreening'),
];
const venScoreOnly: Candidate[] = [
  _mkVen('mv-31', 'Mauricio Forero',    55, _p(68, 'men'),   'MF', '#295BFF', 'Cali',     '4 Años',          "$15'000.000", 'en_rango'),
  _mkVen('mv-32', 'Liliana Baquero',    53, _p(72, 'women'), 'LB', '#F6A350', 'Bogotá',   '4 Años',          "$16'000.000", 'fuera_de_rango'),
  _mkVen('mv-33', 'Carlos Duarte',      52, _p(69, 'men'),   'CD', '#8750F6', 'Medellín', '4 Años',          "$14'000.000", 'en_rango'),
  _mkVen('mv-34', 'Fernanda Acosta',    51, _p(73, 'women'), 'FA', '#27BE69', 'Cali',     '3 Años',          "$15'000.000", 'en_rango'),
  _mkVen('mv-35', 'David Escobar',      50, _p(70, 'men'),   'DE', '#295BFF', 'Bogotá',   '4 Años',          "$14'500.000", 'en_rango'),
  _mkVen('mv-36', 'Patricia Ocampo',    49, _p(74, 'women'), 'PO', '#F6A350', 'Medellín', '3 Años',          "$14'000.000", 'en_rango'),
  _mkVen('mv-37', 'Javier Palomino',    48, _p(71, 'men'),   'JP', '#8750F6', 'Bogotá',   '3 Años',          "$16'000.000", 'fuera_de_rango'),
  _mkVen('mv-38', 'Gloria Orozco',      47, _p(75, 'women'), 'GO', '#27BE69', 'Cali',     '3 Años',          "$15'000.000", 'en_rango'),
  _mkVen('mv-39', 'Arturo Suárez',      46, _p(72, 'men'),   'AS', '#295BFF', 'Bogotá',   '3 Años',          "$14'500.000", 'en_rango'),
  _mkVen('mv-40', 'Laura Henao',        45, _p(76, 'women'), 'LH', '#F6A350', 'Medellín', '3 Años',          "$15'500.000", 'fuera_de_rango'),
  _mkVen('mv-41', 'Emilio Castro',      44, _p(73, 'men'),   'EC', '#8750F6', 'Bogotá',   '2 Años',          "$14'000.000", 'en_rango'),
  _mkVen('mv-42', 'Isabel Carvajal',    43, _p(77, 'women'), 'IC', '#27BE69', 'Cali',     '2 Años',          "$15'000.000", 'en_rango'),
  _mkVen('mv-43', 'Pedro Hurtado',      42, _p(74, 'men'),   'PH', '#295BFF', 'Medellín', '2 Años',          "$14'500.000", 'en_rango'),
  _mkVen('mv-44', 'Viviana Parra',      41, _p(79, 'women'), 'VP', '#F6A350', 'Bogotá',   '2 Años',          "$16'000.000", 'fuera_de_rango'),
  _mkVen('mv-45', 'Rodrigo Navarrete',  40, _p(75, 'men'),   'RN', '#8750F6', 'Cali',     '2 Años',          "$14'000.000", 'en_rango'),
  _mkVen('mv-46', 'Diana Moncayo',      39, _p(80, 'women'), 'DM', '#27BE69', 'Bogotá',   '2 Años',          "$15'000.000", 'en_rango'),
  _mkVen('mv-47', 'Bernardo Ospina',    38, _p(76, 'men'),   'BO', '#295BFF', 'Medellín', '1 Año',           "$14'500.000", 'en_rango'),
  _mkVen('mv-48', 'Stefanía Morales',   37, _p(81, 'women'), 'SM', '#F6A350', 'Bogotá',   '1 Año',           "$17'000.000", 'fuera_de_rango'),
  _mkVen('mv-49', 'Gonzalo Patiño',     36, _p(77, 'men'),   'GP', '#8750F6', 'Cali',     '1 Año',           "$14'000.000", 'en_rango'),
  _mkVen('mv-50', 'Ana Paola Durán',    35, _p(82, 'women'), 'AD', '#F65078', 'Medellín', 'Sin experiencia', "$15'000.000", 'en_rango'),
];

// ══════════════════════════════════════════════════════════════════════════════
// EXPORTS ACTUALIZADOS
// ══════════════════════════════════════════════════════════════════════════════

import {
  COMFANDI_VACANTES,
  COMFANDI_DESCRIPTIONS,
  getComfandiPipelineStages,
  COMFANDI_CANDIDATES_BY_STAGE,
  COMFANDI_ALL_CANDIDATES,
  gcaEval, gcvEval, cbEval,
} from './mock-comfandi';

// ══════════════════════════════════════════════════════════════════════════════
// VACANTE DEMO RESTAURANTES — MESERO / POLIFUNCIONAL
// ══════════════════════════════════════════════════════════════════════════════

const _vigiaRunt: { cc: string; cats: { c: string; e: string; v: string }[] }[] = [
  { cc: '79582341',   cats: [{ c:'C2', e:'10/08/2022', v:'10/08/2025' }, { c:'A2', e:'14/02/2010', v:'14/02/2028' }, { c:'B2', e:'10/08/2022', v:'10/08/2032' }] },
  { cc: '19478256',   cats: [{ c:'C2', e:'05/11/2023', v:'05/11/2026' }, { c:'A2', e:'18/06/2011', v:'18/06/2025' }, { c:'B2', e:'05/11/2023', v:'05/11/2033' }] },
  { cc: '80341972',   cats: [{ c:'C2', e:'22/04/2023', v:'22/04/2026' }, { c:'B2', e:'22/04/2023', v:'22/04/2033' }] },
  { cc: '1020774521', cats: [{ c:'C2', e:'17/01/2024', v:'17/01/2027' }, { c:'A2', e:'09/09/2014', v:'09/09/2028' }, { c:'B2', e:'17/01/2024', v:'17/01/2034' }] },
  { cc: '79918834',   cats: [{ c:'C2', e:'03/07/2023', v:'03/07/2026' }, { c:'B1', e:'03/07/2023', v:'03/07/2033' }] },
  { cc: '80275634',   cats: [{ c:'C2', e:'28/09/2023', v:'28/09/2026' }, { c:'B2', e:'28/09/2023', v:'28/09/2033' }] },
  { cc: '1072671845', cats: [{ c:'C2', e:'14/05/2024', v:'14/05/2027' }, { c:'A2', e:'20/03/2018', v:'20/03/2026' }] },
  { cc: '1015421837', cats: [{ c:'C2', e:'06/02/2024', v:'06/02/2027' }] },
  { cc: '52847293',   cats: [{ c:'C2', e:'11/10/2023', v:'11/10/2026' }, { c:'B1', e:'11/10/2023', v:'11/10/2033' }] },
  { cc: '79648392',   cats: [{ c:'C2', e:'25/03/2024', v:'25/03/2027' }] },
  { cc: '1014238945', cats: [{ c:'C2', e:'08/08/2024', v:'08/08/2027' }] },
  { cc: '1014876523', cats: [{ c:'C2', e:'01/02/2024', v:'01/02/2027' }] },
  { cc: '63423876',   cats: [{ c:'C2', e:'17/06/2023', v:'17/06/2026' }] },
  { cc: '80193847',   cats: [{ c:'C2', e:'30/11/2023', v:'30/11/2026' }] },
  { cc: '72485938',   cats: [{ c:'C2', e:'15/04/2025', v:'15/04/2028' }] },
];

const _vigiaJobs = [
  { c: 'Andrés Carne de Res',          r: 'Mesero',                      d: '01/2025' },
  { c: 'Crepes & Waffles',             r: 'Mesero Polifuncional',        d: '11/2024' },
  { c: 'El Corral',                    r: 'Cajero / Mesero',             d: '03/2025' },
  { c: 'Hamburguesas El Corral',       r: 'Mesero',                      d: '12/2024' },
  { c: 'Wok Restaurant',               r: 'Mesero',                      d: '02/2025' },
  { c: 'Restaurante Harry Sasson',     r: 'Mesero de Piso',              d: '01/2025' },
  { c: 'Sipote Burrito',               r: 'Mesero / Cajero',             d: '04/2024' },
  { c: 'OMA Café',                     r: 'Barista / Mesero',            d: '10/2024' },
  { c: 'Juan Valdez Café',             r: 'Barista',                     d: '06/2024' },
  { c: 'Archie\'s Pizza',              r: 'Mesero',                      d: '09/2024' },
  { c: 'La Brasa Roja',                r: 'Mesero',                      d: '03/2024' },
  { c: 'Frisby S.A.',                  r: 'Auxiliar de Servicio',        d: '07/2024' },
  { c: 'McDonald\'s Colombia',         r: 'Crew Member',                 d: '05/2024' },
  { c: 'Subway Colombia',              r: 'Sandwich Artist',             d: '02/2024' },
  { c: 'KFC Colombia',                 r: 'Auxiliar de Servicio',        d: '08/2024' },
];

const _vigiaExpPrev: { c: string; r: string; periodo: string; desc: string }[] = [
  { c: 'Crepes & Waffles',             r: 'Mesero de Piso',             periodo: '2020 – 2022', desc: 'Atención en mesa, toma de pedidos y manejo de POS. Trabajo en equipo en temporadas de alta demanda. Reconocido por servicio al cliente sobresaliente.' },
  { c: 'El Corral',                    r: 'Mesero / Cajero',            periodo: '2019 – 2021', desc: 'Atención en mesa y caja, manejo de domicilios en plataformas Rappi y Domicilios.com. Cumplimiento de estándares de calidad de cadena.' },
  { c: 'Wok Restaurant',               r: 'Mesero',                     periodo: '2018 – 2020', desc: 'Servicio en mesa en restaurante de alta rotación. Conocimiento de carta y manejo de intolerancias alimentarias. Trabajo en turno barra y piso.' },
  { c: 'Juan Valdez Café',             r: 'Barista / Mesero',           periodo: '2021 – 2023', desc: 'Preparación de bebidas calientes y frías, atención en barra y caja. Capacitación en técnicas de café de especialidad.' },
  { c: 'Hamburguesas El Corral',       r: 'Auxiliar Polifuncional',     periodo: '2020 – 2022', desc: 'Rotación entre caja, barra y servicio en mesa. Apoyo en apertura y cierre de punto. Manejo de volumen alto durante fines de semana.' },
  { c: 'Restaurante Harry Sasson',     r: 'Mesero de Piso',             periodo: '2022 – 2024', desc: 'Servicio de mesa en restaurante fine dining. Protocolo de servicio, manejo de carta de vinos y atención a clientes VIP.' },
  { c: 'Sipote Burrito',               r: 'Cajero / Mesero',            periodo: '2019 – 2021', desc: 'Atención en barra, manejo de POS, preparación de domicilios y cierre de caja. Alta rotación de clientes.' },
  { c: 'OMA Café',                     r: 'Barista',                    periodo: '2021 – 2023', desc: 'Preparación de bebidas, manejo de caja y servicio al cliente. Participación en auditorías de calidad de la cadena.' },
  { c: 'Andrés Carne de Res',          r: 'Mesero',                     periodo: '2018 – 2020', desc: 'Servicio en mesas de alta rotación y eventos. Conocimiento profundo de la carta. Trabajo en equipo con brigada grande.' },
  { c: 'Archie\'s Pizza',              r: 'Mesero',                     periodo: '2020 – 2022', desc: 'Atención en mesa, gestión de domicilios y apoyo en caja. Turnos rotativos lunes a domingo.' },
  { c: 'La Brasa Roja',                r: 'Mesero',                     periodo: '2019 – 2021', desc: 'Atención en mesa y entrega de domicilios en puntos de cadena. Manejo de POS y cierre de caja.' },
  { c: 'Frisby S.A.',                  r: 'Auxiliar de Servicio',       periodo: '2018 – 2020', desc: 'Atención al cliente en mostrador y mesa. Apoyo en preparación de órdenes y mantenimiento del punto de venta.' },
  { c: 'McDonald\'s Colombia',         r: 'Crew Member',                periodo: '2017 – 2019', desc: 'Rotación entre caja, barra y servicio al cliente. Primer empleo formal en el sector gastronómico.' },
  { c: 'Subway Colombia',              r: 'Sandwich Artist',            periodo: '2017 – 2018', desc: 'Preparación de productos, atención al cliente y manejo de caja. Certificado en buenas prácticas de manufactura.' },
  { c: 'KFC Colombia',                 r: 'Auxiliar de Servicio',       periodo: '2016 – 2018', desc: 'Servicio en mostrador, preparación de pedidos y manejo de caja. Trabajo en turnos rotativos.' },
];

const _vigiaPersonal: { label: string; value: string; status: 'ok' | 'warning' | 'neutral' }[][] = [
  [{ label: 'Municipio', value: 'Medellín (El Poblado)', status: 'ok' }, { label: 'Disponibilidad de inicio', value: 'Inmediata', status: 'ok' }, { label: 'Situación laboral', value: 'Disponible — salió por fin de contrato', status: 'ok' }, { label: 'Disponibilidad horaria', value: 'Lunes a domingo turnos rotativos', status: 'ok' }, { label: 'Transporte', value: 'Metro + caminata', status: 'ok' }, { label: 'Grupo familiar', value: 'Soltero, sin hijos', status: 'neutral' }],
  [{ label: 'Municipio', value: 'Medellín (Laureles)', status: 'ok' }, { label: 'Disponibilidad de inicio', value: 'Inmediata', status: 'ok' }, { label: 'Situación laboral', value: 'Trabaja — dispuesto a cambiar', status: 'ok' }, { label: 'Disponibilidad horaria', value: 'Disponibilidad total turnos rotativos', status: 'ok' }, { label: 'Transporte', value: 'Metro + bus', status: 'ok' }, { label: 'Grupo familiar', value: 'Soltero', status: 'neutral' }],
  [{ label: 'Municipio', value: 'Medellín (Envigado)', status: 'ok' }, { label: 'Disponibilidad de inicio', value: '8 días de preaviso', status: 'ok' }, { label: 'Situación laboral', value: 'Empleado activo', status: 'ok' }, { label: 'Disponibilidad horaria', value: 'Lunes a domingo turnos rotativos', status: 'ok' }, { label: 'Transporte', value: 'Metro', status: 'ok' }, { label: 'Grupo familiar', value: 'Soltero, sin hijos', status: 'neutral' }],
  [{ label: 'Municipio', value: 'Medellín (Itagüí)', status: 'ok' }, { label: 'Disponibilidad de inicio', value: 'Inmediata', status: 'ok' }, { label: 'Situación laboral', value: 'Disponible — empresa cerró operaciones', status: 'ok' }, { label: 'Disponibilidad horaria', value: 'Disponibilidad total', status: 'ok' }, { label: 'Transporte', value: 'Metro + bus', status: 'ok' }, { label: 'Grupo familiar', value: 'Unión libre, 1 hijo', status: 'neutral' }],
  [{ label: 'Municipio', value: 'Medellín (Bello)', status: 'ok' }, { label: 'Disponibilidad de inicio', value: '15 días de preaviso', status: 'ok' }, { label: 'Situación laboral', value: 'Empleado activo', status: 'ok' }, { label: 'Disponibilidad horaria', value: 'Lunes a domingo turnos rotativos', status: 'ok' }, { label: 'Transporte', value: 'Metro', status: 'ok' }, { label: 'Grupo familiar', value: 'Soltero', status: 'neutral' }],
  [{ label: 'Municipio', value: 'Medellín (El Centro)', status: 'ok' }, { label: 'Disponibilidad de inicio', value: 'Inmediata', status: 'ok' }, { label: 'Situación laboral', value: 'Disponible — contrato temporal vencido', status: 'ok' }, { label: 'Disponibilidad horaria', value: 'Disponibilidad total turnos rotativos', status: 'ok' }, { label: 'Transporte', value: 'Metro + caminata', status: 'ok' }, { label: 'Grupo familiar', value: 'Soltero', status: 'neutral' }],
  [{ label: 'Municipio', value: 'Medellín (Sabaneta)', status: 'ok' }, { label: 'Disponibilidad de inicio', value: '8 días de preaviso', status: 'ok' }, { label: 'Situación laboral', value: 'Empleado activo', status: 'ok' }, { label: 'Disponibilidad horaria', value: 'Lunes a domingo turnos rotativos', status: 'ok' }, { label: 'Transporte', value: 'Metro', status: 'ok' }, { label: 'Grupo familiar', value: 'Casado, 2 hijos', status: 'neutral' }],
  [{ label: 'Municipio', value: 'Medellín (Robledo)', status: 'ok' }, { label: 'Disponibilidad de inicio', value: 'Inmediata', status: 'ok' }, { label: 'Situación laboral', value: 'Disponible', status: 'ok' }, { label: 'Disponibilidad horaria', value: 'Lunes a domingo turnos rotativos', status: 'ok' }, { label: 'Transporte', value: 'Bus', status: 'neutral' }, { label: 'Grupo familiar', value: 'Soltero', status: 'neutral' }],
  [{ label: 'Municipio', value: 'Medellín (Belén)', status: 'ok' }, { label: 'Disponibilidad de inicio', value: '15 días de preaviso', status: 'warning' }, { label: 'Situación laboral', value: 'Empleado activo', status: 'neutral' }, { label: 'Disponibilidad horaria', value: 'Lunes a domingo, necesita confirmar horarios nocturnos', status: 'warning' }, { label: 'Transporte', value: 'Bus + caminata', status: 'ok' }, { label: 'Grupo familiar', value: 'Casado, 2 hijos', status: 'neutral' }],
  [{ label: 'Municipio', value: 'Medellín (La América)', status: 'ok' }, { label: 'Disponibilidad de inicio', value: 'Inmediata', status: 'ok' }, { label: 'Situación laboral', value: 'Disponible', status: 'ok' }, { label: 'Disponibilidad horaria', value: 'Disponibilidad total turnos rotativos', status: 'ok' }, { label: 'Transporte', value: 'Metro', status: 'ok' }, { label: 'Grupo familiar', value: 'Soltero, sin hijos', status: 'neutral' }],
];

const _vigiaTestSlots = [
  { fecha: 'Sáb 21 Jun 2026', hora: '08:00 AM', lugar: 'Demo Restaurantes — Sede El Poblado, Medellín' },
  { fecha: 'Sáb 21 Jun 2026', hora: '09:30 AM', lugar: 'Demo Restaurantes — Sede El Poblado, Medellín' },
  { fecha: 'Dom 22 Jun 2026', hora: '08:00 AM', lugar: 'Demo Restaurantes — Sede Laureles, Medellín' },
];

function _mkVigia(id: string, name: string, score: number, photo: string, initials: string, color: string, city: string, years: string, aspiration: string, salaryRange: SalaryRange, stage: 'scoring' | 'prescreening' | 'entrevistas' = 'scoring', extras?: Partial<Candidate>): Candidate {
  const hi = score >= 75; const md = score >= 58;
  const idx = parseInt(id.split('-')[1]) - 1;
  const job = _vigiaJobs[idx % _vigiaJobs.length] ?? _vigiaJobs[0];
  const prevJob = _vigiaExpPrev[idx % _vigiaExpPrev.length] ?? _vigiaExpPrev[0];
  const expMonths = hi ? Math.round(18 + (score - 75) * 2) : md ? Math.round(8 + (score - 58) * 0.5) : Math.round(2 + score * 0.1);
  const wrongCity = city === 'Bucaramanga' || city === 'Barranquilla' || city === 'Cúcuta';
  const personal = idx < _vigiaPersonal.length ? _vigiaPersonal[idx] : _vigiaPersonal[0];
  const hasPrescreeningStageVigia = stage === 'prescreening' || stage === 'entrevistas';
  const pre: Candidate['prescreeningAI'] = hasPrescreeningStageVigia ? {
    score: Math.round(score * 0.97),
    status: hi ? 'continua' : md ? 'continua' : 'pendiente',
    resumen: hi
      ? `${name} confirmó disponibilidad inmediata para turnos rotativos lunes a domingo. Durante la conversación demostró actitud de servicio, experiencia en atención al cliente y conocimiento de operación en restaurante de cadena. Sin inconsistencias en su hoja de vida.`
      : md
      ? `${name} confirmó interés en la posición y disponibilidad de inicio en el corto plazo. Su experiencia en servicio al cliente es consistente, aunque con menor profundidad en restaurante de cadena específicamente. Requiere validación en entrevista.`
      : `${name} mostró interés básico pero presentó inconsistencias en las fechas de experiencia declaradas. La disponibilidad para turnos rotativos lunes a domingo no fue confirmada de forma clara.`,
    noNegociables: [
      { label: 'Mín. 6 meses de experiencia certificada en servicio al cliente', score: hi ? score - 2 : md ? score - 8 : score - 18, evidencia: hi ? `Confirmó experiencia certificable en ${job.c}. Describió con precisión sus funciones de atención al cliente y manejo de POS.` : md ? `Menciona experiencia en servicio al cliente pero sin certificación o empleador con NIT verificable.` : `No acreditó experiencia suficiente en servicio al cliente durante la conversación.` } as EvalRow,
      { label: 'Disponibilidad completa para turnos rotativos (lunes a domingo)', score: hi ? score - 1 : md ? score - 5 : score - 20, evidencia: hi ? `Confirma disponibilidad total para esquema rotativo L–D. Ha trabajado bajo este esquema en empleadores anteriores.` : md ? `Acepta el esquema rotativo con la condición de que los descansos sean acordados desde el inicio.` : `Manifestó dudas sobre disponibilidad en fin de semana. Requiere validar.` } as EvalRow,
      { label: 'Edad máx. 33–34 años', score: hi ? score - 3 : md ? score - 9 : score - 15, evidencia: hi ? `Edad confirmada dentro del rango requerido por el cargo.` : md ? `Edad dentro del rango, cercana al límite superior. No representa riesgo.` : `Edad fuera del rango requerido — revisar política del cargo.` } as EvalRow,
      { label: 'Experiencia en restaurante de cadena (deseable)', score: hi ? score : md ? score - 4 : score - 12, evidencia: hi ? `Cuenta con experiencia directa en restaurante de cadena: ${job.c}. Familiarizado con estándares de calidad, protocolos y manejo de POS de cadena.` : md ? `Experiencia en establecimientos de food service, aunque no necesariamente cadena certificada.` : `Sin experiencia en restaurante de cadena documentada.` } as EvalRow,
    ],
    plusDetectados: hi
      ? [`Experiencia en múltiples áreas del restaurante: barra, caja, servicio en mesa y domicilios`, `Conocimiento de plataformas de domicilios (Rappi, iFood, Domicilios.com)`, `Actitud proactiva — propuso preguntas sobre el plan de carrera y beneficios`]
      : md
      ? [`Disposición para recibir capacitación adicional en estándares de la cadena`, `Puntualidad evidenciada — llegó antes del tiempo acordado a la pre-entrevista`]
      : [`Disposición para empezar en el corto plazo si se resuelven las dudas sobre el esquema`],
    senales: hi
      ? [`Confirmar si tiene manejo de POS específico de la cadena — se puede capacitar en inducción`]
      : md
      ? [`Validar fechas de experiencia con empleadores — hay un período de 3 meses sin actividad reportada`, `Reconfirmar disponibilidad turnos rotativos en la entrevista presencial`]
      : [`Inconsistencia de fechas entre lo declarado en la llamada y la hoja de vida`, `Confirmar disponibilidad real para turnos de fin de semana antes de avanzar`],
    entornoPersonal: personal,
    experienciaLaboral: [
      { empresa: job.c, rol: job.r, periodo: hi ? `2023 – Presente` : md ? `2024 – ${job.d.replace('/','/20').slice(0, 7)}` : `2023 – ${job.d}`, descripcion: hi ? `Servicio al cliente en restaurante de cadena. Manejo de caja, barra y atención en mesa. ${expMonths} meses de experiencia certificable con NIT. Sin novedades disciplinarias.` : md ? `Atención al cliente y manejo de caja en establecimiento de food service. Experiencia básica en estándares de servicio.` : `Atención al cliente básica. Experiencia inicial en el sector gastronómico.` },
      { empresa: prevJob.c, rol: prevJob.r, periodo: prevJob.periodo, descripcion: prevJob.desc },
    ],
  } : undefined;
  return {
    id, name, role: 'Mesero / Polifuncional', sector: 'Gastronomía / Restaurantes',
    years, location: `${city}, Colombia`,
    bio: 'Candidato con experiencia en servicio al cliente y operación en restaurante. Manejo de barra, caja, atención en mesa y domicilios. Disponibilidad para turnos rotativos lunes a domingo.',
    score, photo, avatarInitials: initials, avatarColor: color,
    hasCurrentJob: score >= 68,
    ...(score >= 68
      ? { currentCompany: job.c, currentRole: job.r }
      : { lastCompany: job.c, lastRole: job.r, lastDate: job.d }),
    superpoder: hi
      ? '"Actitud de servicio excepcional y manejo polifuncional de operación de restaurante"'
      : md
      ? '"Orientación al cliente y disponibilidad para aprender estándares de la cadena"'
      : '"Disposición y actitud positiva para el cargo"',
    aspiration, budget: "$1'705.905", salaryRange, currentStage: stage,
    ...(pre ? { prescreeningAI: pre } : {}),
    scoringAI: {
      score: Math.round(score * 0.95),
      status: score >= 58 ? 'continua' : 'pendiente',
      resumen: hi
        ? `${name} cumple todos los criterios del perfil. Más de ${expMonths} meses de experiencia certificable en servicio al cliente, disponibilidad completa para turnos rotativos y edad dentro del rango requerido.`
        : md
        ? `${name} cumple parcialmente el perfil. Experiencia en servicio al cliente con algunas observaciones en certificación de empleadores anteriores. Requiere validación adicional.`
        : `${name} no cumple los requisitos mínimos del perfil. Se identificaron brechas en experiencia certificada o disponibilidad para turnos rotativos.`,
      noNegociables: [
        { label: 'Mín. 6 meses de experiencia certificada en servicio al cliente (con NIT)', cumple: hi || (md && score >= 65) },
        { label: 'Edad máx. 33–34 años', cumple: !wrongCity && score >= 45 },
        { label: 'Disponibilidad completa para turnos rotativos (lunes a domingo)', cumple: !wrongCity },
        { label: 'Experiencia en restaurante de cadena (deseable)', cumple: hi || (md && score >= 63) },
      ],
      logros: hi
        ? [
            `${expMonths} meses de experiencia certificable en servicio al cliente — supera el mínimo requerido`,
            `Experiencia en restaurante de cadena: ${job.c} — familiarizado con estándares de operación`,
            'Disponibilidad inmediata y sin restricciones para turnos rotativos lunes a domingo',
          ]
        : md
        ? [
            `Experiencia en servicio al cliente con ${expMonths} meses — requiere certificación formal`,
            'Disponibilidad para turnos rotativos confirmada con condiciones',
          ]
        : [
            'Experiencia en servicio al cliente por debajo del mínimo requerido de 6 meses',
          ],
      senales: hi
        ? ['Confirmar si tiene manejo de domicilios en plataformas digitales (Rappi, iFood)']
        : md
        ? [
            'Validar certificación de empleo anterior con NIT del empleador',
            score < 68 ? 'Confirmar disponibilidad real para turnos nocturnos y fines de semana' : 'Verificar experiencia específica en restaurante de cadena',
          ]
        : [
            wrongCity
              ? `Candidato residente en ${city} — fuera del área de cobertura de los puntos en Medellín`
              : 'Experiencia certificada insuficiente — no alcanza los 6 meses requeridos',
            salaryRange === 'fuera_de_rango'
              ? 'Expectativa salarial por encima del presupuesto del cargo'
              : 'Disponibilidad para turnos rotativos no confirmada claramente',
          ],
    },
    veredictoEntrevista: (['entrevistas','estudios','finalistas'] as PipelineStageKey[]).includes(stage)
      ? (score >= 78 ? 'apto' as const : score >= 62 ? 'apto_reservas' as const : 'no_apto' as const)
      : undefined,
    ...extras,
  };
}

const vigiaCandidates: Candidate[] = [
  _mkVigia('mvc-1',  'Gilberto Villamizar',      94, _p(1,  'men'), 'GV', '#8750F6', 'Medellín',     '3 Años',  "$1'705.905", 'en_rango',       'entrevistas'),
  _mkVigia('mvc-2',  'Tadeo García',             91, _p(2,  'men'), 'TG', '#27BE69', 'Medellín',     '2 Años',  "$1'705.905", 'en_rango',       'entrevistas'),
  _mkVigia('mvc-3',  'Sebastián Restrepo',       88, _p(3,  'men'), 'SR', '#295BFF', 'Medellín',     '4 Años',  "$1'800.000", 'en_rango',       'entrevistas'),
  _mkVigia('mvc-4',  'Camila Torres',            85, _p(4,  'wom'), 'CT', '#F6A350', 'Medellín',     '3 Años',  "$1'705.905", 'en_rango',       'entrevistas'),
  _mkVigia('mvc-5',  'Valeria Ospina',           82, _p(5,  'wom'), 'VO', '#8750F6', 'Medellín',     '2 Años',  "$1'705.905", 'en_rango',       'entrevistas'),
  _mkVigia('mvc-6',  'Juan Esteban Ríos',        78, _p(6,  'men'), 'JR', '#27BE69', 'Medellín',     '2 Años',  "$1'705.905", 'en_rango',       'prescreening'),
  _mkVigia('mvc-7',  'Alejandra Suárez',         75, _p(7,  'wom'), 'AS', '#295BFF', 'Medellín',     '1 Año',   "$1'705.905", 'en_rango',       'prescreening'),
  _mkVigia('mvc-8',  'Nicolás Cardona',          70, _p(8,  'men'), 'NC', '#F6A350', 'Medellín',     '2 Años',  "$1'705.905", 'en_rango',       'prescreening'),
  _mkVigia('mvc-9',  'Luisa Fernanda Gómez',     62, _p(9,  'wom'), 'LG', '#8750F6', 'Medellín',     '1 Año',   "$1'900.000", 'en_rango',       'prescreening'),
  _mkVigia('mvc-10', 'Daniel Muñoz',             57, _p(10, 'men'), 'DM', '#27BE69', 'Medellín',     '1 Año',   "$1'705.905", 'en_rango',       'prescreening'),
  _mkVigia('mvc-11', 'Sara Martínez',            84, _p(11, 'wom'), 'SM', '#295BFF', 'Medellín',     '3 Años',  "$1'705.905", 'en_rango',       'prescreening'),
  _mkVigia('mvc-12', 'Mateo Herrera',            79, _p(12, 'men'), 'MH', '#F6A350', 'Medellín',     '2 Años',  "$1'705.905", 'en_rango',       'prescreening'),
  _mkVigia('mvc-13', 'Isabella Vargas',          74, _p(13, 'wom'), 'IV', '#8750F6', 'Medellín',     '2 Años',  "$1'705.905", 'en_rango',       'prescreening'),
  _mkVigia('mvc-14', 'Andrés Felipe Pardo',      68, _p(14, 'men'), 'AP', '#27BE69', 'Medellín',     '1 Año',   "$1'705.905", 'en_rango',       'prescreening'),
  _mkVigia('mvc-15', 'Manuela Ríos',             64, _p(15, 'wom'), 'MR', '#295BFF', 'Medellín',     '1 Año',   "$1'705.905", 'en_rango',       'prescreening'),
  _mkVigia('mvc-16', 'Felipe Castro',       55, _p(1, 'men'), 'FC', '#F65078', 'Medellín',     '1 Año',   "$1'705.905", 'en_rango',       'prescreening', { prescreeningAI: { status: 'no_realizada', score: 0, resumen: '', noNegociables: [], plusDetectados: [], senales: [] } }),
  _mkVigia('mvc-17', 'Laura Jiménez',      50, _p(2, 'wom'), 'LJ', '#27BE69', 'Barranquilla', '1 Año',   "$1'705.905", 'en_rango',       'prescreening', { prescreeningAI: { status: 'no_realizada', score: 0, resumen: '', noNegociables: [], plusDetectados: [], senales: [] } }),
  _mkVigia('mvc-18', 'Diego Salcedo',      45, _p(3, 'men'), 'DS', '#F6A350', 'Medellín',     '6 Meses', "$2'200.000", 'fuera_de_rango', 'prescreening', { prescreeningAI: { status: 'no_realizada', score: 0, resumen: '', noNegociables: [], plusDetectados: [], senales: [] } }),
  _mkVigia('mvc-19', 'Paula Quintero',     40, _p(4, 'wom'), 'PQ', '#295BFF', 'Cali',         '6 Meses', "$2'000.000", 'fuera_de_rango', 'prescreening', { prescreeningAI: { status: 'no_realizada', score: 0, resumen: '', noNegociables: [], plusDetectados: [], senales: [] } }),
  _mkVigia('mvc-20', 'Tomás Castellanos',  34, _p(5, 'men'), 'TC', '#8750F6', 'Medellín',     '6 Meses', "$1'705.905", 'en_rango',       'prescreening', { prescreeningAI: { status: 'no_realizada', score: 0, resumen: '', noNegociables: [], plusDetectados: [], senales: [] } }),
  // Entrevista detailed candidates (previously prueba_manejo)
  _mkVigia('mvc-21', 'Bernardo Ocampo',         86, _p(6,  'men'), 'BO', '#27BE69', 'Medellín',     '2 Años',  "$1'705.905", 'en_rango',       'entrevistas'),
  _mkVigia('mvc-22', 'Ernesto López',           83, _p(7,  'men'), 'EL', '#F6A350', 'Medellín',     '2 Años',  "$1'705.905", 'en_rango',       'entrevistas'),
  _mkVigia('mvc-23', 'Hugo Manrique',           79, _p(8,  'men'), 'HM', '#295BFF', 'Medellín',     '1 Año',   "$1'705.905", 'en_rango',       'entrevistas'),
  _mkVigia('mvc-24', 'Ramiro Fuentes',          76, _p(9,  'men'), 'RF', '#8750F6', 'Medellín',     '1 Año',   "$1'705.905", 'en_rango',       'entrevistas'),
  _mkVigia('mvc-25', 'Álvaro Cáceres',          72, _p(10, 'men'), 'AC', '#F65078', 'Medellín',     '1 Año',   "$1'705.905", 'en_rango',       'entrevistas'),
  _mkVigia('mvc-26', 'Édgar Montoya',           68, _p(11, 'men'), 'EM', '#27BE69', 'Medellín',     '8 Meses', "$1'705.905", 'en_rango',       'entrevistas'),
  _mkVigia('mvc-27', 'Humberto Gaitán',         64, _p(12, 'men'), 'HG', '#F6A350', 'Medellín',     '8 Meses', "$1'705.905", 'en_rango',       'entrevistas'),
  _mkVigia('mvc-28', 'Iván Giraldo',            60, _p(13, 'men'), 'IG', '#295BFF', 'Medellín',     '7 Meses', "$1'705.905", 'en_rango',       'entrevistas'),
  _mkVigia('mvc-29', 'Julián Ariza',            56, _p(14, 'men'), 'JA', '#8750F6', 'Medellín',     '7 Meses', "$1'705.905", 'en_rango',       'entrevistas'),
  _mkVigia('mvc-30', 'Leandro Cifuentes',       51, _p(15, 'men'), 'LC', '#27BE69', 'Medellín',     '6 Meses', "$1'705.905", 'en_rango',       'entrevistas'),
  _mkVigia('mvc-31', 'Milton Bernal',           47, _p(1,  'men'), 'MB', '#F6A350', 'Medellín',     '6 Meses', "$1'705.905", 'en_rango',       'entrevistas'),
  _mkVigia('mvc-32', 'Néstor Figueroa',         43, _p(2,  'men'), 'NF', '#295BFF', 'Medellín',     '6 Meses', "$1'705.905", 'en_rango',       'entrevistas'),
  _mkVigia('mvc-33', 'Omar Londoño',            38, _p(3,  'men'), 'OL', '#F65078', 'Medellín',     '6 Meses', "$1'705.905", 'en_rango',       'entrevistas'),
];

const vigiaScoring       = vigiaCandidates.filter(c => c.currentStage === 'scoring');
const vigiaPrescreening  = vigiaCandidates.filter(c => c.currentStage === 'prescreening');
const vigiaEntrevistas   = vigiaCandidates.filter(c => c.currentStage === 'entrevistas');

// ══════════════════════════════════════════════════════════════════════════════
// VACANTE 2 — AUXILIAR DE COCINA (RESTAURANTES BOGOTÁ)
// ══════════════════════════════════════════════════════════════════════════════

// ── Auxiliar de Cocina — jobs & experience arrays ─────────────────────────
const _auxCocinaJobs = [
  { c: 'Crepes & Waffles',          r: 'Auxiliar de Cocina',        d: '01/2025' },
  { c: 'El Corral',                 r: 'Auxiliar de Cocina',        d: '03/2025' },
  { c: 'Frisby S.A.S.',             r: 'Auxiliar de Cocina',        d: '11/2024' },
  { c: 'Archie\'s Colombia',        r: 'Auxiliar de Cocina',        d: '12/2024' },
  { c: 'Kokoriko S.A.S.',           r: 'Auxiliar de Cocina',        d: '02/2025' },
  { c: 'Presto Colombia',           r: 'Auxiliar de Producción',    d: '01/2025' },
  { c: 'McDonald\'s Colombia',      r: 'Auxiliar de Cocina',        d: '04/2024' },
  { c: 'Subway Colombia',           r: 'Sandwich Artist',           d: '10/2024' },
  { c: 'Pizza Hut Colombia',        r: 'Auxiliar de Cocina',        d: '06/2024' },
  { c: 'Domino\'s Pizza',           r: 'Auxiliar de Producción',    d: '09/2024' },
];

const _auxCocinaExpPrev = [
  { c: 'El Corral',                 r: 'Auxiliar de Cocina',        periodo: '2021–2023', desc: 'Preparación de alimentos, mantenimiento de estándares de higiene HACCP y apoyo en línea de producción durante horas pico.' },
  { c: 'Frisby S.A.S.',             r: 'Auxiliar de Cocina',        periodo: '2020–2022', desc: 'Preparación y porcionamiento de alimentos según estándares de la cadena. Control de temperaturas y manejo de inventario de cocina.' },
  { c: 'Crepes & Waffles',          r: 'Auxiliar de Producción',    periodo: '2019–2021', desc: 'Apoyo en preparación de batidos, waffles y ensaladas. Limpieza y desinfección de estaciones de trabajo y equipos de cocina.' },
  { c: 'Kokoriko S.A.S.',           r: 'Auxiliar de Cocina',        periodo: '2021–2023', desc: 'Preparación de marinados, mise en place y apoyo en línea de producción. Cumplimiento de BPM y protocolos de inocuidad alimentaria.' },
  { c: 'McDonald\'s Colombia',      r: 'Crew Member / Cocina',      periodo: '2020–2022', desc: 'Operación de equipos de cocina: freidoras, planchas y hornos. Cumplimiento de tiempos de producción y estándares de calidad de cadena.' },
];

function _mkTranspPub(id: string, name: string, score: number, photo: string, initials: string, color: string, city: string, years: string, aspiration: string, salaryRange: SalaryRange, stage: 'scoring' | 'prescreening' | 'entrevistas' = 'scoring', extras?: Partial<Candidate>): Candidate {
  const hi = score >= 75; const md = score >= 58;
  const idx = Math.max(0, parseInt(id.split('-')[1]) - 1) || 0;
  const job = _auxCocinaJobs[idx % _auxCocinaJobs.length] ?? _auxCocinaJobs[0];
  const prevJob = _auxCocinaExpPrev[idx % _auxCocinaExpPrev.length] ?? _auxCocinaExpPrev[0];
  const expMonths = hi ? Math.round(14 + (score - 75) * 2) : md ? Math.round(6 + (score - 58) * 0.5) : Math.round(2 + score * 0.1);
  const wrongCity = city === 'Medellín' || city === 'Cali';
  const hasPrescreeningStageTP = stage === 'prescreening' || stage === 'entrevistas';
  const pre: Candidate['prescreeningAI'] = hasPrescreeningStageTP ? {
    score: Math.round(score * 0.96),
    status: hi ? 'continua' : md ? 'continua' : 'pendiente',
    resumen: hi
      ? `${name} confirmó experiencia certificable en manipulación de alimentos y operación de cocina en restaurante de cadena. Demostró conocimiento de normas de higiene HACCP, disponibilidad total para turnos rotativos y actitud proactiva. Sin inconsistencias.`
      : md
      ? `${name} confirmó experiencia en preparación de alimentos. La experiencia en cadena de restaurantes requiere validación adicional. Disponibilidad para turnos rotativos aceptada con condiciones.`
      : `${name} mostró interés básico pero presentó inconsistencias en la experiencia declarada. La disponibilidad para turnos rotativos no fue confirmada con claridad.`,
    noNegociables: [
      { label: 'Mín. 6 meses de experiencia en cocina o manipulación de alimentos', score: hi ? score - 2 : md ? score - 8 : score - 18, evidencia: hi ? `Confirmó ${expMonths} meses de experiencia certificable en cocina. Describió funciones de mise en place, manejo de equipos y limpieza de estaciones.` : md ? `Menciona experiencia en preparación de alimentos pero con menor detalle en empleador certificable.` : `No acreditó experiencia suficiente en manipulación de alimentos durante la conversación.` } as EvalRow,
      { label: 'Carné de manipulación de alimentos vigente o disposición para obtenerlo', score: hi ? score - 1 : md ? score - 5 : score - 15, evidencia: hi ? `Cuenta con carné de manipulación de alimentos vigente. Describe proceso de renovación reciente.` : md ? `No tiene carné vigente pero expresa disposición para tramitarlo antes del inicio.` : `No tiene carné y no confirmó disponibilidad para tramitarlo.` } as EvalRow,
      { label: 'Disponibilidad completa para turnos rotativos (lunes a domingo)', score: hi ? score - 1 : md ? score - 5 : score - 20, evidencia: hi ? `Confirma disponibilidad total para esquema rotativo L–D. Ha trabajado bajo este esquema en empleadores anteriores.` : md ? `Acepta esquema rotativo con condición de que los días de descanso sean acordados con anticipación.` : `Manifestó dudas sobre disponibilidad en fines de semana. Requiere validar.` } as EvalRow,
      { label: 'Conocimiento básico de BPM e higiene de cocina', score: hi ? score : md ? score - 4 : score - 12, evidencia: hi ? `Describió correctamente procedimientos de limpieza, rotación PEPS y control de temperaturas. Familiarizado con protocolos de inocuidad de cadena.` : md ? `Conocimiento básico de higiene de cocina. Sin formación formal certificada en BPM.` : `Sin conocimiento evidenciado de normas BPM ni protocolos de inocuidad.` } as EvalRow,
    ],
    plusDetectados: hi
      ? [`Experiencia en múltiples estaciones de cocina: preparación fría, caliente y mise en place`, `Conocimiento de control de inventario y rotación de insumos`, `Actitud colaborativa y disposición para trabajar bajo presión en horas pico`]
      : md
      ? [`Disposición para recibir capacitación en estándares de la cadena`, `Puntualidad evidenciada — llegó antes del tiempo acordado a la pre-entrevista`]
      : [`Disposición para empezar en el corto plazo si se resuelven las dudas sobre el esquema de turnos`],
    senales: hi
      ? [`Confirmar si tiene manejo de equipos específicos del punto (freidora industrial, plancha, horno de convección)`]
      : md
      ? [`Validar fechas de experiencia con empleadores — revisar período sin actividad reportada`, `Reconfirmar disponibilidad turnos rotativos en la entrevista presencial`]
      : [`Inconsistencia entre lo declarado en la llamada y la hoja de vida`, `Confirmar disponibilidad real para turnos de fin de semana antes de avanzar`],
    entornoPersonal: [
      { label: 'Municipio', value: city, status: wrongCity ? 'warning' : 'ok' },
      { label: 'Disponibilidad inicio', value: hi ? 'Inmediata' : '8 días de preaviso', status: hi ? 'ok' : 'neutral' },
      { label: 'Turnos rotativos', value: hi ? 'Disponibilidad total L–D' : 'Disponibilidad parcial', status: hi ? 'ok' : 'warning' },
    ],
    experienciaLaboral: [
      { empresa: job.c, rol: job.r, periodo: hi ? '2023 – Presente' : `2022 – ${job.d}`, descripcion: hi ? `Auxiliar de cocina en restaurante de cadena. Mise en place, preparación de alimentos y mantenimiento de estándares de higiene. ${expMonths} meses de experiencia certificable.` : `Preparación de alimentos y apoyo en cocina. Experiencia básica en estándares de higiene y operación.` },
      { empresa: prevJob.c, rol: prevJob.r, periodo: prevJob.periodo, descripcion: prevJob.desc },
    ],
  } : undefined;
  return {
    id, name, role: 'Auxiliar de Cocina', sector: 'Gastronomía / Restaurantes',
    years, location: `${city}, Colombia`,
    bio: 'Candidato con experiencia en preparación de alimentos y operación de cocina en restaurante. Manejo de mise en place, equipos de cocina y protocolos de higiene HACCP. Disponibilidad para turnos rotativos lunes a domingo.',
    score, photo, avatarInitials: initials, avatarColor: color,
    hasCurrentJob: score >= 68,
    ...(score >= 68 ? { currentCompany: job.c, currentRole: job.r } : { lastCompany: job.c, lastRole: job.r, lastDate: job.d }),
    superpoder: hi ? '"Precisión en preparación de alimentos y cumplimiento de estándares de higiene de cadena"' : md ? '"Disposición para aprender y adaptarse a los estándares de la operación"' : '"Actitud positiva y ganas de crecer en el sector gastronómico"',
    aspiration, budget: "$1'423.500", salaryRange, currentStage: stage,
    ...(pre ? { prescreeningAI: pre } : {}),
    scoringAI: {
      score: Math.round(score * 0.95),
      status: score >= 58 ? 'continua' : 'pendiente',
      resumen: hi
        ? `${name} cumple todos los criterios del perfil. Más de ${expMonths} meses de experiencia certificable en cocina, disponibilidad completa para turnos rotativos y conocimiento de normas de higiene HACCP.`
        : md
        ? `${name} cumple parcialmente el perfil. Experiencia en preparación de alimentos con observaciones en certificación. Requiere validación adicional.`
        : `${name} no cumple los requisitos mínimos del perfil. Se identificaron brechas en experiencia certificada o disponibilidad para turnos rotativos.`,
      noNegociables: [
        { label: 'Mín. 6 meses de experiencia en cocina o manipulación de alimentos', cumple: hi || (md && score >= 65) },
        { label: 'Carné de manipulación de alimentos vigente o disposición para obtenerlo', cumple: !wrongCity && score >= 45 },
        { label: 'Disponibilidad completa para turnos rotativos (lunes a domingo)', cumple: !wrongCity },
        { label: 'Conocimiento básico de BPM e higiene de cocina', cumple: hi || (md && score >= 63) },
      ],
      logros: hi
        ? [
            `${expMonths} meses de experiencia certificable en cocina — supera el mínimo requerido`,
            `Experiencia en restaurante de cadena: ${job.c} — familiarizado con estándares de inocuidad`,
            'Disponibilidad inmediata y sin restricciones para turnos rotativos lunes a domingo',
          ]
        : md
        ? [
            `Experiencia en cocina con ${expMonths} meses — requiere certificación formal`,
            'Disponibilidad para turnos rotativos confirmada con condiciones',
          ]
        : [
            'Experiencia en cocina por debajo del mínimo requerido de 6 meses',
          ],
      senales: hi
        ? ['Confirmar si tiene carné de manipulación de alimentos vigente o disponibilidad para tramitarlo']
        : md
        ? [
            'Validar certificación de empleo anterior con NIT del empleador',
            score < 68 ? 'Confirmar disponibilidad real para turnos nocturnos y fines de semana' : 'Verificar experiencia específica en restaurante de cadena',
          ]
        : [
            wrongCity
              ? `Candidato residente en ${city} — fuera del área de cobertura de los puntos en Bogotá`
              : 'Experiencia certificada insuficiente — no alcanza los 6 meses requeridos',
            salaryRange === 'fuera_de_rango'
              ? 'Expectativa salarial por encima del presupuesto del cargo'
              : 'Disponibilidad para turnos rotativos no confirmada claramente',
          ],
    },
    veredictoEntrevista: (['entrevistas','estudios','finalistas'] as PipelineStageKey[]).includes(stage)
      ? (score >= 78 ? 'apto' as const : score >= 62 ? 'apto_reservas' as const : 'no_apto' as const)
      : undefined,
    ...extras,
  };
}

const transpPubCandidates: Candidate[] = [
  _mkTranspPub('tp-1',  'Rodrigo Castellanos',    93, _p(16, 'men'), 'RC', '#8750F6', 'Bogotá',      '14 Años', "$2'800.000", 'en_rango',       'entrevistas', { applicationHistory: { count: 3, lastDate: '2024-08', status: 'recurrente' } }),
  _mkTranspPub('tp-2',  'Camilo Reyes',            89, _p(17, 'men'), 'CR', '#27BE69', 'Soacha',      '11 Años', "$2'700.000", 'en_rango',       'entrevistas', { applicationHistory: { count: 2, lastDate: '2025-01', status: 'recurrente' } }),
  _mkTranspPub('tp-3',  'Humberto Ávila',          86, _p(18, 'men'), 'HA', '#295BFF', 'Bogotá',      '9 Años',  "$2'900.000", 'en_rango',       'entrevistas', { applicationHistory: { count: 1, status: 'primera_vez' }, rejectionType: 'circunstancial' }),
  _mkTranspPub('tp-4',  'Mauricio Soto',           83, _p(19, 'men'), 'MS', '#F6A350', 'Bogotá',      '8 Años',  "$2'800.000", 'en_rango',       'entrevistas', { applicationHistory: { count: 2, lastDate: '2024-11', status: 'recurrente' }, rejectionType: 'definitivo' }),
  _mkTranspPub('tp-5',  'Libardo Pinzón',          80, _p(20, 'men'), 'LP', '#8750F6', 'Chía',        '7 Años',  "$2'700.000", 'en_rango',       'entrevistas'),
  _mkTranspPub('tp-6',  'Julián Méndez',           77, _p(21, 'men'), 'JM', '#27BE69', 'Bogotá',      '6 Años',  "$2'800.000", 'en_rango',       'prescreening', { hasCV: false }),
  _mkTranspPub('tp-7',  'Ernesto Vásquez',         73, _p(22, 'men'), 'EV', '#295BFF', 'Bogotá',      '5 Años',  "$2'600.000", 'en_rango',       'prescreening', { hasCV: false }),
  _mkTranspPub('tp-8',  'Samuel Giraldo',          68, _p(23, 'men'), 'SG', '#F6A350', 'Soacha',      '5 Años',  "$2'700.000", 'en_rango',       'prescreening', { hasCV: false }),
  _mkTranspPub('tp-9',  'Alberto Pedraza',         55, _p(24, 'men'), 'AP', '#8750F6', 'Bogotá',      '4 Años',  "$2'500.000", 'en_rango',       'prescreening'),
  _mkTranspPub('tp-10', 'Ignacio Forero',          48, _p(25, 'men'), 'IF', '#27BE69', 'Bogotá',      '3 Años',  "$2'600.000", 'en_rango',       'prescreening'),
  _mkTranspPub('tp-11', 'Diego Cárdenas',          84, _p(26, 'men'), 'DC', '#295BFF', 'Bogotá',      '7 Años',  "$2'800.000", 'en_rango',       'prescreening'),
  _mkTranspPub('tp-12', 'Francisco Patiño',        80, _p(27, 'men'), 'FP', '#F6A350', 'Bogotá',      '6 Años',  "$2'700.000", 'en_rango',       'prescreening'),
  _mkTranspPub('tp-13', 'Jesús Rojas',             76, _p(28, 'men'), 'JR', '#8750F6', 'Madrid',      '5 Años',  "$2'800.000", 'en_rango',       'prescreening'),
  _mkTranspPub('tp-14', 'Manuel Espitia',          72, _p(29, 'men'), 'ME', '#27BE69', 'Bogotá',      '4 Años',  "$2'700.000", 'en_rango',       'prescreening'),
  _mkTranspPub('tp-15', 'Óscar Clavijo',           65, _p(30, 'men'), 'OC', '#295BFF', 'Bogotá',      '4 Años',  "$2'600.000", 'en_rango',       'prescreening'),
  _mkTranspPub('tp-16', 'Roberto Fonseca',         57, _p(31, 'men'), 'RF', '#F65078', 'Bogotá',      '3 Años',  "$2'500.000", 'en_rango',       'prescreening'),
  _mkTranspPub('tp-17', 'Jairo Montaño',           51, _p(32, 'men'), 'JM', '#27BE69', 'Cali',        '2 Años',  "$2'600.000", 'en_rango',       'prescreening'),
  _mkTranspPub('tp-18', 'Luis Angarita',    46, _p(33, 'men'), 'LA', '#F6A350', 'Bogotá',   '2 Años', "$3'500.000", 'fuera_de_rango', 'prescreening', { prescreeningAI: { status: 'no_realizada', score: 0, resumen: '', noNegociables: [], plusDetectados: [], senales: [] } }),
  _mkTranspPub('tp-19', 'Pedro Salamanca', 41, _p(34, 'men'), 'PS', '#295BFF', 'Medellín', '1 Año',  "$3'800.000", 'fuera_de_rango', 'prescreening', { prescreeningAI: { status: 'no_realizada', score: 0, resumen: '', noNegociables: [], plusDetectados: [], senales: [] } }),
  _mkTranspPub('tp-20', 'Sergio Amaya',    36, _p(35, 'men'), 'SA', '#8750F6', 'Bogotá',   '1 Año',  "$2'400.000", 'en_rango',       'prescreening', { prescreeningAI: { status: 'no_realizada', score: 0, resumen: '', noNegociables: [], plusDetectados: [], senales: [] } }),
  // Entrevista detailed candidates
  _mkTranspPub('tp-21', 'Carlos Medina',           87, _p(16, 'men'), 'CM', '#27BE69', 'Bogotá',      '9 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkTranspPub('tp-22', 'Andrés Duarte',           83, _p(17, 'men'), 'AD', '#F6A350', 'Bogotá',      '8 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkTranspPub('tp-23', 'Hernán Molina',           79, _p(18, 'men'), 'HM', '#295BFF', 'Bogotá',      '7 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkTranspPub('tp-24', 'Álvaro Correa',           75, _p(19, 'men'), 'AC', '#8750F6', 'Bogotá',      '6 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkTranspPub('tp-25', 'Gustavo Pulido',          71, _p(20, 'men'), 'GP', '#F65078', 'Bogotá',      '5 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkTranspPub('tp-26', 'Elkin Moreno',            67, _p(21, 'men'), 'EL', '#27BE69', 'Bogotá',      '5 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkTranspPub('tp-27', 'Marco Bernal',            63, _p(22, 'men'), 'MB', '#F6A350', 'Bogotá',      '4 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkTranspPub('tp-28', 'Fidel Suárez',            59, _p(23, 'men'), 'FS', '#295BFF', 'Bogotá',      '4 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkTranspPub('tp-29', 'Israel Nieto',            54, _p(24, 'men'), 'IN', '#8750F6', 'Bogotá',      '3 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkTranspPub('tp-30', 'Fabio León',              49, _p(25, 'men'), 'FL', '#27BE69', 'Bogotá',      '3 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkTranspPub('tp-31', 'Óscar Serrano',           44, _p(26, 'men'), 'OS', '#F6A350', 'Bogotá',      '2 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkTranspPub('tp-32', 'Misael Gómez',            39, _p(27, 'men'), 'MG', '#295BFF', 'Bogotá',      '2 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkTranspPub('tp-33', 'Tito Vargas',             34, _p(28, 'men'), 'TV', '#F65078', 'Bogotá',      '1 Año',   "$1'423.500", 'en_rango',       'entrevistas'),
];

// ══════════════════════════════════════════════════════════════════════════════
// VACANTE 3 — AUXILIAR DE COCINA (RESTAURANTES BOGOTÁ — BATCH D)
// ══════════════════════════════════════════════════════════════════════════════

const _distribRunt: { cc: string; cats: { c: string; e: string; v: string }[] }[] = [
  { cc: '80234567', cats: [{ c:'C2', e:'05/02/2022', v:'05/02/2025' }, { c:'B2', e:'05/02/2022', v:'05/02/2032' }] },
  { cc: '1029345678', cats: [{ c:'C2', e:'18/06/2023', v:'18/06/2026' }] },
  { cc: '79456789', cats: [{ c:'C2', e:'30/10/2023', v:'30/10/2026' }, { c:'B1', e:'30/10/2023', v:'30/10/2033' }] },
  { cc: '1034567890', cats: [{ c:'C2', e:'14/01/2024', v:'14/01/2027' }] },
  { cc: '80678901', cats: [{ c:'C2', e:'22/04/2023', v:'22/04/2026' }] },
  { cc: '1050789012', cats: [{ c:'C2', e:'07/08/2024', v:'07/08/2027' }] },
  { cc: '79789012', cats: [{ c:'C2', e:'25/03/2023', v:'25/03/2026' }] },
  { cc: '1061890123', cats: [{ c:'C2', e:'12/12/2023', v:'12/12/2026' }] },
  { cc: '80890123', cats: [{ c:'C2', e:'03/07/2023', v:'03/07/2026' }] },
  { cc: '1072901234', cats: [{ c:'C2', e:'28/09/2024', v:'28/09/2027' }] },
  { cc: '79901234', cats: [{ c:'C2', e:'15/02/2024', v:'15/02/2027' }] },
  { cc: '1083012345', cats: [{ c:'C2', e:'01/06/2024', v:'01/06/2027' }] },
  { cc: '80012345', cats: [{ c:'C2', e:'20/11/2023', v:'20/11/2026' }] },
  { cc: '1094123456', cats: [{ c:'C2', e:'08/04/2025', v:'08/04/2028' }] },
  { cc: '79123456', cats: [{ c:'C2', e:'27/08/2023', v:'27/08/2026' }] },
];

// ── Auxiliar de Cocina (batch d-*) — jobs & experience arrays ────────────
const _distribJobs = [
  { c: 'Archie\'s Colombia',        r: 'Auxiliar de Cocina',        d: '01/2025' },
  { c: 'Presto Colombia',           r: 'Auxiliar de Producción',    d: '03/2025' },
  { c: 'McDonald\'s Colombia',      r: 'Auxiliar de Cocina',        d: '11/2024' },
  { c: 'Subway Colombia',           r: 'Sandwich Artist',           d: '12/2024' },
  { c: 'Pizza Hut Colombia',        r: 'Auxiliar de Cocina',        d: '02/2025' },
  { c: 'Domino\'s Pizza',           r: 'Auxiliar de Producción',    d: '01/2025' },
  { c: 'Kokoriko S.A.S.',           r: 'Auxiliar de Cocina',        d: '04/2024' },
  { c: 'Frisby S.A.S.',             r: 'Auxiliar de Cocina',        d: '10/2024' },
  { c: 'El Corral Gourmet',         r: 'Auxiliar de Cocina',        d: '06/2024' },
  { c: 'Crepes & Waffles',          r: 'Auxiliar de Producción',    d: '09/2024' },
];

const _distribExpPrev = [
  { c: 'McDonald\'s Colombia',      r: 'Crew Member / Cocina',      periodo: '2021–2023', desc: 'Operación de equipos de cocina: freidoras, planchas y hornos. Cumplimiento de tiempos de producción y estándares de calidad de cadena.' },
  { c: 'Presto Colombia',           r: 'Auxiliar de Cocina',        periodo: '2020–2022', desc: 'Preparación de ingredientes, mise en place y limpieza de estaciones de trabajo. Manejo de congelados y control de temperaturas.' },
  { c: 'Pizza Hut Colombia',        r: 'Auxiliar de Cocina',        periodo: '2019–2021', desc: 'Preparación de masas, salsas y toppings. Control de porciones y tiempos de cocción. Higiene y desinfección de equipos al cierre.' },
  { c: 'Kokoriko S.A.S.',           r: 'Auxiliar de Cocina',        periodo: '2021–2023', desc: 'Preparación de marinados y mise en place. Cumplimiento de BPM y protocolos de inocuidad alimentaria en restaurante de cadena.' },
  { c: 'Subway Colombia',           r: 'Sandwich Artist',           periodo: '2020–2022', desc: 'Preparación de sándwiches y ensaladas. Atención al cliente y manejo de caja. Cumplimiento de estándares de frescura y presentación.' },
];

function _mkDistrib(id: string, name: string, score: number, photo: string, initials: string, color: string, city: string, years: string, aspiration: string, salaryRange: SalaryRange, stage: 'scoring' | 'prescreening' | 'entrevistas' = 'scoring', extras?: Partial<Candidate>): Candidate {
  const hi = score >= 75; const md = score >= 58;
  const idx = Math.max(0, parseInt(id.split('-')[1]) - 1) || 0;
  const job = _distribJobs[idx % _distribJobs.length] ?? _distribJobs[0];
  const prevJob = _distribExpPrev[idx % _distribExpPrev.length] ?? _distribExpPrev[0];
  const expMonths = hi ? Math.round(14 + (score - 75) * 2) : md ? Math.round(6 + (score - 58) * 0.5) : Math.round(2 + score * 0.1);
  const wrongCity = city === 'Barranquilla' || city === 'Cali' || city === 'Medellín';
  const hasPrescreeningStage = stage === 'prescreening' || stage === 'entrevistas';
  const pre: Candidate['prescreeningAI'] = hasPrescreeningStage ? {
    score: Math.round(score * 0.97),
    status: hi ? 'continua' : md ? 'continua' : 'pendiente',
    resumen: hi
      ? `${name} confirmó experiencia certificable en preparación de alimentos y operación de cocina. Demostró conocimiento de normas de higiene, manejo de equipos y disponibilidad total para turnos rotativos. Sin inconsistencias.`
      : md
      ? `${name} confirmó experiencia básica en cocina. Disponibilidad para turnos rotativos aceptada con condiciones. Requiere validación de la experiencia con empleador certificable.`
      : `${name} presentó experiencia limitada en cocina. La disponibilidad para turnos rotativos y la experiencia declarada no fueron confirmadas con claridad.`,
    noNegociables: [
      { label: 'Mín. 6 meses de experiencia en cocina o manipulación de alimentos', score: hi ? score - 2 : md ? score - 8 : score - 18, evidencia: hi ? `Confirmó ${expMonths} meses de experiencia en cocina de restaurante de cadena. Describió funciones de mise en place, limpieza y manejo de equipos.` : md ? `Menciona experiencia en cocina pero con menor detalle en empleador certificable.` : `No acreditó experiencia suficiente en manipulación de alimentos.` } as EvalRow,
      { label: 'Carné de manipulación de alimentos vigente o disposición para obtenerlo', score: hi ? score - 1 : md ? score - 5 : score - 15, evidencia: hi ? `Cuenta con carné de manipulación de alimentos vigente.` : md ? `No tiene carné vigente pero expresa disposición para tramitarlo antes de iniciar.` : `No tiene carné y no confirmó disponibilidad para tramitarlo.` } as EvalRow,
      { label: 'Disponibilidad completa para turnos rotativos (lunes a domingo)', score: hi ? score - 1 : md ? score - 5 : score - 20, evidencia: hi ? `Confirma disponibilidad total para esquema rotativo L–D. Experiencia previa en turnos de fin de semana.` : md ? `Acepta turnos rotativos con condiciones de preaviso para ajustes.` : `Manifestó dudas sobre disponibilidad en fines de semana.` } as EvalRow,
      { label: 'Conocimiento básico de BPM e higiene de cocina', score: hi ? score : md ? score - 4 : score - 12, evidencia: hi ? `Describió protocolos de limpieza, rotación PEPS y control de temperaturas de forma correcta.` : md ? `Conocimiento básico de higiene de cocina sin formación formal certificada.` : `Sin conocimiento evidenciado de normas de inocuidad alimentaria.` } as EvalRow,
    ],
    plusDetectados: hi
      ? [`Experiencia en múltiples estaciones de cocina: fría, caliente y mise en place`, `Manejo de equipos industriales: freidoras, hornos y planchas`, `Actitud proactiva y orientación al trabajo en equipo bajo presión`]
      : md
      ? [`Disposición para capacitación en estándares de la cadena`, `Puntualidad y compromiso con los horarios evidenciados`]
      : [`Disposición para empezar en el corto plazo si se resuelven las dudas`],
    senales: hi
      ? [`Confirmar si tiene carné de manipulación vigente o disponibilidad para tramitarlo`]
      : md
      ? [`Validar experiencia con empleador certificable`, `Reconfirmar disponibilidad turnos rotativos en la entrevista`]
      : [`Confirmar disponibilidad real para turnos de fin de semana antes de avanzar`],
    entornoPersonal: [
      { label: 'Municipio', value: city, status: wrongCity ? 'warning' : 'ok' },
      { label: 'Disponibilidad inicio', value: hi ? 'Inmediata' : '8 días preaviso', status: hi ? 'ok' : 'neutral' },
      { label: 'Turnos rotativos', value: hi ? 'Disponibilidad total L–D' : 'Disponibilidad parcial', status: hi ? 'ok' : 'warning' },
    ],
    experienciaLaboral: [
      { empresa: job.c, rol: job.r, periodo: hi ? '2023 – Presente' : `2022 – ${job.d}`, descripcion: hi ? `Auxiliar de cocina en restaurante de cadena. Mise en place, preparación y mantenimiento de estándares de higiene. ${expMonths} meses de experiencia certificable.` : `Preparación de alimentos y apoyo en cocina. Experiencia básica en higiene y operación.` },
      { empresa: prevJob.c, rol: prevJob.r, periodo: prevJob.periodo, descripcion: prevJob.desc },
    ],
  } : undefined;
  return {
    id, name, role: 'Auxiliar de Cocina', sector: 'Gastronomía / Restaurantes',
    years, location: `${city}, Colombia`,
    bio: 'Candidato con experiencia en preparación de alimentos y operación de cocina en restaurante de cadena. Manejo de mise en place, equipos de cocina y protocolos de higiene. Disponibilidad para turnos rotativos lunes a domingo.',
    score, photo, avatarInitials: initials, avatarColor: color,
    hasCurrentJob: score >= 68,
    ...(score >= 68 ? { currentCompany: job.c, currentRole: job.r } : { lastCompany: job.c, lastRole: job.r, lastDate: job.d }),
    superpoder: hi ? '"Eficiencia en preparación de alimentos y cumplimiento de estándares de inocuidad"' : md ? '"Disposición para aprender y adaptarse a los protocolos de la cadena"' : '"Actitud positiva y ganas de crecer en el sector gastronómico"',
    aspiration, budget: "$1'423.500", salaryRange, currentStage: stage,
    ...(pre ? { prescreeningAI: pre } : {}),
    scoringAI: {
      score: Math.round(score * 0.95),
      status: score >= 58 ? 'continua' : 'pendiente',
      resumen: hi
        ? `${name} cumple todos los criterios del perfil. Más de ${expMonths} meses de experiencia certificable en cocina, disponibilidad completa para turnos rotativos y conocimiento de normas de higiene alimentaria.`
        : md
        ? `${name} cumple parcialmente. Requiere validación de experiencia con empleador certificable y confirmación de disponibilidad.`
        : `${name} no cumple los requisitos mínimos. Brechas en experiencia certificada o disponibilidad.`,
      noNegociables: [
        { label: 'Mín. 6 meses de experiencia en cocina o manipulación de alimentos', cumple: hi || (md && score >= 65) },
        { label: 'Carné de manipulación de alimentos vigente o disposición para obtenerlo', cumple: !wrongCity && score >= 45 },
        { label: 'Disponibilidad completa para turnos rotativos (lunes a domingo)', cumple: !wrongCity },
        { label: 'Conocimiento básico de BPM e higiene de cocina', cumple: hi || (md && score >= 63) },
      ],
      logros: hi
        ? [
            `${expMonths} meses de experiencia certificable en cocina — supera el mínimo requerido`,
            `Experiencia en restaurante de cadena: ${job.c} — familiarizado con protocolos de inocuidad`,
            'Disponibilidad inmediata y sin restricciones para turnos rotativos lunes a domingo',
          ]
        : md
        ? [
            `Experiencia en cocina con ${expMonths} meses — requiere certificación formal`,
            'Disponibilidad para turnos rotativos confirmada con condiciones',
          ]
        : [
            'Experiencia en cocina por debajo del mínimo requerido de 6 meses',
          ],
      senales: hi
        ? ['Confirmar vigencia del carné de manipulación de alimentos']
        : md
        ? [
            'Validar certificación de empleo anterior con NIT del empleador',
            score < 68 ? 'Confirmar disponibilidad real para turnos nocturnos y fines de semana' : 'Verificar experiencia específica en restaurante de cadena',
          ]
        : [
            wrongCity
              ? `Candidato residente en ${city} — fuera del área de cobertura de los puntos en Bogotá`
              : 'Experiencia certificada insuficiente — no alcanza los 6 meses requeridos',
            salaryRange === 'fuera_de_rango'
              ? 'Expectativa salarial por encima del presupuesto del cargo'
              : 'Disponibilidad para turnos rotativos no confirmada claramente',
          ],
    },
    veredictoEntrevista: (['entrevistas','estudios','finalistas'] as PipelineStageKey[]).includes(stage)
      ? (score >= 78 ? 'apto' as const : score >= 62 ? 'apto_reservas' as const : 'no_apto' as const)
      : undefined,
    ...extras,
  };
}

const distribCandidates: Candidate[] = [
  _mkDistrib('d-1',  'Andrés Morales',        92, _p(36, 'men'), 'AM', '#8750F6', 'Bogotá',       '13 Años', "$2'600.000", 'en_rango',       'entrevistas'),
  _mkDistrib('d-2',  'Iván Herrera',           88, _p(37, 'men'), 'IH', '#27BE69', 'Bogotá',       '10 Años', "$2'500.000", 'en_rango',       'entrevistas'),
  _mkDistrib('d-3',  'Jhon Mejía',             85, _p(38, 'men'), 'JM', '#295BFF', 'Soacha',       '8 Años',  "$2'700.000", 'en_rango',       'entrevistas'),
  _mkDistrib('d-4',  'Carlos Zambrano',        82, _p(39, 'men'), 'CZ', '#F6A350', 'Bogotá',       '7 Años',  "$2'600.000", 'en_rango',       'entrevistas'),
  _mkDistrib('d-5',  'Mauricio Ospina',        79, _p(40, 'men'), 'MO', '#8750F6', 'Bogotá',       '6 Años',  "$2'500.000", 'en_rango',       'entrevistas'),
  _mkDistrib('d-6',  'Javier Lozano',          76, _p(41, 'men'), 'JL', '#27BE69', 'Bogotá',       '6 Años',  "$2'600.000", 'en_rango',       'prescreening'),
  _mkDistrib('d-7',  'Luis Molina',            71, _p(42, 'men'), 'LM', '#295BFF', 'Bogotá',       '5 Años',  "$2'400.000", 'en_rango',       'prescreening'),
  _mkDistrib('d-8',  'Henry Vargas',           66, _p(43, 'men'), 'HV', '#F6A350', 'Bogotá',       '4 Años',  "$2'500.000", 'en_rango',       'prescreening'),
  _mkDistrib('d-9',  'Sergio Nieto',           55, _p(44, 'men'), 'SN', '#8750F6', 'Bogotá',       '3 Años',  "$2'600.000", 'en_rango',       'prescreening'),
  _mkDistrib('d-10', 'Freddy Peña',            48, _p(45, 'men'), 'FP', '#27BE69', 'Bogotá',       '3 Años',  "$2'400.000", 'en_rango',       'prescreening'),
  _mkDistrib('d-11', 'Gabriel Torres',         83, _p(46, 'men'), 'GT', '#295BFF', 'Bogotá',       '7 Años',  "$2'600.000", 'en_rango',  'prescreening'),
  _mkDistrib('d-12', 'Nicolás Parra',          79, _p(47, 'men'), 'NP', '#F6A350', 'Bogotá',       '6 Años',  "$2'500.000", 'en_rango',  'prescreening'),
  _mkDistrib('d-13', 'Fabio Guerrero',         75, _p(48, 'men'), 'FG', '#8750F6', 'Bosa',         '5 Años',  "$2'600.000", 'en_rango',  'prescreening'),
  _mkDistrib('d-14', 'Álvaro Pineda',          70, _p(49, 'men'), 'AP', '#27BE69', 'Bogotá',       '4 Años',  "$2'500.000", 'en_rango',  'prescreening'),
  _mkDistrib('d-15', 'Gonzalo Rincón',         64, _p(50, 'men'), 'GR', '#295BFF', 'Bogotá',       '4 Años',  "$2'400.000", 'en_rango',  'prescreening'),
  _mkDistrib('d-16', 'Omar Bermúdez',          57, _p(51, 'men'), 'OB', '#F65078', 'Bogotá',       '3 Años',  "$2'500.000", 'en_rango',  'prescreening'),
  _mkDistrib('d-17', 'Hernán Lagos',           51, _p(52, 'men'), 'HL', '#27BE69', 'Cali',         '2 Años',  "$2'400.000", 'en_rango',  'prescreening'),
  _mkDistrib('d-18', 'Mario Cárdenas', 45, _p(53, 'men'), 'MC', '#F6A350', 'Bogotá',   '2 Años', "$3'500.000", 'fuera_de_rango', 'prescreening', { prescreeningAI: { status: 'no_realizada', score: 0, resumen: '', noNegociables: [], plusDetectados: [], senales: [] } }),
  _mkDistrib('d-19', 'Felipe Serna',   40, _p(54, 'men'), 'FS', '#295BFF', 'Medellín', '1 Año',  "$3'800.000", 'fuera_de_rango', 'prescreening', { prescreeningAI: { status: 'no_realizada', score: 0, resumen: '', noNegociables: [], plusDetectados: [], senales: [] } }),
  _mkDistrib('d-20', 'Ricardo Álvarez',35, _p(55, 'men'), 'RA', '#8750F6', 'Bogotá',   '1 Año',  "$2'300.000", 'en_rango',       'prescreening', { prescreeningAI: { status: 'no_realizada', score: 0, resumen: '', noNegociables: [], plusDetectados: [], senales: [] } }),
  // Entrevista detailed candidates
  _mkDistrib('d-21', 'Camilo Vargas',          88, _p(56, 'men'), 'CV', '#8750F6', 'Bogotá',       '9 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkDistrib('d-22', 'Juan Espinoza',          85, _p(57, 'men'), 'JE', '#27BE69', 'Bogotá',       '8 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkDistrib('d-23', 'Rodrigo Muñoz',          81, _p(58, 'men'), 'RM', '#F6A350', 'Bogotá',       '7 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkDistrib('d-24', 'Sebastián Gil',          78, _p(59, 'men'), 'SG', '#295BFF', 'Bogotá',       '7 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkDistrib('d-25', 'Andrés Cano',            75, _p(60, 'men'), 'AC', '#F65078', 'Bogotá',       '6 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkDistrib('d-26', 'Miguel Ríos',            72, _p(61, 'men'), 'MR', '#8750F6', 'Bogotá',       '5 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkDistrib('d-27', 'Esteban Mora',           68, _p(62, 'men'), 'EM', '#27BE69', 'Bogotá',       '5 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkDistrib('d-28', 'Jaime Castaño',          65, _p(63, 'men'), 'JC', '#F6A350', 'Bogotá',       '4 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkDistrib('d-29', 'Samuel Pedraza',         61, _p(64, 'men'), 'SP', '#295BFF', 'Bogotá',       '4 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkDistrib('d-30', 'Diego Rueda',            58, _p(65, 'men'), 'DR', '#8750F6', 'Bogotá',       '3 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkDistrib('d-31', 'Cristian Pinto',         54, _p(66, 'men'), 'CP', '#27BE69', 'Bogotá',       '3 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkDistrib('d-32', 'Alejandro Rojas',        51, _p(67, 'men'), 'AR', '#F6A350', 'Bogotá',       '2 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkDistrib('d-33', 'Gustavo Heredia',        47, _p(68, 'men'), 'GH', '#295BFF', 'Bogotá',       '2 Años',  "$1'423.500", 'en_rango',       'entrevistas'),
  _mkDistrib('d-34', 'Nicolás Ortega',         43, _p(69, 'men'), 'NO', '#F65078', 'Bogotá',       '1 Año',   "$1'423.500", 'en_rango',       'entrevistas'),
  _mkDistrib('d-35', 'Pablo Serrano',          39, _p(70, 'men'), 'PS', '#8750F6', 'Bogotá',       '1 Año',   "$1'423.500", 'en_rango',       'entrevistas'),
];

// ── Prueba Psicológica: perfil operativo sector restaurantes ──────────────────
function _psychTransp(score: number, name: string): PsychTestResult {
  return {
    score: Math.round(score * 0.95),
    insight: `${name} presenta un perfil conductual con alta orientación al servicio, trabajo en equipo y cumplimiento de estándares operativos. Gestiona adecuadamente el estrés bajo presión de horas pico y se adapta con facilidad a entornos de alta demanda.`,
    fitCards: [
      {
        axis: 'Orientación al servicio y atención al cliente',
        idealScore: 90, candidateScore: score,
        summary: 'Actitud de servicio genuina y trato amable.',
        detail: 'Prioriza la satisfacción del cliente, mantiene actitud positiva ante situaciones de queja y gestiona los momentos de alta demanda con empatía. Fundamental para el estándar de calidad del restaurante.',
      },
      {
        axis: 'Tolerancia al estrés y trabajo bajo presión',
        idealScore: 82, candidateScore: score - 5,
        summary: 'Estabilidad emocional en horas pico de servicio.',
        detail: 'Capacidad de mantener el ritmo y la calidad del trabajo durante el servicio de almuerzo y cena con alta concurrencia. El perfil demuestra resiliencia en turnos rotativos sin deterioro del rendimiento.',
      },
      {
        axis: 'Orientación a procedimientos e higiene',
        idealScore: 85, candidateScore: score - 3,
        summary: 'Adherencia a normas BPM y protocolos operativos.',
        detail: 'Cumple estrictamente con los protocolos de higiene, manipulación de alimentos y estándares operativos de la cadena. La adherencia a normas es crítica para garantizar la inocuidad alimentaria y la calidad del servicio.',
      },
      {
        axis: 'Trabajo en equipo',
        idealScore: 75, candidateScore: score - 8,
        summary: 'Colaboración efectiva en equipo de cocina y sala.',
        detail: 'Trabaja coordinadamente con el equipo de cocina y sala, comunica novedades con claridad y apoya a los compañeros en momentos de alta demanda. La dinámica de equipo en restaurante es determinante para el servicio.',
      },
    ],
    radarPoints: [
      { label: 'Serv. al cliente',  value: score     },
      { label: 'Estrés',            value: score - 5 },
      { label: 'Procedimientos',    value: score - 3 },
      { label: 'Autonomía',         value: score - 6 },
      { label: 'Puntualidad',       value: score - 2 },
      { label: 'Trab. en equipo',   value: score - 8 },
      { label: 'Adaptabilidad',     value: score - 4 },
      { label: 'Higiene y orden',   value: score - 1 },
    ],
    veredicto: [
      { title: 'Quién es conductualmente', body: `Perfil estable, orientado al servicio y con alta tolerancia a la rutina operativa de restaurante. Trabaja con disciplina en contextos estructurados y de alta demanda. Su fortaleza está en la adherencia a protocolos de higiene, el trabajo en equipo y la actitud de servicio. La constancia y el control emocional lo hacen apto para operación de largo plazo en el sector gastronómico.` },
      { title: 'Fit con este rol', body: `El perfil operativo de restaurante requiere exactamente las competencias más sólidas de este candidato: orientación al servicio, tolerancia al estrés en horas pico y adherencia a procedimientos de higiene. El eje de trabajo en equipo puede afinarse en la inducción con el estándar de operación de la cadena.` },
    ],
    preguntas: [
      { tag: 'Para: Jefe de Cocina / Sala', question: '"Cuéntame de una situación difícil durante el servicio — un pedido equivocado, un cliente difícil o un momento de alta demanda — y cómo lo manejaste."', validates: 'Tolerancia al estrés y toma de decisiones bajo presión' },
      { tag: 'Para: RRHH', question: '"¿Cómo te organizas cuando tienes turno de apertura y al día siguiente turno de cierre? ¿Cómo cuidas tu descanso y rendimiento con turnos rotativos?"', validates: 'Autogestión y disciplina en turnos rotativos' },
    ],
  };
}

// ── Candidatos en EVALUACIONES (pipeline completo) ─────────────────────────────
function _mkTranspPubEval(id: string, name: string, score: number, photo: string, initials: string, color: string, city: string, years: string, aspiration: string): Candidate {
  const idx = Math.max(0, parseInt(id.split('-')[1]) - 1) || 0;
  const job = _auxCocinaJobs[idx % _auxCocinaJobs.length] ?? _auxCocinaJobs[0];
  const prevJob = _auxCocinaExpPrev[idx % _auxCocinaExpPrev.length] ?? _auxCocinaExpPrev[0];
  const expMonths = Math.round(14 + (score - 75) * 2);
  return {
    id, name, role: 'Auxiliar de Cocina', sector: 'Gastronomía / Restaurantes',
    years, location: `${city}, Colombia`,
    bio: 'Candidato con amplia experiencia en preparación de alimentos y operación de cocina en restaurante de cadena. Manejo de mise en place, equipos de cocina y protocolos de higiene HACCP. Disponibilidad total para turnos rotativos lunes a domingo.',
    score, photo, avatarInitials: initials, avatarColor: color,
    hasCurrentJob: true, currentCompany: job.c, currentRole: job.r,
    superpoder: '"Precisión en preparación de alimentos y cumplimiento de estándares de inocuidad de cadena"',
    aspiration, budget: "$1'423.500", salaryRange: 'en_rango', currentStage: 'evaluaciones',
    scoringAI: {
      score: Math.round(score * 0.95), status: 'continua',
      resumen: `${name} cumple todos los criterios del perfil. Más de ${expMonths} meses de experiencia certificable en cocina, disponibilidad completa para turnos rotativos y conocimiento de normas de higiene HACCP.`,
      noNegociables: [
        { label: 'Mín. 6 meses de experiencia en cocina o manipulación de alimentos', cumple: true },
        { label: 'Carné de manipulación de alimentos vigente o disposición para obtenerlo', cumple: true },
        { label: 'Disponibilidad completa para turnos rotativos (lunes a domingo)', cumple: true },
        { label: 'Conocimiento básico de BPM e higiene de cocina', cumple: true },
      ],
      logros: [`${expMonths} meses de experiencia certificable en cocina — supera el mínimo requerido`, `Experiencia en restaurante de cadena: ${job.c}`, 'Disponibilidad inmediata confirmada para turnos rotativos'],
      senales: ['Confirmar vigencia del carné de manipulación de alimentos'],
    },
    prescreeningAI: {
      score: Math.round(score * 0.96), status: 'continua',
      resumen: `${name} confirmó experiencia certificable en preparación de alimentos. Demostró conocimiento de normas de higiene, manejo de equipos de cocina y disponibilidad total para turnos rotativos. Sin inconsistencias.`,
      noNegociables: [
        { label: 'Mín. 6 meses de experiencia en cocina o manipulación de alimentos', score: score - 1, evidencia: `Confirmó ${expMonths} meses de experiencia certificable en cocina de restaurante de cadena.` } as EvalRow,
        { label: 'Carné de manipulación de alimentos vigente', score: score, evidencia: `Cuenta con carné de manipulación de alimentos vigente. Describió proceso de renovación reciente.` } as EvalRow,
        { label: 'Disponibilidad completa para turnos rotativos (lunes a domingo)', score: score - 2, evidencia: `Confirma disponibilidad total para esquema rotativo L–D.` } as EvalRow,
        { label: 'Conocimiento básico de BPM e higiene de cocina', score: score - 1, evidencia: `Describió correctamente procedimientos de limpieza, rotación PEPS y control de temperaturas.` } as EvalRow,
      ],
      plusDetectados: [`Experiencia en múltiples estaciones de cocina: preparación fría, caliente y mise en place`, `Conocimiento de control de inventario y rotación de insumos PEPS`, `Actitud colaborativa y orientación al trabajo en equipo bajo presión`],
      senales: [`Confirmar manejo de equipos específicos del punto (freidora industrial, horno de convección)`],
      entornoPersonal: [
        { label: 'Municipio', value: city, status: 'ok' },
        { label: 'Disponibilidad inicio', value: 'Inmediata', status: 'ok' },
        { label: 'Turnos rotativos', value: 'Disponibilidad total L–D', status: 'ok' },
      ],
      experienciaLaboral: [
        { empresa: job.c, rol: job.r, periodo: '2023 – Presente', descripcion: `Auxiliar de cocina en restaurante de cadena. Mise en place, preparación y mantenimiento de estándares de higiene. ${expMonths} meses de experiencia certificable.` },
        { empresa: prevJob.c, rol: prevJob.r, periodo: prevJob.periodo, descripcion: prevJob.desc },
      ],
    },
    psychTest: _psychTransp(score, name),
  };
}

const transpPubEvaluaciones: Candidate[] = [
  _mkTranspPubEval('tp-e1', 'Rodrigo Castellanos',  93, _p(16, 'men'), 'RC', '#8750F6', 'Bogotá',  '3 Años', "$1'423.500"),
  _mkTranspPubEval('tp-e2', 'Camilo Reyes',          89, _p(17, 'men'), 'CR', '#27BE69', 'Bogotá',  '2 Años', "$1'423.500"),
  _mkTranspPubEval('tp-e3', 'Humberto Ávila',        86, _p(18, 'men'), 'HA', '#295BFF', 'Bogotá',  '4 Años', "$1'423.500"),
];

const transpPubScoring      = transpPubCandidates.filter(c => c.currentStage === 'scoring');
const transpPubPrescreening = transpPubCandidates.filter(c => c.currentStage === 'prescreening');
const transpPubEntrevistas  = transpPubCandidates.filter(c => c.currentStage === 'entrevistas');

const distribScoring      = distribCandidates.filter(c => c.currentStage === 'scoring');
const distribPrescreening = distribCandidates.filter(c => c.currentStage === 'prescreening');
const distribEntrevistas  = distribCandidates.filter(c => c.currentStage === 'entrevistas');

// ── Candidatos EVALUACIONES — Distribución Urbana ───────────────────────────
function _mkDistribEval(id: string, name: string, score: number, photo: string, initials: string, color: string, city: string, years: string, aspiration: string): Candidate {
  const job     = _distribJobs[0]    ?? { c: 'Crepes & Waffles Colombia', r: 'Auxiliar de Cocina', d: '2024' };
  const prevJob = _distribExpPrev[0] ?? { c: 'McDonald\'s Colombia', r: 'Crew Member / Cocina', periodo: '2021–2023', desc: 'Preparación de alimentos y operación de equipos de cocina en restaurante de cadena.' };
  const expMonths = Math.round(16 + (score - 75) * 2);
  return {
    id, name, role: 'Auxiliar de Cocina', sector: 'Gastronomía / Restaurantes',
    years, location: `${city}, Colombia`,
    bio: 'Candidato con amplia experiencia en preparación de alimentos y operación de cocina en restaurante de cadena. Manejo de mise en place, equipos de cocina y protocolos de higiene HACCP. Disponibilidad total para turnos rotativos lunes a domingo.',
    score, photo, avatarInitials: initials, avatarColor: color,
    hasCurrentJob: true, currentCompany: job.c, currentRole: job.r,
    superpoder: '"Precisión en preparación de alimentos y cumplimiento de protocolos de inocuidad de cadena"',
    aspiration, budget: "$1'423.500", salaryRange: 'en_rango', currentStage: 'evaluaciones',
    scoringAI: {
      score: Math.round(score * 0.95), status: 'continua',
      resumen: `${name} cumple todos los criterios del perfil. Más de ${expMonths} meses de experiencia certificable en cocina, disponibilidad completa para turnos rotativos y conocimiento de normas de higiene HACCP.`,
      noNegociables: [
        { label: 'Mín. 6 meses de experiencia en cocina o manipulación de alimentos', cumple: true },
        { label: 'Carné de manipulación de alimentos vigente o disposición para obtenerlo', cumple: true },
        { label: 'Disponibilidad completa para turnos rotativos (lunes a domingo)', cumple: true },
        { label: 'Conocimiento básico de BPM e higiene de cocina', cumple: true },
      ],
      logros: [`${expMonths} meses de experiencia certificable en cocina — supera el mínimo requerido`, `Experiencia en restaurante de cadena: ${job.c}`, 'Disponibilidad inmediata confirmada para turnos rotativos'],
      senales: ['Confirmar vigencia del carné de manipulación de alimentos'],
    },
    prescreeningAI: {
      score: Math.round(score * 0.97), status: 'continua',
      resumen: `${name} confirmó disponibilidad inmediata para turnos rotativos. Demostró conocimiento de normas de higiene, manejo de equipos de cocina y experiencia certificable en restaurante de cadena. Sin inconsistencias.`,
      noNegociables: [
        { label: 'Mín. 6 meses de experiencia en cocina o manipulación de alimentos', score: score - 1, evidencia: `Confirmó ${expMonths} meses de experiencia en cocina de restaurante de cadena. Describió funciones de mise en place y manejo de equipos.` } as EvalRow,
        { label: 'Carné de manipulación de alimentos vigente', score: score, evidencia: `Cuenta con carné de manipulación de alimentos vigente. Describe proceso de renovación reciente.` } as EvalRow,
        { label: 'Disponibilidad completa para turnos rotativos (lunes a domingo)', score: score - 2, evidencia: `Confirma disponibilidad total para esquema rotativo L–D. Ha trabajado bajo este esquema en empleadores anteriores.` } as EvalRow,
        { label: 'Conocimiento básico de BPM e higiene de cocina', score: score - 1, evidencia: `Describió correctamente procedimientos de limpieza, rotación PEPS y control de temperaturas.` } as EvalRow,
      ],
      plusDetectados: [`Experiencia en múltiples estaciones de cocina: preparación fría, caliente y mise en place`, `Conocimiento de control de inventario y rotación de insumos PEPS`, `Actitud colaborativa y orientación al trabajo en equipo bajo presión`],
      senales: [`Confirmar manejo de equipos específicos del punto (freidora industrial, horno de convección)`],
      entornoPersonal: [
        { label: 'Municipio', value: city, status: 'ok' },
        { label: 'Disponibilidad inicio', value: 'Inmediata', status: 'ok' },
        { label: 'Turnos rotativos', value: 'Disponibilidad total L–D', status: 'ok' },
      ],
      experienciaLaboral: [
        { empresa: job.c, rol: job.r, periodo: '2023 – Presente', descripcion: `Auxiliar de cocina en restaurante de cadena. Mise en place, preparación y mantenimiento de estándares de higiene. ${expMonths} meses de experiencia certificable.` },
        { empresa: prevJob.c, rol: prevJob.r, periodo: prevJob.periodo, descripcion: prevJob.desc },
      ],
    },
    psychTest: _psychTransp(score, name),
  };
}

const distribEvaluaciones: Candidate[] = [
  _mkDistribEval('d-e1', 'Andrés Morales',     92, _p(36, 'men'), 'AM', '#8750F6', 'Bogotá', '3 Años', "$1'423.500"),
  _mkDistribEval('d-e2', 'Iván Herrera',        88, _p(37, 'men'), 'IH', '#27BE69', 'Bogotá', '2 Años', "$1'423.500"),
  _mkDistribEval('d-e3', 'Jhon Mejía',          85, _p(38, 'men'), 'JM', '#295BFF', 'Bogotá', '4 Años', "$1'423.500"),
];

// ── Candidatos EVALUACIONES — Mesero / Polifuncional ──────────────────────
function _mkVigiaEval(id: string, name: string, score: number, photo: string, initials: string, color: string, city: string, years: string, aspiration: string): Candidate {
  const job     = _vigiaJobs[0]    ?? { c: 'Crepes & Waffles', r: 'Mesero Polifuncional', d: '2024' };
  const prevJob = _vigiaExpPrev[0] ?? { c: 'El Corral', r: 'Cajero / Mesero', periodo: '2021–2023', desc: 'Atención en mesa y manejo de caja.' };
  const expMonths = Math.round(18 + (score - 75) * 2);
  return {
    id, name, role: 'Mesero / Polifuncional', sector: 'Gastronomía / Restaurantes',
    years, location: `${city}, Colombia`,
    bio: 'Candidato con amplia experiencia en servicio al cliente y operación de restaurante. Manejo de barra, caja, atención en mesa y domicilios. Disponibilidad total para turnos rotativos lunes a domingo.',
    score, photo, avatarInitials: initials, avatarColor: color,
    hasCurrentJob: true, currentCompany: job.c, currentRole: job.r,
    superpoder: '"Actitud de servicio excepcional y manejo polifuncional de restaurante de cadena"',
    aspiration, budget: "$1'705.905", salaryRange: 'en_rango', currentStage: 'evaluaciones',
    scoringAI: {
      score: Math.round(score * 0.95), status: 'continua',
      resumen: `${name} cumple todos los criterios del perfil. Más de ${expMonths} meses de experiencia certificable en servicio al cliente, disponibilidad completa para turnos rotativos y edad dentro del rango requerido.`,
      noNegociables: [
        { label: 'Mín. 6 meses de experiencia certificada en servicio al cliente', cumple: true },
        { label: 'Edad máx. 33–34 años', cumple: true },
        { label: 'Disponibilidad completa para turnos rotativos (lunes a domingo)', cumple: true },
        { label: 'Experiencia en restaurante de cadena', cumple: true },
      ],
      logros: [`${expMonths} meses de experiencia certificable en servicio al cliente — supera el mínimo`, `Experiencia en restaurante de cadena: ${job.c}`, 'Disponibilidad inmediata confirmada para turnos rotativos'],
      senales: ['Confirmar si tiene manejo de domicilios en plataformas digitales (Rappi, iFood)'],
    },
    prescreeningAI: {
      score: Math.round(score * 0.97), status: 'continua',
      resumen: `${name} confirmó disponibilidad inmediata para turnos rotativos. Demostró actitud de servicio, conocimiento de operación en restaurante y experiencia en manejo de caja y POS. Sin inconsistencias.`,
      noNegociables: [
        { label: 'Mín. 6 meses de experiencia certificada en servicio al cliente', score: score - 1, evidencia: `Confirmó experiencia certificable en ${job.c}. Describió funciones de atención al cliente y manejo de POS.` } as EvalRow,
        { label: 'Disponibilidad completa para turnos rotativos', score: score, evidencia: `Confirma disponibilidad total. Ha trabajado bajo esquema rotativo en empleadores anteriores.` } as EvalRow,
        { label: 'Edad máx. 33–34 años', score: score - 2, evidencia: `Edad confirmada dentro del rango requerido.` } as EvalRow,
        { label: 'Experiencia en restaurante de cadena', score: score - 3, evidencia: `Experiencia directa en cadena de restaurantes. Familiarizado con estándares y protocolos de la operación.` } as EvalRow,
      ],
      plusDetectados: [`Experiencia en múltiples áreas: barra, caja, mesa y domicilios`, `Conocimiento de plataformas de domicilios digitales`, `Actitud proactiva y orientación al servicio evidenciadas`],
      senales: [`Confirmar si tiene manejo de POS específico de la cadena`],
      entornoPersonal: [
        { label: 'Municipio', value: city, status: 'ok' },
        { label: 'Disponibilidad inicio', value: 'Inmediata', status: 'ok' },
        { label: 'Turnos rotativos', value: 'Disponibilidad total L–D', status: 'ok' },
      ],
      experienciaLaboral: [
        { empresa: job.c, rol: job.r, periodo: '2023 – Presente', descripcion: `Servicio al cliente en restaurante de cadena. Manejo de caja, barra y atención en mesa. ${expMonths} meses de experiencia certificable.` },
        { empresa: prevJob.c, rol: prevJob.r, periodo: prevJob.periodo, descripcion: prevJob.desc },
      ],
    },
    psychTest: _psychTransp(score, name),
  };
}

const vigiaEvaluaciones: Candidate[] = [
  _mkVigiaEval('v-e1', 'Gilberto Villamizar',     91, _p(1, 'men'), 'GV', '#8750F6', 'Medellín',  '3 Años', "$1'705.905"),
  _mkVigiaEval('v-e2', 'Tadeo García',            88, _p(2, 'men'), 'TG', '#27BE69', 'Medellín',  '2 Años', "$1'705.905"),
  _mkVigiaEval('v-e3', 'Sebastián Restrepo',      85, _p(3, 'men'), 'SR', '#295BFF', 'Medellín',  '4 Años', "$1'800.000"),
];

export const MOCK_INITIAL_STATUSES: Record<string, Partial<Record<string, Record<string, string>>>> = {
  'mock-mesero': {
    scoring: {
      'mvc-11': 'continua', 'mvc-12': 'continua', 'mvc-13': 'continua',
      'mvc-14': 'por_validar', 'mvc-15': 'por_validar',
      'mvc-16': 'continua', 'mvc-17': 'continua', 'mvc-18': 'continua', 'mvc-19': 'continua', 'mvc-20': 'continua',
    },
    prescreening: {
      'mvc-6': 'continua', 'mvc-7': 'continua',
      'mvc-8': 'por_validar', 'mvc-9': 'por_validar', 'mvc-10': 'descartado',
      'mvc-16': 'por_validar', 'mvc-17': 'por_validar', 'mvc-18': 'por_validar', 'mvc-19': 'por_validar', 'mvc-20': 'por_validar',
    },
    evaluaciones: {
      'v-e1': 'continua',
      'v-e2': 'continua',
      'v-e3': 'por_validar',
    },
  },
  'mock-aux-cocina': {
    scoring: {
      'tp-11': 'continua', 'tp-12': 'continua', 'tp-13': 'continua',
      'tp-14': 'por_validar', 'tp-15': 'por_validar', 'tp-16': 'por_validar',
      'tp-17': 'continua', 'tp-18': 'continua', 'tp-19': 'continua', 'tp-20': 'continua',
    },
    prescreening: {
      'tp-6': 'continua', 'tp-7': 'continua',
      'tp-8': 'por_validar', 'tp-9': 'por_validar', 'tp-10': 'descartado',
      'tp-18': 'por_validar', 'tp-19': 'por_validar', 'tp-20': 'por_validar',
    },
    evaluaciones: {
      'tp-e1': 'continua',
      'tp-e2': 'continua',
      'tp-e3': 'por_validar',
    },
  },
};

export const MOCK_VACANTES: Vacante[] = [
  { id: 'mock-mesero',       jobId: 'mock-mesero',       status: 'activa', title: 'Mesero / Polifuncional',  area: ['Operaciones', 'Servicio al Cliente'], priority: 'alta',  progressLabel: 'Pre-entrevista', progressPct: 25, total: 20, activos: 20, fecha: '28 Abr 2026' },
  { id: 'mock-aux-cocina',   jobId: 'mock-aux-cocina',   status: 'activa', title: 'Auxiliar de Cocina',      area: ['Operaciones', 'Cocina'],              priority: 'alta',  progressLabel: 'Pre-entrevista', progressPct: 10, total: 20, activos: 20, fecha: '03 May 2026' },
];

export const MOCK_DESCRIPTIONS: Record<string, string> = {
  'mock-mesero':
    'Restaurante busca un(a) Mesero/Polifuncional para apoyar los procesos del área operativa en Medellín: barra, atención en mesa, caja y domicilios. Contrato a término indefinido con contratación inmediata al aprobar el proceso. Salario: $1.705.905 + auxilio de transporte + auxilio de alimentación + bonificaciones. Turnos rotativos, de lunes a domingo (sin turno partido).',
  'mock-aux-cocina':
    'Restaurante requiere Auxiliar de Cocina para sus puntos en Bogotá. Apoyo en preparación de alimentos, mantenimiento de estándares de higiene y soporte al equipo de cocina en todos los procesos.',
};

export function getMockPipelineStages(jobId: string): PipelineStage[] {
  const s = (id: string, label: string, badge: string, status: StageStatus, count: number, isAI: boolean): PipelineStage =>
    ({ id, label, stageBadge: badge, status, candidateCount: count, isAI, route: `/pipeline/${jobId}/${id}` });

  // ── Pipeline estándar Restaurantes ──
  // counts: scoring, pre, ent, psicotech, conocimiento, estudios, fin
  const restPipeline = (scoring: number, pre: number, ent: number, psicotech: number, conoc: number, est = 0, fin = 0) => [
    s('scoring',              'Scoring IA',            'Scoring',        scoring > 0   ? (pre > 0       ? 'completed'    : 'in_progress') : 'not_started', scoring,   true),
    s('prescreening',         'Pre-entrevista IA',      'Pre-entrevista', pre > 0       ? (ent > 0       ? 'completed'    : 'in_progress') : 'not_started', pre,       true),
    s('entrevistas',          'Entrevista',              'Entrevista',     ent > 0       ? (psicotech > 0 ? 'completed'    : 'in_progress') : 'not_started', ent,       false),
    s('evaluaciones',         'Prueba Psicométrica',     'Psicométrica',   psicotech > 0 ? (conoc > 0     ? 'completed'    : 'in_progress') : 'not_started', psicotech, false),
    { ...s('prueba_conocimiento', 'Prueba de conocimiento', 'Conocimiento', conoc > 0 ? (est > 0 ? 'completed' : 'in_progress') : 'not_started', conoc, false), forceEnabled: true },
    s('estudios',             'Validaciones',            'Validaciones',   est > 0       ? (fin > 0       ? 'in_progress'  : 'in_progress') : 'not_started', est,       false),
    s('finalistas',           'Aprobados',               'Aprobados',      fin > 0       ? 'in_progress'                                   : 'not_started', fin,       false),
  ];

  switch (jobId) {
    case 'mock-mesero':     return restPipeline(0, 100, 60, 35, 28, 20, 15);
    case 'mock-aux-cocina': return restPipeline(0, 100, 60, 35, 28, 20, 15);
    case 'mock-recep':
      return [
        s('scoring',      'Scoring IA',        'Scoring',       'in_progress', 15, true),
        s('prescreening', 'Pre-entrevista IA',  'Pre screening', 'not_started',       0, true),
        s('entrevistas',  'Entrevistas',        'Entrevistas',   'not_started',       0, false),
        s('evaluaciones', 'Pruebas',            'Pruebas',       'not_started',       0, false),
        s('finalistas',   'Finalistas',         'Finalistas',    'not_started',       0, false),
      ];
    case 'mock-bodega':
      return [
        s('scoring',      'Scoring IA',        'Scoring',       'completed',   20, true),
        s('prescreening', 'Pre-entrevista IA',  'Pre screening', 'in_progress', 15, true),
        s('entrevistas',  'Entrevistas',        'Entrevistas',   'not_started',       0, false),
        s('evaluaciones', 'Pruebas',            'Pruebas',       'not_started',       0, false),
        s('finalistas',   'Finalistas',         'Finalistas',    'not_started',       0, false),
      ];
    case 'mock-th':
      return [
        s('scoring',      'Scoring IA',        'Scoring',       'completed',   30, true),
        s('prescreening', 'Pre-entrevista IA',  'Pre screening', 'completed',   18, true),
        s('entrevistas',  'Entrevistas',        'Entrevistas',   'in_progress', 10, false),
        s('evaluaciones', 'Pruebas',            'Pruebas',       'not_started',       0, false),
        s('finalistas',   'Finalistas',         'Finalistas',    'not_started',       0, false),
      ];
    case 'mock-finanzas':
      return [
        s('scoring',      'Scoring IA',        'Scoring',       'completed',   30, true),
        s('prescreening', 'Pre-entrevista IA',  'Pre screening', 'completed',   20, true),
        s('entrevistas',  'Entrevistas',        'Entrevistas',   'completed',   12, false),
        s('evaluaciones', 'Pruebas',            'Pruebas',       'in_progress',  6, false),
        s('finalistas',   'Finalistas',         'Finalistas',    'not_started',       0, false),
      ];
    case 'mock-ventas':
    default:
      return [
        s('scoring',      'Scoring IA',        'Scoring',       'completed',   50, true),
        s('prescreening', 'Pre-entrevista IA',  'Pre screening', 'completed',   30, true),
        s('entrevistas',  'Entrevistas',        'Entrevistas',   'completed',   25, false),
        s('evaluaciones', 'Pruebas',            'Pruebas',       'completed',   10, false),
        s('finalistas',   'Finalistas',         'Finalistas',    'in_progress',  3, false),
      ];
  }
  const comfStages = getComfandiPipelineStages(jobId);
  if (comfStages) return comfStages;
  return [
    s('scoring',      'Scoring IA',        'Scoring',       'not_started', 0, true),
    s('prescreening', 'Pre-entrevista IA',  'Pre screening', 'not_started', 0, true),
    s('entrevistas',  'Entrevistas',        'Entrevistas',   'not_started', 0, false),
    s('evaluaciones', 'Pruebas',            'Pruebas',       'not_started', 0, false),
    s('finalistas',   'Finalistas',         'Finalistas',    'not_started', 0, false),
  ];
}

// ── PRIMA psychometric test — 2 permutations for restaurant operational candidates ─
// Applied randomly (odd/even index) to any bulk candidate at evaluaciones+ stage.
function _primaTranspA(name: string, score: number): PsychTestResult {
  const s = Math.min(96, Math.max(55, score));
  return {
    score: s,
    insight: `${name} presenta un perfil conductual altamente compatible con la operación de restaurante. Demuestra equilibrio entre orientación al servicio y adherencia a normas de higiene. Alta tolerancia al estrés en horas pico y disciplina en contextos de trabajo en equipo.`,
    fitCards: [
      {
        axis: 'Orientación al servicio y atención al cliente',
        idealScore: 90, candidateScore: s,
        summary: 'Actitud genuina de servicio y empatía con el cliente.',
        detail: 'Anticipa las necesidades del cliente, gestiona quejas con empatía y mantiene actitud positiva en momentos de alta demanda. Perfil ideal para roles de atención en mesa, barra y caja.',
      },
      {
        axis: 'Tolerancia al estrés y trabajo bajo presión',
        idealScore: 85, candidateScore: Math.max(50, s - 4),
        summary: 'Estabilidad emocional en horas pico de servicio.',
        detail: 'Mantiene rendimiento constante durante el servicio de almuerzo y cena con alta concurrencia. Gestiona la presión de múltiples tareas simultáneas sin deterioro del rendimiento.',
      },
      {
        axis: 'Trabajo en equipo y coordinación',
        idealScore: 80, candidateScore: Math.max(50, s - 2),
        summary: 'Colaboración efectiva con el equipo de cocina y sala.',
        detail: 'Opera en coordinación con el equipo, comunica novedades con claridad y apoya a los compañeros en momentos de mayor demanda. La dinámica de equipo en restaurante es determinante para el servicio.',
      },
      {
        axis: 'Orientación a procedimientos e higiene',
        idealScore: 88, candidateScore: Math.max(50, s - 6),
        summary: 'Adherencia a normas BPM y protocolos de inocuidad.',
        detail: 'Cumple rigurosamente con los protocolos de higiene, manipulación de alimentos y estándares operativos del restaurante. Crucial para garantizar la inocuidad alimentaria y la calidad del servicio.',
      },
    ],
    radarPoints: [
      { label: 'Serv. al cliente',  value: s      },
      { label: 'Estrés',            value: s - 4  },
      { label: 'Trab. en equipo',   value: s - 2  },
      { label: 'Procedimientos',    value: s - 6  },
      { label: 'Comunicación',      value: s - 8  },
      { label: 'Responsabilidad',   value: s - 1  },
      { label: 'Adaptabilidad',     value: s - 5  },
    ],
    veredicto: [
      { title: 'Quién es conductualmente', body: `Perfil equilibrado entre orientación al servicio y cumplimiento normativo. Trabaja con disciplina en contextos de alta exigencia operativa y turnos rotativos. Su fortaleza está en la autorregulación emocional, el trabajo en equipo y la actitud de servicio genuina.` },
      { title: 'Fit con este rol', body: `El perfil operativo de restaurante requiere exactamente las competencias más sólidas de este candidato: tolerancia al estrés en horas pico, adherencia a procedimientos de higiene y trabajo en equipo. Se recomienda avanzar en el proceso.` },
    ],
    preguntas: [
      { tag: 'Para: Jefe de Cocina / Sala', question: '"Cuéntame una situación donde tuviste un imprevisto durante el servicio — un pedido equivocado, un cliente difícil o alta demanda — y cómo lo resolviste."', validates: 'Autonomía y gestión de imprevistos bajo presión' },
      { tag: 'Para: RRHH', question: '"¿Cómo manejas los cambios de turno y los días de mayor demanda? ¿Qué rutinas tienes para mantener el rendimiento y la actitud de servicio?"', validates: 'Autogestión y disciplina en turnos rotativos' },
    ],
  };
}

function _primaTranspB(name: string, score: number): PsychTestResult {
  const s = Math.min(72, Math.max(38, score));
  return {
    score: s,
    insight: `${name} presenta un perfil con competencias básicas para el cargo, aunque con algunas áreas de desarrollo en gestión del estrés bajo presión y adherencia a protocolos operativos. Se sugieren validaciones adicionales antes de vinculación.`,
    fitCards: [
      {
        axis: 'Orientación al servicio y atención al cliente',
        idealScore: 90, candidateScore: Math.max(40, s - 8),
        summary: 'Actitud de servicio en desarrollo.',
        detail: 'Conoce los protocolos de atención pero puede mostrar menor proactividad en situaciones de alta presión. Se recomienda reforzar durante la inducción el protocolo de atención al cliente y manejo de quejas.',
      },
      {
        axis: 'Tolerancia al estrés y trabajo bajo presión',
        idealScore: 85, candidateScore: Math.max(35, s - 12),
        summary: 'Estrés moderado en condiciones de alta demanda.',
        detail: 'Puede mostrar deterioro del rendimiento en horas pico prolongadas o ante acumulación de presión. Se recomienda evaluar la rotación de turno y brindar acompañamiento inicial en servicio.',
      },
      {
        axis: 'Trabajo en equipo y coordinación',
        idealScore: 80, candidateScore: Math.max(40, s - 5),
        summary: 'Requiere acompañamiento en coordinación con el equipo.',
        detail: 'En situaciones de alta demanda tiende a trabajar de forma individual en lugar de apoyarse en el equipo. Mejora con experiencia acumulada en el punto de venta específico.',
      },
      {
        axis: 'Orientación a procedimientos e higiene',
        idealScore: 88, candidateScore: Math.max(35, s - 15),
        summary: 'Áreas de mejora en protocolos de higiene y operación.',
        detail: 'El seguimiento de protocolos BPM y estándares de inocuidad presenta inconsistencias bajo presión. Se sugiere acompañamiento durante el primer mes y verificación de cumplimiento en inducción.',
      },
    ],
    radarPoints: [
      { label: 'Serv. al cliente',  value: Math.max(40, s - 8)  },
      { label: 'Estrés',            value: Math.max(35, s - 12) },
      { label: 'Trab. en equipo',   value: Math.max(40, s - 5)  },
      { label: 'Procedimientos',    value: Math.max(35, s - 15) },
      { label: 'Comunicación',      value: Math.max(40, s - 10) },
      { label: 'Responsabilidad',   value: Math.max(40, s - 7)  },
      { label: 'Adaptabilidad',     value: Math.max(38, s - 9)  },
    ],
    veredicto: [
      { title: 'Quién es conductualmente', body: `Perfil con potencial operativo básico pero con limitaciones en la gestión del estrés y el trabajo en equipo bajo alta demanda. Requiere estructura, acompañamiento inicial y un entorno con procedimientos claros para rendir de forma consistente.` },
      { title: 'Fit con este rol', body: `El cargo exige un nivel de orientación al servicio y tolerancia al estrés superior al que evidencia el candidato en esta evaluación. Se recomienda avanzar solo si el equipo puede brindar acompañamiento durante los primeros turnos de servicio.` },
    ],
    preguntas: [
      { tag: 'Para: Jefe de Operaciones', question: '"¿Cómo actúas cuando la ruta asignada tiene cambios de último minuto o el vehículo presenta una falla menor? Dame un ejemplo concreto."', validates: 'Capacidad de respuesta autónoma ante imprevistos' },
      { tag: 'Para: RRHH', question: '"Cuéntame un momento en que sentiste mucha presión en el trabajo. ¿Qué pasó y cómo lo manejaste?"', validates: 'Gestión del estrés y resiliencia operativa' },
    ],
  };
}

// ── Bulk candidate generator for funnel demo ──────────────────────────────────
// Generates lightweight placeholder candidates to fill realistic funnel counts.
const _BULK_NAMES: [string, string][] = [
  ['Alexánder','Rincón'],['Bernardo','Silva'],['Camilo','Pedraza'],['Daniel','Quiroga'],
  ['Edgardo','Fuentes'],['Fernando','Cano'],['Gerardo','Pinto'],['Harold','Castro'],
  ['Ignacio','Toro'],['Jorge','Melo'],['Kevin','Buitrago'],['Leonardo','Crespo'],
  ['Manuel','Acosta'],['Norberto','Zapata'],['Orlando','Mora'],['Patricio','Jiménez'],
  ['Quintín','Ospino'],['Rafael','Delgado'],['Saúl','Arango'],['Teodoro','Palomino'],
  ['Ubaldo','Escobar'],['Víctor','Trujillo'],['William','Padilla'],['Yamid','Cifuentes'],
  ['Zairo','Becerra'],['Álvaro','Quintana'],['Édgar','Solano'],['Félix','Mejías'],
  ['Gonzalo','Vega'],['Horacio','Sandoval'],['Ismael','Restrepo'],['Javier','Guevara'],
  ['Laureano','Navarro'],['Lorenzo','Pacheco'],['Misael','Oñate'],['Néstor','Ibáñez'],
  ['Óscar','Aguilar'],['Pedro','Blanco'],['Rubén','Tafur'],['Simón','Camargo'],
  ['Tomás','Alvarado'],['Uriel','Benítez'],['Walter','Romero'],['Yamil','Flórez'],
  ['Abel','Murillo'],['Benito','Salazar'],['Celio','Torres'],['Dario','Peñaloza'],
  ['Efraín','Londoño'],['Franklin','Ramírez'],['Gilberto','Villamizar'],['Hernando','Ávila'],
  ['Iván','Guerrero'],['Julio','Holguín'],['Kléber','Fandiño'],['Lorenzo','Serrano'],
  ['Manuel','Pinzón'],['Nomar','Gutiérrez'],['Octavio','Franco'],['Porfirio','Castaño'],
  ['Rodolfo','Parra'],['Santiago','Peña'],['Tadeo','García'],['Uriel','Cárdenas'],
  ['Valentín','Suárez'],['Wilson','Lozano'],['Xavier','Gil'],['Yonier','Rojas'],
  ['Alfonso','Forero'],['Brayan','Muñoz'],['César','Vargas'],['David','Mendoza'],
  ['Emilio','Morales'],['Fernando','Torres'],['Guillermo','López'],['Hernán','Cruz'],
];
const _BULK_COMPANIES = [
  'Crepes & Waffles','El Corral','Frisby S.A.S.','Presto Colombia','McDonald\'s Colombia',
  'Subway Colombia','Pizza Hut Colombia','Domino\'s Pizza','Kokoriko S.A.S.','Archie\'s Colombia',
  'Wok Restaurant','Andrés Carne de Res','La Hamburguesería','Juan Valdez Café','Tostao\'',
  'OMA Coffee','Starbucks Colombia','Éxito Bakery','Carulla Deli','PPC Pollo Perú Colombia',
];
const _BULK_ROLES_PREV = [
  'Auxiliar de Cocina','Mesero / Polifuncional','Crew Member / Cocina','Auxiliar de Producción',
  'Sandwich Artist','Asistente de Cocina','Cocinero de Línea','Auxiliar de Servicios Generales',
  'Cajero / Mesero','Auxiliar de Bar','Operario de Alimentos','Asistente de Restaurante',
];
const _BULK_LOGROS = [
  ['Cumplimiento de estándares de higiene HACCP durante toda la operación','Disponibilidad inmediata para turnos rotativos lunes a domingo'],
  ['Experiencia certificable en restaurante de cadena','Conocimiento de normas BPM e inocuidad alimentaria'],
  ['Manejo de múltiples estaciones: cocina fría, caliente y mise en place','Turno rotativo sin ausentismo en último año'],
  ['Carné de manipulación de alimentos vigente','Capacitación en manejo de equipos industriales de cocina'],
  ['Experiencia en preparación de alimentos y control de porciones','Conocimiento de rotación PEPS y control de inventario'],
];
const _BULK_SIGNALS_NEG = [
  ['Sin certificación de experiencia verificada aún','Aspiración salarial pendiente de confirmación'],
  ['Dirección de residencia fuera del área de los puntos'],
  ['Carné de manipulación de alimentos no confirmado'],
  ['Referencias laborales pendientes de contacto'],
];

// ── Knowledge test mock generator ─────────────────────────────────────────────
const KNOWLEDGE_QUESTIONS_BANK: Omit<KnowledgeQuestion, 'id' | 'isCorrect' | 'selectedAnswer'>[] = [
  // Higiene y Manipulación de Alimentos
  { category: 'Higiene y Manipulación de Alimentos', question: '¿Cuál es la temperatura mínima de cocción interna recomendada para pollo y aves?', correctAnswer: '74 °C (165 °F)' },
  { category: 'Higiene y Manipulación de Alimentos', question: '¿Qué significa la sigla HACCP?', correctAnswer: 'Análisis de Peligros y Puntos Críticos de Control (Hazard Analysis and Critical Control Points)' },
  { category: 'Higiene y Manipulación de Alimentos', question: '¿Cuál es el rango de temperatura de la "zona de peligro" para los alimentos?', correctAnswer: 'Entre 4 °C y 60 °C' },
  { category: 'Higiene y Manipulación de Alimentos', question: '¿Con qué frecuencia mínima debe lavarse las manos el personal de cocina durante el turno?', correctAnswer: 'Antes de manipular alimentos, después de tocar superficies contaminadas y cada vez que sea necesario' },
  { category: 'Higiene y Manipulación de Alimentos', question: '¿Qué es la contaminación cruzada?', correctAnswer: 'Transferencia de microorganismos de un alimento o superficie contaminada a otro alimento o superficie limpia' },
  { category: 'Higiene y Manipulación de Alimentos', question: '¿Cuál es la temperatura máxima de almacenamiento para alimentos refrigerados?', correctAnswer: '4 °C o menos' },
  { category: 'Higiene y Manipulación de Alimentos', question: '¿Qué significa BPM en el contexto de la industria de alimentos?', correctAnswer: 'Buenas Prácticas de Manufactura' },
  // Operación de Cocina
  { category: 'Operación de Cocina', question: '¿Qué es el "mise en place" en cocina profesional?', correctAnswer: 'Preparación y organización previa de todos los ingredientes y utensilios necesarios antes del servicio' },
  { category: 'Operación de Cocina', question: '¿Qué significa el sistema PEPS en el manejo de inventario de alimentos?', correctAnswer: 'Primero en Entrar, Primero en Salir — los alimentos más antiguos se utilizan primero' },
  { category: 'Operación de Cocina', question: '¿Cuál es la temperatura correcta del aceite para freír a temperatura estándar?', correctAnswer: 'Entre 170 °C y 180 °C' },
  { category: 'Operación de Cocina', question: '¿Qué color de tabla de cortar se usa típicamente para carnes rojas crudas?', correctAnswer: 'Rojo' },
  { category: 'Operación de Cocina', question: '¿Qué acción se debe tomar si se detecta un producto con fecha de vencimiento expirada?', correctAnswer: 'Retirar el producto inmediatamente, segregarlo y notificar al encargado para registrar la baja' },
  // Servicio al Cliente
  { category: 'Servicio al Cliente', question: '¿Cuál es el protocolo correcto cuando un cliente reporta una alergia alimentaria?', correctAnswer: 'Escuchar con atención, consultar los ingredientes exactos con cocina y confirmar por escrito antes de servir' },
  { category: 'Servicio al Cliente', question: '¿Qué se entiende por "upselling" en un restaurante?', correctAnswer: 'Sugerir al cliente productos complementarios o de mayor valor para mejorar su experiencia y aumentar el ticket' },
  { category: 'Servicio al Cliente', question: '¿Qué se debe hacer si un cliente se queja de que su plato llegó frío?', correctAnswer: 'Disculparse sinceramente, retirar el plato y devolver al cliente uno nuevo en la temperatura correcta' },
  { category: 'Servicio al Cliente', question: '¿Cuál es el tiempo de respuesta ideal para atender a un cliente recién sentado?', correctAnswer: 'Menos de 3 minutos para el primer contacto (bienvenida y oferta de bebidas)' },
  { category: 'Servicio al Cliente', question: '¿Qué es el ciclo de servicio completo en un restaurante?', correctAnswer: 'Bienvenida, acomodo, toma de pedido, entrega de alimentos, seguimiento en mesa y cierre de cuenta' },
  // Caja y Manejo de Dinero
  { category: 'Caja y Manejo de Dinero', question: '¿Qué debe hacerse al final del turno si la caja presenta una diferencia positiva (sobrante)?', correctAnswer: 'Reportar la diferencia al supervisor, no retener el dinero, y registrar la novedad en el cuadre' },
  { category: 'Caja y Manejo de Dinero', question: '¿Qué es un POS en el contexto de un restaurante?', correctAnswer: 'Point of Sale — sistema de punto de venta para registrar pedidos y cobrar a los clientes' },
  { category: 'Caja y Manejo de Dinero', question: '¿Cuál es el procedimiento correcto cuando un cliente paga con un billete de alta denominación?', correctAnswer: 'Verificar la autenticidad del billete, confirmar el valor en voz alta al cliente y dar el vuelto exacto contando delante del cliente' },
  { category: 'Caja y Manejo de Dinero', question: '¿Qué significa una transacción "reverso" en el sistema POS?', correctAnswer: 'Cancelación de un cobro ya realizado, que requiere autorización del supervisor' },
  // Normas Laborales
  { category: 'Normas Laborales', question: '¿Cuántos días de vacaciones le corresponden a un empleado por año en Colombia?', correctAnswer: '15 días hábiles por año trabajado' },
  { category: 'Normas Laborales', question: '¿Cuál es el recargo mínimo sobre el salario ordinario por trabajo nocturno en Colombia (entre 9 p.m. y 6 a.m.)?', correctAnswer: '35% adicional sobre el valor de la hora diurna' },
  { category: 'Normas Laborales', question: '¿Qué obligación tiene el empleador con respecto al carné de manipulación de alimentos?', correctAnswer: 'Exigir que todos los manipuladores de alimentos lo tengan vigente, y apoyar su obtención si es necesario' },
  { category: 'Normas Laborales', question: '¿Qué es el auxilio de transporte y a quiénes aplica en Colombia?', correctAnswer: 'Beneficio económico para empleados que devenguen hasta dos salarios mínimos y deban desplazarse al lugar de trabajo' },
];

const WRONG_ANSWERS: Record<string, string> = {
  '¿Cuál es la temperatura mínima de cocción interna recomendada para pollo y aves?': '65 °C (150 °F)',
  '¿Cuál es el rango de temperatura de la "zona de peligro" para los alimentos?': 'Entre 10 °C y 50 °C',
  '¿Qué acción se debe tomar si se detecta un producto con fecha de vencimiento expirada?': 'Usarlo primero antes que los productos frescos para no desperdiciar',
  '¿Cuál es el tiempo de respuesta ideal para atender a un cliente recién sentado?': 'Menos de 10 minutos para el primer contacto',
  '¿Cuántos días de vacaciones le corresponden a un empleado por año en Colombia?': '30 días calendario por año trabajado',
};

function _mkKnowledgeTest(name: string, hiScore: boolean, seed: number): KnowledgeTestResult {
  const wrongIndices = hiScore
    ? [4, 15, 21, 22]   // 4 wrong → 21/25 = 84
    : [4, 7, 10, 13, 15, 18, 21, 22, 23];  // 9 wrong → 16/25 = 64

  const questions: KnowledgeQuestion[] = KNOWLEDGE_QUESTIONS_BANK.map((q, i) => {
    const isWrong = wrongIndices.includes(i);
    const wrongAns = WRONG_ANSWERS[q.question] ?? 'No lo sabe con certeza';
    return {
      id: i + 1,
      category: q.category,
      question: q.question,
      selectedAnswer: isWrong ? wrongAns : q.correctAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect: !isWrong,
    };
  });

  const correct = questions.filter((q) => q.isCorrect).length;
  const incorrect = questions.length - correct;
  const score = Math.round((correct / questions.length) * 100);

  const hiObs = `${name} demostró buen dominio de higiene y manipulación de alimentos, operación de cocina y servicio al cliente. Presentó dificultades puntuales en normas laborales y manejo de caja. Desempeño consistente con perfil de candidato experimentado en el sector gastronómico. Se recomienda avanzar.`;
  const loObs = `${name} mostró conocimientos básicos de manipulación de alimentos y servicio, pero presenta vacíos significativos en operación de cocina, normas HACCP y manejo de caja. Se recomienda refuerzo en inducción antes de asignar turno en punto de venta. Avanzar con reservas.`;

  const day = 10 + (seed % 15);
  const month = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'][seed % 6];

  return {
    score,
    totalQuestions: questions.length,
    correct,
    incorrect,
    observations: hiScore ? hiObs : loObs,
    externalUrl: 'https://forms.gle/mock-prueba-conocimiento',
    completedAt: `${day} ${month} 2026 — 09:${String(30 + (seed % 20)).padStart(2, '0')} a.m.`,
    questions,
  };
}

function _mkBulk(
  prefix: string,
  role: string,
  sector: string,
  stage: PipelineStageKey,
  count: number,
  startIdx: number,
  scoreRange: [number, number],
): Candidate[] {
  const colors = ['#8750F6','#27BE69','#295BFF','#F6A350','#F65078'];
  const cities = ['Bogotá','Soacha','Bogotá','Bogotá','Chía','Bogotá','Funza','Mosquera','Madrid','Cota','Bogotá','Bogotá'];
  const salaries: [string, SalaryRange][] = [
    ["$1'423.500",'en_rango'],["$1'500.000",'en_rango'],["$1'600.000",'en_rango'],
    ["$1'705.905",'en_rango'],["$1'800.000",'en_rango'],["$2'200.000",'fuera_de_rango'],
  ];
  const hasPre = stage !== 'scoring';
  return Array.from({ length: count }, (_, i) => {
    const idx = startIdx + i;
    const nameArr = _BULK_NAMES[idx % _BULK_NAMES.length] ?? ['Candidato','Demo'];
    const name = `${nameArr[0]} ${nameArr[1]}`;
    const score = Math.max(22, Math.min(97, scoreRange[0] + Math.round(Math.abs(Math.sin(idx * 4.7 + 2.3)) * (scoreRange[1] - scoreRange[0]))));
    const color = colors[idx % colors.length]!;
    const city  = cities[idx % cities.length]!;
    const yrs   = 2 + (idx % 9);
    const [salary, salaryRange] = salaries[idx % salaries.length]!;
    const initials = `${nameArr[0]?.[0] ?? 'C'}${nameArr[1]?.[0] ?? 'C'}`;
    const company   = _BULK_COMPANIES[idx % _BULK_COMPANIES.length]!;
    const prevRole  = _BULK_ROLES_PREV[idx % _BULK_ROLES_PREV.length]!;
    const prevYrs   = Math.max(1, yrs - 1);
    // Scenario: high scores continue, mid scores are pending, low scores discarded
    const preStatus: 'continua' | 'pendiente' | 'rechazado' =
      score >= 68 ? 'continua' : score >= 45 ? 'pendiente' : 'rechazado';
    const logros  = _BULK_LOGROS[idx % _BULK_LOGROS.length] ?? [];
    const senales = score < 60 ? (_BULK_SIGNALS_NEG[idx % _BULK_SIGNALS_NEG.length] ?? []) : [];
    const hasCV   = idx % 4 !== 0; // ~25% built via WhatsApp, no uploaded résumé

    // ── Prescreening progress ──────────────────────────────────────────────
    const _failReasons = [
      'La experiencia en cocina o manipulación de alimentos requerida no fue identificada en la HV.',
      'La HV no acredita mínimo 6 meses de experiencia certificable en el sector gastronómico.',
      'Los meses de experiencia no alcanzan el mínimo requerido para el cargo.',
      'La HV no refleja tiempo mínimo en el último cargo registrado.',
    ];
    // All prescreening candidates have a HV (PDF upload or WhatsApp builder) — no 'not_available'
    const _rvStatus: ResumeValidationStatus =
      preStatus === 'rechazado' ? (idx % 5 === 0 ? 'pending' : 'failed')
      : preStatus === 'pendiente' ? (idx % 12 === 0 ? 'pending' : 'passed')
      : 'passed';
    const _matchedCriteria =
      _rvStatus === 'passed' ? (preStatus === 'continua' ? 5 + (idx % 2) : 5)
      : _rvStatus === 'failed' ? (1 + (idx % 3))
      : undefined;
    const _waStatus: WaPrescreeningStatus =
      _rvStatus !== 'passed' ? 'not_started'
      : preStatus === 'continua' ? 'completed'
      : (idx % 8 === 0 ? 'not_started' : 'in_progress');
    const _prescreeningProgress: PrescreeningProgress = {
      resumeValidation: {
        status: _rvStatus,
        validatedAt: (_rvStatus === 'passed' || _rvStatus === 'failed') ? '2026-06-15' : undefined,
        matchedCriteria: _matchedCriteria,
        totalCriteria: _rvStatus !== 'not_available' ? 6 : undefined,
        failReason: _rvStatus === 'failed' ? (_failReasons[idx % _failReasons.length] ?? _failReasons[0]) : undefined,
      },
      whatsappPrescreening: { status: _waStatus },
    };

    return {
      id: `${prefix}-blk-${idx}`,
      name,
      role,
      sector,
      years: `${yrs} Año${yrs !== 1 ? 's' : ''}`,
      location: `${city}, Colombia`,
      bio: `Candidato con ${yrs} años de experiencia en el sector gastronómico. Incluye ${prevYrs} años en ${company} como ${prevRole}. Disponibilidad para turnos rotativos lunes a domingo.`,
      score,
      photo: _p(idx % 35, 'men'),
      avatarInitials: initials,
      avatarColor: color,
      hasCurrentJob: score >= 58,
      currentCompany: score >= 58 ? company : undefined,
      currentRole:    score >= 58 ? prevRole : undefined,
      lastCompany:    score < 58 ? company : undefined,
      lastRole:       score < 58 ? prevRole : undefined,
      superpoder: `"${yrs} años conduciendo C2 — cero incidentes"`,
      aspiration: salary,
      budget:     salary,
      salaryRange,
      currentStage: stage,
      hasCV,
      prescreeningProgress: _prescreeningProgress,
      // Prueba Psicométrica: 2 PRIMA permutations, applied for evaluaciones+ stages
      psychTest: (['evaluaciones','prueba_conocimiento','estudios','finalistas'] as PipelineStageKey[]).includes(stage)
        ? (idx % 2 === 0 ? _primaTranspA(name, score) : _primaTranspB(name, score))
        : undefined,
      // Prueba de conocimiento: applied for prueba_conocimiento+ stages
      knowledgeTest: (['prueba_conocimiento','estudios','finalistas'] as PipelineStageKey[]).includes(stage)
        ? _mkKnowledgeTest(name, score >= 65, idx)
        : undefined,
      // Interview verdict: score-based for entrevistas/evaluaciones/estudios/finalistas
      // ≥78 = Apto (top ~8), 62–77 = Apto con reservas (~7), <62 = No apto (rest)
      veredictoEntrevista: (['entrevistas','evaluaciones','prueba_conocimiento','estudios','finalistas'] as PipelineStageKey[]).includes(stage)
        ? (score >= 78 ? 'apto' : score >= 62 ? 'apto_reservas' : 'no_apto')
        : undefined,
      scoringAI: {
        score: Math.round(score * 0.96),
        status: score >= 60 ? 'continua' : score >= 40 ? 'pendiente' : 'rechazado',
        resumen: score >= 68
          ? `${name} demuestra un perfil sólido para el cargo. ${yrs} años de experiencia certificable en el sector gastronómico en empresas como ${company}. Disponibilidad para turnos rotativos confirmada.`
          : score >= 45
          ? `${name} cumple los requisitos mínimos. Experiencia de ${yrs} años en el sector, aunque requiere validación de certificación con empleador. Se recomienda validar referencias.`
          : `${name} no supera los criterios mínimos del perfil. Experiencia insuficiente o aspiración salarial fuera de rango. Se sugiere descartar en esta convocatoria.`,
        noNegociables: [],
        logros,
        senales,
      },
      prescreeningAI: hasPre ? {
        score: Math.round(score * 0.97),
        status: preStatus,
        resumen: preStatus === 'continua'
          ? `${name} confirmó experiencia certificable en el sector gastronómico y disponibilidad para turnos rotativos lunes a domingo. Perfil alineado con los requisitos del cargo.`
          : preStatus === 'pendiente'
          ? `${name} cumple parcialmente los requisitos. Se validaron ${yrs} años de experiencia en el sector, pero la certificación con empleador y disponibilidad de turnos requieren confirmación adicional.`
          : `${name} no cumple los criterios mínimos del proceso. Experiencia insuficiente o aspiración salarial fuera del rango establecido para el cargo.`,
        noNegociables: [],
        plusDetectados: preStatus === 'continua' ? logros.slice(0,1) : [],
        senales: preStatus !== 'continua' ? senales : [],
        entornoPersonal: [
          { label: 'Disponibilidad inicio', value: 'Inmediata', status: 'ok' },
          { label: 'Residencia', value: city, status: city === 'Barranquilla' || city === 'Cali' || city === 'Medellín' ? 'warning' : 'ok' },
          { label: 'Turnos rotativos', value: `${yrs} años exp. sector`, status: yrs >= 1 ? 'ok' : 'warning' },
        ],
        experienciaLaboral: [
          { empresa: company, rol: prevRole, periodo: `${2026 - yrs} – Presente`, descripcion: `Operación en restaurante de cadena con ${company}. Experiencia en preparación de alimentos, higiene y atención al cliente.` },
        ],
      } : undefined,
    };
  });
}

// ── Bulk arrays per vacancy ────────────────────────────────────────────────────
// Funnel: prescreening=100, entrevistas=60, evaluaciones=40, prueba_conocimiento=35, estudios=20, finalistas=15
// Each vacancy uses a different startIdx offset (0, 500, 1000) to avoid name collisions.

// ── Bulk arrays per vacancy (non-overlapping, indexed to avoid name collisions) ─
// Funnel target: prescreening≈100, entrevistas≈60, evaluaciones≈40, prueba_conocimiento≈35, estudios≈20, finalistas≈15
// Funnel: pre=100, entrev=60(5+55bulk), eval=35(3+32bulk), conoc=28(28bulk), est=20, fin=15
// StartIdx blocks (non-overlapping): d=0..270, tp=500..772, vc=1000..1272

// mock-aux-cocina (detailed)
const distribBulkPre   = _mkBulk('d','Auxiliar de Cocina','Gastronomía / Restaurantes','prescreening',        85,   0, [28,94]);
const distribBulkEntrev= _mkBulk('d','Auxiliar de Cocina','Gastronomía / Restaurantes','entrevistas',          58,  85, [42,92]);
const distribBulkEval  = _mkBulk('d','Auxiliar de Cocina','Gastronomía / Restaurantes','evaluaciones',         32, 143, [58,93]);
const distribBulkConoc = _mkBulk('d','Auxiliar de Cocina','Gastronomía / Restaurantes','prueba_conocimiento',  28, 175, [62,93]);
const distribBulkEstud = _mkBulk('d','Auxiliar de Cocina','Gastronomía / Restaurantes','estudios',             20, 203, [65,94]);
const distribBulkFinal = _mkBulk('d','Auxiliar de Cocina','Gastronomía / Restaurantes','finalistas',           15, 223, [72,96]);

// tpBulk used for secondary aux-cocina candidates
const tpBulkPre    = _mkBulk('tp','Auxiliar de Cocina','Gastronomía / Restaurantes','prescreening',       85, 500, [28,94]);
const tpBulkEntrev = _mkBulk('tp','Auxiliar de Cocina','Gastronomía / Restaurantes','entrevistas',         58, 585, [42,92]);
const tpBulkEval   = _mkBulk('tp','Auxiliar de Cocina','Gastronomía / Restaurantes','evaluaciones',        32, 643, [58,93]);
const tpBulkConoc  = _mkBulk('tp','Auxiliar de Cocina','Gastronomía / Restaurantes','prueba_conocimiento', 28, 675, [62,93]);
const tpBulkEstud  = _mkBulk('tp','Auxiliar de Cocina','Gastronomía / Restaurantes','estudios',            20, 703, [65,94]);
const tpBulkFinal  = _mkBulk('tp','Auxiliar de Cocina','Gastronomía / Restaurantes','finalistas',          15, 723, [72,96]);

// mock-mesero (detailed: pre=15, entrev=13, eval=3)
const vigiaBulkPre    = _mkBulk('vc','Mesero / Polifuncional','Gastronomía / Restaurantes','prescreening',       85,1000, [28,94]);
const vigiaBulkEntrev = _mkBulk('vc','Mesero / Polifuncional','Gastronomía / Restaurantes','entrevistas',         58,1085, [42,92]);
const vigiaBulkEval   = _mkBulk('vc','Mesero / Polifuncional','Gastronomía / Restaurantes','evaluaciones',        32,1143, [58,93]);
const vigiaBulkConoc  = _mkBulk('vc','Mesero / Polifuncional','Gastronomía / Restaurantes','prueba_conocimiento', 28,1175, [62,93]);
const vigiaBulkEstud  = _mkBulk('vc','Mesero / Polifuncional','Gastronomía / Restaurantes','estudios',            20,1203, [65,94]);
const vigiaBulkFinal  = _mkBulk('vc','Mesero / Polifuncional','Gastronomía / Restaurantes','finalistas',          15,1223, [72,96]);

export const mockCandidatesByStage: Record<string, Partial<Record<string, Candidate[]>>> = {
  // Each stage contains ONLY its own candidates — no cross-stage duplicates.
  // Funnel: pre=100, entrev=60, eval=35, conoc=28, est=20, fin=15
  'mock-aux-cocina': {
    scoring:              [...transpPubScoring],
    prescreening:         [...transpPubPrescreening, ...tpBulkPre],          // 100
    entrevistas:          [...transpPubEntrevistas, ...tpBulkEntrev],        //  60 (5+55)
    evaluaciones:         [...transpPubEvaluaciones, ...tpBulkEval],         //  35 (3+32)
    prueba_conocimiento:  [...tpBulkConoc],                                  //  28
    estudios:             [...tpBulkEstud],                                  //  20
    finalistas:           [...transpPubEntrevistas.slice(0,2), ...tpBulkFinal], // 15
  },
  'mock-mesero': {
    scoring:              [...vigiaScoring],
    prescreening:         [...vigiaPrescreening, ...vigiaBulkPre],           // 100
    entrevistas:          [...vigiaEntrevistas, ...vigiaBulkEntrev],         //  60 (13+47)
    evaluaciones:         [...vigiaEvaluaciones, ...vigiaBulkEval],          //  35 (3+32)
    prueba_conocimiento:  [...vigiaBulkConoc],                               //  28
    estudios:             [...vigiaBulkEstud],                               //  20
    finalistas:           [...vigiaEntrevistas.slice(0,2), ...vigiaBulkFinal], // 15
  },
  'mock-recep':    { scoring: recepCandidates },
  'mock-bodega':   { scoring: [...bodegaPreCandidates, ...bodegaScoreOnly], prescreening: bodegaPreCandidates },
  'mock-th':       { scoring: [...thEntrevistasCandidates, ...thPreCandidates, ...thScoreOnly], prescreening: [...thEntrevistasCandidates, ...thPreCandidates], entrevistas: thEntrevistasCandidates },
  'mock-finanzas': { scoring: [...finEvalCandidates, ...finEntrevistasCandidates, ...finPreCandidates, ...finScoreOnly], prescreening: [...finEvalCandidates, ...finEntrevistasCandidates, ...finPreCandidates], entrevistas: [...finEvalCandidates, ...finEntrevistasCandidates], evaluaciones: finEvalCandidates },
  'mock-ventas':   { scoring: [...venFinalistCandidates, ...venEvalCandidates, ...venEntrevistasCandidates, ...venPreCandidates, ...venScoreOnly], prescreening: [...venFinalistCandidates, ...venEvalCandidates, ...venEntrevistasCandidates, ...venPreCandidates], entrevistas: [...venFinalistCandidates, ...venEvalCandidates, ...venEntrevistasCandidates], evaluaciones: [...venFinalistCandidates, ...venEvalCandidates] },
  ...COMFANDI_CANDIDATES_BY_STAGE,
};

export const mockCandidatesById: Record<string, Candidate> = [
  ...transpPubEvaluaciones,
  ...transpPubCandidates,
  ...vigiaEvaluaciones,
  ...vigiaCandidates,
  ...distribEvaluaciones,
  ...distribCandidates,
  // Bulk arrays (restaurant vacancies, all stages)
  ...distribBulkPre, ...distribBulkEntrev, ...distribBulkEval, ...distribBulkConoc, ...distribBulkEstud, ...distribBulkFinal,
  ...tpBulkPre, ...tpBulkEntrev, ...tpBulkEval, ...tpBulkConoc, ...tpBulkEstud, ...tpBulkFinal,
  ...vigiaBulkPre, ...vigiaBulkEntrev, ...vigiaBulkEval, ...vigiaBulkConoc, ...vigiaBulkEstud, ...vigiaBulkFinal,
  ...recepCandidates,
  ...bodegaPreCandidates, ...bodegaScoreOnly,
  ...thEntrevistasCandidates, ...thPreCandidates, ...thScoreOnly,
  ...finEvalCandidates, ...finEntrevistasCandidates, ...finPreCandidates, ...finScoreOnly,
  ...venFinalistCandidates, ...venEvalCandidates, ...venEntrevistasCandidates, ...venPreCandidates, ...venScoreOnly,
  ...COMFANDI_ALL_CANDIDATES,
].reduce<Record<string, Candidate>>((acc, c) => { acc[c.id] = c; return acc; }, {});

// ─── Mock Tech Test Feedback ──────────────────────────────────────────────────
// Pre-seeded into localStorage by useCandidateDetail when candidate is loaded.
export const mockTechFeedback: Record<string, TechTestFeedback> = {
  // Auxiliar de Cocina — Prueba técnica: manipulación de alimentos e higiene
  'tp-e1': { ratings: { dominio: 5, resolucion: 5, calidad: 5, comunicacion: 4, iniciativa: 5 }, destacados: 'Demostró dominio completo de las normas de higiene y manipulación de alimentos. Identificó correctamente los puntos críticos de control de temperatura para alimentos fríos y calientes. Respondió adecuadamente ante el caso simulado de contaminación cruzada.', senalAlerta: 'El tiempo de respuesta en el protocolo de limpieza fue ligeramente lento; reforzar en inducción operativa.', recomendacion: 'avanzar', files: [] },
  'tp-e2': { ratings: { dominio: 5, resolucion: 4, calidad: 4, comunicacion: 5, iniciativa: 4 }, destacados: 'Excelente conocimiento de técnicas de mise en place y preparación de ingredientes. Manejó el caso de ingrediente vencido de forma autónoma y siguió el protocolo correcto de descarte y registro. Actitud colaborativa con el equipo de cocina destacable.', senalAlerta: 'La organización de la estación de trabajo tomó más tiempo del estándar; agilizar con práctica durante el período de inducción.', recomendacion: 'avanzar', files: [] },
  'tp-e3': { ratings: { dominio: 4, resolucion: 4, calidad: 4, comunicacion: 4, iniciativa: 4 }, destacados: 'Buen dominio de los protocolos de higiene de cocina y uso correcto de EPP. Conocimiento correcto del sistema de rotación PEPS (primero en entrar, primero en salir). Disposición para el trabajo físico bajo presión en horas pico.', senalAlerta: 'Menor fluidez en el manejo del caso de avería del equipo de frío; reforzar procedimiento de reporte en inducción.', recomendacion: 'avanzar_reservas', files: [] },
  // Mesero / Polifuncional — Prueba práctica: servicio en mesa y manejo de POS
  'd-e1': { ratings: { dominio: 5, resolucion: 5, calidad: 5, comunicacion: 5, iniciativa: 4 }, destacados: 'Demostró excelente protocolo de servicio en mesa y manejo ágil del POS. Resolvió el caso de queja del cliente con empatía y protocolo correcto. Tiempo de respuesta al llamado de la mesa dentro del estándar del restaurante.', senalAlerta: 'El tiempo de cierre de caja fue ligeramente superior al estándar; reforzar en inducción con el sistema específico del punto.', recomendacion: 'avanzar', files: [] },
  'd-e2': { ratings: { dominio: 5, resolucion: 4, calidad: 4, comunicacion: 5, iniciativa: 4 }, destacados: 'Muy buen dominio del flujo de servicio: bienvenida, toma de pedido, entrega y cierre. Resolvió el caso de pedido incorrecto siguiendo el protocolo correcto. Actitud de servicio al cliente destacada durante la simulación.', senalAlerta: 'El conocimiento de la carta fue básico; requiere período de aprendizaje de los productos del menú.', recomendacion: 'avanzar', files: [] },
  'd-e3': { ratings: { dominio: 4, resolucion: 4, calidad: 4, comunicacion: 4, iniciativa: 4 }, destacados: 'Buen manejo del protocolo de servicio y manejo de caja. Conocimiento correcto de los procedimientos de apertura y cierre del turno. Disposición para la rotación entre barra, mesa y domicilios.', senalAlerta: 'El caso de manejo de cliente difícil fue menos ágil; reforzar protocolo de escalamiento en inducción.', recomendacion: 'avanzar_reservas', files: [] },
  // Mesero / Polifuncional (Vigía) — Prueba práctica: atención en mesa y POS
  'v-e1': { ratings: { dominio: 5, resolucion: 5, calidad: 5, comunicacion: 4, iniciativa: 5 }, destacados: 'Protocolo de servicio excepcional. Manejó el caso de cliente con alergia alimentaria correctamente: consultó ingredientes, confirmó con cocina y comunicó de forma clara. Tiempo de atención a la mesa dentro del estándar de la cadena.', senalAlerta: 'El tiempo de registro del pedido en POS fue correcto pero puede optimizarse con práctica en el sistema específico.', recomendacion: 'avanzar', files: [] },
  'v-e2': { ratings: { dominio: 5, resolucion: 4, calidad: 5, comunicacion: 4, iniciativa: 4 }, destacados: 'Excelente manejo de la situación de error en pedido. Siguió el protocolo de disculpa, corrección y compensación de forma natural y sin afectar la experiencia del cliente. Conocimiento sólido de técnicas de upselling.', senalAlerta: 'La comunicación con cocina en hora pico fue básica; reforzar uso del sistema de comandas en inducción.', recomendacion: 'avanzar', files: [] },
  'v-e3': { ratings: { dominio: 4, resolucion: 4, calidad: 4, comunicacion: 4, iniciativa: 4 }, destacados: 'Buen manejo del flujo de servicio completo. Conocimiento del menú suficiente para el período de inducción. Actitud positiva y disposición para trabajar en equipo bajo presión de servicio.', senalAlerta: 'El manejo del caso de queja del cliente fue correcto pero algo formal; practicar empatía y naturalidad en la respuesta.', recomendacion: 'avanzar_reservas', files: [] },
  // Finanzas: 3 de 6 respondieron la prueba técnica
  'mfin-1': { ratings: { dominio: 5, resolucion: 5, calidad: 5, comunicacion: 4, iniciativa: 4 }, destacados: 'Dominio profundo de análisis financiero y costeo industrial. Resolvió el caso de presupuesto con precisión metodológica, identificando desviaciones clave y proponiendo acciones correctivas concretas con sustento cuantitativo.', senalAlerta: 'El análisis de escenarios fue conservador; en situaciones de alta incertidumbre podría limitarse a lo conocido.', recomendacion: 'avanzar', files: [] },
  'mfin-2': { ratings: { dominio: 5, resolucion: 4, calidad: 5, comunicacion: 5, iniciativa: 4 }, destacados: 'Solución financiera muy bien estructurada con foco en eficiencia operativa. Identificó con precisión los centros de costo con mayor desviación y propuso reducciones con fundamento técnico claro.', senalAlerta: 'La presentación del caso tomó más tiempo del estipulado; reforzar agilidad bajo presión de tiempo.', recomendacion: 'avanzar', files: [] },
  'mfin-3': { ratings: { dominio: 4, resolucion: 4, calidad: 4, comunicacion: 5, iniciativa: 5 }, destacados: 'Enfoque analítico sólido con buena comprensión del P&L para manufactura. Propuso indicadores de alerta temprana para control presupuestal que evidencian visión estratégica del cargo.', senalAlerta: 'La solución priorizó la visión macro; en la práctica será importante el seguimiento línea a línea del presupuesto.', recomendacion: 'avanzar_reservas', files: [] },
  // Ventas: 5 de 10 respondieron la prueba técnica
  'mv-1': { ratings: { dominio: 5, resolucion: 5, calidad: 5, comunicacion: 5, iniciativa: 5 }, destacados: 'Plan comercial excepcional. Segmentó el mercado con precisión, definió estrategias diferenciadas por canal y propuso roadmap 90/180/360 días con KPIs medibles por etapa.', senalAlerta: 'Las proyecciones de crecimiento del 40% en el primer año son ambiciosas; alinear supuestos con gerencia.', recomendacion: 'avanzar', files: [] },
  'mv-2': { ratings: { dominio: 5, resolucion: 5, calidad: 4, comunicacion: 5, iniciativa: 4 }, destacados: 'Plan comercial muy bien fundamentado con foco en cuentas clave y nuevos segmentos. Demostró conocimiento profundo del sector industrial y sus dinámicas de compra B2B.', senalAlerta: 'Menor desarrollo en el plan de gestión del equipo comercial; reforzar la parte de desarrollo de personas.', recomendacion: 'avanzar', files: [] },
  'mv-3': { ratings: { dominio: 4, resolucion: 5, calidad: 5, comunicacion: 4, iniciativa: 5 }, destacados: 'Estrategia comercial sólida con diferenciación clara por segmento. Usó datos del mercado para fundamentar proyecciones y propuso indicadores de seguimiento muy prácticos.', senalAlerta: 'La estrategia de pricing fue conservadora; validar disposición para negociaciones de margen en cuentas estratégicas.', recomendacion: 'avanzar', files: [] },
  'mv-4': { ratings: { dominio: 4, resolucion: 4, calidad: 4, comunicacion: 5, iniciativa: 4 }, destacados: 'Buen manejo del caso comercial con foco en relacionamiento y fidelización. Identificó oportunidades de cross-selling con sustento cuantitativo relevante.', senalAlerta: 'La propuesta de expansión a nuevos territorios carece de análisis de viabilidad financiera.', recomendacion: 'avanzar_reservas', files: [] },
  'mv-5': { ratings: { dominio: 4, resolucion: 4, calidad: 4, comunicacion: 4, iniciativa: 4 }, destacados: 'Estrategia comercial coherente con el mercado objetivo. Buen análisis de competencia y propuesta de valor diferenciada para el segmento industrial de distribución.', senalAlerta: 'La gestión de equipo propuesta es reactiva; desarrollar metodología más estructurada de coaching y seguimiento.', recomendacion: 'avanzar_reservas', files: [] },
  // Comfandi GCA — Prueba técnica: simulación de gestión de convenios
  'gca-1': { ratings: { dominio: 5, resolucion: 5, calidad: 4, comunicacion: 5, iniciativa: 4 }, destacados: 'Resolvió el caso de gestión de convenio con precisión metodológica: identificó los puntos de bloqueo en la legalización, propuso ajustes al proceso administrativo y diseñó un plan de seguimiento con indicadores de cumplimiento por etapa. La simulación de visita comercial fue convincente y orientada al resultado.', senalAlerta: 'El análisis de indicadores de cartera complementaria fue básico; reforzar en la inducción.', recomendacion: 'avanzar', files: [] },
  'gca-2': { ratings: { dominio: 5, resolucion: 4, calidad: 5, comunicacion: 4, iniciativa: 5 }, destacados: 'Caso de gestión de convenio resuelto con foco en la profundización del portafolio. Identificó oportunidades de cross-selling dentro del mismo convenio y propuso indicadores de actividad comercial por empresa vinculada. Simulación de prospección empresarial muy bien estructurada.', senalAlerta: 'La gestión administrativa del proceso de legalización fue menos detallada que la parte comercial.', recomendacion: 'avanzar', files: [] },
  'gca-3': { ratings: { dominio: 4, resolucion: 4, calidad: 4, comunicacion: 5, iniciativa: 4 }, destacados: 'Análisis del caso de convenio correcto con buena comprensión del proceso administrativo. Propuesta de seguimiento de indicadores coherente con los objetivos del cargo. Comunicación clara y estructurada en la presentación del caso.', senalAlerta: 'La estrategia de profundización del portafolio fue reactiva más que proactiva; reforzar en la inducción.', recomendacion: 'avanzar_reservas', files: [] },
  // Comfandi GCV — Prueba técnica: simulación de atención de crédito
  'gcv-1': { ratings: { dominio: 5, resolucion: 5, calidad: 5, comunicacion: 4, iniciativa: 4 }, destacados: 'Caso de atención de crédito resuelto con alta precisión: identificó el perfil de riesgo del cliente simulado, propuso la línea de crédito más adecuada y diseñó el plan de seguimiento desde originación hasta desembolso. La simulación de entrevista de venta consultiva fue especialmente destacable por el enfoque en calidad de vida del afiliado.', senalAlerta: 'La gestión de objeciones relacionadas con tasas de interés fue estándar; profundizar en argumentación diferenciada de Comfandi.', recomendacion: 'avanzar', files: [] },
  'gcv-2': { ratings: { dominio: 4, resolucion: 5, calidad: 4, comunicacion: 5, iniciativa: 4 }, destacados: 'Caso de crédito de consumo resuelto con foco en el seguimiento activo de la base de preaprobados. Análisis de priorización de leads claro y estrategia de conversión bien fundamentada. Simulación de llamada de seguimiento muy bien ejecutada.', senalAlerta: 'El manejo del caso de cartera vencida fue básico; reforzar en la inducción con el equipo de cobranzas.', recomendacion: 'avanzar', files: [] },
  'gcv-3': { ratings: { dominio: 4, resolucion: 4, calidad: 4, comunicacion: 4, iniciativa: 4 }, destacados: 'Caso de gestión de portafolio de crédito correctamente resuelto. Comprensión clara del proceso de originación y seguimiento. Orientación al cliente demostrada en la simulación de atención en punto de venta.', senalAlerta: 'La estrategia de fidelización del cliente post-desembolso fue poco desarrollada; reforzar en la inducción.', recomendacion: 'avanzar_reservas', files: [] },
  // Comfandi CB — Prueba técnica: diseño de intervención comportamental
  'cb-1': { ratings: { dominio: 5, resolucion: 5, calidad: 5, comunicacion: 5, iniciativa: 4 }, destacados: 'Diseño de intervención comportamental excepcional: aplicó metodología EAST con precisión, definió indicadores de impacto medibles y elaboró un plan de transferencia metodológica a orientadores con métricas de adopción. El reporte técnico presentado combinó rigor científico con lenguaje accionable para audiencias no académicas.', senalAlerta: 'El plan de comunicación de resultados a gerencia podría ser más ejecutivo y menos académico.', recomendacion: 'avanzar', files: [] },
  'cb-2': { ratings: { dominio: 5, resolucion: 4, calidad: 5, comunicacion: 5, iniciativa: 5 }, destacados: 'Caso de diagnóstico comportamental resuelto con enfoque mixto muy bien articulado. Aplicación de EAST en el diseño del piloto y propuesta de medición de impacto con grupo de control. La comunicación del diagnóstico para audiencias operativas fue especialmente clara y accionable.', senalAlerta: 'El análisis cuantitativo del caso podría incluir más indicadores de impacto a nivel individual.', recomendacion: 'avanzar', files: [] },
  'cb-3': { ratings: { dominio: 4, resolucion: 5, calidad: 4, comunicacion: 4, iniciativa: 5 }, destacados: 'Intervención comportamental bien diseñada con metodología EAST aplicada correctamente. Análisis de datos con R sólido y propuesta de indicadores de seguimiento práctica. El plan de transferencia metodológica al equipo de orientadores fue detallado y viable.', senalAlerta: 'El reporte técnico fue más denso que ejecutivo; reforzar la síntesis para audiencias gerenciales.', recomendacion: 'avanzar_reservas', files: [] },
};

// ─── Mock Finalist Cards ──────────────────────────────────────────────────────
function _toFinCard(c: Candidate, fid: string, salary: string, modalidad: string, addSkills: {label:string;score:number}[], fitC: string, pruebaTecnica: boolean, noNeg?: string[]) {
  const nn = (c.prescreeningAI?.noNegociables ?? []) as Array<{label:string;score:number}>;
  return { id: fid, name: c.name, role: c.role, years: c.years, sector: c.sector, salary, salaryRange: c.salaryRange, score: c.score, avatarInitials: c.avatarInitials, photo: c.photo, location: c.location, modalidad, coreSkills: nn.slice(0,3).map(n=>({label:n.label,score:n.score})), additionalSkills: addSkills, fitCultural: fitC, pruebaTecnicaCompletada: pruebaTecnica, noNeg };
}
export const mockFinalistCards: Record<string, ReturnType<typeof _toFinCard>[]> = {
  'mock-ventas': [
    _toFinCard(venFinalistCandidates[0], 'f1', "$14M / $15M", 'Remoto', [{label:'Gestión de CRM',score:94},{label:'Negociación B2B',score:91},{label:'Liderazgo de equipo',score:88}], 'Orientación al resultado, liderazgo inspirador y visión de largo plazo.', true),
    _toFinCard(venFinalistCandidates[1], 'f2', "$14M / $15M", 'Remoto', [{label:'Apertura de mercados',score:90},{label:'Cuentas clave',score:92},{label:'Estrategia comercial',score:87}], 'Relacionamiento estratégico, alta energía comercial y foco en el cliente.', true),
    _toFinCard(venFinalistCandidates[2], 'f3', "$13M / $14M", 'Remoto', [{label:'Pipeline management',score:88},{label:'Negociación',score:89},{label:'Desarrollo de equipo',score:85}], 'Disciplina comercial, constancia y construcción de equipos de alto rendimiento.', true),
  ],
  'mock-comf-gca': [
    _toFinCard(gcaEval[0], 'gca-f1', "$5'800.000 / $6'200.000", 'Presencial Medellín', [{label:'Gestión de convenios',score:92},{label:'Profundización de portafolio',score:89},{label:'Relacionamiento empresarial',score:91}], 'Disciplina comercial, visión de largo plazo y orientación a la calidad de la relación con la empresa vinculada.', true, ['Mín. VIII semestre en Administración, Mercadeo o tecnólogo afín', 'Mínimo 3 años en crédito de libranza en sector financiero o cooperativo', 'Experiencia en vinculación y legalización de convenios empresariales', 'Disponibilidad presencial en Medellín con visitas externas']),
    _toFinCard(gcaEval[1], 'gca-f2', "$6'000.000 / $6'200.000", 'Presencial Medellín', [{label:'Prospección empresarial',score:88},{label:'Legalización de convenios',score:90},{label:'Indicadores de colocación',score:87}], 'Orientación al resultado, capacidad de apertura de cuentas nuevas y gestión proactiva del portafolio.', true, ['Mín. VIII semestre en Administración, Mercadeo o tecnólogo afín', 'Mínimo 3 años en crédito de libranza en sector financiero o cooperativo', 'Experiencia en vinculación y legalización de convenios empresariales', 'Disponibilidad presencial en Medellín con visitas externas']),
  ],
  'mock-comf-gcv': [
    _toFinCard(gcvEval[0], 'gcv-f1', "$3'800.000 / $4'000.000", 'Presencial Cali', [{label:'Venta consultiva de crédito',score:94},{label:'Gestión de preaprobados',score:91},{label:'NPS y fidelización',score:90}], 'Enfoque en calidad de vida del afiliado, disciplina en seguimiento de portafolio y alto NPS personal.', true, ['Título técnico en carreras administrativas, mercadeo o afines', 'Mínimo 1 año en comercialización de intangibles (cualquier sector)', 'Orientación al logro con seguimiento proactivo de metas de colocación', 'Disponibilidad presencial en Cali (oficina y punto de venta)']),
    _toFinCard(gcvEval[1], 'gcv-f2', "$4'000.000 / $4'200.000", 'Presencial Cali', [{label:'Seguimiento de cartera',score:88},{label:'Originación hasta desembolso',score:90},{label:'Cumplimiento de metas',score:87}], 'Orientación al resultado, dominio del ciclo completo de crédito y relacionamiento proactivo con clientes.', true, ['Título técnico en carreras administrativas, mercadeo o afines', 'Mínimo 1 año en comercialización de intangibles (cualquier sector)', 'Orientación al logro con seguimiento proactivo de metas de colocación', 'Disponibilidad presencial en Cali (oficina y punto de venta)']),
  ],
  'mock-comf-cb': [
    _toFinCard(cbEval[0], 'cb-f1', "$5'800.000 / $6'200.000", 'Presencial Bogotá', [{label:'Metodología EAST/3B',score:95},{label:'Análisis estadístico (R)',score:93},{label:'Transferencia metodológica',score:91}], 'Rigor científico excepcional, comunicación efectiva de hallazgos y capacidad probada de transferencia metodológica a equipos operativos.', true, ['Profesional en ciencias sociales, administrativas, económicas o afines', 'Más de 3 años en investigación aplicada y experimentación en campo', 'Dominio de metodologías EAST, 3B o COMB en diseño de intervenciones', 'Disponibilidad presencial en Bogotá o municipios aledaños']),
    _toFinCard(cbEval[1], 'cb-f2', "$6'000.000 / $6'200.000", 'Presencial Bogotá', [{label:'Diagnósticos comportamentales',score:90},{label:'Investigación aplicada',score:92},{label:'Reportes técnicos ejecutivos',score:88}], 'Perfil equilibrado entre rigor metodológico y comunicación ejecutiva, con experiencia en intervenciones de campo con medición de impacto.', true, ['Profesional en ciencias sociales, administrativas, económicas o afines', 'Más de 3 años en investigación aplicada y experimentación en campo', 'Dominio de metodologías EAST, 3B o COMB en diseño de intervenciones', 'Disponibilidad presencial en Bogotá o municipios aledaños']),
  ],
};

