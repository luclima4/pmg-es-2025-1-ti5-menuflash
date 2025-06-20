// document.addEventListener('DOMContentLoaded', () => {
//     console.log('DOM da página de cards carregado, iniciando a busca...');

//     const params = new URLSearchParams(window.location.search);
//     const idLanchonete = params.get('id');

//     const cardsContainer = document.getElementById('divCards');

//     if (!idLanchonete) {
//         console.error("Nenhum ID de lanchonete foi fornecido na URL.");
//         return;
//     }

//     fetch('http://localhost:3000/lanchonetes')
//         .then(response => response.json())
//         .then(data => {
            
//             // --- PONTO DA CORREÇÃO ---
//             // Assim como no outro arquivo, 'lanchonetes' recebe diretamente o 'data',
//             // pois 'data' já é o array que precisamos.
//             const lanchonetes = data;
            
//             console.log('Dados recebidos:', lanchonetes); // Agora isso deve imprimir o array corretamente!

//             // Verificação de segurança
//             if (!Array.isArray(lanchonetes)) {
//                 console.error("Os dados recebidos não são um array.", lanchonetes);
//                 throw new Error("Formato de dados inválido.");
//             }
            
//             const lanchoneteSelecionada = lanchonetes.find(lanchonete => lanchonete.id == idLanchonete);

//             console.log('Lanchonete selecionada:', lanchoneteSelecionada);

//             if (!lanchoneteSelecionada) {
//                 cardsContainer.innerHTML = `<p class="text-white">Lanchonete com ID ${idLanchonete} não encontrada.</p>`;
//                 return;
//             }

//             cardsContainer.innerHTML = ''; 

//             lanchoneteSelecionada.itens.forEach(item => {
//                 const estiloIndisponivel = !item.disponivel ? 'style="filter: opacity(40%);"' : '';
//                 const botaoDesabilitado = !item.disponivel ? 'disabled' : '';
                
//                 const cardHTML = `
//                     <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
//                         <div class="card h-100 w-100 shadow-sm" ${estiloIndisponivel}>
//                             <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
//                                 <img src="${item.imagem}" class="card-img-top" alt="${item.titulo}">
//                             </a>
//                             <div class="card-body text-center d-flex flex-column">
//                                 <h5 class="card-title">${item.titulo}</h5>
//                                 <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
//                                     <span class="fw-bold">${item.valor}</span>
//                                     <button ${botaoDesabilitado} type="button" class="btn btn-outline-secondary btn-sm">Adicionar ao carrinho</button>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 `;
                
//                 cardsContainer.innerHTML += cardHTML;
//             });
//         })
//         .catch(error => {
//             console.error('Erro ao buscar ou processar os dados:', error);
//             cardsContainer.innerHTML = '<p class="text-white">Ocorreu um erro ao carregar o cardápio.</p>';
//         });
// });


// document.addEventListener('DOMContentLoaded', () => {
//     console.log('DOM da página de cards carregado, iniciando a busca...');

//     const params = new URLSearchParams(window.location.search);
//     const idLanchonete = params.get('id');

//     const cardsContainer = document.getElementById('divCards');

//     if (!idLanchonete) {
//         console.error("Nenhum ID de lanchonete foi fornecido na URL.");
//         return;
//     }

//     fetch('http://localhost:3000/lanchonetes')
//         .then(response => response.json())
//         .then(data => {
//             const lanchonetes = data;

//             if (!Array.isArray(lanchonetes)) {
//                 console.error("Os dados recebidos não são um array.", lanchonetes);
//                 throw new Error("Formato de dados inválido.");
//             }

//             cardsContainer.innerHTML = '';

//             if (idLanchonete == 0) {
//                 // Mostrar todos os itens de todas as lanchonetes
//                 lanchonetes.forEach(lanchonete => {
//                     cardsContainer.innerHTML += `<h2 class="text-white pt-4 mt-4 mb-2">${lanchonete.nome}</h2>`; 

//                     lanchonete.itens.forEach(item => {
//                         const estiloIndisponivel = !item.disponivel ? 'style="filter: opacity(40%);"' : '';
//                         const botaoDesabilitado = !item.disponivel ? 'disabled' : '';

//                         const cardHTML = `
//                             <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
//                                 <div class="card h-100 w-100 shadow-sm" ${estiloIndisponivel}>
//                                     <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
//                                         <img src="${item.imagem}" class="card-img-top" alt="${item.titulo}">
//                                     </a>
//                                     <div class="card-body text-center d-flex flex-column">
//                                         <h5 class="card-title">${item.titulo}</h5>
//                                         <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
//                                             <span class="fw-bold">${item.valor}</span>
//                                             <button ${botaoDesabilitado} type="button" class="btn btn-outline-secondary btn-sm">Adicionar ao carrinho</button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         `;
//                         cardsContainer.innerHTML += cardHTML;
//                     });
//                 });
//             } else {
//                 // Mostrar apenas os itens da lanchonete selecionada
//                 const lanchoneteSelecionada = lanchonetes.find(l => l.id == idLanchonete);

//                 console.log('Lanchonete selecionada:', lanchoneteSelecionada);

