document.addEventListener('DOMContentLoaded', function() {
    // Initialize form elements
    initFormSections();
    initFileUpload();
    setupFormValidation();
    setupFormSubmission();
});

// Initialize multi-step form sections
function initFormSections() {
    const formSections = document.querySelectorAll('.form-section');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressBar = document.querySelector('.progress-inner');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    
    // Set the first section as active initially
    if (formSections.length > 0 && !document.querySelector('.form-section.active')) {
        formSections[0].classList.add('active');
    }
    
    // Handle next button clicks
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentSection = document.querySelector('.form-section.active');
            const currentStep = parseInt(currentSection.dataset.step);
            
            // Validate the current section before proceeding
            if (!validateSection(currentSection)) {
                showNotification('Please fill all required fields correctly before proceeding.', 'error');
                return;
            }
            
            // Move to the next step
            const nextStep = currentStep + 1;
            
            if (nextStep <= formSections.length) {
                // Animate transition
                currentSection.classList.add('slide-out');
                
                setTimeout(() => {
                    // Hide current section
                    currentSection.classList.remove('active', 'slide-out');
                    
                    // Show next section
                    const nextSection = document.querySelector(`.form-section[data-step="${nextStep}"]`);
                    nextSection.classList.add('active', 'slide-in');
                    
                    // Update progress bar and indicators
                    updateProgress(nextStep, formSections.length);
                    
                    // Scroll to top of form
                    scrollToFormTop();
                    
                    setTimeout(() => {
                        nextSection.classList.remove('slide-in');
                    }, 300);
                }, 300);
            }
        });
    });
    
    // Handle previous button clicks
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            const currentSection = document.querySelector('.form-section.active');
            const currentStep = parseInt(currentSection.dataset.step);
            
            // Move to previous step
            const prevStep = currentStep - 1;
            
            if (prevStep > 0) {
                // Animate transition
                currentSection.classList.add('slide-out-right');
                
                setTimeout(() => {
                    // Hide current section
                    currentSection.classList.remove('active', 'slide-out-right');
                    
                    // Show previous section
                    const prevSection = document.querySelector(`.form-section[data-step="${prevStep}"]`);
                    prevSection.classList.add('active', 'slide-in-left');
                    
                    // Update progress bar and indicators
                    updateProgress(prevStep, formSections.length);
                    
                    // Scroll to top of form
                    scrollToFormTop();
                    
                    setTimeout(() => {
                        prevSection.classList.remove('slide-in-left');
                    }, 300);
                }, 300);
            }
        });
    });
    
    // Set up progress step indicators click
    progressSteps.forEach(step => {
        step.addEventListener('click', function() {
            const targetStep = parseInt(this.dataset.step);
            const currentSection = document.querySelector('.form-section.active');
            const currentStep = parseInt(currentSection.dataset.step);
            
            // Only allow moving to previous steps or the current step
            if (targetStep <= currentStep) {
                // Determine direction for animation
                const direction = targetStep < currentStep ? 'right' : 'left';
                
                // Animate transition
                currentSection.classList.add(`slide-out-${direction}`);
                
                setTimeout(() => {
                    // Hide current section
                    currentSection.classList.remove('active', `slide-out-${direction}`);
                    
                    // Show target section
                    const targetSection = document.querySelector(`.form-section[data-step="${targetStep}"]`);
                    targetSection.classList.add('active', `slide-in-${direction === 'right' ? 'left' : 'right'}`);
                    
                    // Update progress bar and indicators
                    updateProgress(targetStep, formSections.length);
                    
                    // Scroll to top of form
                    scrollToFormTop();
                    
                    setTimeout(() => {
                        targetSection.classList.remove(`slide-in-${direction === 'right' ? 'left' : 'right'}`);
                    }, 300);
                }, 300);
            }
        });
    });
}

