// Lógica do Dashboard
document.addEventListener('DOMContentLoaded', () => {
    // 1. Garantir que o State existe
    if (!window.State || !window.checkAuth) {
        console.error("State.js não carregou.");
        return;
    }
    
    // 2. Verificar Autenticação
    window.checkAuth();

    const user = window.State.getUser();
    if (!user) return; // Redirecionamento acontece em checkAuth

    // 3. Preencher UI Inicial
    const nameDisplay = document.getElementById('userNameDisplay');
    if (nameDisplay) nameDisplay.textContent = user.name;

    // 4. Renderizar Grupos
    renderGroups();

    // 5. Funções de Modal Globais
    window.openModal = (id) => {
        const el = document.getElementById(id);
        if(el) el.classList.remove('hidden');
    };
    
    window.closeModal = (id) => {
        const el = document.getElementById(id);
        if(el) el.classList.add('hidden');
    };

    // Criar Grupo
    const createForm = document.getElementById('createForm');
    if (createForm) {
        createForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('newGroupName').value;
            const desc = document.getElementById('newGroupDesc').value;
            const isPublic = document.getElementById('newGroupPublic').checked;

            const newGroup = {
                id: 'g-' + Date.now(),
                name: name,
                description: desc,
                adminId: user.id,
                isPublic: isPublic,
                approvalRequired: false,
                code: Math.random().toString(36).substring(2, 8).toUpperCase(),
                participants: [user.id],
                pendingParticipants: [],
                pairings: {},
                status: 'recruiting'
            };

            window.State.saveGroup(newGroup);
            closeModal('createModal');
            renderGroups();
            document.getElementById('newGroupName').value = ''; // Limpar form
        });
    }

    // Entrar em Grupo
    const joinForm = document.getElementById('joinForm');
    if (joinForm) {
        joinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const code = document.getElementById('joinCode').value.toUpperCase();
            const groups = window.State.getGroups();
            const group = groups.find(g => g.code === code);

            if (group) {
                if (!group.participants.includes(user.id)) {
                    if (group.approvalRequired) {
                        if(!group.pendingParticipants) group.pendingParticipants = [];
                        if(!group.pendingParticipants.includes(user.id)) {
                            group.pendingParticipants.push(user.id);
                            alert("Pedido enviado para aprovação!");
                        } else {
                            alert("Você já solicitou entrada neste grupo.");
                        }
                    } else {
                        group.participants.push(user.id);
                        alert("Entrou com sucesso!");
                    }
                    window.State.saveGroup(group);
                } else {
                    alert("Você já está neste grupo!");
                }
                closeModal('joinModal');
                renderGroups();
                document.getElementById('joinCode').value = ''; // Limpar form
            } else {
                alert("Código inválido!");
            }
        });
    }

    // Fila Pública
    const btnPublicQueue = document.getElementById('btnPublicQueue');
    if (btnPublicQueue) {
        btnPublicQueue.addEventListener('click', () => {
            const txt = document.getElementById('queueText');
            txt.innerText = "Procurando kambas... (Aguarde)";
            
            setTimeout(() => {
                const randomName = window.State.generateAngolanName();
                const newGroup = {
                    id: 'g-pub-' + Date.now(),
                    name: randomName,
                    description: "Grupo automático criado pelo Kamba Fixe! Divirtam-se!",
                    adminId: user.id,
                    isPublic: true,
                    approvalRequired: false,
                    code: Math.random().toString(36).substring(2, 8).toUpperCase(),
                    participants: [user.id, 'bot-1', 'bot-2', 'bot-3'], 
                    pendingParticipants: [],
                    pairings: {},
                    status: 'recruiting'
                };
                window.State.saveGroup(newGroup);
                renderGroups();
                txt.innerText = "Combinação automática";
                alert("Você entrou no grupo \"" + randomName + "\"!");
            }, 2000);
        });
    }
});

function renderGroups() {
    const user = window.State.getUser();
    const groups = window.State.getGroups();
    const list = document.getElementById('groupsList');
    if (!list) return;

    const myGroups = groups.filter(g => g.participants.includes(user.id) || (g.pendingParticipants && g.pendingParticipants.includes(user.id)));

    if (myGroups.length === 0) {
        list.innerHTML = `
            <div class="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <p class="text-gray-400">Você ainda não entrou em nenhum grupo.</p>
            </div>`;
        return;
    }

    list.innerHTML = myGroups.map(group => {
        const isPending = group.pendingParticipants && group.pendingParticipants.includes(user.id);
        const statusText = isPending ? "Aguardando Aprovação" : (group.status === 'recruiting' ? 'Recrutando' : group.status === 'drawn' ? 'Sorteado' : 'Concluído');
        
        return `
        <a href="${isPending ? '#' : 'group.html?id=' + group.id}" class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-christmasRed transition-colors flex justify-between items-center group cursor-pointer block ${isPending ? 'opacity-70' : ''}" ${isPending ? 'onclick="alert(\'Aguarde a aprovação do admin.\'); return false;"' : ''}>
            <div>
                <div class="flex items-center space-x-2">
                    <h3 class="font-bold text-lg text-gray-800">${group.name}</h3>
                    ${group.isPublic ? '<span class="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Público</span>' : ''}
                </div>
                <p class="text-sm text-gray-500 mt-1">${group.participants.length} Participantes • Estado: <span class="capitalize font-medium text-christmasGreen">${statusText}</span></p>
            </div>
            <div class="bg-gray-50 p-2 rounded-full group-hover:bg-red-50 group-hover:text-christmasRed transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
        </a>
    `}).join('');
}