// Arquivo: cadastro_login/js/inserirLogin.js
// Versão completa e final com link dinâmico para administradores.

document.addEventListener("DOMContentLoaded", () => {
    // Encontra o container do menu dropdown na barra de navegação
    const menuDropdown = document.getElementById("menu-dropdown-usuario");

    // Se o container do menu não for encontrado na página, não faz nada.
    if (!menuDropdown) {
        return;
    }

    // Verifica se há um usuário logado na sessionStorage
    const usuarioLogadoJSON = sessionStorage.getItem('usuarioLogado');
    let menuHTML = '';

    if (usuarioLogadoJSON) {
        // --- CASO 1: Usuário está LOGADO ---
        const usuario = JSON.parse(usuarioLogadoJSON);
        let adminLink = ''; // Prepara uma variável para o link do admin

        // Verifica se o usuário é do tipo 'administrador'
        if (usuario.tipo === 'administrador') {
            adminLink = `
                <li>
                    <a class="dropdown-item text-white" href="../cadastro_de_itens/cadastroDeItens.html">
                        <i class="fas fa-edit me-2"></i> Gerenciar Itens
                    </a>
                </li>
            `;
        }

        // Cria os links padrão para todos os usuários logados
        menuHTML = `
            <li>
                <a class="dropdown-item text-white" href="../Perfil/perfil.html">
                    <i class="fas fa-user-circle me-2"></i> Perfil (${usuario.nome})
                </a>
            </li>
            ${adminLink} <li><hr class="dropdown-divider" style="border-color: rgba(255,255,255,0.3);"></li>
            <li>
                <a id="btn-sair" class="dropdown-item text-white" href="#">
                    <i class="fas fa-sign-out-alt me-2"></i> Sair
                </a>
            </li>
        `;
        
    } else {
        // --- CASO 2: Usuário está DESLOGADO ---
        // Cria o link de Login
        menuHTML = `
            <li>
                <a class="dropdown-item text-white" href="../cadastro_login/login.html">
                    <i class="fas fa-sign-in-alt me-2"></i> Entrar
                </a>
            </li>
        `;
    }

    // Insere o HTML gerado dentro do menu
    menuDropdown.innerHTML = menuHTML;

    // Adiciona a funcionalidade de clique ao botão "Sair", se ele existir
    const btnSair = document.getElementById('btn-sair');
    if (btnSair) {
        btnSair.addEventListener('click', (e) => {
            e.preventDefault(); // Impede que o link mude a URL
            if (confirm("Tem certeza que deseja sair?")) {
                sessionStorage.removeItem('usuarioLogado');
                // Redireciona para a página inicial após o logout
                window.location.href = '/index.html'; 
            }
        });
    }

    // Lógica para adicionar redirectUrl ao link de login
    const linkParaLogin = menuDropdown.querySelector('a[href*="login.html"]');
    if (linkParaLogin) {
        const urlAtual = window.location.href;
        // Evita adicionar o redirectUrl se já estiver na página de login
        if(!urlAtual.includes('login.html')) {
            linkParaLogin.href += `?redirectUrl=${encodeURIComponent(urlAtual)}`;
        }
    }
});