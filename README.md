# EventHub MVC

Sistema monolítico MVC para cadastro de eventos e inscrições, usando Node.js, Express, EJS e MySQL.

## Recursos

- Cadastro e login com senha protegida por bcrypt.
- Sessões com cookie `httpOnly` e rotas de organizador protegidas.
- CRUD de eventos e inscrições de participantes.
- Consultas parametrizadas com `mysql2`, validação/sanitização de entradas e tratamento centralizado de erros.
- Documentação disponível em `/api-docs`.

## Executar localmente

1. Crie um banco MySQL e execute o arquivo `database.sql`.
2. Copie `.env.example` para `.env` e preencha as variáveis.
3. Instale e execute:

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Variáveis de ambiente

| Variável                            | Descrição                                 |
| ----------------------------------- | ----------------------------------------- |
| `PORT`                              | Porta do servidor (padrão 3000)           |
| `SESSION_SECRET`                    | Segredo longo usado para assinar a sessão |
| `DB_HOST`, `DB_PORT`                | Host e porta MySQL                        |
| `DB_NAME`, `DB_USER`, `DB_PASSWORD` | Credenciais do banco                      |
| `DB_SSL`                            | Use `true` no banco em nuvem com SSL/TLS  |
| `NODE_ENV`                          | Use `production` no deploy                |

## Deploy

No Render/Railway, crie um Web Service com Build Command `npm install` e Start Command `npm start`. Configure todas as variáveis acima, aponte para um banco MySQL gerenciado e defina `DB_SSL=true` se o provedor exigir TLS.
