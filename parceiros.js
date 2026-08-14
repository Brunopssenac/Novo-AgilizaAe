// Máscaras
function mascaraCNPJ(v) {
    return v.replace(/\D/g,'').slice(0,14)
        .replace(/(\d{2})(\d)/,'$1.$2')
        .replace(/(\d{3})(\d)/,'$1.$2')
        .replace(/(\d{3})(\d)/,'$1/$2')
        .replace(/(\d{4})(\d{1,2})$/,'$1-$2');
}
function mascaraTel(v) {
    const d = v.replace(/\D/g,'').slice(0,11);
    return d.length<=10 ? d.replace(/(\d{2})(\d{4})(\d{0,4})/,'($1) $2-$3') : d.replace(/(\d{2})(\d{5})(\d{0,4})/,'($1) $2-$3');
}
function mascaraCEP(v) { return v.replace(/\D/g,'').slice(0,8).replace(/(\d{5})(\d{1,3})/,'$1-$2'); }

const cnpjEl = document.getElementById('cnpj');
const telEl  = document.getElementById('telefoneParceiro');
const cepEl  = document.getElementById('cepParceiro');
if (cnpjEl) cnpjEl.addEventListener('input', e => e.target.value = mascaraCNPJ(e.target.value));
if (telEl)  telEl.addEventListener('input',  e => e.target.value = mascaraTel(e.target.value));
if (cepEl)  cepEl.addEventListener('input',  e => e.target.value = mascaraCEP(e.target.value));

// Busca CEP
const btnCep = document.getElementById('btnBuscarCepParceiro');
if (btnCep) {
    btnCep.addEventListener('click', async () => {
        const cep = cepEl.value.replace(/\D/g,'');
        if (cep.length !== 8) return;
        btnCep.textContent = 'Buscando...';
        btnCep.disabled = true;
        try {
            const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const d = await r.json();
            if (!d.erro) {
                document.getElementById('ruaParceiro').value    = d.logradouro || '';
                document.getElementById('bairroParceiro').value = d.bairro     || '';
                document.getElementById('cidadeParceiro').value = d.localidade || '';
                const est = document.getElementById('estadoParceiro');
                if (est) est.value = d.uf || '';
                document.getElementById('numeroParceiro').focus();
            }
        } catch(e) {}
        btnCep.textContent = 'Buscar';
        btnCep.disabled = false;
    });
}

// Toast
function toast(msg, tipo='') {
    let t = document.getElementById('toast');
    if (!t) { t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
    t.textContent = msg; t.className = 'toast ' + tipo;
    void t.offsetWidth; t.classList.add('ativo');
    clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('ativo'), 3000);
}

// Submit
const form = document.getElementById('formParceiro');
if (form) {
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const razao = document.getElementById('razaoSocial').value.trim();
        const cnpj  = document.getElementById('cnpj').value;
        const seg   = document.getElementById('segmento').value;
        const nome  = document.getElementById('nomeResponsavel').value.trim();
        const email = document.getElementById('emailParceiro').value.trim();
        const aceita= document.getElementById('aceitaTermos').checked;
        let ok = true;
        const marcar = (id, msg) => { const el = document.getElementById('erro-'+id); if(el) el.textContent=msg; ok=false; };
        const limpar = (...ids) => ids.forEach(id => { const el=document.getElementById('erro-'+id); if(el) el.textContent=''; });
        limpar('razaoSocial','cnpj','segmento','nomeResponsavel','emailParceiro','aceitaTermos');
        if (!razao) marcar('razaoSocial','Informe a razão social.');
        if (cnpj.replace(/\D/g,'').length !== 14) marcar('cnpj','CNPJ inválido.');
        if (!seg) marcar('segmento','Selecione o segmento.');
        if (!nome) marcar('nomeResponsavel','Informe o nome do responsável.');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) marcar('emailParceiro','E-mail inválido.');
        if (!aceita) marcar('aceitaTermos','Aceite os termos para continuar.');
        if (!ok) return;
        const btn = document.getElementById('btnEnviarParceiro');
        btn.disabled = true;
        btn.querySelector('.btn-texto').hidden = true;
        btn.querySelector('.btn-loading').hidden = false;
        await new Promise(r => setTimeout(r, 1500));
        btn.disabled = false;
        btn.querySelector('.btn-texto').hidden = false;
        btn.querySelector('.btn-loading').hidden = true;
        toast('Cadastro enviado! Entraremos em contato em até 24h 🎉', 'sucesso');
        form.reset();
    });
}