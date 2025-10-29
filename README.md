# Frontend InsperJr - Dashboards Kaiserhaus

Frontend da aplicação de dashboards para análise de dados do restaurante Kaiserhaus, desenvolvido com React, TypeScript e Recharts.

## Como executar

### Pré-requisitos
- **Node.js** (versão 18+)
- **npm** (vem junto com o Node.js)
- **Git** (para baixar o projeto)

### Passo a passo

1. **Instale o Node.js** (se não tiver):
   - Acesse: https://nodejs.org/
   - Baixe a versão **LTS** (recomendada)
   - Execute o instalador

2. **Baixe o projeto:**
   - Clone o repositório ou baixe o ZIP
   - Extraia em uma pasta de sua escolha

3. **Abra o Terminal/Prompt de Comando:**
   - **Windows**: Pressione `Win + R`, digite `cmd` e pressione Enter
   - **Mac**: Pressione `Cmd + Espaço`, digite "Terminal" e pressione Enter
   - **Linux**: Pressione `Ctrl + Alt + T`

4. **Navegue até a pasta do projeto:**
   ```bash
   cd caminho/para/dashboards-frontend-insperjr
   ```

5. **Instale as dependências:**
   ```bash
   npm install
   ```
   *Aguarde terminar (pode demorar alguns minutos na primeira vez)*

6. **Execute o projeto:**
   ```bash
   npm run dev
   ```

7. **Abra no navegador:**
   - **Frontend**: http://localhost:5173
   - **Backend**: http://localhost:8000 (deve estar rodando)

### Se tudo der certo, você verá:
- No terminal: `Local: http://localhost:5173/`
- No navegador: Interface de teste da API com dados do Kaiserhaus

### Problemas comuns:
- **"npm não é reconhecido"**: Reinstale o Node.js
- **"porta já está em uso"**: Feche outros programas na porta 5173
- **"Erro de conexão"**: Verifique se o backend está rodando em http://localhost:8000
- **"Dados não carregam"**: Confirme que a API está funcionando

## Estrutura

```
dashboards-frontend-insperjr/
├── src/
│   ├── components/        # Componentes React
│   │   └── ApiTest.tsx   # Componente de teste da API
│   ├── services/         # Serviços para consumir API
│   │   └── api.ts        # Serviço principal da API
│   ├── App.tsx           # Componente principal
│   └── main.tsx          # Ponto de entrada
├── package.json          # Dependências do projeto
└── vite.config.ts        # Configuração do Vite
```


## Tecnologias

- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - JavaScript com tipagem estática
- **Vite** - Build tool moderno e rápido
- **Recharts** - Biblioteca para gráficos e dashboards
- **Tailwind CSS** - Framework CSS utilitário

## Funcionalidades

- **Conexão com API**: Consome dados do backend FastAPI
- **Teste de API**: Interface para verificar status e dados
- **Preparado para Dashboards**: Estrutura pronta para gráficos com Recharts
- **Responsivo**: Interface adaptável para diferentes telas

## Documentação

- **React**: https://react.dev/
- **TypeScript**: https://www.typescriptlang.org/
- **Vite**: https://vitejs.dev/
- **Recharts**: https://recharts.org/
- **Tailwind CSS**: https://tailwindcss.com/
