import { BigFiveQuestion, FitCulturalQuestion, FitCulturalValue, LogicQuestion } from '../types';

// 5-point Likert scale reused for every BIG 5 (BFI-2) statement.
// The option id IS the raw response value (1-5), which the scoring
// logic in apiService.ts reads directly (applying reverse-keying per item).
export const LIKERT_OPTIONS = [
  { id: '1', label: 'A', text: 'Discordo totalmente' },
  { id: '2', label: 'B', text: 'Discordo um pouco' },
  { id: '3', label: 'C', text: 'Neutro' },
  { id: '4', label: 'D', text: 'Concordo um pouco' },
  { id: '5', label: 'E', text: 'Concordo totalmente' },
];

// BFI-2 — Inventário dos Cinco Grandes Fatores (60 itens, Soto & John, 2017)
// Cada item completa a frase "Eu me vejo como alguém que…". Domínio/faceta/
// sentido (reverse) seguem exatamente a chave oficial de correção do BFI-2.
export const BIG_FIVE_QUESTIONS: BigFiveQuestion[] = [
  { id: 1, prompt: 'É extrovertido/a, sociável.', domain: 'E', facet: 'Sociabilidade', reverse: false },
  { id: 2, prompt: 'É compassivo/a, tem um coração mole.', domain: 'A', facet: 'Compaixão', reverse: false },
  { id: 3, prompt: 'Tende a ser desorganizado/a.', domain: 'C', facet: 'Organização', reverse: true },
  { id: 4, prompt: 'É relaxado/a, lida bem com o estresse.', domain: 'N', facet: 'Ansiedade', reverse: true },
  { id: 5, prompt: 'Tem pouco interesse em arte.', domain: 'O', facet: 'Sensibilidade Estética', reverse: true },
  { id: 6, prompt: 'Tem uma personalidade assertiva.', domain: 'E', facet: 'Assertividade', reverse: false },
  { id: 7, prompt: 'É respeitoso/a, trata os outros com consideração.', domain: 'A', facet: 'Respeito', reverse: false },
  { id: 8, prompt: 'Tende a ser preguiçoso/a.', domain: 'C', facet: 'Produtividade', reverse: true },
  { id: 9, prompt: 'Mantém-se otimista após passar por contratempos.', domain: 'N', facet: 'Depressão', reverse: true },
  { id: 10, prompt: 'É curioso/a sobre muitas coisas diferentes.', domain: 'O', facet: 'Curiosidade Intelectual', reverse: false },
  { id: 11, prompt: 'Raramente se sente animado/a ou empolgado/a.', domain: 'E', facet: 'Nível de Energia', reverse: true },
  { id: 12, prompt: 'Tende a encontrar defeitos nos outros.', domain: 'A', facet: 'Confiança', reverse: true },
  { id: 13, prompt: 'É um trabalhador confiável.', domain: 'C', facet: 'Responsabilidade', reverse: false },
  { id: 14, prompt: 'É temperamental, muda de humor facilmente.', domain: 'N', facet: 'Volatilidade Emocional', reverse: false },
  { id: 15, prompt: 'É inventivo/a, encontra soluções originais.', domain: 'O', facet: 'Imaginação Criativa', reverse: false },
  { id: 16, prompt: 'Tende a ser quieto/a.', domain: 'E', facet: 'Sociabilidade', reverse: true },
  { id: 17, prompt: 'Sente pouca simpatia pelos outros.', domain: 'A', facet: 'Compaixão', reverse: true },
  { id: 18, prompt: 'É sistemático/a, gosta de manter as coisas em ordem.', domain: 'C', facet: 'Organização', reverse: false },
  { id: 19, prompt: 'Pode ficar tenso/a.', domain: 'N', facet: 'Ansiedade', reverse: false },
  { id: 20, prompt: 'É fascinado/a por arte, música ou literatura.', domain: 'O', facet: 'Sensibilidade Estética', reverse: false },
  { id: 21, prompt: 'Tende a assumir o comando e liderar situações.', domain: 'E', facet: 'Assertividade', reverse: false },
  { id: 22, prompt: 'Inicia discussões e brigas com os outros.', domain: 'A', facet: 'Respeito', reverse: true },
  { id: 23, prompt: 'Tem dificuldade para começar a trabalhar em tarefas.', domain: 'C', facet: 'Produtividade', reverse: true },
  { id: 24, prompt: 'Sente-se seguro/a, confortável consigo mesmo/a.', domain: 'N', facet: 'Depressão', reverse: true },
  { id: 25, prompt: 'Evita discussões teóricas ou abstratas.', domain: 'O', facet: 'Curiosidade Intelectual', reverse: true },
  { id: 26, prompt: 'É menos ativo/a do que as outras pessoas.', domain: 'E', facet: 'Nível de Energia', reverse: true },
  { id: 27, prompt: 'Tem uma natureza perdoadora, não guarda rancor.', domain: 'A', facet: 'Confiança', reverse: false },
  { id: 28, prompt: 'Pode ser um pouco descuidado/a.', domain: 'C', facet: 'Responsabilidade', reverse: true },
  { id: 29, prompt: 'É emocionalmente estável, não se irrita facilmente.', domain: 'N', facet: 'Volatilidade Emocional', reverse: true },
  { id: 30, prompt: 'Tem pouca imaginação criativa.', domain: 'O', facet: 'Imaginação Criativa', reverse: true },
  { id: 31, prompt: 'É às vezes tímido/a, inibido/a.', domain: 'E', facet: 'Sociabilidade', reverse: true },
  { id: 32, prompt: 'É prestativo/a e generoso/a com os outros.', domain: 'A', facet: 'Compaixão', reverse: false },
  { id: 33, prompt: 'É sistemático/a, mantém as coisas arrumadas e organizadas.', domain: 'C', facet: 'Organização', reverse: false },
  { id: 34, prompt: 'Preocupa-se muito.', domain: 'N', facet: 'Ansiedade', reverse: false },
  { id: 35, prompt: 'Valoriza a arte e a beleza.', domain: 'O', facet: 'Sensibilidade Estética', reverse: false },
  { id: 36, prompt: 'Acha difícil influenciar as pessoas.', domain: 'E', facet: 'Assertividade', reverse: true },
  { id: 37, prompt: 'É às vezes frio/a e distante.', domain: 'A', facet: 'Respeito', reverse: true },
  { id: 38, prompt: 'É eficiente, faz as coisas acontecerem.', domain: 'C', facet: 'Produtividade', reverse: false },
  { id: 39, prompt: 'Sente-se triste com frequência.', domain: 'N', facet: 'Depressão', reverse: false },
  { id: 40, prompt: 'Gosta de refletir e brincar com ideias complexas.', domain: 'O', facet: 'Curiosidade Intelectual', reverse: false },
  { id: 41, prompt: 'É cheio/a de energia.', domain: 'E', facet: 'Nível de Energia', reverse: false },
  { id: 42, prompt: 'Desconfia das intenções dos outros.', domain: 'A', facet: 'Confiança', reverse: true },
  { id: 43, prompt: 'É alguém com quem se pode contar sempre.', domain: 'C', facet: 'Responsabilidade', reverse: false },
  { id: 44, prompt: 'Mantém as emoções sob controle.', domain: 'N', facet: 'Volatilidade Emocional', reverse: true },
  { id: 45, prompt: 'Tem pouca capacidade para criar ideias inovadoras.', domain: 'O', facet: 'Imaginação Criativa', reverse: true },
  { id: 46, prompt: 'É comunicativo/a, fala bastante.', domain: 'E', facet: 'Sociabilidade', reverse: false },
  { id: 47, prompt: 'Pode ser um pouco rude ou insensível com os outros.', domain: 'A', facet: 'Compaixão', reverse: true },
  { id: 48, prompt: 'Tem dificuldade em manter as coisas organizadas.', domain: 'C', facet: 'Organização', reverse: true },
  { id: 49, prompt: 'Raramente sente medo ou ansiedade.', domain: 'N', facet: 'Ansiedade', reverse: true },
  { id: 50, prompt: 'Acha que poesia e peças de teatro são entediantes.', domain: 'O', facet: 'Sensibilidade Estética', reverse: true },
  { id: 51, prompt: 'Prefere deixar que os outros tomem as decisões.', domain: 'E', facet: 'Assertividade', reverse: true },
  { id: 52, prompt: 'É educado/a, demonstra boas maneiras.', domain: 'A', facet: 'Respeito', reverse: false },
  { id: 53, prompt: 'É persistente, trabalha até terminar a tarefa.', domain: 'C', facet: 'Produtividade', reverse: false },
  { id: 54, prompt: 'Sente-se desanimado/a, para baixo com frequência.', domain: 'N', facet: 'Depressão', reverse: false },
  { id: 55, prompt: 'Tem pouco interesse em ideias abstratas.', domain: 'O', facet: 'Curiosidade Intelectual', reverse: true },
  { id: 56, prompt: 'Mostra muito entusiasmo.', domain: 'E', facet: 'Nível de Energia', reverse: false },
  { id: 57, prompt: 'Tende a acreditar no melhor das pessoas.', domain: 'A', facet: 'Confiança', reverse: false },
  { id: 58, prompt: 'Às vezes age de forma irresponsável.', domain: 'C', facet: 'Responsabilidade', reverse: true },
  { id: 59, prompt: 'É temperamental, irrita-se com facilidade.', domain: 'N', facet: 'Volatilidade Emocional', reverse: false },
  { id: 60, prompt: 'É original, tem ideias novas.', domain: 'O', facet: 'Imaginação Criativa', reverse: false },
];


