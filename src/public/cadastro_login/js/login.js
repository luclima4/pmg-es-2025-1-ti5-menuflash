// Arquivo: cadastro_login/js/login.js
// Versão corrigida, mais segura e eficiente.

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const email = document.getElementById('inputEmail').value;
        const senha = document.getElementById('inputSenha').value;

        if (!email || !senha) {
            return alert('Por favor, preencha todos os campos.');
        }

        try {
            // Pede ao servidor para encontrar um usuário com este email E esta senha
            const response = await fetch(`https://tiaw-json.vercel.app/usuarios?email=${email}&senha=${senha}`);
            if (!response.ok) throw new Error("Erro de rede.");
            
            const usuariosEncontrados = await response.json();

            if (usuariosEncontrados.length > 0) {
                // Login bem-sucedido!
                const usuarioCompleto = usuariosEncontrados[0]; // O primeiro resultado é o nosso usuário

                // AQUI ESTÁ A CORREÇÃO: Salva o objeto COMPLETO (com ID) na sessão.
                sessionStorage.setItem('usuarioLogado', JSON.stringify(usuarioCompleto));
                
                alert(`Bem-vindo(a), ${usuarioCompleto.nome}!`);

                // Verifica se há uma URL de redirecionamento para voltar à página anterior
                const params = new URLSearchParams(window.location.search);
                const redirectUrl = params.get('redirectUrl');

                // Redireciona para a página anterior ou para a página principal
                window.location.href = redirectUrl || '/index.html';

            } else {
                // Login falhou
                alert('Email ou senha inválidos.');
            }
        } catch (error) {
            console.error('Erro ao tentar fazer login:', error);
            alert('Ocorreu um erro no servidor. Tente novamente.');
        }
    });
});