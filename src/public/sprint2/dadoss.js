const appData = {
  campus: [
    {
      nome: "PUC MINAS - Coração Eucarístico",
      mapa: "SelecaoLanchonete.html",
      lanchonetes: [
        { nome: "Paçaki", id: 1 },
        { nome: "DoBão", id: 2 },
        { nome: "Starbucks", id: 3 }
      ]
    }
    // Outros Campi
  ],

  lanchonetes: [
    {
      id: 1,
      nome: "Paçaki",
      itens: [
        { id: 1, titulo: "Água", valor: "R$3,50", imagem: "img/agua.png", conteudo: "500ml", disponivel: true },
        { id: 2, titulo: "Guaraná lata", valor: "R$5,00", imagem: "img/guaranaLata.png", conteudo: "350ml", disponivel: true },
        { id: 3, titulo: "Açaí", valor: "R$7,00", imagem: "img/acai.png", conteudo: "500ml", disponivel: true },
        { id: 4, titulo: "Coxinha", valor: "R$6,00", imagem: "img/coxinha.png", conteudo: "", disponivel: true }
      ]
    },
    {
      id: 2,
      nome: "DoBão",
      itens: [
        { id: 5, titulo: "Pão de queijo", valor: "R$5,50", imagem: "img/paoDeQueijo.png", conteudo: "", disponivel: true },
        { id: 6, titulo: "Empada", valor: "R$6,50", imagem: "img/empada.png", conteudo: "", disponivel: true },
        { id: 7, titulo: "Coca-Cola lata", valor: "R$5,50", imagem: "img/cocaLata.png", conteudo: "350ml", disponivel: true },
        { id: 8, titulo: "Sanduíche", valor: "R$7,50", imagem: "img/sanduiche.png", conteudo: "", disponivel: true }
      ]
    },
    {
      id: 3,
      nome: "Starbucks",
      itens: [
        { id: 9, titulo: "Trident", valor: "R$2,00", imagem: "img/trident.png", conteudo: "", disponivel: true },
        { id: 10, titulo: "Trento", valor: "R$4,50", imagem: "img/trento.png", conteudo: "", disponivel: true },
        { id: 11, titulo: "Suco lata", valor: "R$5,00", imagem: "img/sucoLata.png", conteudo: "400ml", disponivel: true },
        { id: 12, titulo: "Coca-Cola", valor: "R$4,00", imagem: "img/coca.png", conteudo: "200ml", disponivel: true }
      ]
    }
  ]
};

// Identifica se está na página de seleção de lanchonete
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = window.location.pathname;
  const lanchonetesContainer = document.getElementById("lanchonetes-container");

  if (lanchonetesContainer) {
    const campusAtual = appData.campus.find(campus =>
      currentPage.toLowerCase().includes(campus.mapa.toLowerCase())
    );

    if (campusAtual) {
      campusAtual.lanchonetes.forEach(lanchonete => {
        const button = document.createElement("button");
        button.classList.add("btn", "btn-light", "rounded-pill", "fw-bold", "m-2");
        button.innerText = lanchonete.nome;

        button.onclick = () => {
          window.location.href = `pacaki.html?id=${lanchonete.id}`;
        };

        lanchonetesContainer.appendChild(button);
      });
    }
  }

  // Página da lanchonete
  const divCards = document.getElementById("divCards");
  const campo = document.getElementById("campo-pesquisa");
  const nomeTitulo = document.getElementById("nome-campus");

  if (divCards && campo) {
    const urlParams = new URLSearchParams(window.location.search);
    const idLanchonete = parseInt(urlParams.get("id"));
    const lanchonete = appData.lanchonetes.find(l => l.id === idLanchonete);

    if (lanchonete) {
      if (nomeTitulo) nomeTitulo.textContent = lanchonete.nome;

      let itensFiltrados = lanchonete.itens;
      criaCards(itensFiltrados);

      campo.addEventListener("input", () => {
        const termo = campo.value.toLowerCase();
        const filtrados = itensFiltrados.filter(item =>
          item.titulo.toLowerCase().includes(termo)
        );
        criaCards(filtrados);
      });
    } else {
      divCards.innerHTML = "<p class='text-center'>Lanchonete não encontrada.</p>";
    }
  }
});

// Criação dos cards
function criaCards(lista) {
  const divCard = document.getElementById("divCards");
  divCard.innerHTML = "";

  if (lista.length === 0) {
    divCard.innerHTML = "<p class='text-center'>Nenhum produto encontrado.</p>";
    return;
  }

  lista.forEach(item => {
    const card = `
      <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
        <div class="card h-100 w-100 shadow-sm" style="${item.disponivel ? '' : 'filter: opacity(40%);'}">
          <img src="${item.imagem}" class="card-img-top" alt="${item.titulo}">
          <div class="card-body text-center d-flex flex-column">
            <h5 class="card-title">${item.titulo}</h5>
            <p class="text-muted small">${item.conteudo || ""}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="fw-bold">${item.valor}</span>
              <button class="btn btn-outline-secondary btn-sm" ${item.disponivel ? "" : "disabled"}>Adicionar</button>
            </div>
          </div>
        </div>
      </div>
    `;
    divCard.innerHTML += card;
  });
}
