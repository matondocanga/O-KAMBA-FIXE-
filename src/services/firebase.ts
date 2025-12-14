import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// --- CONFIGURAÇÃO ROBUSTA DO FIREBASE ---
// Tenta ler do ambiente. Se falhar, usa valores placeholder para não travar o app na inicialização.
const env = (import.meta as any).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSy_DUMMY_KEY_PARA_EVITAR_CRASH_NA_INICIALIZACAO",
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "kamba-fixe-dev.firebaseapp.com",
  projectId: env.VITE_FIREBASE_PROJECT_ID || "kamba-fixe-dev",
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "kamba-fixe-dev.appspot.com",
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: env.VITE_FIREBASE_APP_ID || "1:000000000000:web:0000000000000000000000",
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID
};

// Log de diagnóstico para ajudar a depurar se o login falhar
if (!env.VITE_FIREBASE_API_KEY) {
    console.warn("⚠️ AVISO: Chaves do Firebase não encontradas no .env");
    console.warn("O app foi inicializado com chaves de teste para permitir a renderização da tela.");
    console.warn("O login e o banco de dados NÃO funcionarão até que as chaves reais sejam configuradas.");
} else {
    console.log("✅ Firebase Configurado com Project ID:", firebaseConfig.projectId);
}

// Inicializar Firebase
// O try-catch aqui previne que uma config muito inválida trave o script inteiro
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  console.error("Erro fatal ao inicializar Firebase:", e);
}

// Exportar serviços (podem ser undefined se a inicialização falhar, mas evita crash imediato)
export const auth = app ? getAuth(app) : {} as any;
export const googleProvider = new GoogleAuthProvider();
export const db = app ? getFirestore(app) : {} as any;

// Inicializar Analytics apenas se suportado
export const analytics = isSupported().then(yes => (yes && app) ? getAnalytics(app) : null);