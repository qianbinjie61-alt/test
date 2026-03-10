const card = document.querySelector('#memo-detail-card');

async function loadMemoDetail() {
  const id = getIdFromQuery();
  if (!id) {
    card.innerHTML = '<p>缺少备忘录 ID。</p>';
    return;
  }

  try {
    const memo = await requestJson(`/api/memos/${id}`);
    card.innerHTML = `
      <h2>备忘录 #${memo.id}</h2>
      <p class="detail-content">${memo.content}</p>
      <p class="item-meta">创建时间：${toLocalTime(memo.createdAt)}</p>
    `;
  } catch (error) {
    card.innerHTML = `<p>${error.message}</p>`;
  }
}

loadMemoDetail();
