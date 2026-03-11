function getAuthToken() {
  return localStorage.getItem('auth_token');
}

function setAuthToken(token) {
  if (!token) {
    localStorage.removeItem('auth_token');
    return;
  }
  localStorage.setItem('auth_token', token);
}

async function requestJson(url, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getAuthToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch(url, {
    headers,
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (response.status === 401 && window.location.pathname !== '/login.html') {
    window.location.href = '/login.html';
    const err = new Error('unauthorized');
    err.silent = true;
    throw err;
  }
  if (!response.ok) {
    throw new Error(data.message || 'request failed');
  }
  return data;
}

function isUnauthorizedError(error) {
  return Boolean(error && error.silent === true);
}

function toLocalTime(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleString('zh-CN');
}

function getIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function createTextElement(tag, text, className) {
  const el = document.createElement(tag);
  el.textContent = text;
  if (className) el.className = className;
  return el;
}
