# Arquitetura da solução

<span style="color:red">Pré-requisitos: <a href="05-Projeto-interface.md"> Projeto de interface</a></span>

## Funcionalidades

##### Funcionalidade Obrigatória - Login e cadastro



##### Funcionalidade 1 - Mostrar cardápio de cada lanchonete

##### Funcionalidade 2 - Histórico de pedidos

##### Funcionalidade 3 - Modal com imagem, legenda, descrição e preço do produto.

##### Funcionalidade 4 - Peça novamente

##### Funcionalidade 5 - Favoritos

##### Funcionalidade 6 - Formas de pagamento (cartão/ pix)

##### Funcionalidade 7 - Mapa do campus com indicação das lanchonetes

##### Funcionalidade 8 - Carrinho de pedidos

##### Funcionalidade 9 - Identificação de itens com restrição alimentar

##### Funcionalidade 10 - Avaliação de itens

##### Funcionalidade 11 - Campo de pesquisa

##### Funcionalidade 12 - Perfil do usuário




















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
