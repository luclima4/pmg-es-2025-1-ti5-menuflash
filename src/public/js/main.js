// Arquivo: public/js/main.js
// Lógica global para todas as páginas do site.

document.addEventListener("DOMContentLoaded", () => {
    console.log("Script global main.js carregado.");

    // --- FUNÇÃO PARA PEGAR O USUÁRIO LOGADO (USADA POR OUTRAS FUNÇÕES) ---
    const getUsuarioLogado = () => {
        try {
            const usuario = sessionStorage.getItem('usuarioLogado');
            return usuario ? JSON.parse(usuario) : null;
        } catch (e) {
            console.error("Erro ao ler usuário do sessionStorage:", e);
            return null;
        }
    };
    
    // --- LÓGICA DO CONTADOR DO CARRINHO ---
    const atualizarContadorCarrinho = async () => {
        const usuario = getUsuarioLogado();
        const contadorEl = document.querySelector('.carrinho-contador');

        if (!usuario || !contadorEl) {
            if (contadorEl) contadorEl.style.display = 'none';
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/carrinhos?userId=${usuario.id}`);
            if (!response.ok) {
                // Se a busca falhar, esconde o contador para evitar mostrar um número errado.
                contadorEl.style.display = 'none';
                return;
            }

            const carrinhos = await response.json();
            const carrinho = carrinhos[0];

            if (carrinho && carrinho.itens && carrinho.itens.length > 0) {
                const totalItens = carrinho.itens.reduce((total, item) => total + item.quantidade, 0);
                contadorEl.textContent = totalItens;
                contadorEl.style.display = 'flex';
            } else {
                contadorEl.style.display = 'none';
            }
        } catch (error) {
            console.error("Erro ao atualizar contador do carrinho:", error);
            if(contadorEl) contadorEl.style.display = 'none';
        }
    };

    // --- LÓGICA DOS LINKS DINÂMICOS DO MENU ---
    const gerenciarLinksDoMenu = () => {
        const usuario = getUsuarioLogado();
        const linkPecaNovamente = document.getElementById('nav-peca-novamente');
        const linkAlterarLanchonete = document.getElementById('nav-alterar-lanchonete');

        // Mostra "Peça Novamente" apenas se o usuário estiver logado
        if (usuario && linkPecaNovamente) {
            linkPecaNovamente.style.display = 'block';
        } else if (linkPecaNovamente) {
            linkPecaNovamente.style.display = 'none';
        }

        // Mostra "Alterar Lanchonete" apenas se uma lanchonete já foi visitada nesta sessão
        const lanchoneteAnterior = sessionStorage.getItem("lanchoneteAnterior");
        if (lanchoneteAnterior && linkAlterarLanchonete) {
            linkAlterarLanchonete.style.display = 'block';
            
            const campusAnterior = sessionStorage.getItem("campusAnterior");
            if (campusAnterior === "Coração Eucarístico") {
                linkAlterarLanchonete.href = "campusCoreu.html";
            } else if (campusAnterior === "Contagem") {
                linkAlterarLanchonete.href = "campusContagem.html";
            }
        } else if (linkAlterarLanchonete) {
            linkAlterarLanchonete.style.display = 'none';
        }
    };
    
    // --- INICIALIZAÇÃO E EVENTOS GLOBAIS ---

    // Executa as funções quando a página carrega
    gerenciarLinksDoMenu();
    atualizarContadorCarrinho();

    // Ouve o evento 'cartUpdated' que disparamos nos outros scripts (criaCards.js, modal.js)
    // para atualizar o contador em tempo real, sem precisar recarregar a página.
    window.addEventListener('cartUpdated', () => {
        console.log("Evento 'cartUpdated' recebido no main.js. Atualizando contador.");
        atualizarContadorCarrinho();
    });
});