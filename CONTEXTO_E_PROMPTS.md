# 🎯 Projeto Verifica - Contexto Mestre e Plano de Implementação

---

## 🔑 MENSAGEM 1: CONTEXTO MESTRE

```
Atue como um Engenheiro de Software Full Stack sênior. Vamos desenvolver um aplicativo web chamado Verifica. O objetivo do projeto é promover o combate à disseminação de fake news entre jovens e adolescentes, ensinando-os sobre prevenção em conteúdos encontrados na internet.

A stack de tecnologias obrigatória é: HTML, CSS, JavaScript no front-end e Node.js com SQLite no back-end.

Eu vou te enviar 10 prompts sequenciais para construirmos o sistema etapa por etapa. Para cada prompt, forneça apenas o código atualizado daquela etapa e breves instruções de como rodar. Não gere o sistema inteiro de uma vez. Responda 'Entendido, estou pronto para o Prompt 1' se você compreendeu a dinâmica.
```

---

## ✅ PROMPTS SEQUENCIAIS

### 📌 PROMPT 1: Estrutura do Banco de Dados e Servidor

**Status:** Aguardando envio
**Etapa:** 1/12

```
Crie a estrutura inicial do projeto Verifica com:

1. Um arquivo package.json com as dependências obrigatórias:
   - express (servidor web)
   - sqlite3 (banco de dados)
   - cors (compartilhamento de recursos)

2. Um arquivo server.js que:
   - Inicialize o servidor Express na porta 3000
   - Configure o SQLite para usar um arquivo chamado "verifica.db"
   - Crie automaticamente uma tabela chamada "conteudos" com os campos:
     * id (inteiro, chave primária, auto-incremento)
     * titulo (texto, obrigatório)
     * descricao (texto, obrigatório)
     * tipo (texto: 'artigo', 'dica', 'caso_real', obrigatório)
     * nivel_dificuldade (número: 1-3, obrigatório)
     * criado_em (timestamp, automático)
     * atualizado_em (timestamp, automático)

3. Após criar os arquivos, forneça:
   - Instruções passo-a-passo para instalar as dependências
   - Como rodar o servidor
   - Uma validação de que o banco de dados foi criado corretamente
```

---

### 📌 PROMPT 2: Criação da API (Rotas Backend)

**Status:** Pendente Prompt 2
**Etapa:** 2/12

```
Adicione ao server.js os seguintes endpoints HTTP:

1. GET /api/conteudos
   - Retorna todos os conteúdos do banco de dados em JSON
   - Response: { sucesso: true, dados: [...] }

2. GET /api/conteudos/:id
   - Retorna um conteúdo específico pelo ID
   - Response: { sucesso: true, dados: {...} }

3. POST /api/conteudos
   - Cria um novo conteúdo
   - Body esperado: { titulo, descricao, tipo, nivel_dificuldade }
   - Response: { sucesso: true, id: X, mensagem: "Conteúdo criado com sucesso" }

4. PUT /api/conteudos/:id
   - Atualiza um conteúdo existente
   - Body esperado: { titulo, descricao, tipo, nivel_dificuldade }
   - Response: { sucesso: true, mensagem: "Conteúdo atualizado com sucesso" }

5. DELETE /api/conteudos/:id
   - Deleta um conteúdo
   - Response: { sucesso: true, mensagem: "Conteúdo deletado com sucesso" }

Inclua também:
- Tratamento de erro padrão (try/catch)
- Logs de requisições no console
- Validação básica dos dados de entrada
```

---

### 📌 PROMPT 3: Interface de Usuário (Estrutura Base)

**Status:** Pendente Prompt 3
**Etapa:** 3/12

