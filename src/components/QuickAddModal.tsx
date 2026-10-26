import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ArrowDownRight, ArrowUpRight, ShieldAlert, Wheat } from 'lucide-react';
import { ExpenseCategory } from '../types';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'receita' | 'despesa' | 'divida' | 'celeiro';
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'despesa',
}) => {
  const { addIncome, addExpense, addDebt, depositToBarn } = useApp();
  const [modalType, setModalType] = useState<'receita' | 'despesa' | 'divida' | 'celeiro'>(defaultType);

  // Form states
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [actualAmount, setActualAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('essencial');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  // Debt specific states
  const [interestRate, setInterestRate] = useState('2.5');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [dueDateDay, setDueDateDay] = useState('10');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount.replace(',', '.'));
    if (isNaN(val) || val <= 0) return;

    if (modalType === 'receita') {
      const actVal = actualAmount ? parseFloat(actualAmount.replace(',', '.')) : val;
      addIncome({
        description: description || 'Receita da Colheita',
        plannedAmount: val,
        actualAmount: isNaN(actVal) ? val : actVal,
        date,
        category: 'Renda Geral',
        notes,
      });
    } else if (modalType === 'despesa') {
      const actVal = actualAmount ? parseFloat(actualAmount.replace(',', '.')) : val;
      addExpense({
        description: description || 'Despesa Geral',
        plannedAmount: val,
        actualAmount: isNaN(actVal) ? val : actVal,
        category,
        date,
        notes,
      });
    } else if (modalType === 'divida') {
      const paymentVal = monthlyPayment ? parseFloat(monthlyPayment.replace(',', '.')) : Math.round(val * 0.1);
      const interestVal = parseFloat(interestRate.replace(',', '.')) || 0;
      addDebt({
        creditor: description || 'Credor',
        balance: val,
        initialBalance: val,
        interestRate: interestVal,
        monthlyPayment: paymentVal,
        dueDateDay: parseInt(dueDateDay) || 10,
        notes,
      });
    } else if (modalType === 'celeiro') {
      depositToBarn(val, description || 'Aporte Manual no Celeiro');
    }

    // Reset and close
    setDescription('');
    setAmount('');
    setActualAmount('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#fbf9f5] dark:bg-[#16231c] rounded-2xl shadow-xl border border-[#e5e0d8] dark:border-[#2b4136] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e5e0d8] dark:border-[#22332a]">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#1b4332] dark:text-[#e9d8a6]">
              Novo Registro Financeiro
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Mantenha os limites da sua terra alinhados com sabedoria
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-[#1f3028] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="flex border-b border-[#e5e0d8] dark:border-[#22332a] bg-stone-100/50 dark:bg-[#121c17]/50 p-1">
          <button
            type="button"
            onClick={() => setModalType('despesa')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              modalType === 'despesa'
                ? 'bg-white dark:bg-[#1b4332] text-[#1b4332] dark:text-[#e9d8a6] shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <ArrowDownRight className="w-3.5 h-3.5 text-rose-500" />
            Despesa
          </button>
          <button
            type="button"
            onClick={() => setModalType('receita')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              modalType === 'receita'
                ? 'bg-white dark:bg-[#1b4332] text-[#1b4332] dark:text-[#e9d8a6] shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
            Receita
          </button>
          <button
            type="button"
            onClick={() => setModalType('celeiro')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              modalType === 'celeiro'
                ? 'bg-white dark:bg-[#1b4332] text-[#1b4332] dark:text-[#e9d8a6] shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <Wheat className="w-3.5 h-3.5 text-[#c59b27]" />
            Aporte Celeiro
          </button>
          <button
            type="button"
            onClick={() => setModalType('divida')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
              modalType === 'divida'
                ? 'bg-white dark:bg-[#1b4332] text-[#1b4332] dark:text-[#e9d8a6] shadow-sm'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            Dívida
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
              {modalType === 'divida' ? 'Nome do Credor / Dívida' : 'Descrição'}
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                modalType === 'despesa'
                  ? 'Ex: Supermercado Semanal, Aluguel, Dízimo...'
                  : modalType === 'receita'
                  ? 'Ex: Salário da Empresa, Consultoria Extra...'
                  : modalType === 'celeiro'
                  ? 'Ex: Depósito de Sobra Mensal no Silo'
                  : 'Ex: Cartão de Crédito, Empréstimo Familiar...'
              }
              className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#1b4332] dark:focus:ring-[#c59b27]"
            />
          </div>

          {/* Categoria para Despesa */}
          {modalType === 'despesa' && (
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                Princípio Bíblico / Categoria
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setCategory('primitias')}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    category === 'primitias'
                      ? 'border-[#c59b27] bg-[#fbf5e6] dark:bg-[#2b2414] text-[#8f6b0f] dark:text-[#e9d8a6] font-semibold'
                      : 'border-[#e5e0d8] dark:border-[#22332a] text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <span className="block font-medium">Primícias & Generosidade</span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">Dízimos, ofertas, ajuda</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('essencial')}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    category === 'essencial'
                      ? 'border-[#1b4332] bg-[#edf4f0] dark:bg-[#1a2d24] text-[#1b4332] dark:text-[#9fe2be] font-semibold'
                      : 'border-[#e5e0d8] dark:border-[#22332a] text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <span className="block font-medium">A Tenda (Essenciais)</span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">Moradia, comida, saúde</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('estilo')}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    category === 'estilo'
                      ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                      : 'border-[#e5e0d8] dark:border-[#22332a] text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <span className="block font-medium">Estilo de Vida & Lazer</span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">Restaurantes, assinaturas</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCategory('celeiro')}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    category === 'celeiro'
                      ? 'border-[#2d6a4f] bg-[#eef7f2] dark:bg-[#14291f] text-[#2d6a4f] dark:text-[#74c69d] font-semibold'
                      : 'border-[#e5e0d8] dark:border-[#22332a] text-stone-600 dark:text-stone-300'
                  }`}
                >
                  <span className="block font-medium">Aporte no Celeiro</span>
                  <span className="text-[10px] text-stone-500 dark:text-stone-400">Guardando no silo de José</span>
                </button>
              </div>
            </div>
          )}

          {/* Valores */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                {modalType === 'divida' ? 'Saldo Devedor Total (R$)' : 'Valor Previsto (R$)'}
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full px-3.5 py-2 text-sm font-mono font-medium bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#1b4332]"
              />
            </div>
            {modalType !== 'celeiro' && modalType !== 'divida' ? (
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Valor Realizado (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={actualAmount}
                  onChange={(e) => setActualAmount(e.target.value)}
                  placeholder="Se já foi pago/recebido"
                  className="w-full px-3.5 py-2 text-sm font-mono font-medium bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#1b4332]"
                />
              </div>
            ) : modalType === 'divida' ? (
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Parcela Mensal Atual (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={monthlyPayment}
                  onChange={(e) => setMonthlyPayment(e.target.value)}
                  placeholder="Ex: 250,00"
                  className="w-full px-3.5 py-2 text-sm font-mono font-medium bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#1b4332]"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Data do Depósito
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#1b4332]"
                />
              </div>
            )}
          </div>

          {/* Dívida: taxa de juros e vencimento */}
          {modalType === 'divida' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  Taxa de Juros Mensal (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="Ex: 12.5"
                  className="w-full px-3.5 py-2 text-sm font-mono bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#1b4332]"
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
                  className="w-full px-3.5 py-2 text-sm font-mono bg-white dark:bg-[#121c17] border border-[#e5e0d8] dark:border-[#2b4136] rounded-lg text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#1b4332]"
                />
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-[#1b4332] dark:bg-[#2d6a4f] hover:bg-[#235640] rounded-lg shadow-sm transition-colors"
            >
              Confirmar Registro
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
