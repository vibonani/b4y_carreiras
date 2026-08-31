import { DISCQuestion, FitCulturalQuestion, LogicQuestion, CandidateResult, JobPosition } from '../types';

export const JOB_POSITIONS: JobPosition[] = [
  'Analista Comercial',
  'Assistente Administrativo',
  'Analista de Marketing',
  'Desenvolvedor'
];

export const DISC_QUESTIONS: DISCQuestion[] = [
  {
    id: 1,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '1-A', label: 'A', text: 'Decidido', trait: 'D' },
      { id: '1-B', label: 'B', text: 'Entusiasta', trait: 'I' },
      { id: '1-C', label: 'C', text: 'Paciente', trait: 'S' },
      { id: '1-D', label: 'D', text: 'Preciso', trait: 'C' },
    ]
  },
  {
    id: 2,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '2-A', label: 'A', text: 'Competitivo', trait: 'D' },
      { id: '2-B', label: 'B', text: 'Lógico', trait: 'C' },
      { id: '2-C', label: 'C', text: 'Receptivo', trait: 'S' },
      { id: '2-D', label: 'D', text: 'Persuasivo', trait: 'I' },
    ]
  },
  {
    id: 3,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '3-A', label: 'A', text: 'Previsível', trait: 'S' },
      { id: '3-B', label: 'B', text: 'Otimista', trait: 'I' },
      { id: '3-C', label: 'C', text: 'Disciplinado', trait: 'C' },
      { id: '3-D', label: 'D', text: 'Direto', trait: 'D' },
    ]
  },
  {
    id: 4,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '4-A', label: 'A', text: 'Cuidadoso', trait: 'C' },
      { id: '4-B', label: 'B', text: 'Comunicativo', trait: 'I' },
      { id: '4-C', label: 'C', text: 'Ousado', trait: 'D' },
      { id: '4-D', label: 'D', text: 'Cooperativo', trait: 'S' },
    ]
  },
  {
    id: 5,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '5-A', label: 'A', text: 'Analítico', trait: 'C' },
      { id: '5-B', label: 'B', text: 'Amigável', trait: 'S' },
      { id: '5-C', label: 'C', text: 'Independente', trait: 'D' },
      { id: '5-D', label: 'D', text: 'Sociável', trait: 'I' },
    ]
  },
  {
    id: 6,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '6-A', label: 'A', text: 'Moderado', trait: 'S' },
      { id: '6-B', label: 'B', text: 'Perfeccionista', trait: 'C' },
      { id: '6-C', label: 'C', text: 'Expressivo', trait: 'I' },
      { id: '6-D', label: 'D', text: 'Autoconfiante', trait: 'D' },
    ]
  },
  {
    id: 7,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '7-A', label: 'A', text: 'Apoiador', trait: 'S' },
      { id: '7-B', label: 'B', text: 'Sistemático', trait: 'C' },
      { id: '7-C', label: 'C', text: 'Resultadista', trait: 'D' },
      { id: '7-D', label: 'D', text: 'Inspirador', trait: 'I' },
    ]
  },
  {
    id: 8,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '8-A', label: 'A', text: 'Constante', trait: 'S' },
      { id: '8-B', label: 'B', text: 'Detalhista', trait: 'C' },
      { id: '8-C', label: 'C', text: 'Convincente', trait: 'I' },
      { id: '8-D', label: 'D', text: 'Energético', trait: 'D' },
    ]
  },
  {
    id: 9,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '9-A', label: 'A', text: 'Leal', trait: 'S' },
      { id: '9-B', label: 'B', text: 'Corajoso', trait: 'D' },
      { id: '9-C', label: 'C', text: 'Popular', trait: 'I' },
      { id: '9-D', label: 'D', text: 'Metódico', trait: 'C' },
    ]
  },
  {
    id: 10,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '10-A', label: 'A', text: 'Organizado', trait: 'C' },
      { id: '10-B', label: 'B', text: 'Diplomático', trait: 'S' },
      { id: '10-C', label: 'C', text: 'Animado', trait: 'I' },
      { id: '10-D', label: 'D', text: 'Assertivo', trait: 'D' },
    ]
  },
  {
    id: 11,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '11-A', label: 'A', text: 'Investigativo', trait: 'C' },
      { id: '11-B', label: 'B', text: 'Tranquilo', trait: 'S' },
      { id: '11-C', label: 'C', text: 'Estimulante', trait: 'I' },
      { id: '11-D', label: 'D', text: 'Persistente', trait: 'D' },
    ]
  },
  {
    id: 12,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '12-A', label: 'A', text: 'Pioneiro', trait: 'D' },
      { id: '12-B', label: 'B', text: 'Rigoroso', trait: 'C' },
      { id: '12-C', label: 'C', text: 'Influente', trait: 'I' },
      { id: '12-D', label: 'D', text: 'Conciliador', trait: 'S' },
    ]
  },
  {
    id: 13,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '13-A', label: 'A', text: 'Pragmático', trait: 'C' },
      { id: '13-B', label: 'B', text: 'Tolerante', trait: 'S' },
      { id: '13-C', label: 'C', text: 'Objetivo', trait: 'D' },
      { id: '13-D', label: 'D', text: 'Cativante', trait: 'I' },
    ]
  },
  {
    id: 14,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '14-A', label: 'A', text: 'Eloquente', trait: 'I' },
      { id: '14-B', label: 'B', text: 'Firme', trait: 'D' },
      { id: '14-C', label: 'C', text: 'Estruturado', trait: 'C' },
      { id: '14-D', label: 'D', text: 'Atencioso', trait: 'S' },
    ]
  },
  {
    id: 15,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '15-A', label: 'A', text: 'Magnético', trait: 'I' },
      { id: '15-B', label: 'B', text: 'Impetuoso', trait: 'D' },
      { id: '15-C', label: 'C', text: 'Estável', trait: 'S' },
      { id: '15-D', label: 'D', text: 'Criterioso', trait: 'C' },
    ]
  },
  {
    id: 16,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '16-A', label: 'A', text: 'Descontraído', trait: 'I' },
      { id: '16-B', label: 'B', text: 'Resoluto', trait: 'D' },
      { id: '16-C', label: 'C', text: 'Racional', trait: 'C' },
      { id: '16-D', label: 'D', text: 'Confiável', trait: 'S' },
    ]
  },
  {
    id: 17,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '17-A', label: 'A', text: 'Exato', trait: 'C' },
      { id: '17-B', label: 'B', text: 'Impulsionador', trait: 'D' },
      { id: '17-C', label: 'C', text: 'Relacional', trait: 'I' },
      { id: '17-D', label: 'D', text: 'Ouvinte', trait: 'S' },
    ]
  },
  {
    id: 18,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '18-A', label: 'A', text: 'Prudente', trait: 'C' },
      { id: '18-B', label: 'B', text: 'Criativo', trait: 'I' },
      { id: '18-C', label: 'C', text: 'Empreendedor', trait: 'D' },
      { id: '18-D', label: 'D', text: 'Pacifista', trait: 'S' },
    ]
  },
  {
    id: 19,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '19-A', label: 'A', text: 'Perceptivo', trait: 'C' },
      { id: '19-B', label: 'B', text: 'Caloroso', trait: 'I' },
      { id: '19-C', label: 'C', text: 'Equilibrado', trait: 'S' },
      { id: '19-D', label: 'D', text: 'Proativo', trait: 'D' },
    ]
  },
  {
    id: 20,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '20-A', label: 'A', text: 'Destemido', trait: 'D' },
      { id: '20-B', label: 'B', text: 'Extrovertido', trait: 'I' },
      { id: '20-C', label: 'C', text: 'Gentil', trait: 'S' },
      { id: '20-D', label: 'D', text: 'Técnico', trait: 'C' },
    ]
  },
  {
    id: 21,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '21-A', label: 'A', text: 'Harmônico', trait: 'S' },
      { id: '21-B', label: 'B', text: 'Eficiente', trait: 'D' },
      { id: '21-C', label: 'C', text: 'Factual', trait: 'C' },
      { id: '21-D', label: 'D', text: 'Charmoso', trait: 'I' },
    ]
  },
  {
    id: 22,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '22-A', label: 'A', text: 'Seguro', trait: 'S' },
      { id: '22-B', label: 'B', text: 'Vibrante', trait: 'I' },
      { id: '22-C', label: 'C', text: 'Rápido', trait: 'D' },
      { id: '22-D', label: 'D', text: 'Perspicaz', trait: 'C' },
    ]
  },
  {
    id: 23,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '23-A', label: 'A', text: 'Sereno', trait: 'S' },
      { id: '23-B', label: 'B', text: 'Motivador', trait: 'I' },
      { id: '23-C', label: 'C', text: 'Amigável', trait: 'S' },
      { id: '23-D', label: 'D', text: 'Formal', trait: 'C' },
    ]
  },
  {
    id: 24,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '24-A', label: 'A', text: 'Coerente', trait: 'C' },
      { id: '24-B', label: 'B', text: 'Espontâneo', trait: 'I' },
      { id: '24-C', label: 'C', text: 'Ambicioso', trait: 'D' },
      { id: '24-D', label: 'D', text: 'Compreensivo', trait: 'S' },
    ]
  },
  {
    id: 25,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '25-A', label: 'A', text: 'Observador', trait: 'C' },
      { id: '25-B', label: 'B', text: 'Participativo', trait: 'I' },
      { id: '25-C', label: 'C', text: 'Vigoroso', trait: 'D' },
      { id: '25-D', label: 'D', text: 'Zeloso', trait: 'S' },
    ]
  },
  {
    id: 26,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '26-A', label: 'A', text: 'Vigilante', trait: 'C' },
      { id: '26-B', label: 'B', text: 'Discreto', trait: 'S' },
      { id: '26-C', label: 'C', text: 'Aglutinador', trait: 'I' },
      { id: '26-D', label: 'D', text: 'Incisivo', trait: 'D' },
    ]
  },
  {
    id: 27,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '27-A', label: 'A', text: 'Sério', trait: 'C' },
      { id: '27-B', label: 'B', text: 'Dedicado', trait: 'S' },
      { id: '27-C', label: 'C', text: 'Focado', trait: 'D' },
      { id: '27-D', label: 'D', text: 'Afável', trait: 'I' },
    ]
  },
  {
    id: 28,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '28-A', label: 'A', text: 'Analista', trait: 'C' },
      { id: '28-B', label: 'B', text: 'Envolvente', trait: 'I' },
      { id: '28-C', label: 'C', text: 'Autônomo', trait: 'D' },
      { id: '28-D', label: 'D', text: 'Resiliente', trait: 'S' },
    ]
  },
  {
    id: 29,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '29-A', label: 'A', text: 'Minucioso', trait: 'C' },
      { id: '29-B', label: 'B', text: 'Estacionário', trait: 'S' },
      { id: '29-C', label: 'C', text: 'Direcionado', trait: 'D' },
      { id: '29-D', label: 'D', text: 'Radiante', trait: 'I' },
    ]
  },
  {
    id: 30,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '30-A', label: 'A', text: 'Comunicador', trait: 'I' },
      { id: '30-B', label: 'B', text: 'Cumpridor', trait: 'C' },
      { id: '30-C', label: 'C', text: 'Estrategista', trait: 'D' },
      { id: '30-D', label: 'D', text: 'Bondoso', trait: 'S' },
    ]
  },
  {
    id: 31,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '31-A', label: 'A', text: 'Prestativo', trait: 'S' },
      { id: '31-B', label: 'B', text: 'Arrojado', trait: 'D' },
      { id: '31-C', label: 'C', text: 'Brilhante', trait: 'I' },
      { id: '31-D', label: 'D', text: 'Calculista', trait: 'C' },
    ]
  },
  {
    id: 32,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '32-A', label: 'A', text: 'Fundamentado', trait: 'C' },
      { id: '32-B', label: 'B', text: 'Versátil', trait: 'I' },
      { id: '32-C', label: 'C', text: 'Prático', trait: 'D' },
      { id: '32-D', label: 'D', text: 'Acolhedor', trait: 'S' },
    ]
  },
  {
    id: 33,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '33-A', label: 'A', text: 'Líder', trait: 'D' },
      { id: '33-B', label: 'B', text: 'Mediador', trait: 'S' },
      { id: '33-C', label: 'C', text: 'Agradável', trait: 'I' },
      { id: '33-D', label: 'D', text: 'Imparcial', trait: 'C' },
    ]
  },
  {
    id: 34,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '34-A', label: 'A', text: 'Perito', trait: 'C' },
      { id: '34-B', label: 'B', text: 'Solidário', trait: 'S' },
      { id: '34-C', label: 'C', text: 'Espirituoso', trait: 'I' },
      { id: '34-D', label: 'D', text: 'Ativo', trait: 'D' },
    ]
  },
  {
    id: 35,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '35-A', label: 'A', text: 'Impetuoso', trait: 'D' },
      { id: '35-B', label: 'B', text: 'Escrupuloso', trait: 'C' },
      { id: '35-C', label: 'C', text: 'Deslumbrante', trait: 'I' },
      { id: '35-D', label: 'D', text: 'Perseverante', trait: 'S' },
    ]
  },
  {
    id: 36,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '36-A', label: 'A', text: 'Compenetrado', trait: 'C' },
      { id: '36-B', label: 'B', text: 'Afetuoso', trait: 'I' },
      { id: '36-C', label: 'C', text: 'Fiel', trait: 'S' },
      { id: '36-D', label: 'D', text: 'Sistemático', trait: 'C' },
    ]
  },
  {
    id: 37,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '37-A', label: 'A', text: 'Articulado', trait: 'I' },
      { id: '37-B', label: 'B', text: 'Tolerante', trait: 'S' },
      { id: '37-C', label: 'C', text: 'Resolvedor', trait: 'D' },
      { id: '37-D', label: 'D', text: 'Pontual', trait: 'C' },
    ]
  },
  {
    id: 38,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '38-A', label: 'A', text: 'Cauteloso', trait: 'C' },
      { id: '38-B', label: 'B', text: 'Amável', trait: 'S' },
      { id: '38-C', label: 'C', text: 'Audaz', trait: 'D' },
      { id: '38-D', label: 'D', text: 'Sociável', trait: 'I' },
    ]
  },
  {
    id: 39,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '39-A', label: 'A', text: 'Alegre', trait: 'I' },
      { id: '39-B', label: 'B', text: 'Executor', trait: 'D' },
      { id: '39-C', label: 'C', text: 'Estável', trait: 'S' },
      { id: '39-D', label: 'D', text: 'Crítico', trait: 'C' },
    ]
  },
  {
    id: 40,
    prompt: 'Qual palavra melhor te descreve?',
    description: 'Selecione a opção que mais combina com você.',
    options: [
      { id: '40-A', label: 'A', text: 'Bondoso', trait: 'S' },
      { id: '40-B', label: 'B', text: 'Organizado', trait: 'C' },
      { id: '40-C', label: 'C', text: 'Vencedor', trait: 'D' },
      { id: '40-D', label: 'D', text: 'Influente', trait: 'I' },
    ]
  }
];