```
Crie dois arquivos para a interface do usuário:

1. index.html
   - Uma página com layout atraente e acessível para adolescentes
   - Seção de cabeçalho com o nome "Verifica" e um ícone
   - Um container para exibir cards de conteúdo (deixe vazio, será preenchido via JS)
   - Um rodapé com informações do projeto
   - Links para os arquivos CSS e JS desta página

2. style.css
   - Paleta de cores moderna e amigável (sugestão: azul, verde, branco)
   - Tipografia clara e legível (fonte sans-serif)
   - Layout responsivo (mobile-first)
   - Styles para cards de conteúdo com:
     * Título em destaque
     * Descrição em tamanho menor
     * Tipo de conteúdo como badge/label
     * Botões para interação (será usado depois)

Forneça também:
- Screenshot mental de como ficaria o layout
- Instruções para visualizar a página (abrir no navegador)
```

---

### 📌 PROMPT 4: Renderização Didática (Integração Front e Back)

**Status:** Pendente Prompt 4
**Etapa:** 4/12

```
Crie um arquivo app.js que:

1. Faça uma requisição GET para http://localhost:3000/api/conteudos ao carregar a página
2. Pegue cada conteúdo retornado e renderize como um card HTML com:
   - Título como h2
   - Descrição como parágrafo
   - Tipo como um badge colorido (artigo=azul, dica=verde, caso_real=laranja)
   - Nível de dificuldade como estrelas (★) ou níveis (1, 2, 3)
   - Data de criação formatada (ex: "Criado em 15/03/2026")

3. Adicione tratamento de erro:
   - Se a API não responder, mostre uma mensagem amigável
   - Se não houver conteúdos, mostre "Nenhum conteúdo disponível ainda"

4. Forneça instruções para:
   - Adicionar este arquivo ao index.html
   - Rodar o servidor e acessar http://localhost:3000
   - Testar a integração (pode usar POST via Prompt 2 anteriormente)
```

---

### 📌 PROMPT 5: Painel de Administração (Criar)

**Status:** Pendente Prompt 5
**Etapa:** 5/12

```
Crie dois arquivos para administração:

1. admin.html
   - Layout similar ao index.html mas com foco em management
   - Um formulário com os campos:
     * Input: Título (text, obrigatório)
     * Textarea: Descrição (obrigatório)
     * Select: Tipo (artigo | dica | caso_real, obrigatório)
     * Radio/Select: Nível de Dificuldade (1 | 2 | 3, obrigatório)
     * Button: "Criar Conteúdo" (classe: btn-criar)
     * Um container para listar conteúdos criados (será preenchido via JS)

2. admin.js
   - Faça fetch GET para popular os conteúdos existentes na tabela
   - Quando o formulário for enviado:
     * Valide os campos
     * Faça um POST para /api/conteudos
     * Se sucesso: limpe o formulário e mostre mensagem de sucesso
     * Se erro: mostre mensagem de erro

3. Forneça:
   - Instruções para acessar http://localhost:3000/admin.html
   - Como testar criação de conteúdo
```

---

### 📌 PROMPT 6: Painel de Administração (Editar)

**Status:** Pendente Prompt 6
**Etapa:** 6/10

```
Atualize admin.js e admin.html para suportar edição:

1. Na tabela/lista de conteúdos, adicione para cada item:
   - Um botão "Editar"
   - Um botão "Deletar"

2. Ao clicar em "Editar":
   - Preencha o formulário com os dados do conteúdo selecionado
   - Mude o botão de "Criar Conteúdo" para "Atualizar Conteúdo"
   - Um campo oculto com o ID do conteúdo sendo editado

3. Ao clicar em "Atualizar Conteúdo":
   - Faça um PUT para /api/conteudos/:id
   - Atualize a tabela de listagem
   - Limpe o formulário

4. Ao clicar em "Deletar":
   - Mostre confirmação (confirm do navegador)
   - Faça DELETE para /api/conteudos/:id
   - Atualize a tabela

5. Forneça instruções de teste completo (criar, editar, deletar)
```

---

### 📌 PROMPT 7: Rotas de Módulos (Backend)

**Status:** Pendente Prompt 7
**Etapa:** 7/12

