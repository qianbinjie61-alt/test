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
    registerMessage.textContent = i18n.t('login_error_required');
    return;
  }

  try {
    const user = await requestJson('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    if (user.status === 'ACTIVE') {
      registerMessage.textContent = i18n.t('register_success');
    } else {
      registerMessage.textContent = i18n.t('register_pending');
    }
    registerForm.reset();
  } catch (error) {
    registerMessage.textContent = error.message || i18n.t('register_failed');
  }
});
