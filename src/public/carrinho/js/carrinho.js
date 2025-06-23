// Dentro de ../carrinho/js/carrinhoUtils.js

async function getCarrinhoUsuario() {
  const usuario = JSON.parse(sessionStorage.getItem('usuarioLogado'));
  if (!usuario) return { itens: [] };
  const userId = usuario.usuario_id || usuario.id;
  const resp = await fetch(`http://localhost:3000/carrinhos?userId=${userId}`);
  const arr = await resp.json();
  return arr[0] ?? { id: null, itens: [] };
}

async function adicionarAoCarrinho(item) {
  const carrinho = await getCarrinhoUsuario();
  if (!carrinho.id) return;
  const existing = carrinho.itens.find(i => i.id === item.id);
  if (existing) existing.quantidade++;
  else carrinho.itens.push({
    id: item.id,
    nome: item.titulo || item.nome || 'Sem nome',
    imagem: item.imagem || '',
    valor: item.preco_unitario || item.valor || 0,
    quantidade: 1
  });
  await fetch(`http://localhost:3000/carrinhos/${carrinho.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(carrinho)
  });
  window.dispatchEvent(new Event('cartUpdated'));
}

async function removerUnidadeDoCarrinho(item) {
  const carrinho = await getCarrinhoUsuario();
  if (!carrinho.id) return;
  const existente = carrinho.itens.find(i => i.id === item.id);
  if (!existente) return;
  existente.quantidade--;
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
