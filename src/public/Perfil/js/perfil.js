document.addEventListener("DOMContentLoaded", () => {
    // Pega o usuário logado do sessionStorage. Ponto de partida para tudo.
    const usuarioJSON = sessionStorage.getItem("usuarioLogado");
    if (!usuarioJSON) {
        // Redireciona para login se não houver usuário.
        window.location.href = "login.html";
        return;
    }
    const usuarioLogado = JSON.parse(usuarioJSON);

    /**
     * Corrige o caminho da imagem para funcionar a partir da pasta /Perfil.
     * @param {string} caminhoOriginal - O caminho como está no db.json (ex: "img/itens/agua.png").
     * @returns {string} O caminho corrigido (ex: "../principal/img/itens/agua.png").
     */
    const normalizarCaminhoImagem = (caminhoOriginal) => {
        if (!caminhoOriginal) return ''; // Retorna string vazia se o caminho for nulo
        // Remove prefixos antigos para evitar duplicação, como '../principal/'
        const caminhoLimpo = caminhoOriginal.replace('../principal/', '');
        // Retorna o caminho correto relativo à página de perfil
        return `../principal/${caminhoLimpo}`;
    };

    /**
     * Carrega e exibe o histórico de pedidos do usuário.
     */
    const carregarHistorico = (usuarioLogado, todosOsUsuarios, todasAsLanchonetes) => {
        const container = document.getElementById('insereHistorico');
        if (!container) return; // Se o container não existir, para a função.

        const usuarioCompleto = todosOsUsuarios.find(u => String(u.id) === String(usuarioLogado.id));
        const historico = usuarioCompleto?.historico_de_pedidos || [];

        if (!Array.isArray(historico) || historico.length === 0) {
            container.innerHTML = `<p>Seu histórico de pedidos está vazio.</p>`;
            return;
        }

        const pedidos = historico.sort((a, b) => new Date(`${b.data}T${b.hora}`) - new Date(`${a.data}T${a.hora}`));
        
        let html = '';
        pedidos.forEach(pedido => {
            const lanchonete = todasAsLanchonetes.find(l => String(l.id) === String(pedido.lanchonete_id));
            const dataFormatada = new Date(pedido.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
            
            const itensHTML = pedido.itens.map(item => `
                <li class="list-group-item item-responsivo d-flex justify-content-between align-items-center px-0 py-2">
                    <div class="d-flex align-items-center">
                        <img src="${normalizarCaminhoImagem(item.imagem)}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;" alt="${item.nome}">
                        <span class="mx-2 flex-grow-1">${item.quantidade}x ${item.titulo}</span>
                    </div>
                    <span class="font-weight-bold item-valor">R$ ${Number(item.subtotal).toFixed(2).replace('.', ',')}</span>
                </li>
            `).join('');

            html += `
                <div class="card mb-3">
                    <div class="card-header bg-light d-flex justify-content-between flex-wrap">
                        <strong class="me-3">Pedido #${pedido.pedido_id}</strong>
                        <span class="text-muted">${dataFormatada}</span>
                    </div>
                    <div class="card-body">
                        <p class="card-text mb-1"><strong>Lanchonete:</strong> ${lanchonete ? lanchonete.nome : 'Desconhecida'}</p>
                        <p class="card-text mb-2"><strong>Total:</strong> R$ ${Number(pedido.total).toFixed(2).replace('.', ',')}</p>
                        <h6 class="mb-2">Itens:</h6>
                        <ul class="list-group list-group-flush">${itensHTML}</ul>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    };

    /**
     * Carrega e exibe os itens favoritados pelo usuário com layout aprimorado.
     */
    const carregarFavoritos = (usuarioLogado, todasAsLanchonetes) => {
        const container = document.getElementById("containerFavoritos");
        if (!container) return; // Se o container não existir, para a função.

        const meusFavoritos = [];
        todasAsLanchonetes.forEach(lanchonete => {
            lanchonete.itens.forEach(item => {
                if (Array.isArray(item.favoritos) && item.favoritos.includes(usuarioLogado.email)) {
                    meusFavoritos.push({ ...item, lanchoneteId: lanchonete.id, nomeLanchonete: lanchonete.nome });
                }
            });
        });

        if (meusFavoritos.length === 0) {
            container.innerHTML = '<p>Você ainda não favoritou nenhum item.</p>';
            return;
        }
        
        container.innerHTML = `
            <h5 class="mb-4">Seus Itens Favoritos</h5>
            <ul class="list-group">
                ${meusFavoritos.map(item => `
                    <li class="list-group-item item-responsivo d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <img src="${normalizarCaminhoImagem(item.imagem)}" alt="${item.titulo}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                            <div class="flex-grow-1 mx-3">
                                <strong>${item.titulo}</strong><br>
                                <small class="text-muted">${item.nomeLanchonete}</small>
                            </div>
                        </div>
                        <div class="d-flex align-items-center mt-2 mt-sm-0">
                             <div class="font-weight-bold mx-4 item-valor" style="min-width: 80px; text-align: right;">
                                R$ ${Number(item.valor).toFixed(2).replace('.', ',')}
                            </div>
                            <button class="btn btn-sm btn-danger btn-desfavoritar" 
                                    data-item-id="${item.id}" 
                                    data-lanchonete-id="${item.lanchoneteId}"
                                    data-item-titulo="${item.titulo}"
                                    title="Remover dos favoritos">
                                <i class="fas fa-heart"></i> <span class="d-none d-md-inline">Remover</span>
                            </button>
                        </div>
                    </li>
                `).join('')}
            </ul>
        `;

        document.querySelectorAll('.btn-desfavoritar').forEach(button => {
            button.addEventListener('click', (e) => {
                const { itemId, lanchoneteId, itemTitulo } = e.currentTarget.dataset;
                if (confirm(`Tem certeza que deseja remover "${itemTitulo}" dos seus favoritos?`)) {
                    toggleFavorito(itemId, lanchoneteId, usuarioLogado);
                }
            });
        });
    };
    
    /**
     * Função para desfavoritar um item, que atualiza o db.json.
     */
    const toggleFavorito = async (itemId, lanchoneteId, usuarioLogado) => {
        try {
            const response = await fetch(`http://localhost:3000/lanchonetes/${lanchoneteId}`);
            if (!response.ok) throw new Error("Lanchonete não encontrada");
            const lanchonete = await response.json();
            const itemParaModificar = lanchonete.itens.find(i => i.id == itemId);

            if (itemParaModificar && Array.isArray(itemParaModificar.favoritos)) {
                const emailIndex = itemParaModificar.favoritos.indexOf(usuarioLogado.email);
                if (emailIndex > -1) {
                    itemParaModificar.favoritos.splice(emailIndex, 1);
                }
            }

            await fetch(`http://localhost:3000/lanchonetes/${lanchoneteId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(lanchonete)
            });
            
            // Recarrega os dados da página para refletir a remoção
            inicializarPagina(usuarioLogado);

        } catch (error) {
            console.error("Erro ao desfavoritar:", error);
            alert("Não foi possível remover o item dos favoritos.");
        }
    };

    /**
     * Função principal de inicialização que busca os dados uma única vez.
     */
    const inicializarPagina = async (usuarioLogado) => {
        try {
            const [usuariosRes, lanchonetesRes] = await Promise.all([
                fetch('http://localhost:3000/usuarios'),
                fetch('http://localhost:3000/lanchonetes')
            ]);

            if (!usuariosRes.ok || !lanchonetesRes.ok) {
                throw new Error("Falha ao buscar dados essenciais do servidor.");
            }

            const usuarios = await usuariosRes.json();
            const lanchonetes = await lanchonetesRes.json();
            
            // Agora, chama as funções para popular cada parte da página
            carregarHistorico(usuarioLogado, usuarios, lanchonetes);
            carregarFavoritos(usuarioLogado, lanchonetes);

        } catch (error) {
            console.error("Erro ao inicializar a página de perfil:", error);
            document.body.innerHTML = `<p class="text-center text-danger p-5">Erro ao carregar a página. Verifique a conexão com o servidor e tente novamente.</p>`;
        }
    };
    
    // Adiciona o link do FontAwesome para garantir que os ícones funcionem
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);
    
    // Inicia todo o processo de carregamento da página.
    inicializarPagina(usuarioLogado);
});