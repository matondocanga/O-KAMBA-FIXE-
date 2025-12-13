// Lógica do Dashboard

checkAuth();

const user = State.getUser();
document.getElementById('userNameDisplay').textContent = user.name;

function renderGroups() {
    const groups = State.getGroups();
    const list = document.getElementById('groupsList');
    const myGroups = groups.filter(g => g.participants.includes(user.id) || g.pendingParticipants?.includes(user.id));

    if (myGroups.length === 0) {
        list.innerHTML = `
            <div class="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                <p class="text-gray-400">Você ainda não entrou em nenhum grupo.</p>
            </div>`;
        return;
    }

    list.innerHTML = myGroups.map(group => `
        <a href="group.html?id=${group.id}" class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-christmasRed transition-colors flex justify-between items-center group cursor-pointer block">
            <div>
                <div class="flex items-center space-x-2">
                    <h3 class="font-bold text-lg text-gray-800">${group.name}</h3>
                    ${group.isPublic ? '<span class="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">Público</span>' : ''}
                </div>
                <p class="text-sm text-gray-500 mt-1">${group.participants.length} Participantes • Estado: <span class="capitalize font-medium text-christmasGreen">${group.status === 'recruiting' ? 'Recrutando' : group.status === 'drawn' ? 'Sorteado' : 'Concluído'}</span></p>
            </div>
            <div class="bg-gray-50 p-2 rounded-full group-hover:bg-red-50 group-hover:text-christmasRed transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
        </a>
    `).join('');
}

// Modals
window.openModal = (id) => document.getElementById(id).classList.remove('hidden');
window.closeModal = (id) => document.getElementById(id).classList.add('hidden');

// Create Group
document.getElementById('createForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('newGroupName').value;
    const desc = document.getElementById('newGroupDesc').value;
    const isPublic = document.getElementById('newGroupPublic').checked;

    const newGroup = {
        id: 'g-' + Date.now(),
        name,
        description: desc,
        adminId: user.id,
        isPublic,
        approvalRequired: false,
        code: Math.random().toString(36).substring(2, 8).toUpperCase(),
        participants: [user.id],
        pendingParticipants: [],
        pairings: {},
        status: 'recruiting'
    };

    State.saveGroup(newGroup);
    closeModal('createModal');
    renderGroups();
});

// Join Group
document.getElementById('joinForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const code = document.getElementById('joinCode').value.toUpperCase();
    const groups = State.getGroups();
    const group = groups.find(g => g.code === code);

    if (group) {
        if (!group.participants.includes(user.id)) {
            if (group.approvalRequired) {
                if(!group.pendingParticipants) group.pendingParticipants = [];
                group.pendingParticipants.push(user.id);
                alert("Pedido enviado para aprovação!");
            } else {
                group.participants.push(user.id);
            }
            State.saveGroup(group);
        }
        closeModal('joinModal');
        renderGroups();
    } else {
        alert("Código inválido!");
    }
});

// Public Queue Logic
document.getElementById('btnPublicQueue').addEventListener('click', () => {
    const btn = document.getElementById('btnPublicQueue');
    const txt = document.getElementById('queueText');
    
    txt.innerText = "Procurando kambas... (Aguarde)";
    
    setTimeout(() => {
        const randomName = State.generateAngolanName();
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
        State.saveGroup(newGroup);
        renderGroups();
        txt.innerText = "Combinação automática";
        alert(`Você entrou no grupo "${randomName}"!`);
    }, 2000);
});

renderGroups();
