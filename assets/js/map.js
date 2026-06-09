// Map Visualization Script using Leaflet.js
let crimeMap;
let heatmapLayer;
let markers = [];
let markerClusterGroup;
window.crimeData = []; // Store loaded crime data globally
window.typeCounts = {}; // Make accessible globally
let typeCounts = window.typeCounts; // Local reference

// Initialize map for crime visualization
function initMap() {
    // Create map centered on default location
    crimeMap = L.map('crime-map', {
        center: [40.7128, -74.0060], // Default to NYC
        zoom: 13,
        zoomControl: true
    });
    
    // Add light theme tile layer (default)
    const lightTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    });
    
    // Add dark theme tile layer (will be toggled based on theme)
    const darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    });
    
    // Set initial tile layer based on current theme
    if (document.body.classList.contains('dark-theme')) {
        darkTiles.addTo(crimeMap);
    } else {
        lightTiles.addTo(crimeMap);
    }
    
    // Create base and overlay layer groups for layer control
    const baseLayers = {
        "Light Theme": lightTiles,
        "Dark Theme": darkTiles
    };
    
    // Add scale control
    L.control.scale().addTo(crimeMap);
    
    // Initialize marker cluster group
    markerClusterGroup = L.markerClusterGroup({
        disableClusteringAtZoom: 16,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true
    });
    
    crimeMap.addLayer(markerClusterGroup);
    
    // Load crime data
    loadCrimeData();
    
    // Add event listeners for filter changes
    document.getElementById('crime-type-filter').addEventListener('change', filterMarkers);
    document.getElementById('date-range-filter').addEventListener('change', filterMarkers);
    
    // Add event listeners for view toggle
    document.getElementById('pin-view-btn').addEventListener('click', function() {
        switchView('pins');
    });
    
    document.getElementById('heatmap-view-btn').addEventListener('click', function() {
        switchView('heatmap');
    });
    
    // Add user location button
    addLocationButton();
    
    // Hide heatmap legend by default (show pin view initially)
    const heatmapLegend = document.querySelector('.heatmap-legend');
    if (heatmapLegend) {
        heatmapLegend.style.display = 'none';
    }
    
    // Listen for theme changes to update map theme
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', updateMapTheme);
    }
}

// Add a button to locate the user
function addLocationButton() {
    const locationBtnContainer = L.control({ position: 'topleft' });
    
    locationBtnContainer.onAdd = function() {
        const div = L.DomUtil.create('div', 'location-btn-container');
        div.innerHTML = `<button class="location-btn" title="Show my location"><i class="fas fa-location-arrow"></i></button>`;
        return div;
    };
    
    locationBtnContainer.addTo(crimeMap);
    
    // Add click handler after the control is added to the map
    setTimeout(() => {
        const locationBtn = document.querySelector('.location-btn');
        if (locationBtn) {
            locationBtn.addEventListener('click', getUserLocation);
        }
    }, 100);
}

// Get user location and center map
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                // Add a marker for the user's location
                const userIcon = L.divIcon({
                    className: 'user-location-marker',
                    html: '<div><i class="fas fa-user-circle"></i></div>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });
                
                // Remove previous user marker if exists
                if (window.userMarker) {
                    crimeMap.removeLayer(window.userMarker);
                }
                
                window.userMarker = L.marker([userLat, userLng], {
                    icon: userIcon,
                    zIndexOffset: 1000
                }).addTo(crimeMap);
                
                // Center map on user's location
                crimeMap.setView([userLat, userLng], 15);
                
                // Show a popup
                window.userMarker.bindPopup('Your Location').openPopup();
            },
            function(error) {
                console.error('Error getting user location:', error);
                alert('Unable to get your location. Please check your browser permissions.');
            }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
}

// Load crime data from data connector or sample data
function loadCrimeData() {
    // Try to use sample data directly since it's more reliable
    fetch('data/complaints.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load sample data');
            }
            return response.json();
        })
        .then(data => {
            console.log('Successfully loaded crime data:', data.length, 'records');
            window.crimeData = data; // Update the global variable
            processReports(data);
        })
        .catch(error => {
            console.error('Error loading sample data:', error);
            // Fallback to local storage if fetch fails
            const reports = getStoredReports();
            if (reports && reports.length > 0) {
                console.log('Using data from local storage:', reports.length, 'records');
                window.crimeData = reports; // Update the global variable
                processReports(reports);
            } else {
                console.warn('No crime data available');
                // Create some dummy data if nothing is available
                createDummyData();
            }
        });
}

