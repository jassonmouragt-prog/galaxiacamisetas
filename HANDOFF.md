# Passagem para o próximo ambiente

## Retomada executada em 04/10/2026

Aplicação validada localmente com Node 24.21.0, npm 11.19.0 e PostgreSQL 17.6 portátil, autorizado pelo usuário. O bloqueio anterior de acesso ao npm foi superado. Dependências instaladas e `package-lock.json` gerado. Na retomada inicial a pasta não tinha Git; posteriormente o usuário solicitou publicação e o projeto/lockfile foram versionados no repositório público abaixo.

## Publicação via Git

- **Publicação concluída em 04/10/2026** pelo push na `main`, com deploy Production Ready e alias HTTPS `galaxiacamisetas.vercel.app` confirmado.
- GitHub: https://github.com/jassonmouragt-prog/galaxiacamisetas (público, branch `main`).
- Vercel: projeto `galaxiacamisetas`, equipe `jason-3c4d`, conectado ao GitHub para deploy automático.
- Domínio de produção: https://galaxiacamisetas.vercel.app ; admin em `/admin/login`.
- PostgreSQL Neon `galaxia-production`, plano gratuito autorizado pelo usuário, região `gru1`. Produção não depende do banco portátil deste computador.
- Migrações 001/002 e seed administrativo aplicados no Neon. Credenciais usadas via processo temporário, sem impressão ou inclusão no repositório.
- `APP_URL` de produção configurada na Vercel; conexão PostgreSQL fornecida pela integração Neon somente para Production.
- `vercel.json` fixa Next.js, `npm ci`, build e região São Paulo; workflow GitHub usa `npm ci` e PostgreSQL próprio para testes.
- Validações completas reexecutadas após a animação: typecheck, lint, build, 25 unitários, 7 integração e 6 E2E passaram. Typecheck gera os tipos Next.js antes de compilar, inclusive em checkout novo.
- Ignorados no Git: `.env.local`, `.vercel`, caches, resultados/capturas locais, skills instaladas pela integração e ZIP antigo. 79 arquivos preparados foram conferidos contra credenciais locais e de produção antes do commit inicial.
- Smoke no domínio final passou: health/banco, home animada, formulário, login administrativo, cookie Secure/HttpOnly, orçamentos, configurações, logout e mobile. Nenhum orçamento ou pedido de teste foi criado em produção.
- CI GitHub completo passou: https://github.com/jassonmouragt-prog/galaxiacamisetas/actions/runs/37225674074 . O administrador online utiliza as mesmas credenciais iniciais locais, até alteração pelo painel.

Para próximas alterações: verificar status/diff, validar em bancos isolados, aplicar novas migrações de forma controlada e fazer push na `main` para publicação. Não executar E2E com escrita no banco Neon de produção. Preview ainda não possui banco próprio conectado.

WhatsApp confirmado: **+55 84 99921-5556**. Valores continuam provisórios e editáveis, identificados na interface e no WhatsApp. Assets oficiais preservados em `public/brand/`. `.env.local` contém as credenciais locais e permanece ignorado pelo Git.

## Validações concluídas

- `npm run check:environment`: passou com o PostgreSQL ativo.
- `npm run db:migrate`: migrações 001 e 002 aplicadas no banco local `galaxia`.
- `npm run db:seed`: administrador inicial criado a partir das variáveis existentes.
- `npm run check`: typecheck → lint → 25 testes unitários → build, todos passaram.
- Integração: 7 testes passaram no banco exclusivo `galaxia_integration`; schema temporário removido pela suíte.
- Chromium instalado; E2E: 6 testes passaram no banco exclusivo `galaxia_e2e`, incluindo orçamento persistido, resultado privado, login, conversão, atualização do pedido e calendário.
- Capturas desktop (1440px) e mobile (390px) inspecionadas em `.impeccable/review/desktop.png` e `mobile.png`; logo e fontes renderizadas, sem recortes evidentes. Ausência de overflow horizontal mobile também verificada pelo teste.
- Teclado: link de pular conteúdo, CTA, radios, foco visível e avanço do orçamento verificados com preferência por movimento reduzido. Isso é uma verificação direcionada, não uma certificação WCAG completa.
- `npm audit --omit=dev`: zero vulnerabilidades. Audit completo: 5 achados altos na cadeia de desenvolvimento ESLint → fast-glob → micromatch → braces; a correção automática proposta faria downgrade incompatível do eslint-config-next.

