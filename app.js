// DOM Elements
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu'); // Desktop menu
const mobileNavMenu = document.querySelector('.mobile-nav-menu'); // Mobile menu
const navLinks = document.querySelectorAll('.nav-link');
const typingText = document.querySelector('.typing-text');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.querySelector('.form');
const loadingScreen = document.querySelector('.loading');
const currentYearElement = document.getElementById('current-year');

// Modal Elements for Gemini API Feature
const projectDescriptionModal = document.getElementById('project-description-modal');
const modalCloseBtn = projectDescriptionModal?.querySelector('.modal-close-btn');
const modalProjectTitle = projectDescriptionModal?.querySelector('#modal-project-title');
const modalProjectDescription = projectDescriptionModal?.querySelector('#modal-project-description');
const modalLoadingSpinner = projectDescriptionModal?.querySelector('#modal-loading-spinner');
const generateDescriptionButtons = document.querySelectorAll('.generate-description-btn');

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 1000); // Hide loading screen after 1 second
});

// Typing Animation
const phrases = [
    "Flutter Developer",
    "CS Student",
    "Mobile App Developer",
    "Problem Solver",
    "Tech Enthusiast"
];

let currentPhrase = 0;
let currentChar = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeText() {
    if (!typingText) return; // Exit if typingText element is not found

    const current = phrases[currentPhrase];

    if (isDeleting) {
        typingText.textContent = current.substring(0, currentChar - 1);
        currentChar--;
        typingSpeed = 50; // Faster deleting
    } else {
        typingText.textContent = current.substring(0, currentChar + 1);
        currentChar++;
        typingSpeed = 100; // Normal typing speed
    }

    if (!isDeleting && currentChar === current.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause before deleting
    } else if (isDeleting && currentChar === 0) {
        isDeleting = false;
        currentPhrase = (currentPhrase + 1) % phrases.length;
        typingSpeed = 500; // Pause before typing next phrase
    }

    setTimeout(typeText, typingSpeed);
}

// Start typing animation on DOM content loaded
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeText, 1000); // Start after a short delay
});

// Navigation Scroll Effect
window.addEventListener('scroll', () => {
    if (nav) { // Check if nav element exists
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
            nav.classList.add('shadow-lg'); // Add shadow on scroll
        } else {
            nav.classList.remove('scrolled');
            nav.classList.remove('shadow-lg'); // Remove shadow when at top
        }
    }
});

// Mobile Navigation Toggle
navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileNavMenu.classList.toggle('translate-x-full'); // Slide out from right
    mobileNavMenu.classList.toggle('translate-x-0'); // Slide in
});

// Close mobile menu when clicking on a link
mobileNavMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileNavMenu.classList.remove('translate-x-0');
        mobileNavMenu.classList.add('translate-x-full');
    });
});

// Smooth Scrolling for Navigation Links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            const offsetTop = targetSection.offsetTop - (nav ? nav.offsetHeight : 0); // Account for fixed navbar height
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1, // Trigger when 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Adjust trigger point slightly
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            // Optional: remove 'visible' class when out of view
            // entry.target.classList.remove('visible');
        }
    });
}, observerOptions);

// Observe elements for animations
document.addEventListener('DOMContentLoaded', () => {
    // Select elements that should animate on scroll
    const animatedElements = document.querySelectorAll(
        '.section-header, .about-text, .skills-container, ' +
        '.project-card, .timeline-item, .achievement-item, ' +
        '.education-card, .contact-item, .contact-form'
    );

    animatedElements.forEach(element => {
        // Add a generic 'fade-in' class or specific animation classes based on element type
        // For example, project cards can slide in from left/right
        if (element.classList.contains('project-card') || element.classList.contains('education-card') || element.classList.contains('contact-item')) {
            // Determine if it's left or right based on its position in the grid/flex
            const index = Array.from(element.parentNode.children).indexOf(element);
            if (index % 2 === 0) {
                element.classList.add('slide-in-left');
            } else {
                element.classList.add('slide-in-right');
            }
        } else if (element.classList.contains('stat-item') || element.classList.contains('achievement-item')) {
            element.classList.add('scale-in');
        } else {
            element.classList.add('fade-in');
        }
        observer.observe(element);
    });
});


// Project Filtering
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');

        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Filter projects with animation
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');

            if (filter === 'all' || category === filter) {
                card.style.display = 'block'; // Ensure it's visible before animating
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100); // Small delay for display block to take effect
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none'; // Hide after animation
                }, 300);
            }
        });
    });
});

