// Story Section Slideshow Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Slideshow functionality for the story image
    const slides = document.querySelectorAll('.image-slideshow .slide');
    const indicators = document.querySelectorAll('.slideshow-indicator');
    let currentSlide = 0;
    
    // Preload all images to ensure they're available
    function preloadImages() {
        slides.forEach(slide => {
            const img = slide.querySelector('img');
            if (img) {
                const src = img.getAttribute('src');
                if (src) {
                    const newImg = new Image();
                    newImg.src = src;
                }
            }
        });
    }
    
    function showSlide(n) {
        // Remove active class from all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
            slide.style.opacity = '0';
            slide.style.zIndex = '1';
        });
        
        // Remove active class from all indicators
        indicators.forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Set the new current slide index
        currentSlide = (n + slides.length) % slides.length;
        
        // Add active class to current slide and indicator
        if (slides[currentSlide]) {
            slides[currentSlide].classList.add('active');
            slides[currentSlide].style.zIndex = '2';
            
            // Use setTimeout to ensure the transition happens after the z-index change
            setTimeout(() => {
                slides[currentSlide].style.opacity = '1';
            }, 50);
        }
        
        if (indicators[currentSlide]) {
            indicators[currentSlide].classList.add('active');
        }
    }
    
    // Preload images before starting the slideshow
    preloadImages();
    
    // Initialize with first slide active
    showSlide(0);
    
    // Set up indicator click events
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent slideshow container click
            showSlide(index);
            
            // Reset the timer
            clearInterval(slideTimer);
            slideTimer = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 4000);
        });
    });
    
    // Automatically advance slides every 4 seconds with smoother transitions
    let slideTimer = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 4000);
    
    // Pause slideshow when page is not visible to save resources
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            clearInterval(slideTimer);
        } else {
            // Resume slideshow when page becomes visible again
            slideTimer = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 4000);
        }
    });
    
    // Handle slideshow container interaction
    const slideshowContainer = document.querySelector('.image-slideshow');
    if (slideshowContainer) {
        // Pause slideshow on hover for better user experience
        slideshowContainer.addEventListener('mouseenter', () => {
            clearInterval(slideTimer);
        });
        
        slideshowContainer.addEventListener('mouseleave', () => {
            slideTimer = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 4000);
        });
        
        // Allow clicking on slideshow to advance to next slide
        slideshowContainer.addEventListener('click', () => {
            showSlide(currentSlide + 1);
            // Reset the timer to prevent immediate transition
            clearInterval(slideTimer);
            slideTimer = setInterval(() => {
                showSlide(currentSlide + 1);
            }, 4000);
        });
    }
    
    // Add debugging for image load status
    slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        if (img) {
            img.addEventListener('load', () => {
                console.log(`Image ${index + 1} loaded successfully`);
            });
            
            img.addEventListener('error', () => {
                console.error(`Error loading image ${index + 1}:`, img.src);
            });
        }
    });
}); 