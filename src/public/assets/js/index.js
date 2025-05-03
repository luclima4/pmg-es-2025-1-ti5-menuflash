function criaCards() {;
    for (let i = 0; i < dados.length; i++) {
        let dado = dados[i];
        if(dado.disponivel == true){
            let card = `
            <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
                <div class="card h-100 w-100 shadow-sm">
                    <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${dado.id}">
                    <img src="${dado.imagem}" class="card-img-top" alt="item">
                    </a>
                        <div class="card-body text-center d-flex flex-column">
                            <h5 class="card-title">${dado.titulo}</h5><br>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold">${dado.valor}</span>
                                <button type="button" class="btn btn-outline-secondary btn-sm">Adicionar ao carrinho</button>
                            </div>
                        </div>
                </div>
            </div>
        `
        // adicionar ele no HTML da minha divCards
        let divCard = document.getElementById("divCards");
        divCard.innerHTML += card;

        }else{
            let card = `
            <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
                <div class="card h-100 w-100 shadow-sm" style="filter: opacity(40%);">     
                    <img src="${dado.imagem}" class="card-img-top" alt="item">
                        <div class="card-body text-center d-flex flex-column">
                            <h5 class="card-title">${dado.titulo}</h5><br>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold">${dado.valor}</span>
                                <button disabled type="button" class="btn btn-outline-secondary btn-sm">Adicionar ao carrinho</button>
                            </div>
                        </div>
                </div>
            </div>
        `
        // adicionar ele no HTML da minha divCards
        let divCard = document.getElementById("divCards");
        divCard.innerHTML += card;
        }
    }
  }

document.addEventListener("DOMContentLoaded", criaCards);



