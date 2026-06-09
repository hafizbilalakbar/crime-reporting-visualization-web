// Dashboard Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    const sidebarNavLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // User dropdown toggle
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (userDropdown.classList.contains('show') && !userMenuBtn.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
    
    // Tab navigation
    if (sidebarNavLinks) {
        sidebarNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all nav items
                document.querySelectorAll('.nav-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to clicked nav item
                this.parentElement.classList.add('active');
                
                // Show corresponding tab content
                const tabId = this.getAttribute('data-tab');
                if (tabId) {
                    document.querySelectorAll('.tab-content').forEach(tab => {
                        tab.classList.remove('active');
                    });
                    
                    const activeTab = document.getElementById(`${tabId}-tab`);
                    if (activeTab) {
                        activeTab.classList.add('active');
                    }
                }
            });
        });
    }
    
    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Clear session storage
            sessionStorage.removeItem('loggedIn');
            sessionStorage.removeItem('username');
            sessionStorage.removeItem('token');
            
            // Redirect to login page
            window.location.href = 'admin-login.html';
        });
    }
    
    // Mobile sidebar toggle
    const sidebarToggleBtn = document.querySelector('.mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggleBtn && sidebar) {
        sidebarToggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('show');
            document.body.classList.toggle('sidebar-open');
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                sidebar.classList.contains('show') && 
                !sidebar.contains(e.target) && 
                !sidebarToggleBtn.contains(e.target)) {
                sidebar.classList.remove('show');
                document.body.classList.remove('sidebar-open');
            }
        });
    }
    
    // Date filter functionality
    const dateRangeSelect = document.getElementById('dateRangeSelect');
    if (dateRangeSelect) {
        dateRangeSelect.addEventListener('change', function() {
            // Update dashboard data based on selected date range
            updateDashboardData(this.value);
        });
    }
    
    // Function to update dashboard data based on date range
    function updateDashboardData(dateRange) {
        console.log(`Updating dashboard data for range: ${dateRange}`);
        // In a real application, this would make an API call to fetch data for the selected date range
        // For demo purposes, we'll just show different numbers based on the selected range
        
        const statNumbers = document.querySelectorAll('.stat-number');
        
        // Mock data for different date ranges
        const data = {
            today: [42, 12, 28, 2],
            week: [256, 42, 198, 16],
            month: [743, 98, 612, 33],
            year: [2845, 312, 2398, 135]
        };
        
        if (data[dateRange] && statNumbers.length === data[dateRange].length) {
            statNumbers.forEach((el, index) => {
                // Animate the number change
                animateNumber(el, parseInt(el.textContent, 10), data[dateRange][index]);
            });
        }
    }
    
    // Function to animate number change
    function animateNumber(element, start, end) {
        let current = start;
        const increment = end > start ? 1 : -1;
        const duration = 1000; // 1 second
        const steps = Math.abs(end - start);
        const stepTime = steps > 0 ? duration / steps : duration;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = current;
            
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                element.textContent = end;
                clearInterval(timer);
            }
        }, stepTime);
    }
    
    // Table row actions
    const viewButtons = document.querySelectorAll('.table-actions button:first-child');
    const editButtons = document.querySelectorAll('.table-actions button:last-child');
    
    if (viewButtons) {
        viewButtons.forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const reportId = row.querySelector('td:first-child').textContent;
                
                console.log(`Viewing report: ${reportId}`);
                // In a real app, this would open a modal or navigate to a detail page
                alert(`Viewing details for report ${reportId}`);
            });
        });
    }
    
    if (editButtons) {
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const row = this.closest('tr');
                const reportId = row.querySelector('td:first-child').textContent;
                const statusCell = row.querySelector('td:nth-last-child(2)');
                const currentStatus = statusCell.querySelector('.status-badge').textContent.toLowerCase();
                
                console.log(`Editing report: ${reportId}, current status: ${currentStatus}`);
                
                // Simple status toggle for demonstration
                // In a real app, this would open a modal with a form
                let newStatus;
                if (currentStatus === 'pending') {
                    newStatus = 'verified';
                } else if (currentStatus === 'verified') {
                    newStatus = 'rejected';
                } else {
                    newStatus = 'pending';
                }
                
                // Update the status badge
                statusCell.innerHTML = `<span class="status-badge ${newStatus}">${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}</span>`;
            });
        });
    }
    
    // Initialize AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
}); 