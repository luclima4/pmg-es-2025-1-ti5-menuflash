//LARISSA - botões de escolher a lanchonete

//quando carrega a pagina, a funcao mostrarLanchonete é adicionada
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM lachonetes.js carregado, iniciando fetch...');
    let params = new URLSearchParams(window.location.search);
    let id = params.get("id");

    fetch('http://localhost:3000/dados')
        .then(response => response.json())
        .then(dados => {
            //acha o item no array
            let lanchoneteSelecionada = dados.lanchonetes.find(function (elem) { return elem.id == id });
            console.log('fetch lanchonetes.js carregado');

            let cardLanchonetes = document.getElementById("cardLanchonetes");
            cardLanchonetes.innerHTML = "";

            //cria o html de um card
            function criarCardItem(item) {
                return `
                    <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
                        <div class="card h-100 w-100 shadow-sm">     
                            <img src="${item.imagem}" class="card-img-top" alt="${item.titulo}">
                            <div class="card-body text-center d-flex flex-column">
                                <h5 class="card-title">${item.titulo}</h5>
                                <p>${item.descricao}</p>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-bold">${item.valor}</span>
                                    <button disabled type="button" class="btn btn-outline-secondary btn-sm">Adicionar ao carrinho</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
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
                dados.lanchonetes.forEach(lanchonete => renderizarLanchonete(lanchonete));
            } else {
                if (lanchoneteSelecionada) {
                    renderizarLanchonete(lanchoneteSelecionada);
                } else {
                    cardLanchonetes.innerHTML = "<p>Lanchonete não encontrada.</p>";
                }
            }
        })
});



//quando carrega a pagina, a funcao mostrarLanchonete é adicionada
// document.addEventListener('DOMContentLoaded', mostrarLanchonete);

// document.addEventListener('DOMContentLoaded', () => {
//     console.log('DOM lachonetes.js carregado, iniciando fetch...');
//     fetch('http://localhost:3000/lanchonetes/')
//         .then(response => response.json())
//         .then(lanchonetes => {
//             criaBotoesLanchonete({ lanchonetes });
//             console.log("botoes das lanchonetes recebidos:", lanchonetes);
//         })
// })


// // function mostrarLanchonete() {
// fetch('http://localhost:3000/lanchonetes/')
//     .then(response => response.json())
//     .then(lanchonetes => {
//         let params = new URLSearchParams(location.search); //pega os parametros da URL pra extrair o id da lanchonete
//         let id = params.get("id");
//         selecionarLanchonete(id); //chama a função pra mostrar os itens da lanchonete do id
//     })

// // //cria o html de um card
// // function criarCardItem(item) {
// //     return `
// //         <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
// //             <div class="card h-100 w-100 shadow-sm">
// //                 <img src="${item.imagem}" class="card-img-top" alt="item">
// //                 <div class="card-body text-center d-flex flex-column">
// //                     <h5 class="card-title">${item.titulo}</h5>
// //                     <p>${item.descricao}</p>
// //                     <div class="d-flex justify-content-between align-items-center">
// //                         <span class="fw-bold">${item.valor}</span>
// //                         <button disabled type="button" class="btn btn-outline-secondary btn-sm">Adicionar ao carrinho</button>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     `;
// // }

// fetch('http://localhost:3000/lanchonetes/')
//     .then(response => response.json())
//     .then(lanchonetes => {

//         //acha o item no array
//         let lanchonete = lanchonetes.find(function (elem) { return elem.id == id });

//         //mostra os dados
//         let card = `
//     <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
//             <div class="card h-100 w-100 shadow-sm">
//                 <img src="${item.imagem}" class="card-img-top" alt="item">
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
//         document.getElementById("cardLanchonetes").innerHTML = card;
//     })

// //confere o id e mostra a lanchonete correspondente
// // function selecionarLanchonete(id) {
// fetch('http://localhost:3000/lanchonetes/')
//     .then(response => response.json())
//     .then(lanchonetes => {
//         let cardLanchonetes = document.getElementById("cardLanchonetes");
//         cardLanchonetes.innerHTML = "";

//         //se id = 0, mostra tds as lanchonetes
//         if (id == 0) {
//             dados.lanchonetes.forEach(lanchonete => {
//                 renderizarLanchonete(lanchonete); //chama a funcao que mostra os itens da lanchonete
//             });
//         } else {
//             let lanchoneteSelecionada = dados.lanchonetes.find(lanch => lanch.id == id);
//             if (lanchoneteSelecionada) {
//                 renderizarLanchonete(lanchoneteSelecionada);
//             }
//         }
//     })

// //monta estrutura html pros itens
// // function renderizarLanchonete(lanchonete) {
// fetch('http://localhost:3000/lanchonetes/')
//     .then(response => response.json())
//     .then(lanchonetes => {
//         let cardLanchonetes = document.getElementById("cardLanchonetes");

//         let divLanchonete = document.createElement("div");
//         divLanchonete.className = "mb-4";
//         divLanchonete.innerHTML = `<h1 class="mb-3">${lanchonete.nome}</h1>`;

//         let divItens = document.createElement("div");
//         divItens.className = "d-flex flex-wrap gap-3";

//         lanchonete.itens.forEach(item => {
//             divItens.innerHTML += criarCardItem(item); //adiciona o card de cada item na div
//         });

//         divLanchonete.appendChild(divItens);
//         cardLanchonetes.appendChild(divLanchonete);
//     })