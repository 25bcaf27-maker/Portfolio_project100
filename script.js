// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Form submission handler
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Disable button to prevent double submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    try {
        // Connected to Render Backend!
        const BACKEND_URL = 'https://portfolio-project100.onrender.com';
        
        // Send data to our backend API natively built on Node.js
        const response = await fetch(`${BACKEND_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            formStatus.textContent = 'Message sent successfully!';
            formStatus.classList.add('success');
            contactForm.reset();
        } else {
            throw new Error('Failed to send message');
        }
    } catch (error) {
        formStatus.textContent = 'Oops! Could not connect to the Backend. Make sure your server is running.';
        formStatus.classList.add('error');
        console.error('Error submitting form:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
});
