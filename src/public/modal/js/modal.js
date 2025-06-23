// Arquivo: public/modal/js/modal.js
// Versão final com lógica autônoma e correções.

document.addEventListener("DOMContentLoaded", function () {

    // --- FUNÇÕES DE LÓGICA (CARRINHO E AUTENTICAÇÃO) ---
    const getUsuarioLogado = () => {
        try {
            const usuario = sessionStorage.getItem('usuarioLogado');
            return usuario ? JSON.parse(usuario) : null;
        } catch (e) {
            return null;
        }
    };

    const getCarrinhoUsuario = async () => {
        const usuario = getUsuarioLogado();
        if (!usuario) return null;
        try {
            const response = await fetch(`http://localhost:3000/carrinhos?userId=${usuario.id}`);
            return (await response.json())[0];
        } catch (error) {
            return null;
        }
    };

    const criarOuAtualizarCarrinho = async (carrinhoData) => {
        if (!carrinhoData) return;
        let carrinhoExistente = null;
        try {
            const res = await fetch(`http://localhost:3000/carrinhos?userId=${carrinhoData.userId}`);
            carrinhoExistente = (await res.json())[0];
        } catch (e) {}
        const url = `http://localhost:3000/carrinhos${carrinhoExistente ? `/${carrinhoExistente.id}` : ''}`;
        const method = carrinhoExistente ? 'PUT' : 'POST';
        try {
            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carrinhoData)
            });
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (e) {}
    };

    const adicionarAoCarrinhoModal = async (item) => {
        const usuario = getUsuarioLogado();
        if (!usuario) return alert("Você precisa estar logado.");
        if (usuario.tipo === 'administrador') return alert("Administradores não podem adicionar itens ao carrinho.");
        
        let carrinho = await getCarrinhoUsuario() || { userId: usuario.id, itens: [] };
        const itemExistente = carrinho.itens.find(it => it.id === item.id);
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
        if (typeof mostrarFeedbackAdicionado === 'function') mostrarFeedbackAdicionado(item.titulo);
    };

    const removerUnidadeDoCarrinhoModal = async (item) => {
        const usuario = getUsuarioLogado();
        if (!usuario) return;
        if (usuario.tipo === 'administrador') return alert("Administradores não podem modificar o carrinho.");
        
        let carrinho = await getCarrinhoUsuario();
        if (!carrinho || !carrinho.itens.length) return;

        const itemIndex = carrinho.itens.findIndex(it => it.id === item.id);
        if (itemIndex > -1) {
            carrinho.itens[itemIndex].quantidade--;
            if (carrinho.itens[itemIndex].quantidade <= 0) {
                carrinho.itens.splice(itemIndex, 1);
            }
            await criarOuAtualizarCarrinho(carrinho);
            if (typeof mostrarFeedbackRemovido === 'function') mostrarFeedbackRemovido(item.titulo);
        }
    };

    // --- LÓGICA DE EXIBIÇÃO DO MODAL ---
    const mostraDetalhes = async (id) => {
        try {
            const response = await fetch('http://localhost:3000/lanchonetes');
            const lanchonetes = await response.json();
            
            let item;
            for (const lanchonete of lanchonetes) {
                const foundItem = lanchonete.itens.find(it => it.id == id);
                if (foundItem) {
                    item = { ...foundItem, nomeLanchonete: lanchonete.nome, lanchoneteId: lanchonete.id };
                    break;
                }
            }
            if (!item) return;

            const carrinho = await getCarrinhoUsuario();
            const itemNoCarrinho = carrinho ? carrinho.itens.find(it => it.id == item.id) : null;
            const qtd = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;
            const imagemCorrigida = item.imagem.replace('../principal/', '');

            const badges = [];
            if (item.semLactose) badges.push(`<span class="badge bg-success">Sem Lactose</span>`);
            if (item.semGluten) badges.push(`<span class="badge bg-success">Sem Glúten</span>`);
            
            const modalContentHTML = `
                <div class="modal-header">
                    <h5 class="modal-title">${item.titulo}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="${imagemCorrigida}" class="img-fluid mb-3 rounded" style="max-height:250px; object-fit:contain;" alt="${item.titulo}">
                    <p>${item.descricao}</p>
                    <p class="text-muted">${item.conteudo || ''}</p>
                    <div class="d-flex gap-2 justify-content-center">${badges.join(' ')}</div>
                </div>
                <div class="modal-footer d-flex justify-content-between align-items-center">
                    <h5 class="fw-bold mb-0">R$ ${Number(item.valor).toFixed(2).replace('.', ',')}</h5>
                    <div class="input-group" style="max-width: 150px;">
                        <button class="btn btn-outline-danger" type="button" id="modal-btn-menos">−</button>
                        <input type="text" class="form-control text-center fw-bold" id="modal-label-qtd" value="${qtd}" readonly>
                        <button class="btn btn-outline-success" type="button" id="modal-btn-mais">+</button>
                    </div>
                </div>`;
            document.getElementById("modalContent").innerHTML = modalContentHTML;

            const btnMais = document.getElementById('modal-btn-mais');
            const btnMenos = document.getElementById('modal-btn-menos');
            
            const atualizaQtdModalESincroniza = async () => {
                const carrinhoAtualizado = await getCarrinhoUsuario();
                const itemAtualizado = carrinhoAtualizado ? carrinhoAtualizado.itens.find(it => it.id == item.id) : null;
                const novaQtd = itemAtualizado ? itemAtualizado.quantidade : 0;
                
                const labelQtdModal = document.getElementById('modal-label-qtd');
                if(labelQtdModal) labelQtdModal.value = novaQtd;

                const inputPrincipal = document.querySelector(`.quantity-input[data-item-id='${item.id}']`);
                if (inputPrincipal) inputPrincipal.value = novaQtd;
            };

            btnMais.addEventListener('click', async () => {
                await adicionarAoCarrinhoModal(item);
                await atualizaQtdModalESincroniza();
            });

            btnMenos.addEventListener('click', async () => {
                await removerUnidadeDoCarrinhoModal(item);
                await atualizaQtdModalESincroniza();
            });

        } catch (e) {}
    };

    // Listener global que ativa o modal
    document.addEventListener("click", function (event) {
        const link = event.target.closest("a[data-id]");
        if (link) {
            if (event.target.closest('.btn-aumentar-qnt, .btn-diminuir-qnt, .btn-favoritar')) return;
            const id = link.getAttribute("data-id");
            mostraDetalhes(id);
        }
    });
});