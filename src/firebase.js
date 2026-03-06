import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ─── Configuración de Firebase ────────────────────────────────────────────────
// Los valores se leen desde el archivo .env (Vite expone solo las variables
// con prefijo VITE_ al bundle del cliente via import.meta.env).
//
// Para desarrollo local: completá el archivo .env en la raíz del proyecto.
// Para Vercel en producción: cargá las mismas variables en
//   Settings → Environment Variables de tu proyecto en vercel.com.
// ─────────────────────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

// Instancia de Firestore — la importan todos los servicios
export const db = getFirestore(app);
