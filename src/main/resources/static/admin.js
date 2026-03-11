const pendingList = document.querySelector('#pending-list');
const userList = document.querySelector('#user-list');

function renderPending(users) {
  pendingList.innerHTML = '';
  if (!users.length) {
    pendingList.append(createTextElement('li', i18n.t('admin_none_pending')));
    return;
  }

  users.forEach((user) => {
    const li = document.createElement('li');
    const main = createTextElement('div', `${user.username} (${user.status})`, 'item-main');
    const approve = createTextElement('button', i18n.t('admin_approve'), 'delete-btn');
    approve.style.background = '#16a34a';
    approve.dataset.id = user.id;

    const reject = createTextElement('button', i18n.t('admin_reject'), 'delete-btn');
    reject.style.background = '#dc2626';
    reject.dataset.id = user.id;

    approve.addEventListener('click', () => handlePendingAction(user.id, 'approve'));
    reject.addEventListener('click', () => handlePendingAction(user.id, 'reject'));

    li.append(main, approve, reject);
    pendingList.append(li);
  });
}

function renderUsers(users) {
  userList.innerHTML = '';
  if (!users.length) {
    userList.append(createTextElement('li', i18n.t('admin_none_users')));
    return;
  }

  users.forEach((user) => {
    const li = document.createElement('li');
    const main = createTextElement('div', `${user.username} (${user.status})`, 'item-main');

    const roleSelect = document.createElement('select');
    roleSelect.innerHTML = `
      <option value="USER">${i18n.t('admin_role_user')}</option>
      <option value="ADMIN">${i18n.t('admin_role_admin')}</option>
    `;
    roleSelect.value = user.role;
    roleSelect.addEventListener('change', () => updateRole(user.id, roleSelect.value));

    const deleteBtn = createTextElement('button', i18n.t('admin_delete'), 'delete-btn');
    deleteBtn.addEventListener('click', () => deleteUser(user.id));

    li.append(main, roleSelect, deleteBtn);
    userList.append(li);
  });
}

async function loadPending() {
  const users = await requestJson('/api/admin/users/pending');
  renderPending(users);
}

async function loadUsers() {
  const users = await requestJson('/api/admin/users');
  renderUsers(users);
}

async function handlePendingAction(id, action) {
  try {
    await requestJson(`/api/admin/users/${id}/${action}`, { method: 'POST' });
    await Promise.all([loadPending(), loadUsers()]);
  } catch (error) {
    if (!isUnauthorizedError(error)) alert(error.message);
  }
}

async function updateRole(id, role) {
  try {
    await requestJson(`/api/admin/users/${id}/role?role=${encodeURIComponent(role)}`, { method: 'POST' });
    await loadUsers();
  } catch (error) {
    if (!isUnauthorizedError(error)) alert(error.message);
  }
}

async function deleteUser(id) {
  if (!confirm(i18n.t('admin_delete_confirm'))) return;
  try {
    await requestJson(`/api/admin/users/${id}`, { method: 'DELETE' });
    await Promise.all([loadPending(), loadUsers()]);
  } catch (error) {
    if (!isUnauthorizedError(error)) alert(error.message);
  }
}

Promise.all([loadPending(), loadUsers()]).catch((error) => {
  if (!isUnauthorizedError(error)) alert(error.message);
});
