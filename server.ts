import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

function getFallbackWisdom(question: string, context?: any): string {
  const q = (question || '').toLowerCase();
  const barnMonths = context?.peaceIndexMonths || 0;
  const freeBal = context?.freeBalance || 0;
  const debtCount = context?.debtsCount || 0;

  if (q.includes('carro') || q.includes('financiar') || q.includes('veículo')) {
    return `### Orientação sobre Financiamento de Veículos

A Palavra de Deus em **Provérbios 22:7** nos adverte solenemente: *"O rico domina sobre o pobre, e o que toma emprestado é servo do que empresta"*. 

Antes de contrair uma nova obrigação financeira de longo prazo, avalie os seguintes princípios do Método José:

1. **Priorize o Celeiro de Emergência:** Atualmente seu Índice de Paz é de **${barnMonths} meses**. O ideal bíblico é acumular pelo menos de 3 a 6 meses de despesas essenciais guardadas antes de assumir novos custos fixos.
2. **O Peso dos Juros:** Parcelas de financiamento consomem a semente da colheita futura. Se for viável, considere poupar a quantia da parcela por 6 a 12 meses num silo reservado para comprar à vista ou com entrada expressiva.
3. **Custo Total da Posse:** Lembre-se que um veículo envolve combustível, seguro, manutenção e impostos, o que ampliará os custos essenciais da sua tenda.

*"Os planos do diligente conduzem à abundância, mas a pressa só leva à pobreza."* — Provérbios 21:5. Ore, espere com prudência e examine seu fluxo de caixa.`;
  }

  if (q.includes('cortar') || q.includes('despesa') || q.includes('economizar') || q.includes('supérfluo')) {
    return `### Sabedoria para Ajuste de Despesas e Contentamento

Em **Filipenses 4:11-12**, o apóstolo Paulo nos ensina a arte do contentamento santo em todas as circunstâncias. Para desobstruir seu fluxo de caixa e alimentar o Celeiro:

1. **Separe a Tenda do Estilo de Vida:** A tenda representa suas necessidades reais (moradia, alimentação básica, saúde). O estilo de vida (lazer, delivery, assinaturas recorrentes) é onde reside a margem para ajustes temporários de jejum financeiro.
2. **Regra dos 7 Anos de José:** Em tempos de fartura, José recolheu 20% da colheita da terra (Gênesis 41:34). Se hoje sua sobra livre é de **R$ ${freeBal.toFixed(2)}**, cortar pequenos hábitos supérfluos pode dobrar esse aporte para seu celeiro ou para abater dívidas.
3. **Revisão de Assinaturas e Tarifas:** Cancele serviços não utilizados este mês. Cada R$ 50 economizados é uma semente plantada na sua liberdade.`;
  }

  if (q.includes('dízimo') || q.includes('primícias') || q.includes('oferta') || q.includes('igreja')) {
    return `### O Princípio das Primícias e da Generosidade

Em **Provérbios 3:9-10**, somos instruídos: *"Honra ao Senhor com os teus bens e com as primícias de toda a tua renda; e se encherão os teus celeiros abundantemente, e transbordarão de vinho os teus lagares"*.

1. **Primícias não são sobras:** O dízimo e as ofertas voluntárias devem ser separados no primeiro dia em que a colheita entra na conta, demonstrando que Deus é o verdadeiro dono de tudo o que administramos como mordomos.
2. **Generosidade com os necessitados:** Provérbios 19:17 nos lembra que *"quem se compadece do pobre empresta ao Senhor, que lhe retribuirá o benefício"*.
3. **Paz de Consciência:** Honrar a Deus em primeiro lugar remove a ansiedade e alinha o coração com a fidelidade celestial, abrindo visão para administrar sabiamente os outros 90%.`;
  }

  if (q.includes('dívida') || q.includes('jugo') || q.includes('quitar') || q.includes('bola de neve')) {
    return `### Estratégia Bíblica da Bola de Neve para Quebra do Jugo

A servidão das dívidas rouba a paz e o sono. No Método José, seguimos a instrução de Romanos 13:8: *"A ninguém fiqueis devendo coisa alguma, a não ser o amor"*.

1. **Foco no Menor Saldo (1º Alvo):** Você tem atualmente **${debtCount} dívida(s)**. Ataque a menor dívida com toda a força e vigor financeiro, enquanto mantém as parcelas mínimas das demais em dia.
2. **Efeito Psicológico e Espiritual:** Ao eliminar a primeira dívida, você experimenta a quebra do jugo, e todo o valor que pagava naquela parcela é somado à amortização da próxima dívida da fila!
3. **Destine a Sobra do Mês:** Utilize sua sobra livre para acelerar as quitações. Em breve a terra estará limpa e livre de todo peso.`;
  }

  return `### Conselho de Mordomia Bíblica

*"Tesouro desejável e azeite há na casa do sábio, mas o homem insensato os devora."* — **Provérbios 21:20**

A sabedoria bíblica para a administração financeira se ancora em quatro alicerces eternos:
1. **Fidelidade nas Primícias:** Reconhecer a soberania divina com gratidão e coração generoso.
2. **Viver Abaixo das Possibilidades:** Nunca devorar 100% da colheita; deixar sempre uma margem intencional de 10% a 20% para os celeiros.
3. **Reserva Estratégica (O Celeiro de José):** Proteger sua família com um Índice de Paz sólido de 3 a 12 meses de despesas essenciais guardadas para períodos de tempestade ou estiagem.
4. **Repulsa ao Jugo das Dívidas:** Vencer empréstimos e cartões com disciplina e método bola de neve.

Que o Senhor conceda prudência, diligência e paz de espírito ao seu lar!`;
}

