import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// --- IMPORTANTE: SUBSTITUA COM OS DADOS DO SEU CONSOLE FIREBASE ---
// Se estiver no Vercel, o ideal é usar Variáveis de Ambiente.

// Cast import.meta to any to resolve TS error
const env = (import.meta as any).env;

const firebaseConfig = {
  apiKey: env?.VITE_FIREBASE_API_KEY || "SUA_API_KEY_AQUI",
  authDomain: env?.VITE_FIREBASE_AUTH_DOMAIN || "SEU_PROJETO.firebaseapp.com",
  projectId: env?.VITE_FIREBASE_PROJECT_ID || "SEU_PROJECT_ID",
  storageBucket: env?.VITE_FIREBASE_STORAGE_BUCKET || "SEU_BUCKET.appspot.com",
  messagingSenderId: env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "SEU_SENDER_ID",
  appId: env?.VITE_FIREBASE_APP_ID || "SEU_APP_ID",
  measurementId: env?.VITE_FIREBASE_MEASUREMENT_ID || "G-XXXXXXXX" // Adicionado para Analytics
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Inicializar Analytics apenas se suportado (evita erros em ambientes de teste/SSR)
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);