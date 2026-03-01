# BARRIGAFIT - Design System & UI/UX Plan

## Brand Identity

**Primary Color:** Magenta/Pink gradient (#C026D3 → #E91E8C)
**Background:** Deep black (#0A0A0A)
**Surface:** Dark charcoal (#141414 / #1A1A1A)
**Accent:** Bright pink (#E91E8C)
**Text:** White (#FFFFFF) / Muted (#9CA3AF)

The design follows a dark, premium aesthetic inspired by apps like Nike Training Club, Peloton, and Freeletics — clean, bold typography, minimal chrome, strong visual hierarchy.

---

## Color Palette

| Token | Light | Dark |
|-------|-------|------|
| `primary` | #C026D3 | #E91E8C |
| `background` | #F9FAFB | #0A0A0A |
| `surface` | #FFFFFF | #141414 |
| `surfaceAlt` | #F3F4F6 | #1E1E1E |
| `foreground` | #111827 | #F9FAFB |
| `muted` | #6B7280 | #9CA3AF |
| `border` | #E5E7EB | #2A2A2A |
| `success` | #10B981 | #34D399 |
| `warning` | #F59E0B | #FBBF24 |
| `error` | #EF4444 | #F87171 |

---

## Screen List

1. **Splash Screen** — Logo animado, fundo preto, transição suave
2. **Onboarding** (3 slides) — Benefícios do app, CTA para começar
3. **Chat IA Inicial** — Conversa guiada para definir objetivos
4. **Dashboard (Home)** — Aula do dia, progresso, banner cross-sell
5. **Programas** — Lista de programas disponíveis
6. **Detalhes do Programa** — Visão geral, semanas, dias
7. **Tela da Aula** — Player de vídeo, instruções, timer
8. **Biblioteca** — Filtros por nível/duração/foco
9. **Progresso** — Gráficos, streak, conquistas
10. **Configurações** — Perfil, preferências, backup
11. **Cross-sell / Descobrir** — HORMONE-SYNC e outros produtos

---

## Key User Flows

### Fluxo Principal (Novo Usuário)
Splash → Onboarding → Chat IA → Dashboard → Aula do Dia → Player → Concluir → Dashboard

### Fluxo de Treino Diário
Dashboard → "Treinar Agora" → Player → Timer → Concluir → Progresso atualizado

### Fluxo de Descoberta
Dashboard → Banner HORMONE-SYNC → Cross-sell Screen → Link externo

### Fluxo de Biblioteca
Tab Biblioteca → Filtros → Selecionar Aula → Player

---

## Navigation Structure

```
Root Stack
├── /splash (não-autenticado)
├── /onboarding (não-autenticado)
├── /chat-ia (não-autenticado)
└── /(tabs) (principal)
    ├── index (Dashboard)
    ├── programas
    ├── biblioteca
    ├── progresso
    └── configuracoes
    
Modais / Stack dentro de tabs:
├── /aula/[id]
├── /programa/[id]
└── /descobrir
```

---

## Typography

- **Display:** Inter Bold 32-40px — títulos de seção
- **Heading:** Inter SemiBold 20-24px — títulos de card
- **Body:** Inter Regular 14-16px — texto corrido
- **Caption:** Inter Regular 12px — metadados, labels
- **Button:** Inter SemiBold 15px — CTAs

---

## Component Design Principles

1. **Cards escuros** com borda sutil (#2A2A2A) e cantos arredondados (16px)
2. **Gradiente primário** usado em botões principais e destaques
3. **Ícones** do MaterialIcons/Ionicons — nunca emojis
4. **Espaçamento** generoso — padding mínimo de 16px nas telas
5. **Feedback tátil** em todas as interações principais
6. **Imagens de placeholder** com gradiente rosa para exercícios sem vídeo

---

## Interaction Design

- Botões primários: gradiente magenta, escala 0.97 no press
- Cards: opacity 0.8 no press
- Tab bar: ícones com label, cor ativa = primary
- Transições: fade + slide suave (250ms)
