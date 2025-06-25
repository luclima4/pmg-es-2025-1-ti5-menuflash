// Arquivo: Perfil/js/perfil.js
// Versão final com todas as funcionalidades: CRUD de usuário, histórico e favoritos.

document.addEventListener("DOMContentLoaded", () => {
    // --- SETUP INICIAL ---
    const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado") || 'null');
    if (!usuarioLogado || !usuarioLogado.id) {
        alert("Sessão inválida. Por favor, faça login novamente.");
        window.location.href = "../cadastro_login/login.html";
        return;
    }

    // --- ELEMENTOS DO DOM ---
    const userNameInput = document.getElementById("userName");
    const userEmailInput = document.getElementById("userEmail");
    const btnSaveChanges = document.getElementById("btnSaveChanges");
    const btnCancel = document.getElementById("btnCancel");
    const inputSenha = document.getElementById("inputSenha");
    const inputNovaSenha1 = document.getElementById("inputNovaSenha1");
    const inputNovaSenha2 = document.getElementById("inputNovaSenha2");
    const containerFavoritos = document.getElementById("containerFavoritos");
    const containerHistorico = document.getElementById('inserirHistorico');


    // --- FUNÇÕES AUXILIARES ---
    const formatarMoeda = (valor) => Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const normalizarCaminhoImagem = (caminho) => {
        if (!caminho) return ''; // Retorna string vazia se não houver imagem
        const caminhoLimpo = caminho.replace('../principal/', '');
        return `../principal/${caminhoLimpo}`;
    };

    // --- LÓGICA DE CARREGAMENTO DE DADOS ---
    const carregarHistorico = (historico, todasAsLanchonetes) => {
        if (!containerHistorico) return;
        if (!historico || historico.length === 0) {
            containerHistorico.innerHTML = `<p class="text-center text-muted">Seu histórico de pedidos está vazio.</p>`;
            return;
        }
        const pedidosOrdenados = historico.sort((a, b) => new Date(b.data || 0) - new Date(a.data || 0));
        
        containerHistorico.innerHTML = `
            <h5 class="mb-4">Seu Histórico de Pedidos</h5>
            ${pedidosOrdenados.map(pedido => {
                const lanchonete = todasAsLanchonetes.find(l => String(l.id) === String(pedido.lanchonete_id));
                const nomeLanchonete = lanchonete ? lanchonete.nome : 'Lanchonete';
                const dataFormatada = new Date(pedido.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
                const itensHTML = pedido.itens.map(item => `
                    <li class="list-group-item d-flex justify-content-between align-items-center p-1">
                        <div class="d-flex align-items-center">
                            <img src="${normalizarCaminhoImagem(item.imagem)}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; margin-right: 10px;" alt="${item.titulo}">
                            <span>${item.quantidade}x ${item.titulo}</span>
                        </div>
                        <span class="text-muted">${formatarMoeda(item.subtotal)}</span>
                    </li>`).join('');
                return `
                    <div class="card mb-3">
                        <div class="card-header bg-light d-flex justify-content-between flex-wrap">
                            <strong>Pedido #${pedido.pedido_id.split('_')[1]}</strong>
                            <span class="text-muted">${dataFormatada}</span>
                        </div>
                        <div class="card-body">
                            <p class="card-text mb-1"><strong>Lanchonete:</strong> ${nomeLanchonete}</p>
                            <p class="card-text mb-2 fw-bold">Total: ${formatarMoeda(pedido.total)}</p>
                            <h6 class="mt-3 mb-2 small text-uppercase">Itens:</h6>
                            <ul class="list-group list-group-flush">${itensHTML}</ul>
                        </div>
                    </div>`;
            }).join('')}`;
    };
    
    const carregarFavoritos = (usuario, todasAsLanchonetes) => {
        if (!containerFavoritos) return;
        const meusFavoritos = [];
        todasAsLanchonetes.forEach(lanchonete => {
            (lanchonete.itens || []).forEach(item => {
                if (Array.isArray(item.favoritos) && item.favoritos.includes(usuario.email)) {
                    meusFavoritos.push({ ...item, lanchoneteId: lanchonete.id, nomeLanchonete: lanchonete.nome });
                }
            });
        });

        if (meusFavoritos.length === 0) {
            containerFavoritos.innerHTML = '<p class="text-center text-muted">Você ainda não favoritou nenhum item.</p>';
            return;
        }

        containerFavoritos.innerHTML = `
            <h5 class="mb-4">Seus Itens Favoritos</h5>
            <ul class="list-group">
                ${meusFavoritos.map(item => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <img src="${normalizarCaminhoImagem(item.imagem)}" alt="${item.titulo}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 15px;">
                            <div>
                                <strong>${item.titulo}</strong><br>
                                <small class="text-muted">${item.nomeLanchonete}</small>
                            </div>
                        </div>
                        <button class="btn btn-sm btn-outline-danger btn-desfavoritar" 
                                data-item-id="${item.id}" 
                                data-lanchonete-id="${item.lanchoneteId}"
                                data-item-titulo="${item.titulo}"
                                title="Remover dos favoritos">
                            <i class="fas fa-heart-broken"></i>
                        </button>
                    </li>
                `).join('')}
            </ul>
        `;
    };

    // --- LÓGICA DE AÇÕES (CRUD, FAVORITOS) ---
    const salvarMudancas = async () => {
        const payload = {};
        const nomeAtualizado = userNameInput.value.trim();
        const emailAtualizado = userEmailInput.value.trim();

        if (nomeAtualizado !== usuarioLogado.nome) payload.nome = nomeAtualizado;
        
        if (emailAtualizado !== usuarioLogado.email) {
            if (!emailAtualizado.includes('@')) return alert("Por favor, insira um e-mail válido.");
            
            const checkEmailResponse = await fetch(`http://localhost:3000/usuarios?email=${emailAtualizado}`);
            const existingUsers = await checkEmailResponse.json();
            if (existingUsers.length > 0 && existingUsers[0].id !== usuarioLogado.id) {
                return alert("Este e-mail já está em uso por outra conta.");
            }
            if (!confirm("Atenção! Mudar seu e-mail fará com que você perca seus favoritos atuais e exigirá um novo login. Deseja continuar?")) {
                userEmailInput.value = usuarioLogado.email;
                return;
            }
            payload.email = emailAtualizado;
        }

        if (inputSenha.value) {
            if (inputSenha.value !== usuarioLogado.senha) return alert("A senha atual está incorreta.");
            if (!inputNovaSenha1.value || inputNovaSenha1.value !== inputNovaSenha2.value) return alert("As novas senhas não conferem ou estão em branco.");
            if (inputNovaSenha1.value.length < 6) return alert("A nova senha deve ter no mínimo 6 caracteres.");
            payload.senha = inputNovaSenha1.value;
        }
        
        if (Object.keys(payload).length === 0) return alert("Nenhuma alteração para salvar.");

        try {
            const response = await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error("Falha ao salvar as alterações.");
            
            const usuarioAtualizado = await response.json();
            sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioAtualizado));
            
            alert("Perfil atualizado com sucesso! A página será recarregada.");
            location.reload();
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Não foi possível salvar as alterações.");
        }
    };

    const resetarFormulario = () => {
        userNameInput.value = usuarioLogado.nome;
        userEmailInput.value = usuarioLogado.email;
        inputSenha.value = '';
        inputNovaSenha1.value = '';
        inputNovaSenha2.value = '';
        inputNovaSenha1.disabled = true;
        inputNovaSenha2.disabled = true;
    };
    
    const toggleFavorito = async (itemId, lanchoneteId) => {
        try {
            const response = await fetch(`http://localhost:3000/lanchonetes/${lanchoneteId}`);
            const lanchonete = await response.json();
            const itemParaModificar = lanchonete.itens.find(i => i.id == itemId);
            if (!itemParaModificar || !Array.isArray(itemParaModificar.favoritos)) return;
            
            const emailIndex = itemParaModificar.favoritos.indexOf(usuarioLogado.email);
            if (emailIndex > -1) itemParaModificar.favoritos.splice(emailIndex, 1);

            await fetch(`http://localhost:3000/lanchonetes/${lanchoneteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lanchonete)
            });
            
            inicializarPagina();
        } catch (error) {
            console.error("Erro ao desfavoritar:", error);
            alert("Não foi possível remover o favorito.");
        }
    };

    // --- INICIALIZAÇÃO E EVENT LISTENERS ---
    const inicializarPagina = async () => {
        resetarFormulario();
        try {
            const [userResponse, lanchonetesResponse] = await Promise.all([
                fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`),
                fetch('http://localhost:3000/lanchonetes')
            ]);
            if (!userResponse.ok || !lanchonetesResponse.ok) throw new Error("Falha ao carregar dados.");
            
            const usuarioCompleto = await userResponse.json();
            const todasAsLanchonetes = await lanchonetesResponse.json();
            
            carregarHistorico(usuarioCompleto.historico_de_pedidos, todasAsLanchonetes);
            carregarFavoritos(usuarioCompleto, todasAsLanchonetes);
        } catch (error) {
            console.error("Erro ao inicializar:", error);
            if(containerHistorico) containerHistorico.innerHTML = `<p class="text-danger">Não foi possível carregar seu histórico.</p>`;
            if(containerFavoritos) containerFavoritos.innerHTML = `<p class="text-danger">Não foi possível carregar seus favoritos.</p>`;
        }
    };

    btnSaveChanges.addEventListener('click', salvarMudancas);
    btnCancel.addEventListener('click', resetarFormulario);
    inputSenha.addEventListener('input', () => {
        const habilitar = inputSenha.value === usuarioLogado.senha;
        inputNovaSenha1.disabled = !habilitar;
        inputNovaSenha2.disabled = !habilitar;
    });

    containerFavoritos.addEventListener('click', (e) => {
        const target = e.target.closest('.btn-desfavoritar');
        if (target) {
            const { itemId, lanchoneteId, itemTitulo } = target.dataset;
            if(confirm(`Tem certeza que deseja remover "${itemTitulo}" dos favoritos?`)) {
                toggleFavorito(itemId, lanchoneteId);
            }
        }
    });

    inicializarPagina();
});




