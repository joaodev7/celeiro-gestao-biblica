import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { BARN_STAGES } from '../data/mockData';
import {
  Wheat,
  ShieldCheck,
  PlusCircle,
  MinusCircle,
  HelpCircle,
  Lock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  Crown,
  Anchor,
  Shield,
  Warehouse,
  Edit3,
} from 'lucide-react';

export const CeleiroView: React.FC = () => {
  const {
    barnSavings,
    essentialExpenses,
    effectiveEssentialCost,
    peaceIndexMonths,
    depositToBarn,
    withdrawFromBarn,
    setBarnSavingsManual,
    setCustomEssentialTarget,
    freeBalance,
    setActiveTab,
  } = useApp();

  // Modals state
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

  const [depositAmount, setDepositAmount] = useState('');
  const [depositReason, setDepositReason] = useState('Aporte no Silo de José');

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawReason, setWithdrawReason] = useState('');

  const [manualSavingsInput, setManualSavingsInput] = useState(barnSavings.toString());
  const [targetCostInput, setTargetCostInput] = useState(
    effectiveEssentialCost > 0 ? effectiveEssentialCost.toString() : '2500'
  );

  // Simulador de Aporte
  const [monthlyContributionSim, setMonthlyContributionSim] = useState(
    freeBalance > 0 ? Math.round(freeBalance).toString() : '500'
  );

  // Helper for icons
  const getStageIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return Shield;
      case 'Wheat':
        return Wheat;
      case 'Anchor':
        return Anchor;
      case 'Warehouse':
        return Warehouse;
      case 'Crown':
        return Crown;
      default:
        return Wheat;
    }
  };

  // Metas em R$ de cada estágio com base no custo essencial efetivo
  const stagesWithValues = BARN_STAGES.map((stage) => {
    const targetAmount = effectiveEssentialCost > 0 ? stage.monthsRequired * effectiveEssentialCost : 0;
    const isCompleted = targetAmount > 0 && barnSavings >= targetAmount;
    const progressPercent =
      targetAmount > 0 ? Math.min(100, Math.round((barnSavings / targetAmount) * 100)) : 0;
    const remainingAmount = Math.max(0, targetAmount - barnSavings);

    return {
      ...stage,
      targetAmount,
      isCompleted,
      progressPercent,
      remainingAmount,
    };
  });

  // Próximo Silo a ser atingido
  const nextTargetStage =
    stagesWithValues.find((s) => !s.isCompleted) ||
    stagesWithValues[stagesWithValues.length - 1];

  // Cálculo da simulação de tempo para o próximo silo
  const simVal = parseFloat(monthlyContributionSim.replace(',', '.')) || 0;
  const monthsToNextTarget =
    simVal > 0 && nextTargetStage && !nextTargetStage.isCompleted && nextTargetStage.remainingAmount > 0
      ? Math.ceil(nextTargetStage.remainingAmount / simVal)
      : null;

  // Handlers
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depositAmount.replace(',', '.'));
    if (isNaN(val) || val <= 0) return;
    depositToBarn(val, depositReason || 'Aporte Estratégico no Celeiro');
    setDepositAmount('');
    setIsDepositModalOpen(false);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(withdrawAmount.replace(',', '.'));
    if (isNaN(val) || val <= 0) return;
    withdrawFromBarn(val, withdrawReason || 'Retirada de Emergência');
    setWithdrawAmount('');
    setWithdrawReason('');
    setIsWithdrawModalOpen(false);
  };

  const handleManualSavingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(manualSavingsInput.replace(',', '.'));
    if (isNaN(val) || val < 0) return;
    setBarnSavingsManual(val);
    setIsEditModalOpen(false);
  };

  const handleTargetCostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(targetCostInput.replace(',', '.'));
    if (isNaN(val) || val <= 0) return;
    setCustomEssentialTarget(val);
    setIsTargetModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header do Celeiro */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1b4332] dark:text-[#d4a373] uppercase tracking-wider mb-1">
            <Wheat className="w-4 h-4 text-[#c59b27]" />
            <span>Módulo 3: O Celeiro Estratégico</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1b4332] dark:text-[#e9d8a6]">
            A Reserva de José nos Anos de Fartura
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Armazenamento planejado de grãos para garantir sobrevivência e paz familiar (Gênesis 41:35-36)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsWithdrawModalOpen(true)}
            disabled={barnSavings <= 0}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-[#1a2922] border border-[#e5e0d8] dark:border-[#2b4136] hover:border-rose-400 rounded-lg shadow-xs transition-colors disabled:opacity-50"
          >
            <MinusCircle className="w-4 h-4 text-stone-400" />
            <span>Resgatar Emergência</span>
          </button>
          <button
            onClick={() => setIsDepositModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#1b4332] dark:bg-[#2d6a4f] hover:bg-[#255741] rounded-lg shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-[#d4a373]" />
            <span>Aportar Grãos no Celeiro</span>
          </button>
        </div>
      </div>

      {/* Banner de Aviso caso o Custo Essencial ainda não tenha sido definido */}
      {effectiveEssentialCost <= 0 && (
        <div className="p-5 rounded-xl border border-amber-300 dark:border-amber-800/60 bg-amber-50/70 dark:bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-serif text-sm font-bold text-amber-900 dark:text-amber-200">
              Defina o Custo Essencial Mensal da sua Tenda
            </h3>
            <p className="text-xs text-amber-800 dark:text-amber-300">
              Para calibrar o tamanho de cada Silo de José (1, 3, 6 e 12 meses), cadastre suas despesas essenciais no Diagnóstico ou defina uma estimativa agora:
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTargetModalOpen(true)}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#1b4332] dark:bg-[#2d6a4f] rounded-lg shadow-xs whitespace-nowrap"
            >
              Definir Estimativa
            </button>
            <button
              onClick={() => setActiveTab('diagnostico')}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 dark:text-stone-300 bg-white dark:bg-[#16231c] border border-amber-300 dark:border-amber-800 rounded-lg whitespace-nowrap"
            >
              Ir ao Diagnóstico
            </button>
          </div>
        </div>
      )}

      {/* Cartão de Destaque Monumental: ÍNDICE DE PAZ */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1b4332] via-[#21533e] to-[#12281e] text-white p-6 sm:p-10 border border-[#2d6a4f]/50 shadow-sm">
        {/* Grain background decoration */}
        <div className="absolute right-4 bottom-2 opacity-10 pointer-events-none select-none text-9xl font-serif">
          🌾
        </div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#d4a373] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Métrica Central de Segurança Bíblica
            </span>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#fbf9f5]">
                {peaceIndexMonths} {peaceIndexMonths === 1 ? 'Mês' : 'Meses'}
              </h2>
              <span className="text-base sm:text-lg font-medium text-[#d4a373]">
                de Índice de Paz Cobertos
              </span>
            </div>
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              {peaceIndexMonths > 0 ? (
                <>
                  Sua família consegue manter todos os custos essenciais da tenda por{' '}
                  <strong className="text-white font-semibold">{peaceIndexMonths} meses</strong> completos sem qualquer nova entrada
                  de renda. A tranquilidade da casa do sábio (Provérbios 21:20).
                </>
              ) : (
                <>
                  Seu Celeiro está pronto para receber os primeiros grãos. Conforme você armazena reservas, seu Índice de Paz crescerá até cobrir meses inteiros de tranquilidade familiar.
                </>
              )}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-stone-300 font-mono">
              <div>
                <span>Reserva Atual: </span>
                <strong className="text-white">{formatCurrency(barnSavings)}</strong>
              </div>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1.5">
                <span>Custo Essencial/Mês: </span>
                <strong className="text-white">{formatCurrency(effectiveEssentialCost)}</strong>
                <button
                  onClick={() => setIsTargetModalOpen(true)}
                  title="Alterar custo essencial base"
                  className="text-[#d4a373] hover:underline"
                >
                  <Edit3 className="w-3.5 h-3.5 inline ml-1" />
                </button>
              </div>
            </div>
          </div>

          {/* Mini-card de Status do Próximo Silo */}
          <div className="lg:col-span-5 bg-black/25 backdrop-blur-md rounded-xl p-5 border border-white/10 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#d4a373] font-semibold uppercase tracking-wider">
                Próximo Silo a Conquistar
              </span>
              <button
                onClick={() => {
                  setManualSavingsInput(barnSavings.toString());
                  setIsEditModalOpen(true);
                }}
                className="text-[11px] text-stone-400 hover:text-white underline"
              >
                Editar Saldo
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-white">
                {nextTargetStage?.name}
              </h3>
              <p className="text-xs text-stone-300">
                {effectiveEssentialCost > 0
                  ? `Meta: ${formatCurrency(nextTargetStage?.targetAmount || 0)} (${nextTargetStage?.monthsRequired} meses)`
                  : 'Aguardando definição do custo essencial'}
              </p>
            </div>

            {/* Barra de Progresso do Próximo Silo */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-stone-300 font-mono">
                <span>Progresso do Silo</span>
                <span className="font-bold text-[#e9d8a6]">
                  {nextTargetStage?.progressPercent}%
                </span>
              </div>
              <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  style={{ width: `${nextTargetStage?.progressPercent || 0}%` }}
                  className="h-full bg-gradient-to-r from-[#c59b27] to-[#e9d8a6] transition-all rounded-full"
                />
              </div>
              <div className="text-[11px] text-stone-300 flex justify-between">
                <span>Acumulado: {formatCurrency(barnSavings)}</span>
                <span className="text-[#d4a373] font-semibold">
                  {effectiveEssentialCost > 0
                    ? `Faltam ${formatCurrency(nextTargetStage?.remainingAmount || 0)}`
                    : 'Defina o custo essencial'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ESTÁGIOS DO CELEIRO (Silos Progressivos) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#c59b27] uppercase tracking-wider">
              A Fortaleza em Etapas
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1b4332] dark:text-[#e9d8a6]">
              Os 5 Silos do Celeiro Estratégico
            </h2>
          </div>
          <span className="text-xs text-stone-500 hidden sm:inline">
            Custo Essencial Base: {formatCurrency(effectiveEssentialCost)}/mês
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stagesWithValues.map((stage) => {
            const Icon = getStageIcon(stage.iconName);
            return (
              <div
                key={stage.id}
                className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  stage.isCompleted
                    ? 'border-emerald-300 dark:border-emerald-800/80 bg-white dark:bg-[#16231c] shadow-xs'
                    : stage.progressPercent > 0
                    ? 'border-[#c59b27] dark:border-[#c59b27]/70 bg-white dark:bg-[#16231c] ring-1 ring-[#c59b27]/30 shadow-xs'
                    : 'border-[#e5e0d8] dark:border-[#22332a] bg-stone-50/60 dark:bg-[#121c17]/60 opacity-80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        stage.isCompleted
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400'
                          : stage.progressPercent > 0
                          ? 'bg-[#c59b27]/20 text-[#8f6b0f] dark:text-[#d4a373]'
                          : 'bg-stone-200 dark:bg-stone-800 text-stone-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {stage.isCompleted ? (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" />
                        Concluído
                      </span>
                    ) : stage.progressPercent > 0 ? (
                      <span className="text-xs font-semibold text-[#8f6b0f] dark:text-[#d4a373]">
                        Em Progresso ({stage.progressPercent}%)
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-stone-400">
                        <Lock className="w-3.5 h-3.5" />
                        Aguardando
                      </span>
                    )}
                  </div>

                  <h3 className="font-serif text-base font-bold text-stone-900 dark:text-stone-100">
                    {stage.name}
                  </h3>
                  <span className="text-xs font-semibold text-[#8f6b0f] dark:text-[#d4a373] block mb-2">
                    {stage.subtitle}
                  </span>
                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed mb-4">
                    {stage.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#e5e0d8] dark:border-[#22332a] space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-500">Meta do Silo:</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-stone-100 tabular-nums">
                      {effectiveEssentialCost > 0 ? formatCurrency(stage.targetAmount) : '—'}
                    </span>
                  </div>

                  {/* Barra do Silo */}
                  <div className="h-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${stage.progressPercent}%` }}
                      className={`h-full rounded-full transition-all ${
                        stage.isCompleted
                          ? 'bg-emerald-600'
                          : stage.progressPercent > 0
                          ? 'bg-[#c59b27]'
                          : 'bg-stone-300 dark:bg-stone-700'
                      }`}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-stone-500">
                    <span>{stage.monthsRequired} {stage.monthsRequired === 1 ? 'mês' : 'meses'}</span>
                    {!stage.isCompleted && effectiveEssentialCost > 0 && (
                      <span className="text-[#8f6b0f] dark:text-[#d4a373]">
                        Faltam {formatCurrency(stage.remainingAmount)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SIMULADOR DE APORTE NO CELEIRO */}
      <div className="p-6 rounded-2xl border border-[#c59b27]/30 bg-gradient-to-r from-white via-[#fcfaf5] to-[#fbf8f0] dark:from-[#16231c] dark:via-[#192720] dark:to-[#17221a] shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#8f6b0f] dark:text-[#d4a373] uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Simulador de Provisão</span>
        </div>
        <h3 className="font-serif text-lg font-bold text-[#1b4332] dark:text-[#e9d8a6] mb-1">
          Aceleração do Seu Próximo Silo
        </h3>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mb-4">
          Descubra quantos meses faltam para encher o próximo silo com base no valor que você decidir guardar mensalmente.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-5 space-y-1">
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300">
              Aporte Mensal Previsto no Celeiro (R$)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="50"
                value={monthlyContributionSim}
                onChange={(e) => setMonthlyContributionSim(e.target.value)}
                className="w-full px-3.5 py-2 text-sm font-mono font-medium bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
              />
              {freeBalance > 0 && (
                <button
                  type="button"
                  onClick={() => setMonthlyContributionSim(Math.round(freeBalance).toString())}
                  className="px-2.5 py-2 text-xs font-semibold whitespace-nowrap bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg border border-emerald-200"
                >
                  Usar Sobra
                </button>
              )}
            </div>
          </div>

          <div className="sm:col-span-7 p-4 bg-white/70 dark:bg-black/20 rounded-xl border border-[#e5e0d8] dark:border-[#2b4136]">
            {nextTargetStage && !nextTargetStage.isCompleted && monthsToNextTarget !== null ? (
              <div className="space-y-1">
                <span className="text-xs text-stone-500">Projeção para conquistar o {nextTargetStage.name}:</span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-bold text-[#1b4332] dark:text-[#d4a373] tabular-nums">
                    {monthsToNextTarget} {monthsToNextTarget === 1 ? 'mês' : 'meses'}
                  </span>
                  <span className="text-xs text-stone-500">
                    (guardando {formatCurrency(simVal)} todo mês)
                  </span>
                </div>
                <p className="text-[11px] text-stone-500">
                  Total restante para o silo: <strong>{formatCurrency(nextTargetStage.remainingAmount)}</strong>
                </p>
              </div>
            ) : nextTargetStage?.isCompleted ? (
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#c59b27]" />
                <span>Glória a Deus! Você completou os silos com excelência exemplar!</span>
              </div>
            ) : (
              <div className="text-xs text-stone-500">
                Defina o aporte mensal e o custo essencial para calcular o tempo estimado.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL: DEFINIR CUSTO ESSENCIAL BASE */}
      {isTargetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#fbf9f5] dark:bg-[#16231c] rounded-2xl shadow-xl border border-[#e5e0d8] dark:border-[#2b4136] p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#1b4332] dark:text-[#e9d8a6]">
              Custo Essencial Mensal da Tenda
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Informe quanto sua família gasta mensalmente com o básico (moradia, comida, saúde, água e luz) para calibrar os Silos do Celeiro.
            </p>

            <form onSubmit={handleTargetCostSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Custo Essencial Mensal (R$)
                </label>
                <input
                  type="number"
                  step="50"
                  required
                  autoFocus
                  value={targetCostInput}
                  onChange={(e) => setTargetCostInput(e.target.value)}
                  placeholder="Ex: 2500,00"
                  className="w-full px-3.5 py-2 text-sm font-mono font-medium bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTargetModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1b4332] dark:bg-[#2d6a4f] rounded-lg"
                >
                  Salvar Custo Base
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: APORTAR NO CELEIRO */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#fbf9f5] dark:bg-[#16231c] rounded-2xl shadow-xl border border-[#e5e0d8] dark:border-[#2b4136] p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#1b4332] dark:text-[#e9d8a6]">
              <Wheat className="w-5 h-5 text-[#c59b27]" />
              <h3 className="font-serif text-lg font-bold">Aportar Grãos no Celeiro</h3>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Guarde uma porção da sua colheita como fez José no Egito (Gênesis 41:34).
            </p>

            <form onSubmit={handleDepositSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Valor do Aporte (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  autoFocus
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-3.5 py-2 text-sm font-mono font-medium bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Motivo / Observação
                </label>
                <input
                  type="text"
                  value={depositReason}
                  onChange={(e) => setDepositReason(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDepositModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1b4332] dark:bg-[#2d6a4f] rounded-lg"
                >
                  Confirmar Aporte
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESGATE DE EMERGÊNCIA */}
      {isWithdrawModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#fbf9f5] dark:bg-[#16231c] rounded-2xl shadow-xl border border-rose-300 dark:border-rose-900 p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-serif text-lg font-bold">Retirada de Emergência Real</h3>
            </div>
            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              <strong>Atenção:</strong> O Celeiro de José não deve ser aberto para caprichos, viagens ou consumo. Ele existe
              exclusivamente para preservar a sobrevivência da tenda em tempos de real necessidade.
            </p>

            <form onSubmit={handleWithdrawSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Valor a Retirar (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  autoFocus
                  max={barnSavings}
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-3.5 py-2 text-sm font-mono font-medium bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Qual a emergência comprovada?
                </label>
                <input
                  type="text"
                  required
                  value={withdrawReason}
                  onChange={(e) => setWithdrawReason(e.target.value)}
                  placeholder="Ex: Tratamento médico urgente, conserto essencial"
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg"
                >
                  Confirmar Retirada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIÇÃO MANUAL DO SALDO */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#fbf9f5] dark:bg-[#16231c] rounded-2xl shadow-xl border border-[#e5e0d8] dark:border-[#2b4136] p-6 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#1b4332] dark:text-[#e9d8a6]">
              Ajustar Saldo Total do Celeiro
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-300">
              Atualize o valor acumulado em poupança, tesouro direto ou aplicação de alta liquidez.
            </p>

            <form onSubmit={handleManualSavingsSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Saldo Total Acumulado (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={manualSavingsInput}
                  onChange={(e) => setManualSavingsInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm font-mono font-medium bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#1b4332] dark:bg-[#2d6a4f] rounded-lg"
                >
                  Salvar Saldo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
