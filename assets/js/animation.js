// Animation script for CrimeWatch website
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations if library is loaded
    initAOS();
    
    // Initialize counter animation on statistics
    initCounterAnimation();
    
    // Initialize testimonial slider
    initTestimonialSlider();
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

// Counter animation for statistics
function initCounterAnimation() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    if (!statNumbers.length) return;
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
    
    // Function to animate counter
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000; // Animation duration in milliseconds
        const stepTime = 50; // Update interval in milliseconds
        const initialValue = 0;
        const increment = Math.ceil(target / (duration / stepTime));
        
        let currentValue = initialValue;
        const counter = setInterval(() => {
            currentValue += increment;
            if (currentValue >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(counter);
            } else {
                element.textContent = currentValue.toLocaleString();
            }
        }, stepTime);
    }
    
    // Check if stats are in viewport and start animation
    function checkStatsVisibility() {
        statNumbers.forEach(statNumber => {
            if (isInViewport(statNumber) && !statNumber.classList.contains('animated')) {
                statNumber.classList.add('animated');
                animateCounter(statNumber);
            }
        });
    }
    
    // Run on scroll and initial check
    window.addEventListener('scroll', checkStatsVisibility);
    checkStatsVisibility();
}

// Handle testimonial slider
function initTestimonialSlider() {
    const sliderDots = document.querySelectorAll('.slider-dot');
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    
    if (sliderDots.length && testimonialSlides.length) {
        // Define advance slide function
        let currentSlide = 0;
        let autoSlideInterval = null;
        
        function advanceSlide() {
            currentSlide = (currentSlide + 1) % testimonialSlides.length;
            updateSlider();
        }
        
        function updateSlider() {
            // Remove active class from all dots and slides
            sliderDots.forEach(d => d.classList.remove('active'));
            testimonialSlides.forEach(slide => slide.classList.remove('active'));
            
            // Add active class to current dot and slide
            sliderDots[currentSlide].classList.add('active');
            testimonialSlides[currentSlide].classList.add('active');
        }
        
        function startAutoSlide() {
            stopAutoSlide(); // Clear any existing interval
            autoSlideInterval = setInterval(advanceSlide, 5000);
        }
        
        function stopAutoSlide() {
            if (autoSlideInterval) {
                clearInterval(autoSlideInterval);
                autoSlideInterval = null;
            }
        }
        
        // Add click events to dots
        sliderDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
                startAutoSlide(); // Reset interval
            });
        });
        
        // Pause auto advance on hover
        const sliderContainer = document.querySelector('.testimonials-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopAutoSlide);
            sliderContainer.addEventListener('mouseleave', startAutoSlide);
        }
        
        // Start auto slide
        startAutoSlide();
    }
}

// Header scroll animation
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check on initial load
});

