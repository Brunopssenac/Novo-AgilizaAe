/////////////////////////////////////////////////////
// DADOS — COORDENADAS E INFORMAÇÕES DAS MÁQUINAS
/////////////////////////////////////////////////////

const dadosMaquinas = {
    "042": {
        lat: -23.5630, lng: -46.6543,
        nome: "#042 Av. Paulista",
        local: "Estação Paulista",
        produtos: 18,
        desconto: 35,
        tags: ["🔥 Promoção", "🌱 ESG"]
    },
    "031": {
        lat: -23.5872, lng: -46.6856,
        nome: "#031 Faria Lima",
        local: "Itaim Bibi",
        produtos: 12,
        desconto: 20,
        tags: ["✅ Disponível"]
    },
    "017": {
        lat: -23.5613, lng: -46.6560,
        nome: "#017 MASP",
        local: "Av. Paulista",
        produtos: 9,
        desconto: 30,
        tags: ["🌱 ESG", "🔥 Promoção"]
    }
};

/////////////////////////////////////////////////////
// DADOS — PRODUTOS POR MÁQUINA
/////////////////////////////////////////////////////

const produtosPorMaquina = {
    "042": [
        { nome: "Salada Caesar",     preco: 11.70, desconto: 35, img: "img/salada.png",     validade: "Vence hoje" },
        { nome: "Suco Natural",      preco: 8.64,  desconto: 28, img: "img/suco.png",       validade: "Vence hoje" },
        { nome: "Iogurte Grego",     preco: 6.50,  desconto: 20, img: "img/iogurte.png",    validade: "Vence amanhã" }
    ],
    "031": [
        { nome: "Wrap Integral",     preco: 12.00, desconto: 20, img: "img/wrap.png",       validade: "Vence hoje" },
        { nome: "Vitamina Frutas",   preco: 7.70,  desconto: 30, img: "img/vitamina.png",   validade: "Vence hoje" }
    ],
    "017": [
        { nome: "Bento Box",         preco: 17.60, desconto: 20, img: "img/bento.png",      validade: "Vence hoje" },
        { nome: "Sanduíche Natural", preco: 9.10,  desconto: 35, img: "img/sanduiche.png",  validade: "Vence amanhã" },
        { nome: "Água de Coco",      preco: 5.90,  desconto: 15, img: "img/agua.png",       validade: "Vence hoje" }
    ]
};

let maquinaAtual = "042";

/////////////////////////////////////////////////////
// MAPA LEAFLET
/////////////////////////////////////////////////////

let mapa = null;
const marcadores = {};

function iniciarMapa() {
    // Centraliza na Av. Paulista com zoom 14
    mapa = L.map("mapa", { zoomControl: true }).setView([-23.5630, -46.6543], 14);

    // Tiles OpenStreetMap (gratuito, sem API key)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19
    }).addTo(mapa);

    // Ícone personalizado com a identidade do AgilizaAê
    const iconeAgiliza = L.divIcon({
        className: "",
        html: `<div style="
            background: #ff5a1f;
            color: white;
            width: 38px;
            height: 38px;
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 10px rgba(255,90,31,.45);
            border: 2px solid white;
        ">
            <span style="transform: rotate(45deg); font-size: 16px;">🤖</span>
        </div>`,
        iconSize: [38, 38],
        iconAnchor: [19, 38],
        popupAnchor: [0, -42]
    });

    // Criar marcador para cada máquina
    Object.entries(dadosMaquinas).forEach(([id, m]) => {
        const marker = L.marker([m.lat, m.lng], { icon: iconeAgiliza })
            .addTo(mapa)
            .bindPopup(criarHtmlPopup(id, m), {
                maxWidth: 260,
                className: ""
            });

        marcadores[id] = marker;

        // Clicar no marcador seleciona a máquina na sidebar
        marker.on("click", () => {
            selecionarMaquinaSidebar(id);
        });
    });

    // Abrir popup da máquina inicial
    marcadores["042"].openPopup();
}

