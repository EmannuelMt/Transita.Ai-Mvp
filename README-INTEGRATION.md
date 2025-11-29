# Instruções rápidas — rodando frontend e backend (Transita.Ai-Mvp)

Este README descreve como rodar o backend e o frontend localmente, conectar ao MongoDB Compass e verificar integração.

Pré-requisitos
- Node.js LTS (>=18)
- MongoDB local (ou string do MongoDB Atlas)
- Firebase project (para autenticação)

Backend (d:\VSCode\Transita.Ai-Mvp\backend)
1. Verifique o `.env` em `backend/.env` e configure `MONGODB_URI` e `FIREBASE_SERVICE_ACCOUNT` corretamente.
2. Instale dependências (na pasta `backend`):

```powershell
cd D:\VSCode\Transita.Ai-Mvp\backend
npm install
```

3. Rodar em desenvolvimento (nodemon):

```powershell
npm run dev
```

O servidor por padrão roda em `http://localhost:3001` e expõe as rotas:
- `POST /api/consultas` — iniciar consulta de placa
- `GET /api/consultas` — histórico de consultas
- `GET /api/consultas/:id` — detalhes de consulta
- `GET /api/multas` — listar multas do usuário
- `POST /api/pagamentos` — iniciar pagamento
- `POST /api/pagamentos/webhook` — webhook do gateway
- `GET /api/users/me` — perfil do usuário (requer Authorization: Bearer <idToken>)

Frontend (raiz do projeto — Vite)
1. Verifique o arquivo `.env` na raiz do projeto e ajuste `VITE_API_URL` se necessário (padrão: `http://localhost:3001/api`).
2. Instale dependências e rode o servidor Vite:

```powershell
cd D:\VSCode\Transita.Ai-Mvp
npm install
npm run dev
```

O Vite escolherá uma porta livre (por padrão 5173). Abra o endereço mostrado nos logs.

Verificação com MongoDB Compass
- Abra o MongoDB Compass e conecte com a string `mongodb://localhost:27017/transita-ai` (ou a string que estiver em `backend/.env`).
- Verifique as collections: `users`, `consultas`, `multas`, `paymenthistories` (quando geradas).

Testes rápidos
- Crie um usuário no Firebase Auth (email/senha) ou use o fluxo de registro do frontend.
- Faça login no frontend, abra o DevTools -> Network e verifique que as requisições ao backend incluem o header `Authorization: Bearer <idToken>`.
- Realize uma consulta de placa (formulário). Verifique no backend logs e no MongoDB que a `Consulta` e `Multa(s)` foram criadas.

Notas
- Algumas integrações (DETRAN, gateway de pagamento) usam placeholders; é preciso configurar as keys e endpoints reais.
- Se o backend travar por falta de dependência, rode `npm install` na pasta backend e instale os pacotes indicados nas mensagens de erro.

Se quiser, eu posso:
- Gerar scripts adicionais de seed/test, ou
- Ajustar o `AuthContext` para usar a API modular do Firebase v9+, ou
- Adicionar testes automáticos de integração para as rotas principais.
