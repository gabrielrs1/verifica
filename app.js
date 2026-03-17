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
// DOWNLOAD PDF
// =============================================

async function baixarPDF(id) {
  try {
    const resp = await fetch(`${API_BASE}/conteudos/${id}`);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const { sucesso, dados } = await resp.json();
    if (!sucesso || !dados) throw new Error("Dados não encontrados.");

    const conteudo = dados;
    const nomeArquivo = `verifica_${conteudo.titulo
      .replace(/\s+/g, "_")
      .replace(/[^\w]/g, "")
      .substring(0, 40)}.pdf`;

    const nivelMap = ["", "Iniciante", "Intermediário", "Avançado"];
    const nivelTexto = `${nivelMap[conteudo.nivel_dificuldade] || "?"} (${conteudo.nivel_dificuldade}/3)`;
    const tipoLabel = tipoLabels[conteudo.tipo] || conteudo.tipo;
    const dataGeracao = new Date().toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const linhaAtualizacao =
      conteudo.atualizado_em && conteudo.atualizado_em !== conteudo.criado_em
        ? `<tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px 12px 8px 0; color: #6b7280; font-weight: 600; width: 180px;">Última atualização</td>
            <td style="padding: 8px 0; color: #111827;">${formatarData(conteudo.atualizado_em)}</td>
           </tr>`
        : "";

    const elementoHtml = document.createElement("div");
    elementoHtml.style.cssText =
      "font-family: Arial, Helvetica, sans-serif; padding: 32px; color: #111827; max-width: 680px;";
    elementoHtml.innerHTML = `
      <div style="border-bottom: 3px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px; text-align: center;">
        <p style="font-size: 11px; color: #6b7280; letter-spacing: 2px; text-transform: uppercase; margin: 0 0 10px; font-weight: 600;">
          VERIFICA — Combate às Fake News
        </p>
        <h1 style="font-size: 22px; color: #1d4ed8; margin: 0 0 12px; line-height: 1.35; font-weight: 700;">
          ${conteudo.titulo}
        </h1>
        <span style="display: inline-block; background: #dbeafe; color: #1d4ed8; padding: 4px 16px; border-radius: 99px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
          ${tipoLabel}
        </span>
      </div>

      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 14px;">
          Informações Gerais
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px 12px 8px 0; color: #6b7280; font-weight: 600; width: 180px;">Tipo de conteúdo</td>
            <td style="padding: 8px 0; color: #111827;">${tipoLabel}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px 12px 8px 0; color: #6b7280; font-weight: 600;">Nível de dificuldade</td>
            <td style="padding: 8px 0; color: #111827;">${nivelTexto}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f3f4f6;">
            <td style="padding: 8px 12px 8px 0; color: #6b7280; font-weight: 600;">Data de criação</td>
            <td style="padding: 8px 0; color: #111827;">${formatarData(conteudo.criado_em)}</td>
          </tr>
          ${linhaAtualizacao}
          <tr>
            <td style="padding: 8px 12px 8px 0; color: #6b7280; font-weight: 600;">Identificador</td>
            <td style="padding: 8px 0; color: #111827;">#${conteudo.id}</td>
          </tr>
        </table>
      </div>

      <div style="margin-bottom: 28px;">
        <h2 style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 14px;">
          Descrição Completa
        </h2>
        <p style="font-size: 14px; line-height: 1.85; color: #374151; text-align: justify; margin: 0; padding: 14px; background: #f9fafb; border-left: 3px solid #2563eb; border-radius: 0 6px 6px 0;">
          ${conteudo.descricao}
        </p>
      </div>

      <div style="margin-top: 32px; padding-top: 12px; border-top: 2px solid #e5e7eb; text-align: center; font-size: 10px; color: #9ca3af;">
        <p style="margin: 0 0 3px;">
          Documento gerado automaticamente pelo sistema <strong style="color: #6b7280;">Verifica</strong>
        </p>
        <p style="margin: 0;">Gerado em: ${dataGeracao}</p>
      </div>
    `;

    const opcoes = {
      margin: [15, 15, 15, 15],
      filename: nomeArquivo,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(opcoes).from(elementoHtml).save();
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
// EVENTOS DOS BOTÕES DO DETALHE
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
