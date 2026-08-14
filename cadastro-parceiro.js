/* ============================================
   cadastro-parceiro.js — AgilizaAê
   ============================================ */

// ─── ESTADO ──────────────────────────────────

let etapaAtual = 1;
const TOTAL_ETAPAS = 4;

// ─── NAVEGAÇÃO DE ETAPAS ─────────────────────

function irParaEtapa(numero) {
    if (numero > etapaAtual && !validarEtapa(etapaAtual)) return;

    // Ocultar etapa atual
    document.getElementById(`etapa-${etapaAtual}`).classList.remove('ativa');

    // Atualizar indicadores
    atualizarSteps(numero);

    // Mostrar nova etapa
    etapaAtual = numero;
    document.getElementById(`etapa-${etapaAtual}`).classList.add('ativa');

    // Scroll suave para o topo do card
    document.querySelector('.cp-card').scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Se chegou na etapa 4, montar o resumo
    if (etapaAtual === 4) montarResumo();
}

function atualizarSteps(proximaEtapa) {
    for (let i = 1; i <= TOTAL_ETAPAS; i++) {
        const stepEl = document.getElementById(`step-ind-${i}`);
        stepEl.classList.remove('ativo', 'concluido');

        if (i < proximaEtapa) stepEl.classList.add('concluido');
        else if (i === proximaEtapa) stepEl.classList.add('ativo');
    }

    // Linhas entre os steps
    const linhas = document.querySelectorAll('.cp-step-linha');
    linhas.forEach((linha, idx) => {
        linha.classList.toggle('ativa', idx < proximaEtapa - 1);
    });
}

// ─── VALIDAÇÃO POR ETAPA ─────────────────────

function validarEtapa(etapa) {
    limparErros();
    let valido = true;

    if (etapa === 1) {
        if (!validarCNPJ()) valido = false;
        if (!exigir('razaoSocial', 'Informe a razão social.')) valido = false;
        if (!exigir('nomeFantasia', 'Informe o nome fantasia.')) valido = false;
        if (!exigirSelect('segmento', 'Selecione o segmento.')) valido = false;
    }

    if (etapa === 2) {
        if (!exigir('nomeResponsavel', 'Informe o nome do responsável.')) valido = false;
        if (!exigir('cargo', 'Informe o cargo.')) valido = false;
        if (!validarEmail('emailCorporativo', 'E-mail corporativo inválido.')) valido = false;
        if (!validarTelefone()) valido = false;
        if (!exigirSelect('volumeMensal', 'Selecione o volume mensal.')) valido = false;
    }

    if (etapa === 3) {
        const selecionadas = document.querySelectorAll('input[name="categoria"]:checked');
        if (selecionadas.length === 0) {
            mostrarErro('categorias', 'Selecione pelo menos um tipo de produto.');
            valido = false;
        }
    }

    if (etapa === 4) {
        if (!validarEmail('emailAcesso', 'E-mail de acesso inválido.')) valido = false;

        const emailAcesso = document.getElementById('emailAcesso').value.trim();
        const emailConfirm = document.getElementById('emailAcessoConfirm').value.trim();
        if (emailAcesso !== emailConfirm) {
            mostrarErro('emailAcessoConfirm', 'Os e-mails não coincidem.');
            valido = false;
        }

        if (!validarSenha()) valido = false;

        if (!document.getElementById('aceitaTermos').checked) {
            mostrarErro('termos', 'Você precisa aceitar os termos para continuar.');
            valido = false;
        }
    }

    return valido;
}

// ─── VALIDADORES INDIVIDUAIS ─────────────────

function exigir(id, msg) {
    const val = document.getElementById(id).value.trim();
    if (!val) { mostrarErro(id, msg); return false; }
    return true;
}

function exigirSelect(id, msg) {
    const val = document.getElementById(id).value;
    if (!val) { mostrarErro(id, msg); return false; }
    return true;
}

function validarEmail(id, msg) {
    const val = document.getElementById(id).value.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(val)) { mostrarErro(id, msg); return false; }
    return true;
}

function validarCNPJ() {
    const input = document.getElementById('cnpj');
    const val = input.value.replace(/\D/g, '');

    if (val.length !== 14) {
        mostrarErro('cnpj', 'CNPJ inválido. Informe os 14 dígitos.');
        return false;
    }

    // Validação básica de dígitos repetidos
    if (/^(\d)\1+$/.test(val)) {
        mostrarErro('cnpj', 'CNPJ inválido.');
        return false;
    }

    return true;
}

function validarTelefone() {
    const val = document.getElementById('telefone').value.replace(/\D/g, '');
    if (val.length < 10 || val.length > 11) {
        mostrarErro('telefone', 'Telefone inválido. Ex: (11) 90000-0000');
        return false;
    }
    return true;
}

function validarSenha() {
    const senha = document.getElementById('senha').value;
    const confirmar = document.getElementById('confirmarSenha').value;
    let valido = true;

    if (senha.length < 8) {
        mostrarErro('senha', 'A senha deve ter pelo menos 8 caracteres.');
        valido = false;
    }

    if (senha && confirmar && senha !== confirmar) {
        mostrarErro('confirmarSenha', 'As senhas não coincidem.');
        valido = false;
    }

    return valido;
}

