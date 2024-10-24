const API_BASE_URL = 'http://localhost:8000/v1/auth/';
let userInfo;

async function fetchUserInfo() {
    try {
        const response = await fetch(`${API_BASE_URL}user/`, {
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



// async function fetch42UserInfo(){
//     try {
//         const response = await fetch('', {
//             method: 'GET',
//             headers: {
// }
