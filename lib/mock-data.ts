// BARRIGAFIT - Mock Data
// All content data for the app (programs, exercises, library)

export type DifficultyLevel = "Iniciante" | "Intermediário" | "Avançado";
export type FocusArea = "Abdômen" | "Glúteos" | "Pernas" | "Corpo Todo" | "Postura" | "Braços";

export interface Exercise {
  id: string;
  name: string;
  duration: number; // seconds
  reps?: number;
  sets?: number;
  focus: FocusArea[];
  level: DifficultyLevel;
  description: string;
  tips: string[];
  commonMistakes: string[];
  breathingGuide: string;
  videoUrl?: string;
  thumbnailColor: string; // gradient color for placeholder
}

export interface WorkoutDay {
  id: string;
  dayNumber: number;
  title: string;
  duration: number; // minutes
  exercises: Exercise[];
  isRest?: boolean;
}

export interface WorkoutWeek {
  id: string;
  weekNumber: number;
  title: string;
  days: WorkoutDay[];
}

export interface Program {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: number; // days
  level: DifficultyLevel;
  focus: FocusArea[];
  totalWorkouts: number;
  avgDuration: number; // minutes per session
  weeks: WorkoutWeek[];
  color: string;
  colorSecondary: string;
  isPopular?: boolean;
  isFeatured?: boolean;
}

export interface LibraryClass {
  id: string;
  title: string;
  instructor: string;
  duration: number; // minutes
  level: DifficultyLevel;
  focus: FocusArea[];
  description: string;
  exercises: Exercise[];
  thumbnailColor: string;
  videoUrl?: string;
  isFavorite?: boolean;
}

// ─── EXERCISES ────────────────────────────────────────────────────────────────

export const EXERCISES: Exercise[] = [
  {
    id: "ex-01",
    name: "Prancha Isométrica",
    duration: 30,
    focus: ["Abdômen", "Corpo Todo"],
    level: "Iniciante",
    description: "Posição de prancha com apoio nos antebraços, mantendo o corpo reto como uma tábua.",
    tips: ["Mantenha o quadril alinhado com os ombros", "Contraia o abdômen durante todo o movimento"],
    commonMistakes: ["Deixar o quadril cair", "Elevar demais o quadril", "Prender a respiração"],
    breathingGuide: "Respire de forma constante e controlada durante toda a execução",
    thumbnailColor: "#E91E8C",
  },
  {
    id: "ex-02",
    name: "Ponte de Glúteos",
    duration: 45,
    reps: 15,
    sets: 3,
    focus: ["Glúteos", "Abdômen"],
    level: "Iniciante",
    description: "Deitada de costas, joelhos flexionados, eleve o quadril contraindo os glúteos.",
    tips: ["Pressione os pés no chão ao elevar", "Segure 2 segundos no topo"],
    commonMistakes: ["Arquear a lombar excessivamente", "Não contrair os glúteos no topo"],
    breathingGuide: "Expire ao elevar o quadril, inspire ao descer",
    thumbnailColor: "#9333EA",
  },
  {
    id: "ex-03",
    name: "Abdominal Crunch",
    duration: 40,
    reps: 20,
    sets: 3,
    focus: ["Abdômen"],
    level: "Iniciante",
    description: "Deitada de costas, eleve os ombros do chão contraindo o abdômen.",
    tips: ["Não puxe o pescoço com as mãos", "Foque na contração do abdômen"],
    commonMistakes: ["Usar o pescoço para subir", "Movimento muito amplo"],
    breathingGuide: "Expire ao subir, inspire ao descer",
    thumbnailColor: "#C026D3",
  },
  {
    id: "ex-04",
    name: "Agachamento Sumô",
    duration: 50,
    reps: 15,
    sets: 3,
    focus: ["Glúteos", "Pernas"],
    level: "Iniciante",
    description: "Pés afastados além da largura dos ombros, pontas voltadas para fora, desça até 90 graus.",
    tips: ["Joelhos na direção dos pés", "Mantenha o tronco ereto"],
    commonMistakes: ["Joelhos para dentro", "Inclinar o tronco à frente"],
    breathingGuide: "Inspire ao descer, expire ao subir",
    thumbnailColor: "#7C3AED",
  },
  {
    id: "ex-05",
    name: "Alongamento do Gato",
    duration: 60,
    focus: ["Postura", "Corpo Todo"],
    level: "Iniciante",
    description: "Em quatro apoios, alterne entre arquear e arredondar a coluna.",
    tips: ["Movimentos lentos e controlados", "Sincronize com a respiração"],
    commonMistakes: ["Mover muito rápido", "Não respirar corretamente"],
    breathingGuide: "Inspire ao arquear, expire ao arredondar",
    thumbnailColor: "#DB2777",
  },
  {
    id: "ex-06",
    name: "Elevação de Pernas",
    duration: 40,
    reps: 12,
    sets: 3,
    focus: ["Abdômen", "Pernas"],
    level: "Intermediário",
    description: "Deitada de costas, eleve as pernas estendidas até 90 graus.",
    tips: ["Pressione a lombar no chão", "Controle a descida"],
    commonMistakes: ["Soltar as pernas rapidamente", "Deixar a lombar sair do chão"],
    breathingGuide: "Expire ao elevar, inspire ao descer",
    thumbnailColor: "#BE185D",
  },
  {
    id: "ex-07",
    name: "Pilates Roll Up",
    duration: 45,
    reps: 10,
    sets: 2,
    focus: ["Abdômen", "Postura"],
    level: "Intermediário",
    description: "Deitada, braços acima da cabeça, role o corpo para cima vértebra por vértebra.",
    tips: ["Movimento lento e articulado", "Mantenha os pés no chão"],
    commonMistakes: ["Usar impulso", "Não articular a coluna"],
    breathingGuide: "Expire ao rolar para cima, inspire ao descer",
    thumbnailColor: "#E91E8C",
  },
  {
    id: "ex-08",
    name: "Tesoura",
    duration: 40,
    reps: 20,
    sets: 3,
    focus: ["Abdômen", "Pernas"],
    level: "Intermediário",
    description: "Deitada, pernas estendidas, alterne a elevação das pernas em movimento de tesoura.",
    tips: ["Mantenha a lombar pressionada no chão", "Pernas bem estendidas"],
    commonMistakes: ["Dobrar os joelhos", "Levantar a lombar"],
    breathingGuide: "Respire de forma constante durante o movimento",
    thumbnailColor: "#9333EA",
  },
];

