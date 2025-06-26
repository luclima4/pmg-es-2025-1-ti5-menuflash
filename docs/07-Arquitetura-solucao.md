# Arquitetura da solução

<span style="color:red">Pré-requisitos: <a href="05-Projeto-interface.md"> Projeto de interface</a></span>

## Funcionalidades

##### Funcionalidade Obrigatória - Login e cadastro

Permite o cadastro e autenticação de usuários no sistema, diferenciando perfis padrão e administradores.

*Estrutura de dados:* [Usuários](#estrutura-de-dados---usuários)  
*Instruções de acesso:*
* Acesse o site e clique em "Entrar" ou "Cadastrar";
* Preencha o formulário de login ou cadastro;

*Tela da funcionalidade:*

![Tela de login](images/login.png)
![Tela de cadastro](images/cadastro.png)

##### Funcionalidade 1 - Mostrar cardápio de cada lanchonete

Exibe os produtos disponíveis em cada lanchonete do campus selecionado.

*Estrutura de dados:* [Lanchonetes](#estrutura-de-dados---lanchonetes)  
*Instruções de acesso:*
* Na home, selecione um campus;
* Escolha uma lanchonete para visualizar os produtos.

*Tela da funcionalidade:*

![Tela de cardápio](images/cardapio-lanchonete1.png)
![Tela de cardápio](images/cardapio-lanchonete.png)

##### Funcionalidade 2 - Histórico de pedidos

Exibe os pedidos anteriores feitos pelo usuário logado, com data, hora, itens e valores.

*Estrutura de dados:* [Histórico de pedidos](#estrutura-de-dados---histórico-de-pedidos) 
*Instruções de acesso:*
* Faça login;
* Acesse o menu, clique em perfil e depois em "Histórico de Pedidos".

*Tela da funcionalidade:*

![Tela de histórico de pedidos](images/historico-pedidos.png)

##### Funcionalidade 3 - Modal com imagem, legenda, descrição e preço do produto.

Exibe um modal ao clicar em um produto, mostrando detalhes como imagem, descrição, conteúdo e preço.

*Estrutura de dados:* [Itens](#estrutura-de-dados---itens)  
*Instruções de acesso:*
* Clique sobre o card do produto desejado.

*Tela da funcionalidade:*

![Tela de modal](images/modal.png)

##### Funcionalidade 4 - Peça novamente

Página onde permite visualizar e repetir pedidos anteriores.

*Estrutura de dados:* [Histórico de pedidos](#estrutura-de-dados---histórico-de-pedidos)  
*Instruções de acesso:*
* Faça login;
* Clique em "Peça novamente" para visualizar um pedido anterior ou repeti-lo.

*Tela da funcionalidade:*

![Tela peça novamente](images/peca-novamente.png)

##### Funcionalidade 5 - Favoritos

Permite marcar/desmarcar itens como favoritos e acessar a lista de favoritos posteriormente.

*Estrutura de dados:* [Itens.Favorito](#estrutura-de-dados---itens) 

*Instruções de acesso:*
* Clique no ícone de coração em um produto;
* Acesse a página "Favoritos" dentro do perfil para visualizar sua lista de favoritos.

*Tela da funcionalidade:*

![Tela favoritos](images/favoritos1.png)
![Tela favoritos](images/favoritos2.png)

##### Funcionalidade 6 - Formas de pagamento (cartão/ pix)

Exibe e registra a forma de pagamento escolhida no momento da finalização do pedido.

*Estrutura de dados:* [Histórico de pedidos.Forma Pagamento ](#estrutura-de-dados---histórico-de-pedidos)  

*Instruções de acesso:*
* Após adicionar produtos ao carrinho, clique em "Finalizar pedido" e escolha a forma de pagamento.

*Tela da funcionalidade:*

![Tela formas de pagamento](images/pagamento.png)
![Tela formas de pagamento](images/pagamento2.png)

##### Funcionalidade 7 - Mapa do campus com indicação das lanchonetes

Exibe mapa interativo com os locais das lanchonetes nos campus.

*Estrutura de dados:* Sem estrutura de dados, mapas gerados por API.
*Instruções de acesso:*
* Na tela inicial, escolha o campus para visualizar seu respectivo mapa.

*Tela da funcionalidade:* 
![Tela de mapa](images/mapas.png)

##### Funcionalidade 8 - Carrinho de pedidos

Armazena os itens que o usuário deseja comprar, com opções para alterar quantidade ou remover.

*Estrutura de dados:* [Carrinho](#estrutura-de-dados---carrinho)
*Instruções* de acesso:*
* Adicione* um item ao carrinho;
* Clique no ícone de carrinho no topo da página.

*Tela da funcionalidade:* 
![Tela de carrinho](images/carrinho.png)

##### Funcionalidade 9 - Identificação de itens com restrição alimentar

Dentro do modal, exibe ícones indicando se o produto é sem lactose e/ou sem glúten.

*Estrutura de dados:* [Itens](#estrutura-de-dados---itens)  
*Instruções de acesso:*
* Ao visualizar um cardápio ou modal de produto, verifique os ícones informativos.

*Tela da funcionalidade:* 
![Tela de restricao](images/restricao.png)

##### Funcionalidade 10 - Avaliação de itens

Permite que usuários atribuam notas aos produtos dentro do modal.

*Estrutura de dados:* Sem estrutura de dados, tudo foi guardado utilizando localStorage.
*Instruções de acesso:*
* Ao acessar o modal de um produto, clique nas estrelas para avaliar.

*Tela da funcionalidade:* 
![Tela de avaliação](images/restricao.png)

##### Funcionalidade 11 - Campo de pesquisa

Filtra os produtos disponíveis conforme o termo digitado pelo usuário.

*Estrutura de dados:* Sem estrutura de dados.
*Instruções de acesso:*
* Digite no campo de busca na tela de cardápio.

*Tela da funcionalidade:* 
![Tela de avaliação](images/barra-busca.png)

##### Funcionalidade 12 - Perfil do usuário

Mostra os dados do usuário logado, como nome, e-mail, favoritos, histórico de pedidos.

*Estrutura de dados:* [Usuários](#estrutura-de-dados---usuários)  
*Instruções de acesso:*
* Clique no ícone do perfil no menu superior.

*Tela da funcionalidade:* 
![Tela de avaliação](images/perfil.png)

##### Funcionalidade 13 - Trocar senha do usuário

Permite que o usuário altere sua senha.

*Estrutura de dados:* [Usuários](#estrutura-de-dados---usuários)  
*Instruções de acesso:*
* Acesse o perfil e clique em "Trocar Senha";
* Preencha os campos com a senha atual e a nova senha.

*Tela da funcionalidade:* 
![Tela de troca senha](images/troca-senha.png)


### Estruturas de dados

##### Estrutura de dados - Usuários

Registro dos usuários do sistema, utilizado para login e para o perfil do sistema.

```json
  {
    "id": "1",
    "nome": "Lucas",
    "email": "lucas@gmail.com",
    "senha": "123456"
  }
```

##### Estrutura de dados - Histórico de pedidos

Ao finalizar a compra, o pedido é salvo no histórico do usuário com detalhes.

```json
    {
    "pedido_id": "1",
    "lanchonete_id": "3",
    "data": "2025-05-18",
    "hora": "20:15:09",
    "total": 17,
    "forma_pagamento": "Pix",
    "status": "Entregue",
    }
```

##### Estrutura de dados - Itens

```json
  {
    "id": 4,
    "titulo": "Coxinha",
    "descricao": "Coxinha de frango com massa crocante e recheio cremoso, um clássico brasileiro.",
    "conteudo": "",
    "disponivel": true,
    "favorito": true,
    "semLactose": false,
    "semGluten": false,
    "imagem": "../principal/img/itens/coxinha.png",
    "quantidade": 2,
    "preco_unitario": 6.5,
    "subtotal": 13
  }
```

##### Estrutura de dados - Lanchonetes

Mostra os itens disponíveis em uma lanchonete e suas informações, também permite ações como adicionar ao carrinho.

```json
  {
    "id": "2",
    "nome": "Central",
    "itens": [
      {
        "id": 7,
        "titulo": "Coca-Cola lata",
        "valor": 5.5,
        "disponivel": true
      }
    ]
  }
```

##### Estrutura de dados - Carrinho

Armazena os itens adicionados pelo usuário, permitindo ajustes de quantidade.

```json
  {
    "userId": "1",
    "itens": [
      {
        "id": 5,
        "quantidade": 1,
        "subtotal": 5.5
      }
    ]
  }
```

##### Estrutura de dados - Campus

O usuário pode selecionar um campus e visualizar as lanchonetes disponíveis nele.

```json
  {
    "nome": "PUC MINAS - Contagem",
    "mapa": "mapaContagem.html",
    "lanchonetes": [
      {
        "id": "4",
        "nome": "Lanchonete Praçaki"
      }
    ]
  }
```

### Módulos e APIs

Esta seção apresenta os módulos e APIs utilizados na solução.

**Images:**

* Mapbox - https://www.mapbox.com/

**Fonts:**

* Google Fonts - https://fonts.googleapis.com/css2?family=Poppins:wght@200;600&display=swap
* Google Fonts - https://fonts.googleapis.com/css2?family=Montserrat:wght@300;700&display=swap

**Scripts:**

* jQuery - https://code.jquery.com/jquery-3.7.1.min.js
* Bootstrap 5 - https://getbootstrap.com/
* JSON Server - https://github.com/typicode/json-server
* LocalStorage e SessionStorage - https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage

**Deployment:**

* Vercel - https://vercel.com

## Hospedagem

A hospedagem e o lançamento da plataforma MenuFlash foram realizados por meio da plataforma Vercel – https://vercel.com, uma ferramenta gratuita e amplamente utilizada para deploy de aplicações front-end.

Link de acesso - https://menuflash-eight.vercel.app/