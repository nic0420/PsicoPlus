import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, HeartPulse, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export function LoginScreen({ onAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleDemoAccess = () => {
    setError('');
    onAuthenticated({
      access_token: 'visual-demo-session',
      user: { id: 'visual-demo-user', email: 'demo@psicoplus.local', user_metadata: { full_name: 'Modo demostración' } },
      isDemo: true,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Completá tu email y contraseña para continuar.');
      return;
    }
    if (!supabase) {
      setError('El acceso seguro todavía no está configurado en este entorno.');
      return;
    }

    setIsSubmitting(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setIsSubmitting(false);

    if (authError) {
      const message = authError.message?.toLowerCase() || '';
      setError(message.includes('confirm') ? 'Revisá tu email para confirmar la cuenta antes de ingresar.' : 'Email o contraseña incorrectos.');
      return;
    }
    if (data.session) onAuthenticated(data.session);
  };

  return (
    <main className="login-shell">
      <section className="login-visual" aria-label="Información de PsicoPlus">
        <div className="login-brand">
          <div className="brand-mark"><HeartPulse size={22} /></div>
          <div><strong>PsicoPlus</strong><span>Gestión clínica simple</span></div>
        </div>
        <div className="login-visual-copy">
          <span className="eyebrow">Tu práctica, más clara</span>
          <h1>Todo lo que necesitás para cuidar mejor.</h1>
          <p>Organizá turnos, pacientes y finanzas desde un único espacio pensado para profesionales de la salud mental.</p>
          <div className="login-trust"><ShieldCheck size={17} /><span>Acceso privado y protegido</span></div>
        </div>
        <div className="login-visual-footer">PsicoPlus · Gestión clínica profesional</div>
      </section>

      <section className="login-panel">
        <div className="login-card">
          <div className="login-card-heading">
            <span className="mobile-brand-mark"><HeartPulse size={19} /></span>
            <span className="eyebrow">Bienvenido/a de nuevo</span>
            <h2>Ingresá a tu cuenta</h2>
            <p>Accedé a tu espacio profesional para continuar.</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <label htmlFor="login-email">Email profesional</label>
            <div className="login-input-wrap">
              <Mail size={17} aria-hidden="true" />
              <input id="login-email" type="email" autoComplete="email" placeholder="nombre@consultorio.com" value={email} onChange={(event) => setEmail(event.target.value)} />
            </div>
            <label htmlFor="login-password">Contraseña</label>
            <div className="login-input-wrap">
              <LockKeyhole size={17} aria-hidden="true" />
              <input id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" placeholder="Tu contraseña" value={password} onChange={(event) => setPassword(event.target.value)} />
              <button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}>
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {error && <p className="login-error" role="alert">{error}</p>}
            <button className="login-submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Verificando acceso…' : 'Ingresar'}
              {!isSubmitting && <ArrowRight size={17} />}
            </button>
          </form>
          <div className="login-divider"><span>o explorá la interfaz</span></div>
          <button className="login-demo" type="button" onClick={handleDemoAccess}>
            <Sparkles size={16} aria-hidden="true" />
            Entrar sin registrarme
          </button>
          <p className="login-demo-note">Modo demostración: podés recorrer el dashboard sin crear una cuenta.</p>
          <p className="login-security">Tus datos se mantienen protegidos mediante autenticación segura.</p>
          {!isSupabaseConfigured && <p className="login-config-note">Configurá las variables públicas de Supabase para habilitar el acceso.</p>}
        </div>
      </section>
    </main>
  );
}
