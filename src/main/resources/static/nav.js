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
      adminLink.textContent = i18n.t('nav_admin');
      actions.appendChild(adminLink);
    }

    const langBtn = document.createElement('button');
    langBtn.type = 'button';
    langBtn.textContent = i18n.t('nav_lang');
    langBtn.addEventListener('click', () => {
      const next = i18n.getLanguage() === 'zh' ? 'en' : 'zh';
      i18n.setLanguage(next);
      window.location.reload();
    });
    actions.appendChild(langBtn);

    const logoutBtn = document.createElement('button');
    logoutBtn.type = 'button';
    logoutBtn.textContent = i18n.t('nav_logout');
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
