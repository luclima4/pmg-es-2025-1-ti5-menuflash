// Cadastro que leva os dados do usuário para o JSON

const apiURL_usuarios = '/usuarios'

let cadastroForm = document.getElementById('cadastroForm')

cadastroForm.addEventListener('submit', event => {
    event.preventDefault()

    const email = document.getElementById('inputEmail').value
    const senha = document.getElementById('inputSenha').value

    fetch(apiURL_usuarios)
        .then(res => res.json())
        .then(usuarios => {
            const usuarioExistente = usuarios.find(u => u.email === email)

            if (usuarioExistente) {
                alert('Este email já foi cadastrado!')
                return
            }

            let novoId = usuarios.length > 0 ? usuarios[usarios.length - 1].id + 1 : 1

            let cadastroUsuario = {
                id: novoId,
                nome: document.getElementById('inputNome').value,
                email: document.getElementById('inputEmail').value,
                senha: document.getElementById('inputSenha').value,
                tipo: document.querySelector('input[name="tipo"]:checked').value,
                historico: [],
            }

            fetch(apiURL_usuarios, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/ json'
                },
                body: JSON.stringify(cadastroUsuario),
            })
                .then(() => {
                    alert('Cadastro realizado com sucesso.')
                    window.location.href = "login.html"
                })

                .catch(error => {
                    console.log('Erro ao cadastrar usuário', error)
                })
        })
        .catch(error => {
            console.log('Erro ao obter usuários', error)
        })

})