//                 if (!lanchoneteSelecionada) {
//                     cardsContainer.innerHTML = `<p class="text-white">Lanchonete com ID ${idLanchonete} não encontrada.</p>`;
//                     return;
//                 }

//                 lanchoneteSelecionada.itens.forEach(item => {
//                     const estiloIndisponivel = !item.disponivel ? 'style="filter: opacity(40%);"' : '';
//                     const botaoDesabilitado = !item.disponivel ? 'disabled' : '';

//                     const cardHTML = `
//                         <div class="m-0 p-1 mt-2 col-md-3 col-sm-6 col-xs-8 d-flex">
//                             <div class="card h-100 w-100 shadow-sm" ${estiloIndisponivel}>
//                                 <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
//                                     <img src="${item.imagem}" class="card-img-top" alt="${item.titulo}">
//                                 </a>
//                                 <div class="card-body text-center d-flex flex-column">
//                                     <h5 class="card-title">${item.titulo}</h5>
//                                     <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
//                                         <span class="fw-bold">${item.valor}</span>
//                                         <button ${botaoDesabilitado} type="button" class="btn btn-outline-secondary btn-sm">Adicionar ao carrinho</button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     `;
//                     cardsContainer.innerHTML += cardHTML;
//                 });
//             }

//         })
//         .catch(error => {
//             console.error('Erro ao buscar ou processar os dados:', error);
//             cardsContainer.innerHTML = '<p class="text-white">Ocorreu um erro ao carregar o cardápio.</p>';
//         });
// });


document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const idLanchonete = params.get('id');
    const campusSelecionado = params.get('campus'); // <== novo

    const cardsContainer = document.getElementById('divCards');

    fetch('http://localhost:3000/lanchonetes')
        .then(response => response.json())
        .then(data => {
            const lanchonetes = data;

            if (!Array.isArray(lanchonetes)) {
                throw new Error("Formato de dados inválido.");
            }

            cardsContainer.innerHTML = '';

            if (idLanchonete == 0 && campusSelecionado) {
                // Filtrar todas do campus selecionado
                const lanchonetesDoCampus = lanchonetes.filter(l => l.campus === campusSelecionado);

                if (lanchonetesDoCampus.length === 0) {
                    cardsContainer.innerHTML = `<p class="text-white">Nenhuma lanchonete encontrada para o campus ${campusSelecionado}.</p>`;
                    return;
                }

                lanchonetesDoCampus.forEach(lanchonete => {
                    // Título da lanchonete
                    const titulo = document.createElement("h2");
                    titulo.className = "text-white text-center mb-4 mt-4 w-100";
                    titulo.textContent = lanchonete.nome;
                    cardsContainer.appendChild(titulo);

                    lanchonete.itens.forEach(item => {
                        const estiloIndisponivel = !item.disponivel ? 'style="filter: opacity(60%);"' : '';
                        const botaoDesabilitado = !item.disponivel ? 'disabled' : '';

                        const cardHTML = `
                            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
                            <div class="card h-100 w-100 shadow-sm" ${estiloIndisponivel}>
                                <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
                                <img src="${item.imagem}" class="card-img-top p-2" alt="${item.titulo}" style="height: 300px; object-fit: contain;">
                                </a>
                                <div class="card-body text-center d-flex flex-column">
                                <h5 class="card-title text-truncate">${item.titulo}</h5>
                                <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
                                    <span class="fw-bold small">${item.valor}</span>
                                    <button ${botaoDesabilitado} type="button" class="btn btn-outline-secondary btn-sm">Adicionar</button>
                                </div>
                                </div>
                            </div>
                            </div>
                        `;

                        cardsContainer.innerHTML += cardHTML;
                    });
                });

            } else {
                // Modo normal: mostrar uma única lanchonete
                const lanchoneteSelecionada = lanchonetes.find(l => l.id == idLanchonete);

                const titulo = document.createElement("h3");
                titulo.className = "text-white mt-4 w-100";
                titulo.textContent = lanchoneteSelecionada.nome;
                cardsContainer.appendChild(titulo);

                lanchoneteSelecionada.itens.forEach(item => {
                    const estiloIndisponivel = !item.disponivel ? 'style="filter: opacity(60%);"' : '';
                    const botaoDesabilitado = !item.disponivel ? 'disabled' : '';

                    const cardHTML = `
                        <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4 d-flex">
                            <div class="card h-100 w-100 shadow-sm" ${estiloIndisponivel}>
                                <a href="#" data-bs-toggle="modal" data-bs-target="#modalExemplo" data-id="${item.id}">
                                <img src="${item.imagem}" class="card-img-top p-2" alt="${item.titulo}" style="height: 300px; object-fit: contain;">
                                </a>
                                <div class="card-body text-center d-flex flex-column">
                                <h5 class="card-title text-truncate">${item.titulo}</h5>
                                <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
                                    <span class="fw-bold small">${item.valor}</span>
                                    <button ${botaoDesabilitado} type="button" class="btn btn-outline-secondary btn-sm">Adicionar</button>
                                </div>
                                </div>
                            </div>
                            </div>
                    `;

                    cardsContainer.innerHTML += cardHTML;
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar ou processar os dados:', error);
        });
});