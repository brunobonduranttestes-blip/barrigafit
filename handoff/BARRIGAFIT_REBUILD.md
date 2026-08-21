# BARRIGAFIT — Pacote de Reconstrução

Este documento é a fonte de verdade para reconstruir o **BARRIGAFIT — Desafio de 21 Dias** com fidelidade visual, funcional e de conteúdo. O projeto atual é um aplicativo mobile em Expo/React Native, com orientação retrato e foco total em experiência de treino de baixo impacto e Pilates para mulheres. O repositório-fonte incluído neste pacote é a referência mais precisa para textos, rotas, dados de exercícios, interações e tokens de interface.

> **Diretriz inegociável:** não usar emojis no produto. Use exclusivamente ícones vetoriais profissionais, preferencialmente Material Icons ou símbolos equivalentes.

## 1. Identidade e posicionamento

| Item | Especificação |
|---|---|
| Nome exibido | **BARRIGAFIT — Desafio de 21 Dias** |
| Propósito | Treinos de Pilates e baixo impacto para definir o abdômen, fortalecer o core, desenvolver glúteos e melhorar a postura. |
| Público principal | Mulheres buscando resultados realistas em casa, com rotina guiada de curta duração. |
| Tom de voz | Direto, acolhedor, motivador e sem promessas exageradas. |
| Estética | Premium fitness: fundo preto, superfícies grafite, alto contraste, magenta/roxo como energia de marca. |
| Orientação | Exclusivamente retrato, priorizando interação com uma mão. |

## 2. Sistema visual

Use os seguintes tokens como valores obrigatórios. O tema escuro é o modo prioritário do produto.

| Token | Claro | Escuro | Aplicação |
|---|---:|---:|---|
| `primary` | `#C026D3` | `#E91E8C` | CTA, progresso ativo, foco visual. |
| `primaryAlt` | `#9333EA` | `#C026D3` | Gradientes e variações. |
| `background` | `#F9FAFB` | `#0A0A0A` | Fundo de tela. |
| `surface` | `#FFFFFF` | `#141414` | Barra inferior e superfícies. |
| `surfaceAlt` | `#F3F4F6` | `#1E1E1E` | Campos, cards auxiliares e estados neutros. |
| `foreground` | `#111827` | `#F9FAFB` | Texto principal. |
| `muted` | `#6B7280` | `#9CA3AF` | Texto secundário. |
| `border` | `#E5E7EB` | `#2A2A2A` | Divisores e bordas finas. |
| `success` | `#10B981` | `#34D399` | Conclusão e acesso ativo. |
| `warning` | `#F59E0B` | `#FBBF24` | Pausa, alerta e streak. |
| `error` | `#EF4444` | `#F87171` | Exclusão e erro. |

Os CTAs principais usam gradiente linear `#E91E8C → #C026D3`, borda arredondada entre 12 e 16px e tipografia branca semibold/bold. Use raios de 16 a 24px nos cards. Títulos têm peso `800–900`, subtítulos `500–600` e micro-rótulos em caixa alta com espaçamento entre letras moderado. Respeite espaçamentos em escala de 4, 8, 12, 16, 20, 24 e 32px.

## 3. Navegação e telas

