// ─── Datos centrales del negocio ───────────────────────────────────────────

export const BUSINESS_INFO = {
  name: 'Oasis Hair & Beard',
  tagline: 'Estilo. Precisión. Confianza.',
  address: 'Av. del Centro 1234, Ciudad',
  phone: '+54 11 2345-6789',
  email: 'reservas@oasishair.com',
  hours: 'Lunes a Sábado: 10:00 – 19:00 hs',
};

// Profesionales del equipo
export const PROFESSIONALS = [
  {
    id: 'mateo',
    name: 'Mateo',
    role: 'Master Barber',
    specialty: 'Fades & Cortes Modernos',
    bio: 'Con más de 8 años de experiencia, Mateo es especialista en degradados perfectos y estilos urbanos.',
    avatar: 'M',
    color: 'from-blue-600 to-blue-800',
  },
  {
    id: 'lucas',
    name: 'Lucas',
    role: 'Beard Specialist',
    specialty: 'Barba & Detailing',
    bio: 'Lucas domina el arte de la barba: perfilado artístico, tratamientos y estilos clásicos de barbería.',
    avatar: 'L',
    color: 'from-emerald-600 to-emerald-800',
  },
  {
    id: 'valentina',
    name: 'Valentina',
    role: 'Hair Artist',
    specialty: 'Cortes Clásicos & Color',
    bio: 'Valentina combina técnica y creatividad para lograr cortes precisos con acabados impecables.',
    avatar: 'V',
    color: 'from-purple-600 to-purple-800',
  },
];

// Servicios ofrecidos
export const SERVICES = [
  {
    id: 'classic-cut',
    name: 'Corte Clásico',
    price: 15,
    duration: 60,
    icon: '✂️',
    description: 'Corte tradicional con tijera y máquina, adaptado a tu estilo.',
  },
  {
    id: 'fade',
    name: 'Degradado / Fade',
    price: 18,
    duration: 60,
    icon: '💈',
    description: 'Degradado moderno con transiciones perfectas y acabado limpio.',
  },
  {
    id: 'beard',
    name: 'Arreglo de Barba',
    price: 10,
    duration: 60,
    icon: '🪒',
    description: 'Perfilado, recorte y acondicionamiento profesional de barba.',
  },
  {
    id: 'combo',
    name: 'Combo Corte + Barba',
    price: 25,
    duration: 60,
    icon: '⭐',
    description: 'El pack completo: corte a medida más arreglo integral de barba.',
    popular: true,
  },
];

// Franjas horarias disponibles (10:00 a 18:00, el último turno termina a las 19:00)
export const TIME_SLOTS = [
  '10:00', '11:00', '12:00', '13:00',
  '14:00', '15:00', '16:00', '17:00', '18:00',
];

// Días laborables: 1=Lunes … 6=Sábado (0=Domingo → excluido)
export const WORKING_DAY_NUMBERS = [1, 2, 3, 4, 5, 6];

// Etiquetas de días de la semana en español
export const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const MONTH_LABELS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];
