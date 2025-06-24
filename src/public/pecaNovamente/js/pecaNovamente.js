document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('historico-container');
    if (!container) return;

    const getUsuarioLogado = () => {
        try {
            const usuario = sessionStorage.getItem('usuarioLogado');
            return usuario ? JSON.parse(usuario) : null;
        } catch (e) { return null; }
    };

    const normalizarCaminhoImagem = (caminhoOriginal) => {
        if (!caminhoOriginal) return '';
        return `../principal/${caminhoOriginal.replace('../principal/', '')}`;
    };

    const getCarrinhoUsuario = async () => {
        const usuario = getUsuarioLogado();
        if (!usuario) return null;
        const res = await fetch(`http://localhost:3000/carrinhos?userId=${usuario.id}`);
        const carrinhos = await res.json();
        return carrinhos[0];
    };

    const criarOuAtualizarCarrinho = async (carrinhoData) => {
        const existente = await getCarrinhoUsuario();
        const url = `http://localhost:3000/carrinhos${existente ? `/${existente.id}` : ''}`;
        const method = existente ? 'PUT' : 'POST';
        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(carrinhoData)
        });
        window.dispatchEvent(new Event('cartUpdated'));
    };

    const adicionarAoCarrinho = async (item) => {
        const usuario = getUsuarioLogado();
        if (!usuario) return;

        let carrinho = await getCarrinhoUsuario() || { userId: usuario.id, itens: [] };
        const itemExistente = carrinho.itens.find(i => i.id === item.id);

        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.itens.push({
                id: item.id,
                nome: item.nome || item.titulo,
                imagem: item.imagem,
                valor: item.valor || item.preco_unitario,
                nomeLanchonete: item.nomeLanchonete || 'Lanchonete',
                quantidade: 1
            });
        }

        await criarOuAtualizarCarrinho(carrinho);
    };

    const carregarHistorico = async () => {
        const usuario = getUsuarioLogado();
        if (!usuario) {
            container.innerHTML = `<div class="alert alert-warning text-center">Você precisa estar logado para ver seu histórico.</div>`;
            return;
        }

        const res = await fetch(`http://localhost:3000/usuarios/${usuario.id}`);
        const user = await res.json();
        const historico = (user.historico_de_pedidos || []).slice(-2).reverse();

        if (historico.length === 0) {
            container.innerHTML = `<div class="alert alert-info text-center">Seu histórico está vazio.</div>`;
            return;
        }

        container.innerHTML = '';

        historico.forEach(pedido => {
            const data = new Date(pedido.data).toLocaleDateString('pt-BR');
            const hora = pedido.hora;

            const itensHTML = pedido.itens.map(item => {
                const imagemCorrigida = normalizarCaminhoImagem(item.imagem);
                const quantidade = item.quantidade || 1;
                const preco = Number(item.preco_unitario || item.valor || 0).toFixed(2).replace('.', ',');
                const titulo = item.titulo || item.nome;
                const quantidadeNoCarrinho = quantidade;
                const botaoDesabilitado = ''; // Pode adaptar com base na lógica
                const estiloIndisponivel = ''; // Pode adaptar com base na lógica
                const classeIconeFavorito = 'fa-regular fa-heart'; // Placeholder

                return `
                    <div class="m-0 p-1 mt-2 col-lg-3 col-md-4 col-sm-6 d-flex">
                    <div class="card shadow rounded-4 border-0 overflow-hidden mx-auto" style="width: 100%;">
                        <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
                            <img src="${imagemCorrigida}" class="card-img-top" alt="${titulo}" style="height: 160px; object-fit: cover;">
                        </a>
                        <div class="card-body text-center d-flex flex-column px-3 py-3">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <h5 class="card-title fw-semibold text-truncate mb-0 me-2" title="${titulo}">${titulo}</h5>
                                <a href="#" class="btn-favoritar" data-item-id="${item.id}" title="Favoritar item">
                                    <i class="fa-regular fa-heart" style="font-size: 1.2rem; cursor: pointer;"></i>
                                </a>
                            </div>
                            <p class="text-muted small mb-2">Quantidade no pedido: <strong>${quantidade}</strong></p>
                            <div class="mt-auto pt-2 d-flex justify-content-between align-items-center">
                                <p class="fw-bold h5 mb-0 mx-2">R$ ${preco}</p>
                            </div>
                            <button class="btn btn-sm btn-adicionar-item text-light mt-3" style="background-color: #a00000" data-item='${JSON.stringify(item)}'>
                                <i class="fas fa-cart-plus me-2"></i> Adicionar
                            </button>
                        </div>
                    </div>
                </div>
                `;
            }).join('');

            container.innerHTML += `
                <div class="card mb-4">
                    <div class="card-header bg-light">
                        <strong>Pedido #${pedido.pedido_id}</strong> - <span class="text-muted">${data} às ${hora}</span>
                    </div>
                    <div class="card-body">
                        <div class="row g-3">
                            ${itensHTML}
                        </div>
                    </div>
                </div>
            `;
        });

        // Botões de adicionar
        document.querySelectorAll('.btn-adicionar-item').forEach(btn => {
            btn.addEventListener('click', e => {
                const item = JSON.parse(e.currentTarget.dataset.item);
                adicionarAoCarrinho(item);
                alert(`'${item.nome || item.titulo}' foi adicionado ao carrinho!`);
            });
        });
    };

    carregarHistorico();
});
