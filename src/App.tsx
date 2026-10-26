/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { WelcomeView } from './components/WelcomeView';
import { DiagnosticoView } from './components/DiagnosticoView';
import { CeleiroView } from './components/CeleiroView';
import { DividasView } from './components/DividasView';
import { ConselheiroView } from './components/ConselheiroView';
import { QuickAddModal } from './components/QuickAddModal';
import { Footer } from './components/Footer';

function MainContent() {
  const { activeTab } = useApp();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fbf9f5] dark:bg-[#0f1715] text-stone-800 dark:text-stone-100 transition-colors">
      <Navbar onOpenQuickAdd={() => setIsQuickAddOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'welcome' && <WelcomeView />}
        {activeTab === 'diagnostico' && <DiagnosticoView />}
        {activeTab === 'celeiro' && <CeleiroView />}
        {activeTab === 'dividas' && <DividasView />}
        {activeTab === 'conselheiro' && <ConselheiroView />}
      </main>

      <Footer />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
