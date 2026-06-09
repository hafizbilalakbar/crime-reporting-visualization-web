// Help Center JavaScript

// DOM elements
const scrollToTopBtn = document.getElementById('scroll-to-top');
const searchInput = document.querySelector('.search-input');
const searchTags = document.querySelectorAll('.search-tag');
const videoCards = document.querySelectorAll('.video-card');

// Initialize Help Center functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set up scroll to top button
    initScrollToTop();
    
    // Set up search functionality
    initSearch();
    
    // Set up video card click handlers
    initVideoCards();
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

// Initialize search functionality
function initSearch() {
    // Handle search input
    if (searchInput) {
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
            }
        });

        // Handle search button click
        const searchBtn = document.querySelector('.search-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', function() {
                performSearch(searchInput.value);
            });
        }
    }
    
    // Handle search tag clicks
    searchTags.forEach(tag => {
        tag.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section id from href
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
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
}

// Perform search (demo functionality)
function performSearch(query) {
    if (!query || query.trim() === '') {
        return;
    }
    
    // For demo purposes, just log the search query
    console.log('Searching for:', query);
    
    // In a real implementation, this would filter help articles
    // For now, just show an alert
    alert('Searching for: ' + query + '\n\nThis is a demo functionality. In a real implementation, this would search through help articles.');
}

// Highlight a section briefly
function highlightSection(section) {
    // Add a highlight class
    section.classList.add('section-highlight');
    
    // Remove the highlight class after 1.5 seconds
    setTimeout(() => {
        section.classList.remove('section-highlight');
    }, 1500);
}

// Initialize video card functionality
function initVideoCards() {
    videoCards.forEach(card => {
        card.addEventListener('click', function() {
            // In a real implementation, this would play the video
            // For demo purposes, just log the click
            const videoTitle = this.querySelector('h3').textContent;
            console.log('Playing video:', videoTitle);
            
            // Show a demo alert
            alert('Playing video: ' + videoTitle + '\n\nThis is a demo functionality. In a real implementation, this would play the video.');
        });
    });
} 