export const FIT_CULTURAL_QUESTIONS: FitCulturalQuestion[] = [
  {
    id: 1,
    prompt: 'Em um ambiente de trabalho, qual situação mais representa sua preferência?',
    options: [
      { id: 'fc-1-a', label: 'A', text: 'Ambiente dinâmico com autonomia para propor soluções inovadoras e assumir responsabilidades.', category: 'Autonomia', weight: 95 },
      { id: 'fc-1-b', label: 'B', text: 'Ambiente altamente colaborativo onde todas as decisões são debatidas e validadas em conjunto.', category: 'Colaboração', weight: 90 },
      { id: 'fc-1-c', label: 'C', text: 'Ambiente com processos consolidados, instruções claras e métricas bem definidas.', category: 'Qualidade', weight: 80 },
      { id: 'fc-1-d', label: 'D', text: 'Ambiente flexível com foco total em atender as necessidades imediatas dos clientes.', category: 'Foco no Cliente', weight: 88 },
    ]
  },
  {
    id: 2,
    prompt: 'Como você prefere receber orientação e feedbacks da sua liderança?',
    options: [
      { id: 'fc-2-a', label: 'A', text: 'Feedbacks frequentes, diretos e transparentes em reuniões periódicas 1:1.', category: 'Colaboração', weight: 95 },
      { id: 'fc-2-b', label: 'B', text: 'Metas e objetivos claros no início, com liberdade para executar e check-in ao final.', category: 'Autonomia', weight: 90 },
      { id: 'fc-2-c', label: 'C', text: 'Acompanhamento estruturado com relatórios de métricas e indicadores de desempenho.', category: 'Qualidade', weight: 85 },
      { id: 'fc-2-d', label: 'D', text: 'Orientações práticas focadas no impacto direto que meu trabalho gera para o cliente.', category: 'Foco no Cliente', weight: 90 },
    ]
  },
  {
    id: 3,
    prompt: 'Quando confrontado com uma meta desafiadora que parece difícil de atingir:',
    options: [
      { id: 'fc-3-a', label: 'A', text: 'Busco novas abordagens, testo hipóteses diferentes e aceito riscos calculados para inovar.', category: 'Inovação', weight: 95 },
      { id: 'fc-3-b', label: 'B', text: 'Reúno a equipe para construir um plano conjunto dividindo forças e talentos complementares.', category: 'Colaboração', weight: 92 },
      { id: 'fc-3-c', label: 'C', text: 'Reviso o planejamento detalhado, otimizo o tempo e elimino gargalos operacionais.', category: 'Qualidade', weight: 88 },
      { id: 'fc-3-d', label: 'D', text: 'Foco nas ações que trazem retorno mais rápido para o usuário ou cliente final.', category: 'Foco no Cliente', weight: 85 },
    ]
  },
  {
    id: 4,
    prompt: 'Qual aspecto da cultura de uma organização você considera mais essencial para seu engajamento?',
    options: [
      { id: 'fc-4-a', label: 'A', text: 'Segurança psicológica, respeito mútuo e um clima organizacional positivo e acolhedor.', category: 'Colaboração', weight: 92 },
      { id: 'fc-4-b', label: 'B', text: 'Cultura de inovação contínua, aprendizado rápido com erros e incentivo a novas ideias.', category: 'Inovação', weight: 95 },
      { id: 'fc-4-c', label: 'C', text: 'Transparência nas decisões estratégicas e clareza sobre o propósito e visão da empresa.', category: 'Autonomia', weight: 90 },
      { id: 'fc-4-d', label: 'D', text: 'Excelência na qualidade das entregas e orgulho em pertencer a uma marca de referência.', category: 'Qualidade', weight: 88 },
    ]
  },
  {
    id: 5,
    prompt: 'Ao identificar que um processo interno está burocrático e atrasando entregas:',
    options: [
      { id: 'fc-5-a', label: 'A', text: 'Proponho um modelo simplificado e piloto uma solução mais ágil com minha equipe.', category: 'Inovação', weight: 95 },
      { id: 'fc-5-b', label: 'B', text: 'Converso com os responsáveis das outras áreas para entender o contexto e alinhar melhorias.', category: 'Colaboração', weight: 90 },
      { id: 'fc-5-c', label: 'C', text: 'Mapeio o fluxo atual com dados e apresento um relatório formal de otimização à gerência.', category: 'Qualidade', weight: 85 },
      { id: 'fc-5-d', label: 'D', text: 'Avalio se a burocracia está impactando a experiência do cliente para priorizar o ajuste.', category: 'Foco no Cliente', weight: 88 },
    ]
  },
  {
    id: 6,
    prompt: 'Como você equilibra a agilidade na entrega com a excelência técnica?',
    options: [
      { id: 'fc-6-a', label: 'A', text: 'Entrego versões funcionais rapidamente, colho feedbacks e itero para aperfeiçoar.', category: 'Inovação', weight: 92 },
      { id: 'fc-6-b', label: 'B', text: 'Priorizo padrões de qualidade sólidos desde o início para evitar retrabalho futuro.', category: 'Qualidade', weight: 88 },
      { id: 'fc-6-c', label: 'C', text: 'Alinho as expectativas com os stakeholders para definir o nível de acabamento ideal.', category: 'Colaboração', weight: 90 },
      { id: 'fc-6-d', label: 'D', text: 'Garanto que o valor prometido ao cliente seja mantido, mesmo em prazos enxutos.', category: 'Foco no Cliente', weight: 90 },
    ]
  },
  {
    id: 7,
    prompt: 'Em um projeto multidisciplinar com profissionais de diferentes especialidades:',
    options: [
      { id: 'fc-7-a', label: 'A', text: 'Estimulo a integração e garanto que todos tenham espaço para contribuir com seus saberes.', category: 'Colaboração', weight: 94 },
      { id: 'fc-7-b', label: 'B', text: 'Assumo a responsabilidade pela minha parte com excelência e autonomia.', category: 'Autonomia', weight: 88 },
      { id: 'fc-7-c', label: 'C', text: 'Crio pontes entre visões diferentes para construir uma solução inovadora.', category: 'Inovação', weight: 92 },
      { id: 'fc-7-d', label: 'D', text: 'Mantenho o alinhamento das entregas aos padrões de qualidade da organização.', category: 'Qualidade', weight: 86 },
    ]
  },
  {
    id: 8,
    prompt: 'Qual postura melhor define sua visão sobre aprendizado e evolução na carreira?',
    options: [
      { id: 'fc-8-a', label: 'A', text: 'Curiosidade constante, busca autônoma por novos conhecimentos e tendências do mercado.', category: 'Inovação', weight: 96 },
      { id: 'fc-8-b', label: 'B', text: 'Troca ativa com mentores, pares e participação em comunidades de prática.', category: 'Colaboração', weight: 90 },
      { id: 'fc-8-c', label: 'C', text: 'Aprofundamento técnico rigoroso nas metodologias e ferramentas da minha área.', category: 'Qualidade', weight: 88 },
      { id: 'fc-8-d', label: 'D', text: 'Capacitação voltada para resolver dores reais e gerar valor sustentável ao negócio.', category: 'Foco no Cliente', weight: 90 },
    ]
  }
];

