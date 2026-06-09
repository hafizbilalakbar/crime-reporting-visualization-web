// Data Connector - Handles data flow between reporting form and visualization map
// This simulates a backend API that would normally handle this functionality

// Local storage keys
const CRIME_DATA_KEY = 'crimewatch_reports';
const LAST_REPORT_KEY = 'crimewatch_last_report';

// Save crime report to local storage
function saveReport(formData) {
    // Get existing data or initialize empty array
    let reports = getStoredReports();
    
    // Generate a unique ID
    const reportId = 'CR-' + Math.floor(100000 + Math.random() * 900000);
    
    // Format date and time
    const reportDate = new Date();
    const formattedDate = formatDate(reportDate);
    const formattedTime = formatTime(reportDate);
    
    // Create report object
    const report = {
        id: reportId,
        type: formData.get('crimeType'),
        date: formData.get('crimeDate') ? new Date(formData.get('crimeDate')) : reportDate,
        time: formData.get('crimeTime') || formattedTime,
        location: {
            lat: parseFloat(formData.get('latitude')),
            lng: parseFloat(formData.get('longitude')),
            address: formData.get('address')
        },
        reporter: {
            name: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            isWitness: formData.get('witness')
        },
        description: formData.get('crimeDescription'),
        status: 'pending',
        submittedAt: reportDate.toISOString(),
        hasEvidence: formData.get('evidence') && formData.get('evidence').size > 0
    };
    
    // Add to reports array
    reports.push(report);
    
    // Save to local storage
    localStorage.setItem(CRIME_DATA_KEY, JSON.stringify(reports));
    
    // Save last report for reference
    localStorage.setItem(LAST_REPORT_KEY, reportId);
    
    return reportId;
}

// Get all reports from local storage
function getStoredReports() {
    const storedData = localStorage.getItem(CRIME_DATA_KEY);
    if (storedData) {
        try {
            const reports = JSON.parse(storedData);
            
            // Convert date strings to Date objects
            reports.forEach(report => {
                if (typeof report.date === 'string') {
                    report.date = new Date(report.date);
                }
            });
            
            return reports;
        } catch (error) {
            console.error('Error parsing stored reports:', error);
            return [];
        }
    }
    return [];
}

// Get a specific report by ID
function getReportById(reportId) {
    const reports = getStoredReports();
    return reports.find(report => report.id === reportId);
}

// Get the last submitted report ID
function getLastReportId() {
    return localStorage.getItem(LAST_REPORT_KEY);
}

// Update the status of a report
function updateReportStatus(reportId, newStatus) {
    const reports = getStoredReports();
    const reportIndex = reports.findIndex(report => report.id === reportId);
    
    if (reportIndex !== -1) {
        reports[reportIndex].status = newStatus;
        reports[reportIndex].updatedAt = new Date().toISOString();
        
        // Save updated reports
        localStorage.setItem(CRIME_DATA_KEY, JSON.stringify(reports));
        return true;
    }
    
    return false;
}

// Get reports by filter criteria
function getFilteredReports(filters = {}) {
    let reports = getStoredReports();
    
    // Filter by crime type
    if (filters.crimeType && filters.crimeType !== 'all') {
        reports = reports.filter(report => report.type === filters.crimeType);
    }
    
    // Filter by date range
    if (filters.dateRange && filters.dateRange !== 'all') {
        const now = new Date();
        let cutoffDate = new Date();
        
        switch (filters.dateRange) {
            case 'week':
                cutoffDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                cutoffDate.setMonth(now.getMonth() - 1);
                break;
            case 'quarter':
                cutoffDate.setMonth(now.getMonth() - 3);
                break;
            case 'year':
                cutoffDate.setFullYear(now.getFullYear() - 1);
                break;
        }
        
        reports = reports.filter(report => new Date(report.date) >= cutoffDate);
    }
    
    // Filter by status
    if (filters.status) {
        reports = reports.filter(report => report.status === filters.status);
    }
    
    return reports;
}

