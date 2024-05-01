document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signup-form');
  
    signupForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const username = event.target.elements.username.value;
      const email = event.target.elements.email.value;
      const password = event.target.elements.password.value;
      console.log(`username: ${username}, ${email} and pwd: : ${password}`);
  
      try {
        const response = await fetch('/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ username, email, password })
        });
  
        if (!response.ok) {
          throw new Error('Sign-up failed');
        }
  
        // Handle successful sign-up (e.g., redirect to sign-in page)
        window.location.href = '/signin.html';
      } catch (error) {
        console.error('Error:', error);
        // Handle sign-up error (e.g., display an error message)
      }
    });
  });
  