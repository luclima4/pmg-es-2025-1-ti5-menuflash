// Função verificar se usuário esta logado, e inserir elemento correspondente com o tipo de usuário

// Ver se o usuario esta logado 
    // Verifica se há um usuário logado no sessionStorage
  let usuario = null;
  function checarUsuarioLogado() {
    const usuarioLogadoStr = sessionStorage.getItem('usuarioLogado');
    if (!usuarioLogadoStr) return false;
    usuario = JSON.parse(usuarioLogadoStr);
    return true;
  }

  // Desloga o usuário e volta para a tela de login (sem redirectUrl)
  function sairUsuario(event) {
    event.preventDefault();
    sessionStorage.removeItem('usuarioLogado');
    window.location.href = "cadastro_login/login.html";
  }

  // Gera os links no cabeçalho assim que a página carrega
  window.onload = () => {
    const linksContainer = document.querySelector('#linksDoUsuario');
    let linksHTML = '';

    // Prepara o redirectParam para levar o usuário de volta à página atual
    const redirectParam = encodeURIComponent(window.location.href);
    const loginHref = `../cadastro_login/login.html?redirectUrl=${redirectParam}`;

    if (checarUsuarioLogado()) {
      // Se já está logado
      if (usuario.tipo === 'administrador') {
        linksHTML = `
          <ul class="navbar-nav d-flex flex-row gap-4 align-items-center">
            <li class="nav-item">
              <a class="nav-link fs-5" href="../cadastro_de_itens/cadastroDeItens.html">Cadastro de Itens</a>
            </li>
            <li class="nav-item">
              <a class="nav-link fs-5" href="../perfil/perfil.html">Perfil</a>
            </li>
            <li class="nav-item">
              <a id="sairLink" class="nav-link fs-5" href="../cadastro_login/login.html">Sair</a>
            </li>
          </ul>
        `;
      } else {
        linksHTML = `
          <ul class="navbar-nav d-flex flex-row gap-4 align-items-center">
            <li class="nav-item">
              <a class="nav-link fs-5" href="../perfil/perfil.html">Perfil</a>
            </li>
            <li class="nav-item">
              <a id="sairLink" class="nav-link fs-5" href="../cadastro_login/login.html">Sair</a>
            </li>
          </ul>
        `;
      }
    } else {
      // Usuário deslogado: link de Entrar com redirectUrl
      linksHTML = `
        <ul class="navbar-nav d-flex flex-row gap-4 align-items-center">
          <li class="nav-item">
            <a class="nav-link fs-5" href="${loginHref}">Entrar</a>
          </li>
          <li class="nav-item">
            <a class="nav-link fs-5" href="../cadastro_login/cadastroUsuario.html">Cadastre-se</a>
          </li>
        </ul>
      `;
    }

    if (linksContainer) {
      linksContainer.innerHTML = linksHTML;
    }

    // Se estiver logado, liga o evento de saída
    if (checarUsuarioLogado()) {
      const sairLink = document.querySelector('#sairLink');
      if (sairLink) {
        sairLink.addEventListener('click', sairUsuario);
      }
    }
  };