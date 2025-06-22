async function getCarrinhoUsuario() {
  const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));
  if (!usuario) return null;
  const userId = usuario.usuario_id || usuario.id;

  const res = await fetch(`http://localhost:3000/carrinhos?userId=${userId}`);
  const dados = await res.json();
  return dados[0];
}

async function adicionarAoCarrinho(item) {
  const carrinho = await getCarrinhoUsuario();
  if (!carrinho) return;

  const itens = carrinho.itens || [];
  const existente = itens.find(i => i.id === item.id);

  if (existente) {
    existente.quantidade += 1;
  } else {
    itens.push({
      id: item.id,
      nome: item.titulo || item.nome || '',
      imagem: item.imagem || '',
      valor: item.preco_unitario || item.valor || 0,
      quantidade: 1
    });
  }

  await fetch(`http://localhost:3000/carrinhos/${carrinho.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carrinho)
  });

  window.dispatchEvent(new Event('cartUpdated'));
}

async function removerUnidadeDoCarrinho(item) {
  const carrinho = await getCarrinhoUsuario();
  if (!carrinho) return;

  const existente = carrinho.itens.find(i => i.id === item.id);
  if (existente) {
    existente.quantidade -= 1;
    if (existente.quantidade <= 0) {
      carrinho.itens = carrinho.itens.filter(i => i.id !== item.id);
    }
    await fetch(`http://localhost:3000/carrinhos/${carrinho.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(carrinho)
    });
    window.dispatchEvent(new Event('cartUpdated'));
  }
}
