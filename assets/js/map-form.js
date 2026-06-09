// Map functionality for crime report form
let reportMap;
let reportMarker;
let searchControl;

// Initialize map for crime report form
function initReportMap() {
    // Get map container
    const mapContainer = document.getElementById('location-map');
    if (!mapContainer) return;
    
    // Make sure Leaflet is loaded
    if (typeof L === 'undefined') {
        console.error('Leaflet library not loaded');
        showErrorMessage(mapContainer, 'Map could not be loaded. Please refresh the page.');
        return;
    }
    
    try {
        // Create map with default location (using a more central location like Lahore, Pakistan as default)
        const defaultLat = 31.5204; 
        const defaultLng = 74.3587;
        
        reportMap = L.map('location-map', {
            center: [defaultLat, defaultLng],
            zoom: 13,
            zoomControl: false, // We'll add our own zoom controls
            minZoom: 3 // Prevent zooming out too far
        });
        
        // Set theme-appropriate tiles based on current theme
        updateMapTheme();
        
        // Add our custom zoom controls
        document.getElementById('zoom-in').addEventListener('click', () => {
            reportMap.zoomIn();
        });
        
        document.getElementById('zoom-out').addEventListener('click', () => {
            reportMap.zoomOut();
        });
        
        document.getElementById('reset-map').addEventListener('click', () => {
            resetMap();
        });
        
        // Add my location button functionality
        document.getElementById('my-location').addEventListener('click', () => {
            getUserLocation();
        });
        
        // Initialize and add the search control
        initSearchControl();
        
        // Add click event to the map to set marker
        reportMap.on('click', (e) => {
            setMapMarker(e.latlng);
            
            // Show click effect
            const clickEffect = document.createElement('div');
            clickEffect.className = 'map-click-effect';
            clickEffect.style.left = e.containerPoint.x + 'px';
            clickEffect.style.top = e.containerPoint.y + 'px';
            mapContainer.appendChild(clickEffect);
            
            // Remove the effect after animation completes
            setTimeout(() => {
                if (mapContainer.contains(clickEffect)) {
                    mapContainer.removeChild(clickEffect);
                }
            }, 700);
        });
        
        // Try to get user's location for initial map center
        getUserLocation();
        
        // Handle search button click
        const searchBtn = document.getElementById('search-location-btn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const addressInput = document.getElementById('address');
                if (addressInput && addressInput.value.trim() !== '') {
                    searchAddress(addressInput.value);
                } else {
                    showMapNotification('Please enter an address to search', 'warning');
                }
            });
        }
        
        // Handle address input enter key
        const addressInput = document.getElementById('address');
        if (addressInput) {
            addressInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    if (this.value.trim() !== '') {
                        searchAddress(this.value);
                    } else {
                        showMapNotification('Please enter an address to search', 'warning');
                    }
                }
            });
            
            // Add input event for live search suggestions (optional)
            addressInput.addEventListener('input', debounce(function() {
                if (this.value.trim().length > 3) {
                    // Show loading indicator
                    const searchIcon = addressInput.parentElement.querySelector('i');
                    if (searchIcon) {
                        searchIcon.className = 'fas fa-spinner fa-spin';
                    }
                    
                    // Perform geocoding
                    if (searchControl && typeof searchControl.geocoder !== 'undefined') {
                        searchControl.geocoder.geocode(this.value, results => {
                            // Reset loading indicator
                            if (searchIcon) {
                                searchIcon.className = 'fas fa-search-location';
                            }
                        });
                    }
                }
            }, 500));
        }
        
        // Update map when theme changes
        window.addEventListener('storage', function(e) {
            if (e.key === 'theme') {
                updateMapTheme();
            }
        });
        
        // Set initial marker at default location
        setMapMarker(L.latLng(defaultLat, defaultLng));
        
    } catch (error) {
        console.error('Error initializing map:', error);
        showErrorMessage(mapContainer, 'Error loading map. Please refresh the page.');
    }
}

// Helper function for debouncing
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// Show error message in map container
function showErrorMessage(container, message) {
    if (!container) return;
    
    container.innerHTML = `
        <div class="map-error">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <button class="btn btn-primary btn-sm refresh-map-btn">Refresh Map</button>
        </div>
    `;
    
    const refreshBtn = container.querySelector('.refresh-map-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }
}

// Get user's location and center map
function getUserLocation() {
    if (!reportMap) return;
    
    showMapNotification('Getting your location...', 'info');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                reportMap.setView([latitude, longitude], 15);
                showMapNotification('Map centered on your location', 'success');
                
                // Optionally set a marker
                setMapMarker(L.latLng(latitude, longitude));
            },
            (error) => {
                console.error('Geolocation error:', error);
                showMapNotification('Could not get your location. Please search or click on the map.', 'error');
                
                // Center on default location
                reportMap.setView([defaultLat, defaultLng], 13);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        showMapNotification('Geolocation is not supported by your browser', 'error');
        reportMap.setView([defaultLat, defaultLng], 13);
    }
}

