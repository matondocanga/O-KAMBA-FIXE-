// Lógica da Página de Grupo
document.addEventListener('DOMContentLoaded', () => {
    if (!window.State || !window.checkAuth) return;
    window.checkAuth();

    const params = new URLSearchParams(window.location.search);
    const groupId = params.get('id');
    const user = window.State.getUser();
    
    if (!groupId) {
        window.location.href = 'dashboard.html';
        return;
    }

    let group = window.State.getGroups().find(g => g.id === groupId);

    if (!group) {
        alert("Grupo não encontrado!");
        window.location.href = 'dashboard.html';
        return;
    }

    const isAdmin = group.adminId === user.id;

    // DOM Elements
    const els = {
        nameHeader: document.getElementById('groupNameHeader'),
        nameHero: document.getElementById('groupNameHero'),
        code: document.getElementById('groupCode'),
        revealCard: document.getElementById('revealCard'),
        revealName: document.getElementById('revealName'),
        adminZone: document.getElementById('adminZone'),
        participantsList: document.getElementById('participantsList'),
        messages: document.getElementById('chatMessages'),
        msgInput: document.getElementById('msgInput'),
        pendingContainer: document.getElementById('pendingListContainer'),
        pendingList: document.getElementById('pendingList')
    };

    // --- INITIAL RENDER ---
    function init() {
        if(els.nameHeader) els.nameHeader.textContent = group.name;
        if(els.nameHero) els.nameHero.textContent = group.name;
        if(els.code) els.code.textContent = group.code;

        // Show reveal if drawn
        if (group.status === 'drawn' && group.pairings && group.pairings[user.id]) {
            if(els.revealCard) els.revealCard.classList.remove('hidden');
            const targetId = group.pairings[user.id];
            
            // Tenta achar o nome do usuário alvo
            let targetName = "Amigo Secreto";
            if (targetId.startsWith('bot')) {
                targetName = "Elfo " + targetId;
            } else {
                targetName = "Kamba " + targetId.substring(0, 5); 
            }
            
            if(els.revealName) els.revealName.textContent = targetName;
        }

        if (isAdmin) {
            if(els.adminZone) els.adminZone.classList.remove('hidden');
            const settings = document.getElementById('adminSettings');
            if(settings) settings.classList.remove('hidden');
            updateSettingsToggles();
            renderPending();
        } else {
            const msg = document.getElementById('notAdminMsg');
            if(msg) msg.classList.remove('hidden');
        }

        renderParticipants();
        renderChat();
        renderShop();
    }

    // --- TABS LOGIC ---
    window.switchTab = (tabName) => {
        ['info', 'chat', 'activities', 'shop', 'settings'].forEach(t => {
            const content = document.getElementById('content-' + t);
            if(content) content.classList.add('hidden');
            
            const btn = document.getElementById('tab-' + t);
            if(btn) {
                btn.classList.remove('bg-christmasRed', 'text-white', 'shadow-md');
                btn.classList.add('text-gray-500', 'hover:bg-gray-50');
            }
        });

        const activeContent = document.getElementById('content-' + tabName);
        if(activeContent) activeContent.classList.remove('hidden');
        
        const activeBtn = document.getElementById('tab-' + tabName);
        if(activeBtn) {
            activeBtn.classList.remove('text-gray-500', 'hover:bg-gray-50');
            activeBtn.classList.add('bg-christmasRed', 'text-white', 'shadow-md');
        }

        if (tabName === 'chat' && els.messages) {
            els.messages.scrollTop = els.messages.scrollHeight;
        }
    };

    function renderParticipants() {
        if(!els.participantsList) return;
        els.participantsList.innerHTML = group.participants.map(pid => `
            <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-christmasGold/20 flex items-center justify-center text-christmasGold font-bold">
                        ${pid.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p class="font-bold text-gray-800 text-sm">${pid === user.id ? 'Você' : 'Kamba ' + pid.substring(0,4)}</p>
                        <p class="text-xs text-gray-500">${pid === group.adminId ? 'Admin' : 'Membro'}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function renderChat() {
        if(!els.messages) return;
        const msgs = window.State.getMessages(groupId);
        if (msgs.length === 0) {
            els.messages.innerHTML = '<div class="text-center text-gray-400 py-10">Sem mensagens. Diga Olá! 👋</div>';
            return;
        }
        
        els.messages.innerHTML = msgs.map(msg => `
            <div class="flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}">
                <div class="max-w-[70%] rounded-2xl p-3 shadow-sm ${msg.senderId === user.id ? 'bg-christmasRed text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}">
                    <p class="text-xs opacity-70 mb-1">${msg.senderName}</p>
                    <p class="text-sm">${msg.text}</p>
                </div>
            </div>
        `).join('');
        els.messages.scrollTop = els.messages.scrollHeight;
    }

    const chatForm = document.getElementById('chatForm');
    if(chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = els.msgInput.value.trim();
            if (!text) return;

            window.State.addMessage({
                id: 'm-' + Date.now(),
                groupId,
                senderId: user.id,
                senderName: user.name,
                text,
                timestamp: Date.now()
            });
            els.msgInput.value = '';
            renderChat();
        });
    }

    // --- GLOBAL ACTIONS ---
    window.runDraw = () => {
        if (group.participants.length < 4) return alert("Mínimo 4 participantes!");
        if (!confirm("Sorteio é definitivo. Continuar?")) return;

        let parts = [...group.participants];
        for (let i = parts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [parts[i], parts[j]] = [parts[j], parts[i]];
        }
        const pairings = {};
        for (let i = 0; i < parts.length; i++) {
            pairings[parts[i]] = parts[(i + 1) % parts.length];
        }
        
        group.pairings = pairings;
        group.status = 'drawn';
        window.State.saveGroup(group);
        location.reload();
    };

    window.toggleApproval = () => {
        group.approvalRequired = !group.approvalRequired;
        window.State.saveGroup(group);
        updateSettingsToggles();
    };

    window.togglePublic = () => {
        group.isPublic = !group.isPublic;
        window.State.saveGroup(group);
        updateSettingsToggles();
    };

    function updateSettingsToggles() {
        const btnApp = document.getElementById('btnApproval');
        if(btnApp) {
            const ballApp = btnApp.querySelector('div');
            if (group.approvalRequired) {
                btnApp.classList.remove('bg-gray-300');
                btnApp.classList.add('bg-christmasGreen');
                ballApp.style.transform = 'translateX(24px)';
            } else {
                btnApp.classList.add('bg-gray-300');
                btnApp.classList.remove('bg-christmasGreen');
                ballApp.style.transform = 'translateX(0)';
            }
        }

        const btnPub = document.getElementById('btnPublic');
        if(btnPub) {
            const ballPub = btnPub.querySelector('div');
            if (group.isPublic) {
                btnPub.classList.remove('bg-gray-300');
                btnPub.classList.add('bg-christmasGreen');
                ballPub.style.transform = 'translateX(24px)';
            } else {
                btnPub.classList.add('bg-gray-300');
                btnPub.classList.remove('bg-christmasGreen');
                ballPub.style.transform = 'translateX(0)';
            }
        }
    }

    function renderPending() {
        if (!group.pendingParticipants || group.pendingParticipants.length === 0) {
            if(els.pendingContainer) els.pendingContainer.classList.add('hidden');
            return;
        }
        if(els.pendingContainer) els.pendingContainer.classList.remove('hidden');
        if(els.pendingList) {
            els.pendingList.innerHTML = group.pendingParticipants.map(pid => `
                <div class="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                    <span class="text-sm font-bold text-gray-700">${pid}</span>
                    <div class="flex gap-2">
                        <button onclick="handleRequest('${pid}', true)" class="text-green-600 font-bold">✓</button>
                        <button onclick="handleRequest('${pid}', false)" class="text-red-600 font-bold">X</button>
                    </div>
                </div>
            `).join('');
        }
    }

    window.handleRequest = (pid, approve) => {
        group.pendingParticipants = group.pendingParticipants.filter(id => id !== pid);
        if (approve) group.participants.push(pid);
        window.State.saveGroup(group);
        renderPending();
        renderParticipants();
    };

    window.startGame = (type) => {
        const menu = document.getElementById('gamesMenu');
        const container = document.getElementById('activeGameContainer');
        const vp = document.getElementById('gameViewport');
        
        if(menu) menu.classList.add('hidden');
        if(container) container.classList.remove('hidden');
        
        if (type === 'quiz') renderQuiz(vp);
        else if (type === 'anagram') renderAnagram(vp);
    };

    window.closeGame = () => {
        const menu = document.getElementById('gamesMenu');
        const container = document.getElementById('activeGameContainer');
        const vp = document.getElementById('gameViewport');

        if(menu) menu.classList.remove('hidden');
        if(container) container.classList.add('hidden');
        if(vp) vp.innerHTML = '';
    };

    function renderQuiz(container) {
        if(!container) return;
        const questions = [
            { q: "Onde o Papai Noel vive?", options: ["Luanda", "Pólo Norte", "Huambo"], ans: 1 },
            { q: "Data do Natal?", options: ["24 Dez", "25 Dez", "31 Dez"], ans: 1 }
        ];
        let curr = 0;
        let score = 0;
        let processing = false;

        function draw() {
            if (curr >= questions.length) {
                container.innerHTML = `<div class="text-center p-6 bg-green-50 rounded-xl font-bold text-christmasGreen">Fim! Pontos: ${score}</div>`;
                return;
            }
            const q = questions[curr];
            container.innerHTML = `
                <div class="bg-white p-4 rounded-xl border border-gray-200">
                    <h3 class="font-bold mb-4">${q.q}</h3>
                    <div class="grid gap-2" id="quizOpts">
                        ${q.options.map((o, i) => `<button class="p-3 bg-gray-50 rounded-lg text-left" id="qbtn-${i}">${o}</button>`).join('')}
                    </div>
                </div>
            `;
            // Re-attach listeners dynamically
            q.options.forEach((_, i) => {
                document.getElementById('qbtn-' + i).onclick = () => handleQuiz(i);
            });
        }

        const handleQuiz = (idx) => {
            if (processing) return;
            processing = true;
            const btn = document.getElementById('qbtn-' + idx);
            if(btn) btn.classList.add('bg-christmasGold', 'text-white');
            
            setTimeout(() => {
                if (idx === questions[curr].ans) score++;
                curr++;
                processing = false;
                draw();
            }, 500);
        };
        draw();
    }

    function renderAnagram(container) {
        if(!container) return;
        const word = "NATAL";
        const scrambled = "LATAN";
        container.innerHTML = `
            <div class="text-center p-4 bg-orange-50 rounded-xl">
                <h3 class="font-bold mb-2">Desembaralhe:</h3>
                <div class="text-3xl font-mono font-bold mb-4 bg-white p-2">${scrambled}</div>
                <input type="text" id="anagramInput" class="w-full p-2 rounded mb-2 text-center uppercase">
                <button id="btnCheckAnagram" class="bg-orange-500 text-white w-full py-2 rounded font-bold">Verificar</button>
            </div>
        `;
        document.getElementById('btnCheckAnagram').onclick = () => {
            const val = document.getElementById('anagramInput').value.toUpperCase();
            if (val === word) alert("Correto!");
            else alert("Tente de novo");
        };
    }

    let selectedProduct = null;
    function renderShop() {
        const grid = document.getElementById('productsGrid');
        if(!grid) return;
        grid.innerHTML = window.MOCK_PRODUCTS.map((p, i) => `
            <div class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                <img src="${p.image}" class="w-full h-32 object-cover">
                <div class="p-2">
                    <h4 class="font-bold text-sm truncate">${p.name}</h4>
                    <p class="text-xs text-christmasRed font-bold mb-2">${p.price} ${p.currency}</p>
                    <button id="buy-${i}" class="w-full bg-christmasGreen text-white py-1 rounded-lg text-xs font-bold">
                        Encomendar
                    </button>
                </div>
            </div>
        `).join('');
        
        // Attach listeners
        window.MOCK_PRODUCTS.forEach((p, i) => {
            document.getElementById('buy-' + i).onclick = () => openShopModal(p);
        });
    }

    window.openShopModal = (p) => {
        selectedProduct = p;
        document.getElementById('productNameModal').textContent = p.name;
        document.getElementById('shopModal').classList.remove('hidden');
        
        const sel = document.getElementById('orderRecipient');
        sel.innerHTML = `<option value="">Para quem?</option>` + 
            group.participants.map(pid => `<option value="${pid}">${pid === user.id ? 'Mim mesmo' : pid}</option>`).join('');
    };

    window.sendWhatsApp = () => {
        const recId = document.getElementById('orderRecipient').value;
        const notes = document.getElementById('orderNotes').value;
        if (!recId) return alert("Selecione o destinatário");

        const rawMessage = `*Olá ${window.State.VENDOR.name}!* 👋\n` +
            `Quero encomendar via *O KAMBA FIXE!* 🎁\n\n` +
            `🛍️ *Item:* ${selectedProduct.name}\n` +
            `💰 *Valor:* ${selectedProduct.price} ${selectedProduct.currency}\n` +
            `👤 *Para:* ${recId}\n` +
            `📝 *Obs:* ${notes || 'Nenhuma'}`;

        const url = `https://wa.me/${window.State.VENDOR.phone}?text=${encodeURIComponent(rawMessage)}`;
        window.open(url, '_blank');
        document.getElementById('shopModal').classList.add('hidden');
    };

    init();
});