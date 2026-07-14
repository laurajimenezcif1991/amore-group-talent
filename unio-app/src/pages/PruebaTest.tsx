import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import RadioCard from '../components/ui/RadioCard';
import { assetUrl } from '../utils/assets';

const COMPANY_LOGO = 'https://www.figma.com/api/mcp/asset/6f3ad322-1b47-491d-9c5e-ef9954b27a33';
const UNIO_LOGO    = assetUrl('/logo-unio.png');
const BG_BANNER    = 'https://www.figma.com/api/mcp/asset/1ca3ece4-fa35-4a9e-956d-716e2ddf18a8';

interface Question {
  id: number;
  label: string;
  text: string;
  options: string[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    label: 'Pregunta 1 de 10',
    text: 'Es hora pico del almuerzo y tres mesas te piden la cuenta al mismo tiempo mientras otra acaba de llegar y espera ser atendida. ¿Qué haces?',
    options: [
      'Atiendo a las mesas en orden de llegada y pido disculpas a las que esperan, explicando que las atiendo en un momento',
      'Priorizo a la mesa recién llegada con una bienvenida rápida y luego proceso las cuentas en orden',
      'Solicito apoyo a un compañero para dividir las atenciones y resolver todo al mismo tiempo',
      'Me enfoco en cerrar primero todas las cuentas para liberar las mesas y luego atiendo la nueva',
    ],
  },
  {
    id: 2,
    label: 'Pregunta 2 de 10',
    text: 'Un cliente te hace una pregunta sobre los ingredientes de un plato que no sabes con certeza si contiene un alérgeno. ¿Cómo reaccionas?',
    options: [
      'Le digo que no estoy seguro/a y voy directamente a cocina a confirmar antes de responder',
      'Le doy la información que recuerdo y añado que cree que no tiene ese ingrediente',
      'Le sugiero que evite ese plato por precaución y le ofrezco una alternativa segura',
      'Busco el menú o la ficha del plato para darle una respuesta exacta basada en la información oficial',
    ],
  },
  {
    id: 3,
    label: 'Pregunta 3 de 10',
    text: 'Al llevar un pedido a la mesa, te das cuenta de que el cocinero preparó un plato diferente al que ordenó el cliente. ¿Qué haces?',
    options: [
      'Regreso inmediatamente a cocina, explico el error y espero el plato correcto antes de salir',
      'Llevo el plato a la mesa, me disculpo con el cliente y le explico que en unos minutos tiene el correcto',
      'Le pregunto al cliente si acepta el plato que está listo o prefiere esperar el que pidió',
      'Notifico al supervisor para que maneje la situación con el cliente',
    ],
  },
  {
    id: 4,
    label: 'Pregunta 4 de 10',
    text: 'Un cliente insiste en que le des un descuento que no está autorizado en el menú ni por el encargado. ¿Cómo manejas la situación?',
    options: [
      'Explico amablemente que no tengo autorización para ese descuento y ofrezco alternativas dentro de lo permitido',
      'Llamo al supervisor para que tome la decisión y atienda al cliente directamente',
      'Le aplico el descuento para evitar el conflicto y le digo a mi jefe después',
      'Le digo al cliente que hoy no es posible pero que puede preguntar en otra ocasión por promociones vigentes',
    ],
  },
  {
    id: 5,
    label: 'Pregunta 5 de 10',
    text: 'Llevas dos horas seguidas en el turno pico y estás agotado/a. Aún quedan 3 horas de turno y hay varias mesas esperando. ¿Qué haces?',
    options: [
      'Sigo atendiendo con la misma energía, el servicio al cliente es mi responsabilidad independientemente del cansancio',
      'Le comento a mi jefe que estoy cansado/a para que lo tenga en cuenta, pero continúo sin bajar la calidad del servicio',
      'Pido un descanso rápido de 5 minutos al supervisor para recuperarme y volver al 100%',
      'Me enfoco en la eficiencia para terminar más rápido y así reducir la presión del turno',
    ],
  },
  {
    id: 6,
    label: 'Pregunta 6 de 10',
    text: 'Al cierre del turno te das cuenta de que la caja tiene una diferencia de $10.000 de más frente al reporte del sistema. ¿Qué haces?',
    options: [
      'Reporto inmediatamente la diferencia al supervisor con el detalle del conteo y espero instrucciones',
      'Reviso todos los recibos del turno para encontrar el origen de la diferencia antes de reportar',
      'Anoto la diferencia en el registro de novedades del turno y lo dejo para que lo revise el encargado del siguiente',
      'Guardo los $10.000 adicionales en un sobre aparte etiquetado hasta que el supervisor los revise',
    ],
  },
  {
    id: 7,
    label: 'Pregunta 7 de 10',
    text: 'Un cliente se queja directamente contigo de que el plato tardó demasiado y ya no tiene apetito. ¿Cómo respondes?',
    options: [
      'Me disculpo sinceramente, escucho al cliente y le ofrezco alternativas como un postre de cortesía o un descuento, previa autorización',
      'Explico que había mucha demanda en cocina y que el tiempo de espera fue mayor al habitual',
      'Llamo inmediatamente al supervisor para que maneje la situación con el cliente',
      'Le ofrezco llevarle el plato para llevar sin costo adicional si ya no quiere comerlo aquí',
    ],
  },
  {
    id: 8,
    label: 'Pregunta 8 de 10',
    text: 'Durante tu turno en la barra, un compañero te pide que lo cubras en las mesas mientras él soluciona un inconveniente urgente. Tú también tienes clientes en la barra. ¿Qué haces?',
    options: [
      'Acepto cubrirlo, organizo rápidamente mis tareas pendientes en barra y atiendo ambos puntos al mismo tiempo',
      'Le digo que no puedo porque tengo clientes propios esperando en la barra en este momento',
      'Le aviso al supervisor para que tome la decisión de cómo reorganizar al equipo',
      'Atiendo primero lo urgente de la barra y luego paso a las mesas del compañero cuando pueda',
    ],
  },
  {
    id: 9,
    label: 'Pregunta 9 de 10',
    text: 'El supervisor te llama la atención frente a un compañero por una falla en el servicio que crees que no fue tu responsabilidad. ¿Cómo reaccionas?',
    options: [
      'Escucho sin interrumpir, reconozco lo que pudo mejorarse y luego en privado explico mi perspectiva de lo ocurrido',
      'En el momento explico con calma que esa situación no fue responsabilidad mía',
      'Acepto la corrección sin decir nada y luego lo hablo con el supervisor en privado',
      'Reconozco el error delante de todos aunque no esté seguro/a de que fue mi responsabilidad para evitar conflictos',
    ],
  },
  {
    id: 10,
    label: 'Pregunta 10 de 10',
    text: 'Tienes el domingo libre después de varios días de turno seguido. El martes te avisan que necesitan que trabajes ese domingo porque un compañero no puede. ¿Qué haces?',
    options: [
      'Acepto porque entiendo que el equipo me necesita y coordino para recuperar el descanso en otra fecha acordada con el supervisor',
      'Pregunto si pueden buscar otra persona primero, y si no hay opción, aceptaría con condiciones claras de compensación',
      'Me niego porque el descanso ya estaba acordado y tengo compromisos personales ese día',
      'Acepto pero le hago saber a mi supervisor que necesito que esto no se repita con frecuencia',
    ],
  },
];

