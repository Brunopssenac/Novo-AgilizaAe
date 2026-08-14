// Navegação
document.querySelectorAll('.cliente-nav-item').forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('.cliente-nav-item').forEach(i => i.classList.remove('ativo'));
        item.classList.add('ativo');
        const secao = item.dataset.secao;
        document.querySelectorAll('.cliente-secao').forEach(s => s.classList.remove('ativo'));
        document.getElementById('secao-' + secao).classList.add('ativo');
    });
});

document.querySelectorAll('.link-ver-mais').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(`.cliente-nav-item[data-secao="${link.dataset.goto}"]`).click();
    });
});

// Dados de pedidos
const pedidos = [
    { icone:'🥗', nome:'Salada Caesar', maquina:'#042 Av. Paulista', data:'25/06/2025', valor:11.70, status:'entregue' },
    { icone:'🥤', nome:'Suco Natural', maquina:'#031 Faria Lima', data:'23/06/2025', valor:8.64, status:'entregue' },
    { icone:'🍱', nome:'Bento Box', maquina:'#017 MASP', data:'20/06/2025', valor:17.60, status:'entregue' },
    { icone:'🥪', nome:'Sanduíche Natural', maquina:'#042 Av. Paulista', data:'18/06/2025', valor:9.10, status:'entregue' },
    { icone:'🥤', nome:'Vitamina Frutas', maquina:'#031 Faria Lima', data:'15/06/2025', valor:7.70, status:'pendente' },
    { icone:'🥗', nome:'Wrap Integral', maquina:'#042 Av. Paulista', data:'10/06/2025', valor:12.00, status:'entregue' },
];

// Pedidos mini (início)
const miniEl = document.getElementById('pedidosMini');
if (miniEl) {
    pedidos.slice(0,3).forEach(p => {
        miniEl.innerHTML += `<div class="pedido-mini-item">
            <span class="pedido-mini-icone">${p.icone}</span>
            <div class="pedido-mini-info">
                <strong>${p.nome}</strong>
                <span>${p.maquina} · ${p.data}</span>
            </div>
            <span class="pedido-mini-valor">R$ ${p.valor.toFixed(2)}</span>
        </div>`;
    });
}

// Lista de pedidos completa
const listaEl = document.getElementById('pedidosLista');
function renderPedidos(filtro='todos') {
    if (!listaEl) return;
    listaEl.innerHTML = '';
    const filtrados = filtro === 'todos' ? pedidos : pedidos.filter(p => p.status === filtro);
    if (!filtrados.length) {
        listaEl.innerHTML = '<p style="color:#999;text-align:center;padding:32px">Nenhum pedido encontrado.</p>';
        return;
    }
    filtrados.forEach(p => {
        listaEl.innerHTML += `<div class="pedido-card">
            <span class="pedido-card-icone">${p.icone}</span>
            <div class="pedido-card-info">
                <h4>${p.nome}</h4>
                <p>${p.maquina} · ${p.data}</p>
            </div>
            <div class="pedido-card-valor">
                <strong>R$ ${p.valor.toFixed(2)}</strong>
                <span class="pedido-status status-${p.status}">${p.status === 'entregue' ? '✅ Concluído' : '⏳ Pendente'}</span>
            </div>
        </div>`;
    });
}
renderPedidos();

document.querySelectorAll('.pedido-filtro').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.pedido-filtro').forEach(b => b.classList.remove('ativo'));
        btn.classList.add('ativo');
        renderPedidos(btn.dataset.filtro);
    });
});

// Cartões
const cartoes = [
    { bandeira:'💳', numero:'•••• •••• •••• 4231', nome:'JOAO DA SILVA', validade:'12/27', tipo:'principal', estilo:'principal' },
    { bandeira:'💳', numero:'•••• •••• •••• 8875', nome:'JOAO DA SILVA', validade:'08/26', tipo:'', estilo:'secundario' },
];

