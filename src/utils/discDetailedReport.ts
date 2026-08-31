import { DISCScores } from '../types';

export interface FactorIntensity {
  level: 'Baixo' | 'Médio' | 'Alto' | 'Muito Alto';
  badgeColor: string;
  description: string;
}

export interface DetailedDISCReport {
  archetypeTitle: string;
  archetypeSubtitle: string;
  summaryText: string;
  primaryTrait: string;
  secondaryTrait: string;
  overviewSummary: string;
  keyStrengthsList: string[];
  
  intensities: {
    d: FactorIntensity;
    i: FactorIntensity;
    s: FactorIntensity;
    c: FactorIntensity;
  };

  deepAnalysis: {
    description: string;
    highlights: string[];
  };

  strengths: string[];
  attentionPoints: string[];
  stressBehavior: string;
  motivators: string[];
  stressors: string[];

  communicationStyle: string;
  workStyle: string;
  idealEnvironment: {
    summary: string;
    items: string[];
  };
  howToWorkWith: string[];

  leadership: {
    styleTitle: string;
    summary: string;
    strengths: string[];
    attentionPoints: string[];
    tips: string[];
  };

  pdi: {
    leverageStrengths: {
      title: string;
      description: string;
      actions: string[];
    }[];
    developAreas: {
      title: string;
      problem: string;
      solution: string;
      actions: string[];
    }[];
    recommendedBooks: {
      title: string;
      author: string;
      why: string;
    }[];
    studyAreas: {
      category: string;
      description: string;
      topics: string[];
    }[];
  };

  nextSteps: {
    title: string;
    description: string;
  }[];
}

function getIntensityLevel(score: number): FactorIntensity['level'] {
  if (score >= 70) return 'Muito Alto';
  if (score >= 50) return 'Alto';
  if (score >= 30) return 'Médio';
  return 'Baixo';
}

function getBadgeColor(level: FactorIntensity['level']): string {
  switch (level) {
    case 'Muito Alto': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Alto': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'Médio': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Baixo': return 'bg-slate-100 text-slate-700 border-slate-200';
  }
}

