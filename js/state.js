// Gerenciamento de Estado Centralizado (Mock Database)

const DB_KEYS = {
    USER: 'kamba_user',
    GROUPS: 'kamba_groups',
    MESSAGES: 'kamba_messages',
    QUEUE: 'kamba_queue_count'
};

window.MOCK_PRODUCTS = [
    { id: 'p1', name: 'Grãos de Café de Angola', price: 5000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=1' },
    { id: 'p2', name: 'Caneca Personalizada "Kamba"', price: 2500, currency: 'Kz', image: 'https://picsum.photos/300/300?random=2' },
    { id: 'p3', name: 'Cartão Presente Zango', price: 10000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=3' },
    { id: 'p4', name: 'Coluna Bluetooth', price: 15000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=4' },
    { id: 'p5', name: 'Máscara Artesanal Local', price: 8000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=5' },
    { id: 'p6', name: 'Caixa de Chocolates', price: 4000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=6' },
];

window.State = {
    getUser: () => {
        try {
            return JSON.parse(localStorage.getItem(DB_KEYS.USER));
        } catch (e) { return null; }
    },
    
    setUser: (user) => {
        localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
    },
    
    logout: () => {
        localStorage.removeItem(DB_KEYS.USER);
        window.location.href = './index.html';
    },

    getGroups: () => {
        try {
            return JSON.parse(localStorage.getItem(DB_KEYS.GROUPS)) || [];
        } catch (e) { return []; }
    },

    saveGroup: (group) => {
        const groups = window.State.getGroups();
        const index = groups.findIndex(g => g.id === group.id);
        if (index >= 0) {
            groups[index] = group;
        } else {
            groups.push(group);
        }
        localStorage.setItem(DB_KEYS.GROUPS, JSON.stringify(groups));
    },

    getMessages: (groupId) => {
        try {
            const all = JSON.parse(localStorage.getItem(DB_KEYS.MESSAGES)) || [];
            return all.filter(m => m.groupId === groupId).sort((a,b) => a.timestamp - b.timestamp);
        } catch (e) { return []; }
    },

    addMessage: (msg) => {
        const all = JSON.parse(localStorage.getItem(DB_KEYS.MESSAGES)) || [];
        all.push(msg);
        localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(all));
    },

    // --- UTILS ---
    
    generateAngolanName: () => {
        const PREFIXES = ["Os Kambas", "União", "Estrelas", "Guerreiros", "Filhos", "Banda", "Grupo", "Amigos"];
        const ICONS = ["da Palanca Negra", "do Imbondeiro", "da Rainha Ginga", "do Pensador", "de Kalandula", "da Muxima", "do Semba", "da Kizomba", "do Kuduro", "da Welwitschia", "do Kilamba", "da Serra da Leba", "do Mussulo", "do Maiombe", "do Mufete"];
        const SUFFIXES = ["Fixe", "Solidário", "do Natal", "da Paz", "Brilhante", "Vitorioso", "da Banda", "Angolano"];
        
        const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
        const icon = ICONS[Math.floor(Math.random() * ICONS.length)];
        const useSuffix = Math.random() > 0.5;
        const suffix = useSuffix ? ` ${SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)]}` : "";

        return `${prefix} ${icon}${suffix}`;
    },

    formatCurrency: (amount) => {
        return `${amount.toLocaleString()} Kz`;
    },

    // WhatsApp Vendor Data
    VENDOR: {
        name: "Macro Yetu",
        phone: "244943831033",
        displayPhone: "943 831 033",
        address: "Kifica, rua 22, Benfica"
    }
};

// Check Auth on restricted pages
window.checkAuth = function() {
    const path = window.location.pathname;
    // Allow index.html and root path
    const isPublic = path.endsWith('index.html') || path === '/' || path.endsWith('/');
    
    if (!window.State.getUser() && !isPublic) {
        window.location.href = './index.html';
    }
}