export const LOGIC_QUESTIONS: LogicQuestion[] = [
  {
    id: 1,
    title: 'Progressão Numérica',
    prompt: 'Observe a sequência lógica abaixo e identifique o próximo número:',
    visualPattern: ['2', '4', '8', '16', '?'],
    options: [
      { id: 'l1-a', label: 'A', text: '20', isCorrect: false },
      { id: 'l1-b', label: 'B', text: '24', isCorrect: false },
      { id: 'l1-c', label: 'C', text: '32', isCorrect: true },
      { id: 'l1-d', label: 'D', text: '36', isCorrect: false },
    ],
    explanation: 'Cada termo é o dobro do anterior (multiplicação constante por 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32).'
  },
  {
    id: 2,
    title: 'Padrão Alfanumérico',
    prompt: 'Considere a sequência de letras e números: A1, C3, E5, G7, ... Qual é o próximo elemento da série?',
    visualPattern: ['A1', 'C3', 'E5', 'G7', '?'],
    options: [
      { id: 'l2-a', label: 'A', text: 'H8', isCorrect: false },
      { id: 'l2-b', label: 'B', text: 'I9', isCorrect: true },
      { id: 'l2-c', label: 'C', text: 'I8', isCorrect: false },
      { id: 'l2-d', label: 'D', text: 'J9', isCorrect: false },
    ],
    explanation: 'As letras avançam de duas em duas no alfabeto (A, C, E, G, I) e os números são os ímpares correspondentes (1, 3, 5, 7, 9).'
  },
  {
    id: 3,
    title: 'Raciocínio Dedutivo',
    prompt: 'Se todos os Analistas são Estratégicos e alguns Estratégicos são Líderes, podemos afirmar com certeza que:',
    options: [
      { id: 'l3-a', label: 'A', text: 'Todos os Analistas são Líderes.', isCorrect: false },
      { id: 'l3-b', label: 'B', text: 'Pelo menos um Analista é necessariamente Líder.', isCorrect: false },
      { id: 'l3-c', label: 'C', text: 'Alguns profissionais Estratégicos são Analistas.', isCorrect: true },
      { id: 'l3-d', label: 'D', text: 'Nenhum Líder pode ser Analista.', isCorrect: false },
    ],
    explanation: 'Se todo elemento de A pertence a E, logo a interseção não é vazia e existem elementos de E que são A.'
  },
  {
    id: 4,
    title: 'Cálculo Proporcional e Produtividade',
    prompt: 'Três máquinas operando na mesma velocidade produzem 180 peças em 2 horas. Quantas peças 5 dessas mesmas máquinas produzirão em 3 horas de operação contínua?',
    options: [
      { id: 'l4-a', label: 'A', text: '360 peças', isCorrect: false },
      { id: 'l4-b', label: 'B', text: '420 peças', isCorrect: false },
      { id: 'l4-c', label: 'C', text: '450 peças', isCorrect: true },
      { id: 'l4-d', label: 'D', text: '500 peças', isCorrect: false },
    ],
    explanation: 'Cada máquina produz 180 / (3 × 2) = 30 peças por hora. Com 5 máquinas durante 3 horas: 5 × 3 × 30 = 450 peças.'
  },
  {
    id: 5,
    title: 'Sequência de Diferenças Alternadas',
    prompt: 'Analise a seguinte sequência numérica e assinale o termo que substitui o ponto de interrogação: 3, 7, 15, 31, 63, ?',
    visualPattern: ['3', '7', '15', '31', '63', '?'],
    options: [
      { id: 'l5-a', label: 'A', text: '125', isCorrect: false },
      { id: 'l5-b', label: 'B', text: '127', isCorrect: true },
      { id: 'l5-c', label: 'C', text: '128', isCorrect: false },
      { id: 'l5-d', label: 'D', text: '135', isCorrect: false },
    ],
    explanation: 'A lógica é dobrar e somar 1 (ou somar potências de 2: +4, +8, +16, +32, +64): 63 × 2 + 1 = 127.'
  },
  {
    id: 6,
    title: 'Analogia e Relações de Conjunto',
    prompt: 'PROJETO está para CRONOGRAMA assim como ORÇAMENTO está para:',
    options: [
      { id: 'l6-a', label: 'A', text: 'RECURSO FINANCEIRO', isCorrect: true },
      { id: 'l6-b', label: 'B', text: 'ESCRITÓRIO', isCorrect: false },
      { id: 'l6-c', label: 'C', text: 'CLIENTE', isCorrect: false },
      { id: 'l6-d', label: 'D', text: 'PRODUTO FINAL', isCorrect: false },
    ],
    explanation: 'O cronograma é o instrumento regulador do tempo de um projeto, assim como a alocação financeira rege o orçamento.'
  }
];

