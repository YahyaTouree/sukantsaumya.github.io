// DOM Elements
const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const mobileNavMenu = document.querySelector('.mobile-nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const typingText = document.querySelector('.typing-text');
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.querySelector('.form');
const loadingScreen = document.querySelector('.loading');
const currentYearElement = document.getElementById('current-year');

// Modal Elements for Project Description
const projectDescriptionModal = document.getElementById('project-description-modal');
const modalCloseBtn = projectDescriptionModal?.querySelector('.modal-close-btn');
const modalProjectTitle = projectDescriptionModal?.querySelector('#modal-project-title');
const modalProjectDescription = projectDescriptionModal?.querySelector('#modal-project-description');
const modalLoadingSpinner = projectDescriptionModal?.querySelector('#modal-loading-spinner');
const generateDescriptionButtons = document.querySelectorAll('.generate-description-btn');

// PNR Widget Elements
const pnrInput = document.getElementById('pnr-input');
const pnrSubmitBtn = document.getElementById('pnr-submit-btn');
const pnrResultContainer = document.getElementById('pnr-result');

// --- Initial Setup ---

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    }, 500);
});

// Typing Animation
document.addEventListener('DOMContentLoaded', () => {
    const phrases = ["Flutter Developer", "CS Student", "Mobile App Developer", "Problem Solver", "Tech Enthusiast"];
    let currentPhrase = 0;
    let currentChar = 0;
    let isDeleting = false;

    function typeText() {
        if (!typingText) return;
        const current = phrases[currentPhrase];
        let typeSpeed = 100;

        if (isDeleting) {
            typingText.textContent = current.substring(0, currentChar - 1);
            currentChar--;
            typeSpeed = 50;
        } else {
            typingText.textContent = current.substring(0, currentChar + 1);
            currentChar++;
        }

        if (!isDeleting && currentChar === current.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && currentChar === 0) {
            isDeleting = false;
            currentPhrase = (currentPhrase + 1) % phrases.length;
            typeSpeed = 500;
        }
        setTimeout(typeText, typeSpeed);
    }
    setTimeout(typeText, 1000);
});


// --- UI Enhancements & Animations ---

// Navigation Scroll Effect
window.addEventListener('scroll', () => {
    if (nav) {
        nav.classList.toggle('scrolled', window.scrollY > 50);
        nav.classList.toggle('shadow-lg', window.scrollY > 50);
    }
});

// Mobile Navigation Toggle
navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileNavMenu.classList.toggle('translate-x-full');
    mobileNavMenu.classList.toggle('translate-x-0');
});

// Close mobile menu on link click
mobileNavMenu?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileNavMenu.classList.add('translate-x-full');
        mobileNavMenu.classList.remove('translate-x-0');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - (nav ? nav.offsetHeight : 0);
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

// Intersection Observer for Animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.animate-fadeIn, .animate-slideInLeft, .animate-slideInRight, .animate-scaleIn, .animate-fadeInUp').forEach(el => {
        observer.observe(el);
    });
});

// Project Filtering
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        projectCards.forEach(card => {
            const category = card.dataset.category;
            const matches = (filter === 'all' || category === filter);
            card.style.display = matches ? 'block' : 'none';
        });
    });
});


// --- Interactive Features ---

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `<span>${message}</span><button class="notification-close">&times;</button>`;
    document.body.appendChild(notification);
    setTimeout(() => notification.classList.add('show'), 10);
    const close = () => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    };
    notification.querySelector('.notification-close').addEventListener('click', close);
    setTimeout(close, 5000);
}

// Contact Form Simulation
contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin ml-2"></i>';
    btn.disabled = true;
    setTimeout(() => {
        showNotification('Message sent successfully! (Simulated)', 'success');
        contactForm.reset();
        btn.innerHTML = originalHtml;
        btn.disabled = false;
    }, 2000);
});

// Dynamic Copyright Year
if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
}

// --- Gemini API Integrations ---

// 1. Project Description Generator
async function generateProjectDescription(projectTitle, currentDescription) {
    if (!projectDescriptionModal) return;
    
    projectDescriptionModal.classList.remove('hidden');
    setTimeout(() => projectDescriptionModal.classList.add('show'), 10);
    modalProjectTitle.textContent = projectTitle;
    modalProjectDescription.innerHTML = '';
    modalLoadingSpinner.classList.remove('hidden');

    const prompt = `You are a tech project analyst. Based on the following information, generate a detailed and professional project overview.
    
    Project Title: "${projectTitle}"
    Short Description: "${currentDescription}"

    Your response should be structured in markdown format with the following sections:
    - **Overview:** A more detailed paragraph expanding on the short description.
    - **Key Features:** A bulleted list of 3-5 potential or existing key features.
    - **Potential Impact:** A short paragraph on the value or impact this project could have.`;

    try {
        const text = await callGemini(prompt);
        // A simple markdown to HTML converter
        let html = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
            .replace(/\* (.*?)\n/g, '<li class="ml-4 list-disc">$1</li>') // List items
            .replace(/\n/g, '<br>'); // Newlines
        modalProjectDescription.innerHTML = html;
    } catch (error) {
        modalProjectDescription.textContent = `Error: ${error.message}`;
        showNotification('Failed to generate description.', 'error');
    } finally {
        modalLoadingSpinner.classList.add('hidden');
    }
}

