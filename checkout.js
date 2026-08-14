document.addEventListener("DOMContentLoaded", () => {
 
    // ==========================
    // VARIÁVEIS
    // ==========================
 
    let etapaAtual = 1;
    let metodoPagamento = "PIX";
    let tempoReserva = "30 minutos";
    let desconto = 0;
 
    // ==========================
    // CHAVES DO LOCALSTORAGE (mesmas usadas em maquina.js)
    // ==========================
 
    const CARRINHO_KEY = "agilizaae_carrinho";
    const MAQUINA_KEY  = "agilizaae_maquina";
 
    // ==========================
    // ITENS DO PEDIDO (vindos do carrinho real, salvo em maquinas.html)
    // ==========================
 
    function carregarCarrinho() {
        try {
            const dados = localStorage.getItem(CARRINHO_KEY);
            const salvo = dados ? JSON.parse(dados) : [];
            // garante que todo item tenha qtd definida
            return salvo.map(item => ({
                nome: item.nome,
                preco: item.preco,
                qtd: item.qtd || 1
            }));
        } catch (e) {
            return [];
        }
    }
 
    function salvarCarrinho() {
        localStorage.setItem(CARRINHO_KEY, JSON.stringify(itens));
    }
 
    let itens = carregarCarrinho();
    const maquinaId = localStorage.getItem(MAQUINA_KEY) || "042";
 
    // Se não há itens no carrinho, não há o que pagar — volta para a seleção de produtos
    if (!itens.length) {
        window.location.href = "maquinas.html";
        return;
    }
 
    // ==========================
    // CABEÇALHO DINÂMICO
    // ==========================
 
    const tituloMaquinaEl = document.getElementById("tituloMaquina");
    const btnVoltarEl     = document.getElementById("btnVoltarMaquina");
 
    if (tituloMaquinaEl) {
        tituloMaquinaEl.textContent = `Máquina #${maquinaId} > Pagamento`;
    }
    if (btnVoltarEl) {
        btnVoltarEl.textContent = `Voltar para Máquina #${maquinaId}`;
    }
 
    // ==========================
    // ELEMENTOS
    // ==========================
 
    const etapas = document.querySelectorAll(".etapa");
    const steps = document.querySelectorAll(".step");
 
    const listaItens =
        document.getElementById("lista-itens");
 
    const subtotalEl =
        document.getElementById("subtotal");
 
    const descontoEl =
        document.getElementById("desconto");
 
    const totalEl =
        document.getElementById("valorTotal");
 
    const pagamentoInfo =
        document.getElementById("pagamento-info");
 
    const confirmacao =
        document.getElementById("confirmacao");
 
    // ==========================
    // ETAPAS
    // ==========================
 
    function mostrarEtapa(numero) {
 
        etapas.forEach(etapa =>
            etapa.classList.remove("active")
        );
 
        document
            .getElementById(`etapa${numero}`)
            .classList.add("active");
 
        steps.forEach((step, index) => {
 
            step.classList.remove("active");
 
            if (index < numero) {
                step.classList.add("active");
            }
 
        });
 
    }
 
    // ==========================
    // AVANÇAR
    // ==========================
 
    document
        .getElementById("avancar")
        .addEventListener("click", () => {
 
            if (etapaAtual < 4) {
 
                etapaAtual++;
 
                mostrarEtapa(etapaAtual);
 
            }
 
            if (etapaAtual === 4) {
 
                gerarResumo();
 
            }
 
        });
 
    // ==========================
    // VOLTAR
    // ==========================
 
    document
        .getElementById("voltar")
        .addEventListener("click", () => {
 
            if (etapaAtual > 1) {
 
                etapaAtual--;
 
                mostrarEtapa(etapaAtual);
 
            }
 
        });
 
    // ==========================
    // PAGAMENTO
    // ==========================
 
    document
        .querySelectorAll(".option")
        .forEach(opcao => {
 
            opcao.addEventListener("click", () => {
 
                document
                    .querySelectorAll(".option")
                    .forEach(o =>
                        o.classList.remove("active")
                    );
 
                opcao.classList.add("active");
 
                metodoPagamento =
                    opcao.dataset.pagamento;
 
            });
 
        });
 
    // ==========================
    // TEMPO
    // ==========================
 
    document
        .querySelectorAll(".tempo-btn")
        .forEach(btn => {
 
            btn.addEventListener("click", () => {
 
                document
                    .querySelectorAll(".tempo-btn")
                    .forEach(b =>
                        b.classList.remove("active")
                    );
 
                btn.classList.add("active");
 
                tempoReserva =
                    btn.innerText;
 
            });
 
        });
 
    // ==========================
    // CUPOM
    // ==========================
 
    document
        .getElementById("aplicarCupom")
        .addEventListener("click", () => {
 
            const cupom =
                document
                    .getElementById("cupom")
                    .value
                    .trim()
                    .toUpperCase();
 
            const msg =
                document.getElementById("mensagemCupom");
 
            if (cupom === "VERDE10") {
 
                desconto = calcularSubtotal() * 0.10;
 
                msg.innerHTML =
                    "✅ Cupom aplicado com sucesso";
 
                msg.style.color = "green";
 
            } else {
 
                desconto = 0;
 
                msg.innerHTML =
                    "❌ Cupom inválido";
 
                msg.style.color = "red";
            }
 
            atualizarResumo();
 
        });
 
    // ==========================
    // ITENS
    // ==========================
 
    function renderizarItens() {
 
        listaItens.innerHTML = "";
 
        itens.forEach((item, index) => {
 
            const subtotalItem = item.preco * item.qtd;
 
            listaItens.innerHTML += `
                <div class="item">
 
                    <span>${item.nome} <small>x${item.qtd}</small></span>
 
                    <strong>
                        R$ ${subtotalItem.toFixed(2)}
                    </strong>
 
                    <button
                        onclick="removerItem(${index})"
                    >
                        ✖
                    </button>
 
                </div>
            `;
 
        });
 
        atualizarResumo();
 
    }
 
    // tornar global
 
    window.removerItem = function(index) {
 
        itens.splice(index, 1);
 
        if (!itens.length) {
            // carrinho ficou vazio: limpa e volta para escolher produtos
            localStorage.removeItem(CARRINHO_KEY);
            window.location.href = "maquinas.html";
            return;
        }
 
        salvarCarrinho();
        renderizarItens();
 
    };
 
    // Botão agora leva de volta para escolher mais produtos na máquina
    document
        .getElementById("addItem")
        .addEventListener("click", () => {
 
            window.location.href = "maquinas.html";
 
        });
 
    // ==========================
    // TOTAIS
    // ==========================
 
    function calcularSubtotal() {
 
        return itens.reduce(
            (acc, item) =>
                acc + (item.preco * item.qtd),
            0
        );
 
    }
 
    function atualizarResumo() {
 
        const subtotal =
            calcularSubtotal();
 
        const total =
            subtotal - desconto;
 
        subtotalEl.innerText =
            `R$ ${subtotal.toFixed(2)}`;
 
        descontoEl.innerText =
            `R$ ${desconto.toFixed(2)}`;
 
        totalEl.innerText =
            `R$ ${total.toFixed(2)}`;
 
    }
 
    // ==========================
    // RESUMO FINAL
    // ==========================
 
    function gerarResumo() {
 
        pagamentoInfo.innerHTML = `
            <div class="card">
 
                <h2>
                    Resumo da Finalização
                </h2>
 
                <p>
                    Forma de pagamento:
                    <strong>${metodoPagamento}</strong>
                </p>
 
                <p>
                    Tempo:
                    <strong>${tempoReserva}</strong>
                </p>
 
                <p>
                    Desconto:
                    <strong>
                        ${desconto > 0 ? "Aplicado" : "Não utilizado"}
                    </strong>
                </p>
 
                <button
                    id="btnFinalizar"
                    class="finalizar">
 
                    Finalizar Pagamento
 
                </button>
 
            </div>
        `;
 
        document
            .getElementById("btnFinalizar")
            .addEventListener(
                "click",
                iniciarPagamento
            );
 
    }
 
    // ==========================
    // PAGAMENTO
    // ==========================
 
    function iniciarPagamento() {
 
        if (metodoPagamento === "PIX") {
 
            mostrarPix();
 
        } else {
 
            mostrarCartao();
 
        }
 
        setTimeout(() => {
 
            aprovarPagamento();
 
        }, 10000);
 
    }
 
    // ==========================
    // PIX
    // ==========================
 
    function mostrarPix() {
 
        const codigoPix =
            "00020126360014BRPIX123456789";
 
        pagamentoInfo.innerHTML = `
            <div class="card">
 
                <h2>Pagamento via PIX</h2>
 
                <p>✅ QR Code gerado</p>
 
                https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${codigoPix}
 
                <textarea
                    class="codigo-pix"
                    readonly
                >${codigoPix}</textarea>
 
                <button
                    id="copiarPix"
                    class="finalizar">
 
                    Copiar Código PIX
 
                </button>
 
                <p id="statusPix"></p>
 
            </div>
        `;
 
        document
            .getElementById("copiarPix")
            .addEventListener("click", () => {
 
                navigator.clipboard
                    .writeText(codigoPix);
 
                document
                    .getElementById("statusPix")
                    .innerHTML =
                    "✅ Código PIX copiado";
 
            });
 
    }
 
    // ==========================
    // CARTÃO
    // ==========================
 
    function mostrarCartao() {
 
        pagamentoInfo.innerHTML = `
            <div class="card">
 
                <h2>
                    Pagamento com cartão
                </h2>
 
                <div class="card-cartao">
 
                    <h3>VISA</h3>
 
                    <p>
                        **** **** **** 1234
                    </p>
 
                    <p>
                        Bruno P*** S***
                    </p>
 
                    <p>
                        Validade 12/30
                    </p>
 
                </div>
 
                <p>
                    ✅ Cartão cadastrado selecionado
                </p>
 
            </div>
        `;
 
    }
 
    // ==========================
    // APROVAÇÃO
    // ==========================
 
    function aprovarPagamento() {
 
        const codigoRetirada =
            Math.floor(
                100000 +
                Math.random() * 900000
            );
 
        // Pedido concluído: limpa o carrinho salvo
        localStorage.removeItem(CARRINHO_KEY);
 
        confirmacao.innerHTML = `
            <div class="card aprovado">
 
                <h2>
                    ✅ Pagamento aprovado
                </h2>
 
                <p>
                    Forma de pagamento:
                    <strong>
                        ${metodoPagamento}
                    </strong>
                </p>
 
                <p>
                    Tempo reservado:
                    <strong>
                        ${tempoReserva}
                    </strong>
                </p>
 
                <p>
                    Cupom:
                    <strong>
                        ${desconto > 0 ? "Aplicado" : "Não utilizado"}
                    </strong>
                </p>
 
                <h3>
                    Código de retirada
                </h3>
 
                <h1>
                    ${codigoRetirada}
                </h1>
 
                <p>
                    Apresente este código na máquina.
                </p>
 
            </div>
        `;
 
    }
 
    // ==========================
    // INICIALIZAÇÃO
    // ==========================
 
    mostrarEtapa(1);
 
    renderizarItens();
 
});