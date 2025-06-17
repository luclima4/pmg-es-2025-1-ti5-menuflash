fetch('http://localhost:3000/usuarios')
  .then(res => res.json())
  .then(usuarios => {


    // Procura pelo usuário com id logado
    const idLogado = localStorage.getItem("id_usuario_logado")

    const usuario = usuarios.find(u => u.id === idLogado);

    if ( usuario && Array.isArray(usuario.historico_de_pedidos) && usuario.historico_de_pedidos.length > 0) {
      let pedidosHTML = ''

      let pedidos = usuario.historico_de_pedidos.sort((a, b) => b.pedido_id - a.pedido_id);

      function formatarData(dataString) {
        const partes = dataString.split("-");
        return `${partes[2]}/${partes[1]}/${partes[0].slice(2)}`; 
      }

      pedidos.forEach(pedido => {
        const dataFormatada = formatarData(pedido.data)
        pedidosHTML += `
          <div class="card mb-3 style="max-width: 100%; border: double 4px #2c3e50; border-radius: 10px; padding: 20px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
            <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">

              <div>
                <h5 class="card-title">Pedido #${pedido.pedido_id}</h5>
                <p class="card-text mb-1"><strong>Data:</strong> ${dataFormatada} às ${pedido.hora}</p>
                <p class="card-text mb-1"><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>
                <p class="card-text mb-1"><strong>Status:</strong> ${pedido.status}</p>
                <p class="card-text"><strong>Pagamento:</strong> ${pedido.forma_pagamento}</p>
              </div>

              <div class="ms-md-4">
                <h6 class="mb-2">Itens:</h6>
                <ul class="list-group list-group-flush">
                  ${pedido.itens.map(item => `
                    <li class="list-group-item px-0 py-1">${item.quantidade}x ${item.nome} - R$ ${item.subtotal.toFixed(2)}</li>`).join('')}
                </ul>
              </div>

            </div>
          </div>
        `
      })
      document.getElementById("insereHistorico").innerHTML = pedidosHTML
    }else {
      document.getElementById('insereHistorico').innerHTML = `<p style="font-size: 20px;">Histórico vazio.</p>`;
    }
  })