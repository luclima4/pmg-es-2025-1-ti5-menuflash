// Arquivo: carrinho/js/script.js
// Versão final com o cálculo de preço e finalização corrigidos.

document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS DO DOM ---
    const itensContainer = document.getElementById('itens-carrinho-container');
    const carrinhoVazioEl = document.getElementById('carrinho-vazio');
    const subtotalEl = document.getElementById('subtotal-carrinho');
    const totalEl = document.getElementById('total-carrinho');
    const observacaoEl = document.getElementById('observacao');
    const btnFinalizar = document.getElementById('btn-finalizar-pedido');
    const btnLimpar = document.getElementById('btn-limpar-carrinho');
    const btnContinuarComprando = document.querySelector('a[href*="../principal/"]');

    // --- FUNÇÕES DE LÓGICA ---
    const getUsuarioLogado = () => {
        try {
            const usuario = sessionStorage.getItem('usuarioLogado');
            return usuario ? JSON.parse(usuario) : null;
        } catch (e) { return null; }
    };

    const getCarrinhoUsuario = async () => {
        const usuario = getUsuarioLogado();
        if (!usuario) return null;
        try {
            const response = await fetch(`http://localhost:3000/carrinhos?userId=${usuario.id}`);
            const carrinhos = await response.json();
            return carrinhos[0];
        } catch (error) { return null; }
    };

    const atualizarCarrinhoServidor = async (carrinho) => {
        if (!carrinho) return;
        try {
            await fetch(`http://localhost:3000/carrinhos/${carrinho.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(carrinho)
            });
            window.dispatchEvent(new Event('cartUpdated'));
        } catch (error) { console.error("Erro ao atualizar carrinho:", error); }
    };

    const formatarMoeda = (valor) => Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    
    // --- FUNÇÕES DE RENDERIZAÇÃO E AÇÃO ---
    const renderizarCarrinho = (carrinho) => {
        if (!itensContainer || !carrinhoVazioEl) return;

        if (!carrinho || !carrinho.itens || carrinho.itens.length === 0) {
            carrinhoVazioEl.style.display = 'block';
            itensContainer.innerHTML = '';
            if (subtotalEl) subtotalEl.textContent = formatarMoeda(0);
            if (totalEl) totalEl.textContent = formatarMoeda(0);
            if (btnFinalizar) btnFinalizar.disabled = true;
            return;
        }
        
        carrinhoVazioEl.style.display = 'none';
        if (btnFinalizar) btnFinalizar.disabled = false;

        itensContainer.innerHTML = carrinho.itens.map(item => {
            // CORREÇÃO: Usa 'preco_unitario' (padrão novo) ou 'valor' (padrão antigo)
            const precoUnitario = Number(item.preco_unitario || item.valor);
            const subtotalItem = precoUnitario * item.quantidade;
            const caminhoCorretoImagem = (item.imagem && item.imagem.startsWith('../')) ? item.imagem : `../principal/${item.imagem || ''}`;
            
            return `
                <div class="item-carrinho d-flex justify-content-between align-items-center p-3 border-bottom">
                    <div class="d-flex align-items-center">
                        <img src="${caminhoCorretoImagem}" alt="${item.nome}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                        <div class="ms-3">
                            <h6 class="mb-1">${item.nome}</h6>
                            <small class="text-muted">${item.nomeLanchonete}</small>
                        </div>
                    </div>
                    <div class="d-flex align-items-center">
                        <input type="number" class="form-control form-control-sm quantidade-input" value="${item.quantidade}" min="1" data-id="${item.id}" style="width: 60px;">
                        <span class="fw-bold mx-3" style="min-width: 80px; text-align: right;">${formatarMoeda(subtotalItem)}</span>
                        <button class="btn btn-sm btn-outline-danger btn-remover" data-id="${item.id}" title="Remover item"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            `;
        }).join('');

        const subtotal = carrinho.itens.reduce((acc, item) => {
            // CORREÇÃO: Usa 'preco_unitario' ou 'valor' para o cálculo total
            const precoUnitario = Number(item.preco_unitario || item.valor);
            return acc + (precoUnitario * item.quantidade);
        }, 0);

        if (subtotalEl) subtotalEl.textContent = formatarMoeda(subtotal);
        if (totalEl) totalEl.textContent = formatarMoeda(subtotal);
    };

    const atualizarItem = async (itemId, novaQuantidade) => { /* ... (código existente) ... */ };
    const removerItem = async (itemId) => { /* ... (código existente) ... */ };
    const limparCarrinho = async () => { /* ... (código existente) ... */ };

    // --- INICIALIZAÇÃO E EVENTOS ---
    const init = async () => {
        const usuario = getUsuarioLogado();
        if (!usuario) {
            document.body.innerHTML = `<div class="alert alert-danger text-center m-5">Você precisa estar logado para acessar o carrinho.</div>`;
            return;
        }
        
        if (btnContinuarComprando) {
            const lanchoneteAnteriorId = sessionStorage.getItem("lanchoneteAnterior");
            if (lanchoneteAnteriorId) {
                btnContinuarComprando.href = `../principal/criaCards.html?id=${lanchoneteAnteriorId}`;
            } else {
                btnContinuarComprando.href = `../principal/index.html`;
            }
        }
        
        const carrinho = await getCarrinhoUsuario();
        renderizarCarrinho(carrinho);
    };

    itensContainer.addEventListener('change', e => { /* ... (código existente) ... */ });
    itensContainer.addEventListener('click', e => { /* ... (código existente) ... */ });
    if (btnLimpar) btnLimpar.addEventListener('click', limparCarrinho);
    
    if (btnFinalizar) {
        btnFinalizar.addEventListener('click', async () => {
            const usuarioLogado = getUsuarioLogado();
            if (!usuarioLogado) {
                alert('Sua sessão expirou. Por favor, faça login novamente.');
                return window.location.href = '../cadastro_login/login.html';
            }
            
            const carrinho = await getCarrinhoUsuario();
            if (!carrinho || carrinho.itens.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }
            
            const pedidoPendente = {
                itens: carrinho.itens,
                observacao: observacaoEl.value || "",
                userId: usuarioLogado.id
            };
            
            localStorage.setItem('pedidoPendente', JSON.stringify(pedidoPendente));
            window.location.href = '../forma-pagamento/index.html';
        });
    }

    init();
});