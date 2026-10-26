import React, { useState } from 'react';
import { useApp, TabType } from '../context/AppContext';
import {
  ShieldCheck,
  Moon,
  Sun,
  PlusCircle,
  FileDown,
  Cloud,
  LogOut,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface NavbarProps {
  onOpenQuickAdd: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuickAdd }) => {
  const {
    activeTab,
    setActiveTab,
    peaceIndexMonths,
    isDarkMode,
    toggleDarkMode,
    currentUser,
    isSyncing,
    signInGoogle,
    signOutUser,
    exportMonthlyReport,
  } = useApp();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInGoogle();
    } catch (err) {
      console.error('Falha ao conectar com o Google:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const navItems: { id: TabType; label: string }[] = [
    { id: 'welcome', label: 'Visão Geral' },
    { id: 'diagnostico', label: 'Diagnóstico' },
    { id: 'celeiro', label: 'O Celeiro' },
    { id: 'dividas', label: 'Quebra do Jugo' },
    { id: 'conselheiro', label: 'Conselheiro IA' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#fbf9f5]/95 dark:bg-[#121c17]/95 backdrop-blur-md border-b border-[#e5e0d8] dark:border-[#22332a] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => setActiveTab('welcome')}
            className="flex items-center gap-2.5 text-left focus:outline-none group whitespace-nowrap shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-[#1b4332] dark:bg-[#2d6a4f] flex items-center justify-center text-[#d4a373] shadow-sm">
              <span className="font-serif text-lg font-bold">🌾</span>
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-[#1b4332] dark:text-[#e9d8a6] block leading-none">
                Celeiro
              </span>
              <span className="text-[11px] font-medium text-stone-500 dark:text-stone-400 tracking-wide uppercase">
                O Método José
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Single-line, 1-2 words) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 text-xs uppercase tracking-wider font-semibold ${
                    isActive
                      ? 'text-[#1b4332] dark:text-[#d4a373]'
                      : 'text-stone-600 dark:text-stone-300 hover:text-[#1b4332] dark:hover:text-[#e9d8a6]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#1b4332] dark:bg-[#d4a373] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Indicador de Paz compacto */}
            <div
              onClick={() => setActiveTab('celeiro')}
              role="button"
              tabIndex={0}
              title="Índice de Paz: meses de custos essenciais cobertos pelo seu Celeiro"
              className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#e5e0d8] dark:border-[#2b4136] bg-white/70 dark:bg-[#1a2922]/70 text-xs font-medium cursor-pointer hover:border-[#c59b27] transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#2d6a4f] dark:text-[#d4a373]" />
              <span className="text-stone-600 dark:text-stone-300">Paz:</span>
              <span className="font-mono font-semibold text-[#1b4332] dark:text-[#e9d8a6] tabular-nums">
                {peaceIndexMonths}m
              </span>
            </div>

            {/* Botão de Exportar PDF Relatório Mensal */}
            <button
              onClick={exportMonthlyReport}
              title="Baixar Relatório Mensal Completo em PDF"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-200 bg-white dark:bg-[#1a2922] border border-[#e5e0d8] dark:border-[#2b4136] hover:border-[#c59b27] hover:text-[#1b4332] dark:hover:text-[#e9d8a6] rounded-lg shadow-xs transition-colors"
            >
              <FileDown className="w-4 h-4 text-[#c59b27]" />
              <span className="hidden sm:inline">Relatório PDF</span>
            </button>

            {/* Cloud Sync / Google Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/70 dark:bg-emerald-950/40 text-xs font-medium text-emerald-800 dark:text-emerald-200 transition-colors"
                  title={`Conectado: ${currentUser.email || currentUser.displayName} (Dados sincronizados na Nuvem)`}
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'Usuário'}
                      className="w-4 h-4 rounded-full"
                    />
                  ) : (
                    <Cloud className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  )}
                  <span className="hidden sm:inline max-w-[90px] truncate">
                    {currentUser.displayName?.split(' ')[0] || 'Conectado'}
                  </span>
                  {isSyncing ? (
                    <Loader2 className="w-3 h-3 text-emerald-600 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  )}
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1a2922] border border-[#e5e0d8] dark:border-[#2b4136] rounded-xl shadow-lg p-3 z-50 text-xs">
                    <p className="font-semibold text-stone-900 dark:text-stone-100 truncate">
                      {currentUser.displayName || 'Usuário'}
                    </p>
                    <p className="text-stone-500 dark:text-stone-400 truncate mb-2">
                      {currentUser.email}
                    </p>
                    <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-medium mb-3">
                      <Cloud className="w-3.5 h-3.5" />
                      <span>Banco de Dados em Nuvem Ativo</span>
                    </div>
                    <button
                      onClick={async () => {
                        setShowUserMenu(false);
                        await signOutUser();
                      }}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 rounded-lg font-medium transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Desconectar da Nuvem</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                title="Conectar com o Google para salvar no Banco de Dados em Nuvem (Firebase Firestore)"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[#e5e0d8] dark:border-[#2b4136] bg-white dark:bg-[#1a2922] hover:border-[#1b4332] text-xs font-semibold text-stone-700 dark:text-stone-200 transition-colors"
              >
                {isSigningIn ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1b4332] dark:text-[#d4a373]" />
                ) : (
                  <Cloud className="w-3.5 h-3.5 text-[#1b4332] dark:text-[#d4a373]" />
                )}
                <span className="hidden sm:inline">Nuvem</span>
              </button>
            )}

            {/* Botão de Ação Rápida */}
            <button
              onClick={onOpenQuickAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#1b4332] hover:bg-[#255741] dark:bg-[#2d6a4f] dark:hover:bg-[#398363] rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <PlusCircle className="w-4 h-4 text-[#d4a373]" />
              <span className="hidden sm:inline">Novo Registro</span>
            </button>

            {/* Alternador de Tema */}
            <button
              onClick={toggleDarkMode}
              title={isDarkMode ? 'Modo Claro' : 'Modo Noturno'}
              className="p-2 rounded-lg border border-[#e5e0d8] dark:border-[#2b4136] text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-[#1f3028] transition-colors"
              aria-label="Alternar tema"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-[#d4a373]" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav strip */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-[#e5e0d8] dark:border-[#22332a] overflow-x-auto gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-2.5 py-1 text-xs whitespace-nowrap rounded font-medium transition-colors ${
                  isActive
                    ? 'bg-[#1b4332] text-white dark:bg-[#2d6a4f]'
                    : 'text-stone-600 dark:text-stone-300'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
