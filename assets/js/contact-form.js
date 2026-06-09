// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFaqAccordion();
    initAOS();
});

// Initialize AOS animations
function initAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
}

// Initialize FAQ Accordion
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!faqItems.length) return;
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            
            // Change icon
            const icon = question.querySelector('.toggle-icon');
            if (item.classList.contains('active')) {
                icon.textContent = '×';
            } else {
                icon.textContent = '+';
            }
        });
    });
}

// Initialize Contact Form
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const statusMessage = document.querySelector('.status-message');
    
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm(contactForm)) return;
        
        // Simulate form submission
        submitForm(contactForm, statusMessage);
    });
    
    // Add input validation on blur
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(input);
        });
        
        // Clear validation on focus
        input.addEventListener('focus', function() {
            clearValidation(input);
            if (statusMessage) {
                statusMessage.textContent = '';
                statusMessage.classList.remove('success', 'error');
            }
        });
    });
}

// Validate the entire form
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (!validateInput(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Validate individual input
function validateInput(input) {
    if (input.type === 'checkbox') {
        return validateCheckbox(input);
    }
    
    // Skip validation for optional fields if empty
    if (input.name === 'phone' && input.value === '') {
        clearValidation(input);
        return true;
    }
    
    // Required field validation
    if (input.required && input.value.trim() === '') {
        setError(input, 'This field is required');
        return false;
    }
    
    // Email validation
    if (input.type === 'email' && input.value.trim() !== '') {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(input.value.trim())) {
            setError(input, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation (basic)
    if (input.name === 'phone' && input.value.trim() !== '') {
        const phonePattern = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        if (!phonePattern.test(input.value.trim())) {
            setError(input, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Message min length validation
    if (input.name === 'message' && input.value.trim().length < 20) {
        setError(input, 'Message should be at least 20 characters');
        return false;
    }
    
    // Clear any existing errors if validation passes
    clearValidation(input);
    return true;
}

// Validate checkbox
function validateCheckbox(checkbox) {
    if (checkbox.required && !checkbox.checked) {
        setError(checkbox, 'You must agree to continue');
        return false;
    }
    
    clearValidation(checkbox);
    return true;
}

// Set error message
function setError(input, message) {
    // Remove any existing error
    clearValidation(input);
    
    // Add error class to input
    input.classList.add('error');
    
    // Create and append error message
    const errorSpan = document.createElement('span');
    errorSpan.className = 'error-message';
    errorSpan.textContent = message;
    
    // Find the parent form-group
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        formGroup.appendChild(errorSpan);
    }
}

// Clear validation
function clearValidation(input) {
    input.classList.remove('error');
    
    // Find and remove error message
    const formGroup = input.closest('.form-group');
    if (formGroup) {
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
}

// Simulate form submission
function submitForm(form, statusMessage) {
    // Disable submit button
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    // Simulate API call with timeout
    setTimeout(() => {
        // Show success message
        if (statusMessage) {
            statusMessage.textContent = 'Your message has been sent successfully. We\'ll get back to you soon!';
            statusMessage.classList.add('success');
        }
        
        // Reset form
        form.reset();
        
        // Re-enable submit button
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
        
        // Clear success message after 5 seconds
        setTimeout(() => {
            if (statusMessage) {
                statusMessage.textContent = '';
                statusMessage.classList.remove('success');
            }
        }, 5000);
    }, 1500);
}

// Add form styling based on validation
document.addEventListener('DOMContentLoaded', function() {
    const formInputs = document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea');
    
    formInputs.forEach(input => {
        // Add styles for inputs with content
        input.addEventListener('input', function() {
            if (input.value.trim() !== '') {
                input.classList.add('has-content');
            } else {
                input.classList.remove('has-content');
            }
        });
    });
}); 