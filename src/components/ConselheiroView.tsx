import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';
import {
  Sparkles,
  Send,
  BookOpen,
  Wheat,
  Scale,
  Car,
  Scissors,
  HelpCircle,
  Coins,
  Bot,
  User,
  Loader2,
} from 'lucide-react';

const SUGGESTED_QUESTIONS = [
  {
    icon: Car,
    text: 'Devo financiar um carro agora ou juntar no celeiro?',
    category: 'Decisões de Compra',
  },
  {
    icon: Scissors,
    text: 'Como cortar despesas da tenda sem comprometer minha família?',
    category: 'Ajuste de Orçamento',
  },
  {
    icon: Coins,
    text: 'Qual a prioridade: encher o celeiro de emergência ou quitar as dívidas?',
    category: 'Estratégia de José',
  },
  {
    icon: Wheat,
    text: 'Como separar o dízimo e primícias com fidelidade quando a colheita oscila?',
    category: 'Fidelidade & Fé',
  },
];

export const ConselheiroView: React.FC = () => {
  const {
    totalIncomeActual,
    essentialExpenses,
    primitiasExpenses,
    lifestyleExpenses,
    freeBalance,
    barnSavings,
    peaceIndexMonths,
    sortedDebts,
    topDebt,
  } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      text: `A paz seja convosco! Sou o **Conselheiro Bíblico Financeiro** do Método José.
      
Estou aqui para iluminar suas dúvidas e escolhas práticas à luz das Escrituras Sagradas (Provérbios, Eclesiastes, os ensinos de José no Egito e de Cristo nos Evangelhos).

*Você pode clicar em um dos temas sugeridos abaixo ou digitar sua pergunta sobre orçamento, dívidas, provisão ou prioridades familiares.*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const question = textToSend || inputText;
    if (!question.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: question.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Prepara o contexto com dados reais do usuário
      const context = {
        totalIncome: totalIncomeActual,
        essentialExpenses,
        primitiasExpenses,
        lifestyleExpenses,
        freeBalance,
        currentBarnAmount: barnSavings,
        peaceIndexMonths,
        debtsCount: sortedDebts.filter((d) => d.balance > 0).length,
        topDebtCreditor: topDebt?.creditor,
        topDebtBalance: topDebt?.balance,
      };

      const res = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question.trim(), context }),
      });

      if (!res.ok) {
        throw new Error(`Erro na resposta: ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: data.reply || 'Que a graça e a sabedoria de Deus guardem seus pensamentos e finanças.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Erro ao consultar conselheiro:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        text: `### Princípio da Prudência
        
*"Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento."* (Provérbios 3:5).
        
Houve uma breve instabilidade na conexão, mas lembre-se do fundamento: viva com menos do que ganha, honre a Deus primeiro com as primícias, estoque no celeiro contra os anos de seca e fuja de todo jugo de servidão de dívidas.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper para renderizar texto com markdown básico simples
  const renderFormattedText = (text: string) => {
    // Quebra por linhas
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Título H3 ###
      if (line.startsWith('### ')) {
        return (
          <h4 key={idx} className="font-serif text-base font-bold text-[#1b4332] dark:text-[#e9d8a6] mt-3 mb-1">
            {line.replace('### ', '')}
          </h4>
        );
      }
      // Título H2 ##
      if (line.startsWith('## ')) {
        return (
          <h3 key={idx} className="font-serif text-lg font-bold text-[#1b4332] dark:text-[#e9d8a6] mt-3 mb-1">
            {line.replace('## ', '')}
          </h3>
        );
      }
      // Citação bíblica com itálico ou aspas
      if (line.startsWith('> ') || line.includes('*"') || line.includes('"*')) {
        return (
          <blockquote key={idx} className="pl-3 py-1 my-1.5 border-l-2 border-[#c59b27] italic text-xs sm:text-sm text-stone-700 dark:text-stone-300 bg-black/5 dark:bg-white/5 rounded-r">
            {line.replace('> ', '').replace(/\*/g, '')}
          </blockquote>
        );
      }
      // Tópicos enumerados
      if (/^\d+\.\s/.test(line)) {
        return (
          <div key={idx} className="my-1 pl-2 text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-stone-200">
            {renderBoldTags(line)}
          </div>
        );
      }
      // Linha vazia
      if (!line.trim()) {
        return <div key={idx} className="h-2" />;
      }
      // Texto comum
      return (
        <p key={idx} className="text-xs sm:text-sm leading-relaxed text-stone-800 dark:text-stone-200 my-0.5">
          {renderBoldTags(line)}
        </p>
      );
    });
  };

  // Substitui **texto** por <strong>
  const renderBoldTags = (str: string) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-stone-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header do Módulo */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#1b4332] dark:text-[#d4a373] uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4 text-[#c59b27]" />
          <span>Módulo 5: Conselheiro Bíblico Integrado</span>
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1b4332] dark:text-[#e9d8a6]">
          Pergunte à Sabedoria Bíblica
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
          Orientações financeiras equilibradas com base em Provérbios, Gênesis 41 e a prudência de Cristo
        </p>
      </div>

      {/* Sugestões Rápidas de Perguntas */}
      <div className="space-y-2">
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
          Dúvidas Frequentes & Atalhos Bíblicos
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {SUGGESTED_QUESTIONS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSendMessage(item.text)}
                disabled={isLoading}
                className="p-3 text-left rounded-xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c] hover:border-[#c59b27] dark:hover:border-[#c59b27] transition-all group disabled:opacity-50"
              >
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#8f6b0f] dark:text-[#d4a373] uppercase mb-1">
                  <Icon className="w-3.5 h-3.5 text-[#c59b27]" />
                  <span>{item.category}</span>
                </div>
                <p className="text-xs text-stone-700 dark:text-stone-300 font-medium group-hover:text-[#1b4332] dark:group-hover:text-[#e9d8a6] transition-colors leading-snug">
                  {item.text}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Janela do Chat */}
      <div className="rounded-2xl border border-[#e5e0d8] dark:border-[#22332a] bg-white dark:bg-[#16231c] shadow-xs flex flex-col h-[520px] overflow-hidden">
        {/* Chat Header */}
        <div className="px-6 py-3.5 border-b border-[#e5e0d8] dark:border-[#22332a] bg-[#fbf9f5] dark:bg-[#121c17] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#1b4332] dark:bg-[#2d6a4f] flex items-center justify-center text-[#d4a373]">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-serif text-sm font-bold text-stone-900 dark:text-stone-100 block leading-tight">
                Conselheiro de Mordomia Cristã
              </span>
              <span className="text-[11px] text-stone-500 dark:text-stone-400">
                Alimentado com sabedoria bíblica e os dados atuais do seu Celeiro
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-stone-500">
            Índice de Paz: {peaceIndexMonths}m
          </span>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-[#1b4332] dark:bg-[#2d6a4f] text-[#d4a373] flex items-center justify-center shrink-0 text-xs">
                    🌾
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-[#1b4332] text-white dark:bg-[#2d6a4f] rounded-tr-none'
                      : 'bg-stone-50 dark:bg-[#121c17] text-stone-900 dark:text-stone-100 border border-[#e5e0d8] dark:border-[#22332a] rounded-tl-none'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <div>{renderFormattedText(msg.text)}</div>
                  )}
                  <span
                    className={`block mt-2 text-[10px] text-right font-mono ${
                      isUser ? 'text-stone-300' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start items-center">
              <div className="w-8 h-8 rounded-lg bg-[#1b4332] dark:bg-[#2d6a4f] text-[#d4a373] flex items-center justify-center shrink-0 text-xs">
                🌾
              </div>
              <div className="p-3 bg-stone-50 dark:bg-[#121c17] rounded-xl border border-[#e5e0d8] dark:border-[#22332a] flex items-center gap-2 text-xs text-stone-500">
                <Loader2 className="w-4 h-4 animate-spin text-[#c59b27]" />
                <span>Consultando os provérbios e as Escrituras...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-[#e5e0d8] dark:border-[#22332a] bg-[#fbf9f5] dark:bg-[#121c17]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Digite sua dúvida bíblico-financeira (ex: 'Como cortar supérfluos?')..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#16231c] border border-[#e5e0d8] dark:border-[#2b4136] rounded-xl text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-[#1b4332] dark:focus:ring-[#c59b27] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-4 py-2.5 bg-[#1b4332] hover:bg-[#255741] dark:bg-[#2d6a4f] dark:hover:bg-[#387c5e] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-40"
            >
              <span>Enviar</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
