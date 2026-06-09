// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    initThemeToggle();
});

// Make this function available globally so component-loader.js can call it
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (!themeToggleBtn) {
        console.log('Theme toggle button not found');
        return; // Exit if button doesn't exist
    }

    const themeStylesheet = document.getElementById('theme-style');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (!themeStylesheet || !sunIcon || !moonIcon) {
        console.log('Theme elements not found:', { 
            themeStylesheet: !!themeStylesheet, 
            sunIcon: !!sunIcon, 
            moonIcon: !!moonIcon 
        });
        return; // Exit if elements don't exist
    }
    
    // Check for saved theme preference or use device preference
    const savedTheme = localStorage.getItem('theme') || 
                       (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    // Apply the saved/detected theme
    setTheme(savedTheme);
    
    // Fix icons after a short delay to ensure all resources are loaded
    setTimeout(fixIconPositioning, 100);
    
    // Toggle theme when button is clicked
    themeToggleBtn.addEventListener('click', function() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        // Add animation class
        themeToggleBtn.classList.add('animating');
        
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            themeToggleBtn.classList.remove('animating');
        }, 500);
        
        // Force icon positioning fix after theme toggle
        setTimeout(fixIconPositioning, 100);
    });
    
    // Function to set the theme
    function setTheme(theme) {
        console.log('Setting theme to:', theme);
        
        // Update stylesheet reference with proper path handling
        try {
            let themePath = '';
            const currentPath = window.location.pathname;
            
            // Handle different path depths
            if (currentPath.includes('/pages/')) {
                // In subdirectory
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
            
            themeStylesheet.href = `${themePath}${theme}.css`;
            console.log('Theme stylesheet set to:', themeStylesheet.href);
        } catch (error) {
            console.error('Error updating theme stylesheet:', error);
        }
        
        // Update HTML and body classes
        document.documentElement.classList.remove('dark-theme', 'light-theme');
        document.documentElement.classList.add(theme + '-theme');
        
        document.body.classList.remove('dark-theme', 'light-theme');
        document.body.classList.add(theme + '-theme');
        
        // Update button appearance - using visibility instead of opacity for better compatibility
        if (theme === 'dark') {
            // In dark mode, we show the sun icon (to switch to light mode)
            sunIcon.style.opacity = '1';
            sunIcon.style.visibility = 'visible';
            moonIcon.style.opacity = '0';
            moonIcon.style.visibility = 'hidden';
            
            // Use the same transform regardless of device size
            sunIcon.style.transform = 'translate(-50%, -50%) rotate(0) scale(1)';
            moonIcon.style.transform = 'translate(-50%, -50%) rotate(-90deg) scale(0.5)';
        } else {
            // In light mode, we show the moon icon (to switch to dark mode)
            moonIcon.style.opacity = '1';
            moonIcon.style.visibility = 'visible';
            sunIcon.style.opacity = '0';
            sunIcon.style.visibility = 'hidden';
            
            // Use the same transform regardless of device size
            moonIcon.style.transform = 'translate(-50%, -50%) rotate(0) scale(1)';
            sunIcon.style.transform = 'translate(-50%, -50%) rotate(90deg) scale(0.5)';
        }
        
        // Apply consistent positioning
        sunIcon.style.position = 'absolute';
        sunIcon.style.top = '50%';
        sunIcon.style.left = '50%';
        sunIcon.style.margin = '0';
        sunIcon.style.padding = '0';
        sunIcon.style.display = 'block';
        sunIcon.style.lineHeight = '1';
        
        moonIcon.style.position = 'absolute';
        moonIcon.style.top = '50%';
        moonIcon.style.left = '50%';
        moonIcon.style.margin = '0';
        moonIcon.style.padding = '0';
        moonIcon.style.display = 'block';
        moonIcon.style.lineHeight = '1';
        
        // Apply theme class to any iframes present
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                if (iframe.contentDocument) {
                    iframe.contentDocument.documentElement.classList.remove('dark-theme', 'light-theme');
                    iframe.contentDocument.documentElement.classList.add(theme + '-theme');
                    
                    iframe.contentDocument.body.classList.remove('dark-theme', 'light-theme');
                    iframe.contentDocument.body.classList.add(theme + '-theme');
                }
            } catch (e) {
                console.log('Could not apply theme to iframe due to security restrictions');
            }
        });
        
        // Update map theme if map visualization is present
        if (typeof updateMapTheme === 'function') {
            updateMapTheme();
        }
        
        // Dispatch custom event that theme has changed
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }
    
    // Fix icon positioning function
    function fixIconPositioning() {
        // Force reflow to ensure proper positioning
        sunIcon.style.display = 'none';
        void sunIcon.offsetHeight; // Trigger reflow
        sunIcon.style.display = 'block';
        
        moonIcon.style.display = 'none';
        void moonIcon.offsetHeight; // Trigger reflow
        moonIcon.style.display = 'block';
        
        // Ensure icons are correctly visible based on current theme
        const currentTheme = localStorage.getItem('theme') || 'light';
        
        if (currentTheme === 'dark') {
            sunIcon.style.opacity = '1';
            sunIcon.style.visibility = 'visible';
            moonIcon.style.opacity = '0';
            moonIcon.style.visibility = 'hidden';
        } else {
            moonIcon.style.opacity = '1';
            moonIcon.style.visibility = 'visible';
            sunIcon.style.opacity = '0';
            sunIcon.style.visibility = 'hidden';
        }
    }
    
    // Adjust icons if window resizes
    window.addEventListener('resize', function() {
        const currentTheme = localStorage.getItem('theme') || 'light';
        setTheme(currentTheme);
        // Re-apply positioning fix after resize
        setTimeout(fixIconPositioning, 100);
    });
    
    // Fix icons when fonts are loaded (a common cause of layout shifts)
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(fixIconPositioning);
    }
    
    // Listen for system preference changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
            if (!localStorage.getItem('theme')) {
                // Only auto-switch if user hasn't manually set a preference
                const newTheme = e.matches ? 'dark' : 'light';
                setTheme(newTheme);
                // Re-apply positioning fix after theme change
                setTimeout(fixIconPositioning, 100);
            }
        });
    }
    
    // Fix icon positioning after any potential DOMContentLoaded events
    window.addEventListener('load', fixIconPositioning);
    
    // Fix icon positioning on orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(fixIconPositioning, 200);
    });
} 