// Contact Form Handling (Client-side simulation)
contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const formButton = contactForm.querySelector('button[type="submit"]');
    const originalText = formButton.innerHTML;

    // Show loading state
    formButton.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin ml-2"></i>';
    formButton.disabled = true;

    // --- Backend Integration Placeholder ---
    // To make this form truly functional, you'll need a backend.
    // Here's how you might integrate with a serverless function (e.g., Netlify Functions, AWS Lambda, Google Cloud Functions):
    /*
    try {
        const response = await fetch('/.netlify/functions/send-email', { // Replace with your actual endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(Object.fromEntries(formData)),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
        } else {
            showNotification(result.message || 'Failed to send message. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error submitting form:', error);
        showNotification('An error occurred. Please try again.', 'error');
    } finally {
        // Reset button state regardless of success or failure
        formButton.innerHTML = originalText;
        formButton.disabled = false;
    }
    */

    // Simulate form submission for now (remove this block when integrating backend)
    setTimeout(() => {
        showNotification('Message sent successfully! (Simulated)', 'success');
        contactForm.reset();
        formButton.innerHTML = originalText;
        formButton.disabled = false;
    }, 2000);
});

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content flex items-center gap-4">
            <span>${message}</span>
            <button class="notification-close text-xl leading-none">&times;</button>
        </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) { // Check if notification is still in DOM
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
}

