<h1 align="center">🏙️ City and State API</h1>

<p align="center">
  API REST para operações CRUD de <strong>estados</strong> e <strong>cidades</strong>, construída com NestJS, Prisma e PostgreSQL.
</p>

<p align="center">
  <img alt="NestJS" src="https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white">
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma&logoColor=white">
  <img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-18-4169E1?logo=postgresql&logoColor=white">
  <img alt="Docker" src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white">
</p>

---

## 📑 Sumário

- [Como executar](#-como-executar)
- [Documentação](#-documentação)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Estrutura do projeto](#-estrutura-do-projeto)
- [Decisões técnicas](#-decisões-técnicas)

---

## 🚀 Como executar

> Pré-requisitos: **Node.js**, **pnpm** e **Docker** instalados.

**1.** Clone o repositório:

```bash
git clone <url-do-repositório>
cd city-and-state-api
```

**2.** Copie o arquivo de variáveis de ambiente e preencha os valores:

```bash
cp .env.example .env
```

**3.** Instale as dependências:

```bash
pnpm install
```

**4.** Suba o container do banco de dados:

```bash
docker compose up
```

**5.** Inicie o servidor:

```bash
pnpm start
```

---

## 📖 Documentação

A documentação da aplicação está disponível em:

🔗 **[http://localhost:3000/docs](http://localhost:3000/docs)**

Pela documentação é possível **testar requisições**, **verificar endpoints** e seus **respectivos filtros**.

---

## 🛠️ Tecnologias utilizadas

| Tecnologia        | Descrição                                        |
| ----------------- | ------------------------------------------------ |
| 🚀 **NestJS**     | Framework Node.js para aplicações escaláveis     |
| ✅ **Zod**        | Validação de dados                               |
| 🧩 **nestjs-zod** | Automatiza criação de classes baseadas em schema |
| 📝 **Swagger**    | Documentação da API                              |
| 🧪 **Jest**       | Testes unitários                                 |
| 🛢️ **PostgreSQL** | Banco de dados relacional                        |
| 🗄️ **Prisma**     | ORM                                              |
| 🐳 **Docker**     | Conteinerização                                  |
| 📮 **Insomnia**   | Cliente HTTP para requisições                    |

---

## 🗂️ Estrutura do projeto

A organização segue o **padrão modular do NestJS**, separando a aplicação por domínio. Cada módulo contém:

| Pasta / Arquivo     | Responsabilidade                                           |
| ------------------- | ---------------------------------------------------------- |
| `contracts/`        | Classes abstratas que definem o contrato do repositório    |
| `decorators/`       | Decorators do Swagger agrupados por endpoint               |
| `docs/`             | Regras de negócio específicas do módulo (contexto para IA) |
| `dto/`              | Schemas Zod e DTOs de entrada/saída                        |
| `repositories/`     | Implementação da camada de repositório                     |
| `*.controller.ts`   | Camada de controller                                       |
| `*.service.ts`      | Camada de service (regras de negócio)                      |
| `*.service.spec.ts` | Testes unitários da service                                |

---

## 🧠 Decisões técnicas

### 1. Por que escolheu esse framework?

Apesar de ter mais prática com **Express** e apenas noções de **NestJS** inicialmente, vi neste desafio uma boa oportunidade para desenvolver minha prática com NestJS.

Além disso, o setup estruturado me permitiu acelerar o desenvolvimento e aumentar a confiabilidade do desenvolvimento orientado por IA. Recursos como a **CLI do Nest** auxiliam muito na construção base da aplicação. Bibliotecas como **Swagger** e **Zod** também integram muito bem com NestJS, permitindo fazer a validação de dados e gerar a documentação de forma muito rápida.

---

### 2. Como organizou o projeto?

Utilizei **arquitetura modular**, conforme o padrão do NestJS. Cada módulo contém seus próprios contratos, decoradores, documentação, repositório, controller, service, testes e arquivo de módulo.

- **contracts** — Contém o contrato que a camada de repositório deve implementar, aplicando a letra **D** do **SOLID** (Princípio da Inversão de Dependência), facilitando o mock em testes unitários e uma possível troca de implementação futura.
- **decorators** — Agrupei os decorators do Swagger por endpoint, resultando em um controller limpo e maior facilidade de manutenção.
- **docs** — Contém a especificação da regra de negócio do respectivo módulo, facilitando o contexto para uso de IA no desenvolvimento.
- **dto** — Objetos de transferência de dados, responsáveis por definir e validar o formato de entrada/saída dos endpoints.
- **repositories** — Implementação da camada de repositório, implementando a classe abstrata localizada em `contracts`.

Na raiz do projeto temos a pasta do **Prisma** (migrations e schema), o `docker-compose.yml` para o container do banco, arquivos de configuração e variáveis de ambiente. Outro arquivo essencial foi o **CLAUDE.md**.

Nesse projeto utilizei práticas de **Spec-Driven Development**: o `CLAUDE.md` e os arquivos de documentação de cada módulo foram fundamentais. No `CLAUDE.md` citei características gerais do projeto, como arquitetura, stack e padrões gerais.

---

### 3. Quais dificuldades encontrou?

A maior dúvida foi em relação à **modelagem do banco de dados** e ao **Soft Delete**:

- **Índices:** Quais campos deveriam receber índices para acelerar as buscas.
- **Auditoria vs. unicidade:** Em casos de `POST` de uma cidade ou estado já deletado, se mantivesse `name` e `stateCode` como únicos no banco, não seria possível criar o registro novamente — teria que reativar o antigo, perdendo o histórico de auditoria.

Por outro lado, **sem** campos únicos no banco, a responsabilidade de verificação de duplicidade fica na aplicação, o que abre espaço para **race conditions** se duas requisições chegarem simultaneamente.

Optei pela **simplificação**, mantendo o histórico de auditoria e assumindo o risco da race condition — apesar de saber que soluções como **transação com lock** existem para esse tipo de problema.

---

### 4. O que faria diferente se tivesse mais tempo?

- **Rate limit:** Implementar rate limit simples com algoritmo de janela deslizante usando Redis.
- **Autenticação e Autorização:** Manter leitura pública e restringir operações de escrita a usuários autenticados, melhorando também a rastreabilidade.
- **Cache:** Armazenar cidades e estados frequentemente consultados, aliviando a carga no banco.
- **Testes E2E:** Cobrir o ciclo completo da aplicação.
- **CI com GitHub Actions:** Implementar uma pipeline simples para garantir que os testes passem antes do merge na `main`.
- **Busca parcial escalável:** Usei `LIKE` do PostgreSQL para buscas parciais, mas não é o ideal. Para escalar, implementaria um pipeline de **CDC** replicando os dados em um motor de busca como **Meilisearch** ou **Elasticsearch**:
  - **Debezium** lendo os logs do PostgreSQL;
  - **Kafka** retendo os eventos;
  - Uma **função serverless** consumindo e replicando no Meili.

  Vantagens: tolerância a erros de digitação, case-insensitive, ignora acentuação e pontuação, ranking de relevância, alta velocidade e alívio de carga no banco principal.

---

### 5. Como utilizou Inteligência Artificial durante o desenvolvimento?

Em decorrência do prazo, otimizei ao máximo meu desenvolvimento com IA. Utilizei conceitos da metodologia **Spec-Driven Development**, documentando previamente os principais requisitos e tecnologias. Arquitetei a aplicação antes de codar e separei a documentação em dois níveis:

- **`CLAUDE.md`** — Especificação geral da aplicação: convenções, arquitetura, boas práticas e trade-offs.
- **`docs/{module}.md`** — Em cada módulo, um arquivo especificando suas regras de negócio. Exemplo, na documentação de `state`:
  > _"impedir a exclusão de estado que possui cidades vinculadas"_

Além disso, utilizei **`git worktree`** para desenvolver algumas funcionalidades em paralelo, mantendo branches isoladas em diretórios distintos e otimizando o tempo de entrega.

---

<p align="center">
  Feito por <strong>Renan Alves</strong>
</p>