export const INITIAL_CANDIDATES: CandidateResult[] = [
  {
    id: 'cand-01',
    fullName: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(11) 98765-4321',
    jobPosition: 'Analista Comercial',
    date: '28/08/2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    status: 'Concluído',
    discScores: {
      d: 86,
      i: 68,
      s: 38,
      c: 44,
      predominant: 'Dominância',
      description: 'Perfil focado em resultados rápidos, liderança assertiva, tomada de decisão ágil e superação de metas comerciais ambiciosas.'
    },
    fitCulturalScore: 86,
    logicScorePercent: 90,
    logicScoreFraction: '9/10',
    completedAt: '28/08/2026 10:45'
  },
  {
    id: 'cand-02',
    fullName: 'João Souza',
    email: 'joao.souza@email.com',
    phone: '(11) 97654-3210',
    jobPosition: 'Assistente Administrativo',
    date: '28/08/2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 4,
    status: 'Concluído',
    discScores: {
      d: 32,
      i: 54,
      s: 76,
      c: 68,
      predominant: 'Estabilidade',
      description: 'Perfil paciente, colaborativo, com excelente constância nas rotinas administrativas, lealdade à equipe e foco em processos seguros.'
    },
    fitCulturalScore: 76,
    logicScorePercent: 70,
    logicScoreFraction: '7/10',
    completedAt: '28/08/2026 09:20'
  },
  {
    id: 'cand-03',
    fullName: 'Carlos Lima',
    email: 'carlos.lima@email.com',
    phone: '(21) 99123-4567',
    jobPosition: 'Analista de Marketing',
    date: '28/08/2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 6,
    status: 'Concluído',
    discScores: {
      d: 45,
      i: 60,
      s: 55,
      c: 82,
      predominant: 'Conformidade',
      description: 'Perfil analítico com forte rigor metodológico, atenção aos dados de campanhas, métricas de conversão e excelência na entrega técnica.'
    },
    fitCulturalScore: 82,
    logicScorePercent: 80,
    logicScoreFraction: '8/10',
    completedAt: '28/08/2026 08:30'
  },
  {
    id: 'cand-04',
    fullName: 'Beatriz Martins',
    email: 'beatriz.martins@email.com',
    phone: '(31) 98877-6655',
    jobPosition: 'Desenvolvedor',
    date: '28/08/2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 8,
    status: 'Concluído',
    discScores: {
      d: 60,
      i: 40,
      s: 48,
      c: 88,
      predominant: 'Conformidade',
      description: 'Forte raciocínio lógico-estruturado, precisão em arquitetura de software, padrão de código limpo e autonomia na resolução de problemas.'
    },
    fitCulturalScore: 92,
    logicScorePercent: 100,
    logicScoreFraction: '10/10',
    completedAt: '28/08/2026 08:15'
  },
  {
    id: 'cand-05',
    fullName: 'Lucas Ferreira',
    email: 'lucas.ferreira@email.com',
    phone: '(19) 99345-6789',
    jobPosition: 'Analista Comercial',
    date: '27/08/2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 26,
    status: 'Concluído',
    discScores: {
      d: 70,
      i: 85,
      s: 42,
      c: 35,
      predominant: 'Influência',
      description: 'Extremamente comunicativo, articulado, construtor de relacionamentos com clientes e com grande poder de persuasão e entusiasmo.'
    },
    fitCulturalScore: 88,
    logicScorePercent: 80,
    logicScoreFraction: '8/10',
    completedAt: '27/08/2026 16:40'
  },
  {
    id: 'cand-06',
    fullName: 'Amanda Ribeiro',
    email: 'amanda.ribeiro@email.com',
    phone: '(41) 98456-7890',
    jobPosition: 'Assistente Administrativo',
    date: '27/08/2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 30,
    status: 'Concluído',
    discScores: {
      d: 30,
      i: 48,
      s: 82,
      c: 74,
      predominant: 'Estabilidade',
      description: 'Organizada, paciente, excelente gestão de documentos e controle de fluxo com foco em harmonia e conformidade com as regras internas.'
    },
    fitCulturalScore: 84,
    logicScorePercent: 70,
    logicScoreFraction: '7/10',
    completedAt: '27/08/2026 14:10'
  },
  {
    id: 'cand-07',
    fullName: 'Rafael Costa',
    email: 'rafael.costa@email.com',
    phone: '(51) 99234-5678',
    jobPosition: 'Desenvolvedor',
    date: '27/08/2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 34,
    status: 'Concluído',
    discScores: {
      d: 75,
      i: 45,
      s: 52,
      c: 80,
      predominant: 'Conformidade',
      description: 'Perfil focado em performance, engenharia de sistemas robusta, investigação criteriosa de bugs e entregas de alto impacto técnico.'
    },
    fitCulturalScore: 80,
    logicScorePercent: 90,
    logicScoreFraction: '9/10',
    completedAt: '27/08/2026 11:30'
  },
  {
    id: 'cand-08',
    fullName: 'Gabriela Santos',
    email: 'gabriela.santos@email.com',
    phone: '(71) 98123-9876',
    jobPosition: 'Analista de Marketing',
    date: '26/08/2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 50,
    status: 'Concluído',
    discScores: {
      d: 65,
      i: 90,
      s: 50,
      c: 38,
      predominant: 'Influência',
      description: 'Alta criatividade, facilidade na produção de conteúdo multimídia, engajamento em redes sociais e trabalho integrado em equipe.'
    },
    fitCulturalScore: 90,
    logicScorePercent: 80,
    logicScoreFraction: '8/10',
    completedAt: '26/08/2026 17:05'
  },
  {
    id: 'cand-09',
    fullName: 'Fernando Rocha',
    email: 'fernando.rocha@email.com',
    phone: '(61) 99876-5432',
    jobPosition: 'Desenvolvedor',
    date: '26/08/2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 54,
    status: 'Concluído',
    discScores: {
      d: 55,
      i: 48,
      s: 60,
      c: 84,
      predominant: 'Conformidade',
      description: 'Metódico, calmo sob pressão, prioriza arquitetura limpa, testes unitários e documentação técnica impecável.'
    },
    fitCulturalScore: 85,
    logicScorePercent: 90,
    logicScoreFraction: '9/10',
    completedAt: '26/08/2026 15:20'
  },
  {
    id: 'cand-10',
    fullName: 'Juliana Mendes',
    email: 'juliana.mendes@email.com',
    phone: '(81) 98765-1234',
    jobPosition: 'Analista Comercial',
    date: '25/08/2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 75,
    status: 'Concluído',
    discScores: {
      d: 80,
      i: 82,
      s: 40,
      c: 45,
      predominant: 'Influência',
      description: 'Combinação de alta energia comercial (Dominância + Influência), proatividade em prospecção e excelente fechamento de negócios.'
    },
    fitCulturalScore: 82,
    logicScorePercent: 80,
    logicScoreFraction: '8/10',
    completedAt: '25/08/2026 16:50'
  },
  {
    id: 'cand-11',
    fullName: 'Pedro Alves',
    email: 'pedro.alves@email.com',
    phone: '(85) 99123-8899',
    jobPosition: 'Assistente Administrativo',
    date: '25/08/2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 78,
    status: 'Concluído',
    discScores: {
      d: 35,
      i: 50,
      s: 70,
      c: 65,
      predominant: 'Estabilidade',
      description: 'Responsável, colaborativo, com boa adaptabilidade a rotinas de faturamento e apoio administrativo a múltiplos departamentos.'
    },
    fitCulturalScore: 78,
    logicScorePercent: 60,
    logicScoreFraction: '6/10',
    completedAt: '25/08/2026 14:15'
  },
  {
    id: 'cand-12',
    fullName: 'Camila Duarte',
    email: 'camila.duarte@email.com',
    phone: '(48) 98899-0011',
    jobPosition: 'Analista de Marketing',
    date: '24/08/2026',
    timestamp: Date.now() - 1000 * 60 * 60 * 100,
    status: 'Concluído',
    discScores: {
      d: 58,
      i: 78,
      s: 62,
      c: 50,
      predominant: 'Influência',
      description: 'Foco em branding, experiência do cliente, empatia com o público-alvo e capacidade de mobilizar equipes em campanhas integradas.'
    },
    fitCulturalScore: 88,
    logicScorePercent: 80,
    logicScoreFraction: '8/10',
    completedAt: '24/08/2026 11:10'
  }
];