function renderCartoes() {
    const grid = document.getElementById('cartoesGrid');
    if (!grid) return;
    grid.innerHTML = '';
    cartoes.forEach((c, i) => {
        grid.innerHTML += `<div class="cartao-visual ${c.estilo}">
            ${c.tipo === 'principal' ? '<span class="cartao-badge-principal">Principal</span>' : ''}
            <span class="cartao-bandeira">${c.bandeira}</span>
            <div class="cartao-numero">${c.numero}</div>
            <div class="cartao-rodape">
                <span class="cartao-nome">${c.nome}</span>
                <span class="cartao-validade">${c.validade}</span>
            </div>
            <button class="cartao-remover" onclick="removerCartao(${i})">Remover</button>
        </div>`;
    });
}
renderCartoes();

window.removerCartao = (i) => {
    if (confirm('Remover este cartão?')) {
        cartoes.splice(i, 1);
        renderCartoes();
    }
};

const btnAdd     = document.getElementById('btnAddCartao');
const formCartao = document.getElementById('formNovoCartao');
const btnSalvar  = document.getElementById('btnSalvarCartao');
const btnCancel  = document.getElementById('btnCancelarCartao');

if (btnAdd) btnAdd.addEventListener('click', () => { formCartao.style.display='block'; btnAdd.style.display='none'; });
if (btnCancel) btnCancel.addEventListener('click', () => { formCartao.style.display='none'; btnAdd.style.display='block'; });

// Máscara cartão
const numEl = document.getElementById('numCartao');
if (numEl) numEl.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g,'').slice(0,16).replace(/(\d{4})/g,'$1 ').trim();
});
const valEl = document.getElementById('validadeCartao');
if (valEl) valEl.addEventListener('input', e => {
    e.target.value = e.target.value.replace(/\D/g,'').slice(0,4).replace(/(\d{2})(\d)/,'$1/$2');
});

if (btnSalvar) btnSalvar.addEventListener('click', () => {
    const num = document.getElementById('numCartao').value;
    const nome = document.getElementById('nomeCartao').value;
    if (num.replace(/\s/g,'').length < 16 || !nome) { alert('Preencha todos os campos.'); return; }
    cartoes.push({ bandeira:'💳', numero:'•••• •••• •••• ' + num.slice(-4), nome: nome.toUpperCase(), validade: document.getElementById('validadeCartao').value, tipo:'', estilo:'secundario' });
    renderCartoes();
    formCartao.style.display='none';
    btnAdd.style.display='block';
    document.getElementById('formNovoCartao').querySelectorAll('input').forEach(i => i.value='');
    toast('Cartão adicionado com sucesso! 💳', 'sucesso');
});

// Perfil
const formPerfil = document.getElementById('formPerfil');
if (formPerfil) {
    formPerfil.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = formPerfil.querySelector('.btn-principal');
        btn.textContent = 'Salvando...';
        btn.disabled = true;
        await new Promise(r => setTimeout(r, 1000));
        btn.textContent = 'Salvar alterações';
        btn.disabled = false;
        toast('Perfil atualizado com sucesso! ✅', 'sucesso');
    });
}

// Conquistas
const conquistas = [
    { icone:'🥗', nome:'Primeira compra', desc:'Fez sua primeira compra', desbloqueada:true },
    { icone:'🌱', nome:'Eco Iniciante', desc:'Salvou 1 kg de alimentos', desbloqueada:true },
    { icone:'💰', nome:'Econômico', desc:'Economizou R$ 50', desbloqueada:true },
    { icone:'🔥', nome:'Comprador fiel', desc:'10 compras realizadas', desbloqueada:true },
    { icone:'🌍', nome:'Herói do Clima', desc:'5 kg de alimentos salvos', desbloqueada:false },
    { icone:'⭐', nome:'VIP', desc:'20 compras realizadas', desbloqueada:false },
];

const cgrid = document.getElementById('conquistasGrid');
if (cgrid) {
    conquistas.forEach(c => {
        cgrid.innerHTML += `<div class="conquista-item ${c.desbloqueada ? '' : 'bloqueada'}">
            <span>${c.icone}</span>
            <strong>${c.nome}</strong>
            <p>${c.desc}</p>
        </div>`;
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