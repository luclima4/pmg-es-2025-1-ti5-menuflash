document.addEventListener("DOMContentLoaded", () => {

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
            const response = await fetch(`https://tiaw-json.vercel.app/carrinhos?userId=${usuario.id}`);
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
            if (contadorEl) contadorEl.style.display = 'none';
        }
    };

    const gerenciarLinksDoMenu = () => {
        const usuario = getUsuarioLogado();
        const linkPecaNovamente = document.getElementById('nav-peca-novamente');
        const linkAlterarLanchonete = document.getElementById('nav-alterar-lanchonete');

        // Mostra "Peça Novamente" apenas se o usuário estiver logado
        if (usuario && linkPecaNovamente) {
            linkPecaNovamente.style.display = 'block';
        }

        // Mostra "Alterar Lanchonete" apenas se uma lanchonete já foi visitada
        const lanchoneteAnterior = sessionStorage.getItem("lanchoneteAnterior");
        if (lanchoneteAnterior && linkAlterarLanchonete) {
            linkAlterarLanchonete.style.display = 'block';

            // Define o link para voltar para a página do campus correto
            const campusAnterior = sessionStorage.getItem("campusAnterior");
            if (campusAnterior === "Coração Eucarístico") {
                linkAlterarLanchonete.href = "campusCoreu.html";
            } else if (campusAnterior === "Contagem") {
                linkAlterarLanchonete.href = "campusContagem.html";
            }
        }
    };

    atualizarContadorCarrinho();
    gerenciarLinksDoMenu();

    window.addEventListener('cartUpdated', () => {
        atualizarContadorCarrinho();
    });

    // Faz os cards da página inicial serem clicáveis
    const linkCoreu = document.getElementById('link-campus-coreu');
    const linkContagem = document.getElementById('link-campus-contagem');

    if (linkCoreu && linkContagem) { 
        linkCoreu.addEventListener('click', () => {
            window.location.href = 'campusCoreu.html';
        });
        linkContagem.addEventListener('click', () => {
            window.location.href = 'campusContagem.html';
        });
    }
});