// Update progress indicators
function updateProgress(currentStep, totalSteps) {
    const progressBar = document.querySelector('.progress-inner');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    // Update progress bar with animation
    const progressPercentage = (currentStep / totalSteps) * 100;
    
    // Animate progress bar
    const currentWidth = parseFloat(progressBar.style.width) || 0;
    animateProgressBar(currentWidth, progressPercentage);
    
    // Update step indicators
    progressSteps.forEach(step => {
        const stepNumber = parseInt(step.dataset.step);
        if (stepNumber < currentStep) {
            step.classList.add('completed');
            step.classList.add('active');
        } else if (stepNumber === currentStep) {
            step.classList.remove('completed');
            step.classList.add('active');
        } else {
            step.classList.remove('completed');
            step.classList.remove('active');
        }
    });
}

// Animate progress bar
function animateProgressBar(from, to) {
    const progressBar = document.querySelector('.progress-inner');
    const duration = 300;
    const start = performance.now();
    
    requestAnimationFrame(function animate(time) {
        const elapsed = time - start;
        const progress = Math.min(elapsed / duration, 1);
        const value = from + (to - from) * progress;
        
        progressBar.style.width = `${value}%`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    });
}

// Validate form section
function validateSection(section) {
    let isValid = true;
    const requiredFields = section.querySelectorAll('[required]');
    let firstInvalidField = null;
    
    requiredFields.forEach(field => {
        // Reset previous validation state
        field.classList.remove('invalid');
        
        // Remove any existing error message
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
        
        let fieldValid = true;
        let errorMessage = '';
        
        if (field.type === 'checkbox' && !field.checked) {
            fieldValid = false;
            errorMessage = 'This confirmation is required';
        } else if (field.tagName === 'SELECT' && (!field.value || field.value === '')) {
            fieldValid = false;
            errorMessage = 'Please select an option';
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            fieldValid = false;
            errorMessage = 'Please enter a valid email address';
        } else if (field.value.trim() === '') {
            fieldValid = false;
            errorMessage = 'This field is required';
        }
        
        if (!fieldValid) {
            field.classList.add('invalid');
            isValid = false;
            
            // Create error message
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            errorElement.textContent = errorMessage;
            
            // Insert after the field or its label
            field.parentElement.appendChild(errorElement);
            
            // Store the first invalid field to focus on it
            if (!firstInvalidField) {
                firstInvalidField = field;
            }
        }
        
        // Add input event listener to clear invalid state when user corrects the input
        field.addEventListener('input', function() {
            const errorMsg = field.parentElement.querySelector('.field-error');
            
            if ((field.type === 'checkbox' && field.checked) || 
                (field.tagName === 'SELECT' && field.value !== '') ||
                (field.type === 'email' && isValidEmail(field.value)) ||
                (field.value.trim() !== '')) {
                field.classList.remove('invalid');
                if (errorMsg) errorMsg.remove();
            }
        });
    });
    
    if (firstInvalidField) {
        firstInvalidField.focus();
    }
    
    return isValid;
}

// Email validation helper
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification message
function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let notificationContainer = document.querySelector('.form-notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'form-notification-container';
        document.querySelector('.report-form').appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    
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
    
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas fa-${icon}"></i>
        </div>
        <div class="notification-content">
            <p>${message}</p>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add close button functionality
    notification.querySelector('.notification-close').addEventListener('click', function() {
        notification.classList.add('notification-hiding');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Add to container
    notificationContainer.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('notification-visible');
    }, 10);
    
    // Auto remove after delay for non-error messages
    if (type !== 'error') {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('notification-hiding');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Scroll to top of form
function scrollToFormTop() {
    const formContainer = document.querySelector('.report-form');
    const formContainerTop = formContainer.offsetTop - 50; // Add some offset
    
    window.scrollTo({
        top: formContainerTop,
        behavior: 'smooth'
    });
}

// Handle file uploads and previews
function initFileUpload() {
    const fileInput = document.getElementById('evidence');
    const filePreviewContainer = document.getElementById('file-preview');
    
    if (fileInput && filePreviewContainer) {
        fileInput.addEventListener('change', function(e) {
            updateFilePreview(fileInput.files);
        });
        
        // Add drag and drop support
        const fileUploadArea = document.querySelector('.file-upload');
        
        if (fileUploadArea) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                fileUploadArea.addEventListener(eventName, preventDefaults, false);
            });
            
            function preventDefaults(e) {
                e.preventDefault();
                e.stopPropagation();
            }
            
            ['dragenter', 'dragover'].forEach(eventName => {
                fileUploadArea.addEventListener(eventName, highlight, false);
            });
            
            ['dragleave', 'drop'].forEach(eventName => {
                fileUploadArea.addEventListener(eventName, unhighlight, false);
            });
            
            function highlight() {
                fileUploadArea.classList.add('highlight');
            }
            
            function unhighlight() {
                fileUploadArea.classList.remove('highlight');
            }
            
            fileUploadArea.addEventListener('drop', handleDrop, false);
            
            function handleDrop(e) {
                const dt = e.dataTransfer;
                const files = dt.files;
                
                fileInput.files = files;
                updateFilePreview(files);
            }
        }
    }
}

