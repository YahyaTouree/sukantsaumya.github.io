document.addEventListener('DOMContentLoaded', () => {

    // --- CORE UI & ANIMATIONS ---
    feather.replace();

    // Mobile Menu Toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Close mobile menu on link click
    document.querySelectorAll('#mobile-menu a, .btn').forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.offsetParent !== null) {
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // Intersection Observer for scroll animations
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // --- ADVANCED INTERACTIVE FEATURES ---

    // 1. Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: 'forwards' });
    });

    // 2. Scroll Progress Bar
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        scrollProgressBar.style.width = `${scrollPercentage}%`;
    });

    // 3. Anime-Inspired Hero Animation
    const heroContainer = document.getElementById('hero-animation-container');
    if (heroContainer) {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 400 400");
        heroContainer.appendChild(svg);

        const particles = [];
        const numParticles = 50;

        for (let i = 0; i < numParticles; i++) {
            const circle = document.createElementNS(svgNS, "circle");
            const r = Math.random() * 3 + 1;
            const x = Math.random() * 400;
            const y = Math.random() * 400;
            const color = `hsl(${240 + Math.random() * 60}, 100%, ${70 + Math.random() * 20}%)`;
            
            circle.setAttribute("cx", x);
            circle.setAttribute("cy", y);
            circle.setAttribute("r", r);
            circle.setAttribute("fill", color);
            circle.setAttribute("class", "glowing-particle");
            circle.style.opacity = Math.random() * 0.5 + 0.2;
            svg.appendChild(circle);

            particles.push({
                element: circle,
                baseX: x,
                baseY: y,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
            });
        }

        heroContainer.addEventListener('mousemove', (e) => {
            const rect = heroContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            particles.forEach(p => {
                const dx = p.baseX - mouseX;
                const dy = p.baseY - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const force = -20 / (dist < 20 ? 20 : dist);
                const angle = Math.atan2(dy, dx);
                const tx = p.baseX + Math.cos(angle) * force;
                const ty = p.baseY + Math.sin(angle) * force;
                p.element.style.transform = `translate(${tx - p.baseX}px, ${ty - p.baseY}px)`;
            });
        });

        function animateParticles() {
            particles.forEach(p => {
                p.baseX += p.vx;
                p.baseY += p.vy;

                if (p.baseX > 400 || p.baseX < 0) p.vx *= -1;
                if (p.baseY > 400 || p.baseY < 0) p.vy *= -1;

                p.element.setAttribute('cx', p.baseX);
                p.element.setAttribute('cy', p.baseY);
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // --- GEMINI API INTEGRATION ---
    const summaryButtons = document.querySelectorAll('.generate-summary-btn');
    const modal = document.getElementById('ai-summary-modal');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');
    const closeModalButton = document.getElementById('modal-close-button');

    const openModal = () => modal.classList.add('visible');
    const closeModal = () => modal.classList.remove('visible');

    closeModalButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    async function callGemini(prompt) {
        const apiKey = "AIzaSyCc_DypSOJUn--LeWBQqxHyhBeSzj_ZLPM";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) throw new Error((await response.json()).error.message || 'API request failed');
            
            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
                return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
            } else {
                throw new Error('Received an empty or malformed response from the API.');
            }
        } catch (error) {
            console.error("Gemini API Error:", error);
            throw error;
        }
    }

    summaryButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const projectCard = button.closest('.project-card');
            const projectTitle = projectCard.querySelector('h3').innerText;
            const fullText = projectCard.querySelector('[data-full-text]').dataset.fullText;

            modalTitle.innerText = `AI Case Study: ${projectTitle}`;
            modalBody.innerHTML = '<div class="spinner"></div><p class="text-center text-slate-400">Generating summary...</p>';
            openModal();

            const prompt = `
                You are a tech recruitment analyst. Create a detailed case study based on the following project information.
                Format the response in clean HTML using the 'prose' class conventions. Use <h4> for titles and <p> for text.
                Structure the case study into three distinct sections:
                1. The Challenge: Describe the core business problem or objective.
                2. My Solution: Detail the technical solution that was implemented and my specific contributions.
                3. The Outcome: Explain the final result and its quantifiable impact.

                Here is the project data:
                ---
                ${fullText}
                ---
            `;

            try {
                const summaryHtml = await callGemini(prompt);
                modalBody.innerHTML = summaryHtml;
            } catch (error) {
                modalBody.innerHTML = `<p class="text-red-400">Sorry, there was an error generating the case study. Please try again later.</p><p class="text-xs text-slate-500 mt-2">Error: ${error.message}</p>`;
            }
        });
    });
});
