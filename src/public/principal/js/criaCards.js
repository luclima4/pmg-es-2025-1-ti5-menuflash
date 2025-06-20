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

      } else {
        const lanchoneteSelecionada = lanchonetes.find(l => l.id == idLanchonete);

        if (!lanchoneteSelecionada) {
          cardsContainer.innerHTML = `<p class="text-white">Lanchonete não encontrada.</p>`;
          return;
        }

        const titulo = document.createElement("h3");
        titulo.className = "text-white mt-4 w-100";
        titulo.textContent = lanchoneteSelecionada.nome;
        cardsContainer.appendChild(titulo);

        lanchoneteSelecionada.itens.forEach(item => {
          todosOsItens.push({ ...item, nomeLanchonete: lanchoneteSelecionada.nome });
        });
      }

      renderizarCards(todosOsItens);
    })
    .catch(error => {
      console.error('Erro ao buscar ou processar os dados:', error);
      cardsContainer.innerHTML = `<p class="text-white">Erro ao carregar dados.</p>`;
    });

  // Evento de clique no botão de busca
  btnBusca.addEventListener('click', executarBusca);

  // Também dispara a busca ao pressionar Enter
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
      threshold: 0.4, // 0 = exato, 1 = bem permissivo
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
    itens.forEach(item => {
      const estiloIndisponivel = !item.disponivel ? 'style="filter: opacity(40%);"' : '';
      const botaoDesabilitado = !item.disponivel ? 'disabled' : '';

      const cardHTML = `
        <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
          <div class="card h-100 w-100 shadow-sm" ${estiloIndisponivel}>
            <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
              <img src="${item.imagem}" class="card-img-top" alt="${item.titulo}">
            </a>
            <div class="card-body text-center d-flex flex-column">
              <h5 class="card-title">${item.titulo}</h5>
              <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
                <span class="fw-bold">${item.valor}</span>
                <button ${botaoDesabilitado} type="button" class="btn btn-outline-secondary btn-sm">Adicionar ao carrinho</button>
              </div>
            </div>
          </div>
        </div>
      `;

      cardsContainer.innerHTML += cardHTML;
    });
  }
});