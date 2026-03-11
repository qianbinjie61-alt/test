const form = document.querySelector('#login-form');
const usernameEl = document.querySelector('#login-username');
const passwordEl = document.querySelector('#login-password');
const errorEl = document.querySelector('#login-error');

async function ensureApiHelpers() {
  if (typeof setAuthToken === 'function' && typeof requestJson === 'function') return;

  await new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `/api.js?ts=${Date.now()}`;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  }).catch(() => {});

  if (typeof setAuthToken !== 'function' || typeof requestJson !== 'function') {
    errorEl.textContent = 'API helpers not loaded. Please refresh the page.';
    throw new Error('api helpers not loaded');
  }
}

async function redirectIfLoggedIn() {
  await ensureApiHelpers();
  const token = getAuthToken();
  if (!token) return;
  try {
    await requestJson('/api/auth/me');
    window.location.href = '/';
  } catch (error) {
    setAuthToken(null);
  }
}

redirectIfLoggedIn();

form.addEventListener('submit', async (event) => {
  await ensureApiHelpers();
  event.preventDefault();
  errorEl.textContent = '';

  const username = usernameEl.value.trim();
  const password = passwordEl.value;
  if (!username || !password) {
    errorEl.textContent = 'Username and password required.';
    return;
  }

  try {
    const data = await requestJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    setAuthToken(data.token);
    window.location.href = '/';
  } catch (error) {
    errorEl.textContent = error.message || 'Login failed.';
  }
});
