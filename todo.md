# BARRIGAFIT - TODO

## Setup & Config
- [x] Configurar tema de cores (preto/magenta)
- [x] Atualizar theme.config.js
- [x] Configurar icon-symbol.tsx com todos os ícones necessários
- [x] Instalar expo-linear-gradient
- [x] Criar dados mock (programas, exercícios, progresso)
- [x] Configurar AsyncStorage para persistência local

## Telas
- [x] Splash Screen com logo animado
- [x] Onboarding (3 slides com benefícios)
- [x] Chat IA Inicial (fluxo guiado)
- [x] Dashboard (Home) com aula do dia e progresso
- [x] Lista de Programas
- [x] Detalhes do Programa (semanas/dias)
- [x] Tela da Aula (player + instruções)
- [x] Biblioteca de Aulas com filtros
- [x] Progresso (gráficos + streak)
- [x] Configurações / Perfil
- [x] Cross-sell / Descobrir (HORMONE-SYNC, CORE PRO, GLUTE LAB)

## Navegação
- [x] Tab bar com 5 abas (Início, Programas, Biblioteca, Progresso, Perfil)
- [x] Stack navigation para telas de detalhe
- [x] Fluxo onboarding → chat IA → app principal
- [x] Navegação modal para aula e descobrir

## Branding
- [x] Gerar logo BARRIGAFIT com IA
- [x] Copiar logo para todos os assets (icon, splash, favicon, android)
- [x] Configurar splash screen com fundo preto
- [x] Atualizar app.config.ts com nome e logo URL

## Animações de Exercícios
- [x] Decidir abordagem: reanimated + SVG (sem dependências externas)
- [x] Criar componente ExerciseAnimation com 10 tipos de animação SVG
- [x] Implementar getAnimationType para mapear exercícios a animações
- [x] Integrar animações na tela de Aula (substituir placeholder LinearGradient)
- [x] Integrar animações nos cards da Biblioteca (ClassCard)
- [x] Mapear cada exercício a uma animação correspondente
- [x] Testes passando (41 testes)

## Atualização v2
- [x] Reverter as ilustrações animadas SVG e restaurar placeholders de gradiente
- [x] Criar autenticação local por nome, e-mail e código de acesso
- [x] Permitir edição persistente do perfil da usuária
- [x] Criar painel administrativo para usuários, códigos de acesso e catálogo de vídeos
- [x] Adicionar transição com contagem regressiva entre exercícios
- [x] Adicionar controles de iniciar e pausar a sessão de exercício
- [x] Implementar lembretes locais no horário preferido da usuária
- [x] Criar registro de medidas corporais e gráfico de evolução de 21 dias
- [x] Corrigir o rótulo de domingo na tela de progresso
- [x] Ajustar barra inferior, ícones, espaçamentos e hierarquia tipográfica
- [x] Testar a atualização completa e salvar checkpoint

## Pacote de reconstrução
- [x] Inventariar dados, telas, fluxos e design system atuais
- [x] Escrever especificação para recriar no Lovable e no Manus
- [x] Gerar pacote baixável com a especificação e ativos essenciais
