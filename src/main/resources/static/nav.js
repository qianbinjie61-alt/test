const navBar = document.querySelector('#nav-bar');

async function loadNav() {
  if (!navBar) return;
  try {
    const user = await requestJson('/api/auth/me');
    const isAdmin = user.role === 'ADMIN';
    navBar.innerHTML = '';

    const userSpan = document.createElement('span');
    userSpan.className = 'nav-user';
    userSpan.textContent = `${user.username} (${user.role})`;

    const actions = document.createElement('div');
    actions.className = 'nav-actions';

    if (isAdmin) {
      const adminLink = document.createElement('a');
      adminLink.href = '/admin.html';
      adminLink.textContent = 'Admin';
      actions.appendChild(adminLink);
    }

    const logoutBtn = document.createElement('button');
    logoutBtn.type = 'button';
    logoutBtn.textContent = 'Logout';
    logoutBtn.addEventListener('click', async () => {
      try {
        await requestJson('/api/auth/logout', { method: 'POST' });
      } catch {
      } finally {
        setAuthToken(null);
        window.location.href = '/login.html';
      }
    });
    actions.appendChild(logoutBtn);

    navBar.append(userSpan, actions);
  } catch (error) {
    if (!isUnauthorizedError(error)) {
      console.error(error);
    }
  }
}

loadNav();