// ─── PROGRAMS ─────────────────────────────────────────────────────────────────

export const PROGRAMS: Program[] = [
  {
    id: "prog-01",
    title: "Barriga Chapada",
    subtitle: "Desafio de 21 Dias",
    description: "O programa principal do BARRIGAFIT. 21 dias de treinos progressivos focados em definir o abdômen, fortalecer o core e melhorar a postura.",
    duration: 21,
    level: "Iniciante",
    focus: ["Abdômen", "Postura", "Corpo Todo"],
    totalWorkouts: 18,
    avgDuration: 25,
    color: "#E91E8C",
    colorSecondary: "#C026D3",
    isPopular: true,
    isFeatured: true,
    weeks: [
      {
        id: "week-01",
        weekNumber: 1,
        title: "Ativação",
        days: [
          {
            id: "day-01",
            dayNumber: 1,
            title: "Ativação do Core",
            duration: 20,
            exercises: [EXERCISES[0], EXERCISES[2], EXERCISES[4]],
          },
          {
            id: "day-02",
            dayNumber: 2,
            title: "Glúteos e Pernas",
            duration: 22,
            exercises: [EXERCISES[1], EXERCISES[3]],
          },
          {
            id: "day-03",
            dayNumber: 3,
            title: "Descanso Ativo",
            duration: 15,
            exercises: [EXERCISES[4]],
            isRest: true,
          },
          {
            id: "day-04",
            dayNumber: 4,
            title: "Abdômen Profundo",
            duration: 25,
            exercises: [EXERCISES[0], EXERCISES[2], EXERCISES[5]],
          },
          {
            id: "day-05",
            dayNumber: 5,
            title: "Corpo Todo",
            duration: 28,
            exercises: [EXERCISES[1], EXERCISES[3], EXERCISES[4]],
          },
          {
            id: "day-06",
            dayNumber: 6,
            title: "Pilates Clássico",
            duration: 25,
            exercises: [EXERCISES[6], EXERCISES[7]],
          },
          {
            id: "day-07",
            dayNumber: 7,
            title: "Descanso",
            duration: 0,
            exercises: [],
            isRest: true,
          },
        ],
      },
      {
        id: "week-02",
        weekNumber: 2,
        title: "Progressão",
        days: [
          {
            id: "day-08",
            dayNumber: 8,
            title: "Core Intenso",
            duration: 28,
            exercises: [EXERCISES[0], EXERCISES[2], EXERCISES[5], EXERCISES[6]],
          },
          {
            id: "day-09",
            dayNumber: 9,
            title: "Glúteos Avançado",
            duration: 30,
            exercises: [EXERCISES[1], EXERCISES[3], EXERCISES[7]],
          },
          {
            id: "day-10",
            dayNumber: 10,
            title: "Descanso Ativo",
            duration: 15,
            exercises: [EXERCISES[4]],
            isRest: true,
          },
          {
            id: "day-11",
            dayNumber: 11,
            title: "Pilates Completo",
            duration: 30,
            exercises: [EXERCISES[6], EXERCISES[7], EXERCISES[0]],
          },
          {
            id: "day-12",
            dayNumber: 12,
            title: "Força e Postura",
            duration: 28,
            exercises: [EXERCISES[4], EXERCISES[5], EXERCISES[2]],
          },
          {
            id: "day-13",
            dayNumber: 13,
            title: "Circuito Completo",
            duration: 35,
            exercises: [EXERCISES[0], EXERCISES[1], EXERCISES[2], EXERCISES[3]],
          },
          {
            id: "day-14",
            dayNumber: 14,
            title: "Descanso",
            duration: 0,
            exercises: [],
            isRest: true,
          },
        ],
      },
      {
        id: "week-03",
        weekNumber: 3,
        title: "Definição",
        days: [
          {
            id: "day-15",
            dayNumber: 15,
            title: "Máxima Ativação",
            duration: 35,
            exercises: [EXERCISES[0], EXERCISES[5], EXERCISES[6], EXERCISES[7]],
          },
          {
            id: "day-16",
            dayNumber: 16,
            title: "Glúteos e Core",
            duration: 32,
            exercises: [EXERCISES[1], EXERCISES[2], EXERCISES[3]],
          },
          {
            id: "day-17",
            dayNumber: 17,
            title: "Descanso Ativo",
            duration: 15,
            exercises: [EXERCISES[4]],
            isRest: true,
          },
          {
            id: "day-18",
            dayNumber: 18,
            title: "Pilates Avançado",
            duration: 35,
            exercises: [EXERCISES[6], EXERCISES[7], EXERCISES[5]],
          },
          {
            id: "day-19",
            dayNumber: 19,
            title: "Circuito Final",
            duration: 40,
            exercises: EXERCISES.slice(0, 6),
          },
          {
            id: "day-20",
            dayNumber: 20,
            title: "Recuperação",
            duration: 20,
            exercises: [EXERCISES[4]],
            isRest: true,
          },
          {
            id: "day-21",
            dayNumber: 21,
            title: "Dia da Conquista",
            duration: 40,
            exercises: EXERCISES,
          },
        ],
      },
    ],
  },
  {
    id: "prog-02",
    title: "Glúteos Perfeitos",
    subtitle: "Programa de 14 Dias",
    description: "Foco total em glúteos e pernas. Exercícios de Pilates e baixo impacto para tonificar e levantar os glúteos.",
    duration: 14,
    level: "Iniciante",
    focus: ["Glúteos", "Pernas"],
    totalWorkouts: 12,
    avgDuration: 20,
    color: "#9333EA",
    colorSecondary: "#7C3AED",
    weeks: [
      {
        id: "week-g01",
        weekNumber: 1,
        title: "Base",
        days: [
          {
            id: "gday-01",
            dayNumber: 1,
            title: "Ativação Glúteos",
            duration: 20,
            exercises: [EXERCISES[1], EXERCISES[3]],
          },
          {
            id: "gday-02",
            dayNumber: 2,
            title: "Pernas e Glúteos",
            duration: 22,
            exercises: [EXERCISES[3], EXERCISES[7]],
          },
          {
            id: "gday-03",
            dayNumber: 3,
            title: "Descanso",
            duration: 0,
            exercises: [],
            isRest: true,
          },
          {
            id: "gday-04",
            dayNumber: 4,
            title: "Glúteos Intenso",
            duration: 25,
            exercises: [EXERCISES[1], EXERCISES[3], EXERCISES[7]],
          },
          {
            id: "gday-05",
            dayNumber: 5,
            title: "Circuito Inferior",
            duration: 28,
            exercises: [EXERCISES[1], EXERCISES[3]],
          },
          {
            id: "gday-06",
            dayNumber: 6,
            title: "Alongamento",
            duration: 15,
            exercises: [EXERCISES[4]],
            isRest: true,
          },
          {
            id: "gday-07",
            dayNumber: 7,
            title: "Descanso",
            duration: 0,
            exercises: [],
            isRest: true,
          },
        ],
      },
      {
        id: "week-g02",
        weekNumber: 2,
        title: "Intensificação",
        days: [
          {
            id: "gday-08",
            dayNumber: 8,
            title: "Força Máxima",
            duration: 28,
            exercises: [EXERCISES[1], EXERCISES[3], EXERCISES[7]],
          },
          {
            id: "gday-09",
            dayNumber: 9,
            title: "Queima Total",
            duration: 30,
            exercises: [EXERCISES[3], EXERCISES[7]],
          },
          {
            id: "gday-10",
            dayNumber: 10,
            title: "Descanso Ativo",
            duration: 15,
            exercises: [EXERCISES[4]],
            isRest: true,
          },
          {
            id: "gday-11",
            dayNumber: 11,
            title: "Pilates Inferior",
            duration: 25,
            exercises: [EXERCISES[1], EXERCISES[7]],
          },
          {
            id: "gday-12",
            dayNumber: 12,
            title: "Circuito Final",
            duration: 30,
            exercises: [EXERCISES[1], EXERCISES[3], EXERCISES[7]],
          },
          {
            id: "gday-13",
            dayNumber: 13,
            title: "Recuperação",
            duration: 15,
            exercises: [EXERCISES[4]],
            isRest: true,
          },
          {
            id: "gday-14",
            dayNumber: 14,
            title: "Conquista Final",
            duration: 35,
            exercises: [EXERCISES[1], EXERCISES[3], EXERCISES[7], EXERCISES[4]],
          },
        ],
      },
    ],
  },
  {
    id: "prog-03",
    title: "Postura Perfeita",
    subtitle: "Programa de 10 Dias",
    description: "Corrija a postura e alivie as dores nas costas com Pilates terapêutico. Ideal para quem passa muito tempo sentada.",
    duration: 10,
    level: "Iniciante",
    focus: ["Postura", "Corpo Todo"],
    totalWorkouts: 8,
    avgDuration: 18,
    color: "#DB2777",
    colorSecondary: "#BE185D",
    weeks: [
      {
        id: "week-p01",
        weekNumber: 1,
        title: "Consciência Corporal",
        days: [
          {
            id: "pday-01",
            dayNumber: 1,
            title: "Mobilidade Inicial",
            duration: 18,
            exercises: [EXERCISES[4], EXERCISES[6]],
          },
          {
            id: "pday-02",
            dayNumber: 2,
            title: "Coluna Saudável",
            duration: 20,
            exercises: [EXERCISES[4], EXERCISES[6]],
          },
          {
            id: "pday-03",
            dayNumber: 3,
            title: "Descanso",
            duration: 0,
            exercises: [],
            isRest: true,
          },
          {
            id: "pday-04",
            dayNumber: 4,
            title: "Core e Postura",
            duration: 22,
            exercises: [EXERCISES[0], EXERCISES[4], EXERCISES[6]],
          },
          {
            id: "pday-05",
            dayNumber: 5,
            title: "Pilates Terapêutico",
            duration: 20,
            exercises: [EXERCISES[6], EXERCISES[7]],
          },
          {
            id: "pday-06",
            dayNumber: 6,
            title: "Descanso Ativo",
            duration: 15,
            exercises: [EXERCISES[4]],
            isRest: true,
          },
          {
            id: "pday-07",
            dayNumber: 7,
            title: "Fortalecimento",
            duration: 25,
            exercises: [EXERCISES[0], EXERCISES[6]],
          },
        ],
      },
    ],
  },
];

