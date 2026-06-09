/**
 * Component Loader - Load header and footer components across pages
 * This script fetches and injects the header and footer components
 * and ensures all their functionality works properly
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get absolute base URL to components
    const baseUrl = getBaseUrl();
    
    console.log("Base URL determined as:", baseUrl);
    
    // Apply theme classes immediately (before components load) to avoid flash of unstyled content
    applyThemeClasses();
    
    // Create placeholder elements if they don't exist
    if (!document.getElementById('header-placeholder')) {
        const headerPlaceholder = document.createElement('div');
        headerPlaceholder.id = 'header-placeholder';
        document.body.prepend(headerPlaceholder);
    }

    if (!document.getElementById('footer-placeholder')) {
        const footerPlaceholder = document.createElement('div');
        footerPlaceholder.id = 'footer-placeholder';
        document.body.appendChild(footerPlaceholder);
    }
    
    // Load the header component
    fetch(`${baseUrl}components/header.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById('header-placeholder').innerHTML = html;
            
            // Fix all relative URLs and dynamic links in the header
            fixRelativeUrls('header-placeholder', baseUrl);
            fixDynamicLinks(baseUrl);
            
            // Set active state for current page link
            setActiveNavLink();
            
            // Initialize the theme toggle functionality
            if (typeof initThemeToggle === 'function') {
                // Wait a brief moment to ensure the DOM is fully updated
                setTimeout(initThemeToggle, 100);
            } else {
                console.warn('Theme toggle function not found. Loading theme-toggle.js dynamically.');
                // Try to load theme-toggle.js dynamically if it's not already loaded
                const themeToggleScript = document.createElement('script');
                themeToggleScript.src = `${baseUrl}assets/js/theme-toggle.js`;
                themeToggleScript.onload = function() {
                    if (typeof initThemeToggle === 'function') {
                        setTimeout(initThemeToggle, 100);
                    }
                };
                document.head.appendChild(themeToggleScript);
            }
            
            // Initialize mobile menu
            initMobileMenu();
        })
        .catch(error => {
            console.error('Error loading header component:', error);
            document.getElementById('header-placeholder').innerHTML = `
                <header class="header" id="main-header">
                    <div class="container">
                        <div class="logo">
                            <svg class="logo-svg" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <h1>Crime Reporting</h1>
                        </div>
                        <nav class="nav-menu">
                            <ul>
                                <li><a href="${baseUrl}index.html" class="nav-link">Home</a></li>
                                <li><a href="${baseUrl}citizen-portal.html" class="nav-link">Report Crime</a></li>
                                <li><a href="${baseUrl}map-visualization.html" class="nav-link">Crime Map</a></li>
                                <li><a href="${baseUrl}about.html" class="nav-link">About</a></li>
                                <li><a href="${baseUrl}contact.html" class="nav-link">Contact</a></li>
                                <li><a href="${baseUrl}admin-login.html" class="admin-link">Admin</a></li>
                            </ul>
                        </nav>
                        <div class="theme-toggle">
                            <button id="theme-toggle-btn" aria-label="Toggle dark mode">
                                <i class="fas fa-sun sun-icon"></i>
                                <i class="fas fa-moon moon-icon"></i>
                            </button>
                        </div>
                    </div>
                </header>
            `;
            
            // Initialize functionality even with fallback header
            setActiveNavLink();
            initMobileMenu();
            if (typeof initThemeToggle === 'function') {
                setTimeout(initThemeToggle, 100);
            }
        });

    // Load the footer component
    fetch(`${baseUrl}components/footer.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById('footer-placeholder').innerHTML = html;
            
            // Fix all relative URLs in the footer to be absolute
            fixRelativeUrls('footer-placeholder', baseUrl);
            
            // Fix dynamic links to work with the current directory structure
            fixDynamicLinks(baseUrl);
            
            // Initialize newsletter form if it exists
            const newsletterForm = document.querySelector('.newsletter-form');
            if (newsletterForm) {
                initNewsletterForm();
            }
        })
        .catch(error => {
            console.error('Error loading footer component:', error);
            document.getElementById('footer-placeholder').innerHTML = `
                <footer class="footer">
                    <div class="container">
                        <div class="footer-content">
                            <div class="footer-logo">
                                <svg class="footer-svg-logo" width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M2 17L12 22L22 17" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M2 12L12 17L22 12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <h2>Crime Reporting</h2>
                            </div>
                            <div class="footer-links">
                                <div class="link-group">
                                    <h3>Main Menu</h3>
                                    <ul>
                                        <li><a href="${baseUrl}index.html">Home</a></li>
                                        <li><a href="${baseUrl}citizen-portal.html">Report Crime</a></li>
                                        <li><a href="${baseUrl}map-visualization.html">Crime Map</a></li>
                                        <li><a href="${baseUrl}about.html">About Us</a></li>
                                        <li><a href="${baseUrl}contact.html">Contact</a></li>
                                    </ul>
                                </div>
                                <div class="link-group">
                                    <h3>Legal</h3>
                                    <ul>
                                        <li><a href="${baseUrl}pages/terms.html">Terms of Use</a></li>
                                        <li><a href="${baseUrl}pages/privacy-policy.html">Privacy Policy</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <hr class="footer-divider">
                        <div class="footer-bottom">
                            <p>&copy; 2023 Crime Reporting. All Rights Reserved.</p>
                        </div>
                    </div>
                </footer>
            `;
        });
});

// Apply theme classes immediately to avoid flash of wrong theme
function applyThemeClasses() {
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme') || 
                        (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply theme class to document immediately
    document.documentElement.classList.remove('dark-theme', 'light-theme');
    document.documentElement.classList.add(savedTheme + '-theme');
    
    document.body.classList.remove('dark-theme', 'light-theme');
    document.body.classList.add(savedTheme + '-theme');
    
    // Preload the correct theme CSS file
    let themeStylesheet = document.getElementById('theme-style');
    if (!themeStylesheet) {
        themeStylesheet = document.createElement('link');
        themeStylesheet.rel = 'stylesheet';
        themeStylesheet.id = 'theme-style';
        document.head.appendChild(themeStylesheet);
    }
    
    // Set correct theme path based on current location
    let themePath = '';
    const currentPath = window.location.pathname;
    
    // Handle different path depths
    if (currentPath.includes('/pages/')) {
        if (currentPath.split('/').filter(Boolean).length > 2) {
            // Nested subdirectory (like /pages/something/page.html)
            themePath = '../../assets/css/themes/';
        } else {
            // First level subdirectory (like /pages/page.html)
            themePath = '../assets/css/themes/';
        }
    } else {
        // Root directory
        themePath = 'assets/css/themes/';
    }
    
    themeStylesheet.href = `${themePath}${savedTheme}.css`;
}

// Function to fix all relative URLs to absolute URLs
function fixRelativeUrls(containerId, baseUrl) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Fix all links
    const links = container.querySelectorAll('a[href]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:')) {
            link.setAttribute('href', `${baseUrl}${href}`);
        }
    });
    
    // Fix all images
    const images = container.querySelectorAll('img[src]');
    images.forEach(img => {
        const src = img.getAttribute('src');
        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
            img.setAttribute('src', `${baseUrl}${src}`);
        }
    });
}

// Helper function to get the base URL for components
function getBaseUrl() {
    const currentPath = window.location.pathname;
    
    // Debug log
    console.log("Current path:", currentPath);
    
    // Handle root path
    if (currentPath === '/' || currentPath.endsWith('/index.html')) {
        return './';
    }
    
    // Handle Windows paths with backslashes
    const normalizedPath = currentPath.replace(/\\/g, '/');
    
    // Special case for pages directory
    if (normalizedPath.includes('/pages/')) {
        // Check if it's a nested directory
        if (normalizedPath.split('/').filter(Boolean).length > 2) {
            console.log("Detected nested pages directory, returning ../../");
            return '../../';
        } else {
            console.log("Detected pages directory, returning ../");
            return '../';
        }
    }
    
    // Count directories in path
    const pathParts = normalizedPath.split('/').filter(part => part.length > 0);
    console.log("Path parts:", pathParts);
    
    // If we're at the root level or in a single directory
    if (pathParts.length <= 1) {
        return './';
    }
    
    // Otherwise build a relative path to the root
    // Remove the file name if present
    const directoriesDeep = pathParts[pathParts.length - 1].includes('.') 
        ? pathParts.length - 1 
        : pathParts.length;
    
    return '../'.repeat(directoriesDeep);
}

// Set active state for current page link
function setActiveNavLink() {
    // Get the current page path
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';
    
    // Get all navigation links ONLY in the header, using the header-specific classes
    const navLinks = document.querySelectorAll('#main-header .nav-menu .header-nav-link');
    
    // Log for debugging
    console.log("Current page:", currentPage);
    console.log("Found header nav links:", navLinks.length);
    
    // Remove active class from all header links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Find and set the active link only for header navigation
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Log for debugging
        console.log("Checking link:", linkHref);
        
        // Check various conditions for the active link
        if (linkHref && (
            linkHref.endsWith(`/${currentPage}`) || 
            linkHref.endsWith(currentPage) ||
            (currentPage === 'index.html' && (linkHref === './' || linkHref === '/' || linkHref.endsWith('/index.html'))) ||
            (currentPage === '' && (linkHref === './' || linkHref === '/' || linkHref.endsWith('/index.html')))
        )) {
            console.log("Activating link:", linkHref);
            link.classList.add('active');
        }
    });
}

// Initialize mobile menu functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('#main-header .mobile-menu-btn');
    const navMenu = document.querySelector('#main-header .nav-menu');
    const body = document.body;
    
    if (!mobileMenuBtn || !navMenu) return;
    
    // Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Toggle body scroll lock
        if (navMenu.classList.contains('active')) {
            body.classList.add('menu-open');
        } else {
            body.classList.remove('menu-open');
        }
    });
    
    // Sticky Header on Scroll
    const header = document.getElementById('main-header');
    if (!header) return;
    
    const scrollThreshold = 50;
    
    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Initial check in case page is loaded scrolled down
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnButton = mobileMenuBtn.contains(event.target);
        
        if (navMenu.classList.contains('active') && !isClickInsideMenu && !isClickOnButton) {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
    
    // Close mobile menu when clicking on header-specific links
    const headerNavLinks = document.querySelectorAll('#main-header .nav-menu .header-nav-link');
    headerNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navMenu.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                body.classList.remove('menu-open');
            }
        });
    });
    
    // Close mobile menu when resizing to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            body.classList.remove('menu-open');
        }
    });
}

// Newsletter form functionality
function initNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    const newsletterInput = document.querySelector('.newsletter-input');
    const newsletterBtn = document.querySelector('.newsletter-btn');
    
    if (!newsletterForm || !newsletterInput || !newsletterBtn) return;
    
    newsletterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        if (newsletterInput.value.trim() === '') {
            alert('Please enter your email address');
            return;
        }
        
        // Basic email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(newsletterInput.value)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Simulate form submission (replace with actual API call in production)
        alert('Thank you for subscribing to our newsletter!');
        newsletterInput.value = '';
    });
}

// Function to fix dynamic links based on current path
function fixDynamicLinks(baseUrl) {
    // Get all links with the dynamic-link class
    const dynamicLinks = document.querySelectorAll('.dynamic-link');
    
    if (!dynamicLinks.length) return;
    
    dynamicLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
            // Fix the path based on our base URL
            link.setAttribute('href', `${baseUrl}${href}`);
        }
    });
}

