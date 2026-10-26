import React from 'react';
import { useApp } from '../context/AppContext';
import { RefreshCw, Trash2, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { clearAllData, loadDemoData } = useApp();

  const handleClear = () => {
    if (
      window.confirm(
        'Deseja limpar todos os dados cadastrados e reiniciar com a planilha vazia?'
      )
    ) {
      clearAllData();
    }
  };

  const handleLoadDemo = () => {
    if (
      window.confirm(
        'Deseja preencher com os dados de exemplo para demonstração do Método José?'
      )
    ) {
      loadDemoData();
    }
  };

  return (
    <footer className="mt-16 border-t border-[#e5e0d8] dark:border-[#22332a] bg-[#fbf9f5] dark:bg-[#121c17] py-8 text-stone-500 dark:text-stone-400 text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <div className="w-6 h-6 rounded-md bg-[#1b4332] text-[#d4a373] flex items-center justify-center text-xs">
            🌾
          </div>
          <div>
            <span className="font-serif font-bold text-stone-800 dark:text-stone-200">
              Celeiro: O Método José
            </span>
            <span className="hidden sm:inline" aria-hidden="true"> · </span>
            <span className="block sm:inline text-stone-500">
              Gestão Financeira & Mordomia Bíblica
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e5e0d8] dark:border-[#2b4136] hover:bg-stone-100 dark:hover:bg-[#1a2922] transition-colors text-stone-600 dark:text-stone-300"
            title="Limpar todos os registros para preencher do zero"
          >
            <Trash2 className="w-3.5 h-3.5 text-stone-400" />
            <span>Limpar Dados (Preenchimento Próprio)</span>
          </button>
          <button
            onClick={handleLoadDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#e5e0d8] dark:border-[#2b4136] hover:bg-stone-100 dark:hover:bg-[#1a2922] transition-colors text-stone-600 dark:text-stone-300"
            title="Carregar valores de exemplo"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#c59b27]" />
            <span>Carregar Exemplo</span>
          </button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 pt-4 border-t border-[#e5e0d8]/50 dark:border-[#22332a]/50 text-center text-[11px] text-stone-400">
        &ldquo;Honra ao Senhor com os teus bens e com as primícias de toda a tua renda.&rdquo; — Provérbios 3:9
      </div>
    </footer>
  );
};
