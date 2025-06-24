// Arquivo: forma-pagamento/js/script.js
// Versão final com limpeza de carrinho e cálculo corrigido.

document.addEventListener('DOMContentLoaded', () => {
    const pixSectionEl = document.getElementById('pix-section');
    const cardSectionEl = document.getElementById('card-section');
    const btnFinalizeOrder = document.getElementById('btn-finalize-order');
    const radioPix = document.getElementById('payment-pix');
    const radioCard = document.getElementById('payment-card');
    const orderSummaryEl = document.getElementById('order-summary');
    let pedidoPendente = null;
    let metodoPagamentoSelecionado = null;
    
    const getUsuarioLogado = () => { try { const u = sessionStorage.getItem('usuarioLogado'); return u ? JSON.parse(u) : null; } catch (e) { return null; } };
    const getCarrinhoUsuario = async () => { const u = getUsuarioLogado(); if (!u) return null; try { const r = await fetch(`http://localhost:3000/carrinhos?userId=${u.id}`); return (await r.json())[0]; } catch (e) { return null; } };
    const atualizarCarrinhoServidor = async (c) => { if (!c) return; try { await fetch(`http://localhost:3000/carrinhos/${c.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(c) }); window.dispatchEvent(new Event('cartUpdated')); } catch (e) {} };
    const formatarMoeda = (v) => Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const carregarPedido = () => {
        const pedidoStr = localStorage.getItem('pedidoPendente');
        if (!pedidoStr) {
            alert("Nenhum pedido em andamento encontrado.");
            window.location.href = '../principal/index.html';
            return false;
        }
        pedidoPendente = JSON.parse(pedidoStr);
        return true;
    };

    const renderizarResumo = () => {
        if (!pedidoPendente || !pedidoPendente.itens) return;
        const total = pedidoPendente.itens.reduce((acc, item) => {
            const preco = Number(item.preco_unitario || item.valor);
            return acc + (preco * item.quantidade);
        }, 0);
        pedidoPendente.total = total;
        orderSummaryEl.innerHTML = `<h5 class="mb-3">Resumo do seu Pedido</h5><ul class="list-group list-group-flush">${pedidoPendente.itens.map(item => `<li class="list-group-item d-flex justify-content-between align-items-center px-0"><span>${item.quantidade}x ${item.nome}</span><span class="text-muted">${formatarMoeda(Number(item.preco_unitario||item.valor)*item.quantidade)}</span></li>`).join('')}</ul><hr><div class="d-flex justify-content-between align-items-center mt-3 fw-bold h5"><span>Total a Pagar:</span><span>${formatarMoeda(total)}</span></div>`;
    };

    const finalizarPedido = async () => {
        if (!metodoPagamentoSelecionado) return alert('Por favor, selecione um método de pagamento.');
        
        const usuario = getUsuarioLogado();
        if (!usuario || !usuario.id) return alert("Sessão expirada. Faça o login novamente.");
        
        const pedidoFinal = {
            id: new Date().getTime(),
            data: new Date().toISOString().split('T')[0],
            hora: new Date().toLocaleTimeString('pt-BR'),
            total: pedidoPendente.total,
            forma_pagamento: metodoPagamentoSelecionado,
            status: "Entregue",
            lanchonete_id: pedidoPendente.itens[0]?.lanchoneteId || 'N/A',
            itens: pedidoPendente.itens.map(i => ({ id: i.id, titulo: i.nome, imagem: i.imagem, quantidade: i.quantidade, preco_unitario: Number(i.preco_unitario||i.valor), subtotal: Number(i.preco_unitario||i.valor)*i.quantidade }))
        };
        
        try {
            const userResponse = await fetch(`http://localhost:3000/usuarios/${usuario.id}`);
            if (!userResponse.ok) throw new Error("Usuário não encontrado.");
            const dadosUsuario = await userResponse.json();
            if (!Array.isArray(dadosUsuario.historico_de_pedidos)) dadosUsuario.historico_de_pedidos = [];
            dadosUsuario.historico_de_pedidos.push(pedidoFinal);

            await fetch(`http://localhost:3000/usuarios/${usuario.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadosUsuario) });

            // Limpa o carrinho no servidor
            const carrinhoParaLimpar = await getCarrinhoUsuario();
            if (carrinhoParaLimpar) {
                carrinhoParaLimpar.itens = [];
                await atualizarCarrinhoServidor(carrinhoParaLimpar);
            }

            localStorage.removeItem('pedidoPendente');
            alert("Pedido finalizado com sucesso!");
            window.location.href = '../acompanhar-pedido/acompanhar-pedido.html';

        } catch (error) {
            console.error('Erro ao finalizar pedido:', error);
            alert("Ocorreu um erro ao finalizar seu pedido.");
        }
    };

    if(radioPix) radioPix.addEventListener('change', () => { metodoPagamentoSelecionado = 'Pix'; cardSectionEl.style.display = 'none'; pixSectionEl.style.display = 'block'; btnFinalizeOrder.disabled = false; });
    if(radioCard) radioCard.addEventListener('change', () => { metodoPagamentoSelecionado = 'Cartão'; pixSectionEl.style.display = 'none'; cardSectionEl.style.display = 'block'; btnFinalizeOrder.disabled = false; });
    if(btnFinalizeOrder) btnFinalizeOrder.addEventListener('click', finalizarPedido);
    if (carregarPedido()) renderizarResumo();
});