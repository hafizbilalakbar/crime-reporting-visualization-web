// Terms of Use Page JavaScript

// DOM elements
const scrollToTopBtn = document.getElementById('scroll-to-top');
const termsLinks = document.querySelectorAll('a[href^="#"]');
const termsSections = document.querySelectorAll('.terms-section');
const acceptButton = document.querySelector('.btn-primary');
const rejectButton = document.querySelector('.btn-outline');

// Initialize Terms page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set up scroll to top button
    initScrollToTop();
    
    // Set up section navigation
    initSectionNavigation();
    
    // Set up buttons
    initButtons();
});

// Initialize scroll to top button
function initScrollToTop() {
    // Show/hide button based on scroll position
    window.addEventListener('scroll', toggleScrollButton);
    
    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', scrollToTop);
    
    // Initial check on page load
    toggleScrollButton();
}

// Toggle scroll button visibility
function toggleScrollButton() {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
    } else {
        scrollToTopBtn.classList.remove('visible');
    }
}

// Scroll to top function
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Initialize section navigation
function initSectionNavigation() {
    // Add click handlers to all internal links
    termsLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Get the target section id from href
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                e.preventDefault();
                
                // Scroll to the target section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Highlight the target section
                highlightSection(targetSection);
            }
        });
    });
    
    // Add hover effect to sections
    termsSections.forEach(section => {
        section.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'var(--bg-hover)';
            this.style.transition = 'background-color 0.3s ease';
        });
        
        section.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
        });
    });
}

// Highlight a section
function highlightSection(section) {
    // Remove highlight from all sections
    termsSections.forEach(s => s.classList.remove('highlight'));
    
    // Add highlight to the target section
    section.classList.add('highlight');
    
    // Remove highlight after animation completes
    setTimeout(() => {
        section.classList.remove('highlight');
    }, 2000);
}

// Initialize buttons
function initButtons() {
    if (acceptButton) {
        acceptButton.addEventListener('click', function() {
            // In a real application, this would set a cookie or localStorage flag
            // to indicate the user has accepted the terms
            console.log('Terms accepted');
            localStorage.setItem('termsAccepted', 'true');
            
            // Optionally display a confirmation
            showConfirmation('You have accepted the Terms of Use.');
        });
    }
    
    if (rejectButton) {
        rejectButton.addEventListener('click', function() {
            // In a real application, this might redirect to a page explaining
            // why accepting terms is necessary or back to the previous page
            console.log('Terms rejected');
            
            // Show a confirmation dialog
            if (confirm('You must accept the Terms of Use to continue using the platform. Are you sure you want to go back?')) {
                window.history.back();
            }
        });
    }
}

// Show a confirmation message
function showConfirmation(message) {
    // Create confirmation element
    const confirmation = document.createElement('div');
    confirmation.className = 'terms-confirmation';
    confirmation.textContent = message;
    
    // Add to DOM
    document.body.appendChild(confirmation);
    
    // Show the confirmation
    setTimeout(() => {
        confirmation.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        confirmation.classList.remove('show');
        setTimeout(() => {
            confirmation.remove();
        }, 300);
    }, 3000);
} 