export function generateDetailedDISCReport(disc: DISCScores): DetailedDISCReport {
  const d = disc.d || 25;
  const i = disc.i || 25;
  const s = disc.s || 25;
  const c = disc.c || 25;

  const scoreArray = [
    { key: 'D', name: 'Dominância', score: d },
    { key: 'I', name: 'Influência', score: i },
    { key: 'S', name: 'Estabilidade', score: s },
    { key: 'C', name: 'Conformidade', score: c },
  ].sort((a, b) => b.score - a.score);

  const primary = scoreArray[0];
  const secondary = scoreArray[1];
  const comboKey = `${primary.key}${secondary.key}`;

  const dLevel = getIntensityLevel(d);
  const iLevel = getIntensityLevel(i);
  const sLevel = getIntensityLevel(s);
  const cLevel = getIntensityLevel(c);

  // Trait intensity narrative
  const dDescMap: Record<string, string> = {
    'Muito Alto': 'Extremamente orientado a resultados, ousado, direto e competitivo. Assume o comando com firmeza diante de qualquer obstáculo.',
    'Alto': 'Forte direcionamento para metas, tomada de decisão rápida e assertividade para liderar e superar desafios.',
    'Médio': 'Equilibra assertividade com diplomacia. Sabe quando liderar e quando colaborar, dosando firmeza e flexibilidade.',
    'Baixo': 'Prefere ambientes cooperativos e pacíficos, evitando confrontos diretos e priorizando o consenso antes da imposição.'
  };

  const iDescMap: Record<string, string> = {
    'Muito Alto': 'Altamente carismático, persuasivo e expressivo. Conecta-se instantaneamente com pessoas e energiza o ambiente ao redor.',
    'Alto': 'Naturalmente comunicativo e entusiástico. Gosta de trabalhar em equipe, inspirar outros e cultivar redes de relacionamento.',
    'Médio': 'Boa capacidade de comunicação sem perder a objetividade. Sabe interagir socialmente mantendo o foco nas entregas.',
    'Baixo': 'Mais reservado e reflexivo. Prefere comunicação direta, baseada em dados e fatos, sem necessidade de constante interação social.'
  };

  const sDescMap: Record<string, string> = {
    'Muito Alto': 'Altamente leal, paciente e focado em harmonia. Cria laços duradouros e oferece sustentação estável aos processos e às pessoas.',
    'Alto': 'Excelente ouvinte, cooperativo e constante. Valoriza previsibilidade, trabalho em equipe e segurança nas relações.',
    'Médio': 'Capaz de lidar com mudanças graduais mantendo uma rotina saudável. Equilíbrio entre ritmo contínuo e adaptação.',
    'Baixo': 'Inquieto, busca dinamismo acelerado e variedade contínua. Adapta-se rapidamente a mudanças e prefere pouca rotina.'
  };

  const cDescMap: Record<string, string> = {
    'Muito Alto': 'Rigorosamente minucioso, sistemático e perfeccionista. Alta exigência por qualidade técnica, regras e padrões impecáveis.',
    'Alto': 'Analítico, organizado e atento a detalhes. Baseia suas decisões em critérios técnicos, normas e dados consistentes.',
    'Médio': 'Equilibra atenção a detalhes com pragmatismo. Sabe quando aprofundar a análise e quando avançar com agilidade.',
    'Baixo': 'Focado no quadro geral e na velocidade de execução. Menos apegado a regras rígidas, priorizando flexibilidade e inovação.'
  };

  // Archetypes and tailored insights
  let archetypeTitle = 'O Conselheiro';
  let archetypeSubtitle = 'Combina escuta ativa com habilidade social. Excelente em apoiar pessoas e facilitar trabalho em equipe harmonioso.';
  let deepDescription = 'O perfil combina empatia e cooperação para criar ambientes onde as pessoas se sentem ouvidas, seguras e motivadas a colaborar.';
  let leadershipStyle = 'Líder Apoiador';
  let leadershipSummary = 'Lidera pelo suporte e desenvolvimento da equipe. Cria ambiente de confiança e segurança psicológica.';

  let keyStrengths = [
    'Excelente ouvinte e conselheiro',
    'Cria ambientes de confiança e empatia',
    'Facilita a colaboração e sinergia entre pares',
    'Paciente, constante e acolhedor',
    'Habilidade natural de mediar conflitos e cultivar harmonia'
  ];

  let attentionPoints = [
    'Pode ter dificuldade em tomar decisões impopulares com rapidez',
    'Tendência a evitar confrontos e conversas difíceis necessárias',
    'Pode ser excessivamente flexível diante de exigências alheias',
    'Dificuldade em estabelecer limites e dizer "não"'
  ];

  let stressBehavior = 'Tende a se sobrecarregar tentando agradar a todos e absorver tensões alheias. Pode se fechar em silêncio ou postergar decisões críticas.';
  
  let motivators = [
    'Estabilidade, segurança e previsibilidade',
    'Relacionamentos de longo prazo e confiança mútua',
    'Ambiente de trabalho colaborativo e harmonioso',
    'Reconhecimento sincero pela lealdade e dedicação',
    'Processos e expectativas claros'
  ];

  let stressors = [
    'Mudanças bruscas e inesperadas sem contexto prévio',
    'Conflitos interpessoais e clima de tensão',
    'Prazos agressivos com pressão psicológica excessiva',
    'Falta de clareza nas instruções e metas',
    'Ambiente competitivo agressivo e predatório'
  ];

  let commStyle = 'Calmo, empático e atencioso. Prefere conversas individuais, escuta ativamente antes de falar e valoriza um tom respeitoso e acolhedor.';
  let workStyle = 'Trabalha melhor com rotinas estabelecidas, alinhamentos claros e tempo hábil para adaptação. Valoriza o espírito de equipe e apoio mútuo.';
  let idealEnv = {
    summary: 'Funções que envolvem desenvolvimento de pessoas, atendimento consultivo, mediação, RH e fortalecimento de equipes.',
    items: [
      'Ambiente estável, respeitoso e previsível',
      'Equipe colaborativa com foco em apoio mútuo',
      'Tempo de maturação e adaptação a novas diretrizes',
      'Relações interpessoais de confiança',
      'Processos estruturados e bem definidos'
    ]
  };

  let howToWorkWith = [
    'Dê tempo para processar e planejar mudanças antes de cobrar execução imediata',
    'Crie um ambiente seguro e encorajador para que expresse opiniões críticas',
    'Seja paciente, direto porém cordial na comunicação',
    'Reconheça e valorize a lealdade, constância e dedicação',
    'Evite cobranças agressivas de última hora sem justificativa clara'
  ];

  // Tailoring for other primary profiles
  if (primary.key === 'D') {
    archetypeTitle = secondary.key === 'I' ? 'O Comandante Inspirador' : secondary.key === 'C' ? 'O Estrategista Executor' : 'O Realizador Decisivo';
    archetypeSubtitle = 'Orientado a resultados de alto impacto, superação de metas e tomada de decisão ágil e firme.';
    deepDescription = 'Combina assertividade incisiva com senso de urgência. Assume a liderança natural de situações críticas, removendo barreiras com coragem e determinação.';
    leadershipStyle = 'Líder Decisivo e Direcionador';
    leadershipSummary = 'Lidera por objetivos claros, cobrança de alto padrão e velocidade de resposta. Inspira pela coragem e capacidade de entregar resultados.';
    
    keyStrengths = [
      'Foco implacável em resultados e metas arrojadas',
      'Tomada de decisão rápida sob pressão',
      'Liderança assertiva e capacidade de comando',
      'Proatividade, autonomia e pioneirismo',
      'Capacidade de resolver crises com pragmatismo'
    ];

    attentionPoints = [
      'Pode soar impaciente ou ríspido em momentos de estresse',
      'Risco de atropelar processos ou detalhes na busca por velocidade',
      'Dificuldade em delegar ou dar espaço para ritmos mais lentos',
      'Pode desconsiderar o impacto emocional de decisões na equipe'
    ];

    stressBehavior = 'Torna-se mais exigente, centralizador e direto ao extremo, podendo demonstrar irritação com lentidão ou hesitação de terceiros.';

    motivators = [
      'Autonomia para tomar decisões e liderar iniciativas',
      'Desafios complexos e metas ambiciosas',
      'Oportunidades de crescimento rápido e autoridade',
      'Ambiente dinâmico com liberdade de ação',
      'Reconhecimento tangível por vitórias e conquistas'
    ];

    stressors = [
      'Microgerenciamento e burocracia excessiva',
      'Lentidão na tomada de decisões e falta de iniciativa',
      'Falta de autonomia ou limites rígidos impostos sem lógica',
      'Perda de controle sobre os resultados finais',
      'Pessoas indecisas ou excessivamente lentas'
    ];

    commStyle = 'Direto, objetivo e focado no essencial. Valoriza brevidade, fatos principais e direcionamento prático para ação imediata.';
    workStyle = 'Acelerado, pragmático e focado na linha de chegada. Gosta de autonomia, projetos desafiadores e pouca burocracia.';
    idealEnv = {
      summary: 'Liderança de projetos estratégicos, expansão comercial, gestão de crises e ambientes competitivos de alta performance.',
      items: [
        'Autonomia e poder de decisão',
        'Cultura orientada a resultados e meritocracia',
        'Metas claras e desafiadoras',
        'Ambiente ágil com pouca interferência burocrática',
        'Oportunidades constantes de superação'
      ]
    };

    howToWorkWith = [
      'Seja direto, claro e focado nas soluções e nos números finais',
      'Evite rodeios, excesso de detalhes ou justificativas demoradas',
      'Dê autonomia e defina claramente os limites de responsabilidade',
      'Apresente problemas acompanhados de propostas de solução',
      'Negocie prazos e acordos com base em retorno e impacto'
    ];
  } else if (primary.key === 'I') {
    archetypeTitle = secondary.key === 'D' ? 'O Promotor Visionário' : secondary.key === 'S' ? 'O Aglutinador Empático' : 'O Comunicador Persuasivo';
    archetypeSubtitle = 'Orientado a pessoas, entusiasmo, construção de parcerias e comunicação envolvente.';
    deepDescription = 'Combina facilidade de expressão com otimismo contagiante. Excelente em abrir portas, alinhar expectativas, negociar e motivar grupos de trabalho.';
    leadershipStyle = 'Líder Inspirador e Carismático';
    leadershipSummary = 'Lidera pela motivação, visão positiva e engajamento das pessoas. Cria um ambiente vibrante, criativo e participativo.';

    keyStrengths = [
      'Comunicação interpessoal cativante e persuasiva',
      'Facilidade ímpar de criar redes e relacionamentos',
      'Otimismo, energia e capacidade de engajar equipes',
      'Criatividade e pensamento inovador fora da caixa',
      'Habilidade em vendas, apresentações e negociação'
    ];

    attentionPoints = [
      'Pode ter dificuldade de concentração em tarefas repetitivas',
      'Risco de prometer mais do que pode entregar pelo entusiasmo',
      'Pode dispersar o foco com excesso de ideias e iniciativas',
      'Sensibilidade a rejeição ou ambientes frios e impessoais'
    ];

    stressBehavior = 'Pode se tornar impulsivo, perder a organização dos detalhes ou falar em excesso para tentar contornar a situação.';

    motivators = [
      'Reconhecimento público e valorização de suas ideias',
      'Liberdade para expressar criatividade e interagir',
      'Ambientes colaborativos, alegres e descontraídos',
      'Projetos que envolvam pessoas, clientes e apresentações',
      'Oportunidades de influenciar e inspirar colegas'
    ];

    stressors = [
      'Isolamento, trabalho solitário e falta de interação humana',
      'Rotinas monótonas e controle rígido sem abertura para ideias',
      'Ambientes frios, excessivamente críticos ou formais',
      'Falta de reconhecimento pelo seu entusiasmo e esforço',
      'Restrições severas à criatividade e flexibilidade'
    ];

    commStyle = 'Expressivo, dinâmico e amigável. Usa histórias, metáforas e linguagem corporal para conectar e motivar os ouvintes.';
    workStyle = 'Colaborativo, flexível e multifacetado. Rende mais quando intercala tarefas analíticas com reuniões e momentos de troca.';
    idealEnv = {
      summary: 'Áreas comerciais, marketing, relações públicas, parcerias, treinamento e gestão de equipes de alta interação.',
      items: [
        'Ambiente dinâmico e participativo',
        'Liberdade para sugerir ideias e inovações',
        'Contatos frequentes com pessoas e clientes',
        'Cultura de celebração de conquistas',
        'Apoio em processos de organização e rotina'
      ]
    };

    howToWorkWith = [
      'Inicie conversas com simpatia e demonstre interesse genuíno',
      'Permita que compartilhe ideias e reconheça suas contribuições',
      'Ajude a estruturar prazos e manter o foco nas prioridades essenciais',
      'Evite críticas excessivamente frias ou em tom desanimador',
      'Utilize acordos visuais e lembretes amigáveis para tarefas operacionais'
    ];
  } else if (primary.key === 'C') {
    archetypeTitle = secondary.key === 'D' ? 'O Avaliador Pragmático' : secondary.key === 'S' ? 'O Especialista Metódico' : 'O Analista Criterioso';
    archetypeSubtitle = 'Orientado a excelência técnica, rigor metodológico, qualidade e precisão analítica.';
    deepDescription = 'Combina raciocínio lógico apurado com compromisso inegociável com a qualidade e as normas. Garante que nada passe despercebido.';
    leadershipStyle = 'Líder Técnico e Estruturado';
    leadershipSummary = 'Lidera pelo exemplo técnico, clareza metodológica e busca contínua por eficiência e eliminação de falhas.';

    keyStrengths = [
      'Atenção cirúrgica aos detalhes e padrões de qualidade',
      'Pensamento crítico, lógico e resolução estruturada de problemas',
      'Organização, metodologia e cumprimento de prazos com precisão',
      'Cuidado com conformidade, dados e segurança dos processos',
      'Capacidade de auditar, documentar e otimizar fluxos de trabalho'
    ];

    attentionPoints = [
      'Pode cair na "paralisia por análise" por perfeccionismo',
      'Dificuldade em aceitar soluções aproximadas sob prazos curtos',
      'Pode soar excessivamente crítico ou cético perante novas ideias',
      'Resistência inicial a mudanças que não tenham dados comprovados'
    ];

    stressBehavior = 'Tende a se isolar para checar exaustivamente cada dado, tornando-se mais inflexível e resistente a atalhos.';

    motivators = [
      'Tarefas que exigem precisão, lógica e especialização técnica',
      'Regras, métodos e processos bem fundamentados',
      'Tempo suficiente para analisar antes de entregar',
      'Reconhecimento pela qualidade impecável e exatidão',
      'Ambiente estruturado, profissional e sem improvisos'
    ];

    stressors = [
      'Falta de padrões, retrabalho gerado por desatenção de outros',
      'Pressão para entregar com qualidade abaixo do aceitável',
      'Decisões tomadas sem embasamento de dados ou critérios técnicos',
      'Ambientes barulhentos, desorganizados ou instáveis',
      'Mudanças repentinas sem justificativa lógica consistente'
    ];

    commStyle = 'Preciso, formal e bem fundamentado. Prefere dados, fatos escritos, relatórios claros e perguntas objetivas.';
    workStyle = 'Sistemático, focado e meticuloso. Prefere trabalhar com concentração e seguir checklists detalhados.';
    idealEnv = {
      summary: 'Auditoria, finanças, desenvolvimento de software, compliance, controle de qualidade, engenharia e análise de dados.',
      items: [
        'Ambiente organizado e propício à concentração',
        'Padrões de qualidade claros e respeitados pela liderança',
        'Acesso a ferramentas e dados confiáveis',
        'Critérios de avaliação transparentes e objetivos',
        'Tempo para planejamento e refinamento técnico'
      ]
    };

    howToWorkWith = [
      'Apresente argumentos embasados em fatos, números e precedentes',
      'Evite apelos puramente emocionais ou decisões no calor do momento',
      'Dê clareza sobre os critérios de sucesso e padrões esperados',
      'Respeite sua necessidade de tempo para analisar antes de responder',
      'Valide soluções técnicas com base em métricas mensuráveis'
    ];
  }

  // Individual Development Plan (PDI)
  const pdi = {
    leverageStrengths: [
      {
        title: primary.key === 'D' ? 'Liderança e Projetos Estratégicos' : primary.key === 'I' ? 'Comunicação e Relacionamentos' : primary.key === 'S' ? 'Desenvolvimento de Pessoas e Mentoria' : 'Excelência Técnica e Processos',
        description: primary.key === 'D' 
          ? 'Sua assertividade e foco em metas fazem de você um condutor natural de iniciativas críticas e novos negócios.'
          : primary.key === 'I'
          ? 'Sua capacidade de encantar e mobilizar pessoas é um diferencial para negociações, vendas e alinhamentos de equipes.'
          : primary.key === 'S'
          ? 'Sua paciência e escuta ativa fazem de você um excelente mentor. Invista em desenvolver outros e construir times coesos.'
          : 'Sua precisão analítica é vital para estruturar fluxos à prova de erros e garantir padrões de classe mundial.',
        actions: primary.key === 'D'
          ? ['Gestão de projetos prioritários', 'Expansão de novos canais', 'Liderança de times de alta performance']
          : primary.key === 'I'
          ? ['Apresentações institucionais', 'Engajamento de stakeholders', 'Treinamentos e integração de times']
          : primary.key === 'S'
          ? ['Programa de mentoria interna', 'Coaching de pares e onboarding', 'Mediação de conflitos e suporte operacional']
          : ['Auditoria de qualidade e processos', 'Modelagem de dados e relatórios', 'Implementação de melhores práticas técnicas']
      },
      {
        title: 'Gestão de Relacionamentos e Sustentabilidade',
        description: 'Sua habilidade em manter consistência comportamental é valiosa para a retenção de talentos e estabilidade operacional.',
        actions: ['Gestão de contas-chave', 'Construção de parcerias estratégicas', 'Fortalecimento da cultura interna']
      }
    ],
    developAreas: [
      {
        title: 'Assertividade e Comunicação Construtiva',
        problem: 'Tendência a evitar conversas difíceis ou a não expressar limites de forma imediata.',
        solution: 'Pratique expressar posicionamentos claros logo no início das discussões, utilizando técnicas de feedback descritivo.',
        actions: [
          'Pratique dizer "não" com gentileza e clareza de prioridades',
          'Expresse suas visões técnicas ativamente em reuniões estratégicas',
          'Defenda suas ideias com base no impacto positivo para a organização'
        ]
      },
      {
        title: 'Foco, Priorização e Gestão do Tempo',
        problem: 'Risco de dispersão entre demandas paralelas ou sobrecarga por tentar absorver tudo.',
        solution: 'Reserve blocos de tempo protegido (Deep Work) para entregas-chave e mantenha o alinhamento de prioridades visível.',
        actions: [
          'Utilize a técnica Pomodoro ou Time Blocking diário',
          'Revise as 3 prioridades essenciais toda manhã antes de abrir e-mails',
          'Alinhe expectativas de prazo com antecedência em casos de imprevistos'
        ]
      }
    ],
    recommendedBooks: [
      {
        title: 'A Coragem de Ser Imperfeito',
        author: 'Brené Brown',
        why: 'Desenvolve vulnerabilidade, liderança humanizada e autenticidade nas relações profissionais.'
      },
      {
        title: 'Assertividade: O Segredo das Boas Relações',
        author: 'Vera Martins',
        why: 'Técnicas práticas para comunicação firme, equilibrada e sem agressividade.'
      },
      {
        title: 'O Poder do Hábito',
        author: 'Charles Duhigg',
        why: 'Ajuda a criar rotinas saudáveis e consistentes que sustentam a produtividade sustentável.'
      },
      {
        title: 'Getting Things Done (A Arte de Fazer Acontecer)',
        author: 'David Allen',
        why: 'Metodologia prática mundialmente reconhecida para organização mental e execução de alto nível.'
      }
    ],
    studyAreas: [
      {
        category: 'Liderança e Assertividade',
        description: 'Desenvolva confiança para liderar com equilíbrio, expressar posicionamentos e negociar acordos de alto valor.',
        topics: ['Comunicação Assertiva e Não-Violenta', 'Liderança Situacional', 'Negociação Estratégica']
      },
      {
        category: 'Gestão do Tempo e Produtividade',
        description: 'Desenvolva sistemas para blindar o foco, gerenciar fluxos de trabalho e entregar consistentemente sem sobrecarga.',
        topics: ['Produtividade Pessoal e Métodos Ágeis', 'Gestão de Projetos (Scrum/Kanban)', 'Priorização Estratégica (Matriz de Eisenhower)']
      }
    ]
  };

  const nextSteps = [
    {
      title: '1. Autoconhecimento',
      description: 'Reflita sobre como seus pontos fortes se manifestam no dia a dia e como os pontos de atenção podem estar impactando suas relações.'
    },
    {
      title: '2. Comunicação',
      description: 'Adapte sua comunicação ao estilo dos outros. Entenda que cada pessoa tem preferências diferentes e ajuste sua abordagem com empatia.'
    },
    {
      title: '3. Desenvolvimento',
      description: 'Trabalhe seus pontos de atenção de forma consciente. Peça feedback frequente e pratique comportamentos fora da sua zona de conforto.'
    },
    {
      title: '4. Equipe e Complementaridade',
      description: 'Busque sinergia. Times de alta performance possuem diversidade de perfis, onde cada um contribui com suas forças únicas para vencer desafios.'
    }
  ];

  return {
    archetypeTitle,
    archetypeSubtitle,
    summaryText: `Seu perfil principal é ${primary.name} com tendência secundária para ${secondary.name}`,
    primaryTrait: primary.name,
    secondaryTrait: secondary.name,
    overviewSummary: archetypeSubtitle,
    keyStrengthsList: keyStrengths,

    intensities: {
      d: { level: dLevel, badgeColor: getBadgeColor(dLevel), description: dDescMap[dLevel] },
      i: { level: iLevel, badgeColor: getBadgeColor(iLevel), description: iDescMap[iLevel] },
      s: { level: sLevel, badgeColor: getBadgeColor(sLevel), description: sDescMap[sLevel] },
      c: { level: cLevel, badgeColor: getBadgeColor(cLevel), description: cDescMap[cLevel] },
    },

    deepAnalysis: {
      description: deepDescription,
      highlights: [
        primary.key === 'D' ? 'Orientação para ação e metas' : primary.key === 'I' ? 'Comunicação e engajamento' : primary.key === 'S' ? 'Escuta empática e suporte genuíno' : 'Análise criteriosa e método',
        secondary.key === 'D' ? 'Foco em resolução ágil' : secondary.key === 'I' ? 'Construção de parcerias' : secondary.key === 'S' ? 'Facilitação de colaboração' : 'Atenção aos detalhes técnicos',
        'Criação de ambientes de confiança',
        'Consistência e entrega de valor'
      ]
    },

    strengths: keyStrengths,
    attentionPoints,
    stressBehavior,
    motivators,
    stressors,

    communicationStyle: commStyle,
    workStyle,
    idealEnvironment: idealEnv,
    howToWorkWith,

    leadership: {
      styleTitle: leadershipStyle,
      summary: leadershipSummary,
      strengths: [
        'Cria ambiente de confiança e segurança',
        'Excelente capacidade de escuta e acolhimento',
        'Desenvolve pessoas e potencializa talentos',
        'Promove estabilidade e coesão no time'
      ],
      attentionPoints: [
        'Pode demorar para tomar decisões difíceis ou impopulares',
        'Risco de evitar mudanças necessárias por receio de atrito',
        'Pode ser excessivamente complacente com baixo desempenho'
      ],
      tips: [
        'Aprenda a dizer "não" com gentileza e firmeza',
        'Estabeleça limites saudáveis de carga de trabalho',
        'Pratique feedbacks construtivos contínuos',
        'Reconheça que nem todas as decisões agradarão a 100% das pessoas'
      ]
    },

    pdi,
    nextSteps
  };
}
