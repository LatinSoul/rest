document.addEventListener('DOMContentLoaded', () => {
    const usernameSpan = document.getElementById('username');
    const user = localStorage.getItem('username')
    console.log(user)
    try {
      if (user) {
        usernameSpan.textContent = user;
      } else {
        throw new Error('User not found'); // Manually throw an error
      }
    } catch (error) {
      console.error('Error:', error); // Log the error message
      usernameSpan.textContent = 'Error fetching username'; // Handle the error gracefully
    }
    

    // Fetch username from the server response
    // fetch('/profile')
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error('Failed to fetch user information');
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     // Update the username in the HTML
    //     if (data.username) {
    //       usernameSpan.textContent = data.username;
    //     } else {
    //       throw new Error('Username not found in response');
    //     }
    //   })
    //   .catch(error => {
    //     console.error('Error:', error);
    //     usernameSpan.textContent = 'Error fetching username';
    //   });
  });
  