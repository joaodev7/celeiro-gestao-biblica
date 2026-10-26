import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DEVOTIONALS } from '../data/mockData';
import { formatCurrency } from '../utils/formatters';
import {
  Compass,
  Wheat,
  ShieldCheck,
  Flame,
  ArrowRight,
  BookOpen,
  Sparkles,
  CheckCircle2,
  LockKeyholeOpen,
  Scale,
} from 'lucide-react';

export const WelcomeView: React.FC = () => {
  const {
    setActiveTab,
    totalIncomeActual,
    peaceIndexMonths,
    freeBalance,
    topDebt,
    essentialExpenses,
    barnSavings,
  } = useApp();

  const [devotionalIndex, setDevotionalIndex] = useState(0);
  const currentDevotional = DEVOTIONALS[devotionalIndex];

  const handleNextDevotional = () => {
    setDevotionalIndex((prev) => (prev + 1) % DEVOTIONALS.length);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Hero Banner: O Método José */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1b4332] via-[#24523e] to-[#132c21] text-white p-6 sm:p-10 border border-[#2d6a4f]/40 shadow-sm">
        {/* Decorative grain motifs */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none select-none">
          <span className="text-[180px] font-serif">🌾</span>
        </div>

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs tracking-wider uppercase text-[#d4a373] font-semibold">
            <Scale className="w-4 h-4" />
            <span>Princípios Eternos de Mordomia Cristã</span>
            <span aria-hidden="true">·</span>
            <span>Gênesis 41 & Provérbios</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight text-[#fbf9f5] leading-tight">
            O Método José de Gestão Financeira Bíblica
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
            Aprenda com o exemplo de José no Egito: diagnostique a terra nos anos de fartura, encha seus celeiros
            estratégicos com prudência e quebre de vez o jugo da escravidão das dívidas para servir a Deus com liberdade.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('diagnostico')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-[#1b4332] bg-[#e9d8a6] hover:bg-[#dfcb94] rounded-lg shadow-sm transition-colors whitespace-nowrap"
            >
              <span>Diagnosticar Minha Terra</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('celeiro')}
              className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg transition-colors whitespace-nowrap"
            >
              <Wheat className="w-4 h-4 text-[#d4a373]" />
              <span>Ver Meus Celeiros</span>
            </button>
            <button
              onClick={() => setActiveTab('conselheiro')}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-medium text-stone-300 hover:text-white transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#d4a373]" />
              <span>Consultar a Sabedoria Bíblica</span>
            </button>
          </div>
        </div>
      </div>

      {/* Versículos de Inspiração em Destaque */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1b4332] dark:text-[#d4a373] uppercase tracking-wider mb-2">
            <Wheat className="w-4 h-4 text-[#c59b27]" />
            <span>Gênesis 41:35-36</span>
          </div>
          <p className="font-serif italic text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-3">
            &ldquo;Ajuntem todo o mantimento destes anos bons que vêm, e amontoem trigo sob a autoridade do faraó, para
            mantimento nas cidades, e o guardem. Assim o mantimento será para abastecer a terra nos sete anos de fome.&rdquo;
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            A reserva de emergência é a revelação de Deus para proteger sua família das secas e tempestades que vêm sobre a terra.
          </p>
        </div>

        <div className="p-6 rounded-xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c] shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1b4332] dark:text-[#d4a373] uppercase tracking-wider mb-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>Provérbios 21:20 & 22:7</span>
          </div>
          <p className="font-serif italic text-sm text-stone-700 dark:text-stone-300 leading-relaxed mb-3">
            &ldquo;Tesouro desejável e azeite há na casa do sábio, mas o homem insensato os devora... O rico domina sobre o pobre, e o que toma emprestado é servo do que empresta.&rdquo;
          </p>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            O crente sábio rejeita o consumo desenfreado e busca ativamente a quebra do cativeiro das dívidas com juros.
          </p>
        </div>
      </div>

      {/* Card de Devocional & Sabedoria do Dia */}
      <div className="p-6 rounded-2xl border border-[#c59b27]/30 bg-gradient-to-r from-[#fcf9f2] via-[#faf6ec] to-[#f5eedc] dark:from-[#1b251e] dark:via-[#1e2c22] dark:to-[#17221a] shadow-xs">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#c59b27]/20 flex items-center justify-center text-[#99730c] dark:text-[#d4a373]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] font-semibold text-[#8f6b0f] dark:text-[#d4a373] uppercase tracking-wider">
                Devocional & Sabedoria Financeira
              </span>
              <h2 className="font-serif text-lg font-bold text-[#1b4332] dark:text-[#e9d8a6]">
                {currentDevotional.theme}
              </h2>
            </div>
          </div>
          <button
            onClick={handleNextDevotional}
            className="text-xs font-medium text-[#8f6b0f] dark:text-[#d4a373] hover:underline flex items-center gap-1.5"
          >
            <span>Ver Outra Reflexão ({devotionalIndex + 1}/{DEVOTIONALS.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <div className="p-3.5 bg-white/70 dark:bg-black/20 rounded-xl border border-[#c59b27]/20">
            <p className="font-serif italic text-sm text-stone-800 dark:text-stone-200">
              &ldquo;{currentDevotional.scripture}&rdquo;
            </p>
            <span className="block mt-1 text-xs font-bold text-[#8f6b0f] dark:text-[#d4a373]">
              — {currentDevotional.reference}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
            {currentDevotional.reflection}
          </p>

          <div className="flex items-center gap-2 pt-1 text-xs font-medium text-[#1b4332] dark:text-[#9fe2be]">
            <CheckCircle2 className="w-4 h-4 text-[#2d6a4f] shrink-0" />
            <span><strong>Ação Prática:</strong> {currentDevotional.practicalAction}</span>
          </div>
        </div>
      </div>

      {/* 4 Cards de Indicadores Vitais Rápidos */}
      <div>
        <h2 className="font-serif text-xl font-bold text-[#1b4332] dark:text-[#e9d8a6] mb-4">
          Termômetro dos Seus Recursos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Renda Realizada */}
          <div
            onClick={() => setActiveTab('diagnostico')}
            className="p-5 rounded-xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c] hover:border-[#1b4332] dark:hover:border-[#c59b27] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
              <span>Colheita do Mês</span>
              <Compass className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <div className="font-mono text-2xl font-bold text-stone-900 dark:text-stone-100 tabular-nums">
              {formatCurrency(totalIncomeActual)}
            </div>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              Custos essenciais: {formatCurrency(essentialExpenses)}
            </p>
          </div>

          {/* Card 2: Índice de Paz */}
          <div
            onClick={() => setActiveTab('celeiro')}
            className="p-5 rounded-xl border border-[#c59b27]/30 bg-gradient-to-b from-white to-[#fbf8f0] dark:from-[#16231c] dark:to-[#1c2921] hover:border-[#c59b27] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
              <span>Índice de Paz</span>
              <ShieldCheck className="w-4 h-4 text-[#c59b27] group-hover:scale-110 transition-transform" />
            </div>
            <div className="font-mono text-2xl font-bold text-[#1b4332] dark:text-[#d4a373] tabular-nums">
              {peaceIndexMonths} {peaceIndexMonths === 1 ? 'mês' : 'meses'}
            </div>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              {formatCurrency(barnSavings)} guardados no celeiro
            </p>
          </div>

          {/* Card 3: Sobra Livre */}
          <div
            onClick={() => setActiveTab('diagnostico')}
            className="p-5 rounded-xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c] hover:border-[#1b4332] dark:hover:border-[#c59b27] transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
              <span>Sobra Financeira Livre</span>
              <span className="text-xs font-semibold text-emerald-600">Disponível</span>
            </div>
            <div className={`font-mono text-2xl font-bold tabular-nums ${freeBalance >= 0 ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600'}`}>
              {formatCurrency(freeBalance)}
            </div>
            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
              Direcionar para o 1º Alvo ou Silo
            </p>
          </div>

          {/* Card 4: 1º Alvo de Dívida */}
          <div
            onClick={() => setActiveTab('dividas')}
            className="p-5 rounded-xl border border-rose-200 dark:border-rose-950/60 bg-white dark:bg-[#16231c] hover:border-rose-400 transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
              <span>1º Alvo de Ataque</span>
              <LockKeyholeOpen className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
            </div>
            {topDebt ? (
              <>
                <div className="font-mono text-xl font-bold text-rose-700 dark:text-rose-400 truncate tabular-nums">
                  {formatCurrency(topDebt.balance)}
                </div>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400 truncate">
                  {topDebt.creditor} ({topDebt.interestRate}% a.m.)
                </p>
              </>
            ) : (
              <>
                <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  Livre do Jugo!
                </div>
                <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                  Nenhuma dívida cadastrada
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Guia Rápido dos 3 Passos */}
      <div className="space-y-4">
        <div>
          <span className="text-xs font-bold text-[#c59b27] uppercase tracking-wider">
            O Roteiro da Liberdade
          </span>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1b4332] dark:text-[#e9d8a6]">
            Os 3 Passos do Método José
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Passo 1 */}
          <div
            onClick={() => setActiveTab('diagnostico')}
            className="p-6 rounded-xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c] hover:border-[#1b4332] dark:hover:border-[#c59b27] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#1b4332]/10 dark:bg-[#2d6a4f]/20 text-[#1b4332] dark:text-[#9fe2be] flex items-center justify-center font-serif font-bold text-base">
                1
              </div>
              <h3 className="font-serif text-base font-bold text-[#1b4332] dark:text-[#e9d8a6] group-hover:text-[#2d6a4f] transition-colors">
                Diagnóstico da Terra
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Conheça o estado do seu rebanho (Pv 27:23). Registre receitas previstas vs. realizadas e organize as despesas em 4 princípios: Primícias, A Tenda (essenciais), Estilo de Vida e Aportes.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#e5e0d8] dark:border-[#22332a] flex items-center justify-between text-xs font-semibold text-[#1b4332] dark:text-[#d4a373]">
              <span>Acessar Diagnóstico</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Passo 2 */}
          <div
            onClick={() => setActiveTab('celeiro')}
            className="p-6 rounded-xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c] hover:border-[#1b4332] dark:hover:border-[#c59b27] transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#c59b27]/20 text-[#8f6b0f] dark:text-[#d4a373] flex items-center justify-center font-serif font-bold text-base">
                2
              </div>
              <h3 className="font-serif text-base font-bold text-[#1b4332] dark:text-[#e9d8a6] group-hover:text-[#c59b27] transition-colors">
                Encher o Celeiro Estratégico
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Construa silos progressivos de reserva: de 1 mês (Primeiro Alívio) a 12 meses completos (Muralha Familiar). Calcule seu <strong>Índice de Paz</strong> e nunca mais seja refém de imprevistos.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#e5e0d8] dark:border-[#22332a] flex items-center justify-between text-xs font-semibold text-[#8f6b0f] dark:text-[#d4a373]">
              <span>Explorar Silos do Celeiro</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Passo 3 */}
          <div
            onClick={() => setActiveTab('dividas')}
            className="p-6 rounded-xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c] hover:border-rose-400 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-serif font-bold text-base">
                3
              </div>
              <h3 className="font-serif text-base font-bold text-[#1b4332] dark:text-[#e9d8a6] group-hover:text-rose-600 transition-colors">
                Quebrar o Jugo das Dívidas
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                Aplique a <strong>Estratégia Bola de Neve Bíblica</strong>: liquide primeiro a dívida de menor saldo para conquistar uma vitória imediata e somar a parcela liberada ao próximo alvo de ataque.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-[#e5e0d8] dark:border-[#22332a] flex items-center justify-between text-xs font-semibold text-rose-600 dark:text-rose-400">
              <span>Iniciar Bola de Neve</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
