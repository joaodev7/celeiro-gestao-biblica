import { IncomeItem, ExpenseItem, DebtItem, BarnStage, DevotionalItem } from '../types';

export const INITIAL_INCOMES: IncomeItem[] = [
  {
    id: 'inc-1',
    description: 'Salário Principal (Colheita Mensal)',
    plannedAmount: 6000,
    actualAmount: 6000,
    date: '2026-10-05',
    category: 'Trabalho / Salário',
    notes: 'Rendimento principal da atividade profissional',
  },
];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  // Primícias & Generosidade (R$ 700)
  {
    id: 'exp-1',
    description: 'Dízimo das Primícias (10%)',
    plannedAmount: 600,
    actualAmount: 600,
    category: 'primitias',
    date: '2026-10-06',
    notes: 'Honra e consagração inicial a Deus',
  },
  {
    id: 'exp-2',
    description: 'Oferta de Amor & Ajuda a Necessitados',
    plannedAmount: 100,
    actualAmount: 100,
    category: 'primitias',
    date: '2026-10-10',
    notes: 'Ação social na comunidade local',
  },

  // Custos Essenciais (A Tenda) - R$ 3.200
  {
    id: 'exp-3',
    description: 'Aluguel / Manutenção da Moradia',
    plannedAmount: 1600,
    actualAmount: 1600,
    category: 'essencial',
    date: '2026-10-10',
    notes: 'Habitação segura para a família',
  },
  {
    id: 'exp-4',
    description: 'Supermercado & Alimentos Básicos',
    plannedAmount: 1100,
    actualAmount: 1100,
    category: 'essencial',
    date: '2026-10-12',
    notes: 'Pão cotidiano e nutrição familiar',
  },
  {
    id: 'exp-5',
    description: 'Contas de Água e Energia Elétrica',
    plannedAmount: 350,
    actualAmount: 350,
    category: 'essencial',
    date: '2026-10-15',
    notes: 'Manutenção dos recursos do lar',
  },
  {
    id: 'exp-6',
    description: 'Transporte e Combustível Essencial',
    plannedAmount: 150,
    actualAmount: 150,
    category: 'essencial',
    date: '2026-10-18',
    notes: 'Deslocamento indispensável para o trabalho',
  },

  // Gastos Pessoais & Estilo de Vida - R$ 900
  {
    id: 'exp-7',
    description: 'Restaurante & Confraternização Familiar',
    plannedAmount: 450,
    actualAmount: 450,
    category: 'estilo',
    date: '2026-10-16',
    notes: 'Momentos de comunhão com a família',
  },
  {
    id: 'exp-8',
    description: 'Lazer & Passeios Culturais',
    plannedAmount: 300,
    actualAmount: 300,
    category: 'estilo',
    date: '2026-10-20',
    notes: 'Descanso e refrigério',
  },
  {
    id: 'exp-9',
    description: 'Assinaturas de Streaming e Conectividade',
    plannedAmount: 150,
    actualAmount: 150,
    category: 'estilo',
    date: '2026-10-08',
    notes: 'Serviços de entretenimento digital',
  },

  // Aportes de Celeiro / Poupança - R$ 500
  {
    id: 'exp-10',
    description: 'Aporte Mensal no Silo de José',
    plannedAmount: 500,
    actualAmount: 500,
    category: 'celeiro',
    date: '2026-10-07',
    notes: 'Armazenamento estratégico nos tempos de fartura',
  },
];

export const INITIAL_DEBTS: DebtItem[] = [
  {
    id: 'debt-1',
    creditor: 'Cartão de Crédito Rotativo',
    balance: 1800,
    interestRate: 12.5,
    monthlyPayment: 250,
    initialBalance: 2400,
    dueDateDay: 10,
    notes: '1º Alvo de Ataque: liquidar prioritariamente para estancar juros',
  },
  {
    id: 'debt-2',
    creditor: 'Empréstimo Pessoal Bancário',
    balance: 8500,
    interestRate: 3.2,
    monthlyPayment: 450,
    initialBalance: 12000,
    dueDateDay: 20,
    notes: '2º Alvo: receberá a parcela do cartão assim que ele for extinto',
  },
];

export const INITIAL_BARN_SAVINGS = 6400; // R$ 6.400 = exatamente 2 meses de despesas essenciais (3.200 x 2)

