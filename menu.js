// menu.js — controla o menu mobile/tablet do header global (AgilizaAê)
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const toggle = document.getElementById('menuToggle');

    if (!header || !toggle) return;

    toggle.addEventListener('click', () => {
        const aberto = header.classList.toggle('menu-aberto');
        toggle.textContent = aberto ? '✕' : '☰';
        toggle.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });

    // fecha o menu ao clicar em qualquer link/botão dentro dele
    header.querySelectorAll('.menu a, .acoes a, .acoes button').forEach(el => {
        el.addEventListener('click', () => {
            header.classList.remove('menu-aberto');
            toggle.textContent = '☰';
            toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // fecha o menu se a tela for redimensionada para desktop
    window.addEventListener('resize', () => {
        if (window.innerWidth > 860) {
            header.classList.remove('menu-aberto');
            toggle.textContent = '☰';
        }
    });
});