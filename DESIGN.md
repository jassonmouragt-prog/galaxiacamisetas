---
name: Galáxia Camisetas
description: Identidade cósmica com operação clara e legível.
colors:
  background: "#170D30"
  background-secondary: "#30186B"
  surface: "#FFF"
  surface-hover: "#F4F0FD"
  border: "#DDD4ED"
  primary: "#6A35D9"
  primary-hover: "#5424BA"
  secondary: "#8E62F5"
  accent: "#FF8A00"
  text: "#251A39"
  text-muted: "#685978"
  success: "#176541"
  warning: "#855000"
  danger: "#A5243D"
  on-dark: "#FFF"
  muted-on-dark: "#D1BFEA"
  admin-background: "#F7F5FA"
  success-surface: "#E4F5EC"
  warning-surface: "#FFF3DA"
  danger-surface: "#FDEBF0"
typography:
  display:
    fontFamily: "Titan One, sans-serif"
    fontSize: "clamp(44px, 5.5vw, 76px)"
    fontWeight: 400
    lineHeight: 1.12
    letterSpacing: "-.035em"
  body:
    fontFamily: "Montserrat, sans-serif"
    fontSize: "14px"
    lineHeight: 1.65
rounded:
  field: "8px"
  button: "9px"
  choice: "10px"
  surface: "14px"
spacing:
  compact: "12px"
  normal: "20px"
  section: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.button}"
    padding: "12px 21px"
  input:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.field}"
    padding: "11px 13px"
---
# Design System: Galáxia Camisetas

## Overview

A autoridade é `public/brand/identity-reference.png`, junto de `public/brand/logo.png`. A identidade combina referências cósmicas e detalhes pixelados pontuais com formulários e tabelas de leitura direta. Os arquivos originais da marca devem permanecer intactos. Construção diretamente em código confirmada pelo cliente, registrada em `.impeccable/config.json`; contexto de produto em `PRODUCT.md`.

Documentação extraída de `src/app/globals.css`. Na retomada de 04/10/2026, a aplicação foi renderizada com PostgreSQL local: capturas desktop (1440px) e mobile (390px) em `.impeccable/review/` foram inspecionadas, com fontes e logo carregadas e composição sem recortes evidentes. Passaram 25 testes unitários, 7 de integração e 6 E2E, incluindo teclado e foco visível no fluxo público. A verificação foi direcionada e não certifica contraste de todos os estados ou conformidade WCAG completa; detalhes em `VERIFICACAO.md`.

**Key Characteristics:**

- Marca oficial como referência principal.
- Fundos profundos nas superfícies públicas e claros na operação.
- Tipografia expressiva nos destaques e legibilidade nos dados.

## Colors

### Primary

Roxo Galáxia identifica ações principais; Laranja órbita destaca chamadas e foco de teclado.

### Secondary

Roxo Nebulosa compõe contornos e detalhes. Roxo Profundo estrutura navegação e fundos de marca.

### Neutral

Branco Estelar forma superfícies operacionais. Tons claros de roxo distinguem hover e bordas; texto escuro e texto secundário sustentam a hierarquia. Sucesso, atenção e erro usam pares próprios de texto e fundo, acompanhados de mensagens explícitas.

## Typography

**Display Font:** Titan One, com fallback sans-serif.

**Body Font:** Montserrat, com fallback sans-serif.

Titan One aparece no destaque público; títulos operacionais, formulários e dados usam Montserrat. Parágrafos têm limite geral de 72ch. Títulos gerais usam peso 700, entrelinha 1.2 e tamanho de 34px; subtítulos usam 21px. Rótulos de formulário usam 12px e peso 600. A escala varia por componente e breakpoint, conforme CSS.

## Layout

A composição pública implementada usa duas colunas, chamada é esquerda e marca em órbita geométrica é direita. Os contêineres públicos chegam a 1320px; a área operacional chega a 1480px, com navegação lateral. Formulários usam grades de duas ou três colunas conforme o contexto.

O CSS adapta a composição em 1200px, 900px e 640px; a partir de 1500px amplia o destaque público. Em 640px, as composições principais tornam-se uma coluna e a navegação administrativa passa a menu móvel. Tabelas e calendário preservam rolagem horizontal. O espaçamento usa valores contextuais, incluindo 12, 20 e 24px; não há uma escala exclusiva de múltiplos de quatro.

