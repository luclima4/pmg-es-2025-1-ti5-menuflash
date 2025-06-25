document.addEventListener("DOMContentLoaded", () => {
    let minhaLanchonete = null; 
    let todosOsItens = [];     
    let imagemBase64 = "";     

    const form = document.getElementById("formItens");
    const inputId = document.getElementById("inputId");
    const selectDisponivel = document.getElementById("selectDisponivel");
    const inputTitulo = document.getElementById("inputTitulo");
    const inputConteudo = document.getElementById("inputConteudo");
    const inputQuantidade = document.getElementById("inputQuantidade");
    const inputDescricao = document.getElementById("inputDescricao");
    const inputValor = document.getElementById("inputValor");
    const checkLactose = document.getElementById("opcaoA");
    const checkGluten = document.getElementById("opcaoB");
    const inputImagem = document.getElementById("inputImagem");
    const imagemBase64Hidden = document.getElementById("imagemBase64Hidden");
    const previewImagem = document.getElementById("previewImagem");

    // Função principal que inicia tudo
    const init = async () => {
        const usuarioLogado = JSON.parse(sessionStorage.getItem("usuarioLogado") || '{}');
        if (!usuarioLogado || usuarioLogado.tipo !== "administrador" || !usuarioLogado.lanchoneteId) {
            document.body.innerHTML = '<h2 class="text-center text-danger p-5">Acesso negado. Você precisa ser um administrador com uma lanchonete associada.</h2>';
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/lanchonetes/${usuarioLogado.lanchoneteId}`);
            if (!response.ok) throw new Error("Não foi possível encontrar a sua lanchonete.");
            
            minhaLanchonete = await response.json();
            todosOsItens = minhaLanchonete.itens || [];
            
            document.getElementById("nomeLanchonete").innerHTML = `<h2>Gerenciar Itens - ${minhaLanchonete.nome}</h2>`;
            renderTable(todosOsItens);

        } catch (error) {
            console.error("Erro na inicialização:", error);
            alert("Erro ao carregar dados da lanchonete.");
        }
    };

    // Renderiza a tabela com os itens
    const renderTable = (itens) => {
        const tbody = document.getElementById("tabelaItens");
        tbody.innerHTML = '';
        if (!itens) return;

        itens.forEach(item => {
            const tr = document.createElement("tr");
            tr.style.cursor = "pointer";
            tr.innerHTML = `
                <td>${item.id}</td>
                <td>${item.disponivel ? '✔️' : '❌'}</td>
                <td>${item.titulo}</td>
                <td>${item.descricao}</td>
                <td>${item.quantidade}</td>
                <td>R$ ${Number(item.valor).toFixed(2).replace('.', ',')}</td>
                <td>${item.conteudo || '-'}</td>
                <td>${item.semLactose ? '✔️' : '❌'}</td>
                <td>${item.semGluten ? '✔️' : '❌'}</td>
            `;
            tr.addEventListener("click", () => preencherFormulario(item));
            tbody.appendChild(tr);
        });
    };

    // Preenche o formulário quando uma linha da tabela é clicada
    const preencherFormulario = (item) => {
        inputId.value = item.id;
        selectDisponivel.value = item.disponivel ? 'disponivel' : 'indisponivel';
        inputTitulo.value = item.titulo;
        inputDescricao.value = item.descricao;
        inputValor.value = item.valor;
        inputQuantidade.value = item.quantidade;
        inputConteudo.value = item.conteudo;
        checkLactose.checked = item.semLactose;
        checkGluten.checked = item.semGluten;
        
        imagemBase64 = item.imagem;
        imagemBase64Hidden.value = item.imagem;
        previewImagem.src = item.imagem;
        previewImagem.style.display = item.imagem ? 'block' : 'none'; // CORRIGIDO
    };

    const limparFormulario = () => {
        form.reset();
        inputId.value = '';
        imagemBase64 = '';
        imagemBase64Hidden.value = '';
        previewImagem.style.display = 'none';
        inputTitulo.focus();
    };

    // CRUD
    const salvarAlteracoesNaAPI = async () => {
        try {
            const response = await fetch(`http://localhost:3000/lanchonetes/${minhaLanchonete.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(minhaLanchonete)
            });
            if (!response.ok) throw new Error("Falha ao salvar alterações.");
            return true;
        } catch (error) {
            console.error("Erro ao salvar na API:", error);
            alert("Erro ao salvar. Tente novamente.");
            return false;
        }
    };

    const adicionarItem = async () => {
        const maxId = todosOsItens.reduce((max, item) => Math.max(max, item.id), 0);
        const novoItem = {
            id: maxId + 1,
            titulo: inputTitulo.value.trim(),
            descricao: inputDescricao.value.trim(),
            valor: parseFloat(inputValor.value) || 0,
            quantidade: parseInt(inputQuantidade.value) || 0,
            conteudo: inputConteudo.value.trim(),
            disponivel: selectDisponivel.value === 'disponivel',
            semLactose: checkLactose.checked,
            semGluten: checkGluten.checked,
            imagem: imagemBase64,
            favoritos: []
        };

        if (!novoItem.titulo || !novoItem.descricao) {
            return alert("Os campos Nome e Descrição são obrigatórios.");
        }

        minhaLanchonete.itens.push(novoItem);
        
        if (await salvarAlteracoesNaAPI()) {
            alert('Item adicionado com sucesso!');
            todosOsItens = minhaLanchonete.itens;
            renderTable(todosOsItens);
            limparFormulario();
        }
    };

    const editarItem = async () => {
        const id = parseInt(inputId.value);
        if (!id) return alert("Nenhum item selecionado para editar.");

        const itemIndex = minhaLanchonete.itens.findIndex(i => i.id === id);
        if (itemIndex === -1) return alert("Item não encontrado.");

        const itemAtualizado = {
            id: id,
            titulo: inputTitulo.value.trim(),
            descricao: inputDescricao.value.trim(),
            valor: parseFloat(inputValor.value) || 0,
            quantidade: parseInt(inputQuantidade.value) || 0,
            conteudo: inputConteudo.value.trim(),
            disponivel: selectDisponivel.value === 'disponivel',
            semLactose: checkLactose.checked,
            semGluten: checkGluten.checked,
            imagem: imagemBase64,
            favoritos: minhaLanchonete.itens[itemIndex].favoritos || [] // Mantém os favoritos existentes
        };

        minhaLanchonete.itens[itemIndex] = itemAtualizado;

        if (await salvarAlteracoesNaAPI()) {
            alert('Item alterado com sucesso!');
            todosOsItens = minhaLanchonete.itens;
            renderTable(todosOsItens);
            limparFormulario();
        }
    };

    const excluirItem = async () => {
        const id = parseInt(inputId.value);
        if (!id) return alert("Nenhum item selecionado para excluir.");

        if (confirm(`Tem certeza que deseja excluir o item #${id}?`)) {
            minhaLanchonete.itens = minhaLanchonete.itens.filter(i => i.id !== id);
            
            if (await salvarAlteracoesNaAPI()) {
                alert('Item excluído com sucesso!');
                todosOsItens = minhaLanchonete.itens;
                renderTable(todosOsItens);
                limparFormulario();
            }
        }
    };
    
    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = e => {
            imagemBase64 = e.target.result;
            imagemBase64Hidden.value = imagemBase64; 
            previewImagem.src = imagemBase64;
            previewImagem.style.display = 'block';
        };
        reader.readAsDataURL(file);
    };

    document.getElementById("btnAdicionar").addEventListener("click", adicionarItem);
    document.getElementById("btnEditar").addEventListener("click", editarItem);
    document.getElementById("btnExcluir").addEventListener("click", excluirItem);
    document.getElementById("btnLimpar").addEventListener("click", limparFormulario);
    inputImagem.addEventListener('change', handleImageSelect);

    init();
});