| Rota/tela | Objetivo | Elementos obrigatórios |
|---|---|---|
| `Login` | Entrada por nome, e-mail e código. | Logo, três campos, CTA em gradiente, mensagem de suporte. |
| `Onboarding` | Apresentar valor do produto. | Três slides: treino em casa, programas de 21 dias e evolução. |
| `Chat IA` | Coletar objetivo, nível e tempo disponível. | Fluxo guiado em três perguntas; recomendação de programa. |
| `Início` | Mostrar treino do dia e status. | Saudação, métricas, aula do dia, progresso e aulas em destaque. |
| `Programas` | Selecionar programas. | Cards de programa, dias, nível, duração, progresso. |
| `Detalhe de programa` | Detalhar semanas e dias. | Grade de semanas/dias com estados concluído, atual e descanso. |
| `Aula` | Executar treino. | Placeholder visual em gradiente, timer, play/pause, transição 3-2-1 e próximo exercício. |
| `Biblioteca` | Consultar aulas avulsas. | Busca, filtros e cards horizontais. |
| `Progresso` | Mostrar constância e evolução. | Streak, estatísticas, semana dinâmica com domingo correto e histórico. |
| `Medidas` | Registrar medidas. | Peso, cintura, quadril, abdômen, gráfico de barras e histórico. |
| `Perfil` | Editar dados pessoais. | Nome, e-mail, objetivo, nível e tempo disponível. |
| `Configurações` | Preferências, medidas e saída. | Lembretes locais, horário, acesso ao painel admin quando aplicável. |
| `Administração` | Controle local do app. | Usuárias, códigos de acesso, catálogo de vídeos e troca única da senha temporária. |
| `Descobrir` | Cross-sell de produtos. | HORMONE-SYNC, CORE PRO e GLUTE LAB. |

A barra inferior possui cinco abas, nesta ordem: **Início**, **Programas**, **Biblioteca**, **Progresso** e **Perfil**. Os rótulos devem permanecer curtos, em uma linha e com ícones consistentes. Não use navegação inferior para telas de detalhe ou modais.

## 4. Fluxos essenciais

### Fluxo de entrada

1. Ao abrir o produto, verificar sessão local.
2. Sem sessão, mostrar Login.
3. Para usuária comum, validar nome, e-mail e código ativo.
4. Para `brunobondurant@gmail.com`, validar a senha administrativa.
5. Com sessão válida, mostrar onboarding caso ainda não concluído; em seguida, Chat IA; por fim, tabs principais.

O código inicial de demonstração é `BARRIGA21`. A senha administrativa temporária é `BF-9X7K-2R4M` e pode ser renovada **uma única vez** dentro do painel de administração. Em produção, essas credenciais devem ser geradas e validadas no servidor, nunca incluídas no aplicativo cliente.

### Fluxo de treino

1. Usuária abre uma aula e visualiza duração, exercícios e instruções.
2. Toca em **Iniciar treino**.
3. Exibir overlay de contagem regressiva: `3`, `2`, `1`, `VAI`.
4. Iniciar cronômetro geral e timer do exercício.
5. Exibir botão de pausa; ao pausar, congelar ambos os timers; ao retomar, continuar a partir do valor atual.
6. Ao zerar o exercício, disparar transição regressiva para o próximo.
7. Ao concluir, salvar dia, duração e exercícios finalizados; exibir tela de sucesso.

### Fluxo de medidas e lembrete

1. Em Perfil, abrir **Medidas corporais**.
2. Salvar uma ou mais das medidas: peso, cintura, quadril e abdômen.
3. Ordenar os registros por data e plotar até os sete mais recentes em gráfico de barras.
4. Em Configurações, habilitar lembretes e selecionar o horário diário disponível no ciclo: 07:00, 12:00, 18:00, 19:00 e 20:00.
5. No dispositivo nativo, solicitar permissão e agendar notificação local diária.

## 5. Dados de produto obrigatórios

O arquivo-fonte `lib/mock-data.ts` contém os dados íntegros. Preserve seus identificadores e estrutura. O inventário resumido é:

| Categoria | Conteúdo |
|---|---|
| Exercícios | Prancha Isométrica, Ponte de Glúteos, Abdominal Crunch, Agachamento Sumô, Alongamento do Gato, Elevação de Pernas, Pilates Roll Up e Tesoura. |
| Programa principal | **Barriga Chapada**, 21 dias, 18 treinos, média de 25 minutos; semanas Ativação, Progressão e Definição. |
| Programa complementar | **Glúteos Perfeitos**, 14 dias, foco Glúteos/Pernas. |
| Programa complementar | **Postura Perfeita**, 10 dias, foco Postura/Corpo Todo. |
| Biblioteca | Oito aulas: Pilates para Iniciantes, Queima de Gordura Abdominal, Glúteos em Chamas, Pilates Completo, Alongamento e Mobilidade, Core Avançado, Pernas Torneadas e Postura e Coluna. |
| Onboarding | “Transforme seu corpo em casa”; “Programas de 21 dias”; “Acompanhe sua evolução”. |
| Chat IA | Objetivo, nível atual e disponibilidade diária. |

