# Estrutura proposta — backend (Transita.Ai-Mvp/backend)

Este arquivo descreve a estrutura recomendada para o backend e passos seguros para reorganização.

Estrutura proposta (minimal e prática):

- `backend/`
  - `src/`
    - `config/` — configuração do DB, variáveis de ambiente
    - `controllers/` — lógica dos endpoints (separar responsabilidades)
    - `routes/` — definições de rotas (apenas mapeamento para controllers)
    - `models/` — modelos (Mongoose / ORMs)
    - `services/` — integração com serviços externos e regras de negócio reutilizáveis
    - `middleware/` — middlewares express (autenticação, upload, validação)
    - `utils/` — helpers genéricos
    - `integrations/` — conectores externos (opcionais)
    - `legacy_models/` — modelos antigos (manter histórico até migrar)
    - `seed.js`, `index.js`, `app.js` — pontos de entrada e scripts utilitários

Boas práticas e passos seguros
1. Não mover arquivos ainda; use o `backend/src/middleware/index.js` criado para centralizar middlewares.
2. Criar branches para cada fase do refactor (ex.: `reorg/backend/move-controllers`).
3. Mover arquivos em pequenos lotes e atualizar os imports no mesmo commit.
4. Rodar testes e lint após cada lote.
5. Remover pastas vazias apenas quando confirmar que não existem imports apontando para elas.

Observações
- O projeto atualmente contém tanto `middleware/` quanto `middlewares/`. O arquivo `src/middleware/index.js` facilita a compatibilidade entre as duas convenções ao exportar ambos os conjuntos de middlewares.
- Mantenha as rotas simples — elas devem apenas delegar ao controller apropriado.
