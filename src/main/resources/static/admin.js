const pendingList = document.querySelector('#pending-list');

function renderPending(users) {
  pendingList.innerHTML = '';
  if (!users.length) {
    pendingList.append(createTextElement('li', 'No pending users.'));
    return;
  }

  users.forEach((user) => {
    const li = document.createElement('li');
    const main = createTextElement('div', `${user.username} (${user.status})`, 'item-main');
    const approve = createTextElement('button', 'Approve', 'delete-btn');
    approve.style.background = '#16a34a';
    approve.dataset.id = user.id;

    const reject = createTextElement('button', 'Reject', 'delete-btn');
    reject.style.background = '#dc2626';
    reject.dataset.id = user.id;

    approve.addEventListener('click', () => handleAction(user.id, 'approve'));
    reject.addEventListener('click', () => handleAction(user.id, 'reject'));

    li.append(main, approve, reject);
    pendingList.append(li);
  });
}

async function loadPending() {
  const users = await requestJson('/api/admin/users/pending');
  renderPending(users);
}

async function handleAction(id, action) {
  try {
    await requestJson(`/api/admin/users/${id}/${action}`, { method: 'POST' });
    await loadPending();
  } catch (error) {
    if (!isUnauthorizedError(error)) alert(error.message);
  }
}

loadPending().catch((error) => {
  if (!isUnauthorizedError(error)) alert(error.message);
});

