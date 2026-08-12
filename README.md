# COMO EXECUTAR

- NO TERMINAL, NAVEGUE ATÉ UM DIRETÓRIO DA SUA ESCOLHA E EXECUTE UM GIT CLONE PARA CLONAR O REPOSITÓRIO.

- NA RAIZ DO PROJETO, COPIE O ARQUIVO DE .env.example PARA SUA MÁQUINA:
  bash: `cp .env.example .env`

- PREENCHA OS VALORES DAS VARIÁVEIS DE AMBIENTE.

- UTILIZE `pnpm install` PARA INSTALAR AS DEPENDÊNCIAS DO PROJETO.

- COM O DOCKER INSTALADO E NA RAIZ DO PROJETO, UTILIZE `docker compose up` PARA SUBIR O CONTAINER DOCKER DO BANCO DE DADOS.

- NO TERMINAL, EXECUTE "pnpm start" PARA SUBIR O SERVIDOR

# DOCUMENTAÇÃO

- A DOCUMENTAÇÃO DA APLICAÇÃO ESTÁ DISPONÍVEL EM "localhost:3000/docs/".

- NA DOCUMENTAÇÃO É POSSÍVEL TESTAR REQUISIÇÕES, VERIFICAR ENDPOINTS E SEUS RESPECTIVOS FILTROS.

# TECNOLOGIAS UTILIZADAS

- 🚀 [NestJS]
- ✅ [Zod] - Validação de dados
- 🧩 [nestjs-zod] - Automatizar criação de classes baseado em schema
- 📝 [Swagger] - Documentação da aplicação
- 🧪 [Jest] - Testes unitários
- 🛢️ [PostgreSQL] - Banco de Dados
- 🗄️ [Prisma] - ORM
- 🐳 [Docker] - Conteinerização
- 📮 [Insomnia] - requisições para a API

# ESTRUTURA DO PROJETO

- ORGANIZAÇÃO DE PASTAS FOI UTILIZADO O PADRÃO DO NEST, SEPARANDO POR MÓDULOS.
- CADA MÓDULO TEM SEU PRÓPRIO:

  - contracts (Arquivo de contrato para repository - classe abstrata dizendo métodos que devem ser implementados pela camada de repository);

  - decorators (Arquivos de junção de decorators do Swagger - cada arquivo corresponde a um endpoint);

  - docs (contendo regras de negócio específicas de cada módulo, a fim de minimizar erros durante o desenvolvimento com IA);

  - dto (contendo meus schemas e classes baseadas no schema);

  - repositories (contendo minha camada de repositório);

  - controller (camada de controller do módulo);

  - service (camada de service do módulo);

  - service.spec (camada de teste unitário da service do módulo);

# DECISÕES TÉCNICAS

<!-- CITAR FUNCIONALIDADES -->

1. Por que escolheu esse framework?
   Apesar de ter mais prática com Express e apenas noções de NestJS inicialmente, vi neste desafio uma boa oportunidade para desenvolver minha prática com NestJS.
   Além disso, o setup estruturado me permitiu acelerar o desenvolvimento da aplicação e aumentar a confiabilidade de desenvolvimento orientado com IA. Recursos como a cli do Nest, auxiliam muito na construção base da aplicação. Também devo citar que, bibliotecas como Swagger e Zod integram muito bem com NestJS, dessa forma, consegui fazer a validação de dados e gerar a documentação de uma forma muito rápida.

---

2. Como organizou o projeto?
   Utilizei arquitetura modular, conforme o padrão do NestJS. Nela, cada módulo contém seus próprios contratos, decoradores, documentação, repositório, controller, service, testes e arquivo de módulo necessário.

   contracts - Contém o contrato que a camada de repositório deve implementar, aplicando a letra D do princípio SOLID (Princípio da Inversão de Dependência), facilitando mock de testes unitários e uma possível troca de implementação do repositório futura.

   decorators - Agrupei decorators do Swagger, separando por cada endpoint, resultando em um controller limpo e facilidade de manutenção nos decoradores.

   docs - Contém a especificação da regra de negócio de seu respectivo módulo, facilitando contexto para utilização de IA no desenvolvimento.

   dto - Contém os objetos de transferência de dados, responsáveis por definir e validar o formato dos dados recebidos e retornados pelos endpoints da API, atuando entre o cliente e o controller.

   repositories - Contém a implementação da camada de repositório, implementando a classe abstrata localizada em contracts.

   Subindo para raiz, temos a pasta do Prisma, contendo migrations e o schema do banco de dados; o arquivo de docker-compose para container do banco de dados; arquivos de configuração e de variável de ambiente. Outro arquivo essencial para o projeto foi o CLAUDE.MD.
   Nesse projeto, utilizei práticas de Spec-Driven-Development e o arquivo de CLAUDE.MD e os arquivos de documentação de cada módulo, foram essenciais. No CLAUDE.MD citei características gerais do projeto, como arquitetura, stack e padrões gerais.

