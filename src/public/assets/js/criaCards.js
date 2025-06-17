// LARISSA - Criação de Cards  
//quando carrega a pagina, a funcao mostrarLanchonete é adicionada
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM lachonetes.js carregado, iniciando fetch...');
    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");

    fetch('http://localhost:3000/lanchonetes')
        .then(response => response.json())
        .then(lanchonetes => {
            //acha o item no array
            let lanchoneteSelecionada = lanchonetes.find(function (elem) { return elem.id == id });
            console.log('fetch lanchonetes.js carregado');

            let cardLanchonetes = document.getElementById("cardLanchonetes");
            cardLanchonetes.innerHTML = "";

            // //cria o html de um card
              // function criarCardItem(item) {
            //     return `
            //         <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
            //             <div class="card h-100 w-100 shadow-sm">     
            //                 <img src="${item.imagem}" class="card-img-top" alt="${item.titulo}">
            //                 <div class="card-body text-center d-flex flex-column">
            //                     <h5 class="card-title">${item.titulo}</h5>
            //                     <p>${item.descricao}</p>
            //                     <div class="d-flex justify-content-between align-items-center">
            //                         <span class="fw-bold">${item.valor}</span>
            //                         <button disabled type="button" class="btn btn-outline-secondary btn-sm">Adicionar ao carrinho</button>
            //                     </div>
            //                 </div>
            //             </div>
            //         </div>
            //     `;
            // }

            for (let i = 0; i < lanchonetes.length; i++) {
                let itens = lanchonetes[i];
                if (lanchonetes.itens.disponivel == true) {
                    let card = `
                        <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
                        <div class="card h-100 w-100 shadow-sm">
                            <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${itens.id}">
                            <img src="${itens.imagem}" class="card-img-top" alt="item">
                            </a>
                            <div class="card-body text-center d-flex flex-column">
                            <h5 class="card-title">${itens.titulo}</h5><br>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold">${itens.valor}</span>
                                <button type="button" class="btn btn-outline-secondary btn-sm">Adicionar ao carrinho</button>
                            </div>
                            </div>
                        </div>
                        </div>
                    `;
                    divCard.innerHTML += card;
                } else {
                    let card = `
                        <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
                        <div class="card h-100 w-100 shadow-sm" style="filter: opacity(40%);">     
                            <img src="${itens.imagem}" class="card-img-top" alt="item">
                            <div class="card-body text-center d-flex flex-column">
                            <h5 class="card-title">${itens.titulo}</h5><br>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold">${itens.valor}</span>
                                <button disabled type="button" class="btn btn-outline-secondary btn-sm">Adicionar ao carrinho</button>
                            </div>
                            </div>
                        </div>
                        </div>
                    `;
                    divCard.innerHTML += card;
                }
            }
  

    function renderizarLanchonete(lanchonete) {
        let divLanchonete = document.createElement("div");
        divLanchonete.className = "mb-4";
        divLanchonete.innerHTML = `<h1 class="mb-3 text-light">${lanchonete.nome}</h1>`;

        let divItens = document.createElement("div");
        divItens.className = "d-flex flex-wrap gap-3";

        lanchonete.itens.forEach(item => {
            divItens.innerHTML += criarCardItem(item); //adiciona o card de cada item na div
        });

        divLanchonete.appendChild(divItens);
        cardLanchonetes.appendChild(divLanchonete);
    }

    if (id == 0 || id === null) {
        lanchonetes.forEach(lanchonete => renderizarLanchonete(lanchonete));
    } else {
        if (lanchoneteSelecionada) {
            renderizarLanchonete(lanchoneteSelecionada);
        } else {
            cardLanchonetes.innerHTML = "<p>Lanchonete não encontrada.</p>";
        }
    }
})
});

