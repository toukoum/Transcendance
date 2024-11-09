const API_BASE_URL = 'http://localhost:8000/v1/';
let userInfo;

async function fetchUserInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}me/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if (response.ok) {
            userInfo = await response.json();  // Await the promise from response.json()
            console.log('User Info:', userInfo);
        } else {
            console.error('User Info Error:', response);
            userInfo = { error: 'Unable to fetch user information' };
        }

    } catch (error) {
        userInfo = { error: 'Network Error' };
        console.error('Network Error:', error);
    }

    // Update the DOM with user information
    document.getElementById('user-info').textContent = JSON.stringify(userInfo, null, 2);  // Pretty print the JSON
}

// Call the async function
fetchUserInfo();



document.getElementById('avatar-form').addEventListener('submit', async function(event) {
    event.preventDefault();  // Empêche le rechargement de la page
    
    const avatarInput = document.getElementById('avatar');
    const statusMessage = document.getElementById('status-message');
    
    if (avatarInput.files.length === 0) {
        statusMessage.textContent = "Veuillez sélectionner une image.";
        return;
    }
    
    const formData = new FormData();
    formData.append('avatar', avatarInput.files[0]);

    try {
        const response = await fetch('http://localhost:8000/v1/me/', {
            method: 'PATCH',
            credentials: 'include',
            body: formData
        });

        if (response.ok) {
            statusMessage.textContent = "Avatar mis à jour avec succès !";
        } else {
            statusMessage.textContent = "Échec de la mise à jour de l'avatar.";
        }
    } catch (error) {
        console.error("Erreur lors de la requête :", error);
        statusMessage.textContent = "Erreur réseau lors de la mise à jour.";
    }
});