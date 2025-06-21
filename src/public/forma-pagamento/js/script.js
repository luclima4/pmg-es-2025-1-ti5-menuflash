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

    const finalizarPedido = () => {
        if (!metodoPagamentoSelecionado) {
            alert('Por favor, selecione um método de pagamento.');
            return;
        }

        // Remove a lógica de comunicação com o servidor e apenas redireciona
        localStorage.removeItem('carrinho');
        localStorage.removeItem('pedidoPendente');
        window.dispatchEvent(new Event('storageChanged'));

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
    if(pedidoPendente) {
        renderizarResumo();
    }
}); 