export default function PruebaTest() {
  const navigate = useNavigate();
  const { evalId } = useParams<{ evalId: string }>();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showStickyBar, setShowStickyBar] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  const answeredCount = Object.keys(answers).length;
  const progressPct   = (answeredCount / QUESTIONS.length) * 100;
  const allAnswered   = answeredCount === QUESTIONS.length;

  useEffect(() => {
    const handleScroll = () => {
      if (!progressRef.current) return;
      const { bottom } = progressRef.current.getBoundingClientRect();
      setShowStickyBar(bottom < 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSelect = (questionId: number, option: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    localStorage.setItem(`prueba_${evalId}`, JSON.stringify({ answers, submittedAt: new Date().toISOString() }));
    navigate(`/prueba/${evalId}/exito`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        position: 'relative',
        fontFamily: 'var(--font-display)',
        paddingBottom: '120px',
      }}
    >
      {/* Floating progress bar — appears when original bar scrolls out of view */}
      {showStickyBar && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            background: '#ffffff',
            borderBottom: '1px solid var(--color-border-default, #e5e5e6)',
            boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
            padding: '14px 40px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              width: '100%',
              maxWidth: '680px',
            }}
          >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '13px',
              color: '#252432',
              whiteSpace: 'nowrap',
            }}
          >
            Evaluación Conductual PRIMA
          </span>

          {/* Track */}
          <div
            style={{
              flex: 1,
              height: '6px',
              borderRadius: '8px',
              background: 'var(--color-secondary-100, #e8ddfd)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: '8px',
                background: 'var(--color-secondary-base, #8750f6)',
                width: `${progressPct}%`,
                transition: 'width 0.3s ease',
              }}
            />
          </div>

          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '13px',
              color: 'var(--color-secondary-base, #8750f6)',
              whiteSpace: 'nowrap',
            }}
          >
            {Math.round(progressPct)}% completado
          </span>
          </div>
        </div>
      )}
      {/* Decorative background */}
      <div
        style={{
          position: 'absolute',
          left: '15%',
          top: '40px',
          width: '70%',
          height: '320px',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.6,
        }}
      >
        <img src={BG_BANNER} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      {/* Page content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '53px',
        }}
      >
        {/* Main card */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: '32px',
            boxShadow: '0px 0px 22.4px 0px rgba(0,0,0,0.06)',
            padding: '32px 42px',
            width: '100%',
            maxWidth: '946px',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center' }}>
            {/* Company + Unio logos */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '558px' }}>
              <img src={COMPANY_LOGO} alt="Logo empresa" style={{ height: '84px', width: 'auto', objectFit: 'contain' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', color: '#151515', lineHeight: '19px' }}>Powered by</span>
                <img src={UNIO_LOGO} alt="Unio" style={{ height: '23px', width: 'auto' }} />
              </div>
            </div>

            {/* Title + progress */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', width: '558px' }}>
              <h1
                style={{
                  fontSize: '36px',
                  fontWeight: 800,
                  lineHeight: '54px',
                  color: '#252432',
                  textAlign: 'center',
                  margin: 0,
                  width: '100%',
                }}
              >
                Evaluación Conductual PRIMA
              </h1>

              {/* Progress bar */}
              <div
                ref={progressRef}
                style={{
                  width: '364px',
                  height: '8px',
                  borderRadius: '12px',
                  background: 'var(--color-secondary-100, #e8ddfd)',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    borderRadius: '12px',
                    background: 'var(--color-secondary-base, #8750f6)',
                    width: `${progressPct}%`,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>

              <p
                style={{
                  fontSize: '16px',
                  fontWeight: 700,
                  lineHeight: '24px',
                  color: 'var(--color-secondary-base, #8750f6)',
                  textAlign: 'center',
                  margin: 0,
                }}
              >
                {Math.round(progressPct)}% completado
              </p>
            </div>
          </div>

          {/* Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', alignItems: 'center' }}>
            {QUESTIONS.map((q) => (
              <div key={q.id} style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '702px' }}>
                {/* Question label */}
                <p
                  style={{
                    fontWeight: 700,
                    fontSize: '18px',
                    lineHeight: '27px',
                    color: '#afaeb0',
                    margin: 0,
                    textAlign: 'center',
                  }}
                >
                  {q.label}
                </p>

                {/* Question text */}
                <p
                  style={{
                    fontWeight: 600,
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: '#252432',
                    margin: 0,
                  }}
                >
                  {q.text}
                </p>

                {/* Options */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {q.options.map((option) => (
                    <RadioCard
                      key={option}
                      text={option}
                      selected={answers[q.id] === option}
                      onSelect={() => handleSelect(q.id, option)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed WizardBar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: '#ffffff',
          borderTop: '1px solid var(--color-border-default, #e5e5e6)',
          boxShadow: '-2px -4px 20.3px 0px rgba(0,0,0,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: '120px',
          zIndex: 50,
        }}
      >
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '16px 28px',
            borderRadius: '12px',
            background: allAnswered
              ? 'var(--color-brand-primary, #27214d)'
              : 'var(--color-primary-50, #e5e2f3)',
            border: 'none',
            color: '#ffffff',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '24px',
            cursor: allAnswered ? 'pointer' : 'default',
            opacity: allAnswered ? 1 : 0.65,
            pointerEvents: allAnswered ? 'auto' : 'none',
            transition: 'opacity 0.15s ease',
          }}
        >
          Enviar respuestas
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M4 10H16M16 10L11 5M16 10L11 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
