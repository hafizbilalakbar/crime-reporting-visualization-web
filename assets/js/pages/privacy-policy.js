// Privacy Policy Page JavaScript

// DOM elements
const scrollToTopBtn = document.getElementById('scroll-to-top');
const tocLinks = document.querySelectorAll('.toc-list a');
const privacySections = document.querySelectorAll('.privacy-section');

// Initialize Privacy Policy page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set up scroll to top button
    initScrollToTop();
    
    // Set up Table of Contents navigation
    initTocNavigation();
    
    // Highlight section based on URL hash on page load
    highlightSectionFromHash();
    
    // Update active section on scroll
    window.addEventListener('scroll', updateActiveSection);
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

// Initialize Table of Contents navigation
function initTocNavigation() {
    // Add click handlers to all TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section id from href
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Scroll to the target section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL hash without page jump
                history.pushState(null, null, targetId);
                
                // Highlight the target section
                highlightSection(targetSection);
                
                // Update active link in TOC
                updateActiveTocLink(this);
            }
        });
    });
}

// Highlight a section
function highlightSection(section) {
    // Remove highlight from all sections
    privacySections.forEach(s => s.classList.remove('highlight'));
    
    // Add highlight to the target section
    section.classList.add('highlight');
    
    // Remove highlight after animation completes
    setTimeout(() => {
        section.classList.remove('highlight');
    }, 2000);
}

// Update active TOC link
function updateActiveTocLink(activeLink) {
    // Remove active class from all links
    tocLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to the clicked link
    activeLink.classList.add('active');
}

// Highlight section based on URL hash
function highlightSectionFromHash() {
    if (window.location.hash) {
        const targetSection = document.querySelector(window.location.hash);
        const targetLink = document.querySelector(`.toc-list a[href="${window.location.hash}"]`);
        
        if (targetSection) {
            // Wait for page to settle
            setTimeout(() => {
                // Scroll to the target section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Highlight the target section
                highlightSection(targetSection);
                
                // Update active link in TOC
                if (targetLink) {
                    updateActiveTocLink(targetLink);
                }
            }, 500);
        }
    }
}

// Update active section on scroll
function updateActiveSection() {
    // Find the section currently in view
    let currentSection = null;
    let smallestDistance = Infinity;
    
    privacySections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const distance = Math.abs(rect.top);
        
        if (distance < smallestDistance && rect.top <= 100) {
            smallestDistance = distance;
            currentSection = section;
        }
    });
    
    if (currentSection) {
        // Get the id of the current section
        const currentId = `#${currentSection.id}`;
        
        // Find the TOC link for this section
        const currentTocLink = document.querySelector(`.toc-list a[href="${currentId}"]`);
        
        if (currentTocLink) {
            // Update active link in TOC
            updateActiveTocLink(currentTocLink);
            
            // Update URL hash without page jump
            if (window.location.hash !== currentId) {
                history.replaceState(null, null, currentId);
            }
        }
    }
} 