import React, { useState } from 'react';
import { 
  HeartPulse, 
  Sparkles, 
  CalendarDays, 
  Shield, 
  FileSpreadsheet, 
  Globe, 
  Receipt, 
  Users, 
  Check, 
  ArrowRight, 
  EyeOff, 
  MessageSquare, 
  Lock, 
  CheckCircle2, 
  Zap, 
  Award, 
  ChevronDown, 
  ChevronUp,
  Play,
  HelpCircle,
  TrendingUp,
  Building2
} from 'lucide-react';
import { ProBadge } from '../Common/ProBadge';

export const LandingPage = ({ 
  onStartFree, 
  onLogin, 
  onOpenDemo, 
  onGoToPortal 
}) => {
  const [activeTabFeature, setActiveTabFeature] = useState('agenda');
  const [openFaq, setOpenFaq] = useState(null);
  const [pricingCycle, setPricingCycle] = useState('annual');

  const faqs = [
    {
      q: '¿El plan inicial es realmente gratis?',
      a: 'Sí, totalmente gratuito. Podés gestionar hasta 15 pacientes activos, tu agenda de turnos completa, historias clínicas y registro de cobros sin pagar nada ni ingresar tarjeta de crédito.',
    },
    {
      q: '¿Cómo funciona el desbloqueo del Plan PRO?',
      a: 'Cuando tu consultorio crezca o necesites funciones avanzadas (como pacientes ilimitados, múltiples sedes, liquidación masiva de obras sociales o informes clínicos en PDF), podés desbloquear el Plan PRO con suscripción mensual, anual con descuento o códigos promocionales de convenios con colegios de psicólogos.',
    },
    {
      q: '¿Mis datos y los de mis pacientes están protegidos?',
      a: 'Absolutamente. PsicoPlus está diseñado siguiendo las normas de confidencialidad y secreto profesional médico. Tus registros se almacenan de manera segura y contás con la función exclusiva "Modo Privacidad" para ocultar datos sensibles en pantalla en cualquier momento con un solo clic.',
    },
    {
      q: '¿Puedo usarlo en el celular o tablet?',
      a: 'Sí, PsicoPlus es 100% responsivo y funciona como una aplicación web progresiva (PWA) tanto en tu computadora de escritorio como en smartphones Android e iPhone.',
    },
    {
      q: '¿Qué obras sociales y prepagas incluye?',
      a: 'Viene con convenios y aranceles pre-configurados para las principales obras sociales y prepagas de Argentina (IOSCOR, OSDE, Swiss Medical, Medifé, Galeno, Sancor Salud, PAMI, etc.) y podés personalizar o agregar las de tu propia provincia.',
    }
  ];

  return (
    <div className="min-h-screen bg-[#070e0b] text-slate-100 selection:bg-emerald-500 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-emerald-950 text-emerald-200 text-xs py-2 px-4 text-center border-b border-emerald-800/50 flex items-center justify-center gap-2">
        <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full text-[10px] uppercase border border-emerald-400/30">
          Lanzamiento 2026
        </span>
        <span>🎉 Comenzá hoy tu consultorio digital <strong>100% Gratis</strong> sin tarjeta.</span>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-[#070e0b]/90 backdrop-blur-md border-b border-emerald-900/50 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
              <HeartPulse size={22} className="text-[#070e0b]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white font-display">PsicoPlus</span>
                <span className="text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30">APP</span>
              </div>
              <p className="text-[10px] text-emerald-400/70 font-medium hidden sm:block">Gestión Clínica para Psicólogos</p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-emerald-200/80">
            <a href="#caracteristicas" className="hover:text-emerald-400 transition-colors">Funcionalidades</a>
            <a href="#obras-sociales" className="hover:text-emerald-400 transition-colors">Obras Sociales</a>
            <a href="#precios" className="hover:text-emerald-400 transition-colors">Planes & Precios</a>
            <a href="#testimonios" className="hover:text-emerald-400 transition-colors">Testimonios</a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">Preguntas Frecuentes</a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onLogin}
              className="px-3.5 py-1.5 text-xs font-bold text-emerald-200 hover:text-white transition-colors"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={onStartFree}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Sparkles size={13} className="text-slate-950" />
              <span>Crear Cuenta Gratis</span>
            </button>
          </div>

        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        
        {/* Glow ambient lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-6 shadow-sm">
            <Sparkles size={14} className="text-amber-400" />
            <span>El Software Clínico #1 para Psicólogos y Consultorios</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] font-display mb-6">
            Menos tiempo en planillas, <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              más tiempo para tus pacientes.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-emerald-100/75 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            Agenda multisede inteligente, fichas de pacientes protegidas con secreto profesional, control estricto de órdenes de obras sociales y portal web de auto-reserva de turnos.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
            <button
              onClick={onStartFree}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Comenzar Gratis Ahora</span>
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-emerald-200 border border-emerald-700/60 font-bold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Play size={15} className="text-emerald-400 fill-emerald-400" />
              <span>Ver Demo Interactiva</span>
            </button>
          </div>

          {/* Value Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-emerald-300/80 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>Plan Gratuito sin vencimiento</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>Sin tarjeta de crédito</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              <span>Modo Privacidad Confidencial</span>
            </div>
          </div>

        </div>

        {/* Live Mockup Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-14 relative z-10">
          <div className="p-2 sm:p-3 rounded-3xl bg-gradient-to-b from-emerald-500/30 via-slate-800/40 to-transparent border border-emerald-500/40 shadow-2xl backdrop-blur-sm">
            <div className="bg-[#0b1612] rounded-2xl overflow-hidden border border-emerald-900/80">
              
              {/* Window Header */}
              <div className="px-4 py-3 bg-[#08100d] border-b border-emerald-900/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-[11px] text-emerald-400/60 font-mono ml-2">psicoplus.app / consultorio</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    En vivo
                  </span>
                </div>
              </div>

              {/* Mockup Content */}
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Metric 1 */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-900/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium">Turnos de Hoy</span>
                    <CalendarDays size={16} className="text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">6 Sesiones</div>
                  <p className="text-[11px] text-emerald-400 font-semibold mt-1">4 Presenciales • 2 Virtuales</p>
                </div>

                {/* Metric 2 */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-900/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium">O.S. en Gestión</span>
                    <Receipt size={16} className="text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">$ 468.500</div>
                  <p className="text-[11px] text-amber-400 font-semibold mt-1">2 Órdenes por vencer esta semana</p>
                </div>

                {/* Metric 3 */}
                <div className="p-4 rounded-xl bg-slate-900/80 border border-emerald-900/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400 font-medium">Portal Online</span>
                    <Globe size={16} className="text-sky-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">3 Solicitudes</div>
                  <p className="text-[11px] text-sky-400 font-semibold mt-1">Pacientes esperando confirmación</p>
                </div>

              </div>

            </div>
          </div>
        </div>

      </section>

      {/* Main Problem / Solution */}
      <section className="py-16 bg-[#09130f] border-y border-emerald-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 font-mono">
              Diseñado por y para Psicólogos
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              ¿Por qué seguir perdiendo tiempo con planillas y cuadernos?
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-[#0b1612] border border-emerald-900/50 hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
                <FileSpreadsheet size={20} />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Se acabaron las órdenes vencidas</h4>
              <p className="text-xs text-emerald-100/70 leading-relaxed">
                PsicoPlus te avisa automáticamente cuando a un paciente le quedan 2 sesiones autorizadas para que le pidas el nuevo pedido médico a tiempo.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b1612] border border-emerald-900/50 hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4">
                <EyeOff size={20} />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Modo Privacidad en 1 Clic</h4>
              <p className="text-xs text-emerald-100/70 leading-relaxed">
                Ocultá al instante nombres, diagnósticos o números de contacto si entra un paciente a sesión y tenés la pantalla encendida.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0b1612] border border-emerald-900/50 hover:border-emerald-500/40 transition-all">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4">
                <Globe size={20} />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Portal Web para tus Pacientes</h4>
              <p className="text-xs text-emerald-100/70 leading-relaxed">
                Compartí tu link de reservas en tu perfil de Instagram o WhatsApp para que tus pacientes elijan día y horario sin interrumpir tus sesiones.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Features Tabs Section */}
      <section id="caracteristicas" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 font-mono">
            Todo lo que necesitás en un solo lugar
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Herramientas profesionales creadas para tu consultorio
          </h3>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {[
            { id: 'agenda', label: 'Agenda & WhatsApp', icon: CalendarDays },
            { id: 'pacientes', label: 'Historias Clínicas', icon: Users },
            { id: 'obras-sociales', label: 'Obras Sociales & Liquidaciones', icon: Receipt },
            { id: 'portal', label: 'Portal de Turnos Online', icon: Globe },
            { id: 'finanzas', label: 'Finanzas & Facturas', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTabFeature === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabFeature(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-[#0b1612] text-emerald-300/70 hover:text-white border border-emerald-900/60'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Feature Detail View */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1612] border border-emerald-500/30 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          <div>
            {activeTabFeature === 'agenda' && (
              <>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <CalendarDays size={20} />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Agenda Multisede con WhatsApp en 1 Clic</h4>
                <p className="text-xs text-emerald-100/75 leading-relaxed mb-4">
                  Visualizá tu semana de un vistazo discriminando por consultorio físico o telepsicología online. Enviá recordatorios personalizados a través de WhatsApp Web con un solo toque.
                </p>
                <ul className="space-y-2 text-xs text-emerald-200/90 mb-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Estados de turnos: Confirmado, En Espera, Atendido, Ausente.</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Registro simultáneo de cobro de coseguro en efectivo o transferencia.</li>
                </ul>
              </>
            )}

            {activeTabFeature === 'pacientes' && (
              <>
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center mb-4">
                  <Users size={20} />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Ficha Clínica y Evolución Cronológica</h4>
                <p className="text-xs text-emerald-100/75 leading-relaxed mb-4">
                  Guardá el historial completo de cada paciente, motivo de consulta, diagnósticos DSM-5 / CIE-11 y notas de evolución de cada sesión con fecha exacta.
                </p>
                <ul className="space-y-2 text-xs text-emerald-200/90 mb-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> Contador automático de sesiones de la orden médica.</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> Búsqueda rápida por nombre o DNI con Ctrl + K.</li>
                </ul>
              </>
            )}

            {activeTabFeature === 'obras-sociales' && (
              <>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                  <Receipt size={20} />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Liquidaciones y Convenios Pre-configurados</h4>
                <p className="text-xs text-emerald-100/75 leading-relaxed mb-4">
                  Control estricto de aranceles de obras sociales, coseguros obligatorios, plazos de cobro (30, 45 o 60 días) y generación de planillas oficiales para el Colegio de Psicólogos.
                </p>
                <ul className="space-y-2 text-xs text-emerald-200/90 mb-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-amber-400" /> IOSCOR, OSDE, Swiss Medical, Medifé y particulares.</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-amber-400" /> Exportación en PDF con formato oficial de liquidación.</li>
                </ul>
              </>
            )}

            {activeTabFeature === 'portal' && (
              <>
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                  <Globe size={20} />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Portal de Reservas Online para Pacientes</h4>
                <p className="text-xs text-emerald-100/75 leading-relaxed mb-4">
                  Tus pacientes acceden a un enlace público donde eligen sede, fecha y horario disponible. Vos recibís la solicitud y la confirmás con un clic.
                </p>
                <ul className="space-y-2 text-xs text-emerald-200/90 mb-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-sky-400" /> Configuración de días y horarios de atención disponibles.</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-sky-400" /> Sin interrupciones durante tus sesiones de terapia.</li>
                </ul>
              </>
            )}

            {activeTabFeature === 'finanzas' && (
              <>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                  <TrendingUp size={20} />
                </div>
                <h4 className="text-xl font-bold text-white mb-3">Control de Caja, Honorarios y Facturas AFIP</h4>
                <p className="text-xs text-emerald-100/75 leading-relaxed mb-4">
                  Sabé con precisión cuánto ingresó en efectivo, cuánto por transferencia y cuánto tenés pendiente de cobro de cada obra social.
                </p>
                <ul className="space-y-2 text-xs text-emerald-200/90 mb-6">
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Emisión de Recibos y Facturas C para reintegro.</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Proyecciones de ingresos reales del mes.</li>
                </ul>
              </>
            )}

            <button
              onClick={onStartFree}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Probar gratis en mi consultorio</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Feature Visual Box */}
          <div className="p-5 rounded-2xl bg-[#08100d] border border-emerald-900/80 shadow-inner">
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    VT
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Lic. Virna Toledo</div>
                    <div className="text-[11px] text-emerald-400">Psicología Clínica • M.P. 1842</div>
                  </div>
                </div>
                <ProBadge text="Activo" size="xs" />
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-200 space-y-1.5">
                <div className="flex justify-between font-medium">
                  <span>Próximo Turno:</span>
                  <span className="text-white font-bold">16:00 hs (Sede Centro)</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Paciente:</span>
                  <span className="text-white">Agustina Romero (OSDE)</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Estado Coseguro:</span>
                  <span className="text-emerald-400 font-bold">Cobrado ($3.000)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* Pricing Section */}
      <section id="precios" className="py-20 bg-[#09130f] border-t border-emerald-950">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-3">
              <Sparkles size={13} className="text-amber-400" />
              <span>Transparente y sin sorpresas</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white font-display mb-3">
              Planes a la medida de tu práctica profesional
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100/70">
              Comenzá 100% gratis. Desbloqueá funciones avanzadas cuando tu consultorio lo requiera.
            </p>
          </div>

          {/* Pricing Toggle */}
          <div className="flex justify-center mb-12">
            <div className="bg-[#0b1612] p-1 rounded-2xl border border-emerald-900/80 inline-flex items-center">
              <button
                type="button"
                onClick={() => setPricingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  pricingCycle === 'monthly'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mensual
              </button>
              <button
                type="button"
                onClick={() => setPricingCycle('annual')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  pricingCycle === 'annual'
                    ? 'bg-gradient-to-r from-emerald-600 to-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Anual</span>
                <span className="bg-amber-400 text-slate-950 text-[10px] font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                  20% OFF
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto">
            
            {/* Plan Gratis */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1612] border border-emerald-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-white font-display">Plan Inicial</h4>
                  <span className="text-xs font-bold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full">
                    GRATIS
                  </span>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">$ 0</span>
                    <span className="text-xs text-slate-400">/ para siempre</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">Ideal para psicólogos que están comenzando o tienen consultorio particular.</p>
                </div>

                <ul className="space-y-3 text-xs text-slate-300 mb-8">
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Hasta <strong>15 pacientes activos</strong></li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> 1 Sede física o atención virtual</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Agenda y turnos completos</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Recordatorios de WhatsApp Web</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Fichas clínicas y notas de sesión</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Modo Privacidad Confidencial</li>
                </ul>
              </div>

              <button
                onClick={onStartFree}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all"
              >
                Comenzar Gratis
              </button>
            </div>

            {/* Plan PRO */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0e211a] via-[#0b1612] to-[#080d14] border-2 border-emerald-500/50 shadow-2xl relative flex flex-col justify-between">
              
              <div className="absolute -top-3.5 right-6">
                <ProBadge text="RECOMENDADO" size="md" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-white font-display flex items-center gap-1.5">
                    <span>PsicoPlus PRO</span>
                    <Sparkles size={16} className="text-amber-400" />
                  </h4>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">
                      {pricingCycle === 'annual' ? '$ 11.900' : '$ 14.900'}
                    </span>
                    <span className="text-xs text-slate-400">/ mes (ARS)</span>
                  </div>
                  <p className="text-xs text-amber-300/80 mt-1">
                    {pricingCycle === 'annual' ? 'Facturado anualmente ($143.000/año) • Ahorrás 2 meses' : 'Sin permanencia • Cancelás cuando quieras'}
                  </p>
                </div>

                <ul className="space-y-3 text-xs text-emerald-100 mb-8">
                  <li className="flex items-center gap-2 font-bold text-white"><Check size={14} className="text-emerald-400" /> <strong>Pacientes Ilimitados</strong></li>
                  <li className="flex items-center gap-2 font-bold text-white"><Check size={14} className="text-emerald-400" /> <strong>Multisedes Ilimitadas</strong> (Centro, Norte, Virtual)</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> <strong>Liquidaciones de Obras Sociales Masivas por Lotes</strong></li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> <strong>Portal de Pacientes Personalizado</strong> con tu link propio</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Informes Clínicos y Aptos Psicológicos en PDF</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Reportes Financieros & Proyección de cobros</li>
                  <li className="flex items-center gap-2"><Check size={14} className="text-emerald-400" /> Backup y exportación total a Excel</li>
                </ul>
              </div>

              <button
                onClick={onStartFree}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Zap size={14} className="fill-slate-950" />
                <span>Desbloquear PsicoPlus PRO</span>
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonios" className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 font-mono">
            Experiencias Reales
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
            Lo que dicen psicólogos que ya usan PsicoPlus
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-[#0b1612] border border-emerald-900/50">
            <div className="flex items-center gap-1 text-amber-400 mb-3 text-xs">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-emerald-100/80 italic mb-4 leading-relaxed">
              "Antes perdía horas a fin de mes contando las sesiones de las órdenes de IOSCOR y OSDE. Con PsicoPlus genero la liquidación en 2 minutos y no se me pasa ningún coseguro."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600/30 text-emerald-300 flex items-center justify-center font-bold text-xs">
                MR
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">Lic. Matías Ríos</h5>
                <p className="text-[11px] text-emerald-400/70">Psicólogo Clínico • Corrientes</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b1612] border border-emerald-900/50">
            <div className="flex items-center gap-1 text-amber-400 mb-3 text-xs">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-emerald-100/80 italic mb-4 leading-relaxed">
              "El portal de turnos es una maravilla. Lo puse en mi biografía de Instagram y mis nuevos pacientes solicitan turno directo. Además el modo privacidad me da total tranquilidad en el consultorio."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-600/30 text-teal-300 flex items-center justify-center font-bold text-xs">
                SB
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">Lic. Sofia Benítez</h5>
                <p className="text-[11px] text-emerald-400/70">Terapia Cognitivo Conductual • Resistencia</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0b1612] border border-emerald-900/50">
            <div className="flex items-center gap-1 text-amber-400 mb-3 text-xs">
              {'★'.repeat(5)}
            </div>
            <p className="text-xs text-emerald-100/80 italic mb-4 leading-relaxed">
              "Atiendo en dos consultorios distintos y hago sesiones online los viernes. Poder filtrar la agenda por sede y enviar el mensaje de confirmación por WhatsApp en un toque me cambió la vida."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sky-600/30 text-sky-300 flex items-center justify-center font-bold text-xs">
                VT
              </div>
              <div>
                <h5 className="text-xs font-bold text-white">Lic. Virna Toledo</h5>
                <p className="text-[11px] text-emerald-400/70">Psicóloga Especialista • Corrientes</p>
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-[#09130f] border-t border-emerald-950">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2 font-mono">
              Resolvé tus Dudas
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Preguntas Frecuentes
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx}
                  className="rounded-2xl bg-[#0b1612] border border-emerald-900/50 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-emerald-300 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={16} className="text-emerald-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 text-xs text-emerald-100/75 leading-relaxed border-t border-emerald-900/30 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-950/40 to-transparent pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10">
            <HeartPulse size={28} />
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display mb-4">
            Empezá a organizar tu consultorio hoy mismo
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/70 max-w-xl mx-auto mb-8">
            Creá tu cuenta gratis en menos de 1 minuto y descubrí por qué los psicólogos eligen PsicoPlus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onStartFree}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span>Crear Cuenta Gratuita</span>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={onOpenDemo}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-emerald-200 border border-emerald-700/60 font-bold text-sm rounded-2xl transition-all"
            >
              Explorar Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-emerald-950 bg-[#060c09] py-10 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <HeartPulse size={14} />
            </div>
            <span className="font-bold text-slate-300 font-display">PsicoPlus</span>
            <span>— Software Clínico para Psicólogos</span>
          </div>
          <p>© {new Date().getFullYear()} PsicoPlus. Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
};
