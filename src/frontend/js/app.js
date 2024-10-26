const API_BASE_URL = "http://localhost:8000/v1/auth/";

// Handle Registration
document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password1 = document.getElementById('password1').value;
    const password2 = document.getElementById('password2').value;

    const response = await fetch(`${API_BASE_URL}register/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password1, password2 }),
    });

    console.log( JSON.stringify({ email, username, password1, password2 }))
    const result = await response.json();
    document.getElementById('registerMessage').textContent = JSON.stringify(result);
});

// Handle Login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch(`${API_BASE_URL}login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });


        if (response.ok) {  // Check if response status is 200 (success)
            const result = await response.json();
            // afficher le header de la reponse

            console.log(response.headers);
            console.log("OUAIS");
            window.location.href = "./account.html";  // Redirect to the account/dashboard page
        } else {
            // Handle errors or incorrect login (e.g., 400 or 401 response)
            const errorResult = await response.json();
            document.getElementById('loginMessage').textContent = errorResult.detail || 'Login failed';
        }
    } catch (error) {
        console.error('Error during login:', error);
        document.getElementById('loginMessage').textContent = 'An error occurred during login.';
    }
});




// Handle Password Reset
document.getElementById('passwordResetForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;

    const response = await fetch(`${API_BASE_URL}password/reset/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
    });

    const result = await response.json();
    document.getElementById('passwordResetMessage').textContent = JSON.stringify(result);
});