// Enhanced Particle System
function initParticles() {
    const particleContainer = document.querySelector('.particles');
    if (!particleContainer) return;

    const particleCount = 50; // Number of particles

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px; /* Random size between 2px and 6px */
            height: ${Math.random() * 4 + 2}px;
            background: rgba(0, 212, 255, ${Math.random() * 0.5 + 0.2}); /* Semi-transparent blue */
            border-radius: 50%;
            left: ${Math.random() * 100}%; /* Random horizontal position */
            top: ${Math.random() * 100}%; /* Random vertical position */
            animation: floatParticle ${Math.random() * 10 + 10}s linear infinite; /* Random animation duration */
            animation-delay: ${Math.random() * 5}s; /* Random animation delay */
        `;
        particleContainer.appendChild(particle);
    }
}

// Initialize particles on DOM content loaded
document.addEventListener('DOMContentLoaded', initParticles);

// Skill Item Hover Effects (retained from original CSS, but JS can enhance)
const skillItems = document.querySelectorAll('.skill-item');
skillItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-2px) scale(1.05)';
        item.style.boxShadow = '0 10px 25px rgba(0, 212, 255, 0.3)';
    });

    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
        item.style.boxShadow = 'none';
    });
});

// Parallax Effect for Hero Section geometric shapes
let tickingParallax = false;
function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.geometric-shapes .shape');

    parallaxElements.forEach((element, index) => {
        const speed = (index + 1) * 0.05; // Reduced speed for subtlety
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });

    tickingParallax = false;
}

function requestTickParallax() {
    if (!tickingParallax) {
        requestAnimationFrame(updateParallax);
        tickingParallax = true;
    }
}
window.addEventListener('scroll', requestTickParallax);


// Copy to Clipboard Functionality
function copyToClipboard(text) {
    // Use execCommand for broader compatibility in iframes
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        document.execCommand('copy');
        showNotification('Copied to clipboard!', 'success');
    } catch (err) {
        console.error('Failed to copy text: ', err);
        showNotification('Failed to copy text. Please copy manually.', 'error');
    } finally {
        document.body.removeChild(tempInput);
    }
}

// Add click to copy for contact info
const contactLinks = document.querySelectorAll('.contact-link');
contactLinks.forEach(link => {
    // Only add listener if it's an email or phone link
    if (link.href.startsWith('mailto:') || link.href.startsWith('tel:')) {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default mailto/tel behavior
            const textToCopy = link.textContent.trim(); // Get the visible text
            copyToClipboard(textToCopy);
        });
    }
});

// Animate Numbers/Stats
function animateNumbers() {
    const numbers = document.querySelectorAll('.stat-number');

    numbers.forEach(number => {
        const target = parseInt(number.textContent); // Get the number part
        const hasPlus = number.textContent.includes('+'); // Check for '+'
        const increment = target / 100; // Increment step
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            number.textContent = Math.floor(current) + (hasPlus ? '+' : '');
        }, 20); // Update every 20ms
    });
}

// Trigger number animation when stats section is visible
const statsSection = document.querySelector('.about-stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
                statsObserver.unobserve(entry.target); // Stop observing after animation
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% of the section is visible

    statsObserver.observe(statsSection);
}

// Dynamic Copyright Year
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// Smooth scrolling for all internal links (re-checking to ensure it works with fixed header)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - (nav ? nav.offsetHeight : 0); // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Add loading animation to buttons (ripple effect)
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple element
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        // Get click position relative to the button
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - (size / 2);
        const y = e.clientY - rect.top - (size / 2);

        // Set ripple styles
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        ripple.style.background = 'rgba(255, 255, 255, 0.3)';
        ripple.style.borderRadius = '50%';
        ripple.style.position = 'absolute';
        ripple.style.transform = 'scale(0)';
        ripple.style.opacity = '1';
        ripple.style.pointerEvents = 'none';
        ripple.style.transition = 'transform 0.6s ease-out, opacity 0.6s ease-out'; // Use transition for animation

        // Append to button
        this.appendChild(ripple);

        // Trigger animation
        setTimeout(() => {
            ripple.style.transform = 'scale(4)';
            ripple.style.opacity = '0';
        }, 10); // Small delay to ensure styles are applied before transition

        // Remove ripple after animation
        ripple.addEventListener('transitionend', () => {
            ripple.remove();
        });
    });
});

// Easter egg - Konami Code
let konamiCode = [];
const konamiSequence = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.code);
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift(); // Keep array length fixed
    }

    if (konamiCode.join('') === konamiSequence.join('')) {
        showNotification('🎉 Easter egg activated! You found the Konami Code!', 'success');

        // Add special effect (rainbow animation)
        document.body.style.animation = 'rainbow 2s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = ''; // Remove animation after it completes
        }, 2000);
    }
});

// --- Gemini API Integration: Project Description Generator ---

// Function to show the modal
function showProjectDescriptionModal() {
    if (projectDescriptionModal) {
        projectDescriptionModal.classList.remove('hidden');
        setTimeout(() => {
            projectDescriptionModal.classList.add('show');
        }, 10); // Small delay for transition
    }
}

// Function to hide the modal
function hideProjectDescriptionModal() {
    if (projectDescriptionModal) {
        projectDescriptionModal.classList.remove('show');
        setTimeout(() => {
            projectDescriptionModal.classList.add('hidden');
        }, 300); // Match CSS transition duration
    }
}

// Event listener for modal close button
modalCloseBtn?.addEventListener('click', hideProjectDescriptionModal);

// Close modal when clicking outside content
projectDescriptionModal?.addEventListener('click', (e) => {
    if (e.target === projectDescriptionModal) {
        hideProjectDescriptionModal();
    }
});

// Function to generate project description using Gemini API
async function generateProjectDescription(projectTitle, currentDescription) {
    if (!modalProjectTitle || !modalProjectDescription || !modalLoadingSpinner) return;

    showProjectDescriptionModal();
    modalProjectTitle.textContent = projectTitle;
    modalProjectDescription.innerHTML = ''; // Clear previous content
    modalLoadingSpinner.classList.remove('hidden'); // Show spinner

    const prompt = `Expand on the following project idea, providing a more detailed description, potential features, and the impact it could have.
    Project Title: "${projectTitle}"
    Current Short Description: "${currentDescription}"

    Please provide a detailed, engaging description (around 150-250 words) that elaborates on the project's purpose, key functionalities, and its value proposition. Structure it with a clear introduction, body, and conclusion.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = { contents: chatHistory };
    const apiKey = ""; // Canvas will automatically provide the API key at runtime
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            modalProjectDescription.innerHTML = text.replace(/\n/g, '<br>'); // Display text, convert newlines to <br>
        } else {
            modalProjectDescription.textContent = "Could not generate description. Please try again.";
            console.error("Gemini API response structure unexpected:", result);
        }
    } catch (error) {
        modalProjectDescription.textContent = "Error connecting to the Gemini API. Please check your network or try again later.";
        console.error("Error calling Gemini API:", error);
    } finally {
        modalLoadingSpinner.classList.add('hidden'); // Hide spinner
    }
}

// Add event listeners to all "Generate Description" buttons
generateDescriptionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const projectTitle = button.dataset.projectTitle || "Untitled Project";
        const projectDescription = button.dataset.projectDescription || "";
        generateProjectDescription(projectTitle, projectDescription);
    });
});

console.log('🚀 Portfolio loaded successfully!');
console.log('💡 Try the Konami Code: ↑↑↓↓←→←→BA');
