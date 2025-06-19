// // assets/js/botoesLanchonetes.js (CORRIGIDO)

// document.addEventListener('DOMContentLoaded', () => {
    
//     const apiUrl = 'http://localhost:3000/lanchonetes';
//     const botoesContainer = document.getElementById('botoesLanchonete');

//     if (!botoesContainer) {
//         console.error('Elemento #botoesLanchonete não encontrado na página.');
//         return;
//     }

//     async function criarLinksDeLanchonetes() {
//         try {
//             const response = await fetch(apiUrl);
//             const data = await response.json();
            
//             // --- PONTO DA CORREÇÃO ---
//             // A variável 'lanchonetes' agora recebe diretamente o 'data',
//             // pois o erro indica que 'data' já é o array que queremos.
//             const lanchonetes = data; 
            
//             // Verificação de segurança: garantimos que 'lanchonetes' é de fato um array.
//             if (!Array.isArray(lanchonetes)) {
//                 console.error("Os dados recebidos não são um array. Verifique o seu arquivo JSON.", lanchonetes);
//                 // Lançamos um erro para que ele seja pego pelo bloco catch.
//                 throw new Error("Formato de dados inválido."); 
//             }

//             lanchonetes.forEach(lanchonete => {
//                 const link = document.createElement('a');
//                 link.href = `criaCards.html?id=${lanchonete.id}`;
//                 link.className = 'btn btn-light btn-lg';
//                 link.textContent = lanchonete.nome;
//                 botoesContainer.appendChild(link);
//             });

//         } catch (error) {
//             console.error('Falha ao criar links das lanchonetes:', error);
//             botoesContainer.innerHTML = '<p class="text-white">Não foi possível carregar as lanchonetes.</p>';
//         }
//     }

//     criarLinksDeLanchonetes();
// });


document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000/lanchonetes';
    const botoesContainer = document.getElementById('botoesLanchonete');

    if (!botoesContainer) {
        console.error('Elemento #botoesLanchonete não encontrado na página.');
        return;
    }

    async function criarBotoesDeLanchonetes() {
        try {
            const response = await fetch(apiUrl);
            const lanchonetes = await response.json();

            if (!Array.isArray(lanchonetes)) {
                console.error("Os dados recebidos não são um array.", lanchonetes);
                throw new Error("Formato de dados inválido.");
            }

            // Botões das lanchonetes
            lanchonetes.forEach(lanchonete => {
                const btn = document.createElement('button');
                btn.textContent = lanchonete.nome;
                btn.className = 'btn btn-light btn-lg m-1';
                btn.onclick = () => {
                    window.location.href = `criaCards.html?id=${lanchonete.id}`;
                };
                botoesContainer.appendChild(btn);
            });

            // Botão "Ver todos"
            const btnTodos = document.createElement('button');
            btnTodos.textContent = 'Sem preferência';
            btnTodos.className = 'btn btn-light btn-lg m-1';
            btnTodos.onclick = () => {
                window.location.href = 'criaCards.html?id=0';
            };
            botoesContainer.appendChild(btnTodos);

        } catch (error) {
            console.error('Falha ao criar botões das lanchonetes:', error);
            botoesContainer.innerHTML = '<p class="text-white">Não foi possível carregar as lanchonetes.</p>';
        }
    }

    criarBotoesDeLanchonetes();
});

