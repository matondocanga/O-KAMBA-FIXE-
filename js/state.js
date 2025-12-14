console.log("🔄 Carregando Kamba Fixe State System...");

// Definição das Chaves do LocalStorage
var DB_KEYS = {
    USER: 'kamba_user',
    GROUPS: 'kamba_groups',
    MESSAGES: 'kamba_messages'
};

// Produtos Mockados Globais
window.MOCK_PRODUCTS = [
    { id: 'p1', name: 'Grãos de Café de Angola', price: 5000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=1' },
    { id: 'p2', name: 'Caneca Personalizada "Kamba"', price: 2500, currency: 'Kz', image: 'https://picsum.photos/300/300?random=2' },
    { id: 'p3', name: 'Cartão Presente Zango', price: 10000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=3' },
    { id: 'p4', name: 'Coluna Bluetooth', price: 15000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=4' },
    { id: 'p5', name: 'Máscara Artesanal Local', price: 8000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=5' },
    { id: 'p6', name: 'Caixa de Chocolates', price: 4000, currency: 'Kz', image: 'https://picsum.photos/300/300?random=6' },
];

// Objeto State Principal - Atribuição Direta
window.State = {
    getUser: function() {
        try {
            var data = localStorage.getItem(DB_KEYS.USER);
            return data ? JSON.parse(data) : null;
        } catch (e) { 
            console.error("Erro ao ler usuário:", e);
            return null; 
        }
    },
    
    setUser: function(user) {
        try {
            localStorage.setItem(DB_KEYS.USER, JSON.stringify(user));
        } catch (e) { console.error("Erro ao salvar usuário:", e); }
    },
    
    logout: function() {
        localStorage.removeItem(DB_KEYS.USER);
        window.location.href = 'index.html';
    },

    getGroups: function() {
        try {
            var data = localStorage.getItem(DB_KEYS.GROUPS);
            return data ? JSON.parse(data) : [];
        } catch (e) { return []; }
    },

    saveGroup: function(group) {
        var groups = this.getGroups();
        var index = groups.findIndex(function(g) { return g.id === group.id; });
        if (index >= 0) {
            groups[index] = group;
        } else {
            groups.push(group);
        }
        localStorage.setItem(DB_KEYS.GROUPS, JSON.stringify(groups));
    },

    getMessages: function(groupId) {
        try {
            var all = JSON.parse(localStorage.getItem(DB_KEYS.MESSAGES)) || [];
            return all.filter(function(m) { return m.groupId === groupId; }).sort(function(a,b) { return a.timestamp - b.timestamp; });
        } catch (e) { return []; }
    },

    addMessage: function(msg) {
        var all = JSON.parse(localStorage.getItem(DB_KEYS.MESSAGES)) || [];
        all.push(msg);
        localStorage.setItem(DB_KEYS.MESSAGES, JSON.stringify(all));
    },

    generateAngolanName: function() {
        var PREFIXES = ["Os Kambas", "União", "Estrelas", "Guerreiros", "Filhos", "Banda", "Grupo", "Amigos"];
        var ICONS = ["da Palanca Negra", "do Imbondeiro", "da Rainha Ginga", "do Pensador", "de Kalandula", "da Muxima", "do Semba", "da Kizomba", "do Kuduro", "da Welwitschia", "do Kilamba", "da Serra da Leba", "do Mussulo", "do Maiombe", "do Mufete"];
        var SUFFIXES = ["Fixe", "Solidário", "do Natal", "da Paz", "Brilhante", "Vitorioso", "da Banda", "Angolano"];
        
        var p = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
        var i = ICONS[Math.floor(Math.random() * ICONS.length)];
        var s = SUFFIXES[Math.floor(Math.random() * SUFFIXES.length)];
        return p + " " + i + " " + s;
    },

    VENDOR: {
        name: "Macro Yetu",
        phone: "244943831033",
        displayPhone: "943 831 033",
        address: "Kifica, rua 22, Benfica"
    }
};

// Função global de verificação de autenticação
window.checkAuth = function() {
    var user = window.State.getUser();
    var path = window.location.pathname;
    
    // Se estiver na página de login, não faz nada (o script da página redireciona se já logado)
    if (path.indexOf('index.html') !== -1 || path === '/' || path.endsWith('/')) {
        return;
    }

    if (!user) {
        console.warn("Usuário não autenticado. Redirecionando...");
        window.location.href = 'index.html';
    }
};

console.log("✅ State carregado e definido globalmente.");
