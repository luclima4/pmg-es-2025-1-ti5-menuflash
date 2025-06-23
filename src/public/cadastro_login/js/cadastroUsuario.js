// Arquivo: cadastro_login/js/cadastroUsuario.js
// Garanta que seu arquivo esteja assim.

document.addEventListener('DOMContentLoaded', () => {
    const cadastroForm = document.getElementById('cadastroForm');
    if (!cadastroForm) return;

    cadastroForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (!cadastroForm.checkValidity()) {
            return cadastroForm.reportValidity();
        }

        const email = document.getElementById('inputEmail').value;
        const senha = document.getElementById('inputSenha').value;
        const nome = document.getElementById('inputNome').value;

        if (senha.length < 6) {
            return alert('A senha deve ter no mínimo 6 caracteres.');
        }
        
        try {
            const response = await fetch(`http://localhost:3000/usuarios?email=${email}`);
            const usuariosExistentes = await response.json();

            if (usuariosExistentes.length > 0) {
                return alert('Este email já foi cadastrado!');
            }

            const novoUsuario = {
                nome,
                email,
                senha,
                tipo: "padrão",
                favoritos: [],
                historico_de_pedidos: []
            };

            const createResponse = await fetch('http://localhost:3000/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoUsuario),
            });

            if (!createResponse.ok) throw new Error("Não foi possível realizar o cadastro.");

            alert('Cadastro realizado com sucesso! Você será redirecionado para a tela de login.');
            window.location.href = "login.html";

        } catch (error) {
            console.error('Erro no processo de cadastro:', error);
            alert('Ocorreu um erro durante o cadastro. Tente novamente.');
        }
    });
    // ... (resto da lógica de alerta de senha, se houver)
});