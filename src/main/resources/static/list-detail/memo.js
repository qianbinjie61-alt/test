const card = document.querySelector('#memo-detail-card');

async function loadMemo() {
  const id = getIdFromQuery();
  if (!id) return (card.textContent = i18n.t('memo_missing_id'));
  try {
    const memo = await requestJson(`/api/memos/${id}`);
    card.innerHTML = '';
    card.append(createTextElement('h2', i18n.t('memo_detail_id', { id: memo.id })));
    card.append(createTextElement('p', memo.content, 'detail-content'));
    card.append(createTextElement('p', i18n.t('memos_created', { time: toLocalTime(memo.createdAt) }), 'item-meta'));
  } catch (e) {
    card.textContent = e.message;
  }
}
loadMemo();
