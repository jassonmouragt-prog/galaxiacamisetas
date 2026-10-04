# Plano de implementação

## Inspeção
O projeto começou exclusivamente com `logo galaxia camisetas sem fundo.png` e `identidade visual.png`, ambos inspecionados visualmente. Não existe código anterior a preservar. Os originais serão organizados em public/brand sem alteração de conteúdo.

## Etapas
1. Fundação: Next.js, TypeScript, PostgreSQL, migração SQL versionada, sessões opacas no banco e senha com scrypt.
2. Domínio: catálogo e preços configuráveis, valores em centavos, desconto por volume, prazo mínimo, validações de datas, orçamento transacional, código sequencial e link privado aleatório.
3. Público: página inicial, formulário guiado e resultado com mensagem WhatsApp gerada a partir do registro persistido.
4. Operação: dashboard, filtros, detalhes, conversão idempotente em pedido, etapas de produção, calendário, clientes e follow-ups persistidos.
5. Configuração e entrega: catálogo comercial, segurança de sessão, testes unitários e integração PostgreSQL, teste do fluxo no navegador, lint/typecheck/build.

## Decisões
Next.js App Router com backend no mesmo projeto; pg com SQL parametrizado; PostgreSQL como única persistência de negócio. Instância PostgreSQL local isolada para desenvolvimento e testes, DATABASE_URL para produção. Não haverá leads ou pedidos de exemplo no banco operacional. Após esclarecimento, o cliente autorizou tabela provisória editável e forneceu o WhatsApp; a migração 002 inclui essa configuração com aviso explícito.

## Segurança
Autorização em cada operação administrativa, cookies HttpOnly/SameSite, validação de origem em mutações, limitação de tentativas persistida, token de resultado imprevisível para não expor dados pessoais através de códigos sequenciais, snapshots de preço e transações na conversão.
