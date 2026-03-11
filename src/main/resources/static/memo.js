const card = document.querySelector('#memo-detail-card');

async function loadMemo() {
  const id = getIdFromQuery();
  if (!id) {
    card.innerHTML = '';
    card.append(createTextElement('p', i18n.t('memo_missing_id')));
    return;
  }

  try {
    const memo = await requestJson(`/api/memos/${id}`);
    card.innerHTML = '';

    card.append(createTextElement('h2', i18n.t('memo_detail_id', { id: memo.id })));
    card.append(createTextElement('p', memo.content, 'detail-content'));
    card.append(createTextElement('p', i18n.t('memos_created', { time: toLocalTime(memo.createdAt) }), 'item-meta'));

    const deleteBtn = createTextElement('button', i18n.t('memo_delete_one'), 'delete-btn');
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