// Get crime statistics
function getCrimeStatistics() {
    const reports = getStoredReports();
    
    // Total reports
    const totalReports = reports.length;
    
    // Reports by status
    const verified = reports.filter(report => report.status === 'verified').length;
    const pending = reports.filter(report => report.status === 'pending').length;
    const rejected = reports.filter(report => report.status === 'rejected').length;
    
    // Most common crime type
    const typeCounts = {};
    let maxCount = 0;
    let mostCommonType = '';
    
    reports.forEach(report => {
        if (!typeCounts[report.type]) {
            typeCounts[report.type] = 0;
        }
        typeCounts[report.type]++;
        
        if (typeCounts[report.type] > maxCount) {
            maxCount = typeCounts[report.type];
            mostCommonType = report.type;
        }
    });
    
    // Reports by day of week
    const dayOfWeekCounts = [0, 0, 0, 0, 0, 0, 0]; // Sun-Sat
    reports.forEach(report => {
        const day = new Date(report.date).getDay();
        dayOfWeekCounts[day]++;
    });
    
    return {
        totalReports,
        byStatus: { verified, pending, rejected },
        mostCommonType,
        byDayOfWeek: dayOfWeekCounts
    };
}

// Simulate network request to police admin system
function simulateRequest(data, delay = 1500, successRate = 0.95) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < successRate) {
                resolve({
                    success: true,
                    data: data
                });
            } else {
                reject({
                    success: false,
                    error: "Network error or server unavailable"
                });
            }
        }, delay);
    });
}

// Process form submission for crime report and send to police admin system
async function submitCrimeReportToPolice(formData) {
    try {
        // First save report locally
        const reportId = saveReport(formData);
        
        // Create a structured data object for police admin system
        const reportData = {
            id: reportId,
            timestamp: new Date().toISOString(),
            personal: {
                name: formData.get('fullName'),
                email: formData.get('email'),
                phone: formData.get('phone') || 'Not provided',
                witness: formData.get('witness')
            },
            incident: {
                type: formData.get('crimeType'),
                otherType: formData.get('crimeType') === 'other' ? formData.get('otherCrimeType') : null,
                date: formData.get('crimeDate'),
                time: formData.get('crimeTime') || 'Unknown',
                description: formData.get('crimeDescription')
            },
            location: {
                address: formData.get('address') || 'Address not provided',
                coordinates: {
                    lat: parseFloat(formData.get('latitude')),
                    lng: parseFloat(formData.get('longitude'))
                }
            },
            evidence: {
                filesCount: formData.getAll('evidence').length,
                contact: formData.get('contact') === 'on'
            },
            status: 'Submitted',
            assignedTo: null,
            priority: 'Medium',
            verificationStatus: 'Pending'
        };

        // In a real system, we would upload files to a secure storage
        // For simulation, we'll just acknowledge the evidence
        const evidenceFiles = formData.getAll('evidence');
        if (evidenceFiles.length > 0) {
            reportData.evidence.hasFiles = true;
            reportData.evidence.fileTypes = Array.from(evidenceFiles).map(file => file.type);
        }

        // Simulate sending to police system API
        const response = await simulateRequest(reportData, 2000);
        
        // In a real system, store the report ID in localStorage for later reference
        const recentReports = JSON.parse(localStorage.getItem('recentReports') || '[]');
        recentReports.push({
            id: reportData.id,
            date: new Date().toISOString(),
            type: reportData.incident.type,
            status: 'Pending'
        });
        localStorage.setItem('recentReports', JSON.stringify(recentReports.slice(-5)));
        
        return {
            success: true,
            reportId: reportData.id,
            message: "Report submitted successfully and sent to police system",
            estimatedResponseTime: "24-48 hours"
        };
    } catch (error) {
        console.error("Error submitting crime report to police:", error);
        return {
            success: false,
            error: "Failed to submit report. Please try again or contact support.",
            technical: error.toString()
        };
    }
}

// Utility functions
function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Export functions if using module system
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        saveReport,
        getStoredReports,
        getReportById,
        getLastReportId,
        updateReportStatus,
        getFilteredReports,
        getCrimeStatistics,
        submitCrimeReportToPolice
    };
} else {
    // Add to window object for browser usage
    window.CrimeDataConnector = {
        saveReport,
        getStoredReports,
        getReportById,
        getLastReportId,
        updateReportStatus,
        getFilteredReports,
        getCrimeStatistics,
        submitCrimeReportToPolice
    };
} 