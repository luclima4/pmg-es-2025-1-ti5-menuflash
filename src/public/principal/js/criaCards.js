document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const idLanchonete = params.get("id");

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
});




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

            cardsContainer.innerHTML = '';

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

                renderizarCards(todosOsItens);
            } else {
                const lanchoneteSelecionada = lanchonetes.find(l => l.id == idLanchonete);

                if (!lanchoneteSelecionada) {
                    return;
                }

                const lanchoneteHeader = document.createElement("div");
                lanchoneteHeader.className = "text-white mt-4 w-100 text-center";

                const nomeLanchonete = document.createElement("h3");
                nomeLanchonete.textContent = lanchoneteSelecionada.nome;

                const containerEstrelasLanchonete = document.createElement("div");
                containerEstrelasLanchonete.className = "avaliacao-estrelas mb-2";
                containerEstrelasLanchonete.setAttribute("data-id", lanchoneteSelecionada.id);
                containerEstrelasLanchonete.setAttribute("data-tipo", "lanchonete");

                for (let i = 1; i <= 5; i++) {
                    const estrela = document.createElement("i");
                    estrela.className = "fa-regular fa-star estrela";
                    estrela.dataset.index = i;
                    containerEstrelasLanchonete.appendChild(estrela);
                }

                lanchoneteHeader.appendChild(nomeLanchonete);
                lanchoneteHeader.appendChild(containerEstrelasLanchonete);
                cardsContainer.appendChild(lanchoneteHeader);

                inicializarEstrelasGenerico(containerEstrelasLanchonete, `avaliacaoLanchonete_${lanchoneteSelecionada.id}`);

                lanchoneteSelecionada.itens.forEach(item => {
                    todosOsItens.push({ ...item, nomeLanchonete: lanchoneteSelecionada.nome });
                });

                renderizarCards(todosOsItens);
            }
        })
        .catch(error => {
            console.error('Erro ao buscar ou processar os dados:', error);
            cardsContainer.innerHTML = `<p class="text-white">Erro ao carregar dados.</p>`;
        });

    // 🔍 Modificações aqui:
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