```
Adicione ao server.js novas rotas para suportar a navegação por módulos:

1. GET /api/modulos
   - Retorna a lista de conteúdos resumida (apenas id, titulo, tipo, nivel_dificuldade)
   - Ordenada por nivel_dificuldade (ascendente), depois por criado_em
   - Response: { sucesso: true, dados: [...] }

2. GET /api/modulos/:id
   - Retorna o conteúdo completo de um módulo específico pelo ID
   - Response: { sucesso: true, dados: {...} }

Adicione também:

- Tratamento de erro padrão (try/catch)
- Retorno 404 com { sucesso: false, mensagem: "Módulo não encontrado" } quando o ID não existir
```

---

### 📌 PROMPT 8: Interface de Módulos (Frontend — index.html)

**Status:** Pendente Prompt 8
**Etapa:** 8/12

```
Refatore o index.html e o app.js para adotar a navegação por módulos:

1. Em index.html, crie duas seções distintas:
   - Seção "lista-modulos": exibe os módulos disponíveis como itens clicáveis
   - Seção "detalhe-modulo": inicialmente oculta (display: none), exibe o conteúdo completo do módulo selecionado
     - Botão "← Voltar" para retornar à lista
     - Título (h1)
     - Badge de tipo e nível de dificuldade
     - Corpo do conteúdo (descrição) como área de leitura
     - Botões de "Baixar PDF" e "Compartilhar" (serão implementados depois)

2. Em app.js, refatore a lógica para:
   - Ao carregar a página, fazer GET /api/modulos e renderizar cada item como um card clicável com:
     - Título como h2 (o tópico selecionável)
     - Badge de tipo e nível de dificuldade
     - Cursor pointer e efeito hover indicando que é clicável
   - Ao clicar em um módulo:
     - Fazer GET /api/modulos/:id
     - Ocultar a seção de lista
     - Exibir a seção de detalhe com os dados retornados
   - Ao clicar em "Voltar":
     - Ocultar a seção de detalhe
     - Exibir novamente a seção de lista

3. Adicione tratamento de erro:
   - Falha na listagem: mensagem "Não foi possível carregar os módulos"
   - Falha ao abrir módulo: mensagem "Não foi possível carregar o conteúdo"

4. Forneça instruções para testar o fluxo completo: listar → selecionar módulo → ler → voltar
```

---

### 📌 PROMPT 9: Funcionalidade de Geração de PDF

**Status:** Pendente Prompt 9
**Etapa:** 9/12

```
Integre a funcionalidade de download em PDF:

1. No index.html, adicione:
   - Uma tag script para carregar a biblioteca html2pdf.js (via CDN)
   - Referenciado como: <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>

2. Em app.js, adicione:
   - Um botão "Baixar como PDF" em cada card de conteúdo
   - Ao clicar, chame a função html2pdf para gerar um PDF com:
     * Título do conteúdo
     * Descrição completa
     * Tipo e nível de dificuldade
     * Data de criação
   - O arquivo PDF deve ser nomeado como "verifica_[titulo].pdf"
   - O PDF deve consultar uma rota onde todos os dados são retornados e diponibilizados de boa aparência no PDF.

3. Na hora de exportar para PDF devemos buscar as informações gerais da postagem e logo após isso lista no PDF (não pode ser cópia da tela).

4. Forneça:
   - Instruções para testar o download de PDF
   - Como nomear e salvar o arquivo corretamente
```

---

### 📌 PROMPT 10: Funcionalidade de Compartilhamento

**Status:** Pendente Prompt 10
**Etapa:** 10/12

```
Integre a funcionalidade de compartilhamento:

1. Em app.js, adicione:
   - Um botão "Compartilhar" em cada card de conteúdo
   - Ao clicar, use a Web Share API do navegador:
     * navigator.share({
         title: 'Conteúdo do Verifica',
         text: 'Conheça esse conteúdo sobre fake news: [título]',
         url: window.location.href
       })

2. Tratamento de erro:
   - Se a Web Share API não estiver disponível, mostre um fallback:
     * Copiar o URL para a área de transferência
     * Exibir uma mensagem "Link copiado!"

3. Forneça:
   - Instruções de teste em dispositivos móveis (se possível)
   - Como testar o fallback em navegadores que não suportam Web Share API
```

