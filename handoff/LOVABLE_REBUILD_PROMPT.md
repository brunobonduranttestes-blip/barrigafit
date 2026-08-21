# Prompt de Reconstrução — Lovable

Crie uma aplicação web progressiva responsiva, com experiência mobile-first em proporção 9:16, chamada **BARRIGAFIT — Desafio de 21 Dias**. O produto é uma plataforma de Pilates e treinos de baixo impacto para mulheres treinarem em casa. Use React, TypeScript, Tailwind e ícones Lucide; não use emojis.

O visual deve ser premium e escuro: background `#0A0A0A`, cards `#1A1A1A`, superfícies secundárias `#1E1E1E`, texto `#F9FAFB`, texto secundário `#9CA3AF`, bordas `#2A2A2A`, CTAs em gradiente `#E91E8C → #C026D3`. Use cantos de 16–24px, títulos pesados e micro-rótulos em caixa alta. A navegação inferior deve ter cinco abas: Início, Programas, Biblioteca, Progresso e Perfil.

Implemente estas telas: Login por nome/e-mail/código; Onboarding com três slides; Chat de recomendação; dashboard com aula do dia; lista e detalhe de programas; player de aula; biblioteca; progresso; medidas; edição de perfil; configurações; administração; Descobrir.

No Login, valide código comum `BARRIGA21`. E-mail de administrador: `brunobondurant@gmail.com`; senha temporária: `BF-9X7K-2R4M`. Crie um painel admin com quatro seções: usuárias, códigos, vídeos e senha. Mostre um aviso explícito de que a versão web é demonstrativa/local e que controle de acesso real requer backend autenticado.

No player de aula, use placeholders em gradiente com ícone fitness, não GIFs nem animações de exercício. Ao iniciar, mostre overlay 3, 2, 1, VAI. Inclua cronômetro geral, timer do exercício, pausa/retomar, próximo exercício e tela de conclusão. Mantenha os dados do treino com estes programas: Barriga Chapada (21 dias), Glúteos Perfeitos (14 dias) e Postura Perfeita (10 dias). Use o arquivo `source/lib/mock-data.ts` do pacote como fonte exata de exercícios, aulas e textos.

Inclua tela de medidas corporais com campos para peso, cintura, quadril e abdômen; salvar no localStorage; gráfico de barras dos sete registros mais recentes; histórico datado. Em Configurações, adicione toggle e seleção de horário de lembrete. Em web, simule o lembrete com estado e texto; não alegue que a notificação funciona fora do navegador.

Corrija a semana de progresso para gerar rótulos a partir do dia real do calendário, assegurando que domingo seja `D`. Use dados locais com interfaces equivalentes: Profile, Session, AccessCode, LocalAccount, ProgressEntry, Measurement, ReminderSettings e CatalogVideo. O resultado deve ser navegável, com todos os botões funcionais, sem textos quebrados ou hierarquia inconsistente.
