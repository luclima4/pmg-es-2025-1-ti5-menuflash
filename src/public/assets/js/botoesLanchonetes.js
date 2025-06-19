// assets/js/botoesLanchonetes.js (CORRIGIDO)

document.addEventListener('DOMContentLoaded', () => {
    
    const apiUrl = 'http://localhost:3000/lanchonetes';
    const botoesContainer = document.getElementById('botoesLanchonete');

    if (!botoesContainer) {
        console.error('Elemento #botoesLanchonete não encontrado na página.');
        return;
    }

    async function criarLinksDeLanchonetes() {
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            
            // --- PONTO DA CORREÇÃO ---
            // A variável 'lanchonetes' agora recebe diretamente o 'data',
            // pois o erro indica que 'data' já é o array que queremos.
            const lanchonetes = data; 
            
            // Verificação de segurança: garantimos que 'lanchonetes' é de fato um array.
            if (!Array.isArray(lanchonetes)) {
                console.error("Os dados recebidos não são um array. Verifique o seu arquivo JSON.", lanchonetes);
                // Lançamos um erro para que ele seja pego pelo bloco catch.
                throw new Error("Formato de dados inválido."); 
            }

            lanchonetes.forEach(lanchonete => {
                const link = document.createElement('a');
                link.href = `criaCards.html?id=${lanchonete.id}`;
                link.className = 'btn btn-light btn-lg';
                link.textContent = lanchonete.nome;
                botoesContainer.appendChild(link);
            });

        } catch (error) {
            console.error('Falha ao criar links das lanchonetes:', error);
            botoesContainer.innerHTML = '<p class="text-white">Não foi possível carregar as lanchonetes.</p>';
        }
    }

    criarLinksDeLanchonetes();
});