## Elevation & Depth

A operação usa principalmente contraste de superfícies e bordas. O token de elevação existe no CSS, mas não está aplicado aos painéis. O planeta decorativo usa gradiente radial e sombra interna; órbitas e silhuetas circulares dão profundidade ao destaque público.

## Shapes

Painéis usam o raio de superfície; botões e campos têm raios menores. Bordas predominantes têm 1px. Escolhas usam contorno reforçado ao selecionar. Status usam cantos de 6px; órbitas, indicadores e avatares são circulares. A logo não recebe redesenho ou efeitos pixelados.

## Components

### Buttons

Ações principais usam roxo e texto branco; ações destacadas usam laranja e texto escuro. Botões secundários usam superfície clara e contorno. A altura mínima geral é 46px, ou 44px na variante pequena. Hover altera fundo e desloca o botão 1px; foco usa contorno laranja de 3px com afastamento de 4px. Desabilitado reduz opacidade e mostra cursor de espera.

O refinamento em `src/app/brand-refinements.css` mantém o shape arredondado e acrescenta gradiente tonal, highlight interno e um microdetalhe em degraus de 2px no canto superior. PRIMARY e CTA laranja têm presença maior; SECONDARY usa superfície suave com borda; GHOST permanece transparente. Links de ação como “Abrir” recebem acabamento leve de botão e área mínima de 44px. Ícones dos botões têm 18px. Não há contorno totalmente pixelado nem sombras rígidas exageradas; hover, pressionado, desabilitado, foco e movimento reduzido preservam o comportamento acessível.

### Cards / Containers

Painéis usam fundo branco, borda sutil, raio de superfície e preenchimento de 26px no desktop, reduzido no móvel. Os cartões de métricas mantêm números tabulares. Estados vazios contém descrição explícita.

### Inputs / Fields

Campos têm fundo branco, borda sutil, altura mínima de 46px e preenchimento de 11px por 13px. O foco compartilha o contorno global; erros usam bloco textual com cores de perigo. Checkboxes e radios mantêm dimensões próprias: a documentação não presume que todos os alvos da interface tenham 44px.

### Navigation

A navegação operacional usa fundo profundo, texto claro e estado ativo roxo. Links recebem fundo tonal no hover. Em telas pequenas, o menu é aberto por controle próprio. A navegação pública reduz os links disponíveis no cabeçalho móvel.

Sidebar, faixa mobile e branding do login compartilham uma atmosfera galáctica estática: base roxa, três gradientes radiais de baixa intensidade, oito estrelas esparsas subpixel e uma órbita elíptica quase transparente. As camadas decorativas não interceptam cliques e ficam atrás do conteúdo. O item ativo usa gradiente roxo, borda discreta, sombra difusa leve e o mesmo acento em degraus dos botões. A tabela mantém seus rótulos acessíveis posicionados no próprio contêiner de rolagem, evitando expansão da página no mobile.

### Chips

Status são rótulos compactos com texto explícito, preenchimento de 5px por 10px e pares de cores semânticas. Não são controles interativos.

### Motion

Transições de botão duram 0.18s; escolhas usam 0.15s. O indicador de carregamento gira em ciclo de 1s. A preferência por movimento reduzido desativa animações, transições, rolagem suave e deslocamento de hover.

O planeta da página inicial flutua até 9px e oscila entre -1° e 1° em um ciclo de 10s; as duas órbitas oscilam suavemente em ciclos de 18s e 24s. O movimento usa apenas transformações CSS. Um controle fixo ao lado do planeta permite pausar/retomar; a animação pausa fora da área visível e com a aba oculta. Com movimento reduzido, a composição fica estática e o controle não é exibido. Capturas verificadas em `.impeccable/review/desktop-motion.png` e `mobile-motion.png`.

## Do's and Don'ts

### Do:

- **Do** preservar os arquivos oficiais da marca e usar a referência de identidade como autoridade.
- **Do** manter estados de carregamento, vazio, indisponibilidade e erro explícitos.
- **Do** identificar valores provisórios de forma visível, conforme `PRODUCT.md`.
- **Do** verificar a interface em navegador antes de declarar a validação visual concluída.

### Don't:

- **Don't** pixelar ou redesenhar a logo oficial.
- **Don't** apresentar preços provisórios como tabela confirmada.
- **Don't** substituir mensagens de estado apenas por cores.
