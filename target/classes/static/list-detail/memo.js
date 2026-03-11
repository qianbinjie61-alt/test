const card = document.querySelector('#memo-detail-card');

async function loadMemo() {
  const id = getIdFromQuery();
  if (!id) return (card.textContent = '缺少备忘录 ID。');
  try {
    const memo = await requestJson(`/api/memos/${id}`);
    card.innerHTML = '';
    card.append(createTextElement('h2', `备忘录 #${memo.id}`));
    card.append(createTextElement('p', memo.content, 'detail-content'));
    card.append(createTextElement('p', `创建时间：${toLocalTime(memo.createdAt)}`, 'item-meta'));
  } catch (e) {
    card.textContent = e.message;
  }
}
loadMemo();
