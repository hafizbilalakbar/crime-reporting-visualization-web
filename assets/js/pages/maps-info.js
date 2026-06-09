// Maps Info Page JavaScript

// DOM elements
const scrollToTopBtn = document.getElementById('scroll-to-top');
const guideSteps = document.querySelectorAll('.guide-step');
const legendItems = document.querySelectorAll('.legend-item');

// Initialize Maps Info functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set up scroll to top button
    initScrollToTop();
    
    // Set up guide steps interactions
    initGuideSteps();
    
    // Set up legend item interactions
    initLegendItems();
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

// Initialize guide steps interactions
function initGuideSteps() {
    guideSteps.forEach(step => {
        // Make the entire step clickable to expand/focus
        step.addEventListener('click', function() {
            // Focus on this step
            highlightStep(step);
        });
        
        // Make step images zoomable on click
        const stepImage = step.querySelector('.step-image');
        if (stepImage) {
            stepImage.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent triggering the parent step click
                toggleImageZoom(stepImage);
            });
        }
    });
}

// Highlight a step
function highlightStep(step) {
    // Remove highlight from all steps
    guideSteps.forEach(s => s.classList.remove('active-step'));
    
    // Add highlight to the clicked step
    step.classList.add('active-step');
    
    // Scroll the step into view if needed
    step.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
    
    // Remove the highlight after a delay
    setTimeout(() => {
        step.classList.remove('active-step');
    }, 2000);
}

// Toggle image zoom effect
function toggleImageZoom(imageContainer) {
    // Toggle zoom class
    imageContainer.classList.toggle('zoomed');
    
    // If zoomed, add an overlay and click-outside-to-close behavior
    if (imageContainer.classList.contains('zoomed')) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'zoom-overlay';
        document.body.appendChild(overlay);
        
        // Add click handler to close when clicking outside
        overlay.addEventListener('click', function() {
            imageContainer.classList.remove('zoomed');
            overlay.remove();
        });
    } else {
        // Remove overlay if it exists
        const overlay = document.querySelector('.zoom-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
}

// Initialize legend item interactions
function initLegendItems() {
    legendItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            // Add a subtle scale effect
            item.style.transform = 'scale(1.05)';
            item.style.transition = 'transform 0.2s ease';
            
            // Show a tooltip with more info
            const legendText = item.querySelector('.legend-text').textContent;
            showTooltip(item, legendText);
        });
        
        item.addEventListener('mouseleave', function() {
            // Remove scale effect
            item.style.transform = 'scale(1)';
            
            // Hide tooltip
            hideTooltip();
        });
    });
}

// Show tooltip
function showTooltip(element, text) {
    // Remove any existing tooltips
    hideTooltip();
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'legend-tooltip';
    tooltip.textContent = text;
    
    // Position tooltip
    const rect = element.getBoundingClientRect();
    tooltip.style.top = rect.bottom + 10 + 'px';
    tooltip.style.left = rect.left + (rect.width / 2) + 'px';
    
    // Add to DOM
    document.body.appendChild(tooltip);
    
    // Animate in
    setTimeout(() => {
        tooltip.style.opacity = '1';
        tooltip.style.transform = 'translateY(0)';
    }, 10);
}

// Hide tooltip
function hideTooltip() {
    const tooltip = document.querySelector('.legend-tooltip');
    if (tooltip) {
        tooltip.remove();
    }
} 