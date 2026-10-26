# 🌾 Celeiro: O Método José de Gestão Financeira Bíblica

> *"Ajuntem todo o mantimento destes anos bons que vêm, e amontoem trigo sob a autoridade do faraó, para mantimento nas cidades, e o guardem. Assim o mantimento será para abastecer a terra nos sete anos de fome."* — **Gênesis 41:35-36**

---

## 📖 Sobre o Projeto

O **Celeiro** é uma plataforma completa de mordomia e planejamento financeiro cristão, inspirada na história bíblica de José no Egito (Gênesis 41) e nos provérbios de sabedoria financeira (Provérbios 21:20 e 22:7).

Diferente de sistemas convencionais ou teologias de prosperidade vazias, o Método José se apoia em 4 pilares:
1. **Fidelidade nas Primícias:** Consagrar os primeiros frutos a Deus com dízimos e ofertas generosas.
2. **Diagnóstico da Terra:** Conhecer o estado do rebanho e equilibrar o custo da moradia e necessidades essenciais (*A Tenda*).
3. **O Celeiro Estratégico:** Armazenar reservas em silos progressivos de 1 a 12+ meses, monitorando o **Índice de Paz** da família.
4. **Quebra do Jugo das Dívidas:** Aplicar a **Estratégia Bola de Neve Bíblica**, liquidando prioritariamente o menor saldo devedor para acelerar a quebra da servidão financeira.

---

## 🚀 Módulos do Sistema

### 1. Boas-Vindas & Devocional Diário
- Devocionais rotativos com versículos fundamentais e aplicações financeiras práticas para o dia a dia.
- O Guia dos 3 Passos (*Diagnóstico da Terra*, *Encher o Celeiro*, *Quebrar o Jugo*).
- Termômetro visual rápido dos 4 indicadores vitais da colheita.

### 2. Diagnóstico Mensal (Fluxo de Caixa Bíblico)
- Lançamento de fontes de renda com comparativo entre Previsto vs. Realizado.
- Despesas categorizadas por princípios:
  - *Primícias & Generosidade* (Dízimos e auxílio a necessitados)
  - *Custos Essenciais* (*A Tenda* - Moradia, alimentação básica, saúde)
  - *Estilo de Vida & Lazer* (Restaurantes, confraternização, assinaturas)
  - *Aportes no Celeiro* (Poupança estratégica)
- **Termômetro de Mordomia:** Diagnóstico automático com base no percentual de primícias ($\ge 10\%$) e custos essenciais ($\le 60\%$).

### 3. O Celeiro Estratégico (Reserva de José)
- Métrica central: **Índice de Paz** (quantos meses a reserva cobre as despesas básicas da família).
- **Os 5 Silos Progressivos:**
  - *Silo 1:* 1 Mês (Primeiro Alívio contra imprevistos)
  - *Silo 2:* 3 Meses (Paz Imediata da Família)
  - *Silo 3:* 6 Meses (Segurança das Tempestades)
  - *Silo 4:* 12 Meses (Muralha Familiar de 1 Ano Completo)
  - *Silo Maior:* Até 7 Anos (A Visão Máxima de José no Egito)
- Simulador de Aportes com cálculo de tempo restante para a conquista do próximo silo.

### 4. Rota de Quitação & Quebra de Jugo
- Ordenação automática pelo **menor saldo devedor** (Método Bola de Neve).
- Destaque imediato do **1º Alvo de Ataque**.
- Efeito multiplicador: ao liquidar uma dívida, a parcela liberada é somada ao próximo alvo.
- **Calculadora da Independência Financeira:** projeção exata da data de quebra de todo o jugo.

### 5. Conselheiro Bíblico Integrado (IA com Gemini 3.8 Flash)
- Chat interativo com orientações fundamentadas nas Escrituras e no contexto financeiro do usuário.
- Atalhos rápidos com dúvidas comuns (financiamento de veículos, corte de despesas, primícias com renda variável).

### 6. Relatório Mensal em PDF & Nuvem Gratuita (Firebase Firestore)
- Exportação com 1 clique de um **Relatório Mensal Bíblico em PDF** completo e diagramado com:
  - Cabeçalho temático com versículos e data de emissão.
  - Termômetro e KPIs principais (Colheita, Primícias, Custos Essenciais, Sobra Livre e Índice de Paz).
  - Tabela detalhada de Fontes de Renda (Previsto vs. Realizado).
  - Tabela detalhada de Despesas divididas pelos 4 Princípios de Mordomia.
  - Fila da Estratégia Bola de Neve para Quebra do Jugo das Dívidas.
- **Banco de Dados em Nuvem Gratuito:** Conexão nativa com **Firebase Firestore** e autenticação Google opcional para sincronização de dados entre múltiplos aparelhos, mantendo suporte offline com armazenamento local.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, jsPDF.
- **Banco de Dados & Autenticação:** Firebase Firestore & Google Auth (plano gratuito Spark).
- **Backend:** Express, Node.js, `@google/genai` (Gemini 3.8 Flash).
- **Build & Dev:** Vite, TSX.
- **Armazenamento:** Híbrido Local-First (`localStorage`) + Nuvem em tempo real (`Firestore`).

---

## 💻 Como Rodar Localmente

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/celeiro-gestao-biblica.git
cd celeiro-gestao-biblica
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
Crie um arquivo `.env` na raiz com:
```env
GEMINI_API_KEY="SUA_CHAVE_GEMINI_AQUI"
PORT=3000
```

### 4. Iniciar a aplicação
```bash
npm run dev
```

Acesse no navegador: `http://localhost:3000`.

---

## 📜 Licença

Distribuído sob a licença Apache-2.0. Consulte o arquivo de licença para mais informações.
