async function requireAuth() {
  const token = getAuthToken();
  if (!token) {
    window.location.href = '/login.html';
    return;
  }

  try {
    await requestJson('/api/auth/me');
  } catch (error) {
    window.location.href = '/login.html';
  }
}

requireAuth();

