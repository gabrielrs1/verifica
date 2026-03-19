const path = require("path");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3000;
const DB_PATH = path.join(__dirname, "verifica.db");

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.use((req, res, next) => {
  const agora = new Date().toLocaleString("pt-BR");
  console.log(`[${agora}] ${req.method} ${req.url}`);
  next();
});

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
    process.exit(1);
  }
  console.log("Conectado ao banco de dados SQLite:", DB_PATH);
});

db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS conteudos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      tipo TEXT NOT NULL CHECK(tipo IN ('artigo', 'dica', 'caso_real')),
      nivel_dificuldade INTEGER NOT NULL CHECK(nivel_dificuldade BETWEEN 1 AND 3),
      criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
    (err) => {
      if (err) {
        console.error("Erro ao criar tabela:", err.message);
      } else {
        console.log('Tabela "conteudos" pronta.');
      }
    },
  );
});

// Helper para validar campos
function validarConteudo({ titulo, descricao, tipo, nivel_dificuldade }) {
  const erros = [];
  if (!titulo || titulo.trim() === "") erros.push("Título é obrigatório.");
  if (!descricao || descricao.trim() === "")
    erros.push("Descrição é obrigatória.");
  if (!["artigo", "dica", "caso_real"].includes(tipo))
    erros.push("Tipo deve ser: artigo, dica ou caso_real.");
  const nivel = parseInt(nivel_dificuldade);
  if (isNaN(nivel) || nivel < 1 || nivel > 3)
    erros.push("Nível de dificuldade deve ser 1, 2 ou 3.");
  return erros;
}

// GET /api/conteudos - Listar todos
app.get("/api/conteudos", (req, res) => {
  db.all("SELECT * FROM conteudos ORDER BY criado_em DESC", [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar conteúdos:", err.message);
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro interno ao buscar conteúdos.",
      });
    }
    res.json({ sucesso: true, dados: rows });
  });
});

// GET /api/conteudos/:id - Buscar por ID
app.get("/api/conteudos/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM conteudos WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("Erro ao buscar conteúdo:", err.message);
      return res
        .status(500)
        .json({ sucesso: false, mensagem: "Erro interno ao buscar conteúdo." });
    }
    if (!row) {
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Conteúdo não encontrado." });
    }
    res.json({ sucesso: true, dados: row });
  });
});

// POST /api/conteudos - Criar
app.post("/api/conteudos", (req, res) => {
  const { titulo, descricao, tipo, nivel_dificuldade } = req.body;
  const erros = validarConteudo({ titulo, descricao, tipo, nivel_dificuldade });
  if (erros.length > 0) {
    return res.status(400).json({ sucesso: false, mensagem: erros.join(" ") });
  }

  const sql = `
    INSERT INTO conteudos (titulo, descricao, tipo, nivel_dificuldade)
    VALUES (?, ?, ?, ?)
  `;
  db.run(
    sql,
    [titulo.trim(), descricao.trim(), tipo, parseInt(nivel_dificuldade)],
    function (err) {
      if (err) {
        console.error("Erro ao criar conteúdo:", err.message);
        return res.status(500).json({
          sucesso: false,
          mensagem: "Erro interno ao criar conteúdo.",
        });
      }
      res.status(201).json({
        sucesso: true,
        id: this.lastID,
        mensagem: "Conteúdo criado com sucesso.",
      });
    },
  );
});

// PUT /api/conteudos/:id - Atualizar
app.put("/api/conteudos/:id", (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, tipo, nivel_dificuldade } = req.body;
  const erros = validarConteudo({ titulo, descricao, tipo, nivel_dificuldade });
  if (erros.length > 0) {
    return res.status(400).json({ sucesso: false, mensagem: erros.join(" ") });
  }

  const sql = `
    UPDATE conteudos
    SET titulo = ?, descricao = ?, tipo = ?, nivel_dificuldade = ?, atualizado_em = CURRENT_TIMESTAMP
    WHERE id = ?
  `;
  db.run(
    sql,
    [titulo.trim(), descricao.trim(), tipo, parseInt(nivel_dificuldade), id],
    function (err) {
      if (err) {
        console.error("Erro ao atualizar conteúdo:", err.message);
        return res.status(500).json({
          sucesso: false,
          mensagem: "Erro interno ao atualizar conteúdo.",
        });
      }
      if (this.changes === 0) {
        return res
          .status(404)
          .json({ sucesso: false, mensagem: "Conteúdo não encontrado." });
      }
      res.json({ sucesso: true, mensagem: "Conteúdo atualizado com sucesso." });
    },
  );
});

// DELETE /api/conteudos/:id - Deletar
app.delete("/api/conteudos/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM conteudos WHERE id = ?", [id], function (err) {
    if (err) {
      console.error("Erro ao deletar conteúdo:", err.message);
      return res.status(500).json({
        sucesso: false,
        mensagem: "Erro interno ao deletar conteúdo.",
      });
    }
    if (this.changes === 0) {
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Conteúdo não encontrado." });
    }
    res.json({ sucesso: true, mensagem: "Conteúdo deletado com sucesso." });
  });
});

// GET /api/modulos - Listar resumo (para navegação)
app.get("/api/modulos", (req, res) => {
  const sql = `
    SELECT id, titulo, tipo, nivel_dificuldade
    FROM conteudos
    ORDER BY nivel_dificuldade ASC, criado_em ASC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Erro ao buscar módulos:", err.message);
      return res
        .status(500)
        .json({ sucesso: false, mensagem: "Erro interno ao buscar módulos." });
    }
    res.json({ sucesso: true, dados: rows });
  });
});

// GET /api/modulos/:id - Conteúdo completo de um módulo
app.get("/api/modulos/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM conteudos WHERE id = ?", [id], (err, row) => {
    if (err) {
      console.error("Erro ao buscar módulo:", err.message);
      return res
        .status(500)
        .json({ sucesso: false, mensagem: "Erro interno ao buscar módulo." });
    }
    if (!row) {
      return res
        .status(404)
        .json({ sucesso: false, mensagem: "Módulo não encontrado." });
    }
    res.json({ sucesso: true, dados: row });
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Verifica rodando em http://localhost:${PORT}`);
  console.log(`Painel Admin em http://localhost:${PORT}/admin.html`);
});
