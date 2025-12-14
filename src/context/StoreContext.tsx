import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Group, Message, Product } from '../types';
import { 
    auth, 
    googleProvider, 
    db 
} from '../services/firebase';
import { 
    signInWithPopup, 
    signOut, 
    onAuthStateChanged 
} from 'firebase/auth';
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    onSnapshot, 
    doc, 
    setDoc, 
    updateDoc, 
    getDoc, 
    arrayUnion,
    getDocs,
    orderBy,
    arrayRemove
} from 'firebase/firestore';

// --- MOCK PRODUCTS ---
const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Grãos de Café de Angola', price: 5000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=1', link: '#' },
  { id: 'p2', name: 'Caneca Personalizada "Kamba"', price: 2500, currency: 'Kz', image: 'https://picsum.photos/300/300?random=2', link: '#' },
  { id: 'p3', name: 'Cartão Presente Zango', price: 10000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=3', link: '#' },
  { id: 'p4', name: 'Coluna Bluetooth', price: 15000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=4', link: '#' },
  { id: 'p5', name: 'Máscara Artesanal Local', price: 8000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=5', link: '#' },
  { id: 'p6', name: 'Caixa de Chocolates', price: 4000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=6', link: '#' },
];

interface StoreContextType {
  user: User | null;
  groups: Group[];
  messages: Message[];
  products: Product[];
  queueCount: number;
  loading: boolean;
  login: () => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  createGroup: (name: string, desc: string, isPublic: boolean, limit: number) => void;
  joinGroup: (code: string) => Promise<boolean>;
  joinPublicQueue: () => void;
  startDraw: (groupId: string) => void;
  sendMessage: (groupId: string, text: string) => void;
  getGroupMessages: (groupId: string) => Message[];
  updateActivity: (groupId: string, activityId: string, response: string) => void;
  approveParticipant: (groupId: string, userId: string) => void;
  rejectParticipant: (groupId: string, userId: string) => void;
  toggleGroupApproval: (groupId: string, required: boolean) => void;
  toggleGroupVisibility: (groupId: string, isPublic: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

// --- ANGOLAN NAME GENERATOR ---
const ANGOLAN_PREFIXES = ["Os Kambas", "União", "Estrelas", "Guerreiros", "Filhos", "Banda", "Grupo", "Amigos"];
const ANGOLAN_ICONS = ["da Palanca Negra", "do Imbondeiro", "da Rainha Ginga", "do Pensador", "de Kalandula", "da Muxima", "do Semba", "da Kizomba", "do Kuduro", "da Welwitschia", "do Kilamba", "da Serra da Leba", "do Mussulo", "do Maiombe", "do Mufete"];
const ANGOLAN_SUFFIXES = ["Fixe", "Solidário", "do Natal", "da Paz", "Brilhante", "Vitorioso", "da Banda", "Angolano"];

const generateAngolanGroupName = (): string => {
    const prefix = ANGOLAN_PREFIXES[Math.floor(Math.random() * ANGOLAN_PREFIXES.length)];
    const icon = ANGOLAN_ICONS[Math.floor(Math.random() * ANGOLAN_ICONS.length)];
    const useSuffix = Math.random() > 0.5;
    const suffix = useSuffix ? ` ${ANGOLAN_SUFFIXES[Math.floor(Math.random() * ANGOLAN_SUFFIXES.length)]}` : "";
    return `${prefix} ${icon}${suffix}`;
};

export const StoreProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [queueCount, setQueueCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            // Check if user exists in DB, if not create
            const userRef = doc(db, "users", firebaseUser.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                setUser(userSnap.data() as User);
            } else {
                const newUser: User = {
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName || 'Kamba Novo',
                    email: firebaseUser.email || '',
                    avatarUrl: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName}&background=random`,
                    clothingSize: { shirt: '', pants: '', shoes: '' },
                    preferences: '',
                    dislikes: '',
                    message: ''
                };
                await setDoc(userRef, newUser);
                setUser(newUser);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Monitor Groups (Real-time)
  useEffect(() => {
    if (!user) {
        setGroups([]);
        return;
    }

    const q = query(collection(db, "groups"), where("participants", "array-contains", user.id));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedGroups = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Group));
        setGroups(loadedGroups);
    });
    
    return () => unsubscribe();
  }, [user]);

  // 3. Monitor Messages (Real-time)
  useEffect(() => {
    if (!user || groups.length === 0) {
        setMessages([]);
        return;
    }
    
    const groupIds = groups.map(g => g.id);
    if (groupIds.length === 0) return;

    // MVP: Carrega mensagens e filtra localmente
    const qMsg = query(collection(db, "messages"), orderBy("timestamp", "asc"));
    const unsubMsg = onSnapshot(qMsg, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Message));
        const myMsgs = msgs.filter(m => groupIds.includes(m.groupId));
        setMessages(myMsgs);
    });

    return () => unsubMsg();
  }, [groups, user]);

  // --- ACTIONS ---

  const login = async () => {
    try {
        await signInWithPopup(auth, googleProvider);
    } catch (error) {
        console.error("Login failed", error);
        alert("Erro ao fazer login. Tente novamente.");
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      const userRef = doc(db, "users", user.id);
      await updateDoc(userRef, updates);
      setUser({ ...user, ...updates });
    }
  };

  const createGroup = async (name: string, desc: string, isPublic: boolean, limit: number) => {
    if (!user) return;
    
    const newGroupData = {
      name,
      description: desc,
      adminId: user.id,
      isPublic,
      approvalRequired: false,
      maxMembers: 20,
      giftValueLimit: limit,
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdAt: new Date().toISOString(),
      participants: [user.id],
      pendingParticipants: [],
      pairings: {},
      status: 'recruiting',
    };

    await addDoc(collection(db, "groups"), newGroupData);
  };

  const joinGroup = async (code: string) => {
    if (!user) return false;
    
    const q = query(collection(db, "groups"), where("code", "==", code));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) return false;

    const groupDoc = querySnapshot.docs[0];
    const groupData = groupDoc.data() as Group;
    const groupRef = doc(db, "groups", groupDoc.id);

    if (groupData.participants.includes(user.id)) return true;
    if (groupData.pendingParticipants?.includes(user.id)) {
        alert("Você já pediu para entrar.");
        return true;
    }

    if (groupData.approvalRequired) {
        await updateDoc(groupRef, {
            pendingParticipants: arrayUnion(user.id)
        });
        alert("Pedido enviado ao Admin!");
    } else {
        await updateDoc(groupRef, {
            participants: arrayUnion(user.id)
        });
    }
    return true;
  };

  const approveParticipant = async (groupId: string, userId: string) => {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
          participants: arrayUnion(userId),
          pendingParticipants: arrayRemove(userId)
      });
  };

  const rejectParticipant = async (groupId: string, userId: string) => {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, {
          pendingParticipants: arrayRemove(userId)
      });
  };

  const toggleGroupApproval = async (groupId: string, required: boolean) => {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, { approvalRequired: required });
  };

  const toggleGroupVisibility = async (groupId: string, isPublic: boolean) => {
      const groupRef = doc(db, "groups", groupId);
      await updateDoc(groupRef, { isPublic: isPublic });
  };

  const joinPublicQueue = async () => {
    if (!user) return;
    setQueueCount(prev => prev + 1);
    
    setTimeout(async () => {
        const name = generateAngolanGroupName();
        await createGroup(name, "Grupo Público Automático", true, 5000);
        setQueueCount(0);
    }, 2000);
  };

  const startDraw = async (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    
    let participants = [...group.participants];
    for (let i = participants.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [participants[i], participants[j]] = [participants[j], participants[i]];
    }

    const pairings: Record<string, string> = {};
    for (let i = 0; i < participants.length; i++) {
        const santa = participants[i];
        const receiver = participants[(i + 1) % participants.length];
        pairings[santa] = receiver;
    }

    const groupRef = doc(db, "groups", groupId);
    await updateDoc(groupRef, {
        pairings,
        status: 'drawn'
    });
  };

  const sendMessage = async (groupId: string, text: string) => {
    if (!user) return;
    
    await addDoc(collection(db, "messages"), {
        groupId,
        senderId: user.id,
        senderName: user.name,
        text,
        timestamp: Date.now()
    });
  };

  const getGroupMessages = (groupId: string) => {
    return messages.filter(m => m.groupId === groupId);
  };

  const updateActivity = (groupId: string, activityId: string, response: string) => {
    console.log("Activity update not implemented in DB yet");
  };

  return (
    <StoreContext.Provider value={{
      user,
      groups,
      messages,
      products: MOCK_PRODUCTS,
      queueCount,
      loading,
      login,
      logout,
      updateUser,
      createGroup,
      joinGroup,
      joinPublicQueue,
      startDraw,
      sendMessage,
      getGroupMessages,
      updateActivity,
      approveParticipant,
      rejectParticipant,
      toggleGroupApproval,
      toggleGroupVisibility
    }}>
      {children}
    </StoreContext.Provider>
  );
};