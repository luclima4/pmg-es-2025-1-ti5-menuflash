# Template padrão da aplicação

<span style="color:red">Pré-requisitos: <a href="03-Product-design.md"> Especificação do projeto</a></span>, <a href="04-Metodologia.md"> Metodologia</a>, <a href="05-Projeto-interface.md"> Projeto de interface</a>

O layout padrão da aplicação MenuFlash foi criado para manter uma experiência visual consistente em todas as páginas do sistema. A estrutura principal do template inclui:

- Cabeçalho fixo (navbar): com o nome do sistema, botão de login (ícone de usuário), acesso ao carrinho de compras e à opção "Peça Novamente".
- Área principal (main): adaptável de acordo com o conteúdo de cada página, como lista de lanchonetes, cardápios, carrinho, etc.
- Rodapé: simples e centralizado, com informações institucionais.

**Identidade visual**

- Cores: vermelho escuro (#a00000) como cor principal, fundo branco e textos contrastantes;
- Fontes: uso de fontes sem serifa com boa legibilidade;
- Ícones: biblioteca Font Awesome para ícones como carrinho, usuário e ações de navegação;
- Estilo geral: foco em simplicidade e contraste, com hover em cards e elementos clicáveis.

**Responsividade**

O layout foi desenvolvido com Bootstrap 5, aproveitando seu sistema de grid responsivo, media queries e componentes adaptáveis.
As telas funcionam bem em diferentes tamanhos (mobile, tablet, desktop) com navegação clara por toque ou clique.
Cards se reorganizam automaticamente em colunas (row-cols) conforme o tamanho da tela.

**Reutilização do template**

A estrutura do header, footer e estilos foi mantida em todas as páginas HTML;
Os arquivos .css e .js são organizados por pasta e importados conforme a necessidade;

**Observação**

O template está disponível no projeto, e seu código pode ser reutilizado com pequenos ajustes para qualquer nova página, mantendo a padronização visual e a experiência do usuário consistente em todo o sistema.

