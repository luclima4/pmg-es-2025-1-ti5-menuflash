document.addEventListener("DOMContentLoaded", () => {
    console.log("criaCards.js carregado"); // Confirma carregamento do script
    console.log("Parâmetros da URL:", window.location.search);

    // --- SETUP INICIAL ---
    const params = new URLSearchParams(window.location.search);
    const idLanchonete = params.get("id");
    const campusSelecionado = params.get('campus');

    // Salva a lanchonete e o campus na sessão para referência futura
    if (idLanchonete) {
        fetch("http://localhost:3000/lanchonetes")
            .then(res => res.json())
            .then(lanchonetes => {
                const lanchonete = lanchonetes.find(l => l.id == idLanchonete);
                if (lanchonete) {
                    sessionStorage.setItem("campusAnterior", lanchonete.campus);
                    sessionStorage.setItem("lanchoneteAnterior", lanchonete.id);
                }
            });
    }

    // --- ELEMENTOS DO DOM ---
    const cardsContainer = document.getElementById('divCards');
    const campoBusca = document.getElementById('campoBusca');
    const btnBusca = document.getElementById('btnBusca');

    // --- ESTADO ---
    let todosOsItens = [];

    // --- LÓGICA DO CARRINHO ---
    const adicionarAoCarrinho = (item) => {
        let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
        const itemExistente = carrinho.find(i => i.id === item.id);

        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            const itemParaCarrinho = {
                id: item.id,
                nome: item.titulo,
                imagem: item.imagem,
                valor: item.valor,
                nomeLanchonete: item.nomeLanchonete,
                quantidade: 1
            };
            carrinho.push(itemParaCarrinho);
        }

        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        window.dispatchEvent(new Event('storageChanged'));
        mostrarFeedbackAdicionado(item.titulo);
    };

    const mostrarFeedbackAdicionado = (nomeItem) => {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 20px; right: 20px; background-color: #198754; color: white;
            padding: 1rem 1.5rem; border-radius: 0.5rem; z-index: 1050;
            box-shadow: 0 0.25rem 0.75rem rgba(0,0,0,0.1);
            animation: slideIn 0.3s ease-out;
        `;
        toast.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> <strong>${nomeItem}</strong> foi adicionado ao carrinho!`;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    };

    // --- RENDERIZAÇÃO DOS CARDS ---
    function renderizarCards(itens) {
        console.log("Renderizando cards:", itens); // Ajuda na depuração

        const headerLanchonete = cardsContainer.querySelector('.text-center');
        let containerParaRenderizar;

        if (headerLanchonete) {
            const itensAnteriores = cardsContainer.querySelector('.row');
            if (itensAnteriores) itensAnteriores.remove();

            containerParaRenderizar = document.createElement('div');
            containerParaRenderizar.className = "row justify-content-center w-100";
            cardsContainer.appendChild(containerParaRenderizar);
        } else {
            cardsContainer.innerHTML = '';
            containerParaRenderizar = document.createElement('div');
            containerParaRenderizar.className = "row justify-content-center w-100";
            cardsContainer.appendChild(containerParaRenderizar);
        }


        if (itens.length === 0 && campoBusca.value) {
            containerParaRenderizar.innerHTML = `<p class="text-white">Nenhum item encontrado para "${campoBusca.value}".</p>`;
            return;
        }

        itens.forEach(item => {
            const estiloIndisponivel = !item.disponivel ? 'style="filter: opacity(50%); cursor: not-allowed;"' : '';
            const botaoDesabilitado = !item.disponivel ? 'disabled' : '';

            const cardWrapper = document.createElement('div');
            cardWrapper.className = "m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex";
            cardWrapper.innerHTML = `
                <div class="card shadow rounded-4 border-0 overflow-hidden mx-auto" ${estiloIndisponivel} style="width: 320px; transition: transform 0.3s;">
                <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
                    <img src="${item.imagem}" class="card-img-top" alt="${item.titulo}" style="height: 160px; object-fit: cover;">
                </a>

                <div class="card-body text-center d-flex flex-column px-3 py-3">
                    <h5 class="card-title fw-semibold text-truncate mb-2" title="${item.titulo}">${item.titulo}</h5>

                    <div class="avaliacao-estrelas mb-2" data-tipo="item" data-id="${item.id}">
                        ${[...Array(5)].map((_, i) => `<i class="fa-regular fa-star estrela text-warning" data-index="${i + 1}"></i>`).join('')}
                    </div>

                    <div class="d-flex align-items-center justify-content-between mt-auto">
                        <p class="fw-bold h5 mx-3 mb-0">${item.valor}</p>

                        <div class="d-flex align-items-center border rounded-pill px-2 py-1 ms-2">
                            <button class="btn btn-sm btn-outline-secondary px-2 py-0 btn-quantidade" data-operacao="diminuir" data-item-id="${item.id}">−</button>
                            <span class="mx-2 quantidade-item" data-item-id="${item.id}">0</span>
                            <button class="btn btn-sm btn-outline-secondary px-2 py-0 btn-quantidade" data-operacao="aumentar" data-item-id="${item.id}">+</button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            containerParaRenderizar.appendChild(cardWrapper);
        });

        containerParaRenderizar.querySelectorAll(".btn-adicionar-carrinho").forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.currentTarget.dataset.itemId, 10);
                const item = todosOsItens.find(i => i.id === itemId);
                if (item) adicionarAoCarrinho(item);
            });
        });

        containerParaRenderizar.querySelectorAll(".avaliacao-estrelas[data-tipo='item']").forEach(container => {
            const itemId = container.dataset.id;
            inicializarEstrelasGenerico(container, `avaliacaoItem_${itemId}`);
        });
    }

    // --- LÓGICA DE BUSCA ---
    function executarBusca() {
        const termo = campoBusca.value.trim();
        cardsContainer.innerHTML = '';

        if (termo === "") {
            renderizarCards(todosOsItens);
            return;
        }

        const fuse = new Fuse(todosOsItens, {
            keys: ['titulo'],
            threshold: 0.4,
            ignoreLocation: true
        });

        const resultado = fuse.search(termo);
        const filtrados = resultado.map(res => res.item);

        if (filtrados.length === 0) {
            cardsContainer.innerHTML = `<p class="text-white">Nenhum item encontrado para "${termo}".</p>`;
        } else {
            renderizarCards(filtrados);
        }
    }

    // --- FETCH DE DADOS E INICIALIZAÇÃO ---
    fetch('http://localhost:3000/lanchonetes')
        .then(response => response.json())
        .then(data => {
            console.log("Lanchonetes carregadas:", data); // Para verificar retorno da API

            if (!Array.isArray(data)) throw new Error("Formato de dados inválido.");

            cardsContainer.innerHTML = '';
            let itensParaRenderizar = [];

            if (idLanchonete == 0 && campusSelecionado) {
                const lanchonetesDoCampus = data.filter(l => l.campus === campusSelecionado);
                lanchonetesDoCampus.forEach(lanchonete => {
                    lanchonete.itens.forEach(item => {
                        itensParaRenderizar.push({ ...item, nomeLanchonete: lanchonete.nome });
                    });
                });
            } else {
                const lanchonete = data.find(l => l.id == idLanchonete);
                if (!lanchonete) return;

                const lanchoneteHeader = document.createElement("div");
                lanchoneteHeader.className = " mt-4 w-100 text-center";
                lanchoneteHeader.innerHTML = `
                    <h3>${lanchonete.nome}</h3>
                    <div class="avaliacao-estrelas mb-2" data-id="${lanchonete.id}" data-tipo="lanchonete">
                        ${[1, 2, 3, 4, 5].map(i => `<i class="fa-regular fa-star estrela" data-index="${i}"></i>`).join('')}
                    </div>
                `;
                cardsContainer.appendChild(lanchoneteHeader);
                inicializarEstrelasGenerico(lanchoneteHeader.querySelector('.avaliacao-estrelas'), `avaliacaoLanchonete_${lanchonete.id}`);

                lanchonete.itens.forEach(item => {
                    itensParaRenderizar.push({ ...item, nomeLanchonete: lanchonete.nome });
                });
            }

            todosOsItens = [...itensParaRenderizar];
            renderizarCards(todosOsItens);
        })
        .catch(error => {
            console.error('Erro ao buscar ou processar os dados:', error);
            cardsContainer.innerHTML = `<p class="text-white">Erro ao carregar dados.</p>`;
        });

    // --- EVENT LISTENERS GERAIS ---
    if (btnBusca) btnBusca.addEventListener('click', executarBusca);
    if (campoBusca) campoBusca.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executarBusca();
    });

    function inicializarEstrelasGenerico(container, chaveLocal) {
        const estrelas = container.querySelectorAll(".estrela");
        const notaSalva = localStorage.getItem(chaveLocal);
        if (notaSalva) destacarEstrelas(estrelas, parseInt(notaSalva));

        estrelas.forEach((estrela, index) => {
            estrela.addEventListener("mouseenter", () => destacarEstrelas(estrelas, index + 1));
            estrela.addEventListener("mouseleave", () => destacarEstrelas(estrelas, parseInt(localStorage.getItem(chaveLocal)) || 0));
            estrela.addEventListener("click", () => {
                localStorage.setItem(chaveLocal, index + 1);
                destacarEstrelas(estrelas, index + 1);
            });
        });
    }

    const destacarEstrelas = (estrelas, nota) => {
        estrelas.forEach((estrela, i) => {
            estrela.classList.toggle("fa-solid", i < nota);
            estrela.classList.toggle("fa-regular", i >= nota);
        });
    };
});

// Adiciona CSS para animação do toast de feedback
const style = document.createElement('style');
style.textContent = `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`;
document.head.appendChild(style);