const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const DB_PATH = path.join(__dirname, "verifica.db");

const conteudos = [
  {
    titulo: "Como identificar deepfakes em vídeos",
    descricao:
      "Deepfakes são vídeos manipulados por inteligência artificial que substituem o rosto de uma pessoa pelo de outra. Para identificá-los, observe inconsistências na iluminação do rosto, piscadas de olhos não naturais, bordas borradas ao redor da cabeça, e movimentos labiais que não batem com o áudio. Ferramentas como o FakeCatcher da Intel e o Deepware Scanner podem ajudar a detectar esses conteúdos automaticamente.",
    tipo: "artigo",
    nivel_dificuldade: 3,
  },
  {
    titulo: "5 perguntas para fazer antes de compartilhar uma notícia",
    descricao:
      "Antes de apertar o botão de compartilhar, pergunte-se: 1) Qual é a fonte da notícia? 2) A data da publicação é recente? 3) Outros veículos confiáveis confirmam essa informação? 4) O título é sensacionalista ou provocativo demais? 5) A imagem usada realmente pertence à notícia? Essas perguntas simples evitam que você espalhe desinformação sem querer.",
    tipo: "dica",
    nivel_dificuldade: 1,
  },
  {
    titulo: 'Caso real: O boato da "vacina com chip" durante a pandemia',
    descricao:
      "Em 2021, uma das fake news mais virais afirmava que as vacinas contra Covid-19 continham microchips para rastrear as pessoas. A teoria foi completamente desmentida por cientistas e autoridades de saúde do mundo inteiro. As vacinas contêm apenas ingredientes biológicos e químicos necessários para imunização. Este caso mostra como teorias conspiratórias podem prejudicar campanhas de saúde pública e colocar vidas em risco.",
    tipo: "caso_real",
    nivel_dificuldade: 2,
  },
  {
    titulo: "Checagem de fatos: como os fact-checkers trabalham",
    descricao:
      "Organizações de fact-checking como Agência Lupa, Aos Fatos e Estadão Verifica seguem um processo rigoroso: identificam uma afirmação suspeita, buscam a fonte original, consultam especialistas, analisam evidências e publicam uma classificação (verdadeiro, falso, enganoso, etc.). Conhecer esse processo ajuda você a avaliar melhor as informações que recebe.",
    tipo: "artigo",
    nivel_dificuldade: 2,
  },
  {
    titulo: "Como verificar a autenticidade de uma imagem",
    descricao:
      'Imagens tiradas fora de contexto são um dos tipos mais comuns de fake news. Use a pesquisa reversa de imagens: no Google Images ou TinEye, faça upload da foto ou cole o link para descobrir quando e onde ela foi publicada pela primeira vez. O Google Lens também funciona pelo celular. Muitas "notícias bombásticas" usam fotos de anos atrás ou de países diferentes.',
    tipo: "dica",
    nivel_dificuldade: 1,
  },
  {
    titulo: 'Caso real: A fake news das "ondas 5G causando doenças"',
    descricao:
      "Quando a tecnologia 5G começou a ser implantada no Brasil, espalhou-se a teoria de que as antenas causavam doenças e estavam ligadas à Covid-19. Isso levou à destruição de antenas em alguns países. Não existe nenhuma evidência científica que comprove relação entre ondas de rádio 5G e problemas de saúde. A OMS e a ANATEL confirmam que os níveis de radiação estão dentro dos limites seguros estabelecidos internacionalmente.",
    tipo: "caso_real",
    nivel_dificuldade: 2,
  },
  {
    titulo: "Entendendo a câmara de eco nas redes sociais",
    descricao:
      "Câmaras de eco são ambientes digitais onde você só vê conteúdos que confirmam suas próprias opiniões. Os algoritmos das redes sociais favorecem isso, mostrando mais do que você já curte ou comenta. Isso reforça crenças e dificulta o contato com informações diversas. Para sair da câmara de eco: siga perfis com visões diferentes, busque fontes variadas e questione sempre quando só você e seus amigos acreditam em algo.",
    tipo: "artigo",
    nivel_dificuldade: 3,
  },
  {
    titulo: "Dica: Confira a URL antes de clicar",
    descricao:
      'Sites falsos frequentemente usam URLs parecidas com as de veículos confiáveis para enganar leitores desatentos. Exemplos: "g1oticias.com" no lugar de "g1.globo.com", ou "uol-noticias.net" no lugar de "uol.com.br". Sempre verifique o endereço completo do site antes de confiar em uma notícia. Um pequeno detalhe na URL pode ser a diferença entre informação real e golpe.',
    tipo: "dica",
    nivel_dificuldade: 1,
  },
  {
    titulo: "Caso real: Foto da seca do Rio Negro usada fora de contexto",
    descricao:
      'Em 2023, fotos da impressionante seca do Rio Negro na Amazônia circularam nas redes sociais com textos afirmando que teriam sido causadas por obras do governo ou que seriam "prova" de teorias ambientais diversas. As imagens eram reais, mas os textos que as acompanhavam eram falsos ou distorcidos. Este caso ilustra como fatos verdadeiros podem ser usados para construir narrativas falsas.',
    tipo: "caso_real",
    nivel_dificuldade: 2,
  },
  {
    titulo: "Literacia midiática: aprenda a ler as notícias de forma crítica",
    descricao:
      "Literacia midiática é a habilidade de acessar, analisar, avaliar e criar conteúdo de mídia de forma consciente. Para desenvolvê-la: diferencie opinião de fato, identifique o interesse por trás de cada notícia, busque sempre a fonte primária das informações, e questione manchetes sensacionalistas. Jovens com literacia midiática são menos vulneráveis à desinformação e mais capazes de contribuir para um ambiente digital saudável.",
    tipo: "artigo",
    nivel_dificuldade: 3,
  },
];

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
    console.error(
      "Certifique-se de que o servidor foi iniciado pelo menos uma vez (node server.js) para criar o banco.",
    );
    process.exit(1);
  }
  console.log("Conectado ao banco de dados:", DB_PATH);
  inserirDados();
});

function inserirDados() {
  const stmt = db.prepare(`
    INSERT INTO conteudos (titulo, descricao, tipo, nivel_dificuldade)
    VALUES (?, ?, ?, ?)
  `);

  let inseridos = 0;

  db.serialize(() => {
    conteudos.forEach((c, i) => {
      stmt.run([c.titulo, c.descricao, c.tipo, c.nivel_dificuldade], (err) => {
        if (err) {
          console.error(`Erro ao inserir conteúdo ${i + 1}:`, err.message);
        } else {
          inseridos++;
          console.log(
            `[${inseridos}/${conteudos.length}] Inserido: "${c.titulo}"`,
          );
        }
      });
    });

    stmt.finalize(() => {
      console.log(
        `\nDados de teste inseridos com sucesso! (${inseridos} conteúdos)`,
      );
      console.log("Acesse http://localhost:3000 para visualizar os conteúdos.");
      db.close();
    });
  });
}
