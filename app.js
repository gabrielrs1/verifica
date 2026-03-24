const API_BASE = "http://localhost:3000/api";

// =============================================
// TOAST NOTIFICATIONS
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
// FORMATAR DATA
// =============================================
function formatarData(dataStr) {
  if (!dataStr) return "";
  const data = new Date(dataStr);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// =============================================
// RENDERIZAR ESTRELAS
// =============================================
function renderizarEstrelas(nivel) {
  let html = "";
  for (let i = 1; i <= 3; i++) {
    html += `<span class="estrela${i > nivel ? " vazia" : ""}">&#9733;</span>`;
  }
  return html;
}

// =============================================
// BADGE DE TIPO
// =============================================
const tipoLabels = {
  artigo: "Artigo",
  dica: "Dica",
  caso_real: "Caso Real",
};

function renderizarBadge(tipo) {
  const label = tipoLabels[tipo] || tipo;
  return `<span class="badge badge-${tipo}">${label}</span>`;
}

// =============================================
// DOWNLOAD PDF (usa jsPDF diretamente - sem html2canvas)
// =============================================
async function baixarPDF(id) {
  try {
    const resp = await fetch(`${API_BASE}/conteudos/${id}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const { sucesso, dados } = await resp.json();
    if (!sucesso || !dados) throw new Error("Dados não encontrados.");

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    const nivelMap = ["", "Iniciante", "Intermediário", "Avançado"];
    const tipoLabel = tipoLabels[dados.tipo] || dados.tipo;

    // Cabeçalho
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text("VERIFICA — Combate às Fake News", pageWidth / 2, y, {
      align: "center",
    });
    y += 10;

    doc.setFontSize(18);
    doc.setTextColor(29, 78, 216);
    doc.text(dados.titulo, pageWidth / 2, y, { align: "center", maxWidth });
    y += 10;

    doc.setFontSize(10);
    doc.text(tipoLabel.toUpperCase(), pageWidth / 2, y, { align: "center" });
    y += 12;

    // Linha divisória
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;

    // Informações
    doc.setTextColor(55, 65, 81);
    doc.setFontSize(11);
    const infos = [
      `Tipo: ${tipoLabel}`,
      `Dificuldade: ${nivelMap[dados.nivel_dificuldade] || "?"} (${dados.nivel_dificuldade}/3)`,
      `Criado em: ${formatarData(dados.criado_em)}`,
      `ID: #${dados.id}`,
    ];
    infos.forEach((info) => {
      doc.text(info, margin, y);
      y += 6;
    });
    y += 8;

    // Conteúdo
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("CONTEÚDO", margin, y);
    y += 8;

    doc.setFontSize(11);
    doc.setTextColor(55, 65, 81);
    const linhas = doc.splitTextToSize(dados.descricao, maxWidth);
    for (const linha of linhas) {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(linha, margin, y);
      y += 6;
    }

    // Rodapé
    const dataGeracao = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175);
    doc.text(`Gerado em ${dataGeracao}`, pageWidth / 2, pageHeight - 10, {
      align: "center",
    });

    const nomeArquivo = `verifica_${dados.titulo.replace(/\s+/g, "_").replace(/[^\w]/g, "").substring(0, 40)}.pdf`;
    doc.save(nomeArquivo);
    showToast("PDF baixado com sucesso!", "sucesso");
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    showToast("Erro ao gerar PDF. Tente novamente.", "erro");
  }
}

// =============================================
// COMPARTILHAR
// =============================================
async function compartilhar(conteudo) {
  const dados = {
    title: "Conteúdo do Verifica",
    text: `Conheça esse conteúdo sobre fake news: ${conteudo.titulo}`,
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(dados);
    } catch (err) {
      if (err.name !== "AbortError") {
        showToast("Não foi possível compartilhar.", "erro");
      }
    }
  } else {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copiado para a área de transferência!", "sucesso");
    } catch {
      showToast("Não foi possível copiar o link.", "erro");
    }
  }
}

// =============================================
// NAVEGAÇÃO: LISTA <-> DETALHE
// =============================================
const secaoLista = document.getElementById("lista-modulos");
const secaoDetalhe = document.getElementById("detalhe-modulo");

