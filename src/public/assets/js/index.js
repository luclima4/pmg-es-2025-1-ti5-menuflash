// LARISSA - Criação de Cards  
// function criaCards() {
//     for (let i = 0; i < dados.lanchonetes.length; i++) {
//         let lanchonete = dados.lanchonetes[i];
//         for(let j = 0; j < lanchonete.itens.length; j++){
//             let item = lanchonete.itens[j]

//             if(item.disponivel){
//                 let card = `
//                 <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
//                     <div class="card h-100 w-100 shadow-sm">
//                         <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
//                         <img src="${item.imagem}" class="card-img-top" alt="item">
//                         </a>
//                             <div class="card-body text-center d-flex flex-column">
//                                 <h5 class="card-title">${item.titulo}</h5><br>
//                                 <div class="d-flex justify-content-between align-items-center">
//                                     <span class="fw-bold">${item.valor}</span>
//                                     <button type="button" class="btn btn-outline-secondary btn-sm">Adicionar ao carrinho</button>
//                                 </div>
//                             </div>
//                     </div>
//                 </div>
//             `
//             // adicionar ele no HTML da divCards
//             let divCard = document.getElementById("divCards");
//             divCard.innerHTML += card;
    
//             }else{
//                 let card = `
//                 <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
//                     <div class="card h-100 w-100 shadow-sm" style="filter: opacity(40%);">     
//                         <img src="${item.imagem}" class="card-img-top" alt="item">
//                             <div class="card-body text-center d-flex flex-column">
//                                 <h5 class="card-title">${item.titulo}</h5><br>
//                                 <div class="d-flex justify-content-between align-items-center">
//                                     <span class="fw-bold">${item.valor}</span>
//                                     <button disabled type="button" class="btn btn-outline-secondary btn-sm">Adicionar ao carrinho</button>
//                                 </div>
//                             </div>
//                     </div>
//                 </div>
//             `
//             // adicionar ele no HTML da minha divCards
//             let divCard = document.getElementById("divCards");
//             divCard.innerHTML += card;
//             }
//         }
//     }
// }

// document.addEventListener("DOMContentLoaded", criaCards);



// LUCAS - Criação de Cards com Restrições

function cardRestricoes(){

    for(let i = 0; i < dados.lanchonetes.length; i++){
        let lanchonete = dados.lanchonetes[i]
        for(let j = 0; j < lanchonete.itens.length; j++){
            let item = lanchonete.itens[j]
            
            if(item.disponivel){
                // Para itens sem lactose e sem gluten
                if(item.semLactose && item.semGluten){
                    let card = `
                        <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
                    <div class="card h-100 w-100 shadow-sm">
                        <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
                        <img src="${item.imagem}" class="card-img-top" alt="item">
                        </a>
                            <div class="card-body text-center d-flex flex-column">
                                <h5 class="card-title">${item.titulo}</h5><br>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-bold">${item.valor}</span>
                                    <button type="button" class="btn btn-outline-secondary btn-sm">Adicionar ao carrinho</button>
                                </div>
                            </div>
                            <div class="d-inline-block d-flex justify-content-center">
                                <div class="alert alert-success d-inline-block py-1 px-2 small" role="alert">Sem Lactose e sem Gluten</div>
                            </div>
                        </div>
                    </div>
            `
            // adicionar ele no HTML da minha divCards
            let divCard = document.getElementById("divCardsRestricoes");
            divCard.innerHTML += card;
                
                // Para itens sem lactose
                }else if(item.semLactose){  
                    let card = `
                        <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
                    <div class="card h-100 w-100 shadow-sm">
                        <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
                        <img src="${item.imagem}" class="card-img-top" alt="item">
                        </a>
                            <div class="card-body text-center d-flex flex-column">
                                <h5 class="card-title">${item.titulo}</h5><br>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-bold">${item.valor}</span>
                                    <button type="button" class="btn btn-outline-secondary btn-sm">Adicionar ao carrinho</button>
                                </div>
                            </div>
                            <div class="d-inline-block d-flex justify-content-center">
                                <div class="alert alert-success d-inline-block py-1 px-2 small" role="alert">Sem Lactose</div>
                            </div>
                        </div>
                    </div>
            `
            // adicionar ele no HTML da minha divCards
            let divCard = document.getElementById("divCardsRestricoes");
            divCard.innerHTML += card;
            
                }else if (item.semGluten){
                    let card = `
                        <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
                    <div class="card h-100 w-100 shadow-sm">
                        <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
                        <img src="${item.imagem}" class="card-img-top" alt="item">
                        </a>
                            <div class="card-body text-center d-flex flex-column">
                                <h5 class="card-title">${item.titulo}</h5><br>
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-bold">${item.valor}</span>
                                    <button type="button" class="btn btn-outline-secondary btn-sm">Adicionar ao carrinho</button>
                                </div>
                            </div>
                            <div class="d-inline-block d-flex justify-content-center">
                                <div class="alert alert-success d-inline-block py-1 px-2 small" role="alert">Sem Gluten</div>
                            </div>
                        </div>
                    </div>
            `
            // adicionar ele no HTML da minha divCards
            let divCard = document.getElementById("divCardsRestricoes");
            divCard.innerHTML += card;
                }
            } 
        }   
    }
}
document.addEventListener("DOMContentLoaded", cardRestricoes);