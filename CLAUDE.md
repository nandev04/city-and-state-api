# CITY AND STATE API

API REST com operações CRUD de estados e cidades

# STACK

- NESTJS v11 / TypeScript
- Prisma ORM + PostgreSQL 18 (Docker)
- Validação de dados com Zod + nestjs-zod v5
- @nestjs/swagger

# ESTRUTURA

- Organização feature-based (por domínio). Cada feature tem sua própria pasta com controller, service, contracts (abstract class), repository e DTOs.
- O padrão de nomenclatura de DTOs é {operação-domínio.dto.ts}.
- O padrão de nomenclatura de abstract (DI) é {domínio-repository.abstract.ts}.
- classes abstratas do repositorio devem ser criadas em contracts.
- classes de implementação de repository devem ser criadas em repositories.
- Padrão de nomenclatura sempre em inglês.

# TESTES

- Utilize testes unitários para validar a regra de negócio na service de todo domínio.

# Invariantes de arquitetura

Estas regras valem para toda task. Não as contrarie sem eu pedir explicitamente.

Injeção de dependência

- Repositórios são injetados por abstract class como token de DI, no padrão { provide: StateRepository, useClass: PrismaStateRepository }.
- Nunca use interface do TypeScript como token, apenas abstract class.
- Unicidade lógica é responsabilidade da aplicação, não constraint de banco. Motivo: soft delete mantém a linha física, então unique de banco enforça "único no armazenamento" e não "único entre vivos". Checagem de duplicata roda no service, filtrando deletedAt IS NULL. Trade-off assumido: race de criação concorrente não é tratada; consequência (registro duplicado) é trivial e reversível, não justifica a proteção.

# Desacoplamento

- Desacople só no boundary do banco (repository). Ali a troca de implementação é um cenário mais provável, o que justifica o desacoplamento.

# Entidades

- Os tipos gerados pelo Prisma servem como entidades diretamente.
- Não crie entidade de domínio separada.

# Validação de dados

- Zod é a fonte única de verdade: validação + geração de schema OpenAPI, via nestjs-zod.
- DTOs usam createZodDto(schema). O z vem do pacote zod.
- Update DTOs usam .partial() no schema, não PartialType.
- ZodValidationPipe é registrado global via APP_PIPE no AppModule. Não use useGlobalPipes() (são mutuamente exclusivos; APP_PIPE roda dentro do DI).
- Path params: z.coerce.number().int().positive() num DTO via createZodDto, injetado com @Param(). .positive() (PK autoincrement começa em 1), não .nonnegative().

# Documentação

- Decoradores Swagger vivem só no boundary HTTP: controllers e DTOs.
- Nunca coloque decorador de Swagger em service, repository ou lógica de negócio.
- Comportamento de rota: @ApiOperation. Sucesso: @ApiOkResponse / @ApiCreatedResponse. Erros: @ApiBadRequestResponse, @ApiNotFoundResponse, etc.

# Persistência

- Soft delete via coluna deletedAt DateTime?
- Toda leitura exclui registros com deletedAt != null por padrão.
- PKs são id autoincrement.

# Regras de negócio por feature

- As regras de negócio de cada domínio ficam em docs/{feature}.md.
- Quando eu apontar o caminho de um doc no prompt, leia o arquivo e aplique as regras dele.
- Regra que cruza domínios mora no domínio que executa a operação (ex.: "cidade exige stateId de estado existente" pertence a cities, não a states).
