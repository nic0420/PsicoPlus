import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  FileText, 
  Lock, 
  Cookie, 
  Scale, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ExternalLink,
  Download,
  Check
} from 'lucide-react';
import { runSecurityAudit } from '../../services/securityService';
import { useToast } from '../Common/Toast';

export const LegalModal = ({
  isOpen,
  onClose,
  initialTab = 'terminos' // 'terminos' | 'privacidad' | 'cookies' | 'salud-mental' | 'auditoria'
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [auditData, setAuditData] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [cookiePrefs, setCookiePrefs] = useState({
    esenciales: true,
    preferencias: true,
    analitica: false
  });
  const toast = useToast();

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (isOpen) {
      handleRunAudit();
      const savedPrefs = localStorage.getItem('psicoplus_cookie_prefs');
      if (savedPrefs) {
        try {
          setCookiePrefs(JSON.parse(savedPrefs));
        } catch (e) {}
      }
    }
  }, [isOpen]);

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setAuditData(runSecurityAudit());
      setIsAuditing(false);
    }, 450);
  };

  const handleSaveCookiePrefs = () => {
    localStorage.setItem('psicoplus_cookie_consent', 'custom');
    localStorage.setItem('psicoplus_cookie_prefs', JSON.stringify(cookiePrefs));
    toast.showSuccess('Preferencias de privacidad y cookies guardadas correctamente.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md" 
      />

      <div className="relative w-full max-w-4xl bg-slate-900 border border-emerald-900/60 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-emerald-950 bg-[#08120d]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-white flex items-center gap-2">
                Centro Legal, Seguridad & Cumplimiento Normativo
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ley 25.326 & ARCA
                </span>
              </h2>
              <p className="text-xs text-emerald-200/60">
                Políticas de privacidad, términos de servicio y auditoría de seguridad clínica para psicólogos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-6 py-2 bg-slate-950/60 border-b border-emerald-950/60 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('terminos')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'terminos'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText size={14} />
            <span>Términos y Condiciones</span>
          </button>

          <button
            onClick={() => setActiveTab('privacidad')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'privacidad'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Lock size={14} />
            <span>Política de Privacidad (Ley 25.326)</span>
          </button>

          <button
            onClick={() => setActiveTab('cookies')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'cookies'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cookie size={14} />
            <span>Cookies & Almacenamiento</span>
          </button>

          <button
            onClick={() => setActiveTab('salud-mental')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'salud-mental'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Scale size={14} />
            <span>Marco Legal & Obras Sociales</span>
          </button>

          <button
            onClick={() => setActiveTab('auditoria')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'auditoria'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Activity size={14} />
            <span>Auditoría de Seguridad en Vivo</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 sm:p-7 overflow-y-auto text-xs text-slate-300 space-y-5 leading-relaxed">
          
          {/* TAB 1: Términos y Condiciones */}
          {activeTab === 'terminos' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-[#0b1612] border border-emerald-900/50">
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <FileText size={16} className="text-emerald-400" />
                  Términos y Condiciones Generales de Uso de PsicoPlus
                </h3>
                <p className="text-[11px] text-emerald-200/70">
                  Última actualización: Septiembre de 2026 • Válido para la República Argentina y uso internacional.
                </p>
              </div>

              <div className="space-y-3 text-slate-300">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">1. Aceptación y Objeto</h4>
                <p>
                  El acceso y utilización de la plataforma <strong>PsicoPlus</strong> (en adelante, "el Software" o "el Servicio") implica la aceptación plena y sin reservas de los presentes Términos y Condiciones. PsicoPlus es un software como servicio (SaaS) y herramienta tecnológica auxiliar diseñada específicamente para profesionales habilitados en Psicología, Psiquiatría y disciplinas afines de la salud mental.
                </p>

                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">2. Responsabilidad Profesional y Matrícula Habilitante</h4>
                <p>
                  El usuario profesional declara bajo juramento estar debidamente matriculado ante el Colegio de Psicólogos o autoridad sanitaria competente de su jurisdicción provincial o nacional. La gestión clínica, el diagnóstico, las evoluciones terapéuticas, la prescripción y los actos profesionales son de exclusiva responsabilidad del profesional tratante, en concordancia con el Código de Ética de la Federación de Psicólogos de la República Argentina (FePRA).
                </p>

                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">3. Facturación Electrónica e Integración con ARCA</h4>
                <p>
                  El módulo de facturación y comprobantes fiscales opera en estricta consonancia con las normativas vigentes emitidas por la <strong>Agencia de Recaudación y Control Aduanero (ARCA, ex-AFIP)</strong>, incluyendo la Resolución General AFIP 1415, 2485 y 4291/2018. El profesional es el único responsable de la veracidad de los datos fiscales, montos, alícuotas y declaraciones juradas emitidas bajo su CUIT/CUIL y Clave Fiscal.
                </p>

                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">4. Portal de Turnos y Relación con Pacientes</h4>
                <p>
                  El portal de reserva de turnos para pacientes constituye un canal de comunicación directo entre el paciente y el consultorio. La confirmación o cancelación de turnos, así como la fijación de aranceles y coseguros de obras sociales o prepagas, son convenidas exclusivamente entre el paciente y el psicólogo.
                </p>

                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">5. Propiedad Intelectual y Disponibilidad del Servicio</h4>
                <p>
                  Los algoritmos, interfaz, diseño y arquitectura de PsicoPlus son propiedad intelectual protegida por la Ley 11.723 de Propiedad Intelectual. PsicoPlus no reclama propiedad alguna sobre las historias clínicas ni los datos ingresados por los profesionales, garantizando el derecho permanente de exportación y respaldo de la información.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Política de Privacidad */}
          {activeTab === 'privacidad' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-[#0b1612] border border-emerald-900/50">
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <Lock size={16} className="text-emerald-400" />
                  Política de Privacidad y Protección de Datos Personales
                </h3>
                <p className="text-[11px] text-emerald-200/70">
                  En cumplimiento riguroso de la Ley Nacional de Protección de Datos Personales N° 25.326 y estándares internacionales de confidencialidad médica.
                </p>
              </div>

              <div className="space-y-3 text-slate-300">
                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">1. Datos Sensibles y Salud Mental (Art. 2 y Art. 7 Ley 25.326)</h4>
                <p>
                  Los datos vinculados a la salud mental, motivos de consulta, notas de evolución y diagnósticos tienen carácter de <strong>Datos Sensibles</strong> conforme al Artículo 2° de la Ley 25.326. PsicoPlus aplica medidas de seguridad de nivel médico:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-300">
                  <li><strong>Sin venta ni comercialización:</strong> Jamás vendemos, alquilamos ni cedemos datos personales o clínicos a aseguradoras, farmacéuticas ni redes publicitarias.</li>
                  <li><strong>Secreto Profesional:</strong> Tratamiento confidencial amparado por el Artículo 156 del Código Penal de la Nación Argentina y las leyes provinciales de ejercicio de la psicología.</li>
                  <li><strong>Modo Privacidad en Pantalla:</strong> Herramienta para ofuscar nombres y diagnósticos durante la atención presencial para evitar miradas indiscretas.</li>
                </ul>

                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">2. Almacenamiento Seguro y Criptografía</h4>
                <p>
                  Las contraseñas de acceso son protegidas con funciones criptográficas unidireccionales (SHA-256) con salado individual mediante la Web Crypto API del navegador. La información viaja encriptada bajo túneles TLS 1.3 con certificados SSL de alta seguridad.
                </p>

                <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">3. Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)</h4>
                <p>
                  En cumplimiento del Artículo 14 de la Ley 25.326, tanto los profesionales como los pacientes (a través de sus terapeutas) tienen derecho a solicitar el acceso gratuito a sus datos, así como su rectificación, actualización o supresión en cualquier momento mediante la función de exportación de backups o contactando al soporte técnico.
                </p>

                <div className="p-3 bg-emerald-950/40 rounded-xl border border-emerald-900/60 text-[11px] text-emerald-200">
                  <strong>Órgano de Control en Argentina:</strong> La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Cookies & Almacenamiento */}
          {activeTab === 'cookies' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-[#0b1612] border border-emerald-900/50">
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <Cookie size={16} className="text-emerald-400" />
                  Política de Cookies y Almacenamiento Local (LocalStorage)
                </h3>
                <p className="text-[11px] text-emerald-200/70">
                  Transparencia absoluta: conocé qué guardamos en tu navegador y personalizá tus opciones de privacidad.
                </p>
              </div>

              <p>
                PsicoPlus prioriza la privacidad: <strong>no utilizamos cookies de seguimiento publicitario ni píxeles invasivos de terceros</strong>. Empleamos el almacenamiento local seguro del navegador (LocalStorage y cookies de sesión) con el único fin de garantizar el funcionamiento fluido de tu consultorio.
              </p>

              {/* Selector de Preferencias */}
              <div className="p-4 bg-slate-950 rounded-2xl border border-emerald-900/60 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Configuración de Preferencias</h4>
                
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>Cookies & Storage Esenciales</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Obligatorias</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Necesarias para autenticación, sesión del psicólogo, almacenamiento de turnos y seguridad contra ataques.
                      </p>
                    </div>
                    <input type="checkbox" checked disabled className="w-4 h-4 accent-emerald-500 cursor-not-allowed" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>Preferencias de Experiencia & Consultorio</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Recomendado</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Recuerda tu elección de Modo Oscuro, vista activa y configuración del Modo Privacidad para sala de espera.
                      </p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={cookiePrefs.preferencias} 
                      onChange={(e) => setCookiePrefs({ ...cookiePrefs, preferencias: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer" 
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <span>Telemetría de Rendimiento Anónima</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">Opcional</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Métricas agregadas sobre velocidad de carga de la agenda y reportes de errores sin datos personales.
                      </p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={cookiePrefs.analitica} 
                      onChange={(e) => setCookiePrefs({ ...cookiePrefs, analitica: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500 cursor-pointer" 
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSaveCookiePrefs}
                    className="btn btn-primary text-xs py-2 px-4 font-bold flex items-center gap-1.5"
                  >
                    <Check size={14} />
                    <span>Guardar Preferencias de Privacidad</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Marco Legal Salud Mental & Obras Sociales */}
          {activeTab === 'salud-mental' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-[#0b1612] border border-emerald-900/50">
                <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                  <Scale size={16} className="text-emerald-400" />
                  Marco Normativo en Salud Mental, Obras Sociales y ARCA
                </h3>
                <p className="text-[11px] text-emerald-200/70">
                  Regulaciones sanitarias y fiscales que amparan el ejercicio profesional y la facturación en Argentina.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-900/40 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Ley Nacional de Salud Mental N° 26.657
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Garantiza el derecho a la protección de la salud mental de todas las personas y el pleno goce de los derechos humanos. PsicoPlus preserva la autonomía del paciente y promueve la confidencialidad de la atención interdisciplinaria.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-900/40 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Ley de Derechos del Paciente N° 26.529
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Establece los principios de autonomía de la voluntad, información sanitaria, consentimiento informado e historia clínica digital única e inalterable bajo custodia profesional.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-900/40 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Leyes de Obras Sociales (23.660 y 23.661)
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Regulan los convenios de cobertura médico-asistencial, aranceles, plazos de liquidación de prestaciones y reintegros con número de afiliado y código de prestación nomenclada (ej: 33.01.01).
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-emerald-900/40 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    Resolución General ARCA 4291/2018 (ex-AFIP)
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Establece el régimen de emisión de comprobantes electrónicos con Código de Autorización Electrónico (CAE), Código QR bidimensional obligatorio y fechas de prestación de servicios para reintegros legales.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Auditoría de Seguridad en Vivo */}
          {activeTab === 'auditoria' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-[#0b1612] border border-emerald-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
                    <Activity size={16} className="text-emerald-400" />
                    Diagnóstico y Auditoría de Seguridad en Vivo
                  </h3>
                  <p className="text-[11px] text-emerald-200/70">
                    Escaneo automatizado de vulnerabilidades, cabeceras HTTP, cifrado y secreto médico.
                  </p>
                </div>

                <button
                  onClick={handleRunAudit}
                  disabled={isAuditing}
                  className="btn btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3 self-start sm:self-auto"
                >
                  <RefreshCw size={13} className={isAuditing ? 'animate-spin text-emerald-400' : ''} />
                  <span>{isAuditing ? 'Auditando...' : 'Re-escanear'}</span>
                </button>
              </div>

              {auditData && (
                <div className="space-y-4">
                  {/* Score Card */}
                  <div className="p-4.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Puntaje Global de Seguridad</span>
                      <h4 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-0.5">
                        {auditData.score} / 100
                      </h4>
                      <p className="text-xs text-emerald-300 font-semibold">{auditData.nivel}</p>
                    </div>
                    
                    <div className="text-right text-[11px] text-slate-400 hidden sm:block">
                      <p>Motor: {auditData.auditor}</p>
                      <p>Fecha: {auditData.fechaAuditoria}</p>
                    </div>
                  </div>

                  {/* Audit Items */}
                  <div className="space-y-2.5">
                    {auditData.resultados.map((item) => (
                      <div 
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-start gap-3"
                      >
                        <div className="mt-0.5">
                          {item.estado === 'success' && <CheckCircle2 size={16} className="text-emerald-400" />}
                          {item.estado === 'warning' && <AlertTriangle size={16} className="text-amber-400" />}
                          {item.estado === 'danger' && <AlertTriangle size={16} className="text-rose-500" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                            <span className="font-bold text-white text-xs">{item.nombre}</span>
                            <span className="text-[10px] font-mono text-emerald-400/80 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900">
                              {item.normativa}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">{item.descripcion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-5 sm:px-6 py-3.5 border-t border-emerald-950 bg-[#08120d] flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            PsicoPlus • Software de Gestión Médica & Psicológica Segura
          </div>
          <button
            onClick={onClose}
            className="btn btn-primary text-xs py-1.5 px-4 font-bold"
          >
            Entendido y Aceptar
          </button>
        </div>

      </div>
    </div>
  );
};