// Create file card with format focus, no filename display
function createFileCard(file, fileId) {
    // Create file card
    const fileCard = document.createElement('div');
    fileCard.className = 'file-card';
    fileCard.dataset.fileId = fileId;
    
    // Create file preview element based on file type
    const filePreviewElement = document.createElement('div');
    filePreviewElement.className = 'file-preview';
    
    if (file.type.startsWith('image/')) {
        // Create image preview
        const imagePreview = document.createElement('div');
        imagePreview.className = 'image-preview';
        
        const img = document.createElement('img');
        const reader = new FileReader();
        
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
        imagePreview.appendChild(img);
        filePreviewElement.appendChild(imagePreview);
        
        // Add click to view full image
        filePreviewElement.addEventListener('click', (e) => {
            openMediaPreview(file, 'image');
        });
        
        // Add touch event for mobile
        filePreviewElement.addEventListener('touchend', (e) => {
            if (!e.isDefaultPrevented()) {
                e.preventDefault();
                openMediaPreview(file, 'image');
            }
        }, false);
    } else if (file.type.startsWith('video/')) {
        // Create video preview
        const videoPreview = document.createElement('div');
        videoPreview.className = 'video-preview';
        
        const videoIcon = document.createElement('i');
        videoIcon.className = 'fas fa-play-circle fa-3x';
        videoIcon.style.color = 'rgba(255,255,255,0.8)';
        videoPreview.appendChild(videoIcon);
        
        filePreviewElement.appendChild(videoPreview);
        
        // Add click to play video
        filePreviewElement.addEventListener('click', () => {
            openMediaPreview(file, 'video');
        });
        
        // Add touch event for mobile
        filePreviewElement.addEventListener('touchend', (e) => {
            if (!e.isDefaultPrevented()) {
                e.preventDefault();
                openMediaPreview(file, 'video');
            }
        }, false);
    }
    
    // Create file controls - always visible
    const fileControls = document.createElement('div');
    fileControls.className = 'file-controls';
    
    // View button with improved touch target
    const viewBtn = document.createElement('button');
    viewBtn.className = 'view-file';
    viewBtn.type = 'button';
    viewBtn.innerHTML = '<i class="fas fa-eye"></i>';
    viewBtn.title = 'View file';
    viewBtn.setAttribute('aria-label', 'View file');
    viewBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (file.type.startsWith('image/')) {
            openMediaPreview(file, 'image');
        } else if (file.type.startsWith('video/')) {
            openMediaPreview(file, 'video');
        }
    });
    
    // Add touch event for mobile
    viewBtn.addEventListener('touchend', (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (file.type.startsWith('image/')) {
            openMediaPreview(file, 'image');
        } else if (file.type.startsWith('video/')) {
            openMediaPreview(file, 'video');
        }
    }, false);
    
    // Remove button with improved touch target
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-file';
    removeBtn.type = 'button';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.title = 'Remove file';
    removeBtn.setAttribute('aria-label', 'Remove file');
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        removeFile(fileId);
    });
    
    // Add touch event for mobile
    removeBtn.addEventListener('touchend', (e) => {
        e.stopPropagation();
        e.preventDefault();
        removeFile(fileId);
    }, false);
    
    // Add type badge with format focus
    const typeBadge = document.createElement('div');
    typeBadge.className = 'file-type-badge';
    
    if (file.type.startsWith('image/')) {
        const format = file.type.split('/')[1].toUpperCase();
        typeBadge.textContent = format;
    } else if (file.type.startsWith('video/')) {
        const format = file.type.split('/')[1].toUpperCase();
        typeBadge.textContent = format;
    } else {
        typeBadge.textContent = 'FILE';
    }
    
    fileControls.appendChild(viewBtn);
    fileControls.appendChild(removeBtn);
    
    // Assemble file card
    fileCard.appendChild(filePreviewElement);
    fileCard.appendChild(fileControls);
    fileCard.appendChild(typeBadge);
    
    return fileCard;
}

