// Navegação entre seções
document.querySelectorAll('.dash-nav-item').forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('.dash-nav-item').forEach(i => i.classList.remove('ativo'));
        item.classList.add('ativo');
        const secao = item.dataset.secao;
        document.querySelectorAll('.dash-secao').forEach(s => s.classList.remove('ativo'));
        document.getElementById('secao-' + secao).classList.add('ativo');
        document.getElementById('dash-titulo').textContent = item.textContent.trim();
        document.getElementById('dash-subtitulo').textContent = '';
    });
});

document.querySelectorAll('.dash-ver-mais').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const goto = link.dataset.goto;
        document.querySelector(`.dash-nav-item[data-secao="${goto}"]`).click();
    });
});

// Dados fictícios
const vendas = [
    { produto:'Pão Francês', maquina:'#042 Av. Paulista', data:'25/06/2025', qtd:3, unitario:2.50, total:7.50, status:'pago' },
    { produto:'Croissant', maquina:'#031 Faria Lima', data:'24/06/2025', qtd:2, unitario:4.80, total:9.60, status:'pago' },
    { produto:'Bolo de Cenoura', maquina:'#042 Av. Paulista', data:'24/06/2025', qtd:1, unitario:8.00, total:8.00, status:'pago' },
    { produto:'Pão de Queijo', maquina:'#017 MASP', data:'23/06/2025', qtd:5, unitario:3.20, total:16.00, status:'pago' },
    { produto:'Sonho', maquina:'#042 Av. Paulista', data:'22/06/2025', qtd:2, unitario:5.50, total:11.00, status:'pendente' },
    { produto:'Broa de Milho', maquina:'#031 Faria Lima', data:'21/06/2025', qtd:4, unitario:3.80, total:15.20, status:'cancelado' },
];

// Tabela últimas vendas
const tabelaUlt = document.getElementById('tabelaUltimasVendas');
if (tabelaUlt) {
    vendas.slice(0,4).forEach(v => {
        tabelaUlt.innerHTML += `<tr>
            <td>${v.produto}</td>
            <td>${v.maquina}</td>
            <td>${v.data}</td>
            <td>R$ ${v.total.toFixed(2)}</td>
            <td><span class="status-${v.status}">${v.status}</span></td>
        </tr>`;
    });
}

// Tabela vendas completa
const tabelaV = document.getElementById('tabelaVendas');
if (tabelaV) {
    vendas.forEach(v => {
        tabelaV.innerHTML += `<tr>
            <td>${v.produto}</td>
            <td>${v.maquina}</td>
            <td>${v.data}</td>
            <td>${v.qtd}</td>
            <td>R$ ${v.unitario.toFixed(2)}</td>
            <td>R$ ${v.total.toFixed(2)}</td>
            <td><span class="status-${v.status}">${v.status}</span></td>
        </tr>`;
    });
}

// Gráfico de barras
const grafico = document.getElementById('graficoDia');
if (grafico) {
    const dias = [
        {d:'19/06',v:8},{d:'20/06',v:12},{d:'21/06',v:7},{d:'22/06',v:15},
        {d:'23/06',v:11},{d:'24/06',v:18},{d:'25/06',v:14}
    ];
    const max = Math.max(...dias.map(d => d.v));
    dias.forEach(d => {
        const h = Math.round((d.v / max) * 140);
        grafico.innerHTML += `<div class="barra-wrap">
            <span class="barra-valor">${d.v}</span>
            <div class="barra" style="height:${h}px"></div>
            <span class="barra-label">${d.d}</span>
        </div>`;
    });
}

// ESG barras
const esgEl = document.getElementById('esgBarras');
if (esgEl) {
    const meses = [
        {m:'Jan',v:20},{m:'Fev',v:35},{m:'Mar',v:28},{m:'Abr',v:45},
        {m:'Mai',v:60},{m:'Jun',v:82}
    ];
    const max = Math.max(...meses.map(m => m.v));
    meses.forEach(m => {
        const h = Math.round((m.v / max) * 140);
        esgEl.innerHTML += `<div class="esg-barra-wrap">
            <span class="barra-valor">${m.v}kg</span>
            <div class="esg-barra" style="height:${h}px"></div>
            <span class="barra-label">${m.m}</span>
        </div>`;
    });
}