// Reset map to initial state
function resetMap() {
    if (!reportMap) return;
    
    // Center on default location
    reportMap.setView([defaultLat, defaultLng], 13);
    
    // Remove existing marker if present
    if (reportMarker) {
        reportMap.removeLayer(reportMarker);
        reportMarker = null;
        
        // Clear latitude/longitude fields
        const latField = document.getElementById('latitude');
        const lngField = document.getElementById('longitude');
        if (latField && lngField) {
            latField.value = '';
            lngField.value = '';
        }
    }
    
    showMapNotification('Map has been reset', 'info');
}

// Update map theme based on current theme
function updateMapTheme() {
    if (!reportMap) return;
    
    // Remove existing tile layer if it exists
    reportMap.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
            reportMap.removeLayer(layer);
        }
    });
    
    // Check current theme
    const isDarkTheme = document.body.classList.contains('dark-theme');
    
    // Set appropriate tile layer based on theme
    try {
        if (isDarkTheme) {
            // Dark theme map - use a darker tiles provider
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            }).addTo(reportMap);
            
            // Apply dark theme to container
            const mapContainer = document.getElementById('location-map');
            if (mapContainer) {
                mapContainer.classList.add('dark-map');
            }
        } else {
            // Light theme map
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19
            }).addTo(reportMap);
            
            // Remove dark theme from container
            const mapContainer = document.getElementById('location-map');
            if (mapContainer) {
                mapContainer.classList.remove('dark-map');
            }
        }
        
        // If a marker is already set, update its appearance
        if (reportMarker) {
            updateMarkerAppearance();
        }
    } catch (error) {
        console.error('Error updating map theme:', error);
    }
}

// Initialize search control for the map
function initSearchControl() {
    if (!reportMap || typeof L.Control.Geocoder === 'undefined') return;
    
    try {
        // Initialize geocoding search control
        searchControl = L.Control.Geocoder.nominatim({
            geocodingQueryParams: {
                countrycodes: '', // Optional: limit to specific countries
                limit: 10
            }
        });
        
        // Add the control to the map
        const geocoder = L.Control.geocoder({
            defaultMarkGeocode: false,
            position: 'topleft',
            placeholder: 'Search for address...',
            errorMessage: 'Nothing found. Try a different search.',
            showResultIcons: true,
            suggestMinLength: 3,
            suggestTimeout: 250,
            queryMinLength: 3,
            geocoder: searchControl
        }).addTo(reportMap);
        
        // Handle geocoding result
        geocoder.on('markgeocode', function(e) {
            const result = e.geocode;
            const latlng = result.center;
            
            // Set marker at the found location
            setMapMarker(latlng);
            
            // Zoom to result bounds if available, else center on point
            if (result.bbox) {
                reportMap.fitBounds(result.bbox);
            } else {
                reportMap.setView(latlng, 15);
            }
            
            // Update the search input field with the found address
            const addressInput = document.getElementById('address');
            if (addressInput) {
                addressInput.value = result.name || result.html;
            }
            
            // Update address details
            updateAddressField(result);
            
            // Show success notification
            showMapNotification(`Location found: ${result.name || 'Selected location'}`, 'success');
        });
    } catch (error) {
        console.error('Error initializing search control:', error);
    }
}

// Set marker on the map
function setMapMarker(latlng) {
    if (!reportMap) return;
    
    try {
        // Remove existing marker if it exists
        if (reportMarker) {
            reportMap.removeLayer(reportMarker);
        }
        
        // Create marker with custom appearance
        const markerHtml = `
            <div class="crime-report-marker">
                <div class="marker-pin marker-pin-drop"></div>
                <div class="marker-pulse"></div>
            </div>
        `;
        
        // Create custom icon
        const customIcon = L.divIcon({
            className: 'custom-marker-icon',
            html: markerHtml,
            iconSize: [30, 42],
            iconAnchor: [15, 42]
        });
        
        // Add marker to map
        reportMarker = L.marker(latlng, {
            icon: customIcon,
            draggable: true
        }).addTo(reportMap);
        
        // Update coordinates in form
        updateCoordinates(latlng);
        
        // Add dragend event to update coordinates when marker is dragged
        reportMarker.on('dragend', function(e) {
            updateCoordinates(e.target.getLatLng());
            
            // Try to get address from coordinates (reverse geocoding)
            reverseGeocode(e.target.getLatLng());
            
            showMapNotification('Marker position updated', 'info');
        });
        
        // Show success notification
        showMapNotification('Location marker placed', 'success');
        
        // Try to get address from coordinates (reverse geocoding)
        reverseGeocode(latlng);
    } catch (error) {
        console.error('Error setting map marker:', error);
        showMapNotification('Error placing marker', 'error');
    }
}

