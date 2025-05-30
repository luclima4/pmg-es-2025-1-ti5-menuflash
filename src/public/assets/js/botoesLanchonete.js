// LARISSA - Criação de Cards  

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, iniciando fetch...');
    fetch('http://localhost:3000/dados')
        .then(response => response.json())
        .then(dados => {
            criaBotoesLanchonete(dados.lanchonetes);
            console.log("botoes das dados recebidos:", dados.lanchonetes);
            console.log('fetch dados.js carregado');
        })
        .catch(error => console.error('Erro no fetch:', error));
});

function criaBotoesLanchonete(dados) {
    const botoes = document.getElementById('botoesLanchonete');
    botoes.innerHTML = '';

    dados.forEach(lanchonete => {
        const botao = document.createElement('button');
        botao.className = "btn btn-light m-1 p-3 align-items-center";
        botao.textContent = lanchonete.nome;
        botao.onclick = () => mostrarLanchonete(lanchonete.id);
        botoes.appendChild(botao);
    });

    const botaoTodas = document.createElement('button');
    botaoTodas.className = "btn btn-light m-1 p-3 align-items-center";
    botaoTodas.textContent = "Sem preferência";
    botaoTodas.onclick = () => mostrarLanchonete(0);
    botoes.appendChild(botaoTodas);
}

function mostrarLanchonete(id) {
    window.location.href = "/lanchonetes.html?id="+id;
}

// document.addEventListener('DOMContentLoaded', () => {
//     console.log('DOM carregado, iniciando fetch...');
//     fetch('http://localhost:3000/lanchonetes')
//         .then(response => response.json())
//         .then(lanchonetes => {
//             criaBotoesLanchonete({ lanchonetes });
//             console.log("botoes das lanchonetes recebidos:", lanchonetes);
//             console.log('fetch lanchonetes.js carregado');
//         })
// })

// function criaBotoesLanchonete(dados) {
//     const botoes = document.getElementById('botoesLanchonete');
//     botoes.innerHTML = '';

//     //botoes das lanchonetes
//     dados.lanchonetes.forEach(lanchonete => {
//         const botao = document.createElement('button');
//         botao.className = "btn btn-light m-1 p-3 align-items-center";
//         botao.textContent = lanchonete.nome;
//         botao.onclick = () => mostrarLanchonete(lanchonete.id);
//         botoes.appendChild(botao);
//     });

//     //botao "Sem preferência"
//     const botaoTodas = document.createElement('button');
//     botaoTodas.className = "btn btn-light m-1 p-3";
//     botaoTodas.textContent = "Sem preferência";
//     botaoTodas.onclick = () => mostrarLanchonete(0);
//     botoes.appendChild(botaoTodas);
// }

// function mostrarLanchonete(id) {

//     window.location.href = "/lanchonetes.html?id=" + id; //redirecionar a pagina

//     //descobrir qual é o id
//     // let params = new URLSearchParams(location.search);

//     // selecionarLanchonete(id);
// }

// document.addEventListener('DOMContentLoaded', criaBotoesLanchonete);

// function criaBotoesLanchonete() {
//   const botoes = document.getElementById('botoesLanchonete');
//   botoes.innerHTML = '';

//   fetch('http://localhost:3000/lanchonetes')
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('Erro ao buscar as lanchonetes');
//       }
//       return response.json();
//     })
//     .then(lanchonetes => {
//       // Botões das lanchonetes
//       lanchonetes.forEach(lanchonete => {
//         const botao = document.createElement('button'); // Corrigido: era 'botao'
//         botao.className = "btn btn-light m-1 p-3 align-items-center";
//         botao.textContent = lanchonete.nome;
//         botao.onclick = () => mostrarLanchonete(lanchonete.id);
//         botoes.appendChild(botao);
//       });

//       // Botão "Sem preferência"
//       const botaoTodas = document.createElement('button'); // Corrigido: era 'botao'
//       botaoTodas.className = "btn btn-light m-1 p-3";
//       botaoTodas.textContent = "Sem preferência";
//       botaoTodas.onclick = () => mostrarLanchonete(0);
//       botoes.appendChild(botaoTodas);
//     })
//     .catch(error => {
//       console.error('Erro ao carregar lanchonetes:', error);
//       botoes.innerHTML = '<p class="text-danger">Erro ao carregar lanchonetes.</p>';
//     });
// }

// function mostrarLanchonete(id) {
//   window.location.href = "/lanchonetes.html?id=" + id;
// }
