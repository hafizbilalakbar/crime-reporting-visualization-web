// Dashboard Connector - Connects admin dashboard to data
// This simulates a backend API that would normally handle this functionality

// Load data from the data connector
function loadDashboardData() {
    // Check if data connector functions are available
    if (typeof getStoredReports !== 'function' || typeof getCrimeStatistics !== 'function') {
        console.error('Data connector functions not available');
        return null;
    }
    
    try {
        // Get reports and statistics
        const reports = getStoredReports();
        const stats = getCrimeStatistics();
        
        // Update dashboard UI
        updateDashboardStatistics(stats);
        updateReportsTable(reports);
        updateChartsData(reports, stats);
        
        return { reports, stats };
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        return null;
    }
}

// Update dashboard statistics cards
function updateDashboardStatistics(stats) {
    // Total reports count
    const totalReportsElement = document.getElementById('total-reports');
    if (totalReportsElement) {
        totalReportsElement.textContent = stats.totalReports;
    }
    
    // Pending reports count
    const pendingReportsElement = document.getElementById('pending-reports');
    if (pendingReportsElement) {
        pendingReportsElement.textContent = stats.byStatus.pending;
    }
    
    // Verified reports count
    const verifiedReportsElement = document.getElementById('verified-reports');
    if (verifiedReportsElement) {
        verifiedReportsElement.textContent = stats.byStatus.verified;
    }
    
    // Most common crime type
    const commonCrimeElement = document.getElementById('common-crime');
    if (commonCrimeElement) {
        commonCrimeElement.textContent = stats.mostCommonType.charAt(0).toUpperCase() + stats.mostCommonType.slice(1);
    }
}

