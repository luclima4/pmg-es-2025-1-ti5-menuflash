# Arquitetura da solução

<span style="color:red">Pré-requisitos: <a href="05-Projeto-interface.md"> Projeto de interface</a></span>

## Funcionalidades

##### Funcionalidade Obrigatória - Login e cadastro

Permite o cadastro e autenticação de usuários no sistema, diferenciando perfis padrão e administradores.

*Estrutura de dados:* [usuarios] (#estrutura-de-dados---usuarios)
*Instruções de acesso:*
* Acesse o site e clique em "Entrar" ou "Cadastrar";
* Preencha o formulário de login ou cadastro;

*Tela da funcionalidade:*

![Tela de login](images/login.png)
![Tela de cadastro](images/cadastro.png)

##### Funcionalidade 1 - Mostrar cardápio de cada lanchonete

Exibe os produtos disponíveis em cada lanchonete do campus selecionado.

*Estrutura de dados:* [lanchonetes]
*Instruções de acesso:*
* Na home, selecione um campus;
* Escolha uma lanchonete para visualizar os produtos.

*Tela da funcionalidade:*

![Tela de cardápio](images/cardapio-lanchonete1.png)
![Tela de cardápio](images/cardapio-lanchonete.png)

##### Funcionalidade 2 - Histórico de pedidos

Exibe os pedidos anteriores feitos pelo usuário logado, com data, hora, itens e valores.

*Estrutura de dados:* historico_de_pedidos dentro de usuarios
*Instruções de acesso:*
* Faça login;
* Acesse o menu, clique em perfil e depois em "Histórico de Pedidos".

*Tela da funcionalidade:*

![Tela de histórico de pedidos](images/historico-pedidos.png)

##### Funcionalidade 3 - Modal com imagem, legenda, descrição e preço do produto.

Exibe um modal ao clicar em um produto, mostrando detalhes como imagem, descrição, conteúdo e preço.

*Estrutura de dados:* lanchonetes.itens
*Instruções de acesso:*

* Clique sobre o card do produto desejado.

*Tela da funcionalidade:*

![Tela de modal](images/modal.png)

##### Funcionalidade 4 - Peça novamente

Página onde permite visualizar e repetir pedidos anteriores.

*Estrutura de dados:* historico_de_pedidos
*Instruções de acesso:*
* Faça login;
* Clique em "Peça novamente" para visualizar um pedido anterior ou repeti-lo.

*Tela da funcionalidade:*

![Tela peça novamente](images/peca-novamente.png)

##### Funcionalidade 5 - Favoritos

Permite marcar/desmarcar itens como favoritos e acessar a lista de favoritos posteriormente.

*Estrutura de dados:* usuarios[].favoritos ou itens[].favoritos

*Instruções de acesso:*
* Clique no ícone de coração em um produto;
* Acesse a página "Favoritos" dentro do perfil para visualizar sua lista de favoritos.

*Tela da funcionalidade:*

![Tela favoritos](images/favoritos1.png)
![Tela favoritos](images/favoritos2.png)

##### Funcionalidade 6 - Formas de pagamento (cartão/ pix)

Exibe e registra a forma de pagamento escolhida no momento da finalização do pedido.

*Estrutura de dados:* forma_pagamento em historico_de_pedidos
*Instruções de acesso:*
* Após adicionar produtos ao carrinho, clique em "Finalizar pedido" e escolha a forma de pagamento.

*Tela da funcionalidade:*

![Tela formas de pagamento](images/pagamento.png)
![Tela formas de pagamento](images/pagamento2.png)

##### Funcionalidade 7 - Mapa do campus com indicação das lanchonetes

Exibe mapa interativo com os locais das lanchonetes nos campus.

*Estrutura de dados:*
*Instruções de acesso:*
* Na tela inicial, escolha o campus para visualizar seu respectivo mapa.

*Tela da funcionalidade:* 
![Tela de mapa](images/mapas.png)

##### Funcionalidade 8 - Carrinho de pedidos

Armazena os itens que o usuário deseja comprar, com opções para alterar quantidade ou remover.

*Estrutura de dados:* carrinhos
*Instruções* de acesso:*
* Adicione* um item ao carrinho;
* Clique no ícone de carrinho no topo da página.

*Tela da funcionalidade:* 
![Tela de carrinho](images/carrinho.png)

##### Funcionalidade 9 - Identificação de itens com restrição alimentar

Dentro do modal, exibe ícones indicando se o produto é sem lactose e/ou sem glúten.

*Estrutura de dados:*
*Instruções de acesso:*
* Ao visualizar um cardápio ou modal de produto, verifique os ícones informativos.

*Tela da funcionalidade:* 
![Tela de restricao](images/restricao.png)

##### Funcionalidade 10 - Avaliação de itens

Permite que usuários atribuam notas aos produtos dentro do modal.

*Estrutura de dados:* 
*Instruções de acesso:*
* Ao acessar o modal de um produto, clique nas estrelas para avaliar.

*Tela da funcionalidade:* 
![Tela de avaliação](images/restricao.png)

##### Funcionalidade 11 - Campo de pesquisa

Filtra os produtos disponíveis conforme o termo digitado pelo usuário.

*Estrutura de dados:* 
*Instruções de acesso:*
* Digite no campo de busca na tela de cardápio.

*Tela da funcionalidade:* 
![Tela de avaliação](images/barra-busca.png)

##### Funcionalidade 12 - Perfil do usuário

Mostra os dados do usuário logado, como nome, e-mail, favoritos, histórico de pedidos.

*Estrutura de dados:* usuarios
*Instruções de acesso:*
* Clique no ícone do perfil no menu superior.

*Tela da funcionalidade:* 
![Tela de avaliação](images/perfil.png)

##### Funcionalidade 13 - Trocar senha do usuário

Permite que o usuário altere sua senha.

*Estrutura de dados:* 
*Instruções de acesso:*
* Acesse o perfil e clique em "Trocar Senha";
* Preencha os campos com a senha atual e a nova senha.

*Tela da funcionalidade:* 
![Tela de troca senha](images/troca-senha.png)


### Estruturas de dados

Descrição das estruturas de dados utilizadas na solução com exemplos no formato JSON.Info.

##### Estrutura de dados - 

### Módulos e APIs

Esta seção apresenta os módulos e APIs utilizados na solução.

## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foram realizados.













Permite a inclusão, leitura, alteração e exclusão de contatos para o sistema

* **Estrutura de dados:** [Contatos](#estrutura-de-dados---contatos)
* **Instruções de acesso:**
  * Abra o site e efetue o login;
  * Acesse o menu principal e escolha a opção "Cadastros";
  * Em seguida, escolha a opção "Contatos".
* **Tela da funcionalidade**:

![Tela de funcionalidade](images/exemplo-funcionalidade.png)

> ⚠️ **APAGUE ESTA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente cada uma das funcionalidades que a aplicação fornece tanto para os usuários, quanto aos administradores da solução.
>
> Inclua, para cada funcionalidade, itens como: (1) títulos e descrição da funcionalidade; (2) estrutura de dados associada; (3) o detalhe sobre as instruções de acesso e uso.

### Estruturas de dados

Descrição das estruturas de dados utilizadas na solução com exemplos no formato JSON.Info.

##### Estrutura de dados - Contatos

Contatos da aplicação

```json
  {
    "id": 1,
    "nome": "Leanne Graham",
    "cidade": "Belo Horizonte",
    "categoria": "amigos",
    "email": "Sincere@april.biz",
    "telefone": "1-770-736-8031",
    "website": "hildegard.org"
  }
  
```

##### Estrutura de dados - Usuários  ⚠️ EXEMPLO ⚠️

Registro dos usuários do sistema utilizados para login e para o perfil do sistema.

```json
  {
    "id": "1",
    "nome": "Lucas",
    "email": "lucas@gmail.com",
    "senha": "123456"
  }
```

> ⚠️ **APAGUE ESTA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente as estruturas de dados utilizadas na solução tanto para dados utilizados na essência da aplicação, quanto outras estruturas que foram criadas para algum tipo de configuração.
>
> Nomeie a estrutura, coloque uma descrição sucinta e apresente um exemplo em formato JSON.

- Estrutura: usuarios
- Permite que usuários façam login com e-mail e senha

```json
  {
    "id": "1",
    "nome": "Lucas",
    "email": "lucas@gmail.com",
    "senha": "123456"
  }
```

- Estrutura: campus
- O usuário pode selecionar um campus e visualizar as lanchonetes disponíveis nele

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

- Estrutura: lanchonetes
- Mostra todos os itens disponíveis em uma lanchonete com suas informações e permite ações como adicionar ao carrinho

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

- Estrutura: carrinho
- Armazena os itens adicionados pelo usuário, permitindo ajustes de quantidade

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

- Estrutura: usuarios[].historico_de_pedidos
- Ao finalizar a compra, o pedido é salvo no histórico do usuário com detalhes

```json
  {
    "pedido_id": "2",
    "data": "2025-05-20",
    "total": 11,
    "itens": [
      {
        "id": 5,
        "titulo": "Pão de queijo"
      }
    ]
  }
```

>
> **Orientações:**
>
> * [JSON Introduction](https://www.w3schools.com/js/js_json_intro.asp)
> * [Trabalhando com JSON - Aprendendo desenvolvimento web | MDN](https://developer.mozilla.org/pt-BR/docs/Learn/JavaScript/Objects/JSON)

### Módulos e APIs

Esta seção apresenta os módulos e APIs utilizados na solução.

**Images**:

* Unsplash - [https://unsplash.com/](https://unsplash.com/) ⚠️ EXEMPLO ⚠️

**Fonts:**

* Icons Font Face - [https://fontawesome.com/](https://fontawesome.com/) ⚠️ EXEMPLO ⚠️

**Scripts:**

* jQuery - [http://www.jquery.com/](http://www.jquery.com/) ⚠️ EXEMPLO ⚠️
* Bootstrap 4 - [http://getbootstrap.com/](http://getbootstrap.com/) ⚠️ EXEMPLO ⚠️

> ⚠️ **APAGUE ESTA PARTE ANTES DE ENTREGAR SEU TRABALHO**
>
> Apresente os módulos e APIs utilizados no desenvolvimento da solução. Inclua itens como: (1) frameworks, bibliotecas, módulos, etc. utilizados no desenvolvimento da solução; (2) APIs utilizadas para acesso a dados, serviços, etc.


## Hospedagem

Explique como a hospedagem e o lançamento da plataforma foram realizados.

> **Links úteis**:
> - [Website com GitHub Pages](https://pages.github.com/)
> - [Programação colaborativa com Repl.it](https://repl.it/)
> - [Getting started with Heroku](https://devcenter.heroku.com/start)
> - [Publicando seu site no Heroku](http://pythonclub.com.br/publicando-seu-hello-world-no-heroku.html)
