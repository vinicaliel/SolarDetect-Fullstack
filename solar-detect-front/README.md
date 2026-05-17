# SolarDetect - Frontend

Este é o repositório front-end do projeto **SolarDetect**, uma aplicação web focada em monitoramento e detecção de painéis solares através de inteligência artificial e imagens de satélite.

## 🚀 Tecnologias Utilizadas

- **Next.js** - Framework React para SSR e roteamento
- **Tailwind CSS** - Estilização utilitária e design responsivo
- **Lucide React** - Biblioteca de ícones
- **TypeScript** - Tipagem estática

## 🎨 Análise e Requisitos de UX/UI

A interface do SolarDetect foi projetada seguindo as melhores práticas de usabilidade e design. Abaixo detalhamos os requisitos, princípios e heurísticas aplicadas:

### 1. Requisitos de UX/UI Aplicados no Projeto
- **Identidade Visual Coerente:** O uso da paleta focada em verde (`text-green-700`, gradientes verdes) e fundos neutros (`bg-gray-50`, `bg-white`) cria uma sensação imediata de sustentabilidade, ecologia e energia limpa.
- **Design Responsivo (Mobile-First):** O uso de utilitários do Tailwind (`md:grid-cols-4`, `sm:grid-cols-2`, `hidden md:flex`) garante que a plataforma se adapte suavemente a dispositivos móveis, tablets e telas de desktop.
- **Microinterações (Feedback Visual):** Implementação de efeitos de transição fluidos, como botões que aumentam de tamanho (`hover:scale-105`), cards que projetam sombra (`hover:shadow-lg`) e textos com entrada animada (`animate-fadeInUp`), que deixam a interface dinâmica e respondem aos movimentos do usuário.
- **Acessibilidade e Contraste:** O uso inteligente de uma camada de sobreposição (`overlay` com `bg-gradient-to-b`) em cima do vídeo de fundo permite que o texto principal em branco tenha excelente contraste e legibilidade. O menu também utiliza `backdrop-blur` para manter a legibilidade em cima de outros conteúdos durante a rolagem.

### 2. Princípios da Gestalt Aplicados
A psicologia da Gestalt descreve como o cérebro humano percebe padrões visuais:
- **Proximidade:** Elementos relacionados estão agrupados. Na seção "Como Trabalhamos", ícones, títulos e textos estão dentro de contêineres/cards individuais com espaçamento (`gap-8` na grid, `p-6` interno). Isso indica ao cérebro que cada bloco trata de um assunto específico.
- **Similaridade:** Elementos com funções e importâncias iguais possuem a mesma aparência. Os quatro cards de *Funcionalidades* utilizam a mesma estrutura (ícone superior, título e texto). Os botões da Navbar e do Hero seguem um padrão visual.
- **Figura-Fundo:** Notável no componente `HeroSection`. A aplicação de escurecimento sobre o vídeo do globo terrestre destaca o texto principal ("Detecte placas solares..."), transformando-o na "figura" focada e o vídeo na "paisagem de fundo", evitando conflito de leitura.
- **Região Comum e Fechamento:** O uso de bordas arredondadas e sombras (`border rounded-xl shadow-sm`) nos cartões de instrução define limites claros. O usuário percebe a área contornada como um grupo fechado de informações.

### 3. Heurísticas de Nielsen (Usabilidade)
- **Visibilidade do status do sistema:** A interface fornece resposta interativa. Ao passar o mouse sobre botões ou cards, os efeitos (`hover:scale`, `transition-colors`, sombras) mostram que os elementos são clicáveis e que o sistema está ciente do cursor.
- **Correspondência entre o sistema e o mundo real:** O uso de ícones remete a conceitos físicos (Ex: O ícone de *Globo* para satélites, *Raio* para energia, e *Escudo* para segurança), usando uma linguagem natural para os usuários.
- **Consistência e Padrões:** A navegação superior ("Navbar") é fixa (`sticky top-0`). O usuário não precisa se perguntar onde encontrar os botões de "Login" ou "Cadastro", pois o layout se mantém previsível independentemente da rolagem.
- **Estética e Design Minimalista:** As seções da landing page não possuem excesso de informações irrelevantes. As telas têm bom espaço de respiro (`padding` generosos), entregando o conteúdo de maneira escaneável.

### 4. Decisões de Design e Suas Importâncias
- **Decisão:** Vídeo de Fundo do Planeta Terra.
  - *Importância:* Cria uma impressão "High-Tech" imersiva. Sendo o produto focado em análise via satélite, o vídeo introduz o usuário à grandeza tecnológica por trás do monitoramento remoto.
- **Decisão:** Duplo "Call to Action" (*CTAs*) no topo ("Saiba Mais" vs "Teste Agora").
  - *Importância:* Atende a dois tipos de usuários: O curioso/técnico (que será levado ao GitHub) e o potencial cliente corporativo/institucional (encaminhado para a página de Login).
- **Decisão:** Fluxo "One-Page" Inicial.
  - *Importância:* Cria um formato de *storytelling*. O usuário é guiado suavemente pela introdução, funcionalidades e método de operação de forma didática, sem a necessidade de recarregar múltiplas páginas.

### 5. Possíveis Melhorias Futuras de UX/UI
1. **Acessibilidade de Teclado (Focus States):** Garantir que botões e links possuam classes como `focus:ring` ou `focus:scale-105` para melhor navegação via teclado.
2. **Modo Escuro (Dark Mode):** Sendo um software de monitoramento e relatórios (dashboard), adicionar a opção de tema escuro aumentaria significativamente o conforto visual.
3. **Provas Sociais / Dados Quantitativos:** Incluir métricas (Ex: "+10.000 painéis detectados") ou logotipos de clientes parceiros para gerar autoridade e confiança.
4. **Feedback de Carregamento (Loading States):** Adicionar indicadores de carregamento (spinners ou skeleton screens) durante transições de rota (como ao clicar em "Teste Agora") ou requisições à API.
5. **Prevenção de Erros nos Formulários:** Incluir máscaras de input nos campos de coordenadas (Latitude/Longitude) e tooltips de ajuda para evitar que o usuário digite no formato errado.

## 🛠️ Como rodar o projeto

Primeiro, instale as dependências:
```bash
npm install
# ou
yarn install
```

Depois, rode o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.
