import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// --- IMPORTANTE: SUBSTITUA COM OS DADOS DO SEU CONSOLE FIREBASE ---
// As chaves devem estar no arquivo .env na raiz do projeto

// Cast import.meta to any to resolve TS error
const env = (import.meta as any).env;

const firebaseConfig = {
  apiKey: env?.VITE_FIREBASE_API_KEY,
  authDomain: env?.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env?.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env?.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env?.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env?.VITE_FIREBASE_APP_ID,
  measurementId: env?.VITE_FIREBASE_MEASUREMENT_ID
};

// Debug: Verificar se as chaves foram carregadas
if (!firebaseConfig.apiKey) {
  console.error("ERRO CRÍTICO FIREBASE: A 'apiKey' não foi encontrada.");
  console.error("Certifique-se de que criou o arquivo '.env' na raiz do projeto e definiu 'VITE_FIREBASE_API_KEY'.");
  console.log("Valores atuais:", firebaseConfig);
} else {
  console.log("Firebase conectado com o projeto:", firebaseConfig.projectId);
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);

// Inicializar Analytics apenas se suportado (evita erros em ambientes de teste/SSR)
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);