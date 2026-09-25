import React, { useState, useEffect, useRef } from 'react';
import {
  CalendarDays,
  ShieldCheck,
  Globe,
  Receipt,
  Users,
  Check,
  ArrowRight,
  EyeOff,
  Eye,
  MessageCircle,
  Lock,
  Play,
  Plus,
  TrendingUp,
  Building2,
  Video,
  FileText,
  QrCode,
  BellRing,
  Menu,
  X,
} from 'lucide-react';
import { BrandMark, BrandWordmark } from '../Common/BrandMark';

/* Revela elementos .reveal al entrar en viewport (una sola vez) */
const useReveal = () => {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const els = root.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return ref;
};

const FEATURES = [
  {
    id: 'agenda',
    label: 'Agenda y WhatsApp',
    icon: CalendarDays,
    title: 'Agenda multisede con recordatorios en un toque',
    text: 'Visualizá tu semana de un vistazo discriminando por consultorio físico o telepsicología. Enviá recordatorios personalizados por WhatsApp Web con un solo clic.',
    bullets: [
      'Estados de turno: Confirmado, En espera, Atendido, Ausente.',
      'Registro del cobro de coseguro en efectivo o transferencia.',
    ],
  },
  {
    id: 'pacientes',
    label: 'Historias clínicas',
    icon: Users,
    title: 'Ficha clínica y evolución cronológica',
    text: 'Guardá el historial completo de cada paciente: motivo de consulta, diagnósticos DSM-5 / CIE-11 y notas de evolución de cada sesión con fecha exacta.',
    bullets: [
      'Contador automático de sesiones de la orden médica.',
      'Búsqueda rápida por nombre o DNI con Ctrl + K.',
    ],
  },
  {
    id: 'obras-sociales',
    label: 'Obras sociales',
    icon: Receipt,
    title: 'Liquidaciones y convenios pre-configurados',
    text: 'Control de aranceles, coseguros obligatorios, plazos de cobro (30, 45 o 60 días) y planillas oficiales para el Colegio de Psicólogos.',
    bullets: [
      'IOSCOR, OSDE, Swiss Medical, Medifé y particulares.',
      'Exportación en PDF con formato oficial de liquidación.',
    ],
  },
  {
    id: 'portal',
    label: 'Portal de turnos',
    icon: Globe,
    title: 'Tus pacientes reservan solos, vos confirmás',
    text: 'Un enlace público donde eligen sede, fecha y horario disponible. Recibís la solicitud y la confirmás con un clic, sin interrumpir tus sesiones.',
    bullets: [
      'Días y horarios de atención configurables.',
      'Ideal para tu bio de Instagram o WhatsApp.',
    ],
  },
  {
    id: 'finanzas',
    label: 'Finanzas y ARCA',
    icon: TrendingUp,
    title: 'Caja, honorarios y facturas ARCA',
    text: 'Sabé con precisión cuánto ingresó en efectivo, cuánto por transferencia y cuánto tenés pendiente de cobro de cada obra social.',
    bullets: [
      'Facturas C y B con CAE y QR para reintegros.',
      'Proyección de ingresos reales del mes.',
    ],
  },
];

const FAQS = [
  {
    q: '¿El plan inicial es realmente gratis?',
    a: 'Sí, totalmente gratuito. Podés gestionar hasta 15 pacientes activos, tu agenda de turnos completa, historias clínicas y registro de cobros sin pagar nada ni ingresar tarjeta de crédito.',
  },
  {
    q: '¿Cómo funciona el desbloqueo del Plan PRO?',
    a: 'Cuando tu consultorio crezca o necesites funciones avanzadas (pacientes ilimitados, múltiples sedes, liquidación masiva de obras sociales o informes clínicos en PDF), podés desbloquear el Plan PRO con suscripción mensual, anual con descuento o códigos promocionales de convenios con colegios de psicólogos.',
  },
  {
    q: '¿Mis datos y los de mis pacientes están protegidos?',
    a: 'PsicoPlus está diseñado siguiendo las normas de confidencialidad y secreto profesional. Tus registros se almacenan de manera segura y contás con el “Modo privacidad” para ocultar datos sensibles en pantalla en cualquier momento con un solo clic.',
  },
  {
    q: '¿Puedo usarlo en el celular o tablet?',
    a: 'Sí. PsicoPlus es 100% responsivo y funciona como aplicación web progresiva (PWA) en computadoras, Android y iPhone.',
  },
  {
    q: '¿Qué obras sociales y prepagas incluye?',
    a: 'Viene con aranceles pre-configurados para las principales obras sociales y prepagas de Argentina (IOSCOR, OSDE, Swiss Medical, Medifé, Galeno, Sancor Salud, PAMI, etc.) y podés personalizar o agregar las de tu provincia.',
  },
];

