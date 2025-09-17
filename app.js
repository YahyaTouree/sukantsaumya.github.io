/**
 * @file Main JavaScript file for the portfolio website.
 * @description This file handles all the dynamic and interactive features of the site,
 * including UI animations, a custom cursor, a scroll progress bar, a generative
 * particle animation, and integration with the Gemini API for creating AI-powered
 * project case studies. Enhanced with anime.js.
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
        // Use anime.js for a smoother toggle animation
        if (mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.remove('hidden');
            anime({
                targets: mobileMenu,
                translateY: [-20, 0], // Slide down slightly
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuad'
            });
        } else {
             anime({
                targets: mobileMenu,
                translateY: [0, -20], // Slide up slightly
                opacity: [1, 0],
                duration: 300,
                easing: 'easeOutQuad',
                complete: () => mobileMenu.classList.add('hidden')
            });
        }
    });

    /**
     * Closes the mobile menu automatically when a navigation link or button is clicked.
     * This improves user experience on smaller screens.
     */
    document.querySelectorAll('#mobile-menu a, .btn').forEach(link => {
        link.addEventListener('click', () => {
            // Check if the mobile menu is currently visible before hiding it.
            if (mobileMenu.offsetParent !== null) {
                 anime({
                    targets: mobileMenu,
                    translateY: [0, -20],
                    opacity: [1, 0],
                    duration: 300,
                    easing: 'easeOutQuad',
                    complete: () => mobileMenu.classList.add('hidden')
                });
            }
        });
    });

    /**
     * Implements a fade-in animation for elements as they scroll into view.
     * Uses the Intersection Observer API for efficient detection.
     * Enhanced with anime.js for smoother effects.
     */
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
    };
    const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('visible');
                // Use anime.js for fade-in
                anime({
                    targets: el,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 600,
                    easing: 'easeOutQuad'
                });
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
     * 1. Custom Cursor Logic with anime.js
     * Creates a custom cursor effect with a dot and an outline that follows the mouse.
     * The outline has a trailing animation for a smooth, fluid effect using anime.js.
     */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Show cursor on hover
    document.body.addEventListener('mouseenter', () => {
        if (cursorDot && cursorOutline) {
             anime({
                targets: [cursorDot, cursorOutline],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuad'
            });
        }
    });

    let cursorAnimation;

    document.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        if (cursorDot) {
            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;
        }

        if (cursorOutline) {
             // Cancel any ongoing animation
            if (cursorAnimation) cursorAnimation.pause();

            // Animate the outline for a smoother follow effect using anime.js
            cursorAnimation = anime({
                targets: cursorOutline,
                left: `${posX}px`,
                top: `${posY}px`,
                duration: 500, // Adjust duration for desired smoothness
                easing: 'easeOutQuad' // Smooth easing function
            });
        }
    });

    // Hover effects for links/buttons
    const hoverElements = document.querySelectorAll('a, .btn, .skill-tag');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (cursorOutline) {
                 anime({
                    targets: cursorOutline,
                    scale: 1.5,
                    backgroundColor: 'rgba(129, 140, 248, 0.2)',
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            }
        });
        el.addEventListener('mouseleave', () => {
            if (cursorOutline) {
                 anime({
                    targets: cursorOutline,
                    scale: 1,
                    backgroundColor: '#818cf8', // Original border color
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            }
        });
    });


    /**
     * 2. Scroll Progress Bar with anime.js
     * Updates a progress bar at the top of the page to indicate the user's scroll depth.
     * Enhanced with anime.js for smooth width animation.
     */
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;

        // Use anime.js to animate the width smoothly
        if (scrollProgressBar) {
            anime({
                targets: scrollProgressBar,
                width: `${scrollPercentage}%`,
                duration: 100, // Short duration for responsive feel
                easing: 'linear'
            });
        }
    });

    /**
     * 3. Anime-Inspired Hero Animation (Enhanced)
     * Generates an interactive particle animation within the hero section.
     * Particles drift slowly and are repelled by the user's mouse movements.
     * Uses anime.js for particle movement and interactions.
     */
    const heroContainer = document.getElementById('hero-animation-container');
    if (heroContainer) {
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("viewBox", "0 0 400 400");
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.overflow = "visible";
        heroContainer.appendChild(svg);

        const particles = [];
        const numParticles = 50;

        // Create and initialize each particle
        for (let i = 0; i < numParticles; i++) {
            const circle = document.createElementNS(svgNS, "circle");
            const r = Math.random() * 3 + 1; // Random radius
            const x = Math.random() * 400;   // Random initial x position
            const y = Math.random() * 400;   // Random initial y position
            // Use a shade of blue/purple from your palette
            const hue = 240 + Math.random() * 60;
            const saturation = 100;
            const lightness = 70 + Math.random() * 20;
            const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

            circle.setAttribute("cx", x);
            circle.setAttribute("cy", y);
            circle.setAttribute("r", r);
            circle.setAttribute("fill", color);
            circle.setAttribute("class", "glowing-particle");
            circle.style.opacity = Math.random() * 0.5 + 0.2;
            circle.style.transition = "transform 0.2s ease-out";
            svg.appendChild(circle);

            particles.push({
                element: circle,
                baseX: x,
                baseY: y,
                vx: (Math.random() - 0.5) * 0.2, // Horizontal velocity
                vy: (Math.random() - 0.5) * 0.2, // Vertical velocity,
                animeInstance: null // Placeholder for anime instance
            });
        }

        // Repel particles based on mouse position using anime.js
        heroContainer.addEventListener('mousemove', (e) => {
            const rect = heroContainer.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            particles.forEach(p => {
                const dx = p.baseX - mouseX;
                const dy = p.baseY - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                // Avoid extreme force at close distances
                const force = -20 / (dist < 20 ? 20 : dist);
                const angle = Math.atan2(dy, dx);
                const tx = p.baseX + Math.cos(angle) * force;
                const ty = p.baseY + Math.sin(angle) * force;
                // Apply transform for repel effect using anime.js
                if (p.animeInstance) p.animeInstance.pause(); // Pause previous animation
                p.animeInstance = anime({
                    targets: p.element,
                    cx: tx,
                    cy: ty,
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
        });

        /**
         * Main animation loop for the hero particles.
         * Updates particle positions and handles boundary collisions.
         * Uses anime.js for smooth animation.
         */
        function animateParticles() {
            particles.forEach(p => {
                p.baseX += p.vx;
                p.baseY += p.vy;
                // Bounce off the container edges
                if (p.baseX > 400 || p.baseX < 0) p.vx *= -1;
                if (p.baseY > 400 || p.baseY < 0) p.vy *= -1;

                // Only update if not currently being animated by mouse interaction
                if (!p.animeInstance || p.animeInstance.completed) {
                    anime({
                        targets: p.element,
                        cx: p.baseX,
                        cy: p.baseY,
                        duration: 1000 / 60, // Roughly 60fps
                        easing: 'linear'
                    });
                }
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // --- ANIME.JS ENHANCEMENTS FROM REQUEST ---

    /**
     * 1. Sakura Petals Animation
     * Adds falling sakura petals to the background for an anime-inspired effect.
     */
    function createSakuraPetals() {
        const container = document.body; // Add to body or a specific container
        const petalCount = 30; // Number of petals

        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.classList.add('sakura-petal');
            // Simple SVG path for a petal shape (you can use a more complex one)
            petal.innerHTML = `
                <svg viewBox="0 0 100 100" class="w-full h-full">
                    <path d="M50,15 C60,5 85,10 80,30 C100,40 95,65 75,60 C80,80 55,95 45,80 C35,95 10,80 15,60 C-5,65 0,40 20,30 C15,10 40,5 50,15 Z" fill="rgba(255, 182, 193, 0.8)" />
                </svg>
            `;
            container.appendChild(petal);

            // Randomize initial position and size
            const size = Math.random() * 20 + 10; // Random size between 10px and 30px
            petal.style.width = `${size}px`;
            petal.style.height = `${size}px`;
            petal.style.position = 'fixed'; // Use fixed for full-page effect
            petal.style.left = `${Math.random() * 100}%`;
            petal.style.top = `${-size}px`; // Start above the viewport
            petal.style.opacity = Math.random() * 0.5 + 0.3; // Random opacity
            petal.style.pointerEvents = 'none'; // So they don't interfere with clicks
            petal.style.zIndex = '0'; // Behind other content
            petal.style.willChange = 'transform, opacity'; // Hint for GPU acceleration

            // Animate the petal falling using anime.js
            anime({
                targets: petal,
                translateY: [0, window.innerHeight + 100], // Fall from top to bottom + 100px
                translateX: [
                    { value: 0, duration: 0 },
                    { value: (Math.random() - 0.5) * 100, duration: () => anime.random(8000, 15000), delay: () => anime.random(0, 5000) }
                ],
                rotate: {
                    value: '1turn',
                    duration: () => anime.random(8000, 15000),
                    delay: () => anime.random(0, 5000),
                    easing: 'linear'
                },
                opacity: [
                    { value: petal.style.opacity, duration: 0 },
                    { value: 0, duration: 1000, delay: () => anime.random(7000, 14000) } // Fade out near the end
                ],
                duration: () => anime.random(8000, 15000),
                delay: () => anime.random(0, 5000),
                easing: 'easeInOutSine', // Smooth easing for falling
                loop: true // Make the animation loop
            });
        }
    }

    // Call the function to create and animate petals (optional, can be triggered on specific events)
    createSakuraPetals();

     /**
     * 2. Morphing Text Animation for Hero Headline
     * Cycles through different headlines with a morphing effect.
     */
    function createMorphingText() {
        const headlineElement = document.querySelector('#home h1'); // Target the main headline
        if (!headlineElement) return;

        const texts = [
            "Crafting Digital Solutions that Perform.",
            "Building Scalable Mobile Experiences.",
            "Innovating with Flutter & Python."
        ];
        let currentIndex = 0;

        const morphText = () => {
            const currentText = headlineElement.textContent.trim();
            const nextIndex = (currentIndex + 1) % texts.length;
            const nextText = texts[nextIndex];

            // Use anime.js timeline for morphing effect
            const morphTimeline = anime.timeline({
                loop: false,
                autoplay: true,
                complete: () => {
                    currentIndex = nextIndex;
                    setTimeout(morphText, 3000); // Delay before next morph
                }
            });

            morphTimeline
            .add({
                targets: headlineElement,
                opacity: [1, 0],
                scale: [1, 0.8],
                duration: 800,
                easing: 'easeInOutQuad'
            })
            .add({
                targets: headlineElement,
                textContent: [currentText, nextText],
                duration: 1, // Instant text change in the middle
                complete: (anim) => {
                     anim.animatables[0].target.textContent = nextText;
                }
            }, '-=400') // Overlap with the fade-out
            .add({
                targets: headlineElement,
                opacity: [0, 1],
                scale: [0.8, 1],
                duration: 800,
                easing: 'easeInOutQuad'
            }, '-=400'); // Overlap with the text change
        };

        // Start the morphing cycle after a short delay
        setTimeout(morphText, 3000);
    }

    // Initialize morphing text
    createMorphingText();

    /**
     * 3. Typewriter Effect for Hero Subtitle
     * Types out the subtitle text with a blinking cursor.
     */
    function createTypewriterEffect() {
        const subtitleElement = document.querySelector('#home .text-slate-400'); // Target the subtitle paragraph
        if (!subtitleElement) return;

        const originalText = subtitleElement.textContent;
        subtitleElement.textContent = ''; // Clear original text

        let i = 0;
        const speed = 50; // Typing speed in ms

        function typeWriter() {
            if (i < originalText.length) {
                subtitleElement.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                // Add blinking cursor at the end
                subtitleElement.innerHTML += '<span class="animate-pulse">|</span>';
            }
        }

        // Start typing after the morphing text has had a chance to appear
        setTimeout(typeWriter, 1000);
    }

    // Initialize typewriter effect
    createTypewriterEffect();

    /**
     * 4. Enhanced Skill Tag Animations
     * Adds bounce and pop effects to skill tags on hover.
     */
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            anime({
                targets: tag,
                translateY: -5,
                scale: 1.05,
                duration: 300,
                easing: 'easeOutBack' // Bounce effect
            });
        });
        tag.addEventListener('mouseleave', () => {
            anime({
                targets: tag,
                translateY: 0,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });

    /**
     * 5. Floating Animation for "Say Hello" Button
     * Adds a subtle floating/bobbing animation.
     */
    const sayHelloButton = document.querySelector('#contact .btn-primary');
    if (sayHelloButton) {
        // Use anime.js for a continuous floating animation
        anime({
            targets: sayHelloButton,
            translateY: [-5, 5], // Move up and down
            direction: 'alternate',
            duration: 2000,
            loop: true,
            easing: 'easeInOutSine'
        });
    }

     /**
     * 6. Enhanced Social Icon Animations
     * Adds rotation and bounce effects on hover.
     */
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            anime({
                targets: icon,
                translateY: -5,
                rotate: 10, // Slight rotation
                duration: 300,
                easing: 'easeOutBack'
            });
        });
        icon.addEventListener('mouseleave', () => {
            anime({
                targets: icon,
                translateY: 0,
                rotate: 0,
                duration: 300,
                easing: 'easeOutQuad'
            });
        });
    });


    // --- GEMINI API INTEGRATION ---
    // (This part remains largely the same, just ensuring anime.js is available)
    const summaryButtons = document.querySelectorAll('.generate-summary-btn');
    const modal = document.getElementById('ai-summary-modal');
    const modalBody = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');
    const closeModalButton = document.getElementById('modal-close-button');

    /**
     * Displays the AI summary modal with an anime.js entrance animation.
     * @returns {void}
     */
    const openModal = () => {
        if (modal) {
            modal.classList.add('visible');
            // Animate modal entrance
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                anime({
                    targets: modalContent,
                    scale: [0.8, 1],
                    opacity: [0, 1],
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            }
        }
    };

    /**
     * Hides the AI summary modal with an anime.js exit animation.
     * @returns {void}
     */
    const closeModal = () => {
        if (modal) {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                 anime({
                    targets: modalContent,
                    scale: [1, 0.8],
                    opacity: [1, 0],
                    duration: 300,
                    easing: 'easeOutQuad',
                    complete: () => modal.classList.remove('visible')
                });
            } else {
                modal.classList.remove('visible');
            }
        }
    };

    // Event listeners for closing the modal
    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeModal);
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            // Close modal if the overlay (background) is clicked
            if (e.target === modal) closeModal();
        });
    }

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
        // Note: Fixed the URL format (removed space before colon)
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
            if (modalTitle) modalTitle.innerText = `AI Case Study: ${projectTitle}`;
            if (modalBody) {
                modalBody.innerHTML = '<div class="spinner"></div><p class="text-center text-slate-400">Generating summary...</p>';
            }
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
                if (modalBody) modalBody.innerHTML = summaryHtml;
            } catch (error) {
                if (modalBody) {
                    modalBody.innerHTML = `<p class="text-red-400">Sorry, there was an error generating the case study. Please try again later.</p><p class="text-xs text-slate-500 mt-2">Error: ${error.message}</p>`;
                }
            }
        });
    });
});