## Correções realizadas

- Imports de `@next/env` compatíveis com execução ESM no Node 24 nos scripts, integração e configuração Playwright.
- Tipos dos streams nos testes HTTP compatíveis com TypeScript instalado.
- Seletores E2E alinhados aos nomes acessíveis do link de orçamento e do seletor de etapa.
- Teste de teclado adicionado; ordem de `npm run check` ajustada para validação sequencial.
- Next.js adicionou `.next/dev/types/**/*.ts` ao `tsconfig.json` durante o build.

## Banco portátil neste computador

Binários e dados estão fora do OneDrive, em `C:\Users\jasso\AppData\Local\Temp\opencode\galaxia-postgres17`. A instância usa apenas 127.0.0.1:5433, autenticação SCRAM, 64 MB de shared_buffers e no máximo 30 conexões. O banco `galaxia` recebeu somente migrações e administrador; os registros E2E estão em `galaxia_e2e`.

O servidor PostgreSQL e os processos temporários Node foram encerrados após os testes. Os dados estão preservados, mas a localização é temporária e não deve ser usada como armazenamento de produção.

Execute os comandos abaixo **na pasta do projeto**, um de cada vez:

```powershell
# Reiniciar o banco portátil após esta sessão
node "C:\Users\jasso\AppData\Local\Temp\opencode\galaxia-local-db.mjs" init
npm run check:environment
npm run dev

# Após encerrar npm run dev, executar testes isolados, se necessário
node "C:\Users\jasso\AppData\Local\Temp\opencode\galaxia-local-db.mjs" integration
node "C:\Users\jasso\AppData\Local\Temp\opencode\galaxia-local-db.mjs" e2e

# Encerrar o banco
node "C:\Users\jasso\AppData\Local\Temp\opencode\galaxia-local-db.mjs" stop
```

O helper é local a este computador, lê `.env.local` sem imprimir credenciais e configura o isolamento dos testes somente nos processos filhos. `init` deve ser usado com a instância parada. Em outra máquina, siga `README.md` com PostgreSQL próprio ou Docker e `npm ci`.

## Próxima etapa

### Ajuste posterior: planeta animado e orçamento disponível

A pedido do usuário, o planeta e suas órbitas receberam movimento suave via CSS, com controle de pausa, parada automática fora da tela/aba oculta e versão estática para movimento reduzido. Implementação em `src/components/planet-brand.tsx`, utilizada pela marca grande da home; sem biblioteca adicional de animação. Validação direcionada no Chromium desktop/mobile confirmou movimento real, pausa/retomada, pausa fora da tela, movimento reduzido e ausência de overflow. Capturas `desktop-motion.png` e `mobile-motion.png` em `.impeccable/review/`.

O usuário encontrou a mensagem de orçamento indisponível porque o PostgreSQL havia sido encerrado ao concluir a validação inicial. A instância foi reiniciada: `/api/health` retornou `{"status":"ok"}` e o formulário de orçamento foi confirmado no navegador. **Neste estado posterior, o banco está ativo para acompanhar o servidor de desenvolvimento aberto pelo usuário.** Encerrá-lo enquanto o site estiver em uso volta a indisponibilizar orçamento e administração. As verificações globais registradas acima antecedem este ajuste; o ajuste foi validado diretamente no navegador.

A execução local do handoff e a publicação GitHub/Vercel estão concluídas. Como continuidade operacional, tratar os achados de dependências de desenvolvimento, definir backup/restauração compatíveis com o plano Neon, confirmar a tabela comercial e revisar as políticas de dados conforme README. Permanecem avisos não bloqueantes do Next.js sobre preload da logo/LCP e declaração de scroll suave; o detector visual sinalizou escala tipográfica parcialmente descrita no frontmatter e a fonte Montserrat, que faz parte da identidade aprovada.

O ZIP `galaxia-camisetas-handoff.zip` continua sendo o snapshot **anterior** à retomada; não contém estas correções, lockfile ou resultados. O estado atual está nesta pasta. `VERIFICACAO.md` detalha a validação.
