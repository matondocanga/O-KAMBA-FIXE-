import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

// --- CONFIGURAÇÃO DO FIREBASE ---

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
} else {
  console.log("Firebase conectado com o projeto:", firebaseConfig.projectId);
}

// Inicializar Firebase (V8 Style)
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const db = firebase.firestore();

export const analytics = firebase.analytics && typeof firebase.analytics === 'function' ? firebase.analytics() : null;

export default firebase;