# Galáxia Camisetas

Aplicação Next.js + PostgreSQL para orçamento público e gestão de atendimento/produção. A logo e a referência originais foram inspecionadas e movidas, sem edição, para `public/brand/`.

## Estado da entrega

Retomada local concluída em 04/10/2026: typecheck, lint, build, 25 testes unitários, 7 testes de integração PostgreSQL e 6 testes de navegador passaram. Capturas desktop/mobile inspecionadas e navegação por teclado verificada no fluxo público. Dependências instaladas e lockfile versionado. Deploy via GitHub/Vercel configurado, com PostgreSQL Neon exclusivo para produção. Banco portátil local e bancos de testes permanecem separados da produção.

## GitHub e Vercel

- Repositório público: https://github.com/jassonmouragt-prog/galaxiacamisetas
- Endereço de produção: https://galaxiacamisetas.vercel.app
- Administração: https://galaxiacamisetas.vercel.app/admin/login
- Branch de produção: `main`. Cada push nessa branch aciona o deploy pela integração Git da Vercel.
- Projeto Vercel `galaxiacamisetas`, equipe `jason-3c4d`, Node 24.x, região `gru1` (São Paulo).
- Banco Neon `galaxia-production`, plano gratuito, região São Paulo. Integração conectada somente ao ambiente Production; Preview precisa de um banco isolado próprio para testar escrita.
- `DATABASE_URL` é fornecida pela integração Neon e `APP_URL` está configurada como `https://galaxiacamisetas.vercel.app` na Vercel.

O administrador inicial de produção foi criado por seed, usando as credenciais locais existentes somente durante esse processo. A senha não está no Git nem foi adicionada como variável permanente de deploy. Migrações 001/002 aplicadas antes da primeira publicação; novas migrações devem ser aplicadas explicitamente ao banco de produção antes do código que depende delas. CI usa PostgreSQL temporário próprio e não acessa o banco de produção.

## Executar localmente

Requisitos: Node >= 22.18, npm e PostgreSQL 17 (ou Docker).

1. `npm ci` (usa as versões verificadas em `package-lock.json`).
2. O workspace já contém `.env.local` não versionado, com o login inicial solicitado e uma senha aleatória para o banco local. Em uma cópia nova, copie `.env.example` para `.env.local` e configure `DATABASE_URL`, `APP_URL`, `ADMIN_EMAIL`, `ADMIN_INITIAL_PASSWORD` e `POSTGRES_PASSWORD`.
3. Se usar Docker, execute `docker compose --env-file .env.local up -d db`. A porta local é 5433. Use a mesma senha de POSTGRES_PASSWORD na URL do banco.
4. Execute `npm run db:migrate` e `npm run db:seed`.
5. Execute `npm run dev` e abra `http://localhost:3000` (deve coincidir com `APP_URL`).

O seed cria apenas o administrador se ele ainda não existir; não altera senha existente. A senha inicial solicitada deve ser colocada exclusivamente em `.env.local`, nunca em código cliente. Após o primeiro acesso, altere-a em Configurações e remova `ADMIN_INITIAL_PASSWORD` do ambiente de produção.

### Tabela provisória autorizada

A migração 002 cadastra WhatsApp **+55 84 99921-5556** e valores provisórios: tradicional R$ 35, dry fit R$ 42, oversized R$ 55; frente e costas R$ 12 por peça, manga R$ 6; arte R$ 80 por orçamento. Mínimo provisório de 10 peças, prazo de 15 dias corridos, validade de 7 dias; desconto de 5% a partir de 30 peças e 10% a partir de 100 peças. Todos são editáveis no painel. O maior desconto elegível é aplicado às peças/estampas, nunca à taxa de arte. A emissão, o resultado e a mensagem WhatsApp indicam valores provisórios. Desmarque essa opção somente após confirmar a tabela comercial.

## Fluxos

- `/`: apresentação da marca original.
- `/orcamento`: evento, modelo, quantidade, personalização, arte, datas e contato.
- `/orcamento/resultado/[code]?token=...`: resultado persistido e protegido por chave de 256 bits. O código comercial isolado não abre dados pessoais.
- `/admin/login`: login com scrypt, limite de tentativas e cookie HttpOnly.
- `/admin`: métricas reais, últimas solicitações e retornos pendentes; atualização a cada 15 segundos.
- `/admin/orcamentos`: pesquisa, filtros, detalhes e retornos; conversão idempotente em pedido.
- `/admin/pedidos`: etapas sequenciais de produção, data de entrega e observações.
- `/admin/calendario`: entregas e follow-ups por mês, com agenda alternativa para celular.
- `/admin/clientes`: contatos consolidados por telefone e histórico.
- `/admin/configuracoes`: catálogo, preços, descontos, prazos, disponibilidade, WhatsApp e senha.

