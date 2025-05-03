// Entender isso
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (event) {
        if (event.target.closest("a[data-id]")) {
            const id = event.target.closest("a[data-id]").getAttribute("data-id");
            mostraDetalhes(id);
        }
    });
});

function mostraDetalhes (id){
    let dado = dados.find((item) => item.id == id)
    if (dado.semGluten == true && dado.semLactose == true){
        let modalContent = `
            <div class="modal-header">
                <h5 class="modal-title">${dado.titulo}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <img src="${dado.imagem}"class="img-fluid mb-2">
                <p>${dado.descricao}</p>
                <p><strong>${dado.quantidade}</strong> unidades disponíveis</p>
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
                <h5 class="modal-title">${dado.titulo}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <img src="${dado.imagem}"class="img-fluid mb-2">
                <p>${dado.descricao}</p>
                <p><strong>${dado.quantidade}</strong> unidades disponíveis</p>
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
                <h5 class="modal-title">${dado.titulo}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <img src="${dado.imagem}"class="img-fluid mb-2">
                <p>${dado.descricao}</p>
                <p><strong>${dado.quantidade}</strong> unidades disponíveis</p>
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
                <h5 class="modal-title">${dado.titulo}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <img src="${dado.imagem}"class="img-fluid mb-2">
                <p>${dado.descricao}</p>
                <p><strong>${dado.quantidade}</strong> unidades disponíveis</p>
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