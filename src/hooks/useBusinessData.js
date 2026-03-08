/**
 * useBusinessData.js
 *
 * Suscripción en tiempo real a las colecciones `servicios` y `profesionales`
 * de Firestore. Los componentes importan este hook en lugar de businessData.js,
 * permitiendo al admin gestionar estos datos desde el panel.
 *
 * Estructura esperada en Firestore:
 *
 * servicios/{id}
 *   name:        string   // 'Corte Clásico'
 *   icon:        string   // '✂️'
 *   price:       number   // 15
 *   duration:    number   // 30 (minutos)
 *   description: string
 *   popular:     boolean  (opcional)
 *
 * profesionales/{id}
 *   name:        string   // 'Mateo'
 *   role:        string   // 'Barbero Senior'
 *   specialty:   string   // 'Degradados y diseños'
 *   bio:         string
 *   avatar:      string   // iniciales, ej: 'M'
 *   color:       string   // clase Tailwind, ej: 'from-amber-400 to-amber-600'
 *   activo:      boolean  // si está disponible para reservas (default: true)
 */

import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase.js';

export function useBusinessData() {
  const [services, setServices] = useState([]);
  const [professionals, setProfessionals] = useState([]);
  const [loadingSvc, setLoadingSvc] = useState(true);
  const [loadingPro, setLoadingPro] = useState(true);

  useEffect(() => {
    const unsubSvc = onSnapshot(
      collection(db, 'servicios'),
      (snap) => {
        setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoadingSvc(false);
      },
      (err) => {
        console.error('[Firestore] Error cargando servicios:', err);
        setLoadingSvc(false);
      },
    );

    const unsubPro = onSnapshot(
      collection(db, 'profesionales'),
      (snap) => {
        setProfessionals(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoadingPro(false);
      },
      (err) => {
        console.error('[Firestore] Error cargando profesionales:', err);
        setLoadingPro(false);
      },
    );

    return () => {
      unsubSvc();
      unsubPro();
    };
  }, []);

  return { services, professionals, loading: loadingSvc || loadingPro };
}
