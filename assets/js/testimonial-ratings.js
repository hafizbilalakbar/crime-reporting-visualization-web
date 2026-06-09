document.addEventListener('DOMContentLoaded', function() {
    // Add star ratings to testimonials
    function addStarRatings() {
        // Only select testimonial slides from the testimonials section
        const testimonialSlides = document.querySelectorAll('.testimonials-section .testimonial-slide');
        
        if (testimonialSlides.length) {
            testimonialSlides.forEach((slide, index) => {
                const quoteIcon = slide.querySelector('.quote-icon');
                // Check if rating already exists
                const existingRating = slide.querySelector('.testimonial-rating');
                
                // Only add ratings if they don't already exist
                if (quoteIcon && !existingRating) {
                    // Create rating div
                    const ratingDiv = document.createElement('div');
                    ratingDiv.className = 'testimonial-rating';
                    
                    // Add stars based on index (just for variety)
                    let starsHTML = '';
                    
                    if (index === 0) {
                        // 5 stars for first testimonial
                        starsHTML = `
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        `;
                    } else if (index === 1) {
                        // 4.5 stars for second testimonial
                        starsHTML = `
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star-half-alt"></i>
                        `;
                    } else {
                        // 5 stars for third testimonial
                        starsHTML = `
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        `;
                    }
                    
                    ratingDiv.innerHTML = starsHTML;
                    
                    // Insert after quote icon
                    quoteIcon.insertAdjacentElement('afterend', ratingDiv);
                    
                    // Add styles
                    const style = document.createElement('style');
                    style.textContent = `
                        .testimonial-rating {
                            margin-bottom: var(--space-md);
                            color: #FFD700; /* Gold color for stars */
                            font-size: var(--font-size-md);
                            display: flex;
                            gap: var(--space-xs);
                        }
                        
                        .testimonial-rating i {
                            transition: all 0.3s ease;
                        }
                        
                        .testimonial-content:hover .testimonial-rating i {
                            transform: scale(1.1);
                        }
                    `;
                    document.head.appendChild(style);
                }
            });
        }
    }
    
    // Initialize star ratings
    addStarRatings();
}); 