// Create dummy data if no real data is available
function createDummyData() {
    console.log('Creating dummy data');
    const dummyData = [];
    
    // Create 20 random points around NYC
    for (let i = 0; i < 20; i++) {
        const lat = 40.7128 + (Math.random() - 0.5) * 0.1;
        const lng = -74.0060 + (Math.random() - 0.5) * 0.1;
        
        const crimeTypes = ['theft', 'robbery', 'assault', 'vandalism', 'burglary', 'fraud', 'harassment'];
        const type = crimeTypes[Math.floor(Math.random() * crimeTypes.length)];
        
        const statusTypes = ['verified', 'pending', 'rejected'];
        const status = statusTypes[Math.floor(Math.random() * statusTypes.length)];
        
        dummyData.push({
            id: 'DUMMY-' + (i + 1),
            type: type,
            location: {
                lat: lat,
                lng: lng,
                address: `${i+1} Test Street, New York, NY`
            },
            date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            time: `${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}`,
            description: `This is a dummy ${type} report for testing.`,
            status: status,
            weight: status === 'verified' ? 1.0 : (status === 'pending' ? 0.5 : 0.2)
        });
    }
    
    window.crimeData = dummyData; // Update the global variable
    processReports(dummyData);
}

// Get reports from local storage (used as fallback)
function getStoredReports() {
    try {
        const storedData = localStorage.getItem('crimewatch_reports');
        return storedData ? JSON.parse(storedData) : [];
    } catch (e) {
        console.error('Error reading from local storage:', e);
        return [];
    }
}

// Process reports for display
function processReports(reports) {
    if (!reports || reports.length === 0) {
        console.warn('No reports to process');
        return;
    }
    
    console.log('Processing', reports.length, 'reports');
    
    // Apply filters
    const filteredReports = filterReportsByCurrentFilters(reports);
    
    // Clear existing markers
    clearMarkers();
    
    // Add new markers for each report
    filteredReports.forEach(addCrimeMarker);
    
    // Update statistics
    updateStatistics(filteredReports);
    
    // Initialize heatmap
    createHeatmap(filteredReports);
    
    // Show pin view by default
    switchView('pins');
}

