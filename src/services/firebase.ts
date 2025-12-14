import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// --- CONFIGURAÇÃO DO FIREBASE (MODULAR) ---

// Cast import.meta to any to resolve TS error
const env = (import.meta as any).env;

const firebaseConfig = {
  // Fallback para hardcoded se as env vars falharem no build, 
  // garantindo que o app não quebre em produção se o .env não for carregado corretamente pelo Vite
  apiKey: env?.VITE_FIREBASE_API_KEY || "AIzaSyCOnuw9R4-FhoAhGgB37eihwO8WPZ8uXYg",
  authDomain: env?.VITE_FIREBASE_AUTH_DOMAIN || "o-kamba-fixe.firebaseapp.com",
  projectId: env?.VITE_FIREBASE_PROJECT_ID || "o-kamba-fixe",
  storageBucket: env?.VITE_FIREBASE_STORAGE_BUCKET || "o-kamba-fixe.firebasestorage.app",
  messagingSenderId: env?.VITE_FIREBASE_MESSAGING_SENDER_ID || "1053297267860",
  appId: env?.VITE_FIREBASE_APP_ID || "1:1053297267860:web:ff72dbae9f29f66d8e5081",
  measurementId: env?.VITE_FIREBASE_MEASUREMENT_ID || "G-3DLF5F2C73"
};

console.log("🔥 Inicializando Firebase Modular...");

// Inicialização do App
const app = initializeApp(firebaseConfig);

// Exportação dos serviços modulares
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Inicialização segura do Analytics
let analytics = null;
isSupported().then(yes => {
  if (yes) {
    analytics = getAnalytics(app);
  }
}).catch(err => console.error("Analytics não suportado:", err));

export { analytics };
export default app;