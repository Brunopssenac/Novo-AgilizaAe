document.addEventListener("DOMContentLoaded", () => {

    /////////////////////////////////////////////////////
    // ANIMAÇÃO DOS NÚMEROS (contagem progressiva)
    /////////////////////////////////////////////////////

    function animarContador(el) {
        const alvo   = parseFloat(el.dataset.count);
        const sufixo = el.dataset.suffix || "";
        const decimal = !Number.isInteger(alvo);
        const duracao = 1800;
        const inicio  = performance.now();

        function tick(agora) {
            const progresso = Math.min((agora - inicio) / duracao, 1);
            const ease = 1 - Math.pow(1 - progresso, 3); // easeOutCubic
            const valor = alvo * ease;

            el.textContent = (decimal ? valor.toFixed(1) : Math.floor(valor)) + sufixo;

            if (progresso < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    // dispara quando os stats entram na viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll("[data-count]").forEach(animarContador);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    const stats = document.querySelector(".estatisticas");
    if (stats) observer.observe(stats);

    /////////////////////////////////////////////////////
    // EFEITO 3D NO CARD (mouse)
    /////////////////////////////////////////////////////

    const card = document.querySelector(".card");

    if (card) {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const cx   = rect.left + rect.width  / 2;
            const cy   = rect.top  + rect.height / 2;
            const rx   = (e.clientY - cy) / 12;
            const ry   = (cx - e.clientX) / 12;
            card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale(1)";
        });
    }

    /////////////////////////////////////////////////////
    // SMOOTH SCROLL (links internos)
    /////////////////////////////////////////////////////

    document.querySelectorAll("a[href^='#']").forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute("href"));
            if (target) target.scrollIntoView({ behavior: "smooth" });
        });
    });

});