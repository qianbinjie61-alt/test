const card = document.querySelector('#memo-detail-card');

async function loadMemo() {
  const id = getIdFromQuery();
  if (!id) {
    card.innerHTML = '';
    card.append(createTextElement('p', '缺少备忘录 ID。'));
    return;
  }

  try {
    const memo = await requestJson(`/api/memos/${id}`);
    card.innerHTML = '';

    card.append(createTextElement('h2', `备忘录 #${memo.id}`));
    card.append(createTextElement('p', memo.content, 'detail-content'));
    card.append(createTextElement('p', `创建时间：${toLocalTime(memo.createdAt)}`, 'item-meta'));

    const deleteBtn = createTextElement('button', '删除这条备忘', 'delete-btn');
    deleteBtn.type = 'button';
    deleteBtn.addEventListener('click', async () => {
      await requestJson(`/api/memos/${memo.id}`, { method: 'DELETE' });
      window.location.href = '/memos.html';
    });
    card.append(deleteBtn);
  } catch (error) {
    card.innerHTML = '';
    card.append(createTextElement('p', error.message));
  }
}

loadMemo();
