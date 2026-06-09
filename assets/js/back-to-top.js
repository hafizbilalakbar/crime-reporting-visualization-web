/**
 * Back to Top Button Functionality
 * Simple scroll-to-top button that appears when scrolling down
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get the button element
    const backToTopBtn = document.getElementById('back-to-top-container');
    
    if (!backToTopBtn) return;
    
    // Show button when user scrolls down 300px from top
    const scrollThreshold = 300;
    
    // Function to handle scroll events
    function handleScroll() {
        if (window.pageYOffset > scrollThreshold) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }
    
    // Add click event for smooth scrolling
    document.getElementById('back-to-top-btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Smooth scroll to top
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add scroll event listener with throttling for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(function() {
                handleScroll();
                scrollTimeout = null;
            }, 100);
        }
    });
    
    // Initial check
    handleScroll();
}); 