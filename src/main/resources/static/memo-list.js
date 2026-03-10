const memoForm = document.querySelector('#memo-form');
const memoContent = document.querySelector('#memo-content');
const memoList = document.querySelector('#memo-list');

function renderMemos(memos) {
  memoList.innerHTML = '';

  if (!memos.length) {
    const empty = document.createElement('li');
    empty.textContent = '暂无备忘。';
    memoList.append(empty);
    return;
  }

  memos.forEach((memo) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="item-main">
        <a class="item-link" href="/memo-detail.html?id=${memo.id}">${memo.content}</a>
        <div class="item-meta">创建时间：${toLocalTime(memo.createdAt)}</div>
      </div>
      <button class="delete-btn" data-id="${memo.id}" type="button">删除</button>
    `;
    memoList.append(li);
  });
}

async function renderAll() {
  const memos = await requestJson('/api/memos');
  renderMemos(memos);
}

memoForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const content = memoContent.value.trim();
  if (!content) return;

  try {
    await requestJson('/api/memos', {
      method: 'POST',
      body: JSON.stringify({ content })
    });
    memoForm.reset();
    await renderAll();
  } catch (error) {
    alert(error.message);
  }
});

memoList.addEventListener('click', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.classList.contains('delete-btn')) {
    try {
      await requestJson(`/api/memos/${target.dataset.id}`, { method: 'DELETE' });
      await renderAll();
    } catch (error) {
      alert(error.message);
    }
  }
});

renderAll().catch((error) => alert(error.message));
