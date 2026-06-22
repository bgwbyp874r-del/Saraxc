/* ============================================
   APPLICATION STATE MANAGEMENT
   ============================================ */

const appState = {
    currentUser: null,
    isLoggedIn: false,
    uploads: [],
    userProfile: {
        bio: '',
        location: '',
        website: ''
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Sara.xc Application Initialized');
    loadUserProfile();
});

/* ============================================
   LOGIN FUNCTIONALITY
   ============================================ */

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    const errorDiv = document.getElementById('error');
    const loginBtn = document.getElementById('loginBtn');
    const loginSpinner = document.getElementById('loginSpinner');

    // Clear previous error
    errorDiv.classList.add('d-none');
    errorDiv.innerHTML = '';

    // Show loading state
    loginBtn.style.display = 'none';
    loginSpinner.style.display = 'inline-block';

    // Simulate API call delay
    setTimeout(() => {
        // Validate credentials
        if (validateCredentials(username, password)) {
            // Success
            appState.currentUser = username;
            appState.isLoggedIn = true;

            // Save remember me preference
            if (remember) {
                localStorage.setItem('rememberMe', 'true');
                localStorage.setItem('savedUsername', username);
            }

            // Show success message
            showAlert('Login successful! Welcome, ' + username, 'success');

            // Transition to home page
            setTimeout(() => {
                transitionToHome();
            }, 500);
        } else {
            // Error
            errorDiv.classList.remove('d-none');
            errorDiv.innerHTML = '<strong>Error:</strong> Invalid username or password. Please try again.';
            
            // Clear password field
            document.getElementById('password').value = '';
        }

        // Reset button state
        loginBtn.style.display = 'inline-block';
        loginSpinner.style.display = 'none';
    }, 800);
}

function validateCredentials(username, password) {
    // Demo credentials
    const validUsername = '@Saraxc';
    const validPassword = '@Anuradha99';

    return username === validUsername && password === validPassword;
}

function transitionToHome() {
    const loginPage = document.getElementById('loginPage');
    const homePage = document.getElementById('homePage');

    loginPage.style.opacity = '0';
    loginPage.style.transition = 'opacity 0.5s ease-out';

    setTimeout(() => {
        loginPage.style.display = 'none';
        homePage.style.display = 'block';
        homePage.style.opacity = '0';
        homePage.style.transition = 'opacity 0.5s ease-out';
        
        // Trigger reflow to apply animation
        void homePage.offsetWidth;
        homePage.style.opacity = '1';

        updateProfileDisplay();
    }, 300);
}

/* ============================================
   NAVIGATION FUNCTIONALITY
   ============================================ */

function navigateTo(page) {
    // Hide all sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Show selected section
    const targetSection = document.getElementById(page + 'Section');
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================
   UPLOAD FUNCTIONALITY
   ============================================ */

function handleUpload(event) {
    event.preventDefault();

    const title = document.getElementById('fileTitle').value.trim();
    const description = document.getElementById('fileDesc').value.trim();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const statusDiv = document.getElementById('uploadStatus');

    // Clear previous status
    statusDiv.innerHTML = '';

    // Validate
    if (!title || !file) {
        showAlert('Please fill in all required fields', 'danger', statusDiv);
        return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
        showAlert('File size exceeds 50MB limit', 'danger', statusDiv);
        return;
    }

    // Show loading
    showAlert('Uploading file...', 'info', statusDiv);

    // Simulate upload
    setTimeout(() => {
        const upload = {
            id: Date.now(),
            title: title,
            description: description,
            fileName: file.name,
            fileSize: formatFileSize(file.size),
            uploadDate: new Date().toLocaleString(),
            fileType: file.type
        };

        appState.uploads.push(upload);

        // Success
        showAlert('✓ File uploaded successfully!', 'success', statusDiv);

        // Reset form
        document.getElementById('uploadForm').reset();

        // Clear status after 3 seconds
        setTimeout(() => {
            statusDiv.innerHTML = '';
        }, 3000);

    }, 1500);
}

/* ============================================
   PROFILE FUNCTIONALITY
   ============================================ */

function updateProfileDisplay() {
    const username = appState.currentUser || 'User';
    // Update profile if needed
}

function loadUserProfile() {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
        appState.userProfile = JSON.parse(saved);
    }
}

/* ============================================
   LOGOUT FUNCTIONALITY
   ============================================ */

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        appState.isLoggedIn = false;
        appState.currentUser = null;

        // Clear login form
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        document.getElementById('remember').checked = false;

        // Reset page
        const loginPage = document.getElementById('loginPage');
        const homePage = document.getElementById('homePage');

        homePage.style.display = 'none';
        loginPage.style.display = 'block';
        loginPage.style.opacity = '1';

        showAlert('You have been logged out', 'info');
    }
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */

function showAlert(message, type = 'info', container = null) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = message;

    if (container) {
        container.innerHTML = '';
        container.appendChild(alertDiv);
    } else {
        // Create temporary alert
        const tempContainer = document.createElement('div');
        tempContainer.className = 'position-fixed top-0 end-0 p-3';
        tempContainer.style.zIndex = '9999';
        tempContainer.appendChild(alertDiv);
        document.body.appendChild(tempContainer);

        // Remove after 3 seconds
        setTimeout(() => {
            tempContainer.remove();
        }, 3000);
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/* ============================================
   LOCAL STORAGE HELPERS
   ============================================ */

function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
    }
}

console.log('✓ Application fully loaded and ready');