Orçamentos não reservam automaticamente capacidade de produção. Frete, tamanhos, cores e arquivo de arte são confirmados no atendimento. O pedido passa de aguardando arte → arte aprovada → em produção → pronto → entregue; pode ser cancelado antes da entrega. Orçamentos vencidos exigem renovação explícita antes da conversão. Nenhum contato via WhatsApp é enviado automaticamente.

## Verificação

Para diagnosticar dependências e conectividade com o banco sem imprimir credenciais, execute `npm run check:environment`. Esse comando funciona com Node antes de instalar pacotes; não altera o banco.

```sh
npm test
npm run lint
npm run typecheck
npm run build
npm run test:integration
npx playwright install chromium
npm run test:e2e
```

Para integração, defina `DATABASE_TEST_URL` apontando para um banco exclusivo de testes diferente de `DATABASE_URL`. A suíte cria um schema aleatório, aplica as migrações e remove somente esse schema ao terminar. Verifica concorrência na emissão e conversão, snapshots, expiração, validação e rate limit.

Para E2E, use uma cópia isolada do ambiente com `DATABASE_URL` de testes, migrações e seed aplicados. Defina `E2E_ALLOW_WRITES=true` apenas nesse ambiente: o teste completo cria um orçamento e um pedido com prefixo E2E. O navegador não clica no envio externo do WhatsApp. Capturas desktop/mobile vão para `.impeccable/review/`.

## Publicação

Instale dependências com `npm ci`, usando o lockfile versionado, e rode `npm run check`, integração e E2E em bancos isolados antes de publicar alterações. Na retomada, o audit de produção não encontrou vulnerabilidades; o audit completo identificou 5 achados altos na cadeia de desenvolvimento do ESLint (detalhes em `VERIFICACAO.md`). A Vercel executa `npm ci` e `npm run build` conforme `vercel.json`; pushes na `main` acionam publicação automática. O PostgreSQL Neon usa TLS. Configure backup e restauração conforme a operação e o plano contratado, confirme a tabela comercial e mantenha as políticas de dados atualizadas.

Cookies são Secure em produção: a aplicação publicada requer HTTPS. As mutações validam Origin contra APP_URL. O proxy de hospedagem deve limitar tamanho de requisições e taxa por IP; a aplicação também limita tentativas de login e emissão pelo banco. Não habilite cache de páginas administrativas, APIs ou resultados privados. `GET /api/health` verifica acesso à tabela de configuração e retorna 503 se o banco estiver indisponível.

As APIs JSON limitam o corpo a 32 KB durante a leitura, incluindo streams sem Content-Length, e devolvem 413 para excesso. Pedidos entregues ou cancelados permitem atualizar observações, mas a API preserva sua data de entrega e impede reabertura.

Configure política operacional de retenção e atendimento de solicitações sobre dados pessoais; a página pública descreve os usos efetivamente implementados e deve receber a revisão da empresa antes da publicação. Sessões expiram em 8 horas; a troca de senha revoga todas elas. Agende limpeza periódica dos registros expirados em `sessions` e `rate_limits` (SQL em `scripts/maintenance.sql`). A tabela `audit_events` registra ações administrativas sem guardar senhas.

## Estrutura

- `db/migrations`: esquema versionado e catálogo provisório autorizado.
- `src/lib`: domínio, cálculo, validação, acesso PostgreSQL, autenticação e transações.
- `src/app/api`: endpoints com validação, origem e autorização.
- `src/app`: páginas públicas e área protegida.
- `src/components`: formulários e componentes reutilizáveis.
- `tests`: regras, segurança, integração e navegador.
- `PLANO.md`, `PRODUCT.md`, `DESIGN.md`: decisões e análise da identidade.

Referências técnicas consultadas: [autenticação Next.js](https://nextjs.org/docs/app/guides/authentication) e [cookies](https://nextjs.org/docs/app/api-reference/functions/cookies).
