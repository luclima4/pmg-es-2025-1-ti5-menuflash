//LARISSA - botões de escolher a lanchonete

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, iniciando fetch...');
    fetch('http://localhost:3000/lanchonetes')
        .then(response => response.json())
        .then(lanchonetes => {
            criaBotoesLanchonete(lanchonetes);
            console.log("botoes das dados recebidos:", lanchonetes);
            console.log('fetch dados.js carregado');
        })
        .catch(error => console.error('Erro no fetch:', error));
});

function criaBotoesLanchonete(lanchonetes) {
    const botoes = document.getElementById('botoesLanchonete');
    botoes.innerHTML = '';

    lanchonetes.forEach(lanchonete => {
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
    window.location.href = "/criaCards.html?id=" + id;
}