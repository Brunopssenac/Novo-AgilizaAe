/////////////////////////////////////////////////////
// UTILITÁRIOS
/////////////////////////////////////////////////////

function mostrarToast(msg, tipo = "") {
    let toast = document.getElementById("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = msg;
    toast.className = "toast " + tipo;

    // força reflow para reiniciar animação
    void toast.offsetWidth;
    toast.classList.add("ativo");

    setTimeout(() => toast.classList.remove("ativo"), 3000);
}

function marcarErro(inputId, msg) {
    const input = document.getElementById(inputId);
    const erro  = document.getElementById("erro-" + inputId);

    if (input) input.classList.add("invalido");
    if (erro)  erro.textContent = msg;
}

function limparErro(inputId) {
    const input = document.getElementById(inputId);
    const erro  = document.getElementById("erro-" + inputId);

    if (input) input.classList.remove("invalido");
    if (erro)  erro.textContent = "";
}

function limparTodosErros(...ids) {
    ids.forEach(limparErro);
}

/////////////////////////////////////////////////////
// MÁSCARAS
/////////////////////////////////////////////////////

function mascaraCPF(valor) {
    return valor
        .replace(/\D/g, "")
        .slice(0, 11)
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function mascaraTelefone(valor) {
    const d = valor.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 10)
        return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}

function mascaraCEP(valor) {
    return valor
        .replace(/\D/g, "")
        .slice(0, 8)
        .replace(/(\d{5})(\d{1,3})/, "$1-$2");
}

/////////////////////////////////////////////////////
// VALIDAÇÕES
/////////////////////////////////////////////////////

function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validarCPF(cpf) {
    const d = cpf.replace(/\D/g, "");
    if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(d[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(d[9])) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(d[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(d[10]);
}

/////////////////////////////////////////////////////
// TOGGLE SENHA (olho)
/////////////////////////////////////////////////////

document.querySelectorAll(".toggle-senha").forEach(btn => {
    btn.addEventListener("click", () => {
        const alvo  = document.getElementById(btn.dataset.alvo);
        const visivel = alvo.type === "text";
        alvo.type   = visivel ? "password" : "text";
        btn.textContent = visivel ? "👁" : "🙈";
    });
});

/////////////////////////////////////////////////////
// BUSCA CEP (ViaCEP)
/////////////////////////////////////////////////////

const btnBuscarCep = document.getElementById("btnBuscarCep");

if (btnBuscarCep) {

    async function buscarCEP() {
        const cep = document.getElementById("cep").value.replace(/\D/g, "");

        if (cep.length !== 8) {
            marcarErro("cep", "CEP deve ter 8 dígitos.");
            return;
        }

        limparErro("cep");
        btnBuscarCep.textContent = "Buscando...";
        btnBuscarCep.disabled = true;

        try {
            const res  = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();

            if (data.erro) {
                marcarErro("cep", "CEP não encontrado.");
                return;
            }

            document.getElementById("rua").value    = data.logradouro || "";
            document.getElementById("bairro").value = data.bairro     || "";
            document.getElementById("cidade").value = data.localidade  || "";

            const estado = document.getElementById("estado");
            if (estado) estado.value = data.uf || "";

            document.getElementById("numero").focus();

        } catch {
            marcarErro("cep", "Erro ao buscar CEP. Tente novamente.");
        } finally {
            btnBuscarCep.textContent = "Buscar";
            btnBuscarCep.disabled = false;
        }
    }

    btnBuscarCep.addEventListener("click", buscarCEP);

    document.getElementById("cep").addEventListener("keydown", e => {
        if (e.key === "Enter") { e.preventDefault(); buscarCEP(); }
    });
}

/////////////////////////////////////////////////////
// MÁSCARAS NOS INPUTS
/////////////////////////////////////////////////////

const cpfInput = document.getElementById("cpf");
if (cpfInput) {
    cpfInput.addEventListener("input", e => {
        e.target.value = mascaraCPF(e.target.value);
    });
}

const telInput = document.getElementById("telefone");
if (telInput) {
    telInput.addEventListener("input", e => {
        e.target.value = mascaraTelefone(e.target.value);
    });
}

const cepInput = document.getElementById("cep");
if (cepInput) {
    cepInput.addEventListener("input", e => {
        e.target.value = mascaraCEP(e.target.value);
    });
}

/////////////////////////////////////////////////////
// FORMULÁRIO DE CADASTRO
/////////////////////////////////////////////////////

const formCadastro = document.getElementById("formCadastro");

if (formCadastro) {

    formCadastro.addEventListener("submit", async e => {
        e.preventDefault();

        const campos = ["nome","email","senha","confirmarSenha","cpf","telefone","cep"];
        limparTodosErros(...campos);

        const nome          = document.getElementById("nome").value.trim();
        const email         = document.getElementById("email").value.trim();
        const senha         = document.getElementById("senha").value;
        const confirmar     = document.getElementById("confirmarSenha").value;
        const cpf           = document.getElementById("cpf").value;
        const telefone      = document.getElementById("telefone").value;
        const cep           = document.getElementById("cep").value;

        let valido = true;

        if (nome.length < 3) {
            marcarErro("nome", "Informe seu nome completo.");
            valido = false;
        }

        if (!validarEmail(email)) {
            marcarErro("email", "E-mail inválido.");
            valido = false;
        }

        if (senha.length < 8) {
            marcarErro("senha", "A senha deve ter ao menos 8 caracteres.");
            valido = false;
        }

        if (senha !== confirmar) {
            marcarErro("confirmarSenha", "As senhas não coincidem.");
            valido = false;
        }

        if (!validarCPF(cpf)) {
            marcarErro("cpf", "CPF inválido.");
            valido = false;
        }

        if (telefone.replace(/\D/g,"").length < 10) {
            marcarErro("telefone", "Telefone inválido.");
            valido = false;
        }

        if (cep.replace(/\D/g,"").length !== 8) {
            marcarErro("cep", "CEP inválido.");
            valido = false;
        }

        if (!valido) return;

        // Simula envio
        const btn   = document.getElementById("btnCadastrar");
        const texto = btn.querySelector(".btn-texto");
        const load  = btn.querySelector(".btn-loading");

        btn.disabled = true;
        texto.hidden = true;
        load.hidden  = false;

        await new Promise(r => setTimeout(r, 1500));

        btn.disabled = false;
        texto.hidden = false;
        load.hidden  = true;

        mostrarToast("Conta criada com sucesso! 🎉", "sucesso");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1800);
    });
}

/////////////////////////////////////////////////////
// FORMULÁRIO DE LOGIN
/////////////////////////////////////////////////////

const formLogin = document.getElementById("formLogin");

if (formLogin) {

    formLogin.addEventListener("submit", async e => {
        e.preventDefault();

        limparTodosErros("email", "senha");

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value;

        let valido = true;

        if (!validarEmail(email)) {
            marcarErro("email", "E-mail inválido.");
            valido = false;
        }

        if (senha.length < 6) {
            marcarErro("senha", "Informe sua senha.");
            valido = false;
        }

        if (!valido) return;

        // Simula autenticação
        const btn   = document.getElementById("btnEntrar");
        const texto = btn.querySelector(".btn-texto");
        const load  = btn.querySelector(".btn-loading");

        btn.disabled = true;
        texto.hidden = true;
        load.hidden  = false;

        await new Promise(r => setTimeout(r, 1500));

        btn.disabled = false;
        texto.hidden = false;
        load.hidden  = true;

        mostrarToast("Login realizado com sucesso!", "sucesso");

        setTimeout(() => {
            window.location.href = "maquinas.html";
        }, 1500);
    });
}