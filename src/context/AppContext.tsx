import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { IncomeItem, ExpenseItem, DebtItem } from '../types';
import {
  INITIAL_INCOMES,
  INITIAL_EXPENSES,
  INITIAL_DEBTS,
  INITIAL_BARN_SAVINGS,
} from '../data/mockData';
import { auth, db, loginWithGoogle, logout } from '../lib/firebase';
import { User, onAuthStateChanged } from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  collection,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore';
import { generateMonthlyReportPDF } from '../utils/pdfExport';

export type TabType = 'welcome' | 'diagnostico' | 'celeiro' | 'dividas' | 'conselheiro';

interface AppContextType {
  // State
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  debts: DebtItem[];
  barnSavings: number;
  customEssentialTarget: number;
  activeTab: TabType;
  isDarkMode: boolean;
  currentUser: User | null;
  isAuthLoading: boolean;
  isSyncing: boolean;

  // Computed metrics
  totalIncomePlanned: number;
  totalIncomeActual: number;
  totalExpensesActual: number;
  totalExpensesPlanned: number;
  primitiasExpenses: number;
  essentialExpenses: number;
  lifestyleExpenses: number;
  barnContributionsThisMonth: number;
  freeBalance: number;
  primitiasPercentage: number;
  essentialPercentage: number;
  lifestylePercentage: number;
  peaceIndexMonths: number;
  sortedDebts: DebtItem[];
  topDebt: DebtItem | null;
  totalDebtBalance: number;
  totalDebtMonthlyPayment: number;
  effectiveEssentialCost: number;

  // Actions
  setActiveTab: (tab: TabType) => void;
  toggleDarkMode: () => void;
  signInGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  exportMonthlyReport: () => void;
  addIncome: (income: Omit<IncomeItem, 'id'>) => void;
  updateIncome: (income: IncomeItem) => void;
  deleteIncome: (id: string) => void;
  addExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  updateExpense: (expense: ExpenseItem) => void;
  deleteExpense: (id: string) => void;
  addDebt: (debt: Omit<DebtItem, 'id'>) => void;
  updateDebt: (debt: DebtItem) => void;
  deleteDebt: (id: string) => void;
  amortizeDebt: (id: string, amount: number) => void;
  depositToBarn: (amount: number, reason?: string) => void;
  withdrawFromBarn: (amount: number, reason?: string) => void;
  setBarnSavingsManual: (amount: number) => void;
  setCustomEssentialTarget: (amount: number) => void;
  clearAllData: () => void;
  loadDemoData: () => void;
  resetToMockData: () => void;
}

