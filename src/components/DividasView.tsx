import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { DebtItem } from '../types';
import {
  LockKeyholeOpen,
  TrendingDown,
  Flame,
  CheckCircle2,
  PlusCircle,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Coins,
} from 'lucide-react';

export const DividasView: React.FC = () => {
  const {
    sortedDebts,
    topDebt,
    totalDebtBalance,
    totalDebtMonthlyPayment,
    freeBalance,
    addDebt,
    updateDebt,
    deleteDebt,
    amortizeDebt,
  } = useApp();

  // Modal edit/create debt
  const [isDebtModalOpen, setIsDebtModalOpen] = useState(false);
  const [editingDebt, setEditingDebt] = useState<DebtItem | null>(null);

  const [creditor, setCreditor] = useState('');
  const [balance, setBalance] = useState('');
  const [interestRate, setInterestRate] = useState('2.5');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [dueDateDay, setDueDateDay] = useState('10');
  const [notes, setNotes] = useState('');

  // Modal amortize
  const [isAmortizeModalOpen, setIsAmortizeModalOpen] = useState(false);
  const [targetDebtToAmortize, setTargetDebtToAmortize] = useState<DebtItem | null>(null);
  const [amortizeAmountInput, setAmortizeAmountInput] = useState('');

  // Simulador de Aceleração da Bola de Neve
  const [extraPaymentSim, setExtraPaymentSim] = useState(
    freeBalance > 0 ? Math.round(freeBalance).toString() : '300'
  );

  // Active debts (balance > 0)
  const activeDebts = sortedDebts.filter((d) => d.balance > 0);
  const paidDebts = sortedDebts.filter((d) => d.balance <= 0);

  // Handlers for Debt CRUD
  const handleOpenAddDebt = () => {
    setEditingDebt(null);
    setCreditor('');
    setBalance('');
    setInterestRate('2.5');
    setMonthlyPayment('');
    setDueDateDay('10');
    setNotes('');
    setIsDebtModalOpen(true);
  };

  const handleOpenEditDebt = (item: DebtItem) => {
    setEditingDebt(item);
    setCreditor(item.creditor);
    setBalance(item.balance.toString());
    setInterestRate(item.interestRate.toString());
    setMonthlyPayment(item.monthlyPayment.toString());
    setDueDateDay(item.dueDateDay.toString());
    setNotes(item.notes || '');
    setIsDebtModalOpen(true);
  };

  const handleSaveDebt = (e: React.FormEvent) => {
    e.preventDefault();
    const bal = parseFloat(balance.replace(',', '.'));
    const payment = monthlyPayment ? parseFloat(monthlyPayment.replace(',', '.')) : Math.round(bal * 0.1);
    const rate = parseFloat(interestRate.replace(',', '.')) || 0;
    if (isNaN(bal) || bal < 0) return;

    if (editingDebt) {
      updateDebt({
        ...editingDebt,
        creditor,
        balance: bal,
        interestRate: rate,
        monthlyPayment: payment,
        dueDateDay: parseInt(dueDateDay) || 10,
        notes,
      });
    } else {
      addDebt({
        creditor: creditor || 'Dívida',
        balance: bal,
        initialBalance: bal,
        interestRate: rate,
        monthlyPayment: payment,
        dueDateDay: parseInt(dueDateDay) || 10,
        notes,
      });
    }
    setIsDebtModalOpen(false);
  };

  // Handlers for Amortization
  const handleOpenAmortize = (debt: DebtItem) => {
    setTargetDebtToAmortize(debt);
    setAmortizeAmountInput(freeBalance > 0 ? Math.round(freeBalance).toString() : '200');
    setIsAmortizeModalOpen(true);
  };

  const handleConfirmAmortize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetDebtToAmortize) return;
    const amount = parseFloat(amortizeAmountInput.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) return;

    amortizeDebt(targetDebtToAmortize.id, amount);
    setIsAmortizeModalOpen(false);
    setTargetDebtToAmortize(null);
  };

  // Bola de Neve Calculation
  // Simula o tempo total para quitar todas as dívidas com e sem aporte extra
  const extraVal = parseFloat(extraPaymentSim.replace(',', '.')) || 0;

  const calculateSnowballProjection = (extraMonthly: number) => {
    if (activeDebts.length === 0) return { totalMonths: 0, estimatedDate: new Date() };

    // Clona dívidas
    let debtsCopy = activeDebts.map((d) => ({
      ...d,
      currentBal: d.balance,
      originalPayment: d.monthlyPayment,
    }));

    let months = 0;
    let releasedPayments = 0; // bola de neve acumulada
    const maxMonths = 360;

    while (debtsCopy.some((d) => d.currentBal > 0) && months < maxMonths) {
      months++;

      // A menor dívida ativa recebe toda a bola de neve (parcelas liberadas + aporte extra)
      const currentTargetIndex = debtsCopy.findIndex((d) => d.currentBal > 0);
      if (currentTargetIndex === -1) break;

      debtsCopy = debtsCopy.map((d, index) => {
        if (d.currentBal <= 0) return d;

        // Juros simples mensal aproximado
        const monthlyInterest = (d.currentBal * (d.interestRate / 100));
        let paymentToApply = d.originalPayment;

        if (index === currentTargetIndex) {
          // Recebe o efeito bola de neve total
          paymentToApply += releasedPayments + extraMonthly;
        }

        const newBal = Math.max(0, d.currentBal + monthlyInterest - paymentToApply);

        // Se zerou nesta rodada, a parcela original vai para a bola de neve!
        if (newBal === 0 && d.currentBal > 0) {
          releasedPayments += d.originalPayment;
        }

        return {
          ...d,
          currentBal: newBal,
        };
      });
    }

    const projectedDate = new Date();
    projectedDate.setMonth(projectedDate.getMonth() + months);

    return {
      totalMonths: months,
      estimatedDate: projectedDate,
    };
  };

  const normalProjection = calculateSnowballProjection(0);
  const acceleratedProjection = calculateSnowballProjection(extraVal);

  const monthsSaved = Math.max(0, normalProjection.totalMonths - acceleratedProjection.totalMonths);

  // Formata data estimada
  const formatMonthYear = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(date);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header do Módulo */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-700 dark:text-rose-400 uppercase tracking-wider mb-1">
            <LockKeyholeOpen className="w-4 h-4" />
            <span>Módulo 4: Rota de Quitação & Quebra de Jugo</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1b4332] dark:text-[#e9d8a6]">
            Estratégia Bola de Neve Bíblica
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Destrua a escravidão das dívidas ordenadas pelo menor saldo devedor (Provérbios 22:7)
          </p>
        </div>

        <button
          onClick={handleOpenAddDebt}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Cadastrar Nova Dívida</span>
        </button>
      </div>

      {/* 1º ALVO DE ATAQUE (Destaque Dourado/Rubi) */}
      {topDebt ? (
        <div className="p-6 sm:p-8 rounded-2xl border-2 border-rose-400 dark:border-rose-800/80 bg-gradient-to-br from-white via-rose-50/40 to-[#fff8f6] dark:from-[#1b1517] dark:via-[#201518] dark:to-[#171214] shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                <Flame className="w-4 h-4" />
                <span>1º Alvo Prioritário de Ataque</span>
                <span aria-hidden="true">·</span>
                <span>Menor Saldo da Bola de Neve</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 dark:text-white">
                {topDebt.creditor}
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl leading-relaxed">
                Por que atacar esta primeiro? O menor saldo devedor traz a <strong>primeira vitória rápida psicológica e espiritual</strong>.
                Assim que você zerar os <strong className="text-stone-900 dark:text-white">{formatCurrency(topDebt.balance)}</strong> desta dívida, a parcela de <strong className="text-emerald-700 dark:text-emerald-400">{formatCurrency(topDebt.monthlyPayment)}</strong> que você pagava nela será somada integralmente para pulverizar a próxima dívida!
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-stone-600 dark:text-stone-300 pt-1">
                <span>Saldo Atual: <strong className="text-rose-700 dark:text-rose-400 font-bold">{formatCurrency(topDebt.balance)}</strong></span>
                <span aria-hidden="true">·</span>
                <span>Juros: <strong className="text-stone-900 dark:text-white">{topDebt.interestRate}% ao mês</strong></span>
                <span aria-hidden="true">·</span>
                <span>Parcela Mínima: <strong className="text-stone-900 dark:text-white">{formatCurrency(topDebt.monthlyPayment)}/mês</strong></span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 shrink-0">
              <button
                onClick={() => handleOpenAmortize(topDebt)}
                className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-xl shadow-md transition-colors"
              >
                <Coins className="w-4 h-4" />
                <span>Amortizar / Abater Saldo</span>
              </button>
              {freeBalance > 0 && (
                <button
                  onClick={() => {
                    setTargetDebtToAmortize(topDebt);
                    setAmortizeAmountInput(Math.round(freeBalance).toString());
                    setIsAmortizeModalOpen(true);
                  }}
                  className="px-4 py-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-100/70 dark:bg-emerald-950/60 hover:bg-emerald-200/80 rounded-lg transition-colors text-center border border-emerald-300 dark:border-emerald-800"
                >
                  Abater com Sobra ({formatCurrency(freeBalance)})
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-2xl border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-emerald-900 dark:text-emerald-200">
            {paidDebts.length > 0
              ? 'Você Está Totalmente Livre do Jugo das Dívidas!'
              : 'Nenhuma Dívida Cadastrada'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-800 dark:text-emerald-300 max-w-lg mx-auto leading-relaxed">
            {paidDebts.length > 0
              ? '“A ninguém fiqueis devendo coisa alguma, a não ser o amor.” (Romanos 13:8). Sua terra está limpa e todas as suas obrigações foram pagas!'
              : 'Se você possui cartões rotativos, empréstimos ou financiamentos, clique em "+ Cadastrar Nova Dívida" para que o Método José organize seu plano de ataque. Caso não tenha dívidas, glorifique a Deus por sua liberdade financeira!'}
          </p>
        </div>
      )}

      {/* CALCULADORA DA LIBERDADE FINANCEIRA & PROJEÇÃO DA DATA */}
      {activeDebts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Card: Projeção de Independência */}
          <div className="md:col-span-7 p-6 rounded-xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c] shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1b4332] dark:text-[#d4a373] flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Calculadora da Independência Financeira
              </span>
              <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
                Data Prevista para a Quebra Total do Jugo
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Considerando as parcelas atuais ({formatCurrency(totalDebtMonthlyPayment)}/mês) e a soma progressiva das parcelas libertadas pelo método bola de neve:
              </p>

              <div className="p-4 bg-stone-50 dark:bg-[#121c17] rounded-xl border border-[#e5e0d8] dark:border-[#22332a] space-y-2">
                <div className="flex items-baseline justify-between flex-wrap gap-2">
                  <span className="text-xs text-stone-500">Data da Independência:</span>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-[#1b4332] dark:text-[#e9d8a6] capitalize">
                    {formatMonthYear(acceleratedProjection.estimatedDate)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                  <span>Tempo estimado:</span>
                  <strong className="text-stone-900 dark:text-stone-100">
                    {acceleratedProjection.totalMonths} meses restantes
                  </strong>
                </div>
                {monthsSaved > 0 && (
                  <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 pt-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Você antecipou {monthsSaved} meses aplicando amortização extra!</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#e5e0d8] dark:border-[#22332a] flex items-center justify-between text-xs font-mono">
              <span className="text-stone-500">Saldo Devedor Consolidado:</span>
              <strong className="text-rose-700 dark:text-rose-400 font-bold text-sm">
                {formatCurrency(totalDebtBalance)}
              </strong>
            </div>
          </div>

          {/* Card: Simulador de Amortização Extra */}
          <div className="md:col-span-5 p-6 rounded-xl border border-[#c59b27]/30 bg-gradient-to-b from-white to-[#fcfaf5] dark:from-[#16231c] dark:to-[#1a261f] shadow-xs space-y-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#8f6b0f] dark:text-[#d4a373] flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4" />
                Simulador de Aceleração
              </span>
              <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100 mt-1">
                Aporte Extra no 1º Alvo
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 mt-1">
                Se você destinar uma sobra mensal para amortizar o 1º Alvo:
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="50"
                  value={extraPaymentSim}
                  onChange={(e) => setExtraPaymentSim(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono font-medium bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                />
                {freeBalance > 0 && (
                  <button
                    type="button"
                    onClick={() => setExtraPaymentSim(Math.round(freeBalance).toString())}
                    className="px-2.5 py-2 text-xs font-semibold whitespace-nowrap bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg border border-emerald-200"
                  >
                    Sobra
                  </button>
                )}
              </div>
              <span className="text-[11px] text-stone-400 block">
                Valor extra aplicado sobre a parcela mensal
              </span>
            </div>

            <div className="p-3 bg-white/70 dark:bg-black/20 rounded-lg border border-[#e5e0d8] dark:border-[#22332a] text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-stone-500">Sem Aporte Extra:</span>
                <span className="font-mono text-stone-700 dark:text-stone-300">
                  {normalProjection.totalMonths} meses
                </span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-emerald-700 dark:text-emerald-400">Com Aporte Extra:</span>
                <span className="font-mono text-emerald-700 dark:text-emerald-400">
                  {acceleratedProjection.totalMonths} meses
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QUADRO DE DÍVIDAS ATIVAS (Ordenadas pelo Menor Saldo) */}
      <div className="rounded-xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c] overflow-hidden">
        <div className="p-5 border-b border-[#e5e0d8] dark:border-[#22332a] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-base font-bold text-[#1b4332] dark:text-[#e9d8a6]">
              Fila de Ataque da Bola de Neve
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Ordenadas automaticamente pelo menor saldo devedor para vitórias imediatas
            </p>
          </div>
          <span className="text-xs font-mono text-stone-500">
            {activeDebts.length} dívida(s) ativa(s)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#e5e0d8] dark:border-[#22332a] bg-stone-50/60 dark:bg-[#121c17]/60 text-stone-500 dark:text-stone-400">
                <th className="py-3 px-4 font-semibold w-16 text-center">Fila</th>
                <th className="py-3 px-4 font-semibold">Credor / Obrigação</th>
                <th className="py-3 px-4 font-semibold text-right">Saldo Devedor (R$)</th>
                <th className="py-3 px-4 font-semibold text-right">Taxa Juros</th>
                <th className="py-3 px-4 font-semibold text-right">Parcela Atual</th>
                <th className="py-3 px-4 font-semibold text-center">Vencimento</th>
                <th className="py-3 px-4 font-semibold text-center w-28">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e0d8] dark:divide-[#22332a]">
              {activeDebts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-500">
                    <p className="font-medium text-stone-700 dark:text-stone-300 text-sm">
                      Nenhuma dívida cadastrada na fila
                    </p>
                    <p className="text-xs text-stone-400 mt-1">
                      Clique em "+ Cadastrar Nova Dívida" se tiver obrigações pendentes para quebrar o jugo.
                    </p>
                  </td>
                </tr>
              ) : (
                activeDebts.map((debt, index) => {
                  const isTarget = index === 0;
                  return (
                    <tr
                      key={debt.id}
                      className={`transition-colors ${
                        isTarget
                          ? 'bg-rose-50/40 dark:bg-rose-950/20 font-medium'
                          : 'hover:bg-stone-50/50 dark:hover:bg-[#1b2b22]/40'
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            isTarget
                              ? 'bg-rose-600 text-white'
                              : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-stone-900 dark:text-stone-100">
                            {debt.creditor}
                          </span>
                          {isTarget && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                              1º Alvo
                            </span>
                          )}
                        </div>
                        {debt.notes && (
                          <span className="text-[11px] text-stone-400 block">{debt.notes}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-rose-700 dark:text-rose-400">
                        {formatCurrency(debt.balance)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-600 dark:text-stone-300">
                        {debt.interestRate}% a.m.
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-900 dark:text-stone-100">
                        {formatCurrency(debt.monthlyPayment)}
                      </td>
                      <td className="py-3 px-4 text-center font-mono tabular-nums text-stone-500">
                        Dia {debt.dueDateDay}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenAmortize(debt)}
                            title="Amortizar Dívida"
                            className="px-2 py-1 text-[11px] font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded transition-colors"
                          >
                            Abater
                          </button>
                          <button
                            onClick={() => handleOpenEditDebt(debt)}
                            title="Editar"
                            className="p-1 rounded text-stone-400 hover:text-stone-700"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteDebt(debt.id)}
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
                  Total de Dívidas a Liquidar
                </td>
                <td className="py-3 px-4 text-right font-mono tabular-nums text-rose-700 dark:text-rose-400 text-sm">
                  {formatCurrency(totalDebtBalance)}
                </td>
                <td />
                <td className="py-3 px-4 text-right font-mono tabular-nums text-stone-900 dark:text-stone-100">
                  {formatCurrency(totalDebtMonthlyPayment)}/mês
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* DÍVIDAS JÁ QUITADAS (Vitórias & Celebração) */}
      {paidDebts.length > 0 && (
        <div className="p-5 rounded-xl border border-emerald-200 dark:border-emerald-950/60 bg-emerald-50/30 dark:bg-emerald-950/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
            <CheckCircle2 className="w-4 h-4" />
            <span>Dívidas Já Liquidadas (Jugo Quebrado)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {paidDebts.map((pd) => (
              <div
                key={pd.id}
                className="p-3 bg-white dark:bg-[#16231c] rounded-lg border border-emerald-200 dark:border-emerald-900 text-xs flex justify-between items-center"
              >
                <div>
                  <span className="font-semibold text-stone-900 dark:text-stone-100 block line-through">
                    {pd.creditor}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-medium">
                    Parcela de {formatCurrency(pd.monthlyPayment)} incorporada à bola de neve!
                  </span>
                </div>
                <button
                  onClick={() => deleteDebt(pd.id)}
                  title="Remover do histórico"
                  className="text-stone-400 hover:text-rose-500 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: AMORTIZAR DÍVIDA */}
      {isAmortizeModalOpen && targetDebtToAmortize && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#fbf9f5] dark:bg-[#16231c] rounded-2xl shadow-xl border border-rose-300 dark:border-rose-900 p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <Coins className="w-5 h-5" />
              <h3 className="font-serif text-lg font-bold">Amortizar Dívida / Quebrar Jugo</h3>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Credor: <strong>{targetDebtToAmortize.creditor}</strong>
              <br />
              Saldo Devedor Atual: <strong>{formatCurrency(targetDebtToAmortize.balance)}</strong>
            </p>

            <form onSubmit={handleConfirmAmortize} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Valor a Amortizar / Pagar Agora (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  autoFocus
                  max={targetDebtToAmortize.balance}
                  value={amortizeAmountInput}
                  onChange={(e) => setAmortizeAmountInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-mono font-medium bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                />
              </div>

              <div className="flex gap-2 text-xs">
                {freeBalance > 0 && (
                  <button
                    type="button"
                    onClick={() => setAmortizeAmountInput(Math.min(targetDebtToAmortize.balance, freeBalance).toString())}
                    className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200"
                  >
                    Usar Sobra Livre ({formatCurrency(freeBalance)})
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setAmortizeAmountInput(targetDebtToAmortize.balance.toString())}
                  className="px-2.5 py-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                >
                  Liquidar Total
                </button>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAmortizeModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg"
                >
                  Confirmar Amortização
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CRIAR / EDITAR DÍVIDA */}
      {isDebtModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#fbf9f5] dark:bg-[#16231c] rounded-2xl shadow-xl border border-[#e5e0d8] dark:border-[#2b4136] p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-stone-100">
              {editingDebt ? 'Editar Dívida' : 'Cadastrar Dívida na Fila'}
            </h3>
            <form onSubmit={handleSaveDebt} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Credor / Descrição da Dívida
                </label>
                <input
                  type="text"
                  required
                  value={creditor}
                  onChange={(e) => setCreditor(e.target.value)}
                  placeholder="Ex: Cartão de Crédito, Empréstimo..."
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Saldo Devedor (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-mono bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Parcela Atual (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(e.target.value)}
                    placeholder="Ex: 250,00"
                    className="w-full px-3.5 py-2 text-sm font-mono bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Juros (% ao mês)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm font-mono bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    Dia do Vencimento
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={dueDateDay}
                    onChange={(e) => setDueDateDay(e.target.value)}
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
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Contrato número 123..."
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDebtModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded-lg"
                >
                  Salvar Dívida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