// Update file preview with gallery style and add preview icons
function updateFilePreview(files) {
    const filePreview = document.getElementById('file-preview');
    if (!filePreview) return;
    
    // Set maximum number of allowed files
    const MAX_FILES = 5;
    
    // Clear previous preview if first upload
    if (!filePreview.classList.contains('file-gallery')) {
        filePreview.innerHTML = '';
        filePreview.classList.add('file-gallery');
        
        // Create gallery header
        const galleryHeader = document.createElement('div');
        galleryHeader.className = 'gallery-header';
        
        const fileCount = document.createElement('div');
        fileCount.className = 'file-count';
        fileCount.innerHTML = `<i class="fas fa-images"></i> <span id="file-count-number">0</span> / ${MAX_FILES} files`;
        
        const clearAllBtn = document.createElement('button');
        clearAllBtn.className = 'clear-all-btn';
        clearAllBtn.type = 'button';
        clearAllBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Clear All';
        clearAllBtn.addEventListener('click', clearAllFiles);
        
        galleryHeader.appendChild(fileCount);
        galleryHeader.appendChild(clearAllBtn);
        filePreview.appendChild(galleryHeader);
        
        // Create file limit reminder text
        const limitReminder = document.createElement('div');
        limitReminder.className = 'file-limit-reminder';
        limitReminder.innerHTML = `<i class="fas fa-info-circle"></i> You can upload up to ${MAX_FILES} evidence files (images or videos).`;
        filePreview.appendChild(limitReminder);
        
        // Create gallery grid
        const galleryGrid = document.createElement('div');
        galleryGrid.className = 'gallery-grid';
        filePreview.appendChild(galleryGrid);
        
        // Create empty state initially
        createEmptyState(galleryGrid);
    }
    
    const galleryGrid = filePreview.querySelector('.gallery-grid');
    const fileCountElement = document.getElementById('file-count-number');
    
    // Get current file count
    const currentFileCount = galleryGrid.querySelectorAll('.file-card').length;
    
    // Remove empty state if it exists and we're adding files
    if (files.length > 0) {
        const emptyState = galleryGrid.querySelector('.gallery-empty-state');
        if (emptyState) {
            emptyState.remove();
        }
    }
    
    // Check if adding more files would exceed the limit
    if (currentFileCount + files.length > MAX_FILES) {
        showNotification(`You can only upload up to ${MAX_FILES} files. Please remove some files first.`, 'warning');
        
        // Only add files up to the limit
        const remainingSlots = MAX_FILES - currentFileCount;
        if (remainingSlots <= 0) return;
        
        // Create a new FileList with only the files we can add
        const newFiles = Array.from(files).slice(0, remainingSlots);
        files = createNewFileList(newFiles);
    }
    
    // Add new files to the gallery
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Skip if file type isn't supported
        if (!isFileTypeSupported(file.type)) {
            showNotification(`File type "${file.type}" is not supported. Please upload images or videos only.`, 'error');
            continue;
        }
        
        // Create a unique file ID using timestamp and random number
        const fileId = `file-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        file.fileId = fileId;
        
        // Create and add file card using the helper function
        const fileCard = createFileCard(file, fileId);
            galleryGrid.appendChild(fileCard);
    }
    
    // Update file count
    const updatedFileCount = galleryGrid.querySelectorAll('.file-card').length;
    fileCountElement.textContent = updatedFileCount;
    
    // Show/hide clear all button
    const clearAllBtn = filePreview.querySelector('.clear-all-btn');
    clearAllBtn.style.display = updatedFileCount > 0 ? 'flex' : 'none';
    
    // Show gallery if there are files
    filePreview.style.display = updatedFileCount > 0 ? 'block' : 'none';
    
    // Update limit reminder color based on count
    const limitReminder = filePreview.querySelector('.file-limit-reminder');
    if (limitReminder) {
        if (updatedFileCount >= MAX_FILES) {
            limitReminder.classList.add('limit-reached');
            limitReminder.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Maximum limit of ${MAX_FILES} files reached. Remove files to add more.`;
                } else {
            limitReminder.classList.remove('limit-reached');
            limitReminder.innerHTML = `<i class="fas fa-info-circle"></i> You can upload up to ${MAX_FILES} evidence files (images or videos).`;
        }
    }
    
    // Show empty state if no files are present
    if (updatedFileCount === 0) {
        createEmptyState(galleryGrid);
    }
}

