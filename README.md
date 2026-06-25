# C3GRD — Projeto de Produção

Sistema de Gestão de Registro de Documentos da C3 Engenharia & Soluções, conectado ao Supabase (banco + storage) com login nativo seguro.

## Estrutura

```
c3grd-app/
├── index.html            # página base
├── package.json          # dependências
├── vite.config.js        # configuração de build
└── src/
    ├── main.jsx          # ponto de entrada
    ├── supabase.js       # camada de conexão (banco, storage, auth, numeração)
    └── C3GRD.jsx         # aplicação (interface)
```

## Como o sistema usa o Supabase

- **Numeração GRD**: a função `proximo_grd()` no banco entrega números sequenciais infinitos, atômicos (nunca repetem).
- **Dados**: tabelas `grds`, `colaboradores`, `destinatarios`, `logs`.
- **Arquivos PDF**: bucket `grds` no Storage (o banco guarda só o caminho).
- **Login**: autenticação nativa do Supabase (e-mail + senha).
- **Hash SHA-256**: calculado no navegador para integridade.

## Variáveis de ambiente (na Vercel)

- `VITE_SUPABASE_URL` = https://jeekwlmqxkxdjdwaiaeu.supabase.co
- `VITE_SUPABASE_KEY` = (a chave publishable)

(Há um fallback embutido em `src/supabase.js`, então funciona mesmo sem configurar as variáveis — mas o ideal é configurá-las na Vercel.)

## Rodar localmente (opcional, para quem quiser testar no PC)

```
npm install
npm run dev
```

## Publicar (Vercel)

Veja o guia FASE3_Vercel.md.
