import { hashPassword, verifyPassword } from './securityService';

const STORAGE_KEYS = {
  CURRENT_USER: 'psicoplus_current_user_v1',
  REGISTERED_USERS: 'psicoplus_users_db_v1',
  IS_DEMO_MODE: 'psicoplus_demo_mode_v1',
};

export const DEMO_USER = {
  id: 'user-demo-virna',
  nombre: 'Lic. Virna Toledo',
  email: 'lic.virna.toledo@gmail.com',
  titulo: 'Licenciada en Psicología',
  matriculaProvincial: 'M.P. 1842',
  colegio: 'Colegio de Psicólogos de Corrientes',
  especialidad: 'Terapia Cognitivo Conductual (TCC) & Adultos',
  telefono: '+54 9 379 488-9922',
  isDemo: true,
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error al leer usuario actual:', e);
  }
  return DEMO_USER;
};

export const setCurrentUser = (user) => {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Error al guardar usuario actual:', e);
  }
};

export const getRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const registerUser = async ({
  nombre,
  email,
  password,
  matriculaProvincial,
  colegio,
  especialidad,
  telefono,
  nombreConsultorio,
  direccionConsultorio,
}) => {
  const users = getRegisteredUsers();
  const normalizedEmail = (email || '').trim().toLowerCase();

  if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'Ya existe una cuenta registrada con este correo electrónico.' };
  }

  // Cifrado criptográfico de la contraseña antes de guardar en almacenamiento
  const passwordHash = await hashPassword(password);

  const newUser = {
    id: `user-${Date.now()}`,
    nombre: nombre.trim(),
    email: normalizedEmail,
    passwordHash, // Protegido con hash SHA-256
    titulo: 'Licenciado/a en Psicología',
    matriculaProvincial: matriculaProvincial?.trim() || 'M.P. En trámite',
    colegio: colegio?.trim() || 'Colegio de Psicólogos',
    especialidad: especialidad?.trim() || 'Psicología Clínica',
    telefono: telefono?.trim() || '',
    consultorioInicial: {
      nombre: nombreConsultorio?.trim() || 'Consultorio Principal',
      direccion: direccionConsultorio?.trim() || 'Atención Presencial / Virtual',
    },
    fechaRegistro: new Date().toISOString(),
    isDemo: false,
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
  setCurrentUser(newUser);

  return { success: true, user: newUser };
};

export const loginUser = async (email, password) => {
  const normalizedEmail = (email || '').trim().toLowerCase();
  
  // Acceso de demostración
  if (normalizedEmail === DEMO_USER.email.toLowerCase()) {
    setCurrentUser(DEMO_USER);
    return { success: true, user: DEMO_USER };
  }

  const users = getRegisteredUsers();
  const found = users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!found) {
    return { success: false, error: 'No se encontró ninguna cuenta con este correo.' };
  }

  // Verificación con hash o migración automática
  const storedHash = found.passwordHash || found.password;
  const isMatch = await verifyPassword(password, storedHash);

  if (!isMatch) {
    return { success: false, error: 'Contraseña incorrecta.' };
  }

  // Si tenía contraseña vieja sin hash, migrarla a hash SHA-256
  if (!found.passwordHash) {
    found.passwordHash = await hashPassword(password);
    delete found.password;
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
  }

  setCurrentUser(found);
  return { success: true, user: found };
};

export const logoutUser = () => {
  setCurrentUser(DEMO_USER);
};
