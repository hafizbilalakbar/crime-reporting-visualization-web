// Admin Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Login form handling
    const loginForm = document.getElementById('admin-login-form');
    const loginError = document.getElementById('login-error');
    const passwordToggle = document.querySelector('.toggle-password');
    const passwordInput = document.getElementById('password');
    
    // Toggle password visibility
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            passwordToggle.parentNode.classList.toggle('password-visible');
        });
    }
    
    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            
            // Hide any previous error
            if (loginError) {
                loginError.classList.remove('show');
            }
            
            // Simple validation
            if (!username || !password) {
                showLoginError('Please enter both username and password.');
                return;
            }
            
            // Authenticate user (this would normally be an API call)
            authenticateUser(username, password)
                .then(success => {
                    if (success) {
                        // Redirect to admin dashboard
                        window.location.href = 'admin-dashboard.html';
                    } else {
                        showLoginError('Invalid username or password. Please try again.');
                    }
                })
                .catch(error => {
                    showLoginError('An error occurred during login. Please try again later.');
                    console.error('Login error:', error);
                });
        });
    }
    
    // Show login error message
    function showLoginError(message) {
        if (loginError) {
            loginError.querySelector('span').textContent = message;
            loginError.classList.add('show');
        }
    }
    
    // Mock authentication function (in a real app, this would be an API call)
    function authenticateUser(username, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Mock credentials (in a real app, this would be validated by a server)
                const validCredentials = [
                    { username: 'admin', password: 'admin123' },
                    { username: 'police', password: 'police123' }
                ];
                
                const isValid = validCredentials.some(
                    cred => cred.username === username && cred.password === password
                );
                
                if (isValid) {
                    // In a real app, save auth token to sessionStorage or localStorage
                    sessionStorage.setItem('loggedIn', 'true');
                    sessionStorage.setItem('username', username);
                    
                    // Generate a fake token (for demo purposes only)
                    const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' + 
                                     btoa(JSON.stringify({ user: username, role: 'admin' })) + 
                                     '.fake-signature';
                    sessionStorage.setItem('token', fakeToken);
                }
                
                resolve(isValid);
            }, 1000); // Simulate network delay
        });
    }
    
    // Check if user is already logged in (for dashboard pages)
    function checkAuthentication() {
        const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
        const currentPage = window.location.pathname.split('/').pop();
        
        // If trying to access admin pages without login
        if (currentPage === 'admin-dashboard.html' && !isLoggedIn) {
            window.location.href = 'admin-login.html';
        }
        
        // If already logged in and trying to access login page
        if (currentPage === 'admin-login.html' && isLoggedIn) {
            window.location.href = 'admin-dashboard.html';
        }
    }
    
    // Call auth check on page load
    checkAuthentication();
}); 