// Create empty state for the gallery
function createEmptyState(galleryGrid) {
    const emptyState = document.createElement('div');
    emptyState.className = 'gallery-empty-state';
    
    emptyState.innerHTML = `
        <i class="fas fa-images"></i>
        <p>No files uploaded yet</p>
        <div class="empty-hint">Upload evidence files that can help identify the incident</div>
    `;
    
    galleryGrid.appendChild(emptyState);
}

// Check if file type is supported
function isFileTypeSupported(fileType) {
    const supportedTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
        'video/mp4', 'video/webm', 'video/quicktime'
    ];
    
    return supportedTypes.includes(fileType);
}

// Remove file from input and preview
function removeFile(fileId) {
    // Find and remove file card
    const fileCard = document.querySelector(`.file-card[data-file-id="${fileId}"]`);
    if (!fileCard) return;
    
    // Add removal animation
    fileCard.classList.add('removing');
    
    // Remove after animation
    setTimeout(() => {
        fileCard.remove();
        
        // Update file count
        const fileCountElement = document.getElementById('file-count-number');
        const galleryGrid = document.querySelector('.gallery-grid');
        const currentFileCount = galleryGrid.querySelectorAll('.file-card').length;
        
        fileCountElement.textContent = currentFileCount;
        
        // Update input file list
        updateFileInputList(fileId);
        
        // Hide gallery if empty
        const filePreview = document.getElementById('file-preview');
        if (currentFileCount === 0 && filePreview) {
            filePreview.style.display = 'none';
        }
        
        // Update clear all button visibility
        const clearAllBtn = document.querySelector('.clear-all-btn');
        if (clearAllBtn) {
            clearAllBtn.style.display = currentFileCount > 0 ? 'flex' : 'none';
        }
    }, 300);
}

// Clear all files
function clearAllFiles() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    // Get all file cards
    const fileCards = galleryGrid.querySelectorAll('.file-card');
    if (fileCards.length === 0) return;
    
    // Show confirmation modal before clearing
    if (!confirm('Are you sure you want to remove all uploaded files?')) {
        return;
    }
    
    // Animate all cards for removal
    fileCards.forEach(card => {
        card.classList.add('removing');
    });
    
    // Remove all after animation
    setTimeout(() => {
        // Clear the file input
        const fileInput = document.getElementById('evidence');
        if (fileInput) {
            fileInput.value = '';
        }
        
        // Clear the preview
        galleryGrid.innerHTML = '';
        
        // Create empty state
        createEmptyState(galleryGrid);
        
        // Update file count
        const fileCountElement = document.getElementById('file-count-number');
        if (fileCountElement) {
            fileCountElement.textContent = '0';
        }
        
        // Update limit reminder status
        const limitReminder = document.querySelector('.file-limit-reminder');
        if (limitReminder) {
            limitReminder.classList.remove('limit-reached');
            limitReminder.innerHTML = `<i class="fas fa-info-circle"></i> You can upload up to 5 evidence files (images or videos).`;
        }
        
        // Show gallery - don't hide it so empty state remains visible
        const filePreview = document.getElementById('file-preview');
        if (filePreview) {
            filePreview.style.display = 'block';
        }
        
        // Hide clear all button
        const clearAllBtn = document.querySelector('.clear-all-btn');
        if (clearAllBtn) {
            clearAllBtn.style.display = 'none';
        }
        
        // Show success notification
        showNotification('All files have been removed', 'info');
    }, 300);
}

