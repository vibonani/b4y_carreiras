import { BigFiveScores } from '../types';

export interface FactorIntensity {
  level: 'Baixo' | 'Médio' | 'Alto' | 'Muito Alto';
  badgeColor: string;
  description: string;
}

export interface DetailedBigFiveReport {
  archetypeTitle: string;
  archetypeSubtitle: string;
  summaryText: string;
  primaryTrait: string;
  secondaryTrait: string;
  overviewSummary: string;
  keyStrengthsList: string[];

  intensities: {
    e: FactorIntensity;
    a: FactorIntensity;
    c: FactorIntensity;
    n: FactorIntensity;
    o: FactorIntensity;
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

export function generateDetailedBigFiveReport(scores: BigFiveScores): DetailedBigFiveReport {
  const e = scores.e ?? 50;
  const a = scores.a ?? 50;
  const c = scores.c ?? 50;
  const n = scores.n ?? 50; // já invertido: maior = mais estável
  const o = scores.o ?? 50;

  const scoreArray = [
    { key: 'E', name: 'Extroversão', score: e },
    { key: 'A', name: 'Amabilidade', score: a },
    { key: 'C', name: 'Conscienciosidade', score: c },
    { key: 'N', name: 'Estabilidade Emocional', score: n },
    { key: 'O', name: 'Abertura à Experiência', score: o },
  ].sort((x, y) => y.score - x.score);

  const primary = scoreArray[0];
  const secondary = scoreArray[1];

  const eLevel = getIntensityLevel(e);
  const aLevel = getIntensityLevel(a);
  const cLevel = getIntensityLevel(c);
  const nLevel = getIntensityLevel(n);
  const oLevel = getIntensityLevel(o);

  const eDescMap: Record<string, string> = {
    'Muito Alto': 'Extremamente sociável, enérgico e expansivo. Busca intensamente interação social, fala com desenvoltura e assume papel de destaque em grupos.',
    'Alto': 'Comunicativo e cheio de energia. Gosta de interagir, iniciar conversas e se envolver ativamente em atividades sociais e de equipe.',
    'Médio': 'Equilibra momentos de interação social com períodos de introspecção, adaptando-se bem tanto a ambientes movimentados quanto mais tranquilos.',
    'Baixo': 'Mais reservado e reflexivo. Prefere interações seletivas e profundas a grandes grupos, recarregando energia em momentos de tranquilidade.'
  };

  const aDescMap: Record<string, string> = {
    'Muito Alto': 'Extremamente compassivo, confiante nos outros e disposto a colaborar. Prioriza harmonia e o bem-estar coletivo acima de interesses individuais.',
    'Alto': 'Cooperativo, gentil e confiável. Constrói relações de confiança com facilidade e valoriza o trabalho em equipe respeitoso.',
    'Médio': 'Equilibra cooperação com assertividade, sabendo colaborar sem abrir mão de suas próprias posições quando necessário.',
    'Baixo': 'Mais direto e cético. Prioriza clareza e fatos objetivos, podendo confrontar posições e questionar intenções alheias com facilidade.'
  };

  const cDescMap: Record<string, string> = {
    'Muito Alto': 'Extremamente disciplinado, organizado e perfeccionista. Planeja meticulosamente e cumpre compromissos com rigor exemplar.',
    'Alto': 'Responsável, organizado e persistente. Entrega o que promete, mantém rotinas estruturadas e busca qualidade consistente no trabalho.',
    'Médio': 'Equilibra organização com flexibilidade, adaptando o nível de planejamento conforme a exigência de cada situação.',
    'Baixo': 'Mais espontâneo e flexível. Prefere improvisar a seguir planos rígidos, podendo ter dificuldade com rotinas e prazos estruturados.'
  };

  const nDescMap: Record<string, string> = {
    'Muito Alto': 'Extremamente calmo e resiliente. Mantém-se sereno mesmo sob forte pressão, raramente demonstra ansiedade ou instabilidade emocional.',
    'Alto': 'Emocionalmente equilibrado. Lida bem com o estresse do dia a dia e se recupera rapidamente de contratempos.',
    'Médio': 'Mantém-se estável na maior parte do tempo, mas pode sentir mais tensão em situações de pressão intensa ou incerteza prolongada.',
    'Baixo': 'Mais sensível emocionalmente. Tende a sentir preocupação, tensão ou oscilações de humor com mais intensidade diante de pressão.'
  };

  const oDescMap: Record<string, string> = {
    'Muito Alto': 'Extremamente curioso, criativo e aberto a novas ideias. Busca ativamente novidade, arte e formas não convencionais de pensar.',
    'Alto': 'Curioso e imaginativo. Aprecia novas experiências, ideias abstratas e abordagens criativas para resolver problemas.',
    'Médio': 'Equilibra curiosidade por coisas novas com apreço por métodos já testados e comprovados.',
    'Baixo': 'Mais prático e convencional. Prefere abordagens testadas e comprovadas a experimentações abstratas ou pouco convencionais.'
  };

  // Archetypes and tailored insights — default/base branch: Amabilidade
  let archetypeTitle = 'O Colaborador Empático';
  let archetypeSubtitle = 'Combina cooperação genuína com confiança nas pessoas. Cria ambientes de trabalho harmoniosos e constrói relações duradouras.';
  let deepDescription = 'O perfil combina empatia e disposição para cooperar, criando ambientes onde as pessoas se sentem respeitadas, ouvidas e motivadas a colaborar.';
  let leadershipStyle = 'Líder Colaborativo';
  let leadershipSummary = 'Lidera pelo exemplo de cooperação e respeito. Cria ambiente de confiança onde a equipe se sente segura para contribuir.';

  let keyStrengths = [
    'Excelente capacidade de cooperação e escuta',
    'Constrói relações de confiança com facilidade',
    'Facilita a colaboração e a resolução pacífica de conflitos',
    'Confia nas boas intenções das pessoas e inspira reciprocidade',
    'Cria ambientes de trabalho harmoniosos e respeitosos'
  ];

  let attentionPoints = [
    'Pode ter dificuldade em confrontar ou dar feedbacks difíceis',
    'Tendência a evitar conflitos necessários para não desagradar',
    'Pode ser ingênuo diante de pessoas ou situações pouco confiáveis',
    'Dificuldade em priorizar seus próprios interesses diante dos alheios'
  ];

  let stressBehavior = 'Tende a se sobrecarregar tentando agradar a todos e absorver tensões alheias. Pode evitar confrontos necessários e postergar decisões desconfortáveis.';

  let motivators = [
    'Ambiente de trabalho colaborativo e respeitoso',
    'Relacionamentos de confiança e reciprocidade',
    'Reconhecimento sincero pela dedicação e boa vontade',
    'Trabalho em equipe com propósito compartilhado',
    'Clima organizacional psicologicamente seguro'
  ];

  let stressors = [
    'Conflitos interpessoais e clima de tensão constante',
    'Ambientes competitivos, agressivos ou individualistas',
    'Necessidade de tomar decisões impopulares com frequência',
    'Falta de reciprocidade ou de reconhecimento pelo esforço',
    'Pressão para confrontar colegas ou impor limites'
  ];

  let commStyle = 'Gentil, empático e atencioso. Prefere conversas respeitosas, escuta ativamente antes de responder e busca consenso nas decisões.';
  let workStyle = 'Trabalha melhor em ambientes colaborativos, com apoio mútuo e clareza de expectativas. Valoriza o espírito de equipe acima da competição individual.';
  let idealEnv = {
    summary: 'Funções que envolvem atendimento, suporte, RH, mediação e fortalecimento de relações internas e externas.',
    items: [
      'Ambiente respeitoso e psicologicamente seguro',
      'Equipe colaborativa com foco em apoio mútuo',
      'Baixo nível de conflito e competição interna',
      'Relações interpessoais de confiança',
      'Reconhecimento genuíno pelas contribuições'
    ]
  };

  let howToWorkWith = [
    'Comunique-se com gentileza, mas seja claro sobre expectativas',
    'Crie um ambiente seguro para que expresse discordâncias',
    'Reconheça e valorize sua disposição para colaborar',
    'Evite cobranças agressivas ou confrontos desnecessários',
    'Ajude a desenvolver a habilidade de dizer "não" quando preciso'
  ];

  if (primary.key === 'E') {
    archetypeTitle = secondary.key === 'A' ? 'O Comunicador Envolvente' : secondary.key === 'O' ? 'O Explorador Sociável' : 'O Dinamizador de Equipes';
    archetypeSubtitle = 'Orientado a pessoas, energia contagiante, comunicação ativa e construção de redes de relacionamento.';
    deepDescription = 'Combina energia social e facilidade de expressão. Excelente em mobilizar pessoas, apresentar ideias e manter o ritmo de equipes e projetos.';
    leadershipStyle = 'Líder Energizador e Comunicativo';
    leadershipSummary = 'Lidera pelo entusiasmo, presença ativa e capacidade de manter a equipe engajada e motivada.';

    keyStrengths = [
      'Comunicação envolvente e facilidade de interação social',
      'Energia contagiante que mobiliza e engaja equipes',
      'Facilidade em construir redes de relacionamento',
      'Iniciativa para propor e liderar interações de grupo',
      'Boa capacidade de improviso em apresentações e negociações'
    ];

    attentionPoints = [
      'Pode ter dificuldade de concentração em tarefas solitárias e repetitivas',
      'Risco de falar mais do que ouvir em conversas importantes',
      'Pode se sentir desmotivado em ambientes isolados ou silenciosos',
      'Tendência a dispersar o foco entre múltiplas interações simultâneas'
    ];

    stressBehavior = 'Pode se tornar agitado, disperso ou buscar excesso de estímulo social para compensar o desconforto, perdendo foco nos detalhes.';

    motivators = [
      'Ambientes dinâmicos com interação constante',
      'Reconhecimento social e visibilidade das suas contribuições',
      'Projetos que envolvam pessoas, apresentações e negociação',
      'Liberdade para se expressar e conectar com colegas',
      'Ritmo acelerado com variedade de estímulos'
    ];

    stressors = [
      'Isolamento prolongado e trabalho solitário',
      'Rotinas monótonas sem interação humana',
      'Ambientes silenciosos e excessivamente formais',
      'Restrição à comunicação espontânea',
      'Falta de retorno ou reconhecimento imediato'
    ];

    commStyle = 'Expressivo, caloroso e direto. Gosta de conversar pessoalmente, usa entusiasmo para engajar e valoriza trocas dinâmicas.';
    workStyle = 'Ativo, sociável e multitarefa. Rende mais intercalando interações com colegas e momentos de execução prática.';
    idealEnv = {
      summary: 'Áreas comerciais, atendimento, relações públicas, eventos e gestão de equipes de alta interação.',
      items: [
        'Ambiente dinâmico e cheio de interação',
        'Contato frequente com pessoas e clientes',
        'Espaço para se expressar e propor ideias em grupo',
        'Cultura de celebração de conquistas em equipe',
        'Apoio para estruturar tarefas mais solitárias'
      ]
    };

    howToWorkWith = [
      'Inicie conversas com energia e demonstre interesse genuíno',
      'Permita espaço para que compartilhe ideias em voz alta',
      'Ajude a estruturar prazos e manter o foco em tarefas solitárias',
      'Reconheça publicamente suas contribuições e esforços',
      'Use reuniões e trocas verbais em vez de apenas comunicação escrita'
    ];
  } else if (primary.key === 'C') {
    archetypeTitle = secondary.key === 'N' ? 'O Executor Estável' : secondary.key === 'A' ? 'O Guardião Confiável' : 'O Planejador Meticuloso';
    archetypeSubtitle = 'Orientado a organização, disciplina, cumprimento de prazos e excelência na execução.';
    deepDescription = 'Combina planejamento cuidadoso com senso de responsabilidade. Garante que compromissos sejam cumpridos com consistência e qualidade.';
    leadershipStyle = 'Líder Estruturado e Confiável';
    leadershipSummary = 'Lidera pelo exemplo de disciplina, organização de processos e cumprimento rigoroso de prazos e padrões.';

    keyStrengths = [
      'Organização, planejamento e cumprimento de prazos com precisão',
      'Responsabilidade e confiabilidade nas entregas',
      'Atenção a detalhes e padrões de qualidade',
      'Persistência para concluir tarefas até o fim',
      'Capacidade de estruturar processos e rotinas eficientes'
    ];

    attentionPoints = [
      'Pode ser excessivamente rígido diante de mudanças de última hora',
      'Risco de perfeccionismo que atrasa entregas',
      'Dificuldade em delegar por receio de perda de qualidade',
      'Pode soar inflexível diante de abordagens menos estruturadas'
    ];

    stressBehavior = 'Tende a se tornar mais rígido e controlador, revisando exaustivamente detalhes e resistindo a atalhos ou mudanças de planejamento.';

    motivators = [
      'Metas e processos claramente definidos',
      'Tempo suficiente para planejar antes de executar',
      'Reconhecimento pela qualidade e consistência do trabalho',
      'Ambiente estruturado, previsível e organizado',
      'Regras e critérios de sucesso bem estabelecidos'
    ];

    stressors = [
      'Mudanças repentinas de planejamento sem justificativa',
      'Falta de padrões, retrabalho por desorganização alheia',
      'Prazos apertados que comprometem a qualidade',
      'Ambientes desorganizados ou imprevisíveis',
      'Pressão para entregar com qualidade abaixo do aceitável'
    ];

    commStyle = 'Claro, formal e bem estruturado. Prefere comunicação escrita, dados concretos e planejamento antecipado.';
    workStyle = 'Sistemático, focado e metódico. Prefere seguir checklists, cronogramas e processos bem definidos.';
    idealEnv = {
      summary: 'Gestão de projetos, operações, controle de qualidade, finanças e áreas que exigem rigor processual.',
      items: [
        'Ambiente organizado e propício à concentração',
        'Processos e padrões de qualidade bem definidos',
        'Prazos realistas com tempo para planejamento',
        'Critérios de avaliação transparentes e objetivos',
        'Ferramentas confiáveis de gestão e acompanhamento'
      ]
    };

    howToWorkWith = [
      'Dê prazos realistas e evite mudanças de escopo de última hora',
      'Apresente solicitações com clareza sobre critérios de sucesso',
      'Respeite sua necessidade de planejar antes de executar',
      'Reconheça a consistência e a confiabilidade do seu trabalho',
      'Envolva-o(a) no planejamento de processos e cronogramas'
    ];
  } else if (primary.key === 'N') {
    archetypeTitle = secondary.key === 'C' ? 'O Estabilizador Ponderado' : secondary.key === 'A' ? 'O Pacificador Sereno' : 'O Âncora Emocional';
    archetypeSubtitle = 'Orientado ao equilíbrio, calma sob pressão e constância emocional em cenários de incerteza.';
    deepDescription = 'Combina serenidade e resiliência emocional. Mantém a cabeça fria em momentos de crise, servindo de ponto de estabilidade para a equipe.';
    leadershipStyle = 'Líder Sereno e Constante';
    leadershipSummary = 'Lidera pelo exemplo de calma e constância, transmitindo segurança à equipe mesmo em cenários de pressão ou incerteza.';

    keyStrengths = [
      'Serenidade e controle emocional sob pressão',
      'Capacidade de tomar decisões racionais em crises',
      'Transmite segurança e estabilidade à equipe',
      'Recuperação rápida diante de contratempos',
      'Resiliência diante de críticas ou fracassos'
    ];

    attentionPoints = [
      'Pode parecer indiferente diante de urgências reais',
      'Risco de subestimar riscos por excesso de tranquilidade',
      'Pode demorar a demonstrar empolgação ou senso de urgência',
      'Dificuldade em reconhecer o estresse alheio por não vivenciá-lo da mesma forma'
    ];

    stressBehavior = 'Mesmo sob forte pressão, tende a manter a compostura; quando realmente afetado, tende a se retrair silenciosamente em vez de expressar a tensão.';

    motivators = [
      'Ambientes estáveis com baixa volatilidade',
      'Autonomia para conduzir situações no seu próprio ritmo',
      'Reconhecimento pela constância e confiabilidade emocional',
      'Clareza de expectativas sem pressão excessiva',
      'Espaço para agir como referência de calma na equipe'
    ];

    stressors = [
      'Ambientes de crise permanente e alta volatilidade',
      'Cobranças por reações emocionais mais intensas',
      'Excesso de mudanças simultâneas sem tempo de adaptação',
      'Falta de reconhecimento pela estabilidade que proporciona',
      'Pressão para tomar decisões precipitadas'
    ];

    commStyle = 'Calmo, ponderado e objetivo. Fala pausadamente, evita reações impulsivas e transmite segurança nas colocações.';
    workStyle = 'Constante e resiliente. Mantém o ritmo mesmo sob pressão, sem grandes oscilações de performance.';
    idealEnv = {
      summary: 'Gestão de crises, operações críticas, suporte técnico e funções que exigem estabilidade emocional constante.',
      items: [
        'Ambiente que valoriza calma e ponderação',
        'Espaço para agir como referência em momentos de tensão',
        'Reconhecimento pela constância, não apenas por reações visíveis',
        'Baixa cobrança por demonstrações emocionais',
        'Autonomia para conduzir situações no próprio ritmo'
      ]
    };

    howToWorkWith = [
      'Não confunda calma com desinteresse — verifique o nível de engajamento diretamente',
      'Dê tempo para que processe informações antes de reagir',
      'Reconheça explicitamente a estabilidade que traz à equipe',
      'Evite pressionar por reações emocionais intensas',
      'Aproveite sua serenidade em decisões críticas e de alta pressão'
    ];
  } else if (primary.key === 'O') {
    archetypeTitle = secondary.key === 'E' ? 'O Visionário Comunicativo' : secondary.key === 'C' ? 'O Inovador Estruturado' : 'O Pensador Criativo';
    archetypeSubtitle = 'Orientado a ideias, criatividade, curiosidade intelectual e novas formas de resolver problemas.';
    deepDescription = 'Combina curiosidade e imaginação para enxergar possibilidades onde outros veem rotina. Traz originalidade e pensamento não convencional.';
    leadershipStyle = 'Líder Visionário e Criativo';
    leadershipSummary = 'Lidera pela inspiração de novas ideias, estimulando a equipe a pensar fora da caixa e questionar o status quo.';

    keyStrengths = [
      'Criatividade e pensamento original na resolução de problemas',
      'Curiosidade intelectual e interesse por aprendizado contínuo',
      'Facilidade em enxergar conexões e possibilidades não óbvias',
      'Abertura genuína a novas ideias e perspectivas diferentes',
      'Capacidade de propor inovações e soluções não convencionais'
    ];

    attentionPoints = [
      'Pode ter dificuldade em finalizar ideias por buscar sempre algo novo',
      'Risco de se dispersar entre múltiplos interesses simultâneos',
      'Pode subestimar processos práticos em favor de conceitos abstratos',
      'Dificuldade em se ajustar a ambientes rígidos e pouco flexíveis'
    ];

    stressBehavior = 'Pode se tornar disperso, mudando de ideia com frequência, ou se frustrar diante de ambientes que bloqueiam sua criatividade.';

    motivators = [
      'Liberdade para explorar ideias e propor inovações',
      'Projetos desafiadores que estimulem o pensamento criativo',
      'Ambientes intelectualmente estimulantes e diversos',
      'Aprendizado contínuo e exposição a novas áreas de conhecimento',
      'Reconhecimento pela originalidade das contribuições'
    ];

    stressors = [
      'Rotinas repetitivas sem espaço para criatividade',
      'Regras rígidas que bloqueiam ideias novas',
      'Ambientes intelectualmente pouco estimulantes',
      'Falta de abertura da liderança para experimentação',
      'Pressão para seguir processos sem entender o propósito'
    ];

    commStyle = 'Conceitual, expressivo e cheio de referências. Gosta de explorar ideias em profundidade e discutir possibilidades.';
    workStyle = 'Flexível e exploratório. Rende mais quando pode alternar entre ideação e execução, com liberdade criativa.';
    idealEnv = {
      summary: 'Inovação, design, pesquisa, desenvolvimento de produto e áreas que exigem pensamento criativo constante.',
      items: [
        'Ambiente que estimula experimentação e novas ideias',
        'Liberdade para propor abordagens não convencionais',
        'Exposição a diferentes áreas de conhecimento',
        'Cultura tolerante a erros no processo de inovação',
        'Apoio para transformar ideias em execução prática'
      ]
    };

    howToWorkWith = [
      'Dê espaço para explorar e apresentar novas ideias',
      'Ajude a estruturar prazos para transformar ideias em entregas concretas',
      'Evite microgerenciamento ou regras excessivamente rígidas',
      'Valorize contribuições originais mesmo quando fogem do convencional',
      'Ofereça contexto e propósito, não apenas instruções passo a passo'
    ];
  }

  // Individual Development Plan (PDI)
  const pdi = {
    leverageStrengths: [
      {
        title: primary.key === 'E' ? 'Comunicação e Mobilização de Equipes'
          : primary.key === 'C' ? 'Organização e Excelência de Processos'
          : primary.key === 'N' ? 'Estabilidade e Gestão de Crises'
          : primary.key === 'O' ? 'Inovação e Pensamento Criativo'
          : 'Colaboração e Construção de Relações',
        description: primary.key === 'E'
          ? 'Sua energia e facilidade de comunicação fazem de você um mobilizador natural de pessoas e ideias.'
          : primary.key === 'C'
          ? 'Sua disciplina e organização são fundamentais para estruturar processos confiáveis e sustentáveis.'
          : primary.key === 'N'
          ? 'Sua serenidade sob pressão é um diferencial valioso em momentos críticos e decisões de alto impacto.'
          : primary.key === 'O'
          ? 'Sua criatividade e curiosidade impulsionam a inovação e a busca por soluções não convencionais.'
          : 'Sua capacidade de cooperar e construir confiança fortalece a coesão e o clima das equipes.',
        actions: primary.key === 'E'
          ? ['Apresentações institucionais', 'Engajamento de stakeholders', 'Dinamização de equipes e eventos']
          : primary.key === 'C'
          ? ['Estruturação de processos e checklists', 'Gestão de cronogramas críticos', 'Auditoria e controle de qualidade']
          : primary.key === 'N'
          ? ['Condução de situações de crise', 'Suporte a decisões sob pressão', 'Mentoria em momentos de instabilidade']
          : primary.key === 'O'
          ? ['Projetos de inovação e ideação', 'Pesquisa e exploração de novas soluções', 'Brainstorms estratégicos']
          : ['Mediação de conflitos', 'Programas de integração de equipe', 'Construção de parcerias internas']
      },
      {
        title: 'Gestão de Relacionamentos e Sustentabilidade',
        description: 'Sua consistência comportamental é valiosa para a retenção de talentos e a estabilidade das relações profissionais.',
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
          'Expresse suas visões ativamente em reuniões estratégicas',
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
    summaryText: `Seu traço mais elevado é ${primary.name}, com tendência secundária para ${secondary.name}`,
    primaryTrait: primary.name,
    secondaryTrait: secondary.name,
    overviewSummary: archetypeSubtitle,
    keyStrengthsList: keyStrengths,

    intensities: {
      e: { level: eLevel, badgeColor: getBadgeColor(eLevel), description: eDescMap[eLevel] },
      a: { level: aLevel, badgeColor: getBadgeColor(aLevel), description: aDescMap[aLevel] },
      c: { level: cLevel, badgeColor: getBadgeColor(cLevel), description: cDescMap[cLevel] },
      n: { level: nLevel, badgeColor: getBadgeColor(nLevel), description: nDescMap[nLevel] },
      o: { level: oLevel, badgeColor: getBadgeColor(oLevel), description: oDescMap[oLevel] },
    },

    deepAnalysis: {
      description: deepDescription,
      highlights: [
        primary.key === 'E' ? 'Energia social e comunicação ativa' : primary.key === 'C' ? 'Organização e disciplina' : primary.key === 'N' ? 'Serenidade e controle emocional' : primary.key === 'O' ? 'Criatividade e curiosidade intelectual' : 'Cooperação e construção de confiança',
        secondary.key === 'E' ? 'Facilidade de comunicação' : secondary.key === 'C' ? 'Atenção a processos e prazos' : secondary.key === 'N' ? 'Constância sob pressão' : secondary.key === 'O' ? 'Abertura a novas ideias' : 'Construção de relações de confiança',
        'Consistência comportamental ao longo do tempo',
        'Contribuição diferenciada para a dinâmica da equipe'
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
        'Consistente no comportamento e nas decisões',
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
