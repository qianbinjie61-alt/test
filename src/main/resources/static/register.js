const registerForm = document.querySelector('#register-form');
const registerUsername = document.querySelector('#register-username');
const registerPassword = document.querySelector('#register-password');
const registerMessage = document.querySelector('#register-message');

registerForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  registerMessage.textContent = '';

  const username = registerUsername.value.trim();
  const password = registerPassword.value;
  if (!username || !password) {
    registerMessage.textContent = 'Username and password required.';
    return;
  }

  try {
    const user = await requestJson('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (user.status === 'ACTIVE') {
      registerMessage.textContent = 'Registration successful. You can login now.';
    } else {
      registerMessage.textContent = 'Registration submitted. Please wait for admin approval.';
    }
    registerForm.reset();
  } catch (error) {
    registerMessage.textContent = error.message || 'Registration failed.';
  }
});