---

3. Quais dificuldades encontrou?
   Durante o projeto a maior dúvida foi em relação a modelagem do banco de dados e Soft Delete.
   A primeira questão foi quais campos utilizar indíces para acelerar a busca no banco de dados.
   A segunda questão estava relacionado a auditoria. Em casos de POST de uma cidade ou estado já deletado, caso mantivesse campos de name e stateCode como únicos, eu não poderia criar novamente a cidade no banco. Nesse caso, utilizando campos únicos, eu teria que reativar o campo novamente. Nesse caso, perderia histórico relevantes de auditoria. Por outro lado, sem utilizar a abordagem de campos únicos, eu teria que assumir que a responsabilidade de verificação de cidade e estado já existente, seria apenas da minha aplicação. Dessa forma, se duas requisições de criação de cidade/estado chegassem ao mesmo tempo na aplicação, assumindo que não existiam previamente, ambas vão passar pela verificação de cidade/estado já registrada e vão ser criadas. Em outras palavras, ocorreria um problema de race condition. Pensando na simplificação e por se tratar de registros triviais, preferi manter o histórico de auditoria e assumir o risco de ocorrer race conditions, apesar de saber que existem soluções para esse tipo de problema, como uma transação com lock.

---

4. O que faria diferente se tivesse mais tempo?
   Caso tivesse mais tempo, existem alguns pontos de melhoria que gostaria de ter explorado:

   - Normalizar UF:
     Normalizaria o UF para caso o usuário chamasse por "sp", na validação com Zod, já transformaria em Uppercase

   - Seed de dados:
     Popularia o banco chamando a API disponível do IBGE.

   - Rate limit:
     Implementaria algum tipo de rate limit simples, como um algoritmo de janela deslizante com Redis.

   - Autenticação e Autorização:
     Implementaria a autenticação, mantendo público o acesso de leitura e restringindo operações de escrita a usuários autenticados ou autorizados. O que também melhoraria a rastreabilidade dessas operações.

   - Cache:
     Implementaria cache para armazenar cidades ou estados frequentemente procurados, a fim de aliviar a carga no banco

   - Testes E2E:
     Estudaria melhor e implementaria testes E2E para testar o ciclo da aplicação como um todo.

   - Busca parcial:
     Utilizei o Like para buscas parciais com PostgreSQL, mas sei que não é o ideal. Visando escalabilidade, implementar um algoritmo de CDC para replicar nome de cidades e estados em um motor de busca como Meilisearch, Elasticsearch seria o mais indicado. Nesse caso, poderia usar o Debezium para verificar LOGs do PostgreSQL e publicar no Kafka, Kafka para reter os eventos, uma função serverless responsável por consumir os eventos e replicar no Meili. Dessa forma, quando chegasse um query params de name em algum GET, eu poderia fazer a busca no Meili.
     As vantagens dessa implementação são: tolerância a erros de digitação, indistinção entre maiúsculas e minúsculas, ignora acentuação e pontuação, ranking de relevância, velocidade para resposta e alívio de carga no banco de dados principal.

---

5. Como utilizou Inteligência Artificial durante o desenvolvimento?
   Em decorrência do prazo, utilizei e otimizei ao máximo meu desenvolvimento com IA. Como já citado, utilizei de conceitos da metodologia de Spec Driven Development para documentar os principais requisitos e tecnologias que deveria ser utilizadas. Procurei arquitetar a aplicação previamente, e separei em dois tipos de documentos:

   - CLAUDE.MD - Arquivo responsável por especificação geral da aplicação, como convenções, arquitetura, boas práticas e trade-offs.

   - docs/{module}.md - Em cada módulo, existe um arquivo de especificação dizendo suas regras de negócio. Neles, existem especificações como essa presente na documentação de state:
     "impedir a exclusão de estado que possui cidades vinculadas"

---