// ─── LIBRARY CLASSES ──────────────────────────────────────────────────────────

export const LIBRARY_CLASSES: LibraryClass[] = [
  {
    id: "lib-01",
    title: "Pilates para Iniciantes",
    instructor: "Instrutora BarrigaFit",
    duration: 20,
    level: "Iniciante",
    focus: ["Abdômen", "Postura"],
    description: "Aula completa de Pilates para quem está começando. Movimentos suaves e bem explicados.",
    exercises: [EXERCISES[0], EXERCISES[2], EXERCISES[4]],
    thumbnailColor: "#E91E8C",
  },
  {
    id: "lib-02",
    title: "Queima de Gordura Abdominal",
    instructor: "Instrutora BarrigaFit",
    duration: 25,
    level: "Iniciante",
    focus: ["Abdômen"],
    description: "Sequência focada em ativar o abdômen profundo e acelerar o metabolismo.",
    exercises: [EXERCISES[0], EXERCISES[2], EXERCISES[5]],
    thumbnailColor: "#C026D3",
  },
  {
    id: "lib-03",
    title: "Glúteos em Chamas",
    instructor: "Instrutora BarrigaFit",
    duration: 22,
    level: "Iniciante",
    focus: ["Glúteos", "Pernas"],
    description: "Aula intensa para tonificar e levantar os glúteos sem sair de casa.",
    exercises: [EXERCISES[1], EXERCISES[3]],
    thumbnailColor: "#9333EA",
  },
  {
    id: "lib-04",
    title: "Pilates Completo",
    instructor: "Instrutora BarrigaFit",
    duration: 35,
    level: "Intermediário",
    focus: ["Corpo Todo"],
    description: "Aula completa de Pilates com exercícios clássicos para trabalhar o corpo todo.",
    exercises: [EXERCISES[6], EXERCISES[7], EXERCISES[0], EXERCISES[2]],
    thumbnailColor: "#7C3AED",
  },
  {
    id: "lib-05",
    title: "Alongamento e Mobilidade",
    instructor: "Instrutora BarrigaFit",
    duration: 15,
    level: "Iniciante",
    focus: ["Postura", "Corpo Todo"],
    description: "Sequência de alongamentos para melhorar a flexibilidade e aliviar tensões.",
    exercises: [EXERCISES[4]],
    thumbnailColor: "#DB2777",
  },
  {
    id: "lib-06",
    title: "Core Avançado",
    instructor: "Instrutora BarrigaFit",
    duration: 30,
    level: "Avançado",
    focus: ["Abdômen", "Corpo Todo"],
    description: "Desafio de core para quem já tem uma base sólida. Exercícios intensos e eficazes.",
    exercises: [EXERCISES[0], EXERCISES[5], EXERCISES[6], EXERCISES[7]],
    thumbnailColor: "#BE185D",
  },
  {
    id: "lib-07",
    title: "Pernas Torneadas",
    instructor: "Instrutora BarrigaFit",
    duration: 20,
    level: "Iniciante",
    focus: ["Pernas", "Glúteos"],
    description: "Exercícios específicos para tonificar e definir as pernas.",
    exercises: [EXERCISES[3], EXERCISES[7]],
    thumbnailColor: "#9333EA",
  },
  {
    id: "lib-08",
    title: "Postura e Coluna",
    instructor: "Instrutora BarrigaFit",
    duration: 18,
    level: "Iniciante",
    focus: ["Postura"],
    description: "Aula terapêutica para corrigir a postura e fortalecer a coluna.",
    exercises: [EXERCISES[4], EXERCISES[6]],
    thumbnailColor: "#E91E8C",
  },
];

