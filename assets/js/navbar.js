// Advanced Header and Navigation Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Selectors
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const header = document.getElementById('main-header');
    const body = document.body;
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    // Mobile Menu Toggle with enhanced animation
    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle body scroll lock
            if (navMenu.classList.contains('active')) {
                body.classList.add('menu-open');
                body.style.overflow = 'hidden';
            } else {
                body.classList.remove('menu-open');
                body.style.overflow = '';
                
                // Reset animations when closing to ensure they play again on open
                setTimeout(() => {
                    const navItems = navMenu.querySelectorAll('li');
                    navItems.forEach(item => {
                        item.style.animation = 'none';
                        item.offsetHeight; // Trigger reflow
                        item.style.animation = '';
                    });
                }, 500);
            }
        });
        
        // Close menu when clicking the backdrop (mobile)
        navMenu.addEventListener('click', function(e) {
            // Check if the click was on the backdrop (navMenu but not its children)
            if (e.target === this) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
                body.style.overflow = '';
            }
        });
        
        // Close menu when clicking nav links (mobile)
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    mobileMenuBtn.classList.remove('active');
                    navMenu.classList.remove('active');
                    body.classList.remove('menu-open');
                    body.style.overflow = '';
                }
            });
        });
    }
    
    // Enhanced Sticky Header on Scroll with performance optimization
    const scrollThreshold = 30;
    let lastScrollY = 0;
    let ticking = false;
    
    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        ticking = false;
    }
    
    // Throttled scroll event
    window.addEventListener('scroll', function() {
        lastScrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
            });
            ticking = true;
        }
    });
    
    // Initial check in case page is loaded scrolled down
    handleScroll();
    
    // Close mobile menu when resizing to desktop
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        
        resizeTimeout = setTimeout(function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
                body.classList.remove('menu-open');
                body.style.overflow = '';
            }
        }, 150);
    });
    
    // Set active state for current page link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === 'index.html' && linkHref === './') ||
            (currentPage === '' && linkHref === './')) {
            link.classList.add('active');
        }
    });
    
    // Add subtle hover effect to nav links
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
            }
        });
    });
}); 