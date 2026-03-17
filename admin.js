const API_BASE = "http://localhost:3000/api";

// =============================================
// TOAST
// =============================================

function showToast(mensagem, tipo = "sucesso") {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  toast.className = `toast toast-${tipo}`;
  toast.textContent = mensagem;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("toast-saindo");
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

// =============================================
// HELPERS
// =============================================

const tipoLabels = { artigo: "Artigo", dica: "Dica", caso_real: "Caso Real" };

function formatarData(dataStr) {
  if (!dataStr) return "";
  return new Date(dataStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// =============================================
// ESTADO
// =============================================

let modoEdicao = false;

// =============================================
// FORMULÁRIO
// =============================================

function limparFormulario() {
  document.getElementById("conteudo-id").value = "";
  document.getElementById("titulo").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("tipo").value = "";
  document
    .querySelectorAll('input[name="nivel"]')
    .forEach((r) => (r.checked = false));
  document.getElementById("btn-submit").textContent = "Criar Conteúdo";
  document.getElementById("form-titulo").textContent = "Novo Conteúdo";
  document.getElementById("btn-cancelar").style.display = "none";
  modoEdicao = false;
}

function preencherFormulario(conteudo) {
  document.getElementById("conteudo-id").value = conteudo.id;
  document.getElementById("titulo").value = conteudo.titulo;
  document.getElementById("descricao").value = conteudo.descricao;
  document.getElementById("tipo").value = conteudo.tipo;
  const radio = document.querySelector(
    `input[name="nivel"][value="${conteudo.nivel_dificuldade}"]`,
  );
  if (radio) radio.checked = true;
  document.getElementById("btn-submit").textContent = "Atualizar Conteúdo";
  document.getElementById("form-titulo").textContent = "Editar Conteúdo";
  document.getElementById("btn-cancelar").style.display = "inline-flex";
  modoEdicao = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function obterDadosFormulario() {
  const nivel = document.querySelector('input[name="nivel"]:checked');
  return {
    titulo: document.getElementById("titulo").value.trim(),
    descricao: document.getElementById("descricao").value.trim(),
    tipo: document.getElementById("tipo").value,
    nivel_dificuldade: nivel ? parseInt(nivel.value) : null,
  };
}

function validarFormulario(dados) {
  if (!dados.titulo) return "Preencha o título.";
  if (!dados.descricao) return "Preencha a descrição.";
  if (!dados.tipo) return "Selecione o tipo.";
  if (!dados.nivel_dificuldade) return "Selecione o nível de dificuldade.";
  return null;
}

// =============================================
// CARREGAR CONTEÚDOS
// =============================================

async function carregarConteudos() {
  const wrapper = document.getElementById("tabela-wrapper");
  wrapper.innerHTML = '<div class="loading">Carregando...</div>';

  try {
    const resp = await fetch(`${API_BASE}/conteudos`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const { sucesso, dados } = await resp.json();
    if (!sucesso) throw new Error("Erro na API.");

    const contador = document.getElementById("contador");
    contador.textContent = `(${dados.length})`;

    if (dados.length === 0) {
      wrapper.innerHTML =
        '<div class="empty-state" style="padding:1.5rem;">Nenhum conteúdo cadastrado.</div>';
      return;
    }

    const tabela = document.createElement("table");
    tabela.innerHTML = `
      <thead>
        <tr>
          <th>#</th>
          <th>Título</th>
          <th>Tipo</th>
          <th>Nível</th>
          <th>Criado em</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody id="tbody"></tbody>
    `;

    const tbody = tabela.querySelector("#tbody");
    dados.forEach((c) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${c.id}</td>
        <td style="max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${c.titulo}">${c.titulo}</td>
        <td><span class="badge badge-${c.tipo}">${tipoLabels[c.tipo] || c.tipo}</span></td>
        <td>${"★".repeat(c.nivel_dificuldade)}${"☆".repeat(3 - c.nivel_dificuldade)}</td>
        <td>${formatarData(c.criado_em)}</td>
        <td>
          <div class="td-actions">
            <button class="btn btn-warning btn-editar" data-id="${c.id}">Editar</button>
            <button class="btn btn-danger btn-deletar" data-id="${c.id}">Deletar</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    wrapper.innerHTML = "";
    wrapper.appendChild(tabela);

    // Eventos de Editar
    wrapper.querySelectorAll(".btn-editar").forEach((btn) => {
      btn.addEventListener("click", () => {
        const conteudo = dados.find((c) => c.id === parseInt(btn.dataset.id));
        if (conteudo) preencherFormulario(conteudo);
      });
    });

    // Eventos de Deletar
    wrapper.querySelectorAll(".btn-deletar").forEach((btn) => {
      btn.addEventListener("click", () =>
        deletarConteudo(parseInt(btn.dataset.id)),
      );
    });
  } catch (err) {
    console.error("Erro ao carregar conteúdos:", err);
    showToast("Erro ao carregar conteúdos da API.", "erro");
    wrapper.innerHTML =
      '<div class="error-state" style="padding:1.5rem;">Não foi possível carregar os conteúdos.</div>';
  }
}

// =============================================
// CRIAR / ATUALIZAR
// =============================================

document
  .getElementById("form-conteudo")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const dados = obterDadosFormulario();
    const erro = validarFormulario(dados);
    if (erro) {
      showToast(erro, "erro");
      return;
    }

    const id = document.getElementById("conteudo-id").value;

    try {
      let resp, json;

      if (modoEdicao && id) {
        resp = await fetch(`${API_BASE}/conteudos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        });
      } else {
        resp = await fetch(`${API_BASE}/conteudos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dados),
        });
      }

      json = await resp.json();

      if (!resp.ok || !json.sucesso) {
        throw new Error(json.mensagem || "Erro desconhecido.");
      }

      showToast(json.mensagem, "sucesso");
      limparFormulario();
      await carregarConteudos();
    } catch (err) {
      console.error("Erro ao salvar conteúdo:", err);
      showToast(err.message || "Erro ao salvar conteúdo.", "erro");
    }
  });

// =============================================
// DELETAR
// =============================================

async function deletarConteudo(id) {
  if (
    !confirm(
      "Tem certeza que deseja deletar este conteúdo? Esta ação não pode ser desfeita.",
    )
  )
    return;

  try {
    const resp = await fetch(`${API_BASE}/conteudos/${id}`, {
      method: "DELETE",
    });
    const json = await resp.json();

    if (!resp.ok || !json.sucesso) {
      throw new Error(json.mensagem || "Erro ao deletar.");
    }

    showToast(json.mensagem, "sucesso");
    await carregarConteudos();
  } catch (err) {
    console.error("Erro ao deletar:", err);
    showToast(err.message || "Erro ao deletar conteúdo.", "erro");
  }
}

// =============================================
// CANCELAR EDIÇÃO
// =============================================

document
  .getElementById("btn-cancelar")
  .addEventListener("click", limparFormulario);

// =============================================
// CHECKLIST DE HOMOLOGAÇÃO
// =============================================

(function inicializarChecklist() {
  const salvo = JSON.parse(localStorage.getItem("verifica_checklist") || "{}");

  document.querySelectorAll("#checklist li").forEach((li) => {
    const key = li.dataset.key;
    if (salvo[key]) li.classList.add("marcado");
    atualizarIconeChecklist(li, salvo[key]);

    li.addEventListener("click", () => {
      const marcado = li.classList.toggle("marcado");
      atualizarIconeChecklist(li, marcado);
      const estado = JSON.parse(
        localStorage.getItem("verifica_checklist") || "{}",
      );
      estado[key] = marcado;
      localStorage.setItem("verifica_checklist", JSON.stringify(estado));
    });
  });
})();

function atualizarIconeChecklist(li, marcado) {
  const icone = li.querySelector(".check-icon");
  icone.innerHTML = marcado ? "&#9745;" : "&#9744;";
}

// =============================================
// INICIALIZAR
// =============================================

carregarConteudos();
