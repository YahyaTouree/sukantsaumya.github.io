// --- CORE UI & ANIMATIONS ---

// Feather Icons
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
        if(mobileMenu.offsetParent !== null) { // Check if menu is visible
            mobileMenu.classList.add('hidden');
        }
    });
});

// Fade-in on scroll animation
const faders = document.querySelectorAll('.fade-in');
const appearOptions = {
    threshold: 0.15,
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

// --- GEMINI API INTEGRATION ---

const summaryButtons = document.querySelectorAll('.generate-summary-btn');
const modal = document.getElementById('ai-summary-modal');
const modalBody = document.getElementById('modal-body');
const modalTitle = document.getElementById('modal-title');
const closeModalButton = document.getElementById('modal-close-button');

// Function to open the modal
const openModal = () => {
    modal.classList.add('visible');
};

// Function to close the modal
const closeModal = () => {
    modal.classList.remove('visible');
};

// Event listeners for modal
closeModalButton.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Generic Gemini API Caller Function
async function callGemini(prompt) {
    const apiKey = "AIzaSyCc_DypSOJUn--LeWBQqxHyhBeSzj_ZLPM"; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error:", errorData);
            throw new Error(errorData.error?.message || 'API request failed');
        }

        const result = await response.json();
        
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            // Basic sanitization to prevent injecting unintended scripts
            let unsafeHtml = result.candidates[0].content.parts[0].text;
            let safeHtml = unsafeHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
            return safeHtml;
        } else {
            console.error("Invalid response structure:", result);
            throw new Error('Received an empty or malformed response from the API.');
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        throw error;
    }
}

// Add event listener to each summary button
summaryButtons.forEach(button => {
    button.addEventListener('click', async () => {
        const projectCard = button.closest('.project-card');
        const projectTitle = projectCard.querySelector('h3').innerText;
        const projectDetailsElement = projectCard.querySelector('[data-full-text]');
        const fullText = projectDetailsElement.dataset.fullText;

        // 1. Show modal with a loading spinner
        modalTitle.innerText = `AI Summary: ${projectTitle}`;
        modalBody.innerHTML = '<div class="spinner"></div><p class="text-center text-slate-400">Generating summary...</p>';
        openModal();

        // 2. Construct the prompt
        const prompt = `
            Summarize the following project case study for a busy executive or recruiter. 
            Format the response in clean HTML using <h4> for titles and <p> for text.
            Focus on these three key areas:
            1. The core business problem the client faced.
            2. The technical solution I implemented.
            3. The final, quantifiable business result.

            Here is the case study text:
            ---
            ${fullText}
            ---
        `;

        // 3. Call the API
        try {
            const summaryHtml = await callGemini(prompt);
            modalBody.innerHTML = summaryHtml;
        } catch (error) {
            modalBody.innerHTML = `<p class="text-red-400">Sorry, there was an error generating the summary. Please try again later.</p><p class="text-xs text-slate-500 mt-2">Error: ${error.message}</p>`;
        }
    });
});