// Gera o HTML interno do popup
function criarHtmlPopup(id, m) {
    const tagsHtml = m.tags.map(t =>
        `<span style="font-size:10px;font-weight:700;background:#f0f0f0;
         padding:3px 8px;border-radius:20px;color:#555">${t}</span>`
    ).join("");

    return `
        <div class="mapa-popup">
            <h4>${m.nome}</h4>
            <p class="popup-local">📍 ${m.local}</p>
            <div class="popup-stats">
                <div class="popup-stat">
                    <strong>${m.produtos}</strong>
                    <span>Produtos</span>
                </div>
                <div class="popup-stat">
                    <strong>-${m.desconto}%</strong>
                    <span>Desconto</span>
                </div>
            </div>
            <div class="popup-tags">${tagsHtml}</div>
            <button class="btn-popup" onclick="verProdutosDaMaquina('${id}')">
                Ver produtos →
            </button>
        </div>
    `;
}

// Clique no botão "Ver produtos" dentro do popup
function verProdutosDaMaquina(id) {
    selecionarMaquinaSidebar(id);
    alternarVista("produtos");
}

// Foca no marcador do mapa e abre o popup
function focarMaquinaNoMapa(id) {
    const m = dadosMaquinas[id];
    if (!m || !mapa) return;
    mapa.setView([m.lat, m.lng], 16, { animate: true, duration: 0.5 });
    setTimeout(() => marcadores[id].openPopup(), 400);
}

/////////////////////////////////////////////////////
// ALTERNÂNCIA MAPA / PRODUTOS
/////////////////////////////////////////////////////

function alternarVista(vista) {
    const ehMapa = vista === "mapa";

    document.getElementById("painelMapa").style.display    = ehMapa ? "" : "none";
    document.getElementById("painelProdutos").style.display = ehMapa ? "none" : "";
    document.getElementById("btnMapa").classList.toggle("ativo", ehMapa);
    document.getElementById("btnProdutos").classList.toggle("ativo", !ehMapa);

    // Leaflet precisa recalcular tamanho ao ficar visível novamente
    if (ehMapa && mapa) {
        setTimeout(() => mapa.invalidateSize(), 50);
    }
}

/////////////////////////////////////////////////////
// UTILITÁRIOS
/////////////////////////////////////////////////////

function calcPrecoOriginal(preco, desconto) {
    return (preco / (1 - desconto / 100)).toFixed(2);
}

function mostrarToast(msg) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    void toast.offsetWidth;
    toast.classList.add("ativo");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove("ativo"), 2500);
}

/////////////////////////////////////////////////////
// SKELETON LOADING
/////////////////////////////////////////////////////

function mostrarSkeleton(qtd = 3) {
    const grid = document.getElementById("gridProdutos");
    grid.innerHTML = "";
    for (let i = 0; i < qtd; i++) {
        grid.innerHTML += `
            <div class="skeleton-card">
                <div class="skeleton skeleton-img"></div>
                <div class="skeleton skeleton-line media"></div>
                <div class="skeleton skeleton-line curta"></div>
                <div class="skeleton skeleton-line media"></div>
                <div class="skeleton skeleton-btn"></div>
            </div>
        `;
    }
}

/////////////////////////////////////////////////////
// RENDER PRODUTOS
/////////////////////////////////////////////////////

const ordenacaoEl = document.getElementById("ordenacao");

function renderProdutos(maquinaId, ordenar = "padrao") {
    maquinaAtual = maquinaId;

    const grid    = document.getElementById("gridProdutos");
    const vazio   = document.getElementById("produtosVazio");
    const titulo  = document.getElementById("tituloProdutos");
    const sub     = document.getElementById("subtituloProdutos");
    const maquina = document.querySelector(`.maquina[data-id="${maquinaId}"]`);

    if (maquina) {
        titulo.textContent = maquina.querySelector("h3").textContent;
        sub.textContent    = maquina.querySelector("p").textContent;
    }

    mostrarSkeleton();
    vazio.style.display = "none";

    setTimeout(() => {
        let produtos = [...(produtosPorMaquina[maquinaId] || [])];

        if (ordenar === "preco-asc")  produtos.sort((a, b) => a.preco - b.preco);
        if (ordenar === "preco-desc") produtos.sort((a, b) => b.preco - a.preco);
        if (ordenar === "desconto")   produtos.sort((a, b) => b.desconto - a.desconto);

        grid.innerHTML = "";
        vazio.style.display = "none";

        if (!produtos.length) {
            vazio.style.display = "flex";
            return;
        }

        produtos.forEach(prod => {
            const original = calcPrecoOriginal(prod.preco, prod.desconto);

            grid.innerHTML += `
                <div class="produto-card">
                    <div class="produto-card-topo">
                        <img src="${prod.img}" alt="${prod.nome}" onerror="this.style.display='none'">
                    </div>
                    <span class="desconto">-${prod.desconto}%</span>
                    <h3>${prod.nome}</h3>
                    <span class="produto-validade">⏰ ${prod.validade}</span>
                    <div class="precos">
                        <span class="preco-original">R$ ${original}</span>
                        <strong>R$ ${prod.preco.toFixed(2)}</strong>
                    </div>
                    <div class="quantidade">
                        <button class="menos">−</button>
                        <span class="qtd">1</span>
                        <button class="mais">+</button>
                    </div>
                    <button class="btn-comprar-card">
                        Adicionar ao carrinho
                    </button>
                </div>
            `;
        });

        ativarEventosProdutos();

    }, 400);
}

