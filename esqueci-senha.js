/* ============================================
   esqueci-senha.js — AgilizaAê
   ============================================ */

// ─── ELEMENTOS ───────────────────────────────

const telaFormulario   = document.getElementById('tela-formulario');
const telaConfirmacao  = document.getElementById('tela-confirmacao');
const formEsqueci      = document.getElementById('formEsqueciSenha');
const inputEmail       = document.getElementById('email');
const erroEmail        = document.getElementById('erro-email');
const btnEnviar        = document.getElementById('btnEnviar');
const btnReenviar      = document.getElementById('btnReenviar');
const emailDestino     = document.getElementById('emailDestino');
const esTimer          = document.getElementById('esTimer');

// ─── ESTADO ──────────────────────────────────

let timerReenvio = null;
let segundosRestantes = 0;

// ─── ENVIO DO FORMULÁRIO ─────────────────────

formEsqueci.addEventListener('submit', async function (e) {
    e.preventDefault();

    erroEmail.textContent = '';

    const email = inputEmail.value.trim();

    // Validação
    if (!email) {
        erroEmail.textContent = 'Informe seu e-mail.';
        inputEmail.focus();
        return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        erroEmail.textContent = 'E-mail inválido.';
        inputEmail.focus();
        return;
    }

    // Estado de loading
    setLoadingEnviar(true);

    // Simula chamada à API
    await aguardar(1800);

    setLoadingEnviar(false);

    // Exibe tela de confirmação
    mostrarConfirmacao(email);
});

// ─── REENVIO ─────────────────────────────────

btnReenviar.addEventListener('click', async function () {
    setLoadingReenviar(true);

    await aguardar(1800);

    setLoadingReenviar(false);
    iniciarTimerReenvio();
});

// ─── TRANSIÇÃO PARA CONFIRMAÇÃO ──────────────

function mostrarConfirmacao(email) {
    // Preenche o e-mail de destino
    emailDestino.textContent = email;

    // Troca as telas
    telaFormulario.hidden = true;
    telaConfirmacao.hidden = false;

    // Inicia o timer de reenvio (60 segundos)
    iniciarTimerReenvio();
}

// ─── TIMER DE REENVIO ────────────────────────

function iniciarTimerReenvio() {
    // Desabilita o botão de reenvio enquanto conta
    btnReenviar.disabled = true;
    btnReenviar.querySelector('.btn-texto').style.opacity = '0.5';

    segundosRestantes = 60;
    atualizarTimer();

    clearInterval(timerReenvio);
    timerReenvio = setInterval(() => {
        segundosRestantes--;
        atualizarTimer();

        if (segundosRestantes <= 0) {
            clearInterval(timerReenvio);
            esTimer.textContent = '';
            btnReenviar.disabled = false;
            btnReenviar.querySelector('.btn-texto').style.opacity = '1';
        }
    }, 1000);
}

function atualizarTimer() {
    esTimer.textContent = `Reenviar disponível em ${segundosRestantes}s`;
}

// ─── ESTADOS DE LOADING ──────────────────────

function setLoadingEnviar(ativo) {
    const texto   = btnEnviar.querySelector('.btn-texto');
    const loading = btnEnviar.querySelector('.btn-loading');
    btnEnviar.disabled = ativo;
    texto.hidden       = ativo;
    loading.hidden     = !ativo;
}

function setLoadingReenviar(ativo) {
    const texto   = btnReenviar.querySelector('.btn-texto');
    const loading = btnReenviar.querySelector('.btn-loading');
    btnReenviar.disabled = ativo;
    texto.hidden         = ativo;
    loading.hidden       = !ativo;
}

// ─── UTILITÁRIO ──────────────────────────────

function aguardar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}