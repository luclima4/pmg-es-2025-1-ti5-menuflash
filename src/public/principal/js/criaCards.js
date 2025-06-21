document.addEventListener("DOMContentLoaded", () => {
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
            // Mapeia os campos corretamente para o objeto do carrinho
            const itemParaCarrinho = {
                id: item.id,
                nome: item.titulo, // Correção: usa item.titulo para a propriedade nome
                imagem: item.imagem,
                valor: item.valor,
                nomeLanchonete: item.nomeLanchonete,
                quantidade: 1
            };
            carrinho.push(itemParaCarrinho);
        }
        
        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        window.dispatchEvent(new Event('storageChanged')); // Notifica outras partes da aplicação
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
    const renderizarCards = (itens) => {
        const headerLanchonete = cardsContainer.querySelector('.text-center');
        let containerParaRenderizar;

        if (headerLanchonete) {
            // Se o cabeçalho da lanchonete existe, limpa apenas os cards de itens
            const itensAnteriores = cardsContainer.querySelector('.row');
            if (itensAnteriores) itensAnteriores.remove();
            
            containerParaRenderizar = document.createElement('div');
            containerParaRenderizar.className = "row justify-content-center w-100";
            cardsContainer.appendChild(containerParaRenderizar);
        } else {
            // Se não houver cabeçalho, limpa tudo e cria um novo container
            cardsContainer.innerHTML = '';
            containerParaRenderizar = cardsContainer;
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
                <div class="card h-100 w-100 shadow-sm" ${estiloIndisponivel}>
                    <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
                        <img src="${item.imagem}" class="card-img-top" alt="${item.titulo}">
                    </a>
                    <div class="card-body text-center d-flex flex-column">
                        <h5 class="card-title">${item.titulo}</h5>
                        <div class="avaliacao-estrelas mb-2" data-tipo="item" data-id="${item.id}">
                            ${[...Array(5)].map((_, i) => `<i class="fa-regular fa-star estrela" data-index="${i+1}"></i>`).join('')}
                        </div>
                        <div class="mt-auto pt-2">
                            <p class="fw-bold h5">${item.valor}</p>
                            <button ${botaoDesabilitado} type="button" class="btn btn-primary w-100 btn-adicionar-carrinho" data-item-id="${item.id}">
                                <i class="bi bi-cart-plus"></i> Adicionar
                            </button>
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
                if (item) {
                    adicionarAoCarrinho(item);
                }
            });
        });

        // Inicializa as estrelas de avaliação
        containerParaRenderizar.querySelectorAll(".avaliacao-estrelas[data-tipo='item']").forEach(container => {
            const itemId = container.dataset.id;
            inicializarEstrelasGenerico(container, `avaliacaoItem_${itemId}`);
        });
    };

    // --- LÓGICA DE BUSCA ---
    const executarBusca = () => {
        const termo = campoBusca.value.trim();
        if (termo === "") {
            renderizarCards(todosOsItens);
            return;
        }

        const fuse = new Fuse(todosOsItens, { keys: ['titulo'], threshold: 0.4, ignoreLocation: true });
        const resultado = fuse.search(termo).map(res => res.item);
        renderizarCards(resultado);
    };

    // --- INICIALIZAÇÃO E FETCH DE DADOS ---
    fetch('http://localhost:3000/lanchonetes')
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) throw new Error("Formato de dados inválido.");

            cardsContainer.innerHTML = '';
            
            let itensParaRenderizar = [];
            
            // Caso "Todas as lanchonetes"
            if (idLanchonete == 0 && campusSelecionado) {
                const lanchonetesDoCampus = data.filter(l => l.campus === campusSelecionado);
                lanchonetesDoCampus.forEach(lanchonete => {
                    lanchonete.itens.forEach(item => {
                        itensParaRenderizar.push({ ...item, nomeLanchonete: lanchonete.nome });
                    });
                });
            } else { // Caso uma lanchonete específica
                const lanchonete = data.find(l => l.id == idLanchonete);
                if (!lanchonete) return;

                const lanchoneteHeader = document.createElement("div");
                lanchoneteHeader.className = "text-white mt-4 w-100 text-center";
                lanchoneteHeader.innerHTML = `
                    <h3>${lanchonete.nome}</h3>
                    <div class="avaliacao-estrelas mb-2" data-id="${lanchonete.id}" data-tipo="lanchonete">
                        ${[1,2,3,4,5].map(i => `<i class="fa-regular fa-star estrela" data-index="${i}"></i>`).join('')}
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
    if(btnBusca) btnBusca.addEventListener('click', executarBusca);
    if(campoBusca) campoBusca.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executarBusca();
    });

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

    function renderizarCards(itens) {
        const lastChild = cardsContainer.lastElementChild;
        let elementsToAppendTo = cardsContainer;

        if (lastChild && lastChild.classList.contains('text-center') && lastChild.querySelector('h3')) {
            elementsToAppendTo = document.createElement('div');
            elementsToAppendTo.className = "row justify-content-center w-100";
            cardsContainer.appendChild(elementsToAppendTo);
        } else {
            cardsContainer.innerHTML = '';
            elementsToAppendTo = cardsContainer;
        }

        itens.forEach(item => {
            const estiloIndisponivel = !item.disponivel ? 'style="filter: opacity(40%);"' : '';
            const botaoDesabilitado = !item.disponivel ? 'disabled' : '';

            const cardHTML = `
                    <div class="m-0 p-2 mt-3 col-lg-3 col-md-4 col-sm-6 col-12 d-flex">
                    <div class="card shadow-lg rounded-4 w-100 h-100 border-0" ${estiloIndisponivel} style="transition: transform 0.3s;">
                        <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}" class="overflow-hidden rounded-top-4">
                            <img src="${item.imagem}" class="card-img-top img-fluid rounded-top-4" alt="${item.titulo}" style="height: 180px; object-fit: cover;">
                        </a>
                        <div class="card-body d-flex flex-column justify-content-between p-3 text-center">
                            <h5 class="card-title fw-semibold mb-2 text-dark">${item.titulo}</h5>

                            <div class="avaliacao-estrelas mb-3" data-tipo="item" data-id="${item.id}">
                                ${[1, 2, 3, 4, 5].map(i => `
                                    <i class="fa-regular fa-star estrela text-warning" data-index="${i}" style="cursor: pointer;"></i>
                                `).join('')}
                            </div>

                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold fs-5">${item.valor}</span>

                                <div class="input-group justify-content-end" style="max-width: 120px;">
                                    <button ${botaoDesabilitado} class="btn btn-outline-danger btn-sm" onclick="alterarQuantidade(${item.id}, -1)">-</button>
                                    <input id="quantidade-${item.id}" type="text" class="form-control text-center px-1 py-0" value="0" readonly style="width: 40px;">
                                    <button ${botaoDesabilitado} class="btn btn-outline-success btn-sm" onclick="alterarQuantidade(${item.id}, 1)">+</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            elementsToAppendTo.innerHTML += cardHTML;
        });

        document.querySelectorAll(".avaliacao-estrelas[data-tipo='item']").forEach(container => {
            const itemId = container.dataset.id;
            inicializarEstrelasGenerico(container, `avaliacaoItem_${itemId}`);
        });
    }

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
    };

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