// Animation scripts for the website

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animation library
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }

    // Initialize statistics counter
    function initializeCounters() {
        const counterElements = document.querySelectorAll('.stat-number[data-count]');
        
        counterElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'), 10);
            const duration = 2000; // 2 seconds
            let startTimestamp = null;
            const startValue = 0;
            
            function step(timestamp) {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const currentValue = Math.floor(progress * (target - startValue) + startValue);
                
                counter.textContent = currentValue.toLocaleString();
                
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            }
            
            window.requestAnimationFrame(step);
        });
    }
    
    // Animate progress bars when they come into view
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-bar');
        
        progressBars.forEach(bar => {
            // Get the width from the inline style
            const width = bar.style.width;
            // Initially set width to 0
            bar.style.width = '0%';
            
            // Create an intersection observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // When the bar is in view, animate to the target width
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 300);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(bar);
        });
    }
    
    // FAQ functionality is now handled by faq.js file
    
    // Handle Process Section connector animations
    function initConnectorAnimations() {
        const connectors = document.querySelectorAll('.connector i');
        
        connectors.forEach(connector => {
            // Ensure the bouncing animation works properly
            connector.addEventListener('mouseenter', () => {
                connector.style.animation = 'none';
            });
            
            connector.addEventListener('mouseleave', () => {
                connector.style.animation = 'bounce 2s infinite';
            });
        });
    }
    
    // Handle animated notification popups
    function initNotificationAnimations() {
        const popups = document.querySelectorAll('.notification-popup');
        
        popups.forEach((popup, index) => {
            // Add animation with staggered delay
            setTimeout(() => {
                popup.classList.add('animate__animated', 'animate__fadeInUp');
            }, index * 1000); // Stagger by 1 second
        });
    }
    
    // Initialize observers
    function initObservers() {
        // Stats section observer
        const statsSection = document.querySelector('.statistics-section');
        if (statsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        initializeCounters();
                        animateProgressBars();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(statsSection);
        }
        
        // Process steps observer for staggered animations
        const processSteps = document.querySelectorAll('.process-step');
        if (processSteps.length) {
            const stepObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animated');
                        }, index * 200);
                        stepObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            processSteps.forEach(step => {
                stepObserver.observe(step);
            });
        }
        
        // Mobile app section observer
        const mobileAppSection = document.querySelector('.mobile-app-section');
        if (mobileAppSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        initNotificationAnimations();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });
            
            observer.observe(mobileAppSection);
        }
    }
    
    // Add animation styles dynamically
    function addAnimationStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            .process-step {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s ease, transform 0.5s ease;
            }
            
            .process-step.animated {
                opacity: 1;
                transform: translateY(0);
            }
            
            .notification-popup {
                opacity: 0;
            }
            
            .notification-popup.animate__fadeInUp {
                opacity: 1;
            }
        `;
        document.head.appendChild(styleElement);
    }
    
    // Run initialization functions
    addAnimationStyles();
    initObservers();
    initConnectorAnimations();
    initTestimonialSlider();
    
    // Handle theme toggle
    const themeToggle = document.getElementById('theme-toggle-btn');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            
            // Save preference to localStorage
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                document.getElementById('theme-style').href = 'assets/css/themes/dark.css';
            } else {
                localStorage.setItem('theme', 'light');
                document.getElementById('theme-style').href = 'assets/css/themes/light.css';
            }
        });
        
        // Check saved preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            document.getElementById('theme-style').href = 'assets/css/themes/dark.css';
        }
    }
});

// Footer social icons animation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP animations only if GSAP is available
    if (typeof gsap !== 'undefined') {
        // Initialize ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        // Footer social icons entrance animation
        const socialIconsContainer = document.getElementById('animate-social-icons');
        if (socialIconsContainer) {
            const socialIcons = socialIconsContainer.querySelectorAll('.social-icon');
            
            gsap.from(socialIcons, {
                y: 20,
                opacity: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: socialIconsContainer,
                    start: "top bottom-=100px",
                    toggleActions: "play none none none"
                }
            });
            
            // Hover animations for social icons (applied on each element)
            socialIcons.forEach(icon => {
                icon.addEventListener('mouseenter', () => {
                    gsap.to(icon, {
                        y: -5,
                        scale: 1.1,
                        duration: 0.3,
                        ease: "power1.out"
                    });
                });
                
                icon.addEventListener('mouseleave', () => {
                    gsap.to(icon, {
                        y: 0,
                        scale: 1,
                        duration: 0.3,
                        ease: "power1.in"
                    });
                });
            });
        }
        
        // Back to top button animation
        const backToTopBtn = document.getElementById('back-to-top-btn');
        if (backToTopBtn) {
            // Pulse animation
            gsap.to(backToTopBtn, {
                scale: 1.1,
                repeat: -1,
                yoyo: true,
                duration: 1,
                ease: "sine.inOut"
            });
            
            // Add click animation
            backToTopBtn.addEventListener('click', () => {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: { y: 0, autoKill: true },
                    ease: "power2.inOut"
                });
            });
        }
        
        // Footer wave animation for added effect
        const footerWave = document.querySelector('.footer-wave');
        if (footerWave) {
            gsap.from(footerWave, {
                y: 50,
                opacity: 0,
                duration: 1.5,
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: ".footer",
                    start: "top bottom",
                    toggleActions: "play none none none"
                }
            });
        }
    }
}); 