// Update file input list by removing file
function updateFileInputList(fileIdToRemove) {
    const fileInput = document.getElementById('evidence');
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) return;
    
    // Create a new FileList
    const newFileList = createNewFileList(
        Array.from(fileInput.files).filter(file => file.fileId !== fileIdToRemove)
    );
    
    // Replace the input's files with the new list
    updateFileInput(fileInput, newFileList);
}

// Create a new FileList (simulated)
function createNewFileList(files) {
    const dataTransfer = new DataTransfer();
    files.forEach(file => {
        dataTransfer.items.add(file);
    });
    return dataTransfer.files;
}

// Update file input with new file list
function updateFileInput(input, fileList) {
    try {
        // In modern browsers, we can set files directly
        if ('files' in input) {
            input.files = fileList;
        }
    } catch (error) {
        console.error('Error updating file list:', error);
        // Show notification that there was an issue
        showNotification('There was an issue updating the selected files. Please try again.', 'warning');
    }
}

// Open media preview modal with improved styling
function openMediaPreview(file, type) {
    // Create modal if it doesn't exist
    let modal = document.querySelector('.media-preview-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.className = 'media-preview-modal';
        document.body.appendChild(modal);
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeMediaPreview();
            }
        });
    }
    
    // Create modal content
    modal.innerHTML = `
        <div class="preview-modal-content">
            <div class="preview-header">
                <h3>${file.name}</h3>
                <button class="close-preview" title="Close preview">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="preview-body">
                ${type === 'image' 
                    ? '<div class="preview-image"><img src="" alt="Preview"></div>' 
                    : '<div class="preview-video"><video controls></video></div>'}
            </div>
            <div class="preview-footer">
                <span>${formatFileSize(file.size)}</span>
            </div>
        </div>
    `;
    
    // Add media source
    if (type === 'image') {
        const img = modal.querySelector('.preview-image img');
        const reader = new FileReader();
        
        reader.onload = (e) => {
            img.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    } else if (type === 'video') {
        const video = modal.querySelector('.preview-video video');
        const reader = new FileReader();
        
        reader.onload = (e) => {
            video.src = e.target.result;
        };
        
        reader.readAsDataURL(file);
    }
    
    // Add close button event
    const closeBtn = modal.querySelector('.close-preview');
    closeBtn.addEventListener('click', closeMediaPreview);
    
    // Show modal after a slight delay to ensure content is loaded
        setTimeout(() => {
        modal.classList.add('show');
    }, 50);
    
    // Add escape key handler
    document.addEventListener('keydown', handleEscapeKey);
}

// Close media preview
function closeMediaPreview() {
    const modal = document.querySelector('.media-preview-modal');
    if (!modal) return;
    
    modal.classList.remove('show');
    
    // Remove after animation
            setTimeout(() => {
        modal.remove();
            }, 300);
    
    // Remove escape key handler
    document.removeEventListener('keydown', handleEscapeKey);
}

// Handle escape key press
function handleEscapeKey(e) {
    if (e.key === 'Escape') {
        closeMediaPreview();
    }
}

// Helper function to truncate filename
function truncateFilename(filename, maxLength) {
    // Use a shorter length on mobile devices
    const effectiveMaxLength = isMobileDevice() ? Math.min(maxLength, 15) : maxLength;
    
    if (filename.length <= effectiveMaxLength) return filename;
    
    const extension = filename.split('.').pop();
    const name = filename.substring(0, filename.length - extension.length - 1);
    
    const truncatedName = name.substring(0, effectiveMaxLength - extension.length - 3) + '...';
    return truncatedName + '.' + extension;
}

// Helper function to format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    // On mobile, show abbreviated units
    const isSmallScreen = window.innerWidth < 768;
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to check if device is mobile
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
}

