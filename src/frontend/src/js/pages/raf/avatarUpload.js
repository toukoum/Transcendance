

export function avatarUpload(){
    const avatarForm = document.getElementById("avatarForm");
    avatarForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const formData = new FormData();
      const avatarInput = document.getElementById("avatarInput");
      if (avatarInput.files.length > 0) {
          formData.append('avatar', avatarInput.files[0]);

          // Replace `yourAccessToken` with your actual access token and adjust the URL as needed
          fetch('http://localhost:8000/v1/avatar/upload/', {
              method: 'POST',
              body: formData,
              credentials: "include"
          })
          .then(response => response.json())
          .then(data => {
              alert("Avatar uploaded successfully!");
          })
          .catch((error) => {
              console.error('Error:', error);
              alert("Error uploading avatar.");
          });
      } else {
          alert("Please select a file to upload.");
      }
    });

}