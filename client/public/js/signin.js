document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('signin-form');
  
    signinForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const username = event.target.elements.username.value;
      const password = event.target.elements.password.value;
  
      try {
        const response = await fetch('/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, password })
        });
  
        if (!response.ok) {
          throw new Error('Sign-in failed');
        }
  
        const data = await response.json();
        localStorage.setItem('username', data.username); // Store username in local storage
  
        // Redirect to profile page
        window.location.href = '/profile.html';
      } catch (error) {
        console.error('Error:', error);
        // Handle sign-in error (e.g., display an error message)
      }
    });
  });