/////////////////////////////////////////////////////
// EVENTOS DOS CARDS DE PRODUTO
/////////////////////////////////////////////////////

function ativarEventosProdutos() {
    document.querySelectorAll(".produto-card").forEach(card => {
        let qtd = 1;

        const btnMais  = card.querySelector(".mais");
        const btnMenos = card.querySelector(".menos");
        const qtdSpan  = card.querySelector(".qtd");

        btnMais.addEventListener("click", (e) => {
            e.stopPropagation();
            qtd++;
            qtdSpan.textContent = qtd;
        });

        btnMenos.addEventListener("click", (e) => {
            e.stopPropagation();
            if (qtd > 1) { qtd--; qtdSpan.textContent = qtd; }
        });

        card.querySelector(".btn-comprar-card").addEventListener("click", () => {
            const nome  = card.querySelector("h3").textContent;
            const preco = parseFloat(
                card.querySelector("strong").textContent.replace("R$", "").replace(",", ".").trim()
            );
            adicionarCarrinho(nome, preco, qtd);
        });
    });
}

/////////////////////////////////////////////////////
// ORDENAÇÃO
/////////////////////////////////////////////////////

if (ordenacaoEl) {
    ordenacaoEl.addEventListener("change", () => {
        renderProdutos(maquinaAtual, ordenacaoEl.value);
    });
}

/////////////////////////////////////////////////////
// SELEÇÃO DE MÁQUINA (sidebar)
/////////////////////////////////////////////////////

const cardsMaquinas = document.querySelectorAll(".maquina");

// Seleciona visualmente na sidebar + renderiza produtos + foca no mapa
function selecionarMaquinaSidebar(id) {
    cardsMaquinas.forEach(c => c.classList.remove("ativa"));
    const card = document.querySelector(`.maquina[data-id="${id}"]`);
    if (card) card.classList.add("ativa");
    if (ordenacaoEl) ordenacaoEl.value = "padrao";
    renderProdutos(id);
    focarMaquinaNoMapa(id);
}

cardsMaquinas.forEach(card => {
    card.addEventListener("click", () => {
        selecionarMaquinaSidebar(card.dataset.id);
    });
});

/////////////////////////////////////////////////////
// BUSCA DE MÁQUINAS
/////////////////////////////////////////////////////

const inputBusca = document.getElementById("inputBusca");
const btnLimpar  = document.getElementById("btnLimparBusca");
const nenhumaEl  = document.getElementById("nenhumaMaquina");

function filtrarMaquinas(termo) {
    let visiveis = 0;
    cardsMaquinas.forEach(card => {
        const texto = (card.dataset.bairro + " " + card.querySelector("h3").textContent).toLowerCase();
        const match = texto.includes(termo.toLowerCase());
        card.style.display = match ? "" : "none";
        if (match) visiveis++;
    });
    nenhumaEl.style.display = visiveis > 0 ? "none" : "block";
    btnLimpar.style.display = termo ? "block" : "none";
}

if (inputBusca) {
    inputBusca.addEventListener("input", e => filtrarMaquinas(e.target.value));
}

if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
        inputBusca.value = "";
        filtrarMaquinas("");
        inputBusca.focus();
    });
}

/////////////////////////////////////////////////////
// FILTROS (tags)
/////////////////////////////////////////////////////

const filtros = document.querySelectorAll(".filtro");