// Update reports table in dashboard
function updateReportsTable(reports) {
    const tableBody = document.getElementById('reports-table-body');
    if (!tableBody) return;
    
    // Clear existing rows
    tableBody.innerHTML = '';
    
    // Sort reports by date (newest first)
    const sortedReports = [...reports].sort((a, b) => {
        const dateA = new Date(a.submittedAt || a.date);
        const dateB = new Date(b.submittedAt || b.date);
        return dateB - dateA;
    });
    
    // Add rows for each report (limit to latest 10)
    const reportsToShow = sortedReports.slice(0, 10);
    
    reportsToShow.forEach(report => {
        const row = document.createElement('tr');
        
        // Format date
        let reportDate;
        if (report.submittedAt) {
            reportDate = new Date(report.submittedAt).toLocaleDateString();
        } else if (typeof report.date === 'string') {
            reportDate = new Date(report.date).toLocaleDateString();
        } else {
            reportDate = report.date.toLocaleDateString();
        }
        
        // Create row content
        row.innerHTML = `
            <td>${report.id}</td>
            <td>${report.type.charAt(0).toUpperCase() + report.type.slice(1)}</td>
            <td>${reportDate}</td>
            <td>${report.location.address || 'Unknown location'}</td>
            <td>
                <span class="status-badge status-${report.status}">
                    ${report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                </span>
            </td>
            <td>
                <button class="action-btn view-btn" data-id="${report.id}">
                    <i class="fas fa-eye"></i>
                </button>
                ${report.status === 'pending' ? `
                <button class="action-btn approve-btn" data-id="${report.id}">
                    <i class="fas fa-check"></i>
                </button>
                <button class="action-btn reject-btn" data-id="${report.id}">
                    <i class="fas fa-times"></i>
                </button>
                ` : ''}
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Add event listeners to action buttons
    addTableActionListeners();
}

// Add event listeners to table action buttons
function addTableActionListeners() {
    // View report details
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const reportId = this.getAttribute('data-id');
            showReportDetails(reportId);
        });
    });
    
    // Approve report
    document.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const reportId = this.getAttribute('data-id');
            updateReportStatus(reportId, 'verified');
            loadDashboardData(); // Reload data
        });
    });
    
    // Reject report
    document.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const reportId = this.getAttribute('data-id');
            updateReportStatus(reportId, 'rejected');
            loadDashboardData(); // Reload data
        });
    });
}

// Show report details in modal
function showReportDetails(reportId) {
    if (typeof getReportById !== 'function') {
        console.error('getReportById function not available');
        return;
    }
    
    const report = getReportById(reportId);
    if (!report) {
        console.error('Report not found:', reportId);
        return;
    }
    
    // Get modal elements
    const modal = document.getElementById('report-detail-modal');
    if (!modal) return;
    
    // Update modal content
    document.getElementById('detail-id').textContent = report.id;
    document.getElementById('detail-type').textContent = report.type.charAt(0).toUpperCase() + report.type.slice(1);
    
    // Format date properly
    let formattedDate;
    if (typeof report.date === 'string') {
        formattedDate = new Date(report.date).toLocaleDateString();
    } else {
        formattedDate = report.date.toLocaleDateString();
    }
    document.getElementById('detail-date').textContent = formattedDate;
    
    document.getElementById('detail-time').textContent = report.time;
    document.getElementById('detail-location').textContent = report.location.address || 'Unknown location';
    document.getElementById('detail-coordinates').textContent = `${report.location.lat.toFixed(6)}, ${report.location.lng.toFixed(6)}`;
    document.getElementById('detail-description').textContent = report.description;
    
    // Reporter info
    if (report.reporter) {
        document.getElementById('detail-reporter').textContent = report.reporter.name;
        document.getElementById('detail-contact').textContent = report.reporter.email;
        document.getElementById('detail-witness').textContent = report.reporter.isWitness === 'yes' ? 'Yes' : 'No';
    }
    
    // Status
    const statusElement = document.getElementById('detail-status');
    statusElement.textContent = report.status.charAt(0).toUpperCase() + report.status.slice(1);
    statusElement.className = `detail-status status-${report.status}`;
    
    // Evidence
    const evidenceElement = document.getElementById('detail-evidence');
    if (evidenceElement) {
        evidenceElement.textContent = report.hasEvidence ? 'Provided' : 'None';
    }
    
    // Show action buttons based on status
    const actionButtons = document.querySelector('.detail-actions');
    if (actionButtons) {
        if (report.status === 'pending') {
            actionButtons.style.display = 'flex';
            
            // Add event listeners
            document.getElementById('approve-report').onclick = function() {
                updateReportStatus(reportId, 'verified');
                modal.classList.remove('show');
                loadDashboardData(); // Reload data
            };
            
            document.getElementById('reject-report').onclick = function() {
                updateReportStatus(reportId, 'rejected');
                modal.classList.remove('show');
                loadDashboardData(); // Reload data
            };
        } else {
            actionButtons.style.display = 'none';
        }
    }
    
    // Show the modal
    modal.classList.add('show');
    
    // Close button
    document.querySelector('.close-detail-modal').onclick = function() {
        modal.classList.remove('show');
    };
    
    // Close when clicking outside
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
        }
    };
}

// Update charts data
function updateChartsData(reports, stats) {
    // Check if Chart.js is available
    if (typeof Chart === 'undefined') {
        console.error('Chart.js not available');
        return;
    }
    
    // Update crime types chart
    updateCrimeTypesChart(reports);
    
    // Update daily reports chart
    updateDailyReportsChart(reports);
    
    // Update status chart
    updateStatusChart(stats);
}

// Update crime types chart
function updateCrimeTypesChart(reports) {
    const ctx = document.getElementById('crime-types-chart');
    if (!ctx) return;
    
    // Count reports by type
    const typeCounts = {};
    
    reports.forEach(report => {
        if (!typeCounts[report.type]) {
            typeCounts[report.type] = 0;
        }
        typeCounts[report.type]++;
    });
    
    // Prepare data for chart
    const labels = [];
    const data = [];
    const backgroundColors = [
        '#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#6f42c1', '#fd7e14'
    ];
    
    let colorIndex = 0;
    for (const type in typeCounts) {
        labels.push(type.charAt(0).toUpperCase() + type.slice(1));
        data.push(typeCounts[type]);
        colorIndex = (colorIndex + 1) % backgroundColors.length;
    }
    
    // Create chart
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: backgroundColors.slice(0, data.length),
                hoverBackgroundColor: backgroundColors.slice(0, data.length),
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
            },
            legend: {
                display: true,
                position: 'bottom'
            },
            cutoutPercentage: 70,
        },
    });
}

// Update daily reports chart
function updateDailyReportsChart(reports) {
    const ctx = document.getElementById('daily-reports-chart');
    if (!ctx) return;
    
    // Get last 7 days
    const today = new Date();
    const dates = [];
    const counts = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        dates.push(date);
        counts.push(0);
    }
    
    // Count reports by day
    reports.forEach(report => {
        const reportDate = new Date(report.submittedAt || report.date);
        reportDate.setHours(0, 0, 0, 0);
        
        for (let i = 0; i < dates.length; i++) {
            if (reportDate.getTime() === dates[i].getTime()) {
                counts[i]++;
                break;
            }
        }
    });
    
    // Format dates as labels
    const labels = dates.map(date => {
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    });
    
    // Create chart
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: "Reports",
                lineTension: 0.3,
                backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgba(78, 115, 223, 1)",
                pointRadius: 3,
                pointBackgroundColor: "rgba(78, 115, 223, 1)",
                pointBorderColor: "rgba(78, 115, 223, 1)",
                pointHoverRadius: 3,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: counts,
            }],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    time: {
                        unit: 'date'
                    },
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        maxTicksLimit: 7
                    }
                }],
                yAxes: [{
                    ticks: {
                        maxTicksLimit: 5,
                        padding: 10,
                        callback: function(value, index, values) {
                            return value;
                        }
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }],
            },
            legend: {
                display: false
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10
            }
        }
    });
}

// Update status chart
function updateStatusChart(stats) {
    const ctx = document.getElementById('status-chart');
    if (!ctx) return;
    
    // Prepare data
    const data = [
        stats.byStatus.verified,
        stats.byStatus.pending,
        stats.byStatus.rejected
    ];
    
    // Create chart
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Verified", "Pending", "Rejected"],
            datasets: [{
                label: "Reports",
                backgroundColor: ["#1cc88a", "#f6c23e", "#e74a3b"],
                hoverBackgroundColor: ["#17a673", "#dda20a", "#be2617"],
                borderColor: ["#1cc88a", "#f6c23e", "#e74a3b"],
                data: data,
            }],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false,
                        drawBorder: false
                    }
                }],
                yAxes: [{
                    ticks: {
                        min: 0,
                        maxTicksLimit: 5,
                        padding: 10,
                        callback: function(value, index, values) {
                            return value;
                        }
                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    }
                }],
            },
            legend: {
                display: false
            },
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10
            }
        }
    });
}

// Initialize dashboard on load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the dashboard page
    if (document.getElementById('dashboard-page')) {
        // Load dashboard data
        loadDashboardData();
    }
}); 