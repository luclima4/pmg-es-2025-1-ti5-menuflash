// Arquivo: public/principal/js/index.js

document.addEventListener("DOMContentLoaded", () => {

    // --- LÓGICA DO CONTADOR DO CARRINHO ---

    const getUsuarioLogado = () => {
        try {
            const usuario = sessionStorage.getItem('usuarioLogado');
            return usuario ? JSON.parse(usuario) : null;
        } catch (e) {
            return null;
        }
    };
    
    const atualizarContadorCarrinho = async () => {
        const usuario = getUsuarioLogado();
        const contadorEl = document.querySelector('.carrinho-contador');

        if (!usuario || !contadorEl) {
            if (contadorEl) contadorEl.style.display = 'none';
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/carrinhos?userId=${usuario.id}`);
            const carrinhos = await response.json();
            const carrinho = carrinhos[0];

            if (carrinho && carrinho.itens.length > 0) {
                const totalItens = carrinho.itens.reduce((total, item) => total + item.quantidade, 0);
                contadorEl.textContent = totalItens;
                contadorEl.style.display = 'flex';
            } else {
                contadorEl.style.display = 'none';
            }
        } catch (error) {
            console.error("Erro ao atualizar contador do carrinho:", error);
            contadorEl.style.display = 'none';
        }
    };


    // --- LÓGICA DO MENU DE NAVEGAÇÃO ---

    const gerenciarLinksDoMenu = () => {
        const usuario = getUsuarioLogado();
        const linkPecaNovamente = document.getElementById('nav-peca-novamente');
        const linkAlterarLanchonete = document.getElementById('nav-alterar-lanchonete');

        if (usuario) {
            // Usuário está logado, links são funcionais
            if(linkPecaNovamente) linkPecaNovamente.style.display = 'block';
        } else {
            // Usuário não está logado, esconde ou desabilita links
            if(linkPecaNovamente) linkPecaNovamente.style.display = 'none';
        }

        // O link "Alterar Lanchonete" só deve aparecer se uma lanchonete já foi escolhida
        const lanchoneteAnterior = sessionStorage.getItem("lanchoneteAnterior");
        if (linkAlterarLanchonete) {
            if (lanchoneteAnterior) {
                linkAlterarLanchonete.style.display = 'block';
                // Define o link para voltar para a página do campus correto
                const campusAnterior = sessionStorage.getItem("campusAnterior");
                if (campusAnterior === "Coração Eucarístico") {
                    linkAlterarLanchonete.href = "campusCoreu.html";
                } else if (campusAnterior === "Contagem") {
                    linkAlterarLanchonete.href = "campusContagem.html";
                }
            } else {
                linkAlterarLanchonete.style.display = 'none';
            }
        }
    };
    

    // --- INICIALIZAÇÃO ---

    // Atualiza tudo quando a página carrega
    atualizarContadorCarrinho();
    gerenciarLinksDoMenu();

    // Adiciona um listener para atualizar o contador quando o carrinho mudar em outra aba
    window.addEventListener('cartUpdated', () => {
        console.log("Evento 'cartUpdated' recebido. Atualizando contador.");
        atualizarContadorCarrinho();
    });
});