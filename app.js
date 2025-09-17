/**
 * @file Main JavaScript file for the portfolio website.
 * @description This file handles all the dynamic and interactive features of the site,
 * including UI animations, a custom cursor, a scroll progress bar, a generative
 * particle animation, and integration with the Gemini API for creating AI-powered
 * project case studies.
 */
document.addEventListener('DOMContentLoaded', () => {
    // --- CORE UI & ANIMATIONS ---
    /**
     * Initializes Feather Icons on the page.
     * Replaces all `data-feather` attributes with their corresponding SVG icons.
     */
    feather.replace();
    /**
     * Handles the mobile menu toggle functionality.
     * Toggles the 'hidden' class on the mobile menu when the button is clicked.
     */
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    /**
     * Closes the mobile menu automatically when a navigation link or button is clicked.
     * This improves user experience on smaller screens.
     */
    document.querySelectorAll('#mobile-menu a, .btn').forEach(link => {
        link.addEventListener('click', () => {
            // Check if the mobile menu is currently visible before hiding it.
            if (mobileMenu.offsetParent !== null) {
                mobileMenu.classList.add('hidden');
            }
        });
    });
    /**
     * Implements a fade-in animation for elements as they scroll into view.
     * Uses the Intersection Observer API for efficient detection.
     */
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Stop observing the element once it's visible to save resources.
                appearOnScroll.unobserve(entry.target);
            }
        });
    }, appearOptions);
    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
    // --- ADVANCED INTERACTIVE FEATURES ---
    /**
     * 1. Custom Cursor Logic
     * Creates a custom cursor effect with a dot and an outline that follows the mouse.
     * The outline has a trailing animation for a smooth, fluid effect.
     */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;
        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;
        // Animate the outline for a smoother follow effect.
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: 'forwards' });
    });
    /**
     * 2. Scroll Progress Bar
     * Updates a progress bar at the top of the page to indicate the user's scroll depth.
     */
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        scrollProgressBar.style.width = `${scrollPercentage}%`;
    });
    /**
     * 3. Anime-Inspired Hero Animation
     * Generates an interactive particle animation within the hero section.
     * Particles drift slowly and are repelled by the user's mouse movements.
     */
    const heroContainer = document.getElementById('hero-animation-container');
    if (heroContainer) {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 400 400");
        heroContainer.appendChild(svg);
        const particles = [];
        const numParticles = 50;
        // Create and initialize each particle
        for (let i = 0; i < numParticles; i++) {
            const circle = document.createElementNS(svgNS, "circle");
            const r = Math.random() * 3 + 1; // Random radius
            const x = Math.random() * 400;   // Random initial x position
            const y = Math.random() * 400;   // Random initial y position
            const color = `hsl(${240 + Math.random() * 60}, 100%, ${70 + Math.random() * 20}%)`; // Shades of blue/purple
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
                vx: (Math.random() - 0.5) * 0.2, // Horizontal velocity
                vy: (Math.random() - 0.5) * 0.2, // Vertical velocity
            });
        }
        // Repel particles based on mouse position
        heroContainer.addEventListener('mousemove', (e) => {
            const rect = heroContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            particles.forEach(p => {
                const dx = p.baseX - mouseX;
                const dy = p.baseY - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const force = -20 / (dist < 20 ? 20 : dist); // Avoid extreme force at close distances
                const angle = Math.atan2(dy, dx);
                const tx = p.baseX + Math.cos(angle) * force;
                const ty = p.baseY + Math.sin(angle) * force;
                p.element.style.transform = `translate(${tx - p.baseX}px, ${ty - p.baseY}px)`;
            });
        });
        /**
         * Main animation loop for the hero particles.
         * Updates particle positions and handles boundary collisions.
         */
        function animateParticles() {
            particles.forEach(p => {
                p.baseX += p.vx;
                p.baseY += p.vy;
                // Bounce off the container edges
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
    /**
     * Displays the AI summary modal.
     * @returns {void}
     */
    const openModal = () => modal.classList.add('visible');
    /**
     * Hides the AI summary modal.
     * @returns {void}
     */
    const closeModal = () => modal.classList.remove('visible');
    // Event listeners for closing the modal
    closeModalButton.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        // Close modal if the overlay (background) is clicked
        if (e.target === modal) closeModal();
    });
    /**
     * Calls the Gemini API to generate a project case study.
     * @param {string} prompt - The detailed prompt for the AI model.
     * @returns {Promise<string>} A promise that resolves to the generated HTML content.
     * @throws {Error} Throws an error if the API call fails or returns an empty response.
     */
    async function callGemini(prompt) {
        // IMPORTANT: API key is hardcoded for demonstration purposes.
        // In a production environment, this should be handled securely (e.g., via a backend proxy or environment variables).
        const apiKey = "AIzaSyCc_DypSOJUn--LeWBQqxHyhBeSzj_ZLPM"; // Make sure this key is valid
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
        const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                // Try to parse the error message from the API response
                const errorData = await response.json();
                throw new Error(errorData?.error?.message || 'API request failed with status: ' + response.status);
            }
            const result = await response.json();
            const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) {
                // Basic sanitization to prevent script injection from the API response.
                return text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
            } else {
                throw new Error('Received an empty or malformed response from the API.');
            }
        } catch (error) {
            console.error("Gemini API Error:", error);
            throw error; // Re-throw the error to be caught by the caller
        }
    }
    /**
     * Attaches click event listeners to all "Generate Summary" buttons.
     * When clicked, it orchestrates the process of fetching project data,
     * calling the Gemini API, and displaying the result in a modal.
     */
    summaryButtons.forEach(button => {
        button.addEventListener('click', async () => {
            // 1. Get project details from the DOM
            const projectCard = button.closest('.project-card');
            const projectTitle = projectCard.querySelector('h3').innerText;
            const fullText = projectCard.querySelector('[data-full-text]').dataset.fullText;
            // 2. Prepare and open the modal
            modalTitle.innerText = `AI Case Study: ${projectTitle}`;
            modalBody.innerHTML = '<div class="spinner"></div><p class="text-center text-slate-400">Generating summary...</p>';
            openModal();
            // 3. Construct the prompt for the Gemini API
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
            // 4. Call the API and handle the response
            try {
                const summaryHtml = await callGemini(prompt);
                modalBody.innerHTML = summaryHtml;
            } catch (error) {
                modalBody.innerHTML = `<p class="text-red-400">Sorry, there was an error generating the case study. Please try again later.</p><p class="text-xs text-slate-500 mt-2">Error: ${error.message}</p>`;
            }
        });
    });
});