---

### 📌 PROMPT 11: Responsividade e Refinamento de Interface

**Status:** Pendente Prompt 11
**Etapa:** 11/12

```
Finalize o design com foco em mobile e adicione notificações:

1. Atualize style.css com:
   - Media queries para tablets (768px) e desktops (1024px)
   - Grid responsivo de cards (mobile: 1 coluna, tablet: 2, desktop: 3+)
   - Botões com tamanho adequado para toque em mobile (mín 44px)
   - Adequação de espaçamento e padding para mobile

2. Em app.js e admin.js, implemente toasts (notificações):
   - Crie uma função showToast(mensagem, tipo) onde tipo é 'sucesso' ou 'erro'
   - Toasts devem aparecer no topo da página com:
     * Cor diferente para sucesso (verde) e erro (vermelho)
     * Duração de 3-5 segundos
     * Auto-desaparecer com fade-out

3. Aplique toasts em:
   - Criação, atualização e deleção de conteúdo
   - Erros de API
   - Sucesso em download de PDF
   - Cópia de link para compartilhamento

4. Forneça:
   - Screenshots da interface em mobile, tablet e desktop
   - Instruções para testar responsividade (DevTools)
```

---

### 📌 PROMPT 12: Povoamento de Dados e Homologação

**Status:** Pendente Prompt 12
**Etapa:** 12/12

```
Crie ferramentas para testes e homologação:

1. Crie um arquivo seed.js que:
   - Conecte ao banco de dados verifica.db
   - Insira 8-10 conteúdos de exemplo com:
     * Títulos reais sobre fake news (ex: "Como identificar deepfakes")
     * Descrições didáticas
     * Mistura de tipos (artigo, dica, caso_real)
     * Mistura de níveis (1, 2, 3)
   - Após inserir, mostre uma mensagem "Dados de teste inseridos com sucesso"

2. Em admin.html, adicione:
   - Uma seção "Checklist de Homologação" com itens como:
     ☐ API GET retorna todos os conteúdos
     ☐ Criar novo conteúdo funciona
     ☐ Editar conteúdo funciona
     ☐ Deletar conteúdo funciona
     ☐ Cards são renderizados corretamente
     ☐ PDF é gerado e baixado
     ☐ Compartilhamento funciona
     ☐ Interface é responsiva em mobile
     ☐ Toasts aparecem corretamente
     ☐ Nenhum erro no console do navegador
   - Checkboxes interativas (marca/desmarca ao clicar)

3. Forneça:
   - Como rodar seed.js: node seed.js
   - Instruções finais para Marcelo e Igor (testadores)
   - Como executar a homologação completa passo a passo
```

---

## 📊 Checklist de Acompanhamento

- [ ] Prompt 1 Enviado e Confirmado
- [ ] Prompt 2 Enviado e Confirmado
- [ ] Prompt 3 Enviado e Confirmado
- [ ] Prompt 4 Enviado e Confirmado
- [ ] Prompt 5 Enviado e Confirmado
- [ ] Prompt 6 Enviado e Confirmado
- [ ] Prompt 7 Enviado e Confirmado
- [ ] Prompt 8 Enviado e Confirmado
- [ ] Prompt 9 Enviado e Confirmado
- [ ] Prompt 10 Enviado e Confirmado
- [ ] Prompt 11 Enviado e Confirmado
- [ ] Prompt 12 Enviado e Confirmado

---

## 🚀 Próximos Passos

1. Copie o **Contexto Mestre** e envie os prompts para a Inteligência Artificial.
2. Aguarde a resposta: "Entendido, estou pronto para o Prompt 1"
3. Copie e envie o **PROMPT 1**
4. Repita para os demais prompts, um por vez
5. Ao final, você terá o sistema **Verifica** completo e funcional!

---

**Última atualização:** 17 de março de 2026

**Projeto:** Verifica - Combate à Disseminação de Fake News

**Reponsáveis técnicos** Gabriel, Henrique, Igor, Lucas e Marcelo
