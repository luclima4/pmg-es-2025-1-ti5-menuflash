  document.addEventListener("DOMContentLoaded", function () {

    // --- FUNÇÕES DE LÓGICA (CÓPIA DAS FUNÇÕES DO criaCards.js) ---
    // Colocamos as funções necessárias aqui para que este script seja autônomo.

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
        const currentUserId = usuario ? usuario.id : null;
        if (!currentUserId) return null;

        try {
            const response = await fetch(`http://localhost:3000/carrinhos?userId=${currentUserId}`);
            return (await response.json())[0];
        } catch (error) {
            console.error("Erro ao buscar carrinho:", error);
            return null;
        }
    };

    const criarOuAtualizarCarrinho = async (carrinhoData) => {
        const carrinhoExistente = await getCarrinhoUsuario();
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

    const adicionarAoCarrinhoModal = async (item) => {
        const usuario = getUsuarioLogado();
        if (!usuario) return alert("Você precisa estar logado.");

        let carrinho = await getCarrinhoUsuario() || { userId: usuario.id, itens: [] };
        const itemExistente = carrinho.itens.find(i => i.id === item.id);
        
        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            carrinho.itens.push({
                id: item.id,
                nome: item.titulo,
                imagem: item.imagem,
                valor: item.valor,
                nomeLanchonete: item.nomeLanchonete,
                quantidade: 1
            });
        }
        await criarOuAtualizarCarrinho(carrinho);
        mostrarFeedbackAdicionado(item.titulo); // Chama o alerta
    };

    const removerUnidadeDoCarrinhoModal = async (item) => {
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
            mostrarFeedbackRemovido(item.titulo); // Chama o alerta
        }
    };

    const mostrarFeedbackAdicionado = (nomeItem) => {
        document.querySelectorAll('.feedback-toast').forEach(t => t.remove());
        const toast = document.createElement('div');
        toast.className = 'feedback-toast';
        toast.style.cssText = `position: fixed; top: 20px; right: 20px; background-color: #198754; color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; z-index: 1050; animation: slideIn 0.3s ease-out;`;
        toast.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> <strong>${nomeItem}</strong> foi adicionado ao carrinho!`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    };

    const mostrarFeedbackRemovido = (nomeItem) => {
        document.querySelectorAll('.feedback-toast').forEach(t => t.remove());
        const toast = document.createElement('div');
        toast.className = 'feedback-toast';
        toast.style.cssText = `position: fixed; top: 20px; right: 20px; background-color: #0d6efd; color: white; padding: 1rem 1.5rem; border-radius: 0.5rem; z-index: 1050; animation: slideIn 0.3s ease-out;`;
        toast.innerHTML = `<i class="bi bi-info-circle-fill me-2"></i> <strong>${nomeItem}</strong> foi atualizado no carrinho.`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    };


    // --- LÓGICA DE EXIBIÇÃO DO MODAL ---
    const mostraDetalhes = async (id) => {
        try {
            const response = await fetch('http://localhost:3000/lanchonetes');
            const lanchonetes = await response.json();
            
            let item;
            for (const l of lanchonetes) {
                const foundItem = l.itens.find(i => i.id == id);
                if (foundItem) {
                    item = { ...foundItem, nomeLanchonete: l.nome, lanchoneteId: l.id };
                    break;
                }
            }
            if (!item) return;

            // ESTA FUNÇÃO AGORA EXISTE DENTRO DESTE ARQUIVO, CORRIGINDO O ERRO
            const carrinho = await getCarrinhoUsuario();
            const itemNoCarrinho = carrinho ? carrinho.itens.find(i => i.id == item.id) : null;
            const qtd = itemNoCarrinho ? itemNoCarrinho.quantidade : 0;

            const badges = [];
            if (item.semLactose) badges.push(`<span class="badge bg-success">Sem Lactose</span>`);
            if (item.semGluten) badges.push(`<span class="badge bg-success">Sem Glúten</span>`);
            
            const modalContentHTML = `
                <div class="modal-header">
                    <h5 class="modal-title">${item.titulo}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body text-center">
                    <img src="${item.imagem}" class="img-fluid mb-3" style="max-height:200px; object-fit:contain;" alt="${item.titulo}">
                    <p>${item.descricao}</p>
                    <p class="text-muted">${item.conteudo || ''}</p>
                    ${badges.join(' ')}
                </div>
                <div class="modal-footer d-flex justify-content-between align-items-center">
                    <h5 class="fw-bold mb-0">R$ ${typeof item.valor === 'number' ? item.valor.toFixed(2).replace('.', ',') : 'N/A'}</h5>
                    <div class="input-group" style="max-width: 140px;">
                        <button class="btn btn-outline-danger" type="button" id="modal-btn-menos">−</button>
                        <input type="text" class="form-control text-center" id="modal-label-qtd" value="${qtd}" readonly style="user-select: none; background-color: #fff;">
                        <button class="btn btn-outline-success" type="button" id="modal-btn-mais">+</button>
                    </div>
                </div>
            `;
            document.getElementById("modalContent").innerHTML = modalContentHTML;

            const btnMais = document.getElementById('modal-btn-mais');
            const btnMenos = document.getElementById('modal-btn-menos');
            
            const atualizaQtdModalESincroniza = async () => {
                const carrinhoAtualizado = await getCarrinhoUsuario();
                const itemAtualizado = carrinhoAtualizado ? carrinhoAtualizado.itens.find(i => i.id == item.id) : null;
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

        } catch (error) {
            console.error("Erro ao mostrar detalhes:", error);
        }
    }

    // Listener global que ativa o modal
    document.addEventListener("click", function (event) {
        const link = event.target.closest("a[data-id]");
        if (link) {
            if (event.target.closest('.btn-aumentar-qnt') || event.target.closest('.btn-diminuir-qnt') || event.target.closest('.btn-favoritar')) {
                return;
            }
            const id = link.getAttribute("data-id");
            mostraDetalhes(id);
        }
    });
});