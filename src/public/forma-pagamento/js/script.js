document.addEventListener('DOMContentLoaded', () => {

    // --- ELEMENTOS DO DOM ---
    const pixSectionEl = document.getElementById('pix-section');
    const cardSectionEl = document.getElementById('card-section');

    const btnFinalizeOrder = document.getElementById('btn-finalize-order');

    const radioPix = document.getElementById('payment-pix');
    const radioCard = document.getElementById('payment-card');

    const orderSummaryEl = document.getElementById('order-summary');

    // --- CONFIGURAÇÃO E ESTADO ---
    const jsonServerUrl = 'http://localhost:3000';
    let pedidoPendente = null;
    let metodoPagamentoSelecionado = null;

    // --- FUNÇÕES ---
    const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const carregarPedido = () => {
        const pedidoStr = localStorage.getItem('pedidoPendente');
        if (!pedidoStr) {
            alert("Nenhum pedido encontrado. Você será redirecionado.");
            window.location.href = '../principal/index.html';
            return;
        }
        pedidoPendente = JSON.parse(pedidoStr);
    };

    const renderizarResumo = () => {
        const total = pedidoPendente.itens.reduce((acc, item) => {
            const preco = parseFloat(item.valor.replace('R$', '').replace(',', '.'));
            return acc + (preco * item.quantidade);
        }, 0);

        orderSummaryEl.innerHTML = `
            <h5 class="mb-3">Resumo do seu Pedido</h5>
            <ul class="list-group list-group-flush">
                ${pedidoPendente.itens.map(item => `
                    <li class="list-group-item d-flex justify-content-between align-items-center">
                        ${item.nome}
                        <span class="badge bg-primary rounded-pill">${item.quantidade}x</span>
                    </li>
                `).join('')}
            </ul>
            <div class="d-flex justify-content-between align-items-center mt-3 fw-bold h5">
                <span>Total a Pagar:</span>
                <span>${formatarMoeda(total)}</span>
            </div>
        `;
    };

    const finalizarPedido = async () => {
        if (!metodoPagamentoSelecionado) {
            alert('Por favor, selecione um método de pagamento.');
            return;
        }

        // Busca o carrinho do usuário
        let carrinho = null;
        try {
            const response = await fetch(`${jsonServerUrl}/carrinhos?userId=1`);
            const carrinhos = await response.json();
            carrinho = carrinhos[0];
        } catch (error) {
            console.error('Erro ao buscar carrinho:', error);
        }
        if (!carrinho || !carrinho.itens || carrinho.itens.length === 0) {
            alert('Carrinho vazio!');
            return;
        }

        // Monta o pedido
        const pedidoPendente = {
            id: `pedido_${new Date().getTime()}`,
            itens: carrinho.itens,
            data: new Date().toISOString(),
            status: 'pendente',
            metodoPagamento: metodoPagamentoSelecionado
        };

        // Salva o pedido no db.json
        try {
            await fetch(`${jsonServerUrl}/pedidos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pedidoPendente)
            });
        } catch (error) {
            console.error('Erro ao salvar pedido:', error);
        }

        // Limpa o carrinho do usuário
        try {
            await fetch(`${jsonServerUrl}/carrinhos/${carrinho.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...carrinho, itens: [] })
            });
        } catch (error) {
            console.error('Erro ao limpar carrinho:', error);
        }

        // Limpa localStorage
        localStorage.removeItem('carrinho');
        localStorage.removeItem('pedidoPendente');
        window.dispatchEvent(new Event('storageChanged'));

        // Redireciona para a página de acompanhamento
        window.location.href = '../acompanhar-pedido/acompanhar-pedido.html';
    };

    // --- EVENT LISTENERS ---
    radioPix.addEventListener('change', () => {
        metodoPagamentoSelecionado = 'Pix';
        cardSectionEl.style.display = 'none';
        pixSectionEl.style.display = 'block';
        btnFinalizeOrder.disabled = false;
    });

    radioCard.addEventListener('change', () => {
        metodoPagamentoSelecionado = 'Cartão';
        pixSectionEl.style.display = 'none';
        cardSectionEl.style.display = 'block';
        btnFinalizeOrder.disabled = false;
    });

    btnFinalizeOrder.addEventListener('click', finalizarPedido);

    // --- INICIALIZAÇÃO ---
    carregarPedido();
    if (pedidoPendente) {
        renderizarResumo();
    }
}); 