// Reverse geocode to get address from coordinates
function reverseGeocode(latlng) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&zoom=18&addressdetails=1`;
        
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.display_name) {
                    const addressField = document.getElementById('address');
                    if (addressField) {
                        addressField.value = data.display_name;
                    }
                }
            })
            .catch(error => {
                console.error('Error reverse geocoding:', error);
            });
    } catch (error) {
        console.error('Error initiating reverse geocoding:', error);
    }
}

// Update marker appearance based on theme
function updateMarkerAppearance() {
    if (!reportMarker) return;
    
    try {
        const isDarkTheme = document.body.classList.contains('dark-theme');
        
        // Get the marker element
        const markerElement = reportMarker.getElement();
        if (markerElement) {
            const markerPin = markerElement.querySelector('.marker-pin');
            if (markerPin) {
                // Apply theme-specific styling if needed
                // This can be extended if more styling is required
            }
        }
    } catch (error) {
        console.error('Error updating marker appearance:', error);
    }
}

// Update coordinates in form fields
function updateCoordinates(latlng) {
    try {
        const latField = document.getElementById('latitude');
        const lngField = document.getElementById('longitude');
        
        if (latField && lngField) {
            latField.value = latlng.lat.toFixed(6);
            lngField.value = latlng.lng.toFixed(6);
        }
    } catch (error) {
        console.error('Error updating coordinates:', error);
    }
}

// Show notification on the map
function showMapNotification(message, type = 'info') {
    const mapContainer = document.getElementById('location-map');
    if (!mapContainer) return;
    
    try {
        // Check if notification already exists and remove it
        let notification = mapContainer.querySelector('.map-notification');
        if (notification) {
            notification.remove();
        }
        
        // Create new notification
        notification = document.createElement('div');
        notification.className = `map-notification map-notification-${type}`;
        
        // Set icon based on type
        let icon;
        switch(type) {
            case 'success':
                icon = 'check-circle';
                break;
            case 'error':
                icon = 'exclamation-circle';
                break;
            case 'warning':
                icon = 'exclamation-triangle';
                break;
            default:
                icon = 'info-circle';
        }
        
        notification.innerHTML = `<i class="fas fa-${icon}"></i>${message}`;
        
        // Add to map container
        mapContainer.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Auto remove after delay
        setTimeout(() => {
            if (notification) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification && notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
    } catch (error) {
        console.error('Error showing map notification:', error);
    }
}

// Search for address and update map
function searchAddress(address) {
    if (!reportMap || !address) return;
    
    // Show loading indication
    const searchBtn = document.getElementById('search-location-btn');
    const addressInput = document.getElementById('address');
    
    if (searchBtn) {
        const originalText = searchBtn.innerHTML;
        searchBtn.disabled = true;
        searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        
        // Reset after 10 seconds in case of timeout
        const resetTimeout = setTimeout(() => {
            searchBtn.disabled = false;
            searchBtn.innerHTML = originalText;
        }, 10000);
        
        // Use Nominatim directly for more reliable results
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`)
            .then(response => response.json())
            .then(data => {
                clearTimeout(resetTimeout);
                searchBtn.disabled = false;
                searchBtn.innerHTML = originalText;
                
                if (data && data.length > 0) {
                    const result = data[0];
                    const latlng = L.latLng(parseFloat(result.lat), parseFloat(result.lon));
                    
                    // Center map on result
                    reportMap.setView(latlng, 15);
                    
                    // Set marker
                    setMapMarker(latlng);
                    
                    // Update address input
                    if (addressInput && result.display_name) {
                        addressInput.value = result.display_name;
                    }
                    
                    // Add address details
                    const addressField = document.getElementById('manual-address');
                    if (addressField && result.display_name) {
                        addressField.value = result.display_name;
                    }
                    
                    // Show success notification
                    showMapNotification(`Location found: ${result.display_name.split(',')[0]}`, 'success');
                } else {
                    // Show error notification
                    showMapNotification('No results found for this address. Try a different search term.', 'error');
                }
            })
            .catch(error => {
                console.error('Error searching for address:', error);
                
                clearTimeout(resetTimeout);
                searchBtn.disabled = false;
                searchBtn.innerHTML = originalText;
                
                showMapNotification('Error searching for this address. Please try again later.', 'error');
            });
    }
}

// Update address field with geocoder result details
function updateAddressField(result) {
    const addressField = document.getElementById('manual-address');
    if (!addressField || !result) return;
    
    // Format detailed address from result properties
    let formattedAddress = '';
    
    if (result.name) {
        formattedAddress += result.name;
    }
    
    if (result.properties) {
        const props = result.properties;
        
        if (props.address) {
            const address = props.address;
            
            const addressParts = [];
            
            if (address.house_number) addressParts.push(address.house_number);
            if (address.road) addressParts.push(address.road);
            if (address.neighbourhood) addressParts.push(address.neighbourhood);
            if (address.suburb) addressParts.push(address.suburb);
            if (address.city || address.town || address.village) {
                addressParts.push(address.city || address.town || address.village);
            }
            if (address.county) addressParts.push(address.county);
            if (address.state) addressParts.push(address.state);
            if (address.postcode) addressParts.push(address.postcode);
            if (address.country) addressParts.push(address.country);
            
            if (addressParts.length > 0) {
                formattedAddress = addressParts.join(', ');
            }
        }
    }
    
    // If we have a good formatted address, use it
    if (formattedAddress) {
        addressField.value = formattedAddress;
    } 
    // Otherwise, use the display name if available
    else if (result.name) {
        addressField.value = result.name;
    }
} 