const STORAGE_KEY_PREFIX = 'celeiro_metodo_jose_v2_';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local states
  const [incomes, setIncomes] = useState<IncomeItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}incomes`);
    return saved ? JSON.parse(saved) : [];
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}expenses`);
    return saved ? JSON.parse(saved) : [];
  });

  const [debts, setDebts] = useState<DebtItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}debts`);
    return saved ? JSON.parse(saved) : [];
  });

  const [barnSavings, setBarnSavings] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}barn`);
    return saved !== null ? JSON.parse(saved) : 0;
  });

  const [customEssentialTarget, setCustomEssentialTargetState] = useState<number>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}essential_target`);
    return saved !== null ? JSON.parse(saved) : 0;
  });

  const [activeTab, setActiveTab] = useState<TabType>('welcome');

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}dark_mode`);
      if (saved !== null) {
        const isDark = JSON.parse(saved);
        if (isDark) document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        return isDark;
      }
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) document.documentElement.classList.add('dark');
      return prefersDark;
    }
    return false;
  });

  // Track Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setIsAuthLoading(false);

      if (user) {
        // Load user profile & sync with Firestore
        try {
          setIsSyncing(true);
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            if (data.barnSavings !== undefined) setBarnSavings(data.barnSavings);
            if (data.customEssentialTarget !== undefined) setCustomEssentialTargetState(data.customEssentialTarget);
          } else {
            // Initial save of user profile
            await setDoc(userDocRef, {
              userId: user.uid,
              barnSavings,
              customEssentialTarget,
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.error('Erro ao sincronizar perfil do Firestore:', err);
        } finally {
          setIsSyncing(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore Subcollections when authenticated
  useEffect(() => {
    if (!currentUser) return;

    // Listen to incomes
    const incomesRef = collection(db, 'users', currentUser.uid, 'incomes');
    const unsubIncomes = onSnapshot(
      incomesRef,
      (snapshot) => {
        const cloudIncomes: IncomeItem[] = [];
        snapshot.forEach((d) => {
          cloudIncomes.push({ id: d.id, ...d.data() } as IncomeItem);
        });
        if (cloudIncomes.length > 0 || snapshot.metadata.hasPendingWrites) {
          setIncomes(cloudIncomes);
        }
      },
      (err) => console.error('Erro no listener de incomes:', err)
    );

    // Listen to expenses
    const expensesRef = collection(db, 'users', currentUser.uid, 'expenses');
    const unsubExpenses = onSnapshot(
      expensesRef,
      (snapshot) => {
        const cloudExpenses: ExpenseItem[] = [];
        snapshot.forEach((d) => {
          cloudExpenses.push({ id: d.id, ...d.data() } as ExpenseItem);
        });
        if (cloudExpenses.length > 0 || snapshot.metadata.hasPendingWrites) {
          setExpenses(cloudExpenses);
        }
      },
      (err) => console.error('Erro no listener de expenses:', err)
    );

    // Listen to debts
    const debtsRef = collection(db, 'users', currentUser.uid, 'debts');
    const unsubDebts = onSnapshot(
      debtsRef,
      (snapshot) => {
        const cloudDebts: DebtItem[] = [];
        snapshot.forEach((d) => {
          cloudDebts.push({ id: d.id, ...d.data() } as DebtItem);
        });
        if (cloudDebts.length > 0 || snapshot.metadata.hasPendingWrites) {
          setDebts(cloudDebts);
        }
      },
      (err) => console.error('Erro no listener de debts:', err)
    );

    return () => {
      unsubIncomes();
      unsubExpenses();
      unsubDebts();
    };
  }, [currentUser]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}incomes`, JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}expenses`, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}debts`, JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}barn`, JSON.stringify(barnSavings));
  }, [barnSavings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}essential_target`, JSON.stringify(customEssentialTarget));
  }, [customEssentialTarget]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}dark_mode`, JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Totais e Cálculos
  const totalIncomePlanned = useMemo(
    () => incomes.reduce((acc, curr) => acc + (Number(curr.plannedAmount) || 0), 0),
    [incomes]
  );

  const totalIncomeActual = useMemo(
    () => incomes.reduce((acc, curr) => acc + (Number(curr.actualAmount) || 0), 0),
    [incomes]
  );

  const totalExpensesPlanned = useMemo(
    () => expenses.reduce((acc, curr) => acc + (Number(curr.plannedAmount) || 0), 0),
    [expenses]
  );

  const totalExpensesActual = useMemo(
    () => expenses.reduce((acc, curr) => acc + (Number(curr.actualAmount) || 0), 0),
    [expenses]
  );

  const primitiasExpenses = useMemo(
    () =>
      expenses
        .filter((e) => e.category === 'primitias')
        .reduce((acc, curr) => acc + (Number(curr.actualAmount) || 0), 0),
    [expenses]
  );

  const essentialExpenses = useMemo(
    () =>
      expenses
        .filter((e) => e.category === 'essencial')
        .reduce((acc, curr) => acc + (Number(curr.actualAmount) || 0), 0),
    [expenses]
  );

  const lifestyleExpenses = useMemo(
    () =>
      expenses
        .filter((e) => e.category === 'estilo')
        .reduce((acc, curr) => acc + (Number(curr.actualAmount) || 0), 0),
    [expenses]
  );

  const barnContributionsThisMonth = useMemo(
    () =>
      expenses
        .filter((e) => e.category === 'celeiro')
        .reduce((acc, curr) => acc + (Number(curr.actualAmount) || 0), 0),
    [expenses]
  );

  const freeBalance = useMemo(
    () => totalIncomeActual - totalExpensesActual,
    [totalIncomeActual, totalExpensesActual]
  );

  const primitiasPercentage = useMemo(
    () => (totalIncomeActual > 0 ? (primitiasExpenses / totalIncomeActual) * 100 : 0),
    [primitiasExpenses, totalIncomeActual]
  );

  const essentialPercentage = useMemo(
    () => (totalIncomeActual > 0 ? (essentialExpenses / totalIncomeActual) * 100 : 0),
    [essentialExpenses, totalIncomeActual]
  );

  const lifestylePercentage = useMemo(
    () => (totalIncomeActual > 0 ? (lifestyleExpenses / totalIncomeActual) * 100 : 0),
    [lifestyleExpenses, totalIncomeActual]
  );

  const effectiveEssentialCost = useMemo(() => {
    if (essentialExpenses > 0) return essentialExpenses;
    return customEssentialTarget;
  }, [essentialExpenses, customEssentialTarget]);

  const peaceIndexMonths = useMemo(() => {
    if (effectiveEssentialCost <= 0) return 0;
    const months = barnSavings / effectiveEssentialCost;
    return Math.round(months * 10) / 10;
  }, [barnSavings, effectiveEssentialCost]);

  const sortedDebts = useMemo(() => {
    return [...debts].sort((a, b) => a.balance - b.balance);
  }, [debts]);

  const topDebt = useMemo(() => {
    const active = sortedDebts.filter((d) => d.balance > 0);
    return active.length > 0 ? active[0] : null;
  }, [sortedDebts]);

  const totalDebtBalance = useMemo(
    () => debts.reduce((acc, curr) => acc + curr.balance, 0),
    [debts]
  );

  const totalDebtMonthlyPayment = useMemo(
    () => debts.filter((d) => d.balance > 0).reduce((acc, curr) => acc + curr.monthlyPayment, 0),
    [debts]
  );

  // Handlers de Autenticação
  const signInGoogle = async () => {
    try {
      setIsSyncing(true);
      await loginWithGoogle();
    } catch (err) {
      console.error('Erro ao autenticar com Google:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const signOutUser = async () => {
    try {
      await logout();
      setCurrentUser(null);
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return next;
    });
  };

  // Helper de sincronização de doc do usuário
  const syncUserProfile = async (savings: number, target: number) => {
    if (!currentUser) return;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(
        userRef,
        {
          userId: currentUser.uid,
          barnSavings: savings,
          customEssentialTarget: target,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      console.error('Erro ao sincronizar perfil:', err);
    }
  };

  // CRUD Receitas
  const addIncome = async (income: Omit<IncomeItem, 'id'>) => {
    const id = `inc-${Date.now()}`;
    const newItem: IncomeItem = { ...income, id };
    setIncomes((prev) => [newItem, ...prev]);

    if (currentUser) {
      try {
        const itemRef = doc(db, 'users', currentUser.uid, 'incomes', id);
        await setDoc(itemRef, { ...income, userId: currentUser.uid });
      } catch (err) {
        console.error('Erro ao salvar receita no Firestore:', err);
      }
    }
  };

  const updateIncome = async (updated: IncomeItem) => {
    setIncomes((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    if (currentUser) {
      try {
        const itemRef = doc(db, 'users', currentUser.uid, 'incomes', updated.id);
        await setDoc(itemRef, { ...updated, userId: currentUser.uid }, { merge: true });
      } catch (err) {
        console.error('Erro ao atualizar receita no Firestore:', err);
      }
    }
  };

  const deleteIncome = async (id: string) => {
    setIncomes((prev) => prev.filter((item) => item.id !== id));
    if (currentUser) {
      try {
        const itemRef = doc(db, 'users', currentUser.uid, 'incomes', id);
        await deleteDoc(itemRef);
      } catch (err) {
        console.error('Erro ao remover receita no Firestore:', err);
      }
    }
  };

  // CRUD Despesas
  const addExpense = async (expense: Omit<ExpenseItem, 'id'>) => {
    const id = `exp-${Date.now()}`;
    const newItem: ExpenseItem = { ...expense, id };
    setExpenses((prev) => [newItem, ...prev]);

    if (currentUser) {
      try {
        const itemRef = doc(db, 'users', currentUser.uid, 'expenses', id);
        await setDoc(itemRef, { ...expense, userId: currentUser.uid });
      } catch (err) {
        console.error('Erro ao salvar despesa no Firestore:', err);
      }
    }
  };

  const updateExpense = async (updated: ExpenseItem) => {
    setExpenses((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    if (currentUser) {
      try {
        const itemRef = doc(db, 'users', currentUser.uid, 'expenses', updated.id);
        await setDoc(itemRef, { ...updated, userId: currentUser.uid }, { merge: true });
      } catch (err) {
        console.error('Erro ao atualizar despesa no Firestore:', err);
      }
    }
  };

  const deleteExpense = async (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
    if (currentUser) {
      try {
        const itemRef = doc(db, 'users', currentUser.uid, 'expenses', id);
        await deleteDoc(itemRef);
      } catch (err) {
        console.error('Erro ao remover despesa no Firestore:', err);
      }
    }
  };

  // CRUD Dívidas
  const addDebt = async (debt: Omit<DebtItem, 'id'>) => {
    const id = `debt-${Date.now()}`;
    const newItem: DebtItem = {
      ...debt,
      id,
      initialBalance: debt.initialBalance || debt.balance,
    };
    setDebts((prev) => [...prev, newItem]);

    if (currentUser) {
      try {
        const itemRef = doc(db, 'users', currentUser.uid, 'debts', id);
        await setDoc(itemRef, { ...newItem, userId: currentUser.uid });
      } catch (err) {
        console.error('Erro ao salvar dívida no Firestore:', err);
      }
    }
  };

  const updateDebt = async (updated: DebtItem) => {
    setDebts((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    if (currentUser) {
      try {
        const itemRef = doc(db, 'users', currentUser.uid, 'debts', updated.id);
        await setDoc(itemRef, { ...updated, userId: currentUser.uid }, { merge: true });
      } catch (err) {
        console.error('Erro ao atualizar dívida no Firestore:', err);
      }
    }
  };

  const deleteDebt = async (id: string) => {
    setDebts((prev) => prev.filter((item) => item.id !== id));
    if (currentUser) {
      try {
        const itemRef = doc(db, 'users', currentUser.uid, 'debts', id);
        await deleteDoc(itemRef);
      } catch (err) {
        console.error('Erro ao remover dívida no Firestore:', err);
      }
    }
  };

  const amortizeDebt = async (id: string, amount: number) => {
    let updatedItem: DebtItem | undefined;
    setDebts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newBal = Math.max(0, item.balance - amount);
          updatedItem = { ...item, balance: Math.round(newBal * 100) / 100 };
          return updatedItem;
        }
        return item;
      })
    );

    if (currentUser && updatedItem) {
      try {
        const itemRef = doc(db, 'users', currentUser.uid, 'debts', id);
        await setDoc(itemRef, { ...updatedItem, userId: currentUser.uid }, { merge: true });
      } catch (err) {
        console.error('Erro ao amortizar no Firestore:', err);
      }
    }
  };

  const depositToBarn = (amount: number, reason?: string) => {
    if (amount <= 0) return;
    const newSavings = barnSavings + amount;
    setBarnSavings(newSavings);
    syncUserProfile(newSavings, customEssentialTarget);

    addExpense({
      description: reason || 'Aporte Extra no Celeiro',
      plannedAmount: amount,
      actualAmount: amount,
      category: 'celeiro',
      date: new Date().toISOString().split('T')[0],
      notes: 'Transferência direta para reserva estratégica',
    });
  };

  const withdrawFromBarn = (amount: number, _reason?: string) => {
    if (amount <= 0) return;
    const newSavings = Math.max(0, barnSavings - amount);
    setBarnSavings(newSavings);
    syncUserProfile(newSavings, customEssentialTarget);
  };

  const setBarnSavingsManual = (amount: number) => {
    const val = Math.max(0, amount);
    setBarnSavings(val);
    syncUserProfile(val, customEssentialTarget);
  };

  const setCustomEssentialTarget = (amount: number) => {
    const val = Math.max(0, amount);
    setCustomEssentialTargetState(val);
    syncUserProfile(barnSavings, val);
  };

  const clearAllData = () => {
    setIncomes([]);
    setExpenses([]);
    setDebts([]);
    setBarnSavings(0);
    setCustomEssentialTargetState(0);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}incomes`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}expenses`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}debts`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}barn`);
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}essential_target`);
    syncUserProfile(0, 0);
  };

  const loadDemoData = () => {
    setIncomes(INITIAL_INCOMES);
    setExpenses(INITIAL_EXPENSES);
    setDebts(INITIAL_DEBTS);
    setBarnSavings(INITIAL_BARN_SAVINGS);
    setCustomEssentialTargetState(3200);
    syncUserProfile(INITIAL_BARN_SAVINGS, 3200);
  };

  const resetToMockData = () => {
    clearAllData();
  };

  // Exportação do Relatório Mensal em PDF
  const exportMonthlyReport = () => {
    const now = new Date();
    const months = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();

    generateMonthlyReportPDF({
      monthName,
      year,
      totalIncomeActual,
      totalIncomePlanned,
      totalExpensesActual,
      totalExpensesPlanned,
      primitiasExpenses,
      essentialExpenses,
      lifestyleExpenses,
      barnContributions: barnContributionsThisMonth,
      freeBalance,
      primitiasPercentage,
      essentialPercentage,
      barnSavings,
      peaceIndexMonths,
      incomes,
      expenses,
      debts,
      userEmail: currentUser?.email,
    });
  };

  return (
    <AppContext.Provider
      value={{
        incomes,
        expenses,
        debts,
        barnSavings,
        customEssentialTarget,
        effectiveEssentialCost,
        activeTab,
        isDarkMode,
        currentUser,
        isAuthLoading,
        isSyncing,
        totalIncomePlanned,
        totalIncomeActual,
        totalExpensesActual,
        totalExpensesPlanned,
        primitiasExpenses,
        essentialExpenses,
        lifestyleExpenses,
        barnContributionsThisMonth,
        freeBalance,
        primitiasPercentage,
        essentialPercentage,
        lifestylePercentage,
        peaceIndexMonths,
        sortedDebts,
        topDebt,
        totalDebtBalance,
        totalDebtMonthlyPayment,
        setActiveTab,
        toggleDarkMode,
        signInGoogle,
        signOutUser,
        exportMonthlyReport,
        addIncome,
        updateIncome,
        deleteIncome,
        addExpense,
        updateExpense,
        deleteExpense,
        addDebt,
        updateDebt,
        deleteDebt,
        amortizeDebt,
        depositToBarn,
        withdrawFromBarn,
        setBarnSavingsManual,
        setCustomEssentialTarget,
        clearAllData,
        loadDemoData,
        resetToMockData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