// Endpoint do Conselheiro IA
app.post('/api/gemini/advisor', async (req, res) => {
  try {
    const { message, context } = req.body;
    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Mensagem é obrigatória' });
      return;
    }

    if (!ai) {
      res.json({ reply: getFallbackWisdom(message, context) });
      return;
    }

    const contextPrompt = context
      ? `\n\n[DADOS FINANCEIROS ATUAIS DO USUÁRIO]:
- Renda Mensal Total Realizada: R$ ${context.totalIncome ?? 0}
- Custos Essenciais (A Tenda): R$ ${context.essentialExpenses ?? 0}
- Primícias e Doações: R$ ${context.primitiasExpenses ?? 0}
- Estilo de Vida: R$ ${context.lifestyleExpenses ?? 0}
- Sobra Financeira Livre do Mês: R$ ${context.freeBalance ?? 0}
- Saldo Acumulado no Celeiro: R$ ${context.currentBarnAmount ?? 0} (Índice de Paz: ${context.peaceIndexMonths ?? 0} meses de sobrevivência garantidos)
- Total de Dívidas: ${context.debtsCount ?? 0}
- 1º Alvo de Ataque da Bola de Neve: ${context.topDebtCreditor ? `${context.topDebtCreditor} (Saldo de R$ ${context.topDebtBalance})` : 'Nenhuma dívida cadastrada (Livre do jugo)'}`
      : '';

    const systemInstruction = `Você é o Conselheiro Bíblico Financeiro do aplicativo "Celeiro: O Método José de Gestão Financeira Bíblica".
Sua missão é instruir, encorajar e orientar com sabedoria bíblica fundamentada (livros de Provérbios, Eclesiastes, Gênesis - história de José no Egito, ensinamentos de Jesus nos Evangelhos e cartas de Paulo), unindo profundidade espiritual a conselhos práticos e realistas de orçamento familiar.
Princípios centrais:
- Fidelidade e honra a Deus nas primícias (dízimos e ofertas generosas).
- Prudência e contenção: viver abaixo do padrão e estocar nos tempos de fartura (Provérbios 21:20: "Tesouro desejável e azeite há na casa do sábio, mas o homem insensato os devora").
- Fuga do jugo das dívidas: Provérbios 22:7 ("O rico domina sobre o pobre, e o que toma emprestado é servo do que empresta"). Estimule a estratégia bola de neve (quitar a menor dívida primeiro para quebrar o jugo rapidamente).
- Jamais prometa teologia da prosperidade rasa ("dê tanto e fique rico"). Pregue contentamento, modéstia, trabalho diligente e planejamento a longo prazo.
- Formate a resposta com formatação markdown limpa, subtítulos curtos, tópicos objetivos e cite 1 a 2 referências bíblicas pontuais aplicáveis ao dilema do usuário. Seja acolhedor, sóbrio e encorajador.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Pergunta do usuário: "${message}"${contextPrompt}`,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || getFallbackWisdom(message, context);
    res.json({ reply });
  } catch (err: any) {
    console.error('Erro no endpoint Gemini:', err);
    res.json({ reply: getFallbackWisdom(req.body?.message, req.body?.context) });
  }
});

// Configuração do Vite para desenvolvimento e estático para produção
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Celeiro Server rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer();
