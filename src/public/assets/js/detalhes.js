// Entender isso

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (event) {
        if (event.target.closest("a[data-id]")) {
            const id = event.target.closest("a[data-id]").getAttribute("data-id");
            mostraDetalhes(id);
        }
    });
});

function mostraDetalhes(id){
    
    for(let i = 0; i < dados.lanchonetes.length; i++){
        let lanchonete = dados.lanchonetes[i]
        for(let j = 0; j < lanchonete.itens.length; j++){
            let item = lanchonete.itens[j]
                if(item.id == id){
                    if (item.semGluten && item.semLactose){
                        let modalContent = `
                            <div class="modal-header">
                                <div class="modal-title">Lanchonete - ${lanchonete.nome}
                                    <h5 class="modal-title fs-1">${item.titulo}</h5>
                                </div>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <img src="${item.imagem}"class="img-fluid mb-2 w-75 d-block mx-auto" style="max-width: 20rem;">
                                <p>${item.descricao}</p>
                                <p><strong>${item.quantidade}</strong> unidades disponíveis</p>
                                <div class="alert alert-success d-inline-block" role="alert">Produto sem Lactose e sem Gluten!</div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                <button type="button" class="btn btn-primary">Adicionar ao Carrinho</button>
                                
                                </div>
                            </div>
                        </div>
                    </div>
                    ` 
                    document.getElementById("modalContent").innerHTML = modalContent
                    return;

                    }else if(item.semLactose){
                        let modalContent = `
                            <div class="modal-header">
                                <div class="modal-title">Lanchonete - ${lanchonete.nome}
                                    <h5 class="modal-title fs-1">${item.titulo}</h5>
                                </div>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <img src="${item.imagem}"class="img-fluid mb-2 w-75 d-block mx-auto" style="max-width: 20rem;">
                                <p>${item.descricao}</p>
                                <p><strong>${item.quantidade}</strong> unidades disponíveis</p>
                                <div class="alert alert-success d-inline-block" role="alert">Produto sem Lactose!</div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                <button type="button" class="btn btn-primary">Adicionar ao Carrinho</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    ` 
                    document.getElementById("modalContent").innerHTML = modalContent
                    return;
                    
                    }else if(item.semGluten){
                        let modalContent = `
                            <div class="modal-header">
                                <div class="modal-title">Lanchonete - ${lanchonete.nome}
                                    <h5 class="modal-title fs-1">${item.titulo}</h5>
                                </div>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <img src="${item.imagem}"class="img-fluid mb-2 w-75 d-block mx-auto" style="max-width: 20rem;">
                                <p>${item.descricao}</p>
                                <p><strong>${item.quantidade}</strong> unidades disponíveis</p>
                                <div class="alert alert-success d-inline-block" role="alert">Produto sem Gluten!</div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                <button type="button" class="btn btn-primary">Adicionar ao Carrinho</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    ` 
                    document.getElementById("modalContent").innerHTML = modalContent
                    return;
                    }else{
                        let modalContent = `
                            <div class="modal-header">
                                <div class="modal-title">Lanchonete - ${lanchonete.nome}
                                    <h5 class="modal-title fs-1">${item.titulo}</h5>
                                </div>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <img src="${item.imagem}"class="img-fluid mb-2 w-75 d-block mx-auto" style="max-width: 20rem;">
                                <p>${item.descricao}</p>
                                <p><strong>${item.quantidade}</strong> unidades disponíveis</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                                <button type="button" class="btn btn-primary">Adicionar ao Carrinho</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    ` 
                    document.getElementById("modalContent").innerHTML = modalContent
                    return;
                }
            }
        }
    }
}



/* document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (event) {
        if (event.target.closest("a[data-id]")) {
            const id = event.target.closest("a[data-id]").getAttribute("data-id");
            mostraDetalhes(id);
        }
    });
});

function mostraDetalhes (id){
    let dado = dados.find((dados) => dados.id == id)

    let lanchonete = dado.lanchonetes[i]

    let item = dado.lanchonete.itens[i]

    if (dado.semGluten == true && dado.semLactose == true){
        let item = dado.lanchonetes.itens
        let modalContent = `
            <div class="modal-header">
                <h5 class="modal-title">${item.titulo}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <img src="${item.imagem}"class="img-fluid mb-2">
                <p>${item.descricao}</p>
                <p><strong>${item.quantidade}</strong> unidades disponíveis</p>
                <div class="alert alert-success d-inline-block" role="alert">Produto sem Lactose e sem Gluten!</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary">Adicionar ao Carrinho</button>
                
                </div>
            </div>
        </div>
    </div>
    ` 
    document.getElementById("modalContent").innerHTML = modalContent
    
    
    }else if(dado.semLactose == true){
        let modalContent = `
            <div class="modal-header">
                <h5 class="modal-title">${item.titulo}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <img src="${item.imagem}"class="img-fluid mb-2">
                <p>${item.descricao}</p>
                <p><strong>${item.quantidade}</strong> unidades disponíveis</p>
                <div class="alert alert-success d-inline-block" role="alert">Produto sem Lactose!</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary">Adicionar ao Carrinho</button>
                </div>
            </div>
        </div>
    </div>
    ` 
    document.getElementById("modalContent").innerHTML = modalContent


    }else if(dado.semGluten == true){
        let modalContent = `
            <div class="modal-header">
                <h5 class="modal-title">${item.titulo}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <img src="${item.imagem}"class="img-fluid mb-2">
                <p>${item.descricao}</p>
                <p><strong>${item.quantidade}</strong> unidades disponíveis</p>
                <div class="alert alert-success d-inline-block" role="alert">Produto sem Gluten!</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary">Adicionar ao Carrinho</button>
                </div>
            </div>
        </div>
    </div>
    ` 
    document.getElementById("modalContent").innerHTML = modalContent
    }else{
        let modalContent = `
            <div class="modal-header">
                <h5 class="modal-title">${item.titulo}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <img src="${item.imagem}"class="img-fluid mb-2">
                <p>${item.descricao}</p>
                <p><strong>${item.quantidade}</strong> unidades disponíveis</p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" class="btn btn-primary">Adicionar ao Carrinho</button>
                </div>
            </div>
        </div>
    </div>
    ` 
    document.getElementById("modalContent").innerHTML = modalContent
    }
}

*/