// Form validation setup
function setupFormValidation() {
    const crimeReportForm = document.getElementById('crime-report-form');
    
    if (crimeReportForm) {
        // Add input validation on blur
        const allInputs = crimeReportForm.querySelectorAll('input, select, textarea');
        
        allInputs.forEach(field => {
            field.addEventListener('blur', function() {
                // Skip validation for non-required fields
                if (!field.hasAttribute('required')) return;
                
                // Remove existing error
                field.classList.remove('invalid');
                const existingError = field.parentElement.querySelector('.field-error');
                if (existingError) existingError.remove();
                
                let isValid = true;
                let errorMessage = '';
                
                if (field.type === 'checkbox' && !field.checked) {
                    isValid = false;
                    errorMessage = 'This confirmation is required';
                } else if (field.tagName === 'SELECT' && (!field.value || field.value === '')) {
                    isValid = false;
                    errorMessage = 'Please select an option';
                } else if (field.type === 'email' && !isValidEmail(field.value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                } else if (field.value.trim() === '') {
                    isValid = false;
                    errorMessage = 'This field is required';
                }
                
                if (!isValid) {
                    field.classList.add('invalid');
                    
                    // Create error message
                    const errorElement = document.createElement('div');
                    errorElement.className = 'field-error';
                    errorElement.textContent = errorMessage;
                    
                    // Insert after the field or its label
                    field.parentElement.appendChild(errorElement);
                }
            });
        });
        
        // Add conditional display for "other" crime type field
        const crimeTypeSelect = document.getElementById('crimeType');
        const otherCrimeField = document.getElementById('otherCrimeType');
        
        if (crimeTypeSelect && otherCrimeField) {
            const otherCrimeFieldContainer = otherCrimeField.closest('.form-group');
            
            // Initially hide the "other" field if not needed
            if (crimeTypeSelect.value !== 'other') {
                otherCrimeFieldContainer.style.display = 'none';
            }
            
            crimeTypeSelect.addEventListener('change', function() {
                if (this.value === 'other') {
                    otherCrimeFieldContainer.style.display = 'block';
                    otherCrimeField.setAttribute('required', 'required');
                } else {
                    otherCrimeFieldContainer.style.display = 'none';
                    otherCrimeField.removeAttribute('required');
                }
            });
        }
    }
}

// Form submission handler
function setupFormSubmission() {
    const crimeReportForm = document.getElementById('crime-report-form');
    const formSubmissionModal = document.getElementById('form-submission-modal');
    
    if (crimeReportForm && formSubmissionModal) {
        crimeReportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Check for confirmation checkbox first
            const confirmCheckbox = document.getElementById('confirm');
            if (confirmCheckbox && !confirmCheckbox.checked) {
                showNotification('Please confirm that the information provided is true and accurate before submitting.', 'error');
                
                // Highlight the checkbox with a pulse animation
                const checkboxContainer = confirmCheckbox.closest('.checkbox-group');
                checkboxContainer.classList.add('pulse-attention');
                
                // Remove the animation class after it completes
                setTimeout(() => {
                    checkboxContainer.classList.remove('pulse-attention');
                }, 2000);
                
                // Scroll to the checkbox
                confirmCheckbox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
            
            // Validate all sections before submitting
            const allSections = document.querySelectorAll('.form-section');
            let isValid = true;
            let firstInvalidSection = null;
            
            allSections.forEach(section => {
                if (!validateSection(section) && !firstInvalidSection) {
                    firstInvalidSection = section;
                    isValid = false;
                }
            });
            
            if (!isValid) {
                showNotification('Please fill all required fields correctly before submitting.', 'error');
                
                // Show the first section with invalid fields
                if (firstInvalidSection) {
                    const currentSection = document.querySelector('.form-section.active');
                    
                    if (currentSection !== firstInvalidSection) {
                        // Animate transition
                        currentSection.classList.add('slide-out');
                        
                        setTimeout(() => {
                            // Hide current section
                            currentSection.classList.remove('active', 'slide-out');
                            
                            // Show section with errors
                            firstInvalidSection.classList.add('active', 'slide-in');
                            
                            // Update progress
                            const step = parseInt(firstInvalidSection.dataset.step);
                            updateProgress(step, allSections.length);
                            
                            // Scroll to form top
                            scrollToFormTop();
                            
                            setTimeout(() => {
                                firstInvalidSection.classList.remove('slide-in');
                            }, 300);
                        }, 300);
                    }
                }
                
                return;
            }
            
            // Show loading state
            const submitButton = crimeReportForm.querySelector('.btn-submit');
            const originalButtonContent = submitButton.innerHTML;
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
            
            // Collect form data
            const formData = new FormData(crimeReportForm);
            
            // Simulate AJAX form submission
            setTimeout(() => {
                // Generate random reference number
                const refNumberElement = document.getElementById('reference-number');
                const refNumber = 'CR-' + Math.floor(100000 + Math.random() * 900000);
                refNumberElement.textContent = refNumber;
                
                // Set up copy button functionality
                setupCopyReferenceButton();
                
                // Add success animation to modal
                formSubmissionModal.classList.add('success-animation');
                
                // Show success modal with animation
                formSubmissionModal.classList.add('show');
                
                // Reset form and UI state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonContent;
                
                // Handle modal close
                const closeModalBtns = formSubmissionModal.querySelectorAll('.close-modal, .close-btn');
                closeModalBtns.forEach(btn => {
                    btn.onclick = function() {
                        formSubmissionModal.classList.remove('show');
                        
                        // Optional: Reset form to first step when modal is closed
                        setTimeout(() => {
                            // Reset to first step
                        const currentSection = document.querySelector('.form-section.active');
                        currentSection.classList.remove('active');
                        
                        const firstSection = document.querySelector('.form-section[data-step="1"]');
                        firstSection.classList.add('active');
                        
                        updateProgress(1, allSections.length);
                        
                        // Reset form
                        crimeReportForm.reset();
                            
                        // Clear file preview
                            const filePreview = document.getElementById('file-preview');
                            if (filePreview) {
                                filePreview.innerHTML = '';
                                filePreview.classList.remove('file-gallery');
                            }
                            
                            // Remove modal success animation class
                            formSubmissionModal.classList.remove('success-animation');
                        }, 300);
                    };
                });
                
                // In a real application, this would send the data to a server
                console.log('Form submitted successfully. Data would be sent to the police admin panel.');
                
                // For demo only: Store the report in localStorage to simulate data persistence
                const reportData = {};
                for (const [key, value] of formData.entries()) {
                    reportData[key] = value;
                }
                
                reportData.referenceNumber = refNumber;
                reportData.timestamp = new Date().toISOString();
                reportData.status = 'pending';
                
                // Store report in localStorage
                try {
                    const existingReports = JSON.parse(localStorage.getItem('crimeReports') || '[]');
                    existingReports.push(reportData);
                    localStorage.setItem('crimeReports', JSON.stringify(existingReports));
                } catch (error) {
                    console.error('Error storing report data:', error);
                }
                
            }, 2000);
        });
    }
}

// Set up the copy reference button functionality
function setupCopyReferenceButton() {
    const copyBtn = document.getElementById('copy-reference');
    if (!copyBtn) return;
    
    copyBtn.onclick = function() {
        const refNumber = document.getElementById('reference-number').textContent;
        
        // Create a temporary input element to copy from
        const tempInput = document.createElement('input');
        tempInput.value = refNumber;
        document.body.appendChild(tempInput);
        tempInput.select();
        
        try {
            // Execute copy command
            document.execCommand('copy');
            
            // Show success state
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            copyBtn.classList.add('copied');
            
            // Reset after 2 seconds
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
                copyBtn.classList.remove('copied');
            }, 2000);
        } catch (err) {
            console.error('Copy failed:', err);
            
            // Show error state
            copyBtn.innerHTML = '<i class="fas fa-times"></i> Failed';
            copyBtn.classList.add('error');
            
            // Reset after 2 seconds
            setTimeout(() => {
                copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copy';
                copyBtn.classList.remove('error');
            }, 2000);
        }
        
        // Remove temp input
        document.body.removeChild(tempInput);
    };
} 