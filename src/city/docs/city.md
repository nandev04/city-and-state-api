# City — regras

Domínio: cidades do Brasil. Feature em src/city/. Regras arquiteturais globais estão no CLAUDE.md da raiz — este arquivo cobre só o específico de city.

# Regras de negócio (estáveis)

Verdade durável do domínio. Não muda de task pra task.

- City tem id autoincrement como PK.
- Campos: id, name, stateId (FK → State), deletedAt DateTime?.
- Índice em stateId (@@index([stateId])) — cidades são consultadas por estado.
- Toda cidade pertence a um estado. stateId é obrigatório.
- Criar/atualizar cidade com stateId que não existe (ou de estado soft-deleted) → 404.
- name é obrigatório e não-vazio (após trim). Nomes de cidade têm acento, espaço e apóstrofo (ex.: "Santa Bárbara d'Oeste"), então sem regex de formato estrito como o stateCode.
- name é único dentro do mesmo estado, entre cidades não deletadas: o par (name, stateId) não se repete. Colisão → 409.
- Mesmo name em estados diferentes é permitido — a unicidade é do par (name, stateId), não do name isolado.
- Soft delete via deletedAt. Toda leitura exclui deletedAt != null por padrão.
- Buscar cidade por id inexistente (ou soft-deleted) → 404.

# Contratos (endpoints)

Formato: método, rota, entrada, sucesso, erros.

- POST /cities — cria cidade.
  Entrada: CreateCityDto (name, stateId).
  Sucesso: 201 + cidade criada.
  Erros: 400 (payload inválido), 404 (stateId inexistente), 409 (name duplicado no estado).

- GET /cities — lista cidades com paginação por cursor.
  Entrada: query opcional stateCode (z.string().length(2)) pra filtrar por estado.
  Sucesso: 200 + array (exclui soft-deleted).
  Erro: 404 (stateCode inexistente).

- GET /cities/:id — busca por id.
  Entrada: param id (z.coerce.number().int().positive()).
  Sucesso: 200 + cidade.
  Erro: 404.

- PATCH /cities/:id — atualiza.
  Entrada: UpdateCityDto (schema de create com .partial()).
  Sucesso: 200.
  Erros: 400, 404 (cidade ou novo stateId inexistente), 409 (name colidindo no estado alvo).

- DELETE /cities/:id — soft delete.
  Sucesso: 204.
  Erro: 404.