// The 9 core cultural values, displayed in this order across the app.
export const FIT_CULTURAL_VALUES: { value: FitCulturalValue; emoji: string }[] = [
  { value: 'Energia', emoji: '⚡' },
  { value: 'Execução/NORTE', emoji: '🚀' },
  { value: 'Integridade', emoji: '🛡️' },
  { value: 'Ambição', emoji: '🎯' },
  { value: 'Autenticidade', emoji: '🗣️' },
  { value: 'Dados e Tecnologia', emoji: '📊' },
  { value: 'Disciplina', emoji: '📅' },
  { value: 'Compromisso', emoji: '🤝' },
  { value: 'Prática Pedagógica', emoji: '🧠' },
];

export const FIT_CULTURAL_QUESTIONS: FitCulturalQuestion[] = [
  // 1. ENERGIA
  {
    id: 1,
    value: 'Energia',
    prompt: 'Você recebe uma demanda importante no final do dia, quando já está cansado e possui outras tarefas pendentes. Como você reage?',
    options: [
      { id: 'fc-1-a', label: 'A', text: 'Faço o possível para entregar, mas provavelmente deixaria para o dia seguinte se não fosse urgente.', weight: 50 },
      { id: 'fc-1-b', label: 'B', text: 'Organizo minhas prioridades e busco energia para concluir o que é mais importante.', weight: 100 },
      { id: 'fc-1-c', label: 'C', text: 'Peço para outra pessoa assumir, pois já estou sobrecarregado.', weight: 25 },
      { id: 'fc-1-d', label: 'D', text: 'Começo a tarefa, mas paro caso perceba que ela vai exigir mais esforço do que esperava.', weight: 50 },
    ]
  },
  {
    id: 2,
    value: 'Energia',
    prompt: 'Sua equipe está passando por uma semana especialmente intensa, com muitas demandas e pressão por resultados. Qual comportamento mais se aproxima do seu?',
    options: [
      { id: 'fc-2-a', label: 'A', text: 'Mantenho meu ritmo, priorizo o que precisa ser feito e tento contribuir para manter o time motivado.', weight: 100 },
      { id: 'fc-2-b', label: 'B', text: 'Faço apenas aquilo que está diretamente sob minha responsabilidade.', weight: 50 },
      { id: 'fc-2-c', label: 'C', text: 'Espero que a liderança reorganize as demandas antes de tomar qualquer iniciativa.', weight: 25 },
      { id: 'fc-2-d', label: 'D', text: 'Continuo trabalhando, mas evito assumir qualquer demanda adicional.', weight: 50 },
    ]
  },
  // 2. EXECUÇÃO / NORTE
  {
    id: 3,
    value: 'Execução/NORTE',
    prompt: 'Você recebe um objetivo claro, mas não existe um passo a passo definido para chegar ao resultado. O que faz?',
    options: [
      { id: 'fc-3-a', label: 'A', text: 'Espero receber instruções mais detalhadas antes de começar.', weight: 25 },
      { id: 'fc-3-b', label: 'B', text: 'Começo a executar, testo possibilidades e ajusto o caminho conforme obtenho aprendizados.', weight: 100 },
      { id: 'fc-3-c', label: 'C', text: 'Procuro alguém que já tenha feito algo parecido e sigo exatamente o que essa pessoa fez.', weight: 50 },
      { id: 'fc-3-d', label: 'D', text: 'Faço um planejamento bastante detalhado antes de iniciar, mesmo que isso atrase a execução.', weight: 75 },
    ]
  },
  {
    id: 4,
    value: 'Execução/NORTE',
    prompt: 'Você percebe que uma estratégia definida pela equipe não está gerando o resultado esperado. O que você faria?',
    options: [
      { id: 'fc-4-a', label: 'A', text: 'Continuaria executando até receber uma nova orientação.', weight: 25 },
      { id: 'fc-4-b', label: 'B', text: 'Apresentaria o problema, buscaria entender a causa e proporia ajustes para chegar ao objetivo.', weight: 100 },
      { id: 'fc-4-c', label: 'C', text: 'Mudaria a estratégia por conta própria e comunicaria depois.', weight: 50 },
      { id: 'fc-4-d', label: 'D', text: 'Pararia a execução até que alguém definisse um novo caminho.', weight: 25 },
    ]
  },
  // 3. INTEGRIDADE
  {
    id: 5,
    value: 'Integridade',
    prompt: 'Você percebe que cometeu um erro que passou despercebido. Se ninguém descobrir, provavelmente não haverá consequências imediatas. O que faz?',
    options: [
      { id: 'fc-5-a', label: 'A', text: 'Corrijo o erro e comunico quem precisa saber.', weight: 100 },
      { id: 'fc-5-b', label: 'B', text: 'Corrijo discretamente para evitar preocupações desnecessárias.', weight: 75 },
      { id: 'fc-5-c', label: 'C', text: 'Espero para ver se alguém percebe antes de decidir o que fazer.', weight: 25 },
      { id: 'fc-5-d', label: 'D', text: 'Se o impacto for pequeno, considero que não vale a pena interromper o trabalho para tratar disso.', weight: 0 },
    ]
  },
  {
    id: 6,
    value: 'Integridade',
    prompt: 'Um colega pede sua ajuda para apresentar um resultado e sugere omitir uma informação que poderia gerar questionamentos da liderança. Como você reage?',
    options: [
      { id: 'fc-6-a', label: 'A', text: 'Concordo, desde que a informação não seja essencial para o resultado.', weight: 25 },
      { id: 'fc-6-b', label: 'B', text: 'Explico que prefiro apresentar os dados completos, mesmo que isso gere perguntas ou desconforto.', weight: 100 },
      { id: 'fc-6-c', label: 'C', text: 'Deixo que o colega decida, já que o resultado é responsabilidade dele.', weight: 50 },
      { id: 'fc-6-d', label: 'D', text: 'Apresento a informação, mas tento minimizar sua importância.', weight: 50 },
    ]
  },
  // 4. AMBIÇÃO
  {
    id: 7,
    value: 'Ambição',
    prompt: 'Você alcança uma meta antes do prazo e recebe um feedback positivo. Qual seria sua reação?',
    options: [
      { id: 'fc-7-a', label: 'A', text: 'Fico satisfeito e mantenho o mesmo ritmo para continuar entregando bem.', weight: 75 },
      { id: 'fc-7-b', label: 'B', text: 'Procuro entender como posso transformar o resultado em um patamar ainda maior.', weight: 100 },
      { id: 'fc-7-c', label: 'C', text: 'Aproveito o momento para diminuir o ritmo e compensar o esforço anterior.', weight: 25 },
      { id: 'fc-7-d', label: 'D', text: 'Espero que meu gestor defina qual deve ser meu próximo desafio.', weight: 50 },
    ]
  },
  {
    id: 8,
    value: 'Ambição',
    prompt: 'Você percebe que existe uma oportunidade de assumir uma responsabilidade maior, mas isso exigiria aprender algo novo e sair da sua zona de conforto.',
    options: [
      { id: 'fc-8-a', label: 'A', text: 'Evito assumir porque ainda não tenho domínio suficiente.', weight: 25 },
      { id: 'fc-8-b', label: 'B', text: 'Aceito o desafio, desde que tenha certeza de que conseguirei executá-lo perfeitamente.', weight: 50 },
      { id: 'fc-8-c', label: 'C', text: 'Demonstro interesse, busco aprender o necessário e me preparo para assumir a responsabilidade.', weight: 100 },
      { id: 'fc-8-d', label: 'D', text: 'Prefiro continuar nas atividades em que já tenho experiência.', weight: 25 },
    ]
  },
  // 5. AUTENTICIDADE
  {
    id: 9,
    value: 'Autenticidade',
    prompt: 'Durante uma reunião, a maioria das pessoas concorda com uma decisão que você acredita estar equivocada. O que você faz?',
    options: [
      { id: 'fc-9-a', label: 'A', text: 'Concordo com o grupo para evitar conflitos.', weight: 25 },
      { id: 'fc-9-b', label: 'B', text: 'Apresento minha visão de forma respeitosa, explicando os motivos e evidências que sustentam minha posição.', weight: 100 },
      { id: 'fc-9-c', label: 'C', text: 'Falo sobre minha discordância apenas depois da reunião, individualmente.', weight: 50 },
      { id: 'fc-9-d', label: 'D', text: 'Se a decisão já parece estar tomada, prefiro não me posicionar.', weight: 25 },
    ]
  },
  {
    id: 10,
    value: 'Autenticidade',
    prompt: 'Você recebe um feedback com o qual inicialmente não concorda. Como tende a reagir?',
    options: [
      { id: 'fc-10-a', label: 'A', text: 'Defendo imediatamente meu ponto de vista para explicar por que a pessoa está equivocada.', weight: 25 },
      { id: 'fc-10-b', label: 'B', text: 'Escuto, procuro entender os exemplos apresentados e reflito sobre o que posso aprender.', weight: 100 },
      { id: 'fc-10-c', label: 'C', text: 'Aceito o feedback, mas não costumo mudar meu comportamento se não concordar totalmente.', weight: 50 },
      { id: 'fc-10-d', label: 'D', text: 'Prefiro conversar posteriormente, quando estiver mais confortável com a situação.', weight: 75 },
    ]
  },
  // 6. DADOS E TECNOLOGIA
  {
    id: 11,
    value: 'Dados e Tecnologia',
    prompt: 'Você precisa escolher entre duas estratégias. Sua experiência pessoal favorece uma delas, mas os dados disponíveis apontam para a outra. O que faz?',
    options: [
      { id: 'fc-11-a', label: 'A', text: 'Sigo minha experiência, pois dados nem sempre conseguem mostrar o contexto completo.', weight: 50 },
      { id: 'fc-11-b', label: 'B', text: 'Analiso os dados, procuro entender a divergência e tomo uma decisão fundamentada.', weight: 100 },
      { id: 'fc-11-c', label: 'C', text: 'Escolho automaticamente a alternativa indicada pelos dados, sem questioná-los.', weight: 75 },
      { id: 'fc-11-d', label: 'D', text: 'Adio a decisão até ter certeza absoluta sobre qual alternativa é melhor.', weight: 25 },
    ]
  },
  {
    id: 12,
    value: 'Dados e Tecnologia',
    prompt: 'Você percebe que uma atividade que realiza frequentemente poderia ser automatizada com uma nova ferramenta. O que faz?',
    options: [
      { id: 'fc-12-a', label: 'A', text: 'Continuo fazendo da mesma maneira porque já funciona.', weight: 25 },
      { id: 'fc-12-b', label: 'B', text: 'Pesquiso a ferramenta, avalio se realmente pode melhorar o processo e, se fizer sentido, testo sua aplicação.', weight: 100 },
      { id: 'fc-12-c', label: 'C', text: 'Começo a usar a ferramenta imediatamente, sem avaliar possíveis impactos.', weight: 50 },
      { id: 'fc-12-d', label: 'D', text: 'Espero que a empresa implemente oficialmente uma solução antes de buscar alternativas.', weight: 50 },
    ]
  },
  // 7. DISCIPLINA
  {
    id: 13,
    value: 'Disciplina',
    prompt: 'Você possui uma atividade recorrente que não é acompanhada diretamente por ninguém. Como tende a agir?',
    options: [
      { id: 'fc-13-a', label: 'A', text: 'Mantenho a rotina porque entendo que a responsabilidade continua sendo minha.', weight: 100 },
      { id: 'fc-13-b', label: 'B', text: 'Dou mais atenção quando percebo que haverá acompanhamento ou cobrança.', weight: 50 },
      { id: 'fc-13-c', label: 'C', text: 'Priorizo outras tarefas e retomo essa atividade quando houver necessidade.', weight: 25 },
      { id: 'fc-13-d', label: 'D', text: 'Tento encontrar uma maneira de tornar a atividade mais eficiente e estabelecer uma rotina para garantir sua execução.', weight: 100 },
    ]
  },
  {
    id: 14,
    value: 'Disciplina',
    prompt: 'Você está trabalhando em um projeto de longo prazo e os resultados ainda não apareceram. Como costuma lidar com isso?',
    options: [
      { id: 'fc-14-a', label: 'A', text: 'Mantenho a consistência, acompanho os indicadores e faço os ajustes necessários ao longo do caminho.', weight: 100 },
      { id: 'fc-14-b', label: 'B', text: 'Aumento o esforço apenas quando percebo que o prazo está se aproximando.', weight: 50 },
      { id: 'fc-14-c', label: 'C', text: 'Se não houver resultado rápido, começo a questionar se vale a pena continuar.', weight: 25 },
      { id: 'fc-14-d', label: 'D', text: 'Continuo executando, mas sem acompanhar muito de perto os indicadores.', weight: 50 },
    ]
  },
  // 8. COMPROMISSO
  {
    id: 15,
    value: 'Compromisso',
    prompt: 'Você assumiu uma entrega para uma determinada data, mas percebe que não conseguirá cumprir o prazo originalmente combinado. O que faz?',
    options: [
      { id: 'fc-15-a', label: 'A', text: 'Tento resolver sozinho até o último momento e aviso apenas se realmente não conseguir.', weight: 50 },
      { id: 'fc-15-b', label: 'B', text: 'Comunico o quanto antes, explico o cenário e proponho uma nova solução ou prazo.', weight: 100 },
      { id: 'fc-15-c', label: 'C', text: 'Entrego uma versão incompleta dentro do prazo para não deixar de cumprir o combinado.', weight: 50 },
      { id: 'fc-15-d', label: 'D', text: 'Priorizo outras demandas mais urgentes e aviso depois que o prazo passou.', weight: 25 },
    ]
  },
  {
    id: 16,
    value: 'Compromisso',
    prompt: 'Um colega depende de uma informação sua para concluir uma tarefa, mas você está com outras prioridades. Como você age?',
    options: [
      { id: 'fc-16-a', label: 'A', text: 'Deixo para responder quando terminar minhas próprias tarefas.', weight: 25 },
      { id: 'fc-16-b', label: 'B', text: 'Avalio a urgência, retorno ao colega dentro de um prazo combinado e, se necessário, alinho prioridades com a liderança.', weight: 100 },
      { id: 'fc-16-c', label: 'C', text: 'Respondo rapidamente, mesmo que a informação ainda não esteja correta ou completa.', weight: 50 },
      { id: 'fc-16-d', label: 'D', text: 'Aviso que estou ocupado e deixo que o colega encontre outra forma de resolver.', weight: 25 },
    ]
  },
  // 9. PRÁTICA PEDAGÓGICA
  {
    id: 17,
    value: 'Prática Pedagógica',
    prompt: 'Você domina uma atividade que um novo colega está tendo dificuldade para aprender. Como você tende a ajudá-lo?',
    options: [
      { id: 'fc-17-a', label: 'A', text: 'Explico rapidamente e deixo que ele pratique sozinho.', weight: 75 },
      { id: 'fc-17-b', label: 'B', text: 'Faço a atividade por ele para garantir que seja entregue corretamente.', weight: 25 },
      { id: 'fc-17-c', label: 'C', text: 'Faço a atividade junto com ele, explico o raciocínio, observo sua execução e dou feedback para que consiga repetir sozinho.', weight: 100 },
      { id: 'fc-17-d', label: 'D', text: 'Indico materiais para estudo e espero que ele procure ajuda caso continue com dificuldade.', weight: 50 },
    ]
  },
  {
    id: 18,
    value: 'Prática Pedagógica',
    prompt: 'Você percebe que um colega comete repetidamente o mesmo erro. Qual seria sua abordagem?',
    options: [
      { id: 'fc-18-a', label: 'A', text: 'Corrijo o erro sempre que ele acontecer para garantir a qualidade da entrega.', weight: 50 },
      { id: 'fc-18-b', label: 'B', text: 'Converso com a pessoa, tento entender onde está a dificuldade e busco uma forma de ajudá-la a desenvolver autonomia.', weight: 100 },
      { id: 'fc-18-c', label: 'C', text: 'Informo a liderança para que ela decida como conduzir a situação.', weight: 50 },
      { id: 'fc-18-d', label: 'D', text: 'Evito interferir, pois cada pessoa deve aprender com os próprios erros.', weight: 25 },
    ]
  },
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

