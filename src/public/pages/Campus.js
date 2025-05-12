const campusData = [
  {
    nome: "PUC MINAS - Coração Eucarístico",
    mapa: "mapaCoreu.html",
    lanchonetes: [
      { nome: "Lanchonete A", id: "lanchonete-a" },
      { nome: "Lanchonete B", id: "lanchonete-b" },
      { nome: "Lanchonete C", id: "lanchonete-c" },
      { nome: "Lanchonete D", id: "lanchonete-d" },
      { nome: "Lanchonete E", id: "lanchonete-e" },
      { nome: "Lanchonete F", id: "lanchonete-f" }
    ]
  },
  {
    nome: "PUC MINAS - Contagem",
    mapa: "mapaContagem.html",
    lanchonetes: [
      { nome: "Lanchonete A", id: "lanchonete-a" },
      { nome: "Lanchonete B", id: "lanchonete-b" }
    ]
  },
  {
    nome: "PUC MINAS - Barreiro",
    mapa: "mapaBarreiro.html",
    lanchonetes: [
      { nome: "Lanchonete A", id: "lanchonete-a" },
      { nome: "Lanchonete B", id: "lanchonete-b" }
    ]
  },
  {
    nome: "PUC MINAS - São Gabriel",
    mapa: "mapaSaoGabriel.html",
    lanchonetes: [
      { nome: "Lanchonete A", id: "lanchonete-a" },
      { nome: "Lanchonete B", id: "lanchonete-b" }
    ]
  }
];


window.onload = function () {
  const currentPage = window.location.pathname;

  // Botões das lanchonetes
  const lanchonetesContainer = document.getElementById("lanchonetes-container");
  if (lanchonetesContainer) {
    const campusAtual = campusData.find(campus =>
      currentPage.toLowerCase().includes(campus.mapa.toLowerCase())
    );

    if (campusAtual) {
      campusAtual.lanchonetes.forEach(lanchonete => {
        const button = document.createElement("button");
        button.classList.add("btn", "btn-light", "rounded-pill", "fw-bold", "m-2", "w-100");
        button.innerText = lanchonete.nome;

        button.onclick = function () {
          window.location.href = "Lanchonetes.html";
        };
        lanchonetesContainer.appendChild(button);
      });
    }
  }
};