function mostrarLista() {
  secaoDetalhe.style.display = "none";
  secaoLista.style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function mostrarDetalhe() {
  secaoLista.style.display = "none";
  secaoDetalhe.style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// =============================================
// ABRIR MÓDULO (detalhe)
// =============================================
let moduloAtivo = null;

async function abrirModulo(id) {
  try {
    const resp = await fetch(`${API_BASE}/modulos/${id}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const { sucesso, dados } = await resp.json();
    if (!sucesso) throw new Error("Erro na API.");

    moduloAtivo = dados;

    document.getElementById("detalhe-titulo").textContent = dados.titulo;
    document.getElementById("detalhe-badge").innerHTML = renderizarBadge(
      dados.tipo,
    );
    document.getElementById("detalhe-nivel").innerHTML = `
      <span class="nivel-label">Dificuldade:</span>
      ${renderizarEstrelas(dados.nivel_dificuldade)}
    `;
    document.getElementById("detalhe-descricao").textContent = dados.descricao;
    document.getElementById("detalhe-data").textContent =
      `Criado em ${formatarData(dados.criado_em)}`;

    mostrarDetalhe();
  } catch (err) {
    console.error("Erro ao abrir módulo:", err);
    showToast("Não foi possível carregar o conteúdo.", "erro");
  }
}

// =============================================
// RENDERIZAR CARD DE MÓDULO (clicável)
// =============================================
function criarCardModulo(modulo) {
  const card = document.createElement("article");
  card.className = "card card-modulo";
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-label", `Abrir módulo: ${modulo.titulo}`);
  card.innerHTML = `
    <div class="card-header">
      <h2>${modulo.titulo}</h2>
      ${renderizarBadge(modulo.tipo)}
    </div>
    <div class="card-meta">
      <div class="nivel">
        <span class="nivel-label">Dificuldade:</span>
        ${renderizarEstrelas(modulo.nivel_dificuldade)}
      </div>
      <div class="card-meta-actions">
        <span class="card-modulo-cta">Ler conteúdo &#8250;</span>
        <button class="btn-pdf-card" data-id="${modulo.id}" title="Baixar como PDF" aria-label="Baixar PDF: ${modulo.titulo}">
          &#128196; PDF
        </button>
      </div>
    </div>
  `;

  const abrir = () => abrirModulo(modulo.id);
  card.addEventListener("click", abrir);
  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      abrir();
    }
  });

  card.querySelector(".btn-pdf-card").addEventListener("click", (e) => {
    e.stopPropagation();
    baixarPDF(modulo.id);
  });

  return card;
}

// =============================================
// CARREGAR LISTA DE MÓDULOS
// =============================================
async function carregarModulos() {
  const grid = document.getElementById("modulos-grid");
  grid.innerHTML = '<div class="loading">Carregando módulos...</div>';

  try {
    const resp = await fetch(`${API_BASE}/modulos`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const { sucesso, dados } = await resp.json();
    if (!sucesso) throw new Error("API retornou erro.");

    grid.innerHTML = "";

    if (!dados || dados.length === 0) {
      grid.innerHTML = `
        <div class="empty-state">
          <span class="empty-icon">&#128270;</span>
          <p>Nenhum conteúdo disponível ainda.</p>
          <p>Acesse o <a href="admin.html">Painel Admin</a> para adicionar conteúdos.</p>
        </div>
      `;
      return;
    }

    dados.forEach((modulo) => {
      grid.appendChild(criarCardModulo(modulo));
    });
  } catch (err) {
    console.error("Erro ao carregar módulos:", err);
    grid.innerHTML = `
      <div class="error-state">
        <span style="font-size:2.5rem;display:block;margin-bottom:.75rem">&#9888;&#65039;</span>
        <p>Não foi possível carregar os módulos.</p>
        <p style="font-size:.85rem;margin-top:.5rem">Verifique se o servidor está rodando em <strong>localhost:3000</strong>.</p>
      </div>
    `;
  }
}

// =============================================
// EVENTOS BOTÕES DO DETALHE
// =============================================
document.getElementById("btn-voltar").addEventListener("click", mostrarLista);

document.getElementById("btn-pdf").addEventListener("click", () => {
  if (moduloAtivo) baixarPDF(moduloAtivo.id);
});

document.getElementById("btn-share").addEventListener("click", () => {
  if (moduloAtivo) compartilhar(moduloAtivo);
});

// =============================================
// INICIALIZAR
// =============================================
document.addEventListener("DOMContentLoaded", carregarModulos);