// ─── UTILITÁRIOS DE ERRO ─────────────────────

function mostrarErro(id, msg) {
    const el = document.getElementById(`erro-${id}`);
    if (el) el.textContent = msg;
}

function limparErros() {
    document.querySelectorAll('.erro').forEach(el => el.textContent = '');
}

// ─── FORMATAÇÕES ─────────────────────────────

document.getElementById('cnpj').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').substring(0, 14);
    v = v.replace(/^(\d{2})(\d)/, '$1.$2');
    v = v.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    v = v.replace(/\.(\d{3})(\d)/, '.$1/$2');
    v = v.replace(/(\d{4})(\d)/, '$1-$2');
    this.value = v;
});

document.getElementById('telefone').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').substring(0, 11);
    if (v.length <= 10) {
        v = v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else {
        v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
    }
    this.value = v.trim().replace(/-$/, '');
});

// ─── TOGGLE SENHA ────────────────────────────

document.querySelectorAll('.toggle-senha').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.alvo);
        const visivel = input.type === 'text';
        input.type = visivel ? 'password' : 'text';
        btn.textContent = visivel ? '👁' : '🙈';
    });
});

// ─── BUSCA DE CEP ────────────────────────────

document.getElementById('btnBuscarCep').addEventListener('click', buscarCep);
document.getElementById('cep').addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').substring(0, 8);
    if (v.length > 5) v = v.substring(0, 5) + '-' + v.substring(5);
    this.value = v;
});
document.getElementById('cep').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); buscarCep(); }
});

async function buscarCep() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    if (cep.length !== 8) {
        mostrarErro('cep', 'CEP deve ter 8 dígitos.');
        return;
    }

    const btn = document.getElementById('btnBuscarCep');
    btn.textContent = '...';
    btn.disabled = true;

    try {
        const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await res.json();

        if (data.erro) {
            mostrarErro('cep', 'CEP não encontrado.');
        } else {
            document.getElementById('rua').value    = data.logradouro || '';
            document.getElementById('bairro').value = data.bairro     || '';
            document.getElementById('cidade').value = data.localidade  || '';
            document.getElementById('estado').value = data.uf          || '';
            document.getElementById('numero').focus();
        }
    } catch {
        mostrarErro('cep', 'Não foi possível buscar o CEP. Preencha manualmente.');
    } finally {
        btn.textContent = 'Buscar';
        btn.disabled = false;
    }
}

// ─── RESUMO NA ETAPA 4 ───────────────────────

function montarResumo() {
    const resumo = document.getElementById('cpResumo');

    const razao    = document.getElementById('razaoSocial').value.trim();
    const fantasia = document.getElementById('nomeFantasia').value.trim();
    const cnpj     = document.getElementById('cnpj').value.trim();
    const segmento = document.getElementById('segmento').selectedOptions[0]?.text || '—';
    const responsavel = document.getElementById('nomeResponsavel').value.trim();
    const email    = document.getElementById('emailCorporativo').value.trim();
    const telefone = document.getElementById('telefone').value.trim();

    const categoriasSel = [...document.querySelectorAll('input[name="categoria"]:checked')]
        .map(el => el.closest('.cp-categoria').querySelector('strong').textContent)
        .join(', ') || '—';

    resumo.innerHTML = `
        <div class="cp-resumo-titulo">Resumo do cadastro</div>
        <div class="cp-resumo-linha"><span>Razão social</span><span>${razao}</span></div>
        <div class="cp-resumo-linha"><span>Nome fantasia</span><span>${fantasia}</span></div>
        <div class="cp-resumo-linha"><span>CNPJ</span><span>${cnpj}</span></div>
        <div class="cp-resumo-linha"><span>Segmento</span><span>${segmento}</span></div>
        <div class="cp-resumo-linha"><span>Responsável</span><span>${responsavel}</span></div>
        <div class="cp-resumo-linha"><span>E-mail</span><span>${email}</span></div>
        <div class="cp-resumo-linha"><span>Telefone</span><span>${telefone}</span></div>
        <div class="cp-resumo-linha"><span>Produtos</span><span>${categoriasSel}</span></div>
    `;

    resumo.classList.add('visivel');
}

// ─── SUBMIT FINAL ────────────────────────────

document.getElementById('formCadastroParceiro').addEventListener('submit', async function (e) {
    e.preventDefault();

    if (!validarEtapa(4)) return;

    const btn     = document.getElementById('btnCadastrar');
    const texto   = btn.querySelector('.btn-texto');
    const loading = btn.querySelector('.btn-loading');

    btn.disabled     = true;
    texto.hidden     = true;
    loading.hidden   = false;

    // Simula envio para API
    await new Promise(r => setTimeout(r, 2000));

    btn.disabled   = false;
    texto.hidden   = false;
    loading.hidden = true;

    // Redireciona para o login do parceiro com parâmetro de sucesso
    window.location.href = 'login-parceiro.html?cadastro=sucesso';
});