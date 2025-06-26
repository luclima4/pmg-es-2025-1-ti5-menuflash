# Plano de testes de software

<span style="color:red">Pré-requisitos: <a href="03-Product-design.md"> Especificação do projeto</a></span>, <a href="05-Projeto-interface.md"> Projeto de interface</a>

Os testes da aplicação MenuFlash foram realizados com foco nas principais funcionalidades relacionadas aos requisitos funcionais definidos no projeto. O objetivo foi garantir que as funcionalidades essenciais estivessem operando corretamente e proporcionando uma boa experiência ao usuário.

Foram selecionados membros do próprio grupo para participar dos testes manuais. Os testes foram feitos diretamente no navegador, acessando a versão hospedada da aplicação, simulando o uso real do sistema.

Exemplo:

| **Item**                |**Descrição**        |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Requisito associado** | RF-001 – Mostrar cardápio de lanchonetes diversas                                                           |
| **Objetivo do teste**   | Verificar se o usuário consegue acessar o campus, visualizar lanchonetes e navegar até o cardápio           |
| **Passos**              | 1. Acessar o site <br> 2. Selecionar um campus (ex: Contagem) <br> 3. Visualizar as lanchonetes <br> 4. Clicar em uma lanchonete |
| **Critério de êxito**   | A página da lanchonete abre com os produtos disponíveis                                                     |
| **Responsável**         | Larissa Nogueira               |



| **Item**                | **Descrição**       |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Requisito associado** | RF-009 – Carrinho de pedidos                                    |
| **Objetivo do teste**   | Verificar se o usuário consegue adicionar um produto ao carrinho            |
| **Passos**              | 1. Acessar a página de uma lanchonete <br> 2. Escolher um produto <br> 3. Clicar em “Adicionar ao carrinho” |
| **Critério de êxito**   | O contador do carrinho é atualizado e o item aparece ao acessar o carrinho       |
| **Responsável**         | Heitor Habaeb        |



| **Item**                | **Descrição**        |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| **Requisito associado** | RF-004 – Peça Novamente         |
| **Objetivo do teste**   | Verificar se o sistema mostra pedidos anteriores e permite repetir       |
| **Passos**              | 1. Fazer login <br> 2. Clicar em “Peça Novamente” <br> 3. Visualizar histórico <br> 4. Clicar em um pedido     |
| **Critério de êxito**   | O pedido é reenviado ao carrinho com os mesmos itens      |
| **Responsável**         | Larissa Nogueira        |