// Filter reports based on current filter selections
function filterReportsByCurrentFilters(reports) {
    const crimeTypeSelect = document.getElementById('crime-type-filter');
    const dateRangeSelect = document.getElementById('date-range-filter');
    
    if (!crimeTypeSelect || !dateRangeSelect) {
        console.warn('Filter elements not found');
        return reports;
    }
    
    const crimeType = crimeTypeSelect.value;
    const dateRange = dateRangeSelect.value;
    
    // Start with all reports
    let filtered = [...reports];
    
    // Filter by crime type
    if (crimeType && crimeType !== 'all') {
        filtered = filtered.filter(report => report.type === crimeType);
    }
    
    // Filter by date range
    if (dateRange && dateRange !== 'all') {
        const now = new Date();
        let cutoffDate = new Date();
        
        switch (dateRange) {
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
        
        filtered = filtered.filter(report => {
            const reportDate = new Date(report.date);
            return reportDate >= cutoffDate;
        });
    }
    
    return filtered;
}

// Add a marker for a crime report
function addCrimeMarker(report) {
    // Skip reports without valid coordinates
    if (!report.location || !report.location.lat || !report.location.lng) {
        console.warn('Report missing location data:', report.id);
        return;
    }
    
    // Create marker with appropriate icon
    const marker = L.marker([report.location.lat, report.location.lng], {
        icon: getCrimeIcon(report.type),
        riseOnHover: true,
        title: capitalizeFirstLetter(report.type)
    });
    
    // Create popup content
    const popupContent = `
        <div class="map-popup">
            <h3 class="popup-title">${capitalizeFirstLetter(report.type)}</h3>
            <div class="popup-info">
                <p><strong>Date:</strong> ${formatDate(report.date)}</p>
                <p><strong>Time:</strong> ${report.time || 'Not specified'}</p>
                <p><strong>Status:</strong> <span class="status-${report.status}">${capitalizeFirstLetter(report.status)}</span></p>
            </div>
            <button class="btn btn-sm btn-primary view-details-btn" data-id="${report.id}">View Details</button>
        </div>
    `;
    
    // Bind popup to marker
    marker.bindPopup(popupContent);
    
    // Add event for showing details when marker is clicked
    marker.on('click', function() {
        showCrimeDetails(report);
    });
    
    // Handle popup open to add click event to the View Details button
    marker.on('popupopen', function() {
        setTimeout(() => {
            const detailBtn = document.querySelector('.view-details-btn[data-id="' + report.id + '"]');
            if (detailBtn) {
                detailBtn.addEventListener('click', function() {
                    showCrimeDetails(report);
                });
            }
        }, 10);
    });
    
    // Add marker to cluster group
    markerClusterGroup.addLayer(marker);
    
    // Store marker reference
    markers.push({
        marker: marker,
        report: report
    });
}

// Create heatmap layer
function createHeatmap(reports) {
    // Extract location data for heatmap
    const heatmapData = reports
        .filter(report => report.location && report.location.lat && report.location.lng)
        .map(report => {
            // Weight verified reports higher than pending/rejected
            let intensity = 0.5;
            if (report.status === 'verified') {
                intensity = 1;
            } else if (report.status === 'rejected') {
                intensity = 0.2;
            }
            
            // Apply custom weight if available
            if (report.weight !== undefined) {
                intensity = report.weight;
            }
            
            return [report.location.lat, report.location.lng, intensity];
        });
    
    console.log('Creating heatmap with', heatmapData.length, 'points');
    
    // Create or update heatmap layer
    if (heatmapLayer) {
        crimeMap.removeLayer(heatmapLayer);
    }
    
    if (heatmapData.length > 0) {
        try {
            heatmapLayer = L.heatLayer(heatmapData, {
                radius: 25,
                blur: 15,
                maxZoom: 17,
                gradient: {
                    0.2: 'blue',
                    0.4: 'lime',
                    0.6: 'yellow',
                    0.8: 'orange',
                    1.0: 'red'
                }
            });
            console.log('Heatmap layer created successfully');
        } catch (e) {
            console.error('Failed to create heatmap:', e);
        }
    } else {
        console.warn('No valid heat map data available');
    }
}

// Switch between pin view and heatmap view
function switchView(viewType) {
    const pinBtn = document.getElementById('pin-view-btn');
    const heatmapBtn = document.getElementById('heatmap-view-btn');
    
    if (!pinBtn || !heatmapBtn) {
        console.warn('View toggle buttons not found');
        return;
    }
    
    const legendItems = document.querySelector('.legend-items');
    const heatmapLegend = document.querySelector('.heatmap-legend');
    
    if (viewType === 'heatmap' && heatmapLayer) {
        console.log('Switching to heatmap view');
        // Show heatmap, hide markers
        if (markerClusterGroup) {
            crimeMap.removeLayer(markerClusterGroup);
        }
        heatmapLayer.addTo(crimeMap);
        
        // Update button states
        pinBtn.classList.remove('active');
        heatmapBtn.classList.add('active');
        
        // Show heatmap legend, hide regular legend
        if (legendItems) legendItems.style.display = 'none';
        if (heatmapLegend) heatmapLegend.style.display = 'block';
    } else {
        console.log('Switching to pin view');
        // Show markers, hide heatmap
        if (heatmapLayer) {
            crimeMap.removeLayer(heatmapLayer);
        }
        markerClusterGroup.addTo(crimeMap);
        
        // Update button states
        pinBtn.classList.add('active');
        heatmapBtn.classList.remove('active');
        
        // Show regular legend, hide heatmap legend
        if (legendItems) legendItems.style.display = 'grid';
        if (heatmapLegend) heatmapLegend.style.display = 'none';
    }
}

// Filter markers based on selected filters
function filterMarkers() {
    if (crimeData.length === 0) {
        console.warn('No data to filter');
        return;
    }
    
    // Apply filters to the stored crime data
    const filteredReports = filterReportsByCurrentFilters(crimeData);
    
    // Clear and recreate markers
    clearMarkers();
    filteredReports.forEach(addCrimeMarker);
    
    // Update heatmap
    createHeatmap(filteredReports);
    
    // Update statistics
    updateStatistics(filteredReports);
    
    // Refresh current view
    const isHeatmapActive = document.getElementById('heatmap-view-btn').classList.contains('active');
    switchView(isHeatmapActive ? 'heatmap' : 'pins');
}

// Clear all markers from the map
function clearMarkers() {
    markerClusterGroup.clearLayers();
    markers = [];
}

// Update statistics based on filtered reports
function updateStatistics(reports) {
    console.log('Updating statistics with', reports.length, 'reports');
    
    // Update total crime count
    const totalCrimes = document.getElementById('total-crimes');
    if (totalCrimes) {
        totalCrimes.textContent = reports.length || 0;
    }
    
    // Find most common crime type
    window.typeCounts = {}; // Reset global typeCounts
    typeCounts = window.typeCounts; // Update local reference
    
    reports.forEach(report => {
        if (report && report.type) {
            typeCounts[report.type] = (typeCounts[report.type] || 0) + 1;
        }
    });
    
    let maxCount = 0;
    let mostCommonType = 'None';
    
    for (const type in typeCounts) {
        if (typeCounts[type] > maxCount) {
            maxCount = typeCounts[type];
            mostCommonType = capitalizeFirstLetter(type);
        }
    }
    
    const mostCommonElement = document.getElementById('most-common');
    if (mostCommonElement) {
        mostCommonElement.textContent = mostCommonType || 'None';
    }
    
    // Calculate hotspots (areas with high crime density)
    const hotSpots = getHotspotCount(reports) || 0;
    const hotSpotsElement = document.getElementById('hot-spots');
    if (hotSpotsElement) {
        hotSpotsElement.textContent = hotSpots;
    }
    
    // Update analytics section with additional insights
    updateAnalyticsSection(reports);
}

// Update the analytics section with more detailed insights
function updateAnalyticsSection(reports) {
    const analyticsSectionExists = document.querySelector('.analytics-section');
    if (!analyticsSectionExists) return;
    
    // Calculate time of day distribution
    const timeDistribution = {
        morning: 0,   // 6AM-12PM
        afternoon: 0, // 12PM-6PM
        evening: 0,   // 6PM-10PM
        night: 0      // 10PM-6AM
    };
    
    if (reports && reports.length > 0) {
        reports.forEach(report => {
            if (report && report.time) {
                try {
                    const timeParts = report.time.split(':');
                    if (timeParts.length >= 2) {
                        const hour = parseInt(timeParts[0]);
                        
                        if (hour >= 6 && hour < 12) {
                            timeDistribution.morning++;
                        } else if (hour >= 12 && hour < 18) {
                            timeDistribution.afternoon++;
                        } else if (hour >= 18 && hour < 22) {
                            timeDistribution.evening++;
                        } else {
                            timeDistribution.night++;
                        }
                    }
                } catch (error) {
                    console.error('Error processing time:', error);
                }
            }
        });
    }
    
    // Find peak time
    let peakTime = 'Unknown';
    let maxCount = 0;
    
    if (timeDistribution.morning > maxCount) {
        maxCount = timeDistribution.morning;
        peakTime = 'Morning (6AM-12PM)';
    }
    if (timeDistribution.afternoon > maxCount) {
        maxCount = timeDistribution.afternoon;
        peakTime = 'Afternoon (12PM-6PM)';
    }
    if (timeDistribution.evening > maxCount) {
        maxCount = timeDistribution.evening;
        peakTime = 'Evening (6PM-10PM)';
    }
    if (timeDistribution.night > maxCount) {
        maxCount = timeDistribution.night;
        peakTime = 'Night (10PM-6AM)';
    }
    
    // Update time analysis text
    const timeAnalysisElement = document.querySelector('.analytics-item:nth-child(2) .analytics-info p');
    if (timeAnalysisElement && peakTime !== 'Unknown') {
        timeAnalysisElement.textContent = `Most incidents occur during ${peakTime}`;
    }
    
    // Calculate type distribution percentage
    if (reports && reports.length > 0) {
        const mostCommonElement = document.getElementById('most-common');
        const mostCommonType = mostCommonElement ? mostCommonElement.textContent : 'Unknown';
        
        if (mostCommonType && mostCommonType !== 'None' && mostCommonType !== 'Unknown') {
            const typeCount = typeCounts[mostCommonType.toLowerCase()] || 0;
            const percentage = Math.round((typeCount / reports.length) * 100) || 0;
            
            const typeAnalysisElement = document.querySelector('.analytics-item:nth-child(3) .analytics-info p');
            if (typeAnalysisElement && percentage > 0) {
                typeAnalysisElement.textContent = `${mostCommonType} accounts for ${percentage}% of all reports`;
            }
        }
    }
}

// Show details for selected crime
function showCrimeDetails(report) {
    // Get detail elements
    const detailType = document.getElementById('detail-type');
    const detailDate = document.getElementById('detail-date');
    const detailTime = document.getElementById('detail-time');
    const detailLocation = document.getElementById('detail-location');
    const detailStatus = document.getElementById('detail-status');
    const detailDescription = document.getElementById('detail-description');
    
    if (!detailType || !detailDate || !detailTime || !detailLocation || !detailStatus || !detailDescription) {
        console.warn('Detail elements not found');
        return;
    }
    
    // Hide prompt and show crime info
    const selectPrompt = document.querySelector('.select-prompt');
    const crimeInfo = document.querySelector('.crime-info');
    
    if (selectPrompt) selectPrompt.style.display = 'none';
    if (crimeInfo) crimeInfo.style.display = 'block';
    
    // Update details with report data
    detailType.textContent = capitalizeFirstLetter(report.type);
    detailDate.textContent = formatDate(report.date);
    detailTime.textContent = report.time || 'Not specified';
    detailLocation.textContent = report.location.address || 'Address not available';
    
    detailStatus.textContent = capitalizeFirstLetter(report.status);
    detailStatus.className = `info-value status-${report.status}`;
    
    detailDescription.textContent = report.description || 'No description available';
}

// Get appropriate icon for crime type
function getCrimeIcon(crimeType) {
    // Define base icon settings
    const iconOptions = {
        className: `crime-report-marker crime-${crimeType}`,
        html: `<div class="marker-pin"></div>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42],
        popupAnchor: [0, -40]
    };
    
    // Create and return div icon
    return L.divIcon(iconOptions);
}

// Calculate number of hotspots in report data
function getHotspotCount(points) {
    if (!points || points.length === 0) return 0;
    
    // Parameters for hotspot calculation
    const MIN_POINTS = 3;        // Minimum points to form a hotspot
    const MAX_DISTANCE = 0.5;    // Maximum distance in km between points in a hotspot
    
    // Array to track which points have been assigned to clusters
    const assigned = new Array(points.length).fill(false);
    
    // Array to store clusters
    const clusters = [];
    
    // Find clusters
    for (let i = 0; i < points.length; i++) {
        if (assigned[i]) continue; // Skip if already assigned
        
        // Skip points without location data
        if (!points[i].location || !points[i].location.lat || !points[i].location.lng) {
            continue;
        }
        
        // Start new cluster with this point
        const cluster = [i];
        assigned[i] = true;
        
        // Find nearby points
        for (let j = 0; j < points.length; j++) {
            if (i === j || assigned[j]) continue; // Skip self or assigned
            
            // Skip points without location data
            if (!points[j].location || !points[j].location.lat || !points[j].location.lng) {
                continue;
            }
            
            // Calculate distance between points
            const dist = distance(
                points[i].location.lat, points[i].location.lng,
                points[j].location.lat, points[j].location.lng
            );
            
            // If within threshold, add to cluster
            if (dist <= MAX_DISTANCE) {
                cluster.push(j);
                assigned[j] = true;
            }
        }
        
        // If cluster has minimum required points, it's a hotspot
        if (cluster.length >= MIN_POINTS) {
            clusters.push(cluster);
        }
    }
    
    return clusters.length;
}

// Calculate distance between two coordinates in km (Haversine formula)
function distance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Update map theme based on site theme
function updateMapTheme() {
    if (!crimeMap) return;
    
    // Determine if dark theme is active
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    // Get all tilelayers
    crimeMap.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
            crimeMap.removeLayer(layer);
        }
    });
    
    // Add appropriate tile layer
    if (isDarkTheme) {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(crimeMap);
        
        // Add dark mode class to map container
        document.getElementById('crime-map').classList.add('map-dark-mode');
    } else {
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(crimeMap);
        
        // Remove dark mode class from map container
        document.getElementById('crime-map').classList.remove('map-dark-mode');
    }
    
    // Re-add marker clusters
    switchView(document.getElementById('heatmap-view-btn').classList.contains('active') ? 'heatmap' : 'pins');
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Format date for display
function formatDate(dateObj) {
    if (!dateObj) return 'Unknown date';
    
    let date;
    try {
        if (typeof dateObj === 'string') {
            date = new Date(dateObj);
        } else if (dateObj instanceof Date) {
            date = dateObj;
        } else {
            return 'Invalid date format';
        }
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            return 'Unknown date';
        }
        
        // Format as Month Day, Year
        return date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Date error';
    }
}

// Initialize AOS animation library
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
});
