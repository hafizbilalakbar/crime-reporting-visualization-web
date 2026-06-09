// Main Application JavaScript for About Page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with responsive settings
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        disable: window.innerWidth < 768 ? true : false // Disable on small mobile devices for performance
    });
    
    // Initialize Case Studies Swiper with enhanced smooth transitions
    const caseStudiesSwiper = new Swiper('.case-studies-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        centeredSlides: true,
        grabCursor: true,
        speed: 800, // Smoother transition speed
        effect: 'coverflow',
        coverflowEffect: {
            rotate: 5,
            stretch: 0,
            depth: 100,
            modifier: 1.2,
            slideShadows: false,
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '"></span>';
            }
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true
        },
        mousewheel: {
            invert: false,
            sensitivity: 1,
            thresholdDelta: 50
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
                effect: 'slide',
            },
            768: {
                slidesPerView: 1.2,
                spaceBetween: 30
            },
            1024: {
                slidesPerView: 2,
                spaceBetween: 40
            },
            1400: {
                slidesPerView: 2.5,
                spaceBetween: 50
            }
        },
        on: {
            init: function() {
                setTimeout(() => {
                    this.update(); // Update swiper after initialization for better rendering
                }, 100);
            },
            slideChangeTransitionStart: function() {
                const activeSlide = this.slides[this.activeIndex];
                if(activeSlide) {
                    activeSlide.style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        activeSlide.style.transform = '';
                    }, 300);
                }
                
                // Add animated entrance for slide content
                const activeContent = activeSlide?.querySelector('.case-study-content');
                if(activeContent) {
                    activeContent.style.opacity = '0';
                    activeContent.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        activeContent.style.opacity = '1';
                        activeContent.style.transform = 'translateY(0)';
                        activeContent.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    }, 400);
                }
            },
            touchStart: function() {
                document.querySelector('.case-studies-swiper').style.cursor = 'grabbing';
            },
            touchEnd: function() {
                document.querySelector('.case-studies-swiper').style.cursor = 'grab';
            }
        }
    });
    
    // Initialize Odometer for stat numbers
    function initOdometers() {
        const odometerElements = document.querySelectorAll('.odometer');
        
        odometerElements.forEach(element => {
            const targetValue = element.getAttribute('data-count') || 0;
            
            // Create a new Odometer object
            const od = new Odometer({
                el: element,
                value: 0,
                format: '(,ddd)', // Format with commas for thousands
                duration: 2000, // Animation duration in ms
                theme: 'default'
            });
            
            // Set the value after a slight delay
            setTimeout(() => {
                od.update(targetValue);
            }, 500);
        });
    }
    
    // Initialize gauge animation
    function initGauge() {
        const gaugeElement = document.querySelector('.gauge-value');
        const gaugeCenterElement = document.querySelector('.gauge-center');
        const percentage = 75; // 75% value
        
        if (gaugeElement) {
            // Animation for gauge path
            setTimeout(() => {
                // Calculate angle based on percentage (75% would be 75% of 180 degrees which is 135 degrees)
                const angle = (percentage / 100) * 180;
                const x = 60 - 50 * Math.cos(angle * (Math.PI / 180));
                const y = 60 - 50 * Math.sin(angle * (Math.PI / 180));
                
                // Update the SVG path
                gaugeElement.setAttribute('d', `M 10 60 A 50 50 0 0 1 ${x} ${y}`);
                gaugeElement.style.strokeDashoffset = '0';
                
                // Update center text
                if (gaugeCenterElement) {
                    gaugeCenterElement.innerText = `${percentage}%`;
                }
            }, 500);
        }
    }
    
    // Define charts animation
    function initCharts() {
        const chartFills = document.querySelectorAll('.chart-fill');
        
        chartFills.forEach(fill => {
            const height = fill.style.height;
            fill.style.height = '0%';
            
            setTimeout(() => {
                fill.style.height = height;
            }, 500);
        });
    }
    
    // Map animation
    function initMap() {
        const mapLine = document.querySelector('.map-line');
        
        if (mapLine) {
            mapLine.style.strokeDashoffset = '0';
        }
    }
    
    // Intersection Observer for animations
    function setupIntersectionObserver() {
        const options = {
            threshold: 0.2
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('impact-showcase')) {
                        initOdometers();
                        initGauge();
                        initCharts();
                        initMap();
                        observer.unobserve(entry.target);
                    } else if (entry.target.classList.contains('story-timeline')) {
                        entry.target.classList.add('animate');
                        observer.unobserve(entry.target);
                    }
                }
            });
        }, options);
        
        const impactShowcase = document.querySelector('.impact-showcase');
        const storyTimeline = document.querySelector('.story-timeline');
        
        if (impactShowcase) observer.observe(impactShowcase);
        if (storyTimeline) observer.observe(storyTimeline);
    }
    
    // Set up timeline interaction
    function setupTimeline() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                timelineItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            });
        });
    }
    
    // Set up particle animation for impact section
    function setupParticles() {
        const impactParticles = document.querySelector('.impact-particles');
        
        if (impactParticles) {
            for (let i = 0; i < 50; i++) {
                const particle = document.createElement('div');
                particle.classList.add('particle');
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 5}s`;
                particle.style.animationDuration = `${5 + Math.random() * 10}s`;
                particle.style.opacity = `${0.1 + Math.random() * 0.2}`;
                impactParticles.appendChild(particle);
            }
        }
    }
    
    // Add 3D tilt effect to case study cards for more immersive experience
    function initCardTilt() {
        const caseStudyCards = document.querySelectorAll('.case-study-card');
        
        caseStudyCards.forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left; // x position within the element
                const y = e.clientY - rect.top;  // y position within the element
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const deltaX = (x - centerX) / centerX * 5; // Max rotation ±5 degrees
                const deltaY = (y - centerY) / centerY * 5;
                
                this.style.transform = `perspective(1000px) rotateY(${-deltaX}deg) rotateX(${deltaY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.transition = 'transform 0.5s ease';
            });
        });
    }
    
    // Run tilt effect after Swiper is initialized
    caseStudiesSwiper.on('imagesReady', function() {
        initCardTilt();
    });
    
    // Initialize all features
    setupIntersectionObserver();
    setupTimeline();
    setupParticles();
    
    // Handle viewport changes
    window.addEventListener('resize', function() {
        // Update swiper on resize
        if (typeof caseStudiesSwiper !== 'undefined') {
            caseStudiesSwiper.update();
        }
        
        // Refresh AOS animations
        AOS.refresh();
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}); 