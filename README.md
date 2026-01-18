# Cortex Bank Dashboard

Microserviço front-end de dashboard bancário desenvolvido como microfrontend utilizando Single-SPA. Este projeto faz parte da arquitetura de microserviços do Cortex Bank e fornece uma interface para visualização de informações financeiras, incluindo saldo, evolução de transações e análise de receitas e despesas.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Deploy](#deploy)
- [Segurança](#segurança)
- [Desenvolvimento](#desenvolvimento)

## 🎯 Sobre o Projeto

O Cortex Bank Dashboard é um microfrontend que permite aos usuários visualizar e gerenciar informações financeiras de suas contas. O dashboard oferece widgets customizáveis que exibem:

- **Balance Widget**: Saldo atual da conta com informações de rendimento
- **Evolution Widget**: Gráfico de evolução do saldo ao longo do tempo
- **IncomeOutcome Widget**: Análise de receitas e despesas por período

O projeto utiliza a arquitetura de microfrontends com Single-SPA, permitindo integração com outros microserviços da aplicação principal.

## 🛠 Tecnologias

### Core

- **React 19.2.0** - Biblioteca para construção da interface
- **TypeScript 4.3.5** - Tipagem estática
- **Single-SPA 5.9.3** - Framework para microfrontends

### Estado e Dados

- **Redux Toolkit 2.11.2** - Gerenciamento de estado global
- **React Query (TanStack Query) 5.90.16** - Gerenciamento de estado do servidor e cache

### UI e Estilização

- **@grupo10-pos-fiap/design-system** - Design system customizado
- **Recharts 2.10.3** - Biblioteca para gráficos
- **CSS Modules** - Estilização com escopo local

### Build e Desenvolvimento

- **Webpack 5.89.0** - Bundler e build tool
- **Babel** - Transpilação de código
- **ESLint** - Linter
- **Prettier** - Formatador de código


## 🏗 Arquitetura

### Microfrontend com Single-SPA

O projeto é configurado como um microfrontend que pode ser carregado dinamicamente por uma aplicação host. A estrutura Single-SPA permite:

- **Isolamento**: Cada microfrontend é independente
- **Deploy Independente**: Atualizações podem ser feitas sem afetar outros microserviços
- **Tecnologias Heterogêneas**: Cada microfrontend pode usar diferentes versões de bibliotecas

### Estrutura de Estado

- **Redux Store**: Gerencia estado da aplicação (configurações do dashboard, conta)
- **React Query**: Gerencia cache e sincronização de dados da API
- **Local Storage**: Persiste configurações de widgets do usuário

## 📦 Pré-requisitos

- **Node.js** >= 16.x
- **npm** >= 8.x

## 🚀 Instalação

1. Clone o repositório:

```bash
git clone <repository-url>
cd dashboard
```

2. Instale as dependências:

```bash
npm install
```

## ⚙️ Configuração

### Variáveis de Ambiente

⚠️ **IMPORTANTE - SEGURANÇA**: As variáveis de ambiente sensíveis (como chaves de API, tokens, URLs de produção) **NÃO** devem ser commitadas no arquivo `.env`. O arquivo `.env` é apenas para desenvolvimento local.

**Para produção (Vercel):**

- Configure todas as variáveis sensíveis diretamente no painel da Vercel
- Acesse: Settings → Environment Variables
- Adicione as variáveis necessárias para cada ambiente (Production, Preview, Development)

**Para desenvolvimento local:**
Crie um arquivo `.env` na raiz do projeto (este arquivo está no `.gitignore`):

```env
# API Configuration
API_BASE_URL=http://localhost:8080
MOCK_API_BASE_URL=http://localhost:8080

# Mock Mode (opcional)
USE_MOCK=false
```

### Variáveis de Ambiente Disponíveis

| Variável            | Descrição                           | Obrigatória | Padrão                  |
| ------------------- | ----------------------------------- | ----------- | ----------------------- |
| `API_BASE_URL`      | URL base da API de produção         | Não         | `http://localhost:8080` |
| `MOCK_API_BASE_URL` | URL base da API mock                | Não         | `http://localhost:8080` |
| `USE_MOCK`          | Habilita modo mock (`true`/`false`) | Não         | `false`                 |

## 📜 Scripts Disponíveis

### Desenvolvimento

```bash
# Inicia servidor de desenvolvimento na porta 3002
npm start

# Inicia servidor em modo standalone (para desenvolvimento isolado)
npm run start:standalone
```

### Build

```bash
# Build de produção
npm run build

# Build com análise de bundle
npm run analyze

# Gera tipos TypeScript
npm run build:types
```

### Qualidade de Código

```bash
# Executa linter
npm run lint

# Formata código
npm run format

# Verifica formatação
npm run check-format
```

## 📁 Estrutura do Projeto

```
dashboard/
├── src/
│   ├── api/                    # Chamadas à API
│   │   └── dashboard.api.ts
│   ├── components/             # Componentes React
│   │   ├── BalanceWidget.tsx
│   │   ├── EvolutionWidget.tsx
│   │   ├── IncomeOutcomeWidget.tsx
│   │   └── WidgetSettings.tsx
│   ├── config/                 # Configurações
│   │   └── api.config.ts
│   ├── hooks/                  # Custom hooks
│   │   └── useDashboard.ts
│   ├── providers/              # Context providers
│   │   └── QueryProvider.tsx
│   ├── store/                  # Redux store
│   │   ├── hooks.ts
│   │   ├── index.ts
│   │   └── slices/
│   │       ├── accountSlice.ts
│   │       └── dashboardSlice.ts
│   ├── types/                  # Definições TypeScript
│   │   └── dashboard.ts
│   ├── utils/                  # Utilitários
│   │   ├── apiClient.ts
│   │   ├── balanceCalculator.ts
│   │   ├── dashboardStorage.ts
│   │   ├── dataProcessors.ts
│   │   └── formatters.ts
│   ├── cortex-bank-dashboard.tsx  # Entry point Single-SPA
│   ├── Dashboard.tsx           # Componente principal
│   └── root.component.tsx      # Root component
├── .github/                    # GitHub workflows
├── .husky/                     # Git hooks
├── webpack.config.js           # Configuração Webpack
├── vercel.json                 # Configuração Vercel
└── package.json
```

## 🚢 Deploy

### Vercel

O projeto está configurado para deploy automático na Vercel. O deploy é acionado automaticamente quando há push para a branch `main`.

**Configuração de Deploy:**

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

**Headers de Segurança:**
O projeto inclui headers de segurança configurados no `vercel.json`:

- Content Security Policy (CSP)
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### Deploy Manual

1. Faça build do projeto:

```bash
npm run build
```

2. O diretório `dist` contém os arquivos prontos para deploy.

## 🔒 Segurança

### Variáveis de Ambiente

**CRÍTICO**: Nunca commite arquivos `.env` com informações sensíveis no repositório.

- ✅ **Correto**: Configure variáveis sensíveis no painel da Vercel (Settings → Environment Variables)
- ❌ **Incorreto**: Não adicione variáveis sensíveis no arquivo `.env` que será commitado

O arquivo `.env` deve ser usado **apenas para desenvolvimento local** e está incluído no `.gitignore`.

### Boas Práticas Implementadas

- Headers de segurança configurados no Vercel
- Content Security Policy (CSP) para prevenir XSS
- Validação de tipos com TypeScript
- Sanitização de dados de entrada
- CORS configurado adequadamente

## 💻 Desenvolvimento

### Modo Standalone

Para desenvolver o microfrontend isoladamente, use:

```bash
npm run start:standalone
```

Isso inicia o servidor de desenvolvimento com todas as dependências necessárias, permitindo desenvolver o dashboard sem a aplicação host.

### Integração com Single-SPA

O projeto exporta os lifecycles do Single-SPA:

- `bootstrap`: Inicialização do microfrontend
- `mount`: Montagem na aplicação host
- `unmount`: Desmontagem da aplicação host

### Adicionando Novos Widgets

1. Crie o componente do widget em `src/components/`
2. Adicione o tipo em `src/types/dashboard.ts` (`WidgetType`)
3. Implemente a renderização em `Dashboard.tsx` no método `renderWidget`
4. Adicione configuração padrão em `dashboardStorage.ts`

## 📝 Licença

## Este projeto é parte do Cortex Bank e é propriedade do Grupo 10 - Pós FIAP.
