const appState = {
    currentUser: null,
    isLoggedIn: false,
    uploads: [],
    userProfile: { bio: '', location: '', website: '' }
};

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('error');

    errorDiv.classList.add('d-none');

    if (validateCredentials(username, password)) {
        appState.currentUser = username;
        appState.isLoggedIn = true;
        transitionToHome();
    } else {
        errorDiv.classList.remove('d-none');
        errorDiv.innerHTML = '<strong>Error:</strong> Invalid credentials';
        document.getElementById('password').value = '';
    }
}

function validateCredentials(username, password) {
    return username === '@Saraxc' && password === '@Anuradha99';
}

function transitionToHome() {
    const loginPage = document.getElementById('loginPage');
    const homePage = document.getElementById('homePage');
    
    loginPage.style.display = 'none';
    homePage.style.display = 'block';
    updateProfileDisplay();
}

function navigateTo(page) {
    document.querySelectorAll('.page-section').forEach(s => s.style.display = 'none');
    const section = document.getElementById(page + 'Section');
    if (section) section.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function handleUpload(event) {
    event.preventDefault();
    const title = document.getElementById('fileTitle').value;
    const file = document.getElementById('fileInput').files[0];
    const statusDiv = document.getElementById('uploadStatus');

    if (!title || !file) {
        statusDiv.innerHTML = '<div class="alert alert-danger">Please fill all fields</div>';
        return;
    }

    statusDiv.innerHTML = '<div class="alert alert-info">Uploading...</div>';

    setTimeout(() => {
        appState.uploads.push({ title, fileName: file.name, date: new Date().toLocaleString() });
        statusDiv.innerHTML = '<div class="alert alert-success">✓ Uploaded successfully!</div>';
        document.getElementById('uploadForm').reset();
        setTimeout(() => statusDiv.innerHTML = '', 3000);
    }, 1500);
}

function handleProfileUpdate(event) {
    event.preventDefault();
    
    appState.userProfile = {
        bio: document.getElementById('bio').value,
        location: document.getElementById('location').value,
        website: document.getElementById('website').value
    };

    const statusDiv = document.getElementById('profileStatus');
    statusDiv.innerHTML = '<div class="alert alert-success">✓ Profile updated!</div>';
    setTimeout(() => statusDiv.innerHTML = '', 3000);
}

function updateProfileDisplay() {
    const user = appState.currentUser || 'User';
    document.getElementById('profileUsername').textContent = user;
    document.getElementById('profileEmail').textContent = user.toLowerCase() + '@sara.xc';
}

function logout() {
    if (confirm('Logout?')) {
        appState.isLoggedIn = false;
        document.getElementById('homePage').style.display = 'none';
        document.getElementById('loginPage').style.display = 'block';
        document.getElementById('loginForm').reset();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('✓ Sara.xc loaded');
});
