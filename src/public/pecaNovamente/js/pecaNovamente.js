// Arquivo: pecaNovamente/js/pecaNovamente.js
// Versão com correção nos caminhos das imagens.

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('historico-container');
    if (!container) return;

    // --- FUNÇÕES DE LÓGICA (Carrinho, Autenticação, etc.) ---

    const getUsuarioLogado = () => {
        try {
            const usuario = sessionStorage.getItem('usuarioLogado');
            return usuario ? JSON.parse(usuario) : null;
        } catch (e) { return null; }
    };

    const normalizarCaminhoImagem = (caminhoOriginal) => {
        if (!caminhoOriginal) return '';
        // Remove um possível prefixo antigo para evitar duplicação
        const caminhoLimpo = caminhoOriginal.replace('../principal/', '');
        // Retorna o caminho correto relativo à pasta pecaNovamente/
        return `../principal/${caminhoLimpo}`;
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

    const criarOuAtualizarCarrinho = async (carrinhoData) => {
        if (!carrinhoData) return;
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
        } catch (error) { console.error("Erro ao salvar carrinho:", error); }
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
                nome: item.titulo || item.nome,
                imagem: item.imagem,
                valor: item.valor || item.preco_unitario,
                nomeLanchonete: item.nomeLanchonete || 'Lanchonete',
                quantidade: 1
            });
        }
        await criarOuAtualizarCarrinho(carrinho);
    };

    // --- LÓGICA PRINCIPAL DA PÁGINA ---
    const carregarHistorico = async () => {
        const usuario = getUsuarioLogado();
        if (!usuario) {
            container.innerHTML = `<div class="alert alert-warning text-center">Você precisa estar logado para ver seu histórico.</div>`;
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/usuarios/${usuario.id}`);
            const usuarioCompleto = await response.json();
            const historico = usuarioCompleto.historico_de_pedidos || [];

            if (historico.length === 0) {
                container.innerHTML = `<div class="alert alert-info text-center">Seu histórico de pedidos está vazio.</div>`;
                return;
            }

            container.innerHTML = ''; // Limpa a mensagem "Carregando..."
            historico.reverse().forEach(pedido => {
                const dataPedido = new Date(pedido.data).toLocaleDateString('pt-BR');
                let itensHTML = '';
                
                pedido.itens.forEach(item => {
                    // Usa a função para corrigir o caminho da imagem
                    const caminhoCorretoImagem = normalizarCaminhoImagem(item.imagem);
                    
                    itensHTML += `
                        <div class="col">
                            <div class="card h-100 shadow-sm">
                                <img src="${caminhoCorretoImagem}" class="card-img-top" style="height: 150px; object-fit: cover;" alt="${item.titulo || item.nome}">
                                <div class="card-body text-center d-flex flex-column">
                                    <h6 class="card-title">${item.titulo || item.nome}</h6>
                                    <p class="card-text fw-bold mt-auto">R$ ${Number(item.preco_unitario || item.valor).toFixed(2).replace('.', ',')}</p>
                                    <div class="input-group justify-content-center mt-2">
                                        <button class="btn btn-sm btn-primary btn-adicionar-item" data-item='${JSON.stringify(item)}'>
                                            <i class="fas fa-cart-plus me-2"></i> Adicionar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                });

                const pedidoHTML = `
                    <div class="pedido-historico card mb-4">
                        <div class="card-header bg-light">
                            <strong>Pedido #${pedido.pedido_id}</strong> - <span class="text-muted">${dataPedido} às ${pedido.hora}</span>
                        </div>
                        <div class="card-body">
                            <div class="row row-cols-2 row-cols-md-4 g-3">
                                ${itensHTML}
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += pedidoHTML;
            });

            // Adiciona funcionalidade aos novos botões
            document.querySelectorAll('.btn-adicionar-item').forEach(button => {
                button.addEventListener('click', (e) => {
                    const itemData = JSON.parse(e.currentTarget.dataset.item);
                    adicionarAoCarrinho(itemData);
                    alert(`'${itemData.titulo || itemData.nome}' foi adicionado ao seu carrinho!`);
                });
            });

        } catch (error) {
            console.error("Erro ao carregar histórico:", error);
            container.innerHTML = `<div class="alert alert-danger text-center">Ocorreu um erro ao carregar seu histórico.</div>`;
        }
    };

    carregarHistorico();
});