fetch('http://localhost:3000/usuarios')
  .then(res => res.json())
  .then(usuarios => {
    const usuarioLogadoString = sessionStorage.getItem("usuarioLogado");

    if (!usuarioLogadoString) {
      document.getElementById('insereHistorico').innerHTML = `<p style="font-size: 20px;">Você não está logado.</p>`;
      console.error("Nenhum usuário encontrado no sessionStorage.");
      return;
    }

    const usuarioLogado = JSON.parse(usuarioLogadoString);
    const idLogado = usuarioLogado.id;

    const usuarioCompleto = usuarios.find(u => String(u.id) === String(idLogado));

    const historico = usuarioCompleto?.historico_de_pedidos || usuarioCompleto?.historico;

    if (usuarioCompleto && Array.isArray(historico) && historico.length > 0) {
      let pedidosHTML = '';

      let pedidos = historico.sort((a, b) => parseInt(b.pedido_id) - parseInt(a.pedido_id));

      function formatarData(dataString) {
        const partes = dataString.split("-");
        return `${partes[2]}/${partes[1]}/${partes[0].slice(2)}`;
      }

      pedidos.forEach(pedido => {
        const dataFormatada = formatarData(pedido.data);
        pedidosHTML += `
          <div class="card mb-3" style="max-width: 100%; border: solid 4px rgba(44, 62, 80, 0.25); border-radius: 10px; padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
            <div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">

              <div>
                <h5 class="card-title fw-bold">Pedido #${pedido.pedido_id}</h5>
                <p class="card-text mb-1"><strong>Data:</strong> ${dataFormatada} às ${pedido.hora}</p>
                <p class="card-text mb-1"><strong>Total:</strong> R$ ${pedido.total.toFixed(2).replace('.', ',')}</p>
                <p class="card-text mb-1"><strong>Status:</strong> ${pedido.status}</p>
                <p class="card-text"><strong>Pagamento:</strong> ${pedido.forma_pagamento}</p>
              </div>

              <div class="ms-md-4 w-100" style="max-width: 350px;">
                <h6 class="mb-2">Itens do Pedido:</h6>
                <ul class="list-group list-group-flush">
                  ${pedido.itens.map(item => `
                    <li class="list-group-item px-0 py-1 d-flex justify-content-between">
                      <span>${item.quantidade}x ${item.nome}</span>
                      <span>R$ ${item.subtotal.toFixed(2).replace('.', ',')}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>

            </div>
          </div>
        `;
      });
      document.getElementById("insereHistorico").innerHTML = pedidosHTML;
    } else {
      document.getElementById('insereHistorico').innerHTML = `<p style="font-size: 20px;">Seu histórico de pedidos está vazio.</p>`;
    }
  })
  .catch(error => {
    console.error("Erro ao buscar o histórico de usuários:", error);
    document.getElementById('insereHistorico').innerHTML = `<p class="text-danger">Não foi possível carregar o histórico. Tente novamente mais tarde.</p>`;
  });