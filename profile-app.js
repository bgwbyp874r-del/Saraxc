// Profile App State
const profileState = {
    user: {
        name: 'User Name',
        username: '@username',
        email: 'user@sara.xc',
        bio: 'Bio goes here',
        location: '',
        website: '',
        phone: '',
        avatar: 'https://via.placeholder.com/150?text=User',
        joined: new Date().toLocaleDateString(),
        posts: 0,
        followers: 0,
        following: 0
    },
    settings: {
        publicProfile: true,
        allowMessages: true,
        emailNotif: true,
        pushNotif: true
    }
};

// Initialize Profile
document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
    attachEventListeners();
});

function loadProfile() {
    const user = profileState.user;
    
    // Update display
    document.getElementById('profileName').textContent = user.name;
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('profileLocation').innerHTML = user.location ? 
        `<i class="fas fa-map-marker-alt"></i> ${user.location}` : 
        '<i class="fas fa-map-marker-alt"></i> Not specified';
    document.getElementById('profileWebsite').innerHTML = user.website ? 
        `<a href="${user.website}" target="_blank"><i class="fas fa-link"></i> ${user.website}</a>` : 
        '<i class="fas fa-link"></i> Not specified';
    document.getElementById('profileJoined').textContent = user.joined;
    document.getElementById('profileAvatar').src = user.avatar;
    
    // Stats
    document.getElementById('postsCount').textContent = user.posts;
    document.getElementById('followersCount').textContent = user.followers;
    document.getElementById('followingCount').textContent = user.following;
}

function attachEventListeners() {
    const bioInput = document.getElementById('editBio');
    if (bioInput) {
        bioInput.addEventListener('input', function() {
            document.getElementById('bioCount').textContent = this.value.length + '/160';
        });
    }
    
    const avatarFile = document.getElementById('avatarFile');
    if (avatarFile) {
        avatarFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    const preview = document.getElementById('avatarPreview');
                    const img = document.getElementById('previewImage');
                    img.src = event.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function handleProfileUpdate(event) {
    event.preventDefault();
    
    const updateData = {
        name: document.getElementById('editName').value,
        username: document.getElementById('editUsername').value,
        email: document.getElementById('editEmail').value,
        bio: document.getElementById('editBio').value,
        location: document.getElementById('editLocation').value,
        website: document.getElementById('editWebsite').value
    };
    
    if (!updateData.name || !updateData.email) {
        showAlert('Name and email are required', 'danger', 'updateStatus');
        return;
    }
    
    Object.assign(profileState.user, updateData);
    localStorage.setItem('userProfile', JSON.stringify(updateData));
    
    showAlert('✓ Profile updated successfully!', 'success', 'updateStatus');
    
    setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
        if (modal) modal.hide();
        location.reload();
    }, 1000);
}

function handleAvatarUpload(event) {
    event.preventDefault();
    
    const file = document.getElementById('avatarFile').files[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        showAlert('File size exceeds 5MB limit', 'danger');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        profileState.user.avatar = e.target.result;
        localStorage.setItem('userAvatar', e.target.result);
        
        showAlert('✓ Avatar uploaded successfully!', 'success');
        
        setTimeout(() => {
            location.reload();
        }, 1000);
    };
    reader.readAsDataURL(file);
}

function showAlert(message, type = 'info', containerId = null) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = message;
    
    if (containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
            container.appendChild(alertDiv);
        }
    } else {
        const tempContainer = document.createElement('div');
        tempContainer.className = 'position-fixed top-0 end-0 p-3';
        tempContainer.style.zIndex = '9999';
        tempContainer.appendChild(alertDiv);
        document.body.appendChild(tempContainer);
        
        setTimeout(() => tempContainer.remove(), 3000);
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.clear();
        window.location.href = 'index.html';
    }
}