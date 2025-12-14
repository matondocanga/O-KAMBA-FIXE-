import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

// --- CONFIGURAÇÃO DO FIREBASE (MODULAR) ---
// Chaves restauradas diretamente para garantir funcionamento imediato
const firebaseConfig = {
  apiKey: "AIzaSyCOnuw9R4-FhoAhGgB37eihwO8WPZ8uXYg",
  authDomain: "o-kamba-fixe.firebaseapp.com",
  projectId: "o-kamba-fixe",
  storageBucket: "o-kamba-fixe.firebasestorage.app",
  messagingSenderId: "1053297267860",
  appId: "1:1053297267860:web:ff72dbae9f29f66d8e5081",
  measurementId: "G-3DLF5F2C73"
};

console.log("🔥 Inicializando Firebase Modular...");

// Inicialização do App (Sintaxe V9+)
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