## 6. Persistência e modelo de dados

Na implementação atual, a persistência é local via AsyncStorage. Use as seguintes entidades e chaves: `user_profile`, `active_program`, `completed_days`, `progress_log`, `measurements`, `favorite_classes`, `session`, `accounts`, `access_codes`, `admin_settings`, `workout_reminder` e `video_catalog`.

| Entidade | Campos mínimos |
|---|---|
| Perfil | `name`, `email`, `goal`, `level`, `availableTime`, `startDate`. |
| Sessão | `accountId`, `name`, `email`, `role`. |
| Código | `id`, `code`, `label`, `active`, `createdAt`, `usedBy`. |
| Conta | `id`, `name`, `email`, `role`, `active`, `accessCode`, `createdAt`. |
| Progresso | `date`, `dayId`, `programId`, `duration`, `exercisesCompleted`. |
| Medida | `date`, `weight`, `waist`, `hips`, `abdomen`. |
| Vídeo | `id`, `title`, `category`, `duration`, `url`, `active`. |

> **Limite atual:** o controle administrativo é local ao dispositivo. Para gerir usuários de forma global, proteger dados e permitir acesso real em múltiplos aparelhos, migre as entidades de sessão, usuários, códigos, catálogo e medidas para backend com autenticação, hash de senha e regras de autorização por papel.

## 7. Mapa de arquivos da implementação Expo

| Arquivo | Responsabilidade |
|---|---|
| `app/_layout.tsx` | Providers e Stack de rotas. |
| `app/(tabs)/_layout.tsx` | Barra inferior de cinco abas. |
| `app/login.tsx` | Login por código. |
| `app/admin.tsx` | Administração local. |
| `app/medidas.tsx` | Registro e gráfico de medidas. |
| `app/perfil.tsx` | Edição de perfil. |
| `app/aula/[id].tsx` | Execução de aula, countdown e pausa. |
| `app/(tabs)/progresso.tsx` | Semana, streak, histórico e progresso. |
| `lib/storage.ts` | Persistência e regras locais. |
| `lib/reminders.ts` | Permissão e agendamento de notificações locais. |
| `lib/mock-data.ts` | Conteúdo de programas, exercícios e biblioteca. |
| `theme.config.js` | Tokens de cores. |

## 8. Critérios de aceite

| Área | Critério |
|---|---|
| Visual | Fundo escuro premium, magenta/roxo, sem emojis, sem texto truncado e espaçamento coerente. |
| Login | Bloqueia acesso sem código válido; destaca erro de campos inválidos. |
| Treino | Iniciar, contar 3-2-1, pausar, retomar, avançar e salvar conclusão. |
| Progresso | Domingo deve aparecer como `D` conforme o dia real da semana. |
| Medidas | Salva dados, mostra histórico e gráfico. |
| Lembretes | Solicita permissão e programa lembrete diário em dispositivo físico. |
| Admin | Cria/pausa códigos, habilita/desabilita usuárias, insere/oculta vídeos e troca senha temporária uma vez. |

## 9. Instruções rápidas de uso do pacote

Para **Manus**, importe ou abra o diretório `source/` do ZIP e use `MANUS_REBUILD_PROMPT.md` como briefing. Para **Lovable**, crie um projeto novo e cole integralmente `LOVABLE_REBUILD_PROMPT.md`. Em ambos os casos, mantenha este arquivo aberto como documento de referência e copie o conteúdo de `source/lib/mock-data.ts` para preservar textos e estrutura dos programas.