const TESTIMONIOS = [
  {
    quote: 'Antes perdía horas a fin de mes contando las sesiones de las órdenes de IOSCOR y OSDE. Con PsicoPlus genero la liquidación en 2 minutos y no se me pasa ningún coseguro.',
    name: 'Lic. Matías Ríos',
    role: 'Psicólogo clínico · Corrientes',
    initials: 'MR',
  },
  {
    quote: 'El portal de turnos es una maravilla. Lo puse en mi biografía de Instagram y mis nuevos pacientes solicitan turno directo. Además el modo privacidad me da total tranquilidad.',
    name: 'Lic. Sofía Benítez',
    role: 'Terapia cognitivo conductual · Resistencia',
    initials: 'SB',
  },
  {
    quote: 'Atiendo en dos consultorios y hago sesiones online los viernes. Filtrar la agenda por sede y confirmar por WhatsApp en un toque me cambió la rutina.',
    name: 'Lic. Virna Toledo',
    role: 'Psicóloga especialista · Corrientes',
    initials: 'VT',
  },
];

const OBRAS = ['IOSCOR', 'OSDE', 'Swiss Medical', 'Medifé', 'Galeno', 'Sancor Salud', 'PAMI'];

/* ---------- Mockup del producto (con Modo Privacidad interactivo) ---------- */
const HeroMockup = () => {
  const [privacy, setPrivacy] = useState(false);
  const blur = privacy ? 'blur-[6px] select-none' : '';
  const turnos = [
    { h: '09:00', n: 'Agustina Romero', os: 'OSDE', mod: 'Presencial', st: 'Atendido' },
    { h: '10:00', n: 'Camila Belén Benítez', os: 'IOSCOR', mod: 'Presencial', st: 'Confirmado', next: true },
    { h: '11:30', n: 'Julián Ortega', os: 'Swiss Medical', mod: 'Online', st: 'Confirmado' },
    { h: '16:00', n: 'María Eugenia Almirón', os: 'Particular', mod: 'Presencial', st: 'En espera' },
  ];

  return (
    <div className="relative">
      <div className="rounded-[20px] bg-[#fffefb] border border-[#e3dfd5] shadow-[0_1px_2px_rgba(27,29,26,.05),0_30px_60px_-24px_rgba(27,29,26,.28)] overflow-hidden text-left">
        {/* Barra */}
        <div className="h-11 px-4 flex items-center justify-between border-b border-[#ece9e1] bg-[#f7f5f0]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#e3dfd5]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#e3dfd5]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#e3dfd5]" />
          </div>
          <span className="text-[11.5px] text-[#8c8d85] font-mono">psicoplus.app/consultorio</span>
          <span className="w-10" />
        </div>

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[12px] text-[#78756c]">Martes 1 de septiembre</p>
              <p className="font-serif text-[1.65rem] leading-tight text-[#1b1d1a]">
                Buen día, <em className="text-[#22554d]">Virna</em>.
              </p>
            </div>
            <button
              onClick={() => setPrivacy((v) => !v)}
              aria-pressed={privacy}
              className={`h-8 px-2.5 inline-flex items-center gap-1.5 rounded-lg text-[12px] font-medium border transition-colors active:scale-[0.97] ${
                privacy ? 'bg-[#1d1f1c] text-[#f4f1e8] border-[#1d1f1c]' : 'bg-white text-[#46453f] border-[#e3dfd5] hover:border-[#d0ccc1]'
              }`}
            >
              {privacy ? <EyeOff size={14} /> : <Eye size={14} />}
              {privacy ? 'Privado' : 'Privacidad'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-px mt-4 rounded-xl overflow-hidden border border-[#e3dfd5] bg-[#e3dfd5]">
            {[
              ['Sesiones', '6'],
              ['Cobrado', '$25.000'],
              ['Por renovar', '2'],
            ].map(([k, v], i) => (
              <div key={k} className="bg-[#fffefb] px-3 py-2.5">
                <p className="text-[11px] text-[#78756c]">{k}</p>
                <p className={`text-[1.05rem] font-semibold tabular-nums ${i === 2 ? 'text-[#9a6622]' : 'text-[#1b1d1a]'} ${i === 1 ? blur : ''} transition-[filter] duration-200`}>{v}</p>
              </div>
            ))}
          </div>

          <ol className="mt-4 space-y-1.5">
            {turnos.map((t) => (
              <li
                key={t.h}
                className={`relative grid grid-cols-[44px_1fr_auto] items-center gap-2 rounded-lg pl-3 pr-2.5 py-2 border ${
                  t.next ? 'border-[#b5d5cc] bg-[#eef5f3]' : 'border-[#ece9e1] bg-[#fffefb]'
                } ${t.st === 'Atendido' ? 'opacity-60' : ''}`}
              >
                <span className={`absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full ${t.mod === 'Online' ? 'bg-[#4f7593]' : 'bg-[#2b685d]'}`} />
                <span className="font-mono text-[11.5px] text-[#78756c]">{t.h}</span>
                <span className="min-w-0">
                  <span className={`block text-[13px] font-medium text-[#1b1d1a] truncate transition-[filter] duration-200 ${blur}`}>{t.n}</span>
                  <span className="flex items-center gap-1 text-[11px] text-[#78756c]">
                    {t.mod === 'Online' ? <Video size={11} /> : <Building2 size={11} />} {t.mod} · {t.os}
                  </span>
                </span>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                  t.st === 'Atendido' ? 'bg-[#eef5f3] text-[#22554d]' : t.st === 'En espera' ? 'bg-[#fbf6ec] text-[#7a4f1f]' : 'bg-[#f1efe9] text-[#46453f]'
                }`}>
                  {t.st}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Tarjeta flotante: recordatorio */}
      <div className="hidden sm:flex absolute -left-8 lg:-left-14 -bottom-7 items-center gap-2.5 rounded-xl bg-[#fffefb] border border-[#e3dfd5] shadow-[0_18px_40px_-16px_rgba(27,29,26,.3)] px-3 py-2.5 animate-float">
        <span className="w-8 h-8 rounded-lg bg-[#eef5f3] text-[#22554d] grid place-items-center"><MessageCircle size={16} /></span>
        <span>
          <span className="block text-[12.5px] font-medium text-[#1b1d1a]">Recordatorio enviado</span>
          <span className="block text-[11px] text-[#78756c]">WhatsApp · hace 2 min</span>
        </span>
      </div>

      {/* Tarjeta flotante: ARCA */}
      <div className="hidden md:flex absolute -right-6 -top-5 items-center gap-2 rounded-xl bg-[#1c4540] text-[#f4f1e8] shadow-[0_18px_40px_-16px_rgba(23,56,52,.5)] px-3 py-2">
        <QrCode size={16} className="text-[#b5d5cc]" />
        <span className="text-[12px] font-medium">Factura C · CAE aprobado</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------------- */

export const LandingPage = ({
  onStartFree,
  onLogin,
  onOpenDemo,
  onGoToPortal,
  onOpenLegal
}) => {
  const [activeTabFeature, setActiveTabFeature] = useState('agenda');
  const [openFaq, setOpenFaq] = useState(0);
  const [pricingCycle, setPricingCycle] = useState('annual');
  const [menuOpen, setMenuOpen] = useState(false);
  const rootRef = useReveal();

  const feature = FEATURES.find((f) => f.id === activeTabFeature) || FEATURES[0];
  const FeatureIcon = feature.icon;

  const navLinks = [
    ['#caracteristicas', 'Funcionalidades'],
    ['#obras-sociales', 'Obras sociales y ARCA'],
    ['#precios', 'Precios'],
    ['#testimonios', 'Testimonios'],
    ['#faq', 'Preguntas'],
  ];

  const legal = (tab) => () => onOpenLegal && onOpenLegal(tab);

  return (
    <div
      ref={rootRef}
      className="landing min-h-screen bg-[#f7f5f0] text-[#1b1d1a] font-sans antialiased overflow-x-hidden [color-scheme:light]"
    >
      {/* Anuncio */}
      <div className="bg-[#1c4540] text-[#d9eae5] text-[13px] py-2 px-4 text-center">
        <span className="font-medium text-[#f4f1e8]">Lanzamiento 2026</span>
        <span className="mx-2 opacity-40">·</span>
        Comenzá tu consultorio digital gratis, sin tarjeta de crédito.
      </div>

      {/* Navegación */}
      <header className="sticky top-0 z-40 bg-[#f7f5f0]/85 backdrop-blur-md border-b border-[#e3dfd5]/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a href="#top" className="flex items-center gap-2.5" aria-label="PsicoPlus inicio">
            <BrandMark size={32} />
            <BrandWordmark className="text-[#1b1d1a]" />
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-[14px] text-[#5c5a53]" aria-label="Secciones">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} className="hover:text-[#1b1d1a] transition-colors">{label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={onLogin} className="hidden sm:inline-flex h-9 px-3.5 items-center rounded-lg text-[14px] font-medium text-[#2c2d29] hover:bg-[#1b1d1a]/[0.05] transition-colors">
              Iniciar sesión
            </button>
            <button onClick={onStartFree} className="h-9 px-4 inline-flex items-center gap-1.5 rounded-lg bg-[#22554d] text-[#fbfaf6] text-[14px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_1px_2px_rgba(23,56,52,.25)] hover:bg-[#1c4540] active:scale-[0.97] transition-[background-color,transform] duration-150">
              Crear cuenta gratis
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="lg:hidden w-9 h-9 grid place-items-center rounded-lg text-[#2c2d29] hover:bg-[#1b1d1a]/[0.05]"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="lg:hidden border-t border-[#e3dfd5] bg-[#f7f5f0] px-4 py-3 flex flex-col animate-fade-in" aria-label="Secciones móvil">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)} className="h-11 flex items-center text-[15px] text-[#2c2d29] border-b border-[#ece9e1] last:border-0">
                {label}
              </a>
            ))}
            <button onClick={() => { setMenuOpen(false); onLogin(); }} className="h-11 text-left text-[15px] font-medium text-[#22554d]">
              Iniciar sesión
            </button>
          </nav>
        )}
      </header>

      <main id="top">
        {/* HERO */}
        <section className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20 lg:pt-24 pb-20 lg:pb-28 grid lg:grid-cols-[1.05fr_1fr] gap-14 lg:gap-12 items-center">
          <div>
            <p className="reveal inline-flex items-center gap-2 text-[13px] text-[#5c5a53] border border-[#e3dfd5] bg-[#fffefb] rounded-full pl-1.5 pr-3 py-1">
              <span className="px-2 py-0.5 rounded-full bg-[#eef5f3] text-[#22554d] text-[11.5px] font-medium">Nuevo</span>
              Facturación ARCA con CAE y QR integrada
            </p>
            <h1 className="reveal font-serif text-[2.9rem] leading-[0.98] sm:text-[4rem] lg:text-[4.6rem] tracking-[-0.02em] mt-6" style={{ '--i': 1 }}>
              Menos tiempo en planillas,{' '}
              <em className="text-[#22554d]">más tiempo</em> para tus pacientes.
            </h1>
            <p className="reveal text-[17px] sm:text-[18px] leading-relaxed text-[#5c5a53] mt-6 max-w-[34rem]" style={{ '--i': 2 }}>
              Agenda multisede, fichas clínicas protegidas por secreto profesional, control de órdenes de obras sociales y un portal para que tus pacientes reserven solos.
            </p>

            <div className="reveal flex flex-col sm:flex-row gap-3 mt-9" style={{ '--i': 3 }}>
              <button onClick={onStartFree} className="h-12 px-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#22554d] text-[#fbfaf6] text-[15px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,.12),0_8px_20px_-8px_rgba(23,56,52,.55)] hover:bg-[#1c4540] active:scale-[0.97] transition-[background-color,transform] duration-150 group">
                Comenzar gratis
                <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
              <button onClick={onOpenDemo} className="h-12 px-5 inline-flex items-center justify-center gap-2 rounded-xl border border-[#d0ccc1] bg-[#fffefb] text-[15px] font-medium text-[#1b1d1a] hover:border-[#a29e93] active:scale-[0.97] transition-[border-color,transform] duration-150">
                <Play size={15} className="text-[#22554d]" />
                Ver demo interactiva
              </button>
            </div>

            <ul className="reveal flex flex-wrap gap-x-6 gap-y-2 mt-8 text-[13.5px] text-[#5c5a53]" style={{ '--i': 4 }}>
              {['Plan gratuito sin vencimiento', 'Sin tarjeta de crédito', 'Cumple Ley 25.326'].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <Check size={15} className="text-[#2b685d]" /> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="reveal lg:pl-6" style={{ '--i': 2 }}>
            <HeroMockup />
            <p className="text-center text-[12.5px] text-[#8c8d85] mt-4">
              Probá el botón <span className="text-[#46453f] font-medium">Privacidad</span>: oculta datos sensibles al instante.
            </p>
          </div>
        </section>

        {/* Convenios */}
        <section className="border-y border-[#e3dfd5] bg-[#fffefb]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-7 flex flex-col md:flex-row md:items-center gap-4 md:gap-10">
            <p className="text-[13px] text-[#78756c] md:w-44 flex-shrink-0">Aranceles pre-configurados para</p>
            <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
              {OBRAS.map((o) => (
                <li key={o} className="font-serif text-[1.35rem] text-[#5c5a53] leading-none">{o}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* PROBLEMA → SOLUCIÓN */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20">
            <div className="lg:sticky lg:top-28 self-start">
              <p className="reveal text-[13px] font-medium text-[#2b685d]">Diseñado por y para psicólogos</p>
              <h2 className="reveal font-serif text-[2.4rem] sm:text-[3rem] leading-[1.02] tracking-[-0.015em] mt-3" style={{ '--i': 1 }}>
                ¿Por qué seguir con cuadernos y planillas?
              </h2>
              <p className="reveal text-[16px] text-[#5c5a53] leading-relaxed mt-5 max-w-md" style={{ '--i': 2 }}>
                Las tareas administrativas no deberían competir con tu tiempo clínico. PsicoPlus se ocupa de lo repetitivo.
              </p>
            </div>

            <ol className="divide-y divide-[#e3dfd5] border-y border-[#e3dfd5]">
              {[
                { icon: BellRing, t: 'Se acabaron las órdenes vencidas', d: 'Te avisamos cuando a un paciente le quedan 2 sesiones autorizadas, para que pidas el nuevo pedido médico a tiempo.' },
                { icon: EyeOff, t: 'Modo privacidad en un clic', d: 'Ocultá al instante nombres, diagnósticos y contactos si entra alguien al consultorio con la pantalla encendida.' },
                { icon: Globe, t: 'Tus pacientes reservan solos', d: 'Compartí tu link de reservas en Instagram o WhatsApp: eligen día y horario sin interrumpir tus sesiones.' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <li key={item.t} className="reveal py-8 grid grid-cols-[auto_1fr] gap-5 sm:gap-8" style={{ '--i': i }}>
                    <span className="font-mono text-[13px] text-[#a29e93] pt-1.5">0{i + 1}</span>
                    <div>
                      <div className="flex items-center gap-3">
                        <Icon size={19} className="text-[#2b685d]" />
                        <h3 className="text-[1.25rem] font-semibold tracking-[-0.015em]">{item.t}</h3>
                      </div>
                      <p className="text-[15.5px] leading-relaxed text-[#5c5a53] mt-2.5 max-w-lg">{item.d}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* FUNCIONALIDADES */}
        <section id="caracteristicas" className="bg-[#fffefb] border-y border-[#e3dfd5] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 lg:py-28">
            <div className="max-w-2xl">
              <p className="reveal text-[13px] font-medium text-[#2b685d]">Todo en un solo lugar</p>
              <h2 className="reveal font-serif text-[2.4rem] sm:text-[3rem] leading-[1.02] tracking-[-0.015em] mt-3" style={{ '--i': 1 }}>
                Herramientas profesionales para tu consultorio.
              </h2>
            </div>

            <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-12 mt-12">
              <div role="tablist" aria-label="Funcionalidades" className="flex lg:flex-col gap-1 overflow-x-auto -mx-4 px-4 lg:mx-0 lg:px-0 pb-1 lg:pb-0">
                {FEATURES.map((f) => {
                  const Icon = f.icon;
                  const isActive = activeTabFeature === f.id;
                  return (
                    <button
                      key={f.id}
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTabFeature(f.id)}
                      className={`flex-shrink-0 h-11 px-3.5 inline-flex items-center gap-3 rounded-lg text-[14.5px] font-medium text-left whitespace-nowrap transition-colors duration-150 ${
                        isActive ? 'bg-[#1d1f1c] text-[#f4f1e8]' : 'text-[#5c5a53] hover:bg-[#1b1d1a]/[0.05] hover:text-[#1b1d1a]'
                      }`}
                    >
                      <Icon size={17} className={isActive ? 'text-[#b5d5cc]' : 'text-[#a29e93]'} />
                      {f.label}
                    </button>
                  );
                })}
              </div>

              <div key={feature.id} role="tabpanel" className="grid md:grid-cols-[1.1fr_1fr] rounded-2xl border border-[#e3dfd5] overflow-hidden animate-fade-in">
                <div className="p-7 sm:p-9 bg-[#fffefb]">
                  <span className="w-10 h-10 rounded-xl bg-[#eef5f3] text-[#22554d] grid place-items-center">
                    <FeatureIcon size={19} />
                  </span>
                  <h3 className="font-serif text-[1.9rem] leading-[1.08] mt-5">{feature.title}</h3>
                  <p className="text-[15.5px] leading-relaxed text-[#5c5a53] mt-3">{feature.text}</p>
                  <ul className="mt-5 space-y-2.5">
                    {feature.bullets.map((b) => (
                      <li key={b} className="flex gap-2.5 text-[14.5px] text-[#2c2d29]">
                        <Check size={16} className="text-[#2b685d] mt-0.5 flex-shrink-0" /> {b}
                      </li>
                    ))}
                  </ul>
                  <button onClick={onStartFree} className="mt-7 inline-flex items-center gap-1.5 text-[14.5px] font-medium text-[#22554d] hover:gap-2.5 transition-[gap] duration-200">
                    Probar gratis en mi consultorio <ArrowRight size={15} />
                  </button>
                </div>

                <div className="bg-[#f1efe9] p-6 sm:p-8 flex items-center justify-center border-t md:border-t-0 md:border-l border-[#e3dfd5]">
                  <div className="w-full max-w-[300px] rounded-xl bg-[#fffefb] border border-[#e3dfd5] shadow-[0_20px_40px_-20px_rgba(27,29,26,.25)] p-4">
                    <div className="flex items-center gap-3 pb-3 border-b border-[#ece9e1]">
                      <span className="w-9 h-9 rounded-full bg-[#eef5f3] text-[#22554d] grid place-items-center text-[12px] font-semibold">VT</span>
                      <span>
                        <span className="block text-[13.5px] font-medium">Lic. Virna Toledo</span>
                        <span className="block text-[11.5px] text-[#78756c]">Psicología clínica · M.P. 1842</span>
                      </span>
                    </div>
                    <dl className="pt-3 space-y-2.5 text-[12.5px]">
                      <div className="flex justify-between gap-3"><dt className="text-[#78756c]">Próximo turno</dt><dd className="font-medium font-mono">16:00 · Centro</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-[#78756c]">Paciente</dt><dd className="font-medium">Agustina Romero</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-[#78756c]">Obra social</dt><dd className="font-medium">OSDE · 7/10</dd></div>
                      <div className="flex justify-between gap-3"><dt className="text-[#78756c]">Coseguro</dt><dd className="font-medium text-[#22554d]">Cobrado $3.000</dd></div>
                    </dl>
                    <div className="mt-4 h-1.5 rounded-full bg-[#ece9e1] overflow-hidden"><div className="h-full w-[70%] bg-[#2b685d] rounded-full" /></div>
                    <p className="text-[11px] text-[#78756c] mt-1.5">Orden médica: 7 de 10 sesiones usadas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* OBRAS SOCIALES · ARCA · SEGURIDAD */}
        <section id="obras-sociales" className="bg-[#173834] text-[#f4f1e8] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 lg:py-28">
            <div className="grid lg:grid-cols-2 gap-12 items-end">
              <h2 className="reveal font-serif text-[2.4rem] sm:text-[3.1rem] leading-[1.02] tracking-[-0.015em]">
                Cumplimiento que no te quita el sueño.
              </h2>
              <p className="reveal text-[16.5px] leading-relaxed text-[#b5d5cc] max-w-lg" style={{ '--i': 1 }}>
                Facturación oficial, liquidaciones por obra social y datos sensibles resguardados. Todo pensado para la normativa argentina.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-px mt-14 rounded-2xl overflow-hidden bg-white/10">
              {[
                { icon: QrCode, t: 'ARCA · RG 4291', d: 'Facturas C y B con CAE y código QR, listas para reintegros de OSDE, Swiss Medical, IOSCOR o Medifé.' },
                { icon: FileText, t: 'Liquidaciones por lote', d: 'Planillas oficiales para el Colegio de Psicólogos y seguimiento de plazos de cobro de 30, 45 o 60 días.' },
                { icon: Lock, t: 'Ley 25.326 · Secreto profesional', d: 'Historias clínicas amparadas por el Art. 156 del Código Penal y modo privacidad en pantalla.' },
              ].map((c, i) => {
                const Icon = c.icon;
                return (
                  <div key={c.t} className="reveal bg-[#173834] p-7 sm:p-8" style={{ '--i': i }}>
                    <Icon size={22} className="text-[#8bbaad]" />
                    <h3 className="text-[1.1rem] font-semibold mt-5">{c.t}</h3>
                    <p className="text-[14.5px] leading-relaxed text-[#b5d5cc]/90 mt-2">{c.d}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PRECIOS */}
        <section id="precios" className="max-w-6xl mx-auto px-4 sm:px-6 py-24 lg:py-32 scroll-mt-16">
          <div className="text-center max-w-2xl mx-auto">
            <p className="reveal text-[13px] font-medium text-[#2b685d]">Transparente y sin sorpresas</p>
            <h2 className="reveal font-serif text-[2.4rem] sm:text-[3rem] leading-[1.02] tracking-[-0.015em] mt-3" style={{ '--i': 1 }}>
              Empezá gratis. Crecé cuando lo necesites.
            </h2>

            <div className="reveal inline-flex items-center p-1 mt-8 rounded-xl bg-[#1b1d1a]/[0.05]" role="radiogroup" aria-label="Ciclo de facturación" style={{ '--i': 2 }}>
              {[
                ['monthly', 'Mensual'],
                ['annual', 'Anual'],
              ].map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  role="radio"
                  aria-checked={pricingCycle === val}
                  onClick={() => setPricingCycle(val)}
                  className={`h-9 px-4 rounded-lg text-[14px] font-medium inline-flex items-center gap-2 transition-colors ${
                    pricingCycle === val ? 'bg-[#fffefb] text-[#1b1d1a] shadow-[0_1px_2px_rgba(27,29,26,.1)]' : 'text-[#5c5a53] hover:text-[#1b1d1a]'
                  }`}
                >
                  {label}
                  {val === 'annual' && <span className="text-[11px] px-1.5 py-px rounded bg-[#eef5f3] text-[#22554d]">−20%</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5 mt-12 max-w-4xl mx-auto">
            {/* Gratis */}
            <div className="reveal rounded-2xl border border-[#e3dfd5] bg-[#fffefb] p-7 sm:p-8 flex flex-col">
              <h3 className="text-[15px] font-semibold">Plan inicial</h3>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-serif text-[3.2rem] leading-none">$0</span>
                <span className="text-[14px] text-[#78756c]">para siempre</span>
              </p>
              <p className="text-[14.5px] text-[#5c5a53] mt-3">Ideal si estás comenzando o tenés un consultorio particular.</p>
              <ul className="mt-6 space-y-2.5 text-[14.5px] flex-1">
                {['Hasta 15 pacientes activos', '1 sede física o atención virtual', 'Agenda y turnos completos', 'Recordatorios por WhatsApp Web', 'Fichas clínicas y notas de sesión', 'Modo privacidad'].map((b) => (
                  <li key={b} className="flex gap-2.5"><Check size={16} className="text-[#2b685d] mt-0.5 flex-shrink-0" /> {b}</li>
                ))}
              </ul>
              <button onClick={onStartFree} className="mt-8 h-11 rounded-xl border border-[#d0ccc1] text-[14.5px] font-medium hover:border-[#a29e93] hover:bg-[#f7f5f0] active:scale-[0.98] transition-[background-color,border-color,transform] duration-150">
                Comenzar gratis
              </button>
            </div>

            {/* PRO */}
            <div className="reveal relative rounded-2xl bg-[#1d1f1c] text-[#f4f1e8] p-7 sm:p-8 flex flex-col shadow-[0_30px_60px_-30px_rgba(27,29,26,.6)]" style={{ '--i': 1 }}>
              <span className="absolute top-6 right-6 text-[11.5px] font-medium px-2 py-0.5 rounded-md bg-[#b5d5cc] text-[#0c201e]">Recomendado</span>
              <h3 className="text-[15px] font-semibold">PsicoPlus PRO</h3>
              <p className="mt-4 flex items-baseline gap-2">
                <span className="font-serif text-[3.2rem] leading-none tabular-nums">{pricingCycle === 'annual' ? '$11.900' : '$14.900'}</span>
                <span className="text-[14px] text-[#a29e93]">/ mes · ARS</span>
              </p>
              <p className="text-[14px] text-[#a29e93] mt-3">
                {pricingCycle === 'annual' ? 'Facturado anualmente ($143.000/año) · ahorrás 2 meses' : 'Sin permanencia · cancelás cuando quieras'}
              </p>
              <ul className="mt-6 space-y-2.5 text-[14.5px] flex-1">
                {['Pacientes ilimitados', 'Sedes ilimitadas (centro, norte, virtual)', 'Liquidaciones de obras sociales por lote', 'Portal de pacientes con tu link propio', 'Informes clínicos y aptos en PDF', 'Reportes financieros y proyección de cobros', 'Backup y exportación a Excel'].map((b) => (
                  <li key={b} className="flex gap-2.5"><Check size={16} className="text-[#8bbaad] mt-0.5 flex-shrink-0" /> {b}</li>
                ))}
              </ul>
              <button onClick={onStartFree} className="mt-8 h-11 rounded-xl bg-[#f4f1e8] text-[#1b1d1a] text-[14.5px] font-medium hover:bg-white active:scale-[0.98] transition-[background-color,transform] duration-150">
                Desbloquear PsicoPlus PRO
              </button>
            </div>
          </div>
        </section>

        {/* TESTIMONIOS */}
        <section id="testimonios" className="bg-[#fffefb] border-y border-[#e3dfd5] scroll-mt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-24 lg:py-28">
            <p className="reveal text-[13px] font-medium text-[#2b685d]">Experiencias</p>
            <figure className="reveal mt-6 max-w-4xl" style={{ '--i': 1 }}>
              <blockquote className="font-serif text-[1.9rem] sm:text-[2.5rem] leading-[1.15] tracking-[-0.01em]">
                “{TESTIMONIOS[0].quote}”
              </blockquote>
              <figcaption className="flex items-center gap-3 mt-7">
                <span className="w-10 h-10 rounded-full bg-[#eef5f3] text-[#22554d] grid place-items-center text-[13px] font-semibold">{TESTIMONIOS[0].initials}</span>
                <span>
                  <span className="block text-[14.5px] font-medium">{TESTIMONIOS[0].name}</span>
                  <span className="block text-[13px] text-[#78756c]">{TESTIMONIOS[0].role}</span>
                </span>
              </figcaption>
            </figure>

            <div className="grid md:grid-cols-2 gap-5 mt-16">
              {TESTIMONIOS.slice(1).map((t, i) => (
                <figure key={t.name} className="reveal rounded-2xl border border-[#e3dfd5] bg-[#f7f5f0] p-7" style={{ '--i': i }}>
                  <blockquote className="text-[16px] leading-relaxed text-[#2c2d29]">“{t.quote}”</blockquote>
                  <figcaption className="flex items-center gap-3 mt-6">
                    <span className="w-9 h-9 rounded-full bg-[#fffefb] border border-[#e3dfd5] text-[#22554d] grid place-items-center text-[12px] font-semibold">{t.initials}</span>
                    <span>
                      <span className="block text-[14px] font-medium">{t.name}</span>
                      <span className="block text-[12.5px] text-[#78756c]">{t.role}</span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="max-w-6xl mx-auto px-4 sm:px-6 py-24 lg:py-32 grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20 scroll-mt-16">
          <div>
            <p className="reveal text-[13px] font-medium text-[#2b685d]">Resolvé tus dudas</p>
            <h2 className="reveal font-serif text-[2.4rem] sm:text-[3rem] leading-[1.02] tracking-[-0.015em] mt-3" style={{ '--i': 1 }}>
              Preguntas frecuentes
            </h2>
            <p className="reveal text-[15px] text-[#5c5a53] mt-4" style={{ '--i': 2 }}>
              ¿Algo más? Revisá nuestro{' '}
              <button onClick={legal('privacidad')} className="underline underline-offset-4 decoration-[#d0ccc1] hover:decoration-[#22554d] text-[#1b1d1a]">centro legal</button>.
            </p>
          </div>

          <div className="border-t border-[#e3dfd5]">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="border-b border-[#e3dfd5]">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="w-full min-h-16 py-4 flex items-center justify-between gap-6 text-left text-[16.5px] font-medium hover:text-[#22554d] transition-colors"
                  >
                    {faq.q}
                    <Plus size={18} className={`flex-shrink-0 text-[#78756c] transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
                  </button>
                  <div className={`grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(.23,1,.32,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                    <div className="overflow-hidden">
                      <p className="pb-5 pr-10 text-[15px] leading-relaxed text-[#5c5a53]">{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="px-4 sm:px-6 pb-24">
          <div className="reveal max-w-6xl mx-auto rounded-[28px] bg-[#1c4540] text-[#f4f1e8] px-6 sm:px-12 py-16 sm:py-20 relative overflow-hidden">
            <span aria-hidden="true" className="absolute -right-6 -bottom-24 font-serif text-[22rem] leading-none text-white/[0.04] select-none">Ψ</span>
            <div className="relative max-w-2xl">
              <h2 className="font-serif text-[2.5rem] sm:text-[3.4rem] leading-[1.02] tracking-[-0.015em]">
                Tu consultorio, ordenado desde <em className="text-[#b5d5cc]">hoy</em>.
              </h2>
              <p className="text-[16.5px] text-[#b5d5cc] mt-5">
                Creá tu cuenta gratis en menos de un minuto y descubrí por qué los psicólogos eligen PsicoPlus.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-9">
                <button onClick={onStartFree} className="h-12 px-6 inline-flex items-center justify-center gap-2 rounded-xl bg-[#f4f1e8] text-[#1b1d1a] text-[15px] font-medium hover:bg-white active:scale-[0.97] transition-[background-color,transform] duration-150">
                  Crear cuenta gratuita <ArrowRight size={17} />
                </button>
                <button onClick={onOpenDemo} className="h-12 px-6 inline-flex items-center justify-center rounded-xl border border-white/20 text-[15px] font-medium hover:bg-white/5 active:scale-[0.97] transition-[background-color,transform] duration-150">
                  Explorar demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#e3dfd5] bg-[#f1eee6]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <BrandMark size={30} />
              <BrandWordmark className="text-[#1b1d1a]" />
            </div>
            <p className="text-[14px] text-[#5c5a53] leading-relaxed mt-4 max-w-xs">
              Gestión clínica, agenda multisede y facturación ARCA para profesionales de la salud mental.
            </p>
            <p className="inline-flex items-center gap-2 text-[12.5px] text-[#5c5a53] mt-5">
              <span className="w-2 h-2 rounded-full bg-[#3f8174]" /> Servicio operativo
            </p>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-[#1b1d1a]">Producto</h4>
            <ul className="mt-4 space-y-2.5 text-[14px] text-[#5c5a53]">
              <li><a href="#caracteristicas" className="hover:text-[#1b1d1a]">Agenda inteligente</a></li>
              <li><a href="#obras-sociales" className="hover:text-[#1b1d1a]">Obras sociales y prepagas</a></li>
              <li><a href="#obras-sociales" className="hover:text-[#1b1d1a]">Facturación ARCA</a></li>
              <li><button onClick={onGoToPortal} className="hover:text-[#1b1d1a]">Portal de pacientes</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-[#1b1d1a]">Legal</h4>
            <ul className="mt-4 space-y-2.5 text-[14px] text-[#5c5a53]">
              <li><button onClick={legal('terminos')} className="text-left hover:text-[#1b1d1a]">Términos y condiciones</button></li>
              <li><button onClick={legal('privacidad')} className="text-left hover:text-[#1b1d1a]">Privacidad (Ley 25.326)</button></li>
              <li><button onClick={legal('cookies')} className="text-left hover:text-[#1b1d1a]">Cookies y almacenamiento</button></li>
              <li><button onClick={legal('salud-mental')} className="text-left hover:text-[#1b1d1a]">Salud mental y ARCA</button></li>
              <li><button onClick={legal('auditoria')} className="text-left hover:text-[#1b1d1a]">Auditoría de seguridad</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold text-[#1b1d1a]">Garantías</h4>
            <ul className="mt-4 space-y-4 text-[13.5px] text-[#5c5a53]">
              <li className="flex gap-2.5">
                <ShieldCheck size={16} className="text-[#2b685d] flex-shrink-0 mt-0.5" />
                <span><span className="text-[#1b1d1a] font-medium">Ley 25.326.</span> Historias clínicas amparadas por secreto profesional (C.P. Art. 156).</span>
              </li>
              <li className="flex gap-2.5">
                <Receipt size={16} className="text-[#2b685d] flex-shrink-0 mt-0.5" />
                <span><span className="text-[#1b1d1a] font-medium">ARCA RG 4291.</span> Comprobantes con QR y CAE homologado.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#e3dfd5]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12.5px] text-[#78756c]">
            <p>© {new Date().getFullYear()} PsicoPlus. Todos los derechos reservados.</p>
            <div className="flex gap-5">
              <button onClick={legal('terminos')} className="hover:text-[#1b1d1a]">Términos</button>
              <button onClick={legal('privacidad')} className="hover:text-[#1b1d1a]">Privacidad</button>
              <button onClick={legal('cookies')} className="hover:text-[#1b1d1a]">Cookies</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
