document.addEventListener('DOMContentLoaded', () => {
  const apiUrl = 'http://localhost:3000/lanchonetes';
  const botoesContainer = document.getElementById('botoesLanchonete');

  if (!botoesContainer) {
    console.error('Elemento #botoesLanchonete não encontrado na página.');
    return;
  }

  // Detectar o campus atual com base no nome do arquivo da URL
  const caminhoPagina = window.location.pathname.toLowerCase();
  let campusAtual = "";

  if (caminhoPagina.includes("coreu")) {
    campusAtual = "Coração Eucarístico";
  } else if (caminhoPagina.includes("contagem")) {
    campusAtual = "Contagem";
  } else {
    console.warn("Campus não identificado na URL.");
  }

  async function criarBotoesDeLanchonetes() {
    try {
      const response = await fetch(apiUrl);
      const lanchonetes = await response.json();

      if (!Array.isArray(lanchonetes)) {
        throw new Error("Formato de dados inválido.");
      }

      // Filtro por campus
      const lanchonetesFiltradas = lanchonetes.filter(
        l => l.campus === campusAtual
      );

      // Criar os botões das lanchonetes
      if (lanchonetesFiltradas.length > 0) {
        lanchonetesFiltradas.forEach(lanchonete => {
          const btn = document.createElement('button');
          btn.textContent = lanchonete.nome;
          btn.className = 'btn btn-light btn-lg m-1 shadow';
          btn.style.border = '1px solid #ccc';

          btn.onclick = () => {
            sessionStorage.setItem("campusAnterior", campusAtual);
            sessionStorage.setItem("lanchoneteAnterior", lanchonete.id);
            window.location.href = `criaCards.html?id=${lanchonete.id}&campus=${encodeURIComponent(campusAtual)}`;
          };

          botoesContainer.appendChild(btn);
        });
      } else {
        botoesContainer.innerHTML = '<p class="text-white">Nenhuma lanchonete encontrada neste campus.</p>';
      }

      // Botão "Sem preferência"
      const btnTodos = document.createElement('button');
      btnTodos.textContent = 'Sem preferência';
      btnTodos.className = 'btn btn-light btn-lg m-1 shadow';
      btnTodos.style.border = '1px solid #ccc';
      btnTodos.onclick = () => {
        sessionStorage.setItem("campusAnterior", campusAtual);
        sessionStorage.setItem("lanchoneteAnterior", "0");
        window.location.href = `criaCards.html?id=0&campus=${encodeURIComponent(campusAtual)}`;
      };
      botoesContainer.appendChild(btnTodos);

    } catch (error) {
      console.error('Falha ao criar botões das lanchonetes:', error);
      botoesContainer.innerHTML = '<p class="text-white">Não foi possível carregar as lanchonetes.</p>';
    }
  }

  criarBotoesDeLanchonetes();
});
