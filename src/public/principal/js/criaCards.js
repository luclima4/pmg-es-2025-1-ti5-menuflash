    document.addEventListener("DOMContentLoaded", () => {
    console.log("criaCards.js carregado com lógica completa de carrinho e favoritos.");

    // --- ELEMENTOS DO DOM ---
    const cardsContainer = document.getElementById('divCards');
    const campoBusca = document.getElementById('campoBusca');
    const btnBusca = document.getElementById('btnBusca');
    const filtroFavoritos = document.getElementById('filtroFavoritos');

    // --- ESTADO ---
    let todosOsItens = []; // Armazena todos os itens carregados da API

    // --- LÓGICA DE AUTENTICAÇÃO ---
    const getUsuarioLogado = () => {
        try {
            const usuario = sessionStorage.getItem('usuarioLogado');
            return usuario ? JSON.parse(usuario) : null;
        } catch (e) {
            console.error("Erro ao ler usuário do sessionStorage:", e);
            return null;
        }
    };

    // --- LÓGICA DO CARRINHO ---
    const getCarrinhoUsuario = async () => {
        const usuario = getUsuarioLogado();
        const currentUserId = usuario ? usuario.id : null;
        if (!currentUserId) return null; // Não há carrinho se não houver usuário logado

        try {
            const response = await fetch(`http://localhost:3000/carrinhos?userId=${currentUserId}`);
            if (!response.ok) throw new Error("Erro na rede ao buscar carrinho");
            const carrinhos = await response.json();
            return carrinhos[0];
        } catch (error) {
            console.error("Erro ao buscar carrinho:", error);
            return null;
        }
    };

    const criarOuAtualizarCarrinho = async (carrinhoData) => {
        if (!carrinhoData || !carrinhoData.userId) return;
        const carrinhoExistente = await getCarrinhoUsuario();
        const url = `http://localhost:3000/carrinhos${carrinhoExistente ? `/${carrinhoExistente.id}` : ''}`;
        const method = carrinhoExistente ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carrinhoData)
            });
            if (!response.ok) throw new Error("Falha na operação com o carrinho.");
            window.dispatchEvent(new Event('cartUpdated')); // Notifica outras partes da aplicação
        } catch (error) {
            console.error(`Erro ao ${method === 'POST' ? 'criar' : 'atualizar'} carrinho:`, error);
        }
    };

    const adicionarAoCarrinho = async (item) => {
        const usuario = getUsuarioLogado();
        if (!usuario) {
            alert("Você precisa estar logado para adicionar itens ao carrinho.");
            return;
        }
        
        let carrinho = await getCarrinhoUsuario() || { userId: usuario.id, itens: [] };
        const itemExistente = carrinho.itens.find(i => i.id === item.id);
        
        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.itens.push({
                id: item.id,
                nome: item.titulo, // Mapeamento correto de titulo para nome
                imagem: item.imagem,
                valor: item.valor,
                nomeLanchonete: item.nomeLanchonete,
                quantidade: 1
            });
        }
        await criarOuAtualizarCarrinho(carrinho);
        mostrarFeedbackAdicionado(item.titulo);
    };

    const removerUnidadeDoCarrinho = async (item) => {
        const usuario = getUsuarioLogado();
        if (!usuario) return;
        
        let carrinho = await getCarrinhoUsuario();
        if (!carrinho || !carrinho.itens.length) return;

        const itemIndex = carrinho.itens.findIndex(i => i.id === item.id);
        if (itemIndex > -1) {
            carrinho.itens[itemIndex].quantidade--;
            if (carrinho.itens[itemIndex].quantidade <= 0) {
                carrinho.itens.splice(itemIndex, 1);
            }
            await criarOuAtualizarCarrinho(carrinho);
            mostrarFeedbackRemovido(item.titulo); // Chama o alerta de remoção
        }
    };
    
    // --- FUNÇÕES DE FEEDBACK VISUAL ---
    const mostrarFeedbackAdicionado = (nomeItem) => {
        document.querySelectorAll('.feedback-toast').forEach(t => t.remove());
        const toast = document.createElement('div');
        toast.className = 'feedback-toast';
        toast.style.cssText = `position: fixed; top: 20px; right: 20px; background-color: #198754; color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; z-index: 1050; box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.1); animation: slideIn 0.3s ease-out;`;
        toast.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> <strong>${nomeItem}</strong> foi adicionado ao carrinho!`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    };

    const mostrarFeedbackRemovido = (nomeItem) => {
        document.querySelectorAll('.feedback-toast').forEach(t => t.remove());
        const toast = document.createElement('div');
        toast.className = 'feedback-toast';
        toast.style.cssText = `position: fixed; top: 20px; right: 20px; background-color: #0d6efd; color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; z-index: 1050; box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.1); animation: slideIn 0.3s ease-out;`;
        toast.innerHTML = `<i class="bi bi-info-circle-fill me-2"></i> <strong>${nomeItem}</strong> foi atualizado no carrinho.`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    };

    // --- LÓGICA DE FAVORITOS ---
    const toggleFavorito = async (itemId, lanchoneteId) => {
        const usuario = getUsuarioLogado();
        if (!usuario || !usuario.email) {
            alert("Você precisa estar logado para favoritar itens.");
            return;
        }
        try {
            const response = await fetch(`http://localhost:3000/lanchonetes/${lanchoneteId}`);
            if (!response.ok) throw new Error("A lanchonete não foi encontrada.");
            const lanchonete = await response.json();
            const itemParaModificar = lanchonete.itens.find(i => i.id == itemId);
            if (!itemParaModificar) return;

            if (!Array.isArray(itemParaModificar.favoritos)) itemParaModificar.favoritos = [];
            
            const emailIndex = itemParaModificar.favoritos.indexOf(usuario.email);
            if (emailIndex > -1) {
                itemParaModificar.favoritos.splice(emailIndex, 1);
            } else {
                itemParaModificar.favoritos.push(usuario.email);
            }

            await fetch(`http://localhost:3000/lanchonetes/${lanchoneteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lanchonete)
            });

            const itemLocal = todosOsItens.find(i => i.id == itemId);
            if (itemLocal) itemLocal.favoritos = itemParaModificar.favoritos;
            
            aplicarFiltrosEBusca();
        } catch (error) {
            console.error("Erro ao favoritar o item:", error);
        }
    };
    
    // --- RENDERIZAÇÃO E EVENTOS ---
    const atualizarDisplayItem = async (itemId) => {
        const input = document.querySelector(`.quantity-input[data-item-id='${itemId}']`);
        if (input) {
            const carrinho = await getCarrinhoUsuario();
            const itemNoCarrinho = carrinho ? carrinho.itens.find(i => i.id === itemId) : null;
            input.value = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;
        }
    };
    
    const adicionarListenersAosCards = () => {
        document.querySelectorAll('.btn-favoritar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const { itemId, lanchoneteId } = e.currentTarget.dataset;
                toggleFavorito(itemId, lanchoneteId);
            });
        });

        document.querySelectorAll('.btn-aumentar-qnt').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const itemId = parseInt(e.currentTarget.dataset.itemId, 10);
                const item = todosOsItens.find(i => i.id === itemId);
                if (item) {
                    await adicionarAoCarrinho(item);
                    await atualizarDisplayItem(itemId);
                }
            });
        });

        document.querySelectorAll('.btn-diminuir-qnt').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const itemId = parseInt(e.currentTarget.dataset.itemId, 10);
                const item = todosOsItens.find(i => i.id === itemId);
                if (item) {
                    await removerUnidadeDoCarrinho(item);
                    await atualizarDisplayItem(itemId);
                }
            });
        });
    };

    const renderizarCards = async (itens) => {
        const carrinho = await getCarrinhoUsuario();
        const itensCarrinho = carrinho ? carrinho.itens : [];
        const usuario = getUsuarioLogado();
        
        let containerParaRenderizar = cardsContainer.querySelector('.row');
        if (!containerParaRenderizar) {
            cardsContainer.innerHTML = ''; 
            containerParaRenderizar = document.createElement('div');
            containerParaRenderizar.className = "row justify-content-center w-100";
            cardsContainer.appendChild(containerParaRenderizar);
        }
        containerParaRenderizar.innerHTML = '';

        if (itens.length === 0) {
            containerParaRenderizar.innerHTML = `<p class="text-center mt-3">Nenhum item encontrado.</p>`;
            return;
        }
        
        itens.forEach(item => {
            const itemNoCarrinho = itensCarrinho.find(i => i.id === item.id);
            const quantidadeNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;
            const isFavorito = usuario && usuario.email && Array.isArray(item.favoritos) && item.favoritos.includes(usuario.email);
            const classeIconeFavorito = isFavorito ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart';
            const estiloIndisponivel = !item.disponivel ? 'style="filter: opacity(50%);"' : '';
            const botaoDesabilitado = !item.disponivel ? 'disabled' : '';

            const cardWrapper = document.createElement('div');
            cardWrapper.className = "m-0 p-1 mt-2 col-lg-3 col-md-4 col-sm-6 d-flex";
            cardWrapper.innerHTML = `
                <div class="card shadow rounded-4 border-0 overflow-hidden mx-auto" ${estiloIndisponivel} style="width: 100%; transition: transform 0.3s;">
                    <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
                        <img src="${item.imagem}" class="card-img-top" alt="${item.titulo}" style="height: 160px; object-fit: cover;">
                    </a>
                    <div class="card-body text-center d-flex flex-column px-3 py-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h5 class="card-title fw-semibold text-truncate mb-0 me-2" title="${item.titulo}">${item.titulo}</h5>
                            <a href="#" class="btn-favoritar" data-item-id="${item.id}" data-lanchonete-id="${item.lanchoneteId}" title="Favoritar item">
                                <i class="${classeIconeFavorito}" style="font-size: 1.2rem; cursor: pointer;"></i>
                            </a>
                        </div>
                        <div class="mt-auto pt-2 d-flex justify-content-between align-items-center">
                            <p class="fw-bold h5 mb-0 mx-2">R$ ${typeof item.valor === 'number' ? item.valor.toFixed(2).replace('.', ',') : 'N/A'}</p>
                            <div class="input-group ms-2" style="max-width: 130px;" ${estiloIndisponivel}>
                                <button ${botaoDesabilitado} class="btn btn-outline-danger btn-diminuir-qnt" type="button" data-item-id="${item.id}">−</button>
                                <input type="text" class="form-control text-center quantity-input" value="${quantidadeNoCarrinho}" readonly data-item-id="${item.id}" style="max-width: 50px; user-select: none; background-color: #fff;">
                                <button ${botaoDesabilitado} class="btn btn-outline-success btn-aumentar-qnt" type="button" data-item-id="${item.id}">+</button>
                            </div>
                        </div>
                    </div>
                </div>`;
            containerParaRenderizar.appendChild(cardWrapper);
        });

        adicionarListenersAosCards();
    };

    const aplicarFiltrosEBusca = () => {
        let itensParaExibir = [...todosOsItens];
        const usuario = getUsuarioLogado();

        if (filtroFavoritos && filtroFavoritos.checked) {
            if (usuario && usuario.email) {
                itensParaExibir = itensParaExibir.filter(item => Array.isArray(item.favoritos) && item.favoritos.includes(usuario.email));
            } else {
                itensParaExibir = [];
            }
        }

        const termo = campoBusca ? campoBusca.value.trim() : '';
        if (termo !== "") {
            const fuse = new Fuse(itensParaExibir, { keys: ['titulo'], threshold: 0.4, ignoreLocation: true });
            itensParaExibir = fuse.search(termo).map(res => res.item);
        }
        renderizarCards(itensParaExibir);
    };

    // --- INICIALIZAÇÃO ---
    const inicializar = async () => {
        try {
            const response = await fetch('http://localhost:3000/lanchonetes');
            if (!response.ok) throw new Error("Não foi possível carregar os dados das lanchonetes.");
            const data = await response.json();

            let itensParaRenderizar = [];
            const params = new URLSearchParams(window.location.search);
            const idLanchonete = params.get("id");
            const campusSelecionado = params.get('campus');

            if (idLanchonete == 0 && campusSelecionado) {
                const lanchonetesDoCampus = data.filter(l => l.campus === campusSelecionado);
                lanchonetesDoCampus.forEach(lanchonete => {
                    lanchonete.itens.forEach(item => {
                        itensParaRenderizar.push({ ...item, nomeLanchonete: lanchonete.nome, lanchoneteId: lanchonete.id });
                    });
                });
            } else {
                const lanchonete = data.find(l => l.id == idLanchonete);
                if (!lanchonete) {
                    cardsContainer.innerHTML = '<p class="text-center">Lanchonete não encontrada.</p>';
                    return;
                }
                
                const lanchoneteHeader = document.createElement("div");
                lanchoneteHeader.className = " mt-4 w-100 text-center";
                lanchoneteHeader.innerHTML = `<h3>${lanchonete.nome}</h3>`;
                cardsContainer.innerHTML = '';
                cardsContainer.appendChild(lanchoneteHeader);
                
                lanchonete.itens.forEach(item => {
                    itensParaRenderizar.push({ ...item, nomeLanchonete: lanchonete.nome, lanchoneteId: lanchonete.id });
                });
            }

            todosOsItens = [...itensParaRenderizar];
            aplicarFiltrosEBusca();

        } catch (error) {
            console.error('Erro na inicialização:', error);
            if (cardsContainer) cardsContainer.innerHTML = `<p class="text-danger text-center">Erro ao carregar dados.</p>`;
        }
    };
    
    if (btnBusca) btnBusca.addEventListener('click', aplicarFiltrosEBusca);
    if (campoBusca) campoBusca.addEventListener('keypress', (e) => { if (e.key === 'Enter') aplicarFiltrosEBusca(); });
    if (filtroFavoritos) filtroFavoritos.addEventListener('change', aplicarFiltrosEBusca);
    
    inicializar();
});

const style = document.createElement('style');
style.textContent = `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
document.head.appendChild(style);