generateDescriptionButtons.forEach(button => {
    button.addEventListener('click', () => {
        generateProjectDescription(button.dataset.projectTitle, button.dataset.projectDescription);
    });
});

// Modal closing logic
function hideProjectDescriptionModal() {
    if (!projectDescriptionModal) return;
    projectDescriptionModal.classList.remove('show');
    setTimeout(() => projectDescriptionModal.classList.add('hidden'), 300);
}
modalCloseBtn?.addEventListener('click', hideProjectDescriptionModal);
projectDescriptionModal?.addEventListener('click', (e) => {
    if (e.target === projectDescriptionModal) hideProjectDescriptionModal();
});


// 2. PNR Status Checker
async function checkPnrStatus(pnrNumber) {
    if (!pnrResultContainer || !pnrSubmitBtn) return;
    
    pnrResultContainer.innerHTML = '<div class="flex justify-center items-center"><div class="loader w-8 h-8 border-4 border-lime-500 border-t-emerald-500 rounded-full animate-spin"></div><p class="ml-4">Checking PNR status...</p></div>';
    pnrResultContainer.classList.remove('hidden');
    pnrSubmitBtn.disabled = true;

    const prompt = `Generate a fictional but realistic Indian Railways PNR status for PNR number ${pnrNumber}. The journey should be between two major Indian cities.`;
    const schema = {
        type: "OBJECT",
        properties: {
            pnrNumber: { type: "STRING" },
            trainName: { type: "STRING" },
            trainNumber: { type: "STRING" },
            journeyDate: { type: "STRING" },
            fromStation: { type: "STRING" },
            toStation: { type: "STRING" },
            boardingStation: { type: "STRING" },
            "class": { type: "STRING" },
            chartPrepared: { type: "BOOLEAN" },
            passengers: {
                type: "ARRAY",
                items: {
                    type: "OBJECT",
                    properties: {
                        name: { type: "STRING" },
                        bookingStatus: { type: "STRING" },
                        currentStatus: { type: "STRING" }
                    }
                }
            }
        }
    };

    try {
        const jsonText = await callGemini(prompt, schema);
        const data = JSON.parse(jsonText);
        renderPnrResult(data);
    } catch (error) {
        pnrResultContainer.innerHTML = `<p class="text-red-400 text-center">Could not fetch PNR status. ${error.message}</p>`;
        showNotification('Failed to check PNR status.', 'error');
    } finally {
        pnrSubmitBtn.disabled = false;
    }
}

function renderPnrResult(data) {
    const passengersHtml = data.passengers.map(p => `
        <div class="grid grid-cols-3 gap-4 py-2 border-b border-gray-700 last:border-b-0">
            <span>${p.name}</span>
            <span class="text-center">${p.bookingStatus}</span>
            <span class="text-center font-bold ${p.currentStatus.startsWith('CNF') ? 'text-green-400' : 'text-yellow-400'}">${p.currentStatus}</span>
        </div>
    `).join('');

    pnrResultContainer.innerHTML = `
        <div class="pnr-header flex justify-between items-center mb-4 pb-4 border-b border-gray-600">
            <div>
                <h4 class="text-xl font-bold text-emerald-400">${data.trainName} (${data.trainNumber})</h4>
                <p class="text-sm text-gray-400">${data.fromStation} to ${data.toStation}</p>
            </div>
            <div class="text-right">
                <p class="text-sm text-gray-400">Journey Date</p>
                <p class="font-semibold">${data.journeyDate}</p>
            </div>
        </div>
        <div class="pnr-body">
             <div class="grid grid-cols-3 gap-4 font-semibold text-gray-300 mb-2">
                <span>Passenger</span>
                <span class="text-center">Booking Status</span>
                <span class="text-center">Current Status</span>
            </div>
            ${passengersHtml}
        </div>
        <div class="pnr-footer mt-4 pt-4 border-t border-gray-600 text-center text-sm text-gray-400">
            Charting Status: <span class="font-semibold ${data.chartPrepared ? 'text-green-400' : 'text-red-400'}">${data.chartPrepared ? 'Chart Prepared' : 'Chart Not Prepared'}</span>
        </div>
    `;
}

pnrSubmitBtn?.addEventListener('click', () => {
    const pnr = pnrInput.value.trim();
    if (pnr.length === 10 && /^\d+$/.test(pnr)) {
        checkPnrStatus(pnr);
    } else {
        showNotification('Please enter a valid 10-digit PNR number.', 'error');
        pnrResultContainer.innerHTML = `<p class="text-red-400 text-center">Invalid PNR number.</p>`;
        pnrResultContainer.classList.remove('hidden');
    }
});


// Generic Gemini API Caller Function
async function callGemini(prompt, jsonSchema = null) {
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };

    if (jsonSchema) {
        payload.generationConfig = {
            responseMimeType: "application/json",
            responseSchema: jsonSchema,
        };
    }

    const apiKey = "AIzaSyCc_DypSOJUn--LeWBQqxHyhBeSzj_ZLPM";
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'API request failed');
    }

    const result = await response.json();

    if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
        return result.candidates[0].content.parts[0].text;
    } else {
        throw new Error('Received an empty or malformed response from the API.');
    }
}

console.log('🚀 Portfolio loaded successfully with Gemini features!');