// ─── ONBOARDING DATA ──────────────────────────────────────────────────────────

export const ONBOARDING_SLIDES = [
  {
    id: 1,
    title: "Transforme seu corpo em casa",
    subtitle: "Pilates e treinos de baixo impacto projetados para mulheres que querem resultados reais.",
    icon: "figure.run" as const,
    color: "#E91E8C",
  },
  {
    id: 2,
    title: "Programas de 21 dias",
    subtitle: "Treinos estruturados por dia e semana, com progressão inteligente para você nunca parar.",
    icon: "calendar" as const,
    color: "#C026D3",
  },
  {
    id: 3,
    title: "Acompanhe sua evolução",
    subtitle: "Registre seu progresso, veja seus resultados e mantenha a motivação sempre alta.",
    icon: "chart.bar.fill" as const,
    color: "#9333EA",
  },
];

// ─── CHAT IA QUESTIONS ────────────────────────────────────────────────────────

export const CHAT_QUESTIONS = [
  {
    id: "q1",
    question: "Qual é o seu principal objetivo?",
    options: [
      { id: "opt-1a", label: "Emagrecer e perder barriga", value: "weight_loss" },
      { id: "opt-1b", label: "Tonificar e definir o corpo", value: "toning" },
      { id: "opt-1c", label: "Melhorar postura e flexibilidade", value: "posture" },
      { id: "opt-1d", label: "Ganhar disposição e energia", value: "energy" },
    ],
  },
  {
    id: "q2",
    question: "Qual é o seu nível atual de condicionamento?",
    options: [
      { id: "opt-2a", label: "Nunca me exercitei", value: "beginner" },
      { id: "opt-2b", label: "Me exercito às vezes", value: "occasional" },
      { id: "opt-2c", label: "Me exercito regularmente", value: "regular" },
      { id: "opt-2d", label: "Sou bem ativa", value: "advanced" },
    ],
  },
  {
    id: "q3",
    question: "Quanto tempo você tem disponível por dia?",
    options: [
      { id: "opt-3a", label: "Até 15 minutos", value: "15min" },
      { id: "opt-3b", label: "15 a 30 minutos", value: "30min" },
      { id: "opt-3c", label: "30 a 45 minutos", value: "45min" },
      { id: "opt-3d", label: "Mais de 45 minutos", value: "60min" },
    ],
  },
];
