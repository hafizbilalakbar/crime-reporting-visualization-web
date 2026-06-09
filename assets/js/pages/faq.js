// FAQ Page JavaScript

// DOM elements
const faqItems = document.querySelectorAll('.faq-item');
const categoryTabs = document.querySelectorAll('.category-tab');
const categoryContents = document.querySelectorAll('.faq-category-content');
const scrollToTopBtn = document.getElementById('scroll-to-top');

// Initialize FAQ functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set up FAQ accordion functionality
    initFaqAccordion();
    
    // Set up category tabs
    initCategoryTabs();
    
    // Set up scroll to top button
    initScrollToTop();
});

// Initialize FAQ accordion
function initFaqAccordion() {
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            // Close other open items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

// Initialize category tabs
function initCategoryTabs() {
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            categoryTabs.forEach(otherTab => {
                otherTab.classList.remove('active');
            });
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Get the category to show
            const category = tab.getAttribute('data-category');
            
            // Hide all category contents
            categoryContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // Show the selected category content
            document.getElementById(category).classList.add('active');
            
            // Scroll to the category section with smooth behavior
            document.querySelector('.faq-container').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

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