filtros.forEach(filtro => {
    filtro.addEventListener("click", () => {
        filtros.forEach(f => f.classList.remove("ativo"));
        filtro.classList.add("ativo");

        const tag = filtro.dataset.filtro;

        cardsMaquinas.forEach(card => {
            if (tag === "todos") {
                card.style.display = "";
            } else {
                const tags = card.dataset.tags || "";
                card.style.display = tags.includes(tag) ? "" : "none";
            }
        });

        const visiveis = [...cardsMaquinas].filter(c => c.style.display !== "none").length;
        nenhumaEl.style.display = visiveis > 0 ? "none" : "block";
    });
});

/////////////////////////////////////////////////////
// CARRINHO
/////////////////////////////////////////////////////

const CARRINHO_KEY = "agilizaae_carrinho";
const MAQUINA_KEY  = "agilizaae_maquina";

// Recupera o carrinho salvo (se o usuário já tinha itens antes de recarregar)
function carregarCarrinho() {
    try {
        const dados = localStorage.getItem(CARRINHO_KEY);
        return dados ? JSON.parse(dados) : [];
    } catch (e) {
        return [];
    }
}

// Salva carrinho + máquina atual para o checkout conseguir ler depois
function salvarCarrinho() {
    localStorage.setItem(CARRINHO_KEY, JSON.stringify(carrinho));
    localStorage.setItem(MAQUINA_KEY, maquinaAtual);
}

let carrinho = carregarCarrinho();

function atualizarBadge() {
    const badge = document.getElementById("badgeCarrinho");
    const total = carrinho.reduce((s, i) => s + i.qtd, 0);
    badge.textContent = total;
    badge.style.display = total === 0 ? "none" : "flex";

    const btnFinalizar = document.getElementById("btnFinalizar");
    if (btnFinalizar) btnFinalizar.disabled = total === 0;
}

function adicionarCarrinho(nome, preco, qtd = 1) {
    const idx = carrinho.findIndex(i => i.nome === nome);
    if (idx >= 0) {
        carrinho[idx].qtd += qtd;
    } else {
        carrinho.push({ nome, preco, qtd });
    }
    atualizarCarrinho();
    mostrarToast(`🛒 ${nome} adicionado!`);
    document.getElementById("carrinho").classList.add("ativo");
    document.getElementById("overlay").classList.add("ativo");
}

function alterarQtdCarrinho(index, delta) {
    carrinho[index].qtd += delta;
    if (carrinho[index].qtd <= 0) carrinho.splice(index, 1);
    atualizarCarrinho();
}

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

function fecharCarrinho() {
    document.getElementById("carrinho").classList.remove("ativo");
    document.getElementById("overlay").classList.remove("ativo");
}

function toggleCarrinho() {
    const aberto = document.getElementById("carrinho").classList.toggle("ativo");
    document.getElementById("overlay").classList.toggle("ativo", aberto);
}

function atualizarCarrinho() {
    const lista   = document.getElementById("listaCarrinho");
    const totalEl = document.getElementById("totalCarrinho");

    if (!lista) return;

    lista.innerHTML = "";

    if (!carrinho.length) {
        lista.innerHTML = `
            <div class="carrinho-vazio">
                <span class="carrinho-vazio-icone">🛍️</span>
                <p>Carrinho vazio</p>
                <small>Adicione produtos para continuar</small>
            </div>
        `;
        if (totalEl) totalEl.textContent = "R$ 0,00";
        atualizarBadge();
        return;
    }

    let total = 0;

    carrinho.forEach((item, index) => {
        const subtotal = item.preco * item.qtd;
        total += subtotal;

        lista.innerHTML += `
            <div class="item-carrinho">
                <div class="item-info">
                    <span class="item-nome">${item.nome}</span>
                    <span class="item-subtotal">R$ ${subtotal.toFixed(2)}</span>
                </div>
                <div class="item-controles">
                    <button class="ctrl-qtd" onclick="alterarQtdCarrinho(${index}, -1)">−</button>
                    <span class="item-qtd">${item.qtd}</span>
                    <button class="ctrl-qtd" onclick="alterarQtdCarrinho(${index}, +1)">+</button>
                    <button class="remover-item" onclick="removerItem(${index})" title="Remover">✕</button>
                </div>
            </div>
        `;
    });

    if (totalEl) totalEl.textContent = "R$ " + total.toFixed(2);
    atualizarBadge();
    salvarCarrinho();
}

/////////////////////////////////////////////////////
// INICIALIZAÇÃO
/////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", () => {
    iniciarMapa();
    renderProdutos("042");
    atualizarCarrinho(); // renderiza carrinho restaurado do localStorage, se houver
});