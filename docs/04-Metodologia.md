
# Metodologia

<span style="color:red">Pré-requisitos: <a href="03-Product-design.md"> Product design</a></span>

### Relação de ambientes de trabalho

Os artefatos do projeto MenuFlash foram desenvolvidos utilizando diferentes plataformas, com o objetivo de organizar, desenvolver e hospedar todas as etapas da aplicação. A tabela abaixo resume os ambientes adotados e seus propósitos:

| Ambiente                    | Plataforma      | Link de acesso                                                        |
|-----------------------------|-----------------|------------------------------------------------------------------------|
| Processo de Design Thinking | Miro            | [Link do Miro](https://miro.com/welcomeonboard/dzl1L3FxTEs0aEpnaUg4bkUzM0hCdXlyUXBVTTNFd1djdytpNUFFYjgrVVlFRnRnYmZlWGh3eWVQU0p4OXk1QVU3b0JiZ1pmU3RLMHhyZGtqOTh0UTR5YWV1YldhWkpOVmtBazlvZEdVZnZTcTlCWXV2NHBJMSttd1NMR0pjTCtBS2NFMDFkcUNFSnM0d3FEN050ekl3PT0hdjE=?share_link_id=12564068258) |
| Repositório de código-fonte | GitHub          | [Repositório GitHub](https://github.com/ICEI-PUC-Minas-PCO-SI/pmg-es-2025-1-ti5-pmg-es-2025-1-ti5-Template-TIAW) |
| Documentos do projeto       | GitHub          | [Documentação](https://github.com/ICEI-PUC-Minas-PCO-SI/pmg-es-2025-1-ti5-pmg-es-2025-1-ti5-Template-TIAW) |
| Gerenciamento do projeto    | GitHub Projects | [Kanban GitHub](https://github.com/ICEI-PUC-Minas-PCO-SI/pmg-es-2025-1-ti5-pmg-es-2025-1-ti5-Template-TIAW/projects) |
| Projeto de interface        | Figma           | [Protótipo no Figma](https://www.figma.com/design/T6MGgP9B9tfb1dWsLrRAKz/MenuFlash?node-id=0-1&t=sRj3WJvIx5UlKzCV-1) |
| Hospedagem do site          | Vercel          | *(em desenvolvimento)*                                               |


### Controle de versão

A ferramenta de controle de versão utilizada no projeto foi o Git, com o repositório hospedado no GitHub. A equipe adotou uma estrutura de branches que permite o desenvolvimento colaborativo e seguro, seguindo a seguinte convenção:

- `main`: versão estável e pronta para produção;
- `Develop`: versão principal de desenvolvimento, onde são integradas as funcionalidades das branches dos membros;
- `Cristiane, eric, Larissa, Lucas, Lucas_Develop, Heitor, menu` : branches individuais - cada integrante da equipe criou sua própria branch para desenvolver suas respectivas funcionalidades sem interferir no progresso dos demais.
 
**Configuração do Projeto e Gerência de Versionamento**
A configuração do projeto no GitHub foi estruturada com branches nomeadas de acordo com cada integrante da equipe, permitindo que cada funcionalidade fosse desenvolvida de forma separada, sem impactar o trabalho dos demais. Além disso, foram utilizadas duas branches principais:

- `develop`: onde foram reunidas as funcionalidades em desenvolvimento;
- `main`: reservada para as versões mais estáveis do sistema.

**Commits**
Os commits, apesar de não seguirem um padrão técnico formal como `feat`: ou `fix:`, sempre incluíram descrições claras do que foi alterado. As mensagens normalmente indicavam o tipo de mudança feita, como correções de bugs, melhorias visuais ou implementação de novas funcionalidades, facilitando o entendimento do histórico do projeto por todos os membros.

**Merges**
Os merges foram feitos de forma organizada. Cada integrante desenvolveu e testou sua parte em uma branch individual, que depois era integrada à `Develop`. Após testar tudo e garantir que o site estava funcionando corretamente, o código foi enviado para a main, evitando conflitos e garantindo uma versão final estável.

**Gerência de Issues**
Embora não tenha sido utilizada uma ferramenta formal como GitHub Issues, a equipe aplicou os princípios do Design Thinking para identificar, priorizar e distribuir tarefas. Além disso, a comunicação constante via WhatsApp e reuniões presenciais garantiu o alinhamento entre os membros quanto a bugs, melhorias e novas funcionalidades.

## Planejamento do projeto

###  Divisão de papéis

A equipe se organizou com base na metodologia Scrum, adotando os seguintes papéis:

*Scrum Master:* Larissa Nogueira – responsável por acompanhar o andamento do time e remover impedimentos.

*Product Owner:* Cristiane de Oliveira – responsável por representar os interesses dos usuários e priorizar as funcionalidades.

*Equipe de Desenvolvimento:* Cristiane de Oliveira, Eric Abreu, Heitor Habaeb, Larissa Nogueira e Lucas Lima – todos participaram da implementação de funcionalidades e telas.

*Equipe de Design:* Cristiane de Oliveira, Eric Abreu, Heitor Habaeb, Larissa Nogueira e Lucas Lima – todos contribuíram com a criação da interface do sistema.

### Processo

A equipe utilizou o Design Thinking nas etapas iniciais para entender as necessidades dos usuários e definir as funcionalidades do sistema. Durante o desenvolvimento, foi adotado o Scrum, com sprints e divisão de papéis clara.

Para gerenciar as tarefas, o grupo utilizou o Trello, com um quadro Kanban contendo colunas como "A fazer", "Em andamento" e "Concluído", facilitando a organização e o acompanhamento do projeto.

IMAGEM

### Ferramentas

| Ambiente                    | Plataforma         | Link de acesso                                                        | Justificativa                                                                    |
|----------------------------|--------------------|-----------------------------------------------------------------------|----------------------------------------------------------------------------------|
| Processo de Design Thinking | Miro               | [Link do Miro](https://miro.com/welcomeonboard/dzl1L3FxTEs0aEpnaUg4bkUzM0hCdXlyUXBVTTNFd1djdytpNUFFYjgrVVlFRnRnYmZlWGh3eWVQU0p4OXk1QVU3b0JiZ1pmU3RLMHhyZGtqOTh0UTR5YWV1YldhWkpOVmtBazlvZEdVZnZTcTlCWXV2NHBJMSttd1NMR0pjTCtBS2NFMDFkcUNFSnM0d3FEN050ekl3PT0hdjE=?share_link_id=12564068258) | Utilizado para organizar ideias e mapear o problema com base no Design Thinking. |
| Repositório de código-fonte | GitHub             | [Repositório GitHub](https://github.com/ICEI-PUC-Minas-PCO-SI/pmg-es-2025-1-ti5-pmg-es-2025-1-ti5-Template-TIAW) | Armazenamento do código, versionamento e colaboração entre os membros.           |
| Documentos do projeto       | GitHub             | [Link da Documentação](https://github.com/ICEI-PUC-Minas-PCO-SI/pmg-es-2025-1-ti5-pmg-es-2025-1-ti5-Template-TIAW) | Organização da documentação técnica e entrega do trabalho.                       |
| Gerenciamento do projeto    | Trello             | *(Uso interno – quadro compartilhado entre membros)*                 | Quadro Kanban com tarefas divididas em colunas "A fazer", "Fazendo" e "Feito".  |
| Projeto de interface        | Figma              | [Protótipo no Figma](https://www.figma.com/design/T6MGgP9B9tfb1dWsLrRAKz/MenuFlash?node-id=0-1&t=sRj3WJvIx5UlKzCV-1) | Criação do layout e visual das interfaces do sistema.                            |
| Hospedagem do site          | Vercel             | *(Link ainda não disponível)*                                         | Plataforma usada para deploy gratuito de projetos front-end.                     |
| Editor de código            | Visual Studio Code | *(Uso local)*                                                         | Utilizado para desenvolver o sistema com HTML, CSS e JavaScript.                 |
| Comunicação                 | WhatsApp           | *(Uso interno)*                                                       | Principal canal de comunicação entre os membros da equipe.                       |


