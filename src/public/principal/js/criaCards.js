document.addEventListener("DOMContentLoaded", () => {

    const cardsContainer = document.getElementById('divCards');
    const campoBusca = document.getElementById('campoBusca');
    const btnBusca = document.getElementById('btnBusca');
    const filtroFavoritos = document.getElementById('filtroFavoritos');

    let todosOsItens = [];
    let nomeLanchoneteAtual = "Cardápio";

    const getUsuarioLogado = () => {
        try {
            const usuario = sessionStorage.getItem('usuarioLogado');
            return usuario ? JSON.parse(usuario) : null;
        } catch (e) {
            console.error("Erro ao ler usuário do sessionStorage:", e);
            return null;
        }
    };

    const getCarrinhoUsuario = async () => {
        const usuario = getUsuarioLogado();
        if (!usuario || !usuario.id) return null;

        try {
            const response = await fetch(`http://localhost:3000/carrinhos?userId=${usuario.id}`);
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

        let carrinhoExistente = null;
        try {
            const res = await fetch(`http://localhost:3000/carrinhos?userId=${carrinhoData.userId}`);
            carrinhoExistente = (await res.json())[0];
        } catch (e) { }

        const url = `http://localhost:3000/carrinhos${carrinhoExistente ? `/${carrinhoExistente.id}` : ''}`;
        const method = carrinhoExistente ? 'PUT' : 'POST';

        if (!carrinhoExistente && carrinhoData.lanchoneteAtualId === undefined) {
            carrinhoData.lanchoneteAtualId = null;
        }

        try {
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carrinhoData)
            });
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) {
            console.error(`Erro ao ${method} carrinho:`, error);
        }
    };

    const adicionarAoCarrinho = async (item) => {
        const usuario = getUsuarioLogado();
        if (!usuario) return alert("Você precisa estar logado para adicionar itens ao carrinho.");
        if (usuario.tipo === 'administrador') return alert("Administradores não podem adicionar itens ao carrinho.");

        let carrinho = await getCarrinhoUsuario() || { userId: usuario.id, itens: [], lanchoneteAtualId: null };
        const itemExistente = carrinho.itens.find(i => i.id === item.id);

        if (carrinho.itens.length > 0) {
            const lanchoneteNoCarrinhoId = carrinho.lanchoneteAtualId || (carrinho.itens[0] ? carrinho.itens[0].lanchoneteId : null);

            if (item.lanchoneteId && lanchoneteNoCarrinhoId && item.lanchoneteId !== lanchoneteNoCarrinhoId) {
                alert(`Adicione no carrinho apenas itens de uma lanchonete.`);
                return;
            }
        }

        if (carrinho.itens.length === 0 && item.lanchoneteId) {
            carrinho.lanchoneteAtualId = item.lanchoneteId;
        }

        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.itens.push({
                id: item.id,
                nome: item.titulo,
                imagem: item.imagem,
                preco_unitario: item.valor,
                nomeLanchonete: item.nomeLanchonete,
                lanchoneteId: item.lanchoneteId,
                quantidade: 1
            });
        }
        await criarOuAtualizarCarrinho(carrinho);
        mostrarFeedbackAdicionado(item.titulo);
    };

    const removerUnidadeDoCarrinho = async (item) => {
        const usuario = getUsuarioLogado();
        if (!usuario) return;
        if (usuario.tipo === 'administrador') return alert("Administradores não podem modificar o carrinho.");

        let carrinho = await getCarrinhoUsuario();
        if (!carrinho || !carrinho.itens.length) return;

        const itemIndex = carrinho.itens.findIndex(i => i.id === item.id);
        if (itemIndex > -1) {
            carrinho.itens[itemIndex].quantidade--;
            if (carrinho.itens[itemIndex].quantidade <= 0) {
                carrinho.itens.splice(itemIndex, 1);
            }
            if (carrinho.itens.length === 0) {
                carrinho.lanchoneteAtualId = null;
            }
            await criarOuAtualizarCarrinho(carrinho);
            mostrarFeedbackRemovido(item.titulo);
        }
    };

    const mostrarFeedbackAdicionado = (nomeItem) => {
        document.querySelectorAll('.feedback-toast').forEach(t => t.remove());
        const toast = document.createElement('div');
        toast.className = 'feedback-toast';
        toast.style.cssText = `position: fixed; top: 20px; right: 20px; background-color: #198754; color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; z-index: 1050; animation: slideIn 0.3s ease-out;`;
        toast.innerHTML = `<i class="fas fa-check-circle me-2"></i> <strong>${nomeItem}</strong> foi adicionado!`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    };

    const mostrarFeedbackRemovido = (nomeItem) => {
        document.querySelectorAll('.feedback-toast').forEach(t => t.remove());
        const toast = document.createElement('div');
        toast.className = 'feedback-toast';
        toast.style.cssText = `position: fixed; top: 20px; right: 20px; background-color: #0d6efd; color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; z-index: 1050; animation: slideIn 0.3s ease-out;`;
        toast.innerHTML = `<i class="fas fa-info-circle me-2"></i> <strong>${nomeItem}</strong> atualizado no carrinho.`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    };

    const toggleFavorito = async (itemId, lanchoneteId) => {
        const usuario = getUsuarioLogado();
        if (!usuario || !usuario.email) return alert("Você precisa estar logado para favoritar.");
        if (usuario.tipo === 'administrador') return alert("Administradores não podem favoritar itens.");

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
            console.error("Erro ao favoritar:", error);
        }
    };

    const atualizarDisplayItem = async (itemId) => {
        const input = document.querySelector(`.quantity-input[data-item-id='${itemId}']`);
        if (input) {
            const carrinho = await getCarrinhoUsuario();
            const itemNoCarrinho = carrinho ? carrinho.itens.find(i => i.id === itemId) : null;
            input.value = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;
        }
    };

    const renderizarPagina = async (itens, titulo) => {
        if (!cardsContainer) return;
        const carrinho = await getCarrinhoUsuario();
        const itensCarrinho = carrinho ? carrinho.itens : [];
        const usuario = getUsuarioLogado();

        cardsContainer.innerHTML = '';

        const header = document.createElement('div');
        header.className = "w-100 text-center text-dark mb-4 mt-2";
        header.innerHTML = `<h2>${titulo}</h2>`;
        cardsContainer.appendChild(header);

        const containerDeCards = document.createElement('div');
        containerDeCards.className = "row justify-content-center w-100";
        cardsContainer.appendChild(containerDeCards);

        if (itens.length === 0) {
            containerDeCards.innerHTML = `<p class="text-center mt-3 text-dark">Nenhum item encontrado.</p>`;
            return;
        }

        containerDeCards.innerHTML = itens.map(item => {
            const itemNoCarrinho = itensCarrinho.find(i => i.id === item.id);
            const quantidadeNoCarrinho = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;
            const isFavorito = usuario && usuario.email && Array.isArray(item.favoritos) && item.favoritos.includes(usuario.email);
            const classeIconeFavorito = isFavorito ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart';
            const estiloIndisponivel = !item.disponivel ? 'style="filter: opacity(50%);"' : '';
            const botaoDesabilitado = !item.disponivel ? 'disabled' : '';
            const imagemCorrigida = item.imagem.replace('../principal/', '');

            return `
                <div class="m-0 p-1 mt-2 col-lg-3 col-md-4 col-sm-6 d-flex">
                    <div class="card shadow rounded-4 border-0 overflow-hidden mx-auto ${!item.disponivel ? 'card-indisponivel' : ''}" style="width: 100%;">
                        <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
                            <img src="${imagemCorrigida}" class="card-img-top" alt="${item.titulo}" style="height: 270px; object-fit: cover;">
                        </a>
                        <div class="card-body text-center d-flex flex-column px-3 py-3">
                        <p class="text-muted small mb-1">${item.nomeLanchonete}</p>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h5 class="card-title fw-semibold text-truncate mb-0 me-2" title="${item.titulo}">${item.titulo}</h5>
                                <a href="#" class="btn-favoritar" data-item-id="${item.id}" data-lanchonete-id="${item.lanchoneteId}" title="Favoritar item">
                                    <i class="${classeIconeFavorito}" style="font-size: 1.2rem; cursor: pointer;"></i>
                                </a>
                            </div>
                            <div class="mt-auto pt-2 d-flex justify-content-between align-items-center">
                                <p class="fw-bold h5 mb-0 mx-2">R$ ${Number(item.valor).toFixed(2).replace('.', ',')}</p>
                                <div class="input-group ms-2" style="max-width: 130px;" ${estiloIndisponivel}>
                                    <button ${botaoDesabilitado} class="btn btn-outline-danger btn-diminuir-qnt" type="button" data-item-id="${item.id}">−</button>
                                    <input type="text" class="form-control text-center quantity-input" value="${quantidadeNoCarrinho}" readonly data-item-id="${item.id}">
                                    <button ${botaoDesabilitado} class="btn btn-outline-success btn-aumentar-qnt" type="button" data-item-id="${item.id}">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        }).join('');
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
            const fuse = new Fuse(itensParaExibir, { keys: ['titulo'], threshold: 0.4 });
            itensParaExibir = fuse.search(termo).map(res => res.item);
        }
        renderizarPagina(itensParaExibir, nomeLanchoneteAtual);
    };

    const inicializar = async () => {
        try {
            const response = await fetch('http://localhost:3000/lanchonetes');
            if (!response.ok) throw new Error("Não foi possível carregar os dados.");
            const data = await response.json();
            const params = new URLSearchParams(window.location.search);
            const idLanchonete = params.get("id");
            const campusSelecionado = params.get('campus');

            let itensFiltrados = [];
            if (idLanchonete == 0 && campusSelecionado) {
                nomeLanchoneteAtual = `Todas as Lanchonetes - ${campusSelecionado}`;
                const lanchonetesDoCampus = data.filter(l => l.campus === campusSelecionado);
                lanchonetesDoCampus.forEach(l => {
                    (l.itens || []).forEach(item => itensFiltrados.push({ ...item, nomeLanchonete: l.nome, lanchoneteId: l.id }));
                });
            } else if (idLanchonete) {
                const lanchonete = data.find(l => String(l.id) === String(idLanchonete));
                if (lanchonete) {
                    nomeLanchoneteAtual = lanchonete.nome;
                    itensFiltrados = (lanchonete.itens || []).map(item => ({ ...item, nomeLanchonete: lanchonete.nome, lanchoneteId: lanchonete.id }));
                    sessionStorage.setItem("campusAnterior", lanchonete.campus);
                    sessionStorage.setItem("lanchoneteAnterior", lanchonete.id);
                } else {
                    nomeLanchoneteAtual = "Lanchonete não encontrada";
                }
            } else {
                nomeLanchoneteAtual = "Selecione uma lanchonete";
            }

            todosOsItens = [...itensFiltrados];
            aplicarFiltrosEBusca();

        } catch (error) {
            console.error('Erro na inicialização:', error);
            if (cardsContainer) cardsContainer.innerHTML = `<p class="text-danger text-center p-5">Erro ao carregar dados.</p>`;
        }
    };

    cardsContainer.addEventListener('click', async (e) => {
        const target = e.target;

        const btnFavorito = target.closest('.btn-favoritar');
        if (btnFavorito) {
            e.preventDefault();
            const { itemId, lanchoneteId } = btnFavorito.dataset;
            await toggleFavorito(itemId, lanchoneteId);
        }

        const btnAumentar = target.closest('.btn-aumentar-qnt');
        if (btnAumentar) {
            const itemId = parseInt(btnAumentar.dataset.itemId, 10);
            const item = todosOsItens.find(i => i.id === itemId);
            if (item) {
                await adicionarAoCarrinho(item);
                await atualizarDisplayItem(itemId);
            }
        }

        const btnDiminuir = target.closest('.btn-diminuir-qnt');
        if (btnDiminuir) {
            const itemId = parseInt(btnDiminuir.dataset.itemId, 10);
            const item = todosOsItens.find(i => i.id === itemId);
            if (item) {
                await removerUnidadeDoCarrinho(item);
                await atualizarDisplayItem(itemId);
            }
        }
    });

    if (campoBusca) {
        btnBusca.addEventListener('click', aplicarFiltrosEBusca);
        campoBusca.addEventListener('keypress', (e) => { if (e.key === 'Enter') aplicarFiltrosEBusca(); });
    }
    if (filtroFavoritos) filtroFavoritos.addEventListener('change', aplicarFiltrosEBusca);

    inicializar();
});

const style = document.createElement('style');
style.textContent = `@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`;
document.head.appendChild(style);