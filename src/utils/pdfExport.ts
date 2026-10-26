import jsPDF from 'jspdf';
import { IncomeItem, ExpenseItem, DebtItem } from '../types';
import { formatCurrency, formatPercent } from './formatters';

interface MonthlyReportData {
  monthName: string;
  year: number;
  totalIncomeActual: number;
  totalIncomePlanned: number;
  totalExpensesActual: number;
  totalExpensesPlanned: number;
  primitiasExpenses: number;
  essentialExpenses: number;
  lifestyleExpenses: number;
  barnContributions: number;
  freeBalance: number;
  primitiasPercentage: number;
  essentialPercentage: number;
  barnSavings: number;
  peaceIndexMonths: number;
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  debts: DebtItem[];
  userEmail?: string | null;
}

export function generateMonthlyReportPDF(data: MonthlyReportData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const margin = 15;
  let y = margin;

  // Header Banner com Verde Oliva
  doc.setFillColor(27, 67, 50); // #1b4332
  doc.rect(margin, y, pageWidth - 2 * margin, 24, 'F');

  // Título e Subtítulo
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('CELEIRO: O MÉTODO JOSÉ', margin + 5, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(212, 163, 115); // #d4a373
  doc.text('Relatório Mensal de Gestão Financeira & Mordomia Bíblica', margin + 5, y + 16);

  // Data e Mês à direita
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  const monthTitle = `${data.monthName.toUpperCase()} / ${data.year}`;
  doc.text(monthTitle, pageWidth - margin - 5, y + 11, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 200);
  const nowStr = new Date().toLocaleDateString('pt-BR');
  doc.text(`Emissão: ${nowStr}`, pageWidth - margin - 5, y + 17, { align: 'right' });

  y += 30;

  // Versículo de Abertura
  doc.setFillColor(247, 245, 239);
  doc.setDrawColor(212, 163, 115);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  doc.text(
    '“Tesouro desejável e azeite há na casa do sábio, mas o homem insensato os devora.” — Provérbios 21:20',
    margin + 4,
    y + 6
  );
  doc.text(
    '“Ajuntem todo o mantimento destes anos bons que vêm, e amontoem trigo...” — Gênesis 41:35',
    margin + 4,
    y + 10.5
  );

  y += 20;

  // Seção 1: Indicadores Vitais (Grid 4 colunas)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(27, 67, 50);
  doc.text('1. Indicadores Vitais da Colheita', margin, y);

  y += 4;

  const cardWidth = (pageWidth - 2 * margin - 9) / 4;
  const cardHeight = 18;

  // Card 1: Renda
  doc.setFillColor(250, 250, 250);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(margin, y, cardWidth, cardHeight, 1.5, 1.5, 'FD');
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text('Renda Realizada', margin + 3, y + 5);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(27, 67, 50);
  doc.text(formatCurrency(data.totalIncomeActual), margin + 3, y + 12);

  // Card 2: Primícias
  const card2X = margin + cardWidth + 3;
  doc.roundedRect(card2X, y, cardWidth, cardHeight, 1.5, 1.5, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Primícias / Ofertas', card2X + 3, y + 5);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(143, 107, 15);
  doc.text(`${formatCurrency(data.primitiasExpenses)} (${formatPercent(data.primitiasPercentage)})`, card2X + 3, y + 12);

  // Card 3: A Tenda (Essenciais)
  const card3X = card2X + cardWidth + 3;
  doc.roundedRect(card3X, y, cardWidth, cardHeight, 1.5, 1.5, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('A Tenda (Essenciais)', card3X + 3, y + 5);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(data.essentialPercentage <= 60 ? 27 : 180, data.essentialPercentage <= 60 ? 67 : 50, 50);
  doc.text(`${formatCurrency(data.essentialExpenses)} (${formatPercent(data.essentialPercentage)})`, card3X + 3, y + 12);

  // Card 4: Índice de Paz
  const card4X = card3X + cardWidth + 3;
  doc.setFillColor(254, 252, 245);
  doc.setDrawColor(212, 163, 115);
  doc.roundedRect(card4X, y, cardWidth, cardHeight, 1.5, 1.5, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(143, 107, 15);
  doc.text('Índice de Paz (Silos)', card4X + 3, y + 5);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(27, 67, 50);
  doc.text(`${data.peaceIndexMonths} meses cobertos`, card4X + 3, y + 12);

  y += cardHeight + 8;

  // Seção 2: Resumo Financeiro & Sobra do Mês
  doc.setFillColor(245, 248, 246);
  doc.setDrawColor(200, 220, 210);
  doc.roundedRect(margin, y, pageWidth - 2 * margin, 12, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(27, 67, 50);
  doc.text(`Total de Despesas: ${formatCurrency(data.totalExpensesActual)}`, margin + 4, y + 7);
  doc.text(`Sobra Financeira Livre do Mês: ${formatCurrency(data.freeBalance)}`, margin + 65, y + 7);
  doc.text(`Reserva no Celeiro: ${formatCurrency(data.barnSavings)}`, margin + 130, y + 7);

  y += 18;

  // Seção 3: Tabela de Receitas
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(27, 67, 50);
  doc.text('2. Fontes de Renda da Colheita', margin, y);

  y += 3;

  // Cabeçalho da Tabela
  doc.setFillColor(27, 67, 50);
  doc.rect(margin, y, pageWidth - 2 * margin, 6, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Descrição', margin + 3, y + 4.2);
  doc.text('Categoria', margin + 85, y + 4.2);
  doc.text('Previsto (R$)', margin + 125, y + 4.2, { align: 'right' });
  doc.text('Realizado (R$)', margin + 155, y + 4.2, { align: 'right' });
  doc.text('Diferença', pageWidth - margin - 3, y + 4.2, { align: 'right' });

  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(40, 40, 40);

  if (data.incomes.length === 0) {
    doc.text('Nenhuma receita cadastrada neste ciclo.', margin + 3, y + 5);
    y += 8;
  } else {
    data.incomes.slice(0, 8).forEach((inc, idx) => {
      const rowBg = idx % 2 === 0 ? 255 : 249;
      doc.setFillColor(rowBg, rowBg, rowBg);
      doc.rect(margin, y, pageWidth - 2 * margin, 5.5, 'F');

      const diff = inc.actualAmount - inc.plannedAmount;
      doc.text(inc.description.slice(0, 40), margin + 3, y + 3.8);
      doc.text(inc.category.slice(0, 20), margin + 85, y + 3.8);
      doc.text(formatCurrency(inc.plannedAmount), margin + 125, y + 3.8, { align: 'right' });
      doc.text(formatCurrency(inc.actualAmount), margin + 155, y + 3.8, { align: 'right' });
      doc.text(diff >= 0 ? `+${formatCurrency(diff)}` : formatCurrency(diff), pageWidth - margin - 3, y + 3.8, {
        align: 'right',
      });

      y += 5.5;
    });
  }

  y += 4;

  // Seção 4: Despesas por Princípios
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(27, 67, 50);
  doc.text('3. Despesas Organizadas por Princípios Bíblicos', margin, y);

  y += 3;

  doc.setFillColor(27, 67, 50);
  doc.rect(margin, y, pageWidth - 2 * margin, 6, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Descrição', margin + 3, y + 4.2);
  doc.text('Princípio Bíblico', margin + 80, y + 4.2);
  doc.text('Previsto (R$)', margin + 130, y + 4.2, { align: 'right' });
  doc.text('Realizado (R$)', margin + 160, y + 4.2, { align: 'right' });
  doc.text('Status', pageWidth - margin - 3, y + 4.2, { align: 'right' });

  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(40, 40, 40);

  if (data.expenses.length === 0) {
    doc.text('Nenhuma despesa cadastrada neste ciclo.', margin + 3, y + 5);
    y += 8;
  } else {
    data.expenses.slice(0, 10).forEach((exp, idx) => {
      const rowBg = idx % 2 === 0 ? 255 : 249;
      doc.setFillColor(rowBg, rowBg, rowBg);
      doc.rect(margin, y, pageWidth - 2 * margin, 5.5, 'F');

      let principleLabel = 'Essencial (A Tenda)';
      if (exp.category === 'primitias') principleLabel = 'Primícias / Oferta';
      else if (exp.category === 'estilo') principleLabel = 'Estilo de Vida';
      else if (exp.category === 'celeiro') principleLabel = 'Aporte no Silo';

      doc.text(exp.description.slice(0, 38), margin + 3, y + 3.8);
      doc.text(principleLabel, margin + 80, y + 3.8);
      doc.text(formatCurrency(exp.plannedAmount), margin + 130, y + 3.8, { align: 'right' });
      doc.text(formatCurrency(exp.actualAmount), margin + 160, y + 3.8, { align: 'right' });
      doc.text(exp.actualAmount > 0 ? 'Pago' : 'Pendente', pageWidth - margin - 3, y + 3.8, { align: 'right' });

      y += 5.5;
    });
  }

  y += 4;

  // Seção 5: Rota de Quitação & Quebra de Jugo (Dívidas)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(27, 67, 50);
  doc.text('4. Rota de Quitação & Bola de Neve (Quebra do Jugo)', margin, y);

  y += 3;

  doc.setFillColor(180, 50, 50); // tom rubi/alerta
  doc.rect(margin, y, pageWidth - 2 * margin, 6, 'F');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text('Fila / Credor', margin + 3, y + 4.2);
  doc.text('Taxa Juros', margin + 90, y + 4.2);
  doc.text('Parcela Atual', margin + 125, y + 4.2, { align: 'right' });
  doc.text('Saldo Devedor', margin + 160, y + 4.2, { align: 'right' });
  doc.text('Prioridade', pageWidth - margin - 3, y + 4.2, { align: 'right' });

  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(40, 40, 40);

  if (data.debts.length === 0) {
    doc.text('Glória a Deus! Nenhuma dívida ativa cadastrada. A terra está livre do jugo.', margin + 3, y + 5);
    y += 8;
  } else {
    data.debts.slice(0, 6).forEach((debt, idx) => {
      const rowBg = idx % 2 === 0 ? 255 : 249;
      doc.setFillColor(rowBg, rowBg, rowBg);
      doc.rect(margin, y, pageWidth - 2 * margin, 5.5, 'F');

      const isTarget = idx === 0;
      doc.text(`${idx + 1}. ${debt.creditor.slice(0, 35)}`, margin + 3, y + 3.8);
      doc.text(`${debt.interestRate}% a.m.`, margin + 90, y + 3.8);
      doc.text(formatCurrency(debt.monthlyPayment), margin + 125, y + 3.8, { align: 'right' });
      doc.text(formatCurrency(debt.balance), margin + 160, y + 3.8, { align: 'right' });
      doc.text(isTarget ? '1º ALVO' : 'Fila', pageWidth - margin - 3, y + 3.8, { align: 'right' });

      y += 5.5;
    });
  }

  // Rodapé do Relatório
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, 282, pageWidth - margin, 282);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text(
    'Celeiro: O Método José de Gestão Financeira Bíblica · Relatório confidencial para conferência de mordomia cristã.',
    margin,
    286
  );
  if (data.userEmail) {
    doc.text(`Usuário: ${data.userEmail}`, pageWidth - margin, 286, { align: 'right' });
  }

  // Salva o arquivo PDF
  const filename = `relatorio-celeiro-${data.monthName.toLowerCase()}-${data.year}.pdf`;
  doc.save(filename);
}