export const BARN_STAGES: BarnStage[] = [
  {
    id: 1,
    name: 'Silo 1: Primeiro Alívio',
    monthsRequired: 1,
    title: '1 Mês de Sobrevivência',
    subtitle: 'Primeiro Alívio contra o Imprevisto',
    description: 'Garante que uma emergência médica ou mecânica súbita não force você a tomar dinheiro emprestado.',
    iconName: 'Shield',
  },
  {
    id: 2,
    name: 'Silo 2: Paz Imediata',
    monthsRequired: 3,
    title: '3 Meses de Cobertura',
    subtitle: 'Paz Imediata da Família',
    description: 'Permite respirar com calma caso haja queda temporária de rendimentos ou necessidade de reparos no lar.',
    iconName: 'Wheat',
  },
  {
    id: 3,
    name: 'Silo 3: Segurança das Tempestades',
    monthsRequired: 6,
    title: '6 Meses de Cobertura',
    subtitle: 'Segurança contra Tempestades Severas',
    description: 'A recomendação prudente clássica: suporta períodos prolongados de transição profissional sem angústia.',
    iconName: 'Anchor',
  },
  {
    id: 4,
    name: 'Silo 4: O Celeiro Completo',
    monthsRequired: 12,
    title: '12 Meses (1 Ano de Reserva)',
    subtitle: 'Muralha de Proteção Familiar',
    description: 'Uma fortaleza espiritual e financeira sólida: proteção total de 1 ano completo sem depender de bancos.',
    iconName: 'Warehouse',
  },
  {
    id: 5,
    name: 'Silo Maior: A Visão de José',
    monthsRequired: 84, // 7 anos
    title: '7 Anos de Reserva Estratégica',
    subtitle: 'Visão Máxima de José no Egito (Gênesis 41)',
    description: 'Abundância planejada capaz de alimentar e abençoar não apenas sua casa, mas nações e comunidades inteiras em tempos de crise nacional.',
    iconName: 'Crown',
  },
];

export const DEVOTIONALS: DevotionalItem[] = [
  {
    id: 'dev-1',
    reference: 'Gênesis 41:35-36',
    scripture: 'Ajuntem todo o mantimento destes anos bons que vêm, e amontoem trigo sob a autoridade do faraó, para mantimento nas cidades, e o guardem. Assim o mantimento será para abastecer a terra nos sete anos de fome...',
    theme: 'O Princípio da Reserva Estratégica',
    reflection: 'José não esperou a escassez chegar para pensar em provisão. Deus deu discernimento para poupar uma quinta parte (20%) enquanto havia abundância. O celeiro não é falta de fé em Deus, é sabedoria revelada.',
    practicalAction: 'Separe hoje mesmo sua porcentagem de celeiro antes de destinar dinheiro para gastos supérfluos.',
  },
  {
    id: 'dev-2',
    reference: 'Provérbios 21:20',
    scripture: 'Tesouro desejável e azeite há na casa do sábio, mas o homem insensato os devora.',
    theme: 'Prudência contra a Insensatez do Consumo',
    reflection: 'O tolo consome tudo o que suas mãos recebem no mesmo mês, vivendo no limite da corda bamba. O sábio cria margem de segurança e guarda reservas com reverência.',
    practicalAction: 'Examine seus extratos dos últimos 30 dias e encontre ao menos um consumo desnecessário para eliminar.',
  },
  {
    id: 'dev-3',
    reference: 'Provérbios 22:7',
    scripture: 'O rico domina sobre o pobre, e o que toma emprestado é servo do que empresta.',
    theme: 'A Quebra do Jugo da Servidão',
    reflection: 'Dívidas colocam o crente sob submissão de credores e roubam a paz da família. O objetivo da mordomia cristã é a liberdade completa para servir ao Reino sem amarras.',
    practicalAction: 'Concentre todas as sobras do orçamento no seu 1º Alvo de Ataque de dívidas neste mês.',
  },
  {
    id: 'dev-4',
    reference: 'Provérbios 3:9-10',
    scripture: 'Honra ao Senhor com os teus bens e com as primícias de toda a tua renda; e se encherão os teus celeiros abundantemente, e transbordarão de vinho os teus lagares.',
    theme: 'Primícias: A Raiz da Bênção',
    reflection: 'As primícias vêm em primeiro lugar porque consagram todo o resto. Quem é fiel no pouco com gratidão desenvolve um coração descansado na providência de Deus.',
    practicalAction: 'Celebre com gratidão a renda que Deus permitiu que você colhesse neste ciclo.',
  },
  {
    id: 'dev-5',
    reference: 'Lucas 14:28',
    scripture: 'Pois qual de vós, querendo edificar uma torre, não se senta primeiro a fazer as contas dos gastos, para ver se tem com que a acabar?',
    theme: 'O Valor do Diagnóstico da Terra',
    reflection: 'Jesus elogiou o planejamento lúcido e calculista antes de qualquer empreendimento. Um orçamento detalhado não é frieza, é obediência e honestidade com a realidade.',
    practicalAction: 'Confira as despesas previstas versus realizadas no módulo de Diagnóstico.',
  },
];
