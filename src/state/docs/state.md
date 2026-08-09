# State — regras

Domínio: estados do Brasil. Feature em src/state/. Regras arquiteturais globais estão no CLAUDE.md da raiz — este arquivo cobre só o específico de state.

# Regras de negócio (estáveis)

Verdade durável do domínio. Não muda de task pra task.

- State tem id autoincrement como PK.
- Campos: id, name, stateCode (UF, 2 letras maiúsculas), deletedAt DateTime?.
- stateCode é única entre estados não deletados. Criar/atualizar com UF já existente → 409.
- stateCode deve casar ^[A-Z]{2}$. Fora do padrão → 400.
- Soft delete via deletedAt. Toda leitura exclui deletedAt != null por padrão.
- Buscar estado por id inexistente (ou soft-deleted) → 404.
- impedir a exclusão de estado que possui cidades vinculadas

# Contratos (endpoints)

Formato: método, rota, entrada, sucesso, erros.

- POST /states — cria estado.
  Entrada: CreateStateDto (name, stateCode).
  Sucesso: 201 + estado criado.
  Erros: 400 (payload inválido), 409 (UF duplicada).

- GET /states — lista estados com paginação por cursor.
  Sucesso: 200 + array (exclui soft-deleted).

- GET /states/:id — busca por id.
  Entrada: param id (z.coerce.number().int().positive()).
  Sucesso: 200 + estado.
  Erro: 404.

- PATCH /states/:id — atualiza.
  Entrada: UpdateStateDto (schema de create com .partial()).
  Sucesso: 200.
  Erros: 400, 404, 409.

- DELETE /states/:id — soft delete.
  Sucesso: 204.
  Erro: 404.
