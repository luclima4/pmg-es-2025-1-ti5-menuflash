document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const idLanchonete = params.get('id');
    const campusSelecionado = params.get('campus');

    const cardsContainer = document.getElementById('divCards');
    const campoBusca = document.getElementById('campoBusca');
    const btnBusca = document.getElementById('btnBusca');

    let todosOsItens = [];

    fetch('http://localhost:3000/lanchonetes')
        .then(response => response.json())
        .then(data => {
            const lanchonetes = data;

            if (!Array.isArray(lanchonetes)) throw new Error("Formato de dados inválido.");

            cardsContainer.innerHTML = ''; // Limpa antes de adicionar qualquer coisa

            if (idLanchonete == 0 && campusSelecionado) {
                const lanchonetesDoCampus = lanchonetes.filter(l => l.campus === campusSelecionado);

                if (lanchonetesDoCampus.length === 0) {
                    cardsContainer.innerHTML = `<p class="text-white">Nenhuma lanchonete encontrada para o campus ${campusSelecionado}.</p>`;
                    return;
                }

                lanchonetesDoCampus.forEach(lanchonete => {
                    lanchonete.itens.forEach(item => {
                        todosOsItens.push({ ...item, nomeLanchonete: lanchonete.nome });
                    });
                });

                renderizarCards(todosOsItens); // Renderiza os itens e inicializa suas avaliações
            } else {
                const lanchoneteSelecionada = lanchonetes.find(l => l.id == idLanchonete);

                if (!lanchoneteSelecionada) {
                    cardsContainer.innerHTML = `<p class="text-white">Lanchonete não encontrada.</p>`;
                    return;
                }

                const lanchoneteHeader = document.createElement("div");
                lanchoneteHeader.className = "text-white mt-4 w-100 text-center";

                const nomeLanchonete = document.createElement("h3");
                nomeLanchonete.textContent = lanchoneteSelecionada.nome;

                // Aqui é onde você cria o container de estrelas para a lanchonete
                const containerEstrelasLanchonete = document.createElement("div");
                containerEstrelasLanchonete.className = "avaliacao-estrelas mb-2";
                containerEstrelasLanchonete.setAttribute("data-id", lanchoneteSelecionada.id); // Adicionei o data-id para referência
                containerEstrelasLanchonete.setAttribute("data-tipo", "lanchonete"); // Indicando que é uma lanchonete

                for (let i = 1; i <= 5; i++) {
                    const estrela = document.createElement("i");
                    estrela.className = "fa-regular fa-star estrela";
                    estrela.dataset.index = i;
                    containerEstrelasLanchonete.appendChild(estrela);
                }

                lanchoneteHeader.appendChild(nomeLanchonete);
                lanchoneteHeader.appendChild(containerEstrelasLanchonete);
                cardsContainer.appendChild(lanchoneteHeader);

                // Inicializa as estrelas da lanchonete ANTES de renderizar os itens
                // Use a função genérica para a lanchonete
                inicializarEstrelasGenerico(containerEstrelasLanchonete, `avaliacaoLanchonete_${lanchoneteSelecionada.id}`);

                lanchoneteSelecionada.itens.forEach(item => {
                    todosOsItens.push({ ...item, nomeLanchonete: lanchoneteSelecionada.nome });
                });

                renderizarCards(todosOsItens); // Renderiza os itens e inicializa suas avaliações
            }
        })
        .catch(error => {
            console.error('Erro ao buscar ou processar os dados:', error);
            cardsContainer.innerHTML = `<p class="text-white">Erro ao carregar dados.</p>`;
        });

    btnBusca.addEventListener('click', executarBusca);
    campoBusca.addEventListener('keypress', (e) => {
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
        // Encontra o último child para verificar se é o header da lanchonete
        const lastChild = cardsContainer.lastElementChild;
        let elementsToAppendTo = cardsContainer;

        // Se o último elemento for o header da lanchonete, adicione os cards DEPOIS dele
        if (lastChild && lastChild.classList.contains('text-center') && lastChild.querySelector('h3')) {
            elementsToAppendTo = document.createElement('div'); // Cria um novo div para os cards dos itens
            elementsToAppendTo.className = "row justify-content-center w-100"; // Adicione classes para layout, se necessário
            cardsContainer.appendChild(elementsToAppendTo);
        } else {
             // Limpa apenas os cards de itens se o header da lanchonete não estiver presente
             cardsContainer.innerHTML = '';
             elementsToAppendTo = cardsContainer; // Volta a adicionar diretamente no cardsContainer
        }


        itens.forEach(item => {
            const estiloIndisponivel = !item.disponivel ? 'style="filter: opacity(40%);"' : '';
            const botaoDesabilitado = !item.disponivel ? 'disabled' : '';
            const idAvaliacao = `avaliacao-${item.id}`; // Isso não é necessário para o seletor, mas pode manter para outros usos.

            const cardHTML = `
                <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
                    <div class="card h-100 w-100 shadow-sm" ${estiloIndisponivel}>
                        <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
                            <img src="${item.imagem}" class="card-img-top" alt="${item.titulo}">
                        </a>
                        <div class="card-body text-center d-flex flex-column">
                            <h5 class="card-title">${item.titulo}</h5>
                            <div class="avaliacao-estrelas mb-2" data-tipo="item" data-id="${item.id}">
                                ${[1, 2, 3, 4, 5].map(i => `<i class="fa-regular fa-star estrela" data-index="${i}"></i>`).join('')}
                            </div>
                            <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
                                <span class="fw-bold">${item.valor}</span>
                                <button ${botaoDesabilitado} type="button" class="btn btn-outline-secondary btn-sm">Adicionar ao carrinho</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            elementsToAppendTo.innerHTML += cardHTML; // Adiciona ao elementsToAppendTo
        });

        // Chama a função genérica para inicializar as avaliações dos itens
        // Seleciona APENAS as avaliações que são de itens
        document.querySelectorAll(".avaliacao-estrelas[data-tipo='item']").forEach(container => {
             const itemId = container.dataset.id;
             inicializarEstrelasGenerico(container, `avaliacaoItem_${itemId}`);
        });
    }

    // Função genérica para inicializar estrelas, usada tanto para lanchonetes quanto para itens
    function inicializarEstrelasGenerico(container, chaveLocal) {
        const estrelas = container.querySelectorAll(".estrela");
        const notaSalva = localStorage.getItem(chaveLocal);

        if (notaSalva) {
            destacarEstrelas(estrelas, parseInt(notaSalva));
        }

        estrelas.forEach((estrela, index) => {
            estrela.addEventListener("mouseenter", () => {
                destacarEstrelas(estrelas, index + 1);
            });

            estrela.addEventListener("mouseleave", () => {
                const notaFinal = localStorage.getItem(chaveLocal);
                destacarEstrelas(estrelas, parseInt(notaFinal) || 0);
            });

            estrela.addEventListener("click", () => {
                localStorage.setItem(chaveLocal, index + 1);
                destacarEstrelas(estrelas, index + 1);
            });
        });
    }

    function destacarEstrelas(estrelas, nota) {
        estrelas.forEach((estrela, i) => {
            if (i < nota) {
                estrela.classList.add("fa-solid");
                estrela.classList.remove("fa-regular");
            } else {
                estrela.classList.add("fa-regular");
                estrela.classList.remove("fa-solid");
            }
        });
    }
});