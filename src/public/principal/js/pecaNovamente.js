document.addEventListener("DOMContentLoaded", () => {
    console.log("criaCards.js carregado com lógica final e corrigida.");

    const cardsContainer = document.getElementById('divCards');
    if (!cardsContainer) return;

    let nomeLanchoneteAtual = "Últimos Pedidos";

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

        let carrinho = await getCarrinhoUsuario() || { userId: usuario.id, itens: [] };
        const itemExistente = carrinho.itens.find(i => i.id === item.id);

        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.itens.push({
                id: item.id,
                nome: item.titulo,
                imagem: item.imagem,
                preco_unitario: item.valor,
                nomeLanchonete: item.nomeLanchonete,
                quantidade: 1
            });
        }
        await criarOuAtualizarCarrinho(carrinho);
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

    //animação para aparecer deslizando
    const style = document.createElement('style');
    style.textContent = `@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`;
    document.head.appendChild(style);


    const renderizarHistorico = async () => {
        const usuario = getUsuarioLogado();
        if (!usuario) {
            cardsContainer.innerHTML = '<div class="alert alert-warning text-center">Você precisa estar logado para ver seu histórico.</div>';
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/usuarios/${usuario.id}`);
            const usuarioCompleto = await response.json();
            const historico = (usuarioCompleto.historico_de_pedidos || []).slice().reverse().slice(0, 2);

            const carrinho = await getCarrinhoUsuario();
            const itensCarrinho = carrinho ? carrinho.itens : [];

            cardsContainer.innerHTML = '';

            // Header geral
            const containerDeCards = document.createElement('div');
            containerDeCards.className = "w-100";
            cardsContainer.appendChild(containerDeCards);

            historico.forEach(pedido => {
                // Header do pedido
                const pedidoHeader = document.createElement('div');
                pedidoHeader.className = "pedido-header bg-light p-3 mb-3 rounded-3 shadow-sm";
                pedidoHeader.innerHTML = `
                <p class="mb-1 mx-auto text-center text-light p-2" style="background-color: #a00000; max-width: 500px;">Pedido #${pedido.pedido_id} - ${usuario.nome} - ${pedido.data} às ${pedido.hora} - R$ ${Number(pedido.total).toFixed(2).replace('.', ',')}</p>
            `;
                containerDeCards.appendChild(pedidoHeader);

                // Container dos itens desse pedido
                const itensContainer = document.createElement('div');
                itensContainer.className = "row justify-content-center mb-4";
                containerDeCards.appendChild(itensContainer);

                pedido.itens.forEach(item => {
                    const quantidadeNoPedido = item.quantidade || 1;
                    const quantidadeNoCarrinho = (itensCarrinho.find(i => i.id === item.id) || {}).quantidade || 0;
                    const imagemCorrigida = item.imagem.replace('../principal/', '');

                    const cardHTML = `
                    <div class="m-0 p-1 mt-2 col-lg-3 col-md-4 col-sm-6 d-flex">
                        <div class="card shadow rounded-4 border-0 overflow-hidden mx-auto" style="width: 100%;">
                            <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
                                <img src="${imagemCorrigida}" class="card-img-top" alt="${item.titulo}" style="height: 160px; object-fit: cover;">
                            </a>
                            <div class="card-body text-center d-flex flex-column px-3 py-3">
                                <h5 class="card-title fw-semibold text-truncate mb-1" title="${item.titulo}">${item.titulo}</h5>
                                <p class="text-muted small mb-2">${quantidadeNoPedido}x</p>
                                <div class="mt-auto pt-2 d-flex justify-content-between align-items-center">
                                    <p class="fw-bold h5 mb-0 mx-2">R$ ${Number(item.preco_unitario).toFixed(2).replace('.', ',')}</p>
                                    <div class="input-group ms-2" style="max-width: 130px;">
                                        <button class="btn btn-outline-danger btn-diminuir-qnt" type="button" data-item-id="${item.id}">−</button>
                                        <input type="text" class="form-control text-center quantity-input" value="${quantidadeNoCarrinho}" readonly data-item-id="${item.id}">
                                        <button class="btn btn-outline-success btn-aumentar-qnt" type="button" data-item-id="${item.id}">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                    itensContainer.innerHTML += cardHTML;
                });
            });
        } catch (error) {
            console.error("Erro ao carregar histórico:", error);
            cardsContainer.innerHTML = '<div class="alert alert-danger text-center">Erro ao carregar histórico de pedidos.</div>';
        }
    };


    cardsContainer.addEventListener('click', async (e) => {
        const target = e.target;

        const btnAumentar = target.closest('.btn-aumentar-qnt');
        if (btnAumentar) {
            const itemId = parseInt(btnAumentar.dataset.itemId, 10);
            const card = btnAumentar.closest('.card');
            const titulo = card.querySelector('.card-title').textContent;
            const imagem = card.querySelector('img').src;
            const preco = parseFloat(card.querySelector('.fw-bold').textContent.replace('R$ ', '').replace(',', '.'));

            await adicionarAoCarrinho({ id: itemId, titulo, imagem, valor: preco });
            const input = card.querySelector(`.quantity-input[data-item-id='${itemId}']`);
            const carrinho = await getCarrinhoUsuario();
            const item = carrinho?.itens.find(i => i.id === itemId);
            if (input && item) input.value = item.quantidade;
            mostrarFeedbackAdicionado(titulo);
        }

        const btnDiminuir = target.closest('.btn-diminuir-qnt');
        if (btnDiminuir) {
            const itemId = parseInt(btnDiminuir.dataset.itemId, 10);
            const card = btnDiminuir.closest('.card');
            const titulo = card.querySelector('.card-title').textContent;
            const imagem = card.querySelector('img').src;
            const preco = parseFloat(card.querySelector('.fw-bold').textContent.replace('R$ ', '').replace(',', '.'));

            await removerUnidadeDoCarrinho({ id: itemId, titulo, imagem, valor: preco });
            const input = card.querySelector(`.quantity-input[data-item-id='${itemId}']`);
            const carrinho = await getCarrinhoUsuario();
            const item = carrinho?.itens.find(i => i.id === itemId);
            if (input) input.value = item ? item.quantidade : 0;
            mostrarFeedbackRemovido(titulo);
        }
    });

    renderizarHistorico();
});