// Ranking
const ranking = document.getElementById('rankingProdutos');
if (ranking) {
    const itens = [
        {nome:'Pão Francês', qtd:98},
        {nome:'Pão de Queijo', qtd:74},
        {nome:'Croissant', qtd:56},
        {nome:'Bolo de Cenoura', qtd:42},
        {nome:'Sonho', qtd:28},
    ];
    const max = itens[0].qtd;
    itens.forEach((it, i) => {
        ranking.innerHTML += `<div class="ranking-item">
            <div class="ranking-pos ${i===0?'top1':''}">${i+1}</div>
            <span class="ranking-nome">${it.nome}</span>
            <div class="ranking-barra-wrap">
                <div class="ranking-barra"><div class="ranking-barra-fill" style="width:${Math.round(it.qtd/max*100)}%"></div></div>
            </div>
            <span class="ranking-qtd">${it.qtd} un.</span>
        </div>`;
    });
}

// Produtos
const prodGrid = document.getElementById('produtosParceiro');
if (prodGrid) {
    const prods = [
        {nome:'Pão Francês', preco:2.50, desconto:30, status:'ativo'},
        {nome:'Croissant', preco:4.80, desconto:25, status:'ativo'},
        {nome:'Pão de Queijo', preco:3.20, desconto:40, status:'vencendo'},
        {nome:'Bolo de Cenoura', preco:8.00, desconto:35, status:'ativo'},
        {nome:'Sonho', preco:5.50, desconto:20, status:'ativo'},
        {nome:'Broa de Milho', preco:3.80, desconto:30, status:'vencendo'},
    ];
    prods.forEach(p => {
        prodGrid.innerHTML += `<div class="prod-parc-card">
            <span class="prod-parc-badge ${p.status}">${p.status === 'ativo' ? '✅ Ativo' : '⚠️ Vencendo em breve'}</span>
            <h4>${p.nome}</h4>
            <div class="prod-preco">R$ ${p.preco.toFixed(2)}</div>
            <small style="color:#999">Desconto: -${p.desconto}%</small>
            <div class="prod-parc-acoes">
                <button class="prod-parc-btn editar">✏️ Editar</button>
                <button class="prod-parc-btn remover">🗑 Remover</button>
            </div>
        </div>`;
    });
}

// Máquinas
const maqGrid = document.getElementById('maquinasParceiro');
if (maqGrid) {
    const maquinas = [
        {id:'042', nome:'Av. Paulista', local:'Estação Paulista', status:'online', vendas:148, produtos:6},
        {id:'031', nome:'Faria Lima', local:'Itaim Bibi', status:'online', vendas:124, produtos:4},
        {id:'017', nome:'MASP', local:'Av. Paulista', status:'offline', vendas:76, produtos:3},
    ];
    maquinas.forEach(m => {
        maqGrid.innerHTML += `<div class="maq-parc-card">
            <div class="maq-parc-header">
                <h4>#${m.id} ${m.nome}</h4>
                <span class="maq-status ${m.status}">${m.status === 'online' ? '● Online' : '● Offline'}</span>
            </div>
            <p class="maq-parc-info">📍 ${m.local}</p>
            <div class="maq-parc-stats">
                <div class="maq-stat"><strong>${m.vendas}</strong><span>Vendas</span></div>
                <div class="maq-stat"><strong>${m.produtos}</strong><span>Produtos</span></div>
            </div>
        </div>`;
    });
}

// Repasses
const repasses = document.getElementById('tabelaRepasses');
if (repasses) {
    const dados = [
        {periodo:'Jun/2025', vendas:348, comissao:1152, valor:2688, status:'pago', data:'05/07/2025'},
        {periodo:'Mai/2025', vendas:312, comissao:980,  valor:2286, status:'pago', data:'05/06/2025'},
        {periodo:'Abr/2025', vendas:290, comissao:870,  valor:2030, status:'pago', data:'05/05/2025'},
    ];
    dados.forEach(d => {
        repasses.innerHTML += `<tr>
            <td>${d.periodo}</td>
            <td>${d.vendas}</td>
            <td>R$ ${d.comissao.toFixed(2)}</td>
            <td>R$ ${d.valor.toFixed(2)}</td>
            <td><span class="status-${d.status}">${d.status}</span></td>
            <td>${d.data}</td>
        </tr>`;
    });
}