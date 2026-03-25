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
        // Direct Database Connection using Supabase REST API
        const SUPABASE_URL = 'https://grqyndcnsgxywbvmszml.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycXluZGNuc2d4eXdidm1zem1sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMTg2NjgsImV4cCI6MjA4OTg5NDY2OH0.NWyhdNgVQSuRqQHRKKEUH6XdBtr9rrjF54MMCrsrQ0Q';
        
        // Send data directly to Supabase table "contacts"
        const response = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
            method: 'POST',
            headers: {
                'apikey': SUPABASE_ANON_KEY,
                'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(formData)
        });

        if (response.ok || response.status === 201) {
            formStatus.textContent = 'Message sent successfully!';
            formStatus.classList.add('success');
            contactForm.reset();
        } else {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to send message');
        }
    } catch (error) {
        formStatus.textContent = 'Oops! Could not save to database. Ensure the "contacts" table exists in Supabase.';
        formStatus.classList.add('error');
        console.error('Error submitting form:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
});
