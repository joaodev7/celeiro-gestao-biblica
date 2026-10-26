import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatPercent, formatDateBR } from '../utils/formatters';
import { ExpenseCategory, IncomeItem, ExpenseItem } from '../types';
import {
  PlusCircle,
  Trash2,
  Edit2,
  TrendingUp,
  AlertCircle,
  HeartHandshake,
  Home,
  Coffee,
  Wheat,
  Scale,
  Sparkles,
  FileDown,
} from 'lucide-react';

export const DiagnosticoView: React.FC = () => {
  const {
    incomes,
    expenses,
    totalIncomePlanned,
    totalIncomeActual,
    totalExpensesPlanned,
    totalExpensesActual,
    primitiasExpenses,
    essentialExpenses,
    lifestyleExpenses,
    barnContributionsThisMonth,
    freeBalance,
    primitiasPercentage,
    essentialPercentage,
    lifestylePercentage,
    addIncome,
    updateIncome,
    deleteIncome,
    addExpense,
    updateExpense,
    deleteExpense,
    exportMonthlyReport,
  } = useApp();

  // Tab filter for expenses
  const [expenseFilter, setExpenseFilter] = useState<'all' | ExpenseCategory>('all');

  // Modal edit/create states
  const [editingIncome, setEditingIncome] = useState<IncomeItem | null>(null);
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);

  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Income form state
  const [incDesc, setIncDesc] = useState('');
  const [incPlanned, setIncPlanned] = useState('');
  const [incActual, setIncActual] = useState('');
  const [incCategory, setIncCategory] = useState('Salário / Atividade Principal');
  const [incDate, setIncDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Expense form state
  const [expDesc, setExpDesc] = useState('');
  const [expPlanned, setExpPlanned] = useState('');
  const [expActual, setExpActual] = useState('');
  const [expCat, setExpCat] = useState<ExpenseCategory>('essencial');
  const [expDate, setExpDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [expNotes, setExpNotes] = useState('');

  // Open Add Income Modal
  const handleOpenAddIncome = () => {
    setEditingIncome(null);
    setIncDesc('');
    setIncPlanned('');
    setIncActual('');
    setIncCategory('Salário / Trabalho');
    setIncDate(new Date().toISOString().split('T')[0]);
    setIsIncomeModalOpen(true);
  };

  const handleOpenEditIncome = (item: IncomeItem) => {
    setEditingIncome(item);
    setIncDesc(item.description);
    setIncPlanned(item.plannedAmount.toString());
    setIncActual(item.actualAmount.toString());
    setIncCategory(item.category);
    setIncDate(item.date);
    setIsIncomeModalOpen(true);
  };

  const handleSaveIncome = (e: React.FormEvent) => {
    e.preventDefault();
    const planned = parseFloat(incPlanned.replace(',', '.'));
    const actual = incActual ? parseFloat(incActual.replace(',', '.')) : planned;
    if (isNaN(planned) || planned <= 0) return;

    if (editingIncome) {
      updateIncome({
        ...editingIncome,
        description: incDesc,
        plannedAmount: planned,
        actualAmount: isNaN(actual) ? planned : actual,
        category: incCategory,
        date: incDate,
      });
    } else {
      addIncome({
        description: incDesc || 'Fonte de Renda',
        plannedAmount: planned,
        actualAmount: isNaN(actual) ? planned : actual,
        category: incCategory,
        date: incDate,
      });
    }
    setIsIncomeModalOpen(false);
  };

  // Open Add Expense Modal
  const handleOpenAddExpense = (cat?: ExpenseCategory) => {
    setEditingExpense(null);
    setExpDesc('');
    setExpPlanned('');
    setExpActual('');
    setExpCat(cat || 'essencial');
    setExpDate(new Date().toISOString().split('T')[0]);
    setExpNotes('');
    setIsExpenseModalOpen(true);
  };

  const handleOpenEditExpense = (item: ExpenseItem) => {
    setEditingExpense(item);
    setExpDesc(item.description);
    setExpPlanned(item.plannedAmount.toString());
    setExpActual(item.actualAmount.toString());
    setExpCat(item.category);
    setExpDate(item.date);
    setExpNotes(item.notes || '');
    setIsExpenseModalOpen(true);
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const planned = parseFloat(expPlanned.replace(',', '.'));
    const actual = expActual ? parseFloat(expActual.replace(',', '.')) : planned;
    if (isNaN(planned) || planned <= 0) return;

    if (editingExpense) {
      updateExpense({
        ...editingExpense,
        description: expDesc,
        plannedAmount: planned,
        actualAmount: isNaN(actual) ? planned : actual,
        category: expCat,
        date: expDate,
        notes: expNotes,
      });
    } else {
      addExpense({
        description: expDesc || 'Despesa',
        plannedAmount: planned,
        actualAmount: isNaN(actual) ? planned : actual,
        category: expCat,
        date: expDate,
        notes: expNotes,
      });
    }
    setIsExpenseModalOpen(false);
  };

  // Termômetro de Mordomia Feedback Logic
  const getStewardshipDiagnosis = () => {
    if (totalIncomeActual <= 0) {
      return {
        status: 'neutro',
        title: 'Aguardando Lançamentos da Colheita',
        message: 'Cadastre suas fontes de renda para visualizar o diagnóstico de mordomia.',
      };
    }

    if (freeBalance < 0) {
      return {
        status: 'alerta',
        title: 'Alerta de Sangria: Gastos Superam a Renda Realizada',
        message:
          'Você está consumindo mais do que colhe neste mês. Aplique com urgência cortes nos gastos de Estilo de Vida e busque a prudência de Provérbios 21:20 para estancar novas dívidas.',
      };
    }

    if (essentialPercentage > 65) {
      return {
        status: 'atencao',
        title: 'A Tenda Está Pressionada (Custos Essenciais Elevados)',
        message: `Seus custos essenciais consomem ${formatPercent(
          essentialPercentage
        )} da sua colheita (meta recomendada: até 50-60%). Isso reduz sua velocidade para encher os celeiros e atacar dívidas. Procure renegociar contratos e enxugar custos básicos.`,
      };
    }

    if (primitiasPercentage >= 10 && freeBalance > 0) {
      return {
        status: 'excelente',
        title: 'Excelente Mordomia! Colheita em Ordem e Celeiros Abertos',
        message: `Você está honrando a Deus com as primícias (${formatPercent(
          primitiasPercentage
        )}), mantendo a tenda equilibrada (${formatPercent(
          essentialPercentage
        )}) e gerando uma sobra livre abençoada de ${formatCurrency(
          freeBalance
        )} para quebrar o jugo de dívidas ou alimentar o Silo de José!`,
      };
    }

    return {
      status: 'bom',
      title: 'Fluxo Positivo: Bom Equilíbrio Financeiro',
      message: `Você encerra o ciclo com sobra livre de ${formatCurrency(
        freeBalance
      )}. Mantenha a vigilância contra o consumo impulsivo e direcione essa semente para os celeiros.`,
    };
  };

  const diagnosis = getStewardshipDiagnosis();

  // Filtered expenses
  const filteredExpenses =
    expenseFilter === 'all'
      ? expenses
      : expenses.filter((e) => e.category === expenseFilter);

  // Category labels and badges
  const getCategoryMeta = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'primitias':
        return {
          label: 'Primícias & Generosidade',
          icon: HeartHandshake,
          color: 'text-[#8f6b0f] dark:text-[#d4a373]',
          bg: 'bg-[#fbf5e6] dark:bg-[#2b2414]',
        };
      case 'essencial':
        return {
          label: 'Custos Essenciais (A Tenda)',
          icon: Home,
          color: 'text-[#1b4332] dark:text-[#9fe2be]',
          bg: 'bg-[#edf4f0] dark:bg-[#1a2d24]',
        };
      case 'estilo':
        return {
          label: 'Estilo de Vida & Lazer',
          icon: Coffee,
          color: 'text-indigo-800 dark:text-indigo-300',
          bg: 'bg-indigo-50 dark:bg-indigo-950/40',
        };
      case 'celeiro':
        return {
          label: 'Aporte de Celeiro / Poupança',
          icon: Wheat,
          color: 'text-[#2d6a4f] dark:text-[#74c69d]',
          bg: 'bg-[#eef7f2] dark:bg-[#14291f]',
        };
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1b4332] dark:text-[#d4a373] uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>Módulo 2: O Diagnóstico da Terra</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1b4332] dark:text-[#e9d8a6]">
            Diagnóstico do Fluxo de Caixa Bíblico
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Compare o que foi planejado com o realizado e proteja os pilares da sua casa
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <button
            onClick={exportMonthlyReport}
            title="Exportar Relatório Mensal Bíblico em PDF"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-white dark:bg-[#1a2922] border border-[#c59b27]/60 hover:border-[#c59b27] rounded-lg shadow-xs transition-colors"
          >
            <FileDown className="w-4 h-4 text-[#c59b27]" />
            <span>Relatório PDF</span>
          </button>
          <button
            onClick={handleOpenAddIncome}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-800 dark:text-stone-200 bg-white dark:bg-[#1a2922] border border-[#e5e0d8] dark:border-[#2b4136] hover:border-[#1b4332] rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-emerald-600" />
            <span>+ Receita</span>
          </button>
          <button
            onClick={() => handleOpenAddExpense()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#1b4332] dark:bg-[#2d6a4f] hover:bg-[#255741] rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-[#d4a373]" />
            <span>+ Despesa</span>
          </button>
        </div>
      </div>

      {/* Termômetro de Mordomia */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          diagnosis.status === 'excelente'
            ? 'border-emerald-300 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/20'
            : diagnosis.status === 'alerta'
            ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/20'
            : diagnosis.status === 'atencao'
            ? 'border-amber-300 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/20'
            : 'border-[#c59b27]/30 bg-[#fbf9f2] dark:bg-[#18261e]'
        }`}
      >
        <div className="flex items-start gap-3.5">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              diagnosis.status === 'excelente'
                ? 'bg-emerald-600 text-white'
                : diagnosis.status === 'alerta'
                ? 'bg-rose-600 text-white'
                : 'bg-[#c59b27] text-white'
            }`}
          >
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold tracking-wider uppercase text-stone-500 dark:text-stone-400">
              Termômetro de Mordomia & Sabedoria
            </span>
            <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
              {diagnosis.title}
            </h3>
            <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
              {diagnosis.message}
            </p>
          </div>
        </div>
      </div>

      {/* Cards de Diagnóstico Rápido (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Renda Total Realizada */}
        <div className="p-5 rounded-xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c] shadow-xs">
          <span className="text-xs text-stone-500 dark:text-stone-400 block mb-1">
            Renda Total Realizada
          </span>
          <div className="font-mono text-2xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
            {formatCurrency(totalIncomeActual)}
          </div>
          <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Previsto: {formatCurrency(totalIncomePlanned)}</span>
            <span
              className={`font-semibold ${
                totalIncomeActual >= totalIncomePlanned ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {totalIncomeActual >= totalIncomePlanned ? 'Cumprido' : 'Parcial'}
            </span>
          </div>
        </div>

        {/* KPI 2: Primícias & Generosidade */}
        <div className="p-5 rounded-xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c] shadow-xs">
          <span className="text-xs text-stone-500 dark:text-stone-400 block mb-1">
            Primícias & Generosidade
          </span>
          <div className="font-mono text-2xl font-bold text-[#8f6b0f] dark:text-[#d4a373] tabular-nums">
            {formatPercent(primitiasPercentage)}
          </div>
          <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Total: {formatCurrency(primitiasExpenses)}</span>
            <span className="text-stone-400">Meta: $\ge 10\%$</span>
          </div>
        </div>

        {/* KPI 3: Custos Essenciais (A Tenda) */}
        <div className="p-5 rounded-xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c] shadow-xs">
          <span className="text-xs text-stone-500 dark:text-stone-400 block mb-1">
            Custos Essenciais (A Tenda)
          </span>
          <div
            className={`font-mono text-2xl font-bold tabular-nums ${
              essentialPercentage <= 60 ? 'text-[#1b4332] dark:text-[#9fe2be]' : 'text-amber-600'
            }`}
          >
            {formatPercent(essentialPercentage)}
          </div>
          <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Total: {formatCurrency(essentialExpenses)}</span>
            <span className="text-stone-400">Meta: $\le 60\%$</span>
          </div>
        </div>

        {/* KPI 4: Saldo Livre / Sobra Financeira */}
        <div className="p-5 rounded-xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c] shadow-xs">
          <span className="text-xs text-stone-500 dark:text-stone-400 block mb-1">
            Sobra Financeira do Mês
          </span>
          <div
            className={`font-mono text-2xl font-bold tabular-nums ${
              freeBalance >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'
            }`}
          >
            {formatCurrency(freeBalance)}
          </div>
          <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between">
            <span>Despesas: {formatCurrency(totalExpensesActual)}</span>
            <span className="font-medium text-emerald-600">Disponível</span>
          </div>
        </div>
      </div>

      {/* Barra de Distribuição da Colheita */}
      <div className="p-6 rounded-xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-sm font-bold text-stone-800 dark:text-stone-200">
            Distribuição da Colheita por Princípios
          </h2>
          <span className="text-xs text-stone-500 font-mono">
            {formatCurrency(totalExpensesActual)} de {formatCurrency(totalIncomeActual)}
          </span>
        </div>

        {/* Segmented bar */}
        <div className="h-4 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${Math.min(100, primitiasPercentage)}%` }}
            title={`Primícias: ${formatPercent(primitiasPercentage)}`}
            className="bg-[#c59b27] h-full transition-all"
          />
          <div
            style={{ width: `${Math.min(100, essentialPercentage)}%` }}
            title={`A Tenda (Essenciais): ${formatPercent(essentialPercentage)}`}
            className="bg-[#1b4332] dark:bg-[#2d6a4f] h-full transition-all"
          />
          <div
            style={{ width: `${Math.min(100, lifestylePercentage)}%` }}
            title={`Estilo de Vida: ${formatPercent(lifestylePercentage)}`}
            className="bg-indigo-500 h-full transition-all"
          />
          <div
            style={{
              width: `${Math.min(
                100,
                totalIncomeActual > 0 ? (barnContributionsThisMonth / totalIncomeActual) * 100 : 0
              )}%`,
            }}
            title={`Aporte Celeiro: ${formatCurrency(barnContributionsThisMonth)}`}
            className="bg-emerald-600 h-full transition-all"
          />
        </div>

        {/* Legend */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-stone-600 dark:text-stone-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#c59b27]" />
            <span>Primícias: {formatPercent(primitiasPercentage)} ({formatCurrency(primitiasExpenses)})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1b4332] dark:bg-[#2d6a4f]" />
            <span>A Tenda: {formatPercent(essentialPercentage)} ({formatCurrency(essentialExpenses)})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span>Estilo de Vida: {formatPercent(lifestylePercentage)} ({formatCurrency(lifestyleExpenses)})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span>Aporte Celeiro: {formatCurrency(barnContributionsThisMonth)}</span>
          </div>
        </div>
      </div>

      {/* SEÇÃO 1: TABELA DE RECEITAS */}
      <div className="rounded-xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c] overflow-hidden">
        <div className="p-5 border-b border-[#e5e0d8] dark:border-[#22332a] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-base font-bold text-[#1b4332] dark:text-[#e9d8a6]">
              Fontes de Renda & Colheita
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Acompanhamento de entradas previstas vs. realizadas
            </p>
          </div>
          <button
            onClick={handleOpenAddIncome}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg hover:bg-emerald-100 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Nova Renda</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e5e0d8] dark:border-[#22332a] bg-stone-50/60 dark:bg-[#121c17]/60 text-stone-500 dark:text-stone-400">
                <th className="py-3 px-4 font-semibold">Descrição</th>
                <th className="py-3 px-4 font-semibold">Categoria</th>
                <th className="py-3 px-4 font-semibold text-right">Previsto (R$)</th>
                <th className="py-3 px-4 font-semibold text-right">Realizado (R$)</th>
                <th className="py-3 px-4 font-semibold text-right">Diferença</th>
                <th className="py-3 px-4 font-semibold text-center w-20">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e0d8] dark:divide-[#22332a]">
              {incomes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-500">
                    <p className="font-medium text-stone-700 dark:text-stone-300 text-sm">
                      Nenhuma fonte de renda cadastrada ainda
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      Clique em "+ Nova Renda" para registrar seus rendimentos deste mês.
                    </p>
                  </td>
                </tr>
              ) : (
                incomes.map((inc) => {
                  const diff = inc.actualAmount - inc.plannedAmount;
                  return (
                    <tr key={inc.id} className="hover:bg-stone-50/50 dark:hover:bg-[#1b2b22]/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-medium text-stone-900 dark:text-stone-100 block">
                          {inc.description}
                        </span>
                        {inc.notes && (
                          <span className="text-[11px] text-stone-400">{inc.notes}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-stone-600 dark:text-stone-300">
                        {inc.category}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-700 dark:text-stone-300">
                        {formatCurrency(inc.plannedAmount)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-emerald-700 dark:text-emerald-400">
                        {formatCurrency(inc.actualAmount)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        <span
                          className={`font-medium ${
                            diff > 0
                              ? 'text-emerald-600'
                              : diff < 0
                              ? 'text-rose-600'
                              : 'text-stone-400'
                          }`}
                        >
                          {diff > 0 ? `+${formatCurrency(diff)}` : formatCurrency(diff)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditIncome(inc)}
                            title="Editar"
                            className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteIncome(inc.id)}
                            title="Excluir"
                            className="p-1 rounded text-stone-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr className="bg-stone-50/80 dark:bg-[#142019] font-semibold border-t border-[#e5e0d8] dark:border-[#22332a]">
                <td colSpan={2} className="py-3 px-4 text-stone-800 dark:text-stone-200">
                  Total de Renda da Colheita
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-700 dark:text-stone-300">
                  {formatCurrency(totalIncomePlanned)}
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-400 text-sm">
                  {formatCurrency(totalIncomeActual)}
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums text-emerald-600">
                  {totalIncomeActual - totalIncomePlanned >= 0
                    ? `+${formatCurrency(totalIncomeActual - totalIncomePlanned)}`
                    : formatCurrency(totalIncomeActual - totalIncomePlanned)}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* SEÇÃO 2: TABELA DE DESPESAS CATEGORIZADAS POR PRINCÍPIOS */}
      <div className="rounded-xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c] overflow-hidden">
        <div className="p-5 border-b border-[#e5e0d8] dark:border-[#22332a] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif text-base font-bold text-[#1b4332] dark:text-[#e9d8a6]">
              Despesas Organizadas por Princípios
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Primícias, Custos Essenciais (A Tenda), Estilo de Vida e Aportes de Celeiro
            </p>
          </div>

          {/* Segmented Filter */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-[#121c17] rounded-lg overflow-x-auto">
            <button
              onClick={() => setExpenseFilter('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                expenseFilter === 'all'
                  ? 'bg-white dark:bg-[#1b4332] text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Todas ({expenses.length})
            </button>
            <button
              onClick={() => setExpenseFilter('primitias')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                expenseFilter === 'primitias'
                  ? 'bg-white dark:bg-[#1b4332] text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Primícias
            </button>
            <button
              onClick={() => setExpenseFilter('essencial')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                expenseFilter === 'essencial'
                  ? 'bg-white dark:bg-[#1b4332] text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              A Tenda (Essenciais)
            </button>
            <button
              onClick={() => setExpenseFilter('estilo')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                expenseFilter === 'estilo'
                  ? 'bg-white dark:bg-[#1b4332] text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Estilo de Vida
            </button>
            <button
              onClick={() => setExpenseFilter('celeiro')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                expenseFilter === 'celeiro'
                  ? 'bg-white dark:bg-[#1b4332] text-stone-900 dark:text-white shadow-xs font-semibold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              Aportes Silo
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e5e0d8] dark:border-[#22332a] bg-stone-50/60 dark:bg-[#121c17]/60 text-stone-500 dark:text-stone-400">
                <th className="py-3 px-4 font-semibold">Descrição</th>
                <th className="py-3 px-4 font-semibold">Princípio Bíblico</th>
                <th className="py-3 px-4 font-semibold text-right">Previsto (R$)</th>
                <th className="py-3 px-4 font-semibold text-right">Realizado (R$)</th>
                <th className="py-3 px-4 font-semibold text-right">Diferença</th>
                <th className="py-3 px-4 font-semibold text-center w-20">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e0d8] dark:divide-[#22332a]">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-stone-500">
                    <p className="font-medium text-stone-700 dark:text-stone-300 text-sm">
                      Nenhuma despesa cadastrada nesta categoria
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      Clique em "+ Despesa" para registrar seus gastos da tenda, primícias ou estilo de vida.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => {
                  const meta = getCategoryMeta(exp.category);
                  const diff = exp.actualAmount - exp.plannedAmount;
                  return (
                    <tr key={exp.id} className="hover:bg-stone-50/50 dark:hover:bg-[#1b2b22]/40 transition-colors">
                      <td className="py-3 px-4">
                        <span className="font-medium text-stone-900 dark:text-stone-100 block">
                          {exp.description}
                        </span>
                        {exp.notes && (
                          <span className="text-[11px] text-stone-400">{exp.notes}</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-xs text-stone-600 dark:text-stone-300 font-medium">
                          {meta.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-700 dark:text-stone-300">
                        {formatCurrency(exp.plannedAmount)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-semibold tabular-nums text-stone-900 dark:text-stone-100">
                        {formatCurrency(exp.actualAmount)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums">
                        <span
                          className={`font-medium ${
                            diff < 0
                              ? 'text-emerald-600'
                              : diff > 0
                              ? 'text-rose-600'
                              : 'text-stone-400'
                          }`}
                        >
                          {diff > 0 ? `+${formatCurrency(diff)}` : formatCurrency(diff)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEditExpense(exp)}
                            title="Editar"
                            className="p-1 rounded text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteExpense(exp.id)}
                            title="Excluir"
                            className="p-1 rounded text-stone-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            <tfoot>
              <tr className="bg-stone-50/80 dark:bg-[#142019] font-semibold border-t border-[#e5e0d8] dark:border-[#22332a]">
                <td colSpan={2} className="py-3 px-4 text-stone-800 dark:text-stone-200">
                  Total de Despesas {expenseFilter !== 'all' ? `(${getCategoryMeta(expenseFilter).label})` : ''}
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-700 dark:text-stone-300">
                  {formatCurrency(
                    filteredExpenses.reduce((acc, curr) => acc + curr.plannedAmount, 0)
                  )}
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-900 dark:text-stone-100 text-sm">
                  {formatCurrency(
                    filteredExpenses.reduce((acc, curr) => acc + curr.actualAmount, 0)
                  )}
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-600">
                  {formatCurrency(
                    filteredExpenses.reduce((acc, curr) => acc + (curr.actualAmount - curr.plannedAmount), 0)
                  )}
                </td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* MODAL DE EDIÇÃO/CRIAÇÃO DE RECEITA */}
      {isIncomeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#fbf9f5] dark:bg-[#16231c] rounded-2xl shadow-xl border border-[#e5e0d8] dark:border-[#2b4136] p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#1b4332] dark:text-[#e9d8a6]">
              {editingIncome ? 'Editar Renda da Colheita' : 'Adicionar Nova Renda'}
            </h3>
            <form onSubmit={handleSaveIncome} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  required
                  value={incDesc}
                  onChange={(e) => setIncDesc(e.target.value)}
                  placeholder="Ex: Salário Mensal, Renda Extra..."
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Categoria
                </label>
                <input
                  type="text"
                  value={incCategory}
                  onChange={(e) => setIncCategory(e.target.value)}
                  placeholder="Ex: Trabalho, Comércio, Investimento"
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Previsto (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={incPlanned}
                    onChange={(e) => setIncPlanned(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-mono bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Realizado (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={incActual}
                    onChange={(e) => setIncActual(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-mono bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsIncomeModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1b4332] dark:bg-[#2d6a4f] rounded-lg"
                >
                  Salvar Renda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE EDIÇÃO/CRIAÇÃO DE DESPESA */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#fbf9f5] dark:bg-[#16231c] rounded-2xl shadow-xl border border-[#e5e0d8] dark:border-[#2b4136] p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#1b4332] dark:text-[#e9d8a6]">
              {editingExpense ? 'Editar Despesa' : 'Adicionar Nova Despesa'}
            </h3>
            <form onSubmit={handleSaveExpense} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  required
                  value={expDesc}
                  onChange={(e) => setExpDesc(e.target.value)}
                  placeholder="Ex: Aluguel, Supermercado, Dízimo..."
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Princípio Bíblico
                </label>
                <select
                  value={expCat}
                  onChange={(e) => setExpCat(e.target.value as ExpenseCategory)}
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                >
                  <option value="primitias">Primícias & Generosidade (Dízimos e Ofertas)</option>
                  <option value="essencial">A Tenda (Custos Essenciais e Moradia)</option>
                  <option value="estilo">Estilo de Vida & Lazer Familiar</option>
                  <option value="celeiro">Aporte de Celeiro / Poupança</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Previsto (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={expPlanned}
                    onChange={(e) => setExpPlanned(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-mono bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Realizado (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={expActual}
                    onChange={(e) => setExpActual(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-mono bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Notas / Observações
                </label>
                <input
                  type="text"
                  value={expNotes}
                  onChange={(e) => setExpNotes(e.target.value)}
                  placeholder="Ex: Fatura paga dia 10..."
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1b4332] dark:bg-[#2d6a4f] rounded-lg"
                >
                  Salvar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
