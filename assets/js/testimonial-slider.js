// Testimonial Slider Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Swiper for testimonials if exists
    const testimonialSlider = document.querySelector('.testimonial-swiper');
    
    if (testimonialSlider) {
        const swiper = new Swiper('.testimonial-swiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                768: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                }
            },
            on: {
                init: function() {
                    addAnimation(this.slides[this.activeIndex]);
                },
                slideChangeTransitionStart: function() {
                    removeAnimation(document.querySelectorAll('.testimonial-card'));
                },
                slideChangeTransitionEnd: function() {
                    addAnimation(this.slides[this.activeIndex]);
                }
            }
        });
        
        // Add animation to active testimonial
        function addAnimation(slide) {
            if (!slide) return;
            
            const card = slide.querySelector('.testimonial-card');
            if (card) {
                card.classList.add('animate__animated', 'animate__fadeIn');
                
                // Add sequential animation to testimonial elements
                setTimeout(() => {
                    const quote = card.querySelector('.testimonial-quote');
                    if (quote) quote.classList.add('animate__animated', 'animate__fadeInDown');
                }, 100);
                
                setTimeout(() => {
                    const text = card.querySelector('.testimonial-text');
                    if (text) text.classList.add('animate__animated', 'animate__fadeIn');
                }, 300);
                
                setTimeout(() => {
                    const author = card.querySelector('.testimonial-author');
                    if (author) author.classList.add('animate__animated', 'animate__fadeInUp');
                }, 500);
            }
        }
        
        // Remove animation classes
        function removeAnimation(cards) {
            cards.forEach(card => {
                card.classList.remove('animate__animated', 'animate__fadeIn');
                
                const elements = card.querySelectorAll('.testimonial-quote, .testimonial-text, .testimonial-author');
                elements.forEach(el => {
                    el.classList.remove('animate__animated', 'animate__fadeInDown', 'animate__fadeIn', 'animate__fadeInUp');
                });
            });
        }
    }
}); 